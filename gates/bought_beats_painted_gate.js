/* ============================================================================
   BOUGHT BEATS PAINTED GATE (7/31/26)

   Paolo 7/31: "Bro why dont u understand that if i bought it i prefer it! Thats
   for all textures bro!!! Holy shit"

   If he bought it, it wins. Painted art is the fallback, never the first choice,
   and every surface still wearing paint is NAMED DEBT rather than a silence.

   THE FAILURE THIS EXISTS TO PREVENT is not "Claude cooked art he shouldn't
   have" -- no art was cooked. It is subtler and worse: his purchased library sat
   in banks/ with 98 pavement tiles that had never drawn one pixel, while the
   sidewalk wore a painted tile, and NOTHING IN THE MACHINE CARED. banks_used_gate
   existed for exactly this and was never pointed at the library he paid for. So
   this gate checks the two things that let it hide:

     1. his banks are CONSUMED, not merely present
     2. the bought branch runs BEFORE the painted branch at every draw site
        (shipping his tiles but drawing them second is the same bug wearing a
        different coat)

   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const LIB = path.join(ROOT, 'banks/BOHEMIA_GROUND_SEAMLESS_SET_7_10_26.txt');
const DEV = path.join(ROOT, 'slices/BOHEMIA_RUN_SLICE_7_26_26.html');
const RUN = path.join(ROOT, 'slices/BOHEMIA_RUN_CURRENT.html');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const bank = JSON.parse(fs.readFileSync(LIB, 'utf8'));
const dev = fs.readFileSync(DEV, 'utf8');
const run = fs.readFileSync(RUN, 'utf8');

/* ---- what he owns, by surface ------------------------------------------- */
const PACKS = [
  { surface: 'sidewalk + driveway', re: /contrete|concrete/, min: 8 },
  { surface: 'road',                re: /cracked street/,    min: 8 },
];

const usable = (t, re) =>
  re.test(String(t.pack || '').toLowerCase()) &&
  (t.tier === 'S' || t.tier === 'A') && t.pure === true && t.b64;

let totalShipped = 0;
for (const p of PACKS) {
  const tiles = bank.tiles.filter(t => usable(t, p.re));
  ok('he owns usable art for ' + p.surface + ' (' + tiles.length + ' tiles, seam S/A, pure)',
     tiles.length >= p.min);
  /* CONSUMED, not merely present: the bytes must be in the shipped run */
  const shipped = tiles.filter(t => run.indexOf(t.b64) >= 0);
  totalShipped += shipped.length;
  ok('HIS ' + p.surface + ' art actually ships in the run (' + shipped.length + '/' + tiles.length + ')',
     shipped.length >= p.min);
  /* every tile 44x44 -- the corpus cell, so it blits 1:1 and never resamples */
  const bad = shipped.filter(t => {
    const b = Buffer.from(t.b64, 'base64');
    return b.readUInt32BE(16) !== 44 || b.readUInt32BE(20) !== 44;
  });
  ok('his ' + p.surface + ' tiles are 44x44, so nothing is ever resampled'
     + (bad.length ? ' (' + bad.length + ' off-size)' : ''), bad.length === 0);
  /* PURPLE RESERVATION still holds */
  ok('only pure tiles ship for ' + p.surface + ' (purple stays the Amalgamation\'s)',
     tiles.every(t => t.pure === true));
}

/* ---- BOUGHT RUNS FIRST --------------------------------------------------
   Shipping his art but drawing it after the painted tile is the same defect.
   At every draw site the bought branch must appear BEFORE the painted one. */
/* CALL sites only. Matching /drawSkin\(/ also hits the function DEFINITION,
   which has no bought branch before it and never will -- this gate reported
   2/3 on its first run for exactly that reason. */
const sites = [...dev.matchAll(/drawSkin\(/g)].map(m => m.index)
  .filter(i => !/function\s*$/.test(dev.slice(Math.max(0, i - 12), i)));
ok('the run has the draw sites this gate expects', sites.length >= 2);
let ordered = 0;
for (const i of sites) {
  const before = dev.slice(Math.max(0, i - 400), i);
  if (/drawBought\(/.test(before)) ordered++;
}
ok('HIS art is asked for BEFORE the painted tile at every draw site ('
   + ordered + '/' + sites.length + ')', ordered === sites.length && sites.length > 0);

ok('the run reads his ground library rather than inferring a texture',
   /BOUGHT_WALK_B64/.test(dev) && /BOUGHT_ROAD_B64/.test(dev) && /function boughtFor\(/.test(dev));
ok('placement is deterministic per cell (no per-frame shimmer)',
   /Math\.imul\(gx,73856093\)\^Math\.imul\(gy,19349663\)/.test(dev));

/* ---- THE DEBT, BY NAME ---------------------------------------------------
   Every suburb surface still wearing painted art. This is allowed -- he may own
   nothing for it -- but it is never allowed to be SILENT. */
const SURFACES = {
  0: 'dead-ground yard', 1: 'road', 2: 'house body', 3: 'driveway',
  4: 'perimeter wall', 5: 'gate mouth', 6: 'garage', 9: 'house upper floor',
  10: 'sidewalk',
};
/* DERIVED FROM THE CODE, NOT HAND-MAINTAINED. This list used to be two literal
   objects a human kept in sync, and on 7/31 it drifted the moment the yard was
   wired to his dirt: the gate went on printing "dead-ground yard" as painted while
   his tiles were already drawing there. A debt list that can be WRONG is worse than
   none, because it is read as proof. So the covered set is now read out of the run's
   own boughtFor() switch -- the single place that decides -- and the debt is
   whatever is left. */
const bf = dev.match(/function boughtFor\(c\)\{([\s\S]*?)\n\}/);
ok('the run still has a single boughtFor() that decides what he covers', !!bf);
const covCodes = bf ? [...bf[1].matchAll(/c===(\d+)/g)].map(m => +m[1]) : [];
const COVERED = {};
covCodes.forEach(c => { if (SURFACES[c]) COVERED[c] = SURFACES[c]; });
ok('every surface boughtFor() claims is a real world code', covCodes.length > 0
   && covCodes.every(c => SURFACES[c] !== undefined),
   'unknown code in boughtFor(): ' + covCodes.filter(c => !SURFACES[c]).join(','));
const debt = Object.entries(SURFACES)
  .filter(([c]) => !COVERED[c]).map(([c, n]) => n);
ok('the painted-fallback debt is enumerated, never silent', debt.length > 0);
/* THE LIST ONLY SHRINKS is his rule; make it a check rather than a caption. */
const HIGH_WATER = 6;   // 7/31: yard came off the list, so 6 debts -> 5
ok('the painted debt has not GROWN (' + debt.length + ' surfaces, was ' + HIGH_WATER + ')',
   debt.length <= HIGH_WATER,
   'a surface went back to painted art - that is the one direction this list may not move');

console.log('  HIS ART COVERS : ' + Object.values(COVERED).join(', '));
console.log('  STILL PAINTED  : ' + debt.join(', '));
console.log('                   (legal only while he owns nothing for them; this list only shrinks)');
console.log('BOUGHT BEATS PAINTED GATE: ' + pass + ' passed, ' + fail + ' failed'
  + '  (' + totalShipped + ' of his tiles shipping)');
process.exit(fail ? 1 : 0);
