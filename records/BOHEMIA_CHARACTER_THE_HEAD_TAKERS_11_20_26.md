# CHARACTER 11/20: THE HEAD TAKERS IN THEIR OWN CLOTHES (rule 461, the whole enchilada; row 286; BESTIARY's stand-in list)

The coordinator's routine 11/20 (rule 461, Paolo: 'full sweep, whole enchilada, dont forget nothing'): 'take your handoff's next job,
bugs he can feel first, then more people and clothes (the runway)'. No row he can feel is open on this lane (528 FIXED by FIXES 11/9;
633, who DESI is, waits on his word and nothing of DESI is touched). The handoff's next job is row 286's: BESTIARY's types still in a
stand-in. Its note of 11/18 lists nine: the hired gun and the duelist (dressed 11/18, BUILD 11/18l), the grenadier, the head taker, the
smoker, the darter, the casino gunner, the spotter, the preacher. The head takers are three of them and one faction:
this build (BUILD 11/20g). MADE FROM the nine enemies' recipe he passed (VOTE character-the-nine-enemies-their-own-clothes-11-7, YES 11/8).

## WHAT THEY WEAR
Battle Brothers' bounty hunters (bb_all/0271_Bounty Hunter Marksman.txt's company; BESTIARY's rows: the head taker 'mail and a hunter's
coat', the smoker 'a hood and a satchel of pots' after the Assassin's smoke pots, the darter 'a hunter's coat, a light crossbow'). Ours
hunt men the way men hunt deer.
| man | his coat | under it | the rest | the mark |
|---|---|---|---|---|
| head taker 0 (tan, razor skull) | a RUST WORK COAT, a SOOT CHEST PLATE strapped over it | a bone turtleneck (THE OUTFIT's swap: a charcoal one read as one with the coat, 52 and 79 of 255) | leather gloves, a leather stack pant, tall moto boots | the blaze scarf |
| head taker 1 (fair, razor skull) | a CHORE COAT, a dust work cap | a bone henley | a shell bandolier, soot gloves, a leather belt, soot cargos, leather stack boots | the blaze scarf |
| head taker 2 (bronze, temple taper) | an oxblood DRIFTER'S COAT, a SCRAP CHEST PLATE over it, a khaki slouch beanie | a faded black longsleeve (THE OUTFIT: it reads as one with the oxblood coat and that cut has no lighter colour; the plate and the scarf part them) | leather gloves, dust trousers, field boots | the blaze scarf |
| smoker 0 (tan, home clippers) | an OXBLOOD PONCHO, a soot head wrap, a CHARCOAL DUST MASK | a bone turtleneck | a salvage satchel (his pots), soot hand wraps, charcoal crop trousers, wrapped boots | the blaze scarf |
| smoker 1 (onyx, temple taper) | a HOODED DUST PONCHO, a BONE DUST MASK | a rust henley | an oxblood satchel (his pots), hand wraps, dust brown trousers, sandwalkers | the blaze scarf |
| darter 0 (tan, grease back) | a charcoal CAR COAT, a dust work cap | a bone henley | a RUST QUIVER of bolts on his back, leather gloves, dust trousers, field boots | the blaze scarf |
| darter 1 (brown, dry taper) | a BARN COAT, a khaki slouch beanie | a faded black longsleeve | a SCRAP QUIVER on his back, oxblood bracers, khaki cargos, ranch boots | the blaze scarf |
THE MARK: a BLAZE SCARF on all seven, the gear's own scarf cut (SAGE SCARF's) in the head takers' banner ink (factions.json
bounty_hunters #aacd32, a value down and dusted: dk 84,100,36 / mid 128,150,56 / lt 166,188,92), registered in memory by the tool the
way its HI-VIS VEST is: what a hunter wears so his own side does not shoot him, and a band of them reads as one hunt across a fight.
Strict blue 0 in 100 on all seven; cool pixels 0 to 3.0 in 100. One loop: the first darter's sage field coat came out mint and the blaze
was lost on it; a charcoal car coat (the roll and the type changed before his make).

