#!/usr/bin/env node
/* COOK [the floor through the rig] 10/19: the REAL fight (slices/BOHEMIA_FIGHT.html, the demo's fight) on the one driver's phone
 * profile (390 x 844 @3x), named boards at seed 1, by day, shot twice from the game's camera: as it ships, and with the fight's
 * block pictures answered from records/target/cook_floor_rig/ (the driver's serve map: the page asks for the same file, the
 * server hands it the 3D floor; nothing in slices/ is touched; COMBAT wires it). COOK TWO's shot script for its floor, the
 * folder and the sheet changed. Two frames a board: the opening frame and the close stop.
 *   node tools/bohemia_cook_the_floor_through_the_rig_shot_10_19_26.js [boards]
 *   -> records/target/COOK_THE_FLOOR_THROUGH_THE_RIG.webp (+ records/target/cook_floor_rig/shots/)
 *
 * REFERENCE CHECK (the 9/4 standing duty): the compare law, AH-01 and AH-03, FIGHT VERDICT 21's pass bar. No reference game.
 * REUSE CHECK (REUSE-FIRST): COOK TWO's shot script (tools/bohemia_cook2_the_fight_floor_shot_10_19_26.js) and the one driver
 * (tools/bohemia_drive_the_demo.js, its serve map); nothing new in the page.
 * TASTE CHECK: his NO twice on the fight floor; shown from the game's camera (his second votes), old beside new.
 */
'use strict';
const path = require('path'), fs = require('fs'), cp = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const NEW = path.join(ROOT, 'records/target/cook_floor_rig');
const SHOTS = path.join(NEW, 'shots');
const BOARDS = (process.argv[2] || 'suburb,culdesac,strip,desert,ruin').split(',');

function serveNew() {
  const m = {};
  for (const f of fs.readdirSync(NEW)) if (/^block_.*\.webp$/.test(f)) m['/slices/fight_ground/' + f] = path.join(NEW, f);
  return m;
}

(async () => {
  fs.mkdirSync(SHOTS, { recursive: true });
  const meta = {};
  for (const board of BOARDS) {
    for (const floor of ['old', 'new']) {
      const d = await open({ bare: true, file: 'BOHEMIA_FIGHT.html', serve: floor === 'new' ? serveNew() : {},
        arm: `window.FIGHT_OPTS={board:'${board}',seed:1,night:false};` });
      const p = d.page;
      await p.waitForTimeout(9000);
      fs.writeFileSync(path.join(SHOTS, `${board}_${floor}_open.png`), await p.screenshot());
      const m = await p.evaluate(() => { const U = window.FIGHT_UI, c = document.querySelector('canvas');
        return { zoom: U.zoom, near: U.near, backing: c.width, css: c.getBoundingClientRect().width, dpr: devicePixelRatio }; });
      await p.evaluate(() => { const U = window.FIGHT_UI; U.zoom = U.near; });
      await p.waitForTimeout(1500);
      fs.writeFileSync(path.join(SHOTS, `${board}_${floor}_close.png`), await p.screenshot());
      m.errors = d.errs.length; meta[`${board}_${floor}`] = m;
      await d.close();
      console.log(board, floor, JSON.stringify(m));
    }
  }
  fs.writeFileSync(path.join(SHOTS, 'meta.json'), JSON.stringify(meta, null, 1));
  const r = cp.spawnSync('python3', [path.join(ROOT, 'tools/bohemia_cook_the_floor_through_the_rig_sheet_10_19_26.py'), SHOTS, BOARDS.join(',')], { encoding: 'utf8' });
  process.stdout.write(r.stdout || ''); process.stderr.write(r.stderr || '');
  process.exit(r.status || 0);
})().catch(e => { console.error(e); process.exit(1); });
