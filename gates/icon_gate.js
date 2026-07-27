/* ICON GATE (Paolo 7/27/26, LOCKED) — "anytime you build something like this you have
   to make a city builder icon as well like for real."

   Law: laws/BOHEMIA_ADDENDUM_ICON_WITH_EVERY_BUILD_7_27_26.md. A district or surface is
   not finished until it has a city builder icon (a DISTRICT HERO), the same turn the
   ground ships. He said it the turn the WORLD lane shipped the railway and the
   interchange with no way to point at either one in the builder.

   THE SHAPE OF THIS GATE IS A RATCHET, and that is deliberate. 44 types are registered
   and 23 have a hero, so a gate that simply demanded "every type has an icon" would be
   red from the minute it was written, and a permanently-red gate is not a gate — it is
   a comment nobody can act on. Instead:

     1. NEW WORK CANNOT ADD DEBT. Every type in ICON_REQUIRED must have a hero, right
        now. That list is the ground this lane has actually built. Ship a new district or
        surface without an icon and you add it here or this goes red.
     2. THE DEBT CAN ONLY SHRINK. OWED is the explicit, named backlog of types that
        still have no icon. If a type in OWED gains a hero it must be REMOVED from OWED
        (the gate fails if a listed type is already done), and no type may appear in OWED
        that is not actually registered. The number is printed every run so it cannot
        quietly grow.
     3. AN ICON IS REAL ART. Not a flat fill, not a letter, not a colour square — the
        law names those as non-satisfying. Measured: the sprite has real size, real
        opaque coverage, and more than a handful of distinct colours (a flat diamond has
        one or two).
     4. IT IS ACTUALLY REACHABLE. The sprite is wired into the CITY tab the builder
        renders, with its anchor, which is what makes it an icon rather than a file.

   Run: node gates/icon_gate.js   Registered as ICON. */
'use strict';
const fs = require('fs');
const zlib = require('zlib');
const K = require('../engine/bohemia_district_kit.js');
const World = require('../engine/bohemia_world.js');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const BANK = 'banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt';
ok('the district hero bank exists', fs.existsSync(BANK));
if (!fs.existsSync(BANK)) { console.log('ICON GATE: ' + pass + ' passed, ' + (fail) + ' failed'); process.exit(1); }
const bank = JSON.parse(fs.readFileSync(BANK, 'utf8'));
const HERO = {};
bank.heroes.forEach(h => { HERO[h.district] = h; });

/* THE GROUND THIS LANE BUILT AND MUST KEEP COVERED. Anything shipped from here on goes
   in this list the same turn, which is the whole point of the ruling. */
const ICON_REQUIRED = ['rail', 'interchange', 'campus', 'speedway'];

/* THE DEBT, NAMED. Every registered type with no icon yet. This list may only ever get
   shorter. airport/airbase are called out separately below because they are not merely
   un-started — they were built, they failed the readability bar, and the reason is
   written down in the factory so nobody re-walks it. */
const OWED = [
  'suburb', 'trailer', 'apartment', 'wash', 'cemetery', 'drivein', 'golf', 'jail',
  'chapel', 'landfill', 'railyard', 'substation', 'watertreat', 'boneyard', 'waterpark',
  'airport', 'airbase', 'arterial', 'freeway', 'desert', 'mountain', 'water',
];

// ---- 1. NEW WORK CANNOT ADD DEBT --------------------------------------------
{
  const missing = ICON_REQUIRED.filter(t => !HERO[t]);
  ok('every type this lane has shipped has its city builder icon (' +
     (ICON_REQUIRED.length - missing.length) + '/' + ICON_REQUIRED.length +
     (missing.length ? ', missing: ' + missing.join(' ') : '') + ')', missing.length === 0);
  const unregistered = ICON_REQUIRED.filter(t => !K.get(t));
  ok('and each of them is a real registered type', unregistered.length === 0);
}

// ---- 2. THE DEBT CAN ONLY SHRINK --------------------------------------------
{
  const types = K.types();
  const done = OWED.filter(t => HERO[t]);
  ok('nothing listed as OWED is secretly already done (remove it from the list: ' +
     done.join(' ') + ')', done.length === 0);
  const bogus = OWED.filter(t => types.indexOf(t) < 0);
  ok('every OWED type is a real registered type (' + bogus.join(' ') + ')', bogus.length === 0);
  const uncounted = types.filter(t => !HERO[t] && OWED.indexOf(t) < 0);
  ok('no type is missing an icon WITHOUT being named in the debt list (' +
     uncounted.join(' ') + ')', uncounted.length === 0);
  const haveN = types.filter(t => HERO[t]).length;
  console.log('  ICON DEBT: ' + OWED.length + ' of ' + types.length +
              ' registered types still owe an icon (' + haveN + ' have one)');
}

// ---- 3. AN ICON IS REAL ART, NOT A COLOURED SQUARE --------------------------
/* The law names exactly what does not satisfy it. A flat fill, a letter or a recoloured
   diamond all collapse to a tiny number of distinct colours over a trivially simple
   silhouette; a baked 3D sprite does not. Measured on the PNG bytes, no decoder needed:
   the IDAT is inflated and the raw scanlines sampled. */
