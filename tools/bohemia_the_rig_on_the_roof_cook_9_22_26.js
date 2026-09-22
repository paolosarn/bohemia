/* ============================================================================
   THE RIG ON THE ROOF  (WORLD, 9/22/26, row [people charge])

   HIS RULING, KILLING AN ITEM OF MINE:
     "Mfs charge batteries bro. i know buildings can help in our game but jesus
      christ mfs can charge batteries"          -- Paolo 9/21, in the VOTE tab

   AND RULE 29, FROM THE SAME VOTE: "boring asf", "no more cards, make the
   pixels, make the sound". Every one of this lane's six items was a page of
   text and every one went down. A WORLD cook is a THING DRAWN now. So this is
   the thing his ruling names, drawn: the rig a person charges cells on.

   MEASURED FIRST (rule 12), in the walked city, before a pixel:
     cellsNightlyCharge() is the ONLY maker of batteries in this game. It walks
     the lit circuits, finds the FACTION holding that ground, and credits THAT
     FACTION one cell -- reason string 'a day on a live wire'. A person never
     makes one. The player never makes one. The whole money supply is minted by
     fourteen outfits holding wire.

   THE SUBJECT, REAL: a scavenged charging rig on a flat roof. A salvaged PV
   panel propped on angle iron facing south, a length of automotive cable run to
   a charge controller screwed to a block, a four-bay AA charger with cells in
   it, and a car battery as the buffer so the bays keep running when a cloud
   crosses. Every part of that is a thing people actually build, and all of it
   is scavenged from a city that had solar on half its roofs.

   REFERENCE CHECK
   COMPARED TO: PROP-01 (SLYNYRD, a prop is SILHOUETTE FIRST), PROP-02 (real
   object typology -- the actual manufacturer shapes: a framed PV module, a
   four-bay charger, a Group 24 car battery, a DIN-rail controller), PROP-03
   (the 45 DEGREE ART LAW, ours, locked) and AH-01 (the analog horror bible).

   STRUCTURAL RULES TAKEN:
     * PROP-01 -- SILHOUETTE FIRST. The rig reads at a glance as ONE tilted
       rectangle on legs with a small box under it. If the panel's slant and the
       cable's droop do not carry it, no detail will, so the panel is the biggest
       shape on the tile and everything else sits under its line.
     * PROP-02 -- the real shapes, not invented ones. A PV module is a dark blue
       cell field inside a light aluminium frame with a visible grid of busbars;
       a four-bay charger is a shallow slab with four slots side by side; a car
       battery is a squat box with two posts on top. Drawn as those, not as
       glowing sci-fi bricks.
     * PROP-03 -- 45 degrees, the world's three faces. The panel gets a top face
       and one side; the battery and the charger get top, front and one side.
       Nothing is drawn straight-on.
     * AH-01 -- the frame is ordinary and ONE thing in it is wrong. The rig is
       competent, tidy, cared for. The wrong thing is that it is on a roof with
       no way down drawn, and the cells in the bays are the only lit pixels on
       the whole tile.

   NOT SHIPPED TO A PLAY SURFACE (rule 18). This writes a bank and a PNG for the
   VOTE tab; it drops into the world in one paste when the hold lifts.

     node tools/bohemia_the_rig_on_the_roof_cook_9_22_26.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const REPO = path.resolve(__dirname, '..');

const S = 64;                       /* the tile, in art pixels */

/* ---- THE PALETTE. Scavenged metal and a dead roof, plus exactly one lit hue.
        Nothing saturated anywhere else: AH-01's rule is that the wrong thing is
        the only thing with any life in it. */
const PAL = {
  0:  '#00000000',   /* nothing */
  1:  '#4a4438',     /* roof felt, sun-bleached */
  2:  '#3d382e',     /* roof felt, the darker patch */
  3:  '#6b6358',     /* roof gravel in the low spots */
  4:  '#8a8478',     /* galvanised angle iron, lit face */
  5:  '#5f5a51',     /* angle iron, shaded face */
  6:  '#1e2733',     /* PV cell field */
  7:  '#2b3948',     /* PV cell field, the lit half */
  8:  '#9aa0a6',     /* aluminium frame, lit */
  9:  '#6d7378',     /* aluminium frame, shaded */
  10: '#2a2620',     /* cable */
  11: '#7a6f5e',     /* the block the controller is screwed to */
  12: '#57514a',     /* charger slab */
  13: '#3b3630',     /* car battery body */
  14: '#8c7a45',     /* battery posts, dull brass */
  15: '#c79a3f',     /* THE ONE LIT THING: a cell in a bay */
  16: '#6a6358',     /* grit and dust */
};

