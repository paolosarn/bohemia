#!/usr/bin/env node
/* BOHEMIA — BELTWAY PLACED GATE (9/22/26, WORLD lane, row [beltway placed])
 *
 * The row: 'beltway' is in the graphics engine, the district kit's road set and
 * the arterial module, and on ZERO cells of a real 96x96 map. Decide by
 * measuring: either the overmap places it, or the name is retired.
 *
 * *** IT IS NEITHER. THE OVERMAP ALREADY PLACES IT AND CALLS IT SOMETHING ELSE. ***
 *
 * The resolver carries a block commented, in its own words, "BELTWAY: a RECTANGLE
 * ring with square corners, 2 wide, snapped mid-block". It computes the ring off
 * `beltRect`, which is load-bearing geometry the map already uses to place the
 * airbase, the datafort, the exits and the speedway. Then its last line says
 * `return DISTRICT.FREEWAY`.
 *
 * MEASURED ACROSS THREE SEEDS, separating the I-15 spine, the exits and the
 * mountain passes that legitimately cross the ring:
 *
 *     seed 1337   ring 532 cells   spine 16  exits 12  passes 12   RING 492
 *     seed    7   ring 568 cells   spine 16  exits 12  passes 30   RING 510
 *     seed   42   ring 568 cells   spine 16  exits 16  passes 24   RING 512
 *
 * About five hundred cells a seed ARE the Las Vegas Beltway and every one of them
 * reports as freeway. The name is not unplaced. IT IS MISLABELLED.
 *
 * *** AND THE FIX IS NOT ONE LINE, WHICH IS THE REASON THIS GATE EXISTS. ***
 * bohemia_powergrid's street list already contains 'beltway' -- that lane was
 * ready. BOH_OMBRIDGE.STREET_DISTRICTS does NOT, in three copies. So renaming the
 * resolver on its own would stop five hundred cells being STREETS to the district
 * kit, the plot generator's street edges and the landlocked law, all at once and
 * silently. A one-line fix to a two-line problem is how a rename becomes an
 * outage.
 *
 * SO THIS GATE PINS BOTH HALVES so the correction cannot be done half-way, and
 * holds the decision: PLACE IT. A ring road is real Las Vegas geography, the map
 * already computes it, and MAP LAW is not in the way because nothing here designs
 * a layout -- the layout exists and this is the label on it.
 *
 * NOT SHIPPED (rule 18): the rename touches the walked world's map generator and
 * is none of loading, walking or the fight. It is measured, gated and ready.
 *
 *   node gates/beltway_placed_gate.js
 */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const R = (p) => require(path.join(ROOT, p));

const OM = R('engine/bohemia_overmap.js');
const PG = R('engine/bohemia_powergrid.js');

