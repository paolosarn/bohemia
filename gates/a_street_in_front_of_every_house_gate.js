#!/usr/bin/env node
/* ============================================================================
   A STREET IN FRONT OF EVERY HOUSE (WORLD THIRTEEN 11/7, VAMILY rules 426(a), 429(d), 423(b); ask lines 492, 505)

   Paolo 11/7: 'each house should be connected by road or mini road... no one wants to be right in the middle of the street';
   'most houses are gonna have a street connecting them... there's never really gonna be a house unless it's a trailer park... if
   there's a house there's a street in front... even on the big map scale'. The fix is in the map's generation (houseLanes,
   engine/bohemia_overmap.js) and its painter (slices/BOHEMIA_CITY_WORLD.html __A_STREET_IN_FRONT_OF_EVERY_HOUSE__), once, so the
   fight, cut from the map, has the same street between the same houses.

   NODE (22 seeds, no browser; 429(f): 'this has to work when the world gets procedurally generated'):
     N1 every house block (suburb, estate, gated, apartment) carries its own street, a way through it (houseLanes)
     N2 every house block in a lump that touches a mile street is joined to a mile street, street to street (straight on or a T);
        over the whole valley at least 98 in 100 (the rest are pockets out on the desert or the rim no street reaches)
     N3 every pocket's street runs out onto the open land (a dirt track), never sealed in
     N4 the trailer park keeps its own lanes (the one exception): no house street laid through it
     N5 buildOvermap writes the same streets on the tiles (t.lane), so every reader of the valley sees one answer
     N6 PLANTED FAIL: the streets taken away goes red on N1; a joined block's street turned across goes red on N2
   PAGE (the demo on the phone):
     P1 the painter paints it: in the middle of every house block with a street the texel is street; in its rows, houses
     P2 THE FIGHT'S BOARD (the board is cut from these texels, slices/bohemia_street_board.js plan): on boards cut at the valley's
        suburbs every house tile has a street tile beside it (at least 97 in 100; before, with the house streets off, printed)
     P3 every house the map stands on its street faces it (the model's turn is the street's side)
     P4 nothing threw

     node gates/a_street_in_front_of_every_house_gate.js [--node]
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const O = require(path.join(ROOT, 'engine/bohemia_overmap.js'));

let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('A STREET IN FRONT OF EVERY HOUSE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const SEEDS = [1337, 7, 42, 2026, 99, 31337, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 2691674296];   /* 429(f): many seeds, never one map */

/* street to street from every mile street, over the streets' own joins */
function joined(m, LN) {
  const N = m.n, D = (x, y) => { const t = (x < 0 || y < 0 || x >= N || y >= N) ? null : m.at(x, y); return t ? t.district : null; };
  /* __THE_VALLEY_HAS_ITS_ZONES__ (429(g)(h)): a works block's drive is a street too: a house street can join the mile streets through
     one; the walk goes through both, the count is the houses' */
  const H = (x, y) => !!(O.LANE_HOUSES[D(x, y)] || (O.LANE_WORKS && O.LANE_WORKS[D(x, y)])), HO = (x, y) => !!O.LANE_HOUSES[D(x, y)], W = (x, y) => !!O.LANE_WALK[D(x, y)], k = (x, y) => y * N + x;
  const reach = new Uint8Array(N * N), st = [], SIDE = [[0, -1, 16], [1, 0, 32], [0, 1, 64], [-1, 0, 128]];
  const ends = (v) => (v & 3) === 1 ? [[-1, 0, 4], [1, 0, 8]] : [[0, -1, 4], [0, 1, 8]];
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { if (!H(x, y)) continue; const v = LN[k(x, y)];
    if (ends(v).some(([dx, dy, b]) => (v & b) && W(x + dx, y + dy))) { reach[k(x, y)] = 1; st.push([x, y]); } }
  while (st.length) { const [x, y] = st.pop(), v = LN[k(x, y)];
    for (const [dx, dy, b] of SIDE) { const nx = x + dx, ny = y + dy; if (!H(nx, ny) || reach[k(nx, ny)]) continue; const w = LN[k(nx, ny)];
      const mine = ends(v).find(e => e[0] === dx && e[1] === dy), theirs = ends(w).find(e => e[0] === -dx && e[1] === -dy);
      const through = (mine && (v & mine[2]) && ((w & 3) === (v & 3) || (w & SIDE.find(s => s[0] === -dx && s[1] === -dy)[2])))
        || (theirs && (w & theirs[2]) && ((w & 3) === (v & 3) || (v & b)));
      if (through) { reach[k(nx, ny)] = 1; st.push([nx, ny]); } } }
  /* the lumps that touch a mile street */
  const comp = new Int32Array(N * N).fill(-1), road = []; let id = 0;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { if (!H(x, y) || comp[k(x, y)] >= 0) continue; const s2 = [[x, y]]; comp[k(x, y)] = id; let r = false;
    while (s2.length) { const [cx, cy] = s2.pop(); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = cx + dx, ny = cy + dy; if (W(nx, ny)) r = true; if (H(nx, ny) && comp[k(nx, ny)] < 0) { comp[k(nx, ny)] = id; s2.push([nx, ny]); } } }
    road.push(r); id++; }
  let n = 0, r = 0, lumpMiss = 0, pockets = 0, sealed = 0, noWay = 0;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { if (!HO(x, y)) continue; n++; const v = LN[k(x, y)]; if (!(v & 3)) noWay++;
    if (reach[k(x, y)]) r++; else if (road[comp[k(x, y)]]) lumpMiss++; else { pockets++; if (!(v & 12) && !(v & 240)) sealed++; } }
  return { n, r, lumpMiss, pockets, sealed, noWay };
}

