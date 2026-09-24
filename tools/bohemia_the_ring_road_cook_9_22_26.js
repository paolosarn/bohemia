/* ============================================================================
   THE RING ROAD  (WORLD, 9/22/26, row [beltway placed])

   RULE 29 (Paolo 9/21): every text item this lane made was voted down. A WORLD
   cook is a THING DRAWN. This row's thing is the one the name has never had a
   picture of: a cell of the beltway.

   MEASURED FIRST (rule 12), and it settled the row: the overmap ALREADY places
   the ring. Its resolver carries a block commented "BELTWAY: a RECTANGLE ring
   with square corners, 2 wide, snapped mid-block", computes it off beltRect --
   geometry the map already uses to site the airbase, the datafort and the exits
   -- and then returns DISTRICT.FREEWAY. About five hundred cells a seed ARE the
   Las Vegas Beltway and every one of them reports as freeway. The name was never
   unplaced. It is mislabelled.

   THE SUBJECT, REAL: the Las Vegas Beltway, CC-215. A divided ring freeway on
   the valley's edge -- two carriageways, a concrete median barrier, a wide
   graded shoulder, and a sound wall on the city side because it runs past the
   backs of tract houses the whole way round. Outside it is bare desert. Act 1
   dead: the lanes stopped where they stopped, and the desert has been taking
   the outside lane back one drift at a time.

   REFERENCE CHECK
   COMPARED TO: TG-05 (the lot tile -- how a big flat surface reads from above),
   PROP-02 (real object typology: a Jersey barrier is a specific shape, a sound
   wall is precast panels between posts), PROP-03 (the 45 DEGREE ART LAW, ours,
   locked) and AH-01 (the analog horror bible).

   STRUCTURAL RULES TAKEN:
     * TG-05 -- a big paved surface reads by what BREAKS it, never by the paving.
       So the lane lines, the joints and the drift edge do the work and the
       asphalt is one dominant value.
     * PROP-02 -- the real shapes. A Jersey barrier has a sloped foot and a flat
       top, not a plain slab; a sound wall is panels with visible posts at a
       regular pitch. Drawn as those.
     * PROP-03 -- 45 degrees. The barrier and the wall get a top face and a lit
       side; nothing is a straight-on rectangle.
     * AH-01 -- ordinary frame, ONE thing wrong. Six lanes of empty motorway is
       the ordinary part. The wrong thing is that the sand has crossed the white
       line and nobody has swept it, and it is the only shape on the tile that
       does not run parallel to everything else.

   *** HIS CORRECTION, 9/23, ON HIS OWN UP VOTE: "why is the sand white grey,
   it'll be the same colour as the rest of the dirt." He is right and the repo
   had already caught this exact mistake once: bohemia_city_terrain_patch.py
   carries the line "desert:0 desert pavement #6e6045 (WAS RENDERING AS GENERIC
   SAND #d8b078)". Somebody fixed generic pale sand to real desert pavement in
   the terrain, and I put generic pale sand straight back in a tile. The dirt
   family is the game's own now and the drift is one step of it. ***

   NOT SHIPPED TO A PLAY SURFACE (rule 18): the rename touches the walked world's
   map generator and is none of loading, walking or the fight. Measured, gated
   and ready.

     node tools/bohemia_the_ring_road_cook_9_22_26.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const REPO = path.resolve(__dirname, '..');

const S = 64;

const PAL = {
  0:  '#00000000',
  1:  '#6e6045',   /* desert. *** NOT A VALUE I PICKED: this is the walked
                      city's own desert pavement, tools/bohemia_city_terrain_patch.py,
                      and the sand family is now a step of THIS and nothing else. *** */
  2:  '#7b6c50',   /* desert, the lighter drift: one step of the same dirt */
  3:  '#3a3832',   /* asphalt */
  4:  '#33312c',   /* asphalt, the older lane */
  5:  '#8e8a7e',   /* lane line, faded */
  6:  '#7d7973',   /* Jersey barrier, top face */
  7:  '#5c5953',   /* Jersey barrier, sloped foot */
  8:  '#8b867b',   /* sound wall panel, lit. *** LIFTED WHEN THE DIRT WAS.
                      *** Moving the desert onto the game's own #6e6045 made it
                      LIGHTER, and the wall's cap sat 0.055 of lightness away
                      from it, so the top of the wall stopped reading at all --
                      his sand ruling fixed one thing and broke its neighbour.
                      Concrete really is lighter than desert dirt in daylight, so
                      the wall now reads by its own step and not by luck. */
  9:  '#4a463d',   /* sound wall panel, shaded */
  10: '#6a6459',   /* sound wall post */
  11: '#46433a',   /* shoulder, graded gravel */
  12: '#8e7d5c',   /* THE ONE WRONG THING: sand over the white line.
                      *** WAS #c0b79c AND HE WAS RIGHT THAT IT READ WHITE-GREY. ***
                      Same hue as the dirt (45 against 40) but TWICE the
                      lightness (0.68 against 0.35), and at that distance a hue
                      match stops mattering -- it reads as a different material.
                      Loose sand IS the desert floor unpacked, so it is one step
                      lighter than the dirt and no more. It still reads because
                      the contrast that does the work is sand against ASPHALT,
                      not sand against desert. */
  13: '#34322d',   /* joint, one value step off the asphalt and no more */
  14: '#24231f',   /* the shadow a raised thing throws */
};

