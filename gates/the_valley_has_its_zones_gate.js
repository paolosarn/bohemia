#!/usr/bin/env node
/* ============================================================================
   THE VALLEY HAS ITS ZONES (WORLD THIRTEEN 11/10, VAMILY rule 429(g)(h)(f); ask lines 508, 509, 507)

   Paolo 11/7: 'not every part of town is gonna be this suburb shit... where there's more desert landscape, where there's more
   industrial or building going on... some sort of smart system'; 'every building needs to have a road on it'. The zones are
   records/target/bb/land_use.json; the generator lays the districts, zones them (landUse in engine/bohemia_overmap.js) and lays a
   street or a drive down every house and works block (houseLanes).

   NODE (22 seeds, no browser):
     Z1 every one of the file's twelve zones is on every valley
     Z2 every zone's share of the valley inside the file's range, on every valley
     Z3 the neighbour rules: no house block with five or more of its eight neighbours works; no estate or gated tract touching the
        works; at least 80 in 100 works blocks touch another (a zone, never scattered singles)
     Z4 every works block (industrial, warehouse, storage) carries its drive, and every one in a lump on a mile street is joined to it
     Z5 the generator's numbers are the file's (the sync tool writes nothing new) and the map page carries engine/bohemia_overmap.js
        WORD FOR WORD, the whole of it (11/7 the page carried the generator from before the pocket-track fix: a check of its first
        and last few thousand characters passed it)
     Z6 PLANTED FAIL: the works put back as tracts (Z2 red), a tract planted inside the works (Z3 red), an estate beside the works
        (Z3 red), a works block's drive taken away (Z4 red)
   PAGE (the demo on the phone):
     P1 the painter paints the drive: the middle of every works block with one is street; its rows are sheds standing
     P2 THE FIGHT'S BOARD cut at the works: every shed (a block's run of shed tiles) has a street tile at its front
     P3 nothing threw

     node gates/the_valley_has_its_zones_gate.js [--node]
   ============================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const O = require(path.join(ROOT, 'engine/bohemia_overmap.js'));
const SYNC = require(path.join(ROOT, 'tools/bohemia_world_thirteen_land_use_sync.js'));
const LU = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/land_use.json'), 'utf8'));

let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('THE VALLEY HAS ITS ZONES: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const SEEDS = [1337, 7, 42, 2026, 99, 31337, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 2691674296];
const ZOF = {}; for (const z in LU.zones) for (const d of LU.zones[z].districts) ZOF[d] = z;
const WORKS_ZONE = new Set(LU.zones.industry.districts), HOUSE = { suburb: 1, estate: 1, gated: 1, apartment: 1 };
const N8 = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];

/* the valley as plain data, so a planted copy can be checked the same way */
function plain(m) { const N = m.n, d = new Array(N * N), fx = new Uint8Array(N * N); for (const t of m.tiles) { d[t.y * N + t.x] = t.district; fx[t.y * N + t.x] = (t.fixed || t.real) ? 1 : 0; } return { n: N, d, fx }; }
function check(V, LN) {
  const N = V.n, D = (x, y) => (x < 0 || y < 0 || x >= N || y >= N) ? null : V.d[y * N + x], k = (x, y) => y * N + x, out = {};
  const cnt = {}; for (const z in LU.zones) cnt[z] = 0; for (const d of V.d) if (ZOF[d]) cnt[ZOF[d]]++;
  out.missing = Object.keys(cnt).filter((z) => !cnt[z]);
  out.share = {}; out.outOfRange = [];
  for (const z in cnt) { const s = cnt[z] / (N * N); out.share[z] = s; const r = LU.zones[z].share; if (s < r[0] || s > r[1]) out.outOfRange.push(z + ' ' + (s * 100).toFixed(2) + '%'); }
  let inside = 0, estate = 0, works = 0, lone = 0;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const d = D(x, y);
    if (HOUSE[d] && !V.fx[k(x, y)]) { let w = 0; for (const [dx, dy] of N8) if (WORKS_ZONE.has(D(x + dx, y + dy))) w++; if (w >= 5) inside++; }
    if ((d === 'estate' || d === 'gated')) for (const [dx, dy] of N8) { const n = D(x + dx, y + dy); if (O.LANE_WORKS[n] && !V.fx[k(x + dx, y + dy)]) { estate++; break; } }
    if (O.LANE_WORKS[d]) { works++; if (!N8.some(([dx, dy]) => WORKS_ZONE.has(D(x + dx, y + dy)))) lone++; } }
  out.inside = inside; out.estate = estate; out.cluster = works ? 1 - lone / works : 1;
  /* Z4: every works block's drive, joined street to street from the mile streets (the street gate's own reading) */
  const L = (x, y) => !!(O.LANE_HOUSES[D(x, y)] || O.LANE_WORKS[D(x, y)]), W = (x, y) => !!O.LANE_WALK[D(x, y)];
  const reach = new Uint8Array(N * N), st = [], SIDE = [[0, -1, 16], [1, 0, 32], [0, 1, 64], [-1, 0, 128]];
  const ends = (v) => (v & 3) === 1 ? [[-1, 0, 4], [1, 0, 8]] : [[0, -1, 4], [0, 1, 8]];
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { if (!L(x, y)) continue; const v = LN[k(x, y)]; if (ends(v).some(([dx, dy, b]) => (v & b) && W(x + dx, y + dy))) { reach[k(x, y)] = 1; st.push([x, y]); } }
  while (st.length) { const [x, y] = st.pop(), v = LN[k(x, y)];
    for (const [dx, dy, b] of SIDE) { const nx = x + dx, ny = y + dy; if (!L(nx, ny) || reach[k(nx, ny)]) continue; const w = LN[k(nx, ny)];
      const mine = ends(v).find((e) => e[0] === dx && e[1] === dy), theirs = ends(w).find((e) => e[0] === -dx && e[1] === -dy);
      const back = SIDE.find((s2) => s2[0] === -dx && s2[1] === -dy)[2];
      if ((mine && (v & mine[2]) && ((w & 3) === (v & 3) || (w & back))) || (theirs && (w & theirs[2]) && ((w & 3) === (v & 3) || (v & b)))) { reach[k(nx, ny)] = 1; st.push([nx, ny]); } } }
  const comp = new Int32Array(N * N).fill(-1), road = []; let id = 0;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { if (!L(x, y) || comp[k(x, y)] >= 0) continue; const s2 = [[x, y]]; comp[k(x, y)] = id; let r = false;
    while (s2.length) { const [cx, cy] = s2.pop(); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = cx + dx, ny = cy + dy; if (W(nx, ny)) r = true; if (L(nx, ny) && comp[k(nx, ny)] < 0) { comp[k(nx, ny)] = id; s2.push([nx, ny]); } } }
    road.push(r); id++; }
  let noDrive = 0, unjoined = 0;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { if (!O.LANE_WORKS[D(x, y)]) continue; if (!(LN[k(x, y)] & 3)) noDrive++; else if (!reach[k(x, y)] && road[comp[k(x, y)]]) unjoined++; }
  out.noDrive = noDrive; out.unjoined = unjoined; out.works = works;
  return out;
}
function lanesOf(V) { return O.houseLanes({ n: V.n, at: (x, y) => ({ district: V.d[y * V.n + x] }) }); }

