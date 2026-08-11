// BOHEMIA VISTA — THE MOUNTAIN OVERLOOK (8/9/26, CITY lane, co-owned with RUN)
//
// Paolo 8/4, THE DEMO PLAN row 2 and row 11, and again 8/9 ("demo-critical"):
//   "I want that main quest origin in it when ur sibling dies and you get to see
//    the outlook in the city type shit"
//   THE VISTA: the mountain overlook where you SEE the whole valley for the first
//   time -- the BotW-style outlook, canon as a RETURN point that upgrades per act.
//   THE DEMO'S MONEY SHOT.
//
// THE PLAN'S OWN CONSTRAINT, AND IT IS THE WHOLE DESIGN:
//   "the city view machinery already renders the valley; this is a camera moment
//    + a walkable overlook spur, NOT A NEW RENDERER."
// So nothing here draws. It answers three questions and hands them to the camera:
//   WHERE do you stand      -> overlook(world)
//   WHAT can you see        -> survey(world, from)
//   HOW is it framed        -> framing(world, from)
//
// ============================================================================
// MAP LAW: CLAUDE NEVER DESIGNS MAP LAYOUTS. PLUMBING ONLY. PAOLO PLACES CANON.
// ============================================================================
// So the overlook is NOT authored. It is DERIVED from the map the seed already
// made, by measuring every mountain cell that touches the valley and scoring what
// it can actually see. If Paolo ever places THE overlook himself, CANON below
// takes it and the derivation stops -- the mechanism is mine, the location is his
// the moment he wants it to be.
//
// WHY A MOUNTAIN CELL ON THE RIM, and this is real Las Vegas geography: the valley
// is a basin ringed by mountains (Spring Mountains west, Frenchman and Sunrise
// east, McCullough south). Every real overlook into Vegas is exactly this -- you
// are on the rim looking down the bowl. The derivation looks for the same thing
// the geography already produces: high ground with the most built valley in front
// of it and open sightlines across it.
(function(root){
  var HASREQ=(typeof module!=='undefined'&&module.exports&&typeof require!=='undefined');
  var OM=HASREQ ? require('./bohemia_overmap.js')
                : (typeof BohemiaOvermap!=='undefined'?BohemiaOvermap:root.BohemiaOvermap);

  var VERSION='8/9/26';

  /* CONTENTS-PAOLO'S. Empty until he places one. A cell here wins over every
     derived candidate, and nothing in this file guesses at it. */
  var CANON=null;               // e.g. {x:12,y:44,name:'...'} when he rules it

  /* the rim: high ground you cannot walk through, which is what you stand ON */
  var HIGH={mountain:1};
  /* what counts as VALLEY you came to look at -- built land and the roads that
     stitch it. Bare desert is not a view, it is the gap between views. */
  var EMPTY={desert:1, mountain:1, water:1, wash:1, basin:1};

  function at(world,x,y){
    if(x<0||y<0||x>=OM.OVER_N||y>=OM.OVER_N) return null;
    return world.at(x,y);
  }
  function isHigh(t){ return !!(t&&HIGH[t.district]); }
  function isValley(t){ return !!(t&&!EMPTY[t.district]); }

  /* ========================================================================
     WHERE YOU STAND — derived, deterministic, never authored
     ========================================================================
     A candidate is a mountain cell with at least one non-mountain neighbour (it
     is ON the rim, not buried in the range). Its score is what it can SEE:
     rays are cast across the basin and every built cell they reach counts, with
     nearer cells worth more, because a vista is a foreground of city that fades
     into distance -- not a far-off smudge. A ray STOPS at high ground, so a peak
     behind another peak scores what it actually sees and not what is behind it. */
  var RAYS=24, REACH=46;
  function seenFrom(world,x,y){
    var total=0, cells=0, i, k;
    for(i=0;i<RAYS;i++){
      var a=(i/RAYS)*Math.PI*2, dx=Math.cos(a), dy=Math.sin(a);
      for(k=2;k<=REACH;k++){
        var nx=Math.round(x+dx*k), ny=Math.round(y+dy*k);
        var t=at(world,nx,ny);
        if(!t) break;
        if(isHigh(t)) break;                       // the ridge blocks the ray
        if(isValley(t)){ cells++; total+=1/(1+k/12); }   // nearer reads stronger
      }
    }
    return {score:total, cells:cells};
  }
  function onRim(world,x,y){
    var d=[[1,0],[-1,0],[0,1],[0,-1]], i;
    for(i=0;i<4;i++){ var t=at(world,x+d[i][0],y+d[i][1]); if(t&&!isHigh(t)) return true; }
    return false;
  }

  /* overlook(world) -> {x,y,score,cells,derived,why}
     Scans every cell once. 9,216 cells x 24 rays is cheap and runs at boot, but
     the result is memoised per world because the answer cannot change for a seed. */
  var _cache={};
  function overlook(world){
    if(CANON) return {x:CANON.x, y:CANON.y, derived:false, why:'placed by Paolo', score:null, cells:null};
    var key=String(world&&world.seed);
    if(_cache[key]) return _cache[key];
    var best=null, x, y;
    for(y=0;y<OM.OVER_N;y++)for(x=0;x<OM.OVER_N;x++){
      var t=at(world,x,y);
      if(!isHigh(t)) continue;
      if(!onRim(world,x,y)) continue;
      var s=seenFrom(world,x,y);
      if(s.cells<40) continue;                     // a ledge over nothing is not a vista
      if(!best||s.score>best.score) best={x:x,y:y,score:s.score,cells:s.cells};
    }
    if(!best) return null;
    best.derived=true;
    best.why='highest-scoring rim cell: ' + best.cells + ' built cells in sight';
    _cache[key]=best;
    return best;
  }

  /* ========================================================================
     WHAT YOU CAN SEE — the survey behind the caption
     ========================================================================
     Not decoration: the vista has to be able to SAY what you are looking at, and
     a caption that names real districts is the difference between a map screen
     and a moment. Returns the districts in view by weight, nearest first. */
  function survey(world,from){
    if(!from) return null;
    var seen={}, cells=0, i, k, nearest=null;
    for(i=0;i<RAYS;i++){
      var a=(i/RAYS)*Math.PI*2, dx=Math.cos(a), dy=Math.sin(a);
      for(k=2;k<=REACH;k++){
        var nx=Math.round(from.x+dx*k), ny=Math.round(from.y+dy*k);
        var t=at(world,nx,ny);
        if(!t) break;
        if(isHigh(t)) break;
        if(!isValley(t)) continue;
        cells++;
        seen[t.district]=(seen[t.district]||0)+1;
        if(!nearest||k<nearest.d) nearest={d:k,district:t.district,x:nx,y:ny};
      }
    }
    var order=Object.keys(seen).sort(function(a,b){return seen[b]-seen[a];});
    return {cells:cells, districts:order, counts:seen, nearest:nearest,
            /* the real distance you are looking across, in metres, off the canon
               cell size -- so the caption can be true rather than impressive */
            reachM: REACH*OM.CELL_M*OM.TILE_FINE};
  }

  /* ========================================================================
     HOW IT IS FRAMED — a camera moment, not a renderer
     ========================================================================
     The valley view is isometric and already exists. All this says is: put the
     camera cell at the overlook, and zoom out far enough that the basin in front
     of you fills the frame. `tw` is the iso tile width the caller should use;
     everything else about drawing stays exactly as it was. */
  function framing(world,from,screenW,screenH){
    from=from||overlook(world);
    if(!from) return null;
    var s=survey(world,from);
    /* fit the sighted depth across the shorter screen axis, then clamp to the
       zoom range the existing view already supports. Never a fractional tile:
       the mobile render contract bans non-integer scale. */
    var span=Math.max(12,Math.min(REACH,Math.ceil(Math.sqrt(s?s.cells:100))+8));
    var tw=Math.max(6,Math.floor(Math.min(screenW||390,screenH||844)/span));
    if(tw%2) tw--;                                  // even width keeps the iso diamond whole

    /* YOU LOOK ACROSS A VALLEY, YOU DO NOT HOVER OVER A LEDGE.
       The first cut centred the camera on the overlook cell itself. The overlook
       is by definition on the RIM, so half the frame came back empty sky and the
       city sat squashed in one corner -- a map screen, not a money shot. I only
       saw it by looking at the render.
       The camera looks at a point most of the way toward the CENTRE OF WHAT IS
       VISIBLE, which puts the rim at the near edge and lays the basin out in
       front of you: the BotW outlook composition, and the one real overlooks
       have, because you are standing at the edge of the bowl looking in. */
    var look={x:from.x, y:from.y};
    if(s&&s.cells) {
      var c=centroid(world,from);
      if(c){ look={ x:Math.round(from.x+(c.x-from.x)*LOOK_BIAS),
                    y:Math.round(from.y+(c.y-from.y)*LOOK_BIAS) }; }
    }
    return {cx:look.x, cy:look.y, tw:tw, th:Math.max(3,tw>>1), span:span,
            standingAt:{x:from.x,y:from.y}, from:from, survey:s};
  }
  /* where the visible valley actually sits, so the camera has something true to
     aim at rather than a guessed offset in some compass direction */
  var LOOK_BIAS=0.72;
  function centroid(world,from){
    var sx=0, sy=0, n=0, i, k;
    for(i=0;i<RAYS;i++){
      var a=(i/RAYS)*Math.PI*2, dx=Math.cos(a), dy=Math.sin(a);
      for(k=2;k<=REACH;k++){
        var nx=Math.round(from.x+dx*k), ny=Math.round(from.y+dy*k);
        var t=at(world,nx,ny);
        if(!t) break;
        if(isHigh(t)) break;
        if(isValley(t)){ sx+=nx; sy+=ny; n++; }
      }
    }
    return n? {x:sx/n, y:sy/n} : null;
  }

  var API={VERSION:VERSION, overlook:overlook, survey:survey, framing:framing, centroid:centroid,
           CANON:CANON, setCanon:function(c){ CANON=c; _cache={}; },
           RAYS:RAYS, REACH:REACH, HIGH:HIGH, EMPTY:EMPTY,
           isHigh:isHigh, isValley:isValley, onRim:onRim, seenFrom:seenFrom};
  if(HASREQ) module.exports=API;
  root.BohemiaVista=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
