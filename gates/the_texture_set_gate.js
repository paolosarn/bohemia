#!/usr/bin/env node
/* THE TEXTURE SET GATE (10/17/26, CHARACTER, [the texture set]).
 *
 * A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED. The texture set is the clothes this lane owns,
 * cut off the formula into pieces a rigged model wears, with attach points in metres. The set is
 * GENERATED (tools/bohemia_cook_the_texture_set.js) and can rot three ways, and this gate is
 * the one that says so: a garment cooked onto the rail that the set does not carry; an attach
 * point that disagrees with the ruler (57 px a metre, the ground at the body's feet); and a set
 * that cannot put the clothes back on the body it was cut from.
 *
 * NO BROWSER. The cut opens the alpha; this gate reads what the cut wrote (the manifest and the
 * atlases) and the alpha's own source for the rail. The self-built-door count (292 checkers open
 * a browser; the baseline may only shrink) does not grow by one here.
 *
 * MUTATION-PROVEN: a planted manifest with a wrong ruler, a missing garment and a piece whose
 * metres disagree with its pixels must go red before the real one is trusted.
 *
 *   node gates/the_texture_set_gate.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const ROOT = path.dirname(__dirname);
const SET = path.join(ROOT, 'records/character/texture_set');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => { console.log('\n=== THE TEXTURE SET: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };
const PPM = 57, BOX = 112, FACINGS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

/* the checks, as a function, so the planted manifest runs through the same code */
function judge(man, quiet) {
  const why = [];
  if (!man || !man.ruler || man.ruler.px_per_m !== PPM || man.ruler.box_px !== BOX) why.push('the ruler is not 57 px a metre in the 112 box');
  if (!Array.isArray(man.facings) || man.facings.join() !== FACINGS.join()) why.push('the eight facings are not the rig\'s eight in the rig\'s order');
  const gs = Array.isArray(man.garments) ? man.garments : [];
  if (gs.length < 300) why.push('fewer than 300 garments in the set (' + gs.length + ')');
  let pieces = 0, badM = 0, noJoint = 0, missingFacing = 0;
  for (const g of gs) for (const f of FACINGS) {
    const F = g.facings && g.facings[f]; if (!F) { missingFacing++; continue; }
    const pf = man.per_facing && man.per_facing[f]; if (!pf) { missingFacing++; continue; }
    for (const p of F.pieces || []) {
      pieces++;
      if (!p.joint || !pf.joints || !pf.joints[p.joint]) { noJoint++; continue; }
      const j = pf.joints[p.joint];
      /* the metres must be the pixels over the ruler, both ways of saying it */
      const dx = (p.box_px[0] - j[0]) / PPM, dy = (p.box_px[1] - j[1]) / PPM;
      const wx = (p.box_px[0] - pf.centre_x) / PPM, up = (pf.ground_row - p.box_px[1]) / PPM;
      if (Math.abs(dx - p.at_joint_m[0]) > 0.002 || Math.abs(dy - p.at_joint_m[1]) > 0.002 || Math.abs(wx - p.world_m.x) > 0.002 || Math.abs(up - p.world_m.up) > 0.002) badM++;
    }
  }
  if (missingFacing) why.push(missingFacing + ' garment-facings missing from the set');
  if (noJoint) why.push(noJoint + ' pieces hang from no joint');
  if (badM) why.push(badM + ' pieces whose metres disagree with their pixels over the ruler');
  const rt = man.round_trip && man.round_trip.summary;
  if (!rt || rt.outfits_x_facings < 100) why.push('the round trip was not run over the outfits the game ships');
  else if (rt.mean_diff_px > 40) why.push('the clothes put back on the body miss it by ' + rt.mean_diff_px + ' px on average (floor 40)');
  return { why, pieces, garments: gs.length };
}

