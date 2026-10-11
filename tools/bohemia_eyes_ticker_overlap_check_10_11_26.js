#!/usr/bin/env node
/* BOHEMIA -- EYES AND EARS [eyes: ticker overlap], ROUND ONE PREMISE CHECK. 10/11/26.
 *
 * The row's own text blamed the alpha's old COMBAT_B64/BohemiaArena blob for a flavour-text band
 * (board/ladder names like "THE MARQUEE", "THE ROAD") drawing four lines stacked unreadable at the
 * top of the fight. That old sealed fight was retired from the demo this session ([one fight]
 * SHIPPED 10/9 aaf6ee2). This checks whether the premise is stale: does the CURRENT rebuilt fight
 * (slices/BOHEMIA_FIGHT.html) draw any such band at all.
 *
 * REUSE-FIRST: the open pattern (D.open bare, file BOHEMIA_FIGHT.html, window.FIGHT_OPTS) is
 * DIRECTION's own, proven in tools/bohemia_direction_fight_verdict_23.js -- reused verbatim, not
 * reinvented.
 *
 * Out: records/eyes_ticker_overlap/*.png
 */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUTDIR = path.join(ROOT, 'records', 'eyes_ticker_overlap');

(async () => {
  fs.mkdirSync(OUTDIR, { recursive: true });
  for (const board of ['suburb', 'freeway', 'strip']) {
    const d = await open({ bare: true, file: 'BOHEMIA_FIGHT.html', arm: `window.FIGHT_OPTS={board:'${board}',seed:1};` });
    const p = d.page;
    await p.waitForTimeout(9000);
    await p.screenshot({ path: path.join(OUTDIR, board + '_open.png') });
    // the exact top-of-board strip where the row says the old ticker drew its four lines
    const el = await p.$('canvas');
    if (el) {
      const box = await el.boundingBox();
      if (box) {
        await p.screenshot({
          path: path.join(OUTDIR, board + '_top.png'),
          clip: { x: box.x, y: box.y, width: box.width, height: Math.min(200, box.height) },
        });
      }
    }
    // a real text-element sweep for any top-of-screen label: did ANY DOM or canvas overlay draw
    // a board/location name band at all, by checking for text content near the top of the viewport
    const topText = await p.evaluate(() => {
      const out = [];
      document.querySelectorAll('*').forEach((e) => {
        const r = e.getBoundingClientRect();
        if (r.top >= 0 && r.top < 100 && r.width > 10 && r.height > 5 && e.children.length === 0) {
          const t = (e.textContent || '').trim();
          if (t) out.push({ tag: e.tagName, text: t.slice(0, 60), top: r.top, left: r.left });
        }
      });
      return out;
    });
    console.log('  [' + board + '] top-of-screen DOM text nodes: ' + JSON.stringify(topText));
    await d.close();
  }
  console.log('\n  wrote ' + OUTDIR);
})().catch((e) => { console.error('REFUSED: ' + e.stack); process.exit(1); });
