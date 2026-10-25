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
async function level(p, name, lv, outGain) {
  return p.evaluate(async ({ name, lv, bars, outGain }) => {
    const SR = 44100, steps = bars * 16, sd = MUS.stepDur(), secs = steps * sd + 2.5;
    const li = MLOOPS.findIndex(x => x.n === name); if (li < 0) return { err: 'no song ' + name };
    MUS.audio();
    const OAC = new OfflineAudioContext(1, Math.ceil(SR * secs), SR);
    const save = { AC: MUS.AC, MAST: MUS.MAST, OUT: MUS.OUT, cur: MUS.cur, curSlot: MUS.curSlot, layers: MUS.layers, step: MUS.step, on: CITYMUS.on };
    const out0 = OAC.createGain(); out0.gain.value = outGain; out0.connect(OAC.destination);
    /* level 1 is his song as approved: straight to the output. Levels 2 and 3 are new music, through a gentle limiter
       so the added kit never clips his song (the limiter never touches level 1). */
    let songBus = out0, partBus = out0;
    if (lv > 1) {
      const lim = OAC.createDynamicsCompressor();
      lim.threshold.value = -9; lim.knee.value = 6; lim.ratio.value = 8; lim.attack.value = 0.003; lim.release.value = 0.12;
      lim.connect(out0); songBus = lim; partBus = lim;
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
    const P = lv === 1 ? { pulse: part(0.40), clock: part(0.20) }
      : lv === 2 ? { kick: part(0.55), tick: part(0.26), pedal: part(0.40), tom: part(0.55), rim: part(0.30) }
      : { kick: part(0.85), snare: part(0.70), hat: part(0.30), hit: part(0.45), bass: part(0.50), hook: part(1.0) };
    const counts = {};
    const D = (k, node, t) => { counts['d:' + k] = (counts['d:' + k] || 0) + 1; drumV(k, OAC, node, t); };
    const S = (k, node, semi, t, g, dur) => { counts['s:' + k] = (counts['s:' + k] || 0) + 1; synthV(k, OAC, node, hz, dur || sd, semi, t, g); };
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
    MUS.AC = save.AC; MUS.MAST = save.MAST; MUS.OUT = save.OUT; MUS.cur = save.cur; MUS.curSlot = save.curSlot; MUS.layers = save.layers; MUS.step = save.step; CITYMUS.on = save.on;
    if (err) return { err };
    const buf = await OAC.startRendering(), L = buf.getChannelData(0);
    const pcm = new Int16Array(L.length); let clip = 0;
    for (let i = 0; i < L.length; i++) { const v = Math.round(L[i] * 32767); if (Math.abs(v) > 32767) clip++; pcm[i] = Math.max(-32767, Math.min(32767, v)); }
    const u8 = new Uint8Array(pcm.buffer); let bin = ''; for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
    return { b64: btoa(bin), sr: SR, sd, clipped: clip, root: f.root, scale: sc, lead, bass: bassV, kick, klay: f.klay || 'drive', arr: MUS.ARR.slice(0, 8), rt: MUS.RT.slice(0, 8), counts };
  }, { name, lv, bars: BARS, outGain });
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
  fs.mkdirSync(OUTD, { recursive: true });
  const IDX = path.join(OUTD, 'index.json');
  const index = fs.existsSync(IDX) ? JSON.parse(fs.readFileSync(IDX, 'utf8')) : { made: '10/25', tool: 'tools/bohemia_sounds_three_levels.js', songs: [] };
  for (const name of list) {
    const t0 = Date.now(), sl = slug(name), dir = path.join(OUTD, sl);
    fs.mkdirSync(dir, { recursive: true });
    /* his own gain (his_night_songs: a song his engine plays past full scale is recorded 6 dB down until it does not) */
    const og = his[name] ? Math.pow(10, (his[name].gain_db || 0) / 20) : 1;
    const R = {}, pcm = {}, raws = [];
    await Promise.all([1, 2, 3].map(async lv => {
      const p = A[lv - 1].p;
      let g = og, r;
      for (;;) { const tl = Date.now(); r = await level(p, name, lv, g); console.log("  " + name + " level " + lv + " gain " + g.toFixed(3) + " clipped " + r.clipped + " in " + ((Date.now() - tl) / 1000).toFixed(1) + " s"); if (r.err) throw new Error(name + ' level ' + lv + ': ' + r.err); if (!r.clipped || g < 0.1) break; g /= 2; }
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
    index.songs = index.songs.filter(x => x.name !== name).concat([{ name, slug: sl, dir: 'vote/songs/three_levels/' + sl + '/',
      levels_db: out.levels.map(x => x.audio.phone_rms_db), id: 'sounds-three-levels-' + sl.replace(/_/g, '-') + '-10-25' }]);
    index.songs.sort((a, c) => SONGS.indexOf(a.name) - SONGS.indexOf(c.name));
    fs.writeFileSync(IDX, JSON.stringify(index, null, 1) + '\n');
    console.log(name + ' in ' + ((Date.now() - t0) / 1000).toFixed(1) + ' s; phone rms L1 ' + m[0].phone_rms_db + ' L2 ' + m[1].phone_rms_db + ' L3 ' + m[2].phone_rms_db + ' run ' + m[3].phone_rms_db + '; clipped ' + [1, 2, 3].map(l => R[l].clipped).join('/'));
  }
  await Promise.all(A.map(x => x.b.close()));
  fs.rmSync(tmp, { recursive: true, force: true });
}

/* THE CARD (rule 181(a)): one card per song, appended to the registry, never editing anybody else's; the sha is the
   commit that last touched the song's recordings, so the card points at what he hears */
function register(which, write) {
  const REG = path.join(ROOT, 'records', 'target', 'BOHEMIA_VOTE_REGISTRY.json');
  const reg = JSON.parse(fs.readFileSync(REG, 'utf8'));
  const index = JSON.parse(fs.readFileSync(path.join(OUTD, 'index.json'), 'utf8'));
  const list = index.songs.filter(x => which === 'all' || x.name === which || x.slug === which);
  let added = 0;
  for (const S of list) {
    if (reg.items.some(x => x.id === S.id)) { console.log('already a card: ' + S.id); continue; }
    const sha = execFileSync('git', ['log', '-1', '--format=%h', '--', path.join('slices', S.dir)], { cwd: ROOT, encoding: 'utf8' }).trim();
    if (!sha) throw new Error(S.name + ': commit the recordings first, the card needs their sha');
    const card = { id: S.id, kind: 'song', lane: 'sounds', sha, made: '10/25',
      title: 'YOUR ' + S.name + ' AT THREE LEVELS, FOR THE FIGHT',
      why: 'You said one intensity on the map, two when they attack, three when it is your turn, real combat music, all on the 120 beat. This is your ' + S.name +
        ' played by its own machine at all three: 1 the map, your song exactly as you approved it with a soft 120 beat under it; 2 their turn, tension, a heartbeat kick and ticking; 3 your turn, full drums, a driving bass and a hook in your song\'s own lead. Tap A FIGHT to hear the turns change on the bar the way a fight plays them. None of it is in the game until you say so; the game keeps your song as it is.',
      options: ['A, the three levels join the game for ' + S.name, 'B, no, not like this'],
      show: { how: 'page', src: 'BOHEMIA_THREE_LEVELS_10_25_26.html#' + S.slug }, draft: true };
    if (write) reg.items.push(card);
    console.log((write ? 'REGISTERED ' : 'would register ') + S.id + ' at ' + sha); added++;
  }
  if (write && added) fs.writeFileSync(REG, JSON.stringify(reg, null, 1) + '\n');
}

if (require.main === module) {
  const [cmd, arg, flag] = process.argv.slice(2);
  if (cmd === 'record') record(arg || 'THE VAULT').catch(e => { console.error(e); process.exit(1); });
  else if (cmd === 'register') register(arg || 'THE VAULT', flag === '--write');
  else { console.log('usage: record "<his song>" | record all | register "<his song>"|all [--write]'); process.exit(2); }
}
module.exports = { level, SONGS, RUN, slug };
