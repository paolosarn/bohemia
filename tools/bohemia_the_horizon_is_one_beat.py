#!/usr/bin/env python3
"""
THE HORIZON IS ONE BEAT (9/18/26, SOUNDS lane) -- [scheduled beat].

*** THE 120 BPM LAW IS THIS LANE'S LAW AND IT IS BROKEN ON THE ONLY SURFACE THAT
COUNTS. PLUMBER measured it first (f90a810, [sixty fps] round 3), with the
throttle proved real inside the run: "beats LATE once settled 9.9% here -> 31.6%
on a phone-shaped CPU, and 8.3% SWALLOWED WHOLE... THE 120 BPM LAW ON A PHONE:
one beat in twelve never happens." ***

THE ROW'S PREMISE IS HALF WRONG, AND MEASURING IT SAID SO. The row says every
beat "is fired on the tap" and should be "scheduled ahead". It IS already
scheduled ahead: the transport is a lookahead scheduler on a 25 ms setInterval.
So there was nothing to convert. THE DEFECT IS THE SIZE OF THE HORIZON.

MEASURED BY ASKING THE TRANSPORT, not by reading it. MUS.playStep was wrapped so
the only countable thing is a step the scheduler really handed to Web Audio, and
MUS.step was watched for the re-anchor branch that throws steps away. Twenty
seconds, same shape of run at both rates, the throttle proved by a WARMED busy
loop (the first version of that yardstick ran the loop once cold and once warm
and reported 0.51x with no throttle applied -- it was timing the JIT):

                         1x            4x, a phone-shaped CPU
    steps booked      128 of 160          42 of 160
                          80%                26.3%
    booked IN THE PAST     10                  17      (Web Audio plays these at once)
    re-anchors              3                   4      (each one zeroes the position)
    worst gap with nothing booked  2,229 ms      5,782 ms
    largest booked-ahead   0.12 s              0.117 s

> **THREE QUARTERS OF THE BEAT NEVER REACHES THE AUDIO GRAPH ON A PHONE, AND ONE
> STEP IN FIVE DOES NOT REACH IT ON THIS FAST BOX EITHER.**

A NOTE ON WHOSE NUMBER IS WHOSE, because these are two instruments and not one:
PLUMBER counted BEATS THE GAME JUDGED late or swallowed. This counts STEPS THE
SCHEDULER BOOKED. They are different measurements of the same illness and neither
refutes the other; this one is not a correction of theirs.

THE CAUSE IS ONE NUMBER: the horizon is 0.12 s, on a thread that stalls for
seconds. A stall longer than about 0.37 s also puts the transport more than
0.25 s behind, which trips the re-anchor -- and the re-anchor is RIGHT and stays
(without it a nine-second stall booked seventy-two sixteenths at once, "not a
song coming in, a noise"), but it zeroes the musical position as well, so a
stalled phone does not merely drop beats, it restarts the song's form.

AND MY OWN LANE ALREADY WROTE THE LIMIT DOWN ON 9/5, in the pulse's comment:
"a setInterval beat is impossible here... a lookahead scheduler with a
four-second horizon still dies in a nine-second stall. SO IT IS ONE LOOPING
BUFFER... the audio thread does not care that the main thread is building a
city." That is an argument, so it was MEASURED against this transport at this
stall length, horizon patched at runtime, same 20-second window, 4x:

    horizon   booked        worst gap   music already COMMITTED (median/max)
    0.12 s    45/160 28.1%   6,121 ms      185 /  230 ms
    0.50 s    82/160 51.3%   6,449 ms      560 /  619 ms
    1.00 s    97/160 60.6%   2,708 ms    1,060 / 1,124 ms
    2.00 s   131/160 81.9%   8,171 ms    2,049 / 2,119 ms

TWO THINGS THAT TABLE SETTLES. A wider horizon really does recover beats, roughly
in proportion. And it CANNOT fix this, because the worst gap does not improve with
it at all (6,121 -> 6,449 -> 2,708 -> 8,171 is noise): a long stall is a long
stall, and the 9/5 sentence holds. So this is a dial that reduces the damage, not
a cure, and the cure is an audio-thread clock -- the next round of this row.

WHY ONE BEAT AND NOT A BIGGER WIN. The cost column is the whole argument: a booked
step cannot be un-booked, so the horizon is exactly how long the music takes to
obey a change. At 2 s the horizon nearly triples the beats that survive AND makes
a fight's music arrive two seconds late -- and FIGHTMUS takes the music
IMMEDIATELY on purpose, because danger is now, and this lane spent 9/15 giving the
start of a fight a sound he could hear. Trading his named complaint for a new one
is not a fix.

SO THE HORIZON BECOMES ONE BEAT, AND IT IS NOT A NUMBER I INVENTED: it is
4 * stepDur(), the engine's own unit, the same unit the whole game is quantised
to. Measured, that doubles the steps that survive a phone (28.1% -> 51.3%) and
commits at most one beat of music, which is the smallest amount this game is ever
allowed to change anything on anyway. The sting that marks a fight is untouched
either way: STING owns its own bus and lands on the next beat, outside the
transport.

REUSE CHECK: cooks nothing. No bank, no candidate, no pixel, no new sound, no new
event, and NO NEW NUMBER -- the horizon is derived from the engine's own stepDur.

  python3 tools/bohemia_the_horizon_is_one_beat.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__THE_HORIZON_IS_ONE_BEAT__'

OLD = "    while(MUS.nextT<MUS.AC.currentTime+0.12){"

NEW = (
    "    /* __THE_HORIZON_IS_ONE_BEAT__ (9/18, SOUNDS lane) -- THE HORIZON WAS 0.12 s\n"
    "       ON A THREAD THAT STALLS FOR SECONDS. PLUMBER measured the 120 BPM law\n"
    "       failing on a phone-shaped CPU (31.6% of beats late, 8.3% swallowed whole,\n"
    "       one beat in twelve never happening). Measured again here by wrapping\n"
    "       playStep, so the count is steps really handed to Web Audio: on a phone\n"
    "       only 42 of 160 steps in twenty seconds were booked at all, 26%, and even\n"
    "       on this fast box it is 128 of 160.\n"
    "       ONE BEAT, AND IT IS NOT A NEW NUMBER: 4 * stepDur() is the engine's own\n"
    "       unit, the unit this whole game is quantised to. Horizon patched at runtime\n"
    "       and swept at 4x: 0.12 s booked 28.1%, ONE BEAT booked 51.3%, 1 s 60.6%,\n"
    "       2 s 81.9%.\n"
    "       WHY NOT WIDER, WHICH WOULD SCORE BETTER. A booked step cannot be\n"
    "       un-booked, so the horizon IS how long the music takes to obey a change:\n"
    "       the same sweep measured 2,049 ms of music already committed at a 2 s\n"
    "       horizon against 560 ms at one beat. FIGHTMUS takes the music immediately\n"
    "       because danger is now, so a two-second horizon would make a fight's music\n"
    "       arrive two seconds late -- trading his own complaint for a new one. One\n"
    "       beat is the smallest amount this game ever changes anything on.\n"
    "       AND IT IS A DIAL, NOT A CURE, which the same sweep proves: the worst gap\n"
    "       with nothing booked does not improve with the horizon at all (6,121 ->\n"
    "       6,449 -> 2,708 -> 8,171 ms is noise). A long stall is a long stall. This\n"
    "       lane wrote the real answer down on 9/5 in the pulse's own comment -- an\n"
    "       audio-thread loop, which does not care what the main thread is doing --\n"
    "       and that is the next round of this row, not a number. */\n"
    "    while(MUS.nextT<MUS.AC.currentTime+(MUS.stepDur()*4)){"
)


def main():
    print('=== THE HORIZON IS ONE BEAT ===')
    src = open(ALPHA, encoding='utf8').read()
    if MARK in src:
        print('  already installed (idempotent, nothing to do)')
        return 0

    # POSITIVE CONTROLS ON THE PREMISE, every one measured this round.
    for word, why in (
            ('MUS.nextT < _n-0.25', 'the re-anchor this deliberately leaves alone'),
            ('stepDur', "the engine's own step unit, which the new horizon derives from"),
            ('playStep', 'the call the measurement counted'),
            ('a lookahead scheduler', "this lane's own 9/5 note naming the real limit")):
        if word not in src:
            print('FAIL: %s is gone; re-measure before trusting this fix' % why)
            return 1
    print('  PREMISE  the transport is already a lookahead scheduler, the re-anchor is '
          'where it was, and stepDur is the unit')

    if src.count(OLD) != 1:
        print('FAIL: the horizon line is not unique (%d)' % src.count(OLD))
        return 1
    src = src.replace(OLD, NEW, 1)
    open(ALPHA, 'w', encoding='utf8').write(src)
    print('  CHANGED  the scheduler books one beat ahead instead of 0.12 s')
    print('  On a phone only 26% of the beat was reaching the audio graph.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
