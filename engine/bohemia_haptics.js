/* ============================================================================
   BOHEMIA -- YOU FEEL IT (FEEL lane, 11/2/26, rule 309, ask line 302)

   Paolo, passing on a playtester's note: "make sure it gives haptic feedback, that's
   super important... when people play this on controllers, or vibrating on their
   phone... I don't even know how that shit works, but make sure there's code for it."

   ONE CALL, AND NOTHING ELSE IN THE GAME KNOWS HOW IT IS DONE:
       haptic('hit')                      a blow lands
       BOH_HAPTICS.fromSound('kill', f)   what a sound means to the hand (f: the sound's facts)
   Every kind, its strength, its length, its pattern and its reason live in ONE data file a
   modder can edit: records/target/bb/haptics.json. This file holds no felt number; a kind
   the table does not name is silent, and so is everything before the table loads.

   THE BACKENDS, BEST AVAILABLE WINS (for the phone in the hand; a controller is extra):
     1. NATIVE: the app's own haptics once the game is wrapped as a phone app. Capacitor's
        Haptics plugin (impact LIGHT/MEDIUM/HEAVY, notification SUCCESS/WARNING/ERROR,
        selection) is found by itself; any other wrapper hands its own function to
        BOH_HAPTICS.setNative(fn). That is the iPhone's Taptic Engine, with no change to the
        game.
     2. VIBRATE: navigator.vibrate, the browser's (Android Chrome, Firefox Android).
     3. THE iPHONE SWITCH: iOS Safari has no vibrate. Since iOS 18 a checkbox drawn as a switch
        (<input type="checkbox" switch>) plays the system tick when it flips, so a hidden one is
        flipped. Not documented by Apple, so it is used only on an iPhone or iPad with no
        vibrate, only right after a real touch (the page's user activation, else the table's
        gesture window), and a heavier kind is more ticks, never a longer one.
     4. A CONTROLLER (added on top of the phone, never instead): the Gamepad API's
        vibrationActuator 'dual-rumble' (Chrome, Edge, Safari), or hapticActuators[0].pulse
        (Firefox). A pad that cannot rumble is skipped.
   Nothing missing is ever an error: no backend, no table, a cross-origin frame, an old
   browser, each one is silence.

   WHERE THE GAME GETS ITS FEEL, WITH THE LEAST CODE:
     - THE SOUND CALL. window.playSFX is the one dispatcher every game sound goes through (the
       shell's buttons, the city, the town, the fight's messages). This file wraps it from
       outside, through a property setter, so whoever assigns window.playSFX (and the second
       layer that re-wraps it, ONE BEAT FOR EVERYTHING) is wrapped without an edit in their
       code, and only the outermost call is felt. The table's "sounds" map says which sound
       is which kind; a sound it does not name is not felt (footsteps, the music, the room).
     - THE FIGHT'S MESSAGES. The fight posts {type:'BOHEMIA_SFX', ev, side, result...} to the
       shell; some never reach playSFX (the bullets and the deaths play their own). So the
       message itself is felt here, with its facts (whose man went down, won or lost), and the
       playSFX it causes is not felt twice (window.event is that message while it is handled).
       A frame inside a frame (the town inside the map) is heard the same way.
     - {type:'BOHEMIA_HAPTIC', kind} from any frame, and window.haptic(kind) in every frame of
       ours, for a moment with no sound.
     - OLD RAW CALLS. A frame of ours that calls navigator.vibrate itself (the old COMBAT tab's
       dial: eleven calls) is routed through here as kind 'raw', so the setting turns it off too.

   SPARSE ON PURPOSE (Apple's Human Interface Guidelines on playing haptics; Android's haptics
   design principles: "less is more", clear and crisp over buzzy, match what is seen and
   heard): a kind has a priority and a cooldown, and nothing starts while a stronger or equal
   buzz is still playing. The probe counts them per minute (tools/bohemia_feel_haptics_probe.js).

   THE SETTING: a BUZZ row on the gear's card, FULL / LIGHT / OFF, on by default, saved in
   localStorage 'boh.haptics'. LIGHT scales every length and magnitude by the table's
   light_scale and drops a native impact one step.

   READ IT:  BOH_HAPTICS.log (the last calls: kind, from, via, or why it was dropped),
             BOH_HAPTICS.count (asked, felt, dropped, by kind, by backend), BOH_HAPTICS.backends().
   ========================================================================== */
