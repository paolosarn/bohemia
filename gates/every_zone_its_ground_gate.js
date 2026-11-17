#!/usr/bin/env node
/* ============================================================================
   EVERY ZONE ITS GROUND (WORLD THIRTEEN 11/17, VAMILY rule 453(2); the coordinator: 'every zone's cells handed to COMBAT THREE
   with their ground so its open-map boards match the zone (the seam in your handoffs)')

   MEASURED BEFORE (22 valleys): 51 in 100 of the map's cells were map kinds a place board stands for; the rest (the mile streets
   alone 25 in 100, the strip malls, the solar farms, the resorts, the apartment courts, the farms) dealt their kind's shared blocks,
   so a fight on a mile street through the open desert was fought among a suburb's stems and strip malls.

     Z1 THE TABLE: every one of the one table's map kinds names its zone place (piece.deal.zone_place): its own built place, its
        zone's (records/target/bb/land_use.json zones[z].place, place_by_district first), 'beside' for the mile street only, or
        null only where its zone deals its own (the strip malls, the civic buildings, the freeway's own board); every zone's place
        a built place board; the table and the fight-kinds engine in step with the files
     Z2 22 VALLEYS: the map page's own vbZoneGround (its text, run here) on every cell: at least 80 in 100 of the cells deal a
        place board's own ground (the freeway's own board besides); every mile street its land's place (the land read beside it),
        a road cell its own way, a dirt track its way and bits
     Z3 THE FIGHT DEALS IT (the fight's own code, headless): a plain cell of every kind that stands in for a place (and a mile
        street through the desert and through the works) is dealt that place's own blocks (boardDef.zone the place, at least 30
        in 100 of each kind's blocks the place's own and 45 of all, COMBAT THREE's P7 floor, no landmark); the same cells without the hand-over's zone place: never
     Z4 NEVER TWO ALIKE: 12 cells of each such kind, nine in ten or more different boards
     Z5 PLANTED: the hand-over's zone place taken away (Z3 red), the land beside a mile street never read (Z2 red), a zone's place
        made a board that is not built (Z1 red)
     P1 the map page on a phone, upright and on its side: fights the map hands over itself on a mile street through the open desert
        and on a cell of a kind with no place of its own carry zone_place, land and street, and the fight deals that place
     P2 nothing threw

   Run: node gates/every_zone_its_ground_gate.js           (the page legs about two minutes)
        node gates/every_zone_its_ground_gate.js --node    (Z1 to Z5 only, about 30 seconds)
   ============================================================================ */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (name, cond, info) => { if (cond) pass++; else fail++; console.log((cond ? '  ok   ' : '  FAIL ') + name + (info ? '  [' + info + ']' : '')); return cond; };
