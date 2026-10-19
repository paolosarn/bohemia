#!/usr/bin/env node
/* COMBAT, rule 121 round (10/19): THE PICTURES FOR HIS THREE CARDS, from the REAL fight on his phone's profile (the one driver,
   390 x 844 at 3x), the game's own camera, never a mock-up.
     rig    [the fight wears the 3D models]: the fight's opening frame before (the flat sheets) | after (the rig models), then
            the three sizes he picks from (two, three and four phone pixels to the rig's pixel: 65, 98 and 131 points)
     smooth [smooth]: the same AUTO fight before | after on one clock, an animated picture at 24 a second (the page's own
            clock driven a frame at a time, so the picture is every frame the game drew, not what a slow box managed)
     floor  [the tear and the floor]: the floor before | the floor rendered the 3D way, his man's turn, the tear on him,
            animated two beats
   THE BEFORE is the fight as it was at its last commit before this round (git show <sha>:slices/BOHEMIA_FIGHT.html), served
   beside the real slices under another name for the picture only, and the floor as it shipped (records/target/combat/floor3d/before).
   Run: node tools/bohemia_combat_the_round_sheets.js <rig|smooth|floor|all> [--before <sha>]
   Writes records/target/combat/COMBAT_*_10_19.webp (and the frames it built them from in a scratch folder). */
'use strict';
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const { open } = require('./bohemia_drive_the_demo.js');
const ROOT = path.resolve(__dirname, '..');
const A = process.argv.slice(2);
const WHAT = A[0] || 'all';
const BEFORE_SHA = A.indexOf('--before') >= 0 ? A[A.indexOf('--before') + 1] : '4e142fe9';
const OUT = path.join(ROOT, 'records/target/combat');
const TMP = path.join(require('os').tmpdir(), 'bohemia_combat_sheets'); fs.mkdirSync(TMP, { recursive: true });
const OLD = path.join(TMP, 'BOHEMIA_FIGHT_BEFORE.html');
fs.writeFileSync(OLD, cp.execSync('git show ' + BEFORE_SHA + ':slices/BOHEMIA_FIGHT.html', { cwd: ROOT, maxBuffer: 1 << 26 }));
const FLOOR_BEFORE = path.join(ROOT, 'records/target/combat/floor3d/before');
/* the old floor, served where the fight reads its blocks */
const oldFloor = () => { const m = {}; if (!fs.existsSync(FLOOR_BEFORE)) return m;
  fs.readdirSync(FLOOR_BEFORE).filter(f => /^block_.*\.webp$/.test(f)).forEach(f => { m['/slices/fight_ground/' + f] = path.join(FLOOR_BEFORE, f); }); return m; };

/* THE CLOCK IN OUR HAND: performance.now and requestAnimationFrame answer to __step(ms), so every picture is a frame the game drew */
const CLOCK = `(function () { window.__vt = 0; const q = []; performance.now = function () { return window.__vt; };
  window.requestAnimationFrame = function (cb) { q.push(cb); return q.length; };
  const st = window.setTimeout; window.__timers = [];
  window.setTimeout = function (f, ms) { if (typeof f !== 'function') return st(f, ms); window.__timers.push({ at: window.__vt + (ms || 0), f: f }); return 0; };
  window.__step = function (ms) { window.__vt += ms; const due = window.__timers.filter(function (t) { return t.at <= window.__vt; });
    window.__timers = window.__timers.filter(function (t) { return t.at > window.__vt; }); due.forEach(function (t) { try { t.f(); } catch (e) {} });
    const c = q.splice(0); c.forEach(function (f) { f(window.__vt); }); }; })();`;

