#!/usr/bin/env node
/* BOHEMIA — GOD GEAR GATE (10/9/26, WORLD lane)
 *
 * ROW [where the god gear is] (Paolo 10/9: "finding good bros and good equipment
 * throughout the settlements"). The valley's six legendary places, each with a
 * guard sized by the math and a reward off the best rows of weapons.json and
 * armor.json.
 *
 *  A  THE SIX ARE REAL DISTRICTS. Nothing invents a location.
 *
 *  B  *** AND THEY ARE NOT GUARANTEED, WHICH IS THE FINDING. *** Battle Brothers
 *     puts its legendary locations on every map it generates. Ours rolls them: the
 *     library is on 48 of 60 valleys, so in roughly one in five a rumour would
 *     point at a building that is not there. The module reports the missing ones
 *     BY NAME and the gate holds that it keeps doing so.
 *
 *  C  *** NOT ALL THE SAME PLACE. *** The first cut ranked them by cell count and
 *     five of six came out identical — same guard, same reward — because the data
 *     fortress is six cells and every other one is exactly one. That is
 *     [bb places]' own 9/25 defect, a shelf that is a function of tier alone, and
 *     this lane said then it would never ship again.
 *
 *  D  THE CHAIN, NOT A TABLE: rank sizes the guard off HIS OWN CEILING ("12
 *     versus 60", rule 79), and the guard slices the reward out of the ranked gear
 *     pool, so better guarded is better gear BY CONSTRUCTION and the gate proves
 *     the monotonicity rather than trusting it.
 *
 *  E  THE RANK IS STATED AS MINE, not smuggled in as arithmetic, and carries
 *     tuned:false like every felt number. WHO GUARDS SHIPS EMPTY: the row says
 *     FACTIONS owns it.
 *
 *   node gates/god_gear_gate.js
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

const GG = R('engine/bohemia_godgear.js');
const OM = R('engine/bohemia_overmap.js');
const DOC = JSON.parse(read('banks/BOHEMIA_PLACES_WORTH_GOING_TO_10_9_26.txt'));
const DATA = JSON.parse(read('records/target/BOHEMIA_GOD_GEAR_PLACES.json'));
const WEAP = JSON.parse(read('records/target/bb/weapons.json')).rows;
const ARM = JSON.parse(read('records/target/bb/armor.json'));
const POOL = WEAP.concat(ARM.body, ARM.head, ARM.shields);

/* a cheap sweep every run: enough valleys to see a place go missing */
const SEEDS = 24;
const tally = {}; GG.names().forEach(p => tally[p] = 0);
for (let s = 1; s <= SEEDS; s++) {
  const sp = GG.on(OM.buildOvermap((s * 7919) % 1000003));
  GG.names().forEach(p => { if (sp.places[p].weight) tally[p]++; });
}

/* ---- A. REAL DISTRICTS -------------------------------------------------- */
section('A the six are real places the generator makes', () => {
  console.log('    [measured] over ' + SEEDS + ' valleys: '
    + GG.names().map(p => p + ' ' + tally[p]).join(', '));
  ok('there are six of them, as his row names', GG.names().length === 6);
  ok('*** NOT ONE IS INVENTED: every one is on at least one rolled valley ***',
     GG.names().every(p => tally[p] > 0),
     'on no valley: ' + GG.names().filter(p => !tally[p]).join(', '));
  ok('each names the overmap district it really is',
     GG.names().every(p => typeof GG.PLACES[p].district === 'string'));
  ok('and each keeps his own words for it',
     GG.names().every(p => typeof GG.PLACES[p].his === 'string' && GG.PLACES[p].his.length > 4));
});

