#!/usr/bin/env node
/* ============================================================================
   YOU FEEL IT (FEEL 11/2/26, [haptic feedback], rule 309, ask line 302)

   Paolo, passing on a playtester: "make sure it gives haptic feedback, that's super
   important... controllers, or vibrating on their phone... make sure there's code for it."
   engine/bohemia_haptics.js is the one call; records/target/bb/haptics.json is every buzz.

   WHAT MAKES IT RED, each leg a way the feel could be lost:
     W  WIRED: the alpha and the demo load the module; the fight's recap says won, lost or withdrew.
     T  THE TABLE: it parses; every kind has its reason and something that plays it; every sound
        it maps is a real sound and points at a real kind; the setting row is FULL / LIGHT / OFF.
     S  SPARSE: no footstep, shot, swing, miss, music or room is ever felt; no pulse longer than
        150 ms and no pattern longer than 600 ms (a constant buzz is the defect the guidelines name).
     N  NO FELT NUMBER IN THE CODE: the module's code (comments stripped) holds no number over two;
        every length, strength and gap is the table's.
     B  THE BEHAVIOUR, run on the module itself in a fake window (no browser):
        the sound call wrapped from outside is felt ONCE through two layers of wrapping; a sound
        that is not in the table is not felt; a fight message is felt with its facts (his man
        dead is man_lost, theirs is kill) and the playSFX it causes is not felt twice; the
        cooldown drops a second hit inside it; BUZZ OFF reaches no hardware, the old raw calls
        included; LIGHT halves the pattern; a controller rumbles; an iPhone (no vibrate) ticks
        the switch only inside a touch; the app wrapper's native haptics win over vibrate.
     P  THE PROOF ON DISK: records/target/FEEL_HAPTICS_PROBE.json (tools/bohemia_feel_haptics_probe.js
        on the demo): the fight felt, never more than one a second, BUZZ OFF silent.
   PLANTED (run with --plant): a footstep mapped, a felt number in the code, the OFF switch broken;
   each must turn its leg red.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.join(__dirname, '..');
const rd = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
let pass = 0, fail = 0;
function ok(name, cond, why) { if (cond) { pass++; console.log('  ok   ' + name); } else { fail++; console.log('  FAIL ' + name + (why ? '  -- ' + why : '')); } }

function check(SRC, TABLE, plantLabel) {
  const before = fail;
  /* ---- W ---- */
  if (!plantLabel) {
    const alpha = rd('slices/BOHEMIA_ALPHA_0_9.html'), demo = rd('slices/BOHEMIA_DEMO.html'), fight = rd('slices/BOHEMIA_FIGHT.html');
    ok('W1 the alpha loads the one call', /<script src="\.\.\/engine\/bohemia_haptics\.js"><\/script>/.test(alpha));
    ok('W2 the demo (cut from the alpha) loads it too', /<script src="\.\.\/engine\/bohemia_haptics\.js"><\/script>/.test(demo));
    ok('W3 the fight\'s recap tells the hand won, lost or withdrew', /sfx\('clear', \{ result: result \}\)/.test(fight));
  }
  /* ---- T ---- */
  let T = null; try { T = JSON.parse(TABLE); } catch (e) { T = null; }
  ok('T1 the table parses', !!T);
  if (!T) return fail - before;
  const kinds = T.kinds || {}, sounds = T.sounds || {};
  const S = require(path.join(ROOT, 'engine/bohemia_sfx.js'));
  const real = new Set(S.EVENTS.map(e => e.ev).concat(['clear', 'wipe', 'bar_glass']));
  const badKind = Object.keys(kinds).filter(k => !kinds[k].why || !(kinds[k].vibrate != null || kinds[k].native || kinds[k].pad || kinds[k].ios_ticks));
  ok('T2 every kind has its reason and something that plays it', Object.keys(kinds).length >= 10 && !badKind.length, badKind.join(', '));
  const targets = [];
  Object.keys(sounds).filter(s => s.charAt(0) !== '_').forEach(s => { const m = sounds[s];
    if (typeof m === 'string') targets.push([s, m]); else Object.keys(m).forEach(f => Object.keys(m[f]).forEach(v => targets.push([s, m[f][v]]))); });
  const strangers = targets.filter(t => !real.has(t[0])).map(t => t[0]), lost = targets.filter(t => !kinds[t[1]]).map(t => t[0] + '->' + t[1]);
  ok('T3 every sound the table maps is a real sound of the game', !strangers.length, strangers.join(', '));
  ok('T4 every mapping points at a kind the table has', !lost.length, lost.join(', '));
  const st = T.setting || {}, ids = (st.steps || []).map(s => s[0]).join(',');
  ok('T5 the setting is one row, FULL / LIGHT / OFF, on by default', st.label && ids === 'full,light,off' && T.settings && T.settings.default_on === true);
  /* ---- S ---- */
  const never = Object.keys(sounds).filter(s => /^(step_|walk_|sand_|wood_|tread_|boots_|air_|wind_|neon_|generator|dog_|shot|miss|swing|casing|brass|music|heartbeat|breath|xp_lands)/.test(s));
  ok('S1 no footstep, shot, swing, miss, room or music is ever felt', !never.length, never.join(', '));
  const long = Object.keys(kinds).filter(k => { const v = kinds[k].vibrate; if (v == null) return false; const a = [].concat(v);
    return a.some((x, i) => i % 2 === 0 && x > 150) || a.reduce((s, x) => s + x, 0) > 600; });
  ok('S2 no pulse over 150 ms, no pattern over 600 ms (never a constant buzz)', !long.length, long.join(', '));
  /* ---- N ---- */
  const code = SRC.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"])\/\/.*$/gm, '$1').replace(/'[^'\n]*'/g, "''");
  const nums = (code.match(/(?<![\w.$])\d+(\.\d+)?(?![\w])/g) || []).filter(n => +n > 2);
  ok('N1 the module\'s code holds no felt number (every length and gap is the table\'s)', !nums.length, nums.slice(0, 8).join(', '));
  /* ---- B ---- */
  const B = behave(SRC, T);
  Object.keys(B).forEach(k => ok(k, B[k] === true, B[k] === true ? '' : String(B[k])));
  return fail - before;
}

