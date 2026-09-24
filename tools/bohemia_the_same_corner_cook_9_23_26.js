/* ============================================================================
   THE SAME CORNER, A HUNDRED YEARS ON  (WORLD, 9/23/26, rule 31)

   RULE 29 (Paolo 9/21): every text item this lane made was voted down. A WORLD
   cook is a THING DRAWN. Rule 31 (Paolo 9/23) says the future act of the valley
   is DERIVED from the earlier acts' ledgers, never hand-placed, and that "early
   in the game it is a ruin and the ruin is the tutorial."

   NOBODY HAS EVER DRAWN THAT RUIN, so nobody can say whether it reads. This is
   the picture: ONE corner, twice, same camera, same geometry, a hundred years
   apart. Left is act 1, the corner as it stands. Right is act 3, the same corner
   after a do-nothing past -- which is the FLOOR rule 31 asks for, the poorest
   city the derive is allowed to hand him, and therefore the one that has to be
   playable and has to read.

   THE TWO PANELS ARE THE SAME DRAWING. Every wall, kerb, pole and slab is placed
   once, by one function, and the act only decides what a hundred years did to it.
   That is not a style choice: it is the whole claim of rule 31 made visible. If
   act 3 were drawn freehand it would be a hand-placed city, which is the one
   thing the law forbids.

   THE SUBJECT, REAL: a residential corner in the Las Vegas valley -- a stuccoed
   block wall along the lot line, a concrete sidewalk, a kerb and gutter, a power
   pole, the asphalt of the street. This is what the valley is made of by the
   mile and it is what he actually walks past.

   AND WHAT A HUNDRED YEARS REALLY DOES TO IT, which is the part that had to be
   read up rather than imagined. Concrete and CMU block outlast everything else
   in the Mojave: the wall and the slab are still there at a century, cracked on
   their control joints and undermined at the corners. Asphalt does not -- it
   oxidises, crazes, then breaks up into plates, and the desert takes it back
   from the edges in, which is why the street is the FIRST thing to go and the
   sidewalk is nearly the last. Untreated pine and steel are gone. So the ruin is
   not "the same picture, browner": it is the same picture with the soft things
   subtracted and the hard things cracked, and that asymmetry is the whole read.

   REFERENCE CHECK
   COMPARED TO: TG-05 (the lot tile -- how a flat ground surface reads from
   above), CB-03 (a Vegas block from the air -- the real grain of a residential
   corner), BLDG-05 (the structural sanity list, the 9/4 law's own words),
   PROP-02 (real object typology: a kerb, a block wall and a power pole are
   specific shapes) and AH-01 (the analog horror bible, ours).

   STRUCTURAL RULES TAKEN:
     * TG-05 -- a flat surface reads by what BREAKS it, never by the fill. The
       slab joints, the kerb line and the crack do the work; the concrete is one
       dominant value and the asphalt another.
     * CB-03 -- the real grain of a Vegas corner: the wall runs the lot line
       unbroken, the sidewalk is detached from the kerb with a strip between, and
       the pole stands in that strip. Not invented; that is how the mile reads.
     * BLDG-05 -- a wall stands on something and a pole is planted. Nothing here
       floats, and the ruin's wall still stands on its own footing.
     * PROP-02 -- a kerb has a face and a gutter pan, not a line. A block wall
       has a cap course a shade lighter than the field. Drawn as those.
     * AH-01 -- ordinary frame, ONE thing wrong, and the camera does not help.
       In act 1 the ordinary part is the whole corner; the wrong thing is the
       small dark doorway-shaped gap in the wall that has no gate in it. In act 3
       the frame is the same corner and the wrong thing is that THE MAN-MADE
       GEOMETRY IS STILL PERFECTLY LEGIBLE with nothing left to use it -- the
       joints still line up, the kerb still runs true, and the gap is still
       there. Nobody is coming. The horror is the survival of the layout, not
       rubble, and rubble would have been the cheap version of this drawing.

   NOT SHIPPED TO A PLAY SURFACE (rule 18): this is a picture for the VOTE tab.
   Nothing in this file is loaded by the game.

     node tools/bohemia_the_same_corner_cook_9_23_26.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const REPO = path.resolve(__dirname, '..');

const S = 64;          /* one panel */
const W = S * 2 + 2;   /* two panels and a one-pixel gutter either side of a seam */

