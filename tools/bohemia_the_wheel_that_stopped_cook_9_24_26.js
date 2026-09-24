/* ============================================================================
   THE WHEEL THAT STOPPED  (COOK, 9/24/26, [fortress buildings] round 6 / [seven landmarks])

   THE FIGHT VERDICT round 7 is rule 13's honest sentence: the fight picture could not be
   judged on the glass this round, the standing chrome list is unchanged, and all of it is
   UI [fight hud]. Nothing on it is COOK's. Rule 22 says a making lane cooks anyway, so this
   round goes to this lane's own row, the same one rounds 3, 4 and 5 went to.

   [seven landmarks]: the overmap names seven singular Las Vegas landmarks and nothing could
   build them. Round 3 drew the Welcome sign, round 4 the Stratosphere, round 5 the Sphere.
   FOUR LEFT, and this is the HIGH ROLLER, next in tier order because the map puts it at
   55,46, one cell south of the Sphere at 56,42, on the same walk.

   MEASURED OFF A GENERATED MAP BEFORE A LINE WAS DRAWN (MAP LAW). `highroller` gets ONE
   cell, 55,46, 96 x 96 m, and its ring reads:

        arterial    arterial    arterial
        resort      HIGHROLLER  commercial
        resort      suburb      suburb

   Arterial the WHOLE north edge, resort west and south-west, commercial east, suburb south.
   So the plot fronts north and the drivable-access law is served off the arterial it has.

   *** AND THE MEASUREMENT IS THE WHOLE DESIGN: IT DOES NOT FIT. *** The rim is 469 ft, 143
   metres, in a 96 metre cell. One tile is 0.75 m, so the wheel is 190 tiles across a
   128-tile plot: HALF AS WIDE AGAIN AS THE GROUND IT STANDS ON. The Sphere got four cells
   because 157 m fits inside 192. This one got one cell and does not fit inside anything,
   and the honest plan is not a shrunken wheel -- it is the FEET of something too big for
   its own plot, with the rim running off both edges. That is also what the real site is.

   THE SECOND MEASUREMENT IS THE DRAWING. From straight above, a vertical wheel is not a
   circle. It is a LINE. Every point of the rim projects onto one east-west line through the
   hub, so a 143 m ring collapses to a 190-tile stripe about five tiles thick -- and the
   twenty-eight cabins, spaced evenly around the rim, DO NOT LAND EVENLY ON IT. Their
   spacing is cos-of-the-angle, so they crowd at the two ends and spread out in the middle.
   That crowding is the only thing in the frame that says the stripe is a circle standing on
   edge, so it is measured here rather than eyeballed, and the tool refuses if it goes away.

   AND THE RIM NEVER TOUCHES THE GROUND. Top 167.6 m, rim 143 m across, so the hub sits at
   96 m and the bottom of the rim hangs 24.6 m in the air between the legs. Nothing about
   this object rests on the plot except four leg feet and one brace.

   THE SHADOW IS THE PICTURE. A ring's shadow is a ring, and this one is a vertical ring, so
   its shadow is a long shallow loop lying across the ground south-east of the feet, with
   twenty-eight beads on it. Offset taken from the Sphere's own numbers (a 112 m ball throws
   its shadow 34 m east and 26 m south) rather than a new sun invented here, because the sun
   in this game is one sun: north-west, the corner roof_hipTL is lit from, and round 3's
   words, "THE SHADOW GOES EAST".

   REFERENCE CHECK
     TRK-04 is not cited here and that is deliberate: this is a plan, not a mark.
     AH-01  THE ANALOG HORROR BIBLE. R1 THE ORDINARY FRAME, ONE WRONG THING: a car park, a
            service apron, a road -- and a wheel the size of a district, stopped, with
            twenty-eight glass balls hanging off it. The wrong thing names itself in one
            sentence. R3 THE LONG HOLD: a stopped wheel is a still fact, and the shadow is
            the only evidence of its shape. R4 THE LIGHT WAS IN THE ROOM: one sun, the same
            one every tile in this game uses, and the shadow agrees with the Sphere's.
     BLDG-05 the structural sanity list. Taken whole and it is what changed the drawing:
            Arup's four inclined legs, 2.8 m in diameter, plus ONE transverse brace founded
            ACROSS THE ROAD; the rim held in compression by 112 cable spokes like a bicycle
            wheel; 28 spherical cabins on the OUTSIDE of the rim. Four feet and a brace are
            the entire ground contact, so four feet and a brace are the entire ground plan.
     DIST-02 / CB-07  Learning From Las Vegas, both halves: a Strip plot is SIGN + SHED +
            PARKING IN FRONT and the sign is taller than the building. Here the sign is 167 m
            and there is essentially no shed at all -- a boarding platform under the hub --
            so the plan reads WHEEL FIRST and everything else is subordinate, the same call
            round 4 made for the Stratosphere.
     DIST-03  Las Vegas aerial: the real site is the wheel, a tight apron, a service lane and
            a boarding hall tucked under it, hemmed in on every side.
     TG-05   a lot is striped asphalt with seal patches, not a grey rectangle. Bays marked.
     The desert dominance law (Paolo 7/14): one dominant ground at 85%, accents in coherent
            clusters, per-cell shuffle BANNED. Asserted below; the tool refuses under 80%.

   REUSE CHECK: this draws no pixels of its own. It is a PLAN of legend codes in the game's
   own planner, the same socket the sign, the Stratosphere and the Sphere use, and the art is
   the palette. The card renderer is new and lives here so the picture is rebuildable.

   RULE 18: engine/bohemia_landmarks.js is the walked world, so this writes a BANK and a VOTE
   candidate and drops into the engine in one paste when the hold lifts.

       node tools/bohemia_the_wheel_that_stopped_cook_9_24_26.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const REPO = path.dirname(__dirname);
const L = require(path.join(REPO, 'engine/bohemia_landmarks.js'));
const OM = require(path.join(REPO, 'engine/bohemia_overmap.js'));

const MARK = '__THE_WHEEL_THAT_STOPPED__';
const TILE_M = 0.75;

/* THE REAL NUMBERS, and every one of them is used below. */
const RIM_M   = 143.0;   // 469 ft, the rim's diameter
const TOP_M   = 167.6;   // the top of the wheel
const HUB_M   = TOP_M - RIM_M / 2;         // 96.1 m: the axle
const FOOT_M  = 24.6;                      // TOP_M - RIM_M: the rim hangs this far up
const CABINS  = 28;
const LEG_D_M = 2.8;     // each of the four inclined legs

