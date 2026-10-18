# ECONOMY DAY 71: THE 32 SITUATIONS ARE 44, AND THIRTEEN OF THE TABLE'S FOOD PRICES ARE NOT ON THE PAGE THEY CITE
# Row [the 32 situations] (the top OPEN row, rule 74; his YES on tuning-the-price-ratios-audit-10-10),
# under the hold (rule 88: a page without a sheet). The new age (rules 112 to 116): the coordinator
# opened this chat; the round runs to the end with no check-in and no question. Research only;
# nothing touches the demo, the alpha or the VOTE tab. This page CITES the wiki and the data files
# and sets no digit; TUNING's one table carries the numbers (rule 38g).

## 0. THE QUESTION, IN ONE BREATH
TUNING's [the sell ratio] (10/10) wrote 'situation[name].buy_pct / sell_pct (32 rows)' into
records/BOHEMIA_TUNING_SELL_RATIO_TABLE_10_10_26.json and the row asked this lane, with TUNING, to
lay the market's situations out as rows of the one numbers table, each with its wiki page, and
'the wiki does not say' where it does not. This page reads every Settlement Situation page in the
wiki library line by line, checks the 32 rows against them, and checks the three traits the
settlement screen actually rolls (records/target/settlement_traits.json) against the same pages.

## 1. HOW BATTLE BROTHERS DOES IT, FROM THE WIKI ITSELF
Sources: reference/library/grok/wiki/PAGES_ALL.tar.gz, bb_all/: the 44 '(Settlement Situation)'
pages, 1764 Settlement situations (the index), 1244 Market prices for various items, 0834 Getting
Started, 2018 Trade, the contract pages named in the table, Dev Blog 105 (0583) and Dev Blog 138
(0616), Update 1.5.0.11 (2147).

**1a. THERE ARE 44, NOT 32.** The index page transcludes 44 situation cards. By what they move:
- 18 move the general BUY price and 18 the general SELL price (17 both; Besieged moves buy only, Moving Sands sell only).
- 2 move ONE good's price only: Sickness, medicine buying +200%; Collectors, monster trophies
  selling +100%.
- 17 move ITEMS AVAILABLE, 17 move RECRUITS AVAILABLE, 13 move FOOD AVAILABLE.
- 2 move one other stock: Rebuilding Effort (quality wood -50%), Rich Veins (minerals +50%).
- 5 carry no number on the card at all: Ceremonial Season (the text says incense dearer), Cultist
  Procession, Mirage Sightings, Razed, Tournament.
TUNING's '32' was the count of rows its JSON wrote, not the wiki's count.

**1b. THE TRADE IS MULTIPLIED, THE RELATION IS ADDED.** Page 1764, verbatim: 'Percentages
mentioned below (for states that affect trade) are applied multiplicatively ... on base price
modifiers for that settlement (ie a settlement that usually has a selling price modifier of 19.6%
... will now have a selling price modifier of 21.6% in the event of Ambushed Trade Route (+10%)).'
Page 1244: relations add 'about 2% of worth' to selling 'additively as opposed to settlement
situation modifiers'. And 'more item availability increases the chance of any item being offered.
This also increases the chance for named items to be sold'; less availability can make a named
item 'even impossible'.

**1c. BUY AND SELL ARE TWO KNOBS, AND SEVEN SITUATIONS TURN THEM OPPOSITE WAYS.** Ten of the
two-sided cards move buy and sell the same way (Safe Roads +10/+10, Seasonal Fair +25/+25,
Mustering Troops +25/+25, Well Supplied -10/-10). Seven move them APART: Abducted Children,
Disappearing Villagers and Terrified Villagers +25 buy / -25 sell; Conquered and Unhold Attacks
+10 / -10; High Spirits and Local Holiday -5 / +5. Fear is the town charging you more AND paying
you less; good spirits is the reverse. The wiki's own beginner page (0834) names the play the
same-way cards make: in Ambushed Trade Routes 'all items are traded for a higher value ... you
might want to hold off on completing their contracts to drive off bandits or beasts so you can
take advantage of their dire situation. You're a mercenary after all.'

