#!/usr/bin/env node
/* BOHEMIA -- DIRECTION [the fight verdict], FIGHT VERDICT 22 (rule 77a first: the freeway board beside the
 * street board). Opens the rebuilt fight (slices/BOHEMIA_FIGHT.html) on the one driver's phone profile with
 * the named boards 'freeway' and 'suburb', seed 1, at the camera it opens on and pulled back, and hands the
 * frames to the .py beside it, which marks the freeway frame and lays the three out.
 * records/BOHEMIA_FIGHT_VERDICT_ROUND_22_THE_FREEWAY_AND_THE_REBUILT_FIGHT_10_9_26.md.
 *
 * REFERENCE CHECK (the 9/4 standing duty): AH-01 (the bible and its AI-slop strand), AH-03 (the vibe-coded
 * tells), the style card's 5A density floor, the 9/29 floor (3a/3b) and FIGHT VERDICT 21's pass bar (F1-F5).
 * No reference game is cited.
 *
 * Out: slices/vote/DIRECTION_FIGHT_VERDICT_22_THE_FREEWAY.png
 */
'use strict';
const path = require('path'), fs = require('fs'), cp = require('child_process'), os = require('os');
const ROOT = path.resolve(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'fv22-'));

(async () => {
  const meta = {};
  for (const board of ['freeway', 'suburb']) {
    const d = await open({ bare: true, file: 'BOHEMIA_FIGHT.html', arm: `window.FIGHT_OPTS={board:'${board}',seed:1};` });
    const p = d.page;
    await p.waitForTimeout(9000);
    fs.writeFileSync(path.join(TMP, board + '_open.png'), await p.screenshot());
    meta[board] = await p.evaluate(() => { const c = document.querySelector('canvas');
      return { backing: c.width, css: c.getBoundingClientRect().width, dpr: devicePixelRatio, zoom: window.FIGHT_UI.zoom }; });
    await p.evaluate(() => { const U = window.FIGHT_UI; U.zoom = U.near * 0.35; });
    await p.waitForTimeout(1500);
    fs.writeFileSync(path.join(TMP, board + '_wide.png'), await p.screenshot());
    meta[board].errors = d.errs.length;
    await d.close();
  }
  fs.writeFileSync(path.join(TMP, 'meta.json'), JSON.stringify(meta));
  const out = path.join(ROOT, 'slices/vote/DIRECTION_FIGHT_VERDICT_22_THE_FREEWAY.png');
  const r = cp.spawnSync('python3', [path.join(ROOT, 'tools/bohemia_direction_fight_verdict_22.py'), TMP, out], { encoding: 'utf8' });
  process.stdout.write(r.stdout || ''); process.stderr.write(r.stderr || '');
  process.exit(r.status || 0);
})().catch(e => { console.error(e); process.exit(1); });
