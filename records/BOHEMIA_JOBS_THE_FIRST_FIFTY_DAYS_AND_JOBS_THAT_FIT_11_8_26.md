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
4. THE SMALL STRONG CREW IS ALREADY REWARDED, MEASURED: the Lone Wolf in his gold kit (ORIGINS 11/7) wins nearly every job the valley
   deals him in the first fifty days; the same wolf with five ordinary hires loses about one dealt job in four on day one (a hire who
   dies spoils the job), and the pay a man falls six times. That is Battle Brothers' own lesson ('Each additional level 1 character...
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
