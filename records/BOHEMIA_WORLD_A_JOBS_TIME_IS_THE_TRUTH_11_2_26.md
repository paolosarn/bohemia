# A JOB'S TIME IS THE TRUTH (WORLD 4, 11/2/26; rule 307; ask lines 242 and 299)

## HIS WORDS (11/2, the second time, angry)
'the time that it takes on these quests are extremely inaccurate a lot of the times, so that needs to get fixed for real... I'm
tired of that shit being inaccurate as fuck.' The first ask (line 242) was never closed: EYES saw ONE job true (183 map minutes for
'about 3 hours'); nobody had measured many.

## HOW IT WAS MEASURED (the probe, kept: tools/bohemia_world_job_time_probe.js)
The real demo (slices/BOHEMIA_DEMO.html, its map BOHEMIA_CITY_WORLD.html and every script it loads), driven by Playwright. Five
towns (Anarchists, Blues, Caravans, Cartel, Church), every job kind on the board shelf (the ten of before; after the rebase onto
main, CONTENT's nine new kinds too: ambush, envoy, bounty, scout, burn, collect, big-game, signal, free). For each job:
- THE PROMISE: BohemiaJobKinds.trip(), the same words he reads before the yes (the board standing at the town; the phone's card
  from another town: the walk to the town and then the job).
- THE YES: loopTakeContract(), the board's own take.
- THE WALK: the map's own PLAY (mapPlayGo, two jobs in three) or his own taps (the job's mark, the town; one in three), at the
  pad's fastest speed (every block still one step paying its own clock; only the wall clock is quicker). Every fight won the way
  the gates win them (a fight costs no map minutes). Started by day or by night (half and half).
- THE CLOCK: every minute advance() spent from the yes (or the phone's first step) to the pay, and who spent it (the step, the
  old road director's 20 minutes, a leg's wait).
