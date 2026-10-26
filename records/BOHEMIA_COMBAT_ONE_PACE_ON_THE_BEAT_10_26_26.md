# COMBAT 10/26: ONE PACE, ON THE BEAT, FOR EVERY TURN (rule 274, inside the emergency)

## HIS WORDS
"the combat still isn't in sync with the music, and when I do the auto combat it's not the same pace, it speeds up and slows down
however it wants... really fast, then back to normal, really fast... I want it consistent with the BPM of the music... do the math,
it has to go to the BPM, we need a formula for it" (records/BOHEMIA_PAOLO_A_TOWN_IS_SAFE_ONE_PACE_ON_THE_BEAT_PAID_AT_THE_EDGE_10_26_26.md)

## WHAT WAS WRONG, MEASURED ON THE FIGHT'S OWN PAGE (four things, one feel)
1. THE HIDDEN PACE (the coordinator's read, confirmed): beatMs() = songBeat() / UI.speed / UI.hand / paceNow(), and paceNow() was
   THEIRS_PACE 2 on every turn of theirs and FINISH_PACE 4 once AUTO was finishing it. On AUTO the board ran at the beat on his
   men's turns, twice as fast on theirs, back, twice as fast..., then four times as fast at the end: his 'really fast, then back to
   normal, really fast'.
2. A MOTION BEGUN INSIDE ITSELF: the next man decided an eighth of a beat (BREATH_BEATS) after the last motion ended, but his motion
   was booked on the grid point at that end, already behind him, so it began up to 125 ms into itself (a skip): on the computer
   218 of 351 motions began within 20 ms of their point, the worst 125 ms (the gate's first run on the pace-only change).
3. THE NEXT MOTION WAITED FOR A FRAME: a motion's end was seen on the next screen frame, 17 ms late at 60 a second and 34 at 30; once
   a late choice takes the next grid point (rule 274(c)), a 30-frame phone lost a whole beat between two blows (20 to 44 of 173
   motions on the computer took the next point).
4. THE CAMERA'S EMPTY HOLD: follow() held the turn three quarters of a beat whenever the man about to act stood outside the middle
   of the glass, even when the camera already held both teams and had nowhere to go; on his computer's wide board about half of
   AUTO's acts held it and then waited for the next beat (430 ms between the last motion's end and the next choice).

## THE FIX (slices/BOHEMIA_FIGHT.html, COMBAT's own code)
- THE FORMULA: beatMs() = songBeat() / UI.speed / UI.hand; an action starts at t0 + k x (60000 / BPM) / s, k whole, s his speed
  (1, 2, 4); THEIRS_PACE and FINISH_PACE are gone, the same s for both sides from the first turn to the last; the difference between
  their turn and his stays in the MUSIC (rule 207). A blow keeps rule 158's landing on the kick (its swing begins 0.45 of a beat
  before the grid point); a walk's first foot, a fall's first key, a reload start on it.
- A LATE CHOICE TAKES THE NEXT POINT (274(c)): a motion that would begin more than 20 ms after its grid point is moved to the next one,
  once, never begun inside itself and never two at once.
- AUTO THINKS AHEAD (274(c)): the next man of theirs, or of his on AUTO, decides in the last quarter beat of the motion playing (at
  most 125 ms), so his motion is booked on the grid point the last one ends on; not while the camera holds, a new round is still to
  be framed, the man stands off the glass, or he is a man of his by hand. His turn's music turns when that motion starts (a.turn,
  rule 126(e)).
- A MOTION'S END ON TIME: a timer at the motion's own end time runs the director, not the next frame.
- THE CAMERA HOLDS ONLY WHEN IT MOVES: follow() acts at once when the camera already holds both teams (camThere).
- BREATH_BEATS 0: the board's breath is the wait for the next grid point.
- THE FIRST MOTION OF A CHOICE goes on the song in the same tick (it waited a frame, 24 to 33 ms past its point), and a choice
  inside the device's own frame of its point is on time (a timer cannot fire inside a frame: on a phone at a quarter of this
  computer's CPU a frame is 100 ms and more).

