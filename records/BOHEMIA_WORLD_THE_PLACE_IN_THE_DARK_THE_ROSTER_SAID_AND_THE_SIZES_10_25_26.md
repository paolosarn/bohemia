# WORLD: THE PLACE IN THE DARK, THE ROSTER SAID, THE THREE SIZES (10/25/26, world-place-in-the-dark, rule 179)

The coordinator's round, in its order: (1) [eyes: the place in the dark], line 56 of
records/BOHEMIA_EVERYTHING_HE_ASKED_10_24_26.md; (2) [the roster scales the enemy], line 79; (3) the NOTE at the top of this
board (Grok's 10/25 answer: a typical Battle Brothers map has 17 settlements by kind). Rule 179: done means he can see it in
the game. Both rows were marked SHIPPED last round (07826e02, fce1fc7a) and EYES found neither in the live demo
(records/BOHEMIA_EYES_EVERY_ASK_CHECKED_ON_THE_LIVE_DEMO_10_25_26.md). This round each was played the way EYES played it.

## 1. THE PLACE IN THE DARK (line 56)

His words, 10/24 on his PC: 'take three carts to Prim, and it's really just the blue settlement.'

MEASURED (EYES, BUILD 10/25o, a phone, a new game in the dark, q05, q06): the phone's card said 'TOUCH REMNANTS ON THE MAP'
while Remnants sat under the fog, no name and no mark at any zoom from 2.4 to 0.29; PRIMM, where the carts go, was named
nowhere. WHY THIS LANE MISSED IT: two holes, both mine. (a) The names were only for a job he HELD; a job on the phone is an
offer, and the phone tells him to go touch a town he cannot see. (b) The fog hid even the held ones: the map skips a town under
the fog before it asks whether a job names it. And this lane's checker (gates/the_jobs_part_gate.js) ran with the fog lifted,
every gate's default since rule 155 (the driver's FROM_GATE rule), so it never met the dark a stranger meets.

Battle Brothers: a contract's place is put on the map when you take it, through the fog. Ours offers from the phone, from
anywhere in the valley, so the phone's jobs count from the moment they are offered.

BUILT (slices/bohemia_job_kinds.js, the hooks it already had in the map):
- Every place a job names, from the phone through the job he holds (the client's town; the real place its words send him to:
  PRIMM, HOOVER DAM, RAILROAD PASS, MT CHARLESTON LODGE, TULE SPRINGS), is opened in the fog the way SHOW THE TOWNS opens a town
  (rule 155(c)'s own small circle, fogReveal r 1.6, kept with the game: once the phone told him where it is, he knows where it
  is). The land three blocks off it stays dark.
- Named at every zoom (BohemiaJobKinds.names now answers for the phone's two and the one he lit); the town the lit card says
  to touch wears the lit ring.
- Off the glass, the lit card's two places wait at the glass's edge with a point aimed at them: 'JOB AT REMNANTS' and 'TO
  PRIMM'. A touch (or a click) on the name walks him to the town (the map's own townTap). The point is drawn after the fog (it
  was a smudge under it); the phone on the glass is part of the edge (a name never waits under the phone); two names the same
  way step apart; a name sits beside its point, never on it.
- Found on the way (RUN's code, one marked line): at the far stop, a town name stepping under the crew (__NOTHING_IS_DRAWN_OVER_
  THE_CREW__) could land on another town's name (CARAVANS on ANARCHISTS, photographed); it steps on a line at a time now.

PROOF: gates/the_place_in_the_dark_gate.js, THE STRANGER'S GAME (fog: true), a new game on the phone (390 x 844, touch) and on
his computer (1440 x 900, the mouse and the wheel): the phone's two jobs' places out of the dark at the first minute with the
land round them dark; drawn and named at the far stop and the near stop; days in a camp (the CAMP plate) until a job naming a
real place is on the phone; that place out of the dark and named; a touch on the card; the edge names; a touch on the edge name
walks there. RESULTS: see section 4.

