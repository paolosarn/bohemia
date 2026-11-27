# JOBS 2 -- THE WORK SPANS HIS STRENGTH (BUILD 11/27y - THE WORK SPANS HIS STRENGTH), 11/27/26

VAMILY rule 491 (Paolo 11/27: 'I'm tired of the enemies not having enough of their own... the jobs not scaling with my team power
level'; 'I know Battle Brothers has a power level stat system set up'). JOBS 2 owns (b) the offers and the reader, the measurement
(d) and the strength number (e); BESTIARY 3 owns (a) the forces' numbers and kit. Rules 254, 255, 441, 480.

## (c) HOW BATTLE BROTHERS DID IT, CITED
- CONTRACTS scale with the ROSTER'S STRENGTH, 'a sum of individual strengths [10 + 2*(lvl-1)] of 12 strongest brothers', the
  contract's skulls, its type and the type's own factors (reference/library/grok/wiki/PAGES_ALL.tar.gz bb_all/0828_Game
  Mechanics.txt, 'Enemy Troop Size and Composition'); 'contract-spawned mobs and locations are always closely matched to the
  player's party'; 'roster strength has a very significant impact on enemy troop size and composition'.
- ROAMING PARTIES and places scale mostly with distance to civilization and time, slightly with strength (same page); the combat
  difficulty raises both numbers and tier.
- 'Gear does not count. Benched men still count. Extra men past the field cap do not' (reference/library/grok/GROK_60_ENEMY_MATH_
  2026_10_02.md); the militia and the manhunters count 14 (same).
- The contract's count: Battle Brothers' multiplier 0.94 x (strength / 100)^0.89 held to 0.75..5 on the skulls' base (GROK_ASK_105,
  already the map's partyMath 'job', records/target/bb/party_math.json job_bb), dressed for the day a company that strong stands
  (job_bb.dress).
OURS (rule 491(e): 'one number from every man's level and kit'): Battle Brothers' number with each man's armour in it.

## WHAT WAS THERE, MEASURED
The map already sized a job's party by Battle Brothers' contract math on the roster's strength, from every man he has (the line,
the bench, the hires: slices/bohemia_job_kinds.js rosterLevels), and the danger reader already plays each job against his real crew
in his real kit (the shell's own door). The gap: the STRENGTH counted levels only, so a company that bought good armour met forces
sized and dressed for its levels. And the top was flat: a two- and a three-star job both hit the job's most, 13 men.

## BUILT
- THE ONE NUMBER (slices/bohemia_job_kinds.js strength(), __THE_COMPANY_HAS_ONE_STRENGTH__): the 12 strongest (14 for the wide
  origins) at 10 + 2 a level past one plus each man's head and body armour (records/target/bb/armor.json durability) at
  party_math.json roster_strength.kit_per_armour 0.01 a point (a rag kit +0.4, a middling kit +2.1, the best kit +6, three levels;
  draft, TUNING's and BESTIARY 3's call). The map's partyRosterStrength() reads it, so the forces' size and dress follow it.
  FOR BESTIARY 3: BohemiaJobKinds.strength() -> { strength, levels, kit, men, counted, armourRead }, kept as window.__COMPANY_STRENGTH.
- ONE JOB TO SWEAT FOR (slices/bohemia_board_shelf.js __ONE_JOB_TO_SWEAT_FOR__): when nothing on offer anywhere in the valley reads
  red for his crew (rule 254: under job_danger.json cut_one 0.8) and a place's own list holds a red the day's floor lets through
  (rule 255 governs the early weeks), that place posts it in place of its last job; its next two are asked to be read. The job keeps
  its one door; the same reads post the same boards.

## (d) MEASURED: A WEAK, A MIDDLING AND A STRONG COMPANY (tools/bohemia_world_most_jobs_fit.js, the fight's own AUTO, seeded, n 24)
Won in 100 for a job of one, two, three stars (the boards offer them 44, 41 and 15 in 100):

    company                               strength (levels / with kit)   levels only      with kit 0.01
    weak: 3 men of level 2, day 1         36 / 36                        96 / 79 / 79     96 / 79 / 79
    early: 6 of level 3, day 20           84 / 84                        96 / 63 / 42     96 / 63 / 42
    middling: 9 of level 5 in mail, d50   162 / 189                      96 / 88 / 29     96 / 75 / 29
    strong: 12 of level 8, late kit, d90  288 / 355                      96 / 46 / 46     88 / 46 / 46

The kit weight was measured, not guessed: at 0.02 the middling company won a two-star job 4 in 100 and a three-star never (dressed
for day 67); at 0.005 nothing moved; at 0.01 the middling company's work spans easy, fair and one to sweat for, and the strong
company is offered real danger (a two- or three-star job won 46 in 100). The strong company's two and three stars are the same
fight: the job's most, 13 men, is BESTIARY 3's (rule 491(a), 'never three men against twelve').

## GATE
THE WORK SPANS HIS STRENGTH (new, gates/the_work_spans_his_strength_gate.js): W1 the number (three recruits in rags 30, twelve of
level 8 in the best kit 360 = 288 levels + 72 kit, the militia 14); W1p the kit weight taken out planted; W2 the measurement (the
middling company easy, fair and one to sweat for, the strong company offered real danger); W3 the sweat job on the real shelf
(posted at its own place, nothing swapped when a red is already on offer, one door); W4 on his phone (the map reads the one number,
the offered jobs' reads counted); W5 nothing threw. 6/0: W2 at n 16 read the middling company 94/63/31 and the strong 94/56/56; W4 on the demo, a new crew of
three: 38.7 (36 levels + 2.7 kit), the map's party math reads the same, the jobs on offer on day 1 15 green and 5 red (7 still
reading at two minutes).
THE BOARDS ALWAYS HAVE WORK W1 to W6 6/6; A JOB HAS ONE DOOR 4/0; THE TOWN'S BOOK files 10/0; A FEW, NOT TWELVE 7/0.
MAIN'S OWN REDS, the same before this build: MOST JOBS FIT THE COMPANY 3/2 (it measures without kit; its M2, a strong company
at day 90 losing 56 in 100 offered jobs, is the 13-man top, BESTIARY 3's (a)); THE ROSTER SCALES THE ENEMY 4/2 (the meet card's
words and its ENGAGE, word for word on main).

[bb Battle Brothers sizes a contract to the twelve strongest men you have; the sellsword in famed armour is still a level 8 to it]
[analog horror: the crews on the road start wearing what you wear]
