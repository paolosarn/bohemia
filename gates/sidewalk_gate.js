const G=require('../engine/bohemia_blockgen.js');
let p=0,f=0; const ok=(n,c)=>{c?p++:(f++,console.log("FAIL "+n));};

// sweep every street-ish recipe across many seeds; not one violation allowed
let blocks=0,violations=0,lamps=0,barrels=0;
for(let seed=0;seed<400;seed++){
  for(const t of ['street','freeway','residential']){
    const b=G.generate(t,seed,24,{});
    blocks++;
    const bad=G.auditSidewalks(b);
    violations+=bad.length;
    if(bad.length&&violations<=3) console.log("  violation",t,seed,JSON.stringify(bad[0]));
    b.grid.flat().forEach(c=>c.props.forEach(q=>{
      if(q.p==='street_lamp')lamps++; if(q.p==='fire_barrel')barrels++;}));
  }
}
console.log(`  swept ${blocks} blocks: ${violations} sidewalk violations, ${lamps} lamps, ${barrels} barrels`);
ok("zero sidewalk violations across 400 seeds x 3 recipes", violations===0);
ok("lamps still placed (law is a whitelist, not a ban)", lamps>0);
ok("fire barrels still placed (street furniture is legal)", barrels>0);

// the choke itself refuses trespassers
const side={g:'side',props:[]}, lane={g:'lane',props:[]};
ok("choke refuses a ruin on a sidewalk", G.placeProp(side,{p:'ruin_flank'})===false&&side.props.length===0);
ok("choke refuses a car wreck on a sidewalk", G.placeProp(side,{p:'car_wreck'})===false);
ok("choke refuses a building on a sidewalk", G.placeProp(side,{p:'building_stamp'})===false);
ok("choke allows a lamp on a sidewalk", G.placeProp(side,{p:'street_lamp'})===true);
ok("bench is NOT legal by default — it is on Paolo's shelf, not in the law",
   G.placeProp({g:'side',props:[]},{p:'bench'})===false);
ok("proposed furniture is admitted only when explicitly opted in",
   G.placeProp({g:'side',props:[]},{p:'bench'},G.sidewalkLegal({sidewalkFurniture:['bench']}))===true);
ok("opting in one name does not admit the rest",
   G.placeProp({g:'side',props:[]},{p:'hydrant'},G.sidewalkLegal({sidewalkFurniture:['bench']}))===false);
ok("a name Paolo never proposed cannot be opted in either",
   G.placeProp({g:'side',props:[]},{p:'ruin_frag'},G.sidewalkLegal({sidewalkFurniture:['ruin_frag']}))===false);
ok("only lamps and barrels are law-backed", G.SIDEWALK_LEGAL.size===2&&G.SIDEWALK_LEGAL.has('street_lamp')&&G.SIDEWALK_LEGAL.has('fire_barrel'));
ok("choke never blocks a lane cell", G.placeProp(lane,{p:'car_wreck'})===true);
ok("RUIN FLANKS stays dead", !G.SIDEWALK_LEGAL.has('ruin_flank'));

// determinism must survive the choke
ok("street gen still deterministic", JSON.stringify(G.generate('street',7,24,{}))===JSON.stringify(G.generate('street',7,24,{})));
// existing laws intact
const b=G.generate('street',201,24,{lanes:2,intersection:true});
ok("lane width law intact", G.LANE_W===2&&b.meta.lanes===2);
ok("freeway still 5/dir", G.generate('freeway',1,24,{}).meta.lanes===5);
console.log(`\n=== SIDEWALK SANCTITY GATE: ${p} passed, ${f} failed ===`);
process.exit(f?1:0);
