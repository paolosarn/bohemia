/* ============================================================================
   THE PLACES WORTH GOING TO  (WORLD, 10/9/26)  --  row [where the god gear is]

   HIS WORDS (10/9): "finding good bros and good equipment throughout the
   settlements". The valley with the six legendary places marked, each ring sized
   by the guard that stands on it.

   *** AND ONE OF THEM IS MARKED AS NOT BEING THERE, WHICH IS THE FINDING. ***
   Swept over sixty rolled valleys: the arsenal and the data fortress are on every
   one, but the library is on 48 of 60. Battle Brothers puts its legendary
   locations on every map it generates; ours rolls them and sometimes does not, so
   in roughly one valley in five a rumour at the bar would point at a building
   that is not there. The picture says so instead of hiding it: a hollow ring on
   the edge for a place this valley did not roll.

   REFERENCE CHECK
   COMPARED TO: DIST-03 (Las Vegas aerial -- the valley's real shape), CB-06 (the
   valley's own grain, ours, measured and gated), CB-03 (a Vegas block from the
   air), TG-05 (how a big dark surface reads) and AH-01 (the analog horror bible).

   STRUCTURAL RULES TAKEN:
     * DIST-03 / CB-06 -- the ground is the generator's own valley, drawn the way
       [board terrains] draws it, so the marks sit on the real city.
     * CB-03 -- the ground is flat tone per cell; only the marks have shape.
     * TG-05 -- the valley sits in a narrow dark band so the six rings are the
       only bright thing on it.
     * AH-01 -- ordinary frame, one thing wrong. A map with six sites ringed is
       the ordinary part, the thing any strategy game prints. THE WRONG THING IS
       THAT THE RINGS ARE SIZED BY HOW MANY PEOPLE ARE STANDING ON THEM, so the
       best thing in the valley is also the widest circle of men, and one ring is
       empty because that building does not exist in this world.

   NOT SHIPPED TO A PLAY SURFACE (rule 18): a picture for the VOTE tab.

     node tools/bohemia_god_gear_cook_10_9_26.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const REPO = path.resolve(__dirname, '..');
const OM = require(path.join(REPO, 'engine/bohemia_overmap.js'));
const BT = require(path.join(REPO, 'engine/bohemia_boardterrain.js'));
const VG = require(path.join(REPO, 'engine/bohemia_valleyground.js'));
const GG = require(path.join(REPO, 'engine/bohemia_godgear.js'));

const N = 96, SEEDS = 60, SEED = 1337;

const PALETTE = {
  0: '#0a0a0c',
  1: '#1c1a18', 2: '#262320', 3: '#302b26',   /* the valley, three near-black steps */
  4: '#3a3f47',                                /* the roads */
  5: '#8a6a22', 6: '#c9a33a', 7: '#f0d888',    /* a ring: outer, mid, core */
  8: '#5a2a2a'                                 /* a place this valley did not roll */
};
const LEGEND = {
  0: 'off the valley', 1: 'the city', 2: 'the city', 3: 'the city', 4: 'the roads',
  5: 'the guard', 6: 'the guard', 7: 'the place itself',
  8: 'a place this valley did not roll'
};

function blank(w, h, f) { const g = []; for (let y = 0; y < h; y++) g.push(new Array(w).fill(f)); return g; }

