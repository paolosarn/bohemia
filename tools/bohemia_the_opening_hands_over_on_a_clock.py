#!/usr/bin/env python3
"""
THE OPENING HANDS OVER ON A CLOCK (9/15/26, SOUNDS lane) -- the street's music can
never start on a boot that stutters, which is every boot on a phone.

*** MEASURED on the shipped alpha, cold boot, 62 seconds of polling both flags:

    17.5s  menu=1 city=0 step=1
    25.4s  menu=1 city=0 step=4      ... climbing ...
    28.0s  menu=1 city=0 step=25
    28.6s  menu=1 city=0 step=1      <- reset
    30.4s  menu=1 city=0 step=15
    31.4s  menu=1 city=0 step=1      <- reset
    36.1s  menu=1 city=0 step=39
    37.3s  menu=1 city=0 step=1      <- reset
    ... 66 distinct states in 62 seconds, and MENUMUS.on never went false.

THE OPENING HANDS OVER AT `MUS.step >= MENUMUS.HANDOFF_STEPS` (128). The step counter
never gets past about 39. So the opening never hands over, CITYMUS never takes the
music, and THE PLAYER NEVER HEARS THE VALLEY'S MUSIC AT ALL -- just the menu song,
restarting, forever. ***

WHY THE COUNTER RESETS, AND IT IS NOT A BUG TO REMOVE. [heartbeat first] shipped
__THE_BEAT_BEFORE_THE_SONG__ for a real reason, in its own words: after the nine-second
iframe parse "SEVENTY-TWO SIXTEENTHS fired at once: not a song coming in, a noise". So a
transport that finds itself more than a quarter second behind RE-ANCHORS onto the pulse's
next beat instead of catching up:

    if(MUS.nextT < _n-0.25){ ... MUS.nextT=...; MUS.step=0; MUS.uiBar=0; }

That is correct and it must stay. The defect is that ONE COUNTER IS CARRYING TWO JOBS:
it is the transport's position, which a re-anchor must zero, AND it is the opening's
egg timer, which nothing should zero. On a boot that stalls every few seconds -- a
24-second city parse, or any phone -- the egg timer is reset before it can ever ring.

> **A COUNTER THAT ANOTHER SYSTEM IS ENTITLED TO RESET CANNOT BE USED AS A TIMER.**

THE FIX, and it is the smallest one that cannot fail the same way: the opening ALSO
watches the AUDIO CLOCK. It writes down MUS.AC.currentTime when it starts and hands over
once one phrase of real audio time has passed -- phraseMs(), the engine's own unit,
shared with the street's rest and the drum hold, so no new number enters the game. A
re-anchor does not move the audio clock, so nothing can starve it.

THE STEP CHECK STAYS, as an OR. On a clean boot the counter reaches 128 first and the
handoff is exactly what it always was, on the phrase, to the step. The clock is the
floor underneath it, not a replacement: whichever arrives first.

AND THE MUSICAL PROMISE IS KEPT EITHER WAY. When the counter wins, the handoff lands on
the step it always did. When the clock wins, the player has still heard one full phrase
of the opening -- the re-anchors kept it audible the whole time, which is what they were
built for -- so handing over then is the honest moment, not an early cut.

REUSE CHECK: cooks nothing. No bank, no candidate, no pixel, no new sound, no new event,
and NO NEW NUMBER: the phrase is phraseMs(), which the rest and the drum hold already
share, and the clock is the one the transport already runs on.

  python3 tools/bohemia_the_opening_hands_over_on_a_clock.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__THE_OPENING_HANDS_OVER_ON_A_CLOCK__'

OLD = """      if(!MUS.playing){ MENUMUS.on=false; clearInterval(MENUMUS.watch); MENUMUS.watch=null; return; }
      if(MUS.step>=MENUMUS.HANDOFF_STEPS) MENUMUS.handOff(); },300); },"""

NEW = """      if(!MUS.playing){ MENUMUS.on=false; clearInterval(MENUMUS.watch); MENUMUS.watch=null; return; }
      /* __THE_OPENING_HANDS_OVER_ON_A_CLOCK__ (9/15, SOUNDS lane) -- THE STREET'S
         MUSIC COULD NEVER START ON A BOOT THAT STUTTERS, WHICH IS EVERY BOOT ON A
         PHONE. Measured on the shipped alpha, cold, 62 seconds: MUS.step climbed to
         25, reset to 1, climbed to 15, reset, reached 39, reset -- 66 distinct
         states, and MENUMUS.on never went false once. The handoff below waits for
         step 128 and the counter never got past 39, so the opening song restarted
         forever and the valley's music never played.
         THE RESET IS NOT A BUG AND MUST STAY. __THE_BEAT_BEFORE_THE_SONG__ zeroes
         MUS.step whenever the transport is more than a quarter second behind,
         because catching up booked "SEVENTY-TWO SIXTEENTHS at once: not a song
         coming in, a noise". The defect is that ONE COUNTER CARRIES TWO JOBS -- the
         transport's position, which a re-anchor must zero, and this egg timer,
         which nothing should. A 24-second city parse resets the timer before it can
         ring.
         A COUNTER THAT ANOTHER SYSTEM IS ENTITLED TO RESET CANNOT BE USED AS A
         TIMER. So the opening also watches the AUDIO CLOCK, which a re-anchor does
         not move, and hands over after ONE PHRASE of real audio time -- phraseMs(),
         the engine's own unit, already shared with the street's rest and the drum
         hold, so no new number enters the game.
         THE STEP CHECK STAYS AS AN OR: on a clean boot the counter still wins and
         the handoff is exactly what it always was, on the phrase, to the step. And
         when the clock wins, the player HAS heard a full phrase -- the re-anchors
         kept it audible, which is what they are for -- so it is the honest moment
         and not an early cut. */
      if(MENUMUS.startedAt==null){ try{ MENUMUS.startedAt=MUS.AC.currentTime; }catch(_e){} }
      var _late=false;
      try{ var _ph=(typeof phraseMs==='function'?phraseMs():16000)/1000;
        _late = (MENUMUS.startedAt!=null) && (MUS.AC.currentTime-MENUMUS.startedAt >= _ph);
      }catch(_e){}
      if(MUS.step>=MENUMUS.HANDOFF_STEPS || _late) MENUMUS.handOff(); },300); },"""

# and the flag has to be cleared when the opening starts, or a second opening in the
# same session would hand over instantly off the first one's timestamp
OPEN_OLD = "    this.on=true;"
OPEN_NEW = ("    this.on=true;\n"
            "    /* __THE_OPENING_HANDS_OVER_ON_A_CLOCK__ -- cleared HERE and not in the\n"
            "       watch, so a second opening in one session cannot hand over instantly\n"
            "       off the first one's timestamp. */\n"
            "    this.startedAt=null;")


def main():
    print('=== THE OPENING HANDS OVER ON A CLOCK ===')
    src = open(ALPHA, encoding='utf8').read()
    if MARK in src:
        print('  already installed (idempotent, nothing to do)')
        return 0

    # POSITIVE CONTROLS ON THE PREMISE: both halves of the defect must still be here.
    if 'HANDOFF_STEPS:128' not in src:
        print('FAIL: the opening no longer hands over at 128 steps; re-measure')
        return 1
    if 'MUS.nextT=(_p&&_p>_n+0.02)?_p:(_n+0.06); MUS.step=0; MUS.uiBar=0;' not in src:
        print('FAIL: the transport no longer zeroes the step when it re-anchors, so '
              'the cause this fixes is gone; re-measure before installing')
        return 1
    if 'function phraseMs()' not in src:
        print('FAIL: phraseMs is not in this file, so this would have to invent a '
              'number; refusing')
        return 1
    print('  PREMISE  the 128-step handoff, the re-anchor that zeroes the step, and '
          'the shared phrase helper are all where this measured them')

    if src.count(OLD) != 1:
        print('FAIL: the opening\'s watch is not where this expects it (%d)'
              % src.count(OLD))
        return 1
    src = src.replace(OLD, NEW, 1)
    i = src.index('const MENUMUS={')
    j = src.index('window.MENUMUS=MENUMUS;', i)
    blk = src[i:j]
    if blk.count(OPEN_OLD) != 1:
        print('FAIL: the opening\'s own start line is not unique (%d)'
              % blk.count(OPEN_OLD))
        return 1
    src = src[:i] + blk.replace(OPEN_OLD, OPEN_NEW, 1) + src[j:]
    open(ALPHA, 'w', encoding='utf8').write(src)
    print('  FIXED    the opening hands over on the audio clock as well as the step')
    print('  FIXED    and the timestamp is cleared when the opening starts')
    print('  The street\'s music could never start on a boot that stutters. Measured '
          '62 seconds: the step counter never got past 39 of the 128 it waits for.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