let pass = 0, fail = 0;
const ok = (n, c, note) => {
  if (c) pass++;
  else { fail++; console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')); }
};
const section = (name, fn) => {
  try { return fn(); }
  catch (e) { fail++; console.log('  > FAIL ' + name + ' could not be measured  [' + (e && e.message) + ']'); }
};

const SEEDS = [1337, 7, 42];

/* count the ring, and split off what legitimately crosses it */
function ringOf(seed) {
  const L = OM.layoutFromSeed(seed), m = OM.buildOvermap(seed);
  const { lft, rgt, top, bot } = L.beltRect;
  let ring = 0, crossing = 0, pure = 0, named = 0;
  const reports = {};
  for (let y = 0; y < 96; y++) for (let x = 0; x < 96; x++) {
    const onV = (x === lft || x === lft + 1 || x === rgt - 1 || x === rgt) && y >= top && y <= bot;
    const onH = (y === top || y === top + 1 || y === bot - 1 || y === bot) && x >= lft && x <= rgt;
    if (!(onV || onH)) continue;
    ring++;
    const d = m.at(x, y).district;
    reports[d] = (reports[d] || 0) + 1;
    if (d === 'beltway') named++;
    const isSpine = (x === L.fwyX || x === L.fwyX + 1) ||
                    (y === L.bendNorthY || y === L.bendNorthY + 1);
    const isExit = (L.exits || []).some(e => (x === e.x || x === e.x + 1) && y >= e.y0 && y <= e.y1);
    const isPass = (L.passesA || []).concat(L.passesB || []).some(p => y === p || x === p);
    if (isSpine || isExit || isPass) crossing++; else pure++;
  }
  return { ring, crossing, pure, named, reports, L };
}

/* ---- A. THE RING IS REAL AND IT IS ON THE MAP --------------------------- */
section('A the ring is already placed', () => {
  SEEDS.forEach(seed => {
    const r = ringOf(seed);
    console.log('    [measured] seed ' + String(seed).padStart(4) + '  ring ' + r.ring
      + ' cells, ' + r.crossing + ' crossed by the spine/exits/passes, '
      + r.pure + ' PURE RING, reporting as ' + JSON.stringify(r.reports));
    ok('seed ' + seed + ': the map computes a ring of real size (' + r.pure + ' cells)',
       r.pure > 300 && r.pure < 900);
  });

  /* the geometry is load-bearing, which is why retiring the name was never on */
  const L = OM.layoutFromSeed(1337);
  ok('*** beltRect IS LOAD-BEARING GEOMETRY, not decoration ***',
     !!L.beltRect && typeof L.beltRect.lft === 'number' && L.beltRect.rgt > L.beltRect.lft,
     JSON.stringify(L.beltRect));
  const src = fs.readFileSync(path.join(ROOT, 'engine/bohemia_overmap.js'), 'utf8');
  ok('and the map uses it to place other things (the airbase, the datafort)',
     (src.match(/beltRect/g) || []).length > 5,
     (src.match(/beltRect/g) || []).length + ' uses');
  ok('the resolver has a block that calls itself the BELTWAY',
     /BELTWAY: a RECTANGLE ring/.test(src));
});

/* ---- B. AND IT IS LABELLED SOMETHING ELSE ------------------------------- */
section('B the name is mislabelled, not unplaced', () => {
  const r = ringOf(1337);
  ok('*** NOT ONE CELL IN THE VALLEY IS NAMED beltway ***', r.named === 0);
  ok('and the ring reports as freeway instead',
     (r.reports.freeway || 0) === r.ring, JSON.stringify(r.reports));

  /* the whole valley, so "zero beltway cells" is stated about the map and not
     only about the ring */
  const m = OM.buildOvermap(1337);
  let any = 0;
  for (let y = 0; y < 96; y++) for (let x = 0; x < 96; x++)
    if (m.at(x, y).district === 'beltway') any++;
  ok('zero across the whole map, which is the row\'s own measurement', any === 0);

  ok('while beltway IS a declared district',
     Object.values(OM.DISTRICT).indexOf('beltway') >= 0);
});

/* ---- C. *** THE FIX IS TWO LINES AND THIS IS THE SECOND ONE *** --------- */
section('C the rename alone would un-street five hundred cells', () => {
  /* the power grid was ready: its own street list already carries the name */
  const grid = fs.readFileSync(path.join(ROOT, 'engine/bohemia_powergrid.js'), 'utf8');
  const gs = (grid.match(/const STREETS=\[([^\]]*)\]/) || [])[1] || '';
  ok('*** THE POWER GRID ALREADY KNOWS THE NAME *** (' + gs + ')',
     /beltway/.test(gs), gs);

  /* the bridge was not, and that is the trap */
  const bridges = ['engine/bohemia_overmap_bridge.js',
                   'engine/bohemia_engine_graphics_7_14_26.js',
                   'engine/BOHEMIA_GRAPHICS_ENGINE_MASTER_7_16_26.js']
    .filter(f => fs.existsSync(path.join(ROOT, f)));
  const missing = [];
  bridges.forEach(f => {
    const s = fs.readFileSync(path.join(ROOT, f), 'utf8');
    const m2 = s.match(/STREET_DISTRICTS\s*=\s*\[([^\]]*)\]/);
    if (!m2) return;
    if (!/beltway/.test(m2[1])) missing.push(f);
  });
  console.log('    [measured] STREET_DISTRICTS without beltway: ' + missing.length
    + ' of ' + bridges.length + ' copies');
  ok('*** THE BRIDGE\'S STREET LIST DOES NOT, IN EVERY COPY -- so a lone rename'
   + ' would stop the ring being a street to the district kit, the plot'
   + ' generator and the landlocked law ***',
     missing.length === bridges.length || missing.length === 0,
     'a PARTIAL fix is the one thing this must never be: ' + missing.join(', '));

  /* and the two halves must move together, which is what this asserts */
  const src = fs.readFileSync(path.join(ROOT, 'engine/bohemia_overmap.js'), 'utf8');
  const renamed = /BELTWAY: a RECTANGLE ring[\s\S]{0,400}?return DISTRICT\.BELTWAY/.test(src);
  const streeted = missing.length === 0;
  ok('*** THE TWO HALVES ARE IN STEP: either both done or neither ***',
     renamed === streeted,
     renamed ? 'the resolver was renamed but STREET_DISTRICTS was not: five hundred cells just stopped being streets'
             : 'STREET_DISTRICTS carries beltway while the resolver still says freeway, which is harmless but half a fix');

  /* drivability is safe either way, and saying so is part of the decision */
  ok('beltway is already a ROAD in the overmap\'s own table',
     /ROAD=\{[^}]*beltway/.test(src));
  ok('and a BIG district, so it is never a one-cell plot',
     /BIG=new Set\(\[[\s\S]{0,300}?BELTWAY/.test(src));
});

/* ---- D. THE DECISION, AND THE COOK -------------------------------------- */
section('D the decision and the drawn thing', () => {
  /* the row offered two doors and the measurement chose: PLACE IT. */
  const rec = path.join(ROOT, 'records/BOHEMIA_WORLD_THE_RING_IS_THERE_AND_CALLED_A_FREEWAY_9_22_26.md');
  ok('the decision is written down where a reader will find it', fs.existsSync(rec));

  const png = path.join(ROOT, 'slices/vote/WORLD_THE_RING_ROAD.png');
  ok('rule 29: the cook is a thing drawn', fs.existsSync(png));
  if (fs.existsSync(png)) {
    const b = fs.readFileSync(png);
    ok('and it is a real PNG', b.length > 1000 && b[0] === 0x89 && b[1] === 0x50,
       b.length + ' bytes');
  }
  const bank = path.join(ROOT, 'banks/BOHEMIA_THE_RING_ROAD_9_22_26.txt');
  ok('with a bank behind it that parses', fs.existsSync(bank) &&
     !!JSON.parse(fs.readFileSync(bank, 'utf8')).build_source);
});

console.log('BELTWAY PLACED GATE: ' + pass + ' passed, ' + fail + ' failed'
  + '  (the ring is already on the map and called a freeway; the rename and the'
  + ' street list must move together or five hundred cells stop being streets)');
process.exit(fail ? 1 : 0);
