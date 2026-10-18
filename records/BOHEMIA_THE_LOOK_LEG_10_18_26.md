# THE LOOK LEG: DINOv2 ON GITHUB'S FREE RUNNER (PLUMBER, 10/18/26, round 63)

Row [the look leg], the twin gate's missing ruler (rule 108 ROUND EIGHT (c); the twin law, 82).
Builds on records/BOHEMIA_THE_TWIN_GATE_10_18_26.md. Research: records/BOHEMIA_RESEARCH_UNLOCK_THE_LIMITS_03_GIVING_THE_CHATS_EYES_10_11_26.md
sections 3 and 4 (DINOv2 small "tracks style and texture more than subject").

Files: .github/workflows/look.yml (the runner's job, in Actions as "look ruler"), tools/bohemia_look_export.py
(the export), tools/bohemia_twin_gate.py (LOOK in the calibration and the score), gates/twin_gate.py (L0 to
L4), .gitignore (tools/models/).

## WHY THE RUNNER

The DINOv2 weights live on dl.fbaipublicfiles.com and huggingface.co; both answer 403 from the chats'
container (measured again this round: CONNECT tunnel refused; download.pytorch.org too). GitHub's standard
runners are free on this public repo and reach all three. So the runner is the box: it holds the weights,
the chats never do, and nothing heavy is ever committed.

## WHAT RUNS THERE

1. THE EXPORT, only when its cache misses. torch 2.8 CPU, facebookresearch/dinov2 cloned at the pinned
   commit 7764ea0f, the model built by the repo's own hub function (dinov2_vits14, pretrained=True, the
   LVD-142M weights), nothing re-implemented. The positional embedding is interpolated ONCE to the 224 px
   grid (16 x 16 patches) by the model's own interpolate_pos_encoding and baked in, so the ONNX is a plain
   ViT at one size with no bicubic resize inside it. Exported with the TorchScript exporter at opset 17;
   onnxruntime checked against the UNBAKED torch model on noise, a flat grey and six pack pieces through
   the gate's own preprocessing; any cosine under 0.9999 refuses the export.
2. THE CACHE: keyed on the DINOv2 commit, the weights' sha256 and the export script; saved the moment the
   export is verified (actions/cache/save), so a red gate later in the job never throws a good export away.
3. THE LINES, re-measured on the runner with LOOK added, on the same pieces and the same pairs as the
   other rulers (the rng draws are untouched, so COLOUR, PATTERN, PAINTER, SHAPE and GRID come out equal to
   the committed ones: L4).
4. THE GATE, with LOOK inside every verdict.

Read access only. Nothing is written back to the repo; the job log, its summary and the "look" artifact
(the runner's calibration, the export's sidecar, any RED card) are the record.

## THE LINE

