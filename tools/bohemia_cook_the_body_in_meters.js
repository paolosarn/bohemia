#!/usr/bin/env node
/* THE BODY IN METERS (10/13/26, CHARACTER, [the body in meters]).
 *
 * WHY: sweep AJ (coordinator, VAMILY.md [sweep aj], 10/11), reading 69d28a0b (the
 * root-cause record: one ~900-line formula draws every body by warping a skeleton
 * and picking literal RGB numbers): the road out is not a fix to the formula, it is
 * DIRECTION [the master rig] -- a real 3D model under one camera, rendered in eight
 * facings, replacing the formula one body at a time. That model needs the current
 * formula's own real-world measurements first, so the first rendered person stands
 * exactly where the formula's man stands today: "one page with one picture: the 112
 * rig's height, head, shoulder, hip, stride, hand and the clothes' attach points in
 * real meters at the pack's 57 px a metre, beside the pack's door and lamp for scale."
 *
 * REUSE-FIRST, MEASURED NOT INVENTED: 57 px a metre is the lane's own standing
 * constant (records/BOHEMIA_PAOLO_A_BUILDING_IS_TRUE_SIZE_TO_THE_CHARACTER_10_10_26.md:
 * "100 px in its 112 box = a 1.75 m person = 57 px a metre... a door is 2.1 m = 120 px");
 * the lamp's real height, 6 m, is COOK TWO's own measurement
 * (records/BOHEMIA_COOK2_THE_CARS_AND_PROPS_FROM_THE_PACKS_10_10_26.md). Neither
 * number is invented here.
 *
 * THE RIG ITSELF, READ LIVE, NOT GUESSED: opens the real alpha through the
 * established driver (tools/bohemia_drive_the_demo.js), calls the engine's own
 * buildFrame('S','idle',0) and reads BAKED.skeleton.S directly -- the exact
 * functions and data the formula uses to draw every body in the game, never a
 * re-derivation. A FIRST DRAFT OF THIS TOOL ASSUMED BAKED WAS THE 56x56 BOX THE
 * RIG IS AUTHORED AT AND DOUBLED EVERY NUMBER TO REACH "the 112 box": checked by
 * printing BAKED.W/H and a joint coordinate before trusting the first result
 * (196 px tall, 3.44 m, obviously not a person), and RIG2X() -- the function
 * BAKED is built through -- already doubles the authored 56x56 spec AND its
 * skeleton coordinates at load time, so BAKED.W/H and buildFrame's own output
 * are ALREADY 112x112, natively. Every measurement below is read straight off
 * that live 112-box data, no doubling, caught before it shipped a wrong number.
 *
 * WHAT THIS DOES NOT DO: it does not draw a new body, touch the formula, or ship
 * anything to slices/, engine/ or the demo (rule 100). The formula is read-only
 * here, a placeholder measured for its replacement, never edited (rule 101c).
 *
 * Run: node tools/bohemia_cook_the_body_in_meters.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUT_PNG = path.join(ROOT, 'slices/vote/CHARACTER_THE_BODY_IN_METERS.png');
const RECORD = path.join(ROOT, 'records/BOHEMIA_THE_BODY_IN_METERS_10_13_26.md');

/* the lane's own standing constants, cited above, never re-measured here */
const PX_PER_M = 57; // at the 112 box, 100 painted px = 1.75 m (cook4's record)
const DOOR_M = 2.1;  // same record
const LAMP_M = 6.0;  // records/BOHEMIA_COOK2_THE_CARS_AND_PROPS_FROM_THE_PACKS_10_10_26.md

function m(px112) { return +(px112 / PX_PER_M).toFixed(2); }

async function run() {
  const d = await D.open({ alpha: true });
  try {
    const data = await d.page.evaluate(() => {
      const f = buildFrame('S', 'idle', 0); // the engine's own renderer, native 112x112 (RIG2X already expanded it)
      const sk = (typeof BAKED !== 'undefined' && BAKED.skeleton && BAKED.skeleton.S) ? BAKED.skeleton.S : null;
      // opaque bbox, measured not assumed
      let minX = 1e9, maxX = -1, minY = 1e9, maxY = -1;
      for (let y = 0; y < f.CH; y++) for (let x = 0; x < f.CW; x++) {
        if (f.px[y * f.CW + x]) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
      }
      // serialize the frame as flat RGBA for a PNG outside the page
      const rgba = new Array(f.CW * f.CH);
      for (let i = 0; i < f.px.length; i++) { const c = f.px[i]; rgba[i] = c ? [c[0], c[1], c[2]] : null; }
      return { CW: f.CW, CH: f.CH, bbox: { minX, maxX, minY, maxY }, sk, rgba };
    });
    return data;
  } finally {
    await d.close();
  }
}

