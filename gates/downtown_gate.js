// DOWNTOWN GATE (7/21/26). A dead downtown block — podium blocks with towers, a street grid, a
// roundabout plaza, a skybridge. The densest district (WALKABLE-LAND). Research-first.
const D = require('../engine/bohemia_downtown.js'); const K = require('../engine/bohemia_district_kit.js');
let pass=0,fail=0; const ok=(n,c)=>{c?pass++:(fail++,console.log('  FAIL: '+n));};
const counts=r=>{const t={};for(const row of r.g)for(const c of row)t[c]=(t[c]||0)+1;return t;};
const CONFIGS=[['S'],['N'],['E'],['W'],['S','E'],['N','W']];
const purpleFree = pal => { for (const c of Object.keys(pal)) { const h = pal[c], R = parseInt(h.slice(1,3),16)/255, G = parseInt(h.slice(3,5),16)/255, B = parseInt(h.slice(5,7),16)/255, mx = Math.max(R,G,B), mn = Math.min(R,G,B), d = mx-mn; if (d>0.06&&mx>0.12){ let hu = mx===R?60*(((G-B)/d)%6):mx===G?60*((B-R)/d+2):60*((R-G)/d+4); if(hu<0)hu+=360; if(hu>=255&&hu<320) return false; } } return true; };
let anatomy=true,filled=true,streetOk=true,cornerPed=true,drive=true,contentDom=true;
for(const cfg of CONFIGS)for(let s=1;s<=3;s++){const r=D.generate(s*17+3,{streets:cfg}),t=counts(r),g=r.g,W=g[0].length,H=g.length;
 /* REBUILT 8/1 on Paolo's "make it look good" ruling. The old district was ONE podium
    function called four times with an identical centred tower on each -- four grey squares.
    The four blocks are now four DIFFERENT buildings, which is what the counts assert:
    podiums(2) + a blue tower(6) + the PARKING STRUCTURE(13) with its RAMP(14) and the cars
    still on the decks(19) + a bronze mid-rise(15) + a green tower(16), plus the mid-block
    ALLEY(20) and the gap-toothed SURFACE LOT(21) and the retail awning run(22). */
 if(!(t[2]>1500 && (t[6]||0)>500 && (t[13]||0)>800 && (t[14]||0)>400 && (t[15]||0)>400 &&
      (t[16]||0)>200 && (t[19]||0)>50 && (t[20]||0)>150 && (t[21]||0)>200 && (t[22]||0)>100 &&
      t[8]>1500 && t[1]>800 && (t[7]||0)>100 && (t[10]||0)>8 && (t[11]||0)>50 &&
      (t[3]||0)>10 && (t[12]||0)>20))anatomy=false;
 /* EVERY PIXEL ANSWERED FOR (7/31): no single code may own 30% of the plot. */
 {const A=g.length*g[0].length; let big=0; for(const k in t) if(t[k]>big) big=t[k];
  if(100*big/A>=30) anatomy=false;}
 const ls=K.landStats(g,D.legend); if(!(ls.contentPct>=ls.drivePct))contentDom=false;
 if(!K.legendOk(g,D.palette)||K.voidFraction(g)>0.22)filled=false; if(!D.driveConnected(r))drive=false;
 const eo=(x,y)=>(y===0?'N':y===H-1?'S':x===0?'W':x===W-1?'E':null);const gE=new Set();
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(g[y][x]!==5)continue;const e=eo(x,y);if(!e||!cfg.includes(e))streetOk=false;else gE.add(e);}
 if(cfg.length>1){for(const e of cfg)if(!gE.has(e))cornerPed=false;}}
ok('FOUR BLOCKS THAT ARE FOUR DIFFERENT THINGS: the off-centre TOWER on its podium, the PARKING STRUCTURE with its switchback ramp and the cars still on the decks, the stepped MID-RISE over a mid-block ALLEY beside the gap-toothed SURFACE LOT, and TWO TOWERS under a retail awning run -- around the grid, the roundabout plaza and the skybridge, with no single code owning 30% of the plot',anatomy);
ok('WALKABLE-LAND: content dominates (the densest district)',contentDom);
ok('every tile named + low void',filled); ok('DRIVABLE: the street grid reaches the curb',drive);
ok('gates on street edges',streetOk); ok('CORNER: pedestrian gate',cornerPed);
ok('PURPLE RESERVATION',purpleFree(D.palette));
ok('downtown registered + commercial',!!K.get('downtown')&&K.category('downtown')==='commercial');
ok('podium enterable + footprints',D.generate(7,{streets:['S']}).footprints.length>=1&&/interior/i.test(D.legend[2].enter||''));
ok('tower(6) structure-solid, skybridge(12) overhead, street(1) drive, plaza(7) ground',K.tileLayer(D.legend[6]).solid===true&&K.tileLayer(D.legend[12]).layer==='overhead'&&D.legend[1].kind==='drive'&&D.legend[7].kind==='ground');
ok('deterministic',JSON.stringify(D.generate(70,{streets:['S']}).g)===JSON.stringify(D.generate(70,{streets:['S']}).g));
console.log('DOWNTOWN GATE: '+pass+' passed, '+fail+' failed  ('+CONFIGS.length+' configs)'); process.exit(fail?1:0);
