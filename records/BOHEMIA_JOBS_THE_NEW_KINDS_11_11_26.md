# JOBS: THE NEW KINDS, 11/11/26 (VAMILY rules 425, 441; the coordinator's routine 'JOBS next round')

THE ASK (the coordinator, from his months of asking for more jobs, rule 425): fifteen more jobs, each a job with people, a place and a
thing (never a card), each from the Battle Brothers contract kinds we do not yet have, each paying in batteries and name, each fitting
the town that offers it; and the job board shows what a job really asks before he takes it. Rule 441: each kind played to the end on
the real page, alpha and demo, phone both ways.

## 0. THE ANSWER
- MEASURED FIRST: of the kinds the coordinator named, escort, defend, hunt, deliver and find a person were all ours already (WORLD's job
  kinds; find a person on 2 ordinary offers). Battle Brothers' ROOT OUT, BREAK SIEGE, OBTAIN ITEM and RESTORE LOCATION (the two-part job)
  had no kind of ours: 0 offers each.
- NOW four new kinds, each written as a data row of WORLD's legs engine (no new play code: two small marked lines let a leg be 'the same
  place again' and 'round the client's own town'), and fifteen jobs: three each of root out, break the ring, get it, restore, and find a
  person, one to three skulls in each, every one from a named person of ONE town in that town's own look, posted at that town only, and
  the town's own person asks first on its board.
