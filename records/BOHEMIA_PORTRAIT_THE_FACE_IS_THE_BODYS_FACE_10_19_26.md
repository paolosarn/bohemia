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

ROUND RESULTS: section 6.

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

## 6. Results (10/19, after CHARACTER's re-bake 3318fe81 + ba103ee1 landed mid-round)

THE FACE IS THE BODYS FACE: 133 passed, 0 failed.
* THE BODIES: 26 of 26 fight body sheets and 25 of 25 street sheets wear the person's own tone (before the re-bake: 1 of 26
  and 0 of 25, all the player's porcelain); the 64 faces beside them 26 of 26 (before: 4 of 26).
* THE STARRED FACES, all 13 crew (the paint read through each head's own mask, against CHARACTER's rig albedo):

| look | who | tone | paint read | L* off |
|---|---|---|---|---|
| you | YOU | porcelain | (222, 179, 150) | -2.8 |
| longcoat | Amaury Carrasco | tan | (157, 120, 95) | +0.5 |
| barearms | Amos Ferris | fair | (208, 175, 145) | +1.6 |
| pack | Otis Wexler | porcelain | (221, 178, 146) | -3.2 |
| skirt | Tasha Hargrove | deep | (107, 71, 57) | +1.6 |
| widebrim | Wendell Lund | pale | (205, 163, 137) | +2.9 |
| cape | Cyrus Truong | olive | (208, 166, 127) | +2.0 |
| apron | Wyatt Hatcher | fair | (198, 165, 136) | -2.0 |
| poncho | Xiomara Delgado | bronze | (172, 121, 94) | +3.0 (reads tan, one rung) |
| bedroll | Kai Galvan | olive | (212, 171, 133) | +3.8 (reads fair, one rung) |
| shorts | Hoang Serrano | tan | (167, 130, 103) | +4.3 |
| satchel | Javier Escobar | brown | (122, 91, 76) | +0.5 |
| shortcoat | Corinne Emery | chalk | (249, 222, 179) | +0.6 |

  Hair, 13 of 13 on the body's cut ramp (hue within 13 degrees, lightness within 1.52x); the three mutations bite.
* CHARACTER's own gate (ONE SKIN, ONE PERSON) reads 8 of its 9 PORTRAIT debts healed; they are taken off its frozen
  list as its S7 asks (15 passed, 0 failed). The widebrim stays on it: its cheek under the cone reads porcelain on that
  gate's cheek ruler (one rung over pale), while its paint through its mask reads pale, L* +2.9. Two rulers, one rung.
* EYES' star tool, run as it is with the new window handed in (its screen_square is a copy of the old one): 13 of 13 PASS.
  The bedroll's pupils 55 and 42 levels under their surround (the star 29 and 28; before 3); its moods move the face
  730/520/1389 px (the star 143/173/902; before 69/122/605). The widebrim's cone sits whole inside the crew screen's square.
* STYLE GUIDE 115/0 (the 13 reds at wear 0.45 are gone: the crew is rendered at the guide's 0.6). NOT VIBE CODED 30/1:
  N3 lists this card's three black-haired, light-skinned faces on D3 (section 7) beside other lanes' cards. THE ART FENCE 14/0. THE VOTE TAB 46/6, the
  same six red on main without this card (DYNASTY's two whys, RUN TWO's full-size tap legs).
* A NOTE ON EYES' [every face beside its body] (YOU's portrait '2 shades darker than his body'): the rig lights every
  portrait at about a fifth of its paint (measured, section 3), so a rendered face read straight against a flat sprite
  always reads darker, YOU's included, unchanged since the star. Read through the mask (this gate's `paint`) the YOU face
  is porcelain, L* -2.8.

THE VOTE CARD: portrait-the-face-is-the-bodys-face-10-19 (registered, first picture the longcoat row: the body before
in the player's skin, the body now in tan, the 64 face now, the 3D face he saw, the new one). Sheet:
records/target/portrait/PORTRAIT_THE_FACE_IS_THE_BODYS_FACE.png.

NOT YET: the enemy tiers' heads (COOK THREE's new tier bodies). The gangs: section 8.

## 7. The one red: the guide's light row reads black hair as light from below

NOT VIBE CODED N3 runs the guide's card_row (the opaque top half of a sprite at least as bright as its bottom, -2.5) on
the card's sprites, which are the squares the sheet shows (rest, talking, angry for each face). Ten of the thirteen pass.
Three send back, all of them CHARACTER's light skins under their bodies' own black hair (H_BLK):

| face | skin | hair | top minus bottom (rest / A / Angry) |
|---|---|---|---|
| Amos Ferris (barearms) | fair | coil crown, black | -19.5 / -16.2 / -19.6 |
| Wyatt Hatcher (apron) | fair | deep taper, black | -9.3 / -5.1 / -8.3 |
| Hoang Serrano (shorts) | tan | coil crown, black | -6.2 / -3.5 / -6.3 |

