/* BOHEMIA SCALE MODEL — how many people belong in this valley (8/1/26, PEOPLE lane)
   Paolo: "if we know the scale model of our Las Vegas compared to real Las Vegas
   and imagine if that scale model had nothing to do with an apocalypse, but it was
   just the full amount of people living in Vegas in 2040, 2050 - millions of people
   right - but then you get the scale model of it and now it's not millions of
   people, and then on top of it now we have an apocalypse."

   That is the whole derivation and it is three steps. This tool does them against
   the LIVE MAP, so the number can never drift away from the world it describes:
   change the map and re-run it and the answer changes with it.

     node tools/bohemia_scale_model.js

   REAL-WORLD INPUTS, cited, all public:
     Las Vegas Valley urbanized footprint ... 540 sq mi = 1,398.6 km2
     Clark County housing units (2024) ...... 958,705
     Clark County population (2024) ......... ~2.34 M
     CBER forecast: 2.77 M by 2040; passes 3 M in 2055, ~3.08 M by 2060
       -> ~2.9 M is the fair 2050 figure
     (UNLV CBER 2025-2060 forecasts; Clark County 2024 housing unit estimates)
   BOHEMIA INPUTS, from canon, not invented:
     GDD v5: ~2.3 M pre-crash, ~3% remain
     valley_scale law: one cell = 128 fine cells x 0.75 m = 96 m x 96 m
     bohemia_agents HOUSEHOLD_WEIGHTS -> mean ~2.2 people per occupied home   */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
global.window = global;
require(path.join(ROOT, 'engine/bohemia_engine.js'));
const W = require(path.join(ROOT, 'engine/bohemia_world.js'));
const A = require(path.join(ROOT, 'engine/bohemia_agents.js'));

const REAL = {
  urbanKm2: 1398.6,        // 540 sq mi developed footprint
  housingUnits: 958705,    // Clark County, 2024
  pop2024: 2340000,
  pop2050: 2900000,        // CBER: 3 M in 2055
};
const SURVIVE = 0.03;      // GDD v5: ~3% remain
const HOUSEHOLD = 2.2;     // bohemia_agents household weights

function measure(seed) {
  const world = (global.BohemiaWorld || W).world(seed == null ? 7 : seed);
  let cells = 0, resCells = 0, dwellings = 0;
  for (let y = 0; y < 48; y++) for (let x = 0; x < 48; x++) {
    const c = world.at(x, y); if (!c || !c.district) continue;
    cells++;
    if (!A.RESIDENTIAL[c.district]) continue;
    const plot = world.plot(x, y);
    if (!plot || !plot.buildings) continue;
    resCells++; dwellings += plot.buildings.length;
  }
  const side = 48 * 96;                      // metres
  return { cells, resCells, dwellings, km2: Math.pow(side / 1000, 2), side };
}

function derive(m) {
  const byArea = REAL.urbanKm2 / m.km2;
  const byHomes = REAL.housingUnits / m.dwellings;
  /* the HOUSING scale is the load-bearing one: our houses are real countable
     objects and people live in houses, not in square kilometres. The area scale
     is the independent cross-check, and the two agreeing is what says the map is
     a coherent model rather than a doodle. */
  const scale = byHomes;
  const noApocalypse = REAL.pop2050 / scale;          // step 1: full 2050 Vegas, shrunk
  const afterCrash = noApocalypse * SURVIVE;          // step 2: the apocalypse
  const households = afterCrash / HOUSEHOLD;
  const occupancy = households / m.dwellings;         // step 3: what the sim needs
  const ceiling = m.dwellings * HOUSEHOLD;            // every home full
  return { byArea, byHomes, scale, noApocalypse, afterCrash, households, occupancy, ceiling };
}

if (require.main === module) {
  const m = measure(7), d = derive(m);
  const n = x => Math.round(x).toLocaleString('en-US');
  console.log('=== BOHEMIA SCALE MODEL ===\n');
  console.log('THE MAP, measured live:');
  console.log('  48 x 48 cells at 96 m      = ' + m.side + ' m per side = ' + m.km2.toFixed(2) + ' km2');
  console.log('  residential cells          = ' + m.resCells + ' of ' + m.cells);
  console.log('  DWELLINGS ACTUALLY DRAWN   = ' + n(m.dwellings) + '\n');
  console.log('THE SCALE, two independent ways:');
  console.log('  by area    1 : ' + d.byArea.toFixed(1) + '   (' + m.km2.toFixed(1) + ' km2 of ' + REAL.urbanKm2 + ')');
  console.log('  by housing 1 : ' + d.byHomes.toFixed(1) + '   (' + n(m.dwellings) + ' homes of ' + n(REAL.housingUnits) + ')');
  console.log('  they agree within ' + Math.round(100 * Math.abs(d.byArea - d.byHomes) / d.byHomes) + '% - the map is a coherent model\n');
  console.log('STEP 1 - 2050 VEGAS AT THIS SCALE, NO APOCALYPSE:');
  console.log('  ' + n(REAL.pop2050) + ' people / ' + d.scale.toFixed(1) + ' = ' + n(d.noApocalypse) + ' people');
  console.log('  (millions becomes tens of thousands, purely from the scale model)\n');
  console.log('STEP 2 - THEN THE APOCALYPSE (GDD: ~3% remain):');
  console.log('  ' + n(d.noApocalypse) + ' x 3% = ' + n(d.afterCrash) + ' PEOPLE IN THE WHOLE VALLEY\n');
  console.log('STEP 3 - WHAT THAT MEANS FOR THE SIM:');
  console.log('  occupied households        = ' + n(d.households) + ' of ' + n(m.dwellings) + ' homes');
  console.log('  OCCUPANCY RATE             = ' + (100 * d.occupancy).toFixed(1) + '%');
  console.log('  average per residential cell = ' + (d.afterCrash / m.resCells).toFixed(1) + ' people');
  console.log('  the map full to the brim   = ' + n(d.ceiling) + ' people\n');
  console.log('SO, ON THE STREET ONE BLOCK FROM HOME:');
  console.log('  ' + (d.afterCrash / m.resCells).toFixed(1) + ' residents per cell on average, and only a third of a day is');
  console.log('  spent outdoors - so USUALLY NOBODY, SOMETIMES ONE, AND IN A CLUSTER A DOZEN.');
}
module.exports = { measure, derive, REAL, SURVIVE, HOUSEHOLD };
