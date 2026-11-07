# WORLD (one file per lane, written only by WORLD; newest block on top)

WORLD 12, ROUND 2 (11/7; rule 431(e)(f), asks 516 and 517: his B, then 'just another animal we can fight'). BUILD 11/7z - THE TERATORN,
ONE MORE BEAST. BUILT, NOT YET SEEN. Record: records/BOHEMIA_WORLD_12_THE_TERATORN_11_7_26.md. VOTE: world-12-the-teratorn-11-7 (kind
animation, art_kind beast, stage stand_in: a first cut, DIRECTION's golden check not run).
- THE BEAST: Teratornis incredibilis (Howard 1952, Smith Creek Cave, Nevada), a condor surrogate, 4.0 m span, 0.87 m standing on the sheet,
  15 to 25 kg; a numbered hi-vis wing tag and the green lab mark. Built by tools/bohemia_world12_the_teratorn.py (model, render, pack,
  strip; bpy 4.2): reference/models/bohemia/own_body/teratorn.glb (26 bones, seven fingered primaries a wing; materials named *_hair/*_skin
  so the rig's dust leaves the bird its colours), poses Walk 6 / Bite 6 (wings out to 3.4 m) / Hit 2 / Fall 3 (prone); the DIRECTION master
  rig patched in memory for a bird's span -> slices/fight_rig/beast_teratorn.webp (8 x 18, 300 x 253 cells) and the fight_rig.json entry;
  renders and rig.json made by the tool under records/target/combat/rig/beast_teratorn/ (git-ignored, as every beast's); audit records/target/world12_teratorn/teratorn_audit.json.
- THE DATA (no code): bohemia_enemies.json faction teratorns + row teratorn (from the wolf, brain scavenger = the coyote's, no key the other
  beasts lack, hp 70 init 125 melee 55 defs 15 resolve 30 xp 80, Pathfinder), mix, count_scale 0.6, road.by_act, water; BOHEMIA_JOB_KINDS
  beast_looks.teratorns (pack_max 5) and beasts_by_ground (open desert 1, hills 1, landfill 2, Wash 1, freeway 1); carcass.json kind
  teratorn (20 kg). roster.json regenerated. The only code that says teratorn: bohemia_job_danger.js's name table and BOHEMIA_FIGHT.html's
  THEY_ARE line.
- DROPPED BY 431(f): the hunt for the dead, camp attacks, flight rules, the map's sign. map_ambient.json holds vulture and lair_birds at 0.
- GATE: THE TERATORN IS ONE MORE BEAST (gates/the_teratorn_is_one_more_beast_gate.py --plant, browser half _fight.js) 7/0, plants 3 of 3
  (the head painted black, a new brain + 'flies' key, three vultures on the map's cap). Green with it: THE BESTIARY 10/0, EVERY BEAST ITS
  OWN OUTLINE 11/0, THE ROSTER fresh.
- FOR UI: the fight panel's beast icon is one fox head for every beast (the teratorn shows a fox). FOR TUNING: its numbers are draft.
  FOR DIRECTION: the golden pass when its turn comes.

WORLD 12 (11/7; rule 426(e), ask line 496: his NO on WORLD 11's carcass; rule 431(a)(b), asks 510 and 511: the vultures off the map,
a cap on what lives on it). BUILD 11/7u - THE KILL GOES IN THE STASH, NO VULTURES. BUILT, NOT YET SEEN.
Record: records/BOHEMIA_WORLD_12_THE_KILL_GOES_IN_THE_STASH_11_7_26.md. VOTE: world-12-the-kill-goes-in-the-stash-11-7 (kind redo,
redoOf world-11-the-carcass-and-the-vultures-11-6, stage stand_in: the dead animal is the beast's fight frame laid flat).
- NOW (slices/bohemia_carcass.js, rewritten): a WON beast fight (outcome.victory or result 'win'; no kill on retreat, loss, withdraw, the
  pit) leaves one kill on the block beside the fight, the beast's own sheet on its side and a pool, NO plate, no words, no birds. ONE TAP
  (BohemiaCarcass.tap -> take): goods [{what:'meat', kg}, {what:'hide', good:'hides', n:1}]: the meat to wagon food (min(crew x
  meat.nights_a_man 2, kg / meat.kg_a_night 0.5)), billPublish, the top bar; the hide as ECONOMY's own trade item
  (BohemiaStallPrices.tradeItem(STALLP, 'hides'), from 'a kill'; engine/bohemia_stall_prices.js now loads in the map; STALLP fetched by
  the carcass file) into bohemia.bag.v1 while there is room. A full stash: the meat goes, the hide stays on the kill, travelSay 'Your
  stash is full.'. From afar the tap walks there (travelTo) and loopArrived -> arrived() takes it. Gone after keep_h 48 game hours
  (tick). The rise: the food and hides icons on #killrise for 0.9 s from their FIRST drawn frame. State 'bohemia.carcass.v2' (v1 removed).
- STRIPPED: the cart (cityStepMins' pace hook), the plate and the clock, HAUL/EAT/butcher/stew, TELL and the town's carts, LEAVE IT and
  the den (bohemia_job_kinds.js spawnPack), the clean-kill share, the feed posts, the men's dead stains, every vulture.
- THE VULTURES OFF THE MAP (431(a)(f)): none in bohemia_carcass.js; bohemia_world_state_map.js's birds() over every lair deleted.
- THE CAP (431(b), new): slices/bohemia_map_ambient.js (BohemiaAmbient.frame/allow/appear/stats/cap) and records/target/bb/map_ambient.json
  (vulture 0, lair_birds 0, camp_smoke 5, mast_light 6, camp_embers 7, kill_rise 2 at once / 20 a minute; the module's DEF must equal
  the file, the gate checks). Askers: bohemia_world_state_map.js draw (smoke and mast lights, nearest the glass middle first; LAST.ok
  read by after() for the night blink), BOHEMIA_CITY_WORLD.html btwDraw (embers), bohemia_carcass.js (the rise). Anything new that moves
  on the map on its own goes in the table or it never shows.
- GATES: THE KILL GOES IN THE STASH (--plant) 14/0, plants 3 of 3; WHAT LIVES ON THE MAP HAS A CAP (--plant) 6/0, the plant turns the
  flood red (303 smoke columns); A PACK HE RAN FROM LETS HIM GO (the old file, pack legs only, RUN SEVEN's) 9/0.
- NEXT ON THIS LANE (431(e)(f), asks 516 and 517): THE TERATORN, one more beast in the roster, fought like the others, no special
  systems, no map sign, reads as a vulture at every size (golden-piece recipe) or it does not ship.
- FOR THE COORDINATOR: WORLD 9's job 'FIND THE MEAT' (BOHEMIA_JOB_KINDS.json kind 'carcass') still names its leg UNDER THE VULTURES and
  speaks of carts; NOTE on the WORLD board; not changed.

WORLD 11 (11/6-11/7; rule 417(b)'s sweep: rules 392, 386, 413(c); ask lines 427, 418, 465). BUILD 11/6s - THE CARCASS AND THE VULTURES.
BUILT, NOT YET SEEN. Record: records/BOHEMIA_WORLD_11_THE_CARCASS_THE_VULTURES_AND_THE_PACK_THAT_LETS_YOU_GO_11_6_26.md.
- 392 THE CARCASS (slices/bohemia_carcass.js, new, WORLD's; numbers records/target/bb/carcass.json, the mods law): a beast fight's dead lie
  on the block beside the fight (one heap, the beast's own sheet pressed flat, a pool), plate 'N KIND · KG · FRESH 6H' -> TURNING -> GONE
  -> bones (fresh 6, gone 24, bones 48 of its own clock; nights x0.5; the cart x0.6). A tap on the plate: HAUL IT (beside it; an hour a
  100 kg on the clock, a beat an hour, the world walks; cart 120 kg, x1.5 slower full; EAT IT from the cart's plate: two nights for the
  company; any town reached buys it: butcher, or the Mob's stew), TELL <nearest town> (from anywhere; their carts walk out and back, drawn;
  paid on the way in by freshness), LEAVE IT (at bones a den: coyotes, hyenas past 200 kg, wolves past 600; the next hunt from a town in
  reach starts its first pack there). Clean kill: -12% a wound, floor half. State in localStorage 'bohemia.carcass.v1' (per valley seed).
- HOOKS (all __THE_CARCASS__): BOHEMIA_CITY_WORLD.html the script tag, loopJobsDraw (draw), mapTapWhat (tap, before the job kinds), advance
  (tick(mins)), cityStepMins (pace), loopArrived (sell); bohemia_job_kinds.js spawnPack (the den) and exports beastPic/letGo; the shell's
  nfOverIn ONE marked line: outcome.bodies (kind, beast, wounds of every one of theirs dead), RUN's file.
- 386 THE VULTURES (same file): circle a carcass (1 -> 7, land when it turns, 3 at most), a fight's dead men (24 h), a found boss still
  standing and his sign (3 each); follow him (a bird per 4 killed in 2 game days, 5 most), a wing's shadow over the glass now and then;
  beside the dead the rest lift and one stays still. Never attack. Real size (a wingspan about a man). THE PICTURE IS A STAND-IN, marked
  (data vultures.stand_in; VOTE card world-11-the-carcass-and-the-vultures-11-6, stage stand_in). They turn on their own canvas
  (#vulturesky, pointer-events none, the map's own transform): measured, redrawing the map for them was 33 ms x8 a second; now 0.1 ms a
  frame and the map redraws only for its own reasons.
- 413(c) THE PACK LETS HIM GO (bohemia_job_kinds.js __A_PACK_HE_RAN_FROM_LETS_HIM_GO__, PACK_LETS_GO.on false is the before): MEASURED, a
  pack he fell back from (shy 1e9) still wandered and a wander ending beside him opened its card from its own step (8 in 12). Now it never
  steps within two of him, gives ground when he comes near, never starts a fight from its step. His chase asks: one marked line in
  meetBackHolds (a pack he tapped is aimed wherever it stepped; measured HELD before, no card).
- NEW GATE gates/the_carcass_and_the_vultures_gate.js: 23/0 on the merged tree (C0 a real beast fight through the one door to the carcass,
  C1-C8, V1-V5, P1-P5 with P2b-P2d, P4 the before, R). RAN: TOWN DOOR 7/0, CONTACT DEAD 18/0, DEMO BUILD 25/0, ATTEMPT 15/0, LANGUAGE 107/0,
  PAGES PUBLISH 28/0; EVERY JOB KIND 36/1 (E5 on a LOST escort fight, main's run WON it; escort alone 10/0 after); RETREAT 13/1 and the
  same 13/1 on main's files (mid-fight R5, 23 game hours: RUN SEVEN's area); VOTE TAB 62/4 the same on main; BUILD SIZE 14/7 the same on
  main; INLINED FRESH 0/1 the same on main.
- HANDED TO RUN SEVEN (the coordinator 11/6, routine '413(c) moves to RUN SEVEN': RUN SEVEN owns the whole get-away, beasts included;
  WORLD stays out of meetFallBack, MEET_BACK, the retreat holds and the town door from here). The note reached this chat after the ship,
  so these two changes are ON MAIN (2c860bc3) for RUN SEVEN to build on, keep, or replace; WORLD will not touch them again:
  (1) slices/bohemia_job_kinds.js STEP['hunt-kind'], marker __A_PACK_HE_RAN_FROM_LETS_HIM_GO__: var PACK_LETS_GO = { on, held } (top of
      the file, exported as BohemiaJobKinds.letGo); letGo = on && p.shy > 0 && job.chase !== p.id; a letGo pack within two blocks steps
      away from him ('it gives ground'), never moves to a block within two of him that is not farther than it was, and 'continue's
      before packFight, so it never opens a fight from its own step. PACK_LETS_GO.on = false is the before.
  (2) slices/BOHEMIA_CITY_WORLD.html meetBackHolds, one marked line (__mcx): a contract contact whose job has j.chase === j.fight.pack
      counts as aimed (measured: his chase on a pack that had stepped a block was HELD, no card, because TRAVEL.to lagged the pack).
  The legs that prove them are P1-P5, P2b-P2d and P4 (the before) in gates/the_carcass_and_the_vultures_gate.js; RUN SEVEN may re-aim
  or move them into its own gate. FOUND, not mine: A RETREAT GETS HIM AWAY's mid-fight R5 reads 23 game hours on main's own files (the
  crew should be gone after about 12).
- OWED: CAMP (the dressing as the men's own act on the board, 406(g)); UI (TELL from the phone's own screen); ECONOMY/TUNING (pay.*,
  clock.*, cart.*); SOUNDS (wings on a roof, the knives); BEASTS/DIRECTION (the golden vulture; a lying frame for the carcass); WORLD next:
  a hunt that asks for the meat up front, a carcass left too long draws a pack or a crew to it.
[bb Battle Brothers' beasts leave trophies for the taxidermist; nobody hauls the meat; a party you fled is one you choose to meet again.]
[analog horror: the birds were there before you were; one does not move when you come.]

WORLD 9 (11/5-11/6; rule 409's first wave; ask lines 443, 438, 435, 439, 422). BUILD 11/6b - CONTACT STOPS HIM DEAD, SPACE HOLDS 4X.
BUILT, NOT YET SEEN. Record: records/BOHEMIA_WORLD_9_CONTACT_STOPS_HIM_DEAD_AND_THE_QUIET_EVENTS_11_5_26.md.
- 401(b) CONTACT STOPS HIM DEAD (BOHEMIA_CITY_WORLD.html __CONTACT_STOPS_HIM_DEAD__): measured, the picture rode 0.73 of a block behind the
  logic and walked on 268 ms under the meet card. Now travelInterrupt('meet'|'event') calls glideDead(): the glide's queue is dropped
  where the picture IS (no snap), the block the logic took that tick is never walked, every party's picture stops too, nothing walks
  while the card stands (glideHeld), the hop sets down over a quarter beat (glideLandLift), the card's dark closes on the picture. The
  logic is untouched. CONTACT_DEAD.on false is the before. After: 0 blocks of slide (it stands about a block short of the logic's block).
- 398(b) A QUIET EVENT IS A POST (bohemia_road_events.js __A_QUIET_EVENT_IS_A_POST__): all 45 road events ask; the quiet cards were the
  ANSWER after his choice (GO ON) and a side quest's ending. A card with o.quiet and one way on is never shown: a post '@theroad', NAME:
  line (what it gave), its one way runs, the march goes on at his speed. QUIET.on false is the before. The 26 one-button talk lines inside
  side quests stay cards (a conversation he chose). FOUND ON THE WAY: the road's posts went only to the old stream, which the phone stops
  reading once the FEED engine speaks; now BohemiaFeed.mouth (my block after FEED's, BOHEMIA_CITY_WORLD.html) merges the map's verbatim
  lines into BohemiaFeed.read(), FEED's engine untouched. By the code (not run), bosses' and his map's posts (bohemia_bosses.js,
  bohemia_his_map.js) still go only to the old stream, so the phone would not show them either: one line each to call BohemiaFeed.mouth
  first (his map is ours, next round; bosses is BOSSES').
- 396 THE SPACE BAR (BOHEMIA_CITY_WORLD.html __SPACE_HOLDS_FOUR_TIMES__ spaceKey, bohemia_phone.js the shell's half): a tap (under
  TRAVEL_CLOCK.holdMs) pauses and plays on release; a hold runs 4x while held, his speed back on let go, his kept speed never moves; a
  card during the hold gives his own speed back. Both doors (the shell's focus, the map's).
- 399 + 389 NOT ALL HUNTS (bohemia_job_kinds.js __THE_GIANTS_ARE_RARE__, bohemia_job_danger.js rareUp, BOHEMIA_JOB_KINDS.json): measured,
  the board was 7% hunts; the cause was each hunt pack drawing its animal from its ground and respawning farther out, and the hills
  were 4/9 giants. Now giants (giants.kinds) never in a pack, hunt or guard, always one animal; the hills and desert get burros, horses,
  coyotes; lions pack_max 2; the show's two tigers one pack of two; big game rows may carry their own legs: the old lion is the
  American lion, plus THE SABRE-TOOTH IN THE RED ROCKS and THE SLOTH AT TULE SPRINGS, each 'rare' 0.2 (up one board window in five).
  FIVE NEW KINDS as data legs: lair (the den), investigate (the stew, 388), carcass (the vultures' kill, 392), follow (the courier, a
  Network man, 391), farm (the Mob's grow house). Pays baked by tools/bohemia_economy_job_pay.js. 24 kinds, 60 offer rows.
- NEW GATES: gates/contact_stops_him_dead_gate.js 18/0 (C1-C6 the stop, Q1-Q5 the quiet events, S1-S4 the space bar; computer);
  gates/way_more_quests_not_all_hunts_gate.js 7/0 (a month of boards: top kind 25% in a window, hunts 7%, giants 3.5% of fights).
- RAN: a job pays 23/0, DEMO BUILD 25/0, THE MAP GLIDES 14/0, EVERY JOB KIND 37/0, THE FEED IS ALIVE 29/0, THE RADIO LIVES IN THE FEED 5/0,
  NOTHING POPS 38/0, THE BOARDS ALWAYS HAVE WORK 24/0, THE BOARD'S QUESTS ARE PEOPLE 17/0. THE PHONE 159/5: one leg ('PLAY alone sets off')
  took the new den job, 6 blocks out, which the card's own walk reaches before PLAY (a gate timing for UI); the rest of that run's reds
  are the fight's phone strike and its follow-on throws, green in the other hand's run.
- OWED: 399(a) a town's own faction's jobs first (the deal is RUN TWO's slices/bohemia_board_shelf.js; a row needs a 'faction');
  409(c) the Pocket City 2 places (next round). SEEN, NOT EXPLAINED: in the contact gate a march set right after a REAL chase's FALL BACK
  did not start in two runs of three (the gate now runs the chase last); a hand on a phone has not reported it, worth one look.
- MAIN'S REDS I MET, NOT MINE (main's files swapped in, same numbers): THE PARTIES WALK 6/4 (walking people drawn on 0 frames, a party
  moving 7.299 blocks in a frame, his two at his shoulders 0, nobody walking after the clock stops 0); MEET BEFORE YOU FIGHT 9/6 (M6, M9,
  M11, M13 to M15: the second chase never engages, a beast pack read as MEN, no still enemy found; identical on main).
- LATE: a road card's dead stop only on a march in progress (a job's talk on arrival lets him walk in); contact gate rerun 18/0.
[bb Battle Brothers stops the company the instant a party engages it; its event screen pauses only to ask; its giants are rare named hunts.]

WORLD 8 (11/3; ask lines 117, 185, 39; BOSSES FIX's pin crash). BUILD 11/3zzt (the crash) and BUILD 11/3zzzq (the rest). BUILT, NOT YET SEEN.
- THE PIN CRASH (11/3zzt, 41843539, live): the game was right. The walk to the boss's sign can end inside a town; the town's
  screen stands over the map and a held finger lands on the town (THE CLINIC's line), never the map. The gate now leaves the
  town the way a player does, waits for the title itself, reopens with its own profile, never throws. Under it WORLD 7's
  start-of-game sky tinted his map's grey tape (drawn after the fog): now drawn under the fog (BohemiaWorldStateMap.under, hook
  H6b in tools/bohemia_world_state_patch.py). HIS MAP 42/0 phone and computer; A DIFFERENT VALLEY 60/0.
- 117 + 185 THE HOUSES STAND UP CLOSE (slices/bohemia_map_houses.js; hooks tools/bohemia_world_8_map_houses_patch.py, 18,
  __THE_HOUSES_STAND_UP_CLOSE__; refuses a half-hooked page): COOK's five ranch houses and COOK PROPS' single-wide, shot four ways
  from the MAP's camera (tools/bohemia_world_8_map_houses.py, Blender 4.2 venv, slices/map_houses/ + manifest), stand 2.0 times
  their metres on every house lot the painter rolls (the painter reports the lots, LOTS, and lays them as yards, FLATH, once
  the models are up; never in a town's footprint, never on a burned lot). One hand-over at a block 96 px (no fade, only on a tile whose yards are laid; the models toned to the map at load); the pinch's
  own clamp goes on to THE STREET STOP, a block 380 CSS px (zoomBounds()[1] keeps the old 85, so every old check means the same
  place). Walkers behind a model are covered by the same depth test (mapDepthCovers = the painting's OR the models'). Up close
  the walk reads: past a block 90 a block takes more beats (mapGoingBeats x watchBeats, the clock the same minutes) and the glide
  takes all of them (glideK). Gate gates/the_houses_stand_up_close_gate.js.
- 39 WHAT HE SEES NOW (slices/bohemia_map_sight.js, hook H13 __WHAT_HE_SEES_NOW__): the blocks mapSees() says he sees at their
  own light, the ground he remembers about 0.65 of it, under the fog's tape. Gate gates/what_he_sees_now_gate.js. HIS MAP sets this
  layer aside for its fog legs (it reads the tape, not the dim).
- Gates changed: his_map (town leave, title wait, reopen profile, the dim aside), one_zoom_no_second_map_mode (the pinch's top is
  the street stop; the old stop's 1:1 art still read at zoomBounds()[1]). Record:
  records/BOHEMIA_WORLD_8_THE_PIN_CRASH_THE_TALL_MAP_AND_SIGHT_11_3_26.md. VOTE: world-one-pinch-to-the-street-11-3,
  world-what-he-sees-now-11-3 (moving, records/target/world_8/).
- RULES 346 + 356 on the map (BUILD 11/3zzzu): checked on the pinch card's 41 frames at every zoom. Fixed the ghost (models faded
  over the painted boxes between a block 70 and 96: now one hand-over at 96, only on a tile whose yards are laid) and the pale
  models (toned to the map at load). Roads first: ONE network of 3,628 road blocks; 95 ends: 49 at the city's edge, 45 at a
  place's gate, 1 into a walled suburb (41,23); gate legs R1, R2; nothing to fix. STILL WEAK: the shops, works, slabs and towers
  are the painter's boxes at the street stop (the next job: their models).
- 344 THE MAP CAN TURN (BUILD 11/3zzzzad; the coordinator's step 4): a NEW game's code flips the valley north to south, east to west,
  both or neither (engine/bohemia_overmap.js VALLEY_TURN on top of the land's own rolls, resynced into the page; the boot hook
  __THE_MAP_CAN_TURN__ H14 keeps it with the code in bohemia.world.turn.v1; old games and the bench keep their valley; the bench
  asks with bohemia.world.bench.turn). The painter's compass reads the valley's own north (H15), so the land round it, its passes
  and roads turn too. NOT BUILT: a quarter turn (the generator assumes the I-15 runs north to south). Gate
  gates/the_map_can_turn_gate.js 24/0. VOTE world-the-map-can-turn-11-3. Engine touched: RUN slice rebuilt, demo re-cut.
- MAIN'S REDS I MET, NOT MINE (measured with my two layers switched off, same numbers): THE MAP STANDS TALLER W1 (5,879 pixels
  neither him nor the building at the near stop) and W3b (one frame sunk on the freeway berm).
- OWED: models for the shops, works, towers and casinos (COOK's warehouse, motel, pawn shop, gas station, casino, tower casino
  are built); the ground up close is the painter's top step (chunky at the street stop); lit windows on the models at night; the
  phone's own 60 at the street stop (this box draws in software: PLUMBER on a phone); rule 344 THE MAP CAN TURN is WORLD's next.
- 376 TAP A QUEST, YOUR PEOPLE GO, THE MAP'S HALF (BUILD 11/3zzzzas; ask line 404). FOR UI 7, THE ONE CALL, in the map's own
  frame (the city frame's window, where LOOP lives): window.BOH_TRAVEL_TO_QUEST(questId [, { follow: false }]) ->
  { ok, why, id, kind, act, name, to: [x, y], town, mins, blocks, of, timed: [{ key, to, mins }], follow }. questId = a held job
  (LOOP.held[].id) or a phone offer (__PHONE_BOARD.shown[].id; it goes to the giving town's board). ok false says why: 'no quest',
  'nowhere to go', 'no road', 'in a town', 'a fight', 'not on the map'. It walks the map's own road (BohemiaJobKinds.walkGo, the
  clock and the road's events as ever); many markers (a hunt's packs, a patrol's posts) go nearest BY ROAD MINUTES first, the next
  call the next closest; the camera eases in to a block 240 CSS px and holds the party, in small steps that wait until the ground
  round him is painted (never a blur; the painter now paints out from the held crew, hook H17); a pinch, wheel or touch on the map
  stops it for good; a town opens its screen on arrival, a pack in the open is the meeting. Code slices/bohemia_quest_travel.js
  (hook H16). OWED: the phone's own painter speed at close zoom (this box needs 29 to 47 s to paint down to 240; PLUMBER). Gate gates/tap_a_quest_your_people_go_gate.js 10/0 upright and sideways. VOTE world-tap-a-quest-11-3. I never touched
  slices/bohemia_phone.js.
- 378 NO CAP ON A ROAD FIGHT (BUILD 11/3zzzzax; ask line 407): the road event's roster and the street crew's two rosters were
  Math.min(8, ...); the party's real size goes in now (hooks H18 to H20). Left standing, said in the record: the party math's top
  13 is TUNING's number in party_math.json; the first day's company plus one is ruled. Gate gates/no_cap_on_a_road_fight_gate.js 7/0.
- 381 A TOWN IS ALWAYS A DOOR (BUILD 11/3zzzzax; ask line 411, rule 273): reproduced first (the card back at the gate past the old
  ten-block get-away). A walk that ends in a town is never aimed and its get-away holds; what comes TO him waits off a town's
  ground (its painted ground and 2 blocks round, townGround); the hunters stop at its edge and give up after 8 of his blocks; a
  fight he chooses still comes (__A_TOWN_IS_ALWAYS_A_DOOR__, hooks H21 to H27; TOWN_DOOR.on false is the before). Gate
  gates/a_town_is_always_a_door_gate.js 7/0 from three sides. VOTE world-a-town-is-always-a-door-11-3.
[bb Battle Brothers draws a party only inside your sight radius, and its map reads by its towns standing tall over the ground.]
[analog horror: the remembered ground goes a shade darker the moment he turns the corner; nothing says so.]

WORLD 7 (11/3, rule 339, ask line 347): A DIFFERENT VALLEY EVERY GAME. BUILD 11/3zzi. SHIPPED, NOT YET SEEN.
- NEVER GREEN (rule 341, the coordinator's note; BUILD 11/3zzl): the first cut painted a rebuilt block's yard as a green garden; now raked
  dirt with salvaged panels in rows. Checked by measure: the painting's green texels 0.01% of the valley, 0.00% on every state block
  (gate legs V1 and V4 NEVER GREEN, 60/60). The map's ground has no green suburb; picture green is clothes and turf lines.
- What he asked (again): 'the map is not giving procedurally generated vibes.' WORLD 6 moved the bases; the map still looked the same.
- What shipped, all off the same campaign code, all on real blocks of their kind, every list and number in
  records/target/bb/world_state.json: BURNED, LOOTED and REBUILT blocks painted by the map's own painter (worker, every zoom); 35-70%
  of the valley's neighbourhoods DARK through the grid's own POWER.douse (never round a base; re-made each boot, never written to the
  bill's dark set); CAMPS (smoke by day, a fire at night), LAIRS (a wreck, bones, birds turning), RUINS (a burned shell), LEGENDARY
  places (a mast, a red light) standing in the world and rising out of the fog; 3-5 freeway blocks and 1-2 of the nine pass roads
  SHUT (the walk refuses them; only where the valley stays one piece); the START'S SKY (dust, heat haze, cold clear night, smoke) for
  two days; a burned BUILT block deals the ruin board ('firestation'), every fight carries block_state and powered. The old valley
  (no code; a save from before, no st stamp) is untouched.
- Files: engine/bohemia_world_state.js (pure), slices/bohemia_world_state_map.js (the map's half), tools/bohemia_world_state_patch.py
  (inlines data + module, adds 11 marked hooks __A_DIFFERENT_VALLEY_EVERY_GAME__; refuses a half-hooked page: check the page out of
  git and re-run), gates/a_different_valley_every_game_gate.js 55/55. Record: records/BOHEMIA_WORLD_THE_MAP_FEELS_GENERATED_11_3_26.md.
  VOTE: world-a-different-valley-11-3 (records/target/world_7/A_DIFFERENT_VALLEY_EVERY_GAME.jpg).
- NOTES FOR OTHERS: BEASTS / CONTENT: the marks are seen, not entered: BohemiaWorldStateMap.state().marks ({kind, look, x, y, name}) is
  the list to hang a lair fight or a camp meet on. BOSSES FIX: a fallen boss's 'lights come back' (his_map S.lit) draws over a seeded
  dark block; if a boss relights circuits for real, POWER.relight is re-doused by this file's boot unless the relight is recorded.
  COMBAT: msg.block_state ('burned' / 'looted' / 'reclaimed' / 'none') and msg.powered reach nfOpts' d if you want a dark-block fight
  or a looted board. UI: the new-game screen could name the start's sky (BohemiaWorldStateMap.state().weather.name).
- OWED: the marks entered (above); the town's screen saying its block burned or went dark; the day-by-day weather per code (it is still
  the land seed's after the start); stronger at-a-glance contrast if he votes B.

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
