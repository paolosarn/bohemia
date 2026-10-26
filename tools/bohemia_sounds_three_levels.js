#!/usr/bin/env node
/* BOHEMIA -- HIS SONGS AT THREE LEVELS, IN THE GAME (SOUNDS, 10/25/26, rules 167, 168, 181, 207).

   PAOLO 10/25: 'one intensity on the map or chilling, two when they're attacking, three when it's your turn to attack,
   real combat music'; 'everything at 120 BPM'. Then, having heard the cards (rule 207): 'I like the songs, I want you to
   implement them; there has to be a pretty big difference between the opponent's turn and my turn... it can't just be one
   quiet thing that's the difference between their turn and your turn.' MEASURED ON THE FIRST CARDS: their turn to his
   turn was 1.2 to 3.0 dB through a phone (-32.4 to -30.0), a nudge. So the levels are remade with the gap built in:

   ONE SONG, THREE LEVELS, ONE TIMELINE. Each level is his own engine playing his own row (MUS.playStep, synthV, drumV,
   his SONG_ARR form and SONG_ROOT key moves, the map's late beat), rendered offline from step 0, over THE WHOLE 64-BAR
   PASS the game plays a song for (128 s; the first cards were 32 bars), so bar N of level 1, 2 and 3 is the same bar of
   the same song in the same key and the game plays them ahead, a level change landing on the beat (rule 175(b)).
     LEVEL 1, THE MAP (approved as it was): his song exactly as the map plays it (his recording's own pass, his gain) with
       ONE thing added, a soft 120 BPM pulse: his own kick on every beat and his clock tick on the 8ths, quiet, under him.
     LEVEL 2, THEIR TURN, TENSION ONLY (207(b): 'a pulse, the bass, held notes'): his song pulled back to its bed, ONLY his
       bass voice and his pads sound (his tune, his accents and his kit are held back: the tune is your turn's), a
       heartbeat kick on every beat, the clock ticking 16ths, a low pedal on the root in 8ths, and his chord held a bar at
       a time in the pad. No backbeat, no tom, no lead. Set 3.6 dB over level 1 through a phone (207(b): at least 3).
     LEVEL 3, YOUR TURN, EVERYTHING (the only level with the full drums and the lead): his engine's top tier (MUS.layers
       4) with his tune, a driving kit (kick with pickups, clap and knock on 2 and 4, 16th hats, a hit on each phrase), a
       bass in driving 8ths with the octave jump, and the hook in his song's own lead voice. Set 6.8 dB over level 2
       through a phone (207(b): at least 6); if the room ran out at the top, level 2 would come down, never level 3.
     THE HIT (207(c)): a one-shot in his kit (boom, his kick, clap, a ride and his bass on the root), at level 3's own
       gain: the game strikes it on the beat the turn comes back to him, and the card's A FIGHT does the same.
   THE GAP IS SET BY MEASURING, NOT BY GUESSING PART GAINS: levels 2 and 3 are rendered, then one gain each brings them to
   level 1 + 3.6 and level 1 + 10.4 dB through a phone (two 350 Hz high-passes, the measure tool's own), through a true peak
   limit at -0.5 dBFS, the gain and the limit iterated until the phone number lands. Level 1 is never touched.
   Every added part is one of his engine's voices (drumV, synthV); no sample, no noise recipe, nothing new to his machine.

     node tools/bohemia_sounds_three_levels.js record "THE VAULT"     renders the three levels, the hit and the fight run
     node tools/bohemia_sounds_three_levels.js record all              every song he plays (his OVERWORLD NIGHT + REPO MAN)
     node tools/bohemia_sounds_three_levels.js register all --write    the cards (a card already there gets the new sha)
   writes slices/vote/songs/three_levels/<slug>/{level_1,level_2,level_3,hit,a_fight}.mp3 and measured.json, and the index
   the card page and the game read (slices/vote/songs/three_levels/index.json). Card page: BOHEMIA_THREE_LEVELS_10_25_26.html.
   The game: tools/bohemia_sounds_the_songs_go_in_patch.py. Gates: gates/three_levels_vote_gate.js,
   gates/the_songs_go_in_gate.js. */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const ROOT = path.dirname(__dirname);
const H = require(path.join(ROOT, 'tools', 'bohemia_sounds_his_machine.js'));   /* REUSE-FIRST: the alpha, opened read only */
const OUTD = path.join(ROOT, 'slices', 'vote', 'songs', 'three_levels');
const HISM = path.join(ROOT, 'slices', 'vote', 'songs', 'his_night_songs', 'measured.json');
const BARS = 64;
const SR = 44100;
/* THE GAP (rule 207(b)), through a phone's speaker, over level 1 */
const GAP = { 2: 3.6, 3: 10.4 };
const CEIL = 0.944;   /* -0.5 dBFS */
/* the fight run: from the bar his beat has arrived (bar 9 on the map), four bars each: the map, their turn, your turn,
   their turn, your turn. The change lands on the bar line; into 3 the hit, out of 3 a drop. */
const RUN = { from: 8, parts: [[1, 'THE MAP'], [2, 'THEIR TURN'], [3, 'YOUR TURN'], [2, 'THEIR TURN'], [3, 'YOUR TURN']], bars: 4 };
/* the order his songs are recorded in; the first is the card he hears first */
const SONGS = ['THE VAULT', 'GHOST IN THE GRID', 'SLOW BLEED', 'SATELLITE PRAYER', 'SLOW CREEP', 'THE PIT BOSS IS GONE', 'THE ORGAN IN THE DROWNED CHAPEL', 'CAMPFIRE CONFESSION', 'REPO MAN'];
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const md5 = b => crypto.createHash('md5').update(b).digest('hex');

/* ONE LEVEL, ONE PASS of his engine into an OfflineAudioContext. Level 1 comes back as his gain made it; levels 2 and 3
   come back scaled to a -6 dBFS peak (their loudness is set afterwards, by measuring) with the hit beside level 3. */