LOOK is the cosine between two pictures' DINOv2 CLS embeddings (384 numbers each, unit length). The input:
the picture on mid grey, centred on a square (a sprite is never squashed), 224 px bicubic, ImageNet mean
and std (look_input, shared by the export's check and the gate).

- IN at or over the packs' 10th percentile cosine, on the twin or the family mean, whichever is nearer
  (the row's line).
- FAR under the packs' 1st percentile on both (worse than 99 in 100 of his own pairs).
- OUT between.

Why the FAR line is the 1st percentile and not "twice the line" like COLOUR's: a distance can double, a
cosine cannot. With the distance 1 - cosine, twice the line asks for a cosine near -0.9 when the 10th
percentile sits near 0.05, which nothing reaches (measured on the stand-in model this round: noise read
1.13x the line, OUT). The packs' own 1st percentile keeps the rule "nobody picks a number".

The research page said "RED when look is below the family's 10th percentile cosine". That fails one pair
of his own tiles in ten by definition, and the twin gate's T2 holds his tiles under 5 in 100; the 10th
percentile is kept as the IN line and the RED is the 1st.

## THE LEGS (gates/twin_gate.py)

| leg | where | holds |
|---|---|---|
| L0 | every box | git tracks no model file; tools/models/ is ignored; a planted tracked export is red; the workflow pins the DINOv2 commit and the weights' sha256, caches, calibrates, runs this gate, asks for read only |
| L1 | the runner | the ONNX is the verified export (its sha256 and the export's check against torch, in the sidecar) |
| L2 | the runner | the lines carry LOOK for every family |
| L3 | the runner | his piece against itself: cosine 1, IN; his car mirrored IN; his own tiles against each other FAR on LOOK alone under 2 in 100; noise never IN; the finding below printed every run |
| L4 | the runner | the runner's other lines equal the committed ones |

T2 and T3 carry LOOK inside every verdict on the runner (his own tiles under 5 in 100 RED; the flat tile,
the 1.5x upscale and noise RED; the robot and the truck he voted up never RED; the cull of new VOTE items).

## MEASURED ON THE RUNNER

Runs (Actions, "look ruler"): 39152357532, 39152518660, 39152693910, 39153198933, 39153830493, and the
confirming run 39154521184 on a7dfbdc5: TWIN GATE 24 passed, 1 failed with LOOK measured, every L leg green,
the one red T3 on COOK TWO's street joins (the same red the container reads, 17/1). What each run taught:

| run | what happened | what changed |
|---|---|---|
| 1 | the runner reached dl.fbaipublicfiles.com: dinov2_vits14_pretrain.pth, 88,283,115 bytes, sha256 b938bf1b...; the 224 grid baked with max difference 0; torch 2.8's exporter needed the onnx package | onnx 1.23.2 installed; the sha256 pinned in the workflow, the cache key and the export |
| 2 | the graph came out with a second input, 'masks' (the hub forward takes *args) | a one-input wrapper; the export refuses any other graph |
| 3 | THE EXPORT: cos 0.9999999 against torch on 8 inputs, 35.7 ms an image, ONNX sha256 1208f034c9bb...; cached; LOOK's lines measured (table below); L1, L2, L4 green; T2 1 of 80 RED with LOOK in every verdict, robot GREEN, truck AMBER | two legs of mine were wrong (next lines) |
| 3 | noise is not LOOK's: cos 0.175 to his ground tile, nearer than his roughest 1 in 100 ground pairs (0.120) | noise held as never IN, not FAR |
| 3 | the runner's sparse checkout left two rows' own 'before' sheets off disk, and T3 called them missing twins | a non-pack twin git tracks is our own before, as on the container |
| 4 | the cache hit (no re-export, 2 s); his car cut into 8 px blocks and shuffled read IN at the props' line (0.423, line 0.137) | the shuffle printed, not held; each pack's own line measured beside it |
| 5 | flat fill read IN at the family line too; each pack's line sees subject, and fails his YES rig renders | flat fill printed, not held; the line is routed |

LOOK'S LINES (the packs' 10th percentile cosine, pair / to the family mean; FAR under the 1st):

| family | pieces | pair 10th | centroid 10th |
|---|---|---|---|
| door | 30 | 0.463 | 0.730 |
| ground | 391 | 0.200 | 0.464 |
| lamp | 47 | 0.181 | 0.462 |
| marking | 67 | 0.162 | 0.534 |
| prop | 784 | 0.137 | 0.407 |
| road | 278 | 0.356 | 0.621 |
| settlement | 318 | 0.193 | 0.495 |
| all | 1,915 | 0.141 | 0.389 |

THE OTHER LINES AGREE ACROSS THE TWO BOXES (L4): COLOUR, PATTERN, PAINTER, SHAPE and GRID re-measured on the
runner came out equal to the committed calibration, so the twin gate gives the same verdict on either box
when LOOK is not measured.

COST: checkout 30 to 60 s (sparse, blob-less), the libraries 5 to 8 s, the cached export 2 s, the export
itself 25 s when the cache misses, the lines 45 s (3 min with the per-pack lines), the gate 15 to 30 s.
Other lanes' VOTE pushes run it too (the registry is in its paths); one runs at a time and a waiting run is
replaced by the newer push, so a cancelled run is a superseded one, not a failure.

## THE FINDING THAT PROVES US WRONG

AT THE ROW'S LINE, LOOK CANNOT GO RED ON ANYTHING WE CAN PLANT. Against his ground tile, the family's 10th
percentile (0.200 pair, 0.464 to the family mean) reads:

| planted | LOOK | cos to his tile | cos to the family |
|---|---|---|---|
| his tile against itself | IN | 1.000 | |
| his tile's own mean colour, flat | IN | 0.303 | 0.389 |
| a flat mid grey | IN | 0.255 | 0.381 |
| a smooth ramp | IN | 0.332 | 0.382 |
| the 10/10 cook's flat six-step ramp | OUT | 0.140 | 0.313 |
| an 8 px checker | OUT | 0.183 | 0.260 |
| noise | OUT | 0.175 | 0.338 |
| a 1.5x nearest upscale of his tile | IN | 0.941 | 0.547 |

and against his car (pack 10, abandoned cars), the props' line (0.137) reads his car shuffled into 8 px
blocks IN (0.423; COLOUR IN and PATTERN IN, so no ruler sees it), a lamp IN (0.318), a road tile IN (0.299),
a door IN (0.404). His families are too varied: a random pair of his props is less alike than a car and a
shuffled car.

What the whole gate says about the same pieces (the other rulers are the same on both boxes, L4, measured
on the container): every flat fill, the ramps, the checker, noise and the upscale are RED (PATTERN and
PAINTER FAR, GRID on the upscale), so LOOK adds a reading that agrees there. BUT THREE PASS GREEN: his car
shuffled into 8 px blocks, a road tile named as his car's twin, and a door named as his car's twin. NO RULER
IN THE TWIN GATE SEES WHAT A THING IS: colour, grain, painter numbers, grid and the 8x8 ink are all blind to
subject and shape, and LOOK at the family line is too loose to say it. A cook that names a car and draws a
road tile passes today.

EACH PACK MEASURING ITSELF IS THE LINE THAT SEES. 56 of his packs hold 8 or more pieces in the bank (1,342
pieces). Against his cars pack (20 pieces, 10th 0.760, 1st 0.712): the shuffled car FAR, the lamp, road tile
and door FAR, his car mirrored IN (0.988). The loosest packs: weapons and supplies 0.123 / 0.072, street
props 0.148 / 0.101, survival props 0.191 / 0.119, winter food and drinks 0.191 / 0.129, trash and junk
0.191 / 0.146.

AND IT WOULD FAIL HIS YES. The robot (0.470) and the truck (0.404) he voted up read FAR against the cars
pack: they are rig renders, and rule 115 made the rig the look for every character, beast, vehicle and prop.
So a pack line can hold only what stays on the packs (the ground, rule 115b), and T2's premise "any two of
his ground tiles are twins" would become "two tiles of one pack".

ROUTED TO THE COORDINATOR (the line is a ruling with consequences for every cook's kit; the lane does not
move it alone): (a) keep the row's line, LOOK as a third agreeing reading; (b) hold the twin's own pack line
for the ground classes only (tile, road, marking), the family line for rendered classes, T2 sampled within
a pack; (c) a twin-neighbourhood line (the twin against its own nearest siblings). Every run of the workflow
prints the numbers for all three.

## FOR COOK TWO

TWIN GATE's T3 is red on both boxes on cook2-the-street-joins-for-the-map-10-18: all six joins in
records/target/cook2_map_joins/ read PAINTER FAR against their twin on colours per 1,000 px (0.01x to 0.09x
his tile). The card: records/target/twin_cards/cook2-the-street-joins-for-the-map-10-18.png. Not this diff.
