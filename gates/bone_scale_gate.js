/* BONE SCALE GATE (8/11/26, WORLD lane) — NOTHING HUMAN OUT-MEASURES THE HUMAN.
 *
 * Paolo 8/11, LOCKED:
 *   "i would challenge you to make sure any bones or skulls are always the same
 *    size as our humans please ... anything thats human decay please make the
 *    art with a person next to it so u get the real scale and size"
 *
 * WHAT WENT WRONG. engine/bohemia_dead.js carried ONE draw height for the whole
 * bank (TILES.scale.skeleton = 1.5 cells), so every one of the 62 judged tiles
 * was drawn 1.75 m long whatever it depicted. Measured against the real baked
 * body (1.74 m) it was wrong in BOTH directions: single skulls at 0.92-1.31 m
 * (a skull is 0.20 m), fully articulated skeletons at 0.64 m, child-sized.
 *
 * THE SIZES ARE FACT, NOT TASTE, which is why a gate may hold them at all. An
 * adult skull is ~20 cm; a femur ~45 cm; a ribcage ~35 cm; a laid-out adult
 * ~1.7 m. Nothing here judges his art -- it only asserts that a thing is drawn
 * the size that thing is. (MECHANISM-MINE / CONTENTS-PAOLO'S.)
 *
 * WHAT IT WILL NOT DO: re-derive the sizes. deadTile(), the reference sheet and
 * this gate all ask BohemiaDead.tileMetres(). Two rulers for one measurement is
 * how 51 imaginary scatter violations got invented on 8/9; the module owns the
 * number and the gate owns whether it is allowed to ship.
 *
 *   node gates/bone_scale_gate.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const D = require(path.join(ROOT, 'engine', 'bohemia_dead.js'));

let pass = 0, fail = 0;
const ok = (label, cond, extra) => {
  if (cond) { pass++; console.log('  ok   ' + label); }
  else { fail++; console.log('  FAIL ' + label + (extra ? '\n         ' + extra : '')); }
};

console.log('BONE SCALE GATE — a skull is a skull, not a man');

const HUMAN = D.TILES.humanMetres;
ok('the human is declared, and it is the measured 1.74 m', HUMAN === 1.74,
   'TILES.humanMetres is ' + HUMAN + '. It is measured off the real baked body; do not drift it by feel.');

/* ---- 1. ONE RULER EXISTS ------------------------------------------------- */
ok('the module exposes tileMetres(), the single ruler for how big a body part is',
   typeof D.tileMetres === 'function');

/* ---- 2. NOTHING IS MAN-SIZED THAT ISN'T A MAN ---------------------------- */
const M = D.TILES.metres || {};
const idx = Object.keys(M).map(Number).sort((a, b) => a - b);
ok('the per-tile table is populated (' + idx.length + ' tiles ruled)', idx.length >= 50,
   'a table this thin means most tiles fall back to the default and the bug is back');

const over = idx.filter(i => M[i] > HUMAN);
ok('no tile out-measures the 1.74 m human' + (over.length ? ' — ' + over.map(i => '#' + i + '=' + M[i]).join(', ') : ''),
   over.length === 0,
   'a pile of bone may be wide, but nothing in this bank is longer than the person it came from');

/* ---- 3. THE SPECIFIC ANATOMY HE POINTED AT ------------------------------- */
/* SKULLS. The loudest failure on the sheet: five skull tiles drawn at 0.92-1.31 m.
   An adult skull is about 20 cm end to end. Held to a hard band, not a wish. */
const SKULLS = [44, 45, 46, 47, 48];
const badSkull = SKULLS.filter(i => !(M[i] >= 0.15 && M[i] <= 0.30));
ok('every single-skull tile is skull-sized, 0.15-0.30 m' +
   (badSkull.length ? ' — ' + badSkull.map(i => '#' + i + '=' + M[i]).join(', ') : ''),
   badSkull.length === 0);

