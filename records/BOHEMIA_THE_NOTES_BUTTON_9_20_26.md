# THE NOTES BUTTON: HE WRITES A THOUGHT WITHOUT LEAVING THE GAME
UI lane (chat 11), 9/20/26. Row [notes button]. Gate: gates/the_notes_button_gate.js, 21 legs.
Rule 18(f) (Paolo 9/20, laws/BOHEMIA_ADDENDUM_THE_PLAYABLE_CUT_9_20_26.md): his direct ask,
tiny, touches none of the three, so it ships while the rest of this lane holds.

## THE RULING
"In the demo there should be a note section at the very top right, just the tiniest button,
where as I'm playing the demo I can write all my thoughts down and then resume back to
playing."

## WHAT SHIPPED
A bare pencil at the far right of the top bar: 5px of ink, which is the same size as every
other chip up there, in a 44px reach, because THE THUMB is a law and "tiniest" is about the
ink and never about the target. One tap opens a box over the game. He types. SAVE AND KEEP
PLAYING puts him back on the same square at the same clock.

EVERY NOTE CARRIES ITS OWN CONTEXT SO HE NEVER TYPES IT: the build stamp, the mode, the
district, the cell he stood on, the in-game day and clock, the seconds since the demo
opened, and a small picture of what was on the glass. He wrote "the car looks like dogshit"
once and three lanes had to guess which zoom he meant.
The context is read from phoneState(), which already knows the district, day and clock and
has been printing them on the phone for weeks. Asking the same question in a second place
is how two numbers start disagreeing.

It leaves the phone the way a vote does: localStorage the instant he taps, and a .txt he
sends the manager, never .json.

## THE PAUSE, AND WHY IT IS EXPLICIT
His words are "resume back to playing", so nothing may move while he writes.
FIRST: THERE IS NO CLOCK TO STOP, and that is measured, not assumed. This valley runs on
I-MOVE-YOU-MOVE ("the sim advances per step() call, the caller decides"). With the box open
and hands off for 2.5 s, T.day and T.min do not move. The pause he asked for is the pause of
not stepping.
SECOND: A SCRIM IS NOT A PAUSE. The box covers the screen and elementFromPoint returned it,
which looked like enough. But the pad binds pointerdown on its own SVG groups, and asking
the page who owned the arrow's pixel gave TWO DIFFERENT ANSWERS ON TWO RUNS OF THE SAME
PROBE (once the box, once the pad's path). A pause that depends on which answer you get is
not a pause. So while the box is open, pointer events are stopped in the CAPTURE phase
before any game handler sees them. That is the pattern the sky pinch already uses in this
file, reused rather than reinvented.
AND THE RELEASE IS NEVER SWALLOWED, for the reason that existing block already writes down:
you may swallow an intent, you may never swallow a cleanup.

## AND A FOURTH, WHICH WAS MY OWN GATE BEING TOO WEAK TO SEE ITS OWN SUBJECT
The first cut of the pause leg pressed ONE arrow of the eight. Deleting the page's entire
capture-phase block left the gate GREEN, and I was one sentence from writing the block off
as decoration the scrim made redundant. It was the LEG that was weak, not the block.
Pressing all eight arrows, and dispatching an event STRAIGHT AT the pad's own group -- the
one route an overlay can never intercept -- the same deletion now turns three legs red: the
event reaches the pad, a hold starts, and HE WALKS FIVE CELLS WHILE THE BOX IS OPEN with his
hands nowhere near the game (hy 6268 -> 6145, the clock 360 -> 369).
A LOCK NOTHING CAN PROVE IS THE SAME SLOP AS A DECLARATION A LATER RULE CANCELS, which is
what this row spent its last two rounds on. The answer was not to delete the lock. It was to
write the leg that can tell.
Mutation is only worth what the leg is worth, and that is the third round running this lane
has caught a mutation that could not bite.

## THREE THINGS THE SHIP TEST FOUND THAT READING WOULD NOT HAVE

### 1. THE FIRST RUN SAID THE GAME MOVED WHILE THE BOX WAS OPEN. IT DID NOT.
The test reported the clock and the cell both moving with the box up, and a leaking overlay
was the obvious cause. It was not. A tap EARLIER in the same run had started a HOLD on the
walk pad, and the hold was still stepping. Opening the box first, having touched nothing,
the game holds dead still.
I nearly filed my own instrument's leftover finger as a defect in the feature.

### 2. A TAP OUTSIDE THE CARD THREW AWAY WHAT HE HAD WRITTEN.
The box copied what every other card in this game does: tap outside to dismiss. The ship
test walked into it immediately, because the pause check taps the walk pad and the pad is
UNDER the scrim, so the tap landed on the scrim and binned the note.
A card you can dismiss by missing is fine for a card you are READING. It is not fine for the
only place he writes anything down. The scrim does nothing now. The ways out are the button
he came in by, BACK, and Escape, and every one is a thing he meant to press.

### 3. THE TINIEST BUTTON WAS THE LOUDEST THING ON THE BAR.
It shipped at 9px of ink. Every other chip in that bar is halved to 5px by [half size], so
the "tiniest button" was nearly twice the ink of everything beside it. Caught by a leg that
compares it against its own neighbours rather than against a number I picked.

## AND AN INSTRUMENT NOTE FOR EVERY LANE THAT DRIVES THIS DEMO
The keyboard goes to the PAGE and the game is in a FRAME. Focusing a field from inside the
frame is not enough: the iframe element has to hold focus in the parent, or every keystroke
lands in the shell and the field stays empty while looking perfectly focused. It cost this
round two passes. A tap gives focus; it does not give the frame the keyboard.

## WHAT I PICKED WITHOUT HIM
A bare mark with no plate, because a plate would make it a fourth button, which is the
opposite of "just the tiniest button". Option sheet:
slices/BOHEMIA_FIVE_WAYS_A_NOTE_LANDS_9_20_26.html, five real bars at the real size.

## WHAT IS NOT DONE
The notes ride the same road as a vote as far as a browser can take them: localStorage and a
.txt. Appending them to the vote registry itself needs a hand at a keyboard, because a page
cannot write a repo file. If he wants the VOTE tab to LIST his notes beside the things
waiting on his thumb, that is a small next step and it is not built.