const HR_PAL = {
  0:  '#8a7a5e',  // hardpan
  1:  '#3f3d38',  // arterial
  2:  '#9a8a68',  // rock lag
  3:  '#6a6258',  // apron
  4:  '#8f8676',  // bay stripe
  5:  '#a7a29a',  // the rim at the top of its arc, where the sun is still on it
  6:  '#8b8780',  // the rim coming over
  7:  '#6d6a65',  // the rim out at the axle's own height
  8:  '#b9b4ab',  // a cabin
  9:  '#5a5751',  // the hub
  10: '#77706a',  // a leg
  11: '#655e58',  // the brace leg, planted on the far side of the road
  12: '#2f2b26',  // the shadow of the wheel
  13: '#221f1b',  // the shadow of a cabin
  14: '#7e7668',  // the boarding platform
  15: '#b09a72'   // kerb
};

const HR_LEG = {
  0:  { name: 'hardpan', kind: 'ground', act1: 'baked hardpan, cracked and pale' },
  1:  { name: 'arterial shoulder', kind: 'drive', act1: 'the road running past the north of the plot (car-drivable)' },
  2:  { name: 'rock lag', kind: 'ground', act1: 'a patch of desert gravel the wind left behind', solid: false },
  3:  { name: 'apron', kind: 'drive', act1: 'the paved apron under the wheel, cracked and seal-patched (car-drivable)' },
  4:  { name: 'bay stripe', kind: 'ground', act1: 'a parking bay stripe, mostly worn off', solid: false },
  5:  { name: 'the rim, at the top', kind: 'structure', act1: 'the top of the wheel, 167 m up, still catching the sun' },
  6:  { name: 'the rim, coming over', kind: 'structure', act1: 'the rim on its way down, still 160 m up' },
  7:  { name: 'the rim, leaving the plot', kind: 'structure', act1: 'the rim still 149 m up where it crosses the edge of its own ground. It does not come down to the axle until it is out over the next block.' },
  8:  { name: 'a cabin', kind: 'structure', act1: 'one of the twenty-eight glass balls. Nothing moves in it.' },
  9:  { name: 'the hub', kind: 'structure', act1: 'the axle, 96 m up, with 112 cables coming off it' },
  10: { name: 'a leg', kind: 'structure', act1: 'one of the four legs, 2.8 m through, leaning in to carry the axle' },
  11: { name: 'the brace leg', kind: 'structure', act1: 'the brace leg, with its foot planted on the far side of the road' },
  12: { name: 'the shadow of the wheel', kind: 'ground', act1: 'a ring of shadow lying across the ground. It is the only way to see the shape of the thing above you.', solid: false },
  13: { name: 'the shadow of a cabin', kind: 'ground', act1: 'a dark bead in the ring of shadow', solid: false },
  14: { name: 'the boarding platform', kind: 'structure', act1: 'the hall you used to board from, under the lowest point of the wheel' },
  15: { name: 'kerb', kind: 'structure', act1: 'the kerb around the apron' }
};

