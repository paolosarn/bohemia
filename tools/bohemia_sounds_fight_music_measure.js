#!/usr/bin/env node
/* THE FIGHT'S MUSIC, MEASURED (SOUNDS [the fight's music you can hear], rule 168, Paolo 10/25, playing a fight: 'I only hear
   the sound effects... I'm not hearing any music... it doesn't have tempo, doesn't have BPM, doesn't intensify').

   One real fight on the real surface (the demo or the alpha), driven the way the map opens one (roadContactFight through the
   map's own door, AUTO, seeded), with the ear on three buses at once:
     music    MUS's music volume node (after his MUSIC slider: what he hears of the song)
     effects  the effects bus (every shot, hit, fall and voice the fight asks for)
     total    the brickwall's output (everything, as it leaves the game)
   Every 10 ms of audio is one energy value per bus on the audio clock, and the shell's level (KILLMUS.level(), MUS.layers)
   and the fight's turn messages are logged on the same clock, so every number below is read off what was played.

   WHAT IT ANSWERS (exported as measure(), and the gate reads the same object):
     playing   the fraction of the fight (board up to the end screen) with the song above a floor (-60 dBFS)
     above     the music's level against the effects' in the same windows (median dB, music minus effects)
     pulse     for each level: the 120 BPM pulse strength, the onset envelope folded on the song's own 500 ms beat
               (peak bin over median bin), beside two control periods that are not the beat (430 and 580 ms)
     levels    which levels played, for how long, and whether every turn moved the level at the next bar
   Run: node tools/bohemia_sounds_fight_music_measure.js [--alpha] [--profile computer] [--throttle 4] [--json out.json] */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));

const ARM = `(function(){ if (!/BOHEMIA_FIGHT/.test(location.href)) return; let fo;
  Object.defineProperty(window, 'FIGHT_OPTS', { configurable: true, get: function () { return fo; }, set: function (v) { fo = v ? Object.assign({}, v, { seed: 7 }) : v; } }); })();`;

/* the ear, installed in the shell once the music runs: three taps, 10 ms energy frames on the audio clock */
const EAR = `(function(){
  if (window.__FM) return;
  const ac = MUS.AC, sr = ac.sampleRate, HOP = Math.round(sr / 100);
  const FM = window.__FM = { sr: sr, buses: {}, lv: [], msgs: [], t0: ac.currentTime, perf0: performance.now() };
  function tap(name, node, band) {
    if (!node || (FM.buses[name] && FM.buses[name].node === node)) return;
    var src = node;
    if (band) { const hp = ac.createBiquadFilter(), lp = ac.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 150; lp.type = 'lowpass'; lp.frequency.value = 7000;
      node.connect(hp); hp.connect(lp); src = lp; }
    const B = FM.buses[name] = FM.buses[name] || { e: [], t: [], node: null, acc: 0, n: 0, tStart: null };
    B.node = node;
    const sp = ac.createScriptProcessor(2048, 2, 1), z = ac.createGain(); z.gain.value = 0;
    src.connect(sp); sp.connect(z); z.connect(ac.destination);
    sp.onaudioprocess = function (ev) {
      const L = ev.inputBuffer.getChannelData(0), R = ev.inputBuffer.numberOfChannels > 1 ? ev.inputBuffer.getChannelData(1) : L;
      let t = ev.playbackTime;
      for (let i = 0; i < L.length; i++) { const x = (L[i] + R[i]) * 0.5; B.acc += x * x; B.n++;
        if (B.n >= HOP) { B.e.push(B.acc / B.n); B.t.push(t + i / sr); B.acc = 0; B.n = 0; } }
    };
    B.sp = sp;
  }
  function look() {
    tap('music', window.__MUSVOL || MUS.MUSVOL);
    tap('musicPhone', window.__MUSVOL || MUS.MUSVOL, true);   /* what a phone's speaker plays of it: 150 Hz to 7 kHz */
    tap('effects', window.__SFXBUS);
    tap('total', window.__LIMITER || MUS.LIM);
  }
  look(); setInterval(look, 500);
  /* the level as the scheduler books it: what MUS.layers returned for each step, with that step's audio time */
  const ps = MUS.playStep;
  MUS.playStep = function (s, t, sc) {
    let lvl = null; try { lvl = (window.INTENSITY && INTENSITY.level) ? INTENSITY.level() : null; } catch (e) {}
    const r = ps.apply(MUS, arguments);
    try { FM.lv.push([t, MUS.layers, lvl, MUS.step, (window.SONGFENCE && SONGFENCE.now()) || null, MUS.playing ? 1 : 0]); } catch (e) {}
    if (FM.lv.length > 40000) FM.lv.shift();
    return r;
  };
  addEventListener('message', function (ev) { const m = ev.data; if (!m || !m.type || !/^BOHEMIA_(COMBAT_STARTED|PLAYER_HIT|SHOT_RESULT|FIGHT_TURN|FIGHT_OVER|SFX)$/.test(m.type)) return;
    const f = document.getElementById('fightFrame'); if (!f || ev.source !== f.contentWindow) return;
    FM.msgs.push({ at: ac.currentTime, type: m.type.replace('BOHEMIA_', ''), side: m.side || null, ev: m.ev || null, outcome: m.outcome || null }); });
})();`;

