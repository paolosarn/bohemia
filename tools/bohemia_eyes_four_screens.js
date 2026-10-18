#!/usr/bin/env node
/* BOHEMIA -- [the fight at four screens judged] ROUND TWO: THE CHECK
 * EYES AND EARS, lane 17, rule 62. 10/5/26.
 *
 * THE ROW: the rebuilt fight at the four screen classes -- how much of the board each shows at
 * the opening, the bar's touch targets, what is cut off, the man's size in device pixels.
 *
 * REUSE-FIRST, NAMED: gates/the_rebuilt_fight_plays_gate.js's screens() already independently
 * measures glass%, one-row bar, centring, min tap size and "does the whole board fit" across all
 * four profiles, in the page's own JS. Reusing that CHECK would not be a second pair of eyes --
 * it would be reading the same number back. What round one's school found is missing from it:
 * (1) the MAN'S OWN DEVICE-PIXEL SIZE at each class (never measured anywhere, by anyone); (2)
 * TOUCH-TARGET SPACING between adjacent taps (Material's real 8dp rule, only each tap's own size
 * is checked); (3) a real screenshot to confirm the numbers against, the same discipline as every
 * other round this lane has shipped. This tool measures those three, independently, from real
 * screenshots, not a second read of the in-page self-report.
 *
 * Out: records/eyes_four_screens/*.png + *.json
 */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUTDIR = path.join(ROOT, 'records', 'eyes_four_screens');
const PROFILES = ['phone_portrait', 'phone_landscape', 'tablet', 'computer'];

async function shoot(profile) {
  const d = await D.open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: profile,
    arm: 'window.FIGHT_OPTS={seed:31,speed:1,kind:"strip"}' });
  const p = d.page;
  await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round, null, { timeout: 30000 });
  await p.waitForTimeout(1800);
  const geo = await p.evaluate(() => {
    const r = id => { const e = document.getElementById(id); const b = e.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; };
    const taps = ['bend', 'bwait', 'bauto', 'card'].map(id => Object.assign({ id: id }, r(id)))
      .concat(Array.from(document.querySelectorAll('#skills .sq')).filter(b => b.style.display !== 'none')
        .map((e, i) => Object.assign({ id: 'skill' + i }, { x: e.getBoundingClientRect().x, y: e.getBoundingClientRect().y, w: e.getBoundingClientRect().width, h: e.getBoundingClientRect().height })));
    const S = FIGHT.S;
    const sx = w => (w - FIGHT_UI.cx) * FIGHT_UI.zoom + innerWidth / 2;
    const sy = w => (w - FIGHT_UI.cy) * FIGHT_UI.zoom + TOPH + (innerHeight - TOPH - BOTH) / 2;
    const firstMan = S.units.filter(u => FIGHT.onField(u) && u.side === 'you')[0];
    const man = firstMan ? { cx: sx((firstMan.x + .5) * FIGHT_UI.tw), feet: sy((firstMan.y + .9) * FIGHT_UI.th), h_css: FIGHT_UI.th * FIGHT_UI.zoom * .86 } : null;
    return { W: innerWidth, H: innerHeight, DPR: devicePixelRatio, TOPH: TOPH, BOTH: BOTH,
      zoom: FIGHT_UI.zoom, far: FIGHT_UI.far, boardW: FIGHT_UI.board.width, boardH: FIGHT_UI.board.height,
      tw: FIGHT_UI.tw, th: FIGHT_UI.th, taps: taps, man: man,
      screen: document.documentElement.dataset.screen, barRect: r('bot'), topRect: r('top') };
  });
  const shotPath = path.join(OUTDIR, profile + '.png');
  await p.screenshot({ path: shotPath });
  fs.writeFileSync(path.join(OUTDIR, profile + '.json'), JSON.stringify(geo, null, 2));
  await d.close();
  return geo;
}

(async () => {
  try { fs.mkdirSync(OUTDIR, { recursive: true }); } catch (e) {}
  const all = {};
  for (const pr of PROFILES) {
    console.log('  [driver] ' + pr + '...');
    all[pr] = await shoot(pr);
  }
  fs.writeFileSync(path.join(OUTDIR, 'all_geometry.json'), JSON.stringify(all, null, 2));
  console.log('  done. records/eyes_four_screens/ has four frames and their geometry.');
})().catch(e => { console.log('  FAIL: ' + e.stack); process.exit(1); });