(async () => {
  const R = SEEDS.map(seed => { const m = O.buildOvermap(seed), LN = O.houseLanes(m); return { seed, m, LN, j: joined(m, LN) }; });
  ok('N1 every house block carries its own street (' + R.reduce((a, x) => a + x.j.n, 0) + ' blocks on ' + R.length + ' seeds)', R.every(x => x.j.noWay === 0), 'without one: ' + R.map(x => x.j.noWay).join(', '));
  ok('N2 every house block in a lump on a mile street is joined to it, street to street; the valley at least 98 in 100',
    R.every(x => x.j.lumpMiss === 0 && x.j.r / x.j.n >= 0.98), 'lowest ' + Math.min(...R.map(x => x.j.r / x.j.n * 100)).toFixed(1) + '%, missed in a lump ' + R.reduce((a, x) => a + x.j.lumpMiss, 0));
  ok('N3 every pocket no mile street reaches runs out onto the open land, none sealed in', R.every(x => x.j.sealed === 0), 'pockets ' + R.reduce((a, x) => a + x.j.pockets, 0) + ' blocks; sealed ' + R.reduce((a, x) => a + x.j.sealed, 0));
  ok('N4 the trailer park keeps its own lanes: no house street through it', R.every(x => { const N = x.m.n; for (let i = 0; i < N * N; i++) { const t = x.m.at(i % N, (i / N) | 0); if (t && t.district === 'trailer' && x.LN[i]) return false; } return true; }));
  ok('N5 buildOvermap writes the same streets on the tiles (t.lane)', R.every(x => x.m.tiles.every(t => (t.lane | 0) === x.LN[t.y * x.m.n + t.x])));
  const P1 = new Uint8Array(R[0].LN.length), P2 = Uint8Array.from(R[0].LN);
  let flipped = 0; for (let i = 0; i < P2.length && flipped < 400; i++) if (P2[i] & 3) { P2[i] = (P2[i] & ~3) | ((P2[i] & 3) === 1 ? 2 : 1); flipped++; }
  const a = joined(R[0].m, P1), b = joined(R[0].m, P2);
  ok('N6 PLANTED FAIL: the streets taken away goes red on N1 (' + a.noWay + ' blocks without one); 400 streets turned across goes red on N2 (' + b.lumpMiss + ' missed in a lump)', a.noWay > 0 && b.lumpMiss > 0);
  if (process.argv.includes('--node')) return done();

  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  let d; const errs = [];
  try { d = await open({ keepCards: true }); } catch (e) { ok('the demo boots on the phone [' + String(e.message).slice(0, 120) + ']', false); return done(); }
  d.page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  try {
    const fr = d.fr;
    for (let i = 0; i < 160; i++) { if (await fr.evaluate(() => !!(window.BohemiaStreetBoard && BohemiaStreetBoard.ready() && window.VB_LANES && window.BohemiaMapHouses))) break; await d.page.waitForTimeout(400); }
    const P = await fr.evaluate(() => {
      const out = {}, N = om.n, LV = vbLanesValley();
      /* P1: the painter's own texels, the whole valley at its own size */
      const inp = vbCityInput(); inp.coli = true; const c = vbCityCore(inp), S = inp.S, PAD = inp.PAD, Pw = (N + 2 * PAD) * S, Q = Math.max(1, Math.round(S / 12));
      let mid = 0, midN = 0, rowH = 0, rowN = 0;
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const v = LV && LV[y * N + x]; if (!(v & 3) || inp.cls[y * N + x] !== VB_CLASS.houses) continue;
        const ew = (v & 3) === 1, at = (al, ac) => { const u = (x + PAD) * S + Math.floor((ew ? al : ac) * Q), w = (y + PAD) * S + Math.floor((ew ? ac : al) * Q); return (c.coli[w * Pw + u] >> 4) & 31; };
        if (window.__WS_CELL && window.__WS_CELL[y * N + x]) continue;
        midN++; if (at(6, 6) === VB_CLASS.road) mid++;
        rowN++; if (at(0.5, 1.5) === VB_CLASS.houses && at(11.5, 10.5) === VB_CLASS.houses) rowH++; }
      out.p1 = { mid, midN, rowH, rowN };
      /* P2: boards cut at the valley's suburbs, before (the streets off) and now */
      const spots = []; for (let y = 4; y < N - 4 && spots.length < 400; y += 3) for (let x = 4; x < N - 4; x += 3) { const t = om.at(x, y); if (t && /^(suburb|estate|gated)$/.test(t.district)) spots.push([x, y]); }
      const pick = []; for (let i = 0; i < spots.length && pick.length < 14; i += Math.max(1, Math.floor(spots.length / 14))) pick.push(spots[i]);
      const STR = { road: 1, walk: 1 };
      const board = () => { let h = 0, s = 0; pick.forEach(([x, y]) => { const p = BohemiaStreetBoard.plan({ gx: x, gy: y }, 15, 15, 0); if (!p || p.err) return;
        p.houses.forEach(hh => { if (hh.kind !== 'house') return; h++; const i = hh.y * p.AW + hh.x;
          if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => { const xx = hh.x + dx, yy = hh.y + dy; return xx >= 0 && yy >= 0 && xx < p.AW && yy < p.AH && STR[p.kind[yy * p.AW + xx]]; })) s++; }); });
        return { h, s }; };
      const was = VB_LANES.on; VB_LANES.on = false; VB_LANES.key = null; out.before = board(); VB_LANES.on = was; VB_LANES.key = null; out.after = board(); out.spots = pick.length;
      /* P3: the lots the painter lays on its streets, and the turn the model is given */
      const ti = vbCityInput(); ti.lots = true; const L = vbCityCore(ti).lots || []; let n3 = 0, f3 = 0;
      for (let j = 0; j + 9 < L.length; j += 10) { if (L[j] !== 0 || L[j + 9] < 32) continue; n3++; const face = ((L[j + 9] - 32) >> 3) & 3, key = BohemiaMapHouses.pick(0, L[j + 7], L[j + 8], L[j + 9]), turn = +key.slice(key.lastIndexOf('_') + 1);
        if (turn === [0, 180, 90, 270][face] && (face < 2) === (L[j + 7] === 1)) f3++; }
      out.p3 = { n3, f3 };
      return out;
    });
    ok('P1 the painter paints it: the middle of ' + P.p1.mid + ' of ' + P.p1.midN + ' house blocks with a street is street; ' + P.p1.rowH + ' of ' + P.p1.rowN + ' have houses in both rows',
      P.p1.midN > 1000 && P.p1.mid / P.p1.midN >= 0.98 && P.p1.rowH / P.p1.rowN >= 0.9);
    const sb = P.before.h ? P.before.s / P.before.h : 0, sa = P.after.h ? P.after.s / P.after.h : 0;
    ok('P2 THE FIGHT\'S BOARD: on ' + P.spots + ' boards cut at the suburbs ' + P.after.s + ' of ' + P.after.h + ' house tiles (' + Math.round(sa * 100) + '%) have a street tile beside them (before, the house streets off: ' + P.before.s + ' of ' + P.before.h + ', ' + Math.round(sb * 100) + '%)',
      P.after.h > 100 && sa >= 0.97);
    ok('P3 every house on its street faces it (' + P.p3.f3 + ' of ' + P.p3.n3 + ' models turned to their street\'s side)', P.p3.n3 > 500 && P.p3.f3 === P.p3.n3);
  } catch (e) { ok('the page legs ran [' + String(e && e.message).slice(0, 200) + ']', false); }
  ok('P4 nothing threw', errs.length === 0, errs.slice(0, 3).join(' | '));
  try { await d.close(); } catch (_e) {}
  done();
})();