- EACH PAYS IN BATTERIES AND NAME: the pay is ECONOMY's bake; the name is CLOUT (our renown): the job done, each man beaten, and now each
  place put down (+10, Battle Brothers' own renown table: 'Destroying a Location +10').
- THE BOARD SAYS WHAT THE JOB ASKS: under the client's words and the trip, the card now says every stop in order and each fight there,
  how many and who, read off the danger reader's own roll for the job the yes would make (the same band the fight is played with), a
  fight that only might come as a maybe with its odds, a fight a talk can come to as his choice, and about how much CLOUT it pays.
  Example, the Remnants' job: 'What it asks: THE FIRST STASH HOUSE: root out, a fight with 2 men (+10 CLOUT); then THE SECOND STASH
  HOUSE: root out, a fight with 2 men (+10 CLOUT); then back to Remnants to be paid. 2 fights. Your name: about +140 CLOUT.'
- ON THE PHONE, the demo and the alpha, upright and sideways (section 5): each kind found on its own town's board with a finger, its
  card read, Take it tapped, and played to the pay; every fight's end screen names who they were; the card's fights are the fights met.

## 1. HOW BATTLE BROTHERS DOES IT (reference/library/grok/wiki/PAGES_ALL.tar.gz)
- Root Out Undead (bb_all/1705): 'Destroy objective A and B, then return.' Two places, both put down, back to be paid.
- Break Greenskin Siege (bb_all/0287): 'Destroy any greenskin siege engines and greenskins around the settlement... You usually destroy
  2-3 raiding parties and 1-2 siege engine camps.' The fights are round the settlement itself.
- Obtain Item (bb_all/1478): 'Obtain a named relic at a location... You get the relic right before the confrontation begins and could
  just retreat if you dont wish to fight.'
- Restore Location (bb_all/1686): 'Secure the ruined location near the settlement, then return to the settlement and escort the workers
  to the location.' (15% no fight, 30% webknechts, 40% brigands.)
- Renown (bb_all/1679), its table: Contract Completed +25, Winning a Fight +5, Destroying a Location +10, Contract Poorly Completed -25,
  Failing -75, Canceling -100. (records/target/bb/renown.json said 'the wiki copy in this repo prints no number'; it does. Ours gives 100
  and 50 for a job done and done in part, not the wiki's 25 and -25: left as they are and said to TUNING, section 6.)
- THE CONTRACT SCREEN: Battle Brothers says the objectives before you sign. Our card said the pay, the walk and the stars; now it says
  the objectives too, with the real fights.

## 2. THE FOUR KINDS (records/target/BOHEMIA_JOB_KINDS.json kinds; words draft:true)
| kind | the legs | the fights | CLOUT for places |
|---|---|---|---|
| root-out (ROOT OUT) | two places out there, the second out from the first; back to be paid | 2, each split 2 (0.65 of the contract) | +10 each place |
| siege (BREAK THE RING) | two roads in and their camp, each 'round' the client's own town; paid at its gate | 3, each split 3 (0.5) | +10 the camp |
| obtain (GET IT) | the place: a talk with its keeper (stand and fight for it: all the pay; run with it: 0.6 of the pay; put it back: the job is lost); back to be paid | 1, the whole contract, if he stands | |
| restore (RESTORE) | the ruin; back to the client for the workers; the ruin 'again' with them; back to be paid | 1 whole; one time in three a second on the walk with the workers, half a contract | |
The shares are party_math.json's job_contract.split (2 and 3) and TUNING's one table section Y carries every one (job_kinds.root_out_share,
siege_share, restore_twist, obtain_run_pay, renown.place_destroyed).

## 3. THE FIFTEEN (records/target/BOHEMIA_JOB_KINDS.json board_people rows and offers jb-root-*, jb-ring-*, jb-get-*, jb-restore-*, jb-find-*)
| job | town | client | skulls | pay |
|---|---|---|---|---|
| Root out the Cartel's stash houses | Remnants | Sargento Dolores Quintero, the night watch | 1 | 62 |
| Close the two houses the Pures keep | Church | Hermana Luz Ocampo, the soup line | 2 | 114 |
| Root out the skim rooms off the Strip | Mob | Tony Calabrese, who counts on the Strip | 3 | 166 |
| Break the ring round the co-op's gardens | Blues | Wren Halvorsen, the co-op's water | 1 | 84 |
| Break the ring round the truck stop | Caravans | Mamá Ruth Okafor, the Caravans' yard | 2 | 162 |
| Break the ring round the solar yard | Trades | Nacho Villaseñor, the Trades' panels | 3 | 240 |
| Get the press die out of the old can plant | Trades | Abuela Rosario Tafoya, the machine shop | 1 | 35 |
| Get the drive out of the dead data center | Network | Celeste Varga, who speaks for the Network | 2 | 61 |
| Get the club's film reels back | Colorful | Mari Duarte, the Colorful's club | 3 | 90 |
| Make the old school safe again | Volunteers | Ms. Adaeze Nwosu, the Volunteers' teacher | 1 | 50 |
| Give the chapel by the overpass back | Church | Padre Teodoro Alcalá, the Church's books | 2 | 84 |
| Open the tunnel pump room again | Homeless | Old Man Cassius, for the King Hobo | 3 | 119 |
| Find the singer who walked off | Anarchists | Rook, who books the shows | 1 | 15 |
| Find the clerk who ran with the ledgers | Reds | Whitfield Ames, the Reds' accounts | 2 | 22 |
| Find the three dealers who skipped town | Mob | Nina Moretti, the card rooms | 3 | 30 |
Each fits its town: the Remnants (the floor of civilization, at permanent war with the Cartel) root out the Cartel; the Church closes
the Pures' houses and takes back its chapel; the Mob's tables and card rooms; the Caravans (whom the Cartel preys on) ringed at the
truck stop; the Blues' co-op gardens and water; the Trades' solar yard and can press; the Network's dead data center; the Colorful's
burned club; the Volunteers' school; the Homeless' tunnels; the Anarchists' singer; the Reds' ledgers. The Cartel and the player's own
faction offer none. Every client's look is the town's own (faction_<town>), every talk's keeper a person with a face.

## 4. WHAT THE CODE DOES (marked JOBS 11/11)
- slices/bohemia_job_kinds.js: makeLegs reads 'again' (a leg before it) and 'round' (out from the client's town); legDone adds a leg's
  CLOUT (renown.json gains by name, keyed once a leg); __A_JOB_SAYS_WHAT_IT_ASKS__ asks(offer, town) is exported.
- slices/bohemia_board_shelf.js: a row with 'towns' is posted at those towns only, and a town's own person asks first (one of them).
- slices/BOHEMIA_SETTLEMENT_SCREEN.html offerSpeak: the asks line under the trip.
- records/target/bb/renown.json and engine/bohemia_renown.js: gains.place_destroyed 10.
- EYES ask row 610 (filed to JOBS this round: 'A BOARD RE-DEALS BETWEEN TWO VISITS 43 GAME MINUTES APART... a job he read and left
  to prepare for vanishes'), __A_POSTED_JOB_STAYS_POSTED__ in slices/bohemia_board_shelf.js. MEASURED in node on main's shelf code
  (the fourteen towns, one window): the day turning inside the window (22:00) while the towns' news changes (a market day at some, a
  sickness at others) re-dealt 19 of 27 posted jobs away: the deal is keyed by the day and the traits, and the news's own jobs ask
  first and push the rest round the valley. (A crew change lost 7 of 26, every one a job the day's floor now held back for the new
  crew: that is rule 255 working.) Battle Brothers keeps a contract on a board until it runs out. NOW what a place posted stays posted
  for its window while nobody has taken it (localStorage bohemia.board.posted.v1, by campaign and window): the day turning, 0 of 27
  gone; with the memory planted off, 8 gone (gate leg N6). A place raided since deals again, and a job the day's floor now keeps back
  for a changed crew still comes off (rule 255 stands).

## 5. ON HIS PHONE (tools/bohemia_jobs_the_new_kinds_on_the_phone.js; records/target/jobs_11_11/)
The gate's own walks (THE NEW KINDS P1 to P4, on the code rebased onto main at 11/11q), a new crew, the valley K7QM9X, day 1; the
cards' photos in records/target/jobs_11_11/ (demo_ and alpha_, upright and sideways), the rows in new_kinds_demo.json and
new_kinds_alpha.json:
| kind | job, town | the card said (demo upright) | the fights met | paid |
|---|---|---|---|---|
| root out | the Cartel's stash houses, Remnants | 2 fights: 2 men, 2 men (+10 CLOUT each) | THE CARTEL'S MEN AT THE FIRST STASH HOUSE, ... THE SECOND STASH HOUSE | 93, +130 CLOUT |
| break the ring | the co-op's gardens, Blues | 3 fights: 2 coyotes, 1 hog, 1 kid (+10 the camp) | THE COYOTES, A HOG, THE ONES CAMPED BY THE CO-OP'S WATER | 140, +110 CLOUT |
| get it | the drive, Network | a word with ODELL, and it can come to a fight with 2 water people | (stand and fight) THE SQUATTERS IN THE DATA CENTER | 111, +100 CLOUT |
| restore | the old school, Volunteers | 1 longhorn; back for the workers; on the way 2 men; the school again | A LONGHORN, THE ONES AFTER THE WORKERS' TOOLS | 98, +100 CLOUT |
| find a person | the singer, Anarchists | find the singer, THE DRY WASH; no sure fight | none: found, walked home | 31, +100 CLOUT |
All twenty (five kinds, demo and alpha, upright and sideways) found on their own town's board on day 1 with a finger, read, taken by
Take it and played to the pay; P3: in every one the card's sure fights were the fights met and every count on the card was a count on
the page. P4: with asks() planted away in the page the card says nothing of what it asks, and the walk fails there.

## 5b. GATES (this tree, rebased onto main at 11/11q)
- THE NEW KINDS (new, gates/the_new_kinds_gate.js, in the suite): 24 passed, 0 failed (JOBS_PLANT=1: N1 to N4 planted, each red; N6's
  own plant).
- JOBS THAT FIT THE COMPANY (20 seeds, days 1 and 20, with this round's boards): 9 passed, 0 failed (a new crew's dealt jobs 415 of
  5,555 lost more often than won, 7 in 100; the posted boards none under the floor; the Lone Wolf 1 in 100).
- THE SIX CONTRACTS 14/0. THE BOARDS ALWAYS HAVE WORK 19/5, the same five reds as main (B4's old save, the three 'offers work' legs,
  B5), its node pools re-aimed to the town rule; run beside other browser gates its tapping legs read 'nobody spoke' under the load,
  alone they are green. HANDOFF 10/0, the pay bake --check, DEMO cut --check exact. PROOF SHOTS STAY PUT's one red is two other
  lanes' gates (the bestiary floor fight, the next three change the map).


## 6. WHAT IS NOT HERE, SAID
- The walk to each stop is the one shortcut of the phone proof (the crew is put on the stop and the map's own arrival is called); the
  town, its board, the client, the card, Take it, every fight, its end screen and LEAVE are the page's own, by a finger.
- The CLOUT the card says counts 5 a man beaten; on the phone the forced end of each fight (every one of theirs put down by the tool)
  counted fewer beaten than the card said (+130 where it said about +140): the card's number is the game's rule, the walk's the
  shortcut's.
- The siege's fights are small for a new crew (a crew of three meets 1 or 2 a fight: split 3 of a three-man contract): that is the
  contract math (11/10d), and the big beasts' cost (routed 11/10) still decides who comes.
- FOUND ON THE PHONE (routed to FACTIONS and BEASTS): the old school's fight (the Volunteers' restore, 'the squatters in the old
  school', brigands) came as A LONGHORN, a long-horned bison, on the K7QM9X demo, upright and sideways; the card said '1 longhorn'
  (true), but the slow giants are never a job's guard (WORLD 9 11/5, rules 389, 399(c); BESTIARY 11/9 made the longhorn one): the
  ground's roll that turns a job's men into its animals (FACTIONS' road mix) lets a giant in.
- FOUND ON THE PHONE (routed to FIXES 2 / UI, beside EYES row 612's cut words): on an upright phone the client's own words on a job's
  card are clamped at three lines (-webkit-line-clamp 3), so the second sentence, the one with the pay, is cut ('...pointed at us.
  Put…'); measured the same with the new asks line and with it planted away, so the clamp is older than this round.
- ROUTED: TUNING, the renown gains (ours 100 and 50 for a job done and done in part; Battle Brothers' table 25 and -25); ECONOMY, a
  siege's pay counts its three fights as three whole fights (job_pay.json) where the contract splits them; WORDS, every new line is a
  draft.

[bb Battle Brothers says a contract's objectives before you sign; ours now says them with the real fights, who and how many]
[analog horror: the card already knows it will be two coyotes on the garden road, and tells you, in the client's own handwriting]
