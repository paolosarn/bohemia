/* ============================================================================
   THE BIGGEST SCREEN EVER BUILT, SHOWING NOTHING
   (COOK, 9/22/26, [fortress buildings] round 5 / [seven landmarks])

   THE FIGHT VERDICT round 5: the two biggest lies are paid, the fighter is himself again
   and the light carries, and "ALL OF IT IS UI [fight hud]; COMBAT and COOK owe the picture
   nothing this round." So this round goes to this lane's own row again, the same one round
   4 went to.

   [seven landmarks]: the overmap names seven singular Las Vegas landmarks and nothing could
   build them. Round 3 drew the Welcome sign, round 4 the Stratosphere. FIVE LEFT, and this
   is the SPHERE -- picked because it is the only one the map gives FOUR CELLS, because a
   157 m ball in a 192 m plot is the one landmark whose real size actually fits what the map
   reserved, and because under rule 20 there is no more on-tone object in the valley than the
   largest screen ever built with nothing on it.

   MEASURED OFF A GENERATED MAP BEFORE A LINE WAS DRAWN (MAP LAW). The plot is 56,42 to
   57,43, four cells, 192 x 192 m, and its ring reads:

        arterial    arterial    arterial    arterial
        apartment   SPHERE      SPHERE      suburb
        apartment   SPHERE      SPHERE      suburb
        commercial  park        suburb      desert

   Arterial the WHOLE north edge, apartments west, suburb east, commercial and park south.
   So the plot fronts north, and the drivable-access law is served off the arterial it has.

   THE NUMBERS ARE THE REAL ONES. The Sphere is 112 m tall and 157 m wide, the largest
   spherical structure in the world, wrapped in about 54,000 square metres of exterior LED.
   A cell is 96 m and 128 valley tiles, so a tile is 0.75 m: the ball is 209 tiles across in
   a 256-tile plot, 82% of the width. That fit is why this is the landmark worth four cells
   and why it is drawn at four rather than squeezed into one.

   THE DRAWING PROBLEM, AND IT IS THE INTERESTING PART. From directly above, a sphere is a
   CIRCLE -- the same silhouette as a disc, a tank, a roundabout. The only thing that says
   BALL is how the light falls off it: a bright cap where the surface faces the sun, falling
   through the family's values to a dark rim where the surface turns away. So this is drawn
   as concentric value bands off an OFF-CENTRE cap, not as a flat circle with an outline.

   WHICH WAY THE SUN IS, MEASURED AND NOT CHOSEN: the approved roof set names roof_hipTL as
   the corner where "the slope cuts in" and roof_hipTR as "the shaded side", so the sun is in
   the NORTH-WEST -- and round 3's sign cook says the same from the other end, "THE SHADOW
   GOES EAST, because every other tile in this game is lit from the same corner". So the cap
   sits north-west of centre and the ground shadow falls south-east.

   AND IT IS A SCREEN, NOT A GOLF BALL. The Exosphere is 1.2 million LED pucks about half a
   metre apart, which at 0.75 m per tile is roughly one per tile. Drawn as a regular dead
   grid over the ball, because a regular grid is what the thing IS -- the desert law's ban on
   shuffle is about GROUND, and this is a manufactured surface where the grid is the point.
   Nothing on it is lit.

   REFERENCE CHECK
     AH-01  THE ANALOG HORROR BIBLE. R1 THE ORDINARY FRAME, ONE WRONG THING: a car park, a
            service road, apartments -- and the largest screen ever built, dark. Name the
            wrong thing in one sentence and the frame passes. R4 THE LIGHT WAS IN THE ROOM:
            the fixture is the sun, the cap is where it lands, and the shadow agrees with
            every other tile in the game. R9 THE MACHINES KEEP TALKING is the hook this
            object was made for and it is NOT drawn here: a surface that still plays
            something on a schedule to an empty valley is behaviour, and this is a tile plan.
            Named for whoever owns it, not quietly taken.
     DIST-02 / CB-07  Learning From Las Vegas, both halves: a Strip plot is SIGN + SHED +
            PARKING IN FRONT and the sign is taller than the building. The Sphere collapses
            all three into one object -- it IS the sign, the shed and the screen -- which is
            the reference's own end point, and the plan is drawn to read that way: one object,
            everything else subordinate.
     BLDG-04  the Strip's three races (pool, sign, porte-cochere). This plot has no pool and
            no porte-cochere in the cell the map gave it, and it does have the service ring
            every venue of this size needs, so that is what is drawn.
     DIST-03  Las Vegas aerial: the real site is the ball, a tight apron, a service ring and
            a loading yard on the far side from the boulevard.
     TG-05   a lot is striped asphalt with seal patches, not a grey rectangle.
     The desert dominance law (Paolo 7/14): one dominant ground at 85%, accents in coherent
            clusters, per-cell shuffle BANNED. Asserted below, and the tool refuses under 80%.

   REUSE CHECK: this draws no pixels. It is a PLAN of legend codes in the game's own planner,
   the same socket the sign and the Stratosphere use; the art is the palette.

   RULE 18: engine/bohemia_landmarks.js is the walked world, so this writes a BANK and a VOTE
   candidate and drops into the engine in one paste when the hold lifts.

       node tools/bohemia_the_biggest_screen_ever_built_cook_9_22_26.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const REPO = path.dirname(__dirname);
const L = require(path.join(REPO, 'engine/bohemia_landmarks.js'));
const OM = require(path.join(REPO, 'engine/bohemia_overmap.js'));

const MARK = '__THE_SPHERE__';
const TILE_M = 0.75;

const SPH_PAL = {
  0:  '#8a7a5e',  // hardpan
  1:  '#3f3d38',  // arterial
  2:  '#9a8a68',  // rock lag
  3:  '#6a6258',  // apron
  4:  '#8f8676',  // bay stripe
  5:  '#55514a',  // service ring
  6:  '#9a958c',  // the ball, the cap the sun lands on
  7:  '#7e7a73',  // the ball, turning away
  8:  '#625f5a',  // the ball, in shade
  9:  '#46443f',  // the ball, the dark rim
  10: '#6b6862',  // the dead grid on the screen: one step off the surface, not a cage
  11: '#2f2b26',  // the shadow on the ground
  12: '#4a4030',  // dead lamp post
  13: '#6e6658',  // plant room
  14: '#7a7264',  // loading yard
  15: '#b09a72',  // kerb
  16: '#15140f',  // the hole in it, and what is behind the screen
  17: '#c4bfb6'   // the torn lip of the hole, where the sun gets in
};

const SPH_LEG = {
  0:  { name: 'hardpan', kind: 'ground', act1: 'baked hardpan, cracked and pale' },
  1:  { name: 'arterial shoulder', kind: 'drive', act1: 'the road running past the north of the plot (car-drivable)' },
  2:  { name: 'rock lag', kind: 'ground', act1: 'a patch of desert gravel the wind left behind', solid: false },
  3:  { name: 'apron', kind: 'drive', act1: 'the paved apron around the ball, cracked and seal-patched (car-drivable)' },
  4:  { name: 'bay stripe', kind: 'ground', act1: 'a parking bay stripe, mostly worn off', solid: false },
  5:  { name: 'service ring', kind: 'drive', act1: 'the service road that goes all the way round it (car-drivable)' },
  6:  { name: 'the screen, sunlit', kind: 'structure', act1: 'the top of the ball, where the sun still lands on it' },
  7:  { name: 'the screen, turning away', kind: 'structure', act1: 'the curve of it, going over' },
  8:  { name: 'the screen, in shade', kind: 'structure', act1: 'the side the sun does not reach' },
  9:  { name: 'the screen, the dark rim', kind: 'structure', act1: 'where the ball meets its own shadow. You cannot tell how far down it goes.' },
  10: { name: 'the dead grid', kind: 'structure', act1: 'the lamps in the screen, a million of them, every one out' },
  11: { name: 'the shadow', kind: 'ground', act1: 'the shadow the ball throws across the apron', solid: false },
  12: { name: 'dead lamp post', kind: 'structure', act1: 'a car park lamp post with nothing in the head' },
  13: { name: 'plant room', kind: 'structure', act1: 'the plant room that used to run the screen' },
  14: { name: 'loading yard', kind: 'drive', act1: 'the loading yard on the back side (car-drivable)' },
  15: { name: 'kerb', kind: 'structure', act1: 'the kerb around the apron' },
  16: { name: 'the hole in it', kind: 'structure', act1: 'a hole punched through the top of the screen. You can see into it and there is nothing in there.' },
  17: { name: 'the torn lip', kind: 'structure', act1: 'the torn edge of the hole, bent up where the sun gets under it' }
};

const SPH_NOTES = {
  summary: 'The Sphere: a 157 m ball wrapped in the largest screen ever built, standing dark on a paved apron with a service road all the way round it. From above it is a circle, and only the way the light falls off it says it is a ball.',
  reference: [
    'The Sphere, Las Vegas, 2023. 112 m tall and 157 m wide, the largest spherical structure in the world, with about 54,000 square metres of exterior LED made of roughly 1.2 million pucks half a metre apart.',
    'Learning From Las Vegas (Venturi and Scott Brown): a Strip plot is SIGN + SHED + PARKING IN FRONT and the sign is taller than the building. This object collapses all three into one, which is that reference\'s own end point.'
  ],
  layout: [
    'THE BALL fills the middle of the four cells: 157 m of it in a 192 m plot, which is why the map gave this one four cells and not one.',
    'THE APRON is a tight paved ring at its foot, with bays marked, off the arterial on the north.',
    'THE SERVICE RING goes all the way round, because a venue this size is serviced from every side.',
    'THE LOADING YARD is on the south, the far side from the road.',
    'Everything else is hardpan with rock-lag patches.'
  ],
  circulation: 'The ARTERIAL (1) is the north edge. The APRON (3) reaches it. The SERVICE RING (5) circles the ball and joins the loading yard (14) on the south. Nothing here is enterable in act one.',
  layering: 'GROUND: hardpan (0), rock lag (2), bay stripes (4), the shadow (11). DRIVE: arterial (1), apron (3), service ring (5), loading yard (14). STRUCTURE (solid): the ball (6,7,8,9), its dead grid (10), the plant room (13), the kerb (15), lamp posts (12).',
  act1: 'A million lamps and not one of them lit. The grid is still there in the surface, which is how you know what it was.',
  not_drawn_here: 'R9 THE MACHINES KEEP TALKING is the hook this object exists for -- a surface that still plays something on a schedule to an empty valley. That is behaviour, not a tile plan, and it belongs to whoever owns the world\'s scheduled emissions. Named rather than quietly taken.'
};

function build(a) {
  const T = (m) => Math.round(m / TILE_M);
  const CX = Math.round((a.X0 + a.X1) / 2);
  const CY = Math.round((a.Y0 + a.Y1) / 2);
  const R  = Math.round(T(157) / 2);               // 157 m across, in tiles

  /* GROUND FIRST AND NOT AS ONE CODE (desert dominance law: patches, never noise). */
  a.rect(a.X0, a.Y0, a.X1, a.Y1, 0);
  a.scatter(0, 2, 30, 5, 16);

  /* THE ARTERIAL IS THE NORTH EDGE -- measured off the map, not chosen. */
  a.rect(a.X0, a.Y0, a.X1, a.fy(0.045), 1);

  /* THE APRON, and the kerb round it. TG-05: bays are marked.

     AND THE BAYS GO IN THE CORNERS, which the first cut got wrong and this tool's own guard
     caught. A 157 m ball with a 9 m service ring round it in a 192 m plot leaves almost
     NOTHING but the four corners: the ring's outer edge reaches within eleven tiles of the
     north arterial. So a rank of bays across the middle of the apron was simply painted
     over by the ball, and the plant room vanished entirely. The corners are the site, and
     that is honest rather than a compromise -- it is what a plot this full actually is. */
  a.rect(a.fx(0.05), a.fy(0.06), a.fx(0.95), a.fy(0.94), 3);
  a.ring(a.fx(0.05), a.fy(0.06), a.fx(0.95), a.fy(0.94), 1, 15);
  for (const [bx0, bx1, by0, by1] of [[0.06, 0.20, 0.08, 0.26], [0.80, 0.94, 0.08, 0.26]]) {
    for (let y = a.fy(by0); y < a.fy(by1); y += 7) a.rect(a.fx(bx0), y, a.fx(bx1), y, 4);
  }
  for (let i = 0; i < 5; i++) {
    a.set(a.fx(0.07), a.fy(0.09) + i * 9, 12);
    a.set(a.fx(0.93), a.fy(0.13) + i * 9, 12);
  }

  /* THE LOADING YARD and THE PLANT ROOM go in the two SOUTH CORNERS, because that is the
     only ground on this plot the ball does not already own.

     *** PAOLO 9/23, ON A THUMBS UP: "The square in the bottom left is clipping ontop bro". ***
     He was right and the cause was the draw order. Round 5 drew these two AFTER the service
     ring so the ring could not eat them -- which meant the yard ATE THE RING instead, and
     its hard square corner ended up butted straight against the curve of the ball with no
     road in between. A flat rectangle jammed into a curved form reads as pasted on top,
     which is exactly the word he used. They go in FIRST now and the ring is drawn over them,
     so the yard's inner edge is cut by the road that belongs there. */
  /* AND REORDERING WAS NOT ENOUGH, WHICH THE RENDER SHOWED AND THE ORDER DID NOT. There is a
     three-tile gap between the ball's edge and the service road's inner kerb, and the yard's
     corner was landing in it -- so the ring was drawn, and the square STILL touched the ball,
     because neither of them owned that gap. A piece of ground on this plot is either inside
     the road or outside it. These two are outside it, so they are clipped to outside it. */
  const SRO = R + T(9);
  const outside = (x0, y0, x1, y1, code) => {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const dx = x - CX, dy = y - CY;
      if (dx * dx + dy * dy >= SRO * SRO) a.set(x, y, code);
    }
  };
  outside(a.fx(0.02), a.fy(0.78), a.fx(0.20), a.fy(0.96), 14);   // the loading yard
  outside(a.fx(0.80), a.fy(0.80), a.fx(0.96), a.fy(0.94), 13);   // the plant room

  /* AND A FLAT BLOCK OF ONE TONE READS AS A SWATCH WHEREVER YOU PUT IT, which is the other
     half of what he was looking at. A real yard has a kerb round it and bays painted on it
     (TG-05), and a plant room has an edge. One tone with a hard border is a colour sample;
     an edge and some marks make it a place. */
  const edge = (x0, y0, x1, y1, code, over) => {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      if (x !== x0 && x !== x1 && y !== y0 && y !== y1) continue;
      const dx = x - CX, dy = y - CY;
      if (dx * dx + dy * dy >= SRO * SRO) a.set(x, y, code);
    }
  };
  edge(a.fx(0.02), a.fy(0.78), a.fx(0.20), a.fy(0.96), 15);
  edge(a.fx(0.80), a.fy(0.80), a.fx(0.96), a.fy(0.94), 15);
  for (let y = a.fy(0.81); y < a.fy(0.95); y += 9) {
    for (let x = a.fx(0.04); x <= a.fx(0.13); x++) {
      const dx = x - CX, dy = y - CY;
      if (dx * dx + dy * dy >= SRO * SRO) a.set(x, y, 4);     // dock bays in the yard
    }
  }

  /* THE SERVICE RING all the way round, because a venue this size is serviced from every
     side (DIST-03). It is a ring of drivable road just outside the ball, and it is what
     separates every one of these pieces from the ball itself. */
  const SR = SRO;
  for (let dy = -SR; dy <= SR; dy++) {
    const o = Math.round(Math.sqrt(Math.max(0, SR * SR - dy * dy)));
    const i2 = Math.round(Math.sqrt(Math.max(0, (SR - T(7)) * (SR - T(7)) - dy * dy)));
    if (o < 1) continue;
    a.rect(CX - o, CY + dy, CX - i2, CY + dy, 5);
    a.rect(CX + i2, CY + dy, CX + o, CY + dy, 5);
  }

  /* THE SHADOW falls SOUTH-EAST, which is where every other tile in this game puts it.
     Drawn BEFORE the ball so the ball sits on its own shadow. A sphere's shadow is an
     ellipse offset from its foot, not a ring around it. */
  const SOX = T(34), SOY = T(26);
  for (let dy = -R; dy <= R; dy++) {
    const hw = Math.round(Math.sqrt(Math.max(0, R * R - dy * dy)));
    if (hw < 1) continue;
    a.rect(CX + SOX - hw, CY + SOY + Math.round(dy * 0.82), CX + SOX + hw,
           CY + SOY + Math.round(dy * 0.82), 11);
  }

  /* THE BALL. From above a sphere is a circle, and the ONLY thing that says it is a ball
     rather than a disc is how the light falls off it. So: concentric bands off an
     OFF-CENTRE cap. The sun is north-west (roof_hipTL is the lit corner, roof_hipTR the
     shaded one, and round 3's shadow goes east), so the cap sits north-west of centre and
     the surface darkens away from it through the family's values to a dark rim. */
  const LX = CX - Math.round(R * 0.34), LY = CY - Math.round(R * 0.34);
  const BANDS = [[0.34, 6], [0.62, 7], [0.86, 8], [1.00, 9]];
  for (let dy = -R; dy <= R; dy++) {
    const hw = Math.round(Math.sqrt(Math.max(0, R * R - dy * dy)));
    for (let dx = -hw; dx <= hw; dx++) {
      const x = CX + dx, y = CY + dy;
      /* distance from the lit cap, normalised so the far rim is 1 */
      const d = Math.sqrt((x - LX) * (x - LX) + (y - LY) * (y - LY)) / (R * 1.62);
      let code = 9;
      for (const [lim, c] of BANDS) { if (d <= lim) { code = c; break; } }
      a.set(x, y, code);
    }
  }

  /* *** THE HOLE IN IT. PAOLO 9/23, SAME THUMB: "maybe theres a tiny hole in the roof if u
     could make that look good". ***
     A hole in a screen is not a circle cut out of it. An LED wall is panels on a frame, so
     when one lets go it takes a panel-shaped bite and the edge TEARS -- straight along the
     lattice on two sides, ragged where the skin gave. So: a small panel-sized bite near the
     top of the ball, north-west of the crown where the sun still lands, its inside the
     darkest tone on the plot because there is nothing behind a screen but the frame, and a
     torn lip on the sun side where the peeled skin bends up and catches the light. The lip
     follows the same rule every mark in this game follows: open ground to the north or west
     means the sun is on it.
     It is about 8 m across on a 157 m ball, which is a twentieth of it: a tiny hole, his
     word, and the one wrong thing in an ordinary frame (R1). */
  const HR2 = Math.max(4, T(6));
  const HX = CX - Math.round(R * 0.30), HY = CY - Math.round(R * 0.46);
  const inHole = (x, y) => {
    const dx = x - HX, dy = y - HY;
    /* a bite, not a disc: squarer along the lattice, ragged on the low side */
    const rag = 1 + 0.30 * Math.sin((x * 2.7 + y * 1.9) * 0.9);
    return Math.max(Math.abs(dx) * 1.0, Math.abs(dy) * 1.15) <= HR2 * rag;
  };
  for (let dy = -HR2 * 2; dy <= HR2 * 2; dy++) {
    for (let dx = -HR2 * 2; dx <= HR2 * 2; dx++) {
      const x = HX + dx, y = HY + dy;
      if ((x - CX) * (x - CX) + (y - CY) * (y - CY) > R * R) continue;   // stay on the ball
      if (!inHole(x, y)) continue;
      const lip = !inHole(x, y - 1) || !inHole(x - 1, y);
      a.set(x, y, lip ? 17 : 16);
    }
  }

  /* THE DEAD GRID, AND THE FIRST ONE WAS A CAGE. Drawn as continuous lines every six
     tiles in a dark tone it read as chicken wire thrown over a ball: the grid shouted and
     the ball whispered, which is backwards. A puck is a POINT, not a line, and from 192 m
     away a million of them read as TEXTURE. So: dots on a five-tile lattice in a tone one
     step off the surface they sit on, which says "this is a made surface, and it is a
     screen" without becoming the subject. Not one of them is lit. */
  for (let dy = -R; dy <= R; dy += 5) {
    const hw = Math.round(Math.sqrt(Math.max(0, R * R - dy * dy)));
    for (let dx = -hw; dx <= hw; dx += 5) {
      /* offset every other row, the way a real panel lattice is laid */
      const ox = ((dy / 5) & 1) ? 2 : 0;
      const x = CX + dx + ox;
      if ((x - CX) * (x - CX) + dy * dy > R * R) continue;
      if (inHole(x, CY + dy)) continue;        // no pucks where the panel is gone
      a.set(x, CY + dy, 10);
    }
  }
}