const LEG = {
  1:  { name: 'desert',              kind: 'ground' },
  2:  { name: 'desert, drifted',     kind: 'ground' },
  3:  { name: 'asphalt',             kind: 'drive' },
  4:  { name: 'asphalt, older lane', kind: 'drive' },
  5:  { name: 'lane line',           kind: 'marking' },
  6:  { name: 'median barrier, top', kind: 'prop' },
  7:  { name: 'median barrier, foot',kind: 'prop' },
  8:  { name: 'sound wall, lit',     kind: 'prop' },
  9:  { name: 'sound wall, shade',   kind: 'prop' },
  10: { name: 'sound wall post',     kind: 'prop' },
  11: { name: 'graded shoulder',     kind: 'ground' },
  12: { name: 'sand over the line',  kind: 'ground' },
  13: { name: 'pavement joint',      kind: 'marking' },
  14: { name: 'shadow',              kind: 'marking' },
};

function blank() { const g = []; for (let y = 0; y < S; y++) g.push(new Array(S).fill(0)); return g; }
function rnd(seed) { let s = seed >>> 0 || 1;
  return () => { s = (s * 1103515245 + 12345) >>> 0; return s / 4294967296; }; }

function build(seed) {
  const g = blank(), r = rnd(seed);
  const set = (x, y, c) => { if (x >= 0 && y >= 0 && x < S && y < S) g[y][x] = c; };
  const rect = (x0, y0, x1, y1, c) => {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) set(x, y, c); };

  /* THE SECTION, top to bottom, is the real cross-section of a ring freeway:
     desert, sound wall, shoulder, three lanes, median barrier, three lanes,
     shoulder, desert. The road runs across the tile so the cell tiles with the
     next one along the ring. */
  rect(0, 0, S - 1, S - 1, 1);
  for (let i = 0; i < 10; i++) {
    const cx = (r() * S) | 0, cy = (r() * 10) | 0;
    rect(cx, cy, cx + 3 + ((r() * 6) | 0), cy + 1 + ((r() * 2) | 0), 2);
    rect(cx, S - 1 - cy, cx + 3 + ((r() * 6) | 0), S - 1 - cy + 2, 2);
  }

  /* THE SOUND WALL on the city side (the top of the tile), panels between posts.
     PROP-02: the posts are the thing that makes it read as a wall and not a
     fence, and they sit at a regular pitch. */
  const wallY = 8;
  for (let x = 0; x < S; x++) {
    set(x, wallY, 8);                            /* the cap, catching the light */
    set(x, wallY + 1, 9); set(x, wallY + 2, 9);  /* the panel face, in its own shade */
    set(x, wallY + 3, 14);                       /* the shadow it lays on the shoulder */
  }
  /* the posts at a regular pitch: PROP-02 says this is what makes it a wall */
  for (let x = 2; x < S; x += 7) {
    set(x, wallY, 10); set(x, wallY + 1, 10); set(x, wallY + 2, 10);
  }

  /* THE SHOULDERS, graded gravel either side of the paving */
  rect(0, wallY + 2, S - 1, wallY + 4, 11);
  rect(0, S - 12, S - 1, S - 10, 11);

  /* THE CARRIAGEWAYS. Two of three lanes, the far one repaved a different year,
     which is the honest reason two big flat areas are different values. */
  const topRoad = [wallY + 5, 30], botRoad = [35, S - 13];
  rect(0, topRoad[0], S - 1, topRoad[1], 3);
  rect(0, botRoad[0], S - 1, botRoad[1], 4);

  /* LANE LINES, broken, and the joints. TG-05: the paving is read by what
     breaks it. */
  const dash = (yy, col) => { for (let x = 0; x < S; x++) if ((x % 8) < 5) set(x, yy, col); };
  dash(topRoad[0] + 8, 5); dash(topRoad[0] + 16, 5);
  dash(botRoad[0] + 8, 5); dash(botRoad[0] + 16, 5);
  /* *** THE JOINTS WERE THE FIRST CUT'S WORST MISTAKE. *** They were drawn every
     eleven pixels in near-black and the tile read as a CATTLE GRID, not a road:
     the joints became the loudest thing on a surface TG-05 says must be read by
     what breaks it, which means the breaks have to be quiet. A real slab joint
     is a hairline you notice only in raking light. So: half as many, and one
     value step off the asphalt rather than a bar across it. */
  for (let x = 7; x < S; x += 21) {
    for (let y = topRoad[0] + 1; y <= topRoad[1]; y += 2) set(x, y, 13);
    for (let y = botRoad[0] + 1; y <= botRoad[1]; y += 2) set(x, y, 13);
  }
  /* the solid edge lines, which is what a shoulder actually has */
  for (let x = 0; x < S; x++) { set(x, topRoad[0], 5); set(x, botRoad[1], 5); }

  /* THE MEDIAN BARRIER. PROP-03: a top face and a sloped foot, not a slab. */
  const mid = 30;
  for (let x = 0; x < S; x++) {
    set(x, mid - 1, 14);                         /* the shadow it throws uphill */
    set(x, mid, 6); set(x, mid + 1, 6);          /* the flat top, lit */
    set(x, mid + 2, 7); set(x, mid + 3, 7);      /* the sloped foot, shaded */
    set(x, mid + 4, 14);                         /* and the shadow on the deck */
  }

  /* *** THE ONE WRONG THING. *** The sand has come over the edge line and taken
     the outside lane, and it is the only shape here that does not run parallel
     to the road. AH-01: ordinary frame, one thing in it wrong. */
  for (let x = 0; x < S; x++) {
    const depth = Math.max(0, Math.round(5 * Math.sin((x / S) * Math.PI * 1.3 + 0.6) + r() * 1.6));
    for (let d = 0; d < depth; d++) {
      const y = botRoad[1] - d;
      if (y > botRoad[0]) set(x, y, 12);
    }
  }

  return g;
}