async function fight(opts) {
  const serve = Object.assign({}, opts.before ? { '/slices/BOHEMIA_FIGHT_BEFORE.html': OLD } : {}, opts.oldFloor ? oldFloor() : {});
  const d = await open({ file: opts.before ? 'BOHEMIA_FIGHT_BEFORE.html' : 'BOHEMIA_FIGHT.html', bare: true, serve,
    arm: (opts.clock ? CLOCK : '') + 'window.FIGHT_OPTS=' + JSON.stringify(opts.fo) });
  const p = d.page;
  for (let i = 0; i < 300; i++) {
    if (opts.clock) await p.evaluate(() => window.__step(16));
    if (await p.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board)) break;
    await p.waitForTimeout(100);
  }
  return d;
}
const shot = (p, file, clip) => p.screenshot({ path: file, clip: clip });
const py = (code, args) => cp.execFileSync('python3', ['-c', code].concat(args || []), { cwd: ROOT, stdio: ['ignore', 'pipe', 'inherit'] }).toString();

/* ---- [the fight wears the 3D models] ---- */
async function rig() {
  const fo = { seed: 5, speed: 1, kind: 'suburb', auto: true };
  const files = [];
  for (const before of [true, false]) {
    const d = await fight({ before, oldFloor: before, fo: fo, clock: true });
    for (let i = 0; i < 6 * 24; i++) await d.page.evaluate(() => window.__step(1000 / 24));   /* six seconds in: they have moved */
    const f = path.join(TMP, 'rig_' + (before ? 'before' : 'after') + '.png'); await shot(d.page, f); files.push(f); await d.close();
  }
  for (const px of [65, 98, 131]) {
    const d = await fight({ before: false, fo: Object.assign({}, fo, { manPx: px }), clock: true });
    for (let i = 0; i < 6 * 24; i++) await d.page.evaluate(() => window.__step(1000 / 24));
    const f = path.join(TMP, 'rig_size_' + px + '.png'); await shot(d.page, f); files.push(f); await d.close();
  }
  py(`
import sys, json
from PIL import Image, ImageDraw
f = sys.argv[1:]
ims = [Image.open(x).convert('RGB') for x in f]
W, H = ims[0].size
# the first row: before | after at half size side by side (the phone's width: 1170); the second: the three sizes, a third each
half = [im.resize((W // 2, H // 2), Image.LANCZOS) for im in ims[:2]]
third = [im.crop((0, int(H * .18), W, int(H * .62))).resize((W // 3, int(H * .44) // 3), Image.LANCZOS) for im in ims[2:]]
man = Image.open('slices/fight_rig/you.webp' if __import__('os').path.exists('slices/fight_rig/you.webp') else 'slices/fight_rig/cast_apron.webp').convert('RGBA')
mw = W; mh = int(man.size[1] * mw / man.size[0])
bg = Image.new('RGBA', man.size, (120, 112, 96, 255)); bg.alpha_composite(man); man = bg.convert('RGB').resize((mw, mh), Image.NEAREST)
sheet = Image.new('RGB', (W, H // 2 + third[0].size[1] + mh), (20, 16, 12))
sheet.paste(half[0], (0, 0)); sheet.paste(half[1], (W // 2, 0))
y = H // 2
for i, t in enumerate(third): sheet.paste(t, (i * (W // 3), y))
sheet.paste(man, (0, y + third[0].size[1]))
sheet.save('records/target/combat/COMBAT_THE_FIGHT_WEARS_THE_RIG_10_19.webp', 'WEBP', quality=88, method=6)
print(json.dumps(dict(size=sheet.size, first=[W // 2, 0, W // 2, H // 2], sizes_at=y, man_at=y + third[0].size[1])))
`, files).split('\n').forEach(l => l && console.log('  rig sheet', l));
}

