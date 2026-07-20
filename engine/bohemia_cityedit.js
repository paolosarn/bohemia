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
  function makeEdits(){ return {v:1, cells:{}}; }
  function resolve(edits, x, y, generated){
    var k=x+','+y;
    return (edits&&edits.cells&&(k in edits.cells)) ? edits.cells[k] : generated;
  }
  function count(edits){ return Object.keys(edits&&edits.cells||{}).length; }
  function serialize(edits){ return JSON.stringify(edits); }
  function parse(s){ try{ var e=JSON.parse(s);
      if(e&&e.v===1&&e.cells&&typeof e.cells==='object') return e; }catch(err){}
    return makeEdits(); }

  // ---- THE VERBS -----------------------------------------------------------
  // demolish: a BUILDABLE plot goes down to the desert underneath.
  function demolish(edits, x, y, current){
    if(isSkeleton(current)) return {ok:false, why:'the skeleton is sacred'};
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

  var API={cat:cat,isSkeleton:isSkeleton,buildableTypes:buildableTypes,
    makeEdits:makeEdits,resolve:resolve,count:count,serialize:serialize,parse:parse,
    demolish:demolish,build:build,
    WATER:WATER,ROAD:ROAD,FREEWAY:FREEWAY,RAILT:RAILT,MOUNT:MOUNT,OPEN:OPEN};
  if(HASREQ) module.exports=API;
  root.BohemiaCityEdit=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
