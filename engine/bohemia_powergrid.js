// BOHEMIA POWER GRID (7/14/26) — CLUSTERED POWER LAW as engine code.
// Streetlights fail by CIRCUIT (feeder death + copper theft), never
// alternating. 12% of circuits live (tunable). Every live circuit is
// OWNED: settlement / faction / network / solar_lone. Light = territory.
// WHERE network zones sit = Paolo's map call; this module is mechanics.
//
// 9/5/26 — BB-THE-NIGHT-EATS-POWER. A CIRCUIT CAN NOW BE PUT OUT, AND THE GRID
// OWNS WHETHER A LIGHT IS ON.
//   Holding a lit block was free. The row makes it a bill: every lit circuit you
//   hold costs one battery a night, and a circuit you cannot pay for GOES DARK.
//   The going-dark had to live HERE and nowhere else. Ten places on the walked
//   surface ask `POWER.at(x,y).live` — the lamp pass, the two "is it black inside"
//   checks, the fire barrel, the music's own night test — and darkening a circuit
//   by patching ten readers is nine chances to miss one and a tenth to disagree.
//   So `at()` answers the question and `douse()` changes the answer, which is the
//   same rule the purse lives under: balances are DERIVED, there is no setter.
//
//   TWO THINGS A CELL NEEDED THAT IT DID NOT HAVE:
//   1. AN ID. status carried {live,owner} and no way to say WHICH circuit, so
//      "these two buildings are on the same feeder, that is one bill" could not
//      be expressed and "put THIS circuit out" had no subject. Cells now carry
//      the circuit index they belong to.
//   2. A WAY BACK. `dark` is a separate set from `live`, never a write into it,
//      because a circuit that was never lit and a circuit somebody could not pay
//      for are different facts and the day one of them comes back on you need to
//      know which was which. serialize()/restore() carry only the doused set —
//      the grid itself is a pure function of the seed and must never be saved.
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
    const status={}; // "x,y" -> {live,owner,id}
    /* WHO HOLDS IT, BY NAME (9/5, BB-TURF). The owner has always been a CATEGORY --
       settlement / faction / network / solar_lone -- so one circuit in five came back
       owned by the generic word "faction" and the game could not say WHICH. The seam
       test on the walked surface compares those words, which means a Mob block and a
       Cartel block were the same block.
       `opts.holders` is a list of {faction,x,y,tier,power} seats and a `name(x,y)`
       that turns a cell into one of them. THIS MODULE TAKES DATA, NOT A MODULE: the
       grid stays a pure function of the map and the seed, and the caller supplies the
       geography. Handed nothing, every owner stays exactly the category it was.
       ONLY THE `faction` CATEGORY IS NAMED. settlement is a neighbourhood holding its
       own lights and solar_lone is one holdout with a panel; naming those would be
       inventing canon the row did not ask for.
       AND `network` IS LEFT ALONE ON PURPOSE, even though the graph has a faction
       called Network: the category predates the roster and treating the two as the
       same thing is a guess about his canon, not a reading of it. Written down rather
       than silently resolved. */
    const name = opts.holderAt || null;
    for(let ci=0;ci<circuits.length;ci++){
      const c=circuits[ci];
      const live=r()<litFraction;
      let owner=null, faction=null;
      if(live){
        const roll=r(); let acc=0;
        for(const k in weights){acc+=weights[k];if(roll<acc){owner=k;break;}}
        owner=owner||'settlement';
        if(owner==='faction'&&name){
          /* named off the circuit's FIRST cell, so every cell of one feeder answers
             with one holder -- a circuit that changed hands halfway down its own run
             would be a border drawn through a wire. */
          const h=name(c[0][0],c[0][1]);
          if(h&&h.faction) faction=h.faction;
        }
      }
      for(const [x,y] of c)status[x+','+y]={live,owner,id:ci,faction};
    }
    /* THE CIRCUITS SOMEBODY COULD NOT PAY FOR. Empty at boot, because a valley
       where the lights are already out is a different game and that is not the
       seed's business. */
    const dark=Object.create(null);
    const DEAD={live:false,owner:null,id:-1,faction:null};
    function raw(x,y){ return status[x+','+y]||DEAD; }
    /* THE ONE ANSWER. A doused circuit reports NOT LIVE and KEEPS ITS OWNER,
       because whose block went dark is exactly the thing you want to know when
       it does — the light went out, the claim did not. */
    function at(x,y){
      const s=raw(x,y);
      if(s.id>=0&&dark[s.id]) return {live:false,owner:s.owner,faction:s.faction,
                                       id:s.id,doused:true};
      return s;
    }
    return {circuits:circuits.length,
      liveCircuits:Object.values(status).filter(s=>s.live).length,  /* live CELLS; the name predates the id */
      at:at,
      /* the circuit a cell belongs to, or -1 for ground no feeder runs down */
      idAt:(x,y)=>raw(x,y).id,
      /* WHO HOLDS THIS BLOCK, BY NAME, or null where nobody is named. A doused
         circuit keeps its holder: the light went out, the claim did not. */
      holderAt:(x,y)=>at(x,y).faction||null,
      /* how many live circuits each named faction holds -- the owner map as a
         number, which is what BB-TERRITORY-FLAG will read. */
      holdings:function(){
        const out={};
        for(const k in status){ const s=status[k];
          if(s.live&&s.faction&&!dark[s.id]) (out[s.faction]=out[s.faction]||{cells:0,circuits:{}}),
            out[s.faction].cells++, out[s.faction].circuits[s.id]=1; }
        for(const f in out) out[f].circuits=Object.keys(out[f].circuits).length;
        return out;
      },
      /* PUT ONE OUT. Only a circuit that is actually lit can go dark, so an
         unpaid bill on a block that was never lit is not a punishment. */
      douse:function(id){
        if(!(id>=0)||id>=circuits.length) return false;
        const c=circuits[id]; if(!c||!c.length) return false;
        if(!raw(c[0][0],c[0][1]).live) return false;
        if(dark[id]) return false;
        dark[id]=1; return true;
      },
      /* AND BACK ON. Nothing calls this yet: what it costs to get your lights
         back is a price, and prices are Paolo's. It exists so that going dark is
         a state and not a one-way door nobody thought about. */
      relight:function(id){ if(dark[id]){ delete dark[id]; return true; } return false; },
      isDark:(id)=>!!dark[id],
      dark:()=>Object.keys(dark).map(Number),
      /* ONLY THE DOUSED SET RIDES THE SAVE. The grid is a pure function of the
         seed; saving it would let a stale copy outlive a seed change. */
      serialize:()=>Object.keys(dark).map(Number),
      restore:function(list){
        for(const k in dark) delete dark[k];
        if(!list||!list.length) return 0;
        let n=0;
        for(let i=0;i<list.length;i++){ const id=list[i]|0;
          if(id>=0&&id<circuits.length){ dark[id]=1; n++; } }
        return n;
      }};
  }
  return {buildCircuits,powerMap};
})();
if(typeof module!=='undefined')module.exports=BOH_POWERGRID;
