# THE TWIN GATE (PLUMBER, 10/18/26, round 62)

Row [the twin gate], rule 108 ROUND EIGHT (c), the twin law (82). Research it builds:
records/BOHEMIA_RESEARCH_UNLOCK_THE_LIMITS_03_GIVING_THE_CHATS_EYES_10_11_26.md section 3.
Files: tools/bohemia_twin_gate.py (the rulers, the calibration, the card, the critic loop),
gates/twin_gate.py (in the suite as TWIN GATE, about 4 s, no browser), gates/twin_gate_baseline.json
(the 644 registry ids from before the gate, frozen; three rows that landed during the round are held: COOK FOUR's school scored AMBER against pack:5. Roof tiles#30, PATTERN outside the spread), records/target/BOHEMIA_TWIN_CALIBRATION.json.

## WHAT IT DOES

A new piece is scored against its NAMED PACK TWIN and its FAMILY, at the twin's pixel size (ours brought to
his box nearest-neighbour, never his to ours; an opaque sheet cut into twin-sized cells), with rulers that
share no formula, so no cook can tune against one number:

| ruler | what it reads |
|---|---|
| COLOUR | earth mover's distance between the colour distributions in CIE Lab (sliced, 48 fixed directions) |
| PATTERN | local binary patterns on the luminance, chi-square between histograms |
| PAINTER | DIRECTION's five numbers (colours per 1,000 px, value range, dark-line share, detail, saturation), ours over his |
| GRID | the block size equals the family's (1 for the HD packs); no fractional grid |
| SHAPE | the 8x8 silhouette's ink inside the family's 5th to 95th percentile (or his twin's own) |
| SSIM | printed on every card, never a pass condition (the research's hack detector) |
| LOOK | DINOv2 ViT-S/14 cosine, when its ONNX weights are at tools/models/dinov2_vits14.onnx |

EVERY LINE IS THE PACKS MEASURING THEMSELVES: per family, 600 pack-against-pack pairs and every piece
against the family centroid; the 90th percentile is the line. Nobody picked a number. 1,915 pack pieces,
seven families plus 'all', 18 s to recalibrate.

VERDICT: GREEN every ruler inside the packs' own spread; AMBER one outside but within twice it, or the shape
outside (ships, logged as debt); RED past twice on both the twin and the family, a painter number past the
wider of twice its spread and the research's 0.33 to 3.0 line, or a wrong or fractional grid. A RED item's
card (his twin and ours at his size, the verdict, why) lands in records/target/twin_cards/<id>.png.

THE CRITIC LOOP: critic_loop(make, critic, twin): the numbers go first and a RED piece never meets the critic;
one pairwise question a pass from a fixed bank (never a 1-to-10); cap three; keeps the best by the rulers and
reverts a worse retry. The critic is whatever looks (a chat reading the two crops); the loop is the machine.

## MEASURED, BOTH WAYS

- His tiles against each other: 1 of 80 seeded ground and road pairs RED (40 random pairs per family before
  the per-number fix: road 9 of 40 RED, all on the dark-line share, which differs more than 3x between two of
  his own road tiles; so each painter number reads its own pack spread).
- A pack piece against itself: GREEN, SSIM 1.0.
- RED: the 10/10 cook's flat six-step ramp (PATTERN 6.2x the line, colours per 1,000 at 0.0x, block 8),
  a 1.5x nearest upscale (grid 3, fractional), noise (PATTERN past twice).
- His YES pieces: the robot GREEN and the truck AMBER against a car; the man, fox and redone wolf GREEN or
  AMBER once the style guide's field 8 is read (a rendered thing draws no outline and no interior lines, so
  its dark-line share against a pack piece is a decision, not a gap; read from the guide file, not typed).
- DIRECTION's round five: the finished robot GREEN in all eight facings against its car twin.
- Under three seconds a piece: 0.04 s measured.

## WHAT IT FOUND IN THE REGISTRY (reported, never held: all 644 rows predate the gate)

- COOK THREE's poacher and marksman through the rig read RED against their twin, which is the OLD FLAT
  SHEET they replace (records/cook3/enemy_tiers_repainted.png), not a pack piece: colours per 1,000 at 10
  to 14x the old flat art. That is the point of them, so a twin outside reference/art_bank is a 'before',
  not a pack twin, and the gate holds pack twins only.
- 4 UI rows name a pack twin as a list of several pieces in one string; the bank cannot resolve them.
  From this gate a new row names ONE twin the bank holds ('pack:10. Abandoned cars#0').
- 'pack:9. Abandoned cards#0' resolves: the pack's own name carries the typo.

## NOT DONE, SAID

- LOOK (DINOv2): the licence is read (Apache-2.0, facebookresearch/dinov2 LICENSE and MODEL_CARD.md,
  10/18). The weights did not reach this box: huggingface.co and dl.fbaipublicfiles.com answer 403 through
  the container's proxy. The code path is written (onnxruntime 1.29 is installed) and prints UNMEASURED
  with the path it looks for. Next: a workflow on the free runner exports and caches the ONNX, the same
  way the Aseprite build is cached; PATTERN stands in as the third unrelated ruler until then.
- The critic loop is a function the cooks call; no cook calls it yet.
