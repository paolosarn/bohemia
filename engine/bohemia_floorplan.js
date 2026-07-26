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
  const ZONES={
    residential:{roles:['living','kitchen','bed','bed','bath'],minRoom:4},
    retail:     {roles:['shopfloor','checkout','stockroom','office','bath'],minRoom:5},
    office:     {roles:['lobby','office','office','meeting','breakroom','bath'],minRoom:4},
    civic:      {roles:['hall','reception','office','records','bath'],minRoom:5},
    institutional:{roles:['ward','ward','office','service','bath'],minRoom:5},
    warehouse:  {roles:['floor_open','dock','office','bath'],minRoom:8},
    landmark:   {roles:['atrium','gallery','service','bath'],minRoom:6},
    // LEISURE (7/26): the vehicular/venue districts (drivein, golf, stadium,
    // waterpark) declare zone 'leisure' in bohemia_world.js's DISTGEN and were
    // silently falling through to the nameless 'default' grammar — 46 buildings
    // whose recorded dossiers describe real rooms (golf: "pro shop + bag room up
    // front, grill + locker rooms behind"; drivein: "counter + kitchen up front,
    // the projection room behind"; stadium: "the ring corridor under the stands,
    // boarded concession windows + restrooms"). Roles read off those dossiers.
    leisure:    {roles:['concourse','counter','kitchen','locker','restroom','service'],minRoom:5},
    'default':  {roles:['room','room','service'],minRoom:4},
  };
  // union-find for the door spanning tree
  function UF(n){const p=Array.from({length:n},(_,i)=>i);
    const find=i=>{while(p[i]!==i){p[i]=p[p[i]];i=p[i];}return i;};
    return {find,union:(a,b)=>{const ra=find(a),rb=find(b);if(ra!==rb){p[ra]=rb;return true;}return false;}};}

  function generate(seed,W,H,opts){
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
      order.forEach((ri,rank)=>{const role=Z.roles[Math.min(rank,Z.roles.length-1)];
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
  return {generate,ZONES};
})();
if(typeof module!=='undefined')module.exports=BOH_FLOORPLAN;