/* FULL SKELETONS. The other direction, and just as wrong: an articulated body
   is a PERSON and must be person-length. */
const BODIES = [34, 35, 36, 37, 39, 40];
const badBody = BODIES.filter(i => !(M[i] >= 1.5 && M[i] <= HUMAN));
ok('every articulated skeleton is person-length, 1.5-1.74 m' +
   (badBody.length ? ' — ' + badBody.map(i => '#' + i + '=' + M[i]).join(', ') : ''),
   badBody.length === 0);

/* A SKULL MUST NEVER BE WITHIN REACH OF A WHOLE BODY. The single assertion that
   would have caught the original bug on day one: the ratio, not the values. */
const skullMax = Math.max(...SKULLS.map(i => M[i]));
const bodyMin = Math.min(...BODIES.map(i => M[i]));
ok('a body is at least 4x a skull (' + bodyMin + ' m vs ' + skullMax + ' m)',
   bodyMin >= skullMax * 4,
   'when one scale served every tile these were EQUAL, and that is exactly what he caught');

/* ---- 4. THE FALLBACK IS SAFE IN BOTH DIRECTIONS -------------------------- */
const dflt = D.TILES.metresDefault;
ok('an unruled tile falls back to a body\'s remains (' + dflt + ' m), never a giant and never a speck',
   dflt >= 0.8 && dflt <= 1.4);
ok('tileMetres() returns the fallback for an index nobody ruled', D.tileMetres(99999) === dflt);
ok('tileMetres() returns the table value where there is one (#44 = ' + D.tileMetres(44) + ' m)',
   D.tileMetres(44) === M[44]);

/* ---- 5. THE RENDERER USES THE RULER, AND USES IT EVERYWHERE -------------- */
/* VERIFY ON THE REAL SURFACE: the engine file being right proves nothing about
   the page. Both draw passes -- outdoors AND indoors -- must go through it. */
const world = fs.readFileSync(path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html'), 'utf8');
const code = world.replace(/\/\*[\s\S]*?\*\//g, '');   // a MENTION is not a USE
ok('the shipped world page sizes bodies off tileMetres()', /BohemiaDead\.tileMetres\(/.test(code),
   'the app is still on the single-scale draw; run python3 tools/bohemia_city_module_resync.py and re-apply the draw patch');
ok('no draw site still multiplies a cell by the old blanket scale', !/C\s*\*\s*d\.scale/.test(code),
   'a C*d.scale left anywhere is a pass still drawing man-sized skulls');
ok('the indoor husk pass goes through the same function as outdoors',
   (code.match(/deadTile\(/g) || []).length >= 4,
   'the indoor pass used to draw its own forced SQUARE, which both squashed judged art and re-broke scale');

/* ---- 6. THE PICTURE HE ASKED FOR ACTUALLY EXISTS ------------------------- */
/* "put a character next to it for reference". A law about a picture is only
   enforced by checking the picture is there. */
const sheet = path.join(ROOT, 'slices', 'look', 'bone-scale.png');
ok('the reference sheet exists — a person next to every bone', fs.existsSync(sheet));
if (fs.existsSync(sheet)) {
  ok('the sheet is a real render, not a stub (' + (fs.statSync(sheet).size / 1024).toFixed(0) + ' KB)',
     fs.statSync(sheet).size > 40 * 1024);
}
const tbl = path.join(ROOT, 'records', 'BOHEMIA_BONE_SCALE_TABLE.json');
ok('the measured table is recorded next to it', fs.existsSync(tbl));
if (fs.existsSync(tbl)) {
  const t = JSON.parse(fs.readFileSync(tbl, 'utf8'));
  ok('the recorded human matches the module (' + t.humanMetres + ' m)', t.humanMetres === HUMAN);
}

console.log('\nBONE SCALE GATE: ' + pass + ' passed, ' + fail + ' failed  (' +
            idx.length + ' tiles ruled, human ' + HUMAN + ' m)');
process.exit(fail ? 1 : 0);
