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
        if (!ok && t - m.t1 < READY_MAX) { if (!m.readyWait) { m.readyWait = true; m.row.waitedReady = 0; } m.row.waitedReady = Math.round(t - m.t1); if (m.o.whyNot) { try { m.row.whyNot = m.o.whyNot(); } catch (e) {} } boil(m); return; }
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
    if (m.s) m.s.style.setProperty('opacity', m.how === 'grow' ? '.75' : (m.how === 'shrink' || m.o.leave) ? '.5' : '1', 'important');
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
    if (m.how === 'real') { realLand(m, skipped); return; }   /* __THE_REST_OF_THE_STATES__: the real thing lands on itself */
    if (m.done) return;
    m.done = true; m.skipped = skipped;
    if (m.real) giveBack(m.real, m.realOp);
    /* __A_STALL_HOLDS__ (UI 11/2 round 2): a grown screen's stand-in dissolves into the real one over three holds (.67, .33, gone),
       never the whole screen's content in one frame (the company screen measured 26% of the glass in one frame).
       __THE_REST_OF_THE_STATES__ (MOTION 3, 11/8): MEASURED on the demo, the crew screen's last step was still 38% of the glass in one
       frame (the board plate at a third over the see-through company screen, then gone) and the town's 10%: now FOUR steps of a quarter
       (.75 on the landing hold, .5, .25, gone), a hold each */
    if (!skipped && m.how === 'grow' && m.s && !m.reduced) { var s0 = m.s, hm0 = holdMs(); s0.style.setProperty('opacity', '.5', 'important'); setTimeout(function () { s0.style.setProperty('opacity', '.25', 'important'); }, hm0); setTimeout(function () { drop(s0); }, 2 * hm0); }
    else drop(m.s);
    var i = LIVE.indexOf(m); if (i >= 0) LIVE.splice(i, 1);
    var t = epochNow();
    m.row.t1 = Math.round(t); m.row.ms = Math.round(t - m.t0); m.row.flew = Math.round(t - (m.ts || m.t0)); m.row.planned = Math.round(m.t1 - (m.ts || m.t0));
    m.row.holds = m.holds ? m.holds.length : 0; m.row.frames = m.frames; m.row.gaps = m.gaps; m.row.skipped = skipped;
    if (!m.reduced && !skipped && m.how !== 'hold' && m.how !== 'shrink' && m.b && m.o.rivets !== false && !m.o.leave) rivets(m.b);
    if (m.o.onLand) { try { m.o.onLand(skipped, m); } catch (e) {} }
  }
  function tickOne(m, t) {
    if (m.how === 'real') { realTick(m, t); return; }   /* __THE_REST_OF_THE_STATES__ */
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
      if (m.frames === 1 && m.how !== 'hold' && m.how !== 'real' && !m.waiting && !m.reduced && t - m.ts > holdMs()) { m.row.stall = Math.round(t - m.ts); plan(m, t); }
      /* the honest count: is a form of this piece on the glass in this frame (the stand-in, or the real piece shown); a real piece
         (__THE_REST_OF_THE_STATES__) is on the glass while it is laid out, or waiting unseen for its page to be drawn */
      var on = m.how === 'real' ? (m.waitReady || (m.el.isConnected && shown(m.el))) : ((m.s && m.s.isConnected) || (m.real && shown(m.real) && opacityOf(m.real) > 0.01));
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
      /* __THE_REST_OF_THE_STATES__: the real piece coming in is what his finger is on; it holds its pose until the tap is through
         (the press and the lift land on the same button), then lands. One going out takes no finger: it lands now. */
      if (m.how === 'real') { if (why === 'tap' && m.dir === 'in' && !m.reduced && !m.waitReady && m.anim) { if (!m.frozen) { m.frozen = epochNow(); m.row.frozen = 1; try { m.anim.pause(); } catch (e) {} } } else realLand(m, true); return; }
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
      /* __THE_REST_OF_THE_STATES__: where the finger went down, on every page (what a detail grows out of), and a held piece let go
         once the tap is through: on its click, or 350 ms after the lift when no click comes (a drag) */
      doc.addEventListener('pointerdown', function (e) { try { lastTap(doc, e); } catch (_e) {} }, true);
      var letGo = function () { setTimeout(function () { LIVE.slice().forEach(function (m) { if (m.how === 'real' && m.frozen) realLand(m, true); }); }, 0); };
      doc.addEventListener('click', letGo, true);
      doc.addEventListener('pointercancel', letGo, true);
      doc.addEventListener('pointerup', function () { setTimeout(function () { LIVE.slice().forEach(function (m) { if (m.how === 'real' && m.frozen && epochNow() - m.frozen > 300) realLand(m, true); }); }, 350); }, true);
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
        /* __ONE_MORPH_A_DOOR__ (MOTION 3, 11/8): MEASURED on the demo, HEAL on the map logged TWO grows of the same frame (the town's,
           from campMake opening its camp through this door, and the camp's): the camp's door is the camp's morph alone */
        try { if (cw.__bmBusy_campMake) return orig.apply(this, arguments); } catch (_e) {}
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
        /* __ONE_MORPH_A_DOOR__ (MOTION 3, 11/8): the frame's own opacity BEFORE the camp's door runs is its rest. Inside the door
           WORLD's moment between eases the camp screen up from 0 (BohemiaBetween), and a grow that saved that 0 as the rest gave it
           back at its landing: the camp screen stood invisible for the whole camp (measured on the demo once the town's second grow
           was taken off this door; the second grow had been saving the true rest first, by luck of order) */
        var f0 = cw.LOOP && cw.LOOP.frame, op0 = null; try { if (f0 && !f0.__bmHid) op0 = f0.style.opacity; } catch (e) {}
        var r = orig.apply(this, arguments);
        var f = cw.LOOP && cw.LOOP.frame;
        try { if (f && f === f0 && op0 !== null && !f.__bmHid) { f.__bmHid = 1; f.__bmRest = op0 === '0' ? '' : op0; } } catch (e) {}
        if (r && !was && f && townFrameShown(cw)) hudTownNow(cw, true);
        if (r && !was && f && townFrameShown(cw) && campHeld()) { try { if (typeof cw.btwFinish === 'function') cw.btwFinish(); } catch (e) {} if (CAMPHOLD.row) CAMPHOLD.row.made = Math.round(performance.now() - CAMPHOLD.row.t0); return r; }   /* __THE_CAMP_IS_SET_UP_WHILE_HE_WATCHES__: made under the held board, at rest at once (no grow, the moment between landed) */
        if (r && !was && f && townFrameShown(cw)) grow({ id: 'camp', kind: 'mode', el: f, from: from, label: 'CAMP', plate: 'board_plain', holes: holes(), whyNot: function () { try { var pn = f.contentDocument && f.contentDocument.getElementById('pname'); return 'hud ' + hudLaid(cw) + ', ready ' + !!(cw.LOOP && cw.LOOP.ready) + ', name ' + (pn ? JSON.stringify(pn.textContent) : 'none'); } catch (e) { return String(e).slice(0, 60); } }, ready: (function (tr) { return function () { var ok = tr(); try { var L = f.contentWindow.BohemiaCampLook; if (!ok && cw.LOOP && cw.LOOP.ready && L && L.drawn && L.drawn()) ok = true; if (!ok && cw.LOOP && cw.LOOP.ready && hudLaid(cw)) { var pn = f.contentDocument.getElementById('pname'); if (pn && /\bDAY\s+\d/i.test(pn.textContent || '')) ok = true; } if (!ok && hudLaid(cw)) { var BS = f.contentWindow.BohemiaSettlement; if (BS && BS.ready && BS.ready() && BS.state && BS.state.camp) ok = true; } if (!ok) { var on = cw.LOOP && cw.LOOP.open; if (on && on.name && !on.camp && townReady(cw, on.name)()) ok = true; } } catch (e) {} return ok; }; })(townReady(cw, 'YOUR CAMP')) });   /* __CAMP_TWO__: the camp's name is its clock ('DAY 1  14:00', never 'YOUR CAMP'), so the camp is ready when CAMP TWO's camp has drawn a frame; before, every camp waited out READY_MAX behind the plate, the pitch under it. MOTION 3 11/8: MEASURED, BohemiaCampLook.drawn() answers false on the demo now (the camp drawn by CAMP THREE's screen), so the wait was back to the full 2 s: the camp is also ready when its clock is on its name plate (the screen has laid it), or when the settlement screen says it is ready and it is a camp, or (HEAL in a town rests there, CAMP rule 273(b): measured, the plate read 'Cartel' and waited 2 s) when the place that opened is drawn under its own name */
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
        if (bb && bn) { setOp(bar, '0'); bar.setAttribute('data-bm-fight-gone', '1'); gpuFly('bar', bn, bb, { x: bb.x, y: -bb.h - 12, w: bb.w, h: bb.h }); }   /* MOTION 2 11/8: on the compositor (the page's thread is the dive's) */
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
        var prep = going ? diveUpPrep() : null, held = going && campHeld();   /* __THE_CAMP_IS_SET_UP_WHILE_HE_WATCHES__ */
        barBack();   /* __NO_TOP_BAR_IN_THE_FIGHT__: the map's bar, lifted off at the door, is laid back under the fight before it goes */
        var r = orig.apply(this, arguments);
        if (fightWin()) { if (prep) { try { prep.pic.c.remove(); } catch (e) {} diveEnd(null); } return r; }   /* not home yet (the spoils wait first) */
        /* the map's bar comes back as the map does: out of sight under the covers, then down from the top as the climb starts */
        if (held && prep) campHoldUp(prep);   /* __THE_CAMP_IS_SET_UP_WHILE_HE_WATCHES__: the board stays on the glass, no climb */
        var mbar = find('bar'), mbox = mbar ? topBox(mbar) : null, mnode = null; try { if (mbox && !(held && prep)) mnode = copyOf(mbar); } catch (e) { mnode = null; }
        if (prep && mnode) setOp(mbar, '0');
        if (!(held && prep)) diveUp(prep, function () {
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
    /* his crew where the map draws it now (the glide's own position), for the brackets that find his men (MOTION 2, rule 420) */
    + "if (op === 'crew') { var ox3 = Math.round(CVW / 2 - (G.x - G.y) * TW / 2 + panX), oy3 = Math.round(CVH / 2 - (G.x + G.y) * TH / 2 + panY); return { x: ox3 + (G.x - G.y) * TW / 2, y: oy3 + (G.x + G.y + 1) * TH / 2 }; }"
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
  /* ======================================================================================================================
     __THE_WAY_INTO_A_FIGHT__ (MOTION 2, 11/7, rule 420, ask line 480; Paolo 11/7: 'the transition from the map to the combat right
     now is still kind of shit'). WATCHED FIRST, frame by frame (the demo, 390 x 844 at 3 with the CPU at 4x, and the computer; every
     frame the compositor sent, screencast): the come-down was 5 frames (the map drawn on every step, 200 to 260 ms a draw there), the
     hold ONE still picture for 5.8 s, the turn 4 frames with the map's edge a hard seam across the board, the way out's turn and climb
     ONE frame each (two cuts), the bar's band left black over the held frame, his crew gone with the map and the board's men just there.
     NOW THE DIVE IS PLAYED BY THE COMPOSITOR, never by the main thread: every move is a Web Animation of transform and opacity on a
     held picture, which the browser plays on its compositor thread at the screen's rate while the main thread draws the map at its
     next zoom, builds the fight and decodes its board (measured on this box at 4x: a frame every 17 ms through a 600 ms block).
       1 COME DOWN: the map as it stands (A) is scaled down onto the fight's block; under it the map is drawn ONCE at the halfway zoom
         (B) and ONCE at the stop (C), each laid in on the same clock where it is sharp (nothing drawn twice; C drawn once more only if
         the stop's tiles, asked ahead from the first frame, land after it). The stop is scaled to cover the glass: the bar's band under
         the map's canvas is never left bare. The fight's page is built as soon as C is held, a second sooner than before.
       2 THE TAPE TRACKS OUT while it builds: the camera keeps lowering (a slow push-in), two tracking bands made of the frame's own
         pixels roll down it, REC and a running timecode (the world's own hour) burn in at the corner, the music drops to its own hum.
       3 THE TURN: the board's first frame (F) is held; C and F turn together (the affine marriage, 407(c)), the tape tracks back in,
         the grid scans on line by line from the far edge like a surveillance overlay, and a bracket finds every man: it starts where
         the map had his crew (or theirs, at the contact's block) and lands on his tile.
       4 THE BOARD LANDS: its colours bleed (its own red and its green-blue a few pixels apart, closing), the music opens back up,
         the grid holds a beat and fades, REC goes out. The fight is his from the end of the turn.
       5 THE WAY OUT climbs back the same way: the grid scans on over the board's last frame and the tape tracks out while the map is
         drawn under it at the halfway zoom and where he was; the board and the way-in's frame turn back together, and the camera
         climbs through those pictures to the live map, his crew held, the music opening as it climbs.
     REDUCED MOTION and a door with no map camera: as before (the frame held, a 167 ms fade). Gate: gates/the_zoom_down_into_the_board_gate.js
     (its rule-420 legs read the compositor's own frames off a trace on the phone profile at 4x).
     ====================================================================================================================== */
  function diveLayer() {
    if (DIVE.el && DIVE.el.isConnected) return DIVE.el;
    var el = D.createElement('div'); el.id = 'bmdive';
    /* over the map's and the fight's panels, under the phone (z 60 to 70) and the motion layer's pieces */
    el.style.cssText = 'position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:55;pointer-events:none;overflow:hidden;contain:strict;background:transparent';
    D.body.appendChild(el); DIVE.el = el; return el;
  }
  function divEl(cls, css, parent) { var g = D.createElement('div'); g.className = cls; g.style.cssText = css || ''; (parent || diveLayer()).appendChild(g); return g; }
  function glassCSS() { return 'position:absolute;left:0;top:0;width:' + W.innerWidth + 'px;height:' + W.innerHeight + 'px;transform-origin:0 0'; }
  /* a picture of src laid at box on the glass; k: pixels a point (none: the source's own pixels) */
  function picOf(src, box, cls, k, parent) {
    if (!src || !box || !src.width || !src.height) return null;
    var w = src.width, h = src.height;
    if (k) { w = Math.max(1, Math.round(box.w * k)); h = Math.max(1, Math.round(box.h * k)); }
    var c = D.createElement('canvas'); c.width = w; c.height = h; c.className = cls;
    try { c.getContext('2d').drawImage(src, 0, 0, w, h); } catch (e) { return null; }
    c.style.cssText = 'position:absolute;left:' + box.x + 'px;top:' + box.y + 'px;width:' + box.w + 'px;height:' + box.h + 'px;transform-origin:0 0;will-change:transform,opacity';
    (parent || diveLayer()).appendChild(c);
    return { c: c, box: { x: box.x, y: box.y, w: box.w, h: box.h } };
  }
  function snapOf(cv, cls) { var b = topBox(cv); return b ? picOf(cv, b, cls) : null; }
  /* ONE WEB ANIMATION, played by the compositor (transform and opacity only) */
  function play(el, frames, ms, o) {
    o = o || {};
    try {
      var a = el.animate(frames, { duration: Math.max(1, ms * SLOW), delay: (o.delay || 0) * SLOW, fill: o.fill || 'both', easing: o.easing || 'linear', iterations: o.iter || 1, direction: o.dir || 'normal' });
      if (o.start != null) a.startTime = o.start;
      if (o.iter !== Infinity) DIVE.anims.push(a);
      return a;
    } catch (e) { try { if (DIVE.row) DIVE.row.err = (DIVE.row.err ? DIVE.row.err + ' | ' : '') + 'play: ' + String(e && e.message || e).slice(0, 120); } catch (_e) {} return null; }
  }
  function keys(n, fn) { var out = []; for (var i = 0; i <= n; i++) { var u = i / n, f = fn(u); f.offset = u; out.push(f); } return out; }
  /* after the frame that shows what was just laid has gone to the compositor: a long draw in fn never holds that frame back */
  function afterPaint(fn) { W.requestAnimationFrame(function () { setTimeout(fn, 0); }); }
  function later(fn, ms) { var o = { fn: fn, id: 0 }; o.id = setTimeout(function () { o.done = true; fn(); }, Math.max(0, ms * SLOW)); DIVE.timers.push(o); return o; }
  /* the map's picture drawn at zoom zk with the block at sk (its canvas's own points), shown as the camera stands at P = { z, s } */
  function poseOf(P, zk, sk) { var k = P.z / zk; return 'translate(' + (P.s.x - k * sk.x).toFixed(2) + 'px,' + (P.s.y - k * sk.y).toFixed(2) + 'px) scale(' + k.toFixed(5) + ')'; }
  /* how much the stop's picture is scaled about the block so it covers the whole glass (the bar's band under the map's canvas) */
  function coverK(cb, F) {
    var Wg = W.innerWidth, Hg = W.innerHeight, k = 1;
    if (F.x > 1) k = Math.max(k, (cb.x + F.x) / F.x);
    if (cb.w - F.x > 1) k = Math.max(k, (Wg - cb.x - F.x) / (cb.w - F.x));
    if (F.y > 1) k = Math.max(k, (cb.y + F.y) / F.y);
    if (cb.h - F.y > 1) k = Math.max(k, (Hg - cb.y - F.y) / (cb.h - F.y));
    return Math.min(1.6, k > 1 ? k + 0.004 : 1);
  }
  /* where the map puts map ground (u, v) on the glass and its two axes there (px per block), from its camera alone */
  function mgOf(cam, cb, fx, fy, u, v) {
    var p = cam('at', { u: u, v: v }); if (!p) return null;
    var TWc = p.TW * fx, THc = p.TH * fy;
    return { c: { x: cb.x + p.x * fx, y: cb.y + p.y * fy }, M: [TWc / 2, -TWc / 2, THc / 2, THc / 2], sm: TWc / Math.SQRT2, km: THc / TWc };
  }
  /* how far a picture drawn with the block at sk (its canvas's points) must be scaled to cover the glass when the camera puts the block
     at s: the most any side asks */
  function coverFor(cb, sk, s) {
    var Wg = W.innerWidth, Hg = W.innerHeight, k = 1;
    if (sk.x > 1) k = Math.max(k, (cb.x + s.x) / sk.x);
    if (cb.w - sk.x > 1) k = Math.max(k, (Wg - cb.x - s.x) / (cb.w - sk.x));
    if (sk.y > 1) k = Math.max(k, (cb.y + s.y) / sk.y);
    if (cb.h - sk.y > 1) k = Math.max(k, (Hg - cb.y - s.y) / (cb.h - sk.y));
    return Math.min(2, k + 0.004);
  }
  /* the world's own hour, for the tape's timecode */
  function worldClock(cw) { try { if (!cw.__bmClock) cw.__bmClock = new cw.Function("try { return { d: T.day, m: T.min }; } catch (e) { return null; }"); return cw.__bmClock(); } catch (e) { return null; } }

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
  /* ---- __THE_DIVE_GOES_THROUGH_THE_CLOUDS__ (MOTION 2, 11/8, rule 401(a), ask line 442; his vote 11/6 on the zoom down: 'Needs more
     better'; rule 430: the art stays, a piece improved, never thrown away). Paolo 11/4: 'when it's combat time the clouds aren't just on
     a brown black background but zooming in from the city from how you have it zoomed in'. THE OLD CLOUDS' OWN ART (RUN 10/2,
     __THE_ZOOM_GOES_THROUGH_CLOUDS__, deleted 11/6 with its loading look): the valley's dust and ash, a billow field lit from above (the
     rim) and dark beneath, the bible's grain, smoothed so a cloud is a billow and never a block. KEPT: its two billow layers, the same
     painter, the same palette, the same shapes. DROPPED: its third layer, the solid dusk floor, which WAS the brown backdrop he hated.
     Painted ONCE, a few rows at a time in the page's idle time (never at the door), at half the glass's points and 1.4 times its size;
     the dive scales them on the compositor: the deck seen from above, the camera coming down through it (the near layer growing faster,
     both parting off the glass's edges round the block), the real city under and between the billows in every frame, clear below it
     well before the stop. The way out climbs back up through the same deck. A dive too short to pass a deck has none. ---- */
  var CLOUDS = { c: null, ready: false, key: '', busy: false, y: 0, L: 0, im: null, ms: 0 };
  function cloudHash(x, y, s) { var h = (s ^ Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263)) >>> 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
  function cloudNoise(x, y, s) { var xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi, u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
    var a = cloudHash(xi, yi, s), b = cloudHash(xi + 1, yi, s), c = cloudHash(xi, yi + 1, s), d = cloudHash(xi + 1, yi + 1, s); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; }
  function cloudField(xx, yy, sc, s) { return cloudNoise(xx / sc, yy / (sc * 0.55), s) * 0.62 + cloudNoise(xx / sc * 2.2, yy / (sc * 0.55) * 2.2, s + 3) * 0.26 + cloudNoise(xx / sc * 5, yy / (sc * 0.55) * 5, s + 5) * 0.12; }
  function hexRGB(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
  var CLOUD_LAY = [ { sc: 34, cut: 0.53, body: hexRGB('#4a3e31'), rim: hexRGB('#6e5d47'), under: hexRGB('#2f261d'), seed: 98 },     /* the old layer 1 */
                    { sc: 46, cut: 0.6, body: hexRGB('#7a6850'), rim: hexRGB('#a8936c'), under: hexRGB('#54463a'), seed: 105 } ];   /* the old layer 2 */
  var CLOUD_RES = 2;
  function cloudsPrep() {
    var key = Math.round(W.innerWidth) + 'x' + Math.round(W.innerHeight);
    if (CLOUDS.busy || (CLOUDS.ready && CLOUDS.key === key) || reduced()) return;
    var w = Math.max(128, Math.round(W.innerWidth * 1.4 / CLOUD_RES)), h = Math.max(128, Math.round(W.innerHeight * 1.4 / CLOUD_RES));
    CLOUDS.busy = true; CLOUDS.ready = false; CLOUDS.key = key; CLOUDS.c = []; CLOUDS.L = 0; CLOUDS.y = 0; CLOUDS.ms = 0;
    for (var L = 0; L < CLOUD_LAY.length; L++) { var c = D.createElement('canvas'); c.width = w; c.height = h; CLOUDS.c.push(c); }
    var step = function (dl) {
      var t0 = performance.now();
      try {
        while (CLOUDS.L < CLOUD_LAY.length) {
          var c = CLOUDS.c[CLOUDS.L], x = c.getContext('2d'), Ly = CLOUD_LAY[CLOUDS.L], sc = Ly.sc * 4 / CLOUD_RES, off = 8 / CLOUD_RES;
          if (!CLOUDS.im) CLOUDS.im = x.createImageData(w, h);
          var dta = CLOUDS.im.data, rows = 0;
          while (CLOUDS.y < h) {
            var yy = CLOUDS.y;
            for (var xx = 0; xx < w; xx++) {
              var o = (yy * w + xx) * 4, n = cloudField(xx, yy, sc, Ly.seed);
              if (n < Ly.cut - 0.07) { dta[o + 3] = 0; continue; }
              var up = cloudField(xx, yy - off, sc, Ly.seed), dn = cloudField(xx, yy + off, sc, Ly.seed);
              /* IMPROVED, never thrown away (rule 430): the old cut was a hard edge (a camouflage blob over the real city); the same
                 billow now thins out at its edge, and its light is mixed, not switched */
              var rl = sstep(0.06, -0.02, up - Ly.cut), dk = sstep(0.07, -0.01, dn - Ly.cut) * (1 - rl), bd = 1 - rl - dk;
              var gr = 1 + (cloudHash(xx, yy, 8 + CLOUDS.L) - 0.5) * 0.08;   /* grain, the bible's */
              for (var ch = 0; ch < 3; ch++) dta[o + ch] = (Ly.body[ch] * bd + Ly.rim[ch] * rl + Ly.under[ch] * dk) * gr;
              dta[o + 3] = Math.round(255 * sstep(Ly.cut - 0.07, Ly.cut + 0.12, n));
            }
            CLOUDS.y++; rows++;
            if (rows >= 6 && ((dl && dl.timeRemaining && dl.timeRemaining() < 2) || performance.now() - t0 > 8)) { CLOUDS.ms += performance.now() - t0; return again(); }
          }
          x.putImageData(CLOUDS.im, 0, 0); CLOUDS.im = null; CLOUDS.y = 0; CLOUDS.L++;
        }
        CLOUDS.ms += performance.now() - t0; CLOUDS.ready = true; CLOUDS.busy = false;
      } catch (e) { CLOUDS.busy = false; CLOUDS.err = String(e && e.message || e); }
    };
    var again = function () { if (W.requestIdleCallback) W.requestIdleCallback(step, { timeout: 1500 }); else setTimeout(step, 30); };
    again();
  }
  /* the deck on the glass for one dive: two layers over the map's pictures, under the tape; f(u) is the camera's path (z, s: the
     block's point on the glass); one way down (u 0..1) or, with up, the same deck climbed back through */
  function cloudsOn(parent, f, ms, Lz, delay, up) {
    if (!CLOUDS.ready || reduced() || Math.abs(Lz) < Math.log(2.5)) return null;
    var Wg = W.innerWidth, Hg = W.innerHeight, bx = -0.2 * Wg, by = -0.2 * Hg, N = 36, out = [];
    /* thin enough that the real city reads through the thickest of it (seen at 0.78 / 0.7: a tan wash, the brown look he hated) */
    var LAYS = [ { g: 1.45, k0: 0.85, a: 0.58, inA: 0.02, inB: 0.2, outA: 0.42, outB: 0.7, dx: -0.05 },     /* the far deck */
                 { g: 2.1, k0: 0.75, a: 0.5, inA: 0.08, inB: 0.26, outA: 0.32, outB: 0.58, dx: 0.06 } ];   /* the near one, passed first */
    var span = Math.min(1, Math.abs(Lz) / Math.log(8));   /* a shorter dive passes a thinner deck */
    CLOUDS.c.forEach(function (src, i) {
      var Ly = LAYS[i], c = D.createElement('canvas'); c.width = src.width; c.height = src.height; c.className = 'cloud';
      try { c.getContext('2d').drawImage(src, 0, 0); } catch (e) { return; }
      c.style.cssText = 'position:absolute;left:' + bx.toFixed(1) + 'px;top:' + by.toFixed(1) + 'px;width:' + (1.4 * Wg).toFixed(1) + 'px;height:' + (1.4 * Hg).toFixed(1) + 'px;transform-origin:0 0;opacity:0;will-change:transform,opacity';
      parent.appendChild(c); out.push(c);
      c.__kf = keys(N, function (u0) {
        var u = up ? 1 - u0 : u0, P = f(u), e = smoother(u), k = Ly.k0 * Math.exp(Ly.g * Lz * e);
        var ax = P.s.x + Ly.dx * Wg * e, ay = P.s.y, tx = (ax - bx) * (1 - k), ty = (ay - by) * (1 - k);
        var op = Ly.a * span * sstep(Ly.inA, Ly.inB, u) * (1 - sstep(Ly.outA, Ly.outB, u));
        return { transform: 'translate(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px) scale(' + k.toFixed(4) + ')', opacity: +op.toFixed(3) };
      });
      c.__anim = play(c, c.__kf, ms, { delay: delay || 0 });
    });
    /* the come-down re-times itself to the phone's pace: the deck on the same clock, the same progress */
    out.retime = function (ms2, T0) { out.forEach(function (c) { try { if (c.__anim) c.__anim.cancel(); } catch (e) {} c.__anim = play(c, c.__kf, ms2, { start: T0 }); }); };
    return out;
  }

  /* ---- THE BAR LEAVES ON THE COMPOSITOR (MOTION 2, 11/8; PLUMBER 7 measured the old lift at 20 and 7.8 frames a second, the page's
     thread busy with the dive's own draws at the same moment): a copy of the bar rises off the top of the glass as a Web Animation,
     landing on the beat's grid like every piece, logged as the piece's flight (BohemiaMotion.log, how 'fly') ---- */
  function gpuFly(id, node, from, to, o) {
    o = o || {};
    var t0 = epochNow(), red = reduced(), ms = red ? 167 : Math.max(PIECE_MIN, landAt(t0, PIECE_MIN) - t0);
    var row = { id: id, kind: 'piece', how: 'fly', t0: Math.round(t0), budget: red ? [0, 200] : [PIECE_MIN, CEILING], reduced: red, gpu: true, planned: Math.round(ms), gaps: 0, frames: 0 };
    LOG.push(row); if (LOG.length > 300) LOG.splice(0, LOG.length - 300);
    try {
      var h = D.createElement('div');
      h.style.cssText = 'position:fixed;left:' + from.x + 'px;top:' + from.y + 'px;width:' + from.w + 'px;height:' + from.h + 'px;z-index:2147483000;pointer-events:none;transform-origin:50% 50%;will-change:transform,opacity';
      if (node.style) { node.style.position = 'absolute'; node.style.left = '0'; node.style.top = '0'; node.style.margin = '0'; }
      h.appendChild(node); D.body.appendChild(h);
      var dx = to.x - from.x, dy = to.y - from.y;
      var a = h.animate(red ? [{ opacity: 1 }, { opacity: 0 }] : [{ transform: 'translate(0px,0px) rotate(0deg)' }, { transform: 'translate(' + (dx * 0.15).toFixed(1) + 'px,' + (dy * 0.12).toFixed(1) + 'px) rotate(-0.6deg)', offset: 0.35 }, { transform: 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px) rotate(-1.2deg)' }],
        { duration: ms * SLOW, easing: red ? 'linear' : 'cubic-bezier(.55,0,.8,.2)', fill: 'forwards' });
      var done = function () { row.done = true; row.ms = Math.round(epochNow() - t0); row.flew = row.ms; try { h.remove(); } catch (e) {} if (o.onLand) { try { o.onLand(); } catch (e) {} } };
      a.finished.then(done, done);
      setTimeout(function () { if (!row.done) done(); }, ms * SLOW + 1500);
    } catch (e) { row.err = String(e && e.message || e).slice(0, 120); row.done = true; }
    return row;
  }
  /* ---- THE TAPE (rule 420(c); analog horror at the source: the drop is a camera on a mast and this is its recording) ---- */
  var OSD_INK = '#ebe3cd', SHADOW = '#0b0907';
  function osdOn(parent, clock, inMs, rew) {
    var Wg = W.innerWidth, Hg = W.innerHeight, fs = Math.max(12, Math.min(17, Math.round(Math.min(Wg, Hg) / 29))), lh = fs + 3, pad = Math.round(fs * 1.1);
    var o = divEl('osd', 'position:absolute;left:0;top:0;width:' + Wg + 'px;height:' + Hg + 'px;pointer-events:none;opacity:0;will-change:opacity;font-family:"BohemiaROM",ui-monospace,monospace;font-size:' + fs + 'px;line-height:' + lh + 'px;color:' + OSD_INK + ';letter-spacing:1px;text-shadow:1px 0 0 ' + SHADOW + ',-1px 0 0 ' + SHADOW + ',0 1px 0 ' + SHADOW + ',0 -1px 0 ' + SHADOW, parent);
    /* the camera's own frame: four corners */
    var L = Math.round(fs * 1.3), t = 2, cs = 'position:absolute;width:' + L + 'px;height:' + L + 'px;border:0 solid ' + OSD_INK + ';filter:drop-shadow(1px 1px 0 ' + SHADOW + ')';
    divEl('', cs + ';left:' + (pad - 6) + 'px;top:' + (pad - 6) + 'px;border-left-width:' + t + 'px;border-top-width:' + t + 'px', o);
    divEl('', cs + ';right:' + (pad - 6) + 'px;top:' + (pad - 6) + 'px;border-right-width:' + t + 'px;border-top-width:' + t + 'px', o);
    divEl('', cs + ';left:' + (pad - 6) + 'px;bottom:' + (pad - 6) + 'px;border-left-width:' + t + 'px;border-bottom-width:' + t + 'px', o);
    divEl('', cs + ';right:' + (pad - 6) + 'px;bottom:' + (pad - 6) + 'px;border-right-width:' + t + 'px;border-bottom-width:' + t + 'px', o);
    var box = divEl('', 'position:absolute;left:' + (pad + 4) + 'px;top:' + (pad + 2) + 'px;white-space:nowrap', o);
    /* REC on the way down; on the way out the tape rewinds (the arrows, the timecode running back) */
    var l1 = divEl('', '', box), dot = D.createElement('span'); dot.textContent = rew ? '\u25C0\u25C0' : '\u25CF'; dot.style.cssText = 'color:' + (rew ? OSD_INK : '#c8322a') + ';display:inline-block;will-change:opacity;margin-right:6px';
    l1.appendChild(dot); l1.appendChild(D.createTextNode(rew ? 'REW' : 'REC'));
    play(dot, [{ opacity: 1 }, { opacity: 0 }], 1000, { easing: 'steps(2)', iter: Infinity });
    /* the timecode: the world's hour and minute, then seconds and frames running on the compositor (a column of digits each) */
    var l2 = divEl('', '', box), two = function (n) { return (n < 10 ? '0' : '') + n; };
    var h = clock ? Math.floor(clock.m / 60) % 24 : 0, mi = clock ? clock.m % 60 : 0;
    l2.appendChild(D.createTextNode((clock ? 'D' + clock.d + ' ' : '') + two(h) + ':' + two(mi) + ':'));
    var col = function (n, period) {
      var wv = D.createElement('span'); wv.style.cssText = 'display:inline-block;height:' + lh + 'px;overflow:hidden;vertical-align:top';
      var c = D.createElement('span'); c.style.cssText = 'display:block;will-change:transform'; var s = '';
      for (var i = 0; i < n; i++) s += '<span style="display:block;height:' + lh + 'px">' + i + '</span>';
      c.innerHTML = s; wv.appendChild(c); l2.appendChild(wv);
      play(c, [{ transform: 'translateY(0px)' }, { transform: 'translateY(' + (-n * lh) + 'px)' }], period, { easing: 'steps(' + n + ')', iter: Infinity, dir: rew ? 'reverse' : 'normal' });
    };
    col(6, 60000); col(10, 10000); l2.appendChild(D.createTextNode(':')); col(3, 1000); col(10, 1000 / 3);
    play(o, [{ opacity: 0 }, { opacity: 1 }], inMs || 200, { easing: 'steps(3)', fill: 'forwards' });
    return o;
  }
  /* TRACKING: a strip of the held frame itself, slipped sideways, rolling down it with a head line; never a noise texture */
  function bandsOn(parent, pic, pose, delay) {
    var Wg = W.innerWidth, Hg = W.innerHeight, out = [];
    [{ h: 10, dx: 4, period: 2300, at: 0 }, { h: 26, dx: 11, period: 3700, at: 1 }].forEach(function (sp, i) {
      var band = divEl('band', 'position:absolute;left:0;top:0;width:' + Wg + 'px;height:' + sp.h + 'px;overflow:hidden;opacity:0;will-change:transform,opacity', parent);
      var inner = picOf(pic.c, pic.box, 'band', 0.5, band); if (!inner) { band.remove(); return; }
      divEl('', 'position:absolute;left:0;top:0;width:100%;height:1px;background:rgba(236,228,206,.6)', band);
      divEl('', 'position:absolute;left:0;bottom:0;width:100%;height:' + Math.max(2, sp.h >> 2) + 'px;background:rgba(236,228,206,.14)', band);
      var n = 30, jit = []; for (var k = 0; k <= n; k++) jit.push((k % 2 ? 1 : -1) * sp.dx * (0.45 + 0.55 * Math.abs(Math.sin(k * 2.39 + i))));
      var d = (delay || 0) + sp.at * beatNow();
      var y = function (u) { return -sp.h + u * (Hg + sp.h); };
      play(band, keys(n, function (u) { return { transform: 'translateY(' + y(u).toFixed(1) + 'px)' }; }), sp.period, { iter: Infinity, delay: d });
      play(inner.c, keys(n, function (u, q) { return { transform: 'translate(' + jit[Math.round(u * n)].toFixed(1) + 'px,' + (-y(u)).toFixed(1) + 'px) ' + pose }; }), sp.period, { iter: Infinity, delay: d });
      play(band, [{ opacity: 0 }, { opacity: 0.92 }], beatNow() / 3, { delay: d, fill: 'forwards' });
      out.push(band);
    });
    return out;
  }
  /* the tape tracks back in: the bands go */
  function bandsOff(bands, ms) {
    (bands || []).forEach(function (b) { var o0 = 0; try { o0 = +getComputedStyle(b).opacity || 0; } catch (e) {} play(b, [{ opacity: o0 }, { opacity: 0 }], ms, { fill: 'forwards' }); });
  }
  /* THE HUM: the music, never a made-up tone, pulled down through a low-pass to its own low end while the camera is down and opened
     back up as it lands (one node between his music slider and the master, the way the dialogue's duck sits between the music and
     the slider) */
  var HUM = null;
  function humNode() {
    try {
      /* SOUNDS TWO 11/7 (rule 427(a)): the music's last node before the output is the fight's lift (__FIGHTLIFT, built with the
         game's music, between his slider and the output), not his slider: the hum went in BESIDE it, the music reached the output
         twice from the first dive on (+6 dB, measured: muting the lift took the output down 4.5 dB, not to silence) and the hum
         never hummed (the full song still came the other way). It goes in after the lift, in series. */
      var mv = W.__FIGHTLIFT || W.__MUSVOL, out = W.__OUTBUS; if (!mv || !out || !mv.context) return null;
      if (HUM && HUM.__mv === mv) return HUM;
      var lp = mv.context.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 20000; lp.Q.value = 0.5;
      try { mv.disconnect(out); } catch (e) {}
      mv.connect(lp); lp.connect(out); lp.__mv = mv; HUM = lp; return lp;
    } catch (e) { return null; }
  }
  function humTo(down, sec, after) {
    var lp = humNode(); if (!lp) return;
    try { var t = lp.context.currentTime + (after || 0), f = lp.frequency; f.cancelScheduledValues(t); f.setValueAtTime(Math.max(30, f.value), t); f.exponentialRampToValueAtTime(down ? 190 : 20000, t + Math.max(0.05, sec)); DIVE.hum = down ? 'down' : 'up'; } catch (e) {}
  }

  function diveRow(kind) {
    var r = { n: ++DIVE.seq, kind: kind, t0: performance.now(), phases: {}, gpu: true, reduced: reduced(), at: DIVE.at ? [DIVE.at.gx, DIVE.at.gy] : null,
      laid: null, z0: null, z1: null, align: null, renders: [], men: [], err: null, done: false };
    DIVE.row = r; DIVE.log.push(r); if (DIVE.log.length > 12) DIVE.log.shift(); return r;
  }
  /* while nothing under the covers is his yet (the come-down, the hold) the layer takes a tap (it skips the motion, the stop cord)
     so a finger never starts a journey on a map that is leaving or reaches a fight not yet shown */
  var TAKES = { come: 1, settle: 1, hold: 1, grid: 0, turn: 0, fade: 0, climb: 0 };
  function phase(r, name) { if (!r) return; var t = performance.now(); r.phases[name] = Math.round(t - r.t0); DIVE.state = name;
    try { if (W.__DIVE_MARKS) console.timeStamp('dive:' + r.kind + ':' + name); } catch (e) {}   /* a gate's trace reads the phases off the same clock as the frames */
    var take = r.kind === 'down' ? !!TAKES[name] : (name === 'grid' || name === 'turn');
    try { diveLayer().style.pointerEvents = take ? 'auto' : 'none'; } catch (e) {} }
  function diveEnd(r) {
    (DIVE.timers || []).forEach(function (o) { try { clearTimeout(o.id); } catch (e) {} }); DIVE.timers = []; DIVE.anims = [];
    try { if (DIVE.raf) W.cancelAnimationFrame(DIVE.raf); } catch (e) {} DIVE.raf = 0;
    try { if (DIVE.el) DIVE.el.remove(); } catch (e) {} DIVE.el = null; DIVE.skip = false;
    if (DIVE.hum === 'down') humTo(false, 0.5);
    DIVE.state = 'off'; nfcSet('off');
    try { if (W.__DIVE_MARKS && r) console.timeStamp('dive:' + r.kind + ':end'); } catch (e) {}
    if (r) { r.done = true; r.ms = Math.round(performance.now() - r.t0); }
  }
  function beatNow() { return beat().bm; }
  /* the fight's men, where its own camera stands them now (top glass), and the board's tile on the glass */
  function menOf(fw, fg) {
    var out = [];
    try {
      var F = fightOf(fw), U = fw.FIGHT_UI, S = F && F.S; if (!S || !U) return out;
      (S.units || []).forEach(function (u) {
        if (!u || u.dead || u.down || u.fled || u.decoy || !isFinite(u.x) || !isFinite(u.y) || u.x < 0 || u.y < 0) return;
        var o = upFrom(fw.document, { x: fw.sx((u.x + 0.5) * U.tw), y: fw.sy((u.y + 0.5) * U.th), w: 1, h: 1 });
        out.push({ side: u.side === 'them' ? 'them' : 'us', id: u.id, tile: [u.x, u.y], q: { x: o.x, y: o.y } });
      });
    } catch (e) {}
    return out;
  }
  var BRACKET = { us: '#ebe3cd', them: '#d2553f' };
  function bracketEl(parent, side, s) {
    var b = divEl('bracket ' + side, 'position:absolute;left:0;top:0;width:' + s + 'px;height:' + s + 'px;transform-origin:50% 50%;opacity:0;will-change:transform,opacity', parent);
    b.innerHTML = '<svg width="' + s + '" height="' + s + '" viewBox="0 0 10 10" style="display:block;overflow:visible"><path d="M0 3.2V0H3.2M6.8 0H10V3.2M10 6.8V10H6.8M3.2 10H0V6.8" fill="none" stroke="' + SHADOW + '" stroke-width="3" vector-effect="non-scaling-stroke"/><path d="M0 3.2V0H3.2M6.8 0H10V3.2M10 6.8V10H6.8M3.2 10H0V6.8" fill="none" stroke="' + BRACKET[side] + '" stroke-width="1.6" vector-effect="non-scaling-stroke"/></svg>';
    return b;
  }
  /* a red-only and a green-blue-only copy of a picture, half its pixels: together, screened over black, they are the picture */
  function tintOf(src, w, h, rgb) {
    var c = D.createElement('canvas'); c.width = w; c.height = h;
    try { var x = c.getContext('2d'); x.drawImage(src, 0, 0, w, h); x.globalCompositeOperation = 'multiply'; x.fillStyle = rgb; x.fillRect(0, 0, w, h); } catch (e) { return null; }
    c.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;will-change:transform'; return c;
  }

  /* ---- THE WAY IN ---- */
  function diveDown(d, go) {
    if (DIVE.state !== 'off') diveEnd(DIVE.row);
    DIVE.anims = []; DIVE.timers = [];
    var cw = cityWin(), cam = mapCam(cw), c = cam ? cam('read') : null;
    DIVE.at = cellOf(d && d.at) || (c ? { gx: Math.floor(c.city[0]), gy: Math.floor(c.city[1]) } : null);
    var r = diveRow('down'); nfcSet('in'); phase(r, 'come');
    var built = false, build = function () { if (built) return; built = true; r.buildAt = Math.round(performance.now() - r.t0); try { go(); } catch (e) { r.err = String(e && e.message || e); } };
    /* the fight's page is ready: its ground built, its board drawn */
    var fightUp = function () { var fw = fightWin(); try { var l = fw && fw.document.getElementById('load'); return !!(fw && l && l.style.display === 'none' && fw.FIGHT_UI && fw.FIGHT_UI.board); } catch (e) { return false; } };
    var waitFight = function (then) {
      var t0 = performance.now(), seen = 0;
      var f = function () {
        if (fightUp()) seen++;
        if (seen >= 2 || performance.now() - t0 > 20000) { r.built = Math.round(performance.now() - t0); r.timedOut = seen < 2; DIVE.raf = 0; then(); return; }
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
      r.plain = true; phase(r, 'hold'); build();
      waitFight(function () { phase(r, 'fade'); if (!pic) { diveEnd(r); return; } nfcSet('off');
        var ms = reduced() ? 167 : 300; r.fadeMs = ms; play(pic.c, [{ opacity: 1 }, { opacity: 0 }], ms, { fill: 'forwards' }); later(function () { diveEnd(r); }, ms + 20); });   /* the fade is the compositor's, its own length; the cleanup after it may run late behind the fight's first frames */
      return true;
    };
    var cv = mapCanvas(cw);
    if (!c || !DIVE.at || reduced() || !cv) return plain();
    r.z0 = c.z; DIVE.z0 = { z: c.z, camf: c.camf, at: null };
    /* where the camera stops: at the fight's own size, so the turn has nothing left to zoom (the size the last fight on this glass
       opened at; the first fight: a block a third of the glass's short side, the phone's measured 132 px), never past the street
       stop nor short of the map's near stop */
    var gk = Math.round(W.innerWidth) + 'x' + Math.round(W.innerHeight), aGuess = SCALE_MEM[gk] || Math.max(100, Math.min(260, 0.34 * Math.min(W.innerWidth, W.innerHeight)));
    var u0 = DIVE.at.gx + 0.5, v0 = DIVE.at.gy + 0.5, zEnd = Math.max(c.zmax || 0, Math.min(c.street, aGuess * Math.SQRT2 / c.TW0));
    var p0 = cam('at', { u: u0, v: v0 }) || c.F, Fp = { x: c.F.x, y: c.F.y };
    r.guess = Math.round(aGuess);
    DIVE.z0.at = { x: p0.x, y: p0.y }; r.z1 = zEnd;
    var cb = topBox(cv); if (!cb) return plain();
    var fx = c.CVW ? cb.w / c.CVW : 1, fy = c.CVH ? cb.h / c.CVH : 1, css = function (p) { return { x: p.x * fx, y: p.y * fy }; };
    var P0 = css(p0), PF = css(Fp), kEnd = coverK(cb, PF);
    r.prepaint = cam('prepaint', { z: zEnd / kEnd, u: u0, v: v0, r: 3 });   /* the stop's tiles asked from the first frame */
    r.cb = [Math.round(cb.x), Math.round(cb.y), Math.round(cb.w), Math.round(cb.h)]; r.kEnd = +kEnd.toFixed(3);
    /* 1 COME DOWN, on the compositor: the camera on the log from where he was to the stop; one beat for a short way, two and a half
       for the whole valley down to the street */
    /* the come-down takes the time this phone needs to draw its pictures (the map draws its people and names at one size, so a picture
       shown long past its own zoom makes them giant and they snap back when the next lands: seen at 4x, a second of it): the step
       between two pictures measured on the last dive (a cautious 300 ms before the first), never under the old curve, never past 3.5
       beats */
    var bm = beatNow(), ratio = Math.abs(Math.log(zEnd / Math.max(1e-3, c.z)));
    var nStops0 = Math.max(0, Math.min(3, Math.ceil(ratio / Math.log(2.2)) - 1)), step = DIVE.stepMs || 300;
    var msCurve = Math.max(bm, Math.min(2.5 * bm, 0.6 * bm * ratio + 0.4 * bm));   /* the camera's own pace, what the climb back uses (it draws nothing) */
    var ms = Math.max(bm, Math.min(3.5 * bm, Math.max(msCurve, (nStops0 + 1) * step + 150)));
    r.step = Math.round(step);
    r.comeMs = Math.round(ms);
    /* the camera's path (z: the zoom on the glass); each picture of it is drawn at its zoom over its own cover factor, so when it is
       laid in it covers the glass and the block still lands at the board's own size */
    var Lz = Math.log(zEnd / c.z), at = function (u) { var e = smoother(u); return { z: c.z * Math.exp(Lz * e), s: lerpP(P0, PF, smoother(Math.min(1, u * 1.15))) }; };
    var zC = zEnd / kEnd;
    var N = 36, root = diveLayer(), camG = divEl('cam', glassCSS() + ';will-change:transform', root);
    var A = W.__DIVE_MUTATE === 'bare' ? null : picOf(cv, cb, 'map', null, camG);
    if (!A) { try { root.remove(); } catch (e) {} DIVE.el = null; r.err = 'no map frame to hold'; return plain(); }
    /* ONE CLOCK for every picture of the come-down: the first picture's own start, read once the compositor has started it (a start
       set by hand before the first frame is shown would throw the camera ahead by however long that frame took to reach the glass,
       and a picture laid on a start not yet known stands still) */
    var comeA = play(A.c, keys(N, function (u) { return { transform: poseOf(at(u), c.z, P0) }; }), ms), T0 = null;
    A.zk = c.z; A.sk = P0; A.layU = 0; A.anim = comeA;
    /* the time since the clock's start NOW (performance.now, the timeline's own time base: the timeline's currentTime stands still
       through a long task, measured: 133 ms read where 365 had passed, right after a map draw) */
    var since0 = function () { try { return T0 != null ? (performance.now() - T0) / SLOW : 0; } catch (e) { return 0; } };
    /* RE-TIMED IN FLIGHT: once the first picture is drawn the phone's pace is known; if the rest would be laid late (each would show
       the map's people giant, then snap), the camera slows from where it is, on the same progress, every picture and the deck rebuilt
       on the new clock (the curve unbroken: the progress at this moment is kept, only what is left is stretched) */
    var retime = function (ms2) {
      ms2 = Math.min(4 * bm, ms2); r.ask = Math.round(ms2); if (T0 == null || !(ms2 > ms + 30)) return;
      var now = since0(), u = Math.min(1, now / ms); if (u >= 0.97) return;
      T0 = T0 + (now - u * ms2) * SLOW; ms = ms2; r.comeMs = Math.round(ms); r.retimed = (r.retimed || 0) + 1;
      pics.forEach(function (p) { poseAnim(p); });
      if (deck && deck.retime) deck.retime(ms, T0);
    };
    /* ONE ANIMATION A PICTURE, its pose and its opacity together on the come-down's one clock (two animations, one pending and one set
       on the clock, can reach the compositor a frame apart: seen once, a picture shown a frame without its pose). Rebuilt in place,
       on the same clock, when the picture over it arrives (it hides then) */
    var poseAnim = function (p) {
      try { if (p.anim) p.anim.cancel(); } catch (e) {}
      var Dur = Math.max(ms, (p.inEnd || 0) + 10, (p.hideT != null ? p.hideT + 10 : 0)), NN = 60;
      var fr = keys(NN, function (q) { var t = q * Dur, uu = Math.min(1, t / ms), op = p.inT != null ? sstep(p.inT, p.inEnd, t) : 1;
        if (p.hideT != null) op *= 1 - sstep(p.hideT, p.hideT + Dur / NN, t);
        return { transform: poseOf(at(uu), p.zk, p.sk), opacity: +op.toFixed(3) }; });
      p.anim = play(p.c, fr, Dur, { fill: 'forwards', start: T0 != null ? T0 : null });
      if (T0 == null && p.anim) { try { p.anim.cancel(); } catch (e) {} p.anim = play(p.c, fr, Dur, { fill: 'forwards' }); }
    };
    var onGlass = function (u) { var P = at(u); return { z: P.z, s: { x: cb.x + P.s.x, y: cb.y + P.s.y } }; };
    var deck = cloudsOn(root, onGlass, ms, Lz, 0, false);   /* __THE_DIVE_GOES_THROUGH_THE_CLOUDS__: on the same clock as the pictures */
    r.clouds = deck ? deck.length : 0;
    var clock = worldClock(cw), osd = osdOn(root, clock, bm / 2);
    humTo(true, 0.45);
    var pics = [A], C = null, mid = null, uMid = 0.5;
    /* a map picture drawn at the camera's pose for u, laid in at u (or now, if the draw came late) */
    var drawAt = function (u, zk, sk, name) {
      var t = performance.now(), P = at(u), skm = { x: sk.x / fx, y: sk.y / fy };
      cam('aim', { z: zk, u: u0, v: v0, sx: skm.x, sy: skm.y, camf: false });
      var under = pics[pics.length - 1], p = picOf(cv, cb, 'map', /^B/.test(name) ? Math.min(2, W.devicePixelRatio || 1) : null, camG); if (!p) return null;
      var since = since0(), wait = Math.max(40, u * ms - since - 60);   /* its first two frames unseen: a new layer can reach the glass a frame before its animation does */
      p.zk = zk; p.sk = sk; p.inT = since + wait; p.inEnd = p.inT + 230; p.hideT = null;   /* a dissolve, so the map's own names and people settle rather than snap */
      poseAnim(p);
      /* covered: not composited (the one under it hides on the same clock, rebuilt in place) */
      if (under && under.c) { under.hideT = p.inEnd + 20; poseAnim(under); }
      p.inAt = performance.now() + wait + 230; p.layU = Math.min(1, Math.max(u, (since + wait) / ms));
      r.renders.push({ name: name, z: +zk.toFixed(3), ms: Math.round(performance.now() - t), at: Math.round(performance.now() - r.t0), late: wait <= 0 });
      return p;
    };
    var finishCome = function () {
      /* 2 HOLD: C covers the glass at the stop; the fight's page is built under it while the tape tracks out */
      /* the pictures under the stop's go once it is fully in and the camera has stopped (it covers the glass from there) */
      var top = DIVE.mapPic, gone = function () {
        /* kept for the way out (two pixels a point at most): the way out rewinds these very pictures */
        var kk = Math.min(2, W.devicePixelRatio || 1); DIVE.keptPics = [];
        pics.forEach(function (p) { if (p !== top) { var q = picOf(p.c, p.box, 'kept', kk, D.createElement('div')); if (q) { q.zk = p.zk; q.sk = p.sk; q.layU = p.layU; DIVE.keptPics.push(q); } try { p.c.remove(); } catch (e) {} } }); };
      later(gone, Math.max(0, ms - since0(), (top && top.inAt ? top.inAt - performance.now() : 0)) + 150);
      DIVE.path = { z0: c.z, zEnd: zEnd, P0: P0, PF: PF, ms: msCurve, topU: top && top.layU != null ? top.layU : 0.94 };
      try { var rr = r.renders.filter(function (x) { return x.at != null; }); if (rr.length >= 2) DIVE.stepMs = Math.max(60, Math.min(700, (rr[rr.length - 1].at - (r.firstFrame || 0)) / rr.length)); } catch (e) {}
      DIVE.mg = mgOf(cam, cb, fx, fy, u0, v0); DIVE.zEnd = zC; DIVE.kEnd = kEnd; DIVE.PF = PF; DIVE.cb = cb; DIVE.cv = cv; DIVE.cam = camG;
      DIVE.crew = (function () { var q = cam('crew'); return q ? { x: cb.x + q.x * fx, y: cb.y + q.y * fy } : null; })();
      var pose = poseOf(at(1), zC, PF), restMs = Math.max(0, ms - since0());
      camG.style.transformOrigin = (cb.x + PF.x).toFixed(1) + 'px ' + (cb.y + PF.y).toFixed(1) + 'px';
      DIVE.push = play(camG, [{ transform: 'scale(1)' }, { transform: 'scale(1.035)' }], 9000, { delay: restMs, easing: 'cubic-bezier(.25,.6,.35,1)', fill: 'forwards' });
      DIVE.bands = bandsOn(camG, DIVE.mapPic, pose, restMs);
      DIVE.pose = pose;
      later(function () { if (DIVE.state === 'come' || DIVE.state === 'settle') phase(r, 'hold'); }, restMs);
    };
    /* the pictures between: the camera's zoom split evenly on the log, so no picture is ever shown more than about 2.2 times its own
       size (the map's own names swell no further) */
    var uOf = function (e) { var lo = 0, hi = 1; for (var i = 0; i < 28; i++) { var m = (lo + hi) / 2; if (smoother(m) < e) lo = m; else hi = m; } return (lo + hi) / 2; };
    var nStops = nStops0, stops = [];   /* every step at most 2.2x where it can be (the phone 2, the computer 3) */
    for (var si = 1; si <= nStops; si++) stops.push(si / (nStops + 1));
    var drawStops = function (i, then) {
      if (DIVE.row !== r) return;
      if (i >= stops.length) { then(); return; }
      /* drawn at the zoom that keeps it covering the glass from the moment it is laid to the moment the next one is (the camera pans
         as it comes down: a picture that only covers when it is laid leaves a band as the block moves) */
      var u = uOf(stops[i]), u2 = i + 1 < stops.length ? uOf(stops[i + 1]) : 0.94, P = at(u), zk = 1e9;
      for (var q = 0; q <= 8; q++) { var uq = u + (u2 - u) * q / 8, Pq = at(uq); zk = Math.min(zk, Pq.z / coverFor(cb, P.s, Pq.s)); }
      var p = drawAt(u, zk, P.s, 'B' + (i + 1)); if (p) pics.push(p);
      /* the pace: this picture ready this far into the come-down; the rest at the same pace; the stop laid at 0.94 */
      var left = stops.length - i, pace = since0() / (i + 1);
      (r.paces || (r.paces = [])).push(Math.round(pace));
      retime(((i + 1 + left) * pace + 120) / 0.94);
      afterPaint(function () { drawStops(i + 1, then); });
    };
    var stopPic = function () {
      if (DIVE.row !== r) return;
      C = drawAt(0.94, zC, PF, 'C'); if (!C) { r.err = 'no stop picture'; C = A; } else pics.push(C);
      DIVE.mapPic = C;
      /* SETTLE: the stop's tiles were asked from the first frame; if the last of them land after C, C is drawn once more */
      var missing0 = cam('prepaint', { z: zC, u: u0, v: v0, r: 1 }), t0 = performance.now();
      r.missingAtC = missing0;
      var poll = function () {
        if (DIVE.row !== r) return;
        var m = cam('prepaint', { z: zC, u: u0, v: v0, r: 1 });
        if (m > 0 && performance.now() - t0 < Math.max(0, ms - since0()) + bm) { later(poll, 90); return; }
        r.missing = m;
        if (missing0 > 0 && m <= 0 && C !== A) {
          phase(r, 'settle');
          var C2 = drawAt(1, zC, PF, 'C again'); if (C2) { pics.push(C2); DIVE.mapPic = C2; C = C2; }
        }
        finishCome(); build(); waitFight(function () { turnIn(r); });
      };
      if (missing0 > 0) later(poll, 90); else { r.missing = missing0; finishCome(); build(); waitFight(function () { turnIn(r); }); }
    };
    var started = false, startClock = function () {
      if (started) return; started = true;
      try { T0 = comeA && comeA.startTime != null ? comeA.startTime : D.timeline.currentTime; } catch (e) { T0 = null; }
      r.firstFrame = Math.round(performance.now() - r.t0);
      afterPaint(function () { drawStops(0, function () { afterPaint(stopPic); }); });
    };
    try { comeA.ready.then(startClock, startClock); } catch (e) { startClock(); }
    later(startClock, 1500);   /* never wait on a promise that never settles */
    return true;
  }

  /* 3 THE TURN and 4 THE BOARD LANDS, all handed to the compositor at once */
  function turnIn(r) {
    if (DIVE.row !== r) return;
    var fw = fightWin(), fc = fw && fw.document.getElementById('cv'), fg = fw ? fightGeo(fw, DIVE.at) : null, C = DIVE.mapPic, mg = DIVE.mg, camG = DIVE.cam;
    if (!fw || !fc || !fg || !C || !mg || !camG) { phase(r, 'fade'); nfcSet('off'); if (C) play(C.c, [{ opacity: 1 }, { opacity: 0 }], 300); bandsOff(DIVE.bands, 200); later(function () { diveEnd(r); }, 360); return; }
    r.laid = fg.laid; r.cell = fg.cell; SCALE_MEM[Math.round(W.innerWidth) + 'x' + Math.round(W.innerHeight)] = fg.a; r.a = Math.round(fg.a);
    var bm = beatNow(), T = 2 * bm, N = 36, Wg = W.innerWidth, Hg = W.innerHeight, glass = { x: 0, y: 0, w: Wg, h: Hg };
    var kEnd = DIVE.kEnd || 1, mgT = { c: mg.c, M: mg.M, sm: mg.sm * kEnd, km: mg.km };
    var fbox = topBox(fc); if (!fbox) { diveEnd(r); return; }
    /* the board's first frame, full pixels, laid under the map's; a still copy of the map's frame for the corners of the turn */
    var F = picOf(fc, fbox, 'board', null, camG), Cs = picOf(C.c, C.box, 'map-still', 1, camG);
    if (!F) { diveEnd(r); return; }
    camG.insertBefore(Cs ? Cs.c : F.c, C.c); if (Cs) camG.insertBefore(F.c, C.c);
    if (Cs) Cs.c.style.transform = DIVE.pose;
    var kq = picOf(C.c, C.box, 'kept', Math.min(2, W.devicePixelRatio || 1), D.createElement('div'));
    DIVE.keep = { c: kq ? kq.c : null, box: C.box, mg: mg, kEnd: kEnd, PF: DIVE.PF, cb: DIVE.cb, pose: DIVE.pose, zEnd: DIVE.zEnd, path: DIVE.path, pics: DIVE.keptPics || [],
      glass: Math.round(Wg) + 'x' + Math.round(Hg), at: DIVE.at };
    var pathAt = function (u) { var e = smoother(u); return { e: e, A: turnA(mgT, fg, e), to: lerpP(mg.c, fg.c, e) }; };
    var Lm = function (p) { return mm(p.A, minv(mg.M)); }, Lb = function (p) { return mm(p.A, minv(fg.M)); };
    phase(r, 'turn');
    /* the camera's push-in eases back to nothing over the turn's first half; the tape tracks back in */
    var now0 = 'none'; try { now0 = getComputedStyle(camG).transform; } catch (e) {}
    play(camG, [{ transform: now0 === 'none' ? 'scale(1)' : now0 }, { transform: 'scale(1)' }], bm, { easing: 'ease-in-out', fill: 'forwards' });
    bandsOff(DIVE.bands, bm * 0.6);
    play(C.c, keys(N, function (u) { var p = pathAt(u); return { transform: cssM(Lm(p), C.box, mg.c, p.to), opacity: 1 - sstep(0.45, 0.85, u) }; }), T);
    if (Cs) play(Cs.c, keys(12, function (u) { return { opacity: 1 - sstep(0.45, 0.85, u) }; }), T);
    play(F.c, keys(N, function (u) { var p = pathAt(u); return { transform: cssM(Lb(p), fbox, fg.c, p.to), opacity: sstep(0.36, 0.46, u) }; }), T);
    /* THE BOARD LANDS: the colours bleed and close; the held board gives way to the live one under it */
    var bw = Math.max(1, Math.round(fbox.w / 2)), bh = Math.max(1, Math.round(fbox.h / 2));
    var bl = divEl('bleed', 'position:absolute;left:' + fbox.x + 'px;top:' + fbox.y + 'px;width:' + fbox.w + 'px;height:' + fbox.h + 'px;isolation:isolate;background:#000;opacity:0;will-change:opacity', camG);
    var Rr = tintOf(F.c, bw, bh, 'rgb(255,0,0)'), Gb = tintOf(F.c, bw, bh, 'rgb(0,255,255)');
    if (Rr && Gb) {
      Rr.className = 'bleed'; Gb.className = 'bleed'; Gb.style.mixBlendMode = 'screen'; bl.appendChild(Rr); bl.appendChild(Gb);
      var sp = Math.max(4, Math.round(Math.min(Wg, Hg) / 60));
      play(Rr, [{ transform: 'translate(' + (-sp) + 'px,1px)' }, { transform: 'translate(0px,0px)' }], 0.7 * bm, { delay: T - 0.1 * bm, easing: 'cubic-bezier(.2,.7,.3,1)' });
      play(Gb, [{ transform: 'translate(' + sp + 'px,-1px)' }, { transform: 'translate(0px,0px)' }], 0.7 * bm, { delay: T - 0.1 * bm, easing: 'cubic-bezier(.2,.7,.3,1)' });
      play(bl, [{ opacity: 0 }, { opacity: 1, offset: 0.12 }, { opacity: 1, offset: 0.45 }, { opacity: 0 }], 0.9 * bm, { delay: T - 0.1 * bm, fill: 'forwards' });
    } else bl.remove();
    play(F.c, [{ opacity: 1 }, { opacity: 0 }], 0.25 * bm, { delay: T + 0.25 * bm, fill: 'forwards' });
    /* THE GRID SCANS ON: the board's own tile lines, drawn once at rest, revealed from the far edge to the near through a window
       that turns with the board (transform only: the window moves down while the lines inside it are held in place) */
    var gw = divEl('gridwrap', glassCSS() + ';overflow:hidden;opacity:0;will-change:transform,opacity', camG);
    var gi = divEl('gridin', glassCSS() + ';will-change:transform', gw);
    var gk2 = Math.min(2, W.devicePixelRatio || 1), gc = D.createElement('canvas'); gc.className = 'grid'; gc.width = Math.round(Wg * gk2); gc.height = Math.round(Hg * gk2);
    gc.style.cssText = 'position:absolute;left:0;top:0;width:' + Wg + 'px;height:' + Hg + 'px'; gi.appendChild(gc);
    gridDraw(gc, fg, [1, 0, 0, 1], fg.c, fg.c, 1.25, 1);
    var line = divEl('scanline', 'position:absolute;left:0;top:0;width:' + Wg + 'px;height:2px;background:rgba(246,236,204,.95);box-shadow:0 0 7px 1px rgba(246,236,204,.55);will-change:transform,opacity', gi);
    var yTop = Math.max(0, fg.o0.y), yBot = Math.min(Hg, fg.o0.y + fg.h * fg.ty); if (!(yBot > yTop)) { yTop = 0; yBot = Hg; }
    var scan = function (u) { return yTop + sstep(0.42, 0.96, u) * (yBot - yTop); };
    play(gw, keys(N, function (u) { var p = pathAt(u), Y = scan(u); return { transform: cssM(Lb(p), glass, fg.c, p.to) + ' translate(0px,' + (-(Hg - Y)).toFixed(1) + 'px)', opacity: sstep(0.38, 0.5, u) }; }), T);
    play(gi, keys(N, function (u) { return { transform: 'translate(0px,' + (Hg - scan(u)).toFixed(1) + 'px)' }; }), T);
    play(line, keys(N, function (u) { return { transform: 'translate(0px,' + (scan(u) - 2).toFixed(1) + 'px)', opacity: sstep(0.4, 0.46, u) * (1 - sstep(0.93, 1, u)) }; }), T);
    play(gi, [{ opacity: 1 }, { opacity: 0 }], bm, { delay: T + bm, fill: 'forwards' });
    /* THE MEN, FOUND WHERE THEY STOOD: a bracket on his crew where the map had them (theirs at the contact's block), locking on as
       the grid comes up and riding the turn to each man's own tile */
    var men = menOf(fw, fg), tile = Math.max(14, Math.min(64, fg.tx * 0.92)), crew = DIVE.crew, them = { x: mg.c.x, y: mg.c.y };
    var onMap = function (p, pt) { var L = Lm(p); var q = map2(L, pt.x - mg.c.x, pt.y - mg.c.y); return { x: p.to.x + q.x, y: p.to.y + q.y }; };
    var onBoard = function (p, pt) { var L = Lb(p); var q = map2(L, pt.x - fg.c.x, pt.y - fg.c.y); return { x: p.to.x + q.x, y: p.to.y + q.y }; };
    men.forEach(function (m, i) {
      var from = m.side === 'us' && crew ? crew : them, b = bracketEl(camG, m.side, tile), lift = 0.32 * tile;
      var spread = ((i % 5) - 2) * tile * 0.18;
      var pos = function (u) { var p = pathAt(u), a = onMap(p, { x: from.x + spread, y: from.y }), q = onBoard(p, m.q), e = sstep(0.32, 0.92, u), x = lerpP(a, q, e); return { x: x.x, y: x.y - lift }; };
      play(b, keys(N, function (u) { var x = pos(u), k = 1 + 0.7 * (1 - sstep(0.3, 0.48, u)); return { transform: 'translate(' + (x.x - tile / 2).toFixed(1) + 'px,' + (x.y - tile / 2).toFixed(1) + 'px) scale(' + k.toFixed(3) + ')', opacity: sstep(0.29, 0.36, u) }; }), T);
      play(b, [{ opacity: 1 }, { opacity: 0 }], bm, { delay: T + bm, fill: 'forwards' });
      var s0 = pos(0.36), s1 = pos(1);
      r.men.push({ side: m.side, id: m.id, tile: m.tile, lift: Math.round(lift), from: [Math.round(onMap(pathAt(0), { x: from.x + spread, y: from.y }).x), Math.round(onMap(pathAt(0), { x: from.x + spread, y: from.y }).y)], lock: [Math.round(s0.x), Math.round(s0.y)], to: [Math.round(s1.x), Math.round(s1.y)], q: [Math.round(m.q.x), Math.round(m.q.y)] });
    });
    r.crewAt = crew ? [Math.round(crew.x), Math.round(crew.y)] : null; r.mapC = [Math.round(mg.c.x), Math.round(mg.c.y)];
    /* REC goes out a beat after the board lands; the music opens back up as it lands */
    var osd = DIVE.el && DIVE.el.querySelector('.osd'); if (osd) play(osd, [{ opacity: 1 }, { opacity: 0 }], bm * 0.5, { delay: T + 1.4 * bm, easing: 'steps(3)', fill: 'forwards' });
    humTo(false, 0.9, (T - 0.2 * bm) / 1000);
    /* the end of the turn, for a check that does not go through this file's geometry: the map frame's own last transform, where the
       map drew the block, and the fight's own camera at this moment */
    try { var p1 = pathAt(1), Uf = fw.FIGHT_UI, fr0 = fw.frameElement.getBoundingClientRect();
      r.align = { mapAt: [Math.round(p1.to.x), Math.round(p1.to.y)], boardAt: [Math.round(fg.c.x), Math.round(fg.c.y)], scale: +(mgT.sm / fg.a).toFixed(3) };
      r.end = { tf: cssM(Lm(p1), C.box, mg.c, p1.to), box: C.box, map0: mg.c, sx0: fw.sx(0), sy0: fw.sy(0), tw: Uf.tw * Uf.zoom, th: Uf.th * Uf.zoom, fx: fr0.left, fy: fr0.top }; } catch (e) {}
    later(function () { nfcSet('off'); phase(r, 'grid');
      try { var g2 = fightGeo(fw, DIVE.at); if (g2) r.glide = [Math.round(g2.c.x - fg.c.x), Math.round(g2.c.y - fg.c.y)]; } catch (e) {} }, T);
    later(function () { diveEnd(r); }, T + 2.1 * bm);
  }

  /* ---- THE WAY OUT: before the fight's page goes (prep), then after (go) ---- */
  /* ==== __THE_CAMP_IS_SET_UP_WHILE_HE_WATCHES__ (MOTION 3, VAMILY rule 444(a) and 441, ask line 568; Paolo 11/10: 'you watch them set
     up the camp on the combat map itself, not pull out into the big map and then try to zoom back in, and then once the camp is set
     up, then time fast forwards'). MAKE CAMP on a won fight's end screen (the shell marks it, __CAMP_HOLD_BOARD): the board's last
     frame stays on the glass (the dive's own held picture) while the map takes the fight home and the camp is made under it; no climb
     to the map, no grow back in (AD.camp), the map's moment between landed at once; the picture goes on the frame after the camp's
     first frame is drawn on the fight's own view (the same camera, slices/bohemia_camp_board.js __THE_CAMP_IS_THE_FIGHTS_BOARD__), so
     the glass never leaves the board. window.__CAMP_HOLD_OFF = the way it was (the climb, the grow). ==== */
  var CAMPHOLD = { on: false, rows: [] }, CAMP_HOLD_MAX = 12000, CAMP_HOLD_FRESH = 9000;
  function campHeld() { var t = W.__CAMP_HOLD_BOARD; return !!t && Date.now() - t < CAMP_HOLD_FRESH && !W.__CAMP_HOLD_OFF; }
  function campFirst() {   /* the camp's first frame drawn on the glass: on the fight's view, or (no view kept) its first frame at all */
    try { var cw = cityWin(), f = cw && cw.LOOP && cw.LOOP.frame; if (!f || !townFrameShown(cw) || (f.style.opacity !== '' && +f.style.opacity < 0.99)) return false;
      var L = f.contentWindow.BohemiaCampLook, st = L && L.state ? L.state() : null; if (!st || !st.open) return false;
      if (st.firstFv) {   /* and YOU on it: his own walker placed (the held frame never lifts on a camp without him), three beats at most */
        var BS = f.contentWindow.BohemiaSettlement, ld = BS && BS.lead ? BS.lead() : null; if (ld && ld.x != null) return true;
        CAMPHOLD.noLead = CAMPHOLD.noLead || performance.now(); return performance.now() - CAMPHOLD.noLead > beatNow() * 6; }
      var fv = L.fightView ? L.fightView() : null; return !(fv && fv.on) && Object.keys(st.drawnAt || {}).length > 0; } catch (e) { return false; }
  }
  /* the tape PAUSED over the held board while the camp is made under it (the camera's own corners, PAUSE blinking on the beat, the world's
     clock standing still): never a frozen picture with nothing to say; the clock says time is not running (rule 444(a)) */
  function osdPause(parent, clock) {
    var Wg = W.innerWidth, Hg = W.innerHeight, fs = Math.max(12, Math.min(17, Math.round(Math.min(Wg, Hg) / 29))), lh = fs + 3, pad = Math.round(fs * 1.1);
    var o = divEl('osd', 'position:absolute;left:0;top:0;width:' + Wg + 'px;height:' + Hg + 'px;pointer-events:none;opacity:0;will-change:opacity;font-family:"BohemiaROM",ui-monospace,monospace;font-size:' + fs + 'px;line-height:' + lh + 'px;color:' + OSD_INK + ';text-shadow:1px 1px 0 ' + SHADOW + ';letter-spacing:1px', parent);
    var L = Math.round(fs * 1.3), t = 2, cs = 'position:absolute;width:' + L + 'px;height:' + L + 'px;border:0 solid ' + OSD_INK + ';filter:drop-shadow(1px 1px 0 ' + SHADOW + ')';
    divEl('', cs + ';left:' + (pad - 6) + 'px;top:' + (pad - 6) + 'px;border-left-width:' + t + 'px;border-top-width:' + t + 'px', o);
    divEl('', cs + ';right:' + (pad - 6) + 'px;top:' + (pad - 6) + 'px;border-right-width:' + t + 'px;border-top-width:' + t + 'px', o);
    divEl('', cs + ';left:' + (pad - 6) + 'px;bottom:' + (pad - 6) + 'px;border-left-width:' + t + 'px;border-bottom-width:' + t + 'px', o);
    divEl('', cs + ';right:' + (pad - 6) + 'px;bottom:' + (pad - 6) + 'px;border-right-width:' + t + 'px;border-bottom-width:' + t + 'px', o);
    var box = divEl('', 'position:absolute;left:' + (pad + 4) + 'px;top:' + (pad + 2) + 'px;white-space:nowrap', o), two = function (n) { return (n < 10 ? '0' : '') + n; };
    var l1 = divEl('', '', box), mark = D.createElement('span'); mark.textContent = '\u258C\u258C'; mark.style.cssText = 'display:inline-block;will-change:opacity;margin-right:6px';
    l1.appendChild(mark); l1.appendChild(D.createTextNode('PAUSE'));   /* draft:true */
    play(mark, [{ opacity: 1 }, { opacity: 0 }], beatNow() * 2, { easing: 'steps(2)', iter: Infinity });
    if (clock) divEl('', '', box).appendChild(D.createTextNode('D' + clock.d + ' ' + two(Math.floor(clock.m / 60) % 24) + ':' + two(clock.m % 60)));
    divEl('', 'margin-top:' + Math.round(lh * 0.4) + 'px', box).appendChild(D.createTextNode('MAKING CAMP'));   /* draft:true */
    play(o, [{ opacity: 0 }, { opacity: 1 }], 200, { easing: 'steps(3)', fill: 'forwards' });
    return o;
  }
  function campHoldUp(prep) {
    var r = { kind: 'camp hold', t0: performance.now(), frames: 0, at: Date.now() }; CAMPHOLD.on = true; CAMPHOLD.noLead = 0; CAMPHOLD.row = r; CAMPHOLD.rows.push(r); if (CAMPHOLD.rows.length > 8) CAMPHOLD.rows.shift();
    DIVE.state = 'hold';
    var osd = null; try { if (!reduced() && prep.cam) osd = osdPause(prep.cam, worldClock(cityWin())); r.osd = !!osd; } catch (e) { osd = null; }
    var k = 0, tick = function () {
      r.frames++;
      var done = campFirst(), late = performance.now() - r.t0 > CAMP_HOLD_MAX;
      if (done) k++;
      if ((done && k >= 2) || late) {
        r.ms = Math.round(performance.now() - r.t0); r.why = done ? 'the camp drawn' : 'timed out'; CAMPHOLD.on = false; W.__CAMP_HOLD_BOARD = 0;
        var pc = prep.pic && prep.pic.c; if (pc) play(pc, [{ opacity: 1 }, { opacity: 0 }], 120); if (osd) play(osd, [{ opacity: 1 }, { opacity: 0 }], 120);
        later(function () { diveEnd(null); }, 160); return;
      }
      W.requestAnimationFrame(tick);
    };
    W.requestAnimationFrame(tick);
  }
  /* ==== end __THE_CAMP_IS_SET_UP_WHILE_HE_WATCHES__ ==== */
  function diveUpPrep() {
    if (DIVE.state !== 'off') diveEnd(DIVE.row);
    DIVE.anims = []; DIVE.timers = [];
    var fw = fightWin(), fc = fw && fw.document.getElementById('cv'); if (!fw || !fc) return null;
    if (!DIVE.at) { try { DIVE.at = cellOf(W.NF && W.NF.opts && W.NF.opts.cell); } catch (e) {} }
    var fbox = topBox(fc); if (!fbox) return null;
    var fg = DIVE.at ? fightGeo(fw, DIVE.at) : null, camG = divEl('cam', glassCSS(), diveLayer()), pic = picOf(fc, fbox, 'board', null, camG);
    if (!pic) { diveEnd(null); return null; }
    nfcSet('in');
    return { pic: pic, fg: fg, cam: camG };
  }
  function diveUp(prep, back) {
    if (!prep) { if (back) back(); return; }
    var r = diveRow('up'), pic = prep.pic, fg = prep.fg, K = DIVE.keep, camG = prep.cam;
    phase(r, 'grid');
    var landed = function () { try { if (back) back(); } catch (e) {} };
    var cw = cityWin(), cam = mapCam(cw), z0 = DIVE.z0, at = (K && K.at) || DIVE.at;
    var u0 = at ? at.gx + 0.5 : null, v0 = at ? at.gy + 0.5 : null, c = cam ? cam('read') : null;
    var fits = !!(K && K.c && K.path && K.glass === Math.round(W.innerWidth) + 'x' + Math.round(W.innerHeight));
    if (!c || u0 == null || reduced() || !fg || !fits) {
      r.plain = true;
      var k = 0, wait = function () { if (++k < 3) { W.requestAnimationFrame(wait); return; } phase(r, 'fade'); nfcSet('off'); landed();
        var ms = reduced() ? 167 : 300; play(pic.c, [{ opacity: 1 }, { opacity: 0 }], ms); later(function () { DIVE.keep = null; diveEnd(r); }, ms + 40); };
      W.requestAnimationFrame(wait); return;
    }
    var IP = K.path, bm = beatNow(), N = 36, Wg = W.innerWidth, Hg = W.innerHeight, glass = { x: 0, y: 0, w: Wg, h: Hg }, mg = K.mg, kEnd = K.kEnd || 1, mgT = { c: mg.c, M: mg.M, sm: mg.sm * kEnd, km: mg.km };
    r.z1 = K.zEnd; r.z0 = z0 ? z0.z : null;
    /* THE WAY OUT REWINDS THE WAY IN: the very pictures the camera came down through, played backwards on the compositor; the live map
       is drawn ONCE where he was under all of it, and shows when the rewind lands. One timeline, laid down now: nothing in it waits for
       the main thread (measured before: after a fight the main thread is the map's and the spoils' for up to 3 s at 4x) */
    var Lz = Math.log(IP.zEnd / IP.z0), rewind = function (u) { var q = 1 - u, e = smoother(q); return { z: IP.z0 * Math.exp(Lz * e), s: lerpP(IP.P0, IP.PF, smoother(Math.min(1, q * 1.15))) }; };
    var G = bm, T = 2 * bm, climbMs = IP.ms || 2 * bm, tC = G + T, tE = tC + climbMs;
    /* 5 the grid scans on over the board's last frame, the tape tracks out (REW), the music drops to its hum */
    var gw = divEl('gridwrap', glassCSS() + ';overflow:hidden;will-change:transform,opacity', camG), gi = divEl('gridin', glassCSS() + ';will-change:transform', gw);
    var gk2 = Math.min(2, W.devicePixelRatio || 1), gc = D.createElement('canvas'); gc.className = 'grid'; gc.width = Math.round(Wg * gk2); gc.height = Math.round(Hg * gk2);
    gc.style.cssText = 'position:absolute;left:0;top:0;width:' + Wg + 'px;height:' + Hg + 'px'; gi.appendChild(gc);
    gridDraw(gc, fg, [1, 0, 0, 1], fg.c, fg.c, 1.25, 1);
    var yTop = Math.max(0, fg.o0.y), yBot = Math.min(Hg, fg.o0.y + fg.h * fg.ty); if (!(yBot > yTop)) { yTop = 0; yBot = Hg; }
    var off = function (u) { return Hg - (yTop + sstep(0, 1, u) * (yBot - yTop)); };
    play(gw, keys(12, function (u) { return { transform: 'translate(0px,' + (-off(u)).toFixed(1) + 'px)' }; }), 0.8 * bm, { fill: 'forwards' });
    play(gi, keys(12, function (u) { return { transform: 'translate(0px,' + off(u).toFixed(1) + 'px)' }; }), 0.8 * bm, { fill: 'forwards' });
    var osd = osdOn(DIVE.el, worldClock(cw), bm / 3, true);
    var bands = bandsOn(camG, pic, 'translate(0px,0px)', 0.3 * bm);
    humTo(true, 0.45);
    /* the live map, drawn ONCE where he was (his crew held as the map holds it), under everything */
    var zTo = z0 ? z0.z : c.z, held = !z0 || z0.camf, pTo = z0 && z0.at ? z0.at : null, F0 = { x: c.F.x, y: c.F.y }, liveDone = false;
    afterPaint(function () {
      if (DIVE.row !== r) return;
      var t = performance.now(), h = held ? (cam('heldAt', { z: zTo, u: u0, v: v0 }) || F0) : (pTo || F0);
      cam('aim', { z: zTo, u: u0, v: v0, sx: h.x, sy: h.y, camf: held });
      liveDone = true; r.renders.push({ name: 'live', z: +zTo.toFixed(3), ms: Math.round(performance.now() - t), at: Math.round(performance.now() - r.t0) });
    });
    /* the pictures, bottom to top: the way-in's own (his zoom first), the stop's still copy, the board's still copy, the stop turning
       and rewinding, the board turning back; the grid and the tape over them */
    var first = camG.firstChild, kept = (K.pics || []).map(function (q) { var p = picOf(q.c, q.box, 'map', null, camG); if (p) { p.zk = q.zk; p.sk = q.sk; p.layU = q.layU; camG.insertBefore(p.c, first); } return p; }).filter(Boolean);
    var Ks = picOf(K.c, K.box, 'map-still', null, camG), Ps = picOf(pic.c, pic.box, 'board-still', 1, camG), Kp = picOf(K.c, K.box, 'map', null, camG);
    [Ks, Ps, Kp].forEach(function (p) { if (p) camG.insertBefore(p.c, pic.c); });
    var turnAt = function (u) { var e = smoother(1 - u); return { A: turnA(mgT, fg, e), to: lerpP(mg.c, fg.c, e) }; };
    /* 5 THE TURN BACK, after the grid's beat */
    phase(r, 'grid');
    play(pic.c, keys(N, function (u) { var p = turnAt(u); return { transform: cssM(mm(p.A, minv(fg.M)), pic.box, fg.c, p.to), opacity: sstep(0.45, 0.85, 1 - u) }; }), T, { delay: G });
    if (Ps) play(Ps.c, keys(12, function (u) { return { opacity: sstep(0.45, 0.85, 1 - u) }; }), T, { delay: G });
    if (Ks) { Ks.c.style.transform = K.pose; play(Ks.c, [{ opacity: 1 }, { opacity: 0 }], 16, { delay: tC, fill: 'forwards' }); }
    if (Kp) play(Kp.c, keys(N, function (u) { var p = turnAt(u); return { transform: cssM(mm(p.A, minv(mg.M)), Kp.box, mg.c, p.to) }; }), T, { delay: G });
    play(gi, [{ opacity: 1 }, { opacity: 0 }], 0.3 * T, { delay: G, fill: 'forwards' });   /* the overlay signs off as the board starts to turn */
    (bands || []).forEach(function (b) { play(b, [{ opacity: 0.92 }, { opacity: 0 }], 0.6 * bm, { delay: G + 0.2 * bm, fill: 'forwards' }); });
    /* 6 THE CLIMB: the stop's picture, then each picture the camera came down through, each leaving where it was laid on the way in */
    var topU = 1 - (IP.topU != null ? IP.topU : 0.94);
    if (Kp) play(Kp.c, keys(N, function (u) { return { transform: poseOf(rewind(u), K.zEnd, K.PF), opacity: 1 - sstep(topU, topU + 0.05, u) }; }), climbMs, { delay: tC, fill: 'forwards' });
    kept.forEach(function (p, i) {
      var outU = i === 0 ? 2 : 1 - (p.layU || 0);   /* the lowest (his own zoom) stays to the end */
      var above = i + 1 < kept.length ? 1 - (kept[i + 1].layU || 0) : topU;   /* shown only from just before the one over it leaves (never composited under it) */
      play(p.c, keys(N, function (u) { return { transform: poseOf(rewind(u), p.zk, p.sk), opacity: sstep(above - 0.012, above - 0.002, u) * (1 - sstep(outU, outU + 0.05, u)) }; }), climbMs, { delay: tC });
    });
    if (osd) play(osd, [{ opacity: 1 }, { opacity: 0 }], bm * 0.5, { delay: tE - 0.25 * bm, easing: 'steps(3)', fill: 'forwards' });
    /* __THE_DIVE_GOES_THROUGH_THE_CLOUDS__: the climb goes back up through the same deck (the way down's own path, run backwards) */
    var cbK = K.cb || [0, 0, 0, 0], cbx = cbK.x != null ? cbK.x : cbK[0], cby = cbK.y != null ? cbK.y : cbK[1];
    var downPath = function (u) { var e = smoother(u); return { z: IP.z0 * Math.exp(Lz * e), s: { x: cbx + IP.P0.x + (IP.PF.x - IP.P0.x) * smoother(Math.min(1, u * 1.15)), y: cby + IP.P0.y + (IP.PF.y - IP.P0.y) * smoother(Math.min(1, u * 1.15)) } }; };
    var deck = cloudsOn(DIVE.el, downPath, climbMs, Lz, tC, true); r.clouds = deck ? deck.length : 0;
    if (deck && osd) DIVE.el.appendChild(osd);   /* the tape stays over the deck */
    humTo(false, (climbMs + 200) / 1000, tC / 1000);
    later(function () { phase(r, 'turn'); }, G);
    later(function () { nfcSet('off'); phase(r, 'climb'); landed(); }, tC);
    /* the rewind lands on his own zoom; the live map (drawn where he was) shows through as the picture goes */
    var end = function () {
      if (DIVE.row !== r) return;
      if (!liveDone && performance.now() - r.t0 < tE + 4000) { later(end, 60); return; }
      var lo = kept[0] || Kp; if (lo) play(lo.c, [{ opacity: 1 }, { opacity: 0 }], 0.3 * bm, { fill: 'forwards' });
      later(function () { DIVE.z0 = null; DIVE.keep = null; diveEnd(r); }, 0.3 * bm + 50);
    };
    later(end, tE);
  }
  function diveSkip() {
    if (DIVE.state === 'off' || DIVE.state === 'hold') return;
    (DIVE.anims || []).forEach(function (a) { try { if (a.playState !== 'finished') a.finish(); } catch (e) {} });
  }

  /* ======================================================================================================================
     __THE_REST_OF_THE_STATES__ (MOTION 3, 11/8/26, rule 436(a), asks 151, 257, 278; Paolo: 'the UI morphs: every big change (map, town,
     fight, camp, shop, jobs, the crew) transforms the shared pieces into each other with quick, on-the-beat animation; never static,
     never a cut; nothing just appears or vanishes').
     MEASURED FIRST on the demo at 390 x 844 (tools/bohemia_motion_three_every_change.js, every frame the compositor sent, the biggest
     share of the glass that changed in ONE frame against all the change the eye saw; records/BOHEMIA_MOTION_THREE_THE_REST_OF_THE_
     STATES_11_8_26.md): of 19 changes, SIX STILL CUT and two more jumped: a building's sheet opened on CSS's ease (600 of its 739 px in
     one frame: 60% of the glass) and closed with the town's signs popping back over it (72% in one frame); the shop's item card 31% in
     one frame; a job's card on the board 36%; the settings closed in one frame (23%, 100% of it); the fight's end put a black box over
     the whole glass for the loot screen's load (93%); the crew screen's hand-off 38%. The pieces were all there; nothing moved them.
     NOW THE REAL THING MOVES (no copy: these are pages of DOM a copy would cost a tenth of a second each, and the real one is already
     drawn): realMorph() holds the element's own styles, lays it at its own place with transition off, and drives its transform on the
     layer's holds (six a beat, on the music's clock, the first eighth past 250 ms for a piece, 500 ms for a screen): IN, it grows out of
     what he tapped (the building, the slot, the job's line, the phone's gear) with the tin's lean, squash and overshoot and the
     rivets on landing; OUT, it goes back into the thing it came from, fading on its last poses, and only then is it gone (the owner's
     hide is held off by its own style until the last pose). A FINGER HOLDS IT: a tap on a piece coming in freezes its pose until the tap
     is through (the press and the lift land on the same button), then it lands; a piece going out takes no finger. REDUCED MOTION: a
     fade in place over two holds. window.__MOTION_THREE_OFF = true is the old way (the checker's planted fail). Watched, never
     rewritten: the town's #sheet (its 'on'), its #sbody's pages, the weapon card (#bwcard), the shop's man strip (#shopfaces), the
     settings (#setwrap's 'on'), the loot screen's door (#spoilsdoor in, the shell's spoilsClose wrapped out).
     ====================================================================================================================== */
  function m3off() { try { return !!W.__MOTION_THREE_OFF; } catch (e) { return false; } }
  var REAL_KEYS = ['transform', 'transform-origin', 'transition', 'filter', 'opacity', 'pointer-events', 'will-change', 'display'];
  function realPut(el, k, v) { try { el.style.setProperty(k, v, 'important'); } catch (e) {} }
  function realSave(el) {
    var s = {}; REAL_KEYS.forEach(function (k) { s[k] = [el.style.getPropertyValue(k), el.style.getPropertyPriority(k)]; });
    if (el.__bmTr) { s.transition = el.__bmTr; }   /* a landing a frame ago still has the owner's transition put away: that one is his */
    el.__bmReal = s; el.__bmMine = {}; return s;
  }
  function realMine(el, k, v) { realPut(el, k, v); try { el.__bmMine[k] = v; } catch (e) {} }
  /* the element goes back to its own styles with no transition between (a slide from the last pose to its own place is the very pop
     this layer exists to stop), and the owner's own transition comes back two frames later. A style the owner wrote over ours while
     it moved is his: it stays. */
  function realRestore(el) {
    var s = el.__bmReal, mine = el.__bmMine || {}; if (!s) return; el.__bmReal = null; el.__bmMine = null;
    REAL_KEYS.forEach(function (k) {
      if (k === 'transition') return;
      if (mine[k] === undefined) return;   /* never ours */
      if (el.style.getPropertyPriority(k) !== 'important') return;   /* the owner wrote it while it moved: his */
      if (s[k][0]) el.style.setProperty(k, s[k][0], s[k][1]); else el.style.removeProperty(k);
    });
    realPut(el, 'transition', 'none');
    var w = el.ownerDocument.defaultView, tr = s.transition; el.__bmTr = tr;
    try { w.getComputedStyle(el).transform; } catch (e) {}
    w.requestAnimationFrame(function () { w.requestAnimationFrame(function () {
      if (el.__bmReal) return;   /* another morph has it: its landing brings the owner's back */
      el.__bmTr = null; if (tr && tr[0]) el.style.setProperty('transition', tr[0], tr[1]); else el.style.removeProperty('transition'); }); });
  }
  /* boxes in the element's own page (the frames here are 1:1, but never assumed) */
  function toDoc(doc, b) { if (!b) return null; var o = upFrom(doc, { x: 0, y: 0, w: 1000, h: 1000 }), k = (o.w / 1000) || 1; return { x: (b.x - o.x) / k, y: (b.y - o.y) / k, w: b.w / k, h: b.h / k }; }
  var LASTTAP = null;
  function lastTap(doc, e) {
    var t = e.target, hit = t && t.closest ? t.closest('button,.act,.slot,.gslot,.app,[role=button],[data-item],[data-slot]') : null, r = null;
    try { if (hit) { r = hit.getBoundingClientRect(); if (r.width < 2 || r.width * r.height > 0.25 * (doc.defaultView.innerWidth * doc.defaultView.innerHeight)) r = null; } } catch (_e) { r = null; }
    var b = r ? { x: r.left, y: r.top, w: r.width, h: r.height } : { x: (e.clientX || 0) - 20, y: (e.clientY || 0) - 14, w: 40, h: 28 };
    LASTTAP = { at: epochNow(), doc: doc, box: upFrom(doc, b), inSheet: !!(t && t.closest && t.closest('#sheet')) };
  }
  function recentTap(ms) { return LASTTAP && epochNow() - LASTTAP.at < (ms || 900) ? LASTTAP : null; }
  /* its own place, read off the layout (no transform of anybody's, no style written to read it) */
  function layoutBox(el) {
    var op = el.offsetParent, x = el.offsetLeft, y = el.offsetTop;
    if (op) { var r = op.getBoundingClientRect(); x += r.left + op.clientLeft - (op.scrollLeft || 0); y += r.top + op.clientTop - (op.scrollTop || 0); }
    return { x: x, y: y, w: el.offsetWidth, h: el.offsetHeight };
  }
  /* PLAYED BY THE COMPOSITOR (PLUMBER 7's 11/7zd numbers: what the page's thread draws a morph at is what a cheap phone shows): the
     poses are laid as ONE Web Animation of transform and opacity, each pose a keyframe held with step-end until the next hold, so the
     stop-motion grid is the animation's own and the page's thread writes no style a frame. A box laid again while it grows (a shop's
     sheet laid taller) re-lays the keyframes on the same clock (a ResizeObserver). */
  function realPoseOf(m, k, n) {
    var x = n <= 1 ? 1 : Math.min(1, k / (n - 1)), last = k === n - 1, first = k === 0;
    /* a piece that fills much of the glass travels on an even curve (the emphasized one put 80% of a whole-glass sheet's travel on its
       first pose: a cut with extra steps, __A_STALL_HOLDS__'s own finding); a small one decelerates the way Material's does */
    var p = first ? 0 : ((m.dir === 'out' || m.big) ? 0.5 - 0.5 * Math.cos(Math.PI * x) : emphasized(x)); if (last) p = 1;
    var b = m.base, cur = lerp(m.a, m.end, p), prev = k > 0 ? lerp(m.a, m.end, m.ps[k - 1]) : m.a; m.ps[k] = p;
    m.cover[k] = coverOf(cur, m.glass) * (m.dir === 'out' ? Math.max(0, Math.min(1, (1 - p) * 2.4)) : 1);
    var vx = (cur.x + cur.w / 2) - (prev.x + prev.w / 2), vy = (cur.y + cur.h / 2) - (prev.y + prev.h / 2);
    var sp = Math.sqrt(vx * vx + vy * vy), lean = first || last ? 0 : Math.max(-5, Math.min(5, -vx * 0.04)), sq = first ? 0 : Math.min(0.06, sp * 0.0005);
    var over = last && m.dir === 'in' ? 1.025 : 1, horiz = Math.abs(vx) >= Math.abs(vy);
    var sx = Math.max(0.01, cur.w / b.w) * over * (1 + (horiz ? sq : -sq * .5)), sy = Math.max(0.01, cur.h / b.h) * over * (1 + (horiz ? -sq * .5 : sq));
    var jx = first ? 0 : (m.jit[k * 2] - .5) * .8, jy = first ? 0 : (m.jit[k * 2 + 1] - .5) * .8;   /* the boil, the same on a re-lay */
    var ox = cur.x - b.x - (over - 1) * cur.w / 2 + jx, oy = cur.y - b.y - (over - 1) * cur.h / 2 + jy;
    var f = { transform: 'translate(' + ox.toFixed(1) + 'px,' + oy.toFixed(1) + 'px) skewX(' + lean.toFixed(2) + 'deg) scale(' + sx.toFixed(4) + ',' + sy.toFixed(4) + ')' };
    /* going back, it fades on its last poses into the thing it came from; coming in, the first pose is the size of what was tapped */
    f.opacity = m.dir === 'out' ? +Math.max(0, Math.min(1, (1 - p) * 2.4)).toFixed(2) : 1;
    return f;
  }
  function realKeys(m) {
    var n = m.holds.length, D = Math.max(1, m.t1 - m.ts), out = [];
    m.ps = []; m.cover = []; if (!m.jit) { m.jit = []; for (var i = 0; i < 2 * n + 2; i++) m.jit.push(Math.random()); }
    for (var k = 0; k < n; k++) {
      var off = k === 0 ? 0 : Math.max(0, Math.min(1, (m.holds[k - 1] - m.ts) / D));
      var f = m.reduced ? { transform: 'none', opacity: +(m.dir === 'out' ? Math.max(0, 1 - (k + 1) / (n + 1)) : Math.min(1, (k + 1) / (n + 1))).toFixed(2) } : realPoseOf(m, k, n);
      f.offset = off; f.easing = 'step-end'; out.push(f);
    }
    out.push({ offset: 1, transform: m.dir === 'out' && !m.reduced ? out[n - 1].transform : 'none', opacity: m.dir === 'out' ? 0 : 1 });
    /* the record: how much of the glass each pose covers, and the biggest step between two poses (the gate reads the drawn frames too) */
    if (!m.reduced) { var cv = m.cover.slice(); cv.push(m.dir === 'out' ? 0 : coverOf(m.end, m.glass)); if (m.dir === 'out') cv.unshift(coverOf(m.a, m.glass));
      var st = 0; for (var q = 1; q < cv.length; q++) st = Math.max(st, Math.abs(cv[q] - cv[q - 1])); m.row.poses = n; m.row.step = +st.toFixed(3); }
    return out;
  }
  function realPlay(m) {
    var el = m.el, win = el.ownerDocument.defaultView;
    try {
      m.anim = el.animate(realKeys(m), { duration: Math.max(1, m.t1 - m.ts), fill: 'both' });
      m.row.compositor = true;
    } catch (e) { m.row.err = 'no animate: ' + String(e && e.message || e).slice(0, 80); realLand(m, true); return; }
    /* THE CLOCK STARTS ON THE FIRST FRAME THAT IS DRAWN (the layer's own rule): the first pose stands from this task, and the poses
       run from the first of two frames the page draws quickly in a row (never later than calmMax, 400 ms; the loot screen's LEAVE
       1,500), so the screen's own work around the tap (the way home after the loot screen's LEAVE: one 433 to 683 ms frame, measured)
       never eats them; a stall is logged */
    try { m.anim.pause(); m.anim.currentTime = 0; } catch (e) {}
    var made = epochNow(), prev = null, calm = m.o.calmMax || 400;
    var go = function () {
      if (m.done || !m.anim) return;
      var now = epochNow(), quick = prev !== null && now - prev < 40; prev = now;
      if (!quick && now - made < calm) { win.requestAnimationFrame(go); return; }   /* two frames in a row drawn quickly: the page is drawing again */
      var d = now - made; if (d > holdMs()) m.row.stall = Math.round(d);
      m.ts += d; m.t1 += d; for (var i = 0; i < m.holds.length; i++) m.holds[i] += d;
      if (!m.frozen) { try { m.anim.play(); } catch (e) {} }
    };
    win.requestAnimationFrame(go);
    var RO = el.ownerDocument.defaultView.ResizeObserver;
    if (m.dir === 'in' && RO) { try { m.ro = new RO(function () { if (m.done || !m.anim) return; var nb = layoutBox(el);
      if (Math.abs(nb.w - m.base.w) + Math.abs(nb.h - m.base.h) + Math.abs(nb.x - m.base.x) + Math.abs(nb.y - m.base.y) > 1) { m.base = nb; m.end = nb; m.row.relaid = (m.row.relaid | 0) + 1; try { m.anim.effect.setKeyframes(realKeys(m)); } catch (e) {} } });
      m.ro.observe(el); } catch (e) {} }
    if (m.o.with) { try { m.with = m.o.with(m); } catch (e) {} }
  }
  function coverOf(b, g) { if (!b || !g) return 0; var w = Math.max(0, Math.min(b.x + b.w, g.w) - Math.max(b.x, 0)), h = Math.max(0, Math.min(b.y + b.h, g.h) - Math.max(b.y, 0)); return w * h / Math.max(1, g.w * g.h); }
  function realMorph(o) {
    var el = o.el; if (!isEl(el) || !el.isConnected || typeof el.animate !== 'function') return null;
    LIVE.filter(function (x) { return x.how === 'real' && x.el === el; }).forEach(function (x) { realLand(x, true); });
    var doc = el.ownerDocument, dir = o.dir === 'out' ? 'out' : 'in';
    realSave(el);
    realMine(el, 'transition', 'none'); realMine(el, 'transform-origin', '0 0'); realMine(el, 'will-change', 'transform, opacity');
    if (o.keep) { try { o.keep(el); } catch (e) {} }
    if (dir === 'out') realMine(el, 'pointer-events', 'none');   /* what is going takes no finger: a tap reaches what it uncovers */
    var b = layoutBox(el), dw = doc.defaultView, glass = { w: dw.innerWidth || 1, h: dw.innerHeight || 1 };
    if (b.w < 2 || b.h < 2) { realRestore(el); return null; }
    /* a piece that covers a tenth of the glass or more (a sheet, the settings, the loot screen) is a change of screen: it takes a
       screen's time (500 to 750 ms, six poses or more: four poses over 300 ms were swallowed whole by one of the board's own slow
       frames, measured); a card or a strip takes a piece's (250 to 500 ms) */
    var big = coverOf(b, glass);
    var oo = {}; for (var kk in o) oo[kk] = o[kk]; if (big > 0.1 && !o.small) oo.kind = 'mode';
    var m = begin(oo, 'real'); m.dir = dir; m.row.dir = dir; m.el = el; m.glass = glass; m.big = big > 0.25; m.row.cover = +big.toFixed(2);
    var tb0 = topBox(m.dir === 'out' ? o.to : o.from), f = toDoc(doc, tb0);
    /* UI THREE 11/14 (rule 448, the gate THE PHONE IS THE DOOR): the record says where it came from or went back to, in the top glass */
    if (tb0 && tb0.w > 0) m.row.at = [Math.round(tb0.x + tb0.w / 2), Math.round(tb0.y + tb0.h / 2)];
    if (!f || !(f.w > 0)) f = { x: b.x + b.w / 2 - 24, y: b.y + b.h / 2 - 16, w: 48, h: 32 };
    m.base = b; m.a = m.dir === 'out' ? b : f; m.end = m.dir === 'out' ? f : b;
    if (o.ready) { var ok = false; try { ok = !!o.ready(); } catch (e) { ok = true; } if (!ok) { m.waitReady = true; m.waitFrom = m.t0; realMine(el, 'opacity', '0'); } }
    if (!m.waitReady) realPlay(m);
    return start(m);
  }
  function realTick(m, t) {
    if (m.waitReady) {
      var ok = false; try { ok = !!m.o.ready(); } catch (e) { ok = true; }
      if (!ok && t - m.waitFrom < (m.o.waitMs || READY_MAX)) return;
      m.waitReady = false; m.row.waitedReady = Math.round(t - m.waitFrom);
      plan(m, t); realPlay(m);
      try { var s0 = m.el.__bmReal && m.el.__bmReal.opacity; if (s0 && s0[0]) m.el.style.setProperty('opacity', s0[0], s0[1]); else m.el.style.removeProperty('opacity'); delete m.el.__bmMine.opacity; } catch (e) {}
      return;
    }
    if (m.frozen) return;   /* his finger is on it */
    if (!m.anim) return;
    var ps = m.anim.playState;
    if (ps === 'finished' || ps === 'idle' || t > m.t1 + 3000) realLand(m, false);
  }
  function realLand(m, skipped) {
    if (m.done) return;
    m.done = true; m.skipped = skipped;
    var i = LIVE.indexOf(m); if (i >= 0) LIVE.splice(i, 1);
    try { if (m.ro) m.ro.disconnect(); } catch (e) {}
    try { if (m.anim) { m.row.posed = m.anim.currentTime != null ? Math.round(m.anim.currentTime) : null; m.anim.cancel(); } } catch (e) {}
    try { if (m.with && m.with.cancel) m.with.cancel(); } catch (e) {}
    realRestore(m.el);
    var t = epochNow();
    m.row.t1 = Math.round(t); m.row.ms = Math.round(t - m.t0); m.row.flew = Math.round(t - (m.ts || m.t0)); m.row.planned = Math.round(m.t1 - (m.ts || m.t0));
    m.row.holds = m.holds ? m.holds.length : 0; m.row.frames = m.frames; m.row.gaps = m.gaps; m.row.skipped = skipped;
    if (!m.reduced && !skipped && m.dir === 'in' && m.o.rivets !== false) rivets(topBox(m.el));
    if (m.o.onLand) { try { m.o.onLand(skipped, m); } catch (e) {} }
  }

  /* ---- THE TOWN'S SHEET (RUN TWO's settlement screen): a building's sheet grows out of the building he tapped and goes back into it;
     a page he turns inside it (the board to a job, a job to the board) grows out of the line he tapped; the shop's man strip out of
     the slot he tapped ---- */
  function sheetSig(body) {
    var out = [];
    for (var c = body.firstElementChild; c; c = c.nextElementSibling) { if (c.id === 'shopfaces' || (c.classList && c.classList.contains('fstrip'))) continue; out.push(c.tagName + '.' + (typeof c.className === 'string' ? c.className : '')); }
    var nm = body.querySelector('.nm'); return out.join(',') + '|' + (nm ? nm.textContent : '');
  }
  function watchSheet(sw) {
    var doc = sw.document, sh = doc.getElementById('sheet'), body = doc.getElementById('sbody');
    if (!sh || !body || sh.__bmM3 || !W.MutationObserver) return;
    sh.__bmM3 = true; AD.sheet = true;
    var st = { on: sh.classList.contains('on'), k: null, from: null, sig: sheetSig(body), strip: doc.getElementById('shopfaces') };
    var S = function () { try { return sw.BohemiaSettlement.state; } catch (e) { return null; } };
    /* the building itself, as the town's picture draws it now (rule 438(a), Paolo 11/8: the floating signs come off, 'a building says
       what it is when he taps it (its sheet)'): its box in the picture (the settlement's own VAR.boxes, view.s, view.ox/oy, read,
       never panned), else its sign while UI 9's signs stand, else where his finger went down */
    var signOf = function (k) {
      try { var V = sw.VAR, vw = sw.view, sc = doc.getElementById('scene'), bx = k && V && V.boxes && V.boxes[k];
        if (bx && vw && sc && vw.s > 0) { var r = sc.getBoundingClientRect(), b = { x: r.left + vw.ox + bx[0] * vw.s, y: r.top + vw.oy + bx[1] * vw.s, w: (bx[2] - bx[0]) * vw.s, h: (bx[3] - bx[1]) * vw.s };
          if (b.w > 4 && b.h > 4 && b.x + b.w > 0 && b.y + b.h > 0 && b.x < (sw.innerWidth || 1e4) && b.y < (sw.innerHeight || 1e4)) return upFrom(doc, b); } } catch (e) {}
      try { var s = k && sw.DS && sw.DS.signs && sw.DS.signs[k]; return s && shown(s) ? topBox(s) : null; } catch (e) { return null; } };
    var signsEl = function () { try { return sw.DS && sw.DS.el; } catch (e) { return null; } };
    /* the town's signs (while UI 9's stand: rule 438(a) takes them off) come back with the sheet going home: they fade up as it goes
       into its building (they popped back over a closing sheet in one frame) */
    var fadeSigns = function (comingIn) { return function (m) { var g = signsEl(); if (!g || typeof g.animate !== 'function') return null;
      var n = Math.max(2, m.holds.length); return g.animate([{ opacity: comingIn ? 1 : 0 }, { opacity: comingIn ? 0 : 1 }], { duration: Math.max(1, m.t1 - m.ts), easing: 'steps(' + n + ', end)', fill: 'both' }); }; };
    new W.MutationObserver(function () {
      var on = sh.classList.contains('on'); if (on === st.on) return; st.on = on;
      if (m3off()) return;
      var s = S();
      if (on) {
        st.k = s && (s.open || s.sheetFor); st.sig = sheetSig(body); st.strip = doc.getElementById('shopfaces');
        var tp = recentTap(1500), from = signOf(st.k) || (tp && !tp.inSheet ? tp.box : null); st.from = from;
        realMorph({ id: 'sheet', kind: 'piece', el: sh, dir: 'in', from: from });
      } else {
        var to = signOf(st.k) || st.from;
        realMorph({ id: 'sheet', kind: 'piece', el: sh, dir: 'out', to: to, rivets: false, with: fadeSigns(false) });
      }
    }).observe(sh, { attributes: true, attributeFilter: ['class'] });
    new W.MutationObserver(function (list) {
      if (m3off() || !sh.classList.contains('on')) { st.sig = sheetSig(body); st.strip = doc.getElementById('shopfaces'); return; }
      /* a sheet still growing that his finger froze (he tapped a job before it landed): the tap is through, it lands now, and the page
         he turned grows (measured on the phone strip: the job's card skipped its morph behind a frozen board) */
      LIVE.filter(function (x) { return x.how === 'real' && x.el === sh && x.frozen; }).forEach(function (x) { realLand(x, true); });
      var growing = LIVE.some(function (x) { return x.how === 'real' && x.el === sh && x.dir === 'in'; });
      var tp = recentTap(900);
      var sig = sheetSig(body);
      if (sig !== st.sig) {
        st.sig = sig;
        if (!growing && tp && tp.inSheet) realMorph({ id: 'page', kind: 'piece', el: body, dir: 'in', from: tp.box });
      }
      var strip = doc.getElementById('shopfaces');
      if (strip && strip !== st.strip && !growing && tp && tp.inSheet && shown(strip) && !LIVE.some(function (x) { return x.how === 'real' && x.el === body; }))
        realMorph({ id: 'strip', kind: 'piece', small: true, el: strip, dir: 'in', from: tp.box });
      st.strip = strip;
    }).observe(body, { childList: true, subtree: true });
  }
  /* ---- THE WEAPON CARD (UI 8's #bwcard, rule 433: a detail shows when he taps for it): it grows out of the slot he tapped and goes
     back into it when a tap puts it away ---- */
  function watchCard(doc) {
    if (doc.__bmM3card || !doc.body || !W.MutationObserver) return; doc.__bmM3card = true;
    var hook = function (c) {
      if (!c || c.__bmM3) return; c.__bmM3 = true; AD.card = true;
      var was = false, from = null;
      var look = function () {
        if (c.style.getPropertyPriority('display') === 'important') return;   /* ours, holding it while it goes */
        var now = c.isConnected && c.style.display !== 'none';
        if (now === was) return; was = now;
        if (m3off()) return;
        if (now) { var tp = recentTap(900); from = tp ? tp.box : null; realMorph({ id: 'card', kind: 'piece', small: true, el: c, dir: 'in', from: from }); }
        else realMorph({ id: 'card', kind: 'piece', small: true, el: c, dir: 'out', to: from, rivets: false, keep: function (el) { realMine(el, 'display', 'block'); } });
      };
      new W.MutationObserver(look).observe(c, { attributes: true, attributeFilter: ['style'] });
      look();
    };
    hook(doc.getElementById('bwcard'));
    new W.MutationObserver(function (list) { list.forEach(function (mu) { Array.prototype.forEach.call(mu.addedNodes, function (n) { if (n.nodeType === 1 && n.id === 'bwcard') hook(n); }); }); }).observe(doc.body, { childList: true });
  }
  /* ---- THE SETTINGS (#setwrap, the gear's): it grows out of the gear he pressed (the phone's SETTINGS, else the bar's) and goes back
     into it ---- */
  function gearBox() {
    var a = Array.prototype.find.call(D.querySelectorAll('#bohphone .app[data-app=settings]'), function (e) { return shown(e); });
    if (a) return topBox(a);
    var g = D.getElementById('gearbtn'); if (g && shown(g)) return topBox(g);
    return null;
  }
  function watchSettings() {
    var w = D.getElementById('setwrap'); if (!w || w.__bmM3 || !W.MutationObserver) return; w.__bmM3 = true; AD.settings = true;
    var on = w.classList.contains('on'), from = null;
    new W.MutationObserver(function () {
      var now = w.classList.contains('on'); if (now === on) return; on = now;
      if (m3off()) return;
      if (now) { var tp = recentTap(1500); from = gearBox() || (tp ? tp.box : null); realMorph({ id: 'settings', kind: 'piece', el: w, dir: 'in', from: from }); }
      else realMorph({ id: 'settings', kind: 'piece', el: w, dir: 'out', to: gearBox() || from, rivets: false, keep: function (el) { realMine(el, 'display', 'flex'); } });
    }).observe(w, { attributes: true, attributeFilter: ['class'] });
  }
  /* ---- THE LOOT SCREEN (RUN TWO's __THE_SPOILS__ in the shell): its door was a black box over the whole glass while its page loaded
     (the board gone to black in one frame, then the spoils drawn into it); now the board stays on the glass under a door you cannot
     see until the spoils are drawn, and they come up out of his phone; LEAVE folds them back into it while the way home starts ---- */
  function trayBox() {
    var e = find('abilities') || find('phone'); var b = e ? topBox(e) : null;
    if (b) return b;
    if (LASTPHONE) return LASTPHONE;
    return { x: W.innerWidth / 2 - 40, y: W.innerHeight / 2 - 30, w: 80, h: 60 };
  }
  function watchSpoils() {
    if (D.__bmM3spoils || !D.body || !W.MutationObserver) return; D.__bmM3spoils = true; AD.spoils = true;
    new W.MutationObserver(function (list) {
      list.forEach(function (mu) { Array.prototype.forEach.call(mu.addedNodes, function (n) {
        if (n.nodeType !== 1 || n.id !== 'spoilsdoor' || m3off()) return;
        var f = n.querySelector('iframe'), seen = 0;
        realMorph({ id: 'spoils', kind: 'mode', el: n, dir: 'in', from: trayBox(), waitMs: 2500,
          ready: function () { try { var d = f && f.contentDocument; if (!d || d.readyState !== 'complete' || !d.body) return false;
            if (d.fonts && d.fonts.status !== 'loaded') return false;
            if ((d.body.innerText || '').replace(/\s+/g, '').length < 40) return false;
            return ++seen >= 2; } catch (e) { return true; } } });   /* drawn, and one frame more */
      }); });
    }).observe(D.body, { childList: true });
    AD.spoilsOut = wrapFn(W, 'spoilsClose', function (orig) {
      return function () {
        var el = null; try { el = W.SPOILS && W.SPOILS.wrap; } catch (e) {}
        if (!el || !el.isConnected || m3off()) return orig.apply(this, arguments);
        el.remove = function () {};   /* the shell lets go of its door; the door leaves after it has gone back into the phone */
        var r; try { r = orig.apply(this, arguments); } finally { try { delete el.remove; } catch (e) {} }
        var gone = function () { try { el.remove(); } catch (e) {} };
        var mm = realMorph({ id: 'spoils', kind: 'piece', el: el, dir: 'out', to: trayBox(), rivets: false, onLand: gone, calmMax: 1500 });
        if (!mm) gone();
        return r;
      };
    });
  }
  /* ==== end __THE_REST_OF_THE_STATES__ ==== */

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
        /* __THE_REST_OF_THE_STATES__: the phone's HEAL is the camp's door (rule 226): the camp grows out of it and goes back into it */
        var ha = doc.querySelector('#bohphone .app[data-app=heal]'); if (ha) tag(ha, 'camp');
      } catch (e) {}
      watchCrew(doc);
      if (typeof w.loopOpenTown === 'function') installCity(w);
      if (w.BohemiaSettlement && doc.getElementById('sbody')) { watchTown(w); watchSheet(w); }
      watchCard(doc);
    });
    if (typeof W.nfOpen === 'function') { installTop(); cloudsPrep(); }
    watchSettings(); if (typeof W.spoilsClose === 'function') watchSpoils();
  }
  setInterval(scan, 400);
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', scan); else scan();

  W.BohemiaMotion = {
    version: '11/8m3',
    fly: fly, grow: grow, shrink: shrink, hold: hold, skip: skip, find: find, tag: tag,
    box: topBox, copyOf: copyOf, pictureOf: pictureOf, cropOf: cropOf, reduced: reduced,
    busy: function () { return LIVE.length; },
    live: function () { return LIVE.map(function (m) { return { id: m.id, how: m.how, kind: m.kind, k: m.k, holds: m.holds ? m.holds.length : 0, waiting: m.waiting }; }); },
    log: LOG, taps: TAPS, adapters: AD,
    /* __THE_ZOOM_DOWN_INTO_THE_BOARD__: the shell's nfOpen hands its build to down(d, go); nfHome is wrapped (AD.home) */
    dive: { down: diveDown, state: function () { return DIVE.state; }, log: DIVE.log, at: function () { return DIVE.at; }, clear: diveClear },
    campHold: { on: function () { return CAMPHOLD.on; }, rows: CAMPHOLD.rows, held: campHeld },   /* __THE_CAMP_IS_SET_UP_WHILE_HE_WATCHES__ */
    budget: { piece: [PIECE_MIN, 2 * PIECE_MIN], mode: [MODE_MIN, MODE_MIN + PIECE_MIN], ceiling: CEILING, fade: 200, wait: WAIT_MAX, ready: READY_MAX },
    clock: function () { var g = beat(); return { src: g.src, beatMs: g.bm, holdMs: g.bm / 6 }; },
    slowly: function (k) { SLOW = Math.max(1, +k || 1); return SLOW; }
  };
})();