async function level(p, name, lv, outGain, mp, hot, onlyC, scaleC) {
  return p.evaluate(async ({ name, lv, bars, outGain, mp, hot, onlyC, scaleC }) => {
    const SR = 44100, steps = bars * 16, sd = MUS.stepDur(), secs = steps * sd + 2.5;
    const li = MLOOPS.findIndex(x => x.n === name); if (li < 0) return { err: 'no song ' + name };
    MUS.audio();
    const save = { AC: MUS.AC, MAST: MUS.MAST, OUT: MUS.OUT, cur: MUS.cur, curSlot: MUS.curSlot, layers: MUS.layers, step: MUS.step, on: CITYMUS.on };
    const sv0 = synthV;
    /* one render: the song's steps (or only the hit), into the chain his songs go through */
    /* stem (level 2 only): 'a' his bed (his bass voice and his pads) with the heartbeat kick and the pedal; 'b' the held chord
       and the ticking alone (no engine step). The two are mixed afterwards in the ratio that makes level 2 the same climb
       through a phone and on full-range speakers (MEASURED: mixed by guessing, THE VAULT's level 2 came out +10.3 dB on a
       phone for +3.6 LU on full range, the chord's mids against his song's sub-bass, and level 3 was crushed 14 dB to clear it). */
    async function pass(OAC, hitOnly, stem) {
      const out0 = OAC.createGain(); out0.gain.value = outGain;
      /* level 1 is his song as approved: straight to the output. Levels 2 and 3 are new music, through a gentle compressor
         so the added kit sits with his song (never on level 1, never on his two hot songs: their low end at -7 dBFS holds a
         compressor down and every part under it with it, measured on the first cards). THE OFFSET (his two hot songs,
         levels 2 and 3): SLOW BLEED's spectral centre sits at 2 to 3 Hz, a DC offset under hearing, so a 15 Hz high-pass
         goes in front; level 1 keeps his song exactly as approved, offset and all. */
      let songBus = out0, partBus = out0;
      if (hot && lv > 1) { const dc = OAC.createBiquadFilter(); dc.type = 'highpass'; dc.frequency.value = 15; dc.Q.value = 0.7; out0.connect(dc); dc.connect(OAC.destination); }
      else if (lv === 3) {
        const lim = OAC.createDynamicsCompressor();
        lim.threshold.value = -9; lim.knee.value = 6; lim.ratio.value = 8; lim.attack.value = 0.003; lim.release.value = 0.12;
        out0.connect(lim); lim.connect(OAC.destination);
      } else out0.connect(OAC.destination);
      /* REPO MAN PLAYS AS THE MACHINE PARTY (his YES 10/19, rule 122): exactly the game's own wiring (SONGFENCE.machine in
         the alpha): take A's hall and tape, the recorder's trim, the machine answering his kick and hat. The added parts go
         into the same chain; they call his drumV from BEFORE the machine wraps it, so the machine answers his song's kick
         and never the pulse's. */
      let X = null; const dv0 = drumV;
      if (mp) {
        X = window.MACHINEPARTY; await X.loadFrom(OAC, window.__mpBytes);
        const trim = OAC.createGain(); trim.gain.value = Math.pow(10, mp.trimDb / 20); trim.connect(out0);
        const ch = X.chain(OAC, trim, { hall: mp.spec.hall, tape: mp.spec.tape });
        X.attach(mp.spec, { music: ch.input, machine: ch.machine });
        songBus = ch.input; partBus = ch.input;
      }
      const part = g => { const n = OAC.createGain(); n.gain.value = g; n.connect(partBus); return n; };
      MUS.AC = OAC; MUS.MAST = songBus; MUS.OUT = songBus; MUS.cur = MFACTIONS.length + li; MUS.curSlot = 1;
      MUS.layers = lv === 3 ? 4 : 0;                     /* level 3 is his top tier; level 2 is his bed, never his tier 2 */
      CITYMUS.on = true;                                  /* the map owns the music: his 9/12 late beat, same timeline */
      const f = MUS.fac(), hz = x => MUS.noteHz(x), sc = f.scale, n = sc.length;
      const kick = (f.kit && f.kit.k) || 'punchk', lead = MUS.leadVoice((f.inst && f.inst.l) || 'pluck');
      const bassV = (f.inst && f.inst.b && f.inst.b !== 'osc') ? f.inst.b : 'sub';
      const deg = d => sc[((d % n) + n) % n] + 12 * Math.floor(d / n);
      const counts = {};
      /* LEVEL 2 IS HIS BED (207(b)): only his bass voice and his pads reach the output; his tune, his accents and his kit
         are held (counted, never sounded). His bass played as a bare oscillator (an 'osc' row) passes, it is no synthV. */
      const dvW = drumV;
      if (lv === 2) {
        const keep = { pad: 1 }; keep[String((f.inst && f.inst.b) || '')] = 1;
        synthV = function (kind) { if (!keep[kind]) { counts['held:s:' + kind] = (counts['held:s:' + kind] || 0) + 1; return; } return sv0.apply(this, arguments); };
        drumV = function (kind) { counts['held:d:' + kind] = (counts['held:d:' + kind] || 0) + 1; };
      }
      /* the hook: two bars you can hum, the second answers the first, the fourth bar of a phrase lifts */
      const HOOK = [[0, 0], [2, 0], [4, 2], [6, 1], [7, 0], [10, 4], [12, 3], [14, 2]];
      const ANS = [[0, 0], [2, 0], [4, 2], [6, 4], [8, 5], [11, 4], [12, 2], [14, 1]];
      const LIFT = [[0, 5], [2, 4], [4, 5], [6, 7], [8, 5], [10, 4], [12, 2], [14, 4]];
      /* the parts' balance inside a level (its loudness is set afterwards): level 1's pulse soft under him, as approved;
         level 3's kit, bass and hook as approved on the first cards */
      const P = hitOnly ? { boom: part(0.75), kick: part(0.9), clap: part(0.55), ride: part(0.35), bass: part(0.6) }
        : lv === 1 ? { pulse: part(0.40), clock: part(0.20) }
        : lv === 2 ? (stem === 'b' ? { kick: part(0), tick: part(0.12), pedal: part(0), held: part(1.0), sub: part(0) }
          : stem === 'c' ? { kick: part(0), tick: part(0), pedal: part(0), held: part(0), sub: part(1.0) }
          : { kick: part(0.95), tick: part(0), pedal: part(0.80), held: part(0), sub: part(0) })
        : { kick: part(0.85), snare: part(0.70), hat: part(0.30), hit: part(0.45), bass: part(0.50), hook: part(1.0) };
      const D = (k, node, t) => { if (!node.gain.value) return; counts['d:' + k] = (counts['d:' + k] || 0) + 1; dv0(k, OAC, node, t); };
      const S = (k, node, semi, t, g, dur) => { if (!node.gain.value) return; counts['s:' + k] = (counts['s:' + k] || 0) + 1; sv0(k, OAC, node, hz, dur || sd, semi, t, g); };
      let err = null;
      try {
        if (hitOnly) {
          const t = 0.05, c = MUS.songCtx(0), rs = sc[c.rs % n] || 0;
          D('boom', P.boom, t); D(kick, P.kick, t); D('clap', P.clap, t); D('ride', P.ride, t);
          S(bassV, P.bass, f.root - 43 + rs, t, 0.12, sd * 4);
        } else for (let s = 0; s < steps; s++) {
          const t = 0.05 + s * sd, c = MUS.songCtx(s), q = s % 16, rs = sc[c.rs % n] || 0;
          MUS.step = s; if (stem !== 'b' && stem !== 'c') MUS.playStep(q, t, c);
          if (lv === 1) {
            if (q % 4 === 0) D(kick, P.pulse, t);
            if (q % 2 === 0) D('clickh', P.clock, t);
          } else if (lv === 2) {
            if (q % 4 === 0) D(kick, P.kick, t);
            if (q === 14 && c.barIn % 2 === 1) D(kick, P.kick, t);           /* the heartbeat's second knock */
            D('clickh', P.tick, t);
            if (q % 2 === 0) S(bassV, P.pedal, f.root - 55 + rs, t, 0.10);
            /* his chord, held a bar: the root, the third and the fifth of his own scale, under where his tune sits */
            if (q === 0) for (const d of [0, 2, 4]) S('pad', P.held, f.root - 31 + rs + deg(d), t, 0.07, sd * 16);
            /* the floor under their turn: his root held a bar in the sub, where his song's own weight is (stem c) */
            if (q === 0) S('sub', P.sub, f.root - 55 + rs, t, 0.12, sd * 16);
          } else {
            if (q === 0 || q === 4 || q === 8 || q === 12 || q === 7 || q === 10) D(kick, P.kick, t);
            if (q === 4 || q === 12) { D('clap', P.snare, t); D('knock', P.snare, t); }
            if (c.fill && q >= 12) D('knock', P.snare, t);
            D('clickh', P.hat, t); if (q % 4 === 2) D('tight', P.hat, t);
            if (q === 0 && c.barIn === 0) D('boom', P.hit, t);
            if (q % 2 === 0) S(bassV, P.bass, f.root - 43 + rs + (q % 4 === 2 ? 12 : 0), t, 0.11);
            const ph = c.barIn === 3 ? LIFT : (c.barIn % 2 ? ANS : HOOK);
            for (const [at, d] of ph) if (q === at) S(lead, P.hook, f.root - 19 + rs + deg(d), t, 0.07, sd * 2);
          }
        }
      } catch (e) { err = e.message; }
      synthV = sv0; drumV = dvW;
      if (X) { X.detach(); X.log = []; }
      return { err, counts, f, kick, lead, bassV };
    }
    if (onlyC) {   /* level 2's sub stem alone, at the scale its other two stems were kept at */
      const CAC = new OfflineAudioContext(1, Math.ceil(SR * secs), SR), rc = await pass(CAC, false, 'c');
      MUS.AC = save.AC; MUS.MAST = save.MAST; MUS.OUT = save.OUT; MUS.cur = save.cur; MUS.curSlot = save.curSlot; MUS.layers = save.layers; MUS.step = save.step; CITYMUS.on = save.on;
      if (rc.err) return { err: rc.err };
      const CL = (await CAC.startRendering()).getChannelData(0), pc = new Int16Array(CL.length);
      for (let i = 0; i < Math.round(0.045 * SR); i++) CL[i] = 0;
      for (let i = 0; i < CL.length; i++) pc[i] = Math.max(-32767, Math.min(32767, Math.round(CL[i] * scaleC * 32767)));
      const u8 = new Uint8Array(pc.buffer); let bin = ''; for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
      return { stemC: btoa(bin), countsC: rc.counts };
    }
    const OAC = new OfflineAudioContext(1, Math.ceil(SR * secs), SR);
    const r = await pass(OAC, false, lv === 2 ? 'a' : null);
    let bAC = null, rb = null;
    if (!r.err && lv === 2) { bAC = new OfflineAudioContext(1, Math.ceil(SR * secs), SR); rb = await pass(bAC, false, 'b'); for (const k in rb.counts) r.counts[k] = (r.counts[k] || 0) + rb.counts[k]; }
    let hitAC = null, rh = null;
    if (!r.err && lv === 3) { hitAC = new OfflineAudioContext(1, Math.ceil(SR * 2.5), SR); rh = await pass(hitAC, true); }
    MUS.AC = save.AC; MUS.MAST = save.MAST; MUS.OUT = save.OUT; MUS.cur = save.cur; MUS.curSlot = save.curSlot; MUS.layers = save.layers; MUS.step = save.step; CITYMUS.on = save.on;
    if (r.err) return { err: r.err };
    if (rh && rh.err) return { err: 'the hit: ' + rh.err };
    const pcm16 = (L, scale) => {
      const pcm = new Int16Array(L.length); let clip = 0;
      for (let i = 0; i < L.length; i++) { const v = Math.round(L[i] * scale * 32767); if (Math.abs(v) > 32767) clip++; pcm[i] = Math.max(-32767, Math.min(32767, v)); }
      const u8 = new Uint8Array(pcm.buffer); let bin = ''; for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
      return { b64: btoa(bin), clip };
    };
    const L = (await OAC.startRendering()).getChannelData(0);
    const BL = bAC ? (await bAC.startRendering()).getChannelData(0) : null;
    /* the peak that sets the scale is the song's, from step 0 on: the 15 Hz filter's answer to his hot songs' offset switching
       on at t = 0 is a spike in the silence before it (SLOW CREEP: the whole peak at 0.000 s kept the song 26 dB down in 16 bits) */
    const z0 = lv === 1 ? 0 : Math.round(0.045 * SR);
    if (z0) { for (let i = 0; i < z0; i++) { L[i] = 0; if (BL) BL[i] = 0; } }
    let pk = 0; for (let i = z0; i < L.length; i++) { const a = Math.abs(L[i]); if (a > pk) pk = a; }
    if (BL) for (let i = z0; i < BL.length; i++) { const a = Math.abs(BL[i]); if (a > pk) pk = a; }
    /* level 1 as his gain made it; levels 2 and 3 to a -6 dBFS peak, their loudness is set by measuring afterwards */
    const scale = lv === 1 ? 1 : (pk > 0 ? 0.5 / pk : 1);
    const main = pcm16(L, scale);
    let stemB = null;
    if (BL) stemB = pcm16(BL, scale).b64;
    let hit = null;
    if (hitAC) { const HL = (await hitAC.startRendering()).getChannelData(0); for (let i = 0; i < Math.round(0.045 * SR); i++) HL[i] = 0; hit = pcm16(HL, scale).b64; }
    const f = r.f;
    return { b64: main.b64, stemB, hit, scale, sr: SR, sd, clipped: main.clip, root: f.root, scale_notes: f.scale, lead: r.lead, bass: r.bassV, kick: r.kick, klay: f.klay || 'drive', arr: MUS.ARR.slice(0, 16), rt: MUS.RT.slice(0, 16), counts: r.counts };
  }, { name, lv, bars: BARS, outGain, mp: mp || null, hot: !!hot, onlyC: !!onlyC, scaleC: scaleC || 1 });
}

