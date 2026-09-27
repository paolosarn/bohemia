/* ============================================================================
   THE ONLY PUMP  (WORLD, 9/27/26, rule 33h's rebuild: PLACES)

   RULE 33h, the revamp list: "PLACES (WORLD, LIFE+CITY): a place is a block with
   its buildings as services; the shop, the shed, the pump, the fortress are the
   first four." RULE 32(f): a VOTE item is a frame at game scale. RULE 29: a
   WORLD cook is a thing drawn.

   *** WHAT THE REBUILD MEASURED, AND THIS IS THE PICTURE OF THE WORST NUMBER IN
   IT. *** With services read off the buildings actually standing on a block
   instead of off a tier, the valley comes out:

       467 blocks.  252 offer anything at all.  215 offer NOTHING.
       249 shops.  12 sheds.  7 fortresses.  *** ONE PUMP. ***
       236 blocks carry exactly one service; ONE block in Las Vegas carries three.

   Battle Brothers settlements carry three to eight attached locations each.
   Ours carry one or none, and the whole valley drinks from a single block.

   SO THIS IS THAT BLOCK. Not a category, not a diagram: the one place in Las
   Vegas where the water comes out, from the camera he plays on.

   THE SUBJECT, REAL: a small municipal pump station. Two horizontal-shaft pumps
   on concrete plinths, suction and discharge headers, an electrical cabinet, a
   chain-link fence with a gate, and the yard graded to drain. This is what the
   valley is drinking through and it is the size of a corner shop.

   REFERENCE CHECK
   COMPARED TO: PROP-02 (real object typology -- a pump skid, a header, a
   cabinet and a chain-link fence are specific shapes), PROP-01 (the props and
   objects series), TG-05 (how a flat yard reads from above), CB-06 (the valley's
   own grain, ours, measured and gated) and AH-01 (the analog horror bible).

   STRUCTURAL RULES TAKEN:
     * PROP-02 -- a pump station is PLUMBING, and plumbing reads as parallel runs
       with fat elbows, not as boxes. The two skids sit on plinths with a gap of
       shadow under the header, which is what says the pipe is off the ground.
     * TG-05 -- a concrete yard reads by what breaks it, so the slab joints and
       the drain fall do the work and the concrete is one dominant value.
     * CB-06 -- the fence line follows the lot, not the equipment, because that
       is how a real utility parcel is cut.
     * AH-01 -- ordinary frame, ONE thing wrong. A working pump station is the
       ordinary part: the gate is shut, the yard is swept, the cabinet is closed.
       *** THE WRONG THING IS THAT THERE IS ONLY ONE PATH WORN TO IT AND IT GOES
       TO THE CABINET, NOT TO THE PUMPS. *** Somebody comes here often and only
       ever touches the switch. Nothing says why.
     * HIS 9/23 SAND RULING, held as a refusal: every ground value sits in the
       walked city's own desert pavement #6e6045 family on hue AND lightness.

   WHAT MOVES HERE THAT BATTLE BROTHERS' PICTURE DOES NOT (rule 33g): BB draws a
   settlement's attached locations as icons beside a name. This is a yard you
   walk onto, so the pump is a thing you watch: the shafts turn when it is
   running, the discharge header shivers, and when the block loses its circuit it
   all stops and the valley's only water stops with it.

   NOT SHIPPED TO A PLAY SURFACE (rule 18): a picture for the VOTE tab.

     node tools/bohemia_the_only_pump_cook_9_27_26.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const REPO = path.resolve(__dirname, '..');

const W = 96, H = 64;      /* a lot and a half at game scale, stated not hidden */

const PALETTE = {
  0:  '#00000000',
  1:  '#6e6045',   /* desert. THE WALKED CITY'S OWN, his 9/23 sand ruling */
  2:  '#7b6c50',   /* desert, loose */
  3:  '#5d523c',   /* THE ONE PATH, worn hard */
  4:  '#4c4433',   /* the shadow a standing thing throws */
  5:  '#8d8778',   /* the concrete yard */
  6:  '#7c7668',   /* the yard's older pour */
  7:  '#847e70',   /* a slab joint. *** THIRD TIME THIS LANE HAS MADE A TEXTURE
                      THE LOUDEST THING ON A SURFACE: *** the ring road's joints
                      read as a cattle grid, the camp's corrugation read as a
                      barcode, and at #6b6557 this yard read as bathroom tiling.
                      TG-05 says a flat surface reads by what breaks it and THE
                      BREAKS MUST BE QUIET. One value step off the slab and no
                      more, every time, and I am writing it here because saying
                      it once clearly has not been enough. */
  8:  '#9aa0a3',   /* pipe, the lit run */
  9:  '#5f6568',   /* pipe, the shaded run */
  10: '#3d4245',   /* the gap under a header */
  11: '#7d848a',   /* a pump casing */
  12: '#4a4f52',   /* a plinth */
  13: '#586066',   /* the cabinet */
  14: '#aab0b4',   /* the cabinet's lit face, and it is CLOSED */
  15: '#6a6f72',   /* chain-link fence line */
  16: '#2b2e30',   /* the gate, shut */
};

