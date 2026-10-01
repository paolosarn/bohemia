# THE BATTLE BROTHERS TRANSLATION TABLE (coordinator 9/29/26; Paolo: 'the perks need to be translated, everything needs to be translated')
# One row per Battle Brothers system. TRANSLATION = mechanic kept, our skin. OWNER = the lane whose row carries it.
# STATUS: DONE (shipped on the alpha) / IN HAND (a live row) / RESEARCHED (a page, no build) / NOT STARTED.
# The library (reference/library/battle_brothers/) is the source of what each system IS; this table is what it BECOMES.
# EYES [translation count] reads this table every round; a NOT STARTED older than two rounds or a row with no owner is red.

## THE CAMPAIGN LAYER
| BB system | Bohemia translation | Owner | Status |
|---|---|---|---|
| The world map, tap to travel, the clock | The valley map, the party marker, the clock (33) | RUN [bb map] | IN HAND |
| Travel speed (pause, 1x, fast) | The speed pad: pause 1x 2x 3x 5x (44a) | UI [speed pad] | IN HAND |
| Day and night on the map | The valley's day and night; night fights (existing) | WORLD | DONE (map) |
| Settlements (village, town, city, castle) | Places as settlement screens (37b); the fourteen parts; home bases (37e) | RUN [settlement screen], FACTIONS [home bases] | IN HAND |
| Settlement services (market, armourer, weaponsmith, tavern, temple, kennel, taxidermist, training hall, barber) | Buildings you tap: the shop, the armourer, the bar (hiring), the clinic, the kennel (keepers), the trophy buyer, the training ground (respec), the barber (37i) | RUN, UI [market screen], PEOPLE [recruit at the place], CHARACTER [barber], TUNING [respec] | IN HAND |
| Attached locations (farms, mines, mills) that feed a town | A settlement's pumps, sheds, solar, lots; what a held lot produces (40b) | LIFE+CITY [build a lot], WORLD [bb places] | IN HAND |
| Settlement situations (raided, drought, well supplied) | A place's state from the ledgers (raided falls, helped rises; 37c) | WORLD [bb places], FACTIONS | IN HAND |
| The noble houses (3) and their standing | The factions with home bases; standing per faction (existing) | FACTIONS, PEOPLE [weights shape] | DONE (standing) |
| Renown | CLOUT: what the valley knows of your company (deeds, the feed). Paolo 10/1: 'Renown is out, clout' | PEOPLE [weights shape] | DONE, renamed |
| Ambitions | A company goal the player sets, light, with a reward | PEOPLE (from QUESTS' research) | NOT STARTED |
| Contracts (types, skulls, negotiation, the twist) | Asks from a mouth at a place; the haggle; declining is free (35c) | RUN [settlement screen], ECONOMY [contract pay], QUESTS (research) | IN HAND |
| Events on the road | Road events: a face, 2-3 choices (33 s2) | RUN [road events], WORDS, PORTRAIT | IN HAND |
| The late crises (noble war, greenskins, undead) | The three acts and the flip; the factions moving without you (31) | DYNASTY | IN HAND |
| Legendary locations (Kraken, Goblin City, the Monolith) | The landmarks: the Sphere, the Stratosphere, Lake Mead's hippo, the fossil-beds lab, the mammoth herd | WORLD, COMBAT [bestiary] | RESEARCHED |
| Origins (12 starting stories) | Origins: who you were the day the money died (36c, 37) | PEOPLE [origins], TUNING [origins difficulty] | DONE (3 of 4 written) |
| Difficulty (beginner, veteran, expert; ironman) | The sliders: enemy level, enemy gear, your mistake (40a) | TUNING [difficulty sliders] | RESEARCHED |
| Retirement and the ending | Endings by stance toward the Amalgamation (39e) | DYNASTY [the ending] | RESEARCHED |

## THE COMPANY
| BB system | Bohemia translation | Owner | Status |
|---|---|---|---|
| Recruitment at the tavern | Hiring is a building you tap; a stranger gets the worst work | PEOPLE [recruit at the place] | IN HAND |
| Backgrounds (60+) | Backgrounds from the county (former jobs, DONE) plus heirs' backgrounds (39d) | PEOPLE [former jobs], [heirs backgrounds] | DONE / IN HAND |
| Traits (70 hidden, revealed by play) | Traits revealed by play (existing partly) | PEOPLE | IN HAND |
| Star talents, stat rolls | Talents on the sheet; TUNING's rows | TUNING [numbers table] | RESEARCHED |
| Levels 1 to 11, the cap | Levels; past 11 the mastery swap (40e) | TUNING [respec] | RESEARCHED |
| PERKS (about 50 in 7 tiers) | THE PERK TREE TRANSLATED one for one: mechanic kept, our name (a 23-perk tree exists; BB has ~50; the gap is the job) | COMBAT [perks translated], TUNING | NOT STARTED (the row is created today) |
| Weapon masteries | Masteries per weapon class (the guns decided together, 47b) | COMBAT [weapon shapes] | IN HAND |
| Injuries, temporary (30) and permanent (25) | The long injury 30-40 days and the permanent mark (36b) | PEOPLE [long injury] | IN HAND |
| Morale and resolve | Morale in the fight (existing: BB-NERVE-ON), resolve on the sheet | COMBAT | DONE (partly) |
| Fatigue | Fatigue: a turn is a beat, EVERYTHING COSTS ONE; TUNING says how it tires | COMBAT, TUNING | IN HAND |
| Wages and the daily pay | Batteries per man per day; the debt is the first wage (Q49) | ECONOMY [six resources] | IN HAND |
| Food, medicine, tools, ammo | The six resources (47a) | ECONOMY [six resources] | IN HAND |
| The retinue (followers: scout, surgeon, negotiator, blacksmith, drill sergeant) | Followers hired for the company: the mechanic, the medic, the fixer, the handler with a beast (keepers) | PEOPLE [keepers] (+ a followers row) | NOT STARTED (followers) |
| The reserve and the roster (12 on the field, 27 in the company) | 12 an act, the roster screen (UI [roster]); the reserve | UI [roster], TUNING | IN HAND |
| The stash and inventory | The company's stash and gear screen | UI [market screen] | IN HAND |
| Loot, scavenging after a fight | Loot leaves with you (existing); scavenge (37k) | COMBAT, WORLD [scavenge] | DONE |
| Trade goods and prices per town | Prices per place; trade goods; batteries | ECONOMY [prices per place] | IN HAND |
| Taxidermy (beast trophies) | What a beast is worth (hide, ivory, trophies) | ECONOMY [what a beast is worth] | IN HAND |
| Named items (champions' drops) | Named runway pieces from named men | CHARACTER, COMBAT [bestiary] | RESEARCHED |
| Retirement of a man, death, the funeral | Death 10% for veterans, the heir line (39d) | DYNASTY [heirs], PEOPLE | IN HAND |

## THE FIGHT
| BB system | Bohemia translation | Owner | Status |
|---|---|---|---|
| The hex grid | The square grid of house tiles (37f, 38) | COMBAT [house tiles back] | IN HAND |
| Action points and fatigue per turn | A turn is a beat at 120; everything costs one | COMBAT | DONE |
| Initiative and turn order | The beat order (existing) | COMBAT | DONE |
| Hit chance (skill vs defence), armour and HP split | The dial for the important shot; routine hits cost one (23); TUNING's numbers | COMBAT [fight feel], TUNING | IN HAND |
| Shieldwall, spearwall | The line of car doors; the bayonet's spearwall | COMBAT [weapon shapes] | RESEARCHED |
| High ground | The roof (37g); the only terrain effect | COMBAT [house tiles back] | IN HAND |
| Obstacles, blockers, the map per terrain | The generated board (46a), fifteen terrains | COMBAT [board generator], COOK [board assets] | IN HAND |
| Night fights, sight range | Night on the board (existing), the sodium light | COMBAT, DIRECTION | DONE (partly) |
| Weapons by class | The arsenal, decided together (47b) | COMBAT [weapon shapes] | IN HAND |
| Armour, helmets, attachments | Armour by weight, attachments (36c) | CHARACTER [attachments] | IN HAND |
| Throwables and bombs | Molotov, net, smoke, the extinguisher | COMBAT [weapon shapes] | RESEARCHED |
| Formation before the fight | Who stands where (36a) | COMBAT [formation] | IN HAND |
| Gambits / the AI's turn | FF12 gambits: the company acts on its own (36a) | COMBAT [gambits] | IN HAND |
| Retreat and the rout | The rout exists (BB-THE-ROUT); retreat to the map | COMBAT | DONE |
| Enemy factions and rosters | Twelve factions, seventy-five types, the floor (42) | COMBAT [bestiary], FACTIONS, PEOPLE | IN HAND |
| Beasts and their mechanics | The seventeen, mechanic first (42i) | COMBAT [bestiary], WORLD [creatures] | IN HAND |
| Champions | Named men with a unique piece | COMBAT [bestiary] | RESEARCHED |
| The save before the bell | Exists (BB-SAVE-BEFORE-THE-BELL) | COMBAT | DONE |

## THE SCREENS
| BB system | Bohemia translation | Owner | Status |
|---|---|---|---|
| The top bar (money, food, tools, meds, ammo, day) | The HUD's six, one HUD everywhere (47a, 24) | UI [bb interface] | IN HAND |
| The character screen | The company screen, opened from the portrait (44b) | UI [roster], [portrait menu] | IN HAND |
| The world-map UI (contracts, ambitions, the log) | The map's UI; the phone as the log and feed | UI [bb interface] | IN HAND |
| Event screens (a painting and choices) | A face and a mouth with choices (19, 33 s2) | RUN [road events], PORTRAIT | IN HAND |
| The settlement screen | The settlement screen (37b) | RUN [settlement screen], COOK [settlement art] | IN HAND |
| The battle HUD | The fight HUD (17) | UI [fight hud] | IN HAND |

## THE COUNT: 62 rows; DONE 12, IN HAND 40, RESEARCHED 8, NOT STARTED 2 (ambitions, followers) plus PERKS created today as NOT STARTED.
