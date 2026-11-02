/* BOHEMIA CREW DOOR -- one call opens the company screen over any screen (RUN TWO [equip from the stash], 10/13/26).
   PAOLO's twelfth vote on the map's bar: 'still not a button for me to view my crew and equip them with items from my
   storage.' Rule 24 (one HUD): the same screen from the map, the settlement and the fight, so this file is the ONE door
   and every button calls it:   BohemiaCrewDoor.open({ base: 'slices/', onDone: fn })
   It lays slices/BOHEMIA_ROSTER_SCREEN.html over the page; the roster's bag IS the stash (localStorage bohemia.bag.v1,
   the same key the settlement's market fills); DONE closes it, keeps the company in bohemia.company.v1 (name, background,
   level, perks and the gear ids the fight reads as opts.company, rule 76), calls onDone and tells the page above with
   {type:'BOHEMIA_CREW', company, formation}. No art: the screen is the roster's, the icons its placeholders (rule 101). */
(function (root) {
  'use strict';
  var KEY = 'bohemia.company.v1', cur = null;
  /* THE COMPANY SCREEN FOLDS AWAY (UI 11/2 round 2, ask 279: 'not a big fan of things just disappearing'): DONE folds the screen down
     into the phone's corner on twos (six held poses, a beat, eased in and out), its picture still on it, then it is gone; the
     motion layer's own shrink stands down for a door that folded itself (data-bm-folded). Reduced motion: a two-hold fade */
  function close() {
    if (!cur) return; var w = cur.wrap; window.removeEventListener('message', cur.on); cur = null;
    try {
      var rm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches, right = true;
      try { var R = window.BOH_PHONE_RECT && BOH_PHONE_RECT(); if (R && R.side) right = R.side !== 'left'; } catch (e) {}
      w.setAttribute('data-bm-folded', '1'); w.style.pointerEvents = 'none'; w.style.transformOrigin = (right ? '100%' : '0%') + ' 100%';
      var K = rm ? [[1, 1], [1, .5], [1, 0]] : [[1, 1], [.9, .92], [.7, .75], [.46, .5], [.28, .22], [.2, 0]], k = 0, last = 0, HOLD = 500 / 6;
      /* the fold is a morph like any other: one row in the motion layer's record (BohemiaMotion.log), measured, not claimed */
      var now = function () { return performance.timeOrigin + performance.now(); }, row = null, frames = 0;
      try { var BM = (window.top && window.top.BohemiaMotion) || window.BohemiaMotion; if (BM && BM.log) { row = { id: 'crew', kind: 'mode', how: 'shrink', fold: true, t0: Math.round(now()), budget: [500, 1000], reduced: !!rm, planned: Math.round(K.length * HOLD), holds: K.length, gaps: 0, skipped: false }; BM.log.push(row); } } catch (e) {}
      var end = function () { if (row && row.t1 == null) { row.t1 = Math.round(now()); row.ms = row.t1 - row.t0; row.frames = frames; } try { w.remove(); } catch (e) {} };
      /* one pose a hold (83 ms, six a beat), and never two in one drawn frame: a stall holds the pose, it never skips one */
      var step = function (t) {
        if (!w.isConnected) return;
        frames++;
        if (!last || t - last >= HOLD) { last = t; if (k < K.length) { var q = K[k]; w.style.transform = 'scale(' + q[0] + ')'; w.style.opacity = String(q[1]); } k++; }
        if (k <= K.length) requestAnimationFrame(step); else end();
      };
      requestAnimationFrame(step); setTimeout(end, 2500);
    } catch (e) { try { w.remove(); } catch (e2) {} }
  }
  function open(o) {
    o = o || {}; if (cur) return cur.frame;
    var wrap = document.createElement('div'); wrap.id = 'crewdoor';
    wrap.style.cssText = 'position:fixed;inset:0;z-index:9000;background:#120e0a';
    var f = document.createElement('iframe'); f.src = (o.base || '') + 'BOHEMIA_ROSTER_SCREEN.html'; f.title = 'your company';
    f.style.cssText = 'border:0;width:100%;height:100%;display:block';
    wrap.appendChild(f); document.body.appendChild(wrap);
    var on = function (e) {
      var d = e.data || {}; if (e.source !== f.contentWindow || d.type !== 'BOHEMIA_ROSTER') return;
      if (d.act === 'done') {
        try { localStorage.setItem(KEY, JSON.stringify(d.company || [])); } catch (x) {}
        var out = { type: 'BOHEMIA_CREW', company: d.company || [], formation: d.formation || null };
        close();
        if (o.onDone) try { o.onDone(out); } catch (x) {}
        try { if (window.parent && window.parent !== window) window.parent.postMessage(out, '*'); } catch (x) {}
      } else if (o.onAct) try { o.onAct(d); } catch (x) {}
    };
    window.addEventListener('message', on);
    /* THE CREW SCREEN SHOWS YOUR CREW (RUN TWO [the ten changes: the town and the hire], rule 133, TUNING's change 9: 'CREW opens
       YOUR COMPANY 12 / 20 with twelve named men while the crew is 3'): the company the origin built, read where the shell keeps
       it (BOH_START.picks(), the same picks the fight is handed), so the screen opens on those men and his roster cap */
    var p = origin();
    f.addEventListener('load', function () { try { f.contentWindow.postMessage({ type: 'BOHEMIA_ROSTER_OPEN', company: p && p.company || null, roster: p && p.roster || null, field: p && p.cap || null, origin: p && p.origin || null, day: mapDay(), select: o.select || null }, '*'); } catch (x) {} });   /* select: the man to open on (the spoils' LEVEL UP) */
    cur = { wrap: wrap, frame: f, on: on }; return f;
  }
  function origin() {
    try { for (var w = window, i = 0; w && i < 5; i++) { if (w.BOH_START && w.BOH_START.picks) return w.BOH_START.picks(); if (w.parent === w) break; w = w.parent; } } catch (e) {}
    return null;
  }
  /* the map's day (window.mapState, the map's own read), up the frames: a laid-up man's days count by it (RUN TWO 10/24) */
  function mapDay() {
    try { for (var w = window, i = 0; w && i < 6; i++) { if (typeof w.mapState === 'function') { var st = w.mapState(); return st && st.day ? st.day | 0 : null; }
      var f = w.document && w.document.getElementById('cityFrame'); if (f && f.contentWindow && typeof f.contentWindow.mapState === 'function') { var s2 = f.contentWindow.mapState(); return s2 && s2.day ? s2.day | 0 : null; }
      if (w.parent === w) break; w = w.parent; } } catch (e) {}
    return null;
  }
  function company() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
  root.BohemiaCrewDoor = { open: open, close: close, company: company, isOpen: function () { return !!cur; }, KEY: KEY };
})(typeof window !== 'undefined' ? window : this);
