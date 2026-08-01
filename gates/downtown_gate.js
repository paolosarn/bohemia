// DOWNTOWN GATE (7/21/26). A dead downtown block — podium blocks with towers, a street grid, a
// roundabout plaza, a skybridge. The densest district (WALKABLE-LAND). Research-first.
const D = require('../engine/bohemia_downtown.js'); const K = require('../engine/bohemia_district_kit.js');
let pass=0,fail=0; const ok=(n,c)=>{c?pass++:(fail++,console.log('  FAIL: '+n));};
const counts=r=>{const t={};for(const row of r.g)for(const c of row)t[c]=(t[c]||0)+1;return t;};
const CONFIGS=[['S'],['N'],['E'],['W'],['S','E'],['N','W']];
const purpleFree = pal => { for (const c of Object.keys(pal)) { const h = pal[c], R = parseInt(h.slice(1,3),16)/255, G = parseInt(h.slice(3,5),16)/255, B = parseInt(h.slice(5,7),16)/255, mx = Math.max(R,G,B), mn = Math.min(R,G,B), d = mx-mn; if (d>0.06&&mx>0.12){ let hu = mx===R?60*(((G-B)/d)%6):mx===G?60*((B-R)/d+2):60*((R-G)/d+4); if(hu<0)hu+=360; if(hu>=255&&hu<320) return false; } } return true; };
let anatomy=true,filled=true,streetOk=true,cornerPed=true,drive=true,contentDom=true;
for(const cfg of CONFIGS)for(let s=1;s<=3;s++){const r=D.generate(s*17+3,{streets:cfg}),t=counts(r),g=r.g,W=g[0].length,H=g.length;
 /* REBUILT 8/1 on the research (records/BOHEMIA_DOWNTOWN_VEGAS_RESEARCH_8_1_26.md).
    A CELL IS A BLOCK: the Fremont Street canopy is 1,375 ft over four blocks = 105 m a
    block, and a cell is 96 m. The version before this put four blocks, a street grid, a
    roundabout and a skybridge inside ONE city block. Paolo: "in Vegas there's no
    roundabouts in downtown... you're like 15% done."
    So what is asserted now is a BLOCK: a STREET WALL of many narrow lots (2/15/16 --
    the 1905 townsite auctioned LOTS, so a downtown frontage is a ROW of separate
    buildings, which is the single thing that was most wrong), a MID-BLOCK ALLEY (1)
    running through to the street at both ends, the SURFACE PARKING (13) that is about a
    third of real downtown Las Vegas, the VACANT PARCEL (4), blade signs (12) and awnings
    (20) over the sidewalk, loading (14) onto the alley, and the cars nobody moved (19). */
 if(!(t[1]>800 && (t[13]||0)>2500 && (t[4]||0)>1500 && t[8]>1500 &&
      (t[2]||0)>400 && (t[15]||0)>400 && (t[16]||0)>400 && (t[6]||0)>400 &&
      (t[11]||0)>300 && (t[12]||0)>20 && (t[14]||0)>10 && (t[19]||0)>100 &&
      (t[20]||0)>60 && (t[10]||0)>30 && (t[3]||0)>10))anatomy=false;
 /* NO ROUNDABOUT, and held at zero so it cannot come back: a 1905 railroad townsite grid
    is orthogonal with signalised corners. Proxy -- the old roundabout ring was the only
    thing that put drive tiles in a curve through the middle of the plot, so assert the
    alley is STRAIGHT: every drive tile on the interior sits in the alley band. */
 {const rows=new Set(), cols=new Set();
  for(let yy=8;yy<H-8;yy++) for(let xx=8;xx<W-8;xx++)
    if(g[yy][xx]===1){ rows.add(yy); cols.add(xx); }
  const span=a=>a.size?Math.max(...a)-Math.min(...a)+1:0;
  /* a straight alley occupies a THIN band on one axis and the full width on the other.
     The old roundabout was a ring, which is thick on both. */
  if(!(span(rows)<=14 || span(cols)<=14)) anatomy=false;}
 /* EVERY PIXEL ANSWERED FOR (7/31): no single code may own 30% of the plot. */
 {const A=g.length*g[0].length; let big=0; for(const k in t) if(t[k]>big) big=t[k];
  if(100*big/A>=30) anatomy=false;}
 const ls=K.landStats(g,D.legend); if(!(ls.contentPct>=ls.drivePct))contentDom=false;
 if(!K.legendOk(g,D.palette)||K.voidFraction(g)>0.22)filled=false; if(!D.driveConnected(r))drive=false;
 const eo=(x,y)=>(y===0?'N':y===H-1?'S':x===0?'W':x===W-1?'E':null);const gE=new Set();
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(g[y][x]!==5)continue;const e=eo(x,y);if(!e||!cfg.includes(e))streetOk=false;else gE.add(e);}
 if(cfg.length>1){for(const e of cfg)if(!gE.has(e))cornerPed=false;}}
ok('ONE DOWNTOWN BLOCK: a STREET WALL of narrow lots in three different builds (the 1905 townsite sold LOTS, so a frontage is a ROW of buildings), a MID-BLOCK ALLEY straight through to the street at both ends, the SURFACE PARKING that is about a third of real downtown Las Vegas, a VACANT PARCEL, blade signs and awnings over the sidewalk, loading onto the alley, the cars nobody moved -- and NO ROUNDABOUT, because a 1905 railroad townsite grid does not have one',anatomy);
ok('WALKABLE-LAND: content dominates (the densest district)',contentDom);
ok('every tile named + low void',filled); ok('DRIVABLE: the street grid reaches the curb',drive);
ok('gates on street edges',streetOk); ok('CORNER: pedestrian gate',cornerPed);
ok('PURPLE RESERVATION',purpleFree(D.palette));
ok('downtown registered + commercial',!!K.get('downtown')&&K.category('downtown')==='commercial');
ok('podium enterable + footprints',D.generate(7,{streets:['S']}).footprints.length>=1&&/interior/i.test(D.legend[2].enter||''));
ok('tower(6) structure-solid, skybridge(12) overhead, street(1) drive, plaza(7) ground',K.tileLayer(D.legend[6]).solid===true&&K.tileLayer(D.legend[12]).layer==='overhead'&&D.legend[1].kind==='drive'&&D.legend[7].kind==='ground');
ok('deterministic',JSON.stringify(D.generate(70,{streets:['S']}).g)===JSON.stringify(D.generate(70,{streets:['S']}).g));
console.log('DOWNTOWN GATE: '+pass+' passed, '+fail+' failed  ('+CONFIGS.length+' configs)'); process.exit(fail?1:0);
