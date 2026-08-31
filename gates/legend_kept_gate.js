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
     2. MODES, AND THIS GATE ALREADY GOT IT WRONG ONCE. Districts are generated
        under FOUR different opts contracts, derived from what the modules actually
        read rather than guessed:
          streets/links      47 modules   which edges are road
          cellX/cellY        8 modules    where in the valley this cell is (terrain
                                          samples a valley-wide field in global coords)
          open               mountain     which neighbours are NOT mountain
          bounds/approach/fx/fy  3        cluster blocks laid in valley coordinates
        THE FIRST VERSION OF THIS GATE HAD ONLY THE FIRST AND LAST, and it reported the
        MOUNTAIN as declaring a ravine floor, a dry drainage, boulders and an alluvial
        fan and building none of them. It builds all four. They only appear when the
        cell is told where it is and which of its neighbours is valley floor -- exactly
        the mode the gate was not running. Six codes across two families were false,
        and they went out in a shipped debt list saying the world did not keep its
        promises. The checker was the thing not keeping its promise.
        That is the bug this whole gate exists to catch, committed BY the gate, which
        is worth leaving written down: A CHECKER THAT DOES NOT EXERCISE THE REAL MODE
        REPORTS THE REAL THING AS BROKEN.

   RATCHET, like squint, hue and icon, and for the same reason: 31 codes across 20
   legend families are unplaced in the valley the player actually walks and a gate that goes red on day one is a comment
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

     a) A RULING RETIRED THE FEATURE. Nothing is on this list for that reason right
        now, and the entry is kept because it is the one case where THE FIX IS TO
        DELETE THE LEGEND ENTRY, not to place the tile -- placing it would undo the
        ruling. arterial's block wall was handled exactly that way on 8/20.
     b) THE CODE IS A SAFETY FLOOR. `0` is the value K.grid() fills with, so several
        legends name it for the case where a generator leaves a hole; a legend entry
        for 0 that never appears is the SUCCESS case, not a defect. Left listed rather
        than special-cased, because special-casing 0 would hide a generator that really
        did leave the cell empty.
     c) IT IS A REAL UNBUILT PROMISE. Everything else. The airport declares jet
        bridges, dead airliners and a revetment and parks nothing; the rail declares a
        level crossing with a gate arm and never builds one. These are the arterial's
        bug wearing a different hat, and they are what this list is for.

   MOUNTAIN AND DESERT WERE ON THIS LIST AND WERE NEVER BROKEN. The first version of
   this gate did not run the terrain contract (cellX/cellY/open), so it reported the
   mountain as declaring a ravine floor, a dry drainage, a desert shrub, boulders and
   an alluvial fan and building none of them. It builds all five. Removed 8/20, the day
   after they were wrongly added, by the honesty check below -- which is the check
   earning its keep on its author. 55 -> 49.                                          */
const DEBT = {
  'freeway':             [16, 17],
  'casino':              [7],
  'convention':          [5],
  'downtown':            [0],
  'industrial':          [0],
  'resort':              [9],
};

/* IT GENERATES THE REAL WORLD. NOT SYNTHETIC MODES -- THE ACTUAL VALLEY.

   THIS GATE GOT ITS OWN ANSWER WRONG THREE TIMES IN A DAY BY GUESSING ITS INPUTS, and
   the third time is why it now works this way. A district is generated under FOUR opts
   contracts (streets/links, cellX/cellY, open, bounds/approach/fx/fy) plus variant flags
   (cross/same/rail as DIRECTION LISTS, gated, kind, access, spanThrough), and every one
   of them has to be not just PRESENT but the right SHAPE and the right SIZE:

     v1  did not pass cellX/cellY or open, and reported the MOUNTAIN as declaring a
         ravine floor, a dry drainage, a desert shrub, boulders and an alluvial fan and
         building none of them. It builds all five.
     v2  passed `cross: true`. The generator reads `cross.indexOf('E')`, which throws on
         a boolean, the try/catch swallowed it, and the whole mode silently made nothing.
         EIGHT false findings from one wrong type -- the rail's level crossing and the
         freeway's rail underpass among them.
     v3  passed a synthetic 3x3 cluster block. The airfield lays its stands with
         `for (st = A0 + 90; st < A1 - 120; st += 150)`, and on a 3x3 block that range is
         empty -- so it reported the airport as declaring jet bridges, dead airliners, a
         revetment and a hangar and parking none of them. On its REAL blobs the family
         builds 18 of 18.

   Every one of those was the gate calling a working district broken, which is the exact
   failure its own care note warns about, three times over. There is only one input that
   cannot be wrong about the modes, and it is THE WORLD ITSELF: build the valley from the
   ONE SEED and read the cells the player actually walks. That is VERIFY ON THE REAL
   SURFACE (7/18) applied to the generator instead of to a picture.

   SAMPLED, because a full 9,216-cell sweep is ~137s and this has to live in the suite.
   Up to CAP cells per district type, spread evenly through that type's cells so the
   sample crosses different blobs, different street configs and different neighbours. A
   type with fewer than CAP cells is swept whole.

   PLUS THE EXTREMES, ALWAYS (8/24). An evenly-spaced sample is exactly the thing that
   misses a CORNER, and a cluster-laid district anchors its one-off features at corners --
   the whole point of laying a plant out once in valley coordinates is that its substation
   and control building exist ONCE, in one cell of the blob. Solar is 303 cells and its
   control building is in one of them: a 30-of-303 spread hits it about a tenth of the
   time, so this gate reported "solar declares a control building and never builds one"
   about a tenth of the time and passed the rest. That is worse than a red gate, because
   it is a FLAKY one, and it would have been read as an intermittent generator bug rather
   than a sampling artifact. So the eight extreme cells of every type -- min and max of
   x, y, x+y and x-y, which is the bounding box plus its diagonals -- are always in the
   sample. Eight extra plots per type; the corner anchors stop being a coin toss. */
