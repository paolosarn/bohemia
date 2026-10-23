# RUN [the first hour, quicker]: THE MAP AND THE TOWN WERE THE SLOW PART (10/23)

RULE 133 (Paolo 10/23, LOCKED): "the whole point of this project was to be like Battle Brothers but quicker and funner
for normies, also kind of hardcore vibes if you're fucking around too much." TUNING's page
(records/BOHEMIA_TUNING_QUICKER_AND_FUNNER_FOR_NORMIES_THE_TEN_CHANGES_10_23_26.md): "THE FIGHT IS NOT THE SLOW PART.
THE MAP AND THE TOWN ARE." RUN's row: changes 1 to 5, in rank order, each measured against the stranger's walk, before
and after. No card (rule 127). Demo cut BUILD 10/23c - THE FIRST HOUR, QUICKER.

## THE STRANGER'S WALK, AS A TOOL

TUNING walked a stranger by hand. A walk by hand cannot be run twice, so "before and after" would be two different
walks. tools/bohemia_run_the_first_hour_walk.js is the same walk through the one driver (rule 14g), real touches on the
phone profile (390 x 844, touch): the door's defaults, the phone's first job, the town's NAME (the word a stranger reads),
again if nothing happened, 1x if the pad sits on PAUSE, the board, the job, the fight cleared, the pad after the fight,
the phone after the pay, a party touched, the fight's size, a party coming for him, and nightfall. Four steps are scripted
and marked in the tool (the fight's end, the hunter's spawn, the purse emptied for the second night, the clock moved to
21:50). The gate THE FIRST HOUR, QUICKER (gates/the_first_hour_quicker_gate.js, in the suite) runs it and holds the after.

## BEFORE AND AFTER (same walk; before = BUILD 10/23b as committed, after = BUILD 10/23c)

