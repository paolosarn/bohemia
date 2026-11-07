# CHARACTER 11/7: THE NINE ENEMY TYPES IN THEIR OWN CLOTHES (rule 427(b); ask lines 286 and 238)

Paolo, 11/7, 'More' (rule 427(b)): more enemy types with their own art on the master rig, new garments, not reused people;
then the clothes: leather and layering, quality before count (ask 286, 'more enemy types with their own art'; ask 238, 'the
clothes look good: leather and layering, quality before count'). FACTIONS 11/3 (records/BOHEMIA_FACTIONS_NINE_NEW_ENEMIES_11_3_26.md)
named the debt: 'NEW GARMENTS OWED TO CHARACTER (a car-door shield, a hook pole, a crossbow, a dart bandolier)'.

## MEASURED FIRST
- records/target/bb/bohemia_enemies.json: 20 rows, 9 of them human. All 9 stood in people rendered for somebody else: 36 looks,
  0 their own (the House in the Remnants', Blues' and Trades' clothes; the Watch in the Volunteers' and the Colorful's; the
  Keepers in the Homeless' and the Anarchists'; the Water People in the Caravans' and the Kids' runners).
- On his phone (tools/bohemia_factions_the_new_enemies_shots.js, BEFORE: records/target/character/the_nine_enemies/phone_before/):
  the House band stood as faction_remnants, person_remnants_0/1, person_blues_2, faction_trades, person_trades_0; the Watch as
  faction_church and four Volunteers and Colorful; the Keepers as faction_homeless and three Anarchists; the Water People as
  faction_caravans, two Caravans and two of the Kids. 0 page errors in 4 fights.
- FACTIONS' four named pieces split two ways: the car-door shield, the hook pole and the crossbow are WEAPONS (drawn in his hand
  from the guns sheet by the fight, rule 424, WEAPONS' and COOK's); the dart bandolier is a garment. So this round makes what a
  man WEARS, and each type gets one shape nobody else in the valley wears, so the type reads at a glance (Battle Brothers reads a
  brother's kit at a glance: helmet, armour, weapon).

## WHAT SHIPPED: 30 MEN, NINE TYPES, ELEVEN NEW PIECES, ONE NEW GARMENT
tools/bohemia_character_the_nine_enemies.py (roll | look | batch | pack | sheet). Reuse first: the barber and the body build
(their files never edited), the wardrobe's 307 garments, RUN TWO's render over DIRECTION's master rig, COMBAT's fight poses.

| type | men | the new piece (modelled on his body or skull) | layered over |
|---|---|---|---|
| House Shield | 3 | THE CARPET TABARD (the casino floor cut into livery: black, brass diamonds, a bone border, the House's chip front and back, a woven belt) + THE HUBCAP KETTLE (a gunmetal pot with a raised comb, a car's hubcap riveted on as the brim, its slots dark) | a turtleneck, a leather jacket or vest, a gorget, gloves |
| House Hook | 3 | the tabard + THE MAIL COIF (a hood of steel rings over head and throat, the face cut out, a leather edge, the cape to the shoulders) | a longsleeve, a leather or work jacket, gloves, bracers |
| House Crossbow | 3 | the short tabard + THE BOLT CASE (a cut drain pipe behind his right hip, taped rims, five bolts' fletching) | a shirt, a leather vest or jacket, bracers |
| Neighbor | 6 | THE HI-VIS VEST (new garment: OUTER's plain vest cut, faded to a sick yellow) with its silver bands, braces and the dark back patch + THE FLOOR-MAT GREAVES (rubber car mats bent round the shins, ribbed, two bungees) on four + THE BIKE HELMET (a vented shell with a tail, a visor, straps) on three | his own weekend flannel, hoodie or henley; gloves, belts, pads |
| Captain | 2 | the hi-vis vest + THE SASH (the Watch's green, shoulder to hip, knotted) + THE BADGE + THE BULLHORN on his hip | a button-up, a leather belt, gloves |
| Feral | 2 | THE COYOTE PELT (the lab coyote's head as his hood: fur, a blunt muzzle along his brow, teeth, eye holes, tall ears, the lab's tag in the left ear; the pelt down his back to a black-tipped tail; the forelegs knotted on his chest) | a tank, bare arms in wraps and bracers, a waist wrap |
| Keeper | 4 | THE STRIP CLOAK (26 bleached strips from a rope yoke and a rope belt to mid-shin, ragged, three in the Keepers' coral and two in rust) | a flannel, tee or hoodie; bracers, wraps, the axe bandolier, a head wrap |
| Cutter | 4 | THE WATER JUG (a five-gallon cooler bottle in amber plastic on his back, the water line darker, two ridges, woven straps, a hose over his right shoulder to a bite valve) + THE ROBE (the long shirt to the shin) | a leather or rust vest or a leather wrap coat, the shemagh, a face wrap |
| Needle | 3 | THE NEEDLE BANDOLIER (a dark leather band across him, seven syringes in its loops: pale barrels, dregs, rust-orange caps) | a turtleneck, hoodie or shirt; a wrap coat; a dust mask or wrap |

Colours are territory: the Water People's amber (#a06400) is the jug, the Keepers' coral (#ffa591) three strips, the Block Watch's
green (#006432) the sash; the House (a canon banner) is black and brass, nobody's ink. No blue cloth (rule 159: the rig's cool
fill renders it hot). No trench, no duster on any of the nine (trenchcoats are for badasses).

## LEATHER AND LAYERING (ask 238), MEASURED ON THE ROLL
Every man wears 4 to 8 layers on his body (a top, a coat or vest where he has one, the new pieces, his kit), mean 5.0. 27 of the
30 wear leather (a leather jacket, vest or wrap coat, leather gloves, bracers or a gorget, or the woven leather of every new
piece's straps: the tabard's belt, the jug's harness, the bolt case's strap, the bandolier); the three without are neighbours in
their weekend clothes, on purpose. The runway inside the grime: Rick Owens' long black column (the tabard, the strips: RNWY-05,
RNWY-08), Balenciaga's maximal stack (RNWY-06), Bottega Veneta's intrecciato on every strap (RNWY-14).

## THE GOLDEN PIECE, AND THE LOOPS (rule 408(b): one at a time, the bar beside it)
One man of each type was built and rendered alone, put beside the bar's man (records/target/cook3/rig/thug/rig_S.png) at 1x and
x4, fixed, and rendered again; only then the batch. Each fix is written where it was made in the tool. What the loops caught:
1. THE KETTLE (house_shield_0, three loops): the steel came out chalk under the rig's up-face dust and read as a sun hat; an 8.2 cm
   drooping brim hid his whole face; then a dark band ringed the pot in every facing: his own cut's hair through a 1.2 cm pot.
   Now a gunmetal pot 2.6 cm off the skull with a comb, a 5.6 to 7.2 cm nearly flat hubcap brim. Reads as a steel helmet.
2. THE TABARD: a 4 cm bone hem and 8.5 cm sides outweighed the black; a third thinner.
3. THE FERAL (four loops): the outfit tool gave the coatless man a flannel over the bare arms the pelt is for (the outfit is off
   for the Keepers: their layers are this tool's); the pelt at the coyote's real colour went to a pale egg under the dust (a
   value darker, a dark saddle, black tips, tufts); a 17.5 cm muzzle pointing down read as a beak; ears read as horns.
4. THE KEEPER: the strips 2 cm off him read as a short rag skirt under the shirt (4.5 cm off, to mid-shin); his TATTERED FLANNEL
   is a steel-blue plaid (rule 159), so a scavenger flannel.
5. THE CUTTER: the jug 3 cm off his back and leaning 10 degrees floated beside him from the side, and four ridges stacked it like
   gourds (on his back, upright, two ridges); a section 0.86 m up found no torso points on one body (the chest's measure).
6. THE NEEDLE: 1 cm syringes read as a plain strap (1.5 by 12 cm, pale barrels).
7. THE CAPTAIN: the olive field cap's flat crown rendered as a hollow tube (the work cap).

BESIDE THE BAR (step 8, held by this lane to the bar, the way ANIMATION held the crawl; DIRECTION's eye may overturn it):
SAME. Every man is the thug's way (his clay model through the master rig, one camera, one sun, 64 colours on the fight sheet)
and each type carries one silhouette nobody else has that reads at 1x on the phone. Weaker: the badge and the syringes are under
two pixels at 1x; the kettle's brim shades the face from the fight's camera (the portrait, from the front, shows it).

## NOT DONE, ROUTED
- IDLES AND HELD CLIPS for the 30 (ANIMATION: tools/bohemia_animation_everybody_idles.py, tools/bohemia_animation_what_a_man_holds.py,
  tools/bohemia_animation_melee_in_hand.py). Until then each stands as his still and fights on his own sheet. The idles gate's P1
  was already red on main (18 missing: the robot, six bosses, eleven beasts) before this round; it now also names these 30. Their
  tools look an 'enemy_' man up in the three enemies' roll and build him with that tool: for these 30 it is
  records/character/BOHEMIA_THE_NINE_ENEMIES_ROLL.json and `tools/bohemia_character_the_nine_enemies.py build-one <id>`.
- The shield, the hook and the crossbow in the hand (WEAPONS, rule 424; FACTIONS' named car door goes there too).
- No woman among the 30 ([eyes: her body] stays the top OPEN row: the rig has no woman's body yet).

## THE FACE STRIP WAS FULL (found on the way)
The fight keeps every man's face on one strip, 128 px a face: 121 faces, 15,488 px, and a WebP stops at 16,383 px, so 30 more
could not be written (any lane adding seven more faces would have hit it). The 30 ride slices/fight_rig/faces_more.webp, listed in
fight_rig.json faces.more ({file, order}), read by two small marked hooks in the fight (__THE_SECOND_FACE_STRIP__: the preload and
drawPortrait), the same size and the same way; the first strip is untouched. NOTE left for COMBAT.

## PROOF
- THE BATCH: 30 of 30 made (street: stand and walk in eight, the portrait and four mouths; fight: aim, swing, hit, fall, carry,
  carry-walk in eight), about 7 minutes a man on 4 cores, two workers; one man (house_shield_1) made again after the batch for
  his shin guards (STEEL rendered blue, rule 159).
- THE PACK: 30 sheets into slices/fight_rig (enemy_<id>.webp, 282 to 332 KB each, in each type's old reference cell with its guns),
  30 faces on faces_more.webp, every type's row pointed at its own men; the packed atlases redone (193 sheets, 0 stale). Pixels
  outside a cell are fall and hit frames only (the lying body), as the three enemies' were.
- ON HIS PHONE (tools/bohemia_factions_the_new_enemies_shots.js, phone_portrait, the rebuilt fight every demo door opens):
  records/target/character/the_nine_enemies/phone_before/ and phone_after/ (one JPEG per faction at the deal and mid-fight).
  AFTER: the House band stood as enemy_house_shield_0/1/2, enemy_house_hook_0, enemy_house_crossbow_1/2; the Watch as
  enemy_watch_captain_0 and neighbours 1 to 5; the Keepers as enemy_keeper_feral_0 and three Keepers; the Water People as three
  Cutters and two Needles. The moves played exactly as before (shieldwall 3 and a flee; flees 2 and rally 2; adrenaline 6;
  poisoned 3), 0 page errors in 4 fights. The side by side: records/target/character/the_nine_enemies/CHARACTER_THE_NINE_ENEMIES_PHONE.jpg.
- THE CARD: records/target/character/the_nine_enemies/CHARACTER_THE_NINE_ENEMIES.png (the bar's man, then every type: the borrowed
  person BEFORE, his own men AFTER, 2:1); VOTE character-the-nine-enemies-their-own-clothes-11-7, GOLDEN, art_kind body, bar
  body_thug_S, real RNWY-06, held to the bar by this lane (DIRECTION may overturn it).
- WEIGHT: the published site gains the 30 fight sheets (8.9 MB), their packed atlases and the face strip; the street pass (12 MB,
  no screen reads it) is committed under records/character/enemies_nine_street, never published; the walk frames and the look
  renders are regenerated and ignored.
- GATES (rule 13: the pre-push pass, by name; the full suite unmeasured since this round's base):
  THE SHEETS ARE PACKED 4/0; DEMO BUILD 25/0; TRENCHCOAT 12/0; ATTEMPT 15/0. Red, and the same red on clean main (run in a worktree of origin/main, this round): THE NEW ENEMIES 8/4 (THE FILE, THE FOLD, THE NEEDLE, SIZED TO THE CREW; FACTIONS'), THE REBUILT FIGHT PLAYS 143/12, NO TWO PEOPLE ALIKE 22/1 (the crew screen), THE FACE IS HIS OWN FACE 17/1 (a board client), WHAT A MAN HOLDS 16/1 and THE THING IN HIS HAND 27/2 (the demo's road fight opened no fight frame), THE FIGHT READS ONLY SOURCED NUMBERS 7/3, REFERENCE CHECK and REUSE-FIRST (other lanes' tools; neither names these two). EVERYBODY IDLES --quick 35/3: P1 was red on main with 18 missing and now names these 30 too (no idles yet: ANIMATION, NOTE left); C3 and R5 are main's own.
