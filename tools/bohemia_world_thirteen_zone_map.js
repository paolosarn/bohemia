#!/usr/bin/env node
/* WORLD THIRTEEN 11/10 (rule 429(g)): a valley's zones as a picture, one block a square, coloured by its land-use zone
   (records/target/bb/land_use.json), for the VOTE card's before and after.
     node tools/bohemia_world_thirteen_zone_map.js GENERATOR.js SEED OUT.ppm */
'use strict';
const fs = require('fs'), path = require('path');
const O = require(path.resolve(process.argv[2])), seed = +process.argv[3] || 1337, out = process.argv[4];
const LU = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'records/target/bb/land_use.json'), 'utf8'));
const ZOF = {}; for (const z in LU.zones) for (const d of LU.zones[z].districts) ZOF[d] = z;
const COL = { strip: [196, 160, 84], downtown: [150, 120, 160], industry: [178, 74, 46], transport: [70, 70, 74], mile_street: [104, 102, 98],
  suburb: [188, 176, 150], cheap_edge: [232, 214, 104], commercial: [110, 150, 180], civic: [140, 110, 90], green: [96, 128, 84], open: [146, 128, 104], water: [58, 84, 110] };
const m = O.buildOvermap(seed), N = m.n, C = 8, W = N * C;
const px = Buffer.alloc(W * W * 3);
for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const c = COL[ZOF[m.at(x, y).district]] || [0, 0, 0];
  for (let v = 0; v < C; v++) for (let u = 0; u < C; u++) { const e = (u === C - 1 || v === C - 1) ? 0.82 : 1, o = ((y * C + v) * W + x * C + u) * 3; px[o] = c[0] * e; px[o + 1] = c[1] * e; px[o + 2] = c[2] * e; } }
fs.writeFileSync(out, Buffer.concat([Buffer.from('P6\n' + W + ' ' + W + '\n255\n'), px]));
const n = {}; for (const t of m.tiles) { const z = ZOF[t.district]; n[z] = (n[z] || 0) + 1; }
console.log(out, 'industry', (n.industry / N / N * 100).toFixed(1) + '%', 'cheap edge', (n.cheap_edge / N / N * 100).toFixed(1) + '%');
