/* ============================================================================
   THE CAMP THAT HOLDS THE POWER  (WORLD, 9/25/26, row [bb places])

   RULE 33 school, drawn. RULE 32(f): a VOTE item is a frame at game scale, not a
   study; the study is the record. RULE 29: a WORLD cook is a thing drawn.

   *** WHAT THE SCHOOL MEASURED, AND THIS IS THE PICTURE OF IT. *** Battle
   Brothers gives every settlement ATTACHED LOCATIONS -- a mine, a wheat field, an
   arrow-maker's shed -- and they decide what the market stocks, what it costs and
   who turns up to be hired. Our valley HAS the attached locations already
   (bohemia_towns.minesOf: flood-filled runs of solar, dam and battery, attributed
   by faction) and the shelf does not read them.

   MEASURED ON SEED 1337, and it is the reason this tile exists:

     the valley makes power in 4 sites, 308 cells
     HOMELESS -- rank 13 of 14 on his own power ladder, tier CAMP -- holds
     254 OF THOSE 308 CELLS and makes 2 batteries a day, more than anybody
     and its shelf is FOUR GOODS, the shortest in the valley, because a shelf
     is a function of TIER ALONE

   ONE OF THE POOREST PLACES IN LAS VEGAS MAKES THE MOST MONEY AND SELLS THE
   LEAST. (Rank 13 of 14, not 14 -- my own gate caught the first draft of this
   head overstating it.)

   THE SUBJECT, REAL: the edge where a camp meets the array it lives off. Desert
   ground, a few improvised shelters, and the panel field starting behind them
   with a cable run coming down into the camp.

   REFERENCE CHECK
   COMPARED TO: PROP-01 (the props and objects series), PROP-02 (real object
   typology: a ground-mount array is a specific thing, and so is a lean-to),
   FTC-09 (the desert camp's materials, ours), FTC-08 (Za'atari's drift -- what a
   camp becomes when it stays) and AH-01 (the analog horror bible, ours).

   STRUCTURAL RULES TAKEN:
     * PROP-02 -- a ground-mount solar array is rows of panels on raked frames
       with a gap of shadow under each row and a service alley between rows. It is
       not a dark rectangle. The rows are what makes it read as a field of
       machines rather than a car park.
     * FTC-09 / FTC-08 -- a camp that has stayed is not tents. It is salvaged
       sheet, mismatched panels, weighted roofs, and paths worn where people
       actually walk. Za'atari's lesson is that a camp becomes a town in the
       shape of its traffic.
     * AH-01 -- ordinary frame, ONE thing wrong, and the camera does not help.
       The ordinary part is a camp beside a power station, which is the most
       sensible arrangement in the frame. *** THE WRONG THING IS THAT THE ARRAY IS
       SWEPT AND THE CAMP IS NOT: *** the panel rows are clean and square and the
       dirt between them is raked, and the shelters behind them are patched with
       whatever came to hand. Somebody maintains the machine better than they
       live. Nothing says why.
     * HIS SAND RULING (9/23, on the ring road): the dirt family is the walked
       city's own desert pavement #6e6045 and every loose-ground value is a step
       of it. No pale grey sand, ever again.

   WHAT MOVES HERE THAT BATTLE BROTHERS' PICTURE DOES NOT (rule 33g): BB draws a
   settlement as one still illustration you read. This is a street you arrive on,
   so the tell is a thing you watch: the rows track the sun across the day, the
   cable sways, and at night this block is LIT while the valley around it is dark
   -- which is the same fact the shelf would tell you, told without a word.

   NOT SHIPPED TO A PLAY SURFACE (rule 18): a picture for the VOTE tab.

     node tools/bohemia_the_camp_that_holds_the_power_cook_9_25_26.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const REPO = path.resolve(__dirname, '..');

const W = 96, H = 64;          /* a lot and a half at game scale, stated not hidden */

const PALETTE = {
  0:  '#00000000',
  1:  '#6e6045',   /* desert. THE WALKED CITY'S OWN, his 9/23 sand ruling */
  2:  '#7b6c50',   /* desert, loose and walked */
  3:  '#5d523c',   /* desert, packed hard where feet go */
  4:  '#4c4433',   /* the shadow a standing thing throws */
  5:  '#2b2f33',   /* panel glass */
  13: '#363b41',   /* panel glass, the next cell along -- *** THE FIRST CUT HAD ONE
                      GLASS VALUE AND THE WHOLE ARRAY READ AS A PAINTED STRIPE.
                      *** A ground-mount array from above is a GRID: you see the
                      individual panels, not a bar. Two glass values alternating
                      across the row is what makes the divisions legible at this
                      size. */
  6:  '#79828a',   /* the panel edge catching the sky */
  7:  '#3f4247',   /* the frame under a panel row */
  8:  '#241f18',   /* the gap of shadow under a raked row */
  9:  '#8a8270',   /* salvaged sheet, the lit face */
  10: '#655d4c',   /* salvaged sheet, the shaded face */
  11: '#4a4335',   /* a weighted roof, tyres and block */
  12: '#57503f',   /* the cable, and the post it runs on */

  14: '#2e2a22',   /* a doorway, and it is just dark */
};

