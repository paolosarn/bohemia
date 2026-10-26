#!/usr/bin/env node
/* THE SOUND NEVER CHOPS, EVEN ON BLUETOOTH (SOUNDS, 10/26/26, row [the sound never chops], rule 175(b)(d); with 221).

   PAOLO 10/25: 'every time I play the game on my car speakers through Bluetooth it gets all choppy... could you support and
   fix that'. Measured then: the music synthesized live (783 createOscillator calls), the smallest buffer, a second context in
   the fight, a phone stalling near its memory line. Part one (10/25, THE FIGHTS MUSIC YOU CAN HEAR): one context, the
   'playback' buffer, a stall no longer restarts the song. THIS GATE IS PART TWO, 175(b): THE MUSIC RENDERED AHEAD, the
   thirteen songs played from their recordings in the audio thread (__THE_SONGS_GO_IN__), so a stalled phone books nothing
   and the music plays on, and the audio thread renders a few buffers instead of hundreds of oscillators.
   LEGS, the demo, the phone profile with the CPU four times slower and the computer:
     1  RENDERED AHEAD: once the first recording is in, every step of the map and the fight plays from a recording (the live
        engine's fallback steps do not grow), the fight's levels ready before its first turn
     2  THE AUDIO THREAD IS LIGHT: the oscillators and buffer sources the game's context makes a second, on the map and in the
        fight (effects included), against the same game with the live engine (printed with --live)
     3  A STALL CHANGES NOTHING: the main thread held for 1.5 s in the middle of the fight (a phone's worst moment): the music,
        read in the audio thread itself (an AudioWorklet, 10 ms windows), never drops 20 dB under its level before the stall,
        THE RECORDING PLAYS STRAIGHT THROUGH IT (the source sounding when the stall began still sounding when it ends; the
        song's own bus read window by window against the recording at the same place: heard / the recording's own loudness is
        the bus gain, a constant, and no more than one window in twenty is off it by a quarter), and the song never jumps
        after it; with --live the beat's onsets in the stall are printed
        against as long before (the live engine books nothing while the thread is held)
     4  ONE CONTEXT, A PLAYBACK BUFFER: the fight frame makes none; the game's context asked for 'playback'
   node gates/the_sound_never_chops_gate.js [--computer-only|--phone-only] [--live: the same, the songs on the live engine] */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const LIVE = process.argv.includes('--live');
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const db = x => x > 0 ? 20 * Math.log10(x) : -120;
const med = a => { const s = a.slice().sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : -120; };

/* counts every node the game's context makes, from the first script on (the shell, before anything runs) */
const ARM = `(function(){
  if (/BOHEMIA_FIGHT/.test(location.href)) { let fo;
    Object.defineProperty(window, 'FIGHT_OPTS', { configurable: true, get: function () { return fo; }, set: function (v) { fo = v ? Object.assign({}, v, { seed: 7 }) : v; } });
    window.__FRAME_ACS = 0; const F = window.AudioContext || window.webkitAudioContext;
    if (F) { const W = function (o) { window.__FRAME_ACS++; return new F(o); }; W.prototype = F.prototype; window.AudioContext = W; window.webkitAudioContext = W; }
    return; }
  /* the game's own AudioContext: what it asked for */
  const C = window.AudioContext || window.webkitAudioContext;
  if (C) { window.__AC_ASKED = []; const W = function (o) { window.__AC_ASKED.push(o && o.latencyHint || null); return new C(o); }; W.prototype = C.prototype; window.AudioContext = W; if (window.webkitAudioContext) window.webkitAudioContext = W; }
  const N = window.__MADE = { osc: 0, src: 0 }, B = window.BaseAudioContext || window.AudioContext;
  if (!B) return; const o = B.prototype.createOscillator, s = B.prototype.createBufferSource;
  B.prototype.createOscillator = function () { if (!(window.OfflineAudioContext && this instanceof OfflineAudioContext)) N.osc++; return o.apply(this, arguments); };
  B.prototype.createBufferSource = function () { if (!(window.OfflineAudioContext && this instanceof OfflineAudioContext)) N.src++; return s.apply(this, arguments); };
})();`;
/* the music's level in the audio thread itself: 50 ms windows, kept in the worklet, read after */
const EAR = `(async function(){
  const ac = MUS.AC, src = window.__FIGHTLIFT || window.__MUSVOL;
  const code = "class E extends AudioWorkletProcessor{constructor(){super();this.w=[];this.a=0;this.n=0;this.N=Math.round(sampleRate*0.01);this.port.onmessage=e=>{if(e.data.read)this.port.postMessage(this.w.slice());};}"
    + "process(i){const x=i[0]&&i[0][0];if(!x)return true;for(let k=0;k<x.length;k++){this.a+=x[k]*x[k];if(++this.n===this.N){this.w.push([+(currentTime+k/sampleRate).toFixed(3),Math.sqrt(this.a/this.n)]);if(this.w.length>60000)this.w.shift();this.a=0;this.n=0;}}return true;}}registerProcessor('chop-ear',E);";
  await ac.audioWorklet.addModule(URL.createObjectURL(new Blob([code], { type: 'application/javascript' })));
  const n = new AudioWorkletNode(ac, 'chop-ear'), z = ac.createGain(); z.gain.value = 0; src.connect(n); n.connect(z); z.connect(ac.destination);
  window.__CHOP = { read: () => new Promise(r => { n.port.onmessage = ev => r(ev.data); n.port.postMessage({ read: true }); }) };
})()`;

