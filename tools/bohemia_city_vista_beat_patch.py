#!/usr/bin/env python3
"""
SOMETHING LEADS YOU TO THE VALLEY (8/17/26, RUN lane). Demo board row 11.

    ROW 11 -- THE VISTA -- PARTIAL, and it is nearly free to close.
    Built, derived (not a new renderer), inlined in the walked city, opened by
    vistaOpen(), and ARMED IN THE WORLD [...] BUT NOTHING LEADS YOU THERE. The
    seam window.__VISTA documents itself as "RUN plays it from the day loop and
    the cold open" -- and a repo-wide grep finds ZERO game-side callers, only the
    definition and two gates. The demo's money shot is currently found by
    ACCIDENTALLY WALKING ONTO ONE RIM CELL.
    REMAINS: ONE CALL. OWNER: RUN.

Confirmed by grep before writing anything: `__VISTA.open` appears in the seam's
own definition and in two gates. The run has never called it.

TWO HALVES, because "one call" closes the row and does not fix the sentence
underneath it. The complaint is not that the vista never fires. It is that
NOTHING LEADS YOU THERE.

 1. IT IS A PLACE HE CAN FIND. The phone already carries where the market is and
    already has a GO that moves the city marker (__PHONE_JUMP__, 8/12). The
    overlook goes on the phone the same way -- cell, distance, and whether he is
    standing on it -- so it is somewhere to WALK TO, which is what an overlook is.
    Reused wholesale; no new door.

 2. AND THE MONEY SHOT IS GUARANTEED ONCE. A demo shown to a friend cannot
    depend on somebody wandering onto the right rim cell. So the day loop plays
    it ONE TIME, on the WAKE OF DAY 2 -- after he has lived a whole day and
    earned a look at where he lives, and never on day 1, which is already the
    cold open plus his first job. Once ever, remembered in the save, dismissible
    the moment he taps.

WHY DAY 2 AND NOT NIGHTFALL, said plainly because it is a choice: nightfall is
already the reckoning, which is the day's other big beat, and stacking the two
buries both. The wake is the empty moment in the loop.

THIS IS A DIRECTING CALL AND HE CAN CORRECT IT. EVERYTHING IS A THUMB (8/9):
decide, build it, put it where he meets it playing. If he would rather find the
overlook himself, deleting the day-2 beat leaves half 1 standing on its own and
the vista goes back to being a place you walk to.

REUSE CHECK: cooks no graphic pixels and opens no art bank -- the vista is CITY's
art and this file does not touch it. It calls the seam CITY published for exactly
this (window.__VISTA.open), reuses the phone's existing where-things-are channel
and its GO door, and reuses the day loop's existing wake hook. No new surface, no
second renderer, nothing about where the overlook IS (that is derived from the
map, and MAP LAW keeps it there).

Idempotent: re-running finds the marker and reports NOOP.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__THE_VALLEY_IS_A_PLACE__'

# 1. the phone learns where the overlook is, exactly like the market
OLD_STATE = """           market:(function(){ try{ var h=mktHub(); return h?{cell:{x:h.x,y:h.y},kind:h.kind,
             dist:Math.round(h.dist||0), at:mktAt(), bought:MKT_BOUGHT}:null; }
             catch(_e){ return null; } })() };"""
NEW_STATE = """           market:(function(){ try{ var h=mktHub(); return h?{cell:{x:h.x,y:h.y},kind:h.kind,
             dist:Math.round(h.dist||0), at:mktAt(), bought:MKT_BOUGHT}:null; }
             catch(_e){ return null; } })(),
           /* """ + MARK + """ -- THE OVERLOOK IS A PLACE HE CAN FIND. Board row 11:
              "NOTHING LEADS YOU THERE ... found by ACCIDENTALLY WALKING ONTO ONE
              RIM CELL." The phone already carries where the market is and already
              has a GO that moves the city marker, so the overlook rides the same
              channel. Where it IS stays derived from the map (MAP LAW); this only
              reports it. */
           vista:(function(){ try{ var o=window.__VISTA&&window.__VISTA.where();
             if(!o) return null;
             var cx=(MODE==='human')?((hx/FN)|0):city.x, cy=(MODE==='human')?((hy/FN)|0):city.y;
             return { cell:{x:o.x,y:o.y}, at:(cx===o.x&&cy===o.y), seen:!!VISTA_SEEN,
                      dist:Math.round(Math.sqrt((o.x-cx)*(o.x-cx)+(o.y-cy)*(o.y-cy))) };
             }catch(_e){ return null; } })() };"""

# 2. ONE CALL from the day loop: the wake of day 2, once ever
OLD_WAKE = """DAY.on('wake',function(){ try{ homeWake(); }catch(_e){} });"""
NEW_WAKE = """DAY.on('wake',function(){ try{ homeWake(); }catch(_e){}
  /* """ + MARK + """ -- THE ONE CALL board row 11 asked for. The seam says
     "RUN plays it from the day loop" and RUN never did: a repo-wide grep found
     zero game-side callers, so the demo's money shot was reachable only by
     wandering onto the right rim cell.
     DAY 2, NOT DAY 1: day 1 is already the cold open plus his first job. And not
     nightfall, which is already the reckoning -- stacking the two big beats
     buries both. The wake is the empty moment in the loop.
     ONCE EVER, and it remembers: VISTA_SEEN is the same flag the walk-onto-it
     path sets, so seeing it either way spends it. */
  try{ if(DAY.day===2 && !VISTA_SEEN && window.__VISTA) VISTA_ARMED=true; }catch(_e){}
});
/* """ + MARK + """ -- ARMED ON THE WAKE, PLAYED AFTER HE TAPS GET UP.
   *** I SHOT THIS AND LOOKED AT IT, and the first cut was wrong in exactly the
   way the comment above warns about. *** It opened the valley ON the wake event,
   and the wake ALSO raises the DAY 2 card -- so the money shot rendered
   UNDERNEATH a modal covering the middle of the screen. The gate was green (it
   really was open, it really did draw its card) and the shot was buried. I wrote
   "stacking two big beats buries both" about nightfall three lines up and then
   did it at the wake.
   So the valley waits for the card to be gone. GET UP, then the valley. */
