// BOHEMIA LOT LATTICE — WHERE A STEP MAY LAND (9/15/26, LIFE + CITY, [lot lattice])
//
// PAOLO 9/15, LOCKED, rule 16, laws/BOHEMIA_ADDENDUM_THE_STEP_IS_A_HOUSE_9_15_26.md:
// "each tile is the size of a house... however long it takes right now to walk the
// length of a house, that would be done in one step." ONE STEP IS ONE LOT.
//
// THIS FILE IS THE ONE PLACE. The law's section 3 ends "ONE NUMBER IN ONE PLACE...
// A second copy anywhere is the bug." LOT_FINE below is that number. The street, the
// fight board, the body size, the zoom seam and the reach module read it from here.
// RUN owns THE STEP (the movement, the clock); this module owns THE LATTICE (what a
// lot is, where a step may land, what blocks a step, and where a city tap puts you).
//
// ---------------------------------------------------------------------------
// WHAT WAS MEASURED BEFORE ANY OF THIS WAS CHOSEN (rule 12: a premise is not a gate).
// Driven from the demo's own door with tools/bohemia_drive_the_demo.js, reading the
// game's own walkability (cellAt(x,y).walk), eight district types, 384x384 fine cells
// each. Record: records/BOHEMIA_WHERE_A_STEP_MAY_LAND_9_15_26.md
//
//  1. THE ROW'S PREMISE WAS WRONG, AND SO WAS RUN'S COPY OF IT. Both say "a lot is
//     FN=32 fine cells". FN IS 128, not 32, and it is not a lot: the 7/6 VALLEY SCALE
//     LAW says one overmap cell is 128 fine cells = 96 m and calls it A NEIGHBOURHOOD,
//     NOT A LOT, in those words. The stale 32 is a comment in the population module
//     left over from before the 7/30 relock. A 96 m step is not a house, it is a block.
//
//  2. THE GAME ALREADY HAS A LOT AND NOBODY LOOKED. engine/bohemia_suburb.js packs
//     houses on a stride LOTW = widest model + gap = round(16/0.75) + 3 = 24 fine
//     cells = 18 m. That is the length of a house in this game, written by the thing
//     that draws the houses. LOT_FINE IS THAT NUMBER, and lot_lattice_gate.js fails
//     if the two ever drift apart, so the second copy cannot happen quietly.
//
//  3. A FIXED ANCHOR IS DEAD. If a step lands on lot CORNERS, a suburb goes 45%
//     standable and its biggest connected island is 23% — the lattice cuts the world
//     into pieces a body cannot walk between. Lot CENTRES are better (95%) but fall
//     to 53% one street over at a coarser lot. The landing cannot be a fixed offset.
//
//  4. A SNAPPED LANDING KEEPS THE WORLD WHOLE. Let the lot's landing be a cell you can
//     actually stand on and every district measures 91% to 100% standable with one
//     island: SPAWN 97.9%, downtown 91%, commercial 98.6%, gated 98.6%.
//
//  5. AND THE ONE OUTLIER IS NOT THE LATTICE'S FAULT, WHICH IS THE FINDING THAT MADE
//     ME KEEP IT. A suburb tile away from the door measures 37.5% one island at lot
//     scale — and 39.9% AT FINE SCALE, walking it one small cell at a time, today.
//     The fine world there is already cut up by fences and back walls. Coarsening the
//     step costs 2.4 points, not 60. The lattice is not the thing that is broken there.
//
//  6. THE LANDING PREFERS THE ROAD, because the 8/1 law (NO DISTRICT IS A PRISON,
//     "the streets have to touch the streets bro") already ruled that a drop-in must
//     not put him behind a house facing a wall. Measured, road-preference costs
//     nothing anywhere and gains in commercial, industrial, gated and park. So the
//     lattice node and the city tap's arrival point are THE SAME CELL by construction,
//     rather than two rules that agree by luck.
// ---------------------------------------------------------------------------
//
// MECHANISM-MINE / CONTENTS-PAOLO'S: this module holds no art, no names and no prices.
// It is injected with the surface's own walkability, so it can be measured on the
// walked city, on the fight board, or in a gate, and it cannot disagree with the game
// about what is walkable — it has no opinion of its own to disagree with.
const BOH_LATTICE=(function(){
  'use strict';

  const CELL_M=0.75;                    // metres per fine cell (engine/bohemia_overmap.js)

  // *** THE ONE NUMBER. Fine cells per step. See measurement 2 above. ***
  const LOT_FINE=24;
  const LOT_M=LOT_FINE*CELL_M;          // 18 m, the length of a house

  // THE BODY, from the law's section 3: "a person stands about half a lot tall at
  // walk zoom... Realism is not the guide here; readability on a phone is, and that
  // trade is his." A DEFAULT HE CORRECTS IN PLAY, so it lives here as one number and
  // not as a sprite size baked into a renderer.
  const BODY_LOTS=0.5;

  function lotOf(hx,hy){ return [Math.floor(hx/LOT_FINE),Math.floor(hy/LOT_FINE)]; }
  function lotOrigin(lx,ly){ return [lx*LOT_FINE,ly*LOT_FINE]; }
  function lotCentre(lx,ly){ const h=LOT_FINE>>1; return [lx*LOT_FINE+h,ly*LOT_FINE+h]; }

  /* THE CLOCK PER STEP IS DERIVED, NEVER TYPED (law section 3). Hand it the walking
     speed the reach module already carries and it tells you what one step costs. If
     the speed changes, the day changes with it, which is the point: distances, jobs
     and rent nights stay true without anybody editing a second number. */
  function minutesPerStep(metresPerMinute){
    const v=+metresPerMinute; if(!(v>0)) return null;   // no speed, no answer, and it says so
    return LOT_M/v;
  }
  /* How much faster real-time travel gets, which is the "in multiples" he asked for. */
  function stepMultiple(oldFineCellsPerStep){
    const n=+oldFineCellsPerStep; if(!(n>0)) return null;
    return LOT_FINE/n;
  }
  /* Body height in screen pixels, given what one lot measures on screen right now. */
  function bodyPx(lotPx){ const p=+lotPx; if(!(p>0)) return null; return p*BODY_LOTS; }

  /* ---- THE LANDING -------------------------------------------------------
     ctx.walk(x,y) -> can a body stand on this fine cell (REQUIRED; the surface's own
                      test, never a guess made in here)
     ctx.road(x,y) -> is this fine cell road ground (OPTIONAL; without it the landing
                      is simply the walkable cell nearest the lot's centre)
     Three tiers, in the 8/1 law's own order: road, then touching a road, then any
     walkable cell. Nearest the lot centre inside a tier; ties broken by scan order so
     the same lot always answers the same cell on every surface and every run. */
  function landing(lx,ly,ctx){
    if(!ctx||typeof ctx.walk!=='function') throw new Error('bohemia_lattice: landing needs ctx.walk');
    const cache=ctx.cache; const key=lx+','+ly;
    if(cache&&Object.prototype.hasOwnProperty.call(cache,key)) return cache[key];
    const ox=lx*LOT_FINE, oy=ly*LOT_FINE, h=LOT_FINE>>1, cx=ox+h, cy=oy+h;
    const road=(typeof ctx.road==='function')?ctx.road:null;
    let best=[null,null,null], bestD=[Infinity,Infinity,Infinity];
    for(let j=0;j<LOT_FINE;j++) for(let i=0;i<LOT_FINE;i++){
      const x=ox+i, y=oy+j;
      if(!ctx.walk(x,y)) continue;
      let tier=2;
      if(road){
        if(road(x,y)) tier=0;
        else { for(let k=0;k<4;k++){ const dx=[1,-1,0,0][k], dy=[0,0,1,-1][k];
                 if(ctx.walk(x+dx,y+dy)&&road(x+dx,y+dy)){ tier=1; break; } } }
      }
      const d=(x-cx)*(x-cx)+(y-cy)*(y-cy);
      if(d<bestD[tier]){ bestD[tier]=d; best[tier]=[x,y]; }
    }
    const out=best[0]||best[1]||best[2]||null;
    if(cache) cache[key]=out;
    return out;
  }

  /* ---- WHAT BLOCKS A STEP ------------------------------------------------
     A step from lot A to a touching lot B is offered ONLY IF a body can walk from A's
     landing to B's landing WITHOUT LEAVING THE TWO LOTS. That is the honest rule: one
     step is one move, and a move that needs a detour through a third lot is not one
     step, it is a walk. It is also what stops a body cutting the corner of a house:
     the sealed back yard and the neighbour's back yard are two lots with a wall
     between them, and this says so instead of teleporting through it.
     A lot with no landing is not steppable at all, which is what a building is. */
  function stepLegal(ax,ay,bx,by,ctx){
    if(Math.max(Math.abs(ax-bx),Math.abs(ay-by))!==1) return false;   // must touch
    const A=landing(ax,ay,ctx), B=landing(bx,by,ctx);
    if(!A||!B) return false;
    const lox=Math.min(ax,bx)*LOT_FINE, loy=Math.min(ay,by)*LOT_FINE;
    const hix=(Math.max(ax,bx)+1)*LOT_FINE-1, hiy=(Math.max(ay,by)+1)*LOT_FINE-1;
    const seen=Object.create(null), q=[A]; seen[A[0]+','+A[1]]=1;
    while(q.length){
      const v=q.pop();
      if(v[0]===B[0]&&v[1]===B[1]) return true;
      for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++){
        if(!dx&&!dy) continue;
        const nx=v[0]+dx, ny=v[1]+dy;
        if(nx<lox||ny<loy||nx>hix||ny>hiy) continue;
        const k=nx+','+ny; if(seen[k]) continue;
        if(!ctx.walk(nx,ny)) continue;
        seen[k]=1; q.push([nx,ny]);
      }
    }
    return false;
  }

  /* The legal steps out of a lot, in a fixed order so a caller's behaviour never
     depends on object iteration. */
  const DIRS=[[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];
  function stepsFrom(lx,ly,ctx){
    const out=[];
    for(let i=0;i<DIRS.length;i++){
      const nx=lx+DIRS[i][0], ny=ly+DIRS[i][1];
      if(stepLegal(lx,ly,nx,ny,ctx)) out.push([nx,ny]);
    }
    return out;
  }

  /* ---- THE ARRIVAL POINT -------------------------------------------------
     A city tap names a place, not a cell. This turns it into the cell he stands on:
     the landing of the lot he tapped, and if that lot has none (he tapped a building,
     or water), the nearest lot that does, searched in rings. RINGS, NOT A FLOOD FILL:
     the 8/1 note in the walked surface measured a 7,400-9,400 tile flood-fill behind
     one drop-in. A ring search over lots looks at 576 times fewer things.
     It NEVER refuses. A place with no landing anywhere within `rings` hands back null
     and the caller keeps whatever it had, so nothing in the valley can become
     unreachable because this module could not find a doorstep. */
  function arrive(hx,hy,ctx,rings){
    const R=(rings|0)||24;
    const L0=lotOf(hx,hy);
    const here=landing(L0[0],L0[1],ctx);
    if(here) return here;
    for(let r=1;r<=R;r++){
      let best=null,bestD=Infinity;
      for(let dy=-r;dy<=r;dy++) for(let dx=-r;dx<=r;dx++){
        if(Math.max(Math.abs(dx),Math.abs(dy))!==r) continue;
        const p=landing(L0[0]+dx,L0[1]+dy,ctx);
        if(!p) continue;
        const d=(p[0]-hx)*(p[0]-hx)+(p[1]-hy)*(p[1]-hy);
        if(d<bestD){ bestD=d; best=p; }
      }
      if(best) return best;
    }
    return null;
  }

  /* Is this fine cell a lattice node, i.e. is he standing where a step may land? */
  function onLattice(hx,hy,ctx){
    const L=lotOf(hx,hy), p=landing(L[0],L[1],ctx);
    return !!p&&p[0]===hx&&p[1]===hy;
  }

  /* ---- THE STRIDE -------------------------------------------------------
     PAOLO 9/20, rule 18, THE PLAYABLE CUT: "walking the same distance and crashing
     into walls because it's forcing me to move like 67 tiles at a time, so when I'm
     trying to walk past the wall it's not allowing me to because I'm just missing it."
     RUN [one camera] asks this lane for it by name: "a press moves him to the next
     standable place toward the press using LIFE+CITY's landing rule, never past a gap,
     never into a wall, a press toward a wall slides along it, any gap a body fits
     through is walkable; the lot is the CEILING of a stride, the ground sets its
     length."

     *** THE LANDING AND THE STRIDE ARE TWO DIFFERENT ANSWERS AND CONFUSING THEM IS THE
     BUG HE IS DESCRIBING. *** landing() is where an ARRIVAL goes: a city tap names a
     place, and the lot's own doorstep is where you are put down. A STRIDE is not that.
     A stride runs along the ground from where he actually stands, as far as the ground
     lets it, and stops. Snapping a stride to lot corners is exactly "it's forcing me to
     move like 67 tiles at a time" -- it lands him past the doorway he was aiming at.
     So the lot is a CEILING here, never a grid: one press is AT MOST one lot, and the
     ground decides how much of that he gets.

     WHAT IT REFUSES, in his words:
       NEVER INTO A WALL    it walks cell by cell and stops at the last standable one.
       NEVER PAST A GAP     the same walk: a gap is a cell it will not enter, so it can
                            never be crossed. No leaping.
       ANY GAP A BODY FITS  no corner test on the diagonals. A one-cell doorway is a
                            doorway, which is the half of his sentence about missing it.
       SLIDES ALONG A WALL  if the pressed direction is blocked at the very first cell,
                            it tries the two directions either side of the press and
                            takes the one that gets further, ties to the clockwise one so
                            the same press always does the same thing.

     IT ANSWERS ABOUT THE GROUND AND NOTHING ELSE. Doors, bodies in the way and the
     occupancy rule stay with the caller's own step -- this module is handed a
     walkability test and has no opinion of its own to add to it. */
  function stride(hx,hy,dir,ctx){
    if(!ctx||typeof ctx.walk!=='function') throw new Error('bohemia_lattice: stride needs ctx.walk');
    const d=DIRS[(dir|0)%DIRS.length];
    if(!d) return {to:[hx,hy],cells:0,dir:dir|0,why:'NO_SUCH_DIRECTION'};
    /* `openAgain` is the direction he actually pressed. A slide carries it so it can
       stop the moment that direction opens up: see the note on the slide below. */
    function run(dd,openAgain){
      let x=hx,y=hy,n=0,lined=false;
      while(n<LOT_FINE){
        const nx=x+dd[0], ny=y+dd[1];
        if(!ctx.walk(nx,ny)) break;
        x=nx; y=ny; n++;
        if(openAgain&&ctx.walk(x+openAgain[0],y+openAgain[1])){ lined=true; break; }
      }
      return {x:x,y:y,n:n,lined:lined};
    }
    const straight=run(d);
    if(straight.n>0)
      return {to:[straight.x,straight.y],cells:straight.n,dir:dir|0,
              why:straight.n>=LOT_FINE?'LOT':'GROUND'};
    /* BLOCKED ON THE FIRST CELL: SLIDE ALONG WHAT HE WALKED INTO.
       TWO TIERS, AND THE FIRST CUT ONLY HAD ONE, WHICH IS THE WHOLE POINT OF THE RULE.
       Turning 45 degrees does not get you along a straight wall: press EAST into a wall
       running north-south and NE and SE are just as much into it. Measured on a test
       world with that exact shape, one tier answered STUCK where a player would have
       walked. So: 45 degrees first, because it keeps most of the direction he asked
       for, and 90 degrees after, which is the one that actually runs along a flat wall.
       Within a tier, whichever gets further; ties to the clockwise one, so the same
       press always does the same thing. */
    const i=(dir|0)%DIRS.length, N=DIRS.length;
    for(const off of [1,2]){
      const cwI=(i+off)%N, ccwI=(i+N-off)%N;
      const a=run(DIRS[cwI],d), b=run(DIRS[ccwI],d);
      if(a.n===0&&b.n===0) continue;
      /* *** A SLIDE STOPS AT THE GAP, IT DOES NOT RUN A WHOLE LOT SIDEWAYS. ***
         The first working version slid the full ceiling, and that is his own complaint
         wearing a different coat: press east at a wall with a doorway three cells north
         of you and a full-lot slide carries you 24 cells south, past it. So a slide ends
         the moment THE DIRECTION HE PRESSED opens up again -- that is what "walk past
         the wall" means, and it leaves him lined up with the gap instead of beyond it.
         SO THE CHOICE IS NOT THE LONGER RUN. A run that ends lined up wins; between two
         lined-up runs the SHORTER one, because that is the nearer gap; if neither lines
         up, the longer one, because then he is just making his way along the wall.
         Ties to the clockwise side so one press always does one thing. */
      let useCW;
      if(a.lined!==b.lined) useCW=a.lined;
      else if(a.lined&&b.lined) useCW=(a.n<=b.n);
      else useCW=(a.n>=b.n);
      const pick=useCW?a:b, pd=useCW?cwI:ccwI;
      return {to:[pick.x,pick.y],cells:pick.n,dir:pd,
              why:pick.lined?'SLID_TO_THE_GAP':((off===1)?'SLID':'SLID_ALONG')};
    }
    return {to:[hx,hy],cells:0,dir:i,why:'STUCK'};
  }

  return {CELL_M,LOT_FINE,LOT_M,BODY_LOTS,DIRS,
          lotOf,lotOrigin,lotCentre,landing,stepLegal,stepsFrom,arrive,onLattice,stride,
          minutesPerStep,stepMultiple,bodyPx};
})();
if(typeof module!=='undefined')module.exports=BOH_LATTICE;