function blank(w, h) { const g = []; for (let y = 0; y < h; y++) g.push(new Array(w).fill(0)); return g; }
function rnd(seed) { let s = seed >>> 0 || 1;
  return () => { s = (s * 1103515245 + 12345) >>> 0; return s / 4294967296; }; }

/* ---------------------------------------------------------------------------
   THE PALETTE AND THE LEGEND. One row per index, and the gate reads both.
   --------------------------------------------------------------------------- */
const PALETTE = {
  0:  '#00000000',
  1:  '#6d6553',   /* yard dirt */
  2:  '#9a9484',   /* concrete, sidewalk */
  3:  '#928b79',   /* concrete, the house slab */
  4:  '#35332d',   /* asphalt */
  5:  '#464338',   /* asphalt, oxidised and crazed */
  6:  '#ada691',   /* block wall, the cap seen from above */
  7:  '#8d8674',   /* block wall, the far face */
  8:  '#c3bca6',   /* block wall, the lit corner return */
  9:  '#4b473c',   /* the shadow a standing thing throws */
  10: '#78725f',   /* kerb face */
  11: '#a7a18d',   /* kerb top, catching the light */
  12: '#403d34',   /* gutter pan, where the water sat */
  13: '#89826f',   /* control joint / slab joint, one step off the fill */
  14: '#4f4b3f',   /* power pole, timber */
  15: '#1e1c19',   /* THE WRONG THING: the gap in the wall with no gate in it */
  16: '#5f5948',   /* crack -- DARK, because a crack seen from above is a GAP */
  17: '#7d765f',   /* desert taking the asphalt back */
  18: '#55503f',   /* the plates the asphalt breaks into */
  19: '#847556',   /* roof, the sun side */
  20: '#584c38',   /* roof, the shaded pitch */
  21: '#3a3226',   /* the ridge, and the roof's own shadow line */
  22: '#b9b29c',   /* lane line, faded */
};

const LEGEND = {
  1:  { name: 'yard dirt',             kind: 'ground' },
  2:  { name: 'sidewalk concrete',     kind: 'ground' },
  3:  { name: 'house slab',            kind: 'structure' },
  4:  { name: 'asphalt',               kind: 'ground' },
  5:  { name: 'asphalt, oxidised',     kind: 'ground' },
  6:  { name: 'block wall, cap',       kind: 'structure' },
  7:  { name: 'block wall, far face',  kind: 'structure' },
  8:  { name: 'block wall, lit return',kind: 'structure' },
  9:  { name: 'shadow',                kind: 'marking' },
  10: { name: 'kerb face',             kind: 'prop' },
  11: { name: 'kerb top',              kind: 'prop' },
  12: { name: 'gutter pan',            kind: 'prop' },
  13: { name: 'slab joint',            kind: 'marking' },
  14: { name: 'power pole',            kind: 'prop' },
  15: { name: 'the gap with no gate',  kind: 'wrong' },
  16: { name: 'crack',                 kind: 'marking' },
  17: { name: 'desert over the edge',  kind: 'ground' },
  18: { name: 'asphalt broken to plates', kind: 'ground' },
  19: { name: 'roof, sun side',        kind: 'structure' },
  20: { name: 'roof, shaded pitch',    kind: 'structure' },
  21: { name: 'roof ridge',            kind: 'structure' },
  22: { name: 'lane line',             kind: 'marking' },
};

/* ---------------------------------------------------------------------------
   ONE DRAWING, TWO ACTS. `act` is the ONLY argument that differs between the
   panels, which is rule 31 made visible: the future is a function of the same
   corner, never a second corner drawn by hand.
   --------------------------------------------------------------------------- */
