#!/usr/bin/env python3
"""
BOHEMIA - THE STREETS HAVE A TWO-SONG POOL AT DUSK, AND THE CLOCK IS INAUDIBLE.

TWO MECHANISM BUGS IN THE OVERWORLD SHUFFLE. Neither needs a verdict from Paolo,
neither touches a note of his music, and both were found by counting rather than
by reading.

=== WHAT THE POOLS ACTUALLY ARE ============================================

Measured off CAT_DEFAULTS + the hardcoded OVERWORLD set in CITYMUS:

    OVERWORLD NIGHT        10 songs
    OVERWORLD DAY           5 songs
    OVERWORLD DUSK/DAWN     2 songs      <-- TWO
    eligible for the overworld at all: 17 of 132

That is not a bug, it is his OVERWORLD PLAYLIST LAW (7/7: "the overworld plays
ONLY the creepers") plus how many he has tagged so far. The pools are his.

WHAT IS MINE is that pick() draws uniformly at random from the pool EVERY pass,
with no memory of what just played. With a two-song pool that is a coin flip:

    dusk / dawn   50% chance the next song is the one that just ended
    day           20%
    night         10%

A repeat back to back does not read as "shuffle", it reads as broken, and it is
loudest exactly where the pool is thinnest. A pool of two played with no memory
sounds like a pool of one and a half.

FIX 1: NO REPEAT. pick() drops the song that is currently playing from the
candidate list, but only when the pool has more than one thing in it. Two songs
now strictly alternate at dusk instead of coin-flipping, five rotate at day.
It costs one filter and it makes every pool feel like the size it actually is.

    This is mechanism, not content. It chooses nothing for him: the pool is
    still exactly the songs he tagged, and the verdict weighting (canon 8x,
    graveyarded 1x, unjudged 4x) is untouched.

=== 2. THE WORLD CLOCK MOVES AND THE MUSIC DOES NOT NOTICE FOR TWO MINUTES ===

The overworld shuffle only ever reconsiders which song to play at the END of a
64-bar pass. At 120 BPM (BEAT=0.5s, 16 steps to the bar) that pass is:

    1024 steps x 0.125s = 128 seconds, over two minutes

So when dawn breaks, the night pool keeps playing for up to another two minutes.
The phase wire shipped on 8/4 sets CITYMUS.phase the moment the clock crosses
06:00, and then nothing can be heard for two minutes. A clock you cannot hear is
not a clock -- the entire point of having NIGHT / DAY / DUSK+DAWN pools is that
the valley sounds different when the light changes.

FIX 2: A PHASE CHANGE IS HEARD AT THE NEXT 8-BAR BOUNDARY. Not instantly, and
that is deliberate on two counts:

    120 BPM LAW: everything quantizes to the beat. Cutting a song the instant a
    minute ticks over is an audible seam, and this game does not do audible
    seams.
    8 bars is one musical phrase at this tempo (16 seconds). Long enough that
    the turn lands on a phrase end and sounds intended, short enough that dawn
    is a thing you notice rather than a thing you miss.

    Worst case drops from 128 seconds to 16.

The pending turn is armed ONLY by a real phase change (the wire already guards
on LASTPHASE, so a clock report that does not cross a boundary arms nothing),
and only while the shuffle is actually on.

REUSE CHECK: no graphics and no audio are cooked here. This edits the existing
CITYMUS body in place -- pick() and the watch interval -- and uses MUS.step, the
step counter the engine already runs the whole mix on. Nothing new is
synthesised, no bank is opened, no category is invented, and no song is tagged.
The category vocabulary stays MUS.mcats() and the tags stay CAT_DEFAULTS: MUSIC
CATEGORY LAW (7/19) says the list is HIS, and MECHANISM-MINE / CONTENTS-PAOLO'S
says I do not fill in what he reserved.

WHAT THIS DOES NOT DO, on purpose: 85 of his 110 canon songs carry no category
at all, so 115 of 132 can never reach the overworld. That is NOT a bug to fix
here. Most of them are faction and action themes that correctly do not belong in
the streets, and deciding which of the rest do is exactly the ruling he reserved.
It is reported, not resolved.
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')

# --- FIX 1 -----------------------------------------------------------------
# The smallest stable substring, not the whole line. Whole-line anchors broke
# three separate times in this lane in one day, every time because somebody else
# edited a comment on the same line.
PICK_OLD = "  pick(){ const cs=this.candidates(); if(!cs.length)return null;"
PICK_NEW = """  /* NO REPEAT BACK TO BACK (8/7). pick() drew uniformly with no memory of what
     just played, and the pools are small: DUSK/DAWN is TWO songs, so it was a
     coin flip whether dawn played the same track twice in a row. A pool of two
     with no memory sounds like a pool of one and a half. Drop what is playing,
     but ONLY when there is something else to play -- with a one-song pool the
     filter would empty the list and the streets would go silent, which is the
     opposite of the failsafe candidates() exists to provide. Chooses nothing
     for him: same pool, same verdict weighting. */
  pick(){ let cs=this.candidates(); if(!cs.length)return null;
    if(cs.length>1){ const fresh=cs.filter(c=>!(c.fi===MUS.cur&&c.slot===MUS.curSlot));
      if(fresh.length)cs=fresh; }"""

# --- FIX 2 -----------------------------------------------------------------
WATCH_OLD = ("    this.watch=setInterval(()=>{ if(!CITYMUS.on)return;\n"
             "      if(MUS.step>=1024){ CITYMUS.play(); } },400); },")
WATCH_NEW = """    this.watch=setInterval(()=>{ if(!CITYMUS.on)return;
      if(MUS.step>=1024){ CITYMUS.pend=false; CITYMUS.pendAt=null; CITYMUS.play(); return; }
      /* A PHASE CHANGE IS HEARD AT THE NEXT 8-BAR BOUNDARY (8/7). The shuffle
         only reconsidered at the end of a 64-bar pass, which at 120 BPM is 128
         seconds -- so dawn could break and the night pool would keep playing
         for over two minutes. A clock you cannot hear is not a clock. 8 bars
         (128 steps, 16 seconds) is one phrase at this tempo: the turn lands on
         a phrase end so it sounds intended, per the 120 BPM LAW, instead of
         cutting the instant a minute ticks over. */
      if(CITYMUS.pend){
        if(CITYMUS.pendAt==null) CITYMUS.pendAt=(Math.floor(MUS.step/128)+1)*128;
        if(MUS.step>=CITYMUS.pendAt){ CITYMUS.pend=false; CITYMUS.pendAt=null; CITYMUS.play(); }
      } },400); },"""

# the hook the phase wire calls, plus the state it needs
HOOK_OLD = "  phaseCat(){ return this.phase==='DAY'"
HOOK_NEW = """  pend:false, pendAt:null,
  /* THE PHASE WIRE CALLS THIS. It only ever arms a turn -- it never plays, so a
     clock report cannot interrupt anything by itself, and the wire already
     guards on LASTPHASE so a report that does not cross a boundary arms nothing. */
  onPhaseChange(){ if(this.on){ this.pend=true; this.pendAt=null; } },
  phaseCat(){ return this.phase==='DAY'"""


def main():
    if not os.path.exists(ALPHA):
        print('FAIL: no alpha at %s' % ALPHA)
        return 1
    s = open(ALPHA, encoding='utf8').read()
    did = []

    # IDEMPOTENT BY REPLACEMENT, NEVER BY REFUSAL -- but these are in-place edits
    # to a hand-authored body rather than a block this tool owns, so each one
    # checks for its own result and skips only that edit.
    if 'NO REPEAT BACK TO BACK' in s:
        did.append('no-repeat already in place')
    elif PICK_OLD in s:
        s = s.replace(PICK_OLD, PICK_NEW, 1)
        did.append('no-repeat installed')
    else:
        print('FAIL: cannot find CITYMUS.pick to make it stop repeating')
        return 1

    if 'A PHASE CHANGE IS HEARD' in s:
        did.append('8-bar phase turn already in place')
    elif WATCH_OLD in s:
        s = s.replace(WATCH_OLD, WATCH_NEW, 1)
        did.append('8-bar phase turn installed')
    else:
        print('FAIL: cannot find the CITYMUS watch interval')
        return 1

    if 'onPhaseChange(){' in s:
        did.append('phase hook already in place')
    elif HOOK_OLD in s:
        s = s.replace(HOOK_OLD, HOOK_NEW, 1)
        did.append('phase hook installed')
    else:
        print('FAIL: cannot find CITYMUS.phaseCat to hang the hook next to')
        return 1

    open(ALPHA, 'w', encoding='utf8').write(s)
    print('THE STREETS STOP REPEATING THEMSELVES AND THE CLOCK IS AUDIBLE.')
    for d in did:
        print('  ' + d)
    print('  DUSK/DAWN was a 2-song pool drawn with no memory: a coin flip on repeat')
    print('  a phase change was inaudible for up to 128s; now 16s, on a phrase end')
    return 0


if __name__ == '__main__':
    sys.exit(main())
