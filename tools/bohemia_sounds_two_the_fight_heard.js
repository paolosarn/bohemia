#!/usr/bin/env node
/* BOHEMIA -- THE FIGHT AS HE HEARS IT (SOUNDS TWO, 11/7/26, rule 427(a); asks 47, 88, 127, 212 on
   records/BOHEMIA_EVERYTHING_HE_ASKED_10_24_26.md, every one marked HALF by EYES).

   HIS ASKS, FOR MONTHS: music in every fight from the first frame to the end screen; the approved songs at their three
   levels; his turn hits much harder than theirs (at least 6 dB, the full drums and the lead only on his turn); every action
   lands on the beat at 120 BPM, by hand and on AUTO; one pace for every turn, no speeding up and slowing down.

   WHY A NEW INSTRUMENT. Every check before this one read what the code SAID it did: the fight's own log of when it began a
   motion, the shell's log of when it booked a sound. Neither is a sound. This one listens to the audio graph itself, inside
   the demo, on the real road fight through the map's own door, the way his phone would play it:
     FOUR EARS, each an AudioWorklet on the game's own AudioContext (sample-exact: every 128-frame block is stamped with the
     frame it renders, so a time here is the audio clock's, not a timer's guess):
       m   the music after his slider and the fight's lift (__FIGHTLIFT, else __MUSVOL)
       mp  the same through a phone's speaker (two 350 Hz high-passes, the measure tool's own)
       x   the effects bus after the fight's trim (__FIGHTTRIM, else __SFXBUS): every shot, swing, step and fall
       op  the end of the chain (the brickwall, __LIMITER) through a phone's speaker: everything he hears
     THE GRID: the beats the song's transport really booked (__beatNext, sampled every 100 ms on the audio clock).
     THE FIGHT'S OWN LOG: every motion it began (FIGHT_UI.onBeat: who, what, when, on which grid), every turn it told the
     shell (BOHEMIA_FIGHT_TURN), and the shell's own log of every sound it booked (__ONEBEAT.log), all put on the audio clock
     through the context's output timestamp.
   Then it MEASURES, off the audio:
     an effect's onset (the first 2.7 ms block that jumps 9 dB over the 21 ms before it), against the beat it was booked on;
     the music's own beat (its loudness folded on the beat from the transport's grid) against the same grid;
     the music's level in his turns and in theirs, through the phone band, from the recording as it plays.

   node tools/bohemia_sounds_two_the_fight_heard.js [--profile phone_portrait|computer] [--throttle 4] [--hand] [--seed 7]
        [--plant gap,off,pace,silent] [--record out.webm]   prints a JSON summary; --raw <file> writes everything there;
        --record writes the end of the chain, everything he hears from the map to the end screen, as a file
   const H = require('./tools/bohemia_sounds_two_the_fight_heard.js'); await H.listen({ profile, throttle, hand, plant })
   Gate: gates/the_fight_as_he_hears_it_gate.js. Record: records/BOHEMIA_SOUNDS_TWO_THE_FIGHT_AS_HE_HEARS_IT_11_7_26.md. */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