/* ---- B. *** NOT GUARANTEED *** ------------------------------------------ */
section('B a legendary place that might not be there says so', () => {
  const sometimesMissing = GG.names().filter(p => tally[p] < SEEDS);
  console.log('    [measured] ' + sometimesMissing.length + ' of the six are missing from at least '
    + 'one valley: ' + (sometimesMissing.join(', ') || 'none'));
  ok('*** THE SIX ARE NOT GUARANTEED, and the sweep still sees it ***',
     sometimesMissing.length > 0,
     'every place is on every valley now: the finding has gone and the record needs rewriting');
  /* the module must report them, not hide them */
  let reported = 0, absent = 0;
  for (let s = 1; s <= SEEDS; s++) {
    const sp = GG.on(OM.buildOvermap((s * 7919) % 1000003));
    const really = GG.names().filter(p => !sp.places[p].weight);
    absent += really.length;
    if (really.length === sp.missing.length && really.every(p => sp.missing.indexOf(p) >= 0)) reported++;
  }
  console.log('    [measured] ' + absent + ' absences across the sweep, reported correctly in '
    + reported + '/' + SEEDS + ' valleys');
  ok('*** EVERY ABSENCE IS REPORTED BY NAME, never silently dropped ***', reported === SEEDS);
  ok('and the module says why it matters',
     /point at nothing/.test(GG.on(OM.buildOvermap(1337)).because || '')
     || GG.on(OM.buildOvermap(1337)).missing.length === 0);
  ok('the data file carries the sweep so the next lane need not redo it',
     DATA.presentInRolledValleys && typeof DATA.presentInRolledValleys.library === 'number');
});

/* ---- C. *** NOT ALL THE SAME PLACE *** ---------------------------------- */
section('C the places are not interchangeable', () => {
  const m = OM.buildOvermap(1337);
  const g = GG.guards(GG.on(m));
  const guards = Object.keys(g.by).map(p => g.by[p].guard);
  const uniq = new Set(guards);
  console.log('    [measured] ' + guards.length + ' places on this valley, ' + uniq.size
    + ' different guard sizes: ' + guards.slice().sort((a, b) => b - a).join(', '));
  ok('*** NO TWO PLACES SHARE A GUARD: the 9/25 shelf-is-tier defect is not back ***',
     uniq.size === guards.length,
     guards.length + ' places, ' + uniq.size + ' sizes');
  /* and the cell count really would NOT have separated them -- the finding */
  const cells = Object.keys(g.by).map(p => g.by[p].cells);
  console.log('    [measured] by cell count they would be: ' + cells.join(', ')
    + '  (' + new Set(cells).size + ' distinct)');
  ok('which is why the rank is not cell count', new Set(cells).size < uniq.size);
});