/* ---- THE GAP, SET BY MEASURING (Node side, on the rendered samples) ------------------------------------------------- */
/* through a phone's speaker: two second-order Butterworth high-passes at 350 Hz (the measure tool's own, in time) */
function phoneDb(x) {
  const w0 = 2 * Math.PI * 350 / SR, c = Math.cos(w0), al = Math.sin(w0) / (2 * Math.SQRT1_2), a0 = 1 + al;
  const b0 = (1 + c) / 2 / a0, b1 = -(1 + c) / a0, b2 = (1 + c) / 2 / a0, a1 = -2 * c / a0, a2 = (1 - al) / a0;
  let y = x;
  for (let k = 0; k < 2; k++) {
    const o = new Float64Array(y.length); let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    for (let i = 0; i < y.length; i++) { const v = y[i], w = b0 * v + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2; x2 = x1; x1 = v; y2 = y1; y1 = w; o[i] = w; }
    y = o;
  }
  let s = 0; for (let i = 0; i < y.length; i++) s += y[i] * y[i];
  return 10 * Math.log10(Math.max(s / y.length, 1e-24));
}
/* AND THROUGH FULL-RANGE SPEAKERS (a computer, his car on Bluetooth): ITU-R BS.1770's K-weighting (a high shelf +4 dB at
   1.68 kHz, a high-pass at 38 Hz), ungated, in LUFS. MEASURED on THE VAULT's first take of the new level 2: +3.6 dB on a
   phone and 2.5 LU UNDER level 1 on full-range speakers (the ticking carried the phone, the low end was gone), so every
   level is set by both ears: the gain is the larger of the two that reach the targets. */
