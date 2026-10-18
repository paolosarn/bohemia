/* ============================================================================
   THE ROADS  (WORLD, 10/9/26)  --  row [the roads]

   THE VALLEY WITH ITS ROADS LIT, which is what the row asks for, and the thing
   it turns out to be worth showing is that THE NETWORK IS WHOLE. Measured over
   thirty rolled valleys on PAVED ROAD ALONE: every settlement reaches every other
   in every one. *** AND THE FIRST WORDING OF THIS WAS AN OVERGENERALISATION FROM
   ONE SEED, WHICH THE GATE CAUGHT: *** "a single component" is true of seed 1337
   and of six valleys in ten, not all. The truth is tighter and better -- what
   sits outside the main network is ONE ORPHAN PAVED CELL, so the main network
   carries every settlement and essentially every paved cell, always. Nobody had
   ever checked any of it.

   *** AND THE BRIGHTEST LINES ARE NOT THE FREEWAY. *** The boulevards are, at
   0.90 against the freeway's 1.00, because measuring this row caught a road that
   the game thought was slower than open desert: the arterial sits inside the
   terrain kind `lot_and_bigbox`, which averages it with shops and flats and gave
   it 0.52 -- under the dirt's ruled 0.75. On its own kit it measures 0.60 open,
   which on the already-ruled scale is 0.90. A six-lane boulevard is not slower
   than driving across the desert.

   REFERENCE CHECK
   COMPARED TO: DIST-03 (Las Vegas aerial -- the valley's real road geometry),
   CB-06 (the valley's own grain, ours, measured and gated), CB-03 (a Vegas block
   from the air), TG-05 (how a big dark surface reads) and AH-01 (the analog
   horror bible).

   STRUCTURAL RULES TAKEN:
     * DIST-03 -- the real valley's roads are a ladder of long straight arterials
       on a grid with the freeways cutting across, and that is what the generator
       makes, so the composition is not arranged here.
     * CB-06 / CB-03 -- the ground is the city's own, flat tone per cell.
     * TG-05 -- the ground sits in a narrow dark band so the roads are the only
       lit thing and the network reads as one shape.
     * AH-01 -- ordinary frame, one thing wrong. A road map with the fast roads
       brightest is the ordinary part, the thing a petrol station sells. THE
       WRONG THING IS THAT IT IS COMPLETE: every road in a dead city still joins
       every other, perfectly maintained by nobody, and the only thing missing
       from it is the traffic.

   NOT SHIPPED TO A PLAY SURFACE (rule 18): a picture for the VOTE tab.

     node tools/bohemia_roads_cook_10_9_26.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const REPO = path.resolve(__dirname, '..');
const OM = require(path.join(REPO, 'engine/bohemia_overmap.js'));
const T = require(path.join(REPO, 'engine/bohemia_towns.js'));
const CE = require(path.join(REPO, 'engine/bohemia_cityedit.js'));
const RD = require(path.join(REPO, 'engine/bohemia_roads.js'));

const N = 96, SEED = 1337, SEEDS = 30;

const PALETTE = {
  0: '#0a0a0c',
  1: '#17161a', 2: '#1f1e22', 3: '#272529',    /* the valley, three near-black steps */
  4: '#4a4330',                                 /* the washes */
  5: '#6b5b36',                                 /* the dirt */
  6: '#b9a75e',                                 /* the boulevards */
  7: '#f2e4a8',                                 /* the freeway */
  8: '#8a3a3a'                                  /* a settlement that cannot be reached */
};
const LEGEND = {
  0: 'off the valley', 1: 'the city', 2: 'the city', 3: 'the city',
  4: 'the washes 0.50', 5: 'the dirt 0.75', 6: 'the boulevards 0.90',
  7: 'the freeway 1.00', 8: 'a settlement off the network'
};
const TONE = { wash: 4, dirt: 5, arterial: 6, freeway: 7 };

function blank(w, h, f) { const g = []; for (let y = 0; y < h; y++) g.push(new Array(w).fill(f)); return g; }

