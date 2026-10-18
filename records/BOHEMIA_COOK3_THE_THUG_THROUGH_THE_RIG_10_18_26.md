# THE THUG THROUGH THE RIG (COOK THREE, [the tiers through the rig] round 1, 10/18/26)

Rule 115(a)(c): the people are MODELLED at the source and rendered through DIRECTION's master rig; the enemy tiers are
this lane's, one tier a round, thug first. His NO that started it: 'a trenchcoat and there's no trenchcoat action' (the
Reds loop's coat was paint on a body, not a shape). Cook only (rule 100): nothing in slices/, engine/ or the demo.

## What was made
- tools/bohemia_cook3_the_tiers_through_the_rig.py: builds a glTF of a tier from the rig's man
  (reference/models/khronos/CesiumMan.glb, the body DIRECTION's rig renders) and draws its sheet. Every garment is
  GEOMETRY skinned to the man's own bones: the body's faces in the garment's region are copied WITH their bone weights,
  pushed out along the normal by the garment's thickness, subdivided, grooved and hemmed. The cloth deforms exactly as
  the body under it does, so it never clips on the walk and it reads from all eight facings.
- THE THUG (engine/bohemia_cook3_tier_paint.json THUG: padded, quilt, chest): a quilted gambeson to mid-thigh with half
  sleeves (2.6 cm of padding at the chest flaring to 5 cm at the skirt; channels 7.5 cm apart pressed 13 mm in,
  vertical round the torso, rings down the sleeves, a seam at the waist), a wide leather belt, a knit cap with a folded
  brim, work trousers, boots, eye sockets, and a length of rusted pipe with two fittings in his right fist, every
  vertex on the hand bone so it swings with the arm. Head 1.2x wide, 1.05x tall (the rig page's 5.4-head
  recommendation, held back because the rig already stretches height 1.41).
- records/cook3/rig/thug.glb (the model, 3 MB) and thug.json (meshes, materials as rendered).
- Rendered: tools/bohemia_direction_master_rig.py ... --real-height 1.72 --family none --wear 0.6 --still pass
  --clip Anim_0:6 -> records/target/cook3/rig/thug/ (eight stills, the walk in eight at six keys, rig.json).
- Sheet: records/target/cook3/COOK3_THE_THUG_THROUGH_THE_RIG.png, beside the game's own flat thug as last painted
  (records/cook3/enemy_tiers_repainted.png, row AFTER), 1:1 and 4x. Caption names 57 px a metre, the palette file
  and the one light (rule 114c).
- VOTE: cook3-the-thug-through-the-rig-10-18, a candidate (rule 108: nothing is final before the moodboard).

## The cycles (each one knob, read off the render)
1. Cap from z 1.40 at a head grown 1.3x: the cap swallowed the face. The pipe held forward read as a cane.
   Card 2 of 8 out (colours 1,811, span 98).
2. Cap measured from the scaled head's top; eye sockets as a material on the body's own faces; the pipe carried low
   along the forearm; skirt to z 0.47; grooves deeper. A face appears. The head read as a tall box (1.3 x the rig's
   1.41 height stretch). Span 87.
3. Head widened, not lengthened; the padding warmed (the cool padded 110,104,92 read green under the rig's grey sky
   fill; now 124,106,82). The quilting reads as stitched padding from every facing. Span 103.
4. Head 1.2x; cap darker. Card 2 of 8 out: colours 1,743 against the tile band's 2,330 (the rig page measured it: a
   sprite cannot hold a tile's count; density is the row), value span 105 against 118. Six rows OK, the craft rows OK
   (one pixel size, light from above at 260 degrees, no banding).

## Findings (routed; not this lane's files)
- TO DIRECTION (the master rig): the source pass's up-face dust (1.1 x wear on every material) bleaches a dark accent on
  a head to grey: the thug's oxblood cap reads as dust. The accent above the waist (DIRECTION's own rule for the
  thirteen) needs a per-material wear weight in the rig, e.g. a custom property `bohemia_wear` on the material that
  scales the dust term. This lane did not edit the rig.
- TO DIRECTION / CHARACTER (the body): the head is the test body's head mesh, a box; scaling it makes a bigger box. A
  person model with a skull, a jaw and hair geometry is what fixes it (the rig page, section 2). Every tier built from
  this tool inherits the head until that body exists; the tool takes any skinned glTF body with the same joint names.
- The 'passing pose' still on this body lands mid-stride on the S facing (CesiumMan's walk has no feet-together frame
  narrower than the stride); an idle clip on the body would give the standing still the sheets want.

## Next (one tier a round)
POACHER (leather: a long leather coat as a real coat, split tail, the 'trenchcoat action' answered with geometry that
swings on the leg bones), then MARKSMAN, RAIDER (mail as modelled rings or rows), LEADER (plate lames, gold trim),
MARAUDER (plate with spikes). Each as a new entry in TIERS in the same tool.

REFERENCE CHECK: the twin is the game's own thug as last painted; DIRECTION's rendered man; the card of numbers
through skills/bohemia-pixel-art/scripts/check.py; analog horror AH-01. No reference game.