function kDb(x) {
  const fs = SR, stage = (b, a) => { const o = new Float64Array(x.length); let x1 = 0, x2 = 0, y1 = 0, y2 = 0; for (let i = 0; i < x.length; i++) { const v = x[i], w = (b[0] * v + b[1] * x1 + b[2] * x2 - a[1] * y1 - a[2] * y2) / a[0]; x2 = x1; x1 = v; y2 = y1; y1 = w; o[i] = w; } return o; };
  let w0 = 2 * Math.PI * 1681.974450955533 / fs, A = Math.pow(10, 3.99984385397 / 40), al = Math.sin(w0) / (2 * 0.7071752369554193), c = Math.cos(w0), sA = 2 * Math.sqrt(A) * al;
  const s1 = stage([A * ((A + 1) + (A - 1) * c + sA), -2 * A * ((A - 1) + (A + 1) * c), A * ((A + 1) + (A - 1) * c - sA)], [(A + 1) - (A - 1) * c + sA, 2 * ((A - 1) - (A + 1) * c), (A + 1) - (A - 1) * c - sA]);
  w0 = 2 * Math.PI * 38.13547087613982 / fs; al = Math.sin(w0) / (2 * 0.5003270373253953); c = Math.cos(w0);
  const y = (function (inp) { const o = new Float64Array(inp.length), b = [(1 + c) / 2, -(1 + c), (1 + c) / 2], a = [1 + al, -2 * c, 1 - al]; let x1 = 0, x2 = 0, y1 = 0, y2 = 0; for (let i = 0; i < inp.length; i++) { const v = inp[i], w = (b[0] * v + b[1] * x1 + b[2] * x2 - a[1] * y1 - a[2] * y2) / a[0]; x2 = x1; x1 = v; y2 = y1; y1 = w; o[i] = w; } return o; })(s1);
  let s = 0; for (let i = 0; i < y.length; i++) s += y[i] * y[i];
  return -0.691 + 10 * Math.log10(Math.max(s / y.length, 1e-24));
}
/* UNDER HEARING, OUT (levels 2 and 3 only, never level 1): a fourth-order Butterworth high-pass at 20 Hz. MEASURED: SLOW CREEP's
   level 3, its offset riding at 2 to 3 Hz under the 15 Hz filter in the page, held the true peak limit 23 dB down to bring
   what a person hears to its place; nothing a speaker plays is under 20 Hz, and both ears' measures start above it */
