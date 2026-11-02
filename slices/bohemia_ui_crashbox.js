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
   1. THE MACHINE (the loading screen): on the title, between his letters and NEW GAME, a handmade box: plywood, a
      rusty tin bezel with rivets, a cracked tube. Inside the tube the valley at night and DIRECTION's master-rig robot
      (the one he loved, 10/17 and 11/2), its idle at twelve keys a bar, four beats at 120 BPM. Under the tube a tin
      gauge whose needle IS the load's own count (#loadpct, the same stages as the bar; never a fake number), four
      bulbs that step one a beat, and a strip of masking tape that prints the load's newest line (#loadgl).
      THE WRONGNESS (DIRECTION 11/2, wrongness.json 'loading_it_comes_closer'): from a saved game's third day, one load
      in four, the tube shows the empty desert with the blank figure instead of the valley, the three pictures in
      order, never back. Never announced.
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
    robot: { big: { src: 'crashbox/robot_idle_s_120.png', w: 81, h: 120, keys: 12 }, small: { src: 'crashbox/robot_idle_s_52.png', w: 35, h: 52, keys: 12 } },
    machine: { min_h: 150, max_h: 268, max_w: 358, gap: 14, bulbs: 4, strip_h: 40, strip_window: 36 },
    moves: { hold_ms: 125, door_hold_ms: 83, title_out_holds: 3, door_out_holds: 4, say_in_holds: 3, say_out_holds: 3 },
    wrongness: { id: 'loading_it_comes_closer', pictures: ['wrongness/loading_it_comes_closer_1.png', 'wrongness/loading_it_comes_closer_2.png', 'wrongness/loading_it_comes_closer_3.png'], one_in: 4, from_day: 3, key: 'bohemia.wrong.loading' },
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
  var ROBOT = { big: img(D.robot.big.src), small: img(D.robot.small.src) };
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

  /* ---------------- THE MACHINE ---------------- */
  /* the valley in the tube: the same night as the title's ground (the ridge, the dead pylons, one block with power) */
  function valley(w, h) {
    var c = cv(w, h), g = c.getContext('2d'), r = rng(23);
    g.fillStyle = '#0b1018'; g.fillRect(0, 0, w, h);
    var bands = ['#0d131c', '#101722', '#141b27', '#19202c'];
    for (var b = 0; b < 4; b++) { g.fillStyle = bands[b]; g.fillRect(0, Math.round(h * (.18 + b * .1)), w, Math.round(h * .1) + 1); }
    for (var i = 0; i < 26; i++) { g.fillStyle = r() < .2 ? '#cfd6c4' : '#5d6670'; g.fillRect(r() * w | 0, r() * h * .45 | 0, 1, 1); }
    var hz = Math.round(h * .6);
    g.fillStyle = '#1b1f29'; g.beginPath(); g.moveTo(0, hz);
    for (var x = 0; x <= w; x += 3) g.lineTo(x, hz - 9 - Math.round(Math.sin(x / 23) * 5 + Math.sin(x / 7) * 1.5));
    g.lineTo(w, h); g.lineTo(0, h); g.fill();
    g.fillStyle = '#0f1013'; g.fillRect(0, hz, w, h - hz);
    for (var y = hz + 4; y < h; y += 4 + Math.round((y - hz) / 9)) { g.fillStyle = '#16181c'; g.fillRect(0, y, w, 1); }
    /* one block with power, far off: sodium dots, the only warm thing */
    var bx = Math.round(w * .72), by = hz + 3;
    for (i = 0; i < 6; i++) { g.fillStyle = '#ffd08a'; g.fillRect(bx + (i % 3) * 5, by + Math.floor(i / 3) * 3, 1, 1); }
    g.fillStyle = '#3a2a16'; g.fillRect(bx - 2, by - 1, 15, 1);
    /* the grid that died */
    g.fillStyle = '#05060a';
    [[.12, 28], [.5, 20], [.88, 14]].forEach(function (p) { var X = Math.round(w * p[0]), H = p[1], Y = hz - 4;
      for (var k = 0; k < H; k++) { var s = Math.round((H - k) * .16); g.fillRect(X - s, Y - k, 1, 1); g.fillRect(X + s, Y - k, 1, 1); }
      g.fillRect(X - Math.round(H * .28), Y - Math.round(H * .82), Math.round(H * .56), 1); g.fillRect(X - Math.round(H * .2), Y - Math.round(H * .62), Math.round(H * .4), 1); });
    return c;
  }
  /* the tube's glass: three rows a scanline, the corners falling away in steps (a curved tube, never a gradient), a crack */
  function glassOver(g, x, y, w, h, seed) {
    var r = rng(seed || 31);
    for (var yy = 0; yy < h; yy += 3) { g.fillStyle = 'rgba(0,0,0,.22)'; g.fillRect(x, y + yy + 2, w, 1); }
    [[.07, .5], [.035, .3], [.015, .18]].forEach(function (s, i) { var d = Math.round(Math.min(w, h) * s[0]) + 2;
      g.fillStyle = 'rgba(0,0,0,' + s[1] + ')';
      g.fillRect(x, y, w, Math.max(1, i + 1)); g.fillRect(x, y + h - (i + 1), w, i + 1); g.fillRect(x, y, i + 1, h); g.fillRect(x + w - (i + 1), y, i + 1, h);
      for (var k = 0; k < d; k++) { var q = d - k; g.fillRect(x, y + k, q, 1); g.fillRect(x + w - q, y + k, q, 1); g.fillRect(x, y + h - 1 - k, q, 1); g.fillRect(x + w - q, y + h - 1 - k, q, 1); } });
    /* the crack, from the top right corner down: the box got dropped once */
    var cx = x + Math.round(w * .78), cy = y + 1;
    g.fillStyle = 'rgba(220,226,210,.38)';
    for (var n = 0; n < Math.round(h * .55); n++) { cx += r() < .5 ? -1 : (r() < .25 ? 1 : 0); cy += 1; g.fillRect(cx, cy, 1, 1);
      if (n === 14) { var bx = cx, by = cy; for (var m = 0; m < 12; m++) { bx += 1; by += r() < .6 ? 1 : 0; g.fillRect(bx, by, 1, 1); } } }
  }
  function screwAt(g, x, y) { g.fillStyle = '#0e0a05'; g.fillRect(x - 2, y - 2, 5, 5); g.fillStyle = '#8a857a'; g.fillRect(x - 1, y - 1, 3, 3); g.fillStyle = '#2a2620'; g.fillRect(x - 1, y, 3, 1); }
  function tapeAt(g, x, y, w, h, seed) {
    var r = rng(seed || 3);
    g.fillStyle = '#cdbf92'; g.fillRect(x, y, w, h);
    for (var i = 0; i < w * h / 6; i++) { g.fillStyle = r() < .5 ? '#c2b386' : '#d7caa0'; g.fillRect(x + (r() * w | 0), y + (r() * h | 0), 1, 1); }
    g.fillStyle = 'rgba(0,0,0,.18)'; for (var yy = 0; yy < h; yy += 2) { if (r() < .5) g.fillRect(x, y + yy, 1, 1); if (r() < .5) g.fillRect(x + w - 1, y + yy, 1, 1); }
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
    var gl = $('loadgl'), c = gl && gl.lastElementChild; return c ? String(c.textContent || '').trim().toUpperCase() : 'WARMING THE TUBE';
  }
  /* THE WRONGNESS on the tube: decided once a load, from the save's day (B3), one in four, the next picture, never back */
  var WRONG = { decided: false, pic: null, n: 0 };
  function decideWrong(day) {
    if (WRONG.decided) return; WRONG.decided = true;
    var W = D.wrongness; if (!W || !(day >= W.from_day)) return;
    var n = 0; try { n = +localStorage.getItem(W.key) || 0; } catch (e) {}
    if (n >= W.pictures.length) return;
    if (Math.random() * W.one_in >= 1) return;
    try { localStorage.setItem(W.key, String(n + 1)); } catch (e) {}
    WRONG.n = n + 1; WRONG.pic = img(W.pictures[n]); WRONG.pic.onload = function () { DIRTY = true; MACH.bakedFor = ''; };
    LOG.push({ k: 'wrongness', id: W.id, picture: n + 1, day: day });
  }
  function saveDay() { try { if (typeof CITYSAVE === 'undefined' || !CITYSAVE.load) return undefined; var s = CITYSAVE.load(); return s && s.data ? (s.data.day | 0) : 0; } catch (e) { return 0; } }

  var MACH = { el: null, w: 0, h: 0, bakedFor: '', base: null, tube: null, win: null, lastKey: -1, lastBeat: -1, lastF: -1, lastLine: '' };
  function bakeMachine(W, H) {
    var base = cv(W, H), g = base.getContext('2d');
    var wood = ply(W, H, 9); g.drawImage(wood, 0, 0);
    g.fillStyle = '#0e0a05'; g.fillRect(0, 0, W, 2); g.fillRect(0, H - 2, W, 2); g.fillRect(0, 0, 2, H); g.fillRect(W - 2, 0, 2, H);
    /* a saw that wandered: the box's edge is cut by hand */
    var r = rng(41); for (var x = 2; x < W - 2; x += 1) { if (r() < .12) { g.fillStyle = '#0e0a05'; g.fillRect(x, 2, 1, 1); } if (r() < .12) { g.fillStyle = '#0e0a05'; g.fillRect(x, H - 3, 1, 1); } }
    /* the tin bezel round the tube */
    var bez = { x: 9, y: 9, w: W - 18, h: H - 18 - 58 };
    var t = tin(bez.w, bez.h, false, 13); g.drawImage(t, bez.x, bez.y);
    g.fillStyle = '#0e0a05'; g.fillRect(bez.x - 1, bez.y - 1, bez.w + 2, 1); g.fillRect(bez.x - 1, bez.y + bez.h, bez.w + 2, 1); g.fillRect(bez.x - 1, bez.y, 1, bez.h); g.fillRect(bez.x + bez.w, bez.y, 1, bez.h);
    var rv = rivet(); [[bez.x + 3, bez.y + 3], [bez.x + bez.w - 8, bez.y + 3], [bez.x + 3, bez.y + bez.h - 8], [bez.x + bez.w - 8, bez.y + bez.h - 8]].forEach(function (p) { g.drawImage(rv, p[0], p[1]); });
    var win = { x: bez.x + 11, y: bez.y + 9, w: bez.w - 22, h: bez.h - 18 };
    g.fillStyle = '#0e0a05'; g.fillRect(win.x - 2, win.y - 2, win.w + 4, win.h + 4);
    /* the panel under the tube: a tin plate screwed to the wood */
    var pan = { x: 9, y: H - 9 - 50, w: W - 18, h: 50 };
    g.drawImage(tin(pan.w, pan.h, false, 17), pan.x, pan.y);
    g.fillStyle = '#0e0a05'; g.fillRect(pan.x, pan.y - 1, pan.w, 1); g.fillRect(pan.x, pan.y + pan.h, pan.w, 1);
    screwAt(g, 5, 5); screwAt(g, W - 6, 5); screwAt(g, 5, H - 6); screwAt(g, W - 6, H - 6);
    /* the gauge's face: a paper dial glued in, its ticks inked by hand */
    var gc = { x: pan.x + 28, y: pan.y + pan.h - 9, r: 22 };
    g.fillStyle = '#0e0a05'; g.beginPath(); g.arc(gc.x, gc.y, gc.r + 2, Math.PI, 0); g.fill();
    g.fillStyle = '#d9cfb3'; g.beginPath(); g.arc(gc.x, gc.y, gc.r, Math.PI, 0); g.fill();
    g.fillStyle = '#0e0a05'; g.fillRect(gc.x - gc.r - 2, gc.y, gc.r * 2 + 5, 2);
    for (var k = 0; k <= 10; k++) { var a = Math.PI + Math.PI * k / 10, l = k % 5 ? 3 : 6;
      for (var s = 0; s < l; s++) g.fillRect(Math.round(gc.x + Math.cos(a) * (gc.r - 1 - s)), Math.round(gc.y + Math.sin(a) * (gc.r - 1 - s)), 1, 1); }
    g.fillStyle = '#8a1c10'; for (k = 0; k < 3; k++) { var a2 = Math.PI * 2 - Math.PI * k / 30; g.fillRect(Math.round(gc.x + Math.cos(a2) * (gc.r - 2)), Math.round(gc.y + Math.sin(a2) * (gc.r - 2)), 2, 2); }
    /* the tape for the newest line, stuck across the right of the panel */
    var tp = { x: pan.x + 96, y: pan.y + 14, w: pan.w - 96 - 8, h: 18 };
    tapeAt(g, tp.x, tp.y, tp.w, tp.h, 3);
    /* a strip of tape across the bezel's corner, holding the tube in */
    g.save(); g.translate(bez.x + bez.w - 30, bez.y - 4); g.rotate(.5); tapeAt(g, 0, 0, 42, 11, 8); g.restore();
    MACH.base = base; MACH.win = win; MACH.gauge = gc; MACH.tape = tp; MACH.bulbs = { x: pan.x + 60, y: pan.y + 21 };
    MACH.tube = valley(win.w, win.h);
    if (WRONG.pic && WRONG.pic.complete && WRONG.pic.naturalWidth) {
      /* the desert with the figure, its own picture filling the tube by its height, centred: nothing drawn over it */
      var tc = cv(win.w, win.h), tg = tc.getContext('2d'); tg.fillStyle = '#2a2a2a'; tg.fillRect(0, 0, win.w, win.h);
      var sc = Math.max(win.w / WRONG.pic.naturalWidth, win.h / WRONG.pic.naturalHeight), dw = Math.round(WRONG.pic.naturalWidth * sc), dh = Math.round(WRONG.pic.naturalHeight * sc);
      tg.imageSmoothingEnabled = false; tg.drawImage(WRONG.pic, Math.round((win.w - dw) / 2), Math.round((win.h - dh) / 2), dw, dh); MACH.tube = tc;
    }
  }
  function paintMachine(force) {
    var c = MACH.el; if (!c || !c.isConnected) return;
    var W = c.width, H = c.height, sig = W + 'x' + H + (WRONG.pic ? 'w' : '');
    if (MACH.bakedFor !== sig) { bakeMachine(W, H); MACH.bakedFor = sig; force = true; }
    var R = D.robot.big, key = keyOf(R.keys), beat = Math.floor(beatF()) % D.machine.bulbs, P = progress(), line = newestLine();
    if (!force && !DIRTY && key === MACH.lastKey && beat === MACH.lastBeat && P.f === MACH.lastF && line === MACH.lastLine) return;
    MACH.lastKey = key; MACH.lastBeat = beat; MACH.lastF = P.f; MACH.lastLine = line; DIRTY = false;
    var g = c.getContext('2d'); g.imageSmoothingEnabled = false;
    g.drawImage(MACH.base, 0, 0);
    var w = MACH.win; g.drawImage(MACH.tube, w.x, w.y);
    if (!WRONG.pic) {
      /* the robot on the valley floor, its contact shadow first; he stands where the light from the one block reaches */
      var rx = Math.round(w.x + w.w * .5 - R.w / 2), ry = Math.round(w.y + w.h - R.h - 4);
      if (ry < w.y + 2) ry = w.y + 2;
      g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(rx + 14, w.y + w.h - 7, R.w - 28, 2); g.fillRect(rx + 20, w.y + w.h - 5, R.w - 40, 1);
      g.save(); g.beginPath(); g.rect(w.x, w.y, w.w, w.h); g.clip();
      if (ROBOT.big.complete && ROBOT.big.naturalWidth) g.drawImage(ROBOT.big, key * R.w, 0, R.w, R.h, rx, ry, R.w, R.h);
      g.restore();
    }
    glassOver(g, w.x, w.y, w.w, w.h, 31);
    /* the needle IS the load's count */
    var gc = MACH.gauge, a = Math.PI + Math.PI * P.f;
    g.fillStyle = '#1a120a'; for (var s = 0; s < gc.r - 4; s++) g.fillRect(Math.round(gc.x + Math.cos(a) * s), Math.round(gc.y + Math.sin(a) * s), 2, 2);
    g.fillStyle = '#0e0a05'; g.fillRect(gc.x - 2, gc.y - 2, 5, 5); g.fillStyle = '#8a857a'; g.fillRect(gc.x - 1, gc.y - 1, 3, 3);
    /* the bulbs: one lit a beat, stepping, the beat you can see */
    var B = MACH.bulbs;
    for (var i = 0; i < D.machine.bulbs; i++) { var bx = B.x + i * 8;
      g.fillStyle = '#0e0a05'; g.fillRect(bx - 1, B.y - 1, 7, 7);
      g.fillStyle = (i === beat) ? (P.ready ? '#e6c475' : '#d9a85a') : '#3a3226'; g.fillRect(bx, B.y, 5, 5);
      if (i === beat) { g.fillStyle = '#fff0c8'; g.fillRect(bx + 1, B.y + 1, 2, 1); } }
    /* the tape prints the newest line of the load, cut to what fits */
    var tp = MACH.tape; tapeAt(g, tp.x, tp.y, tp.w, tp.h, 3);
    g.fillStyle = '#1f1710'; g.font = '10px ' + (FONT_OK ? 'BohemiaROM' : 'monospace'); g.textBaseline = 'middle';
    var txt = line; while (txt.length > 3 && g.measureText(txt).width > tp.w - 8) txt = txt.slice(0, -1);
    g.fillText(txt, tp.x + 4, tp.y + tp.h / 2 + 1);
    /* the count under the tape, printed small: what the needle reads, in the load's own words */
    if (P.of) { g.fillStyle = '#e7dcc6'; g.fillText(P.n + ' OF ' + P.of, tp.x + 2, tp.y + tp.h + 9); }
  }
  /* where the machine stands: between his letters and the three choices (upright), under his letters (sideways) */
  function placeMachine(root) {
    var t = root.querySelector('.t'), m = root.querySelector('.m'); if (!t || !m) return false;
    var rt = t.getBoundingClientRect(), rm = m.getBoundingClientRect(), G = D.machine.gap, wide = innerWidth / Math.max(1, innerHeight) >= 4 / 3;
    var left, width, top, bottom;
    if (!wide) { width = Math.min(D.machine.max_w, innerWidth - 32); left = Math.round((innerWidth - width) / 2); top = rt.bottom + G; bottom = rm.top - G; }
    else { width = Math.min(D.machine.max_w, Math.max(200, rt.width)); left = Math.round(rt.left + (rt.width - width) / 2); top = rt.bottom + G; bottom = innerHeight - 44; }
    var avail = bottom - top, h = Math.min(D.machine.max_h, avail);
    if (h < D.machine.min_h || width < 200) { MACH.el.style.display = 'none'; return false; }
    top = Math.round(top + (avail - h) / 2); width = Math.round(width); h = Math.round(h);
    var c = MACH.el; c.style.display = '';
    if (c.width !== width || c.height !== h) { c.width = width; c.height = h; }
    c.style.left = left + 'px'; c.style.top = top + 'px'; c.style.width = width + 'px'; c.style.height = h + 'px';
    return true;
  }

  /* the small machine by the bar, while the picks are up: the robot's head in a little tube and the four bulbs */
  var MINI = { el: null, lastKey: -1, lastBeat: -1 };
  function paintMini() {
    var c = MINI.el; if (!c || !c.isConnected) return;
    var R = D.robot.small, key = keyOf(R.keys), beat = Math.floor(beatF()) % D.machine.bulbs, P = progress();
    if (key === MINI.lastKey && beat === MINI.lastBeat && MINI.ready === P.ready) return;
    MINI.lastKey = key; MINI.lastBeat = beat; MINI.ready = P.ready;
    var g = c.getContext('2d'), W = c.width, H = c.height, ww = D.machine.strip_window; g.imageSmoothingEnabled = false;
    if (!MINI.base) { MINI.base = cv(W, H); var b = MINI.base.getContext('2d'); b.drawImage(tin(W, H, false, 19), 0, 0);
      b.fillStyle = '#0e0a05'; b.fillRect(0, 0, W, 1); b.fillRect(0, H - 1, W, 1); b.fillRect(0, 0, 1, H); b.fillRect(W - 1, 0, 1, H);
      b.fillRect(2, 2, ww, H - 4); MINI.tube = valley(ww - 2, H - 6); }
    g.drawImage(MINI.base, 0, 0); g.drawImage(MINI.tube, 3, 3);
    g.save(); g.beginPath(); g.rect(3, 3, ww - 2, H - 6); g.clip();
    if (ROBOT.small.complete && ROBOT.small.naturalWidth) g.drawImage(ROBOT.small, key * R.w, 0, R.w, R.h, 3 + Math.round((ww - 2 - R.w) / 2), 6, R.w, R.h);
    g.restore(); glassOver(g, 3, 3, ww - 2, H - 6, 37);
    for (var i = 0; i < D.machine.bulbs; i++) { var by = 5 + i * 10, bx = ww + 6;
      g.fillStyle = '#0e0a05'; g.fillRect(bx - 1, by - 1, 7, 7); g.fillStyle = i === beat ? (P.ready ? '#e6c475' : '#d9a85a') : '#3a3226'; g.fillRect(bx, by, 5, 5); }
  }
  function ensureMini() {
    var row = $('loadrow'); if (!row) return;
    if (MINI.el && MINI.el.parentNode === row) return;
    var c = MINI.el || cv(D.machine.strip_window + 16, D.machine.strip_h); c.id = 'cbxmini'; c.setAttribute('aria-hidden', 'true');
    MINI.el = c; row.insertBefore(c, row.firstChild); MINI.lastKey = -1;
  }

  /* ---------------- THE TITLE: find UI's look, put the machine in it ---------------- */
  var TITLE = { root: null, watched: null, leaving: false };
  function title() { var r = document.querySelector('#title .bm-start'); return r || null; }
  function ensureMachine() {
    var root = title(); if (!root) return null;
    if (!MACH.el) { MACH.el = cv(10, 10); MACH.el.id = 'cbxmachine'; MACH.el.setAttribute('aria-hidden', 'true'); }
    if (MACH.el.parentNode !== root && !TITLE.leaving) { var m = root.querySelector('.m'); root.insertBefore(MACH.el, m || null); MACH.bakedFor = ''; }
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
    var from = MACH.el && MACH.el.style.display !== 'none' && MACH.el.parentNode === root ? MACH.el.getBoundingClientRect() : null;
    ensureMini(); var to = MINI.el ? MINI.el.getBoundingClientRect() : null;
    var travel = !!(from && to && to.width);
    /* his letters on the title slide onto his letters on the picks, so the name never crosses itself */
    var lift = 40; try { var tm = tt && tt.querySelector('canvas'), dm = null;
      Array.prototype.forEach.call(f.querySelectorAll('.jtf-mark,#logobig,#loadtag'), function (el) { if (!dm && !tEl.contains(el) && el.getClientRects().length && el.getBoundingClientRect().height > 8) dm = el; });
      if (tm && dm) lift = Math.round(tm.getBoundingClientRect().top - dm.getBoundingClientRect().top); } catch (e) {}
    if (travel) { f.appendChild(MACH.el); MACH.el.style.zIndex = '45'; }
    var row = { id: 'title-to-picks', kind: 'screen', how: 'fold down + the machine drops into the bar', t0: Math.round(t0), holds: H, planned: H * ms, frames: [] };
    LOG.push(row);
    var step = function (i) {
      row.frames.push(Math.round(now() - t0));
      if (i >= H) {
        tEl.classList.remove('cbx-leaving'); root.style.transform = ''; root.style.opacity = '';
        if (m) m.style.transform = ''; if (tt) tt.style.transform = '';
        if (travel) { MACH.el.style.zIndex = ''; root.insertBefore(MACH.el, root.querySelector('.m') || null); MACH.bakedFor = ''; }
        TITLE.leaving = false; row.t1 = Math.round(now()); return;
      }
      var k = (i + 1) / H;
      /* the three choices go down off the glass first, the letters lift away, the ground thins to the picks under it */
      if (m) m.style.transform = 'translateY(' + Math.round(k * 60) + '%)';
      if (tt) tt.style.transform = 'translateY(' + Math.round(-k * lift) + 'px)';
      root.style.opacity = String(Math.round((1 - k * .9) * 100) / 100);
      if (travel) { var L = function (a, b) { return Math.round(a + (b - a) * k); };
        if (i === H - 1) MACH.el.style.display = 'none';
        else { MACH.el.style.left = L(from.left, to.left) + 'px'; MACH.el.style.top = L(from.top, to.top) + 'px'; MACH.el.style.width = L(from.width, to.width) + 'px'; MACH.el.style.height = L(from.height, to.height) + 'px'; } }
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
  function watchStrip() {
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
          if (sec === 20) { originNav(el); el.classList.add('cbxorigin'); } }
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
    '#cbxmachine{position:absolute;display:block;image-rendering:pixelated;image-rendering:crisp-edges;pointer-events:none;z-index:1}',
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
    JD + ' #newco h4{margin:10px 0 5px;line-height:10px}',
    JD + ' #newco h4:first-child{margin-top:0}',
    JD + ' #newco .row{padding:0;align-items:stretch;gap:6px}',
    /* what the picked plate does, said once, in its heading (Battle Brothers shows the picked difficulty's line) */
    JD + ' #newco h4 .cbxcap{margin-left:8px;font-family:"BohemiaROM",monospace;font-size:10px;letter-spacing:0;color:#e7dcc6;text-transform:none}',
    /* every plate is rusty tin with a rivet in each corner; the picked one is gold paint on tin */
    JD + ' #newco .row button{border:1px solid #0e0a05;background:var(--cbx-rivet) left 3px top 3px no-repeat,var(--cbx-rivet) right 3px top 3px no-repeat,var(--cbx-rivet) left 3px bottom 3px no-repeat,var(--cbx-rivet) right 3px bottom 3px no-repeat,var(--cbx-tin) 0 0/128px 64px,#26281f;'
      + 'color:#e7dcc6;box-shadow:inset 0 1px 0 #44473d,inset 0 -1px 0 #16180f;padding:6px 8px;font-size:10px;letter-spacing:1px;line-height:10px;text-align:center;min-height:44px}',
    JD + ' #newco .row button small{display:none}',
    JD + ' #newco .row button.on{background:var(--cbx-rivet) left 3px top 3px no-repeat,var(--cbx-rivet) right 3px top 3px no-repeat,var(--cbx-rivet) left 3px bottom 3px no-repeat,var(--cbx-rivet) right 3px bottom 3px no-repeat,var(--cbx-gold) 0 0/128px 64px,#c8ab63;'
      + 'color:#0e0a05;border-color:#0e0a05;box-shadow:inset 0 1px 0 #e6c475}',
    JD + ' #newco .row button.on small{display:none}',
    /* WHO YOU WERE: one big tin card at a time, the arrows and the count in its heading */
    JD + ' #newco h4.cbxorigin{color:#e7dcc6;display:flex;align-items:center;justify-content:space-between;min-height:44px;margin-top:6px;margin-bottom:4px}',
    JD + ' #newco .cbxnav{display:flex;align-items:center;gap:6px}',
    JD + ' #newco .cbxnav button{width:44px;height:44px;padding:0;border:1px solid #0e0a05;background:var(--cbx-tin) 0 0/128px 64px,#26281f;color:#e7dcc6;font-family:"BohemiaCasing",monospace;font-size:10px;line-height:10px;box-shadow:inset 0 1px 0 #55584c,inset 0 -1px 0 #1d1f1a}',
    JD + ' #newco .cbxof{min-width:60px;text-align:center;font-style:normal;font-family:"BohemiaROM",monospace;font-size:10px;letter-spacing:1px;color:#e7dcc6}',
    JD + ' #newco .strip{gap:0;padding:0;scroll-snap-type:x mandatory;scrollbar-width:none;overscroll-behavior-x:contain}',
    JD + ' #newco .strip::-webkit-scrollbar{display:none}',
    JD + ' #newco .org{flex:0 0 100%;box-sizing:border-box;scroll-snap-align:center;min-height:112px;padding:12px 14px 10px;gap:6px;border:2px solid #0e0a05;'
      + 'background:var(--cbx-rivet) left 4px top 4px no-repeat,var(--cbx-rivet) right 4px top 4px no-repeat,var(--cbx-rivet) left 4px bottom 4px no-repeat,var(--cbx-rivet) right 4px bottom 4px no-repeat,var(--cbx-tin) 0 0/128px 64px,#26281f;'
      + 'box-shadow:inset 0 1px 0 #55584c,inset 0 -1px 0 #1d1f1a}',
    JD + ' #newco .org.on{border-color:#c8ab63;box-shadow:inset 0 0 0 2px #0e0a05,inset 0 3px 0 #c8ab63,inset 0 -3px 0 #c8ab63}',
    JD + ' #newco .org b{font-size:20px;line-height:20px;letter-spacing:1px;color:#e7dcc6}',
    JD + ' #newco .org.on b{color:#e6c475}',
    JD + ' #newco .org i{font-size:10px;line-height:14px;color:#e7dcc6}',
    JD + ' #newco .org em{color:#bfe3ae}' + JD + ' #newco .org em.d2{color:#ead98f}' + JD + ' #newco .org em.d3{color:#f8c8a6}' + JD + ' #newco .org em.d4{color:#ffc2b8}',
    /* a card resting off the strip keeps its plate and drops its print, so nothing of it reads through another screen's plate */
    JD + ' #newco .org.cbx-out>*{visibility:hidden}',
    /* the facts on a strip of masking tape stuck across the card */
    JD + ' #newco .org i:last-child{margin-top:6px;padding:4px 8px;background:var(--cbx-tape) 0 0/96px 32px,#dccfa6;color:#1f1710;line-height:14px}',
    /* the name: written on tape on the machine, ANOTHER a tin plate */
    JD + ' #newco .name input{border:2px solid #0e0a05;background:var(--cbx-tape) 0 0/96px 32px,#dccfa6;color:#1f1710;caret-color:#8a1c10;font-family:"BohemiaCasing",monospace;font-size:20px;letter-spacing:2px}',
    JD + ' #newco .name input:focus{border-color:#c8ab63;background:var(--cbx-tape) 0 0/96px 32px,#e3d7b0}',
    JD + ' #newco .name button{border:1px solid #0e0a05;background:var(--cbx-tin) 0 0/128px 64px,#26281f;color:#e7dcc6;box-shadow:inset 0 1px 0 #55584c,inset 0 -1px 0 #1d1f1a}',
    /* the load under the picks: the log is a receipt the machine prints, two lines, the newest at the bottom */
    JD + '.load #loadgl{flex:0 0 auto;height:40px;max-height:40px;min-height:0;padding:2px 10px;line-height:18px}',
    JD + '.load #loadgl>div:not(:nth-last-child(-n+2)){visibility:hidden}',   /* the two newest lines; the older ones scrolled off the receipt print nowhere */
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
  var DAY = undefined;
  function loop() {
    try {
      var f = $('front'), up = f && f.style.display !== 'none';
      if (up) {
        if ($('newco')) watchPicks();
        var root = ensureMachine();
        if (root && !TITLE.leaving) {
          if (DAY === undefined) { DAY = saveDay(); if (DAY !== undefined) decideWrong(DAY); }
          if (placeMachine(root)) paintMachine(false);
        }
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
    state: function () { var P = progress(); return { machine: !!(MACH.el && MACH.el.isConnected && MACH.el.style.display !== 'none'), mini: !!(MINI.el && MINI.el.isConnected), key: keyOf(D.robot.big.keys), beat: Math.floor(beatF()), progress: P, line: newestLine(), wrong: WRONG.n, hints: hintsOn(), said: said() }; }
  };
})();