var VISTA_ARMED=false;
function vistaBeatMaybe(){
  if(!VISTA_ARMED || VISTA_SEEN) return;
  VISTA_ARMED=false; VISTA_SEEN=true;
  setTimeout(function(){ try{ if(window.__VISTA.open()) window.__VISTA_BEAT=1; }catch(_e){} }, 260);
}"""

OLD_GETUP = """  h+='<div class="dcgo" data-act="go">GET UP</div>';
  cardShow(h,function(){ cardHide(); });"""
NEW_GETUP = """  h+='<div class="dcgo" data-act="go">GET UP</div>';
  /* """ + MARK + """ -- the valley comes AFTER the card is gone, never under it. */
  cardShow(h,function(){ cardHide(); try{ vistaBeatMaybe(); }catch(_e){} });"""

# 3. and it rides the save, so a demo never shows it twice
OLD_SNAP = """    loop:DAY.serialize(),quest:DQ.serialize(),      /* __DAY_LOOP__ */"""
NEW_SNAP = """    loop:DAY.serialize(),quest:DQ.serialize(),      /* __DAY_LOOP__ */
    vistaSeen:!!VISTA_SEEN,   /* """ + MARK + """ -- once ever means across reloads */"""

OLD_RESTORE = """  if(st.market){ try{ MKT_LEDGER=st.market.ledger||null; MKT_BOUGHT=st.market.bought||null; }catch(_e){} }"""
NEW_RESTORE = """  if(st.market){ try{ MKT_LEDGER=st.market.ledger||null; MKT_BOUGHT=st.market.bought||null; }catch(_e){} }
  /* """ + MARK + """ */
  if(st.vistaSeen){ try{ VISTA_SEEN=true; }catch(_e){} }"""

# 5. vistaClose must give back the CITY MARKER too, not just the body
OLD_RETURN = """  VISTA={ returnTo:{hx:hx, hy:hy, mode:MODE}, at:o,"""
NEW_RETURN = """  /* """ + MARK + """ -- THE MARKER GOES IN returnTo TOO. vistaClose gave back
     hx/hy/MODE and LEFT city.x/city.y parked on the mountain rim, so HOME -- which
     resolves per (seed, marker cell) -- came back NULL and his house stopped
     existing. MEASURED: marker [48,48] home {48,48} -> open -> marker [17,36] ->
     close -> marker STILL [17,36], home null.
     It was latent while the only way in was WALKING onto the overlook (the marker
     was already near you); the day-2 beat calls it from anywhere, which exposed
     it hard and turned home_phone_gate red. Completing the structure that was
     already there rather than adding one. */
  VISTA={ returnTo:{hx:hx, hy:hy, mode:MODE, cx:city.x, cy:city.y}, at:o,"""

OLD_CLOSE = """  hx=r.hx; hy=r.hy; MODE=r.mode;"""
NEW_CLOSE = """  hx=r.hx; hy=r.hy; MODE=r.mode;
  if(typeof r.cx==='number'){ city.x=r.cx; city.y=r.cy; }   /* """ + MARK + """ */"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    if MARK in s:
        print('NOOP: ' + MARK + ' already present')
        return
    for name, old, new in [('the phone state', OLD_STATE, NEW_STATE),
                           ('the wake hook', OLD_WAKE, NEW_WAKE),
                           ('the get up tap', OLD_GETUP, NEW_GETUP),
                           ('the snapshot', OLD_SNAP, NEW_SNAP),
                           ('the restore', OLD_RESTORE, NEW_RESTORE),
                           ('the vista returnTo', OLD_RETURN, NEW_RETURN),
                           ('the vista close', OLD_CLOSE, NEW_CLOSE)]:
        if old not in s:
            sys.exit('FAIL: anchor not found -- ' + name)
        s = s.replace(old, new, 1)
    open(CITY, 'w', encoding='utf-8').write(s)
    print('PATCHED ' + CITY + ' (' + str(len(s)) + ' bytes)')


if __name__ == '__main__':
    main()
