#!/usr/bin/env node
/* BOHEMIA -- FOUR NEW SONGS, EACH ITS OWN SONG (SOUNDS, 10/25/26, row [every song its own song], rules 166, 167, 168, 181).

   PAOLO 10/25: 'it's the same one for like seven songs bro and they use the same instruments... seven of the same songs
   with like one slightly thing different... you have like this background creepy vibe, and it's hard to hear really
   anything else.' Rule 166(b): a new song has its own lead, its own instrument set, its own key or mode, its own groove
   inside the 120 BPM grid, a melody you can hum after one listen, and a form that goes somewhere; no two new songs share
   more than one of lead, bass, drums, pad, key. (c) the tune and the beat lead the mix, the creepy bed is never the song.
   (d) REPO MAN's machine plays under REPO MAN only (none here). (e) more instruments, from real material (NO SAND).
   181: each song goes to the VOTE tab first, at levels 1, 2 and 3 and a fight's turns; nothing is wired.

   WHAT IS DIFFERENT FROM THE SIX THAT DIED: nothing is one of his songs with values changed. Each song here is written:
   the melody note by note (a phrase that asks and a phrase that answers, a B section that climbs, the A coming home), the
   chords bar by bar, the groove step by step. The voices are his engine's (synthV: the lead, the bass, the pad) and REAL
   RECORDINGS for every drum and for the first song's lead (the CC0 bank, reference/library/sound_bank/esc50_cc0: a church
   clock's bell, a bass drum shell, wooden doors knocked, a soda can, a mouse click, two clocks ticking, hands clapping),
   one hit cut from each at its first onset. Analog horror lives inside the sound: every song goes through its own worn
   tape (a soft saturation, the top rolled off, a slow wow), never a drone laid over the tune.

     node tools/bohemia_sounds_four_new_songs.js record [slug|all]   renders levels 1, 2, 3, A FIGHT, the tune alone
   writes slices/vote/songs/new_four/<slug>/{level_1,level_2,level_3,a_fight}.mp3 + measured.json. The cards use the
   three-levels page (the song's own copy). Gate: gates/four_new_songs_gate.js. */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const ROOT = path.dirname(__dirname);
const H = require(path.join(ROOT, 'tools', 'bohemia_sounds_his_machine.js'));
const BANK = path.join(ROOT, 'reference', 'library', 'sound_bank', 'esc50_cc0');
const OUTD = path.join(ROOT, 'slices', 'vote', 'songs', 'new_four');
const BARS = 32;
const RUN = { from: 4, parts: [[1, 'THE MAP'], [2, 'THEIR TURN'], [3, 'YOUR TURN'], [2, 'THEIR TURN'], [3, 'YOUR TURN']], bars: 4 };
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const md5 = b => crypto.createHash('md5').update(b).digest('hex');

/* THE FOUR. root: his engine's semitone (0 = A2, 110 Hz; noteHz(s) = 110 * 2^(s/12)). mode: the scale, degrees index it
   (7 = the octave). melody: [bar-in-phrase, step, degree, length in steps]; A asks and answers over four bars, B climbs.
   chords: the root degree of each bar of a four-bar phrase. kit: a real hit per part, { stem, ms } cut at its onset.
   groove: per level, the steps each part strikes in a bar. */
