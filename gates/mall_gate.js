// MALL GATE (7/22/26). A dead enclosed shopping mall — a dumbbell-shaped building (concourse
// spine + two anchor stores + food-court bump-out), entrance doors, loading docks, north/south
// parking fields tied by a connected drive ring. Content-dominant by real-world dead-mall
// precedent (WALKABLE-LAND). Research-first.
const D = require('../engine/bohemia_mall.js'); const K = require('../engine/bohemia_district_kit.js');
let pass=0,fail=0; const ok=(n,c)=>{c?pass++:(fail++,console.log('  FAIL: '+n));};
const counts=r=>{const t={};for(const row of r.g)for(const c of row)t[c]=(t[c]||0)+1;return t;};
const CONFIGS=[['S'],['N'],['E'],['W'],['S','E'],['N','W']];
const purpleFree = pal => { for (const c of Object.keys(pal)) { const h = pal[c], R = parseInt(h.slice(1,3),16)/255, G = parseInt(h.slice(3,5),16)/255, B = parseInt(h.slice(5,7),16)/255, mx = Math.max(R,G,B), mn = Math.min(R,G,B), d = mx-mn; if (d>0.06&&mx>0.12){ let hu = mx===R?60*(((G-B)/d)%6):mx===G?60*((B-R)/d+2):60*((R-G)/d+4); if(hu<0)hu+=360; if(hu>=255&&hu<320) return false; } } return true; };
let anatomy=true,filled=true,streetOk=true,cornerPed=true,drive=true,contentDom=true,hasDumpster=true;
for(const cfg of CONFIGS)for(let s=1;s<=3;s++){const r=D.generate(s*19+4,{streets:cfg}),t=counts(r),g=r.g,W=g[0].length,H=g.length;
 if(!((t[2]||0)>2500 && (t[6]||0)>2000 && (t[7]||0)>200 && (t[8]||0)>0 && (t[12]||0)>4 && t[1]>1000 && t[4]>6000))anatomy=false;
 if(!(t[13]>0))hasDumpster=false;
 const ls=K.landStats(g,D.legend); if(!(ls.contentPct>=ls.drivePct))contentDom=false;
 if(!K.legendOk(g,D.palette)||K.voidFraction(g)>0.22)filled=false; if(!D.driveConnected(r))drive=false;
 const eo=(x,y)=>(y===0?'N':y===H-1?'S':x===0?'W':x===W-1?'E':null);const gE=new Set();
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(g[y][x]!==5)continue;const e=eo(x,y);if(!e||!cfg.includes(e))streetOk=false;else gE.add(e);}
 if(cfg.length>1){for(const e of cfg)if(!gE.has(e))cornerPed=false;}}
ok('concourse + two anchors + food court + docks + entrance doors + parking',anatomy);
ok('a dumpster survives at the service corner (no overwrite regression)',hasDumpster);
ok('WALKABLE-LAND: content dominates (real dead-mall precedent, no vehicular exemption needed)',contentDom);
ok('every tile named + low void',filled); ok('DRIVABLE: the ring reaches every lot from the gate',drive);
ok('gates on street edges',streetOk); ok('CORNER: pedestrian gate',cornerPed);
ok('PURPLE RESERVATION',purpleFree(D.palette));
ok('mall registered + commercial',!!K.get('mall')&&K.category('mall')==='commercial');
ok('concourse/anchors enterable + footprints (dumbbell = 3 connected masses)',D.generate(7,{streets:['S']}).footprints.length>=3&&/concourse/i.test(D.legend[2].enter||''));
ok('concourse(2)/anchor(6)/food-court(7) building+solid, loading dock(8) portal, street(1) drive',
  D.legend[2].kind==='building'&&K.tileLayer(D.legend[2]).solid===true&&D.legend[6].kind==='building'&&D.legend[7].kind==='building'&&D.legend[8].kind==='portal'&&D.legend[1].kind==='drive');
ok('deterministic',JSON.stringify(D.generate(70,{streets:['S']}).g)===JSON.stringify(D.generate(70,{streets:['S']}).g));
console.log('MALL GATE: '+pass+' passed, '+fail+' failed  ('+CONFIGS.length+' configs)'); process.exit(fail?1:0);
