# CHARACTER 11/17: THE FLOCK IN ITS OWN CLOTHES (rule 453; BESTIARY's list, 'the Flock first')

The coordinator's routine 11/17 (rule 453, Paolo: 'do a full sweep, let's have some fun, lotta tokens this week'): 'whoever he still
meets in a stand-in or the old flat blue: BESTIARY's newest enemy types (read its list) ... every sheet lands light'. BESTIARY's floor
(handoffs/BESTIARY.md 11/14) is short four factions, 'no clothes exist': the hired guns, the head takers, THE FLOCK, the eye in the
sky; 16 types wait. The flock is first on its list and the only one BUILT AND WAITING (records/target/bb/bohemia_enemies.json
'waiting': its faction, its row flock_faithful, its make-up, sizing 0.8, its road by act and the trailer park it holds). MADE FROM the
nine enemies' recipe he passed (VOTE character-the-nine-enemies-their-own-clothes-11-7, YES 11/8).

## WHAT THEY WEAR
Battle Brothers' cultist wears a leather robe and a hood (Cultist Leather Robe, Monk's Robe, Cultist Hood; BESTIARY's note). Ours are
the trailer park's congregation in what they wear to its meetings: a robe or a hood made from what a trailer park owns, over their own
house clothes, and one thing they all share, a charcoal cowl, so a band of them reads as one congregation across a fight.
| man | his robe and hood | under it | the rest | layers |
|---|---|---|---|---|
| faithful 0 (olive, temple taper) | a HOODED DUST PONCHO, the hood up (the cultist's hood) | a bone button-up | the draped cowl, hand wraps, dust trousers, wrapped boots | 4 |
| faithful 1 (fair, home clippers) | a SAND COCOON COAT to the shin (the robe), a bone head wrap | a bone henley | the draped cowl, a bone shoulder drape, a leather belt as a cord, brick crop trousers, ranch boots | 5 |
| faithful 2 (olive, home clippers) | a LEATHER WRAP COAT (the leather robe), a soot head wrap | a bone tank | the draped cowl, oxblood bracers, a charcoal wrap skirt, sandwalkers | 4 |
No new garment and no new piece: every one is in the wardrobe already (the hooded dust poncho, the sand cocoon coat, the leather wrap
coat, the draped cowl, the head wraps, the charcoal wrap skirt). THE OUTFIT's own swaps (a top that reads as one with the coat over it
takes a lighter colour of the same cut): the rust henley under the sand robe is a bone henley, the soot tank under the leather robe a
bone tank. Their skin, cut and face are rolled from the Homeless' stream (people nobody counts); their fight cell is the Homeless' (its
guns and its knife sit in their hands). Strict blue 0 in 100 on all three; cool pixels 0.0 to 4.4 in 100 (the charcoal cowl and skirt,
warm neutrals on their ramps).

## THE PIPE (tools/bohemia_character_the_nine_enemies.py, the 11/7 tool, three changes written where they were made)
- TYPES['Flock Faithful'] (3 men, row flock_faithful, faction flock, stand-in Homeless, cell faction_homeless).
- roll-more <type>: one type rolled the way roll() rolls it and APPENDED to the roll; the thirty shipped men's lines never move
  (the roll file gained 134 lines, nothing else changed).