/* ---- what is put into the page: the four ears, the grid, the clocks -------------------------------------------------- */
const EARS = `(() => {
  if (window.__HEARD) return true;
  if (typeof MUS === 'undefined' || !MUS.AC || MUS.AC.state !== 'running') return false;
  const ac = MUS.AC, L = window.__HEARD = { sr: ac.sampleRate, blocks: { m: [], mp: [], x: [], op: [] }, f0: { m: null, mp: null, x: null, op: null },
    grid: [], ts: [], turns: [], msgs: [], ob: [], obSeen: new WeakSet(), sw: [], swSeen: new WeakSet(), frameIn: null, board: null, over: null, overScreen: null, frameGone: null, errs: [] };
  const src = "class E extends AudioWorkletProcessor{constructor(){super();this.b=[];this.f=-1;}process(i){const c=i[0];let s=0;if(c&&c.length){const n=c[0].length;for(let k=0;k<c.length;k++){const a=c[k];for(let j=0;j<n;j++)s+=a[j]*a[j];}s/=c.length*n;}if(this.f<0)this.f=currentFrame;this.b.push(s);if(this.b.length>=64){this.port.postMessage({f:this.f,e:this.b});this.b=[];this.f=-1;}return true;}}registerProcessor('heard-ear',E);";
  const url = URL.createObjectURL(new Blob([src], { type: 'application/javascript' }));
  L.ready = ac.audioWorklet.addModule(url).then(() => {
    const ear = (from, key, phone) => {
      if (!from || from.context !== ac) { L.errs.push('no ' + key); return; }
      let n0 = from;
      if (phone) { const h1 = ac.createBiquadFilter(), h2 = ac.createBiquadFilter(); [h1, h2].forEach(h => { h.type = 'highpass'; h.frequency.value = 350; h.Q.value = Math.SQRT1_2; }); from.connect(h1); h1.connect(h2); n0 = h2; }
      const w = new AudioWorkletNode(ac, 'heard-ear', { numberOfInputs: 1, numberOfOutputs: 1, outputChannelCount: [1] }), z = ac.createGain();
      z.gain.value = 0; n0.connect(w); w.connect(z); z.connect(ac.destination);
      w.port.onmessage = ev => { const B = L.blocks[key]; if (L.f0[key] == null) L.f0[key] = ev.data.f; B.push([ev.data.f, ev.data.e]); };
    };
    const mus = window.__FIGHTLIFT || window.__MUSVOL, fx = window.__FIGHTTRIM || window.__SFXBUS;
    ear(mus, 'm', false); ear(mus, 'mp', true); ear(fx, 'x', false); ear(window.__LIMITER, 'op', true);
    L.on = true;
  }, e => L.errs.push('worklet: ' + (e && e.message || e)));
  /* the grid the transport booked, and the audio clock against the page's */
  L.tick = setInterval(() => { try {
    const t = ac.currentTime, b = window.__beatNext ? window.__beatNext(t) : null;
    if (b != null && isFinite(b)) { const g = L.grid; if (!g.length || Math.abs(g[g.length - 1] - b) > 1e-4) g.push(+b.toFixed(5)); }
    const ts = ac.getOutputTimestamp ? ac.getOutputTimestamp() : null;
    if (ts && ts.contextTime > 0 && ts.performanceTime > 0) L.ts.push([performance.timeOrigin + ts.performanceTime, ts.contextTime]);
    if (L.ts.length > 6000) L.ts.splice(0, 1000);
    const f = document.getElementById('fightFrame');
    if (f && L.frameIn == null) L.frameIn = t;
    if (!f && L.frameIn != null && L.frameGone == null && L.over != null) L.frameGone = t;
    if (f && L.over != null && L.overScreen == null) { try { const o = f.contentDocument.getElementById('over'); if (o && getComputedStyle(o).display !== 'none') L.overScreen = t; } catch (e) {} }
    /* the shell's own logs keep 600 and 80: copied as they come, so a long fight keeps all of it */
    try { const OB = window.__ONEBEAT && __ONEBEAT.log; if (OB) for (const b of OB) if (!L.obSeen.has(b)) { L.obSeen.add(b); L.ob.push(b); } } catch (e) {}
    try { const SW = window.SONGBOOK && SONGBOOK.switches; if (SW) for (const s of SW) if (s.t != null && !L.swSeen.has(s)) { L.swSeen.add(s); L.sw.push(s); } } catch (e) {}
    /* what is sounding: the songbook's sources and every gain the music passes through (a reading that disagrees with the
       file can say why) */
    try { if (L.board != null && L.over == null && (L.gains = L.gains || []).length < 3000) L.gains.push([+t.toFixed(2), (SONGBOOK.ring || []).filter(c => !c.stop || c.stop > t).map(c => c.lv + ':' + (+c.g.gain.value).toFixed(2)).join(','),
      +MUS.MAST.gain.value.toFixed(2), window.__DUCK ? +__DUCK.gain.value.toFixed(2) : null, +__MUSVOL.gain.value.toFixed(2), window.__FIGHTLIFT ? +__FIGHTLIFT.gain.value.toFixed(2) : null]); } catch (e) {}
    try { const S = window.SONGBOOK && SONGBOOK.state(); if (S) { const last = L.lv && L.lv[L.lv.length - 1]; if (!last || last[1] !== S.level || last[2] !== S.song) (L.lv = L.lv || []).push([+t.toFixed(3), S.level, S.song]); } } catch (e) {}
  } catch (e) { L.errs.push('tick: ' + e.message); } }, 100);
  addEventListener('message', ev => { const m = ev.data; if (!m || !m.type) return; const f = document.getElementById('fightFrame'); if (!f || ev.source !== f.contentWindow) return;
    const t = +ac.currentTime.toFixed(4);
    if (m.type === 'BOHEMIA_COMBAT_STARTED') L.board = t;
    if (m.type === 'BOHEMIA_FIGHT_TURN') L.turns.push([m.side, t]);
    if (m.type === 'BOHEMIA_FIGHT_OVER') L.over = t;
    if (m.type === 'BOHEMIA_SFX' && L.msgs.length < 4000) L.msgs.push([t, m.ev, m.side || null, m.at || null]);
  });
  return true;
})()`;

