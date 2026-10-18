/* ==========================================================================
   THE ONE RULER  (WORLD, 10/18/26; the coordinator's ask: COMBAT TWO read a
   map block as 230 m, WORLD's region says 384 m; settle which is true)

   Opens the demo the way a player does (tools/bohemia_drive_the_demo.js) and
   reads the map's OWN fine grid (cellAt, the 128 x 128 a block the realizer
   paints) across many blocks of the game's seed, to measure what the drawing
   inside a block is the size of:
     - an arterial's cross-section: every lane (asphalt between two paint
       lines), the median, the sidewalk, kerb to kerb;
     - every house roof on a suburb block: its two sides;
     - the commercial blocks' roofs, for the record.
   Every number is in FINE CELLS. The gate (gates/the_one_ruler_gate.js) reads
   them at the engine's CELL_M and against real Las Vegas sizes.

   Writes records/BOHEMIA_WORLD_THE_ONE_RULER_MEASURED_10_18_26.json, with the
   seed and a fingerprint of the functions that paint the cells (in the CITY
   frame the demo opens, slices/BOHEMIA_CITY_WORLD.html), so the gate can say
   when the measurement is older than the painter.

     node tools/bohemia_world_the_one_ruler_10_18_26.js      (about a minute)
   ========================================================================== */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'records/BOHEMIA_WORLD_THE_ONE_RULER_MEASURED_10_18_26.json');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const PAINTER = require(path.join(ROOT, 'gates/the_one_ruler_gate.js')).painterPrint;

const SAMPLE = { arterial: 24, suburb: 30, commercial: 12 };

(async () => {
  const d = await drive.open({ keepCards: true, world: 1 });
  const fr = d.fr;
  for (let i = 0; i < 160; i++) {
    if (await fr.evaluate(() => typeof cellAt === 'function' && typeof om !== 'undefined' && om && om.n > 0)) break;
    await d.page.waitForTimeout(250);
  }
  await d.page.waitForTimeout(2000);
  const res = await fr.evaluate((SAMPLE) => {
    const D = (x, y) => { const t = om.at(x, y); return t ? t.district : null; };
    const tag = c => !c ? 'null'
      : (c.markPool === 'lane' ? 'paint'
      : c.gArtPool === 'street' ? 'asphalt'
      : c.gArtPool === 'side' ? 'side'
      : c.artPool === 'hroof' ? 'roof'
      : 'other');
    /* blocks spread over the whole valley: every k-th of each kind, in reading order */
    const pick = { arterial: [], suburb: [], commercial: [] };
    for (let y = 2; y < om.n - 2; y++) for (let x = 2; x < om.n - 2; x++) {
      const k = D(x, y);
      if (k === 'arterial') {
        const ew = D(x - 1, y) === 'arterial' && D(x + 1, y) === 'arterial' && D(x, y - 1) !== 'arterial' && D(x, y + 1) !== 'arterial';
        const ns = D(x, y - 1) === 'arterial' && D(x, y + 1) === 'arterial' && D(x - 1, y) !== 'arterial' && D(x + 1, y) !== 'arterial';
        if (ew || ns) pick.arterial.push([x, y, ew ? 'EW' : 'NS']);
      } else if (k === 'suburb') {
        let s = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (D(x + dx, y + dy) === 'suburb') s++;
        if (s >= 7) pick.suburb.push([x, y]);
      } else if (k === 'commercial') pick.commercial.push([x, y]);
    }
    const every = (a, n) => { const out = [], st = Math.max(1, Math.floor(a.length / n)); for (let i = 0; i < a.length && out.length < n; i += st) out.push(a[i]); return out; };
    const out = { seed: om.seed, FN: FN, of: {}, arterial: [], suburb: [], commercial: [] };
    for (const k in pick) out.of[k] = pick[k].length;

    /* an arterial: three cuts across the band (a quarter, the middle, three quarters) */
    for (const [bx, by, ax] of every(pick.arterial, SAMPLE.arterial)) {
      for (const f of [32, 64, 96]) {
        const seq = [];
        for (let i = 0; i < FN; i++) {
          const gx = ax === 'EW' ? bx * FN + f : bx * FN + i, gy = ax === 'EW' ? by * FN + i : by * FN + f;
          const t = tag(cellAt(gx, gy));
          if (seq.length && seq[seq.length - 1][0] === t) seq[seq.length - 1][1]++; else seq.push([t, 1]);
        }
        out.arterial.push({ x: bx, y: by, axis: ax, at: f, seq });
      }
    }
    /* roofs: 4-connected components of roof cells inside the block */
    const roofs = (bx, by) => {
      const seen = new Uint8Array(FN * FN), isR = new Uint8Array(FN * FN), list = [];
      for (let y = 0; y < FN; y++) for (let x = 0; x < FN; x++) isR[y * FN + x] = tag(cellAt(bx * FN + x, by * FN + y)) === 'roof' ? 1 : 0;
      for (let i = 0; i < FN * FN; i++) {
        if (!isR[i] || seen[i]) continue;
        const st = [i]; seen[i] = 1; let x0 = 1e9, x1 = -1, y0 = 1e9, y1 = -1, n = 0;
        while (st.length) {
          const j = st.pop(), jx = j % FN, jy = (j / FN) | 0; n++;
          if (jx < x0) x0 = jx; if (jx > x1) x1 = jx; if (jy < y0) y0 = jy; if (jy > y1) y1 = jy;
          for (const [nx, ny] of [[jx + 1, jy], [jx - 1, jy], [jx, jy + 1], [jx, jy - 1]]) {
            if (nx < 0 || ny < 0 || nx >= FN || ny >= FN) continue;
            const k = ny * FN + nx; if (isR[k] && !seen[k]) { seen[k] = 1; st.push(k); }
          }
        }
        if (n >= 8) list.push([x1 - x0 + 1, y1 - y0 + 1, n]);
      }
      return list;
    };
    for (const [bx, by] of every(pick.suburb, SAMPLE.suburb)) out.suburb.push({ x: bx, y: by, roofs: roofs(bx, by) });
    for (const [bx, by] of every(pick.commercial, SAMPLE.commercial)) out.commercial.push({ x: bx, y: by, roofs: roofs(bx, by) });
    return out;
  }, SAMPLE);
  await d.close();

  const doc = {
    lane: 'WORLD', row: '[the one ruler] (the coordinator, 10/18: COMBAT TWO 230 m against WORLD 384 m)',
    source: 'tools/bohemia_world_the_one_ruler_10_18_26.js on slices/BOHEMIA_DEMO.html (cellAt, the map\'s own fine grid)',
    units: 'fine cells; the gate reads them at engine/bohemia_overmap.js CELL_M',
    seed: res.seed, FN: res.FN, painter: PAINTER(), sampled: SAMPLE, of: res.of,
    arterial: res.arterial, suburb: res.suburb, commercial: res.commercial
  };
  fs.writeFileSync(OUT, JSON.stringify(doc) + '\n');
  console.log('wrote', path.relative(ROOT, OUT), 'seed', res.seed, 'arterial cuts', res.arterial.length,
    'suburb blocks', res.suburb.length, 'roofs', res.suburb.reduce((a, b) => a + b.roofs.length, 0));
})().catch(e => { console.error(e); process.exit(1); });