function main() {
  const seed = 9222026;
  const g = build(seed);
  const used = {}; let total = 0;
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) { const c = g[y][x]; used[c] = (used[c] || 0) + 1; total++; }

  /* AH-01: one thing wrong, and a SMALL one. */
  const sand = used[12] || 0, share = 100 * sand / total;
  if (!(sand > 0)) { console.log('REFUSED: nothing is wrong in the frame'); process.exit(1); }
  if (share > 9) { console.log('REFUSED: the drift is ' + share.toFixed(1) + '% of the tile; one thing wrong is a SMALL thing'); process.exit(1); }

  /* *** HIS RULING AS A REFUSAL, so the pale sand cannot come back a third time.
     One palette: the sand must sit in the dirt's own hue AND within a step of
     its lightness. A hue check alone would have PASSED the version he rejected
     (#c0b79c is hue 45 against the dirt's 40), which is exactly why the check
     is on lightness too. *** */
  const hsl = (hex) => {
    const n = parseInt(hex.slice(1, 7), 16);
    const r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
    let h = 0;
    if (d) h = mx === r ? 60 * (((g - b) / d) % 6) : mx === g ? 60 * ((b - r) / d + 2) : 60 * ((r - g) / d + 4);
    if (h < 0) h += 360;
    return { h: h, l: (mx + mn) / 2 };
  };
  const dirt = hsl(PAL[1]), sandc = hsl(PAL[12]);
  /* THE WALL MUST STILL SEPARATE FROM THE GROUND IT STANDS ON. Caught the hard
     way: fixing the sand lifted the dirt and the sound wall's cap vanished into
     it in the same render. A palette move is never local. */
  const wall = hsl(PAL[8]);
  if (Math.abs(wall.l - dirt.l) < 0.10) {
    console.log('REFUSED: the sound wall is ' + wall.l.toFixed(2) + ' light against the dirt\'s '
      + dirt.l.toFixed(2) + '; the top of the wall will not read'); process.exit(1);
  }
  const dh = Math.min(Math.abs(dirt.h - sandc.h), 360 - Math.abs(dirt.h - sandc.h));
  if (dh > 12) {
    console.log('REFUSED: the sand is hue ' + sandc.h.toFixed(0) + ' against the dirt\'s '
      + dirt.h.toFixed(0) + '; his ruling is ONE palette'); process.exit(1);
  }
  if (sandc.l - dirt.l > 0.22) {
    console.log('REFUSED: the sand is ' + sandc.l.toFixed(2) + ' light against the dirt\'s '
      + dirt.l.toFixed(2) + '. That gap is what he called white grey, and a matching hue does'
      + ' not save it.'); process.exit(1);
  }

  /* TG-05: the road is the dominant surface, or this is a picture of a desert. */
  const road = (used[3] || 0) + (used[4] || 0);
  if (road < total * 0.35) {
    console.log('REFUSED: the paving is only ' + (100 * road / total).toFixed(0) + '% of the tile'); process.exit(1);
  }

  const doc = {
    version: 'BOHEMIA_THE_RING_ROAD_v1', built: '2026-09-22',
    lane: 'WORLD [beltway placed]',
    finding: 'the overmap ALREADY places the ring (about 500 cells a seed, measured over three seeds) and its resolver returns DISTRICT.FREEWAY. The name was never unplaced; it is mislabelled.',
    decision: 'PLACE IT. A ring road is real Las Vegas geography, the map already computes the rectangle and uses it to site the airbase, the datafort and the exits, and MAP LAW is not in the way because nothing here designs a layout.',
    second_half: 'the rename is NOT one line: bohemia_powergrid already carries beltway in its street list, but BOH_OMBRIDGE.STREET_DISTRICTS does not, in every copy. Renaming alone would stop five hundred cells being streets to the district kit, the plot generator and the landlocked law.',
    size: S, palette: PAL, legend: LEG,
    coverage: Object.fromEntries(Object.keys(used).filter(k => LEG[k])
      .map(k => [LEG[k].name, +(100 * used[k] / total).toFixed(2)])),
    driftShare: +share.toFixed(2),
    his_correction: "9/23, on his own up vote: 'why is the sand white grey, it will be the same colour as the rest of the dirt.' The dirt family is now the walked city's own desert pavement #6e6045 and the sand is one step of it; the tool refuses a sand that leaves the family on hue OR on lightness, because a hue check alone would have passed the version he rejected.",
    not_shipped: 'rule 18: the rename touches the walked world\'s map generator and is none of loading, walking or the fight.',
    build_source: build.toString()
  };
  const out = path.join(REPO, 'banks/BOHEMIA_THE_RING_ROAD_9_22_26.txt');
  fs.writeFileSync(out, JSON.stringify(doc));
  const back = JSON.parse(fs.readFileSync(out, 'utf8'));
  if (!back.build_source || Object.keys(back.legend).length !== Object.keys(LEG).length) {
    console.log('REFUSED: read-back failed'); process.exit(1);
  }
  fs.writeFileSync(path.join(REPO, 'banks/_ring_grid.json'),
    JSON.stringify({ g, pal: PAL, leg: LEG, size: S }));
  console.log('wrote banks/BOHEMIA_THE_RING_ROAD_9_22_26.txt ('
    + (fs.statSync(out).size / 1024).toFixed(0) + ' KB)');
  console.log('  paving ' + (100 * road / total).toFixed(0) + '% of the tile; the drift over the line '
    + share.toFixed(2) + '%');
}

main();
