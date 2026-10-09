#!/usr/bin/env node
/* BOHEMIA -- DIRECTION [the demo verdict]: every screen a stranger meets in the demo, shot on the one
 * driver's phone profile (390 x 844 at 3x), the way a stranger plays it: wait on the title, tap NEW GAME,
 * leave the picks as they come, BEGIN, look at the map, tap the nearest place (the church), let the fight
 * run on AUTO, see what comes after; and a second session that taps a settlement and waits to arrive.
 * Judged against the analog horror bible and the vibe-coded tells (AH-03) in
 * records/BOHEMIA_THE_DEMO_VERDICT_EVERY_SCREEN_10_9_26.md. Paolo 10/5: 'everything is looking
 * glitchy... vibe code dog shit' (rule 71).
 *
 * REFERENCE CHECK (the 9/4 standing duty): AH-01 (the bible, R1-R10, the era, the AI-slop strand), AH-03
 * (the vibe-coded tells, written by this round), the style card's register and accent floor, the 9/29
 * floor (3a/3b) and the floor pass bar (FIGHT VERDICT 21). No reference game is cited.
 *
 * Out: slices/vote/DIRECTION_THE_DEMO_EVERY_SCREEN.png (composed by the .py beside this file)
 */
'use strict';
const path = require('path'), fs = require('fs'), cp = require('child_process'), os = require('os');
const ROOT = path.resolve(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'demov-'));

async function begin(d) {
  const p = d.page;
  await p.waitForTimeout(15000);
  fs.writeFileSync(path.join(TMP, '1_title.png'), await p.screenshot());
  await p.mouse.click(195, 553); await p.waitForTimeout(2500);                 /* NEW GAME */
  fs.writeFileSync(path.join(TMP, '2_picks.png'), await p.screenshot());
  for (let i = 0; i < 20; i++) {                                               /* BEGIN, once it lights */
    await p.mouse.click(195, 781); await p.waitForTimeout(1500);
    if (await p.evaluate(() => { const f = document.getElementById('front'); return !f || getComputedStyle(f).display === 'none'; })) break;
  }
  await p.waitForTimeout(6000);
}
const clk = async (p, sel) => { for (const f of p.frames()) { try { await f.click(sel, { timeout: 400 }); return true; } catch (e) {} } return false; };

(async () => {
  /* session one: the map, the cut, the fight, after */
  let d = await open({ bare: true }); let p = d.page;
  await begin(d);
  fs.writeFileSync(path.join(TMP, '3_map.png'), await p.screenshot());
  await p.mouse.click(167, 450);                                               /* the church, the nearest place */
  for (let k = 0; k < 12; k++) {                                               /* the cut is under a second: shoot it as it goes */
    fs.writeFileSync(path.join(TMP, '5_cut_' + k + '.png'), await p.screenshot()); await p.waitForTimeout(150);
  }
  await p.waitForTimeout(3500);
  fs.writeFileSync(path.join(TMP, '6_fight.png'), await p.screenshot());
  await clk(p, '#bauto');
  await p.waitForTimeout(4000);
  fs.writeFileSync(path.join(TMP, '7_fight_close.png'), await p.screenshot());
  await p.waitForTimeout(42000);
  fs.writeFileSync(path.join(TMP, '8_after.png'), await p.screenshot());
  await d.close();
  /* session two: tap a settlement, wait to arrive, tap it again */
  d = await open({ bare: true }); p = d.page;
  await begin(d);
  await p.mouse.click(68, 641); await p.waitForTimeout(25000);
  await p.mouse.click(195, 470); await p.waitForTimeout(3000);
  fs.writeFileSync(path.join(TMP, '4_arrived.png'), await p.screenshot());
  await d.close();
  const out = path.join(ROOT, 'slices/vote/DIRECTION_THE_DEMO_EVERY_SCREEN.png');
  const r = cp.spawnSync('python3', [path.join(ROOT, 'tools/bohemia_direction_the_demo_verdict.py'), TMP, out], { encoding: 'utf8' });
  process.stdout.write(r.stdout || ''); process.stderr.write(r.stderr || '');
  process.exit(r.status || 0);
})().catch(e => { console.error(e); process.exit(1); });
