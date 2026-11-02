# THE PHONE RUNS THE FIGHT, AND THE BEAT IS SEEN (UI, 11/2/26)

Asks 257, 265, 270, 275 (records/BOHEMIA_EVERYTHING_HE_ASKED_10_24_26.md), his words in
records/BOHEMIA_PAOLO_NOTES_WHILE_THE_KITCHEN_IS_CLOSED_10_27_26.md notes 4 and 6:
"I feel like there should be more buttons on the phone, especially during combat... the phone's not fully folded up and you
still have the bottom left of the screen for the characters... why can't they just go on the phone... all the real estate has to
be justified." / "If it's something to be clickable I want as many buttons on the phone as possible." / "The beat with no sound...
the beat has to be visible too, like a pulse on screen."

READ OF HIS WORDS: "not fully folded up" is read as "not fully FILLED up" (voice-to-text; the phone's ability page was half empty
in every fight, measured below). The phone keeps its size and its corner (rule 213: one place, one size); what changes is that
everything the fight still drew on the glass now lives on the phone.

## BEFORE (measured on the shipped demo, tools/bohemia_drive_the_demo.js, a road fight, 4 s in)
- Upright 390x844: the phone 124x276 at the bottom right. On the glass beside it: the fight's bar 250x124 at the bottom left
  (the round, the turn order's five faces, his face and name, three bars with numbers, his AP), plus the hint plate.
  The phone's ability page held 2 abilities in room for 12: about 90 of its 235 points were empty.
- Sideways 844x390: the bar was 716x139, OVER A THIRD OF THE GLASS'S HEIGHT, mostly bare cardboard.

## WHAT SHIPPED (slices/bohemia_phone.js; the fight's own file untouched)
1. THE CREW ON THE PHONE. Under the phone's status line: the TURN STRIP (every face in the order, the fight's own faces and rims,
   the one acting first a size up in gold; one tap opens that man's sheet, the fight's own drawer; a second tap closes it; past six
   the strip slides under a finger). Under it THE CARD: his face (a tap is his sheet), his name, his blood, armour and wind as bars
   lit from above with their numbers, his AP as pips and the count; a man of theirs shows his plate (LV, OUTCLASSES YOU). The round
   (R1, NIGHT) rides the status line. All read off the fight's own HUD, which keeps it true; nothing of COMBAT's rewritten.
2. THE GLASS IS THE BOARD. With the phone up, the fight's strip and bar slide off the glass's edges in two stopped steps (they
   transform, never vanish: ask 257) and stay off. They are moved whole, never collapsed, so the fight's own measure reads 0 at both
   edges and its camera frames the whole glass around the phone. The man's sheet and the hint now stand clear of the phone (upright
   over it, sideways beside it). The bench (the fight opened alone, COMBAT's) has no phone and keeps its bar.
3. THE BEAT IS SEEN. One beat, the fight's own (P.beat hands over COMBAT's SONG clock, the one every act lands on; its own 120 from
   the fight's start when no song plays, so it reads with the sound off). Each beat is three stopped holds (the hit, the after-glow,
   the fade): the phone's screen catches it at its rim, a heart monitor's trace in the status line spikes on it (pale phosphor with
   the tape's red and blue ghosts, the old end fading, moving only on the holds), and the board's edges darken red with one faint
   tape scanline, under the phone (a layer no finger meets; off under reduced motion, the phone's own pulse stays).

## AFTER (measured, same driver, same fight, 4 s in)
| | upright 390x844 | sideways 844x390 |
|---|---|---|
| the fight's bar on the glass | none (was 250x124) | none (was 716x139) |
| the fight's own measure of its edges (top, bottom) | 0, 0 | 0, 0 |
| the board's open area (the camera frames it) | 390x558, all of the glass above the phone | 722x390, all of the glass beside the phone (was 716x251 above the bar) |
| still on the glass besides the board and phone | the hint plate (transient, above the phone), the companion's line with his face (transient, top left) | the same two |
| faces of the turn order on the phone | 5 of 5, every one a press on top | 5 of 5 |
| one tap on a face opens that man's sheet, a second closes it | 5 of 5 | 5 of 5 |
| his face on the phone opens his sheet, a second tap closes | yes | yes |
| name, blood, armour, wind, AP on the phone = the fight's card | RAUL 62/62 90/90 0/92 9 AP, same | RAUL 64/64 90/90 0/84 9 AP, same |
| the fight's commands (go, wait, retreat, auto, speed), abilities, apps: each a press on top | all | all |
| pulses in 8 s on the fight's 500 ms beat (the song's, from SOUNDS' one beat) | 16 | 16 |
| each pulse against the fight's own beatPh, the moment it lands | 2 to 39 ms after, mean 16.9 | 2 to 20 ms after, mean 9.2 |
| page errors | none | none |
After those runs the pulse leads by half a frame (8 ms) so it lands on the frame NEAREST the beat, not always the one after (the
gate holds it to within three frames, a frame and a half on average). A measure that counted beats as an index off the fight's
clock was wrong: the clock re-anchors on every booked beat (SOUNDS' one beat), so the index jumps; the phone counts a beat when
its phase wraps. The map upright: unchanged (the top readouts and the phone; no floating button left to move).

## CHECKS
- gates/the_phone_gate.js gains four legs: the strip and bar off the glass with both edges measured 0; every face of the order on
  the phone (the first six a press on top), his face a press, the fight's own name, blood and round; one tap on a face opens that
  man's sheet and a second closes it; the pulse sampled against the fight's own beatPh the moment it lands, within two frames.
- gates/the_days_once_gate.js re-aimed: with the phone up, the round and the faces ride the phone and the bar is off the glass.
- RUN: THE PHONE 250 passed, 2 failed on the first pass; both fails were the computer's bar, which floats 12 points over the
  glass's bottom (bottom:12px), so sliding it down by its own height left the fight measuring 12; the bar is now pinned to the
  bottom edge while it is off; the computer re-run: THE PHONE 84 passed, 0 failed. THE DAYS ONCE 59 ok, 0 failed. Upright and sideways (the phone on both corners): every new leg green; the pulse landed -8 to +40 ms
  from the fight's beat (upright at 3x the heaviest, mean 19.8 ms; sideways mean about 7 ms).

## LEFT
- The phone's presses forward clicks only: a finger HELD on STRIKE (the weapon's card on the fight's bar) has no phone twin yet.
- Bluetooth headphones lag 150 to 300 ms; the seen beat is on the picture's clock (where the fight's acts land), so a calibration
  setting (the coordinator's blind spot C) is still owed.
