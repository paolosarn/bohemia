#!/usr/bin/env node
/* ============================================================================
   LEGEND KEPT GATE (8/20/26, WORLD lane) — every tile a district PROMISES, it MAKES.

   THE DEFECT THIS EXISTS FOR, found 8/20 on the arterial. A district module ships a
   LEGEND: a numbered list of every tile the cell contains, each with a name, a kind,
   and a sentence of act-1 flavour. DISTRICT DOSSIER LAW (Paolo 7/19, "keep that in
   mind moving forward") makes that legend the record of what the place IS — the
   tiling phase, the interior phase and every judging surface read it and believe it.

   The arterial's legend listed eighteen tiles. THE GENERATOR EMITTED SEVEN. A 96 x 96 m
   arterial cell — the most-walked type in the game, 2,434 of the valley's 9,216 — put
   TWO OBJECTS on the ground. The bus stop, the dead car, the storm inlet, the power
   poles, the street trees and the only yellow line on the street were all written,
   all called every bake, and all silently produced nothing.

   SIX SEPARATE PLACEMENTS, ONE CAUSE, AND IT IS THE CAUSE THIS GATE IS SHAPED AROUND:
   A CONSTANT MOVED AND ITS DEPENDENTS STAYED BEHIND. Paolo's 8/11 "the streets should
   FILL THE WHOLE FUCKING BOX" widened the pavement, which moved BOX from small to 46
   and moved the amenity band from 47..63 to 47..52 — and then:

     poles + trees   placed at offsets 56..61, which USED to be landscape setback and
                     became SIDEWALK. put() only writes over the amenity code, so 100%
                     of them were computed, handed over, and dropped.
     streetlights    guarded by `|t - C| <= BOX` — a junction guard on a cell with no
                     junction. BOX 46 swallows 93 of 128 rows, leaving exactly two.
     bus stop        range 26..85, guard needs < 18 or > 110. The range and the guard
                     DO NOT INTERSECT. Not rare — impossible, at every seed, forever.
     dead car        range 20..99, guard needs < 14 or > 114. Same.
     turn pocket     needs `oa >= BOX + 1 && oa <= POCKET` = ">= 47 and <= 30". Empty.

   Every one of those is silent. Nothing throws, nothing warns, the cell still renders,
   and eleven of eighteen legend entries quietly describe a world that is not there.
   A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED — so here is the machine.

   WHAT IT CHECKS: for every legend a district registers, generate that district in
   every mode it really has and assert each code is actually emitted at least once.

   TWO THINGS IT IS CAREFUL ABOUT, because a checker that cannot tell a mention from a
   use is the broken one (HOW HAIR AND SHAPE WORK, 8/1):

     1. LEGENDS ARE SHARED. arterial and arterial_x are one module and one LEGEND
        object; the run has no crosswalk and the crossing has no mid-block bus stop,
        and neither is a defect. So the unit here is the LEGEND, not the type: a code
        passes if ANY type sharing that legend emits it. Measured, this alone was the
        difference between 82 findings and 57, before today's six fixes took it to 55.
     2. MODES. Six street configs plus the 4-way, plus a synthetic 3x3 cluster block
        walked window by window, because a cluster district lays its runway or its
        stack in VALLEY coordinates and each cell copies its own window — generate it
        without bounds and of course the terminal never appears.

   RATCHET, like squint, hue and icon, and for the same reason: 55 codes across 28
   legend families are still unplaced after today's arterial fixes and a gate that goes red on day one is a comment
   nobody can act on. The debt is NAMED below and may only SHRINK. Fixing one and
   leaving it listed fails too — a debt list that lies about being paid is worse than
   no list, because it hides the next regression behind a name that is already there.

     node gates/legend_kept_gate.js
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const K = require(path.join(ROOT, 'engine/bohemia_district_kit.js'));
require(path.join(ROOT, 'engine/bohemia_world.js'));   // registers every generator

let pass = 0, fail = 0;
const ok = (n, c, d) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n + (d ? '  -- ' + d : ''))); };

/* THE DEBT, 8/20. Each line is one legend family and the codes it declares but never
   emits. THIS LIST MAY ONLY SHRINK. Do not add to it: new work places what it declares,
   or does not declare it.

   Three different things are on this list and they have three different fixes, so the
   next session should read before reaching for the generator:

     a) A RULING RETIRED THE FEATURE. freeway's overpass deck and bridge columns are
        here because Paolo killed them on 8/11 -- "the freeway overpass underpass
        shit... its looking god awfully terrible" -- and sent the deck to the
        INTERCHANGE, which still builds it. THE FIX IS TO DELETE THE LEGEND ENTRY, not
        to place the tile. Placing it would undo his ruling. (arterial's block wall was
        on this list at 09:00 and was deleted the same way by noon.)
     b) THE CODE IS A SAFETY FLOOR. `0` is the value K.grid() fills with, so several
        legends name it for the case where a generator leaves a hole; a legend entry
        for 0 that never appears is the SUCCESS case, not a defect. Left listed rather
        than special-cased, because special-casing 0 would hide a generator that really
        did leave the cell empty.
     c) IT IS A REAL UNBUILT PROMISE. Everything else. mountain declares a ravine
        floor, a dry drainage, boulders and an alluvial fan and builds none of them;
        the airport declares jet bridges and dead airliners and parks nothing. These
        are the arterial's bug wearing a different hat, and they are what this list is
        for.                                                                          */
