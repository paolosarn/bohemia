#!/usr/bin/env python3
"""
THE LATE-BEAT SONGS REACH THE STREET (9/13/26, SOUNDS lane) -- [three retagged]
THE-THREE-SONGS-WITH-HIS-BEAT-PLAY-ON-THE-STREET.

RULED by the coordinator 9/13 off this lane's own round-3 record (93a7bc63):
"three songs whose own data carries the late beat his anchor is famous for, all
tagged MENU-only, so the game plays them 16 seconds and never again. Retag the
three to the street pool; where a song may play is mechanism, its notes are his;
he kills what he hates in the MUSIC tab."

MEASURED FIRST, and the count is FOUR, not three. Rendered through the engine's
own scheduler, the songs whose first kit hit lands after the phrase are:

    MENU - PURPLE DAWN                    23.5s   BURIED
    MENU - DEAD VALLEY DAWN               23.5s   CANON
    MENU - LIGHTS ACROSS THE VALLEY       23.5s   BURIED
    MENU - THE POWER STILL ON SOMEWHERE   23.5s   CANON

All four carry an EMPTY kick array, so their first drum is the bar-11 fill. The
card said three because its late-beat term scored the top four and one of them
fell outside the ten it printed.

*** SO TWO GET RETAGGED, NOT THREE OR FOUR, AND THE REASON IS A LAW. ***
GRAVEYARD IS FINAL. PURPLE DAWN and LIGHTS ACROSS THE VALLEY are thumbed 0, which
is BURIED, and putting a buried song into a pool is asking for a dead thing back.
Measured: the pool builder already refuses them (`MUS.V[m.n+'#1']!==0`), so the
tag would be inert as well as wrong. Two CANON songs are retagged, and the other
two are named here rather than quietly counted.

WHICH POOL, AND WHY IT IS NOT "DAY"
  OVERWORLD DUSK/DAWN is the thinnest pool on the shelf -- this lane's own handoff
  has carried "the dusk pool of two" as a hole since round 1 of [music owned]. Both
  songs are named for first light (DEAD VALLEY DAWN) or for the calm before it, and
  his own 8/26 words about the second are "i liked the power still on somewhere
  when it was calm". A calm song at the calm edge of the day is the realistic
  placement and it fills the thinnest pool: REALISM FIRST.

NOTHING IS TAKEN AWAY. The MENU tag stays, so both songs keep their job at the
front door, and `menu:true` stays on the row, so his 8/26 ruling holds too --
"menu music doesnt get impacted by intensity type shit" is read off that field,
not off the tag, so a menu song on the street still never intensifies.

CONTENTS-PAOLO'S: not one note, scale, kick array, voice or gain is touched. A tag
is WHERE a song may play, which is mechanism. He kills what he hates in the MUSIC
tab and an in-session untag sticks, because CAT_DEFAULTS only fills keys he has
never touched.

REUSE CHECK: cooks nothing. Two entries in a table that already exists.

  python3 tools/bohemia_the_late_beat_songs_reach_the_street.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__THE_LATE_BEAT_SONGS_REACH_THE_STREET__'

# the em dash is the one in the shipped table, not a hyphen
MOVE = [
    ("'MENU — DEAD VALLEY DAWN#1':['MENU'],",
     "'MENU — DEAD VALLEY DAWN#1':['MENU','OVERWORLD DUSK/DAWN'],"),
    ("'MENU — THE POWER STILL ON SOMEWHERE#1':['MENU'],",
     "'MENU — THE POWER STILL ON SOMEWHERE#1':['MENU','OVERWORLD DUSK/DAWN'],"),
]

NOTE = """ /* __THE_LATE_BEAT_SONGS_REACH_THE_STREET__ (9/13, SOUNDS lane) -- RULED by the
    coordinator 9/13 off round 3 of [music owned]: the songs whose own data brings
    the drum in LATE, the trait his anchor is famous for, were MENU-only, so the
    game played them for one phrase at the front door and never again.
    MEASURED through the engine's own scheduler: FOUR songs, not three, first kit
    hit 23.5s, all four with an empty kick array so the bar-11 fill is their first
    drum. TWO are retagged. PURPLE DAWN and LIGHTS ACROSS THE VALLEY are thumbed
    BURIED and GRAVEYARD IS FINAL -- the pool builder already refuses a buried
    song, so the tag would be inert as well as wrong.
    DUSK/DAWN AND NOT DAY: it is the thinnest pool on the shelf, both songs are
    named for first light, and his 8/26 words about the second are "i liked the
    power still on somewhere when it was calm". The MENU tag stays, so they keep
    the front door, and `menu:true` stays on the row, so his 8/26 no-intensity
    ruling still reads true. */
"""


def main():
    print('=== THE LATE-BEAT SONGS REACH THE STREET ===')
    src = open(ALPHA, encoding='utf8').read()
    if MARK in src:
        print('  already installed (idempotent, nothing to do)')
        return 0

    # POSITIVE CONTROL ON THE PREMISE: the two songs left alone must really be
    # buried, or "graveyard is final" is being used as an excuse rather than a law.
    for dead in ('MENU — PURPLE DAWN#1', 'MENU — LIGHTS ACROSS THE VALLEY#1'):
        if ("'%s':0" % dead) not in src:
            print('FAIL: %s is not thumbed 0 any more, so the reason for leaving it '
                  'out has changed -- re-measure before trusting this' % dead)
            return 1
    print('  PREMISE  the two left out are both still thumbed BURIED')
    # and the pool builder must still refuse a buried song, or the claim above is
    # about code that no longer exists
    if "MUS.V[m.n+'#1']!==0&&MUS.catsOf(m.n+'#1')" not in src:
        print('FAIL: the overworld pool builder no longer filters buried songs, so '
              'a tag on a buried song would NOT be inert')
        return 1
    print('  PREMISE  the overworld pool builder still refuses a buried song')

    for old, new in MOVE:
        if src.count(old) != 1:
            print('FAIL: the tag row is not where this expects it (%d): %s'
                  % (src.count(old), old[:44]))
            return 1
        src = src.replace(old, new, 1)
        print('  RETAGGED %s' % new.split("#1'")[0].strip("'"))

    anchor = 'const CAT_DEFAULTS={\n'
    if src.count(anchor) != 1:
        print('FAIL: CAT_DEFAULTS is not where this expects it')
        return 1
    src = src.replace(anchor, NOTE + anchor, 1)
    open(ALPHA, 'w', encoding='utf8').write(src)
    print('  Two CANON songs with the anchor\'s own late beat now play on the '
          'street at first light, and keep the front door.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
