// BOHEMIA PATROL — owners patrol what they light (7/16/26)
//
// This module exists because of one locked line: LIGHT = TERRITORY.
// If a live circuit is owned, the owner is not an abstraction on a map. Somebody
// walks it. The patrol IS the ownership, made visible at street level.
//
// LAWS THIS OBEYS (all Paolo's, none new):
//   CLUSTERED POWER LAW  — 12% of circuits alive, every living cluster owned.
//                          Dead blocks are nobody's. Nobody patrols the dark.
//   NETWORK EERILY PERFECT — Paolo's word. So NETWORK patrols never drift, never
//                          pause, never vary their gap. The wrongness is that
//                          they are too correct. Everyone else is human.
//   120 BPM LAW          — patrol steps land on the grid tick, never between.
//   I-MOVE-YOU-MOVE      — patrols advance on the player's step, not wall time.
//   OCCUPANCY LAW        — one body per cell. A patrol waits rather than clips.
//   SIDEWALK SANCTITY    — patrols walk the sidewalk rows. They are not props;
//                          the whitelist governs objects, not people.
const BOH_PATROL=(function(){

  // Patrol styles per owner. These are read straight off the power law's own
  // owner list; the BEHAVIOUR of each is the one design call and it is derived
  // from Paolo's "NETWORK zones eerily perfect".
  const STYLE={
    network:    {count:2, pause:0.00, drift:0.00, reverse:false, gapExact:true,
                 note:'eerily perfect: fixed gap, no pause, no drift, never turns early'},
    faction:    {count:2, pause:0.10, drift:0.15, reverse:true,  gapExact:false,
                 note:'armed and irregular: checks corners, doubles back'},
    settlement: {count:1, pause:0.25, drift:0.25, reverse:true,  gapExact:false,
                 note:'human: stops, loiters, wanders off pattern'},
    solar_lone: {count:0, pause:0,    drift:0,    reverse:false, gapExact:false,
                 note:'one survivor with a panel does not patrol. Nobody walks.'},
  };

  function rng(seed){let s=(seed>>>0)||1;return function(){
    s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296;};}

  // ---- ROUTE ---------------------------------------------------------------
  // A patrol walks the block's sidewalk rows: up one side, down the other, and
  // crosses at the block ENDS. A patrol that never closes its loop is a guard
  // teleporting home every lap, and the eye catches that immediately.
  //
  // The crossing legs sit at x=0 and x=W-1 — the block boundaries, which is
  // where the intersections are. Nobody jaywalks mid-block. That is the same
  // reason CROSSWALKS ONLY AT INTERSECTIONS exists: the corner is where you
  // cross, in Vegas and everywhere else.
  function routeFor(block){
    const H=block.H,W=block.W;
    const rows=[];
    for(let y=0;y<H;y++) if(block.grid[y][0].g==='side') rows.push(y);
    if(!rows.length) return null;
    const top=rows[0], bot=rows[rows.length-1];
    const route=[];
    for(let x=0;x<W;x++) route.push([x,top]);            // west -> east, top walk
    if(bot!==top){
      for(let y=top+1;y<bot;y++) route.push([W-1,y]);    // cross at the east end
      for(let x=W-1;x>=0;x--) route.push([x,bot]);       // east -> west, bottom walk
      for(let y=bot-1;y>top;y--) route.push([0,y]);      // cross back at the west end
    }
    return route;   // true closed loop: last cell is adjacent to first
  }

  // ---- PATROLS FOR A BLOCK -------------------------------------------------
  // power.at(cell) decides everything. No circuit, no patrol. This is the whole
  // point: you can read who owns a block by who is walking it, and you can read
  // that from a rooftop before anyone sees you.
  function patrolsFor(block, cell, power, seed){
    if(!power||!cell) return [];
    const st=power.at(cell[0],cell[1]);
    if(!st.live||!st.owner) return [];          // the dark is nobody's
    const style=STYLE[st.owner]||STYLE.settlement;
    if(!style.count) return [];
    const route=routeFor(block);
    if(!route) return [];
    // the two sidewalk legs are what a patrol is FOR; the crossing legs are
    // transit. Recorded so a renderer can tell a walking guard from a crossing one.
    const walkCells=route.filter(([x,y])=>block.grid[y][x].g==='side').length;
    const r=rng((seed^(cell[0]*73856093)^(cell[1]*19349663))>>>0);
    const out=[];
    const gap=Math.floor(route.length/style.count);
    for(let i=0;i<style.count;i++){
      // NETWORK: exact gap, every time, forever. Everyone else starts wherever.
      const at=style.gapExact ? i*gap
             : (i*gap + Math.floor(r()*gap*0.6))%route.length;
      out.push({owner:st.owner,style,route,i:at,dir:1,paused:0,walkCells,
        id:'patrol_'+cell[0]+'_'+cell[1]+'_'+i});
    }
    return out;
  }

  // ---- STEP ----------------------------------------------------------------
  // Called once per player step (I-MOVE-YOU-MOVE). Returns the cell it wants.
  // The caller owns the occupancy check, because the caller owns the world.
  function makeWalker(p,seed){
    const r=rng(seed>>>0);
    return {
      p,
      cell(){return p.route[p.i];},
      // returns the NEXT cell it intends to enter, or null if it is standing still
      intent(){
        if(p.paused>0) return null;
        const n=(p.i+p.dir+p.route.length)%p.route.length;
        return p.route[n];
      },
      // commit(ok): ok=false means something was in the way. A patrol waits; it
      // does not clip through and it does not teleport.
      commit(ok){
        if(p.paused>0){p.paused--;return;}
        if(!ok){p.paused=1;return;}
        p.i=(p.i+p.dir+p.route.length)%p.route.length;
        if(p.style.gapExact) return;            // NETWORK: nothing below applies
        if(r()<p.style.pause) p.paused=1+Math.floor(r()*2);
        if(p.style.reverse&&r()<p.style.drift*0.2) p.dir*=-1;
      },
      facing(){
        const a=p.route[p.i], b=p.route[(p.i+p.dir+p.route.length)%p.route.length];
        return [Math.sign(b[0]-a[0]),Math.sign(b[1]-a[1])];
      }
    };
  }

  return {STYLE,routeFor,patrolsFor,makeWalker};
})();
if(typeof module!=='undefined')module.exports=BOH_PATROL;