**1d. THREE WAYS A SITUATION COMES AND GOES.** The wiki never gives most of them a cause or a
clock; where it does, they fall in three families:
- CAUSED BY SOMEONE (10): Raided (3 days, 0553/1642), Conquered (3 days, 1793), Besieged (during
  the siege contract), Razed (late crisis, destruction off), Safe Roads (33% after a Patrol,
  1529), Well Supplied (after Escort Caravan done well, 0703), Ambushed Trade Routes (a camp;
  cleared when you destroy it, 0667/0670), Tournament (5 days, 0133), Refugees (a late crisis),
  Rebuilding Effort (a burned attached location).
- CLEARED BY A HUNT (8): a beast or a band hangs on the town until a contract kills it: Abducted
  Children (Hexen), Terrified Villagers (the cemetery), Terrifying Nightmares (Alps), Unhold
  Attacks, Moving Sands (serpents), Mirage Sightings (ifrits), Slave Revolt, Marauding Greenskins.
- THE WIKI DOES NOT SAY (26): Dev Blog 105 says 'most of the new situations occur randomly for
  specific types of settlements': fishing towns lose boats or land full nets, mining towns cave in
  or strike a vein, cities hold fairs. So dice ARE Battle Brothers' way for this family, keyed to
  the place's type, never to a calm town at large.
Dev Blog 138 adds the read: 'tavern rumors now also include hints of settlement situations of
nearby villages and towns ... so that you get a better idea of trading, recruiting and work
opportunities nearby.' The situation is meant to be HEARD ABOUT before you arrive.

## 2. THE TABLE: 44 ROWS, EACH WITH ITS PAGE
Every number is the card's own, signs as printed. A blank is 'the wiki does not say'.

