# COOK: THE PISTOL, RULE 408(b)'s FIRST GOLDEN PIECE, MADE BY THE COMMON RECIPE. IT DID NOT REACH THE BAR (11/6/26)

His words, 11/4 (rule 408): 'I just want the first time you make art to be the final... the shields were disappearing
recently, I can't see the shields... the two weapons, it's just all fucked up.' DIRECTION's routing (records/
BOHEMIA_DIRECTION_THE_FIRST_TIME_IS_THE_FINAL_TIME_11_6_26.md part 3, row 11): A WEAPON is the most urgent kind with no golden
piece. The coordinator's brief: ONE weapon, the one the demo puts in his hand first, by the common recipe, every step; judged
where he meets it; registered GOLDEN only if it reaches the bar.

## THE ANSWER, FIRST

- THE WEAPON: THE PISTOL. YOU's crew row (records/target/bb/ours.json) carries jobs pistol and car_door; ours.weapon_rows maps the
  pistol job to Battle Brothers' 'dagger' row; the first origin at the door (THE CREW THAT IS LEFT) hands two of its three men the
  same row. Every one of the six rows the game calls PISTOL (class dagger: knife, dagger, notched blade, rondel, qatal, estoc) was
  drawn as COOK's 10/18 class pistol, a 1911 of eight boxes in gunmetal.
- THE REAL OBJECT: WPN-01 (added to the reference library this round; it had 0 weapons of 98 entries): the Colt Government Model
  1911 in stainless, .45 ACP, 216 mm long, 140 mm tall, 32 mm across the grips, a 127 mm barrel, 1.0 to 1.1 kg, 7+1. Dealers'
  listings (Blackstone, KY Gun Co, the 1911C two-tone listing); no Colt spec sheet was reachable. The model: 218 x 32 x 138 mm.
- IN THE FIGHT IT IS BETTER THAN WHAT IT REPLACES, AND IT IS IN THE GAME: before, the pistol at his hip is a dark smear on his
  black trousers; after, a stainless pistol reads at his right hand in every facing it faces the camera (the shipped fight on the
  phone profile, 390 x 844 at 3x: 1,102 to 1,132 draws of the new pistol a run, 0 before, 0 page errors, his car door drawn in
  every frame).
- IT DID NOT REACH THE BAR. An independent reviewer, briefed only with DIRECTION's bar page and recipe and the pictures (not my
  conclusion), returned BACK: 'beside the bar: WORSE, because the robot and the thug read as one real shape at 1x from every
  side, while this pistol shows in only 3 of the 8 door facings, reads as a pale blade rather than a pistol shape, and
  disappears behind the door or into the black suit in the rest.' Its four faults are below and are the next round's work. So
  the VOTE card is a STAND-IN, not golden (rule 408(c)), and HIS PACK TILE STAYS ON THE ITEM CARDS: my card picture was judged
  lighter and weaker than his own pistol tile (pack_12_weapons_and_supplies_006), so it does not replace it.

## THE RECIPE, STEP BY STEP (DIRECTION part 3)

1. ONE AT A TIME: one pistol. Nothing else of its kind was made.
2. THE BAR BESIDE IT: a weapon has no bar piece; the nearest are the clay robot (robot_S: one real object, the right size, matte
   clay, dirt from its own shape) and the thug (body_thug_S, the man it is held beside). The thug was the loop's twin;
   records/target/cook_golden_pistol/beside_the_bar_1x.png puts both beside YOU holding it and the card, one pixel to one pixel.
3. THE REAL THING FIRST: WPN-01's numbers before any clay. The first build came out 247 mm long (the grip 27 mm too far back);
   on the real gun the butt's back corner sits under the grip safety's tang, so the grip moved 23 mm forward: 218 mm.
4. ONE SOURCE: reference/models/bohemia/gun_service_pistol.glb, modelled from side profiles (the slide, the frame and its grip
   at the 1911's 18 degrees with the arched mainspring housing and the beavertail), the guard a flat band, the checkering on the
   walnut a field of pyramids 3 mm apart with the two smooth diamonds round the screws; five materials from the style palette
   (stainless slide tape_grey 4, stainless frame tape_grey 2, walnut clay_mustard 1, black parts rubber 2, raw steel chrome 1);
   THE ORIGIN AT THE FIRING HAND'S GRIP (the middle of the grip, half way down), the muzzle +X. THE ONE WRONG THING (the bible's
   R1): the serial ground off the right of the dust cover, three bright grinder strokes. Through the master rig with --class
   prop at its real length, wear seeds 0 and 1 (records/target/cook_golden_pistol/master_true_seed0 and _seed1): proportions OK,
   no breaks; the prop card BACK 4 of 8 on size, as COOK measured for every gun on 10/18 (a 216 mm gun alone on the ground is
   18 px; the prop floor is for things that stand on a tile). Seed 1 chosen (cycle 9: grime in the frame round the guard). In
   YOU's hands by the fight's four picture systems (the six guns' tool imported whole, COMBAT's guns tool and ANIMATION's hold,
   idles and melee tools patched in memory as the six guns patch them): grid 120, held clips 272, idles 152, shield arm 288
   frames in 118 s. YOU's bodies rebuilt in this container by each tool's own commands; the class pistol re-rendered through
   the same pipe lands on the shipped sheet with 0 of 2,045 pixels different.
