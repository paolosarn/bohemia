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
  function close() { if (!cur) return; try { cur.wrap.remove(); } catch (e) {} window.removeEventListener('message', cur.on); cur = null; }
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
    f.addEventListener('load', function () { try { f.contentWindow.postMessage({ type: 'BOHEMIA_ROSTER_OPEN', company: p && p.company || null, roster: p && p.roster || null, origin: p && p.origin || null, day: mapDay() }, '*'); } catch (x) {} });
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
