#!/usr/bin/env python3
"""
LOOKING AT THE MAP IS NOT TRAVELLING
(8/27/26, RUN lane. His report, and I made it worse yesterday.)

    "how come in the run like it wants to keep spawning me like outside of like
     my starter Neighbourhood it's so confusing like I'll just throw me some
     randomly on the map it's it's really weird bro."

REPRODUCED ON THE REAL SURFACE, with real touch:

    standing                 tile 6205,6271   cell [48,48]   marker [48,48]
    pinch out to the map     tile 6205,6271   cell [48,48]   marker [48,48]
    three taps on the pad    tile 6205,6271   cell [48,48]   marker [49,48]
    pinch back in            tile 6336,6208   cell [49,48]   HE MOVED 194 TILES

*** HE LOOKED AT THE MAP AND CAME BACK 194 TILES FROM WHERE HE WAS STANDING. ***

WHY, AND THERE ARE TWO HALVES:

1. THE PAD DOES NOT MEAN THE SAME THING AT BOTH ZOOMS. Zoomed out, the movement
   pad is still there, in the same corner, under the same thumb -- and a press
   moves the MARKER a whole overmap cell (96 metres) and spends TEN MINUTES of
   his day. Nothing on screen distinguishes that from walking. Three taps moved
   him one cell; he never asked to go anywhere.

2. AND COMING BACK NEVER RETURNED HIM TO HIS BODY. swapMode's city->human branch
   opens by THROWING AWAY where he was standing:

       hx=city.x*FN+(FN>>1); hy=city.y*FN+(FN>>1);

   the centre of the marker cell, then a spiral of up to FN rings hunting for a
   road-touching tile. That is correct for TRAVEL -- you moved the marker, you
   arrive somewhere -- and it is completely wrong for a LOOK.

*** AND I MADE THIS WORSE YESTERDAY. *** Before 8/26 you had to deliberately
press DROP IN to cross the seam, so this cost you something only when you asked
for it. THE ACTION BUTTON DOES ACTIONS made zoom the primary way in and out --
correctly, it is his ruling -- which means every single glance at the map is now
a round trip through that landing code. A change can be right and still hand a
latent bug a much bigger audience.

=== THE FIX =================================================================

HIS BODY STAYS WHERE HIS BODY IS. Leaving the walked world remembers the exact
tile he left from. Coming back:

    the marker is still on the cell he left  ->  HE WAS LOOKING. Put him back on
                                                 the exact tile, no centring, no
                                                 spiral.
    the marker is on a different cell        ->  HE TRAVELLED. The existing
                                                 centre-and-spiral landing is
                                                 right and is untouched.

THE PATTERN IS ALREADY IN THE FILE and is not invented here: the VISTA does
exactly this with returnTo {hx,hy,mode,cx,cy} -- go and look at something, come
back to your feet. The overlook has had it since 8/23. The map never did.

WHAT IS DELIBERATELY NOT CHANGED: walking the marker still travels, still costs
ten minutes a cell, and still lands you by a road when you get there. That is the
travel mechanic and removing it is not this patch's business -- FT-JOURNEY is the
locked ruling about what travel becomes, and it is a build of its own.

REUSE CHECK: no graphic pixels cooked -- this remembers two numbers and restores
them, so no banks/ lookup applies.

Idempotent (marker __LOOKING_IS_NOT_TRAVELLING__).
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__LOOKING_IS_NOT_TRAVELLING__'

# ------------------------------------------- 1. remember the tile he left from
OUT_OLD = """  } else {
    // SURFACE: the marker follows your feet, the walk WAS the travel
    city.x=Math.max(0,Math.min(om.n-1,(hx/FN)|0));
    city.y=Math.max(0,Math.min(om.n-1,(hy/FN)|0));
    MODE='city';
  }"""

OUT_NEW = """  } else {
    // SURFACE: the marker follows your feet, the walk WAS the travel
    /* """ + MARK + """ (8/27): AND HIS BODY IS REMEMBERED, so that coming back
       from a LOOK is not a journey. Paolo: "it wants to keep spawning me outside
       of my starter Neighbourhood ... it'll just throw me somewhere randomly on
       the map." MEASURED: pinch out, three taps of the pad that is still under
       his thumb, pinch back in -- 194 TILES from where he was standing, and the
       pad presses were the marker moving, not him.
       Same shape as the vista's returnTo, which has let him go and look at the
       valley and come back to his feet since 8/23. The map never had it. */
    LOOKED_FROM = { hx: hx, hy: hy, cx: Math.max(0,Math.min(om.n-1,(hx/FN)|0)),
                                     cy: Math.max(0,Math.min(om.n-1,(hy/FN)|0)) };
    city.x=Math.max(0,Math.min(om.n-1,(hx/FN)|0));
    city.y=Math.max(0,Math.min(om.n-1,(hy/FN)|0));
    MODE='city';
  }"""

# ------------------------------------- 2. and coming back to the same cell is a look
IN_OLD = """  if(MODE==='city'){
    // DROP IN = camera change: land at the center of the CURRENT neighborhood"""

IN_NEW = """  if(MODE==='city'){
    /* """ + MARK + """ (8/27) -- DID HE TRAVEL, OR WAS HE LOOKING?
       If the marker is still on the cell he left, he was LOOKING: put him back on
       the exact tile and do not run the landing at all. The landing below centres
       him in the cell and spirals up to FN rings for a road, which is right when
       you have moved the marker somewhere and WRONG when you glanced at the map.
       He measured this himself: 194 tiles from a look.
       AND IT ONLY GOT LOUD YESTERDAY: before THE ACTION BUTTON DOES ACTIONS you
       had to press DROP IN on purpose to come through here. Making zoom the way in
       and out -- his ruling, and correct -- routed every glance at the map through
       a landing built for arrival. */
    if(typeof LOOKED_FROM!=='undefined' && LOOKED_FROM
       && LOOKED_FROM.cx===city.x && LOOKED_FROM.cy===city.y){
      hx=LOOKED_FROM.hx; hy=LOOKED_FROM.hy;
      LOOKED_FROM=null;
      MODE='human';
      updHud();
      return;
    }
    LOOKED_FROM=null;              /* he moved the marker: that is travel, land him */
    // DROP IN = camera change: land at the center of the CURRENT neighborhood"""

# ---------------------------------------------------------------- 3. the holder
DECL_OLD = """var HOME=null, HOME_KEY=null, LANDED=null;"""
DECL_NEW = """var HOME=null, HOME_KEY=null, LANDED=null;
/* """ + MARK + """: the tile he was standing on when he last left the walked
   world. var, not let, for the same temporal-dead-zone reason as HOME above --
   swapMode is defined earlier in the file than this line. */
var LOOKED_FROM=null;"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf8').read()
    if MARK in s:
        print('NOOP: looking at the map already is not travelling')
        return
    for needle, why in (('function swapMode(', 'the seam this fixes'),
                        ('LANDED=[hx,hy];', 'the landing anchor'),
                        ('var HOME=null, HOME_KEY=null, LANDED=null;', 'where the holder goes')):
        if needle not in s:
            sys.exit('FAIL: %s is missing (%s)' % (needle, why))
    for old, new, what in ((DECL_OLD, DECL_NEW, 'the holder'),
                           (OUT_OLD, OUT_NEW, 'remember the tile he left from'),
                           (IN_OLD, IN_NEW, 'and put him back on it if he only looked')):
        n = s.count(old)
        if n != 1:
            sys.exit('FAIL: anchor for "%s" matched %d times, expected 1' % (what, n))
        s = s.replace(old, new, 1)
    open(CITY, 'w', encoding='utf8').write(s)
    print('PATCHED %s -- a look at the map brings him back to his own feet' % CITY)


if __name__ == '__main__':
    main()
