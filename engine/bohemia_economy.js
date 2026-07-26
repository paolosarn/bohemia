// BOHEMIA ECONOMY — post-collapse scarcity, grounded (7/19/26, LIFE session)
//
// The brief's law: GROUNDED IN THE REAL. Real economics of collapse, no
// fantasy. Every constant below carries its real-world anchor.
//
// WHAT COLLAPSE ECONOMIES ACTUALLY DO (research, distilled):
//   - Fiat dies with the state that backed it. Exchange reverts to BARTER and
//     then re-converges on COMMODITY MONEY — a divisible, durable, universally
//     needed good (historical: cigarettes in WWII camps and 1990s Russian
//     towns, ammunition and fuel in Balkan sieges, ration cans in besieged
//     Sarajevo, bottled water after hurricanes).
//   - WHICH commodity becomes Bohemia's money is CANON, so it is [PENDING
//     Paolo] (currency logos already sit on his shelf). Until he rules, this
//     ledger quotes barter prices in SALVAGE-KG EQUIVALENT — scrap is the one
//     thing everyone on a dead grid can produce and everyone needs — and the
//     numeraire swaps out in one place (NUMERAIRE) when he names the money.
//   - Price under scarcity is hyperbolic in remaining supply, not linear:
//     the last week of water costs more per liter than the last month did.
//     Siege data (Sarajevo 92-95): staple prices moved 10-100x, not 2x.
//
// THE MOJAVE NUMBERS (why Vegas is the perfect scarcity stage):
//   - WATER: a sedentary adult needs ~3L/day; desert labor pushes 6-8L. We
//     budget 4L/day average across a mixed day. Household plumbing is dead
//     (SNWA pumps need grid power); standing stock is water heaters (~150-
//     300L/house), toilet tanks, pools long gone to evaporation. Lake Mead
//     intakes need power the 12% grid doesn't spend on pumping.
//   - FOOD: ~2000 kcal/day = 1 ration. Vegas pre-collapse held roughly 1
//     week of grocery inventory (just-in-time trucking from CA/UT), plus
//     deep casino/resort dry stores — THE reason downtown matters. Scavenge
//     yield decays as the easy shelves empty.
//   - POWER: CLUSTERED POWER LAW — 12% of circuits live, all owned. A dark
//     suburb block produces and consumes zero grid power; power trades as a
//     SERVICE (charging, refrigeration) at owned clusters only.
//   - MEDS: insulin, antibiotics, painkillers — highest value-to-weight of
//     any salvage class (true in every real collapse market).
//
// MECHANISM-MINE / CONTENTS-PAOLO'S: FACTION_ECONOMY (who taxes, who rations,
// who controls which market) ships EMPTY. The machine prices goods; who OWNS
// the goods is his canon.
(function(root){
  var HASREQ=(typeof module!=='undefined'&&module.exports&&typeof require!=='undefined');

  function rng(seed){var s=(seed>>>0)||1;return function(){
    s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296;};}

  // ---- GOODS (unit, need/adult/day, base barter value in salvage-kg) -------
  var GOODS={
    water:  {unit:'L',      need:4.0,  base:0.25, note:'3L sedentary, 6-8 desert labor; 4 mixed'},
    food:   {unit:'ration', need:1.0,  base:1.5,  note:'1 ration = ~2000 kcal'},
    salvage:{unit:'kg',     need:0,    base:1.0,  note:'the numeraire until Paolo names the money'},
    meds:   {unit:'dose',   need:0.02, base:12.0, note:'rare use, extreme value/weight'},
    fuel:   {unit:'L',      need:0.05, base:3.0,  note:'generators/stoves; stale gas is cut with additives'},
    power:  {unit:'kWh',    need:0,    base:2.0,  note:'a SERVICE at live clusters only (12% law)'}
  };
  var NUMERAIRE='salvage';   // [PENDING Paolo: the commodity money + its logo]

  // ---- WORK YIELDS (per agent per worked day, in goods) --------------------
  // site job: organized crew at a real district (warehouse floor, market,
  // clinic, solar yard) — better yield, and pays in the goods the site moves.
  // scav: subsistence sweep of an already-picked block — thin and decaying.
  var YIELD={
    site: {salvage:3.0, food:0.3},
    scav: {salvage:1.2, food:0.15}
  };
  // scavenge decay: yield multiplier halves every ~180 days of picking the
  // same ground (the easy shelves empty; grounded in real disaster looting
  // curves — day-one supermarkets vs month-three).
  function scavDecay(day){ return Math.pow(0.5, (day||0)/180); }

  // ---- FACTION TABLE — EMPTY (CONTENTS-PAOLO'S) ----------------------------
  var FACTION_ECONOMY={};

  // ---- LEDGER --------------------------------------------------------------
  // One ledger per settlement/block. Starting stocks are the block's REAL
  // standing water/food (water heaters + pantries), deterministic per seed.
  function makeLedger(seed, nAgents, nHouses){
    var r=rng((seed^0xEC0)>>>0);
    return {
      seed:seed>>>0, day:0, agents:nAgents|0, houses:nHouses|0,
      stocks:{
        // ~200L water heater + ~30L containers per house, +-20% condition
        water: Math.round(nHouses*(200+60*r())),
        // ~10 days pantry per resident at collapse, minus what's been eaten:
        // this block has been living on it — call it a working reserve
        food:  Math.round(nAgents*(8+6*r())),
        salvage: Math.round(nAgents*(2+3*r())),
        meds:  Math.round(nAgents*0.6+ r()*3),
        fuel:  Math.round(nHouses*(1.5+2*r())),
        power: 0                                  // dark block: the 12% law
      },
      flows:{produced:{},consumed:{},shortfall:{}} // last advanceDay result
    };
  }

  // ---- PRICE — hyperbolic in days-of-supply, monotone in scarcity ----------
  // daysLeft = stock / dailyNeed. Price multiplies as supply tightens:
  //   >30 days: base. 30..7: ramp. <7: hyperbolic (last-week water).
  // Monotone DECREASING in stock — the gate proves it stays that way.
  function scarcityMult(daysLeft){
    if(!isFinite(daysLeft)) return 1;
    if(daysLeft>=30) return 1;
    if(daysLeft<=0)  return 40;                       // out: siege price
    var m=30/Math.max(daysLeft,0.75);                 // hyperbola through 1@30d
    return Math.min(40, m);                           // capped at siege ratio
  }
  function price(ledger, good){
    var g=GOODS[good]; if(!g) return null;
    var dailyNeed=g.need*ledger.agents;
    var daysLeft=dailyNeed>0 ? ledger.stocks[good]/dailyNeed : Infinity;
    return +(g.base*scarcityMult(daysLeft)).toFixed(2);
  }
  function daysLeft(ledger, good){
    var g=GOODS[good]; var dn=g.need*ledger.agents;
    return dn>0 ? +(ledger.stocks[good]/dn).toFixed(1) : Infinity;
  }

  // ---- ADVANCE ONE DAY -----------------------------------------------------
  // agents: the block population (bohemia_agents specs — job.kind drives
  // yield). CONSERVATION: stock delta EXACTLY equals produced - consumed;
  // shortfall records unmet need (nothing goes negative, nothing appears).
  function advanceDay(ledger, agents){
    var produced={}, consumed={}, shortfall={};
    var decay=scavDecay(ledger.day);
    (agents||[]).forEach(function(a){
      var y=YIELD[a.job&&a.job.kind==='site'?'site':'scav'];
      var mult=(a.job&&a.job.kind==='site')?1:decay;   // organized sites hold yield longer
      Object.keys(y).forEach(function(good){
        produced[good]=(produced[good]||0)+y[good]*mult; });
    });
    Object.keys(GOODS).forEach(function(good){
      var need=GOODS[good].need*ledger.agents;
      if(need>0) consumed[good]=need;
    });
    // apply: produce first, then consume down to zero, log unmet as shortfall
    Object.keys(produced).forEach(function(good){
      produced[good]=+produced[good].toFixed(2);
      ledger.stocks[good]=+(ledger.stocks[good]+produced[good]).toFixed(2); });
    Object.keys(consumed).forEach(function(good){
      var want=consumed[good], have=ledger.stocks[good];
      var take=Math.min(want,have);
      ledger.stocks[good]=+(have-take).toFixed(2);
      consumed[good]=+take.toFixed(2);
      if(want-take>1e-9) shortfall[good]=+(want-take).toFixed(2);
    });
    ledger.day++;
    ledger.flows={produced:produced,consumed:consumed,shortfall:shortfall};
    return ledger.flows;
  }

  // human-readable market readout for HUDs/judges
  function report(ledger){
    return Object.keys(GOODS).map(function(good){
      var d=daysLeft(ledger,good);
      return {good:good, unit:GOODS[good].unit,
        stock:+(+ledger.stocks[good]).toFixed(1),
        daysLeft:d===Infinity?null:d,
        price:price(ledger,good)};
    });
  }

  var API={GOODS:GOODS,NUMERAIRE:NUMERAIRE,YIELD:YIELD,scavDecay:scavDecay,
    makeLedger:makeLedger,advanceDay:advanceDay,price:price,daysLeft:daysLeft,
    scarcityMult:scarcityMult,report:report,FACTION_ECONOMY:FACTION_ECONOMY};
  if(HASREQ) module.exports=API;
  root.BohemiaEconomy=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
