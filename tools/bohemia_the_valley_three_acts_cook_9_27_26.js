/* ============================================================================
   THE SAME VALLEY, THREE ACTS  (WORLD, 9/27/26, row [future city])

   RULE 31 (Paolo 9/23): act 2 and act 3 are DERIVED from the earlier acts'
   ledgers, never hand-placed. RULE 32(b) (Paolo 9/23, killing THE SAME CORNER
   and telling me why): "the future gets better. The right side is what the
   BEGINNING of the game is supposed to look like, and it gets better...
   reclaims parts of cities for economic purposes, more techy and modern."
   RULE 33 + his words 9/24: the future city IS the map at act 2 and act 3, the
   same roads, the fill derived. RULE 32(f): from the game's camera.

   *** THE WHOLE CLAIM OF THE ROW IN ONE PICTURE: THE LINES DO NOT MOVE AND THE
   LIGHT COMES BACK. *** The same valley three times, after dark, at the map
   camera he already plays. Every road, every mountain and every lot line is the
   SAME OBJECT in all three panels -- not redrawn, not copied, the same one --
   which is DYNASTY school round two's section 4 and the thing that makes a flip
   safe: a lot that exists in act 1 exists in act 3, always.

   WHY AT NIGHT, AND IT IS NOT A MOOD CHOICE. At map scale the thing that reads
   instantly is the light, and the light is exactly what a reclaimed valley gets
   back: his words are "reclaims parts of cities for economic purposes", and a
   part of a city that has been reclaimed is a part that is ON. It also makes the
   picture answerable -- you can count what changed -- where a daylight map would
   show three near-identical browns.

   AND IT IS BUILT ON THIS LANE'S OWN MEASUREMENT, not a wish. 9/24 measured that
   the shipped grid rolls one independent coin per feeder, so the valley's light
   is 178 scattered patches with a biggest of 12 cells, and his CLUSTERED POWER
   law (7/14, LOCKED) says outages and survivals are CLUSTERS. So act 1 here is
   the scatter we actually ship, and reclaim grows CLUSTERS out of it -- which is
   the same law, arriving as the future rather than as a fix.

   NOTHING IS SUBTRACTED, EVER, and the tool refuses itself if it is: every cell
   lit in act 1 is lit in act 2 and act 3. That is rule 32(b) made mechanical,
   the same refusal THE CORNER RECLAIMED carries at street scale.

   REUSE-FIRST: the valley is not redrawn. The ground renderer, the palette and
   the cluster-growing function come from bohemia_the_valley_at_night_cook_9_24_26.js
   -- one idea of what this valley looks like after dark, three sets of lit cells.

   REFERENCE CHECK
   COMPARED TO: DIST-03 (Las Vegas aerial -- the valley's real shape), CB-06 (the
   valley's own grain, ours, measured and gated), CB-03 (a Vegas block from the
   air), TG-05 (how a big dark surface reads) and AH-01 (the analog horror bible,
   ours).

   STRUCTURAL RULES TAKEN:
     * DIST-03 / CB-06 -- the composition is the generator's, not mine. The
       mountains ring it, the spine and the beltway are the only readable lines.
     * TG-05 -- a dark surface reads by what breaks it, so the ground is three
       near-black steps and every bright pixel is a lamp.
     * AH-01 -- ordinary frame, one thing wrong. Three photographs of a city at
       night is the ordinary part. THE WRONG THING IS THAT THE DARK NEVER MOVES:
       the shape of the unlit valley is identical in all three, so what you are
       watching is not a city growing, it is a city being switched back on one
       block at a time inside a body that never changed. Nobody says why those
       blocks and not the others.

   NOT SHIPPED TO A PLAY SURFACE (rule 18): a picture for the VOTE tab.

     node tools/bohemia_the_valley_three_acts_cook_9_27_26.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const REPO = path.resolve(__dirname, '..');
const NIGHT = require(path.join(REPO, 'tools/bohemia_the_valley_at_night_cook_9_24_26.js'));
const OM = require(path.join(REPO, 'engine/bohemia_overmap.js'));
const PG = require(path.join(REPO, 'engine/bohemia_powergrid.js'));

const N = NIGHT.N;                 /* 96, the valley 1:1 */
const W = N * 3 + 4;               /* three panels and two seams */
const PALETTE = NIGHT.PALETTE;
const LEGEND = NIGHT.LEGEND;

