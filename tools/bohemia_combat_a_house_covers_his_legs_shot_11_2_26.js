#!/usr/bin/env node
/* COMBAT [a house covers his legs] 11/2 (ask line 251, Paolo 10/27: 'if I'm in the street during combat mode and there's a house
 * one tile beneath me south of me... if that house is a one or two or three story house then it would cover up like the legs of
 * my character'): the REAL fight (slices/BOHEMIA_FIGHT.html) on the driver's upright phone (390 x 844 @3x), a suburb board, one of
 * his men stood on the tile right behind a ranch house, the camera on him at the close stop; shot twice: BEFORE (the suburb block
 * pictures and fight_stands.json as they stand at <sha>, served through the driver's serve map) and AFTER (the tree as it is).
 *   node tools/bohemia_combat_a_house_covers_his_legs_shot_11_2_26.js [sha=origin/main] [seed=1]
 *   -> records/target/combat_layers_11_2/phone_houses_before_after.webp (+ the two frames as .png in the scratch folder given by
 *      COMBAT_SHOT_TMP, default /tmp)
 * REUSE CHECK (REUSE-FIRST): the one driver (tools/bohemia_drive_the_demo.js, its phone profile and serve map), the fight's own
 * standsNow() for where the houses stand; nothing new in the page.
 */
'use strict';
const path = require('path'), fs = require('fs'), cp = require('child_process'), os = require('os');
const ROOT = path.resolve(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const SHA = process.argv[2] || 'origin/main', SEED = +(process.argv[3] || 1);
const TMP = process.env.COMBAT_SHOT_TMP || os.tmpdir();
const OUT = path.join(ROOT, 'records/target/combat_layers_11_2');
const KINDS = ['subs', 'corner', 'culdesac', 'suburb_stem'];

function before() {
  const dir = path.join(TMP, 'houses_before'); fs.mkdirSync(dir, { recursive: true });
  const man = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/fight_ground/fight_ground.json'), 'utf8')), m = {};
  const srcs = [];
  for (const [bid, d] of Object.entries(man.blocks)) if (KINDS.indexOf(bid.split('.')[0]) >= 0) srcs.push(d.src);
  for (const st of Object.values(man.futures || {})) for (const [bid, s] of Object.entries(st.blocks || {})) if (KINDS.indexOf(bid.split('.')[0]) >= 0) srcs.push(s);
  for (const f of srcs.concat(['fight_stands.json'])) {
    const to = path.join(dir, f);
    fs.writeFileSync(to, cp.execFileSync('git', ['show', SHA + ':slices/fight_ground/' + f], { cwd: ROOT, maxBuffer: 1 << 26 }));
    m['/slices/fight_ground/' + f] = to;
  }
  return m;
}

async function shot(serve, pick) {
  const d = await open({ bare: true, file: 'BOHEMIA_FIGHT.html', serve, arm: `window.FIGHT_OPTS={board:'suburb',seed:${SEED},night:false};` });
  const p = d.page;
  await p.waitForTimeout(9000);
  const r = await p.evaluate((pick) => {
    const S = FIGHT.S, U = window.FIGHT_UI;
    let at = pick;
    if (!at) {                                   /* a house with a free tile right behind it, inside the board */
      const L = standsNow().filter(function (o) { return o.kind === 'house'; });
      const roofs = {}; L.forEach(function (o) { roofs[Math.round(o.line - .5) + ',' + Math.floor((o.x0 + o.x1) / 2 / U.tw)] = 1; });
      const ok = L.map(function (o) { return { row: Math.round(o.line - 1.5), col: Math.floor((o.x0 + o.x1) / 2 / U.tw), rise: o.line * U.th - .4 * U.th - o.y0 }; })
        .filter(function (q) { return q.row >= 1 && q.row < S.h - 1 && q.col >= 1 && q.col < S.w - 1 && !roofs[q.row + ',' + q.col]
          && !S.units.some(function (v) { return v.x === q.col && v.y === q.row; }); });
      ok.sort(function (a, b) { return b.rise - a.rise; });
      at = ok[0];
      if (!at) return { err: 'no house with a free tile behind it', houses: L.length };
    }
    const v = S.units.find(function (u) { return u.side === 'you' && !u.dead && FIGHT.onField(u); });
    v.x = at.col; v.y = at.row; delete v._at; v.facing = 'S';
    camMine(); U.zoom = U.near; U.cx = (at.col + .5) * U.tw; U.cy = (at.row + .1) * U.th; clampCam();
    UI.stands = null; UI.layer = null;
    return { at: at, id: v.id, zoom: U.zoom, houses: standsNow().filter(function (o) { return o.kind === 'house'; }).length };
  }, pick || null);
  await p.waitForTimeout(1500);
  const png = await p.screenshot();
  await d.close();
  return { r, png, errs: d.errs.length };
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const a = await shot({}, null);
  if (a.r.err) { console.error(JSON.stringify(a.r)); process.exit(1); }
  const b = await shot(before(), a.r.at);
  const fa = path.join(TMP, 'houses_after.png'), fb = path.join(TMP, 'houses_before.png');
  fs.writeFileSync(fa, a.png); fs.writeFileSync(fb, b.png);
  console.log('after', JSON.stringify(a.r), 'errors', a.errs, '| before', JSON.stringify(b.r), 'errors', b.errs);
  const py = `
from PIL import Image, ImageDraw
a=Image.open(${JSON.stringify(fb)}).convert('RGB'); b=Image.open(${JSON.stringify(fa)}).convert('RGB')
w,h=a.size; s=0.5; a=a.resize((int(w*s),int(h*s))); b=b.resize((int(w*s),int(h*s)))
o=Image.new('RGB',(a.width*2+12,a.height),(12,12,12)); o.paste(a,(0,0)); o.paste(b,(a.width+12,0))
d=ImageDraw.Draw(o)
for x,t in ((10,'BEFORE: the ranch covers nothing'),(a.width+22,'AFTER: the ranch covers his feet and shins')): d.rectangle([x-4,6,x+330,30],fill=(0,0,0)); d.text((x,12),t,fill=(255,255,255))
o.save(${JSON.stringify(path.join(OUT, 'phone_houses_before_after.webp'))}, quality=85)
print('wrote', o.size)`;
  const r = cp.spawnSync('python3', ['-c', py], { encoding: 'utf8' });
  process.stdout.write(r.stdout || ''); process.stderr.write(r.stderr || '');
  process.exit(r.status || 0);
})().catch(e => { console.error(e); process.exit(1); });