## THE GATE: ONE PACE ON THE BEAT (gates/one_pace_on_the_beat_gate.js, in the suite, slow)
P1 AUTO at 1x, three rolled fights (brigands, beasts, kids), phone and computer: 172 motions a profile, every one of both sides on
the one 500 ms grid, 0 off; P2 by hand: 43 motions, his and theirs on 500; P3 2x and 4x: both sides on 250 and 125; P4 AUTO's finish:
10 motions before, 25 after, all on 500; P5 no two motions on one point, a late CHOICE 2 of 344 (0.6%), 0 of 57 on his phone's
profile at a quarter of this computer's CPU (AUTO's think there 3 ms middle, 25 ms 95th, 69 worst); P6 the page began 696 of 698
motions within 20 ms of their grid point past the device's own frame (665 within 20 ms flat; the frame a middle 17 ms); P7 nothing
threw. 11/0.
HOW IT GOT THERE (each measured on this gate, run alone): the pace alone left 218 of 351 motions begun within 20 ms (worst 125); a
late choice judged by the frame put 44 of 173 a beat later; with the end timer, the think ahead and the camera's hold fixed, 2 of
344; judged by the choice's own time and the device's frame, 0 of 57 at a quarter CPU (it was 47 of 57).

## RE-AIMED, WITH THE REASON (rule 274 deletes what they asserted)
- THE FIGHT BY HAND, QUICKER: (5) 'their turns at double pace: their beat is half his' -> their beat is his; (4) 'one tap finishes
  it at the top pace (4x)' -> at his own pace.
- EVERY ACTION ON THE BEAT: (3) 'their turns on halves, AUTO's finish 4x' -> their turns and his on the same grid; (5) his tapped
  walk is found by when it was CHOSEN (the log's chose), and when none is found the leg says why.
- THE REBUILT FIGHT PLAYS: 'a turn you can read, and no dead pause' read an aiStep call as the start of an act; with AUTO thinking
  ahead in the last quarter beat of the motion playing it is not, so the leg reads the MOTIONS the page played: each of theirs
  begins after the last ended and the board stands still at most the wait for the next grid point.

## RED ON MAIN TOO, NOT THIS CHANGE (measured side by side, main's fight in a side tree)
- EVERY ACTION ON THE BEAT 'on the song's own beats': main 19 of 41 motions off the shell's booked beats (worst 12 ms) and his
  tapped walk NONE; this change one run 0 of 60 off (worst 2.1 ms), the next 23 of 26 off by 59.5 ms: the fight's grid follows
  SONG.at as it re-reads BOHEMIA_BEAT, and that anchor moves run to run (NOTE SOUNDS). His walk by hand: no turn of his came in
  the demo's first fight through the title within the leg's wait, on main and here (the same check on the map's road door finds
  his turn in half a second).
- THE REBUILT FIGHT PLAYS: 'both teams stay on the glass' (main 1 of 131, here 0 to 1 of 149) and 'a tile's edges' (138%), the
  night-frames leg reads 21 to 26 frames a second only when three gates share this machine (alone: see below).
- THE FIGHT ON THE LIVE PATH: one run under load threw a drawImage TypeError in its second computer fight; alone, mine 8/0 and
  main's 8/0 (not reproduced).

## ROUTED
- SOUNDS (BOHEMIA_BEAT is the clock): their turns now run at his speed, not double; the music's turn levels (207) are the whole
  difference between the sides. NOTEd.
- TUNING: a fight on AUTO plays their turns at half the speed it did; a routine fight is longer by their share of the motions
  (rule 34's 2 to 4 minutes is his to feel; 2x and 4x stay one tap away). NOTEd.
- EYES: one AUTO fight on the live link, phone, 1x: every act on the kick, his and theirs the same pace, the finish no faster.
