#!/usr/bin/env node
/* BOHEMIA -- DIRECTION [flip look]: shoots the flip as it is on the alpha (the map, acts 2 and 3 unlocked through the
 * game's own BohemiaActs.unlock, then the game's own ctActFlipTo(3), frames every 150 ms) and hands the act-1 and act-3
 * frames to the .py beside it, which draws the card's four-beat flip ON those real pixels.
 * records/BOHEMIA_THE_FLIP_LOOK_CARD_10_9_26.md. Rule 37j (Paolo 9/27: 'a filter, a cut, a sound... we can't do this cheap').
 *
 * REFERENCE CHECK (the 9/4 standing duty): AH-01 (the bible: R2 the camera does not help, R4 night is arithmetic,
 * R8 diegetic or dead -- the tape damage lives inside the phone only), the AI-slop strand (the machine's screen is
 * smooth, the world is rough), AH-03 (no flash, no swirl, no box of words) and the three eras card. The act flip's
 * reference game is DYNASTY's department, never cited here.
 *
 * Out: slices/vote/DIRECTION_THE_FLIP_IN_FOUR_BEATS.png
 */
'use strict';
const path = require('path'), fs = require('fs'), cp = require('child_process'), os = require('os');
const ROOT = path.resolve(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'flip-'));
(async () => {
  const d = await open({ alpha: true }); await d.page.waitForTimeout(3000);
  await d.toMap(); await d.page.waitForTimeout(1500);
  await d.fr.evaluate(() => { BohemiaActs.unlock(2); BohemiaActs.unlock(3); });
  await d.page.waitForTimeout(1500);
  fs.writeFileSync(path.join(TMP, 'a1.png'), await d.page.screenshot());
  await d.fr.evaluate(() => ctActFlipTo(3));
  for (let k = 0; k < 14; k++) { fs.writeFileSync(path.join(TMP, 't' + String(k).padStart(2, '0') + '.png'), await d.page.screenshot()); await d.page.waitForTimeout(150); }
  await d.page.waitForTimeout(2500);
  fs.writeFileSync(path.join(TMP, 'a3.png'), await d.page.screenshot());
  const act = await d.fr.evaluate(() => BohemiaActs.current());
  fs.writeFileSync(path.join(TMP, 'meta.json'), JSON.stringify({ act, errors: d.errs.length }));
  await d.close();
  const out = path.join(ROOT, 'slices/vote/DIRECTION_THE_FLIP_IN_FOUR_BEATS.png');
  const r = cp.spawnSync('python3', [path.join(ROOT, 'tools/bohemia_direction_flip_look.py'), TMP, out], { encoding: 'utf8' });
  process.stdout.write(r.stdout || ''); process.stderr.write(r.stderr || ''); process.exit(r.status || 0);
})().catch(e => { console.error(e); process.exit(1); });
