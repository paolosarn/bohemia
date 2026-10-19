#!/usr/bin/env node
/* ============================================================================
   THE REAL CORNER  (WORLD, 10/19/26; row [the dam in one place], round two)
   Record: records/BOHEMIA_WORLD_THE_DAM_IN_ONE_PLACE_10_18_26.md, section 7

   engine/bohemia_the_real_corner.js is the CANDIDATE for his vote (card world-the-real-corner-10-19): the valley's
   corner cluster (Lake Las Vegas, Boulder City, Hoover Dam, Lake Mead, the intake) turned, in place, into the ground
   that is really there, so each real place stands once, out on the region's map. Nothing calls it until he says yes.

   IT REFUSES:
   A. THE GAME'S SEED: the corner not the real south-east, or not named; a cell of the five pieces left as dam, town,
      intake or lake water; a name the candidate gives that is a real place the region carries outside the box (the
      same defect again under a new name); a name without draft:true.
   B. NO CAPITAL MOVES on the game's seed: the seat list (districtsOf) and every one of the eighteen factions' seats
      (placeHomes, the loop's own call) the same before and after.
   C. EVERY SOUTH-BORDER SEED of 210 (the 7/5 layout's own corner): no capital moves, no street stops dead
      (street_connectivity's rule), no street carried. The side-edge seeds (the roll's axisFlip) are a NOTE with their
      counts: that is [the roll]'s finding, not hidden and not red here.
   D. NOTHING CALLS IT YET: the roll, the seven pages that inline it and the demo carry no call; a fresh build is the
      roll's own valley.
   E. PURE: plan() changes nothing; apply() twice changes nothing the second time.
   F. THE ONCE-CHECK UNDER IT: on the game's seed the five real places leave the valley's cells, so only the three
      owed by other rows stand twice (A PLACE IS NAMED ONCE's list).
   M. mutations, each must bite.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const OM = require('../engine/bohemia_overmap.js');
const T = require('../engine/bohemia_towns.js');
const CE = require('../engine/bohemia_cityedit.js');
const C = require('../engine/bohemia_the_real_corner.js');
const G = require('../engine/BOHEMIA_faction_graph.json');
const J = JSON.parse(read('engine/BOHEMIA_REGION_LAND.json'));
const IDS = Object.keys(G.factions);

let pass = 0, fail = 0;
const ok = (n, c, note) => { c ? (pass++, console.log('  PASS ' + n + (note ? '  (' + note + ')' : '')))
                               : (fail++, console.log('  FAIL ' + n + (note ? '  (' + note + ')' : ''))); };
const say = (n, note) => console.log('  NOTE ' + n + (note ? '  (' + note + ')' : ''));
const section = (t, f) => { console.log('\n--- ' + t + ' ---'); f(); };

/* the game's seed, read off the city the way A PLACE IS NAMED ONCE reads it */
function gameSeed() {
  const frame = read('slices/BOHEMIA_CITY_WORLD.html'); let seed = 2691674296;
  const st = frame.match(/const BOH_SEED_TEXT='([^']+)'/), hs = frame.indexOf('function BOH_HASH_SEED(');
  if (st && hs >= 0) seed = new Function(frame.slice(hs, frame.indexOf('return (h^(h>>>16))>>>0; }', hs) + 27) + '\nreturn BOH_HASH_SEED;')()(st[1]);
  return seed;
}
const GAME = gameSeed();
const SEEDS = [GAME]; for (let i = 1; i < 210; i++) SEEDS.push(i * 7919);

/* the seats exactly as the loop asks for them (engine/bohemia_loop.js: districtsOf through cat, every faction) */
function seats(m) {
  const list = T.districtsOf(m, CE.cat).map(d => ({ pos: [d.x, d.y], id: d.x + ',' + d.y, kind: d.kind }));
  return { list: list.map(d => d.id).join(' '), p: T.placeHomes(G, list, 1, IDS) };
}
function movedIn(a, b) {
  return IDS.filter(f => { const A = a.p[f], B = b.p[f]; return (A || B) && (!A || !B || A.x !== B.x || A.y !== B.y); });
}
/* street_connectivity's own rule and sets (gates/street_connectivity_gate.js): a street nub off the mile lines with
   one road neighbour at most and no BIG mass beside it, not at the map's edge */
