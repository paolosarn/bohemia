#!/usr/bin/env node
/* ONE BEAT FOR EVERYTHING (SOUNDS, 10/26/26, row [one beat for everything], rule 221(b)(c)).

   PAOLO 10/26: 'when does the music get implemented in the combat? I'm tired of not everything being on the same BPM, not
   sounding good.' EYES (line 47): AUTO's hits, swings and shots landed about 100 ms after the song's quarter beats.

   THE GRID IS THE TRANSPORT'S SIXTEENTH ON THE AUDIO CLOCK (the step the song books every note on; THE ONE BEAT stamps its
   beats where they are heard). 221(c) says 'a beat or its eighth': the fight's own grid is a beat over a power of two
   (158(b): his hand 1x on the beat, their turns 2x on the eighth, AUTO's finish 4x on the sixteenth), so the sixteenth is the
   finest grid any action may use; the share on beats and eighths is printed.
   LEGS
     1  THE GAME CARRIES IT: the alpha and the demo carry the block and the one-shot players' four routes
   on the demo, the phone profile (CPU 4x slower) and the computer:
     2  ON THE MAP: every effect asked for on the map (the shell's own playSFX, a tap's tick: eight asked at random moments,
        and whatever the map plays) starts on a sixteenth of the song (within 20 ms), on the audio clock
     3  THE FIGHT BY HAND: his first move asked through the call a tap makes; every effect it makes on the grid
     4  THE FIGHT ON AUTO: every effect of the rest of the fight on the grid, his men's and theirs (at least twenty)
     5  AS HEARD: the effects bus itself, in 2.5 ms frames on the audio clock (the clock the speaker plays, so the device's
        output delay is the same for the music and the effects), its loudness folded on the sixteenth from the song's grid:
        the steepest rise within 20 ms of the grid; the music bus read the same way for the song's own beat; the output
        delay the device reports printed
     6  nothing threw
   node gates/one_beat_for_everything_gate.js [--computer-only|--phone-only] */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const SL = path.join(ROOT, 'slices');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const TOL = 20;

