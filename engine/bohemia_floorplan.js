// BOHEMIA FLOORPLAN (7/18/26) — the ENTERABLE rung of the world model.
// The valley -> district -> plot -> building ladder had no bottom rung: a
// building was a solid footprint you could not go inside. This generates the
// INTERIOR: given a footprint (W x H fine tiles) + a zone + seed, it BSP-splits
// the space into rooms, walls the gaps, carves a door graph that GUARANTEES
// every room is reachable, and cuts a street-facing entrance. Zoning assigns
// room roles the Shadows-of-Doubt way (the room by the street door gets the
// public role, back rooms go private/service). Deterministic per (seed,W,H,zone).
// Semantic only: 'floor'/'wall'/'door' + role labels; art resolves at bake, the
// same contract as every other generator.
//
// 7/26/26 — INTERIOR-MATCHES-EXTERIOR LAW (Paolo 7/19, LOCKED: "if your interior
// does not match the width and length of the exterior every time, you are
// failing... I am not having it any other way"). This file was BREAKING that law
// on 343 buildings in the seed-12345 valley: `W=Math.max(minR+2,W|0)` silently
// GREW any footprint too small for its zone's room grammar (a 3x108 storage unit
// row became 10x108, a 1x19 farm strip became 6x19, a 7x6 plant became 10x10).
// The plate is now EXACTLY the footprint, always; the GRAMMAR shrinks to fit the
// plate instead of the plate growing to fit the grammar, and a sliver too thin to
// carry walled rooms becomes one open plate with a perimeter entrance.
const BOH_FLOORPLAN=(function(){
  function rng(seed){let s=(seed>>>0)||1;return function(){s=(s*1103515245+12345)>>>0;return s/4294967296;};}
  // zone -> ordered room roles (public first) + minimum room dimension
  /* *** WHAT A BIGGER BUILDING HAS MORE OF (`bulk`, 8/28). ***
     Rooms are named by RANK -- distance from the street door, public first -- and the line
     that did it was `Z.roles[Math.min(rank, Z.roles.length-1)]`. That CLAMPS: every room past
     the end of the list takes the LAST role, and in seven of these nine zones the last role is
     `bath`, because the list runs public-to-private and a toilet is the most private thing in
     it. So every building with more rooms than its zone has roles filled up with toilets.
     MEASURED ACROSS 277 BUILDINGS FROM THE REAL GENERATORS BEFORE THE FIX: 1213 of 2287 rooms
     in the valley were bathrooms -- FIFTY-THREE PERCENT. The convention centre had 50 of 54.
     The library 50 of 54. The chapel 49 of 53, which is a chapel that is 92% toilet. City hall
     48, the courthouse 48, the school 43. You walked into the Las Vegas library and found fifty
     lavatories.
     THE FIX IS NOT A CAP ON BATHROOMS, it is naming the room a bigger building actually gets
     more of, which is a different question and the one the clamp was silently answering wrong.
     A bigger house has more BEDROOMS. A bigger shop is more SALES FLOOR. A bigger hospital is
     more WARDS. A bigger warehouse is more OPEN FLOOR -- and that one is not taste: building
     code puts occupant load at 100-150 sq ft per person in an office and 500 in a warehouse,
     so a warehouse holds a fifth of the people and needs a fifth of the fixtures, while this
     was giving a 60x31 pump station EIGHT toilets. Restrooms are CORE space in the same
     bracket as stairs and risers; net-to-gross runs 60-80%, so they are a slice of the 20-40%
     that is left, never half the plan.
     Each list still runs public-to-private for the rooms it names, and `bath` still appears
     exactly once in each -- which is why no cap is needed. The flood was entirely the clamp. */
  const ZONES={
    residential:{roles:['living','kitchen','bed','bed','bath'],bulk:'bed',minRoom:4},
    retail:     {roles:['shopfloor','checkout','stockroom','office','bath'],bulk:'shopfloor',minRoom:5},
    office:     {roles:['lobby','office','office','meeting','breakroom','bath'],bulk:'office',minRoom:4},
    civic:      {roles:['hall','reception','office','records','bath'],bulk:'office',minRoom:5},
    institutional:{roles:['ward','ward','office','service','bath'],bulk:'ward',minRoom:5},
    warehouse:  {roles:['floor_open','dock','office','bath'],bulk:'floor_open',minRoom:8},
    landmark:   {roles:['atrium','gallery','service','bath'],bulk:'gallery',minRoom:6},
    // LEISURE (7/26): the vehicular/venue districts (drivein, golf, stadium,
    // waterpark) declare zone 'leisure' in bohemia_world.js's DISTGEN and were
    // silently falling through to the nameless 'default' grammar — 46 buildings
    // whose recorded dossiers describe real rooms (golf: "pro shop + bag room up
    // front, grill + locker rooms behind"; drivein: "counter + kitchen up front,
    // the projection room behind"; stadium: "the ring corridor under the stands,
    // boarded concession windows + restrooms"). Roles read off those dossiers.
    /* These two ended in 'service' rather than 'bath', so they were never part of the
       bathroom flood -- but they were still answering the wrong question, filling a big
       stadium with plant rooms. A bigger leisure building is more CONCOURSE; that is what
       a concourse is for. */
    leisure:    {roles:['concourse','counter','kitchen','locker','restroom','service'],bulk:'concourse',minRoom:5},
    'default':  {roles:['room','room','service'],bulk:'room',minRoom:4},
  };
  // union-find for the door spanning tree
  function UF(n){const p=Array.from({length:n},(_,i)=>i);
    const find=i=>{while(p[i]!==i){p[i]=p[p[i]];i=p[i];}return i;};
    return {find,union:(a,b)=>{const ra=find(a),rb=find(b);if(ra!==rb){p[ra]=rb;return true;}return false;}};}

  // ONE PLATE = ONE FLOOR. This is the original generator, renamed and otherwise
  // untouched, because everything in the engine already reads what it returns and a
  // rewrite here would be a rewrite of the whole enterable rung.
  function plate(seed,W,H,opts){
    const o=opts||{}; const r=rng(seed);
    const Z=ZONES[o.zone]||ZONES['default'];
    const entrance=o.entrance||'S';   // street-facing side
    // THE PLATE IS THE FOOTPRINT. Never padded, never clamped, never resized.
    W=Math.max(1,W|0); H=Math.max(1,H|0);
    // the GRAMMAR bends instead: a room can never be asked to be bigger than the
    // walled interior it has to live in.
    const minR=Math.max(1,Math.min(o.minRoom||Z.minRoom,Math.min(W-2,H-2)));
    const rooms=[],doors=[];
    const grid=[];
    for(let y=0;y<H;y++){const row=[];for(let x=0;x<W;x++)row.push({g:'wall',room:-1,door:false,role:null});grid.push(row);}
    const carve=(x,y)=>{if(x<0||y<0||x>=W||y>=H)return;const c=grid[y][x];if(c.door)return;c.g='door';c.door=true;doors.push([x,y]);};
    const perimeterDoor=()=>{ // the entrance, on the requested side, mid-edge
      if(entrance==='N')carve(W>>1,0);
      else if(entrance==='W')carve(0,H>>1);
      else if(entrance==='E')carve(W-1,H>>1);
      else carve(W>>1,H-1);
    };
    const zoneRooms=()=>{ // roles by distance from the entrance room (public near door)
      const front=rooms.__front||0;
      const order=[...rooms.keys()].sort((a,b)=>{
        const da=Math.abs(rooms[a].x-rooms[front].x)+Math.abs(rooms[a].y-rooms[front].y);
        const db=Math.abs(rooms[b].x-rooms[front].x)+Math.abs(rooms[b].y-rooms[front].y);
        return da-db;});
      /* PAST THE END OF THE LIST, A ROOM IS THE ZONE'S BULK ROOM -- not the last one
         named. See the note on ZONES: clamping here made 53% of the valley bathrooms. */
      order.forEach((ri,rank)=>{const role=rank<Z.roles.length?Z.roles[rank]:(Z.bulk||Z.roles[Z.roles.length-1]);
        rooms[ri].role=role;
        for(let y=rooms[ri].y;y<rooms[ri].y+rooms[ri].h;y++)for(let x=rooms[ri].x;x<rooms[ri].x+rooms[ri].w;x++)grid[y][x].role=role;});
    };

    // SLIVER PLATE (7/26): a footprint under 3 cells on either axis — a storage
    // unit row seen edge-on, a 1-wide farm strip, a thin utility shed. There is
    // no room left over once you spend a cell per side on wall, so the plate IS
    // the room: one open space, entrance cut straight through its perimeter.
    // Exactly W x H, like every other interior in this engine.
    if(W<3||H<3){
      rooms.push({x:0,y:0,w:W,h:H});
      for(let y=0;y<H;y++)for(let x=0;x<W;x++){grid[y][x].g='floor';grid[y][x].room=0;}
      perimeterDoor();
      zoneRooms();
      return {W,H,grid,rooms,doors,meta:{type:'floorplan',zone:o.zone||'default',rooms:rooms.length,doors:doors.length,entrance,
        sliver:true,pending:['wall/floor/door art per zone','furniture per role','multi-floor stacking']}};
    }

    // 1) BSP the interior (inside a 1-cell perimeter wall)
    (function split(x,y,w,h,depth){
      const canH=w>=minR*2+1, canV=h>=minR*2+1;
      if((!canH&&!canV)||depth>6||(depth>1&&w<minR*3&&h<minR*3&&r()<0.35)){if(w>0&&h>0)rooms.push({x,y,w,h});return;}
      let horiz; if(canH&&canV)horiz=(r()<(w/(w+h))); else horiz=canH;
      // the cut lands so BOTH halves are >= minR. The old formula
      // (minR + rand(span-2*minR-1) + 1) could hand the right half minR-1 cells,
      // and at minR=1 it handed it ZERO — an empty room nothing can ever reach.
      if(horiz){const cut=minR+((r()*(w-2*minR))|0); split(x,y,cut,h,depth+1); split(x+cut+1,y,w-cut-1,h,depth+1);}
      else     {const cut=minR+((r()*(h-2*minR))|0); split(x,y,w,cut,depth+1); split(x,y+cut+1,w,h-cut-1,depth+1);}
    })(1,1,W-2,H-2,0);
    // 2) paint grid: everything wall, then stamp room floors
    rooms.forEach((rm,i)=>{for(let y=rm.y;y<rm.y+rm.h;y++)for(let x=rm.x;x<rm.x+rm.w;x++){grid[y][x].g='floor';grid[y][x].room=i;}});
    // 3) door graph: find wall cells separating two rooms, carve a spanning tree
    const at=(x,y)=>(x<0||y<0||x>=W||y>=H)?null:grid[y][x];
    const pairKey=(a,b)=>Math.min(a,b)+','+Math.max(a,b);
    const cand={};   // "a,b" -> [door cells]
    for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){
      if(grid[y][x].g!=='wall')continue;
      const hz=[at(x-1,y),at(x+1,y)], vt=[at(x,y-1),at(x,y+1)];
      for(const [c0,c1] of [hz,vt]){
        if(c0&&c1&&c0.room>=0&&c1.room>=0&&c0.room!==c1.room){
          (cand[pairKey(c0.room,c1.room)]=cand[pairKey(c0.room,c1.room)]||[]).push([x,y]);
        }
      }
    }
    const uf=UF(rooms.length);
    const pairs=Object.keys(cand).sort((a,b)=>{const s=(k)=>{const c=cand[k][0];return c[1]*W+c[0];};return s(a)-s(b);});
    for(const k of pairs){const [a,b]=k.split(',').map(Number);
      if(uf.union(a,b)){const cells=cand[k];carve(...cells[(cells.length>>1)]);}}
    // a few loop doors so it is not a strict tree (still fully reachable)
    for(const k of pairs){if(r()<0.18){const cells=cand[k];const c=cells[(r()*cells.length)|0];if(!grid[c[1]][c[0]].door)carve(...c);}}
    // 4) street entrance: a perimeter door on `entrance` side into the front room
    const front=(()=>{ // room whose edge touches the entrance side, nearest the middle
      let best=null,bd=1e9;const midX=W/2,midY=H/2;
      rooms.forEach((rm,i)=>{let touches,d;
        if(entrance==='S'){touches=(rm.y+rm.h===H-1);d=Math.abs(rm.x+rm.w/2-midX);}
        else if(entrance==='N'){touches=(rm.y===1);d=Math.abs(rm.x+rm.w/2-midX);}
        else if(entrance==='W'){touches=(rm.x===1);d=Math.abs(rm.y+rm.h/2-midY);}
        else {touches=(rm.x+rm.w===W-1);d=Math.abs(rm.y+rm.h/2-midY);}
        if(touches&&d<bd){bd=d;best=i;}});
      return best==null?0:best;})();
    const fr=rooms[front];
    if(entrance==='S')carve(Math.min(W-1,fr.x+(fr.w>>1)),H-1);
    else if(entrance==='N')carve(Math.min(W-1,fr.x+(fr.w>>1)),0);
    else if(entrance==='W')carve(0,Math.min(H-1,fr.y+(fr.h>>1)));
    else carve(W-1,Math.min(H-1,fr.y+(fr.h>>1)));
    // 5) zoning: role by distance from the entrance room (public near door)
    rooms.__front=front; zoneRooms(); delete rooms.__front;
    return {W,H,grid,rooms,doors,meta:{type:'floorplan',zone:o.zone||'default',rooms:rooms.length,doors:doors.length,entrance,
      pending:['wall/floor/door art per zone','furniture per role','multi-floor stacking']}};
  }

  /* ===================================================================================
   * VERTICALITY, THE ENGINE HALF (8/7/26, WORLD lane).
   *
   * Paolo's stated direction is two-and-three-storey buildings with climbable stairs.
   * What existed: floor/wall/door and NOTHING ELSE. `story:2` was computed by the suburb
   * generator, carried faithfully through the world model, and then DIED UNUSED at the
   * bottom rung -- every two-storey house in the valley had exactly one floor inside it.
   * bohemia_garage.js already generates real 2-6 deck structures with ramps and stair
   * cores that nothing renders and nothing walks. The generation was never the missing
   * half; the FLOORPLAN was.
   *
   * WHAT A STORY IS HERE: another full plate. INTERIOR-MATCHES-EXTERIOR (Paolo 7/19,
   * LOCKED, "not having it any other way") applies per level -- every floor of a building
   * is EXACTLY the footprint w x h, never clamped, never grown. Decks and levels are a
   * separate axis; each one still equals the footprint.
   *
   * THE STAIR IS THE ONLY WAY UP, and it is placed where BOTH plates already have floor.
   * That is the whole trick and it is derived, not authored: generate the upper plate
   * first, intersect the two floor sets, and put the stair in the middle of the biggest
   * shared room. A stair chosen on one floor and forced through the other is how you get
   * a staircase arriving inside a wall.
   *
   * BACKWARDS COMPATIBLE ON PURPOSE, and this is not timidity -- world_gate, interiors_gate
   * and the run all read `.grid`, `.rooms` and `.doors` off the returned object today. The
   * ground floor IS the returned object, exactly as before; the stack hangs off it as
   * `.levels`. And a stair cell keeps `g:'floor'` and gains `kind:'stair'` rather than
   * replacing g, because every consumer in the repo tests `g==='floor'||g==='door'` for
   * passability and a new g value would have made stairs IMPASSABLE the day they shipped.
   *
   * NO STREET DOOR UPSTAIRS. An upper plate's perimeter door is removed -- a door on the
   * second storey opening onto thin air is exactly the class of thing this repo keeps
   * shipping and then finding in a render. Rooms up there stay mutually reachable because
   * the door graph is a spanning tree over rooms, which never depended on the street door.
   */
  function floorCells(P){
    const out=[];
    for(let y=0;y<P.H;y++)for(let x=0;x<P.W;x++){
      const c=P.grid[y][x];
      if(c.g==='floor'&&c.room>=0) out.push([x,y,c.room]);
    }
    return out;
  }
  function sealPerimeterDoors(P){
    // an upper floor has no street entrance. Put its perimeter doors back to wall.
    const keep=[];
    for(const d of P.doors){
      const [x,y]=d;
      if(x===0||y===0||x===P.W-1||y===P.H-1){ const c=P.grid[y][x]; c.g='wall'; c.door=false; c.room=-1; }
      else keep.push(d);
    }
    P.doors=keep; P.meta.doors=keep.length; P.meta.entrance=null;
  }
  function sharedStair(lower,upper){
    // cells that are FLOOR on both plates; pick the one deepest inside the biggest
    // shared room, so the stair is never jammed against a wall or across a doorway.
    const up=new Set(floorCells(upper).map(c=>c[0]+','+c[1]));
    const both=floorCells(lower).filter(c=>up.has(c[0]+','+c[1]));
    if(!both.length) return null;
    const byRoom={};
    for(const c of both){ (byRoom[c[2]]=byRoom[c[2]]||[]).push(c); }
    let best=null,bn=0;
    for(const k in byRoom) if(byRoom[k].length>bn){bn=byRoom[k].length;best=byRoom[k];}
    // the cell of that set with the most room-neighbours also in the set = its middle
    const inSet=new Set(best.map(c=>c[0]+','+c[1]));
    let pick=best[0],pn=-1;
    for(const c of best){
      let n=0;
      for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]])
        if(inSet.has((c[0]+dx)+','+(c[1]+dy))) n++;
      if(n>pn){pn=n;pick=c;}
    }
    return pick;
  }
  function generate(seed,W,H,opts){
    const o=opts||{};
    const stories=Math.max(1,Math.min(6,(o.stories|0)||1));
    const ground=plate(seed,W,H,o);
    // A FLOORPLAN HAS TO STAY JSON-SERIALISABLE. `levels=[ground]` made level 0 a pointer
    // back to the object holding the array, and floorplan_gate died on
    // "Converting circular structure to JSON" the first time it ran. Anything that
    // serialises an interior -- a save, a payload, a gate comparing two plans -- would have
    // died the same way. So level 0 is a VIEW: the same grid, rooms and doors arrays by
    // reference (no copy, no second source of truth), in an object that does not contain
    // the level list. The cycle is gone and the identity of the data is not.
    const view=P=>({W:P.W,H:P.H,grid:P.grid,rooms:P.rooms,doors:P.doors,meta:P.meta});
    ground.levels=[view(ground)];
    ground.stairs=[];
    ground.meta.stories=1;
    if(stories<2){ ground.meta.pending=(ground.meta.pending||[]).filter(x=>x!=='multi-floor stacking'); return ground; }

    for(let L=1;L<stories;L++){
      // a different seed per level or every floor is the same floor
      const up=plate((seed>>>0)+L*7919,W,H,o);
      sealPerimeterDoors(up);
      const cell=sharedStair(ground.levels[L-1],up);
      if(!cell) break;                      // no shared floor: this building stops here
      const [sx,sy]=cell;
      const below=ground.levels[L-1].grid[sy][sx], above=up.grid[sy][sx];
      below.kind='stair'; below.stair={dir:'up',to:L};
      above.kind='stair'; above.stair={dir:'down',to:L-1};
      up.meta.level=L;
      ground.levels.push(up);
      ground.stairs.push({x:sx,y:sy,from:L-1,to:L});
    }
    ground.meta.stories=ground.levels.length;
    ground.meta.stairs=ground.stairs.length;
    ground.meta.pending=(ground.meta.pending||[]).filter(x=>x!=='multi-floor stacking');
    return ground;
  }

  return {generate,plate,ZONES};
})();
if(typeof module!=='undefined')module.exports=BOH_FLOORPLAN;
