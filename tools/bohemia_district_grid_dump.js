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
const MODULES = ['apartment', 'battery', 'boneyard', 'cemetery', 'chapel', 'cityhall',
  'commercial', 'courthouse', 'downtown', 'drivein', 'farm', 'firestation', 'golf',
  'industrial', 'jail', 'landfill', 'library', 'mall', 'medical', 'park', 'policestation',
  'railyard', 'school', 'solar', 'stadium', 'storage', 'swapmeet', 'terminal', 'trailer',
  'truckstop', 'warehouse', 'wash', 'waterpark', 'watertreat'];
for (const m of MODULES) { try { require(path.join(REPO, 'engine/bohemia_' + m + '.js')); } catch (e) {} }

const OUT = process.argv[2] || '/tmp/claude-0/-home-user-bohemia/96a4de31-15c3-52d6-95f6-8087b9cb9964/scratchpad/district_grids.json';
const SEED = 0x5eed;                       // fixed seed (deterministic; no Date/random)

const out = {};
for (const d of MODULES) {
  const reg = K.get(d);
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
