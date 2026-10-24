#!/usr/bin/env python3
"""
BOHEMIA - THE ONE BEAT (SOUNDS 10/24/26, row [more music, on the one beat], rule 158).

PAOLO 10/24, LOCKED: 'every time you press a button it's a request, and the game will do those actions on the BPM of
how it's supposed to be; everything is supposed to be on this BPM clock of the music, and we totally lost sight of that
in this revamp... I know some of the songs are more like background hums and without drums, but we have made this
universal BPM music thing for a whole reason, just to give that extra layer of love.'

WHAT THIS PATCH PUTS IN THE ALPHA (the demo is cut from it by tools/bohemia_cut_the_demo.js):
  1. __THE_ONE_BEAT__: the grid and its reader (tools/bohemia_sounds_the_one_beat_block.js, inlined verbatim):
     window.BOHEMIA_BEAT.next(div, leadMs) / now() / epoch(), the fight frame handed the object and a message a beat.
  2. The transport's scheduler stamps every beat it books into the live context (__beatBooked), as heard.
  3. A song swap (the three places the transport is re-pointed while playing), a song start and a stall land the new
     song's first note on the next beat of the same grid (__beatNext) instead of 'now + 0.06 s', a random phase.
     The song's bar still starts over with the song (step 0), so every watcher that reads a step going back to 0 as
     'a new song' (FIGHTMUS.leave, the drum hold, the intensity's top of a bar) reads exactly what it read before.

Idempotent: the block sits between markers and is replaced on a re-run; every edit checks for its own result.
  python3 tools/bohemia_sounds_the_one_beat_patch.py
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
BLOCK = os.path.join(ROOT, 'tools', 'bohemia_sounds_the_one_beat_block.js')
START = '<!-- __THE_ONE_BEAT__ (SOUNDS 10/24, rule 158) -->\n<script>\n'
END = '</script>\n<!-- /__THE_ONE_BEAT__ -->\n'
NEXT = 'window.__beatNext?window.__beatNext('


def die(msg):
    print('THE ONE BEAT PATCH: ' + msg)
    sys.exit(1)


def once(s, old, new, done_mark, what, count=1):
    """replace old with new (count times exactly), unless done_mark is already in s"""
    if done_mark in s:
        return s
    n = s.count(old)
    if n != count:
        die('%s: anchor found %d times, wanted %d' % (what, n, count))
    return s.replace(old, new)


def main():
    s = open(ALPHA, encoding='utf-8').read()
    block = open(BLOCK, encoding='utf-8').read().rstrip() + '\n'

    # 1. the grid, its own script, beside the run's beat bridge (which it does not replace: the run keeps its message)
    if START in s:
        a = s.index(START)
        b = s.index(END, a) + len(END)
        s = s[:a] + START + block + END + s[b:]
    else:
        anchor = '<!-- BOHEMIA RUN BEAT BRIDGE (7/29/26) -->'
        if s.count(anchor) != 1:
            die('the block: anchor found %d times' % s.count(anchor))
        s = s.replace(anchor, START + block + END + anchor)

    # 2. the scheduler stamps every beat it books
    s = once(s,
             '    MUS.playStep(MUS.step%16,MUS.nextT,MUS.songCtx(MUS.step)); MUS.uiStep=MUS.step%16;\n',
             '    MUS.playStep(MUS.step%16,MUS.nextT,MUS.songCtx(MUS.step)); MUS.uiStep=MUS.step%16;\n'
             '    try{ window.__beatBooked&&window.__beatBooked(MUS.nextT,MUS.step); }catch(_e){}   /* __THE_ONE_BEAT__ 10/24: the grid is what was booked */\n',
             'window.__beatBooked&&window.__beatBooked(MUS.nextT,MUS.step)', 'the scheduler stamp')

    # 3. a song swap while playing lands on the next beat of the same grid (three places re-point the transport)
    s = once(s,
             'MUS.nextT=MUS.AC.currentTime+0.06;',
             'MUS.nextT=(' + NEXT + 'MUS.AC.currentTime+0.06):MUS.AC.currentTime+0.06);   /* __THE_ONE_BEAT__ 10/24: a new song comes in on the beat */',
             'MUS.nextT=(' + NEXT + 'MUS.AC.currentTime+0.06)', 'the swaps', count=3)

    # 4. a song starting with no pulse to land on
    s = once(s,
             ' this.nextT=(_pb&&_pb>this.AC.currentTime+0.02)?_pb:(this.AC.currentTime+0.06);',
             ' this.nextT=(_pb&&_pb>this.AC.currentTime+0.02)?_pb:(' + NEXT + 'this.AC.currentTime+0.06):this.AC.currentTime+0.06);   /* __THE_ONE_BEAT__ 10/24 */',
             '(' + NEXT + 'this.AC.currentTime+0.06)', 'the start')

    # 5. a stall: the song picks up on the grid's next beat, not at a random phase
    s = once(s,
             '      MUS.nextT=(_p&&_p>_n+0.02)?_p:(_n+0.06); MUS.step=0; MUS.uiBar=0;',
             '      MUS.nextT=(_p&&_p>_n+0.02)?_p:(' + NEXT + '_n+0.06):_n+0.06); MUS.step=0; MUS.uiBar=0;   /* __THE_ONE_BEAT__ 10/24 */',
             '(' + NEXT + '_n+0.06)', 'the stall')

    open(ALPHA, 'w', encoding='utf-8').write(s)
    print('THE ONE BEAT PATCH: the alpha carries the grid (%d bytes of block)' % len(block))


if __name__ == '__main__':
    main()
