# JOBS 2 -- RULE 480 ON THE JOBS AS BUILT, AND THE JOBS' FRAMES ON A SLOWED PHONE, 11/26/26

VAMILY rule 480 (Paolo 11/26: 'Lets turn up full sweep. But improve on what we already have. And make sure fps is never choppy for
nothing'); the coordinator's routine 'JOBS 2: rule 480'. Ask row 723. No build: nothing in the game changed this round; a tool, this
record and the routing.

## 480(b): THE JOBS AS BUILT, CHECKED (what is already in the game, no new piece)
- EVERY JOB FITS WHO TAKES IT: JOBS THAT FIT THE COMPANY (11/10d) and A HUNT FITS THE CREW (11/20l) stand in the suite; nothing in the
  job math moved since; not re-walked this round (rule 441(d): no lane re-measures what was proved).
- EVERY JOB FIGHT MATCHES ITS CARD: THE CARD READS THE NIGHT R5 (37 of 37 fights the card's on four phones, 11/21z) stands; nothing moved.
- FOLLOWERS EVERYWHERE (470(b)): swept every slices/ file a player meets for a string that says CLOUT: none left on a jobs screen (the
  bar, the FEED's profile, the board's line, the card, the camp's line, a leg's put-down line all read the count's word, FOLLOWERS;
  gate CLOUT IS FOLLOWERS). Two old quest-layer texts carry 'CLOUT:' tags (the .bq machine layer, BOHEMIA_CITY_WORLD.html's DEMO_BQ and
  the old BOHEMIA_CURRENT_SLICE.html), never drawn as a word.
- NEVER 'IT PAYS' (470(g)): EIGHT CLIENT LINES STILL SAY IT, AND THEY STAY until he says his homework is done (rule 465: no person's line
  is rewritten before). records/target/BOHEMIA_JOB_KINDS.json board_people 'says' with 'and it pays {pay} batteries' (the pump posts on
  the dam road, the convoy at the cut, Chuy Lento's red ring, the three wells, the tire yard, the lab lion on the eighteenth hole, the
  woman's voice on every radio, the dog pen): ROUTED to WORDS THREE (470(g)'s owner) for the day 465 lifts.
- A COMEBACK HAS ITS DAY LIMIT (470(h)): no job brings anyone back; the one comeback named (row 708, the man who goes home on road
  card 3.4) is WORLD 15's.
- NO WAYPOINT ARROWS (473): gate NO WAYPOINTS (0 at the edge, four phones); WORLD 15's boss edge names gone too (11/22zq).
- AND THIS SESSION'S OTHER FINISHES: the board on a sideways phone under half the glass (11/22zs), every foe a job names reads right
  on the end screen (11/22zu), two false reds in THE JOBS' PART answered.

## 480(c): THE JOBS' FRAMES ON A SLOWED PHONE (390 x 844, CPU four times slower, the canvas drawn by the GPU process)
tools/bohemia_jobs_frames_on_a_slow_phone.js (new; --profile gives each step's CPU by script and every canvas call by its caller), the
demo, a new crew, Caravans, with a finger. Three runs agree in shape:

  the map, still                 35 to 52 fps   worst 133 to 1450 ms
  the town opens                  4 to 7 fps    worst 417 to 1383 ms
  the town, still                 5.5 fps       worst 966 to 1100 ms
  the board opens / still         4 to 6 fps    worst 967 to 1467 ms
  a job's card / Take it          4 to 7 fps    worst 350 to 1133 ms
  back to the map                 3 to 8.5 fps  worst 1033 to 1533 ms
  the map holds, the job marked  18 to 28 fps   worst 383 to 1150 ms
  the trip and the arrival        2.5 to 3 fps  (it ends in a fight's load)

EVERY JOB STEP IS RED BY RULE 480(d), AND THE JOBS' OWN CODE IS NOT WHAT HOLDS THE FRAMES. Per step, the jobs' scripts take tens of ms
(the danger reader's crewSig 12 to 16 ms, the shelf 23 ms, the phone's fitStrip 14 to 23 ms) of 3,000 to 6,000 ms of busy thread.
What holds them, by caller (the profile's own attribution, a 3-second step):
1. THE TOWN'S PICTURE, every frame: slices/BOHEMIA_SETTLEMENT_SCREEN.html draw() (lines near 4022, 4037, 3433, 3682) canvas fill 300 to
   1,007 ms a step and a restore up to 129 ms; the town screen itself runs at 5 fps on this phone with nothing pressed, so the board,
   the card and Take it inherit it. RUN TWO's screen (COOK FOUR's pictures): the biggest hitch on every job step.
2. THE IDLE SHEETS' WARM-UP: engine/bohemia_idles.js warmOne() getImageData 150 to 851 ms a step (already a CPU canvas,
   willReadFrequently: the cost is the sheet's own unpacking, 26 to 57 ms each at full speed, so over 50 ms each at 4x). PLUMBER 7's
   design; at 4x each sheet is a hitch.
3. slices/bohemia_ui_nothing_pops.js shownNow() checkVisibility 72 to 254 ms a step (layout forced each frame). UI's.
4. On the map: BOHEMIA_CITY_WORLD.html mapGroundBlit drawImage 510 ms, fzPaint 431 ms, vbCityDraw restore 409 to 477 ms, the (anon) fill
   near 49738 608 ms; bohemia_wear.js sheetMask getImageData 84 to 264 ms. RUN's and WORLD's.
THE JOBS' MARKS COST NO MEASURABLE FRAMES: one boot, the map still, 2 jobs and 14 side places held against none, three rounds of 5 s
each way: 26.8 / 59.4 / 46.0 fps with them, 58.8 / 23.3 / 56.8 without; the swing is the map's own background, not the jobs.

ROUTED (rule 480: PLUMBER 8 the walk and its fixes, biggest hitch first; each lane its own screens): PLUMBER 8 (this table and the
tool; items 1 to 4 in that order), RUN TWO and COOK FOUR (item 1), UI (item 3), RUN and WORLD 15 (item 4). The tool runs any time:
node tools/bohemia_jobs_frames_on_a_slow_phone.js [--profile] [--alpha].

[bb Battle Brothers' contract screen is a still panel over a still town; nothing on it moves unless you touch it]
[analog horror: the town holds still at five frames a second, like a tape the deck is struggling to read]
