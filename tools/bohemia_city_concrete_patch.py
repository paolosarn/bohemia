#!/usr/bin/env python3
"""
THE DAM IS DRAWN AS ROOF SHINGLES, AND SO IS EVERY OTHER CONCRETE MASS IN THE GAME.
(8/25, WORLD lane.)

FOUND BY LOOKING AT A PICTURE I TOOK FOR A DIFFERENT REASON. The LOOK shot of the widened
dam crest road came back with the wall either side of it rendered as BRICKWORK -- staggered
courses, shingle seams, the lot. Hoover Dam is an arch-gravity wall of poured concrete. It is
the single largest man-made object on this map and it looked like a roof.

WHY. `texKindFor(col, isStruct)` has exactly three families for anything standing up:

    if (isStruct) { if (col === '#3a6a2a') return 'canopy';
                    if (__terrainRockCols()[col]) return 'rock';
                    return 'roof'; }

`rock` is reachable only through __terrainRockCols(), which sweeps the TERRAIN districts. The
dam is infrastructure. So it falls through to `roof`, whose painter draws 4px shingle bands
with staggered vertical seams -- and so does every concrete mass in the valley that is not in
a terrain district: median barriers, bridge columns, revetments, clarifier walls, silos,
perimeter walls, the fort's adobe curtain wall. This is the same class as "the mountain
shipped as brickwork" that occupancy_gate still carries a warning about.

*** AND THE OBVIOUS FIX IS THE WRONG ONE, WHICH IS THE WHOLE POINT OF THIS FILE. ***
The obvious fix is to add the concrete colours to a set, exactly like __terrainRockCols, and
key the texture off the colour. I measured that before writing it. THE COLOURS DO NOT IDENTIFY
THE MATERIAL: of the 18 palette colours used by concrete masses, only SIX are used by nothing
else. `#9a948a` is the dam wall -- and also a gantry crane, a busbar, a microwave mast, razor
wire and a water tower. `#6a6a72` is the jail's perimeter wall -- and also a hangar, a carport,
a chain-link fence and a signal mast. Keying on colour would have turned twelve unrelated
objects to concrete to fix one, and the picture would have looked worse, not better.

A COLOUR IS NOT AN IDENTITY. The renderer only ever receives a colour, so the decision cannot
be made there -- it has to be made where the tile still knows what it is, which is
realizeCell, holding the district's legend entry. That is exactly where `c.lamp` is decided
(8/21) and exactly where `c.haz` is decided, so this is the third consumer of the same shape:
THE LEGEND NAMES THE THING, THE RENDERER DRAWS WHAT IT IS TOLD.

WHAT IS ROUTED, and it is narrow on purpose. A tile qualifies when its legend says BOTH:
  1. the object IS the mass -- its NAME is wall / pier / column / barrier / silo / dike /
     revetment / culvert / storm drain / arch / anchor block / traverse / facade / bollard /
     pad / clarifier / outlet works / flood structure / transmission main / drying tower; and
  2. the material is concrete / masonry / cinder block / shotcrete / precast. NOT adobe --
     see the note in __concreteTile; mud brick is a different material and gets its own painter.
and it is NOT a roof, canopy, awning or deck.

That second half is what keeps every warehouse, store and office out of it. A tilt-up
warehouse IS built of concrete and its act-1 line says so -- but the face you see from above
is its ROOF, and a roof gets shingles. `commercial:2 store`, `industrial:2 warehouse`,
`warehouse:2 tenant unit`, `medical:2 building` all mention concrete and all correctly stay
roofed, because none of them is NAMED a mass. Measured: 22 tiles across 20 districts route to
concrete, and not one of them is a roofed building.

THE DAM'S WALL IS ENTERABLE ("a gallery inside the dam: wet concrete, a walkway") and it is
typed kind:'building' for that reason, which is correct and stays. `kind` was the other
tempting discriminator and it is also wrong: it would have excluded the dam, which is the
thing this started with.

WHAT CONCRETE ACTUALLY LOOKS LIKE, because a new painter is new art and the 45 law applies.
Mass concrete is placed in LIFTS, and Hoover Dam is the textbook case: 230 interlocking
vertical columns poured in five-foot lifts, so the face carries horizontal FORM LINES where
each lift met the next and widely spaced vertical CONTRACTION JOINTS between columns. The
surface is smooth -- far smoother than rock -- and it is streaked with pale calcium leaching
where water has run down it for decades. The corpus already says this in its own words:
granary:6 is "a concrete silo, joint lines showing where each slipform lift stopped".
So the painter is: low jitter (concrete is smooth, not grainy), horizontal lift lines at a
wide spacing, one vertical contraction joint, and a pale leach streak. NO STAGGER -- the
stagger is what made it read as masonry.

REUSE CHECK (REUSE-FIRST, Paolo 7/22): cooks no bank and opens none. It adds one painter to
the page's existing procedural TEXKIND table, beside grass/dirt/asphalt/paved/roof/rock, and
it deliberately does NOT touch WALL_MAP or SA_MAP -- so any tile that already resolves to
approved art keeps it, because texFor checks those first and returns before it ever asks for
a kind. Nothing approved is overridden.

  python3 tools/bohemia_city_concrete_patch.py
"""
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

