#!/usr/bin/env node
/* BOHEMIA -- RUN [the demo wears the rig] (rule 115g, 10/18): the picture for the VOTE tab.
   The demo's own map, the clock run on six hours so the parties are out on the road, the camera on four of them
   in turn at the closer zoom: BEFORE (the street's generic cast under the gang's flag) and AFTER (the gang's own
   rig model, __THE_GANGS_WEAR_THE_RIG__), side by side at 2x.
     node tools/bohemia_run_the_gangs_wear_the_rig_shot.js   -> slices/vote/RUN_THE_GANGS_WEAR_THE_RIG_10_18.png */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUT = path.join(ROOT, 'slices/vote/RUN_THE_GANGS_WEAR_THE_RIG_10_18.png');

(async () => {
  process.chdir(ROOT);
  const d = await D.open({});
  const fr = d.fr;
  await fr.evaluate(() => { for (let k = 0; k < 12; k++) partiesAdvance(30); render(); });
  await d.page.waitForTimeout(3000);
  /* one party per gang, the gangs that walk first */
  const pick = await fr.evaluate(() => {
    const out = [], seen = {}, pa = partiesAll();
    const want = ['Reds', 'Cartel', 'Anarchists', 'Trades', 'Blues', 'Church', 'Mob', 'Remnants', 'Network', 'Colorful'];
    for (const f of want) for (let i = 0; i < pa.length; i++) { const q = pa[i];
      if (q && q.at && q.from && q.from.faction === f && !seen[f] && Math.max(Math.abs(q.at.x - q.from.x), Math.abs(q.at.y - q.from.y)) >= 2) { seen[f] = 1; out.push(i); } }
    return out.slice(0, 4);
  });
  const rows = [];
  for (const i of pick) {
    const pair = [];
    for (const off of [1, 0]) {
      const at = await fr.evaluate(([i, off]) => {
        window.__RIG_CAST_OFF = !!off;
        try { moversAdvance = function(){}; } catch (_e) {}
        const q = partiesAll()[i];
        CZOOM = 2.4; TW = TW0 * CZOOM; TH = TH0 * CZOOM;
        panX = -((q.at.x - city.x) - (q.at.y - city.y)) * TW / 2; panY = -((q.at.x - city.x) + (q.at.y - city.y)) * TH / 2;
        render();
        const r = document.getElementById('cv').getBoundingClientRect();
        return { x: r.left + CVW / 2, y: r.top + CVH / 2, f: q.from.faction };
      }, [i, off]);
      await d.page.waitForTimeout(500);
      pair.push((await d.page.screenshot({ clip: { x: Math.max(0, at.x - 60), y: Math.max(0, at.y - 80), width: 120, height: 110 } })).toString('base64'));
      if (!off) pair.unshift(at.f.toUpperCase());
    }
    rows.push(pair);
    console.log(pair[0]);
  }
  const sheet = await d.page.evaluate(async (rows) => {
    const load = (s) => new Promise(res => { const i = new Image(); i.onload = () => res(i); i.src = 'data:image/png;base64,' + s; });
    const L = []; for (const r of rows) L.push([r[0], await load(r[1]), await load(r[2])]);
    const w = L[0][1].width, h = L[0][1].height, c = document.createElement('canvas');
    c.width = w * 2 + 30; c.height = L.length * (h + 50) + 10;
    const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
    g.fillStyle = '#14110d'; g.fillRect(0, 0, c.width, c.height);
    let y = 10;
    for (const [lab, b, a] of L) {
      g.fillStyle = '#e8dcc0'; g.font = 'bold 24px monospace';
      g.fillText(lab + ': BEFORE', 6, y + 26); g.fillText('AFTER, THE RIG', w + 24, y + 26);
      g.drawImage(b, 6, y + 36); g.drawImage(a, w + 24, y + 36);
      y += h + 50;
    }
    return c.toDataURL('image/png').split(',')[1];
  }, rows);
  fs.writeFileSync(OUT, Buffer.from(sheet, 'base64'));
  console.log('-> ' + path.relative(ROOT, OUT));
  await d.close();
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