function build(a) {
  const T = (m) => Math.round(m / TILE_M);
  const CX = Math.round((a.X0 + a.X1) / 2);
  const CY = Math.round((a.Y0 + a.Y1) / 2);
  const R  = T(RIM_M / 2);                       // 95 tiles: the rim's radius

  /* THE SUN, TAKEN FROM THE SPHERE AND NOT REINVENTED. A 112 m ball there throws its shadow
     34 m east and 26 m south, so a point h metres up lands 0.304h east and 0.232h south. */
  const SHX = (h) => T(0.304 * h), SHY = (h) => T(0.232 * h);

  /* GROUND FIRST AND NOT AS ONE CODE (desert dominance law: patches, never noise). */
  a.rect(a.X0, a.Y0, a.X1, a.Y1, 0);
  a.scatter(0, 2, 26, 5, 14);

  /* THE ARTERIAL IS THE NORTH EDGE -- measured off the map, not chosen. */
  a.rect(a.X0, a.Y0, a.X1, a.fy(0.045), 1);

  /* THE APRON and its kerb. TG-05: bays are marked, in the two strips the wheel's own line
     does not already own. */
  a.rect(a.fx(0.06), a.fy(0.08), a.fx(0.94), a.fy(0.93), 3);
  a.ring(a.fx(0.06), a.fy(0.08), a.fx(0.94), a.fy(0.93), 1, 15);
  for (const [by0, by1] of [[0.11, 0.30], [0.72, 0.90]]) {
    for (let y = a.fy(by0); y < a.fy(by1); y += 8) {
      a.rect(a.fx(0.08), y, a.fx(0.30), y, 4);
      a.rect(a.fx(0.70), y, a.fx(0.92), y, 4);
    }
  }

  /* THE SHADOW, DRAWN FIRST so everything stands on it. A RING'S SHADOW IS A RING. Each rim
     point is at x = CX + R cos t, at height HUB_M + (R in metres) sin t, on the one line
     y = CY -- so the shadow is a long shallow loop, not a circle and not a blob. */
  const shadowAt = (t) => [
    CX + Math.round(R * Math.cos(t)) + SHX(HUB_M + (RIM_M / 2) * Math.sin(t)),
    CY + SHY(HUB_M + (RIM_M / 2) * Math.sin(t))
  ];
  const STEPS = 1400;
  for (let i = 0; i < STEPS; i++) {
    const [sx, sy] = shadowAt(2 * Math.PI * i / STEPS);
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) a.set(sx + dx, sy + dy, 12);
  }
  /* the twenty-eight beads */
  const CAB_R = T(3.2);
  for (let k = 0; k < CABINS; k++) {
    const [sx, sy] = shadowAt(2 * Math.PI * k / CABINS);
    for (let dy = -CAB_R; dy <= CAB_R; dy++) for (let dx = -CAB_R; dx <= CAB_R; dx++)
      if (dx * dx + dy * dy <= CAB_R * CAB_R) a.set(sx + dx, sy + dy, 13);
  }

  /* THE BOARDING PLATFORM sits under the lowest point of the rim, which from above is the
     same place as the hub, because the top and the bottom of a vertical circle project onto
     one point. So the hall is in the middle and the wheel passes through its roof line. */
  a.rect(CX - T(17), CY - T(11), CX + T(17), CY + T(11), 14);

  /* THE FOUR LEGS. Feet splayed north and south of the axle, leaning in to a hub at 96 m.
     Drawn under the rim because at the line they cross, the rim is 167 m up and they are
     not. BLDG-05: 2.8 m through, which is four tiles. */
  const LW = Math.max(2, T(LEG_D_M));
  const FOOT_Y = T(45), FOOT_X = T(6);
  const feet = [[CX - FOOT_X, CY - FOOT_Y], [CX + FOOT_X, CY - FOOT_Y],
                [CX - FOOT_X, CY + FOOT_Y], [CX + FOOT_X, CY + FOOT_Y]];
  for (const [fx, fy] of feet) {
    const n = Math.max(Math.abs(fx - CX), Math.abs(fy - CY));
    for (let i = 0; i <= n; i++) {
      const x = Math.round(fx + (CX - fx) * i / n), y = Math.round(fy + (CY - fy) * i / n);
      for (let dy = -LW / 2; dy <= LW / 2; dy++) for (let dx = -LW / 2; dx <= LW / 2; dx++)
        a.set(Math.round(x + dx), Math.round(y + dy), 10);
    }
  }

  /* THE BRACE LEG, ACROSS THE ROAD. Arup's one transverse brace is founded on the far side
     of the boulevard, which is the single strangest true fact about this object and the
     reason the plot fronts north. It runs from the north pair out past the arterial. */
  for (let y = a.Y0; y <= CY - FOOT_Y; y++) {
    for (let dx = -LW / 2; dx <= LW / 2; dx++) a.set(Math.round(CX + dx), y, 11);
  }

  /* THE RIM. From straight above it is a LINE, five tiles thick, and its height along that
     line is the top of the arc: 167.6 m in the middle falling to the axle's 96 m at the two
     ends. So the value runs bright in the middle and darker out to the ends -- the opposite
     way round from anything that is lying flat, which is the tell that it is standing up.

     AND THE BANDS ARE SET ON WHAT IS VISIBLE, which this tool's own guard caught: it
     refused because codes 6 and 7 were never drawn. The reason is worth keeping -- the rim
     only falls from 167.6 m to about 149 m before it leaves the plot at both edges, so
     EVERY PART OF THIS WHEEL YOU CAN SEE FROM ITS OWN GROUND IS NEAR THE TOP OF THE ARC.
     It does not reach the axle's 96 m until it is out over the resort and the commercial
     block. Banding across the 96-167 m range put all three tones off the plot and left one
     flat stripe on it. */
  const RIM_T = Math.max(2, Math.round(T(5) / 2));
  const zAt = (dx) => HUB_M + (RIM_M / 2) * Math.sqrt(Math.max(0, 1 - (dx / R) * (dx / R)));
  const zEdge = zAt(Math.round(a.W / 2));              // the height at the plot's own edge
  for (let dx = -R; dx <= R; dx++) {
    const z = zAt(dx);
    const f = (TOP_M - z) / Math.max(1, TOP_M - zEdge); // 0 at the very top, 1 at the edge
    const code = f < 0.34 ? 5 : (f < 0.72 ? 6 : 7);
    for (let dy = -RIM_T; dy <= RIM_T; dy++) a.set(CX + dx, CY + dy, code);
  }

  /* THE CABINS, AND THE CROWDING IS THE POINT. Twenty-eight of them evenly spaced round the
     rim land on the line at x = CX + R cos t, which bunches them at the ends and spreads
     them in the middle. Only the top half is visible: the bottom fourteen are directly
     under them. */
  for (let k = 0; k < CABINS; k++) {
    const t = Math.PI * k / (CABINS / 2);
    if (Math.sin(t) < 0) continue;                     // the hidden half
    const x = CX + Math.round(R * Math.cos(t));
    for (let dy = -CAB_R; dy <= CAB_R; dy++) for (let dx = -CAB_R; dx <= CAB_R; dx++)
      if (dx * dx + dy * dy <= CAB_R * CAB_R) a.set(x + dx, CY + dy, 8);
  }

  /* THE HUB last, because from above it is the nearest thing to the sky on this plot. */
  const HR = T(5);
  for (let dy = -HR; dy <= HR; dy++) for (let dx = -HR; dx <= HR; dx++)
    if (dx * dx + dy * dy <= HR * HR) a.set(CX + dx, CY + dy, 9);
}