const LEGEND = {
  1:  { name: 'desert',              kind: 'ground' },
  2:  { name: 'desert, loose',       kind: 'ground' },
  3:  { name: 'the one path worn',   kind: 'wrong' },
  4:  { name: 'shadow',              kind: 'marking' },
  5:  { name: 'concrete yard',       kind: 'ground' },
  6:  { name: 'yard, older pour',    kind: 'ground' },
  7:  { name: 'slab joint',          kind: 'marking' },
  8:  { name: 'pipe, lit',           kind: 'machine' },
  9:  { name: 'pipe, shaded',        kind: 'machine' },
  10: { name: 'the gap under a header', kind: 'machine' },
  11: { name: 'pump casing',         kind: 'machine' },
  12: { name: 'plinth',              kind: 'machine' },
  13: { name: 'the cabinet',         kind: 'machine' },
  14: { name: 'the cabinet, closed', kind: 'machine' },
  15: { name: 'fence line',          kind: 'prop' },
  16: { name: 'the gate, shut',      kind: 'prop' },
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
  for (let i = 0; i < 30; i++) {
    const cx = (r() * W) | 0, cy = (r() * H) | 0;
    rect(cx, cy, cx + 2 + ((r() * 5) | 0), cy + 1, 2);
  }

  /* ---- THE YARD. CB-06: the fence follows the LOT, not the equipment. ------ */
  const y0 = 12, y1 = 54, x0 = 10, x1 = W - 11;
  rect(x0, y0, x1, y1, 5);
  /* the older pour, because a yard gets patched where the plant was worked on */
  rect(x0 + 2, y0 + 16, x0 + 40, y0 + 28, 6);
  /* TG-05: the joints do the reading and they stay QUIET, one step off the slab */
  for (let x = x0 + 6; x < x1; x += 13) for (let y = y0; y <= y1; y++) set(x, y, 7);
  for (let y = y0 + 9; y < y1; y += 13) for (let x = x0; x <= x1; x++) set(x, y, 7);

  /* ---- THE FENCE, on the lot line, with ONE gate -------------------------- */
  for (let x = x0 - 1; x <= x1 + 1; x++) { set(x, y0 - 1, 15); set(x, y1 + 1, 15); }
  for (let y = y0 - 1; y <= y1 + 1; y++) { set(x0 - 1, y, 15); set(x1 + 1, y, 15); }
  const gx = 34;                                     /* THE GATE, AND IT IS SHUT */
  for (let x = gx; x <= gx + 7; x++) { set(x, y1 + 1, 16); set(x, y1 + 2, 4); }

  /* ---- THE TWO PUMP SKIDS. PROP-02: plumbing is parallel runs with fat
     elbows and a gap of shadow under the header, not boxes. ----------------- */
  function skid(sx, sy) {
    rect(sx, sy + 6, sx + 30, sy + 8, 12);           /* the plinth */
    rect(sx + 2, sy + 2, sx + 12, sy + 6, 11);       /* the motor/pump casing */
    rect(sx + 2, sy + 2, sx + 12, sy + 3, 8);        /* its lit top */
    for (let y = sy + 3; y <= sy + 6; y++) set(sx + 13, y, 10);   /* its own shadow, so it sits UP off the plinth */
    for (let x = sx + 3; x <= sx + 13; x++) set(x, sy + 7, 10);
    rect(sx + 14, sy + 3, sx + 28, sy + 5, 9);       /* the shaft run to the header */
    rect(sx + 14, sy + 3, sx + 28, sy + 3, 8);
    for (let x = sx; x <= sx + 31; x++) set(x, sy + 9, 4);   /* the shadow it drops */
  }
  skid(16, 16);
  skid(16, 32);

  /* ---- THE HEADERS, running the length of the yard and standing OFF it ---- */
  const hx = 50;
  for (const y of [20, 36]) {
    for (let x = hx; x < x1 - 2; x++) {
      set(x, y, 8); set(x, y + 1, 9); set(x, y + 2, 10);   /* lit, shaded, the gap under */
    }
    /* the fat elbow where it turns down, which is what says PIPE and not BAR */
    for (let d = 0; d < 4; d++) { set(x1 - 3, y + d, 9); set(x1 - 4, y + d, 8); }
  }

  /* ---- THE CABINET, closed ------------------------------------------------ */
  rect(70, 44, 79, 50, 13);
  rect(70, 44, 79, 45, 14);
  for (let x = 71; x <= 80; x++) set(x, 51, 4);
  for (let y = 45; y <= 51; y++) set(80, y, 4);

  /* *** THE ONE WRONG THING: ONE PATH, AND IT GOES TO THE SWITCH. *** Worn hard
     from the gate to the cabinet and nowhere near the pumps. Somebody comes here
     often and only ever touches the switch. AH-01: nothing says why. */
  let px = gx + 3, py = y1 + 3;
  while (py > 52) { set(px, py, 3); set(px + 1, py, 3); py--; }
  while (px < 74) { set(px, py, 3); set(px, py + 1, 3); px++; }
  while (py > 51) { set(px, py, 3); set(px + 1, py, 3); py--; }

  return g;
}