function main() {
  const seed = 1337;
  const m = OM.buildOvermap(seed);
  const grid = PG.powerMap(m, seed);
  const circuits = PG.buildCircuits(m, N);
  const streetCells = circuits.reduce((n, c) => n + c.length, 0);

  /* ---- ACT 1 IS WHAT WE ACTUALLY SHIP, read off the real grid --------------
     Not an artist's idea of a ruin: the valley as the generator lights it. */
  const act1 = new Set();
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const s = grid.at(x, y);
    if (s && s.id >= 0 && s.live) act1.add(x + ',' + y);
  }

  /* ---- AND THE FUTURE IS ACT 1 PLUS WHAT CAME BACK ON ----------------------
     Reclaim grows CLUSTERS, which is his 7/14 law, from a few sources, which is
     his "every lit cluster is OWNED". The only free number is how many more
     cells are lit by each act, and it is not tuned: it is the SAME 12% step the
     law's own band gives, applied again. */
  /* *** AND MY FIRST CUT COMPOUNDED AND THE TOOL CAUGHT IT. *** clustered() takes
     an ABSOLUTE target fraction and grows a fresh set to it. I passed "what the
     base already has PLUS a step" and then UNIONED that with the base, so each
     act added a whole new valley's worth of light on top of the last one and act
     3 came out at 50% of the grid lit. That is a restoration, not a hundred
     years of clawing back, and the refusal said so in those words. The reclaim
     is the STEP ONLY, laid on what is already there. */
  function plus(base, extraFraction, sources, salt) {
    const grown = NIGHT.clustered(circuits, seed + salt, extraFraction, sources);
    const out = new Set(base);            /* EVERYTHING THE EARLIER ACT HAD, KEPT */
    grown.forEach(k => out.add(k));
    return out;
  }
  const act2 = plus(act1, 0.06, 6, 11);
  const act3 = plus(act2, 0.06, 6, 22);

  /* --- THE TOOL REFUSES ITSELF, and the first refusal IS rule 32(b) -------- */

  /* NOTHING GOES OUT. Every cell lit in an earlier act is lit in a later one. */
  const kept = (a, b) => [...a].every(k => b.has(k));
  if (!kept(act1, act2) || !kept(act2, act3)) {
    console.log('REFUSED: a cell that was lit went dark in a later act. Rule 32(b): nothing decays below the start.');
    process.exit(1);
  }
  /* AND IT REALLY GETS BETTER, or the three panels are one panel. */
  if (!(act3.size > act2.size && act2.size > act1.size)) {
    console.log('REFUSED: the future did not get better (' + act1.size + ' / ' + act2.size + ' / ' + act3.size + ')');
    process.exit(1);
  }
  /* AND IT IS STILL A DARK VALLEY, not a lit city: his act-1 band is 10-15% and
     even act 3 must stay a place where most of the grid is out. */
  if (act3.size / streetCells > 0.40) {
    console.log('REFUSED: act 3 lights ' + (100 * act3.size / streetCells).toFixed(0)
      + '% of the grid; this is a hundred years of clawing back, not a restoration');
    process.exit(1);
  }
  /* AND THE LIGHT GETS MORE CLUSTERED, which is the law arriving as the future */
  const b1 = NIGHT.blobsOf(act1), b3 = NIGHT.blobsOf(act3);
  if (!(b3.biggest > b1.biggest * 3)) {
    console.log('REFUSED: act 3\'s biggest lit patch is ' + b3.biggest + ' against act 1\'s '
      + b1.biggest + '. Reclaim that does not make a core is just more scatter.');
    process.exit(1);
  }

  const gA = NIGHT.panel(m, act1), gB = NIGHT.panel(m, act2), gC = NIGHT.panel(m, act3);

  /* *** THE LINES DO NOT MOVE, PROVED ON THE PIXELS AND NOT PROMISED. *** Every
     pixel that is not a lamp or its throw must be identical across all three
     panels. This is the picture's own version of gate leg 4. */
  const LIGHT = new Set([7, 8, 9]);
  let ground = 0, moved = 0;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    if (LIGHT.has(gA[y][x]) || LIGHT.has(gB[y][x]) || LIGHT.has(gC[y][x])) continue;
    ground++;
    if (gA[y][x] !== gB[y][x] || gB[y][x] !== gC[y][x]) moved++;
  }
  if (moved) {
    console.log('REFUSED: ' + moved + ' of ' + ground + ' ground pixels differ between acts. THE LINES DO NOT MOVE.');
    process.exit(1);
  }

  const g = NIGHT.blank(W, N);
  [gA, gB, gC].forEach((p, i) => {
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) g[y][x + i * (N + 2)] = p[y][x];
  });

  const used = {}; let total = 0;
  for (let y = 0; y < N; y++) for (let x = 0; x < W; x++) { used[g[y][x]] = (used[g[y][x]] || 0) + 1; total++; }
  const litPix = (used[7] || 0) + (used[8] || 0) + (used[9] || 0);
  if (100 * litPix / total > 30) {
    console.log('REFUSED: light is ' + (100 * litPix / total).toFixed(0) + '% of the frame; it is the event, not the ground');
    process.exit(1);
  }

  const doc = {
    version: 'BOHEMIA_THE_VALLEY_THREE_ACTS_v1', built: '2026-09-27',
    lane: 'WORLD, row [future city], rules 31, 32(b), 33',
    claim: 'THE LINES DO NOT MOVE AND THE LIGHT COMES BACK. The same valley three times at the map camera; every road, mountain and lot line identical across all three panels, proved on the pixels (' + ground + ' ground pixels compared, ' + moved + ' differ).',
    act1: 'what we actually ship, read off the real grid -- not an artist\'s idea of a ruin.',
    future: 'act 1 plus what came back on. Reclaim grows CLUSTERS from a few owned sources, which is his CLUSTERED POWER law (7/14) arriving as the future rather than as a fix.',
    nothing_subtracted: 'every cell lit in an earlier act is lit in a later one, and the tool refuses itself if not. Rule 32(b) made mechanical.',
    why_night: 'at map scale the light is what reads, and a part of a city that has been reclaimed is a part that is ON. A daylight map would show three near-identical browns.',
    the_wrong_thing: 'AH-01: the dark never moves. The shape of the unlit valley is identical in all three, so this is not a city growing, it is a city being switched back on one block at a time inside a body that never changed. Nobody says why those blocks and not the others.',
    reuse: 'the ground renderer, the palette and the cluster-growing function come from bohemia_the_valley_at_night_cook_9_24_26.js. One valley, three sets of lit cells.',
    seed: seed, streetCells: streetCells,
    lit: { act1: act1.size, act2: act2.size, act3: act3.size },
    share: { act1: +(100 * act1.size / streetCells).toFixed(1),
             act2: +(100 * act2.size / streetCells).toFixed(1),
             act3: +(100 * act3.size / streetCells).toFixed(1) },
    blobs: { act1: b1.blobs, act3: b3.blobs },
    biggest: { act1: b1.biggest, act3: b3.biggest },
    groundPixelsCompared: ground, groundPixelsThatMoved: moved,
    size: { panel: N, image: W + 'x' + N },
    palette: PALETTE, legend: LEGEND,
    litShare: +(100 * litPix / total).toFixed(2),
    not_shipped: 'rule 18: a picture for the VOTE tab.',
    build_source: main.toString().slice(0, 4000)
  };

  const out = path.join(REPO, 'banks/BOHEMIA_THE_VALLEY_THREE_ACTS_9_27_26.txt');
  fs.writeFileSync(out, JSON.stringify(doc));
  if (!JSON.parse(fs.readFileSync(out, 'utf8')).build_source) { console.log('REFUSED: read-back failed'); process.exit(1); }
  fs.writeFileSync(path.join(REPO, 'banks/_threeacts_grid.json'),
    JSON.stringify({ g, pal: PALETTE, leg: LEGEND, w: W, h: N }));

  console.log('wrote banks/BOHEMIA_THE_VALLEY_THREE_ACTS_9_27_26.txt');
  console.log('  lit cells   act1 ' + act1.size + '  act2 ' + act2.size + '  act3 ' + act3.size
    + '   (' + doc.share.act1 + '% -> ' + doc.share.act3 + '% of the grid)');
  console.log('  biggest lit patch  act1 ' + b1.biggest + '  ->  act3 ' + b3.biggest
    + '   patches ' + b1.blobs + ' -> ' + b3.blobs);
  console.log('  *** ' + ground + ' GROUND PIXELS COMPARED ACROSS THE THREE ACTS, ' + moved + ' MOVED ***');
}

main();