function pixels(b64) {
  const buf = Buffer.from(b64, 'base64');
  let off = 8, w = 0, h = 0, bitDepth = 0, colorType = 0;
  const idat = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString('ascii', off + 4, off + 8);
    if (type === 'IHDR') {
      w = buf.readUInt32BE(off + 8); h = buf.readUInt32BE(off + 12);
      bitDepth = buf[off + 16]; colorType = buf[off + 17];
    } else if (type === 'IDAT') idat.push(buf.slice(off + 8, off + 8 + len));
    else if (type === 'IEND') break;
    off += 12 + len;
  }
  const chan = colorType === 6 ? 4 : (colorType === 2 ? 3 : 0);
  if (!chan || bitDepth !== 8) return null;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  /* UNDO THE PNG ROW FILTERS. The first pass read the filtered bytes directly, which
     is not the image: alpha comes out meaningless, so the opacity test could never
     pass. Measuring the real pixels is only these few lines, and it is the difference
     between a gate that checks the art and a gate that checks a compression artefact. */
  const stride = w * chan;
  const out = Buffer.alloc(h * stride);
  for (let y = 0; y < h; y++) {
    const ft = raw[y * (stride + 1)];
    const src = y * (stride + 1) + 1, dst = y * stride, up = dst - stride;
    for (let i = 0; i < stride; i++) {
      const x = raw[src + i];
      const a = i >= chan ? out[dst + i - chan] : 0;
      const b = y > 0 ? out[up + i] : 0;
      const c = (y > 0 && i >= chan) ? out[up + i - chan] : 0;
      let v;
      if (ft === 0) v = x;
      else if (ft === 1) v = x + a;
      else if (ft === 2) v = x + b;
      else if (ft === 3) v = x + ((a + b) >> 1);
      else {
        const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c);
        v = x + ((pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c));
      }
      out[dst + i] = v & 0xff;
    }
  }
  const cols = new Set();
  let opaque = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const p = y * stride + x * chan;
    if (chan === 4 && out[p + 3] < 24) continue;
    opaque++;
    cols.add((out[p] << 16) | (out[p + 1] << 8) | out[p + 2]);
  }
  return { w: w, h: h, opaque: opaque, colors: cols.size };
}

{
  let real = 0, checked = 0, worstCol = 1e9, worstAt = null;
  ICON_REQUIRED.forEach(t => {
    const h = HERO[t];
    if (!h) return;
    checked++;
    const m = pixels(h.b64);
    if (!m) return;
    if (m.colors < worstCol) { worstCol = m.colors; worstAt = t; }
    if (m.w >= 120 && m.h >= 90 && m.opaque > m.w * m.h * 0.20 && m.colors >= 24) real++;
  });
  ok('every required icon is real art, not a flat fill (' + real + '/' + checked +
     ', thinnest ' + worstAt + ' @ ' + worstCol + ' distinct values)', checked > 0 && real === checked);

  ICON_REQUIRED.forEach(t => {
    const h = HERO[t];
    if (!h) return;
    ok(t + ': the icon carries its plant anchor', Number.isFinite(h.bx) && Number.isFinite(h.by));
    ok(t + ': the icon says what it is', typeof h.label === 'string' && h.label.length > 40);
  });
}

// ---- 4. IT IS REACHABLE FROM THE THING PAOLO TOUCHES ------------------------
{
  const alpha = fs.readFileSync('slices/BOHEMIA_ALPHA_0_9.html', 'utf8');
  const m = /const CITY_B64\s*=\s*'([^']+)'/.exec(alpha);
  ok('the alpha carries the CITY builder payload', !!m);
  if (m) {
    const dec = Buffer.from(m[1], 'base64').toString('utf8');
    ok('the builder has a hero draw path at all', dec.indexOf('function drawHero(') >= 0);
    let wired = 0;
    ICON_REQUIRED.forEach(t => {
      if (dec.indexOf('"' + t + '":"data:image/png;base64,') >= 0 &&
          new RegExp('"' + t + '":\\{"bx":\\d+,"by":\\d+\\}').test(dec)) wired++;
    });
    ok('every required icon is wired into the CITY tab with its anchor (' + wired + '/' +
       ICON_REQUIRED.length + ')', wired === ICON_REQUIRED.length);
  }
}

// ---- 5. THE LAW IS ON DISK ---------------------------------------------------
{
  const LAW = 'laws/BOHEMIA_ADDENDUM_ICON_WITH_EVERY_BUILD_7_27_26.md';
  ok('the ruling is recorded', fs.existsSync(LAW));
  if (fs.existsSync(LAW)) {
    const t = fs.readFileSync(LAW, 'utf8');
    // whitespace-normalised AND blockquote-stripped: the law wraps his quote across
    // lines for readability and each line carries a markdown "> ". A gate that breaks
    // on a line wrap is testing the margin, not the words.
    const flat = t.replace(/^\s*>\s?/gm, '').replace(/\s+/g, ' ');
    ok('and it quotes him verbatim',
       flat.indexOf('you have to make a city builder icon as well like for real') >= 0);
  }
  // the surfaces are still surfaces: an icon does not promote anything to a district
  ok('giving a surface an icon did not turn it into a district',
     !World.isAutoDistrict('rail') && !World.isAutoDistrict('interchange') &&
     World.isSurfaceCell('rail') && World.isSurfaceCell('interchange'));
}

console.log('ICON GATE: ' + pass + ' passed, ' + fail + ' failed  (' +
            Object.keys(HERO).length + ' icons drawn, ' + OWED.length + ' owed)');
process.exit(fail ? 1 : 0);
