// BOHEMIA POWER GRID (7/14/26) — CLUSTERED POWER LAW as engine code.
// Streetlights fail by CIRCUIT (feeder death + copper theft), never
// alternating. 12% of circuits live (tunable). Every live circuit is
// OWNED: settlement / faction / network / solar_lone. Light = territory.
// WHERE network zones sit = Paolo's map call; this module is mechanics.
const BOH_POWERGRID=(()=>{ 
  function rng(seed){let s=seed>>>0;return function(){s=(s*1103515245+12345)>>>0;return s/4294967296;}}
  const STREETS=['arterial','street','strip','downtown','freeway','residential','beltway'];
  // circuits = contiguous same-axis street RUNS on the overmap (a feeder run).
  function buildCircuits(m,N){
    N=N||96;
    const seen=new Set(); const circuits=[];
    const isStreet=(x,y)=>{try{return STREETS.indexOf(m.at(x,y).district)>=0;}catch(e){return false;}};
    for(let y=0;y<N;y++)for(let x=0;x<N;x++){
      if(!isStreet(x,y)||seen.has(x+','+y))continue;
      // horizontal run
      let run=[];let cx=x;
      while(cx<N&&isStreet(cx,y)&&!seen.has(cx+','+y)){run.push([cx,y]);seen.add(cx+','+y);cx++;}
      // split long runs into feeder-sized circuits (~6 cells = ~576m, real feeder scale)
      for(let i=0;i<run.length;i+=6)circuits.push(run.slice(i,i+6));
    }
    return circuits;
  }
  function powerMap(m,seed,opts){
    opts=opts||{};
    const litFraction=opts.litFraction==null?0.12:opts.litFraction;
    const weights=opts.ownerWeights||{settlement:0.55,faction:0.2,network:0.15,solar_lone:0.1};
    const r=rng((seed^0x11FE)>>>0);
    const circuits=buildCircuits(m,opts.N||96);
    const status={}; // "x,y" -> {live,owner}
    for(const c of circuits){
      const live=r()<litFraction;
      let owner=null;
      if(live){
        const roll=r(); let acc=0;
        for(const k in weights){acc+=weights[k];if(roll<acc){owner=k;break;}}
        owner=owner||'settlement';
      }
      for(const [x,y] of c)status[x+','+y]={live,owner};
    }
    return {circuits:circuits.length,
      liveCircuits:Object.values(status).filter(s=>s.live).length,
      at:(x,y)=>status[x+','+y]||{live:false,owner:null}};
  }
  return {buildCircuits,powerMap};
})();
if(typeof module!=='undefined')module.exports=BOH_POWERGRID;