function hp20(x) {
  /* AND THE FIRST 40 MS ARE SILENT: step 0 is at 0.05 s, and before it a filter in the page answers his hot songs' offset
     switching on at t = 0 with a spike (MEASURED: SLOW CREEP's level 3, its whole peak at 0.000 s, the true peak limit's
     worst 23 dB there and nowhere else) */
  const out = Float32Array.from(x), z0 = Math.round(0.04 * SR), z1 = Math.round(0.048 * SR);
  for (let i = 0; i < z1 && i < out.length; i++) out[i] *= i < z0 ? 0 : (i - z0) / (z1 - z0);
  const w0 = 2 * Math.PI * 20 / SR, c = Math.cos(w0);
  for (const Q of [0.5411961, 1.3065630]) {
    const al = Math.sin(w0) / (2 * Q), a0 = 1 + al, b0 = (1 + c) / 2 / a0, b1 = -(1 + c) / a0, b2 = (1 + c) / 2 / a0, a1 = -2 * c / a0, a2 = (1 - al) / a0;
    let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    for (let i = 0; i < out.length; i++) { const v = out[i], w = b0 * v + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2; x2 = x1; x1 = v; y2 = y1; y1 = w; out[i] = w; }
  }
  return out;
}
/* a true peak limit: the gain that keeps every sample under the ceiling, held 5 ms ahead, released over 80 ms */
function limit(x) {
  const n = x.length, AH = Math.round(SR * 0.005), REL = Math.exp(-1 / (SR * 0.08));
  const need = new Float32Array(n); for (let i = 0; i < n; i++) { const a = Math.abs(x[i]); need[i] = a > CEIL ? CEIL / a : 1; }
  const hold = new Float32Array(n), dq = new Int32Array(n); let h = 0, tl = 0;
  for (let i = n - 1; i >= 0; i--) { while (tl > h && need[dq[tl - 1]] >= need[i]) tl--; dq[tl++] = i; while (dq[h] > i + AH) h++; hold[i] = need[dq[h]]; }
  const y = new Float32Array(n); let g = 1, worst = 1, red = 0;
  for (let i = 0; i < n; i++) { const w = hold[i]; g = w < g ? w : w - (w - g) * REL; y[i] = x[i] * g; if (g < worst) worst = g; red += 1 - g; }
  return { y, worst_db: +(20 * Math.log10(worst)).toFixed(2), mean_reduction_db: +(20 * Math.log10(1 - red / n)).toFixed(3) };
}
const f32 = i16 => { const o = new Float32Array(i16.length); for (let i = 0; i < i16.length; i++) o[i] = i16[i] / 32767; return o; };
const i16 = x => { const o = new Int16Array(x.length); let clip = 0; for (let i = 0; i < x.length; i++) { const v = Math.round(x[i] * 32767); if (Math.abs(v) > 32767) clip++; o[i] = Math.max(-32767, Math.min(32767, v)); } o.clip = clip; return o; };
/* LEVEL 2'S TWO STEMS, MIXED SO BOTH EARS CLIMB ALIKE: b, the chord and the tick's weight, solves
   (Pa + b^2 Pb) / (Ka + b^2 Kb) = P1 / K1 (the stems are separate sounds, so their powers add), then it is checked on the
   real mix; a song whose bed already carries more phone than level 1 takes no chord weight (b = 0.15, the chord still there) */
function mix2(a, b, l1) {
  const pw = (x, f) => Math.pow(10, f(x) / 10), Pa = pw(a, phoneDb), Ka = pw(a, kDb), Pb = pw(b, phoneDb), Kb = pw(b, kDb), q = pw(l1, phoneDb) / pw(l1, kDb);
  let w2 = (q * Ka - Pa) / (Pb - q * Kb);
  if (!(w2 > 0.0225)) w2 = 0.0225; if (w2 > 100) w2 = 100;
  const w = Math.sqrt(w2), y = new Float32Array(a.length); for (let i = 0; i < a.length; i++) y[i] = a[i] + w * (b[i] || 0);
  return { y, b_db: +(20 * Math.log10(w)).toFixed(2) };
}
/* AND WHEN HIS BED ALONE ALREADY CARRIES MORE PHONE THAN HIS SONG (MEASURED: THE PIT BOSS IS GONE, bed 0.091 of its K power
   in the phone's band against his song's 0.080, so no chord weight could even it and level 2 came out +6.1 dB on a phone
   for +3.6 LU), the sub stem (his root held in the sub, stem c) goes under it first, just enough to bring the bed below his
   song's balance with room for the chord, then the chord is solved as above */
function mix3(a, b, c, l1) {
  const pw = (x, f) => Math.pow(10, f(x) / 10), q = pw(l1, phoneDb) / pw(l1, kDb);
  const Pa = pw(a, phoneDb), Ka = pw(a, kDb), Pc = pw(c, phoneDb), Kc = pw(c, kDb);
  /* the sub weight that puts the bed at 80 percent of his song's phone share */
  let c2 = Pa / Ka > 0.8 * q ? (Pa - 0.8 * q * Ka) / (0.8 * q * Kc - Pc) : 0;
  if (!(c2 >= 0)) c2 = 0; if (c2 > 100) c2 = 100;
  const cw = Math.sqrt(c2), ac = new Float32Array(a.length); for (let i = 0; i < a.length; i++) ac[i] = a[i] + cw * (c[i] || 0);
  const m = mix2(ac, b, l1);
  return { y: m.y, b_db: m.b_db, c_db: cw ? +(20 * Math.log10(cw)).toFixed(2) : null };
}
/* one gain and the limit, iterated until BOTH ears are at or over their targets and the one that decides lands on its
   target (it never moves level 1): t = { phone, k } */
function fit(x, t) {
  const short = (y) => Math.max(t.phone - phoneDb(y), t.k - kDb(y));
  let g = Math.pow(10, short(x) / 20), r = null, m = 0;
  for (let it = 0; it < 8; it++) {
    const y = new Float32Array(x.length); for (let i = 0; i < x.length; i++) y[i] = x[i] * g;
    r = limit(y); m = short(r.y);
    if (m <= 0.0 && m > -0.08) break;
    g *= Math.pow(10, (m + 0.02) / 20);
  }
  return { y: r.y, gain: g, phone_db: +phoneDb(r.y).toFixed(2), k_db: +kDb(r.y).toFixed(2), limiter_worst_db: r.worst_db, limiter_mean_db: r.mean_reduction_db };
}

/* the measure his machine's own tool uses: rms, peak, phone rms, per bar */
const measure = raws => JSON.parse(execFileSync('python3', ['-I', path.join(ROOT, 'tools', 'bohemia_sounds_his_machine_measure.py')].concat(raws), { encoding: 'utf8', maxBuffer: 64 << 20 }));
const toMp3 = (raw, out) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 's16le', '-ar', '44100', '-ac', '1', '-i', raw, '-c:a', 'libmp3lame', '-b:a', '96k', out]);

