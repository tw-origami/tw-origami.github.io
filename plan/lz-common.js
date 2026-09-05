// Learn Zone — shared progress-tracking helpers.
// Load this AFTER curriculum.js on every page that shows lessons (master.html, kidzone.html,
// print.html) so they all read/write the exact same localStorage keys and stay in sync —
// check a lesson off on the kids' page and it shows done on the parent dashboard, and back.
(function(){
  function slug(x){ return (x||"").replace(/[^a-z0-9]+/gi,"-").toLowerCase(); }
  function dkey(kid,sub,les){ return `lzm|${kid}|${slug(sub.subject)}|${les.p}|${slug(les.t)}`; }
  function skey(kid,sub,view,i){ return `lzmS|${kid}|${slug(sub.subject)}|${view}|${i}`; }
  const isDone = k => localStorage.getItem(k)==="1";
  const setDone = (k,v) => v?localStorage.setItem(k,"1"):localStorage.removeItem(k);

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

  window.LZ = { slug, dkey, skey, dateKey, isDone, setDone, undoneLessons, nextLesson, upcomingLessons, subjProgress };

  // Shared weekly config — the one place to pause a subject or tweak per-day overrides.
  // Edit this (or ask Claude to) and kidzone.html + print.html both pick it up automatically.
  window.LZ_CONFIG = {
    paused: ["Grammar / Word Study"]
  };
})();