const SONGS = [
  { name: 'THE CHURCH CLOCK STRIKES TWELVE', key: 'D minor (aeolian)', root: 5, mode: [0, 2, 3, 5, 7, 8, 10],
    story: 'the church on Maryland Parkway whose clock still strikes the hours for nobody, its bell the tune',
    lead: { sample: '5-219044-A-46', at: 1.57, ms: 1600, pitch: 72.06, gain: 0.55, oct: 1 }, leadName: 'the church clock\'s own bell (a real recording, tuned note by note)',
    bass: 'abyssbass', pad: 'submergechoir',
    kit: { kick: { stem: '1-103999-A-30', ms: 260, gain: 1.1, lp: 900 }, snare: { stem: '2-25293-A-22', ms: 220, gain: 0.8 }, hat: { stem: '3-171041-A-38', ms: 60, gain: 0.5, hp: 2500 } },
    kitName: 'wood knocked for the kick, hands clapped for the snare, the old Yantar clock for the hat',
    chords: [0, 5, 3, 4], groove: {
      1: { kick: [0, 8], hat: [0, 4, 8, 12] },
      2: { kick: [0, 4, 8, 12], hat: [0, 2, 4, 6, 8, 10, 12, 14], snare: [] },
      3: { kick: [0, 6, 8, 10], snare: [4, 12], hat: [0, 2, 4, 6, 8, 10, 12, 14, 15] } },
    bassLine: { 1: [[0, 8]], 2: [[0, 2], [2, 2], [4, 2], [6, 2], [8, 2], [10, 2], [12, 2], [14, 2]], 3: [[0, 3], [3, 3], [6, 2], [8, 3], [11, 3], [14, 2]] },
    melody: {
      A: [[0, 0, 4, 4], [0, 4, 2, 2], [0, 6, 3, 2], [0, 8, 4, 6], [1, 0, 7, 6], [1, 6, 6, 2], [1, 8, 4, 8],
          [2, 0, 3, 4], [2, 4, 2, 2], [2, 6, 1, 2], [2, 8, 2, 4], [2, 12, 3, 4], [3, 0, 0, 12]],
      B: [[0, 0, 9, 4], [0, 4, 8, 4], [0, 8, 7, 8], [1, 0, 6, 4], [1, 4, 5, 4], [1, 8, 4, 8],
          [2, 0, 5, 2], [2, 2, 4, 2], [2, 4, 3, 4], [2, 8, 2, 4], [2, 12, 1, 4], [3, 0, 4, 16]] } },
  { name: 'THE SODA MACHINE STILL TAKES COINS', key: 'E phrygian', root: 7, mode: [0, 1, 3, 5, 7, 8, 10], swing: 0.34,
    story: 'a soda machine in a dead laundromat on Fremont, lit, humming, still swallowing coins nobody has',
    lead: { voice: 'drawbarmorph', gain: 0.075, oct: 0 }, leadName: 'a drawbar organ that bends, his engine\'s drawbarmorph',
    bass: 'filterfmgrowl', pad: null,
    kit: { kick: { stem: '1-103995-A-30', ms: 220, gain: 1.2, lp: 700 }, snare: { stem: '2-144031-A-34', ms: 160, gain: 0.9 }, hat: { stem: '2-152895-A-31', ms: 45, gain: 0.6, hp: 3000 } },
    kitName: 'a bass drum shell for the kick, a soda can opening for the snare, a mouse click for the hat, swung',
    chords: [0, 1, 0, 6], groove: {
      1: { kick: [0, 8], hat: [2, 6, 10, 14] },
      2: { kick: [0, 3, 8, 11], hat: [0, 2, 3, 6, 8, 10, 11, 14] },
      3: { kick: [0, 3, 8, 10, 11], snare: [4, 12], hat: [0, 2, 3, 4, 6, 8, 10, 11, 12, 14, 15] } },
    bassLine: { 1: [[0, 4], [8, 4]], 2: [[0, 3], [3, 3], [8, 3], [11, 3]], 3: [[0, 2], [3, 2], [6, 2], [8, 2], [10, 2], [11, 2], [14, 2]] },
    melody: {
      A: [[0, 0, 0, 2], [0, 2, 1, 2], [0, 4, 0, 2], [0, 8, 2, 2], [0, 10, 1, 2], [0, 12, 0, 4],
          [1, 0, -1, 2], [1, 2, 0, 6], [1, 10, 2, 2], [1, 12, 3, 4],
          [2, 0, 4, 2], [2, 2, 3, 2], [2, 4, 2, 2], [2, 8, 3, 2], [2, 10, 2, 2], [2, 12, 1, 4], [3, 0, 0, 10]],
      B: [[0, 0, 4, 4], [0, 4, 5, 4], [0, 8, 7, 8], [1, 0, 8, 4], [1, 4, 7, 4], [1, 8, 5, 8],
          [2, 0, 4, 2], [2, 2, 5, 2], [2, 4, 4, 2], [2, 8, 3, 4], [2, 12, 1, 4], [3, 0, 0, 16]] } },
  { name: 'THE HELICOPTER THAT NEVER LANDS', key: 'A dorian', root: 12, mode: [0, 2, 3, 5, 7, 9, 10],
    story: 'a news helicopter that has circled the Strip since the dollar died, its pilot long gone, the rotor still turning',
    lead: { voice: 'ghostflute', gain: 0.09, oct: 0 }, leadName: 'a ghost flute, his engine\'s',
    bass: 'undertowbass', pad: 'aeolianharp',
    kit: { kick: { stem: '2-133889-A-30', ms: 240, gain: 1.2, lp: 600 }, snare: { stem: '2-76408-B-22', ms: 200, gain: 0.85 }, hat: { stem: '1-62849-A-38', ms: 50, gain: 0.55, hp: 3500 } },
    kitName: 'a large wooden door knocked for the kick, a clap for the snare, a clock ticking close for the hat, four on the floor',
    chords: [0, 3, 6, 4], groove: {
      1: { kick: [0, 4, 8, 12], hat: [] },
      2: { kick: [0, 4, 8, 12], hat: [2, 6, 10, 14] },
      3: { kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 6, 10, 14, 15] } },
    bassLine: { 1: [[0, 16]], 2: [[2, 2], [6, 2], [10, 2], [14, 2]], 3: [[0, 2], [2, 2], [4, 2], [6, 2], [8, 2], [10, 2], [12, 2], [14, 2]] },
    melody: {
      A: [[0, 0, 4, 3], [0, 3, 5, 3], [0, 6, 4, 2], [0, 8, 2, 8], [1, 0, 3, 3], [1, 3, 4, 3], [1, 6, 3, 2], [1, 8, 0, 8],
          [2, 0, 4, 3], [2, 3, 5, 3], [2, 6, 7, 2], [2, 8, 6, 4], [2, 12, 5, 4], [3, 0, 4, 16]],
      B: [[0, 0, 7, 6], [0, 6, 8, 2], [0, 8, 9, 8], [1, 0, 8, 4], [1, 4, 7, 4], [1, 8, 5, 8],
          [2, 0, 6, 3], [2, 3, 5, 3], [2, 6, 4, 2], [2, 8, 3, 4], [2, 12, 2, 4], [3, 0, 0, 16]] } },
  { name: 'THE PAWN COUNTER AT FOUR IN THE MORNING', key: 'C harmonic minor', root: 3, mode: [0, 2, 3, 5, 7, 8, 11],
    story: 'the pawn shop on Las Vegas Boulevard that never closed, the owner asleep behind the glass, a piano nobody bought',
    lead: { voice: 'drownedpiano', gain: 0.09, oct: 0 }, leadName: 'a drowned upright piano, his engine\'s',
    bass: 'pwmreed', pad: 'faythchoir',
    kit: { kick: { stem: '5-235644-A-30', ms: 240, gain: 1.15, lp: 800 }, snare: { stem: '5-252248-A-34', ms: 180, gain: 0.85 }, hat: { stem: '2-131943-A-38', ms: 55, gain: 0.55, hp: 3000 } },
    kitName: 'a door knock for the kick, a can opened for the snare, a wind-up clock for the hat, a broken beat',
    chords: [0, 5, 3, 4], groove: {
      1: { kick: [0, 10], hat: [0, 8] },
      2: { kick: [0, 3, 10], hat: [0, 2, 4, 6, 8, 10, 12, 14] },
      3: { kick: [0, 3, 10, 11], snare: [4, 12, 15], hat: [0, 2, 4, 5, 6, 8, 10, 12, 13, 14] } },
    bassLine: { 1: [[0, 6], [10, 6]], 2: [[0, 3], [3, 3], [10, 6]], 3: [[0, 3], [3, 3], [6, 2], [10, 1], [11, 3], [14, 2]] },
    melody: {
      A: [[0, 0, 7, 2], [0, 2, 6, 2], [0, 4, 7, 2], [0, 6, 4, 2], [0, 8, 5, 4], [0, 12, 4, 4],
          [1, 0, 2, 2], [1, 2, 3, 2], [1, 4, 4, 4], [1, 8, 6, 8],
          [2, 0, 7, 2], [2, 2, 6, 2], [2, 4, 7, 2], [2, 6, 9, 2], [2, 8, 8, 4], [2, 12, 7, 4], [3, 0, 7, 12]],
      B: [[0, 0, 4, 4], [0, 4, 5, 4], [0, 8, 6, 4], [0, 12, 7, 4], [1, 0, 9, 6], [1, 6, 8, 2], [1, 8, 7, 8],
          [2, 0, 5, 4], [2, 4, 4, 4], [2, 8, 3, 4], [2, 12, 2, 4], [3, 0, 6, 16]] } }
];
/* THE FORM, 32 bars: an intro that is the bed and the beat (4), A (8: the phrase twice), B (8), A again an octave up (8),
   the ending (4: the last phrase's cadence held). The tune is in from bar 5 on every level. */