/* THE CORNER'S GEOMETRY, ONE COPY, SHARED BY BOTH ACTS. Named so the act-3 pass
   can subtract from the SAME numbers the act-1 pass drew with, which is the only
   way the two panels can honestly be the same place. */
const GEO = {
  wallY: 26,          /* the block wall along the front lot line */
  wallX: 40,          /* where it turns and runs down the side lot line */
  walkY: 33,          /* the sidewalk band */
  walkX: 47,          /* the sidewalk down the cross street */
  kerbY: 41,          /* the kerb of the near street */
  kerbX: 55,          /* the kerb of the cross street */
  roof: { x0: 2, y0: 1, x1: 33, y1: 19 },
  poleX: 51,          /* in the strip, on the corner, where the valley puts it */
  gapX: 20            /* the doorway-shaped gap with no gate in it */
};

function corner(act, seed) {
  const g = blank(S, S), r = rnd(seed);
  const set = (x, y, c) => { if (x >= 0 && y >= 0 && x < S && y < S) g[y][x] = c; };
  const rect = (x0, y0, x1, y1, c) => {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) set(x, y, c); };
  const old = act >= 3;
  const G = GEO;

  /* THE YARD, everything behind the wall, seen from above. */
  rect(0, 0, S - 1, S - 1, 1);

  /* ---- THE TWO STREETS, WHICH IS WHAT MAKES THIS A CORNER ----------------
     CB-03: at this grain a residential corner is two strips of asphalt meeting
     at a right angle with the sidewalk carried round the inside of the turn.
     The near street runs across the bottom; the cross street runs down the
     right. Drawing one street would have been a kerb, not a corner. */
  rect(0, G.kerbY + 3, S - 1, S - 1, old ? 5 : 4);
  rect(G.kerbX + 3, 0, S - 1, S - 1, old ? 5 : 4);

  /* the lane lines, broken, one per street, and they stop at the junction the
     way real markings do */
  for (let x = 0; x < G.kerbX - 4; x++) if ((x % 9) < 5) set(x, S - 5, 22);
  for (let y = 0; y < G.kerbY - 4; y++) if ((y % 9) < 5) set(S - 5, y, 22);

  /* ---- THE KERB AND GUTTER, CARRIED ROUND THE TURN -----------------------
     PROP-02: a kerb is a lit top and a face, and the pan is the shallow dish
     beside it where the water sat and left its stain. */
  for (let x = 0; x < S; x++) {
    set(x, G.kerbY + 2, 12); set(x, G.kerbY + 1, 10); set(x, G.kerbY, 11);
  }
  for (let y = 0; y < S; y++) {
    set(G.kerbX + 2, y, 12); set(G.kerbX + 1, y, 10); set(G.kerbX, y, 11);
  }

  /* ---- THE SIDEWALK, AN L ROUND THE INSIDE OF THE CORNER ----------------- */
  rect(0, G.walkY, S - 1, G.walkY + 6, 2);
  rect(G.walkX, 0, G.walkX + 6, S - 1, 2);
  /* TG-05: a flat surface reads by its BREAKS, and the breaks stay QUIET -- one
     value step, never a bar across the tile, which is the mistake the ring
     road's first cut made and it read as a cattle grid. */
  for (let x = 4; x < G.walkX; x += 11) for (let y = G.walkY; y <= G.walkY + 6; y++) set(x, y, 13);
  for (let y = 4; y < G.walkY; y += 11) for (let x = G.walkX; x <= G.walkX + 6; x++) set(x, y, 13);
  set(G.walkX - 1, G.walkY + 3, 13);

  /* ---- THE HOUSE. BLDG-05: it stands on a slab and the slab is under it. ---
     The slab is drawn FIRST and the roof over it, so when the roof goes in act
     3 the slab is already there -- the ruin is a subtraction, not a redraw. */
  const R2 = G.roof;
  rect(R2.x0 - 1, R2.y0 - 1, R2.x1 + 1, R2.y1 + 1, 3);
  for (let x = R2.x0 - 1; x <= R2.x1 + 1; x += 9)
    for (let y = R2.y0 - 1; y <= R2.y1 + 1; y++) set(x, y, 13);

  if (!old) {
    /* the two pitches and the ridge between them, seen from above (PROP-02: a
       hip roof reads as two values and one line, never one flat colour) */
    const mid = (R2.y0 + R2.y1) >> 1;
    rect(R2.x0, R2.y0, R2.x1, mid, 19);
    rect(R2.x0, mid + 1, R2.x1, R2.y1, 20);
    for (let x = R2.x0; x <= R2.x1; x++) set(x, mid, 21);
    for (let y = R2.y0; y <= R2.y1; y++) { set(R2.x0, y, 21); set(R2.x1, y, 21); }
    /* the shadow it throws into the yard, which is what plants it */
    for (let x = R2.x0 + 2; x <= R2.x1 + 3; x++) set(x, R2.y1 + 1, 9);
    for (let y = R2.y0 + 2; y <= R2.y1 + 1; y++) { set(R2.x1 + 2, y, 9); set(R2.x1 + 3, y, 9); }
  }

  /* ---- THE BLOCK WALL, AND IT TURNS THE CORNER --------------------------
     PROP-02: from above a block wall is its cap course, with the far face
     showing on the side the camera can see and a shadow on the ground. */
  for (let x = 0; x <= G.wallX + 2; x++) {
    set(x, G.wallY, 6); set(x, G.wallY + 1, 6);
    set(x, G.wallY + 2, 7);
    set(x, G.wallY + 3, 9);
  }
  for (let y = G.wallY; y < S; y++) {
    set(G.wallX, y, 6); set(G.wallX + 1, y, 6);
    set(G.wallX + 2, y, 7);
    set(G.wallX + 3, y, 9);
  }
  set(G.wallX, G.wallY, 8); set(G.wallX + 1, G.wallY, 8);   /* the lit return */
  set(G.wallX, G.wallY + 1, 8);
  /* the control joints, which is where a real wall cracks and nowhere else */
  for (let x = 7; x < G.wallX; x += 14) { set(x, G.wallY, 7); set(x, G.wallY + 1, 7); }
  for (let y = G.wallY + 8; y < S; y += 14) { set(G.wallX, y, 7); set(G.wallX + 1, y, 7); }

  /* *** THE WRONG THING, AND IT IS IN BOTH PANELS. *** A doorway-shaped gap in
     the wall with no gate hung in it, and no path worn to it. AH-01: ordinary
     frame, one thing wrong, and the camera does not go and look. */
  for (let x = G.gapX; x <= G.gapX + 4; x++)
    for (let y = G.wallY; y <= G.wallY + 2; y++) set(x, y, 15);
  set(G.gapX - 1, G.wallY + 3, 9); set(G.gapX + 5, G.wallY + 3, 9);

  /* ---- THE POWER POLE, in the strip on the corner (CB-03) ----------------
     FROM ABOVE A POLE IS ALMOST NOTHING AND ITS SHADOW IS EVERYTHING, which is
     the correction the first cut needed: drawn as a stub it simply vanished at
     this size. So it is a small dark top and a LONG shadow laid the same way
     every other shadow on the tile falls. The crossarm is timber and a century
     of Mojave sun takes it, so in act 3 there is a pole top and a shorter
     shadow and no arm -- the subtraction, again, rather than a redraw. */
  rect(G.poleX, G.walkY - 3, G.poleX + 1, G.walkY - 1, 14);
  if (!old) {                       /* the crossarm, and the shadow it throws */
    for (let y = G.walkY - 8; y <= G.walkY + 2; y++) set(G.poleX + 4, y, 14);
    for (let y = G.walkY - 7; y <= G.walkY + 3; y++) set(G.poleX + 5, y, 9);
  }
  for (let d = 2; d <= (old ? 7 : 12); d++) {
    set(G.poleX + d, G.walkY - 3 + ((d / 3) | 0), 9);
    set(G.poleX + d, G.walkY - 2 + ((d / 3) | 0), 9);
  }

  if (!old) return g;

  /* -------------------------------------------------------------------------
     A HUNDRED YEARS. NOT A FILTER: the soft things are SUBTRACTED and the hard
     things are CRACKED, and only those two operations run. The roof is already
     gone above; what follows is the desert and the weather.
     ------------------------------------------------------------------------- */

  /* 1. THE ASPHALT GOES FIRST, from the outside edges in, breaking into plates.
        It is the youngest material on the corner and the shortest-lived. */
  for (let x = 0; x < S; x++) {
    const bite = 2 + Math.round(4 * Math.abs(Math.sin(x / 9 + 1.1)) + r() * 2);
    for (let d = 0; d < bite; d++) set(x, S - 1 - d, 17);
    if (r() < 0.45) {
      const y = G.kerbY + 3 + ((r() * 8) | 0);
      rect(x, y, x + 1 + ((r() * 3) | 0), y + 1, 18);
    }
  }
  /* THE CROSS STREET GOES THE SAME WAY, and the first cut let it go TWICE as
     hard as the near street for no reason but a second random roll -- the right
     edge read as noise rather than as the same road decaying. Same amplitude,
     half the scatter, so the two streets are the same material at the same age. */
  for (let y = 0; y < S; y++) {
    const bite = 2 + Math.round(3 * Math.abs(Math.sin(y / 8 + 0.4)) + r());
    for (let d = 0; d < bite; d++) set(S - 1 - d, y, 17);
    if (r() < 0.22) {
      const x = G.kerbX + 3 + ((r() * 6) | 0);
      rect(x, y, x + 1, y + 1, 18);
    }
  }

  /* 2. THE DESERT COMES OVER THE KERB where the gutter filled and stayed full. */
  for (let x = 0; x < S; x++) if (r() < 0.36) {
    set(x, G.kerbY + 2, 17); if (r() < 0.4) set(x, G.kerbY + 1, 17);
  }
  for (let y = 0; y < S; y++) if (r() < 0.36) {
    set(G.kerbX + 2, y, 17); if (r() < 0.4) set(G.kerbX + 1, y, 17);
  }

  /* 3. THE CONCRETE STAYS AND CRACKS ON ITS JOINTS, which is exactly where real
        concrete cracks and is the reason the sidewalk is still legible. */
  for (let x = 4; x < G.walkX; x += 11) {
    let xx = x;
    for (let y = G.walkY; y <= G.walkY + 6; y++) { set(xx, y, 16); if (r() < 0.3) xx += r() < 0.5 ? 1 : -1; }
  }
  for (let y = 4; y < G.walkY; y += 11) {
    let yy = y;
    for (let x = G.walkX; x <= G.walkX + 6; x++) { set(x, yy, 16); if (r() < 0.3) yy += r() < 0.5 ? 1 : -1; }
  }
  /* and the slab, which is the clearest thing left of the house */
  for (let x = R2.x0 - 1; x <= R2.x1 + 1; x += 9) {
    let xx = x;
    for (let y = R2.y0 - 1; y <= R2.y1 + 1; y++) { set(xx, y, 16); if (r() < 0.25) xx += r() < 0.5 ? 1 : -1; }
  }

  /* 4. THE WALL STANDS AND LOSES ITS CAP IN PATCHES, and cracks on its control
        joints. It does not fall down: CMU block in a dry climate outlasts
        everything else on this corner, and drawing it as rubble would be the
        cheap version of this picture. */
  for (let x = 0; x <= G.wallX; x++) if (r() < 0.3) set(x, G.wallY, 7);
  for (let y = G.wallY; y < S; y++) if (r() < 0.3) set(G.wallX, y, 7);
  for (let x = 7; x < G.wallX; x += 14) {
    let xx = x;
    for (let y = G.wallY; y <= G.wallY + 3; y++) { set(xx, y, 16); if (r() < 0.35) xx += r() < 0.5 ? 1 : -1; }
  }

  /* 5. THE SAND BANKS UP ALONG THE FOOT OF THE WALL, because a wall in a desert
        is a snow fence for sand and a century of it looks like this. */
  for (let x = 0; x <= G.wallX + 2; x++) {
    const h = Math.max(0, Math.round(1.8 * Math.sin(x / 7 + 2.3) + 1.4 + r()));
    for (let d = 0; d < h; d++) set(x, G.wallY + 3 + d, 17);
  }
  for (let y = G.wallY + 3; y < S; y++) {
    const h = Math.max(0, Math.round(1.8 * Math.sin(y / 6 + 1.1) + 1.2 + r()));
    for (let d = 0; d < h; d++) set(G.wallX + 3 + d, y, 17);
  }

  return g;
}

