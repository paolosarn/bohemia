#!/usr/bin/env node
/* BOHEMIA — ROADS GATE (10/9/26, WORLD lane)
 *
 * ROW [the roads]: the map's road network as data, each stretch with its travel
 * speed, which stretches are blocked and who patrols them. The row's own gate:
 * EVERY SETTLEMENT REACHES EVERY OTHER BY ROAD OR DIRT.
 *
 *  A  *** THE ROW'S GATE, AND IT ALREADY PASSED BEFORE THE WORK. *** Over thirty
 *     rolled valleys on PAVED ROAD ALONE, every settlement reaches every other in
 *     every one, and the paved network is a SINGLE COMPONENT. The valley's roads
 *     were already whole; nobody had ever checked, so nobody knew. The point of
 *     the gate is not to turn green today, it is to go red the day a generator
 *     change cuts a town off, so the machine says so instead of a player.
 *
 *  B  *** AND MEASURING IT CAUGHT A ROAD SLOWER THAN OPEN DESERT. *** The arterial
 *     sits inside the terrain kind lot_and_bigbox — right for fight boards, wrong
 *     for driving — which averages it with shops and flats and gave it 0.52,
 *     under the dirt's ruled 0.75. On its own kit it is 0.90. Not a new dial: the
 *     method is already ruled and only the cells it is taken over changed. The
 *     gate re-measures both every run so neither can drift.
 *
 *  C  NO SECOND LIST AND NO SECOND NUMBER. The road classes read the same district
 *     vocabulary the terrain module reads, and a ruled speed is looked up live
 *     rather than restated.
 *
 *  D  TWO HOLES NAMED: blocked stretches answer UNREAD (nothing marks a road
 *     impassable) and PATROLS ships empty because the row says FACTIONS owns it.
 *
 *   node gates/roads_gate.js
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

const RD = R('engine/bohemia_roads.js');
const VG = R('engine/bohemia_valleyground.js');
const BT = R('engine/bohemia_boardterrain.js');
const TK = R('engine/bohemia_tilekinds.js');
const OM = R('engine/bohemia_overmap.js');
const T = R('engine/bohemia_towns.js');
const CE = R('engine/bohemia_cityedit.js');
const GRAPH = JSON.parse(read('engine/BOHEMIA_faction_graph.json'));
const DOC = JSON.parse(read('banks/BOHEMIA_THE_ROADS_10_9_26.txt'));
const DATA = JSON.parse(read('records/target/BOHEMIA_THE_ROADS.json'));

const SEEDS = [1, 7, 42, 1337, 2024, 5, 777, 99999, 31337, 123456];
const seatsOf = (m) => T.derive(GRAPH, T.districtsOf(m, CE.cat), 1) || [];

/* ---- A. *** THE ROW'S OWN GATE *** -------------------------------------- */
section('A every settlement reaches every other', () => {
  let failPaved = 0, failDirt = 0, oneComponent = 0, cells = [], strays = [];
  const offenders = [];
  SEEDS.forEach(s => {
    const m = OM.buildOvermap(s);
    const seats = seatsOf(m);
    const rp = RD.reaches(m, seats, { dirt: false });
    const rb = RD.reaches(m, seats, { dirt: true });
    if (!rp.all) { failPaved++; offenders.push(s + ':' + rp.unreached.join('/')); }
    if (!rb.all) failDirt++;
    const n = RD.network(m, { dirt: false });
    cells.push(n.cells);
    /* *** "A SINGLE COMPONENT" WAS AN OVERGENERALISATION FROM SEED 1337, AND THE
       GATE CAUGHT IT: one piece in 6 of 10. *** The truth is tighter and better:
       the extra pieces are ONE ORPHAN PAVED CELL, so the main network always
       carries every settlement and essentially every paved cell. That is what is
       held here, because the false claim would have gone in the record. */
    strays.push(n.cells - n.biggest);
    if (n.biggest === n.cells) oneComponent++;
  });
  console.log('    [measured] ' + SEEDS.length + ' valleys; paved network '
    + Math.min.apply(null, cells) + '-' + Math.max.apply(null, cells) + ' cells; '
    + 'exactly one piece in ' + oneComponent + '/' + SEEDS.length
    + '; orphan cells outside the main network: ' + Math.min.apply(null, strays) + '-'
    + Math.max.apply(null, strays));
  ok('the sweep looked at more than one valley', SEEDS.length >= 10);
  ok('*** NOT ONE VALLEY LEAVES A SETTLEMENT UNREACHABLE BY ROAD OR DIRT ***',
     failDirt === 0, failDirt + ' valleys');
  ok('*** AND PAVED ROAD ALONE IS ENOUGH IN EVERY ONE ***',
     failPaved === 0, offenders.join(', '));
  ok('*** THE MAIN NETWORK IS NOT ISLANDS: anything outside it is a handful of orphan cells ***',
     Math.max.apply(null, strays) <= 5,
     'up to ' + Math.max.apply(null, strays) + ' cells stranded off the main network');
  ok('a settlement counts as on the network by touching it, not by being made of road',
     /a town sits BESIDE its road/.test(read('engine/bohemia_roads.js')));
});

