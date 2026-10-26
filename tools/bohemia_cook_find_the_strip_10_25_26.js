#!/usr/bin/env node
/* COOK [the Strip close in] (10/25/26), line 64 of records/BOHEMIA_EVERYTHING_HE_ASKED_10_24_26.md (EYES 10/25: 'the freeway reads
   as a freeway close in; the Strip NOT LOOKED AT'). Where the Strip runs on the map he plays: every block the overmap names
   'strip' (the boulevard, VB_CLASS.blvd) and the casinos, resorts and towers beside it, from the demo itself (the one driver),
   so the look tool can put the camera on it: node tools/bohemia_cook_the_town_is_painted_in_10_25_26.js <label> 'x,y;x,y'.
     node tools/bohemia_cook_find_the_strip_10_25_26.js   -> prints the Strip's blocks north to south and three to look at */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
(async () => {
  const d = await D.open({});
  try {
    for (let i = 0; i < 120; i++) {
      const ok = await d.fr.evaluate(() => { try { return !!(typeof om !== 'undefined' && om.at && typeof VB !== 'undefined' && VB && VB.day); } catch (e) { return false; } });
      if (ok) break; await d.page.waitForTimeout(500);
    }
    const r = await d.fr.evaluate(() => {
      const N = 96, strip = [], casino = [];
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const c = om.at(x, y); if (!c) continue;
        if (c.district === 'strip') strip.push([x, y]);
        if (/^(resort|casino|luxor|sphere)$/.test(c.district)) casino.push([x, y]); }
      return { strip, casino };
    });
    r.strip.sort((a, b) => a[1] - b[1] || a[0] - b[0]);
    const near = p => r.casino.filter(q => Math.abs(q[0] - p[0]) + Math.abs(q[1] - p[1]) <= 2).length;
    const pick = r.strip.map(p => [p, near(p)]).sort((a, b) => b[1] - a[1]);
    console.log('strip blocks', r.strip.length, 'casino blocks', r.casino.length);
    console.log('strip:', r.strip.map(p => p.join(',')).join(' '));
    const three = [pick[0], pick[Math.floor(pick.length / 3)], pick[Math.floor(pick.length * 2 / 3)]].filter(Boolean).map(q => q[0].join(','));
    console.log('LOOK AT:', three.join(';'));
  } finally { await d.close(); }
})().catch(e => { console.error(e); process.exit(1); });
