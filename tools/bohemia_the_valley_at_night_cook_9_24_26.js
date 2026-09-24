/* ============================================================================
   THE VALLEY AT NIGHT  (WORLD, 9/24/26, rule 31's floor)

   RULE 29 (Paolo 9/21): a WORLD cook is a THING DRAWN. This one draws the whole
   valley after dark, from the real generator and the real power grid, because
   the finding IS a picture and no number says it as fast.

   *** THE FINDING. *** THE CLUSTERED POWER LAW (Paolo 7/14, LOCKED, "I like the
   answers") says, in its own words: "outages/survivals are CLUSTERS, never
   alternating", 10-15% of lamps lit, "all in clusters", "every lit cluster is
   OWNED". The shipped grid rolls ONE INDEPENDENT COIN PER FEEDER --
   `const live = r() < litFraction` -- which is the definition of alternating.

   MEASURED ON THE REAL VALLEY, three seeds, and the clustering the grid does
   have is only the feeder's own length (a run is sliced into sixes, so six cells
   light together and that is all):

       seed 1337   432 lit cells in 178 SEPARATE BLOBS, biggest 12 cells
       seed    7   391 lit cells in 158 SEPARATE BLOBS, biggest 13 cells
       seed   42   422 lit cells in 154 SEPARATE BLOBS, biggest 14 cells

   The biggest lit thing in Las Vegas is TWELVE CELLS. Share-of-neighbours-lit
   decays from 35% at r=1 to 15% at r=6, which is the global fraction: past one
   feeder the light is statistically indistinguishable from scatter.

   *** AND IT BLOCKS RULE 31. *** DYNASTY's school round one closed the
   do-nothing-future hole with Detroit and PLANNED SHRINKAGE: "the power pulled
   back to the corridors that still pay, a small live core", and said every part
   of it "is a thing our engine already draws: CLUSTERED POWER is already the law
   that decides which corridors are lit". The law is; the code is not. THERE IS
   NO CORE TO PULL BACK TO. Pulling a uniform scatter back leaves a thinner
   uniform scatter, so the floor the law needs cannot be drawn today.

   THE RIGHT PANEL IS HIS LAW, BUILT AND MEASURED, NOT AN ARTIST'S IMPRESSION:
   light spreads from a source along the wire (what a live substation does)
   through touching feeders until the valley reaches the law's own 12%. The only
   free number is how many sources, and it is derived, not tuned: one per faction
   that holds ground, which is the law's own "every lit cluster is OWNED".

       SAME LIGHT, SAME 12%:   as we ship it   178 blobs, biggest 12
                               as his law says  11 blobs, biggest 104

   Sixteen times fewer pieces, nine times bigger core, not one extra lamp.

   MAP LAW IS NOT IN THE WAY: nothing here designs a layout. The map, the
   streets and the feeders are the generator's, untouched; this is which of them
   are lit, and his locked law already ruled that.

   REFERENCE CHECK
   COMPARED TO: DIST-03 (Las Vegas aerial -- the valley's real shape and grain),
   CB-03 (a Vegas block from the air), CB-06 (the valley's own grain, ours,
   measured and gated), TG-05 (how a big flat surface reads) and AH-01 (the
   analog horror bible, ours).

   STRUCTURAL RULES TAKEN:
     * DIST-03 / CB-06 -- the valley's real shape does the composition: the
       mountains ring it, the wash cuts it, the freeway spine and the beltway
       ring are the only man-made lines readable from this height. Nothing is
       arranged; the generator put it there.
     * TG-05 -- a dark surface reads by what BREAKS it. At this height the whole
       frame is one value and the light is the only event, so the ground is held
       to three near-black steps and every bright pixel is a lamp.
     * AH-01 -- ordinary frame, one thing wrong, and the camera does not help.
       The ordinary part is a city at night from above, the most familiar
       photograph there is. The wrong thing is that THE LIGHT IS IN THE WRONG
       SHAPE FOR A CITY: on the left it is a rash, evenly spread over a valley
       with nobody in most of it. His own law already names the horror image the
       right panel makes possible -- "NETWORK territory kept eerily, perfectly
       lit, the Amalgamation's glowing empty streets".

   NOT SHIPPED TO A PLAY SURFACE (rule 18): the fix is one line inside the grid's
   live roll and the grid is inlined into what he plays. Measured, drawn, and
   the change named exactly.

     node tools/bohemia_the_valley_at_night_cook_9_24_26.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const REPO = path.resolve(__dirname, '..');
const OM = require(path.join(REPO, 'engine/bohemia_overmap.js'));
const PG = require(path.join(REPO, 'engine/bohemia_powergrid.js'));

const N = 96;              /* the valley is 96 x 96 cells and the panel is 1:1 */
const W = N * 2 + 2;       /* two panels and a seam */