WORLD = 'slices/BOHEMIA_CITY_WORLD.html'

BLOCKS = [
    # (marker, anchor, insert-after?, body)
    ('__CONCRETE_IS_NOT_A_ROOF_TEX__',
     "  rock(x,B,r){ for(let py=0;py<TPX;py++)for(let px2=0;px2<TPX;px2++){ x.fillStyle=_jit(B,r,13); x.fillRect(px2,py,1,1); }",
     False,
     """  /* __CONCRETE_IS_NOT_A_ROOF_TEX__ -- MASS CONCRETE, which the game had no painter for at
     all. Everything standing up got canopy, rock or ROOF, and roof draws 4px shingle bands
     with staggered seams -- so the dam, every median barrier, every bridge column and every
     silo in the valley was wearing masonry.
     RESEARCHED, not invented. Mass concrete is placed in LIFTS: Hoover Dam is 230 interlocking
     vertical columns poured in five-foot lifts, so the face carries horizontal FORM LINES where
     one lift met the next, and widely spaced vertical CONTRACTION JOINTS between columns. The
     surface is SMOOTH -- much smoother than rock -- and streaked pale where calcium has leached
     down it for decades. The corpus says it too: granary:6 is "a concrete silo, joint lines
     showing where each slipform lift stopped".
     So: low jitter, a horizontal lift line every 7px, ONE vertical joint, one pale leach run,
     and NO STAGGER, because the stagger is the thing that read as brick. */
  concrete(x,B,r){
    for(let py=0;py<TPX;py++)for(let px2=0;px2<TPX;px2++){ x.fillStyle=_jit(B,r,6); x.fillRect(px2,py,1,1); }
    for(let ly=6;ly<TPX;ly+=7){                                  /* THE LIFT LINES */
      x.fillStyle=_rgb(B[0]-16,B[1]-15,B[2]-14); x.fillRect(0,ly,TPX,1);
      x.fillStyle=_rgb(B[0]+13,B[1]+13,B[2]+12); x.fillRect(0,ly+1,TPX,1); }
    const vj=2+((r()*(TPX-4))|0);                                /* ONE contraction joint */
    x.fillStyle=_rgb(B[0]-19,B[1]-18,B[2]-17); x.fillRect(vj,0,1,TPX);
    for(let k=0;k<2;k++){                                        /* calcium leaching, running DOWN */
      const sx=(r()*TPX)|0, sy=(r()*(TPX>>1))|0, sh=(TPX>>1)+((r()*(TPX>>1))|0);
      x.fillStyle=_rgb(Math.min(255,B[0]+21),Math.min(255,B[1]+21),Math.min(255,B[2]+19));
      x.fillRect(sx,sy,1,Math.min(sh,TPX-sy)); }
    x.fillStyle=_rgb(Math.min(255,B[0]+17),Math.min(255,B[1]+17),Math.min(255,B[2]+15));
    x.fillRect(0,0,TPX,1);                                       /* the sky-lit top edge (45 LAW) */
    x.fillStyle=_rgb(B[0]-21,B[1]-20,B[2]-19); x.fillRect(0,TPX-1,TPX,1);
  },
  /* STEEL, and it is a different problem from concrete in one specific way: metal is SPECULAR.
     Concrete scatters light evenly and reads as a smooth field; steel has a bright edge where a
     rib catches the sky and a dark one where the next rib turns away, and that alternation is
     most of what tells you it is metal at all.
     WHAT IS ACTUALLY OUT THERE, and this covers both halves of the population: corrugated sheet
     (a silo, a shed wall, a tank shell) is PARALLEL RIBS at a tight pitch, and structural steel
     (a gantry crane, a switchgear lattice, a catwalk) is linear members with sky between them.
     At 44px both read the same way -- regular parallel lines with a specular edge -- so one
     painter serves, which is why this is a row in the table and not a second mechanism.
     AND IT IS TEN YEARS DEAD. The thing that makes abandoned steel unmistakable is not the
     metal, it is the RUST RUNS: orange-brown streaks bleeding DOWNWARD from every fastener and
     seam, because water carries the oxide down the face. Derived from the tile's own colour
     rather than a fixed orange, so a galvanised silo and a painted crane both stain in their
     own register instead of every steel object in the valley going the same shade. */
  steel(x,B,r){
    for(let py=0;py<TPX;py++)for(let px2=0;px2<TPX;px2++){ x.fillStyle=_jit(B,r,9); x.fillRect(px2,py,1,1); }
    for(let rx=0;rx<TPX;rx+=3){                                  /* THE RIBS */
      x.fillStyle=_rgb(Math.min(255,B[0]+25),Math.min(255,B[1]+26),Math.min(255,B[2]+27));
      x.fillRect(rx,0,1,TPX);                                    /* the sky-caught edge */
      x.fillStyle=_rgb(B[0]-22,B[1]-22,B[2]-21);
      x.fillRect(rx+1,0,1,TPX); }                                /* the turn away from it */
    for(let k=0;k<3;k++){                                        /* RUST, running DOWN */
      const sx=(r()*TPX)|0, sy=(r()*(TPX-4))|0, sh=3+((r()*(TPX-sy))|0);
      const g0=(B[0]+B[1]+B[2])/3;
      x.fillStyle=_rgb(Math.min(255,(g0*0.86+52)|0),(g0*0.52+18)|0,(g0*0.30+8)|0);
      x.fillRect(sx,sy,1,Math.min(sh,TPX-sy));
      if(r()<0.5) x.fillRect(sx+1,sy+1,1,Math.max(1,(sh*0.6)|0)); }
    for(let k=0;k<4;k++){                                        /* fasteners, where the rust starts */
      x.fillStyle=_rgb(B[0]-30,B[1]-30,B[2]-28); x.fillRect((r()*TPX)|0,(r()*TPX)|0,1,1); }
    x.fillStyle=_rgb(Math.min(255,B[0]+20),Math.min(255,B[1]+21),Math.min(255,B[2]+22));
    x.fillRect(0,0,TPX,1);                                       /* the sky-lit top edge (45 LAW) */
    x.fillStyle=_rgb(B[0]-24,B[1]-24,B[2]-22); x.fillRect(0,TPX-1,TPX,1);
  },
  /* CHAIN-LINK, AND THE POINT OF IT IS WHAT IS **NOT** DRAWN. Every other painter here fills
     the tile; this one leaves most of it EMPTY, and the ground the renderer already drew
     underneath shows straight through. That is not a trick -- it is what a chain-link fence
     IS, and it is why a fence has never read as a fence in this game: a solid band of shingles
     ringing a district is a WALL, whatever the legend calls it.
     WHAT YOU ACTUALLY SEE, from the world's three-quarter view: the DIAMOND MESH as a haze of
     fine diagonals crossing both ways, the TOP RAIL as the one solid line (it is the only part
     of a chain-link fence that reads at distance, which is why every photograph of one is a
     bright horizontal line over a grey blur), and the POSTS as verticals at a regular bay.
     AND IT IS TEN YEARS DEAD, which every one of these legends says out loud -- "wire sagging",
     "sagging, some down", "cut through in places", "pushed over where the last flood shoved a
     tree into it". So a bay is sometimes simply GONE: no mesh, just the posts and the rail, and
     the ground of the district on the other side. */
  chainlink(x,B,r){
    const M=[Math.min(255,B[0]+34),Math.min(255,B[1]+35),Math.min(255,B[2]+36)];
    const gone=r()<0.22;                                          /* this bay is down */
    if(!gone){
      x.globalAlpha=0.44;                                         /* THE MESH, a haze not a wall */
      x.fillStyle=_rgb(M[0],M[1],M[2]);
      for(let k=-TPX;k<TPX*2;k+=4){
        for(let i=0;i<TPX;i++){ const px2=k+i;
          if(px2>=0&&px2<TPX) x.fillRect(px2,i,1,1);              /* one diagonal */
          const qx=k-i+TPX;
          if(qx>=0&&qx<TPX) x.fillRect(qx,i,1,1); }               /* and the other */
      }
      x.globalAlpha=1;
    }
    /* ONE POST, SOMETIMES, AND THAT IS A SCALE FACT NOT A STYLE CHOICE. The first cut drew a
       post every 11 texture pixels, which is FOUR POSTS PER TILE -- one every 19 centimetres.
       A chain-link line post is every 3 m. A tile is 0.75 m, so a post belongs in roughly one
       tile in four, not four times in one. Caught by looking at the picture; the arithmetic was
       there to be done and I had not done it.
       (The mesh pitch was right by luck and is right on purpose now: 44 px across 0.75 m is
       17 mm a pixel, and a 50 mm chain-link diamond is three of them. A 4 px lattice it is.) */
    if(r()<0.28){
      const px2=2+((r()*(TPX-4))|0);
      x.fillStyle=_rgb(B[0]+10,B[1]+10,B[2]+10); x.fillRect(px2,0,1,TPX);
      x.fillStyle=_rgb(B[0]-28,B[1]-28,B[2]-26); x.fillRect(px2+1,0,1,TPX); }
    x.fillStyle=_rgb(Math.min(255,M[0]+16),Math.min(255,M[1]+16),Math.min(255,M[2]+15));
    x.fillRect(0,1,TPX,1);                                        /* THE TOP RAIL, sky-lit (45 LAW) */
    x.fillStyle=_rgb(B[0]-30,B[1]-30,B[2]-28); x.fillRect(0,2,TPX,1);
    for(let k=0;k<2;k++){                                         /* rust off the fittings */
      const sx=(r()*TPX)|0, sy=1+((r()*(TPX-6))|0), g0=(B[0]+B[1]+B[2])/3;
      x.globalAlpha=0.6;
      x.fillStyle=_rgb(Math.min(255,(g0*0.84+50)|0),(g0*0.50+16)|0,(g0*0.28+7)|0);
      x.fillRect(sx,sy,1,2+((r()*5)|0)); x.globalAlpha=1; }
  },
  /* ADOBE. Not concrete, and the difference is the whole reason this is its own row.
     Poured concrete is placed in LIFTS and leaches CALCIUM; adobe is BRICK, laid in courses, and
     it does not leach, it MELTS. A mud brick is earth and straw dried in the sun, and what a
     century and a half of weather does to it is round every edge off -- the courses slump, the
     corners go soft, and where rain has run there are shallow vertical runnels washed into the
     face. The fort's own legend says it: "mud brick under a century of weather, slumped in two
     places", and the building beside it is "THE original adobe building -- the oldest standing
     structure in the valley".
     SO: NO STRAIGHT LINES. Paolo 8/1, about hair, and it is the same law -- a course line here
     wobbles a pixel because a hand-laid mud course does. No specular anywhere: adobe is the
     least reflective surface in the game, which is what separates it from steel at a glance,
     and it is warmer and grainier than concrete, which separates it from that. */
  adobe(x,B,r){
    for(let py=0;py<TPX;py++)for(let px2=0;px2<TPX;px2++){ x.fillStyle=_jit(B,r,13); x.fillRect(px2,py,1,1); }
    for(let cy=5;cy<TPX;cy+=6){                                  /* THE COURSES, and they wobble */
      let yy=cy;
      for(let px2=0;px2<TPX;px2++){
        if(r()<0.16) yy+=(r()<0.5?-1:1);                          /* laid by hand, not a ruler */
        if(yy<0)yy=0; if(yy>=TPX)yy=TPX-1;
        x.fillStyle=_rgb(B[0]-21,B[1]-19,B[2]-16); x.fillRect(px2,yy,1,1);
        x.fillStyle=_rgb(Math.min(255,B[0]+11),Math.min(255,B[1]+9),Math.min(255,B[2]+6));
        x.fillRect(px2,yy+1,1,1); }
    }
    for(let k=0;k<2;k++){                                        /* rain runnels, washed IN */
      const sx=(r()*TPX)|0, sy=(r()*(TPX>>1))|0;
      x.fillStyle=_rgb(B[0]-15,B[1]-14,B[2]-12);
      x.fillRect(sx,sy,1,Math.min(TPX-sy,(TPX>>1)+((r()*(TPX>>1))|0))); }
    for(let k=0;k<3;k++){                                        /* where a brick has gone */
      const sx=(r()*(TPX-3))|0, sy=(r()*(TPX-3))|0;
      x.fillStyle=_rgb(B[0]-27,B[1]-25,B[2]-21); x.fillRect(sx,sy,2+((r()*2)|0),2); }
    x.fillStyle=_rgb(Math.min(255,B[0]+15),Math.min(255,B[1]+13),Math.min(255,B[2]+9));
    x.fillRect(0,0,TPX,1);                                       /* the sun on top (45 LAW) */
    x.fillStyle=_rgb(B[0]-20,B[1]-18,B[2]-15); x.fillRect(0,TPX-1,TPX,1);
  },
/* __CONCRETE_IS_NOT_A_ROOF_TEX__ END */
"""),

    ('__CONCRETE_IS_NOT_A_ROOF_PICK__',
     "function texFor(col,isStruct,variant){",
     False,
     """/* __CONCRETE_IS_NOT_A_ROOF_PICK__ -- THE MATERIALS TABLE. A COLOUR IS NOT AN IDENTITY, so
   the choice is made where the tile still knows what it is (realizeCell, holding the legend)
   and carried on the cell as `c.sTex`. Measured before choosing this: of the 18 palette colours
   worn by concrete masses, only SIX are worn by nothing else -- #9a948a is the dam wall AND a
   gantry crane, a busbar, a microwave mast, razor wire and a water tower. Keying the texture
   off the colour, which is what __terrainRockCols does, would have re-skinned twelve unrelated
   objects to fix one. Same shape as c.lamp and c.haz: the legend names the thing, the renderer
   draws what it is told.
   ONE TABLE, MANY MATERIALS (FACTORY LAW). Adding a material is a row, not a new mechanism.
   Rows are tried in order and the FIRST match wins, so the specific sits above the general. */
var MATERIALS=[
  /* [material, the object IS this mass (matched on the NAME), the material text, a veto] */
  /* ADOBE SITS ABOVE CONCRETE ON PURPOSE. "adobe wall" matches the concrete row's NAME pattern
     (\bwall\b), so if concrete came first the fort would be poured concrete -- which is the
     exact lie this row exists to stop. First match wins, so the specific goes above the
     general, and that ordering is asserted by the gate.
     It was pulled OUT of concrete on 8/25 because I could not photograph the fort to check.
     tools/bohemia_material_peek.js is why it can come back: mud brick now has its own painter
     and its own picture. */
  ['adobe',
   /\\bwall\\b|\\bbuilding\\b|bastion|parapet/i,
   /adobe|mud ?brick|\\bcob\\b/i,
   null],
  ['concrete',
   /\\bwall\\b|\\bpier\\b|\\bcolumn\\b|barrier|\\bsilo\\b|\\bdike\\b|revetment|culvert|storm drain|\\barch\\b|anchor block|traverse|facade|bollard|\\bpad\\b|clarifier|outlet works|flood structure|transmission main|drying tower/i,
   /concrete|masonry|cinder ?block|\\bcmu\\b|shotcrete|gunite|precast|reinforced/i,
   null],
  /* STEEL IS NAMED BY THE OBJECT, NOT BY THE WORD. Concrete legends say "concrete"; steel
     legends mostly do not -- railyard:13 is "the container gantry crane spanning the stack,
     rails, legs, a seized hoist trolley" and never uses the word. So the rule is the set of
     objects that are steel BY DEFINITION: there is no other material a container gantry, a
     switchgear lattice, a catwalk, a conveyor run or a W-beam guardrail is made of. Every one
     of the 25 was read and eyeballed before it went in this list.
     AND THE VETO EARNS ITS KEEP HERE: "screen tower" is a rock screen at the quarry and a
     MOVIE SCREEN at the drive-in. One name, two objects, and one of them is a painted sheet
     that must not become corrugated steel. Vetoed by name. */
  /* CHAIN-LINK, AND IT IS THE FIRST MATERIAL HERE THAT IS MOSTLY NOT THERE. A fence you cannot
     see through is not a fence, it is a wall -- and every perimeter fence in the valley has
     been a solid band of house shingles ringing every district. This is the biggest population
     of the three: 32 of them, in nearly every district that has a boundary at all.
     MATCHED ON THE NAME, AND THE NAME MUST NOT SAY WALL. `prison:12 administration` mentions a
     fence in its act-1 line and is a BUILDING; `suburb:4 wall` is "block perimeter wall, tan
     stucco"; `courthouse:20 secure yard wall` is masonry with wire on top. All three stay out,
     and all three would have come in on an act-1 match. minigp:12 "tyre barrier" is a stack of
     tyres and is neither -- it waits for its own row. */
  ['chainlink',
   /fence|chain.?link|\\bmesh\\b/i,
   /./,
   /\\bwall\\b|stucco|masonry|\\btyre\\b|\\btire\\b|razor/i],
  ['steel',
   /gantry crane|catwalk|pipe gallery|pipe rack|pipe manifold|switchgear|busbar|conveyor|hoist|derrick|guardrail|water tank|surge tank|storage tank|headframe|screen tower|lattice|\\bmast\\b|scaffold|trestle|hopper|vent stack|calciner stack|crushed-car stack|\\bcrane\\b|\\bsilo\\b/i,
   /./,
   /movie|projection|picture|concrete|adobe/i]
];
function __materialOf(entry){
  if(!entry) return null;
  var n=String(entry.name||''), txt=n+' '+String(entry.act1||'');
  if(/roof|canopy|awning|shingle|\\bdeck\\b/i.test(txt)) return null;
  for(var i=0;i<MATERIALS.length;i++){
    var M=MATERIALS[i];
    if(M[3]&&M[3].test(txt)) continue;
    /* THE OBJECT MUST BE THE MASS. A tilt-up warehouse is made of concrete and says so, but the
       face you see from above is its ROOF -- so `store`, `warehouse`, `tenant unit`, `building`
       stay shingled, because none of them is NAMED a mass. */
    if(M[1].test(n)&&M[2].test(txt)) return M[0];
  }
  return null;
}
/* ADOBE CAME BACK, WITH ITS OWN PAINTER AND ITS OWN PICTURE. It was pulled out of the concrete
   row on 8/25 because I could not photograph the fort to check, and shipping a material you
   have not looked at is how the last one nearly went wrong. It has a row of its own now, above
   concrete so "adobe wall" cannot fall into it. */
function __concreteTile(entry){ return __materialOf(entry)==='concrete'; }
/* __CONCRETE_IS_NOT_A_ROOF_PICK__ END */
"""),

    ('__CONCRETE_IS_NOT_A_ROOF_SET__',
     "    if(__lampTile(entry)){",
     False,
     """    /* __CONCRETE_IS_NOT_A_ROOF_SET__ -- stamp the material on the cell while the legend is
       still in hand. One line, and it is the only place in the pipeline that knows this tile
       is a dam wall rather than a colour that a water tower also happens to wear -- and now it
       is also the only place that knows a gantry crane is steel rather than a shade of grey a
       dam also wears. */
    var _mat=__materialOf(entry); if(_mat) c.sTex=_mat;
/* __CONCRETE_IS_NOT_A_ROOF_SET__ END */
"""),
]

