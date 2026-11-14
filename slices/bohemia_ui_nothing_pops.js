/* BOHEMIA -- NOTHING POPS, EVERY VOICE CLEAR OF THE PHONE, AND THE TOOLTIPS  (UI 4, 11/2/26; rule 324 and rule 316's tooltip note;
   ask lines 322 and 312 in records/BOHEMIA_EVERYTHING_HE_ASKED_10_24_26.md)

   PAOLO 11/2, playing: 'just keep in mind all your pop-ups have to transition... I'm seeing the phone covers up the UI box where
   people are talking, where we can talk to them.' And: 'Battle Brothers... text bubbles... text pop-ups kind of how we do, and we
   still need to work on our tooltip [stuff] for real.'  Record: records/BOHEMIA_UI_NOTHING_POPS_VOICES_CLEAR_TOOLTIPS_11_2_26.md

   ONE FILE, LOADED ONCE IN THE SHELL'S HEAD (the alpha, cut into the demo), ARMING EVERY PAGE OF THE GAME FROM THE TOP, the way
   MOTION's layer does: the map (BOHEMIA_CITY_WORLD), the town (BOHEMIA_SETTLEMENT_SCREEN), the crew screen (BOHEMIA_ROSTER_SCREEN),
   the fight (BOHEMIA_FIGHT), the end screen (BOHEMIA_SPOILS_SCREEN) and the shell itself. Nobody's code is rewritten: each page's
   own pop-ups are named below by their own ids, and this file watches them appear and leave.

   1. NOTHING POPS. A pop-up that appeared or vanished in one frame now comes in and goes out in the house's motion: drawn ON TWOS,
      six held poses a beat on the music's own clock (BOHEMIA_BEAT, the grid MOTION's morphs use), the tin grows out of the finger
      that opened it and overshoots before it lands (three holds, 250 ms at 120 BPM), and goes back in two (167 ms). A piece inside a
      screen (the crew screen's LET HIM GO and its level-up) unrolls in place. Leaving, a COPY of the pop-up as it was (every style
      read off the real one before it went) shrinks away, so the real one is gone at once and nothing waits on the motion: a tap
      lands where it always did. A tap during any of it finishes it in that frame (MOTION's stop cord). The MOTION setting (FULL /
      LESS, the phone's own reduce-motion by default) turns all of it into a two-hold fade in place.
      A page that redraws a pop-up (takes it out and puts the same one back in one go) is NOT a pop-up opening: nothing moves.
   2. THE PHONE NEVER COVERS A VOICE. Every box where a person speaks (the road's mouth card and the side quests' givers, the meet
      card, the fight's veteran, the long-press card, the tooltips, the town's warnings) is measured against the phone's rectangle
      (BOH_PHONE_RECT, UI TWO's one answer) in its own page, the moment it shows and every quarter second after, phone left or right,
      upright or sideways; a box that overlaps it moves the shortest way clear (up, or across), 8 points off the phone, by the CSS
      'translate' property alone, so the page's own transform and layout are untouched; a box too tall for the room left is capped
      to it and scrolls.
   3. THE TOOLTIPS, THE BATTLE BROTHERS WAY. A finger held still on anything that has a line (480 ms; a mouse resting 650 ms) shows
      a small card about it, one plain line, transitioned like every pop-up and clear of the phone; the next touch anywhere puts it
      away, and the tap that ends a hold is not also a press. What has a line: the crew screen's stats (WORDS' stat_help.json, owed
      to UI), perks (WORDS' plain lines, perk_translation.json 'skin'), traits (traits.json 'says') and every item (its own numbers,
      read plainly); the fight's bare ground (the tile's row in WORLD's ground table; a man and a building keep the fight's own hold
      cards); the town's buildings; the bar's counts; the phone's apps and the fight's buttons on it; anything any lane marks with
      data-tip="..." (and data-tip-head). New lines: records/target/ui/BOHEMIA_TIPS.json, every one draft:true for WORDS.

   THE RECORD: BohemiaPops.log (one row per transition: { id, ev: 'in'|'out', doc, t, ms, holds, reduced, via }), BohemiaPops.voices
   (one row per box moved clear: { id, doc, dx, dy, phone }), BohemiaPops.tips (one row per tooltip: { doc, head, line, how }).
   BohemiaPops.off(true) is the probe's switch for a BEFORE picture; the game never sets it.
   ==================================================================================================================== */
