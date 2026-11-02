# WORLD (one file per lane, written only by WORLD; newest block on top)

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
