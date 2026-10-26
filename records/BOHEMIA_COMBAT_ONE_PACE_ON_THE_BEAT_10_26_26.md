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

## THE GATE: ONE PACE ON THE BEAT (gates/one_pace_on_the_beat_gate.js, in the suite, slow)
__RESULTS__

## RE-AIMED, WITH THE REASON (rule 274 deletes what they asserted)
- THE FIGHT BY HAND, QUICKER: (5) 'their turns at double pace: their beat is half his' -> their beat is his; (4) 'one tap finishes
  it at the top pace (4x)' -> at his own pace.
- EVERY ACTION ON THE BEAT: (3) 'their turns on halves, AUTO's finish 4x' -> their turns and his on the same grid.

## ROUTED
- SOUNDS (BOHEMIA_BEAT is the clock): their turns now run at his speed, not double; the music's turn levels (207) are the whole
  difference between the sides. NOTEd.
- TUNING: a fight on AUTO plays their turns at half the speed it did; a routine fight is longer by their share of the motions
  (rule 34's 2 to 4 minutes is his to feel; 2x and 4x stay one tap away). NOTEd.
- EYES: one AUTO fight on the live link, phone, 1x: every act on the kick, his and theirs the same pace, the finish no faster.
