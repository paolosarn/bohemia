// BOHEMIA INTERIOR LEVELS (8/7/26) — ONE LEVEL CONTRACT, THREE INTERIORS.
//
// WHY THIS EXISTS, AND WHY IT EXISTS *NOW*.
// There are three kinds of interior in this engine and they disagree about the word
// "levels" in the worst possible way:
//
//   bohemia_floorplan.js   levels : ARRAY of plates       .levels.length -> 3
//   bohemia_garage.js      levels : NUMBER of decks       .levels.length -> undefined
//   bohemia_crypt.js       no levels at all               .levels        -> undefined
//
// Same word, two meanings, and a third interior that does not use it. A walker written
// against the floorplan reads `.levels.length` and gets `undefined` on a garage; a walker
// written against the garage reads `.levels` as a count and gets an array. Neither throws.
// It is the exact shape of bug this repo has paid for over and over — the district list
// kept by hand in three places, the file path standing in for the type — and NOTHING HAS
// HIT IT YET only because no walker exists. The moment the RUN or CITY lane writes one, it
// hits. So it gets removed before it is load-bearing rather than after.
//
// THIS FILE CHANGES NOTHING. It adds no field to any interior and renames nothing; both
// existing shapes stay exactly as they are, because those modules are read by the shipped
// city app. It is a READER: hand it any interior and it answers the four questions a walker
// actually asks — how many storeys, what is on storey i, can a body stand here, and where
// does this storey connect to the next one.
//
// THE LINK IS THE POINT. A floorplan links storeys with a STAIR (one cell, floor on both
// plates). A garage links decks with a RAMP a car drives up AND a stair/elevator core a
// person walks. A crypt is one storey and links to nothing. All three answer `links(i)`.
(function(root){
  var HAS = (typeof module !== 'undefined');

  // ---- what a body can stand on, per interior kind -------------------------------
  // floorplan: semantic strings. garage/crypt: numeric codes, documented in their own
  // headers. Read them from the source of truth rather than restating them: a stair is
  // g:'floor' with kind:'stair' precisely so this list never had to grow.
  var GARAGE_WALKABLE = {1:1, 2:1, 3:1, 4:1, 5:1, 6:1};   // aisle stall car ramp core entrance
  var CRYPT_WALKABLE  = {1:1, 4:1};                        // floor/aisle + entrance

  function kindOf(it){
    if(!it || typeof it !== 'object') return null;
    if(it.kind === 'garage') return 'garage';
    if(it.kind === 'crypt')  return 'crypt';
    if(it.grid && it.rooms && it.doors) return 'floorplan';
    if(it.kind === 'floorplan' && it.floorplan) return 'floorplan-wrapped';
    return null;
  }
  // world.js's interior() wraps a floorplan as {kind:'floorplan', floorplan:{...}}
  function unwrap(it){ return (kindOf(it) === 'floorplan-wrapped') ? it.floorplan : it; }

  function read(interior){
    var it = unwrap(interior), k = kindOf(it);
    if(!k) return null;

    if(k === 'garage'){
      return {
        kind:'garage', W:it.W, H:it.H, count:it.levels,
        grid:function(i){ return it.decks[i]; },
        passable:function(i,x,y){ var g=it.decks[i];
          if(!g||y<0||x<0||y>=it.H||x>=it.W) return false; return !!GARAGE_WALKABLE[g[y][x]]; },
        // a deck connects UP by its ramp (a car drives it) and by the stair/elevator core
        // (a person walks it). Both are real ways up and a walker needs both.
        links:function(i){ var out=[], g=it.decks[i], x, y;
          if(!g) return out;
          for(y=0;y<it.H;y++)for(x=0;x<it.W;x++){
            if(g[y][x]===4 && i+1<it.levels) out.push({x:x,y:y,to:i+1,how:'ramp'});
            if(g[y][x]===5){ if(i+1<it.levels) out.push({x:x,y:y,to:i+1,how:'core'});
                             if(i>0)          out.push({x:x,y:y,to:i-1,how:'core'}); }
          }
          return out; },
        entrances:function(i){ var out=[], g=it.decks[i], x, y;
          if(i!==0||!g) return out;
          for(y=0;y<it.H;y++)for(x=0;x<it.W;x++) if(g[y][x]===6) out.push({x:x,y:y});
          return out; }
      };
    }

    if(k === 'crypt'){
      return {
        kind:'crypt', W:it.W, H:it.H, count:1,
        grid:function(){ return it.grid; },
        passable:function(i,x,y){ if(i!==0) return false;
          if(y<0||x<0||y>=it.H||x>=it.W) return false; return !!CRYPT_WALKABLE[it.grid[y][x]]; },
        links:function(){ return []; },                       // one storey, nothing above it
        entrances:function(i){ return i===0 && it.entrance ? [{x:it.entrance.x,y:it.entrance.y}] : []; }
      };
    }

    // floorplan
    var L = it.levels || [{W:it.W,H:it.H,grid:it.grid,rooms:it.rooms,doors:it.doors,meta:it.meta}];
    return {
      kind:'floorplan', W:it.W, H:it.H, count:L.length,
      grid:function(i){ return L[i] && L[i].grid; },
      passable:function(i,x,y){ var P=L[i];
        if(!P||y<0||x<0||y>=P.H||x>=P.W) return false;
        var c=P.grid[y][x]; return c.g==='floor'||c.g==='door'; },
      links:function(i){ return (it.stairs||[]).filter(function(s){ return s.from===i||s.to===i; })
        .map(function(s){ return {x:s.x,y:s.y,to:(s.from===i?s.to:s.from),how:'stair'}; }); },
      // the street door: a perimeter door on the ground plate, and only there
      entrances:function(i){ if(i!==0) return [];
        return (L[0].doors||[]).filter(function(d){
          return d[0]===0||d[1]===0||d[0]===it.W-1||d[1]===it.H-1; })
          .map(function(d){ return {x:d[0],y:d[1]}; }); }
    };
  }

  // ---- THE WALKER. One flood across every storey, following the links. ------------
  // This is the function the RUN and CITY lanes need in order to render or walk a stair,
  // and writing it here once is the difference between one implementation and three.
  function walk(interior){
    var A = read(interior);
    if(!A) return null;
    var D4=[[1,0],[-1,0],[0,1],[0,-1]];
    var seen={}, frontier=[], i, e;
    var key=function(i,x,y){ return i+':'+x+','+y; };
    var starts = A.entrances(0);
    if(!starts.length){                       // no declared entrance: start at any link
      var l0=A.links(0); if(l0.length) starts=[{x:l0[0].x,y:l0[0].y}];
    }
    for(i=0;i<starts.length;i++){ e=starts[i];
      if(A.passable(0,e.x,e.y)){ seen[key(0,e.x,e.y)]=1; frontier.push([0,e.x,e.y]); } }
    while(frontier.length){
      var p=frontier.pop(), li=p[0], px=p[1], py=p[2];
      for(var d=0; d<4; d++){
        var nx=px+D4[d][0], ny=py+D4[d][1];
        if(A.passable(li,nx,ny) && !seen[key(li,nx,ny)]){ seen[key(li,nx,ny)]=1; frontier.push([li,nx,ny]); }
      }
      // a LINK moves you between storeys at the same (x,y)
      var ls=A.links(li);
      for(i=0;i<ls.length;i++){
        var L2=ls[i];
        if(L2.x!==px||L2.y!==py) continue;
        if(A.passable(L2.to,px,py) && !seen[key(L2.to,px,py)]){ seen[key(L2.to,px,py)]=1; frontier.push([L2.to,px,py]); }
      }
    }
    // coverage per storey: of everything a body could stand on, how much was reached
    var per=[], total=0, reached=0;
    for(var li2=0; li2<A.count; li2++){
      var t=0, r2=0, x2, y2;
      for(y2=0;y2<A.H;y2++)for(x2=0;x2<A.W;x2++){
        if(!A.passable(li2,x2,y2)) continue;
        t++; if(seen[key(li2,x2,y2)]) r2++;
      }
      per.push({level:li2, walkable:t, reached:r2});
      total+=t; reached+=r2;
    }
    return { kind:A.kind, storeys:A.count, walkable:total, reached:reached,
             coverage: total? reached/total : 1, perLevel:per };
  }

  var API={read:read, walk:walk, kindOf:function(it){ return kindOf(unwrap(it)); }};
  if(HAS) module.exports=API;
  root.BohemiaInteriorLevels=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
