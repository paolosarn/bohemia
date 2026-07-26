#!/usr/bin/env node
/* ============================================================================
   BOHEMIA — FACE CANON GATE (7/20/26)
   Born from Paolo's rage: "DIDN'T I FIX THE FUCKING FACE WITH YOU?? WHY IS
   THE UPDATED FACE NOT UPDATED EVERYWHERE?" His 7/19 face calibration WAS
   baked — and a stale device save (autosaved before the bake) was wholesale-
   restoring all-zero offsets over it on every boot, while the combat/city
   bake key didn't carry the calibration at all. Locks:
     1. THE RECORD IS THE TRUTH: the offsets baked in FACE_OFFSETS match
        records/BOHEMIA_FACE_CALIBRATION_7_19_26.txt line for line.
     2. FACE CANON FLOOR: restore() merges saves per-feature, zeros defer
        to canon (the stale-save bulldozer is dead).
     3. FACE EVERYWHERE: lookKey() carries FACE_OFFSETS so combat/city
        rebake when the calibration changes; buildFrame applies faceOffset.
   ============================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const alpha = fs.readFileSync(path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html'), 'utf8');
const rec = fs.readFileSync(path.join(ROOT, 'records', 'BOHEMIA_FACE_CALIBRATION_7_19_26.txt'), 'utf8');

let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log('  PASS ' + name); }
  else { fail++; console.log('  FAIL ' + name + (extra ? ' -- ' + extra : '')); }
}

/* ---- 1. record vs baked canon ---- */
const recVals = {};
for (const m of rec.matchAll(/^(S|SE|E|NE|N|NW|W|SW)\s+(eyes|nose|lips|ears):\s*dx=(-?\d+)\s+dy=(-?\d+)/gm))
  (recVals[m[1]] = recVals[m[1]] || {})[m[2]] = [+m[3], +m[4]];
ok('record parses (has E and W)', !!(recVals.E && recVals.W));
const cm = alpha.match(/const CANON=\{([\s\S]*?)\};/);
ok('alpha carries the baked CANON block', !!cm);
let canon = null;
try { canon = eval('({' + cm[1] + '})'); } catch (e) {}
ok('CANON block evals', !!canon);
let match = true, why = '';
for (const d in recVals) for (const f in recVals[d]) {
  const c = (canon[d] || {})[f] || [0, 0];
  if (c[0] !== recVals[d][f][0] || c[1] !== recVals[d][f][1]) { match = false; why = d + '/' + f; }
}
for (const d in canon) for (const f in canon[d]) {
  const r = (recVals[d] || {})[f];
  if (!r) { match = false; why = 'extra ' + d + '/' + f; }
}
ok('BAKED CANON === THE RECORD, both directions', match, why);

/* ---- 2. the canon floor ---- */
const rs = alpha.slice(alpha.indexOf('restore(){'), alpha.indexOf('restore(){') + 2600);
ok('stale-save bulldozer is dead (no wholesale FACE_OFFSETS=d.faceOffsets)', !/FACE_OFFSETS=d\.faceOffsets/.test(rs));
ok('restore merges per-feature, zeros defer to canon', /_fv&&\(_fv\[0\]\|\|_fv\[1\]\)/.test(rs));

/* ---- 3. face everywhere ---- */
const lk = alpha.slice(alpha.indexOf('function lookKey'), alpha.indexOf('let CBAKE'));
ok('lookKey carries FACE_OFFSETS (combat/city rebake on calibration change)', /FACE_OFFSETS/.test(lk));
ok('buildFrame applies faceOffset to facial pixels', /faceOffset\(d,feat\)/.test(alpha));
ok('frameLookHash carries FACE_OFFSETS (2D caches rebuild)', /FACE_OFFSETS!=='undefined'\?FACE_OFFSETS\[d\]/.test(alpha));

console.log('\n=== FACE CANON GATE: ' + pass + ' passed, ' + fail + ' FAILED ===');
process.exit(fail ? 1 : 0);
