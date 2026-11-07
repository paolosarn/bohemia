#!/usr/bin/env node
/* WORLD THIRTEEN 11/7 (rule 429(g)): MEASURE FIRST, the zones the generator already makes. Every district to one of twelve zones
   (a reading, the land-use layer's first draft), each zone's share of the valley over 22 seeds, the seams between zones, and the
   house blocks touching or inside industry. node tools/bohemia_world_thirteen_zones_measure.js */
const O = require(require('path').join(__dirname, '..', 'engine/bohemia_overmap.js'));
const Z = {
  strip: ['strip','resort','casino','luxor','sphere','highroller','strat','sign','convention','aquarium'],
  downtown: ['downtown','cityhall','courthouse','jail','bank','mobmuseum','medical'],
  industrial: ['industrial','warehouse','storage','railyard','fueldepot','granary','robofactory','reclaim','substation','pumpstation','watertreat','battery','arsenal','datafort','powerplant','boneyard','landfill','quarry','gypsum','shelter'],
  transport: ['freeway','beltway','interchange','rail','airport','airbase','terminal','truckstop'],
  arterial: ['arterial'],
  suburb: ['suburb','estate','gated','apartment','town'],
  edge: ['trailer','swapmeet','drivein','minigp','speedway'],
  commercial: ['commercial','mall','hardware','jobsoffice','tvstation','radio','chapel'],
  civic: ['school','campus','library','firestation','policestation','prison','fort','natmuseum','stadium','ballpark','cemetery'],
  green: ['park','golf','farm','waterpark'],
  open: ['desert','wash','basin','springs','mountain','solar','dam'],
  water: ['water','reservoir','intake'],
};
const ZOF = {}; for (const z in Z) for (const d of Z[z]) ZOF[d] = z;
const all = Object.values(O.DISTRICT); const miss = all.filter(d => !ZOF[d]); console.log('unzoned', miss);
const SEEDS = [1337,7,42,2026,99,31337,1,2,3,5,8,13,21,34,55,89,144,233,377,610,987,2691674296];
const share = {}; let enclosed = {}; const pairs = {};
for (const seed of SEEDS) { const m = O.buildOvermap(seed), N = m.n, c = {};
  const zAt = (x,y) => { const t = (x<0||y<0||x>=N||y>=N)?null:m.at(x,y); return t ? ZOF[t.district] : null; };
  for (let y=0;y<N;y++) for (let x=0;x<N;x++) { const z = zAt(x,y); c[z] = (c[z]||0)+1;
    // suburb surrounded by industrial: count industrial among 8 neighbours
    if (z === 'suburb') { let ind = 0, sub = 0; for (let dy=-1;dy<=1;dy++) for (let dx=-1;dx<=1;dx++) { if (!dx && !dy) continue; const n = zAt(x+dx,y+dy); if (n==='industrial') ind++; if (n==='suburb') sub++; }
      if (ind >= 5) enclosed.sub_in_ind = (enclosed.sub_in_ind||0)+1; if (ind >= 1) enclosed.sub_touch_ind = (enclosed.sub_touch_ind||0)+1; }
    for (const [dx,dy] of [[1,0],[0,1]]) { const n = zAt(x+dx,y+dy); if (!n || n===z) continue; const k = [z,n].sort().join('|'); pairs[k] = (pairs[k]||0)+1; } }
  for (const z in c) (share[z] = share[z] || []).push(c[z] / (N*N)); }
for (const z in share) { const a = share[z]; console.log(z.padEnd(11), 'min', (Math.min(...a)*100).toFixed(1), 'max', (Math.max(...a)*100).toFixed(1)); }
console.log(enclosed);
console.log(Object.entries(pairs).sort((a,b)=>b[1]-a[1]).slice(0,30).map(([k,v])=>k+' '+v).join(', '));