for (const f of ['BOHEMIA_ALPHA_0_9.html', 'BOHEMIA_DEMO.html']) {
  const s = fs.readFileSync(path.join(SL, f), 'utf8');
  const routes = (s.match(/\/\* __ONE_BEAT_FOR_EVERYTHING__ 10\/26 \*\//g) || []).length;
  leg(s.includes('<!-- /__ONE_BEAT_FOR_EVERYTHING__ -->') && routes === 4, f + ': *** THE ONE CLOCK IS IN THE GAME ***, the block and the four one-shot players routed', routes + ' routes');
}

const ARM = `(function(){
  if (/BOHEMIA_FIGHT/.test(location.href)) { let fo;
    Object.defineProperty(window, 'FIGHT_OPTS', { configurable: true, get: function () { return fo; }, set: function (v) { fo = v ? Object.assign({}, v, { seed: 7 }) : v; } });
    return; }
})();`;
/* in the page: the effects bus and the music bus, folded on the sixteenth from the song's grid, ON THE AUDIO CLOCK ITSELF: an
   AudioWorklet reads each 128-sample block at its own currentTime (exact: a ScriptProcessor's input lags its playbackTime by
   its two buffers, about 93 ms, which reads as a false -30 ms) */
const EARS = `(async function(){
  const ac = MUS.AC, E = window.__EARS = { on: false, taps: {} };
  const code = "class T extends AudioWorkletProcessor{constructor(){super();this.g0=null;this.on=false;this.s=new Float64Array(50);this.c=new Float64Array(50);this.a=0;this.n=0;this.t=0;this.fr=Math.max(1,Math.round(sampleRate*0.0025));"
    + "this.port.onmessage=e=>{const m=e.data;if(m.g0!=null)this.g0=m.g0;if(m.on!=null)this.on=m.on;if(m.read)this.port.postMessage({s:Array.from(this.s),c:Array.from(this.c)});};}"
    + "process(i){const a=i[0]&&i[0][0];if(!a||!this.on||this.g0==null)return true;for(let k=0;k<a.length;k++){if(this.n===0)this.t=currentTime+k/sampleRate;this.a+=Math.abs(a[k]);"
    + "if(++this.n===this.fr){const ph=((this.t-this.g0)%0.125+0.125)%0.125,j=Math.floor(ph/0.0025)%50;this.s[j]+=this.a/this.fr;this.c[j]++;this.a=0;this.n=0;}}return true;}}registerProcessor('one-beat-tap',T);";
  await ac.audioWorklet.addModule(URL.createObjectURL(new Blob([code], { type: 'application/javascript' })));
  const tap = (src, key) => { if (!src) return; const n = new AudioWorkletNode(ac, 'one-beat-tap', { numberOfInputs: 1, numberOfOutputs: 1, outputChannelCount: [1] }), z = ac.createGain();
    z.gain.value = 0; src.connect(n); n.connect(z); z.connect(ac.destination); E.taps[key] = n; };
  tap(window.__SFXBUS, 'fx'); tap(window.__FIGHTLIFT || window.__MUSVOL, 'mus');
  const anchor = () => { const g = BOHEMIA_BEAT.grid(ac.currentTime); if (g != null) for (const k in E.taps) E.taps[k].port.postMessage({ g0: g }); };
  anchor(); setInterval(anchor, 250);
  E.start = () => { for (const k in E.taps) E.taps[k].port.postMessage({ on: true }); };
  E.read = key => new Promise(res => { const n = E.taps[key]; if (!n) return res(null);
    n.port.onmessage = ev => { const S = ev.data, B = 50, avg = []; let mean = 0; for (let i = 0; i < B; i++) { avg[i] = S.c[i] ? S.s[i] / S.c[i] : 0; mean += avg[i] / B; }
      let best = 0, rb = -1; for (let i = 0; i < B; i++) { const r = avg[i] - avg[(i + B - 1) % B]; if (r > rb) { rb = r; best = i; } }
      let ms = best * 2.5; if (ms > 62.5) ms -= 125; res({ ms: ms, rise: +(rb / (mean || 1)).toFixed(2), frames: S.c.reduce((x, y) => x + y, 0) }); };
    n.port.postMessage({ read: true }); });
})()`;
/* how far an effect's audio start sits from the nearest sixteenth, and whether that sixteenth is a beat or an eighth */
const OFF = `if (!window.__ONEBEAT) window.__ONEBEAT = { log: [], state: function () { return { before: 'no one clock in this build' }; } };
if (!BOHEMIA_BEAT.grid) BOHEMIA_BEAT.grid = function (t) { const b = __beatNext(t), s = MUS.stepDur(); return b - Math.floor((b - t) / s + 1e-9) * s; };
window.__offOf = function (T) { const g = BOHEMIA_BEAT.grid(T - 0.0625); if (g == null) return null;
  const b = window.__beatNext ? __beatNext(g - 1e-4) : null, k = b == null ? null : Math.round((b - g) / 0.125) % 4;
  return { ms: (T - g) * 1000, beat: k === 0, eighth: k === 0 || k === 2 }; };`;

function judge(profile, name, entries, min) {
  const bad = entries.filter(e => !e.off || Math.abs(e.off.ms) > TOL), free = entries.filter(e => e.why === 'free');
  const by = {}; entries.forEach(e => { by[e.why] = (by[e.why] || 0) + 1; });
  const worst = entries.reduce((m, e) => Math.max(m, e.off ? Math.abs(e.off.ms) : 1e9), 0);
  const beats = entries.filter(e => e.off && e.off.beat).length, eighths = entries.filter(e => e.off && e.off.eighth).length;
  const evs = {}; entries.forEach(e => { evs[e.ev] = (evs[e.ev] || 0) + 1; });
  leg(entries.length >= min && !bad.length && !free.length, profile + ': *** ' + name + ' *** every effect starts on a sixteenth of the song (within ' + TOL + ' ms), on the audio clock',
    entries.length + ' effects (' + Object.keys(by).map(k => by[k] + ' ' + k).join(', ') + '), the worst ' + worst.toFixed(1) + ' ms off; on a beat ' + beats + ', on an eighth ' + eighths
      + '; ' + Object.keys(evs).slice(0, 10).map(k => k + ' ' + evs[k]).join(', ') + (bad.length ? '; OFF: ' + bad.slice(0, 4).map(e => e.ev + ' ' + (e.off ? e.off.ms.toFixed(1) : '?') + ' ms (' + e.why + ')').join(', ') : ''));
}

async function live(profile, throttle) {
  const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
  console.log('-- ' + profile + (throttle > 1 ? ', CPU ' + throttle + 'x slower' : ''));
  let d; const errs = [];
  try { d = await drive.open({ keepCards: true, profile, throttle, arm: ARM, beforeTap: async (pg) => { await throughTheTitle(pg); } }); }
  catch (e) { leg(false, profile + ': the demo boots', String(e.message).slice(0, 160)); return; }
  const p = d.page; p.on('pageerror', e => errs.push(String(e)));
  try {
    await p.waitForFunction(() => typeof MUS !== 'undefined' && MUS.playing && MUS.AC && MUS.AC.state === 'running' && window.__beatNext, null, { timeout: 90000 });
    await p.waitForTimeout(3000);
    await p.evaluate(OFF); await p.evaluate(EARS);
    /* the map: eight taps' ticks at random moments, through the shell's own entry point, and whatever the map plays */
    const m0 = await p.evaluate(() => __ONEBEAT.log.length);
    const tick = await p.evaluate(() => { const a = Object.keys(window.__SFX_APPROVED || {}); return ['ui_tick', 'ui_tap', 'ui_click', 'tab_tap', 'menu_tick'].find(x => a.includes(x)) || a.find(x => /^ui_/.test(x)) || a[0] || null; });
    for (let i = 0; i < 8; i++) { await p.waitForTimeout(300 + Math.floor(Math.random() * 700)); await p.evaluate(ev => window.playSFX(ev), tick); }
    await p.waitForTimeout(1500);
    const mapE = await p.evaluate(n => __ONEBEAT.log.slice(n).map(e => Object.assign({}, e, { off: __offOf(e.T) })), m0);
    judge(profile, 'ON THE MAP', mapE, 8);
    /* the fight */
    await d.fr.evaluate(() => { roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 7 }); });
    let f = null;
    for (let i = 0; i < 400 && !f; i++) { const h = await p.$('#fightFrame'); if (h) { const c = await h.contentFrame();
      if (c && await c.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board && !!FIGHT.S.board).catch(() => false)) f = c; } if (!f) await p.waitForTimeout(150); }
    if (!f) throw new Error('the road fight never came up');
    await f.waitForFunction(() => performance.now() > FIGHT_UI.openUntil, null, { timeout: 30000 }).catch(() => {});
    await p.evaluate(() => { window.__EARS.start(); });
    /* by hand: his first three moves through the calls his taps make: a blow (the second tap on one of theirs in reach,
       FIGHT.strike) where one is in reach, else a walk (walkKept) */
    const h0 = await p.evaluate(() => __ONEBEAT.log.length);
    const hand = { blows: 0, walks: 0 };
    for (let turn = 0; turn < 3; turn++) {
      let st = 'busy';
      for (let i = 0; i < 300; i++) { st = await f.evaluate(() => { const u = FIGHT.current(); if (FIGHT.S.deploy) { try { fightNow(); } catch (_e) {} return 'deploy'; }
        return FIGHT.S.over ? 'over' : u && crewControlled(u) && !FIGHT_UI.anim.length ? 'mine' : 'busy'; }).catch(() => 'busy');
        if (st === 'mine' || st === 'over') break; await p.waitForTimeout(100); }
      if (st !== 'mine') break;
      const did = await f.evaluate(() => { const u = FIGHT.current(), S = FIGHT.S;
        const t = S.units.filter(v => v.side === 'them' && FIGHT.onField(v) && FIGHT.sideSees('you', v) && FIGHT.canStrike(u, v))[0];
        if (t) { FIGHT.strike(u, t); take(); return 'blow'; }
        const to = [[1, 0], [-1, 0], [0, 1], [0, -1], [2, 0], [-2, 0]].map(v => ({ x: u.x + v[0], y: u.y + v[1] })).filter(q => q.x >= 0 && q.y >= 0 && q.x < S.w && q.y < S.h);
        for (const q of to) { if (walkKept(u, q.x, q.y)) { take(); return 'walk'; } }
        return null; }).catch(() => null);
      if (did === 'blow') hand.blows++; else if (did === 'walk') hand.walks++;
      await f.waitForFunction(() => !FIGHT_UI.anim.length, null, { timeout: 10000 }).catch(() => {});
      await p.waitForTimeout(400);
    }
    await p.waitForTimeout(1200);
    const h1 = await p.evaluate(() => __ONEBEAT.log.length);
    const handE = await p.evaluate(a => __ONEBEAT.log.slice(a[0], a[1]).map(e => Object.assign({}, e, { off: __offOf(e.T) })), [h0, h1]);
    judge(profile, 'THE FIGHT BY HAND (' + hand.blows + ' blows, ' + hand.walks + ' walks)', handE, hand.blows ? 1 : 0);
    await f.evaluate(() => { FIGHT_UI.auto = true; });
    let over = false;
    for (let i = 0; i < 700 && !over; i++) { over = await f.evaluate(() => !!FIGHT.S.over && !FIGHT_UI.anim.length).catch(() => true); if (!over) await p.waitForTimeout(500); }
    await p.waitForTimeout(1500);
    const R = await p.evaluate(async a => ({ e: __ONEBEAT.log.slice(a).map(e => Object.assign({}, e, { off: __offOf(e.T) })), fx: await __EARS.read('fx'), mus: await __EARS.read('mus'),
      lat: { out: +((MUS.AC.outputLatency || 0) * 1000).toFixed(1), base: +((MUS.AC.baseLatency || 0) * 1000).toFixed(1) }, st: __ONEBEAT.state() }), h1);
    if (!over) console.log('  (the fight did not end inside six minutes; what it played is judged)');
    judge(profile, 'THE FIGHT ON AUTO', R.e, 20);
    leg(R.fx && R.fx.frames > 2000 && Math.abs(R.fx.ms) <= TOL && R.mus && Math.abs(R.mus.ms) <= TOL,
      profile + ': *** AS HEARD *** the effects come out of the speaker on the song\'s sixteenths, the song on its own (the same output delay for both)',
      'effects ' + (R.fx ? R.fx.ms + ' ms off (rise ' + R.fx.rise + ', ' + R.fx.frames + ' frames)' : '-') + '; the song ' + (R.mus ? R.mus.ms + ' ms off (rise ' + R.mus.rise + ')' : '-')
        + '; the device\'s output delay ' + R.lat.out + ' ms + ' + R.lat.base + ' ms; ' + JSON.stringify(R.st));
  } catch (e) { leg(false, profile + ': the demo and the fight played', String(e.message).slice(0, 200)); }
  leg(!errs.length, profile + ': nothing threw', errs.slice(0, 2).join(' | ').slice(0, 200));
  await d.close();
}

(async () => {
  const a = process.argv.slice(2);
  if (!a.includes('--computer-only')) await live('phone_portrait', 4);
  if (!a.includes('--phone-only')) await live('computer', 1);
  console.log('ONE BEAT FOR EVERYTHING: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
