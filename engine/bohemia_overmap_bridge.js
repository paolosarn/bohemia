// BOHEMIA OVERMAP->BLOCK BRIDGE (7/14/26)
// LANES SOURCED (7/14 research): Strip 3/dir, arterials 3/dir, I-15 5/dir (= Paolo's law exactly).
// The canonical valley meets the block pipeline: an overmap cell's district
// class picks a blockgen recipe; the CELL'S OWN seed drives generation
// (deterministic per (seed, cell) — Continuous Walk Law). Quality maps to
// wreckage/litter density (low quality = more collapse) [tunable, flagged].
// DISTRICT -> BUILD ARCHETYPE (Paolo 7/18/26). ~9 procedural archetypes cover
// every landmark type: civic (mid building + parking), bigbox (one big box +
// apron), institutional (campus of buildings + green), industrial (sheds +
// fence), utility (fenced yard + tanks), landmark (one big centered structure),
// green (turf + trees + path), water, rail, extraction (mine pit). Real-Vegas
// grounding drives the pick; the generator lives in bohemia_blockgen genBuiltLot.
const ARCHETYPE={
  resort:'bigbox', mall:'bigbox', convention:'bigbox', swapmeet:'bigbox',
  industrial:'industrial', railyard:'industrial', storage:'industrial', warehouse:'industrial',
  medical:'institutional', campus:'institutional', school:'institutional', jail:'institutional', prison:'institutional',
  reclaim:'utility', landfill:'utility', intake:'utility', substation:'utility', watertreat:'utility',
  reservoir:'utility', pumpstation:'utility', battery:'utility', fueldepot:'utility', basin:'utility',
  datafort:'utility', arsenal:'utility', granary:'utility', radio:'utility',
  firestation:'civic', policestation:'civic', courthouse:'civic', library:'civic', chapel:'civic',
  terminal:'civic', town:'civic', truckstop:'civic',
  dam:'landmark', sphere:'landmark', luxor:'landmark', strat:'landmark', highroller:'landmark',
  sign:'landmark', boneyard:'landmark', fort:'landmark', springs:'landmark', ballpark:'landmark',
  stadium:'landmark', speedway:'landmark', robofactory:'landmark',
  park:'green', golf:'green', cemetery:'green', waterpark:'green', minigp:'green', drivein:'green',
  water:'water', rail:'rail', quarry:'extraction', gypsum:'extraction',
};
const BOH_OMBRIDGE=(function(){
  function recipeFor(cell){
    const d=cell.district, q=cell.quality!=null?cell.quality:0.5;
    const decay=Math.round((1-q)*6); // 0..6 wrecks from quality
    switch(d){
      case 'arterial': return {type:'street',opts:{lanes:q<0.35?2:3,wrecks:decay,intersection:(cell.seed%3)===0}}; // RESEARCHED: mile-grid arterials run 3/dir (FHWA); only decayed minors drop to 2
      case 'freeway': case 'beltway': return {type:'freeway',opts:{wrecks:decay}};
      case 'suburb': case 'gated': case 'trailer': return {type:'residential',opts:{wrecks:Math.min(decay,2)}};
      case 'strip': return {type:'street',opts:{lanes:3,sidewalk:3,median:2,wrecks:decay,intersection:false}}; // SIDEWALK LAW: Strip max 3
      case 'downtown': case 'commercial': case 'casino':
        return {type:'street',opts:{lanes:q>0.5?3:2,sidewalk:2,wrecks:decay,intersection:(cell.seed%2)===0}}; // researched: urban corridors 2-3/dir
      case 'desert': return {type:'desert',opts:{}};
      case 'wash': return {type:'wash',opts:{}};
      case 'solar': return {type:'solar',opts:{}};
      case 'farm': return {type:'farm',opts:{}};
      case 'airport': case 'airbase': return {type:'airfield',opts:{}};
      case 'mountain': return {type:'mountain',opts:{}};
      case 'estate': return {type:'residential',opts:{wrecks:1}};       // big-lot housing
      case 'interchange': return {type:'freeway',opts:{}};              // freeway stack
      // PROCEDURAL BUILT LOT (Paolo 7/18/26): every remaining district generates
      // from its build archetype instead of returning null. This is a procgen
      // world — landmarks populate the map procedurally, not by hand-ruling each.
      default: return {type:'builtlot',opts:{archetype:ARCHETYPE[d]||'civic'}};
    }
  }
  function blockFor(cell,G,W){
    const r=recipeFor(cell);
    if(!r) return {pending:true,district:cell.district,cell:{x:cell.x,y:cell.y}};
    const b=G.generate(r.type,cell.seed>>>0,W||24,r.opts);
    b.meta.district=cell.district; b.meta.quality=cell.quality;
    b.meta.cell=[cell.x,cell.y];
    return b;
  }
  return {recipeFor,blockFor};
})();

