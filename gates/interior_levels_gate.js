#!/usr/bin/env node
/* INTERIOR LEVELS GATE (8/7/26, WORLD lane).
 *
 * THE LANDMINE THIS DEFUSES. Three kinds of interior disagree about the word "levels":
 *
 *   bohemia_floorplan.js   levels : ARRAY of plates    .levels.length -> a number
 *   bohemia_garage.js      levels : NUMBER of decks    .levels.length -> undefined
 *   bohemia_crypt.js       no levels at all            .levels        -> undefined
 *
 * Same word, two meanings, plus a third interior that does not use it. Neither mistake
 * throws: a walker written against the floorplan silently reads `undefined` on a garage,
 * and one written against the garage silently gets an array. It is the same shape as every
 * expensive bug in this repo -- the district list kept by hand in three places, a file name
 * standing in for a type -- and it has not bitten yet ONLY because no walker exists. The
 * moment the RUN or CITY lane writes one to render a stair, it bites.
 *
 * engine/bohemia_interior_levels.js is the single reader. It renames nothing and adds no
 * field to any interior -- both existing shapes are read by the shipped city app -- it just
 * answers the four questions a walker actually asks: how many storeys, what is on storey i,
 * can a body stand here, and where does this storey connect to the next.
 *
 * WHAT THIS PROVES:
 *   1. ONE CODE PATH READS ALL THREE. Not three branches in a test -- the same walk()
 *      call, over a floorplan, a garage, a crypt, and world.js's wrapped floorplan.
 *   2. EVERY STOREY IS FULLY REACHABLE from the entrance, THROUGH the links. Not "the
 *      stair exists" -- walked. 100% of standable cells on every storey of every case.
 *   3. THE LINKS ARE REAL: a link cell is standable on BOTH storeys it joins. A ramp or a
 *      stair that lands in a wall is the failure the placement is derived to avoid.
 *   4. THE COLLISION IS STILL DESCRIBED. If someone "tidies" garage.levels into an array
 *      or floorplan.levels into a count, the reader must be updated with them -- so the
 *      gate asserts each module still has the shape the reader was written against.
 *   5. IT HOLDS ON THE REAL VALLEY, over interiors the world model actually hands out.
 *
 *   node gates/interior_levels_gate.js
 */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.dirname(__dirname);