const PALETTE = {
  0:  '#00000000',
  1:  '#12120f',   /* the valley floor after dark */
  2:  '#191813',   /* built ground, one step up because a roof is not dirt */
  3:  '#070706',   /* the mountains that ring it, the darkest thing in frame */
  4:  '#101418',   /* water, and it is cold not black */
  5:  '#1f1e18',   /* the freeway spine and the beltway ring, the only lines */
  6:  '#2a281f',   /* the wash, which the valley drains into */
  7:  '#c9bc86',   /* A LAMP. sodium, because that is what was on these poles */
  8:  '#8e8352',   /* the throw of a lamp onto the ground beside it */
  9:  '#4a442c',   /* the far edge of that throw (now unused at this height) */
  10: '#232019',   /* a dead street. BARELY readable on purpose: the first
                      cut had the grid at #3a3627 and the whole frame read as
                      graph paper, so the light stopped being the event (TG-05). */
};

const LEGEND = {
  1:  { name: 'valley floor',        kind: 'ground' },
  2:  { name: 'built ground',        kind: 'ground' },
  3:  { name: 'mountain',            kind: 'ground' },
  4:  { name: 'water',               kind: 'ground' },
  5:  { name: 'freeway and beltway', kind: 'road' },
  6:  { name: 'the wash',            kind: 'ground' },
  7:  { name: 'a lit lamp',          kind: 'light' },
  8:  { name: 'the throw of a lamp', kind: 'light' },
  9:  { name: 'the far throw',       kind: 'light' },
  10: { name: 'a dead street',       kind: 'road' },
};

/* which generator districts are which kind of ground, by name, so the drawing
   cannot drift from what the map actually says */
const MOUNTAIN = new Set(['mountain', 'gypsum', 'quarry']);
const WATER    = new Set(['water', 'reservoir', 'basin', 'intake', 'dam', 'springs']);
const WASH     = new Set(['wash', 'desert', 'landfill', 'boneyard']);
const BIGROAD  = new Set(['freeway', 'beltway', 'interchange', 'rail', 'railyard']);
const STREET   = new Set(['arterial', 'street', 'strip', 'downtown', 'residential_street']);

function blank(w, h) { const g = []; for (let y = 0; y < h; y++) g.push(new Array(w).fill(0)); return g; }
function rnd(seed) { let s = seed >>> 0 || 1;
  return () => { s = (s * 1103515245 + 12345) >>> 0; return s / 4294967296; }; }

/* ---------------------------------------------------------------------------
   THE LAW, BUILT. Light spreads from a source along the wire through TOUCHING
   feeders until the valley reaches the law's own lit fraction. The sources are
   the factions that hold ground, because the law says every lit cluster is
   OWNED; nothing else here is a number anybody chose.
   --------------------------------------------------------------------------- */
function clustered(circuits, seed, target, sources) {
  const r = rnd((seed ^ 0x5EED) >>> 0);
  const cellOf = {};
  circuits.forEach((c, i) => c.forEach(([x, y]) => { cellOf[x + ',' + y] = i; }));
  const adj = circuits.map(() => new Set());
  circuits.forEach((c, i) => c.forEach(([x, y]) => {
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const j = cellOf[(x + dx) + ',' + (y + dy)];
      if (j != null && j !== i) { adj[i].add(j); adj[j].add(i); }
    }
  }));
  const cells = circuits.reduce((n, c) => n + c.length, 0);
  const want = Math.round(cells * target);
  const live = new Set(); let got = 0; const front = [];
  for (let k = 0; k < sources; k++) {
    const s = (r() * circuits.length) | 0;
    if (live.has(s)) continue;
    live.add(s); got += circuits[s].length; front.push(s);
  }
  let guard = 0;
  while (got < want && front.length && guard++ < 100000) {
    const i = front[(r() * front.length) | 0];
    const nb = [...adj[i]].filter(j => !live.has(j));
    if (!nb.length) { front.splice(front.indexOf(i), 1); continue; }
    const j = nb[(r() * nb.length) | 0];
    live.add(j); got += circuits[j].length; front.push(j);
  }
  const out = new Set();
  live.forEach(i => circuits[i].forEach(([x, y]) => out.add(x + ',' + y)));
  return out;
}

/* how many separate pieces is the light in, and how big is the biggest */
function blobsOf(litSet) {
  const seen = new Set(); let blobs = 0; const sizes = [];
  for (const k0 of litSet) {
    if (seen.has(k0)) continue;
    let n = 0; const q = [k0.split(',').map(Number)]; seen.add(k0);
    while (q.length) {
      const [x, y] = q.pop(); n++;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const k = (x + dx) + ',' + (y + dy);
        if (litSet.has(k) && !seen.has(k)) { seen.add(k); q.push([x + dx, y + dy]); }
      }
    }
    blobs++; sizes.push(n);
  }
  sizes.sort((a, b) => b - a);
  return { blobs, biggest: sizes[0] || 0, top5: sizes.slice(0, 5) };
}