(async () => {
  const R = SEEDS.map((seed) => { const m = O.buildOvermap(seed), V = plain(m); return { seed, m, V, c: check(V, O.houseLanes(m)) }; });
  ok('Z1 every one of the twelve zones is on every one of ' + R.length + ' valleys', R.every((x) => !x.c.missing.length), R.filter((x) => x.c.missing.length).map((x) => x.seed + ': ' + x.c.missing.join(', ')).join('; ') || 'all twelve, every valley');
  const rng = (z) => { const a = R.map((x) => x.c.share[z] * 100); return z + ' ' + Math.min(...a).toFixed(1) + '-' + Math.max(...a).toFixed(1) + '%'; };
  ok('Z2 every zone\'s share inside the file\'s range on every valley', R.every((x) => !x.c.outOfRange.length),
    (R.filter((x) => x.c.outOfRange.length).map((x) => x.seed + ': ' + x.c.outOfRange.join(', ')).join('; ') || 'industry ' + rng('industry').slice(9) + ', the cheap edge ' + rng('cheap_edge').slice(11) + ', houses ' + rng('suburb').slice(7)));
  ok('Z3 the neighbour rules: no house inside the works, no estate by the works, the works in zones (at least 80 in 100 touch another)',
    R.every((x) => x.c.inside === 0 && x.c.estate === 0 && x.c.cluster >= 0.8),
    'houses inside ' + R.reduce((a, x) => a + x.c.inside, 0) + ', estates by the works ' + R.reduce((a, x) => a + x.c.estate, 0) + ', the works in a zone lowest ' + Math.round(Math.min(...R.map((x) => x.c.cluster)) * 100) + '%');
  ok('Z4 every works block carries its drive, every one in a lump on a mile street joined to it (' + R.reduce((a, x) => a + x.c.works, 0) + ' works blocks)',
    R.every((x) => x.c.noDrive === 0 && x.c.unjoined === 0), 'without a drive ' + R.reduce((a, x) => a + x.c.noDrive, 0) + ', not joined ' + R.reduce((a, x) => a + x.c.unjoined, 0));
  const eng = fs.readFileSync(SYNC.ENGINE, 'utf8'), page = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
  ok('Z5 the generator\'s numbers are the file\'s, and the map page carries the whole generator word for word', SYNC.written(eng) === eng && page.indexOf(eng.trim()) >= 0);
  /* Z6: the faults planted on the first valley, each caught */
  const V0 = R[0].V, cp = () => ({ n: V0.n, d: V0.d.slice(), fx: V0.fx });
  const P1 = cp(); for (let i = 0; i < P1.d.length; i++) if (WORKS_ZONE.has(P1.d[i]) && !P1.fx[i]) P1.d[i] = 'suburb';
  const P2 = cp(); let p2 = false; for (let i = 0; i < P2.d.length && !p2; i++) { if (!O.LANE_WORKS[P2.d[i]] || P2.fx[i]) continue; const x = i % P2.n, y = (i / P2.n) | 0; let w = 0; for (const [dx, dy] of N8) { const j = (y + dy) * P2.n + x + dx; if (WORKS_ZONE.has(P2.d[j])) w++; } if (w >= 5) { P2.d[i] = 'suburb'; p2 = true; } }
  const P3 = cp(); let p3 = false; for (let i = 0; i < P3.d.length && !p3; i++) { if (!O.LANE_WORKS[P3.d[i]] || P3.fx[i]) continue; const x = i % P3.n, y = (i / P3.n) | 0; for (const [dx, dy] of N8) { const j = (y + dy) * P3.n + x + dx; if (P3.d[j] === 'suburb' && !P3.fx[j]) { P3.d[j] = 'estate'; p3 = true; break; } } }
  const LN4 = O.houseLanes(R[0].m).slice(); let p4 = false; for (let i = 0; i < LN4.length && !p4; i++) if (O.LANE_WORKS[V0.d[i]] && (LN4[i] & 3)) { LN4[i] = 0; p4 = true; }
  const c1 = check(P1, lanesOf(P1)), c2 = check(P2, lanesOf(P2)), c3 = check(P3, lanesOf(P3)), c4 = check(V0, LN4);
  ok('Z6 PLANTED FAIL: the works put back as tracts goes red on Z2, a tract inside the works and an estate by the works on Z3, a drive taken away on Z4',
    c1.outOfRange.length > 0 && p2 && c2.inside > 0 && p3 && c3.estate > 0 && p4 && c4.noDrive > 0, 'Z2 ' + c1.outOfRange.join(', ') + '; Z3 ' + c2.inside + ' inside, ' + c3.estate + ' estates; Z4 ' + c4.noDrive + ' without');
  if (process.argv.includes('--node')) return done();

  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  let d; const errs = [];
  try { d = await open({ keepCards: true }); } catch (e) { ok('the demo boots on the phone [' + String(e.message).slice(0, 120) + ']', false); return done(); }
  d.page.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
  try {
    const fr = d.fr;
    for (let i = 0; i < 160; i++) { if (await fr.evaluate(() => !!(window.BohemiaStreetBoard && BohemiaStreetBoard.ready() && window.VB_LANES))) break; await d.page.waitForTimeout(400); }
    for (let i = 0; i < 120; i++) { if (await fr.evaluate(() => { try { vbCityInput(); } catch (e) {} return !!(window.VB_TOWNS && VB_TOWNS.list && VB_TOWNS.list.length); }).catch(() => false)) break; await d.page.waitForTimeout(250); }
    const P = await fr.evaluate(() => {
      const N = om.n, LV = vbLanesValley(), inp = vbCityInput(); inp.coli = true; inp.wantH = true;
      const c = vbCityCore(inp), S = inp.S, PAD = inp.PAD, Pw = (N + 2 * PAD) * S, Q = Math.max(1, Math.round(S / 12)), HS = c.stand.HS, T = Q / 2;
      let mid = 0, midN = 0, shed = 0, shedN = 0; const spots = [];
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const t = om.at(x, y), v = LV && LV[y * N + x]; if (!t || !/^(industrial|warehouse|storage)$/.test(t.district) || !(v & 3)) continue;
        if (window.__WS_CELL && window.__WS_CELL[y * N + x]) continue;
        const ew = (v & 3) === 1, o = (al, ac) => { const u = (x + PAD) * S + Math.floor((ew ? al : ac) * Q), w = (y + PAD) * S + Math.floor((ew ? ac : al) * Q); return w * Pw + u; };
        midN++; if (((c.coli[o(6, 6)] >> 4) & 31) === VB_CLASS.road) mid++;   /* the drive's middle (a dead end's container yard is at its ends) */
        shedN++; if (HS[o(3, 1.8)] > 3 * T || HS[o(9, 10.2)] > 3 * T) shed++;
        if (spots.length < 400) spots.push([x, y]); }
      const pick = []; for (let i = 0; i < spots.length && pick.length < 10; i += Math.max(1, Math.floor(spots.length / 10))) pick.push(spots[i]);
      let b = 0, bs = 0; const STR = { road: 1, walk: 1 };
      /* a building is its run of shed tiles (one block's row): at least one of them has a street tile at its front (429(h): 'every
         building needs to have a road on it'), never every tile (the container yard a dead-end drive ends in stands beside a shed) */
      pick.forEach(([x, y]) => { const p = BohemiaStreetBoard.plan({ gx: x, gy: y }, 15, 15, 0); if (!p || p.err) return; const seen = new Uint8Array(p.AW * p.AH);
        const works = (i) => { if (p.kind[i] !== 'building') return false; const t = om.at(Math.floor((p.X0 + i % p.AW) / p.tpb), Math.floor((p.Y0 + ((i / p.AW) | 0)) / p.tpb)); return !!t && /^(industrial|warehouse|storage)$/.test(t.district); };
        const street = (i) => { const ax = i % p.AW, ay = (i / p.AW) | 0; return [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => { const xx = ax + dx, yy = ay + dy; return xx >= 0 && yy >= 0 && xx < p.AW && yy < p.AH && STR[p.kind[yy * p.AW + xx]]; }); };
        for (let i = 0; i < p.AW * p.AH; i++) { if (seen[i] || !works(i)) continue; const st = [i], comp = []; seen[i] = 1;
          while (st.length) { const j = st.pop(); comp.push(j); const ax = j % p.AW, ay = (j / p.AW) | 0;
            for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const xx = ax + dx, yy = ay + dy, n = yy * p.AW + xx; if (xx < 0 || yy < 0 || xx >= p.AW || yy >= p.AH || seen[n] || !works(n) || p.blk[n] !== p.blk[j]) continue; seen[n] = 1; st.push(n); } }
          b++; if (comp.some(street)) bs++; } });
      return { mid, midN, shed, shedN, b, bs, spots: pick.length };
    });
    ok('P1 the painter paints it: the drive down ' + P.mid + ' of ' + P.midN + ' works blocks is street; ' + P.shed + ' of ' + P.shedN + ' have their sheds standing', P.midN > 100 && P.mid / P.midN >= 0.97 && P.shed / P.shedN >= 0.9);
    ok('P2 THE FIGHT\'S BOARD at the works: on ' + P.spots + ' boards ' + P.bs + ' of ' + P.b + ' sheds (a block\'s run of shed tiles) have a street tile at their front', P.b > 10 && P.bs / P.b >= 0.97);
  } catch (e) { ok('the page legs ran [' + String(e && e.message).slice(0, 200) + ']', false); }
  ok('P3 nothing threw', errs.length === 0, errs.slice(0, 3).join(' | '));
  try { await d.close(); } catch (_e) {}
  done();
})();