# THE POOL SITE -- and this is the one that actually mattered.
#
# I SHIPPED A WRONG CAUSE YESTERDAY AND THIS IS THE CORRECTION. The 8/25 record said the dam
# fell through texKindFor to the procedural `roof` painter. It does not. It never reaches
# texKindFor at all: realizeCell hands every structure tile in every non-terrain district the
# APPROVED HOUSE-ROOF ART POOL --
#
#     if(!KIT_TERRAIN[d]){ c.artPool='hroof'; c.tint=pal; }
#
# -- and texFor returns that art before any procedural kind is asked for. So the dam was not
# wearing a generated shingle pattern, it was wearing Paolo's actual approved house roof
# tiles, tinted grey. Measured on the page at the camera position of the photograph:
# artPool='hroof' on every wall tile. The procedural painter above is still the right thing to
# have, and it is what draws now, but on its own it changed NOTHING and the retaken picture was
# pixel-identical. A FIX THAT CHANGES NO PIXELS IS NOT A FIX; the picture is what caught it.
#
# THE LINE ALREADY HAD THIS EXACT ARGUMENT WON ONCE. Its own comment is __ROCK_IS_NOT_A_ROOF__:
# "a cliff band is not a roof... which is right for a building and is BRICKWORK for limestone."
# It even names "a concrete headwall" in its list of what should be exempt -- and then exempts
# only the TERRAIN districts. This is the same sentence finished.
#
# HEIGHT IS COUPLED TO THIS FLAG and that is the trap in removing it: the shadow pass reads
# `c.wallH || ((c.face || c.artPool==='hroof') ? WALL_H : 1)`, so dropping the pool would drop
# a dam wall's shadow from three tiles to one. WALLS ARE TWO TALL (Paolo 8/2, LOCKED: "all
# walls should at least be two tiles tall from fencing to concrete to brick whatever"). So the
# height is set explicitly and stays exactly what it is today: this changes what a thing is
# MADE OF, not how tall it is.
POOL_OLD = "      if(!KIT_TERRAIN[d]){ c.artPool='hroof'; c.tint=pal; }"
POOL_NEW = ("      /* __CONCRETE_IS_NOT_A_ROOF_POOL__ -- and neither is a dam. The line below hands the\n"
            "         APPROVED HOUSE-ROOF ART to every structure tile in every non-terrain district, so\n"
            "         the largest man-made object on this map was wearing house shingles. Its own\n"
            "         comment already made this argument for limestone and even names \"a concrete\n"
            "         headwall\"; this finishes the sentence for the material it named.\n"
            "         THE HEIGHT IS SET EXPLICITLY because the shadow pass keys off this very flag\n"
            "         (wallH || (face || artPool==='hroof') ? WALL_H : 1). WALLS ARE TWO TALL, Paolo\n"
            "         8/2 LOCKED -- 'from fencing to concrete to brick whatever'. Nothing gets shorter. */\n"
            "      if(!KIT_TERRAIN[d]&&!__materialOf(entry)){ c.artPool='hroof'; c.tint=pal; }\n"
            "      else if(!KIT_TERRAIN[d]&&!c.wallH){ c.wallH=WALL_H; }")