function db(x) { return 10 * Math.log10(x + 1e-12); }
function median(a) { if (!a.length) return null; const b = a.slice().sort((x, y) => x - y); return b[b.length >> 1]; }

/* THE PULSE: the onset envelope (the rise of log energy, half-wave, over 10 ms frames) folded on a period. A song with a
   kick or a bass on the beat piles its onsets in one bin of the 500 ms fold; a hum spreads them flat. Two control periods
   that are not the beat (430, 580 ms) say what 'flat' is for this very audio. */
function pulse(E, T, from, to) {
  const on = [], tt = [];
  for (let i = 1; i < E.length; i++) { if (T[i] < from || T[i] >= to) continue;
    const d = db(E[i]) - db(E[i - 1]); on.push(d > 0 && db(E[i]) > -70 ? d : 0); tt.push(T[i]); }
  if (on.length < 200) return null;
  const fold = (per, ph0) => { const nb = Math.round(per / 10), bins = new Array(nb).fill(0);
    for (let i = 0; i < on.length; i++) { const ph = ((tt[i] - ph0) * 1000 % per + per) % per; bins[Math.min(nb - 1, Math.floor(ph / 10))] += on[i]; }
    /* a pulse is a narrow pile: the peak three bins (30 ms) against the median bin */
    let best = 0; for (let b = 0; b < nb; b++) best = Math.max(best, bins[b] + bins[(b + 1) % nb] + bins[(b + nb - 1) % nb]);
    const md = median(bins) * 3 + 1e-9; return best / md; };
  const at = fold(500, from), c1 = fold(430, from), c2 = fold(580, from);
  return { at500: +at.toFixed(2), control: +Math.max(c1, c2).toFixed(2), clarity: +(at / Math.max(c1, c2, 1e-9)).toFixed(2), seconds: +(on.length / 100).toFixed(1) };
}

