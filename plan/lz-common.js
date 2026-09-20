// Learn Zone — shared progress-tracking helpers.
// Load this AFTER curriculum.js on every page that shows lessons (master.html, kidzone.html,
// print.html) so they all read/write the exact same localStorage keys and stay in sync —
// check a lesson off on the kids' page and it shows done on the parent dashboard, and back.
(function(){
  function slug(x){ return (x||"").replace(/[^a-z0-9]+/gi,"-").toLowerCase(); }
  function dkey(kid,sub,les){ return `lzm|${kid}|${slug(sub.subject)}|${les.p}|${slug(les.t)}`; }
  function skey(kid,sub,view,i){ return `lzmS|${kid}|${slug(sub.subject)}|${view}|${i}`; }
  // The LOCAL calendar date, not the UTC one. toISOString() is UTC, so east of Greenwich
  // this used to roll over to "tomorrow" at 8pm Eastern — the Today page would swap in the
  // next day's lessons mid-evening, and anything checked off after 8pm was filed under the
  // wrong day on the calendar. "Today" here has to mean the day the family is living in.
  function todayISO(){
    const d = new Date();
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }

  // isDone accepts any stored value as "done" (old data just says "1"; new data stores the
  // completion date, e.g. "2026-09-07", so the calendar can show WHEN things got done).
  const isDone = k => !!localStorage.getItem(k);
  const setDone = (k,v) => v?localStorage.setItem(k, todayISO()):localStorage.removeItem(k);
  // The date a lesson/box was actually checked off as YYYY-MM-DD, or null. Old "1"-only
  // records return null (no date info available) rather than a fake date.
  //
  // Values don't always come back in the format we wrote. We store "2026-09-19", but Google
  // Sheets auto-parses that into a real date cell, and Apps Script's String() on the way out
  // turns it into "Sat Sep 19 2026 00:00:00 GMT-0400 (Eastern Daylight Time)". So anything
  // that has round-tripped through sync comes back long-form. Comparing that to todayISO()
  // silently fails, which made a lesson checked off today stop counting as done-today — the
  // route would advance the moment sync echoed the value back. Normalize on read so both
  // shapes mean the same day, rather than trying to migrate every existing record.
  function normalizeDate(v){
    if(!v || v==="1") return null;
    if(/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
    const d = new Date(v);
    if(isNaN(d.getTime())) return null;
    return new Date(d.getTime() - d.getTimezoneOffset()*60000).toISOString().slice(0,10);
  }
  function doneDate(k){ return normalizeDate(localStorage.getItem(k)); }

  // Ordered list of not-yet-done lessons for a subject (checkbox state OR a baked-in done:true).
  function undoneLessons(kid, sub){
    return (sub.lessons||[]).filter(l=>!(isDone(dkey(kid,sub,l))||l.done));
  }
  // The single "what's next" lesson for a subject, or null if fully caught up.
  function nextLesson(kid, sub){
    const u = undoneLessons(kid,sub);
    return u.length ? u[0] : null;
  }
  // A few lessons after "next", for a "coming up" preview.
  function upcomingLessons(kid, sub, n){
    return undoneLessons(kid,sub).slice(1, 1+(n||3));
  }
  function subjProgress(kid, sub){
    const total=(sub.lessons||[]).length;
    const done=total - undoneLessons(kid,sub).length;
    return {done,total,pct: total?Math.round(done/total*100):0, left: total-done};
  }
  // Completed lessons for a subject, most-recently-done first (by stored completion date,
  // tiebroken by page descending) — so "recently done" always surfaces what a kid just
  // checked off, letting them undo an accidental or rapid-fire click.
  function doneLessons(kid, sub){
    return (sub.lessons||[])
      .filter(l=>isDone(dkey(kid,sub,l))||l.done)
      .sort((a,b)=>{
        const da = doneDate(dkey(kid,sub,a))||"", db = doneDate(dkey(kid,sub,b))||"";
        if(da!==db) return db.localeCompare(da);
        return (parseInt(b.p,10)||0) - (parseInt(a.p,10)||0);
      });
  }

  // A specific calendar day's "did you do it" checkbox for "ongoing" subjects with no fixed
  // book (Math, Typing) — the single source of truth for these across My Work, Daily Sheets,
  // Master Tracker, and the Calendar, so checking one off anywhere shows up everywhere else.
  function dateKey(kid,subject,dateISO){ return `lzDay|${kid}|${slug(subject)}|${dateISO}`; }
  // Every ISO date an ongoing subject was marked done, oldest first.
  function doneDatesForSubject(kid, subject){
    return scanKeys(`lzDay|${kid}|${slug(subject)}|`)
      .filter(k=>isDone(k))
      .map(k=>k.split("|")[3])
      .sort();
  }

  // Free-text "what we actually did" note for one kid+subject+day (the "+" button on
  // print.html / kidzone.html). Empty string clears the note.
  function noteKey(kid,subject,dateISO){ return `lzNote|${kid}|${slug(subject)}|${dateISO}`; }
  function getNote(k){ return localStorage.getItem(k) || ""; }
  function setNote(k, text){ text=(text||"").trim(); text?localStorage.setItem(k,text):localStorage.removeItem(k); }

  // A daily habit's checkbox for one kid+day (Go outside, Read a book, etc. — see
  // LZ_CONFIG.habits below). Same isDone/setDone plumbing as everything else, just its own
  // key prefix so it stays separate from subject/lesson records.
  function habitKey(kid,habit,dateISO){ return `lzHabit|${kid}|${slug(habit)}|${dateISO}`; }

  // A parent's "not required today" flag for an "ongoing" subject (Math, Typing) on one
  // specific date — separate from dateKey/isDone so excusing a day doesn't get confused with
  // actually doing it: a skipped day shows on the calendar as excused, and it counts as
  // neither missed nor completed. Same key-encodes-its-own-date shape as dateKey/habitKey, so
  // it's a plain on/off flag (the date's already in the key, nothing else to store).
  function skipKey(kid,subject,dateISO){ return `lzSkip|${kid}|${slug(subject)}|${dateISO}`; }
  function isSkipped(kid,subject,dateISO){ return !!localStorage.getItem(skipKey(kid,subject,dateISO)); }
  function setSkipped(kid,subject,dateISO,on){
    on ? localStorage.setItem(skipKey(kid,subject,dateISO), "1") : localStorage.removeItem(skipKey(kid,subject,dateISO));
  }

  // One kid's free-form diary entry for one day (the "Daily Journal") — separate from the
  // per-subject "+" notes and the Day Outing log; just one open-ended block of text per day.
  function journalKey(kid,dateISO){ return `lzJournal|${kid}|${dateISO}`; }
  function getJournal(k){ return localStorage.getItem(k) || ""; }
  function setJournal(k, text){ text=(text||"").trim(); text?localStorage.setItem(k,text):localStorage.removeItem(k); }

  // One kid+day's list of "Day Outing" entries (Zoo trip, Library, etc.) — unlike a note,
  // a day can have several, so this stores a JSON array under one key instead of one string
  // per record. Each entry is {text, done}: a kid logging something that already happened
  // (via kidzone.html's "+ Add an outing") is saved done:true; a parent pre-planning one for
  // a future (or today's) date via calendar.html saves done:false, so it shows up as an
  // unchecked box the kid can tick off when it happens.
  function outingKey(kid,dateISO){ return `lzOuting|${kid}|${dateISO}`; }
  function getOutings(k){
    let arr;
    try{ arr = JSON.parse(localStorage.getItem(k)||"[]"); }catch(e){ arr = []; }
    // Normalize legacy data, which was a plain array of strings (always "already happened").
    return (arr||[]).map(o => typeof o==="string" ? {text:o, done:true} : {text:o.text||"", done:!!o.done});
  }
  function setOutings(k, arr){
    const clean = (arr||[])
      .map(o => typeof o==="string" ? {text:(o||"").trim(), done:true} : {text:(o.text||"").trim(), done:!!o.done})
      .filter(o=>o.text);
    clean.length ? localStorage.setItem(k, JSON.stringify(clean)) : localStorage.removeItem(k);
  }

  // All localStorage keys with a given prefix — used by calendar.html to enumerate every
  // recorded lesson-completion, day-checkbox, and note without needing its own storage scheme.
  function scanKeys(prefix){
    const out=[];
    for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); if(k && k.indexOf(prefix)===0) out.push(k); }
    return out;
  }

  // --- Manual (teacher-inserted) lessons ------------------------------------------------
  // A one-off task slipped into a book subject's queue ("read a library book instead of the
  // workbook a few days"), or onto a specific date for an "ongoing" subject like Math ("do
  // Khan Academy on the 10th") — without touching curriculum.js's real page/book data, which
  // stays the source of truth for the actual physical book. Stored per kid+subject as a small
  // array; each entry is checkable via manualDoneKey, using the same isDone/setDone plumbing
  // as everything else, and removable independent of its done state.
  function manualKey(kid, subject){ return `lzManual|${kid}|${slug(subject)}`; }
  function getManualLessons(kid, subject){
    try{ return JSON.parse(localStorage.getItem(manualKey(kid,subject))||"[]"); }catch(e){ return []; }
  }
  function setManualLessons(kid, subject, arr){
    (arr&&arr.length) ? localStorage.setItem(manualKey(kid,subject), JSON.stringify(arr)) : localStorage.removeItem(manualKey(kid,subject));
  }
  // opts: {title, page} for a book-subject insertion, or {title, date} for an ongoing-subject
  // one-off (dated) task. Returns the new entry's id.
  function addManualLesson(kid, subject, opts){
    opts = opts || {};
    const arr = getManualLessons(kid, subject);
    const id = "m" + Date.now().toString(36) + Math.random().toString(36).slice(2,6);
    arr.push({ id, title:(opts.title||"").trim(), page: opts.page||"", date: opts.date||"" });
    setManualLessons(kid, subject, arr);
    return id;
  }
  function removeManualLesson(kid, subject, id){
    setManualLessons(kid, subject, getManualLessons(kid,subject).filter(m=>m.id!==id));
  }
  function manualDoneKey(kid, subject, id){ return `lzManualDone|${kid}|${slug(subject)}|${id}`; }

  // A saved custom ordering of a book subject's still-to-do queue (real lessons + manual
  // insertions) — a list of item ids: "r|<page>|<slug title>" for real lessons, "m|<id>" for
  // manual ones. Absent = natural book order, with any manual insertions appended at the end
  // until dragged into place.
  function orderKey(kid, subject){ return `lzOrder|${kid}|${slug(subject)}`; }
  function getOrder(kid, subject){
    try{ return JSON.parse(localStorage.getItem(orderKey(kid,subject))||"[]"); }catch(e){ return []; }
  }
  function setOrder(kid, subject, arr){
    (arr&&arr.length) ? localStorage.setItem(orderKey(kid,subject), JSON.stringify(arr)) : localStorage.removeItem(orderKey(kid,subject));
  }
  function lessonItemId(les){ return `r|${les.p}|${slug(les.t)}`; }
  // The still-to-do queue for a book subject — real undone lessons plus any undone manual
  // insertions (the ones with no .date — those belong to an ongoing subject instead), in the
  // teacher's saved custom order, or natural book order + manual items appended at the end if
  // no custom order has been saved yet. This is what master.html and kidzone.html both render
  // as "what's next" / "coming up", so an insertion or reorder shows up in both places.
  // --- Splitting one lesson into parts ------------------------------------------------
  // "Do pages 90-91 today and 92-94 Thursday." A split turns one real book lesson into N
  // teacher-inserted (manual) lessons and hides the original from the queue, so the kid's
  // page, the week planner and the calendar all show the PARTS with their own checkboxes and
  // their own days, with no new rendering code anywhere. The original lesson isn't marked
  // done up front (that would inflate progress) — combinedQueue closes it out automatically
  // once every part is checked off, which keeps the book's real page count honest.
  function splitKey(kid, subject, itemId){ return `lzSplit|${kid}|${slug(subject)}|${attachItemSlug(itemId)}`; }
  function getSplitParts(kid, subject, itemId){
    try{ return JSON.parse(localStorage.getItem(splitKey(kid,subject,itemId))||"[]"); }catch(e){ return []; }
  }
  function setSplitParts(kid, subject, itemId, ids){
    (ids&&ids.length) ? localStorage.setItem(splitKey(kid,subject,itemId), JSON.stringify(ids))
                      : localStorage.removeItem(splitKey(kid,subject,itemId));
  }
  // parts: [{title, page, date}] — returns the new manual ids, slotted into the subject's
  // saved order exactly where the original lesson sat.
  function splitLesson(kid, sub, itemId, parts){
    const before = combinedQueue(kid, sub).map(x=>x.id);
    const ids = (parts||[]).map(p=>addManualLesson(kid, sub.subject, {title:p.title, page:p.page}));
    setSplitParts(kid, sub.subject, itemId, ids);
    ids.forEach((id,i)=>{ if(parts[i] && parts[i].date) setAssignedDate(kid, sub.subject, "m|"+id, parts[i].date); });
    const at = before.indexOf(itemId);
    const next = before.slice();
    const partIds = ids.map(id=>"m|"+id);
    if(at>=0) next.splice(at, 1, ...partIds); else next.push(...partIds);
    setOrder(kid, sub.subject, next);
    return ids;
  }
  // Undo a split: drop the parts (and their pins) and let the original lesson come back.
  function unsplitLesson(kid, sub, itemId){
    getSplitParts(kid, sub.subject, itemId).forEach(id=>{
      setAssignedDate(kid, sub.subject, "m|"+id, null);
      localStorage.removeItem(manualDoneKey(kid, sub.subject, id));
      removeManualLesson(kid, sub.subject, id);
    });
    setSplitParts(kid, sub.subject, itemId, []);
    setOrder(kid, sub.subject, []);
  }

  // --- A day the whole family is off (field trip, sick day, travel) ---------------------
  // Not per-kid and not per-subject: the planner flows work around these days instead of
  // stacking it up on them. Stores the reason as the value when there is one.
  function dayOffKey(dateISO){ return `lzDayOff|${dateISO}`; }
  function isDayOff(dateISO){ return !!localStorage.getItem(dayOffKey(dateISO)); }
  function dayOffLabel(dateISO){ const v = localStorage.getItem(dayOffKey(dateISO)); return (v && v!=="1") ? v : ""; }
  function setDayOff(dateISO, on, label){
    on ? localStorage.setItem(dayOffKey(dateISO), (label||"").trim() || "1") : localStorage.removeItem(dayOffKey(dateISO));
  }

  function combinedQueue(kid, sub){
    // Close out any lesson whose every split part is finished, and hide the ones still in
    // progress — their parts stand in for them.
    (sub.lessons||[]).forEach(l=>{
      const parts = getSplitParts(kid, sub.subject, lessonItemId(l));
      if(parts.length && parts.every(id=>isDone(manualDoneKey(kid, sub.subject, id)))) setDone(dkey(kid,sub,l), true);
    });
    const realUndone = undoneLessons(kid, sub).filter(l=>!getSplitParts(kid, sub.subject, lessonItemId(l)).length);
    const manualUndone = getManualLessons(kid, sub.subject).filter(m=>!m.date && !isDone(manualDoneKey(kid,sub.subject,m.id)));
    const byId = {};
    realUndone.forEach(l=>{ byId[lessonItemId(l)] = {id:lessonItemId(l), kind:"real", lesson:l}; });
    manualUndone.forEach(m=>{ byId["m|"+m.id] = {id:"m|"+m.id, kind:"manual", manual:m}; });
    const order = getOrder(kid, sub.subject);
    let list;
    if(order.length){
      list = order.map(id=>byId[id]).filter(Boolean);
      const seen = new Set(list.map(x=>x.id));
      Object.keys(byId).forEach(id=>{ if(!seen.has(id)) list.push(byId[id]); });
    } else {
      list = [...realUndone.map(l=>byId[lessonItemId(l)]), ...manualUndone.map(m=>byId["m|"+m.id])];
    }
    return list;
  }

  // --- Supplement links (teacher-attached articles / videos) ---------------------------
  // Any lesson can carry extra material the teacher wants alongside it — a YouTube video,
  // a news article, a Khan Academy page. Stored per kid+subject+item so a link follows the
  // specific lesson it belongs to, and each link gets its own check-off (the round "watched
  // / read it" circle on the kid's checklist) separate from the lesson's own checkbox.
  //
  // itemId is the same stable id combinedQueue uses — `r|<page>|<slug>` for a real book
  // lesson, `m|<id>` for a teacher-inserted one, or the literal "subject" for an ongoing
  // subject (Math, Learn Zone) that has no per-lesson rows to hang a link on. Its pipes are
  // swapped for `~` so they can't be confused with the key's own field separators.
  function attachItemSlug(itemId){ return String(itemId).replace(/\|/g, "~"); }
  function attachKey(kid, subject, itemId){ return `lzAttach|${kid}|${slug(subject)}|${attachItemSlug(itemId)}`; }
  function getAttachments(kid, subject, itemId){
    try{ return JSON.parse(localStorage.getItem(attachKey(kid,subject,itemId))||"[]"); }catch(e){ return []; }
  }
  function setAttachments(kid, subject, itemId, arr){
    (arr&&arr.length) ? localStorage.setItem(attachKey(kid,subject,itemId), JSON.stringify(arr))
                      : localStorage.removeItem(attachKey(kid,subject,itemId));
  }
  // opts: {title, url, kind:"video"|"article"}. Returns the new attachment's id.
  function addAttachment(kid, subject, itemId, opts){
    opts = opts || {};
    const arr = getAttachments(kid, subject, itemId);
    const id = "a" + Date.now().toString(36) + Math.random().toString(36).slice(2,6);
    arr.push({ id, title:(opts.title||"").trim(), url:(opts.url||"").trim(), kind: opts.kind==="article" ? "article" : "video" });
    setAttachments(kid, subject, itemId, arr);
    return id;
  }
  function removeAttachment(kid, subject, itemId, id){
    setAttachments(kid, subject, itemId, getAttachments(kid,subject,itemId).filter(a=>a.id!==id));
  }
  function attachDoneKey(kid, subject, itemId, attachId){
    return `lzAttachDone|${kid}|${slug(subject)}|${attachItemSlug(itemId)}|${attachId}`;
  }
  // Only ever produce a link the browser will treat as a normal web address — a pasted
  // "javascript:" or "data:" URL would otherwise become a script that runs on click.
  function safeUrl(u){
    const s = String(u||"").trim();
    return /^https?:\/\//i.test(s) ? s : "";
  }
  // A sensible default for the video/article toggle when the teacher pastes a link.
  function guessAttachKind(u){
    return /youtube\.com|youtu\.be|vimeo\.com|khanacademy\.org|\.mp4($|\?)/i.test(String(u||"")) ? "video" : "article";
  }

  // --- Assign a lesson to a specific day (Master Tracker's 📅 button) -----------------------
  // Two different jobs share one control, depending on whether the lesson is already done:
  //  - NOT done: pins which day it's due. A book subject only ever surfaces its front-of-queue
  //    lesson (see combinedQueue) as "now"/"today" on kidzone.html and week.html — this makes
  //    that gate explicit. Nothing later in the queue can become "now" before this one is
  //    reached anyway (the queue is strictly in order), so assigning a future date to the
  //    front lesson effectively pauses the whole subject until that date, then it resumes
  //    normally — no separate handling needed for "everything after."
  //  - Already done: this isn't a gate (nothing left to gate), it directly corrects which day
  //    the calendar shows the completion under — same idea as calendar.html's own date-fix,
  //    just reachable from the lesson's own row on the dashboard too. Since a real/manual
  //    lesson's done-record already stores its date as the key's VALUE (see dkey/doneDate),
  //    correcting it is just overwriting that value — callers do this directly via setDone's
  //    underlying storage, not through this helper.
  function assignKey(kid, subject, itemId){ return `lzAssign|${kid}|${slug(subject)}|${attachItemSlug(itemId)}`; }
  function getAssignedDate(kid, subject, itemId){ return localStorage.getItem(assignKey(kid,subject,itemId)) || null; }
  function setAssignedDate(kid, subject, itemId, dateISO){
    dateISO ? localStorage.setItem(assignKey(kid,subject,itemId), dateISO) : localStorage.removeItem(assignKey(kid,subject,itemId));
  }
  // The date a book subject is paused until, or null if it's free to surface its next lesson
  // right now. Only ever looks at the front of the queue — see the note above.
  function subjectResumesOn(kid, sub){
    const q = combinedQueue(kid, sub);
    if(!q.length) return null;
    return getAssignedDate(kid, sub.subject, q[0].id);
  }

  // --- Custom categories (teacher-created subjects, not baked into curriculum.js) ----------
  // Lets the Teacher Dashboard add a whole new subject on the fly (e.g. "Piano", "Coding")
  // without editing curriculum.js. Stored as one JSON array so a category can belong to one
  // or both kids without duplicating records. Each entry has the exact same shape a
  // curriculum.js subject does ({subject, kind, lessons:[{p,t}], ...}), so every existing
  // helper (combinedQueue, subjProgress, dkey, drag-reorder, manual insertion, attachments...)
  // treats it identically to a built-in subject with zero special-casing. The only thing that
  // marks one as custom is its own `customId`, which the dashboard uses to know it can add
  // lessons directly to `.lessons` (and offer a "remove category" control) instead of going
  // through the manual-lesson overlay that built-in subjects use for one-off insertions.
  const CUSTOM_SUBJECTS_KEY = "lzCustomSubjects";
  function getCustomSubjectsRaw(){
    try{ return JSON.parse(localStorage.getItem(CUSTOM_SUBJECTS_KEY)||"[]"); }catch(e){ return []; }
  }
  function setCustomSubjectsRaw(arr){
    (arr&&arr.length) ? localStorage.setItem(CUSTOM_SUBJECTS_KEY, JSON.stringify(arr)) : localStorage.removeItem(CUSTOM_SUBJECTS_KEY);
  }
  function getCustomSubjects(kid){
    return getCustomSubjectsRaw().filter(s=>(s.kids||[]).includes(kid));
  }
  // Every subject for a kid — curriculum.js's built-in list plus any custom categories
  // assigned to them. Every page that enumerates a kid's subjects should read this instead of
  // window.CURRICULUM[kid] directly, so a newly created category shows up everywhere at once
  // (kidzone.html, master.html, week.html, calendar.html, print.html).
  function getAllSubjects(kid){
    const cur = window.CURRICULUM || {};
    return (cur[kid]||[]).concat(getCustomSubjects(kid));
  }
  // kids: an array like ["ryland"], ["reid"], or ["ryland","reid"]. Returns the new
  // category's id.
  function addCustomSubject(kids, name, opts){
    opts = opts || {};
    const arr = getCustomSubjectsRaw();
    const id = "cs" + Date.now().toString(36) + Math.random().toString(36).slice(2,6);
    arr.push({
      customId: id,
      subject: (name||"").trim(),
      kind: "book",
      book: opts.book || "",
      goal: opts.goal || 3,
      kids: (kids||[]).slice(),
      lessons: []
    });
    setCustomSubjectsRaw(arr);
    return id;
  }
  function removeCustomSubject(id){
    setCustomSubjectsRaw(getCustomSubjectsRaw().filter(s=>s.customId!==id));
  }
  // Renames a custom category (fixing a typo, or just changing it) WITHOUT losing its
  // progress. Every derived record — completions (dkey), the weekly schedule, assigned-date
  // pins, manual insertions, attachments, notes, skip flags, carry-over/catch-up prefs — is
  // keyed off `slug(subject)`, computed fresh from the current name every time it's read. A
  // rename that only changed the `.subject` field would silently orphan all of that: the app
  // would compute new keys under the new slug and find nothing there, while the real data sat
  // under the old slug looking like it had vanished (this is exactly what happened once
  // already, discovered as a "Book Reoprt" custom category with real lesson progress attached
  // to the misspelled slug). So this walks every kid the category belongs to and physically
  // moves each old-slug-keyed record to its new-slug equivalent, preserving the stored value,
  // via the normal localStorage API — so it picks up lz-sync.js's push-on-write and syncs the
  // move like any other edit. Returns true on success, false if the category wasn't found.
  function renameCustomSubject(customId, newName){
    newName = (newName||"").trim();
    if(!newName) return false;
    const arr = getCustomSubjectsRaw();
    const sub = arr.find(s=>s.customId===customId);
    if(!sub) return false;
    const oldName = sub.subject;
    const oldSlug = slug(oldName);
    const newSlug = slug(newName);
    sub.subject = newName;
    setCustomSubjectsRaw(arr);
    if(oldSlug === newSlug || !newSlug) return true; // display-only tweak — no key migration needed

    const kids = sub.kids || [];
    // One value per kid+subject, no further suffix — rename the key outright.
    const exactKeyFns = [manualKey, orderKey, scheduleKey, carryKey, catchupResetKey];
    // A further per-lesson/per-date/per-item suffix follows the slug — scan and move every match.
    const scanPrefixes = ["lzm", "lzDay", "lzNote", "lzSkip", "lzManualDone", "lzAttach", "lzAttachDone", "lzAssign"];

    kids.forEach(kid=>{
      exactKeyFns.forEach(fn=>{
        const oldKey = fn(kid, oldName);
        const v = localStorage.getItem(oldKey);
        if(v!==null){
          localStorage.setItem(fn(kid, newName), v);
          localStorage.removeItem(oldKey);
        }
      });
      scanPrefixes.forEach(p=>{
        const oldPrefix = `${p}|${kid}|${oldSlug}|`;
        const newPrefix = `${p}|${kid}|${newSlug}|`;
        scanKeys(oldPrefix).forEach(oldKey=>{
          const v = localStorage.getItem(oldKey);
          if(v===null) return;
          localStorage.setItem(newPrefix + oldKey.slice(oldPrefix.length), v);
          localStorage.removeItem(oldKey);
        });
      });
    });
    return true;
  }
  // Inserts one or more {title, page} rows into a custom category's own lessons array, in
  // the order given, at atIndex (defaults to the end when omitted/out of range) — used by the
  // Teacher Dashboard's "insert a lesson here" gaps so rows land exactly where clicked instead
  // of always at the end.
  function addCustomLessons(customId, rows, atIndex){
    const arr = getCustomSubjectsRaw();
    const sub = arr.find(s=>s.customId===customId);
    if(!sub) return;
    const lessons = sub.lessons||[];
    const idx = (atIndex===undefined || atIndex===null || atIndex<0 || atIndex>lessons.length) ? lessons.length : atIndex;
    const newOnes = (rows||[]).map(r=>({p:(r.page||"").toString(), t:(r.title||"").trim()}));
    sub.lessons = lessons.slice(0,idx).concat(newOnes, lessons.slice(idx));
    setCustomSubjectsRaw(arr);
  }

  // --- Reverse lookups, for pages that scan raw keys and need to name what they found ----
  // (the calendar and the "Done today" panels walk localStorage directly, so they need to
  // turn a key like lzManualDone|ryland|reading|m123 back into "Reading — Read a library book")
  function subjectBySlug(kid, subjSlug){
    return getAllSubjects(kid).find(s => slug(s.subject) === subjSlug) || null;
  }
  function manualById(kid, subject, id){
    return getManualLessons(kid, subject).find(m => m.id === id) || null;
  }
  // lzAttachDone|<kid>|<subjectSlug>|<itemId with | swapped for ~>|<attachmentId>
  function parseAttachDoneKey(k){
    const p = String(k).split("|");
    if(p.length < 5) return null;
    return { kid:p[1], subjSlug:p[2], itemId:p[3].replace(/~/g,"|"), attachId:p[4] };
  }
  // Every supplement link a kid ticked as watched/read on a given date.
  function attachmentsDoneOn(kid, dateISO){
    const out = [];
    scanKeys(`lzAttachDone|${kid}|`).forEach(k=>{
      if(doneDate(k) !== dateISO) return;
      const info = parseAttachDoneKey(k);
      if(!info) return;
      const sub = subjectBySlug(kid, info.subjSlug);
      if(!sub) return;
      const a = getAttachments(kid, sub.subject, info.itemId).find(x=>x.id===info.attachId);
      out.push({ key:k, subject:sub.subject, title:(a && (a.title||a.url)) || "Link", kind:(a && a.kind) || "article" });
    });
    return out;
  }
  // Every teacher-inserted lesson a kid completed on a given date.
  function manualDoneOn(kid, dateISO){
    const out = [];
    scanKeys(`lzManualDone|${kid}|`).forEach(k=>{
      if(doneDate(k) !== dateISO) return;
      const p = k.split("|");
      const sub = subjectBySlug(kid, p[2]);
      if(!sub) return;
      const m = manualById(kid, sub.subject, p[3]);
      out.push({ key:k, subject:sub.subject, title:(m && m.title) || "Extra lesson", page:(m && m.page) || "" });
    });
    return out;
  }

  // --- Daily rotation for "pick one" subjects -------------------------------------------
  // A subject flagged `pick:"daily"` in curriculum.js (Learn Zone) doesn't list all its
  // options as choices — it just assigns one for the day. Deliberately computed rather than
  // stored: the same kid + subject + date always yields the same answer, so every device
  // agrees without needing to sync anything, and it can't drift or get "re-rolled" by a
  // refresh. Stepping one position per day cycles evenly through the whole list instead of
  // randomly repeating, and the per-kid offset keeps the two boys on different apps.
  function dailyPick(kid, subject, dateISO, options){
    const list = options || [];
    if(!list.length) return null;
    const day = Math.floor(Date.parse(dateISO + "T00:00:00Z") / 86400000);
    let off = 0;
    const seed = `${kid}|${subject}`;
    for(let i=0;i<seed.length;i++) off = (off*31 + seed.charCodeAt(i)) >>> 0;
    return list[(((day + off) % list.length) + list.length) % list.length];
  }
  // Where a Learn Zone option actually lives, so the day's pick can be a real link.
  // Paths are relative to /plan/, which is where every page that renders them sits.
  function appLink(name){
    const map = window.LZ_CONFIG && window.LZ_CONFIG.appLinks;
    return (map && map[name]) || "";
  }

  // A weekly-recurring activity (karate, etc. — see LZ_CONFIG.recurring below), with
  // one-off overrides by exact date (skip a day, or change the time just for that day). This
  // computes WHICH dates it applies to; it doesn't store anything itself — callers turn a
  // match into a normal outing entry (see ensureRecurringSeeded) so it's checkable/removable
  // exactly like anything typed in by hand.
  function recurringForDate(dateISO){
    const dow = new Date(dateISO+"T00:00:00").getDay(); // 0=Sun..6=Sat
    const cfg = window.LZ_CONFIG || {};
    const list = cfg.recurring || [];
    const ex = (cfg.recurringExceptions || {})[dateISO];
    if(ex && ex.skip) return [];
    return list.filter(r=>(r.days||[]).includes(dow)).map(r=>({
      name: r.name,
      time: (ex && ex.time) ? ex.time : r.time,
      kids: r.kids || ["ryland","reid"]
    }));
  }
  // Makes sure this kid+date's outing list already contains today's recurring activities
  // (e.g. "Karate 6:15 PM"), adding any that are missing (as unchecked/planned, done:false).
  // Safe to call repeatedly — it only adds an entry whose exact text isn't already there, so
  // it won't duplicate one a parent or kid has already interacted with.
  function ensureRecurringSeeded(kid, dateISO){
    const acts = recurringForDate(dateISO).filter(a=>(a.kids||[]).includes(kid));
    if(!acts.length) return;
    const k = outingKey(kid, dateISO);
    const arr = getOutings(k);
    let changed = false;
    acts.forEach(a=>{
      const text = `${a.name} ${a.time}`;
      if(!arr.some(o=>o.text===text)){ arr.push({text, done:false}); changed = true; }
    });
    if(changed) setOutings(k, arr);
  }

  // --- Weekly schedule pattern (which weekdays a subject is worked on) -----------------
  // A per-subject forecast of which days of the week it's meant to happen — e.g. Math on
  // Mon/Wed/Fri, Piano only Tue/Thu. This is deliberately a PREVIEW, not an enforced rule:
  // kidzone.html still shows every active subject's next lesson every day regardless of
  // this setting. Only week.html reads it, to answer "what's the plan for this day" —
  // including showing a day as empty for a subject that just isn't scheduled on it.
  // Defaults to weekdays (Mon-Fri) for any subject the teacher hasn't customized, so nothing
  // needs to be set up for the Week Preview to work right away.
  const DOW_CODES = ["sun","mon","tue","wed","thu","fri","sat"];
  const WEEKEND_CODES = ["sat","sun"];
  const DEFAULT_SCHEDULE_DAYS = ["mon","tue","wed","thu","fri"];
  function scheduleKey(kid, subject){ return `lzSchedule|${kid}|${slug(subject)}`; }
  function getScheduleDays(kid, subject){
    const raw = localStorage.getItem(scheduleKey(kid, subject));
    if(raw===null) return DEFAULT_SCHEDULE_DAYS.slice();
    try{ const arr = JSON.parse(raw); return Array.isArray(arr) ? arr : DEFAULT_SCHEDULE_DAYS.slice(); }
    catch(e){ return DEFAULT_SCHEDULE_DAYS.slice(); }
  }
  function setScheduleDays(kid, subject, days){
    localStorage.setItem(scheduleKey(kid, subject), JSON.stringify(days||[]));
  }
  function dowCode(dateISO){ return DOW_CODES[new Date(dateISO+"T00:00:00").getDay()]; }
  function isScheduledOn(kid, subject, dateISO){
    return getScheduleDays(kid, subject).includes(dowCode(dateISO));
  }

  // Whether a missed scheduled day "carries over" (the next scheduled day owes extra lessons
  // to catch up — e.g. skip Monday's Reading and Tuesday shows two) or just resets (today's
  // single assignment, never piling up). Only meaningful for book-kind subjects, which have
  // an actual queue of lessons to catch up on — an "ongoing" subject (Math, Learn Zone) is a
  // single per-day checkbox with nothing to accumulate, so it's always effectively "daily."
  // Defaults to true: a book's unfinished lessons naturally wait for you, so catching up is
  // the expected behavior unless a teacher explicitly turns it off for a given subject.
  function carryKey(kid, subject){ return `lzCarry|${kid}|${slug(subject)}`; }
  function getCarryOver(kid, subject){
    const raw = localStorage.getItem(carryKey(kid, subject));
    return raw === null ? true : raw !== "0";
  }
  function setCarryOver(kid, subject, on){
    localStorage.setItem(carryKey(kid, subject), on ? "1" : "0");
  }

  // A one-time "forgive the backlog" marker per kid+subject — week.html's owedCount (which
  // walks backward through scheduled days to tally catch-up lessons) stops looking past this
  // date, even if carry-over is on and an earlier scheduled day went undone. Carry-over itself
  // stays on: a day missed AFTER the reset date can still pile up catch-up again — this only
  // wipes whatever was already owed through the reset date, it's not a way to turn catch-up
  // off going forward (see setCarryOver for that).
  function catchupResetKey(kid, subject){ return `lzCatchupReset|${kid}|${slug(subject)}`; }
  function getCatchupReset(kid, subject){ return localStorage.getItem(catchupResetKey(kid, subject)) || null; }
  function setCatchupReset(kid, subject, dateISO){
    dateISO ? localStorage.setItem(catchupResetKey(kid, subject), dateISO) : localStorage.removeItem(catchupResetKey(kid, subject));
  }

  /* ---------- what is actually ON for a kid, on given days -----------------------------
     ONE answer to "what work does this day hold", shared by the kids' route
     (ry.html / reid.html) and the Teacher Dashboard's planner.

     These two used to each compute it themselves, and drifted apart in four separate ways
     that all showed up as "the dashboard doesn't match the checklist":
       * the planner honoured each subject's schedule; the kid pages ignored it entirely,
         so a Sunday showed a full route against an empty planner column;
       * the planner flowed the next lesson onto a day a subject was already finished on,
         so one view showed two lessons and the other one;
       * with a queue head pinned to a future day the kid route paused the whole subject
         while the planner flowed the SECOND item into today;
       * a day marked off emptied the planner but left the kid route untouched.
     Anything that decides what a day contains belongs here, so there is only one place
     for it to be wrong.

     Returns { [dateISO]: [card] }. A card is deliberately view-agnostic — it carries the
     records and the facts, and each view does its own wording and layout. */
  function isWeekendISO(dateISO){ return WEEKEND_CODES.includes(dowCode(dateISO)); }

  // A subject runs on any day that isn't marked off. Per-subject weekly schedules used to
  // gate this, but only the planner ever honoured them -- ry.html/reid.html offered work
  // every day regardless -- so the two views disagreed about what a day held. The kids'
  // behaviour is the one that wins: when a day should be empty you mark it off, and you
  // place lessons by dragging them.
  //
  // The schedule data is left intact and is still edited in the Old Tracker and read by
  // week.html; it simply no longer decides what this plan contains.
  function runsOn(kid, subject, dateISO){
    return !isDayOff(dateISO);
  }

  function activeSubjects(kid){
    const paused = (window.LZ_CONFIG && window.LZ_CONFIG.paused) || [];
    return getAllSubjects(kid).filter(s=>!paused.includes(s.subject));
  }

  // The days a subject's unpinned queue actually flows onto, in order. Shared with the
  // planner's drag handling so "which slot does this day correspond to" is answered the
  // same way there as here — a push has to reorder the queue to land a lesson on a given
  // day, and it can only work out the right position from the same list planDays uses.
  function openDaysFor(kid, sub, dates, precomputed){
    const subject = sub.subject;
    const today = todayISO();
    let pinCount = precomputed && precomputed.pinCount;
    let doneDays = precomputed && precomputed.doneDays;
    let resume   = precomputed ? precomputed.resume : undefined;
    if(!pinCount){
      pinCount = {};
      combinedQueue(kid, sub).forEach(it=>{
        const pin = getAssignedDate(kid, subject, it.id);
        if(pin) pinCount[pin] = (pinCount[pin]||0)+1;
      });
    }
    if(!doneDays){
      doneDays = new Set(dates.filter(d =>
        (sub.lessons||[]).some(l=>doneDate(dkey(kid,sub,l))===d) ||
        getManualLessons(kid,subject).some(m=>!m.date && doneDate(manualDoneKey(kid,subject,m.id))===d)));
    }
    if(resume === undefined) resume = subjectResumesOn(kid, sub);
    return dates.filter(d =>
      d >= today && runsOn(kid,subject,d) && !pinCount[d] &&
      // A day this subject was excused from is a real hole in the flow, not just a day
      // without a pin — nothing backfills it. That is what makes it possible to drag a
      // lesson to a LATER day and have the day it left stay empty, instead of the next
      // lesson sliding into the gap.
      !isSkipped(kid, subject, d) &&
      !doneDays.has(d) && (!resume || d > resume));
  }

  function planDays(kid, dates){
    const today = todayISO();
    const byDay = {}; dates.forEach(d=>byDay[d]=[]);
    const inRange = d => byDay[d] !== undefined;

    activeSubjects(kid).forEach(sub=>{
      const subject = sub.subject;

      if(sub.kind === "ongoing"){
        dates.forEach(d=>{
          if(!runsOn(kid,subject,d)) return;
          if(isSkipped(kid,subject,d)) return;            // parent excused it
          const key = dateKey(kid,subject,d);
          const done = isDone(key);
          const pick = sub.pick==="daily" ? dailyPick(kid,subject,d,sub.options) : null;
          byDay[d].push({ type:"ongoing", kid, sub, subject, date:d, done, doneKey:key,
            itemId:"subject", pick,
            title: pick || (sub.options&&sub.options[0]) || subject, page:"",
            missed: !done && d < today });
        });
        getManualLessons(kid,subject).filter(m=>m.date).forEach(m=>{
          if(!inRange(m.date) || isDayOff(m.date)) return;
          const key = manualDoneKey(kid,subject,m.id);
          byDay[m.date].push({ type:"manual", kid, sub, subject, itemId:"m|"+m.id, manual:m,
            date:m.date, done:isDone(key), doneKey:key, title:m.title, page:m.page,
            pinned:true, extra:true, missed:!isDone(key) && m.date < today });
        });
        return;
      }

      // Book subject. Completions first, so a finished day shows what actually happened.
      (sub.lessons||[]).forEach(l=>{
        const k = dkey(kid,sub,l);
        const d = doneDate(k);
        if(d && inRange(d)) byDay[d].push({ type:"real", kid, sub, subject, itemId:lessonItemId(l),
          lesson:l, date:d, done:true, doneKey:k, title:l.t, page:l.p });
      });
      getManualLessons(kid,subject).filter(m=>!m.date).forEach(m=>{
        const k = manualDoneKey(kid,subject,m.id);
        const d = doneDate(k);
        if(d && inRange(d)) byDay[d].push({ type:"manual", kid, sub, subject, itemId:"m|"+m.id,
          manual:m, date:d, done:true, doneKey:k, title:m.title, page:m.page });
      });

      // Days this subject is already finished on don't also get the next lesson pushed at
      // them -- that was the dashboard showing two Reading lessons against the route's one.
      const doneDays = new Set(Object.keys(byDay).filter(d =>
        byDay[d].some(c => c.subject===subject && c.done)));
      // A queue head pinned to a future day pauses the whole subject until then, rather
      // than letting the item behind it slide into today.
      const resume = subjectResumesOn(kid, sub);

      const queue = combinedQueue(kid, sub);
      const pinCount = {};
      const flowing = [];
      queue.forEach(it=>{
        const card = {
          type: it.kind==="manual" ? "manual" : "real", kid, sub, subject, itemId:it.id,
          lesson: it.lesson, manual: it.manual, done:false,
          title: it.kind==="manual" ? it.manual.title : it.lesson.t,
          page:  it.kind==="manual" ? it.manual.page  : it.lesson.p,
          doneKey: it.kind==="manual" ? manualDoneKey(kid,subject,it.manual.id) : dkey(kid,sub,it.lesson),
          part: !!(it.kind==="manual" && /part/i.test(it.manual.title||""))
        };
        const pin = getAssignedDate(kid, subject, it.id);
        if(pin){
          pinCount[pin] = (pinCount[pin]||0)+1;
          if(inRange(pin) && !isDayOff(pin)) byDay[pin].push(Object.assign(card,{date:pin, pinned:true, missed: pin<today}));
        } else flowing.push(card);
      });
      const open = openDaysFor(kid, sub, dates, { pinCount, doneDays, resume });
      flowing.slice(0, open.length).forEach((c,i)=>{ byDay[open[i]].push(Object.assign(c,{date:open[i]})); });
    });

    dates.forEach(d=>byDay[d].sort((a,b)=> (a.done?1:0)-(b.done?1:0) ));
    return byDay;
  }
  // Just today, for the kids' route.
  function planForDay(kid, dateISO){ return planDays(kid, [dateISO])[dateISO]; }

  window.LZ = { planDays, planForDay, openDaysFor, runsOn, activeSubjects, isWeekendISO,
    slug, dkey, skey, dateKey, noteKey, habitKey, skipKey, isSkipped, setSkipped, outingKey, journalKey, isDone, setDone, doneDate, normalizeDate, getNote, setNote,
    getOutings, setOutings, getJournal, setJournal, scanKeys, todayISO, recurringForDate, ensureRecurringSeeded,
    undoneLessons, nextLesson, upcomingLessons, subjProgress, doneLessons, doneDatesForSubject,
    manualKey, getManualLessons, setManualLessons, addManualLesson, removeManualLesson, manualDoneKey,
    orderKey, getOrder, setOrder, lessonItemId, combinedQueue,
    splitKey, getSplitParts, setSplitParts, splitLesson, unsplitLesson,
    dayOffKey, isDayOff, dayOffLabel, setDayOff,
    attachKey, getAttachments, setAttachments, addAttachment, removeAttachment, attachDoneKey,
    safeUrl, guessAttachKind, dailyPick, appLink,
    subjectBySlug, manualById, parseAttachDoneKey, attachmentsDoneOn, manualDoneOn,
    DOW_CODES, DEFAULT_SCHEDULE_DAYS, scheduleKey, getScheduleDays, setScheduleDays, dowCode, isScheduledOn,
    carryKey, getCarryOver, setCarryOver, catchupResetKey, getCatchupReset, setCatchupReset,
    getAllSubjects, getCustomSubjects, addCustomSubject, removeCustomSubject, renameCustomSubject, addCustomLessons,
    assignKey, getAssignedDate, setAssignedDate, subjectResumesOn };

  // Shared weekly config — the one place to pause a subject, tweak per-day overrides, edit
  // the daily habits checklist, or set up a recurring activity like karate. Edit this (or ask
  // Claude to) and kidzone.html + calendar.html + ry.html/reid.html all pick it up
  // automatically.
  window.LZ_CONFIG = {
    paused: ["Grammar / Word Study"],
    habits: ["Go outside", "Brush teeth", "Read a book", "Draw a picture"],
    // Learn Zone options → the app that option actually opens (relative to /plan/).
    appLinks: {
      "Civic Nation":    "../civics/index.html",
      "Word Roots":      "../vocab/index.html",
      "Test Tactics":    "../testtactics/index.html",
      "History Heroes":  "../history/index.html",
      "Money Smarts":    "../money/index.html",
      "Debate Dojo":     "../debate/index.html",
      "Fact Checker":    "../factcheck/index.html",
      "Nutrition Quest": "../nutrition/index.html"
    },
    // days: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
    recurring: [
      { name: "Karate", days: [1,3], time: "6:15 PM" }, // Mon & Wed
      { name: "Karate", days: [2,4], time: "6:30 PM" }  // Tue & Thu
    ],
    // One-off overrides by exact date — skip a day entirely, or change just that day's time.
    recurringExceptions: {
      "2026-09-07": { skip: true },
      "2026-09-15": { time: "5:15 PM" },
      "2026-09-23": { time: "5:15 PM" }
    }
  };
})();
