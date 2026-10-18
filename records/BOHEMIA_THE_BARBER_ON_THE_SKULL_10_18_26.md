# THE BARBER ON THE SKULL (CHARACTER, [the barber on the skull], 10/18/26)

From [the walk of every look]'s NEXT (rule 115c: the character models remade through the rig; rule 115h, his FIRST STAR:
the face from the same model is every face's method). His 10/18 question on the starred face, 'we can customise that
shit?', is the reason this row is first: the barber (rule 37i, Paolo 9/27: customisation at the barber in the
settlement) could not dress a rig body, because the fourteen models each wore one cap of lifted skin and the barber's
bank did not exist on the model. Cook only (rule 100): nothing in slices/ outside slices/vote, nothing in engine/ or the
demo; the rig unedited; the old sprites stay until a replacement passes.

## HOW BATTLE BROTHERS DID IT (rule 41: the first answer is the library)
The library's ten volumes hold no appearance chapter, and PORTRAIT's homework (records/BOHEMIA_HEAD_AND_THE_GEAR_9_28_26.md,
section FOUR) already settled why: a Battle Brothers recruit's portrait is a fixed painted bust per background, there is
no barber and no hairstyle list the player touches. On the battlefield the game's own scripts build a man from stacked
layers (body, head, hair, beard, helmet), the hair one layer picked from a list per background and tinted from a short
colour list. That is the structure we keep: THE CUT IS ITS OWN PIECE ON THE HEAD, separate from the skull and the face,
so any cut goes on any person. Our swag over it: the player picks it at the barber, it is sculpted, and the same piece is
worn at 1:1 in the walk and at 128 in the portrait.

## What was made
- tools/bohemia_character_the_barber_on_the_skull.py (new): ONE BODY, ONE SKULL, THREE CUTS.
  * The body: this lane's own tool, LOOKS['Body'] (the man under every look) in the bank's WRAPPED BOOTS instead of the
    white sneakers, the barber's mannequin (cycle 7 says why), on the model and on the flat twin alike.
  * The head: PORTRAIT's starred head (tools/bohemia_portrait_the_head_from_the_model.py, imported and never edited: a
    PEOPLE entry with a bare scalp is added in memory, its build() runs, and the cut is added to the live scene after).
    The face, its seven shape keys, its eyes and lids are PORTRAIT's, untouched, on the same head bone.
  * The cuts, geometry on the skull bone, read off the flat cut's own dials in the alpha's bank (read, never edited):
    - TEMPLE TAPER (vol 0, side 0.40, front 0.16, fade 4): a short crown, a forward lift with four tufts at the front, a
      line-up with the temple corners cut, the shell thinning to nothing at the taper line; and THE FADE as its own
      stubble skin, the zone's faces cut to 2 mm and each taking one of three bands (75, 50, 25 per cent hair) by a
      dithered depth, so the portrait sees clipper stubble and 1:1 sees one gradient.
    - COIL CROWN (vol 2, side 0.72, front 0.24, flare 0.20): a rounded mass, 44 mm on the crown with the flat cut's peak,
      the sides flared low over the ears to the jaw, built of coils on random seeds at three sizes (34 mm clumps that
      scallop the outline at 1:1, 16 and 8 mm coils inside them).
    - LAYERED FALL (vol 1, side 1.42, front 0.26, flare 0.12): a centre-parted cap whose hairline is an arch falling to
      the temples, combed out from the part; the fall's mass ONE CURTAIN cut to a pattern the way this lane's coat
      skirts are (columns round the back that follow the skull, hang, rest on the shoulders, end in a hem of eleven
      rounded points, broad waves down it); over it THE LAYER, seven locks rooted at the crown, shorter, tips flipped out.
  * Colours: steps of the style palette nearest the flat cut's ramp (cloth_black 0 for H_BLK, clay_mustard 2 for H_SND);
    the skin skin_deep 3, the body's own; strand normals on the dark cuts (this lane's 8b), z held under 0.3 on the taper
    and 0.5 on the coils (at 1:1 a coil reads only where the sun catches it).
- tools/bohemia_character_the_barber_on_the_skull_flat.js (new): THE TWIN, the game's own flat body (in the same wrapped
  boots) wearing each cut, read live off buildFrame in all eight facings at the rig's six phases
  (records/target/character/barber_flat/, 144 frames; the other eight canon cuts render with CUTS=... in a minute).
