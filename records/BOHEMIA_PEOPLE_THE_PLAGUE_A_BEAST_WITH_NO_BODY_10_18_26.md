# THE PLAGUE: A BEAST WITH NO BODY (PEOPLE, 10/18/26, row [the plague], rule 42 round two; a page under the hold, rule 88)

Bank: banks/BOHEMIA_THE_PLAGUE_10_18_26.json (draft:true, nothing live reads it).
Gate: gates/the_plague_gate.js, THE PLAGUE in the suite.
The row's words (coordinator 9/29): "thawed microbes are real (30,000-year and 48,500-year viruses revived; anthrax from a thawed carcass, 2016); a sickness moves through a district like a rumour, lands on people as the long injury (36b) with a mark; the lidded tank and the wall are the cure's start; when it first appears is DYNASTY's clock. Never a road beast."

## 0. WHAT THE QUESTION IS, AND WHOSE HALF THIS IS

Rule 42 says every beast is a de-extinct animal that broke out of a lab when the dollar died, and round two of the beast research (9/29) added one beast with no body: a thawed microbe. This lane owns what lands on a PERSON (the sick man, his days, his mark, what the keeper says). TUNING owns every number a player feels. RUN TWO owns the settlement trait the sickness sits on. WORLD owns the weather and the water. DYNASTY owns the crisis clock. This page designs the row and builds nothing: the hold stands, so the test material is a bank the game does not read.

## 1. HOW BATTLE BROTHERS DOES IT, READ OFF THE PAGE AND NOT FROM MEMORY

Read out of the library's tarball (reference/library/grok/wiki/PAGES_ALL.tar.gz) by the gate, every number byte for byte:

- **Sick** (bb_all/1790_Sick.txt) is the only sickness a brother can have. It is a temporary injury that NEVER comes from a hit: "not sustained through the usual means (event/consumable only)". It costs −25% to every attribute that levels and −2 vision, and heals in 1 to 3 days. Seven events and potions cause it; we already hold the row in records/target/bb/injuries.json.
- **Sickness (Settlement Situation)** (bb_all/1792_Sickness (Settlement Situation).txt) is the only sickness a PLACE can have: food prices +100%, medicine buying prices +200%, recruits available −25%. It is a state on the town, it comes and goes, and it names no cause.
- **Ratcatcher Spreads Disease** (bb_all/1641_Ratcatcher Spreads Disease.txt) is the one event where an ANIMAL in the company makes the men sick: the ratcatcher's rats get loose, you lose 8 to 18 food, and each brother's chance to get sick is 80 − hitpoints, with Tough or Strong brothers 20% less likely; cooldown 90 days.
- **Sickness** (bb_all/1791_Sickness.txt), the event, is the GROUND making men sick: on swamp, snow or snow forest terrain, 5 tiles from a settlement, the same 80 − hitpoints roll; cooldown 21 days; the Scout follower prevents it.
- **Infected Wound** (bb_all/1079_Infected Wound.txt): an untreated cut festers, −25% hitpoints and −25% max fatigue for 3 to 4 days.
- **Drought (Settlement Situation)** (bb_all/0671_Drought (Settlement Situation).txt) is the model for a situation that SAYS WHY it is there: "an unexpected heatwave burnt many of the local crops", food −50%, prices +100%, farmhands more likely for hire.

So Battle Brothers has three doors for a sickness: an animal you carry, the ground you cross, and a place's state. None of its sicknesses passes from one brother to another. Not one.

## 2. THE FINDING THAT PROVES US WRONG: THE SICKNESS DOES NOT MOVE LIKE A RUMOUR. IT MOVES LIKE MEAT, DUST, MICE AND FLEAS, AND ITS CLOCK IS THE PLAYER'S HANDS

The row said "a sickness moves through a district like a rumour" and "when it first appears is DYNASTY's clock". The real thawed microbes say otherwise on both counts.

**The real thawed things do not pass between people.** Every virus ever revived from permafrost (the 30,000-year giant virus of 2014, the 48,500-year Pandoravirus yedoma of 2022-23, thirteen in all) infects amoebae and nothing else; the researchers chose them for exactly that reason. The one thawed microbe that has actually killed a human is anthrax, Yamal 2016: a heatwave thawed ground holding a reindeer carcass from the 1940s, 2,650 reindeer sickened and 2,350 died (88.67 percent of the sick herd), 24 to 36 people were infected and one died, a 12-year-old boy, from the meat. Anthrax does not pass person to person. It went carcass, to herd, to the hands that skinned it, to the mouths that ate it. The district did not catch a rumour; it ate a cow.