5. THE LOOP: 21 cycles, skills/bohemia-pixel-art/scripts/look.py with body_thug_S as --twin, words every cycle
   (records/target/cook_golden_pistol/loop.jsonl; the table: look.py --summary). What it changed: the guard from three rods
   (a coat hanger) to a band; the grips from a box to the grip's own outline, then checkered (two boolean tries read as plaid
   then vanished, a third ate the whole panel and a check now refuses that; geometry pyramids held); stainless kept over a dark
   two-tone frame (the dark frame sank into his hands at fight pixels, cycle 7), the slide a step lighter instead (cycle 8;
   its brightest pixel 216 of 255, never white); wear seed 1; the serial a grinder's scar; the hammer's spur out behind the
   slide; the one-hand poses added to the loop (where the change tells most); the card side-on at 1,200 px a metre shrunk into
   his tile's box, its grain at the card's scale on the steel only (cycles 19 to 21). The look tool's numbers: the card passes
   silhouette, light, ramps and edge; DETAIL ends at 2.29 px a run against the band's 2.22 (pushing it in turned the walnut
   to noise, cycle 20). Cycles 13 to 17 judged the fight's pictures by eye and logged against the card of cycle 12, which did
   not change, so their stage numbers repeat.
6. THE MACHINE CHECKS: below.
7. ON ITS REAL SURFACE: the shipped fight, the phone profile, all eight facings, with his car door and with the pistol alone,
   beside the thug (tier_thug, his own pipe in his model) and RAUL (another body), at the fight's zoom and its opening zoom, and
   at night (the night flag set after the board was painted: the man's night, not the board's; the pistol takes the light his
   hands take and does not glow). tools/bohemia_cook_the_golden_pistol_proof_11_6_26.js, records/target/cook_golden_pistol/proof.json.
8. DIRECTION'S EYE: owed. The independent read above stands in for nothing; it is recorded as what it is.
9. HIS PASS: not asked; the card is a stand-in.

## THE FOUR FAULTS (the independent read; the next golden pass starts here)

1. The door and his body hide the pistol in five of eight facings (turns 0, 4, 5, 6, 7). Some of that is the real thing (a
   pistol in the right hand behind a door on the left arm, seen from the back), and the class pistol hid the same way; a
   golden weapon still has to be judged in all eight, so the hold that shows it must be ANIMATION's question with COOK.
2. At fight size, held low muzzle down, the stainless pistol is a pale sliver that reads as a knife, not the L of slide over
   grip; from the back it goes dark into his jacket. The hand covers the grip in the low ready, so what is left is the slide;
   the lever is the pose (the grip out of the fist, the muzzle less steep) or a two-value gun the L can be read inside.
3. The card is flat and clean beside the robot's dirt, a light halo round the grip at 3x, and less weight than his own pack
   tile; it is not shipped (his tile stays).
4. At the fight's opening zoom (the man 59 px tall on the phone) WAS and NOW cannot be told apart.
A drawing bug seen in the same pictures, not this lane's: from the back the car door draws as two wing-like panels behind his
shoulders (proof door_after_turn2/3/4); NOTE for COMBAT and ANIMATION.

## IN THE GAME (this push)

- slices/fight_rig/own_guns.json: the golden pistol as gun 'dagger' (its sheet slices/fight_rig/own_guns/dagger.webp, 590 cells,
  1024 x 58), every PISTOL row on it (by_row knife, dagger, notched_blade, rondel_dagger, qatal_dagger, estoc); the six guns'
  entries and cells untouched; the shift tables recomputed off the shipped sheets by the same code: the 309 that existed are
  identical, 17 newer looks gained theirs (so the six guns now draw on those 17 too). No line of the fight changed.
- reference/models/bohemia/items.json: service_pistol its own entry (was: pistol), owning those six rows.
- BUILD 11/6i - THE PISTOL IN HIS HAND; the demo re-cut.
- NOT changed: the item cards (w_pistol.png is his pack tile, kept); the settlement screens (RUN FIVE's).

## CHECKS RUN (only what this change touches, one at a time)

- THE FIGHT DRAWS WHAT HE WEARS (COMBAT 8's check, gates/the_fight_draws_what_he_wears_gate.js): 19/0 (a first run under load
  read 18/1, a timing flake; run again alone, 19/0). P5: the car door on his arm and a pistol in his hand, all eight facings,
  106 of 106 looks.
- every item has a model (gates/every_item_has_a_model_gate.py): 286/0, the new entry's M2 and M3 green.
- the VOTE tab, REFERENCE CHECK, REUSE-FIRST and purity: in the commit's proof line.
- PIL works on this box in both pythons (python3 and the bpy venv); no image-comparing leg failed for that reason this round.
- Blender: bpy 4.2.0 in a python3.11 venv (/tmp/v) runs on this box; it dies at exit now and then after writing (a known
  bpy 4.2 trait), every step checks its files. A master rig crash this round was mine: an output folder named rig_... is
  rewritten by the rig's shadow naming (it replaces '/rig_' in the path); the folders are master_... now.

## TO REBUILD (a fresh container)

python3.11 -m venv /tmp/v && /tmp/v/bin/pip install bpy==4.2.0 numpy pillow; then COMBAT `bodies you` and each system's Stand
(the six guns' record says how; tools here: model, render, pack, manifest, card_render, bar, sheet; proof node script).

[bb Battle Brothers draws every weapon its own sprite in the man's hand on every pose; ours now does for the pistol, at its real size.]
[analog horror: the serial ground off; somebody owned this gun before you and made sure nobody would know who.]