## 2. THE ROSTER SCALES THE ENEMY, AND THE GAME SAYS SO (line 79)

His words, 10/24: 'Battle Brothers matches you with opponents by the amount of people on your roster... if I fill up my
roster, the opponents go up too.'

MEASURED: the math shipped (fce1fc7a: the roster is every man he has; 3 men to 12, a two-skull job 3 to 10, the crew job's
fight 8 against his 12) and nothing in the game said WHY a fight had more men in it. EYES met bands of three, three, four and
two with three and four men and could not see the scaling (it is invisible by its nature: a bigger fight just looks like a
bigger fight).

BUILT: the reason, said where he decides, from the map's own party math run twice (his roster, and Battle Brothers' three
recruits at 10 strength a man), never a guess:
- THE MEET CARD, before every fight (RUN's card, one marked line): under '10 MEN · MANY ★★ YOU 12', in amber: 'SIZED TO YOUR
  12 MEN. WITH 3 YOU WOULD MEET 3.'
- THE JOB, when he takes a job whose work is a fight with its crew (today's crew job, a camp, a stand): 'They will be about 10,
  sized to your 12 men. With 3 you would meet 3.' (RUN's take, one marked hook, said after the take line.)
- Said only when his roster changed the count. Words draft:true.
- partyMath (RUN's) takes ctx.strength to ask what another crew would meet, and carries its ctx on the party.

PROOF: gates/the_roster_scales_the_enemy_gate.js on his computer, the meet card answered by a hand (not the driver's
auto-ENGAGE): with three men nothing is said; nine hired at the hall by a finger on HIRE; the take line; the meet card's line on
the card; ENGAGE; the fight has that many. RESULTS: section 4.

## 3. THE THREE SIZES, BATTLE BROTHERS' 17 (the coordinator's NOTE)

Grok's 10/25 answer (reference/library/grok/GROK_ASK_118_MAP_SIZE_NUMBERS_2026_10_25.md, PASSED FILTER, cite as source: Grok,
unverified): a typical map holds 17 settlements: 2 city halls, 3 town halls, 6 village halls (civilian), 2 strongholds, 2
castles, 2 fortified manors (military); camps and other locations spawn on their own. By size: 4 large, 5 middle, 8 small.
Our own check: GROK_ASK_26 and region_bases_gate's parse of the wiki page agree on 17.

MEASURED, OURS (engine/bohemia_towns.js thirds, engine/BOHEMIA_REGION_LAND.json):

| | large (fortress) | middle (town) | small (camp) | all |
|---|---|---|---|---|
| Battle Brothers' typical map | 4 (2 cities, 2 strongholds) | 5 (3 towns, 2 castles) | 8 (6 villages, 2 manors) | 17 |
| the valley's 14 seats (power, cut in thirds: the top 5, the bottom 5) | 5 | 4 | 5 | 14 |
| the region's 21 bases (where you trade) | 0 | 4 | 17 | 21 |
| the region's 13 fight places (held ground) | 6 | 0 | 7 | 13 |

THE FINDING THAT PROVES US WRONG: past the valley, a man walks 190 km of real Nevada and never meets a big friendly place.
Every large place out there is held ground to fight (the dam, the intake, the two solar fields, Creech, Mercury: Battle
Brothers' military six, which is right). Battle Brothers puts its two cities out on the map, away from each other; ours were
both inside the valley.

BUILT (tools/bohemia_world_region.py, regenerated): the region's two biggest real towns are its two cities, the large size:
PAHRUMP (44,738 at the 2020 census, the biggest town in Nye County, the valley over the Spring Mountains) and BOULDER CITY
(14,885 at the 2020 census, the dam's own town). Realism and Battle Brothers agree. Region bases now 2 large, 2 middle, 17
small; everything in the game that reads a tier (the place's picture, its board's offers, the parties it sends, the news it
makes) reads the new one. The valley's thirds stand (rule 9/5, his 'the more prominent factions kind of feel like strong
fortress parts'), so the whole map is 7 large, 6 middle, 22 small in 35 settlements, on about 12 times Battle Brothers' ground (496 blocks across against its 140).

NOT DONE, SAID PLAINLY: [the three sizes of place] as a whole (every valley seat placed by its ground, a trait seed each, the
reachability gate) stays OPEN; this round answered the NOTE's numbers against it and moved the two places the numbers said were
wrong. The fallback table in slices/bohemia_region.js (RUN's twelve, used only when the land never arrives) still says 'town'
for both, as FACTIONS' region_bases.json does; NOTE on RUN's and FACTIONS' boards.

## 4. RESULTS (the demo, the stranger's game, this box)

THE PLACE IN THE DARK, gates/the_place_in_the_dark_gate.js:
- PHONE 10/0. EYES' own case came up by itself: 'Ride with three carts to Primm' at REMNANTS on day 3 after 2 camps. The phone
  said 'TOUCH REMNANTS ON THE MAP'; Remnants and PRIMM out of the dark (PRIMM 115 to 123 blocks off, the land round it dark 4/4),
  both drawn and named at the far stop (0.11); at the near stop (4.74) 'JOB AT REMNANTS' at the right edge and 'TO PRIMM' at the
  left, neither under the phone; a touch on 'JOB AT REMNANTS' set the walk to Remnants' own door (85,50).
- COMPUTER 10/0 (1440 x 900, the wheel): the same case, day 1 to 3; the far stop on his screen (0.40) does not hold PRIMM, so
  PRIMM waits at the edge once the card is lit ('TO PRIMM' at 326,702); a click on 'JOB AT REMNANTS' walked to the door.
  First run 9/1: the click landed on the crew's speech box (the outer page's, a few seconds), which stood over the edge name;
  the checker now waits for the box to go, the way a hand does.
- Pictures (this box): the phone at the near stop with both edge names and the lit card; the far stop with REMNANTS and PRIMM
  named in the dark.

THE ROSTER, gates/the_roster_scales_the_enemy_gate.js, his computer, 6/0:
- S1 three men: 'Sweep the sand off six panel rows', the card '2 MEN · A FEW · YOU 3', no roster line, nothing said.
- S2 nine hired at the hall by a finger on HIRE: 12 men.
- S3 the same job taken again: 'They will be about 8, sized to your 12 men. With 3 you would meet 2.'
- S4 the meet card: '8 MEN · MANY ★ · YOU 12' and under it, on the card, 'SIZED TO YOUR 12 MEN. WITH 3 YOU WOULD MEET 2.'
- S5 ENGAGE by a hand: 8 of them against 12.

THE REGION'S CITIES, gates/the_region_has_its_cities_gate.js 5/0 (his computer): Battle Brothers' 17 read off the Grok page
(4/5/8); PAHRUMP and BOULDER CITY fortress bases; the map by size: the valley 5/4/5, the region's bases 2/2/17, its fight places
6/0/7, the settlements 7/6/22; in the game BOULDER CITY drawn as a fortress (a 74 x 72 building beside HOOVER DAM's and THE
INTAKE's) and named; a click on its name is the town's (the map's own __MAP_TAP) and walks to its door; its screen opens 'BOULDER
CITY · A FORTRESS · MARKET DAY'. The first two runs read the walk wrong (the camera went back to the crew while the picture was
taken; a road party once): the checker looks again right before the click. The region's other checkers on the new land: REGION
LAND 61/0, THE NEWS DOWN THE ROAD 28/0, A PLACE IS NAMED ONCE 7/0, THE DISTRICTS JOIN 29/0, THE ONE RULER 33/0, THE REAL CORNER
16/0, REGION BASES 365/0, THE REGION IS BATTLE BROTHERS' SIZE 9/0. The generator rerun moved only the two tiers.

AFTER THE PUSH OF ROWS 1 AND 2 (c72af305, rebased over 23 other commits, UI's company screen among them in the same map file):
both checkers again on merged main: THE PLACE IN THE DARK 20/0 (phone 10/0, computer 10/0; this time the phone's first-day
offer was 'Bring the freezer from the fossil beds', TULE SPRINGS out of the dark 91 blocks off), THE ROSTER 6/0.

PRE-PUSH PASS (rule 13): the 51 checkers that read slices/BOHEMIA_CITY_WORLD.html or slices/bohemia_job_kinds.js and open no
browser: 39 green, the same 12 red on the base with the same messages (a_merge_did_not_delete_a_system, combat_lab,
future_ledgers, integration, no_orphan_script, people_charge, reachability (the census clock, 43.5 h behind the map file on
both), repo_budget, the_names_wired_in, vista (its browser path), walk_deadlock, pixel_floor). The full suite unmeasured since
this round's base.

## 5. A JOB SAYS HOW FAR (rule 186(c), first on the board mid-round; CLAIMED and built the same round)

His words, 10/25: 'every time a job is presented it should show how long it's going to take to get there... it sends me to the
other side of the map without me knowing.'

MEASURED: the board's person said the job and its pay; where it went and how many blocks came after the yes (the take line), and
the hours never, anywhere. A job at REMNANTS for the carts to PRIMM was 37 blocks to the town and 159 more to PRIMM: a day and a
half of his clock, said nowhere before he took it.

BUILT (slices/bohemia_job_kinds.js trip(); one marked hook each in RUN TWO's settlement screen and UI's phone board):
- THE TRIP IS WORKED OUT BY THE CODE THE YES RUNS: plan() is make() on a copy (a dry run marks and says nothing; the same dice,
  seeded by the job, the town, the day and the jobs done, so the same target the map would give it), and the time is the map's
  own road (cityRoute) costed by the map's own clock (cityStepMins) at the job's own pace (the carts at 1.6). At the town the
  trip is that job's exact one, leg by leg (a patrol round its posts); from the phone the walk to the town is exact, a real place's
  leg exact, else the kind's range off records/target/BOHEMIA_JOB_KINDS.json, said as a range. A job that pays back home says
  'and back'; a stand says 'you stay'.
- THE BOARD'S LIST: beside each offer's pay, '45 batteries · 2 H'.
- THE OFFER SHEET (the person, before 'Take it'), in gold under the words: 'The patrol: 26 blocks round 2 posts, about 2 hours, and
  back.' / 'The trip: 17 blocks to THE COUSIN'S FARM, about 2 hours, and back.'
- THE PHONE'S LIT CARD, under TOUCH REMNANTS ON THE MAP, in the card's ink: '3 H TO REMNANTS, THEN 1 DAY TO PRIMM'.
- NOTHING WALKS ON A YES: taking a job never starts a journey (his GO is a touch on the map), checked.

PROOF: gates/the_trip_before_the_yes_gate.js, his computer 7/0 and the phone 7/0: the list's times; every offer's sheet says the
trip; 'Take it' makes the job where the trip said (the patrol's first post [36,55] both times) and nothing walks; his GO: the
map's own 'Setting out: 17 blocks, about 1.5 h.' against the trip's 17 blocks, 1.52 h; the real places (PRIMM 135 blocks about
20 hours from ANARCHISTS, HOOVER DAM, RAILROAD PASS, the lodge); the phone: '3 H TO REMNANTS, THEN 1 DAY TO PRIMM' and the
walk to REMNANTS 'Setting out: 37 blocks, about 3.4 h.'

## 6. MOST JOBS FIT THE COMPANY (rule 192, first on the board mid-round; CLAIMED and built the same round)

His words, 10/25: 'I don't know why the game is so in love with throwing overpowered enemies in like 75% of the quests that I take...
look how Battle Brothers does it.'

MEASURED FIRST (tools/bohemia_world_most_jobs_fit.js: the live fight's own rules, TUNING's engine, AUTO both sides, 30 fights a cell;
the company as it would stand: day 1 a new crew of three, day 20 six at level 3, day 50 nine at 5, day 90 twelve at 8):

| | before (one enemy a man, dressed for the calendar) | now (Battle Brothers' contract math, dressed for his strength) |
|---|---|---|
| day 1, 1/2/3 skulls | 2, 3, 4 men: won 100, 100, 80 | 3, 4, 4 men: won 100, 80, 80 |
| day 20, six at L3 | 7, 8, 11 men: won 33, 37, 13; outclassed 97 to 100 | 3, 5, 6 men: won 90, 70, 50; outclassed 63 to 90 |
| day 50, nine at L5 | 13, 13, 13: won 50, 50, 50 | 6, 9, 12: won 100, 80, 67 |
| day 90, twelve at L8 | 13, 13, 13: won 77 each | 10, 13, 13: won 97, 77, 77 |
| win per star | 1★ 100 (1 cell), 2★ 74, 3★ 40 | 1★ 97, 2★ 77, 3★ 69 |

THE CAUSES, all in the job math: (1) a job's count grew one enemy for each man AND each two levels of his (party_math job:
strength_per_enemy 10), and the 13-man cap flattened every star past day 50; (2) its enemies were dressed for the calendar day while
Battle Brothers scales a contract by the company's strength alone (only roaming parties by the days); (3) the stars counted the party
against his men, so a one-skull job of seven men against his six read two stars and was lost two times in three. ALSO MEASURED: the
board's shelf is Battle Brothers-shaped (17 one-skull, 16 two, 6 three of 39), but the phone shows the two best paid in the valley
(rule 148, his) and pay is 30 a skull, so 94 in 100 of the phone's jobs are three skulls: the phone hands him the hardest work.

BUILT:
- records/target/bb/party_math.json job_bb: Battle Brothers' contract multiplier (Grok 105: 0.94 x (strength / 100)^0.89 held to
  0.75..5) on a base a skull (OURS, calibrated: 4, 6, 8) times the difficulty; and the dressing: a job's party is dressed for the day
  a typical company stands that strong ([30, 1], [84, 20], [162, 50], [288, 90]), a roaming party still for the calendar.
- RUN's partyMath reads it (the map's own numbers until the file loads); loopJobStars: THE STARS ARE THE SKULLS (192(a)); RUN's
  THE JOB'S STARS gate follows (S1 the stars are the skulls; S2 a bigger company keeps the stars and meets a bigger party).
- NO TEST SETTING LEAKS (192(c)), looked for: no forced superior enemy, tier floor or late mix in the map, the shell or the fight;
  ours.json enemy_tiers.difficulty_days adds days only above Veteran (the door's default is Veteran).
- NOT MINE, NOTED: COMBAT's OUTCLASSES YOU mark (rule 143(b): three levels over his best, the enemy's level read off his row's xp)
  fires on ordinary middle-tier raiders against a level-3 company: in 63 of 100 one-star day-20 fights he wins 90 of. With
  ours.json enemy_tiers.leader_from_count 4, every party of four or more carries a leader. The mark reads 'overpowered' when the
  fight is not; NOTE on COMBAT's board with the numbers. TUNING: base_men and dress are the felt numbers for its one table.

PROOF: gates/most_jobs_fit_the_company_gate.js 5/0: M1 the stars tell the truth at day 1, 20, 50, 90 (1★ 85+, 2★ 60+, 3★ 30 to 90);
M2 at most 15 in 100 of a board's jobs lost more often than won (0 at every point); M3 the gate bites (the old math fails M1: day
20 one star won 30); M4 the demo uses it (a new crew's job dressed for day 1 on day 40, a roaming party for day 40, the stars the
skulls).