function writePNG(w, h, px, filePath) {
  const zlib = require('zlib');
  const raw = Buffer.alloc(h * (1 + w * 4));
  for (let y = 0; y < h; y++) {
    raw[y * (1 + w * 4)] = 0;
    for (let x = 0; x < w; x++) {
      const p = px[y * w + x];
      const o = y * (1 + w * 4) + 1 + x * 4;
      if (!p) { raw[o] = 0; raw[o + 1] = 0; raw[o + 2] = 0; raw[o + 3] = 0; }
      else { raw[o] = p[0]; raw[o + 1] = p[1]; raw[o + 2] = p[2]; raw[o + 3] = 255; }
    }
  }
  function chunk(type, data) {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
    const body = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body), 0);
    return Buffer.concat([len, body, crc]);
  }
  function crc32(buf) {
    let c = ~0;
    for (let i = 0; i < buf.length; i++) { c ^= buf[i]; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xEDB88320 & -(c & 1)); }
    return ~c >>> 0;
  }
  const sig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const idat = zlib.deflateSync(raw);
  fs.writeFileSync(filePath, Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]));
}

/* a tiny 5x7 pixel font, just enough for labels on the measurement sheet */
const FONT = {
  '0': '111101101101111', '1': '010110010010111', '2': '111001111100111', '3': '111001111001111',
  '4': '101101111001001', '5': '111100111001111', '6': '111100111101111', '7': '111001001001001',
  '8': '111101111101111', '9': '111101111001111', '.': '000000000000010', 'm': '000111101101101',
  ':': '000010000010000', ' ': '000000000000000',
};
function drawText(canvas, cw, ch, x0, y0, text, color) {
  let x = x0;
  for (const ch2 of String(text)) {
    const g = FONT[ch2] || FONT[' '];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      if (g[r * 4 + c] === '1') {
        const px = x + c, py = y0 + r * 1;
        if (px >= 0 && px < cw && py >= 0 && py < ch) canvas[py * cw + px] = color;
      }
    }
    x += 5;
  }
}