/* ---- [smooth] ---- */
async function smooth() {
  const fo = { seed: 9, speed: 1, kind: 'suburb', auto: true };
  const n = 24 * 8, frames = { before: [], after: [] };
  for (const before of [true, false]) {
    const d = await fight({ before, oldFloor: before, fo, clock: true });
    for (let i = 0; i < 24 * 3; i++) await d.page.evaluate(() => window.__step(1000 / 24));   /* past the open's hold */
    for (let i = 0; i < n; i++) {
      await d.page.evaluate(() => window.__step(1000 / 24));
      const f = path.join(TMP, 'sm_' + (before ? 'b' : 'a') + '_' + String(i).padStart(3, '0') + '.png');
      await d.page.screenshot({ path: f, clip: { x: 0, y: 70, width: 390, height: 560 }, scale: 'css' }); frames[before ? 'before' : 'after'].push(f);
    }
    await d.close();
  }
  py(`
import sys, json
from PIL import Image
a = json.loads(sys.argv[1])
out = []
for b, f in zip(a['before'], a['after']):
    x, y = Image.open(b).convert('RGB'), Image.open(f).convert('RGB')
    s = Image.new('RGB', (x.size[0] * 2 + 6, x.size[1]), (20, 16, 12)); s.paste(x, (0, 0)); s.paste(y, (x.size[0] + 6, 0)); out.append(s)
out[0].save('records/target/combat/COMBAT_SMOOTH_BEFORE_AFTER_10_19.webp', 'WEBP', save_all=True, append_images=out[1:], duration=round(1000 / 24), loop=0, quality=80, method=4)
out[len(out) // 2].save('records/target/combat/COMBAT_SMOOTH_BEFORE_AFTER_10_19_STILL.webp', 'WEBP', quality=85)
print(json.dumps(dict(frames=len(out), size=out[0].size)))
`, [JSON.stringify(frames)]).split('\n').forEach(l => l && console.log('  smooth clip', l));
}

/* ---- [the tear and the floor] ---- */
async function floor() {
  const fo = { seed: 5, speed: 1, kind: 'suburb' };
  const frames = { before: [], after: [] };
  for (const before of [true, false]) {
    const d = await fight({ before: false, oldFloor: before, fo, clock: true });
    const p = d.page;
    /* his line set, FIGHT, then his man's turn */
    for (let i = 0; i < 24 * 3; i++) await p.evaluate(() => window.__step(1000 / 24));
    await p.evaluate(() => { if (FIGHT.S.deploy) fightNow(); });
    for (let i = 0; i < 24 * 40; i++) { await p.evaluate(() => window.__step(1000 / 24)); if (await p.evaluate(() => { const u = FIGHT.current(); return u && crewControlled(u) && !FIGHT_UI.anim.length && !FIGHT_UI.glide; })) break; }
    /* the camera to him, close enough to read the ground at one rig pixel to three phone pixels */
    await p.evaluate(() => { const u = FIGHT.current(); FIGHT_UI.pinched = true; FIGHT_UI.zoom = FIGHT_UI.near; FIGHT_UI.cx = (u.x + .5) * FIGHT_UI.tw; FIGHT_UI.cy = (u.y + .4) * FIGHT_UI.th; clampCam(); });
    for (let i = 0; i < 48; i++) {
      await p.evaluate(() => window.__step(1000 / 24));
      const f = path.join(TMP, 'fl_' + (before ? 'b' : 'a') + '_' + String(i).padStart(3, '0') + '.png');
      await p.screenshot({ path: f, clip: { x: 0, y: 70, width: 390, height: 600 }, scale: 'css' }); frames[before ? 'before' : 'after'].push(f);
    }
    await d.close();
  }
  py(`
import sys, json
from PIL import Image
a = json.loads(sys.argv[1])
out = []
for b, f in zip(a['before'], a['after']):
    x, y = Image.open(b).convert('RGB'), Image.open(f).convert('RGB')
    s = Image.new('RGB', (x.size[0] * 2 + 6, x.size[1]), (20, 16, 12)); s.paste(x, (0, 0)); s.paste(y, (x.size[0] + 6, 0)); out.append(s)
out[0].save('records/target/combat/COMBAT_THE_TEAR_AND_THE_FLOOR_10_19.webp', 'WEBP', save_all=True, append_images=out[1:], duration=round(1000 / 24), loop=0, quality=82, method=4)
print(json.dumps(dict(frames=len(out), size=out[0].size)))
`, [JSON.stringify(frames)]).split('\n').forEach(l => l && console.log('  floor clip', l));
}

(async () => {
  if (WHAT === 'rig' || WHAT === 'all') await rig();
  if (WHAT === 'smooth' || WHAT === 'all') await smooth();
  if (WHAT === 'floor' || WHAT === 'all') await floor();
})().catch(e => { console.error(e); process.exit(1); });