/* ---------------------------------------------------------------------------
   ONE PANEL: the valley, from the real map, with a given set of lit cells.
   --------------------------------------------------------------------------- */
function panel(m, litSet) {
  const g = blank(N, N);
  const set = (x, y, c) => { if (x >= 0 && y >= 0 && x < N && y < N) g[y][x] = c; };

  /* THE GROUND, straight off the generator. Three near-black steps and nothing
     else, because at this height the light has to be the only event (TG-05). */
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const d = m.at(x, y).district;
    if (MOUNTAIN.has(d)) set(x, y, 3);
    else if (WATER.has(d)) set(x, y, 4);
    else if (WASH.has(d)) set(x, y, 6);
    else if (BIGROAD.has(d)) set(x, y, 5);
    else if (STREET.has(d)) set(x, y, 10);
    else set(x, y, 2);
  }
  /* the open floor between the built parts, so the city has an edge */
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const d = m.at(x, y).district;
    if (d === 'desert') set(x, y, 1);
  }

  /* THE THROW FIRST, THEN THE LAMP, so a lamp is never painted over by its own
     light. PROP-02 in spirit: a streetlight from above is a small bright point
     inside a soft round pool, not a bright square. */
  /* *** THE FIRST CUT'S POOLS WERE TWO CELLS WIDE AND IT BROKE THE ARGUMENT. ***
     178 separate lamps each carrying a two-cell halo lay down far more glowing
     pixels than 11 clusters do, so the left panel LOOKED brighter than the right
     while carrying seven fewer lamps -- and SAME LIGHT, DIFFERENT SHAPE is the
     entire claim of this picture. A tight pool is also the truer drawing: a
     street lamp from a hundred metres up is a point, not a bloom. */
  litSet.forEach(k => {
    const [x, y] = k.split(',').map(Number);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const cur = g[y + dy] && g[y + dy][x + dx];
      if (cur == null || cur === 0 || cur === 7 || cur === 8) continue;
      set(x + dx, y + dy, 8);
    }
  });
  litSet.forEach(k => { const [x, y] = k.split(',').map(Number); set(x, y, 7); });

  return g;
}