const FORM = ['I', 'I', 'I', 'I', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'A2', 'A2', 'A2', 'A2', 'A2', 'A2', 'A2', 'A2', 'E', 'E', 'E', 'E'];

async function render(p, S, lv, only) {
  return p.evaluate(async ({ S, lv, only, bars, FORM, kitB64 }) => {
    const SR = 44100, sd = 0.125, steps = bars * 16, secs = steps * sd + 3;
    MUS.audio();
    const OAC = new OfflineAudioContext(1, Math.ceil(SR * secs), SR);
    /* the worn tape: a soft saturation, the top rolled off, everything through it (analog horror inside the sound) */
    const tapeIn = OAC.createGain(), sat = OAC.createWaveShaper(), lp = OAC.createBiquadFilter(), out = OAC.createGain();
    const curve = new Float32Array(1024); for (let i = 0; i < 1024; i++) { const x = i / 511.5 - 1; curve[i] = Math.tanh(1.6 * x) / Math.tanh(1.6); }
    sat.curve = curve; lp.type = 'lowpass'; lp.frequency.value = 7500; lp.Q.value = 0.5; out.gain.value = 0.9;
    tapeIn.connect(sat); sat.connect(lp); lp.connect(out); out.connect(OAC.destination);
    const bus = g => { const n = OAC.createGain(); n.gain.value = g; n.connect(tapeIn); return n; };
    const B = { lead: bus(1), bass: bus(0.9), pad: bus(0.7), kick: bus(1), snare: bus(1), hat: bus(1) };
    /* the real hits: decoded, cut at the first onset, faded out */
    const dec = async b64 => { const s = atob(b64), u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return OAC.decodeAudioData(u.buffer); };
    const cut = (buf, ms, at) => { const d = buf.getChannelData(0); let i0 = at != null ? Math.floor(at * buf.sampleRate) : 0;
      if (at == null) { const W = 220; let prev = 0; for (let i = 0; i + W < d.length; i += W) { let e = 0; for (let k = 0; k < W; k++) e += d[i + k] * d[i + k]; e = Math.sqrt(e / W); if (e > 0.03 && e > prev * 3) { i0 = Math.max(0, i - 44); break; } prev = e; } }
      const n = Math.min(d.length - i0, Math.round(buf.sampleRate * ms / 1000)), o = OAC.createBuffer(1, n, buf.sampleRate), od = o.getChannelData(0);
      let pk = 0; for (let i = 0; i < n; i++) pk = Math.max(pk, Math.abs(d[i0 + i]));
      for (let i = 0; i < n; i++) { const f = i > n * 0.7 ? (n - i) / (n * 0.3) : 1; od[i] = d[i0 + i] / (pk || 1) * 0.9 * f; }
      return o; };
    const HIT = {};
    for (const part of ['kick', 'snare', 'hat']) { const k = S.kit[part]; HIT[part] = cut(await dec(kitB64[k.stem]), k.ms, null); }
    let bell = null; if (S.lead.sample) bell = cut(await dec(kitB64[S.lead.sample]), S.lead.ms, S.lead.at);
    const counts = {};
    const hit = (part, t, g) => { counts[part] = (counts[part] || 0) + 1; const k = S.kit[part], s = OAC.createBufferSource(), v = OAC.createGain(); s.buffer = HIT[part]; v.gain.value = (k.gain || 1) * g * (S.kitScale || 1);
      let node = v; if (k.lp || k.hp) { const f = OAC.createBiquadFilter(); f.type = k.lp ? 'lowpass' : 'highpass'; f.frequency.value = k.lp || k.hp; v.connect(f); node = f; }
      s.connect(v); node.connect(B[part]); s.start(t); };
    const deg = (d, oct) => S.mode[((d % 7) + 7) % 7] + 12 * (Math.floor(d / 7) + (oct || 0));
    const hz = x => MUS.noteHz(x);
    const note = (t, semi, len, g) => { counts.lead = (counts.lead || 0) + 1;
      if (bell) { const s = OAC.createBufferSource(), v = OAC.createGain(); s.buffer = bell; s.playbackRate.value = Math.pow(2, (45 + semi - S.lead.pitch) / 12);
        v.gain.setValueAtTime(S.lead.gain * g, t); v.gain.setTargetAtTime(0, t + Math.max(0.25, len * sd), 0.25); s.connect(v); v.connect(B.lead); s.start(t); s.stop(t + len * sd + 1.5); }
      else synthV(S.lead.voice, OAC, B.lead, hz, sd * len, semi, t, S.lead.gain * g); };
    const muteTune = only === 'beat' || only === 'kit', onlyTune = only === 'tune', kitOnly = only === 'kit';
    for (let s = 0; s < steps; s++) {
      const bar = Math.floor(s / 16), q = s % 16, sec = FORM[bar], pib = (bar - 4) % 4, chord = S.chords[bar % 4];
      let t = 0.05 + s * sd; if (S.swing && q % 2 === 1) t += S.swing * sd * 0.5;
      const G = S.groove[lv];
      if (!onlyTune) {
        /* the beat: from bar 1 on every level (168(a)), soft on 1 */
        /* MEASURED on THE CHURCH CLOCK's first take: the parts at 0.45 / 0.7 / 1 put level 2 0.5 dB and level 3 2.1 dB over
           level 1 on a phone (the bell led all three); the kit now climbs harder, the tune still leads */
        const soft = lv === 1 ? 0.45 : lv === 2 ? 0.95 : 1.35;
        if ((G.kick || []).includes(q)) hit('kick', t, soft);
        if ((G.snare || []).includes(q) && sec !== 'I') hit('snare', t, lv === 3 ? 1.3 : 1);
        if ((G.hat || []).includes(q)) hit('hat', t, lv === 1 ? 0.6 : lv === 3 && q % 4 === 0 ? 1.3 : 1);
        if (lv === 3 && sec !== 'I' && bar % 4 === 3 && q >= 12) hit('snare', t, 0.6 + (q - 12) * 0.1);   /* the fill into each phrase */
        if (lv >= 2 && q % 4 === 2 && lv === 2) hit('hat', t, 0.4);
        /* the bass: the song's own line on the chord's root */
        if (!kitOnly) for (const [at, len] of S.bassLine[lv]) if (q === at) { counts.bass = (counts.bass || 0) + 1; synthV(S.bass, OAC, B.bass, hz, sd * len, S.root - 12 + deg(chord) + (lv === 3 && at % 4 === 2 ? 12 : 0), t, lv === 1 ? 0.08 : lv === 2 ? 0.12 : 0.14); }
        /* the pad: the chord, held, once a bar (none on the dry song) */
        if (S.pad && q === 0 && !kitOnly) for (const d of [0, 2, 4]) { counts.pad = (counts.pad || 0) + 1; synthV(S.pad, OAC, B.pad, hz, sd * 16, S.root - 12 + deg(chord + d), t, lv === 3 ? 0.035 : 0.05); }
      }
      if (!muteTune && (sec === 'A' || sec === 'B' || sec === 'A2' || (sec === 'E' && bar === 28))) {
        const ph = sec === 'B' ? S.melody.B : S.melody.A, ib = sec === 'E' ? 3 : pib;
        for (const [b, at, d, len] of ph) if (b === ib && q === at) {
          /* the lead sits an octave over the root (a phone's speaker hears it), the bell a further octave, A2 higher again */
          const reg = S.root + 12 + 12 * (S.lead.oct || 0);
          note(t, reg + deg(d, sec === 'A2' ? 1 : 0), len, 1);
          if (lv === 3 && sec !== 'E') note(t, reg + deg(d, sec === 'A2' ? 0 : 1), len, 0.45);   /* doubled an octave on your turn */
        }
      }
    }
    const buf = await OAC.startRendering(), L = buf.getChannelData(0);
    const CEIL = 0.944, AH = Math.round(SR * 0.005), REL = Math.exp(-1 / (SR * 0.08)), n2 = L.length;
    const need = new Float32Array(n2); for (let i = 0; i < n2; i++) { const a = Math.abs(L[i]); need[i] = a > CEIL ? CEIL / a : 1; }
    const hold = new Float32Array(n2), dq = [];
    for (let i = n2 - 1; i >= 0; i--) { while (dq.length && need[dq[dq.length - 1]] >= need[i]) dq.pop(); dq.push(i); while (dq[0] > i + AH) dq.shift(); hold[i] = need[dq[0]]; }
    let g = 1; for (let i = 0; i < n2; i++) { const w = hold[i]; g = w < g ? w : w - (w - g) * REL; L[i] *= g; }
    const pcm = new Int16Array(n2); let clip = 0;
    for (let i = 0; i < n2; i++) { const v = Math.round(L[i] * 32767); if (Math.abs(v) > 32767) clip++; pcm[i] = Math.max(-32767, Math.min(32767, v)); }
    const u8 = new Uint8Array(pcm.buffer); let bin = ''; for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
    return { b64: btoa(bin), clipped: clip, counts };
  }, { S, lv, only: only || null, bars: BARS, FORM, kitB64: kitFor(S) });
}
function kitFor(S) {
  const o = {}; for (const k of Object.values(S.kit).map(x => x.stem).concat(S.lead.sample ? [S.lead.sample] : [])) o[k] = fs.readFileSync(path.join(BANK, k + '.flac')).toString('base64');
  return o;
}
const measure = raws => JSON.parse(execFileSync('python3', ['-I', path.join(ROOT, 'tools', 'bohemia_sounds_his_machine_measure.py')].concat(raws), { encoding: 'utf8', maxBuffer: 64 << 20 }));
const toMp3 = (raw, out) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 's16le', '-ar', '44100', '-ac', '1', '-i', raw, '-c:a', 'libmp3lame', '-b:a', '96k', out]);
function fightRun(pcm) {
  const sr = 44100, bar = Math.round(2 * sr), off = Math.round(0.05 * sr), xf = Math.round(0.04 * sr);
  const len = RUN.parts.length * RUN.bars * bar, out = new Int16Array(len + xf);
  RUN.parts.forEach(([lv], i) => { const src = pcm[lv], s0 = off + (RUN.from + i * RUN.bars) * bar, o0 = i * RUN.bars * bar;
    for (let k = -xf; k < RUN.bars * bar + xf; k++) { const o = o0 + k; if (o < 0 || o >= out.length || (i === 0 && k < 0)) continue;
      let w = 1; if (k < 0) w = (k + xf) / xf; else if (k >= RUN.bars * bar) w = 1 - (k - RUN.bars * bar) / xf;
      out[o] = Math.max(-32767, Math.min(32767, out[o] + (src[s0 + k] || 0) * w)); } });
  const fade = 2 * bar; for (let k = 0; k < fade; k++) { const i = len - fade + k; out[i] = Math.round(out[i] * (1 - k / fade)); }
  return out.subarray(0, len);
}

