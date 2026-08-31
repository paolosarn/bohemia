#!/usr/bin/env node
/* WHERE CAN HE ACTUALLY WALK?  (8/30/26, WORLD lane)
   The scratch instrument behind gates/walkable_valley_gate.js, kept because a gate says
   PASS or FAIL and this prints the districts and the coordinates. A COUNT IS NOT A
   LOCATION -- that lesson cost four failed attempts on the freeway decks, and the fix
   only turned up when a measurement named a ROW instead of a number.
   Absolute paths: it is a probe, not a module.
     node tools/bohemia_walk_reach_probe.js
*/
const path=require('path');
const {settle:SETTLE}=require('/home/user/bohemia/gates/bohemia_settle.js');
function rq(){for(const g of ['/opt/node22/lib/node_modules','/usr/lib/node_modules','/usr/local/lib/node_modules']){try{return require(path.join(g,'playwright'))}catch(e){}}return require('playwright')}
(async()=>{const {chromium}=rq();const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file:///home/user/bohemia/slices/BOHEMIA_CITY_WORLD.html');await SETTLE(p,4000);
const r=await p.evaluate(()=>{
  const N=om.n;
  /* CAN A BODY STAND ON THIS TILE. The kit computes solidity per tile and the walked
     surface reads it; using the kit's own answer means this cannot drift from the game. */
  /* ASK THE GAME, NOT A COPY OF IT. The first cut of this read the district kit's own
     solidity, which is right for every kit district and BLIND TO THE SUBURB -- the one
     district the demo starts in, because SUB_RES cells carry `m.sub` and never `m.kit`.
     It reported that the player can walk to 0.0% of the valley, which is a statement about
     the instrument and not about the game. realizeCell IS the walked surface's own answer
     and cannot drift from what a body actually experiences; it is the same reason
     occupancy_gate compares the model against the running page rather than trusting one. */
  function walkEdge(tx,ty,edge){
    const out=new Uint8Array(FN); let any=0;
    for(let i=0;i<FN;i++){
      const lx = edge==='W'?0 : edge==='E'?FN-1 : i;
      const ly = edge==='N'?0 : edge==='S'?FN-1 : i;
      let c; try{ c=realizeCell(tx*FN+lx, ty*FN+ly); }catch(e){ continue; }
      if(c && c.walk){ out[i]=1; any=1; }
    }
    return any?out:null;
  }
  const idx=(x,y)=>y*N+x;
  const has=new Map(), prof=new Map();
  for(let ty=0;ty<N;ty++)for(let tx=0;tx<N;tx++){
    const t=om.at(tx,ty); if(!t) continue;
    const e={}; let any=false;
    for(const ed of ['N','S','E','W']){ const w=walkEdge(tx,ty,ed); if(w){e[ed]=w;any=true;} }
    if(any){ has.set(idx(tx,ty),t.district); prof.set(idx(tx,ty),e); }
  }
  const par=new Map();
  const find=a=>{while(par.get(a)!==a){par.set(a,par.get(par.get(a)));a=par.get(a);}return a;};
  for(const k of has.keys()) par.set(k,k);
  let joined=0;
  for(let ty=0;ty<N;ty++)for(let tx=0;tx<N;tx++){
    const k=idx(tx,ty); if(!has.has(k)) continue;
    for(const [ed,dx,dy,opp] of [['S',0,1,'N'],['E',1,0,'W']]){
      const k2=idx(tx+dx,ty+dy); if(!has.has(k2)) continue;
      const A=prof.get(k)[ed], B=prof.get(k2)[opp]; if(!A||!B) continue;
      let ok=false; for(let i=0;i<FN;i++) if(A[i]&&B[i]){ok=true;break;}
      if(ok){ const a=find(k), b2=find(k2); if(a!==b2){par.set(a,b2);joined++;} }
    }
  }
  const cnt=new Map();
  for(const k of has.keys()){const r2=find(k);cnt.set(r2,(cnt.get(r2)||0)+1);}
  let root=null,big=-1;
  for(const [r2,n] of cnt) if(n>big){big=n;root=r2;}
  const homeK=idx(city.x,city.y);
  const homeRoot=has.has(homeK)?find(homeK):null;
  const homeN=homeRoot!==null?cnt.get(homeRoot):0;
  // what districts are NOT reachable on foot from home
  const unreach={}, stranded=[];
  for(const [k,d] of has){ if(homeRoot===null||find(k)!==homeRoot){ unreach[d]=(unreach[d]||0)+1;
    if(d!=='mountain'&&d!=='water'&&stranded.length<30) stranded.push(d+'('+(k%N)+','+Math.floor(k/N)+') island of '+cnt.get(find(k))); } }
  const top=[...cnt.values()].sort((a,b2)=>b2-a).slice(0,6);
  return {cells:has.size, comps:cnt.size, biggest:big, joined:joined,
          home:{x:city.x,y:city.y,d:(om.at(city.x,city.y)||{}).district}, homeReach:homeN,
          homeIsBiggest:homeRoot===root, top:top,
          stranded:stranded, unreach:Object.entries(unreach).sort((a,b2)=>b2[1]-a[1]).slice(0,12)};
});
console.log('WALKABLE VALLEY, cell resolution');
console.log('  cells with any standable edge   ', r.cells);
console.log('  separate WALK networks          ', r.comps);
console.log('  biggest                         ', r.biggest, '('+(100*r.biggest/r.cells).toFixed(1)+'%)');
console.log('  the demo starts at              ', r.home.d+'('+r.home.x+','+r.home.y+')');
console.log('  cells he can WALK to from there ', r.homeReach, '('+(100*r.homeReach/r.cells).toFixed(1)+'%)',
            r.homeIsBiggest?'-- and that IS the biggest network':'-- AND THAT IS NOT THE BIGGEST NETWORK');
console.log('  biggest six networks            ', r.top.join(', '));
console.log('  what he CANNOT walk to, by district:');
for(const [d,n] of r.unreach) console.log('     '+String(n).padStart(5)+'  '+d);
console.log('  the ones that are NOT mountain or water, go and look:');
for(const t of r.stranded) console.log('     '+t);
if(errs.length) console.log('  page errors:',errs.slice(0,2).join(' | '));
await b.close();})();