(function (root) {
  'use strict';
  if (!root || root.BOH_HAPTICS) return;
  var doc = root.document || null;
  var KEY = 'boh.haptics';
  var T = { settings: {}, kinds: {}, sounds: {}, setting: null }, READY = false;
  var LOG = [], COUNT = { asked: 0, felt: 0, dropped: 0, byKind: {}, byVia: {}, dropWhy: {} };
  var busyUntil = -Infinity, busyPri = -Infinity, lastAt = {}, lastTouch = -Infinity, NATIVE = null, depth = 0;

  function now() { try { return root.performance.now(); } catch (e) { return Date.now(); } }
  function S(k) { var v = T.settings[k]; return typeof v === 'number' ? v : 0; }
  function store() { try { return root.localStorage; } catch (e) { return null; } }

  /* ---- THE SETTING ---- */
  function prefs() {
    var p = null; try { p = JSON.parse((store() && store().getItem(KEY)) || 'null'); } catch (e) { p = null; }
    var on = p && typeof p.on === 'boolean' ? p.on : T.settings.default_on !== false;
    var st = p && typeof p.strength === 'string' ? p.strength : (T.settings.default_strength || 'full');
    return { on: on, strength: st };
  }
  function setPrefs(on, strength) {
    var p = prefs(); if (typeof on === 'boolean') p.on = on; if (typeof strength === 'string') p.strength = strength;
    try { store().setItem(KEY, JSON.stringify(p)); } catch (e) {}
    paint(); return p;
  }
  function scaleOf(p) { return p.strength === 'light' ? (S('light_scale') || 1) : 1; }

  /* ---- 1. NATIVE (the app wrapper) ---- */
  function capacitor() {
    var C = root.Capacitor; if (!C) return null;
    try { if (typeof C.isNativePlatform === 'function' && !C.isNativePlatform()) return null; } catch (e) { return null; }
    var H = C.Plugins && C.Plugins.Haptics; return H || null;
  }
  function quiet(p) { try { if (p && typeof p.catch === 'function') p.catch(function () {}); } catch (e) {} }
  function soften(style) { var m = T.settings.light_native || {}; return m[style] || style; }
  function viaNative(k, kind, p) {
    var n = k.native; if (!n) return false;
    var light = p.strength === 'light';
    if (NATIVE) { try { NATIVE({ kind: kind, native: n, light: light, scale: scaleOf(p) }); return true; } catch (e) { return false; } }
    var H = capacitor(); if (!H) return false;
    try {
      if (n.impact && H.impact) quiet(H.impact({ style: light ? soften(n.impact) : n.impact }));
      else if (n.notification && light && H.impact) quiet(H.impact({ style: soften(T.settings.light_notification_impact || 'LIGHT') }));
      else if (n.notification && H.notification) quiet(H.notification({ type: n.notification }));
      else if (n.selection && H.selectionStart) { quiet(H.selectionStart()); quiet(H.selectionChanged()); quiet(H.selectionEnd()); }
      else return false;
      return true;
    } catch (e) { return false; }
  }

  /* ---- 2. VIBRATE (Android) ---- */
  function patternOf(k, over, scale) {
    var v = over != null ? over : k.vibrate; if (v == null) return null;
    var a = Array.isArray(v) ? v.slice() : [v], lo = S('min_on_ms');
    for (var i = 0; i < a.length; i++) { var x = +a[i] || 0; a[i] = i % 2 === 0 && x > 0 ? Math.max(lo, Math.round(x * scale)) : Math.round(x); }
    return a;
  }
  function lengthOf(a) { var t = 0; if (a) for (var i = 0; i < a.length; i++) t += a[i]; return t; }
  function viaVibrate(pat) {
    var n = root.navigator; if (!pat || !n || typeof n.vibrate !== 'function') return false;
    try { return n.vibrate(pat.length === 1 ? pat[0] : pat) !== false; } catch (e) { return false; }
  }

  /* ---- 3. THE iPHONE SWITCH (iOS 18+ Safari, inside a touch) ---- */
  function iphone() {
    var n = root.navigator || {};
    if (typeof n.vibrate === 'function') return false;
    return /iP(hone|ad|od)/.test(n.userAgent || '') || (n.platform === 'MacIntel' && (n.maxTouchPoints | 0) > 1);
  }
  function inTouch() {
    var ua = root.navigator && root.navigator.userActivation;
    if (ua && typeof ua.isActive === 'boolean' && ua.isActive) return true;
    return now() - lastTouch < S('gesture_window_ms');
  }
  function flip() {
    if (!doc || !doc.head) return;
    var l = doc.createElement('label'), i = doc.createElement('input');
    i.type = 'checkbox'; i.setAttribute('switch', ''); i.tabIndex = -1;
    l.setAttribute('aria-hidden', 'true'); l.setAttribute('data-noui', ''); l.appendChild(i);
    l.addEventListener('click', function (e) { e.stopPropagation(); });
    doc.head.appendChild(l);
    try { l.click(); } catch (e) {} finally { try { doc.head.removeChild(l); } catch (e) {} }
  }
  function viaSwitch(k) {
    if (!iphone()) return false;
    if (!inTouch()) return 'no_touch';
    var n = Math.max(1, k.ios_ticks | 0), gap = S('ios_tick_gap_ms');
    flip(); for (var j = 1; j < n; j++) setTimeout(flip, j * gap);
    return true;
  }

  /* ---- 4. A CONTROLLER ---- */
  function viaPad(k, scale) {
    var spec = k.pad, n = root.navigator; if (!spec || !n || typeof n.getGamepads !== 'function') return false;
    var pads = null; try { pads = n.getGamepads(); } catch (e) { return false; }
    var dur = Math.round((+spec[0] || 0) * scale), strong = Math.min(1, (+spec[1] || 0) * scale), weak = Math.min(1, (+spec[2] || 0) * scale), any = false;
    if (!dur) return false;
    for (var i = 0; pads && i < pads.length; i++) {
      var g = pads[i]; if (!g || g.connected === false) continue;
      try {
        var a = g.vibrationActuator;
        if (a && typeof a.playEffect === 'function') { quiet(a.playEffect('dual-rumble', { startDelay: 0, duration: dur, strongMagnitude: strong, weakMagnitude: weak })); any = true; continue; }
        var h = g.hapticActuators && g.hapticActuators[0];
        if (h && typeof h.pulse === 'function') { quiet(h.pulse(Math.max(strong, weak), dur)); any = true; }
      } catch (e) {}
    }
    return any;
  }

  /* ---- THE ONE CALL ---- */
  function note(kind, from, via, why, pat) {
    var t = Math.round(now()), e = { t: t, kind: kind, from: from || 'game' };
    if (why) { e.drop = why; COUNT.dropped++; COUNT.dropWhy[why] = (COUNT.dropWhy[why] || 0) + 1; }
    else { e.via = via; e.ms = lengthOf(pat); COUNT.felt++; COUNT.byKind[kind] = (COUNT.byKind[kind] || 0) + 1;
      for (var i = 0; i < via.length; i++) COUNT.byVia[via[i]] = (COUNT.byVia[via[i]] || 0) + 1; }
    LOG.push(e); var keep = S('log_keep'); if (keep && LOG.length > keep) LOG.splice(0, LOG.length - keep);
    return !why && via.length > 0;
  }
  function play(kind, from, over) {
    COUNT.asked++;
    var k = T.kinds[kind];
    if (!k) return note(kind, from, null, READY ? 'unknown' : 'not_loaded');
    var p = prefs();
    if (!p.on) return note(kind, from, null, 'off');
    var t = now(), pri = +k.priority || 0;
    if (lastAt[kind] != null && t - lastAt[kind] < (+k.cooldown_ms || 0)) return note(kind, from, null, 'cooldown');
    if (t < busyUntil && pri <= busyPri) return note(kind, from, null, 'busy');
    var scale = scaleOf(p), pat = patternOf(k, over, scale), via = [];
    if (viaNative(k, kind, p)) via.push('native');
    else if (viaVibrate(pat)) via.push('vibrate');
    else { var s = viaSwitch(k); if (s === true) via.push('ios_switch'); else if (s) via.push(s); }
    if (viaPad(k, scale)) via.push('pad');
    lastAt[kind] = t; busyUntil = t + Math.max(lengthOf(pat), +k.hold_ms || 0) + S('min_gap_ms'); busyPri = pri;
    if (!via.length) via.push('none');
    return note(kind, from, via, null, pat);
  }
  function haptic(kind, from) { try { return play(String(kind || ''), from); } catch (e) { return false; } }
  function raw(pattern, from) {
    try {
      var a = Array.isArray(pattern) ? pattern : [pattern];
      if (!a.length || (a.length === 1 && !(+a[0]))) return true;    /* vibrate(0) / vibrate([]) is a cancel, felt as nothing */
      play('raw', from || 'frame', a); return true;
    } catch (e) { return false; }
  }
  function kindOfSound(ev, f) {
    var m = T.sounds[ev]; if (m == null) return null;
    if (typeof m === 'string') return m;
    for (var key in m) {
      if (!m.hasOwnProperty(key) || key.charAt(0) === '_') continue;
      var tb = m[key] || {}, v = f && f[key] != null ? String(f[key]) : null;
      return (v != null && tb.hasOwnProperty(v) ? tb[v] : tb['*']) || null;
    }
    return null;
  }
  function fromSound(ev, facts, from) {
    try { var k = kindOfSound(String(ev || ''), facts); return k ? play(k, from || 'sound:' + ev) : false; } catch (e) { return false; }
  }

  /* ---- THE SOUND CALL, WRAPPED FROM OUTSIDE (only the outermost call is felt) ---- */
  function heardAsMessage() {
    var e = root.event; return !!(e && e.type === 'message' && e.data && e.data.type === 'BOHEMIA_SFX');
  }
  function wrap(fn) {
    if (typeof fn !== 'function' || fn.__felt) return fn;
    var w = function (ev) {
      var outer = depth === 0; depth++;
      try { if (outer && !heardAsMessage()) fromSound(ev, null, 'sound:' + ev); } catch (e) {}
      try { return fn.apply(this, arguments); } finally { depth--; }
    };
    w.__felt = true; w.__inner = fn; return w;
  }
  try {
    var held = wrap(root.playSFX);
    Object.defineProperty(root, 'playSFX', { configurable: true, enumerable: true,
      get: function () { return held; }, set: function (f) { held = wrap(f); } });
  } catch (e) {}

  /* ---- EVERY FRAME OF OURS ---- */
  function touched() { lastTouch = now(); }
  function heard(win) {
    return function (e) {
      var d = e && e.data; if (!d || typeof d !== 'object') return;
      if (win !== root && e.source === win) return;                 /* a frame talking to itself */
      if (d.type === 'BOHEMIA_SFX') fromSound(d.ev, d, 'msg:' + d.ev);
      else if (d.type === 'BOHEMIA_HAPTIC') haptic(d.kind, 'msg');
    };
  }
  function adopt(win) {
    try {
      if (!win || win === root || win.__bohFelt) return;
      var d = win.document; if (!d) return;
      win.__bohFelt = true;
      win.haptic = haptic; win.BOH_HAPTICS = API;
      var nav = win.navigator;
      if (nav && typeof nav.vibrate === 'function') {
        try { Object.defineProperty(nav, 'vibrate', { configurable: true, writable: true, value: function (p) { return raw(p, 'frame'); } }); } catch (e) {}
      }
      d.addEventListener('pointerdown', touched, true); d.addEventListener('touchstart', touched, true);
      d.addEventListener('load', loaded, true);
      win.addEventListener('message', heard(win));
      scan(d);
    } catch (e) {}                                                    /* cross-origin: not ours, silent */
  }
  function scan(d) { try { var fs = d.querySelectorAll('iframe'); for (var i = 0; i < fs.length; i++) adopt(fs[i].contentWindow); } catch (e) {} }
  function loaded(e) { var t = e && e.target; if (t && t.tagName === 'IFRAME') adopt(t.contentWindow); }

  /* ---- THE ROW ON THE GEAR'S CARD (after MOTION) ---- */
  function el(id) { return doc ? doc.getElementById(id) : null; }
  function stepWord(p) {
    var s = (T.setting && T.setting.steps) || [], id = p.on ? p.strength : 'off';
    for (var i = 0; i < s.length; i++) if (s[i][0] === id) return s[i][1];
    return id.toUpperCase();
  }
  function paint() { var b = el('sethap'); if (b) b.textContent = stepWord(prefs()); }
  function row() {
    if (!doc || !T.setting || el('sethap')) return;
    var card = el('setcard'); if (!card) return;
    var r = doc.createElement('div'); r.className = 'setrow';
    var l = doc.createElement('span'); l.className = 'setlab'; l.textContent = T.setting.label || '';
    var b = doc.createElement('div'); b.id = 'sethap'; b.className = 'setbtn'; b.setAttribute('role', 'button'); b.setAttribute('tabindex', '0');
    b.setAttribute('aria-label', T.setting.aria || T.setting.label || '');
    b.addEventListener('click', function () {
      var s = T.setting.steps || [], p = prefs(), id = p.on ? p.strength : 'off', i = 0;
      for (var j = 0; j < s.length; j++) if (s[j][0] === id) i = j;
      var next = (s[(i + 1) % s.length] || ['off'])[0];
      setPrefs(next !== 'off', next !== 'off' ? next : undefined);
      if (next !== 'off') haptic(T.setting.preview || 'tap', 'settings');      /* inside the tap, so the iPhone feels it too */
    });
    r.appendChild(l); r.appendChild(b);
    var mo = el('setmotion'), at = mo && mo.parentNode;
    if (at && at.parentNode === card) card.insertBefore(r, at.nextSibling); else card.appendChild(r);
    paint();
  }

  /* ---- THE TABLE ---- */
  function load(t) {
    if (!t || typeof t !== 'object') return false;
    T = { settings: t.settings || {}, kinds: t.kinds || {}, sounds: t.sounds || {}, setting: t.setting || null };
    READY = true; row(); paint(); return true;
  }
  function here() {
    try { var s = doc && doc.currentScript && doc.currentScript.src; if (s) return new URL(T_PATH, s).href; } catch (e) {}
    return null;
  }
  var T_PATH = '../records/target/bb/haptics.json', T_URL = here();
  function fetchTable() {
    if (root.BOH_HAPTICS_TABLE) { load(root.BOH_HAPTICS_TABLE); return; }   /* a mod, or the app's bundle, hands its own */
    try { if (!root.fetch || !T_URL) return; root.fetch(T_URL).then(function (r) { return r.json(); }).then(load).catch(function () {}); } catch (e) {}
  }

  function backends() {
    var n = root.navigator || {}, pads = 0;
    try { var g = n.getGamepads ? n.getGamepads() : []; for (var i = 0; g && i < g.length; i++) if (g[i] && (g[i].vibrationActuator || (g[i].hapticActuators && g[i].hapticActuators.length))) pads++; } catch (e) {}
    return { native: !!(NATIVE || capacitor()), vibrate: typeof n.vibrate === 'function', ios_switch: iphone(), pads: pads, table: READY };
  }

  var API = {
    haptic: haptic, fromSound: fromSound, kindOfSound: function (ev, f) { return kindOfSound(ev, f); }, raw: raw,
    prefs: prefs, set: setPrefs, load: load, backends: backends, adopt: adopt,
    setNative: function (fn) { NATIVE = typeof fn === 'function' ? fn : null; },
    table: function () { return T; }, log: LOG, count: COUNT
  };
  root.BOH_HAPTICS = API;
  root.haptic = haptic;

  if (doc) {
    doc.addEventListener('pointerdown', touched, true); doc.addEventListener('touchstart', touched, true);
    doc.addEventListener('load', loaded, true);
    root.addEventListener('message', heard(root));
    var boot = function () {
      scan(doc); row();
      var g = el('gearbtn'); if (g && !g.__felt) { g.__felt = true; g.addEventListener('click', function () { setTimeout(function () { row(); paint(); }, 0); }); }
    };
    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot); else boot();
  }
  fetchTable();
})(typeof window !== 'undefined' ? window : null);
if (typeof module !== 'undefined' && module.exports) module.exports = (typeof window !== 'undefined' && window.BOH_HAPTICS) || null;
