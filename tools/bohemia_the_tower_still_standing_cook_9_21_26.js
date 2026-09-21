/* ============================================================================
   THE TOWER THAT IS STILL STANDING  (COOK, 9/21/26, [fortress buildings] round 4)

   THE FIGHT VERDICT round 4 passed this lane's edge fix and says, in its own words,
   "nothing new for COOK on the fight this round" -- the three lies left on that list are
   COMBAT's and UI's. Rule 22 says a making lane cooks anyway, so this round goes to this
   lane's own top open row.

   [seven landmarks] / [fortress buildings]: the overmap names seven singular Las Vegas
   landmarks and nothing can build six of them. A player walking to any one finds bare
   ground. Round 3 drew the Welcome sign, 7 -> 6. This is the STRATOSPHERE, and it is next
   for a reason: it is the tallest thing in the valley and the thing you orient by from
   anywhere in it, so it is the one whose absence is felt furthest away.

   MEASURED OFF A GENERATED MAP BEFORE A LINE WAS DRAWN (MAP LAW: Claude never designs the
   map; the plot fronts the roads the map already gave it). `strat` sits at 53,28 and its
   3x3 reads:

        arterial   arterial   arterial
        downtown   STRAT      arterial
        strip      resort     resort

   Arterial along the WHOLE north edge and the east edge, downtown west, the Strip
   south-west, resort south and south-east. That is exactly where the real one is: the
   north end of the Strip where the boulevard meets Sahara, with downtown behind it. So
   this plot fronts north and east, and STREET-AWARE / DRIVABLE ACCESS LAW is served off
   the arterial it already has.

   A CELL IS 96 METRES AND 128 VALLEY TILES, so one tile is 0.75 m (measured from
   engine/bohemia_overmap.js: TILE_M 96, TILE_FINE 128, CELL_M 0.75). The real podium is
   bigger than one cell, so what goes in the cell is the TOWER and its own apron -- the
   same call round 3 made for the sign. The rest of the resort is the resort cells south.

   REFERENCE CHECK
   COMPARED TO: DIST-02 and CB-07 (Learning From Las Vegas, both halves), BLDG-04 (the
   Strip's three races: pool, sign, porte-cochere), DIST-03 (Las Vegas aerial), TG-05 (the
   commercial lot tile), BLDG-05 (the structural sanity list) and AH-01 (the analog horror
   bible). The real subject: the Stratosphere Tower, 1996, 350 m, a tapering concrete shaft
   on a three-legged base with an observation pod near the top, standing on a low casino
   podium with a large surface car park.

   STRUCTURAL RULES TAKEN:
     * DIST-02 / CB-07 -- a Strip plot is SIGN + SHED + PARKING IN FRONT and the sign is
       taller than the building. This is the most extreme case that idea has: the sign is
       350 m and the shed is three storeys. So the plan reads TOWER FIRST and the podium is
       deliberately low and plain.
     * BLDG-04 -- a resort is read by its pool, its sign and its PORTE-COCHERE. The pool is
       on the podium roof where a top-down view can actually see it, and the porte-cochere
       is on the arterial side, because that is the one piece of a casino that must touch
       the road.
     * TG-05 -- a lot is striped asphalt with seal patches, not a grey rectangle. The car
       park is marked in bays.
     * THE DESERT DOMINANCE LAW (Paolo 7/14) -- one dominant ground at 85%, accents in
       COHERENT CLUSTERS, per-cell shuffle BANNED. Hardpan with rock-lag patches.
     * THE 45-DEGREE ART LAW, and round 3's own words: "THE SHADOW GOES EAST, because every
       other tile in this game is lit from the same corner and a landmark throwing its
       shadow the wrong way is the one thing that would make it read as pasted on."

   AND THE SHADOW IS THE WHOLE POINT, which is rule 20. From directly above you cannot see
   that a thing is 350 m tall: the tower is a circle and the pod is a wider circle. What
   tells you is the shadow, and at this height it RUNS OFF THE EAST EDGE OF THE CELL and
   across the arterial. AH-01 R1 wants an ordinary frame with exactly one wrong thing in
   it: a car park, a low casino, a road -- and a shadow longer than the block, thrown by
   something with no light in it. R4 THE LIGHT WAS IN THE ROOM is served because the
   fixture is the sun and every other tile agrees with it. Nothing glows. Act one: the
   lamps are dead, the pod is a dark ring, the tower still stands.

   RULE 18: THIS DOES NOT TOUCH THE GAME. engine/bohemia_landmarks.js is the walked world,
   so this writes a BANK and a VOTE candidate instead, rendered through the game's own
   planner so the picture is the real plan and not a mock-up. It drops into the engine in
   one paste when the coordinator says the cut holds.

       node tools/bohemia_the_tower_still_standing_cook_9_21_26.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const REPO = path.dirname(__dirname);
const L = require(path.join(REPO, 'engine/bohemia_landmarks.js'));
const OM = require(path.join(REPO, 'engine/bohemia_overmap.js'));

const MARK = '__THE_STRATOSPHERE__';

const STRAT_PAL = {
  0: '#8a7a5e',   // hardpan
  1: '#3f3d38',   // arterial
  2: '#9a8a68',   // rock lag
  3: '#6a6258',   // car park
  4: '#8f8676',   // bay stripe
  5: '#7c7468',   // podium roof
  6: '#5c5852',   // podium parapet
  7: '#9c968c',   // the shaft
  8: '#747068',   // the shaft's shaded side
  9: '#4a463f',   // the pod
  10: '#3a3630',  // the pod's underside
  11: '#55514a',  // porte-cochere
  12: '#4a4030',  // dead lamp post
  13: '#3e5a62',  // the pool, still holding water
  14: '#2f2b26',  // THE SHADOW
  15: '#b09a72'   // the tripod footings
};

const STRAT_LEG = {
  0:  { name: 'hardpan', kind: 'ground', act1: 'baked hardpan, cracked and pale' },
  1:  { name: 'arterial shoulder', kind: 'drive', act1: 'the boulevard running past the north and east of the plot (car-drivable)' },
  2:  { name: 'rock lag', kind: 'ground', act1: 'a patch of desert gravel the wind left behind', solid: false },
  3:  { name: 'car park', kind: 'drive', act1: 'the resort car park, cracked and seal-patched, empty (car-drivable)' },
  4:  { name: 'bay stripe', kind: 'ground', act1: 'a parking bay stripe, mostly worn off', solid: false },
  5:  { name: 'podium roof', kind: 'structure', act1: 'the roof of the casino podium, three storeys of it under your feet' },
  6:  { name: 'podium parapet', kind: 'structure', act1: 'the low wall around the podium roof' },
  7:  { name: 'the shaft', kind: 'structure', act1: 'the concrete shaft going up. You cannot see the top of it from here.' },
  8:  { name: 'the shaft, shaded', kind: 'structure', act1: 'the side of the shaft the sun does not reach' },
  9:  { name: 'the pod', kind: 'structure', act1: 'the observation pod, three hundred and fifty metres up. Nothing is lit in it.' },
  10: { name: 'under the pod', kind: 'structure', act1: 'the dark underside of the pod, hanging over the shaft' },
  11: { name: 'porte-cochere', kind: 'drive', act1: 'the covered drop-off, where the cars used to stop (car-drivable)' },
  12: { name: 'dead lamp post', kind: 'structure', act1: 'a car park lamp post with nothing in the head' },
  13: { name: 'the pool', kind: 'ground', act1: 'the podium pool. There is still water in it, and it is the wrong colour.', solid: false },
  14: { name: 'the tower shadow', kind: 'ground', act1: 'the shadow. It runs off the far side of the block and you cannot see what is throwing it.', solid: false },
  15: { name: 'tripod footing', kind: 'structure', act1: 'one of the three concrete feet the tower stands on' }
};

const STRAT_NOTES = {
  summary: 'The Stratosphere: a 350 m concrete shaft on a three-legged base with an observation pod near the top, standing on a low casino podium at the north end of the Strip. From above it is a circle, a wider circle, and a shadow that leaves the block.',
  reference: [
    'Stratosphere Tower, Las Vegas, 1996. 350 m, the tallest freestanding observation tower in the United States. A tapering concrete shaft on a three-legged base, an observation pod with decks and rides near the top, a low casino podium under it and a large surface car park.',
    'Learning From Las Vegas (Venturi and Scott Brown): a Strip plot is SIGN + SHED + PARKING IN FRONT and the sign is taller than the building. This is that idea at its limit -- the sign is 350 m and the shed is three storeys.',
    'The Strip\'s three races (Stefan Al): a resort is read by its pool, its sign and its porte-cochere.'
  ],
  layout: [
    'The TOWER stands on the podium toward the NORTH of the plot, because the arterial is the north edge and the porte-cochere has to touch it.',
    'The PODIUM is low and plain on purpose: the plan must read TOWER FIRST.',
    'The CAR PARK fills the west and south-west with its bays marked, off the arterial.',
    'Everything else is open hardpan with rock-lag patches, because this is the edge of downtown and it is honestly mostly desert.',
    'THE SHADOW runs EAST and leaves the cell. That is what tells you how tall the thing is, and it is the only way a top-down view can say it.'
  ],
  circulation: 'The ARTERIAL (1) runs the north and east edges. The PORTE-COCHERE (11) is the one covered way in, off the north. The CAR PARK (3) reaches it. On the podium roof (5) the parapet (6) is solid and the pool (13) is not.',
  layering: 'GROUND: hardpan (0), rock lag (2), bay stripes (4), the pool (13), the shadow (14). DRIVE: arterial (1), car park (3), porte-cochere (11). STRUCTURE (solid): the shaft (7,8), the pod (9,10), the podium (5,6), the tripod footings (15), lamp posts (12).',
  act1: 'The lamps are dead. The pod is a dark ring. There is still water in the pool and it is the wrong colour. The tower stands.'
};

/* THE PLAN. Every number here is metres divided by 0.75, which is what a valley tile is. */
function build(a) {
  const T = (m) => Math.round(m / 0.75);          // metres -> valley tiles
  /* THE TOWER SITS ON THE PODIUM'S NORTH-EAST CORNER, hard by the boulevard, which is
     where the real one is. The first cut put it mid-podium and the podium then filled the
     whole east side, so THE SHADOW HAD NOWHERE TO FALL -- it only paints on ground, and
     the picture came back with the idea of the plot invisible behind its own building.
     A shadow needs open ground east of the thing throwing it. */
  const MID_X = a.fx(0.60), MID_Y = a.fy(0.34);   // the tower's centre, north-east on the podium

  /* GROUND FIRST AND NOT AS ONE CODE (desert dominance law: patches, never noise). */
  a.rect(a.X0, a.Y0, a.X1, a.Y1, 0);
  /* TUNED TO THE LAW'S OWN NUMBER, not by eye: 64 blobs put the rock lag at 32% of the
     open desert and the law says ONE DOMINANT AT 85%. The tool prints the split so this
     cannot drift back. */
  a.scatter(0, 2, 26, 4, 13);

  /* THE ARTERIAL IS THE NORTH AND EAST EDGES -- measured off the map, not chosen. */
  a.rect(a.X0, a.Y0, a.X1, a.fy(0.07), 1);
  a.rect(a.fx(0.93), a.Y0, a.X1, a.Y1, 1);

  /* THE CAR PARK, west and south-west, off the arterial. TG-05: bays are marked. */
  const PL = a.fx(0.04), PR = a.fx(0.28), PT = a.fy(0.10), PB = a.fy(0.86);
  a.rect(PL, PT, PR, PB, 3);
  for (let y = PT + 4; y < PB - 2; y += 7) a.rect(PL + 2, y, PR - 2, y, 4);
  for (let i = 0; i < 4; i++) { a.set(PL + 3, PT + 6 + i * 22, 12); a.set(PR - 3, PT + 14 + i * 22, 12); }

  /* THE PODIUM: low, plain, and deliberately boring so the tower reads first. */
  const BL = a.fx(0.30), BR = a.fx(0.72), BT = a.fy(0.22), BB = a.fy(0.84);
  a.rect(BL, BT, BR, BB, 5);
  a.ring(BL, BT, BR, BB, 2, 6);

  /* THE POOL, on the podium roof where a top-down view can see it (BLDG-04). */
  a.rect(a.fx(0.40), a.fy(0.60), a.fx(0.62), a.fy(0.78), 13);

  /* THE PORTE-COCHERE, on the arterial side, because that is the piece that must touch
     the road (BLDG-04). It is drivable and it joins the car park to the boulevard. */
  a.rect(a.fx(0.46), a.fy(0.07), a.fx(0.66), a.fy(0.23), 11);
  a.rect(a.fx(0.28), a.fy(0.10), a.fx(0.46), a.fy(0.16), 3);

  /* THE TRIPOD. The real base is three legs on a span of about forty metres. */
  const FOOT = T(40) / 2;
  for (let k = 0; k < 3; k++) {
    const ang = -Math.PI / 2 + k * (2 * Math.PI / 3);
    const fx = Math.round(MID_X + Math.cos(ang) * FOOT);
    const fy = Math.round(MID_Y + Math.sin(ang) * FOOT * 0.6);
    a.rect(fx - 4, fy - 3, fx + 4, fy + 3, 15);
  }

  /* THE SHADOW GOES EAST, and it LEAVES THE CELL. Round 3's own words: every other tile in
     this game is lit from the same corner, and a landmark throwing its shadow the wrong
     way is the one thing that would make it read as pasted on. At 350 m the shadow is
     longer than the block, which is the only way a view from above can say how tall a
     thing is -- and it is the one wrong thing in an otherwise ordinary frame (AH-01 R1).

     AND IT IS THE SHAPE A CYLINDER ACTUALLY THROWS, which the first cut got wrong. That
     one spread into a cone and swallowed a quarter of the plot: it read as a dark stain,
     not as a shadow, and the picture said so immediately. A cylinder's shadow is a BAR OF
     ITS OWN WIDTH, and the pod's is a wider ellipse further along the same bar, because
     the pod is further up. So: constant width, one ellipse out near the end, and it
     leaves the cell.

     IT ALSO STOPS AT THE PODIUM'S EDGE. A shadow falls on the ground, and the podium is
     three storeys above the ground; painting it across the roof was the other thing that
     made the first cut read as a stain. */
  const SHAFT_R = Math.round(T(20) / 2);
  const onGround = (x, y) => !(x >= BL && x <= BR && y >= BT && y <= BB);
  const bar = (x, y0, y1, code) => {
    for (let y = y0; y <= y1; y++) if (onGround(x, y)) a.set(x, y, code);
  };
  for (let s = 0; s < a.W; s++) {
    const x = MID_X + SHAFT_R + s;
    if (x > a.X1) break;
    const drop = Math.round(s * 0.30);                 // the sun is not on the horizon
    bar(x, MID_Y + drop - SHAFT_R, MID_Y + drop + SHAFT_R, 14);
  }
  /* the pod's own shadow: a wider ellipse out along the bar, which is how you read that
     there is something up there and not just a pipe */
  const POD_R = Math.round(T(40) / 2);
  const POD_AT = Math.round(a.W * 0.46);
  for (let s = 0; s < POD_R * 2; s++) {
    const x = MID_X + SHAFT_R + POD_AT + s;
    if (x > a.X1) break;
    const hw = Math.round(POD_R * Math.sqrt(Math.max(0, 1 - Math.pow((s - POD_R) / POD_R, 2))));
    if (hw < 1) continue;
    const drop = Math.round((POD_AT + s) * 0.30);
    bar(x, MID_Y + drop - hw, MID_Y + drop + hw, 14);
  }

  /* THE POD: a ring WIDER than the shaft, concentric with it. From above that ring is the
     only thing that says there is anything up there at all. */
  for (let dy = -POD_R; dy <= POD_R; dy++) {
    const hw = Math.round(Math.sqrt(Math.max(0, POD_R * POD_R - dy * dy)));
    if (hw < 1) continue;
    a.rect(MID_X - hw, MID_Y + dy, MID_X + hw, MID_Y + dy, 10);
  }
  const RIM = POD_R - 4;
  for (let dy = -POD_R; dy <= POD_R; dy++) {
    const hw = Math.round(Math.sqrt(Math.max(0, POD_R * POD_R - dy * dy)));
    const iw = Math.round(Math.sqrt(Math.max(0, RIM * RIM - dy * dy)));
    if (hw < 1) continue;
    a.rect(MID_X - hw, MID_Y + dy, MID_X - iw, MID_Y + dy, 9);
    a.rect(MID_X + iw, MID_Y + dy, MID_X + hw, MID_Y + dy, 9);
  }

  /* THE SHAFT, inside the pod ring: the lit half and the half the sun does not reach. */
  for (let dy = -SHAFT_R; dy <= SHAFT_R; dy++) {
    const hw = Math.round(Math.sqrt(Math.max(0, SHAFT_R * SHAFT_R - dy * dy)));
    if (hw < 1) continue;
    a.rect(MID_X - hw, MID_Y + dy, MID_X, MID_Y + dy, 7);
    a.rect(MID_X + 1, MID_Y + dy, MID_X + hw, MID_Y + dy, 8);
  }
}

