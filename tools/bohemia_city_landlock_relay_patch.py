#!/usr/bin/env python3
"""
THE WALKED SURFACE GETS THE RELAY (8/21/26, WORLD lane; WIRED 8/22).

    "make sure I cant be locked in any certain district ever again it's so fucking
     creepy."                                             -- Paolo, 8/1/26

WHAT WAS WRONG. Flooding the canon valley cell to cell -- a pair connects only if a
walkable tile lines up across their shared boundary -- found 357 STRANDED POCKETS
totalling 541 cells that never touch a street. 257 of them SUBURB: one in ten of all
housing in the game, mostly in one- and two-cell pockets. Two houses' worth of
neighbourhood, walled off from the entire valley.

world.js has had a LANDLOCK RELAY for this since 7/21 -- a three-pass BFS that walks a
sealed cell out to a real street through its neighbours, exactly the mechanism the
LANDLOCKED DISTRICT LAW describes. It works. It is well commented. And it never reached
the player, because SLICES/BOHEMIA_CITY_WORLD.HTML DOES NOT CARRY WORLD.JS. The page
inlines the overmap and the district kit and builds its own cells; the relay was real in
the model and absent from the surface a body walks. The proof is that fixing the relay
(8/21, the freeway fix) moved walked_surface reachability by EXACTLY ZERO CELLS.

So the relay moved into bohemia_overmap.js, which the page DOES inline -- one canonical
body, world.js and the page both calling it, neither keeping a copy (ENGINE SYNC LAW).
This tool is the last mile: it makes the page ASK.

WHY THE FIRST THREE ATTEMPTS FAILED, AND IT WAS NEVER THE RELAY (8/22). On 8/21 this
wiring was tried three times and measured three times -- 0% reachable, then 86.0%, then
84.5%, each one buying reach by dropping cells that stopped being drawn by their own
module -- and shipped none of them, because the cause was not understood. It is now, and
it was ONE MISTAKE with three faces:

  EVERY INLINED MODULE ON THIS PAGE IS AN IIFE. bohemia_overmap.js ends
  `})(typeof window!=='undefined'?window:globalThis);` and publishes exactly one name,
  `global.BohemiaOvermap` (the page binds it as OM). MEASURED IN THE BROWSER:
  `typeof census`, `typeof buildOvermap`, `typeof API` and `typeof landlockConnect` are
  ALL 'undefined' at page scope; `typeof OM.landlockConnect` is 'function'.

The old resolver anchored itself before `function census(overmap){` -- which is INSIDE
that IIFE -- and called a bare `landlockConnect`. So the resolver was invisible to the
two call sites that needed it, one scope out. `__subBlock` has no try/catch, so it threw
ReferenceError and took the whole render down: THAT is the 0%. `__kitBlock` wraps its
generate in `catch(e){ g=null; }`, so it swallowed the identical ReferenceError and
handed back an empty grid, which reads downstream as "not drawn by its own module": THAT
is the 86.8%, and the 94.1% is the same thing over the smaller set of cells attempt 3
touched. Three numbers, one cause, and none of them the generator's fault.

PROVEN BEFORE RE-WIRING, by computing the relay in the live page with the page's own
vocabulary and DIFFING THE TWO GRIDS the way the 8/21 record said to:
    relay entries                                   4,432
    built cells with no street of their own          2,035   all 2,035 get an edge
    of those, an edge the ['S'] fallback got wrong    1,566
    suburb grid, ['S'] vs relay edge          2.0-5.1% of tiles differ,
                                              11 distinct codes BOTH ways
A 3% delta with identical code richness is a block whose loop road meets a different
edge. It is not a generator falling over. The relay was never the problem.

WHAT IT PATCHES. The page computes a cell's street edges as "which neighbours are road"
and, finding none, falls back to ['S'] -- so a sealed suburb punches its one gate south
whether or not south leads anywhere. That fallback is why the pockets are pockets: two
cells connect when their arbitrary gates happen to face each other, and the pocket ends
wherever they do not. Both generator call sites now merge the relay's edges in first.

IT DOES NOT RE-EMIT ANY REGION (the rule from 8/21, learned three times in two days: a
patch tool may create a region and update the declarations it writes, never re-emit a
whole region, because it cannot know what else has moved in since). Every edit here is a
narrow, idempotent string swap on a call site.

  python3 tools/bohemia_city_landlock_relay_patch.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

PAGE = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__LANDLOCK_RELAY__'

if not os.path.exists(PAGE):
    sys.exit('LANDLOCK RELAY: %s is not here.' % PAGE)
src = open(PAGE, encoding='utf8').read()
refreshed = MARK in src

if 'function landlockConnect(m, opts)' not in src:
    sys.exit('LANDLOCK RELAY: the page does not carry engine/bohemia_overmap.js\'s '
             'landlockConnect. Run tools/bohemia_city_module_resync.py first -- this tool '
             'wires a call, it does not carry the algorithm.')

# ---------------------------------------------------------------- 1. the resolver
# ONE lazy computation for the whole valley, cached. The BFS is over 9,216 cells and
# runs once per page load, not per cell.
RESOLVER = """
/* ==== __MARK__ ==== */
/* THE RELAY, ON THE SURFACE YOU WALK (8/21 written, 8/22 actually reaching the callers).
   world.js has walked sealed districts out to a street since 7/21 and the page never had
   it, because the page does not carry world.js -- it carries the overmap, which is where
   that algorithm lives now. This asks it once for the whole valley and caches.

   IT LIVES OUT HERE, BESIDE THE TWO CALL SITES, AND IT GOES THROUGH `OM`. Every inlined
   module on this page is an IIFE that publishes one name: the overmap's is
   `global.BohemiaOvermap`, bound here as OM. Measured in the browser, `typeof census`,
   `typeof buildOvermap` and `typeof landlockConnect` are all 'undefined' at this scope
   while `typeof OM.landlockConnect` is 'function'. The 8/21 version of this resolver sat
   INSIDE that IIFE and called a bare `landlockConnect`, so the callers one scope out
   could not see `relayEdges` at all -- __subBlock threw ReferenceError and took the
   render with it (the "0% reachable"), and __kitBlock's catch turned the same
   ReferenceError into a null grid (the "86.8% drawn by its own module"). Two symptoms,
   one scope error. Do not move this inside a module banner.

   isBuilt/familyOf are the PAGE'S vocabulary on purpose, and neither is defaulted in the
   overmap: `isBuilt` is "does this district have a generator HERE" -- the suburb family
   plus anything the kit can build, asked of the kit rather than copied off a list that
   would drift -- and `familyOf` is the suburb family from the LANDLOCKED DISTRICT LAW,
   the same four as world.js's SUBURB_FAMILY. */
