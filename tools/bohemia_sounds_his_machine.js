#!/usr/bin/env node
/* BOHEMIA -- A NEW SONG THROUGH HIS SONGS' OWN MACHINE (SOUNDS, 10/18/26, row [his sound, not a revamp]).

   RULE 119 (Paolo 10/18, LOCKED, his NO on The Long Road): 'both songs not giving analog horror vibes I was hoping the
   research that Grok helped you do would make it easier to do what you needed to do not like have a whole revamp
   process where you're like making songs I don't fit aesthetic'. A new song starts from his canon songs' own
   instruments, kits and arrangement (MLOOPS, synthV, drumV, SONG_ARR), read and reused, never edited.

   SO THIS TOOL HAS NO SYNTHESIS IN IT. A song is one row in the shape of his MLOOPS rows (slices/vote/songs/<id>.json,
   'row'). The tool opens the alpha in Chromium, read only, pushes that row into MLOOPS IN THE PAGE'S MEMORY, and plays
   it with the alpha's own MUS.playStep (his voices, his kit, his 64-bar form and his key moves) into an
   OfflineAudioContext, the way tools/bohemia_sounds_record_his_song.js records his REPO MAN: CITYMUS on, so the beat
   arrives late as the map plays every song; no kill layers. His two songs named in 'beside' are recorded the same
   way, through the same engine, at the same level, so the A/B is the music and nothing else. Nothing in the alpha is
   changed on disk; the song lock proves it.

   EVERY CALL IS LOGGED. synthV and drumV are wrapped for the length of the render (and put back), so the record says
   which of his voices played, how many times, and when: the late beat, the tune's bars, the notes a bar. A second,
   cheap pass renders the tune alone (the row's lead voice only), so the tune's level on a phone is a number.

   THE LEVEL: his songs at the engine's own, gain 1, no limiter (a common gain down only if a peak would pass -1 dB);
   the new song's recording alone set to its parent's loudness through a phone's speaker, the gain written down.

     node tools/bohemia_sounds_his_machine.js slices/vote/songs/the_rosary_on_channel_3.json [bars]
   writes slices/vote/songs/<file stem>/song.mp3, his_<slug>.mp3 for each song in 'beside', and measured.json.

   module.exports.schedule(page, spec, bars) is the same engine pass with no audio, for the gate (milliseconds).
*/
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const ROOT = path.dirname(__dirname);
function pw() { for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules', '/usr/local/lib/node_modules']) { try { return require(path.join(g, 'playwright')); } catch (e) {} } return require('playwright'); }
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const rowMd5 = row => crypto.createHash('md5').update(JSON.stringify(row)).digest('hex');

async function openAlpha() {
  const { chromium } = pw();
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html'));
  await p.waitForTimeout(1500);
  await p.click('#front', { force: true }).catch(() => {});
  await p.waitForTimeout(1200);
  return { b, p, errs };
}

/* ONE PASS OF HIS ENGINE. spec = { name } for one of his songs, or { row } for a new one (pushed in memory, popped
   after). audio: render and hand back 16-bit PCM; only: the voice kinds allowed to sound (the tune alone). */
async function pass(p, spec, bars, audio, only) {
  return p.evaluate(async ({ spec, bars, audio, only }) => {
    let pushed = false;
    if (spec.row) { MLOOPS.push(JSON.parse(JSON.stringify(spec.row))); pushed = true; }
    const name = spec.row ? spec.row.n : spec.name;
    const li = MLOOPS.findIndex(x => x.n === name); if (li < 0) return { err: 'no song ' + name };
    const idx = MFACTIONS.length + li, SR = 44100, steps = bars * 16, sd = MUS.stepDur();
    const secs = audio ? steps * sd + 1.5 : 1;
    MUS.audio();
    const OAC = new OfflineAudioContext(1, Math.ceil(SR * secs), SR);
    const save = { AC: MUS.AC, MAST: MUS.MAST, OUT: MUS.OUT, cur: MUS.cur, curSlot: MUS.curSlot, layers: MUS.layers, step: MUS.step, on: CITYMUS.on };
    const mast = OAC.createGain(); mast.gain.value = 1; mast.connect(OAC.destination);
    MUS.AC = OAC; MUS.MAST = mast; MUS.OUT = mast; MUS.cur = idx; MUS.curSlot = 1; MUS.layers = 0;
    CITYMUS.on = true;                                      /* the map owns the music: his 9/12 late beat */
    const row = MUS.fac(), log = [], _sv = synthV, _dv = drumV, ok = k => !only || only.indexOf(k) >= 0;
    synthV = function (kind, AC, M, hz, sdd, semi, t, g0) { log.push(['s', kind, +(t - 0.05).toFixed(4), semi, g0]); if (ok(kind)) return _sv.apply(this, arguments); };
    drumV = function (kind, AC, M, t) { log.push(['d', kind, +(t - 0.05).toFixed(4)]); if (ok(kind)) return _dv.apply(this, arguments); };
    let err = null;
    try { for (let s = 0; s < steps; s++) { MUS.step = s; MUS.playStep(s % 16, 0.05 + s * sd, MUS.songCtx(s)); } } catch (e) { err = e.message; }
    synthV = _sv; drumV = _dv;
    MUS.AC = save.AC; MUS.MAST = save.MAST; MUS.OUT = save.OUT; MUS.cur = save.cur; MUS.curSlot = save.curSlot; MUS.layers = save.layers; MUS.step = save.step; CITYMUS.on = save.on;
    const form = { arr: MUS.ARR.slice(), rt: MUS.RT.slice(), sd: sd, lead: MUS.leadVoice((row.inst && row.inst.l) || 'pluck') };
    if (pushed) MLOOPS.pop();
    if (err) return { err };
    const out = { name, row: JSON.parse(JSON.stringify(row)), log, form, steps, sd };
    if (!audio) return out;
    const buf = await OAC.startRendering(), L = buf.getChannelData(0);
    const pcm = new Int16Array(L.length); for (let i = 0; i < L.length; i++) pcm[i] = Math.max(-32767, Math.min(32767, Math.round(L[i] * 32767)));
    const u8 = new Uint8Array(pcm.buffer); let bin = ''; for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
    out.b64 = btoa(bin); out.sr = SR; out.secs = secs;
    return out;
  }, { spec, bars, audio, only: only || null });
}

/* WHAT HIS ENGINE SCHEDULED, read off the log: the beat, the tune, the notes a bar, the voices */
function summarise(r) {
  const bars = r.steps / 16, sd = r.sd, barOf = t => Math.floor(t / (16 * sd) + 1e-6);
  const kinds = {}; r.log.forEach(x => { const k = (x[0] === 'd' ? 'drum ' : '') + x[1]; kinds[k] = (kinds[k] || 0) + 1; });
  const drums = r.log.filter(x => x[0] === 'd'), pitched = r.log.filter(x => x[0] === 's');
  const tune = pitched.filter(x => x[1] === r.form.lead && (x[4] === 0.07 || x[4] === 0.055));   /* the tune's own call sites: 0.07, the hymn 0.055 */
  const tuneBars = new Set(tune.map(x => barOf(x[2])));
  return {
    bars, bpm: +(60 / (sd * 4)).toFixed(3), first_drum_s: drums.length ? drums[0][2] : null, first_drum_bar: drums.length ? barOf(drums[0][2]) + 1 : null,
    first_tune_s: tune.length ? tune[0][2] : null, tune_notes: tune.length, tune_bars: tuneBars.size,
    pitched_notes_a_bar: +(pitched.length / bars).toFixed(2), tune_notes_a_bar: +(tune.length / bars).toFixed(2), drum_hits: drums.length,
    voices: kinds, tune_semis: tune.map(x => x[3]),
  };
}

function measure(raws) {
  const py = path.join(ROOT, 'tools', 'bohemia_sounds_his_machine_measure.py');
  return JSON.parse(execFileSync('python3', ['-I', py].concat(raws), { encoding: 'utf8', maxBuffer: 64 << 20 }));
}

async function main() {
  const SONGF = path.resolve(ROOT, process.argv[2] || 'slices/vote/songs/the_rosary_on_channel_3.json');
  const BARS = +(process.argv[3] || 32);
  const song = JSON.parse(fs.readFileSync(SONGF, 'utf8'));
  const DIR = path.join(path.dirname(SONGF), path.basename(SONGF, '.json'));
  fs.mkdirSync(DIR, { recursive: true });
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'his_machine_'));
  const specs = [{ key: 'song', spec: { row: song.row }, file: 'song.mp3' }].concat(song.beside.map(n => ({ key: n, spec: { name: n }, file: 'his_' + slug(n) + '.mp3' })));
  const { b, p, errs } = await openAlpha();
  const res = [];
  for (const s of specs) {
    const t0 = Date.now();
    const full = await pass(p, s.spec, BARS, true);
    if (full.err) { console.log('FAILED ' + s.key + ': ' + full.err); await b.close(); process.exit(1); }
    const tuneOnly = await pass(p, s.spec, BARS, true, [full.form.lead]);
    const whole = await pass(p, s.spec, 64, false);           /* the whole 2:08 pass, schedule only */
    const rawF = path.join(tmp, slug(s.key) + '.raw'), rawT = path.join(tmp, slug(s.key) + '_tune.raw');
    fs.writeFileSync(rawF, Buffer.from(full.b64, 'base64')); fs.writeFileSync(rawT, Buffer.from(tuneOnly.b64, 'base64'));
    res.push({ s, full, whole, rawF, rawT, ms: Date.now() - t0 });
    console.log('rendered ' + full.name + ' (' + BARS + ' bars) in ' + ((Date.now() - t0) / 1000).toFixed(1) + ' s');
  }
  await b.close();
  const m = measure(res.flatMap(r => [r.rawF, r.rawT]));
  /* THE LEVEL. His songs at the engine's own level (gain 1, one common gain down only if a peak would pass -1 dB). The
     new song's recording ALONE is set to its parent's loudness through a phone's speaker, so the A/B is the music and
     not the volume (the louder of two takes always sounds better; the NIGHT FREIGHT record), and the gain is written. */
  const peak = Math.max.apply(null, res.map((r, i) => m[2 * i].peak));
  const gain = peak > 0.89 ? 0.89 / peak : 1;
  const pi = res.findIndex(r => r.s.key === song.parent);
  let matchDb = pi > 0 ? m[2 * pi].phone_rms_db - m[0].phone_rms_db : 0;
  if (m[0].peak * gain * Math.pow(10, matchDb / 20) > 0.7) matchDb = 20 * Math.log10(0.7 / (m[0].peak * gain));
  const out = { id: song.id, name: song.name, row_md5: rowMd5(song.row), tool: 'tools/bohemia_sounds_his_machine.js', made: song.made,
    bars_recorded: BARS, gain: +gain.toFixed(4), new_song_matched_to_parent_on_a_phone_db: +matchDb.toFixed(2),
    engine: { form: res[0].full.form.arr.join(' '), key_moves: res[0].full.form.rt.join(' '), step_s: res[0].full.sd }, page_errors: errs.length, songs: [] };
  const dec = [];
  res.forEach((r, i) => {
    const OUT = path.join(DIR, r.s.file), g = gain * (i === 0 ? Math.pow(10, matchDb / 20) : 1);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 's16le', '-ar', String(r.full.sr), '-ac', '1', '-i', r.rawF, '-af', 'volume=' + g.toFixed(4), '-c:a', 'libmp3lame', '-b:a', '80k', OUT]);
    const d = path.join(tmp, 'dec_' + i + '.raw'); execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', OUT, '-f', 's16le', '-ac', '1', '-ar', String(r.full.sr), d]); dec.push(d);
  });
  const md = measure(dec);                                    /* the numbers are the files he hears, not the render */
  res.forEach((r, i) => {
    const OUT = path.join(DIR, r.s.file), t = m[2 * i + 1], a = m[2 * i];
    out.songs.push({ role: i === 0 ? 'new' : (r.s.key === song.parent ? 'parent' : 'beside'), name: r.full.name, row: r.full.row,
      file: path.relative(ROOT, OUT), bytes: fs.statSync(OUT).size, mp3_md5: crypto.createHash('md5').update(fs.readFileSync(OUT)).digest('hex'),
      schedule_64_bars: summarise(r.whole), schedule_recorded: summarise(r.full),
      audio: Object.assign({}, md[i], { tune_on_a_phone_vs_the_mix_db: +(t.phone_rms_db - a.phone_rms_db).toFixed(2), tune_rms_db: t.rms_db, tune_phone_rms_db: t.phone_rms_db }) });
  });
  out.songs.forEach(x => { delete x.schedule_recorded.tune_semis; });
  fs.writeFileSync(path.join(DIR, 'measured.json'), JSON.stringify(out, null, 1) + '\n');
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(JSON.stringify(out.songs.map(x => ({ name: x.name, file: x.file, bytes: x.bytes, s64: Object.assign({}, x.schedule_64_bars, { tune_semis: undefined }), audio: x.audio })), null, 1));
}

module.exports = { openAlpha, pass, summarise, rowMd5, slug };
if (require.main === module) main().catch(e => { console.error(e); process.exit(1); });
