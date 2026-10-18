#!/usr/bin/env node
/* BOHEMIA -- [night in the sun measured] ROUND TWO: THE CHECK
 * EYES AND EARS, lane 17, rule 73/73a. 10/5/26.
 *
 * THE ROW: measure the demo's night pictures (COMBAT's rebuilt fight, COMBAT TWO's settlement
 * art) against rule 73a's floor, independently -- real screenshots, Python/PIL, this lane's own
 * code, not a read of COMBAT's own in-page self-report (gates/the_rebuilt_fight_plays_gate.js's
 * sunTest()). REUSE-FIRST: the WCAG relative-luminance formula and the screen-space geometry
 * (sx/sy, tile sampling, the glare veil v*0.75+64) are COMBAT's own, well-specified in their gate
 * and reused rather than re-invented for no reason; what is independent is the measurement PATH
 * (a real screenshot file read by a second language and a second process), the same discipline
 * this lane used for F1-F3 against DIRECTION's formulas.
 *
 * Also fills a real gap: COMBAT's own sunTest() never measured the bar's WORDS contrast (rule
 * 73a's 4.5:1 floor), only the ground and a man. This tool does.
 *
 * Out: records/eyes_night_in_sun/*.png + *.json (geometry manifests for the Python pass)
 */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUTDIR = path.join(ROOT, 'records', 'eyes_night_in_sun');

async function shoot(night, label) {
  const d = await D.open({ file: 'BOHEMIA_FIGHT.html', bare: true,
    arm: 'window.FIGHT_OPTS={seed:31,speed:1,kind:"strip",night:' + night + '}' });
  const p = d.page;
  await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round, null, { timeout: 30000 });
  await p.waitForTimeout(3000);
  await p.evaluate(() => { FIGHT_UI.glide = null; FIGHT_UI.zoom = FIGHT_UI.far * 1.8; });
  await p.waitForTimeout(500);
  const geo = await p.evaluate(() => {
    const S = FIGHT.S, T = FIGHT._t, B = FIGHT_UI.board;
    const occ = {}; S.units.forEach(u => { if (FIGHT.onField(u)) occ[u.x + ',' + u.y] = 1; });
    const tiles = [];
    for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) {
      if (!T.passable(x, y) || occ[x + ',' + y]) continue;
      tiles.push({ x: x, y: y, lit: !!T.litAt(x, y) });
    }
    const sx = w => (w - FIGHT_UI.cx) * FIGHT_UI.zoom + innerWidth / 2;
    const sy = w => (w - FIGHT_UI.cy) * FIGHT_UI.zoom + TOPH + (innerHeight - TOPH - BOTH) / 2;
    const men = S.units.filter(u => FIGHT.onField(u)).map(u => ({
      cx: sx((u.x + .5) * FIGHT_UI.tw), feet: sy((u.y + .9) * FIGHT_UI.th), h: FIGHT_UI.th * FIGHT_UI.zoom * .86,
      ground: [[.08, .2], [.92, .2], [.08, .6], [.92, .6]].map(o => ({ x: sx((u.x + o[0]) * FIGHT_UI.tw), y: sy((u.y + o[1]) * FIGHT_UI.th) })) }));
    const box = id => { const e = document.getElementById(id); if (!e) return null; const r = e.getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height, text: e.textContent, color: getComputedStyle(e).color }; };
    return { tw: FIGHT_UI.tw, th: FIGHT_UI.th, zoom: FIGHT_UI.zoom, dpr: devicePixelRatio, W: innerWidth, H: innerHeight,
      sx0: sx(0), sy0: sy(0), sxk: sx(1) - sx(0), syk: sy(1) - sy(0), tiles: tiles, men: men,
      words: ['round', 'cnm', 'bend', 'bwait', 'bauto'].map(box).filter(Boolean) };
  });
  const shotPath = path.join(OUTDIR, label + '.png');
  await p.screenshot({ path: shotPath });
  fs.writeFileSync(path.join(OUTDIR, label + '.json'), JSON.stringify(geo, null, 2));
  await d.close();
  return shotPath;
}

async function shootSettlement() {
  /* COMBAT TWO's night art is static baked webp, no page needed to reach it -- just confirm
     the files are real and present, Python reads the pixels directly. */
  const dir = path.join(ROOT, 'slices', 'settlement_ground');
  const files = fs.readdirSync(dir).filter(f => /_night\.webp$/.test(f));
  return files.map(f => path.join(dir, f));
}

(async () => {
  try { fs.mkdirSync(OUTDIR, { recursive: true }); } catch (e) {}
  console.log('  [driver] shooting the fight by day...');
  await shoot(false, 'fight_day');
  console.log('  [driver] shooting the fight by night...');
  await shoot(true, 'fight_night');
  const settle = await shootSettlement();
  console.log('  [driver] settlement night files found: ' + settle.length);
  fs.writeFileSync(path.join(OUTDIR, 'settlement_files.json'), JSON.stringify(settle, null, 2));
  console.log('  done. records/eyes_night_in_sun/ has the frames and geometry.');
})().catch(e => { console.log('  FAIL: ' + e.stack); process.exit(1); });