# THE DRAW SITE. A pure replacement of an anchor that still exists, so a failed reversal
# cannot duplicate it -- the anchor goes missing and this exits loud.
DRAW_OLD = "      else x.drawImage(texFor(c.s,true,v),i2*TPX,y*TPX);"
DRAW_NEW = ("      /* __CONCRETE_IS_NOT_A_ROOF_DRAW__ -- a cell that named its own material gets it.\n"
            "         AFTER the approved-art branches above on purpose: anything that resolves to a\n"
            "         judged pool (artPool / WALL_MAP / SA_MAP) keeps it, because those return before\n"
            "         this line is ever reached. This only catches what was falling through to the\n"
            "         procedural default, which for every concrete mass in the game was ROOF. */\n"
            "      else if(c.sTex) x.drawImage(texForKind(c.sTex,c.s,v),i2*TPX,y*TPX);\n"
            "      else x.drawImage(texFor(c.s,true,v),i2*TPX,y*TPX);")

# texForKind must be able to hand back a procedural kind by name.
KIND_OLD = "function texForKind(kind,col,variant){"
KIND_NEW = ("function texForKind(kind,col,variant){\n"
            "  /* __CONCRETE_IS_NOT_A_ROOF_KIND__ -- a caller may now ask for a procedural family BY\n"
            "     NAME (c.sTex), rather than only by the colour lookup texKindFor does. Approved art\n"
            "     still wins: the WALL_MAP / house-stamp branches below run first and return. */\n"
            "  if(kind&&TEXKIND[kind]&&kind!=='wall'){\n"
            "    const _k='K'+kind+'|'+col+'|'+variant; let _t=_texCache.get(_k); if(_t)return _t;\n"
            "    const _c=document.createElement('canvas'); _c.width=TPX; _c.height=TPX;\n"
            "    const _x=_c.getContext('2d');\n"
            "    let _s=(OM.hash2(variant*31+7,col.charCodeAt(1)*13+col.charCodeAt(5),20260825))>>>0;\n"
            "    const _r=()=>{_s=(_s*1664525+1013904223)>>>0; return _s/4294967296;};\n"
            "    TEXKIND[kind](_x,_hex(col),_r); _texCache.set(_k,_t=_c); return _t;\n"
            "  }")

