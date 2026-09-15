#!/usr/bin/env python3
"""
A FIGHT STARTING MAKES A SOUND (9/15/26, SOUNDS lane) -- the sound half of his
own sentence, and the game had the END of a fight covered and not the START.

*** PAOLO 9/15, his second play of the demo: "I don't even know how to engage in
combat and when that shit starts." EYES E26 round 6 item 3, the same round: 55
fight words exist in the demo and a player can read ZERO of them. ***

MEASURED ON THE REAL ALPHA, not grepped. Three funnels were tapped at once --
BOH_SFX.render (every one-shot in the game goes through it), STING.play, and a
property setter on MUS.cur so every song change names its writer -- then an
8-second CONTROL window on the street with nothing pressed, then a real street
fight through the shell's own cityEncounterIn, then the same 8 seconds again:

    CONTROL   song SLOW BLEED    0 stings   1 one-shot (the phone buzzing)
    FIGHT     fight starts at 8.13 s
              9.378 s  MUS.cur -> BLUES -> CARTEL   (the faction pick, two writes)
              0 STINGS. 0 ONE-SHOTS. master 0.8 before and 0.8 after.

THE WHOLE AUDIBLE TELL THAT A FIGHT HAS BEGUN IS THAT THE SONG IS A DIFFERENT
SONG, 1.25 SECONDS LATE, MID-PHRASE, AT THE SAME VOLUME. A player who did not
happen to be watching the camera pull back hears a shuffle, which is what the
street does on its own every 128 seconds anyway.

AND THE ASYMMETRY IS THE FINDING: the END of a fight has had a sting since 8/19
(STING 'win' / 'loss', on the next beat, over the running score). So does getting
paid, missing a job, finishing a job, and taking one. SIX FIGURES, FOR SIX
MOMENTS, AND NOT ONE OF THEM IS THE MOMENT THE DANGER ARRIVES.

> **WE SCORED EVERY OUTCOME AND NEVER SCORED THE CAUSE.**

THE FIX IS ONE FIGURE AND ONE CALLER, and it cooks nothing. STING already does
all of the hard parts: it has no key of its own (it reads the root of whatever is
playing and builds from intervals that are consonant in every scale in the file,
which is why there is no third in any figure), it lands ON THE NEXT BEAT rather
than the raw instant, 120 BPM law, and it owns its own bus so the music master
ducking cannot swallow it. A seventh figure joins the family:

    taken   you commit        root -> FOURTH, rising, unresolved
    paid    you get paid      root -> fifth,  rising, settled
    missed  you let it go     fifth -> root,  falling
    done    you finish it     IV -> I, plagal
    win     you won           rising, and it keeps rising
    loss    you died          falling, and it lands heavy
    fight   IT IS STARTING    THE ROOT, STRUCK LOW, THEN STRUCK AN OCTAVE UP

THE FIGURE IS THE ROOT ITSELF AND NOTHING ELSE, ON PURPOSE. An alarm is made by
ATTACK and REGISTER, not by dissonance -- and dissonance is forbidden here anyway
(a tritone written once is out of tune with almost all of 142 songs). So this is
the one pitch that cannot be wrong in any key: the root, low, hit on the beat,
then the same pitch class an octave up on the next beat. Two beats, one second at
120 BPM, rising -- which is the opposite of `loss`, and it means this is not over.
Danger is now.

*** AND THE FIRST VERSION OF THIS FIGURE CLIPPED, CAUGHT BY MEASURING IT AND NOT
BY READING IT. *** I wrote the second hit as the root AND the fifth together, for
size. Rendered through the real synthV, the two notes land on the SAME 16th step
and SUM: peak 0.9338 into a 0.8 master, which is 2.5x the loudest figure the
family had. Five candidates were rendered and the level decided it:

    root + fifth on one step (shipped first)   peak 0.9338   CLIPS
    root twice, bare                           peak 0.4468
    ROOT THEN OCTAVE UP, sequential            peak 0.4681   <- chosen
    root, octave, then fifth                   peak 0.4633
    the same at g 0.22                          peak 0.3875
    for scale: done 0.3769, loss 0.3590, win 0.2171, taken 0.1244

The chosen figure is the loudest in the family by peak (1.24x `done`) and NOT the
densest by rms (0.0386 against `loss`'s 0.0565), which is exactly what an alarm
is: it is the attack that carries it, not the weight. TWO NOTES THAT SUM ARE ONE
LOUDER NOTE, and the fifth I wanted for size was decoration against my own stated
principle in the paragraph above it.

THE VOICE WAS PICKED BY NUMBER, the way `done` picked `bell` (8/20). Sixteen
candidates rendered through the REAL synthV offline, four numbers each:

    taiko          peak 0.450  rms 0.049  attack 0.0030 s  body 0.151 s   <- chosen
    timpani        peak 0.384  rms 0.045  attack 0.0016 s  body 0.181 s
    subboom        peak 0.360  rms 0.039  attack 0.0209 s  body 0.151 s
    taiko2         peak 0.417  rms 0.031  attack 0.0008 s  body 0.079 s
    heartbeatsub   peak 0.160  rms 0.017  attack 0.0168 s  body 0.143 s
    ironheart      peak 0.154  rms 0.032  attack 0.0299 s  body 0.240 s

taiko has the fastest attack of anything that also has level and body, and his
complaint is that the moment is MISSABLE, so attack and level are the two axes
that matter. The two that lost on numbers are the two I wanted on feel:
`heartbeatsub` and `ironheart` are the body rather than the world, which is the
right idea (the tell is your own adrenaline, not a machine somebody built), and
they are 2.8x quieter with a ten times slower attack. They would have been
missable, which is the bug. A STRUCK DRUM also needs no source in the fiction --
his own sound law asks for "ethnic instruments for place" and "a drum machine on
a battery", so a drum is the most ordinary instrument this valley could own, and
an air-raid siren would have been a machine the world does not have.

THE CALLER IS FIGHTMUS.enter(), which is this lane's own module and the single
place the shell learns a fight has begun (startEncounter calls it, for every
fight: a walked-into party, a quest fight, the cold open). It already carries
`if(this.on)return;` so it fires once per fight, and STING's own GAP:2500 means
two fights in a row can never make a burst. Nothing in combat's code is touched.

REUSE CHECK: cooks nothing. No bank, no candidate, no pixel, no new sound, no new
event, no new number -- `taiko` is a voice the rack already had, the beat is the
engine's own, and the bus, the root lookup and the quantisation are STING's.

  python3 tools/bohemia_a_fight_starting_makes_a_sound.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__A_FIGHT_STARTING_MAKES_A_SOUND__'

# ---- 1. THE SEVENTH FIGURE ------------------------------------------------
FIG_OLD = """    taken:  { v:'coldpiano', g:0.19, sd:0.22, oct:0,
            n:[[0,0],[5,3]] },"""

FIG_NEW = """    taken:  { v:'coldpiano', g:0.19, sd:0.22, oct:0,
            n:[[0,0],[5,3]] },
    /* __A_FIGHT_STARTING_MAKES_A_SOUND__ (9/15) -- IT IS STARTING.
       PAOLO 9/15: "I don't even know how to engage in combat and when that shit
       starts." Measured on the real alpha with BOH_SFX.render, STING.play and a
       setter on MUS.cur all tapped at once: a street fight started at 8.13 s and
       produced ZERO stings, ZERO one-shots and no level change. The only audible
       tell was the song becoming a faction song 1.25 s later, mid-phrase, at the
       same volume -- which is what the street's own shuffle does anyway.
       WE SCORED EVERY OUTCOME AND NEVER SCORED THE CAUSE: win, loss, paid,
       missed, done and taken are six figures for six moments, and not one of
       them is the moment the danger arrives.
       THE FIGURE IS THE ROOT AND NOTHING ELSE. An alarm is made by ATTACK and
       REGISTER, not by dissonance, and dissonance is forbidden in this family
       anyway -- a tritone written once is out of tune with almost all of 142
       songs. The root is the one pitch that cannot be wrong in any key: struck
       low on the beat, then the same pitch class an octave up on the next beat.
       Two beats, one second at 120 BPM, RISING, which is the opposite of `loss`
       and means this is not over. Danger is now, the same reason FIGHTMUS takes
       the music immediately.
       VOICE PICKED BY NUMBER, the way `done` picked bell: 16 candidates rendered
       through the real synthV offline, and taiko has the fastest attack
       (0.0030 s) of anything that also has level (peak 0.450) and body
       (0.151 s). heartbeatsub and ironheart were the two I wanted on feel and
       they lost on the only two axes his complaint is about -- 2.8x quieter,
       attack ten times slower, so they would have been MISSABLE, which is the
       bug. A struck drum also needs no source in the fiction, where a siren
       would have been a machine this valley does not have.
       AND THE FIRST CUT OF THIS FIGURE CLIPPED. It had the root AND the fifth on
       the same 16th step, for size; rendered, the two notes SUM to peak 0.9338
       into a 0.8 master, 2.5x the loudest figure here. Sequential now: peak
       0.4681, the loudest in the family by peak (1.24x `done`) and NOT the
       densest by rms (0.0386 against loss's 0.0565), which is what an alarm is.
       TWO NOTES THAT SUM ARE ONE LOUDER NOTE. */
    fight:  { v:'taiko',     g:0.26, sd:0.16, oct:-12,
            n:[[0,0],[12,4]] },"""

# ---- 2. THE CALLER -------------------------------------------------------
CALL_OLD = """      CITYMUS.on=false; CITYMUS.pend=false; CITYMUS.pendAt=null;
      if(CITYMUS.watch){clearInterval(CITYMUS.watch); CITYMUS.watch=null;}
    }catch(e){}
  },"""

CALL_NEW = """      CITYMUS.on=false; CITYMUS.pend=false; CITYMUS.pendAt=null;
      if(CITYMUS.watch){clearInterval(CITYMUS.watch); CITYMUS.watch=null;}
    }catch(e){}
    /* __A_FIGHT_STARTING_MAKES_A_SOUND__ (9/15) -- AND THE MOMENT IS MARKED.
       See STING.FIG.fight for the measurement and the figure. This is the single
       place the shell learns a fight has begun -- startEncounter calls it for a
       walked-into party, a quest fight and the cold open alike -- and the
       `if(this.on)return;` above means once per fight, while STING's own
       GAP:2500 means two fights in a row cannot make a burst.
       LAST, AND WRAPPED, so nothing about scoring the moment can stop a fight
       from starting; and AFTER the stand-down, so the sting is scheduled against
       the music state the fight actually begins in. STING owns its own bus, so
       ducking the music master can never swallow it. */
    try{ if(window.STING)STING.play('fight'); }catch(e){}
  },"""


def main():
    print('=== A FIGHT STARTING MAKES A SOUND ===')
    src = open(ALPHA, encoding='utf8').read()
    if MARK in src:
        print('  already installed (idempotent, nothing to do)')
        return 0

    # POSITIVE CONTROLS ON THE PREMISE, every one measured this round.
    for word, why in (
            ("win:  { v:'glasshope'", 'the win sting'),
            ("loss: { v:'subboom'", 'the loss sting'),
            ("kind==='taiko'", 'the taiko voice in the rack'),
            ('const FIGHTMUS=', "this lane's fight-music module")):
        if word not in src:
            print('FAIL: %s is gone; re-measure before trusting this fix' % why)
            return 1
    if "fight:  { v:" in src:
        print('FAIL: a figure named fight already exists; refusing to shadow it')
        return 1
    print('  PREMISE  the end of a fight has a sting, the start has none, and the '
          'voice the numbers chose is in the rack')

    for old, new, what in ((FIG_OLD, FIG_NEW, 'the seventh figure'),
                           (CALL_OLD, CALL_NEW, 'the caller in FIGHTMUS.enter')):
        if src.count(old) != 1:
            print('FAIL: %s anchor is not unique (%d)' % (what, src.count(old)))
            return 1
        src = src.replace(old, new, 1)
        print('  ADDED    %s' % what)

    open(ALPHA, 'w', encoding='utf8').write(src)
    print('  A fight started and made no sound at all. Now it hits twice, on the beat.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
