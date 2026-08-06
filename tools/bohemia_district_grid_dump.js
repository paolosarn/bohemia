#!/usr/bin/env node
/* BOHEMIA DISTRICT GRID DUMP (7/24/26) — the bridge that makes the city-builder
 * HERO sprite and the on-foot WALKABLE district resemble each other (Paolo 7/24,
 * "very important"): both are driven by the SAME canonical district layout. This
 * runs each district's engine generate() (the exact grid you walk through) and
 * dumps its code grid + palette + per-code legend KIND to JSON, so the Python
 * hero factory can extrude that same layout to a 3D sprite. One canonical body,
 * two renders (ENGINE SYNC LAW).
 *
 *   node tools/bohemia_district_grid_dump.js  ->  scratchpad/district_grids.json
 */
const fs = require('fs');
const path = require('path');
const REPO = path.dirname(__dirname);
const K = require(path.join(REPO, 'engine/bohemia_district_kit.js'));

// every kit-registered walkable district module (require = self-register into K)
let MODULES = ['apartment', 'battery', 'boneyard', 'cemetery', 'chapel', 'cityhall',
  'commercial', 'courthouse', 'downtown', 'drivein', 'farm', 'firestation', 'golf',
  'industrial', 'jail', 'landfill', 'library', 'mall', 'medical', 'park', 'policestation',
  'railyard', 'school', 'solar', 'stadium', 'storage', 'swapmeet', 'terminal', 'trailer',
  'truckstop', 'warehouse', 'wash', 'waterpark', 'watertreat',
  // SURFACES (7/27): the icon law reaches the ground the WORLD lane built, not just
  // the districts. rail and interchange are the two Paolo's ruling names directly.
  // airfield is REQUIRED for its side effect (it registers BOTH airport and airbase
  // into the kit); airport/airbase are then emitted under their real TYPE names.
  'rail', 'interchange', 'airfield', 'airport', 'airbase',
  'campus', 'speedway', 'town', 'ballpark',
  // 7/27: four DISTGEN types the dump never listed, so they were invisible to every
  // consumer of it -- including the bulk judge, which is meant to show him EVERYTHING.
  // (gated + estate share the SUBURB generator, so one plate covers all three.)
  'suburb', 'substation',
  // 8/4: the last six the dump still could not see, so the NO-ICON DEBT could not be
  // paid for them -- their palettes were simply not in the file the factory reads.
  // arterial/freeway/wash are the road-and-channel surfaces; desert/mountain/water are
  // the terrain the valley is mostly made of.
  'arterial', 'freeway', 'desert', 'mountain', 'water'];
// require = self-register into K for most modules; a few (e.g. commercial) only
// register when a GLOBAL K exists (browser), so also keep each module's exported
// API as a fallback source of generate/palette/legend.
const EXPORTS = {};
for (const m of MODULES) { try { EXPORTS[m] = require(path.join(REPO, 'engine/bohemia_' + m + '.js')); } catch (e) {} }

// AND EVERY DISTRICT THIS HAND-WRITTEN LIST DOES NOT KNOW ABOUT. Third copy of the district
// registry kept by hand in this repo, third time it went stale: the list is keyed on
// `engine/bohemia_<name>.js`, so it structurally CANNOT see a type whose file is not named
// after it -- and the twelve utility landmarks all live in one factory file. The registry
// already knows them. Sweep it, and add anything the list missed. (A VALUE PASSED BY HAND
// WHERE A VALUE COULD BE DERIVED, again -- the file name was standing in for the type.)
try { require(path.join(REPO, 'engine/bohemia_world.js')); } catch (e) {}
for (const t of K.types().sort()) {
  if (MODULES.indexOf(t) >= 0) continue;
  const spec = K.get(t);
  if (!spec || typeof spec.generate !== 'function' || !spec.legend) continue;
  MODULES.push(t);
}

/* SCRATCH was pinned to one dead session's private directory; honour BOHEMIA_SCRATCH
   if it is set, else the system temp dir, so this runs in any session. */
const SCRATCH = process.env.BOHEMIA_SCRATCH || require('os').tmpdir();
const OUT = process.argv[2] || path.join(SCRATCH, 'bohemia_district_grids.json');
const SEED = 0x5eed;                       // fixed seed (deterministic; no Date/random)

const out = {};
for (const d of MODULES) {
  const reg = K.get(d) || EXPORTS[d];
  if (!reg || !reg.generate) continue;
  let res;
  try { res = reg.generate(SEED, { streets: ['S'] }); } catch (e) { continue; }
  const legend = reg.legend || {};
  const kinds = {}, names = {};
  for (const code in legend) { kinds[code] = legend[code].kind || 'ground'; names[code] = legend[code].name || ''; }
  out[d] = { W: res.W, H: res.H, grid: res.g, palette: reg.palette || {}, kinds: kinds, names: names };
}
fs.writeFileSync(OUT, JSON.stringify(out));
const got = Object.keys(out);
console.log('dumped', got.length, 'district grids ->', OUT);
console.log('  ', got.join(' '));
