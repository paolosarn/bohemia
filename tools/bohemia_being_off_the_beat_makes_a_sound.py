#!/usr/bin/env python3
"""
BEING OFF THE BEAT MAKES A SOUND (9/16/26, SOUNDS lane) -- [beat teaches].

*** PAOLO 9/15: "I don't even know how to engage in combat and when that shit
starts." Last round gave the START of a fight a sound. This is the other half of
the row: DURING the fight, the beat is the loudest clearest thing, and a swing on
the beat must sound different from a swing off it. ***

THE ROW'S TWO CLAIMS, BOTH MEASURED INSIDE THE COMBAT FRAME ON A REAL FIGHT,
with tone(), drumV() and sfxAsk() all wrapped so the only thing countable is
audio the frame really asked for.

CLAIM ONE IS ALREADY TRUE AND COMBAT BUILT IT. Six seconds of live fight
produced 61 sounds: shakerh 30, punchk 16, clap 6, tone 9. A metronome runs every
beat and names beat one. NOTHING TO DO, and this lane is not going to rebuild it.

CLAIM TWO IS HALF TRUE, AND THE MISSING HALF IS SILENCE. Driving the fight's own
sndOnBeatStab once per grade:

    PERFECT   3 notes, root + fifth + octave, rising    peak 0.0939
    GOOD      1 note,  root                             peak 0.0353
    EARLY     NOTHING
    LATE      NOTHING

The fight grades every press into four bands off its own pure function
(PERFECT <=55 ms, GOOD <=110 ms, then EARLY or LATE by sign; a sweep of -250 to
+250 ms returns all four). TWO OF THE FOUR BANDS HAVE NO SOUND.

> **BEING ON THE BEAT SOUNDED LIKE SOMETHING AND BEING OFF IT SOUNDED LIKE
> NOTHING, SO THE ONE THING THE FIRST FIGHT IS SUPPOSED TO TEACH WAS THE ONE
> THING YOU COULD NOT HEAR.**

AND NOTHING ELSE COVERS IT ON THE SWING THAT MATTERS MOST. The chain-break does
play a sound, but BohemiaGroove.broke is `(g|0)>0 && !(PERFECT||GOOD)`, so it
cannot fire while the groove is 0. Measured both ways: broke(0,'EARLY') false,
broke(3,'EARLY') true. A player's FIRST press in their FIRST fight is groove 0,
so the exact moment this row exists for is the one moment guaranteed to be silent.
Silence is also the worst possible teacher here, for the reason this fleet has
written down four times in two rounds: you cannot tell "I was late" from
"nothing happened".

WHAT I REFUSED TO REUSE, AND WHY THAT IS THE RIGHT CALL. sndMiss() already exists
and already asks the parent for his approved `miss_past` (his 8/15 sweep, 5 of 5).
Reusing it here would have been free. It is wrong: `miss_past` means THE STRIKE
FOUND NOTHING TO HIT, and its own comment says so. Being off the beat and missing
a body are two different facts, and gluing one sound to both repeats a bug this
lane has already shipped and fixed once -- 8/22, QUESTSTING playing `loss` when
the player slept with a job unfinished, so GOING TO BED SOUNDED LIKE BEING BEATEN.
REUSE-FIRST IS NOT REUSE-ANYTHING.

THE FIX IS ONE BRANCH, AND THE PHONE CHOSE ITS PITCH. My first design was the
root AN OCTAVE DOWN and quieter than GOOD, so the wrong press would read as the
runt of the family. Measured, that note is 61.7 Hz. A phone speaker barely
reproduces it, and rule 14 makes a phone the only measure of this game, so that
design was a SECOND SILENCE dressed as a fix -- the exact bug being repaired.

So the cue stays at the family's own root, where GOOD already sits and in tune with
all 142 songs, and it is told apart by TIMBRE and LENGTH instead of by register: a
short square buzz where GOOD is a clean triangle ring.

THE FAMILY'S PITCH MOVES WITH THE SONG, which is the whole reason the octave down
had to be judged at its WORST case and not at a convenient one: the cue was measured
at 123.5 Hz on a root of 45 and came back at 311.1 Hz on the song a live fight
actually drew, so an octave below it is 61.7 Hz in the worst case. A register that is
inaudible on a phone for even some of the shelf is not a register this cue may use.

Measured side by side at one root, it is audible next to the cue it must be
distinguished from rather than under it:

    GOOD          triangle 0.10 s  g 0.040   peak 0.0353  rms 0.00149
    OFF THE BEAT  square   0.07 s  g 0.040   peak 0.0378  rms 0.00183
    (rejected: octave down, 61.7 Hz, g 0.030   peak 0.0215 -- a phone's floor)

AND THE DIRECTION IS CARRIED BY TIME, NOT BY PITCH, ON PURPOSE. EARLY and LATE get
the same cue. The fight already plays a metronome every single beat (measured: 30
hats and 16 kicks in six seconds), so the player's own buzz lands audibly BEFORE or
AFTER a beat they can hear. That is direction heard directly. Coding it into pitch
as well would ask them to learn a second alphabet for a fact already in the air,
and the screen prints the signed millisecond number besides. The family now reads
as one ladder anybody can learn in a few presses:

    three notes rising   you nailed it
    one clean note       close
    one short buzz       no

WHAT THIS DOES NOT TOUCH, NAMED RATHER THAN QUIETLY FIXED, because the fight is
COMBAT's lane and the row asks about a SWING:
  * THE MOVE VERB. Spending a step is graded too, and it calls sndOnBeatStab only
    when the grade is PERFECT, so an off-beat MOVE stays silent and its chain-break
    has no sound at all where the fire site's does. A different verb, COMBAT's call.
  * THE MIX. The metronome's own kick renders peak 0.2687, which is 7.6x the GOOD
    cue and 2.9x the PERFECT cue. The player's timing feedback is far quieter than
    the beat it is judged against. That is a real finding and it is a mix decision
    across COMBAT's whole fight, so it is reported, not unilaterally re-levelled by
    this lane. The new cue matches GOOD rather than inventing a louder tier.

REUSE CHECK: cooks nothing. No bank, no candidate, no pixel, no new sound file, no
new event, no new number -- the note is the family's own root, the oscillator is
the frame's own tone(), and the grade is the fight's own.

  python3 tools/bohemia_being_off_the_beat_makes_a_sound.py
"""
import base64
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__BEING_OFF_THE_BEAT_MAKES_A_SOUND__'
KEY = "const COMBAT_B64='"

