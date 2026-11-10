#!/usr/bin/env node
/* ============================================================================
   THE CORNERS JOIN (WORLD THIRTEEN 11/10, VAMILY rule 442(d); Paolo 11/9: 'you really need to make sure intersections, the sidewalk
   and the streets continue looking good like they're supposed to')

   Where a house street or a works drive meets a mile street or the Strip (a mouth), or another house street (a T, a cross street),
   the asphalt runs through, the kerb opens exactly as wide as the side street's roadway, and the sidewalks either side turn the corner
   into each other. The generator marks the mouths (laneMouths, engine/bohemia_overmap.js); the painter opens them
   (__THE_CORNERS_JOIN__ in slices/BOHEMIA_CITY_WORLD.html).

   NODE (22 seeds):
     C1 every open end of a house street or a works drive that meets a mile street or the Strip is marked on that street, and every
        mark has its street (both ways)
   PAGE (the demo on the phone), each at THREE ZOOMS (12, 24 and 48 texels a block, the far stop to the close tiles), on five valleys
   rebuilt in the page (the boot valley and four more), six tiles each (the four with the most mouths and T's, spread out, and the two
   with the most works drives):
     C2 THE STREET RUNS THROUGH: at the middle of every mouth, inside the mile street's walk, the texel is roadway, never the walk or
        the kerb (no kerb across a street)
     C3 THE CORNERS JOIN: at both corners of every mouth (0.2 q outside the opening, clear of the slabs' joints close in), the mile
        street's walk and the side street's sidewalk meet, walk to walk
     C4 THE T's: at the middle of every T the side street's roadway runs into the street it meets (no kerb across it); at its corners,
        walk to walk
     C4b IN EVERY ZONE: a house street onto a mile street, a works drive onto one, a T in the houses, a T in the works: each seen and
        each joined (and the Strip's, where a valley has one)
     C5 PLANTED FAIL: the mouths not opened (C2 red), a sidewalk cut at a corner (the opening too wide: C3 red), a kerb left across a
        T (C4 red)
     C6 nothing threw

     node gates/the_corners_join_gate.js [--node]
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const O = require(path.join(ROOT, 'engine/bohemia_overmap.js'));

let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('THE CORNERS JOIN: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const SEEDS = [1337, 7, 42, 2026, 99, 31337, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 2691674296];

(async () => {
  let ends = 0, marks = 0, bad = 0;
  for (const seed of SEEDS) {
    const m = O.buildOvermap(seed), N = m.n, LN = O.houseLanes(m), D = (x, y) => { const t = (x < 0 || y < 0 || x >= N || y >= N) ? null : m.at(x, y); return t ? t.district : null; };
    const want = new Uint8Array(N * N);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const v = LN[y * N + x], d = D(x, y); if (!(v & 3) || !(O.LANE_HOUSES[d] || O.LANE_WORKS[d])) continue;
      for (const [dx, dy, b, side] of (v & 3) === 1 ? [[-1, 0, 4, 32], [1, 0, 8, 128]] : [[0, -1, 4, 64], [0, 1, 8, 16]]) { if (!(v & b) || !O.LANE_WALK[D(x + dx, y + dy)]) continue; ends++; want[(y + dy) * N + x + dx] |= side; } }
    for (let i = 0; i < N * N; i++) { if (!O.LANE_WALK[D(i % N, (i / N) | 0)]) continue; const have = LN[i] & 240; for (const b of [16, 32, 64, 128]) if (have & b) marks++; if (have !== want[i]) bad++; }
  }
  ok('C1 every side street meeting a mile street or the Strip is marked on it, and every mark has its street (' + ends + ' mouths on ' + SEEDS.length + ' valleys)', bad === 0 && ends > 1000 && ends === marks, 'disagreeing blocks ' + bad);
  if (process.argv.includes('--node')) return done();

  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  let d; const errs = [];
  try { d = await open({ keepCards: true }); } catch (e) { ok('the demo boots on the phone [' + String(e.message).slice(0, 120) + ']', false); return done(); }
  d.page.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
  try {
    const fr = d.fr;
    for (let i = 0; i < 160; i++) { if (await fr.evaluate(() => !!(window.VB_LANES && typeof vbTileInput === 'function' && window.om && om.n))) break; await d.page.waitForTimeout(400); }
    for (let i = 0; i < 120; i++) { if (await fr.evaluate(() => { try { vbCityInput(); } catch (e) {} return !!(window.VB_TOWNS && VB_TOWNS.list && VB_TOWNS.list.length); }).catch(() => false)) break; await d.page.waitForTimeout(250); }
    const MUT = {
      shut: ['var lmo0 = inp.lanes && !thru ?', 'var lmo0 = 0 && inp.lanes && !thru ?'],
      wide: ['(lmo0 & 16) && cu >= 4.55 && cu < 7.45', '(lmo0 & 16) && cu >= 3.5 && cu < 8.5', '(lmo0 & 32) && cvv >= 4.55 && cvv < 7.45', '(lmo0 & 32) && cvv >= 3.5 && cvv < 8.5',
             '(lmo0 & 64) && cu >= 4.55 && cu < 7.45', '(lmo0 & 64) && cu >= 3.5 && cu < 8.5', '(lmo0 & 128) && cvv >= 4.55 && cvv < 7.45', '(lmo0 & 128) && cvv >= 3.5 && cvv < 8.5'],
      kerb: ['var lteeHere = lband < 0', 'var lteeHere = false && lband < 0', 'var wteeHere = wband < 0', 'var wteeHere = false && wband < 0'],
    };
    const boot = await fr.evaluate(() => om.seed), VALLEYS = [boot, 7, 42, 2026, 99], TOT = {}, ZN = {}, ZO = {};
    let R = null, missing = null;
    for (const seed of VALLEYS) {
      R = await fr.evaluate(({ MUT, seed, boot }) => {
        if (om.seed !== seed) { om = CBinstall(OM.buildOvermap(seed)); try { POWER = buildPower(om, seed); } catch (e) {} try { vbCityInput(); } catch (e) {} }
        const PART = { ground: 0, roof: 1, roofL: 2, top: 3, side: 4, line: 5, edge: 6, spot: 7, burn: 8, hole: 9, tree: 10, row: 11, neon: 12, window: 13, lampspot: 14 };
        const N = om.n, LV = vbLanesValley(), WALK = /^(arterial|strip)$/, LANE = /^(suburb|estate|gated|apartment|industrial|warehouse|storage)$/, WORKS = /^(industrial|warehouse|storage)$/;
        const src = vbCityCore.toString(), cores = { real: vbCityCore };
        if (seed === boot) for (const k in MUT) { let ms = src; for (let i = 0; i < MUT[k].length; i += 2) { if (ms.indexOf(MUT[k][i]) < 0) return { missing: MUT[k][i] }; ms = ms.split(MUT[k][i]).join(MUT[k][i + 1]); } cores[k] = (0, eval)('(' + ms + ')'); }
        /* the tiles: the valley's 8-block tiles holding the most mouths and T's, spread over it, and the two with the most works drives */
        const T8 = VB_TILE, score = {}, wscore = {};
        for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const v = LV[y * N + x], t = om.at(x, y); if (!t) continue;
          const k = Math.floor(x / T8) + ',' + Math.floor(y / T8);
          if (WALK.test(t.district) && (v & 240)) score[k] = (score[k] || 0) + 1;
          if (LANE.test(t.district) && (v & 3) && (v & 240)) { score[k] = (score[k] || 0) + 1; if (WORKS.test(t.district)) wscore[k] = (wscore[k] || 0) + 1; } }
        const keys = Object.keys(score).sort((a, b) => score[b] - score[a]).filter((k, i) => i % 3 === 0).slice(0, 4);
        Object.keys(wscore).sort((a, b) => wscore[b] - wscore[a]).filter((k) => keys.indexOf(k) < 0).slice(0, 2).forEach((k) => keys.push(k));
        const tiles = keys.map((k) => k.split(',').map(Number)), out = {}, zn = {}, zo = {};
        const tally = (z, good) => { zn[z] = (zn[z] || 0) + 1; if (good) zo[z] = (zo[z] || 0) + 1; };
        for (const name in cores) { out[name] = {};
          for (const S of [12, 24, 48]) { const st = { mouth: 0, through: 0, corner: 0, cornerN: 0, tee: 0, teeThrough: 0, teeCorner: 0, teeCornerN: 0 };
            for (const [tx, ty] of tiles) {
              const inp = vbTileInput(tx, ty, S); inp.coli = true; inp.flat = false; const c = cores[name](inp), P = c.P, Q = Math.max(1, Math.round(S / 12)), org = inp.org;
              const at = (bx, by, u, v) => { const px = (bx - org[0]) * S + Math.floor(u * Q), py = (by - org[1]) * S + Math.floor(v * Q); if (px < 0 || py < 0 || px >= P || py >= P) return null; const ci = c.coli[py * P + px]; return { cl: (ci >> 4) & 31, pt: ci & 15 }; };
              const walk = (r) => !!r && r.cl === VB_CLASS.road && (r.pt === PART.top || r.pt === PART.lampspot || r.pt === PART.window || r.pt === PART.hole);
              const road = (r) => !!r && (r.cl === VB_CLASS.road || r.cl === VB_CLASS.blvd) && (r.pt === PART.ground || r.pt === PART.line || r.pt === 15 || r.pt === PART.spot || r.pt === PART.roof || r.pt === PART.roofL || r.pt === PART.burn || r.pt === PART.tree);
              /* (u, v) of a point 'along' the side and 'd' in from it, for each side 16 N, 32 E, 64 S, 128 W */
              const pt = (side, along, dd) => side === 16 ? [along, dd] : side === 32 ? [12 - dd, along] : side === 64 ? [along, 12 - dd] : [dd, along];
              const OPP = { 16: [0, -1], 32: [1, 0], 64: [0, 1], 128: [-1, 0] }, BACK = { 16: 64, 32: 128, 64: 16, 128: 32 };
              for (let by = ty * T8; by < (ty + 1) * T8 && by < N; by++) for (let bx = tx * T8; bx < (tx + 1) * T8 && bx < N; bx++) {
                const t = om.at(bx, by), v = LV[by * N + bx]; if (!t || (window.__WS_CELL && window.__WS_CELL[by * N + bx])) continue;
                if (WALK.test(t.district) && (v & 240)) for (const side of [16, 32, 64, 128]) { if (!(v & side)) continue;
                  const nb = [bx + OPP[side][0], by + OPP[side][1]], nt = om.at(nb[0], nb[1]); st.mouth++;
                  const m0 = pt(side, 6.1, 0.5), th = road(at(bx, by, m0[0], m0[1])); if (th) st.through++;
                  let cj = 0; for (const al of [4.35, 7.65]) { st.cornerN++; const a1 = pt(side, al, 0.5), a2 = pt(BACK[side], al, 0.5); if (walk(at(bx, by, a1[0], a1[1])) && walk(at(nb[0], nb[1], a2[0], a2[1]))) { st.corner++; cj++; } }
                  if (name === 'real') tally((nt && WORKS.test(nt.district) ? 'a works drive onto ' : 'a house street onto ') + (t.district === 'strip' ? 'the Strip' : 'a mile street'), th && cj === 2); }
                if (LANE.test(t.district) && (v & 3)) for (const side of [16, 32, 64, 128]) { if (!(v & side)) continue;
                  /* the T comes in through this block's row on that side; it meets the block's own street at 4 q in from that side */
                  st.tee++; const m1 = pt(side, 6.1, 4.3), th = road(at(bx, by, m1[0], m1[1])); if (th) st.teeThrough++;
                  let cj = 0; for (const al of [4.35, 7.65]) { st.teeCornerN++; const a1 = pt(side, al, 4.3), a2 = pt(side, al, 3.7); if (walk(at(bx, by, a1[0], a1[1])) && walk(at(bx, by, a2[0], a2[1]))) { st.teeCorner++; cj++; } }
                  if (name === 'real') tally(WORKS.test(t.district) ? 'a T in the works' : 'a T in the houses', th && cj === 2); }
              } }
            out[name][S] = st; } }
        return { tiles, out, zn, zo };
      }, { MUT, seed, boot });
      if (R.missing) { missing = R.missing; break; }
      for (const name in R.out) { TOT[name] = TOT[name] || {}; for (const S in R.out[name]) { const a = TOT[name][S] = TOT[name][S] || {}; for (const k in R.out[name][S]) a[k] = (a[k] || 0) + R.out[name][S][k]; } }
      for (const z in R.zn) { ZN[z] = (ZN[z] || 0) + R.zn[z]; ZO[z] = (ZO[z] || 0) + (R.zo[z] || 0); }
    }
    await fr.evaluate((boot) => { if (om.seed !== boot) { om = CBinstall(OM.buildOvermap(boot)); try { POWER = buildPower(om, boot); } catch (e) {} try { vbCityInput(); } catch (e) {} } }, boot);
    if (missing) { ok('the mutations found their lines [' + missing + ']', false); }
    else {
      const f = (st, a, b) => st[b] ? st[a] / st[b] : 0, Z = [12, 24, 48], line = (name, a, b) => Z.map((S) => S + ': ' + TOT[name][S][a] + '/' + TOT[name][S][b]).join(', ');
      console.log('  (' + VALLEYS.length + ' valleys in the page: ' + VALLEYS.join(', ') + '; six tiles each, three zooms)');
      ok('C2 THE STREET RUNS THROUGH every mouth, at every zoom (' + line('real', 'through', 'mouth') + ')', Z.every((S) => TOT.real[S].mouth > 100 && f(TOT.real[S], 'through', 'mouth') >= 0.97));
      ok('C3 THE CORNERS JOIN, walk to walk, at every zoom (' + line('real', 'corner', 'cornerN') + ')', Z.every((S) => f(TOT.real[S], 'corner', 'cornerN') >= 0.97));
      ok('C4 THE T\'s: the roadway runs through and the corners join, at every zoom (through ' + line('real', 'teeThrough', 'tee') + '; corners ' + line('real', 'teeCorner', 'teeCornerN') + ')',
        Z.every((S) => TOT.real[S].tee > 50 && f(TOT.real[S], 'teeThrough', 'tee') >= 0.97 && f(TOT.real[S], 'teeCorner', 'teeCornerN') >= 0.97));
      const zs = Object.keys(ZN).sort(), need = ['a house street onto a mile street', 'a works drive onto a mile street', 'a T in the houses', 'a T in the works'];
      ok('C4b IN EVERY ZONE, every zoom together (' + zs.map((z) => z + ' ' + ZO[z] + '/' + ZN[z]).join('; ') + ')', need.every((z) => ZN[z] >= 12) && zs.every((z) => ZO[z] / ZN[z] >= 0.97));
      const sh = f(TOT.shut[24], 'through', 'mouth'), wd = f(TOT.wide[24], 'corner', 'cornerN'), kb = f(TOT.kerb[24], 'teeThrough', 'tee');
      ok('C5 PLANTED FAIL: the mouths not opened (through ' + Math.round(sh * 100) + '%), a sidewalk cut at a corner (corners ' + Math.round(wd * 100) + '%), a kerb left across a T (through ' + Math.round(kb * 100) + '%): each red', sh < 0.97 && wd < 0.97 && kb < 0.97);
    }
  } catch (e) { ok('the page legs ran [' + String(e && e.message).slice(0, 200) + ']', false); }
  ok('C6 nothing threw', errs.length === 0, errs.slice(0, 3).join(' | '));
  try { await d.close(); } catch (_e) {}
  done();
})();
