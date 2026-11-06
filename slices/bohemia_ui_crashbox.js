/* ==========================================================================================================
   BOHEMIA -- THE FIRST MINUTE IN THE CRASHBOX HAND  (UI round 3, 11/2/26; asks 280, 261, 262; rule 301)
   PAOLO 11/2: "the UI, the transitions of the UI, the loading screen bullshit, the whole enchilada... always remember
   this economic apocalypse HBO Crashbox vibe bro please." / 10/27: "the startup screen kind of sucks of choosing like
   your own adventure... there's not really a tutorial system." / 11/2: "The tutorial is to toggle at the very
   beginning... don't go gung ho."
   CRASHBOX (rule 115(d)): HBO Family 1999, clay and puppets inside a handmade broken game computer, rusty tin robots.
   Inside the analog horror law: worn, real material, never clean. Inside his JUST THE FONT system (10/18): his letters
   alone, the cold ground, gold only for what is yours and the one next thing, no gradient, glow, blur or round corner,
   words at 10 or 20 css px, one css pixel a pixel. Everything that moves is drawn into a canvas on the beat, so the
   door's own elements never carry a CSS animation.

   ONE FILE, UI's, so the door's logic stays RUN's (BOH_START, the title's act(), the load): this file only dresses,
   reads and times. What it does:
   1. THE FEED (the loading screen; UI 5, 11/3, asks 338 and 340; his NO on the machine 11/2): a camera's own feed fills the
      glass under his letters, made through the master rig (UI 6: ten feeds, a different one each time, tall and wide; VOTE
      tab), twelve keys a bar on the beat, and the camera's readout printed on it in his letters: the load's own count read as
      the camera reads (a battery charging, a signal coming in, the miles to Vegas), never a bar of ours (rule 66a). Its own
      sound from real recordings plays through the title's own player. THE WRONGNESS on the tube is gone with the machine
      (his 11/2 vote: 'Bro wtf is this horseshit'; the sheet to the graveyard).
   2. THE START SCREEN (the picks, RUN's #newco): one screen on an upright phone, in the order a stranger needs: the
      crew's name, WHO YOU WERE as one big tin card at a time (swipe or the arrows; what you land on is yours), then
      the fights, the shelves, the map and the HINTS switch. The picked plate is gold paint on tin; the others rusty
      tin with rivets. The load keeps running under it in a small machine beside the bar.
   3. THE HINTS SWITCH (ask 262): ON (the default) or OFF, kept on the phone (bohemia.hints). ON: the fight's veteran
      teaches his three lessons as COMBAT built them (the shell hands the fight teach:false when OFF), and on the map,
      in a town and at camp the company's veteran says one short line the first time, his face and his mouth on a tin
      plate beside the phone, typed on the beat, held eight beats, back into the phone. OFF: none of it.
   4. NOTHING POPS: the title folds down into the picks over three holds while the machine drops into its place by
      the bar; BEGIN switches the door off like an old set (the picture squeezes to a line, the line to a dot) and the
      valley was behind the glass the whole time. Reduced motion: no travel, the old cut.
   API: window.BohemiaCrashbox = { hintsOn(), setHints(on), doorOut(lift), say(k), data(), log, state() }
   Every number is in slices/crashbox/crashbox.json (the defaults below mirror it until it loads).
   ========================================================================================================== */
