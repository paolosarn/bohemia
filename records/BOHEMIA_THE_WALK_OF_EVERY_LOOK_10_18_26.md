# THE WALK OF EVERY LOOK (CHARACTER, [the walk of every look], 10/18/26)

From [the print and the hands] (rule 115c, 115g: the demo wears the rig, the party's people first). Last round only four
of the fourteen models (Reds, Anarchists, Trades, Cartel) were rendered walking; RUN's cut needs a walk for whichever look
passes VOTE first. Cook only (rule 100): nothing in slices/ outside slices/vote, nothing in engine/ or the demo; the rig
unedited; the old sprites stay until a replacement passes.

## What was made
- The ten missing walks: Body, Blues, Caravans, Church, Colorful, Homeless, Mob, Network, Remnants, Volunteers, rendered
  through DIRECTION's master rig unedited, the same call the four used:
  `tools/bohemia_direction_master_rig.py records/character/rig/<look>.glb records/target/character/rig/<look>
  --real-height <real_height_for_rig> --family none --clip Stand:1 --clip Anim_0:6`
  (bpy 4.2.0 in a python3.11 venv, CPU, about 40 s a look). Every look now carries 8 stills + 48 walk frames
  (rig_Anim_0_<F>_k00..05.png: eight facings, six drawn keys = two beats at 120, three a beat) + rig.json + calibration.json,
  the same 58 files the four had. The rig's scratch passes (raw_, id_, rigid_, shadow_, rig_Stand_) are not kept, as before.
- The models were rebuilt first (`tools/bohemia_character_the_thirteen_through_the_rig.py build ALL`): the .glb files are
  gitignored, and the rebuild wrote the committed <look>.json byte for byte, so the walk is the same model he saw last round.
- tools/bohemia_character_the_walk_of_every_look_flat.js (new): the game's own flat sprite of each look walking SE, read
  live off the alpha's buildFrame at the SAME six phases the rig draws ((k + 0.5) / 6), read-only (COOK THREE's driver):
  records/target/character/walk_flat/<look>_SE_k0N.png, 84 frames. This is the twin.
- tools/bohemia_character_the_walk_of_every_look.py (new): lays out what the rig rendered. The atlas the VOTE page plays
  (slices/vote/CHARACTER_THE_WALK_OF_EVERY_LOOK.png, 1692 x 5712, 14 looks x 8 facings + 14 flat rows, six keys a row,
  folded into three columns because a 17,136 px tall image is past what some phone browsers decode) and its table; the
  still sheet records/target/character/CHARACTER_THE_WALK_OF_EVERY_LOOK.png (the flat walk's six keys beside the model's six
  at 1:1, SE, then every look's eight facings at the passing key).
- slices/vote/CHARACTER_THE_WALK_OF_EVERY_LOOK.html (new, ANIMATION's beast-in-eight pattern): every look walking on the
  beat (167 ms a key) beside the game's flat walk, one art pixel to one phone pixel; tap a name for its eight facings.
- VOTE: character-the-walk-of-every-look-10-18, kind animation, a candidate (rule 108).

## THE CHECKS
- The stills did not move: the re-rendered stills, each cut to its own content, differ from last round's in 12 to 27 pixels
  by at most 8 values (Cycles' CPU noise). Their PNGs are wider only because one crop box now holds the walk too (the rig cuts
  every picture of one model with one box, so the walk never jitters), exactly as the four walkers' stills already were.
- Body's person card: 0 of 8 out, as last round.
- The page, served and opened at a 390 px phone width at 3x: 36 canvases, all 36 drawing, no page errors, no sideways scroll.
- A guess I made by eye and dropped once measured: the model's walk LOOKED like a longer stride than the flat walk. The
  feet's spread over the bottom 15 rows is 35 to 52 px on the model and 44 to 51 on the flat sprite: the same stride. What
  reads as longer at SE is the facing, which the model draws as a real three-quarter side and the formula draws close to
  front-on.
- Gates: CHARACTER IN THE VOTE TAB 9/0; THE TEXTURE SET 8/0; REFERENCE CHECK 490/0; RIG NO-DRIFT 23/0; THE VOTE TAB passes
  on my item (its one red leg is two DYNASTY items with no 'you see it'); REUSE-FIRST, RIG CHECK and PAGES PUBLISH red only on
  other lanes' files and on the published-surface size, the same reds as before this round (pages measured with my change
  stashed).

## NEXT
The faces (PORTRAIT renders the HD face from this model, rule 115h: the face from the same model is every face's method);
RUN can take any look's walk the moment its card passes (all fourteen are on disk in eight); the barber's cuts as sculpted
hair on the skull.

REFERENCE CHECK: the twin is the game's own flat sprite walking today, key for key at 1:1 (buildFrame, SE); last round's
stills; the runway names; analog horror AH-01. No reference game.