/* ---- the planted fails (the gate proves it can see each one) ---------------------------------------------------------- */
const PLANTS = {
  /* his turn plays level 2, so his turn and theirs are the same loudness */
  gap: `(() => { const K = KILLMUS, lv = K.level; K.level = function(){ const r = lv.call(this); return r === 3 ? 2 : r; }; return true; })()`,
  /* the music stops for two seconds, four seconds after the fight's frame is in the page */
  silent: `(() => { const iv = setInterval(() => { if (!document.getElementById('fightFrame')) return; clearInterval(iv);
    setTimeout(() => { try { const g = window.__MUSVOL.gain, v = g.value, t = MUS.AC.currentTime; g.setValueAtTime(0, t); g.setValueAtTime(v || 1, t + 2.0); } catch (e) {} }, 4000); }, 50); return true; })()`
};
/* in the fight's frame */
const FIGHT_PLANTS = {
  /* their turns at double pace again (the old THEIRS_PACE, rule 274's MEASURED BEFORE) */
  pace: `(() => { const b0 = beatMs; beatMs = function(){ const u = FIGHT.current(); return u && u.side === 'them' ? b0() / 2 : b0(); }; return true; })()`,
  /* every sound the fight asks for is heard 90 ms after the moment it asked for */
  off: `(() => { const P = window.parent, pm = P.postMessage; P.postMessage = function (m, o) {
    if (m && m.type === 'BOHEMIA_SFX') m = Object.assign({}, m, { at: (m.at || (performance.timeOrigin + performance.now() + SONG.lat)) + 90 });
    return pm.apply(P, [m].concat([].slice.call(arguments, 1))); }; return true; })()`
};

const ARM = seed => `(function(){
  if (/BOHEMIA_FIGHT/.test(location.href)) { let fo;
    Object.defineProperty(window, 'FIGHT_OPTS', { configurable: true, get: function () { return fo; }, set: function (v) { fo = v ? Object.assign({}, v, { seed: ${seed} }) : v; } });
  }
})();`;

