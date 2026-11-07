/* ============================================================================
   THE FRAME METER (PLUMBER 4, 11/5/26, rule 400(a): 'a meter on every screen, the map, the town, the fight, the menus';
   PAOLO 11/4: 'I always want this shit to feel punchier, the frames never choppy, just 60 frames per second perfect').

   ONE METER FOR EVERY SCREEN. It lives in the top page (the alpha, so the demo too), and every screen of the game (the map, a
   town, the fight, the crew screen, the start screen, the phone) is a same-origin frame of that page: they all run on the one
   main thread, so a frame any of them makes late is a late frame here. It counts the browser's own frame callbacks
   (requestAnimationFrame) and the long tasks the browser reports, nothing else, so what it says is what the glass did.

   OFF AND INVISIBLE BY DEFAULT. Paolo never sees it unless somebody switches it on. Nothing runs until then: no loop, no
   observer, no box. Switch it on with:
     - Shift+F on a keyboard (the same again switches it off), or
     - BohemiaFrameMeter.show() from a console, or localStorage 'bohemia.frame.meter' = 'on' (it stays on across loads).
   The box, bottom left, says in plain words: frames a second, the worst frame of the last second, how many frames went over
   the 16.7 ms budget, and the longest task.

   FOR A CHECKER (gates/smooth_is_a_budget_gate.js): BohemiaFrameMeter.start() records without showing anything; mark() is a
   point on its clock; read(from, to) is every number for that stretch: { frames, fps, p50, p95, max, over17, over33,
   share17, share33, longTasks, longMax, longSum }. stop() ends the recording.
   ============================================================================ */
(function () {
  'use strict';
  if (window.BohemiaFrameMeter) return;
  var KEY = 'bohemia.frame.meter', BUDGET = 1000 / 60, KEEP = 36000;
  var M = { on: false, rec: false, t: [], lt: [], box: null, last: 0, obs: null, gen: 0 };
  /* ONE LOOP, EVER: a stop then a start inside one frame would leave the old loop's callback alive beside the new one and every
     frame would be counted twice (measured on this meter's first run: 'median 0 ms, 103 fps'); each loop carries its generation */
  function loop(gen, ts) {
    if (!M.rec || gen !== M.gen) return;
    if (M.t.length && ts <= M.t[M.t.length - 1]) { requestAnimationFrame(function (t) { loop(gen, t); }); return; }
    M.t.push(ts); if (M.t.length > KEEP) M.t.splice(0, M.t.length - KEEP / 2);
    if (M.on && ts - M.last > 500) { M.last = ts; paint(ts); }
    requestAnimationFrame(function (t) { loop(gen, t); });
  }
  function start() {
    if (M.rec) return true;
    M.rec = true; var gen = ++M.gen; requestAnimationFrame(function (t) { loop(gen, t); });
    if (!M.obs && window.PerformanceObserver) {
      try { M.obs = new PerformanceObserver(function (l) { l.getEntries().forEach(function (e) { M.lt.push([e.startTime, e.duration]); }); if (M.lt.length > 4000) M.lt.splice(0, 2000); });
        M.obs.observe({ type: 'longtask' }); } catch (e) { M.obs = null; }
    }
    return true;
  }
  function stop() { M.rec = false; if (M.obs) { try { M.obs.disconnect(); } catch (e) {} M.obs = null; } }
  function read(from, to) {
    from = from == null ? -Infinity : from; to = to == null ? Infinity : to;
    var ts = M.t.filter(function (x) { return x >= from && x <= to; }), d = [];
    for (var i = 1; i < ts.length; i++) d.push(ts[i] - ts[i - 1]);
    var s = d.slice().sort(function (a, b) { return a - b; });
    var q = function (p) { return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))] : 0; };
    var lt = M.lt.filter(function (x) { return x[0] >= from && x[0] <= to; }).map(function (x) { return x[1]; });
    var o17 = d.filter(function (x) { return x > BUDGET + 0.8; }).length, o33 = d.filter(function (x) { return x > 2 * BUDGET + 0.8; }).length;
    var span = ts.length > 1 ? ts[ts.length - 1] - ts[0] : 0;
    return { frames: d.length, ms: Math.round(span), fps: span ? +(1000 * d.length / span).toFixed(1) : 0,
      p50: +q(0.5).toFixed(1), p95: +q(0.95).toFixed(1), max: +(s[s.length - 1] || 0).toFixed(1),
      over17: o17, over33: o33, share17: d.length ? +(o17 / d.length).toFixed(3) : 0, share33: d.length ? +(o33 / d.length).toFixed(3) : 0,
      longTasks: lt.length, longMax: Math.round(Math.max.apply(null, [0].concat(lt))), longSum: Math.round(lt.reduce(function (a, b) { return a + b; }, 0)) };
  }
  function paint(now) {
    if (!M.box) {
      M.box = document.createElement('div'); M.box.id = 'bohframemeter'; M.box.setAttribute('aria-hidden', 'true');
      M.box.style.cssText = 'position:fixed;left:6px;bottom:6px;z-index:2147483647;pointer-events:none;padding:4px 7px;border-radius:4px;'
        + 'background:rgba(8,6,4,.78);color:#e8dcc0;font:600 10px/1.35 ui-monospace,Menlo,monospace;letter-spacing:.3px;white-space:pre';
      (document.body || document.documentElement).appendChild(M.box);
    }
    var r = read(now - 1000, now), r5 = read(now - 5000, now);
    M.box.style.color = r.max > 2 * BUDGET + 0.8 ? '#ff8a6a' : r.max > BUDGET + 0.8 ? '#f0c060' : '#bfe0a0';
    M.box.textContent = Math.round(r.fps) + ' FPS   worst ' + Math.round(r.max) + ' ms\n'
      + r5.over17 + ' late of ' + r5.frames + ' (5 s)   longest task ' + r5.longMax + ' ms';
  }
  function show() { M.on = true; try { localStorage.setItem(KEY, 'on'); } catch (e) {} start(); paint(performance.now()); return true; }
  function hide() { M.on = false; try { localStorage.removeItem(KEY); } catch (e) {} if (M.box) { M.box.remove(); M.box = null; } stop(); return true; }
  window.addEventListener('keydown', function (e) { if (e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey && (e.key === 'F' || e.key === 'f')) {
    var a = document.activeElement; if (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) return; M.on ? hide() : show(); } }, true);
  window.BohemiaFrameMeter = { start: start, stop: stop, read: read, show: show, hide: hide, mark: function () { return performance.now(); },
    times: function () { return M.t.slice(); },   /* every frame's time, for a checker that cuts its own windows (PLUMBER 7) */
    on: function () { return M.on; }, recording: function () { return M.rec; }, budget: BUDGET };
  try { if (localStorage.getItem(KEY) === 'on') { if (document.body) show(); else document.addEventListener('DOMContentLoaded', show); } } catch (e) {}
})();
