#!/usr/bin/env node
/* BOHEMIA -- DIRECTION [judge the fight], THE FLOOR VERDICT (rule 46f, Paolo 10/1: "combat is soooo
 * fucked up bro holy shit the tiles below the people dont look good man its all fucked up").
 * Shoots a real fight off the alpha's COMBAT tab on the one driver's phone profile (390 x 844 at 3x),
 * seed 5, the camera left alone, and marks every thing on the ground that is not the ground, numbered
 * to the verdict's list (records/BOHEMIA_FIGHT_VERDICT_ROUND_21_THE_FLOOR_10_1_26.md). It also prints
 * the floor's measures for the four seeds the verdict reads (1, 5, 9, 13): the canvas against the
 * phone's pixels, the fine band, and the colour-class shares.
 *
 * REFERENCE CHECK (the 9/4 standing duty): the rulers are AH-01 (the bible: R1 one wrong thing, R4 the
 * light was in the room, R5 the institution's type, R10 grime baked) with its AI-slop strand (pair 2:
 * nothing soft and translucent on the world), the style card's 5A density floor for the ground tiles,
 * and the 9/29 map/fight floor (3a painted unit <= 1.5 device px, 3b fine band >= 0.020). The marks are
 * placed by eye on this seed's frame at this profile; the measures are machine. No reference game.
 *
 * Out: slices/vote/DIRECTION_THE_FLOOR_UNDER_THEIR_FEET.png
 */
'use strict';
const path = require('path'), fs = require('fs'), cp = require('child_process'), os = require('os');
const ROOT = path.resolve(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'floorv-'));

(async () => {
  const d = await open({ alpha: true });
  await d.page.click('[data-p="combat"]').catch(() => {});
  await d.page.waitForTimeout(7000);
  let fr = null;
  for (let i = 0; i < 40 && !fr; i++) {
    for (const f of d.page.frames()) {
      try { if (await f.evaluate(() => typeof setupCombat === 'function' && typeof houseOn === 'function')) { fr = f; break; } } catch (e) {}
    }
    if (!fr) await d.page.waitForTimeout(500);
  }
  if (!fr) { console.error('the fight did not answer'); process.exit(1); }
  const fb = await (await fr.frameElement()).boundingBox();
  await d.page.mouse.click(fb.x + fb.width / 2, fb.y + fb.height * 0.45);     /* past TAP TO START */
  await d.page.waitForTimeout(2500);
  const rows = [];
  for (const s of [1, 5, 9, 13]) {
    await fr.evaluate(s => { try { BohemiaArena.set(s); setupCombat(); G._uzE = null; G._camTouchAt = 0; G.phase = 'cover'; } catch (e) {} }, s);
    await d.page.waitForTimeout(1600);
    const info = await fr.evaluate(() => { const cv = document.getElementById('cv'), r = cv.getBoundingClientRect();
      return { w: cv.width, h: cv.height, cw: r.width, ch: r.height, x: r.x, y: r.y, dpr: devicePixelRatio, kind: G.arenaKind, house: houseOn() }; });
    fs.writeFileSync(path.join(TMP, `fight_${s}_glass.png`),
      await d.page.screenshot({ clip: { x: fb.x + info.x, y: fb.y + info.y, width: info.cw, height: info.ch } }));
    rows.push({ s, ...info, unit: +(info.cw * info.dpr / info.w).toFixed(2) });
  }
  await d.close();
  fs.writeFileSync(path.join(TMP, 'rows.json'), JSON.stringify(rows));
  const out = path.join(ROOT, 'slices/vote/DIRECTION_THE_FLOOR_UNDER_THEIR_FEET.png');
  const r = cp.spawnSync('python3', [path.join(ROOT, 'tools/bohemia_direction_the_floor_verdict.py'), TMP, out], { encoding: 'utf8' });
  process.stdout.write(r.stdout || ''); process.stderr.write(r.stderr || '');
  process.exit(r.status || 0);
})().catch(e => { console.error(e); process.exit(1); });
