#!/usr/bin/env node
/* BOHEMIA — BOARD TERRAINS GATE (9/30/26, WORLD lane)
 *
 * ROW [board terrains], RULE 46 (Paolo 9/29): "no single combat map in Battle
 * Brothers is exactly the same... different terrains, nature zones, tile
 * blockers... let's just recreate Battle Brothers with our whole swag", and the
 * correction that shapes it: MOST FIGHTS ARE BLOCK WARS, most cells are CITY
 * kinds, nature kinds are the EDGE.
 *
 *  A  *** EVERY CELL A FIGHT CAN START ON HAS A KIND, ACROSS MANY VALLEYS. ***
 *     A cell whose district no kind claims is a fight with no board under it, and
 *     it does not announce itself: it is the one seed in twenty where a player
 *     falls through. Rule 40(g) rolls the valley per new game, so the sweep is
 *     over ten seeds and never one.
 *
 *  B  *** AND ONE SEED IS NOT THE VALLEY, WHICH THIS TABLE LEARNED THE HARD WAY. ***
 *     Built against seed 1337 alone it read 75 districts and mapped 9,216 of
 *     9,216 cells — a clean sweep, and wrong. A hundred seeds make SEVENTY-EIGHT
 *     districts; the three that seed 1337 never places (drivein, library, fort)
 *     would each have been unmapped ground. This gate exists so the next district
 *     to appear is caught by the machine and not by a player.
 *
 *  C  IT INVENTS NO DISTRICT. Every name the table claims is one the generator
 *     really makes — the same leg this lane's own place gate caught it failing on
 *     9/27, when it had added a "garage" the overmap never generates.
 *
 *  D  HIS RULING IS A PROPORTION AND IT IS MEASURED: city is most, nature is the
 *     edge.
 *
 *  E  *** TWO OF THE FIFTEEN ARE NOT MAP KINDS AND MUST STAY AT ZERO. *** ruin is
 *     a CONDITION (act one IS the ruin) and casino_floor is an INTERIOR. If either
 *     ever gets cells, somebody has quietly turned a state or a room into ground.
 *
 *  F  WHAT A BOARD LOOKS LIKE IS NOT THIS LANE'S: ASSETS ships empty and asking
 *     answers NO_RULING by name. Nothing in the module draws.
 *
 *  G  THE DATA FILE AND THE PICTURE AGREE WITH THE MODULE, and the picture's tones
 *     can actually be told apart — the first palette had seven pairs the eye reads
 *     as one colour, on a picture whose whole job is showing a proportion.
 *
 *   node gates/board_terrains_gate.js
 */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const P = (...a) => path.join(ROOT, ...a);
const R = (p) => require(P(p));
const read = (p) => fs.readFileSync(P(p), 'utf8');