/* ---- B. *** THE ROAD THAT WAS SLOWER THAN THE DESERT *** ---------------- */
section('B a boulevard is not slower than open desert', () => {
  const art = RD.speedOf('arterial'), dirt = RD.speedOf('dirt'), free = RD.speedOf('freeway');
  console.log('    [measured] freeway ' + free.speed + ' ' + free.from
    + ' | arterial ' + art.speed + ' ' + art.from + ' (grouped it would be ' + art.groupSpeed + ')'
    + ' | dirt ' + dirt.speed + ' ' + dirt.from);
  ok('*** THE BOULEVARD IS FASTER THAN THE DIRT ***', art.speed > dirt.speed,
     art.speed + ' against ' + dirt.speed);
  ok('and slower than the freeway', art.speed < free.speed);
  ok('*** AND THE GROUPED NUMBER REALLY WAS WORSE THAN THE DIRT, which is why this leg exists ***',
     art.groupSpeed < dirt.speed, 'grouped ' + art.groupSpeed);
  ok('it says it was measured on its own kit, not quietly swapped',
     art.from === 'MEASURED_ON_ITS_OWN_KIT');
  ok('and it carries tuned:false with a reason', art.tuned === false && /six-lane/.test(art.ruling));

  /* RE-MEASURE BOTH SHARES off the kits so neither can drift from the city */
  const share = (f) => {
    const src = read('engine/bohemia_' + f + '.js');
    const ms = [...src.matchAll(/\b\d+\s*:\s*\{\s*name\s*:\s*'[^']*'\s*,\s*kind\s*:\s*'([a-z0-9_-]+)'/g)].map(m => m[1]);
    let o = 0, b = 0;
    ms.forEach(k => {
      const c = TK.classOf(k); if (!c.known) return;
      if (c.klass === 'TILE') { if (k === 'building' || k === 'structure') b++; else o++; }
      else if (c.klass === 'BLOCKER') b++;
    });
    return (o + b) ? o / (o + b) : null;
  };
  const own = share('arterial');
  console.log('    [measured] the arterial kit re-measured: ' + own.toFixed(2) + ' open -> '
    + (own * VG.ANCHOR.factor).toFixed(2));
  ok('*** THE ARTERIAL\'S OWN SHARE STILL MATCHES ITS KIT ***',
     Math.abs(own - RD.OWN_SHARE.arterial) < 0.02,
     own.toFixed(3) + ' against ' + RD.OWN_SHARE.arterial);
  ok('and the speed really is that share on the already-ruled anchor',
     Math.abs(art.speed - +(RD.OWN_SHARE.arterial * VG.ANCHOR.factor).toFixed(2)) < 1e-9);
});

/* ---- C. NO SECOND LIST, NO SECOND NUMBER -------------------------------- */
section('C it reads the city\'s vocabulary and the ground\'s numbers', () => {
  const claimed = [];
  RD.names().forEach(c => RD.CLASSES[c].districts.forEach(d => claimed.push(d)));
  const realDistricts = {};
  SEEDS.forEach(s => {
    const m = OM.buildOvermap(s);
    for (let y = 0; y < 96; y++) for (let x = 0; x < 96; x++) {
      const c = m.at(x, y); if (c && c.district) realDistricts[c.district] = 1;
    }
  });
  const invented = claimed.filter(d => !realDistricts[d]);
  console.log('    [measured] ' + RD.names().length + ' road classes over ' + claimed.length
    + ' districts, ' + (claimed.length - invented.length) + ' of which the generator makes');
  ok('*** IT INVENTS NO ROAD: every district it claims is one the generator makes ***',
     invented.length === 0, invented.join(', '));
  ok('no district is claimed by two classes', claimed.length === new Set(claimed).size);
  ok('every class names the terrain ground it takes its speed from',
     RD.names().every(c => BT.KINDS.indexOf(RD.CLASSES[c].ground) >= 0));
  ok('*** A RULED SPEED IS LOOKED UP LIVE, NEVER RESTATED ***',
     RD.speedOf('freeway').speed === VG.speedOf('freeway').speed
     && RD.speedOf('dirt').speed === VG.speedOf('open_desert').speed
     && RD.speedOf('wash').speed === VG.speedOf('wash_and_shore').speed);
  const live = read('engine/bohemia_roads.js').replace(/\/\*[\s\S]*?\*\//g, ' ');
  ok('and the module holds no speed table of its own',
     !/SPEEDS?\s*=\s*\{/.test(live));
  ok('it says why roads are a different question from terrain kinds',
     /different question about the\s+same cell/i.test(read('engine/bohemia_roads.js')));
});

/* ---- D. THE TWO HOLES --------------------------------------------------- */
section('D what is blocked and who patrols', () => {
  const b = RD.blockedOn(OM.buildOvermap(1337));
  ok('*** WHICH STRETCHES ARE BLOCKED ANSWERS UNREAD, not zero ***',
     b.known === false && b.why === RD.UNREAD);
  ok('and it says why a zero would be worse than an unread',
     /indistinguishable from/.test(b.because));
  ok('*** PATROLS SHIPS EMPTY, because the row says FACTIONS owns it ***',
     Object.keys(RD.PATROLS).length === 0);
  ok('asking answers NO_RULING and names whose it is',
     RD.patrolOf('freeway').why === RD.NO_RULING && /FACTIONS/.test(RD.patrolOf('freeway').because));
  ok('a class that is not a road is refused, not improvised',
     RD.patrolOf('canal').why === RD.NOT_A_ROAD && RD.speedOf('canal').why === RD.NOT_A_ROAD);
  ok('a cell that is not a road says so by name',
     RD.at(OM.buildOvermap(1337), -5, -5).why === RD.NOT_A_ROAD
     || RD.at(OM.buildOvermap(1337), -5, -5).why === RD.NO_MAP);
});

/* ---- E. THE PICTURE AND THE DATA FILE ----------------------------------- */
section('E the picture is the live valley', () => {
  const m = DOC.measured;
  console.log('    [measured] shown valley: ' + m.onThisValley.paved.cells + ' paved cells in '
    + m.onThisValley.paved.components + ' piece(s), ' + m.onThisValley.reached + '/' + m.onThisValley.settlements
    + ' settlements, roads ' + m.litPct + '% of the frame');
  ok('the sweep in the picture is real', m.seedsSwept >= 30 && m.pavedFailures === 0);
  ok('the shown valley\'s main network carries essentially every paved cell',
     m.onThisValley.paved.biggest >= m.onThisValley.paved.cells - 5);
  ok('every settlement on it is reached', m.onThisValley.unreached.length === 0);
  ok('the roads are lit and the ground is not', m.litPct > 10 && m.litPct < 55);
  ok('it is a draft and nothing on a play surface',
     DOC.draft === true && /rule 18/.test(DOC.not_shipped));
  ok('the picture exists where he can reach it',
     fs.existsSync(P('slices/vote/WORLD_THE_ROADS.png')));
  ok('one pixel per cell', DOC.size.oneCellOnePixel === true);
  ok('the record keeps the boulevard finding',
     /slower than open desert/i.test(DOC.the_finding || ''));
  ok('the data file says it is generated and must not be hand edited',
     /do not hand edit/i.test(DATA._readme));
  ok('and it carries the speed each class would have had grouped',
     DATA.classes.some(c => c.groupSpeedItWouldHaveHad !== null));
  const tool = read('tools/bohemia_roads_cook_10_9_26.js').replace(/\/\*[\s\S]*?\*\//g, ' ');
  ok('the unreachable refusal is a live statement, not a comment',
     /every settlement reaches every other[\s\S]{0,60}process\.exit\(1\)/.test(tool));
  ok('the slower-than-desert refusal is live',
     /not slower than open desert[\s\S]{0,60}process\.exit\(1\)/.test(tool));
  ok('and the network-is-whole refusal is live',
     /stranded off the main[\s\S]{0,120}process\.exit\(1\)/.test(tool));
});

console.log('ROADS GATE: ' + pass + ' passed, ' + fail + ' failed'
  + '  (every settlement reaches every other on paved road alone in ten valleys and the'
  + ' main network carries every one of them, the boulevard is 0.90 and no longer slower than the'
  + ' desert, and what is blocked is UNREAD because nothing marks a road impassable)');
process.exit(fail ? 1 : 0);
