# WHAT THE MASTER RIG NEEDS FOR A PERSON, IN METRES, FROM THE 112 RIG (COOK THREE, 10/17/26)

Rule 108 ROUND EIGHT (b) (one camera, real metres, the model turns), ROUND TWELVE (the loop), rule 87 (the people's look
is this lane's), rule 100 (cook only; nothing here is read by the game). The coordinator's wave of 10/11 asked this
lane for "a page on what the rig needs for a person in real metres from the 112 rig". DIRECTION's round two
(564e1b1) has since rendered a 1.72 m mannequin through the rig, so this page is written against a rig that exists,
and every number was read off the live alpha's own rig data (BAKED.skeleton, BOH_AGE, DIAL_NAMES, CLIPS, the garment
catalogue) or off DIRECTION's rig.json, never guessed. CHARACTER's own page of the body in metres
(records/BOHEMIA_THE_BODY_IN_METERS_10_13_26.md) is the base; this page adds the bones, the slots, the dials, the ages,
the clips and the materials a MODEL has to carry, and what the loop on the rendered man (looks 13 to 40,
records/cook3/loop/REDS_LOOP_LOG.md) found the render has to come out with.

## 1. THE RULER (settled, not this lane's to move)
- 57 px a metre. 98 painted px = 1.72 m (CHARACTER 10/13; DIRECTION's rig.json carries the same ppm).
- The person lives in the 112 box on every surface (THE GROUND MAY ZOOM, THE PERSON MAY NOT).
- The camera is orthographic, tilted 45, never turned; the model is stretched 1/cos(45) = 1.414 in Z before the render
  so a standing thing draws full height over a ground seen from above (DIRECTION round two, finding 2). THE MODEL IS
  BUILT IN TRUE METRES; the rig does the cheat.
- A head for the portrait: 0.24 m at 400 px a metre = 96 px, tilt 80, S / SE / SW, the SAME model file (ONE ID, ONE
  WHOLE PERSON).

## 2. THE LIVE BODY'S PROPORTIONS, BONE BY BONE (BAKED.skeleton.S, authored on a 56 grid, RIG2X doubles it to 112)
| bone | 56-grid | 112 px | metres at 57 px/m | a real 1.72 m man | the rig's cheat |
|---|---|---|---|---|---|
| head (headTop y7 to neck y16) | 9 | 18 | 0.32 | 0.23 | 1.4x: the face must read at 98 px and at 28 px |
| shoulder width (shR x21 to shL x34) | 13 | 26 | 0.46 | 0.39 to 0.41 | a little wide, the coat makes it 39 px painted (0.68 m) |
| upper arm (sh y18 to el y26) | 8 | 16 | 0.28 | 0.30 | true |
| forearm + hand (el y26 to hand y34) | 8 | 16 | 0.28 | 0.26 + 0.19 | the hand is a stamp, not a bone |
| torso (neck y16 to waist y31) | 15 | 30 | 0.53 | 0.52 | true |
| hip width (waA x25 to waB x31) | 6 | 12 | 0.21 | 0.28 to 0.32 | narrow: the column reads as a column |
| thigh (wa y31 to kn y41) | 10 | 20 | 0.35 | 0.45 | short |
| shin + foot (kn y41 to foot y51) | 10 | 20 | 0.35 | 0.42 + 0.07 | short |
| stance (footA x25 to footB x31) | 6 | 12 | 0.21 | 0.2 to 0.3 | true |
| HEIGHT (headTop y7 to foot y51, with the foot stamp) | 44 + 5 | 98 | 1.72 | 1.72 | the ruler |

READ IT AS ONE LINE: the live man is 5.4 HEADS TALL (98 / 18), not a real 7.5; the head is 1.4x and the legs are 0.8x
of a real man, and that is the pixel-art cheat every person pack makes so the face and the walk read at sprite size.
THE MODEL FOR THE RIG SHOULD KEEP THESE PROPORTIONS, in metres: a 1.72 m figure with a 0.32 m head, 0.70 m from waist
to sole, 0.46 m across the shoulders. A true-proportion man (CesiumMan is one) renders a 13 px head at this ruler,
and 13 px is below the 18 px the tiers are told apart at and below the face the portrait law wants on the body
(EVERYBODY HAS A FACE). DIRECTION decides; this lane's measured recommendation is the 5.4-head figure.

## 3. THE SKELETON THE RIG HAS TO DRIVE
15 joints in the live rig: headTop, neck, shL, shR, elL, elR, handL, handR, waA (hip L), waC (waist), waB (hip R), knA,
knB, footA, footB. 12 skinned part ids: head, torso, (parts 3 to 4 the neck and the belly band), arms 5 and 6, hands 7
and 8, thighs 9 and 10, shins 11 and 12 (the alpha's own comments: "part ids 5 and 6: THE ARMS", "9 and 10 are thigh
and ..."). A glTF humanoid armature maps onto it one to one with the standard names: head, neck, spine, shoulder.L/R,
upper_arm.L/R, forearm.L/R, hand.L/R, hips, thigh.L/R, shin.L/R, foot.L/R. Nothing more is needed to reproduce every
pose the game draws; a finger bone is wasted at 57 px a metre.
- A REST POSE. DIRECTION's finding: "the still is the clip's first frame; a rest pose needs a model that has one". The
  live rig's idle IS its rest (clip 'idle', phase 0.25, the frame every sheet is cut from). The model carries an
  explicit A-pose rest and an 'idle' clip.
- THE DIALS AS BONE SCALES, NEVER MESH SCALES: DIAL_NAMES = height, belly, arms, shoulders, armLength, hips. The live
  rig rides height on the bone lengths (the WIDTH LAW: taller at unchanged width) and reshapes belly and arms on the
  rest pixels before binding. On a model: height = leg and spine bone length; shoulders = shoulder bone length;
  armLength = upper_arm + forearm length; belly and hips = a blend shape on the torso mesh. The Reds' own dials, as
  the catalogue carries them: height +0.75, belly -0.25, arms +0.10, shoulders +0.25, hips -0.10 (the tallest,
  narrowest column on the street).
- THE AGES (BOH_AGE.STAGES): child h 0.77 (limb 0.78, shoulders -0.32), teen 0.90, young adult 0.97, adult 1.00,
  elder = the adult's height with a STOOP of 0.20 at one bend point above the hips (Paolo 9/21: "the old person looks
  like shit"; the spine compresses, the shoulders do not narrow). THE HEAD DOES NOT SCALE WITH AGE: a child is a
  0.77 body under an adult head (that asymmetry is why a child reads as a child). On the model: one armature, the
  bone scales per stage, the head bone at 1.0 in every stage.

## 4. THE CLIPS, ON THE BEAT (120 BPM, three drawn keys a beat, nothing between keys is drawn)
The live rig has 68 clips (CLIPS in the alpha). The rig needs them in this order, each a whole number of beats:
1. idle 4 beats = 12 keys; walk 2 beats = 6 keys (DIRECTION's rig already renders these two shapes).
2. THE FIGHT'S TEN: pistol, two-hand, deadeye (the scope), lean (cover), sneak, brace, dodge, stumble (the hit),
   throw, kick / shove. The fight is under a third of playtime but it is the surface he plays first.
3. THE STREET'S: run, tired-walk, wander, sit-ground, sit-chair, carry, pickup, talk, nod, point, smoke, eat, drink,
   dig, push, search, sleep.
4. The rest of the 68 as the settlement screens ask for them.
THE ENVELOPE LAW holds on the model's own curves: no joint turns more than 120 degrees between two drawn keys, so a
punch or a kick that snaps in a sixth of a beat is authored as two keys, not one.

## 5. THE GARMENTS AS SEPARATE MESHES, BY CHARACTER'S SLOTS
The thirteen looks dress from a catalogue of 374 pieces in ten layers: base 80, outer 74, legs 45, hair 45, feet 40,
gear 28, head 21, back 18, face 14, neck 9 (counted off layer:'...' in the alpha). The Reds wear hair DRY TAPER, base
SIGNAL RED SHIRT, outer BRICK SPLIT-TAIL DUSTER, legs BRICK WIDE TROUSER, feet BRICK STACK BOOT. The model carries
EACH SLOT AS ITS OWN MESH UNDER ITS OWN MATERIAL, because:
- COLOUR IS TERRITORY: the faction's accent rides ONE garment above the waist (DIRECTION's pass, this lane's paint
  file); a remap that cannot find the coat without the skin cannot do its job (this lane's 10/11 record asked the
  pack buy for exactly this, and the model route gives it for free).
- the silhouette is CHARACTER's: a duster that falls to mid-thigh, a hood up or down, the wide trouser; each is a mesh
  with its length in metres (the duster: neck to 0.62 of the height = 1.07 m long; the loop's coat band).
- HAIR AT FOUR TIMES THE PIXELS (8/25 law) and THE PORTRAIT WEARS THE HAIRCUT THE BODY IS WEARING: the hair is a mesh
  that renders in the 96 px head crop at 400 px a metre, so one hair asset serves the body and the face.
- gear (28 pieces: the bag, the holster, the rifle sling) hangs off the spine and hip bones.

## 6. THE MATERIALS, AND WHAT THE LOOP SAYS THE RENDER MUST COME OUT WITH
This lane's paint files (engine/bohemia_cook3_runway_paint.json, engine/bohemia_cook3_tier_paint.json; draft, unread
by the game) are the material table: a runway palette (black, bone, concrete, oxblood), one territory accent per
faction, vibrance down, materials readable (wool, leather, nylon, plate; padded, leather, mail, plate for the tiers).
On the model these are albedo + roughness per slot mesh: wool rough 0.9, leather 0.5, nylon 0.3, plate 0.2. The loop
on the rendered man (looks 13 to 40) measured three things the RENDER has to deliver, not the paint after it:
1. RANGE. The mannequin's shading came out compressed (its shade side at 0.6 of its white, 5th to 95th percentile
   0.40 to 0.99 of 255) and every look until the read was stretched was one flat value. The sun and the ambient on
   the rig should put a white cloth's shade side near 0.35 of its lit side; a matte white proves it at a glance.
2. SURFACE. A clean render has no cloth: the loop had to lay his pack tile's grain over the coat to reach DETAIL. The
   packs' grain is a light-dark step every 1.6 to 2.2 px, which at 57 px a metre is a weave of 2.8 to 3.9 cm. A
   fabric texture on the model with its detail at that period gives the grain in the render, where it belongs.
3. VALUE. A dark coat (Rick Owens oxblood, the bar) tops out at 80 of 255 in its brightest 5%; the value span the
   card wants (118) is reached only through the skin, the bone highlights and the light garments on the other
   twelve looks, never through a dark one. A dark look is a choice; its span is read against the family's spread.
And a measurement that moves a row: the card's 2,330 colours is a 96 x 96 tile's number. A person sprite has about
1,660 opaque pixels and can never hold it. His density is 0.81 colours a pixel; the bare render reached 0.70, this
lane's paint 0.33 at look 25 (a one-channel read caps it). THE TWIN GATE SHOULD READ A SPRITE BY DENSITY.

## 7. WHAT THIS LANE DOES WITH THE RENDER, UNTIL THE MODEL CARRIES ITS OWN MATERIALS
tools/bohemia_cook3_the_loop_on_the_rigs_man.py: strips the mannequin's decal, reads the render's shading stretched
between its own dark and white, maps it through the Reds materials (an oxblood base a third of the old brick's
value, the shade a multiply toward the warm shadow, the lit side a blend toward bone, lesson 4), lays his tile's weave
in place, softens the ring. Every knob is saved beside every look. When a model with slot meshes arrives, the same
table drives the materials and this tool retires.

## 8. WHAT THE RIG DOES NOT NEED FROM THE PEOPLE LANES
A hand-drawn facing (rule 107: the model turns), a mirrored half, a palette snap for people (no pack palette exists; the
runway palette is the table above), a face (PORTRAIT's: a model WITH a face, eyes not all white, 'less of a frog').

## TAB
NOT IN A TAB YET. A page for DIRECTION and CHARACTER building the person model; the loop's sheet is in the VOTE tab as a
placeholder (cook3-the-reds-loop-on-the-rigs-man-10-17).
