#!/usr/bin/env node
/* BOHEMIA -- THE MACHINE PARTY, RECORDED FROM HIS OWN ENGINE (SOUNDS, 10/19/26, row [the machine party]).

   RULE 121(k), Paolo 10/19: 'Remodel everything 3D grimey Crashbox analog horror machine party vibes. And the music too
   man.' Rule 119: made with his songs' own machine, read and reused, never edited.

   The remake is his row, note for note (slices/vote/songs/<id>.json 'row' is REPO MAN's row as the alpha holds it, its
   name too: his engine draws the tune from the name's length, so the name IS the tune), played by the alpha's own
   MUS.playStep the way the map plays it (CITYMUS on: the beat arrives late), with engine/bohemia_machine_party.js
   attached: real machines on his kick and hat, the party in D, the motor changing gear with his key moves, the hall and
   the tape. Opened read only in Chromium; the row is pushed into MLOOPS in the page's memory and popped; drumV and
   MUS.playStep are put back. Nothing in the alpha changes on disk (the song lock proves it).

   THREE TAKES, ONE ENGINE, ONE LEVEL:
     song.mp3            A: the machine party, in the hall, on the worn tape
     clean.mp3           C: the same machine, no hall, no tape
     his_repo_man.mp3    B: his REPO MAN as the map plays it now, the engine's own level
   A and C are each set to his REPO MAN's loudness through a phone's speaker (the louder take always sounds better), the
   gain written down. Two more passes per take, measured and not kept: the tune alone (his lead voice only) and the beat
   alone (his kit and the machine only), so 'the tune is not buried' and 'the beat is heard on a phone' are numbers.

     node tools/bohemia_sounds_machine_party_record.js slices/vote/songs/repo_man_the_machine_party.json [bars]
   writes slices/vote/songs/<file stem>/{song,clean,his_repo_man}.mp3 and measured.json.
   module.exports.pass(page, song, mode, bars, audio, only) is the same pass, for the gate.
*/
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const ROOT = path.dirname(__dirname);
const H = require(path.join(ROOT, 'tools', 'bohemia_sounds_his_machine.js'));   /* REUSE-FIRST: the alpha, the summary, the hash */
const KITDIR = path.join(ROOT, 'slices', 'vote', 'songs', 'machine_party_kit');
const KIT = ['press_1', 'press_2', 'relay_1', 'relay_2', 'relay_3', 'clank_1', 'clank_2', 'bed', 'hall'];

async function prepare(p) {
  const kit = {}; KIT.forEach(k => { kit[k] = fs.readFileSync(path.join(KITDIR, k + '.wav')).toString('base64'); });
  await p.addScriptTag({ path: path.join(ROOT, 'engine', 'bohemia_machine_party.js') });
  await p.evaluate(kit => { window.__mpBytes = {}; for (const k in kit) { const s = atob(kit[k]), u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); window.__mpBytes[k] = u.buffer; } }, kit);
}

/* ONE PASS. mode: 'his' (his row by name, no machine, no chain), 'A' (the row pushed, the machine, the hall and the
   tape), 'C' (the row pushed, the machine, clean). only: 'tune' (his lead voice alone) or 'beat' (his kit and the
   machine alone) or null. */