const J = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const done = () => { console.log('\nEVERY ZONE ITS GROUND: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

const O = require(path.join(ROOT, 'engine/bohemia_overmap.js'));
const FKn = require(path.join(ROOT, 'engine/bohemia_fight_kinds.js'));
const LU = J('records/target/bb/land_use.json'), MK = J('records/target/bb/map_fight_kinds.json'), OURS = J('records/target/bb/ours.json');
const PLB = (OURS.place_boards.value || OURS.place_boards).places;
const PAGE = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
const SEEDS = [1337, 7, 42, 2026, 99, 31337, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 2691674296];
const ROADS = { freeway: 1, beltway: 1, interchange: 1 };

function fnText(src, name) {
  const a = src.indexOf('function ' + name + '('); if (a < 0) return null;
  let i = src.indexOf('{', a), dep = 0; for (; i < src.length; i++) { if (src[i] === '{') dep++; else if (src[i] === '}') { dep--; if (!dep) break; } }
  return src.slice(a, i + 1);
}
const ZG_TEXT = fnText(PAGE, 'vbZoneGround');
const zoneGroundFrom = (text) => new Function('return ' + text)();

(async () => {
  /* ---- Z1 THE TABLE ---- */
  const zoneOf = {}; Object.entries(LU.zones).forEach(([z, v]) => v.districts.forEach((d) => { zoneOf[d] = z; }));
  const built = (pp) => !!pp && /^place_/.test(pp) && !!(PLB[pp.slice(6)] && PLB[pp.slice(6)].built);
  function table(LUz, MKd) {
    const bad = [], nulls = [];
    Object.entries(MKd).forEach(([d, r]) => { const dl = r.piece && r.piece.deal; if (!dl) return;
      const zp = dl.zone_place, z = r.zone, zp0 = (LUz.place_by_district || {})[d] !== undefined ? LUz.place_by_district[d] : (LUz.zones[z] || {}).place;
      if (dl.place) { if (zp !== dl.place) bad.push(d + ' (its own place ' + dl.place + ', says ' + zp + ')'); return; }
      if (zp === 'beside') { if (d !== 'arterial') bad.push(d + ' beside'); return; }
      if (zp == null) { if (zp0 != null && zp0 !== 'beside') bad.push(d + ' null against its zone\'s ' + zp0); else nulls.push(d); return; }
      if (!built(zp)) bad.push(d + ' ' + zp + ' not a built place');
      else if (zp0 && zp !== 'place_' + zp0) bad.push(d + ' ' + zp + ' against ' + zp0); });
    const zbad = Object.entries(LUz.zones).filter(([, v]) => v.place != null && v.place !== 'beside' && !built('place_' + v.place)).map(([z, v]) => z + ':' + v.place);
    return { bad, nulls, zbad };
  }
  const T1 = table(LU, MK.districts);
  let inStep = true, stepWhy = '';
  try { execFileSync('python3', [path.join(ROOT, 'tools/bohemia_world_thirteen_pieces.py'), '--check'], { cwd: ROOT, stdio: 'pipe' }); } catch (e) { inStep = false; stepWhy = 'the table'; }
  try { execFileSync('node', [path.join(ROOT, 'tools/bohemia_world_thirteen_fight_kinds_sync.js'), '--check'], { cwd: ROOT, stdio: 'pipe' }); } catch (e) { inStep = false; stepWhy += ' the engine'; }
  const nKinds = Object.values(MK.districts).filter((r) => r.piece && r.piece.deal).length;
  ok('Z1 THE TABLE: every one of the ' + nKinds + ' map kinds the fight deals names its zone place (its own place, its zone\'s, the mile street the land beside it); null only where the zone deals its own: ' + T1.nulls.join(' ') + '; every zone\'s place a built place board; the table and the engine in step',
    T1.bad.length === 0 && T1.zbad.length === 0 && !!ZG_TEXT && inStep, (T1.bad.concat(T1.zbad).slice(0, 6).join(' | ') || 'none wrong') + (inStep ? '' : '; OUT OF STEP: ' + stepWhy));

  /* ---- Z2 22 VALLEYS ---- */
  function valleys(zg) {
    const A = { cells: 0, own: 0, place: 0, freeway: 0, roads: 0, landless: 0, wrongLand: 0, roadWay: 0, roadNoWay: 0, tracks: 0, trackWay: 0, by: {}, mile: {} };
    for (const sd of SEEDS) { const m = O.buildOvermap(sd), N = m.n, TR = new Int32Array(N * N), LN = O.houseLanes({ n: N, at: m.at }); for (const t of m.tiles) if (t.track) TR[t.y * N + t.x] = t.track;
      for (const t of m.tiles) { const d = t.district, pc = FKn.piece(d); if (!pc || !pc.deal) continue; A.cells++; if (pc.deal.place) A.own++;
        const lb = LN[t.y * N + t.x] | 0, G = zg(m, { cell: [t.x, t.y], district: d, street: lb ? { way: (lb & 3) === 1 ? 'ew' : (lb & 3) === 2 ? 'ns' : null, ends: (lb & 12) >> 2, mouths: (lb & 240) >> 4 } : null }, FKn, TR);
        if (G.zone_place) { A.place++; A.by[G.zone_place] = (A.by[G.zone_place] || 0) + 1; } else if (ROADS[d]) A.freeway++;
        if (d === 'arterial' || ROADS[d]) { A.roads++; if (!G.land) A.landless++; if (G.street && G.street.way) A.roadWay++; else A.roadNoWay++; }
        if (d === 'arterial' && G.land) { const lp = FKn.piece(G.land), want = lp && lp.deal ? lp.deal.zone_place : null;
          if ((want === 'beside' ? null : want || null) !== (G.zone_place || null)) A.wrongLand++;
          const k = G.land + '>' + (G.zone_place || 'its own'); A.mile[k] = (A.mile[k] || 0) + 1; }
        if (t.track) { A.tracks++; if (G.track === t.track && G.street && G.street.way) A.trackWay++; } } }
    return A;
  }
  const zg = zoneGroundFrom(ZG_TEXT), A = valleys(zg), pct = (a, b) => (a / Math.max(1, b) * 100).toFixed(1);
  const topMile = Object.entries(A.mile).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, v]) => k + ' ' + pct(v, A.cells) + '%').join(', ');
  ok('Z2 22 VALLEYS (the page\'s own vbZoneGround on every cell): ' + pct(A.place, A.cells) + ' in 100 of ' + A.cells + ' cells deal a place board\'s own ground (was ' + pct(A.own, A.cells) + ' by their own kind), ' + pct(A.freeway, A.cells) + ' the freeway\'s own board; the mile streets by the land they run through: ' + topMile + '; ' + A.roadWay + ' of ' + A.roads + ' road cells carry their way; ' + A.trackWay + ' of ' + A.tracks + ' dirt-track cells their way and bits',
    A.place / A.cells >= 0.80 && A.wrongLand === 0 && A.landless / A.roads < 0.01 && A.roadWay / A.roads > 0.97 && A.trackWay === A.tracks,
    'mile streets off their land ' + A.wrongLand + ', roads with no land ' + A.landless + ', no way ' + A.roadNoWay);

  /* ---- Z3, Z4 THE FIGHT DEALS IT (headless) ---- */
  const HL = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
  const ctx = HL.engine({ extra: { window: null } }); ctx.window = ctx;
  for (const f of ['slices/bohemia_street_board.js', 'engine/bohemia_fight_kinds.js']) { try { vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx); } catch (e) {} }
  const SK = 'slices/fight_ground/street_board/';
  ctx.DB.streetKit = J(SK + 'street_board.json'); ctx.DB.streetDress = J(SK + 'dressing.json'); ctx.DB.streetStoreys = J(SK + 'storeys.json');
  const F = ctx.FIGHT, PL = ctx.DB.ours.place_boards.value.places;
  const deal = (d, i, ground) => { ctx.setSeed(8100 + i);
    F.setup({ district: d, cell: { gx: 13 + i * 7, gy: 19 + i * 5 }, night: false, auto: true, formation: null, deploy: false, inside: false, place: false, ground: ground }); return F.S; };
  const CASES = [];
  Object.entries(MK.districts).forEach(([d, r]) => { const dl = r.piece && r.piece.deal; if (dl && !dl.place && dl.zone_place && dl.zone_place !== 'beside') CASES.push({ d, zp: dl.zone_place, label: d }); });
  CASES.push({ d: 'arterial', zp: 'place_desert', label: 'a mile street through the desert', land: 'desert' }, { d: 'arterial', zp: 'place_works', label: 'a mile street through the works', land: 'industrial' });
  function fights(strip) {
    const R = { n: 0, zone: 0, own: 0, blocks: 0, lm: 0, low: [], same: [], kinds: 0 };
    CASES.forEach((c) => { const P0 = PL[c.zp.slice(6)], ownB = new Set([].concat(P0.field, [].concat.apply([], Object.values(P0.cols || {})), [].concat.apply([], Object.values(P0.rows || {}))));
      const seen = new Set(); let own = 0, all = 0; R.kinds++;
      for (let i = 0; i < 12; i++) { const g = { cell: [13 + i * 7, 19 + i * 5], district: c.d, zone: null, street: c.d === 'arterial' ? { way: i % 2 ? 'ns' : 'ew', ends: 3, mouths: 0, road: 'arterial' } : null, land: c.land || undefined, zone_place: strip ? undefined : c.zp };
        let S; try { S = deal(c.d, i, g); } catch (e) { continue; } if (!S || !S.boardDef) continue; R.n++;
        if (S.boardDef.zone === c.zp.slice(6)) R.zone++;
        const bl = [].concat.apply([], S.boardDef.blocks); bl.forEach((n) => { const b = String(n).split('|')[0]; all++; if (ownB.has(b)) own++; if (b === P0.landmark_block && !ownB.has(b)) R.lm++; });
        seen.add(bl.join(',')); }
      R.own += own; R.blocks += all; if (all && own / all < 0.30) R.low.push(c.label + ' ' + Math.round(own / all * 100) + '%'); if (seen.size < 11) R.same.push(c.label + ' ' + seen.size + '/12'); });
    return R;
  }
  const Z = fights(false);
  ok('Z3 THE FIGHT DEALS IT: ' + Z.zone + ' of ' + Z.n + ' plain cells of ' + Z.kinds + ' kinds with no place of their own (' + CASES.slice(0, 8).map((c) => c.label + ' as ' + c.zp.slice(6)).join(', ') + '...) are dealt their zone place\'s own blocks (' + Math.round(Z.own / Z.blocks * 100) + ' in 100 of their blocks the place\'s, no landmark)',
    Z.n >= CASES.length * 12 - 2 && Z.zone === Z.n && Z.low.length === 0 && Z.own / Z.blocks >= 0.45 && Z.lm === 0, Z.low.slice(0, 4).join(', ') || 'every kind at 30 or over, the whole at 45 or over (COMBAT THREE\'s own P7 floor)');
  const Zs = fights(true);
  ok('Z3b BEFORE (the same cells, no zone place handed over): ' + Zs.zone + ' of ' + Zs.n + ' dealt that place', Zs.zone === 0);
  ok('Z4 NEVER TWO ALIKE: 12 cells of each of the ' + Z.kinds + ' kinds, ' + (Z.kinds - Z.same.length) + ' of them all different or one repeat at most', Z.same.length === 0, Z.same.slice(0, 4).join(', '));

  /* ---- Z5 PLANTED ---- */
  const LU2 = JSON.parse(JSON.stringify(LU)); LU2.zones.open.place = 'moonbase';
  const MK2 = JSON.parse(JSON.stringify(MK.districts)); MK2.solar.piece.deal.zone_place = 'place_moonbase';
  const p1 = table(LU2, MK2).bad.length + table(LU2, MK2).zbad.length > 0;
  const zgNoLand = zoneGroundFrom(ZG_TEXT.replace("if(zp==='beside'){ var lp=best?FK.piece(best):null; zp=lp&&lp.deal?lp.deal.zone_place:null; }", ''));
  let p2 = false; { const m = O.buildOvermap(SEEDS[0]); let wrong = 0; for (const t of m.tiles) { if (t.district !== 'arterial') continue; const G = zgNoLand(m, { cell: [t.x, t.y], district: 'arterial', street: null }, FKn, null); if (G.land && !G.zone_place && FKn.piece(G.land).deal && FKn.piece(G.land).deal.zone_place) wrong++; } p2 = wrong > 0; }
  const p3 = Zs.zone === 0;
  ok('Z5 PLANTED FAIL: a zone\'s place no built board (Z1 red), the land beside a mile street never read (Z2 red), the zone place not handed over (Z3 red): ' + [p1, p2, p3].filter(Boolean).length + '/3', p1 && p2 && p3);
  if (process.argv.includes('--node')) return done();

  /* ---- P1, P2 ON THE PAGE ---- */
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  for (const prof of ['phone_portrait', 'phone_landscape']) {
    let d; const errs = [];
    try { d = await open({ keepCards: true, profile: prof }); } catch (e) { ok('the demo boots on the phone, ' + prof + ' [' + String(e.message).slice(0, 120) + ']', false); continue; }
    d.page.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
    try {
      for (let i = 0; i < 160; i++) { if (await d.fr.evaluate(() => !!(window.om && om.n && typeof vbZoneGround === 'function' && window.BohemiaFightKinds))) break; await d.page.waitForTimeout(400); }
      for (let i = 0; i < 120; i++) { if (await d.fr.evaluate(() => { try { vbCityInput(); } catch (e) {} return !!(window.VB_TOWNS && VB_TOWNS.list && VB_TOWNS.list.length); }).catch(() => false)) break; await d.page.waitForTimeout(250); }
      const cells = await d.fr.evaluate(() => { const N = om.n, R = { arterial: 1, freeway: 1, beltway: 1, interchange: 1 }, A = [];
        const free = (x, y) => !vbTemplateAt(x, y) && !(window.loopTownAt && loopTownAt(x, y, 3));
        let mile = null, other = null;
        for (let y = 8; y < N - 8 && !mile; y++) for (let x = 8; x < N - 8 && !mile; x++) { const t = om.at(x, y); if (!t || t.district !== 'arterial' || !free(x, y)) continue;
          let des = 0; for (let b = -1; b <= 1; b++) for (let a = -1; a <= 1; a++) { const u = om.at(x + a, y + b); if (u && u.district === 'desert') des++; } if (des >= 4) mile = [x, y]; }
        for (const want of ['solar', 'apartment', 'resort', 'farm']) { for (let y = 8; y < N - 8 && !other; y++) for (let x = 8; x < N - 8 && !other; x++) { const t = om.at(x, y); if (t && t.district === want && free(x, y)) other = [x, y]; } if (other) break; }
        return [mile, other].filter(Boolean); });
      for (let ci = 0; ci < cells.length; ci++) { const cell = cells[ci];
        await d.fr.evaluate((c) => { cityHandOver({ type: 'BOHEMIA_CITY_ENCOUNTER', label: 'gate: every zone its ground', draft: true, why: 'gate:zone', at: { gx: c[0], gy: c[1] } }); }, cell);
        let Fr = null;
        for (let i = 0; i < 180 && !Fr; i++) { await d.page.waitForTimeout(500);
          Fr = await d.page.evaluate(() => { try { const f = document.getElementById('fightFrame'), w = f && f.contentWindow, FI = w && w.eval('FIGHT'); if (!FI || !FI.S || !FI.S.board || !FI.S.boardDef) return null; return { g: w.FIGHT_OPTS && w.FIGHT_OPTS.ground || null, zone: FI.S.boardDef.zone || null }; } catch (e) { return null; } }); }
        const g = Fr && Fr.g, want = g && g.zone_place ? g.zone_place.slice(6) : null;
        ok('P1 ' + prof + ': a fight the map hands over on ' + (g ? (g.district === 'arterial' ? 'a mile street through the ' + g.land : 'a ' + g.district + ' cell') : '?') + ' ' + JSON.stringify(cell) + ' carries its zone place (' + (g ? g.zone_place : '?') + '), street ' + JSON.stringify(g && g.street) + ', sides ' + JSON.stringify(g && g.sides) + ', and the fight deals it (board zone ' + (Fr ? Fr.zone : '?') + ')',
          !!g && !!want && Fr.zone === want && !!g.sides && (g.district !== 'arterial' || (!!g.land && !!g.street && !!g.street.way)) && g.cell[0] === cell[0] && g.cell[1] === cell[1]);
        if (ci === cells.length - 1) break;   /* a fresh page for the next cell (the fight stands on this one) */
        try { await d.close(); } catch (_e) {}
        d = await open({ keepCards: true, profile: prof }); d.page.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
        for (let i = 0; i < 160; i++) { if (await d.fr.evaluate(() => !!(window.om && om.n && typeof vbZoneGround === 'function' && window.BohemiaFightKinds))) break; await d.page.waitForTimeout(400); }
        for (let i = 0; i < 120; i++) { if (await d.fr.evaluate(() => { try { vbCityInput(); } catch (e) {} return !!(window.VB_TOWNS && VB_TOWNS.list && VB_TOWNS.list.length); }).catch(() => false)) break; await d.page.waitForTimeout(250); }
      }
      ok('P1b ' + prof + ': both kinds of cell found on the valley (a mile street through the desert, a cell of a kind with no place)', cells.length === 2, JSON.stringify(cells));
    } catch (e) { ok('the page legs ran, ' + prof + ' [' + String(e && e.message).slice(0, 160) + ']', false); }
    ok('P2 ' + prof + ': nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
    try { await d.close(); } catch (_e) {}
  }
  done();
})();
