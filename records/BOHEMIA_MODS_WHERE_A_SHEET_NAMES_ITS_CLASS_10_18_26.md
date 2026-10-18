# MODS [a sheet's class] -- WHERE A SHEET NAMES ITS CLASS (10/18/26)

RESEARCH ONLY (rule 22, 38g). Nothing implemented, nothing in the game reads anything here, no VOTE sheet (rule 88).
Instrument: tools/bohemia_mods_sheet_class.py (reads only, about one minute; `--json` for the numbers). Draft shape:
banks/BOHEMIA_MODS_SPRITE_DECLARATION_DRAFT_10_18_26.json, new key `a_mods_sprite_declaration.a_packed_sheet`.
From [sheets not stills] sections 3 and 6 (records/BOHEMIA_MODS_THE_TEN_TESTS_ON_A_PACKED_SHEET_10_18_26.md).

## 0. THE FINDING IN FOUR SENTENCES

A packed fight sheet needs a class in exactly TWO places beyond the file: the face block (portrait, not person) and
ONE clip that lies down; everything else on the grid is the file's own class. The row assumed three lying clips
(sleep, down, dead); the pixels say sleep IS dead (the `dead` clip plays the `sleep@0` column), only `dead` lies
(50 of 52 frames wider than tall, 51 of 52 lit more than 45 degrees off the look's standing light), and `down` SITS
(0 of 208 wider than tall, 42 of 208 off the light, against 6 to 16 per 200 on the standing clips), so it needs a
softer word than lying. Nothing that exists today names a class anywhere: fight_people.json's `kind` is who (you,
cast, faction), its face is a sentence ("right of the last column, top row"), and every rig.json's only class-like key,
`card.family`, reads `prop` on 39 of 40 rigs including the man, the thug and the dire wolf, because it names the card
band DIRECTION judged it on, not what it is. The smallest addition is two optional keys: `blocks` (name, class,
rectangle) and `pose` on a clip (standing, low, lying), with the file's `class` as the default for every frame.

## 1. WHAT THE FILES ALREADY CARRY (measured)

| where | key | what it says | readable as a class? |
|---|---|---|---|
| fight_people.json, file | frame 112, figure_bbox, rows [SE, SW], cols (34, `clip@phase`) | the grid | no: geometry only |
| fight_people.json, file | face {size 64, at "right of the last column, top row"} | the portrait's place, in words | the rect is computable ([34 x 112, 0, 64, 64] = [3808, 0, 64, 64]; present on 26 of 26, the 160 px under it empty on 26 of 26) but the class is implied by the key's name |
| fight_people.json, per look | file, name, kind, worn | kind is you 1, cast 12, faction 13 | no: all 26 are the person class |
| fight_people.json, per clip | cols, beats, loop, note, then | a pose only in the note's English ("flat on the ground", "sitting up, crawling") | no |
| fight_people.json, cols | `floor-rise@0.1042` is in no clip; `crawl-dying@0.1042` sits in both fall and down | a column can belong to two clips | so a pose must live on the clip and a column takes the strictest of its clips |
| rig.json (40 files) | card.family | prop 39, missing 1 | NO: a band, not a class (the man, thug, poacher, marksman, wolf, fox all read prop) |
| rig.json | class / kind | absent on 40 of 40 | no |
| rig.json | portrait -> portrait.json | on 4 (man, robot, thug, poacher) | yes, by file: the portrait is ANOTHER file with its own ppm 400, tilt 80, 96 px head, facings S, SE, SW |
| rig.json | clips | Anim_0, Bite, Idle, Stand, Survey, Walk, Walking | no pose key |
| the folder | records/target/character/rig 14, master_rig 9, direction_style_guide 8, direction_rig_round_five 4, cook3/rig 3, portrait/rig 2 | the lane that made it | no: a person sits in four folders |