// DISTRICT MERGE LAW (7/14): detect same-district rect clusters (cap 2x2),
// seeded merge coin per cluster (default p=0.6, PENDING Paolo).
BOH_OMBRIDGE.clusterFor=function(m,x,y,mergeP){
  mergeP=mergeP==null?0.6:mergeP;
  const d=m.at(x,y).district;
  const same=(xx,yy)=>{try{return m.at(xx,yy).district===d;}catch(e){return false;}};
  // anchor cluster at even coordinates so every member agrees on the cluster
  const ax=x-(x%2), ay=y-(y%2);
  const can2x2=same(ax,ay)&&same(ax+1,ay)&&same(ax,ay+1)&&same(ax+1,ay+1);
  const canH=same(ax,y)&&same(ax+1,y);
  const canV=same(x,ay)&&same(x,ay+1);
  const coin=(sx,sy,salt)=>{let s=(m.at(sx,sy).seed^salt)>>>0;s=(s*1103515245+12345)>>>0;return (s/4294967296)<mergeP;};
  if(can2x2&&coin(ax,ay,0xAA)){return {cx:ax,cy:ay,cw:2,ch:2,seed:m.at(ax,ay).seed,member:[x-ax,y-ay]};}
  if(canH&&coin(ax,y,0xBB)){return {cx:ax,cy:y,cw:2,ch:1,seed:m.at(ax,y).seed,member:[x-ax,0]};}
  if(canV&&coin(x,ay,0xCC)){return {cx:x,cy:ay,cw:1,ch:2,seed:m.at(x,ay).seed,member:[0,y-ay]};}
  return {cx:x,cy:y,cw:1,ch:1,seed:m.at(x,y).seed,member:[0,0]};
};


// GATES TOUCH STREETS (7/14): plotFor detects which plot edges face street
// districts on the real overmap and hands them to plotgen as streetEdges.
BOH_OMBRIDGE.STREET_DISTRICTS=['arterial','street','strip','downtown','freeway','residential_street'];
BOH_OMBRIDGE.plotFor=function(m,x,y,P,opts){
  opts=opts||{};
  const cl=BOH_OMBRIDGE.clusterFor(m,x,y,opts.mergeP);
  const cell=m.at(x,y);
  const isStreet=(xx,yy)=>{try{return BOH_OMBRIDGE.STREET_DISTRICTS.indexOf(m.at(xx,yy).district)>=0;}catch(e){return false;}};
  const edges=[];
  // check the CLUSTER's outer edges
  for(let i=0;i<cl.cw;i++){if(isStreet(cl.cx+i,cl.cy-1))
    {edges.push('N');break;}}
  for(let i=0;i<cl.cw;i++){if(isStreet(cl.cx+i,cl.cy+cl.ch)){edges.push('S');break;}}
  for(let i=0;i<cl.ch;i++){if(isStreet(cl.cx-1,cl.cy+i)){edges.push('W');break;}}
  for(let i=0;i<cl.ch;i++){if(isStreet(cl.cx+cl.cw,cl.cy+i)){edges.push('E');break;}}
  const d=cell.district;
  const kind=d==='commercial'?'commercial':(d==='industrial'||d==='warehouse'||d==='railyard'||d==='storage')?'industrial':'suburb';
  const character=
    d==='gated'  ?{forceWalled:true, forceGated:true }:
    d==='estate' ?{forceWalled:true, forceGated:true, setback:'estate_12cell'}:
    d==='trailer'?{forceWalled:false,forceGated:false,setback:'trailer_4cell'}:
    {};
  return {cluster:cl,plot:P.generate(kind,cl.seed,cell.quality,
    Object.assign({shape:{cw:cl.cw,ch:cl.ch},streetEdges:edges},character,opts.gen||{}))};
};

if(typeof module!=='undefined')module.exports=BOH_OMBRIDGE;