const DEBT = {
  'airbase+airport': [7, 10, 11, 12, 17],
  'freeway':         [0, 12, 13, 16, 17],
  'mountain':        [4, 5, 6, 7, 8],
  'reservoir':       [9, 11, 14],
  'arsenal':         [11, 13, 14],
  'basin':           [11, 13, 14],
  'rail':            [12, 13, 14],
  'watertreat':      [3, 11],
  'substation':      [3, 11],
  'fueldepot':       [9, 14],
  'reclaim':         [11, 14],
  'radio':           [6, 11],
  'interchange':     [2, 14],
  'strip+strip_x':   [0, 16],
  'arterial+arterial_x': [0],
  'suburb':          [5],
  'industrial':      [0],
  'boneyard':        [9],
  'railyard':        [3],
  'quarry':          [11],
  'gypsum':          [11],
  'jail':            [3],
  'downtown':        [0],
  'warehouse':       [10],
  'desert':          [8],
  'resort':          [9],
  'casino':          [7],
  'convention':      [5],
};

/* EVERY MODE A DISTRICT REALLY HAS. Six street configs, the 4-way, and a synthetic
   3x3 cluster block walked window by window (a cluster district lays its content in
   VALLEY coordinates against the blob bounds, and each cell copies its own window). */
function modes() {
  const out = [['S'], ['N'], ['E'], ['W'], ['S', 'E'], ['N', 'W'], ['N', 'S', 'E', 'W']]
    .map(c => ({ streets: c }));
  for (let fy = 0; fy < 3; fy++) {
    for (let fx = 0; fx < 3; fx++) {
      out.push({
        streets: ['S'], fx: fx, fy: fy,
        bounds: { x0: 0, x1: 2, y0: 0, y1: 2, cells: 9 },
        approach: { n: [0, 1, 2], s: [0, 1, 2], e: [0, 1, 2], w: [0, 1, 2] },
      });
    }
  }
  return out;
}
const SEEDS = [7, 2654435761, 40503];

// group the registry by the legend OBJECT itself, so siblings that share one legend
// are judged together (see care note 1 above)
const families = new Map();
for (const t of K.types()) {
  const spec = K.get(t);
  if (!spec || !spec.legend || typeof spec.generate !== 'function') continue;
  if (!families.has(spec.legend)) families.set(spec.legend, []);
  families.get(spec.legend).push(t);
}
ok('the district registry has legends to check (' + families.size + ' families)', families.size > 20);

const found = {};          // family name -> codes declared but never emitted
let declared = 0, unplaced = 0;
for (const [legend, types] of families) {
  const name = types.slice().sort().join('+');
  const used = new Set();
  for (const t of types) {
    const spec = K.get(t);
    for (const o of modes()) {
      for (const sd of SEEDS) {
        try {
          const r = spec.generate(sd, JSON.parse(JSON.stringify(o)));
          if (!r || !r.g) continue;
          for (const row of r.g) for (const v of row) used.add(v);
        } catch (e) { /* a generator that throws is another gate's problem */ }
      }
    }
  }
  const codes = Object.keys(legend).map(Number).sort((a, b) => a - b);
  declared += codes.length;
  const never = codes.filter(c => !used.has(c));
  unplaced += never.length;
  if (never.length) found[name] = never;
}

// 1. NOTHING NEW. A family that starts declaring tiles it does not build is the bug.
const regressions = [];
for (const [fam, codes] of Object.entries(found)) {
  const allowed = DEBT[fam] || [];
  const fresh = codes.filter(c => allowed.indexOf(c) < 0);
  if (fresh.length) regressions.push(fam + '(' + fresh.join(',') + ')');
}
ok('every tile a district DECLARES, it MAKES: no legend entry describes a tile the '
  + 'generator never emits (' + unplaced + ' known-unplaced of ' + declared + ' declared)',
  !regressions.length, regressions.slice(0, 8).join(' '));

// 2. AND THE DEBT ONLY SHRINKS. A fixed code left on the list hides the next regression.
const stale = [];
for (const [fam, codes] of Object.entries(DEBT)) {
  const still = found[fam] || [];
  const paid = codes.filter(c => still.indexOf(c) < 0);
  if (paid.length) stale.push(fam + '(' + paid.join(',') + ')');
}
ok('the debt list is honest: every code still named in DEBT is still really unplaced. '
  + 'Fix one and take it off the list in the same commit, or the list starts lying and '
  + 'the next regression hides behind a name that was already there',
  !stale.length, stale.slice(0, 8).join(' '));

// 3. AND THE LIST CANNOT BE PADDED WITH FAMILIES THAT DO NOT EXIST.
const ghosts = Object.keys(DEBT).filter(f => !f.split('+').every(t => K.get(t)));
ok('every family named in DEBT is a real registered district', !ghosts.length, ghosts.join(' '));

const worst = Object.entries(found).sort((a, b) => b[1].length - a[1].length).slice(0, 6);
console.log('\n  DECLARED BUT NEVER BUILT, worst families:');
for (const [fam, codes] of worst) {
  const legend = K.get(fam.split('+')[0]).legend;
  console.log('    ' + fam.padEnd(22) + codes.map(c => c + '=' + legend[c].name).join(', '));
}
console.log('    ' + unplaced + ' of ' + declared + ' declared tiles across '
  + Object.keys(found).length + ' families are promises the world does not keep.');
console.log('\n=== LEGEND KEPT GATE: ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
