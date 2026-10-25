#!/usr/bin/env node
/* BOHEMIA -- HIS SONGS AT THREE LEVELS, IN THE VOTE TAB FIRST (SOUNDS, 10/25/26, rules 167, 168, 181).

   PAOLO 10/25: 'one intensity on the map or chilling, two when they're attacking, three when it's your turn to attack,
   real combat music'; 'everything at 120 BPM... it doesn't have tempo, doesn't intensify'; and, the rule over both
   (181): 'I still want to hear if it's something I even want... I hope you're not telling it to go immediately into the
   game without me hearing it.' So this tool makes the levels FOR THE VOTE TAB ONLY. Nothing in the alpha or the demo
   changes on disk; the game keeps playing his approved songs exactly as approved until he says a level joins (181(d)).

   ONE SONG, THREE LEVELS, ONE TIMELINE. Each level is his own engine playing his own row (MUS.playStep, synthV, drumV,
   his SONG_ARR form and SONG_ROOT key moves, the map's late beat), rendered offline from step 0, so bar N of level 1,
   level 2 and level 3 is the same bar of the same song in the same key: a level change is a crossfade on the bar and the
   song never jumps (that is also rule 175's render-ahead, proven here before it goes anywhere near the game).
     LEVEL 1, THE MAP: his song exactly as the map plays it (his recording's own pass, his gain) with ONE thing added, a
       soft 120 BPM pulse (rule 168(a): never a beatless hum): his own kick on every beat and his clock tick on the 8ths,
       quiet, under him.
     LEVEL 2, THEIR TURN (tension): his engine's own second tier (MUS.layers 2, his klay style), and a heartbeat kick on
       every beat, ticking 16ths, a low pedal on the root in 8ths and a tom on the off-beats, a rim roll into each phrase.
       No backbeat: it waits.
     LEVEL 3, YOUR TURN (real combat music, drums and drive; never the ambience louder): his engine's top tier
       (MUS.layers 4), a driving kit (kick with pickups, clap and knock on 2 and 4, 16th hats, a hit on each phrase), a bass
       in driving 8ths with the octave jump, and a hook in his song's own lead voice that you can hum, in his key, moving
       with his key changes.
   Every added part is one of his engine's voices (drumV, synthV); no sample, no noise recipe, nothing new to his machine.

     node tools/bohemia_sounds_three_levels.js record "THE VAULT"     renders the three levels and the fight run
     node tools/bohemia_sounds_three_levels.js record all              every song he plays (his OVERWORLD NIGHT + REPO MAN)
   writes slices/vote/songs/three_levels/<slug>/{level_1,level_2,level_3,a_fight}.mp3 and measured.json, and the index
   the card page reads (slices/vote/songs/three_levels/index.json). Card page: slices/BOHEMIA_THREE_LEVELS_10_25_26.html.
   Gate: gates/three_levels_vote_gate.js. */
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
const BARS = 32;
/* the fight run: from the bar his beat has arrived (bar 9 on the map), four bars each: the map, their turn, your turn,
   their turn, your turn. The change lands on the bar line. */
const RUN = { from: 8, parts: [[1, 'THE MAP'], [2, 'THEIR TURN'], [3, 'YOUR TURN'], [2, 'THEIR TURN'], [3, 'YOUR TURN']], bars: 4 };
/* the order his songs are recorded in; the first is the card he hears first */
const SONGS = ['THE VAULT', 'GHOST IN THE GRID', 'SLOW BLEED', 'SATELLITE PRAYER', 'SLOW CREEP', 'THE PIT BOSS IS GONE', 'THE ORGAN IN THE DROWNED CHAPEL', 'CAMPFIRE CONFESSION', 'REPO MAN'];
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const md5 = b => crypto.createHash('md5').update(b).digest('hex');