const ROAD = new Set(['arterial', 'freeway', 'strip', 'beltway', 'interchange', 'downtown', 'town']);
function breaks(m) {
  let b = 0;
  for (let y = 0; y < m.n; y++) for (let x = 0; x < m.n; x++) {
    const c = m.at(x, y); if (c.district !== 'arterial' || x % 9 === 0 || y % 9 === 0) continue;
    let rn = 0, bn = 0, edge = false;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const n = m.at(x + dx, y + dy); if (!n) { edge = true; continue; }
      if (ROAD.has(n.district)) rn++; else if (OM.BIG.has(n.district)) bn++;
    }
    if (rn <= 1 && bn === 0 && !edge) b++;
  }
  return b;
}
const inBox = (x, y) => x >= 0 && y >= 0 && x < 96 && y < 96;
const regionOutside = new Set(J.places.filter(p => !inBox(p.x, p.y)).map(p => p.name).concat((J.districts || []).map(d => d.name)));
const FIVE = { mead: 'water', lakeLV: 'water', damR: 'dam', intake: 'intake', boulder: 'town' };
function leftovers(m) {
  const L = m.layout, left = [];
  Object.keys(FIVE).forEach(k => { const R = L[k];
    for (let y = R.y; y < R.y + R.h; y++) for (let x = R.x; x < R.x + R.w; x++) { const t = m.at(x, y); if (t && t.district === FIVE[k]) left.push(k + '@' + x + ',' + y); } });
  return left;
}

section('A. the game\'s seed', () => {
  const m = OM.buildOvermap(GAME), said = C.apply(m);
  ok('A1 the corner is the real south-east and named', said.corner === 'SE' && said.named, said.corner + (said.named ? ', named' : ', plain'));
  const left = leftovers(m);
  ok('A2 no cell of the five pieces is still dam, town, intake or lake water', left.length === 0, left.slice(0, 4).join(' ') || said.changed + ' cells turned');
  const names = [...new Set(said.pieces.map(p => p.name))], dupe = names.filter(n => regionOutside.has(n));
  ok('A3 no name it gives is a real place the region carries outside the box', dupe.length === 0, dupe.join(', ') || names.join(', '));
  ok('A4 every word it gives is an attempt, draft:true', said.pieces.every(p => p.draft === true && p.name && p.what), said.pieces.length + ' pieces');
});

let southMoved = 0, southBreaks = 0, southCarried = 0, south = 0, sideMoved = 0, sideBreaks = 0, side = 0;
section('B. no capital moves on the game\'s seed', () => {
  const a = seats(OM.buildOvermap(GAME)), m = OM.buildOvermap(GAME); C.apply(m); const b = seats(m);
  ok('B1 the seat list is the same cells in the same order', a.list === b.list, a.list.split(' ').length + ' lots');
  const mv = movedIn(a, b);
  ok('B2 none of the eighteen factions\' seats moves', mv.length === 0, mv.join(', ') || IDS.length + ' seats held');
});

section('C. every south-border seed of 210', () => {
  SEEDS.forEach(sd => {
    const m0 = OM.buildOvermap(sd), a = seats(m0), b0 = breaks(m0), m = OM.buildOvermap(sd), said = C.apply(m), b = seats(m);
    const mv = movedIn(a, b).length, br = Math.max(0, breaks(m) - b0);
    if (said.corner[0] === 'S') { south++; if (mv) southMoved++; southBreaks += br; if (said.streetsCarried) southCarried++; }
    else { side++; if (mv) sideMoved++; sideBreaks += br; }
  });
  ok('C1 no capital moves on any south-border seed', southMoved === 0, south + ' seeds, ' + southMoved + ' moved');
  ok('C2 no street stops dead on any south-border seed', southBreaks === 0, southBreaks + ' stubs');
  ok('C3 no street is carried on any south-border seed (the roads are untouched there)', southCarried === 0, southCarried + ' carried');
  say('the side-edge seeds, [the roll]\'s own finding (axisFlip puts the cluster on a side edge)', side + ' seeds: capitals move on ' + sideMoved + ', ' + sideBreaks + ' short stubs');
});

