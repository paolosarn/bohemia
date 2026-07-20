// CITY EDIT GATE (7/19/26, LIFE+CITY-SURFACE session) — the city-builder
// verbs must never break the world. FACTORY LAW gate for bohemia_cityedit.
// Proves:
//   1. THE SKELETON IS SACRED: streets, freeway, rail, water, mountains can
//      never be demolished (the mile grid Paolo made whole stays whole)
//   2. demolish sends a buildable plot to DESERT, exactly
//   3. build works ONLY on empty desert and ONLY with canon buildable types
//      (nothing invented; wash/mountain/water are never placeable)
//   4. the delta round-trips (serialize -> parse -> identical resolution)
//      and resolve() overrides only edited cells
//   5. the category function agrees with the blessed proof's rules on the
//      live district enum (one canonical body for render + verbs)
const CE = require('../engine/bohemia_cityedit.js');
const OM = require('../engine/bohemia_overmap.js');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const D = OM.DISTRICT;

// 1. skeleton sacred
const skeletonProbes = ['arterial', 'freeway', 'interchange', 'rail', 'mead', 'dam', 'mountain', 'water'];
let sacred = true;
for (const d of skeletonProbes) {
  const e = CE.makeEdits();
  if (CE.demolish(e, 5, 5, d).ok) sacred = false;
  if (CE.count(e) !== 0) sacred = false;
}
ok('THE SKELETON IS SACRED: ' + skeletonProbes.length + ' skeleton types refuse demolition', sacred);

// 2. demolish -> desert
const e2 = CE.makeEdits();
const r2 = CE.demolish(e2, 3, 4, 'suburb');
ok('demolish sends a buildable plot to desert', r2.ok && CE.resolve(e2, 3, 4, 'suburb') === 'desert');
ok('already-desert refuses demolition (nothing to blow up)', CE.demolish(CE.makeEdits(), 1, 1, 'desert').ok === false);

// 3. build rules
const e3 = CE.makeEdits();
ok('build works on empty desert with a canon type', CE.build(e3, 7, 7, 'desert', 'suburb', D).ok && CE.resolve(e3, 7, 7, 'desert') === 'suburb');
ok('build refuses non-desert ground', CE.build(CE.makeEdits(), 7, 7, 'suburb', 'commercial', D).ok === false);
ok('build refuses skeleton types as material (no placing freeways)', CE.build(CE.makeEdits(), 7, 7, 'desert', 'freeway', D).ok === false
  && CE.build(CE.makeEdits(), 7, 7, 'desert', 'mountain', D).ok === false);
ok('build refuses invented districts', CE.build(CE.makeEdits(), 7, 7, 'desert', 'atlantis', D).ok === false);
const legal = CE.buildableTypes(D);
ok('buildable menu is the canon enum\'s buildables only (' + legal.length + ' types, suburb+commercial in, arterial out)',
  legal.indexOf('suburb') >= 0 && legal.indexOf('commercial') >= 0 && legal.indexOf('arterial') < 0 && legal.indexOf('mead') < 0);

// 4. delta round-trip + resolution
const e4 = CE.makeEdits();
CE.demolish(e4, 2, 2, 'suburb');
CE.build(e4, 9, 9, 'desert', 'commercial', D);
const back = CE.parse(CE.serialize(e4));
ok('the delta round-trips (a save system can carry it)',
  CE.resolve(back, 2, 2, 'suburb') === 'desert' && CE.resolve(back, 9, 9, 'desert') === 'commercial' && CE.count(back) === 2);
ok('resolve overrides ONLY edited cells', CE.resolve(back, 50, 50, 'casino') === 'casino');
ok('corrupt saves parse to a clean empty delta', CE.count(CE.parse('{broken')) === 0 && CE.count(CE.parse('null')) === 0);

// 5. category law on the live enum
let catOk = true;
for (const k of Object.keys(D)) {
  const d = D[k], c = CE.cat(d);
  if (!c) catOk = false;
}
ok('every live district resolves to a category', catOk);
ok('the blessed rules hold (arterial=road, dam=water, suburb=sand, wash=open)',
  CE.cat('arterial') === 'road' && CE.cat('dam') === 'water' && CE.cat('suburb') === 'sand' && CE.cat('wash') === 'open');

console.log('CITY EDIT GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
