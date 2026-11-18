# CHARACTER 11/18: THE HIRED GUNS IN THEIR OWN CLOTHES (rule 453, round after round; BESTIARY's stand-in list)

The coordinator's routine 11/18 (rule 453): 'Take the next batch on your own list, one build each: whoever he still meets in a stand-in
(BESTIARY's newest types, the fifteen bosses' own men, the people at the newest places). Every sheet lands light. Rule 441.' BESTIARY's
note on this lane's board (11/17, build 3 of its sweep): WHO WEARS A STAND-IN NOW: the hired gun (faction_caravans), the duelist
(faction_mob), the head taker (faction_volunteers), the casino gunner (faction_reds), the spotter (faction_network), the preacher
(faction_church). The hired guns are two of the six and one faction: this build (BUILD 11/18l). MADE FROM the nine enemies' recipe he passed (VOTE
character-the-nine-enemies-their-own-clothes-11-7, YES 11/8).

## WHAT THEY WEAR
Battle Brothers' mercenaries are a rival company in its own kit (bb_all/1258_Mercenary.txt, BESTIARY's row: 'they fight like your own
company: a held line'); roster.json's family for them: 'OTHER COMPANIES like yours, the rival crew with a runway look'. BESTIARY's note
for the duelist: 'a paid blade's good coat, a feathered hat: BB's swordmaster'.
| man | his coat and his hat | under it | the rest | the mark |
|---|---|---|---|---|
| hired gun 0 (brown, razor skull) | a QUILTED VEST (the gambeson), a scrap helm | a charcoal turtleneck | a scrap pauldron, leather gloves, a leather stack pant, tall moto boots | the company's sash |
| hired gun 1 (tan, temple taper) | a LEATHER JACKET, a dust work cap | a bone henley | worn bracers, leather gloves, a leather belt, soot cargos, field boots | the company's sash |
| hired gun 2 (bronze, razor skull) | a KHAKI JACKET, a scrap helm | a faded black longsleeve | oxblood bracers, soot gloves, black cargos, leather stack boots | the company's sash |
| duelist 0 (chalk, temple taper) | an OXBLOOD JACKET, the GAMBLER'S HAT in black felt, a pheasant's barred feather | a bone button-up | a bone shoulder drape, leather gloves, a leather belt, drop-rise trousers, tall moto boots | the hat band |
| duelist 1 (porcelain, deep taper) | a LEATHER SPLIT-TAIL COAT to the knee, the GAMBLER'S HAT in dust felt, a crow's feather | a bone turtleneck (THE OUTFIT's swap: a charcoal one read as one with the coat, 52 and 69 of 255) | oxblood bracers, leather gloves, a leather stack pant, leather stack boots | the hat band |
THE MARK: one thing on every one of them, the company's colour, so a band reads as one company across a fight: a sash from the left
shoulder to the right hip, knotted, on the three company men (the Watch captain's sash, its colour now a type's own), the hat band on the
two duelists. Its colour is the hired guns' own banner ink (records/target/bb/factions.json mercenaries #6e7dff, a value down and dusted
to (84, 92, 150)): COLOUR IS TERRITORY, the one blue on them, on purpose (strict blue 2 to 9 in 100 on the company men is the sash; the
duelists 0.3 to 1.9, the band). Nothing else blue: the first duelist's ash one-shoulder drape read grey-blue (cool 18 in 100) and is a
bone drape; his cool pixels 5.5 to 8.7 in 100. The first roll named a gorget for hired guns 0 and 2: the build wears one piece a slot and
a gorget is 'gear' like the pauldron and the bracers they also wear, so the gorgets were never on them; they are off the roll and the
type (the renders the same).

