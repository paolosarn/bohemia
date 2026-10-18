# MODS [sheets not stills] -- THE TEN TESTS ON A PACKED SHEET (10/18/26)

Lane 22 MODS, session mods-59jyd6. Row: THE-TEN-TESTS-ON-A-PACKED-SHEET. RESEARCH ONLY (rule 22, 38g): nothing
implemented, no VOTE sheet (rule 88). From [the ten gates as a mod check] section 4: the fight reads a packed sheet
per look, the ten tests were measured on one still. This page measures what a sheet check costs on every look in
slices/fight_people, which rows change between a still and a sheet, and whether a sheet passes as a whole or per frame.

Instrument: `python3 tools/bohemia_mods_sheet_cost.py` (reads only, about 2.5 minutes; `--json` for the numbers). It
loops over the rows and cols fight_people.json declares and runs check.py's four craft rows (one pixel size, light
angle, banding, stray pixels at 8 steps) per frame and on the whole sheet, plus two rows a still cannot show (SW
against SE mirrored; each clip's first frame against idle). Measured at origin/main 0367670, which already carries
DIRECTION's style guide (records/target/BOHEMIA_STYLE_GUIDE.json, 077f30f), so the page measures against the real
file, not a draft. Network: the wikis do not resolve from here; the two school citations came through search text.

## 0. THE FINDING IN FOUR SENTENCES

A sheet passes PER FRAME, never as one picture: checked whole, the same sheet loses its light row (the craft audit
reads a 3,872 by 224 strip as flat, light None, on all 26) and its banding doubles (YOU: 54.5 on the sheet, 23.2 on
the idle frame), because the 64 px face block and 68 frames side by side are not one lit object. Per frame is also
the CHEAPER loop: 68 frames take 2.7 s a look in-process against 3.6 s for the whole sheet; the full check.py with
the card is 0.5 s a frame, so 34 s a look and about 15 minutes for all 26. PROVES THE ROW WRONG: there are 26 looks
(the board said 27) and TWO facings (SE, SW), not eight, so the guide's G6 ("eight facings agree") and its camera
field ("eight rendered facings") meet a fight sheet with six facings missing, and the sheet check must read the
facings from the sheet's own `rows`, not from the guide. On today's flat sprites the tests do their job: every frame
is far under the person class's 800-colour floor (YOU's idle frame: 23 colours), and four looks are lit from BELOW
on most of their frames (satchel 68 of 68, colorful 66, caravans 62, church 45), the guide's named mistake "A LIGHT
FROM ELSEWHERE", which a still of one look would never have shown across the fleet.

## 1. THE SHEET, AS DECLARED

slices/fight_people/fight_people.json (COMBAT, rule 69): frame 112, rows SE and SW, 34 cols (idle, walk, stagger-hit,
bat-arc, two-hand, sleep, floor-rise, crawl-dying, fire-2h, fire-1h at phases), a 64 px face to the right of the last
column on the top row, ten clips naming their cols. Each look is one lossless WebP of 3,872 by 224 (34 x 112 + 64,
2 x 112). 26 looks: YOU, 12 cast, 13 factions. 1,768 frames, none empty.

## 2. WHAT A SHEET CHECK COSTS (measured, this container)