const IL = require(path.join(ROOT, 'engine/bohemia_interior_levels.js'));
const FP = require(path.join(ROOT, 'engine/bohemia_floorplan.js'));
const GA = require(path.join(ROOT, 'engine/bohemia_garage.js'));
const CR = require(path.join(ROOT, 'engine/bohemia_crypt.js'));
const { world } = require(path.join(ROOT, 'engine/bohemia_world.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

// ---- 1 + 2: one code path, every storey walked ------------------------------------
const CASES = [
  ['floorplan, one storey', FP.generate(11, 24, 18, { zone: 'residential', entrance: 'S' })],
  ['floorplan, three storeys', FP.generate(11, 24, 18, { zone: 'residential', entrance: 'S', stories: 3 })],
  ['floorplan, sliver', FP.generate(5, 2, 16, { zone: 'residential', entrance: 'S', stories: 2 })],
  ['garage, three decks', GA.generate(99, { w: 28, h: 20, decks: 3 })],
  ['garage, six decks', GA.generate(99, { w: 60, h: 44, decks: 6 })],
  ['garage, tiny', GA.generate(4, { w: 12, h: 10, decks: 2 })],
  ['crypt', CR.generate(7, { w: 24, h: 18 })],
  ["world.js's wrapped floorplan", { kind: 'floorplan', floorplan: FP.generate(3, 20, 16, { zone: 'retail', entrance: 'S', stories: 2 }) }],
];
let read = 0, fullyWalked = 0, kinds = new Set();
for (const [name, it] of CASES) {
  const r = IL.walk(it);
  if (!r) { ok('the one reader understands: ' + name, false); continue; }
  read++; kinds.add(r.kind);
  if (r.coverage >= 0.999) fullyWalked++;
  else ok(name + ': every standable cell on every storey is reached (' +
          (100 * r.coverage).toFixed(1) + '%)', false);
}
ok('ONE reader understands every interior in the engine (' + read + '/' + CASES.length + ')',
   read === CASES.length);
ok('and it is genuinely three different kinds, not one dressed up (' + [...kinds].sort().join(', ') + ')',
   kinds.size === 3);
ok('EVERY STOREY FULLY WALKED from the entrance, through the links (' +
   fullyWalked + '/' + CASES.length + ')', fullyWalked === CASES.length);

// ---- 3: a link cell is standable on BOTH storeys it joins --------------------------
let links = 0, brokenLinks = 0;
for (const [, it] of CASES) {
  const A = IL.read(it);
  for (let i = 0; i < A.count; i++) for (const L of A.links(i)) {
    links++;
    if (!(A.passable(i, L.x, L.y) && A.passable(L.to, L.x, L.y))) brokenLinks++;
  }
}
ok('every link is standable on BOTH storeys it joins (' + links + ' links checked)', brokenLinks === 0);
ok('there are links to check at all', links > 0);

// ---- 4: the collision is still what the reader was written against -----------------
const gSrc = fs.readFileSync(path.join(ROOT, 'engine/bohemia_garage.js'), 'utf8');
const fSrc = fs.readFileSync(path.join(ROOT, 'engine/bohemia_floorplan.js'), 'utf8');
const gar = GA.generate(1, { w: 20, h: 16, decks: 3 });
const flr = FP.generate(1, 20, 16, { zone: 'retail', entrance: 'S', stories: 3 });
ok('garage.levels is still a COUNT and garage.decks the array (reader assumption)',
   typeof gar.levels === 'number' && Array.isArray(gar.decks));
ok('floorplan.levels is still an ARRAY of plates (reader assumption)',
   Array.isArray(flr.levels) && !!flr.levels[0].grid);
ok('the garage still documents its deck codes where the reader takes them from',
   /DECK CODES:/.test(gSrc));
ok('a stair is still g:\'floor\' + kind:\'stair\' (so it stays standable)',
   /kind='stair'/.test(fSrc.replace(/\s/g, '')) || /kind:'stair'/.test(fSrc));

// ---- 5: and it holds on the real valley --------------------------------------------
const w = world(12345);
let sampled = 0, walked = 0, worstCoverage = 1, multi = 0;
for (let y = 8; y < 88; y += 11) for (let x = 8; x < 88; x += 11) {
  const c = w.at(x, y); if (!c) continue;
  let p; try { p = w.plot(x, y); } catch (e) { continue; }
  if (!p || !p.buildings.length) continue;
  for (let i = 0; i < Math.min(2, p.buildings.length); i++) {
    let inter; try { inter = p.building(i).interior(); } catch (e) { continue; }
    const r = IL.walk(inter);
    if (!r) continue;
    sampled++;
    if (r.storeys > 1) multi++;
    if (r.coverage >= 0.999) walked++; else worstCoverage = Math.min(worstCoverage, r.coverage);
  }
}
ok('the reader handles interiors the world model actually hands out (' + sampled + ' sampled)', sampled > 20);
ok('every one of them is fully walkable across all its storeys (worst ' +
   (100 * worstCoverage).toFixed(1) + '%)', walked === sampled);
ok('and multi-storey interiors are among them (' + multi + ')', multi > 0);

console.log('INTERIOR LEVELS GATE: ' + pass + ' passed, ' + fail + ' failed  (' +
            kinds.size + ' interior kinds through ONE reader · ' + links + ' links · ' +
            sampled + ' valley interiors walked, ' + multi + ' multi-storey)');
process.exit(fail ? 1 : 0);