async function record(which) {
  const list = SONGS.filter(S => !which || which === 'all' || slug(S.name) === which);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'new_four_'));
  const A = await Promise.all([0, 1, 2].map(() => H.openAlpha())), errs = [].concat(...A.map(x => x.errs));
  for (const S of list) {
    const t0 = Date.now(), sl = slug(S.name), dir = path.join(OUTD, sl); fs.mkdirSync(dir, { recursive: true });
    /* THE KIT SET FROM THE TUNE (rule 166(c): the tune and the beat lead, the tune first). MEASURED on the first takes: the
       same kit gains put THE SODA MACHINE's beat 0.9 dB under its whole mix at level 1 (the tune 7 dB under) and THE CHURCH
       CLOCK's 13 dB under, because real hits are as loud as they were recorded. So a calibration pass, the tune alone and
       the beat alone at level 1, sets this song's kit (the three real hits alone) 9 dB under its tune through a phone, and every level takes that kit. */
    const cal = async only => { const r = await render(A[only === 'tune' ? 0 : 1].p, Object.assign({}, S, { kitScale: 1 }), 1, only); const f = path.join(tmp, sl + '_cal_' + only + '.raw'); fs.writeFileSync(f, Buffer.from(r.b64, 'base64')); return f; };
    const [ct, cb] = await Promise.all([cal('tune'), cal('kit')]), [mt0, mb0] = measure([ct, cb]);
    S.kitScale = Math.max(0.1, Math.min(4, Math.pow(10, ((mt0.phone_rms_db - 9) - mb0.phone_rms_db) / 20)));
    const R = {}, pcm = {}, raws = [];
    await Promise.all([1, 2, 3].map(async lv => { const r = await render(A[lv - 1].p, S, lv); const raw = path.join(tmp, sl + '_' + lv + '.raw'); fs.writeFileSync(raw, Buffer.from(r.b64, 'base64')); delete r.b64;
      pcm[lv] = new Int16Array(fs.readFileSync(raw).buffer.slice(0)); R[lv] = r; raws[lv - 1] = raw; }));
    const tune = await render(A[0].p, S, 1, 'tune'), traw = path.join(tmp, sl + '_tune.raw'); fs.writeFileSync(traw, Buffer.from(tune.b64, 'base64'));
    const beat = await render(A[1].p, S, 1, 'beat'), braw = path.join(tmp, sl + '_beat.raw'); fs.writeFileSync(braw, Buffer.from(beat.b64, 'base64'));
    /* the beat alone at level 3 too: a song whose tune leads every level climbs little in total, so the climb that
       matters (167(c): drums and drive on your turn) is measured on the beat itself */
    const beat3 = await render(A[2].p, S, 3, 'beat'), b3raw = path.join(tmp, sl + '_beat3.raw'); fs.writeFileSync(b3raw, Buffer.from(beat3.b64, 'base64'));
    /* THE LOUDNESS OF HIS SONGS: level 1 set to -36.5 dB through a phone (his eight night songs measure -35.5 to -41), one
       gain for every level and the tune and beat takes, so the levels keep their distance and the card is never a blast
       beside his songs (the first take measured -19.2 dB, 17 dB over his) */
    const L1 = measure([raws[0]])[0], gn = Math.pow(10, (-36.5 - L1.phone_rms_db) / 20);
    const scale = f => { const b = fs.readFileSync(f), a = new Int16Array(b.buffer, b.byteOffset, b.length >> 1); for (let i = 0; i < a.length; i++) a[i] = Math.max(-32767, Math.min(32767, Math.round(a[i] * gn))); fs.writeFileSync(f, Buffer.from(a.buffer, a.byteOffset, a.byteLength)); return a; };
    [1, 2, 3].forEach(lv => { pcm[lv] = scale(raws[lv - 1]); }); scale(traw); scale(braw); scale(b3raw);
    const run = fightRun(pcm), rraw = path.join(tmp, sl + '_run.raw'); fs.writeFileSync(rraw, Buffer.from(run.buffer, run.byteOffset, run.byteLength));
    const files = {}; [['level_1', raws[0]], ['level_2', raws[1]], ['level_3', raws[2]], ['a_fight', rraw]].forEach(([f, r]) => { const o = path.join(dir, f + '.mp3'); toMp3(r, o); files[f] = o; });
    const m = measure(raws.concat([rraw, traw, braw, b3raw]));
    const out = { name: S.name, made: '10/25', tool: 'tools/bohemia_sounds_four_new_songs.js', page_errors: errs.length, bars: BARS, bpm: 120,
      key: S.key, root: S.root, mode: S.mode, story: S.story, lead: S.lead.sample ? 'sample:' + S.lead.sample : S.lead.voice, lead_name: S.leadName, bass: S.bass, pad: S.pad,
      drums: [S.kit.kick.stem, S.kit.snare.stem, S.kit.hat.stem], kit_name: S.kitName, swing: S.swing || 0,
      run: { from_bar: RUN.from + 1, bars_each: RUN.bars, parts: RUN.parts.map(x => x[1] + ' (level ' + x[0] + ')') },
      levels: [1, 2, 3].map(lv => ({ level: lv, file: path.relative(ROOT, files['level_' + lv]), mp3_md5: md5(fs.readFileSync(files['level_' + lv])), bytes: fs.statSync(files['level_' + lv]).size,
        clipped_samples: R[lv].clipped, parts: R[lv].counts, audio: m[lv - 1] })),
      a_fight: { file: path.relative(ROOT, files.a_fight), mp3_md5: md5(fs.readFileSync(files.a_fight)), bytes: fs.statSync(files.a_fight).size, audio: m[3] },
      gain_to_his_loudness_db: +(20 * Math.log10(gn)).toFixed(2), kit_scale_db: +(20 * Math.log10(S.kitScale)).toFixed(2),
      tune_on_a_phone_vs_the_mix_db: +(m[4].phone_rms_db - m[0].phone_rms_db).toFixed(2), beat_on_a_phone_vs_the_mix_db: +(m[5].phone_rms_db - m[0].phone_rms_db).toFixed(2),
      beat_climbs_level_1_to_3_db: +(m[6].phone_rms_db - m[5].phone_rms_db).toFixed(2) };
    fs.writeFileSync(path.join(dir, 'measured.json'), JSON.stringify(out, null, 1) + '\n');
    console.log(S.name + ' in ' + ((Date.now() - t0) / 1000).toFixed(1) + ' s; phone rms ' + m.slice(0, 4).map(x => x.phone_rms_db).join(' / ') + '; tune vs mix ' + out.tune_on_a_phone_vs_the_mix_db + ' dB, beat vs mix ' + out.beat_on_a_phone_vs_the_mix_db + ', the beat climbs ' + out.beat_climbs_level_1_to_3_db + ' dB to level 3; clipped ' + [1, 2, 3].map(l => R[l].clipped).join('/'));
  }
  await Promise.all(A.map(x => x.b.close()));
  fs.rmSync(tmp, { recursive: true, force: true });
}

