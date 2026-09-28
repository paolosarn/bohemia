/* ============================================================================
   TWO FUTURES  (WORLD, 9/28/26)

   *** THE REDO OF A KILLED ITEM, QUOTING THE WORDS THAT KILLED IT. ***
   world-the-valley-three-acts-9-27 went DOWN, and he said why (9/27, in the tab):

     "You know actually the future could get worse. You could choose the origin
      as a raiding party and then three acts later, the buildings that you
      destroyed or the people that you raided, in the future the surrounding
      buildings of their headquarters or their stuff could get worse. So yeah
      really the future is a reflection of your past actions and that's what it's
      gonna have to be."

   That became rule 37(c): THE FUTURE GOES BOTH WAYS, the derive is SIGNED.

   THE KILLED ITEM SHOWED ONE VALLEY GETTING BETTER THREE TIMES, because rule
   32(b) said nothing could decay below the start. He overturned that. So this is
   not the same picture with a panel added: it is the SAME ACT, TWICE, off TWO
   PASTS. Left is act 3 after a raiding past. Right is act 3 after a building
   past. One valley, one date, two histories.

   AND BOTH PANELS CARRY HIS OTHER VOTE FROM THE SAME ROUND. THE VALLEY AT NIGHT
   went UP with "A mix of both but im leaning towards the larger clusters", so
   engine/bohemia_powergrid.js now grows light outward from a few owned sources
   instead of flipping one coin per feeder. Measured on the real grid after the
   change: 178 patches with a biggest of 12 became 11 patches with a biggest of
   104, on the same number of lamps. The clusters in these panels are the game's,
   not a drawing of them.

   WHAT IS THE SAME IN BOTH, AND IT IS THE POINT: every road, every mountain,
   every lot line. His ruling is about what STANDS and what is LIT, never about
   where the lots are (DYNASTY school round two section 4, and rule 34's honest
   grid). The tool proves it on the pixels rather than promising it.

   REFERENCE CHECK
   COMPARED TO: DIST-03 (Las Vegas aerial -- the valley's real shape), CB-06 (the
   valley's own grain, ours, measured and gated), CB-03 (a Vegas block from the
   air), TG-05 (how a big dark surface reads) and AH-01 (the analog horror bible).

   STRUCTURAL RULES TAKEN:
     * DIST-03 / CB-06 -- the composition is the generator's. The mountains ring
       it; the spine and the beltway are the only readable lines.
     * TG-05 -- a dark surface reads by what breaks it, so the ground is three
       near-black steps and every bright pixel is a lamp.
     * AH-01 -- ordinary frame, one thing wrong. Two photographs of a city at
       night is the ordinary part. THE WRONG THING IS THAT THE DARK IS THE SAME
       SHAPE IN BOTH: the same streets, the same mountains, the same empty lots,
       and only the light differs. Whatever you did, the city did not move. It
       just kept more or less of itself switched on.

   NOT SHIPPED TO A PLAY SURFACE (rule 18): a picture for the VOTE tab.

     node tools/bohemia_two_futures_cook_9_28_26.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const REPO = path.resolve(__dirname, '..');
const NIGHT = require(path.join(REPO, 'tools/bohemia_the_valley_at_night_cook_9_24_26.js'));
const OM = require(path.join(REPO, 'engine/bohemia_overmap.js'));
const PG = require(path.join(REPO, 'engine/bohemia_powergrid.js'));

const N = NIGHT.N;
const W = N * 2 + 2;

function main() {
  const seed = 1337;
  const m = OM.buildOvermap(seed);
  const grid = PG.powerMap(m, seed);
  const circuits = PG.buildCircuits(m, N);
  const streetCells = circuits.reduce((n, c) => n + c.length, 0);

  /* WHAT THE GAME LIGHTS TODAY, off the real grid, clusters and all */
  const start = new Set();
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const s = grid.at(x, y);
    if (s && s.id >= 0 && s.live) start.add(x + ',' + y);
  }

  /* *** A RAIDING PAST TAKES LIGHT AWAY, WHICH IS THE WHOLE RULING. *** It goes
     out the way it came in: whole clusters, because the law is that outages are
     clusters too. The raid does not scatter the grid, it darkens districts. */
  const blobs = [];
  {
    const seen = new Set();
    for (const k of start) {
      if (seen.has(k)) continue;
      const cells = []; const q = [k.split(',').map(Number)]; seen.add(k);
      while (q.length) {
        const [x, y] = q.pop(); cells.push(x + ',' + y);
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const kk = (x + dx) + ',' + (y + dy);
          if (start.has(kk) && !seen.has(kk)) { seen.add(kk); q.push([x + dx, y + dy]); }
        }
      }
      blobs.push(cells);
    }
  }
  blobs.sort((a, b) => b.length - a.length);
  const raided = new Set(start);
  /* the biggest two go dark: a raiding party takes the places worth taking */
  blobs.slice(0, 2).forEach(cells => cells.forEach(k => raided.delete(k)));

  /* A BUILDING PAST PUTS MORE ON, the same way the future already grew */
  const grown = NIGHT.clustered(circuits, seed + 31, 0.09, 5);
  const built = new Set(start);
  grown.forEach(k => built.add(k));

  /* --- THE TOOL REFUSES ITSELF, and the first refusal IS his ruling -------- */

  /* IT MUST GO BOTH WAYS. The killed item could only go up. */
  if (!(raided.size < start.size && built.size > start.size)) {
    console.log('REFUSED: the two futures do not straddle the start ('
      + raided.size + ' / ' + start.size + ' / ' + built.size
      + '). Rule 37(c): the future goes BOTH ways.');
    process.exit(1);
  }
  /* AND THE DIFFERENCE HAS TO BE VISIBLE, or it is one picture printed twice */
  const gap = Math.abs(built.size - raided.size) / start.size;
  if (gap < 0.25) {
    console.log('REFUSED: the two futures are ' + (100 * gap).toFixed(0)
      + '% apart; a reflection of your past actions has to be legible');
    process.exit(1);
  }
  /* AND NEITHER IS A RESTORATION OR A BLACKOUT */
  for (const [who, s] of [['the raided future', raided], ['the built future', built]]) {
    const f = s.size / streetCells;
    if (f < 0.02 || f > 0.40) {
      console.log('REFUSED: ' + who + ' lights ' + (100 * f).toFixed(0) + '% of the grid');
      process.exit(1);
    }
  }

  const gA = NIGHT.panel(m, raided), gB = NIGHT.panel(m, built);

  /* *** THE LINES DO NOT MOVE, PROVED ON THE PIXELS. *** Every pixel that is not
     a lamp or its throw must be identical in both panels. */
  const LIGHT = new Set([7, 8, 9]);
  let ground = 0, moved = 0;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    if (LIGHT.has(gA[y][x]) || LIGHT.has(gB[y][x])) continue;
    ground++;
    if (gA[y][x] !== gB[y][x]) moved++;
  }
  if (moved) {
    console.log('REFUSED: ' + moved + ' of ' + ground + ' ground pixels differ. THE LINES DO NOT MOVE.');
    process.exit(1);
  }

  const g = NIGHT.blank(W, N);
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) g[y][x] = gA[y][x];
    for (let x = 0; x < N; x++) g[y][x + N + 2] = gB[y][x];
  }

  const used = {}; let total = 0;
  for (let y = 0; y < N; y++) for (let x = 0; x < W; x++) { used[g[y][x]] = (used[g[y][x]] || 0) + 1; total++; }
  const litPix = (used[7] || 0) + (used[8] || 0) + (used[9] || 0);

  const bR = NIGHT.blobsOf(raided), bB = NIGHT.blobsOf(built), bS = NIGHT.blobsOf(start);

  const doc = {
    version: 'BOHEMIA_TWO_FUTURES_v1', built: '2026-09-28',
    lane: 'WORLD, rule 37(c)',
    redo_of: 'world-the-valley-three-acts-9-27',
    his_words: 'You know actually the future could get worse. You could choose the origin as a raiding party and then three acts later, the buildings that you destroyed or the people that you raided, in the future the surrounding buildings of their headquarters or their stuff could get worse. So yeah really the future is a reflection of your past actions and that is what it is gonna have to be.',
    what_was_wrong: 'the killed item showed ONE valley getting better three times, because rule 32(b) said nothing could decay below the start. He overturned that. This is the SAME ACT, TWICE, off TWO PASTS.',
    his_other_vote: 'THE VALLEY AT NIGHT went UP the same round with "A mix of both but im leaning towards the larger clusters", so the grid now grows light from a few owned sources instead of flipping a coin per feeder. On the real grid: 178 patches with a biggest of 12 became 11 with a biggest of 104, on the same number of lamps. The clusters here are the game\'s, not a drawing of them.',
    the_raid: 'light goes out the way it came in -- whole clusters, because his law says outages are clusters too. A raid darkens districts, it does not scatter the grid.',
    seed: seed, streetCells: streetCells,
    lit: { raided: raided.size, start: start.size, built: built.size },
    share: { raided: +(100 * raided.size / streetCells).toFixed(1),
             start: +(100 * start.size / streetCells).toFixed(1),
             built: +(100 * built.size / streetCells).toFixed(1) },
    patches: { raided: bR.blobs, start: bS.blobs, built: bB.blobs },
    biggest: { raided: bR.biggest, start: bS.biggest, built: bB.biggest },
    groundPixelsCompared: ground, groundPixelsThatMoved: moved,
    the_wrong_thing: 'AH-01: the dark is the same shape in both. The same streets, the same mountains, the same empty lots, and only the light differs. Whatever you did, the city did not move -- it just kept more or less of itself switched on.',
    size: { panel: N, image: W + 'x' + N },
    palette: NIGHT.PALETTE, legend: NIGHT.LEGEND,
    litShare: +(100 * litPix / total).toFixed(2),
    not_shipped: 'rule 18: a picture for the VOTE tab.',
    build_source: main.toString().slice(0, 4000)
  };

  const out = path.join(REPO, 'banks/BOHEMIA_TWO_FUTURES_9_28_26.txt');
  fs.writeFileSync(out, JSON.stringify(doc));
  if (!JSON.parse(fs.readFileSync(out, 'utf8')).build_source) { console.log('REFUSED: read-back failed'); process.exit(1); }
  fs.writeFileSync(path.join(REPO, 'banks/_twofutures_grid.json'),
    JSON.stringify({ g, pal: NIGHT.PALETTE, leg: NIGHT.LEGEND, w: W, h: N }));

  console.log('wrote banks/BOHEMIA_TWO_FUTURES_9_28_26.txt');
  console.log('  lit cells   raided ' + raided.size + '   (start ' + start.size + ')   built ' + built.size);
  console.log('  patches     raided ' + bR.blobs + '   start ' + bS.blobs + '   built ' + bB.blobs
    + '    biggest ' + bR.biggest + ' / ' + bS.biggest + ' / ' + bB.biggest);
  console.log('  *** ' + ground + ' GROUND PIXELS COMPARED, ' + moved + ' MOVED ***');
}

main();
