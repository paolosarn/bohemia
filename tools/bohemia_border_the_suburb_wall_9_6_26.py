#!/usr/bin/env python3
"""
BOHEMIA -- AND THE SUBURB WALL WEARS IT TOO  (COOK, [border marked], round 2, 9/6/26)

ROUND 1 painted the border where a player walks and MEASURED that it reached 78% of it:
346 of 446 sampled border cells have a district kit legend, so the branch that sets the
mark can tell a fence from a window there. 100 of 446 -- 99 suburb and 1 gated -- are
drawn the OLDER PARAMETRIC WAY and carry no legend at all, so the mark never saw them.
That is the suburb. It is where most people live, it is where a garden wall actually is,
and the row is about where a player walks.

THE PARAMETRIC SUBURB ALREADY HAS THE EXACT TILE THIS ROW IS ABOUT, and it has had a name
and a height since 7/27: `v===4`, the PERIMETER WALL, `c.artPool_face='perimeter'`,
wallH 2, its own 13 approved keys, and its own law ("perimeter and building walls never
share a pool", WALL TAXONOMY 7/17). There was never anything to identify -- the branch is
already the one that draws the block wall around a suburb plot. It simply sits on a code
path the kit-legend test could not reach.

AND THE TURF TEST IS FACTORED OUT RATHER THAN COPIED. Round 1 inlined the per-tile memo in
the kit branch. A second copy in the suburb branch is exactly the shape REUSE-FIRST exists
to stop, and the two would drift the first time either was touched -- this file has fixed
that bug under six different names. So it becomes bohTurfEdgeOf(m,tx,ty), memoised on the
tile the same way, and both call sites are three lines that cannot disagree about what a
border is.

NOTHING ABOUT THE MARK CHANGES. Same band (the eighth of the cell that faces the rival, on
that side only), same rate (one face in two), same ink (his measured wardrobe colour), same
draw. The reference check from round 1 stands and is not re-argued here: a boundary mark is
a no-trespassing sign aimed at the other side, on a large plain surface, and a suburb's
block wall is the plainest surface in the valley.

    python3 tools/bohemia_border_the_suburb_wall_9_6_26.py
"""
import os, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CITY = os.path.join(REPO, 'slices/BOHEMIA_CITY_WORLD.html')