/* ONE LEVEL, ONE PASS of his engine into an OfflineAudioContext. */
async function level(p, name, lv, outGain, mp, hot) {
  return p.evaluate(async ({ name, lv, bars, outGain, mp, hot }) => {
    const SR = 44100, steps = bars * 16, sd = MUS.stepDur(), secs = steps * sd + 2.5;
    const li = MLOOPS.findIndex(x => x.n === name); if (li < 0) return { err: 'no song ' + name };
    MUS.audio();
    const OAC = new OfflineAudioContext(1, Math.ceil(SR * secs), SR);
    const save = { AC: MUS.AC, MAST: MUS.MAST, OUT: MUS.OUT, cur: MUS.cur, curSlot: MUS.curSlot, layers: MUS.layers, step: MUS.step, on: CITYMUS.on };
    const out0 = OAC.createGain(); out0.gain.value = outGain;
    /* level 1 is his song as approved: straight to the output. Levels 2 and 3 are new music, through a gentle limiter
       so the added kit never clips his song (the limiter never touches level 1). THE GAIN GOES FIRST: his SLOW BLEED and
       SLOW CREEP play past full scale and are recorded 6 dB down; with the gain after the limiter they hit it 6 dB hot and
       came out squashed, levels 2 and 3 quieter than level 1 on a phone (SLOW BLEED -46.5 / -50.2 / -51.2 dB), measured. */
    let songBus = out0, partBus = out0;
    /* (not on his two hot songs: their low end at -7 dBFS holds the compressor down and every part under it with it;
       measured, SLOW BLEED's level 3 came out 2.5 dB under its level 1 on a phone even with the song 6 dB down. On those
       two the true peak limit below is the only limit.) */
    if (lv > 1 && !hot) {
      const lim = OAC.createDynamicsCompressor();
      lim.threshold.value = -9; lim.knee.value = 6; lim.ratio.value = 8; lim.attack.value = 0.003; lim.release.value = 0.12;
      out0.connect(lim); lim.connect(OAC.destination);
    } else out0.connect(OAC.destination);
    /* HIS TWO HOT SONGS (SLOW BLEED, SLOW CREEP: recorded 6 dB down because his engine plays them past full scale) carry
       their own low end at -7 dBFS, so on levels 2 and 3 the compressor squashed everything under it and level 3 came out
       no louder than level 1 on a phone (SLOW CREEP -45.2 / -41.6 / -44.9 dB): on those two it is skipped (above). */
    /* (A 6 dB trim on the song was tried first: its tune is what a phone hears of it, so levels 2 and 3 came out 4 dB
       UNDER level 1 on a phone, SLOW BLEED -46.5 / -50.5 / -49.9. No trim: the song at its own gain, the parts over it,
       and the true peak limit below catches what passes full scale.) */
    /* REPO MAN PLAYS AS THE MACHINE PARTY (his YES 10/19, rule 122): exactly the game's own wiring (SONGFENCE.machine in
       the alpha): take A's hall and tape, the recorder's trim, the machine answering his kick and hat. The added parts go
       into the same chain (the same room, the same trim); they call his drumV from BEFORE the machine wraps it, so the
       machine answers his song's kick and never the pulse's. */
    let X = null, dv0 = drumV;
    if (mp) {
      X = window.MACHINEPARTY; await X.loadFrom(OAC, window.__mpBytes);
      const trim = OAC.createGain(); trim.gain.value = Math.pow(10, mp.trimDb / 20); trim.connect(out0);
      const ch = X.chain(OAC, trim, { hall: mp.spec.hall, tape: mp.spec.tape });
      X.attach(mp.spec, { music: ch.input, machine: ch.machine });
      songBus = ch.input; partBus = ch.input;
    }
    const part = g => { const n = OAC.createGain(); n.gain.value = g; n.connect(partBus); return n; };
    MUS.AC = OAC; MUS.MAST = songBus; MUS.OUT = songBus; MUS.cur = MFACTIONS.length + li; MUS.curSlot = 1;
    MUS.layers = lv === 1 ? 0 : lv === 2 ? 2 : 4;              /* KILLMUS.LAYERS: level 1, 2, 3 -> arrangement 0, 2, 4 */
    CITYMUS.on = true;                                          /* the map owns the music: his 9/12 late beat, same timeline */
    const f = MUS.fac(), hz = x => MUS.noteHz(x), sc = f.scale, n = sc.length;
    const kick = (f.kit && f.kit.k) || 'punchk', lead = MUS.leadVoice((f.inst && f.inst.l) || 'pluck');
    const bassV = (f.inst && f.inst.b && f.inst.b !== 'osc') ? f.inst.b : 'sub';
    const deg = d => sc[((d % n) + n) % n] + 12 * Math.floor(d / n);
    /* the hook: two bars you can hum, the second answers the first, the fourth bar of a phrase lifts */
    const HOOK = [[0, 0], [2, 0], [4, 2], [6, 1], [7, 0], [10, 4], [12, 3], [14, 2]];
    const ANS = [[0, 0], [2, 0], [4, 2], [6, 4], [8, 5], [11, 4], [12, 2], [14, 1]];
    const LIFT = [[0, 5], [2, 4], [4, 5], [6, 7], [8, 5], [10, 4], [12, 2], [14, 4]];
    /* THE LEVELS ON A PHONE, MEASURED (THE VAULT's first take): the parts at 0.55 to 1.0 put level 2 5.3 dB and level 3
       8.6 dB over level 1 through a phone, their turn as loud as a fight; pulled down so 2 sits about 2 to 3 dB over 1 and
       3 about 5 to 6, the tension between the map and the fight. The pulse on 1 stays soft; on a phone the clock is what
       you hear of it (a phone's speaker drops the kick's low end). */
    /* HIS TWO HOT SONGS on levels 2 and 3: no added kick, bass, pedal, tom or hit. MEASURED: their own low end already
       peaks near full scale, so every added low note hit the peak limit and pulled the whole song down with it (SLOW
       BLEED -46.5 / -48.3 / -49.3 dB with the compressor skipped and no trim); their own kick and bass carry the bottom, the
       added parts are the ones a phone hears (the ticking, the clap and knock, the hats, the hook). */
    const lo = hot && lv > 1 ? 0 : 1;
    const P = lv === 1 ? { pulse: part(0.40), clock: part(0.20) }
      : lv === 2 ? { kick: part(0.55 * lo), tick: part(0.26), pedal: part(0.40 * lo), tom: part(0.55 * lo), rim: part(0.30) }
      : { kick: part(0.85 * lo), snare: part(0.70), hat: part(0.30), hit: part(0.45 * lo), bass: part(0.50 * lo), hook: part(1.0) };
    const counts = {};
    /* a part at gain 0 (the hot songs' low parts) is not played and not counted: measured.json says what was added */
    const D = (k, node, t) => { if (!node.gain.value) return; counts['d:' + k] = (counts['d:' + k] || 0) + 1; dv0(k, OAC, node, t); };
    const S = (k, node, semi, t, g, dur) => { if (!node.gain.value) return; counts['s:' + k] = (counts['s:' + k] || 0) + 1; synthV(k, OAC, node, hz, dur || sd, semi, t, g); };
    let err = null;
    try {
      for (let s = 0; s < steps; s++) {
        const t = 0.05 + s * sd, c = MUS.songCtx(s), q = s % 16, rs = sc[c.rs % n] || 0;
        MUS.step = s; MUS.playStep(q, t, c);
        if (lv === 1) {
          if (q % 4 === 0) D(kick, P.pulse, t);
          if (q % 2 === 0) D('clickh', P.clock, t);
        } else if (lv === 2) {
          if (q % 4 === 0) D(kick, P.kick, t);
          if (q === 14 && c.barIn % 2 === 1) D(kick, P.kick, t);
          D('clickh', P.tick, t);
          if (q % 2 === 0) S(bassV, P.pedal, f.root - 55 + rs, t, 0.10);
          if (q === 6 || q === 14) S('taiko', P.tom, f.root - 55 + rs, t, 0.09);
          if (c.fill && q >= 8) D('rim', P.rim, t);
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
    if (X) { X.detach(); X.log = []; }
    MUS.AC = save.AC; MUS.MAST = save.MAST; MUS.OUT = save.OUT; MUS.cur = save.cur; MUS.curSlot = save.curSlot; MUS.layers = save.layers; MUS.step = save.step; CITYMUS.on = save.on;
    if (err) return { err };
    const buf = await OAC.startRendering(), L = buf.getChannelData(0);
    /* A TRUE PEAK LIMIT on levels 2 and 3 (never level 1, his song as approved): the compressor lets a transient through
       (his SLOW BLEED, recorded 6 dB down because his engine plays it past full scale, clipped 12,776 samples at level 3
       through it), so the gain that keeps every sample under -0.5 dBFS is held 5 ms ahead and released over 80 ms */
    if (lv > 1) {
      const CEIL = 0.944, SR2 = 44100, AH = Math.round(SR2 * 0.005), REL = Math.exp(-1 / (SR2 * 0.08)), n2 = L.length;
      const need = new Float32Array(n2); for (let i = 0; i < n2; i++) { const a = Math.abs(L[i]); need[i] = a > CEIL ? CEIL / a : 1; }
      const hold = new Float32Array(n2); const dq = []; /* the smallest need over the next AH samples, a sliding minimum */
      for (let i = n2 - 1; i >= 0; i--) { while (dq.length && need[dq[dq.length - 1]] >= need[i]) dq.pop(); dq.push(i); while (dq[0] > i + AH) dq.shift(); hold[i] = need[dq[0]]; }
      let g = 1; for (let i = 0; i < n2; i++) { const w = hold[i]; g = w < g ? w : w - (w - g) * REL; L[i] *= g; }
    }
    const pcm = new Int16Array(L.length); let clip = 0;
    for (let i = 0; i < L.length; i++) { const v = Math.round(L[i] * 32767); if (Math.abs(v) > 32767) clip++; pcm[i] = Math.max(-32767, Math.min(32767, v)); }
    const u8 = new Uint8Array(pcm.buffer); let bin = ''; for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
    return { b64: btoa(bin), sr: SR, sd, clipped: clip, root: f.root, scale: sc, lead, bass: bassV, kick, klay: f.klay || 'drive', arr: MUS.ARR.slice(0, 8), rt: MUS.RT.slice(0, 8), counts };
  }, { name, lv, bars: BARS, outGain, mp: mp || null, hot: !!hot });
}

/* the measure his machine's own tool uses: rms, peak, phone rms, per bar */
const measure = raws => JSON.parse(execFileSync('python3', ['-I', path.join(ROOT, 'tools', 'bohemia_sounds_his_machine_measure.py')].concat(raws), { encoding: 'utf8', maxBuffer: 64 << 20 }));
const toMp3 = (raw, out) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 's16le', '-ar', '44100', '-ac', '1', '-i', raw, '-c:a', 'libmp3lame', '-b:a', '96k', out]);

/* THE FIGHT RUN, spliced from the three levels on the bar line, a 40 ms crossfade so a change never clicks */
function fightRun(pcm, sr, sd) {
  const bar = Math.round(16 * sd * sr), off = Math.round(0.05 * sr), xf = Math.round(0.04 * sr);
  const len = RUN.parts.length * RUN.bars * bar, out = new Int16Array(len + xf);
  RUN.parts.forEach(([lv], i) => {
    const src = pcm[lv], s0 = off + (RUN.from + i * RUN.bars) * bar, o0 = i * RUN.bars * bar;
    for (let k = -xf; k < RUN.bars * bar + xf; k++) {
      const o = o0 + k; if (o < 0 || o >= out.length) continue;
      let w = 1; if (k < 0) w = (k + xf) / xf; else if (k >= RUN.bars * bar) w = 1 - (k - RUN.bars * bar) / xf;
      if (i === 0 && k < 0) continue;
      const v = (src[s0 + k] || 0) * w; out[o] = Math.max(-32767, Math.min(32767, out[o] + v));
    }
  });
  /* a two-bar fade at the end, the fight ends, the run does not cut off mid note */
  const fade = 2 * bar; for (let k = 0; k < fade; k++) { const i = len - fade + k; out[i] = Math.round(out[i] * (1 - k / fade)); }
  return out.subarray(0, len);
}

async function record(which) {
  const his = JSON.parse(fs.readFileSync(HISM, 'utf8'));
  const list = which === 'all' ? SONGS : SONGS.filter(s => s === which || slug(s) === which);
  if (!list.length) throw new Error('no song ' + which);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'three_levels_'));
  /* three alphas, one level each, in parallel (level 3 alone took 215 s on THE VAULT's first take) */
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
    const og = his[name] ? Math.pow(10, (his[name].gain_db || 0) / 20) : 1;
    const R = {}, pcm = {}, raws = [];
    await Promise.all([1, 2, 3].map(async lv => {
      const p = A[lv - 1].p;
      let g = og, r;
      for (;;) { const tl = Date.now(); r = await level(p, name, lv, g, name === 'REPO MAN' ? MP : null, !!(his[name] && his[name].gain_db < 0)); console.log("  " + name + " level " + lv + " gain " + g.toFixed(3) + " clipped " + r.clipped + " in " + ((Date.now() - tl) / 1000).toFixed(1) + " s"); if (r.err) throw new Error(name + ' level ' + lv + ': ' + r.err); if (!r.clipped || g < 0.1) break; g /= 2; }
      const raw = path.join(tmp, sl + '_' + lv + '.raw'); fs.writeFileSync(raw, Buffer.from(r.b64, 'base64')); delete r.b64;
      pcm[lv] = new Int16Array(fs.readFileSync(raw).buffer.slice(0)); R[lv] = Object.assign(r, { gain_db: +(20 * Math.log10(g)).toFixed(2) }); raws[lv - 1] = raw;
    }));
    const run = fightRun(pcm, R[1].sr, R[1].sd), runRaw = path.join(tmp, sl + '_run.raw');
    fs.writeFileSync(runRaw, Buffer.from(run.buffer, run.byteOffset, run.byteLength));
    const files = {};
    [[1, 'level_1'], [2, 'level_2'], [3, 'level_3']].forEach(([lv, f]) => { const o = path.join(dir, f + '.mp3'); toMp3(raws[lv - 1], o); files[f] = o; });
    const ro = path.join(dir, 'a_fight.mp3'); toMp3(runRaw, ro); files.a_fight = ro;
    const m = measure(raws.concat([runRaw]));
    const out = { name, made: '10/25', tool: 'tools/bohemia_sounds_three_levels.js', page_errors: errs.length, bars: BARS, bpm: 120,
      key: { root: R[1].root, scale: R[1].scale }, his_voices: { lead: R[1].lead, bass: R[1].bass, kick: R[1].kick, klay: R[1].klay }, form: { arr: R[1].arr, rt: R[1].rt },
      run: { from_bar: RUN.from + 1, bars_each: RUN.bars, parts: RUN.parts.map(x => x[1] + ' (level ' + x[0] + ')') },
      levels: [1, 2, 3].map(lv => ({ level: lv, file: path.relative(ROOT, files['level_' + lv]), mp3_md5: md5(fs.readFileSync(files['level_' + lv])), bytes: fs.statSync(files['level_' + lv]).size,
        gain_db: R[lv].gain_db, clipped_samples: R[lv].clipped, parts_added: R[lv].counts, audio: m[lv - 1] })),
      a_fight: { file: path.relative(ROOT, ro), mp3_md5: md5(fs.readFileSync(ro)), bytes: fs.statSync(ro).size, audio: m[3] } };
    fs.writeFileSync(path.join(dir, 'measured.json'), JSON.stringify(out, null, 1) + '\n');
    /* the list the pages read is written only from the registry (rebuild): a song rendered and not yet carded is never on it
       (MEASURED 10/25: this line wrote all nine while three had no card, between a rebuild and its commit, and main listed them) */
    console.log(name + ' in ' + ((Date.now() - t0) / 1000).toFixed(1) + ' s; phone rms L1 ' + m[0].phone_rms_db + ' L2 ' + m[1].phone_rms_db + ' L3 ' + m[2].phone_rms_db + ' run ' + m[3].phone_rms_db + '; clipped ' + [1, 2, 3].map(l => R[l].clipped).join('/'));
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

