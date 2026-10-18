#!/usr/bin/env node
/* THE FIGHT'S BEASTS, BAKED FROM THE QUADRUPED (ANIMATION [four legs], 10/9; rule 42: the beasts are lab-made, Battle
   Brothers' bestiary is the floor; its Direwolf is the first one drawn).
   The rebuilt fight (slices/BOHEMIA_FIGHT.html, COMBAT's) draws every fighter from slices/fight_people, the 112 rig in
   his clothes. Nothing in the bank walks on four legs. This lane ships the four-legged sheet beside it, in the SAME
   SHAPE as fight_people (a 112 frame, rows SE and SW, named columns 'clip@phase', a CLIP TABLE of which columns play
   for which fight event), so COMBAT's switch is one more folder, not a new reader.
   Source: engine/bohemia_quadruped.js (pure, no browser). Every picture is one of its drawn keys, three a beat, the
   men's grid (POSEHOLD.keys = 12 a bar); nothing between two keys is ever drawn.
   Out: slices/fight_beasts/<id>.webp (lossless, every pixel checked) + slices/fight_beasts/fight_beasts.json.
   Run: node tools/bohemia_fight_beasts_bake.js */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const Q = require(process.env.BEAST_MODULE || path.join(ROOT, 'engine', 'bohemia_quadruped.js'));   /* the env pair is for the gate's mutation tests */
const OUT = process.env.BEAST_OUT || path.join(ROOT, 'slices', 'fight_beasts');
const F = Q.F, ROWS = ['SE', 'SW'];
const CLIPS = ['idle', 'walk', 'lope', 'lunge', 'fall'];
const COLS = [];
CLIPS.forEach(c => Q.keys(c).forEach(t => COLS.push(c + '@' + (+t.toFixed(4)))));
const col = (c, t) => c + '@' + (+t.toFixed(4));
/* the fight's events, the same names fight_people's table uses where they mean the same thing */
const TABLE = {
  idle:  { clip: 'idle',  loop: true,  for: 'waiting on the board: the breath, the tail, an ear flick a bar' },
  step:  { clip: 'walk',  loop: true,  for: 'moving one house tile: the four-beat walk, two or three paws always down' },
  run:   { clip: 'lope',  loop: true,  for: 'a long move (fast, Battle Brothers\' Direwolf): the gallop, a moment in the air' },
  bite:  { clip: 'lunge', loop: false, for: 'the attack: crouch, spring with the jaws open, the bite shut on him, back' },
  fall:  { clip: 'fall',  loop: false, for: 'struck down: the legs go, it lies, the head last', then: 'dead' },
  dead:  { clip: 'fall',  loop: false, for: 'lying where it fell (the fall\'s last picture)', only_last: true } };
const clips = {};
for (const ev in TABLE) {
  const e = TABLE[ev], ks = Q.keys(e.clip), cols = e.only_last ? [col(e.clip, ks[ks.length - 1])] : ks.map(t => col(e.clip, t));
  clips[ev] = { clip: e.clip, cols: cols, beats: e.only_last ? 1 : Q.BEATS[e.clip], loop: e.loop, for: e.for };
  if (e.then) clips[ev].then = e.then;
}
const BEASTS = [{ id: 'dire_wolf', name: 'dire wolf', draft: true, bb: 'Direwolf (fast, pack; 12 action points, bites three times if it does not move: library 09, Grok 01/08)',
  lore: 'de-extinct from the Ice Age record (Aenocyon dirus), out of its lab when the dollar died; the yellow ear tag is its lab number' }];

fs.mkdirSync(OUT, { recursive: true });
const manifest = { version: 'fight-beasts-10-9', built: '10/9/26', lane: 'animation', rule: '42, 69', for_screen: 'slices/BOHEMIA_FIGHT.html (COMBAT reads it beside fight_people)',
  source: 'engine/bohemia_quadruped.js: pose -> raster, palette-indexed, a one-pixel border, the back lit (45 law), the far legs in shadow',
  frame: F, ground_y: Q.GROUND, rows: ROWS, cols: COLS, clips: clips,
  clips_by: 'frame = cols[floor(progress * cols.length)], progress over beats * 500 ms (the 120 beat); three pictures a beat, the men\'s grid',
  scale: { note: 'the same 112 frame and the same ground line as fight_people: a man is ~100 px tall in it, the dire wolf ~62 at the ears and 44 at the shoulder (a real one: 80 cm at the shoulder against a 1.75 m man)' },
  beasts: {} };
for (const B of BEASTS) {
  const W = F * COLS.length, H = F * ROWS.length, buf = Buffer.alloc(W * H * 4);
  ROWS.forEach((dir, r) => COLS.forEach((c, i) => {
    const at = c.indexOf('@'), fr = Q.frame(c.slice(0, at), +c.slice(at + 1), dir);
    for (let y = 0; y < F; y++) Buffer.from(fr.buffer, fr.byteOffset + y * F * 4, F * 4).copy(buf, ((r * F + y) * W + i * F) * 4);
  }));
  const raw = path.join(OUT, B.id + '.rgba');
  fs.writeFileSync(raw, buf);
  require('child_process').execFileSync('python3', ['-c', [
    'import sys', 'from PIL import Image', 'raw,w,h,out=sys.argv[1],int(sys.argv[2]),int(sys.argv[3]),sys.argv[4]',
    "im=Image.frombytes('RGBA',(w,h),open(raw,'rb').read()); im.save(out,'WEBP',lossless=True,quality=100,method=6)",
    "assert Image.open(out).convert('RGBA').tobytes()==im.tobytes(), 'the webp is not the bake'"].join('\n'), raw, String(W), String(H), path.join(OUT, B.id + '.webp')]);
  fs.unlinkSync(raw);
  manifest.beasts[B.id] = Object.assign({ file: B.id + '.webp' }, B);
  console.log('  baked ' + B.id + ': ' + COLS.length + ' pictures x ' + ROWS.length + ' facings');
}
manifest.packed = 'lossless WebP, every pixel checked identical to the bake';
fs.writeFileSync(path.join(OUT, 'fight_beasts.json'), JSON.stringify(manifest, null, 1));
console.log('beasts: ' + Object.keys(manifest.beasts).length);