THE GAMBLER'S HAT (new, in the tool's head pieces beside the kettle and the coif): a felt crown that rounds in at the shoulder and closes
on a crease 1.6 cm down, a flat brim 5.4 cm at the front (so the game's camera sees his face, the kettle's loop 1) and 6.6 at the sides,
turned up a little there, a band 2.6 cm, a feather tucked in it on his left, 25 cm, a plume with a body (5.5 by 3 cm). Three loops:
(1) the straight wall to a flat top with an open ring read as a bucket with a hole in it, and a flat ribbon feather was a one-pixel aerial;
(2) at half value the top and brim still came out pale grey over a black wall; (3) the master rig dusts every dark up face pale by design
and spares only what its wear_by_material names ('hair' 0.15, DIRECTION's rule for every dark crown that rendered grey): a felt hat is
pressed rabbit fur, so its felt's material is named for it, and the black hat reads black from above.

## THE PIPE (tools/bohemia_character_the_nine_enemies.py, the 11/7 tool)
- TYPES['Hired Gun'] (3 men, row hired_gun, stand-in stream Caravans, cell faction_caravans and its guns) and TYPES['Duelist'] (2, row
  hired_duelist, stream Mob, cell faction_mob); the sash's colour a type's own (TYPES[t]['sash'], the Watch's green by default); the
  gambler's hat (GAMBLER, NEW_HATS).
- roll-more for each (the roll gained the five men's lines, nothing else moved), look (8 stills each, the bar beside them), make (the
  street pass, the fight pass), pack.
- THE PACK ENDS A STAND-IN: BESTIARY fielded these two rows in faction looks with a 'looks_stand_in' note ('until this type has its own
  clothes'); the pack writes the row's own men as its looks, keeps the stand-in in 'looks_borrowed' for the record (as the nine's rows do),
  and drops the note. Only those two rows' looks lines changed in records/target/bb/bohemia_enemies.json.

## PROOF
- ONLY THE FIVE ADDED, NOBODY DROPPED (every index counted on main bf09c1b0c and on this tree after the last pack): the fight's enemy
  looks 50 -> 55, its faces 163 -> 168, the packed atlases 214 -> 219; every other count the same (crew 13, faction 13, tier 2, beast 23,
  person 69, robot 1, boss 15; the idles 256, the map's people 154, the town's 16, the held clips 100, the melee 62, the map's mix 18
  sheets and 156 men, the walk sheets 134). The thirty-three earlier nine-enemies men were packed again on this box and their sheets
  came out byte-identical (no file of theirs changed). The face strip keeps its tiles in their places and adds five; it keeps its place
  among the strips (faces_bosses.webp after it, BOSSES'): this round's first pack had moved it behind, caught in the diff, the pack
  fixed. In records/target/bb/bohemia_enemies.json only the hired_gun and hired_duelist lines changed (looks, looks_borrowed, the
  stand-in note dropped).
- THE WEIGHT: the publish list on a clean checkout, 857.1 MB in 14,056 files against main's 854.3 MB in 14,041 (five fight sheets of
  271 to 304 KB, their packed atlases, the face strip 80 -> 93 KB); the card lossless WebP, 136 and 37 KB; the street pass and the
  phone shots in records/character/, never served (PLUMBER 8's rule 1).
- GATES on this tree: THE BESTIARY FLOOR --no-browser 12/0, THE SHEETS ARE PACKED 4/0, DEMO BUILD 25/0, TRENCHCOAT 12/0, THE PACKERS
  MERGE 4/0, THE FACE IS HIS OWN FACE 18/0, NO TWO PEOPLE ALIKE 23/0 (22/1 once while the phone run shared the box: 'the board fetched
  each rolled man's own sheet', 2; alone 23/0, and clean main 23/0), HANDOFF 10/0, ATTEMPT 15/0. EVERYBODY IDLES --quick 35/3 is clean
  main's three reds (P1 enemies, bosses and the robot with no idles yet, ANIMATION's, now naming these five too; C3 three beasts; R5
  three rolled men). VOTE TAB 61/5 on the card's tree, the five reds clean main carries the same (other lanes' card whys: two of DYNASTY's, PLUMBER 8's, COOK FIVE's; PLUMBER 8's card with no stage; the alpha's landing on VOTE; the gear's VOTE); this card's why and mark checked with the gate's own split (2 sentences, the second says where you see it; stage made_from).
- ON HIS PHONE (gates/the_bestiary_floor_fight.js, BESTIARY's own walk of a type through the one door every encounter uses, with
  ONLY_TYPES=hired_gun,hired_duelist and its SHOTS; before on main c869a5eda, after on this build): the demo and the
  alpha, upright 390 x 844 and on its side: BEFORE, the hired gun fielded in faction_caravans and the duelist in faction_mob (the
  one-piece grey coat and white cap, the striped knit); NOW each fielded in his own sheet (enemy_hired_gun_0..2, enemy_hired_duelist_0..1:
  'own' and 'drawn' true), named HIRED GUN and DUELIST, armed with his row's gear, the fight's words 'The hired guns', the duelist's
  on-guard and riposte seen on AUTO, the win home, 0 page errors, all four. The alpha on its side did not open the duelist's fight on
  the full run's single try; run alone it opened on the second, both duelists fielded. Seen honestly: at the fight's zoom a band reads
  as colour (leather, khaki and a helm where a grey coat and a white cap were; the sash a thin blue-violet line from the side); the
  detail is on the card. Shots: records/character/the_hired_guns/.

## NEXT
- The head taker (faction_volunteers: mail and a hunter's coat), the casino gunner (faction_reds: a security vest and a gunner's hat), the
  spotter (faction_network: casino security, a vest, a radio, an earpiece), the preacher (faction_church: the flock's robe with a stole and
  a staff): the same tool, one build each, about 1 MB a man on the site.
- The bosses' crews in their own trades, once BOSSES gives each boss a looks list (records/target/bb/boss_act_one.json).
- The thirteen 'faction_*' one-piece looks (six pipelines); nine hall men at three layers, homeless_1, mob_2 (in place, no weight).