## THE PIPE (tools/bohemia_character_the_nine_enemies.py)
- TYPES['Head Taker'] (3, row head_taker), ['Smoker'] (2, row taker_smoker), ['Darter'] (2, row taker_darter); stream Volunteers, cell
  faction_volunteers (its guns) for all three; BLAZE and the BLAZE SCARF in register_garments.
- roll-more for each, look (8 stills each, the bar beside them), make, pack. The pack writes the three rows' looks (looks_borrowed keeps
  faction_volunteers, person_volunteers_1, person_volunteers_2) and drops their stand-in notes, as for the hired guns.

## PROOF
- ONLY THE SEVEN ADDED, NOBODY DROPPED (every index counted on main 3d51b37e2 and on this tree after the last pack): the fight's enemy
  looks 55 -> 62, its faces 171 -> 178, the packed atlases 222 -> 229; every other count the same (crew 13, faction 13, tier 2, beast 23,
  person 69, robot 1, boss 18; the idles, the map's people, the town's, the held clips, the melee, the map's mix, the walk sheets). The
  thirty-eight earlier nine-enemies men were packed again on this box and came out byte-identical. In records/target/bb/bohemia_enemies.json
  only the head_taker, taker_smoker and taker_darter lines changed (looks, looks_borrowed, the stand-in note dropped).
- THE WEIGHT: the publish list on a clean checkout, 868.5 MB in 14,238 files against main's 864.4 MB in 14,217 (seven fight sheets of
  271 to 350 KB, their packed atlases, the face strip); the card lossless WebP, 203 and 42 KB; the street pass and the phone shots in
  records/character/, never served.
- GATES on this tree: THE BESTIARY FLOOR --no-browser 13/0, THE SHEETS ARE PACKED 4/0, DEMO BUILD 25/0, TRENCHCOAT 12/0, THE PACKERS
  MERGE 4/0, THE FACE IS HIS OWN FACE 18/0, HANDOFF 10/0, ATTEMPT 15/0. Main's reds, the same on clean main 3d51b37e2: EVERYBODY IDLES
  --quick 35/3 (P1 the enemies with no idles yet, ANIMATION's, now naming these seven too; C3; R5) and NO TWO PEOPLE ALIKE 22/1 ('every
  file loads': slices/fight_ground/stadium/stadium_art.json, COMBAT THREE's stadium of 11/18, whose art COOK FIVE has not put in yet).
  VOTE TAB 61/5 on the card's tree, the five reds clean main carries (other lanes' card whys: two of DYNASTY's, PLUMBER 8's, COOK FIVE's; PLUMBER 8's card with no stage; the alpha's landing on VOTE; the gear's VOTE); this card's why and mark checked with the gate's own split (2 sentences, the second says where you see it; stage made_from).
- ON HIS PHONE (gates/the_bestiary_floor_fight.js with ONLY_TYPES=head_taker,taker_smoker,taker_darter and its SHOTS; before on main
  64ab8c777, after on this build): the demo and the alpha, upright 390 x 844 and on its side: BEFORE the head taker fielded in
  faction_volunteers, the smoker in person_volunteers_1, the darter in person_volunteers_2; NOW each in his own sheet ('own' and 'drawn'
  true), named, armed with his row's gear (spetums, billhooks, warbrands, the light crossbow), the fight's words naming the head takers,
  the smoker's smoke and the darter's sleep seen on AUTO, the win home, 0 page errors, all four on the first try. The darter's party deals
  one darter and the page dealt enemy_taker_darter_1 every time; darter 0 is on the fight sheet and the card, not yet seen in a fight.
  Shots: records/character/the_head_takers/.

## NEXT
- The rest of BESTIARY's stand-ins, one build each: the grenadier (the hired guns' third: a company jacket, bottles in a bandolier,
  their sash), the casino gunner and the spotter (the eye in the sky: a security vest and a gunner's hat; a vest, a radio, an earpiece),
  the preacher (the flock: its robe with a stole and a staff, its cowl).
- The bosses' crews in their own trades, once BOSSES gives each boss a looks list; the thirteen 'faction_*' tunics; nine hall men at
  three layers, homeless_1, mob_2.
