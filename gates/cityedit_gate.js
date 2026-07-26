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

// 4b. 4-lot big buildings (Paolo 7/18: "a big building can span 4 lots")
const curDesert = () => 'desert';   // a fresh valley of empty desert
// a 2x2 on clear desert plants ONE building over 4 lots, all resolving to it
const eb = CE.makeEdits();
const rb = CE.buildBig(eb, 10, 10, 2, 2, 'commercial', D, curDesert);
ok('buildBig plants a 2x2 mass on 4 empty-desert lots',
  rb.ok && CE.resolve(eb, 10, 10, 'desert') === 'commercial' && CE.resolve(eb, 11, 11, 'desert') === 'commercial'
  && CE.resolve(eb, 11, 10, 'desert') === 'commercial' && CE.resolve(eb, 10, 11, 'desert') === 'commercial');
ok('the 4 lots are ONE building (spanAt sees the same anchor from every lot)',
  ['10,10', '11,10', '10,11', '11,11'].every(kk => { const p = kk.split(','); const s = CE.spanAt(eb, +p[0], +p[1]); return s && s.ax === 10 && s.ay === 10 && s.w === 2 && s.h === 2; })
  && CE.spans(eb).length === 1);
ok('demolishing ANY lot of a big building takes the WHOLE mass down (no holes)',
  (() => { const e = CE.makeEdits(); CE.buildBig(e, 3, 3, 2, 2, 'suburb', D, curDesert);
    const r = CE.demolish(e, 4, 4, 'suburb');   // tap the far corner
    return r.ok && CE.spans(e).length === 0 && ['3,3', '4,3', '3,4', '4,4'].every(kk => { const p = kk.split(','); return CE.resolve(e, +p[0], +p[1], 'x') === 'desert'; }); })());
ok('4 lots is the cap (3x3 / 3x1 refused) and 1x1 is not "big" (min 2 lots)',
  CE.buildBig(CE.makeEdits(), 0, 0, 3, 3, 'suburb', D, curDesert).ok === false
  && CE.buildBig(CE.makeEdits(), 0, 0, 3, 1, 'suburb', D, curDesert).ok === false
  && CE.buildBig(CE.makeEdits(), 0, 0, 1, 1, 'suburb', D, curDesert).ok === false);
ok('buildBig refuses if any lot is not empty desert (skeleton/occupied protected)',
  CE.buildBig(CE.makeEdits(), 0, 0, 2, 2, 'suburb', D, (x, y) => (x === 1 && y === 1) ? 'arterial' : 'desert').ok === false);
ok('buildBig refuses invented / non-buildable types',
  CE.buildBig(CE.makeEdits(), 0, 0, 2, 2, 'atlantis', D, curDesert).ok === false
  && CE.buildBig(CE.makeEdits(), 0, 0, 2, 2, 'freeway', D, curDesert).ok === false);
ok('big buildings will not overlap an existing one',
  (() => { const e = CE.makeEdits(); CE.buildBig(e, 5, 5, 2, 2, 'suburb', D, curDesert);
    return CE.buildBig(e, 6, 6, 2, 2, 'commercial', D, (x, y) => CE.resolve(e, x, y, 'desert')).ok === false; })());
const eb2 = CE.makeEdits(); CE.buildBig(eb2, 8, 8, 2, 2, 'casino', D, curDesert);
const backb = CE.parse(CE.serialize(eb2));
ok('big buildings survive the save round-trip (span carried, not just the lots)',
  CE.spans(backb).length === 1 && CE.spanAt(backb, 9, 9) && CE.spanAt(backb, 9, 9).type === 'casino');
ok('a pre-4-lot save (no spans key) still parses clean',
  (() => { const legacy = CE.parse('{"v":1,"cells":{"2,2":"desert"}}'); return CE.count(legacy) === 1 && CE.spans(legacy).length === 0; })());

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
