// The Learn Zone — optional cross-device sync.
// Load this AFTER lz-common.js on any page that reads/writes progress (kidzone.html,
// calendar.html, master.html, journal.html, print.html). Does nothing at all unless
// SYNC_URL below is filled in with a deployed Google Apps Script Web App URL — see
// SETUP-Sync.md.
//
// DESIGN (rewritten 2026-09-19 after a mass-deletion incident — read this before changing
// anything here). The previous version kept a private ledger of "what I believe is synced"
// and then trusted that ledger over reality. Every failure we hit came from that:
//
//   * It inferred deletions from the ledger — a key in the ledger but missing from
//     localStorage was read as "the user deleted this." When one device's browser storage
//     was cleared from outside the app, it reported 219 deletions in 34 seconds and every
//     other device faithfully applied them.
//   * It recorded a write as successful even when the write threw, because the write was
//     wrapped in an empty catch. A device whose storage was refusing writes would sit there
//     reporting "Synced ✓" with an empty localStorage and a ledger claiming 248 keys.
//   * It pulled with a "since" cursor, so after the sheet was restored from version history
//     (which restores the original, older timestamps) every restored row looked stale and
//     was skipped forever.
//
// So the rules now are:
//
//   1. FULL RECONCILE, NEVER INCREMENTAL. Every pull asks for the entire server state. There
//      is no cursor to go stale. A device that was wiped, restored, or offline for a month
//      just re-downloads everything.
//   2. ABSENCE IS NEVER DELETION. A key missing locally means "I don't have it," and the
//      answer is to fetch it. The only thing that deletes is a real removeItem() call
//      happening live in this page — actual user intent — and even that is capped by the
//      circuit breaker below.
//   3. WRITES ARE VERIFIED. Every localStorage write is read back. A write that didn't land
//      is not recorded as synced, and the status pill says so instead of lying.
//   4. NOTHING IS CACHED. Pushes go out as GETs (Apps Script drops POST bodies on redirect),
//      and a GET is cacheable — a cached "ok" would look like a successful write that never
//      happened. Every request carries no-store plus a unique token.
//
// The net effect is that devices converge on the UNION of what everyone has. The worst case
// for a broken device is that it re-downloads; it can no longer take anyone else down with it.
(function () {
  const SYNC_URL = "https://script.google.com/macros/s/AKfycbzf5pHcdFd4Ed0Y4fQ1KXnHBnAAsRMINCLJwXt6duIxOlEkrYInGt2g8gQD0GIj1M6Ihg/exec";
  if (!SYNC_URL) return; // sync disabled — every page behaves exactly as it did before, all-local

  // Our own bookkeeping — deliberately NOT prefixed "lz" so it's never swept up as content.
  // SEEN_KEY holds, per key, the last value this device and the server agreed on. It is used
  // for ONE thing only: deciding which side changed when local and server disagree. It is
  // never consulted to decide whether something was deleted. If it's missing or wrong, the
  // worst outcome is that a conflict resolves toward the server — never data loss.
  const SEEN_KEY = "_lzSyncSeen";
  const PENDING_DEL_KEY = "_lzSyncPendingDel"; // explicit, user-intended deletes awaiting push
  const LEGACY_KEYS = ["_lzSyncMeta", "_lzSyncCursor"]; // the old ledger — removed on load

  const PULL_MS = 5000;        // full reconcile interval
  const QUICK_PUSH_MS = 250;   // debounce for pushing a change made right here, right now

  // --- deletion circuit breaker -----------------------------------------------------
  // Nothing in this app ever deletes in bulk, so a large deletion batch is always an
  // accident. Applies in both directions: we refuse to PUSH one, and we refuse to APPLY
  // one handed to us by the server.
  const MAX_DELETIONS = 10;
  const MAX_DELETION_FRACTION = 0.25;
  const MIN_DELETION_ALLOWANCE = 3;   // always allow at least this many, so a small store
                                      // isn't locked out of deleting anything at all
  function deletionAllowance(referenceCount) {
    return Math.max(MIN_DELETION_ALLOWANCE,
      Math.min(MAX_DELETIONS, Math.floor(referenceCount * MAX_DELETION_FRACTION)));
  }

  let REAL_SET, REAL_REMOVE;   // unpatched Storage methods, so applying a pulled value never
                               // loops back around as a "local edit"

  // When each key was last written by app code in THIS document. A pull takes a second or
  // two, and anything the user does in that window is newer than the answer coming back —
  // without this, a reconcile can roll back an edit made while it was in flight. That looks
  // exactly like "I checked off Reading and it jumped to the next lesson." In-memory only:
  // after a reload there is by definition no in-flight edit to protect.
  const touchedAt = Object.create(null);

  // --- storage plumbing, all of it verified ----------------------------------------
  let storageHealthy = true;   // flips false the first time a write doesn't land

  function rawGet(k) {
    try { return localStorage.getItem(k); } catch (e) { return null; }
  }
  // Write and read back. Returns true only if the value is actually there afterwards.
  // This is the fix for the "Synced ✓ over an empty localStorage" failure: a browser that
  // is refusing writes (quota, eviction, private mode, storage blocked for the origin)
  // throws or silently no-ops, and we must not record that as success.
  function safeSet(k, v) {
    try {
      (REAL_SET ? REAL_SET.call(localStorage, k, v) : localStorage.setItem(k, v));
    } catch (e) {
      storageHealthy = false;
      return false;
    }
    if (rawGet(k) !== v) { storageHealthy = false; return false; }
    return true;
  }
  function safeRemove(k) {
    try {
      (REAL_REMOVE ? REAL_REMOVE.call(localStorage, k) : localStorage.removeItem(k));
    } catch (e) {
      storageHealthy = false;
      return false;
    }
    if (rawGet(k) !== null) { storageHealthy = false; return false; }
    return true;
  }

  function isContentKey(k) {
    return typeof k === "string" && k.indexOf("lz") === 0 &&
      k !== SEEN_KEY && k !== PENDING_DEL_KEY && LEGACY_KEYS.indexOf(k) < 0;
  }
  function contentKeys() {
    const out = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (isContentKey(k)) out.push(k);
      }
    } catch (e) {}
    return out;
  }

  function loadJSON(key) { try { return JSON.parse(rawGet(key) || "{}"); } catch (e) { return {}; } }
  function saveJSON(key, obj) { safeSet(key, JSON.stringify(obj)); }
  function loadSeen() { return loadJSON(SEEN_KEY); }
  function saveSeen(s) { saveJSON(SEEN_KEY, s); }
  function loadPendingDel() { const p = loadJSON(PENDING_DEL_KEY); return p && typeof p === "object" ? p : {}; }
  function savePendingDel(p) { saveJSON(PENDING_DEL_KEY, p); }

  // The old ledger is actively harmful now (it's what stalls a restored sheet), so clear it
  // once on load rather than leaving it to confuse a future reader.
  LEGACY_KEYS.forEach(k => { if (rawGet(k) !== null) safeRemove(k); });

  // --- status pill (bottom-right corner) --------------------------------------------
  // Shows the local key count, so four browsers can be compared at a glance without
  // opening a console — that is the fastest way to see whether they actually agree.
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
    if (!document.body) return; // too early — the next tick will retry
    const el = ensurePill();
    el.textContent = text;
    el.style.color = isError ? "#b91c1c" : "#64748b";
  }
  function okStatus() {
    if (!storageHealthy) {
      setStatus("Storage blocked — this browser can't save", true);
      return;
    }
    setStatus("✓ " + contentKeys().length + " keys · " +
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  }

  // --- network ----------------------------------------------------------------------
  // Every request is uncacheable. A cached response on a push would report a write that
  // never reached the sheet, which is indistinguishable from success to the caller.
  let nonceCounter = 0;
  function api(params) {
    const url = SYNC_URL + (SYNC_URL.indexOf("?") >= 0 ? "&" : "?") + params +
      "&_=" + Date.now() + "." + (++nonceCounter);
    return fetch(url, { method: "GET", cache: "no-store" })
      .then(r => r.json())
      .catch(() => null);
  }
  function pullAll() {
    // since=0 — always the complete server state. There is no cursor by design.
    return api("action=get&since=0");
  }
  function pushValue(key, value) {
    return api("action=set&key=" + encodeURIComponent(key) +
      "&value=" + encodeURIComponent(value == null ? "" : value) + "&deleted=0")
      .then(j => (j && j.ok) ? { ok: true, key: key, value: value, updated: Number(j.updated || 0) } : { ok: false, key: key });
  }
  function pushDelete(key) {
    return api("action=set&key=" + encodeURIComponent(key) + "&value=&deleted=1")
      .then(j => (j && j.ok) ? { ok: true, key: key, deleted: true, updated: Number(j.updated || 0) } : { ok: false, key: key });
  }

  // --- the one operation: reconcile local against the full server state --------------
  let inFlight = false;
  function reconcile() {
    if (inFlight) return Promise.resolve();
    inFlight = true;
    setStatus("Syncing…");
    const pullStarted = Date.now();
    // A key the user touched after this moment is newer than anything this pull can be
    // carrying, no matter what the server says.
    const editedDuringPull = k => touchedAt[k] !== undefined && touchedAt[k] >= pullStarted;
    return pullAll().then(res => {
      if (!res || !res.ok || !res.items) { setStatus("Sync error — will retry", true); return; }

      const items = res.items;
      const seen = loadSeen();
      const pendingDel = loadPendingDel();
      const pushes = [];
      let applied = 0, refusedRemote = 0;

      // (1) Server tombstones -> remove locally, capped by the breaker. A server that has
      // somehow been mass-tombstoned again must not be able to empty this device.
      const localNow = contentKeys();
      const toRemove = Object.keys(items).filter(k =>
        items[k].deleted && isContentKey(k) && rawGet(k) !== null && !editedDuringPull(k));
      const removeAllowance = deletionAllowance(localNow.length);
      if (toRemove.length > removeAllowance) {
        refusedRemote = toRemove.length;
        try {
          console.error("[lz-sync] Refused to apply " + toRemove.length + " deletions from the " +
            "server (allowance " + removeAllowance + " of " + localNow.length + " local keys). " +
            "Nothing was removed. Check the sheet before doing anything else.", toRemove);
        } catch (e) {}
      } else {
        toRemove.forEach(k => {
          if (safeRemove(k)) { seen[k] = { deleted: true, u: items[k].updated }; applied++; }
        });
      }

      // (2) Server's live values.
      Object.keys(items).forEach(k => {
        const item = items[k];
        if (item.deleted || !isContentKey(k)) return;
        if (pendingDel[k]) return;            // we're about to delete this on purpose
        const localCur = rawGet(k);

        if (localCur === null) {
          // We simply don't have it. Absence is never a deletion — fetch it.
          if (safeSet(k, item.value)) { seen[k] = { v: item.value, u: item.updated }; applied++; }
          return;
        }
        if (localCur === item.value) { seen[k] = { v: item.value, u: item.updated }; return; }

        // Genuine disagreement. If local still matches what we last agreed on, the server
        // is the one that moved — take it. Otherwise this device has an unsent edit.
        // An edit made while this pull was in flight always wins — the pull's answer was
        // already out of date when it was sent. Checking this BEFORE the seen[] comparison
        // matters: a quick push can update seen[] to the new value first, which would
        // otherwise make a stale pull look like a legitimate server-side change and roll
        // the edit back.
        const agreed = seen[k];
        if (editedDuringPull(k)) {
          pushes.push(pushValue(k, localCur));
        } else if (agreed && agreed.v === localCur) {
          if (safeSet(k, item.value)) { seen[k] = { v: item.value, u: item.updated }; applied++; }
        } else {
          pushes.push(pushValue(k, localCur));
        }
      });

      // (3) Keys this device has that the server has never seen. This is what makes the
      // result a union rather than a takeover — months of check-offs that never synced
      // get carried up instead of being quietly dropped.
      localNow.forEach(k => {
        if (items[k] || pendingDel[k]) return;
        pushes.push(pushValue(k, rawGet(k)));
      });

      // (4) Explicit deletes queued by a real removeItem() in this page, breaker-capped.
      const delKeys = Object.keys(pendingDel);
      if (delKeys.length) {
        const allowance = deletionAllowance(Object.keys(items).length || localNow.length);
        if (delKeys.length > allowance) {
          try {
            console.error("[lz-sync] Deletion circuit breaker: refused to push " + delKeys.length +
              " deletions (allowance " + allowance + "). Dropping the request; nothing was " +
              "deleted on the server.", delKeys);
          } catch (e) {}
          savePendingDel({});   // drop the intent rather than retrying it forever
          setStatus("Blocked " + delKeys.length + " deletions", true);
        } else {
          delKeys.forEach(k => pushes.push(pushDelete(k)));
        }
      }

      if (!pushes.length) {
        saveSeen(seen);
        if (refusedRemote) setStatus("Blocked " + refusedRemote + " deletions from server", true);
        else okStatus();
        return;
      }
      return Promise.all(pushes).then(results => {
        const stillPending = loadPendingDel();
        results.forEach(r => {
          if (!r.ok) return;
          if (r.deleted) { seen[r.key] = { deleted: true, u: r.updated }; delete stillPending[r.key]; }
          else { seen[r.key] = { v: r.value, u: r.updated }; }
        });
        saveSeen(seen);
        savePendingDel(stillPending);
        if (refusedRemote) setStatus("Blocked " + refusedRemote + " deletions from server", true);
        else if (results.every(r => r.ok)) okStatus();
        else setStatus("Sync error — will retry", true);
      });
    }).catch(() => {
      setStatus("Sync error — will retry", true);
    }).finally(() => { inFlight = false; });
  }

  // --- reacting to writes made right here, right now ---------------------------------
  // A quick push covers only values; it can't delete, because it doesn't pull first and so
  // has no business deciding anything about absence. Deletes are queued as explicit intent
  // and handled by the next reconcile.
  let quickTimer = null;
  let quickInFlight = false;
  function quickPush() {
    if (quickInFlight) { quickTimer = setTimeout(quickPush, QUICK_PUSH_MS); return; }
    const seen = loadSeen();
    const changes = contentKeys().filter(k => {
      const cur = rawGet(k);
      const agreed = seen[k];
      return cur !== null && (!agreed || agreed.deleted || agreed.v !== cur);
    });
    if (!changes.length) return;
    quickInFlight = true;
    setStatus("Syncing…");
    Promise.all(changes.map(k => pushValue(k, rawGet(k)))).then(results => {
      const s = loadSeen();
      results.forEach(r => { if (r.ok) s[r.key] = { v: r.value, u: r.updated }; });
      saveSeen(s);
      if (results.every(r => r.ok)) okStatus();
      else setStatus("Sync error — will retry", true);
    }).finally(() => { quickInFlight = false; });
  }
  function scheduleQuickPush() {
    clearTimeout(quickTimer);
    quickTimer = setTimeout(quickPush, QUICK_PUSH_MS);
  }

  // Hook localStorage so a change here is noticed immediately. A removeItem() reaching this
  // hook is the ONLY thing in the system that counts as a deletion: it is an actual call,
  // made by app code, in response to something the user just did — not an inference drawn
  // from a key being absent.
  try {
    REAL_SET = Storage.prototype.setItem;
    REAL_REMOVE = Storage.prototype.removeItem;
    Storage.prototype.setItem = function (k, v) {
      REAL_SET.call(this, k, v);
      if (this === localStorage && isContentKey(k)) {
        touchedAt[k] = Date.now();
        const p = loadPendingDel();
        if (p[k]) { delete p[k]; savePendingDel(p); } // re-created before we got around to deleting it
        scheduleQuickPush();
      }
    };
    Storage.prototype.removeItem = function (k) {
      REAL_REMOVE.call(this, k);
      if (this === localStorage && isContentKey(k)) {
        touchedAt[k] = Date.now();
        const p = loadPendingDel();
        p[k] = Date.now();
        savePendingDel(p);
        scheduleQuickPush();
      }
    };
  } catch (e) { /* if Storage.prototype can't be patched, the interval below still catches everything */ }

  // ry.html/reid.html/teacher.html keep 2-3 of this app's pages loaded as same-origin iframes
  // at once, all hidden by CSS rather than lazy-loaded. Every one would otherwise run its own
  // reconcile against the same localStorage. So whichever frame's copy runs first in a tab
  // claims the recurring pull on the shared top window; siblings skip it but still see the
  // results, since they all read and write the same storage. A page opened standalone is
  // always its own top window, so it always claims itself.
  let isHeartbeatOwner = true;
  try {
    if (window.top && window.top !== window && window.top._lzSyncOwnerActive) isHeartbeatOwner = false;
    else if (window.top) window.top._lzSyncOwnerActive = true;
  } catch (e) { /* cross-origin top (shouldn't happen on this site) — just run normally */ }

  if (isHeartbeatOwner) {
    const start = () => { reconcile(); setInterval(reconcile, PULL_MS); };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(start, 300));
    else setTimeout(start, 300);
  }

  // Exposed for debugging from the browser console.
  window.LZSYNC = {
    forceSync: reconcile,
    quickPush: quickPush,
    isHeartbeatOwner: () => isHeartbeatOwner,
    storageHealthy: () => storageHealthy,
    // LZSYNC.report() — what this browser actually holds, for comparing devices
    report: () => ({
      keys: contentKeys().length,
      seen: Object.keys(loadSeen()).length,
      pendingDeletes: Object.keys(loadPendingDel()),
      storageHealthy: storageHealthy
    })
  };
})();