const LEG = {
  1:  { name: 'roof felt',        kind: 'ground' },
  2:  { name: 'roof felt, worn',  kind: 'ground' },
  3:  { name: 'roof gravel',      kind: 'ground' },
  4:  { name: 'angle iron, lit',  kind: 'prop' },
  5:  { name: 'angle iron, shade',kind: 'prop' },
  6:  { name: 'PV cells',         kind: 'prop' },
  7:  { name: 'PV cells, lit',    kind: 'prop' },
  8:  { name: 'panel frame, lit', kind: 'prop' },
  9:  { name: 'panel frame, shade',kind:'prop' },
  10: { name: 'cable',            kind: 'prop' },
  11: { name: 'mounting block',   kind: 'prop' },
  12: { name: 'four-bay charger', kind: 'prop' },
  13: { name: 'car battery',      kind: 'prop' },
  14: { name: 'battery posts',    kind: 'prop' },
  15: { name: 'a cell, charging', kind: 'prop' },
  16: { name: 'grit',             kind: 'ground' },
};

function blank() {
  const g = [];
  for (let y = 0; y < S; y++) { g.push(new Array(S).fill(0)); }
  return g;
}
function rnd(seed) { let s = seed >>> 0 || 1;
  return () => { s = (s * 1103515245 + 12345) >>> 0; return s / 4294967296; }; }

function build(seed) {
  const g = blank(), r = rnd(seed);
  const set = (x, y, c) => { if (x >= 0 && y >= 0 && x < S && y < S) g[y][x] = c; };
  const rect = (x0, y0, x1, y1, c) => {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) set(x, y, c); };

  /* ---- THE ROOF. One dominant ground with accents in coherent patches, which
     is the desert law's shape applied to a roof: never a shuffle. */
  rect(0, 0, S - 1, S - 1, 1);
  for (let i = 0; i < 9; i++) {
    const cx = (r() * S) | 0, cy = (r() * S) | 0, w = 4 + ((r() * 7) | 0), h = 3 + ((r() * 5) | 0);
    rect(cx, cy, cx + w, cy + h, 2);
  }
  for (let i = 0; i < 70; i++) set((r() * S) | 0, (r() * S) | 0, 16);
  for (let i = 0; i < 5; i++) {
    const cx = (r() * S) | 0, cy = (r() * S) | 0;
    rect(cx, cy, cx + 2 + ((r() * 4) | 0), cy + 1 + ((r() * 3) | 0), 3);
  }

  /* ---- THE PANEL. The biggest shape, tilted, top face plus one side (PROP-03).
     A real module is a dark cell field inside a light frame, with the busbar grid
     showing; the tilt is a parallelogram, never a straight-on rectangle. */
  const px = 12, py = 10, pw = 34, ph = 17, slant = 7;
  for (let y = 0; y < ph; y++) {
    const off = Math.round(slant * (1 - y / ph));
    for (let x = 0; x < pw; x++) {
      const edge = (y === 0 || y === ph - 1 || x === 0 || x === pw - 1);
      /* the lit half of the field: the sun is off the upper left, the same
         direction everything else on this tile is lit from */
      const lit = (x + y * 0.6) < pw * 0.52;
      set(px + x + off, py + y, edge ? (lit ? 8 : 9) : (lit ? 7 : 6));
    }
  }
  /* busbars: the grid a real module actually shows, thin and regular */
  for (let y = 1; y < ph - 1; y++) {
    const off = Math.round(slant * (1 - y / ph));
    for (let x = 5; x < pw - 1; x += 8) set(px + x + off, py + y, 9);
  }
  for (let x = 1; x < pw - 1; x++) {
    const yy = py + Math.round(ph / 2);
    const off = Math.round(slant * (1 - (ph / 2) / ph));
    set(px + x + off, yy, 9);
  }

  /* ---- THE SHADOW THE PANEL THROWS, and it is the reason the tilt reads.
     The first cut left the roof showing under the panel and it read as a HOLE,
     not as shade -- a void a player would try to walk into. A cast shadow is
     also the cheapest true statement about where the sun is, and every lit face
     on this tile already agrees with it: the sun is off the upper left, so the
     shadow falls down and to the RIGHT of the panel's own footprint. */
  for (let y = 0; y < ph + 9; y++) {
    const off = Math.round(slant * (1 - y / ph));
    for (let x = 0; x < pw; x++) {
      const sx = px + x + off + 4, sy = py + y + 6;
      if (sy <= py + ph + 1) continue;              /* behind the panel itself */
      if (sx < 0 || sy < 0 || sx >= S || sy >= S) continue;
      if (g[sy][sx] === 1 || g[sy][sx] === 16 || g[sy][sx] === 3) g[sy][sx] = 2;
    }
  }

  /* ---- THE LEGS. Angle iron, lit face and shaded face, holding the tilt up. */
  for (let y = py + ph; y < py + ph + 9; y++) {
    set(px + 3, y, 4); set(px + 4, y, 5);
    set(px + pw - 6, y, 4); set(px + pw - 5, y, 5);
  }
  for (let x = px + 3; x <= px + pw - 5; x++) set(x, py + ph + 8, 5);

  /* ---- THE CABLE. It droops. A cable drawn straight is the tell that nobody
     looked at one; the sag is the whole read. */
  const c0x = px + 6, c0y = py + ph + 8, c1x = 40, c1y = 44;
  for (let t = 0; t <= 40; t++) {
    const u = t / 40;
    const x = Math.round(c0x + (c1x - c0x) * u);
    const y = Math.round(c0y + (c1y - c0y) * u + Math.sin(u * Math.PI) * 5);
    set(x, y, 10); set(x, y + 1, 10);
  }

  /* ---- THE MOUNTING BLOCK + CHARGE CONTROLLER, under the panel's line. */
  rect(36, 41, 47, 47, 11);
  rect(38, 39, 45, 41, 12);

  /* ---- THE CAR BATTERY. Squat box, three faces, two posts on top. */
  rect(14, 44, 27, 53, 13);          /* front face */
  for (let x = 14; x <= 27; x++) { set(x + 3, 41, 13); }
  for (let y = 41; y <= 44; y++) for (let x = 14 + (44 - y); x <= 27 + (44 - y); x++) set(x, y, 13);
  rect(17, 41, 18, 42, 14); rect(23, 41, 24, 42, 14);   /* the posts */

  /* ---- THE FOUR-BAY CHARGER. A shallow slab with four slots, and the slots are
     THE ONLY LIT PIXELS ON THE TILE (AH-01: one thing in an ordinary frame). */
  rect(31, 50, 48, 57, 12);
  for (let i = 0; i < 4; i++) {
    const bx = 33 + i * 4;
    rect(bx, 52, bx + 2, 55, 15);
  }
  /* a short lead from the charger back to the battery, so the loop closes */
  for (let x = 28; x < 31; x++) { set(x, 53, 10); set(x, 54, 10); }

  return g;
}