async function listen(o) {
  o = Object.assign({ profile: 'phone_portrait', throttle: 1, hand: false, seed: 7, plant: null, after: 10, log: () => {} }, o || {});
  const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
  const d = await drive.open({ keepCards: true, profile: o.profile, throttle: o.throttle, arm: ARM(o.seed), beforeTap: async pg => { await throughTheTitle(pg); } });
  const p = d.page, out = { profile: o.profile, throttle: o.throttle, hand: o.hand, seed: o.seed, plant: o.plant, errs: [] };
  try {
    await p.waitForFunction(() => typeof MUS !== 'undefined' && MUS.playing && MUS.AC && MUS.AC.state === 'running', null, { timeout: 120000 });
    /* the open road (rule 237: on a faction's ground the map plays that faction's song live, not the thirteen) */
    await d.fr.evaluate(() => { if (typeof turfAt !== 'function') return null; const own = (x, y) => !!turfAt(x, y);
      for (let x = 6; x < 110; x += 2) for (let y = 6; y < 110; y += 2) { let ok = true; for (let dx = -2; dx <= 2 && ok; dx++) for (let dy = -2; dy <= 2; dy++) if (own(x + dx, y + dy)) { ok = false; break; }
        if (ok) { city.x = x; city.y = y; try { __ctWhere(); } catch (e) {} return [x, y]; } }
      return null; }).catch(() => null);
    await p.waitForFunction(() => window.SONGBOOK && SONGBOOK.state().playing, null, { timeout: 60000 }).catch(() => {});
    await p.waitForFunction(EARS, null, { timeout: 30000 });
    await p.waitForFunction(() => window.__HEARD.on || window.__HEARD.errs.length, null, { timeout: 30000 });
    const plants = [].concat(o.plant || []);
    out.planted = {};
    for (const k of plants) if (PLANTS[k]) out.planted[k] = await p.evaluate(PLANTS[k]);
    /* --record: what comes out of the end of the chain, everything he hears, as a file (the VOTE card plays it) */
    if (o.record) await p.evaluate(() => { const ac = MUS.AC, dst = ac.createMediaStreamDestination(); window.__LIMITER.connect(dst);
      const mr = new MediaRecorder(dst.stream, { mimeType: 'audio/webm;codecs=opus', audioBitsPerSecond: 128000 }), parts = [];
      mr.ondataavailable = e => { if (e.data && e.data.size) parts.push(e.data); }; window.__REC = { mr, parts, t0: ac.currentTime }; mr.start(1000); });
    o.log('  [heard] the ears are on; the map for six seconds');
    await p.waitForTimeout(6000);
    out.map = await p.evaluate(() => ({ t: MUS.AC.currentTime, st: SONGBOOK.state() }));
    await d.fr.evaluate(() => { roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 7 }); });
    let f = null;
    for (let i = 0; i < 600 && !f; i++) { const h = await p.$('#fightFrame'); if (h) { const c = await h.contentFrame();
      if (c && await c.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board && !!FIGHT.S.board).catch(() => false)) f = c; } if (!f) await p.waitForTimeout(150); }
    if (!f) throw new Error('the road fight never came up');
    o.log('  [heard] the board is up' + (o.hand ? ', by hand' : ', AUTO'));
    for (const k of plants) if (FIGHT_PLANTS[k]) out.planted[k] = await f.evaluate(FIGHT_PLANTS[k]).catch(e => 'failed: ' + e.message);
    out.fightOrigin = await f.evaluate(() => performance.timeOrigin);
    if (!o.hand) await f.evaluate(() => { FIGHT_UI.auto = true; });
    else {
      /* BY HAND: past the line (the FIGHT button's own call), then every turn of his asked for at a moment off the beat, the
         way a thumb is (a random wait of 0 to 450 ms after his man is free), through the page's own by-hand door */
      await f.evaluate(() => { if (FIGHT.S.deploy) fightNow(); });
    }
    let over = false, acts = 0, rnd = (o.seed * 9301 + 49297) % 233280;
    const t0 = Date.now();
    while (!over && Date.now() - t0 < 420000) {
      over = await p.evaluate(() => window.__HEARD.over != null);
      if (over) break;
      if (o.hand) {
        const free = await f.evaluate(() => { if (FIGHT.S.over) return false; const u = FIGHT.current(); return !!(u && crewControlled(u) && !FIGHT_UI.anim.length && !FIGHT.S.deploy); }).catch(() => false);
        if (free) {
          rnd = (rnd * 9301 + 49297) % 233280; await p.waitForTimeout(Math.round(rnd / 233280 * 450));
          const st = await f.evaluate(() => { const u = FIGHT.current(); if (!u || !crewControlled(u) || FIGHT_UI.anim.length) return 'wait';
            const r0 = FIGHT.S.round, i0 = FIGHT.S.idx; FIGHT.S.byHand = true; FIGHT.aiStep(u); take(); hud();
            if (FIGHT.current() === u && FIGHT.S.round === r0 && FIGHT.S.idx === i0 && !FIGHT_UI.anim.length) { FIGHT.endTurn(u); take(); hud(); }
            return 'acted'; }).catch(() => 'gone');
          if (st === 'acted') acts++;
          continue;
        }
        await p.waitForTimeout(60);
      } else await p.waitForTimeout(400);
    }
    out.handActs = acts;
    if (!over) throw new Error('the fight never ended inside seven minutes');
    o.log('  [heard] the fight is over; the end screen for ' + o.after + ' s');
    const log = await f.evaluate(() => ({ onBeat: (FIGHT_UI.onBeat || []).slice(), result: FIGHT.S.result, hand: FIGHT_UI.hand || 1, speed: FIGHT_UI.speed, beat: songBeat(), song: { from: SONG.from, lat: SONG.lat } })).catch(() => null);
    out.fight = log;
    await p.waitForTimeout(o.after * 1000);
    const raw = await p.evaluate(() => { const L = window.__HEARD; clearInterval(L.tick);
      return { sr: L.sr, blocks: L.blocks, grid: L.grid, ts: L.ts, turns: L.turns, msgs: L.msgs, lv: L.lv || [], frameIn: L.frameIn, board: L.board, over: L.over, overScreen: L.overScreen, frameGone: L.frameGone, errs: L.errs, gains: L.gains || [],
        onebeat: L.ob, switches: L.sw, end: MUS.AC.currentTime,
        lat: { out: MUS.AC.outputLatency || 0, base: MUS.AC.baseLatency || 0 } }; });
    out.raw = raw;
    if (typeof o.inspect === 'function') out.inspected = await o.inspect(p, f, raw).catch(e => 'inspect: ' + e.message);
    if (o.record) { out.recordB64 = await p.evaluate(() => new Promise(res => { const R = window.__REC; R.mr.onstop = () => { const b = new Blob(R.parts, { type: 'audio/webm' }), fr = new FileReader();
      fr.onload = () => res(String(fr.result).split(',')[1]); fr.readAsDataURL(b); }; R.mr.stop(); })); out.recordT0 = await p.evaluate(() => window.__REC.t0); }
    out.errs = (d.errs || []).slice(0, 10);
  } catch (e) { out.crash = String(e && e.message || e).slice(0, 300); }
  await d.close().catch(() => {});
  return out;
}