if not os.path.exists(WORLD):
    sys.exit('CONCRETE PATCH: %s is not here.' % WORLD)
src = open(WORLD, encoding='utf-8').read()
refreshed = BLOCKS[0][0] in src

for mark, anchor, after, body in BLOCKS:
    # CUT BY MARKER, every occurrence, however many there are. Never by content.
    pat = re.compile(r'[ \t]*/\* ' + re.escape(mark) + r'.*?' + re.escape(mark) + r' END \*/\n', re.S)
    src, _n = pat.subn('', src)
    if src.count(anchor) != 1:
        sys.exit('CONCRETE PATCH: anchor is not unique (%d hits): %s' % (src.count(anchor), anchor))
    src = src.replace(anchor, (anchor + '\n' + body.rstrip('\n')) if after
                      else (body.rstrip('\n') + '\n' + anchor), 1)

if DRAW_NEW in src:
    src = src.replace(DRAW_NEW, DRAW_OLD)
if src.count(DRAW_OLD) != 1:
    sys.exit('CONCRETE PATCH: the structure draw line is not unique (%d hits). Refusing to '
             'guess -- it draws every standing object in the game.' % src.count(DRAW_OLD))
src = src.replace(DRAW_OLD, DRAW_NEW, 1)

# REVERSE BY MARKER, NEVER BY CONTENT -- the lesson this repo has already paid for twice, and
# it bit again the moment the rule inside this block changed from __concreteTile to
# __materialOf: `if POOL_NEW in src` was false, so nothing reversed, and the anchor was already
# gone. A marker survives every edit to the thing it wraps; a content match survives none.
_pool_pat = re.compile(
    r'[ \t]*/\* __CONCRETE_IS_NOT_A_ROOF_POOL__.*?\n[ \t]*if\(!KIT_TERRAIN\[d\]&&![^\n]*\n'
    r'[ \t]*else if\(!KIT_TERRAIN\[d\]&&!c\.wallH\)\{ c\.wallH=WALL_H; \}\n', re.S)
src, _pn = _pool_pat.subn(POOL_OLD + '\n', src)
if src.count(POOL_OLD) != 1:
    sys.exit('CONCRETE PATCH: the hroof assignment is not unique (%d hits). Refusing to guess '
             '-- it decides the material of every standing object in every district.'
             % src.count(POOL_OLD))
src = src.replace(POOL_OLD, POOL_NEW, 1)

if KIND_NEW in src:
    src = src.replace(KIND_NEW, KIND_OLD)
if src.count(KIND_OLD) != 1:
    sys.exit('CONCRETE PATCH: texForKind is not unique (%d hits).' % src.count(KIND_OLD))
src = src.replace(KIND_OLD, KIND_NEW, 1)

open(WORLD, 'w', encoding='utf-8').write(src)
print('CONCRETE PATCH: %s' % ('REFRESHED' if refreshed else 'applied'))
print('    the materials table routes CONCRETE and STEEL out of the approved HOUSE ROOF art')
print('    routed by the LEGEND, never by the colour: 12 of 18 concrete colours are shared')
print('    with a gantry crane, a busbar, razor wire, a hangar, a fence, a water tower...')
