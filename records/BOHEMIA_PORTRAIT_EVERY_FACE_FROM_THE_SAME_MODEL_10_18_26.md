# PORTRAIT [every face from the same model] ROUND 1 -- THE CREW GETS THE STARRED FACE (10/18, rule 115h)

Opened by the coordinator (rule 112), Opus 5.5 (rule 116). No question asked.

## Why
His first star went to the poacher's face built as a 3D head on his own body ("You might change the game with this one").
Rule 115(h): that method is every face, and it replaces the old portraits on the screens he named first: RUN TWO's crew
screen ("the portrait sucks") and the scavenge screen ("the portrait is ass, I can't even stare at it").

## Whose faces those screens show (measured, not guessed)
- The crew screen (slices/BOHEMIA_ROSTER_SCREEN.html via engine/bohemia_crew_door.js) draws each man's face from his
  fight sheet's right edge (slices/fight_people/<look>.webp, the 64 face). engine/bohemia_roster.js manOf gives the main
  character the look `you` and every other man one of the twelve `cast_*` looks in turn.
- The scavenge screen (slices/BOHEMIA_SETTLEMENT_SCREEN.html) speaks the find through YOUR face (fight_people/you).
- So the job is thirteen faces: YOU and the twelve cast looks.

## What was made
- No body existed for any of the thirteen. Each BODY is built by CHARACTER's own tool
  (tools/bohemia_character_the_thirteen_through_the_rig.py, imported and never edited: a LOOKS entry is added in memory
  and its build() runs) from the look's worn list: the shirt, coat, mantle or cape in the worn names' colours.
- Each HEAD is the poacher's recipe unchanged (skull, brow, sockets, nose, lips, chin, ears, eyeballs with bone whites
  and lids, the mouth that opens on the jaw's hinge, shape keys A E O M and Angry Sad Surprised) on that body's head bone.
- NEW HEAD PIECES, all geometry: four cuts (a taper combed front to back; a long cut with a ragged fringe filling toward
  the jaw; a choppy shag; a coil crown on crossed pitches) and four hats (a watch cap rolled high, a slouch beanie hanging
  off the back, a work cap with a visor, the rice farmer's cone) beside the knit cap and field hat already built.
- Skin from each person's own game face (sampled, then a style palette step); hair and hat from the worn list.
- STRAND NORMALS on dark hair and caps (CHARACTER's 8b, reused): the rig's dust pass greyed black hair otherwise.
- Rendered through DIRECTION's rig unedited (--portrait 128, seven --expression, --class person, --wear 0.45).
- THE HAND-OFF TO RUN TWO: records/target/portrait/crew/<look>/<key>_64.png and _128.png for rest, A, E, O, M, Angry,
  Sad, Surprised; manifest records/target/portrait/crew/BOHEMIA_CREW_FACES.json. The square is the head and a little collar
  (1.25 x head height), BOX-resampled from the 1:1 render, so it drops straight into the 64 canvas or the 72 px box.
- Sheet: records/target/portrait/PORTRAIT_EVERY_FACE_FROM_THE_SAME_MODEL.png (the 64 face today at 2x beside S, SE, SW,
  A, O, M, Angry at 1:1; the company line at 64 at the bottom). VOTE: portrait-every-face-from-the-same-model-10-18
  (PLACEHOLDER, nothing final before the moodboard).

## Cycles (written so the next head skips them)
1. Hair as a smooth shell with a straight edge read as a helmet: strands as 5 mm grooves on a 12 mm pitch, a ragged
   fringe on 40 mm clumps (a 26 mm pitch stepped into a saw on the skull's rows).
2. The coil crown on the curls' grid lined up in rings and read as a knit cap: two crossed tilted pitches and a third.
3. Black hair rendered grey: strand normals.
4. The cone at 1.9 x head width ran off the frame: 1.5.
5. The shortcoat's skin, beanie and hair were one red-brown lump: skin a step lighter, beanie deep oxblood.
6. The boxed-to-64 square left the head 38 px: the crop is now the head, not the shoulders.
7. NOT VIBE CODED D3 (light row) failed 5 of 39 renders: a near-black top over a paler shirt read as lit from below.
   Four tops lifted one palette step, as the thug's cap was. N3 is now clean for this card.

## Gates
speak_along_gate.js: was RED (10 of his comments on face cards had no answer row), now 6/0: each row answered by this
card in its own words (his "more hairstyles": four new cuts; his "dogshit, not final": the starred method; "didn't load":
this card is an image). not_vibe_coded_gate.py: this card clean; the one red is DYNASTY's two whys. vote_tab_gate.js:
this card clean; the one red is DYNASTY's. talking_portrait_gate 34/0, attempt_gate 15/0, reference_check 490/0.
reusefirst_gate: 70 reds, none in this lane's tools (pre-existing).

## Still open
- Every head is the same skull: the face spec's dials (jaw, brow, nose) do not reach the model yet. NEXT round.
- The dust pass still blotches skin (DIRECTION's per-material wear weight; re-sent). --class portrait still crashes.
- RUN TWO wires the manifest into the roster's faceCanvas and the settlement's face(); until then the old 64 face shows.
- The glbs are not committed (13 x 10 MB); the tool rebuilds them: --crew-body <WHO>, then the head, then the rig.

Reference check: the twin is each person's own game face (slices/fight_people/<look>.webp, right edge) and the poacher's
starred head. No reference game. Analog horror AH-01.