/* ---- the reading: everything off the audio, on the audio clock -------------------------------------------------------- */
const db = x => x > 1e-12 ? 10 * Math.log10(x) : -120;   /* blocks hold mean squares */
const med = a => { const s = a.slice().sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; };
const pct = (a, q) => { const s = a.slice().sort((x, y) => x - y); return s.length ? s[Math.min(s.length - 1, Math.floor(s.length * q))] : null; };
function series(raw, key) {
  const Q = 128 / raw.sr, out = [];
  for (const [f, e] of raw.blocks[key] || []) for (let i = 0; i < e.length; i++) out.push([(f + i * 128) / raw.sr, e[i]]);
  out.Q = Q; return out;
}
/* windows of w seconds: [start, mean square] */
function windows(s, w, from, to) {
  const out = []; let acc = 0, n = 0, t0 = null;
  for (const [t, e] of s) { if (t < from || t >= to) continue; if (t0 == null) t0 = t; if (t - t0 >= w - 1e-9) { out.push([t0, acc / n]); acc = 0; n = 0; t0 = t; } acc += e; n++; }
  if (n) out.push([t0, acc / n]); return out;
}
/* the beat grid the transport booked: a beat every 0.5 s, each sampled beat an anchor; the nearest anchor's phase */
function gridOf(raw) {
  const g = raw.grid.slice().sort((a, b) => a - b), d = [];
  for (let i = 1; i < g.length; i++) d.push(g[i] - g[i - 1]);
  const beat = med(d.filter(x => x > 0.2 && x < 1.2)) || 0.5;
  const at = t => { let lo = 0, hi = g.length - 1; if (hi < 0) return null; while (lo < hi) { const mid = (lo + hi) >> 1; if (g[mid] < t) lo = mid + 1; else hi = mid; }
    const c = [g[lo], g[lo - 1]].filter(x => x != null); let best = null; for (const a of c) if (best == null || Math.abs(a - t) < Math.abs(best - t)) best = a; return best; };
  /* signed offset of t from the nearest point of a grid cut every q of a beat, from the nearest booked beat */
  const off = (t, q) => { const a = at(t); if (a == null) return null; const step = beat * q, ph = (((t - a) % step) + step) % step; return ph > step / 2 ? ph - step : ph; };
  /* steps the grid did not take whole: a change of tempo, a jump */
  const odd = d.filter(x => x > 0.05 && Math.abs(x / beat - Math.round(x / beat)) > 0.02);
  return { beat, at, off, n: g.length, odd: odd.length, spread: d.length ? +(Math.max(...d.filter(x => x < 1.2)) - Math.min(...d.filter(x => x > 0.2))).toFixed(4) : 0 };
}
/* page epoch ms -> the audio time that is HEARD at that moment (the output timestamp pairs, nearest) */
function epochToCtx(raw) {
  const T = raw.ts; return e => { if (!T.length) return null; let lo = 0, hi = T.length - 1; while (lo < hi) { const m = (lo + hi) >> 1; if (T[m][0] < e) lo = m + 1; else hi = m; }
    const k = T[lo]; return k[1] + (e - k[0]) / 1000; };
}
/* the onsets in the effects bus: a block 9 dB over the 21 ms before it and over the floor */
function onsets(s, from, to) {
  const out = [], K = 8; let last = -1;
  for (let i = K; i < s.length; i++) { const [t, e] = s[i]; if (t < from || t > to) continue;
    let pre = 0; for (let j = i - K; j < i; j++) pre += s[j][1]; pre /= K;
    if (e > 1e-5 && e > pre * 8 && t - last > 0.03) { out.push(t); last = t; } }
  return out;
}
function read(r) {
  const R = { profile: r.profile, throttle: r.throttle, hand: r.hand, plant: r.plant || null, crash: r.crash || null };
  if (r.crash || !r.raw) return R;
  const raw = r.raw, G = gridOf(raw), toCtx = epochToCtx(raw);
  R.errs = (raw.errs || []).concat(r.errs || []);
  const from = raw.frameIn, end = raw.frameGone || raw.end - 0.2, board = raw.board, over = raw.over;
  R.times = { frameIn: from, board, over, overScreen: raw.overScreen, frameGone: raw.frameGone, end: raw.end, fightSecs: over && board ? +(over - board).toFixed(1) : null };
  /* ASK 88: music from the fight's first frame to the end screen (and the end screen itself, to when he leaves it) */
  const m = series(raw, 'm'), mw = windows(m, 0.25, from, end);
  const silent = mw.filter(w => db(w[1]) < -60);
  R.music = { windows: mw.length, silent: silent.length, silentAt: silent.slice(0, 5).map(w => +(w[0] - from).toFixed(1)), quietest: mw.length ? +Math.min(...mw.map(w => db(w[1]))).toFixed(1) : null,
    endScreenSecs: raw.overScreen != null ? +((raw.frameGone || raw.end) - raw.overScreen).toFixed(1) : null,
    endScreenSilent: raw.overScreen != null ? mw.filter(w => w[0] >= raw.overScreen && db(w[1]) < -60).length : null };
  /* ASK 127: the three levels and the gap, off the recording as it plays (the songbook's level at each moment) */
  const lvAt = t => { let lv = null, at = -1; for (const s of raw.switches) if (s.t != null && s.t <= t + 1e-6) { lv = s.lv; at = s.t; } return { lv, since: t - at }; };
  const mp = series(raw, 'mp'), op = series(raw, 'op');
  /* the loudness of a turn is its RMS through the phone's band (the files' own measure: phone_rms_db), the windows of the
     level in its turns, the first 0.3 s after a change left out; the median of the windows' dB is reported beside it */
  /* a window that holds a change (the hit into 3 strikes ON the change) belongs to neither side */
  const byLvE = (s, l) => windows(s, 0.1, board || from, over || end).filter(w => { const a = lvAt(w[0]), b = lvAt(w[0] + 0.1); return a.lv === l && b.lv === l && a.since > 0.3 && b.since > a.since; }).map(w => w[1]);
  const rmsDb = a => a.length ? db(a.reduce((x, y) => x + y, 0) / a.length) : null;
  const E2 = byLvE(mp, 2), E3 = byLvE(mp, 3), F2 = byLvE(op, 2), F3 = byLvE(op, 3);
  const L2 = E2.map(db), L3 = E3.map(db);
  const mapW = windows(mp, 0.1, Math.max(0, from - 5), from).map(w => db(w[1]));
  const levelsSeen = [...new Set(raw.switches.filter(s => s.t != null && s.t >= (board || from) && s.t <= (over || end)).map(s => s.lv))].sort();
  R.levels = { seen: levelsSeen, map: raw.switches.filter(s => s.t != null && s.t < from).map(s => s.lv).pop() || null, song: (raw.lv[raw.lv.length - 1] || [])[2] || null,
    n2: L2.length, n3: L3.length, theirs: rmsDb(E2), his: rmsDb(E3), gap: E2.length && E3.length ? +(rmsDb(E3) - rmsDb(E2)).toFixed(1) : null,
    gapMedian: L2.length && L3.length ? +(med(L3) - med(L2)).toFixed(1) : null,
    endGap: F2.length && F3.length ? +(rmsDb(F3) - rmsDb(F2)).toFixed(1) : null, mapLevel: mapW.length ? +med(mapW).toFixed(1) : null,
    turns: raw.turns.length };
  /* the turn changes heard: each turn told, the level it asked for heard within 1.2 s, on a beat */
  const want = s => s === 'them' ? 2 : 3; let onTime = 0, late = [];
  raw.turns.forEach(([side, t], i) => { const nx = raw.turns[i + 1] ? raw.turns[i + 1][1] : Infinity;
    const sw = raw.switches.find(s => s.t != null && s.t >= t - 0.02 && s.lv === want(side));
    const was = lvAt(t).lv;
    if (was === want(side) || (sw && sw.t - t <= 1.2)) onTime++; else if (nx - t >= 1.2) late.push(side + '@' + (t - from).toFixed(1)); });
  R.levels.turnsHeard = onTime; R.levels.turnsLate = late.slice(0, 6);
  /* ASK 47: every action on the beat, off the effects bus. Each sound the fight asked for (the shell's own booking log, ev and
     the audio time T it was put on), and the onset the ear really heard for it (the first onset from 6 ms before T to 60 ms
     after): how far from T, and how far T and the onset are from the song's grid (a sixteenth for everything, the beat for a
     blow's landing) */
  const x = series(raw, 'x'), ons = onsets(x, (board || from) - 0.5, (over || end) + 1);
  const FIGHT_EV = /^(shot|hit|vital|miss|hurt|kill|went_down|swing|step|parry|block|reload|mag_home|graze|crit|punch|bash|thud|fall)/;
  const booked = raw.onebeat.filter(b => b.T >= (board || from) - 0.2 && b.T <= (over || end) + 0.5 && FIGHT_EV.test(String(b.ev)));
  const used = new Set(), rows = [];
  for (const b of booked) { const on = ons.find(t => t >= b.T - 0.006 && t <= b.T + 0.06); if (on != null) used.add(on);
    rows.push({ ev: b.ev, why: b.why, T: b.T, on, late: b.d != null && b.d < 0.5 && b.why !== 'grid', heardMinusBooked: on != null ? +((on - b.T) * 1000).toFixed(1) : null, bookedOff16: +(G.off(b.T, 0.25) * 1000).toFixed(1), heardOff16: on != null ? +(G.off(on, 0.25) * 1000).toFixed(1) : null, heardOffBeat: on != null ? +(G.off(on, 1) * 1000).toFixed(1) : null }); }
  /* a sound that reached the shell after its moment plays at once, late by the page's thread (the fight and the shell share
     it): counted apart, so 'on the beat' reads what the clock did with the sounds it was given in time */
  /* THE RELOAD IS COUNTED APART: its recording (the mag seating, BOH_GUNS_HEARD's reload slots) opens about 30 ms into its
     slot, so it is heard that much after its moment however well it is booked (measured: 29 to 35 ms, every one); named in
     the reading (reload) and owed to the guns' recordings, never folded into the grid's count */
  const reloads = rows.filter(q => q.on != null && q.ev === 'mag_home');
  const all = rows.filter(q => q.on != null && q.ev !== 'mag_home'), heard = all.filter(q => !q.late), lateOnes = all.filter(q => q.late);
  const BLOW = /^(hit|vital|miss|kill|went_down|graze|crit|shot)/, blows = heard.filter(q => BLOW.test(q.ev)), blowsAll = all.filter(q => BLOW.test(q.ev));
  /* the onsets nobody booked on the grid (a sound made outside the one beat) */
  const stray = ons.filter(t => !used.has(t)).map(t => G.off(t, 0.25) * 1000);
  R.beat = { booked: booked.length, heardAll: all.length, heard: heard.length, cameLate: lateOnes.length, cameLateWorst: lateOnes.length ? +Math.max(...lateOnes.map(q => q.heardOff16 == null ? 0 : Math.abs(q.heardOffBeat))).toFixed(0) : 0, onsets: ons.length,
    on16: heard.filter(q => Math.abs(q.heardOff16) <= 20).length, onBeatBlows: blows.filter(q => Math.abs(q.heardOffBeat) <= 20).length, blows: blows.length,
    /* everything heard, in time or not, against a 25 ms window (a soft sound's onset reads up to 30 ms into it on a 9 dB detector) */
    reload: { n: reloads.length, medLate: med(reloads.map(q => q.heardMinusBooked)) },
    all16: all.filter(q => Math.abs(q.heardOff16) <= 25).length, allBlows: blowsAll.length, allBlowsOnBeat: blowsAll.filter(q => Math.abs(q.heardOffBeat) <= 25).length,
    medHeardMinusBooked: med(heard.map(q => q.heardMinusBooked)), worst16: heard.length ? +Math.max(...heard.map(q => Math.abs(q.heardOff16))).toFixed(1) : null,
    blowsOffBeat: blows.filter(q => Math.abs(q.heardOffBeat) > 20).slice(0, 6).map(q => q.ev + ' ' + q.heardOffBeat + ' ms (' + q.why + ')'),
    strays: stray.length, strayOff16: stray.filter(v => Math.abs(v) > 20).length,
    why: booked.reduce((a, b) => (a[b.why] = (a[b.why] || 0) + 1, a), {}), rows };
  /* the music's own beat against the same grid: its loudness folded on the beat (2.7 ms bins), the steepest rise */
  {
    const bins = new Array(Math.round(G.beat / m.Q)).fill(0), cnt = bins.slice();
    for (const [t, e] of m) { if (t < (board || from) || t > (over || end)) continue; const o = G.off(t, 1); if (o == null) continue; const ph = ((o % G.beat) + G.beat) % G.beat; const k = Math.min(bins.length - 1, Math.floor(ph / m.Q)); bins[k] += e; cnt[k]++; }
    const lv = bins.map((b, i) => cnt[i] ? db(b / cnt[i]) : -120); let bi = 0, bv = -1e9;
    for (let i = 0; i < lv.length; i++) { const r2 = lv[i] - lv[(i - 2 + lv.length) % lv.length]; if (r2 > bv) { bv = r2; bi = i; } }
    let ms = bi * m.Q * 1000; if (ms > G.beat * 500) ms -= G.beat * 1000;
    R.beat.musicOffGrid = +ms.toFixed(1); R.beat.musicRise = +bv.toFixed(1);
  }
  /* ASK 212: one pace. The song's tempo held (every booked beat a whole beat from the last), every motion on one grid (the beat
     over his speed), and the idle between one motion's end and the next one's start, his side and theirs, in beats */
  const ob = (r.fight && r.fight.onBeat || []).filter(q => q.g > 0).map(q => Object.assign({}, q, { ctx: toCtx(r.fightOrigin + q.at) }));
  const grids = [...new Set(ob.map(q => Math.round(q.g)))];
  /* the beats a motion waited that it did not need: from the earliest grid point it could have taken after the last motion's
     end (its own landing on the grid, the anchor the fight held) to the one it took; a steady pace is none, on both sides */
  const landOf = q => (q.land || q.at) - q.at, wasted = { you: [], them: [] }, handoff = [], hitches = [];
  for (let i = 1; i < ob.length; i++) { const a = ob[i - 1], b = ob[i]; if (!b.side) continue;
    const end = a.at + (a.dur || 0), t = end + landOf(b), k = Math.ceil((t - b.songAt) / b.g - 0.02), could = b.songAt + k * b.g - landOf(b);
    const w = Math.max(0, Math.round((b.at - could) / b.g));
    if (r.hand && (b.side === 'you' || a.side === 'you')) continue;   /* by hand, when his man moves, and when his turn is over, is his thumb's */
    if (a.side && a.side !== b.side) handoff.push(w); else wasted[b.side].push(w);
    if (w >= 1) hitches.push((a.side || '-') + '>' + b.side + ' ' + a.k + '>' + b.k + ' +' + w + (b.late ? ' late' : '') + (b.ahead ? '' : ' (not thought ahead)')); }
  const dist = a => a.reduce((o, k) => (o[k] = (o[k] || 0) + 1, o), {}), mean = a => a.length ? +(a.reduce((x, y) => x + y, 0) / a.length).toFixed(2) : null;
  const startGap = { you: [], them: [] };
  for (let i = 1; i < ob.length; i++) { const a = ob[i - 1], b = ob[i]; if (a.side === b.side && b.side) startGap[b.side].push((b.at - a.at) / 1000); }
  R.pace = { motions: ob.length, grids, songBeat: +(G.beat * 1000).toFixed(1), gridOdd: G.odd, gridSpread: G.spread,
    offGrid: ob.filter(q => { const o = G.off(q.ctx + landOf(q) / 1000, q.g / (G.beat * 1000)); return o != null && Math.abs(o) > 0.02; }).length,
    wasteYou: dist(wasted.you), wasteThem: dist(wasted.them), handoff: dist(handoff), wasteMeanYou: mean(wasted.you), wasteMeanThem: mean(wasted.them),
    pairs: wasted.you.length + wasted.them.length, hitches: hitches.length, hitchList: hitches.slice(0, 8),
    medStartGapYou: med(startGap.you), medStartGapThem: med(startGap.them), late: ob.filter(q => q.late).length,
    sides: ob.reduce((o, q) => (o[q.side || '-'] = (o[q.side || '-'] || 0) + 1, o), {}) };
  return R;
}

