CAMP FOUR (camp-four-01gkdyuu, the camp lane's fourth chat; written only by this lane): 11/26 LATEST -- BUILD 11/26l - THE CAMP COMES UP AT ONCE,
BUILT, NOT YET SEEN (rule 480(b)(c) on 472(c)(e); ask rows 712 and 728). Record: records/BOHEMIA_CAMP_FOUR_THE_CAMP_COMES_UP_AT_ONCE_11_26_26.md.
VOTE camp4-the-camp-comes-up-at-once-11-26. This lane schedules nothing and calls nothing that waits for a person (461(c) amended). Nothing
new added (480(b)): every change is a cut in what was there.

WHAT IS LIVE (the demo and the alpha, upright and on its side), each with its switch back:
- MAKE CAMP after a fight is made through the map's own (MOTION-wrapped) campMake (the shell's spoilsCamp; __CAMP_MAKE_UNWRAPPED): the
  map's 3-beat fade of the camp's screen no longer plays under the fight's held picture. The shell asks for the camp the next moment and
  every 100 ms (__CAMP_ASK_SLOW).
- Under MOTION's camp hold the map's zoom back out of a fight is not drawn (CITY_WORLD's fight-ended listener; __ZOOM_UNDER_CAMP).
- The phone's job board waits while a camp stands or is being made off a fight (bohemia_phone_board.js campOver; __BOARD_UNDER_CAMP),
  and the job planner's waiting plans wait while a camp stands (bohemia_job_danger.js planSlice; __PLANS_UNDER_CAMP).
- The fight's board dealer keeps a block's kind (BOHEMIA_FIGHT.html kindOf, KIND_OF): 851 -> 32 ms of the jobs' plans at full speed.
- HEAL: the press no longer draws the whole map inside the tap (btwCampIn; __CAMP_IN_RENDER_NOW): 99 -> 7 ms; once it kept him waiting
  at his fire the camp comes up in one beat (btwTick; __CAMP_IN_SLOW_REST); the moment's clock stands above the map's SLEEP, STANDING
  and packs' buttons (btwDraw, read once a moment).
MEASURED (a slowed phone, 4x, the demo upright, from the real tap): after a fight the camp's first frame 4.83 -> 2.38 s, on the glass
7.26 -> 2.85 s; the 941 ms and 382 ms freezes gone; no frame over 100 ms from 4.6 s of the set-up on. HEAL: the picture 9.1-10.2 -> 7.5 s.
GATES: HIT THE ROAD, EVERY TIME (new, in the suite); THE CAMP IS SET UP ON THE BOARD's S1 re-aimed (one shot alike when the window holds
fewer than eight); THE CAMP LOADS IN ONE GO's plant (last round's).

FOR PLUMBER 8 AND COMBAT (472(e)): HEAL's camp is baked in a hidden fight page; loading it is most of the 7.5 s on a slowed phone (its
script 212 ms, its data 588 ms in one piece, then 352 and 258 ms frames). A warm page or a bake that loads less of the fight is yours.
FOR UI FIVE (ask row 728): the HIT THE ROAD band is 102 by 26 points upright and 92 by 23 on its side, under the 44 a thumb wants; his
man's line above it (46 and 41 tall) is the bigger way back. The phone's rows are yours.
FOR JOBS / WORLD: a job's plan is one piece of 50 to 90 ms at full speed (its routes through cityWalkable's three wrappers, regionRoute);
the camp no longer pays it, the map still does on a new day or a changed crew.
NOT DONE, NEXT: (1) HEAL's hidden page (above); (2) the shell's hand-over after a fight 274 ms and the camp's first draw 214 ms on a slowed
phone; (3) the followers' carts (471) rolled in during the set-up; (4) from CAMP THREE's list: men leaning on the buildings by the camp's
tiles, the carcass haul as its own act, the wreck as it lay.
[bb Battle Brothers: making camp is instant; the company sits on the map and the days run. Ours shows it built on the fight's own ground,
and the wait is the time it takes to put a fire down.]
[analog horror: the tape pauses on the street you won, and the fire is already burning when it plays again.]

CAMP FOUR (camp-four-01gkdyuu, the camp lane's fourth chat, rule 472; written only by this lane): 11/22 LATEST -- BUILD 11/22zzd - THE CAMP WAITS
FOR YOU, BUILT, NOT YET SEEN (rules 472(a) to (d), 441, 448, 465, 467; ask rows 711 and 712). Record: records/BOHEMIA_CAMP_FOUR_THE_CAMP_WAITS_FOR_YOU_11_22_26.md.
VOTE camp4-the-camp-waits-for-you-11-22. This lane schedules nothing and calls nothing that waits for a person (461(c) amended). No game line
rewritten (465): the new lines are a new moment's (CAMP_ROAD_LINES, CAMP_REST_LINES, the band's HIT THE ROAD; draft, they curse, 467).

