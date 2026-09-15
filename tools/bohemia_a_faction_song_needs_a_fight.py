#!/usr/bin/env python3
"""
A FACTION SONG NEEDS A FIGHT (9/15/26, SOUNDS lane) -- the street plays the wrong
song within a second of getting the music, and it breaks his 7/7 overworld law.

*** MEASURED by watching the value itself. MUS.cur was given a property setter that
logs every write with its call site -- the only honest way to name a writer -- and a
cold boot of the alpha produced FOUR writes in 45 seconds:

    0.3s  -> MENU - THE POWER STILL ON SOMEWHERE   menu=1 city=0   the opening
   22.1s  -> SLOW CREEP                            menu=0 city=1   the street picks
   22.4s  -> VOLUNTEERS                            menu=0 city=1   line 17374
   22.4s  -> ANARCHISTS                            menu=0 city=1   line 17374

    and 45 seconds in, the street was playing ANARCHISTS.

THE STREET PICKED A CREEPER AND SOMETHING OVERWROTE IT TWICE, 0.3 SECONDS LATER. ***

HIS 7/7 OVERWORLD PLAYLIST LAW says the overworld plays the creepers. CITYMUS's own
candidates() can only ever return MLOOPS entries, so the street cannot have chosen a
faction song; it chose SLOW CREEP and was overruled.

THE WRITER IS THE COMBAT FRAME'S WARM-UP, AND THE COMMENT DIRECTLY ABOVE IT DESCRIBES
THE EXACT BUG IT IS FAILING TO PREVENT (8/19, in its own words):

    NOT DURING THE OPENING (8/19). See MENUMUS: the combat iframe is WARMED
    seconds after entry and reports a faction from its rotation WITH NO FIGHT IN
    PROGRESS, which used to reassign whatever was playing.

The guard written for it is `if(window.MENUMUS&&MENUMUS.on)return;` -- it only covers
THE OPENING. That worked while the warm-up landed inside the opening's phrase. It does
not now, and the reason is this lane's own fix from the round before: the opening used
to never hand over at all on a boot that stutters, and since it hands over on the audio
clock it is finished at about 16.7 s while the warm-up arrives at about 22 s. So the
guard passes and the warm-up takes the street.

> **A GUARD THAT NAMES ONE MOMENT INSTEAD OF THE CONDITION HOLDS ONLY WHILE THE TIMING
> HAPPENS TO AGREE WITH IT.** The condition was never "the opening is playing"; the
> comment says it plainly -- "with no fight in progress".

THE FIX IS THE CONDITION THE COMMENT ALREADY NAMES, and it is deliberately narrow: the
warm-up is ignored only when THE STREET OWNS THE MUSIC AND NO FIGHT IS ON. A faction
song may still take the music the instant a fight owns it, by any path, so nothing about
combat changes and no legitimate pick can be dropped.

WHAT IS NOT TOUCHED: the opening guard stays (it is still true and still cheap), the
scratch-patch guard stays, FIGHTMUS.realFaction stays, and the MUSIC tab's own PLAY is
untouched -- he is driving there and combat honours his exact slot.

REUSE CHECK: cooks nothing. No bank, no candidate, no pixel, no new sound, no new event,
no new number. One condition, on one message.

  python3 tools/bohemia_a_faction_song_needs_a_fight.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__A_FACTION_SONG_NEEDS_A_FIGHT__'

OLD = """      if(window.MENUMUS&&MENUMUS.on)return;"""

NEW = """      if(window.MENUMUS&&MENUMUS.on)return;
      /* __A_FACTION_SONG_NEEDS_A_FIGHT__ (9/15, SOUNDS lane) -- AND NOT WHILE THE
         STREET OWNS THE MUSIC WITH NO FIGHT ON, which is the condition the comment
         above has always described and never checked.
         MEASURED with a property setter on MUS.cur logging every write and its call
         site, cold boot, 45 seconds: the street picked SLOW CREEP at 22.1 s and THIS
         LINE overwrote it with VOLUNTEERS and then ANARCHISTS at 22.4 s, and the
         street was still playing ANARCHISTS 23 seconds later. His 7/7 overworld law
         says the overworld plays the creepers, and CITYMUS.candidates() can only
         return MLOOPS entries, so the street cannot have chosen either of those.
         THE OPENING GUARD ABOVE ONLY EVER WORKED BY TIMING. It held while the warm-up
         landed inside the opening's phrase. Since this lane fixed the opening to hand
         over on the audio clock (it used to never hand over at all on a boot that
         stutters) the opening is done at about 16.7 s and the warm-up arrives at
         about 22 s, so the guard passes and the warm-up takes the street.
         A GUARD THAT NAMES ONE MOMENT INSTEAD OF THE CONDITION HOLDS ONLY WHILE THE
         TIMING HAPPENS TO AGREE WITH IT.
         Narrow on purpose: a faction song may still take the music the instant a
         fight owns it, by any path, so no legitimate pick is dropped. */
      if(window.CITYMUS&&CITYMUS.on&&!(window.FIGHTMUS&&FIGHTMUS.on))return;"""


def main():
    print('=== A FACTION SONG NEEDS A FIGHT ===')
    src = open(ALPHA, encoding='utf8').read()
    if MARK in src:
        print('  already installed (idempotent, nothing to do)')
        return 0

    # POSITIVE CONTROLS ON THE PREMISE, all three measured this round.
    if 'bohemiaFactionPicked' not in src:
        print('FAIL: the combat frame no longer posts a faction pick; re-measure')
        return 1
    if 'the combat iframe is WARMED' not in src:
        print('FAIL: the 8/19 note that names this condition is gone; re-read before '
              'trusting this fix')
        return 1
    if "OVERWORLD" not in src:
        print('FAIL: the overworld pool is not in this file; refusing')
        return 1
    print('  PREMISE  the faction message, the 8/19 note that names the condition, and '
          'the overworld pool are all where this measured them')

    if src.count(OLD) != 1:
        print('FAIL: the opening guard is not unique (%d)' % src.count(OLD))
        return 1
    src = src.replace(OLD, NEW, 1)
    open(ALPHA, 'w', encoding='utf8').write(src)
    print('  FIXED    the combat frame\'s warm-up can no longer take the street\'s song '
          'when no fight is on')
    print('  The street picked SLOW CREEP and was overruled twice in 0.3 seconds.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