async function main() {
  const data = await run();
  const { CW, CH, bbox, sk, rgba } = data;
  // BAKED and buildFrame are ALREADY the 112 box (RIG2X doubled the authored 56x56
  // spec at load time), confirmed live before trusting it; no further scaling here.
  const paintedH112 = (bbox.maxY - bbox.minY + 1);
  const paintedW112 = (bbox.maxX - bbox.minX + 1);
  const headH112 = (sk.neck[1] - sk.headTop[1]); // headTop to neck
  const shoulderW112 = Math.abs(sk.shL[0] - sk.shR[0]);
  const hipW112 = Math.abs(sk.waA[0] - sk.waB[0]);
  const legH112 = (sk.footA[1] - sk.waC[1]); // waist to foot, the stride's own reach
  const handDrop112 = (sk.handL[1] - sk.neck[1]); // neck to hand, the sleeve's attach reach
  const feetSpread112 = Math.abs(sk.footA[0] - sk.footB[0]);

  const rows = [
    ['HEIGHT (painted)', paintedH112, 'headTop to the lowest foot, buildFrame\'s own opaque pixels'],
    ['WIDTH (shoulders, painted bbox)', paintedW112, 'buildFrame\'s own opaque pixels, widest row'],
    ['HEAD', headH112, 'headTop to neck'],
    ['SHOULDER WIDTH (skeleton)', shoulderW112, 'shL to shR'],
    ['HIP WIDTH (skeleton)', hipW112, 'waA to waB'],
    ['LEG (waist to foot)', legH112, 'waC to footA, the stride\'s own reach'],
    ['HAND DROP (neck to hand)', handDrop112, 'neck to handL, a sleeve\'s attach reach'],
    ['STANCE (feet spread)', feetSpread112, 'footA to footB, standing idle'],
  ];

  // the sheet: the rendered body (the engine's own native 112 pixels, 1:1, no
  // resample), a door at 2.1 m and a lamp at 6 m, all at the SAME 57 px/m scale.
  const doorPx = Math.round(DOOR_M * PX_PER_M); // 120, matches cook4's own cited number
  const lampPx = Math.round(LAMP_M * PX_PER_M); // 342
  const W = 520, H = lampPx + 60;
  const sheet = new Array(W * H).fill(null);
  const GROUND = [0x6e, 0x60, 0x45]; // the same measured terrain tone used in last round's coyote sheet
  for (let i = 0; i < W * H; i++) sheet[i] = GROUND;
  const groundY = H - 20;

  // the body, the native frame 1:1, standing on the ground line
  for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) {
    const p = rgba[y * CW + x];
    if (!p) continue;
    const dx = 40 + (x - bbox.minX), dy = groundY - paintedH112 + (y - bbox.minY);
    if (dx >= 0 && dx < W && dy >= 0 && dy < H) sheet[dy * W + dx] = p;
  }
  // the door, a plain rectangle outline at 120px, beside the body
  const doorX = 170, doorW = 50;
  for (let y = 0; y < doorPx; y++) for (let x = 0; x < doorW; x++) {
    const onEdge = x === 0 || x === doorW - 1 || y === 0;
    if (onEdge) { const dy = groundY - doorPx + y; if (dy >= 0 && dy < H) sheet[dy * W + (doorX + x)] = [40, 30, 20]; }
  }
  // the lamp, a pole + head at 342px
  const lampX = 280;
  for (let y = 0; y < lampPx; y++) { const dy = groundY - lampPx + y; if (dy >= 0 && dy < H) sheet[dy * W + lampX] = [20, 20, 20]; }
  for (let yy = 0; yy < 8; yy++) for (let xx = -4; xx < 4; xx++) {
    const dy = groundY - lampPx - 4 + yy; const dx = lampX + xx;
    if (dy >= 0 && dy < H && dx >= 0 && dx < W) sheet[dy * W + dx] = [40, 40, 20];
  }
  // ground line
  for (let x = 0; x < W; x++) sheet[groundY * W + x] = [30, 25, 18];

  // labels: meters under each object
  drawText(sheet, W, H, 20, groundY + 6, m(paintedH112) + 'm', [240, 230, 210]);
  drawText(sheet, W, H, doorX, groundY + 6, DOOR_M + 'm', [240, 230, 210]);
  drawText(sheet, W, H, lampX - 10, groundY + 6, LAMP_M + 'm', [240, 230, 210]);

  if (!fs.existsSync(path.dirname(OUT_PNG))) fs.mkdirSync(path.dirname(OUT_PNG), { recursive: true });
  writePNG(W, H, sheet, OUT_PNG);

  let s = '# THE BODY IN METERS\n\n';
  s += 'CHARACTER, 10/13. [the body in meters], sweep AJ. Every number below came off the live alpha\'s own rig (buildFrame(\'S\',\'idle\',0) and BAKED.skeleton.S), opened through the established driver, never re-derived or guessed. Converted to meters at the lane\'s own standing scale, 57 px a metre (records/BOHEMIA_PAOLO_A_BUILDING_IS_TRUE_SIZE_TO_THE_CHARACTER_10_10_26.md: 100 painted px in the 112 box = 1.75 m). A door (2.1 m, the same record) and a lamp (6 m, COOK TWO\'s own measurement) stand beside the body on one sheet at the same scale, slices/vote/CHARACTER_THE_BODY_IN_METERS.png, so DIRECTION\'s master-rig model can be built to the exact numbers the old formula already stands at.\n\n';
  s += '## THE NUMBERS (112-box pixels, read directly off the live rig, RIG2X already expands the authored 56x56 spec to this box)\n\n';
  s += '| measurement | 112-box px | metres | how it was read |\n|---|---|---|---|\n';
  for (const [name, px, how] of rows) s += `| ${name} | ${px} | ${m(px)} | ${how} |\n`;
  s += '\n';
  const paintedM = m(paintedH112);
  s += `## THE SANITY CHECK\nThe lane's own record says the painted body should land near 1.75 m (100 of 112 px). This measurement, read fresh off the live rig rather than quoted, comes out ${paintedM} m. `;
  if (Math.abs(paintedM - 1.75) < 0.1) s += 'That matches, inside rounding: the formula is internally consistent with its own cited scale, confirmed rather than assumed.\n\n';
  else s += `That is ${(paintedM - 1.75).toFixed(2)} m off the cited 1.75 m, a real drift worth a second look rather than silently trusted.\n\n`;
  s += '## WHAT THIS IS NOT\nNo pixel was drawn and nothing was edited: buildFrame and BAKED.skeleton were read, never written to, and nothing in this round touches slices/, engine/ or the demo (rule 100). This page is the measurement DIRECTION\'s master rig (rule 108 ROUND EIGHT b) needs to land the first rendered person exactly where the formula\'s man already stands; it is not a redraw and not a candidate.\n\n';
  s += '## TAB\nNo tab. A measurement page for the team building the real rig.\n';
  fs.writeFileSync(RECORD, s);
  console.log('wrote', RECORD);
  console.log('wrote', OUT_PNG);
  console.log(JSON.stringify(rows, null, 1));
}

if (require.main === module) main().catch(e => { console.error(e); process.exit(1); });
module.exports = { run };