function main() {
  const seed = 1337;
  const m = OM.buildOvermap(seed);
  const P = PG.powerMap(m, seed);
  const circuits = PG.buildCircuits(m, N);

  /* AS WE SHIP IT, read off the real grid rather than re-rolled here */
  const ship = new Set();
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const s = P.at(x, y);
    if (s && s.id >= 0 && s.live) ship.add(x + ',' + y);
  }
  /* AS HIS LAW SAYS. 14 sources: the factions that hold ground. */
  const law = clustered(circuits, seed, 0.12, 14);

  const a = blobsOf(ship), b = blobsOf(law);
  const streetCells = circuits.reduce((n, c) => n + c.length, 0);

  console.log('    as we ship it : ' + ship.size + ' lit of ' + streetCells + ' street cells ('
    + (100 * ship.size / streetCells).toFixed(1) + '%), ' + a.blobs + ' blobs, biggest ' + a.biggest);
  console.log('    as his law says: ' + law.size + ' lit of ' + streetCells + ' street cells ('
    + (100 * law.size / streetCells).toFixed(1) + '%), ' + b.blobs + ' blobs, biggest ' + b.biggest);

  /* --- THE TOOL REFUSES ITSELF, and every refusal is a real claim ---------- */

  /* 1. SAME LIGHT. If the right panel is simply brighter it proves nothing, and
        that is the easy lie this whole picture could have been. */
  const drift = Math.abs(law.size - ship.size) / ship.size;
  if (drift > 0.10) {
    console.log('REFUSED: the two panels differ by ' + (100 * drift).toFixed(0)
      + '% of light. The claim is SAME LIGHT, DIFFERENT SHAPE, or it is worth nothing.');
    process.exit(1);
  }
  /* 2. and both inside the law's own 10-15% band */
  for (const [who, n] of [['ours', ship.size], ['his law', law.size]]) {
    const f = n / streetCells;
    if (f < 0.09 || f > 0.16) {
      console.log('REFUSED: ' + who + ' is ' + (100 * f).toFixed(1) + '% lit, outside the law\'s 10-15 band');
      process.exit(1);
    }
  }
  /* 3. THE FINDING ITSELF. If the shipped grid ever starts making a core this
        picture is out of date and must not keep being shown. */
  if (a.blobs < 60 || a.biggest > 40) {
    console.log('REFUSED: the shipped grid now makes ' + a.blobs + ' blobs with a biggest of '
      + a.biggest + '. Somebody fixed it -- re-measure before drawing this again.');
    process.exit(1);
  }
  /* 4. and the law's version really is a core */
  if (b.blobs > 40 || b.biggest < 60) {
    console.log('REFUSED: the clustered build made ' + b.blobs + ' blobs, biggest '
      + b.biggest + '; that is not a core and the right panel would be a lie');
    process.exit(1);
  }

  const gA = panel(m, ship), gB = panel(m, law);
  const g = blank(W, N);
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) g[y][x] = gA[y][x];
    for (let x = 0; x < N; x++) g[y][x + N + 2] = gB[y][x];
  }

  const used = {}; let total = 0;
  for (let y = 0; y < N; y++) for (let x = 0; x < W; x++) { used[g[y][x]] = (used[g[y][x]] || 0) + 1; total++; }
  const litPix = (used[7] || 0) + (used[8] || 0) + (used[9] || 0);
  /* 5. TG-05: at this height the light is the EVENT. If it covers the frame the
        picture is a map of lamps, not a city at night. */
  if (100 * litPix / total > 30) {
    console.log('REFUSED: light is ' + (100 * litPix / total).toFixed(0) + '% of the frame; it is meant to be the event, not the ground');
    process.exit(1);
  }

  const doc = {
    version: 'BOHEMIA_THE_VALLEY_AT_NIGHT_v1', built: '2026-09-24',
    lane: 'WORLD, rule 31\'s floor and the CLUSTERED POWER law',
    law: 'CLUSTERED POWER (Paolo 7/14, LOCKED, "I like the answers"): "outages/survivals are CLUSTERS, never alternating", 10-15% of lamps, all in clusters, every lit cluster OWNED.',
    finding: 'the shipped grid rolls one independent coin per feeder (`const live = r() < litFraction`), which is the definition of alternating. The only clustering it has is the feeder\'s own length, because a run is sliced into sixes.',
    why_it_matters: 'DYNASTY school round one closed rule 31\'s do-nothing-future hole with Detroit and PLANNED SHRINKAGE -- "the power pulled back to the corridors that still pay, a small live core" -- and said CLUSTERED POWER already decides which corridors are lit. The law does; the code does not. THERE IS NO CORE TO PULL BACK TO.',
    seed: seed,
    streetCells: streetCells,
    shipped: { lit: ship.size, blobs: a.blobs, biggest: a.biggest, top5: a.top5 },
    hisLaw:  { lit: law.size,  blobs: b.blobs, biggest: b.biggest, top5: b.top5 },
    same_light: 'the two panels are within ' + (100 * drift).toFixed(1) + '% of each other on lit cells, which is the point: same light, different shape, not one extra lamp.',
    the_change: 'one place: the `live` roll in engine/bohemia_powergrid.js powerMap(). Spread from a source along touching feeders to the same fraction instead of rolling each feeder alone. The source count is derived (one per faction that holds ground, the law\'s own "every lit cluster is OWNED"), not tuned.',
    map_law: 'nothing here designs a layout. The map, the streets and the feeders are the generator\'s and untouched; this is WHICH of them are lit, which his locked law already ruled.',
    size: { panel: N, image: W + 'x' + N },
    palette: PALETTE, legend: LEGEND,
    coverage: Object.fromEntries(Object.keys(used).filter(k => LEGEND[k])
      .map(k => [LEGEND[k].name, +(100 * used[k] / total).toFixed(2)])),
    litShare: +(100 * litPix / total).toFixed(2),
    not_shipped: 'rule 18: the grid is inlined into what he plays. Measured, drawn, and the change named exactly.',
    build_source: clustered.toString()
  };

  const out = path.join(REPO, 'banks/BOHEMIA_THE_VALLEY_AT_NIGHT_9_24_26.txt');
  fs.writeFileSync(out, JSON.stringify(doc));
  const back = JSON.parse(fs.readFileSync(out, 'utf8'));
  if (!back.build_source || Object.keys(back.legend).length !== Object.keys(LEGEND).length) {
    console.log('REFUSED: read-back failed'); process.exit(1);
  }
  fs.writeFileSync(path.join(REPO, 'banks/_night_grid.json'),
    JSON.stringify({ g, pal: PALETTE, leg: LEGEND, w: W, h: N }));

  console.log('wrote banks/BOHEMIA_THE_VALLEY_AT_NIGHT_9_24_26.txt ('
    + (fs.statSync(out).size / 1024).toFixed(0) + ' KB)');
  console.log('  *** SAME LIGHT, ' + a.blobs + ' PIECES AGAINST ' + b.blobs
    + ', BIGGEST ' + a.biggest + ' AGAINST ' + b.biggest + ' ***');
}

main();
