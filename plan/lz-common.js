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

  // A specific calendar day's "did you do it" checkbox for non-workbook subjects on the
  // daily print sheet (e.g. Math via Khan Academy, Typing) — distinct from the weekly
  // tally boxes on master.html/kidzone.html, since this ties to one exact date.
  function dateKey(kid,subject,dateISO){ return `lzDay|${kid}|${slug(subject)}|${dateISO}`; }

  // Free-text "what we actually did" note for one kid+subject+day (the "+" button on
  // print.html / kidzone.html). Empty string clears the note.
  function noteKey(kid,subject,dateISO){ return `lzNote|${kid}|${slug(subject)}|${dateISO}`; }
  function getNote(k){ return localStorage.getItem(k) || ""; }
  function setNote(k, text){ text=(text||"").trim(); text?localStorage.setItem(k,text):localStorage.removeItem(k); }

  // All localStorage keys with a given prefix — used by calendar.html to enumerate every
  // recorded lesson-completion, day-checkbox, and note without needing its own storage scheme.
  function scanKeys(prefix){
    const out=[];
    for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); if(k && k.indexOf(prefix)===0) out.push(k); }
    return out;
  }

  window.LZ = { slug, dkey, skey, dateKey, noteKey, isDone, setDone, doneDate, getNote, setNote, scanKeys, todayISO,
    undoneLessons, nextLesson, upcomingLessons, subjProgress };

  // Shared weekly config — the one place to pause a subject or tweak per-day overrides.
  // Edit this (or ask Claude to) and kidzone.html + print.html both pick it up automatically.
  window.LZ_CONFIG = {
    paused: ["Grammar / Word Study"]
  };
})();