function main() {
  const g = build(9272026);
  const used = {}; let total = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { used[g[y][x]] = (used[g[y][x]] || 0) + 1; total++; }

  /* --- THE TOOL REFUSES ITSELF ---------------------------------------------- */

  /* HIS 9/23 SAND RULING, held so pale grey ground cannot come back in a new tile */
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
      console.log('REFUSED: ground index ' + i + ' has left the dirt family. His 9/23 ruling: one palette.');
      process.exit(1);
    }
  }

  /* THE MACHINE IS THE POINT: this is a pump station, not a yard with a shed on it */
  const machine = [8, 9, 10, 11, 12, 13, 14].reduce((n, i) => n + (used[i] || 0), 0);
  const yard = (used[5] || 0) + (used[6] || 0) + (used[7] || 0);
  if (machine < total * 0.06) {
    console.log('REFUSED: the plant is ' + (100 * machine / total).toFixed(1) + '% of the frame; this reads as an empty lot');
    process.exit(1);
  }
  if (machine > yard) {
    console.log('REFUSED: the plant is bigger than the yard it stands in; a utility parcel is mostly ground');
    process.exit(1);
  }

  /* AH-01: the one wrong thing is SMALL, and it exists */
  const path_ = used[3] || 0, share = 100 * path_ / total;
  if (!(path_ > 0) || share > 6) {
    console.log('REFUSED: the worn path is ' + share.toFixed(1) + '% of the frame; one thing wrong is a small thing');
    process.exit(1);
  }

  const doc = {
    version: 'BOHEMIA_THE_ONLY_PUMP_v1', built: '2026-09-27',
    lane: 'WORLD, rule 33h\'s rebuild: PLACES',
    measured: 'with services read off the buildings standing on a block instead of off a tier: 467 blocks, 252 offer anything, 215 offer NOTHING. 249 shops, 12 sheds, 7 fortresses, ONE PUMP. 236 blocks carry exactly one service; ONE block in Las Vegas carries three.',
    headline: 'THE WHOLE VALLEY DRINKS THROUGH ONE BLOCK.',
    bb: 'Battle Brothers settlements carry three to eight attached locations each. Ours carry one or none.',
    what_moves: 'rule 33g: BB draws attached locations as icons beside a name. This is a yard you walk onto -- the shafts turn when it is running, the discharge header shivers, and when the block loses its circuit it stops and the valley\'s only water stops with it.',
    the_wrong_thing: 'there is ONE path worn to it and it goes to the CABINET, not to the pumps. Somebody comes here often and only ever touches the switch. Nothing says why.',
    sand_ruling: 'his 9/23 correction held as a refusal: every ground value sits in the walked city\'s own #6e6045 family on hue AND lightness.',
    size: { image: W + 'x' + H, note: 'a lot and a half at game scale (rule 32f), stated rather than hidden' },
    palette: PALETTE, legend: LEGEND,
    machinePixels: machine, yardPixels: yard, wornPathShare: +share.toFixed(2),
    coverage: Object.fromEntries(Object.keys(used).filter(k => LEGEND[k])
      .map(k => [LEGEND[k].name, +(100 * used[k] / total).toFixed(2)])),
    not_shipped: 'rule 18: a picture for the VOTE tab.',
    build_source: build.toString()
  };

  const out = path.join(REPO, 'banks/BOHEMIA_THE_ONLY_PUMP_9_27_26.txt');
  fs.writeFileSync(out, JSON.stringify(doc));
  if (!JSON.parse(fs.readFileSync(out, 'utf8')).build_source) { console.log('REFUSED: read-back failed'); process.exit(1); }
  fs.writeFileSync(path.join(REPO, 'banks/_pump_grid.json'),
    JSON.stringify({ g, pal: PALETTE, leg: LEGEND, w: W, h: H }));

  console.log('wrote banks/BOHEMIA_THE_ONLY_PUMP_9_27_26.txt');
  console.log('  the plant is ' + (100 * machine / total).toFixed(1) + '% of the frame, the yard '
    + (100 * yard / total).toFixed(1) + '%, the worn path ' + share.toFixed(2) + '%');
}

main();
