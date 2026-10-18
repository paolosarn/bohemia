# THE RAIDER THROUGH THE RIG (COOK THREE, [the tiers through the rig] round 4 of the tiers, 10/18/26)

Rule 115(a)(c)(h): the people are modelled at the source and rendered through DIRECTION's master rig, one tier a round.
Cook only (rule 100): nothing in slices/, engine/ or the demo. Opus 5.5 at Extra (rule 116), opened by the coordinator
(rule 112). The thug, the poacher and the marksman came before; the poacher's body was remade under the starred face.

## How Battle Brothers did it (rule 41) and where the tier comes from
records/target/bb/enemies.json, `brigand_raider`: a weapon (80 percent a one-hander: Arming Sword, Military Pick,
Scramasax, Boar Spear, Flail, Handaxe, Morning Star, Falchion, Shortsword), a Worn Mail Shirt or a Patched Mail Shirt
at double chance (else Padded Leather or a Rugged Surcoat), 85 percent a helmet (a Nasal Helmet with Rusty Mail, a
Padded Dented Nasal Helmet, a Nasal Helmet, a Rusty Mail Coif, a Headscarf), and 66 percent a shield (a Wooden Shield
or a Kite Shield). So the raider is the MAIL man with a nasal helmet and a round shield, and that is what he is here.
The tier paint file (engine/bohemia_cook3_tier_paint.json) says RAIDER = mail, chest and arms. DIRECTION's HOLD from
10/10 (records/BOHEMIA_THE_REVAMP_PASS_ROUND_THREE_10_10_26.md, the third ask): 'the mail is still a checker grid:
rows, a lit shoulder, a darker hem'. The twin is the game's own flat raider (records/cook3/enemy_tiers_repainted.png,
cell 3): grey striped mail, gold cuffs, dark trousers. The packs hold no people (10/11).

## The model (tools/bohemia_cook3_the_tiers_through_the_rig.py RAIDER, then --whole RAIDER)
- THE MAIL SHIRT: the body from the hip (z 0.62) to the neck (1.165) lifted 1.6 cm, elbow sleeves, subdivided three
  times so a row has eight vertices; the ROWS ARE GEOMETRY. Each row hangs like a shingle: pressed 12 mm in at its top,
  under the lip of the row above, standing out at its own lower lip, one row every 5 cm (3 px at the ruler). The face
  of a row tilts down and out, so it is darker; every lip is a hard lit edge over the shadowed top of the row below.
  Rows run round the body on the torso and round the arm on the sleeves, with a seam at the shoulder. Along each lip a
  ring every 2 cm, offset half a ring on alternate rows (riveted mail's brick), 15 percent of the depth: for the close
  portrait, under a pixel at 1x (DIRECTION's 'checker grid' was the thing to kill, so the rings stay below the row).
- THE LIT SHOULDER: nothing painted. The shoulder faces the sun, so it is the lightest mail on him.
- THE DARKER HEM, authored (DIRECTION 10/10: 'wear is authored', never a filter): below the hip the poacher coat's
  skirt of rings (46 rows of rings, 144 round), split front and back from 0.60 for riding, each half on its own thigh
  bone so it swings on the walk; the hem DAGGED where links tore out (teeth 6 cm wide, 2.6 cm deep), and the last
  5.5 cm of rows gone to rust (clay_rust 1), the cuffs too.
- THE COIF AND THE AVENTAIL: a hood of the same mail round PORTRAIT's modelled skull (its centre and radii read from
  PORTRAIT's own table, never edited), 1.4 cm off it, open for the face from the brow to the chin (the opening's edge
  laid on its ellipse), closed at the throat, and a short cape down over the shoulders that hugs the torso under it
  (a ring is never nearer the body than the shirt plus 2.2 cm). The hood on the head bone, the cape blending to the
  chest bone.
- THE NASAL HELMET: a pointed cap from a brow band to a point 6 cm over the hood, four raised ribs (front, back, the
  sides), and the nasal bar down over the nose, its back 7 mm clear of PORTRAIT's nose (face_push, read). Gone to rust.
- BRASS BRACERS on both forearms, a raised band at each end: the faction's gold (the tier paint's raider and leader
  share it; the twin wears gold cuffs).
- THE SHIELD, our skin on Battle Brothers' Wooden Shield: the end of a wooden cable drum, 52 cm, planks running along
  the forearm with their gaps pressed in, the arbor hole's steel plate standing out as the boss, the four drive holes;
  strapped on the left forearm, face turned out and a little forward, on the forearm bone.
- THE MACHETE, our skin on the Falchion: a flat blade 44 cm, the spine in line with the grip, a belly toward the tip, a
  clipped point, on the right hand bone.
- THE HEAD: PORTRAIT's modelled head (rule 115h: the face from the same model is every face's method), called through
  PORTRAIT's own tool (read, never edited) on its THUG row with the raider's colours (skin_light 2, a clay_rust 1
  beard), since PORTRAIT has no raider row yet; its row wins once it exists (HEADS in the tool).
- UNDER AND BELOW: a padded jack of undyed linen under the mail, showing on the forearms (tape_masking 2, the shield's
  wood step: one material); trousers in the runway black (cloth_black 1); boots (rubber 2).
