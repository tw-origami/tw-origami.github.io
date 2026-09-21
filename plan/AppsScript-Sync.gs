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
  var p = (e && e.parameter) || {};
  var action = p.action || 'get';

  // A "head" check: the newest timestamp and the row count, nothing else. The client polls
  // this once a second or so and only does a real pull when one of the two changes, which
  // is what makes near-live sync affordable — a full pull is ~35KB and several seconds,
  // this reads a single column and returns ~60 bytes.
  //
  // Deliberately takes NO lock and never calls getSheet_() (which can write a header or a
  // cell format). Reads used to sit behind the same script lock as writes, so every device's
  // poll queued behind every other device's poll AND behind every single-key write —
  // four browsers polling was enough to push a round-trip to 16 seconds.
  if (action === 'head') {
    var shH = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('sync');
    if (!shH || shH.getLastRow() < 2) return json_({ ok: true, maxUpdated: 0, count: 0 });
    var stamps = shH.getRange(2, 4, shH.getLastRow() - 1, 1).getValues();
    var maxH = 0;
    for (var s = 0; s < stamps.length; s++) {
      var n = Number(stamps[s][0] || 0);
      if (n > maxH) maxH = n;
    }
    return json_({ ok: true, maxUpdated: maxH, count: stamps.length });
  }

  // Reads don't take the lock either. A read that races a write sees either the old or the
  // new row — both are states the client already handles, and the next poll catches up.
  // Matched explicitly rather than as "anything that isn't a set", so later actions below
  // are actually reachable.
  if (action === 'get') {
    var shR = getSheet_();
    var since = Number(p.since || 0);
    var dataR = shR.getDataRange().getValues();
    var outR = {};
    var maxUpdatedR = since;
    for (var r = 1; r < dataR.length; r++) {
      var rowR = dataR[r];
      var keyR = String(rowR[0] || '');
      if (!keyR) continue;
      var updR = Number(rowR[3] || 0);
      if (updR > maxUpdatedR) maxUpdatedR = updR;
      if (updR <= since) continue;
      var delR = rowR[2] === true || rowR[2] === 'TRUE';
      outR[keyR] = { value: delR ? null : cellToString_(rowR[1]), deleted: delR, updated: updR };
    }
    return json_({ ok: true, items: outR, serverTime: Date.now(), maxUpdated: maxUpdatedR });
  }

  // --- reading pages -------------------------------------------------------------------
  // Article text lives in its own sheet, NOT in the key/value store the app syncs. A
  // pasted article is 10k-50k characters; the sync pushes every value as a GET query
  // parameter batched under ~1800 characters, so putting one there would break the push
  // outright. Kept apart, an article costs the sync nothing: the key/value store holds
  // only the short document id.
  if (action === 'doc') {
    var docsR = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('docs');
    if (!docsR || docsR.getLastRow() < 2) return json_({ ok: false, error: 'not found' });
    var rowsR = docsR.getRange(2, 1, docsR.getLastRow() - 1, 5).getValues();
    for (var i = 0; i < rowsR.length; i++) {
      if (String(rowsR[i][0]) === String(p.id)) {
        return json_({ ok: true, id: p.id, title: cellToString_(rowsR[i][1]),
                       source: cellToString_(rowsR[i][2]), updated: Number(rowsR[i][3] || 0),
                       body: cellToString_(rowsR[i][4]) });
      }
    }
    return json_({ ok: false, error: 'not found' });
  }

  if (action === 'docput') {
    var lockD = LockService.getScriptLock();
    lockD.tryLock(10000);
    try {
      // Written in pieces: a GET URL can't carry a whole article, so the client sends it
      // as numbered chunks. seq 0 starts the document over; later chunks append.
      var docs = getDocsSheet_();
      var id = String(p.id || '').trim();
      if (!id) return json_({ ok: false, error: 'missing id' });
      var seq = Number(p.seq || 0);
      var chunk = String(p.chunk || '');
      var row = findDocRow_(docs, id);
      if (!row) {
        docs.appendRow([id, String(p.title || ''), String(p.source || ''), Date.now(), '']);
        row = docs.getLastRow();
        docs.getRange(row, 5).setNumberFormat('@');
        docs.getRange(row, 2).setNumberFormat('@');
      }
      var body = seq === 0 ? '' : cellToString_(docs.getRange(row, 5).getValue());
      body += chunk;
      if (body.length > 45000) return json_({ ok: false, error: 'too long', length: body.length });
      docs.getRange(row, 5).setValue(body);
      if (p.title) docs.getRange(row, 2).setValue(String(p.title));
      if (p.source) docs.getRange(row, 3).setValue(String(p.source));
      docs.getRange(row, 4).setValue(Date.now());
      return json_({ ok: true, id: id, length: body.length, seq: seq });
    } finally {
      lockD.releaseLock();
    }
  }

  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var sh = getSheet_();

    if (action === 'set') {
      // The timestamp is assigned HERE, by the server's clock — never taken from the
      // client. Devices' clocks routinely differ by seconds or minutes, and comparing
      // timestamps written by two different clocks makes "last write wins" unreliable:
      // the device whose clock runs ahead would always win, so the other device's edits
      // could be silently discarded forever. One authoritative clock avoids that
      // entirely. The assigned value is returned so the client can record it.
      var stamp = Date.now();
      var items = readItems_(e);
      // Build the key -> row index once for the whole request. upsert_ used to rescan the
      // whole key column for every single item, so a batch of 20 meant 20 full scans.
      var index = buildIndex_(sh);
      items.forEach(function (it) {
        if (it && it.key) upsert_(sh, index, String(it.key), it.value, !!it.deleted, stamp);
      });
      return json_({ ok: true, count: items.length, updated: stamp });
    }
    return json_({ ok: false, error: 'unknown action' });
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
  // Batched form: ?action=set&items=<url-encoded JSON array>. Each request takes the script
  // lock and costs a full Apps Script round trip (several seconds), so pushing 20 keys one
  // per request meant 20 serialized round trips — which is what made the first sync after a
  // merge take minutes and starve everyone else's polls.
  if (p.items) {
    try {
      var arr = JSON.parse(p.items);
      if (arr && arr.length) return arr;
    } catch (err) { /* fall through to the single-key form */ }
  }
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

function getDocsSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName('docs');
  if (!sh) sh = ss.insertSheet('docs');
  if (sh.getLastRow() === 0) sh.appendRow(['id', 'title', 'source', 'updated', 'body']);
  return sh;
}
function findDocRow_(sh, id) {
  var last = sh.getLastRow();
  if (last < 2) return 0;
  var ids = sh.getRange(2, 1, last - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) if (String(ids[i][0]) === id) return i + 2;
  return 0;
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
// key -> row number, read once per request so a batched write doesn't rescan per item.
function buildIndex_(sh) {
  var index = {};
  var last = sh.getLastRow();
  if (last > 1) {
    var keys = sh.getRange(2, 1, last - 1, 1).getValues();
    for (var r = 0; r < keys.length; r++) index[String(keys[r][0])] = r + 2;
  }
  return index;
}

function upsert_(sh, index, key, value, deleted, updated) {
  if (index[key]) {
    var rowNum = index[key];
    var prev = '';
    if (deleted) {
      var existing = sh.getRange(rowNum, 2, 1, 4).getValues()[0];
      var wasDeleted = existing[1] === true || existing[1] === 'TRUE';
      // Deleting an already-deleted key must not overwrite the saved value with ''.
      prev = wasDeleted ? cellToString_(existing[3]) : cellToString_(existing[0]);
    }
    // Plain-text format on the value columns, so a date-shaped or number-shaped string is
    // stored as the literal text the client sent rather than coerced into a Date or a
    // number (see cellToString_).
    sh.getRange(rowNum, 2).setNumberFormat('@');
    sh.getRange(rowNum, 5).setNumberFormat('@');
    sh.getRange(rowNum, 2, 1, 4).setValues([[deleted ? '' : (value == null ? '' : value), !!deleted, updated, prev]]);
    return;
  }
  var newRow = sh.getLastRow() + 1;
  sh.getRange(newRow, 2).setNumberFormat('@');
  sh.getRange(newRow, 5).setNumberFormat('@');
  sh.appendRow([key, deleted ? '' : (value == null ? '' : value), !!deleted, updated, '']);
  // Register it, so a batch containing the same new key twice updates the row it just
  // created instead of appending a duplicate.
  index[key] = newRow;
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