So the rig already does what the school does (section 2): body and portrait are two files, each one class. Only the
packed fight sheet puts two classes in one picture, and its portrait is at another pixel size by design (rig portrait
ppm 400 against the body's 57), which G1 (one pixel size) would call a mixel unless the block is declared portrait.

## 2. THE SCHOOL: WHO TAGS A SPRITE INSIDE A SHEET

| game | where the class lives | inside the sheet |
|---|---|---|
| **Battle Brothers** (the community kit, bbrusher: a .brush XML manifest plus one packed atlas PNG; unpacked to metadata.xml) | the BRUSH: one brush per kind of picture, named for it, and the sprite id's prefix | one `<sprite>` entry per picture with its id and geometry (size, box, draw offsets); no class or pose attribute per sprite |
| **Stardew + Content Patcher** | the ASSET the patch targets: a character's body sheet and the same character's portrait are two assets (Characters/<name> and Portraits/<name>) | an EditImage patch carries FromArea and ToArea as X, Y, Width, Height only, plus PatchMode (Replace, Overlay, Mask) and a LogName for the whole patch; an area takes no tag or category (the author guide's field table) |

Both tag the FILE, never the frame, and both keep a portrait out of the body's sheet. Our fight sheet broke that on
purpose (one fetch per look, rule 69), so it owes the check the one thing the school gets for free: the face's class
and rectangle. Content Patcher's area is the shape to copy (four numbers), plus the class word it never needed. Neither
game declares a pose: their checks are geometry only (records/BOHEMIA_MODS_A_MODDER_RUNS_THE_SAME_TEN_TESTS_10_18_26.md);
ours runs a light row, which is the only reason `pose` exists.

Sources (search and fetch from this container, the BB wiki still blocked): Content Patcher author guide,
action-editimage.md in Pathoschild/StardewMods (fetched: the field table and "areas accept X, Y, Width, Height");
bbrusher's .brush and metadata.xml through search text (the per-sprite attribute names are the community kit's, as
the style-guide page already said, and not verified against an unpacked vanilla brush here).

## 3. THE POSE, MEASURED (26 looks, both facings, the craft audit's light angle per frame against the look's own
## standing median, more than 45 degrees off counts)

| clip | cols | frames | wider than tall | light off |
|---|---|---|---|---|
| idle | 4 | 208 | 0 | 13 of 200 |
| step | 4 | 208 | 0 | 6 of 207 |
| aim | 1 | 52 | 0 | 1 of 52 |
| shot / shot_1h | 4 / 4 | 208 / 208 | 0 / 0 | 6 / 6 of 208 |
| hit | 4 | 208 | 0 | 15 of 204 |
| swing | 3 | 156 | 0 | 16 of 154 |
| fall (4 of its 5 cols; the 5th is counted in down) | 4 | 208 | 0 | 11 of 203 |
| (no clip) floor-rise@0.1042 | 1 | 52 | 0 | 7 of 52 |
| down | 4 | 208 | 0 | **42 of 208** |
| dead (sleep@0) | 1 | 52 | **50** | **51 of 52** |

Three bands, not two: standing 3 to 10 percent off (the four looks lit from below are measured against their own
median here, so they do not inflate this), low 20 percent, lying 98 percent. The alpha box alone finds lying on 50 of
52 (YOU and homeless lie square, 78 by 78, on SW) and never finds low, so a declared word beats a guess from pixels,
and the guess stays as the fallback for a mod that declares nothing.

## 4. THE SMALLEST ADDITION (in the draft; nothing reads it)

- `class` on the row stays the DEFAULT for every frame on the grid. No class per frame and none per row: a row is one
  body from another side (the school tags the file).
- `blocks`: optional list of `{name, class, rect:[x, y, w, h]}` in sheet pixels for anything off the frame grid; a
  pixel inside a block is checked as that class and never as a frame. A block outside the image is M22 (geometry,
  skipped by name, the way the folder design already skips). The fight's face becomes
  `{"name":"face","class":"portrait","rect":[3808,0,64,64]}`.
- `pose`: optional on a clip, `standing` (default), `low`, `lying`. The mod describes the body; the STYLE GUIDE says
  what each word does to a test (DIRECTION's call). The measured split suggests: lying skips the light row, low reports
  it without failing. A column in two clips takes the stricter clip's pose.
- NOT added: a second class word beside `family`. The draft's own example named the robot `class: prop` and
  `family: prop`; rig.json's card family is why. `family` is the band a sprite is judged against, `class` is what it
  is; a check that reads one for the other tests a man as a prop.

## 5. ROUTED

- **DIRECTION** [the style guide]: (a) what `low` and `lying` do to G3 (the numbers above); (b) whether the portrait
  class's pixel size inside a body sheet is a declared exception to G1 or the face must ship as its own file the
  school's way; (c) `card.family` is a band: if the guide's classes table is the class, every rig.json is missing one.
- **PLUMBER** [the not vibe coded gates]: read `blocks` and `pose` when the sheet check is built (section 6 of the
  sheets page, steps 2 and 4); the face rect from fight_people.json is computable today without any new key.
- **COMBAT** (owner of fight_people.json): no ask. `face.at` in words is the one place a check must parse English; a
  rect beside it would end that, the day the sheet is next touched. `floor-rise@0.1042` sits in no clip (unused col).