section('D. nothing calls it yet', () => {
  const callers = ['engine/bohemia_overmap.js', 'engine/bohemia_world.js', 'engine/bohemia_loop.js', 'slices/BOHEMIA_CITY_WORLD.html', 'slices/BOHEMIA_DEMO.html']
    .filter(f => fs.existsSync(path.join(ROOT, f)) && /BohemiaTheRealCorner|bohemia_the_real_corner/.test(read(f)));
  ok('D1 the roll, the world, the loop, the city and the demo carry no call', callers.length === 0, callers.join(', ') || '5 files clean');
  const m = OM.buildOvermap(GAME);
  ok('D2 a fresh build is the roll\'s own valley (the five pieces as the 7/5 layout lays them)', leftovers(m).length > 0 && !m.realCorner, leftovers(m).length + ' cells of the cluster');
});

section('E. pure', () => {
  const m = OM.buildOvermap(GAME), before = m.tiles.map(t => t.district).join(','); C.plan(m);
  ok('E1 plan() changes nothing', m.tiles.map(t => t.district).join(',') === before);
  C.apply(m); const again = C.plan(m);
  ok('E2 apply() twice changes nothing the second time', again.changed === 0, again.changed + ' cells');
});

section('F. the once-check under it', () => {
  const m = OM.buildOvermap(GAME); C.apply(m);
  const still = [], L = m.layout;
  const has = (k, kinds) => { const R = L[k]; for (let y = R.y; y < R.y + R.h; y++) for (let x = R.x; x < R.x + R.w; x++) { const t = m.at(x, y); if (t && kinds.indexOf(t.district) >= 0) return true; } return false; };
  [['damR', ['dam'], 'HOOVER DAM'], ['boulder', ['town'], 'BOULDER CITY'], ['mead', ['water'], 'LAKE MEAD'], ['lakeLV', ['water'], 'LAKE LAS VEGAS'], ['intake', ['intake'], 'THE INTAKE'],
   ['landfill', ['landfill'], 'APEX LANDFILL'], ['quarry', ['quarry'], 'SLOAN'], ['mtChar', ['mountain', 'estate'], 'MT CHARLESTON LODGE']]
    .forEach(r => { if (L[r[0]] && has(r[0], r[1])) still.push(r[2]); });
  ok('F1 only the three owed by other rows still stand twice', still.length === 3 && still.indexOf('HOOVER DAM') < 0, still.join(', '));
});

section('M. mutations, each must bite', () => {
  /* a relabel that changes a cell's class (the town to rock) takes lots out of the seat list */
  const a = seats(OM.buildOvermap(GAME)), m = OM.buildOvermap(GAME), said = C.plan(m);
  said.pieces.forEach(p => p.cells.forEach(c => { m.at(c[0], c[1]).district = p.key === 'boulder' ? 'mountain' : p.to; }));
  const b = seats(m);
  ok('M1 the town turned to rock instead is caught by the seat list', a.list !== b.list, movedIn(a, b).length + ' seats would move');
  const saved = C.NAMES.SE.boulder.name; C.NAMES.SE.boulder.name = 'BOULDER CITY';
  const m2 = OM.buildOvermap(GAME), s2 = C.plan(m2), dupe = s2.pieces.some(p => regionOutside.has(p.name));
  C.NAMES.SE.boulder.name = saved;
  ok('M2 a name that is the region\'s own far place is caught', dupe);
});

console.log('\n' + (fail ? 'THE REAL CORNER: RED' : 'THE REAL CORNER: GREEN') + '  ' + pass + '/' + fail);
process.exit(fail ? 1 : 0);
