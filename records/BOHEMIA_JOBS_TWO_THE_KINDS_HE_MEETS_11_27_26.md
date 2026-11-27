# JOBS 2 -- THE KINDS HE MEETS (BUILD 11/27zzd - THE CARAVAN GOES TOWN TO TOWN), 11/27/26

VAMILY rules 493(a) and 494(a)(b). Paolo 11/27: 'I have five combat people [that] were absolute killers and there's no more
challenges, nothing else to do' and 'in Battle Brothers there's so many different quest types... I haven't seen one caravan quest...
go from one city to another... I feel like we're not doing enough in a lot of that universe'. JOBS 2 owns 493(a) and the company's
goals, and 494's kinds and boards; WORLD 16 owns the caravan truck on the roads (it shipped 11/27zs, THE CARAVAN DRIVES).

## 1. 493(a): A COMPANY LIKE HIS -- THIS LANE MEASURED IT WRONG, BESTIARY 4 BUILT THE FIX, MINE WAS DROPPED UNSHIPPED
- WRONG FIRST: tools/bohemia_world_most_jobs_fit.js (new --company 5,11,late,90) read five men of level 11 in the late kit 96/50/21 in
  100. That tool SETS a man's level and never climbs him (no raised rolls, no perks). EYES 2 (ask row 783) made the same five the game's
  own way and every job on every board read 'clean 100'. Theirs is the true one; 96/50/21 is struck. Anything past day 20 is measured
  with climbed men (EYES' builder, tools/bohemia_eyes_five_killers.js), never with the fit tool.
- WHY: Battle Brothers counts a man 10 + 2 a level, so five men of level 11 are 150 (171 with their armour), the strength of nine men of
  level 5, and their jobs were dressed for day 53. Measured here with men climbed EYES' way (n 12 to 16): five of level 11 100/100/100;
  nine of level 5 in mail 100/88/75; twelve of level 8 win the job's most (13 men at day 100) every time.
- A FIX WAS BUILT HERE AND DROPPED: dressing a job for the men's mean level moved five killers' three-skull job to 75 in 100 and left the
  rest alone; counting each perk in the strength was tried and thrown out (the forces change tier at day 60 and a middling company
  stands at day 59: one point a perk threw nine of level 5 to 92/17/0). WHILE IT WAS BUILT, BESTIARY 4 SHIPPED THE SAME LEVER IN THE SAME
  FUNCTION (BUILD 11/27zzb THE ENEMY GROWS: partyMath's dress reads his men, a few strong men sized nearer the company they fight like,
  champions; five killers' three stars 100 -> 8 in their record). One system, one session: theirs stands, mine never reached main.
- FOR BESTIARY 4, THE NUMBER: BohemiaJobKinds.strength() -> { strength, levels, kit, men, counted, armourRead }, window.__COMPANY_STRENGTH;
  a company like his is 171.

## 2. 494(a) MEASURED: WHICH KINDS HIS BOARDS OFFERED (tools/bohemia_jobs_the_kinds_he_meets.js)
A RUN LIKE HIS, ON THE REAL BOARDS: the real board code (slices/bohemia_board_shelf.js, run as the page runs it), the real shelf and the
job kinds' people, the valley K7QM9X's 13 places with each day's news (sick, market day, raided) dumped from the demo
(records/BOHEMIA_JOBS_TWO_THE_VALLEY_PLACES_K7QM9X_11_27_26.json), the real day's floor and rare roll (sliced from
slices/bohemia_job_danger.js), his name growing the way BohemiaRenown counts it (a job done 100, five a man beaten), one job done every
two days (the best-paying one he would win). THE STAND-IN, SAID: a job's read is the fit tool's AUTO for a company like his on that day
by the job's skulls (the real reader plays each job's own enemies); this tool asks which KINDS the boards post.