function main() {
  const m = OM.buildOvermap(12345);
  const cells = m.tiles.filter(t => t.district === 'highroller');
  if (cells.length !== 1) {
    console.log('REFUSED: the map gives highroller ' + cells.length + ' cells, not 1. This plan '
      + 'is drawn for the single cell the map reserved.'); process.exit(1);
  }
  const b = { x0: cells[0].x, x1: cells[0].x, y0: cells[0].y, y1: cells[0].y };
  console.log('highroller at %d,%d  (1 cell = 96 x 96 m).  the ring around it:', b.x0, b.y0);
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

  const grid = L.plan(0x4187cc31, { cellX: b.x0, cellY: b.y0, bounds: b },
    (a) => { a.rect(a.X0, a.Y0, a.X1, a.Y1, 0); build(a); });

  const used = {};
  let total = 0;
  for (const row of grid) for (const v of row) { used[v] = (used[v] || 0) + 1; total++; }
  const miss = Object.keys(used).filter(k => !(k in HR_LEG));
  if (miss.length) { console.log('REFUSED: codes with no legend entry: ' + miss.join(',')); process.exit(1); }
  const unused = Object.keys(HR_LEG).filter(k => !(k in used));
  if (unused.length) { console.log('REFUSED: legend entries nothing draws: ' + unused.join(',')); process.exit(1); }

  const pad = (s, n) => (s + ' '.repeat(n)).slice(0, n);
  console.log('\nWHAT THE PLOT IS MADE OF (%d tiles in one cell, one tile = 0.75 m):', total);
  Object.keys(used).map(Number).sort((x, y) => used[y] - used[x]).forEach(k => {
    console.log('   ' + pad(HR_LEG[k].name, 30) + (100 * used[k] / total).toFixed(2) + '%');
  });

  /* GUARD 1: IT MUST NOT FIT. The whole design is that a 143 m wheel stands on 96 m of
     ground. If a later hand shrinks it to fit, that is the drawing gone, so measure the
     overhang and refuse if it closes. */
  const rimTiles = 2 * Math.round((RIM_M / 2) / TILE_M) + 1;
  const cellTiles = grid[0].length;
  const off = 100 * (rimTiles - cellTiles) / rimTiles;
  /* console.log does NOT do printf precision: %.1f prints as the literal string. Learned
     the hard way in this lane already, so every number below is toFixed'd into the text. */
  console.log('\n   the rim is ' + rimTiles + ' tiles across a ' + cellTiles + ' tile plot: '
    + off.toFixed(0) + '% OF THE WHEEL IS OFF ITS OWN GROUND, running past both edges.');
  if (off < 20) {
    console.log('REFUSED: the wheel now fits the plot. It is 143 m in a 96 m cell and the plan '
      + 'is the feet of something too big; a wheel that fits is a different object.');
    process.exit(1);
  }

  /* GUARD 2: THE CROWDING IS THE ONLY THING THAT SAYS IT IS A CIRCLE. Cabins evenly spaced
     round a rim are NOT evenly spaced once projected. Measure the gap between the outermost
     visible pair against the gap across the middle. */
  const R = Math.round((RIM_M / 2) / TILE_M);
  const xs = [];
  for (let k = 0; k < CABINS; k++) {
    const t = Math.PI * k / (CABINS / 2);
    if (Math.sin(t) < 0) continue;
    xs.push(R * Math.cos(t));
  }
  xs.sort((p, q) => p - q);
  const gaps = xs.slice(1).map((v, i) => Math.abs(v - xs[i]));
  const edge = Math.min(gaps[0], gaps[gaps.length - 1]);
  const mid = gaps[Math.floor(gaps.length / 2)];
  console.log('   ' + xs.length + ' cabins are visible from above and across the WHOLE wheel '
    + 'they are not evenly spaced: ' + edge.toFixed(1) + ' tiles apart at the ends against '
    + mid.toFixed(1) + ' across the middle, ' + (mid / edge).toFixed(1) + 'x.');
  if (mid / edge < 3) {
    console.log('REFUSED: the cabins no longer crowd at the ends, so the stripe has stopped '
      + 'being a circle standing on edge.'); process.exit(1);
  }

  /* *** AND THE GUARD ABOVE MEASURES THE WHEEL, NOT THE PICTURE, WHICH I ONLY SAW BY
     LOOKING AT THE RENDER. *** It reports 8.9x crowding and passes, while on the card the
     cabins look evenly spaced -- because the crowded ones are the ones that fell off the
     plot. Inside this cell only the seven nearest the top are visible and their spacing is
     almost flat. That is the honest fact and it is a better one: THE CABINS YOU CAN STAND
     UNDER ARE THE SPREAD-OUT ONES. The bunched ends are out over the resort and the
     commercial block. Fourteenth time in this lane that a clean number measured the wrong
     surface, and the picture is what caught it. */
  const half = Math.floor(cellTiles / 2);
  const inXs = xs.filter(v => Math.abs(v) <= half);
  const inGaps = inXs.slice(1).map((v, i) => Math.abs(v - inXs[i]));
  const inRatio = Math.max(...inGaps) / Math.min(...inGaps);
  console.log('   but only ' + inXs.length + ' of them land inside the cell, and THOSE are '
    + 'nearly evenly spaced (' + inRatio.toFixed(2) + 'x), because they are all near the top '
    + 'of the arc. The bunched ends are off the plot.');
  if (inRatio > 1.6) {
    console.log('REFUSED: the card would show crowding it should not. Something moved the '
      + 'cabins or the plot.'); process.exit(1);
  }

  /* GUARD 3: the desert dominance law. */
  const desert = (used[0] || 0) + (used[2] || 0);
  const dom = 100 * (used[0] || 0) / desert;
  console.log('   open desert ' + (100 * desert / total).toFixed(2) + '% of the plot, '
    + dom.toFixed(0) + '% of it one dominant ground');
  if (dom < 80) {
    console.log('REFUSED: the desert dominance law (Paolo 7/14) wants one dominant at 85%.');
    process.exit(1);
  }

  /* GUARD 4: THE THING ON THE GROUND IS FOUR FEET AND A BRACE. The rim never touches the
     plot -- it hangs 24.6 m up -- so if the structure's ground contact ever grows into a
     footprint, somebody has quietly stood the wheel on the dirt. */
  const contact = 100 * ((used[10] || 0) + (used[11] || 0) + (used[14] || 0)) / total;
  console.log('   everything this object actually rests on (four legs, one brace, the '
    + 'boarding hall) is ' + contact.toFixed(2) + '% of the plot. The rim hangs ' + FOOT_M
    + ' m up and touches nothing.');
  if (contact > 20) {
    console.log('REFUSED: the ground contact is ' + contact.toFixed(0) + '% of the plot. This '
      + 'object stands on four legs and a brace, not on a base.'); process.exit(1);
  }

  const notes = {
    summary: 'The High Roller: a 143 m wheel standing on four legs in a 96 m plot, so it runs off its own ground at both ends. From straight above a vertical wheel is not a circle, it is a line, and the twenty-eight cabins crowd at the ends of that line. The rim hangs 24.6 m in the air and touches nothing. The shadow is the only place you can see the shape of it.',
    reference: [
      'The High Roller, Las Vegas, 2014. 167.6 m tall, a 469 ft (143 m) rim assembled from 28 bolted segments and held in compression by 112 locked-coil cable spokes like a bicycle wheel, carried on four inclined legs 2.8 m in diameter plus one transverse brace leg founded across the road, with 28 spherical cabins on the outside of the rim.',
      'Learning From Las Vegas (Venturi and Scott Brown): SIGN + SHED + PARKING IN FRONT, and the sign is taller than the building. Here the sign is 167 m and the shed is a boarding hall, which is the reference at its limit.'
    ],
    layout: [
      'THE WHEEL runs EAST-WEST across the middle and off both edges, because 143 m does not fit in 96.',
      'THE FOUR FEET are splayed north and south of the axle, and the BRACE LEG is planted on the far side of the north road, which is what the real one does.',
      'THE BOARDING HALL is under the middle, because from above the lowest point of a vertical wheel and its highest point are the same place.',
      'THE SHADOW is a long shallow loop across the south-east of the plot with twenty-eight beads on it, thrown by the same sun as the Sphere.'
    ],
    horror: 'The horror is the scale and the stillness: a wheel the size of a district, stopped, with twenty-eight glass balls hanging off it and nobody in any of them. R1 the ordinary frame with one wrong thing, R3 the long hold, R4 one sun.',
    not_drawn: 'R9 THE MACHINES KEEP TALKING: whether the wheel still turns on a schedule to an empty valley is BEHAVIOUR and belongs to WORLD, not to a tile plan. Named, not quietly taken.'
  };

  const doc = {
    version: 'BOHEMIA_THE_HIGH_ROLLER_v1', built: '2026-09-24',
    lane: 'COOK [fortress buildings] round 6', mark: MARK, bounds: b,
    why: 'the overmap names seven singular Las Vegas landmarks and nothing could build them. The sign went in round 3, the Stratosphere round 4, the Sphere round 5. This is the High Roller, and the measurement IS the design: a 143 m wheel on a 96 m cell does not fit, so the plan is the feet of something too big for its own plot.',
    not_shipped: 'rule 18: engine/bohemia_landmarks.js is the walked world, so this is a bank and a VOTE candidate. It drops into the engine in one paste when the hold lifts.',
    real_numbers: { rim_m: RIM_M, top_m: TOP_M, hub_m: +HUB_M.toFixed(1), rim_hangs_m: FOOT_M,
                    cabins: CABINS, leg_diameter_m: LEG_D_M, legs: 4, brace_legs: 1 },
    palette: HR_PAL, legend: HR_LEG, notes: notes,
    coverage: Object.fromEntries(Object.keys(used).map(k => [HR_LEG[k].name, +(100 * used[k] / total).toFixed(2)])),
    off_its_own_ground_pct: +off.toFixed(1),
    cabin_crowding_ratio: +(mid / edge).toFixed(2),
    ground_contact_pct: +contact.toFixed(2),
    build_source: build.toString()
  };
  const out = path.join(REPO, 'banks/BOHEMIA_THE_HIGH_ROLLER_9_24_26.txt');
  fs.writeFileSync(out, JSON.stringify(doc));
  const back = JSON.parse(fs.readFileSync(out, 'utf8'));
  if (!back.build_source || Object.keys(back.legend).length !== Object.keys(HR_LEG).length) {
    console.log('REFUSED: read-back failed'); process.exit(1);
  }
  console.log('\nwrote banks/BOHEMIA_THE_HIGH_ROLLER_9_24_26.txt  (' +
    (fs.statSync(out).size / 1024).toFixed(0) + ' KB)');
  card(grid, used, total, off, inXs.length);
}