/* THE FIGHT RUN, spliced from the three levels on the bar line: a 40 ms crossfade, the hit struck on the downbeat into 3,
   a drop (a 15 ms cut) out of it, exactly as the game changes them */
const XF = (from, to) => Math.round((from === 3 && to !== 3 ? 0.015 : 0.04) * SR);   /* out of 3 a drop, else a crossfade */
function fightRun(pcm, hit, sd, run) {
  run = run || RUN;
  const bar = Math.round(16 * sd * SR), off = Math.round(0.05 * SR), seg = run.bars * bar;
  const len = run.parts.length * seg, out = new Float32Array(len);
  run.parts.forEach(([lv], i) => {
    const prev = i ? run.parts[i - 1][0] : 0, next = run.parts[i + 1] ? run.parts[i + 1][0] : 0;
    const xin = i ? XF(prev, lv) : 0, xout = next ? XF(lv, next) : 0;
    const src = pcm[lv], s0 = off + (run.from + i * run.bars) * bar, o0 = i * seg;
    for (let k = -xin; k < seg + xout; k++) {
      const o = o0 + k; if (o < 0 || o >= len) continue;
      const w = k < 0 ? (k + xin) / xin : k >= seg ? 1 - (k - seg) / xout : 1;
      out[o] += (src[s0 + k] || 0) * w;
    }
    /* into 3: the hit, its onset (0.05 s into its file) on the bar line */
    if (lv === 3 && prev !== 3) for (let j = -off; off + j < hit.length; j++) { const o = o0 + j; if (o >= 0 && o < len) out[o] += hit[off + j]; }
  });
  const fade = 2 * bar; for (let k = 0; k < fade; k++) { const i = len - fade + k; out[i] *= (1 - k / fade); }
  return limit(out).y;
}

