// APARTMENT COMPLEX GATE (7/21/26). A dead garden apartment complex — 3 building rows with
// exterior breezeway stairs + carports on internal drive aisles, a fenced drained pool deck,
// clubhouse, guest parking, mailbox kiosk, dumpster enclosures. Content-dominant (WALKABLE-LAND).
// Closes the SUBURB_FAMILY [PENDING] gap the LANDLOCKED DISTRICT LAW flagged. Research-first.
const D = require('../engine/bohemia_apartment.js'); const K = require('../engine/bohemia_district_kit.js');
let pass=0,fail=0; const ok=(n,c)=>{c?pass++:(fail++,console.log('  FAIL: '+n));};
const counts=r=>{const t={};for(const row of r.g)for(const c of row)t[c]=(t[c]||0)+1;return t;};
const CONFIGS=[['S'],['N'],['E'],['W'],['S','E'],['N','W']];
const purpleFree = pal => { for (const c of Object.keys(pal)) { const h = pal[c], R = parseInt(h.slice(1,3),16)/255, G = parseInt(h.slice(3,5),16)/255, B = parseInt(h.slice(5,7),16)/255, mx = Math.max(R,G,B), mn = Math.min(R,G,B), d = mx-mn; if (d>0.06&&mx>0.12){ let hu = mx===R?60*(((G-B)/d)%6):mx===G?60*((B-R)/d+2):60*((R-G)/d+4); if(hu<0)hu+=360; if(hu>=255&&hu<320) return false; } } return true; };
let anatomy=true,filled=true,streetOk=true,cornerPed=true,drive=true,contentDom=true;
for(const cfg of CONFIGS)for(let s=1;s<=3;s++){const r=D.generate(s*19+4,{streets:cfg}),t=counts(r),g=r.g,W=g[0].length,H=g.length;
 if(!(t[2]>3000 && (t[6]||0)>900 && (t[15]||0)>40 && t[1]>2500 && (t[7]||0)>300 && (t[12]||0)>700 && (t[8]||0)>0 && t[4]>4500))anatomy=false;
 const ls=K.landStats(g,D.legend); if(!(ls.contentPct>=ls.drivePct))contentDom=false;
 if(!K.legendOk(g,D.palette)||K.voidFraction(g)>0.22)filled=false; if(!D.driveConnected(r))drive=false;
 const eo=(x,y)=>(y===0?'N':y===H-1?'S':x===0?'W':x===W-1?'E':null);const gE=new Set();
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(g[y][x]!==5)continue;const e=eo(x,y);if(!e||!cfg.includes(e))streetOk=false;else gE.add(e);}
 if(cfg.length>1){for(const e of cfg)if(!gE.has(e))cornerPed=false;}}
ok('apartment buildings + carports + stairs + fence + clubhouse + drained pool + parking + streets',anatomy);
ok('WALKABLE-LAND: content dominates',contentDom);
ok('every tile named + low void',filled); ok('DRIVABLE: streets reach every row',drive);
ok('gates on street edges',streetOk); ok('CORNER: pedestrian gate',cornerPed);
ok('PURPLE RESERVATION',purpleFree(D.palette));
ok('apartment registered + residential',!!K.get('apartment')&&K.category('apartment')==='residential');
ok('apartment building enterable via breezeway + footprints',D.generate(7,{streets:['S']}).footprints.length>=1&&/breezeway/i.test(D.legend[2].enter||''));
ok('carport(6) overhead, building(2) building, stair(15) solid structure, street(1) drive, pool(8) not solid',
  K.tileLayer(D.legend[6]).layer==='overhead'&&D.legend[2].kind==='building'&&K.tileLayer(D.legend[15]).solid===true&&D.legend[1].kind==='drive'&&K.tileLayer(D.legend[8]).solid===false);
ok('deterministic',JSON.stringify(D.generate(70,{streets:['S']}).g)===JSON.stringify(D.generate(70,{streets:['S']}).g));
console.log('APARTMENT GATE: '+pass+' passed, '+fail+' failed  ('+CONFIGS.length+' configs)'); process.exit(fail?1:0);