async function pass(p, song, mode, bars, audio, only) {
  return p.evaluate(async ({ song, mode, bars, audio, only }) => {
    const SR = 44100, steps = bars * 16, sd = MUS.stepDur(), secs = audio ? steps * sd + 2.5 : 1;
    let li;
    if (mode === 'his') li = MLOOPS.findIndex(x => x.n === song.remakes);
    else { MLOOPS.push(JSON.parse(JSON.stringify(song.row))); li = MLOOPS.length - 1; }
    if (li < 0) return { err: 'no song ' + song.remakes };
    MUS.audio();
    const OAC = new OfflineAudioContext(1, Math.ceil(SR * secs), SR);
    const save = { AC: MUS.AC, MAST: MUS.MAST, OUT: MUS.OUT, cur: MUS.cur, curSlot: MUS.curSlot, layers: MUS.layers, step: MUS.step, on: CITYMUS.on };
    const out0 = OAC.createGain(); out0.gain.value = 1; out0.connect(OAC.destination);
    const MPq = window.MACHINEPARTY;
    let bus = { music: out0, machine: out0 };
    if (mode !== 'his') {
      await MPq.loadFrom(OAC, window.__mpBytes);
      const tk = song.takes[mode], ch = MPq.chain(OAC, out0, { hall: tk.hall ? song.machine.hall : null, tape: tk.tape ? song.machine.tape : null });
      bus = { music: ch.input, machine: ch.machine };
    }
    MUS.AC = OAC; MUS.MAST = bus.music; MUS.OUT = bus.music; MUS.cur = MFACTIONS.length + li; MUS.curSlot = 1; MUS.layers = 0;
    CITYMUS.on = true;                                          /* the map owns the music: his 9/12 late beat */
    const row = MUS.fac(), log = [], _sv = synthV, _dv = drumV;
    const lead = MUS.leadVoice((row.inst && row.inst.l) || 'pluck');
    const mute = only === 'tune' ? { s: k => k !== lead, d: () => true, m: true } : only === 'beat' ? { s: () => true, d: () => false, m: false } : { s: () => false, d: () => false, m: false };
    synthV = function (kind, AC, M, hz, sdd, semi, t, g0) { log.push(['s', kind, +(t - 0.05).toFixed(4), semi, g0]); if (!mute.s(kind)) return _sv.apply(this, arguments); };
    drumV = function (kind, AC, M, t) { log.push(['d', kind, +(t - 0.05).toFixed(4)]); if (!mute.d(kind)) return _dv.apply(this, arguments); };
    if (mode !== 'his' && !mute.m) MPq.attach(song.machine, bus);
    let err = null;
    try { for (let s = 0; s < steps; s++) { MUS.step = s; MUS.playStep(s % 16, 0.05 + s * sd, MUS.songCtx(s)); } } catch (e) { err = e.message; }
    const mlog = MPq.log.map(x => [x[0], +(x[1] - 0.05).toFixed(4), x[2], x[3], x[4]]);
    MPq.detach(); MPq.log = [];
    synthV = _sv; drumV = _dv;
    MUS.AC = save.AC; MUS.MAST = save.MAST; MUS.OUT = save.OUT; MUS.cur = save.cur; MUS.curSlot = save.curSlot; MUS.layers = save.layers; MUS.step = save.step; CITYMUS.on = save.on;
    const form = { arr: MUS.ARR.slice(), rt: MUS.RT.slice(), sd: sd, lead: lead };
    const rowOut = JSON.parse(JSON.stringify(row));
    if (mode !== 'his') MLOOPS.pop();
    if (err) return { err };
    const res = { name: rowOut.n, row: rowOut, log, mlog, form, steps, sd, mloops: MLOOPS.length, restored: typeof MUS.playStep === 'function' && drumV === _dv };
    if (!audio) return res;
    const buf = await OAC.startRendering(), L = buf.getChannelData(0);
    const pcm = new Int16Array(L.length); let clip = 0;
    for (let i = 0; i < L.length; i++) { const v = Math.round(L[i] * 32767); if (Math.abs(v) > 32767) clip++; pcm[i] = Math.max(-32767, Math.min(32767, v)); }
    const u8 = new Uint8Array(pcm.buffer); let bin = ''; for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
    res.b64 = btoa(bin); res.sr = SR; res.clipped = clip;
    return res;
  }, { song, mode, bars, audio, only: only || null });
}

function measure(raws) {
  return JSON.parse(execFileSync('python3', ['-I', path.join(ROOT, 'tools', 'bohemia_sounds_his_machine_measure.py')].concat(raws), { encoding: 'utf8', maxBuffer: 64 << 20 }));
}
const md5 = f => crypto.createHash('md5').update(fs.readFileSync(f)).digest('hex');

