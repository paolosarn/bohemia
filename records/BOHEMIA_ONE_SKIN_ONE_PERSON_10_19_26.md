# ONE SKIN, ONE PERSON (CHARACTER, 10/19/26)

Row: CHARACTER [one skin, one person] THE-BODY'S-SKIN-IS-THE-TRUTH (rule 120(d), first on the board).
His words, 10/18, to the coordinator: "the portraits don't even look alike, bro it's all fucked up Black people looking
like white people."
Session: character-one-skin, opened by the coordinator (rule 112) on Opus 5.5 at Extra (rule 116).

## 1. WHAT WAS WRONG, MEASURED (off the pixels, never a field)

Four renderers draw a person and none of them stored his skin:

| renderer | where its skin came from | measured on the 25 people the fight bakes (12 cast + 13 gangs) |
|---|---|---|
| the flat body (the alpha's famPaintBody, baked into slices/fight_people and slices/settlement_people) | the global `skinTone`: THE PLAYER'S | **25 of 25 wore porcelain**, the player's default |
| the flat 64 face beside it (faceFor's roll, kin-blended to the family) | its own roll | 17 of 25 a dark tone (onyx, ebony, deep, brown); **0 of 25 matched its body** |
| PORTRAIT's fresh faces (the crew screen, the hire post) | by eye, off that 64 face | 8 of 13 skin_deep |
| CHARACTER's rig bodies (the map's gang parties) | one constant (150, 112, 88) | **13 of 13 the same tan** |

The cause, one line: famPaintBody set `G.faceAs = faceFor(...)` (the face, carrying its tone as `_tone`) but never
`skinTone`, and the body's ramp (`skinRampFor`) reads `skinTone`. The street crowd was always right (it sets skinTone
from NPC_FACTORY before drawing); everybody drawn through famPaintBody (the cast, the gangs, the family) was not.
A dark face sat on a porcelain body: exactly his sentence.

A second defect on the same line, found on the way: famPaintBody keyed every non-family member through famFaceKey,
which makes anybody who is not a parent a CHILD of the family's two parents. The twelve cast and the thirteen gangs
were all RAY and DENISE's kids on the body, while their 64 face was nobody's. ONE ID, ONE WHOLE PERSON: fixed (a
member outside FAMILY_CAST is keyed the way the bake keys his 64 face: the same id and the same ruling, so the two are
one faceFor call).

## 2. THE FILE (the truth)

records/target/character/BOHEMIA_ONE_SKIN.json, written by tools/bohemia_character_one_skin.py. 28 people: YOU, the
twelve cast, the thirteen gangs, COOK THREE's thug and poacher. Each: a tone on the game's own eleven-step ladder
(SKIN_TONES: chalk, porcelain, pale, fair, olive, tan, bronze, brown, deep, ebony, onyx), the flat ramp, the ONE rig
albedo for that tone (a style palette step, body and head alike), heritage, who, source.

Who is who: the crew from PEOPLE's bank (banks/BOHEMIA_WHO_THE_FACE_IS_10_18_26.json: Amaury Carrasco, Amos Ferris,
Otis Wexler, Tasha Hargrove...), so the name, the face and the body are one person; the gangs from the census mix,
one representative each (no gang has an ethnicity in canon; the Pures, Panthers, La Familia and Triads are social
forces inside the factions and stay that).