module.exports = { listen, read, PLANTS, FIGHT_PLANTS };

if (require.main === module) {
  (async () => {
    const a = process.argv.slice(2), arg = (k, dflt) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : dflt; };
    const plant = arg('--plant', null);
    const r = await listen({ profile: arg('--profile', 'phone_portrait'), throttle: +arg('--throttle', 1), hand: a.includes('--hand'), seed: +arg('--seed', 7), plant: plant ? plant.split(',') : null, record: !!arg('--record', null), log: s => console.error(s) });
    if (r.recordB64) { fs.writeFileSync(arg('--record'), Buffer.from(r.recordB64, 'base64')); delete r.recordB64;
      /* the card's timeline: the turns, the board, the end and the beat, in seconds from the recording's first sample */
      const raw = r.raw, t0 = r.recordT0, g = raw.grid.filter(x => x > t0)[0];
      fs.writeFileSync(arg('--record') + '.timeline.json', JSON.stringify({ board: +(raw.board - t0).toFixed(3), over: +(raw.over - t0).toFixed(3), frameIn: +(raw.frameIn - t0).toFixed(3),
        beat: 0.5, beat0: g != null ? +((g - t0) % 0.5).toFixed(4) : 0, turns: raw.turns.map(([side, t]) => [+(t - t0).toFixed(3), side]), song: (raw.lv[raw.lv.length - 2] || raw.lv[raw.lv.length - 1] || [])[2] || null })); }
    if (a.includes('--raw')) fs.writeFileSync(arg('--raw'), JSON.stringify(r));
    const R = read(r); delete (R.beat || {}).rows;
    console.log(JSON.stringify(R, null, 1));
  })().catch(e => { console.error(e); process.exit(1); });
}
