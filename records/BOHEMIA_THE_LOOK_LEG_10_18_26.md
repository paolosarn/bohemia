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
| L3 | the runner | his piece against itself: cosine 1, IN; noise against his ground tile: FAR on LOOK alone |
| L4 | the runner | the runner's other lines equal the committed ones |

T2 and T3 carry LOOK inside every verdict on the runner (his own tiles under 5 in 100 RED; the flat tile,
the 1.5x upscale and noise RED; the robot and the truck he voted up never RED; the cull of new VOTE items).

## MEASURED

(filled from the runner below)