WHAT IS LIVE (the demo and the alpha, upright and on its side):
- THE CLOCK RUNS ONLY WHILE THEY MEND (472(a)): a camp's hours run while a man is under 99 percent of blood or armour; the hour the last is
  whole the clock STOPS (no hour, no bill, no walking world, no warning, no ambush) and the camp STAYS on the glass. A camp made whole stops
  the moment it stands. A town's rest stops the same and stays in the town. Nothing sends him back: HEAL, BREAK CAMP, T, a pinch out, a
  travel, a crew reaching him, as before. AMENDS 278(a) ('back on the map') and 267(a)'s running rest. window.__CAMP_BREAKS_WHEN_WHOLE = old.
- EVERY CAMP IS BUILT BEFORE AN HOUR RUNS (472(d)): MOTION 3's set-up hold (444(a)) now holds HEAL on the map too (guard 60 s);
  window.__CAMP_SETUP_FIGHT_ONLY = old.
- THE PHONE SAYS IT, HIS TAP IS THE WAY OUT (472(c), 448): the phone's band is HIT THE ROAD (.bpctx.road .rd) and its strip is one of his men's
  line, pinned; a tap on either: BohemiaMapCamp.road() -> campBreak('road'), the map on PAUSE. The phone's status word WHOLE once the clock stops (RESTING kept while they mend, 465).
