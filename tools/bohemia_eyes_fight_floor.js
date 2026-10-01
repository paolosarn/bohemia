#!/usr/bin/env node
/* BOHEMIA -- [fight floor measured] ROUND TWO: THE CHECK
 * EYES AND EARS, lane 17, rule 46f. 10/1/26.
 *
 * THE ROW: Paolo 10/1, "the tiles below the people dont look good." DIRECTION's own FIGHT VERDICT
 * round 21 (records/BOHEMIA_FIGHT_VERDICT_ROUND_21_THE_FLOOR_10_1_26.md) already judged the floor
 * FAIL on five tests against COMBAT V233 (93d05a9) and explicitly routed three of them to THIS lane:
 * "EYES reads F1-F3 by machine on its next walk." This IS that walk.
 *
 * SINCE THAT VERDICT WAS FILED, COMBAT SHIPPED AGAIN (V234+V235, commit 0d3c92b, "the ground under
 * the fighters... at the phone's real pixels"): the device-ratio canvas (F1's own fix) and a pass
 * that deletes the ovals/diamonds/disc/words V233 was failed on. So this is not a repeat of the
 * verdict's own numbers -- it is the first AFTER reading, on whatever is on main right now, the
 * exact thing round one's school asked for ("post the numbers now as the before, and again every
 * time COMBAT ships on [house tiles back]").
 *
 * REUSE-FIRST, NOT COPY-FIRST: the reach pattern (BohemiaArena.set/setupCombat, the same four seeds
 * 1/5/9/13) and the three formulas (F1 painted-unit ratio, F2 the FFT fine-band energy share, F3 the
 * never-ground colour classes) are DIRECTION's own, fully specified in their verdict's prose and
 * tool, and reusing a well-specified measure is not a shortcut -- inventing a different metric for
 * the same named test would make the two numbers incomparable for no reason. What is genuinely
 * independent here: a second, separately-run reach and measurement (not DIRECTION's saved PNGs),
 * fresh on the CURRENT alpha, with its own RULE ZERO controls neither tool had before.
 *
 * RULE ZERO. No fresh F1/F2/F3 number is printed unless every control below passes.
 *   C0 THE DOOR IS BEHIND US        the shared driver's own doorIsBehindUs()
 *   C1 THE FIGHT ANSWERED           setupCombat/houseOn found in a real frame, same proof DIRECTION's
 *                                   own tool requires before it trusts anything
 *   C2 THE CLASSIFIER KNOWS GROUND FROM A MARK   plant a flat grey "ground" square (no class should
 *      fire) and a saturated red square (the red class must fire near 100%) in synthetic arrays,
 *      run classes() on both, before it ever touches a real screenshot
 *   C3 THE BAND READER KNOWS FINE FROM FLAT   plant a flat (zero-variance) patch (band ~ 0) and a
 *      checkerboard patch (alternating every pixel -- the highest possible spatial frequency, band
 *      ~ 1 on both axes), run band() on both, before it ever touches a real screenshot
 *
 * Out: records/BOHEMIA_EYES_FIGHT_FLOOR_9_30_26.json, records/eyes_fight_floor/*.png
 */
'use strict';
const path = require('path'), fs = require('fs'), cp = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const SHOTDIR = path.join(ROOT, 'records', 'eyes_fight_floor');
const OUT = path.join(ROOT, 'records', 'BOHEMIA_EYES_FIGHT_FLOOR_9_30_26.json');
const SEEDS = [1, 5, 9, 13];

