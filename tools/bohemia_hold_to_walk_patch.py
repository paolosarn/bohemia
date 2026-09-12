#!/usr/bin/env python3
"""
HOLD TO WALK (9/12/26, RUN lane)
VAMILY [drop in] / THE-FIRST-MINUTE-IS-THE-PROMISE.

PAOLO 9/11: "Your job is to make sure the rest of the game is playable and fun."

THE MEASUREMENT THIS COMES OUT OF, taken on the served demo with a real held
press and a wall clock:

    ONE step moves a FULL tile
    TEN SECONDS of holding = 20 fine tiles = 1.94 tiles/second
    the nearest road district = about 66 SECONDS of holding

A TAP MOVES YOU ONE TILE. A HOLD MOVES YOU TWO A SECOND. And the walk LATCH
shipped 9/6: hold a direction for three beats and you keep walking after you let
go, until something worth stopping for happens.

*** AND NOTHING IN THE GAME HAS EVER SAID SO. *** Grepped every teaching step and
every nudge: the word "hold" appears nowhere near the pad. The first-run teaching
says WALK WITH THIS, which teaches that the pad exists and nothing about the one
verb that actually gets you anywhere. So a stranger taps, moves a tile per tap,
and the valley stays sixty-six seconds away forever.

THE CHANGE IS ONE STRING. It teaches the pad, the hold and the latch in one line:

    WALK WITH THIS   ->   HOLD TO WALK, LET GO TO KEEP GOING

WHOSE SURFACE THIS IS, ASKED BEFORE TOUCHING IT. The teaching is UI's
[first teaching], and that row is SHIPPED and closed -- nobody is mid-flight in
it, so this is not two sessions in one system, it is a closed feature getting one
word for a shipped feature of mine it never mentioned. ONE SYSTEM ONE SESSION is
about concurrent edits, and there are none here.

WHAT IT DELIBERATELY DOES NOT DO:
  * it does not touch the step's clearing rule -- the lesson still clears by
    WALKING, which a tap satisfies, so a player who taps is never nagged
  * it does not add a step, a screen, or a second teaching system
  * it does not change the latch itself; LATCH_AFTER stays at three beats,
    because a tap staying one step is what keeps the existing feel

Words are attempts, draft:true.
IDEMPOTENT: the mark is checked first, the anchor asserted to match exactly once.
"""
import sys, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CITY = os.path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html')
MARK = '__HOLD_TO_WALK__'


def main():
    src = open(CITY, encoding='utf8').read()
    if MARK in src:
        print('  already applied (%s present) -- nothing to do' % MARK)
        return 0

    anchor = ("    { k:'walk',  sel:'#pad',      hit:'#pad .pb', "
              "say:'WALK WITH THIS' },")
    assert src.count(anchor) == 1, 'walk step anchor %d' % src.count(anchor)

    new = ("    /* " + MARK + " (9/12, RUN): A TAP MOVES ONE TILE. A HOLD MOVES TWO A\n"
           "       SECOND, and the latch (9/6) keeps you going after you let go. Measured\n"
           "       with a real held press: 1.94 tiles/second, and the nearest road\n"
           "       district is 66 seconds of holding away. THE WORD 'HOLD' APPEARED\n"
           "       NOWHERE NEAR THE PAD, so a stranger tapped and the valley never\n"
           "       arrived. This line teaches the pad, the hold and the latch at once.\n"
           "       Still clears by WALKING, which a tap satisfies, so a tapper is never\n"
           "       nagged. draft:true. */\n"
           "    { k:'walk',  sel:'#pad',      hit:'#pad .pb', "
           "say:'HOLD TO WALK, LET GO TO KEEP GOING' },")

    src = src.replace(anchor, new, 1)
    open(CITY, 'w', encoding='utf8').write(src)
    print('  changed  : the walk lesson now teaches the hold and the latch')
    print('  wrote    : slices/BOHEMIA_CITY_WORLD.html')
    return 0


if __name__ == '__main__':
    sys.exit(main())
