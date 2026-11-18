# JOBS (one file per lane, written only by JOBS; newest block on top)

JOBS (session_01GKDyuv5CeFx6bTxT23Pv5Q): 11/18 LATEST -- BUILD 11/18a - THE BIG WORK WAITS FOR A NAME (build E), BUILT, NOT YET SEEN (rules 453, 454(a), 441;
row 627; the coordinator's routine 'JOBS next'). Record: records/BOHEMIA_JOBS_THE_TOWNS_BOOK_11_17_26.md section 6. The pay inventory for
ECONOMY TWO (rule 459) is the 11/18 block below; this build moves no pay number.
- MEASURED FIRST: CLOUT raised the pay and opened the retinue, and opened no work: a crew of nobody got a fortress's three-skull work
  on day one wherever the day's floor let it through. Battle Brothers: 'the more difficult Contracts people will entrust you' with
  Renown, and a fortified town's contracts 'require... Professional Renown (1050) to unlock' (bb_all/1679, bb_all/0724).
- THE GATE: records/target/bb/job_clout.json needs (JOBS' file; TUNING row job_clout.needs 250 / 1050): a fortress's three-skull work
  waits for 1050 CLOUT, its two-skull work and any town's or camp's three-skull work for 250; the news's and a raid's work ask no
  name. slices/bohemia_board_shelf.js __THE_BIG_WORK_WAITS_FOR_A_NAME__ (needOf, the deal keyed by the CLOUT level, never empty:
  the least dangerous waiting job stands, waits()). The board's one label: 'MORE WORK HERE AT 250 CLOUT · YOU HAVE 200' (draft).
- MEASURED (node): fortress boards at 0 CLOUT 1.40 jobs (3.00 before), 3.00 at 250; towns and camps unchanged; never an empty board.
- ON THE PHONE (demo and alpha, both ways; 200 CLOUT set, the one shortcut, said): Caravans day 1, two one-skull jobs and the line; the
  singer played to the pay (+100, 300); Caravans when its board turned, the two-skull ring trucks job and the line at 1050 (that same
  window posts none at 200).
GATE THE TOWN'S BOOK: E1 files, E2 the boards by CLOUT (planted bites), E3 the phone: 13/0 with JOBS_BUILD=E (the demo and the alpha, both ways); THE BOARDS ALWAYS HAVE WORK the same 5 reds main had, every board still offering work.
NEXT (nothing waits on him): Battle Brothers' daily Renown decay (-3 a day, bb_all/1679) is not ours yet (CLOUT never fades);
the town's bar on the board itself.
[bb Battle Brothers: the higher your Renown, the more difficult contracts people entrust you; the Noble Houses wait for Professional]
[analog horror: the fortress has work, you can hear it behind the gate; they just do not know your name yet]

JOBS (session_01GKDyuv5CeFx6bTxT23Pv5Q): 11/18 FOR ECONOMY TWO (rule 459, THE BATTERY IS REAL; the coordinator's routine 'JOBS next'): EVERY
PLACE A JOB'S PAY IS SET OR MULTIPLIED. JOBS moved no pay number; ECONOMY TWO re-prices from its table. Read on main at c869a5eda.
WHY HE SAW 1,000 AND 3,000: no base pay is over 251 (jb-hold-substation; jb-ring-solar 240; the shelf's 249). The multipliers stack on
it: FULL SHELVES x1.5, CLOUT up to x4.5, Allied x1.15, two asks x1.14: 251 reaches 1,956 before an ask and 2,236 after two.
1. THE BASE (set once, baked):
   - records/target/bb/job_pay.json: the formula's numbers (crew_cost_per_map_hour 1.375, margin 1, minutes_per_block 8.5, per_fight 26,
     skull_mult 1/2/3, floor_per_skull 30, base_men 4/6/8, pack_size 3, hold/dark waits, place_blocks) and 'pays' (every job's baked
     base, with its before and its why). The formula: engine/bohemia_job_pay.js base() (hours x crew cost + fights x per_fight x
     skulls, at least floor_per_skull x skulls).
   - THE BAKER: tools/bohemia_economy_job_pay.js (writes job_pay.json 'pays', BOHEMIA_JOB_KINDS.json board_people[].pay, and runs
     tools/bohemia_run2_board_shelf.py, which writes BOHEMIA_BOARD_SHELF.json offers[].pay); --check is the gates' (the new kinds N5).
     So the pay a modder sees in BOHEMIA_BOARD_SHELF.json and BOHEMIA_JOB_KINDS.json is a bake output: change job_pay.json, re-bake.
   - THE FALLBACK: slices/BOHEMIA_SETTLEMENT_SCREEN.html var OFFERS: four drafted offers with a TYPED pay (ct-escort-water 30 ... ct-dogs
     90), shown only until the shelf loads. records/target/BOHEMIA_JOB_KINDS.json offers carry no pay of their own (0 of 105; 101 are
     baked in job_pay.json 'pays', the other 4 are these fallback four, whose legs live there).
2. THE MULTIPLIERS (every one applied twice, the same sum, on the card and on the map, so what he is shown is what he is paid):
   - THE START: slices/BOHEMIA_ALPHA_0_9.html ECON (FULL SHELVES 1.5, THIN 1, BARE 0.75; the start screen's pick) and ORIGINS[].pay
     (+0 or +1 to every job; records/target/bb/origins.json 'pay' when it loads); they ride in picks() as LOOP.start.mult and .pay.
   - CLOUT: engine/bohemia_renown.js payMult(), records/target/bb/renown.json pay_mult (x1 at 0 to x4.5 at 4,000 CLOUT, flat after).
   - THE TOWN'S STANDING: records/target/bb/job_pay.json standing (Hostile x0.85 to Allied x1.15), engine/bohemia_job_pay.js
     standing()/at(), read from the town's bar (bohemia.relations.v1).
   - THE MAP'S SUM: slices/BOHEMIA_CITY_WORLD.html loopJobPay(base, place, st) = (base + start.pay) x start.mult x CLOUT x standing;
     used by loopTakeContract (the job held), the phone's list (slices/bohemia_phone_board.js) and every 'Pays N' line.
   - THE CARD'S SUM: slices/BOHEMIA_SETTLEMENT_SCREEN.html payShown() (the same sum; S.payRule is the start's add and mult, handed by
     the map) and standHere().
3. WHAT HE CAN MOVE ON THE CARD (JOBS, this week):
   - PUSH THE PAY: hagPay() x(1 + relations.json haggle.step 0.07) an ask, two asks (haggle.lands); the pushed base rides to the map.
   - PAID INTO HIS PLACE: payOf() takes a build's worth (records/target/bb/job_into_place.json worth: a battery and its tape; share
     0.25 the most) off the shown pay; loopTakeContract takes the same off job.pay.
4. WHAT THE JOB PAYS AT THE END (slices/bohemia_job_kinds.js paid(job, n): BohemiaPurse.credit of n; a part pays 'poor'):
   - a cargo job pays per crate/person that arrives (job.perCrate = pay / count; escort, find-person home);
   - a camp or a patrol: a flat share and a share per head (records/target/BOHEMIA_JOB_KINDS.json kinds: clear-camp flat 0.6 /
     per_head_share 0.4; patrol flat 0.5, the rest per head, capped at the pay); the T17 twist locks the fee;
   - a hold: part pay by the waves held (pay x waves held / waves);
   - a job told as legs: x job.payMult, set by a talk's choice (opts[].pay, e.g. 0.3, 0.6 on the turn jobs);
   - the map's own fight-job path: slices/BOHEMIA_CITY_WORLD.html (won: job.pay in full); a rescue pays 0.
5. NOT A JOB'S PAY BUT A PRICE ECONOMY TWO WILL MEET IN THE SAME FILES: the town's shelves by its bar (records/target/settlement_traits.json
   relation_prices, above and below), wages (billWages, BohemiaCamp 'wage'), the side quests' own endings (records/target/
   BOHEMIA_SIDE_QUESTS.json), the road's battery gifts (slices/bohemia_road_events.js fx), the home builds' tape and battery
   (records/target/bb/home_base.json, engine/bohemia_lotbuild.js).
TUNING's one table already carries the multipliers' rows (relation_prices.below, relations.board, relations.haggle, relations.acts.haggle,
job_into_place.share, job_into_place.worth, and ECONOMY 2's job pay rows); the start's ECON and ORIGINS numbers live in the alpha's code.

JOBS (session_01GKDyuv5CeFx6bTxT23Pv5Q): 11/17 LATEST -- BUILD 11/17za - PAID INTO YOUR PLACE (build D of four), BUILT, NOT YET SEEN (rules 453,
454(a), 441; row 627). Record: records/BOHEMIA_JOBS_THE_TOWNS_BOOK_11_17_26.md section 4. THE ROUND'S FOUR BUILDS ARE ALL IN.
- THE SHAPE: on any job's card 'Into your place' moves part of the pay into one of his builds (a panel 5, a pump 4, a tank 3, a garden
  2: the lot build's battery and its tape); each tap the next that fits under a quarter of the pay (Battle Brothers' payment shapes,
  25%), then back. The worth comes off the pay he is SHOWN, exactly (payOf; the map's loopTakeContract takes the same off its sum).
- PAID IN FULL: bohemia_job_kinds.js paid() hands the build to BohemiaHomeMap.give (kind 'build', from the town): it stands that day,
  or waits for his place. Done in part: batteries only. records/target/bb/job_into_place.json (JOBS' file); TUNING rows share, worth.
- ON THE PHONE (demo and alpha, both ways): Rook's singer, 23 -> 18 and A SOLAR PANEL; played to the pay: 18 of 18, the panel waits for
  his place. The card's four buttons sit two across on every phone, all on the glass.
- FOR ECONOMY TWO (rule 459, the re-base): every number of this round is a row of TUNING's one table (relations.haggle,
  relations.acts.haggle, job_into_place.share, job_into_place.worth, relations.board, relation_prices.below); the re-base moves them.
GATE THE TOWN'S BOOK: D1 files, D2 what the card offers, D3 the phone: 13/0 with JOBS_BUILD=B,C,D in the worktree, 11/0 with JOBS_BUILD=D on main's tree.
NEXT (nothing waits on him): the town's bar might show on the board itself (it shows on the map's phone); a planted place's build
standing on the security-camera view (rule 458(c)) is HOME BASE's picture.
[bb Battle Brothers lets you choose how a contract pays before you sign; ours moves part of the pay into your own place]
[analog horror: the panel arrives before you have anywhere to put it, and waits in the dark with your name on it]

JOBS (session_01GKDyuv5CeFx6bTxT23Pv5Q): 11/17 LATEST -- BUILD 11/17z - WHAT WALKING AWAY COSTS (build C of four), BUILT, NOT YET SEEN (rules
453, 454(a), 441; row 627). Record: records/BOHEMIA_JOBS_THE_TOWNS_BOOK_11_17_26.md section 3. His vote of 11/16: YES on build A.
- MEASURED FIRST: dropping a job already cost its town 10 and 100 CLOUT, failing it 20 and 75 (relations.json, renown.json, the wiki's);
  the job's card never said so before the yes.
- THE CARD: one more line of numbers on every job's card, this town's own, two lines: 'DROP IT 50→40 · CLOUT 300→200' / 'FAIL IT 50→30
  COLD · CLOUT 300→225' (the band named when the bar falls into another; CLOUT never under 0, so a new company reads 0→0). Labels only,
  draft (rule 454(a)); no number is new. slices/BOHEMIA_SETTLEMENT_SCREEN.html __WHAT_WALKING_AWAY_COSTS__ (costOf, costWords).
- ON THE PHONE (demo and alpha, both ways; 300 CLOUT set in the game's own record, the one shortcut, said): the Network's TV-mast job
  dropped in town with a finger, 50 -> 40, CLOUT 300 -> 200; the courier job that changes halfway walked away from at its turn with a
  finger, lost, 40 -> 20, CLOUT 200 -> 125: all exactly as the cards said.
- THE CARD GREW A LINE: the ask sits beside Take it on every phone now (upright, the label over its cost); every card button measured on
  the glass (B3, C3).
GATE THE TOWN'S BOOK: C1 files, C2 the card's words on the real bands and gains, C3 the phone: 10/0 with JOBS_BUILD=B,C on the rebased tree.
NEXT: build D (any job paid into his own place), built and proven in a second worktree, ships next.
[bb Battle Brothers: cancelling a contract costs the town 10 and renown, failing a civilian one 20; ours says both on the card before you sign]
[analog horror: the card already knows how it ends if you run, and it tells you in numbers, in a colour like old blood]

JOBS (session_01GKDyuv5CeFx6bTxT23Pv5Q): 11/17 LATEST -- BUILD 11/17u - PUSH THE PAY (build B of four), BUILT, NOT YET SEEN (rules 453,
454(a), 441; row 627). Record: records/BOHEMIA_JOBS_THE_TOWNS_BOOK_11_17_26.md section 2.
- THE ASK: on every job's card, above Take it, 'Ask +7%' with its cost beside it ('-0.5 STANDING'): 7% on the pay (the middle of the
  wiki's 4-11%), 0.5 off this town's bar (the wiki's own). Two land; the third button says 'THEY WALK -3' before the tap, and that tap
  ends it (the wiki's -2.5 more): that person leaves this board and the phone's list until the board turns (bohemia.haggle.v1; the
  shelf's pick() leaves them out, __PUSH_THE_PAY__). Told, never rolled (the house's 9/11 rule). The client's line is untouched; its
  {pay} reads the pushed number, and the map's own sum is made on the pushed base. relations.json acts.haggle and haggle; TUNING rows.
- MEASURED ON THE PHONE (demo and alpha, both ways): Teo's water drums at Caravans 57 -> 62 -> 66, bar 50 -> 49, held at 66; the ring
  trucks asked three times: walked, -4.0, gone from the board, again on walking back in, and from the phone's list.
- FOUND AND FIXED: on the alpha held sideways (the card 288 px under the tabs) the ask pushed Not now half off the glass; on a short
  screen held sideways the ask now sits beside Take it. B3 fails any card button off the glass.
- WATCH FOR (build C and D add to this card): on an upright phone the card's last button ends about 30 px above the edge; a line or a
  button more needs the same two-wide row upright.
- MAIN WAS RED SINCE BUILD A, NOW GREEN: the RELATIONS gate refused acts.haggle ('no act in the file that is not in the table': it reads
  only the wiki's Relations page, and the -0.5 is the Contracts page's). The gate now holds such an act to the same standard (its quote
  word for word from that page, read out of the tarball, its number the quoted one); three planted mistakes each bite. 67/0.
GATE THE TOWN'S BOOK: B1 files, B2 the card's sum, B3 the phone: 7/0 with JOBS_BUILD=B, again on the rebased tree.
THE SUITE: the whole of it no longer finishes here (the solo tier alone ran past 40 minutes); the browser-free tier reached 840 of 1150
with 83 reds; every one that reads a file this build touched was run alone: RELATIONS fixed (above), WHO THE FACE IS (boss portraits
with no entry) and QUARTERMASTER'S COUNT (art registrations) are not this lane's.
NEXT: build C (what failing or walking away costs, on the card), build D (any job paid into his own place).
[bb Battle Brothers: each haggle costs 0.5 relations and adds 4-11%; push too far and they throw you out (-2.5); ours tells you the odds instead of rolling]
[analog horror: the third ask is the one nobody answers; the person is just not at the board any more]

JOBS (session_01GKDyuv5CeFx6bTxT23Pv5Q): 11/17 LATEST -- BUILD 11/17b - THE TOWN REMEMBERS (build A of four), BUILT, NOT YET SEEN (rules 453,
454(a), 441; row 627; the coordinator's routine 'JOBS full sweep': the jobs' SYSTEMS, no new prose). Record: records/BOHEMIA_JOBS_THE_TOWNS_BOOK_11_17_26.md.
- MEASURED FIRST: a town's bar already moved with every job settled there and bent the pay; its shelves charged less above Neutral. Missing:
  below Neutral nothing moved, and the bar never changed what a town offers.
- THE PRICE: below Neutral a town charges more and pays less (settlement_traits.json relation_prices.below; the Game Guide's 0.6% a point,
  30% of worth on the buy at Hostile, 4% off the sell); the town screen's relPrice (marked). Measured: Mob at 25 charges x1.15.
- WHAT A TOWN OFFERS: relations.json board (ours, on the wiki's access rule): Cold to Threatening keep three-skull work (the news's too),
  Hostile one one-skull job, Friendly and up one more (never over four); engine/bohemia_job_pay.js board(); the shelf's
  __THE_TOWN_REMEMBERS__. Measured: 1.93 jobs a board at Neutral, 2.93 at Friendly; three-skull boards 63 at Neutral, 0 at Cold.
- A BUG FOUND AND FIXED: the town screen dropped every settled job's standing when he walked in before relations.json loaded (the alpha held
  sideways: a finished job's +10 gone for good); now kept until the bands load (REL_WAIT, marked).
GATE THE TOWN'S BOOK (new, in the suite): A1 to A3 in node (planted trust off bites), A4 on the phone (the demo and the alpha, both ways:
a job done +10, Friendly one more, Unfriendly x1.15 and no three-skull job), A5 nothing threw: 5/0.
NEXT: build B (push the pay, Battle Brothers' haggle: relations.json acts.haggle -0.5 and haggle {step 0.07, lands 2} already in), build C
(what failing or walking away costs, on the card), build D (any job paid into his own place).
[bb Battle Brothers' towns trade better with friends and hand big contracts only to a company they know; ours now do both]
[analog horror: the board is shorter at the town that remembers what you did there, and nobody says why]

JOBS (session_01GKDyuv5CeFx6bTxT23Pv5Q): 11/14 LATEST -- BUILD 11/14s - THE NIGHT, THE TURN AND THE BID, BUILT, NOT YET SEEN (rules 447, 441;
rows 610, 614, 491; the coordinator's routine 'JOBS turn up'). Record: records/BOHEMIA_JOBS_THE_NIGHT_THE_TURN_AND_THE_BID_11_14_26.md.
- ROW 610 AS HE MEANT IT (__A_READ_BOARD_STAYS_READ__ in slices/bohemia_board_shelf.js; the town screen's openB('board') calls seen()):
  a board he has opened is what he read until its window ends; no floor, no news, no new face; only what he took or finished leaves.
  Node (gate R5): four read boards the same through the day turning, the news changing and a floor against everything; planted off, 4 of 4
  change. Phone: a town's board read, the day turned inside the window, read again: the same.
- THREE KINDS as legs rows: night-watch (WATCH: dark, two fights at one place 150 minutes apart, split 2), turn (CARRY: halfway a talk;
  finish and fight, give it back paid there by the choice's part ('paid', one marked line in legTalk), walk away), bid (TAKE A SIDE: one
  place, two towns' rows that are each other's 'rival'; the shelf drops the other side once he holds one; the last leg tells the other town).
- FIFTEEN JOBS: three escorts (Caravans, Colorful, Reds), three watches (Volunteers' clinic, Homeless' tunnel, Remnants' depot), three
  turns (Anarchists' stolen speakers, Trades' school panels, Network's courier), three bids (the water plant Blues/Reds, the TV station
  Network/Anarchists, the market hall Church/Mob); four pay into his own place through HOME BASE's seam (fx.home).
- The card says a night's fights as 'about N of whoever comes in the dark' (the day turns at nightfall, so the reader's roll of today can
  name the wrong animal: the card said 2 men, a bull came); a job that asked for beasts names the animal it met (the danger reader's
  marked naming line).
GATE THE NIGHT, THE TURN AND THE BID (new, in the suite): R1 to R7 the files, the read board and the bid in node (JOBS_PLANT=1: a red in
each planted copy), P1 the demo both ways, P2 the alpha both ways, P3 nothing threw: 19/0 rebased on 11/14m. THE NEW KINDS' file legs 19/0, the boards' node legs green.
NEXT (the jump list):
1. [a night's roll] a night watch's fights come after the day turns: roll the card's bands on the fight's own day so the card can name them.
2. [the escort's raid on a straight teleport] the raid comes ahead on his road; a crew put at the gate with no road walked meets none.
3. (from 11/11) the CLOUT a man beaten; a siege for a big crew; the big beasts' cost (ask row 574).
[bb Battle Brothers' Return Item turns on the road with a shady man's offer; ours turns halfway with the truth, and he picks the side]
[analog horror: the board you read last night is the board you get, the same faces, even after the one who hired you stopped answering]

JOBS (session_01GKDyuv5CeFx6bTxT23Pv5Q): 11/11 LATEST -- BUILD 11/11s - THE NEW KINDS, BUILT, NOT YET SEEN (rules 425, 441; asks 41, 107, 491,
and EYES' 610; the coordinator's routine 'JOBS next round'). Record: records/BOHEMIA_JOBS_THE_NEW_KINDS_11_11_26.md.
- MEASURED FIRST: escort, defend, hunt, deliver and find a person were ours (find a person on 2 offers); Battle Brothers' Root Out,
  Break Siege, Obtain Item and Restore Location had no kind of ours (0 offers each).
- FOUR NEW KINDS as legs rows of WORLD's engine (records/target/BOHEMIA_JOB_KINDS.json kinds root-out, siege, obtain, restore; two
  marked lines in slices/bohemia_job_kinds.js makeLegs: 'again' = a leg before it, 'round' = out from the client's town): root out two
  places (split 2, +10 CLOUT each), break the ring (three fights round the client's town, split 3, the camp +10), get it (a talk:
  stand and fight, run with 0.6 of the pay, put it back and lose it), restore in two parts (the ruin; back for the workers; the ruin
  again; back to be paid; one in three a fight on the walk, half a contract). TUNING's section Y rows; renown.json place_destroyed 10
  (Battle Brothers' renown table, bb_all/1679, which IS in the repo: its Contract Completed is +25, ours 100, routed to TUNING).
- FIFTEEN JOBS (board_people jb-root-*, jb-ring-*, jb-get-*, jb-restore-*, jb-find-*): three of each plus three to find a person, one
  to three skulls, each from a named person of ONE town in its look; slices/bohemia_board_shelf.js posts a row with 'towns' at those
  towns only, and the town's own person asks first. Pay: ECONOMY's bake.
- THE CARD SAYS WHAT IT ASKS (asks() in slices/bohemia_job_kinds.js, __A_JOB_SAYS_WHAT_IT_ASKS__; the line in the settlement screen's
  offerSpeak): every stop, every fight, how many and who (BohemiaJobDanger.fightsFor's own roll: 'the band read is the band met'), a
  maybe with its odds, a talk's fight as his choice, about how much CLOUT.
- EYES 610 FIXED (__A_POSTED_JOB_STAYS_POSTED__ in the shelf): measured in node on main's shelf, the day turning inside a board's window
  while the towns' news changes (a market day, a sickness) re-dealt 19 of 27 posted jobs away; now 0 (localStorage
  bohemia.board.posted.v1, by campaign and window; a raided place deals again; the day's floor still takes off what it now keeps back).
GATE THE NEW KINDS (new, in the suite): N1 to N6 the files and the re-deal (JOBS_PLANT=1 plants four copies, N6 its own plant), P1 the
demo both ways, P2 the alpha both ways (each kind found on its own town's board with a finger, read, Take it, played to the pay), P3
the card's fights are the fights met, P4 asks() planted away, P5 nothing threw: 24/0 rebased on 11/11q. JOBS THAT FIT 9/0,
THE SIX CONTRACTS 14/0, THE BOARDS ALWAYS HAVE WORK 19/5 (main's same five reds).
NEXT (the jump list):
1. [the CLOUT a man beaten] the card counts 5 CLOUT a man beaten; the phone walk's forced ends counted fewer (+130 where the card said
   about +140): read BohemiaRenown.fightWon's count on a real AUTO fight before calling the card's number exact.
2. [a siege for a big crew] break the ring's fights are 1 or 2 men for a new crew of three (split 3): right by the contract, small to
   look at; a siege could carry a fourth fight past day 20 (Battle Brothers: 2-3 parties and 1-2 camps).
3. (from 11/10) the big beasts' cost (ask row 574); obtain and restore now have kinds; the survey repeats.
[bb Battle Brothers says a contract's objectives before you sign; ours now says them with the real fights, who and how many]
[analog horror: the card already knows it will be two coyotes on the garden road, and tells you, in the client's own handwriting]

JOBS (session_01GKDyuv5CeFx6bTxT23Pv5Q): 11/10 -- BUILD 11/10o - THE SIX CONTRACTS, BUILT, NOT YET SEEN (rule 443(c), asks 567 and 102;
the coordinator's routine 'JOBS: more contract kinds'). Record: records/BOHEMIA_JOBS_MORE_CONTRACT_KINDS_THE_BATTLE_BROTHERS_WAY_11_10_26.md.
- MEASURED FIRST: Battle Brothers' six contract kinds all existed (WORLD's job kinds) but the boards held 1 delivery, 1 debt, 2 places to
  clear, 2 defences, 3 escorts among 46 ordinary offers; three fights were a fixed two men; a defence's waves, a caravan's raids and a
  patrol's crews each took a whole contract; only a leg's fight named its enemy at the end.
- FIFTEEN NEW CONTRACTS (records/target/BOHEMIA_JOB_KINDS.json board_people rows jb-*, offers jb-*; words draft:true), three each of
  escort, defend, deliver, clear a place and collect a debt, each from a named person with a look, every tier and skull; the three debts
  carry their own legs (debtor, talk, three ways). Pay is ECONOMY's bake (node tools/bohemia_economy_job_pay.js; --check green).
- ONE CONTRACT FOR SEVERAL FIGHTS: party_math.json job_contract.split {2: 0.65, 3: 0.5}; the legs' fight.share (collect 0.67, burn 0.4,
  follow 0.4, the new debts 0.67); TUNING's section Y rows. Measured over 20 valleys: all dealt jobs lost 11.6 -> 11.0 in 100 (days 1 and
  20); defences on day 20 85 -> 35 of 144; BUT the fight's count is in the band's dice, so a smaller wave can come as other animals (the
  market's second wave: two house men -> two bison, 0.86 -> 0.19). Routed (record s6).
- EVERY FIGHT NAMES ITS FOE (__EVERY_JOB_NAMES_ITS_FOE__ in slices/bohemia_job_kinds.js; foe_says in the job kinds file; one marked line
  in slices/bohemia_job_danger.js rollInto: animals named as themselves; one marked line in slices/BOHEMIA_SPOILS_SCREEN.html theyWere:
  one IS). On the phone both ways (tools/bohemia_jobs_the_six_on_the_phone.js; records/target/jobs_11_10/): all six name who they were;
  main said THE RAIDERS, A HOUSE MAN, THE PACK, THE HOUSE, THE PACK, DON BETO'S NEPHEWS.
- ASK 102 OVER 20 VALLEYS: the Lone Wolf's boards 97/99 in 100 one-star (days 1/20), 68 batteries a man; with five ordinary hires 67/60,
  65 jobs on his day-20 boards he loses more often than wins, 10 a man.
GATE THE SIX CONTRACTS (new, in the suite): S1 to S4 the files (JOBS_PLANT=1 plants three copies, each caught), S5 the six on the phone
both ways, S6 the names planted away in the page (the defence must lose its words), S7 nothing threw: 14/0 on the rebased tree.
JOBS THAT FIT THE COMPANY re-run after the split, 20 seeds: 9/0 (a new crew 10 in 100 lost more than won, the Lone Wolf 1 in 100).
NEXT (the jump list):
1. [the big beasts' cost] bison and bulls stand at the fight's own 0.4 and 0.2 of the count (FACTIONS'); for a crew of three two bison are
   a wall: measure them with tools/bohemia_jobs_beast_cost.js and agree the cost with FACTIONS and TUNING (one count, never two).
   PLUMBER 8 found the same from the other side (ask row 574, filed for FIXES: at their sized count a new crew beats bison 2 in 10).
2. [obtain and restore] Battle Brothers' Obtain Item and Restore Location have no kind of ours (restore fits rule 445's settlement seam).
3. [the survey repeats] (from 11/10d) two boots of one tree read the wolf and hyena jobs 14 and 34 in 100.
[bb Battle Brothers' contract types carry the whole job in one base value; ours now split one contract across a job's waves]
[analog horror: the end screen remembers the name of the man who owed the bar, and his cousins]

JOBS (session_01GKDyuv5CeFx6bTxT23Pv5Q, opened by the coordinator for VAMILY rule 436(c), asks 102 and 114, ask line 521): 11/10 --
BUILD 11/10d - JOBS THAT FIT THE CREW, BUILT, NOT YET SEEN (rule 179(a): DONE is EYES' mark). LIVE: content da588c127, card bd4e0e5f,
pages run 4386 SUCCESS. VOTE jobs-jobs-that-fit-the-crew-11-10. Record: records/BOHEMIA_JOBS_THE_FIRST_FIFTY_DAYS_AND_JOBS_THAT_FIT_11_8_26.md.

WHAT IS LIVE (the demo and the alpha read it from the files, no re-cut needed for the math; the stamp is re-cut):
- THE CONTRACT IS THE BUDGET (Battle Brothers: a contract is one budget, sized off the roster's levels, spent on each enemy's own cost;
  bb_all/0827, 0828): records/target/bb/party_math.json job_contract {beast_cost: {wolves 0.45, hyenas 0.55}, hunt_scales: true,
  pack_flat: 0.8}, read by slices/bohemia_job_kinds.js __THE_CONTRACT_IS_THE_BUDGET__ (a marked block above fight(), four marked lines:
  fight() costs the hand-over, fightsOf's add() costs the stars' fights the same way, spawnPack's pack at the beast's cost, the hunt's
  kills x the contract's multiplier x cost/pack_flat once the first pack is spawned). A kind not in beast_cost is unchanged.
- MEASURED (20 campaign seeds, days 1/20/50, daytime, common dice): the new crew's dire-wolf and hyena jobs lost 82/91/92 -> 6/60/51 in
  100; its hunts 51/59/65 -> 5/33/33; all its dealt jobs 10/20/20 -> 7/16/15. The Lone Wolf's wolf and hyena jobs 0/63/61 -> 0/1/3; his
  day-50 boards 556 one-star of 560, none lost. The wolf with five ordinary hires loses 28 in 100 on day one against 0 alone (183(a) holds).
- ON HIS PHONE: tools/bohemia_jobs_the_board_on_the_phone.js (upright and sideways, the real door, the Network's board on day 50);
  records/target/jobs_11_8/.

FILES THIS LANE OWNS: party_math.json job_contract (the block only; job_bb stays WORLD's), the marked block and lines in
slices/bohemia_job_kinds.js (WORLD's file), TUNING's one table section Y (hand-added like F to X), tools/bohemia_jobs_*.js|py,
gates/jobs_fit_the_company_gate.js, records/target/jobs_11_8/, records/target/JOBS_JOBS_THAT_FIT.jpg.

GATE (in the suite): JOBS THAT FIT THE COMPANY. T1 to T4 on the files (JOBS_PLANT=1 plants three copies, each caught); D1 to D6 on the
demo over 20 seeds (about 40 minutes: two surveys of 40 valley-days and the planted one on 3); D5 plants the old math and must fail D4.
The survey repeats a fight's dice within one boot (common dice, pinned day) but NOT yet across boots: the gate's run and the survey's
read the new crew's wolf and hyena jobs 14 and 34 in 100 on the same seeds (the before 87 both); suspected the crew screen's hand-over at
boot (the crew key is in the dice). Next line below.

INSTRUMENTS (draft, nothing in the game reads them): tools/bohemia_jobs_fit_the_company.js (the survey; --plant old for the before;
--hires K; --sample -1 for boards only), tools/bohemia_jobs_fit_the_company_sum.py (the table), tools/bohemia_jobs_beast_cost.js (a
kind's cost in men on the live fight; four minutes), tools/bohemia_jobs_the_card_picture.js.

NEXT (the jump list, the coordinator's to order):
0. [the survey repeats] find why two boots of the same tree read 14 and 34 in 100 (the crew's key at boot is the suspect); pin it.
1. [the block watch's crews] the new crew's biggest remaining loss after the rare giants: the Block Watch fields 1.3 men a count (its own
   count_scale, FACTIONS'); measure its cost the way the beasts were, and cost it in job_contract or ask FACTIONS to move its scale.
2. [the stars and the hour] the same job read 0.66 / 0.81 / 0.57 danger on three boots of one valley and day: the reader reads at the
   map's hour; a job's stars should be read for the hour he will meet it (WORLD's reader, routed in the record; rule 208(d)).
3. [the six-man run] the wolf plus five hires over 20 seeds (only two valleys measured: the six-man fights are slow, about 280 s a
   valley-day); with the boards-only mode (--sample -1) it fits a round.
[bb a Battle Brothers contract is one budget spent on each enemy's own cost; ours now spends it the same way and still shows the crew's own odds in red]
[analog horror: the board in the Network's camp still lists the hyenas as three red stars; the muralist only asks for three of them now]