async function run(opts) {
  opts = opts || {};
  const dopts = opts.alpha ? { alpha: true, arm: ARM } : { keepCards: true, arm: ARM, beforeTap: async (pg) => { await throughTheTitle(pg); } };
  if (opts.profile) dopts.profile = opts.profile;
  if (opts.throttle) dopts.throttle = opts.throttle;
  const d = await drive.open(dopts);
  const p = d.page;
  const out = { surface: opts.alpha ? 'alpha' : 'demo', profile: opts.profile || 'phone_portrait', throttle: opts.throttle || 1 };
  try {
    /* the demo plays his song from the door; the alpha (the workshop) boots silent, so its fight is the test of 168(b):
       the fight never plays without music */
    if (opts.alpha) await p.waitForFunction(() => typeof MUS !== 'undefined' && !!MUS.MAST && MUS.AC && MUS.AC.state === 'running' && !!document.getElementById('cityFrame'), null, { timeout: 60000 }).catch(async () => {
      await p.evaluate(() => { MUS.audio(); }); });
    else await p.waitForFunction(() => typeof MUS !== 'undefined' && MUS.playing && MUS.AC && MUS.AC.state === 'running', null, { timeout: 60000 });
    out.silentBefore = await p.evaluate(() => !MUS.playing);
    await p.evaluate(EAR);
    await p.waitForTimeout(4000);   /* four seconds of the map before the fight: level 1 as he walks */
    out.mapEnd = await p.evaluate(() => MUS.AC.currentTime);
    await d.fr.evaluate(() => { roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 7 }); });
    let f = null;
    for (let i = 0; i < 400 && !f; i++) { const h = await p.$('#fightFrame'); if (h) { const c = await h.contentFrame();
      if (c && await c.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board && !!FIGHT.S.board).catch(() => false)) f = c; } if (!f) await p.waitForTimeout(150); }
    if (!f) throw new Error('the road fight never came up');
    out.boardAt = await p.evaluate(() => MUS.AC.currentTime);
    out.playingAtBoard = await p.evaluate(() => MUS.playing);
    await f.evaluate((spd) => { FIGHT_UI.auto = true; if (spd) FIGHT_UI.speed = spd; }, opts.speed || 0);
    let over = null;
    for (let i = 0; i < 800 && !over; i++) { over = await p.evaluate(() => (window.__FM.msgs.filter(m => m.type === 'FIGHT_OVER')[0]) || null); if (!over) await p.waitForTimeout(500); }
    if (!over) throw new Error('the fight never ended inside the window');
    await p.waitForTimeout(opts.after || 6000);   /* the end screen */
    const R = await p.evaluate(() => { const F = window.__FM; const b = {}; for (const k in F.buses) b[k] = { e: F.buses[k].e, t: F.buses[k].t };
      const FBx = window.FIGHTBEAT ? { state: FIGHTBEAT.state, err: FIGHTBEAT.err, hits: FIGHTBEAT.hits, notes: FIGHTBEAT.notes, by: FIGHTBEAT.by, fills: FIGHTBEAT.fills, entries: FIGHTBEAT.entries, cues: FIGHTBEAT.cues, started: FIGHTBEAT.started, lift: window.__FIGHTLIFT ? __FIGHTLIFT.gain.value : null } : null;
      return { buses: b, lv: F.lv, msgs: F.msgs, now: MUS.AC.currentTime, mix: window.getMix ? getMix() : null, playing: MUS.playing, fb: FBx, outLat: MUS.AC.outputLatency || 0, baseLat: MUS.AC.baseLatency || 0 }; });
    out.raw = R; out.over = over.at; out.errs = d.errs.slice(0, 5);
  } catch (e) { out.error = String(e && e.message || e).slice(0, 300); out.errs = d.errs.slice(0, 5); }
  await d.close();
  return out;
}

/* THE PULSE ON THE GAME'S OWN GRID (the live ear): the beats the transport booked (every step that is a beat, its own audio
   time) are where a 120 BPM pulse must be. The tap's clock runs a fixed latency behind the graph (two script-processor
   buffers, about 0.1 s), found once for the whole recording as the shift in 0 to 0.2 s that puts the most onsets on the
   beat; frames right after a dropped buffer are left out (a gap makes a false onset). 'onbeat' is the mean onset strength
   within 25 ms of a beat over the same on the other three sixteenths: 1 is no pulse. */