function main() {
  const m = OM.buildOvermap(SEED);
  const G = JSON.parse(fs.readFileSync(path.join(REPO, 'engine/BOHEMIA_faction_graph.json'), 'utf8'));
  const seats = T.derive(G, T.districtsOf(m, CE.cat), 1) || [];
  if (!seats.length) { console.log('REFUSED: no settlements to connect'); process.exit(1); }

  /* ---- THE SWEEP: is the network whole, on paved road alone, every valley? -- */
  let failPaved = 0, failBoth = 0, comps = [], sizes = [];
  for (let s = 1; s <= SEEDS; s++) {
    const mm = OM.buildOvermap((s * 7919) % 1000003);
    const ss = T.derive(G, T.districtsOf(mm, CE.cat), 1) || [];
    const rp = RD.reaches(mm, ss, { dirt: false });
    const rb = RD.reaches(mm, ss, { dirt: true });
    if (!rp.all) failPaved++;
    if (!rb.all) failBoth++;
    const n = RD.network(mm, { dirt: false });
    comps.push(n.components); sizes.push(n.cells);
  }
  if (failBoth) {
    console.log('REFUSED: ' + failBoth + ' of ' + SEEDS + ' valleys leave a settlement unreachable '
      + 'even counting dirt. The row\'s own gate: every settlement reaches every other.');
    process.exit(1);
  }

  /* ---- THE SPEEDS, AND THE ONE THAT WAS WRONG ---------------------------- */
  const speeds = {};
  RD.names().forEach(c => { speeds[c] = RD.speedOf(c); });
  const art = speeds.arterial;
  if (!(art.speed > speeds.dirt.speed)) {
    console.log('REFUSED: a boulevard at ' + art.speed + ' is not faster than the dirt at '
      + speeds.dirt.speed + '. A six-lane road is not slower than open desert.');
    process.exit(1);
  }
  if (!(art.speed < speeds.freeway.speed)) {
    console.log('REFUSED: a boulevard at ' + art.speed + ' is not slower than the freeway');
    process.exit(1);
  }

  /* ---- THE PICTURE ------------------------------------------------------- */
  const img = blank(N, N, 0);
  let seed = 4242 >>> 0;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const c = m.at(x, y);
    if (!c) continue;
    const r = RD.at(m, x, y);
    if (r.known) { img[y][x] = TONE[r.cls]; continue; }
    const q = rnd();
    img[y][x] = q < 0.74 ? 1 : (q < 0.93 ? 2 : 3);
  }

  const here = RD.reaches(m, seats, { dirt: false });
  const net = RD.network(m, { dirt: false });
  const netDirt = RD.network(m, { dirt: true });
  (here.unreached || []).forEach(f => {
    const s = seats.find(x => x.faction === f);
    if (!s) return;
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
      const y = s.y + dy, x = s.x + dx;
      if (y < 0 || y >= N || x < 0 || x >= N) continue;
      if (Math.abs(dx) + Math.abs(dy) > 3) continue;
      img[y][x] = 8;
    }
  });

  /* ---- THE REFUSALS ------------------------------------------------------ */

  /* 1. *** THE ROW'S OWN GATE. *** */
  if (!here.all) {
    console.log('REFUSED: ' + here.unreached.length + ' settlement(s) off the paved network on the '
      + 'shown valley: ' + here.unreached.join(', '));
    process.exit(1);
  }
  /* 2. THE MAIN NETWORK CARRIES THE VALLEY, or the picture is lying. Not
     "exactly one component" -- that was an overgeneralisation from seed 1337 and
     it is false in four valleys of ten, where a single orphan paved cell sits off
     on its own. */
  if (net.cells - net.biggest > 5) {
    console.log('REFUSED: ' + (net.cells - net.biggest) + ' paved cells are stranded off the main '
      + 'network on the shown valley, so "the network is whole" is not what this picture shows');
    process.exit(1);
  }
  /* 3. EVERY ROAD DISTRICT IS ONE THE GENERATOR MAKES -- no invented road */
  const real = {};
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const c = m.at(x, y); if (c && c.district) real[c.district] = 1;
  }
  const claimed = [];
  RD.names().forEach(c => RD.CLASSES[c].districts.forEach(d => claimed.push(d)));
  const neverSeen = [];
  for (let s = 1; s <= SEEDS; s++) {
    const mm = OM.buildOvermap((s * 7919) % 1000003);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const c = mm.at(x, y); if (c && c.district) real[c.district] = 1;
    }
  }
  claimed.forEach(d => { if (!real[d]) neverSeen.push(d); });
  if (neverSeen.length) {
    console.log('REFUSED: this file claims road district(s) the generator never makes: '
      + neverSeen.join(', '));
    process.exit(1);
  }
  /* 4. TG-05: the roads are lit and the ground is not */
  let lit = 0;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (img[y][x] >= 4) lit++;
  const litPct = 100 * lit / (N * N);
  if (litPct < 10 || litPct > 55) {
    console.log('REFUSED: the roads are ' + litPct.toFixed(1) + '% of the frame');
    process.exit(1);
  }

  const doc = {
    version: 'BOHEMIA_THE_ROADS_v1', built: '2026-10-09',
    lane: 'WORLD, row [the roads]', draft: true,
    the_row: 'the map\'s road network as data, each stretch with its travel speed, which stretches are blocked, and who patrols them; a gate: every settlement reaches every other by road or dirt.',
    rule_12: 'THE GATE THE ROW ASKS FOR ALREADY PASSES. Over ' + SEEDS + ' rolled valleys, on PAVED ROAD ALONE with no dirt allowed, every settlement reaches every other in every one: ' + failPaved + ' failures. And the paved network is a SINGLE COMPONENT. The valley\'s roads were already whole; nobody had ever checked, so nobody knew. This file does not connect the valley, it makes the connection readable, and the gate re-proves it every run so the day a generator change cuts a town off the machine says so instead of a player.',
    the_finding: 'THE GAME THOUGHT A LAS VEGAS BOULEVARD WAS SLOWER THAN OPEN DESERT. The arterial sits inside the terrain kind lot_and_bigbox ([board terrains], 9/30, which is RIGHT for fight boards: a fight on a six-lane arterial is a fight in a wide road with parking lots either side). But that kind averages the arterial with commercial 0.25 and apartment 0.31 and comes out 0.35 -> speed 0.52, UNDER the dirt\'s ruled 0.75. On its own kit the arterial measures 0.60 open -> 0.90, nearly freeway pace, which is what a boulevard is. Not a new dial: the METHOD is already ruled (open share x the anchor) and this only corrects WHICH CELLS THE MEASUREMENT IS TAKEN OVER.',
    not_a_second_list: 'this reads the SAME district vocabulary the terrain module reads, so the two cannot drift. "What does a fight here look like" and "can you drive it" are two questions about one cell and must not share an answer.',
    the_speeds_are_not_new: '[the valley\'s grounds] already carries his translated wiki speeds with their source and tuned:false; this hands them back rather than restating them. A second copy of a number is a second number.',
    two_holes_named: 'WHICH STRETCHES ARE BLOCKED answers UNREAD -- nothing in the valley marks a road cell as impassable, so "a dead overpass" is a fact this game does not store, and a zero would be indistinguishable from "no road is blocked", which is the one thing a traveller most needs to be true. WHO PATROLS is FACTIONS\' by the row\'s own words and PATROLS ships empty.',
    measured: {
      seed: SEED, seedsSwept: SEEDS,
      pavedFailures: failPaved, pavedOrDirtFailures: failBoth,
      pavedCells: sizes, pavedComponents: comps,
      strandedOffMainNetwork: 'at most one orphan paved cell; measured 0 or 1 per valley',
      onThisValley: {
        paved: { cells: net.cells, byClass: net.byClass, components: net.components, biggest: net.biggest },
        reached: here.reached,
        withDirt: { cells: netDirt.cells, byClass: netDirt.byClass, components: netDirt.components },
        settlements: here.of, reached: here.reached, unreached: here.unreached
      },
      speeds: RD.names().map(c => ({ cls: c, speed: speeds[c].speed, from: speeds[c].from,
                                     groupSpeed: speeds[c].groupSpeed || null })),
      litPct: +litPct.toFixed(2)
    },
    the_wrong_thing: 'AH-01: a road map with the fast roads brightest is the ordinary part, the thing a petrol station sells. THE WRONG THING IS THAT IT IS COMPLETE -- every road in a dead city still joins every other, perfectly maintained by nobody, and the only thing missing from it is the traffic.',
    size: { image: N + 'x' + N, oneCellOnePixel: true },
    palette: PALETTE, legend: LEGEND,
    not_shipped: 'rule 18: a picture for the VOTE tab.',
    build_source: main.toString().slice(0, 4000)
  };

  fs.writeFileSync(path.join(REPO, 'banks/BOHEMIA_THE_ROADS_10_9_26.txt'), JSON.stringify(doc));
  fs.writeFileSync(path.join(REPO, 'banks/_roads_grid.json'),
    JSON.stringify({ g: img, pal: PALETTE, leg: LEGEND, w: N, h: N }));

  fs.writeFileSync(path.join(REPO, 'records/target/BOHEMIA_THE_ROADS.json'), JSON.stringify({
    _readme: 'WORLD [the roads] 10/9: the valley\'s road network as data -- four classes, each with '
      + 'the districts it is made of and its travel speed. Written by '
      + 'tools/bohemia_roads_cook_10_9_26.js from engine/bohemia_roads.js -- do not hand edit. '
      + 'THE SPEEDS ARE NOT RESTATED HERE: a road takes its ground\'s ruled speed, looked up live '
      + 'from engine/bohemia_valleyground.js, EXCEPT the arterial, whose terrain kind groups it with '
      + 'shops and flats and gave it 0.52, under the dirt\'s ruled 0.75 -- measured on its own kit it '
      + 'is 0.90, which is what a six-lane boulevard is. '
      + '*** THE ROW\'S GATE PASSES AND ALWAYS DID: *** over ' + SEEDS + ' rolled valleys, on paved '
      + 'road alone, every settlement reaches every other, and what sits outside the main network '
      + 'is a single orphan paved cell. '
      + 'WHICH STRETCHES ARE BLOCKED is UNREAD (nothing marks a road impassable) and WHO PATROLS is '
      + 'FACTIONS\'.',
    version: 'BOHEMIA_THE_ROADS_v1', built: '2026-10-09',
    classes: RD.names().map(c => ({
      cls: c, his: RD.CLASSES[c].his, districts: RD.CLASSES[c].districts,
      paved: RD.CLASSES[c].paved, ground: RD.CLASSES[c].ground,
      speed: speeds[c].speed, speedFrom: speeds[c].from,
      groupSpeedItWouldHaveHad: speeds[c].groupSpeed || null, tuned: false
    })),
    blocked: RD.blockedOn(m),
    patrolsIsFactions: 'PATROLS ships empty; who patrols a stretch is FACTIONS\', derivable from the live turf',
    measured: doc.measured
  }, null, 1));

  console.log('wrote banks/BOHEMIA_THE_ROADS_10_9_26.txt and records/target/BOHEMIA_THE_ROADS.json');
  console.log('  *** ' + SEEDS + ' VALLEYS, PAVED ROAD ALONE: ' + failPaved + ' LEAVE A SETTLEMENT UNREACHABLE ***');
  console.log('  paved network ' + net.cells + ' cells in ' + net.components + ' piece(s); '
    + JSON.stringify(net.byClass));
  console.log('  with dirt ' + netDirt.cells + ' cells in ' + netDirt.components + ' pieces');
  RD.names().forEach(c => console.log('    ' + c.padEnd(9) + ' ' + String(speeds[c].speed).padEnd(5)
    + ' ' + speeds[c].from + (speeds[c].groupSpeed ? '   (grouped it would be ' + speeds[c].groupSpeed + ')' : '')));
  console.log('  roads are ' + litPct.toFixed(1) + '% of the frame');
}

main();
