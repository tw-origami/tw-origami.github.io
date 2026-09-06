// The Learn Zone — optional cross-device sync.
// Load this AFTER lz-common.js on any page that reads/writes progress (kidzone.html,
// calendar.html, master.html, journal.html). Does nothing at all unless SYNC_URL below
// is filled in with a deployed Google Apps Script Web App URL — see SETUP-Sync.md.
//
// How it works: every few seconds this scans localStorage for every key starting with
// "lz" (that's everything this app stores — lesson check-offs, notes, daily habits, day
// outings, journal entries, teacher-inserted manual lessons, custom lesson order, which
// kid tab was last selected, etc.) and compares each one to what was last successfully
// pushed or pulled. Anything changed locally gets pushed up to the shared Google Sheet;
// anything changed elsewhere since our last pull gets written into localStorage here.
// Each key carries its own "last updated" timestamp, so if two devices ever touch the
// same key, whichever wrote most recently wins.
//
// This file intentionally has no dependency on lz-common.js's internals — it works
// purely off the localStorage key namespace, so it never needs updating when new kinds
// of data get added (a new habit, a new manual-lesson field, etc. all just start with
// "lz" already and get swept up automatically).
(function () {
  const SYNC_URL = ""; // paste your Apps Script /exec URL here once deployed — see SETUP-Sync.md
  if (!SYNC_URL) return; // sync disabled — every page behaves exactly as it did before, all-local

  const META_KEY = "_lzSyncMeta";     // our own bookkeeping — deliberately NOT prefixed "lz" so it's never swept up as content
  const CURSOR_KEY = "_lzSyncCursor";
  const TICK_MS = 5000;

  function loadMeta() { try { return JSON.parse(localStorage.getItem(META_KEY) || "{}"); } catch (e) { return {}; } }
  function saveMeta(m) { try { localStorage.setItem(META_KEY, JSON.stringify(m)); } catch (e) {} }
  function loadCursor() { return Number(localStorage.getItem(CURSOR_KEY) || 0); }
  function saveCursor(n) { try { localStorage.setItem(CURSOR_KEY, String(n)); } catch (e) {} }

  function contentKeys() {
    const out = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.indexOf("lz") === 0) out.push(k);
    }
    return out;
  }

  // --- a small, unobtrusive status pill (bottom-right corner) -----------------------
  let pill;
  function ensurePill() {
    if (pill) return pill;
    pill = document.createElement("div");
    pill.style.cssText = "position:fixed;right:10px;bottom:10px;z-index:99999;" +
      "font:600 11px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;" +
      "background:#fff;color:#64748b;padding:5px 10px;border-radius:999px;" +
      "box-shadow:0 4px 14px rgba(30,41,99,.15);opacity:.85;pointer-events:none;";
    document.body.appendChild(pill);
    return pill;
  }
  function setStatus(text, isError) {
    if (!document.body) return; // too early — skip, next tick will retry
    const el = ensurePill();
    el.textContent = text;
    el.style.color = isError ? "#b91c1c" : "#64748b";
  }

  // --- push: find everything changed locally since our last known-synced state ------
  function collectLocalChanges(meta) {
    const changes = [];
    const seen = new Set();
    contentKeys().forEach(k => {
      seen.add(k);
      const val = localStorage.getItem(k);
      const known = meta[k];
      if (!known || known.deleted || known.value !== val) {
        changes.push({ key: k, value: val, deleted: false, updated: Date.now() });
      }
    });
    // anything we used to know about that's no longer in localStorage was deleted locally
    Object.keys(meta).forEach(k => {
      if (!seen.has(k) && !meta[k].deleted) {
        changes.push({ key: k, value: null, deleted: true, updated: Date.now() });
      }
    });
    return changes;
  }

  function pushChanges(changes) {
    if (!changes.length) return Promise.resolve(true);
    // Sent with the default text/plain content-type (no custom headers) so the browser
    // treats this as a "simple request" and skips a CORS preflight — Apps Script web
    // apps don't implement doOptions, so a preflighted request would just fail.
    return fetch(SYNC_URL, { method: "POST", body: JSON.stringify({ items: changes }) })
      .then(r => r.ok)
      .catch(() => false);
  }

  // --- pull: ask the server for anything changed since our cursor -------------------
  function pullChanges(since) {
    const url = SYNC_URL + (SYNC_URL.indexOf("?") >= 0 ? "&" : "?") + "action=get&since=" + since;
    return fetch(url, { method: "GET" }).then(r => r.json()).catch(() => null);
  }

  function applyRemote(items, meta, cursor) {
    let newCursor = cursor;
    Object.keys(items || {}).forEach(k => {
      const item = items[k];
      const known = meta[k];
      if (known && known.updated >= item.updated) return; // we already have this exact state or something newer
      if (item.deleted || item.value === null) {
        try { localStorage.removeItem(k); } catch (e) {}
      } else {
        try { localStorage.setItem(k, item.value); } catch (e) {}
      }
      meta[k] = { value: item.deleted ? null : item.value, updated: item.updated, deleted: !!item.deleted };
      if (item.updated > newCursor) newCursor = item.updated;
    });
    return newCursor;
  }

  let inFlight = false;
  function tick() {
    if (inFlight) return;
    inFlight = true;
    const meta = loadMeta();
    const cursor = loadCursor();
    setStatus("Syncing…");
    pullChanges(cursor).then(res => {
      let newCursor = cursor;
      if (res && res.ok) {
        newCursor = applyRemote(res.items, meta, cursor);
        saveMeta(meta);
        saveCursor(newCursor);
      }
      const changes = collectLocalChanges(meta);
      return pushChanges(changes).then(ok => {
        if (ok) {
          changes.forEach(c => { meta[c.key] = { value: c.value, updated: c.updated, deleted: c.deleted }; });
          saveMeta(meta);
          setStatus("Synced ✓ " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        } else if (changes.length) {
          setStatus("Sync error — will retry", true);
        } else {
          setStatus("Synced ✓ " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        }
      });
    }).catch(() => {
      setStatus("Sync error — will retry", true);
    }).finally(() => { inFlight = false; });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setTimeout(tick, 800));
  } else {
    setTimeout(tick, 800);
  }
  setInterval(tick, TICK_MS);

  // exposed for debugging from the browser console: LZSYNC.forceSync()
  window.LZSYNC = { forceSync: tick };
})();