THE BAR (rule 307): 9 of 10 jobs within 15 of every 100 of the promise; none off by more than 30 without saying why. A range
counts as kept when the walk lands inside it (15 either side). A job that never finished is off. hold-defend promises no time
('The job is the town itself: you stay': its waves are fights, which cost no map time) and is not judged; from the phone its walk
to the town is.
Run it: `node tools/bohemia_world_job_time_probe.js` (PROBE_N, PROBE_TOWNS, PROBE_KINDS, PROBE_PART=0/2 for two browsers,
PROBE_TRACE=1 for every poll's place and time left); the table: `node tools/bohemia_world_job_time_probe.js table <file.jsonl>`.

## MEASURED BEFORE (60 jobs judged of 64; the code as it was on main, ten kinds)
| # | kind | town | from / walk | day or night | promised (his words) | promised min | walked min | off | end | fights | road events min |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | carry | Anarchists | town / play | day | 7 H TO RAILROAD PASS, PAID THERE | 425 | 434 | +2% | paid | 0 | 20 |
| 1 | clear-camp | Anarchists | town / play | night | 1 H TO THE WRECKS, PAID THERE | 65 | 65 | 0% | paid | 1 | 0 |
| 2 | clear-crew | Anarchists | town / tap | day | UNDER 1 H, PAID THERE | 59 | 59 | 0% | gone | 1 | 0 |
| 3 | find-person | Anarchists | phone / play | night | 3 H TO ANARCHISTS, THEN 20 H, THERE AND BACK | 1355 | 257 | **-81%** | paid | 1 | 0 |
| 4 | find-place | Anarchists | town / play | day | 3 H TO THE CHURCH ON LAMB, THERE AND BACK | 161 | 177 | +10% | paid | 0 | 0 |
| 5 | haul-caravan | Anarchists | town / tap | night | 20 H TO PRIMM, PAID THERE | 1196 | 848 | **-29%** | paid | 2 | 0 |
| 7 | hunt-kind | Anarchists | phone / play | night | 3 H TO ANARCHISTS, THEN 5 H, THERE AND BACK | 457 | 274 | **-40%** | paid | 2 | 0 |
| 8 | patrol | Anarchists | town / tap | day | 4 H ROUND THE POSTS, THERE AND BACK | 258 | 242 | -6% | paid | 2 | 0 |
| 9 | recover-return | Anarchists | town / play | night | 1 H TO THE ART STORE ON CHARLESTON, THERE AND BACK | 75 | 70 | -7% | paid | 1 | 0 |
| 10 | carry | Blues | town / play | night | 11 H TO RAILROAD PASS, PAID THERE | 672 | 650 | -3% | paid | 0 | 0 |
| 11 | clear-camp | Blues | town / tap | day | 1 H TO THE DRY WASH, PAID THERE | 75 | 75 | +0% | paid | 1 | 0 |
| 12 | clear-crew | Blues | phone / play | night | 3 H TO BLUES, THEN 1 H, PAID THERE | 253 | 242 | -4% | gone | 1 | 0 |
| 13 | find-person | Blues | town / play | day | 4 H TO THE COUSIN'S FARM, THERE AND BACK | 226 | 175 | **-22%** | paid | 1 | 0 |
| 14 | find-place | Blues | town / tap | night | 3 H TO THE SOUTH ROAD, THERE AND BACK | 204 | 183 | -11% | paid | 0 | 0 |
| 15 | haul-caravan | Blues | town / play | day | 11 H TO THE SALT CAMP, PAID THERE | 654 | 551 | **-16%** | paid | 1 | 0 |
| 16 | hold-defend | Blues | phone / play | night | 3 H TO BLUES | 177-177 | 177 | +0% | paid | 2 | 0 |
| 17 | hunt-kind | Blues | town / tap | day | 5 H, THERE AND BACK | 301 | 564 | **+88%** | paid | 5 | 0 |
| 18 | patrol | Blues | town / play | night | 5 H ROUND THE POSTS, THERE AND BACK | 312 | 97 | **-69%** | stuck | 0 | 0 |
| 19 | recover-return | Blues | town / play | day | 1 H, THERE AND BACK | 65 | 102 | **+58%** | paid | 1 | 0 |
| 20 | carry | Caravans | town / tap | day | 10 H TO RAILROAD PASS, PAID THERE | 591 | 581 | -2% | paid | 0 | 0 |
| 21 | clear-camp | Caravans | phone / play | night | 4 H TO CARAVANS, THEN 14 H TO HOOVER DAM, PAID THERE | 1036 | 1009 | -3% | paid | 1 | 0 |
| 22 | clear-crew | Caravans | town / play | day | 2 H, PAID THERE | 91 | 91 | +0% | gone | 1 | 0 |
| 23 | find-person | Caravans | town / tap | night | 4 H, THERE AND BACK | 247 | 195 | **-21%** | paid | 1 | 0 |
| 24 | find-place | Caravans | town / play | day | 20 H TO TULE SPRINGS, THERE AND BACK | 1207 | 1459 | **+21%** | paid | 1 | 20 |
| 25 | haul-caravan | Caravans | phone / play | night | 3 H TO CARAVANS, THEN 4 H TO THE WASH CAMP, PAID THERE | 442 | 364 | **-18%** | paid | 1 | 0 |
| 27 | hunt-kind | Caravans | town / play | night | 4 H, THERE AND BACK | 215 | 38 | **-82%** | paid | 1 | 0 |
| 28 | patrol | Caravans | town / play | day | 4 H ROUND THE POSTS, THERE AND BACK | 226 | 81 | **-64%** | stuck | 0 | 0 |
| 30 | carry | Cartel | phone / play | night | 4 H TO CARTEL, THEN 10 H TO RAILROAD PASS, PAID THERE | 844 | 844 | +0% | paid | 0 | 0 |
| 31 | clear-camp | Cartel | town / play | day | 1 H TO THE WRECKS, PAID THERE | 70 | 70 | +0% | paid | 1 | 0 |
| 32 | clear-crew | Cartel | town / tap | night | 1 H, PAID THERE | 75 | 75 | +0% | gone | 1 | 0 |
| 33 | find-person | Cartel | town / play | day | 2 H TO THE COUSIN'S FARM, THERE AND BACK | 118 | 101 | -15% | paid | 1 | 0 |
| 34 | find-place | Cartel | phone / play | night | 3 H TO CARTEL, THEN 1 DAY TO MT CHARLESTON LODGE, THERE AND BACK | 1871 | 1871 | +0% | paid | 0 | 0 |
| 35 | haul-caravan | Cartel | town / tap | day | 4 H TO THE LOADING DOCK, PAID THERE | 215 | 215 | +0% | paid | 1 | 0 |
| 37 | hunt-kind | Cartel | town / play | day | 3 H, THERE AND BACK | 194 | 323 | **+67%** | paid | 2 | 0 |
| 38 | patrol | Cartel | phone / tap | night | 3 H TO CARTEL, THEN 8 H ROUND THE POSTS, THERE AND BACK | 688 | 602 | **-12%** | stuck | 1 | 0 |
| 39 | recover-return | Cartel | town / play | day | 4 H TO THE CANAL BOYS, THERE AND BACK | 247 | 301 | **+22%** | paid | 1 | 0 |
| 40 | carry | Church | town / play | day | 9 H TO RAILROAD PASS, PAID THERE | 564 | 548 | -3% | paid | 0 | 0 |
| 41 | clear-camp | Church | town / tap | night | UNDER 1 H TO THE DRY WASH, PAID THERE | 54 | 54 | +0% | paid | 1 | 0 |
| 42 | clear-crew | Church | town / play | day | 2 H, PAID THERE | 108 | 117 | +9% | gone | 1 | 20 |
| 43 | find-person | Church | phone / play | night | 2 H TO CHURCH, THEN 4 H, THERE AND BACK | 344 | 317 | -8% | paid | 1 | 0 |
| 44 | find-place | Church | town / tap | day | 2 H TO THE CHURCH ON LAMB, THERE AND BACK | 140 | 86 | **-38%** | paid | 1 | 0 |
| 45 | haul-caravan | Church | town / play | night | 20 H TO HOOVER DAM, PAID THERE | 1209 | 978 | **-19%** | paid | 1 | 0 |
| 47 | hunt-kind | Church | phone / tap | night | 2 H TO CHURCH, THEN 3 H, THERE AND BACK | 328 | 511 | **+56%** | paid | 2 | 0 |
| 48 | patrol | Church | town / play | day | 7 H ROUND THE POSTS, THERE AND BACK | 435 | 409 | -6% | paid | 2 | 0 |
| 49 | recover-return | Church | town / play | night | 2 H TO THEIR LOOKOUT, THERE AND BACK | 124 | 113 | -9% | paid | 1 | 0 |
| 50 | carry | Anarchists | town / play | night | 7 H TO RAILROAD PASS, PAID THERE | 425 | 435 | +3% | paid | 1 | 0 |
| 51 | clear-camp | Anarchists | town / tap | day | 1 H TO THE WRECKS, PAID THERE | 75 | 75 | 0% | paid | 1 | 0 |
| 52 | clear-crew | Anarchists | phone / play | night | 3 H TO ANARCHISTS, THEN 1 H, PAID THERE | 231 | 242 | +5% | gone | 1 | 0 |
| 53 | find-person | Anarchists | town / play | day | 4 H TO THE COUSIN'S FARM, THERE AND BACK | 253 | 247 | -2% | paid | 1 | 0 |
| 54 | find-place | Anarchists | town / tap | night | 5 H TO MT CHARLESTON LODGE, THERE AND BACK | 301 | 306 | +2% | paid | 0 | 0 |
| 55 | haul-caravan | Anarchists | town / play | day | 8 H TO THE LOADING DOCK, PAID THERE | 456 | 456 | +0% | paid | 1 | 0 |
| 56 | hold-defend | Anarchists | phone / play | night | 3 H TO ANARCHISTS | 161-161 | 161 | 0% | paid | 2 | 0 |
| 57 | hunt-kind | Anarchists | town / tap | day | 3 H, THERE AND BACK | 194 | 151 | **-22%** | paid | 2 | 0 |
| 58 | patrol | Anarchists | town / play | night | 3 H ROUND THE POSTS, THERE AND BACK | 172 | 156 | -9% | paid | 1 | 0 |
| 59 | recover-return | Anarchists | town / play | day | 3 H TO THE CANAL BOYS, THERE AND BACK | 151 | 145 | -4% | paid | 1 | 0 |
| 60 | carry | Blues | town / tap | day | 11 H TO RAILROAD PASS, PAID THERE | 672 | 650 | -3% | paid | 0 | 0 |
| 61 | clear-camp | Blues | phone / play | night | 3 H TO BLUES, THEN UNDER 1 H TO THE DRY WASH, PAID THERE | 231 | 226 | -2% | paid | 1 | 0 |
| 62 | clear-crew | Blues | town / play | day | 1 H, PAID THERE | 75 | 75 | 0% | gone | 1 | 0 |
| 63 | find-person | Blues | town / tap | night | 2 H, THERE AND BACK | 140 | 117 | **-17%** | paid | 1 | 0 |

WITHIN 15 OF 100 ONCE THE ROAD'S OWN STOPS ARE TAKEN OUT (a road card says its minutes; the words say 'if nobody stops you'): 38 of 59
WITHIN THE BAR: 38 of 59 (64%); off by more than 30 (or never ended) without saying why: 11 (#3 find-person, #7 hunt-kind, #17 hunt-kind, #18 patrol, #19 recover-return, #27 hunt-kind, #28 patrol, #37 hunt-kind, #38 patrol, #44 find-place, #47 hunt-kind)
not judged: 5 (#6 hold-defend: no time promised (you stay); #26 hold-defend: no time promised (you stay); #29 recover-return: probe fault: a town left open counted as the arrival; #36 hold-defend: no time promised (you stay); #46 hold-defend: no time promised (you stay))
by kind: carry 7/7, clear-camp 7/7, clear-crew 7/7, find-person 3/7, find-place 4/6, haul-caravan 2/6, hold-defend 2/2, hunt-kind 0/6, patrol 3/6, recover-return 3/5
from the phone: 9 of 14; the phone and the board at the yes planned the same place: 9 of 14
walked with PLAY: 27 of 40; with his taps: 11 of 19
started at night: 19 of 30; by day: 19 of 29
the held job's card halfway (what is left, his phone): within 15 of 100: 0 of 0
the yes made the job somewhere other than the promise (more than 3 blocks off its first place): 4 (#3 find-person, #21 clear-camp, #25 haul-caravan, #38 patrol)

## EVERY CAUSE (found in the before table, each checked in the code; the row numbers are the before table's)
1. **TWO ROADS.** The promise was costed on the fewest BLOCKS (cityRoute, a breadth-first search) while PLAY walks the fewest
   MINUTES (mapBestRoute: a road block is half a rough one) and a tap on the job's mark walked the blocks. Caravans in the valley
   walked with PLAY came in 16 and 18 under (rows 15, 25).
2. **A FIND WAS COSTED TO THE MIDDLE OF ITS RING**, and home from there. It turns up the moment he is two blocks from its real
   spot, which can be on the way (rows 13, 44, 63: 17 to 38 under) or four blocks past the middle; a guarded find (the people
   held, the ambush twist) starts its fight right there, at two blocks. And PLAY walked him to the middle and stood there: the
   hint ('Somewhere east of here, 3 blocks or so') was said and nothing walked it (the probe's own first run stuck there).
3. **A HUNT WAS COSTED TO ONE PACK.** The count needs as many packs as it takes (4 to 10 kills, packs of 2 to 5), so 0 of 6 hunts
   were in the bar (row 17: 'about 5 hours', 9 walked, 5 fights; row 7: 40 under). And the packs move.
4. **THE FOUND WALK HOME SLOW** (find-person: the found walk with him at the cargo's 1.3) was costed at a walk.
5. **THE PHONE PROMISED A DIFFERENT JOB** than the yes made, 5 of 15 from the phone: the dice are seeded by the day, and the walk
   to the town crossed nightfall (row 3: '3 H TO ANARCHISTS, THEN 20 H' promised; the job made at the board was under 2 hours);
   the job's place leaned on the camera ('where he can see it', mapOnGlass: the phone planned with the camera at HIS town) and on
   how many jobs he already held.
6. **OUT PAST THE VALLEY A CARAVAN WALKED AT A MAN'S PACE.** The region's real-land clock (bohemia_region.js realMins) carried the
   scout but not the cargo's pace, so the carts to PRIMM and the dam came in 29 and 19 under (rows 5, 45).
7. **A PATROL POST AT A TOWN COUNTED ONLY ON THE EIGHT BLOCKS ROUND THE TOWN'S ONE GATE.** PLAY walks to the town's nearest side
   (any side is its door), so 3 of 6 patrols never finished (rows 18, 28, 38: stuck).
8. **THE PHONE'S CARD FOR A JOB HE HOLDS** re-planned the job from its start on every paint ('20H THERE+BACK' halfway home), and once
   the work was done (going home to be paid) it fell to a range the job had nothing to do with ('1 H TO 6 H 30').
9. **THE WORDS ROUNDED TOO HARD.** 'about 2 hours' for 96 minutes (20 off before a single block was walked), '1 DAY' for 31 hours, the
   phone's card '2D' for 37 hours; three places said the time, each with its own rounding (the offer, the board's row, the phone).
10. **THE ROAD'S OWN STOPS**, which cannot be known before the yes: the old road director's forced moment eats 20 minutes (3 of 60
    jobs, 0.3 of every 100 minutes walked, but +20 on a short job: ap07 replay row 0), PLAY walks round a party it can see (+22 on
    one ap07 replay), and CONTENT's new road events (landed while this ran: one about every 39 blocks, 22 walked and then 6 in 100
    a block; 17 of their 72 answers cost 20 to 60 minutes, each said on its card).
11. **'THEY MOVED IT'** (found by the after run, the first browser's row 27, recover-return: 2 hours 20 promised, 3 hours 40 walked). One recover job in six has
    the R1 twist: at the spot it is gone and fresh tracks lead 2 to 4 blocks on; the promise stopped at the first spot, and the new
    spot leaned on the camera. NOW the new spot comes from the job's own dice on the glass round the old spot, and the promise walks
    that leg too (re-measured below: 20 recover jobs, 2 with the twist, 19 in the bar, the twentieth a road stop).
**SUSPECTS CHECKED AND CLEARED:** the walk to a town from the phone (the town's own tap, townDoorWalk) is exactly what the phone
said, 15 of 15; a fight costs no map minutes (61 fights); night does not slow a block and no camp is forced (before: night 20 of 31
in the bar, day 19 of 29; the same causes by day and by night); nothing else spent the clock but the step and the road (the
probe's per-caller count). Bosses' places: no screen promises a time to a boss (the rumour names the place, the sign shows it), so
there is nothing there to be wrong; a boss trip, when one is said, should call BohemiaJobKinds.walkRoute.

## WHAT SHIPPED (one code: the promise IS the walk)
- **slices/bohemia_job_kinds.js** (WORLD): `walkRoute()`, THE ONE ROAD: PLAY's own fewest-minutes road in the valley
  (mapBestRoute, its danger included, as PLAY would walk it now), the town's own tap out past the valley (townDoorWalk) and the
  region's road (cityRoute), every block costed by the map's own clock (cityStepMins, so WORLD 3's slow mountains flow in).
  `walkOf()` walks the job the way the game walks it, kind by kind: a find to its ring and on the hint's way, found on the first
  block in sight (seen_at); a hunt nearest pack first until the count is met (a range, 'the packs move', the spread in the data
  file); a patrol post by post; a recover job on to where they moved it; CONTENT's legs place by place with the clock's own waits ('wait', 'dark' worked out for the hour he
  gets there); home at the pace he walks home. A tap on the job's mark walks the same road (`walkGo()`; a post or delivery at a
  town goes to its nearest side); PLAY walks on to the hint once it is said (nextOf); a post at a town counts from any side of it.
  The phone plans for the day he will be at the board (`dayAfter`), on the town's own glass (`onGlass` centred on the client while a
  job is made), and the map's target for a job is kept from its first plan (`PLAN_TG`), so the phone, the board and the yes are one
  job. A job he holds says the time LEFT from where he stands ('Left to walk', 'home to ANARCHISTS to be paid'). One rounding
  (`timeWords`, `shortTime`): minutes under an hour, hours and minutes under ten, hours under a day, days and hours under three,
  half days after. The long words end 'if nobody stops you' (the road's stops), a hunt's range says 'the packs move', a leg's
  wait says itself ('2 hours of it waiting for dark').
- **slices/bohemia_region.js** (WORLD, one line): the cargo's pace out past the valley too.
- **slices/BOHEMIA_SETTLEMENT_SCREEN.html** (WORLD's own line in the board's row) and **slices/bohemia_phone.js** (the job card's
  time word, one line, UI TWO's look untouched): the job file's one rounding.
- **records/target/BOHEMIA_JOB_KINDS.json**: `timing.hunt_spread` [0.75, 1.3], draft:true, his to change.
- **tools/bohemia_world_job_time_probe.js**: the probe and its table (kept, rerunnable).
- **Gates**: the_trip_before_the_yes (T1 the new words, T4 the job's mark walks the one road, T6 the one rounding),
  a_jobs_time_counts_the_way_back (B1 recounted on PLAY's road and a leg's wait, B5 walked on it), the_normie_hour_world (N5: a
  range is its high end; a walk across nightfall is the next day's job).

## MEASURED AFTER (the same probe on the shipped code, rebased on main: nineteen kinds, five towns, the road's events quiet as for any scripted browser, their stops counted from their data in cause 10; two browsers at once, each numbering its own jobs from 0)
| # | kind | town | from / walk | day or night | promised (his words) | promised min | walked min | off | end | fights | road events min |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | ambush | Anarchists | town / play | day | 2 H 50 TO THE CUT, THERE AND BACK | 165 | 165 | +0% | paid | 1 | 0 |
| 1 | bounty | Anarchists | town / tap | day | 10 H TO CHUY LENTO, THERE AND BACK | 614 | 635 | +3% | paid | 1 | 20 |
| 2 | carry | Anarchists | town / play | day | 5 H 40 TO RAILROAD PASS, PAID THERE | 344 | 344 | 0% | paid | 0 | 0 |
| 3 | clear-crew | Anarchists | town / play | day | 1 H 40, PAID THERE | 97 | 97 | +0% | gone | 1 | 0 |
| 4 | envoy | Anarchists | town / tap | day | 5 H 50 TO THE MEN WHO WANT HIM, PAID THERE | 345 | 345 | +0% | paid | 1 | 0 |
| 5 | find-place | Anarchists | town / play | day | 21 H TO TULE SPRINGS, THERE AND BACK | 1236 | 1236 | +0% | paid | 0 | 0 |
| 6 | haul-caravan | Anarchists | town / play | day | 20 H TO PRIMM, PAID THERE | 1187 | 1187 | 0% | paid | 2 | 0 |
| 7 | hunt-kind | Anarchists | town / tap | day | 1 H 20 TO 2 H 20, THERE AND BACK | 81-140 | 65 | **-20%** | paid | 1 | 0 |
| 8 | recover-return | Anarchists | town / play | day | 3 H 10 TO THE PARKING STRUCTURE, THERE AND BACK | 194 | 194 | +0% | paid | 1 | 0 |
| 9 | signal | Anarchists | town / play | day | 5 H 50 TO THE FIRST MAST, THERE AND BACK | 354 | 354 | 0% | paid | 0 | 0 |
| 10 | big-game | Blues | town / tap | day | 5 H TO THE OLD LION, THERE AND BACK | 301 | 280 | -7% | paid | 1 | 0 |
| 11 | burn | Blues | town / play | day | 3 H 50 TO THE TIRE YARD, THERE AND BACK | 226 | 226 | +0% | paid | 1 | 0 |
| 12 | clear-camp | Blues | town / play | day | 15 H TO HOOVER DAM, PAID THERE | 886 | 886 | +0% | paid | 1 | 0 |
| 13 | collect | Blues | town / tap | day | 3 H TO DON BETO, THERE AND BACK | 183 | 161 | -12% | paid | 1 | 0 |
| 14 | find-person | Blues | town / play | day | 5 H 20 TO THE COUSIN'S FARM, THERE AND BACK | 320 | 320 | +0% | paid | 1 | 0 |
| 15 | free | Blues | town / play | day | 3 H 50 TO THE PEN, THERE AND BACK | 231 | 231 | +0% | paid | 1 | 0 |
| 17 | patrol | Blues | town / play | day | 4 H ROUND THE POSTS, THERE AND BACK | 242 | 242 | +0% | paid | 1 | 0 |
| 18 | scout | Blues | town / play | day | 2 H 10 TO THE FIRST WELL, THERE AND BACK | 129 | 129 | +0% | paid | 0 | 0 |
| 19 | ambush | Caravans | town / tap | day | 4 H TO THE CUT, THERE AND BACK | 241 | 246 | +2% | paid | 1 | 0 |
| 20 | bounty | Caravans | town / play | day | 9 H 40 TO CHUY LENTO, THERE AND BACK | 579 | 579 | 0% | paid | 1 | 0 |
| 21 | carry | Caravans | town / play | day | 7 H 50 TO RAILROAD PASS, PAID THERE | 471 | 471 | +0% | paid | 1 | 0 |
| 22 | clear-crew | Caravans | town / tap | day | 50 MIN, PAID THERE | 48 | 48 | +0% | gone | 1 | 0 |
| 23 | envoy | Caravans | town / play | day | 1 H 40 TO CUSTOM, PAID THERE | 97 | 97 | +0% | paid | 0 | 0 |
| 24 | find-place | Caravans | town / play | day | 4 H 10 TO THE CHURCH ON LAMB, THERE AND BACK | 247 | 247 | +0% | paid | 1 | 0 |
| 25 | haul-caravan | Caravans | town / tap | day | 2 H 30 TO THE WASH CAMP, PAID THERE | 155 | 155 | +0% | paid | 2 | 0 |
| 26 | hunt-kind | Caravans | town / play | day | 2 H TO 3 H 20, THERE AND BACK | 117-203 | 156 | +0% | paid | 2 | 0 |
| 27 | recover-return | Caravans | town / play | day | 2 H 20 TO THE BASEMENT AT SUNRISE, THERE AND BACK | 140 | 220 | **+58%** | paid | 1 | 0 |
| 28 | signal | Caravans | town / tap | day | 10 H TO THE FIRST MAST, THERE AND BACK | 604 | 604 | 0% | paid | 0 | 0 |
| 29 | big-game | Cartel | town / play | day | 2 H 20 TO THE OLD LION, THERE AND BACK | 140 | 140 | +0% | paid | 1 | 0 |
| 30 | burn | Cartel | town / play | day | 2 H 40 TO THE TIRE YARD, THERE AND BACK | 161 | 161 | +0% | paid | 1 | 0 |
| 31 | clear-camp | Cartel | town / tap | day | 1 H 50 TO THE DRY WASH, PAID THERE | 113 | 113 | +0% | paid | 1 | 0 |
| 32 | collect | Cartel | town / play | day | 2 H 40 TO DON BETO, THERE AND BACK | 161 | 161 | +0% | paid | 1 | 0 |
| 33 | find-person | Cartel | town / play | day | 2 H 10 TO THE COUSIN'S FARM, THERE AND BACK | 134 | 134 | +0% | paid | 1 | 0 |
| 34 | free | Cartel | town / tap | day | 2 H 20 TO THE PEN, THERE AND BACK | 140 | 140 | +0% | paid | 1 | 0 |
| 36 | patrol | Cartel | town / play | day | 6 H 30 ROUND THE POSTS, THERE AND BACK | 392 | 392 | +0% | paid | 1 | 0 |
| 37 | scout | Cartel | town / tap | day | 5 H 30 TO THE FIRST WELL, THERE AND BACK | 333 | 333 | +0% | paid | 0 | 0 |
| 38 | ambush | Church | town / play | day | 4 H 40 TO THE CUT, THERE AND BACK | 284 | 284 | +0% | paid | 1 | 0 |
| 39 | bounty | Church | town / play | day | 4 H 20 TO CHUY LENTO, THERE AND BACK | 257 | 257 | +0% | paid | 1 | 0 |
| 40 | carry | Church | town / tap | day | 8 H 50 TO RAILROAD PASS, PAID THERE | 527 | 527 | +0% | paid | 0 | 0 |
| 41 | clear-crew | Church | town / play | day | 2 H 10, PAID THERE | 134 | 134 | +0% | gone | 1 | 0 |
| 42 | envoy | Church | town / play | day | 1 H 50 TO COLORFUL, PAID THERE | 108 | 108 | +0% | paid | 0 | 0 |
| 43 | find-place | Church | town / tap | day | 13 H TO TULE SPRINGS, THERE AND BACK | 780 | 864 | +11% | paid | 0 | 20 |
| 44 | haul-caravan | Church | town / play | day | 21 H TO HOOVER DAM, PAID THERE | 1271 | 1242 | -2% | paid | 1 | 0 |
| 45 | hunt-kind | Church | town / play | day | 5 H 50 TO 10 H, THERE AND BACK | 353-612 | 667 | +9% | paid | 5 | 0 |
| 46 | recover-return | Church | town / tap | day | 1 H 30 TO THE ART STORE ON CHARLESTON, THERE AND BACK | 86 | 86 | +0% | paid | 1 | 0 |
| 47 | signal | Church | town / play | day | 5 H 50 TO THE FIRST MAST, THERE AND BACK | 355 | 355 | +0% | paid | 0 | 0 |
| 0 | big-game | Anarchists | town / play | night | 6 H TO THE OLD LION, THERE AND BACK | 358 | 378 | +6% | paid | 1 | 20 |
| 1 | burn | Anarchists | phone / play | night | 2 H 50 TO ANARCHISTS, THEN 1 H 40 TO THE TIRE YARD, THERE AND BACK | 269 | 269 | +0% | paid | 1 | 0 |
| 2 | clear-camp | Anarchists | town / tap | night | 40 MIN TO THE DRY WASH, PAID THERE | 38 | 38 | +0% | paid | 1 | 0 |
| 3 | collect | Anarchists | phone / play | night | 2 H 50 TO ANARCHISTS, THEN 1 H 20 TO DON BETO, THERE AND BACK | 247 | 247 | +0% | paid | 1 | 0 |
| 4 | find-person | Anarchists | town / play | night | 4 H 20, THERE AND BACK | 260 | 260 | +0% | paid | 1 | 0 |
| 5 | free | Anarchists | phone / tap | night | 2 H 50 TO ANARCHISTS, THEN 1 H 50 TO THE PEN, THERE AND BACK | 285 | 301 | +6% | paid | 1 | 0 |
| 7 | patrol | Anarchists | phone / play | night | 2 H 50 TO ANARCHISTS, THEN 5 H 20 ROUND THE POSTS, THERE AND BACK | 495 | 495 | +0% | paid | 1 | 0 |
| 8 | scout | Anarchists | town / tap | night | 3 H 40 TO THE FIRST WELL, THERE AND BACK | 220 | 231 | +5% | paid | 0 | 0 |
| 9 | ambush | Blues | town / play | night | 2 H 50 TO THE CUT, THERE AND BACK | 171 | 171 | +0% | paid | 1 | 0 |
| 10 | bounty | Blues | phone / play | night | 2 H 50 TO BLUES, THEN 14 H TO CHUY LENTO, THERE AND BACK | 1041 | 1041 | +0% | paid | 1 | 0 |
| 11 | carry | Blues | town / tap | night | 10 H TO RAILROAD PASS, PAID THERE | 629 | 629 | +0% | paid | 0 | 0 |
| 12 | clear-crew | Blues | phone / play | night | 3 H TO BLUES, THEN 1 H, PAID THERE | 247 | 247 | +0% | gone | 1 | 0 |
| 13 | envoy | Blues | town / play | night | 2 H TO THE MEN WHO WANT HIM, PAID THERE | 118 | 118 | +0% | paid | 1 | 0 |
| 14 | find-place | Blues | phone / tap | night | 2 H 50 TO BLUES, THEN 22 H TO MT CHARLESTON LODGE, THERE AND BACK | 1473 | 1672 | +14% | paid | 0 | 0 |
| 15 | haul-caravan | Blues | town / play | night | 5 H 50 TO THE SALT CAMP, PAID THERE | 353 | 353 | 0% | paid | 1 | 0 |
| 16 | hunt-kind | Blues | phone / play | night | 2 H 50 TO BLUES, THEN 1 H 10 TO 2 H 10, THERE AND BACK | 245-298 | 220 | -10% | paid | 2 | 0 |
| 17 | recover-return | Blues | town / tap | night | 2 H 40 TO BLOCK SEVEN, THERE AND BACK | 156 | 156 | +0% | paid | 0 | 0 |
| 18 | signal | Blues | phone / play | night | 2 H 50 TO BLUES, THEN 2 H 10 TO THE FIRST MAST, THERE AND BACK | 306 | 306 | +0% | paid | 0 | 0 |
| 19 | big-game | Caravans | phone / play | night | 3 H 30 TO CARAVANS, THEN 3 H TO THE OLD LION, THERE AND BACK | 392 | 392 | +0% | paid | 1 | 0 |
| 20 | burn | Caravans | town / tap | night | 1 H 30 TO THE TIRE YARD, THERE AND BACK | 91 | 91 | +0% | paid | 1 | 0 |
| 21 | clear-camp | Caravans | phone / play | night | 3 H 30 TO CARAVANS, THEN 1 H TO THE WRECKS, PAID THERE | 274 | 274 | +0% | paid | 1 | 0 |
| 22 | collect | Caravans | town / play | night | 50 MIN TO DON BETO, THERE AND BACK | 54 | 54 | +0% | paid | 1 | 0 |
| 23 | find-person | Caravans | phone / tap | night | 3 H 30 TO CARAVANS, THEN 2 H 40, THERE AND BACK | 373 | 373 | +0% | paid | 1 | 0 |
| 24 | free | Caravans | town / play | night | 2 H 30 TO THE PEN, THERE AND BACK | 145 | 145 | +0% | paid | 1 | 0 |
| 25 | hold-defend | Caravans | phone / play | night | 3 H 30 TO CARAVANS | 210 | 210 | +0% | paid | 2 | 0 |
| 26 | patrol | Caravans | town / tap | night | 2 H 50 ROUND THE POSTS, THERE AND BACK | 172 | 161 | -6% | paid | 1 | 0 |
| 27 | scout | Caravans | phone / play | night | 3 H 30 TO CARAVANS, THEN 3 H TO THE FIRST WELL, THERE AND BACK | 392 | 392 | +0% | paid | 0 | 0 |
| 28 | ambush | Cartel | phone / play | night | 3 H 50 TO CARTEL, THEN 5 H 30 TO THE CUT, THERE AND BACK | 558 | 583 | +5% | paid | 1 | 20 |
| 29 | bounty | Cartel | town / tap | night | 4 H TO CHUY LENTO, THERE AND BACK | 242 | 242 | +0% | paid | 1 | 0 |
| 30 | carry | Cartel | phone / play | night | 3 H 20 TO CARTEL, THEN 8 H 30 TO RAILROAD PASS, PAID THERE | 713 | 713 | +0% | paid | 0 | 0 |
| 31 | clear-crew | Cartel | town / play | night | 1 H 50, PAID THERE | 113 | 113 | +0% | gone | 1 | 0 |
| 32 | envoy | Cartel | phone / tap | night | 3 H 20 TO CARTEL, THEN 3 H TO TRADES, PAID THERE | 387 | 382 | -1% | paid | 0 | 0 |
| 33 | find-place | Cartel | town / play | night | 1 H 30 TO THE SOUTH ROAD, THERE AND BACK | 91 | 102 | +12% | paid | 0 | 0 |
| 34 | haul-caravan | Cartel | phone / play | night | 3 H 20 TO CARTEL, THEN 2 H 50 TO THE LOADING DOCK, PAID THERE | 376 | 376 | +0% | paid | 1 | 0 |
| 35 | hunt-kind | Cartel | town / tap | night | 3 H 10 TO 5 H 40, THERE AND BACK | 194-335 | 199 | +0% | paid | 2 | 0 |
| 36 | recover-return | Cartel | phone / play | night | 3 H 20 TO CARTEL, THEN 1 H 50 TO THE WHITE LIMO ON KOVAL, THERE AND BACK | 317 | 317 | +0% | paid | 0 | 0 |
| 37 | signal | Cartel | town / play | night | 2 H 10 TO THE FIRST MAST, THERE AND BACK | 129 | 129 | +0% | paid | 0 | 0 |
| 38 | big-game | Church | town / tap | night | 3 H 10 TO THE OLD LION, THERE AND BACK | 194 | 194 | +0% | paid | 1 | 0 |
| 39 | burn | Church | phone / play | night | 2 H TO CHURCH, THEN 3 H 50 TO THE TIRE YARD, THERE AND BACK | 344 | 344 | +0% | paid | 1 | 0 |
| 40 | clear-camp | Church | town / play | night | 12 H TO HOOVER DAM, PAID THERE | 740 | 740 | +0% | paid | 1 | 0 |
| 41 | collect | Church | phone / tap | night | 2 H TO CHURCH, THEN 50 MIN TO DON BETO, THERE AND BACK | 167 | 167 | +0% | paid | 1 | 0 |
| 42 | find-person | Church | town / play | night | 4 H 20, THERE AND BACK | 258 | 258 | +0% | paid | 1 | 0 |
| 43 | free | Church | phone / play | night | 2 H TO CHURCH, THEN 3 H 40 TO THE PEN, THERE AND BACK | 333 | 333 | +0% | paid | 1 | 0 |
| 45 | patrol | Church | phone / play | night | 2 H TO CHURCH, THEN 4 H 40 ROUND THE POSTS, THERE AND BACK | 403 | 403 | +0% | paid | 1 | 0 |
| 46 | scout | Church | town / play | night | 5 H 50 TO THE FIRST WELL, THERE AND BACK | 355 | 355 | +0% | paid | 0 | 0 |

WITHIN 15 OF 100 ONCE THE ROAD'S OWN STOPS ARE TAKEN OUT (a road card says its minutes; the words say 'if nobody stops you'): 89 of 91
WITHIN THE BAR: 89 of 91 (98%); off by more than 30 (or never ended) without saying why: 1 (#27 recover-return)
not judged: 4 (#16 hold-defend: no time promised (you stay); #35 hold-defend: no time promised (you stay); #6 hold-defend: no time promised (you stay); #44 hold-defend: no time promised (you stay))
by kind: ambush 5/5, big-game 5/5, bounty 5/5, burn 5/5, carry 5/5, clear-camp 5/5, clear-crew 5/5, collect 5/5, envoy 5/5, find-person 5/5, find-place 5/5, free 5/5, haul-caravan 5/5, hold-defend 1/1, hunt-kind 4/5, patrol 5/5, recover-return 4/5, scout 5/5, signal 5/5
from the phone: 23 of 23; the phone and the board at the yes planned the same place: 23 of 23
walked with PLAY: 61 of 62; with his taps: 28 of 29
started at night: 45 of 45; by day: 44 of 46
the held job's card halfway (what is left, his phone): within 15 of 100: 66 of 81 (worst +200%)
the yes made the job somewhere other than the promise (more than 3 blocks off its first place): 0

## RE-MEASURED AFTER THE LAST FIX (cause 11): every recover job, five towns, 20 jobs
| # | kind | town | from / walk | day or night | promised (his words) | promised min | walked min | off | end | fights | road events min |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | recover-return | Anarchists | town / play | day | 3 H 20 TO THE PUMP STATION, THERE AND BACK | 204 | 204 | +0% | paid | 1 | 0 |
| 1 | recover-return | Blues | town / play | night | 1 H 50 TO THE CANAL BOYS, THERE AND BACK | 113 | 133 | **+18%** | paid | 1 | 20 |
| 2 | recover-return | Caravans | town / tap | day | 2 H 40 TO THEIR LOOKOUT, THERE AND BACK | 161 | 161 | +0% | paid | 1 | 0 |
| 3 | recover-return | Cartel | phone / play | night | 3 H 50 TO CARTEL, THEN 3 H 50 TO THE DEALER, THERE AND BACK | 457 | 435 | -5% | paid | 1 | 0 |
| 4 | recover-return | Church | town / play | day | 1 H 30 TO THE NURSERY ON RAINBOW, THERE AND BACK | 91 | 91 | +0% | paid | 1 | 0 |
| 5 | recover-return | Anarchists | town / play | night | 3 H 50 TO THE DEALER, THERE AND BACK | 226 | 226 | +0% | paid | 1 | 0 |
| 6 | recover-return | Blues | town / tap | day | 2 H 20 TO THE NURSERY ON RAINBOW, THERE AND BACK | 140 | 140 | +0% | paid | 1 | 0 |
| 7 | recover-return | Caravans | phone / play | night | 3 H 30 TO CARAVANS, THEN 2 H 40 TO THE PARKING STRUCTURE, THERE AND BACK | 366 | 366 | +0% | paid | 1 | 0 |
| 8 | recover-return | Cartel | town / play | day | 4 H TO BLOCK SEVEN, THERE AND BACK | 237 | 237 | +0% | paid | 0 | 0 |
| 9 | recover-return | Church | town / tap | night | 2 H 40 TO THE BASEMENT AT SUNRISE, THERE AND BACK | 161 | 161 | +0% | paid | 1 | 0 |
| 10 | recover-return | Anarchists | town / tap | day | 3 H 50 TO BLOCK SEVEN, THERE AND BACK | 231 | 210 | -9% | paid | 0 | 0 |
| 11 | recover-return | Blues | phone / play | night | 3 H TO BLUES, THEN 2 H 10 TO THE BASEMENT AT SUNRISE, THERE AND BACK | 317 | 317 | +0% | paid | 1 | 0 |
| 12 | recover-return | Caravans | town / play | day | 2 H 30 TO THE WHITE LIMO ON KOVAL, THERE AND BACK | 145 | 145 | +0% | paid | 0 | 0 |
| 13 | recover-return | Cartel | town / tap | night | 2 H 10 TO THE ART STORE ON CHARLESTON, THERE AND BACK | 129 | 129 | +0% | paid | 1 | 0 |
| 14 | recover-return | Church | town / play | day | 4 H 20, THERE AND BACK | 258 | 258 | +0% | paid | 1 | 0 |
| 15 | recover-return | Anarchists | phone / play | night | 2 H 50 TO ANARCHISTS, THEN 2 H TO THE ART STORE ON CHARLESTON, THERE AND BACK | 290 | 290 | +0% | paid | 1 | 0 |
| 16 | recover-return | Blues | town / play | day | 1 H 50, THERE AND BACK | 113 | 113 | +0% | paid | 1 | 0 |
| 17 | recover-return | Caravans | town / tap | night | 3 H 40 TO THE PUMP STATION, THERE AND BACK | 215 | 215 | +0% | paid | 1 | 0 |
| 18 | recover-return | Cartel | town / play | day | 3 H 40 TO THE CANAL BOYS, THERE AND BACK | 215 | 215 | +0% | paid | 1 | 0 |
| 19 | recover-return | Church | phone / play | night | 2 H TO CHURCH, THEN 3 H 50 TO THEIR LOOKOUT, THERE AND BACK | 344 | 344 | +0% | paid | 1 | 0 |

WITHIN 15 OF 100 ONCE THE ROAD'S OWN STOPS ARE TAKEN OUT (a road card says its minutes; the words say 'if nobody stops you'): 20 of 20
WITHIN THE BAR: 19 of 20 (95%); off by more than 30 (or never ended) without saying why: 0
not judged: 0
by kind: recover-return 19/20
from the phone: 5 of 5; the phone and the board at the yes planned the same place: 5 of 5
walked with PLAY: 13 of 14; with his taps: 6 of 6
started at night: 9 of 10; by day: 10 of 10
the held job's card halfway (what is left, his phone): within 15 of 100: 18 of 20 (worst +30%)
the yes made the job somewhere other than the promise (more than 3 blocks off its first place): 0

## THE NUMBERS IN ONE PLACE
- BEFORE: 39 of 60 in the bar (65 of 100); 11 off by more than 30 or never finished; hunts 0 of 6, caravans 2 of 6, patrols 3 of 6
  (three never finished); the phone planned the job the yes made 10 of 15; the held job's card had no idea where he was.
- AFTER (95 jobs, nineteen kinds): 89 of 91 in the bar (98 of 100); one off by more than 30 with no reason said (the first browser's row 27, recover-return: the twist
  in cause 11, fixed and re-measured: 20 of 20 recover jobs within 15 once a 20-minute road stop is taken out); every kind 5 of 5
  but hunt 4 of 5 (in its range's reason: the packs move) and recover; the phone and the yes one job 23 of 23; the held job's card
  halfway (what is left, his phone) within 15 of 100 for 66 of 81 (its misses are the hunts' packs and a road stop; in the first
  after-run, before the fix for the walk home, it was 8 of 24).
- CHECKS: the_trip_before_the_yes 7 of 7 (T6 was red on main before this round too: the checker's hand missed the phone's card;
  the card is now pressed when the hand misses), a_jobs_time_counts_the_way_back, the_normie_hour_world 8 of 8 (N5: the phone
  and the board now say the same minute), every_job_kind, play_takes_you_there: see the commit.

(A first after-run on the code before the last two fixes, 60 jobs, ten kinds: 54 of 60 in the bar. It found the guarded find's
fight at two blocks, not one, and the held job's card falling to a range on the way home; both fixed before the run above.)

## WHAT IS LEFT
- **The road's own stops cannot be known before the yes.** The words say it ('if nobody stops you'); a road card says its own
  minutes before he picks ('Lift the truck. One hour.'); the held job's card says the time LEFT from where he stands, so after a
  stop the phone is true again. CONTENT's road events average about 3 of every 100 minutes walked but land all at once (20 to 60).
- **A town tapped by hand walks the fewest blocks** (RUN's townDoorWalk, gate any_side_of_a_town_is_its_door S3 holds it to
  that), while PLAY and the promise walk the fewest minutes. The walk home by a hand's tap on the town can be a little longer than
  promised (in the tables above the tap walks are in the bar). RUN's call whether the town's tap walks the minutes too: if it
  does, walkRoute already is that road.
- **PLAY walks round a party it can see** (RUN's danger, mapRouteDanger): the promise counts the danger standing NOW; a party that
  moves onto the road later can stretch a walk (one ap07 replay +22; one walk in the first after-run, 23 hours for a 3 hour 40
  promise, whose time-left card mid-walk was exact: the road PLAY chose had become that long). Not reproduced in 8 replays.
- **hold-defend** promises no time (the job is the town); its waves are fights, which cost no map time.
- The bosses' places promise no time; when a boss's sign says a trip, it should be BohemiaJobKinds.walkRoute's.
- EYES: walk five jobs on the phone, read the offer, the board's row and the phone's card against the bar's clock.

## [bb]
Battle Brothers puts the contract's target on the map and the days to it before you sign, and its days are the party's own
march over the same ground it will walk. Ours now says the hours from the same road the walk takes, the waits the job will make,
and home: the one number a contract is signed on.

## [analog horror]
The time on the card is the one thing in the valley that does not lie: a hunt says a range because the packs move, a find says
it turns up where the hint points, and 'if nobody stops you' sits under every promise like a line on an old tape that nobody
recorded on purpose.