/* ---------------------------------------------------------------------------
   THE TWO PANELS SIDE BY SIDE, SAME CAMERA. A seam so he can see they are the
   same drawing and not two drawings.
   --------------------------------------------------------------------------- */
function build(seed) {
  const a1 = corner(1, seed), a3 = corner(3, seed);
  const g = blank(W, S);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) g[y][x] = a1[y][x];
    for (let x = 0; x < S; x++) g[y][x + S + 2] = a3[y][x];
  }
  return { g, a1, a3 };
}

function main() {
  const seed = 9232026;
  const { g, a1, a3 } = build(seed);

  const count = (grid) => {
    const u = {}; let n = 0;
    for (let y = 0; y < grid.length; y++) for (let x = 0; x < grid[y].length; x++) {
      u[grid[y][x]] = (u[grid[y][x]] || 0) + 1; n++;
    }
    return { u, n };
  };
  const one = count(a1), three = count(a3);

  /* --- THE TOOL REFUSES ITSELF, four ways, and each one is a real claim ---- */

  /* AH-01: one thing wrong, and a SMALL one, in BOTH panels. */
  const wrong1 = (one.u[15] || 0), wrong3 = (three.u[15] || 0);
  const wshare = 100 * Math.max(wrong1, wrong3) / one.n;
  if (!(wrong1 > 0 && wrong3 > 0)) {
    console.log('REFUSED: the one wrong thing is not in both panels'); process.exit(1);
  }
  if (wshare > 3) {
    console.log('REFUSED: the wrong thing is ' + wshare.toFixed(1) + '% of a panel; one thing wrong is a SMALL thing');
    process.exit(1);
  }

  /* *** THE CLAIM OF RULE 31: THE RUIN IS THE SAME CORNER, DERIVED. *** If the
     two panels share too little the ruin is a second drawing, which is a
     hand-placed city, which the law forbids. If they share too much nothing
     happened in a hundred years. Both are refusals. */
  let same = 0;
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) if (a1[y][x] === a3[y][x]) same++;
  const kept = 100 * same / (S * S);
  if (kept < 25) { console.log('REFUSED: only ' + kept.toFixed(0) + '% of the corner survived; this is a second drawing, not a derived one'); process.exit(1); }
  if (kept > 75) { console.log('REFUSED: ' + kept.toFixed(0) + '% is unchanged; a hundred years did nothing'); process.exit(1); }

  /* *** THE SOFT THINGS GO AND THE HARD THINGS STAY, which is the whole read
     and the one thing that separates this from a brown filter. *** */
  const wall1 = (one.u[6] || 0) + (one.u[7] || 0) + (one.u[8] || 0);
  const wall3 = (three.u[6] || 0) + (three.u[7] || 0) + (three.u[8] || 0);
  const road1 = (one.u[4] || 0) + (one.u[5] || 0);
  const road3 = (three.u[4] || 0) + (three.u[5] || 0);
  const wallKept = wall3 / Math.max(1, wall1), roadKept = road3 / Math.max(1, road1);
  if (!(wallKept > roadKept)) {
    console.log('REFUSED: the asphalt outlasted the block wall (' + roadKept.toFixed(2)
      + ' against ' + wallKept.toFixed(2) + '), which is not how the Mojave works');
    process.exit(1);
  }
  if (wallKept < 0.6) {
    console.log('REFUSED: the wall only kept ' + (100 * wallKept).toFixed(0) + '% of itself; concrete block outlasts a century');
    process.exit(1);
  }

  /* TG-05: the breaks stay quiet. No single marking index may shout. */
  const crack = 100 * (three.u[16] || 0) / three.n;
  if (crack > 12) { console.log('REFUSED: the cracks are ' + crack.toFixed(0) + '% of the panel and the tile will read as a net'); process.exit(1); }

  const cover = (c) => Object.fromEntries(Object.keys(c.u).filter(k => LEGEND[k])
    .map(k => [LEGEND[k].name, +(100 * c.u[k] / c.n).toFixed(2)]));

  const doc = {
    version: 'BOHEMIA_THE_SAME_CORNER_v1', built: '2026-09-23',
    lane: 'WORLD, rule 31 (THE THREE ACTS AT ONCE, Paolo 9/23)',
    subject: 'one residential corner of the Las Vegas valley, drawn twice by ONE function, a hundred years apart. The act is the only argument that differs.',
    why: 'rule 31 says the future act is DERIVED from the earlier acts\' ledgers, never hand-placed, and that early in the game it is a ruin and the ruin is the tutorial. Nobody had drawn that ruin, so nobody could say whether it reads.',
    the_read: 'a hundred years SUBTRACTS the soft things and CRACKS the hard ones. The asphalt goes first from the edges in; the concrete and the block wall are still perfectly legible. The horror is the survival of the layout with nobody left to use it, not rubble.',
    ruling_it_serves: 'THE THREE ACTS AT ONCE (Paolo 9/23): "see the progress in the future from your past action... the city is built like shit because you\'re not making enough of an impact in your earlier act."',
    floor: 'this is the DO-NOTHING past, which is the floor rule 31 asks for: the poorest city the derive may hand him, and therefore the one that has to read and has to be playable.',
    size: { panel: S, image: W + 'x' + S },
    palette: PALETTE, legend: LEGEND,
    coverage: { act1: cover(one), act3: cover(three) },
    keptShare: +kept.toFixed(2),
    wallKept: +wallKept.toFixed(3),
    roadKept: +roadKept.toFixed(3),
    wrongShare: +wshare.toFixed(2),
    not_shipped: 'rule 18: nothing here is loaded by the game. It is a picture for the VOTE tab.',
    build_source: corner.toString()
  };

  const out = path.join(REPO, 'banks/BOHEMIA_THE_SAME_CORNER_9_23_26.txt');
  fs.writeFileSync(out, JSON.stringify(doc));
  const back = JSON.parse(fs.readFileSync(out, 'utf8'));
  if (!back.build_source || Object.keys(back.legend).length !== Object.keys(LEGEND).length) {
    console.log('REFUSED: read-back failed'); process.exit(1);
  }
  fs.writeFileSync(path.join(REPO, 'banks/_corner_grid.json'),
    JSON.stringify({ g, pal: PALETTE, leg: LEGEND, w: W, h: S }));

  console.log('wrote banks/BOHEMIA_THE_SAME_CORNER_9_23_26.txt ('
    + (fs.statSync(out).size / 1024).toFixed(0) + ' KB)');
  console.log('  the corner survives ' + kept.toFixed(0) + '% pixel-for-pixel across a century');
  console.log('  the block wall keeps ' + (100 * wallKept).toFixed(0)
    + '% of itself, the asphalt keeps ' + (100 * roadKept).toFixed(0) + '%');
  console.log('  the one wrong thing is ' + wshare.toFixed(2) + '% of a panel, and it is in both');
}

/* *** HE KILLED THIS ITEM AND THE DRAWING SURVIVED. *** (9/23 in the tab: "Bro
   the future gets better holy shit actually the right side is kinda what the
   beginning of the game is supposed to look like and it gets better".) The
   corner, the wall, the kerb and the slab are all still right; what was wrong
   was the DIRECTION. So the geometry is exported rather than copied, and
   bohemia_the_corner_reclaimed_cook_9_24_26.js draws the same corner the other
   way round. REUSE-FIRST: one corner, one function, two items. */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { corner: corner, GEO: GEO, PALETTE: PALETTE, LEGEND: LEGEND, S: S, blank: blank, rnd: rnd };
}
if (require.main === module) main();
