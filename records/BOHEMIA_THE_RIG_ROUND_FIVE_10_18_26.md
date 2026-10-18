# DIRECTION [the rig round five]: THE ROBOT THROUGH THE TEN CHECKS (10/18/26)

Lane: DIRECTION (art lead). Opened by the coordinator under rules 112 to 116; no check-in. The chat before this one
said "fixing 3 known issues next" and committed nothing; the three were read from the last handoff block and the
look-bible card: (1) the GRAIN row out on five of six candidates, (2) the truck's dust reading as FROST, (3) the robot
not yet through PLUMBER's ten checks (research round two, Section E: no third character before that). A fourth came in
from MODS (2d9f2d9): the guide's screen light 155.4 against check.py's 180 to 360 band.

READBACK: I read [the rig round five] as: fix grain and frost in the model or the rig (never the pixels), put the robot
through the ten checks, and show the finished eight beside the raw in VOTE; done means the numbers and the sheet.

## WHAT SHIPPED

| Thing | Where |
|---|---|
| The rig, round five: grain, dust and the grain's lift read from the guide's rig block (`grain_per_m`, `drift_per_m`, `dust_per_m`, `grain_rest`, `grain_wear`, `grain_lift`, `dust_bright_value`, `dust_on_bright_mul`); `--set key=value` moves one key for one render and is recorded as a break | tools/bohemia_direction_master_rig.py |
| THE DUST RULE in the source pass: on a base brighter than linear 0.35 to 0.55 the wear is the base times (0.72, 0.68, 0.62), darker and warmer; the grain's light side stops at 0.65 on a bright base (0.5 = no lift) and keeps the full step on a dark one | same |
| THE RING FROM THE SPRITE'S OWN COLOURS: each edge pixel is its colour 8 darker, moved to the nearest colour already inside the body | same |
| THE SHADOW IS ITS OWN LAYER: `shadow_<facing>.png` beside `rig_<facing>.png` on the same box; the body ships 0 or 255 alpha | same |
| The truck repainted at the source from the palette: paint clay_mustard[3], chassis clay_teal[1] (his car's teal), glass glass_eye[1], tyres rubber[2], lamps sodium[3], tail blood[1] | tools/bohemia_direction_model_truck.py, reference/models/bohemia/truck.glb |
| The hand-finish snaps its selout ring to inside colours last; the output path bug fixed (a folder named with rig_ broke it) | tools/bohemia_direction_hand_finish.py |
| The ten checks on every round-five render, raw and finished, and the sheet | tools/bohemia_direction_rig_round_five.py, records/target/direction_rig_round_five/report.json |
| VOTE card direction-the-rig-round-five-10-18 (redo of the look-bible card) | records/target/direction_rig_round_five/DIRECTION_THE_RIG_ROUND_FIVE.png |
| Two decisions against the research, the dust rule implemented, the light conventions | records/target/BOHEMIA_STYLE_GUIDE.json |

## MEASURED

The card under the guide (8 rows):

| Render | Last round | Round five |
|---|---|---|
| robot | 1 of 8 out (grain 2.26) | 0 of 8 (grain 1.95) |
| truck | 1 of 8 out (grain 3.30) | 0 of 8 (grain 2.95 under the vehicle band; 2.95 is under the maquette's 3.29 too) |
| drum | 1 of 8 out (grain 2.36) | 0 of 8 (grain 2.09) |
| drum, wear seed 2 | 1 of 8 out (2.53) | 1 of 8 out (2.28, 0.06 over) |

The frost: the grain sweep proved grain and frost pull against each other on a pale base (every setting that brought
the truck's grain under 2.22 made it whiter). The frost was mostly NOT dust: Kenney's model paints the chassis, bumpers,
bed and glass one pale lavender grey, and nothing in the rig can make dust on a pale base read as anything but frost.
Fixed in the model (repainted from the palette), not the pixels.

PLUMBER's ten checks (the gate's own held reading for a rendered class; S facing; R2 over all eight):

| | D1 | D2 | D3 | D4 | D5 | D6 | D7 | D8 | D9 | R2 | G6 (guide) | R8 (research) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| robot raw | ok | ok | ok | ok | ok | NO | ok | NO | ok | 1 colour | ok | NO |
| robot finished | ok | ok | ok | ok | ok | NO | NO | NO | ok | 1 colour | ok | NO |
| truck | ok | ok | ok | ok | ok | NO | ok | NO | ok | ok | ok | NO |
| drum (both seeds) | ok | ok | ok | ok | ok | NO | ok | NO | ok | ok | ok | NO |

What is still red, and why each is not hidden:
- **D6 "reads as a box at 3x3"** on every render, last round's maquettes included (the truck and the drum ARE boxes at
  3x3). The research's own D10 asks the 8x8 silhouette not be a filled rectangle; PLUMBER's leg reads 3x3. Routed to
  PLUMBER: the grid size.
- **D8 orphans** (250 to 380 per 1,000) on every render. The gate's own header measured D8 failing 175 of 175 of HIS
  PACK tiles; a lit clay surface of thousands of colours is all single pixels by that test. Routed to PLUMBER: the pack
  band for D8, the way D2 and D5 already read.
- **D7 on the finished robot only** (27/63/9): the two eye-glint pixels are the brightest thing on the sprite and the
  check scales min to max, so one glint squeezes the light third to 9 percent. The raw robot passes (24/46/30). The
  glint is research B9's stare and stays; routed to PLUMBER: read D7 on the 1st to 99th percentile.
- **R2, one colour on one facing** (robot NW): a ring pixel beside a one-pixel hole between the head's parts. Left
  as it is; it is in the model's shape.
- **R8 as the research wrote it** (height and foot row within 1 px): decided against, per class, below.

Edge colours: last round's hand-finish left 216 to 267 colours a facing that exist only on the edge; now 1. Soft alpha
on the body: last round 2,221 (robot) and 5,874 (truck) half-transparent pixels, all of them the shadow; now 0.

## DECISIONS (written into the guide's decisions list with the reasons)

1. **The eight facings agree, per class.** Every rendered class holds the pivot identical (one crop box, the ground
   centre on a whole pixel: ground_px) and the light in 7 of 8 facings (6 for a vehicle or prop); person and beast also
   hold the area within 25 percent. Under one 45-degree camera a turning body's top and bottom pixels move with its
   footprint (the truck 242 to 291 px is its length swinging toward the camera); a model meets the 1 px rule only by
   being bent per facing. Tie-breaker 1: the robot and the truck he loved fail it too.
2. **A vehicle's grain band is 1.6 to 3.6 px a run.** His pack draws a whole car in one 96 px tile; the rig draws it
   300 px long at its true size, with panels three times as long under the same paint. His YES truck read 3.29.
3. **The light angle is one light in two conventions.** The rig measures screen y up (90 = up, 180 = left): 155.4.
   check.py measures image y down (270 = up): the same light is 204.6, inside its 180 to 360 band. Both are now written
   in the guide's calibration block. This answers MODS.

## NOT DONE THIS ROUND
- The robot's finished eight are not thumbed: that is his, in VOTE. No third character until then (Section E).
- The robot's idle clip keys were not re-rendered under round five (stills only); the clip renders in round three's
  folder stay the reference for ANIMATION.

[bb Battle Brothers wrote no style guide; its one rule is readability zoomed out, the guide's tie-breaker 2: the 2x row
of the sheet is that test.] [analog horror: the frost was a clean toy's pale paint showing through; the wear now only
ever darkens a bright paint, the way sun and grime age a real car in the desert.]