async function live(profile, throttle) {
  const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
  console.log('-- ' + profile + (throttle > 1 ? ', CPU ' + throttle + 'x slower' : '') + (LIVE ? ', THE SONGS ON THE LIVE ENGINE (the before)' : ''));
  let d;
  try { d = await drive.open({ keepCards: true, profile, throttle, arm: ARM, beforeTap: async (pg) => { await throughTheTitle(pg); } }); }
  catch (e) { leg(false, profile + ': the demo boots', String(e.message).slice(0, 160)); return; }
  const p = d.page;
  try {
    await p.waitForFunction(() => typeof MUS !== 'undefined' && MUS.playing && MUS.AC && MUS.AC.state === 'running' && window.SONGBOOK, null, { timeout: 90000 });
    if (LIVE) await p.evaluate(() => { SONGBOOK.book.songs = {}; SONGBOOK.stopAll(0.05); });
    else await p.waitForFunction(() => SONGBOOK.state().playing, null, { timeout: 60000 }).catch(() => {});
    await p.evaluate(EAR);
    await p.waitForTimeout(2000);
    const m0 = await p.evaluate(() => ({ made: Object.assign({}, window.__MADE), fb: SONGBOOK.fallback, t: MUS.AC.currentTime }));
    await p.waitForTimeout(10000);
    const m1 = await p.evaluate(() => ({ made: Object.assign({}, window.__MADE), fb: SONGBOOK.fallback, t: MUS.AC.currentTime }));
    await d.fr.evaluate(() => { roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 7 }); });
    let f = null;
    for (let i = 0; i < 400 && !f; i++) { const h = await p.$('#fightFrame'); if (h) { const c = await h.contentFrame();
      if (c && await c.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board && !!FIGHT.S.board).catch(() => false)) f = c; } if (!f) await p.waitForTimeout(150); }
    if (!f) throw new Error('the road fight never came up');
    await f.evaluate(() => { FIGHT_UI.auto = true; });
    await p.waitForTimeout(8000);
    const f0 = await p.evaluate(() => ({ made: Object.assign({}, window.__MADE), fb: SONGBOOK.fallback, t: MUS.AC.currentTime, st: SONGBOOK.state(), resync: SONGBOOK.resync }));
    await p.waitForTimeout(6000);
    /* the stall: the main thread held 1.5 s, the way a phone holds it building a screen; it comes once the sounding recording
       has played 1.6 s, and the song's own bus (the recordings and nothing else) is read in the audio thread too */
    /* up to three stalls, three seconds apart: one whose recording no turn changes inside it (a level change booked just
       before a stall lands in it on purpose, with its drop: that is the music, not a chop) */
    let s0 = 0, s1 = 0, tries = 0;
    for (; tries < 3; tries++) {
      if (!LIVE) await p.waitForFunction(() => { const c = SONGBOOK.src; return !!c && !c.stop && MUS.AC.currentTime - c.t0 > 1.6; }, null, { timeout: 15000, polling: 50 }).catch(() => {});
      if (!LIVE) await p.evaluate(() => { const c = SONGBOOK.src; window.__preSrc = c || null; window.__CHOP2 = null; if (!c) return;
        window.__preBuf = SONGBOOK.sets[c.n] ? SONGBOOK.sets[c.n].buf['level_' + c.lv] || null : null;
        const bus = SONGBOOK.buses[c.n]; if (!bus) return; const ac = MUS.AC, n = new AudioWorkletNode(ac, 'chop-ear'), z = ac.createGain(); z.gain.value = 0; bus.connect(n); n.connect(z); z.connect(ac.destination);
        window.__CHOP2 = { read: () => new Promise(r => { n.port.onmessage = ev => r(ev.data); n.port.postMessage({ read: true }); }) }; });
      if (!LIVE) await p.waitForTimeout(1600);
      s0 = await p.evaluate(() => MUS.AC.currentTime);
      await p.evaluate(() => { const t = performance.now(); while (performance.now() - t < 1500) {} });
      s1 = await p.evaluate(() => MUS.AC.currentTime);
      await p.waitForTimeout(300);
      const changed = LIVE ? false : await p.evaluate(t => { const c = window.__preSrc; return !c || (c.stop != null && c.stop < t); }, s1);
      if (!changed) break;
      await p.waitForTimeout(3000);
    }
    await p.waitForTimeout(2700);
    const f1 = await p.evaluate(() => ({ made: Object.assign({}, window.__MADE), fb: SONGBOOK.fallback, t: MUS.AC.currentTime, st: SONGBOOK.state(), resync: SONGBOOK.resync,
      frameACs: (function () { try { return document.getElementById('fightFrame').contentWindow.__FRAME_ACS || 0; } catch (e) { return -1; } })(), asked: window.__AC_ASKED || [] }));
    const W = await p.evaluate(() => window.__CHOP.read());
    const W2 = LIVE ? [] : await p.evaluate(() => window.__CHOP2 ? window.__CHOP2.read() : []);
    /* 1 */
    if (!LIVE) leg(m1.fb === m0.fb && f1.fb === m1.fb, profile + ': *** RENDERED AHEAD *** every step of the map and the fight from a recording once the first is in',
      'the live engine played ' + m0.fb + ' steps before the first recording was in, then ' + (f1.fb - m0.fb) + '; the fight on ' + f0.st.song + ' level ' + f0.st.level + ' (held: ' + f0.st.held.join(' / ') + ')');
    /* 2 */
    const rate = (a, b) => ({ osc: +((b.made.osc - a.made.osc) / (b.t - a.t)).toFixed(1), src: +((b.made.src - a.made.src) / (b.t - a.t)).toFixed(1) });
    const map = rate(m0, m1), fight = rate(f0, f1);
    if (LIVE) console.log('  before ' + profile + ': nodes a second, the map ' + map.osc + ' oscillators and ' + map.src + ' buffer sources, the fight ' + fight.osc + ' and ' + fight.src);
    else leg(map.osc <= 2 && fight.osc <= 8, profile + ': *** THE AUDIO THREAD IS LIGHT *** the music makes no oscillators: the map and the fight, nodes a second (effects included)',
      'the map ' + map.osc + ' oscillators and ' + map.src + ' buffer sources a second; the fight ' + fight.osc + ' and ' + fight.src);
    /* 3 */
    const before = W.filter(w => w[0] >= s0 - 3 && w[0] < s0).map(w => db(w[1])), lvl = med(before);
    const through = W.filter(w => w[0] >= s0 && w[0] <= s1), worst = through.length ? Math.min(...through.map(w => db(w[1]))) : -120;
    const holes = through.filter(w => db(w[1]) < lvl - 20).length;
    const onsets = (a, b) => { const q = W.filter(w => w[0] >= a && w[0] < b); let n = 0; for (let i = 1; i < q.length; i++) if (db(q[i][1]) - db(q[i - 1][1]) >= 4 && db(q[i][1]) > lvl - 15) n++; return n; };
    const span = (s1 - s0) - 0.6, onIn = onsets(s0 + 0.6, s1), onBefore = onsets(s0 - span, s0);
    /* the song's own bus against the recording itself, window by window: heard / the recording's loudness at that place is the
       bus's gain, a constant while the recording plays through; a window off it by more than a quarter is a chop */
    const follow = LIVE ? null : await p.evaluate(a => { const c = window.__preSrc, b = window.__preBuf; if (!c || !b) return null;
      const d = b.getChannelData(0), sr = b.sampleRate, n = Math.round(0.01 * sr);
      const ratios = (t0, t1) => { const q = []; for (const [te, r] of a.W2) { if (te < t0 || te > t1 || te - 0.01 < c.t0 + 0.05) continue;
        const i0 = Math.round((c.off0 + (te - 0.01 - c.t0)) * sr); if (i0 < 0 || i0 + n > d.length) continue;
        let e = 0; for (let k = 0; k < n; k++) e += d[i0 + k] * d[i0 + k]; e = Math.sqrt(e / n); if (e > 3e-4) q.push(r / e); } return q; };
      const md = v => { const s = v.slice().sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 0; };
      const st = ratios(a.s0 + 0.02, a.s1), bf = ratios(a.s0 - 1.5, a.s0), m = md(bf.concat(st));
      const off = v => v.filter(x => Math.abs(x / (m || 1) - 1) > 0.25).length;
      return { same: c.stop == null || c.stop >= a.s1 - 0.01, n: st.length, off: off(st), nb: bf.length, offb: off(bf), gain: +m.toFixed(3), song: c.n, lv: c.lv };
    }, { W2: W2, s0, s1 });
    const ok3 = before.length >= 100 && through.length >= 100 && tries < 3 && holes === 0 && !!follow && follow.same && follow.n >= 100 && follow.off <= follow.n * 0.05 && f1.resync === f0.resync;
    if (LIVE) console.log('  before ' + profile + ': the stall (' + (s1 - s0).toFixed(2) + ' s of audio while the thread was held): ' + holes + ' windows of ' + through.length + ' more than 20 dB under the music before it (' + lvl.toFixed(1) + ' dB), the quietest ' + worst.toFixed(1) + ' dB; the beat: ' + onIn + ' onsets in the stall past the horizon, ' + onBefore + ' in as long before');
    else leg(ok3, profile + ': *** A STALL CHANGES NOTHING *** the main thread held 1.5 s in the fight: the music, read in the audio thread, never drops 20 dB, its recording plays straight through it, never jumps',
      'the audio clock ran ' + (s1 - s0).toFixed(2) + ' s through the stall (' + (tries + 1) + (tries ? ' tries: a turn changed the level inside the first' : ' try') + '); ' + through.length + ' windows, ' + holes + ' holes; the music ' + lvl.toFixed(1) + ' dB before, the quietest ' + worst.toFixed(1) + ' dB through it; '
        + (follow ? follow.song + ' level ' + follow.lv + (follow.same ? ' sounding through it' : ' STOPPED in it') + ': its own bus against the recording, ' + follow.off + ' of ' + follow.n + ' windows off the bus gain ' + follow.gain + ' in the stall (' + follow.offb + ' of ' + follow.nb + ' before it)' : 'no recording') + '; onsets ' + onIn + ' in the stall past the horizon, ' + onBefore + ' in as long before; jumps ' + (f1.resync - f0.resync));
    /* 4 */
    if (!LIVE) leg(f1.frameACs === 0 && f1.asked.length >= 1 && f1.asked.every(x => x === 'playback'), profile + ': *** ONE CONTEXT, A PLAYBACK BUFFER ***',
      'the fight frame made ' + f1.frameACs + '; asked ' + JSON.stringify(f1.asked) + '; output ' + await p.evaluate(() => ((MUS.AC.outputLatency || 0) * 1000).toFixed(1) + ' ms + base ' + ((MUS.AC.baseLatency || 0) * 1000).toFixed(1) + ' ms'));
  } catch (e) { leg(false, profile + ': the demo and the fight played', String(e.message).slice(0, 200)); }
  await d.close();
}

(async () => {
  const a = process.argv.slice(2);
  if (!a.includes('--computer-only')) await live('phone_portrait', 4);
  if (!a.includes('--phone-only')) await live('computer', 1);
  console.log('THE SOUND NEVER CHOPS: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