/* the module, in a fake window with a phone's motor, a pad and (for the iPhone leg) no motor at all */
function world(SRC, T, o) {
  o = o || {};
  const hw = { vib: [], pad: [], flips: 0, native: [] }, L = {}, store = {};
  const el = () => ({ setAttribute() {}, appendChild() {}, addEventListener() {}, click() { hw.flips++; }, style: {}, tabIndex: 0 });
  const doc = { readyState: 'complete', currentScript: null, head: { appendChild() {}, removeChild() {} },
    addEventListener() {}, getElementById() { return null; }, querySelectorAll() { return []; }, createElement: el };
  const nav = { userAgent: o.iphone ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)' : 'Mozilla/5.0 (Linux; Android 14)',
    platform: o.iphone ? 'iPhone' : 'Linux', maxTouchPoints: 5, userActivation: { isActive: !!o.touch },
    getGamepads: () => [{ connected: true, vibrationActuator: { playEffect: (t, e) => { hw.pad.push([t, e]); return Promise.resolve(); } } }] };
  if (!o.iphone) nav.vibrate = (p) => { hw.vib.push(p); return true; };
  let clock = 1000;
  const win = { document: doc, navigator: nav, performance: { now: () => clock },
    localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } },
    addEventListener: (t, f) => { (L[t] = L[t] || []).push(f); }, setTimeout: (f) => { f(); return 0; }, BOH_HAPTICS_TABLE: T, event: undefined };
  if (o.capacitor) win.Capacitor = { isNativePlatform: () => true, Plugins: { Haptics: {
    impact: (x) => { hw.native.push(['impact', x.style]); return Promise.resolve(); }, notification: (x) => { hw.native.push(['notification', x.type]); return Promise.resolve(); },
    selectionStart: () => Promise.resolve(), selectionChanged: () => { hw.native.push(['selection']); return Promise.resolve(); }, selectionEnd: () => Promise.resolve() } } };
  win.window = win;
  const ctx = vm.createContext({ window: win, URL, JSON, Math, Date, Object, Array, String, Infinity, Promise, setTimeout: win.setTimeout, module: undefined });
  vm.runInContext(SRC, ctx);
  return { win, hw, L, tick: (ms) => { clock += ms; }, H: win.BOH_HAPTICS };
}
function behave(SRC, T) {
  const out = {};
  try {
    /* the sound call: wrapped from outside, through a second layer, felt once */
    let w = world(SRC, T), heard = 0;
    w.win.playSFX = function (ev) { heard++; return ev; };
    const inner = w.win.playSFX; w.win.playSFX = function (ev) { return inner(ev); };
    w.win.playSFX('ui_tap');
    out['B1 a tap through the game\'s sound call is felt once through two wraps, and the sound still plays'] = (w.hw.vib.length === 1 && heard === 1) || ('felt ' + w.hw.vib.length + ', heard ' + heard);
    w.tick(5000); w.win.playSFX('step_dirt');
    out['B2 a footstep is heard and not felt'] = w.hw.vib.length === 1 || ('felt ' + w.hw.vib.length);
    /* the fight's message: felt with its facts; the playSFX it causes not felt twice */
    w = world(SRC, T); w.win.playSFX = function () { return null; };
    const msg = (d) => { const e = { type: 'message', data: d, source: {} }; w.win.event = e; (w.L.message || []).forEach(f => f(e)); w.win.playSFX(d.ev); w.win.event = undefined; };
    msg({ type: 'BOHEMIA_SFX', ev: 'kill', side: 'you' });
    const k1 = w.H.log.filter(e => !e.drop).map(e => e.kind);
    w.tick(5000); msg({ type: 'BOHEMIA_SFX', ev: 'kill', side: 'them' });
    const k2 = w.H.log.filter(e => !e.drop).map(e => e.kind);
    out['B3 the fight\'s message is felt with its facts: his man dead is man_lost, theirs is kill, never twice'] =
      (k1.join() === 'man_lost' && k2.join() === 'man_lost,kill' && w.hw.vib.length === 2) || (k2.join() + ' / vib ' + w.hw.vib.length);
    w.tick(5000); msg({ type: 'BOHEMIA_SFX', ev: 'clear', result: 'won' }); w.tick(5000); msg({ type: 'BOHEMIA_SFX', ev: 'clear', result: 'lost' });
    const k3 = w.H.log.filter(e => !e.drop).map(e => e.kind).slice(-2).join();
    out['B4 the recap is felt as won or lost'] = k3 === 'won,lost' || k3;
    /* the cooldown */
    w = world(SRC, T); w.H.haptic('hit'); w.tick(1); w.H.haptic('hit');
    out['B5 a second hit inside the cooldown is dropped'] = (w.hw.vib.length === 1 && w.H.log[1].drop === 'cooldown') || JSON.stringify(w.H.log);
    /* the setting */
    w = world(SRC, T); w.H.set(false); w.H.haptic('man_lost'); w.H.raw([40, 20, 40]); w.H.fromSound('ui_tap');
    out['B6 BUZZ OFF reaches no motor and no pad, the old raw calls included'] = (w.hw.vib.length === 0 && w.hw.pad.length === 0) || ('vib ' + w.hw.vib.length + ' pad ' + w.hw.pad.length);
    w.H.set(true, 'light'); w.H.haptic('struck_down');
    const full = [].concat(T.kinds.struck_down.vibrate), got = w.hw.vib[0] || [];
    out['B7 LIGHT plays every pulse at the table\'s light scale'] = (got.length === full.length && got[0] === Math.max(T.settings.min_on_ms, Math.round(full[0] * T.settings.light_scale))) || JSON.stringify(got);
    out['B8 a controller rumbles with the phone'] = (w.hw.pad.length === 1 && w.hw.pad[0][0] === 'dual-rumble') || JSON.stringify(w.hw.pad);
    /* the iPhone: no motor; the switch only inside a touch */
    w = world(SRC, T, { iphone: true, touch: false }); w.H.haptic('kill');
    const noTouch = w.hw.flips === 0 && (w.H.log[0].via || []).indexOf('no_touch') >= 0;
    w = world(SRC, T, { iphone: true, touch: true }); w.H.haptic('kill');
    out['B9 an iPhone ticks the switch only inside a touch, a heavier kind as more ticks'] = (noTouch && w.hw.flips === (T.kinds.kill.ios_ticks | 0)) || ('noTouch ' + noTouch + ' flips ' + w.hw.flips);
    /* the app wrapper */
    w = world(SRC, T, { capacitor: true }); w.H.haptic('won'); w.tick(5000); w.H.haptic('hit');
    out['B10 the app\'s native haptics win over vibrate (notification and impact)'] =
      (w.hw.vib.length === 0 && w.hw.native[0][1] === T.kinds.won.native.notification && w.hw.native[1][1] === T.kinds.hit.native.impact) || JSON.stringify(w.hw.native);
  } catch (e) { out['B0 the module runs in a window'] = e.message; }
  return out;
}