- Rendered through DIRECTION's master rig, unedited: `--real-height <real_height_for_rig> --family none --clip Stand:1
  --clip Anim_0:6 --portrait 128` (the man stays 1.72 m whatever his hair adds: real_height_for_rig = 1.72 x model top /
  1.5283). Each cut: 8 stills, 48 walk frames (eight facings, six keys, two beats at 120), 3 portraits.
- slices/vote/CHARACTER_THE_BARBER_ON_THE_SKULL.html + .png + _TABLE.js: each cut walking SE beside the flat cut at 1:1
  with its portrait; tap a cut for its eight facings, the model over the game's flat cut, facing for facing.
- records/target/character/CHARACTER_THE_BARBER_ON_THE_SKULL.png: the still sheet.

## The cycles (so the next cut skips them)
1. Dark hair rendered mid-grey (a black crown at a mean of 47 against the flat cut's mid of 32): cloth_black 0 at the
   source and strand normals held under z 0.3 instead of 8b's 0.5 brought it to 40 (the rig's dust is on what faces up;
   the real fix is DIRECTION's per-material wear weight, routed for the fourth time).
2. The coil crown's 26 mm clumps left a smooth grey dome at 1:1: a pixel there is 15 mm of clay, so the clumps that break
   the outline are 34 mm with 11 mm of relief.
3. A seam down the back of every head: PORTRAIT's head mesh does not store the skull first and the ears after (measured:
   the ears' vertices run from index 0 to 13,197), so an index test took 284 skull faces down the back midline for ears
   and cut them out of every shell. The ears are now found as the mesh's two small islands. PORTRAIT's own paint loop
   makes the same test: that is the line down the back of the crew's heads (routed).
4. The taper's fade banded on the skull's 6 to 8 mm faces read as a blocky dirty stripe at 128: its own 2 mm stubble skin.
5. The fall as thirty locks read as straw; as fifteen as stripes (a dark slit at every overlap, at 15 mm a pixel); as
   ribbons rooted at the ear, as pigtails. One curtain for the mass and seven crown-rooted locks for the layer read as one
   mass with layers, at both sizes.
6. A level hairline on the fall read as bangs: an arch from the part.
7. THE LIGHT ROW READ THE SHOES. NOT VIBE CODED's cull (rule 114b: a sheet that fails the first five never reaches the
   tab) held 3 of my 24 stills on D3, the guide's light row (top half minus bottom half): lit from below. Measured every
   facing myself (the gate prints only its first 12 problems): the coil crown failed 7 of 8, the taper 2 of 8, and the
   OLD cap-haired body already failed W (-4.1). Lighter hair did not clear it (the coils at the flat ramp's light step
   still -7 and -11 side-on); taking the strand normals off did (worst -1.3) but greyed a black crown to 84. Then the
   decisive number: setting only the white sneakers' pixels dark moved the row +16 to +23 values on every side-on
   facing (bare body E +0.9 -> +17.7, W -4.1 -> +18.1; taper W -12.3 -> +11.2; coils W -18.4 -> +4.0). A colour, not a
   light, the same finding as last round (records/BOHEMIA_CHARACTER_LIT_FROM_BELOW_IS_A_COLOUR_NOT_A_LIGHT_10_18_26.md).
   The barber's sheet shows hair, so its mannequin and its twin wear the bank's WRAPPED BOOTS: every facing of every cut
   passes with the black hair kept black (worst +2.8; crowns 43 and 50). The ruler itself is DIRECTION's and PLUMBER's;
   routed with these numbers: any look in white shoes and a dark top fails it side-on whatever the light does.

## THE CHECKS
- The rig's card (skills/bohemia-pixel-art through the rig, class person), S still: TEMPLE TAPER 1 of 8 out, COIL CROWN
  1 of 8 out (both the value span, 117 and 113 against 118: the white sneakers had been the brightest pixel), LAYERED
  FALL 0 of 8; no breaks from the guide on any (the guide's own wear, no --set); the rig refuses at 3 of 8.
- The guide's light row on all 24 stills (tools/bohemia_not_vibe_coded.py g3): worst +2.8 (the coils, W); the taper
  +6.2 to +14.8, the coils +2.8 to +11.0, the fall +37.2 to +72.6.
- The black crowns at 1:1: a mean of 43 (taper) and 50 (coils) over the top 12 rows, against the flat cut's ramp of 16,
  32, 54; the sand crown 122 against the flat's 96, 150, 196.
- The man does not change size with his hair: every cut renders at real_height_for_rig = 1.72 x model top / 1.5283, so
  the body is 1.72 m under a 4 cm coil crown as under a taper.
- The page, served and opened at a 390 px phone width at 3x: 25 canvases, all 25 drawing, no page errors, no sideways
  scroll.
- Gates: CHARACTER IN THE VOTE TAB green; THE VOTE TAB passes on this card (its one red leg is four other lanes' whys:
  two DYNASTY, one COOK FOUR, one COOK THREE); NOT VIBE CODED N3 passes on this card's 24 sprites (its red is other
  lanes' cards); REFERENCE CHECK 490/0; RIG NO-DRIFT 23/0; THE TEXTURE SET 8/0; STYLE GUIDE red only on PORTRAIT's 13
  crew renders (their --wear 0.45 is a break), none of this lane's; REUSE-FIRST red only on other lanes' files.

## For the lanes
- PORTRAIT: the ear test in tools/bohemia_portrait_the_head_from_the_model.py (`f.vertices[0] >= head_verts`) takes 284
  skull faces down the back midline for ears; on the crew they stay skin and are cut out of the hair shells, which is the
  line down the back of every crew head. The ears are the mesh's two islands of 262 vertices (this tool's EAR set). The
  three cuts here are pieces named barber_* on the head bone, ready for the portrait to wear.
- PORTRAIT, also: the 13 crew renders break the guide on wear (--wear 0.45), so STYLE GUIDE holds all 13 red; this
  lane renders at the guide's wear and is clean.
- DIRECTION and PLUMBER: the guide's light row reads white shoes under a dark top as a light from below (cycle 7's
  numbers: +16 to +23 values from the shoes alone, side-on); and the dust on up-facing dark hair (fourth lane to hit it;
  the per-material wear weight).
- RUN (rule 115g): any of the three cuts walks in eight on disk the moment its card passes:
  records/target/character/barber/<cut>/rig_Anim_0_<F>_kNN.png.

## NEXT
The other eight canon cuts (SHAG, HEAVY FRINGE, CURTAIN CUT, DRY TAPER, DEEP TAPER, ROPE LOCKS, SHORT ROPES, DUST WEAVE;
their flat twins are already on disk); then the face maker's dials onto the skull when PORTRAIT hands its shape controls
over (the coordinator's note, sweep ar).

REFERENCE CHECK: the twin is the game's own flat body wearing the same cut, facing for facing, at 1:1 (buildFrame); the
starred head; the flat cuts' own dials; analog horror AH-01. No reference game (Battle Brothers named for HOW a system
works only, rule 41).