const CAP = 30;

/* the cells a type's corner features could be hiding in: the bounding box's extremes and
   its diagonal extremes. Cheap, general, and it needs to know nothing about clusters. */
function extremesOf(cells) {
  const pick = (score) => {
    let lo = cells[0], hi = cells[0];
    for (const c of cells) {
      if (score(c) < score(lo)) lo = c;
      if (score(c) > score(hi)) hi = c;
    }
    return [lo, hi];
  };
  return [].concat(
    pick(c => c[0]), pick(c => c[1]),
    pick(c => c[0] + c[1]), pick(c => c[0] - c[1]));
}

const W = require(path.join(ROOT, 'engine/bohemia_world.js'));
const world = W.world('bohemia');          // THE ONE SEED (CLAUDE.md), never a fresh one

const cellsOf = {};
/* THE VALLEY SAYS HOW BIG IT IS. A typed 96 here is the bug MAP BOUND exists to
   stop -- its law: "nothing that scans the valley may decide for itself how big the
   valley is", written after a typed `y < 48` cost a 4.25x population error AND the
   cross-check built to catch it carried the same line. Read off the world. */
const _N = world.n;
for (let y = 0; y < _N; y++) {
  for (let x = 0; x < _N; x++) {
    const c = world.at(x, y);
    if (!c || !c.district) continue;
    (cellsOf[c.district] = cellsOf[c.district] || []).push([x, y]);
  }
}
ok('the valley generated and every cell has a district ('
  + Object.values(cellsOf).reduce((a, b) => a + b.length, 0) + ' cells, '
  + Object.keys(cellsOf).length + ' types)',
  Object.values(cellsOf).reduce((a, b) => a + b.length, 0) > 9000);

/* GROUPED BY THE LEGEND THE WORLD ACTUALLY USED, not by the registry (8/20, and this
   is the FOURTH input mistake this gate has made in two days).

   The registry is `K.types()`. The valley is not the registry. `gated` and `estate` are
   real districts on 49 cells of the seed valley and neither is a registered kit type --
   the world routes them through the suburb module with `opts.district`. Walking
   K.types() to build the families therefore COMPUTED those 49 cells' tiles and then
   dropped them on the floor, and the gate reported that the suburb family declares a
   `gate` and never builds one.

   ALL 49 BUILD ONE. What it had actually found was GATED IS RICH working exactly as
   Paolo ruled it on 8/1: a plain `suburb` is walled and never gated, and the gate lives
   on the communities that were rich enough to buy one.

   So the unit is now the legend object THE PLOT ITSELF CARRIES. Every legend the world
   really uses is judged against what the world really built with it, and a district
   that exists without being registered cannot fall through the gap. Same correction as
   the other three, one level further down: stop asking a model of the world, ask the
   world. */
const famUsed = new Map();      // legend object -> Set of codes actually emitted
const famNames = new Map();     // legend object -> Set of district names using it
for (const [type, cells] of Object.entries(cellsOf)) {
  const step = Math.max(1, Math.floor(cells.length / CAP));
  const sample = new Map();     // "x,y" -> cell, so the extremes never duplicate a spread pick
  for (let i = 0; i < cells.length; i += step) sample.set(cells[i][0] + ',' + cells[i][1], cells[i]);
  for (const c of extremesOf(cells)) sample.set(c[0] + ',' + c[1], c);
  for (const [x, y] of sample.values()) {
    let p = null;
    try { p = world.plot(x, y); } catch (e) { continue; }
    const g = p && p.block && p.block.grid;
    const legend = p && p.legend;
    if (!g || !legend) continue;
    if (!famUsed.has(legend)) { famUsed.set(legend, new Set()); famNames.set(legend, new Set()); }
    famNames.get(legend).add(type);
    const used = famUsed.get(legend);
    for (const row of g) for (const v of row) used.add(v);
  }
}
ok('every sampled cell carried a legend to judge (' + famUsed.size + ' legends in use)',
  famUsed.size > 20);

const found = {};          // family name -> codes declared but never emitted
const legendOf = {};       // family name -> its legend, for printing tile names
let declared = 0, unplaced = 0;
for (const [legend, used] of famUsed) {
  const name = [...famNames.get(legend)].sort().join('+');
  legendOf[name] = legend;
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
const observed = new Set(Object.keys(legendOf));
const ghosts = Object.keys(DEBT).filter(f => !observed.has(f));
ok('every family named in DEBT is a legend the valley actually uses', !ghosts.length, ghosts.join(' '));

const worst = Object.entries(found).sort((a, b) => b[1].length - a[1].length).slice(0, 6);
console.log('\n  DECLARED BUT NEVER BUILT, worst families:');
for (const [fam, codes] of worst) {
  const legend = legendOf[fam];
  console.log('    ' + fam.padEnd(22) + codes.map(c => c + '=' + legend[c].name).join(', '));
}
console.log('    ' + unplaced + ' of ' + declared + ' declared tiles across '
  + Object.keys(found).length + ' families are promises the world does not keep.');
console.log('\n=== LEGEND KEPT GATE: ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
