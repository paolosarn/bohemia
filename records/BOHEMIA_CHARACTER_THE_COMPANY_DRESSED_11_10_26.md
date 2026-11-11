# CHARACTER 11/10: THE COMPANY DRESSED (rule 427(b)'s second half; ask 238)

Paolo 11/7 ('More', rule 427(b)): 'the clothes look good: leather and layering, quality before count' (ask 238); his 10/23 on the
same row: 'layering, layering... I didn't mean to say leather, I just meant to say layers'. MADE FROM the nine enemies' recipe he
passed (VOTE character-the-nine-enemies-their-own-clothes-11-7, YES 11/8, no 'not final' words: 408(b) step 9 freezes it).
Unblocked by PLUMBER 8's packers merge (9467201b): until then a re-dress from one box either left a man in his old clothes on five
screens or took the other men out of the game (handoffs/CHARACTER.md, 11/10 (ad)).

## MEASURED FIRST
- The company is YOU plus person_town_0..11 but 9 (ours.people_looks.crew, the fight's and the crew screen's one list; a company
  man wears his slot's look). THE BLOCK WATCH origin starts him with all eleven; the other origins with 1 to 6. person_town_9 is in
  no slot: he is the hall's first man (recruitLooks deals the town's own men first, his company's left out), so he was re-dressed too.
- Layers on the body (base, mid, outer and the kit's slots, from each man's build record): six of the eleven wore 2 (town_2, 3, 5,
  6, 7, 8), two wore 3 (town_4, 10), two wore 4 (town_0, 1), one 5 (town_11); town_9 3. The nine enemies he passed: 4 to 8, mean 5.0.
- BLUE (rule 159: a cool neutral renders blue under the rig's cool fill). Measured on the source ramps: a piece reads blue when its
  blue channel is 4 or more over its red (slate 72,78,86; ash 70,70,74; coal 48,48,52; storm 70,72,78; steel; black tank 42,42,50;
  black denim 44,46,54). Eleven of the twelve wore one: town_2 a SLATE CAR COAT (the outfit's swap), town_10 SLATE WORK PANTS,
  town_0 a SLATE STACK PANT, town_5 a SLATE SHORT-SLEEVE, town_4 an ASH ARC SHIRT and a LEAD WAIST WRAP, town_6 a COAL HOODIE,
  town_7 a BLACK TANK under his shirt, town_11 a BLACK TANK and BLACK DENIM, town_1 a SLOUCH BOOT to the knee, town_10 an ash
  ONE-SHOULDER DRAPE, and five ASH or COAL COLUMN pant-boots (town_4, 5, 7, 8, 9) that read as navy legs. A warm neutral (soot,
  charcoal: 54,52,54) renders warm (town_2's soot cargos measure 54,50,49 on his still).
- THE EYE, NOT ONLY THE NUMBER: town_4's and town_11's first re-make measured 0% cool pixels but a dark neutral beside khaki still
  read blue-grey on the card; both were made a third time in real warm colours (a rust work coat over a bone henley; a rust tank over
  a bone henley with leather trousers), and town_0's charcoal crop became brick before his render.

## WHAT CHANGED (the source: twelve entries in RUN TWO's roll, by text, nothing else in the file)
| man | before (his build record at d461b3938) | now (his build record: outside in) | layers |
|---|---|---|---|
| town_0 | dust brown trench, bone henley, bone scarf, shoulder mantle, slate stack pant, bone stack boot | dust brown trench, bone henley, bone scarf, shoulder mantle, brick crop trouser, bone stack boot | 4 -> 4 |
| town_1 | dust plaid shirt, olive henley, sage scarf, gold shoulder mantle, charcoal shorts, slouch boot | dust plaid shirt, olive henley, sage scarf, gold shoulder mantle, cropped work trouser, rust boots | 4 -> 4 |
| town_2 | slate car coat, dust plaid shirt, stacked jersey pant, stacked mid boot | leather jacket, dust plaid shirt, leather belt, leather gloves, soot cargos, stacked mid boot | 2 -> 4 |
| town_3 | sage car coat, arc layered shirt, drop rise trouser, coal mid boot | sage car coat, arc layered shirt, trailing scarf, salvage satchel, dust trousers, coal mid boot | 2 -> 4 |
| town_4 | barn coat, ash arc shirt, lead waist wrap, coal column | rust work coat, bone henley, wide waist wrap, leather gloves, khaki cargos, field boots | 3 -> 4 |
| town_5 | slate short-sleeve, bone shoulder drape, ash column | leather vest, khaki button-up, bone shoulder drape, worn bracers, leather stack pant, leather stack boot | 2 -> 4 |
| town_6 | sage field coat, coal hoodie, dust brown trousers, tall moto boots | field green coat, sand hoodie, oxblood scarf, leather belt, dust brown trousers, brown boots | 2 -> 4 |
| town_7 | vestment gold shirt, black tank, coal column | oxblood jacket, vestment gold shirt, leather belt, hand wraps, rust cargos, ranch boots | 2 -> 4 |
| town_8 | bone vest, work coveralls, ash column | bone vest, work coveralls, scav tool belt, leather gloves, column pant-boot | 2 -> 4 |
| town_9 (a hire: the hall's first man) | split-tail work coat, rolled work shirt, field leg wraps, ash column | split-tail work coat, bone henley, charcoal scarf, field leg wraps, dust brown trousers, field boots | 3 -> 4 |
| town_10 | olive asym coat, bone button-up, one-shoulder drape, slate work pants, sandwalkers | olive asym coat, bone button-up, leather belt, brick shoulder roll, dust trousers, sandwalkers | 3 -> 4 |
| town_11 | black tank, sage striped henley, charcoal scarf, charcoal belt, shell bandolier, black denim, bone stack boot | rust tank, bone henley, dust scarf, leather belt, shell bandolier, leather stack pant, bone stack boot | 5 -> 5 |

Every man now wears four or more layers on his body (mean 4.1; the company's eleven were 2.8 before), leather on ten of twelve
(a jacket, a vest, a work coat, an oxblood jacket, belts, gloves, bracers, trousers, a satchel, a bandolier), and no piece whose ramp
reads blue. The same faces, haircuts, builds, beards and marks: the roll's face, hair and skin fields were not touched. No trench
added (town_0 kept the dust brown trench he wore). The melee pass now also draws each of the twelve's 'b' sheet (BIdle, BShot), as
ANIMATION's melee_in_hand makes it today for any man it re-makes.

## THE PIPE (each owner's own one-man command, unedited; the packers merge)
Per man (tools/bohemia_character_the_company_dressed_remake.sh): RUN TWO make (the barber's build, the street stills, walk,
portrait and four mouths), RUN TWO fight-make (COMBAT's poses, the six fight clips), ANIMATION everybody_idles person_one (bare,
carry, work), the_towns_activities person_one in each of its four sets (town, after, camp, pitch: the twenty clips, only for a
man already in rig_town; town_9 is not), they_mend_on_the_march render (only for the two the map walks beside YOU, town_0 and
town_1), what_a_man_holds person_one (the held clips), melee_in_hand person (only for a man already in rig_melee). Then the packs:
RUN TWO fight-pack, walk-sheets, bake (the map's sheets), index; everybody_idles people_pack and work_sheets; the towns', the
march's, holds' and melee's packs; the fight's packed atlases (tools/bohemia_run_the_sheets_packed.py).
TWO TRAPS ON THE WAY (both fixed by deleting, not by editing anyone's tool): RUN TWO's make and every ANIMATION person_one reuse
records/character/rig/barber_person_<id>.glb when it is on the box, and person_done() skips a man whose render folder holds
made.txt; so a roll edit after a stopped run renders the OLD clothes. The remake script's header says so. Two runs of one man
at once collide (a shared posed model, a moved portrait): town_0 ran twice by a waiter's mistake and was made a third time alone.
And the towns pack keeps, for a man it re-packs, only the sets rendered on this box: the first pass made the town set alone, so
the after, camp and pitch acts fell out of all eleven (THE TOWN'S ACTIVITIES A2 and A3 went red, 22/0 on clean main); the three
sets were rendered for the eleven and the march for town_0 and town_1, and the script now runs every set a man is in.

## SEEN ON THE PHONE: THE ARMOUR HE STARTS IN IS DRAWN OVER THE CHEST (measured 11/11, not ours to change here)
Every origin starts his men in body armour, and the crew screen's camp, the town, the map and the fight draw it over the clothes as the
armour's own picture (engine/bohemia_wear.js, rule 272, COOK's art for the class): THE BLOCK WATCH's twelve in a blue-grey padded vest and
a coral head wrap (BODY 35), the default start's three (newcrew: YOU, town_0, town_1) in an olive plate vest and a steel helmet (BODY 90),
shot on this build upright. So in play the new layers read around the armour (the trousers, boots, sleeves, satchels, scarves and belts),
and the whole outfit reads on a man whose armour comes off (CORRECTED 11/11 by the hires' ship: the hall's card shows a man's face only, its whole-man figure is display:none, so "whole in the hall" was wrong). That is Battle Brothers' own rule
(a hired man's look is his armour and helmet; his background clothes show when he is stripped), so the armour pictures are now most of
how his company reads: the blue-grey vest renders blue under the same cool fill (rule 159), a NOTE to COOK in VAMILY; the armour classes
in the same layered, leather, warm recipe are the next step that makes this ship show on every screen.

## PROOF
- NOBODY DROPPED (every index a rolled man lives in, counted before the re-make and after every pack, on the rebased tree): the fight's
  looks by kind (crew 13, faction 13, tier 2, beast 22, person 69, enemy 47, robot 1, boss 6), its faces 151; the idles 256 (fight_person
  54), the map's idle people 154; the town's activities 16 men of 20 acts each; the march 3 (YOU, town_0, town_1); the held clips 100; the
  melee 62; the map's mix sheets 18 holding 156 men; the walk sheets 134; the fight's packed atlases 201 (none stale). Identical.
- ONLY THE TWELVE MOVED: every changed file under slices/ is one of the twelve men's (rig_town 15 a man for the eleven in it, rig_march 8 each
  for town_0 and town_1, and the sheets and indexes of the first ship), and every shared index changed only in their entries. The towns
  index is main's to the byte: the towns pack, unedited, now writes the march's four acts into its activities table (its source() reads the
  march source in), which main's index does not carry; main's table was put back (a NOTE to ANIMATION).
- GATES on this tree: THE PACKERS MERGE 4/0, THE TOWN'S ACTIVITIES 22/0 (A2 and A3 green again: every man's after, camp and pitch acts),
  THEY MEND ON THE MARCH 14/0, WHAT A MAN HOLDS 17/0, THE THING IN HIS HAND 29/0, NO TWO PEOPLE ALIKE 23/0, THE SHEETS ARE PACKED 4/0, DEMO
  BUILD 25/0, TRENCHCOAT 12/0. EVERYBODY IDLES --quick 35/3 and THE FACE IS HIS OWN FACE 17/1 carry the same reds on clean main (enemies,
  bosses and beasts with no idles yet; three beasts' colours; two caravans men and an anarchist a few pixels off their map stills; a trades
  man at the Nellis board), none of them a company man. VOTE TAB 61/5, HANDOFF 10/0, ATTEMPT 15/0 on the ship's tree; the vote tab's
  five reds (other lanes' cards' whys and stage, the alpha's landing on VOTE, the gear's VOTE) are the same on clean main (2d0ece0cb).
  The gates and the phone shots were run once more on the final tree after main moved under it (BUILD 11/11i).
- ON HIS PHONE (tools/bohemia_character_the_company_dressed_shots.js: the demo started his way with THE BLOCK WATCH, upright 390 x 844 and
  on its side 844 x 390, before on main and after on this build): upright and on its side alike, the town with 11 of his men in it, the hall
  (its hires, town_9 first both ways; the list depends on the town the start deals), the crew screen (12), the map (his party of 12, the town left by the
  phone's LEAVE), a road fight off the town (YOU and all eleven on his side, the camera on them); 0 page errors, before and after, both
  ways (records/target/character/the_company_dressed/before/ and after/, shots.json; the sheet CHARACTER_THE_COMPANY_DRESSED_PHONE.jpg).
  The default start (newcrew) upright on this build: the crew screen (3), the fight (YOU, town_0, town_1), 0 page errors. Upright, the
  start once landed with the crew screen up over the town (the tool now shoots it as the crew screen and closes it with its DONE).

## THE HIRES (rule 427(b)'s 'then the hires'): NOT IN THIS SHIP, READY TO RUN
The hall deals men with a fight sheet who are not in the company and not women: 40 gang men (the 14 rare men wear their own).
Measured the same way: 6 wear 2 layers (anarchists_2, colorful_0, homeless_0, reds_0, reds_1, remnants_0), 12 wear 3, the rest 4
or more; anarchists_2 and remnants_0 are among the hall's first faces in the start town. Their outfits are written and dry-run
through THE OUTFIT (every one to 4 layers, no blue ramp, his gang's colour kept: the Reds red, the Colorful teal, the Remnants
olive): anarchists_2 a leather wrap coat over a bone tank, column pant-boots, soot hand wraps and an oxblood hip sash; colorful_0 a
salvage satchel and oxblood bracers over his tank and patina flannel; homeless_0 a work jacket over a bone henley, the mantle, soot
hand wraps; reds_0 a bone vest over the signal red shirt, soot cargos, oxblood boots, leather gloves and a shell bandolier; reds_1
the leather half apron over a striped tee, oxblood bracers, leather gloves; remnants_0 a quilted vest over his coveralls, the bone
scarf and a scrap pauldron. A man costs about 60 to 75 minutes through the pipe on this box's 4 cores (three at a time), so the six
are the next ship, then the twelve at 3 layers. The remake script only runs the sets a man is already in (none of the six is in
rig_town; colorful_0 and remnants_0 are not in rig_melee), so nobody is added anywhere.