- 8 materials on him: skin, eyes, mail and blade, rust, trousers, boots and grip, brass, linen and wood. The head's own
  are PORTRAIT's.

## The cycles (logged)
1. First render (mail tape_grey 2, rounded ridges 6 mm deep on 4.5 cm, helmet clay_rust 2, coif 1.8 cm off the skull):
   card 0 of 8 out, but WRONG BY EYE: the mail read as a pale sweater with no rows at 1x, the helmet bleached to a pink
   dome under the rig's paint fade and dust, and the face was gone. A close render (the lane's own eyes, not a card)
   showed why: the rounded ridges read as QUILTING, and the helmet's band stood 5 cm in front of the eyes at 4.6 cm above
   them, so from the 45 degree camera the rim covers the eyes exactly.
2. Rows as SHINGLES (12 mm in at the top of each row, out at its lip, 5 cm a row), the mail one step darker (tape_grey 1),
   rust one step darker (clay_rust 1), the coif 1.4 cm off the skull, the face opening up to the brow and its edge laid on
   its ellipse, the helmet's rim raised from 5 to 8.5 cm over the eye line: the face shows from 45 degrees. The close look
   showed the aventail standing off the shoulders as a flat ruff (flared to 0.245 m), and the hood's 12 mm rows as a stack
   of rubber rings. The aventail now hugs what is under it, the hood's rows 7 mm.
3. The cape had wrapped the bind pose's raised arms and left a flange standing out when they came down: the arms are out
   of what the cape clears. Rig: card 1 of 8 out, VALUE SPAN 113: all one dark mass.
4. The mail back to bright steel (tape_grey 2): with the shingle rows it reads as steel with lit lips, not a sweater;
   span 117 (one short).
5. A padded jack of undyed linen under the mail (tape_masking 2, the shield's wood step, one material), on the forearms:
   span 117.97, still short (it is p95 minus p5, area counts; the forearms are small in the S still). Then the trousers
   one step down the runway black (cloth_black 1): the dark end under the bright mail. SPAN 121, 0 OF 8 OUT.

## The card (S still, class person)
long side 133, colours 1,367 vs 648 (370 per 1,000 of 1,750 px), top 8 3.5%, value span 121, saturation 0.131 (the
vibrance down, his 9/23), light top minus bottom 8.5, edge -12.8, grain 1.39 px a run. 0 of 8 out under the style guide
(class person). Colours across the whole set 45,700; scale from the model 1.0813; the passing pose of Anim_0, frame 21.

## The sheet
records/target/cook3/COOK3_THE_RAIDER_THROUGH_THE_RIG.png: eight facings, the S and SE walk (6 keys = 2 beats at 120),
beside the game's flat raider at 1:1 and 4x. 57 px a metre (1.72 m = 98 px), one pixel size, block 1; palette
records/target/BOHEMIA_STYLE_PALETTE.json, every base colour a step of a role; one light, the rig's sun upper left.
VOTE: cook3-the-raider-through-the-rig-10-18.

## Findings
- FOR DIRECTION (the rig): a dark or warm accent on an up-facing surface is bleached by the paint fade and the dust
  (the fourth lane-round to hit it: the thug's cap, the marksman's cap, now the raider's helmet went from clay_rust 2 to a
  pink dome). A per-material dust weight, or the look bible's 'dust never paler than the base on a bright material'
  rule (10/18) extended to dark ones, would let a helmet keep its rust.
- FOR DIRECTION (the style guide, field 8): the value span is p95 minus p5 by AREA. A dark-armoured tier cannot reach it
  with one bright accent; the mail had to BE the bright area (cycle 4). Worth a line so the next lane does not darken
  the dark end first (the marksman's cycle 3 did, and lost span).
- FOR DIRECTION / EYES (a find, not a gate): a helmet's rim in front of the face hides the eyes from the 45 degree camera
  whenever it stands out from the brow by more than its height over the eye line. Every head gear on a person through
  the rig should clear that line: rim height over the eyes greater than how far the rim stands out.
- FOR PORTRAIT: the raider wears your head through your own tool on your THUG row with the raider's colours (HEADS in
  this lane's tool, skin_light 2, a clay_rust 1 beard); your own RAIDER row wins once it exists. The coif and helmet are
  this lane's, on the body, cut to your skull's numbers and your face_push, so your close portrait camera gets a mail
  hood round the face for free. records/cook3/rig/raider_body.glb is the body without your head.
- FOR PLUMBER: the models are big (raider.glb 15.9 MB, raider_body.glb 10.6 MB: the mail is subdivided three times so a
  5 cm row has eight vertices). Draco is not in this bpy build (the exporter logs it missing). Rule 106 stands; the
  numbers are here in case the repo's size becomes a pipe question.
- bpy 4.2 still segfaults on exit after writing its files (build, --whole); the outputs are whole.

## Next
The LEADER: plate as geometry (the tier paint's six lames and the belly), the gold trim; the head via PORTRAIT's tool.

REFERENCE CHECK: the compare law; the twin is the game's own raider; Battle Brothers' brigand raider for HOW (rule 41,
the campaign's enemies are its department); the card of numbers; no new reference game.
