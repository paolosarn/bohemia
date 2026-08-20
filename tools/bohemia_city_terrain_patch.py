#!/usr/bin/env python3
"""
TERRAIN REACHED THE SURFACE AND STILL DREW AS A BUILDING. (8/18-8/20, WORLD lane.)

*** WHAT THIS TOOL USED TO BE, AND WHY IT IS HALF THE SIZE NOW. ***
It used to do two jobs: ROUTE terrain through __kitGrid (so a desert cell comes from
engine/bohemia_desert.js instead of ten 2x2 rectangles of flat colour), and then FIX HOW
THE RESULT IS DRAWN. On 8/19-8/20 the OTHER WORLD SESSION shipped the routing half to main
under its own name -- `const KIT_TERRAIN={desert:1,mountain:1,water:1,wash:1}`, its own
branch in tileMeta, its own `legs.terrain` options in __kitBlock, and the generators inlined
on the page. Measured on their page: all four terrain types come from their own modules,
and the valley-wide field still seams (a real neighbour agrees 117/128 along the shared
edge against a 54.7/128 control).

SO THE ROUTING HALF IS DELETED, NOT KEPT AND DISABLED. Two registries of the same four
district names, under two spellings, in one file is not redundancy -- it is the next
person's bug. ONE SYSTEM, ONE SESSION: routing is theirs now and this tool does not touch
it. Everything below reads `KIT_TERRAIN`, their name, so if they add a fifth terrain type
tomorrow the drawing rules follow it with no edit here.

*** WHAT IS LEFT IS THE HALF NOBODY HAS, AND IT IS THE HALF I LEARNED THE HARD WAY. ***
Routing a terrain generator through the DISTRICT path also makes its tiles take the DISTRICT
ART POOLS -- hroof for structure, hyard for ground -- and those pools are built for
buildings and yards. Desert and wash survive it because compacted dirt and concrete are
close to what those pools already serve. MOUNTAIN AND WATER DO NOT. I routed the mountain,
gated it green, and only then LOOKED AT IT: 927 cells of limestone massif rendered as a
checkerboard of BRICKWORK, because bedrock face, ridge crest and cliff band are all
STRUCTURE-layer tiles and this renderer draws structure with building art. The lake came
back with a salmon-pink bed. I reverted both, and the second revert is what turned two
per-district complaints into ONE GENERAL FINDING: terrain had no art mapping of its own.

A GATE WOULD HAVE PASSED IT ALL. The tiles were there, the seam held, walkability improved.
Only opening the picture caught it. That is VERIFY ON THE REAL SURFACE, and it is why the
four edits below exist at all.

THE FOUR, each one a thing that was true for a building and false for the ground:
  5. ROCK IS NOT A ROOF        -- terrain structure stops taking the roof art pool.
  6. CODE 0 IS A REAL TILE     -- the early return that never read the legend. Mountain
                                  code 0 is BEDROCK FACE, 11,486 of 16,384 tiles in a cell.
  7. GROUND SOLIDITY IS PER TILE -- `walk=true` for every ground tile made the whole
                                  reservoir strollable; a tile is walkable because IT says so.
  8. ROCK GETS THE ROCK TEXTURE -- texKindFor has had a 'rock' kind for months and a
                                  structure tile could never reach it. Derived off the kit,
                                  never typed, so a new rock colour needs no edit here.

REUSE CHECK: cooks no pixels, opens no bank, adds no tile and no table. It reaches an
EXISTING texture generator ('rock' in texKindFor) that nothing on the page could call, and
removes an art pool from tiles it was never meant for. The real rock face is still ART's
ask; this is the honest interim and it is not brick.

  python3 tools/bohemia_city_terrain_patch.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

WORLD = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__ROCK_IS_NOT_A_ROOF__'

# THE REGISTRY IS THE OTHER SESSION'S AND IS ONLY READ. If they rename it, every edit below
# is dead code that silently does nothing -- terrain would quietly go back to brickwork with
# every gate still green -- so the name is checked once, here, and the tool refuses rather
# than writing rules that can never fire.
REG = 'KIT_TERRAIN'

ROCK_OLD = "      c.s=pal; c.walk=false; c.artPool='hroof'; c.tint=pal;"
ROCK_NEW = ("      c.s=pal; c.walk=false;\n"
            "      /* __ROCK_IS_NOT_A_ROOF__ -- a cliff band is not a roof. Every structure tile\n"
            "         on this branch was given the ROOF pool tinted to its palette, which is right\n"
            "         for a building and is BRICKWORK for limestone. Terrain structure (bedrock\n"
            "         face, ridge crest, cliff band, a concrete headwall) takes its palette colour\n"
            "         flat instead -- the same fallback this renderer already uses when a pool is\n"
            "         missing. A real rock face is ART's ask; this is the interim, and it is not\n"
            "         brick. Districts are untouched. */\n"
            "      if(!KIT_TERRAIN[d]){ c.artPool='hroof'; c.tint=pal; }")

ZERO_OLD = '''    if(code===0){
      c.g=slotGround(d);'''
ZERO_NEW = '''    /* __TERRAIN_CODE_ZERO_IS_A_REAL_TILE__ -- this branch treated code 0 as "empty ground"
       and RETURNED BEFORE THE LEGEND WAS EVER READ, handing it slotGround(d) (one hard-coded
       colour per district) plus the hyard texture pool. For a DISTRICT that is right: code 0
       is the dead setback and slotGround is exactly what it should be.
       FOR TERRAIN, CODE 0 IS A REAL AUTHORED TILE and it is the most common one in the cell:
         desert:0   desert pavement   #6e6045   (was rendering as generic sand #d8b078)
         wash:0     desert dead-ground #4a422f
         mountain:0 BEDROCK FACE      #5b5346   solid structure, 11,486 of 16,384 tiles
         water:0    OPEN WATER        #2c505c   solid
       So the single biggest thing in a terrain cell never reached the legend, never got its
       own colour, and in the mountain's case never reached the SOLID branch at all. That is
       what made the routed mountain and lake look wrong, and it is why both were reverted:
       the diagnosis was "terrain needs its own art" and the truth was one early return. */
    if(code===0 && !KIT_TERRAIN[d]){
      c.g=slotGround(d);'''

GROUND_OLD = "    c.g=pal; c.walk=true; return c;"
GROUND_NEW = ("    /* __GROUND_SOLIDITY_IS_PER_TILE__ -- the same defect the PROP branch had, one\n"
              "       layer down, and my own occupancy_gate missed it because it only sampled props.\n"
              "       This set walk=true for EVERY ground-layer tile and never looked at tl.solid,\n"
              "       so `water:0 open water` -- which DECLARES solid:true because deep water blocks\n"
              "       a body -- came back 16,384 of 16,384 WALKABLE. The whole reservoir, strollable.\n"
              "       A ground tile is walkable BECAUSE ITS TILE SAYS SO, never because of its layer.\n"
              "       The gate now sweeps every layer instead of one. */\n"
              "    c.g=pal; c.walk=!tl.solid; return c;")

ROCKK_OLD = """function texKindFor(col,isStruct){
  if(isStruct){ if(col==='#3a6a2a')return 'canopy'; return 'roof'; }"""
ROCKK_NEW = """/* __TERRAIN_ROCK_TEXTURE__ -- THE ROCK TEXTURE ALREADY EXISTED AND NOTHING COULD REACH IT.
   texKindFor has had a 'rock' kind for months, but only for NON-structure tiles at two
   hard-coded colours. A STRUCTURE tile returned 'roof' unconditionally, so bedrock face,
   ridge crest and cliff band -- solid structure, all of them -- were drawn with the ROOF
   generator: courses. That is the faint brick pattern that survived after the art pool was
   taken off terrain structure, and it is why a limestone massif still read as masonry.
   THE SET IS DERIVED, NOT TYPED. Every palette colour of a STRUCTURE-layer tile in a
   KIT_TERRAIN district maps to rock, read off the kit at first use. A terrain module that
   adds a new rock colour tomorrow gets the rock texture with no edit here -- and a district
   that is not terrain is untouched, so nothing about a building changes. */
let __TROCK=null;
function __terrainRockCols(){
  if(__TROCK) return __TROCK;
  __TROCK={};
  try{
    const K=(typeof BohemiaDistrictKit!=='undefined')?BohemiaDistrictKit:null;
    if(K) for(const d in KIT_TERRAIN){
      const sp=K.get(d); if(!sp||!sp.legend||!sp.palette) continue;
      for(const cd in sp.legend){
        if(K.tileLayer(sp.legend[cd]).layer!=='structure') continue;
        const col=sp.palette[cd]; if(col) __TROCK[col]=1;
      }
    }
  }catch(e){}
  return __TROCK;
}
function texKindFor(col,isStruct){
  if(isStruct){ if(col==='#3a6a2a')return 'canopy';
    if(__terrainRockCols()[col]) return 'rock';   /* __TERRAIN_ROCK_TEXTURE__ */
    return 'roof'; }"""

if not os.path.exists(WORLD):
    sys.exit('TERRAIN PATCH: %s is not here.' % WORLD)
src = open(WORLD, encoding='utf-8').read()
refreshed = MARK in src

# RE-RUNNABLE, NOT ONE-SHOT. Every edit is REVERSED first (new -> old) so a re-run always
# starts from a pristine page and always ends at today's source. A patch tool that cannot
# re-run is a tool whose output silently freezes at whatever it was the day it shipped.
# REVERSING BY EXACT STRING IS HOW THIS TOOL BROKE THE PAGE ONCE (8/18): the NEW text was
# edited by one comment line, the file's older form no longer matched, the reversal silently
# did nothing, and the forward pass inserted a SECOND declaration -- "Identifier has already
# been declared", whole page dead. That is the payday orphan (8/15) in a different coat: A
# REVERSAL THAT MATCHES ON CONTENT BREAKS THE DAY THE CONTENT CHANGES. It is survivable here
# ONLY because all four edits below are pure REPLACEMENTS of an anchor that still exists --
# a failed reversal leaves the anchor gone, the forward pass then finds nothing, and the tool
# EXITS LOUD instead of duplicating anything. Never add an INSERT to this tool without giving
# it delimiters and cutting by marker.
for _new, _old in ((ROCK_NEW, ROCK_OLD), (ZERO_NEW, ZERO_OLD),
                   (GROUND_NEW, GROUND_OLD), (ROCKK_NEW, ROCKK_OLD)):
    if _new in src:
        src = src.replace(_new, _old, 1)

# THE OTHER SESSION'S REGISTRY HAS TO BE THERE, or every rule below is dead code that reads
# an undefined name and throws inside realizeCell for every tile in the valley.
if REG not in src:
    sys.exit('TERRAIN PATCH: `%s` is not on the page. That registry belongs to the other '
             'WORLD session and everything this tool writes reads it by name. Refusing to '
             'write drawing rules that can never fire -- find what it was renamed to and '
             'change REG at the top of this file.' % REG)

# 5) ROCK IS NOT A ROOF. The structure branch of realizeCell gives EVERY structure tile
#    `artPool:'hroof'` -- roof art, tinted to the tile's palette colour. For a building that
#    is exactly right. For a limestone cliff band it is BRICKWORK with a grey tint, which is
#    what a routed mountain looked like and why the mountain was reverted the first time.
if ROCK_OLD not in src:
    sys.exit('TERRAIN PATCH: could not find the structure branch of realizeCell. Refusing '
             'to guess -- this decides how every solid tile in the game is drawn.')
src = src.replace(ROCK_OLD, ROCK_NEW, 1)

# 6) CODE 0 IS A REAL TILE IN TERRAIN. See the comment in ZERO_NEW.
if ZERO_OLD not in src:
    sys.exit('TERRAIN PATCH: could not find the code-0 early return in realizeCell. '
             'Refusing to guess -- it decides what the most common tile in every cell is.')
src = src.replace(ZERO_OLD, ZERO_NEW, 1)

# 7) A GROUND TILE IS WALKABLE BECAUSE ITS TILE SAYS SO. See the comment in GROUND_NEW.
if GROUND_OLD not in src:
    sys.exit('TERRAIN PATCH: could not find the ground fallthrough in realizeCell. '
             'Refusing to guess -- it decides where a body may stand on every flat tile '
             'in the game.')
src = src.replace(GROUND_OLD, GROUND_NEW, 1)

# 8) ROCK GETS THE ROCK TEXTURE THAT ALREADY EXISTED. See the comment in ROCKK_NEW.
if ROCKK_OLD not in src:
    sys.exit('TERRAIN PATCH: could not find texKindFor. Refusing to guess -- it decides '
             'which generator draws every untextured surface in the game.')
src = src.replace(ROCKK_OLD, ROCKK_NEW, 1)

open(WORLD, 'w', encoding='utf-8').write(src)
print('TERRAIN PATCH: %s -- terrain draws as ground and rock, not as roofs and yards'
      % ('REFRESHED' if refreshed else 'applied'))
print('    routing is the other WORLD session\'s KIT_TERRAIN and is only READ here')
print('    code 0 reaches the legend; a ground tile blocks when its tile says solid;')
print('    terrain structure loses the roof pool and takes the rock texture instead.')