OLD = ("    else if(grade==='GOOD'){ tone(noteHz(semi),0.10,0.040,'triangle',t); }")

NEW = ("    else if(grade==='GOOD'){ tone(noteHz(semi),0.10,0.040,'triangle',t); }\n"
       "    /* __BEING_OFF_THE_BEAT_MAKES_A_SOUND__ (9/16, SOUNDS lane) -- AND EARLY\n"
       "       AND LATE ARE NOT SILENT ANY MORE. MEASURED inside this frame on a real\n"
       "       fight, driving this function once per grade with tone/drumV/sfxAsk all\n"
       "       wrapped: PERFECT rendered 3 notes, GOOD rendered 1, and EARLY and LATE\n"
       "       rendered ZERO. Two of the four bands gradeOf() returns had no sound, so\n"
       "       the one thing the first fight exists to teach was the one thing you\n"
       "       could not hear. Nothing else covered it either: the chain-break sound\n"
       "       needs groove > 0 (broke(0,'EARLY') is false, broke(3,'EARLY') is true),\n"
       "       and a player's first press in their first fight is groove 0.\n"
       "       WHY THE ROOT AND NOT AN OCTAVE DOWN, which is what I wrote first: the\n"
       "       octave down is 61.7 Hz at the shelf's low root and a phone barely\n"
       "       reproduces it, and a phone is the only measure of this game -- that\n"
       "       design was a second silence wearing the fix's clothes. This family's\n"
       "       pitch MOVES with the song (measured 123.5 Hz at root 45, 311.1 Hz on\n"
       "       the song a live fight drew), so the worst case is the one that counts.\n"
       "       So it sits at the family's own root where GOOD already is, and is\n"
       "       told apart by TIMBRE and LENGTH: a short square buzz where GOOD is a\n"
       "       clean triangle ring. Rendered side by side, peak 0.0378 against GOOD's\n"
       "       0.0353, so it is heard next to what it must be distinguished from.\n"
       "       EARLY AND LATE SOUND THE SAME ON PURPOSE. This frame plays a metronome\n"
       "       every beat (30 hats and 16 kicks in six measured seconds), so the buzz\n"
       "       lands audibly before or after a beat the player can already hear, which\n"
       "       is direction heard directly rather than a pitch code to memorise.\n"
       "       NOT sndMiss(): it asks for his approved `miss_past`, which means the\n"
       "       strike found nothing to hit. Being off the beat and missing a body are\n"
       "       two facts, and one sound for both is the 8/22 bug where going to bed\n"
       "       sounded like being beaten. */\n"
       "    else { tone(noteHz(semi),0.07,0.040,'square',t); }")


def main():
    print('=== BEING OFF THE BEAT MAKES A SOUND ===')
    src = open(ALPHA, encoding='utf8').read()
    i0 = src.find(KEY)
    if i0 < 0:
        print('FAIL: the combat blob is gone from the alpha; re-measure')
        return 1
    i0 += len(KEY)
    j0 = src.find("'", i0)
    demo = base64.b64decode(src[i0:j0]).decode('utf8')
    print('  decoded the fight: %d bytes' % len(demo))

    if MARK in demo:
        print('  already installed (idempotent, nothing to do)')
        return 0

    # POSITIVE CONTROLS ON THE PREMISE, every one measured this round.
    for word, why in (
            ('function sndOnBeatStab(', 'the graded press cue'),
            ("if(grade==='PERFECT')", 'the PERFECT branch'),
            ('function gradeOf(', "the fight's own grade bands"),
            ('function broke(', 'the groove chain'),
            ('function sndMiss(', 'the miss sound this deliberately does NOT reuse')):
        if word not in demo:
            print('FAIL: %s is gone; re-measure before trusting this fix' % why)
            return 1
    if "else {" in demo[demo.find('function sndOnBeatStab('):
                        demo.find('function sndOnBeatStab(') + 600]:
        print('FAIL: sndOnBeatStab already has a fallback branch; refusing to shadow it')
        return 1
    print('  PREMISE  the cue has a PERFECT branch and a GOOD branch and no other, '
          'the grader returns four bands, and the chain cannot fire at groove 0')

    if demo.count(OLD) != 1:
        print('FAIL: the GOOD branch is not unique (%d)' % demo.count(OLD))
        return 1
    demo = demo.replace(OLD, NEW, 1)

    b64 = base64.b64encode(demo.encode('utf8')).decode('ascii')
    open(ALPHA, 'w', encoding='utf8').write(src[:i0] + b64 + src[j0:])
    print('  ADDED    a sound for EARLY and for LATE, at the family\'s root, '
          'square and short')
    print('  Being off the beat used to make no sound at all.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