**The valley's own sicknesses do not pass between people either.** Three real sicknesses are in the real Las Vegas ground today: valley fever (Coccidioides) is in the dirt throughout Southern Nevada and the health district's advisory of 9/8/2025 says it is rising; you breathe it when the ground is dug, and a 2021 study found dust STORMS do not even move the case count, disturbed ground does. Hantavirus lives in the deer mouse; in 1993 it killed 17 of 33 people at Four Corners after a wet winter made the mice boom, and Clark County's own mice carried it in 2006; you breathe it sweeping a closed room. Plague (Yersinia pestis) lives in the desert wood rat of remote Clark County; a Mount Charleston raccoon tested positive in 2001 and four gray foxes in 2003; Nevada has had five human cases since 1978. Only plague moves through a camp at all, and it moves rat to flea to man, through a crowded PLACE, not through talk.

**So the shape is the opposite of a rumour.** A rumour spreads because people talk. These spread because people DO things: butcher a beast that lay down and died (the thaw), dig a wall or a grave (the dust), scavenge a dead house the summer after a wet winter (the mouse), sleep twelve to a room (the flea). That is also the answer to the clock. Three of the four have no date at all: they fire the first time the player's company does the verb. Only the mouse rides a season, and that is WORLD's weather, not DYNASTY's crisis. DYNASTY's crisis(day) keeps one honest job: naming the first DISTRICT-WIDE outbreak, the week a whole place takes the trait, as the crisis that opens the flip.

**What survives of the row.** "Lands on people as the long injury with a mark": yes, in Battle Brothers' own shape (the Sick status for the days, a real permanent mark from the eleven we hold for the ones that do not heal clean: a partly collapsed lung for the dust and the mouse, a weakened heart for the thaw and the mouse, a missing finger for the flea's gangrene). "The lidded tank and the wall are the cure's start": yes, and literally: the tank keeps the dust and the mice out of the water, the wall keeps the herd and the rats off the lot. "Never a road beast": yes, and stronger than the row meant: it is never a BODY on the board at all, it is a verb with a cost.

## 3. MEASURED AGAINST OUR OWN REPO: WE HAVE THE TRAIT WITH NO CAUSE, THE ROW WITH NO PATIENT, AND THE WRONG NUMBERS

