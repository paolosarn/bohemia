/* BOHEMIA LOT LATTICE PROBE -- does the step-is-a-lot lattice keep the world whole?
   LIFE + CITY, 9/15/26, [lot lattice], under PAOLO 9/15 rule 16 THE STEP IS A HOUSE.

   WHY IT EXISTS. Rule 16 coarsens the movement lattice from one fine cell to one lot.
   The only question that matters is whether a body can still get everywhere it could
   get before. That cannot be answered by reading code: it is a property of the ground
   the generator actually makes, in the district he is actually standing in. So this
   walks the DEMO'S OWN DOOR with the one driver (rule 14g) and asks the game's own
   walkability test, cellAt(x,y).walk, about every fine cell in a window.

   WHAT IT REPORTS, and the second number is the one that decides:
     fine island  -- biggest 8-connected island of WALKABLE FINE CELLS, today's lattice
     lot  island  -- biggest island of LOTS under the new lattice, where a step from lot
                     A to lot B counts only if a body can walk between their landings
                     WITHOUT LEAVING THE TWO LOTS
   If the lot number tracks the fine number, coarsening costs nothing and the lattice is
   honest. If it falls far below it, the lattice is cutting the world up and the answer
   is a different lot size or a different landing rule, not a shipped step.

   VERIFY ON THE REAL SURFACE: this is that verification. Re-run it after any change to
   walkability, to the district generators, or to LOT_FINE.

     node tools/bohemia_lot_lattice_probe.js                # the door + 4 districts
     node tools/bohemia_lot_lattice_probe.js --all          # every district it can find
     node tools/bohemia_lot_lattice_probe.js --json out.json

   The lattice itself is engine/bohemia_lattice.js. Its rules are RE-STATED here in the
   page, not imported, ON PURPOSE: a probe that runs the code it is checking agrees with
   it by construction. This one walks the ground independently and can disagree.
   Gate: gates/lot_lattice_gate.js (the fast checks; this is the slow real surface). */
const { open } = require('./bohemia_drive_the_demo.js');
const fs = require('fs');

const ALL = process.argv.includes('--all');
const JSONI = process.argv.indexOf('--json');
const LOT_FINE = require('../engine/bohemia_lattice.js').LOT_FINE;

