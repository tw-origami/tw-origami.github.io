/**
 * The Learn Zone — cross-device sync backend (generic key/value store).
 *
 * Paste this into a Google Sheet's Apps Script editor and deploy as a Web App
 * (Execute as: Me, Who has access: Anyone) — see SETUP-Sync.md for the full
 * walkthrough. Once deployed, send the /exec URL back so it can be wired into
 * plan/lz-sync.js.
 *
 * Unlike the older dashboard/AppsScript-Code.gs (which only tracked a single
 * boolean per lesson id), this stores ANY localStorage key/value pair this app
 * uses — lesson check-offs, notes, daily habits, day outings, journal entries,
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
      var items = readItems_(e);
      items.forEach(function (it) {
        if (it && it.key) upsert_(sh, String(it.key), it.value, !!it.deleted, Number(it.updated || Date.now()));
      });
      return json_({ ok: true, count: items.length });
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
      out[key] = { value: deleted ? null : String(row[1]), deleted: deleted, updated: updated };
    }
    return json_({ ok: true, items: out, serverTime: Date.now(), maxUpdated: maxUpdated });
  } finally {
    lock.releaseLock();
  }
}

// Batch writes arrive as a JSON POST body ({items:[{key,value,deleted,updated}, ...]})
// sent with a text/plain content-type so the browser skips a CORS preflight (Apps
// Script doesn't implement doOptions). Fall back to single-item query params too,
// in case something ever calls this via a plain GET.
function readItems_(e) {
  if (e && e.postData && e.postData.contents) {
    try {
      var body = JSON.parse(e.postData.contents);
      if (body && body.items) return body.items;
    } catch (err) { /* fall through */ }
  }
  var p = (e && e.parameter) || {};
  if (p.key) return [{ key: p.key, value: p.value || '', deleted: p.deleted === '1', updated: Number(p.updated || Date.now()) }];
  return [];
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName('sync');
  if (!sh) sh = ss.insertSheet('sync');
  if (sh.getLastRow() === 0) sh.appendRow(['key', 'value', 'deleted', 'updated']);
  return sh;
}

// Last-write-wins by timestamp: a write only takes effect if its `updated` is at
// least as new as whatever's already stored for that key. This is what lets two
// devices push at nearly the same time without the "wrong" one winning.
function upsert_(sh, key, value, deleted, updated) {
  var last = sh.getLastRow();
  if (last > 1) {
    var keys = sh.getRange(2, 1, last - 1, 1).getValues();
    for (var r = 0; r < keys.length; r++) {
      if (String(keys[r][0]) === key) {
        var rowNum = r + 2;
        var existingUpdated = Number(sh.getRange(rowNum, 4).getValue() || 0);
        if (updated < existingUpdated) return; // a newer value is already stored — ignore this stale write
        sh.getRange(rowNum, 2, 1, 3).setValues([[value == null ? '' : value, !!deleted, updated]]);
        return;
      }
    }
  }
  sh.appendRow([key, value == null ? '' : value, !!deleted, updated]);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