THE MIX: these 27 (YOU is his own) are 37% white, 33% Hispanic, 15% Black, 7% Asian, 7% mixed. Las Vegas city 2020:
40.4 / 33.3 / 12.3 / 7.0 / 5.3 (Census Dots); Clark County: 35.6 / 33.4 / 14.4 / 12.5 (U.S. Census QuickFacts, as
PEOPLE used it for the names). His 9/21 on the names ("a little more percentage of white people... keep it natural...
this game isn't a Hispanic game") is why the white share sits at the city's number, not under it.

YOU stays his: the face maker's skin swatch (HE CAN BUILD HIS OWN FACE), porcelain by default.

THE RIG TABLE, MEASURED: PORTRAIT's thirteen crew faces render their cheek at 0.44 to 0.67 of their albedo's luminance,
median 0.56 (one hard sun and the dust pass), so a rig skin cannot reach the flat ladder's light end. What it keeps is
the ORDER: chalk skin_light 4, porcelain skin_light 3, fair skin_deep 4, olive skin_mid 3, pale skin_light 2, tan
skin_deep 3, bronze skin_mid 2, brown skin_light 1, deep skin_deep 2, ebony skin_mid 1, onyx skin_light 0. PORTRAIT's
own picks land where they already were (its skin_light 3 is YOU's porcelain, skin_deep 2 is deep, skin_deep 3 tan).

## 3. WHAT READS IT NOW

- The alpha: CITY_CAST_LOOKS and FACTION_LOOKS carry `skin:`; `famSkinOf(member)` finds it by the look's worn list or
  its name; famPaintBody hands faceFor `skinTone` and then sets the body's `skinTone` from the face's `_tone` (and puts
  the player's back); faceFor wears a ruled `over.skinTone` over the roll and the kin blend. A person nobody named
  (the family) keeps ONE roll, now worn by the body too.
- tools/bohemia_fight_people_bake.js (one line): the 64 face is keyed as the body's face is, skin included.
- The bakes re-run: slices/fight_people (25 sheets; YOU unchanged byte for byte) and slices/settlement_people (25).
  The demo's fight and its settlement screen load these files, so the demo wears it on deploy.
- tools/bohemia_character_the_thirteen_through_the_rig.py: `skin_for(name)` reads the file, so every rig body (and every
  body PORTRAIT builds with this tool for a head) wears the person's step. The thirteen models are rebuilt (only the
  skin material moved, measured on the model's colour table).

MEASURED AFTER, off the pixels: 26 of 26 fight sheets and 25 of 25 settlement sheets wear the person's own tone on 95%
or more of their skin pixels (the exact ladder colours), and 26 of 26 64 faces wear the same tone as their body.

## 4. WHAT IS STILL OWED, NAMED

- PORTRAIT [the face is the body's face]: 9 fresh faces read more than one rung off their body on the rig ladder
  (longcoat, barearms, pack, skirt, widebrim, cape, apron, bedroll, shortcoat). The gate holds them as a list that may
  only shrink. PORTRAIT's head skin = people[look].rig.
- The rig renders (records/target/character/rig/<gang>/) are re-rendering through DIRECTION's rig with the new skin,
  about half an hour a look on this box; then RUN's rig cast sheet (tools/bohemia_bake_the_rig_cast.py) re-bakes so the
  map's parties wear it.
- The demo file itself (slices/BOHEMIA_DEMO.html) carries a copy of the alpha's code: RUN's next cut takes the fix.
  What he sees in the demo's fight and settlement is the re-baked sheets, which it loads from disk.

## 5. THE GATE

gates/one_skin_one_person_gate.py (ONE SKIN, ONE PERSON), no browser, 9 s: the file whole (S1), the look tables carry
it (S2), the body reads it (S3), the flat body and the settlement people off the pixels (S4), the 64 face (S5), the rig
model (S6), PORTRAIT's faces on the rig ladder with the frozen list (S7). Mutation-proven: a before sheet put back
fails S4 and S5; one table skin changed fails S2; the body's read removed fails S3. 15/0.

[bb Battle Brothers builds a man from stacked sprite layers (body, head, beard, hair) picked per background, and the
portrait you see in the roster IS that stack, so the face on the screen and the man on the field are one picture; ours
draws them in different renderers, so the one person has to be one value in a data file a modder can edit.]
[analog horror: the skin is the person's, never a filter; a face lit by the one sun reads darker than the flat body,
and that drop is the rig's light, measured, not a second skin.]