(async () => {
  const d = await open();
  const rows = await d.fr.evaluate(async (args) => {
    const L = args.L, ALL = args.ALL;
    const P = window.__proof; if (!P) return { err: 'the walked city exposes no __proof' };
    const FN = P.FN, om = P.om, p0 = P.getPos();
    const t0x = Math.floor(p0.hx / FN), t0y = Math.floor(p0.hy / FN), here = om.at(t0x, t0y);
    const want = ALL ? ['suburb', 'downtown', 'commercial', 'industrial', 'gated', 'strip',
                        'park', 'town', 'apartment', 'trailer', 'campus', 'medical']
                     : ['suburb', 'downtown', 'commercial', 'gated'];
    const spots = [{ name: 'THE DOOR (' + (here ? here.district : '?') + ')', hx: p0.hx, hy: p0.hy }];
    for (const w of want) {
      let f = null;
      for (let r = 1; r < 30 && !f; r++) for (let dy = -r; dy <= r && !f; dy++) for (let dx = -r; dx <= r && !f; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        const t = om.at(t0x + dx, t0y + dy); if (t && t.district === w) f = [t0x + dx, t0y + dy];
      }
      if (f) spots.push({ name: w, hx: f[0] * FN + (FN >> 1), hy: f[1] * FN + (FN >> 1) });
    }

    const W = L * 16, n = 16, out = [];
    for (const s of spots) {
      const x0 = s.hx - (W >> 1), y0 = s.hy - (W >> 1);
      const walk = new Uint8Array(W * W), road = new Uint8Array(W * W);
      for (let j = 0; j < W; j++) for (let i = 0; i < W; i++) {
        let c = null; try { c = P.cellAt(x0 + i, y0 + j); } catch (e) {}
        walk[j * W + i] = (c && c.walk) ? 1 : 0;
        road[j * W + i] = (c && (c.markPool || c.gArtPool === 'street')) ? 1 : 0;
      }
      /* today's lattice: every walkable fine cell is a place a step may land */
      let fineN = 0; for (let k = 0; k < walk.length; k++) fineN += walk[k];
      const fseen = new Uint8Array(W * W); let fineBig = 0;
      for (let s2 = 0; s2 < W * W; s2++) {
        if (!walk[s2] || fseen[s2]) continue;
        const q = [s2]; fseen[s2] = 1; let sz = 0;
        while (q.length) { const v = q.pop(); sz++; const vx = v % W, vy = (v / W) | 0;
          for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { if (!dx && !dy) continue;
            const nx = vx + dx, ny = vy + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= W) continue;
            const w2 = ny * W + nx; if (walk[w2] && !fseen[w2]) { fseen[w2] = 1; q.push(w2); } } }
        if (sz > fineBig) fineBig = sz;
      }
      /* the new lattice: the landing is road, then touching a road, then any walkable,
         nearest the lot centre inside a tier */
      const land = new Int32Array(n * n * 2).fill(-1); let stand = 0;
      for (let ly = 0; ly < n; ly++) for (let lx = 0; lx < n; lx++) {
        const ox = lx * L, oy = ly * L, cx = ox + (L >> 1), cy = oy + (L >> 1);
        const bx = [-1, -1, -1], by = [-1, -1, -1], bd = [1e9, 1e9, 1e9];
        for (let j = 0; j < L; j++) for (let i = 0; i < L; i++) {
          const gx = ox + i, gy = oy + j, k = gy * W + gx; if (!walk[k]) continue;
          let tier = 2;
          if (road[k]) tier = 0;
          else for (let e = 0; e < 4; e++) {
            const ax = gx + [1, -1, 0, 0][e], ay = gy + [0, 0, 1, -1][e];
            if (ax < 0 || ay < 0 || ax >= W || ay >= W) continue;
            if (walk[ay * W + ax] && road[ay * W + ax]) { tier = 1; break; }
          }
          const dd = (gx - cx) * (gx - cx) + (gy - cy) * (gy - cy);
          if (dd < bd[tier]) { bd[tier] = dd; bx[tier] = gx; by[tier] = gy; }
        }
        const t = bx[0] >= 0 ? 0 : bx[1] >= 0 ? 1 : bx[2] >= 0 ? 2 : -1;
        land[(ly * n + lx) * 2] = t < 0 ? -1 : bx[t];
        land[(ly * n + lx) * 2 + 1] = t < 0 ? -1 : by[t];
        if (t >= 0) stand++;
      }
      const adj = []; for (let i = 0; i < n * n; i++) adj.push([]);
      let edges = 0;
      for (let ly = 0; ly < n; ly++) for (let lx = 0; lx < n; lx++) {
        const a = ly * n + lx, ax = land[a * 2], ay = land[a * 2 + 1]; if (ax < 0) continue;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue;
          const mx = lx + dx, my = ly + dy; if (mx < 0 || my < 0 || mx >= n || my >= n) continue;
          const b = my * n + mx, bx2 = land[b * 2], by2 = land[b * 2 + 1]; if (bx2 < 0) continue;
          const lox = Math.min(lx, mx) * L, loy = Math.min(ly, my) * L;
          const hix = (Math.max(lx, mx) + 1) * L - 1, hiy = (Math.max(ly, my) + 1) * L - 1;
          const seen = {}, q = [[ax, ay]]; seen[ax + ',' + ay] = 1; let ok = false;
          while (q.length && !ok) {
            const v = q.pop(); if (v[0] === bx2 && v[1] === by2) { ok = true; break; }
            for (let e = -1; e <= 1; e++) for (let f2 = -1; f2 <= 1; f2++) {
              if (!e && !f2) continue;
              const nx = v[0] + f2, ny = v[1] + e;
              if (nx < lox || ny < loy || nx > hix || ny > hiy) continue;
              if (!walk[ny * W + nx]) continue;
              const k = nx + ',' + ny; if (seen[k]) continue; seen[k] = 1; q.push([nx, ny]);
            }
          }
          if (ok) { edges++; adj[a].push(b); }
        }
      }
      const lseen = new Uint8Array(n * n); let lotBig = 0;
      for (let s3 = 0; s3 < n * n; s3++) {
        if (land[s3 * 2] < 0 || lseen[s3]) continue;
        const q = [s3]; lseen[s3] = 1; let sz = 0;
        while (q.length) { const v = q.pop(); sz++; for (const w3 of adj[v]) if (!lseen[w3]) { lseen[w3] = 1; q.push(w3); } }
        if (sz > lotBig) lotBig = sz;
      }
      out.push({ spot: s.name, windowM: +(W * 0.75).toFixed(0),
        fineWalkPct: +(100 * fineN / (W * W)).toFixed(1),
        fineIslandPct: +(100 * fineBig / (W * W)).toFixed(1),
        lotStandPct: +(100 * stand / (n * n)).toFixed(1),
        lotIslandPct: +(100 * lotBig / (n * n)).toFixed(1),
        waysOut: +(edges / Math.max(1, stand)).toFixed(2) });
    }
    return out;
  }, { L: LOT_FINE, ALL });

  if (rows.err) { console.log('FAILED: ' + rows.err); process.exit(1); }
  console.log('LOT_FINE = ' + LOT_FINE + ' fine cells = ' + (LOT_FINE * 0.75) + ' m a step.');
  console.log('Window ' + rows[0].windowM + ' m square, 16x16 lots, driven from the demo\'s door.\n');
  console.log('  where              fine walk   fine island   lots standable   LOT ISLAND   ways out');
  for (const r of rows)
    console.log('  ' + r.spot.padEnd(18) + String(r.fineWalkPct).padStart(6) + '%' +
      String(r.fineIslandPct).padStart(12) + '%' + String(r.lotStandPct).padStart(15) + '%' +
      String(r.lotIslandPct).padStart(13) + '%' + String(r.waysOut).padStart(10));
  console.log('\n  THE READ: lot island should track fine island. Where it does, coarsening the');
  console.log('  step costs nothing. Where fine island is already low, the ground is cut up');
  console.log('  today and the lattice is not the thing that broke it.');
  console.log('\npage errors: ' + (d.errs.length ? d.errs[0] : 'none'));
  if (JSONI > 0 && process.argv[JSONI + 1]) {
    fs.writeFileSync(process.argv[JSONI + 1], JSON.stringify({ LOT_FINE, rows }, null, 1));
    console.log('wrote ' + process.argv[JSONI + 1]);
  }
  await d.close();
})().catch(e => { console.log('FAILED: ' + e.message); process.exit(1); });
