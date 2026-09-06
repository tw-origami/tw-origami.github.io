// The Learn Zone — optional cross-device sync.
// Load this AFTER lz-common.js on any page that reads/writes progress (kidzone.html,
// calendar.html, master.html, journal.html, print.html). Does nothing at all unless
// SYNC_URL below is filled in with a deployed Google Apps Script Web App URL — see
// SETUP-Sync.md.
//
// How it works: this scans localStorage for every key starting with "lz" (that's
// everything this app stores — lesson check-offs, notes, daily habits, day outings,
// journal entries, teacher-inserted manual lessons, custom lesson order, which kid tab
// was last selected, etc.) and compares each one to what was last successfully pushed or
// pulled. Anything changed locally gets pushed up to the shared Google Sheet as soon as
// it happens; anything changed elsewhere gets pulled down and written into localStorage
// on a steady ~5s heartbeat. Each key carries its own "last updated" timestamp, so if two
// devices ever touch the same key, whichever wrote most recently wins.
//
// This file intentionally has no dependency on lz-common.js's internals — it works
// purely off the localStorage key namespace, so it never needs updating when new kinds
// of data get added (a new habit, a new manual-lesson field, etc. all just start with
// "lz" already and get swept up automatically).
(function () {
  const SYNC_URL = "https://script.google.com/macros/s/AKfycbzf5pHcdFd4Ed0Y4fQ1KXnHBnAAsRMINCLJwXt6duIxOlEkrYInGt2g8gQD0GIj1M6Ihg/exec";
  if (!SYNC_URL) return; // sync disabled — every page behaves exactly as it did before, all-local

  const META_KEY = "_lzSyncMeta";     // our own bookkeeping — deliberately NOT prefixed "lz" so it's never swept up as content
  const CURSOR_KEY = "_lzSyncCursor";
  const HEARTBEAT_MS = 3000;   // background pull, catches changes made on OTHER devices — safe to
                                // run this often now that only one frame per tab does it (see below)
  const QUICK_PUSH_MS = 250;   // debounce for pushing a change made right here, right now

  function loadMeta() { try { return JSON.parse(localStorage.getItem(META_KEY) || "{}"); } catch (e) { return {}; } }
  function saveMeta(m) { try { localStorage.setItem(META_KEY, JSON.stringify(m)); } catch (e) {} }
  function loadCursor() { return Number(localStorage.getItem(CURSOR_KEY) || 0); }
  function saveCursor(n) { try { localStorage.setItem(CURSOR_KEY, String(n)); } catch (e) {} }
  function isContentKey(k) { return typeof k === "string" && k.indexOf("lz") === 0 && k !== META_KEY && k !== CURSOR_KEY; }

  function contentKeys() {
    const out = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (isContentKey(k)) out.push(k);
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

  // --- find everything changed locally since our last known-synced state ------------
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

  // Apps Script web apps respond to every request with a redirect to the URL that
  // actually serves the content. Browsers follow that redirect automatically — but per
  // the Fetch spec, a redirected POST silently gets downgraded to a GET, and the POST
  // body is dropped in the process. That made every push look "successful" (no error)
  // while quietly writing nothing at all. GET requests don't have that problem, so
  // pushes go one key at a time as GET requests with the change encoded in the URL,
  // reusing the same single-item path the backend already supports.
  function pushOne(item) {
    const url = SYNC_URL + (SYNC_URL.indexOf("?") >= 0 ? "&" : "?") +
      "action=set" +
      "&key=" + encodeURIComponent(item.key) +
      "&value=" + encodeURIComponent(item.value == null ? "" : item.value) +
      "&deleted=" + (item.deleted ? "1" : "0") +
      "&updated=" + item.updated;
    return fetch(url, { method: "GET" }).then(r => r.ok).catch(() => false);
  }
  function pushChanges(changes) {
    if (!changes.length) return Promise.resolve(true);
    return Promise.all(changes.map(pushOne)).then(results => results.every(Boolean));
  }
  function commitPushedChanges(meta, changes) {
    changes.forEach(c => { meta[c.key] = { value: c.value, updated: c.updated, deleted: c.deleted }; });
    saveMeta(meta);
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

  // --- quick push: fires within ~250ms of an actual local write, from THIS document --
  // Independent of the heartbeat/election below — every frame gets this, since it only
  // ever reacts to a write that happened in its own document (never redundant across
  // sibling iframes), and it's what makes a check-off show up elsewhere in a couple
  // seconds instead of waiting up to a full heartbeat interval.
  let quickTimer = null;
  let quickInFlight = false;
  function quickPush() {
    if (quickInFlight) { quickTimer = setTimeout(quickPush, QUICK_PUSH_MS); return; }
    const meta = loadMeta();
    const changes = collectLocalChanges(meta);
    if (!changes.length) return;
    quickInFlight = true;
    setStatus("Syncing…");
    pushChanges(changes).then(ok => {
      if (ok) {
        commitPushedChanges(meta, changes);
        setStatus("Synced ✓ " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      } else {
        setStatus("Sync error — will retry", true);
      }
    }).finally(() => { quickInFlight = false; });
  }
  function scheduleQuickPush() {
    clearTimeout(quickTimer);
    quickTimer = setTimeout(quickPush, QUICK_PUSH_MS);
  }

  // Hook localStorage writes so a change gets queued for a quick push the moment it
  // happens, rather than waiting to be noticed by the next periodic scan. This runs in
  // every frame (not just the elected heartbeat owner below) since it only ever fires
  // for writes made in this exact document.
  try {
    // Patching the shared Storage.prototype (rather than the localStorage instance
    // itself) is the reliable way to do this — localStorage is a "legacy platform
    // object" with its own property-interception behavior, so assigning directly to
    // localStorage.setItem doesn't consistently stick across environments. Guarded by
    // `this === localStorage` so a hypothetical sessionStorage write (this app never
    // makes one) can't trigger a sync push.
    const REAL_SET = Storage.prototype.setItem;
    const REAL_REMOVE = Storage.prototype.removeItem;
    Storage.prototype.setItem = function (k, v) {
      REAL_SET.call(this, k, v);
      if (this === localStorage && isContentKey(k)) scheduleQuickPush();
    };
    Storage.prototype.removeItem = function (k) {
      REAL_REMOVE.call(this, k);
      if (this === localStorage && isContentKey(k)) scheduleQuickPush();
    };
  } catch (e) { /* if Storage.prototype can't be patched, the heartbeat below still catches everything */ }

  // --- heartbeat: full pull (+ safety-net push) on a steady interval ----------------
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
          commitPushedChanges(meta, changes);
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

  // ry.html/reid.html/teacher.html each keep 2-3 of this app's pages loaded as same-origin
  // iframes at once (e.g. ry.html has kidzone.html + calendar.html + journal.html all live
  // simultaneously, just hidden by CSS, not lazy-loaded) — every one of them would otherwise
  // run its own independent heartbeat against the exact same localStorage, tripling or
  // quadrupling pull traffic for no benefit (the quick-push reflex above already covers
  // each frame's own writes regardless). So: whichever frame's copy of this script runs
  // first in a given browser tab claims the recurring heartbeat on the shared top window;
  // sibling frames skip starting their own, but still see the results a moment later since
  // they all read/write the same localStorage. A page opened standalone (not inside any of
  // this app's iframes) is always its own top window, so it always just claims itself.
  let isHeartbeatOwner = true;
  try {
    if (window.top && window.top !== window && window.top._lzSyncOwnerActive) isHeartbeatOwner = false;
    else if (window.top) window.top._lzSyncOwnerActive = true;
  } catch (e) { /* cross-origin top (shouldn't happen on this site) — just run normally */ }

  if (isHeartbeatOwner) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => setTimeout(tick, 800));
    } else {
      setTimeout(tick, 800);
    }
    setInterval(tick, HEARTBEAT_MS);
  }

  // exposed for debugging from the browser console: LZSYNC.forceSync()
  window.LZSYNC = { forceSync: tick, quickPush: quickPush, isHeartbeatOwner: () => isHeartbeatOwner };
})();
