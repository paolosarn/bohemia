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
  var SUB= HASREQ ? require('./bohemia_suburb.js')         : (typeof BohemiaSuburb!=='undefined'?BohemiaSuburb:root.BohemiaSuburb);

  // residential districts route through the APPROVED suburb generator (Paolo 7/18)
  var RESIDENTIAL = {suburb:1, gated:1, estate:1};
  var ROADSET = {freeway:1, arterial:1, strip:1, beltway:1};
  var SUBMAP = {0:'yard_dirt',1:'suburb_road',2:'house',3:'driveway',4:'perimeter_wall',5:'suburb_gate',6:'garage',9:'house_upper'};
  // which of the cell's four edges face a street (a road-district neighbor); >=1 gate always
  function streetEdges(m,x,y){var out=[], nb=[['N',0,-1],['S',0,1],['W',-1,0],['E',1,0]], i;
    for(i=0;i<nb.length;i++){var nc=m.at(x+nb[i][1],y+nb[i][2]); if(nc&&ROADSET[nc.district])out.push(nb[i][0]);}
    return out.length?out:['S']; }
  // wrap the suburb code grid as a block of {g,props} cells the world model speaks
  function suburbBlock(res){var G=res.g,W=res.W,H=res.H,grid=[],y,x;
    for(y=0;y<H;y++){var row=[];for(x=0;x<W;x++){var code=G[y][x],g=SUBMAP[code]||'yard_dirt',props=[];
      if(code===4)props.push({p:'perimeter_wall',impassable:true,hTiles:2});
      row.push({g:g,props:props});}grid.push(row);}
    return {W:W,H:H,grid:grid}; }

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
      // RESIDENTIAL: a real suburb neighborhood — houses, gates on the streets this
      // cell touches, every home enterable. The approved generator, folded in.
      if(SUB && RESIDENTIAL[cell.district]){
        var sres=SUB.generate(cell.seed>>>0, {cw:1,ch:1,streets:streetEdges(m,x,y)});
        var homes=SUB.homeFootprints(sres);
        var rapi={ x:x,y:y,district:cell.district,archetype:'residential',block:suburbBlock(sres),
          buildings: homes.map(function(f,i){ return {index:i,x:f.x,y:f.y,w:f.w,h:f.h,zone:'residential',story:f.story,
            floorplan:function(){ return FP.generate((cell.seed ^ (0x9E3779B1*(i+1)))>>>0, f.w, f.h, {zone:'residential',entrance:'S'}); } }; }),
          building:function(i){ return this.buildings[i]; } };
        plotCache[key]=rapi; return rapi;
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
