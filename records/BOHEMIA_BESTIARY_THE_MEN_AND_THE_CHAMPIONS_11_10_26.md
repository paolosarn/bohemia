# BESTIARY: FIVE NEW ENEMY TYPES IN THEIR OWN CLOTHES, CHAMPIONS ARE RARE NAMED MEN, THE FLOCK WAITS FOR ITS CLOTHES -- 11/10/26
# The coordinator's routine 'BESTIARY: enemy types and factions' (rule 443(d), rule 441). Main 0f4592d0. BUILD 11/10n FIVE NEW MEN, NAMED CHAMPIONS.
# Follows records/BOHEMIA_BESTIARY_THE_FLOOR_FILED_11_10_26.md (the floor's counts filed: 12 factions on file, 8 fought; 49 of 75 types fought).

## 1. THE COUNT, BEFORE AND AFTER (gates/the_bestiary_floor_gate.py, every number read from the data the game reads)
| floor (his, 9/29) | before this round | after |
|---|---|---|
| 12 factions | 12 on file, the fight fields 8 | 12 on file, 8 fought (the flock built and waiting for its clothes) |
| about 75 types | 159 in the roster, 49 the fight fields | 164 in the roster, 54 the fight fields (F2 ratchet 54) |
| 17 beasts | 17 lab-made, 22 fielded | the same |
| 3 bosses | 6 staged | the same |
| champions | 3 kinds dealt, never named (u.champion always false) | 3 kinds dealt, each a named man with a title; one per band at most; none before the late phase |

