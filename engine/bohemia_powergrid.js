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
       settlement is a neighbourhood holding its own lights and solar_lone is one
       holdout with a panel; naming those would be inventing canon the row did not
       ask for, and they are still not named.
       *** AND `network` IS NO LONGER LEFT ALONE, BECAUSE SOMEBODY FINALLY LOOKED.
       *** (9/6, [light owners] NAME-THE-CIRCUIT-OWNER.) The paragraph that used to
       stand here said treating the category and the faction as one thing was "a
       guess about his canon, not a reading of it." It is a reading, and it was
       already written down. bohemia_belonging.js, the NETWORK rule, in his own
       words:
           hold: "The feed, the radio repeaters, and THE LIT GRID. They are the
                  reason a message crosses the valley in an hour instead of a day,
                  and they have never once charged for it."
       The lit grid is theirs by canon. Refusing to say so left 34 of 204 lit
       circuits -- one in six -- anonymous while his file named their owner. This
       is the authored-but-unread disease with the answer sitting two modules away.
       AND THE SECOND HALF OF THAT SENTENCE IS A CONSTRAINT, not colour: "they have
       NEVER ONCE CHARGED FOR IT", said twice in two places. A Network circuit is
       marked free, so [block rent] cannot ship a bill they would never send.

       WHAT IS STILL NOT NAMED, AND SHOULD NOT BE. settlement is a neighbourhood
       pooling its own lights and solar_lone is one holdout with a panel. Neither is
       a faction and calling them one would invent canon. What they get instead is
       GROUND: since [who holds] (9/6) every cell of the valley has a named holder,
       so an unowned circuit can still say whose land it runs under -- which is a
       different fact from whose wire it is, and it is the one [block rent] needs. */
    const name = opts.holderAt || null;
    /* HIS WORD FOR THE GRID-HOLDING FACTION. Passed in rather than typed, so this
       module still takes DATA and never a roster; absent, nothing is named and the
       behaviour is exactly what it was.
       *** LATE-BOUND, AND THE FIRST CUT WAS NOT. *** A FUNCTION is accepted and
       asked when the answer is needed, because the walked city builds its power map
       AT LOAD -- `let POWER=buildPower(om,seed)` -- and the module that carries his
       "hold: the lit grid" sentence is inlined further down the same file. Measured
       on the real surface: the name resolved to null at build time, so 34 circuits
       stayed anonymous and 0 came back free while a direct call answered "Network"
       perfectly. Same shape as the CLOUTMOD load-order bug bohemia_loop.js carries a
       paragraph about. */
    const gridOpt = opts.gridFaction || null;
    function gridFactionNow(){
      try { return (typeof gridOpt === 'function') ? (gridOpt() || null) : gridOpt; }
      catch(_e){ return null; }
    }
    for(let ci=0;ci<circuits.length;ci++){
      const c=circuits[ci];
      const live=r()<litFraction;
      let owner=null, faction=null, free=false;
      /* WHOSE LAND IT RUNS UNDER, lit or not, because a dark circuit is still on
         somebody's block and that is the whole of [block rent]'s question. Read
         off the circuit's FIRST cell for the same reason the holder is: one
         feeder, one answer, or the border runs through a wire. */
      let ground=null;
      if(name){ const g=name(c[0][0],c[0][1]); if(g&&g.faction) ground=g.faction; }
      if(live){
        const roll=r(); let acc=0;
        for(const k in weights){acc+=weights[k];if(roll<acc){owner=k;break;}}
        owner=owner||'settlement';
        if(owner==='faction'&&ground) faction=ground;
      }
      for(const [x,y] of c)status[x+','+y]={live,owner,id:ci,faction,ground,free};
    }
    /* THE CIRCUITS SOMEBODY COULD NOT PAY FOR. Empty at boot, because a valley
       where the lights are already out is a different game and that is not the
       seed's business. */
    const dark=Object.create(null);
    const DEAD={live:false,owner:null,id:-1,faction:null,ground:null,free:false};
    function raw(x,y){ return status[x+','+y]||DEAD; }
    /* THE ONE ANSWER. A doused circuit reports NOT LIVE and KEEPS ITS OWNER,
       because whose block went dark is exactly the thing you want to know when
       it does — the light went out, the claim did not. */
    /* HIS CANON, NOT A GUESS, AND ASKED AT READ TIME: the Network hold the lit
       grid and have never once charged for it. Resolved here rather than at build
       so a caller whose modules load in any order still gets the name. */
    function skin(s){
      if(s.owner!=='network') return s;
      const g=gridFactionNow();
      if(!g) return s;
      return {live:s.live,owner:s.owner,faction:s.faction||g,ground:s.ground,
              free:true,id:s.id,doused:s.doused};
    }
    function at(x,y){
      const s=raw(x,y);
      if(s.id>=0&&dark[s.id]) return skin({live:false,owner:s.owner,faction:s.faction,
                                       ground:s.ground,free:s.free,id:s.id,doused:true});
      return skin(s);
    }
    return {circuits:circuits.length,
      liveCircuits:Object.values(status).filter(s=>s.live).length,  /* live CELLS; the name predates the id */
      at:at,
      /* the circuit a cell belongs to, or -1 for ground no feeder runs down */
      idAt:(x,y)=>raw(x,y).id,
      /* WHO HOLDS THIS BLOCK, BY NAME, or null where nobody is named. A doused
         circuit keeps its holder: the light went out, the claim did not. */
      holderAt:(x,y)=>at(x,y).faction||null,
      /* AND WHOSE GROUND IT IS ON, which every circuit can answer since [who
         holds] -- a settlement pooling its own lights is nobody's circuit and is
         still standing on somebody's block. */
      groundAt:(x,y)=>at(x,y).ground||null,
      /* WHO YOU PAY FOR THIS BLOCK. The wire's owner if it has one, otherwise the
         landlord. Null only where the map itself has no holder. */
      payTo:function(x,y){ const s=at(x,y); if(s.free) return null;
        return s.faction||s.ground||null; },
      /* how many live circuits each named faction holds -- the owner map as a
         number, which is what BB-TERRITORY-FLAG will read. */
      holdings:function(){
        const out={}; const g=gridFactionNow();
        for(const k in status){ const s=status[k];
          const f = s.faction || (s.owner==='network' ? g : null);
          if(s.live&&f&&!dark[s.id]) (out[f]=out[f]||{cells:0,circuits:{}}),
            out[f].cells++, out[f].circuits[s.id]=1; }
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
