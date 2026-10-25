#!/usr/bin/env node
/* EVERY SONG AT EVERY LEVEL, RENDERED THROUGH THE GAME'S OWN ENGINE (SOUNDS [three intensities in every song], rule 167(e):
   'every playable song renders at levels 1, 2 and 3; level 3 measurably carries drums and a lead over the bed').

   Opens the alpha (served, so the kit's recordings load the way they do in the game), waits for the fight's beat to decode
   its recordings, then plays a song with MUS.playStep (the fence's net, his engine, and __THE_FIGHTS_BEAT__ on top) into an
   OfflineAudioContext at a fixed level: 1 as the map plays it (CITYMUS on: his late beat), 2 and 3 as a fight plays it
   (FIGHTMUS on). With --alone the fight's beat is muted, so the song by itself is the same bars beside it.
   tools/bohemia_sounds_fight_beat_measure.py reads the recordings: loudness, the phone's band (150 Hz to 7 kHz), the
   120 BPM pulse (the onset envelope folded on 500 ms against 430 and 580 ms, and the onsets on the beat grid against
   everywhere else), the drums' share of the top.

   module.exports: open(), render(page, {name, level, bars, alone, start}), songs(page)
   Run: node tools/bohemia_sounds_fight_beat_render.js [--bars 16] [--song 'REPO MAN'] [--out dir]   (prints the table) */
'use strict';
const path = require('path');
const fs = require('fs');
const os = require('os');
const { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));

async function open(opts) {
  const d = await drive.open(Object.assign({ alpha: true }, opts || {}));
  const st = await d.page.evaluate(async () => {
    if (!window.FIGHTBEAT) return 'no fight beat';
    MUS.audio(); try { MUS.build(); } catch (e) {}
    await FIGHTBEAT.load(MUS.AC); return FIGHTBEAT.state + (FIGHTBEAT.err ? ' ' + FIGHTBEAT.err : '');
  });
  d.beat = st;
  return d;
}

/* the songs that can play: his OVERWORLD NIGHT category through the fence, read as the game reads it */
async function songs(page) { return page.evaluate(() => SONGFENCE.pool().filter(c => c.slot === 1).map(c => MUS.lib()[c.fi].n)); }

async function render(page, o) {
  return page.evaluate(async (o) => {
    const L = MUS.lib(), fi = L.findIndex(x => x.n === o.name); if (fi < 0) return { err: 'no song ' + o.name };
    const SR = 44100, bars = o.bars || 16, steps = bars * 16, sd = MUS.stepDur(), secs = steps * sd + 1.5, from = o.start || 0;
    const OAC = new OfflineAudioContext(1, Math.ceil(SR * secs), SR);
    const save = { AC: MUS.AC, MAST: MUS.MAST, OUT: MUS.OUT, cur: MUS.cur, curSlot: MUS.curSlot, layers: MUS.layers, step: MUS.step, on: CITYMUS.on, fon: FIGHTMUS.on, mute: FIGHTBEAT.mute, last: FIGHTBEAT.last, playing: MUS.playing };
    const mast = OAC.createGain(); mast.gain.value = 0.8; mast.connect(OAC.destination);   /* MUS.start's own master level */
    const h0 = FIGHTBEAT.hits, n0 = FIGHTBEAT.notes;
    MUS.AC = OAC; MUS.MAST = mast; MUS.OUT = mast; MUS.cur = fi; MUS.curSlot = 1; MUS.layers = [0, 0, 2, 4][o.level];
    CITYMUS.on = o.level === 1; FIGHTMUS.on = o.level > 1; FIGHTBEAT.mute = !!o.alone; FIGHTBEAT.last = o.level; MUS.playing = true;
    let err = null;
    try { for (let k = 0; k < steps; k++) { const s = from + k; MUS.step = s; MUS.playStep(s % 16, 0.05 + k * sd, MUS.songCtx(s)); } } catch (e) { err = e.message; }
    MUS.AC = save.AC; MUS.MAST = save.MAST; MUS.OUT = save.OUT; MUS.cur = save.cur; MUS.curSlot = save.curSlot; MUS.layers = save.layers; MUS.step = save.step;
    CITYMUS.on = save.on; FIGHTMUS.on = save.fon; FIGHTBEAT.mute = save.mute; FIGHTBEAT.last = save.last; MUS.playing = save.playing;
    if (err) return { err };
    const buf = await OAC.startRendering(), ch = buf.getChannelData(0);
    const pcm = new Int16Array(ch.length); for (let i = 0; i < ch.length; i++) pcm[i] = Math.max(-32767, Math.min(32767, Math.round(ch[i] * 32767)));
    const u8 = new Uint8Array(pcm.buffer); let bin = ''; for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
    return { name: o.name, level: o.level, alone: !!o.alone, sr: SR, secs: secs, b64: btoa(bin), hits: FIGHTBEAT.hits - h0, notes: FIGHTBEAT.notes - n0, grid0: 0.05, sd: sd };
  }, o);
}

function measure(files) {
  const py = path.join(ROOT, 'tools', 'bohemia_sounds_fight_beat_measure.py');
  return JSON.parse(execFileSync('python3', ['-I', py].concat(files), { encoding: 'utf8', maxBuffer: 64 << 20 }));
}
function save(r, dir) {
  const f = path.join(dir, r.name.replace(/[^A-Za-z0-9]+/g, '_') + '_L' + r.level + (r.alone ? '_alone' : '') + '.s16');
  fs.writeFileSync(f, Buffer.from(r.b64, 'base64'));
  fs.writeFileSync(f + '.json', JSON.stringify({ sr: r.sr, grid0: r.grid0, sd: r.sd, name: r.name, level: r.level, alone: r.alone }));
  return f;
}

module.exports = { open, render, songs, measure, save };

if (require.main === module) {
  (async () => {
    const a = process.argv.slice(2), bars = a.includes('--bars') ? +a[a.indexOf('--bars') + 1] : 16;
    const only = a.includes('--song') ? a[a.indexOf('--song') + 1] : null;
    const dir = a.includes('--out') ? a[a.indexOf('--out') + 1] : fs.mkdtempSync(path.join(os.tmpdir(), 'fightbeat-'));
    fs.mkdirSync(dir, { recursive: true });
    const d = await open();
    console.error('the fight beat: ' + d.beat);
    const names = only ? [only] : await songs(d.page);
    const files = [];
    for (const nm of names) for (const lv of [1, 2, 3]) for (const alone of [true, false]) {
      const r = await render(d.page, { name: nm, level: lv, bars, alone, start: 32 * 16 });   /* bar 33: past the late beat's first phrase */
      if (r.err) { console.error(nm, lv, r.err); continue; }
      files.push(save(r, dir));
    }
    await d.close();
    const M = measure(files);
    console.log(JSON.stringify(M, null, 1));
  })().catch(e => { console.error(e); process.exit(1); });
}