- THE PACK KEEPS WHAT IT DID NOT MAKE: it used to delete every nine-enemies look from the fight's index and add back only the men whose
  fight renders are on the box (they are .gitignore'd), so on a fresh box it would have dropped all thirty; now it replaces only the men
  made here, the face strip holds every man whose sheet is on the fight, and a type whose row waits (BESTIARY's 'waiting') gets no
  looks line (BESTIARY's floor gate refuses looks on a waiting row): the pack prints WAITING with the men's looks for BESTIARY.
- AND IT NEVER RE-POINTS A ROW THAT ALREADY WEARS ITS MEN: this round's first pack wrote each type's whole pool back into its row in
  bohemia_enemies.json, which undid BESTIARY's splits of 11/10 and 11/11 (the House's sergeant and two-hander, the bowman, the slinger,
  the reaver, the caller, the outlaw and the spearman each took one of these men); caught in the diff before anything was committed,
  the file put back to main's bytes, and the guard written. BESTIARY's file is main's to the byte in this ship.
Then: look (eight stills, the bar beside them), make for the three (the street pass, the fight pass), pack.

## FOR BESTIARY (a NOTE on its board)
The flock's men: enemy_flock_faithful_0, enemy_flock_faithful_1, enemy_flock_faithful_2 (kind 'enemy', set 'nine', each on his own
fight sheet in faction_homeless's cell with its guns, his face on the second strip). Field the flock with these as its row's looks; its
idles and held clips are ANIMATION's (as the thirty's are).

## PROOF
- ONLY THE THREE ADDED, NOBODY DROPPED (every index counted on main and on this tree): the fight's enemy looks 47 -> 50, its faces 157 ->
  160, the packed atlases 207 -> 210; every other count the same (crew 13, faction 13, tier 2, beast 22, person 69, robot 1, boss 9; the
  idles, the map's people, the town's activities, the held clips, the melee, the map's mix, the walk sheets). The thirty shipped enemies'
  looks are byte for byte main's (their sheets re-packed identical); the face strip keeps their thirty tiles in their places and adds
  three. BESTIARY's records/target/bb/bohemia_enemies.json is main's to the byte.
- THE WEIGHT: the publish list on a clean checkout 840.8 MB in 15,061 files against main's 839.0 in 15,052 (three fight sheets of 289 to
  341 KB, their packed atlases, the faces); the card lossless WebP, 76 and 34 KB; the street pass in records/character/, never served.
- GATES: THE BESTIARY FLOOR --no-browser 11/0 (F10: the flock still waits, no looks on its waiting row), THE SHEETS ARE PACKED 4/0, DEMO
  BUILD 25/0, TRENCHCOAT 12/0, THE PACKERS MERGE 4/0; EVERYBODY IDLES --quick 35/3 (P1 now names the three with the thirty: no enemy has
  idles yet, ANIMATION's) and THE FACE IS HIS OWN FACE 17/1 are clean main's reds.
  VOTE TAB 60/5: the why check's whole list is four other lanes' cards (dynasty-flip-at-crisis-10-9, dynasty-animal-era-10-10,
  plumber-8-fewer-freezes-11-10, cook5-the-bosses-map-pieces-11-14), plus plumber-8's stage, the alpha's landing on VOTE and the gear's
  VOTE, as on clean main. Found and fixed: the check reads 'you see it' in the last sentence, and my 11/14 road crews card said 'you see
  them' (hidden last round because the gate lists four names); both of my cards now say 'you see it'. HANDOFF 10/0, ATTEMPT 15/0, on the
  card's tree (BUILD 11/17e).
- ON HIS PHONE: not in a fight yet, honestly: the flock is dealt by no party until BESTIARY fields it, so this ship shows on the VOTE card
  (the tab's own image check passes it) and on the fight sheet the fight will draw them from.

## NEXT
- BESTIARY fields the flock (its row, its party, its road: all waiting), then the fight deals these three.
- The other three factions with no clothes, in BESTIARY's order: the hired guns (6 types: mercenary, marksman, hedge knight, swordmaster,
  master archer, and the rest of its list), the head takers (2), the eye in the sky (9: mostly machines, robot art). Each a TYPES entry in
  the same tool, rolled with roll-more, made and packed the same way; about 1 MB a man on the published site (the fight sheet and its
  packed atlas), the site at 838 MB of 900.
- The bosses' crews: every boss's crew is made of the road gangs' types (thugs, raiders, marksmen, militia, caravan guards), so they
  wear the city's gangs; a crew of its boss's own trade (line cooks, stokers, riggers, keymen) needs a looks list per boss on BOSSES'
  side first (records/target/bb/boss_act_one.json), then the men from this tool.
- The thirteen 'faction_*' looks (the old one-piece tunics of 10/18, in the road gangs' first slot, the bosses' crews, the town and the
  feed): built from this lane's gang looks through COMBAT's bodies and render, PORTRAIT's faces and ANIMATION's sets; six pipelines.
- Nine hall men still at three layers (blues_2, caravans_1, colorful_1, network_1, network_2, reds_2, remnants_2, trades_1,
  volunteers_2), homeless_1 and mob_2 (blue pieces): the road crews' way, in place, no weight.