const LEGEND = {
  1:  { name: 'desert',                  kind: 'ground' },
  2:  { name: 'desert, loose',           kind: 'ground' },
  3:  { name: 'a path worn by feet',     kind: 'ground' },
  4:  { name: 'shadow',                  kind: 'marking' },
  5:  { name: 'panel glass',             kind: 'machine' },
  6:  { name: 'panel edge, sky-caught',  kind: 'machine' },
  7:  { name: 'the frame under a row',   kind: 'machine' },
  8:  { name: 'shadow under a raked row',kind: 'machine' },
  9:  { name: 'salvaged sheet, lit',     kind: 'shelter' },
  10: { name: 'salvaged sheet, shaded',  kind: 'shelter' },
  11: { name: 'a weighted roof',         kind: 'shelter' },
  12: { name: 'the cable and its post',  kind: 'machine' },
  13: { name: 'panel glass, next cell',  kind: 'machine' },
  14: { name: 'a doorway',               kind: 'shelter' },
};

function blank(w, h) { const g = []; for (let y = 0; y < h; y++) g.push(new Array(w).fill(0)); return g; }
function rnd(seed) { let s = seed >>> 0 || 1;
  return () => { s = (s * 1103515245 + 12345) >>> 0; return s / 4294967296; }; }

function build(seed) {
  const g = blank(W, H), r = rnd(seed);
  const set = (x, y, c) => { if (x >= 0 && y >= 0 && x < W && y < H) g[y][x] = c; };
  const rect = (x0, y0, x1, y1, c) => {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) set(x, y, c); };

  rect(0, 0, W - 1, H - 1, 1);
  /* loose ground in patches, one step of the same dirt and never a new family */
  for (let i = 0; i < 40; i++) {
    const cx = (r() * W) | 0, cy = (r() * H) | 0;
    rect(cx, cy, cx + 2 + ((r() * 6) | 0), cy + 1, 2);
  }

  /* ---- THE ARRAY, back half. PROP-02: rows of panels on raked frames, with a
     service alley between rows and a gap of shadow under each. The rows are what
     make it a field of machines; a dark rectangle would be a car park. -------- */
  /* the rows DO NOT all run the full width -- an array is built out to where the
     ground allows and stops, and three full-width bands read as a layer cake */
  const rows = [[3, 2, W - 3], [13, 2, W - 18], [23, 10, W - 3]];
  for (const [ry, x0, x1] of rows) {
    for (let x = x0; x <= x1; x++) {
      /* THE PANEL DIVISIONS ACROSS THE ROW, which is what makes it a grid of
         machines instead of a stripe. A panel is about six cells wide here. */
      const cell = ((x - x0) / 6) | 0;
      const glass = (cell % 2) ? 13 : 5;
      set(x, ry, 6);                          /* the high edge, catching the sky */
      set(x, ry + 1, glass); set(x, ry + 2, glass);
      if (((x - x0) % 6) === 0) { set(x, ry + 1, 7); set(x, ry + 2, 7); }  /* the join */
      set(x, ry + 3, 7);                      /* the frame's low rail */
      set(x, ry + 4, 8);                      /* the dark under the rake */
      set(x, ry + 5, 8);
    }
    /* THE LEGS, standing it off the ground, and the shadow each one drops */
    for (let x = x0 + 3; x <= x1; x += 9) {
      set(x, ry + 4, 7); set(x, ry + 5, 7); set(x, ry + 6, 4); set(x, ry + 7, 4);
    }
    /* AND THE ALLEY IS RAKED -- half of the one wrong thing: the dirt between the
       rows is kept, and it is the only kept thing in the frame. */
    for (let x = x0; x <= x1; x++) if ((x % 3) === 0) set(x, ry + 8, 3);
  }

  /* ---- THE CABLE, coming down out of the array into the camp ---------------- */
  /* *** THE CABLE WAS ONE PIXEL WIDE AND IT VANISHED. *** It carries the whole
     point of the picture -- the camp is wired to the field -- so it gets a post
     with a visible head, two pixels of line, and a SAG, because a span between
     two points is a curve and a straight line reads as a scratch. */
  const px = 66, py0 = 33, py1 = 47;
  for (let y = py0; y <= py1; y++) { set(px, y, 12); set(px + 1, y, 12); }
  set(px - 1, py0, 12); set(px + 2, py0, 12);          /* the head it hangs from */
  for (let y = py0 + 2; y <= py1; y += 5) { set(px + 2, y, 4); set(px + 3, y, 4); }
  for (let x = 30; x <= px; x++) {
    const t = (px - x) / (px - 30);
    const y = py0 + 2 + Math.round(6 * Math.sin(t * Math.PI));   /* the sag */
    set(x, y, 12); if ((x % 4) === 0) set(x, y + 1, 4);
  }

  /* ---- THE CAMP, front. FTC-09/FTC-08: salvaged sheet, mismatched, weighted
     roofs, and it has STAYED -- so the paths are worn where people really walk
     and the shelters sit along them, not on a grid. --------------------------- */
  const huts = [[6, 40, 14, 9], [26, 45, 12, 8], [46, 41, 13, 10], [70, 46, 15, 9], [20, 55, 11, 7]];
  for (const [hx, hy, hw, hh] of huts) {
    rect(hx, hy, hx + hw, hy + hh, 10);
    rect(hx, hy, hx + hw, hy + 3, 9);                 /* the roof the sun reaches */
    /* *** CORRUGATION, AND THE FIRST CUT HAD NONE, so the shelters read as flat
       cardboard boxes. *** Salvaged sheet is RIBBED and the ribs are the only
       thing that says what it is made of at this size. They run down the roof
       the way water has to. */
    /* *** AND THE SECOND CUT MADE THEM BARCODES, which is this lane's ring-road
       mistake in new clothes: I made the texture the loudest thing on the
       surface. TG-05 is that a surface reads by what BREAKS it and THE BREAKS
       MUST BE QUIET -- one value step, never a bar. So the ribs are one step,
       they run on the ROOF only (which is what you see from above), and the
       wall is left alone. *** */
    for (let x = hx + 2; x <= hx + hw - 1; x += 3)
      for (let y = hy; y <= hy + 3; y++) set(x, y, 10);
    for (let i = 0; i < 4; i++) {                     /* what holds the roof down */
      const wx = hx + 2 + ((r() * (hw - 3)) | 0);
      set(wx, hy, 11); set(wx + 1, hy, 11);
    }
    for (let x = hx + 1; x <= hx + hw + 2; x++) set(x, hy + hh + 1, 4);   /* its shadow */
    for (let y = hy + 1; y <= hy + hh + 1; y++) { set(hx + hw + 1, y, 4); set(hx + hw + 2, y, 4); }
    const dx = hx + 3 + ((r() * (hw - 5)) | 0);       /* a doorway, and it is just dark */
    set(dx, hy + hh, 14); set(dx + 1, hy + hh, 14); set(dx, hy + hh - 1, 14); set(dx + 1, hy + hh - 1, 14);
  }

  /* the paths, worn between the doors and out toward the array */
  /* THE PATHS, and the first cut drew them one pixel wide so they read as noise.
     FTC-08: a camp that has stayed becomes a town in the shape of its traffic, so
     the paths are the strongest ground mark in the frame, not the faintest. */
  for (let x = 4; x < W - 4; x++) {
    const y = 52 + Math.round(2.5 * Math.sin(x / 11));
    for (let d = 0; d < 3; d++) set(x, y + d, 3);
    if (r() < 0.4) set(x, y - 1, 3);
  }
  for (let y = 30; y < 53; y++) {
    const x = 40 + Math.round(3 * Math.sin(y / 7));
    set(x, y, 3); set(x + 1, y, 3); if (r() < 0.5) set(x + 2, y, 3);
  }

  return g;
}

