# JOBS 11/10: MORE CONTRACT KINDS THE BATTLE BROTHERS WAY (VAMILY rule 443(c), 441; EYES row 551; ask lines 567, 102)

THE ASK (the coordinator's routine, from his 'the whole enchilada', rule 443(c)): more contract kinds the Battle Brothers way (escort a
caravan, defend a place, hunt a beast, deliver, clear a place, collect a debt), each sized by the 11/10d budget, each a job he takes from
a person with a face, each ending with its real foe named (EYES 551: a place's fight came home as RAIDERS); and the first fifty days
rewarding a small strong crew (ask 102). Measure what kinds exist first. Proven on the real page on a phone both ways.

## 0. THE ANSWER
1. MEASURED FIRST: all six kinds already exist in the game (WORLD's job kinds, 10/24), but the boards held them thin: of 46 ordinary offers
   (the shelf's 28 and the job kinds' 18 board people), DELIVER had 1, COLLECT A DEBT 1, CLEAR A PLACE 2, DEFEND A PLACE 2, ESCORT 3,
   HUNT 5; a town's board (two jobs) almost never showed one. Three fights were still a fixed two men whatever the company (collect's
   nephews, the tyre yard's watchmen, the courier and his man); a defence's waves, a caravan's raids and a patrol's crews each took a
   whole contract. And only a leg's fight and a place's fight named their enemy at the end: on main, upright, the six ended 'THE RAIDERS
   ARE DOWN', 'A HOUSE MAN IS DOWN', 'THE PACK IS DOWN' (hyenas), 'THE PACK IS DOWN' (coyotes, for a crew on a dam deck), and only the
   debt named its men ('DON BETO'S NEPHEWS ARE DOWN').
2. FIFTEEN NEW CONTRACTS, three for each thin kind, each from a person with a name, a trade and a face, across camps, towns and forts and
   one, two and three skulls; the three new debts each with their own debtor, his own words and his three ways (take it all, take half,
   pay it yourself). Paid by ECONOMY's formula (tools/bohemia_economy_job_pay.js, the bake).
3. EVERY CONTRACT SIZED BY THE BUDGET: the three fixed fights are now a share of the contract (two men at Battle Brothers' floor, more as
   the company grows); a job of several same fights splits one contract (two fights 0.65 each, three 0.5 each).
4. EVERY FIGHT NAMES ITS FOE: the job's own words ride with every fight to the end screen ('THE ONES WHO CAME FOR THE PUMP HOUSE ARE
   DOWN', 'THE RAIDERS AFTER THE PROPANE TANKS ARE DOWN', 'THE THIEVES AFTER THE COLD BOX...'); an animal is named as itself, and when the
   ground turns a job's people into animals (the cold box's thieves came as one wild horse) the end screen says 'A HORSE IS DOWN', never
   the thieves.

## 1. HOW BATTLE BROTHERS DOES IT (reference/library/grok/wiki/PAGES_ALL.tar.gz)
- THE CIVILIAN CONTRACTS (bb_all/0441 Contracts): Defend Settlement ('Defend a settlement against a single or multiple waves of enemies'),
  Deliver Item ('Safely deliver cargo to a settlement'), Discover Location, Drive Away Bandits / Barbarians, Escort Caravan, the Hunting
  contracts and Roaming Beasts, Investigate Cemetery, Obtain Item, Restore Location, Return Item; the noble ones add Escort Envoy, Patrol,
  Raze Attached Location, Big Game Hunt and the war. Ours already carries a kind for all but Obtain Item and Restore Location (section 5).
- ONE BASE VALUE A CONTRACT (bb_all/0827 Game Guide): 'Each type of contract has a base value that ranges from 40 to 200. It's multiplied
  by the other variables.' A defence of several waves is one contract type with one base, not a contract a wave.
- WHO GIVES IT: every Battle Brothers contract comes from a settlement's own person, a face and a few lines; ours from a named person on
  the town's board (rule 19: a quest is people, places and things).
- OUR SWAG, KEPT: the stars are this crew's odds on AUTO (rules 208, 254); a debt is our own kind (the economy is the story), with the
  debtor's own choice; the end screen names who they were.

## 2. THE NEW CONTRACTS (records/target/BOHEMIA_JOB_KINDS.json board_people and offers; words draft:true)
| kind | the job | who gives it | skulls | tiers | pay |
|---|---|---|---|---|---|
| escort | Walk the propane tanks to the truck stop | Lalo Ferrán, who fills the tanks behind the laundromat | 1 | camp, town | 40 |
| escort | Bring the seed sacks up from the river | Hermana Rocío, who keeps the greenhouse alive | 2 | town, fortress | 80 |
| escort | Ride with the clinic's van to the hospital | Doctora Amaya, who runs the clinic out of a school | 3 | fortress | 168 |
| defend | Hold the pump house till morning (one wave) | Don Abel, who keeps the water running | 1 | camp, town | 43 |
| defend | Keep the market standing two nights | Señora Quintero, who rents the stalls | 2 | town, fortress | 121 |
| defend | Hold the substation three nights | Ingeniera Paz, who keeps the last lines live | 3 | fortress | 251 |
| deliver | Carry the cold box to the camp | Enfermera Lupe, who sleeps next to the fridge | 1 | all three | 11 |
| deliver | Carry the deed to the courthouse | Licenciado Barrera, who still files papers nobody reads | 2 | town, fortress | 20 |
| deliver | Carry the fuses over the pass | Maestro Tirado, who fixes what the grid broke | 3 | fortress | 30 |
| clear | Run the squatters off the car lot | Chuy Valdés, who wants his lot back | 1 | camp, town | 43 |
| clear | Clear the crew out of the motel | Madre Inés, who runs the soup line | 2 | town, fortress | 80 |
| clear | Take back the bus yard | Comandante Ruelas, who wants the buses running | 3 | fortress | 120 |
| collect | Collect what Tito owes the bar (Tito, his cousins) | Mama Ceci, who runs the bar with no sign | 1 | camp, town | 33 |
| collect | Collect the rent from the garage (Nena Ortiz, her mechanics) | Don Ignacio, who owns the street, on paper | 2 | town, fortress | 60 |
| collect | Collect the casino's markers (Saúl Medina, his crew) | El Gordo Baez, who still keeps the casino's books | 3 | fortress | 90 |
The pay is ECONOMY's: a delivery is quiet work (no killing unless thieves come), so it pays by the hours (11 to 30); a three-night
defence pays for three fights (251). FOUND, ROUTED TO ECONOMY: the pay formula counts a defence's three waves as three whole fights,
while a wave is now half a contract (section 3): the pay runs ahead of the danger on the long defences.

## 3. SIZED BY THE BUDGET (party_math.json job_contract.split; the job kinds' legs fight.share; TUNING's one table section Y)
- A JOB OF SEVERAL SAME FIGHTS IS ONE CONTRACT: split {2: 0.65, 3: 0.5}: each of a defence's waves, a caravan's raids or a patrol's crews
  carries that share of the contract's count (the old step of one more man from the second wave kept). A new crew's three-night defence
  at three skulls (a contract of 6): waves of 2, 4, 4 (were 5, 7, 7); two nights at two skulls (5): 2 and 4 (were 4 and 6).
- A LEG'S OWN SHARE: collect 0.67, burn 0.4, follow 0.4, and the three new debts 0.67: two men at Battle Brothers' floor (a new crew's
  contract is 3 at one skull and 5 at two), more as the company grows; was two whatever the company.
- THE SAME COUNT BOTH WAYS: the hand-over (the fight he meets) and the stars' fights (fightsOf) read the same split and shares.
- MEASURED: section 6.

## 4. EVERY FIGHT NAMES ITS FOE (slices/bohemia_job_kinds.js __EVERY_JOB_NAMES_ITS_FOE__; the job kinds' foe_says)
- The hand-over (fight()) carries the job's own name for its enemy, from foe_says by the fight's part of the job (a wave: 'the ones who
  came for {what}'; a raid: 'the raiders after {cargo}'; a camp: 'the crew at {place}'; a thief: 'the thieves after {item}'; a lair, a
  patrol's crew, the crew at a gate, the ones holding a thing, the ones who lay in wait), a row's own words first (the car lot's squatters,
  the motel's crew, the bus yard's gang), an animal by its own name ('the hyenas', 'a wild bull').
- slices/bohemia_job_danger.js rollInto (a marked line, WORLD's file): when the ground turns a job's people into animals, the end screen
  names the animals ('A HORSE IS DOWN', 'A TERATORN IS DOWN').
- slices/BOHEMIA_SPOILS_SCREEN.html theyWere (a marked line, RUN TWO's file): one is IS ('A WILD BULL IS DOWN'), many ARE.

## 5. WHAT IS NOT HERE, SAID
- Battle Brothers' Obtain Item and Restore Location have no kind of ours yet (recover-return is the nearest to Obtain; Restore fits
  THE FUTURE GETS BETTER and HOME BASE's seam, rule 445). Not built this round: a kind is a new way to play on the map, not a row.
- The walk to each job's spot is the one shortcut of the phone proof (the crew is put on the spot and the map's own arrival or step is
  called); the board, the fight, its end screen and LEAVE are the page's own. EYES walks it whole (rule 441(b)).
- The new words are attempts (draft:true); WORDS' to overwrite.

## 6. MEASURED: WHAT ONE CONTRACT FOR SEVERAL FIGHTS DOES (tools/bohemia_jobs_fit_the_company.js, a new crew, 20 valleys, days 1 and 20)
The same survey with the split and the legs' shares taken away in the page (--plant nosplit: the 11/10d math) and as it is now; every
offer three places a valley could post, read on AUTO 12 plays a fight.
| of every job dealt, lost more often than won | day 1 before / now | day 20 before / now |
|---|---|---|
| all jobs (1,877 and 1,878) | 105 / 138 (6 / 7 in 100) | 331 / 275 (18 / 15 in 100) |
| defend a place (143, 144) | 0 / 48 | 85 / 35 |
| escort a caravan (166, 168) | 16 / 14 | 45 / 41 |
| patrol (79, 78) | 30 / 0 | 1 / 2 |
| collect a debt, the tyre yard, the courier (246) | 0 / 0 | 0 / 0 |
Over both days: 436 lost of 3,755 before, 413 now (11.6 and 11.0 in 100). The posted boards (what he sees, the day's filter on): 0 lost
on day one both ways; day 20 6 before, 4 now.
ONE FINDING THAT PROVES US WRONG: smaller waves are not always easier, because THE FIGHT'S SIZE IS PART OF THE DICE THAT PICK WHO THE GROUND
SENDS (the reader's band roll is seeded by the fight's count: 'band:' + key + count + faction, and FACTIONS' road mix turns a job's
brigands into whatever lives on that ground). The day-one defences that went from 0 to 48 lost are almost all one job, 'Keep the market
standing two nights', wherever it stood (six of K7QM9X's places): before, its second wave came as two house men (0.86); now, a man smaller,
it comes as two bison (0.19), and a few as a lone bull (0.50).
Bison stand at the fight's own 0.4 of the count (FACTIONS 11/3), so two of them face three men; a new crew of three cannot take two Ice
Age bison. The split lowers every job's count; what the count turns into is the ground's. ROUTED: TUNING and FACTIONS, the big beasts'
cost for a small crew (bison 0.4, bulls 0.2: measure them with tools/bohemia_jobs_beast_cost.js the way the wolves were); WORLD, a band's
dice that do not move with its count (a change to every band in the game, so not this lane's alone).

## 7. THE FIRST FIFTY DAYS: THE SMALL STRONG CREW (ask 102, rule 183), OVER 20 VALLEYS
The boards the Lone Wolf sees (posted, the day's filter on), alone and with five ordinary level-1 hires, the same 20 valleys (the
survey's boards-only mode; 11/10d's math, before the split):
| | day 1 | day 20 |
|---|---|---|
| the Lone Wolf alone: one-star jobs on his boards | 97 in 100 (560 jobs) | 99 in 100 (560) |
| the same wolf with five ordinary hires | 67 in 100 (517) | 60 in 100 (496), 65 jobs he loses more often than wins |
| pay a man a job, alone / with five | 68 / 10 batteries | 69 / 10 |
Battle Brothers' lesson holds in ours: a man added to a small strong crew is worth more danger than help (Battle Brothers: 'each
additional level 1 character... is worth 6 levels in strength'), and the purse is the job's, never a head's. The hire that pays early
is the rare one (HIRES 11/3, the rare men at the post), as rule 183(a) asks.

## 8. GATES (this tree, before the ship)
- THE SIX CONTRACTS (new, gates/the_six_contracts_gate.js, in the suite): 14 passed, 0 failed. S1 each of the six kinds 4 to 6 ordinary
  offers, two tiers or more, every one a face saying its pay; S2 foe_says 9 of 9 fight parts; S3 split 2 and 3 in section Y and every code
  site; S0 (JOBS_PLANT=1) the three planted copies each red; S4 ECONOMY's bake; S5 the twelve end screens on the phone (six kinds, upright
  and sideways) each name who they were; S6 the names planted away in the page: the defence's end screen reads WAVE 1 AT ? ARE DOWN, caught;
  S7 nothing threw.
- JOBS THAT FIT THE COMPANY (11/10d's gate, re-run after the split, 20 seeds, days 1 and 20): 9 passed, 0 failed. D1 a new crew's dealt
  jobs 360 of 3,755 lost more often than won (10 in 100; day 1 6, day 20 13; the bar 15); D2 1,080 posted, none under the day's floor, none
  lost more than won on day one; D3 the Lone Wolf alone 37 of 3,755 (1 in 100), wolf and hyena jobs 0 of 125; D4 wolf and hyena jobs 48 of
  125 (38 in 100, the bar 45), hunts 35 of 192 (18, the bar 35); D5 planted (the math before, 3 seeds) 13 of 17 (76 in 100), caught; D6
  nothing threw. (The survey does not repeat across boots, said in 11/10d: this run's D1 is 10 in 100 where section 6's run read 11.)
