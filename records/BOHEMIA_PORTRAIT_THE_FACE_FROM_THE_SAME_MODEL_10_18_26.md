# THE FACE FROM THE SAME MODEL (PORTRAIT, [the face from the same model] round 1, 10/18/26)

Rule 115(c): the faces are rendered from the same model as the body (ONE ID, ONE WHOLE PERSON). This round ran on
Opus 5.5 (rule 116); the chat before it stopped mid-work and had committed nothing on this row. Opened by the coordinator
(rule 112), run to the end, no question. Cook only (rule 100): nothing in slices/, engine/ or the demo.

## The gap
COOK THREE's thug (17cc8b7) found it: 'the head is the test body's head mesh, a box; scaling it makes a bigger box. A
person model with a skull, a jaw and hair geometry is what fixes it.' The packs hold no faces (10/13 count, f3090598),
and no CC0 human head is reachable from this box, so the head is MODELLED here, as geometry, the way DIRECTION modelled
the oil drum and COOK THREE the gambeson. Nothing paints a pixel (rule 108a).

## What was made
- tools/bohemia_portrait_the_head_from_the_model.py (bpy 4.2): takes COOK THREE's thug glb (read, never written), cuts
  the box head off above the collar (z 1.165) with its cap, and puts a modelled head on the SAME head bone
  (Skeleton_neck_joint_2):
  - the skull: an ellipsoid 0.32 x 0.33 x 0.356 m (a clay head, big for the body), the jaw tapering 30 percent, the
    nape pulled in; a 128 x 100 sphere;
  - the features as measured forward pushes on the face only: brow ridge 14 mm, sockets 22 mm, a nose growing to a
    32 mm tip with nostril wings, cheekbones 10 mm and the hollow under them, philtrum, lips 10 and 11 mm, chin 14 mm;
  - the mouth line: the faces straddling it are the inside of the mouth (a dark material); closed, a line; on the jaw's
    turn they stretch into the open mouth and fold 18 mm back into the head;
  - eyeballs 33 mm, bone whites (never white, his 9/24), a big dark iris and a pupil; upper and lower lid shells;
  - ears; a neck as its own mesh (so the rig measures the head chin to crown: 0.402 m after the 1.72 m scale);
  - the thug's kit: a knit cap (the skull's skin lifted 12 mm, ribbed every 11 mm, a folded brim 24 mm with a crease,
    the oxblood above the waist), a buzz at the back and sides, stubble on the jaw;
  - shape keys A, E, O, M (the speak-along mouth: open 20 deg, wide, round, closed) and Angry, Sad, Surprised (brows,
    inner brows, pinch, mouth corners, jaw); the lids carry the same keys plus Blink.
- records/portrait/rig/thug_head.glb (8 MB) and thug_head.json.
- Rendered through DIRECTION's rig, unedited: --real-height 1.72 --family none --wear 0.6 --still pass --portrait 128
  and seven --expression -> records/target/portrait/rig/thug/ (eight body stills, three portraits S/SE/SW, seven
  expressions, rig.json, portrait.json). breaks: none.
- Sheet records/target/portrait/PORTRAIT_THE_FACE_FROM_THE_SAME_MODEL.png: the three portraits at 2x beside the game's
  own thug face (renderFace() at 64 px, the taste pairs' head), the seven shapes at 1:1, five at 2x, and the body's S
  still with the new head beside COOK THREE's box-head thug. Caption names the pixel size, palette and light (114c).
- VOTE: portrait-the-face-from-the-same-model-10-18, a PLACEHOLDER (rule 101/108: nothing final before the moodboard).

## The cycles
1. Preview: the face reads as a clay head; the mouth did not open: the jaw rotated UP into the face (sign). Stubble
   and buzz edges ran as straight lines across the cheek in profile.
2. Jaw sign flipped (the chin swings down and back), opening 13 -> 20 deg; the beard line rises from the cheek to the
   jaw's angle; the buzz behind the ear with a sideburn. Mouth reads open at 1:1.
3. Rig: --class portrait crashed the rig (below); re-run as a person. 160 x 120 sphere -> 128 x 100 (glb 17 -> 8 MB,
   morph normals off), same read.

## The card
Body S still (person under the guide): 1 of 8 out (value span 94 vs 118). Portrait set: 22,906 colours.

## Findings (routed; not this lane's files)
- TO DIRECTION (the rig): `--class portrait` raises KeyError 'output_floor' in guide_card (the guide's portrait class
  has no output_floor); the card is run on the BODY's S still, so the class there should stay the body's, and the
  portrait wants its own card leg.
- TO DIRECTION (the rig): the source pass's up-face dust blotches the skin (the forehead and cheeks read mottled) and
  greys the oxblood cap, the same finding as COOK THREE's: a per-material wear weight (a `bohemia_wear` custom
  property scaling the dust term) would let skin and accents stay clean. This lane did not edit the rig.
- TO COOK THREE: the head is a reusable piece: any tier glb can be passed through this tool (PEOPLE gets an entry);
  the head bone and the cut are the same on every body built from the rig's man.

## Next
The twenty taste pairs re-rendered from heads like this one (the six brigand tiers first, as COOK THREE remodels each
tier's body), each head's gear and hair as geometry; then the speak-along wired as frames for the talking portrait
when RUN takes rig-made people into the demo (rule 115g). Parked until the moodboard as before.

REFERENCE CHECK: the twin is the game's own thug face and COOK THREE's thug through the rig; the rig's card; AH-01.
No reference game.