(function () {
  'use strict';
  try { if (window.top !== window && window.top.BohemiaPops) { window.BohemiaPops = window.top.BohemiaPops; return; } } catch (e) {}
  if (window.BohemiaPops) return;
  var W = window, D = document;
  var OFF = false;
  try { OFF = localStorage.getItem('bohemia.pops.off') === '1'; } catch (e) {}   /* the probe's BEFORE; the game never sets it */
  var LOG = [], VOICES = [], TIPS_LOG = [];
  var TIP_MS = 480, HOVER_MS = 650, REDRAW_MS = 450, Z_GHOST = 2147483400, Z_TIP = 2147483300, MARGIN = 8;

  /* ---------------------------------------------------------------- THE POP-UPS, BY THEIR OWN NAMES, PAGE BY PAGE
     id: the row's name in the log; page: the file it lives in (any = every page); sel: the pop-up; inner: the plate inside a
     full-glass dim (it grows, the dim fades); how: card (a plate on the glass) | piece (a part of a screen, unrolls in place);
     voice: the box a person speaks from, kept clear of the phone. Rows that already move on their own (the town's sheet slides,
     the phone's apps strike in, the hints rise beside the phone, MOTION's crew screen and towns) are in the record's table, not here. */
  /* __THE_PHONE_IS_THE_DOOR__ (UI THREE 11/14, VAMILY rule 448, ask row 615; Paolo 11/14: 'when in doubt and you don't know what to do
     with the UI transitions, just do it from where the phone screen would be at all times... if you don't have an artistic thing to
     combine something with, just do it from the phone, where the phone is at, just have it come out from there'). EVERY ROW NAMES
     WHERE IT OPENS FROM (from): 'phone' (it has no thing of its own in the world: it travels out of the phone's spot and goes back
     into it, the same spot on every screen, the phone drawn or not), 'world' (it grows from its own thing: at(w) gives it), 'finger'
     (a tooltip is about the thing under the finger), 'piece' (a piece inside a screen unrolls in place), 'top' (the fight's own, FIGHT
     SCREEN's glass, rule 449). The real screens MOTION moves itself keep their own: the town's sheet grows out of the building he
     tapped, the settings out of the phone's SETTINGS, the loot screen out of the phone (bohemia_motion.js, realMorph). The gate THE PHONE
     IS THE DOOR reads this table and MOTION's record and counts every screen change on the page against them. */
  var POPS = [
    { id: 'road card', page: /CITY_WORLD/, sel: '#roadcard', inner: '.rc', how: 'card', voice: '.rc', from: 'phone' },
    { id: 'meet card', page: /CITY_WORLD/, sel: '#meetcard', inner: '.mc', how: 'card', voice: '.mc', from: 'phone' },
    { id: 'day card', page: /CITY_WORLD/, sel: '#daycard', how: 'card', from: 'phone' },
    { id: 'notes', page: /CITY_WORLD/, sel: '#notewrap', how: 'card', from: 'phone' },
    { id: 'town talk', page: /CITY_WORLD/, sel: '#cttalk', how: 'card', voice: '#cttalk', from: 'phone' },
    { id: 'town warning', page: /SETTLEMENT/, sel: '#campwarn', how: 'card', voice: '#campwarn', own: true, from: 'phone' },
    { id: 'let him go?', page: /ROSTER/, sel: '#card .ask', how: 'piece', from: 'piece' },
    { id: 'level-up', page: /ROSTER/, sel: '#levelup', how: 'piece', from: 'piece' },
    { id: 'fight veteran', page: /FIGHT/, sel: '#vet', how: 'card', voice: '#vet', from: 'top' },
    { id: 'weapon card', page: /FIGHT/, sel: '#drawer', how: 'card', from: 'top' },
    { id: 'fight over', page: /FIGHT/, sel: '#over', inner: ':scope > *', how: 'card', from: 'top' },
    { id: 'injury card', page: /FIGHT|SPOILS|ROSTER/, sel: '.injc', how: 'piece', from: 'piece' },
    { id: 'settings', page: /DEMO|ALPHA/, sel: '#setwrap', inner: ':scope > *', how: 'card', from: 'phone' },
    { id: 'end screen', page: /DEMO|ALPHA/, sel: '#spoilsdoor', how: 'card', plate: true, from: 'phone' },
    { id: 'kills card', page: /./, sel: '#bkt-card', how: 'card', voice: '#bkt-card', from: 'phone' },
    { id: 'tooltip', page: /./, sel: '#bptip', how: 'card', voice: '#bptip', from: 'finger' }
  ];

  /* ---------------------------------------------------------------- the clock and the setting (MOTION's, read the same way) */
  function epochNow() { return performance.timeOrigin + performance.now(); }
  function grid() {
    var B = W.BOHEMIA_BEAT;
    try { if (B && B.now && B.epoch) { var s = B.now(), e = B.epoch(); if (s && s.beatMs > 0 && isFinite(e)) return { e: e, hm: s.beatMs / 6 }; } } catch (x) {}
    return { e: 0, hm: 500 / 6 };
  }
  /* the holds of a move that starts now: the first runs to the next mark of the music's grid (at least half a hold), the rest a hold each */
  function holds(n) {
    var g = grid(), t = epochNow(), hm = g.hm, first = hm - ((t - g.e) % hm + hm) % hm;
    if (first < hm * 0.5) first += hm;
    var out = [first]; for (var i = 1; i < n; i++) out.push(hm);
    return out;
  }
  function reduced() {
    try { if (W.BohemiaMotion && W.BohemiaMotion.reduced) return !!W.BohemiaMotion.reduced(); } catch (e) {}
    try { if (W.BOHEMIA_SETTINGS && W.BOHEMIA_SETTINGS.motion) return !!W.BOHEMIA_SETTINGS.motion(); } catch (e) {}
    try { return !!(W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) {}
    return false;
  }
  /* keyframes held pose by pose (stop-motion on twos): every keyframe's easing is a step, so a pose stands for its whole hold */
  function stepped(poses, rest, durs) {
    var T = durs.reduce(function (a, b) { return a + b; }, 0), acc = 0, out = [];
    poses.forEach(function (p, i) { var k = {}; for (var x in p) k[x] = p[x]; k.offset = acc / T; k.easing = 'steps(1, end)'; out.push(k); acc += durs[i]; });
    var r = {}; for (var y in rest) r[y] = rest[y]; r.offset = 1; out.push(r);
    return { kf: out, ms: T };
  }

  /* ---------------------------------------------------------------- every page of the game, from the top */
  function pageOf(w) { try { return (w.location.pathname.split('/').pop() || '').replace(/\.html$/, ''); } catch (e) { return '?'; } }
  function eachWin(fn) {
    var visit = function (w, depth) {
      if (depth > 5) return;
      try { if (!w.document || !w.document.documentElement) return; fn(w); } catch (e) { return; }
      try { for (var i = 0; i < w.frames.length; i++) visit(w.frames[i], depth + 1); } catch (e) {}
    };
    visit(W, 0);
  }
  var LIVE = [];   /* the moves in flight: { a: Animation, g: ghost to drop } */
  function finishAll() {
    LIVE.slice().forEach(function (m) { try { if (m.a) m.a.finish(); } catch (e) {} if (m.g) drop(m.g); });
    LIVE.length = 0;
  }
  function drop(g) { try { if (g && g.parentNode) g.parentNode.removeChild(g); } catch (e) {} }

  function shownNow(el) {
    if (!el || !el.isConnected) return false;
    try {
      var w = el.ownerDocument.defaultView;
      if (el.checkVisibility && !el.checkVisibility({ visibilityProperty: true })) return false;
      var r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return false;
      if (r.right < 0 || r.bottom < 0 || r.left > w.innerWidth || r.top > w.innerHeight) return false;
      return w.getComputedStyle(el).visibility !== 'hidden';
    } catch (e) { return false; }
  }
  function moving(el) {   /* a pop-up that brings its own move (a CSS transition or animation) is left to it */
    try { return el.getAnimations().some(function (a) { return a.playState === 'running' && !a.__bpops; }); } catch (e) { return false; }
  }
  function innerOf(el, row) { if (!row.inner) return el; try { return el.querySelector(row.inner) || el; } catch (e) { return el; } }

  /* ---------------------------------------------------------------- IN: the tin grows out of the finger, overshoots, lands */
  function popIn(el, row, S) {
    var w = el.ownerDocument.defaultView, red = reduced(), inner = innerOf(el, row), t0 = epochNow();
    if (row.voice) fitAll(w);   /* clear of the phone before its first frame, so the grow starts where it will stand */
    var anims = [];
    if (red) {
      var f = stepped([{ opacity: 0.33 }, { opacity: 0.66 }], { opacity: 1 }, holds(2));
      anims.push(el.animate(f.kf, { duration: f.ms }));
    } else {
      var r = inner.getBoundingClientRect(), ox = '50%', oy = '50%', tap = S.tap, O = originOf(row, w, S, false);
      if (O && r.width > 0) {   /* __THE_PHONE_IS_THE_DOOR__: it travels out of its origin, grows, overshoots, lands */
        var tv = travel(r, O, baseT(inner)), d0 = holds(3), o0 = '50% 50%';
        var g0 = stepped([{ translate: tv.T(1), scale: String(tv.s0), opacity: 0.55, transformOrigin: o0 }, { translate: tv.T(0.3), scale: String(tv.s0 + (1 - tv.s0) * 0.75), opacity: 0.92, transformOrigin: o0 },
          { translate: tv.T(0), scale: '1.03', opacity: 1, transformOrigin: o0 }], { translate: tv.T(0), scale: '1', opacity: 1, transformOrigin: o0 }, d0);
        /* a big sheet held as one layer while it travels: without it the town's sheet sideways was drawn again at every pose (the
           worst frame 67 ms against 17 ms for the same sheet with the door off, measured on the demo) */
        var wc0 = inner.style.willChange; inner.style.willChange = 'translate, scale, opacity';
        var a0 = inner.animate(g0.kf, { duration: g0.ms }); anims.push(a0);
        a0.addEventListener('finish', function () { inner.style.willChange = wc0; }); a0.addEventListener('cancel', function () { inner.style.willChange = wc0; });
        if (inner !== el) { var b0 = stepped([{ opacity: 0.35 }, { opacity: 0.7 }, { opacity: 1 }], { opacity: 1 }, d0); anims.push(el.animate(b0.kf, { duration: b0.ms })); }
        S.lastFrom = { id: row.id, from: row.from, at: tv.at, box: [Math.round(O.left), Math.round(O.top), Math.round(O.width), Math.round(O.height)], seen: O.seen !== false };
      } else
      if (row.from === 'top') { oy = '0%'; }
      else if (row.how === 'piece') { oy = '0%'; }
      else if (tap && epochNow() - tap.t < 900 && r.width > 0) {
        ox = Math.round(Math.max(0, Math.min(r.width, tap.x - r.left))) + 'px'; oy = Math.round(Math.max(0, Math.min(r.height, tap.y - r.top))) + 'px';
      }
      if (!(O && r.width > 0)) {
      var org = ox + ' ' + oy, d = holds(3);
      var poses = row.how === 'piece'
        ? [{ scale: '1 0.35', opacity: 0.5, transformOrigin: org }, { scale: '1 0.85', opacity: 0.85, transformOrigin: org }, { scale: '1 1.03', opacity: 1, transformOrigin: org }]
        : [{ scale: '0.55', opacity: 0.45, transformOrigin: org }, { scale: '0.9', opacity: 0.9, transformOrigin: org }, { scale: '1.04', opacity: 1, transformOrigin: org }];
      var g = stepped(poses, { scale: '1', opacity: 1, transformOrigin: org }, d);
      anims.push(inner.animate(g.kf, { duration: g.ms }));
      if (inner !== el) { var b = stepped([{ opacity: 0.35 }, { opacity: 0.7 }, { opacity: 1 }], { opacity: 1 }, d); anims.push(el.animate(b.kf, { duration: b.ms })); }
      }
    }
    var ms = 0;
    anims.forEach(function (a) { a.__bpops = true; ms = Math.max(ms, (a.effect && a.effect.getTiming().duration) || 0); var m = { a: a }; LIVE.push(m);
      a.onfinish = function () { var i = LIVE.indexOf(m); if (i >= 0) LIVE.splice(i, 1); }; });
    var LF = S.lastFrom && S.lastFrom.id === row.id ? S.lastFrom : null; S.lastFrom = null;
    LOG.push({ id: row.id, ev: 'in', doc: pageOf(w), t: Math.round(t0), ms: Math.round(ms), holds: red ? 2 : 3, reduced: red, from: row.from || 'finger', at: LF ? LF.at : null, box: LF ? LF.box : null, seen: LF ? LF.seen : null });
  }

  /* ---------------------------------------------------------------- OUT: a copy as it was shrinks away; the real one is gone at once */
  function copyOf(src, doc, cap) {
    var win = src.ownerDocument.defaultView, n = 0;
    var c = src.cloneNode(true);
    var walk = function (a, b) {
      if (!a || !b || a.nodeType !== 1 || b.nodeType !== 1) return;
      if (++n > cap) throw new Error('too big');
      var cs = win.getComputedStyle(a), txt = '';
      for (var i = 0; i < cs.length; i++) { var p = cs[i]; if (p.indexOf('transition') === 0 || p.indexOf('animation') === 0 || p === 'pointer-events' || p === 'translate') continue; txt += p + ':' + cs.getPropertyValue(p) + ';'; }
      b.setAttribute('style', txt + 'transition:none;animation:none;pointer-events:none;');
      ['id', 'name', 'for', 'onclick', 'tabindex', 'role', 'aria-label', 'data-morph'].forEach(function (k) { b.removeAttribute(k); });
      if (a.tagName === 'CANVAS') { try { var cc = doc.createElement('canvas'); cc.width = a.width; cc.height = a.height; cc.getContext('2d').drawImage(a, 0, 0); cc.setAttribute('style', b.getAttribute('style')); b.parentNode.replaceChild(cc, b); } catch (e) {} return; }
      if (a.tagName === 'IFRAME') throw new Error('a frame');
      for (var j = 0; j < a.children.length && j < b.children.length; j++) walk(a.children[j], b.children[j]);
    };
    var host = doc.createElement('div'); host.appendChild(c); walk(src, c);
    c = host.firstChild; host.removeChild(c);
    return c;
  }
  /* the pop-up as it stood: shown again for no frame at all (inside this task, before the glass is painted), read, put back */
  function asItWas(el, rec, S, row) {
    var doc = el.ownerDocument, out = null, back = null;
    try {
      if (!el.isConnected && rec && rec.target && rec.target.isConnected) {
        var nx = rec.nextSibling && rec.nextSibling.parentNode === rec.target ? rec.nextSibling : null;
        rec.target.insertBefore(el, nx); back = function () { if (el.parentNode) el.parentNode.removeChild(el); };
      } else if (el.isConnected) {
        var st = el.getAttribute('style'), disp = S.disp[row.id] || 'block';
        el.style.setProperty('display', disp, 'important'); el.style.setProperty('visibility', 'visible', 'important');
        back = function () { if (st === null) el.removeAttribute('style'); else el.setAttribute('style', st); };
      }
      if (!el.isConnected) return null;
      var r = el.getBoundingClientRect();
      if (r.width >= 2 && r.height >= 2) {
        var inner = innerOf(el, row), path = [];
        for (var n = inner; n && n !== el; n = n.parentElement) path.unshift(Array.prototype.indexOf.call(n.parentElement.children, n));
        var ir = inner.getBoundingClientRect();
        var cp = null;
        try { cp = copyOf(el, doc, 400); } catch (e) {
          /* a pop-up that holds a page (a frame), or one too big to copy: its plate, the ground it stood on, goes instead */
          cp = doc.createElement('div'); var bg = '#16110c';
          try { var f = el.tagName === 'IFRAME' ? el : el.querySelector('iframe'), fb = f && f.contentDocument && f.contentDocument.body; if (fb) { var c0 = f.contentWindow.getComputedStyle(fb).backgroundColor; if (c0 && !/rgba\(0, 0, 0, 0\)|transparent/.test(c0)) bg = c0; } } catch (x) {}
          cp.setAttribute('style', 'background:' + bg + ';' + kitCss('board_plain', 1) + 'background-color:' + bg + '!important;');
          path = [];
        }
        out = { r: { x: r.left, y: r.top, w: r.width, h: r.height }, ir: { x: ir.left - r.left, y: ir.top - r.top, w: ir.width, h: ir.height }, path: path, copy: cp };
      }
    } catch (e) { out = null; }
    finally { try { if (back) back(); } catch (e) {} if (S.mo) S.mo.takeRecords(); }
    return out;
  }
  function popOut(el, row, S, rec) {
    var doc = el.ownerDocument, w = doc.defaultView, red = reduced(), t0 = epochNow();
    var was = asItWas(el, rec, S, row);
    if (!was) { LOG.push({ id: row.id, ev: 'out', doc: pageOf(w), t: Math.round(t0), ms: 0, holds: 0, reduced: red, via: 'no copy' }); return; }
    var g = doc.createElement('div'); g.setAttribute('data-pops-ghost', row.id); g.setAttribute('aria-hidden', 'true');
    g.style.cssText = 'position:fixed;left:' + was.r.x + 'px;top:' + was.r.y + 'px;width:' + was.r.w + 'px;height:' + was.r.h + 'px;margin:0;padding:0;z-index:' + Z_GHOST + ';pointer-events:none;overflow:visible';
    var c = was.copy; c.style.setProperty('position', 'absolute', 'important'); c.style.setProperty('left', '0', 'important'); c.style.setProperty('top', '0', 'important');
    c.style.setProperty('right', 'auto', 'important'); c.style.setProperty('bottom', 'auto', 'important'); c.style.setProperty('margin', '0', 'important');
    c.style.setProperty('width', was.r.w + 'px', 'important'); c.style.setProperty('height', was.r.h + 'px', 'important');
    g.appendChild(c); (doc.body || doc.documentElement).appendChild(g);
    var ci = c; was.path.forEach(function (i) { if (ci && ci.children[i]) ci = ci.children[i]; });
    var d = holds(2), anims = [];
    if (red) { var f = stepped([{ opacity: 0.6 }, { opacity: 0.3 }], { opacity: 0 }, d); anims.push(g.animate(f.kf, { duration: f.ms, fill: 'forwards' })); }
    else {
      var O2 = originOf(row, w, S, true), cr = ci.getBoundingClientRect();
      if (O2 && cr.width > 0) {   /* __THE_PHONE_IS_THE_DOOR__: the copy goes back into where it came from */
        var tv2 = travel(cr, O2, [0, 0]), k2 = stepped([{ translate: tv2.T(0.3), scale: String(0.94), opacity: 0.85, transformOrigin: '50% 50%' }, { translate: tv2.T(0.75), scale: String(tv2.s0 + (1 - tv2.s0) * 0.3), opacity: 0.5, transformOrigin: '50% 50%' }],
          { translate: tv2.T(1), scale: String(tv2.s0), opacity: 0, transformOrigin: '50% 50%' }, d);
        anims.push(ci.animate(k2.kf, { duration: k2.ms, fill: 'forwards' }));
        if (ci !== c) { var b2 = stepped([{ opacity: 0.7 }, { opacity: 0.35 }], { opacity: 0 }, d); anims.push(c.animate(b2.kf, { duration: b2.ms, fill: 'forwards' })); }
        S.lastTo = { id: row.id, at: tv2.at };
      } else {
      var org = (row.how === 'piece' || row.from === 'top') ? '50% 0%' : '50% 50%';
      var poses = row.how === 'piece'
        ? [{ scale: '1 0.8', opacity: 0.7, transformOrigin: org }, { scale: '1 0.35', opacity: 0.35, transformOrigin: org }]
        : [{ scale: '0.94', opacity: 0.8, transformOrigin: org }, { scale: '0.72', opacity: 0.35, transformOrigin: org }];
      var k = stepped(poses, { scale: row.how === 'piece' ? '1 0.1' : '0.5', opacity: 0, transformOrigin: org }, d);
      anims.push(ci.animate(k.kf, { duration: k.ms, fill: 'forwards' }));
      if (ci !== c) { var b = stepped([{ opacity: 0.6 }, { opacity: 0.25 }], { opacity: 0 }, d); anims.push(c.animate(b.kf, { duration: b.ms, fill: 'forwards' })); }
      }
    }
    var ms = 0, m = { g: g };
    anims.forEach(function (a) { a.__bpops = true; ms = Math.max(ms, (a.effect && a.effect.getTiming().duration) || 0); });
    m.a = anims[0]; LIVE.push(m);
    var end = function () { drop(g); var i = LIVE.indexOf(m); if (i >= 0) LIVE.splice(i, 1); };
    anims[0].onfinish = end; setTimeout(end, ms + 400);
    var LT = S.lastTo && S.lastTo.id === row.id ? S.lastTo : null; S.lastTo = null;
    LOG.push({ id: row.id, ev: 'out', doc: pageOf(w), t: Math.round(t0), ms: Math.round(ms), holds: 2, reduced: red, via: el.isConnected ? 'hidden' : 'removed', from: row.from || 'finger', at: LT ? LT.at : null });
  }

  /* ---------------------------------------------------------------- the watcher, one a page */
  function check(S, recs) {
    if (S.busy) return;
    S.busy = true;
    try {
      var doc = S.doc, removed = [];
      (recs || []).forEach(function (rc) { if (rc.type === 'childList') Array.prototype.forEach.call(rc.removedNodes, function (n) { if (n.nodeType === 1) removed.push({ n: n, rec: rc }); }); });
      S.rows.forEach(function (row) {
        var els = []; try { els = Array.prototype.slice.call(doc.querySelectorAll(row.sel)); } catch (e) {}
        var on = els.filter(shownNow), before = S.on[row.id] || null;
        if (on.length) { try { S.disp[row.id] = S.disp[row.id] || doc.defaultView.getComputedStyle(on[0]).display; } catch (e) {} }
        if (!S.first && !OFF) {
          if (!before && on.length) {
            var t = epochNow();
            if (t - (S.left[row.id] || 0) > REDRAW_MS && !(row.own && moving(on[0])) && !moving(on[0])) on.forEach(function (el) { popIn(el, row, S); });
          } else if (before && !on.length) {
            var rec = null;
            if (!before.isConnected) removed.forEach(function (x) { if (x.n === before || (x.n.contains && x.n.contains(before))) rec = x.rec; });
            /* a page that takes its pop-up out and puts the same one back, in one go, redrew it: nothing left */
            if (!(rec && rec.addedNodes && Array.prototype.some.call(rec.addedNodes, function (a) { return a.nodeType === 1 && (a.matches && a.matches(row.sel)); }))) {
              if (!moving(before)) popOut(before, row, S, rec && before.isConnected ? null : rec);
            }
            S.left[row.id] = epochNow();
          }
        }
        S.on[row.id] = on[0] || null;
      });
      S.first = false;
    } catch (e) { S.err = String(e && e.message || e); }
    S.busy = false;
  }
  var DOCS = [];
  function arm(w) {
    var doc = w.document;
    if (!doc || !doc.documentElement || doc.__bpops === doc) return;
    if (doc.readyState === 'loading' && !doc.body) return;
    var pg = pageOf(w);
    var S = { doc: doc, w: w, page: pg, rows: POPS.filter(function (r) { return r.page.test(pg) || (pg === '' && r.page.test('DEMO')); }), on: {}, left: {}, disp: {}, orig: {}, first: true, tap: null };
    doc.__bpops = doc;
    try { S.mo = new MutationObserver(function (recs) { check(S, recs); }); S.mo.observe(doc.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['style', 'class', 'hidden', 'open'] }); } catch (e) {}
    check(S, null);
    doc.addEventListener('pointerdown', function (e) { S.tap = { t: epochNow(), x: e.clientX, y: e.clientY }; if (LIVE.length) finishAll(); }, true);
    doc.addEventListener('keydown', function () { if (LIVE.length) finishAll(); }, true);
    tipArm(S);
    DOCS = DOCS.filter(function (x) { try { return x.doc.defaultView && x.doc.defaultView.document === x.doc; } catch (e) { return false; } });
    DOCS.push(S);
  }
  function armAll() { eachWin(arm); }

  /* ---------------------------------------------------------------- 2. EVERY VOICE CLEAR OF THE PHONE */
  var FIT = new WeakMap();
  function phoneIn(w) {
    try { var R = w.BOH_PHONE_RECT ? w.BOH_PHONE_RECT() : null; if (R && R.on && R.width > 4) return R; } catch (e) {}
    try {   /* a page that does not load the phone file: the top's rectangle, carried down into this page */
      var T = W.BOH_PHONE_RECT ? W.BOH_PHONE_RECT() : null; if (!T || !T.on || !(T.width > 4)) return null;
      var x = 0, y = 0, v = w;
      while (v && v !== W && v.frameElement) { var fr = v.frameElement.getBoundingClientRect(); x += fr.left + (v.frameElement.clientLeft || 0); y += fr.top + (v.frameElement.clientTop || 0); v = v.parent; }
      return { left: T.left - x, top: T.top - y, right: T.right - x, bottom: T.bottom - y, width: T.width, height: T.height, side: T.side, on: true };
    } catch (e) { return null; }
  }
  /* __THE_PHONE_IS_THE_DOOR__: the phone's spot on the glass, the same on every screen even where the phone is not drawn: where it
     stands now (UI TWO's BOH_PHONE_RECT), else where it last stood on a glass of this shape, else its own corner (bottom right, its
     size on a phone), carried down into the page asking */
  var SPOT = {};
  function topSpot() {
    var key = W.innerWidth > W.innerHeight ? 'wide' : 'tall';
    try { var T = W.BOH_PHONE_RECT ? W.BOH_PHONE_RECT() : null; if (T && T.on && T.width > 4) SPOT[key] = { left: T.left, top: T.top, width: T.width, height: T.height, seen: true }; } catch (e) {}
    if (SPOT[key]) return SPOT[key];
    var VW = W.innerWidth, VH = W.innerHeight, pw = Math.min(124, VW * 0.32), ph = Math.min(VH - 20, pw * 2.2);
    return { left: VW - 10 - pw, top: VH - 10 - ph, width: pw, height: ph, seen: false };
  }
  function phoneSpot(w) {
    var P = phoneIn(w); if (P) { topSpot(); return { left: P.left, top: P.top, width: P.width, height: P.height, seen: true }; }
    var T = topSpot(), x = 0, y = 0, v = w;
    try { while (v && v !== W && v.frameElement) { var fr = v.frameElement.getBoundingClientRect(); x += fr.left + (v.frameElement.clientLeft || 0); y += fr.top + (v.frameElement.clientTop || 0); v = v.parent; } } catch (e) {}
    return { left: T.left - x, top: T.top - y, width: T.width, height: T.height, seen: T.seen };
  }
  /* where a row opens from, in its own page's points: the phone's spot, or its own thing in the world (remembered for its way back) */
  function originOf(row, w, S, out) {
    if (row.from === 'phone') return phoneSpot(w);
    if (row.from === 'world') { var o = null; if (!out) { try { o = row.at ? row.at(w) : null; } catch (e) {} if (o) S.orig[row.id] = o; } return o || S.orig[row.id] || phoneSpot(w); }
    return null;
  }
  function baseT(el) { try { var t = el.ownerDocument.defaultView.getComputedStyle(el).translate; if (!t || t === 'none') return [0, 0]; var a = t.split(' ').map(parseFloat); return [a[0] || 0, a[1] || 0]; } catch (e) { return [0, 0]; } }
  /* the travel: the box laid over the origin at the origin's size, then home (in), or the way back (out) */
  function travel(r, o, base) {
    var cx = r.left + r.width / 2, cy = r.top + r.height / 2, dx = o.left + o.width / 2 - cx, dy = o.top + o.height / 2 - cy;
    var s0 = Math.max(0.06, Math.min(1, Math.min(o.width / Math.max(1, r.width), o.height / Math.max(1, r.height))));
    return { s0: s0, T: function (f) { return (base[0] + dx * f).toFixed(1) + 'px ' + (base[1] + dy * f).toFixed(1) + 'px'; }, at: [Math.round(cx + dx), Math.round(cy + dy)] };
  }
  function fitOne(el, w, id) {
    try { if (el.getAnimations().some(function (a) { return a.__bpops && a.playState === 'running'; })) return; } catch (e) {}   /* mid-grow its scale is in its rectangle */
    var P = phoneIn(w), cur = FIT.get(el) || { dx: 0, dy: 0, mh: null };
    var r = el.getBoundingClientRect(), B = { l: r.left - cur.dx, t: r.top - cur.dy, r: r.right - cur.dx, b: r.bottom - cur.dy };
    var dx = 0, dy = 0, VW = w.innerWidth, VH = w.innerHeight, m = MARGIN, capped = false;
    if (P) {
      var Q = { l: P.left - m, t: P.top - m, r: P.right + m, b: P.bottom + m };
      if (B.l < Q.r && B.r > Q.l && B.t < Q.b && B.b > Q.t) {
        var opts = [], up = Q.t - B.b, dn = Q.b - B.t, lf = Q.l - B.r, rt = Q.r - B.l;
        if (B.t + up >= m) opts.push([0, up]);
        if (B.b + dn <= VH - m) opts.push([0, dn]);
        if (B.l + lf >= m) opts.push([lf, 0]);
        if (B.r + rt <= VW - m) opts.push([rt, 0]);
        if (!opts.length) {   /* too tall for the room over the phone: capped to it (it scrolls), standing at the top */
          var room = Q.t - 2 * m;
          if (room > 120) { if (cur.mh === null) cur.mh = el.style.maxHeight || ''; el.style.maxHeight = Math.floor(room) + 'px'; if (w.getComputedStyle(el).overflowY === 'visible') el.style.overflowY = 'auto'; capped = true;
            opts.push([0, m - B.t]); }
          else opts.push([0, Math.max(m - B.t, up)]);
        }
        opts.sort(function (a, b) { return Math.abs(a[0]) + Math.abs(a[1]) - Math.abs(b[0]) - Math.abs(b[1]); });
        dx = Math.round(opts[0][0]); dy = Math.round(opts[0][1]);
      }
    }
    if (!capped && cur.mh !== null && !(dx || dy)) { el.style.maxHeight = cur.mh; cur.mh = null; }
    if (dx !== cur.dx || dy !== cur.dy) {
      el.style.translate = (dx || dy) ? dx + 'px ' + dy + 'px' : '';
      if (dx || dy) VOICES.push({ id: id, doc: pageOf(w), dx: dx, dy: dy, phone: P ? [Math.round(P.left), Math.round(P.top), Math.round(P.width), Math.round(P.height), P.side] : null, t: Math.round(epochNow()) });
    }
    cur.dx = dx; cur.dy = dy; FIT.set(el, cur);
  }
  function fitAll(only) {
    if (OFF) return;
    DOCS.forEach(function (S) {
      if (only && S.w !== only) return;
      S.rows.forEach(function (row) { if (!row.voice) return;
        try { Array.prototype.forEach.call(S.doc.querySelectorAll(row.sel), function (el) { var box = row.voice === row.sel ? el : (el.matches(row.voice) ? el : el.querySelector(row.voice)); if (box && shownNow(box)) fitOne(box, S.w, row.id); }); } catch (e) {} });
    });
  }

  /* ---------------------------------------------------------------- 3. THE TOOLTIPS */
  var DATA = { tips: null, stats: null, perks: null, traits: null };
  var BASE = (function () { try { var s = D.currentScript && D.currentScript.src; if (s) return s.replace(/[^\/]*$/, ''); } catch (e) {} return ''; })();
  function load(path, then) { try { fetch(BASE + path).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { if (j) then(j); }).catch(function () {}); } catch (e) {} }
  load('../records/target/ui/BOHEMIA_TIPS.json', function (j) { DATA.tips = j; });
  load('../records/target/bb/stat_help.json', function (j) { DATA.stats = j.rows || null; });
  load('../records/target/bb/perk_translation.json', function (j) { var m = {}; (j.rows || []).forEach(function (r) { m[r.id] = r; }); DATA.perks = m; });
  load('../records/target/bb/traits.json', function (j) { var m = {}; (j.traits || []).forEach(function (r) { m[r.id] = r; }); DATA.traits = m; });
  function T(group, key) { try { var g = DATA.tips && DATA.tips[group]; var v = g && g[key]; return v && typeof v === 'object' ? v : (v ? { line: v } : null); } catch (e) { return null; } }
  function up(s) { return String(s || '').toUpperCase(); }
  /* an item, plainly: what it hits for, what it stops, what it weighs (its own numbers) */
  function itemTip(it) {
    if (!it) return null;
    var s = String(it.nums || ''), out = [];
    try { var RC = window.BohemiaRoster || (W && W.BohemiaRoster); if (it.kind === 'weapon' && RC && RC.itemOf) { var lv = RC.itemOf('weapon', it.id); if (lv && lv.nums) s = lv.nums; } } catch (e) {}   /* FIXES 11/9 (row 529): the fight's own numbers */
    var dm = s.match(/dmg\s+(\d+)\s*-\s*(\d+)/), h = s.match(/holds\s+(\d+)/), wt = s.match(/weight\s+(\d+)/), ap = s.match(/AP\s+(\d+)/i);
    if (dm) out.push('Hits for ' + dm[1] + ' to ' + dm[2] + '.');
    if (h) out.push('Stops ' + h[1] + ' damage before he bleeds.');
    if (ap) out.push('A swing costs ' + ap[1] + ' AP.');
    if (wt) out.push('Weighs ' + wt[1] + ': the heavier, the sooner he tires.');
    var k = T('items', it.kind);
    return { head: up(it.name), line: out.length ? out.join(' ') : (k ? k.line : 'Something to carry.'), draft: true };
  }
  function itemById(w, id) {
    try { var C = w.BohemiaRoster || W.BohemiaRoster; if (!C || !C.itemOf) return null;
      var kinds = ['weapon', 'shield', 'body', 'head', 'misc', 'ammo', 'food', 'med', 'tool'];
      for (var i = 0; i < kinds.length; i++) { var it = null; try { it = C.itemOf(kinds[i], id); } catch (e) {} if (it && it.name) return it; } } catch (e) {}
    return null;
  }
  /* what is under the finger, in plain words: the first that answers */
  function resolve(S, target, x, y) {
    var w = S.w, pg = S.page, el = target && target.nodeType === 1 ? target : (target && target.parentElement);
    if (!el || (el.closest && el.closest('#bptip,[data-pops-ghost],[data-app="play"],[data-no-tip]'))) return null;   /* PLAY's own hold is its speed slider */
    var c;
    if ((c = el.closest('[data-tip]'))) return { head: c.getAttribute('data-tip-head') || '', line: c.getAttribute('data-tip'), how: 'data-tip' };
    if ((c = el.closest('[data-stat]'))) { var k = c.getAttribute('data-stat'), line = DATA.stats && DATA.stats[k]; if (line) return { head: up(c.title || k.replace(/_/g, ' ')), line: line, how: 'stat' }; }
    if ((c = el.closest('[data-perk]'))) { var p = DATA.perks && DATA.perks[c.getAttribute('data-perk')]; if (p) return { head: up(p.name), line: p.skin, how: 'perk' }; }
    if ((c = el.closest('[data-trait]'))) { var tr = DATA.traits && DATA.traits[c.getAttribute('data-trait')]; if (tr && (tr.says || tr.line)) return { head: up(tr.name), line: tr.says || tr.line, how: 'trait' }; }
    if ((c = el.closest('[data-skill]'))) { var sk = DATA.perks && DATA.perks[c.getAttribute('data-skill')]; if (sk) return { head: up(sk.name), line: sk.skin, how: 'skill' }; var ts = T('fight', 'skill'); if (ts) return { head: up(c.getAttribute('aria-label') || c.textContent || 'SKILL').slice(0, 30), line: ts.line, how: 'skill' }; }
    if ((c = el.closest('[data-sweep]'))) { var tw = T('fight', 'sweep'); if (tw) return { head: up(c.getAttribute('aria-label') || c.textContent || 'SWEEP').slice(0, 30), line: tw.line, how: 'sweep' }; }
    if ((c = el.closest('[data-id]'))) { var it = itemById(w, c.getAttribute('data-id')); if (it) { var t1 = itemTip(it); t1.how = 'item'; return t1; } }
    if ((c = el.closest('[data-f]'))) { var tb = T('bar', c.getAttribute('data-f')); if (tb) return { head: tb.head || up(c.getAttribute('data-f')), line: tb.line, how: 'bar' }; }
    if ((c = el.closest('[data-app]'))) { var ta = T('phone', c.getAttribute('data-app')); if (ta) return { head: ta.head || up(c.getAttribute('data-app')), line: ta.line, how: 'phone' }; }
    if ((c = el.closest('[data-c]'))) { var tc = T('fight', c.getAttribute('data-c')); if (tc) return { head: tc.head || up(c.getAttribute('data-c')), line: tc.line, how: 'fight button' }; }
    if (/SETTLEMENT/.test(pg) && el.tagName === 'CANVAS') {   /* a building in a town: its door's box, in the town's own picture */
      try { var B = w.BohemiaSettlement; if (B && B._box && B.toScreen) { var keys = B.order(), sc = w.document.getElementById('scene'), so = sc ? sc.getBoundingClientRect() : { left: 0, top: 0 };
        for (var i = 0; i < keys.length; i++) { var b = B._box(keys[i]); if (!b) continue; var a0 = B.toScreen(b[0], b[1]), a1 = B.toScreen(b[2], b[3]);
          if (x >= so.left + a0.x && x <= so.left + a1.x && y >= so.top + a0.y && y <= so.top + a1.y) { var tb2 = T('buildings', keys[i]); if (tb2) return { head: tb2.head || up(keys[i]), line: tb2.line, how: 'building' }; } } } } catch (e) {}
    }
    if (/FIGHT/.test(pg) && el.tagName === 'CANVAS') {   /* the fight's bare ground: a man and a building keep the fight's own hold cards */
      try {
        var F = w.eval('typeof FIGHT !== "undefined" ? FIGHT : null'), g = w.eval('typeof gest !== "undefined" ? gest : undefined');
        if (F && F.S && F.rowAt && typeof w.tileAt === 'function' && g !== undefined && !(typeof w.manAt === 'function' && w.manAt(x, y)) && !(typeof w.buildingSay === 'function' && (function () { var q = w.tileAt(x, y); return w.buildingSay(q.x, q.y); })())) {
          var q2 = w.tileAt(x, y), rw = F.rowAt(q2.x, q2.y), tg = rw && T('ground', rw);
          if (tg) { if (g) g.held = true; return { head: tg.head || up(rw), line: tg.line, how: 'ground' }; }   /* the fight's own word for 'a hold that showed a card is not a tap' */
        }
      } catch (e) {}
    }
    if ((c = el.closest('button,[role="button"],img[alt]'))) {   /* a button whose own label has a line */
      var lab = String(c.getAttribute('aria-label') || c.getAttribute('alt') || c.textContent || '').trim().toLowerCase().replace(/\s+/g, ' ');
      var tl = lab && T('labels', lab); if (tl) return { head: tl.head || up(lab), line: tl.line, how: 'label' };
    }
    return null;
  }
  function kitCss(name, s) { try { return W.BohemiaMaterials && W.BohemiaMaterials.kit ? W.BohemiaMaterials.kit(name, s) : ''; } catch (e) { return ''; } }
  function tipHide(doc) { var e = doc && doc.getElementById('bptip'); if (e) e.remove(); }
  function tipShow(S, tip, x, y) {
    var doc = S.doc, w = S.w;
    DOCS.forEach(function (o) { tipHide(o.doc); });
    var el = doc.createElement('div'); el.id = 'bptip'; el.setAttribute('role', 'tooltip');
    var VW = w.innerWidth, mw = Math.min(280, VW - 32);
    el.setAttribute('style', 'position:fixed;left:0;top:0;z-index:' + Z_TIP + ';max-width:' + mw + 'px;min-width:140px;box-sizing:border-box;padding:8px 9px 9px;pointer-events:none;'
      + 'background:#1f1a14;border:1px solid #4a3a26;' + kitCss('board_plain', 1));
    var h = doc.createElement('div'); h.setAttribute('style', 'font:400 10px BohemiaCasing,ui-monospace,monospace;letter-spacing:1px;line-height:12px;color:#f2e4c6;text-shadow:0 1px 0 #000;margin:0 0 5px');
    h.textContent = up(tip.head || '');
    var l = doc.createElement('div'); l.setAttribute('data-draft', 'true');
    l.setAttribute('style', 'padding:6px 7px 7px;background:#e6dcc4;color:#1f1710;font:400 10px/14px BohemiaROM,ui-monospace,monospace;white-space:normal;' + kitCss('receipt', 1));
    l.textContent = String(tip.line || '');
    if (tip.head) el.appendChild(h); el.appendChild(l);
    (doc.body || doc.documentElement).appendChild(el);
    var r = el.getBoundingClientRect(), VH = w.innerHeight;
    var px = Math.max(16, Math.min(VW - r.width - 16, x - r.width / 2)), py = y - r.height - 28;
    if (py < 16) py = Math.min(VH - r.height - 16, y + 28);
    el.style.left = Math.round(px) + 'px'; el.style.top = Math.round(Math.max(16, py)) + 'px';
    TIPS_LOG.push({ doc: S.page, head: tip.head, line: tip.line, how: tip.how, t: Math.round(epochNow()) });
    W.__TIP = TIPS_LOG[TIPS_LOG.length - 1];
    return el;
  }
  function phonePageOpen() { try { return !!D.querySelector('#bohphone .page.on,#bohphone .crewp.on'); } catch (e) { return false; } }
  function tipArm(S) {
    var doc = S.doc, H = { t: null, x: 0, y: 0, tg: null, held: false, at: 0, page: false };
    var clear = function () { clearTimeout(H.t); H.t = null; };
    doc.addEventListener('pointerdown', function (e) {
      DOCS.forEach(function (o) { tipHide(o.doc); });
      H.held = false; clear();
      if (OFF || e.isPrimary === false || (e.pointerType === 'mouse' && e.button !== 0)) return;
      H.x = e.clientX; H.y = e.clientY; H.tg = e.target; H.page = phonePageOpen();
      H.t = setTimeout(function () {
        H.t = null;
        /* another hold already answered (the kills card, the fight's weapon card or its building line, the phone's own pages) */
        if (doc.getElementById('bkt-card') || (!H.page && phonePageOpen())) return;
        try { if (W.__TALLY_CARD && Date.now() - W.__TALLY_CARD.at < 600) return; } catch (x) {}
        var tip = resolve(S, H.tg, H.x, H.y); if (!tip || !tip.line) return;
        H.held = true; H.at = epochNow();
        tipShow(S, tip, H.x, H.y);
      }, TIP_MS);
    }, true);
    doc.addEventListener('pointermove', function (e) {
      if (H.t && Math.abs(e.clientX - H.x) + Math.abs(e.clientY - H.y) > 10) clear();
      if (e.pointerType === 'mouse' && !e.buttons && !OFF) {   /* a mouse resting on a thing: the Battle Brothers hover */
        clearTimeout(H.hv); if (H.hov && Math.abs(e.clientX - H.hov.x) + Math.abs(e.clientY - H.hov.y) > 12) { tipHide(doc); H.hov = null; }
        var tg = e.target, x = e.clientX, y = e.clientY;
        if (tg && tg.tagName !== 'CANVAS') H.hv = setTimeout(function () { var tip = resolve(S, tg, x, y); if (tip && tip.line) { tipShow(S, tip, x, y); H.hov = { x: x, y: y }; } }, HOVER_MS);
      }
    }, true);
    /* the lift that ends a hold is not also a press: a button's click is kept from it (its lift is left alone: PLAY's slider lets go there); on the town's picture the lift
       becomes the town's own cancel (its window listener resets the finger and opens nothing); the fight's own word ('held')
       already makes its lift no tap */
    var eat = function (e) {
      if (!(H.held && epochNow() - H.at < 1500) || !e.target) return;
      var cv = e.target.tagName === 'CANVAS';
      if (cv && !/SETTLEMENT/.test(S.page)) return;
      if (!cv && e.type !== 'click') return;   /* a button keeps its lift (a slider's let-go lives there); only the click is kept from it */
      e.stopPropagation(); e.preventDefault();
      if (cv && e.type === 'pointerup') { try { S.w.dispatchEvent(new S.w.PointerEvent('pointercancel', { pointerId: e.pointerId, bubbles: true })); } catch (x) {} }
      if (e.type === 'click') H.held = false;
    };
    doc.addEventListener('pointerup', function (e) { clear(); eat(e); }, true);
    doc.addEventListener('pointercancel', clear, true);
    doc.addEventListener('click', eat, true);
    doc.addEventListener('contextmenu', function (e) { if (H.held || H.t) e.preventDefault(); }, true);
  }

  /* ---------------------------------------------------------------- the beat of the watcher */
  function boot() {
    armAll();
    setInterval(function () { armAll(); fitAll(null); }, 250);
    W.addEventListener('resize', function () { setTimeout(function () { fitAll(null); }, 0); });
    W.addEventListener('bohemia-phone', function () { fitAll(null); });
  }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', boot); else boot();

  W.BohemiaPops = {
    version: '11/14 the phone is the door', POPS: POPS, log: LOG, voices: VOICES, tips: TIPS_LOG, phoneSpot: function (w) { return phoneSpot(w || W); },
    docs: function () { return DOCS.map(function (S) { return { page: S.page, rows: S.rows.map(function (r) { return r.id; }), err: S.err || null }; }); },
    off: function (v) { OFF = !!v; try { if (v) localStorage.setItem('bohemia.pops.off', '1'); else localStorage.removeItem('bohemia.pops.off'); } catch (e) {} return OFF; },
    isOff: function () { return OFF; },
    fit: function () { fitAll(null); }, finish: finishAll, busy: function () { return LIVE.length; },
    tip: function (doc, target, x, y) { var S = DOCS.filter(function (o) { return o.doc === doc; })[0]; if (!S) return null; var t = resolve(S, target, x, y); if (t) tipShow(S, t, x, y); return t; },
    data: DATA
  };
})();
