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
  var GAR= HASREQ ? require('./bohemia_garage.js')         : (typeof BohemiaGarage!=='undefined'?BohemiaGarage:root.BohemiaGarage);
  var CRY= HASREQ ? require('./bohemia_crypt.js')          : (typeof BohemiaCrypt!=='undefined'?BohemiaCrypt:root.BohemiaCrypt);
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
    truckstop:  { mod:TKS, foot:function(r){return r.footprints;},           zone:'retail' }
  };
  function neighborStreets(m,x,y){ var at=function(xx,yy){var c=m.at(xx,yy);return c?c.district:null;};
    return KIT.streetEdges({N:at(x,y-1),S:at(x,y+1),W:at(x-1,y),E:at(x+1,y)}); }

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

  function world(seed){
    seed=(seed>>>0)||1;
    var m = OM.buildOvermap(seed);
    var plotCache = {};
    function plot(x,y){
      var key=x+','+y; if(plotCache[key])return plotCache[key];
      var cell=m.at(x,y);
      if(!cell) return null;
      // FACTORY-GENERATED DISTRICT: a real generated block (suburb / commercial /
      // industrial / ...), gated to the streets it touches, every building enterable.
      var dg=DISTGEN[cell.district];
      if(dg && dg.mod){
        var gres=dg.mod.generate(cell.seed>>>0, {cw:1,ch:1,streets:neighborStreets(m,x,y)});
        var feet=dg.foot(gres)||[];
        // LAYERING (Paolo 7/19): expose the recorded per-tile layer/occupancy/interior so the
        // renderer + collision + interior/zoom systems can READ what blocks, what you pass
        // under, and what you go INTO — not just the raw code.
        var legend=dg.mod.legend||{};
        function tinfo(xx,yy){ var row=gres.g[yy]; var c=(row&&xx>=0&&xx<gres.W)?row[xx]:-1;
          var L=legend[c], ly=KIT.tileLayer(L||{kind:'ground'});
          return { code:c, name:L?L.name:(c===0?'dead-ground':(c<0?'(off-plot)':'?')),
                   layer:ly.layer, solid:ly.solid, enter:ly.enter }; }
        var dapi={ x:x,y:y,district:cell.district,category:KIT.category(cell.district),archetype:dg.zone,
          block:{W:gres.W,H:gres.H,grid:gres.g,codes:true}, legend:legend,
          tileInfo:tinfo,
          solidAt:function(xx,yy){ return tinfo(xx,yy).solid; },   // OCCUPANCY: does this cell block a body
          // PORTALS: every way INTO an interior on this plot (doors, garage ramps, tunnel mouths, gates)
          portals:function(){ return KIT.footprints(gres.g,function(v){ var L=legend[v]; return !!(L&&KIT.tileLayer(L).layer==='portal'); })
            .map(function(f){ var c=gres.g[f.y][f.x], L=legend[c]; return {x:f.x,y:f.y,w:f.w,h:f.h,code:c,name:L?L.name:'',enter:(L&&L.enter)||null}; }); },
          buildings: feet.map(function(f,i){ var fc=(f.code!=null)?f.code:(gres.g[f.y]&&gres.g[f.y][f.x]), fL=legend[fc];
            var enter=(fL&&fL.enter)||null, iseed=(cell.seed ^ (0x9E3779B1*(i+1)))>>>0;
            var kind=(enter&&/GARAGE INTERIOR/i.test(enter))?'garage':((enter&&/CRYPT INTERIOR/i.test(enter))?'crypt':'floorplan');
            return {index:i,x:f.x,y:f.y,w:f.w,h:f.h,zone:dg.zone,story:f.story||1,
            enter:enter, kind:kind,                                // what this building becomes inside (from the dossier)
            floorplan:function(){ return FP.generate(iseed, f.w, f.h, {zone:dg.zone,entrance:'S'}); },
            // INTERIOR (the zoom target): a garage yields multi-deck parking; everything else rooms.
            // INTERIOR always matches the EXTERIOR footprint w x h exactly. decks (vertical
            // levels) is a separate 3D property derived from the seed, not the floor-plate size.
            interior:function(){ if(kind==='garage') return GAR.generate(iseed, {w:f.w,h:f.h,decks:3+(iseed%3)});
              if(kind==='crypt') return CRY.generate(iseed, {w:f.w,h:f.h});
              return {kind:'floorplan', floorplan:FP.generate(iseed, f.w, f.h, {zone:dg.zone,entrance:'S'})}; } }; }),
          building:function(i){ return this.buildings[i]; } };
        plotCache[key]=dapi; return dapi;
      }
      var recipe=BR.recipeFor(cell);
      var arch=recipe && recipe.opts && recipe.opts.archetype ? recipe.opts.archetype : null;
      // W=48 gives footprints big enough to carry real interiors
      var block=BR.blockFor(cell, BG, 48);
      var feet = block.grid ? footprints(block) : [];
      var zone = ZONE[arch] || 'default';
      var api = {
        x:x, y:y, district:cell.district, archetype:arch, block:block,
        buildings: feet.map(function(f,i){
          return {
            index:i, x:f.x, y:f.y, w:f.w, h:f.h, zone:zone,
            floorplan: function(){ return FP.generate((cell.seed ^ (0x9E3779B1*(i+1)))>>>0, f.w, f.h, {zone:zone, entrance:'S'}); }
          };
        }),
        building: function(i){ return this.buildings[i]; }
      };
      plotCache[key]=api; return api;
    }
    return {
      seed:seed, n:m.n, overmap:m,
      at:function(x,y){return m.at(x,y);},
      plot:plot,
      DISTRICT: OM.DISTRICT
    };
  }

  var API = {world:world};
  if(HASREQ) module.exports = API;
  root.BohemiaWorld = API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
