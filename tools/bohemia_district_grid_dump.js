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
require(path.join(REPO, 'engine/bohemia_cityhall.js'));
require(path.join(REPO, 'engine/bohemia_battery.js'));
require(path.join(REPO, 'engine/bohemia_terminal.js'));

const OUT = process.argv[2] || '/tmp/claude-0/-home-user-bohemia/96a4de31-15c3-52d6-95f6-8087b9cb9964/scratchpad/district_grids.json';
const DISTRICTS = ['cityhall', 'battery', 'terminal'];
const SEED = 0x5eed;                       // fixed seed (deterministic; no Date/random)

const out = {};
for (const d of DISTRICTS) {
  const reg = K.get(d);
  const res = reg.generate(SEED, { streets: ['S'] });   // canonical-south orientation
  const legend = reg.legend || {};
  const kinds = {};
  for (const code in legend) kinds[code] = legend[code].kind || 'ground';
  out[d] = {
    W: res.W, H: res.H,
    grid: res.g,                                          // 2D array of int codes
    palette: reg.palette || {},
    kinds: kinds,
  };
}
fs.writeFileSync(OUT, JSON.stringify(out));
console.log('dumped', DISTRICTS.length, 'district grids ->', OUT);
for (const d of DISTRICTS) console.log('  ', d, out[d].W + 'x' + out[d].H);
