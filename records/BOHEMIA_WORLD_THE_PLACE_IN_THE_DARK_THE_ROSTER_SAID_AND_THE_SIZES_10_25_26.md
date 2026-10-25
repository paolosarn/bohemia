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
| the valley's 14 seats (power, cut in thirds) | 5 | 5 | 4 | 14 |
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
fortress parts'), so the whole map is 7 large, 7 middle, 21 small in 35 settlements, on 12 times Battle Brothers' ground.

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

PRE-PUSH PASS (rule 13): the 51 checkers that read slices/BOHEMIA_CITY_WORLD.html or slices/bohemia_job_kinds.js and open no
browser: 39 green, the same 12 red on the base with the same messages (a_merge_did_not_delete_a_system, combat_lab,
future_ledgers, integration, no_orphan_script, people_charge, reachability (the census clock, 43.5 h behind the map file on
both), repo_budget, the_names_wired_in, vista (its browser path), walk_deadlock, pixel_floor). The full suite unmeasured since
this round's base.