## 2. THE FIVE NEW MEN (records/target/bb/bohemia_enemies.json rows, added_by BESTIARY; every word a draft for WORDS, every number for TUNING)
Reuse first (rule 443(d): 'CHARACTER owns garments: reuse dressed people first'): each rides on enemy sheets CHARACTER already made, and each
pool was SPLIT so no two types share a sheet. Each fights its own way, a Battle Brothers archetype's lesson in a Bohemia skin:
| type | party | rides (wiki) | brain (its BB lesson) | his gear | his clothes | measured, live rules (10 fights, a crew of 6) |
|---|---|---|---|---|---|---|
| Bowman | the block watch | militia_marksman | volley: the militia's archers behind its spears | Short Bow | enemy_watch_neighbor_4, 5 | 164 shots from range, 3 up close; crew wins 10/10 |
| Slinger | the water people | nomad_slinger | volley: the skirmisher who shoots from behind | Nomad Sling | enemy_water_cutter_2, 3 | 40 from range, 0 up close; 10/10 |
| Reaver | the keepers | barbarian_reaver | raider: goes for the man his friends hold | Two-Handed Spiked Mace / Skull Hammer | enemy_keeper_thrall_2 | 54 blows; 8/10 |
| Caller | the keepers | barbarian_drummer | rallier: Rally the Troops, he calls back the wavering | Antler Cleaver / Claw Club | enemy_keeper_thrall_3 | 52 blows; 10/10 |
| House Sergeant | the House | sergeant | rallier: Rally the Troops behind the shield wall | Arming Sword / Warhammer... | enemy_house_shield_2 | 46 blows; 9/10 |
The first cut handed the bowman and the slinger their wiki gear whole, and the fight's gear pick (a volley brain is not 'backline') gave them a
bludgeon and a stick: their cards said they shoot and they did not. Each row now names its own gear; the gate's F10 refuses a volley brain that
does not shoot from range. The keepers' drummer is the CALLER: no drum is drawn on him, so the words say only what the picture shows.
The House sergeant was first the House's head (every band of two or more): a crew of 3 then beat a first House band 1 in 10. He is now in the
House's middle and late mix (weight 1 beside 3 shields): a crew of 3 beats a middle House band 7 in 10, a crew of 6 9 in 10.
Where each is met: the watch's early phase on (bowman 1 to 3 neighbors); the water people's early phase on; the reaver early, the caller middle;
the sergeant middle and late (ours.json's phases: early from day 8, middle from 20, late from 60).

## 3. CHAMPIONS ARE RARE NAMED MEN (slices/BOHEMIA_FIGHT.html __CHAMPIONS_ARE_NAMED_MEN__; the data: bohemia_enemies.json 'champions')
Battle Brothers: a champion is a named man, the band's toughest. The fight already dealt three champion kinds from the late mixes (TUNING's and
COMBAT's ours.json: the road crew's leader, the kids' skirmisher, the heavies' warrior) but never named one, so u.champion was always false and
the kill cam's HELD BREATH never played for a champion (COMBAT, filed last round). NOW: a band dealt one carries him under a name and title from
the data (the road crew's champion: El Tuerto, La Navaja, Diablo Ray, Big Chuy, Mama Loca, El Quemado; the kids': Lil Smoke, Chispa, Raton,
Little Saint, Flaco Jr; the heavies': The Fridge, El Tanque, Big Iron, Dona Concreto, Bulldozer; drafts for WORDS). His name is on every line he
is in, his title on his card when a finger is held on him, a flash on him when he first shows and one line in the fight's recap ('BIG CHUY,
the road crew's champion, is with them.'; rule 67: no combat log on the screen),
and his fall is HELD BREATH when the kill cams are on. His numbers are his champion row's own; nothing new is rolled but his name.
RARE: none before the late phase (0 in 100 bands at day 40, each faction); a band carries ONE at most (the deal draws no second champion kind
once one is out; before, a late band of 8 kids carried up to 4). How often a late band carries one is TUNING's (the mix weights): late bands of
12: the road crew 44 in 100, the heavies 61, the kids 73 -> TUNING (the routine's word is 'rare'; the weights are theirs).

## 4. THE FLOCK, BUILT AND WAITING FOR ITS CLOTHES (the 9th faction; bohemia_enemies.json 'waiting')
factions.json's 'The flock' (Battle Brothers' cultists: 'they do not run') had no party. It is built: its faction card, its type (the Faithful:
the wiki's cultist, never wavers, the berserker's rush), its make-up, its sizing (0.8 of the company's count: a new crew of 3 beats it 8 in 10,
of 6 10 in 10; at 1.2 a crew of 3 won 1 in 10), its road (0.2, 0.35, 0.5 by act) and its ground (the trailer park). IT IS NOT IN THE FIGHT:
the first cut dressed it in person_town_2..11, and those are HIS COMPANY (ours.people_looks.crew; CHARACTER's 11/10 block). Every dressed look
left is someone else's: person_woman_0..3 his followers (retinue.json), faction_homeless/caravans/volunteers the bosses' crews
(boss_act_one.json), person_rare_* the rare hires, cast_* the cast. Rule 441: no stand-in art where finished art is owed, so it waits, like the
bison waited for room. ROUTED: CHARACTER, handoffs/CHARACTER.md (the flock first, then the hired guns 6, the head takers 2, the eye in the sky 9:
18 types and the last 4 factions, 72 of 75; COMBAT's old order's machines are the rest).

## 5. THE GATE HOLDS THE COUNTS (THE BESTIARY FLOOR, gates/the_bestiary_floor_gate.py + gates/the_bestiary_floor_men.js + the page half)
F1 now ratchets the factions the fight fields (8, never down) and names the ones it does not (mercenaries, bounty_hunters, city_states,
cultists). F2's ratchet: 54. F7 CHAMPIONS ARE RARE NAMED MEN: every champion kind dealt has a title and 3+ names; on the live rules a dealt
champion is named from his list, two never share a name, none before the late phase, never two in a band. F10 THE NEW MEN: each BESTIARY type
rides a wiki row with both lessons, wears clothes no other pool holds, is dealt by its party, is armed from its own gear and strikes its own way
(a volley brain from range), and a crew of 6 beats its party 6 in 10; a waiting row carries no looks. F9 (the phone, upright and sideways) adds
each new type through the one door (fielded in its own clothes, the sheet loads, named, armed, the fight's words, the win home) and a late road
crew until one carries a champion (named from his list, his title on his card). PLANTED, all caught: a new man in another's clothes (the
bowman in the neighbor's), a new man no party deals, a champion with no name (plus the five beast plants).

## 6. ROUTED
- CHARACTER: the clothes (section 4; handoffs/CHARACTER.md).
- TUNING: the champion rate (section 3); every new row's numbers (hp, gear, weights) are drafts beside their kin.
- COMBAT: the old order's machines (15 types, 0 fielded) close the last of 75 after CHARACTER's 18; the gear pick gives a volley brain a melee
  weapon when its wiki gear holds one (wantRanged reads only 'backline'): the new rows name their gear, the old house_crossbow gets its
  crossbow only because its knife and dagger are pistols.
- WORDS: every name, title, lesson and the champion's line.
[bb Battle Brothers' champions are named men, the band's toughest, rarer early and common late; ours carry a name and a title from the data.]
[analog horror: the champion's name comes up once, in the lower third, the way a caption names a man on a tape nobody should have kept.]