| loop | per frame | per look (68 frames) | all 26 looks |
|---|---|---|---|
| the four craft rows, in-process | 0.038 s | 2.5 to 2.9 s | 69.6 s |
| the same four rows on the whole sheet as one image | n/a | 3.3 to 4.2 s | 94.0 s |
| check.py in full (the card's eight rows + the craft), one process per frame | 0.51 s | about 34 s | about 15 min |

So a modder adding ONE look waits about 3 seconds for the craft rows, about half a minute with the card. The card is
the slow part because it is a subprocess per image; one process over the 68 crops is PLUMBER's call, not this lane's.

## 3. THE ROWS THAT CHANGE BETWEEN A STILL AND A SHEET

| test (guide id) | on a still | on a sheet, measured | what the sheet check must do |
|---|---|---|---|
| G1 pixel size | one block size | 0 of 1,768 frames off block 1; the whole sheet also 1 | per frame or whole agree; cheap either way |
| G2 colour count | one count against the class floor | YOU's idle frame 23 colours against the person floor 800; whole-sheet counts sum the face and all frames, a meaningless number | per frame, against the class of the ROW (person), the face block against portrait |
| G3 light direction | one angle | per frame: 22 of 26 looks hold one light (SE median 273, SW 267 on YOU; cartel 267 and 267); the 2 frames out in each of those are `sleep@0` (a lying figure, the angle turns with the body); 4 looks lit from below on 45 to 68 frames; whole sheet: None (flat) on all 26 | per frame; the lying clips (sleep, down, dead, crawl-dying, floor-rise low phases) skip or take a rotated band; a look's verdict is the share of standing frames inside the band |
| G6 silhouette across facings | cannot run | 2 facings, not 8; SW is NOT a mirror of SE (silhouette overlap 0.85 to 0.90 median, colours identical on only 56 to 86 percent of shared pixels), so the two are drawn per facing as the guide wants | read the facings from the sheet's `rows`; agree on height, foot row and area across what is there; name the missing ones as a note, not a fail, until COMBAT ships more rows |
| G7 three values, G8 clean lines | one image | per frame (binary alpha holds frame by frame) | per frame |
| G9 repetition | n/a for a person | n/a | skip for the person class |
| clip separation (not one of the ten) | cannot run | each clip's first frame against idle@0 on SE, as 1 minus silhouette overlap: recorded per look in `--json` | a report row only; the guide has no number for it, DIRECTION's if wanted |
| banding (the craft row; guide shading.banding 0) | 0 or not | 568 of 1,768 frames carry banding (1 frame on skirt to 42 on YOU and trades); whole sheet always banded | per frame; the person class needs DIRECTION's call whether banding 0 holds for the old flat sprites or only for rig renders |

## 4. WHOLE OR PER FRAME: THE SCHOOL

| game | how a sheet is judged | source |
|---|---|---|
| **Stardew (Content Patcher, SMAPI)** | a sheet is a grid of fixed frames (the farmer: 16 by 32 crops, rows by facing); a patch names a rectangle and SMAPI checks the rectangle against the sheet, per patch; LEFT IS RIGHT FLIPPED, so the farmer sheet carries no left row | [Stardew wiki: Modding:Farmer sprite](https://stardewvalleywiki.com/Modding:Farmer_sprite), [mirror wiki copy](https://wiki.stardewvalley.net/Modding:Farmer_sprite) |
| **Battle Brothers** | a .brush is an XML manifest over one packed PNG atlas, ONE ENTRY PER SPRITE with its id, size, box and offsets; the game draws a sprite by id, never the sheet as an image; copied sprites must be renamed or the ids collide | [skillsmp: Battle Brothers brushes skill page (suor/battle-brothers-mods)](https://skillsmp.com/creators/suor/battle-brothers-mods/claude-skills-brushes) |
| Factorio, Minecraft, RimWorld (last round's page) | per sprite rectangle (Factorio), per frame height multiple (Minecraft), per facing file (RimWorld) | records/BOHEMIA_MODS_A_MODDER_RUNS_THE_SAME_TEN_TESTS_10_18_26.md section 1 |

None of the five judges a packed sheet as one picture: every one addresses a frame or a sprite by rectangle or id.
Ours already does the same at runtime (the fight draws `cols[floor(progress * cols.length)]`), so the check reading
the same rectangles is the honest read. Stardew's mirrored left row is the contrast: a flip keeps a light that is
straight overhead (270 maps to 270), and breaks a side light. The guide's sun reads 155.4 degrees on screen, a side
light, so its "never mirrored" is right for the rig, and our two drawn facings already obey it.

## 5. ONE NUMBER TO SETTLE BEFORE G3 IS BUILT (routed, not decided here)

check.py's light row uses the 7/27 craft audit's convention (270 is straight up, 180 is left) and accepts 180 to 360.
The guide's `fields.light.screen_light_deg` is 155.4, measured on the calibration sphere, and G3 reads it with a 30
degree window. Read in check.py's convention, 155.4 is left and slightly below, outside check.py's own band, and every
standing frame of our 22 good looks (about 267 to 273) is 112 to 118 degrees from it. Either the two numbers are in
two conventions or the old sprites and the rig are lit from different sides. That is a fact for DIRECTION and
PLUMBER to state in one convention before G3 runs on a sheet; until then a sheet G3 on the old sprites would mark
22 good looks OUT.

## 6. WHAT THE SHEET CHECK IS (the shape, for PLUMBER when he builds; nothing built here)

1. Read the sheet's own declaration (frame, rows, cols, face), never assume eight facings.
2. Crop each declared frame; crop the face block to the portrait class.
3. Run the ten functions (png, class, thresholds) on each frame, as last round's page routed.
4. Skip the light row on lying clips by clip name (the declaration's clips carry the names already).
5. Aggregate: a look passes a row when every standing frame passes it; print the frames out by `row col` so a modder
   sees `SW bat-arc@0.5` and not a percentage.
6. Compare the facings to each other (G6) across the rows present; a missing facing is a note.

Warn and load, as before (his 9/30 and 10/9): a mod's sheet with OUT frames still loads; the report names the frames.

## 7. ROUTED

- **PLUMBER** [the not vibe coded gates]: per frame, not per sheet; the face block is portrait class; lying clips skip
  the light row; the card as one process over the crops if 15 minutes for the fleet is too slow for the suite.
- **DIRECTION** [the style guide]: (a) one convention for the light angle (section 5); (b) G6's eight facings against
  the fight's two rows: name what a two-row sheet must agree on; (c) banding 0 for the person class on the old flat
  sprites or only on rig renders; (d) the four looks lit from below (satchel, colorful, caravans, church) as a fact
  for COOK THREE's remake order.
- **COMBAT**: the board row said 27 looks; the file carries 26. Nothing else; the demo is untouched.