function main() {
  const m = OM.buildOvermap(SEED);
  const spot = GG.on(m);
  const g = GG.guards(spot);
  if (!spot.known || !g.known) { console.log('REFUSED: no valley to read'); process.exit(1); }

  const w = JSON.parse(fs.readFileSync(path.join(REPO, 'records/target/bb/weapons.json'), 'utf8')).rows;
  const a = JSON.parse(fs.readFileSync(path.join(REPO, 'records/target/bb/armor.json'), 'utf8'));
  const pool = w.concat(a.body, a.head, a.shields);
  if (pool.length < 100) { console.log('REFUSED: the gear pool is ' + pool.length + ' rows'); process.exit(1); }
  if (pool.some(r => typeof r.value !== 'number')) {
    console.log('REFUSED: a gear row has no value, so it cannot be ranked');
    process.exit(1);
  }

  /* ---- THE SWEEP: how often is each of the six actually there -------------- */
  const tally = {}; GG.names().forEach(p => tally[p] = 0);
  for (let s = 1; s <= SEEDS; s++) {
    const sp = GG.on(OM.buildOvermap((s * 7919) % 1000003));
    GG.names().forEach(p => { if (sp.places[p].weight) tally[p]++; });
  }
  const notGuaranteed = GG.names().filter(p => tally[p] < SEEDS);
  if (!notGuaranteed.length) {
    console.log('REFUSED: every one of the six is on every valley, so the finding this picture '
      + 'is about has gone away and the picture needs rewriting');
    process.exit(1);
  }

  /* ---- THE GROUND -------------------------------------------------------- */
  const img = blank(N, N, 0);
  let seed = 90210 >>> 0;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const t = BT.at(m, x, y);
    if (!t.known) continue;
    if (t.kind === 'freeway') { img[y][x] = 4; continue; }
    const r = rnd();
    img[y][x] = r < 0.72 ? 1 : (r < 0.93 ? 2 : 3);
  }

  /* ---- THE RINGS, SIZED BY THE GUARD -------------------------------------- */
  const marks = [];
  Object.keys(g.by).forEach(p => {
    const c = spot.places[p].cells[0];
    const guard = g.by[p].guard;
    /* THE RING IS THE GUARD. radius grows with how many men stand there, so the
       picture's own geometry is the number and not a label beside it. */
    const rad = 3 + Math.round(6 * (guard / GG.CEILING.guard));
    for (let dy = -rad; dy <= rad; dy++) for (let dx = -rad; dx <= rad; dx++) {
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d > rad) continue;
      const y = c[1] + dy, x = c[0] + dx;
      if (y < 0 || y >= N || x < 0 || x >= N) continue;
      img[y][x] = d > rad - 1.2 ? 5 : (d > 1.6 ? 6 : 7);
    }
    const rw = GG.rewardOf({ pool: pool, guard: guard });
    marks.push({ place: p, at: c, guard: guard, radius: rad,
                 defended: g.by[p].defended, cells: spot.places[p].cells.length,
                 presentIn: tally[p] + '/' + SEEDS,
                 topReward: rw.rows[0].name, topValue: rw.rows[0].value,
                 rewardFromRank: rw.from });
  });

  /* ---- THE ONE THIS VALLEY DID NOT ROLL ----------------------------------- */
  const absent = spot.missing.slice();
  absent.forEach((p, i) => {
    const cy = 8 + i * 16, cx = N - 7, rad = 5;
    for (let dy = -rad; dy <= rad; dy++) for (let dx = -rad; dx <= rad; dx++) {
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d > rad || d < rad - 1.3) continue;
      const y = cy + dy, x = cx + dx;
      if (y < 0 || y >= N || x < 0 || x >= N) continue;
      img[y][x] = 8;
    }
  });

  /* ---- THE REFUSALS ------------------------------------------------------- */

  /* 1. THE SIX ARE REAL DISTRICTS. Not one is invented.
     *** AND THE FIRST CUT OF THIS CHECK CONFLATED "NOT ON THIS SEED" WITH
     "INVENTED" and refused the library, which is the very thing this picture
     exists to show. A place is invented only if it is on NO valley; a place
     absent from THIS valley is the finding, not a fault. */
  const invented = GG.names().filter(p => tally[p] === 0);
  if (invented.length) {
    console.log('REFUSED: ' + invented.length + ' place(s) are on no valley at all, so they are '
      + 'invented, not rolled: ' + invented.join(', '));
    process.exit(1);
  }

  /* 2. *** THE PLACES MUST NOT ALL BE THE SAME. *** The first cut ranked them by
     cell count and five of the six came out identical -- same guard, same reward
     -- which is [bb places]' 9/25 defect, a shelf that is a function of tier
     alone. */
  const guardsSeen = new Set(marks.map(x => x.guard));
  if (guardsSeen.size < Math.max(2, marks.length - 1)) {
    console.log('REFUSED: ' + marks.length + ' places share only ' + guardsSeen.size
      + ' guard sizes. Every camp selling the same four things is the defect this lane measured on 9/25.');
    process.exit(1);
  }
  const rewardsSeen = new Set(marks.map(x => x.topReward));
  if (rewardsSeen.size < guardsSeen.size) {
    console.log('REFUSED: ' + guardsSeen.size + ' guard sizes but only ' + rewardsSeen.size
      + ' different top rewards; better guarded must mean better gear');
    process.exit(1);
  }

  /* 3. BETTER GUARDED IS BETTER GEAR, monotonically, or the chain is decoration */
  const bySize = marks.slice().sort((x, y) => x.guard - y.guard);
  for (let i = 1; i < bySize.length; i++) {
    if (bySize[i].topValue < bySize[i - 1].topValue) {
      console.log('REFUSED: ' + bySize[i].place + ' is guarded harder than ' + bySize[i - 1].place
        + ' and pays worse; the reward must follow the guard');
      process.exit(1);
    }
  }

  /* 4. TG-05: the rings are the only bright thing, and a minority of the frame */
  let bright = 0;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (img[y][x] >= 5) bright++;
  const brightPct = 100 * bright / (N * N);
  if (brightPct > 12) { console.log('REFUSED: the marks are ' + brightPct.toFixed(1) + '% of the frame'); process.exit(1); }

  const doc = {
    version: 'BOHEMIA_PLACES_WORTH_GOING_TO_v1', built: '2026-10-09',
    lane: 'WORLD, row [where the god gear is]', draft: true,
    his_words: 'finding good bros and good equipment throughout the settlements.',
    rule_12: 'all six are real districts the generator already makes, so nothing here invents a location. But they are NOT GUARANTEED.',
    the_finding: 'over ' + SEEDS + ' rolled valleys the arsenal and the data fortress are on every one and THE LIBRARY IS ON ' + tally.library + ' OF ' + SEEDS + '. Battle Brothers puts its legendary locations on every map it generates; ours rolls them and sometimes does not, so in roughly one valley in five a rumour at the bar would point at a building that is not there. The module reports the missing ones by name and the picture rings them hollow.',
    the_chain: 'nothing here is a table: a place is ranked, the rank sizes the guard off HIS OWN CEILING ("12 versus 60", rule 79), and the guard slices the reward out of the ranked gear pool, so better guarded is better gear by construction.',
    the_rank_is_mine: GG.DEFENDED_RULING.ruling,
    the_first_cut_was_wrong: 'it ranked them by cell count and five of the six came out IDENTICAL -- the data fortress is six cells and every other one is exactly one -- same guard of 10 and the same three reward rows. That is [bb places]\' own 9/25 defect, a shelf that is a function of tier alone, every camp selling the same four things, which this lane said then would never ship again. Scarcity across valleys does separate them but ranks the data fortress near the bottom, which is not what a fortress is. The honest reading is that THE MAP DOES NOT ENCODE WHICH OF THESE IS THE BIGGER PRIZE, so the order is stated as mine rather than dressed up as arithmetic.',
    measured: {
      seed: SEED, seedsSwept: SEEDS, poolRows: pool.length,
      presentIn: tally, notGuaranteed: notGuaranteed,
      missingOnThisValley: absent, marks: marks,
      ceiling: GG.CEILING, brightPct: +brightPct.toFixed(2)
    },
    the_wrong_thing: 'AH-01: a map with six sites ringed is the ordinary part, the thing any strategy game prints. THE WRONG THING IS THAT THE RINGS ARE SIZED BY HOW MANY PEOPLE ARE STANDING ON THEM, so the best thing in the valley is also the widest circle of men -- and one ring is empty because that building does not exist in this world.',
    size: { image: N + 'x' + N, oneCellOnePixel: true },
    palette: PALETTE, legend: LEGEND,
    not_shipped: 'rule 18: a picture for the VOTE tab.',
    build_source: main.toString().slice(0, 4000)
  };

  fs.writeFileSync(path.join(REPO, 'banks/BOHEMIA_PLACES_WORTH_GOING_TO_10_9_26.txt'), JSON.stringify(doc));
  fs.writeFileSync(path.join(REPO, 'banks/_godgear_grid.json'),
    JSON.stringify({ g: img, pal: PALETTE, leg: LEGEND, w: N, h: N }));

  fs.writeFileSync(path.join(REPO, 'records/target/BOHEMIA_GOD_GEAR_PLACES.json'), JSON.stringify({
    _readme: 'WORLD [where the god gear is] 10/9: the valley\'s six legendary places, each with the '
      + 'guard that stands on it and the reward it pays. Written by '
      + 'tools/bohemia_god_gear_cook_10_9_26.js from engine/bohemia_godgear.js -- do not hand edit. '
      + 'NOTHING HERE IS A TABLE: a place is ranked, the rank sizes the guard off HIS OWN CEILING '
      + '("12 versus 60", rule 79), and the guard slices the reward out of the ranked gear pool of '
      + pool.length + ' rows, so better guarded is better gear by construction. '
      + '*** THE SIX ARE NOT GUARANTEED: *** over ' + SEEDS + ' rolled valleys the library is on '
      + tally.library + ', so a rumour must check the valley it is in. '
      + 'THE RANK IS STATED AS MINE, not measured: the map does not encode which of these is the '
      + 'bigger prize (five of the six are one cell each), so the order is what the building WAS '
      + 'before the money died, and it is one line to change. WHO GUARDS IS FACTIONS\'.',
    version: 'BOHEMIA_GOD_GEAR_PLACES_v1', built: '2026-10-09',
    places: GG.PLACES, ceiling: GG.CEILING,
    rank: GG.DEFENDED, rankIs: GG.DEFENDED_RULING,
    presentInRolledValleys: tally, seedsSwept: SEEDS,
    onSeed1337: marks, missingOnSeed1337: absent,
    guardedByIsFactions: 'GUARDED_BY ships empty; who guards a place is FACTIONS\', derivable from the live turf'
  }, null, 1));

  console.log('wrote banks/BOHEMIA_PLACES_WORTH_GOING_TO_10_9_26.txt and records/target/BOHEMIA_GOD_GEAR_PLACES.json');
  console.log('  pool ' + pool.length + ' gear rows, all valued');
  console.log('  *** PRESENT IN ' + SEEDS + ' ROLLED VALLEYS: '
    + GG.names().map(p => p + ' ' + tally[p]).join(', ') + ' ***');
  console.log('  this valley is missing: ' + (absent.join(', ') || 'nothing'));
  marks.slice().sort((x, y) => y.guard - x.guard).forEach(x =>
    console.log('    ' + x.place.padEnd(11) + ' guard ' + String(x.guard).padStart(2)
      + '  ring r' + x.radius + '  top reward ' + x.topReward + ' (' + x.topValue + ')'));
  console.log('  marks are ' + brightPct.toFixed(2) + '% of the frame');
}

main();