/* ------------------------------------------------------------------ render it for real */
function render() {
  const cellX = 53, cellY = 28;                       // measured: strat sits at 53,28
  const g = L.plan(0x5715c0de, { cellX, cellY, bounds: { x0: cellX, x1: cellX, y0: cellY, y1: cellY } },
    (a) => { a.rect(a.X0, a.Y0, a.X1, a.Y1, 0); build(a); });
  return g;
}

function main() {
  /* MAP LAW: read the plot's own neighbours rather than assuming them. */
  const m = OM.buildOvermap(12345);
  const cell = m.tiles.find(t => t.district === 'strat');
  if (!cell) { console.log('REFUSED: the map has no strat cell; do not cook a plot for a place that is not there'); process.exit(1); }
  const around = [];
  for (let dy = -1; dy <= 1; dy++) {
    const row = [];
    for (let dx = -1; dx <= 1; dx++) { const c = m.at(cell.x + dx, cell.y + dy); row.push(c && c.district); }
    around.push(row);
  }
  console.log('strat at %d,%d.  its 3x3, read off the map:', cell.x, cell.y);
  for (const r of around) console.log('   ' + r.map(s => String(s).padEnd(12)).join(' '));
  if (around[0].indexOf('arterial') < 0) {
    console.log('REFUSED: this plan fronts the NORTH arterial and the map no longer puts one there.');
    process.exit(1);
  }

  const g = render();
  const used = {};
  for (const row of g) for (const v of row) used[v] = (used[v] || 0) + 1;
  const total = g.length * g[0].length;
  const miss = Object.keys(used).filter(k => !(k in STRAT_LEG));
  if (miss.length) { console.log('REFUSED: codes with no legend entry: ' + miss.join(',')); process.exit(1); }
  const unused = Object.keys(STRAT_LEG).filter(k => !(k in used));
  if (unused.length) { console.log('REFUSED: legend entries nothing draws: ' + unused.join(',')); process.exit(1); }

  console.log('\nWHAT THE PLOT IS MADE OF (%d tiles, one tile = 0.75 m):', total);
  /* NODE'S console.log DOES NOT DO printf PADDING, which the first run proved by printing
     the format string itself. Pad by hand. */
  const pad = (s, n) => (s + ' '.repeat(n)).slice(0, n);
  Object.keys(used).map(Number).sort((a, b) => used[b] - used[a]).forEach(k => {
    console.log('   ' + pad(STRAT_LEG[k].name, 20) + (100 * used[k] / total).toFixed(2) + '%');
  });
  const ground = (used[0] || 0) + (used[2] || 0);
  console.log('   ' + pad('open desert', 20) + (100 * ground / total).toFixed(2) +
    '%  (hardpan ' + (100 * (used[0] || 0) / ground).toFixed(0) +
    '% dominant, rock lag in patches: the desert law wants one dominant, never a shuffle)');

  const doc = {
    version: 'BOHEMIA_THE_STRAT_v1', built: '2026-09-21', lane: 'COOK [fortress buildings] round 4',
    mark: MARK, cell: { x: cell.x, y: cell.y }, around,
    why: 'the overmap names seven singular Las Vegas landmarks and nothing can build six of them. Round 3 drew the Welcome sign, 7 -> 6. This is the Stratosphere: the tallest thing in the valley and the one you orient by from anywhere in it.',
    not_shipped: 'rule 18: engine/bohemia_landmarks.js is the walked world, so this is a bank and a VOTE candidate. It drops into the engine in one paste when the hold lifts.',
    palette: STRAT_PAL, legend: STRAT_LEG, notes: STRAT_NOTES,
    coverage: Object.fromEntries(Object.keys(used).map(k => [STRAT_LEG[k].name, +(100 * used[k] / total).toFixed(2)])),
    build_source: build.toString()
  };
  const out = path.join(REPO, 'banks/BOHEMIA_THE_STRAT_9_21_26.txt');
  fs.writeFileSync(out, JSON.stringify(doc));
  const back = JSON.parse(fs.readFileSync(out, 'utf8'));
  if (!back.build_source || Object.keys(back.legend).length !== Object.keys(STRAT_LEG).length) {
    console.log('REFUSED: read-back failed'); process.exit(1);
  }
  console.log('\nwrote banks/BOHEMIA_THE_STRAT_9_21_26.txt  (' +
    (fs.statSync(out).size / 1024).toFixed(0) + ' KB)');
  const dom = 100 * (used[0] || 0) / ((used[0] || 0) + (used[2] || 0));
  if (dom < 80) {
    console.log('REFUSED: the open desert is only ' + dom.toFixed(0) + '% one dominant ground. ' +
      'The desert dominance law (Paolo 7/14) wants 85% with accents in coherent clusters.');
    process.exit(1);
  }
  fs.writeFileSync('/tmp/strat_grid.json', JSON.stringify({ g, pal: STRAT_PAL, leg: STRAT_LEG }));
}

main();