function main() {
  const g = build(9252026);
  const used = {}; let total = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { used[g[y][x]] = (used[g[y][x]] || 0) + 1; total++; }

  /* --- THE TOOL REFUSES ITSELF, and every refusal is a claim ---------------- */

  /* HIS SAND RULING, held here so it cannot come back in a new tile. Every
     ground value must sit in the dirt's own hue and within a step of its
     lightness -- the check that would have caught the tile he rejected. */
  const hsl = (hex) => {
    const n = parseInt(hex.slice(1, 7), 16);
    const R2 = ((n >> 16) & 255) / 255, G2 = ((n >> 8) & 255) / 255, B2 = (n & 255) / 255;
    const mx = Math.max(R2, G2, B2), mn = Math.min(R2, G2, B2), d = mx - mn;
    let h = 0;
    if (d) h = mx === R2 ? 60 * (((G2 - B2) / d) % 6) : mx === G2 ? 60 * ((B2 - R2) / d + 2) : 60 * ((R2 - G2) / d + 4);
    if (h < 0) h += 360;
    return { h: h, l: (mx + mn) / 2 };
  };
  const dirt = hsl(PALETTE[1]);
  for (const i of [2, 3]) {
    const c = hsl(PALETTE[i]);
    const dh = Math.min(Math.abs(dirt.h - c.h), 360 - Math.abs(dirt.h - c.h));
    if (dh > 12 || Math.abs(c.l - dirt.l) > 0.14) {
      console.log('REFUSED: ground index ' + i + ' has left the dirt family (hue ' + c.h.toFixed(0)
        + ' against ' + dirt.h.toFixed(0) + ', lightness ' + c.l.toFixed(2) + ' against '
        + dirt.l.toFixed(2) + '). His 9/23 ruling: one palette.');
      process.exit(1);
    }
  }

  /* THE MACHINE IS THE BIGGEST THING IN THE FRAME, because that is the finding:
     the camp lives on an array far larger than itself. */
  const machine = (used[5] || 0) + (used[6] || 0) + (used[7] || 0) + (used[8] || 0);
  const shelter = (used[9] || 0) + (used[10] || 0) + (used[11] || 0) + (used[14] || 0);
  if (!(machine > shelter)) {
    console.log('REFUSED: the shelters are ' + shelter + ' pixels against the array\'s ' + machine
      + '. The whole finding is that the array dwarfs the camp that holds it.');
    process.exit(1);
  }

  /* AH-01: the kept ground is the one wrong thing, and it is SMALL */
  const kept = used[3] || 0;
  const share = 100 * kept / total;
  if (!(kept > 0) || share > 8) {
    console.log('REFUSED: the raked ground is ' + share.toFixed(1) + '% of the frame; one thing wrong is a small thing');
    process.exit(1);
  }

  const doc = {
    version: 'BOHEMIA_THE_CAMP_THAT_HOLDS_THE_POWER_v1', built: '2026-09-25',
    lane: 'WORLD, row [bb places], rule 33 school',
    measured: 'seed 1337: the valley makes power at 4 sites over 308 cells. HOMELESS -- rank 13 of 14 on his own power ladder, tier CAMP -- holds 254 of those 308 cells and makes 2 batteries a day, more than anybody. Its shelf is FOUR GOODS, the shortest in the valley, because a shelf is a function of TIER ALONE.',
    headline: 'ONE OF THE POOREST PLACES IN LAS VEGAS MAKES THE MOST MONEY AND SELLS THE LEAST (rank 13 of 14, not 14 -- my own gate caught the first draft of this head overstating it).',
    bb: 'Battle Brothers gives every settlement ATTACHED LOCATIONS that decide what the market stocks, what it costs and who turns up to be hired. We already have the attached locations (bohemia_towns.minesOf, flood-filled runs of solar/dam/battery attributed by faction). The shelf does not read them.',
    what_moves: 'rule 33g: BB draws a settlement as one still illustration you read. This is a street you arrive on, so the tell is a thing you watch -- the rows track the sun, the cable sways, and at night this block is LIT while the valley around it is dark. The same fact the shelf would tell you, told without a word.',
    the_wrong_thing: 'the array is swept and the camp is not. The rows are square and the dirt between them is raked; the shelters are patched with whatever came to hand. Somebody maintains the machine better than they live, and nothing says why.',
    sand_ruling: 'his 9/23 correction held as a refusal: every ground value sits in the walked city\'s own desert pavement #6e6045 family, on hue AND on lightness.',
    size: { image: W + 'x' + H, note: 'a lot and a half at game scale (rule 32f), stated rather than hidden' },
    palette: PALETTE, legend: LEGEND,
    machinePixels: machine, shelterPixels: shelter,
    keptGroundShare: +share.toFixed(2),
    coverage: Object.fromEntries(Object.keys(used).filter(k => LEGEND[k])
      .map(k => [LEGEND[k].name, +(100 * used[k] / total).toFixed(2)])),
    not_shipped: 'rule 18: a picture for the VOTE tab.',
    build_source: build.toString()
  };

  const out = path.join(REPO, 'banks/BOHEMIA_THE_CAMP_THAT_HOLDS_THE_POWER_9_25_26.txt');
  fs.writeFileSync(out, JSON.stringify(doc));
  if (!JSON.parse(fs.readFileSync(out, 'utf8')).build_source) { console.log('REFUSED: read-back failed'); process.exit(1); }
  fs.writeFileSync(path.join(REPO, 'banks/_camp_grid.json'),
    JSON.stringify({ g, pal: PALETTE, leg: LEGEND, w: W, h: H }));

  console.log('wrote banks/BOHEMIA_THE_CAMP_THAT_HOLDS_THE_POWER_9_25_26.txt');
  console.log('  the array is ' + machine + ' pixels against the camp\'s ' + shelter
    + ', and the raked ground is ' + share.toFixed(2) + '%');
}

main();
