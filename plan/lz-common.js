// Learn Zone — shared progress-tracking helpers.
// Load this AFTER curriculum.js on every page that shows lessons (master.html, kidzone.html,
// print.html) so they all read/write the exact same localStorage keys and stay in sync —
// check a lesson off on the kids' page and it shows done on the parent dashboard, and back.
(function(){
  function slug(x){ return (x||"").replace(/[^a-z0-9]+/gi,"-").toLowerCase(); }
  function dkey(kid,sub,les){ return `lzm|${kid}|${slug(sub.subject)}|${les.p}|${slug(les.t)}`; }
  function skey(kid,sub,view,i){ return `lzmS|${kid}|${slug(sub.subject)}|${view}|${i}`; }
  function todayISO(){ return new Date().toISOString().slice(0,10); }

  // isDone accepts any stored value as "done" (old data just says "1"; new data stores the
  // completion date, e.g. "2026-09-07", so the calendar can show WHEN things got done).
  const isDone = k => !!localStorage.getItem(k);
  const setDone = (k,v) => v?localStorage.setItem(k, todayISO()):localStorage.removeItem(k);
  // The date a lesson/box was actually checked off, or null. Old "1"-only records return null
  // (no date info available) rather than a fake date.
  function doneDate(k){ const v=localStorage.getItem(k); return (v && v!=="1") ? v : null; }

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
  function combinedQueue(kid, sub){
    const realUndone = undoneLessons(kid, sub);
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
  // Appends one or more {title, page} rows to a custom category's own lessons array, in the
  // order given — used by the Teacher Dashboard's bulk "add rows" form so several lessons
  // land in a predictable order (at the end) instead of each one jumping to the front.
  function addCustomLessons(customId, rows){
    const arr = getCustomSubjectsRaw();
    const sub = arr.find(s=>s.customId===customId);
    if(!sub) return;
    sub.lessons = (sub.lessons||[]).concat((rows||[]).map(r=>({p:(r.page||"").toString(), t:(r.title||"").trim()})));
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

  window.LZ = { slug, dkey, skey, dateKey, noteKey, habitKey, outingKey, journalKey, isDone, setDone, doneDate, getNote, setNote,
    getOutings, setOutings, getJournal, setJournal, scanKeys, todayISO, recurringForDate, ensureRecurringSeeded,
    undoneLessons, nextLesson, upcomingLessons, subjProgress, doneLessons, doneDatesForSubject,
    manualKey, getManualLessons, setManualLessons, addManualLesson, removeManualLesson, manualDoneKey,
    orderKey, getOrder, setOrder, lessonItemId, combinedQueue,
    attachKey, getAttachments, setAttachments, addAttachment, removeAttachment, attachDoneKey,
    safeUrl, guessAttachKind, dailyPick, appLink,
    subjectBySlug, manualById, parseAttachDoneKey, attachmentsDoneOn, manualDoneOn,
    DOW_CODES, DEFAULT_SCHEDULE_DAYS, scheduleKey, getScheduleDays, setScheduleDays, dowCode, isScheduledOn,
    carryKey, getCarryOver, setCarryOver,
    getAllSubjects, getCustomSubjects, addCustomSubject, removeCustomSubject, addCustomLessons };

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