function gridPulse(B, beats, runs, shift) {
  const t = B.t, e = B.e, n = t.length, on = new Float64Array(n), ok = new Uint8Array(n);
  for (let i = 1; i < n; i++) { const gap = t[i] - t[i - 1] > 0.015; if (gap) { for (let k = i; k < Math.min(n, i + 4); k++) ok[k] = 2; }
    if (ok[i] !== 2) { ok[i] = 1; const d = db(e[i]) - db(e[i - 1]); on[i] = d > 0 && db(e[i]) > -75 ? d : 0; } }
  const bs = beats.slice().sort((a, b) => a - b);
  /* on the beat (within 25 ms of a booked beat) against the other three sixteenths of the same beat (within 25 ms of
     b + 125, 250, 375 ms): a line that runs on the sixteenths with nothing on the beat reads 1, a hum reads 1 */
  function ratio(sh, a0, b0) { let sN = 0, sO = 0, nN = 0, nO = 0, j = 0;
    for (let i = 0; i < n; i++) { if (ok[i] !== 1) continue; const tt = t[i] - sh; if (tt < a0 || tt >= b0) continue;
      while (j < bs.length - 1 && bs[j + 1] <= tt) j++;
      const ph = tt - bs[j]; if (ph < -0.03 || ph > 0.53) continue;
      const q = ph - 0.125 * Math.round(ph / 0.125);
      if (Math.abs(q) > 0.025) continue;
      const k = Math.round(ph / 0.125) % 4;
      if (k === 0) { sN += on[i]; nN++; } else { sO += on[i]; nO++; } }
    return nN > 40 && nO > 40 ? (sN / nN) / (sO / nO + 1e-9) : null; }
  if (shift == null) { let best = -1; for (let sh = 0; sh <= 0.2001; sh += 0.005) { const r = ratio(sh, -1e9, 1e9); if (r != null && r > best) { best = r; shift = sh; } } }
  return { shift: shift, per: runs.map(rn => ratio(shift, rn[0], rn[1])) };
}
function analyse(o) {
  if (o.error) return Object.assign({ error: o.error }, { surface: o.surface, profile: o.profile });
  const R = o.raw, M = R.buses.music, X = R.buses.effects, T = R.buses.total;
  const from = o.boardAt, to = o.over + 4;   /* the board up to four seconds into the end screen */
  const win = (B, a, b) => { const r = []; if (!B) return r; for (let i = 0; i < B.t.length; i++) if (B.t[i] >= a && B.t[i] < b) r.push([B.t[i], B.e[i]]); return r; };
  /* 250 ms windows: the music's level, the effects' level */
  const W = 0.25, rows = [];
  for (let t = from; t < to; t += W) {
    const m = win(M, t, t + W), x = win(X, t, t + W);
    const me = m.length ? m.reduce((a, r) => a + r[1], 0) / m.length : 0, xe = x.length ? x.reduce((a, r) => a + r[1], 0) / x.length : 0;
    rows.push({ t: t, m: db(me), x: db(xe) });
  }
  const playing = rows.filter(r => r.m > -60).length / Math.max(1, rows.length);
  const busy = rows.filter(r => r.x > -50);   /* windows with an effect sounding */
  const above = median(busy.map(r => r.m - r.x));
  const mLvl = median(rows.map(r => r.m)), xPeak = busy.length ? busy.map(r => r.x).sort((a, b) => b - a)[Math.floor(busy.length * 0.1)] : null;
  /* the levels, by the shell's ladder for each booked step */
  const lv = R.lv.filter(r => r[0] >= o.mapEnd - 4 && r[0] < to);
  /* the level that PLAYED on each booked step: the arrangement it read (MUS.layers 0, 2, 4 = levels 1, 2, 3) */
  const seg = {}; lv.forEach(r => { const k = 'L' + (r[1] >= 4 ? 3 : (r[1] >= 2 ? 2 : 1)); seg[k] = seg[k] || []; seg[k].push(r[0]); });
  const levels = {};
  for (const k in seg) {
    /* contiguous runs of that level, pulse measured over all of them together (each run needs a second at least) */
    const ts = seg[k]; let runs = [], a = ts[0], b = ts[0];
    for (let i = 1; i < ts.length; i++) { if (ts[i] - b > 0.2) { runs.push([a, b + 0.125]); a = ts[i]; } b = ts[i]; } runs.push([a, b + 0.125]);
    let sec = 0, P = [];
    const MP = R.buses.musicPhone || M;
    runs.forEach(rn => { sec += rn[1] - rn[0]; if (rn[1] - rn[0] >= 2) { const q = pulse(MP.e, MP.t, rn[0], rn[1]); if (q) P.push(q); } });
    const w = P.reduce((a, q) => a + q.seconds, 0);
    levels[k] = { seconds: +sec.toFixed(1), runs: runs.length, each: runs.filter(rn => rn[1] - rn[0] >= 2).map(rn => { const q = pulse(MP.e, MP.t, rn[0], rn[1]); return [+(rn[0] - from).toFixed(1), +(rn[1] - rn[0]).toFixed(1), q && q.clarity]; }),
      pulse: w ? { at500: +(P.reduce((a, q) => a + q.at500 * q.seconds, 0) / w).toFixed(2), control: +(P.reduce((a, q) => a + q.control * q.seconds, 0) / w).toFixed(2),
        clarity: +(P.reduce((a, q) => a + q.clarity * q.seconds, 0) / w).toFixed(2), seconds: +w.toFixed(1) } : null,
      musicDb: +median(rows.filter(r => runs.some(rn => r.t >= rn[0] && r.t < rn[1])).map(r => r.m) || [null]) };
  }
  /* the same levels on the game's own beat grid */
  const beats = R.lv.filter(r => r[3] % 4 === 0).map(r => r[0]);
  const PB = R.buses.musicPhone || M;
  const allRuns = []; for (const k in seg) { const ts = seg[k]; let a = ts[0], b = ts[0];
    for (let i = 1; i < ts.length; i++) { if (ts[i] - b > 0.2) { allRuns.push([k, a, b + 0.125]); a = ts[i]; } b = ts[i]; } allRuns.push([k, a, b + 0.125]); }
  const G = gridPulse(PB, beats, allRuns.map(r => [r[1], r[2]]), null);
  const grid = {}; allRuns.forEach((r, i) => { const v = G.per[i]; if (v == null) return; const w = r[2] - r[1]; const g = grid[r[0]] = grid[r[0]] || { s: 0, w: 0, runs: [] }; g.s += v * w; g.w += w; g.runs.push([+(r[1] - from).toFixed(1), +w.toFixed(1), +v.toFixed(2)]); });
  for (const k in grid) { grid[k].onbeat = +(grid[k].s / grid[k].w).toFixed(2); delete grid[k].s; grid[k].seconds = +grid[k].w.toFixed(1); delete grid[k].w; }
  const songs = {}; lv.forEach(r => { if (r[4]) songs[r[4]] = 1; });
  const turns = R.msgs.filter(m => m.type === 'FIGHT_TURN');
  /* every turn: the level the shell books next, and when (the next bar line, two seconds at 120 BPM, at most) */
  /* the level that PLAYED is the arrangement each booked step read (MUS.layers 0, 2, 4 = levels 1, 2, 3); a turn is owed a
     change only if the next turn (or the end) comes after the next bar line */
  const lvOf = x => x >= 4 ? 3 : (x >= 2 ? 2 : 1);
  const ends = R.msgs.filter(m => m.type === 'FIGHT_OVER');
  const turnMoves = turns.map((m, i) => { const want = m.side === 'them' ? 2 : 3;
    const next = (turns[i + 1] || ends[0] || { at: Infinity }).at;
    const booked = lv.filter(r => r[0] >= m.at);
    const hit = booked.filter(r => r[0] < next + 0.6 && lvOf(r[1]) === want)[0];
    const was = (lv.filter(r => r[0] < m.at).slice(-1)[0] || [0, 0])[1];
    const firstBar = booked.filter(r => r[3] % 16 === 0)[0];
    const owed = firstBar ? firstBar[0] < next : false;
    return { side: m.side, at: +(m.at - from).toFixed(2), want: want, was: lvOf(was), owed: owed, landedIn: hit ? +(hit[0] - m.at).toFixed(3) : null, onBar: hit ? hit[3] % 16 === 0 : null, step: hit ? hit[3] : null }; });
  return { surface: o.surface, profile: o.profile, throttle: o.throttle, mix: R.mix, silentBefore: o.silentBefore, playingAtBoard: o.playingAtBoard, fightSeconds: +(o.over - from).toFixed(1),
    playing: +playing.toFixed(3), musicMedianDb: +(mLvl || 0).toFixed(1), effectsLoud10Db: xPeak == null ? null : +xPeak.toFixed(1), musicMinusEffectsDb: above == null ? null : +above.toFixed(1),
    levels: levels, grid: grid, tapShift: G.shift, songs: Object.keys(songs), turns: turns.length, turnMoves: turnMoves.slice(0, 30),
    sfx: R.msgs.filter(m => m.type === 'SFX').length, errs: o.errs, fb: R.fb };
}

module.exports = { run, analyse, pulse, EAR, ARM };

if (require.main === module) {
  const a = process.argv.slice(2), opt = {};
  for (let i = 0; i < a.length; i++) {
    if (a[i] === '--alpha') opt.alpha = true;
    else if (a[i] === '--profile') opt.profile = a[++i];
    else if (a[i] === '--throttle') opt.throttle = +a[++i];
    else if (a[i] === '--speed') opt.speed = +a[++i];
    else if (a[i] === '--json') opt.json = a[++i];
  }
  run(opt).then(o => { const A = analyse(o); console.log(JSON.stringify(A, null, 1));
    if (opt.json) fs.writeFileSync(opt.json, JSON.stringify({ analysis: A, from: o.boardAt, mapEnd: o.mapEnd, over: o.over, raw: o.raw ? { msgs: o.raw.msgs, lv: o.raw.lv, phone: o.raw.buses.musicPhone, music: o.raw.buses.music } : null })); process.exit(0); })
    .catch(e => { console.error(e); process.exit(1); });
}
