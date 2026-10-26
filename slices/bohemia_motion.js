/* BOHEMIA -- THE MOTION LAYER  (MOTION, lane 25, [the UI morphs], 10/26/26; rule 229)

   PAOLO 10/26: 'I wanna implement transitions of the UI on the screen... see things morph into each other UI-wise...
   it has to be smart... frictionless on purpose... when there's big changes because of whatever game mode you're in,
   the UI transforms into each other with an animation... I hate how it's all static... design that has never been
   done before.'  The first votes (9/21): ONE GAME MODE, NO TELEPORT.  Research: records/BOHEMIA_MOTION_RESEARCH_HOW_
   THE_BEST_INTERFACES_MORPH_10_26_26.md (the container transform, one id on both sides, FLIP, interruptible motion,
   NN/g's and Material's timing, WCAG 2.3.3, stop-motion on twos).

   ONE LAYER, IN THE TOP DOCUMENT, OVER EVERY FRAME (#bmotion). A screen hands it a piece; the layer morphs it:
     BohemiaMotion.fly({ id, from, to, node, kind })        a piece flies from one place to another (the job card into
                                                            the phone, the bought item onto the man)
     BohemiaMotion.grow({ id, el, from, picture, ready })   the container transform: the REAL element (the town's frame,
                                                            the camp, the crew door) grows out of a place on screen
     BohemiaMotion.shrink({ id, el, to, picture, remove })  and goes back into it the way it came
     BohemiaMotion.hold({ id, el | node+box, until })       a piece that must not blink while the screen under it changes
                                                            (the bar and the phone while the fight's clouds are up)
   from / to: an element in any same-origin frame, a box {x, y, w, h} in the top glass's points, or (to) a function that
   returns either, read again every hold (a piece that is still being drawn, a camera that is still moving).
   ONE ID ON BOTH SIDES: a piece that lives on two screens carries data-morph="<id>" on both (bar, phone, crew, camp,
   abilities, town); BohemiaMotion.find(id) is the visible one, in whichever frame it is.

   THE FOUR PROMISES, and how each is kept:
   1. NOTHING CUTS, NOTHING BLINKS. The stand-in is put up in the same task that changes the screen, so it is painted in
      the same frame the old piece leaves; the real end state is laid out from the first frame and shown as the stand-in
      lands (the two overlap on the last hold, never a frame with neither). The bar and the phone stay on the glass
      through every change: the growing plate is cut around them, and over the fight's clouds they are held.
   2. A TAP IS NEVER LOST. Every stand-in has pointer-events none, and the real end state sits at its final place from
      the first frame (a growing frame waits at opacity 0, which still takes a finger), so a tap during a morph lands on
      the end state. The same tap SKIPS every morph in flight to its end in that frame (the stop cord): a capture
      listener on every document runs before anything in the page sees the tap, finishes the morphs, and lets the tap
      go on to its target. Nothing is eaten, ever.
   3. ON THE BEAT, IN BUDGET. A piece lands on the first heard eighth at least 250 ms after the tap (250 to 500 ms); a
      screen change on the first eighth at least one beat after it (500 to 750 ms); nothing runs past 1,000 ms, NN/g's
      limit of a person's flow of thought (the research's finding: 'a beat or two' is the ceiling, never the target).
      The grid is the one the music plays on (BOHEMIA_BEAT, SOUNDS, rule 221(b)): the beat he hears.
   4. REDUCED MOTION. The game's MOTION setting (the gear: FULL / LESS; its default is the phone's own reduce-motion
      setting) turns every morph into a quick fade in place: nothing travels, nothing grows, the stand-in dissolves over
      two holds (167 ms) while the end state is already there. Same taps, same end state.

   THE LOOK (rule 229(c), rule 130, rule 115(d): CRASHBOX): drawn ON TWOS, twelve held poses a second, which at 120 BPM is
   SIX HOLDS A BEAT exactly, so the stop-motion grid is the music's grid; never a smooth glide. The tin bends: on the held
   poses the plate leans into its travel and squashes along it, and overshoots before it lands. A rivet pops in at each
   corner where it lands. The grain boils: the stand-in wears the analog grain, re-rolled every hold, like clay between
   frames; a screen change carries one hold of the tape's colour split. The plates are the UI kit's own rendered tin and
   board (bohemia_ui_materials.js, BohemiaMaterials.kit), never a new material.

   THE SCREENS, handed over WITHOUT REWRITING ANYBODY'S CODE (one system, one session): the layer finds each screen's own
   door and wraps it from here (the map's loopOpenTown, loopClose and campMake; the shell's nfOpen and nfHome; the crew
   door's #crewdoor; the town's BUY and TAKE), so the screens' owners keep their files. BohemiaMotion.adapters says which
   are on and which were not found; the gate goes red the moment one is renamed. A lane that would rather call the layer
   itself replaces the wrap with one call (the NOTEs on their boards say how).

   THE RECORD: BohemiaMotion.log, one row per morph { id, kind, how, t0, t1, ms, planned, budget, holds, frames, gaps,
   skipped, reduced, waited }, and BohemiaMotion.taps, one row per tap taken during a morph { t, ids, frame, landed }. The
   gate reads these AND watches the glass itself. */
