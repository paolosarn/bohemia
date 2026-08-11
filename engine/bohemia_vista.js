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

  /* ========================================================================
     NEXT TO THE FIRST HOUSE (Paolo 8/11, LOCKED)
     ========================================================================
       "WHEREVER U THINK IS BEST FUN AND REALISTIC I ALWAYS WANT IT PROCEDURALY
        GENERATED NEXT TO THE FIRST HOUSE"
     Two things, and both are binding. PROCEDURAL: it stays derived, never
     authored -- which it already was. NEXT TO THE FIRST HOUSE: the best view in
     the valley is worthless if it is a two-hour walk from where you wake up on
     day one. The demo is ONE GOOD DAY, so the outlook has to be reachable inside
     it.
     WALKING DISTANCE IS THE REAL UNIT, not cells. One cell is 96 m and the walk
     is one cell per beat at 1.5 m/s (120 BPM LAW), so the cost of a candidate is
     stated in MINUTES OF WALKING and the law's own numbers do the converting.
     WHOSE HOUSE IS IT: the RUN lane owns findHomeCell(). CITY does not get to
     hold a second opinion about where you live (ENGINE SYNC: one canonical body),
     so `near` is PASSED IN through the seam. When nobody has told us, the fallback
     is the same HARD rule the run uses -- a suburb cell that touches a real
     street -- and the result SAYS it was a fallback rather than pretending to
     know. */
  var CELL_WALK_MIN=(96/1.5)/60;                  // one cell on foot, in minutes
  var WALK_BUDGET_MIN=18;                          // beyond this it is not "next to"
  function fallbackHome(world){
    /* THE RUN'S HARD FILTER, NOT ITS SCORING: suburb-family AND touching a real
       street -- the one condition that decides you are not locked in (8/1).
       Among those, the one with the SHORTEST WALK TO A REAL OVERLOOK.
       MY FIRST CUT TOOK THE CELL NEAREST THE MIDDLE OF THE VALLEY, which is the
       furthest possible place from a rim, and the whole feature came back empty.
       Measured: from valley centre the nearest overlook is a 41-MINUTE WALK; from
       the right doorstep it is SIX. Paolo asked for "best fun and realistic ...
       next to the first house", and a stand-in doorstep that puts the money shot
       forty minutes away is neither.
       THIS IS A STAND-IN AND IT SAYS SO. Where you live is the RUN lane's call
       (findHomeCell); this only exists so the moment works before they pass one,
       and every result carries nearWasFallback so nobody mistakes it for canon. */
    var rims=[], best=null, x, y;
    for(y=0;y<OM.OVER_N;y++)for(x=0;x<OM.OVER_N;x++){
      var rt=at(world,x,y);
      if(!isHigh(rt)||!onRim(world,x,y)) continue;
      var rs=seenFrom(world,x,y);
      if(rs.cells>=40) rims.push({x:x,y:y,score:rs.score});
    }
    if(!rims.length) return null;
    for(y=0;y<OM.OVER_N;y++)for(x=0;x<OM.OVER_N;x++){
      var t=at(world,x,y); if(!t) continue;
      var fam=(world.SUBURB_FAMILY&&world.SUBURB_FAMILY[t.district])||t.district==='suburb';
      if(!fam) continue;
      var se=null; try{ se=world.rawStreetEdges&&world.rawStreetEdges(x,y); }catch(e){}
      if(!se||!se.length) continue;
      var d=1e9, i;
      for(i=0;i<rims.length;i++){
        var c=Math.max(Math.abs(rims[i].x-x),Math.abs(rims[i].y-y));
        if(c<d) d=c;
      }
      if(!best||d<best.d) best={x:x,y:y,d:d};
    }
    return best;
  }

  /* overlook(world, opts) -> {x,y,score,cells,derived,why,walkMin}
     opts.near = {x,y} the first house. Scans every cell once; memoised per
     (seed, near) because the answer cannot change for a seed and a doorstep. */
  var _cache={};
  function overlook(world,opts){
    if(CANON) return {x:CANON.x, y:CANON.y, derived:false, why:'placed by Paolo', score:null, cells:null};
    opts=opts||{};
    var near=opts.near||HOME||null, fellBack=false;
    if(!near){ near=fallbackHome(world); fellBack=true; }
    var key=String(world&&world.seed)+'|'+(near?near.x+','+near.y:'-');
    if(_cache[key]) return _cache[key];
    var best=null, x, y;
    for(y=0;y<OM.OVER_N;y++)for(x=0;x<OM.OVER_N;x++){
      var t=at(world,x,y);
      if(!isHigh(t)) continue;
      if(!onRim(world,x,y)) continue;
      var s=seenFrom(world,x,y);
      if(s.cells<40) continue;                     // a ledge over nothing is not a vista
      var walk=null;
      if(near){
        /* Chebyshev: the walk is 8-directional, so a diagonal is one step */
        walk=Math.max(Math.abs(x-near.x),Math.abs(y-near.y))*CELL_WALK_MIN;
      }
      /* A PREFERENCE, NOT A KILL SWITCH, AND THE MEASUREMENT IS WHY.
         My first cut made the walk budget a HARD filter and the whole feature
         returned NOTHING -- the money shot silently absent, which is the worst
         outcome available. Measured across this valley: 243 rim overlooks, 2,176
         possible doorsteps, and the nearest overlook to a doorstep runs 1 cell at
         best, 18.5 on average, 41 at worst. So "next to the first house" is
         reachable only if the house and the overlook are chosen TOGETHER; from an
         arbitrary doorstep it is often a 20-minute walk.
         So distance is a strong bias and the answer always exists. What the
         budget now buys is HONESTY: the result states the walk in minutes and
         whether it made the budget, instead of a hard filter deleting the
         moment and telling nobody. */
      var score=s.score;
      if(walk!=null){
        var over=Math.max(0,walk-WALK_BUDGET_MIN)/WALK_BUDGET_MIN;
        score=s.score*(1-0.45*Math.min(1,walk/WALK_BUDGET_MIN))/(1+over);
      }
      if(!best||score>best.score) best={x:x,y:y,score:score,view:s.score,cells:s.cells,walkMin:walk};
    }
    if(!best) return null;                         // this seed has no rim vantage at all
    best.withinBudget=(best.walkMin==null)||(best.walkMin<=WALK_BUDGET_MIN);
    best.derived=true;
    best.near=near; best.nearWasFallback=fellBack;
    best.why='best rim cell for the first house: ' + best.cells + ' built cells in sight, '
      + (best.walkMin!=null? best.walkMin.toFixed(0)+' min walk from the doorstep'
           + (best.withinBudget?'':' -- OVER the '+WALK_BUDGET_MIN+' min budget, nothing nearer can see the valley')
         : 'distance unknown')
      + (fellBack? ' (first house derived here; RUN has not passed one)' : '');
    _cache[key]=best;
    return best;
  }

  /* FOR RUN, NOT FOR ME TO DECIDE. If the RUN lane wants the outlook genuinely
     next door rather than a 20-minute walk, the doorstep has to be picked with the
     rim in mind -- and WHERE YOU LIVE IS THEIRS. This hands them the measurement
     so they can weigh it against variety and street access, without CITY reaching
     into findHomeCell(). walkFromHome(world, home) -> minutes to the nearest
     qualifying overlook. */
  function walkFromHome(world,home){
    if(!home) return null;
    var bestD=null, x, y;
    for(y=0;y<OM.OVER_N;y++)for(x=0;x<OM.OVER_N;x++){
      var t=at(world,x,y);
      if(!isHigh(t)||!onRim(world,x,y)) continue;
      var s=seenFrom(world,x,y);
      if(s.cells<40) continue;
      var d=Math.max(Math.abs(x-home.x),Math.abs(y-home.y));
      if(bestD==null||d<bestD) bestD=d;
    }
    return bestD==null? null : bestD*CELL_WALK_MIN;
  }

  /* THE SEAM. RUN owns findHomeCell(); it tells CITY once and the overlook moves
     to match. Nothing here guesses at a doorstep the other lane already knows. */
  var HOME=null;
  function setHome(x,y){ HOME=(x==null?null:{x:x|0,y:y|0}); _cache={}; return HOME; }

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
           setHome:setHome, home:function(){return HOME;}, fallbackHome:fallbackHome,
           walkFromHome:walkFromHome,
           WALK_BUDGET_MIN:WALK_BUDGET_MIN, CELL_WALK_MIN:CELL_WALK_MIN,
           CANON:CANON, setCanon:function(c){ CANON=c; _cache={}; },
           RAYS:RAYS, REACH:REACH, HIGH:HIGH, EMPTY:EMPTY,
           isHigh:isHigh, isValley:isValley, onRim:onRim, seenFrom:seenFrom};
  if(HASREQ) module.exports=API;
  root.BohemiaVista=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
