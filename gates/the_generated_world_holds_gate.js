#!/usr/bin/env node
/* ============================================================================
   THE GENERATED WORLD HOLDS (WORLD THIRTEEN 11/14, VAMILY rules 429(f)(g)(h), 447; the coordinator: 'the generated world proven on
   20 and more seeds (every building on one joined road network, the zones laid so not every part of town is a suburb: desert,
   industrial, the Strip, the lake), and the map cells no place stands on handed to COMBAT THREE with their ground and zone')

   NODE (22 generated valleys, engine/bohemia_overmap.js; the network is the mile streets, the Strip, the freeways and every house
   street and works drive the generator lays (houseLanes), joined where they really join: road to road, a street's open end, a T):
     G1 ONE JOINED ROAD NETWORK: on every valley the main network holds at least 99 in 100 of the road blocks; what is off it is
        named: a pocket of house or works streets whose street runs out on a dirt track onto open land, or a Strip stub
     G2 EVERY BUILDING ON IT: on every valley at least 98 in 100 of the building lumps (a lump: the blocks of one kind side by
        side, a compound reached through its own gate) have a block on the main network or touching it, the rest on a pocket's
        street, and at least 99.5 in 100 front a road at all; the ones with none named
     G3 NOT EVERY PART OF TOWN A SUBURB: on every valley the houses at most 30 in 100 of the map, the open desert at least 15, the
        works at least 2.5, the Strip at least 2, the lake and its water at least 0.7 (records/target/bb/land_use.json's zones)
     G4 PLANTED FAIL: the network cut down the middle (G1 red), a building lump with its roads taken (G2 red), the desert built
        over with tract houses (G3 red)
   PAGE (the demo, a phone upright and on its side):
     P1 a fight the map hands over itself on a cell no place stands on carries the map's ground and zone of it to the fight
        (FIGHT_OPTS.ground: kind, zone, ground, board kind, block families, its street), for COMBAT THREE to cut its board there
     P2 nothing threw

     node gates/the_generated_world_holds_gate.js [--node]
   ============================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const O = require(path.join(ROOT, 'engine/bohemia_overmap.js'));
const K = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/map_fight_kinds.json'), 'utf8')).districts;
const LU = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/land_use.json'), 'utf8'));
const ZOF = {}; Object.keys(LU.zones).forEach((z) => LU.zones[z].districts.forEach((d) => { ZOF[d] = z; }));
const ROAD = new Set(['arterial', 'strip', 'freeway', 'beltway', 'interchange']);
const SEEDS = [1337, 7, 42, 2026, 99, 31337, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 2691674296];

let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('THE GENERATED WORLD HOLDS: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

/* the valley's network, its main part, and what is off it; D(x, y) the kind, LN the generator's street byte a block */
function network(N, D, LN) {
  const node = (i) => ROAD.has(D(i % N, (i / N) | 0)) || (LN[i] & 3) !== 0, adj = new Map();
  const link = (i, j) => { (adj.get(i) || adj.set(i, []).get(i)).push(j); (adj.get(j) || adj.set(j, []).get(j)).push(i); };
  for (let i = 0; i < N * N; i++) { if (!node(i)) continue; const x = i % N, y = (i / N) | 0, v = LN[i], d = D(x, y);
    if (ROAD.has(d)) { if (x + 1 < N && ROAD.has(D(x + 1, y))) link(i, i + 1); if (y + 1 < N && ROAD.has(D(x, y + 1))) link(i, i + N); }
    if (v & 3) { const T = (nx, ny) => { if (nx < 0 || ny < 0 || nx >= N || ny >= N) return; const j = ny * N + nx; if (node(j)) link(i, j); };
      if ((v & 3) === 1) { if (v & 4) T(x - 1, y); if (v & 8) T(x + 1, y); } else { if (v & 4) T(x, y - 1); if (v & 8) T(x, y + 1); }
      if (v & 16) T(x, y - 1); if (v & 32) T(x + 1, y); if (v & 64) T(x, y + 1); if (v & 128) T(x - 1, y); } }
  const comp = new Int32Array(N * N).fill(-1), sizes = [];
  for (let i = 0; i < N * N; i++) { if (!node(i) || comp[i] >= 0) continue; const q = [i]; let n = 0; comp[i] = sizes.length;
    while (q.length) { const c = q.pop(); n++; for (const j of (adj.get(c) || [])) if (comp[j] < 0) { comp[j] = sizes.length; q.push(j); } } sizes.push(n); }
  const main = sizes.indexOf(Math.max(...sizes)), total = sizes.reduce((a, b) => a + b, 0);
  /* what is off it: a pocket whose street runs out onto open land (its track), or a Strip stub, or else unexplained */
  const off = { pocket: 0, stub: 0, other: 0, otherKinds: {} };
  sizes.forEach((sz, c) => { if (c === main) return; let lanes = false, land = false, kinds = {};
    for (let i = 0; i < N * N; i++) { if (comp[i] !== c) continue; const x = i % N, y = (i / N) | 0, v = LN[i]; kinds[D(x, y)] = 1;
      if (v & 3) { lanes = true; const ends = (v & 3) === 1 ? [[-1, 0, 4], [1, 0, 8]] : [[0, -1, 4], [0, 1, 8]];
        ends.forEach(([dx, dy, b]) => { if (!(v & b)) return; const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= N || ny >= N) return; if (!node(ny * N + nx) && O.LANE_HOUSES[D(nx, ny)] == null && O.LANE_WORKS[D(nx, ny)] == null) land = true; }); } }
    if (lanes && land) off.pocket += sz; else if (!lanes && Object.keys(kinds).every((k) => k === 'strip')) off.stub += sz; else { off.other += sz; Object.keys(kinds).forEach((k) => { off.otherKinds[k] = 1; }); } });
  return { node, comp, main, mainSize: sizes[main], total, off, parts: sizes.length };
}
function lumps(N, D, LN, net) {
  const seen = new Uint8Array(N * N), miss = {}; let all = 0, on = 0, road = 0;
  for (let i = 0; i < N * N; i++) { const d = D(i % N, (i / N) | 0); if (seen[i] || ROAD.has(d)) continue; const r = K[d]; if (!r || !r.building || r.building === 'none') continue;
    const q = [i], cells = []; seen[i] = 1;
    while (q.length) { const c = q.pop(); cells.push(c); const x = c % N, y = (c / N) | 0;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= N || ny >= N) continue; const j = ny * N + nx; if (!seen[j] && D(nx, ny) === d) { seen[j] = 1; q.push(j); } } }
    all++;
    const good = cells.some((c) => { if ((LN[c] & 3) && net.comp[c] === net.main) return true; const x = c % N, y = (c / N) | 0;
      return [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= N || ny >= N) return false; const j = ny * N + nx; return net.node(j) && net.comp[j] === net.main; }); });
    const any = good || cells.some((c) => { if (LN[c] & 3) return true; const x = c % N, y = (c / N) | 0; return [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => { const nx = x + dx, ny = y + dy; return nx >= 0 && ny >= 0 && nx < N && ny < N && net.node(ny * N + nx); }); });
    if (good) on++; if (any) road++; if (!any) miss[d] = (miss[d] || 0) + 1; }
  return { all, on, road, miss };
}
function shares(N, D) { const z = {}; for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const k = ZOF[D(x, y)] || 'none'; z[k] = (z[k] || 0) + 1; } Object.keys(z).forEach((k) => { z[k] = z[k] / (N * N) * 100; }); return z; }
const ZONES_OK = (z) => (z.suburb || 0) <= 30 && (z.open || 0) >= 15 && (z.industry || 0) >= 2.5 && (z.strip || 0) >= 2 && (z.water || 0) >= 0.7;