(function () {
  'use strict';
  if (window.BohemiaCrashbox) return;
  var D = {
    beat_ms: 500, beats_per_bar: 4, keys_per_bar: 12,
    /* UI 6 (rules 342 and 348): every feed in the game, a different one each time it opens (never the last one), each made
       twice (tall 9:16, wide 16:9) for the whole glass; after cycle_s on the screen the monitor cuts to the next camera */
    feed: { key: 'bohemia.title.feed', last_key: 'bohemia.title.feed.last', cycle_s: 40, preload_s: 8, roll_holds: 2, snow_holds: 1, fade_holds: 4,
      size: { tall: [432, 768], wide: [768, 432] }, mini_w: 40, mini_h: 30,
      words: { rec: 'REC', charging: 'CHARGING', charged: 'CHARGED', no_signal: 'NO SIGNAL', signal_in: 'SIGNAL', vegas: 'BOHEMIA', mi: 'MI' },
      options: {
        a: { frames: 12, tall: 'crashbox/feed_a_tall.webp', wide: 'crashbox/feed_a_wide.webp', sound: 'crashbox/feed_a.mp3', top_left: 'rec', reading: 'battery', corner: 'counter' },
        b: { frames: 6, tall: 'crashbox/feed_b_tall.webp', wide: 'crashbox/feed_b_wide.webp', sound: 'crashbox/feed_b.mp3', top_left: 'cam', cam: 'CAM 03', place: 'PAWN \u00b7 LOT', reading: 'signal', corner: 'clock', tear: true },
        c: { frames: 12, tall: 'crashbox/feed_c_tall.webp', wide: 'crashbox/feed_c_wide.webp', sound: 'crashbox/feed_c.mp3', top_left: 'rec', reading: 'miles', corner: 'counter' },
        d: { frames: 6, tall: 'crashbox/feed_d_tall.webp', wide: 'crashbox/feed_d_wide.webp', sound: 'crashbox/feed_d.mp3', top_left: 'cam', cam: 'CAM 07', place: 'INTAKE \u00b7 LAKE', reading: 'signal', corner: 'clock', tear: true },
        e: { frames: 6, tall: 'crashbox/feed_e_tall.webp', wide: 'crashbox/feed_e_wide.webp', sound: 'crashbox/feed_e.mp3', top_left: 'cam', cam: 'TRAIL 2', place: 'LAB \u00b7 PENS', reading: 'battery', corner: 'clock' },
        f: { frames: 6, tall: 'crashbox/feed_f_tall.webp', wide: 'crashbox/feed_f_wide.webp', sound: 'crashbox/feed_f.mp3', top_left: 'cam', cam: 'CAM 22', place: 'APRON \u00b7 GATE C', reading: 'signal', corner: 'clock', tear: true },
        g: { frames: 12, tall: 'crashbox/feed_g_tall.webp', wide: 'crashbox/feed_g_wide.webp', sound: 'crashbox/feed_g.mp3', top_left: 'rec', reading: 'battery', corner: 'counter' },
        h: { frames: 6, tall: 'crashbox/feed_h_tall.webp', wide: 'crashbox/feed_h_wide.webp', sound: 'crashbox/feed_h.mp3', top_left: 'cam', cam: 'CAM 01', place: 'MARKET', reading: 'signal', corner: 'clock', tear: true },
        i: { frames: 12, tall: 'crashbox/feed_i_tall.webp', wide: 'crashbox/feed_i_wide.webp', sound: 'crashbox/feed_i.mp3', top_left: 'rec', reading: 'battery', corner: 'counter' },
        j: { frames: 6, tall: 'crashbox/feed_j_tall.webp', wide: 'crashbox/feed_j_wide.webp', sound: 'crashbox/feed_j.mp3', top_left: 'cam', cam: 'CAM 12', place: 'FOUNTAIN', reading: 'signal', corner: 'clock', tear: true } } },
    moves: { hold_ms: 125, door_hold_ms: 83, title_out_holds: 3, door_out_holds: 4, say_in_holds: 3, say_out_holds: 3 },
    hints: { key: 'bohemia.hints', said_key: 'bohemia.hints.said', default_on: true, quiet_ms: { map: 8000, town: 3000, camp: 3000 }, hold_beats: 8, type_per_beat: 24,
      lines: { map: 'Tap anywhere on the map and we walk there. The clock runs while we walk.', town: 'Tap a building to go in. LEAVE on the phone takes us back out.', camp: 'We heal quicker at camp. The ring on the phone breaks camp.' },
      toggle: { title: 'HINTS', on: 'ON', on_sub: 'a face tells you, once', off: 'OFF', off_sub: 'no hints' } }
  };
  var LOG = [];
  function merge(a, b) { for (var k in b) { if (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k]) && a[k] && typeof a[k] === 'object') merge(a[k], b[k]); else a[k] = b[k]; } return a; }
  try { fetch('crashbox/crashbox.json').then(function (r) { return r.json(); }).then(function (j) { merge(D, j); D.loaded = true; }).catch(function () {}); } catch (e) {}
  var $ = function (id) { return document.getElementById(id); };
  var now = function () { return performance.now(); };
  var T0 = now();
  function beatF() { return (now() - T0) / D.beat_ms; }
  function keyOf(n) { return Math.floor(beatF() * D.keys_per_bar / D.beats_per_bar) % n; }
  function still() { try { return !!(window.BOHEMIA_SETTINGS && BOHEMIA_SETTINGS.motion && BOHEMIA_SETTINGS.motion()); } catch (e) { return false; } }
  function rng(seed) { var s = seed; return function () { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
  function cv(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function img(src) { var i = new Image(); i.decoding = 'async'; i.src = src; return i; }
  var FONT_OK = false;
  try { document.fonts && document.fonts.load('10px BohemiaROM').then(function () { FONT_OK = true; DIRTY = true; }); } catch (e) {}
  var DIRTY = true;

  /* ---------------- THE MATERIALS: rusty tin, gold paint on tin, a rivet, plywood (baked, never a filter) ---------------- */
  function tin(w, h, gold, seed) {
    var c = cv(w, h), g = c.getContext('2d'), r = rng(seed || 5);
    g.fillStyle = gold ? '#c8ab63' : '#26281f'; g.fillRect(0, 0, w, h);   /* dark enough that his words read in the sun (rule 73) */
    var i, x, y;
    /* the sheet's own unevenness: soft blotches of a step lighter and a step darker, as hammered metal */
    for (i = 0; i < w * h / 90; i++) { x = r() * w | 0; y = r() * h | 0; g.fillStyle = gold ? (r() < .5 ? '#bfa25c' : '#cdb06a') : (r() < .5 ? '#202219' : '#2c2e25'); g.fillRect(x, y, 2 + (r() * 4 | 0), 1 + (r() * 2 | 0)); }
    /* rust where water sat: on gold it is where the paint chipped down to the tin */
    for (i = 0; i < w * h / 700; i++) { x = r() * w | 0; y = r() * h | 0; var n = 3 + (r() * 6 | 0);
      for (var k = 0; k < n; k++) { g.fillStyle = gold ? (r() < .7 ? '#c0a35e' : '#bb9e5a') : (r() < .5 ? '#3a2818' : '#45301a');   /* on gold, chips a step down, never dark: his words in the sun */ g.fillRect(x + (r() * 5 | 0) - 2, y + (r() * 3 | 0) - 1, 1 + (r() * 2 | 0), 1); } }
    /* scratches, the tin bright under them */
    for (i = 0; i < w / 14; i++) { x = r() * w | 0; y = r() * h | 0; var len = 4 + (r() * 10 | 0); g.fillStyle = gold ? '#d8bd78' : '#363930';
      for (k = 0; k < len; k++) g.fillRect(x + k, y + Math.round(k * (r() - .5) * .6), 1, 1); }
    /* grain, one pixel, baked */
    for (i = 0; i < w * h / 12; i++) { g.fillStyle = 'rgba(' + (r() < .5 ? '0,0,0' : '255,240,210') + ',' + (r() * .04).toFixed(3) + ')'; g.fillRect(r() * w | 0, r() * h | 0, 1, 1); }
    return c;
  }
  function tapeTile(w, h, seed) {
    var c = cv(w, h), g = c.getContext('2d'), r = rng(seed || 4);
    g.fillStyle = '#dccfa6'; g.fillRect(0, 0, w, h);
    for (var i = 0; i < w * h / 5; i++) { g.fillStyle = r() < .5 ? '#d3c59a' : '#e3d7b0'; g.fillRect(r() * w | 0, r() * h | 0, 1 + (r() * 3 | 0), 1); }
    for (i = 0; i < w / 6; i++) { g.fillStyle = '#d0c295'; g.fillRect(r() * w | 0, r() * h | 0, 1, 1 + (r() * 4 | 0)); }
    return c;
  }
  function rivet() {
    var c = cv(5, 5), g = c.getContext('2d');
    g.fillStyle = '#0e0a05'; g.fillRect(1, 0, 3, 5); g.fillRect(0, 1, 5, 3);
    g.fillStyle = '#7d7a6c'; g.fillRect(1, 1, 3, 3); g.fillStyle = '#b9b39c'; g.fillRect(1, 1, 2, 1); g.fillRect(1, 2, 1, 1);
    return c;
  }
  function ply(w, h, seed) {
    var c = cv(w, h), g = c.getContext('2d'), r = rng(seed || 9);
    g.fillStyle = '#4a3826'; g.fillRect(0, 0, w, h);
    for (var y = 0; y < h; y++) { if (r() < .55) { g.fillStyle = r() < .5 ? '#433222' : '#54402b'; var x0 = r() * w | 0; g.fillRect(x0, y, 10 + (r() * w * .7 | 0), 1); } }
    for (var i = 0; i < 6; i++) { var kx = r() * w | 0, ky = r() * h | 0; g.fillStyle = '#35271a'; g.fillRect(kx - 2, ky, 5, 2); g.fillRect(kx - 1, ky - 1, 3, 4); }
    for (i = 0; i < w * h / 10; i++) { g.fillStyle = 'rgba(0,0,0,' + (r() * .08).toFixed(3) + ')'; g.fillRect(r() * w | 0, r() * h | 0, 1, 1); }
    return c;
  }
  var VARS = false;
  function vars() {
    if (VARS) return; var f = document.documentElement; VARS = true;   /* on the page's root: the door's picks and the hint beside the phone both wear them */
    var u = function (c) { return 'url(' + c.toDataURL('image/png') + ')'; };
    f.style.setProperty('--cbx-tin', u(tin(128, 64, false, 5)));
    f.style.setProperty('--cbx-gold', u(tin(128, 64, true, 7)));
    f.style.setProperty('--cbx-rivet', u(rivet()));
    f.style.setProperty('--cbx-tape', u(tapeTile(96, 32, 4)));
  }

  /* ---------------- THE FEED (UI 5, 11/3; asks 338 and 340) ----------------
     His vote 11/2: NO on the machine (the box with the tin robot), no words. Rule 66a (Paolo 10/5): 'the loading shown as the
     camera's own feed, never a bar'. So the loading screen IS a camera's feed: a picture made through the master rig (tools/
     bohemia_ui_the_first_minute_feeds.py: the game's own models lit at night, the rig's source pass, its population snap, the
     tape baked into every frame), twelve keys a bar on the beat, and the camera's own readout printed on it in his letters,
     where a camera prints it: what the load has done is the camera's own reading (the battery charging, the signal coming in,
     the miles to Vegas), never a bar of ours. UI 5 made three; UI 6 (rules 342, 348) put every one in the game, on the
     VOTE tab. Each has its own sound, cut from real recordings (tools/bohemia_ui_the_first_minute_sounds.py): the title's own
     player (__THE_TITLE_IS_THE_DESERT__) plays it in place of the bare wind, on his first touch, as it always did. */
  /* UI 6 (rule 342, his second star; rule 348, 11/3): ALL OF THEM, AND MANY. Every feed is in the game and a different one
     opens the game each time, never the one he saw last (D.feed.last_key keeps the last one on the phone); each is made twice,
     TALL (9:16) and WIDE (16:9), its own composition with bleed, so the picture fills the whole glass on any screen, and a
     turn of the phone cross-fades to the other one; if he sits on the screen, after D.feed.cycle_s the monitor cuts to the
     next camera the way a real security monitor cycles (the picture rolls, one picture of snow, the next place). */
  var FEED = { el: null, lastSig: '', t0: now(), cur: null, since: now(), next: null, imgs: {}, orient: null, fade: null, cut: null, snow: null };
  function orient() { return innerWidth / Math.max(1, innerHeight) >= 1 ? 'wide' : 'tall'; }
  function pool() { return Object.keys(D.feed.options).filter(function (k) { return D.feed.options[k] && D.feed.options[k].on !== false; }); }
  function choose(not) { var p = pool().filter(function (k) { return k !== not; }); if (!p.length) p = pool(); return p[Math.floor(Math.random() * p.length)]; }
  function remember(k) { try { localStorage.setItem(D.feed.last_key, k); } catch (e) {} }
  function feedKey() {
    var k = null; try { k = localStorage.getItem(D.feed.key); } catch (e) {}   /* a probe's switch for the proof shots; the game never sets it */
    if (k && D.feed.options[k]) return k;
    if (!FEED.cur) { var last = null; try { last = localStorage.getItem(D.feed.last_key); } catch (e) {}
      FEED.cur = choose(last); FEED.since = now(); remember(FEED.cur); LOG.push({ k: 'feed', pick: FEED.cur, last: last }); }
    return FEED.cur;
  }
  function feedOpt(k) { return D.feed.options[k || feedKey()]; }
  /* a feed's picture for one orientation: asked for the first time it is wanted, never before (the load is not slowed) */
  function sheet(k, o) {
    var op = D.feed.options[k], src = op && (op[o] || op[o === 'tall' ? 'wide' : 'tall']); if (!src) return null;
    var im = FEED.imgs[src]; if (!im) { im = FEED.imgs[src] = img(src); im.onload = function () { FEED.lastSig = ''; }; }
    return im.complete && im.naturalWidth ? im : null;
  }
  function feedImg() { return sheet(feedKey(), orient()); }
  /* the title's own player plays this feed's sound, not the bare wind, from his first touch, as before */
  function feedSound() {
    var T = window.__TITLEWIND, o = feedOpt(); if (!T || !o || !o.sound) return;
    if (T.SRC !== o.sound && !T.buf && !T.loading) { T.SRC = o.sound; LOG.push({ k: 'feed sound', src: o.sound }); }
  }
  /* the cut to the next camera takes the next camera's own sound: the old one fades (the player's own 0.6 s), the new one comes
     up over the player's own 1.5 s on its next tick */
  function soundTo(src) {
    var T = window.__TITLEWIND; if (!T || !src || T.SRC === src) return;
    try { T.stop(); } catch (e) {}
    T.SRC = src; T.buf = null; T.loading = null; LOG.push({ k: 'feed sound', src: src, cut: true });
  }
  /* THE MONITOR CYCLES: the next camera is chosen and its picture asked for preload_s before the cut, so the cut never waits */
  function cycle() {
    var k = null; try { k = localStorage.getItem(D.feed.key); } catch (e) {} if (k) return;   /* a probe holding one feed */
    if (FEED.cut) return;
    var t = (now() - FEED.since) / 1000, cs = D.feed.cycle_s; if (!cs) return;
    if (t > cs - D.feed.preload_s && !FEED.next) FEED.next = choose(FEED.cur);
    if (FEED.next) sheet(FEED.next, orient());
    if (t >= cs && FEED.next && sheet(FEED.next, orient())) { FEED.cut = { t0: now(), from: FEED.cur, to: FEED.next }; LOG.push({ k: 'feed cut', from: FEED.cur, to: FEED.next, at: Math.round(t) }); }
  }
  function cutStep() {
    var c = FEED.cut; if (!c) return null;
    var hold = Math.floor((now() - c.t0) / D.moves.hold_ms), roll = still() ? 0 : D.feed.roll_holds, snow = D.feed.snow_holds;
    if (hold >= roll + snow) {
      FEED.cur = c.to; FEED.next = null; FEED.since = now(); FEED.cut = null; remember(FEED.cur);
      var o = feedOpt(); if (o) soundTo(o.sound); FEED.lastSig = ''; return null;
    }
    return hold < roll ? { roll: (hold + 1) / (roll + 1) } : { snow: hold - roll };
  }
  /* one picture of snow: the switcher between two cameras, no sync, a few hundred dots of the tube's own grey (drawn once) */
  function snowPic(n) {
    if (!FEED.snow) FEED.snow = [];
    if (!FEED.snow[n]) { var c = cv(96, 170), g = c.getContext('2d'), d = g.createImageData(96, 170), r = rng(977 + n * 31);
      for (var i = 0; i < d.data.length; i += 4) { var v = Math.floor(r() * 4) * 52 + 12; d.data[i] = v; d.data[i + 1] = v; d.data[i + 2] = v + 4; d.data[i + 3] = 255; }
      g.putImageData(d, 0, 0); FEED.snow[n] = c; }
    return FEED.snow[n];
  }
  /* the load's own reading: the same stages the bar counts (never a number of ours) */
  function progress() {
    var p = $('loadpct'), t = p ? String(p.textContent || '') : '', m = t.match(/(\d+)\s*OF\s*(\d+)/i);
    var f = m && +m[2] ? Math.min(1, +m[1] / +m[2]) : 0;
    if (window.__LOAD_READY) f = 1;
    return { f: f, n: m ? +m[1] : 0, of: m ? +m[2] : 0, ready: !!window.__LOAD_READY };
  }
  function newestLine() {
    if (window.__LOAD_READY) return 'READY';
    var gl = $('loadgl'), c = gl && gl.lastElementChild; return c ? String(c.textContent || '').trim().toUpperCase() : '';
  }
  /* his letters printed the way a camera prints them: cream, a hard pixel of black round each, never a glow */
  function osdText(g, s, x, y, align, col) {
    g.font = '10px ' + (FONT_OK ? 'BohemiaROM' : 'monospace'); g.textBaseline = 'top'; g.textAlign = align || 'left';
    g.fillStyle = '#050403'; [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(function (d) { g.fillText(s, x + d[0], y + d[1]); });
    g.fillStyle = col || '#efe6d2'; g.fillText(s, x, y); g.textAlign = 'left';
    return g.measureText(s).width;
  }
  function rec(g, x, y, on) {   /* the red dot and REC, the dot lit two beats of four */
    g.fillStyle = '#050403'; g.fillRect(x - 1, y, 9, 9);
    g.fillStyle = on ? '#d8341f' : '#3a1a14'; g.fillRect(x, y + 1, 7, 7); g.fillRect(x + 1, y, 5, 9); g.fillRect(x - 1, y + 2, 9, 5);
    osdText(g, D.feed.words.rec, x + 13, y);
  }
  /* the frame: cover-fit into the box from the sheet's own size (a sheet is its frames one under the next), the middle kept: the
     feeds are composed with their subject inside the middle of the frame, so any edge may be cut on any screen (the bleed) */
  function frameTo(g, im, frames, key, bx, by, bw, bh, tear) {
    var n = frames || 12, fw = im.naturalWidth, fh = im.naturalHeight / n, f = Math.min(n - 1, Math.floor(key * n / D.keys_per_bar));
    var s = Math.max(bw / fw, bh / fh), sw = bw / s, sh = bh / s, sx = (fw - sw) / 2, sy = (fh - sh) / 2;
    g.imageSmoothingEnabled = Math.abs(s - 1) > 0.01; g.drawImage(im, sx, f * fh + sy, sw, sh, bx, by, bw, bh);
    if (tear > 0) {   /* the signal not yet in: a band of the picture slips sideways, and rolls down the glass on the beat */
      var bandH = Math.max(6, Math.round(bh * 0.07)), y0 = Math.round(((beatF() * 0.37) % 1) * (bh - bandH));
      for (var r = 0; r < bandH; r += 2) { var off = Math.round(tear * Math.sin((r / bandH) * Math.PI) * (6 + 4 * Math.sin(beatF() * 3.1))), yy = by + y0 + r;
        g.drawImage(im, sx, f * fh + sy + (y0 + r) / s, sw, 2 / s, bx + off, yy, bw, 2); }
    }
    g.imageSmoothingEnabled = false;
  }
  /* the camera's readout of the load, the option's own: a camcorder's battery charging, a camera's signal coming in, the miles in */
  function reading(g, kind, x, y, P, align) {
    var w = D.feed.words;
    if (kind === 'battery') {   /* four cells, lit as the stages land; full is READY */
      var n = P.ready ? 4 : Math.min(3, Math.floor(P.f * 4)), bx = align === 'right' ? x - 26 : x;
      g.fillStyle = '#050403'; g.fillRect(bx - 1, y - 1, 25, 11); g.fillRect(bx + 24, y + 2, 3, 5);
      g.fillStyle = '#efe6d2'; g.fillRect(bx, y, 23, 9); g.fillRect(bx + 23, y + 3, 2, 3);
      g.fillStyle = '#050403'; g.fillRect(bx + 1, y + 1, 21, 7);
      for (var i = 0; i < 4; i++) { g.fillStyle = i < n ? (P.ready ? '#efe6d2' : '#e2bd6a') : '#2a2620'; g.fillRect(bx + 2 + i * 5, y + 2, 4, 5); }
      if (!P.ready && Math.floor(beatF()) % 2 === 0 && n < 4) { g.fillStyle = '#e2bd6a'; g.fillRect(bx + 2 + n * 5, y + 2, 4, 5); }   /* the cell charging blinks on the beat */
      osdText(g, P.ready ? w.charged : w.charging, align === 'right' ? bx - 6 : bx + 32, y, align === 'right' ? 'right' : 'left');
    } else if (kind === 'signal') {   /* four bars, lit as the stages land */
      var m = P.ready ? 4 : Math.min(3, Math.floor(P.f * 4)), sx = align === 'right' ? x - 22 : x;
      for (var j = 0; j < 4; j++) { var hh = 3 + j * 2; g.fillStyle = '#050403'; g.fillRect(sx + j * 6 - 1, y + 9 - hh - 1, 6, hh + 2);
        g.fillStyle = j < m ? '#efe6d2' : '#2a2620'; g.fillRect(sx + j * 6, y + 9 - hh, 4, hh); }
      osdText(g, P.ready ? w.signal_in : w.no_signal, align === 'right' ? sx - 6 : sx + 30, y, align === 'right' ? 'right' : 'left');
    } else if (kind === 'miles') {   /* the miles left are the stages left: BOHEMIA 6 MI ... 0 MI */
      var left = P.ready ? 0 : Math.max(1, (P.of || 6) - P.n);
      osdText(g, w.vegas + '  ' + left + ' ' + w.mi, x, y, align);
    }
  }
  function counter() { var s = Math.floor((now() - FEED.t0) / 1000); return '0:' + ('0' + Math.floor(s / 60) % 60).slice(-2) + ':' + ('0' + s % 60).slice(-2); }
  function clock() { var d = new Date(); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ':' + ('0' + d.getSeconds()).slice(-2); }
  function paintFeed(force) {
    var c = FEED.el; if (!c || !c.isConnected) return;
    cycle(); var cut = cutStep();
    var k = feedKey(), o = feedOpt(k), ori = orient();
    if (FEED.orient && FEED.orient !== ori) FEED.fade = { from: FEED.orient, t0: now() }; FEED.orient = ori;
    placeWords(TITLE.root, k, ori, !!cut);
    var im = sheet(k, ori), P = progress(), key = still() ? 0 : keyOf(D.keys_per_bar), beat = Math.floor(beatF());
    /* THE PHONE TURNS (rule 348 (a)): the picture made for the new shape comes up through the old one over fade_holds holds on
       the music's grid (rule 324, never a jump); until the new one has arrived the old one stays, cover-fit, whole */
    var fade = 0, old = null;
    if (FEED.fade) { old = sheet(k, FEED.fade.from);
      if (!im) { FEED.fade.t0 = now(); fade = 1; }
      else { var hh = Math.floor((now() - FEED.fade.t0) / D.moves.hold_ms); fade = 1 - (hh + 1) / (D.feed.fade_holds + 1); if (fade <= 0 || still() || !old) { FEED.fade = null; fade = 0; } } }
    if (!im && old) { im = old; fade = 0; }
    var tear = (!P.ready && o.tear && !still()) ? (1 - P.f) : 0;
    var sig = [c.width, c.height, key, beat, P.f, P.ready, FONT_OK, !!im, k, Math.floor((now() - FEED.t0) / 1000), tear > 0 ? Math.floor(beatF() * 6) : 0, fade, cut ? (cut.roll || 's' + cut.snow) : ''].join('|');
    if (!force && sig === FEED.lastSig) return; FEED.lastSig = sig;
    var g = c.getContext('2d'), W = c.width, H = c.height; g.imageSmoothingEnabled = false;
    g.fillStyle = '#050403'; g.fillRect(0, 0, W, H);
    /* THE CUT (rule 348 (e)): the picture loses its sync and rolls up over a black bar, then one picture of the switcher's snow */
    if (cut && cut.snow != null) { g.drawImage(snowPic(cut.snow), 0, 0, W, H); return; }
    var yoff = cut && cut.roll ? Math.round(H * cut.roll) : 0;
    if (im) frameTo(g, im, o.frames, key, 0, -yoff, W, H, yoff ? 0 : tear);
    if (yoff) { if (im) frameTo(g, im, o.frames, key, 0, H - yoff + 10, W, H, 0); g.fillStyle = '#050403'; g.fillRect(0, H - yoff, W, 10); }
    if (fade > 0 && old) { g.globalAlpha = fade; frameTo(g, old, o.frames, key, 0, 0, W, H, 0); g.globalAlpha = 1; }
    /* the camera's own readout, in its corners, small: the camera and the place top left with REC on two beats of four (the
       top right is his NOTES), the clock or the tape counter bottom left, the camera's reading of the load bottom right */
    var pad = 12, top = 12, bot = H - 24, on = still() || beat % 4 < 2;
    if (o.top_left === 'rec') rec(g, pad, top, on);
    else { var w1 = osdText(g, o.cam, pad, top); rec(g, pad + Math.ceil(w1) + 14, top, on); osdText(g, o.place, pad, top + 14); }
    osdText(g, o.corner === 'clock' ? clock() : counter(), pad, bot);
    reading(g, o.reading, W - pad, bot, P, 'right');
  }
  /* RULE 357: the four words sit where this feed's picture keeps a quiet place for them (feed.options[k].words[tall|wide], measured
     on the feed's own frames by tools/bohemia_ui_the_camera_feeds.py --place); set on the title's root, changed only when the
     camera or the shape changes, and hidden through a cut (the switcher's snow carries no menu) */
  function placeWords(root, k, ori, cutting) {
    var o = D.feed.options[k], w = o && o.words && o.words[ori]; if (!root) return;
    var tEl = $('title'), wait = !D.loaded && now() - T0 < 2500;   /* the words wait for their place (never shown in one and moved) */
    if (tEl) tEl.classList.toggle('cbx-cut', !!cutting || wait); if (wait) return;
    var sig = k + '|' + ori + '|' + (w ? JSON.stringify(w) : ''); if (root.__cbxPlace === sig) return; root.__cbxPlace = sig;
    root.classList.toggle('cbxp', !!w); root.classList.toggle('cbxw', ori === 'wide');
    root.classList.toggle('cbx-tdark', !!w && w.tink === 'dark'); root.classList.toggle('cbx-mbone', !!w && w.mink === 'bone'); root.classList.toggle('cbx-mdark', !!w && w.mink === 'dark');
    if (!w) return;
    var st = root.style; st.setProperty('--cbx-ty', (w.t[1] * 100).toFixed(1) + '%'); st.setProperty('--cbx-my', (w.m[1] * 100).toFixed(1) + '%');
    if (ori === 'wide') {
      var col = function (side) { return side === 'right' ? ['54%', '5%'] : ['5%', '54%']; }, a = col(w.t[0] > 0.5 ? 'right' : 'left'), b = col(w.m[0] > 0.5 ? 'right' : 'left');
      st.setProperty('--cbx-tl', a[0]); st.setProperty('--cbx-tr', a[1]); st.setProperty('--cbx-ml', b[0]); st.setProperty('--cbx-mr', b[1]);
    }
    LOG.push({ k: 'words placed', feed: k, ori: ori, t: w.t, m: w.m });
  }
  /* where the feed stands: THE WHOLE GLASS (rule 348: full screen, first person through the camera), his letters and the two
     choices over it */
  function placeFeed(root) {
    var W = Math.round(innerWidth), H = Math.round(innerHeight); if (W < 50 || H < 50) return false;
    var c = FEED.el; c.style.display = '';
    if (c.width !== W || c.height !== H) { c.width = W; c.height = H; FEED.lastSig = ''; }
    c.style.left = '0px'; c.style.top = '0px'; c.style.width = W + 'px'; c.style.height = H + 'px';
    return true;
  }

  /* THE START SCREEN'S FEED: the same camera's small window by the load's row, still rolling; one look from the title to BEGIN
     (the buttons are the camera's own, below) */
  var MINI = { el: null, lastSig: '' };
  function paintSmall(S) {
    var c = S.el; if (!c || !c.isConnected) return;
    var im = feedImg(), o = feedOpt(), P = progress(), key = still() ? 0 : keyOf(D.keys_per_bar), beat = Math.floor(beatF());
    var sig = [c.width, c.height, key, beat, P.ready, !!im, feedKey()].join('|'); if (sig === S.lastSig) return; S.lastSig = sig;
    var g = c.getContext('2d'), W = c.width, H = c.height; g.fillStyle = '#050403'; g.fillRect(0, 0, W, H);
    if (im) frameTo(g, im, o.frames, key, 0, 0, W, H, 0);
    var on = still() || beat % 4 < 2;
    g.fillStyle = '#050403'; g.fillRect(0, 0, W, 1); g.fillRect(0, H - 1, W, 1); g.fillRect(0, 0, 1, H); g.fillRect(W - 1, 0, 1, H);
    g.fillStyle = on ? '#d8341f' : '#3a1a14'; g.fillRect(4, 4, 5, 5);
  }
  function ensureMini() {
    var row = $('loadrow'); if (!row) return;
    if (MINI.el && MINI.el.parentNode === row) return;
    var c = MINI.el || cv(D.feed.mini_w, D.feed.mini_h); c.id = 'cbxmini'; c.setAttribute('aria-hidden', 'true');
    MINI.el = c; row.insertBefore(c, row.firstChild); MINI.lastSig = '';
  }
  function paintMini() { paintSmall(MINI); }

  /* ---------------- THE TITLE: find UI's look, put the feed under it ---------------- */
  var TITLE = { root: null, watched: null, leaving: false };
  function title() { var r = document.querySelector('#title .bm-start'); return r || null; }
  function ensureMachine() {
    var root = title(); if (!root) return null;
    if (!FEED.el) { FEED.el = cv(10, 10); FEED.el.id = 'cbxfeed'; FEED.el.setAttribute('aria-hidden', 'true'); }
    /* the feed is the title's own ground: right after the ground canvas, so his letters and the choices stand over it */
    if (FEED.el.parentNode !== root && !TITLE.leaving) { var gr = root.querySelector('canvas.gr'); root.insertBefore(FEED.el, gr ? gr.nextSibling : root.firstChild); FEED.lastSig = ''; }
    TITLE.root = root;
    var tEl = $('title'); if (tEl && TITLE.watched !== tEl) { TITLE.watched = tEl; watchTitle(tEl); }
    return root;
  }
  /* THE TITLE FOLDS DOWN INTO THE PICKS (asks 279, 280): RUN's hide() adds .gone, which is display:none -- a pop. The
     class change is seen before the frame is drawn, the title is held on the glass with no hand on it, and it goes down
     in three holds while the machine drops into its small self by the bar; then the class does what RUN wrote. */
  function watchTitle(tEl) {
    var was = !tEl.classList.contains('gone');
    try { new MutationObserver(function () {
      var gone = tEl.classList.contains('gone');
      if (gone && was) titleOut(tEl);
      was = !gone;
    }).observe(tEl, { attributes: true, attributeFilter: ['class'] }); } catch (e) {}
  }
  function titleOut(tEl) {
    var f = $('front'); if (!f || f.style.display === 'none' || still() || TITLE.leaving) return;
    var root = title(); if (!root) return;
    TITLE.leaving = true; tEl.classList.add('cbx-leaving');
    var H = D.moves.title_out_holds, ms = D.moves.hold_ms, t0 = now(), m = root.querySelector('.m'), tt = root.querySelector('.t');
    var from = FEED.el && FEED.el.style.display !== 'none' && FEED.el.parentNode === root ? FEED.el.getBoundingClientRect() : null;
    ensureMini(); var to = MINI.el ? MINI.el.getBoundingClientRect() : null;
    var travel = !!(from && to && to.width);
    /* his letters on the title slide onto his letters on the picks, so the name never crosses itself */
    var lift = 40; try { var tm = tt && tt.querySelector('canvas'), dm = null;
      Array.prototype.forEach.call(f.querySelectorAll('.jtf-mark,#logobig,#loadtag'), function (el) { if (!dm && !tEl.contains(el) && el.getClientRects().length && el.getBoundingClientRect().height > 8) dm = el; });
      if (tm && dm) lift = Math.round(tm.getBoundingClientRect().top - dm.getBoundingClientRect().top); } catch (e) {}
    if (travel) { f.appendChild(FEED.el); FEED.el.style.zIndex = '45'; }
    var row = { id: 'title-to-picks', kind: 'screen', how: 'fold down + the feed shrinks into its small window by the bar', t0: Math.round(t0), holds: H, planned: H * ms, frames: [] };
    LOG.push(row);
    var step = function (i) {
      row.frames.push(Math.round(now() - t0));
      if (i >= H) {
        tEl.classList.remove('cbx-leaving'); root.style.transform = ''; root.style.opacity = '';
        if (m) m.style.transform = ''; if (tt) tt.style.transform = '';
        if (travel) { FEED.el.style.zIndex = ''; var gr2 = root.querySelector('canvas.gr'); root.insertBefore(FEED.el, gr2 ? gr2.nextSibling : root.firstChild); FEED.lastSig = ''; }
        TITLE.leaving = false; row.t1 = Math.round(now()); return;
      }
      var k = (i + 1) / H;
      /* the three choices go down off the glass first, the letters lift away, the ground thins to the picks under it */
      if (m) m.style.transform = 'translateY(' + Math.round(k * 60) + '%)';
      if (tt) tt.style.transform = 'translateY(' + Math.round(-k * lift) + 'px)';
      root.style.opacity = String(Math.round((1 - k * .9) * 100) / 100);
      if (travel) { var L = function (a, b) { return Math.round(a + (b - a) * k); };
        if (i === H - 1) FEED.el.style.display = 'none';
        else { FEED.el.style.left = L(from.left, to.left) + 'px'; FEED.el.style.top = L(from.top, to.top) + 'px'; FEED.el.style.width = L(from.width, to.width) + 'px'; FEED.el.style.height = L(from.height, to.height) + 'px'; } }
      setTimeout(function () { step(i + 1); }, ms);
    };
    step(0);
  }

  /* ---------------- THE DOOR SWITCHES OFF LIKE AN OLD SET (BEGIN) ----------------
     Called by the door's own BEGIN (one line in the alpha: the lift is handed here). The picture squeezes to a line,
     the line to a dot, and the valley was behind the glass the whole time (#app is built under the door since the
     load began). Four holds, one beat. Returns false when it will not (reduced motion, no door): the caller lifts. */
  function doorOut(lift) {
    var f = $('front'); if (!f || typeof lift !== 'function' || still() || f.style.display === 'none') return false;
    if (doorOut.busy) return true;
    doorOut.busy = true;
    var H = D.moves.door_out_holds, ms = D.moves.door_hold_ms || D.moves.hold_ms, t0 = now();   /* six holds a beat: it is over well inside the quiet second the next screen opens with */
    var poses = ['scale(1,0.5)', 'scale(1,0.008)', 'scale(0.3,0.008)', 'scale(0.012,0.008)'];
    var row = { id: 'door-off', kind: 'screen', how: 'an old set switching off', t0: Math.round(t0), holds: H, planned: H * ms, frames: [] };
    LOG.push(row);
    f.classList.add('cbx-off');
    var done = false, timer = 0;
    /* a finger that is already on the next screen (the barber's GO) does not wait for the set: it is off at once */
    var hurry = function () { if (!done) { row.hurried = Math.round(now() - t0); finish(); } };
    var finish = function () {
      if (done) return; done = true; clearTimeout(timer);
      window.removeEventListener('pointerdown', hurry, true); window.removeEventListener('touchstart', hurry, true);
      f.style.transform = ''; f.classList.remove('cbx-off', 'cbx-line'); doorOut.busy = false; row.t1 = Math.round(now());
      try { lift(); } catch (e) { LOG.push({ k: 'lift threw', e: String(e) }); }
    };
    window.addEventListener('pointerdown', hurry, true); window.addEventListener('touchstart', hurry, true);
    /* ON ITS OWN CLOCK: a stall skips a pose rather than stretching the beat, so the set is always off inside the quiet second the
       next screen opens with (the barber's and the tape's 'nothing happens in the first second') */
    var step = function () {
      if (done) return;
      var el = now() - t0, i = Math.floor(el / ms);
      row.frames.push(Math.round(el));
      if (i >= H) return finish();
      f.style.transform = poses[Math.min(i, poses.length - 1)];
      if (i >= 1) f.classList.add('cbx-line');
      timer = setTimeout(step, Math.max(8, (i + 1) * ms - el));
    };
    step();
    return true;
  }

  /* ---------------- THE START SCREEN: RUN's picks, in the order a stranger needs, on tin ---------------- */
  var ORDER = [['YOUR CREW', 'name'], ['WHO YOU WERE', 'origin'], ['THE FIGHTS', 'fights'], ['THE SHELVES', 'shelves'], ['THE MAP', 'map'], ['HINTS', 'hints']];
  var DRESSING = false;
  function hintsOn() { try { var v = localStorage.getItem(D.hints.key); if (v === 'off') return false; if (v === 'on') return true; } catch (e) {} return D.hints.default_on !== false; }
  function setHints(on) { try { localStorage.setItem(D.hints.key, on ? 'on' : 'off'); } catch (e) {} LOG.push({ k: 'hints', on: !!on }); paintHints(); }
  function paintHints() {
    var box = $('cbxhints'); if (!box) return; var on = hintsOn();
    box.querySelectorAll('button').forEach(function (b) { b.classList.toggle('on', (b.getAttribute('data-h') === '1') === on); b.setAttribute('aria-pressed', String((b.getAttribute('data-h') === '1') === on)); });
    var h = $('cbxhintsh'), pk = box.querySelector('button.on small'); if (h && pk) { var cap = h.querySelector('.cbxcap'); if (!cap) { cap = document.createElement('span'); cap.className = 'cbxcap'; h.appendChild(cap); } cap.textContent = pk.textContent; }
  }
  function hintsBlock() {
    var T = D.hints.toggle, h = document.createElement('h4'); h.id = 'cbxhintsh'; h.textContent = T.title;
    var row = document.createElement('div'); row.className = 'row'; row.id = 'cbxhints';
    row.innerHTML = '<button type="button" data-h="1">' + T.on + '<small>' + T.on_sub + '</small></button><button type="button" data-h="0">' + T.off + '<small>' + T.off_sub + '</small></button>';
    row.querySelectorAll('button').forEach(function (b) {
      var stop = function (e) { e.stopPropagation(); };
      b.addEventListener('pointerdown', stop); b.addEventListener('mousedown', stop); b.addEventListener('touchstart', stop, { passive: true });
      b.addEventListener('click', function (e) { e.stopPropagation(); e.preventDefault(); setHints(b.getAttribute('data-h') === '1'); }); });
    return [h, row];
  }
  function originNav(h4) {
    if (h4.querySelector('.cbxnav')) return;
    var nav = document.createElement('span'); nav.className = 'cbxnav';
    nav.innerHTML = '<button type="button" class="cbxprev" aria-label="the origin before">&#9664;</button><em class="cbxof"></em><button type="button" class="cbxnext" aria-label="the next origin">&#9654;</button>';
    nav.querySelectorAll('button').forEach(function (b) {
      var stop = function (e) { e.stopPropagation(); };
      b.addEventListener('pointerdown', stop); b.addEventListener('mousedown', stop); b.addEventListener('touchstart', stop, { passive: true });
      b.addEventListener('click', function (e) { e.stopPropagation(); e.preventDefault(); stepOrigin(b.classList.contains('cbxnext') ? 1 : -1); }); });
    h4.appendChild(nav);
  }
  function cards() { var st = $('newcostrip'); return st ? Array.prototype.slice.call(st.querySelectorAll('.org')) : []; }
  function stepOrigin(d) {
    var cs = cards(); if (!cs.length) return; var i = 0; cs.forEach(function (c, j) { if (c.classList.contains('on')) i = j; });
    var n = (i + d + cs.length) % cs.length; cs[n].click();   /* RUN's own pick: its onTap picks, saves and rebuilds */
    LOG.push({ k: 'origin', by: 'arrow', to: cs[n].getAttribute('data-v') });
  }
  function markOut() {
    var st = $('newcostrip'); if (!st) return; var L = st.scrollLeft, R = L + st.clientWidth;
    cards().forEach(function (c) { var a = c.offsetLeft - st.offsetLeft, b = a + c.offsetWidth; c.classList.toggle('cbx-out', b <= L + 1 || a >= R - 1); });
  }
  function snapToPicked(smooth) {
    var st = $('newcostrip'), on = st && st.querySelector('.org.on'); if (!on) return;
    var x = on.offsetLeft - st.offsetLeft - (st.clientWidth - on.offsetWidth) / 2;
    if (smooth && !still() && st.scrollTo) st.scrollTo({ left: x, behavior: 'smooth' }); else st.scrollLeft = x;
    markOut();
  }
  /* WHAT YOU LAND ON IS YOURS: a swipe that comes to rest on an origin picks it (RUN's pick, the card's own click) */
  var SWIPE = { t: 0, st: null };
  /* __SCROLLING_IS_ILLEGAL__ (UI 8 11/6, rule 402): the origins are one card a page, never a strip he scrolls. The strip is locked
     (overflow hidden in the look below), and a swipe across it, a wheel notch or an arrow turns ONE card, the way the arrows
     always did. A card off the glass is hidden whole, so nothing he can press waits beyond the edge. */
  var TURN = { x: null, y: 0, t: 0, eat: 0, wheel: 0, wt: 0 };
  function turnWire() {
    if (TURN.on) return; TURN.on = true;
    var inStrip = function (e) { return e.target && e.target.closest && e.target.closest('#newcostrip'); };
    document.addEventListener('pointerdown', function (e) { if (!inStrip(e) || e.pointerType === 'mouse') return; TURN.x = e.clientX; TURN.y = e.clientY; TURN.t = Date.now(); }, true);
    document.addEventListener('pointerup', function (e) {
      if (TURN.x === null) return; var dx = e.clientX - TURN.x, dy = e.clientY - TURN.y; TURN.x = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.4 && Date.now() - TURN.t < 900) { TURN.eat = Date.now() + 450; stepOrigin(dx < 0 ? 1 : -1); LOG.push({ k: 'origin', by: 'swipe' }); }
    }, true);
    document.addEventListener('click', function (e) { if (Date.now() < TURN.eat && inStrip(e)) { e.stopPropagation(); e.preventDefault(); } }, true);
    window.addEventListener('wheel', function (e) {
      if (!inStrip(e)) return; e.preventDefault(); e.stopImmediatePropagation();
      var d = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX; if (!d) return;
      if (Date.now() - TURN.wt > 400) TURN.wheel = 0; TURN.wheel += d;
      if (Math.abs(TURN.wheel) >= 40 && Date.now() - TURN.wt > 260) { TURN.wt = Date.now(); stepOrigin(TURN.wheel > 0 ? 1 : -1); TURN.wheel = 0; LOG.push({ k: 'origin', by: 'wheel' }); }
    }, { capture: true, passive: false });
  }
  function watchStrip() {
    turnWire();
    var st = $('newcostrip'); if (!st || SWIPE.st === st) return; SWIPE.st = st;
    st.addEventListener('scroll', function () {
      markOut();
      if (DRESSING) return; clearTimeout(SWIPE.t);
      SWIPE.t = setTimeout(function () {
        var s = $('newcostrip'); if (!s) return; var mid = s.scrollLeft + s.clientWidth / 2, best = null, bd = 1e9;
        cards().forEach(function (c) { var cm = c.offsetLeft - s.offsetLeft + c.offsetWidth / 2, d = Math.abs(cm - mid); if (d < bd) { bd = d; best = c; } });
        if (best && !best.classList.contains('on')) { LOG.push({ k: 'origin', by: 'swipe', to: best.getAttribute('data-v') }); best.click(); }
      }, 160);
    }, { passive: true });
  }
  function dressPicks() {
    var nc = $('newco'); if (!nc || DRESSING) return;
    DRESSING = true;
    try {
      vars();
      var f = $('front'); if (f && !f.classList.contains('cbx')) f.classList.add('cbx');
      nc.classList.add('cbx');
      if (!$('cbxhints')) hintsBlock().forEach(function (el) { nc.appendChild(el); });
      paintHints();
      /* the order, by each section's own heading (RUN's words), so a section RUN adds lands after these, never inside */
      var kids = Array.prototype.slice.call(nc.children), sec = 0;
      kids.forEach(function (el) {
        if (el.tagName === 'H4') { var tx = String(el.textContent || '').toUpperCase(); sec = 90;
          ORDER.forEach(function (o, i) { if (tx.indexOf(o[0]) === 0) sec = (i + 1) * 10; });
          if (sec === 20) { originNav(el); el.classList.add('cbxorigin');
            /* rule 402: nothing scrolls, so the heading never says SCROLL (a computer's words; the arrows turn it) */
            var t0 = el.firstChild; if (t0 && t0.nodeType === 3 && /SCROLL/.test(t0.nodeValue)) t0.nodeValue = t0.nodeValue.replace('SCROLL', 'ARROWS'); } }   /* draft:true */
        el.setAttribute('data-sec', String(sec)); el.__cbxKey = sec * 100 + kids.indexOf(el);
      });
      /* the nodes themselves in that order (a stable sort; moved only when they are not already so, so the watcher never loops) */
      var want = kids.slice().sort(function (a, b) { return a.__cbxKey - b.__cbxKey; });
      if (want.some(function (el, i) { return el !== kids[i]; })) { var sl = $('newcostrip') ? $('newcostrip').scrollLeft : 0; want.forEach(function (el) { nc.appendChild(el); }); if ($('newcostrip')) $('newcostrip').scrollLeft = sl; }
      kids = want;
      /* each row's picked plate says what it does in the row's heading (its own small line, RUN's words) */
      kids.forEach(function (el, i) { if (el.tagName !== 'H4') return; var nx = el.nextElementSibling; if (!nx || !nx.classList.contains('row')) return;
        var pk = nx.querySelector('button.on small'), cap = el.querySelector('.cbxcap');
        if (!pk) { if (cap) cap.parentNode.removeChild(cap); return; }
        if (!cap) { cap = document.createElement('span'); cap.className = 'cbxcap'; el.appendChild(cap); }
        cap.textContent = String(pk.textContent || '').trim(); });
      var cs = cards(), on = 0; cs.forEach(function (c, j) { if (c.classList.contains('on')) on = j; });
      var of = nc.querySelector('.cbxof'); if (of) of.textContent = (on + 1) + ' OF ' + cs.length;
      watchStrip(); snapToPicked(false);
      ensureMini();
    } catch (e) { LOG.push({ k: 'dress threw', e: String(e) }); }
    DRESSING = false;
  }
  var PICKS_WATCHED = null;
  function watchPicks() {
    var nc = $('newco'); if (!nc || PICKS_WATCHED === nc) return; PICKS_WATCHED = nc;
    style();
    try { new MutationObserver(function () { if (!DRESSING) dressPicks(); }).observe(nc, { childList: true }); } catch (e) {}
    dressPicks();
  }

  /* ---------------- THE SHEET (one, by id, scoped to the door that asks for his bare look) ---------------- */
  var JD = 'html body #front[data-look="just-the-font"].cbx';
  var CSS = [
    /* the machine on the title, and while it drops into the bar */
    '#cbxfeed{position:absolute;display:block;image-rendering:pixelated;image-rendering:crisp-edges;pointer-events:none}',
    /* his line under the letters and the authority's line over the picks stand on their own ground, never on the picture (J5) */
    /* RULE 357 (Paolo 11/3: 'I don't want an effect behind them, a shadow box, a contrast box... wherever you place all the text
       it feels like it was meant to be placed there by what's going on in the background'; amended: 'still obviously a menu overlay'):
       the four words are a clean overlay in the game's type with NOTHING behind them (no box, no plate, no shadow, no outline, no
       glow); each feed says WHERE they sit (its quiet place, measured on its own frames: feed.options[k].words), the one next thing
       in his gold, the rest in the bone of his letters. Nothing of the title's fallback shows (its stamp, its loading line). */
    'html body #title .stamp,html body #title .bm-start .stamp{display:none!important}',
    'html body #title .bm-start .t>div,html body #title .bm-start .sub{background:none!important;padding:0!important;border:0!important;box-shadow:none!important;text-shadow:none!important}',
    'html body #title .bm-start.jtf .b,html body #title .bm-start.jtf .b.card,html body #title .bm-start.jtf .b.rec,html body #title .bm-start.jtf .b.armed{background:none!important;box-shadow:none!important;outline:0!important;border:0!important;filter:none!important;text-shadow:none!important}',
    'html body #title .bm-start.jtf .b::before,html body #title .bm-start.jtf .b::after{display:none!important}',
    'html body #title .bm-start.jtf .sub{color:#efe6d2!important}',
    'html body #title .bm-start.jtf .b b{color:#efe6d2!important;font-size:13.333px!important;letter-spacing:3px!important}',
    'html body #title .bm-start.jtf:not(.saved) .b.card b,html body #title .bm-start.jtf.saved .b.rec b,html body #title .bm-start.jtf .b.armed b{color:#e2bd6a!important;font-size:20px!important;letter-spacing:4px!important}',
    'html body #title .bm-start.jtf .b.armed i{color:#e2bd6a!important}',
    'html body #title .bm-start.jtf .b.rec:disabled b{color:#efe6d2!important;opacity:.42}',
    'html body #title .bm-start.jtf .b{min-height:48px;padding:0 4px}',
    /* the place, per feed (the root's variables, set by the feed); tall: the title block and the choices centred, each at its own
       height; wide: each in its own column at its own height */
    'html body #title .bm-start.jtf.cbxp .t{top:var(--cbx-ty)!important;bottom:auto!important;transform:none!important}',
    'html body #title .bm-start.jtf.cbxp .m{top:var(--cbx-my)!important;bottom:auto!important;transform:none!important;gap:2px!important}',
    'html body #title .bm-start.jtf.cbxp:not(.cbxw) .t{left:20px!important;right:20px!important;align-items:center!important}',
    'html body #title .bm-start.jtf.cbxp:not(.cbxw) .m{left:50%!important;right:auto!important;width:auto!important;transform:translateX(-50%)!important;align-items:center}',
    'html body #title .bm-start.jtf.cbxp:not(.cbxw) .m .b{justify-content:center}',
    'html body #title .bm-start.jtf.cbxp.cbxw .t{left:var(--cbx-tl)!important;right:var(--cbx-tr)!important;align-items:flex-start!important}',
    'html body #title .bm-start.jtf.cbxp.cbxw .m{left:var(--cbx-ml)!important;right:var(--cbx-mr)!important;width:auto!important}',
    'html body #title.cbx-cut .bm-start .t,html body #title.cbx-cut .bm-start .m{visibility:hidden!important}',
    /* the inks, per feed (rule 357 (b): colour chosen per feed): where the picture is light the words take the dark; where gold
       would not read the one next thing is the bone at its own size (NEW GAME 20 points, the other 13) */
    'html body #title .bm-start.jtf.cbx-tdark .sub{color:#17120b!important}',
    'html body #title .bm-start.jtf.cbx-mbone .b b,html body #title .bm-start.jtf.cbx-mbone:not(.saved) .b.card b,html body #title .bm-start.jtf.cbx-mbone.saved .b.rec b{color:#efe6d2!important}',
    'html body #title .bm-start.jtf.cbx-mdark .b b,html body #title .bm-start.jtf.cbx-mdark:not(.saved) .b.card b,html body #title .bm-start.jtf.cbx-mdark.saved .b.rec b,html body #title .bm-start.jtf.cbx-mdark .b.rec:disabled b{color:#17120b!important}',
    /* RULE 357 (a): THE NOTES BUTTON IS GONE, from the title and from every bar the game draws (the phone has no NOTES app) */
    'html body #title .notes,html body #notebtn{display:none!important}',
    JD + ' #loadtag i{background:#0b0a09;padding:3px 6px}',
    'html body #title.gone.cbx-leaving{display:block!important;pointer-events:none!important;background:transparent!important}',
    'html body #title.cbx-leaving>*:not(.bm-start){visibility:hidden!important}',
    'html body #title.cbx-leaving *{pointer-events:none!important}',
    /* the old set switching off: the last of the light is a line, then a dot */
    /* above whatever the game raised the instant BEGIN was pressed (the barber's mirror sits at the top of the page), so the
       set switches off OVER the next screen and the next screen is what is left when the dot goes */
    'html body #front.cbx-off{pointer-events:none!important;transform-origin:50% 50%;z-index:2147483600!important}',
    'html body #front.cbx-off.cbx-line{background:#e7dcc6!important}',
    'html body #front.cbx-off.cbx-line>*{visibility:hidden!important}',
    /* THE PICKS, one column in the order a stranger needs */
    JD + ' #newco{display:flex;flex-direction:column}',
    JD + ' #newco>*{flex-shrink:0}',   /* sideways the column scrolls: nothing in it is squeezed to nothing (the origins' card was) */
    JD + ' #newco h4{margin:5px 0 3px;line-height:10px}',   /* UI 5: tighter, so RUN's newer rows (the valley's code) and BEGIN fit one upright glass */
    JD + ' #newco h4:first-child{margin-top:0}',
    JD + ' #newco .row{padding:0;align-items:stretch;gap:6px}',
    /* what the picked plate does, said once, in its heading (Battle Brothers shows the picked difficulty's line) */
    JD + ' #newco h4 .cbxcap{margin-left:8px;font-family:"BohemiaROM",monospace;font-size:10px;letter-spacing:0;color:#e7dcc6;text-transform:none}',
    /* UI 5 (ask 340, his 'not final' and 'I don't like what you did to the menu'): the picks are THE CAMERA'S OWN BUTTONS, one
       look with the feed above them: hard black plastic lit from above (a pixel of light on the top edge, a pixel of shadow on the
       bottom, the 3-D the 9/20 votes asked for, built with light and form), his words cream on it; the picked one is lit gold
       (gold only for what is yours). No tin, no rivets, no tape, no gradient, no round corner. */
    JD + ' #newco .row button{border:1px solid #050505;background:#1d1e20;color:#e7dcc6;box-shadow:inset 0 1px 0 #4a4c51,inset 0 -2px 0 #0b0b0c;'
      + 'padding:6px 8px;font-size:10px;letter-spacing:1px;line-height:10px;text-align:center;min-height:44px}',
    JD + ' #newco .row button small{display:none}',
    JD + ' #newco .row button.on{background:#e2bd6a;color:#140e05;border-color:#e2bd6a;box-shadow:inset 0 1px 0 #f6dc9a,inset 0 -1px 0 #cba650}',   /* lit edge to edge: no dark pixel under his words, in the sun too (J5) */
    JD + ' #newco .row button.on small{display:none}',
    JD + ' #newco .row button:active,' + JD + ' #newco .cbxnav button:active{box-shadow:inset 0 2px 0 #050505,inset 0 -1px 0 #4a4c51;transform:translateY(1px)}',
    /* WHO YOU WERE: one big card at a time, the arrows and the count in its heading */
    JD + ' #newco h4.cbxorigin{color:#e7dcc6;display:flex;align-items:center;justify-content:space-between;min-height:44px;margin-top:6px;margin-bottom:4px}',
    JD + ' #newco .cbxnav{display:flex;align-items:center;gap:6px}',
    JD + ' #newco .cbxnav button{width:44px;height:44px;padding:0;border:1px solid #050505;background:#1d1e20;color:#e7dcc6;font-family:"BohemiaCasing",monospace;font-size:10px;line-height:10px;box-shadow:inset 0 1px 0 #4a4c51,inset 0 -2px 0 #0b0b0c}',
    JD + ' #newco .cbxof{min-width:60px;text-align:center;font-style:normal;font-family:"BohemiaROM",monospace;font-size:10px;letter-spacing:1px;color:#e7dcc6}',
    JD + ' #newco .strip{gap:0;padding:0;scroll-snap-type:x mandatory;scrollbar-width:none;overscroll-behavior-x:contain}',
    JD + ' #newco .strip::-webkit-scrollbar{display:none}',
    JD + ' #newco .org{flex:0 0 100%;box-sizing:border-box;scroll-snap-align:center;min-height:96px;padding:10px 14px 8px;gap:5px;border:1px solid #050505;'
      + 'background:#18191b;box-shadow:inset 0 1px 0 #4a4c51,inset 0 -2px 0 #0b0b0c}',
    JD + ' #newco .org.on{border-color:#050505;box-shadow:inset 3px 0 0 #e2bd6a,inset 0 1px 0 #4a4c51,inset 0 -2px 0 #0b0b0c}',
    JD + ' #newco .org b{font-size:20px;line-height:20px;letter-spacing:1px;color:#e7dcc6}',
    JD + ' #newco .org.on b{color:#e2bd6a}',
    JD + ' #newco .org i{font-size:10px;line-height:14px;color:#e7dcc6}',
    JD + ' #newco .org em{color:#bfe3ae}' + JD + ' #newco .org em.d2{color:#ead98f}' + JD + ' #newco .org em.d3{color:#f8c8a6}' + JD + ' #newco .org em.d4{color:#ffc2b8}',
    /* a card resting off the strip keeps its plate and drops its print, so nothing of it reads through another screen's plate */
    JD + ' #newco .org.cbx-out>*{visibility:hidden}',
    /* __SCROLLING_IS_ILLEGAL__ (rule 402): the strip never moves under a finger; a card off the glass is not there to press */
    JD + ' #newco .strip{overflow:hidden!important;touch-action:pan-y}' + JD + ' #newco .org.cbx-out{visibility:hidden}',
    /* the facts on the camera's little screen: sunk into the plastic (the shadow on top, the light under), cream on black */
    JD + ' #newco .org i:last-child{margin-top:6px;padding:4px 8px;background:#0a0b0b;color:#e7dcc6;line-height:14px;box-shadow:inset 0 2px 0 #000,inset 0 -1px 0 #3a3c40}',
    /* the name: the camera's title screen, sunk the same, his letters at 20; ANOTHER a button beside it */
    JD + ' #newco .name input{border:1px solid #050505;background:#0a0b0b;color:#efe6d2;caret-color:#d8341f;font-family:"BohemiaCasing",monospace;font-size:20px;letter-spacing:2px;box-shadow:inset 0 2px 0 #000,inset 0 -1px 0 #3a3c40}',
    JD + ' #newco .name input:focus{border-color:#e2bd6a;background:#0a0b0b}',
    JD + ' #newco .name button{border:1px solid #050505;background:#1d1e20;color:#e7dcc6;box-shadow:inset 0 1px 0 #4a4c51,inset 0 -2px 0 #0b0b0c}',
    /* the load under the picks: the log is a receipt the machine prints, two lines, the newest at the bottom */
    JD + '.load #loadgl{flex:0 0 auto;height:20px;max-height:20px;min-height:0;padding:1px 10px;line-height:18px;overflow:hidden}',
    JD + '.load #loadgl>div:not(:last-child){display:none}',   /* UI 5: the newest line only; the camera above already reads the load */   /* the two newest lines; the older ones scrolled off the receipt print nowhere */
    JD + ' #loadrow{gap:10px}',
    JD + ' #cbxmini{flex:0 0 auto;display:block;image-rendering:pixelated;image-rendering:crisp-edges}',
    /* sideways the picks keep their own column (the bare look's grid): the card a little shorter */
    '@media (min-aspect-ratio: 4/3){'
      + JD + ' #newco{display:block;column-count:2;column-gap:14px;column-fill:auto;overflow:hidden}'
      + JD + ' #newco>*{break-inside:avoid}'
      + JD + ' #newco h4[data-sec="30"]{break-before:column;margin-top:0}'
      + JD + ' #newco h4 .cbxcap{display:none}'
      + JD + ' #newco h4{margin:6px 0 4px}'
      + JD + ' #newco h4.cbxorigin{margin-top:2px}'
      + JD + ' #newco .org{min-height:0;padding:8px 10px 6px;gap:4px}'
      + JD + ' #newco .org b{font-size:10px;line-height:10px}'
      + JD + ' #newco .row button{padding:4px 4px;letter-spacing:0}'
    + '}',
    /* THE HINT: a tin plate beside the phone, his face and his mouth, the line typed on the beat */
    '#cbxsay{position:fixed;z-index:2147482000;display:none;align-items:flex-start;gap:8px;box-sizing:border-box;padding:8px 10px 8px 8px;pointer-events:none;'
      + 'border:2px solid #0e0a05;background:var(--cbx-rivet) right 3px top 3px no-repeat,var(--cbx-rivet) right 3px bottom 3px no-repeat,var(--cbx-tin) 0 0/128px 64px,#26281f;box-shadow:inset 0 1px 0 #55584c,inset 0 -1px 0 #1d1f1a;'
      + 'color:#e7dcc6;font-family:"BohemiaROM",ui-monospace,monospace;font-size:10px;line-height:14px}',
    '#cbxsay canvas{flex:0 0 auto;width:48px;height:48px;border:2px solid #0e0a05;background:#0a0d0b;image-rendering:auto}',
    '#cbxsay b{display:block;margin-bottom:4px;font-family:"BohemiaCasing",ui-monospace,monospace;font-weight:400;font-size:10px;letter-spacing:2px;color:#e6c475}',
    '#cbxsay span{display:block;min-height:28px}'
  ].join('\n');
  function style() { if ($('cbx-css')) return; var s = document.createElement('style'); s.id = 'cbx-css'; s.textContent = CSS; (document.head || document.documentElement).appendChild(s); }

  /* ---------------- THE HINTS (ask 262): one line a place, the first time, from a face ---------------- */
  var SAY = { el: null, on: null, since: 0, k: null, t: 0, line: '', who: null, busy: false };
  function said() { try { return JSON.parse(localStorage.getItem(D.hints.said_key) || '{}') || {}; } catch (e) { return {}; } }
  function markSaid(k) { var s = said(); s[k] = 1; try { localStorage.setItem(D.hints.said_key, JSON.stringify(s)); } catch (e) {} }
  /* who says it: the company's veteran, never YOU (the fight's own rule for its lessons); a lone wolf hears nobody */
  function veteran() {
    var men = null;
    try { men = JSON.parse(localStorage.getItem('bohemia.company.v1') || 'null'); } catch (e) {}
    var fromDoor = false;
    if (!men || !men.length) { try { var p = window.BOH_START && BOH_START.picks(); men = p && p.company; fromDoor = true;
      /* the door's men have no names yet: the fight's own naming (engine/bohemia_condition.js) gives each his name and look by place */
      if (men && window.BohemiaCondition && BohemiaCondition.named) men = BohemiaCondition.named(men);
      /* and the look of his place, by the same rule (ours.json people_looks.crew, i mod its length), when this page's copy has not read it */
      if (men && CREWLOOKS && CREWLOOKS.length) men = men.map(function (m, i) { if (!m || m.look || i === 0) return m; var o = {}; for (var k in m) o[k] = m[k]; o.look = CREWLOOKS[i % CREWLOOKS.length]; return o; }); } catch (e) {} }
    if (!men || !men.length) return null;
    var c = men.filter(function (m, i) { return m && !m.main && !m.dead && m.look && !(fromDoor && i === 0); });   /* the door's first man is YOU */
    if (!c.length) return null;
    c.sort(function (a, b) { return (b.level || 1) - (a.level || 1) || (b.xp || 0) - (a.xp || 0); });
    return c[0];
  }
  var CREWLOOKS = null;
  function crewLooks() { if (CREWLOOKS || crewLooks.asked) return; crewLooks.asked = true;
    try { fetch('../records/target/bb/ours.json').then(function (r) { return r.json(); }).then(function (j) { var pl = j && j.people_looks; pl = pl && (pl.value || pl); CREWLOOKS = pl && Array.isArray(pl.crew) ? pl.crew.slice() : []; }).catch(function () {}); } catch (e) {} }
  function faces(cb) {
    if (window.BohemiaCrewFaces) return cb(window.BohemiaCrewFaces);
    if (faces.loading) return; faces.loading = true;
    var s = document.createElement('script'); s.src = '../engine/bohemia_crew_faces.js'; s.async = true;
    s.onload = function () { faces.loading = false; }; s.onerror = function () { faces.loading = false; faces.failed = true; };
    document.head.appendChild(s);
  }
  function phoneState() { try { var P = window.BohemiaPhone; return P && P.state ? P.state() : null; } catch (e) { return null; } }
  function sayBox() {
    if (SAY.el) return SAY.el; style(); vars();
    var d = document.createElement('div'); d.id = 'cbxsay'; d.setAttribute('role', 'status');
    d.innerHTML = '<canvas width="96" height="96"></canvas><div><b></b><span></span></div>';
    document.body.appendChild(d); SAY.el = d; return d;
  }
  function placeSay(st) {
    var d = SAY.el, r = st && st.rect; if (!d) return;
    var W = Math.min(260, innerWidth - 32);
    d.style.width = W + 'px';
    if (r && r.width) {
      var right = (st.side || 'right') === 'right';
      var left = right ? Math.max(16, Math.round(r.left + r.width - W)) : Math.round(Math.min(innerWidth - 16 - W, r.left));
      var top = Math.round(r.top - d.offsetHeight - 8);
      if (top < 8) { top = Math.round(r.top); left = right ? Math.round(r.left - W - 8) : Math.round(r.left + r.width + 8); }
      d.style.left = Math.max(8, left) + 'px'; d.style.top = Math.max(8, top) + 'px';
    } else { d.style.left = '16px'; d.style.bottom = '16px'; }
  }
  function say(k, force) {
    if (SAY.busy) return false;
    if (!force && (!hintsOn() || said()[k])) return false;
    var line = D.hints.lines[k]; if (!line) return false;
    var v = veteran(); if (!v) return false;
    var F = window.BohemiaCrewFaces; if (!F) { faces(function () {}); return false; }
    if (F.has && !F.has(v.look)) return false;
    var st = phoneState();
    markSaid(k); SAY.busy = true; SAY.k = k; SAY.line = line; SAY.who = v;
    var d = sayBox(); d.querySelector('b').textContent = String(v.name || '').toUpperCase(); d.querySelector('span').textContent = '';
    var c = d.querySelector('canvas'), g = c.getContext('2d'); g.clearRect(0, 0, c.width, c.height);
    try { F.draw(g, v.look, c.width); } catch (e) {}
    d.style.display = 'flex'; d.style.bottom = ''; placeSay(st);
    var row = { id: 'hint', k: k, who: v.name, look: v.look, t0: Math.round(now()), line: line };
    LOG.push(row);
    /* the voice the game gives a face (SOUNDS' squiggle), harmless unheard */
    try { window.postMessage({ type: 'BOHEMIA_VOICE', speaker: 'face:' + v.look, text: line }, '*'); } catch (e) {}
    var ms = D.moves.hold_ms, IN = D.moves.say_in_holds, OUT = D.moves.say_out_holds;
    var rise = function (i) { if (i >= IN) { d.style.transform = ''; d.style.opacity = ''; type(); return; }
      var k2 = (i + 1) / IN; d.style.transform = still() ? '' : 'translateY(' + Math.round((1 - k2) * 24) + 'px)'; d.style.opacity = String(Math.round(k2 * 100) / 100);
      setTimeout(function () { rise(i + 1); }, ms); };
    var type = function () {
      try { F.talk(c, v.look, line); } catch (e) {}
      var t0 = now(), per = D.beat_ms / 6, n = D.hints.type_per_beat / 6;
      var tick = function () { var shown = Math.min(line.length, Math.floor((now() - t0) / per) * n);
        d.querySelector('span').textContent = line.slice(0, shown);
        if (shown < line.length) setTimeout(tick, per); else setTimeout(sink, D.hints.hold_beats * D.beat_ms); };
      tick(); };
    var sink = function () { var i = 0; var go = function () { if (i >= OUT) { d.style.display = 'none'; d.style.transform = ''; d.style.opacity = ''; SAY.busy = false; row.t1 = Math.round(now()); return; }
      var k3 = (i + 1) / OUT; d.style.transform = still() ? '' : 'translateY(' + Math.round(k3 * 24) + 'px)'; d.style.opacity = String(Math.round((1 - k3) * 100) / 100); i++; setTimeout(go, ms); }; go(); };
    rise(0);
    return true;
  }
  /* the place is on top when the middle of the glass is the game's own frame, not a sheet laid over it */
  function covered() {
    try { var e = document.elementFromPoint(innerWidth / 2, innerHeight / 2); if (!e) return true;
      for (var n = e; n && n !== document.body; n = n.parentElement) {
        if (n.id === 'mainmaker' || n.id === 'squadup' || n.id === 'setwrap' || n.id === 'title' || n.id === 'front') return true;
        var z = +getComputedStyle(n).zIndex; if (z >= 2147480000 && n.id !== 'cbxsay') return true; }
      return false; } catch (e) { return false; }
  }
  /* the watcher: the phone says which place is on the glass; a place held quiet long enough, the first time, gets its line */
  function hintTick() {
    if (!hintsOn()) { SAY.on = null; return; }
    var st = phoneState(), scr = st && st.on ? st.screen : null;
    if (SAY.busy && SAY.el) placeSay(st);
    if (scr !== SAY.on) { SAY.on = scr; SAY.since = now(); return; }
    if (!scr || SAY.busy || !D.hints.lines[scr] || said()[scr]) return;
    var f = $('front'); if (f && f.style.display !== 'none') return;     /* never over the door */
    if (covered()) { SAY.since = now(); return; }                       /* nor while a screen of the game's own is over the place (the barber's mirror, a card) */
    if (now() - SAY.since < (D.hints.quiet_ms[scr] || 8000)) return;
    crewLooks();
    if (!window.BohemiaCrewFaces) { faces(function () {}); return; }
    say(scr);
  }

  /* ---------------- THE LOOP: one, on the beat's keys, cheap ---------------- */
  function loop() {
    try {
      var f = $('front'), up = f && f.style.display !== 'none';
      if (up) {
        if ($('newco')) watchPicks();
        var root = ensureMachine();
        feedSound();
        if (root && !TITLE.leaving) { if (placeFeed(root)) paintFeed(false); }
        if ($('newco') && !TITLE.leaving) ensureMini();
        /* the strip was dressed while the title hid it (a hidden strip cannot scroll): the first time it is on the glass, it goes
           to the origin that is picked, or the card reads empty (measured upright 11/3: 2 OF 15 picked, the strip at 0) */
        var st0 = $('newcostrip'); if (st0) { var vis0 = st0.clientWidth > 0; if (vis0 && !st0.__cbxShown) { st0.__cbxShown = true; snapToPicked(false); } else if (!vis0) st0.__cbxShown = false; }
        if (MINI.el) paintMini();
      }
    } catch (e) { LOG.push({ k: 'loop threw', e: String(e) }); }
    requestAnimationFrame(loop);
  }
  function boot() { style(); vars(); requestAnimationFrame(loop); setInterval(hintTick, 500); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();

  window.BohemiaCrashbox = {
    hintsOn: hintsOn, setHints: setHints, doorOut: doorOut, say: say, log: LOG,
    data: function () { return D; },
    state: function () { var P = progress(); return { feed: !!(FEED.el && FEED.el.isConnected && FEED.el.style.display !== 'none'), pick: feedKey(), loaded: !!feedImg(), sound: window.__TITLEWIND ? __TITLEWIND.SRC : null,
      mini: !!(MINI.el && MINI.el.isConnected), key: keyOf(D.keys_per_bar), beat: Math.floor(beatF()), progress: P, line: newestLine(), hints: hintsOn(), said: said(),
      orient: orient(), shown: FEED.orient, fading: !!FEED.fade, cutting: !!FEED.cut, next: FEED.next, on_s: Math.round((now() - FEED.since) / 100) / 10, pool: pool().length }; },
    feedKey: feedKey,
    /* a probe's hand on the monitor (the gate, the VOTE film): the cycle's clock wound to the cut; the game never calls it */
    cutSoon: function () { FEED.since = now() - (D.feed.cycle_s - 0.2) * 1000; FEED.next = null; FEED.lastSig = ''; }
  };
})();