# ---- 1. lift the per-tile memo out of the kit branch into one helper ---------------
HELPER_ANCHOR = "var TURF_MAP=null, TURF_MAP_KEY=null;"
HELPER = """/* __THE_BORDER_WEARS_ITS_COLOUR__ ROUND 2 (COOK, 9/6) -- ONE ANSWER TO "IS THIS TILE ON A
   BORDER, AND WHICH SIDE", ASKED ONCE PER TILE AND SHARED BY EVERY DRAW PATH.
   Round 1 inlined this in the district-kit branch, which was fine until the suburb needed
   it too: the suburb is drawn the older parametric way, carries no kit legend, and is 22%
   of the border. A second copy is what REUSE-FIRST exists to stop and the two would drift
   the first time either was touched. Memoised on the tile's own meta object, which is the
   cache the rest of the builder already reads, so a hot chunk asks the turf grid once
   instead of sixteen thousand times. */
function bohTurfEdgeOf(m, tx, ty, fn){
  if(m.__tm!==undefined) return m.__tm;
  m.__tm=null;
  try{
    var _tg=(typeof turfGrid==='function')?turfGrid():null;
    if(_tg&&_tg.own&&_tg.n){
      var _n=_tg.n, _me=_tg.own[ty*_n+tx], _o=_tg.own;
      if(_me){
        m.__tm={ who:_me, ink:bohBorderInk(_me), band:Math.max(4,fn>>3),
          W:!!(tx>0    && _o[ty*_n+tx-1]   && _o[ty*_n+tx-1]!==_me),
          E:!!(tx<_n-1 && _o[ty*_n+tx+1]   && _o[ty*_n+tx+1]!==_me),
          N:!!(ty>0    && _o[(ty-1)*_n+tx] && _o[(ty-1)*_n+tx]!==_me),
          S:!!(ty<_n-1 && _o[(ty+1)*_n+tx] && _o[(ty+1)*_n+tx]!==_me) };
        if(!m.__tm.ink||!(m.__tm.W||m.__tm.E||m.__tm.N||m.__tm.S)) m.__tm=null;
      }
    }
  }catch(_e){}
  return m.__tm;
}
/* AND THE ONE PLACE THAT DECIDES WHETHER A GIVEN CELL IS IN THE BAND FACING THE RIVAL.
   *** THE CHEAP TESTS COME FIRST, AND MEASURING IS WHY. *** The first cut of round 2 asked
   the turf question before the arithmetic ones, and called this for every perimeter-wall
   cell in every suburb tile. MEASURED on the real surface, four interleaved runs of the
   phone-beat gate on the same machine: 42.9% and 51.7% of beats late WITHOUT it, 77.1% and
   77.4% WITH -- non-overlapping, and it is the beat, which is a pillar. The turf answer
   itself was never the cost (only 2 tiles in 144 ever carry the memo on a boot); the cost
   is asking at all, millions of times, on the district the player spawns in.
   So: the HASH rejects half and the POSITION rejects the interior of the tile, both pure
   arithmetic with no lookup, before anything asks who owns the ground. BOH_BORDER_NEAR is
   the pre-test the call sites use so the call itself is skipped, not just shortened. */
function bohBorderNear(lx, ly, fn){
  var b=fn>>3;
  return lx<b||lx>=fn-b||ly<b||ly>=fn-b;
}
function bohBorderMark(m, tx, ty, lx, ly, gx, gy, fn){
  if(((Math.imul(gx,2654435761)^Math.imul(gy,246822507))>>>0)%2!==0) return null;
  if(!bohBorderNear(lx,ly,fn)) return null;
  var t=bohTurfEdgeOf(m,tx,ty,fn); if(!t) return null;
  var b=t.band;
  if(!((lx<b&&t.W)||(lx>=fn-b&&t.E)||(ly<b&&t.N)||(ly>=fn-b&&t.S))) return null;
  return { ink:t.ink, who:t.who,
           v:((Math.imul(gx,374761393)^Math.imul(gy,668265263))>>>0)%3 };
}
var TURF_MAP=null, TURF_MAP_KEY=null;"""

# ---- 2. the kit branch calls the helper instead of carrying its own copy -----------
KIT_OLD = """          if(_plain && ((Math.imul(gx,2654435761)^Math.imul(gy,246822507))>>>0)%2===0){
            /* ASKED ONCE PER TILE, NOT ONCE PER CELL. Whether this overmap cell touches a
               different owner is a fact about the TILE, and a tile is 16,384 cells. The
               answer rides on the tile's own meta object, which is already the cache the
               rest of this builder reads, so a hot chunk asks the turf grid once instead
               of sixteen thousand times. */
            if(m.__tm===undefined){
              m.__tm=null;
              try{
                var _tg2=(typeof turfGrid==='function')?turfGrid():null;
                if(_tg2&&_tg2.own&&_tg2.n){
                  var _tn2=_tg2.n, _me=_tg2.own[ty*_tn2+tx];
                  if(_me){
                    var _o=_tg2.own;
                    m.__tm={ who:_me, ink:bohBorderInk(_me), band:Math.max(4,FN>>3),
                      W:!!(tx>0      && _o[ty*_tn2+tx-1]     && _o[ty*_tn2+tx-1]!==_me),
                      E:!!(tx<_tn2-1 && _o[ty*_tn2+tx+1]     && _o[ty*_tn2+tx+1]!==_me),
                      N:!!(ty>0      && _o[(ty-1)*_tn2+tx]   && _o[(ty-1)*_tn2+tx]!==_me),
                      S:!!(ty<_tn2-1 && _o[(ty+1)*_tn2+tx]   && _o[(ty+1)*_tn2+tx]!==_me) };
                    if(!m.__tm.ink||!(m.__tm.W||m.__tm.E||m.__tm.N||m.__tm.S)) m.__tm=null;
                  }
                }
              }catch(_e){}
            }
            var _tmT=m.__tm;
            if(_tmT){
              var _b=_tmT.band;
              if((lx<_b&&_tmT.W)||(lx>=FN-_b&&_tmT.E)||(ly<_b&&_tmT.N)||(ly>=FN-_b&&_tmT.S))
                c.turfMark={ink:_tmT.ink, who:_tmT.who,
                  v:((Math.imul(gx,374761393)^Math.imul(gy,668265263))>>>0)%3};
            }
          }"""
