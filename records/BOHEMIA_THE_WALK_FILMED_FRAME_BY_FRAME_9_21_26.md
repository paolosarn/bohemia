# THE WALK, FILMED FRAME BY FRAME — ANIMATION, row [tape skip] round three, 9/21/26

## THE ONE THING THIS ROW HAD LEFT
Two rounds of this row ended with the same sentence: nobody has watched the walk
at sixty frames a second, because this container clamps a headless page to about
twenty and a beat holds sixty. Four cuts of a sampler were built and thrown away
before the obvious move.

**A RULER THAT SAMPLES SLOWER THAN THE THING IT MEASURES CANNOT WORK. THE CLOCK
IS THE THING TO CHANGE, NOT THE SAMPLER.**

`performance.now()` is stubbed, `render()` is called once at each of the sixty
moments a sixty-frame beat would land on, and the real canvas is read back.
Nothing is reconstructed: these are the pixels the game draws, at the moments it
would draw them. The fifth instrument is a different mechanism, not a fifth cut
of the fourth.

## AND THE QUESTION IS NOT "DID ANYTHING CHANGE"
The crowd breathes and the signals blink, so some pixel always changes. **A GROUND
MOVE REPAINTS THE STREET:** even five pixels of scroll changes nearly every ground
pixel. So the measure is how many drawn frames move MORE THAN A TWENTIETH OF THE
SCREEN AT ONCE. The first cut of this counted any change at all and scored TAPE
WORSE than SLIDE (48 frames against 30), which is the opposite of the truth and
was pure world churn.

## THE NUMBER THE ROW WAS OPENED FOR
Of sixty drawn frames in one beat, how many MOVE THE WORLD:

    on the alpha, walking       GRID 0      SLIDE 20      TAPE 2
    on the city page, twice     GRID -      SLIDE 33/27   TAPE 3/3

TAPE is 3 by construction: two dropped frames and the landing. It measured 3 on
both runs, so that number is the design, not a sample. SLIDE swings with world
churn and is never near it.

**THE PICTURES AGREE WITH THE NUMBERS.** The captured strip shows three frames of
held street, a jump, a frame, a second jump, then a settled street. The slide strip
shows a different street in every frame.

## SO THE ROW IS DONE, AND THE SHIP TEST IS NOT WHAT IT SAYS
The written ship test is "the one driver's walk with zero skating pixels (the
body's screen position changes only on the beat)". The RULING on the same line is
"two or three frames of the walk clip (a drop-out)". Those are different things:
taken literally the test asks for zero moves, which is GRID, which is what shipped
by accident and what this row was opened to replace.

Built to the ruling, and the ruling's own number is met exactly: TWO DROPPED
FRAMES, then the landing. WALK NEVER MISSES is green. Flagged on the board rather
than quietly picking one.

## WHAT THE THREE ROUNDS ACTUALLY FIXED
  1. A four-cell teleport ceiling written when a step was one cell, against a step
     that is now twenty-five, which had killed every full glide silently.
  2. The ground: hold, two dropped frames, land on the beat.
  3. The body: the same clock, so his legs stop striding while the street is still.
  4. Short presses: no skip, because nine of twelve presses are cut short and a
     drop-out over two cells is a twitch.
  5. The frame pick: one copy where there were two.

## THE GATE
gates/the_step_is_a_tape_skip_gate.js, 31 claims -> 35, green twice running.
The new claim is mutation-proven: make the tape ease like a slide and it goes
3 of 60 -> 37 of 60, and the control collapses with it. It carries a vacuous-pass
guard (a feel whose step was never caught fails rather than passes) and a control
(the same ruler must see the slide moving many times more often, or it is
measuring a broken renderer instead of a held ground).

## COOKED THIS ROUND (rule 22): THE TURN TAKES THE BEAT
Today there is no turn at all. `HFACE=dirOf(dx,dy)` assigns the facing the instant
the step runs, so he is facing south and then he is a different drawing facing
east on the very next frame. He already has eight drawings, one per direction, so
a turn is those drawings in order on the same hold-and-drop clock the street uses.
NO NEW ART. Registered in VOTE, NOT in the game: rule 18 keeps it off the play
surface, and the turn is not a row on the board, so it is a cook and nothing else.
  slices/vote/ANIMATION_THE_TURN_TAKES_THE_BEAT.html
  slices/vote/ANIMATION_THE_TURN_TAKES_THE_BEAT.png   the eight shipped facings
