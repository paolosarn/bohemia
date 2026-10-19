# PORTRAIT [the face is the body's face] (rule 120(d)), round 1, 10/19/26

His words (10/18, to the coordinator): "the portraits don't look like the people... it's all fucked up, Black people
looking like white people." Rule 120(d): every portrait matches its body's skin tone, hair and build; a face whose skin
does not match its body is a defect a gate refuses (ONE ID, ONE WHOLE PERSON).

Opened by the coordinator (rule 112), Opus 5.5 at Extra (rule 116), run to the end with no question.

## 1. What was wrong, measured off the pixels

Every skin pixel of the 26 people the fight and the settlement draw (YOU, the twelve cast looks, the thirteen gangs:
slices/fight_people/ and slices/settlement_people/) mapped exactly onto the game's own eleven SKIN_TONES ramps:

| picture | what it showed |
|---|---|
| the BODY sheets (fight, 26) | 25 of 26 painted PORCELAIN, the player's own skin. Only YOU matched. |
| the BODY sheets (street, 25) | 25 of 25 porcelain, the same painter |
| the 64 px FACE beside each body | its own roll from the factory: 7 onyx, 3 ebony, 3 deep, 2 brown, 1 bronze, 2 tan, 5 olive, 2 fair, 1 porcelain |
| the STARRED crew faces (the crew screen) | coloured by eye off that 64 face, then lifted 'two steps'; under the rig's sun all twelve cast faces came out one orange brown |

So what he saw was real twice over: a Black face over a white body, and one brown face over everybody.

THE ROOT CAUSE, one line in the engine: `famPaintBody` (the alpha) swaps the worn list, the dials, the age and the face
for the stroke and never the skin, so every cast and gang body is painted in the global `skinTone` the player's face
maker set. Proven by painting the same body with the person's own tone put on for the stroke and taken off after:
records/target/portrait/body_in_its_own_skin/ (`<look>_today.png` against `<look>_own_skin.png`; never shipped).

The hair disagreed too: the body draws its worn cut in that cut's own ramp (TEMPLE TAPER black, SHAG brown, LAYERED FALL
sand), and the starred faces wore colours picked off the 64 face (the cape's grey shag over a brown-haired body, the
shorts' blond coil over a black one).

## 2. The truth: CHARACTER's one skin

CHARACTER [one skin, one person] landed its file in the same hour (records/target/character/BOHEMIA_ONE_SKIN.json,
22e4c516): one tone per person on the game's ladder, Las Vegas's real mix (37 white / 33 Hispanic / 15 Black / 7 Asian /
7 mixed against the county's 36/33/13/12/6), a name and a heritage from PEOPLE's bank, the flat ramp for the painted
sprites and ONE rig albedo (a style palette step) for the body AND the head. That file is the truth (the row's
constraint: the body is the truth, CHARACTER's skin). 19 of the 28 people changed tone from the factory's roll.

PORTRAIT's copy: records/target/portrait/BOHEMIA_THE_SKIN_OF_RECORD.json (tools/bohemia_portrait_the_face_is_the_bodys_face.py
--record): per person CHARACTER's tone, name, heritage and rig step with its source, the factory's old roll beside it,
the body's hair (its cut ramp, lit, mid, dark), what the body sheet and the 64 face show today, and the rig's measured
light. The gate refuses a copy that drifts from CHARACTER's file.

## 3. The faces, rebuilt

The starred recipe (tools/bohemia_portrait_the_head_from_the_model.py, through DIRECTION's rig unedited, the guide's
wear 0.6) with two changes, both colour:
* THE SKIN is the person's own `rig` step from CHARACTER's file, the same albedo CHARACTER's body of that person wears;
  the lips and the stubble a step down the same ramp, a scar two steps up (the old palette logic, unchanged). The body the
  head sits on is built in the same skin (CHARACTER's SKIN set in memory for the build; its file never written).
* THE HAIR is the body's own cut ramp's lit step (its colour where the light falls full), a beard its mid.

THE RIG LIGHTS A PORTRAIT DIMLY, measured: two known skins on one head through the rig, (60, 45, 38) and (200, 170, 150),
came out as a face median of (29, 21, 20) and (100, 84, 80); linear per channel, rendered = 0.216 x paint + 0.002 (blue
0.256). So no rendered face can show a sprite's colours as they are; the checker reads the PAINT with the light taken
out, through each head's own MASK (the same head rendered once more with the skin pure green and the hair pure blue: its
green and blue are an albedo of one as this head is lit, so a hat's shade or a fringe is counted). Read back on the
calibration head: (60, 45, 38) painted, (60, 45, 38) read; (200, 170, 150) painted, (200, 170, 150) read.

ROUND RESULTS: see section 6 (filled in after the renders).

## 4. EYES' two hats (row [eyes: brims and visors])

* THE WIDEBRIM's cone was cut 26 px by the hand-off square (1.25 x the head, from the top). The window now widens until
  nothing painted above its bottom touches its sides, one pixel to spare each side (`hand_off_window`, used by the faces
  and the masks alike), so a brim is whole and the face sits a little smaller under it; the starred poacher's brim would
  meet it too.
* THE BEDROLL's eyes were in the work cap's shade (pupil 3 levels under its surround against the star's 29). The work cap
  is worn higher (its line 14 mm up) with its visor's front raised 24 degrees, the way the poacher's field hat is worn
  pushed back, so the one sun reaches the sockets. Re-read with EYES' own tool, section 6.

## 5. The gate

gates/the_face_is_the_bodys_face_gate.py (registered as THE FACE IS THE BODYS FACE):
1. CHARACTER's file names every person the sheets carry; PORTRAIT's copy agrees.
2. The fight body sheets, the 64 faces beside them, and the street's body sheets wear the person's tone. RED until
   CHARACTER's re-bake; the BACK list names each picture.
3. Every starred face in the crew hand-off is painted its body's skin (on CHARACTER's rig ladder: its own rung or the
   one beside it, L* within 8 of the rig albedo) and its body's hair (the 9/20 gate's ruler: hue within 30 degrees,
   lightness within 2.2x).
4. It bites: a starred face repainted in the player's porcelain (lit the way each of its pixels is lit) is refused; a copy
   that drifts from CHARACTER's file is refused; a body sheet painted in its own tone passes.

## 6. Results

(filled in after the renders)

## ROUTED
* CHARACTER [one skin, one person]: the one-line engine change (famPaintBody puts the person's tone on for the stroke and
  takes it off after; the proof bodies show it), the 64 face in the same bake from the same tone, then the re-bakes
  (COMBAT's tools/bohemia_fight_people_bake.js, ANIMATION's tools/bohemia_settlement_people_bake.js). The gate's body leg
  goes green as they land. This gate can be CHARACTER's ONE SKIN, ONE PERSON: one ruler, legs added, never a second one.
* RUN TWO: nothing to wire. BohemiaCrewFaces reads the manifest at load; the thirteen gangs' faces join it this round, so
  the settlement street's speakers in a gang's colours wear their starred face the moment the files are live.
* EYES AND EARS [every face beside its body]: the sheet is the measurement; the gate is the standing check.
