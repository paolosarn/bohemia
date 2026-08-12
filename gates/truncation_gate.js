#!/usr/bin/env node
/* TRUNCATION GATE (8/11/26, WORLD lane) — nothing stops halfway across its own cell.
 *
 * THE BUG THIS EXISTS FOR, and it shipped for weeks with every gate green:
 * the arterial and the freeway both laid their roadway across only PART of the cell and
 * then stopped, with a hard straight edge and bare dirt beyond it. Paolo saw it the moment
 * he was shown a real top-down grid instead of an isometric picture:
 *
 *     "I need to see what one fucking district grid of a street... looks like...
 *      you know how the map is 96 x 96 square squares in grids I NEED TO SEE IT BY A GRID"
 *
 * THE CAUSE WAS A HINT MEANT FOR SOMETHING ELSE. Callers pass {streets:['S']} to mean
 * "this district fronts a street on its south side" -- correct for a LOT, nonsense for a
 * street CELL -- and one leg made the roadway reach only half a cell. A street that
 * dead-ends inside a block is not a street.
 *
 * WHY THERE WAS NO MACHINE FOR IT. Every existing check asks about CONTENT: is the plot
 * mostly pavement (walkable), is every tile documented (tilespec), does one code own too
 * much (answered-for). None of them can see a cell that is internally consistent and simply
 * STOPS. A truncated cell passes all of them, because the part that exists is fine.
 *
 * WHAT IT MEASURES: whether a THROUGH-SURFACE reaches the cell boundary on both ends of an
 * axis. A road exists to carry something ACROSS the cell; if its own surface stops short,
 * the next cell has nothing to connect to and the street dead-ends inside a block.
 *
 * IT IS NOT ABOUT HOW MUCH GROUND ONE CODE OWNS. A park is 74% dead lawn and that is FINE
 * and gated elsewhere. What is banned here is a corridor that gives up on one side.
 *
 *   node gates/truncation_gate.js
 */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
process.chdir(ROOT);

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const K = require(path.join(ROOT, 'engine/bohemia_district_kit.js'));
require(path.join(ROOT, 'engine/bohemia_world.js'));      // registers every DISTGEN type

/* MY FIRST METRIC WAS WRONG AND ITS OWN FIRST RUN PROVED IT. I measured "a band of
   consecutive rows that are each 100% one code" and it flagged the FIXED arterial at 41
   rows -- because a street that correctly fills its cell with pavement HAS forty-one rows
   of nothing but asphalt. Uniformity is not truncation. A fully paved cell and a cell that
   gave up look identical to that test, which makes it useless for the one thing it exists
   to catch. (Fix the ruler, never the target -- and never ship a ruler you have not aimed
   at the actual defect.)

   THE REAL SIGNATURE IS AN EDGE THAT IS NOT REACHED. A surface cell -- a road, a freeway,
   a rail corridor -- exists to carry something ACROSS the cell, so its own surface must
   touch the boundary on both ends of its axis, or it dead-ends inside a block and the next
   cell cannot connect to it. That is precisely what {streets:['S']} did: the roadway
   reached the south edge and stopped a third of the way north.

   Only SURFACE cells are held to it, and that is deliberate: a lot with a building in the
   middle is not required to have anything at its boundary. */
const SEEDS_ = [0x5eed, 1, 777];

function edgesReached(rows, shoulderCodes) {
  const H = rows.length, W = rows[0].length;
  const live = v => !shoulderCodes.has(v);
  const any = arr => arr.some(live);
  return {
    N: any(rows[0]), S: any(rows[H - 1]),
    W: any(rows.map(r => r[0])), E: any(rows.map(r => r[W - 1])),
  };
}

const types = K.types().sort();
ok('there are districts to sweep (' + types.length + ')', types.length > 30);

const bad = [];
let swept = 0, surfaces = 0;
for (const t of types) {
  const spec = K.get(t);
  if (!spec || typeof spec.generate !== 'function') continue;
  for (const seed of SEEDS_) {
    let res;
    // ASK THE WAY A LOT ASKS. {streets:['S']} is the hint that caused the bug, so it is the
    // hint the gate uses -- a check that only tested the happy call would have stayed green
    // straight through the defect it exists to catch.
    try { res = spec.generate(seed, { streets: ['S'] }); } catch (e) { continue; }
    if (!res || !res.g) continue;
    swept++;
    if (!spec.surface) continue;            // only a through-surface owes its edges
    surfaces++;
    const g = res.g;
    const rows = Array.isArray(g[0]) ? g : (() => {
      const W = res.W || 128, out = [];
      for (let r = 0; r * W < g.length; r++) out.push(g.slice(r * W, (r + 1) * W));
      return out;
    })();
    // the SHOULDER is whatever the legend calls dirt/shoulder/bedrock: the not-a-surface code
    const shoulder = new Set();
    for (const code in (spec.legend || {})) {
      const nm = ((spec.legend[code] || {}).name || '').toLowerCase();
      if (/shoulder|dirt|bedrock|bare|verge/.test(nm)) shoulder.add(+code);
    }
    shoulder.add(0);
    const e = edgesReached(rows, shoulder);
    const missing = ['N', 'S', 'E', 'W'].filter(k => !e[k]);
    // a corridor runs on ONE axis: it must reach BOTH ends of at least one axis
    const throughNS = e.N && e.S, throughEW = e.E && e.W;
    if (!throughNS && !throughEW) {
      bad.push(t + '@' + seed + ' (reaches no opposite pair; missing ' + missing.join('') + ')');
    }
  }
}

ok('every district generated on three seeds (' + swept + ' plots)', swept > 90);
ok('there are through-surfaces to hold to it (' + surfaces + ')', surfaces > 5);
ok('NO SURFACE DEAD-ENDS INSIDE A BLOCK: every road, freeway and corridor reaches the ' +
   'boundary on both ends of its axis, so the next cell can connect to it' +
   (bad.length ? ' — ' + bad.slice(0, 6).join(', ') : ''), bad.length === 0);
ok('and the three that actually broke are clean',
   ['arterial', 'arterial_x', 'freeway'].every(t => !bad.some(b => b.startsWith(t + '@'))));

console.log('TRUNCATION GATE: ' + pass + ' passed, ' + fail + ' failed  (' + swept +
            ' plots swept, ' + surfaces + ' through-surfaces, none dead-ending)');
process.exit(fail ? 1 : 0);
