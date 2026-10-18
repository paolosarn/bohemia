# THE STEP IN THE FIGHT: POST-MORTEM (SOUNDS, 10/18/26)

His vote (the sixteenth votes): sounds-the-step-in-the-fight-10-18 DOWN, 'Was broke'. The coordinator (sweep AT): 'find
what broke before it comes back.' GRAVEYARD IS FINAL for that candidate as shown; the method (real shoes, the floor
from the tile's picture, fight_floors.json, STEPS.step) is not what he judged, because he never got to hear it.

## WHAT BROKE, MEASURED (not guessed)

Driven the way he opens it: the page inside a frame the VOTE tab's size (62vh: 315 px of fight on a 390 by 844 phone),
on a throttled phone network (1.6 Mbps, 150 ms), in Chrome.

1. EVERY TAP RELOADED THE WHOLE FIGHT. The page loads the fight on open (12.2 s, 4.0 MB), and each button sent the frame
   to a blank page and back, a full new load (12.2 s more, 5 MB more without a cache). For twelve seconds after a tap the
   fight was gone.
2. THE FIRST STEP CAME 32 SECONDS AFTER THE TAP. After the reload: the fight's opening hold (four and a half beats), then
   turns by initiative at one second an act, and most of the crew's turns are shots, not walks. 32.4 s from the tap to the
   first footstep; then bursts of steps with long silences (16 tiles crossed in 15 s at full speed, all by the enemy).
   Thirty seconds of nothing after pressing a button reads as broken.
3. ONE FOOTSTEP PER TILE IS A STUTTER. A tile is crossed in a quarter beat (125 ms), so a walk was eight footfalls a
   second, faster than a sprint (four to five), each choking the last at 20 ms. The gate proved the choke worked; it never
   asked whether eight a second is a person walking. It is not.
4. THE FRAME IS SMALL. In the VOTE tab's 62vh frame the fight's own strip and panel take most of 315 px; the board is a
   band.

The fight's AUTO itself does not stall: run alone it moves on (c8, e7, e2, c0, e5, c1 in 30 s); it is slow, not stuck.

## WHY THE GATE WAS GREEN

gates/fight_steps_gate.js played the page at THREE TIMES the speed, at full height, on a local server with no network
limit, and counted steps over twelve seconds. Every claim it made was true; none was what he does (a tap, at real speed,
on a phone network, in the tab's frame). A gate that runs faster than him cannot see a wait.

## THE REDO (a new id, redoOf this one, his words quoted back), the row [the step comes back]

- The fight loads once; a tap never reloads it (the A/B restarts the same seed in place, the alpha's own cw.start()).
- A step within two seconds of the tap: the page opens on a man walking, not on the opening hold.
- The cadence of a person: footfalls on the beat, two a beat (a run, 120 BPM) across the whole move, on the floor of the
  tile he is on at that moment, never one per tile; a short move is one or two steps.
- The gate drives it the way he does: real speed, a 62vh frame, a throttled network, and a claim on the time from the tap
  to the first step.

## WHAT STAYS

fight_floors.json and its tool (the floors are right: 120 of 120 road pieces asphalt, 75 of 75 casino tiles carpet), the
carpet walk, STEPS.step and floorAt; the swap is still CUE 7.2's three lines, now NEEDS the redo's YES.
