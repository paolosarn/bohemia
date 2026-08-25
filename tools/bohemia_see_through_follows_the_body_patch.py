#!/usr/bin/env python3
"""
THE SEE-THROUGH TESTED WHERE HE USED TO BE, SO WALKING BEHIND A WALL HID HIM
(8/25/26, RUN lane. My regression, from the walk glide I shipped on 8/23.)

PAOLO, and the "before" is the point:

    "when i am facing walking south i should be behind the walls with an opacity
     so i can see myself weve talked about this before bro"

HE IS RIGHT THAT WE TALKED ABOUT IT. It is LOCKED law, 7/27, in his own words:

    laws/BOHEMIA_ADDENDUM_THREE_TILE_WALL_7_27_26.md
    "an opacity filter for when I'm in front of a wall or something"
    2. A WALL THAT IS COVERING THE PLAYER GOES SEE-THROUGH ... drops to 35%

AND IT WAS BUILT, AND IT WAS RIGHT, AND I BROKE IT. The law's draw order is:

    1. baked ground and roofs
    2. facades BEHIND him at full opacity
    3. the player
    4. facades IN FRONT of him last, FADED WHERE THEY COVER HIM

Step 4 asks `playerBox()` where he is. On 8/23 the walk glide made the body draw
at the CAMERA cell -- the eased position between the cell he left and the cell he
is entering -- and playerBox kept computing from hx,hy, THE TRUE CELL:

    function playerBox(ox,oy,C){
      const px=ox+hx*C, py=oy+hy*C;     <-- where the model is
    ...
      const px=ox+_gc[0]*C, py=oy+_gc[1]*C;   <-- where the BODY is drawn

MEASURED, walking south for 45 frames at cell size 44:

    worst gap between the test box and the drawn body   88 px  (TWO CELLS)
    frames where they disagreed by more than 2px        35 of 45  (78%)

Two cells, because holding the pad starts him running and a run covers two cells
in a beat. So for most of every walked beat the game asked "is a wall covering
him?" about a spot up to two cells behind his actual body. The wall that really
was covering him stayed solid, and he disappeared into it -- WHILE MOVING, which
is exactly when he noticed and exactly when nothing was looking.

*** AND THIS IS THE THIRD TIME THIS WEEK I HAVE MADE THE SAME MISTAKE. *** The
objective hint went into a copy instead of the canon body; the population card
measured a toolbar whose coordinate space I had changed; and now the see-through
measures a body I moved. MOVING WHERE SOMETHING IS DRAWN IS NOT A DRAWING CHANGE.
Everything that asks WHERE HE IS has to be found and moved with it.

THE FIX IS ONE OWNER, WHICH IS THE OTHER LESSON FROM THIS WEEK. camCell is
already called exactly once per frame in renderHuman, into `_gc`. playerBox is
handed that same value rather than calling camCell again -- two calls in one
frame read performance.now() twice and can disagree, which would be a second
owner for one number, the exact bug I shipped and had to take back out of the
population card two days ago.

NOTHING ABOUT THE LAW CHANGES: 35% is still 35%, only a wall that actually covers
him fades, behind-him facades are still solid, and the x-ray on his own building
is untouched. This makes the test look where the body is.

REUSE CHECK: no graphic pixels cooked -- this passes a number that already exists
to a function that already exists, so no banks/ lookup applies.

Idempotent (marker __SEE_THROUGH_FOLLOWS_THE_BODY__).
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__SEE_THROUGH_FOLLOWS_THE_BODY__'

BOX_OLD = """function playerBox(ox,oy,C){
  const px=ox+hx*C, py=oy+hy*C;"""

BOX_NEW = """function playerBox(ox,oy,C,gc){
  /* """ + MARK + """ (8/25). Paolo: "when i am facing walking south i should be
     behind the walls with an opacity so i can see myself weve talked about this
     before bro." He had: it is the 7/27 THREE-TILE WALL law, and it was built and
     working. I broke it on 8/23 when the walk glide made the body draw at the
     CAMERA cell while this kept computing from hx,hy, the TRUE cell.
     MEASURED walking south, 45 frames at cell 44: the test box sat up to 88px --
     TWO CELLS, because holding the pad starts him running -- from the drawn body,
     and disagreed by more than 2px on 35 of 45 frames. So for most of every beat
     the game asked whether a wall covered a spot he was not standing on, the wall
     that really covered him stayed solid, and he vanished into it WHILE MOVING.
     `gc` is the camera cell renderHuman already computed this frame. It is PASSED
     rather than re-derived: camCell reads performance.now(), so calling it twice
     in one frame is two owners for one number -- the bug I shipped into the
     population card on 8/24 and had to take back out. Falls back to the true cell
     for any caller that does not have one. */
  const _g=gc||[hx,hy];
  const px=ox+_g[0]*C, py=oy+_g[1]*C;"""

CALL_OLD = """  const _pbox=playerBox(ox,oy,C);"""

CALL_NEW = """  const _pbox=playerBox(ox,oy,C,_gc);   /* """ + MARK + """: the box follows the body */"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf8').read()
    if MARK in s:
        print('NOOP: the see-through already follows the body')
        return
    for needle, why in (('function facadePass(', 'the pass that fades a covering wall'),
                        ('const _gc=camCell(hx,hy);', 'the camera cell the renderer draws at'),
                        ('WALL_SEE', 'the 7/27 see-through alpha')):
        if needle not in s:
            sys.exit('FAIL: %s is missing (%s)' % (needle, why))
    for old, new, what in ((BOX_OLD, BOX_NEW, 'playerBox takes the drawn cell'),
                           (CALL_OLD, CALL_NEW, 'and renderHuman hands it the one it already has')):
        n = s.count(old)
        if n != 1:
            sys.exit('FAIL: anchor for "%s" matched %d times, expected 1' % (what, n))
        s = s.replace(old, new, 1)
    open(CITY, 'w', encoding='utf8').write(s)
    print('PATCHED %s -- a wall that covers his BODY fades, not one that covers '
          'the cell he left' % CITY)


if __name__ == '__main__':
    main()