- **A place can already be sick, for no reason.** records/target/settlement_traits.json (RUN TWO, rule 71) carries a `sickness` trait in Battle Brothers' skin: price_mult 1.1, stock_mult 0.8, recruits −1, clinic_busy, seven draft lines for the keepers. It is rolled per place by name and week (chance_any 0.7, max 2 traits, period 7 days). It has NO cause field: no beast, no season, no water, no crowd. It is weather without weather. Battle Brothers' Drought situation names its heatwave on its face; ours names nothing.
- **A man can be sick on paper and never in the game.** records/target/bb/injuries.json carries the Sick row exactly (−25% to levelable attributes, −2 vision, 1 to 3 days) and Infected Wound (−25%, 3 to 4 days). Nothing in engine/ ever puts either on a person. engine/bohemia_long_injury.js (this lane, 10/9) builds a struck-down man's fact from the eleven permanent marks and never a sick man's; its `healDay` is the one clock a sick man would need and it is wired to nothing (the review file says so).
- **The numbers are not the book's.** The trait's 1.1 / 0.8 / −1 stand where Battle Brothers writes +100% food, +200% medicine, −25% recruits. The trait is marked for TUNING and that is right; the gap is written here so it stops being a surprise.
- **The verbs exist, the roll does not.** SCAVENGE is a settlement-screen verb (rule 37); the wall and the lidded tank are built things (records/BOHEMIA_YOU_BUILD_WHAT_YOU_HOLD_9_30_26.md); the beast-keeper walks with a beast ([keepers], 10/10); a beast fight drops hide and meat (the seventeen's WORTH column). Every door a sickness needs is already a thing the player does. None of them rolls anything.

The gate holds all three gaps and goes red on purpose the day the trait carries a cause or an engine file writes `sick` on a person; the page is rewritten that day.

## 4. THE FOUR SICKNESSES, EACH FROM A REAL ONE (the bank's rows, one line each)

| id | real model | how a man catches it | days down | dies (untreated / treated, DRAFT for TUNING) | mark | the place's trait | likeliest at |
|---|---|---|---|---|---|---|---|
| the_thaw | anthrax, Yamal 2016 | BUTCHER, EAT, KEEP a herd beast that lay down and died | 7 to 14 | 0.40 / 0.05 | weakened heart, partly collapsed lung | sickness, from the carcass; the cell is DEAD GROUND 48 years | Moapa, Pahrump, Mesquite, the truck stop, the marina |
| the_dust | valley fever, SNHD 2025 | DIG the wall, the tank, a grave | 14 to 42 | 0.02 / 0.01 | partly collapsed lung | sickness, from the works | Henderson, Pahrump, Mesquite, Primm, Jean |
| the_mouse | hantavirus, Four Corners 1993 | SCAVENGE a dead house the summer after a wet winter | 14 to 42 | 0.50 / 0.38 | partly collapsed lung, weakened heart | sickness, in a mouse year | Mt Charleston, the Strip's dead towers, Henderson, Boulder City, Indian Springs |
| the_flea | plague, Clark County's wood rat | SLEEP in a crowded camp; KEEP rats or cats | 7 to 14 | 0.50 / 0.10 | missing finger | sickness, from the crowd; the only one that spreads through the place | the Tunnels, Primm, the Colorful camp, your own camp, Mt Charleston, Searchlight |

The chance per man is Battle Brothers' own formula from the ratcatcher's page, 80 − hitpoints with Tough or Strong 20% less likely, until TUNING writes its row. The days and the death rolls are this lane's DRAFT of the real courses (CDC and WHO figures from memory, named as such in the bank); TUNING verifies every one before any of it is a row.

## 5. THE REAL WORLD UNDER EACH, WHICH IS WHERE THE DESIGN COMES FROM

- **THE THAW** is the one that belongs to the lab (rule 42). The lab made its herd from tissue out of the thawing north; a spore came with the tissue; the herd carries it out. The 2016 outbreak was an animal disease first: nine in ten sick reindeer died, one in thirty sick people. So in the game the HERD dies, and the herd dying is the sign; the man who ignores the sign and skins the carcass is the one who pays. And the ground keeps it: Gruinard Island was seeded in 1942 and declared safe in 1990. A cell where a herd beast died of the thaw in act 1 is dead ground in act 3, 35 years later by the law (laws/BOHEMIA_LAW_THE_THREE_ACTS_AT_ONCE_9_23_26.md). That is a three-acts hook that costs one field on a map cell. The real cure is the real one: burn, never bury. Yamal buried theirs.
- **THE DUST** is the valley's own, no lab needed. The spore is in the dirt from Henderson to Pahrump; the day the money died, the ground got dug for walls, tanks and graves. The 2021 finding (no consistent link between dust storms and cases) matters for us: the roll goes on the DIG, not on the weather, which keeps WORLD's weather clock out of it.
- **THE MOUSE** is the one that rides a season, and the only one that needs WORLD: a wet winter is a mouse year the summer after, the 1993 shape exactly. Las Vegas had 150,000 hotel rooms and whole dead tracts the day the money died; that is the biggest mouse habitat in the state. The scavenge verb is where it lands. It is also the deadliest, and the medicine barely helps; the real answer is wetting the floor before you sweep, which is a thing a keeper can say.
- **THE FLEA** is the one Battle Brothers' Sickness situation already is: a place's state, with recruits down and medicine up. Ours gets a cause (the crowd, the rats) and one true twist from the valley: the cat. Row [cats stay] put cats in the game; plague cats are real (the Idaho and Nevada warnings name them) and ratting cats are real. The same animal is the vector and the cure.

## 6. WHAT THE BOOK AND THE RECORD CANNOT ANSWER FOR US, NAMED NOT FUDGED

1. **The death rolls are drafted from memory of CDC and WHO figures**, not read off a page the gate can check. The gate checks Battle Brothers' numbers byte for byte and the 2016 herd numbers against the bank's own citations; the CDC and WHO ranges are marked "from memory; TUNING verifies" in the bank. A number this lane cannot prove is written as a draft, never as a fact.
2. **Thirty to forty days is a struck-down man's rule, not a sick man's.** Paolo's 9/27 ruling locks 30 to 40 days for a man struck down in a fight. A sick man's days are a different row and the real courses run 1 to 6 weeks; the bank drafts them per sickness and TUNING owns them. This page does not stretch the locked number to cover a case it was not spoken for.
3. **The main character never dies (the third votes).** A sickness death roll on the main character is refused by the same rule that refuses the fight's; the bank's rolls are for the company and the place's people.
4. **Whether a 2026 plague season is on in Clark County.** A 7/2026 Las Vegas news item reports plague confirmed in several animals; the text could not be read past its headline from here. The 2001 and 2003 Mount Charleston detections and the 2006 report stand as the sourced ground.
5. **A beast's loot is not yet a thing.** The seventeen's WORTH column (pelt, meat, hide) is a design line, not an inventory item; the thaw's BUTCHER verb waits on COMBAT and RUN TWO's bag ([the inventory]).

## 7. BETTER THAN BATTLE BROTHERS (rule 80, this page's line)

Battle Brothers: a town is sick for no reason, a brother is sick for 1 to 3 days from a potion or a swamp, and nothing a brother does to a beast ever makes him ill. Ours: every sickness is a verb the player chose (butcher, dig, scavenge, crowd), it comes from a real thing in the real valley's ground or from the lab's own herd, and the ground where the herd died stays deadly across the three acts. Added as line 23 in records/BOHEMIA_BETTER_THAN_BATTLE_BROTHERS_10_9_26.md.

## 8. ROUTED

- **PEOPLE (the round the hold lifts):** `sickFact(sicknessId, key)` beside `injuryFact` in engine/bohemia_long_injury.js: the Sick row's effects for the days, the sickness's mark if the roll says it does not heal clean, one `healDay` clock for both; the keeper's lines from the bank through the talking portrait (rule 19c).
- **RUN TWO [settlement traits]:** the `sickness` trait takes a `from` field (the_thaw, the_dust, the_mouse, the_flea) and is rolled from a cause, never from the week alone; the Drought situation is the model (it names its heatwave).
- **TUNING (research):** the four rows this page drafts (days down, death roll untreated and treated, the 80 − hitpoints chance, the dead-ground years) verified against the CDC, WHO and the 2021 paper; the trait's 1.1 / 0.8 / −1 against the book's +100% / +200% / −25%.
- **WORLD:** a wet winter in the weather file is a mouse year the summer after; the dead-ground field on a map cell that the derive carries (rule 31).
- **DYNASTY [the flip unlocks at the crisis]:** the first district-wide outbreak (a whole place taking the trait with a cause) is a candidate for the crisis that opens act 2; the single carcass is not.
- **LIFE+CITY:** the dig verb (the wall, the tank, a foundation) hands the roll its men; the lidded tank and the wall each cut one sickness's chance on the lot.
- **COMBAT / RUN TWO [the inventory]:** a herd beast's hide and meat as loot; the loot is where the thaw's BUTCHER verb lands.
- **COOK THREE / PORTRAIT:** a sick man's face (the fever, the lung) is a paint state, not a new face; the clinic keeper's cots are a settlement picture state.

## 9. [bb school] AND [analog horror]

[bb the plague]: Battle Brothers never shows you why a town is sick and never lets a brother catch anything from a beast; the only animal that ever sickens the company is the ratcatcher's own rats, 80 − hitpoints, one event in three hundred. We keep the formula and the quiet (the player learns the dust by coughing) and add the one thing the book left out: the cause on the face of the trait.
[ah]: the horror is a cow that lay down in a dead dairy in Moapa with nobody to tell you not to eat it; the clinic's cots with the windows boarded "to keep it in"; a field in act 3 with a hand-painted sign from act 1 that says DON'T GRAZE and no one left who remembers why. The emptiness and the sign, not a filter.

## 10. GATE

gates/the_plague_gate.js, THE PLAGUE in the suite. A: a draft bank, four sicknesses, unique ids, tuned false. B: every Battle Brothers quote in the bank is found byte for byte on its own named page, read out of the tarball at gate time, with a planted wrong number as the negative control. C: every mark is a real permanent row of injuries.json; the Sick and Infected Wound rows exist as temporary. D: every settlement trait named exists; every place named is one of the 26 in banks/BOHEMIA_WHO_LIVES_WHERE_10_17_26.json. E: the measured gap holds: the live sickness trait carries no cause, and no engine file writes injury id sick on a person. F: the hold holds: nothing in engine/ or slices/ reads the bank. G: the page exists, names the bank, carries PROVES US WRONG, ROUTED, the [bb and [ah lines; no VOTE item for this round. H: every player-facing line has a speaker and the bank is draft; no sickness fires before the first minute or the first fight.
