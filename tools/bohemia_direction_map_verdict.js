#!/usr/bin/env node
/* BOHEMIA -- DIRECTION [the map verdict]: the map at its stops, shot on the one driver's phone profile, laid beside
 * what Battle Brothers' map does at the same distance (from our library, reference/library/battle_brothers/01_WORLDMAP.md;
 * their screenshots are egress-blocked, so their side is words, said so on the sheet). Rules 65 (the painted far end)
 * and 50 (the zoom range). records/BOHEMIA_THE_MAP_VERDICT_AT_EVERY_STOP_10_9_26.md.
 *
 * REFERENCE CHECK (the 9/4 standing duty): AH-01 (the bible), AH-03 (the vibe-coded tells), the BB density floor
 * (records/BOHEMIA_BB_DENSITY_THE_MAP_FLOOR_9_28_26.md, 3a/3b) and the [bb look] card. Battle Brothers is in its own
 * department here (the map). No other reference game.
 *
 * Out: slices/vote/DIRECTION_THE_MAP_AT_EVERY_STOP.png
 */
'use strict';
const path = require('path'), fs = require('fs'), cp = require('child_process'), os = require('os');
const ROOT = path.resolve(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'mapv-'));

(async () => {
  const d = await open({});
  await d.page.waitForTimeout(4000);
  const stops = [];
  let s = await d.state(); stops.push(s.czoom);
  fs.writeFileSync(path.join(TMP, 'near.png'), await d.page.screenshot());
  await d.pinchOut(); await d.page.waitForTimeout(1800);      /* ONE pinch: where does it land? */
  s = await d.state(); stops.push(s.czoom);
  fs.writeFileSync(path.join(TMP, 'far.png'), await d.page.screenshot());
  fs.writeFileSync(path.join(TMP, 'stops.json'), JSON.stringify(stops));
  await d.close();
  const out = path.join(ROOT, 'slices/vote/DIRECTION_THE_MAP_AT_EVERY_STOP.png');
  const r = cp.spawnSync('python3', [path.join(ROOT, 'tools/bohemia_direction_map_verdict.py'), TMP, out], { encoding: 'utf8' });
  process.stdout.write(r.stdout || ''); process.stderr.write(r.stderr || '');
  process.exit(r.status || 0);
})().catch(e => { console.error(e); process.exit(1); });
