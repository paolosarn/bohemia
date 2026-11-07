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
                                                            (the bar and the phone while the door to a fight is covered)
   from / to: an element in any same-origin frame, a box {x, y, w, h} in the top glass's points, or (to) a function that
   returns either, read again every hold (a piece that is still being drawn, a camera that is still moving).
   ONE ID ON BOTH SIDES: a piece that lives on two screens carries data-morph="<id>" on both (bar, phone, crew, camp,
   abilities, town); BohemiaMotion.find(id) is the visible one, in whichever frame it is.

   THE FOUR PROMISES, and how each is kept:
   1. NOTHING CUTS, NOTHING BLINKS. The stand-in is put up in the same task that changes the screen, so it is painted in
      the same frame the old piece leaves; the real end state is laid out from the first frame and shown as the stand-in
      lands (the two overlap on the last hold, never a frame with neither). The bar and the phone stay on the glass
      through every change: the growing plate is cut around them, and over the fight's door (the zoom's held frame) they are held.
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
      /* __A_COPY_COSTS_WHAT_SHOWS__ (PLUMBER 4, ask line 454): a branch that is not drawn (display none) is copied as not drawn, its
         548 computed styles and its children's never read; it looks the same, because none of it was on the glass */
      if (cs.getPropertyValue('display') === 'none') { b.setAttribute('style', 'display:none'); ['id', 'data-morph', 'onclick', 'tabindex', 'role', 'aria-label', 'name', 'for'].forEach(function (k) { b.removeAttribute(k); }); while (b.firstChild) b.removeChild(b.firstChild); return b; }
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
  /* __A_COPY_COSTS_WHAT_SHOWS__ (PLUMBER 4, 11/5/26, ask line 454, rule 400(e), his brother: 'when you start a battle it glitches out a
     little'). MEASURED on the demo at 390 x 844 (records/BOHEMIA_PLUMBER_THE_BROTHERS_THREE_GLITCHES_11_5_26.md): the fight's door
     copied the phone (111 elements, every one of its 548 computed styles read) TWICE in the same instant, 104 ms a copy on this box
     at full speed and about four times that on a phone-shaped CPU, while the clouds were starting: the clouds stood still. A second
     copy of a copy is the same copy: it is cloned (its inline styles ride along) with its canvases' pixels drawn across. */
  function twinOf(n) {
    var c = n.cloneNode(true);
    var a = n.tagName === 'CANVAS' ? [n] : n.querySelectorAll('canvas'), b = c.tagName === 'CANVAS' ? [c] : c.querySelectorAll('canvas');
    for (var i = 0; i < a.length && i < b.length; i++) { try { b[i].getContext('2d').drawImage(a[i], 0, 0); } catch (e) {} }
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
    if (isEl(tgt) && m.how === 'fly' && o.hideTo !== false && tgt !== m.real) { if (m.real) giveBack(m.real, m.realOp); m.real = tgt; m.realOp = restOp(tgt); if (!m.done) setOp(tgt, '0'); }
  }
  function pose(m, t) {
    var k = holdIndex(m, t);
    var n = m.holds.length;
    /* __A_STALL_HOLDS__ (UI 11/2 round 2, ask 279: 'never a pop'): measured on the demo at phone size, LEAVE's shrink lost its first
       poses to the map's redraw (no frame for 107 to 143 ms) and landed 67% of the glass in one shown frame. Every pose is now shown
       on at least one drawn frame: when the clock has run past the next pose, the poses still owed slide later by the stall (logged as
       slipped), so a stall holds the picture and never jumps it */
    if (!m.reduced && typeof m.k === 'number' && k > m.k + 1 && m.k + 1 < n) {
      var j = m.k + 1, at = j > 0 ? m.holds[j - 1] : m.ts, dt = t - at;
      /* never past the morph's own budget (NN/g's 1,000 ms, promise 3): a stall longer than what is left lets the poses go */
      var cap = (m.kind === 'mode' ? CEILING : 2 * PIECE_MIN) - (m.t1 - (m.ts || m.t0)); if (dt > cap) dt = Math.max(0, cap);   /* a piece 500, a screen 1,000 */
      if (dt > 0) { for (var q = Math.max(0, j - 1); q < n; q++) m.holds[q] += dt; m.t1 += dt; m.row.slipped = (m.row.slipped | 0) + Math.round(dt); }
      k = holdIndex(m, t);
    }
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
    /* __A_STALL_HOLDS__ (UI 11/2 round 2): a whole screen growing or shrinking eases in AND out (a sine on the same holds): the emphasized
       curve took 55% of the travel on the first pose, so LEAVE uncovered half the map in one frame (65% of the glass); a piece keeps it */
    var x = Math.min(1, k / (n - 1)), p = n <= 1 ? 1 : (m.kind === 'mode' && (m.how === 'grow' || m.how === 'shrink')) ? 0.5 - 0.5 * Math.cos(Math.PI * x) : emphasized(x);
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
    if (m.s) m.s.style.setProperty('opacity', m.how === 'grow' ? '.67' : (m.how === 'shrink' || m.o.leave) ? '.5' : '1', 'important');
  }
  function fadePose(m, k, n) {
    /* REDUCED MOTION: nothing travels or grows. The stand-in, where it stands, dissolves; the real piece is there. */
    if (m.real) setOp(m.real, m.realOp);
    if (m.s) m.s.style.setProperty('opacity', String(Math.max(0, 1 - (k + 1) / (n + 1)).toFixed(2)), 'important');
  }
  function setOp(el, v) { try { if (v === null || v === undefined || v === '') el.style.removeProperty('opacity'); else el.style.setProperty('opacity', v); } catch (e) {} }
  /* __ONE_MORPH_A_DOOR__: what the real element's own opacity was before ANY morph hid it. A morph that starts while another has the
     element at 0 takes the saved one, never the 0; the last morph to give it back clears the save. */
  function restOp(el) { try { if (el.__bmHid) return el.__bmRest; el.__bmHid = 1; el.__bmRest = el.style.opacity; return el.__bmRest; } catch (e) { return ''; } }
  function giveBack(el, v) { setOp(el, v); try { if (el.__bmHid) { el.__bmHid = 0; el.__bmRest = undefined; } } catch (e) {} }
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
    if (m.real) giveBack(m.real, m.realOp);
    /* __A_STALL_HOLDS__ (UI 11/2 round 2): a grown screen's stand-in dissolves into the real one over three holds (.67, .33, gone),
       never the whole screen's content in one frame (the company screen measured 26% of the glass in one frame) */
    if (!skipped && m.how === 'grow' && m.s && !m.reduced) { var s0 = m.s; s0.style.setProperty('opacity', '.33', 'important'); setTimeout(function () { drop(s0); }, holdMs()); }
    else drop(m.s);
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
        if (DIVE.state !== 'off' && DIVE.state !== 'hold') { diveSkip(); TAPS.push({ t: Math.round(epochNow()), ids: ['dive:' + DIVE.state], frame: 'top', landed: e.target && e.target.id ? '#' + e.target.id : '?', type: e.type }); }
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
    if (isEl(tgt) && m.o.hideTo !== false) { m.real = tgt; m.realOp = restOp(tgt); setOp(tgt, '0'); }
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
    m.real = el; m.realOp = restOp(el); setOp(el, '0');
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
    /* __ONE_MORPH_A_DOOR__ (the coordinator 11/6, Paolo: 'when I click on the settlement... it doesn't display the settlement'): the
       busy flag was this wrapper's own, so a door wrapped twice by us with another lane's wrapper between (bohemia_real_places.js,
       11/6c, wraps loopOpenTown; the city's adapter is installed again after it) ran inner twice: two grows of the town, the second
       saving the first's opacity 0 as the screen's own and landing on it, the town invisible for good (measured on the demo: three
       setOp 0 from grow, handOff and land; the frame's style opacity 0 with no moment running). Now the flag is the window's, per
       door: the outer wrapper morphs, every wrapper inside it only passes through. */
    var inner = make(f), key = '__bmBusy_' + name;
    var w = function () { var busy = false; try { busy = !!win[key]; } catch (e) {} if (busy) return f.apply(this, arguments);
      try { win[key] = true; } catch (e) {} try { return inner.apply(this, arguments); } finally { try { win[key] = false; } catch (e) {} } };
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
  /* the door's covers are down (__THE_ZOOM_DOWN_INTO_THE_BOARD__: the clouds this used to read are gone, rule 405(a)) */
  function cloudsThin() { return diveClear(); }

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

  /* ---- THE FIGHT (the shell's door; COMBAT, RUN): the bar lifts off, the phone is held over the zoom down into the board
     (__THE_ZOOM_DOWN_INTO_THE_BOARD__, 11/6: the clouds are gone) and folds into his abilities as the board comes up; on the way home
     the abilities fold back into the phone ---- */
  function abilities(fw) { try { var e = fw.document.getElementById('skills'); return e && shown(e) ? e : null; } catch (e2) { return null; } }
  /* __NO_TOP_BAR_IN_THE_FIGHT__ (UI): the map's bar back to itself; also whenever no fight stands (a fight closed by another door) */
  function barBack() { try { var cw = cityWin(), b = cw && cw.document.querySelector('[data-bm-fight-gone]'); if (b) { setOp(b, null); b.removeAttribute('data-bm-fight-gone'); } } catch (e) {} }
  setInterval(function () { try { if (!fightWin() && !D.body.classList.contains('nf-on')) barBack(); } catch (e) {} }, 500);
  function installTop() {
    AD.fight = wrapFn(W, 'nfOpen', function (orig) {
      return function () {
        var cw = cityWin(), bar = find('bar'), phone = find('phone');
        /* __NO_TOP_BAR_IN_THE_FIGHT__ (UI, a marked block in MOTION's file, NOTE on MOTION's board; rule 280, Paolo 10/26: 'in combat
           it can completely go away'): the fight has no bar, so the map's is no longer held over the clouds waiting for one (it
           would hang there to its 12 s timeout); it LIFTS OFF the top of the glass as the clouds roll in, a piece leaving, and the
           map's own is out of sight under the clouds and the fight until the fight goes home (nfHome below puts it back first) */
        var bb = bar ? topBox(bar) : null, bn = null; try { if (bb) bn = copyOf(bar); } catch (e) { bn = null; }
        if (bb && bn) { setOp(bar, '0'); bar.setAttribute('data-bm-fight-gone', '1'); fly({ id: 'bar', kind: 'piece', from: bb, node: bn, to: { x: bb.x, y: -bb.h - 12, w: bb.w, h: bb.h }, hideTo: false, rivets: false, leave: true }); }
        /* ==== end __NO_TOP_BAR_IN_THE_FIGHT__ ==== */
        var pbox = phone ? topBox(phone) : null, pnode = null, phold = null; try { if (phone) { pnode = copyOf(phone); phold = twinOf(pnode); } } catch (e) {}   /* __A_COPY_COSTS_WHAT_SHOWS__: one copy, its twin cloned */
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
        /* __THE_ZOOM_DOWN_INTO_THE_BOARD__: the board's last frame laid on the glass before the fight's page goes */
        var going = false; try { going = !!(W.NF && W.NF.over && W.CITYFIGHT && !(W.SPOILS && W.SPOILS.d && !W.SPOILS.left)); } catch (e) {}
        var prep = going ? diveUpPrep() : null;
        barBack();   /* __NO_TOP_BAR_IN_THE_FIGHT__: the map's bar, lifted off at the door, is laid back under the fight before it goes */
        var r = orig.apply(this, arguments);
        if (fightWin()) { if (prep) { try { prep.pic.c.remove(); } catch (e) {} diveEnd(null); } return r; }   /* not home yet (the spoils wait first) */
        /* the map's bar comes back as the map does: out of sight under the covers, then down from the top as the climb starts */
        var mbar = find('bar'), mbox = mbar ? topBox(mbar) : null, mnode = null; try { if (mbox) mnode = copyOf(mbar); } catch (e) { mnode = null; }
        if (prep && mnode) setOp(mbar, '0');
        diveUp(prep, function () {
          if (!prep || !mnode || !mbar || !mbar.isConnected) return;
          setOp(mbar, null);
          fly({ id: 'bar', kind: 'piece', from: { x: mbox.x, y: -mbox.h - 12, w: mbox.w, h: mbox.h }, node: mnode, to: mbar, hideTo: true, rivets: false });
        });
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
            if (n.getAttribute('data-bm-folded')) { LIVE.filter(function (m) { return m.id === 'crew' && m.how === 'grow'; }).forEach(function (m) { land(m, true); }); last = null; return; }
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

  /* ======================================================================================================================
     __THE_ZOOM_DOWN_INTO_THE_BOARD__ (MOTION 11/6, rule 407(g) STEP TWO, rule 417(b), ask line 450; Paolo 11/4: 'I don't want
     even a real loading transition between combat, I low-key just wanna see it zoom in... as you zoom in that's what starts to
     unfold'). MEASURED BEFORE (the demo, 390 x 844): the door put three layers of painted cloud over the whole glass for the
     fight's build (the shell's __THE_ZOOM_GOES_THROUGH_CLOUDS__, rule 401(a)'s dive) and parted them over the fight: a loading
     picture, and the map and the board never seen as one place. COMBAT TWO's step one (b6f4215c) lays the board from the map's
     own block at one ruler (a map block 36 m is 3 x 3 fight tiles of 12 m), so the two can now be married on the glass.
     NOW, the clouds deleted in the same push (rule 405(a)):
       1 COME DOWN: on contact the MAP'S OWN CAMERA comes down from wherever he was to the street stop (WORLD 8's, a block 380
         px, where a house stands to his men as in the fight), the fight's block sliding to the map's focus; the map paints
         every frame of it (the same painter, the same houses as his pinch).
       2 HOLD: one copy of that last frame is laid on the glass (the map's own ground, never a loading picture) and the fight's
         page is built under it (its build holds the one thread for a beat or a few seconds on a phone; under the map's last
         frame that reads as the camera arriving, never a black or a brown screen).
       3 THE TURN (407(c), the coordinator's lead): the map is corner-on, a diamond; the fight is straight-on, a square grid. The
         copy turns an eighth of a circle and stands up (half as tall as wide to the fight's own aspect) about the fight's block
         over two beats, and the fight's board canvas is turned the SAME way backwards from where it will rest, so through
         every frame of the turn the two put the same street on the same pixels (an affine marriage: map block u, v -> the
         board's tiles 3u, 3v); the map fades into the board through the second half of the turn, where the angle is small.
       4 THE GRID LIGHTS UP: the fight's own tile lines scan onto the street from the far edge to the near (the board's own
         grid, through the turn's last half), hold a beat and fade to the board's own faint grid; the fight starts.
       5 OUT: the grid lights again over the board and fades, the board's last frame turns back to the map's angle while the
         map (drawn again at the street stop, same block) comes up under it, and the map's own camera climbs back to the zoom
         and the place he was at (his crew held, as the map always holds it).
     The look of it (the tape's roll, REC, a face; 407(h)) is for final (rule 404): this is the zoom that works.
     A fight the map cannot place (a board that was not laid from the map: a boss's, the arena) turns to the board's middle;
     a door that is not the map's (a town's raid) holds that screen's own last frame and fades. REDUCED MOTION: no zoom, no
     turn: the last frame held while the fight builds, then a 167 ms fade, both ways.
     window.NFC.state ('in' while a cover is up, 'off' once the fight or the map is his) is what the clouds' state was, so every
     check that waits for the door keeps working. BohemiaMotion.dive: down(d, go) / up / state() / log.
     Gate: gates/the_zoom_down_into_the_board_gate.js.
     ====================================================================================================================== */
  var TPB = 3;   /* a map block is 3 x 3 fight tiles: COMBAT TWO's one ruler (36 m / 12 m) */
  var DIVE = { state: 'off', at: null, el: null, raf: 0, skip: false, log: [], seq: 0, row: null, z0: null };
  var SCALE_MEM = {};   /* the fight's block size on the glass, px, the last time a fight opened on a glass this size */
  function nfcSet(s) { try { if (!W.NFC) W.NFC = { state: 'off' }; W.NFC.state = s; W.NFC.since = performance.now(); } catch (e) {} }
  function diveClear() { try { return !(W.NFC && W.NFC.state && W.NFC.state !== 'off'); } catch (e) { return true; } }
  function smoother(u) { u = Math.max(0, Math.min(1, u)); return u * u * u * (u * (u * 6 - 15) + 10); }
  function sstep(a, b, x) { var t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
  function mm(A, B) { return [A[0] * B[0] + A[1] * B[2], A[0] * B[1] + A[1] * B[3], A[2] * B[0] + A[3] * B[2], A[2] * B[1] + A[3] * B[3]]; }
  function minv(A) { var d = A[0] * A[3] - A[1] * A[2]; return [A[3] / d, -A[1] / d, -A[2] / d, A[0] / d]; }
  function map2(A, x, y) { return { x: A[0] * x + A[1] * y, y: A[2] * x + A[3] * y }; }
  function lerpP(a, b, e) { return { x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e }; }
  function cellOf(at) {
    if (!at) return null;
    var x = at.gx != null ? at.gx : at.x != null ? at.x : at[0], y = at.gy != null ? at.gy : at.y != null ? at.y : at[1];
    x = +x; y = +y; return isFinite(x) && isFinite(y) ? { gx: Math.floor(x), gy: Math.floor(y) } : null;
  }
  /* THE MAP'S OWN CAMERA, asked inside the map's own page (its zoom, pan and the crew it holds are that page's) */
  var CAM_BODY = "if (typeof CZOOM === 'undefined' || typeof MODE === 'undefined' || MODE !== 'city' || typeof cityGlidePos !== 'function') return null;"
    + "var G = cityGlidePos(performance.now());"
    + "if (op === 'read') { var zb = zoomBounds(), st = zb[1]; try { if (window.BohemiaMapHouses && BohemiaMapHouses.on()) st = Math.max(st, BohemiaMapHouses.streetTW() / TW0); } catch (e) {}"
    + "  return { z: CZOOM, px: panX, py: panY, TW0: TW0, TH0: TH0, CVW: CVW, CVH: CVH, F: mapFocus(), camf: !!CAMF.on, street: st, zmax: zb[1], city: [city.x, city.y], want: (typeof VBT !== 'undefined' && VBT) ? (VBT.want | 0) : 0 }; }"
    + "if (op === 'aim') { CZOOM = a.z; TW = TW0 * a.z; TH = TH0 * a.z;"
    + "  panX = a.sx - CVW / 2 + (G.x - G.y) * TW / 2 - (a.u - a.v) * TW / 2; panY = a.sy - CVH / 2 + (G.x + G.y) * TH / 2 - (a.u + a.v) * TH / 2;"
    + "  if (a.camf != null) { CAMF.on = !!a.camf; CAMF.from = null; } if (a.draw !== false) render(); return true; }"
    + "if (op === 'at') { var ox = Math.round(CVW / 2 - (G.x - G.y) * TW / 2 + panX), oy = Math.round(CVH / 2 - (G.x + G.y) * TH / 2 + panY);"
    + "  return { x: ox + (a.u - a.v) * TW / 2, y: oy + (a.u + a.v) * TH / 2, TW: TW, TH: TH }; }"
    + "if (op === 'heldAt') { var kz = CZOOM, kx = panX, ky = panY, r = null; CZOOM = a.z; TW = TW0 * a.z; TH = TH0 * a.z;"
    + "  try { var F = mapFocusRead(false).fo, p = camWorld(), c = camClampCentre(p), px = p.x - c.x + F.x, py = p.y - c.y + F.y;"
    + "    var ox2 = CVW / 2 - (G.x - G.y) * TW / 2 + px, oy2 = CVH / 2 - (G.x + G.y) * TH / 2 + py; r = { x: ox2 + (a.u - a.v) * TW / 2, y: oy2 + (a.u + a.v) * TH / 2 }; } catch (e) { r = null; }"
    + "  CZOOM = kz; TW = TW0 * kz; TH = TH0 * kz; panX = kx; panY = ky; return r; }"
    + "if (op === 'draw') { render(); return true; }"
    /* THE PAINTER ASKED FIRST FOR WHERE THE CAMERA IS GOING (WORLD's own painter, its own one-at-a-time ask): the tiles at the end
       zoom's detail round the fight's block, nearest first, so the street is painted while the camera comes down to it, never
       after. Returns how many of them are still missing (-1: no painter here). */
    + "if (op === 'prepaint') { if (typeof VBT === 'undefined' || typeof vbTileInput !== 'function' || typeof vbTileKey !== 'function' || typeof VB === 'undefined' || !VB_ONE_MAP || !VBC.key) return -1;"
    + "  var kz2 = CZOOM, kw = TW, kh = TH, miss = []; CZOOM = a.z; TW = TW0 * a.z; TH = TH0 * a.z;"
    + "  try { var S = vbTileS(), NT = Math.ceil(om.n / VB_TILE), R = a.r || 3;"
    + "    for (var ty = 0; ty < NT; ty++) for (var tx = 0; tx < NT; tx++) {"
    + "      var x0 = tx * VB_TILE, y0 = ty * VB_TILE; if (x0 > a.u + R || x0 + VB_TILE < a.u - R || y0 > a.v + R || y0 + VB_TILE < a.v - R) continue;"
    + "      if (VBT.tiles.has(vbTileKey(tx, ty, S))) continue; var dx = Math.max(x0 - a.u, 0, a.u - x0 - VB_TILE), dy = Math.max(y0 - a.v, 0, a.v - y0 - VB_TILE); miss.push({ tx: tx, ty: ty, d: dx * dx + dy * dy }); }"
    + "    miss.sort(function (p, q) { return p.d - q.d; });"
    + "    if (miss.length && !VBT.busy) { var inp = vbTileInput(miss[0].tx, miss[0].ty, S); VBT.busy = true; VBT.asked++; window.__DIVE_PREPAINT = (window.__DIVE_PREPAINT | 0) + 1;"
    + "      try { if (!VB.worker) VB.worker = vbWorker(); VB.worker.postMessage(inp, [inp.cls.buffer, inp.live.buffer, inp.sub.buffer]); } catch (e) { VBT.busy = false; } }"
    + "  } catch (e) { miss = null; }"
    + "  CZOOM = kz2; TW = kw; TH = kh; return miss ? miss.length : -1; }"
    + "return null;";
  var DRAWMS = 0;   /* the map's own draw time inside the dive's steps (its own cost, WORLD's and PLUMBER's), kept apart from the dive's */
  function mapCam(cw) {
    if (!cw) return null;
    try { if (!cw.__bmDiveCam) cw.__bmDiveCam = new cw.Function('op', 'a', CAM_BODY); } catch (e) { return null; }
    var f = cw.__bmDiveCam;
    return function (op, a) { var t = performance.now(), drew = op === 'draw' || (op === 'aim' && (!a || a.draw !== false));
      try { return f(op, a || {}); } catch (e) { return null; } finally { if (drew) DRAWMS += performance.now() - t; } };
  }
  function mapCanvas(cw) { try { var c = cw.document.getElementById('cv'); return c && shown(c) ? c : null; } catch (e) { return null; } }
  /* where the map puts map ground (u, v) on the top glass, and its two axes there (px per block) */
  function mapGeo(cw, cam, u, v) {
    var p = cam('at', { u: u, v: v }), cv = mapCanvas(cw); if (!p || !cv) return null;
    var r = cv.getBoundingClientRect(), o = upFrom(cw.document, { x: r.left + p.x, y: r.top + p.y, w: 1, h: 1 });
    return { c: { x: o.x, y: o.y }, M: [p.TW / 2, -p.TW / 2, p.TH / 2, p.TH / 2], sm: p.TW / Math.SQRT2, km: p.TH / p.TW };
  }
  /* the fight's own state (a const in its page, so asked inside it) */
  function fightOf(fw) { try { if (!fw.__bmFight) fw.__bmFight = new fw.Function('return typeof FIGHT !== "undefined" ? FIGHT : null'); return fw.__bmFight(); } catch (e) { return null; } }
  /* where the fight puts the same ground, read live off its own camera (sx, sy); the board's tile 0 is the valley's tile BX */
  function fightGeo(fw, at) {
    try {
      var F = fightOf(fw), U = fw.FIGHT_UI, S = F && F.S; if (!S || !U || !U.board || typeof fw.sx !== 'function' || !at) return null;
      var st = S.boardDef && S.boardDef.street, laid = !!(S.boardDef && S.boardDef.laid && st && st.cell), BX, BY;
      if (laid) { var sh = st.shift || [0, 0]; BX = TPB * st.cell[0] + (TPB >> 1) - (S.w >> 1) + (sh[0] | 0); BY = TPB * st.cell[1] + (TPB >> 1) - (S.h >> 1) + (sh[1] | 0); }
      else { BX = TPB * at.gx + TPB / 2 - S.w / 2; BY = TPB * at.gy + TPB / 2 - S.h / 2; }   /* not the map's own block: its middle stands for the fight's block */
      var u = at.gx + 0.5, v = at.gy + 0.5, z = U.zoom;
      var o = upFrom(fw.document, { x: fw.sx((TPB * u - BX) * U.tw), y: fw.sy((TPB * v - BY) * U.th), w: 1, h: 1 });
      if (W.__DIVE_MUTATE === 'offset') o.x += 40;   /* the gate's mutation (the board turned onto the wrong street), never set by the game */
      var o0 = upFrom(fw.document, { x: fw.sx(0), y: fw.sy(0), w: 1, h: 1 });
      return { c: { x: o.x, y: o.y }, M: [TPB * U.tw * z, 0, 0, TPB * U.th * z], a: TPB * U.tw * z, b: TPB * U.th * z, laid: laid, cell: laid ? [st.cell[0], st.cell[1]] : null,
        w: S.w, h: S.h, o0: o0, tx: U.tw * z, ty: U.th * z };
    } catch (e) { return null; }
  }
  /* the turn: the map's corner-on axes (e = 0) to the fight's straight-on ones (e = 1): an eighth of a circle, the aspect from the
     map's half to the fight's own, the size from one to the other on the log (streetCam's own path, RUN 10/26) */
  function turnA(mg, fg, e) {
    var phi = Math.PI / 4 * (1 - e), s = Math.exp(Math.log(mg.sm) + (Math.log(fg.a) - Math.log(mg.sm)) * e), k = mg.km + (fg.b / fg.a - mg.km) * e;
    var c = Math.cos(phi), sn = Math.sin(phi);
    return [s * c, -s * sn, k * s * sn, k * s * c];
  }
  /* an element whose layout box starts at box (top glass), carrying point 'from' to 'to' by L about it */
  function cssM(L, box, from, to) {
    var q = map2(L, box.x - from.x, box.y - from.y);
    return 'matrix(' + [L[0], L[2], L[1], L[3], q.x + to.x - box.x, q.y + to.y - box.y].map(function (v) { return (+v).toFixed(5); }).join(',') + ')';
  }
  function diveLayer() {
    if (DIVE.el && DIVE.el.isConnected) return DIVE.el;
    var el = D.createElement('div'); el.id = 'bmdive';
    /* over the map's and the fight's panels, under the phone (z 60 to 70) and the motion layer's pieces */
    el.style.cssText = 'position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:55;pointer-events:none;overflow:hidden;contain:strict;background:transparent';
    D.body.appendChild(el); DIVE.el = el; return el;
  }
  function snapOf(cv, cls) {
    var b = topBox(cv); if (!b || !cv.width || !cv.height) return null;
    var c = D.createElement('canvas'); c.width = cv.width; c.height = cv.height; c.className = cls;
    try { c.getContext('2d').drawImage(cv, 0, 0); } catch (e) { return null; }
    c.style.cssText = 'position:absolute;left:' + b.x + 'px;top:' + b.y + 'px;width:' + b.w + 'px;height:' + b.h + 'px;transform-origin:0 0;will-change:transform,opacity';
    diveLayer().appendChild(c);
    return { c: c, box: b };
  }
  function gridCanvas() {
    var c = D.createElement('canvas'), k = Math.min(2, W.devicePixelRatio || 1); c.className = 'grid';   /* two pixels a point at most: the clear of a full 3x glass cost a frame 4 ms */
    c.width = Math.round(W.innerWidth * k); c.height = Math.round(W.innerHeight * k);
    c.style.cssText = 'position:absolute;left:0;top:0;width:100vw;height:100vh';
    diveLayer().appendChild(c); return c;
  }
  /* THE GRID LIGHTS UP: the board's own tile lines, the far edge first (scan 0..1), through the turn's map L about from -> to */
  function gridDraw(gc, fg, L, from, to, alpha, scan) {
    var x = gc.getContext('2d'), k = gc.width / Math.max(1, W.innerWidth), blank = !fg || alpha <= 0.01 || scan <= 0;
    if (blank && gc.__bmBlank) return;   /* nothing to draw and nothing drawn: no clear */
    x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, gc.width, gc.height); gc.__bmBlank = blank;
    if (blank) return;
    var P = function (i, j) { var q = map2(L, fg.o0.x + i * fg.tx - from.x, fg.o0.y + j * fg.ty - from.y); return { x: (q.x + to.x) * k, y: (q.y + to.y) * k }; };
    var hy = fg.h * Math.min(1, scan), lw = Math.max(1, Math.round(k));
    x.lineWidth = lw; x.strokeStyle = 'rgba(231,214,170,' + (0.5 * alpha).toFixed(3) + ')';
    x.beginPath();
    for (var i = 0; i <= fg.w; i++) { var a = P(i, 0), b = P(i, hy); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); }
    for (var j = 0; j <= Math.floor(hy); j++) { var c = P(0, j), d = P(fg.w, j); x.moveTo(c.x, c.y); x.lineTo(d.x, d.y); }
    x.stroke();
    if (scan < 1) {   /* the scan's own line, brighter, where it is writing */
      x.lineWidth = lw * 2; x.strokeStyle = 'rgba(244,232,196,' + (0.85 * alpha).toFixed(3) + ')';
      var e0 = P(0, hy), e1 = P(fg.w, hy); x.beginPath(); x.moveTo(e0.x, e0.y); x.lineTo(e1.x, e1.y); x.stroke();
    }
  }
  /* THE CORNERS OF THE TURN: a turned picture leaves the glass's corners; under the turning board (inside the fight's page, beneath
     its own canvas, first in its page) lie the same two frames standing still, the map's fading as the map's does and the board's first frame, so a
     corner shows this street, never black (rule 404: no black or brown bars) */
  function underlays(fw, fc, pic) {
    var out = { map: null, board: null, gone: function () { try { if (out.map) out.map.remove(); } catch (e) {} try { if (out.board) out.board.remove(); } catch (e) {} } };
    try {
      var fd = fw.document, fr = fw.frameElement.getBoundingClientRect(), mk = function (src, b, cls) {
        var c = fd.createElement('canvas'); c.width = Math.round(b.w); c.height = Math.round(b.h); c.className = 'bmdive-' + cls; c.getContext('2d').drawImage(src, 0, 0, c.width, c.height);   /* a point a pixel: they are only the corners */
        c.style.cssText = 'position:fixed;left:' + (b.x - fr.left) + 'px;top:' + (b.y - fr.top) + 'px;width:' + b.w + 'px;height:' + b.h + 'px;pointer-events:none';   /* positioned, first in the page: painted before its canvas, over its background */
        fd.body.insertBefore(c, fd.body.firstChild); return c; };
      out.board = mk(fc, topBox(fc), 'board');
      out.map = mk(pic.c, pic.box, 'map');
    } catch (e) {}
    return out;
  }
  function keepOf(pic, mg) {
    try { var b = pic.box, c = D.createElement('canvas'); c.width = Math.round(b.w); c.height = Math.round(b.h); c.getContext('2d').drawImage(pic.c, 0, 0, c.width, c.height);
      return { c: c, box: { x: b.x, y: b.y, w: b.w, h: b.h }, mg: mg, glass: Math.round(W.innerWidth) + 'x' + Math.round(W.innerHeight), at: DIVE.at }; } catch (e) { return null; }
  }
  function keptSnap(k, cls) {
    var c = D.createElement('canvas'); c.width = k.c.width; c.height = k.c.height; c.className = cls; c.getContext('2d').drawImage(k.c, 0, 0);
    c.style.cssText = 'position:absolute;left:' + k.box.x + 'px;top:' + k.box.y + 'px;width:' + k.box.w + 'px;height:' + k.box.h + 'px;transform-origin:0 0;will-change:transform,opacity';
    diveLayer().appendChild(c); return { c: c, box: k.box };
  }
  function diveRow(kind) {
    var r = { n: ++DIVE.seq, kind: kind, t0: performance.now(), phases: {}, frames: 0, gaps: [], worst: 0, over33: 0, skipped: false, reduced: reduced(), at: DIVE.at ? [DIVE.at.gx, DIVE.at.gy] : null,
      laid: null, z0: null, z1: null, align: null, covers: { map: 0, board: 0, none: 0 }, err: null, done: false };
    DIVE.row = r; DIVE.log.push(r); if (DIVE.log.length > 12) DIVE.log.shift(); return r;
  }
  /* while nothing under the covers is his yet (the come-down, the hold, the way out's grid and turn) the layer takes a tap (it skips
     the motion, the stop cord) so a finger never starts a journey on a map that is leaving or reaches a fight not yet shown */
  var TAKES = { come: 1, settle: 1, hold: 1, grid: 0, turn: 0, fade: 0, climb: 0 };
  function phase(r, name) { if (!r) return; var t = performance.now(); r.phases[name] = Math.round(t - r.t0); DIVE.state = name;
    var take = r.kind === 'down' ? !!TAKES[name] : (name === 'grid' || name === 'turn');
    try { diveLayer().style.pointerEvents = take ? 'auto' : 'none'; } catch (e) {} }
  /* one frame loop for every phase: step(u, now) until u reaches 1 (a tap: at once) */
  function run(r, ms, step, done) {
    var t0 = performance.now(), last = t0;
    var f = function () {
      var now = performance.now(), gap = now - last; last = now;
      if (r && gap > 0.5) { r.frames++; r.gaps.push(Math.round(gap)); if (r.gaps.length > 400) r.gaps.shift(); if (gap > r.worst) r.worst = Math.round(gap); if (gap > 33.4) r.over33++; }
      var u = DIVE.skip ? 1 : Math.min(1, (now - t0) / Math.max(1, ms * SLOW));
      var s0 = performance.now(), d0 = DRAWMS;
      try { step(u, now); } catch (e) { if (r) r.err = String(e && e.message || e); u = 1; }
      if (r) { var own = performance.now() - s0 - (DRAWMS - d0); if (own > (r.ownMax || 0)) r.ownMax = +own.toFixed(2); r.drawMax = Math.max(r.drawMax || 0, +(DRAWMS - d0).toFixed(1)); }
      if (u < 1) DIVE.raf = W.requestAnimationFrame(f); else { DIVE.raf = 0; DIVE.skip = false; done(); }
    };
    DIVE.raf = W.requestAnimationFrame(f);
  }
  function diveEnd(r) {
    try { if (DIVE.raf) W.cancelAnimationFrame(DIVE.raf); } catch (e) {} DIVE.raf = 0;
    try { var fw = fightWin(), fc = fw && fw.document.getElementById('cv'); if (fc) { fc.style.removeProperty('transform'); fc.style.removeProperty('opacity'); } } catch (e) {}
    try { if (DIVE.el) DIVE.el.remove(); } catch (e) {} DIVE.el = null; DIVE.skip = false;
    DIVE.state = 'off'; nfcSet('off');
    if (r) { r.done = true; r.ms = Math.round(performance.now() - r.t0); }
  }
  function fade(r, el, ms, then) {
    run(r, ms, function (u) { el.style.opacity = String(1 - u); }, then);
  }
  function beatNow() { return beat().bm; }

  /* ---- THE WAY IN ---- */
  function diveDown(d, go) {
    if (DIVE.state !== 'off') diveEnd(DIVE.row);
    var cw = cityWin(), cam = mapCam(cw), c = cam ? cam('read') : null;
    DIVE.at = cellOf(d && d.at) || (c ? { gx: Math.floor(c.city[0]), gy: Math.floor(c.city[1]) } : null);
    var r = diveRow('down'); nfcSet('in'); phase(r, 'come');
    var built = false, build = function () { if (built) return; built = true; try { go(); } catch (e) { r.err = String(e && e.message || e); } };
    /* the fight's page is ready: its ground built, its board drawn */
    var fightUp = function () { var fw = fightWin(); try { var l = fw && fw.document.getElementById('load'); return !!(fw && l && l.style.display === 'none' && fw.FIGHT_UI && fw.FIGHT_UI.board); } catch (e) { return false; } };
    var waitFight = function (then) {
      phase(r, 'hold'); var t0 = performance.now(), seen = 0;
      var f = function () {
        if (fightUp()) seen++;
        if (seen >= 2 || performance.now() - t0 > 20000) { r.built = Math.round(performance.now() - t0); r.timedOut = seen < 2; then(); return; }
        DIVE.raf = W.requestAnimationFrame(f);
      };
      DIVE.raf = W.requestAnimationFrame(f);
    };
    /* no map camera here (a town's door, a page with no map): that screen's own last frame held, the fight built under it, a fade */
    var plain = function () {
      var pic = null, src = null;
      try { var tf = cw && cw.LOOP && cw.LOOP.frame; if (tf && tf.style.display === 'block' && tf.contentWindow) src = pictureOf(tf.contentDocument.body); } catch (e) {}
      try { if (!src && cw) src = mapCanvas(cw) || pictureOf(cw.document.body); } catch (e) {}
      if (src && src.tagName === 'CANVAS' && W.__DIVE_MUTATE !== 'bare') pic = snapOf(src, 'map');
      r.plain = true; build();
      waitFight(function () { phase(r, 'fade'); if (!pic) { diveEnd(r); return; } nfcSet('off'); fade(r, pic.c, reduced() ? 167 : 300, function () { diveEnd(r); }); });
      return true;
    };
    if (!c || !DIVE.at || reduced()) return plain();
    r.z0 = c.z; DIVE.z0 = { z: c.z, camf: c.camf, at: null };
    /* where the camera stops: at the fight's own size, so the turn has nothing left to zoom (the size the last fight on this glass
       opened at; the first fight: a block a third of the glass's short side, the phone's measured 132 px), never past the street
       stop nor short of the map's near stop */
    var gk = Math.round(W.innerWidth) + 'x' + Math.round(W.innerHeight), aGuess = SCALE_MEM[gk] || Math.max(100, Math.min(260, 0.34 * Math.min(W.innerWidth, W.innerHeight)));
    var u0 = DIVE.at.gx + 0.5, v0 = DIVE.at.gy + 0.5, zEnd = Math.max(c.zmax || 0, Math.min(c.street, aGuess * Math.SQRT2 / c.TW0)), p0 = cam('at', { u: u0, v: v0 }) || c.F;
    r.guess = Math.round(aGuess); r.prepaint = cam('prepaint', { z: zEnd, u: u0, v: v0, r: 3 });
    DIVE.z0.at = { x: p0.x, y: p0.y }; r.z1 = zEnd;
    /* 1 COME DOWN, on the map's own camera: the zoom on the log, the fight's block sliding to the focus; one beat for a short way,
       two and a half for the whole valley down to the street */
    var ratio = Math.abs(Math.log(zEnd / Math.max(1e-3, c.z))), ms = Math.max(beatNow(), Math.min(2.5 * beatNow(), 0.36 * beatNow() * ratio + beatNow() * 0.5));
    r.comeMs = Math.round(ms);
    run(r, ms, function (u) {
      var e = smoother(u), z = Math.exp(Math.log(c.z) + (Math.log(zEnd) - Math.log(c.z)) * e), s = lerpP(p0, c.F, smoother(Math.min(1, u * 1.15)));
      cam('prepaint', { z: zEnd, u: u0, v: v0, r: 3 });
      cam('aim', { z: z, u: u0, v: v0, sx: s.x, sy: s.y, camf: false });
      r.covers.map++;
    }, function () {
      /* SETTLE: at the stop the map sharpens in place while the painter lands the fight's street (a beat and a half at most) */
      phase(r, 'settle');
      run(r, 1.5 * beatNow(), function (u) {
        var m = cam('prepaint', { z: zEnd, u: u0, v: v0, r: 1 }); cam('draw'); r.covers.map++;
        if (m <= 0 && u < 1) DIVE.skip = true;   /* sharp: on at once */
        r.missing = m;
      }, hold);
    });
    var hold = function () {
      /* 2 HOLD: the map's last frame, laid on the glass; the fight's page is built under it */
      var cv = W.__DIVE_MUTATE === 'bare' ? null : mapCanvas(cw), mg = mapGeo(cw, cam, u0, v0), pic = cv ? snapOf(cv, 'map') : null;   /* 'bare': the gate's mutation, no frame held */
      if (!pic || !mg) { r.err = r.err || 'no map frame to hold'; return plain(); }
      DIVE.mg = mg; DIVE.zEnd = zEnd; build();
      waitFight(function () {
        var fw = fightWin(), fc = fw && fw.document.getElementById('cv'), fg = fw ? fightGeo(fw, DIVE.at) : null;
        if (!fw || !fc || !fg) { phase(r, 'fade'); nfcSet('off'); fade(r, pic.c, 300, function () { diveEnd(r); }); return; }
        r.laid = fg.laid; r.cell = fg.cell; fc.style.removeProperty('transform'); SCALE_MEM[gk] = fg.a; r.a = Math.round(fg.a);
        var fbox = topBox(fc), gc = gridCanvas(), under = underlays(fw, fc, pic);
        DIVE.keep = keepOf(pic, mg);   /* a small copy of the map's frame for the way out (the painter lets its pictures go in a fight) */
        /* 3 THE TURN, both pictures together; 4 the grid scans on through its second half */
        phase(r, 'turn');
        run(r, 2 * beatNow(), function (u) {
          var g = fightGeo(fw, DIVE.at) || fg, e = smoother(u), A = turnA(mg, g, e), to = lerpP(mg.c, g.c, e);
          pic.c.style.transform = cssM(mm(A, minv(mg.M)), pic.box, mg.c, to);
          var Lf = mm(A, minv(g.M));
          fc.style.transform = cssM(Lf, fbox, g.c, to);
          var a = 1 - sstep(0.45, 0.85, u); pic.c.style.opacity = a.toFixed(3); if (under.map) under.map.style.opacity = a.toFixed(3);
          /* while the map's frame still covers it, the board and its still copy are not composited at all (a layer at opacity 0 is
             skipped): half the pictures for the first half of the turn */
          var hid = u < 0.42 ? '0' : ''; if (fc.style.opacity !== hid) fc.style.opacity = hid; if (under.board && under.board.style.opacity !== hid) under.board.style.opacity = hid;
          if (a > 0.5) r.covers.map++; else r.covers.board++;
          gridDraw(gc, g, Lf, g.c, to, sstep(0.5, 0.7, u), sstep(0.5, 1, u));
          if (u >= 1) {
            r.align = { mapAt: [Math.round(to.x), Math.round(to.y)], boardAt: [Math.round(g.c.x), Math.round(g.c.y)], scale: +(mg.sm / g.a).toFixed(3) };
            /* raw, for a check that does not go through this file's geometry: the map frame's own transform, where the map drew the
               block before the turn, and the fight's own camera functions at this frame */
            try { var Uf = fw.FIGHT_UI, fr0 = fw.frameElement.getBoundingClientRect();
              r.end = { tf: pic.c.style.transform, box: pic.box, map0: mg.c, sx0: fw.sx(0), sy0: fw.sy(0), tw: Uf.tw * Uf.zoom, th: Uf.th * Uf.zoom, fx: fr0.left, fy: fr0.top }; } catch (e) {}
          }
        }, function () {
          fc.style.removeProperty('transform'); fc.style.removeProperty('opacity'); try { pic.c.remove(); } catch (e) {} under.gone();
          nfcSet('off'); phase(r, 'grid');   /* the fight is his from here; the grid holds a beat and fades to the board's own */
          run(r, 2 * beatNow(), function (u) { var g = fightGeo(fw, DIVE.at) || fg; gridDraw(gc, g, [1, 0, 0, 1], g.c, g.c, 1 - sstep(0.5, 1, u), 1); }, function () { diveEnd(r); });
        });
      });
    };
    return true;
  }

  /* ---- THE WAY OUT: before the fight's page goes (prep), then after (go) ---- */
  function diveUpPrep() {
    if (DIVE.state !== 'off') diveEnd(DIVE.row);
    var fw = fightWin(), fc = fw && fw.document.getElementById('cv'); if (!fw || !fc) return null;
    if (!DIVE.at) { try { DIVE.at = cellOf(W.NF && W.NF.opts && W.NF.opts.cell); } catch (e) {} }
    var fg = DIVE.at ? fightGeo(fw, DIVE.at) : null, pic = snapOf(fc, 'board');
    if (!pic) return null;
    nfcSet('in');
    return { pic: pic, fg: fg };
  }
  function diveUp(prep, back) {
    if (!prep) { if (back) back(); return; }
    var r = diveRow('up'), pic = prep.pic, fg = prep.fg, K = DIVE.keep, gc = fg ? gridCanvas() : null;
    phase(r, 'grid');
    var done = function () { DIVE.keep = null; diveEnd(r); }, landed = function () { try { if (back) back(); } catch (e) {} };
    var cw = cityWin(), cam = mapCam(cw), z0 = DIVE.z0, at = (K && K.at) || DIVE.at;
    var u0 = at ? at.gx + 0.5 : null, v0 = at ? at.gy + 0.5 : null, c = cam ? cam('read') : null, zS = c ? (DIVE.zEnd || c.street) : 0;
    var fits = !!(K && K.glass === Math.round(W.innerWidth) + 'x' + Math.round(W.innerHeight));
    if (!c || u0 == null || reduced() || !fg || !fits) {
      r.plain = true;
      var k = 0, wait = function () { if (++k < 3) { W.requestAnimationFrame(wait); return; } phase(r, 'fade'); nfcSet('off'); landed();
        fade(r, pic.c, reduced() ? 167 : 300, done); };
      W.requestAnimationFrame(wait); return;
    }
    r.z1 = zS; r.z0 = z0 ? z0.z : null;
    /* under the covers the map is laid back at the stop over the fight's block and asks its painter for that street again (it let
       its pictures go while the fight stood); over it, the map's frame from the way in, standing still (the turn's corners) and
       turning (the marriage), and over those the board's last frame */
    var mg = K.mg, under = keptSnap(K, 'map-still'), mp = keptSnap(K, 'map');
    try { DIVE.el.insertBefore(under.c, DIVE.el.firstChild); DIVE.el.insertBefore(mp.c, pic.c); } catch (e) {}
    var live = function () { cam('prepaint', { z: zS, u: u0, v: v0, r: 2 }); cam('aim', { z: zS, u: u0, v: v0, sx: c.F.x, sy: c.F.y, camf: false, draw: true }); };
    live();
    mp.c.style.transform = cssM(mm(fg.M, minv(mg.M)), mp.box, mg.c, fg.c);
    /* the grid lights over the board and starts to fade (a beat) */
    run(r, beatNow(), function (u) { live(); if (gc) gridDraw(gc, fg, [1, 0, 0, 1], fg.c, fg.c, 1 - 0.5 * sstep(0.3, 1, u), 1); r.covers.board++; }, function () {
      /* 5 THE TURN BACK: the board's frame to the map's angle, the map's frame with it, the board fading into the map */
      phase(r, 'turn');
      run(r, 2 * beatNow(), function (u) {
        live();
        var e = smoother(1 - u), A = turnA(mg, fg, e), to = lerpP(mg.c, fg.c, e), Lf = mm(A, minv(fg.M));
        pic.c.style.transform = cssM(Lf, pic.box, fg.c, to);
        mp.c.style.transform = cssM(mm(A, minv(mg.M)), mp.box, mg.c, to);
        var a = sstep(0.45, 0.85, 1 - u); pic.c.style.opacity = a.toFixed(3);
        if (a > 0.5) r.covers.board++; else r.covers.map++;
        if (gc) gridDraw(gc, fg, Lf, fg.c, to, 0.5 * (1 - sstep(0, 0.6, u)), 1);
      }, function () {
        try { pic.c.remove(); mp.c.remove(); if (gc) gc.remove(); } catch (e) {}
        nfcSet('off'); landed(); live();
        /* the map's frame from the way in gives way to the live map in the same place, then 6 THE CLIMB: the map's own camera back to
           the zoom he was at, his crew held as the map holds it */
        phase(r, 'climb');
        var zTo = z0 ? z0.z : c.z, held = !z0 || z0.camf, pTo = z0 && z0.at ? z0.at : null;
        var ratio = Math.abs(Math.log(zS / Math.max(1e-3, zTo))), ms = Math.max(beatNow(), Math.min(2.5 * beatNow(), 0.36 * beatNow() * ratio + beatNow() * 0.5));
        r.missing = cam('prepaint', { z: zS, u: u0, v: v0, r: 1 });
        run(r, ms, function (u) {
          under.c.style.opacity = (1 - sstep(0, 0.25, u)).toFixed(3);
          var e = smoother(u), z = Math.exp(Math.log(zS) + (Math.log(zTo) - Math.log(zS)) * e);
          var aim = held ? (cam('heldAt', { z: z, u: u0, v: v0 }) || c.F) : (pTo || c.F), s = lerpP(c.F, aim, smoother(Math.min(1, u * 1.15)));
          cam('aim', { z: z, u: u0, v: v0, sx: s.x, sy: s.y, camf: false });
          r.covers.map++;
        }, function () {
          if (held) { var h = cam('heldAt', { z: zTo, u: u0, v: v0 }); if (h) cam('aim', { z: zTo, u: u0, v: v0, sx: h.x, sy: h.y, camf: true }); }
          else if (pTo) cam('aim', { z: zTo, u: u0, v: v0, sx: pTo.x, sy: pTo.y, camf: false });
          DIVE.z0 = null; done();
        });
      });
    });
  }
  function diveSkip() { if (DIVE.state !== 'off' && DIVE.state !== 'hold') DIVE.skip = true; }

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
    /* __THE_ZOOM_DOWN_INTO_THE_BOARD__: the shell's nfOpen hands its build to down(d, go); nfHome is wrapped (AD.home) */
    dive: { down: diveDown, state: function () { return DIVE.state; }, log: DIVE.log, at: function () { return DIVE.at; }, clear: diveClear },
    budget: { piece: [PIECE_MIN, 2 * PIECE_MIN], mode: [MODE_MIN, MODE_MIN + PIECE_MIN], ceiling: CEILING, fade: 200, wait: WAIT_MAX, ready: READY_MAX },
    clock: function () { var g = beat(); return { src: g.src, beatMs: g.bm, holdMs: g.bm / 6 }; },
    slowly: function (k) { SLOW = Math.max(1, +k || 1); return SLOW; }
  };
})();
