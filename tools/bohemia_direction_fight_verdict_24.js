#!/usr/bin/env node
/* BOHEMIA -- DIRECTION [fight verdict 24], THE FLOOR BAR AFTER THE GROUND (his NO on the fight floor 10/18: 'I hate the
 * ground. I hate the floor... it's so fucking bad'; his YES on one real street, cook2-one-real-street-10-18, and on the
 * streets joining for the map, 'way better nice'). Verdict 23's shooter (tools/bohemia_direction_fight_verdict_23.js),
 * reused: opens the rebuilt fight (slices/BOHEMIA_FIGHT.html) on the one driver's phone profile, seed 1, the five
 * kinds his NO card showed (suburb, strip, freeway, the desert's scrub, ruin), at the camera the fight opens on and pulled back,
 * and hands the frames to the .py beside it, which measures the floor against the ground he said YES to.
 * records/BOHEMIA_FIGHT_VERDICT_ROUND_24_THE_FLOOR_BAR_10_19_26.md.
 *
 * REFERENCE CHECK (the 9/4 standing duty): his YES twins (records/target/COOK2_ONE_REAL_STREET.webp,
 * records/target/COOK2_THE_STREET_JOINS_FOR_THE_MAP.webp), AH-01 (the bible), AH-03 (the vibe-coded tells), FIGHT
 * VERDICT 21's pass bar (F1-F5). No reference game is cited.
 *
 * usage: node tools/bohemia_direction_fight_verdict_24.js [shots dir]   (re-runs the .py on the frames)
 * Out: slices/vote/DIRECTION_FIGHT_VERDICT_24_THE_FLOOR_BAR.png (+ .json)
 */
'use strict';
const path = require('path'), fs = require('fs'), cp = require('child_process'), os = require('os');
const ROOT = path.resolve(__dirname, '..');
const KINDS = ['suburb', 'strip', 'freeway', 'scrub', 'ruin'];

(async () => {
  let TMP = process.argv[2];
  if (!TMP) {
    const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
    TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'fv24-'));
    const meta = {};
    for (const kind of KINDS) {
      const d = await open({ bare: true, file: 'BOHEMIA_FIGHT.html', arm: `window.FIGHT_OPTS={kind:'${kind}',seed:1};` });
      const p = d.page;
      await p.waitForTimeout(9000);
      fs.writeFileSync(path.join(TMP, kind + '_open.png'), await p.screenshot());
      meta[kind] = await p.evaluate(() => { const c = document.querySelector('canvas');
        return { backing: c.width, css: c.getBoundingClientRect().width, dpr: devicePixelRatio, zoom: window.FIGHT_UI.zoom,
                 board: window.FIGHT && window.FIGHT.S ? window.FIGHT.S.board : null }; });
      await p.evaluate(() => { const U = window.FIGHT_UI; U.zoom = U.near * 0.35; });
      await p.waitForTimeout(1500);
      fs.writeFileSync(path.join(TMP, kind + '_wide.png'), await p.screenshot());
      meta[kind].errors = d.errs.length;
      await d.close();
    }
    fs.writeFileSync(path.join(TMP, 'meta.json'), JSON.stringify(meta));
  }
  const out = path.join(ROOT, 'slices/vote/DIRECTION_FIGHT_VERDICT_24_THE_FLOOR_BAR.png');
  const r = cp.spawnSync('python3', [path.join(ROOT, 'tools/bohemia_direction_fight_verdict_24.py'), TMP, out], { encoding: 'utf8' });
  process.stdout.write('shots ' + TMP + '\n' + (r.stdout || '')); process.stderr.write(r.stderr || '');
  process.exit(r.status || 0);
})().catch(e => { console.error(e); process.exit(1); });
