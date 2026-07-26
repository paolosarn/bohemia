// BOHEMIA CITY EDIT — the city-builder verbs (7/19/26, LIFE+CITY session)
//
// Paolo's plan (7/18, canon): "put streets into the CITY tab now, empty lots
// = DESERT until built; in citybuilder you can delete/blow up a plot down to
// the desert underneath; a big building can span 4 lots."
//
// This is the VERB layer: DEMOLISH (a buildable plot -> the desert under it)
// and BUILD (empty desert -> a district). Mechanism only:
//   - THE SKELETON IS SACRED: streets, freeway, rail, water, mountains can
//     never be demolished or built over. The mile grid Paolo made whole
//     stays whole. (MAP LAW: layouts are his; the machine only protects.)
//   - what can be PLACED is exactly the canon district enum's buildable
//     types - no invented content. Costs, rules, unlocks: [PENDING Paolo].
//   - edits are a DELTA over the generated overmap (the generator is never
//     touched), serializable so a save system can carry them. Until the
//     save exists they live device-local (like the clothing thumbs).
//   - 4-lot buildings ride the same delta later (one building, 4 cells).
//
// This module also owns the ONE canonical category function the CITY tab
// renders from (skeleton-as-itself vs buildable-as-desert, the blessed
// 7/18 aerial proof's rules) so the render and the verbs can never disagree.
(function(root){
  var HASREQ=(typeof module!=='undefined'&&module.exports&&typeof require!=='undefined');

  // the blessed categories (tools/bohemia_city_map.py proof, Paolo-approved)
  var WATER={water:1,reservoir:1,reservoirs:1,basin:1,dam:1,intake:1,watertreat:1,springs:1,lakeLV:1,mead:1,reclaim:1};
  var ROAD={arterial:1}, FREEWAY={freeway:1,interchange:1,exits:1};
  var RAILT={rail:1,railyard:1,monorail:1}, MOUNT={mountain:1,quarry:1,gypsum:1,boulder:1};
  var OPEN={desert:1,wash:1,boneyard:1,landfill:1};
  function cat(d){ if(WATER[d])return 'water'; if(ROAD[d])return 'road';
    if(FREEWAY[d])return 'freeway'; if(RAILT[d])return 'rail';
    if(MOUNT[d])return 'mount'; if(OPEN[d])return 'open'; return 'sand'; }
  function isSkeleton(d){ return cat(d)!=='sand' && cat(d)!=='open'; }

  // every buildable type in the canon enum (nothing invented; sorted stable)
  function buildableTypes(DISTRICT){
    var out=[];
    Object.keys(DISTRICT||{}).forEach(function(k){
      var d=DISTRICT[k];
      if(cat(d)==='sand') out.push(d);
    });
    return out.sort();
  }

  // ---- THE DELTA -----------------------------------------------------------
  // cells: per-lot override (render truth). spans: big buildings, one entry
  // per 4-lot mass, keyed by its top-left anchor "x,y" -> {type,w,h}. Every
  // lot a span covers ALSO carries the type in cells so the aerial render
  // stays a pure per-cell lookup; spans just say "these lots are ONE building"
  // so demolish takes the whole mass and the render can draw it as one.
  function makeEdits(){ return {v:1, cells:{}, spans:{}}; }
  function resolve(edits, x, y, generated){
    var k=x+','+y;
    return (edits&&edits.cells&&(k in edits.cells)) ? edits.cells[k] : generated;
  }
  function count(edits){ return Object.keys(edits&&edits.cells||{}).length; }
  function serialize(edits){ return JSON.stringify(edits); }
  function parse(s){ try{ var e=JSON.parse(s);
      if(e&&e.v===1&&e.cells&&typeof e.cells==='object'){
        if(!e.spans||typeof e.spans!=='object') e.spans={};   // old saves predate 4-lot
        return e; } }catch(err){}
    return makeEdits(); }

  // which big building (if any) covers this lot -> {ax,ay,type,w,h} or null
  function spanAt(edits, x, y){
    var S=edits&&edits.spans; if(!S) return null;
    for(var k in S){ var p=k.split(','), ax=+p[0], ay=+p[1], s=S[k];
      if(x>=ax&&x<ax+s.w&&y>=ay&&y<ay+s.h) return {ax:ax,ay:ay,type:s.type,w:s.w,h:s.h}; }
    return null;
  }
  function spans(edits){ var S=edits&&edits.spans||{}, out=[];
    for(var k in S){ var p=k.split(','), s=S[k];
      out.push({ax:+p[0],ay:+p[1],type:s.type,w:s.w,h:s.h}); }
    return out; }

  // ---- THE VERBS -----------------------------------------------------------
  // demolish: a BUILDABLE plot goes down to the desert underneath. If the lot
  // is part of a big building, the WHOLE mass comes down (one building = one
  // demolish), never a hole punched in the middle of it.
  function demolish(edits, x, y, current){
    if(isSkeleton(current)) return {ok:false, why:'the skeleton is sacred'};
    var sp=spanAt(edits,x,y);
    if(sp){
      for(var dy=0;dy<sp.h;dy++)for(var dx=0;dx<sp.w;dx++) edits.cells[(sp.ax+dx)+','+(sp.ay+dy)]='desert';
      if(edits.spans) delete edits.spans[sp.ax+','+sp.ay];
      return {ok:true, span:[sp.ax,sp.ay,sp.w,sp.h]};
    }
    if(cat(current)==='open' && current==='desert') return {ok:false, why:'already desert'};
    edits.cells[x+','+y]='desert';
    return {ok:true};
  }
  // build: only onto empty desert, only a canon buildable type.
  function build(edits, x, y, current, type, DISTRICT){
    if(current!=='desert') return {ok:false, why:'build only on empty desert'};
    if(cat(type)!=='sand') return {ok:false, why:'not a buildable district'};
    var legal=buildableTypes(DISTRICT);
    if(legal.indexOf(type)<0) return {ok:false, why:'unknown district'};
    edits.cells[x+','+y]=type;
    return {ok:true};
  }
  // buildBig (Paolo 7/18: "a big building can span 4 lots"): one building over
  // a w x h footprint (1x2, 2x1, or 2x2 = the 4-lot max) anchored at (x,y),
  // extending right+down. Every lot must be empty desert, a canon buildable
  // type, and clear of any existing big building. curOf(cx,cy) -> the resolved
  // district at a lot (so callers pass the delta-aware value).
  function buildBig(edits, x, y, w, h, type, DISTRICT, curOf){
    if(!((w===1||w===2)&&(h===1||h===2))) return {ok:false, why:'a big building spans up to 2x2 (4 lots)'};
    if(w*h<2) return {ok:false, why:'a big building must span at least 2 lots'};
    if(cat(type)!=='sand') return {ok:false, why:'not a buildable district'};
    if(buildableTypes(DISTRICT).indexOf(type)<0) return {ok:false, why:'unknown district'};
    for(var dy=0;dy<h;dy++)for(var dx=0;dx<w;dx++){
      var cx=x+dx, cy=y+dy;
      if(curOf(cx,cy)!=='desert') return {ok:false, why:'every lot must be empty desert'};
      if(spanAt(edits,cx,cy)) return {ok:false, why:'lots overlap an existing building'};
    }
    for(var dy2=0;dy2<h;dy2++)for(var dx2=0;dx2<w;dx2++) edits.cells[(x+dx2)+','+(y+dy2)]=type;
    edits.spans=edits.spans||{};
    edits.spans[x+','+y]={type:type,w:w,h:h};
    return {ok:true, anchor:[x,y], w:w, h:h};
  }

  var API={cat:cat,isSkeleton:isSkeleton,buildableTypes:buildableTypes,
    makeEdits:makeEdits,resolve:resolve,count:count,serialize:serialize,parse:parse,
    demolish:demolish,build:build,buildBig:buildBig,spanAt:spanAt,spans:spans,
    WATER:WATER,ROAD:ROAD,FREEWAY:FREEWAY,RAILT:RAILT,MOUNT:MOUNT,OPEN:OPEN};
  if(HASREQ) module.exports=API;
  root.BohemiaCityEdit=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