const SRC = rd('engine/bohemia_haptics.js'), TABLE = rd('records/target/bb/haptics.json');
console.log('=== YOU FEEL IT ===');
check(SRC, TABLE);
/* ---- P ---- */
const PJ = path.join(ROOT, 'records/target/FEEL_HAPTICS_PROBE.json');
let P = null; try { P = JSON.parse(fs.readFileSync(PJ, 'utf8')); } catch (e) { P = null; }
const fightP = P && (P.phases || []).filter(x => /fight/.test(x.phase))[0];
ok('P1 the probe ran on the demo and the fight was felt', !!(fightP && fightP.felt > 0 && P.fight && P.fight.over), P ? JSON.stringify(fightP) : 'no ' + PJ);
ok('P2 never more than one a second in the fight (sparse is the point)', !!(fightP && fightP.per_minute <= 60), fightP ? fightP.per_minute + ' a minute' : '');
ok('P3 on the demo BUZZ OFF reached no motor', !!(P && P.setting && P.setting.off_silent === true));

if (process.argv.includes('--plant')) {
  console.log('--- PLANTED (each must go red) ---');
  const base = fail, basePass = pass;
  const t1 = JSON.parse(TABLE); t1.sounds.step_dirt = 'tap';
  const r1 = check(SRC, JSON.stringify(t1), 'footstep'); console.log('  plant: a footstep mapped -> ' + r1 + ' red');
  const r2 = check(SRC.replace("var KEY = 'boh.haptics';", "var KEY = 'boh.haptics', HOLD = 250;"), TABLE, 'number'); console.log('  plant: a felt number in the code -> ' + r2 + ' red');
  const r3 = check(SRC.replace('if (!p.on) return note(kind, from, null, \'off\');', ''), TABLE, 'off'); console.log('  plant: OFF ignored -> ' + r3 + ' red');
  const caught = [r1, r2, r3].every(n => n > 0);
  fail = base; pass = basePass;   /* the plants' reds are expected; only whether each bit counts */
  ok('PLANTS every planted defect turned its leg red', caught);
}
console.log('=== YOU FEEL IT: ' + pass + ' pass / ' + fail + ' fail ===');
process.exit(fail ? 1 : 0);
