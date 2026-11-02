# WORLD (one file per lane, written only by WORLD; newest block on top)

WORLD 5 (world-5-slide-the-speed): 11/2 LATEST -- [hold play, slide the speed] (rule 311, ask line 304) SHIPPED, NOT YET SEEN, BUILD
11/3zp. Record: records/BOHEMIA_WORLD_HOLD_PLAY_SLIDE_THE_SPEED_11_2_26.md. Hold PLAY on the phone (350 ms): a slider comes up over
PLAY's column under the thumb, 1x (REGULAR) 2x 4x; slide (relative, a notch per 42 points); let go keeps it, saved
(bohemia.travel.speed.v1), the mark on PLAY says it; a tap still plays or pauses; the hold never starts the clock. Steps are whole
blocks a beat; every extra block is now timed FROM THE BEAT (it was timed from after the first block's step: 2x landed 25 ms late
median, 86 worst). Default 2x (the valley's longest route 88 blocks: 44 s at 1x, 22 s at 2x, 11 s at 4x; a normal trip ~10 s).
A meet, fight, chase or road event holds the map on its block and the march after goes at 1x (BB's way); his saved pick stays.
Numbers: engine/bohemia_travel_speeds.json (mod-friendly, fetched at boot, checked, mirror in the map). 8x built, measured and left
out: even with drawing off it ran 150 ms behind and half its blocks (a map block costs ~20 ms before drawing). Music untouched (no
music or sound code reads the speed). Probe: tools/bohemia_world_slide_the_speed_probe.js (upright phone, CDP held finger, the
schedule alone: 2x and 4x under 2 ms late median). THE PHONE gate: its computer hold leg re-aimed to the slider, and it walks at 1x (at 2x its fixed 3 s march went into a town and 24 legs fell; now 256 / 3, the 3 are main's own RELOAD).
OWED: the phone number (this gate box draws in software and cannot hold even 1x on time with the drawing on; PLUMBER, run the probe on
a phone); 8x waits for a cheaper map step; a notch tick is SOUNDS' call; gates/the_pad_is_travel_speed_gate.js is stale history.

WORLD 4 (11/2, rules 307 amended and 308, ask lines 300 and 301): THE WHOLE JOB'S TIME, AND COME BACK OR PAID THERE AT A GLANCE. BUILD 11/3zk. SHIPPED, NOT YET SEEN.
- The hold is timed (the walk to its gate, its waves, paid there); every part of a job checked on the clock (the fight and the night
  spend nothing, measured over 284 fights; legs' waits, finds, hunts, the moved twist counted). Probe sample 15 of 15, holds 5 of 5.
- One mark first on every line a job shows (board row, offer, phone offers, phone job column): amber return arrow COME BACK, green
  pin PAID THERE (data: pay_marks). The phone's job card is drawn on the top page: it now reaches the job file on the map's page
  (bohemia_phone.js JKW), so its time is the one rounding too. Gates: trip 9/9 (T8, T9 new), way back 6/6.
- UI TWO / UI 4: two small marked edits in your phone (bohemia_phone.js timeWord and jobCard, bohemia_phone_board.js meta row);
  the look of the cards is yours, the mark is payMarkHTML's.

WORLD 4 (11/2, rule 307, ask lines 242 and 299): A JOB'S TIME IS THE TRUTH. BUILD 11/3zh. SHIPPED, NOT YET SEEN.
- What he asked (the second time, angry): 'the time that it takes on these quests are extremely inaccurate a lot of the times.'
- Measured first: tools/bohemia_world_job_time_probe.js drives the demo, takes jobs of every kind at five towns (board and phone,
  day and night, PLAY and taps), wins every fight, logs the promise against every map minute to the pay. BEFORE 39 of 60 in the bar
  (65 of 100), 11 off by more than 30 or never finished. AFTER (95 jobs, all nineteen kinds incl. CONTENT's nine legs kinds) 89 of
  91 in the bar (98 of 100); the one miss (the 'they moved it' twist) fixed and re-measured: 20 recover jobs, 19 in, the 20th a
  20-minute road stop. Record: records/BOHEMIA_WORLD_A_JOBS_TIME_IS_THE_TRUTH_11_2_26.md (both tables, eleven causes).
- What shipped: slices/bohemia_job_kinds.js walkRoute() THE ONE ROAD (PLAY's mapBestRoute in the valley, townDoorWalk/cityRoute
  out past it, cityStepMins every block) for the promise, PLAY and a tap on a job's mark (walkGo); walkOf() walks each kind as the
  game does (find to the hint, hunt nearest packs to the count as a range 'the packs move', patrol posts, recover's moved twist,
  CONTENT's legs with their 'wait' and 'dark', home at the found's pace); the phone plans for the day he arrives on the town's own
  glass with the map's target kept from the first plan (PLAN_TG); a held job says the time LEFT; one rounding (timeWords/shortTime)
  used by the offer, the board's row (settlement screen) and the phone's job card (bohemia_phone.js, one line); 'if nobody stops
  you' on the long words. slices/bohemia_region.js: the cargo's pace out past the valley. Data: BOHEMIA_JOB_KINDS.json timing.
- Gates: the_trip_before_the_yes 7/7 (T6 was red on main already: its hand missed the phone card; now it presses the card),
  a_jobs_time_counts_the_way_back 6/6, the_normie_hour_world 8/8, every_job_kind 37/37.
- NOTES FOR OTHERS: RUN: play_takes_you_there P2 is red on main before and after this ('40 trips, 0 quicker': PLAY's minutes road
  and the blocks road came out the same on its 40 trips, maybe since the terrain change); the town's own tap (townDoorWalk) still
  walks the fewest blocks while PLAY walks the fewest minutes; walkRoute already is the minutes road if RUN wants one. ECONOMY 2:
  the job pay reads map hours; the hours are truer now (finds, hunts, legs' waits), a re-bake reads them from BohemiaJobKinds.trip.
  CONTENT: a road card answers pointerup only (a script's click does nothing); the probe presses it. EYES: walk five jobs on the
  phone and read the offer, the board's row and the phone's card against the clock.

WORLD 6 (11/2, rule 318, ask line 315): A NEW VALLEY EVERY GAME. BUILD 11/3ze. SHIPPED, NOT YET SEEN.
- What he asked: 'not getting big procedurally generated map vibes... the Remnants are on the same part of the map... I don't even
  know if you have a number seed system.'
- What it was: fourteen bases baked at fixed blocks (CT_BASES_BAKED), every game the same valley; no campaign seed.
- What shipped: one campaign seed, a six-character code (K7Q-M9X), decided at the map's boot, saved with the game
  (localStorage bohemia.world.v1), shown and typeable on the new-game screen (THE VALLEY · ITS CODE, under the crew's name; a typed
  code or ANOTHER reloads to the same door with that valley). The land never moves; each faction's base stands at one of the real
  town blocks of its kinds (records/target/bb/world_seed.json), weighted by kind and by how much town is round it, never two within
  9 blocks (6 at worst). ctBases(), the turf's seats, the parties and the mines all read it; the start corner and the boss signs
  roll off it. The bench and saves from before keep the old valley.
- Files: engine/bohemia_world_seed.js (the placer), records/target/bb/world_seed.json (every list and number),
  tools/bohemia_world_seed_patch.py (inlines both into the map, re-run after editing either), gates/a_new_valley_every_game_gate.js.
- Record: records/BOHEMIA_WORLD_A_NEW_VALLEY_EVERY_GAME_11_2_26.md (the ten-seed table, the side by side, what is left).
- Left: the region's twelve outer towns' holders (setRegion is node-only in the page: RUN's wire first), the region's camps' candidate
  lists, the shops' stock, the loot and the crew's roll on the code.
- For the next WORLD round: when RUN wires region_bases.json into the page's ledger, seed its holders off
  BohemiaWorldSeed.hash(WORLD_SEED + ':region:' + id) among the factions that could hold each place.
