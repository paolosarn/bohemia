#!/usr/bin/env node
/* THE PEOPLE A LITTLE SMALLER (COMBAT [the people a little smaller], his YES on the marks on the board, 10/18: 'can the
   characters just be a little smaller'). Measures the man against the house tile on the REAL fight on his phone's profile
   (390 x 844 at 3x) and writes slices/vote/COMBAT_THE_PEOPLE_A_LITTLE_SMALLER_10_19.jpg: the same board, the same seed, the
   same moment, at three sizes (104, the old; 92, the new default; 84, a step past it), at the open (both teams) and close
   in (the idle stop), from the game's own camera. The marks are kept. Run:
   node tools/bohemia_combat_the_people_a_little_smaller_10_19_26.js */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { open } = require('./bohemia_drive_the_demo.js');
const ROOT = path.resolve(__dirname, '..');
const OUT_JPG = path.join(ROOT, 'slices/vote/COMBAT_THE_PEOPLE_A_LITTLE_SMALLER_10_19.jpg');
const SCRATCH = process.env.BOHEMIA_SCRATCH || path.join(require('os').tmpdir(), 'bohemia_smaller');
const SIZES = [104, 92, 84];

(async () => {
  fs.mkdirSync(SCRATCH, { recursive: true });
  const rows = [];
  for (const px of SIZES) {
    const opts = { seed: 4, speed: 1, kind: 'suburb', deploy: false, formation: null, manPx: px, party: { count: 4, days: 1, difficulty: 1, faction: 'brigands' } };
    const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS=' + JSON.stringify(opts) });
    const p = d.page;
    try {
      await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil && !FIGHT_UI.glide, null, { timeout: 40000 });
      await p.waitForTimeout(500);
      const m = await p.evaluate(() => ({ man: manH(), tile: FIGHT_UI.th * FIGHT_UI.zoom, tileW: FIGHT_UI.tw * FIGHT_UI.zoom, zoom: FIGHT_UI.zoom }));
      const open1 = path.join(SCRATCH, 'open_' + px + '.png'); await p.screenshot({ path: open1 });
      /* close in: the idle stop, on his first man */
      await p.evaluate(() => { const u = FIGHT.alive('you')[0]; FIGHT_UI.glide = null; FIGHT_UI.zoom = FIGHT_UI.near; FIGHT_UI.cx = (u.x + 1.5) * FIGHT_UI.tw; FIGHT_UI.cy = (u.y + .3) * FIGHT_UI.th; });
      await p.waitForTimeout(400);
      const near = await p.evaluate(() => ({ man: manH(), tile: FIGHT_UI.th * FIGHT_UI.zoom }));
      const close1 = path.join(SCRATCH, 'close_' + px + '.png'); await p.screenshot({ path: close1 });
      rows.push({ px, open: open1, close: close1, m, near });
      console.log('   ' + px + ' px: at the open a house tile is ' + m.tile.toFixed(0) + ' px tall, the man ' + (m.man / m.tile).toFixed(2) + ' tiles; close in the tile ' + near.tile.toFixed(0) + ' px, the man ' + (near.man / near.tile).toFixed(2));
      if (d.errs && d.errs.length) console.log('  PAGE ERRORS: ' + d.errs.slice(0, 2).join(' | '));
    } finally { await d.close(); }
  }
  const spec = path.join(SCRATCH, 'sheet.json');
  fs.writeFileSync(spec, JSON.stringify({ rows, out: OUT_JPG }));
  execFileSync('python3', [path.join(__dirname, 'bohemia_combat_the_people_a_little_smaller_sheet_10_19_26.py'), spec], { stdio: 'inherit' });
  console.log('  wrote ' + path.relative(ROOT, OUT_JPG));
})().catch(e => { console.error(e); process.exit(1); });
