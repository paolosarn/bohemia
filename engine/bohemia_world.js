// BOHEMIA WORLD MODEL (7/18/26) — the spine. ONE addressable hierarchy over the
// whole valley so nothing has to address the world four different ways again:
//
//   world(seed).at(x,y)            -> the overmap cell (district, quality, seed)
//              .plot(x,y)          -> the plot: its block grid + building footprints
//              .plot(x,y).building(i).floorplan()  -> that building's interior rooms
//
// It COMPOSES the existing generators (overmap -> bridge -> blockgen -> floorplan),
// it does not re-implement them. Lazy + deterministic: every level is derived
// from the cell's own seed on demand, so addressing a room never generates the
// whole valley. This is the rung the bakes / combat / city-builder / sim all read.
(function(root){
  var HASREQ = (typeof module!=='undefined' && module.exports && typeof require!=='undefined');
  // browser: the engine modules are script-scope consts in the concatenated
  // slice (not window props), so fall back to the bare identifier, typeof-guarded.
  var OM = HASREQ ? require('./bohemia_overmap.js')        : (typeof BohemiaOvermap!=='undefined'?BohemiaOvermap:root.BohemiaOvermap);
  var BR = HASREQ ? require('./bohemia_overmap_bridge.js') : (typeof BOH_OMBRIDGE!=='undefined'?BOH_OMBRIDGE:root.BOH_OMBRIDGE);
  var BG = HASREQ ? require('./bohemia_blockgen.js')       : (typeof BOH_BLOCKGEN!=='undefined'?BOH_BLOCKGEN:root.BOH_BLOCKGEN);
  var FP = HASREQ ? require('./bohemia_floorplan.js')      : (typeof BOH_FLOORPLAN!=='undefined'?BOH_FLOORPLAN:root.BOH_FLOORPLAN);
  var KIT= HASREQ ? require('./bohemia_district_kit.js')   : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var SUB= HASREQ ? require('./bohemia_suburb.js')         : (typeof BohemiaSuburb!=='undefined'?BohemiaSuburb:root.BohemiaSuburb);
  var COM= HASREQ ? require('./bohemia_commercial.js')     : (typeof BohemiaCommercial!=='undefined'?BohemiaCommercial:root.BohemiaCommercial);
  var IND= HASREQ ? require('./bohemia_industrial.js')     : (typeof BohemiaIndustrial!=='undefined'?BohemiaIndustrial:root.BohemiaIndustrial);
  var MED= HASREQ ? require('./bohemia_medical.js')        : (typeof BohemiaMedical!=='undefined'?BohemiaMedical:root.BohemiaMedical);
  var SOL= HASREQ ? require('./bohemia_solar.js')          : (typeof BohemiaSolar!=='undefined'?BohemiaSolar:root.BohemiaSolar);
  var PRK= HASREQ ? require('./bohemia_park.js')           : (typeof BohemiaPark!=='undefined'?BohemiaPark:root.BohemiaPark);
  var WSH= HASREQ ? require('./bohemia_wash.js')           : (typeof BohemiaWash!=='undefined'?BohemiaWash:root.BohemiaWash);
  var CEM= HASREQ ? require('./bohemia_cemetery.js')       : (typeof BohemiaCemetery!=='undefined'?BohemiaCemetery:root.BohemiaCemetery);
  var DRV= HASREQ ? require('./bohemia_drivein.js')        : (typeof BohemiaDrivein!=='undefined'?BohemiaDrivein:root.BohemiaDrivein);
  var GLF= HASREQ ? require('./bohemia_golf.js')           : (typeof BohemiaGolf!=='undefined'?BohemiaGolf:root.BohemiaGolf);
  var STD= HASREQ ? require('./bohemia_stadium.js')        : (typeof BohemiaStadium!=='undefined'?BohemiaStadium:root.BohemiaStadium);
  var TKS= HASREQ ? require('./bohemia_truckstop.js')      : (typeof BohemiaTruckstop!=='undefined'?BohemiaTruckstop:root.BohemiaTruckstop);
  var SCH= HASREQ ? require('./bohemia_school.js')         : (typeof BohemiaSchool!=='undefined'?BohemiaSchool:root.BohemiaSchool);
  var FIR= HASREQ ? require('./bohemia_firestation.js')    : (typeof BohemiaFirestation!=='undefined'?BohemiaFirestation:root.BohemiaFirestation);
  var SWP= HASREQ ? require('./bohemia_swapmeet.js')       : (typeof BohemiaSwapmeet!=='undefined'?BohemiaSwapmeet:root.BohemiaSwapmeet);
  var STO= HASREQ ? require('./bohemia_storage.js')        : (typeof BohemiaStorage!=='undefined'?BohemiaStorage:root.BohemiaStorage);
  var WTR= HASREQ ? require('./bohemia_watertreat.js')     : (typeof BohemiaWatertreat!=='undefined'?BohemiaWatertreat:root.BohemiaWatertreat);
  var BNY= HASREQ ? require('./bohemia_boneyard.js')       : (typeof BohemiaBoneyard!=='undefined'?BohemiaBoneyard:root.BohemiaBoneyard);
  var POL= HASREQ ? require('./bohemia_policestation.js')  : (typeof BohemiaPolicestation!=='undefined'?BohemiaPolicestation:root.BohemiaPolicestation);
  var LIB= HASREQ ? require('./bohemia_library.js')        : (typeof BohemiaLibrary!=='undefined'?BohemiaLibrary:root.BohemiaLibrary);
  var LFL= HASREQ ? require('./bohemia_landfill.js')       : (typeof BohemiaLandfill!=='undefined'?BohemiaLandfill:root.BohemiaLandfill);
  var RLY= HASREQ ? require('./bohemia_railyard.js')       : (typeof BohemiaRailyard!=='undefined'?BohemiaRailyard:root.BohemiaRailyard);
  var SBS= HASREQ ? require('./bohemia_substation.js')     : (typeof BohemiaSubstation!=='undefined'?BohemiaSubstation:root.BohemiaSubstation);
  // THE UTILITY LANDMARK FACTORY (8/5): ONE module registering TWELVE named landmarks the
  // 8/5 valley census caught generating empty ground -- quarry, gypsum, fueldepot,
  // reservoir, pumpstation, intake, granary, arsenal, datafort, basin, reclaim, radio.
  // Requiring it registers all twelve on the kit; UTL.<type>.generate is the per-type body.
  var UTL= HASREQ ? require('./bohemia_utility.js')        : (typeof BohemiaUtility!=='undefined'?BohemiaUtility:root.BohemiaUtility);
  var CHP= HASREQ ? require('./bohemia_chapel.js')         : (typeof BohemiaChapel!=='undefined'?BohemiaChapel:root.BohemiaChapel);
  var CTH= HASREQ ? require('./bohemia_courthouse.js')     : (typeof BohemiaCourthouse!=='undefined'?BohemiaCourthouse:root.BohemiaCourthouse);
  var JAL= HASREQ ? require('./bohemia_jail.js')           : (typeof BohemiaJail!=='undefined'?BohemiaJail:root.BohemiaJail);
  var FRM= HASREQ ? require('./bohemia_farm.js')           : (typeof BohemiaFarm!=='undefined'?BohemiaFarm:root.BohemiaFarm);
  var DTN= HASREQ ? require('./bohemia_downtown.js')       : (typeof BohemiaDowntown!=='undefined'?BohemiaDowntown:root.BohemiaDowntown);
  var TRL= HASREQ ? require('./bohemia_trailer.js')        : (typeof BohemiaTrailer!=='undefined'?BohemiaTrailer:root.BohemiaTrailer);
  var APT= HASREQ ? require('./bohemia_apartment.js')      : (typeof BohemiaApartment!=='undefined'?BohemiaApartment:root.BohemiaApartment);
  var WHS= HASREQ ? require('./bohemia_warehouse.js')      : (typeof BohemiaWarehouse!=='undefined'?BohemiaWarehouse:root.BohemiaWarehouse);
  var WTP= HASREQ ? require('./bohemia_waterpark.js')      : (typeof BohemiaWaterpark!=='undefined'?BohemiaWaterpark:root.BohemiaWaterpark);
  var MLL= HASREQ ? require('./bohemia_mall.js')           : (typeof BohemiaMall!=='undefined'?BohemiaMall:root.BohemiaMall);
  var GAR= HASREQ ? require('./bohemia_garage.js')         : (typeof BohemiaGarage!=='undefined'?BohemiaGarage:root.BohemiaGarage);
  var CRY= HASREQ ? require('./bohemia_crypt.js')          : (typeof BohemiaCrypt!=='undefined'?BohemiaCrypt:root.BohemiaCrypt);
  var CTY= HASREQ ? require('./bohemia_cityhall.js')       : (typeof BohemiaCityhall!=='undefined'?BohemiaCityhall:root.BohemiaCityhall);
  var BAT= HASREQ ? require('./bohemia_battery.js')        : (typeof BohemiaBattery!=='undefined'?BohemiaBattery:root.BohemiaBattery);
  var TRM= HASREQ ? require('./bohemia_terminal.js')       : (typeof BohemiaTerminal!=='undefined'?BohemiaTerminal:root.BohemiaTerminal);
  var AIR= HASREQ ? require('./bohemia_airfield.js')       : (typeof BohemiaAirfield!=='undefined'?BohemiaAirfield:root.BohemiaAirfield);
  var ART= HASREQ ? require('./bohemia_arterial.js')       : (typeof BohemiaArterial!=='undefined'?BohemiaArterial:root.BohemiaArterial);
  var FWY= HASREQ ? require('./bohemia_freeway.js')        : (typeof BohemiaFreeway!=='undefined'?BohemiaFreeway:root.BohemiaFreeway);
  var DSR= HASREQ ? require('./bohemia_desert.js')         : (typeof BohemiaDesert!=='undefined'?BohemiaDesert:root.BohemiaDesert);
  var MTN= HASREQ ? require('./bohemia_mountain.js')       : (typeof BohemiaMountain!=='undefined'?BohemiaMountain:root.BohemiaMountain);
  var WAT= HASREQ ? require('./bohemia_water.js')          : (typeof BohemiaWater!=='undefined'?BohemiaWater:root.BohemiaWater);
  var CMP= HASREQ ? require('./bohemia_campus.js')          : (typeof BohemiaCampus!=='undefined'?BohemiaCampus:root.BohemiaCampus);
  var SPW= HASREQ ? require('./bohemia_speedway.js')        : (typeof BohemiaSpeedway!=='undefined'?BohemiaSpeedway:root.BohemiaSpeedway);
  // ONE WORLD INTERIORS step 1: inside is a property of the CELL, not a state of
  // the player (spec S2). Nothing renders differently yet.
  var RMS= HASREQ ? require('./bohemia_rooms.js')           : (typeof BOH_ROOMS!=='undefined'?BOH_ROOMS:root.BOH_ROOMS);
  var TWN= HASREQ ? require('./bohemia_town.js')            : (typeof BohemiaTown!=='undefined'?BohemiaTown:root.BohemiaTown);
  var BLP= HASREQ ? require('./bohemia_ballpark.js')        : (typeof BohemiaBallpark!=='undefined'?BohemiaBallpark:root.BohemiaBallpark);
  var RAI= HASREQ ? require('./bohemia_rail.js')           : (typeof BohemiaRail!=='undefined'?BohemiaRail:root.BohemiaRail);
  var ICH= HASREQ ? require('./bohemia_interchange.js')    : (typeof BohemiaInterchange!=='undefined'?BohemiaInterchange:root.BohemiaInterchange);
  // GAMING & RESORT is BESPOKE (Paolo 7/18): casinos/resorts get individual hand-crafted
  // love, NOT the auto-factory. No DISTGEN entry — they stay landmark placeholders until built by hand.

  // THE FACTORY (Paolo 7/18): a district TYPE -> its generator. Adding a district is now
  // one line here. Each generator emits {g,W,H} + a footprints() of enterable buildings;
  // the world model treats them all uniformly. streets are inferred from road neighbors.
  var DISTGEN = {
    suburb:     { mod:SUB, foot:function(r){return SUB.homeFootprints(r);},  zone:'residential' },
    gated:      { mod:SUB, foot:function(r){return SUB.homeFootprints(r);},  zone:'residential' },
    estate:     { mod:SUB, foot:function(r){return SUB.homeFootprints(r);},  zone:'residential' },
    commercial: { mod:COM, foot:function(r){return COM.storeFootprints(r);}, zone:'retail' },
    industrial: { mod:IND, foot:function(r){return r.footprints;},           zone:'warehouse' },
    medical:    { mod:MED, foot:function(r){return r.footprints;},           zone:'institutional' },
    solar:      { mod:SOL, foot:function(r){return r.footprints;},           zone:'office' },
    park:       { mod:PRK, foot:function(r){return r.footprints;},           zone:'default' },
    wash:       { mod:WSH, foot:function(r){return r.footprints;},           zone:'default' },
    cemetery:   { mod:CEM, foot:function(r){return r.footprints;},           zone:'institutional' },
    drivein:    { mod:DRV, foot:function(r){return r.footprints;},           zone:'leisure' },
    golf:       { mod:GLF, foot:function(r){return r.footprints;},           zone:'leisure' },
    stadium:    { mod:STD, foot:function(r){return r.footprints;},           zone:'leisure' },
    truckstop:  { mod:TKS, foot:function(r){return r.footprints;},           zone:'retail' },
    school:     { mod:SCH, foot:function(r){return r.footprints;},           zone:'institutional' },
    firestation:{ mod:FIR, foot:function(r){return r.footprints;},           zone:'institutional' },
    swapmeet:   { mod:SWP, foot:function(r){return r.footprints;},           zone:'retail' },
    storage:    { mod:STO, foot:function(r){return r.footprints;},           zone:'warehouse' },
    watertreat: { mod:WTR, foot:function(r){return r.footprints;},           zone:'warehouse' },
    boneyard:   { mod:BNY, foot:function(r){return r.footprints;},           zone:'warehouse' },
    policestation:{ mod:POL, foot:function(r){return r.footprints;},         zone:'institutional' },
    library:    { mod:LIB, foot:function(r){return r.footprints;},           zone:'civic' },
    landfill:   { mod:LFL, foot:function(r){return r.footprints;},           zone:'warehouse' },
    railyard:   { mod:RLY, foot:function(r){return r.footprints;},           zone:'warehouse' },
    substation: { mod:SBS, foot:function(r){return r.footprints;},           zone:'warehouse' },
    chapel:     { mod:CHP, foot:function(r){return r.footprints;},           zone:'civic' },
    courthouse: { mod:CTH, foot:function(r){return r.footprints;},           zone:'civic' },
    jail:       { mod:JAL, foot:function(r){return r.footprints;},           zone:'institutional' },
    farm:       { mod:FRM, foot:function(r){return r.footprints;},           zone:'default' },
    downtown:   { mod:DTN, foot:function(r){return r.footprints;},           zone:'retail' },
    trailer:    { mod:TRL, foot:function(r){return r.footprints;},           zone:'residential' },
    apartment:  { mod:APT, foot:function(r){return r.footprints;},           zone:'residential' },
    warehouse:  { mod:WHS, foot:function(r){return r.footprints;},           zone:'warehouse' },
    waterpark:  { mod:WTP, foot:function(r){return r.footprints;},           zone:'leisure' },
    mall:       { mod:MLL, foot:function(r){return r.footprints;},           zone:'retail' },
    cityhall:   { mod:CTY, foot:function(r){return r.footprints;},           zone:'civic' },
    battery:    { mod:BAT, foot:function(r){return r.footprints;},           zone:'warehouse' },
    terminal:   { mod:TRM, foot:function(r){return r.footprints;},           zone:'institutional' },
    // THE LANDMARK SET (7/27): the biggest two of the 88 buildable cells that were
    // still flat. Both are real districts on the kit, street-aware and drivable.
    campus:     { mod:CMP, foot:function(r){return r.footprints;},           zone:'institutional' },
    speedway:   { mod:SPW, foot:function(r){return r.footprints;},           zone:'leisure' },
    town:       { mod:TWN, foot:function(r){return r.footprints;},           zone:'residential' },
    ballpark:   { mod:BLP, foot:function(r){return r.footprints;},           zone:'leisure' },
    // THE TWELVE UTILITY LANDMARKS (8/5). Every one of these was already SITED by the
    // overmap with real geography behind it (Sloan quarry, the granary on the rail line,
    // the Lake Mead intake, the tank farm, the flood detention basins) and every one of
    // them generated bare ground until the census counted them. One factory, twelve specs.
    quarry:     { mod:UTL.quarry,      foot:function(r){return r.footprints;}, zone:'warehouse' },
    gypsum:     { mod:UTL.gypsum,      foot:function(r){return r.footprints;}, zone:'warehouse' },
    fueldepot:  { mod:UTL.fueldepot,   foot:function(r){return r.footprints;}, zone:'warehouse' },
    reservoir:  { mod:UTL.reservoir,   foot:function(r){return r.footprints;}, zone:'warehouse' },
    pumpstation:{ mod:UTL.pumpstation, foot:function(r){return r.footprints;}, zone:'warehouse' },
    intake:     { mod:UTL.intake,      foot:function(r){return r.footprints;}, zone:'warehouse' },
    granary:    { mod:UTL.granary,     foot:function(r){return r.footprints;}, zone:'warehouse' },
    arsenal:    { mod:UTL.arsenal,     foot:function(r){return r.footprints;}, zone:'warehouse' },
    datafort:   { mod:UTL.datafort,    foot:function(r){return r.footprints;}, zone:'office' },
    basin:      { mod:UTL.basin,       foot:function(r){return r.footprints;}, zone:'default' },
    reclaim:    { mod:UTL.reclaim,     foot:function(r){return r.footprints;}, zone:'warehouse' },
    radio:      { mod:UTL.radio,       foot:function(r){return r.footprints;}, zone:'office' }
  };
  /* SURFACE CELLS (7/26/26, WORLD lane — Paolo: "we need to actually build a fucking
     world"). A road cell is NOT a district: it never becomes faction territory, an
     economy district, a spawn tier or a quest address, so it deliberately does NOT go
     in DISTGEN (isAutoDistrict stays false for it and every consumer that counts
     districts keeps counting exactly what it counted before). But it is REAL GROUND
     a body stands on, and 37% of the valley is made of it, so it gets a generator and
     plot() renders it like anything else.

     A surface cell is a NETWORK TILE, not a street-fronting lot: it is handed the
     directions whose neighbours are also road (`links`), never rotateToStreet. */
  var SURFACEGEN = {
    arterial: { mod:ART, zone:'default' },
    freeway:  { mod:FWY, zone:'default' },
    // TERRAIN (7/26): the raw land. Sampled from ONE valley-wide noise field in global
    // coordinates (bohemia_terrain_noise.js), never from the cell seed, so ridges,
    // rills and shorelines cross cell boundaries without a seam. Still surfaces, never
    // districts: nobody bases a faction on a mountain.
    desert:   { mod:DSR, zone:'default' },
    mountain: { mod:MTN, zone:'default' },
    water:    { mod:WAT, zone:'default' },
    // THE AIRFIELDS (7/26): a blob, not a cell. Surfaces, not districts, for the same
    // reason the roads are: nothing should be able to base a faction on a runway until
    // Paolo rules that an airfield is claimable ground.
    airport:  { mod:AIR, zone:'institutional' },
    airbase:  { mod:AIR, zone:'institutional' },
    /* THE RAILWAY AND THE STACK (7/27). The last two network surfaces in the valley: one
       unbroken 90-cell mainline down column 54, and the 16-cell block where the two
       interstates cross. The interchange is CLUSTER-BUILT for the same reason the
       airfield is (a 300 m flyover cannot be drawn 96 m at a time); the railway is a
       per-cell network tile like the arterial, but its continuity is computed with
       continuityLinks so the line survives the freeways that bridge over it. */
    rail:         { mod:RAI, zone:'default' },
    interchange:  { mod:ICH, zone:'default' }
  };
  /* THE CLUSTER A CELL BELONGS TO. A runway is three kilometres long and a cell is
     96 metres, so an airfield is not a cell, it is a BLOB of them, and no generator
     can lay a runway without knowing where its own field starts and ends. This walks
     the connected same-type cells once per blob, caches the result on the map, and
     hands every cell of that blob the same bounds — which is what makes the runway
     arrive in the next cell exactly where it left this one. */
  function clusterBoundsOf(m,x,y,kind){
    m.__clusters = m.__clusters || {};
    var key0 = kind + ':' + x + ',' + y;
    if (m.__clusters[key0]) return m.__clusters[key0];
    var seen = {}, q = [[x,y]], head = 0, cells = [];
    seen[x+','+y] = 1;
    while (head < q.length && cells.length < 4096) {
      var c = q[head++]; cells.push(c);
      var D = [[1,0],[-1,0],[0,1],[0,-1]];
      for (var i=0;i<4;i++){
        var nx=c[0]+D[i][0], ny=c[1]+D[i][1], k=nx+','+ny;
        if (seen[k]) continue;
        var cell=m.at(nx,ny); if(!cell||cell.district!==kind) continue;
        seen[k]=1; q.push([nx,ny]);
      }
    }
    var xs=cells.map(function(c){return c[0];}), ys=cells.map(function(c){return c[1];});
    var b = { x0:Math.min.apply(null,xs), x1:Math.max.apply(null,xs),
              y0:Math.min.apply(null,ys), y1:Math.max.apply(null,ys), cells:cells.length };
    cells.forEach(function(c){ m.__clusters[kind+':'+c[0]+','+c[1]] = b; });
    return b;
  }

  /* WHICH APPROACHES A CLUSTER ACTUALLY HAS. An interchange has to put its ramps on the
     real interstate, and the only place that truth lives is the map: which cells around
     the block are freeway. This walks the block's perimeter once, caches it beside the
     bounds, and hands back the COLUMNS a road arrives on from the north or south and the
     ROWS it arrives on from the east or west. Without it the module would have to assume
     the junction is symmetric, and an assumption is exactly what a generator should never
     make about ground somebody else laid out. */
  var HIWAYSET={freeway:1,beltway:1};
  function clusterApproach(m,b,kind){
    m.__approach = m.__approach || {};
    var key0 = kind+':'+b.x0+','+b.y0+','+b.x1+','+b.y1;
    if (m.__approach[key0]) return m.__approach[key0];
    var at=function(xx,yy){var c=m.at(xx,yy);return c?c.district:null;};
    var nsSet={}, ewSet={}, x, y;
    /* FREEWAY ONLY, not ROADSET. The mile-grid arterials run right up against the
       interchange block on every side, so asking "is this a road" answered YES for all
       four columns and all four rows, the corridors swallowed the whole block, and eight
       ramps rendered as nothing. An interchange is where two HIGHWAYS cross; a surface
       street that happens to touch it is a neighbour, not an approach. */
    for(x=b.x0;x<=b.x1;x++){ if(HIWAYSET[at(x,b.y0-1)]||HIWAYSET[at(x,b.y1+1)]) nsSet[x]=1; }
    for(y=b.y0;y<=b.y1;y++){ if(HIWAYSET[at(b.x0-1,y)]||HIWAYSET[at(b.x1+1,y)]) ewSet[y]=1; }
    var out={ ns:Object.keys(nsSet).map(Number).sort(function(a,c){return a-c;}),
              ew:Object.keys(ewSet).map(Number).sort(function(a,c){return a-c;}) };
    m.__approach[key0]=out; return out;
  }

  /* CONTINUITY, WHICH IS NOT THE SAME AS ADJACENCY. A rail cell whose neighbour is a
     freeway has NOT hit the end of the line: the freeway bridges over and the mainline
     runs on underneath. So a corridor's own continuation is its same-kind neighbours PLUS
     any direction where another SURFACE is crossing it and the same kind resumes on the
     far side, looked ahead as far as a crossing can plausibly be wide. Adjacency alone
     would have severed the valley's one railway into three pieces at the freeways. */
  function continuityLinks(m,x,y,kind){
    var at=function(xx,yy){var c=m.at(xx,yy);return c?c.district:null;};
    var D=[['N',0,-1],['S',0,1],['E',1,0],['W',-1,0]], out=[];
    for(var i=0;i<D.length;i++){
      var d=at(x+D[i][1],y+D[i][2]);
      if(d===kind){ out.push(D[i][0]); continue; }
      if(!d || !SURFACEGEN[d]) continue;
      for(var k=2;k<=4;k++){
        var far=at(x+D[i][1]*k, y+D[i][2]*k);
        if(far===kind){ out.push(D[i][0]); break; }
        if(!far || !SURFACEGEN[far]) break;
      }
    }
    return out;
  }

  // which edges face something OTHER than this same terrain (a mountain lays its
  // alluvial fan onto the flat exactly there)
  function openEdges(m,x,y,kind){
    var at=function(xx,yy){var c=m.at(xx,yy);return c?c.district:null;};
    var out=[];
    if(at(x,y-1)!==kind)out.push('N'); if(at(x,y+1)!==kind)out.push('S');
    if(at(x+1,y)!==kind)out.push('E'); if(at(x-1,y)!==kind)out.push('W');
    return out;
  }
  /* Which neighbours are road, split by CLASS. A freeway continues only into another
     freeway (it has no at-grade crossings at all); a mile-grid arterial that runs up
     against it is not a connection, it is what crosses OVER it on a deck. Getting that
     split right is the whole difference between a corridor and a plus sign. */
  function roadLinks(m,x,y,kind){
    var at=function(xx,yy){var c=m.at(xx,yy);return c?c.district:null;};
    var D=[['N',0,-1],['S',0,1],['E',1,0],['W',-1,0]];
    var same=[], other=[], all=[];
    for(var i=0;i<D.length;i++){
      var d=at(x+D[i][1],y+D[i][2]);
      if(!ROADSET[d]) continue;
      all.push(D[i][0]);
      if(kind && d===kind) same.push(D[i][0]); else other.push(D[i][0]);
    }
    return { all:all, same:same, cross:other };
  }

  function neighborStreets(m,x,y){ var at=function(xx,yy){var c=m.at(xx,yy);return c?c.district:null;};
    return KIT.streetEdges({N:at(x,y-1),S:at(x,y+1),W:at(x-1,y),E:at(x+1,y)}); }

  // LANDLOCKED DISTRICT LAW (Paolo 7/21/26, LOCKED): "if there is an interior district not
  // touching a street it has to be a suburb or apt complex that has roads from another
  // suburb/apt complex touching the street, so the two districts' street touch." The overmap
  // generator (bohemia_overmap.js) enforces the TYPE half for the common case: a RANDOM-ROLL
  // interior cell can only become suburb/desert, never commercial/industrial/park/etc. Some
  // district types still place as multi-cell CLUSTERS/blobs (downtown's rect, a farm/park blob,
  // a granary/pumpstation landmark pair) where the interior of that same-type blob can still be
  // 2+ tiles off the nearest real street even though the blob's seed cell was street-checked —
  // the exact same shape of problem, one level up. This is the CONNECTIVITY half, generalized to
  // every auto-factory type (not just suburb): a real, no-default street-edge check (unlike
  // neighborStreets, which fakes ['S'] when nothing real is there), and a one-time BFS that finds,
  // for every landlocked cell, the shortest chain of SAME-FAMILY neighbors out to a cell that
  // truly touches a mile arterial — then marks the connecting edge on BOTH sides of every hop so
  // the two districts' gates land on the same tile offset (K.pedGate/suburb's denseFill always
  // center a gate at n/2, so two neighbors that both open toward each other line up automatically).
  var SUBURB_FAMILY={suburb:1,gated:1,estate:1,apartment:1};  // apt complex: built 7/21/26
  function familyOf(d){ return SUBURB_FAMILY[d] ? 'suburb' : d; }
  var ROADSET={freeway:1,arterial:1,strip:1,beltway:1};
  function rawStreetEdges(m,x,y){ var at=function(xx,yy){var c=m.at(xx,yy);return c?c.district:null;};
    var out=[]; if(ROADSET[at(x,y-1)])out.push('N'); if(ROADSET[at(x,y+1)])out.push('S');
    if(ROADSET[at(x-1,y)])out.push('W'); if(ROADSET[at(x+1,y)])out.push('E'); return out; }
  function buildLandlockConnect(m){
    var N=m.n, extra={}, touchesCache={}, key=function(x,y){return x+','+y;};
    function isBuilt(d){ return !!DISTGEN[d]; }  // only real auto-factory districts relay
    function touches(x,y){ var k=key(x,y); if(k in touchesCache)return touchesCache[k];
      return touchesCache[k]=rawStreetEdges(m,x,y).length>0; }
    function addEdge(k,e){ (extra[k]=extra[k]||{})[e]=1; }
    var DIRS=[['N',0,-1],['S',0,1],['E',1,0],['W',-1,0]], OPP={N:'S',S:'N',E:'W',W:'E'};
    for(var y=0;y<N;y++)for(var x=0;x<N;x++){
      var cell=m.at(x,y); if(!cell||!isBuilt(cell.district)||touches(x,y))continue;
      var fam=familyOf(cell.district);
      var seen={}; seen[key(x,y)]=1;
      var q=[{x:x,y:y,path:[]}], head=0, found=null;
      while(head<q.length && !found){
        var cur=q[head++];
        for(var i=0;i<4;i++){
          var e=DIRS[i][0], nx=cur.x+DIRS[i][1], ny=cur.y+DIRS[i][2], nk=key(nx,ny);
          if(seen[nk])continue; var nc=m.at(nx,ny); if(!nc||familyOf(nc.district)!==fam)continue;
          seen[nk]=1;
          var hop={fromX:cur.x,fromY:cur.y,edge:e,toX:nx,toY:ny};
          var np={x:nx,y:ny,path:cur.path.concat([hop])};
          if(touches(nx,ny)){ found=np; break; }
          q.push(np);
        }
      }
      /* NOBODY IS EVER WALLED IN (Paolo 8/1, and he was standing in one when he
         said it: "make sure I can't be locked in any certain district ever
         again it's so fucking creepy").
         THE SAME-FAMILY RELAY ABOVE IS THE REALISTIC PATH and it stays first:
         a walled subdivision reaching the road through the subdivision next door
         is how Sun Belt tracts actually connect. But it can only help a cell
         that HAS a same-family neighbour. A landlocked school, drive-in or
         estate has none, so it got nothing at all - 27 cells in the canon valley
         came out with no street edge AND no relay, which is a sealed box you can
         stand inside and never leave.
         SO THERE IS A SECOND PASS, and it is deliberately less picky than the
         first: if family loyalty cannot find you a road, take ANY built
         neighbour. Relaying through a district of another kind is less true to
         real Vegas than relaying through your own kind - and it is enormously
         truer than a prison. Realism loses to reachability, once, at the end,
         and only for the cells that would otherwise have nothing. */
      if(!found){
        var seen2={}; seen2[key(x,y)]=1;
        var q2=[{x:x,y:y,path:[]}], h2=0;
        while(h2<q2.length && !found){
          var cur2=q2[h2++];
          for(var j=0;j<4;j++){
            var e2=DIRS[j][0], mx=cur2.x+DIRS[j][1], my=cur2.y+DIRS[j][2], mk=key(mx,my);
            if(seen2[mk])continue; var mc=m.at(mx,my); if(!mc||!isBuilt(mc.district))continue;
            seen2[mk]=1;
            var hop2={fromX:cur2.x,fromY:cur2.y,edge:e2,toX:mx,toY:my};
            var np2={x:mx,y:my,path:cur2.path.concat([hop2])};
            if(touches(mx,my)){ found=np2; break; }
            q2.push(np2);
          }
        }
      }
      /* AND A THIRD PASS, FOR THE SEVEN CELLS EVEN THAT COULD NOT SAVE. Some
         built districts sit in a pocket whose whole connected run of built cells
         never touches a road - three estates in the north-east, a commercial, a
         farm and two suburbs down in the south-west corner. No relay through
         built ground can reach a street because there is no street to reach that
         way; what is between them and the road is BARE DESERT.
         That is precisely what the LANDMARK ACCESS SPUR in the overmap law
         exists for - "carves a desert-only driveway to the nearest street for
         isolated cells the relay can't reach, never touches built content" - so
         this pass crosses anything, and the desert crossing IS the spur. It runs
         last and only for cells that would otherwise be sealed, so it never
         takes a shortcut through somebody's plot that a built relay could have
         served properly. */
      if(!found){
        var seen3={}; seen3[key(x,y)]=1;
        var q3=[{x:x,y:y,path:[]}], h3=0;
        while(h3<q3.length && !found){
          var cur3=q3[h3++];
          if(cur3.path.length>16) continue;              // a spur is a driveway, not a highway
          for(var t=0;t<4;t++){
            var e3=DIRS[t][0], ax=cur3.x+DIRS[t][1], ay=cur3.y+DIRS[t][2], ak=key(ax,ay);
            if(seen3[ak])continue; var ac=m.at(ax,ay); if(!ac)continue;
            seen3[ak]=1;
            var hop3={fromX:cur3.x,fromY:cur3.y,edge:e3,toX:ax,toY:ay};
            var np3={x:ax,y:ay,path:cur3.path.concat([hop3])};
            if(touches(ax,ay)){ found=np3; break; }
            q3.push(np3);
          }
        }
      }
      if(found) found.path.forEach(function(hop){
        addEdge(key(hop.fromX,hop.fromY),hop.edge);
        addEdge(key(hop.toX,hop.toY),OPP[hop.edge]);
      });
    }
    var out={}; for(var k in extra) out[k]=Object.keys(extra[k]); return out;
  }

  // COSMETIC CONNECT (7/22/26, from the 7/21 Vegas-urbanism research thread — real Sun Belt
  // subdivisions don't fully interconnect: Summerlin's model is loop/cul-de-sac streets with
  // only the OCCASIONAL deliberate through-connector between adjacent tracts, for privacy and
  // lot yield, not full-mesh streets). Unlike buildLandlockConnect (mandatory — a landlocked
  // cell MUST reach a street somehow), this is a LOW-probability optional bonus applied ONLY
  // between two suburb-family cells that ALREADY independently touch a real street: some
  // adjacent subdivisions get a real through-connector between them, most don't, matching how
  // an actual neighborhood reads from the air (mostly walled-off tracts, the occasional
  // deliberate cut-through). Deterministic per (seed via coords), so it's reproducible.
  var COSMETIC_CONNECT_CHANCE=0.25;
  function cosmeticChance(x,y,dx,dy){
    var h=((x*2246822519)^(y*3266489917)^((dx+2)*668265263)^((dy+2)*374761393))>>>0;
    h=Math.imul(h^h>>>15,2246822507); h=Math.imul(h^h>>>13,3266489909);
    return ((h^h>>>16)>>>0)/4294967296;
  }
  function buildCosmeticConnect(m){
    var N=m.n, extra={}, key=function(x,y){return x+','+y;}, touchesCache={};
    function isBuilt(d){ return !!DISTGEN[d]; }
    function touches(x,y){ var k=key(x,y); if(k in touchesCache)return touchesCache[k];
      return touchesCache[k]=rawStreetEdges(m,x,y).length>0; }
    function addEdge(k,e){ (extra[k]=extra[k]||{})[e]=1; }
    var PAIRS=[['S',0,1],['E',1,0]], OPP={N:'S',S:'N',E:'W',W:'E'};  // each unordered pair visited once
    for(var y=0;y<N;y++)for(var x=0;x<N;x++){
      var cell=m.at(x,y); if(!cell||!isBuilt(cell.district)||!SUBURB_FAMILY[cell.district])continue;
      if(!touches(x,y))continue;                          // only street-fronting cells get the cosmetic knob
      for(var i=0;i<PAIRS.length;i++){
        var e=PAIRS[i][0], nx=x+PAIRS[i][1], ny=y+PAIRS[i][2];
        var nc=m.at(nx,ny); if(!nc||!SUBURB_FAMILY[nc.district]||!touches(nx,ny))continue;
        if(cosmeticChance(x,y,PAIRS[i][1],PAIRS[i][2])<COSMETIC_CONNECT_CHANCE){
          addEdge(key(x,y),e); addEdge(key(nx,ny),OPP[e]);
        }
      }
    }
    var out={}; for(var k in extra) out[k]=Object.keys(extra[k]); return out;
  }

  // ENTRANCE SIDE (7/26): which wall the interior's street door gets cut into.
  // It used to be hardcoded 'S' for every building in the valley, so a store
  // whose only real access is the north aisle still got its door on a blind
  // south wall backed against a fence — the interior contradicted the exterior
  // it is supposed to match. Now the side is READ OFF THE PLOT: score each of
  // the four sides by the exterior tiles actually lying against it, a declared
  // PORTAL tile (the dossier's own door) outranking plain walkable ground, and
  // ties broken S>E>W>N — the same primary-street ordering the STREET-AWARE /
  // DRIVABLE ACCESS LAW uses everywhere else. Pure geometry over the generated
  // plot: no canon invented, nothing placed.
  var SIDE_ORDER=['S','E','W','N'];
  function entranceSide(f,probe){
    // probe(x,y) -> {solid:bool, portal:bool} for an EXTERIOR tile, or null off-plot
    var strips={
      S:function(cb){for(var x=f.x;x<f.x+f.w;x++)cb(x,f.y+f.h);},
      N:function(cb){for(var x=f.x;x<f.x+f.w;x++)cb(x,f.y-1);},
      W:function(cb){for(var y=f.y;y<f.y+f.h;y++)cb(f.x-1,y);},
      E:function(cb){for(var y=f.y;y<f.y+f.h;y++)cb(f.x+f.w,y);}
    };
    var best=null,bestScore=-1;
    for(var i=0;i<SIDE_ORDER.length;i++){
      var side=SIDE_ORDER[i],score=0;
      strips[side](function(x,y){ var p=probe(x,y); if(!p)return;
        if(p.portal)score+=8;            // the dossier's own declared door wins outright
        else if(!p.solid)score+=1; });   // plain reachable ground beside the wall
      if(score>bestScore){bestScore=score;best=side;}
    }
    return bestScore>0?best:'S';         // walled in on all four sides: fall back to canon south
  }

  // build archetype -> interior zone (the floorplan's room grammar)
  var ZONE = {civic:'civic', bigbox:'retail', institutional:'institutional',
    industrial:'warehouse', utility:'office', landmark:'landmark',
    green:'default', water:'default', rail:'default', extraction:'default'};
  // cell-types that are a building footprint we can put an interior inside
  var FOOTPRINT = {building_pad:1, storefront_pad:1, shed_pad:1};

  // connected-component bounding boxes of footprint cells on a block grid
  function footprints(block){
    var grid=block.grid, H=block.H, W=block.W, seen={}, out=[];
    var is=function(x,y){return x>=0&&y>=0&&x<W&&y<H&&grid[y][x]&&FOOTPRINT[grid[y][x].g];};
    for(var y=0;y<H;y++)for(var x=0;x<W;x++){
      if(!is(x,y)||seen[x+','+y])continue;
      var st=[[x,y]]; seen[x+','+y]=1;
      var x0=x,y0=y,x1=x,y1=y;
      while(st.length){var p=st.pop(),px=p[0],py=p[1];
        if(px<x0)x0=px; if(py<y0)y0=py; if(px>x1)x1=px; if(py>y1)y1=py;
        var d=[[1,0],[-1,0],[0,1],[0,-1]];
        for(var k=0;k<4;k++){var nx=px+d[k][0],ny=py+d[k][1];
          if(is(nx,ny)&&!seen[nx+','+ny]){seen[nx+','+ny]=1;st.push([nx,ny]);}}
      }
      out.push({x:x0,y:y0,w:x1-x0+1,h:y1-y0+1});
    }
    return out;
  }

  // LOCATION QUERY (7/24/26): the missing link between "the world is real" and
  // anything actually FINDING something in it. Quests reference districts only
  // as narrative flavor today ("tie faction leaders to their district") with
  // zero binding to a real coordinate; the master loop's territory AI has real
  // adjacency now but no way to ask "which district is a courthouse"; nothing
  // anywhere can answer "nearest police station from here." Cheap (w.at() only,
  // never w.plot() — no content generates just to answer a location query) and
  // predicate-based so it's content-agnostic: it names WHERE things are, never
  // WHICH quest/faction/agent cares, same separation MECHANISM-MINE draws
  // everywhere else in this engine.
  function findDistricts(m,predicate){
    var N=m.n, out=[];
    for(var y=0;y<N;y++)for(var x=0;x<N;x++){
      var c=m.at(x,y);
      if(c && DISTGEN[c.district] && predicate(c,x,y)) out.push({x:x,y:y,district:c.district});
    }
    return out;
  }
  function nearestDistrict(m,x0,y0,predicate){
    var N=m.n, best=null, bestD=Infinity;
    for(var y=0;y<N;y++)for(var x=0;x<N;x++){
      var c=m.at(x,y);
      if(!c || !DISTGEN[c.district] || !predicate(c,x,y)) continue;
      var dx=x-x0, dy=y-y0, d=dx*dx+dy*dy;
      if(d<bestD){ bestD=d; best={x:x,y:y,district:c.district,dist:Math.sqrt(d)}; }
    }
    return best;
  }

  function world(seed){
    seed=(seed>>>0)||1;
    var m = OM.buildOvermap(seed);
    var landlockConnect = (function(){
      var mand=buildLandlockConnect(m), cosmetic=buildCosmeticConnect(m), out={};
      for(var k in mand) out[k]=mand[k].slice();
      for(var k2 in cosmetic){ var set={}; (out[k2]||[]).forEach(function(e){set[e]=1;});
        cosmetic[k2].forEach(function(e){set[e]=1;}); out[k2]=Object.keys(set); }
      return out;
    })();
    /* THE PLOT CACHE IS BOUNDED (7/26/26, WORLD lane). It was a plain object that
       only ever grew: every cell you touched stayed generated forever. Measured, one
       plot costs ~190 KB, so walking the valley climbed toward ~1.8 GB and the phone
       died long before the far side. The mobile render contract has a memory clause
       and this was the thing that would break it.

       So: a bounded LRU. The cells around you stay hot, the ones behind you are let
       go, and a released cell costs nothing to get back because the world is
       DETERMINISTIC — regenerating it yields the identical grid, which the gate
       proves by evicting and comparing. Cap is in CELLS (a plot is ~190 KB, so 64
       cells is ~12 MB, comfortably inside a phone's budget with the render on top). */
    var PLOT_CAP = 64;
    var plotCache = {}, plotOrder = [], plotHits = 0, plotMisses = 0, plotEvictions = 0;
    function cacheTouch(key){
      var i = plotOrder.indexOf(key);
      if (i >= 0) plotOrder.splice(i, 1);
      plotOrder.push(key);
    }
    function cachePut(key, val){
      plotCache[key] = val; cacheTouch(key);
      while (plotOrder.length > PLOT_CAP) {
        var old = plotOrder.shift();
        if (old !== key) { delete plotCache[old]; plotEvictions++; }
      }
      return val;
    }
    function plot(x,y){
      var key=x+','+y;
      if(plotCache[key]){ plotHits++; cacheTouch(key); return plotCache[key]; }
      plotMisses++;
      var cell=m.at(x,y);
      if(!cell) return null;
      // FACTORY-GENERATED DISTRICT: a real generated block (suburb / commercial /
      // industrial / ...), gated to the streets it touches, every building enterable.
      var dg=DISTGEN[cell.district];
      if(dg && dg.mod){
        // LANDLOCKED DISTRICT LAW: real street edges + whatever landlockConnect computed toward
        // a same-family neighbor that relays back out to a real mile arterial. For any cell that
        // already touches a real street this is identical to neighborStreets() (no default ever
        // fires when real edges exist), so ordinary street-fronting districts are unaffected.
        var realEdges=rawStreetEdges(m,x,y), relayEdges=landlockConnect[x+','+y]||[];
        var eset={}; realEdges.forEach(function(e){eset[e]=1;}); relayEdges.forEach(function(e){eset[e]=1;});
        var uniq=Object.keys(eset);
        var streets = uniq.length ? uniq : ['S'];
        /* THE GENERATOR IS TOLD WHICH DISTRICT IT IS BUILDING, and it never was.
           Three types share the suburb generator (suburb / gated / estate) and it
           was handed only a seed and the street edges, so all three built the
           identical gated community - which broke Paolo's own bank law ("most
           Vegas communities are walled but NOT gated; gates = boujee/richer")
           on every residential cell in the valley from 7/14 to 8/1.
           ONE ARGUMENT, exactly the shape `streets` already had. Every other
           generator ignores it; the ones that care read it. */
        var gres=dg.mod.generate(cell.seed>>>0,
          {cw:1,ch:1,streets:streets,district:cell.district});
        var feet=dg.foot(gres)||[];
        // LAYERING (Paolo 7/19): expose the recorded per-tile layer/occupancy/interior so the
        // renderer + collision + interior/zoom systems can READ what blocks, what you pass
        // under, and what you go INTO — not just the raw code.
        var legend=dg.mod.legend||{};
        // ONE WORLD INTERIORS step 1 (spec S2): "am I inside?" is a property of the
        // CELL. A cell is INDOORS when its legend entry says you can go INTO it
        // (layer 'portal') or it is the solid mass of a building that has an
        // interior (an `enter` note in the dossier). The district's own legend is
        // the only thing that knows, so the predicate is built from it and never
        // from hardcoded tile codes.
        // WHAT COUNTS AS INDOORS is not mine to guess (MECHANISM-MINE / CONTENTS-
        // PAOLO'S). Two authorities, unioned, and neither is a hardcoded tile code:
        //   1. the district's OWN building list (dg.foot) — if the generator calls
        //      it a building, it is an enclosed shell, full stop.
        //   2. the dossier legend — a mass or portal the dossier says you go INTO.
        // (1) is what made this correct: commercial code 14 is a 5x1 'doorway'
        // returned as a building whose dossier carries no `enter` note, so a
        // legend-only predicate left a whole storefront roomless. The generator
        // knew; the legend had a gap. The gate caught it, not a guess.
        var _rooms=(function(){ if(!RMS) return null;
          var mass={};
          for(var fi=0;fi<feet.length;fi++){ var f=feet[fi];
            for(var my=f.y;my<f.y+f.h;my++) for(var mx=f.x;mx<f.x+f.w;mx++) mass[mx+','+my]=1; }
          return RMS.group(gres.g,{indoor:function(code,cx,cy){
            if(mass[cx+','+cy]) return true;
            var L=legend[code]; if(!L) return false;
            var ly=KIT.tileLayer(L); return !!ly.enter && (ly.layer==='structure'||ly.layer==='portal'); }}); })();
        function tinfo(xx,yy){ var row=gres.g[yy]; var c=(row&&xx>=0&&xx<gres.W)?row[xx]:-1;
          var L=legend[c], ly=KIT.tileLayer(L||{kind:'ground'});
          var rid=_rooms?RMS.roomAt(_rooms,xx,yy):0;
          return { code:c, name:L?L.name:(c===0?'dead-ground':(c<0?'(off-plot)':'?')),
                   layer:ly.layer, solid:ly.solid, enter:ly.enter,
                   // 0 = outdoors. Same id = one enclosed space. roof is the group
                   // whose covering stops drawing when you are standing in it (step 4).
                   room:rid, roof:rid, inside:rid!==0 }; }
        var dapi={ x:x,y:y,district:cell.district,category:KIT.category(cell.district),archetype:dg.zone,
          block:{W:gres.W,H:gres.H,grid:gres.g,codes:true}, legend:legend,
          tileInfo:tinfo,
          solidAt:function(xx,yy){ return tinfo(xx,yy).solid; },   // OCCUPANCY: does this cell block a body
          // ROOMS (one-world interiors step 1). The whole flood-fill result, so the
          // roof-reveal pass in step 4 reads group bboxes instead of re-deriving them
          // every frame. roomAt(x,y) is the single question anything should ask.
          rooms:_rooms,
          roomAt:function(xx,yy){ return _rooms?RMS.roomAt(_rooms,xx,yy):0; },
          insideAt:function(xx,yy){ return _rooms?RMS.inside(_rooms,xx,yy):false; },
          // PORTALS: every way INTO an interior on this plot (doors, garage ramps, tunnel mouths, gates)
          portals:function(){ return KIT.footprints(gres.g,function(v){ var L=legend[v]; return !!(L&&KIT.tileLayer(L).layer==='portal'); })
            .map(function(f){ var c=gres.g[f.y][f.x], L=legend[c]; return {x:f.x,y:f.y,w:f.w,h:f.h,code:c,name:L?L.name:'',enter:(L&&L.enter)||null}; }); },
          buildings: feet.map(function(f,i){ var fc=(f.code!=null)?f.code:(gres.g[f.y]&&gres.g[f.y][f.x]), fL=legend[fc];
            var enter=(fL&&fL.enter)||null, iseed=(cell.seed ^ (0x9E3779B1*(i+1)))>>>0;
            var kind=(enter&&/GARAGE INTERIOR/i.test(enter))?'garage':((enter&&/CRYPT INTERIOR/i.test(enter))?'crypt':'floorplan');
            // the door goes where the plot actually lets you walk up to the wall
            var ent=entranceSide(f,function(xx,yy){ var row=gres.g[yy]; if(!row||xx<0||xx>=gres.W)return null;
              var t=tinfo(xx,yy); return {solid:t.solid,portal:t.layer==='portal'}; });
            return {index:i,x:f.x,y:f.y,w:f.w,h:f.h,zone:dg.zone,story:f.story||1,
            enter:enter, kind:kind, entrance:ent,                  // what this building becomes inside (from the dossier)
            floorplan:function(){ return FP.generate(iseed, f.w, f.h, {zone:dg.zone,entrance:ent}); },
            // INTERIOR (the zoom target): a garage yields multi-deck parking; everything else rooms.
            // INTERIOR always matches the EXTERIOR footprint w x h exactly. decks (vertical
            // levels) is a separate 3D property derived from the seed, not the floor-plate size.
            interior:function(){ if(kind==='garage') return GAR.generate(iseed, {w:f.w,h:f.h,decks:3+(iseed%3)});
              if(kind==='crypt') return CRY.generate(iseed, {w:f.w,h:f.h});
              return {kind:'floorplan', floorplan:FP.generate(iseed, f.w, f.h, {zone:dg.zone,entrance:ent})}; } }; }),
          building:function(i){ return this.buildings[i]; } };
        return cachePut(key, dapi);
      }
      // SURFACE CELL (road): a real generated corridor, built from the network links
      // (which neighbours are also road), never street-fronted. Same read API as a
      // district plot minus buildings, so renderers/collision treat it uniformly.
      var sg=SURFACEGEN[cell.district];
      if(sg && sg.mod){
        var rl=roadLinks(m,x,y,cell.district);
        var links=rl.all;
        /* A CORRIDOR THAT IS NOT A ROAD gets its continuation from continuityLinks, not
           from ROADSET: the railway's own neighbours are rail cells, and its `cross` is
           the street grid that meets it at grade. Getting this from roadLinks would have
           told the railway that a freeway was its own continuation. */
        var own=ROADSET[cell.district] ? rl.same : continuityLinks(m,x,y,cell.district);
        var bnds=clusterBoundsOf(m,x,y,cell.district);
        var sres=sg.mod.generate(cell.seed>>>0,
          { links:links.length?links:['N','S'], same:own.length?own:rl.same, cross:rl.cross,
            cellX:x, cellY:y, open:openEdges(m,x,y,cell.district),
            kind:cell.district, bounds:bnds, approach:clusterApproach(m,bnds,cell.district),
            // which sides a RAILWAY runs up to: what a freeway has to bridge over
            rail:['N','S','E','W'].filter(function(d,i){
              var D=[[0,-1],[0,1],[1,0],[-1,0]][i], c2=m.at(x+D[0],y+D[1]);
              return !!(c2 && c2.district==='rail'); }),
            // the edges that face something that is NOT road: that is where the
            // districts are, and therefore where the street has to let them in
            access:['N','S','E','W'].filter(function(d){ return rl.all.indexOf(d)<0; }) });
        var slegend=sg.mod.legend||{};
        var stinfo=function(xx,yy){ var row=sres.g[yy]; var c=(row&&xx>=0&&xx<sres.W)?row[xx]:-1;
          var L=slegend[c], ly=KIT.tileLayer(L||{kind:'ground'});
          return { code:c, name:L?L.name:(c===0?'dirt shoulder':(c<0?'(off-plot)':'?')),
                   layer:ly.layer, solid:ly.solid, enter:ly.enter }; };
        var sapi={ x:x, y:y, district:cell.district, category:KIT.category(cell.district),
          archetype:sg.zone, surface:true, links:links, sameLinks:own, crossLinks:rl.cross,
          block:{W:sres.W,H:sres.H,grid:sres.g,codes:true}, legend:slegend,
          tileInfo:stinfo,
          solidAt:function(xx,yy){ return stinfo(xx,yy).solid; },
          portals:function(){ return []; },        // a street cell has no interior
          buildings:[], building:function(){ return null; } };
        return cachePut(key, sapi);
      }
      var recipe=BR.recipeFor(cell);
      var arch=recipe && recipe.opts && recipe.opts.archetype ? recipe.opts.archetype : null;
      // W=48 gives footprints big enough to carry real interiors
      var block=BR.blockFor(cell, BG, 48);
      var feet = block.grid ? footprints(block) : [];
      var zone = ZONE[arch] || 'default';
      // LANDMARK / BESPOKE CELLS: the districts with no DISTGEN factory entry —
      // the hand-reserved ones (casino, resort, strip: Paolo 7/18, they get
      // individual love, never the auto-factory) plus the recipe-built landmarks
      // (airport, campus, prison, town, convention...). 219 of their buildings in
      // the seed-12345 valley exposed floorplan() but NO interior(), so the one
      // uniform question every consumer asks — "what is inside this?" — threw on
      // them and the enterable rung stopped at the factory districts. They now
      // answer it through the SAME dispatch, returning the SAME floorplan they
      // already generated: mechanism only, zero content invented for the cells
      // Paolo reserved for his own hand.
      var api = {
        x:x, y:y, district:cell.district, archetype:arch, block:block,
        buildings: feet.map(function(f,i){
          var iseed=(cell.seed ^ (0x9E3779B1*(i+1)))>>>0;
          var ent=entranceSide(f,function(xx,yy){ var row=block.grid&&block.grid[yy];
            if(!row||xx<0||xx>=block.W)return null; var g=row[xx];
            return {solid:!!(g&&FOOTPRINT[g.g]),portal:false}; });
          return {
            index:i, x:f.x, y:f.y, w:f.w, h:f.h, zone:zone,
            enter:null, kind:'floorplan', entrance:ent,
            floorplan: function(){ return FP.generate(iseed, f.w, f.h, {zone:zone, entrance:ent}); },
            interior: function(){ return {kind:'floorplan', floorplan:FP.generate(iseed, f.w, f.h, {zone:zone, entrance:ent})}; }
          };
        }),
        building: function(i){ return this.buildings[i]; }
      };
      return cachePut(key, api);
    }
    /* ------------------------------------------------------------------------
       THE VALLEY TILE (7/26/26, WORLD lane — engine support the RUN lane asked
       for: "the run's block becomes a real cell of the generated valley so
       walking off it lands in a real neighbouring district").

       This is the rung this file's own header promised and never had. You could
       address a CELL and you could address a PLOT, but there was no way to say
       "the tile at valley position X,Y" — so nothing could walk from one cell to
       the next. Every surface that wanted to move a body did it inside one plot
       and stopped at the edge.

       Coordinates are GLOBAL TILE coordinates over the whole valley: 0..n*128.
       LAZY: touching a tile generates that one cell's plot and nothing else, so
       crossing a boundary costs one cell, never the valley.
       ---------------------------------------------------------------------- */
    /* ONE SOURCE OF TRUTH FOR THE SCALE (7/30/26). This was `var T = 128`, a
       second hardcoded copy of a number that also lives in bohemia_overmap.js.
       The two disagreed for three and a half weeks (128 here, 32 there) and
       nothing in the repo compared them, so the run walked 96m neighbourhoods
       while the city drew 24m lots off the same seed. Read it from the overmap
       or there is no fact of the matter about how big a district is.
       Gate: gates/valley_scale_gate.js. */
    var T = OM.TILE_FINE;
    function tile(gx,gy){
      gx=Math.floor(gx); gy=Math.floor(gy);
      if(gx<0||gy<0||gx>=m.n*T||gy>=m.n*T) return null;          // off the valley
      var cxi=Math.floor(gx/T), cyi=Math.floor(gy/T), tx=gx-cxi*T, ty=gy-cyi*T;
      var cell=m.at(cxi,cyi); if(!cell) return null;
      var p=null; try{ p=plot(cxi,cyi); }catch(e){ p=null; }
      var info=(p&&p.tileInfo)?p.tileInfo(tx,ty):null;
      return { gx:gx, gy:gy, cellX:cxi, cellY:cyi, tx:tx, ty:ty,
               district:cell.district, surface:!!(p&&p.surface),
               code:info?info.code:null,
               // a bespoke landmark cell has no generator yet: say so honestly
               // rather than inventing a material for it
               name:info?info.name:'(reserved landmark ground)',
               layer:info?info.layer:'ground',
               solid:info?!!info.solid:false,
               enter:info?info.enter:null };
    }
    function solidAt(gx,gy){ var t=tile(gx,gy); return t?t.solid:true; }   // off-map blocks

    /* ONE STEP, and the whole point of it: it reports when the step CROSSED into a
       different cell, and into what. That is the plot-to-plot transition. */
    function step(gx,gy,dx,dy){
      var nx=Math.floor(gx)+(dx|0), ny=Math.floor(gy)+(dy|0);
      var from=tile(gx,gy), to=tile(nx,ny);
      if(!to) return { ok:false, reason:'offmap', gx:gx, gy:gy, crossed:null };
      if(to.solid) return { ok:false, reason:'blocked', gx:gx, gy:gy, to:to, crossed:null };
      var crossed=(from && (from.cellX!==to.cellX||from.cellY!==to.cellY))
        ? { fromCell:[from.cellX,from.cellY], toCell:[to.cellX,to.cellY],
            fromDistrict:from.district, toDistrict:to.district } : null;
      return { ok:true, gx:nx, gy:ny, to:to, crossed:crossed };
    }

    /* Walk a straight line as far as it goes, reporting every crossing on the way.
       Bounded; content-agnostic; authors nothing. */
    function walk(gx,gy,dx,dy,maxSteps){
      var out={ steps:0, crossings:[], gx:Math.floor(gx), gy:Math.floor(gy), stopped:null };
      var lim=maxSteps||512;
      for(var i=0;i<lim;i++){
        var r=step(out.gx,out.gy,dx,dy);
        if(!r.ok){ out.stopped=r.reason; break; }
        out.gx=r.gx; out.gy=r.gy; out.steps++;
        if(r.crossed) out.crossings.push({ at:[r.gx,r.gy], crossed:r.crossed });
      }
      return out;
    }

    /* ROUTE. A straight line is not a crossing test: a suburb has houses in it, and
       the first wall stops you. This is the real question the RUN lane is asking —
       can a BODY get from here to there on foot, across cell boundaries, using only
       ground the world model actually generated. Bounded breadth-first over non-solid
       tiles; it authors nothing and decides nothing, it reports whether the ground
       connects. Lazy per cell like everything else, and hard-capped so a bad ask can
       never walk the whole valley. */
    function route(gx0,gy0,gx1,gy1,opts){
      opts=opts||{};
      var cap=opts.maxNodes||60000;
      var s0=tile(gx0,gy0), s1=tile(gx1,gy1);
      if(!s0||!s1||s0.solid||s1.solid) return null;
      var key=function(x,y){ return x+','+y; };
      var start=key(gx0,gy0), goal=key(gx1,gy1);
      var prev={}, seen={}; seen[start]=1;
      var q=[[gx0,gy0]], head=0, D=[[1,0],[-1,0],[0,1],[0,-1]];
      while(head<q.length && head<cap){
        var cur=q[head++], cxp=cur[0], cyp=cur[1];
        if(cxp===gx1&&cyp===gy1) break;
        for(var i=0;i<4;i++){
          var nx=cxp+D[i][0], ny=cyp+D[i][1], nk=key(nx,ny);
          if(seen[nk]) continue;
          var t=tile(nx,ny); if(!t||t.solid) continue;
          seen[nk]=1; prev[nk]=key(cxp,cyp); q.push([nx,ny]);
        }
      }
      if(!seen[goal]) return null;
      var path=[], k=goal;
      while(k && k!==start){ var p2=k.split(','); path.push([+p2[0],+p2[1]]); k=prev[k]; }
      path.push([gx0,gy0]); path.reverse();
      var cells={}, order=[];
      path.forEach(function(pt){
        var ck=Math.floor(pt[0]/T)+','+Math.floor(pt[1]/T);
        if(!cells[ck]){ cells[ck]=1; order.push(ck); }
      });
      return { path:path, length:path.length, cells:order, explored:head };
    }

    /* ------------------------------------------------------------------------
       STREAMING. A body walking the valley must never wait for the ground it is
       about to stand on. stream() warms the ring of cells around a position and
       releases everything outside it, so the cell you are walking INTO was built
       while you were still in the last one, and the cells behind you stop costing
       memory. Cheap to call every step: it returns immediately when the hot set
       has not changed.

       The whole thing only works because the world is deterministic — a released
       cell regenerates identical, which the gate proves by evicting and comparing
       byte for byte. Nothing is ever "saved" here; the seed is the save.
       ---------------------------------------------------------------------- */
    var streamAt = null;
    function stream(gx, gy, o){
      o = o || {};
      var radius = o.radius == null ? 1 : o.radius;
      var cxi = Math.floor(gx / T), cyi = Math.floor(gy / T);
      var key = cxi + ',' + cyi + ':' + radius;
      if (streamAt === key && !o.force) return { warmed:0, held:plotOrder.length, moved:false };
      streamAt = key;
      var warmed = 0;
      // nearest first, so if anything ever budgets this it warms what matters most
      var ring = [];
      for (var dy = -radius; dy <= radius; dy++) for (var dx = -radius; dx <= radius; dx++) {
        ring.push([dx, dy, Math.abs(dx) + Math.abs(dy)]);
      }
      ring.sort(function (a, b) { return a[2] - b[2]; });
      ring.forEach(function (d) {
        var x = cxi + d[0], y = cyi + d[1];
        if (x < 0 || y < 0 || x >= m.n || y >= m.n) return;
        if (plotCache[x + ',' + y]) { cacheTouch(x + ',' + y); return; }
        try { plot(x, y); warmed++; } catch (e) { /* a cell that refuses to build is not a crash */ }
      });
      return { warmed: warmed, held: plotOrder.length, moved: true, at: [cxi, cyi] };
    }
    function cacheStats(){
      return { held: plotOrder.length, cap: PLOT_CAP, hits: plotHits,
               misses: plotMisses, evictions: plotEvictions };
    }
    function setCacheCap(n){ PLOT_CAP = Math.max(9, n | 0); return PLOT_CAP; }

    return {
      seed:seed, n:m.n, overmap:m,
      tiles:m.n*T, TILE_PER_CELL:T,
      route:route, stream:stream, cacheStats:cacheStats, setCacheCap:setCacheCap,
      at:function(x,y){return m.at(x,y);},
      plot:plot,
      tile:tile, solidAt:solidAt, step:step, walk:walk,
      DISTRICT: OM.DISTRICT,
      landlockConnect: landlockConnect,          // LANDLOCKED DISTRICT LAW audit surface
      rawStreetEdges: function(x,y){ return rawStreetEdges(m,x,y); },
      SUBURB_FAMILY: SUBURB_FAMILY,
      // LOCATION QUERY: every real auto-factory district, findable by type/category/
      // custom predicate, cheap (never generates plot content to answer). The three
      // named helpers cover the common asks; findDistricts is the escape hatch.
      // SURFACE CELLS: real ground that is not a district (roads). Reported separately
      // so nothing that counts districts ever accidentally counts a street.
      isSurface: function(x,y){ var c=m.at(x,y); return !!(c && SURFACEGEN[c.district]); },
      /* SURFACE LOCATION QUERY. districtsOfType only ever sees DISTGEN districts, so
         once terrain became real ground the map had no way to answer "where are the
         mountains" or "where is the lake" — the biggest things in the valley were the
         only things you could not look up. Cheap (w.at only, never w.plot). */
      surfaceCellsOfType: function(type){
        var out=[]; for(var yy=0;yy<m.n;yy++)for(var xx=0;xx<m.n;xx++){
          var c=m.at(xx,yy); if(c && c.district===type && SURFACEGEN[type]) out.push({x:xx,y:yy,district:type}); }
        return out; },
      nearestSurfaceOfType: function(x0,y0,type){
        if(!SURFACEGEN[type]) return null;
        var best=null,bd=Infinity;
        for(var yy=0;yy<m.n;yy++)for(var xx=0;xx<m.n;xx++){
          var c=m.at(xx,yy); if(!c||c.district!==type)continue;
          var dx=xx-x0,dy=yy-y0,d=dx*dx+dy*dy;
          if(d<bd){bd=d;best={x:xx,y:yy,district:type,dist:Math.sqrt(d)};} }
        return best; },
      roadLinks: function(x,y){ var c=m.at(x,y); return roadLinks(m,x,y,c?c.district:null); },
      districtsOfType: function(type){ return findDistricts(m, function(c){ return c.district===type; }); },
      districtsInCategory: function(category){ return findDistricts(m, function(c){ return KIT.category(c.district)===category; }); },
      nearestDistrictOfType: function(x,y,type){ return nearestDistrict(m, x, y, function(c){ return c.district===type; }); },
      nearestDistrictInCategory: function(x,y,category){ return nearestDistrict(m, x, y, function(c){ return KIT.category(c.district)===category; }); },
      findDistricts: function(predicate){ return findDistricts(m, predicate); }
    };
  }

  // isAutoDistrict/districtZone: read-only membership + zone lookup against the
  // real DISTGEN table, for callers (the master-loop scaffold) that need to
  // catalog real district cells cheaply — from cell.district alone, no plot()
  // generation — without duplicating DISTGEN's key list a second time anywhere.
  function isAutoDistrict(type){ return !!DISTGEN[type]; }
  function districtZone(type){ return DISTGEN[type] ? DISTGEN[type].zone : null; }
  // every married district type, in one place, so a gate can sweep them ALL
  // instead of sampling whatever a coordinate scan happens to land on.
  function districtTypes(){ return Object.keys(DISTGEN); }

  function isSurfaceCell(type){ return !!SURFACEGEN[type]; }
  var API = {world:world, isAutoDistrict:isAutoDistrict, districtZone:districtZone,
             districtTypes:districtTypes, isSurfaceCell:isSurfaceCell};
  if(HASREQ) module.exports = API;
  root.BohemiaWorld = API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