(async () => {
  const g1 = [], g2 = [], g3 = [], off = { pocket: 0, stub: 0, other: 0, otherKinds: {} }, missAll = {}; let lo1 = 100, lo2 = 100, lo2r = 100, Z = null, m0 = null;
  for (const sd of SEEDS) {
    const m = O.buildOvermap(sd), N = m.n, D = (x, y) => (x < 0 || y < 0 || x >= N || y >= N) ? null : m.at(x, y).district, LN = O.houseLanes(m);
    const net = network(N, D, LN), f1 = net.mainSize / net.total * 100; lo1 = Math.min(lo1, f1);
    ['pocket', 'stub', 'other'].forEach((k) => { off[k] += net.off[k]; }); Object.assign(off.otherKinds, net.off.otherKinds);
    if (f1 < 99 || net.off.other > 0) g1.push(sd + ' ' + f1.toFixed(2) + '%');
    const L = lumps(N, D, LN, net), f2 = L.on / L.all * 100, f2r = L.road / L.all * 100; lo2 = Math.min(lo2, f2); lo2r = Math.min(lo2r, f2r); Object.keys(L.miss).forEach((k) => { missAll[k] = (missAll[k] || 0) + L.miss[k]; });
    if (f2 < 98 || f2r < 99.5) g2.push(sd + ' ' + f2.toFixed(2) + '% / ' + f2r.toFixed(2) + '%');
    const z = shares(N, D); if (!ZONES_OK(z)) g3.push(sd + ' ' + JSON.stringify(z)); if (!Z) Z = z;
    if (!m0) m0 = { N, D, LN, net };
  }
  ok('G1 ONE JOINED ROAD NETWORK on every one of ' + SEEDS.length + ' valleys: the main network at least 99 in 100 of the road blocks (worst ' + lo1.toFixed(2) + '%); off it, ' + off.pocket + ' blocks of house and works pockets whose street runs out on a dirt track onto open land, ' + off.stub + ' of Strip stubs, ' + off.other + ' else',
    g1.length === 0, g1.slice(0, 4).join('; ') || (Object.keys(off.otherKinds).join(',') || 'nothing unexplained'));
  const top = Object.entries(missAll).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, n]) => k + ' ' + n).join(', ');
  ok('G2 EVERY BUILDING ON IT: on every valley at least 98 in 100 of the building lumps on the main network (worst ' + lo2.toFixed(2) + '%; the rest on a pocket\'s street) and at least 99.5 in 100 fronting a road at all (worst ' + lo2r.toFixed(2) + '%; with none, over all 22: ' + (top || 'none') + ')', g2.length === 0, g2.slice(0, 4).join('; ') || 'all');
  ok('G3 NOT EVERY PART OF TOWN A SUBURB on every valley: houses ' + Z.suburb.toFixed(1) + '%, the open desert ' + Z.open.toFixed(1) + '%, the works ' + Z.industry.toFixed(1) + '%, the Strip ' + Z.strip.toFixed(1) + '%, the lake ' + Z.water.toFixed(1) + '% on the first (houses at most 30, desert at least 15, works 2.5, Strip 2, lake 0.7 on all)', g3.length === 0, g3.slice(0, 2).join('; ') || 'all');
  /* G4 planted */
  const { N, D, LN } = m0, mid = N >> 1;
  const D1 = (x, y) => (x === mid || x === mid + 1) && ROAD.has(D(x, y)) ? 'desert' : D(x, y);
  const LN1 = LN.slice(); for (let y = 0; y < N; y++) { LN1[y * N + mid] = 0; LN1[y * N + mid + 1] = 0; }
  const n1 = network(N, D1, LN1), cut = n1.mainSize / n1.total * 100 < 99 || n1.off.other > 0;
  const D2 = (x, y) => ROAD.has(D(x, y)) && Math.abs(x - mid) < 12 && Math.abs(y - mid) < 12 ? 'desert' : D(x, y), LN2 = LN.slice(); for (let i = 0; i < N * N; i++) { const x = i % N, y = (i / N) | 0; if (Math.abs(x - mid) < 12 && Math.abs(y - mid) < 12) LN2[i] = 0; }
  const n2 = network(N, D2, LN2), L2 = lumps(N, D2, LN2, n2), lost = L2.on / L2.all * 100 < 98 || L2.road / L2.all * 100 < 99.5;
  const D3 = (x, y) => ZOF[D(x, y)] === 'open' ? 'suburb' : D(x, y), z3 = !ZONES_OK(shares(N, D3));
  ok('G4 PLANTED FAIL: the network cut down the middle, the roads taken from the middle of town, the desert built over with tracts: each red (' + [cut, lost, z3].filter(Boolean).length + '/3)', cut && lost && z3);
  if (process.argv.includes('--node')) return done();

  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  for (const prof of ['phone_portrait', 'phone_landscape']) {
    let d; const errs = [];
    try { d = await open({ keepCards: true, profile: prof }); } catch (e) { ok('the demo boots on the phone, ' + prof + ' [' + String(e.message).slice(0, 120) + ']', false); continue; }
    d.page.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
    try {
      for (let i = 0; i < 160; i++) { if (await d.fr.evaluate(() => !!(window.om && om.n && typeof vbTemplatesValley === 'function' && window.BohemiaFightKinds))) break; await d.page.waitForTimeout(400); }
      for (let i = 0; i < 120; i++) { if (await d.fr.evaluate(() => { try { vbCityInput(); } catch (e) {} return !!(window.VB_TOWNS && VB_TOWNS.list && VB_TOWNS.list.length); }).catch(() => false)) break; await d.page.waitForTimeout(250); }
      /* a works block no place stands on, on its drive */
      const cell = await d.fr.evaluate(() => { const N = om.n, LV = vbLanesValley(); for (let y = 10; y < N - 10; y++) for (let x = 10; x < N - 10; x++) { const t = om.at(x, y); if (t && t.district === 'industrial' && !vbTemplateAt(x, y) && LV && (LV[y * N + x] & 3) && !(window.loopTownAt && loopTownAt(x, y, 2))) return [x, y]; } return null; });
      await d.fr.evaluate((c) => { cityHandOver({ type: 'BOHEMIA_CITY_ENCOUNTER', label: 'gate: the ground and the zone', draft: true, why: 'gate:ground', at: { gx: c[0], gy: c[1] } }); }, cell);
      let F = null;
      for (let i = 0; i < 180 && !F; i++) { await d.page.waitForTimeout(500);
        F = await d.page.evaluate(() => { try { const f = document.getElementById('fightFrame'), w = f && f.contentWindow, FI = w && w.eval('FIGHT'); if (!FI || !FI.S || !FI.S.board) return null; return { g: w.FIGHT_OPTS && w.FIGHT_OPTS.ground || null, t: w.FIGHT_OPTS && w.FIGHT_OPTS.template || null }; } catch (e) { return null; } }); }
      const g = F && F.g;
      ok('P1 ' + prof + ': a fight the map hands over on a cell no place stands on (a works block, ' + JSON.stringify(cell) + ') carries its ground and zone to the fight (' + (g ? g.district + ', zone ' + g.zone + ', ground ' + g.ground + ', board kind ' + g.kind + ', families ' + (g.families || []).join('/') + ', street ' + JSON.stringify(g.street) : 'none') + ')',
        !!g && !F.t && g.district === 'industrial' && g.zone === 'industry' && !!g.ground && !!g.kind && g.families.length > 0 && !!g.street && !!g.street.way && g.cell[0] === cell[0] && g.cell[1] === cell[1]);
    } catch (e) { ok('the page legs ran, ' + prof + ' [' + String(e && e.message).slice(0, 160) + ']', false); }
    ok('P2 ' + prof + ': nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
    try { await d.close(); } catch (_e) {}
  }
  done();
})();
