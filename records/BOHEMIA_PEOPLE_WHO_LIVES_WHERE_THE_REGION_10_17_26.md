# WHO LIVES WHERE ACROSS THE REGION'S PLACES: BACKGROUNDS BY PLACE
PEOPLE lane, 10/17/26. Rule 110's big swing for a held lane (rule 88, rule 110e: "the held lanes' swing is a page").
A page, under the hold. Nothing in the demo, nothing in VOTE, nothing the game reads.
Test material: banks/BOHEMIA_WHO_LIVES_WHERE_10_17_26.json (draft:true, tuned:false, 26 places, every number copied by a tool from the wiki page it cites).
Checker: gates/who_lives_where_gate.js (in the suite as WHO LIVES WHERE).

> Paolo 10/9: "finding good bros throughout the settlements." Paolo 10/16: "our map has to be as big as Battle Brothers... I'm choosing Battle Brothers." The map now has 26 places (RUN 10/16, records/BOHEMIA_THE_REGION_RUN_10_16_26.md). This page says who stands at the post in each of them.

## 0. WHAT THE QUESTION IS, AND WHOSE HALF THIS IS

WORLD's hinterland school (records/BOHEMIA_WORLD_BB_PLACES_THE_HINTERLAND_9_25_26.md) split Battle Brothers' attached-location rule into four lines and wrote one of them as "the hinterland attracts certain recruits: not mine, routed to PEOPLE." This is that line, taken up the round the map grew to 26 places. The question is: when you walk into each place, who is for hire, and who lives there.

## 1. HOW BATTLE BROTHERS DOES IT, READ OFF THE PAGE AND NOT FROM MEMORY

The source is the wiki's Character Backgrounds / Sources table (reference/library/grok/wiki/PAGES_ALL.tar.gz, bb_all/0370), 60 backgrounds, each with three columns:

1. **Cities and Villages.** A percent per settlement type AND terrain: Coastal City, Plains Village, Steppe Fort and so on. The percent is the chance, per vacant recruit slot, that this man takes the slot when the list refreshes. A fisherman is 38.46% at a coastal small village, 9.09% at a coastal city, 0% anywhere inland. A farmhand is 30.77% at a plains small village and 0% at a steppe city. A miner is 28.57% at a mountain small village.
2. **Fortifications.** The same, for wooden keeps, stone keeps and citadels. Deserters, hedge knights, sellswords, squires and swordmasters live almost only in this column.
3. **Attachments, buildings, situations.** A +n tilt. The page's own footnote: +1 is roughly 2-3% at a large settlement, 3-5% at a medium one, 6-8.5% at a small one. Goat Pens give farmhands +3; a Lumber Camp gives lumberjacks +3; Fishing Huts give fishermen +3; a Militia Barracks gives militia +2. Situations are the big tilts: Refugees +35 refugees, Drought +23 farmhands, Cultist Procession +23 cultists, Seasonal Fair +18 peddlers, Disbanded Troops +10 militia, +8 retired soldiers, +6 deserters.

And the page's own caveats, kept: the table predates the Blazing Deserts DLC; the southern men (assassin, nomad, gladiator, indebted, manhunter) are hired "only in the City-States, with very few minor exceptions"; and seven of the sixty have no hire row at all (assassin, barbarian, crusader, king's guard, lindwurm slayer, orc slayer, pimp): they come from events, never a post.

## 2. THE FINDING THAT PROVES US WRONG: IN BATTLE BROTHERS A PLACE'S MEN COME FROM ITS SIZE AND ITS GROUND, AND THE HINTERLAND IS ONLY A TILT

The whole fleet, this lane included, has been saying "the attached locations decide who you can hire." Read the table and that is the small half. The base roll is set by **what size the place is and what terrain it stands on**; the attached location moves a man by +1 to +3 slots on top. A plains village offers farmhands at 30.77% before it has a single wheat field. Wheat Fields then add +3, worth maybe another 6-8%.