/* THE CARD (rule 181(a)): one card per song, appended to the registry, never editing anybody else's; the sha is the
   commit that last touched the song's recordings, so the card points at what he hears */
function register(which, write) {
  const REG = path.join(ROOT, 'records', 'target', 'BOHEMIA_VOTE_REGISTRY.json');
  const reg = JSON.parse(fs.readFileSync(REG, 'utf8'));
  const list = SONGS.filter(n => which === 'all' || n === which || slug(n) === which || which.split(',').indexOf(n) >= 0)
    .filter(n => fs.existsSync(path.join(OUTD, slug(n), 'measured.json')))
    .map(n => ({ name: n, slug: slug(n), dir: 'vote/songs/three_levels/' + slug(n) + '/', id: 'sounds-three-levels-' + slug(n).replace(/_/g, '-') + '-10-25' }));
  let added = 0;
  for (const S of list) {
    if (reg.items.some(x => x.id === S.id)) { writePage(S); console.log('already a card (its page written again): ' + S.id); continue; }
    const sha = execFileSync('git', ['log', '-1', '--format=%h', 'origin/main', '--', path.join('slices', S.dir)], { cwd: ROOT, encoding: 'utf8' }).trim();
    if (!sha) { console.log(S.name + ': not on main yet, no card (push its recordings first)'); continue; }
    writePage(S);
    /* the sha must be one he can go look at: on main, not a local commit a rebase will rename (card 1 was registered at a
       pre-rebase 512d6316 and corrected to 0538fe30) */
    const onMain = execFileSync('git', ['branch', '-r', '--contains', sha], { cwd: ROOT, encoding: 'utf8' });
    if (!/origin\/main\b/.test(onMain)) throw new Error(S.name + ': push the recordings to main first, ' + sha + ' is not on main');
    const card = { id: S.id, kind: 'song', lane: 'sounds', sha, made: '10/25',
      title: S.name + ': YOUR SONG AT THREE LEVELS, FOR THE FIGHT',
      why: 'Your ' + S.name + ' at three levels on the 120 beat: 1 the map as you approved it with a soft beat under it, 2 their turn with tension, 3 your turn with full drums, a driving bass and a hook in your song\'s own lead, and none of it is in the game until you say so. ' +
        'Tap 1, 2, 3 and then A FIGHT, and you hear it on this card in the VOTE tab, the turns changing on the bar the way a fight plays them.',
      options: ['A, the three levels join the game for ' + S.name, 'B, no, not like this'],
      show: { how: 'page', src: pageOf(S) }, draft: true };
    if (write) reg.items.push(card);
    console.log((write ? 'REGISTERED ' : 'would register ') + S.id + ' at ' + sha); added++;
  }
  if (write && added) fs.writeFileSync(REG, JSON.stringify(reg, null, 1) + '\n');
  if (write) rebuild(reg);
}

/* THE LIST THE PAGES READ, REBUILT FROM THE RECORDINGS THAT HAVE A CARD: a song still rendering, or rendered and not yet
   carded, is never on it, so the tab never shows a card for a song that is not there (and the renderer's own writes of the
   list, made while it runs, are put right at the next card) */
function rebuild(reg) {
  reg = reg || JSON.parse(fs.readFileSync(path.join(ROOT, 'records', 'target', 'BOHEMIA_VOTE_REGISTRY.json'), 'utf8'));
  const ids = new Set(reg.items.map(x => x.id));
  const songs = SONGS.map(name => {
    const sl = slug(name), m = path.join(OUTD, sl, 'measured.json'), id = 'sounds-three-levels-' + sl.replace(/_/g, '-') + '-10-25';
    if (!fs.existsSync(m) || !ids.has(id)) return null;
    const M = JSON.parse(fs.readFileSync(m, 'utf8'));
    return { name, slug: sl, dir: 'vote/songs/three_levels/' + sl + '/', levels_db: M.levels.map(x => x.audio.phone_rms_db), id };
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
module.exports = { level, SONGS, RUN, slug };