/* 1. THE PLANT. The same judge must refuse a set with the three rots. */
{
  const plant = { ruler: { px_per_m: 56, box_px: 112 }, facings: FACINGS, per_facing: {}, garments: [], round_trip: { summary: { outfits_x_facings: 200, mean_diff_px: 90 } } };
  for (const f of FACINGS) plant.per_facing[f] = { ground_row: 106, centre_x: 56, joints: { neck: [56, 32] } };
  for (let i = 0; i < 301; i++) { const g = { n: 'G' + i, facings: {} }; for (const f of FACINGS) g.facings[f] = { pieces: [{ joint: 'neck', box_px: [44, 32, 26, 34], at_joint_m: [-0.5, 0], world_m: { x: -0.211, up: 1.298 } }] }; plant.garments.push(g); }
  const v = judge(plant, true);
  ok('the gate refuses a planted set with a wrong ruler, bad metres and a failed round trip (' + v.why.length + ' reasons)',
     v.why.some(w => /ruler/.test(w)) && v.why.some(w => /metres disagree/.test(w)) && v.why.some(w => /miss it by/.test(w)));
}

/* 2. THE REAL SET. */
const MF = path.join(SET, 'manifest.json');
ok('the set exists where the rig reads it (' + path.relative(ROOT, MF) + ')', fs.existsSync(MF));
if (!fs.existsSync(MF)) done();
let man = null; try { man = JSON.parse(fs.readFileSync(MF, 'utf8')); } catch (e) {}
ok('and it parses', !!man);
if (!man) done();
const v = judge(man);
for (const w of v.why) ok(w, false);
ok('the ruler, the facings, the joints, the metres and the round trip all hold (' + v.garments + ' garments, ' + v.pieces + ' pieces)', v.why.length === 0);

/* 3. EVERY CANON GARMENT ON THE RAIL IS IN THE SET. The rail is read off the alpha's source, the one place it is
   written; a garment COOK adds tomorrow turns this red until the set is cut again (NOTHING IS BAKED ONCE). */
{
  const src = fs.readFileSync(ALPHA, 'utf8');
  const at = src.indexOf('var GARMENTS=window.GARMENTS=[');
  const rail = new Set();
  if (at > 0) { const re = /\{n:'([^']+)',st:'canon'/g; let m; const body = src.slice(at); while ((m = re.exec(body))) rail.add(m[1]); }
  const inSet = new Set(man.garments.map(g => g.n));
  const missing = [...rail].filter(n => !inSet.has(n));
  ok('the rail was read (' + rail.size + ' canon garments in the alpha)', rail.size > 300);
  ok('every canon garment on the rail is in the set (' + missing.length + ' missing' + (missing.length ? ': ' + missing.slice(0, 5).join(', ') : '') + ')', missing.length === 0);
}

/* 4. THE ATLASES ARE REAL PNGs OF THE SIZE THE MANIFEST SAYS. */
{
  let bad = 0, n = 0;
  for (const L in man.layers) {
    const e = man.layers[L]; n++;
    for (const f of [e.atlas, e.parts]) {
      const p = path.join(SET, f); if (!fs.existsSync(p)) { bad++; continue; }
      const b = fs.readFileSync(p); if (b.length < 100 || b.readUInt32BE(16) !== BOX * FACINGS.length || b.readUInt32BE(20) !== BOX * e.rows) bad++;
    }
  }
  ok('every layer\'s atlas and part map is on disk at 112 x 8 by 112 x rows (' + n + ' layers, ' + bad + ' wrong)', n >= 10 && bad === 0);
}

/* 5. SKIN SHADING IS NAMED, NOT HIDDEN. */
ok('the set says which garments read what is under them and which only shade skin (' + ((man.reads_under && man.reads_under.reads_under) || []).length + ' read under, '
   + ((man.reads_under && man.reads_under.shades_skin) || []).length + ' shade skin)', !!(man.reads_under && Array.isArray(man.reads_under.shades_skin)));
done();