async function record(which) {
  const his = JSON.parse(fs.readFileSync(HISM, 'utf8'));
  const list = which === 'all' ? SONGS : SONGS.filter(s => which.split(',').some(w => s === w || slug(s) === w));
  if (!list.length) throw new Error('no song ' + which);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'three_levels_'));
  /* three alphas, one level each, in parallel */
  const A = await Promise.all([0, 1, 2].map(() => H.openAlpha())), errs = [].concat(...A.map(x => x.errs));
  /* REPO MAN's machine, read from the game's own block in the alpha (SONGFENCE.machine.spec and its TRIM_DB) */
  const MP = list.includes('REPO MAN') ? await (async () => {
    const MPR = require(path.join(ROOT, 'tools', 'bohemia_sounds_machine_party_record.js'));
    for (const x of A) await MPR.prepare(x.p);
    const spec = await A[0].p.evaluate(() => window.SONGFENCE && SONGFENCE.machine && SONGFENCE.machine.spec);
    const m = fs.readFileSync(path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html'), 'utf8').match(/var TRIM_DB=(-?[0-9.]+);\s*\/\* the recorder's measured trim for take A/);
    if (!spec || !m) throw new Error('REPO MAN: the game\'s machine party spec or trim not found in the alpha');
    return { spec, trimDb: +m[1] };
  })() : null;
  fs.mkdirSync(OUTD, { recursive: true });
  for (const name of list) {
    const t0 = Date.now(), sl = slug(name), dir = path.join(OUTD, sl);
    fs.mkdirSync(dir, { recursive: true });
    /* his own gain (his_night_songs: a song his engine plays past full scale is recorded 6 dB down until it does not) */
    const hotDb = his[name] ? (his[name].gain_db || 0) : 0, og = Math.pow(10, hotDb / 20);
    const R = {};
    await Promise.all([1, 2, 3].map(async lv => {
      const p = A[lv - 1].p;
      let g = og, r;
      /* BOHEMIA_RENDER_CACHE=<dir>: each level's render kept there, and reused when it is there (a re-fit, not a re-render) */
      const cache = process.env.BOHEMIA_RENDER_CACHE ? path.join(process.env.BOHEMIA_RENDER_CACHE, sl + '_' + lv + '.json') : null;
      if (cache && fs.existsSync(cache)) { r = JSON.parse(fs.readFileSync(cache, 'utf8')); g = Math.pow(10, r.gain_db_used / 20); console.log('  ' + name + ' level ' + lv + ' from the cache'); }
      else for (;;) { const tl = Date.now(); r = await level(p, name, lv, g, name === 'REPO MAN' ? MP : null, hotDb < 0); console.log('  ' + name + ' level ' + lv + ' gain ' + g.toFixed(3) + ' clipped ' + r.clipped + ' in ' + ((Date.now() - tl) / 1000).toFixed(1) + ' s'); if (r.err) throw new Error(name + ' level ' + lv + ': ' + r.err); if (lv > 1 || !r.clipped || g < 0.1) break; g /= 2; }
      if (lv === 2 && !r.stemC) {   /* the sub stem (added after the first renders: a cached level 2 gets it alone, quickly) */
        const rc = await level(p, name, 2, g, name === 'REPO MAN' ? MP : null, hotDb < 0, true, r.scale);
        if (rc.err) throw new Error(name + ' level 2 sub: ' + rc.err);
        r.stemC = rc.stemC; for (const k in rc.countsC) r.counts[k] = (r.counts[k] || 0) + rc.countsC[k];
        if (cache) fs.writeFileSync(cache, JSON.stringify(Object.assign({}, r, { gain_db_used: 20 * Math.log10(g) })));
      }
      if (cache && !fs.existsSync(cache)) { r.gain_db_used = 20 * Math.log10(g); fs.writeFileSync(cache, JSON.stringify(r)); }
      const b = Buffer.from(r.b64, 'base64'); delete r.b64;
      r.pcm = new Int16Array(b.buffer, b.byteOffset, b.length >> 1);
      if (r.hit) { const hb = Buffer.from(r.hit, 'base64'); r.hitPcm = new Int16Array(hb.buffer, hb.byteOffset, hb.length >> 1); delete r.hit; }
      if (r.stemB) { const sb = Buffer.from(r.stemB, 'base64'); r.stemBPcm = new Int16Array(sb.buffer, sb.byteOffset, sb.length >> 1); delete r.stemB; }
      if (r.stemC) { const sc = Buffer.from(r.stemC, 'base64'); r.stemCPcm = new Int16Array(sc.buffer, sc.byteOffset, sc.length >> 1); delete r.stemC; }
      R[lv] = Object.assign(r, { gain_db: +(20 * Math.log10(g)).toFixed(2) });
    }));
    /* THE GAP: level 1 as rendered; levels 2 and 3 brought to level 1 + 3.6 and + 10.4 dB through a phone */
    const x1 = f32(R[1].pcm), base = phoneDb(x1), kbase = kDb(x1), F = {};
    F[1] = { y: x1, gain: 1, phone_db: +base.toFixed(2), k_db: +kbase.toFixed(2) };
    const mixed = mix3(hp20(f32(R[2].pcm)), hp20(f32(R[2].stemBPcm)), hp20(f32(R[2].stemCPcm)), x1); R[2].stem_b_db = mixed.b_db; R[2].stem_c_db = mixed.c_db;
    F[2] = fit(mixed.y, { phone: base + GAP[2], k: kbase + GAP[2] });
    F[3] = fit(hp20(f32(R[3].pcm)), { phone: F[2].phone_db + GAP[3] - GAP[2], k: F[2].k_db + GAP[3] - GAP[2] });
    /* the hit at level 3's own gain, through the same limit */
    const hit = limit(Float32Array.from(f32(R[3].hitPcm), v => v * F[3].gain)).y;
    const raws = [], files = {};
    for (const lv of [1, 2, 3]) {
      const q = i16(F[lv].y); R[lv].finalClip = q.clip; const raw = path.join(tmp, sl + '_' + lv + '.raw');
      fs.writeFileSync(raw, Buffer.from(q.buffer, q.byteOffset, q.byteLength)); raws.push(raw);
    }
    const hq = i16(hit), hraw = path.join(tmp, sl + '_hit.raw'); fs.writeFileSync(hraw, Buffer.from(hq.buffer, hq.byteOffset, hq.byteLength));
    const run = i16(fightRun({ 1: F[1].y, 2: F[2].y, 3: F[3].y }, hit, R[1].sd)), runRaw = path.join(tmp, sl + '_run.raw');
    fs.writeFileSync(runRaw, Buffer.from(run.buffer, run.byteOffset, run.byteLength));
    [[1, 'level_1'], [2, 'level_2'], [3, 'level_3']].forEach(([lv, f]) => { const o = path.join(dir, f + '.mp3'); toMp3(raws[lv - 1], o); files[f] = o; });
    const ho = path.join(dir, 'hit.mp3'); toMp3(hraw, ho); files.hit = ho;
    const ro = path.join(dir, 'a_fight.mp3'); toMp3(runRaw, ro); files.a_fight = ro;
    const m = measure(raws.concat([runRaw, hraw]));
    const out = { name, made: '10/25', remade: '10/25 rule 207', tool: 'tools/bohemia_sounds_three_levels.js', page_errors: errs.length, bars: BARS, steps: BARS * 16, bpm: 120,
      key: { root: R[1].root, scale: R[1].scale_notes }, his_voices: { lead: R[1].lead, bass: R[1].bass, kick: R[1].kick, klay: R[1].klay }, form: { arr: R[1].arr, rt: R[1].rt },
      /* the game plays every level of this song at this gain, so level 1 is as loud as his engine plays the song live */
      play_gain_db: +(-R[1].gain_db).toFixed(2),   /* the gain level 1 was recorded at, undone (his hot songs are recorded down) */
      gap: { target_over_level_1_db: GAP, phone_db: [F[1].phone_db, F[2].phone_db, F[3].phone_db], full_range_lufs: [F[1].k_db, F[2].k_db, F[3].k_db] },
      run: { from_bar: RUN.from + 1, bars_each: RUN.bars, parts: RUN.parts.map(x => x[1] + ' (level ' + x[0] + ')') },
      levels: [1, 2, 3].map(lv => ({ level: lv, file: path.relative(ROOT, files['level_' + lv]), mp3_md5: md5(fs.readFileSync(files['level_' + lv])), bytes: fs.statSync(files['level_' + lv]).size,
        gain_db: R[lv].gain_db, clipped_samples: R[lv].finalClip, stem_b_db: R[lv].stem_b_db, stem_c_db: R[lv].stem_c_db, fit: lv === 1 ? null : { gain_db: +(20 * Math.log10(F[lv].gain * R[lv].scale)).toFixed(2), limiter_worst_db: F[lv].limiter_worst_db, limiter_mean_db: F[lv].limiter_mean_db },
        parts_added: R[lv].counts, audio: m[lv - 1] })),
      hit: { file: path.relative(ROOT, ho), mp3_md5: md5(fs.readFileSync(ho)), bytes: fs.statSync(ho).size, audio: m[4] },
      a_fight: { file: path.relative(ROOT, ro), mp3_md5: md5(fs.readFileSync(ro)), bytes: fs.statSync(ro).size, audio: m[3] } };
    fs.writeFileSync(path.join(dir, 'measured.json'), JSON.stringify(out, null, 1) + '\n');
    console.log(name + ' in ' + ((Date.now() - t0) / 1000).toFixed(1) + ' s; phone rms L1 ' + m[0].phone_rms_db + ' L2 ' + m[1].phone_rms_db + ' L3 ' + m[2].phone_rms_db + ' (L2-L1 ' + (m[1].phone_rms_db - m[0].phone_rms_db).toFixed(2) + ', L3-L2 ' + (m[2].phone_rms_db - m[1].phone_rms_db).toFixed(2) + '); full range LUFS ' + [F[1].k_db, F[2].k_db, F[3].k_db].join('/') + '; full band ' + m.slice(0, 3).map(x => x.rms_db).join('/') + '; limiter L2 ' + F[2].limiter_worst_db + ' L3 ' + F[3].limiter_worst_db + ' dB; clipped ' + [1, 2, 3].map(l => R[l].finalClip).join('/'));
  }
  await Promise.all(A.map(x => x.b.close()));
  fs.rmSync(tmp, { recursive: true, force: true });
}