The row is reading the hair's value, not the light: EYES' face-shading read puts every crew face at 109 to 148 degrees,
upper left. Simulated through each head's own mask (the hair repainted at its own light), passing the row needs the hair
painted 110 to 150, grey, which is rule 120(d) broken to satisfy a proxy. PORTRAIT holds the hair true and routed the
ruler to DIRECTION with a proposal (the light row over the skin only through the mask, or with hair and head gear masked
out). The 10/18 crew card (voted UP) had its sprites pointed at this round's re-renders by the shared paths; they now point
at the pixels he voted on, kept at records/target/portrait/voted_10_18/ (from the commit he saw), so its row is clean.

## 8. Round 2: the thirteen gangs' fresh faces, rendered and parked

The same recipe on CHARACTER's thirteen gang bodies (its own build in the person's skin), each head with its face
dials (no two share a skull) and its mask: records/target/portrait/rig/crew/faction_<gang>/ and the hand-off squares and
masks in records/target/portrait/crew/faction_<gang>/. All thirteen read on THE FACE IS THE BODYS FACE's ruler:

| gang | tone | paint | from its own rig skin |
|---|---|---|---|
| Caravans | brown | (131, 97, 85) | 3.3 L* |
| Colorful | bronze | (176, 126, 96) | 7.3 dE, the furthest |
| Anarchists | chalk | (246, 220, 177) | -0.2 L* |
| Blues | deep | (103, 70, 54) | +0.8 L* |
| Homeless | fair | (202, 170, 139) | -0.3 L* |
| Church | porcelain | (222, 179, 145) | -2.9 L* |
| Reds | olive | (202, 156, 120) | 4.8 dE |
| Cartel | tan | (156, 121, 95) | +0.7 L* |
| Trades | brown | (133, 98, 85) | +3.8 L* |
| Mob | pale | (201, 159, 130) | +1.4 L* |
| Network | fair | (199, 165, 134) | -2.0 L* |
| Volunteers | bronze | (175, 125, 96) | 7.4 dE |
| Remnants | fair | (202, 172, 140) | +0.2 L* |

Hair 13 of 13 on their bodies' cut ramps. PARKED out of BOHEMIA_CREW_FACES.json (the list the screens read) for three
things, each with its owner:
* THE CARAVANS CONE touches the render's own frame (EYES' frame leg): PORTRAIT's, the cone or the head next round.
* THREE FACE SHAPES (Cartel, Remnants, Trades) sit outside the star's eye spacing by more than an eighth (EYES' head size
  leg): the dials that make no two gang skulls alike move the eyes; whether the bar holds a dialled face to the star's
  spacing is taste, DIRECTION's.
* CHARACTER's ONE SKIN, ONE PERSON reads two of them (Colorful, Homeless) a rung light: its cheek ruler carries one light
  factor measured on the crew's thirteen (0.44 to 0.67 of the albedo); the Colorful's dialled cheek catches 0.72. Through
  the head's own mask (this gate) both read their own skin. Routed to CHARACTER: read the cheek's light off the mask.
THE FIX IN THIS GATE, found on the gangs: the nearest rung was the verdict, and CHARACTER's table puts pale and olive two
rungs apart on nearly one colour (8.0 apart), so the Red's face 1.2 L* off its own olive read 'pale'. A face now passes
within 10 of its own rig albedo and L* within 8; the table's neighbours sit 8 to 19 apart, the defect he saw 26 to 47.

## ROUTED
* CHARACTER [one skin, one person]: shipped the engine change and both re-bakes in the same hour (3318fe81, ba103ee1);
  this gate's body legs went green on them. Its own gate ONE SKIN, ONE PERSON holds the engine paths; this one holds the
  pictures (the paint through a mask, the hair, the street). The widebrim is its one PORTRAIT debt left (section 6).
* DIRECTION: the light row on the portrait class (section 7), and the head-size bar on a dialled face (section 8), NOTEs on its board.
* CHARACTER: its S7 cheek ruler's one light factor misreads dialled faces (section 8).
* EYES AND EARS: the star tool's screen_square copies the old hand-off window; import
  tools/bohemia_portrait_the_head_from_the_model.py hand_off_window instead and the widebrim reads whole there too.
* RUN TWO: nothing to wire. BohemiaCrewFaces reads the manifest at load; the thirteen gangs' faces join it this round, so
  the settlement street's speakers in a gang's colours wear their starred face the moment the files are live.
* EYES AND EARS [every face beside its body]: the sheet is the measurement; the gate is the standing check.