/* ---- D. THE CHAIN, PROVED ----------------------------------------------- */
section('D rank sizes the guard, the guard slices the reward', () => {
  ok('the ceiling is his own number, in his own words',
     GG.CEILING.guard === 60 && GG.CEILING.against === 12 && /12 versus 60/.test(GG.CEILING.ruling));
  ok('and it carries tuned:false', GG.CEILING.tuned === false);
  const m = OM.buildOvermap(1337);
  const g = GG.guards(GG.on(m));
  const rows = Object.keys(g.by).map(p => {
    const rw = GG.rewardOf({ pool: POOL, guard: g.by[p].guard });
    return { p: p, guard: g.by[p].guard, top: rw.rows[0].value, name: rw.rows[0].name };
  }).sort((a, b) => a.guard - b.guard);
  console.log('    [measured] ' + rows.map(r => r.p + ' ' + r.guard + '->' + r.top).join(', '));
  let mono = true;
  for (let i = 1; i < rows.length; i++) if (rows[i].top < rows[i - 1].top) mono = false;
  ok('*** BETTER GUARDED IS BETTER GEAR, every step of the way ***', mono);
  ok('the top place really earns his ceiling',
     Math.max.apply(null, rows.map(r => r.guard)) === GG.CEILING.guard);
  ok('the pool is handed in, not held: the module has no gear of its own',
     GG.rewardOf({ guard: 30 }).why === GG.NO_GEAR);
  const live = read('engine/bohemia_godgear.js').replace(/\/\*[\s\S]*?\*\//g, ' ');
  ok('and no reward table is stored anywhere in it',
     !/REWARDS?\s*=\s*\{[^}]/.test(live));
  ok('the gear pool is real and every row can be ranked',
     POOL.length > 300 && POOL.every(r => typeof r.value === 'number'));
});

/* ---- E. WHAT IS MINE SAYS SO, AND WHAT IS FACTIONS' SHIPS EMPTY --------- */
section('E the rank is stated as mine and who guards is not', () => {
  ok('the rank carries a ruling that says it is mine',
     GG.DEFENDED_RULING.mine === true && GG.DEFENDED_RULING.tuned === false);
  ok('*** AND IT SAYS THE MAP DOES NOT RANK THEM, rather than implying it does ***',
     /does not rank them/i.test(GG.DEFENDED_RULING.ruling));
  ok('it gives a real-world reason, not a coin flip',
     /BUILT to be defended/i.test(GG.DEFENDED_RULING.ruling));
  ok('every one of the six has a rank', GG.names().every(p => typeof GG.DEFENDED[p] === 'number'));
  ok('*** WHO GUARDS SHIPS EMPTY, because the row says FACTIONS owns it ***',
     Object.keys(GG.GUARDED_BY).length === 0);
  ok('and asking answers NO_RULING and names whose it is',
     GG.guardedBy('arsenal').why === GG.NO_RULING && /FACTIONS/.test(GG.guardedBy('arsenal').because));
  ok('a place that is not one of the six is refused, not improvised',
     GG.guardedBy('casino').why === 'NOT_A_PLACE');
  ok('what a place is FOR beyond its rank ships empty too',
     Object.keys(GG.FLAVOUR).length === 0);
});

/* ---- F. THE PICTURE ----------------------------------------------------- */
section('F the picture is the live valley and it shows the absence', () => {
  const m = DOC.measured;
  console.log('    [measured] ' + m.marks.length + ' places ringed on seed ' + m.seed
    + ', missing: ' + (m.missingOnThisValley.join(', ') || 'none')
    + ', marks ' + m.brightPct + '% of the frame');
  ok('it ringed every place that is on this valley', m.marks.length === 5);
  ok('*** AND IT SHOWS THE ONE THIS VALLEY DID NOT ROLL ***',
     m.missingOnThisValley.length > 0 && m.missingOnThisValley.indexOf('library') >= 0);
  ok('the ring really is sized by the guard, so the geometry is the number',
     m.marks.every(x => x.radius > 0)
     && m.marks.slice().sort((a, b) => a.guard - b.guard).every((x, i, A) => i === 0 || x.radius >= A[i - 1].radius));
  ok('the marks are a minority of the frame (TG-05)', m.brightPct < 12);
  ok('it is a draft and nothing on a play surface',
     DOC.draft === true && /rule 18/.test(DOC.not_shipped));
  ok('the picture exists where he can reach it',
     fs.existsSync(P('slices/vote/WORLD_PLACES_WORTH_GOING_TO.png')));
  ok('one pixel per cell, so it is the data and not a drawing of it',
     DOC.size.oneCellOnePixel === true);
  ok('the record keeps the cut that was wrong',
     /came out IDENTICAL/.test(DOC.the_first_cut_was_wrong || ''));
  const tool = read('tools/bohemia_god_gear_cook_10_9_26.js').replace(/\/\*[\s\S]*?\*\//g, ' ');
  ok('the all-the-same refusal is a live statement, not a comment',
     /same four things is the defect[\s\S]{0,60}process\.exit\(1\)/.test(tool));
  ok('the reward-follows-the-guard refusal is live',
     /must follow the guard[\s\S]{0,60}process\.exit\(1\)/.test(tool));
  ok('and the invented-place refusal is live and no longer confuses absence with invention',
     /are on no valley at all[\s\S]{0,120}process\.exit\(1\)/.test(tool));
  ok('the data file says it is generated and must not be hand edited',
     /do not hand edit/i.test(DATA._readme));
});

console.log('GOD GEAR GATE: ' + pass + ' passed, ' + fail + ' failed'
  + '  (six real places, none guaranteed and every absence reported by name, no two'
  + ' sharing a guard, and better guarded is better gear by construction because the'
  + ' reward is a slice of the ranked pool and never a table)');
process.exit(fail ? 1 : 0);
