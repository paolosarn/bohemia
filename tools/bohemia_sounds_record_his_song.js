#!/usr/bin/env node
/* BOHEMIA -- RECORD ONE OF HIS SONGS AS THE MAP PLAYS IT (SOUNDS, 10/18/26, row [the middle ground]).

   The row: 'in VOTE over the real map beside one of his own songs for the A/B'. His songs are canon (laws/
   BOHEMIA_ADDENDUM_HIS_SONGS_ARE_CANON_7_26_26.md): this READS one and never edits it. It opens the alpha in Chromium,
   points the alpha's own music engine (MUS.playStep, his synthV and drumV voices, his SONG_ARR form) at an
   OfflineAudioContext the way gates/menu_music_gate.py does, plays the song from bar 1 the way the map's street
   shuffle plays it (CITYMUS on, so MUS.drumsHeld holds the kit for the first eight bars; no kill layers), puts the
   real engine back, and writes the result as an mp3 for the VOTE page. Nothing in the alpha is changed on disk.

   THE LEVEL: the alpha's live chain ends in a master and the settings bus; the offline render skips both, so the
   recording is set to the same loudness (rms) as the new song's render, measured in the same Chrome, so the A/B is
   the music and not the volume (the louder of two takes always sounds better; the matching is written in the record).

     node tools/bohemia_sounds_record_his_song.js "REPO MAN" 32 slices/vote/songs/his_repo_man_on_the_map.mp3 [target_rms]
*/
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.dirname(__dirname);
function pw() { for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules', '/usr/local/lib/node_modules']) { try { return require(path.join(g, 'playwright')); } catch (e) {} } return require('playwright'); }

const NAME = process.argv[2] || 'REPO MAN';
const BARS = +(process.argv[3] || 32);
const OUT = path.resolve(ROOT, process.argv[4] || 'slices/vote/songs/his_repo_man_on_the_map.mp3');
const TARGET = process.argv[5] ? +process.argv[5] : null;

(async () => {
  const { chromium } = pw();
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html'));
  await p.waitForTimeout(1500);
  await p.click('#front', { force: true }).catch(() => {});
  await p.waitForTimeout(1200);
  const out = await p.evaluate(async ({ NAME, BARS }) => {
    const li = MLOOPS.findIndex(x => x.n === NAME); if (li < 0) return { err: 'no song ' + NAME };
    const idx = MFACTIONS.length + li, SR = 44100, steps = BARS * 16, sd = MUS.stepDur(), secs = steps * sd + 1.5;
    MUS.audio();
    const OAC = new OfflineAudioContext(1, Math.ceil(SR * secs), SR);
    const save = { AC: MUS.AC, MAST: MUS.MAST, OUT: MUS.OUT, cur: MUS.cur, curSlot: MUS.curSlot, layers: MUS.layers, step: MUS.step, on: CITYMUS.on };
    const mast = OAC.createGain(); mast.gain.value = 1; mast.connect(OAC.destination);
    MUS.AC = OAC; MUS.MAST = mast; MUS.OUT = mast; MUS.cur = idx; MUS.curSlot = 1; MUS.layers = 0;
    const who = MUS.fac() && MUS.fac().n;
    CITYMUS.on = true;                               /* the map owns the music: the beat arrives late, his 9/12 rule */
    let held = 0;
    try { for (let s = 0; s < steps; s++) { MUS.step = s; if (MUS.drumsHeld()) held++; MUS.playStep(s % 16, 0.05 + s * sd, MUS.songCtx(s)); } } catch (e) { return { err: e.message }; }
    MUS.AC = save.AC; MUS.MAST = save.MAST; MUS.OUT = save.OUT; MUS.cur = save.cur; MUS.curSlot = save.curSlot; MUS.layers = save.layers; MUS.step = save.step; CITYMUS.on = save.on;
    const buf = await OAC.startRendering(), L = buf.getChannelData(0);
    let sq = 0, pk = 0; for (let i = 0; i < L.length; i++) { const a = Math.abs(L[i]); sq += a * a; if (a > pk) pk = a; }
    /* 16-bit mono PCM, base64, handed back to node in chunks */
    const pcm = new Int16Array(L.length); for (let i = 0; i < L.length; i++) pcm[i] = Math.max(-32767, Math.min(32767, Math.round(L[i] * 32767)));
    const u8 = new Uint8Array(pcm.buffer); let bin = ''; for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
    return { who, held, steps, secs, sr: SR, rms: Math.sqrt(sq / L.length), peak: pk, b64: btoa(bin), song: MLOOPS[li] };
  }, { NAME, BARS });
  await b.close();
  if (out.err || out.who !== NAME) { console.log('FAILED: ' + (out.err || ('fac() gave ' + out.who))); process.exit(1); }
  const raw = path.join(require('os').tmpdir(), 'his_song_' + process.pid + '.raw');
  fs.writeFileSync(raw, Buffer.from(out.b64, 'base64'));
  const gain = TARGET ? TARGET / out.rms : 1;
  const peakAfter = out.peak * gain;
  const lim = peakAfter > 0.89 ? ',alimiter=limit=0.89:attack=1:release=50' : '';
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 's16le', '-ar', String(out.sr), '-ac', '1', '-i', raw,
    '-af', 'volume=' + gain.toFixed(4) + lim, '-c:a', 'libmp3lame', '-b:a', '80k', OUT]);
  fs.unlinkSync(raw);
  const res = { song: NAME, bars: BARS, seconds: +out.secs.toFixed(2), held_steps: out.held, rms: +out.rms.toFixed(5), peak: +out.peak.toFixed(4),
    gain: +gain.toFixed(4), limited: !!lim, file: path.relative(ROOT, OUT), bytes: fs.statSync(OUT).size, his_row: out.song, page_errors: errs.length };
  console.log(JSON.stringify(res, null, 1));
})();
