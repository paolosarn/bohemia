#!/usr/bin/env node
/* BOHEMIA — VALLEY GROUNDS GATE (10/9/26, WORLD lane)
 *
 * ROW [the valley's grounds], RULE 75b (Paolo 10/5 and 10/9, and via Grok):
 * THE GROUND PICKS WHO SHOWS UP. Each ground carries a faction pool and a travel
 * cost, the costs translated off the Battle Brothers wiki's map speeds.
 *
 *  A  *** THE ROW'S OWN GATE LINE: EVERY MAP CELL HAS A GROUND, AND NOW A SPEED. ***
 *     A cell with no speed is a party that cannot be told how long anything takes.
 *     Swept over ten rolled valleys, never one — rule 40(g) rolls the valley per
 *     new game, and [board terrains] learned that the hard way on 9/30.
 *
 *  B  *** THERE IS NO SECOND LIST OF GROUNDS. *** A ground IS a terrain kind. Two
 *     lists of one thing are two lists that drift, which this lane has measured
 *     three times. The gate refuses if they ever stop agreeing.
 *
 *  C  RULED WHERE HE RULED, MEASURED WHERE HE DID NOT, AND EACH SAYS WHICH. Four
 *     speeds are his, off the wiki. The other nine are measured off the city's own
 *     kits — re-measured here every run — on a scale ANCHORED ON HIS RULED DIRT
 *     SPEED rather than a constant somebody picked. Every value carries
 *     tuned:false and its source, because every felt number is TUNING's (rule 36).
 *
 *  D  *** THE POOL IS NOT A TABLE. *** Who roams a ground is who holds its cells,
 *     counted off the live turf at read time. Nothing is authored, so taking a
 *     faction's ground stops its crews showing up with nothing to edit — and the
 *     gate refuses if a pool ever gets stored in the module.
 *
 *  E  THREE THINGS IN HIS LIST ARE NOT GROUNDS, named rather than faked: rubble is
 *     the RUIN, a CONDITION; the casino floor is an INTERIOR; a RIDGE is a feature
 *     inside the hills and nothing marks one. Each keeps its ruled number for the
 *     day something does.
 *
 *  F  *** NO FACTION IS GIVEN A COLOUR. *** COLOUR IS TERRITORY (8/26) and its own
 *     gate says which faction owns which hue is HIS. The picture paints GRIP, not
 *     identity.
 *
 *  G  THE PICTURE IS READ OUT OF THE LIVE MAP AND THE TWO PANELS SAY DIFFERENT
 *     THINGS — or the second is the first one tinted and the finding is an artefact.
 *
 *   node gates/valley_grounds_gate.js
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

const VG = R('engine/bohemia_valleyground.js');
const BT = R('engine/bohemia_boardterrain.js');
const TK = R('engine/bohemia_tilekinds.js');
const OM = R('engine/bohemia_overmap.js');
const T = R('engine/bohemia_towns.js');
const CE = R('engine/bohemia_cityedit.js');
const GRAPH = JSON.parse(read('engine/BOHEMIA_faction_graph.json'));
const DOC = JSON.parse(read('banks/BOHEMIA_HOW_FAST_AND_WHO_10_9_26.txt'));
const DATA = JSON.parse(read('records/target/BOHEMIA_VALLEY_GROUNDS.json'));

const turfFor = (m) => T.turf(m, CE.cat, T.derive(GRAPH, T.districtsOf(m, CE.cat), 1) || []);
const SEEDS = [1, 7, 42, 1337, 2024, 5, 777, 99999, 31337, 123456];

/* ---- A. EVERY CELL, EVERY VALLEY ---------------------------------------- */
section('A every map cell has a ground and a speed', () => {
  let cells = 0, withSpeed = 0, unheld = 0, factions = 0;
  SEEDS.forEach(s => {
    const m = OM.buildOvermap(s);
    const c = VG.census(m, turfFor(m));
    cells += c.cells; withSpeed += c.withSpeed; unheld += c.unheld;
    factions = Math.max(factions, Object.keys(turfFor(m).byFaction).length);
  });
  console.log('    [measured] ' + SEEDS.length + ' valleys, ' + cells + ' cells, '
    + withSpeed + ' with a travel speed, ' + unheld + ' unheld, up to ' + factions + ' factions');
  ok('the sweep really looked at more than one valley', SEEDS.length >= 10);
  ok('*** NOT ONE CELL IN ANY VALLEY IS WITHOUT A TRAVEL SPEED ***',
     withSpeed === cells, (cells - withSpeed) + ' cells have no speed');
  ok('*** AND NOT ONE IS HELD BY NOBODY, so no ground has an empty pool ***',
     unheld === 0, unheld + ' unheld');
  ok('the valley really is split between outfits', factions > 5);
});