(function () {
  'use strict';
  /* ONE LAYER: a frame that loads this file uses the top document's layer */
  try { if (window.top !== window && window.top.BohemiaMotion) { window.BohemiaMotion = window.top.BohemiaMotion; return; } } catch (e) {}
  if (window.BohemiaMotion) return;
  var W = window, D = document;
  var PIECE_MIN = 250, MODE_MIN = 500, CEILING = 1000, FADE_HOLDS = 2, WAIT_MAX = 1500, READY_MAX = 2000;

  /* ---------------------------------------------------------------- the clock: the music's beat, else our own grid */
  function epochNow() { return performance.timeOrigin + performance.now(); }
  var OWN = null;
  function beat() {
    var B = W.BOHEMIA_BEAT;
    if (B && B.now && B.epoch) {
      try { var s = B.now(), e = B.epoch(); if (s && s.beatMs > 0 && isFinite(e)) return { e: e, bm: s.beatMs, src: s.src || 'beat' }; } catch (_e) {}
    }
    if (OWN === null) OWN = epochNow();
    return { e: OWN, bm: 500, src: 'own' };
  }
  /* the first eighth at least minMs from t0 (epoch ms) */
  function landAt(t0, minMs) {
    var g = beat(), h = g.bm / 2, t = t0 + minMs;
    var at = g.e + Math.ceil((t - g.e) / h - 1e-6) * h;
    if (at - t0 > CEILING) at = t0 + CEILING;
    return t0 + (at - t0) * SLOW;
  }
  /* the hold grid: six a beat, from the beat's own epoch; the last one is the landing */
  function holdsBetween(t0, t1) {
    var g = beat(), hm = g.bm / 6 * SLOW, out = [];
    var k = Math.ceil((t0 - g.e) / hm + 1e-6);
    for (var t = g.e + k * hm; t < t1 - 1; t += hm) out.push(t);
    out.push(t1);
    return out;
  }
  function holdMs() { return beat().bm / 6 * SLOW; }
  /* FOR THE CAMERA ONLY: a tool that photographs a morph mid-flight slows every one by this factor (BohemiaMotion.slowly);
     the game never sets it, and the gate checks the budgets with it at 1 */
  var SLOW = 1;

  /* ---------------------------------------------------------------- the setting */
  function reduced() {
    try { if (W.BOHEMIA_SETTINGS && W.BOHEMIA_SETTINGS.motion) return !!W.BOHEMIA_SETTINGS.motion(); } catch (e) {}
    try { return !!(W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) {}
    return false;
  }

  /* ---------------------------------------------------------------- where a thing is, on the top glass */
  function isEl(x) { return !!x && typeof x === 'object' && typeof x.getBoundingClientRect === 'function'; }
  function frameScale(fe) {
    var fr = fe.getBoundingClientRect(), iw = fe.clientWidth, ih = fe.clientHeight;
    return { fr: fr, sx: iw ? (fr.width - 2 * fe.clientLeft) / iw : 1, sy: ih ? (fr.height - 2 * fe.clientTop) / ih : 1 };
  }
  /* a box in a document's own viewport, carried up through its frames to the top glass */
  function upFrom(doc, b) {
    var win = doc && doc.defaultView;
    while (win && win !== W) {
      var fe = null; try { fe = win.frameElement; } catch (e) {}
      if (!fe) break;
      var k = frameScale(fe);
      b = { x: k.fr.left + fe.clientLeft + b.x * k.sx, y: k.fr.top + fe.clientTop + b.y * k.sy, w: b.w * k.sx, h: b.h * k.sy };
      win = fe.ownerDocument && fe.ownerDocument.defaultView;
    }
    return b;
  }
  function topBox(x) {
    if (!x) return null;
    if (typeof x === 'function') { try { x = x(); } catch (e) { return null; } if (!x) return null; }
    if (!isEl(x)) return { x: +x.x || 0, y: +x.y || 0, w: Math.max(1, +x.w || 1), h: Math.max(1, +x.h || 1) };
    if (!x.isConnected) return null;
    var r; try { r = x.getBoundingClientRect(); } catch (e) { return null; }
    if (r.width < 1 && r.height < 1) return null;
    return upFrom(x.ownerDocument, { x: r.left, y: r.top, w: r.width, h: r.height });
  }
  function shown(el) {
    if (!isEl(el) || !el.isConnected) return false;
    try {
      var r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false;
      var w = el.ownerDocument.defaultView, cs = w.getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return false;
      var fe = w.frameElement; while (fe) { var pc = fe.ownerDocument.defaultView.getComputedStyle(fe); if (pc.display === 'none' || pc.visibility === 'hidden') return false; fe = fe.ownerDocument.defaultView.frameElement; }
      for (var p = el.parentElement; p; p = p.parentElement) { var q = w.getComputedStyle(p); if (q.display === 'none') return false; }
      return true;
    } catch (e) { return false; }
  }
  function opacityOf(el) {
    try { var v = 1, w = el.ownerDocument.defaultView; for (var p = el; p && p.nodeType === 1; p = p.parentElement) v *= parseFloat(w.getComputedStyle(p).opacity) || 0; return v; } catch (e) { return 1; }
  }

  /* ---------------------------------------------------------------- the layer and its look */
  var LAYER = null, GRAIN = null;
  function layer() {
    if (LAYER && LAYER.isConnected) return LAYER;
    LAYER = D.createElement('div'); LAYER.id = 'bmotion'; LAYER.setAttribute('aria-hidden', 'true');
    LAYER.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;overflow:visible;z-index:2147483600;pointer-events:none';
    (D.body || D.documentElement).appendChild(LAYER);
    if (!D.getElementById('bmotioncss')) {
      var st = D.createElement('style'); st.id = 'bmotioncss';
      st.textContent = '#bmotion,#bmotion *{pointer-events:none!important;user-select:none!important;-webkit-user-select:none!important}'
        + '#bmotion .bm-h{position:fixed;left:0;top:0;width:100vw;height:100vh;overflow:hidden}'
        + '#bmotion .bm-s{position:absolute;transform-origin:0 0;will-change:transform,opacity;margin:0;box-sizing:border-box}'
        + '#bmotion .bm-g{position:absolute;left:0;top:0;right:0;bottom:0;mix-blend-mode:overlay;opacity:.5;background-repeat:repeat;border-radius:inherit}'
        + '#bmotion .bm-p{position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover;image-rendering:pixelated;border-radius:inherit}'
        + '#bmotion .bm-w{position:absolute;left:0;right:0;bottom:12%;text-align:center;font-family:"BohemiaCasing",ui-sans-serif,sans-serif;letter-spacing:2px;color:#f2e4c6;text-shadow:0 1px 0 #000,1px 0 0 #000;font-size:15px;white-space:nowrap;overflow:hidden}'
        + '#bmotion .bm-r{position:fixed;width:7px;height:7px;margin:-3.5px 0 0 -3.5px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#efe2c4 0,#b9a57e 38%,#5d4b31 72%,#2a2016 100%);box-shadow:1px 1px 0 rgba(10,6,3,.7)}';
      (D.head || D.documentElement).appendChild(st);
    }
    return LAYER;
  }
  /* the analog grain: one seeded tile with the tape's scan lines, re-rolled every hold by where it is laid */
  function grainURL() {
    if (GRAIN !== null) return GRAIN;
    try {
      var c = D.createElement('canvas'); c.width = c.height = 96; var g = c.getContext('2d'), s = 1234567;
      var rnd = function () { s = (s * 16807) % 2147483647; return s / 2147483647; };
      g.fillStyle = '#808080'; g.fillRect(0, 0, 96, 96);
      for (var i = 0; i < 2600; i++) { var v = rnd() < .5 ? 0 : 255; g.fillStyle = 'rgba(' + v + ',' + v + ',' + v + ',' + (rnd() * .5).toFixed(3) + ')'; g.fillRect(rnd() * 96 | 0, rnd() * 96 | 0, 1, 1 + (rnd() < .2 ? 1 : 0)); }
      for (var y = 0; y < 96; y += 3) { g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(0, y, 96, 1); }
      GRAIN = c.toDataURL();
    } catch (e) { GRAIN = ''; }
    return GRAIN;
  }
  function kitCSS(name, s) {
    try { var M = W.BohemiaMaterials; if (M && M.kit) return M.kit(name, s || 1); } catch (e) {}
    return 'background:#2a2016;border:1px solid #0a0603;border-radius:4px;';
  }

  /* A COPY OF A PIECE, for the top glass: the element and its children with every computed style written inline (the
     piece's own page styles do not reach the top document), canvases copied pixel for pixel, frames as board, ids and
     data-morph taken off so nothing on any screen can find the copy by mistake. */
  function copyOf(src) {
    var win = src.ownerDocument.defaultView;
    var c = src.cloneNode(true);
    var walk = function (a, b) {
      if (!a || !b || a.nodeType !== 1 || b.nodeType !== 1) return b;
      var cs = win.getComputedStyle(a), txt = '';
      for (var i = 0; i < cs.length; i++) { var p = cs[i]; if (p.indexOf('transition') === 0 || p.indexOf('animation') === 0 || p === 'pointer-events') continue; txt += p + ':' + cs.getPropertyValue(p) + ';'; }
      b.setAttribute('style', txt + 'transition:none;animation:none;');
      ['id', 'data-morph', 'onclick', 'tabindex', 'role', 'aria-label', 'name', 'for'].forEach(function (k) { b.removeAttribute(k); });
      if (a.tagName === 'CANVAS') { try { var cc = D.createElement('canvas'); cc.width = a.width; cc.height = a.height; cc.getContext('2d').drawImage(a, 0, 0); cc.setAttribute('style', b.getAttribute('style')); b.parentNode.replaceChild(cc, b); return cc; } catch (e) { return b; } }
      if (a.tagName === 'IFRAME') { var pl = D.createElement('div'); pl.setAttribute('style', b.getAttribute('style') + kitCSS('board_plain', .75)); b.parentNode.replaceChild(pl, b); return pl; }
      var ka = a.children, kb = b.children;
      for (var j = 0; j < ka.length && j < kb.length; j++) walk(ka[j], kb[j]);
      return b;
    };
    var host = D.createElement('div'); host.appendChild(c); walk(src, c); c = host.firstChild; host.removeChild(c);
    return c;
  }
  /* the picture inside a container: its biggest canvas (a frame's, when it is a frame), drawn as it is now */
  function pictureOf(el) {
    try {
      var doc = el.tagName === 'IFRAME' ? el.contentDocument : el.ownerDocument, root = el.tagName === 'IFRAME' ? doc : el;
      if (!doc || !root) return null;
      var best = null, area = 0;
      Array.prototype.forEach.call(root.querySelectorAll('canvas'), function (cv) { var r = cv.getBoundingClientRect(), a = r.width * r.height; if (a > area && cv.width > 8) { area = a; best = cv; } });
      if (!best) return null;
      var c = D.createElement('canvas'); c.width = best.width; c.height = best.height; c.getContext('2d').drawImage(best, 0, 0);
      return c;
    } catch (e) { return null; }
  }
  /* a part of a canvas, as a picture: the town as the map draws it, cut to the shape it will grow into */
  function cropOf(cv, box) {
    try {
      var r = cv.getBoundingClientRect(), kx = cv.width / r.width, ky = cv.height / r.height;
      var c = D.createElement('canvas'); c.width = Math.max(2, Math.round(box.w * kx)); c.height = Math.max(2, Math.round(box.h * ky));
      c.getContext('2d').drawImage(cv, Math.round((box.x - r.left) * kx), Math.round((box.y - r.top) * ky), c.width, c.height, 0, 0, c.width, c.height);
      return c;
    } catch (e) { return null; }
  }
  function plateOf(o, box) {
    var p = D.createElement('div');
    var s = Math.max(.5, Math.min(1, Math.min(box.w, box.h) / 120));
    p.setAttribute('style', kitCSS(o.plate || 'board_plain', s) + 'overflow:hidden;');
    var pic = typeof o.picture === 'function' ? o.picture() : o.picture;
    if (pic) { pic.className = 'bm-p'; p.appendChild(pic); }
    if (o.label && !pic) { var w = D.createElement('div'); w.className = 'bm-w'; w.textContent = String(o.label).toUpperCase(); p.appendChild(w); }
    return p;
  }
  /* the plate is cut around the pieces that stay (the bar, the phone): they are never covered by a morph */
  function clipAround(h, holes) {
    if (!holes || !holes.length) return;
    var vw = W.innerWidth, vh = W.innerHeight, d = 'M0 0H' + vw + 'V' + vh + 'H0Z';
    holes.forEach(function (b) { if (b && b.w > 0 && b.h > 0) d += 'M' + b.x.toFixed(1) + ' ' + b.y.toFixed(1) + 'h' + b.w.toFixed(1) + 'v' + b.h.toFixed(1) + 'h' + (-b.w).toFixed(1) + 'Z'; });
    var v = 'path(evenodd, "' + d + '")';
    h.style.clipPath = v; h.style.webkitClipPath = v;
  }
  function standIn(o, box, node, holes) {
    var h = D.createElement('div'); h.className = 'bm-h'; h.dataset.for = o.id || '';
    clipAround(h, holes);
    var s = node || plateOf(o, box);
    s.classList.add('bm-s');
    var put = function (k, v) { s.style.setProperty(k, v, 'important'); };
    put('position', 'absolute'); put('left', box.x + 'px'); put('top', box.y + 'px'); put('width', box.w + 'px'); put('height', box.h + 'px');
    put('right', 'auto'); put('bottom', 'auto'); put('margin', '0'); put('transform-origin', '0 0'); put('pointer-events', 'none');
    put('transition', 'none'); put('animation', 'none'); put('z-index', 'auto'); put('box-sizing', 'border-box');
    var g = D.createElement('div'); g.className = 'bm-g'; var u = grainURL(); if (u) g.style.backgroundImage = 'url(' + u + ')';
    s.appendChild(g);
    h.appendChild(s);
    layer().appendChild(h);
    s.__holder = h;
    return s;
  }
  function drop(s) { try { var h = s && s.__holder; if (h && h.parentNode) h.parentNode.removeChild(h); else if (s && s.parentNode) s.parentNode.removeChild(s); } catch (e) {} }

  /* ---------------------------------------------------------------- the morphs in flight */
  var LIVE = [], LOG = [], TAPS = [], RAF = 0, SEQ = 0;
  function emphasized(x) {   /* Material's emphasized-decelerate, cubic-bezier(0.05, 0.7, 0.1, 1.0), solved for y at x */
    var x1 = .05, y1 = .7, x2 = .1, y2 = 1, lo = 0, hi = 1, t = x;
    for (var i = 0; i < 20; i++) { t = (lo + hi) / 2; var cx = 3 * x1 * t * (1 - t) * (1 - t) + 3 * x2 * t * t * (1 - t) + t * t * t; if (cx < x) lo = t; else hi = t; }
    return 3 * y1 * t * (1 - t) * (1 - t) + 3 * y2 * t * t * (1 - t) + t * t * t;
  }
  function lerp(a, b, p) { return { x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p, w: a.w + (b.w - a.w) * p, h: a.h + (b.h - a.h) * p }; }
  function begin(o, how) {
    var red = reduced(), t0 = epochNow();
    var min = o.kind === 'mode' ? MODE_MIN : PIECE_MIN;
    var m = { n: ++SEQ, id: o.id || ('morph' + SEQ), kind: o.kind || 'piece', how: how, o: o, t0: t0, reduced: red, k: -1, frames: 0, gaps: 0,
      done: false, skipped: false, waiting: false, readyWait: false,
      row: { id: o.id || ('morph' + SEQ), kind: o.kind || 'piece', how: how, t0: Math.round(t0), budget: red ? [0, 200] : [min, CEILING], reduced: red } };
    plan(m, t0);
    return m;
  }
  function plan(m, t0) {
    var min = m.kind === 'mode' ? MODE_MIN : PIECE_MIN;
    m.ts = t0;
    m.t1 = m.reduced ? t0 + FADE_HOLDS * holdMs() : landAt(t0, min);
    m.holds = m.reduced ? [t0 + holdMs(), m.t1] : holdsBetween(t0, m.t1);
    m.k = -1;
  }
  function start(m) {
    /* one piece, one morph: a piece that starts again (LEAVE pressed while the town still grows) first lands where it was going */
    if (m.how !== 'hold') LIVE.filter(function (x) { return x !== m && x.id === m.id && x.how !== 'hold'; }).forEach(function (x) { land(x, true); });
    LIVE.push(m); LOG.push(m.row); if (LOG.length > 300) LOG.splice(0, LOG.length - 300);
    armAll();
    /* the screen's own work in this same tap (the copy, the screen's close, the map redrawn) is not the morph's time */
    var tn = epochNow(); if (m.how !== 'hold' && !m.waiting && !m.reduced && tn - m.ts > holdMs()) { m.row.stall = Math.round(tn - m.ts); plan(m, tn); }
    try { tickOne(m, tn); } catch (e) { m.row.err = String(e && e.message || e).slice(0, 120); try { land(m, true); } catch (_e) {} }
    if (!RAF && !m.done) RAF = W.requestAnimationFrame(tick);
    return m;
  }
  function holdIndex(m, t) { var k = 0; while (k < m.holds.length && t >= m.holds[k]) k++; return k; }
  function liveTo(m) {
    if (m.reduced) return;   /* a fade never travels */
    var o = m.o; if (typeof o.to !== 'function' && !(m.how === 'grow' && isEl(o.el))) return;
    var tgt = m.how === 'grow' ? o.el : null;
    if (typeof o.to === 'function') { try { tgt = o.to(); } catch (e) { tgt = null; } }
    var b = topBox(tgt); if (b) m.b = b;
    if (isEl(tgt) && m.how === 'fly' && o.hideTo !== false && tgt !== m.real) { if (m.real) setOp(m.real, m.realOp); m.real = tgt; m.realOp = tgt.style.opacity; if (!m.done) setOp(tgt, '0'); }
  }
  function pose(m, t) {
    var k = holdIndex(m, t);
    var n = m.holds.length;
    if (k >= n) {
      /* the container waits on its last pose for the real screen to be drawn (never past READY_MAX), then hands over */
      if (m.how === 'grow' && m.o.ready && !m.readyDone) {
        var ok = false; try { ok = !!m.o.ready(); } catch (e) { ok = true; }
        if (!ok && t - m.t1 < READY_MAX) { if (!m.readyWait) { m.readyWait = true; m.row.waitedReady = 0; } m.row.waitedReady = Math.round(t - m.t1); boil(m); return; }
        m.readyDone = true;
        if (m.readyWait) { m.holds.push(t + holdMs()); handOff(m); return; }
      }
      land(m, false); return;
    }
    if (k === m.k) return;
    m.k = k;
    liveTo(m);
    var last = k === n - 1;
    if (m.reduced) { fadePose(m, k, n); return; }
    var p = n <= 1 ? 1 : emphasized(Math.min(1, k / (n - 1)));
    if (last) p = 1;
    var s = m.s; if (!s) return;
    var cur = lerp(m.a, m.b, p), base = m.base;
    var prev = m.prevBox || m.a, vx = (cur.x + cur.w / 2) - (prev.x + prev.w / 2), vy = (cur.y + cur.h / 2) - (prev.y + prev.h / 2);
    m.prevBox = cur;
    /* the tin bends: it leans into its travel and squashes along it, and on the last hold it overshoots before it lands */
    var sp = Math.sqrt(vx * vx + vy * vy), lean = Math.max(-6, Math.min(6, -vx * 0.04)), sq = Math.min(0.08, sp * 0.0006);
    var over = last && m.how !== 'shrink' && !m.o.leave ? 1.03 : 1;
    var horiz = Math.abs(vx) >= Math.abs(vy);
    var sx = cur.w / base.w * over * (1 + (horiz ? sq : -sq * .5)), sy = cur.h / base.h * over * (1 + (horiz ? -sq * .5 : sq));
    var jx = (Math.random() - .5) * .8, jy = (Math.random() - .5) * .8;   /* the boil: a held pose is never perfectly still */
    var ox = cur.x - base.x - (over - 1) * cur.w / 2 + jx, oy = cur.y - base.y - (over - 1) * cur.h / 2 + jy;
    s.style.setProperty('transform', 'translate(' + ox.toFixed(1) + 'px,' + oy.toFixed(1) + 'px) skewX(' + (last ? 0 : lean).toFixed(2) + 'deg) scale(' + sx.toFixed(4) + ',' + sy.toFixed(4) + ')', 'important');
    boil(m);
    /* the tracking tear: one hold of a screen change carries the tape's colour split, analog, never a glow */
    s.style.setProperty('filter', (m.kind === 'mode' && k === 1) ? 'drop-shadow(-2px 0 0 rgba(160,30,20,.55)) drop-shadow(2px 0 0 rgba(30,120,130,.45))' : 'none', 'important');
    if (last) handOff(m);
    if (m.o.onPose) { try { m.o.onPose(k, n, p); } catch (e) {} }
  }
  function boil(m) { var g = m.s && m.s.querySelector('.bm-g'); if (g) g.style.backgroundPosition = ((Math.random() * 96) | 0) + 'px ' + ((Math.random() * 96) | 0) + 'px'; }
  /* the hand-off: on the last hold the real piece comes up under the stand-in, so the two overlap and neither blinks */
  function handOff(m) {
    if (m.how === 'grow' && m.o.ready && !m.readyDone) return;   /* not before the real screen is drawn */
    if (m.real) setOp(m.real, m.realOp);
    if (m.s) m.s.style.setProperty('opacity', (m.how === 'grow' || m.how === 'shrink' || m.o.leave) ? '.5' : '1', 'important');
  }
  function fadePose(m, k, n) {
    /* REDUCED MOTION: nothing travels or grows. The stand-in, where it stands, dissolves; the real piece is there. */
    if (m.real) setOp(m.real, m.realOp);
    if (m.s) m.s.style.setProperty('opacity', String(Math.max(0, 1 - (k + 1) / (n + 1)).toFixed(2)), 'important');
  }
  function setOp(el, v) { try { if (v === null || v === undefined || v === '') el.style.removeProperty('opacity'); else el.style.setProperty('opacity', v); } catch (e) {} }
  function rivets(box) {
    if (!box || box.w < 12 || box.h < 12) return;
    var L = layer(), out = [], i = Math.min(6, box.w / 6, box.h / 6);
    [[box.x + i, box.y + i], [box.x + box.w - i, box.y + i], [box.x + i, box.y + box.h - i], [box.x + box.w - i, box.y + box.h - i]].forEach(function (pt) {
      var r = D.createElement('div'); r.className = 'bm-r'; r.style.left = pt[0].toFixed(1) + 'px'; r.style.top = pt[1].toFixed(1) + 'px'; r.style.transform = 'scale(1.7)'; L.appendChild(r); out.push(r);
    });
    var hm = holdMs();
    /* popped in on the landing hold, seated on the next, gone on the third: it fastens, it does not stay on the screen */
    setTimeout(function () { out.forEach(function (r) { r.style.transform = 'scale(1)'; }); }, hm);
    setTimeout(function () { out.forEach(function (r) { r.style.opacity = '.45'; }); }, hm * 2);
    setTimeout(function () { out.forEach(function (r) { if (r.parentNode) r.parentNode.removeChild(r); }); }, hm * 3);
  }
  function land(m, skipped) {
    if (m.done) return;
    m.done = true; m.skipped = skipped;
    if (m.real) setOp(m.real, m.realOp);
    drop(m.s);
    var i = LIVE.indexOf(m); if (i >= 0) LIVE.splice(i, 1);
    var t = epochNow();
    m.row.t1 = Math.round(t); m.row.ms = Math.round(t - m.t0); m.row.flew = Math.round(t - (m.ts || m.t0)); m.row.planned = Math.round(m.t1 - (m.ts || m.t0));
    m.row.holds = m.holds ? m.holds.length : 0; m.row.frames = m.frames; m.row.gaps = m.gaps; m.row.skipped = skipped;
    if (!m.reduced && !skipped && m.how !== 'hold' && m.how !== 'shrink' && m.b && m.o.rivets !== false && !m.o.leave) rivets(m.b);
    if (m.o.onLand) { try { m.o.onLand(skipped, m); } catch (e) {} }
  }
  function tickOne(m, t) {
    if (m.how === 'hold') { holdTick(m, t); return; }
    if (m.waiting) { waitTick(m, t); return; }
    pose(m, t);
  }
  var TICKS = 0;
  function tick() {
    RAF = 0;
    var t = epochNow();
    if ((++TICKS & 7) === 0) armAll();   /* a frame that loaded during the morph takes the stop cord too */
    LIVE.slice().forEach(function (m) {
      m.frames++;
      /* THE CLOCK STARTS ON THE FIRST FRAME THAT IS DRAWN: a screen's own work in the same tap (the map redrawn on LEAVE, measured
         at half a second on a computer) would otherwise eat the poses and the morph would jump; a stall is logged, never hidden */
      if (m.frames === 1 && m.how !== 'hold' && !m.waiting && !m.reduced && t - m.ts > holdMs()) { m.row.stall = Math.round(t - m.ts); plan(m, t); }
      /* the honest count: is a form of this piece on the glass in this frame (the stand-in, or the real piece shown) */
      var on = (m.s && m.s.isConnected) || (m.real && shown(m.real) && opacityOf(m.real) > 0.01);
      if (!on) m.gaps++;
      /* a morph that throws lands where it is going: the loop never dies, so no stand-in is ever left on the glass */
      try { tickOne(m, t); } catch (e) { m.row.err = String(e && e.message || e).slice(0, 120); try { land(m, true); } catch (_e) {} }
    });
    if (LIVE.length) RAF = W.requestAnimationFrame(tick);
  }

  /* ---------------------------------------------------------------- the stop cord: a tap skips, and goes through */
  function skip(why) {
    LIVE.slice().forEach(function (m) {
      if (m.how === 'hold') return;                         /* a held piece is not motion: it stays until the real one is back */
      if (m.waiting) { m.o.snap = true; return; }            /* a piece still looking for its place lands there the moment it exists */
      if (m.how === 'grow' && m.o.ready && !m.readyDone) { var ok = false; try { ok = !!m.o.ready(); } catch (e) { ok = true; }
        if (!ok) { m.holds = [epochNow()]; m.t1 = epochNow(); m.k = 0; if (m.s && !m.reduced) m.s.style.setProperty('transform', 'none', 'important'); return; } }
      land(m, true);
    });
  }
  function armDoc(doc) {
    try {
      if (!doc || doc.__bmotionArmed) return; doc.__bmotionArmed = true;
      var w = doc.defaultView;
      var onTap = function (e) {
        if (!LIVE.length) return;
        var ids = LIVE.filter(function (m) { return m.how !== 'hold'; }).map(function (m) { return m.id; });
        if (!ids.length) return;
        skip('tap');
        var tg = e.target, what = tg && tg.nodeType === 1 ? (tg.id ? '#' + tg.id : tg.tagName.toLowerCase() + (tg.className && typeof tg.className === 'string' ? '.' + tg.className.split(' ')[0] : '')) : '?';
        var fb = null; try { fb = w.frameElement; } catch (_e) {}
        TAPS.push({ t: Math.round(epochNow()), ids: ids, frame: fb ? (fb.id || fb.title || 'frame') : 'top', landed: what, type: e.type });
        if (TAPS.length > 100) TAPS.splice(0, TAPS.length - 100);
      };
      doc.addEventListener('pointerdown', onTap, true);
      doc.addEventListener('keydown', function () { if (LIVE.length) skip('key'); }, true);
    } catch (e) {}
  }
  function eachWin(fn) {
    var visit = function (w, depth) {
      if (depth > 4) return;
      try { if (!w.document) return; } catch (e) { return; }
      try { fn(w); } catch (e) {}
      try { for (var i = 0; i < w.frames.length; i++) visit(w.frames[i], depth + 1); } catch (e) {}
    };
    visit(W, 0);
  }
  function armAll() { eachWin(function (w) { armDoc(w.document); }); }

  /* ---------------------------------------------------------------- the four calls */
  /* a piece flies from one place to another; the real piece at the far end is already there, hidden under the flight.
     o.node: a copy made before the screen changed (the source may be gone by now); o.to may be a function that returns
     nothing yet (the phone's card is drawn on its next paint): the piece holds where it is until its place exists */
  function fly(o) {
    var a = topBox(o.from);
    if (!a) { if (o.onLand) try { o.onLand(false); } catch (e) {} return null; }
    var node = o.node || null;
    if (!node && isEl(o.from) && o.from.isConnected && o.plate !== true) { try { node = copyOf(o.from); } catch (e) { node = null; } }
    var m = begin(o, 'fly'); m.a = a; m.base = a;
    m.s = standIn(o, a, node, o.holes);
    var b = topBox(o.to);
    if (!b) { m.waiting = true; m.waitFrom = m.t0; return start(m); }
    takeOff(m, b);
    return start(m);
  }
  function takeOff(m, b) {
    m.b = b; m.waiting = false;
    if (m.reduced) {   /* a fade where it ends: the copy is laid there, the real one is under it */
      m.a = b; m.base = b; var s = m.s, put = function (k, v) { s.style.setProperty(k, v, 'important'); };
      put('left', b.x + 'px'); put('top', b.y + 'px'); put('width', b.w + 'px'); put('height', b.h + 'px'); put('transform', 'none');
    }
    var tgt = typeof m.o.to === 'function' ? (function () { try { return m.o.to(); } catch (e) { return null; } })() : m.o.to;
    if (isEl(tgt) && m.o.hideTo !== false) { m.real = tgt; m.realOp = tgt.style.opacity; setOp(tgt, '0'); }
    var t = epochNow(); if (m.waitFrom) m.row.waited = Math.round(t - m.waitFrom);
    plan(m, t);
  }
  function waitTick(m, t) {
    var b = topBox(m.o.to);
    if (m.o.poke) { try { m.o.poke(); } catch (e) {} }
    if (b) { if (m.o.snap) { land(m, true); return; } takeOff(m, b); pose(m, t); return; }
    boil(m);
    if (t - m.waitFrom > (m.o.waitMs || WAIT_MAX)) { m.row.why = 'its place never came'; land(m, false); }
  }
  /* the container transform: the real element is laid at its final box from the first frame (at opacity 0, so a tap
     already reaches it) and a plate grows out of the place it comes from; the plate hands over to the real thing as it
     lands (o.ready: not before the real screen is drawn) */
  function grow(o) {
    var el = o.el; if (!isEl(el)) return null;
    var b = topBox(el) || { x: 0, y: 0, w: W.innerWidth, h: W.innerHeight }, a = topBox(o.from) || { x: b.x + b.w / 2 - 20, y: b.y + b.h / 2 - 20, w: 40, h: 40 };
    var m = begin(o, 'grow'); m.a = m.reduced ? b : a; m.b = b; m.base = b;
    m.real = el; m.realOp = el.style.opacity; setOp(el, '0');
    m.s = standIn(o, b, null, o.holes);
    if (!m.reduced) m.s.style.setProperty('transform', 'translate(' + (a.x - b.x).toFixed(1) + 'px,' + (a.y - b.y).toFixed(1) + 'px) scale(' + (a.w / b.w).toFixed(4) + ',' + (a.h / b.h).toFixed(4) + ')', 'important');
    return start(m);
  }
  /* and back the way it came: the stand-in is made from the real thing as it is now, the real thing is taken away
     (o.remove, the screen's own close) in the same task, and the stand-in shrinks into the place it came from */
  function shrink(o) {
    var el = o.el, a = topBox(o.fromBox || el);
    if (!a) { if (o.remove) try { o.remove(); } catch (e) {} return null; }
    var pic = o.picture !== undefined ? o.picture : (isEl(el) ? pictureOf(el) : null);
    var oo = {}; for (var k in o) oo[k] = o[k]; oo.picture = pic;
    var m = begin(oo, 'shrink'); m.a = a; m.base = a;
    m.s = standIn(oo, a, null, o.holes);
    if (o.remove) { try { o.remove(); } catch (e) {} }
    var b = topBox(o.to) || { x: a.x + a.w / 2 - 20, y: a.y + a.h / 2 - 20, w: 40, h: 40 };
    m.b = m.reduced ? a : b;
    return start(m);
  }
  /* a piece that must not blink while what is under it changes: a copy holds its place until the real one is back */
  function hold(o) {
    var a = o.box ? topBox(o.box) : topBox(o.el), node = o.node || null;
    if (!a) return null;
    if (!node) { if (!isEl(o.el) || !shown(o.el)) return null; try { node = copyOf(o.el); } catch (e) { return null; } }
    var m = begin(o, 'hold'); m.a = m.b = m.base = a; m.max = epochNow() + (o.maxMs || 8 * beat().bm);
    m.s = standIn(o, a, node, null); m.t1 = m.max; m.holds = [m.max];
    return start(m);
  }
  function holdTick(m, t) {
    var back = false; try { back = !!(m.o.until && m.o.until()); } catch (e) {}
    if (m.o.release) { m.row.why = 'released'; land(m, false); return; }
    if (back || t >= m.max) { m.row.why = back ? 'the real one is back' : 'timed out'; land(m, false); }
  }

  /* ---------------------------------------------------------------- ids on both sides */
  function find(id) {
    var hit = null;
    eachWin(function (w) {
      if (hit) return;
      var list = w.document.querySelectorAll('[data-morph="' + id + '"]');
      for (var i = 0; i < list.length; i++) if (shown(list[i]) && !(list[i].closest && list[i].closest('#bmotion'))) { hit = list[i]; return; }
    });
    return hit;
  }
  function tag(el, id) { try { if (isEl(el) && el.getAttribute('data-morph') !== id) el.setAttribute('data-morph', id); } catch (e) {} return el; }
  function norm(s) { return String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); }

  /* ======================================================================================================================
     THE SCREENS. Each adapter wraps a screen's own door from here; AD says which are on.
     ====================================================================================================================== */
  var AD = {};
  function wrapFn(win, name, make) {
    var f = null; try { f = win[name]; } catch (e) {}
    if (typeof f !== 'function') return false;
    if (f.__bmWrapped) return true;
    /* once a call: if something else wraps the door after us and we wrap it again, the inner one only passes through */
    var inner = make(f), busy = false;
    var w = function () { if (busy) return f.apply(this, arguments); busy = true; try { return inner.apply(this, arguments); } finally { busy = false; } };
    w.__bmWrapped = true; w.__bmOrig = f;
    try { win[name] = w; } catch (e) { return false; }
    return win[name] === w;
  }
  function cityWin() { try { var f = D.getElementById('cityFrame'); return f && f.contentWindow && f.contentWindow.document ? f.contentWindow : null; } catch (e) { return null; } }
  function fightWin() { try { var f = D.getElementById('fightFrame'); return f && f.contentWindow && f.contentWindow.document ? f.contentWindow : null; } catch (e) { return null; } }
  /* the pieces that stay on the glass through a change: the bar and the phone, wherever they are drawn */
  function holes() {
    var out = [];
    ['bar', 'phone'].forEach(function (id) { var e = find(id); var b = e && topBox(e); if (b) out.push(b); });
    return out;
  }
  function cloudsThin() {
    try { var c = D.getElementById('nfclouds'); if (!c) return true; return (parseFloat(W.getComputedStyle(c).opacity) || 0) < 0.25; } catch (e) { return true; }
  }

  /* ---- THE TOWN AND THE CAMP (the map's frame; RUN, RUN TWO) ---- */
  /* where the town stands on the map: its buildings' box as the map last drew them, then a piece of map around it in the
     shape of the screen it grows into, so the first pose of the plate IS the map there, and it zooms in */
  function townSpot(cw, t, shape) {
    try {
      var cv = cw.document.getElementById('cv'); if (!cv || !t) return null;
      var r = cv.getBoundingClientRect(), list = cw.MAP_TOWN_HIT || [], hit = null;
      for (var i = 0; i < list.length; i++) if (norm(list[i].name) === norm(t.name)) hit = list[i];
      var b = null;
      if (hit && hit.bld) b = { x: r.left + hit.bld.x, y: r.top + hit.bld.y, w: hit.bld.w, h: hit.bld.h };
      else if (cw.__CITY && cw.__CITY.isoAt && t.x != null) { var p = cw.__CITY.isoAt(t.x, t.y); b = { x: r.left + p.sx - 27, y: r.top + p.sy - 20, w: 54, h: 30 }; }
      if (!b) return null;
      var spot = b;
      if (shape) {   /* the piece of map around it, in the screen's shape */
        var cx = b.x + b.w / 2, cy = b.y + b.h / 2, w = Math.max(90, Math.min(r.width * 0.6, b.w * 2.4)), h = w * shape.h / shape.w;
        spot = { x: cx - w / 2, y: cy - h / 2, w: w, h: h };
      }
      return { inDoc: spot, top: upFrom(cw.document, spot) };
    } catch (e) { return null; }
  }
  function campSpot(cw) {
    var e = find('camp'); if (e) return topBox(e);
    try { var c = cw.document.getElementById('campbtn'); return c ? topBox(c) : null; } catch (e2) { return null; }
  }
  /* THE ONE HUD, AT ONCE (UI's own two lines from hudTown in bohemia_ui_materials.js: the class that lays the town under the
     bar and the bar's height): its watcher on the town's frame is put on at its next half-second paint, so on the first open
     the frame stood over the bar and the phone for up to half a second. Laid here in the same task the frame opens. */
  function hudTownNow(cw, camp) {
    try {
      var d = cw.document, R = d.documentElement, host = d.getElementById('menubar');
      if (!d.getElementById('bmtb') || !host) return;
      R.classList.add('bm-town');
      if (camp !== undefined) R.classList.toggle('bm-camp', !!camp);   /* the camp keeps the phone (UI [no phone in the town]) */
      var h = Math.round(host.getBoundingClientRect().bottom) + 'px'; if (R.style.getPropertyValue('--bm-hud-h') !== h) R.style.setProperty('--bm-hud-h', h);
    } catch (e) {}
  }
  function hudLaid(cw) { try { return !cw.document.getElementById('bmtb') || cw.document.documentElement.classList.contains('bm-town'); } catch (e) { return true; } }
  function townReady(cw, name) {
    return function () {
      try {
        if (!hudLaid(cw)) { hudTownNow(cw, !!(cw.LOOP && cw.LOOP.open && cw.LOOP.open.camp)); return false; }
        if (!cw.LOOP || !cw.LOOP.ready) return false;
        var sd = cw.LOOP.frame.contentDocument, pn = sd && sd.getElementById('pname');
        if (!pn) return true;
        var a = norm(pn.textContent), b = norm(name);
        return !b || a === b || a.indexOf(b) >= 0 || b.indexOf(a) >= 0;
      } catch (e) { return true; }
    };
  }
  /* THE OLD PHONE IS NOT IN A TOWN (UI [no phone in the town], rule 211): it does not cut out, it folds into its own corner as
     the town grows (what leaves goes out the way it came), and on LEAVE it comes back out of that corner. UI TWO's corner phone
     (data-phone="corner") stays, so it is never folded. */
  var LASTPHONE = null;
  function cornerOf(b) { var s = Math.max(10, Math.min(b.w, b.h) * 0.18); return { x: b.x + b.w - s, y: b.y + b.h - s, w: s, h: s }; }
  function phoneEl(cw) { try { return cw.document.getElementById('cityfeed'); } catch (e) { return null; } }
  function phoneOut(cw, before) {
    var pe = phoneEl(cw); if (!before || !pe || shown(pe)) return;   /* still on the glass: nothing leaves */
    fly({ id: 'phone', kind: 'piece', from: before.box, node: before.node, to: cornerOf(before.box), hideTo: false, rivets: false, leave: true });
  }
  function phoneSnap(cw) {
    var pe = phoneEl(cw); if (!pe || !shown(pe) || pe.getAttribute('data-phone') === 'corner') return null;
    try { var b = topBox(pe); if (b) LASTPHONE = b; return { box: b, node: copyOf(pe) }; } catch (e) { return null; }
  }
  function phoneBack(cw, wasShown) {
    if (wasShown) return;
    /* the town's close is UI's hudTown in reverse, laid in the same task (its watcher would do it a microtask later) */
    try { var f = cw.LOOP && cw.LOOP.frame; if (!f || f.style.display === 'none') { cw.document.documentElement.classList.remove('bm-town'); cw.document.documentElement.classList.remove('bm-camp'); } } catch (e) {}
    var pe = phoneEl(cw); if (!pe || !shown(pe)) return;
    var b = topBox(pe), node = null; try { node = copyOf(pe); } catch (e) {}
    if (!b || !node) return;
    var was = pe.style.opacity; setOp(pe, '0');
    fly({ id: 'phone', kind: 'piece', from: cornerOf(b), node: node, to: b, hideTo: false, onLand: function () { setOp(pe, was); } });
  }
  function townFrameShown(cw) { try { return !!(cw.LOOP && cw.LOOP.frame && cw.LOOP.frame.style.display === 'block'); } catch (e) { return false; } }
  function installCity(cw) {
    AD.town = wrapFn(cw, 'loopOpenTown', function (orig) {
      return function (t) {
        var was = townFrameShown(cw), cv = cw.document.getElementById('cv');
        var shape = { w: cw.innerWidth || 390, h: cw.innerHeight || 844 };
        var sp = was ? null : townSpot(cw, t, shape);
        var pic = sp && cv ? cropOf(cv, sp.inDoc) : null;
        var ph = was ? null : phoneSnap(cw);
        var r = orig.apply(this, arguments);
        var f = cw.LOOP && cw.LOOP.frame;
        if (!was && f && townFrameShown(cw)) { hudTownNow(cw, false); phoneOut(cw, ph); }
        if (!was && f && townFrameShown(cw)) grow({ id: 'town', kind: 'mode', el: f, from: sp ? sp.top : null, picture: pic, label: t && t.name, holes: holes(), ready: townReady(cw, t && t.name) });
        return r;
      };
    });
    AD.leave = wrapFn(cw, 'loopClose', function (orig) {
      return function () {
        var self = this, args = arguments, f = cw.LOOP && cw.LOOP.frame, t = cw.LOOP && cw.LOOP.open;
        if (!f || !townFrameShown(cw)) return orig.apply(self, args);
        var r, camp = !!(t && t.camp), shape = { w: cw.innerWidth || 390, h: cw.innerHeight || 844 }, phoneWas = shown(phoneEl(cw));
        shrink({ id: camp ? 'camp' : 'town', kind: 'mode', el: f, label: camp ? 'CAMP' : (t && t.name), holes: holes(),
          to: function () { if (camp) return campSpot(cw); var s = townSpot(cw, t, shape); return s && s.top; },
          remove: function () { r = orig.apply(self, args); } });
        phoneBack(cw, phoneWas);
        return r;
      };
    });
    AD.camp = wrapFn(cw, 'campMake', function (orig) {
      return function () {
        var was = townFrameShown(cw), from = campSpot(cw);
        var r = orig.apply(this, arguments);
        var f = cw.LOOP && cw.LOOP.frame;
        if (r && !was && f && townFrameShown(cw)) hudTownNow(cw, true);
        if (r && !was && f && townFrameShown(cw)) grow({ id: 'camp', kind: 'mode', el: f, from: from, label: 'CAMP', plate: 'board_plain', holes: holes(), ready: (function (tr) { return function () { var ok = tr(); try { var L = f.contentWindow.BohemiaCampLook; if (!ok && cw.LOOP && cw.LOOP.ready && L && L.drawn && L.drawn()) ok = true; } catch (e) {} return ok; }; })(townReady(cw, 'YOUR CAMP')) });   /* __CAMP_TWO__: the camp's name is its clock ('DAY 1  14:00', never 'YOUR CAMP'), so the camp is ready when CAMP TWO's camp has drawn a frame; before, every camp waited out READY_MAX behind the plate, the pitch under it */
        return r;
      };
    });
  }

  /* ---- THE FIGHT (the shell's door; COMBAT, RUN): the bar and the phone stay over the clouds, the phone folds into his
     abilities as the clouds part, and on the way home the abilities fold back into the phone ---- */
  function abilities(fw) { try { var e = fw.document.getElementById('skills'); return e && shown(e) ? e : null; } catch (e2) { return null; } }
  function installTop() {
    AD.fight = wrapFn(W, 'nfOpen', function (orig) {
      return function () {
        var cw = cityWin(), bar = find('bar'), phone = find('phone');
        var bh = bar ? hold({ id: 'bar', el: bar, maxMs: 12000, until: function () { var fw = fightWin(), b = fw && fw.document.getElementById('bmtb'); return !!b && shown(b) && cloudsThin(); } }) : null;
        var pbox = phone ? topBox(phone) : null, pnode = null, phold = null; try { if (phone) { pnode = copyOf(phone); phold = copyOf(phone); } } catch (e) {}
        var ph = phold ? hold({ id: 'phone', node: phold, box: pbox, maxMs: 12000,
          until: function () { var fw = fightWin(); return !!(fw && abilities(fw)) && !(W.NFC && W.NFC.state === 'in'); },
          onLand: function (sk, hm) {
            /* the fold: the phone becomes his abilities, tin bending, landing in their tray */
            var fw = fightWin(), tray = fw && abilities(fw);
            if (tray && hm && hm.row.why !== 'timed out') fly({ id: 'phone', kind: 'mode', from: pbox, node: pnode, to: tray, hideTo: true });
          } }) : null;
        return orig.apply(this, arguments);
      };
    });
    AD.home = wrapFn(W, 'nfHome', function (orig) {
      return function () {
        var fw = fightWin(), fbar = fw && fw.document.getElementById('bmtb'), tray = fw && abilities(fw);
        var bbox = fbar && shown(fbar) ? topBox(fbar) : null, bnode = null, tbox = tray ? topBox(tray) : null, tnode = null;
        try { if (bbox) bnode = copyOf(fbar); } catch (e) {}
        try { if (tbox) tnode = copyOf(tray); } catch (e) {}
        var r = orig.apply(this, arguments);
        if (fightWin()) return r;   /* not home yet (the spoils wait first) */
        if (bnode) hold({ id: 'bar', node: bnode, box: bbox, maxMs: 6000, until: function () { var b = find('bar'); return !!b && cloudsThin(); } });
        /* the phone stays put away until his abilities have folded back into it: it never shows and then hides again */
        var cw = cityWin(), pe = null; try { pe = cw && cw.document.getElementById('cityfeed'); } catch (e) {}
        var was = pe ? pe.style.opacity : null; if (tnode && pe) setOp(pe, '0');
        if (tnode) fly({ id: 'phone', kind: 'mode', from: tbox, node: tnode, hideTo: false, waitMs: 3000,
          to: function () { if (!cloudsThin() || !pe || !shown(pe)) return null; return pe; },
          onLand: function () { if (pe) setOp(pe, was); } });
        return r;
      };
    });
  }

  /* ---- THE CREW SCREEN (the one door, engine/bohemia_crew_door.js; RUN TWO, UI): it grows out of the CREW you pressed and
     goes back into it. Watched, not wrapped: the door is one element (#crewdoor) on whichever page opened it ---- */
  function crewButton() { return find('crew'); }
  function watchCrew(doc) {
    if (!doc || doc.__bmotionCrew || !doc.body || !W.MutationObserver) return;
    doc.__bmotionCrew = true;
    var last = null;
    new W.MutationObserver(function (list) {
      list.forEach(function (mu) {
        Array.prototype.forEach.call(mu.addedNodes, function (n) {
          if (n.nodeType === 1 && n.id === 'crewdoor') { var from = crewButton(); last = { el: n, box: null };
            grow({ id: 'crew', kind: 'mode', el: n, from: from, label: 'YOUR COMPANY', onLand: function () { last.box = topBox(n); } }); }
        });
        Array.prototype.forEach.call(mu.removedNodes, function (n) {
          if (n.nodeType === 1 && n.id === 'crewdoor') {
            var box = (last && last.el === n && last.box) || { x: 0, y: 0, w: W.innerWidth, h: W.innerHeight };
            LIVE.filter(function (m) { return m.id === 'crew' && m.how === 'grow'; }).forEach(function (m) { land(m, true); });
            shrink({ id: 'crew', kind: 'mode', fromBox: box, picture: null, label: 'YOUR COMPANY', to: function () { return crewButton(); } });
            last = null;
          }
        });
      });
    }).observe(doc.body, { childList: true });
    AD.crew = true;
  }

  /* ---- THE TOWN'S SHOP AND BOARD (RUN TWO's settlement screen): BUY sends the item onto the man the card shows; TAKE sends
     the job's card into the phone's column. Read in the capture phase, before the screen redraws its card ---- */
  function watchTown(sw) {
    var doc = sw.document;
    if (!doc || doc.__bmotionTown || !doc.getElementById('sbody')) return;
    doc.__bmotionTown = true;
    doc.addEventListener('click', function (e) {
      try {
        var b = e.target && e.target.closest ? e.target.closest('button,[role=button],.act') : null;
        if (!b || !b.closest('#sbody') || b.disabled) return;
        var words = norm(b.textContent);
        if (words.indexOf('BUYIT') === 0) buyFlight(sw, b);
        else if (words.indexOf('TAKEIT') === 0 || (words.indexOf('DROP') === 0 && /TAKETHISONE$/.test(words))) takeFlight(sw, b);   /* 'Take it', 'Drop it and take this one', 'Drop <the job>, take this one' */
      } catch (_e) {}
    }, true);
    AD.buy = true; AD.take = true;
  }
  function itemTag(sw, b) {
    /* the item, as the shelf shows it: its own icon on the kit's amber tin, its name under it */
    var it = null;
    try { var S = sw.BohemiaSettlement && sw.BohemiaSettlement.state, id = S && S.shopShown && S.shopShown.item; if (id) for (var k in S.stock) (S.stock[k] || []).forEach(function (x) { if (x && x.id === id) it = x; }); } catch (e) {}
    var p = D.createElement('div');
    p.setAttribute('style', kitCSS('tin_amber', .75) + 'overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:9px;letter-spacing:1px;color:#1f1710;');
    var ic = null;
    try { var BM = sw.BohemiaMaterials || W.BohemiaMaterials; if (it && BM && BM.itemIcon) ic = BM.itemIcon(it, 44); } catch (e) {}
    if (ic && ic.tagName === 'CANVAS') { var c = D.createElement('canvas'); c.width = ic.width; c.height = ic.height; try { c.getContext('2d').drawImage(ic, 0, 0); } catch (e) {} ic = c; }
    if (ic && ic.style) { ic.style.width = '60%'; ic.style.height = 'auto'; ic.style.imageRendering = 'pixelated'; p.appendChild(ic); }
    var n = D.createElement('div'); n.textContent = it ? String(it.name).replace(/^(a|an) /i, '').toUpperCase() : 'YOURS'; n.style.cssText = 'white-space:nowrap;overflow:hidden;max-width:92%'; p.appendChild(n);
    return p;
  }
  function buyFlight(sw, b) {
    var doc = sw.document, face = doc.querySelector('#shopfaces button.on') || doc.querySelector('#shopfaces button');
    var from = topBox(b); if (!from) return;
    var sz = Math.min(64, Math.max(44, from.h * 1.3)), fromBox = { x: from.x + from.w / 2 - sz / 2, y: from.y + from.h / 2 - sz / 2, w: sz, h: sz };
    var tag0 = itemTag(sw, b);
    if (!face) { fly({ id: 'item', kind: 'piece', from: fromBox, node: tag0, to: { x: fromBox.x, y: fromBox.y - 120, w: sz * .6, h: sz * .6 } }); return; }
    /* the man the card shows stays where he was while his item lands on him, then the rivets fasten it */
    var fbox = topBox(face), fnode = null; try { fnode = copyOf(face); } catch (e) {}
    var man = fnode ? hold({ id: 'man', node: fnode, box: fbox, maxMs: 1200 }) : null;
    var onto = { x: fbox.x + fbox.w * .2, y: fbox.y + fbox.h * .15, w: fbox.w * .6, h: fbox.w * .6 };
    fly({ id: 'item', kind: 'piece', from: fromBox, node: tag0, to: onto, onLand: function () { if (man) { man.o.release = true; rivets(fbox); } } });
  }
  function takeFlight(sw, b) {
    var doc = sw.document, who = doc.querySelector('#sbody .who');
    var from = who ? topBox(who) : topBox(b); if (!from) return;
    var node = null; try { node = copyOf(who || b); } catch (e) {}
    var cw = cityWin();
    var before = {};
    try { Array.prototype.forEach.call(cw.document.querySelectorAll('#bmheld [data-held]'), function (e) { before[e.getAttribute('data-held')] = 1; }); } catch (e) {}
    var where = null, o = { id: 'job', kind: 'piece', from: from, node: node, waitMs: 1500,
      to: function () {
        try {
          var list = cw.document.querySelectorAll('#bmheld [data-held]');
          for (var i = 0; i < list.length; i++) if (!before[list[i].getAttribute('data-held')] && shown(list[i])) { where = 'the card'; o.leave = false; return list[i]; }
          /* no phone in the town (UI [no phone in the town]): the job goes into the phone where it folded, and is on it outside */
          var pe = phoneEl(cw);
          if (!pe || !shown(pe)) { where = 'the phone\'s corner'; o.leave = true; return cornerOf(LASTPHONE || { x: W.innerWidth - 160, y: 120, w: 156, h: 250 }); }
        } catch (e) {}
        return null;
      },
      onLand: function (sk, m) { if (m) m.row.onto = where; },
      poke: function () { try { if (cw.BohemiaPhoneBoard && cw.BohemiaPhoneBoard.paint) cw.BohemiaPhoneBoard.paint(); } catch (e) {} } };
    fly(o);
  }

  /* ---- THE WATCH: every document is armed for the stop cord, every shared piece wears its one id, every door is found ---- */
  function scan() {
    eachWin(function (w) {
      var doc = w.document;
      armDoc(doc);
      try {
        var bar = doc.getElementById('bmtb'); if (bar) tag(bar, 'bar');
        var ph = doc.getElementById('cityfeed'); if (ph) { tag(ph, 'phone'); if (shown(ph)) { var pb0 = topBox(ph); if (pb0) LASTPHONE = pb0; } }
        var cr = doc.querySelector('#bmtb .t.crew'); if (cr) tag(cr, 'crew');
        var cb = doc.getElementById('campbtn'); if (cb && !doc.querySelector('[data-morph="camp"]:not(#campbtn)')) tag(cb, 'camp');
        var sk = doc.getElementById('skills'); if (sk) tag(sk, 'abilities');
        var sf = doc.getElementById('settleFrame'); if (sf) tag(sf, 'town');
      } catch (e) {}
      watchCrew(doc);
      if (typeof w.loopOpenTown === 'function') installCity(w);
      if (w.BohemiaSettlement && doc.getElementById('sbody')) watchTown(w);
    });
    if (typeof W.nfOpen === 'function') installTop();
  }
  setInterval(scan, 400);
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', scan); else scan();

  W.BohemiaMotion = {
    version: '10/26a',
    fly: fly, grow: grow, shrink: shrink, hold: hold, skip: skip, find: find, tag: tag,
    box: topBox, copyOf: copyOf, pictureOf: pictureOf, cropOf: cropOf, reduced: reduced,
    busy: function () { return LIVE.length; },
    live: function () { return LIVE.map(function (m) { return { id: m.id, how: m.how, kind: m.kind, k: m.k, holds: m.holds ? m.holds.length : 0, waiting: m.waiting }; }); },
    log: LOG, taps: TAPS, adapters: AD,
    budget: { piece: [PIECE_MIN, 2 * PIECE_MIN], mode: [MODE_MIN, MODE_MIN + PIECE_MIN], ceiling: CEILING, fade: 200, wait: WAIT_MAX, ready: READY_MAX },
    clock: function () { var g = beat(); return { src: g.src, beatMs: g.bm, holdMs: g.bm / 6 }; },
    slowly: function (k) { SLOW = Math.max(1, +k || 1); return SLOW; }
  };
})();
