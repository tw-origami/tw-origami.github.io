/**
 * The Learn Zone — check-off sync backend.
 * Paste this into a Google Sheet's Apps Script editor, then deploy as a Web App.
 * It stores which lessons are checked off in a "checkoffs" tab so every computer stays in sync.
 * No accounts needed on the kids' computers — the script runs as YOU (the owner).
 */

function doGet(e)  { return handle(e); }
function doPost(e) { return handle(e); }

function handle(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(5000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName('checkoffs');
    if (!sh) { sh = ss.insertSheet('checkoffs'); }
    if (sh.getLastRow() === 0) { sh.appendRow(['lessonId', 'done', 'updated']); }

    var p = (e && e.parameter) || {};
    var action = p.action || 'get';

    if (action === 'set') {
      var id = String(p.id);
      var done = (p.done === '1' || p.done === 'true');
      upsert(sh, id, done);
      return json({ ok: true, id: id, done: done });
    }

    // default: return the full map of checked-off lessons
    var values = sh.getDataRange().getValues();
    var map = {};
    for (var i = 1; i < values.length; i++) {
      var key = String(values[i][0]);
      if (key !== '') { map[key] = (values[i][1] === true || values[i][1] === 'TRUE' || values[i][1] === 'true' || values[i][1] === 1); }
    }
    return json({ ok: true, done: map });
  } finally {
    lock.releaseLock();
  }
}

function upsert(sh, id, done) {
  var ids = sh.getRange(2, 1, Math.max(sh.getLastRow() - 1, 1), 1).getValues();
  for (var r = 0; r < ids.length; r++) {
    if (String(ids[r][0]) === id) {
      sh.getRange(r + 2, 2, 1, 2).setValues([[done, new Date()]]);
      return;
    }
  }
  sh.appendRow([id, done, new Date()]);
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
