// WATERPARK GATE (7/22/26). A dead water park — a big drained wave pool, a lazy-river loop
// channel, four slide towers each with a splash pool, a locker building + snack bar near the
// entrance. Content-dominant by real-world precedent (WALKABLE-LAND). Research-first.
const D = require('../engine/bohemia_waterpark.js'); const K = require('../engine/bohemia_district_kit.js');
let pass=0,fail=0; const ok=(n,c)=>{c?pass++:(fail++,console.log('  FAIL: '+n));};
const counts=r=>{const t={};for(const row of r.g)for(const c of row)t[c]=(t[c]||0)+1;return t;};
const CONFIGS=[['S'],['N'],['E'],['W'],['S','E'],['N','W']];
const purpleFree = pal => { for (const c of Object.keys(pal)) { const h = pal[c], R = parseInt(h.slice(1,3),16)/255, G = parseInt(h.slice(3,5),16)/255, B = parseInt(h.slice(5,7),16)/255, mx = Math.max(R,G,B), mn = Math.min(R,G,B), d = mx-mn; if (d>0.06&&mx>0.12){ let hu = mx===R?60*(((G-B)/d)%6):mx===G?60*((B-R)/d+2):60*((R-G)/d+4); if(hu<0)hu+=360; if(hu>=255&&hu<320) return false; } } return true; };
let anatomy=true,filled=true,streetOk=true,cornerPed=true,drive=true,contentDom=true;
for(const cfg of CONFIGS)for(let s=1;s<=3;s++){const r=D.generate(s*19+4,{streets:cfg}),t=counts(r),g=r.g,W=g[0].length,H=g.length;
 if(!((t[6]||0)>1500 && (t[7]||0)>800 && (t[8]||0)>100 && (t[9]||0)>100 && (t[2]||0)>100 && (t[13]||0)>50 && t[1]>50))anatomy=false;
 const ls=K.landStats(g,D.legend); if(!(ls.contentPct>=ls.drivePct))contentDom=false;
 if(!K.legendOk(g,D.palette)||K.voidFraction(g)>0.22)filled=false; if(!D.driveConnected(r))drive=false;
 const eo=(x,y)=>(y===0?'N':y===H-1?'S':x===0?'W':x===W-1?'E':null);const gE=new Set();
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(g[y][x]!==5)continue;const e=eo(x,y);if(!e||!cfg.includes(e))streetOk=false;else gE.add(e);}
 if(cfg.length>1){for(const e of cfg)if(!gE.has(e))cornerPed=false;}}
ok('wave pool + lazy river + slide towers + splash pools + locker building + snack bar',anatomy);
ok('WALKABLE-LAND: content dominates (real-world precedent, no vehicular exemption needed)',contentDom);
ok('every tile named + low void',filled); ok('DRIVABLE: entrance drive reaches the gate',drive);
ok('gates on street edges',streetOk); ok('CORNER: pedestrian gate',cornerPed);
ok('PURPLE RESERVATION',purpleFree(D.palette));
ok('waterpark registered + leisure',!!K.get('waterpark')&&K.category('waterpark')==='leisure');
ok('locker building enterable + footprints',D.generate(7,{streets:['S']}).footprints.length>=1&&/locker/i.test(D.legend[2].enter||''));
ok('slide tower(8) solid structure, pools(6/7/9) not solid water-dead, street(1) drive',
  K.tileLayer(D.legend[8]).solid===true&&D.legend[6].kind==='water-dead'&&D.legend[7].kind==='water-dead'&&D.legend[9].kind==='water-dead'&&D.legend[1].kind==='drive');
ok('deterministic',JSON.stringify(D.generate(70,{streets:['S']}).g)===JSON.stringify(D.generate(70,{streets:['S']}).g));
console.log('WATERPARK GATE: '+pass+' passed, '+fail+' failed  ('+CONFIGS.length+' configs)'); process.exit(fail?1:0);
