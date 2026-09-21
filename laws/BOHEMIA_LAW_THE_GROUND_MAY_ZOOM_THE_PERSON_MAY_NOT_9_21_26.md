# BOHEMIA LAW -- THE GROUND MAY ZOOM, THE PERSON MAY NOT (coordinator 9/21/26, from four lanes' measurements of one defect)
# Paolo 9/20 (rule 18a): "I'm zooming out and my person becomes bigger." Paolo 9/18 (rule 17):
# "when combat started it was so fucking bad." Both sentences are the same bug.

## 1. THE LAW
A PERSON IS DRAWN AT ONE PIXEL SIZE ON EVERY SURFACE HE WALKS OR FIGHTS ON, and the camera
moves the GROUND under him, never his size. The ruled size is the one the street has shipped
at for months: a 112 px box, about 100 px of painted person (CHARACTER b6d2fcdc, 9/20). On
the street it is one size at every walk zoom. In the fight it is the same 112 box on a floor
the camera may pull back. Rule 16 (bodies larger) falls out for free: a fixed person on a
receding floor grows against the world with no new pixels. CITY mode from above keeps its
own ladder (a person is a speck from the sky); this law is about the walked and fought
surfaces.

## 2. WHY IT IS A LAW AND NOT A NOTE
The same defect was built twice, by two lanes, for the same good-sounding reason, and a
third lane had written the fix down before either built the bug:
- CHARACTER 9/15 wired the body to grow once a house fit the screen ("the readable way to
  honour rule 16"). Measured 9/20: three body sizes across the walk zooms (102/52/102/202),
  and a pinch from 22 to 44 DOUBLED him. His sentence exactly.
- COMBAT's fight ties the body to the floor's zoom (bodyScale = 1/FIELD_ZOOM, "the people
  ride the same number as the floor", so pulling back would not leave giants). Measured
  9/20 (CHARACTER ca1e1d1a): the same person is 3.03x smaller the moment a fight starts,
  37 px against 112.
- CHARACTER's own 9/15 record already said "the body's pixel size does not have to change
  at all" and the lane built the elastic body on top of it anyway (their words, 4996d242).
- RUN 9/20 sized the body off the camera stop and dropped that fix at the merge for
  CHARACTER's constant, because a constant is simpler and lands further (9049a4ea).
- ANIMATION 9/20 measured the same stop 4x different between two window widths because
  the size read the canvas width (0f75c655).
Tying the body to the camera LOOKS like the careful choice every time and produces a person
who changes size every time. A law that names the shape stops the fourth build.

## 3. THE GATE
On the street: gates/body_scale_gate.js (CHARACTER, 14/0, mutation-proved: elastic body back
= red; a fixed size nobody has played = red). In the fight: OWED to COMBAT [fight looks], the
same claim on the fight's canvas (the painted fighter reads 112 box, ~100 px), re-run with
CHARACTER's tool (records/BOHEMIA_IS_THE_FIGHTER_THE_SAME_SIZE_9_20_26.txt) until the two
lines read the same. Until that leg exists, THE FIGHT VERDICT carries the fighter's pixel
height as a number every round.

## 4. THE COST, SAID PLAINLY
He can no longer zoom in while walking (RUN 930e2bf3): one street view; the way to look
closer is to go and stand there. At the most zoomed-in level the fixed body is smaller
against the ground than it was; that cost disappears at the one camera. A person slightly
wrong at one zoom beats a person who doubles when you pinch.