/* THE CARDS (rule 181(a)): one per new song, on the three-levels page (its own copy, naming the song and this list), the
   sha the commit on main that holds its recordings; the list the page reads is rebuilt from the songs that have a card */
const TEMPLATE = path.join(ROOT, 'slices', 'BOHEMIA_THREE_LEVELS_10_25_26.html');
const REG = path.join(ROOT, 'records', 'target', 'BOHEMIA_VOTE_REGISTRY.json');
const idOf = S => 'sounds-new-song-' + slug(S.name).replace(/_/g, '-') + '-10-25';
const pageOf = S => 'BOHEMIA_NEW_SONG_' + slug(S.name).toUpperCase() + '_10_25_26.html';
function entry(S) {
  const M = JSON.parse(fs.readFileSync(path.join(OUTD, slug(S.name), 'measured.json'), 'utf8'));
  return { name: S.name, slug: slug(S.name), dir: 'vote/songs/new_four/' + slug(S.name) + '/', id: idOf(S), levels_db: M.levels.map(x => x.audio.phone_rms_db),
    sub: 'A new song, ' + S.name + ': ' + S.story + '. Its own lead, ' + S.leadName + ', its own drums (' + S.kitName + '), in ' + S.key + '. In nothing until you say it joins.',
    what: { 1: '1. THE MAP: the song as it would play on the map, the tune on top, a soft 120 beat under it.',
            2: '2. THEIR TURN: the beat tightens, the ticking doubles, the bass pushes. The tune stays.',
            3: '3. YOUR TURN: the full kit, the bass driving, the tune doubled an octave.' } };
}
function register(which, write) {
  const reg = JSON.parse(fs.readFileSync(REG, 'utf8')), have = new Set(reg.items.map(x => x.id));
  for (const S of SONGS.filter(S => which === 'all' || slug(S.name) === which)) {
    const dir = path.join(OUTD, slug(S.name)); if (!fs.existsSync(path.join(dir, 'measured.json'))) { console.log('not recorded: ' + S.name); continue; }
    const t = fs.readFileSync(TEMPLATE, 'utf8');
    const page = t.replace('<meta name="song" content="">', '<meta name="song" content="' + slug(S.name) + '">').replace('<meta name="list" content="vote/songs/three_levels/index.json">', '<meta name="list" content="vote/songs/new_four/index.json">')
      .replace('<title>Three Levels</title>', '<title>' + S.name.replace(/\b(\w)(\w*)/g, (m, a, b) => a + b.toLowerCase()) + '</title>');
    if (page === t || !page.includes('new_four/index.json')) throw new Error('the template lost its metas');
    fs.writeFileSync(path.join(ROOT, 'slices', pageOf(S)), page);
    if (have.has(idOf(S))) { console.log('already a card: ' + idOf(S)); continue; }
    const sha = execFileSync('git', ['log', '-1', '--format=%h', 'origin/main', '--', path.join('slices', 'vote', 'songs', 'new_four', slug(S.name))], { cwd: ROOT, encoding: 'utf8' }).trim();
    if (!sha) throw new Error(S.name + ': push the recordings to main first');
    const card = { id: idOf(S), kind: 'song', lane: 'sounds', sha, made: '10/25', title: 'A NEW SONG: ' + S.name,
      why: 'A new song, ' + S.name + ', its own song this time: ' + S.leadName + ' for the lead, ' + S.kitName + ', in ' + S.key + ', a tune you can hum, at the three levels of a fight on the 120 beat, and it is in nothing until you say it joins. ' +
        'Tap 1, 2, 3 and then A FIGHT, and you hear it on this card in the VOTE tab, the turns changing on the bar.',
      options: ['A, ' + S.name + ' joins the game', 'B, no, not this one'], show: { how: 'page', src: pageOf(S) }, draft: true };
    if (write) { reg.items.push(card); have.add(card.id); }
    console.log((write ? 'REGISTERED ' : 'would register ') + card.id + ' at ' + sha);
  }
  if (write) {
    fs.writeFileSync(REG, JSON.stringify(reg, null, 1) + '\n');
    const songs = SONGS.filter(S => have.has(idOf(S)) && fs.existsSync(path.join(OUTD, slug(S.name), 'measured.json'))).map(entry);
    fs.writeFileSync(path.join(OUTD, 'index.json'), JSON.stringify({ made: '10/25', tool: 'tools/bohemia_sounds_four_new_songs.js', songs }, null, 1) + '\n');
    console.log('the list: ' + songs.map(x => x.name).join(', '));
  }
}

if (require.main === module) {
  const [cmd, arg, flag] = process.argv.slice(2);
  if (cmd === 'record') record(arg || 'all').catch(e => { console.error(e); process.exit(1); });
  else if (cmd === 'register') register(arg || 'all', flag === '--write');
  else { console.log('usage: record [slug|all] | register [slug|all] [--write]'); process.exit(2); }
}
module.exports = { SONGS, slug, idOf, pageOf };