let pass = 0, fail = 0;
const ok = (n, c, note) => {
  if (c) pass++;
  else { fail++; console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')); }
};
const section = (name, fn) => {
  try { return fn(); }
  catch (e) { fail++; console.log('  > FAIL ' + name + ' could not be measured  [' + (e && e.message) + ']'); }
};

const BT = R('engine/bohemia_boardterrain.js');
const OM = R('engine/bohemia_overmap.js');
const DATA = JSON.parse(read('records/target/BOHEMIA_BOARD_TERRAINS.json'));
const DOC = JSON.parse(read('banks/BOHEMIA_FIFTEEN_GROUNDS_9_30_26.txt'));

/* TEN SEEDS, NOT ONE. Cheap enough to run every suite pass and it is the whole
   point of the row. */
const SEEDS = [1, 7, 42, 1337, 2024, 5, 777, 99999, 31337, 123456];
const seen = {}, holes = {};
let city = 0, nature = 0, cells = 0;
SEEDS.forEach(s => {
  const c = BT.census(OM.buildOvermap(s));
  cells += c.cells; city += c.city; nature += c.nature;
  for (const d in c.byDistrict) seen[d] = (seen[d] || 0) + c.byDistrict[d];
  for (const d in c.unmappedDistricts) holes[d] = (holes[d] || 0) + c.unmappedDistricts[d];
});

/* ---- A + B. EVERY CELL HAS A KIND, ACROSS MANY VALLEYS ------------------ */
section('A every cell a fight can start on has a kind', () => {
  console.log('    [measured] ' + SEEDS.length + ' valleys, ' + cells + ' cells, '
    + Object.keys(seen).length + ' distinct districts');
  ok('the sweep really looked at more than one valley', SEEDS.length >= 10);
  ok('*** NOT ONE CELL IN ANY OF THEM IS ON UNMAPPED GROUND ***',
     Object.keys(holes).length === 0,
     'unmapped: ' + Object.keys(holes).join(', '));
  ok('and the fifteen are the inventory\'s fifteen', BT.KINDS.length === 15);

  /* B. THE THREE SEED 1337 NEVER PLACES. If this leg ever fails it means the
     generator stopped making them, not that the table is wrong — either way
     somebody should look. */
  ['drivein', 'library', 'fort'].forEach(d => {
    ok('the sweep still finds ' + d + ', which seed 1337 alone never places', !!seen[d],
       'the generator no longer makes it');
    ok('  and ' + d + ' has a kind', !!BT.kindOf(d));
  });
  const on1337 = BT.census(OM.buildOvermap(1337));
  ok('*** ONE SEED REALLY IS NOT THE VALLEY: 1337 misses districts the sweep finds ***',
     Object.keys(on1337.byDistrict).length < Object.keys(seen).length,
     Object.keys(on1337.byDistrict).length + ' against ' + Object.keys(seen).length);
});

/* ---- C. IT INVENTS NO DISTRICT ------------------------------------------ */
section('C it invents no district', () => {
  const claimed = [];
  Object.keys(BT.FROM).forEach(k => BT.FROM[k].forEach(d => claimed.push(d)));
  const invented = claimed.filter(d => !seen[d]);
  console.log('    [measured] the table claims ' + claimed.length + ' districts, '
    + (claimed.length - invented.length) + ' of which the generator really makes');
  ok('*** EVERY DISTRICT IT CLAIMS IS ONE THE GENERATOR MAKES ***',
     invented.length === 0, 'invented: ' + invented.join(', '));
  ok('no district is claimed by two kinds at once',
     claimed.length === new Set(claimed).size,
     'duplicated: ' + claimed.filter((d, i) => claimed.indexOf(d) !== i).join(', '));
});

/* ---- D. HIS RULING, MEASURED -------------------------------------------- */
section('D most cells are city, nature is the edge', () => {
  const pct = 100 * city / (city + nature);
  console.log('    [measured] city ' + pct.toFixed(1) + '%, nature ' + (100 - pct).toFixed(1) + '%');
  ok('*** MOST CELLS ARE CITY KINDS ***', pct > 60, pct.toFixed(1) + '%');
  ok('and nature is really there, not rounded away', pct < 95, pct.toFixed(1) + '%');
  ok('the four nature kinds are named, not inferred', BT.NATURE.length === 4);
  ok('every nature kind is one of the fifteen',
     BT.NATURE.every(k => BT.KINDS.indexOf(k) >= 0));
});

/* ---- E. *** THE TWO THAT ARE NOT MAP KINDS *** -------------------------- */
section('E ruin is a condition and the casino floor is an interior', () => {
  ok('both are declared by name with what they are instead',
     BT.NOT_ON_THE_MAP.ruin === 'CONDITION' && BT.NOT_ON_THE_MAP.casino_floor === 'INTERIOR');
  SEEDS.forEach(s => {
    const c = BT.census(OM.buildOvermap(s));
    ok('*** seed ' + s + ' assigns ruin zero cells ***', c.byKind.ruin === 0, String(c.byKind.ruin));
    ok('  and the casino floor zero', c.byKind.casino_floor === 0, String(c.byKind.casino_floor));
  });
  ok('neither claims a district', BT.FROM.ruin.length === 0 && BT.FROM.casino_floor.length === 0);
});

/* ---- F. WHAT A BOARD LOOKS LIKE IS NOT THIS LANE'S ---------------------- */
section('F the module draws nothing and decides no art', () => {
  ok('*** ASSETS SHIPS EMPTY ***', Object.keys(BT.ASSETS).length === 0);
  ok('asking answers NO_RULING and says whose it is',
     BT.assetsOf('suburb_block').why === BT.NO_RULING
     && /COMBAT/.test(BT.assetsOf('suburb_block').because));
  ok('a kind that is not one of the fifteen is refused, not improvised',
     BT.assetsOf('swamp').why === 'NOT_A_KIND');
  const live = read('engine/bohemia_boardterrain.js').replace(/\/\*[\s\S]*?\*\//g, ' ');
  ok('and the module carries no colour, no pixel and no size',
     !/#[0-9a-f]{6}|canvas|fillRect|\bpx\b/i.test(live));
  ok('a cell off the map answers NOT_A_CELL by name',
     BT.at(OM.buildOvermap(1337), -5, -5).why === BT.NOT_A_CELL);
  ok('and unmapped ground would answer by name rather than falling back to a kind',
     /UNMAPPED[\s\S]{0,400}because:/.test(read('engine/bohemia_boardterrain.js')));
});

/* ---- G. THE DATA FILE AND THE PICTURE AGREE WITH THE MODULE ------------- */
section('G one count, not two that can disagree', () => {
  ok('the data file is the module\'s kinds, in order',
     DATA.kinds.join(',') === BT.KINDS.join(','));
  ok('and the module\'s district table, not a second copy',
     JSON.stringify(DATA.fromDistrict) === JSON.stringify(BT.FROM));
  ok('it says it is generated and must not be hand edited', /do not hand edit/i.test(DATA._readme));
  ok('and it says the two that are not map kinds are not map kinds',
     /CONDITION/.test(DATA._readme) && /INTERIOR/.test(DATA._readme));
  ok('*** AND IT SAYS WHAT A BOARD LOOKS LIKE IS NOT IN IT ***',
     /is not here/i.test(DATA._readme) || /NOT IN IT/i.test(DATA._readme));
  console.log('    [measured] data file: ' + DATA.measured.seedsSwept + ' seeds, '
    + DATA.measured.distinctDistricts + ' districts, ' + DATA.measured.unmappedDistricts
    + ' unmapped, city ' + DATA.measured.cityPct + '%');
  ok('the file was built from a real sweep', DATA.measured.seedsSwept >= 100);
  ok('and it reports zero unmapped', DATA.measured.unmappedDistricts === 0);

  /* the picture */
  ok('the picture exists where he can reach it',
     fs.existsSync(P('slices/vote/WORLD_FIFTEEN_GROUNDS.png')));
  ok('it is one pixel per cell, so it is the assignment and not a drawing of it',
     DOC.size.oneCellOnePixel === true && DOC.size.grid === '96x96');
  ok('it is a draft and nothing on a play surface',
     DOC.draft === true && /rule 18/.test(DOC.not_shipped));
  /* *** THE TONES MUST BE TELLABLE APART, and the first palette's were not *** */
  console.log('    [measured] closest pair of tones: ' + DOC.tonesSeparable.closestPair
    + ' (lightness gap ' + DOC.tonesSeparable.lightnessGap
    + ', hue gap ' + DOC.tonesSeparable.hueGap + ')');
  ok('*** NO TWO KINDS ON THE MAP ARE THE SAME COLOUR TO THE EYE ***',
     DOC.tonesSeparable.lightnessGap >= 0.04 || DOC.tonesSeparable.hueGap >= 25);
  /* the tool's refusals are LIVE, not prose */
  const tool = read('tools/bohemia_board_terrains_cook_9_30_26.js')
    .replace(/\/\*[\s\S]*?\*\//g, ' ');
  ok('the no-board refusal is a live statement, not a comment',
     /A fight there would have no board[\s\S]{0,60}process\.exit\(1\)/.test(tool));
  ok('the invented-district refusal is live',
     /never makes[\s\S]{0,80}process\.exit\(1\)/.test(tool));
  ok('the same-colour refusal is live',
     /same colour to the eye[\s\S]{0,200}process\.exit\(1\)/.test(tool));
  ok('and it refuses if the picture and the module disagree',
     /must agree with the engine[\s\S]{0,60}process\.exit\(1\)/.test(tool));
});

console.log('BOARD TERRAINS GATE: ' + pass + ' passed, ' + fail + ' failed'
  + '  (every cell across ten valleys has a terrain kind, the table invents no'
  + ' district, city is ' + (100 * city / (city + nature)).toFixed(0) + '% and nature the edge,'
  + ' and the ruin and the casino floor stay at zero because one is a condition and'
  + ' the other is a room)');
process.exit(fail ? 1 : 0);
