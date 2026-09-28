# SIX MORE WALKS HAD THE SAME LIMP (ANIMATION, [small clips] round two, 9/27/26)

Rule 34 (TWO SCALES, ONE GAME, Paolo 9/27, LOCKED) makes the walked person ONE CELL,
about 28 px. Round one of this row measured that the cut from 112 survives, and found
that the walk was drawing THREE pictures instead of four, at every size, because the
lateral gait is a pure function of s = sin(ph*2pi) and sin is zero at BOTH leg
crossings. Round two asked that question of every other gait in the file.

## 1. THE SWEEP, AND IT WAS IN SIX MORE

Measured on the pixels the game draws, ph 0 against ph 0.5, all eight facings, at 112
and at 28. "Identical" means byte for byte.

    tired-walk   8/8 facings identical      swagger    8/8
    gun-walk     8/8                        sneak      7/8
    wander       5/8                        push       4/8
    ------------------------------------------------------
    FORTY OF FORTY-EIGHT

    drunk 0/8, flee-sprint 0/8, flee-scramble 0/8 -- ALREADY CLEAN, and the reason is
    worth keeping: each of those carries a SECOND clock at a different frequency
    (drunk's sway is sin(ph*2pi+1.3), the flee clips carry sin(ph*4pi) and sin(ph*3pi)).
    A second clock at a different rate is what keeps two crossings apart by accident.
    It is not a design anybody wrote down; it is why three clips escaped.

## 2. AND IT WAS IN THE SHARED HEAD-ON BRANCH, AT THE SOURCE

nsGait is the N/S gait every walking clip falls back to, and every term in it is a
function of s alone (liftL = max(0,s), liftR = max(0,-s), hipOff = -0.3*|s|). So at
BOTH crossings it returns the same legs-together pose, by construction. tired-walk,
swagger and gun-walk were identical on N and S for exactly this reason; walk and run
escaped only because the pose-hold resolver happened to place their keys elsewhere,
which is luck, not a fix.

Head-on, a passing leg reads as the KNEE COMING AT THE CAMERA, which is what
legCompress already draws. So the fix is the same anatomy the lateral branch got:
cos is +1 at ph 0 and -1 at ph 0.5, so it names WHICH leg is passing.

## 3. THE CLEARANCE IS PER GAIT, BECAUSE THEY ARE DIFFERENT WALKS

A single number would have been a patch. What the foot does at the pass is the
difference between these clips:

    sneak       0.30 of its own swing   a crouch keeps the foot low
    push        0.30                    a shove keeps the feet down
    gun-walk    0.40                    a careful advance behind a pistol
    wander      0.50                    an ordinary stroll
    swagger     0.65                    the one that is meant to be seen
    walk        0.55  (round one)       run 0.70 (a run clears further)

## 4. I BROKE THE COAT, AND THE COAT'S OWN GATE CAUGHT ME

THE FIRST HEAD-ON VALUE WAS 0.13 AND IT WENT RED. The coat skirt is tied to the hip
and the thigh it covers (this lane's own 9/12 work), so a passing knee moves the coat.
COAT ON LEGS went from 12.1% to 25.7% of the coat's own area changing in one frame,
against its 22% ceiling. Red, and mine, and found by another gate this lane wrote for
a different reason a fortnight earlier.

A FIX THAT WAS WRONG, MEASURED AND THROWN AWAY THE SAME HOUR. My first theory was the
KINK: max(0,c) switches off with a slope at the stride extreme, so I squared the bell
to make it smooth at both ends. IT MADE THE POP WORSE, 25.7 -> 30.3, because narrowing
a bell steepens its flanks. The reasoning was wrong and the ruler said so in one run.

THEN THE AMPLITUDE WAS SWEPT INSTEAD OF PICKED:

    head-on pass    0.13    0.09    0.06    0.04
    coat pops       25.7%   18.6%   18.6%   18.6%
    crossings       two pictures at every one of them

0.09 IS THE LARGEST VALUE THE COAT DOES NOT NOTICE AT ALL -- below it the coat's worst
frame is a different frame entirely, so the pass has stopped being the driver. That is
the top of the range, not a retreat from it, and the sweep is written into the source
beside the number so the next reader does not have to re-derive it.

## 5. WHAT IT MEASURES NOW

    clip          crossings identical      pictures in a bar     the two crossings now
                  BEFORE -> AFTER          worst facing          differ by, at ONE CELL
    sneak           7/8  ->  0/8             5  ->  9              5.4% of the body
    tired-walk      8/8  ->  0/8             5  ->  9              7.1%
    wander          5/8  ->  0/8             7  ->  9              8.6%
    swagger         8/8  ->  0/8             5  ->  9             13.1%
    push            4/8  ->  0/8             5  ->  8              5.4%
    gun-walk        8/8  ->  0/8             5  ->  8             11.4%
    walk            0/8  ->  0/8             8  ->  8             14.2% (6.4 head-on)
    run             0/8  ->  0/8             8  ->  8             17.2%

Every one of those last-column numbers WAS 0.0%.

## 6. AND THE CUT TOOK NOTHING, ELEVEN TIMES OVER

Round one proved the cut to one cell survives on two clips. This round measured all
eleven gaits at both sizes, and THE PICTURE COUNT AT 28 IS EXACTLY THE COUNT AT 112,
facing for facing, in every case. The cut is not where anything is lost. It never was.

## 7. TWO INSTRUMENTS OF MINE THAT NEEDED CHECKING, BOTH CAUGHT

(a) MY FIRST SWEEP ASKED THE WRONG GRID. I sampled 12 evenly spaced phases because
POSEHOLD.keys is 12, and got "103 of 103 clips draw fewer than 12 pictures", which is
the kind of number that should stop you. It is not the grid: poseHoldResolve picks key
phases by EQUAL ARC LENGTH out of 24 buckets and 12 is a target, not a schedule. A hold
legitimately resolves two. THE GAME ALREADY HAS THE COUNTER (poseHoldCount) AND NOTHING
HAS EVER READ IT. Re-measured on the 24 buckets the game actually draws.

(b) I THOUGHT THE IDLE'S FOOT WAS LIFTING AT ONE CELL and it was not. My first foot
check read the first AND last row of the leg region and called two values a moving
foot. The first row is the HIP, which is supposed to move when the body sways. The
foot is the LAST row, and measured properly the sole never moves: idle, lean, sleep and
pistol, 0 of 8 facings at 112 and 0 of 8 at 28. THE IDLE LAW HOLDS AT ONE CELL. There
was no defect. A RULER POINTED AT THE WRONG END OF THE LEG IS NOT A FINDING.

## 8. THE IDLE AT ONE CELL, WHICH THIS ROW ALSO NAMES

    idle    7 to 9 pictures a bar, at 112 AND at 28 (the same count)
            23% to 40% of the body moves across the bar
            the sole is planted on all eight facings, both sizes
It survives the cut with nothing to fix.

## 9. PROOF
    gates/the_walk_has_four_pictures_at_one_cell_gate.js -- 14 claims now (was 9),
      3 mutations caught: tired-walk's passing foot removed; the head-on passing leg
      removed; and THE ONE THAT EARNS THE THIRD CLAIM -- the lift kept but made too
      small to see, where push came out NOT byte-identical (1.5%) and the visibility
      floor failed it anyway. A FLOOR THAT ONLY CATCHES BYTE-IDENTITY IS NOT A FLOOR.
      The three already-clean gaits are in the table as a control on the fix.
    COAT ON LEGS 9 passed / 1 failed -- the remaining red (the coat 1.32x the body's
      widest row) is red on a clean origin/main worktree too, byte for byte. Not mine.
    ENVELOPE RAMP 10/0, READS FACING YOU 17/0, SLIDE AND TURN 17/0, NECK HOLDS HEAD 8/0,
      HEAD SNAPS 13/0, ELBOW BENDS 10/0, ELDER STOOPS 9/0.
    In VOTE and it PLAYS (rule 25): animation-six-more-walks-had-the-same-limp-9-27,
      every picture the real one-cell sprite at 4x with the true size beside it.

## 10. THE ANALOG HORROR LINE (rule 30)
A walk with three pictures is the bible's own rule 1 worn by a person: an ordinary
frame with one thing wrong that nobody can name. You do not see a missing key. You see
a man who is slightly not right, and you do not know why. Six more of them were walking
around the street like that.

## 11. NOT DONE, SAID PLAINLY
The fight clips at one cell are not checked yet; this round spent itself on the gaits
and the idle, which is what the row names. CAST_PX, the one body-size constant, is
still untouched: moving it is the grid rebuild's call, not this lane's.