ON MAIN (5be5b4041), the first day a board offered each of the nine kinds the map plays:

    kind                  before   now      jobs of it posted in days 1-15 (before / now)
    escort a caravan      day 1    day 1    34 / 42
    find a place          day 1    day 1    12 / 13
    find a person         day 1    day 1     3 /  3
    hunt a kind           day 2    day 3     4 /  3
    clear a camp          day 18   day 1     0 /  5
    carry                 day 1    day 1     9 /  5
    hold and defend       day 4    day 4     6 /  4
    recover and return    day 1    day 1    15 / 15
    patrol                day 18   day 2     0 /  3
ON THE DEMO (EYES 2's own sweep, tools/bohemia_eyes_five_killers_on_the_page.js EYES_SWEEP=1, no name, every window to day 88, his
crew's reads as they come): before (EYES, row 784) hunting, a camp, holding and patrol 0 of 640 jobs; on this build clear a camp, hold,
patrol, carry, find a person and recover on day 1, hunting on day 10 (every hunt on the shelf reads under the day's floor for a new crew
of three: rule 255, Paolo 10/26, 'I don't even want you to have jobs available like six wolves'; a patrol sometimes waits for its read
too). Three tries got there, each measured on the page: a missing kind asked place by place (hunting day 28, a camp never: the news and
the town's own person filled the slots), then the scarcest kind first (a camp day 10, holding never), then ONE PASS FOR THE VALLEY.

WHY HE NEVER MET A CARAVAN (the caravan was on offer from day 1): NOT ONE OF THE THIRTEEN ESCORTS WENT FROM ONE OF THE VALLEY'S TOWNS TO
ANOTHER. Eleven went to a spot the words named (THE TRUCK STOP, THE DRY CAMP, THE TOWER BANK: a made block on the map) and two out of
the valley (Hoover Dam, Primm). Battle Brothers' Escort Caravan goes settlement to settlement. And its titles say 'walk the water carts',
'haul two tankers': nothing a player reads as a caravan.
OTHER FINDINGS: a camp showed one job (no choice); a fortress showed one or two (its two- and three-skull work waits for a name, rule
453: 250 and 1,050); 9 of 397 boards with two or more jobs were all one kind (two caravans and nothing else); 21 jobs in the valley on
day 1.

## 3. 494(b) BUILT: THE BOARDS SHOW THE RANGE
- THE CARAVAN GOES TOWN TO TOWN (slices/bohemia_job_kinds.js __THE_CARAVAN_GOES_TOWN_TO_TOWN__): a caravan row whose place names a town
  ({town: 'Church'}) goes to that town's door, however far; a valley without that town (a new valley every game) sends it to another town
  in range, never to a made spot. SIX NEW CARAVANS, each from a person with a face at his own town (records/target/BOHEMIA_JOB_KINDS.json
  board_people, words draft:true, paid by ECONOMY's bake):
    Nacho Villaseñor (Caravans)  Ride the flour truck to the Church            1 skull   40
    Rosa Benítez (Trades)        Walk the copper truck to the Mob              1 skull   40
    Hermano Julio (Church)       Walk the soup carts to the Volunteers         1 skull   40 (60 on his card: food is short, rule 485)
    Ofelia Strand (Blues)        Ride the cold van to the Reds                 2 skulls  80
    Sal Bruno (Mob)              Escort the battery truck to the Network       2 skulls  80
    Lorna Yates (Remnants)       Ride the fuel convoy to the Anarchists        3 skulls  168
  WORLD 16's truck (11/27zs) follows him on them, and the raiders come for it on the road.
- A BOARD MIXES KINDS (slices/bohemia_board_shelf.js __EVERY_KIND_HE_MEETS__, reading the map's own BohemiaJobKinds.kindOf): a board
  takes a kind it does not hold before a second of one it does; the town's own person and the job that brings what is short never add a
  second of a kind (it waits for the board's last pass). 9 of 397 one-kind boards -> 2 of 576 (the Caravans' own board, the caravan house, and the Network's,
  once each, past day 20).
- EVERY KIND EARLY, THE VALLEY'S PASS (slices/bohemia_board_shelf.js draft()): every kind with a play of its own that no board drafted
  this window, the scarcest first, is asked of the places in the draft's order; the first that can offer one (its tier, its trust, his
  name, the rare roll) puts its least dangerous job up, in an empty slot or in place of its last job when that job repeats a kind on its
  board or is played by legs (never its news or its own person). The day's floor still decides what is posted (rule 255).
- THE CHOICE IS REAL (the shelf's counts, tools/bohemia_run2_board_shelf.py): Battle Brothers: 'The number of contracts on offer in a
  single settlement is no longer limited to just 3' (reference/library/grok/wiki/PAGES_ALL.tar.gz bb_all/1415 News and Dev Blogs): a
  village's few, a city's more. Ours was QUESTS QR-O's camp 1, town 2, fortress 3; NOW camp 2, town 3, fortress 4, still four at most
  (the board fits the phone, row 737), a raid still leaves one. MEASURED: day 1, 30 jobs in the valley (was 21), every camp and town board
  two or more; on the demo, a new game: 34 people on 13 boards (THE BOARDS ALWAYS HAVE WORK B1).
NOT CHANGED: one job, one door (rule 255's floor and A JOB HAS ONE DOOR 4/0); a posted job stays posted; the floor (rule 255) and the
names (rule 453) still keep work back.

## 4. GATES
THE KINDS HE MEETS (new, gates/the_kinds_he_meets_gate.js) 7/0: K1 every kind by day 6, the caravan day 1, a town-to-town caravan day 1;
K1p planted, the deal before this build (main's board code without the kinds reader, the old counts): clear a camp day 13 (bites); K2
2 of 576; K3 counts and 30 on day 1, no camp or town under two; K4 ON THE DEMO UPRIGHT: 6 of 6 town-to-town caravans planned at their own
town go to the town their words name, to its door ('walk the flour sacks to CHURCH, north-east, far out'); K6 ON THE DEMO, EYES' sweep:
every one of the nine by day 10, at least seven on day 1, the caravan on day 1 (a run: hunting day 10, find a place day 4, the rest day 1);
K5 nothing threw.
THE WORK SPANS HIS STRENGTH 6/0 after the W2 line moved: the strong company's top read 56 at 11/27y and reads 63 now ON CLEAN MAIN 5be5b4041
(the fight moved under it: BOSSES 99107775e, COMBAT FIVE cccdb9d77; the same tool, the same numbers, 81/63/63 with 54 in 100 of his men
down): still real danger, under the AUTO's green 80; the line is 70 now, said in the gate. W4 on the demo: day 1, 23 jobs green and 9 red.
Also run: THE BOARDS ALWAYS HAVE WORK 24/0 (the demo, two valleys, every board), A JOB HAS ONE DOOR 4/0, A JOB PAYS FOR THE TIME AND THE
RISK 23/0 (the bake checks), A NAME FADES 4/0, EVERY FOE AGREES 4/0, THE TOWN'S BOOK files 10/0, THE NEW KINDS files 6/0, THE NIGHT, THE
TURN AND THE BID files 7/0, THE CARD READS CLEAN files 1/0, THE WORK FOLLOWS WHAT IS SHORT files 4/0, NO RUN ENDS FOR TAPE 20/0, DEMO
BUILD 25/0, DEMO IS CURRENT 16/0.
MAIN'S OWN REDS, the same on clean main 5be5b4041: THE SIX CONTRACTS 5/2 (S2 foe_says, S3 a code site), EVERY JOB KIND 36/1 (F5 the
find job's pay at Colorful), THE JOBS' PART 5/3 (the meet card's roster reads null: R1, R4 and a throw at line 217; JOBS' own gate, NEXT).

## 5. NEXT (this lane)
494(c) Battle Brothers' whole contract list, cited, each a Bohemia version or a reason, map ones first; 493(c) the company's next goal
on the phone, a face says it; THE JOBS' PART's roster read; the paid-to-match half of 491(b).

[bb Battle Brothers' caravan goes from one settlement to another; ours went to a made spot, and he never knew it was a caravan]
[analog horror: the soup carts arrive at the Volunteers' camp and the mule is the only one who knows the road]
