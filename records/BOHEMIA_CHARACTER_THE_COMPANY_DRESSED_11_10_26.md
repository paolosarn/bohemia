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
@@TABLE@@

Every man now wears four or more layers on his body (mean 4.1; the company's eleven were 2.8 before), leather on ten of twelve
(a jacket, a vest, a work coat, an oxblood jacket, belts, gloves, bracers, trousers, a satchel, a bandolier), and no piece whose ramp
reads blue. The same faces, haircuts, builds, beards and marks: the roll's face, hair and skin fields were not touched. No trench
added (town_0 kept the dust brown trench he wore). The melee pass now also draws each of the twelve's 'b' sheet (BIdle, BShot), as
ANIMATION's melee_in_hand makes it today for any man it re-makes.

## THE PIPE (each owner's own one-man command, unedited; the packers merge)
Per man (tools/bohemia_character_the_company_dressed_remake.sh): RUN TWO make (the barber's build, the street stills, walk,
portrait and four mouths), RUN TWO fight-make (COMBAT's poses, the six fight clips), ANIMATION everybody_idles person_one (bare,
carry, work), the_towns_activities person_one (the twenty town clips, only for a man already in rig_town: town_9 is not),
what_a_man_holds person_one (the held clips), melee_in_hand person (only for a man already in rig_melee). Then the packs: RUN TWO
fight-pack, walk-sheets, bake (the map's sheets), index; everybody_idles people_pack and work_sheets; the towns', holds' and
melee's packs; the fight's packed atlases (tools/bohemia_run_the_sheets_packed.py).
TWO TRAPS ON THE WAY (both fixed by deleting, not by editing anyone's tool): RUN TWO's make and every ANIMATION person_one reuse
records/character/rig/barber_person_<id>.glb when it is on the box, and person_done() skips a man whose render folder holds
made.txt; so a roll edit after a stopped run renders the OLD clothes. The remake script's header says so. And two runs of one man
at once collide (a shared posed model, a moved portrait): town_0 ran twice by a waiter's mistake and was made a third time alone.

## PROOF
@@PROOF@@

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