Measured against our map that is a problem in a specific shape: **20 of our 26 places stand on one terrain.** Las Vegas is desert; the nearest base terrain the table has is steppe (dry open ground; the DLC's desert is not on the page). Mapped honestly, 18 of the 26 fall into just four cells (steppe city 4, steppe medium village 6, steppe small village 6, steppe citadel 2), and every place in a cell rolls the identical list. By Battle Brothers' own method, Downtown, the Chapel, Henderson, Boulder City, Primm and the Block Party would offer the same men in the same proportions. Battle Brothers never has this problem because its maps mix seven terrains; ours cannot, because it is one real valley.

So the lesson is the reverse of what we thought: **for us the hinterland has to carry the whole difference, because the terrain cannot.** That is exactly why the real-world column in the table below matters more than the Battle Brothers column. Boulder City's veterans' home, Jean's prison camp, Pahrump's gun school, Searchlight's forty dead mines, Moapa's dairy: those are the attachments, and in our skin they have to be worth more than +1.

## 3. MEASURED AGAINST OUR OWN REPO: THE POST OFFERS THE SAME SIX MEN EVERYWHERE, AND AT EVERY PLACE THE BOOK SAYS ONE OF THEM SHOULD NOT BE THERE

engine/bohemia_goodbros.js (this lane, 10/9, [good bros]) offers farmhand, messenger, butcher, brawler, thief and militia at every post, the six of 77 with a real observed hiring range. Put those six against each place's cell on the page:

- **26 of 26 places** offer at least one man the book gives no chance at all there (zero in the base roll, no attachment tilt).
- **The Lake Mead marina offers six such men.** By the book the marina is a coastal small village: a fisherman at 38.46%, then beggars and drifters. Our post there offers a farmhand, a butcher and a militia man and never a fisherman.
- At the Strip (a steppe city) the farmhand, the messenger and the butcher are all 0%. At the Tunnels (a steppe small village) it is the farmhand, the messenger, the butcher and the militia man.
- Two of the eight backgrounds with real observed prices, **lumberjack and wildman**, are offered nowhere today, and the one place in the region that would roll them (the Mt Charleston lodge, a forest small village: lumberjack 20%, poacher 20%, bowyer 13.33%, hunter 13.33%) offers farmhands instead.

The gate holds this number: the day somebody makes the post read the place, leg E goes red and this page gets rewritten, which is the point.

## 4. THE TWENTY-SIX PLACES: BATTLE BROTHERS' ROLL, OUR GROUND'S TILT, AND WHO THE BOOK WOULD NOT PUT THERE

How to read it: the class and terrain are this lane's reading of each place into the table's cells (fortress = city or citadel, town = medium village or stone keep, camp = small village or wooden keep; military only where the real place is a garrison: the Remnants' gate, the dam, Indian Springs). "Base" is the page's own top of the cell. "Tilt" is the +n from the attached locations our real ground stands in for (the full list per place is in the bank, with what each stands in for). "Not by the book" is which of the live post's six have no chance at all in that cell.

| place | class, terrain | base roll (top four, % per slot) | our ground's tilt | not by the book |
|---|---|---|---|---|
| THE STRIP (Mob) | City, Steppe | caravan_hand 7.5, militia 7.5, beggar 5.0, minstrel 5.0 | monk +3, brawler +2, caravan_hand +1, cripple +1 | farmhand, messenger, butcher |
| NELLIS GATE (Remnants) | Citadel, Steppe | caravan_hand 7.7, militia 7.7, sellsword 7.7, deserter 5.1 | deserter +3, retired_soldier +3, militia +2, oathtaker +2 | farmhand, butcher, thief |
| THE DATAFORT (Network) | City, Steppe | caravan_hand 7.5, militia 7.5, beggar 5.0, minstrel 5.0 | apprentice +1, caravan_hand +1, daytaler +1, peddler +1 | farmhand, messenger, butcher, brawler |
| THE YARDS (Cartel) | City, Steppe | caravan_hand 7.5, militia 7.5, beggar 5.0, minstrel 5.0 | miner +3, daytaler +2, apprentice +1, caravan_hand +1 | farmhand, messenger, butcher, brawler |
| THE TRUCK STOP (Caravans) | City, Steppe | caravan_hand 7.5, militia 7.5, beggar 5.0, minstrel 5.0 | peddler +19, apprentice +1, caravan_hand +1, daytaler +1 | farmhand, messenger, butcher, brawler |
| THE CHAPEL (Church) | Medium Village, Steppe | caravan_hand 8.3, daytaler 8.3, refugee 8.3, apprentice 4.2 | cripple +1, monk +1, oathtaker +1 | farmhand, messenger, butcher, brawler |
| DOWNTOWN (Reds) | Medium Village, Steppe | caravan_hand 8.3, daytaler 8.3, refugee 8.3, apprentice 4.2 | none | farmhand, messenger, butcher, brawler |
| THE PARK (Blues) | Medium Village, Plains | farmhand 13.6, daytaler 9.1, militia 9.1, miller 9.1 | farmhand +4, daytaler +3, fisherman +3, miller +2 | brawler, thief |
| THE BLOCK PARTY (Anarchists) | Medium Village, Steppe | caravan_hand 8.3, daytaler 8.3, refugee 8.3, apprentice 4.2 | brawler +1, gambler +1, monk +1 | farmhand, messenger, butcher |
| THE SHOPS (Trades) | Small Village, Steppe | daytaler 15.4, apprentice 7.7, beggar 7.7, brawler 7.7 | apprentice +2, deserter +2, caravan_hand +1, daytaler +1 | farmhand, messenger, butcher, militia |
| THE CLINIC (Volunteers) | Small Village, Steppe | daytaler 15.4, apprentice 7.7, beggar 7.7, brawler 7.7 | farmhand +3, daytaler +2, miller +2, monk +2 | messenger, butcher, militia |
| THE TUNNELS (Homeless) | Small Village, Steppe | daytaler 15.4, apprentice 7.7, beggar 7.7, brawler 7.7 | daytaler +2, apprentice +1, caravan_hand +1, peddler +1 | farmhand, messenger, butcher, militia |
| THE COLORFUL CAMP | Small Village, Steppe | daytaler 15.4, apprentice 7.7, beggar 7.7, brawler 7.7 | none | farmhand, messenger, butcher, militia |
| YOUR OWN CAMP (Custom) | Small Village, Steppe | daytaler 15.4, apprentice 7.7, beggar 7.7, brawler 7.7 | none | farmhand, messenger, butcher, militia |
| HENDERSON | Medium Village, Steppe | caravan_hand 8.3, daytaler 8.3, refugee 8.3, apprentice 4.2 | apprentice +2, deserter +2, caravan_hand +1, daytaler +1 | farmhand, messenger, butcher, brawler |
| BOULDER CITY | Medium Village, Steppe | caravan_hand 8.3, daytaler 8.3, refugee 8.3, apprentice 4.2 | militia +10, retired_soldier +8, deserter +6, squire +4 | farmhand, messenger, butcher, brawler |
| HOOVER DAM | Citadel, Coastal | raider 8.8, caravan_hand 5.9, deserter 5.9, fisherman 5.9 | apprentice +1, caravan_hand +1, daytaler +1, deserter +1 | farmhand, butcher, thief |
| LAKE MEAD MARINA | Small Village, Coastal | fisherman 38.5, beggar 15.4, vagabond 15.4, daytaler 7.7 | fisherman +3 | farmhand, messenger, butcher, brawler, thief, militia |
| JEAN | Small Village, Steppe | daytaler 15.4, apprentice 7.7, beggar 7.7, brawler 7.7 | none | farmhand, messenger, butcher, militia |
| PRIMM | Medium Village, Steppe | caravan_hand 8.3, daytaler 8.3, refugee 8.3, apprentice 4.2 | refugee +35, apprentice +1, brawler +1, caravan_hand +1 | farmhand, messenger, butcher |
| SEARCHLIGHT | Small Village, Mountain | miner 28.6, apprentice 7.1, beggar 7.1, brawler 7.1 | miner +6, caravan_hand +2, sellsword +1, thief +1 | farmhand, butcher, militia |
| INDIAN SPRINGS | Citadel, Steppe | caravan_hand 7.7, militia 7.7, sellsword 7.7, deserter 5.1 | deserter +2, oathtaker +2, retired_soldier +2, hedge_knight +1 | farmhand, butcher, thief |
| MT CHARLESTON LODGE | Small Village, Forest | lumberjack 20.0, poacher 20.0, bowyer 13.3, hunter 13.3 | poacher +4, lumberjack +3, butcher +2, hunter +2 | farmhand, messenger, brawler, thief, militia |
| PAHRUMP | Medium Village, Plains | farmhand 13.6, daytaler 9.1, militia 9.1, miller 9.1 | farmhand +3, daytaler +2, militia +2, miller +2 | thief |
| MOAPA | Small Village, Plains | farmhand 30.8, daytaler 15.4, miller 15.4, beggar 7.7 | farmhand +6, daytaler +3, shepherd +3, miller +2 | messenger, brawler, thief, militia |
| MESQUITE | Medium Village, Plains | farmhand 13.6, daytaler 9.1, militia 9.1, miller 9.1 | farmhand +4, daytaler +3, miller +2, brawler +1 | thief |

## 5. THE REAL WORLD UNDER EACH OUTER PLACE, WHICH IS WHERE OUR TILT COMES FROM

Every attachment in the bank stands in for something real at that place. Checked this round, not remembered (sources in the bank's `real` field and here):

- **Henderson** was born as the Basic Magnesium plant in 1941, magnesium for bombs, about 14,000 workers at its peak, sited there for Hoover Dam's power and Lake Mead's water; the plant buildings went to Titanium Metals and Kerr-McGee after the war. So: Ore Smelters, Blast Furnace, Workshop (apprentices, deserters, the trades).
- **Boulder City** was built in 1931 by the federal government for the dam workers and still bans gambling by its own charter, one of two towns in Nevada where it is illegal. The Nevada State Veterans Home is here. So: the Disbanded Troops situation (militia +10, retired soldiers +8, deserters +6, squires +4), which is the strongest tilt on the whole map after Primm's.
- **Hoover Dam** is a federal site with its own security force at the gate. A citadel on the water: raiders, deserters, fishermen, masons (the dam's own trade, base 2.94% at a coastal fort).
- **Lake Mead marina**: Hemenway Harbor, the houseboats, the striped-bass fishery, the bathtub ring on the rock. Fishing Huts, and the hippo pod from the beasts rounds lives on this water (records/BOHEMIA_THE_BEASTS_OF_BOHEMIA_ROUND_ONE_THE_INVASIVE_LENS_9_29_26.md).
- **Jean**: two casinos at an exit and the Jean Conservation Camp, a state prison camp that the Department of Corrections is closing by July 2026 with the inmates moved out before it. A dry-lake camp. Nothing attaches by the book; this is the place where the southern DLC's indebted men would stand if we had a city-state, and we do not (section 6).
- **Primm**: three casinos and an outlet mall on the California line, and the Ivanpah mirror fields next door (built 2014; its owners moved to close it from 2026, the California regulator refused the closure deal in December 2025). Everybody coming up I-15 arrives here first: the Refugees situation, +35, the biggest tilt in the book.
- **Searchlight**: a gold camp from 1897 with over forty working mines, a few thousand people at the 1907 peak (the sources disagree between 1,500 and 5,000, the bigger number from the chamber of commerce), fifty after the highway bypassed it in 1927. A mountain small village: miners at 28.57% before the Copper Vein and the Gem Mine add +6.
- **Indian Springs**: Creech Air Force Base, the drone base (MQ-9 Reapers flown from here, its own command since 2019), and High Desert State Prison, the largest in the state at about 4,000 beds, eight miles south. A steppe citadel: sellswords, militia, deserters, hedge knights, oathtakers.
- **Mt Charleston lodge**: Kyle Canyon at 7,700 feet, ponderosa and bristlecone, the lodge itself burned to the ground on 17 September 2021. A forest small village: lumberjacks, poachers, bowyers, hunters. The only place in the region where lumberjack and wildman, two of the eight backgrounds with real prices on file, would ever roll.
- **Pahrump**: Nye County, legal brothels, the Pahrump Valley Winery, alfalfa on well water, retirees, and the Front Sight gun school (260,000 members, bankrupt in 2022, sold and reopened as PrairieFire). Winery, Wheat Fields, Militia Barracks. The brothels give the pimp nothing: the page has no hire row for him at all.
- **Moapa**: the Moapa River Reservation of the Southern Paiute, the travel plaza, the alfalfa and dairy of the Moapa Valley, and the 250 MW solar plant that opened in 2017 as the first utility-scale solar on tribal land, built as the Reid Gardner coal plant beside it was shutting. A plains small village: farmhands at 30.77%, then Goat Pens for the shepherds.
- **Mesquite**: golf and three casinos on the Arizona line, Virgin River farms, retirees; Bunkerville next door is where the 2014 armed standoff over grazing happened, which is the Wooden Watchtower (militia +1).

## 6. WHAT THE BOOK CANNOT ANSWER FOR US, NAMED NOT FUDGED

1. **The southern men have nowhere to stand.** Five of our fifteen origins start with Blazing Deserts backgrounds (the debt collectors: manhunters and the indebted; the fight pit: gladiators; the raiders: barbarians; the deserters and the promise keepers are base-game). The page says those men are hired only in the city-states. There is no city-state on our map. The honest Bohemia answer is in the real world above: the indebted stand at Jean and Indian Springs, where the prisons are; the gladiators at the Strip, which is the only city-state-shaped place we have. That is a ruling for whoever lifts the hold, drafted in the bank's skin, not built.
2. **Seven backgrounds never come from a post.** Assassin, barbarian, crusader, king's guard, lindwurm slayer, orc slayer, pimp: events only. The gate refuses them in any roll.
3. **The Hoover Dam is in two places.** bohemia_towns.minesOf on seed 1337 says the Mob holds a four-cell dam INSIDE the valley grid; RUN's region puts HOOVER DAM 178 blocks east as its own fortress. Both are real files on main. Named here for WORLD [the region] and RUN; this page gives the region's dam its own row and leaves the valley's dam cells on the Mob's line as the data says.
4. **The Colorful camp and the player's own camp roll like any other steppe small village**, because the graph says the Colorful faction is "community-based, not territorial, members across friendly factions" and the Custom faction is you. A place that is a community and not a ground has no hinterland, by the book or by ours.
5. **Who LIVES there is the other half of the title and it is a different data file.** The residents' former trades are engine/bohemia_people.js's WAS_WORDS (15 trades, 29% hospitality, derived from each person's key). The region's residents need trades the valley's list does not have: a dam operator, a prison guard, a drone pilot, a miner, a boat mechanic, a brothel's bookkeeper, an alfalfa farmer, a ski-patrol man. That list is drafted nowhere yet; it belongs to the round the hold lifts, because WAS_WORDS is live code and this round is a page.

## 7. BETTER THAN BATTLE BROTHERS (rule 80, this page's line)

Battle Brothers: who you can hire is 80% the size and terrain of a town you never chose and 20% a hut outside it; the same seventeen-town method on any map. Ours: the valley has one terrain, so the whole difference between twenty-six places has to be the real thing that is there, and it is: a veterans' home, a prison camp, a gun school, a drone base, a dead gold camp, a reservation's dairy. A place's men come from what the place actually was the day the money died. Added as line 21 in records/BOHEMIA_BETTER_THAN_BATTLE_BROTHERS_10_9_26.md.

## 8. ROUTED

- **PEOPLE (the round the hold lifts):** make the post read the place: `sixAtThePost(placeId)` rolls from the bank's base cell plus tilts, with the eight real-priced backgrounds first and the rest priced by the Game Guide's base-cost rule once TUNING fills it; the region's WAS_WORDS.
- **RUN TWO [recruit at the place]:** the settlement screen hands the post its place id; the marina's post shows a fisherman.
- **WORLD [the region]:** the dam in two places (section 6.3); the region places' own ground kinds so the tilts can be derived from the map instead of this lane's reading.
- **FACTIONS:** the Disbanded Troops shape at Boulder City and the Refugees shape at Primm are situations, and situations are RUN TWO's settlement_traits.json; the two could be one file.
- **TUNING (research):** the +n footnote (2-3 / 3-5 / 6-8.5% per +1 by size) and the Game Guide's base hiring cost (30 to about 150 crowns, swordmaster 400) are the two numbers a place-aware post needs.
- **COOK THREE / PORTRAIT:** twenty-six posts need twenty-six crowds; the skin column says who stands in each.

## 9. [bb school] AND [analog horror]

[bb who lives where]: Battle Brothers hides the whole Sources table from the player; you learn that fishermen come from the coast by walking the coast for forty hours. That is the right call and we keep it: the bank is for the machine, the player learns the region with their feet.
[ah]: the post at Jean after July 2026 is a prison camp with nobody in it and a casino with nobody at the tables; the man standing there for hire is the one who did not leave. The emptiness is the horror, not a filter.

## 10. GATE

gates/who_lives_where_gate.js, WHO LIVES WHERE in the suite. A: a draft bank, 26 places. B: the 14 valley places are the 14 derived seats by name and tier, the 12 region places are the region file's 12 TOWNS by name and tier. C: every id a real row of backgrounds.json, every skin real, no hire-less background rolled. D: every percent and every +n found inside its own background's block on the wiki page, read out of the tarball at gate time (over 400 numbers), with a planted 99.9% as the negative control. E: the measured gap, 26 of 26, asserted against the live post. F: nothing in engine/ or slices/ reads the bank. G: the page, the finding, the routing, no VOTE item.
