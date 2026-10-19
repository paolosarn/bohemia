# COOK [the first guns off the rig] 10/19/26: THE GUNS HE STARTS WITH, MODELLED AT THE SOURCE, TWO OF EACH

QUARTERMASTER 10/19 | cooking: a pistol or a revolver | he owns: 40 tiles in 1 packs that match (37 approved, 3 never judged) | packs: 12. Weapons and supplies 40/37 | nearest: 12. Weapons and supplies#6 96x78 approved; 12. Weapons and supplies#9 96x71 approved; 12. Weapons and supplies#8 96x70 approved | verdict: COMPOSE BESIDE IT (his tile is the score; the model is the source, rule 115a) | index f0d6a050
QUARTERMASTER 10/19 | cooking: a shotgun | he owns: 40 tiles in 1 packs that match (37 approved, 3 never judged) | packs: 12. Weapons and supplies 40/37 | nearest: 12. Weapons and supplies#5 never judged; 12. Weapons and supplies#12 never judged; 12. Weapons and supplies#13 never judged | verdict: COMPOSE BESIDE IT (his tile is the score; the model is the source, rule 115a) | index f0d6a050
QUARTERMASTER 10/19 | cooking: a long gun (a rifle or carbine) | he owns: 113 tiles in 4 packs that match (37 approved, 76 never judged) | packs: 12. Weapons and supplies 40/37; 12. Weapons and armory 41/0; 16. Weapons and shields 16/0; 17. Cannons and weapons 16/0 | nearest: 17. Cannons and weapons#13 never judged | verdict: OWNS ZERO, BUY OR COMMISSION (no modern long gun in 294 packs: his gun packs hold pistols, a revolver, SMGs and sawn-offs; the nearest long gun is the never-judged flintlock blunderbuss; the model is the source, rule 115a) | index f0d6a050
QUARTERMASTER 10/19 | cooking: the armourer's gun rack | he owns: 57 tiles in 2 packs that match (0 approved, 57 never judged) | packs: 12. Weapons and armory 41/0; 17. Cannons and weapons 16/0 | nearest: 17. Cannons and weapons#15 never judged; 12. Weapons and armory#10 never judged | verdict: LOOKED AT THE UNJUDGED FIRST: his two racks are an armoury's (a flintlock and a dagger on a frame; spears, an axe and a shield); COMPOSE BESIDE IT (his racks are the score; the model is the source, rule 115a) | index f0d6a050
(read from the index by tools/bohemia_quartermaster_line.py through the sheet tool, never typed; the "never judged" on
#5, #12 and #13 is the quartermaster's own word: those three are in the approved bank's pack but not in its corpus)

WHY THIS ROW. Written by this lane from the jump list when [the empty terrains' cover] shipped (this session closed
that row's board line and handoff block first: its capped session had pushed everything but those). Rule 120(a), his
10/18: "I wanna start off with the guns too... the guns were supposed to be the main way this is gonna be solved", and
the coordinator's word this round: the guns he starts with need to look like the robot and the truck he fell for. What
the game shows for a gun TODAY, measured (slices/market_icons/SOURCES.txt, slices/bohemia_ui_materials.js itemIcon,
the fight's people sheets):
- the market and the roster show his pack tiles: the PISTOL is his pistol #6 (right), the SHOTGUN is his SMG #7, the
  RIFLE is his suppressed pistol #10. Two of the three gun lines wear another gun's picture.
- the bag draws each weapon as a code glyph on a 22-pixel grid.
- no hand in the fight holds a gun: the fight's people sheets carry no gun sprite (records/BOHEMIA_THE_SHOT_KICKS_10_9_26.md).
The game's gun lines are three (records/target/bb/weapon_lines.json: PISTOL on the dagger row, SHOTGUN on the handgonne,
RIFLE on the light crossbow) and rule 47(b) gives the guns to HIM, two or three options a class, nothing canon before
his pick. So: two options a line, six guns, one card asking A or B.

## HOW THE PACK DID IT (rule 100c), his gun and rack tiles on the same card the rig uses (check.py, family prop)

| twin | size | colours | value span | near-black on the edge | his own tile on the prop card |
|---|---|---|---|---|---|
| 12. Weapons and supplies#6 (his pistol, the market's PISTOL) | 96x78 | 2,799 | 138 | 100% | 2 of 8 out: top eight 14.4, grain 2.28 |
| 12. Weapons and supplies#9 (his second pistol) | 96x71 | 2,501 | 147 | 99% | 2 of 8 out: top eight 14.8, grain 2.29 |
| 12. Weapons and supplies#8 (his revolver) | 96x70 | 2,021 | 158 | 99% | 2 of 8 out: colours, top eight 15.2 |
| 12. Weapons and supplies#5 (his pistol-grip sawn-off) | 96x54 | 1,808 | 140 | 100% | 2 of 8 out: colours, top eight 11.4 |
| 12. Weapons and supplies#12 (his sawn-off double) | 96x70 | 2,196 | 132 | 100% | 1 of 8 out: colours |
| 12. Weapons and supplies#13 (his taped sawn-off) | 96x64 | 1,914 | 135 | 98% | 1 of 8 out: colours; stray pixels 15.1% |
| 17. Cannons and weapons#13 (the flintlock blunderbuss, his only long gun) | 96x63 | 1,967 | 162 | 95% | 1 of 8 out: colours |
| 17. Cannons and weapons#15 (his armoury rack) | 90x96 | 4,623 | 139 | 94% | 1 of 8 out: saturation 0.81 |
| 12. Weapons and armory#10 (his spear rack) | 90x96 | 3,917 | 187 | 94% | all in |

What that says. (1) HIS GUNS ARE A HARD READ: a near-black line round 98 to 100% of the silhouette and a value span
of 132 to 162, the widest of any prop family this lane has measured; the rig's ring is a soft 8 values and its renders
of the rack sit at a span of about 90. That is the biggest difference on the sheet and it is the rig's, not the
model's (FOR DIRECTION below). (2) THE ICON BOX: every one of his guns fills the 96 box, the pistol and the blunderbuss
alike; the rig's close camera keeps one ruler (456 px a metre, eight times the fight's), so the pistol sits at his
pistol's size and a long gun is four to five times longer, as it is. (3) Every twin is lit from the upper left, the
rig's one sun. (4) His guns are side-on with a little top, which is what the close camera at 80 degrees sees.
(5) He owns no modern long gun at all: every rifle on the sheet is the first one in the game.

## WHAT WAS MADE

tools/bohemia_cook_model_guns.py (new; reuses the props modeller's helpers) builds each gun at its real size with its
muzzle to +X and its ORIGIN AT THE FIRING HAND'S GRIP, so each glb goes on a hand bone as it is. The stocks are cut
from real side profiles (slab(): a profile pulled across the stock's thickness and rounded), because the first close
render of box-built stocks read as a toy's blocks. Five materials across all six and the rack, every one a palette
step: gunmetal (rubber 2), worn steel (tape_grey 1), wood (clay_mustard 1; clay_rust 2 read salmon under the dust),
tape (tape_grey 2), pine (tape_masking 1).

| line | option | the gun | real size (m) | the one odd thing | glb |
|---|---|---|---|---|---|
| PISTOL | A | a 1911-pattern service pistol, blued, wood grip panels, the ejection port on the side you see | 0.232 | grey tape twice round the grip where a panel split | gun_pistol_a.glb |
| PISTOL | B | a four-inch revolver gone to dull steel, six fluted chambers, a round wood grip | 0.220 | a string lanyard through the butt ring, hanging | gun_pistol_b.glb |
| SHOTGUN | A | a double barrel sawn off to 0.33 m, two outside hammers, two triggers, the stock cut behind the wrist, the saw's face raw | 0.646 | the cracked wrist taped (his own #13 does it) | gun_shotgun_a.glb |
| SHOTGUN | B | a pump gun, 18.5 inches over its magazine tube, a ribbed wood slide, a rubber pad | 1.010 | the wrist cracked through and held with two hose clamps | gun_shotgun_b.glb |
| RIFLE | A | a bolt-action deer rifle, 22 inches, open sights (the scope is the third tile and an upgrade), the bolt handle out on the side you see | 1.090 | the sling is a cut seatbelt with its buckle | gun_rifle_a.glb |
| RIFLE | B | a lever-action carbine, 20 inches, the receiver bare steel, a straight wrist, a steel butt plate | 0.983 | the forend wired to the barrel where its band went | gun_rifle_b.glb |

THE ARMOURER'S RACK (gun_rack.glb, 1.48 x 0.50 x 1.36 m): two 2x4 posts on their feet with braces, a top and a bottom
rail, two slats with dowel pegs for the long guns, the pistols on dowels off a front rail with open air behind them;
each gun is its own glb imported untouched (the corral's way) and every peg is cut to the height of that gun's own
underside, read by a ray from below (a box has corners only, so its vertices cannot say where its underside is). The
odd thing: a third pair of pistol dowels empty, a blank tag tied to one. gun_rack.json carries each gun's world box,
the pegs and the rack's own box, so the sheet cuts each gun out by projecting its box through the rig's cameras.

THE RIG: tools/bohemia_direction_master_rig.py unchanged, --real-length 1.48 --real-dims 1.48,0.5,1.36 --portrait 406
--head-m 0.89. Zero breaks; the cube measured 57 px; the light inside the guide; true proportions. The close camera is
the rig's own --portrait (80 degrees, front-on and the two front three-quarters, the camera PORTRAIT uses for a face),
with --head-m set to the rack's face so its canvas holds the whole rack: 456 px a metre. A hand-held gun alone cannot be
a candidate: at the fight's 57 px a metre a pistol is 12 px long and a long gun lying down is a 60 x 6 px stick, under
the prop floor (29 x 36), BACK by the card; the rack stands on a tile like any prop and passes it.

CARD (the rack's S still at 57 px a metre, under the style guide): 2 of 8 out under the style guide (colours >= 1134 (field 5: the class floor, or 370 per 1,000 of 3064 px): 1073; value span >= 118: 90); breaks none; the cube 58 px; the light 155.4 degrees on the screen; proportions true; 3071 colours over the eight facings; the close camera's three facings 7150 colours at 456 px a metre.

## THE LOOP, ROUND BY ROUND (each a full rig run, about four minutes)
1. Rig run one went out without --real-length: the rig scales the long side to 5.3 m by default and the rack would have
   been three and a half times its size. Stopped and re-run.
2. First close render: it reads as a gun rack, and three faults: five box stocks read as a toy's blocks; the wood
   (clay_rust 2) read salmon under the dust; the seatbelt sling read as a white ribbon. Stocks cut from real side
   profiles, wood clay_mustard 1, sling gunmetal; the 1911 pulled in to its real length (the grip and beavertail stood
   1.5 cm proud) and the revolver's barrel out to four inches. A silent failure on the way: the rack's tape material,
   made before the imports and used by nobody yet, was cleared by the first import and the build died after the rig
   had already started on the old rack; caught because the card came back identical to the decimal.
3. The pistols drowned against the pale pistol board behind them, and the whole rack read soft beside his (value span
   89 against his 132 to 162). The board went (the pistols stand on dowels off a front rail) and the blued steel went
   one step darker (rubber 1).
4. That turned the card BACK: 3 of 8 out (the near-black steel collapsed into a few colours at the fight's size: top
   eight 11.0, colours 1,035 against 1,130). The darker step was not worth a BACK card: back to rubber 2. And the
   1911 had a slat behind it: both pistols moved into the open gap between the slats.

## FOUND, FOR DIRECTION (the rig and the card are yours; nothing of yours was changed)
1. HIS GUNS END IN A NEAR-BLACK LINE ON 98 TO 100% OF THE EDGE (nine tiles measured), the widest value spans of any
   family this lane has measured (132 to 187). The rig's ring is 8 values; at the close camera a gun reads soft beside
   his. A ring by class (a gun, a held thing) is a rig setting, so it is yours.
2. THE SOURCE PASS IS METRIC, AND THE CLOSE CAMERA IS EIGHT TIMES CLOSER: the dents (2.5 cm at 2 a metre), the worn
   edge (5 cm) and the grain (28 a metre) were tuned where a pixel is 1.75 cm; at 456 px a metre a dent is 11 px, so
   the rack's posts and the long guns' barrels wave a little. It reads hand-made, the stop-motion way; if it should
   not, the source pass wants a scale by camera, also yours.
3. THE RIG HAS NO CAMERA FOR A THING YOU HOLD: the close view here borrows the portrait camera by setting --head-m to
   the rack's face. The guide already carries an icon floor (32 x 32) and no class or camera that uses it; a held
   class (a gun, a tool, a bottle) with its own close camera would make the bag's pictures and the weapon card from
   the same table.

## FOR CHARACTER, COOK THREE AND COMBAT (when he picks; rule 100: not placed by this lane)
Each gun is its own glb with its origin at the firing hand's grip (GRIP in the modeller), muzzle +X, up +Z, at its real
size: it goes on the hand bone as it is, and the man holds it at true size in the fight (a pistol 13 px, a rifle 62 px
at 57 px a metre, the last row of the sheet). The rack is a prop for the armourer's shop (RUN TWO's market) and for a
fight board in a town; it carries real_dims_m in its rig.json.

## THE SHEET
records/target/COOK_THE_FIRST_GUNS_OFF_THE_RIG.png (tools/bohemia_cook_guns_sheet.py): per gun line the quartermaster's
line, his own tiles, what the game shows today, and my A and B from the close camera, all at 1:1; then the rack (the
close camera's S, SE and SW beside his two racks; the eight facings on his cracked street tile; the robot and the truck);
then every gun at the fight's own size beside the robot. Not doubled. VOTE: cook-the-first-guns-off-the-rig-10-19,
options A, B, MIX, NO.

## WHAT IT DOES NOT CLAIM
Not in any hand (CHARACTER and COOK THREE own the bodies). Not a number (TUNING's table) and not the first fight
(COMBAT's [guns from the first fight]). Not checked by the NOT VIBE CODED family by hand. No word a man could read.
Nothing is final before his pick (rule 47b) and his moodboard (rule 108).

[bb Battle Brothers shows a weapon in two places, the man's hand on the field and the big picture in the inventory and
the shop; both of ours now come from one model.]
[analog horror: every gun on the rack was somebody's before it was for sale: the tape, the clamps, the wire, a seatbelt
cut out of a car for a sling, and the empty pegs with a blank tag where one went out the door.]

REFERENCE CHECK: his tiles named above are the twins at 1:1 on the sheet; the real guns' sizes are the makers'
published ones (a Government Model 1911 216 mm; a K-frame four-inch 235 mm; an 18.5-inch pump about 990 mm; a 22-inch
bolt deer rifle about 1,080 mm; a 20-inch lever carbine about 980 mm); the palette is DIRECTION's source palette; the
card is the rig's. No reference game. REUSE CHECK: the helpers are the props modeller's, the guns are imported untouched
into the rack, the rig is the master rig, the sheet reuses the props sheet's layout helpers and quartermaster call, and
the never-judged twins are decoded whole from banks/BOHEMIA_HD_TILE_REPO_part1-4.txt. No bank was opened for a model:
nothing in banks/ is a 3D model.