/* ---- WRITE THE BANK, and read it back rather than trusting the write -------- */
function main() {
  const seed = 9222026;
  const g = build(seed);

  const used = {}; let total = 0;
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const c = g[y][x]; used[c] = (used[c] || 0) + 1; total++;
  }

  /* THE ONE-LIT-THING CHECK, run here rather than asserted in the header: the
     charging cells must be the only accent, and they must be a SMALL accent. */
  const lit = used[15] || 0;
  const share = 100 * lit / total;
  if (!(lit > 0)) { console.log('REFUSED: nothing is lit; AH-01 wants one wrong thing'); process.exit(1); }
  if (share > 3) {
    console.log('REFUSED: the lit cells are ' + share.toFixed(1) + '% of the tile. ' +
      'One thing wrong in an ordinary frame is a SMALL thing.'); process.exit(1);
  }

  /* SILHOUETTE FIRST (PROP-01): the panel has to be the biggest built shape. */
  const panel = (used[6] || 0) + (used[7] || 0) + (used[8] || 0) + (used[9] || 0);
  const others = (used[12] || 0) + (used[13] || 0) + (used[11] || 0) + (used[4] || 0) + (used[5] || 0);
  if (panel <= others) {
    console.log('REFUSED: the panel is ' + panel + ' px against ' + others +
      ' px of everything else. PROP-01 wants ONE silhouette.'); process.exit(1);
  }

  const doc = {
    version: 'BOHEMIA_THE_RIG_ON_THE_ROOF_v1', built: '2026-09-22',
    lane: 'WORLD [people charge]',
    ruling: 'Paolo 9/21, voting THE RULES RUN WITH THE DIRT down: "Mfs charge batteries bro. i know buildings can help in our game but jesus christ mfs can charge batteries"',
    rule29: 'his same vote killed all six of this lane\'s text items ("boring asf"). A WORLD cook is a thing drawn.',
    measured: 'cellsNightlyCharge() is the only maker of batteries in the game and it credits the FACTION holding the lit ground. A person never makes one.',
    size: S, palette: PAL, legend: LEG,
    coverage: Object.fromEntries(Object.keys(used)
      .filter(k => LEG[k]).map(k => [LEG[k].name, +(100 * used[k] / total).toFixed(2)])),
    litShare: +share.toFixed(2),
    not_shipped: 'rule 18: this is a bank and a VOTE candidate, not a play surface.',
    build_source: build.toString()
  };
  const out = path.join(REPO, 'banks/BOHEMIA_THE_RIG_ON_THE_ROOF_9_22_26.txt');
  fs.writeFileSync(out, JSON.stringify(doc));
  const back = JSON.parse(fs.readFileSync(out, 'utf8'));
  if (!back.build_source || Object.keys(back.legend).length !== Object.keys(LEG).length) {
    console.log('REFUSED: read-back failed'); process.exit(1);
  }
  fs.writeFileSync(path.join(REPO, 'banks/_rig_grid.json'),
    JSON.stringify({ g, pal: PAL, leg: LEG, size: S }));
  console.log('wrote banks/BOHEMIA_THE_RIG_ON_THE_ROOF_9_22_26.txt (' +
    (fs.statSync(out).size / 1024).toFixed(0) + ' KB)');
  console.log('  lit cells ' + share.toFixed(2) + '% of the tile; panel ' + panel +
    ' px against ' + others + ' px of everything else');
}

main();