function main() {
  const m = OM.buildOvermap(12345);
  const cells = m.tiles.filter(t => t.district === 'sphere');
  if (cells.length !== 4) {
    console.log('REFUSED: the map gives sphere ' + cells.length + ' cells, not 4. This plan is '
      + 'drawn for the 2x2 the map reserved; do not squeeze it.'); process.exit(1);
  }
  const xs = cells.map(c => c.x), ys = cells.map(c => c.y);
  const b = { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
  console.log('sphere at %d,%d..%d,%d  (%d x %d cells = %d x %d m).  the ring around it:',
    b.x0, b.y0, b.x1, b.y1, b.x1 - b.x0 + 1, b.y1 - b.y0 + 1,
    (b.x1 - b.x0 + 1) * 96, (b.y1 - b.y0 + 1) * 96);
  let north = [];
  for (let y = b.y0 - 1; y <= b.y1 + 1; y++) {
    const row = [];
    for (let x = b.x0 - 1; x <= b.x1 + 1; x++) { const c = m.at(x, y); row.push(c && c.district); }
    if (y === b.y0 - 1) north = row;
    console.log('    ' + row.map(s => String(s).padEnd(11)).join(' '));
  }
  if (north.indexOf('arterial') < 0) {
    console.log('REFUSED: this plan fronts the NORTH arterial and the map no longer puts one there.');
    process.exit(1);
  }

  /* FOUR CELLS, ONE PLAN. The planner hands each cell the whole blob's bounds and silently
     drops anything outside that cell, so the seams line up by construction. */
  const cellGrids = {};
  for (let cy = b.y0; cy <= b.y1; cy++) for (let cx = b.x0; cx <= b.x1; cx++) {
    cellGrids[cx + ',' + cy] = L.plan(0x5983e12e, { cellX: cx, cellY: cy, bounds: b },
      (a) => { a.rect(a.X0, a.Y0, a.X1, a.Y1, 0); build(a); });
  }

  const used = {};
  let total = 0;
  for (const k in cellGrids) for (const row of cellGrids[k]) for (const v of row) {
    used[v] = (used[v] || 0) + 1; total++;
  }
  const miss = Object.keys(used).filter(k => !(k in SPH_LEG));
  if (miss.length) { console.log('REFUSED: codes with no legend entry: ' + miss.join(',')); process.exit(1); }
  const unused = Object.keys(SPH_LEG).filter(k => !(k in used));
  if (unused.length) { console.log('REFUSED: legend entries nothing draws: ' + unused.join(',')); process.exit(1); }

  const pad = (s, n) => (s + ' '.repeat(n)).slice(0, n);
  console.log('\nWHAT THE PLOT IS MADE OF (%d tiles across four cells, one tile = 0.75 m):', total);
  Object.keys(used).map(Number).sort((x, y) => used[y] - used[x]).forEach(k => {
    console.log('   ' + pad(SPH_LEG[k].name, 26) + (100 * used[k] / total).toFixed(2) + '%');
  });
  const ball = [6, 7, 8, 9, 10].reduce((n, k) => n + (used[k] || 0), 0);
  console.log('   ' + pad('THE BALL, all of it', 26) + (100 * ball / total).toFixed(2) +
    '%  (157 m across a 192 m plot: 82% of the width, which is why this one got four cells)');
  const desert = (used[0] || 0) + (used[2] || 0);
  const dom = 100 * (used[0] || 0) / desert;
  console.log('   ' + pad('open desert', 26) + (100 * desert / total).toFixed(2) +
    '%  (' + dom.toFixed(0) + '% one dominant ground)');
  if (dom < 80) {
    console.log('REFUSED: the desert dominance law (Paolo 7/14) wants one dominant at 85%.');
    process.exit(1);
  }
  /* THE GRID MUST READ AS TEXTURE, NOT AS THE SUBJECT. The first cut drew it as continuous
     lines and it took 16% of the plot and looked like a cage over a ball. Dots on a lattice
     are a few per cent; if this ever climbs back the cage is back. */
  const gridShare = 100 * (used[10] || 0) / ball;
  console.log('   ' + pad('the grid, as a share of the ball', 34) + gridShare.toFixed(1) + '%');
  if (gridShare > 12) {
    console.log('REFUSED: the dead grid is ' + gridShare.toFixed(0) + '% of the ball. Drawn as ' +
      'lines it was a cage; dots on a lattice are texture. Keep it under 12%.');
    process.exit(1);
  }

  const doc = {
    version: 'BOHEMIA_THE_SPHERE_v1', built: '2026-09-22',
    lane: 'COOK [fortress buildings] round 5', mark: MARK, bounds: b,
    why: 'the overmap names seven singular Las Vegas landmarks and nothing could build them. The sign went in round 3, the Stratosphere in round 4. This is the Sphere, and it is the only one the map gives four cells -- 157 m of ball in a 192 m plot.',
    not_shipped: 'rule 18: engine/bohemia_landmarks.js is the walked world, so this is a bank and a VOTE candidate. It drops into the engine in one paste when the hold lifts.',
    palette: SPH_PAL, legend: SPH_LEG, notes: SPH_NOTES,
    coverage: Object.fromEntries(Object.keys(used).map(k => [SPH_LEG[k].name, +(100 * used[k] / total).toFixed(2)])),
    grid_share_of_ball: +gridShare.toFixed(1),
    build_source: build.toString()
  };
  const out = path.join(REPO, 'banks/BOHEMIA_THE_SPHERE_9_22_26.txt');
  fs.writeFileSync(out, JSON.stringify(doc));
  const back = JSON.parse(fs.readFileSync(out, 'utf8'));
  if (!back.build_source || Object.keys(back.legend).length !== Object.keys(SPH_LEG).length) {
    console.log('REFUSED: read-back failed'); process.exit(1);
  }
  console.log('\nwrote banks/BOHEMIA_THE_SPHERE_9_22_26.txt  (' +
    (fs.statSync(out).size / 1024).toFixed(0) + ' KB)');
  fs.writeFileSync('/tmp/sphere_grid.json',
    JSON.stringify({ cells: cellGrids, b, pal: SPH_PAL, leg: SPH_LEG }));

  /* THE CARD IS BUILT HERE NOW. Round 5's was assembled by hand outside this tool, so it
     could not be rebuilt and could silently disagree with the bank it illustrates -- which
     matters the moment the plan changes, as it just did. One renderer, the same grid. */
  const T2 = cellGrids[Object.keys(cellGrids)[0]].length;
  const W = (b.x1 - b.x0 + 1) * T2, H = (b.y1 - b.y0 + 1) * T2;
  const MAG = 4;
  const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16),
                      parseInt(h.slice(5, 7), 16)];
  const buf = Buffer.alloc(W * MAG * H * MAG * 3);
  for (let y = 0; y < H * MAG; y++) for (let x = 0; x < W * MAG; x++) {
    const vy = (y / MAG) | 0, vx = (x / MAG) | 0;
    const g = cellGrids[(b.x0 + ((vx / T2) | 0)) + ',' + (b.y0 + ((vy / T2) | 0))];
    const c = hex(SPH_PAL[g[vy % T2][vx % T2]] || '#000000');
    const i = (y * W * MAG + x) * 3;
    buf[i] = c[0]; buf[i + 1] = c[1]; buf[i + 2] = c[2];
  }
  const os = require('os');
  const ppm = path.join(os.tmpdir(), 'sphere_plan.ppm');
  fs.writeFileSync(ppm, Buffer.concat([
    Buffer.from('P6\n' + (W * MAG) + ' ' + (H * MAG) + '\n255\n', 'ascii'), buf]));
  const job = {
    ppm, out: path.join(REPO, 'slices/vote/COOK_THE_HOLE_IN_THE_SCREEN.png'),
    title: 'THE HOLE IN THE SCREEN',
    sub: 'both the things you said, done: the square is off the ball and there is a hole in it',
    legend: [16, 17, 6, 9, 10, 14, 15, 5, 11, 13].map(k => [SPH_PAL[k], SPH_LEG[k].name]),
    foot: ['You said the square in the bottom left was clipping on top. It was: it had eaten '
           + 'the service road and was sitting straight against the ball.',
           'It is outside the road now, its corner is cut by the curve, and it has a kerb and '
           + 'loading bays so it reads as a yard instead of a grey block.',
           'And you asked for a tiny hole in the roof. It is 12 m across on a 157 m ball, torn '
           + 'along the panel lines, with the sun catching the lip and nothing behind it.'],
    pad: 26
  };
  fs.writeFileSync(path.join(os.tmpdir(), 'sphere_card.json'), JSON.stringify(job));
  const r = require('child_process').spawnSync('python3',
    [path.join(REPO, 'tools/bohemia_landmark_card.py'), path.join(os.tmpdir(), 'sphere_card.json')],
    { encoding: 'utf8' });
  process.stdout.write(r.stdout || ''); process.stderr.write(r.stderr || '');
  if (r.status !== 0) { console.log('REFUSED: the card did not render'); process.exit(1); }
}

main();
