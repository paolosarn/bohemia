# EVERY NUMBER OF BATTERIES, AND THE ONE TABLE (ECONOMY TWO, 11/18/26; VAMILY rule 459, ask line 645)

HIS WORDS. 9/4: 'for one AA battery a bag of rice.' 11/17: 'some of the quests, it's like 3000 or like 1000 batteries to
complete a quest and I'm like bro that's a lot... I want people to really feel like they can look at their battery right now and
relate it from the game to real life: hey, because this game said it, it's true, this would probably cost a couple batteries in
the economic apocalypse.'
BUILT ON: records/BOHEMIA_RESEARCH_HOW_MANY_BATTERIES_ARE_IN_THE_UNITED_STATES_11_17_26.md (a rechargeable AA holds about 2.4 Wh;
a phone's battery is about 6 AA's, a tool pack 20, a car's battery 250).
THE BUILD: BUILD 11/18t - THE BATTERY IS REAL. The table: records/target/bb/battery_table.json. Its hands:
tools/bohemia_economy_two_the_battery_table.js (seed, stamp, check, list, sums). Its gate: gates/the_battery_is_real_gate.js.

## 1. WHAT MAKES A QUEST PAY 1,000 (measured on the code, then on the page)

A job's pay is made in one place (slices/BOHEMIA_CITY_WORLD.html loopJobPay; the town's board prints the same sum, payShown):

    pay = round( (the job's base + the origin's bonus) x the shelves x CLOUT x the town's standing )

| what | from | to | where it lives |
|---|---|---|---|
| the job's base, pushed twice at the card (x1.07 each) | 10 | 251 (287 pushed) | records/target/bb/job_pay.json pays (102 jobs); relations.json haggle |
| the origin's bonus | 0 | 1 | records/target/bb/origins.json pay |
| THE SHELVES, his pick at the start screen | x0.75 | x1.5 (FULL, the pick the door opens on) | typed in the shell (BOHEMIA_ALPHA_0_9.html ECON): no data file |
| CLOUT (fame) | x1 | x4.5 at 4,000 | records/target/bb/renown.json pay_mult |
| the client town's standing | x0.85 | x1.15 | records/target/bb/job_pay.json standing |

So: day one on FULL SHELVES the dearest job pays 378. At the top of CLOUT in a town that calls him family it pays 1,956, and
with the pay pushed twice 2,236. THAT IS HIS 1,000 AND HIS 3,000: nothing else in the game reaches 1,000 as one payment
(two jobs held at once add to 4,472). CLOUT climbs 100 a job and 5 a man beaten, so about fifteen jobs in, the board reads
over a thousand. Twelve of the 102 jobs can reach 1,000; forty-six can reach 500.
The other sums over 500 he can meet, all in the town: a coat of plates 700 on a fortress shelf (to 1,376 on a market day in a
town that hates him), MEND IT ALL for a big armoured company (1,128 and up), a rare road knight at the hall 573, the cart's
last step 500.

## 2. THE LIST: EVERY NUMBER OF BATTERIES A PLAYER SEES, IS PAID OR IS CHARGED

669 numbers in 18 data files, each a row of the table (the table's `where`; `node tools/bohemia_economy_two_the_battery_table.js list`):

| # | where it lives | what it is | how many | from | to | band |
|---|---|---|---|---|---|---|
| 1 | `bb/nightly_bill.json` `per_man_per_night.value` | food and water for one man for one night: the bill at nightfall (two bags of rice's worth: a can and a bottle) | 1 | 2 | 2 | a_mans_night |
| 2 | `bb/origins.json` `origins[*].door.wage_per_man_per_night` `origins[*].personal.rule.does.wage` | the fight pit's founding men are paid, each a night | 2 | 6 | 6 | a_mans_night |
| 3 | `bb/stall_prices.json` `goods.*.buy.value` | the stall, one unit: a night of food and water, a dose of meds, six rounds, a roll of tape | 4 | 1 | 2 | everyday |
| 4 | `bb/stall_prices.json` `buy_floor.value` `trade.sold_floor.value` | nothing at a stall costs or pays under one AA | 2 | 1 | 1 | everyday |
| 5 | `bb/stall_prices.json` `trade.goods[*].worth` | a trade good's price where it is made (twelve goods) | 12 | 10 | 52 | trade_good |
| 6 | `bb/loot.json` `counts.batteries.pocket` `counts.batteries.machine_cell` | what one beaten man had in his pocket (55 in 100) and the cell out of a machine | 2 | 1 | 1 | everyday |
| 7 | `bb/job_into_place.json` `worth.value.battery` `worth.value.per_tape` | what a build is worth when a job pays it into his place: its AA and an AA a roll of tape | 2 | 1 | 1 | everyday |
| 8 | `bb/home_base.json` `bill.keep` `bill.power_cost_by_mark.*` | his place's keep a night and what the dark costs it | 5 | 0 | 1 | everyday |
| 9 | `bb/home_base.json` `builds.solar.worked.batteries` | what one worked solar panel at his place puts by a morning (GAMIFIED, 9/5 s4; who holds the sun is not decided) | 1 | 1 | 1 | everyday |
| 10 | `bb/home_base.json` `places.yard.per_level` `places.yard.min` | his training yard: an AA a level of the man, never under two | 2 | 1 | 2 | everyday |
| 11 | `BOHEMIA_ROAD_EVENTS.json` `events[*].opts[*].**.bats` | what a stop on the road gives, takes or asks (81 stops) | 128 | -60 | 60 | the_road |
| 12 | `BOHEMIA_SIDE_QUESTS.json` `quests.*.stages.*.fx.bats` `quests.*.stages.*.fx.**.bats` `quests.*.stages.*.fx.pay_why.win` | what a side quest's end pays (and the worked line beside it) | 70 | -8 | 34 | the_road |
| 13 | `BOHEMIA_SIDE_QUESTS.json` `quests.*.stages.*.fx.pay_why.quiet_rate` | the quiet rate a side quest's pay was worked from | 30 | 10 | 10 | job_part |
| 14 | `bb/real_places.json` `places[*].visit.opts[*].**.bats` | what a real place gives, takes or asks on a visit | 38 | -6 | 12 | the_road |
| 15 | `BOHEMIA_JOB_KINDS.json` `kinds.*.legs[*].talk.opts[*].fx.bats` `offers.*.legs[*].talk.opts[*].fx.bats` | a talk inside a job: paying a man's debt yourself, what a deal puts in your hand | 6 | -45 | 15 | the_road |
| 16 | `bb/job_pay.json` `pays.*.pay` | THE BOARD: what each of the 102 jobs pays before fame, shelves and standing | 102 | 10 | 251 | job |
| 17 | `BOHEMIA_BOARD_SHELF.json` `offers[*].pay` | the board's own copy of those pays (39 people) | 39 | 10 | 251 | job |
| 18 | `BOHEMIA_JOB_KINDS.json` `board_people.rows[*].pay` | the job kinds' own copy of those pays (63 people) | 63 | 10 | 251 | job |
| 19 | `bb/job_pay.json` `per_fight.value` `floor_per_skull.value` `violence.value.quiet_floor_per_skull` | what a job's pay is built from: a fight at one skull, the least a killing job pays a skull, the least a quiet one pays | 3 | 10 | 30 | job_part |
| 20 | `BOHEMIA_BOARD_SHELF.json` `pay_per_skull` | the old floor a skull, kept on the shelf | 1 | 30 | 30 | job_part |
| 21 | `bb/origins.json` `origins[*].pay` | an origin's bonus on every job (four origins: one AA) | 15 | 0 | 1 | everyday |
| 22 | `bb/boss_act_one.json` `bosses[*].verb.pay_batteries` `bosses[*].ground.till` `bosses[*].tooth.tax` `bosses[*].verb.cost` | the bosses: what a verb pays a time, THE POT's till, THE TOOTH's tax a town a day, a fade | 6 | 1 | 30 | the_road |
| 23 | `bb/boss_act_one.json` `bosses[*].verb.item.price` | the two things a boss's verb makes (a pipe gun, a pressed plate) | 2 | 13 | 120 | gear_piece |
| 24 | `bb/retinue.json` `followers.value[*].price` | the eighteen who join the camp, once each | 18 | 200 | 390 | big |
| 25 | `bb/retinue.json` `followers.value[*].nums.champPayLo` `followers.value[*].nums.champPayHi` `followers.value[*].nums.placePayLo` `followers.value[*].nums.placePayHi` | what two of them bring in: a champion's head, a place found | 4 | 10 | 75 | prize |
| 26 | `bb/arena.json` `opponents.value[*].purse` `tournament.value.purse[*]` | the pit: a night's purse and the tournament's three rounds | 12 | 35 | 150 | prize |
| 27 | `bb/arena.json` `purse_per_extra.value` | the pit: more a head when they send extra | 1 | 5 | 5 | everyday |
| 28 | `bb/origins.json` `origins[*].batteries.*` | THE START: what each of the fifteen origins has on full, thin and bare shelves | 45 | 45 | 320 | purse |
| 29 | `bb/origins.json` `origins[*].door.wagon_goods_batteries` | the water truck's goods, counted in AA's (read by a tool, not the game) | 1 | 134 | 134 | purse |
| 30 | `bb/renown.json` `pay_mult.value.from` `pay_mult.value.to` `pay_mult.value.at` | CLOUT: every job pays from x1 to x4.5, full at 4,000 | 3 | 1 | 4000 | a ratio |
| 31 | `bb/job_pay.json` `standing.value.*.mult` | the client town's standing bends the pay: 0.85 to 1.15 | 9 | 0.85 | 1.15 | a ratio |
| 32 | `bb/job_pay.json` `crew_cost_per_map_hour.value` `margin.value` `violence.value.quiet_margin` | what twelve men burn an hour, and how much over it an hour of a job pays | 3 | 0.5 | 1.375 | a ratio |
| 33 | `bb/job_into_place.json` `share.value` | the most of a job's pay that can be a build | 1 | 0.25 | 0.25 | a ratio |
| 34 | `bb/stall_prices.json` `sell_share.value` `sell_share_max.value` `sell_floor_share.value` `size_mult.value.*` `trade.made_here.value.*` `trade.not_made.value.*` | the stall: what it pays back, what a place's size does, a good made here or not | 10 | 0.15 | 1.5 | a ratio |
| 35 | `BOHEMIA_HALL_PRICE.json` `easier` | the hall: a hire costs four fifths of the wiki's formula | 1 | 0.8 | 0.8 | a ratio |
| 36 | `bb/price_table.json` `conversion.crownsPerBattery` `conversion.floorBatteries` | the catalog rule's copy the old price engine reads | 2 | 1 | 10 | a ratio |
| 37 | `bb/origins.json` `defaults.crowns_per_battery.value` | the catalog rule's copy beside the origins | 1 | 10 | 10 | a ratio |
| 38 | `BOHEMIA_JOB_KINDS.json` `kinds.*.legs[*].talk.opts[*].pay` `offers.*.legs[*].talk.opts[*].pay` | a talk inside a job: the share of the pay a choice leaves (0 to 1.2) | 16 | 0 | 1.2 | a ratio |
| 39 | `bb/retinue.json` `followers.value[*].nums.wage` `followers.value[*].nums.hire` `followers.value[*].nums.food` | the paymaster, the recruiter and the cook: what each takes off the wages, a hire, the food | 3 | 0.85 | 0.9 | a ratio |
| 40 | `bb/home_base.json` `bill.water_cost_by_mark.*` | his place: far water makes a man's night dearer (x1 to x1.5) | 3 | 1 | 1.5 | a ratio |

THE CATALOGS (a worth in the wiki's crowns, turned by ONE rule: ten crowns to one AA, to the nearest, never under one):
151 weapons (3 to 350 AA's), 99 body armours (1 to 800), 105 helmets (2 to 600), 19 shields (5 to 120), 77 kinds of man (a wage
of 0 to 4 a night at level 1, to 9 at level 11), 14 rare men, the pit's two prizes, a wound's treatment. The rule is in the
table (catalogs); its eleven typed copies in code are held to it.

TYPED INTO CODE, with no data file (122 copies; the table's `copies`, each held by the gate):
- ONE AA EACH, from EVERYTHING COSTS ONE (8/15), never tuned since: a build on a lot (and its tape), the barber's chair, a
  round at the bar a head, a mastery swapped at a fortress yard, a battery found scavenging, a billed block of a faction's
  ground crossed in a day (RENT: measured 34 a night), a power building's battery a day, a day's work (hidden in the demo).
- THE CART's four steps: 100, 200, 350, 500 (engine/bohemia_camp.js). THE SHELVES: 1.5, 1, 0.75 (the shell).
- COPIES OF A DATA FILE's number for the first frame before the file lands: the map's and the crew screen's night (2), the
  stall's food (2), the board's four fallback jobs (30 a skull), CLOUT's x1 to x4.5, the job engine's 26 / 30 / 10 / 1.375,
  the eighteen who join the camp (twice: the camp engine and the old camp staff), the door's fifteen start purses.
THE NUMBER INSIDE A SENTENCE (17 sentences in data files; the table's `prose`): the bosses' verbs ('People pay you 6
batteries', '12 batteries, once a tower', '8 batteries, once a door', '1 BATTERY, +25 CLOUT'), the fight pit's 'Each costs 6
batteries a night', the bounty hunter's '30 to 75 batteries a head', the cartographer's '10 to 40', and four talks inside a job
('Pay his debt yourself: 20 batteries.'). `stamp` moves the digits and never a word (rule 454(a)).

HOW A SUM WAS DRAWN: SEVEN WAYS, one a lane. (1) the bar's purse: the pile and a number. (2) a shelf tile: a number and a mark
drawn by the style. (3) a stall's box: an image and a number. (4) the board, the build sheet, the camp: UI FOUR's chip.
(5) a hire's price and his night: UI's own split of the words. (6) one who joins the camp, 'Into your place', the hall's
'COSTS MORE (+448)': a bare number. (7) every line from a mouth and the map's lines: 'N batteries' in words.

NOT LIVE (kept on the list so nobody re-finds them): engine/bohemia_pricetable.js is loaded by no page (price_table.json's
sell cuts, daily rates and contract sample are read by nobody; the hall reads only its wageAndHire). The walked city's market,
WORK, the builder, the lend card, the old six camp staff and the haggle card are hidden in the demo or retired with the walk.
ours.json cell_vest is read by nothing.

## 3. THE ONE TABLE

THE UNIT IS THE AA. One AA buys a bag of rice (his anchor). In the old numbers one AA is ten crowns of the wiki's worth
(his 10/1 ruling), never under one: that is what already made an everyday thing cost 1 to 10.

THE LADDER (the research's, each a real thing with its picture, made through the rig):

| the battery | AA's | what it holds | what it buys |
|---|---|---|---|
| an AA | 1 | about 2.4 Wh | a bag of rice |
| a phone's battery | 6 | about 15 Wh, one full phone charge | six bags of rice |
| a tool pack | 20 | about 50 Wh | twenty: a stack of twenty rolls of tape |
| a car's battery | 250 | about 600 Wh | a man who joins the camp for good |

HOW A SUM IS PAID (one rule, the same everywhere): THE FEWEST KINDS OF BATTERY, THE BIGGEST FIRST. Car batteries, then tool
packs; what is left under a tool pack is phone batteries when they make it exactly (6, 12, 18), else AA's. So every count on
the glass is small: never more than 12 tool packs, 3 phone batteries or 19 AA's, and never more than three kinds.
1,000 is 4 CAR BATTERIES. 3,000 is 12. His 2,236 is 8 car batteries, 11 tool packs and 16 AA's. Ten is ten AA's.
WHY NOT STRAIGHT 'FEWEST BATTERIES': the prices were written in tens, and ten would read 'a phone battery and four AA's',
thirty 'a tool pack, a phone battery and four AA's'. A phone battery is paid when it is the whole of what is left.

THE BANDS (the gate holds every row to its band):
- everyday things 1 to 10: a night of food and water 2, a dose of meds 1, six rounds 1, a roll of tape 1, a haircut 1
- a man's night a few: fed 2; fed and paid 3 to 6 at level 1, to 11 at level 11
- a trade good tens (10 to 52); a stop on the road 1 to 60; a purse in the pit 35 to 150
- gear tens to a few hundred: the dearest piece in the game is 800 (three car batteries, two tool packs, ten AA's)
- a job 10 to 251 on the board; the most one job can ever pay is under ten car batteries
- a start purse 45 to 320; one who joins the camp 200 to 390

## 4. WHAT I CHANGED, WHAT I KEPT, AND WHY

KEPT, every ratio the balance rests on:
- A JOB AGAINST A CREW'S KEEP: an hour on a job pays double what twelve men burn in it, a fight 26 a skull (job_pay.json).
- CLOUT's x1 to x4.5. A man's wage grows x2.6 by level 11 and the crew grows from 3 to 12, so the keep grows about as fast
  as the pay. Cut the one without the other and the late game cannot pay its men. It is the one thing that makes a thousand,
  and it is TUNING's to move with the wages, never alone.
- TEN CROWNS TO ONE AA. The stall pays half, a shop a seventh.
CHANGED:
- THE SEVEN WHO JOIN THE CAMP AT 300 AND 400 ARE 290 AND 390 (the blacksmith, the negotiator, the quartermaster, the
  recruiter, the scavenger; the agent, the bounty hunter): a car battery and two tool packs, a car battery and seven. A
  standing price over a car battery is whole tool packs, so it is two kinds on a small button, never three. 3 in 100 cheaper.
- THE DOOR'S TYPED START PURSE was 3 to 7 (a number from EVERYTHING COSTS ONE, used only if origins.json never lands); it is
  each origin's THIN purse now (70 to 270). origins.json itself is unchanged.
- NO OTHER NUMBER MOVED. What changed for him is what he SEES: a sum is the batteries it is paid in.

## 5. THE BUILD

- records/target/bb/battery_table.json: the unit, the ladder, the bands, the catalog rule, where every number lives, the
  rows, the typed copies, the sentences, the worked sums. tools/bohemia_economy_two_write_the_table.py and
  tools/bohemia_economy_two_the_table_copies.py write its hand-written half; the tool's `seed` reads the rows from the game.
- A PRICE MOVES ONE WAY: edit the row, `stamp`, `check`. `stamp` changes only the digits in place (a data file, a typed copy
  in code, the number inside a sentence): nobody's file is re-written whole.
- slices/bohemia_the_battery.js, loaded by the map, the town, the crew screen, the fight, the alpha and the demo: the split
  and the drawing. It draws 'N batteries' wherever a page writes it and the seven places above (the bar's purse, a shelf's
  tile, a stall's box, UI FOUR's chip, a hire and his night, one who joins the camp, a job on the map's phone). THE WORDS
  STAY IN THE PAGE at no size, letter for letter (UI FOUR's rule), so every screen and every gate that reads a line reads it.
- slices/battery_ladder/ (four pictures and four small marks) through DIRECTION's rig:
  tools/bohemia_economy_two_the_ladder_through_the_rig_11_18_26.py; models and ledger in records/target/economy_two_ladder_rig/.
- gates/every_count_a_picture_gate.js (UI FOUR's) reads a battery chip's number from the chip and takes the ladder's
  pictures: three marked edits, nothing else of theirs touched.

## 6. FOUND ON THE WAY (not mine to fix this round; each is named for its owner)

FOR WORDS TWO (rule 454(a): no line rewritten; the numbers are right, the words beside them are not):
- seven road stops whose words and number disagree: the toll kids say 'five a head, or ten for all of you' and it is always
  10; the preacher says 'give one battery' and the choice takes 5; the radio keeper says 'put four back' and takes 8; the
  cartel says 'a tenth of everything' and takes 8; the runway stall names a 20 nobody can pay; the debt names a 60 that is
  never charged; the dead ATM says 'the battery' and gives 3 (records/target/BOHEMIA_ROAD_EVENTS.json)
- 'Paid N battery' is singular for every N (the map, loopTakeContract's settle line); the build desk says '1 batteries'
- jk-collect-beto's client says 'owes me forty' beside a pay the multipliers have moved
- WHEN THE VOICE LANDS: a mouth still says 'batteries'; the glass draws the things. A big sum in a mouth should name them.
FOR JOBS: 'Into your place -5' is a bare number (no unit, so nothing draws it); the fixed 'Pay it yourself: 15 / 30 / 45'
sit beside a pay CLOUT multiplies, so late in the game paying a man's debt yourself is nearly free.
FOR UI FOUR (how a sum is drawn is yours): the classes are .bsum, .bsum-k (data-kind the kind, data-n the count), .bsum-w (the
words); a host is marked .bsum-host. The hall's 'COSTS MORE (+448)' is a bare number still. A shelf tile is two short lines.
YOUR HALF OF THE AGREEMENT (records/BOHEMIA_UI_FOUR_THE_STALL_FITS_ON_ITS_SIDE_11_18_26.md, its last section) landed on main
while this build was being proved; read against it: points 1, 3 and 4 are as built (the AA the unit; the kinds and their
worth read from the table's ladder.value; one drawer, BohemiaBattery.node(n), the words kept at no size); YOUR TWO ASKS: the
file is records/target/bb/battery_table.json, the fields id, worth, name, many, icon, small, only_whole; A SUM IS PAID EXACT,
always. POINT 2 DIFFERS: you wrote no count over 9 (387 = 1 car, 6 packs, 2 phones, 5 AA: four kinds); this build draws at
most THREE kinds (387 = 1 car battery, 6 tool packs, 17 AA) and a sum under 20 as plain AA's unless phone batteries pay it
exactly. Why: three kinds at 2,236 already ran 13 points past the top bar upright until they were drawn smaller, and '11 AA'
is the anchor he asked for where '1 phone battery and 5 AA' is a sum to do. It is one function (split) and yours to change.
POINT 5: the four pictures are this lane's own models through the master rig, STAND-INS until DIRECTION and COOK make them
from the packs (the same file names).
FOR JOBS, SEEN ONCE IN THREE RUNS: THE TOWN'S BOOK E3 on the demo chose Cartel, not Caravans, and read NOT OK; green on the
next run of the same tree and on main. A probe of both trees shows a board's picks from the second window on change with the
session's seeds.
FOR HOME BASE: a build still costs ONE AA and its tape, a worked panel still makes one AA a morning; both are rows. Who holds
the working sun is NOT DECIDED (rule 459(e)): nothing here is built on it.
FOR TUNING: the shops round a worth before the town's markup, price_table.json says after; the hall floors where the shops
round; arena.json's harness says 150 crowns and armor.json 75; engine/bohemia_stall_prices.js defaults sell_floor_share and
sold_floor to 0 where the file says 0.15 and 1.
FOR FIXES: EVERY COUNT A PICTURE upright B, N, H were red on main since the cameras build when this build began; UI FOUR
re-aimed that gate in BUILD 11/18e (it presses the cameras as he would).

## 7. PROVED ON THE PAGE (rule 441)

GATE THE BATTERY IS REAL 43/0, read on the tree rebased onto main 387b6a14 (twenty-eight builds landed while this was proved): the
table 7/0 (eight planted faults, each red by its own words), then one walk of nine legs on the demo upright, the demo
sideways, the alpha upright, the alpha sideways (a 390 x 844 phone at 3, touch), each started the way he starts it: the bar's
purse, the board, the stall, the hall, the smith's and the armourer's shelves, then the top of CLOUT with a purse of 2,236
(the game's own record set, the one shortcut, said), the map's line for a job taken, and the drawing switched off on the live
page (red). THE WALK FOUND AND FIXED, before the ship: a hire's two-kind price ran 6 points past its button (the button is
HIRE, his price, his night, three lines now); with a purse of 2,236 the bar ran 13 points past the glass upright (three kinds
draw smaller there: it ends at 369 of 390); a shelf tile's price took a page rule's 16-point gold (two short lines at 9 now,
inside every tile). THE NEIGHBOURS' GATES FOUND TWO MORE, fixed before the ship: the pictures carried an attribute named
data-k, which UI's no-scroll audit reads as a press, so every picture was a press under 44 points (SCROLLING IS ILLEGAL 23/14;
the attribute is data-kind now and a picture lets a finger through to the button it stands on: 36/1, the one being the
settings card's own, red on main); the bar's hidden old pile read as an icon of no height to THE SIX ON THE BAR (S3 red; that
gate reads the ladder's picture now, one marked edit: 9/0). ONE RED OF THE GATE'S OWN, fixed: on a loaded machine the walk
read the top board before it had opened (the tap had opened a job's card); the walk now opens the board until its jobs stand.
OTHER LANES' GATES ON THE REBASED TREE: EVERY COUNT A PICTURE 15/0, NO LINE CUT WHILE THERE IS GLASS 11/0, THE SIX ON THE BAR
9/0, THE BAR FITS HIS GLASS 22/0, THE RETINUE 29/0, THE HIRE PRICE IS THE FORMULA 10/0, TRADE GOODS CARRIED 26/0, DEMO BUILD
25/0, PAGES PUBLISH 30/0 (the site 862 MB of 900; this build adds 0.7 MB), THE TOWN'S BOOK (build E) 13/0 on the second run
(section 6, FOR JOBS). RED, THE SAME ON MAIN WITHOUT THIS BUILD (each run on a clean copy of main bf09c1b0 beside this tree, before the rebase): SCROLLING IS ILLEGAL N4, THE SETTLEMENT
SCREEN 71/4 (the same four lines), THE PHONE'S BOARD 6/12, MONEY TEACHES 3/1, A JOB PAYS FOR THE TIME AND THE RISK 22/1,
REFERENCE CHECK 516/2, REUSE-FIRST 401/19, INLINED-FRESH 0/1. Green before the rebase and not run again after it: HANDOFF 10/0, BATTERY
14/0, BATTERY WORTH 35/0, PLACEHOLDER NUMBER 14/0, ECONOMY 13/0, BUY VERSUS SELL 45/0, THE SIX AT PACK PIXELS 7/0.

## 8. NOT DONE
- A sum over 19 inside a mouth is drawn as pictures in the line; the mouth's own WORDS still say 'batteries' (454(a)).
- The crew screen's and the fight's own sums were not walked by the gate (they load the drawing; their sums are 'N batteries'
  in words, drawn the same way).
- No sound for a big battery set down. No night versions of the four pictures.
[bb Battle Brothers counts one coin and lets the number run to tens of thousands; ours is the coin and the things a coin is]
[analog horror: a man counting out twelve drill batteries on a hood, slowly, because a wrong count gets somebody killed]
