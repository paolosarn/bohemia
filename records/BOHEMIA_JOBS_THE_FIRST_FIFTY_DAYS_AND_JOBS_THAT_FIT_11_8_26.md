# JOBS 11/8 to 11/10: THE FIRST FIFTY DAYS AND JOBS THAT FIT (VAMILY rule 436(c); ask lines 102, 114, 521; rules 183, 192, 208, 254, 255)

HIS WORDS (rule 436(c), and the two asks it answers): "the first fifty days reward a small strong crew (the Lone Wolf plays like he
remembers)" (ask 102, rule 183: 'there definitely isn't incentive for the first 50 days to grow your crew unless it's god-tier recruits...
in Battle Brothers I always loved playing Lone Wolf'); "most jobs fit the company the way Battle Brothers sizes its contracts (never 75%
overpowered); the stars on a job tell the truth about how hard it is" (ask 114, rule 192: 'why is the game so in love with throwing
overpowered enemies in like 75% of the quests I take... look how Battle Brothers does it').

## 0. THE ANSWER
1. ON TODAY'S DEMO THE BOARDS ALREADY LOOK RIGHT EARLY, BECAUSE A FILTER HIDES THE BAD JOBS: through day 20 no job on any board was lost
   more often than won, for the Lone Wolf or a new crew of three (WORLD's day-fifty filter, rule 255). But the job math under the filter
   still dealt jobs the company loses, and from day 30 the filter opens (by day 50 it hides nothing), so those jobs reach the board.
2. TWO FAULTS IN THE JOB MATH, BOTH AGAINST BATTLE BROTHERS' OWN RULE (a contract is one budget, sized off the company and spent on the
   enemy's own cost): (a) A DIRE WOLF COUNTED AS ONE MAN. A job whose ground dealt wolves sent as many wolves as it would send men; on
   the live fight two wolves play like four brigands, so the same job read 0.1 to 0.2 with wolves and 0.7 to 0.9 with men. (b) A HUNT
   ASKED A FIXED 4, 7 OR 10 KILLS, whatever the company: a new crew of three met nine dire wolves on a three-skull hunt and lost every one.
3. THE FIX (records/target/bb/party_math.json job_contract; slices/bohemia_job_kinds.js __THE_CONTRACT_IS_THE_BUDGET__; TUNING's one
   table section Y): a beast stands at its measured cost (dire wolf 0.45, hyena 0.55 of a man of the count); a hunt's pack is the
   contract's count at that cost; a hunt's kills grow and shrink with the company the way the contract does. One count everywhere: the
   fight the job hands over and the fights the stars read are costed the same way, so the stars still tell the truth.
4. THE SMALL STRONG CREW IS REWARDED, MEASURED: the Lone Wolf in his gold kit (ORIGINS 11/7) wins nearly every job the valley deals
   him in the first fifty days (now the wolves and hyenas too); the same wolf with five ordinary hires loses about one dealt job in four
   on day one (a hire who dies spoils the job), and the pay a man falls from 68 batteries to 8. That is Battle Brothers' own lesson ('Each additional level 1 character...
   is worth 6 levels in strength'; pay never scales with the roster), and it holds here. Section 4.

## 1. HOW BATTLE BROTHERS DOES IT (reference/library/grok/wiki/PAGES_ALL.tar.gz; the first answer, rule 436(c))
- THE SIZE OF A CONTRACT (bb_all/0827 Game Guide): "Contract difficulty scales with: Type, Difficulty rating (skulls), Roster strength,
  Combat difficulty. Each type of contract has a base value that ranges from 40 to 200. It's multiplied by the other variables." Skulls:
  "Easy = 70% - 85%, Medium = 95% - 105%, Hard = 105% - 135%". Roster: "Each character is valued at 10 + (level - 1) x 2. If the party
  contains less than 3 members, each character whatever his level adds +10." "94% x (1% x roster strength) ^ 0.89. It cannot be lower
  than 0.75 (78 strength or about 8 level 1 characters) or higher than 5." "The maximum number and type of enemies is limited by the
  spawn list used." WORLD carries the multiplier already (party_math.json job_bb, 10/25).
- GEAR NEVER COUNTS (bb_all/0828 Game Mechanics): "From further testing, gear does not appear to have an impact on roster strength."
  "contract-spawned mobs and locations are always closely matched to the player's party and offer an appropriate challenge."
- THE SMALL CREW (bb_all/0827): "The roster strength is potentially the most impactful variable. That's why some people recommend
  keeping a low number of men to reduce the difficulty of contracts. Each additional level 1 character before 12 or 14 ... is worth 6
  levels in strength." And the pay: "Contract payment scales with: Type, Random modifier, Difficulty rating (skulls), Renown, Economic
  difficulty, Negotiations": never the roster. So a small company in great gear meets the floor's contracts and keeps the whole purse.
- THE LONE WOLF (bb_all/1194): "Start with a single experienced hedge knight and great equipment"; roster of 12 at most; a hard origin.
- THE DAYS (bb_all/0626 Developer Posts): "we increased the time span in the early game where exclusively 1-skull contracts are spawned";
  "3-skull-contracts start to appear only after a few days have passed". Ours does this on the worth, not the skulls (rule 255, WORLD).
- OUR SWAG, KEPT: the stars are not the skulls; they are this job's danger for this crew today, played on AUTO (rules 208, 254), and the
  board posts by the day's curve (rule 255). What this round adds is Battle Brothers' budget: the contract spent on the enemy's cost.

## 2. THE MEASUREMENT, BEFORE AND AFTER (the demo itself; tools/bohemia_jobs_fit_the_company.js)
THE INSTRUMENT: one demo boot per origin, picked at the door, so the company is the origin's own out of the door (the Lone Wolf in his
gold kit, ORIGINS 11/7; A NEW CREW of three at level 2 in its own kit); 20 campaign seeds switched inside the boot (WORLD_SEED: the
fourteen bases where each code puts them); days 1, 20 and 50; THE DEALT VIEW: every offer three places a valley could post (by tier),
its fights as the reader rolls them (BohemiaJobDanger.fightsFor: the job kinds' plan, partyMath, the fight's own band roll), each played
12 times on AUTO both sides through the shell's door (nfOpts), worth on the AUTO count (rule 254); THE BOARDS: the shelf's own deal
through the day-fifty filter answered from the same worth. BEFORE is the same page with job_contract taken away (--plant old: exactly
the math before; the code with no file is the old code). Two faults of the instrument found and fixed on the way, said: (a) the map's
clock ran during a survey, so one valley was read at noon and the next at night (the dark takes a third off a shot): every read is now a
daytime read; (b) the dice came from the whole hand-over, so a fight the change never touched got other dice in the after and moved by
about 0.1: the dice are now the fight's own (its band, kind, dress day, ground, hour, crew), so an untouched fight plays the same
within one boot. NOT YET REPEATABLE ACROSS BOOTS, said: the gate's own run of the same tree on the same seeds read the new crew's wolf and
hyena jobs at days 1 and 20 lost 14 in 100 where this survey read 34 (the before was 87 on both); suspected, not proven: what the crew
screen hands the fight at boot (the crew's key is part of the dice). The gate's bars carry that margin; the cause is the next line of the
lane (handoffs/JOBS.md).

| of every 100 jobs dealt, lost more often than won | day 1 | day 20 | day 50 |
|---|---|---|---|
| THE LONE WOLF alone, all jobs, before / after | 0 / 0 | 4 / 1 | 4 / 1 |
| THE LONE WOLF, dire-wolf and hyena jobs, before / after | 0 / 0 | 63 / 1 | 61 / 3 |
| A NEW CREW of three, all jobs, before / after | 10 / 7 | 20 / 16 | 20 / 15 |
| A NEW CREW, dire-wolf and hyena jobs, before / after | 82 / 6 | 91 / 60 | 92 / 51 |
| A NEW CREW, hunts, before / after | 51 / 5 | 59 / 33 | 65 / 33 |
(20 seeds; 1,334 to 1,338 jobs a cell; the hunts 79 to 85 a cell, the wolf and hyena jobs 66 to 71.)

THE BOARDS HE SEES (posted, the day's filter on): through day 20 nothing lost more often than won is posted for either crew on day 1, and
the floor holds (day 20: 4 in 100 of the new crew's posted jobs between the day's floor 0.375 and 0.5, three stars). At day 50 (the
filter opens, rule 255) the new crew's boards: 22 lost before, 18 after; the Lone Wolf's: 7 before, 0 after (556 of 560 one star).
THE STARS (rule 208): one job a valley-day replayed on 24 fresh plays against the survey's star: no one-star job came home under 0.65 and
no three-star job at 0.8 or better, except one each side at day 20 for the new crew (12 plays against 24: the instrument's own noise);
the GAME's stars (the reader's 32 to 96 plays) are held by THE JOB TELLS THE TRUTH (rule 208(f)).
WHAT THE NEW CREW STILL LOSES (after, day 20 and 50): the rare giants' hunts (big-game: a sloth, a sabre-tooth, a giant lion, rule 389,
the hard exception by design, three stars), the Block Watch's crews (count_scale 1.3: a watch fields more men than the count), and
three-skull jobs (Battle Brothers' Hard is 105 to 135 percent of a contract). A new crew of three that never grows past day 20 is the
hard case on purpose: Battle Brothers' own floor sizes its jobs for about eight new men.

## 3. ON HIS PHONE (rule 441(a); tools/bohemia_jobs_the_board_on_the_phone.js)
The demo, a phone upright (390 x 844) and sideways (844 x 390), A NEW CREW picked at the door, valley VEGAS7, day 50: the map walks into
the Network's camp, a finger taps its BOARD, every row's stars and blood are the game's own reader. 'Fetch the pigment for the mural'
(the hyenas at the camp's ground): BEFORE 5 hyenas, danger 1.00 (it kills them every time), three stars, soaked; AFTER 3 hyenas, danger
0.70, three stars, soaked: still the hard job on that board and it says so, no longer a certain wipe. The rows read whole both ways
(records/target/jobs_11_8/board_after_upright.png, board_after_sideways.png, board_before_upright.png; board.json).
FOUND, NOT FIXED (routed): the same brigand job ('Get our people out of the pen', 5 brigands) read danger 0.66, 0.81 and 0.57 on three
boots of the same valley and day: the reader reads at the map's hour, and the hour moves (rule 208(d) keeps a job's star for the day,
not across boots). WORLD's reader; a NOTE, not this lane's file.

## 4. THE SMALL STRONG CREW (ask 102, rule 183), MEASURED
- THE LONE WOLF in his gold kit is the near-god he remembers: of 4,008 jobs dealt him over 20 valleys on days 1, 20 and 50, 1 in 100 is
  one he loses; on day 50 his boards post 556 one-star jobs of 560. Before this round the dire wolves and hyenas were his one wall (61 to
  63 in 100 lost from day 20); now 1 to 3.
- GROWING EARLY WITH ORDINARY MEN DOES NOT PAY (rule 183(a)), measured before this round's change (day 1, two valleys; the six-man fights
  are slow, so two, said): the same wolf with five level-1 hires loses 38 of 134 dealt jobs (28 in 100) against 0 alone: a hire who
  dies spoils the job (the AUTO count, rule 254), the floor (Battle Brothers' 0.75) keeps the jobs the same size, and the pay a man falls
  from 68 batteries to 8. Battle Brothers' own lesson, kept. The change does not touch it (no hire's job is costed differently).
- WHAT IS NOT HERE: an exceptional recruit priced like one (183(a)) is RUN TWO's and HIRES' (the rare men at the post shipped 11/3); the
  late turn (183(c), Battle Brothers' crisis at day 80 to 100) is COMBAT's enemy tiers. The first fifty days are what this round measured.

## 5. THE FIX, IN THE FILES
- records/target/bb/party_math.json job_contract (a modder's numbers, each with source, quote and why): beast_cost {wolves 0.45, hyenas
  0.55}, hunt_scales on, pack_flat 0.8 (WORLD's flat four fifths, moved out of the code).
- slices/bohemia_job_kinds.js __THE_CONTRACT_IS_THE_BUDGET__ (WORLD's file, one marked block and four marked lines): costed() in the
  hand-over fight() and in the stars' fightsOf add() (a hunt's pack is already counted in animals); the hunt's pack at the beast's cost;
  the hunt's kills = its row's or the kind's kills x the contract's multiplier x the beast's cost over the flat four fifths, sized once the
  first pack says what the hunt is of. The dice are drawn in the old order, so no hunt's places move.
- TUNING's one table, section Y (every row, the file named; the gate holds them equal).
- MEASURED by tools/bohemia_jobs_beast_cost.js (the beast's cost on the live fight) and tools/bohemia_jobs_fit_the_company.js (the survey;
  summary tools/bohemia_jobs_fit_the_company_sum.py; the card's picture tools/bohemia_jobs_the_card_picture.js).
- GATE gates/jobs_fit_the_company_gate.js (JOBS THAT FIT THE COMPANY): T1 to T4 the files (with three planted copies under JOBS_PLANT=1),
  D1 to D6 on the demo over 20 seeds (D5 plants the old math and must go red).

## 6. ONE FINDING THAT PROVES US WRONG
The stars were never the problem: they told the truth before this round too (the wolves job read three stars and danger 1.00). What lied
was the BOARD'S SHAPE: a contract's count was spent one man for one beast, so the job a dire wolf's ground dealt was a different job from
the one its skulls promised, and from day 30 the day-fifty filter stops hiding it. Battle Brothers never had this fault because it spends
a contract's budget on each enemy's own cost; we had copied its multiplier and not its budget.

## ROUTED
- WORLD: the reader's hour (section 3); the Block Watch's crews (count_scale 1.3) are the new crew's biggest remaining loss after the giants.
- TUNING: section Y's rows are draft; move them (the cost measure re-runs in four minutes: tools/bohemia_jobs_beast_cost.js).
- EYES: walk a NEW CREW to day 20 and take a dire-wolf job; walk the Lone Wolf's day-50 board.
[bb a Battle Brothers contract is one budget spent on each enemy's own cost; ours now spends it the same way and still shows the crew's own odds in red]
[analog horror: the board in the Network's camp still lists the hyenas as three red stars; the muralist only asks for three of them now]

## GATES (rule 13: the pre-push pass, by name; the full suite is PLUMBER 8's)
- JOBS THAT FIT THE COMPANY (new, in the suite) 9/0 on the rebased tree: T1 to T3; D1 the new crew 272 of 2,674 dealt jobs lost more than
  won (10 in 100; day 1 6, day 20 14); D2 1,118 posted, none under the day's floor, none lost on day one, work in all 40 valley-days; D3 the
  Lone Wolf 17 of 2,674 (1 in 100), wolf and hyena jobs 1 of 136, 28 jobs on every valley's boards; D4 wolf and hyena jobs 19 of 136 (14),
  hunts 19 of 206 (9), no beast fight past its cost; D5 the old math planted: 18 of 19 wolf and hyena jobs lost (95), caught; D6 nothing
  threw. JOBS_PLANT=1: T4 4/0 (three planted copies, each caught).
- EVERY JOB KIND (WORLD's): this tree 29/7, main d97cecd3 28/8 and 31/5 on two runs: the same reds (E4 to E6 the caravan's raid never
  opening a fight, F5, C4, V4/V5 the hold's waves, Z a drawImage error) are red on main and flicker run to run; H1 (the show's two tigers)
  went red on this tree's first run and is fixed (a row that names its own animals keeps its own count).
- THE CARCASS AND THE VULTURES (the packs' hold) 9/0.
- NOT RUN THIS ROUND, said: THE DANGER RAMPS TO DAY FIFTY, THE JOB TELLS THE TRUTH, MOST JOBS FIT THE COMPANY and the other 30 gates that
  read the job kinds (each boots the demo for minutes to an hour). Measured on main d97cecd3; rebased onto f2577574 (WORLD 13's zones)
  without a conflict; the numbers above are d97cecd3's.