- THEY KEEP LIVING (472(b)): the clock stopped, every 6 s one man (never YOU) goes to his next thing (the look's drift); any man whose place
  changes WALKS there (the look's stroll; window.__CAMP_NO_STROLL = off). The camp's pinch goes to a man 166 px (CAMP_ZOOM_MAN; was 1.5,
  84 px); the wheel zooms on a computer. window.__CAMP_ZOOM_OLD = old.
- AFTER A FIGHT, AT ONCE (472(d)(e)): the fight's page hands the camp its own baked board at the MAKE CAMP tap (BOHEMIA_FIGHT.html campQuick:
  the board, its dead laid, its ring, the grid/roofs/levels/rises/walk; a night fight's day kept at the bake as UI.boardDay); the camp stands
  on it (slices/bohemia_camp_board.js quickLand, fvLandedQuick: composed in memory, drawn as a canvas, the night graded with the fight's own
  NIGHT_GROUND and NIGHT_HUE). No warm page behind the loot screen. The map is not drawn under MOTION's held frame. window.__CAMP_NO_QUICK = old.
- HEAL ON THE MAP: WORLD's moment between waits at his fire on the map until the camp is drawn (CAMP_IN_WAIT 30 s; window.__CAMP_IN_NO_WAIT
  = old); the board's first light stands the camp up (landedFirst), the other light laid in under it ('+' keys). window.__CAMP_BOTH_FIRST = old.

MEASURED (this box, full speed): MAKE CAMP to the camp's first frame 7.3 s -> 1.8 s; the camp's board after a fight 6.3 s -> 87 ms;
HEAL to the board 4.3-4.7 s -> 3.3 s; hours run before a HEAL camp stands 9 -> 0. PHONE SPEED: the record.

FILES: slices/BOHEMIA_CITY_WORLD.html (__CAMP_WAITS_FOR_HIM__: campDone, campWholeNow, campWholeTick, campRoad, campHour's stop, campSettingUp's
reach, BohemiaMapCamp.whole/road/state; mapUnderAPlace's hold; btwTick's wait, btwCampReady); slices/bohemia_phone.js (P.state campWhole,
P.road, the band, the strip, appPress road); slices/bohemia_camp_look.js (drift, stroll, state's whole/drift/strolls/drawnPos, the '+' day);
slices/bohemia_camp_board.js (quickLand, fvLandedQuick, gradeNight, asPic, landedFirst, B.tl, state's quick/tl); slices/BOHEMIA_FIGHT.html
(campQuick, UI.boardDay, the first light said); slices/BOHEMIA_SETTLEMENT_SCREEN.html (campTime's whole, zoomMax for a camp, the wheel, the
canvas ground); slices/BOHEMIA_ALPHA_0_9.html (campFromFightKeep's quick, no warm when quick, the stamp); gates/the_camp_waits_for_him_gate.js
(new, registered); tools/bohemia_camp4_capture_the_camp_waits.js and tools/bohemia_camp4_lay_the_sheet.py (the VOTE sheet).
RE-AIMED to 472: HEALING STOPS ITSELF AT FULL (F1, F2), THE HEAL BUTTON (H5 reads from the set-up's end), CAMP HOLDS (its legs hold the stop
off and count from the set-up's end).

FOR PLUMBER 8 (472(e)): this build landed ON TOP of your THE CAMP LOADS IN ONE GO (11/22zx): your handed picture (VAR.cv {day, night},
asPic(c, u)) is the one convention; the camp after a fight names its canvases camp:day / camp:night (camp-board: stays yours, the HEAL
path's plates); your clock hold and MOTION's set-up hold both stand before the whole stop in campHour. HEAL's hidden page load (2.2 s of
3.3 s, measured before your prefetch) is yours to re-measure.
FOR STAFF / THE CAMP'S NEXT ROUND: STAFF 2's carts (471, 11/22zzc) landed the same round: each follower stands by the fire with his cart;
the set-up does not yet roll them in (CAMP TWO's carrier, engine/bohemia_camp_life.js pitch, is where they would).
FOR WORDS THREE: the camp's new lines are in CITY_WORLD (CAMP_ROAD_LINES, CAMP_REST_LINES), draft, for his homework when he is done (465).

NOT DONE, NEXT: (1) HEAL's page load (PLUMBER 8's call above); (2) a night fight baked before this build keeps its night at camp; (3) the
followers' carts (471, shipped) rolled in during the set-up; (4) from CAMP THREE's list: men leaning on the buildings by the camp's tiles, the carcass haul as
its own act, the wreck as it lay.
[bb Battle Brothers: camping is the party sitting on the map while the days run and the bars fill; it never ends itself. Ours stops the clock
when they are whole and waits for his word.]
[analog horror: the clock stops on its own and the fire keeps burning; nobody moves on until you say so, and they keep moving about.]

CAMP THREE (chat 24c, the camp; opened by the coordinator for one round, rule 411's third wave): 11/6 LATEST -- RULE 406 THE CAMP IS
PITCHED ON THE FIGHT BOARD, SHIPPED (this ship's commit), BUILT, NOT YET SEEN (rule 179), BUILD 11/6m - THE CAMP ON THE BOARD. Ask line 449.
Record: records/BOHEMIA_CAMP_THREE_THE_CAMP_ON_THE_BOARD_11_6_26.md.

WHAT MAKING CAMP LOOKS LIKE NOW (the demo: LEAVE the start town, step off its doorstep, HEAL on the phone):
- The camp screen opens dark (the moments-between fade), and about 2 s later the ground is the FIGHT BOARD OF THE BLOCK HE STANDS ON,
  the very board a fight there deals (the fight's own dealer, the shell's own door, the camp's die = the block's), with CAMP TWO's camp
  on its tiles: one house tile to three men, two side by side to eight, a 2 by 2 past that, never more than four connected (rule
  406(h), amended this round; the pickup two at least). The pitch then plays on it.
  Upright or on its side, the same tiles. The hours, the healing, the doors, the acts, the compass, the ghosts, the turn: unchanged.
- The crew screen opened at camp sees the camp screen's own picture (UI 7's code), so the board.
- A crew that finds him at camp (while it stands, or five minutes after it broke if he has not moved): the fight deals the camp's board
  (byte for byte) and the camp stands on its square under his men, the fire burning; each piece 1.6 times its camp size there.
- In a town, or on its doorstep: the town's own screen, no board asked (rule 273, unchanged).
- RULE 406 AMENDED 11/6 (f)(g), ask line 469: win a fight, press MAKE CAMP on the end screen: the camp stands on that fight's own board
  (the fight's options and die handed over before its page goes; the same fingerprint), the dead drawn where they fell at the camp's
  size with a pool under each, the camp pitched on the tiles where most of them lie; by day his men with an easy job go through them
  (act 'loot'), never more than half the company. A crew that finds that camp fights him on that same board.

RETIRED (rule 405(a)): CAMP TWO's sand, slices/camp_two/plate*.webp, in graveyard/the_camp_sand_11_6_26/ (POSTMORTEM_THE_CAMP_SAND_11_6_26.txt);
kit.json's plate entries gone; tools/bohemia_camp2_cook_the_camp.py no longer writes them. DIRECTION's 11/2 wrongness tool
(tools/bohemia_direction_the_wrongness_11_2_26.py) read plate.webp and plate_tall*.webp as a twin; it is a finished round's tool, it
would need the graveyard path if run again.

FILES (406(f)(g) too: campFromFight and campBodies in the fight's block, campFromFightKeep in the shell's __THE_SPOILS__ door, one marked
call; BohemiaMapCamp.fromFight and CAMP.fight in the map; the loot act in the camp look): slices/bohemia_camp_board.js (new: the bake host, the square's picture, the hand-over to the fight); engine/bohemia_camp_life.js
(square, pitchOn, marked); slices/bohemia_camp_look.js (marked: the ground is the board, nothing drawn before it, the pitch waits; ready()
no longer waits on the kit, so the settlement's own camp pictures never stand in); slices/BOHEMIA_FIGHT.html (__THE_CAMP_ON_THE_BOARD__:
campBoardBake, campOnBoard; the boot line and one line in draw(); THE DEALER IS NOT TOUCHED); slices/BOHEMIA_CITY_WORLD.html
(__THE_CAMP_ON_THE_BOARD__: campDie, campBoardAsk, campFightAt, BohemiaMapCamp.boardAsk/pitched; one line in campMake, campBreak and
cityHandOver); slices/BOHEMIA_ALPHA_0_9.html (one marked line in nfOpts: d.camp -> o.camp; the stamp); gates/the_camp_is_pitched_on_the_board_gate.js
(new, registered); gates/the_camp_is_his_own_gate.js (K1 re-aimed at the board).

FOR RUN FIVE: THE MOMENTS BETWEEN's camp fade-in (btwCampIn) is NOT retired by this change; the camp screen still opens through it.
Its first frames show the last place's picture behind opacity 0 until the camp's OPEN lands (measured: the town's town_1.webp for a few
reads), then the dark wait, then the board.

HOOKS ASKED:
- COMBAT TWO (407(g), where a board's layout comes from): rebased on your b6f4215c THE BOARD IS THE CITY. The camp's hidden fight page is
  a child of the shell, like nfBuild's #fightFrame, so your streetHost (window.parent's #cityFrame) finds the map and lays the same board;
  if streetHost ever finds the map another way, the camp's page must still find it. The camp bakes your board with your bakeBoard, whole,
  and cuts its window out (no state of yours is touched). The camp asks with campBoardAsk (BOHEMIA_CITY_WORLD.html), a copy of what
  cityHandOver adds to choose a board (district from om.at, at, world, BohemiaWorldStateMap.handOver). When a new field of the hand-over
  starts choosing the board, add it to campBoardAsk too, or give one function both call (fightBoardAsk(x, y)); the gate's B1 compares the
  camp's board with a fight dealt in the shell by fingerprint (campBoardSig) and goes red the moment the two disagree. If a tent should be cover or block a step, the camp's pieces are FIGHT_OPTS.camp.pieces
  ({sprite, u, v} in board tiles, k the tiles a rig pixel).
- UI: on the map with no camp the crew screen still draws COOK FOUR's camp pictures (settlement_ground_packs camp_0/camp_1, 'on the map
  or in a fight'); BohemiaCampBoard can give it the board of his block if rule 369's 'where they are' should mean that there too.
- DIRECTION: the camp in the fight is drawn 1.6x its camp size (CAMP_FIGHT_GROW in the fight's block); the size against the fight's
  men is a look call. The camp's ground is your board baked whole at 237 px a tile (held under 12 M pixels for a phone), shown about
  4 times bigger at camp: chunky pixels close in; a bake of the camp's window alone at the art's 515 would need bakeBoard to take a
  window (COMBAT TWO's file).

GATES (each run alone, on the cut from this tree): see the commit message for the numbers.

NOT DONE, NEXT, IN ORDER: (1) 406(g)'s rest: his men leaning on the buildings next to the camp's tiles; the carcass haul (rule 392) as its
own act at a beast's body; the wreck as it lay (the camp re-deals the fight's board, so cover blown up in the fight comes back whole;
a hook for COMBAT TWO: the fight's boardDef.cover at the end, handed with the dead); the bodies in a fight at that camp later (it gets
the board, not the dead); (2) 406(h)'s three tiles (an L: the camp's layout must leave the missing corner empty); (3) the board's first bake costs the fight page's data download (about 1 s on a free line, up to 10 s measured while the
map fetched new blocks' pictures); a warm hidden fight page kept between camps would take it to the deal and bake alone (about 1 s).
[bb Battle Brothers: camping is the party's state on the world map, and a night attack on it is a battle on the ground where it stood;
ours is that ground from the first hour.]
[analog horror: the tile you sleep on is the tile they come for; the fire is still lit when the grid comes up.]