async function main() {
  const SONGF = path.resolve(ROOT, process.argv[2] || 'slices/vote/songs/repo_man_the_machine_party.json');
  const BARS = +(process.argv[3] || 32);
  const song = JSON.parse(fs.readFileSync(SONGF, 'utf8'));
  const DIR = path.join(path.dirname(SONGF), path.basename(SONGF, '.json'));
  fs.mkdirSync(DIR, { recursive: true });
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'machine_party_'));
  const { b, p, errs } = await H.openAlpha();
  await prepare(p);
  const takes = [{ mode: 'A', file: 'song.mp3' }, { mode: 'C', file: 'clean.mp3' }, { mode: 'his', file: 'his_' + H.slug(song.remakes) + '.mp3' }];
  const R = {};
  for (const tk of takes) {
    const t0 = Date.now(); R[tk.mode] = {};
    for (const only of [null, 'tune', 'beat']) {
      const r = await pass(p, song, tk.mode, BARS, true, only);
      if (r.err) { console.log('FAILED ' + tk.mode + ' ' + only + ': ' + r.err); await b.close(); process.exit(1); }
      const raw = path.join(tmp, tk.mode + '_' + (only || 'full') + '.raw'); fs.writeFileSync(raw, Buffer.from(r.b64, 'base64')); delete r.b64;
      R[tk.mode][only || 'full'] = Object.assign(r, { raw });
    }
    R[tk.mode].whole = await pass(p, song, tk.mode, 64, false, null);
    console.log('rendered ' + tk.mode + ' in ' + ((Date.now() - t0) / 1000).toFixed(1) + ' s');
  }
  await b.close();
  const order = []; takes.forEach(tk => ['full', 'tune', 'beat'].forEach(k => order.push(R[tk.mode][k].raw)));
  const m = measure(order), M = {}; takes.forEach((tk, i) => { M[tk.mode] = { full: m[3 * i], tune: m[3 * i + 1], beat: m[3 * i + 2] }; });
  /* THE LEVEL: his song at the engine's own level, gain 1; each new take alone set to his loudness through a phone */
  const gains = { his: 1 };
  ['A', 'C'].forEach(k => { let g = M.his.full.phone_rms_db - M[k].full.phone_rms_db; if (M[k].full.peak * Math.pow(10, g / 20) > 0.89) g = 20 * Math.log10(0.89 / M[k].full.peak); gains[k] = +g.toFixed(2); });
  gains.his = 0;
  const dec = [];
  takes.forEach(tk => {
    const OUT = path.join(DIR, tk.file), g = Math.pow(10, gains[tk.mode] / 20);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 's16le', '-ar', '44100', '-ac', '1', '-i', R[tk.mode].full.raw, '-af', 'volume=' + g.toFixed(4), '-c:a', 'libmp3lame', '-b:a', '96k', OUT]);
    const d = path.join(tmp, 'dec_' + tk.mode + '.raw'); execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', OUT, '-f', 's16le', '-ac', '1', '-ar', '44100', d]); dec.push(d);
  });
  const md = measure(dec);                                   /* the numbers are the files he hears, not the render */
  const out = { id: song.id, name: song.name, remakes: song.remakes, row_md5: H.rowMd5(song.row), machine_md5: H.rowMd5(song.machine),
    tool: 'tools/bohemia_sounds_machine_party_record.js', engine: 'engine/bohemia_machine_party.js', made: song.made, bars_recorded: BARS,
    page_errors: errs.length, takes: [] };
  takes.forEach((tk, i) => {
    const r = R[tk.mode], OUT = path.join(DIR, tk.file), mm = M[tk.mode];
    const kinds = {}; r.whole.mlog.forEach(x => { kinds[x[0]] = (kinds[x[0]] || 0) + 1; });
    out.takes.push({ take: tk.mode, file: path.relative(ROOT, OUT), bytes: fs.statSync(OUT).size, mp3_md5: md5(OUT), gain_db: gains[tk.mode],
      clipped_samples: r.full.clipped, schedule_64_bars: Object.assign(H.summarise(r.whole), { tune_semis: undefined }), machine_64_bars: kinds,
      audio: Object.assign({}, md[i], {
        tune_on_a_phone_vs_the_mix_db: +(mm.tune.phone_rms_db - mm.full.phone_rms_db).toFixed(2),
        beat_on_a_phone_vs_the_mix_db: +(mm.beat.phone_rms_db - mm.full.phone_rms_db).toFixed(2),
        beat_on_a_phone_db: +(mm.beat.phone_rms_db + gains[tk.mode]).toFixed(2),
        tune_on_a_phone_db: +(mm.tune.phone_rms_db + gains[tk.mode]).toFixed(2) }) });
  });
  fs.writeFileSync(path.join(DIR, 'measured.json'), JSON.stringify(out, null, 1) + '\n');
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(JSON.stringify(out.takes.map(x => ({ take: x.take, gain: x.gain_db, clipped: x.clipped_samples, machine: x.machine_64_bars,
    a: { peak_db: x.audio.peak_db, phone: x.audio.phone_rms_db, jump: x.audio.largest_jump, above5k: x.audio.above_5k_pct, tune_vs_mix: x.audio.tune_on_a_phone_vs_the_mix_db, beat_vs_mix: x.audio.beat_on_a_phone_vs_the_mix_db, beat_phone: x.audio.beat_on_a_phone_db, bars: x.audio.bar_rms_db.slice(0, 12) } })), null, 1));
}

module.exports = { pass, prepare };
if (require.main === module) main().catch(e => { console.error(e); process.exit(1); });