/* ---------------------------------------------------------------- THE CARD
   Round 5's card was assembled by hand outside the tool, so it could not be rebuilt from
   the plan. This one is built here, from the same grid the bank carries, so the picture and
   the plan can never drift apart. Written as a PPM and handed to Pillow, because that needs
   no image library on this side and no new dependency anywhere. */
function card(grid, used, total, off, visibleCabins) {
  const MAG = 8, PAD = 26, H = grid.length, W = grid[0].length;
  const px = (hex) => [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16),
                       parseInt(hex.slice(5, 7), 16)];
  const buf = Buffer.alloc(W * MAG * H * MAG * 3);
  for (let y = 0; y < H * MAG; y++) for (let x = 0; x < W * MAG; x++) {
    const c = px(HR_PAL[grid[(y / MAG) | 0][(x / MAG) | 0]] || '#000000');
    const i = (y * W * MAG + x) * 3;
    buf[i] = c[0]; buf[i + 1] = c[1]; buf[i + 2] = c[2];
  }
  const ppm = path.join(require('os').tmpdir(), 'highroller_plan.ppm');
  fs.writeFileSync(ppm, Buffer.concat([
    Buffer.from('P6\n' + (W * MAG) + ' ' + (H * MAG) + '\n255\n', 'ascii'), buf]));
  const keys = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  const meta = {
    ppm, out: path.join(REPO, 'slices/vote/COOK_THE_WHEEL_THAT_STOPPED.png'),
    title: 'THE WHEEL THAT STOPPED',
    sub: 'one cell of the map, 96 metres across, and the wheel on it is 143',
    legend: keys.map(k => [HR_PAL[k], HR_LEG[k].name]),
    foot: ['A wheel standing on edge is a LINE from above, not a circle. This one is 143 m '
           + 'across a 96 m plot, so ' + off.toFixed(0) + '% of it runs off both sides.',
           'Only ' + visibleCabins + ' of the twenty-eight cabins are over this ground at all, '
           + 'and the rim is still 149 m up where it crosses the edge.',
           'The whole thing rests on four legs and one brace planted across the road. The '
           + 'shadow lying on the yard is the rest of the shape.'],
    pad: PAD
  };
  fs.writeFileSync(path.join(require('os').tmpdir(), 'highroller_card.json'), JSON.stringify(meta));
  const r = require('child_process').spawnSync('python3',
    [path.join(REPO, 'tools/bohemia_landmark_card.py'),
     path.join(require('os').tmpdir(), 'highroller_card.json')], { encoding: 'utf8' });
  process.stdout.write(r.stdout || ''); process.stderr.write(r.stderr || '');
  if (r.status !== 0) { console.log('REFUSED: the card did not render'); process.exit(1); }
}

main();
