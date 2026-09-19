/**
 * The Learn Zone — cross-device sync backend (generic key/value store).
 *
 * Paste this into a Google Sheet's Apps Script editor and deploy as a Web App
 * (Execute as: Me, Who has access: Anyone) — see SETUP-Sync.md for the full
 * walkthrough. Once deployed, send the /exec URL back so it can be wired into
 * plan/lz-sync.js.
 *
 * This is the one and only sync backend. (An older dashboard/ view with its own
 * backend and its own storage format was retired on 2026-09-19 — it only tracked a
 * single boolean per lesson id, and having two formats in one key namespace was a
 * standing hazard.) This stores ANY localStorage key/value pair this app uses — lesson check-offs, notes, daily habits, day outings, journal entries,
 * teacher-inserted manual lessons, custom lesson order, etc. Every key carries
 * its own "updated" timestamp; whichever device wrote a key most recently wins
 * if two devices ever touch the same key.
 */

function doGet(e)  { return handle(e); }
function doPost(e) { return handle(e); }

function handle(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var sh = getSheet_();
    var p = (e && e.parameter) || {};
    var action = p.action || 'get';

    if (action === 'set') {
      // The timestamp is assigned HERE, by the server's clock — never taken from the
      // client. Devices' clocks routinely differ by seconds or minutes, and comparing
      // timestamps written by two different clocks makes "last write wins" unreliable:
      // the device whose clock runs ahead would always win, so the other device's edits
      // could be silently discarded forever. One authoritative clock avoids that
      // entirely. The assigned value is returned so the client can record it.
      var stamp = Date.now();
      var items = readItems_(e);
      items.forEach(function (it) {
        if (it && it.key) upsert_(sh, String(it.key), it.value, !!it.deleted, stamp);
      });
      return json_({ ok: true, count: items.length, updated: stamp });
    }

    // default: return everything changed after ?since= (0 / omitted = everything)
    var since = Number(p.since || 0);
    var data = sh.getDataRange().getValues();
    var out = {};
    var maxUpdated = since;
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var key = String(row[0] || '');
      if (!key) continue;
      var updated = Number(row[3] || 0);
      if (updated > maxUpdated) maxUpdated = updated;
      if (updated <= since) continue;
      var deleted = row[2] === true || row[2] === 'TRUE';
      out[key] = { value: deleted ? null : cellToString_(row[1]), deleted: deleted, updated: updated };
    }
    return json_({ ok: true, items: out, serverTime: Date.now(), maxUpdated: maxUpdated });
  } finally {
    lock.releaseLock();
  }
}

// Writes normally arrive one key at a time as GET query params (the client can't use
// POST — Apps Script answers via a redirect, and browsers drop a POST body when they
// follow one). A JSON POST body is still accepted as a fallback for any other caller.
// Note the client-supplied `updated`, if any, is deliberately ignored — handle()
// stamps every write with the server's own clock instead.
function readItems_(e) {
  if (e && e.postData && e.postData.contents) {
    try {
      var body = JSON.parse(e.postData.contents);
      if (body && body.items) return body.items;
    } catch (err) { /* fall through */ }
  }
  var p = (e && e.parameter) || {};
  if (p.key) return [{ key: p.key, value: p.value || '', deleted: p.deleted === '1' }];
  return [];
}

/**
 * Give back exactly the text the client stored.
 *
 * The client writes plain strings, but a Sheet does not necessarily keep them that way: a
 * value like "2026-09-19" gets auto-parsed into a real date cell, and getValues() then hands
 * back a Date object whose String() form is "Sat Sep 19 2026 00:00:00 GMT-0400 (Eastern
 * Daylight Time)". Every completion date that round-tripped through sync came back in that
 * shape, so the app's `doneDate(key) === todayISO()` check quietly failed and a lesson checked
 * off today stopped counting as done today. Numbers get the same treatment (a value of "5"
 * coming back as 5 is harmless, but "5.0" would not be).
 *
 * upsert_ now writes the value column as plain text so this stops happening going forward;
 * this function repairs the cells that were already coerced before that change.
 */
function cellToString_(v) {
  if (v instanceof Date) {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return String(v);
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName('sync');
  if (!sh) sh = ss.insertSheet('sync');
  if (sh.getLastRow() === 0) sh.appendRow(['key', 'value', 'deleted', 'updated', 'prevValue']);
  // Existing sheets predate the 5th column — add the header in place, without touching
  // any data rows. Column E stays blank on those rows until the next delete populates it.
  if (sh.getLastColumn() < 5) sh.getRange(1, 5).setValue('prevValue');
  return sh;
}

// Last-write-wins, where "last" means the order writes actually arrived at this
// script — since `updated` now always comes from the server's own clock (see
// handle()), a later arrival always carries a later timestamp, so whichever device
// wrote most recently genuinely wins. Requests are serialized by the LockService
// lock in handle(), so two devices writing the same key can't interleave.
// Column E ("prevValue") is a server-side undo buffer for deletes. A delete blanks
// column B, so without this the value is simply gone and only the Sheet's own version
// history can bring it back. On every delete we copy the value being destroyed into E
// first; a non-delete write clears E, so E only ever holds "what this key was when it
// was deleted." Restoring a bad tombstone is then: copy E back to B, set C to FALSE.
function upsert_(sh, key, value, deleted, updated) {
  var last = sh.getLastRow();
  if (last > 1) {
    var keys = sh.getRange(2, 1, last - 1, 1).getValues();
    for (var r = 0; r < keys.length; r++) {
      if (String(keys[r][0]) === key) {
        var rowNum = r + 2;
        var prev = '';
        if (deleted) {
          var existing = sh.getRange(rowNum, 2, 1, 4).getValues()[0];
          var wasDeleted = existing[1] === true || existing[1] === 'TRUE';
          // Deleting an already-deleted key must not overwrite the saved value with ''.
          prev = wasDeleted ? existing[3] : existing[0];
        }
        // Plain-text format on the value columns, so a date-shaped or number-shaped string
        // is stored as the literal text the client sent rather than being coerced into a
        // Date or a number (see cellToString_).
        sh.getRange(rowNum, 2).setNumberFormat('@');
        sh.getRange(rowNum, 5).setNumberFormat('@');
        sh.getRange(rowNum, 2, 1, 4).setValues([[deleted ? '' : (value == null ? '' : value), !!deleted, updated, prev]]);
        return;
      }
    }
  }
  var newRow = sh.getLastRow() + 1;
  sh.getRange(newRow, 2).setNumberFormat('@');
  sh.getRange(newRow, 5).setNumberFormat('@');
  sh.appendRow([key, deleted ? '' : (value == null ? '' : value), !!deleted, updated, '']);
}

/**
 * Manual recovery helper — run from the Apps Script editor if a bad batch of deletions
 * ever lands again. Restores every tombstoned row that still has a saved prevValue,
 * and stamps them so every device pulls the restored values down.
 */
function restoreDeleted_() {
  var sh = getSheet_();
  var last = sh.getLastRow();
  if (last < 2) return 'nothing to restore';
  var rows = sh.getRange(2, 1, last - 1, 5).getValues();
  var stamp = Date.now();
  var n = 0;
  for (var i = 0; i < rows.length; i++) {
    var isDeleted = rows[i][2] === true || rows[i][2] === 'TRUE';
    var prev = rows[i][4];
    if (!isDeleted || prev === '' || prev == null) continue;
    sh.getRange(i + 2, 2, 1, 4).setValues([[prev, false, stamp, '']]);
    n++;
  }
  return 'restored ' + n + ' keys';
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