KIT_NEW = """          if(_plain && bohBorderNear(lx,ly,FN)){
            var _bm=bohBorderMark(m,tx,ty,lx,ly,gx,gy,FN);
            if(_bm) c.turfMark=_bm;
          }"""

# ---- 3. the suburb's own perimeter wall -------------------------------------------
SUB_OLD = "    else if(v===4){ c.s='#6a5c44'; c.walk=false;"
SUB_NEW = """    else if(v===4){ c.s='#6a5c44'; c.walk=false;
      /* __THE_BORDER_WEARS_ITS_COLOUR__ ROUND 2 (COOK, 9/6) -- AND THIS IS THE 22% ROUND 1
         COULD NOT REACH. Measured then: 346 of 446 sampled border cells carry a district
         kit legend and the mark can read them; 100 do not, and 99 of those are SUBURB.
         The suburb is drawn on this older parametric path, so the branch that reads a kit
         legend to tell a fence from a window never sees it -- and the suburb is where most
         people live and where a garden wall actually is.
         NOTHING NEEDED IDENTIFYING. This branch IS the block perimeter wall: its own pool
         since 7/27, its own thirteen approved keys, its own height, and its own law that
         perimeter and building walls never share a pool. It is the plainest large surface
         in the valley, which is the reference's own first rule for where a boundary mark
         goes. Same band, same rate, same ink, same draw as the kit path -- through the
         same one function, so the two can never disagree about what a border is. */
      if(bohBorderNear(lx,ly,FN)){
        var _bmS=bohBorderMark(m,tx,ty,lx,ly,gx,gy,FN);
        if(_bmS) c.turfMark=_bmS;
      }"""


def main():
    src = open(CITY, encoding='utf-8').read()
    if 'bohBorderMark' in src:
        sys.exit('already applied.')
    if 'bohBorderInk' not in src:
        sys.exit('ABORT: round 1 is not in this build; apply the round-1 cook first.')
    for name, old, new in (('the shared helper', HELPER_ANCHOR, HELPER),
                           ('the kit branch', KIT_OLD, KIT_NEW),
                           ('the suburb perimeter wall', SUB_OLD, SUB_NEW)):
        n = src.count(old)
        if n != 1:
            sys.exit('ABORT: %s anchor found %d times, expected 1.' % (name, n))
        src = src.replace(old, new, 1)

    for needle, why in [
        ('function bohTurfEdgeOf(m, tx, ty, fn)', 'the border test is one function now'),
        ('if(_plain && bohBorderNear(lx,ly,FN)){', 'the kit path skips the call on the cheap test'),
        ('      if(bohBorderNear(lx,ly,FN)){', 'the suburb path skips the call on the cheap test'),
        ('if(m.__tm!==undefined) return m.__tm;', 'it is still memoised per tile'),
    ]:
        if needle not in src:
            sys.exit('ABORT: %s -- not true after the substitution.' % why)
    if src.count('m.__tm={ who:') != 1:
        sys.exit('ABORT: the turf test exists more than once; that is the copy REUSE-FIRST forbids.')

    open(CITY, 'w', encoding='utf-8').write(src)
    print('=== AND THE SUBURB WALL WEARS IT TOO (9/6, round 2) ===')
    print('  the border test factored into one function: bohTurfEdgeOf / bohBorderMark')
    print('  the kit path and the suburb perimeter wall both call it')
    print('=== done ===')


if __name__ == '__main__':
    main()
