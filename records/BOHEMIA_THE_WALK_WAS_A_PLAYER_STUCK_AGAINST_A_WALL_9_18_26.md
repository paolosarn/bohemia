# THE WALK NUMBER WAS NOT A FRAME RATE, IT WAS A PLAYER PRESSED AGAINST A WALL

PLUMBER lane, VAMILY row [sixty fps], 9/18/26. Continuing the claim. This is the line
last round named as next and deliberately did not guess at.

## WHAT WAS OPEN

Last round found that two of the budgets the speed gate holds were derived from numbers
that do not describe what the gate measures:

    metric                     the record      the gate live      apart
    frames walking, settled       8.8 fps         55.8 fps         6.3x
    main thread walking           6.4 %           15.8 %           2.5x

Both were taken out of the budget clamp with their numbers written down, rather than
papered over by widening a margin. Reconciling them was the next line.

## THE CAUSE, REPRODUCED ON DEMAND

Both sides call the SAME `walkSample()` with the same field, `rendersPerSecond`. So the
difference had to be in how it was called. Two differences existed: the hold length, and
whether a first-minute walk ran before the settled one.

**The hold length is not it.** One boot per hold, everything else identical:

    2000 ms hold   delivered 56.7   good bursts 60.2   renders 122   30 cells
    4000 ms hold   delivered 55.9   good bursts 59.9   renders 237   70 cells
    6000 ms hold   delivered 59.8   good bursts 59.9   renders 379  120 cells
    9000 ms hold   delivered 48.1   good bursts 59.9   renders 442  123 cells

At the record's own hold length it reads 59.8, not 8.8. (The 9,000 ms row is already the
disease in miniature: 123 cells at nine seconds against 120 at six. He stopped moving
and the extra three seconds dragged the rate down.)

**The first-minute walk is it.** One boot each, everything else identical:

    skipFirstMinute = true     settled walk   60.0 fps   363 renders   110 cells
    skipFirstMinute = false    settled walk    8.8 fps    55 renders     3 cells

8.8 is the record's number exactly, on demand. The gate skips the first-minute walk; the
record does not.

## *** WHY, AND IT IS THIS FILE'S OWN BUG ***

Every walk in the instrument pressed `pad.up`. Including the settled walk, which runs
AFTER a sixty-second first-minute walk in the same direction.

So by the time the settled sample started, the player had been walking north for over a
minute and was against something. He covered THREE CELLS in six seconds. The page barely
drew, and that got written down as "frames walking, settled: 8.8 fps".

IT WAS NEVER A FRAME RATE. The good-bursts number was 60.2 in BOTH runs. The game drew
at sixty the whole time in both. One player was walking and the other was pressed against
a wall.

## THE SECOND HALF: THE VALIDITY FLOOR WAS TOO WEAK TO CATCH IT

The instrument already carried the right rule, in its own words:

    "A SAMPLE THAT DID NOT MOVE IS NOT A SLOW SAMPLE, IT IS A BROKEN ONE."

The rule was right. The THRESHOLD was wrong: it asked "did he move at all", and one cell
passed. Measured, same tree, same hold:

    a walking player     110 to 123 cells in 6 s     about 19 cells a second
    a stuck player         3 cells in 6 s            about 0.5 a second

Both reported `moved: true`. The stuck one was published as a frame rate.

THE FLOOR IS NOW TWO CELLS PER SECOND OF HOLD: ten times under a healthy walk and four
times over a stuck one, so it cannot bite an ordinary sample and cannot miss a player
against a wall. An invalid sample carries WHY in its own body, including the rate the
page actually drew at while it was drawing, so the next reader is not left wondering why
a number vanished.

## THE FIX, AND WHAT IT MEASURED AFTERWARDS

`walkSample` now takes a direction, defaulting to `up` so every existing caller behaves
exactly as before. The settled walk goes the OTHER way when a first-minute walk ran, so
it never measures a player who has already walked into something. Down is simply not-up;
nothing about the compass matters.

    BEFORE    60.0 fps / 110 cells    against    8.8 fps /   3 cells
    AFTER     58.3 fps / 110 cells    against   50.9 fps / 110 cells

A 6.3x disagreement is now 1.15x, which is ordinary run-to-run noise, and the player
covers 110 cells in both.

## SO BOTH LINES GO BACK INTO THE CLAMP

They were excluded on 9/16 because they disagreed. That was the right call while they
disagreed and the wrong thing to keep once they did not. Both are back, and the root
cause is fixed rather than routed around.

Note what that ordering bought: excluding them, with the numbers written down, kept the
fight's clamp tight while the walk was still a mystery. Widening the margin until the red
went green would have loosened the fight too, and the fight was the line that mattered.

## WHAT THIS CHANGES FOR EVERYBODY ELSE

Every "frames walking" number this fleet has quoted from the record since the
first-minute walk was added has been a mix of two things: how fast the game draws, and
how long the player kept moving before he hit something. The first is the game's; the
second is the instrument's. They are now separated.

The GOOD-BURSTS rate was correct all along and nobody was reading it. It said 59.9 to
60.2 in every single run above, stuck or walking.

## CONFIRMED IN THE REFRESHED RECORD AND AGAINST THE LIVE GATE

    metric                      record before   record after   the gate live    agree?
    frames walking, settled        8.8 fps        57.1 fps        60.4 fps       1.06x
    main thread walking            6.4 %          20.6 %          17.9 %         1.15x

Both disagreements are closed. The main-thread number had the same cause and nobody had
to look for it separately: a player pressed against a wall barely draws, so his frame
rate AND his thread cost both read low.

Six budget lines are now clamped instead of four, and `notClampedOnPurpose` is empty:

    fightFps                       10  ->  47.81     build 60      1.25x of slack
    walkFpsSettled                  6  ->  40.77     build 57.1    1.40x of slack
    mainThreadBusyWalkingPercent   56  ->  33        build 20.6    1.60x of slack
    beatMissedPercentSettled        9  ->   4        build  2.6    1.54x of slack
    alphaWalkFpsSettled             6  ->  41.66
    alphaBeatMissedPercentSettled  11  ->   4

Every held line now sits between 1.15x and 1.60x of what the build does, against a guard
that fails anything over 2x.

## THE GATE

38 passed, 3 failed. It was 36 / 3 before this round and 32 / 3 before this row started.
ALL THREE REDS ARE THE SAME BUG AND IT IS NOT THIS LANE'S: `#daycard` is `inset:0` and
sits over all eight direction buttons on boot, so a driven thumb has nothing to press
and time to first play cannot be measured on either surface. Named for RUN on the front
page for the third round running.

## THE ROW

[sixty fps] stays CLAIMED. Targets: 60 walking, 60 in the fight, first play under 5 s.

    walking       57.1 fps in the record, 60.4 live      essentially there
    the fight     60 fps here, 7.1 on a phone-shaped CPU  MISSED on a phone
    first play    cannot be measured at all               BLOCKED by the card

Next line: the fight on a phone-shaped CPU is the only target left that is this lane's
to chase, and it needs the boot fixed first, because 71.8 s of blocked main thread is
where a phone loses it.