/* ONE PAGE PER SONG: the tab checks every card's page is a file, so each song's card has its own copy of the one page,
   the song named in its <meta name="song">; the template is BOHEMIA_THREE_LEVELS_10_25_26.html, never hand-edited copies */
const TEMPLATE = path.join(ROOT, 'slices', 'BOHEMIA_THREE_LEVELS_10_25_26.html');
const pageOf = S => 'BOHEMIA_THREE_LEVELS_' + S.slug.toUpperCase() + '_10_25_26.html';
function writePage(S) {
  const t = fs.readFileSync(TEMPLATE, 'utf8');
  const out = t.replace('<meta name="song" content="">', '<meta name="song" content="' + S.slug + '">').replace('<title>Three Levels</title>', '<title>' + S.name.replace(/\b(\w)(\w*)/g, (m, a, b) => a + b.toLowerCase()) + ', Three Levels</title>');
  if (out === t) throw new Error('the template lost its song meta');
  fs.writeFileSync(path.join(ROOT, 'slices', pageOf(S)), out);
}

/* THE CARD: one card per song, appended to the registry, never editing anybody else's; the sha is the commit that last
   touched the song's recordings, so the card points at what he hears (a card already there is moved to the new sha and
   says the levels are in the game, rule 207) */
const why = S => 'Your ' + S.name + ' at three levels on the 120 beat, as the game plays it now: 1 the map as you approved it with a soft beat under it, 2 their turn, tension only (the bass, a held chord, a heartbeat, the clock), 3 your turn, everything: your tune, full drums, a driving bass and a hook in your song\'s own lead, much louder than their turn. ' +
  'Tap 1, 2, 3 and then A FIGHT, and you hear it on this card in the VOTE tab, the turns changing on the bar, a hit when the turn comes back to you.';
function register(which, write) {
  const REG = path.join(ROOT, 'records', 'target', 'BOHEMIA_VOTE_REGISTRY.json');
  const reg = JSON.parse(fs.readFileSync(REG, 'utf8'));
  const list = SONGS.filter(n => which === 'all' || n === which || slug(n) === which || which.split(',').indexOf(n) >= 0)
    .filter(n => fs.existsSync(path.join(OUTD, slug(n), 'measured.json')))
    .map(n => ({ name: n, slug: slug(n), dir: 'vote/songs/three_levels/' + slug(n) + '/', id: 'sounds-three-levels-' + slug(n).replace(/_/g, '-') + '-10-25' }));
  let changed = 0;
  for (const S of list) {
    const sha = execFileSync('git', ['log', '-1', '--format=%h', 'origin/main', '--', path.join('slices', S.dir)], { cwd: ROOT, encoding: 'utf8' }).trim();
    if (!sha) { console.log(S.name + ': not on main yet, no card (push its recordings first)'); continue; }
    /* the sha must be one he can go look at: on main, not a local commit a rebase will rename */
    const onMain = execFileSync('git', ['branch', '-r', '--contains', sha], { cwd: ROOT, encoding: 'utf8' });
    if (!/origin\/main\b/.test(onMain)) throw new Error(S.name + ': push the recordings to main first, ' + sha + ' is not on main');
    writePage(S);
    const have = reg.items.find(x => x.id === S.id);
    if (have) {
      if (have.sha === sha && have.why === why(S)) { console.log('already a card at ' + sha + ': ' + S.id); continue; }
      if (write) { have.sha = sha; have.why = why(S); have.title = S.name + ': YOUR SONG AT THREE LEVELS, IN THE GAME'; have.options = ['A, keep it like this', 'B, the gap is wrong, tell me']; }
      console.log((write ? 'MOVED ' : 'would move ') + S.id + ' to ' + sha); changed++; continue;
    }
    const card = { id: S.id, kind: 'song', lane: 'sounds', sha, made: '10/25',
      title: S.name + ': YOUR SONG AT THREE LEVELS, IN THE GAME', why: why(S),
      options: ['A, keep it like this', 'B, the gap is wrong, tell me'],
      show: { how: 'page', src: pageOf(S) }, draft: true };
    if (write) reg.items.push(card);
    console.log((write ? 'REGISTERED ' : 'would register ') + S.id + ' at ' + sha); changed++;
  }
  if (write && changed) fs.writeFileSync(REG, JSON.stringify(reg, null, 1) + '\n');
  if (write) rebuild(reg);
}

/* THE LIST THE PAGES AND THE GAME READ, REBUILT FROM THE RECORDINGS THAT HAVE A CARD: a song still rendering, or rendered
   and not yet carded, is never on it */
function rebuild(reg) {
  reg = reg || JSON.parse(fs.readFileSync(path.join(ROOT, 'records', 'target', 'BOHEMIA_VOTE_REGISTRY.json'), 'utf8'));
  const ids = new Set(reg.items.map(x => x.id));
  const songs = SONGS.map(name => {
    const sl = slug(name), m = path.join(OUTD, sl, 'measured.json'), id = 'sounds-three-levels-' + sl.replace(/_/g, '-') + '-10-25';
    if (!fs.existsSync(m) || !ids.has(id)) return null;
    const M = JSON.parse(fs.readFileSync(m, 'utf8'));
    return { name, slug: sl, dir: 'vote/songs/three_levels/' + sl + '/', bars: M.bars || 32, levels_db: M.levels.map(x => x.audio.phone_rms_db), id };
  }).filter(Boolean);
  fs.writeFileSync(path.join(OUTD, 'index.json'), JSON.stringify({ made: '10/25', tool: 'tools/bohemia_sounds_three_levels.js', songs }, null, 1) + '\n');
  console.log('the list: ' + songs.map(x => x.name).join(', '));
}

if (require.main === module) {
  const [cmd, arg, flag] = process.argv.slice(2);
  if (cmd === 'record') record(arg || 'THE VAULT').catch(e => { console.error(e); process.exit(1); });
  else if (cmd === 'register') register(arg || 'THE VAULT', flag === '--write');
  else if (cmd === 'index') rebuild();
  else { console.log('usage: record "<his song>" | record all | register "<his song>"|all [--write]'); process.exit(2); }
}
module.exports = { level, SONGS, RUN, GAP, slug, phoneDb, kDb, limit, fit, f32, i16, fightRun, hp20 };
