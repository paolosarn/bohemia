#!/usr/bin/env python3
"""
WIRE THE DEAD INTO THE WALKED WORLD (8/8/26, WORLD lane).

Paolo, 7/31 lore sitting, LOCKED: "We need a lot more corpses a lot more
skeletons in the game... ofc i want a realistic mix of skeletons and husks."
Commissioned direct 8/8: "skeletons in the open, husks in sealed places,
realistic mix, story-via-placement."

engine/bohemia_dead.js decides WHERE every body is and WHAT ten years made of
it. This puts it on the screen, in the tab Paolo actually walks: RUN.

THREE EDITS, ALL IDEMPOTENT:

  1. INLINE engine/bohemia_dead.js into the world page, right after the district
     kit it depends on (ENGINE SYNC LAW: one canonical body; the resync tool
     keeps it fresh from the engine file, exactly like the other ~39 modules).
  2. THE OUTDOOR PASS. deadDraw() runs immediately after tpDraw(), so remains
     lie ON the ground and UNDER every wall, shadow, resident and the player.
     A body is not a wall and must never occlude one.
  3. THE INDOOR PASS. renderInside() gets the husks for the building you walked
     into, drawn after the floor and before the player.

WHY THE OUTDOOR PASS DOES NOT DRAW EVERY BODY, and this is the design not a gap:
a husk sealed in a ROOM is invisible from the street because it is behind a wall,
which is the entire reason it is a husk and not a skeleton. Those are held back
for the indoor pass and land on the same tile there (INTERIOR-MATCHES-EXTERIOR
LAW does the mapping). Husks sealed in CARS draw outdoors -- you can see into a
car, and a car in the Mojave is the most reliable mummifier in the valley.

REUSE CHECK: COOKS ZERO PIXELS (REUSE-FIRST, Paolo 7/22). Every remain drawn is
one of Paolo's own tiles.
  opened slices/BOHEMIA_CITY_TILES.js -> TP_TILES.gore (73 tiles) and reads
    TP_IMG.gore, the decoded images the page already builds at boot. Consumption
    audit 8/6 measured this bank at ZERO draws; it is the largest never-drawn
    approved bank in the game and it is exactly the art this ruling asks for.
  opened banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt -> his Great Sweep
    verdicts. The module restricts itself to UP-only index ranges.
  opened banks/BOHEMIA_GORE_OVERLAY_BANK_7_10_26.txt -> NOT USED. Blood is
    "story-placed by Paolo, hold" and belongs to fresh kills. Ten-year dead do
    not bleed.

  python3 tools/bohemia_city_dead_patch.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

WORLD = 'slices/BOHEMIA_CITY_WORLD.html'
MODULE = 'engine/bohemia_dead.js'
MARK = '/* ==== engine/bohemia_dead.js (inlined verbatim) ==== */'

if not os.path.exists(WORLD):
    sys.exit('DEAD PATCH: %s is not here.' % WORLD)
src = open(WORLD, encoding='utf-8').read()
if MARK in src:
    print('the dead are already wired into the walked world. no-op.')
    sys.exit(0)

mod = open(MODULE, encoding='utf-8').read()

# ---------------------------------------------------------------- 1. INLINE
# after the district kit's own registration tail, which is the last thing the
# module needs to exist. Anchor on the kit's export line, never on a line number.
ANCHOR = '  root.BohemiaDistrictKit=API;'
i = src.find(ANCHOR)
if i < 0:
    sys.exit('DEAD PATCH: could not find the district kit export to inline after.')
j = src.find('\n', i) + 1
# skip past the kit IIFE's closing line so the module lands between modules
j = src.find('\n', j) + 1
src = src[:j] + '\n' + MARK + '\n' + mod + '\n' + src[j:]

# ------------------------------------------------------- 2. THE OUTDOOR PASS
DRAW = r'''
/* ==== THE DEAD, OUTDOORS (8/8, WORLD lane) ==================================
   Paolo 7/31 LOCKED: bleached scattered SKELETONS in the open, mummified HUSKS
   in the sealed places. BohemiaDead decides which and where off each district's
   own legend; this draws it.
   ORDER: called straight after tpDraw, so remains sit ON the ground and UNDER
   the shadow pass, every wall, every resident and the player. A body never
   occludes a building and never hides the man you are steering.
   HELD BACK: husks whose seal is a ROOM. They are behind a wall from out here,
   which is the whole reason they are husks. renderInside draws them, on the same
   tile, because the interior plate IS the footprint (Paolo 7/19, LOCKED). ==== */
/* WHERE A CELL'S LEGEND ACTUALLY LIVES, AND IT IS THREE DIFFERENT PLACES.
   Measured in the running app, not assumed: BohemiaDistrictKit.get('suburb')
   returns NULL here. The suburb is the ONE district inlined before the kit, so
   its registration tail has never run in this app (recorded 8/3 in
   records/BOHEMIA_THE_SUBURB_NEVER_HAD_THE_KIT_8_3_26.md, and deliberately left
   that way -- registering it would change what the walked suburb is generated
   by, which is another lane's measured call, not a side effect of this one).
   Trusting the registry alone meant the biggest district in the valley (2,582
   cells) silently held zero dead, and the feature would have shipped looking
   like it worked everywhere except where Paolo actually walks. */
const DEAD_MODULE={suburb:'BohemiaSuburb', gated:'BohemiaSuburb', estate:'BohemiaSuburb'};
/* ROADS HAVE NO PLOT GRID AT ALL. tileMeta returns early for a road cell -- the
   roadway is drawn procedurally in realizeCell, not stamped from a district. So
   the exodus road gets a SYNTHETIC legend: one code, open ground, everything
   exposed. Skeletons on the asphalt and the shoulder, which is right.
   WHAT IS MISSING AND IS NOT MINE TO FAKE: there are no abandoned CARS on the
   road cells (dead cars exist only as district lot tiles), so the "sealed in the
   cars" half of the freeway story has no surface to land on. The husks are not
   quietly re-routed into the open to pad the number -- the shortfall is real and
   it is reported, because a car layer on the roads is a world job, not a body job. */
const DEAD_ROAD_LEGEND={0:{name:'roadway',kind:'ground'}};
const DEAD_BARE={desert:1, wash:1};          // open terrain you can actually walk on
const DEAD_CACHE=new Map();          // "cx,cy" -> {list, byTile:Map, why}
function deadLegendFor(m){
  if(m.kitSpec&&m.kitSpec.legend) return m.kitSpec.legend;
  const k=(typeof BohemiaDistrictKit!=='undefined')?BohemiaDistrictKit.get(m.d):null;
  if(k&&k.legend) return k.legend;
  const name=DEAD_MODULE[m.d];
  const mod=name&&(typeof window!=='undefined'?window[name]:null);
  if(mod&&mod.legend) return mod.legend;
  return null;
}
function deadForCell(tx,ty){
  const key=tx+','+ty; let e=DEAD_CACHE.get(key); if(e)return e;
  e={list:[],byTile:new Map(),why:''};
  try{
    const m=tileMeta(tx,ty);
    if(m.road||DEAD_BARE[m.d]){
      /* ROADS AND BARE GROUND both come out of tileMeta with no plot grid, and
         both are pure open surface, so they share the synthetic legend.
         DELIBERATELY NOT INCLUDED: mountain and water. realizeCell marks both
         unwalkable, and a body you can never walk up to is a body nobody will
         ever see -- placing them would only inflate a number. The valley's
         weight table still counts those cells, so leaving them empty makes the
         total conservative rather than padded. */
      e.list=BohemiaDead.place({type:m.d, kit:DEAD_ROAD_FLAT, W:FN, H:FN,
        legend:DEAD_ROAD_LEGEND, seed:om.seed, cellX:tx, cellY:ty});
      e.why=m.road?'road':'bare';
    } else {
      const grid=m.kit||m.sub, legend=deadLegendFor(m);
      if(!grid) e.why='no grid';
      else if(!legend) e.why='no legend for '+m.d;
      else { e.list=BohemiaDead.place({type:m.d, kit:grid, W:FN, H:FN,
               legend:legend, seed:om.seed, cellX:tx, cellY:ty}); e.why='ok'; }
    }
    for(const d of e.list) e.byTile.set(d.x+','+d.y,d);
  }catch(err){ e.why='threw: '+err.message; }
  DEAD_CACHE.set(key,e);
  if(DEAD_CACHE.size>64){ const it=DEAD_CACHE.keys(); DEAD_CACHE.delete(it.next().value); }
  return e;
}
const DEAD_ROAD_FLAT=new Uint8Array(FN*FN);   // all zeros: all open roadway
function deadTile(im,dx,dy,C,scale){
  if(!im||!im.complete||!im.naturalWidth)return;
  /* A BODY IS PERSON-SIZED, AND IT KEEPS ITS OWN SHAPE.
     First cut drew these at 0.55 of a cell in a forced SQUARE and I looked at the
     screenshot: two pale specks on the asphalt. Two things were wrong and both
     matter.
     SIZE. A tile is 0.75 m. An adult is about 1.7 m, so a body on the ground
     spans a bit over two tiles -- 0.55 of one is a coin, not a person, and it
     fails the Pocket City bar Paolo set ("everything looks unique enough to know
     what it is at a glance"). Scale comes off the real metre, not off a prop
     flag: his "BIG: render smaller" sweep note was about props standing in a
     room, and a femur is not a sofa.
     ASPECT. These tiles are portrait (17x28, 16x28 -- a figure), and forcing
     them into a square squashed his art by a third. NEVER reshape a judged tile.
     Height carries the scale; width follows the tile's own ratio. */
  const h=C*scale, w=h*(im.naturalWidth/im.naturalHeight);
  g.drawImage(im, Math.round(dx+(C-w)/2), Math.round(dy+(C-h)/2),
                  Math.max(1,Math.round(w)), Math.max(1,Math.round(h)));
}
function deadDraw(ox,oy){
  if(typeof BohemiaDead==='undefined')return;
  const bank=TP_IMG&&TP_IMG[BohemiaDead.TILES.bank]; if(!bank||!bank.length)return;
  const C=HC;
  const fx0=Math.floor(-ox/C)-1, fy0=Math.floor(-oy/C)-1;
  const fx1=fx0+Math.ceil(cv.width/C)+2, fy1=fy0+Math.ceil(cv.height/C)+2;
  const tx0=Math.max(0,(fx0/FN)|0), tx1=Math.min(OM.OVER_N-1,(fx1/FN)|0);
  const ty0=Math.max(0,(fy0/FN)|0), ty1=Math.min(OM.OVER_N-1,(fy1/FN)|0);
  for(let ty=ty0;ty<=ty1;ty++)for(let tx=tx0;tx<=tx1;tx++){
    const e=deadForCell(tx,ty); if(!e.list.length)continue;
    const bx=tx*FN, by=ty*FN;
    for(const d of e.list){
      if(d.interior)continue;                       // behind a wall: indoors draws it
      const fx=bx+d.x, fy=by+d.y;
      if(fx<fx0||fx>fx1||fy<fy0||fy>fy1)continue;
      deadTile(bank[d.tile%bank.length], ox+fx*C, oy+fy*C, C, d.scale);
      /* SCATTER: canid dispersal runs along ONE line and stops. The trailing
         cells carry a smaller fragment of the same remains, not a second body.
         THE DIRECTION COMES OFF THE BODY (d.dir). It used to be re-derived here
         from the tile index -- a different number than the pass used -- so the
         module validated a trail one way and this drew it another, straight
         through walls. Read what was validated; never recompute it. */
      const dd=d.dir||[0,0];
      for(let k=1;k<=d.scatter;k++){
        deadTile(bank[(d.tile+k*7)%bank.length],
                 ox+(fx+dd[0]*k)*C, oy+(fy+dd[1]*k)*C, C, d.scale*0.62);
      }
    }
  }
}
'''
NEED = '  tpDraw(ox,oy);'
if NEED not in src:
    sys.exit('DEAD PATCH: could not find the tpDraw call to draw after.')
src = src.replace(NEED, NEED + '\n  deadDraw(ox,oy);   /* __THE_DEAD__ */', 1)

# put the function bodies just before renderHuman so they exist when it runs
RH = 'function renderHuman(){'
if RH not in src:
    sys.exit('DEAD PATCH: no renderHuman to anchor the draw pass to.')
src = src.replace(RH, DRAW + '\n' + RH, 1)

# -------------------------------------------------------- 3. THE INDOOR PASS
INDOOR = r'''  /* ==== THE DEAD, INDOORS (8/8) ============================================
     The husks held back outdoors. INTERIOR-MATCHES-EXTERIOR LAW (Paolo 7/19,
     LOCKED) means the plate IS the footprint, so a body placed on building tile
     (x,y) out there is standing at (x-foot.x, y-foot.y) in here -- the same
     body, never a second draw of the dice. Drawn after the floor and the walls,
     before the player, so he is never hidden by one. ==== */
  try{
    if(typeof BohemiaDead!=='undefined'&&INSIDE.foot){
      const bank=TP_IMG&&TP_IMG[BohemiaDead.TILES.bank];
      if(bank&&bank.length){
        /* THE FOOTPRINT IS IN WORLD-FINE COORDINATES AND THE DEAD LIST IS IN
           DISTRICT-LOCAL ONES. Rebase, or every husk lands thousands of tiles
           off the plate and silently none of them ever draw -- a whole feature
           reading as "not implemented" because two coordinate spaces were
           spelled the same. */
        const tx=INSIDE.tx, ty=INSIDE.ty;
        const e=deadForCell(tx,ty);
        const f=INSIDE.foot;
        const foot={x:f.x-tx*FN, y:f.y-ty*FN,
                    w:(f.w!=null?f.w:fp.W), h:(f.h!=null?f.h:fp.H)};
        const inn=BohemiaDead.inside(e.list, foot,
          (x,y)=>fp.grid[y]&&fp.grid[y][x]&&fp.grid[y][x].g!=='wall');
        for(const d of inn){
          const sx=ox+d.x*C, sy=oy+d.y*C;
          if(sx<-C||sy<-C||sx>cv.width||sy>cv.height)continue;
          const im=bank[d.tile%bank.length];
          if(im&&im.complete&&im.naturalWidth){
            const w=C*d.scale;
            g.drawImage(im, Math.round(sx+(C-w)/2), Math.round(sy+(C-w)/2), Math.round(w), Math.round(w));
          }
        }
      }
    }
  }catch(err){}
'''
# anchor: the door pass comment inside renderInside, drawn after walls/doors
DOOR_ANCHOR = "  // DOOR PASS, drawn AFTER the walls because a door is TWO TILES TALL"
if DOOR_ANCHOR not in src:
    sys.exit('DEAD PATCH: no interior door pass to anchor the indoor dead to.')
# insert AFTER the whole door loop: find the end of that for-loop block
di = src.find(DOOR_ANCHOR)
# the door loop ends at the first line that closes it back at two-space indent
end = src.find('\n  }\n', di)
if end < 0:
    sys.exit('DEAD PATCH: could not find the end of the interior door pass.')
end = end + len('\n  }\n')
src = src[:end] + INDOOR + src[end:]

open(WORLD, 'w', encoding='utf-8').write(src)
print('THE DEAD ARE IN THE WALKED WORLD.')
print('  inlined %s (%.1f KB)' % (MODULE, len(mod) / 1024.0))
print('  outdoor pass: deadDraw() after tpDraw, under every wall and the player')
print('  indoor  pass: the sealed husks, on the same tile, inside the plate')
print('  drawn from TP_TILES.gore -- his own UP tiles, zero draws before today')