| situation | page | buy % | sell % | items % | recruits % | food stock % | other | how it comes and goes |
|---|---|---|---|---|---|---|---|---|
| Abducted Children | 0007 | +25 | -25 |  | -50 |  |  | CLEARED BY A HUNT: cleared by Hunting Hexen (1046) |
| Ambushed Trade Routes | 0054 | +20 | +10 | -25 |  |  |  | CAUSED: a camp near the place; cleared when you destroy it (0667, 0670) |
| Archery Contest | 0129 |  |  |  | +25 |  |  | the wiki does not say (Dev Blog 105: most roll by the place's type) |
| Besieged | 0234 | +25 |  | -25 | -50 |  |  | CAUSED: during Siege Fortification (1793) |
| Bread and Games | 0286 |  |  |  |  | +50 |  | the wiki does not say (Dev Blog 105: most roll by the place's type) |
| Ceremonial Season | 0360 |  |  |  |  |  | no number on the card | the wiki does not say (Dev Blog 105: most roll by the place's type) |
| Collectors | 0420 |  |  |  | +25 |  | trophy_sell +100 | the wiki does not say (Dev Blog 105: most roll by the place's type) |
| Conquered | 0437 | +10 | -10 | -40 |  | -10 |  | CAUSED: after Siege Fortification, 3 days (1793); Civilwar Town Conquered (0394) |
| Cultist Procession | 0489 |  |  |  |  |  | no number on the card | the wiki does not say (Dev Blog 105: most roll by the place's type) |
| Disappearing Villagers | 0635 | +25 | -25 |  | -50 |  |  | the wiki does not say (Dev Blog 105: most roll by the place's type) |
| Disbanded Troops | 0638 | -10 | -10 |  | +25 |  |  | the wiki does not say (Dev Blog 105: most roll by the place's type) |
| Drought | 0671 |  |  |  |  | -50 |  | the wiki does not say (Dev Blog 105: most roll by the place's type) |
| Full Nets | 0822 |  |  |  |  | +100 |  | the wiki does not say (Dev Blog 105: most roll by the place's type) |
| Good Harvest | 0888 |  |  |  |  | +100 |  | the wiki does not say (Dev Blog 105: most roll by the place's type) |
| High Spirits | 0996 | -5 | +5 | +10 |  |  |  | the wiki does not say (Dev Blog 105: most roll by the place's type) |
| Hunting Season | 1050 |  |  |  |  | +100 |  | the wiki does not say (Dev Blog 105: most roll by the place's type) |
| Local Holiday | 1192 | -5 | +5 |  |  | +50 |  | the wiki does not say (Dev Blog 105: most roll by the place's type) |
| Lost at Sea | 1208 |  |  |  | -50 | -50 |  | the wiki does not say (Dev Blog 105: most roll by the place's type) |
| Marauding Greenskins | 1242 |  |  | -25 | -25 |  |  | CLEARED BY A HUNT: tied to Destroy Goblin/Orc Camp and Defend Settlement Greenskins (0574, 0575, 0554) |
| Mine Cave In | 1291 |  |  |  | +25 |  |  | the wiki does not say (Dev Blog 105: most roll by the place's type) |
| Mirage Sightings | 1301 |  |  |  |  |  | no number on the card | CLEARED BY A HUNT: cleared by Hunting Ifrits (1047) |
| Moving Sands | 1327 |  | +10 | -15 |  |  |  | CLEARED BY A HUNT: cleared by Hunting Serpents (1051) |
| Mustering Troops | 1328 | +25 | +25 | -50 | -50 |  |  | the wiki does not say (Dev Blog 105: most roll by the place's type) |
| Preparing Feast | 1603 |  |  |  |  | -75 |  | the wiki does not say (Dev Blog 105: most roll by the place's type) |
| Public Executions | 1609 |  |  |  |  | +35 |  | the wiki does not say (Dev Blog 105: most roll by the place's type) |
| Raided | 1626 |  |  | -50 | -50 |  |  | CAUSED: you lose Defend Settlement or fail the location; 3 days (0553, 1642) |
| Razed | 1644 |  |  |  |  |  | no number on the card | CAUSED: late crisis with Permanent Destruction off, 'for a while' (1415, 0626) |
| Rebuilding Effort | 1650 |  |  |  |  |  | wood_stock -50 | CAUSED: a burned attached location being rebuilt (Dev Blog 105) |
| Refugees | 1660 |  |  | -10 |  | -25 |  | CAUSED: a late crisis (Dev Blog 105) |
| Rich Veins | 1695 | +10 | +10 |  |  |  | mineral_stock +50 | the wiki does not say (Dev Blog 105: most roll by the place's type) |
| Safe Roads | 1727 | +10 | +10 | +10 |  |  |  | CAUSED: 33% chance after a Patrol contract (1529) |
| Sand Storm | 1732 | +20 | +10 | -25 |  |  |  | the wiki does not say (Dev Blog 105: most roll by the place's type) |
| Seasonal Fair | 1744 | +25 | +25 | +25 | +25 |  |  | the wiki does not say (Dev Blog 105: most roll by the place's type) |
| Short on Food | 1787 |  |  |  |  | -50 |  | the wiki does not say (Dev Blog 105: most roll by the place's type) |
| Sickness | 1792 |  |  |  | -25 |  | medicine_buy +200 | the wiki does not say (Dev Blog 105: most roll by the place's type) |
| Slave Revolt | 1809 |  |  | -50 | -25 |  |  | CLEARED BY A HUNT: cleared by Slave Uprising (1810) |
| Snow Storms | 1825 | +20 | +10 | -25 |  |  |  | the wiki does not say (Dev Blog 105: most roll by the place's type) |
| Terrified Villagers | 1938 | +25 | -25 |  | -50 |  |  | CLEARED BY A HUNT: cleared by Investigate Cemetery (1091) |
| Terrifying Nightmares | 1939 |  |  |  | -25 |  |  | CLEARED BY A HUNT: cleared by Hunting Alps (1041) |
| Tournament | 2016 |  |  |  |  |  | no number on the card | CAUSED: 5 days after an Arena Tournament (0133) |
| Unhold Attacks | 2073 | +10 | -10 | -10 | -25 |  |  | CLEARED BY A HUNT: cleared by Hunting Unholds (1052) |
| Warehouse Burned Down | 2179 | +25 | +5 | -50 |  |  |  | the wiki does not say (Dev Blog 105: most roll by the place's type) |
| Well Supplied | 2199 | -10 | -10 | +15 |  |  |  | CAUSED: you finish Escort Caravan well (0703) |
| Witch Burnings | 2220 |  |  |  |  | +35 |  | the wiki does not say (Dev Blog 105: most roll by the place's type) |

## 3. WHAT THE TWO TABLES ON MAIN GET WRONG
**3a. TUNING'S JSON: 17 OF 32 ROWS MATCH, 15 DO NOT.** Checked field by field against the cards:
*** CORRECTED 10/18 BY DAY 77 (records/BOHEMIA_ECONOMY_DAY_77_THE_BOWL_COSTS_TWO_AND_A_HALF_TIMES_THE_SACK_WHERE_THE_RECORD_SAYS_A_TENTH_AND_TUNING_READ_IT_AS_EASIER_10_18_26.md, section 6.3): the food
prices ARE on the cards. Fourteen situation pages print a 'food prices' line beside the 'food available' line
this section read (Besieged +100 and Sickness +100 among them); TUNING's JSON is right on every food row. The
first two bullets below are WITHDRAWN for food; the Collectors bullet and the missing items and recruits stand. ***
- 13 rows carry a 'food_price_pct' that NO situation card prints. The cards print FOOD AVAILABLE:
  Drought -50 (JSON: food price +100), Short on Food -50 (JSON +200), Lost at Sea -50 (+100),
  Preparing Feast -75 (+100), Refugees -25 (+25), Good Harvest, Full Nets and Hunting Season +100
  (-50), Bread and Games and Local Holiday +50 (-10), Public Executions and Witch Burnings +35
  (+15). The direction agrees with the cards' prose (Drought: 'less food available and prices are
  higher'; Good Harvest 'offered at lower prices'), so these may be the game's own code, but the
  numbers are not on the page the JSON cites, and the stock number that IS on it is missing.
- Besieged: JSON food price +100; the card has no food at all. It has items -25 and recruits -50,
  which the JSON leaves out.
- Sickness: JSON food price +100; the card's only price is MEDICINE buying +200%. TUNING's own
  prose line says medicine; its JSON says food.
- Collectors: JSON sell +100 on everything; the card says monster TROPHIES only (Update 1.5.0.11:
  'beast parts and treasures'). As written, a Collectors town doubles the sale of every sword.
- None of the 32 rows carries items or recruits, which 17 and 17 cards move.
All 18 buy and 18 sell numbers that ARE on the cards match the JSON exactly. The general price half
is clean; the food, the one-good and the stock halves are not.

**3b. THE SCREEN'S THREE TRAITS (settlement_traits.json, RUN TWO).**
- raided: price x1.25, stock x0.6, recruits -1. Card: items -50, recruits -50, no price (Day 70).
- sickness: price x1.1 on EVERY good, stock x0.8, recruits -1, the clinic busy. Card: medicine
  buying +200%, recruits -25%, nothing else. Ours makes a blade dearer in a plague; the card
  leaves the blade alone and triples the medicine.
- market_day, marked 'bb: Celebration': there is no Celebration in the 44 (TITLES.txt has no such
  page). Ours is price x0.85, stock x1.5, recruits +1: CHEAPER. The nearest cards are Seasonal
  Fair (+25 buy, +25 sell, +25 items, +25 recruits: DEARER, and better to sell into) and Local
  Holiday (-5 buy, +5 sell, +50 food). Ours runs the fair backwards.
- One knob where the wiki has two: the screen multiplies one price (line 197, m.price) and the
  sell-back is a seventh of that same price (SELL_CUT, line 340). So every trait moves buy and
  sell the same way, and the seven opposite cards in 1c (fear charges more and pays less) cannot
  be written in the file at all.

## 4. WHAT THE REAL RECORD SAYS ABOUT THE THREE FAMILIES
- ROLLED BY THE PLACE'S TYPE: a harvest is local and it moves FOOD first. Russia's 2010 heatwave
  burned the wheat; Moscow banned grain exports that August and bread prices moved in towns that
  never saw the heat. Battle Brothers' Drought is the same shape, and it is a farm town's card,
  never a mining town's.
- CAUSED BY A PARTY: a muster empties the gear shelf and raises what is left (Kyiv's shops sold out
  of body armour, boots and first-aid kits in the first weeks of March 2022); the end of a war
  floods it (the US army-surplus stores after 1945, a whole retail trade built on cheap issued
  kit). That is Mustering Troops +25/+25 items -50 and Disbanded Troops -10/-10 recruits +25.
- CLEARED BY A HUNT: fear is a two-way squeeze, because a seller prices the risk of the road home
  and a buyer prices the risk of being stuck with stock. The cards' +25 buy / -25 sell is that.
- A CONVENTION IS A FAIR: Las Vegas itself prices its big trade-show weeks above every other week
  of the year, rooms and food alike, and the same week is the best week to sell into the city.
  Seasonal Fair's +25/+25 is the city we are set in, not a medieval curiosity.

## 5. OUR SWAG: THE VALLEY'S OWN SKINS (CANDIDATES, NONE PICKED)
Names and words are WORDS'; which ones ship is TUNING's and RUN TWO's; nothing here is a ruling.
- Lake Mead's fishing camps get Full Nets and Lost at Sea; a gypsum or gravel pit town gets Rich
  Veins and Mine Cave In; a farm on the river gets Good Harvest and Drought.
- Sand Storm is the valley's haboob, and it is already Battle Brothers' southern card (+20/+10,
  items -25): the one storm that is ours without a skin. Snow Storms only for the mountain places.
- The eight CLEARED BY A HUNT cards are the BEASTS law's lab animals hanging on a town until the
  hunt contract (rule 42): the town's prices are the beast's bounty made visible.
- Seasonal Fair is a CONVENTION WEEK; Mustering Troops is a house raising a party (FACTIONS'
  [wants send parties]); Disbanded Troops is the week after a house's war ends.

## 6. ROUTED
- TUNING [the 32 situations]: section 2 is the 44 rows with pages; the JSON's 13 food prices
  become 'the wiki does not say' (or carry a code source if TUNING has one); Besieged, Sickness
  and Collectors are corrected to their cards; items and recruits added. The one table holds them.
- RUN TWO [a place has traits]: market_day's 'Celebration' is not a Battle Brothers situation and
  runs the fair backwards; sickness moves every price where the card moves medicine only; the
  file needs a buy and a sell knob, not one price, or fear cannot exist (section 3b).
- RUN TWO and FACTIONS: the caused family (raided, conquered, besieged, safe roads, well supplied,
  ambushed roads) comes from the ledger, never the dice (Day 70); the dice keep the place-type
  family, keyed to the place's type.
- WORDS: Dev Blog 138's rumour line: the keeper in the next town is where a situation is first
  heard. Eight bank lines below are the attempt.
- QUESTS (research only): the eight hunt-cleared cards are the contract hooks; a price is the
  hook's visible half.

## 7. WHAT THIS ROUND DID NOT DO
No code, no sheet, no VOTE item (rule 88). No data file edited: the JSON is TUNING's,
settlement_traits.json and the screen are RUN TWO's. No felt number into the game (rule 38g). Every
figure above is a wiki card's percentage or a count of them. The valley skins are candidates. Eight
bank lines, draft:true, in banks/BOHEMIA_ECONOMY_TEST_LINES_9_5_26.md, section SSSSSSSSSSSSSSSSSSSSSSSSS.

[bb school line] Battle Brothers has 44 town situations, not 32; most roll by the town's type, ten
are caused by someone, eight hang on until you kill the thing; buy and sell are two knobs and fear
turns them opposite ways, dearer to buy and cheaper to sell.
[analog horror line] The keeper charges more and pays less and will not say why; two towns over a
man at the counter says it plain: 'they took a boy off the end house, nobody sells out there now.'

Sources for section 4: Reuters and the FAO on Russia's August 2010 grain export ban; Kyiv Independent
and Reuters reporting on armour and medical-kit shortages, March 2022; the Smithsonian and National
WWII Museum on post-1945 army-surplus retail; the Las Vegas Convention and Visitors Authority on
convention-week room rates. Wiki text CC BY-SA 3.0, battlebrothers.fandom.com.