var __RELAY=null;
function relayEdges(x,y){
  if(__RELAY===null){
    try{
      __RELAY=OM.landlockConnect(om,{
        isBuilt:function(d){
          if(SUB_RES[d])return true;
          try{ return !!(typeof BohemiaDistrictKit!=='undefined'&&BohemiaDistrictKit.get(d)); }
          catch(e){ return false; }
        },
        familyOf:function(d){
          return (d==='suburb'||d==='gated'||d==='estate'||d==='apartment')?'suburb':d;
        }
      })||{};
    }catch(e){ __RELAY={}; if(typeof console!=='undefined')console.warn('relayEdges',e); }
  }
  var e=__RELAY[x+','+y];
  return (e&&e.length)?e:null;
}
""".replace('__MARK__', MARK)

if MARK not in src:
    # OUTSIDE every module IIFE, immediately above the two call sites that use it, and
    # below `const OM` / `om`. SUB_RES is the suburb path's own declaration, so anchoring
    # on it puts the resolver exactly where both callers can see it.
    anchor = "const SUB_RES={suburb:1,gated:1,estate:1};"
    if src.count(anchor) != 1:
        sys.exit('LANDLOCK RELAY: expected exactly one SUB_RES declaration to land beside, '
                 'found %d. Refusing to guess -- guessing an insertion point is what put '
                 'the 8/21 resolver inside the overmap IIFE where nothing could call it.'
                 % src.count(anchor))
    i = src.index(anchor) + len(anchor)
    src = src[:i] + '\n' + RESOLVER + src[i:]

# ---------------------------------------------------------------- 2. the suburb path
# `st` is "which of my neighbours is a road". Empty -> ['S'], a gate punched south
# whether or not south leads anywhere. THAT fallback is the pocket.
OLD_SUB = "b=BohemiaSuburb.generate(gseed,{cw:1,ch:1,streets:st.length?st:['S']});"
NEW_SUB = ("var __rl=relayEdges(gx*GRP,gy*GRP); if(__rl)__rl.forEach(function(e){ if(st.indexOf(e)<0)st.push(e); });"
           " b=BohemiaSuburb.generate(gseed,{cw:1,ch:1,streets:st.length?st:['S']});")
n_sub = src.count(OLD_SUB)
if n_sub:
    src = src.replace(OLD_SUB, NEW_SUB, 1)

# ---------------------------------------------------------------- 3. the kit path
# ONLY the legs-less branch. A district that arrives WITH legs already had its street
# edges decided by the caller that built those legs (cluster bounds, terrain, rail), and
# overriding somebody else's explicit decision from in here is how two systems start
# disagreeing about the same cell.
OLD_KIT = "else o={streets:st.length?st:['S']};"
NEW_KIT = ("else { var __rk=relayEdges(gx4*GRP,gy4*GRP); if(__rk)__rk.forEach(function(e){ if(st.indexOf(e)<0)st.push(e); });"
           " o={streets:st.length?st:['S']}; }")
n_kit = src.count(OLD_KIT)
if n_kit:
    src = src.replace(OLD_KIT, NEW_KIT, 1)

if not refreshed and not (n_sub or n_kit):
    sys.exit('LANDLOCK RELAY: neither generator call site was found. The page changed '
             'shape; refusing to guess where the streets list is built.')

open(PAGE, 'w', encoding='utf8').write(src)
print('LANDLOCK RELAY: %s -- suburb path %s, kit path %s'
      % ('REFRESHED' if refreshed else 'applied',
         'wired' if n_sub else 'already', 'wired' if n_kit else 'already'))