/* ---- B. NO SECOND LIST -------------------------------------------------- */
section('B a ground is a terrain kind, not a second list', () => {
  ok('*** THE GROUNDS ARE READ OFF THE MODULE THAT OWNS THEM ***',
     VG.grounds().join(',') === BT.KINDS.join(','));
  const live = read('engine/bohemia_valleyground.js').replace(/\/\*[\s\S]*?\*\//g, ' ');
  ok('and the module declares no list of its own',
     !/KINDS\s*=\s*\[/.test(live) && !/GROUNDS\s*=\s*\[/.test(live));
  ok('the data file carries the same grounds the module does',
     DATA.grounds.map(g => g.ground).every(g => VG.grounds().indexOf(g) >= 0));
  ok('and every live ground reached the data file',
     DATA.grounds.length === VG.grounds().filter(g => VG.speedOf(g).known).length);
});

/* ---- C. RULED, MEASURED, AND ANCHORED ON HIS NUMBER --------------------- */
section('C ruled where he ruled, measured where he did not', () => {
  const ruled = Object.keys(VG.RULED_SPEED);
  console.log('    [measured] ' + ruled.length + ' ruled speeds (' + ruled.join(', ') + '), '
    + (VG.grounds().filter(g => VG.speedOf(g).known).length - ruled.length) + ' measured');
  ok('his four translated speeds are there, as he gave them',
     VG.speedOf('freeway').speed === 1.00 && VG.speedOf('open_desert').speed === 0.75
     && VG.speedOf('wash_and_shore').speed === 0.50 && VG.speedOf('hills').speed === 0.25);
  ok('each says it is RULED and names the wiki translation',
     ruled.every(g => VG.speedOf(g).from === 'RULED' && /wiki/i.test(VG.speedOf(g).ruling)));
  ok('*** EVERY SPEED CARRIES tuned:false, because every felt number is TUNING\'S ***',
     VG.grounds().filter(g => VG.speedOf(g).known).every(g => VG.speedOf(g).tuned === false));
  ok('the sight list is his too, and the hills really get the bonus',
     VG.sightOf('hills').sight === 1.25 && VG.sightOf('freeway').sight === 1.00);

  /* *** THE ANCHOR IS HIS NUMBER, NOT A CONSTANT. *** */
  ok('the derived scale is anchored on a ruled ground',
     VG.ANCHOR.ground === 'open_desert'
     && VG.ANCHOR.ruledSpeed === VG.RULED_SPEED.open_desert.speed);
  ok('and the anchor is arithmetic, not a coincidence',
     Math.abs(VG.ANCHOR.measuredOpen * VG.ANCHOR.factor - VG.ANCHOR.ruledSpeed) < 1e-9);

  /* *** THE OPEN SHARES ARE RE-MEASURED HERE, so they cannot drift from the city. */
  const share = {};
  fs.readdirSync(P('engine')).filter(f => f.startsWith('bohemia_') && f.endsWith('.js')).forEach(f => {
    const src = read('engine/' + f);
    const ms = [...src.matchAll(/\b\d+\s*:\s*\{\s*name\s*:\s*'[^']*'\s*,\s*kind\s*:\s*'([a-z0-9_-]+)'/g)].map(m => m[1]);
    if (ms.length < 4) return;
    let open = 0, blocked = 0;
    ms.forEach(k => {
      const c = TK.classOf(k); if (!c.known) return;
      if (c.klass === 'TILE') { if (k === 'building' || k === 'structure') blocked++; else open++; }
      else if (c.klass === 'BLOCKER') blocked++;
    });
    if (open + blocked) share[f.replace('bohemia_', '').replace('.js', '')] = open / (open + blocked);
  });
  let worst = 0, worstG = null;
  Object.keys(VG.OPEN_SHARE).forEach(g => {
    const kits = (BT.FROM[g] || []).filter(d => share[d] !== undefined);
    if (!kits.length) return;
    const avg = kits.reduce((a, d) => a + share[d], 0) / kits.length;
    const d = Math.abs(avg - VG.OPEN_SHARE[g]);
    if (d > worst) { worst = d; worstG = g; }
  });
  console.log('    [measured] the open shares re-measured off the kits; worst drift '
    + worst.toFixed(3) + (worstG ? ' on ' + worstG : ''));
  ok('*** THE MEASURED SHARES STILL MATCH THE CITY\'S OWN KITS ***', worst < 0.02,
     'drift ' + worst.toFixed(3) + ' on ' + worstG);
});

/* ---- D. *** THE POOL IS NOT A TABLE *** --------------------------------- */
section('D who roams a ground is who holds it', () => {
  const m = OM.buildOvermap(1337), turf = turfFor(m);
  const strip = VG.poolOf({ map: m, turf: turf, ground: 'the_strip' });
  const hills = VG.poolOf({ map: m, turf: turf, ground: 'hills' });
  console.log('    [measured] the strip: ' + strip.cells + ' cells, ' + strip.pool.length
    + ' outfits, the top one holds ' + Math.round(100 * strip.pool[0].share) + '%');
  console.log('    [measured] the hills: ' + hills.cells + ' cells, ' + hills.pool.length
    + ' outfits, the top one holds ' + Math.round(100 * hills.pool[0].share) + '%');
  ok('a ground really has a pool', strip.known && strip.pool.length > 0);
  ok('*** AND THE GROUND REALLY DOES PICK: one ground is one outfit\'s and another is split ***',
     strip.pool[0].share > 0.6 && hills.pool[0].share < 0.4,
     'strip ' + strip.pool[0].share + ', hills ' + hills.pool[0].share);
  ok('asking without the live map answers by name rather than guessing',
     VG.poolOf({ ground: 'hills' }).why === VG.NO_MAP);
  const live = read('engine/bohemia_valleyground.js').replace(/\/\*[\s\S]*?\*\//g, ' ');
  ok('*** NO POOL IS STORED IN THE MODULE ***',
     !/POOL\s*=\s*\{|POOLS\s*=\s*\{/.test(live));
  ok('and no faction is named anywhere in it',
     !Object.keys(turf.byFaction).some(f => new RegExp('\\b' + f + '\\b').test(live)),
     'a faction name is hard-coded in the module');
  ok('the data file stores no pool either, and says why',
     !DATA.pools && /counts the live turf/.test(DATA.poolIsDerived || ''));
});

/* ---- E. THE THREE THAT ARE NOT GROUNDS ---------------------------------- */
section('E rubble, the casino floor and a ridge are not grounds', () => {
  ok('each is declared with what it is instead',
     VG.NOT_A_GROUND.ruin.is === 'CONDITION'
     && VG.NOT_A_GROUND.casino_floor.is === 'INTERIOR'
     && VG.NOT_A_GROUND.ridges.is === 'FEATURE');
  ok('*** AND EACH KEEPS HIS RULED NUMBER FOR THE DAY SOMETHING MARKS IT ***',
     VG.NOT_A_GROUND.ruin.speed === 0.65 && VG.NOT_A_GROUND.ridges.sight === 2.00);
  ok('asking for their speed answers NOT_A_GROUND and says why',
     VG.speedOf('ruin').why === VG.NOT_A_GROUND_WHY && /CONDITION/.test(VG.speedOf('ruin').is)
     && VG.speedOf('ridges').why === VG.NOT_A_GROUND_WHY);
  SEEDS.slice(0, 4).forEach(s => {
    const c = VG.census(OM.buildOvermap(s), null);
    ok('seed ' + s + ' gives the ruin no ground', !c.byGround.ruin);
  });
  ok('and the two that [board terrains] named still agree with it',
     !!BT.NOT_ON_THE_MAP.ruin && !!BT.NOT_ON_THE_MAP.casino_floor);
});

/* ---- F. NO FACTION IS GIVEN A COLOUR ------------------------------------ */
section('F colour is territory, and whose hue is whose is his', () => {
  const m = OM.buildOvermap(1337);
  const names = Object.keys(turfFor(m).byFaction);
  const tool = read('tools/bohemia_who_roams_cook_10_9_26.js');
  const leaked = names.filter(n => new RegExp(n + '\\s*:\\s*[\'"]#', 'i').test(tool));
  console.log('    [measured] ' + names.length + ' factions on the map, ' + leaked.length + ' given a colour');
  ok('*** THE COOK GIVES NO FACTION A COLOUR ***', leaked.length === 0, leaked.join(', '));
  ok('and it says in its own head why it paints grip instead',
     /COLOUR IS TERRITORY/.test(tool) && /which faction owns which hue is HIS/i.test(tool));
  ok('the refusal is a live statement, not a comment',
     /whose hue is whose is his[\s\S]{0,60}process\.exit\(1\)/
       .test(tool.replace(/\/\*[\s\S]*?\*\//g, ' ')));
});

/* ---- G. THE PICTURE ----------------------------------------------------- */
section('G the picture is the live map, and the panels disagree', () => {
  const m = DOC.measured;
  console.log('    [measured] fastest ' + m.fastest.ground + ' ' + m.fastest.speed
    + ', slowest ' + m.slowest.ground + ' ' + m.slowest.speed
    + '; tightest held ' + m.tightestHeld.ground + ' at ' + Math.round(100 * m.tightestHeld.topShare)
    + '%, loosest ' + m.loosestHeld.ground + ' at ' + Math.round(100 * m.loosestHeld.topShare) + '%');
  console.log('    [measured] the two panels agree on ' + m.panelsAgreePct + '% of the valley');
  ok('the picture read every cell of a real valley', m.withSpeed === m.cells && m.cells === 9216);
  ok('*** THE TWO PANELS SAY DIFFERENT THINGS ***', m.panelsAgreePct < 75,
     m.panelsAgreePct + '% agreement');
  ok('*** AND THE FINDING IS REAL: the fastest ground is not the most held one ***',
     m.fastest.ground !== m.tightestHeld.ground);
  ok('the fastest ground is the road, as he ruled', m.fastest.speed === 1.00);
  ok('it is a draft and nothing on a play surface',
     DOC.draft === true && /rule 18/.test(DOC.not_shipped));
  ok('the picture exists where he can reach it',
     fs.existsSync(P('slices/vote/WORLD_HOW_FAST_AND_WHO.png')));
  ok('one pixel per cell, so it is the data and not a drawing of it',
     DOC.size.oneCellOnePixel === true);
  const tool = read('tools/bohemia_who_roams_cook_10_9_26.js').replace(/\/\*[\s\S]*?\*\//g, ' ');
  ok('the no-speed refusal is a live statement, not a comment',
     /Every map cell has a ground[\s\S]{0,60}process\.exit\(1\)/.test(tool));
  ok('the two-panels-agree refusal is live',
     /the first one tinted[\s\S]{0,60}process\.exit\(1\)/.test(tool));
  ok('the data file says it is generated and must not be hand edited',
     /do not hand edit/i.test(DATA._readme));
  ok('and it says the two-speed world it replaces at map scale',
     /PAVED_SPEED/.test(DOC.the_two_speed_world || ''));
});

console.log('VALLEY GROUNDS GATE: ' + pass + ' passed, ' + fail + ' failed'
  + '  (every cell of ten valleys has a ground and a travel speed, the speeds are'
  + ' ruled where he ruled and measured where he did not on a scale anchored to his'
  + ' own dirt, and the pool is never a table: who roams a ground is who holds it)');
process.exit(fail ? 1 : 0);