| | BEFORE | AFTER |
|---|---|---|
| the door, nothing picked | SEEN IT + THIN SHELVES, 240 batteries | NEW HERE + FULL SHELVES, 290 batteries |
| the phone's job touched | the card lit, the map did nothing: 1 dead tap | the road to Church drawn, Church lit: 0 dead taps |
| to the first town | the name touched: walked 2 blocks into a 3 v 3 he never asked for; PAUSE after; 4 more touches stood him on the block under the word ('You are standing there'): **7 wrong taps, 1 unplanned fight, never the town** | **1 touch, 0 wrong, 0 fights, the town open at 5.8 s** |
| the first job | (never reached) | fight at 18 s of play, the job's own, paid 45 (FULL x1.5) |
| after the fight | pad on PAUSE | pad back at 1x, the next touch goes |
| the phone after the pay | the finished job still listed ('5H AGO', TUNING) | gone |
| a party touched | travelled toward it, no numbers | a plate: how many, skulls against his crew, where it is going; no journey, no fight |
| a roster with no party (the street's hand-over) | no party: COMBAT's nine brigands | a party of its length; day one no more than the company plus one (6 -> 4 for three men) |
| a forced road event | a fight where he stood | a party in sight, 5 blocks off, its plate, the road away lit; fled: 5 -> 8 blocks in 5 steps, no fight; walked into: the fight |
| nightfall | 1 battery of rent; **the clock stopped at 22:00 of day one for good** | the crew's bill (3 men x 2 = 6), the day turns to 06:00 day 2; 53 days left |
| a night he cannot cover | (no second night existed) | one man walks (RAUL), says why with his own face, the crew is 2 |

## WHAT IS BUILT, CHANGE BY CHANGE

1. EVERY FIGHT SIZED TO THE CREW. The shell's nfOpts turns any roster into a party of its length (the street's crews,
   the bump, a tapped man, a door's room all reached COMBAT with no party and got nine brigands). The map's one door
   stamps firstDay and crewCount; on the first game day no party is bigger than the company plus one, in partyMath on the
   map and in nfOpts in the shell, so the plate's number is the fight's number. Two- and three-skull jobs keep their size
   from day two. COMBAT keeps the fallback band (change 1b, theirs).
2. THE FIRST TAP GOES SOMEWHERE. (a) a job touched on the phone draws its road to the town that posted it, in the phone's
   amber, the dots walking on the beat, and lights the town (a ring on its ground, its name lit and named at every zoom,
   kept whole at the glass's edge); the phone still only shows (rule 51), the next tap on the lit town goes. (b) a tap on
   a place on PAUSE sets out at the speed he last chose; a route held on PAUSE is replaced by a new tap, not cancelled.
   (c) the map comes home from a fight at the speed he had (PAUSE is still dropped at the bell, 44a). (d) A TOWN'S NAME
   SITS ON THE GROUND at its gate, under the people standing there; it floated 40 px above the building, in the air over
   the street the parties walk, which is how the word CHURCH sat on a moving patrol. A tap on the name, or on the
   building where the block under the finger is within two of the town, is the town's: standing at it opens it, anywhere
   else sets out for its gate. (e) a finished job leaves the phone (LOOP.doneIds, read by UI's board with the held ones).
   AND TWO BUGS THE WALK TRIPPED: a second touch on the JOB while the camera pulled back into its fight handed the job
   over twice and the pay never landed (one fight per job; no tap lands during the pull-back); and a job could land
   under the phone where no finger reaches it (THE LOOP PLAYS ON THE MAP L8, red on main): a job now lands on the glass
   (mapOnGlass) and the old placement is only the fallback. THE LOOP PLAYS ON THE MAP 12/0 (was 11/1 on main).
3. LOOK BEFORE YOU FIGHT. A party's first tap is a look: a plate riding its flag with how many, their skulls against HIS
   crew (one: fewer than his crew; two: up to one more; three: bigger; TUNING's line at early gear until TUNING's skull
   line lands) and where it is going; the second tap goes after it and contact is the fight (once a day per party). A
   FORCED ROAD EVENT ON THE MAP IS A PARTY HE CAN SEE (rule 68): the bounty squad, the toll crew, the crazed man and the
   casino's bot appear five blocks off on the glass (never under the phone, never on a town's gate), their plate always
   up with the blocks to contact, and the road away lit (the best block within five he can reach, a road preferred).
   They move only when he moves: on foot two blocks for his three on dirt, one for his two on a road; they give up past
   nine blocks or forty steps. Never in the first sixty seconds. Nothing stops the march. The animals stay out (CREATURES
   is open; they never fought here).
4. THE EASY END IS THE DOOR'S DEFAULT. NEW HERE + FULL SHELVES (46 -> 78 in 100 on TUNING's bench); the cards say what
   they do: 'every crew one man smaller', 'more to start, jobs pay half again', 'least to start, jobs pay a quarter
   less'. A returning player's own pick still wins. THE FRONT DOOR re-aimed (D2 the easy end; D6 the crew is the party
   math's since 10/5, it was red on main for the old '2 + 1' formula): 7/0.
5. ONE BILL IN DAYS. records/target/bb/nightly_bill.json (2 a man a night: a ration and four litres at the counter,
   ECONOMY Day 69/74; mod-readable): nightfall takes the crew's bill out of the batteries before the lights and the rent.
   window.__BILL carries the days left (ECONOMY Day 74's definition: nightfalls at tonight's bill if nothing comes in),
   the phone says it each night ('Ate tonight. 6 batteries. 48 days left like this.'). A night he cannot cover, one man
   walks (the newest hire first, then the company from the back; never YOU), says why with his own fresh portrait
   (PORTRAIT's, through engine/bohemia_crew_faces.js) at the foot of the map for eight beats, and the fight's company
   drops him (bohemia.walked.v1). THE DAY TURNS IN THE DEMO: the 8/4 'one good day' end (ctDemoOver) sent the demo to a
   refused ending card at the first nightfall and the clock stood at 22:00 for good; rule 72 (newer) says the map is left
   open, so the day turns and [demo end] builds the stop. The day-two overlook (the walking era's money shot) no longer
   opens over the map by itself: it was a forced 'TAP ANYWHERE TO GO BACK'.

## ROUTED (one line each)
- UI [the bar's two numbers]: the second number is window.__BILL.daysLeft in the city frame (red when window.__BILL.red);
  the bar's crew count (3/12) should read window.__BILL.crew, a man who walked is gone. The party plate's look is yours
  (mapPlatesDraw draws P.party plates with P.sk skull marks).
- RUN TWO: the crew screen should leave out the men in localStorage bohemia.walked.v1 ([{name, look, i | hired, day}]).
- COMBAT: change 1b (the fallback band by company) stays yours; every hand-over with a roster now carries a party.
- TUNING: the nightly bill's 2 and the skull line belong in the numbers table; the hunters' speeds and sight (5, 9, 40,
  2 of 3 and 1 of 2) wait on Grok ask 20.
- WORDS: the walking man's line, the hunter line and the door's card lines are draft:true attempts.

## GATES (pre-push pass, rule 13)
THE FIRST HOUR, QUICKER 11/0 (new, in the suite); THE LOOP PLAYS ON THE MAP 12/0 (was red on main); THE FRONT DOOR 7/0
(was red on main); DEMO BUILD 25/0; THE PHONES BOARD green; NO TWO TEXTS OVERLAP ON THE DEMO 14/0; A FRESH PHONE SEES
THE DOOR 9/0; MAP DENSITY 13/0; THE MAP STANDS UP 12/0; THE MAP AT THE PHONE'S PIXELS 16/0; THE ORIGIN SETS THE COMPANY
7/0; THE TOWN AND THE HIRE 8/0. RED, NOT THIS ROUND'S (identical on main): THE FACE ON THE MAP IS HIS A2, VISTA BEAT
(both press the dead day card, [the sign fix]).

[bb Battle Brothers names its towns over their art and shows a party's banner but not its numbers (the Numbers mod puts
them back); ours puts a town's name on its ground, a party's numbers and skulls on its flag, and a crew that is coming
for you is a crew you watch come.]
[analog horror: the bill is the horror, not a jump scare: a number of nights left in the corner of the phone, and the
night it reaches zero a man you hired looks at you and walks off the map.]