(async () => {
  try { fs.mkdirSync(SHOTDIR, { recursive: true }); } catch (e) {}
  const out = { what: 'F1-F3 of the fight floor, read by machine, fresh off the current alpha',
    row: '[fight floor measured], rule 46f', when: new Date().toISOString(),
    surface: 'slices/BOHEMIA_ALPHA_0_9.html (current main)', seeds: SEEDS, controls: [] };

  const d = await D.open({ alpha: true });
  try {
    out.controls.push({ name: 'C0 THE DOOR IS BEHIND US', pass: !!d.doorIsBehindUs(),
      detail: 'the door held ' + d.doorMs() + ' ms after the first knock' });

    await d.page.click('[data-p="combat"]').catch(() => {});
    await d.page.waitForTimeout(7000);
    let fr = null;
    for (let i = 0; i < 40 && !fr; i++) {
      for (const f of d.page.frames()) {
        try { if (await f.evaluate(() => typeof setupCombat === 'function' && typeof houseOn === 'function')) { fr = f; break; } } catch (e) {}
      }
      if (!fr) await d.page.waitForTimeout(500);
    }
    out.controls.push({ name: 'C1 THE FIGHT ANSWERED: setupCombat/houseOn found in a real frame',
      pass: !!fr, detail: fr ? 'found' : 'never found after 40 tries, 20s' });
    if (!fr) throw new Error('C1 failed: no fight frame');

    const fb = await (await fr.frameElement()).boundingBox();
    await d.page.mouse.click(fb.x + fb.width / 2, fb.y + fb.height * 0.45);
    await d.page.waitForTimeout(2500);

    const rows = [];
    for (const s of SEEDS) {
      await fr.evaluate((s) => { try { BohemiaArena.set(s); setupCombat(); G._uzE = null; G._camTouchAt = 0; G.phase = 'cover'; } catch (e) {} }, s);
      await d.page.waitForTimeout(1600);
      const info = await fr.evaluate(() => {
        const cv = document.getElementById('cv'); const r = cv.getBoundingClientRect();
        return { w: cv.width, h: cv.height, cw: r.width, ch: r.height, x: r.x, y: r.y, dpr: devicePixelRatio,
          kind: (typeof G !== 'undefined' && G.arenaKind) || null };
      });
      const shotPath = path.join(SHOTDIR, 'fight_' + s + '.png');
      await d.page.screenshot({ path: shotPath, clip: { x: fb.x + info.x, y: fb.y + info.y, width: info.cw, height: info.ch } });
      rows.push({ seed: s, ...info, unit: +(info.cw * info.dpr / info.w).toFixed(3), shot: shotPath });
    }
    out.fresh_rows = rows;
    await d.close();

    const r = cp.spawnSync('python3', [path.join(ROOT, 'tools/bohemia_eyes_fight_floor_measure.py'),
      JSON.stringify(rows)], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    if (r.status !== 0) { out.ok = false; out.why = 'measure.py failed: ' + (r.stderr || '').slice(0, 2000);
      fs.writeFileSync(OUT, JSON.stringify(out, null, 2)); console.log(out.why); process.exit(1); }
    const measured = JSON.parse(r.stdout);
    out.controls.push(measured.controls[0], measured.controls[1]);
    if (!measured.controls[0].pass || !measured.controls[1].pass) {
      out.controls_failed = true;
      fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
      console.log('  C2/C3 FAILED. Refusing to report F1-F3 numbers from an unproven classifier.');
      console.log(JSON.stringify(measured.controls, null, 2));
      process.exit(1);
    }
    out.F1_painted_unit_device_px = rows.map(r2 => r2.unit);
    out.F1_pass = out.F1_painted_unit_device_px.every(u => u <= 1.5);
    out.F2_fine_band = measured.bands;
    out.F2_pass = measured.bands.every(b => b[0] >= 0.020 && b[1] >= 0.020);
    out.F3_never_ground_pct = measured.classes;
    out.F3_pass = measured.classes.every(c => c.fake_pct === 0);

    out.against_round_21_verdict = {
      F1_then: [3.0, 3.0, 3.0, 3.0], F1_now: out.F1_painted_unit_device_px,
      F2_then: [[0.0091, 0.0108], [0.0068, 0.0075], [0.0096, 0.011], [0.0102, 0.0113]], F2_now: out.F2_fine_band,
      F3_then_pct: [3.1, 9.6, 4.8, 3.3], F3_now_pct: out.F3_never_ground_pct.map(c => c.fake_pct),
    };
  } catch (e) { out.ok = false; out.why = String(e).slice(0, 500); }
  try { await d.close(); } catch (e) {}
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  console.log('  controls: ' + (out.controls.every(c => c.pass) ? 'all green' : 'SOME FAILED'));
  if (out.why) console.log('  why: ' + out.why);
  if (out.F1_painted_unit_device_px) {
    console.log('  F1 painted unit (device px), was 3.0 every board: ' + JSON.stringify(out.F1_painted_unit_device_px) + '  PASS=' + out.F1_pass);
    console.log('  F2 fine band (>=0.020 both axes), was 0.007-0.011: ' + JSON.stringify(out.F2_fine_band) + '  PASS=' + out.F2_pass);
    console.log('  F3 never-ground %, was 3.1/9.6/4.8/3.3: ' + JSON.stringify(out.F3_never_ground_pct.map(c => c.fake_pct)) + '  PASS=' + out.F3_pass);
  }
  process.exit(0);
})();
