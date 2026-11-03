# UI (the screens and the phone) -- the handoff block (written only by UI, newest first)

UI (ui-7, tap a quest on the phone): 11/3 LATEST -- [tap a quest, your people go: the phone's half] BUILT, NOT YET SEEN (rule 376, ask
line 404; BUILD 11/3zzzzaz - TAP A QUEST ON THE PHONE, code 3b77e4afc + f5ac27e5a, on main 2a3511db0), IN THE DEMO, VOTE card
ui7-tap-a-quest-on-the-phone-11-3 WAS beside NOW. Record records/BOHEMIA_UI7_TAP_A_QUEST_ON_THE_PHONE_11_3_26.md.
- THE PHONE (slices/bohemia_phone.js __TAP_A_QUEST_YOUR_PEOPLE_GO__): questGo(id, from) is every quest's one handler: the job's card (.jc
  click and Enter; its X keeps its own tap), the strip while it shows the post of a job he holds (questStrip sets .bpfd.quest and
  data-quest off H.stripTop; stripPaint and fitStrip are untouched, the strip's click reads data-quest), the feed page's .po.qp
  (questOf: a job_taken post whose words name a held job's town). It closes the page, leaves a town by P.leave (the town's #leave) or
  breaks the camp (BohemiaMapCamp.break; a camp in a town then its LEAVE), waits out the map's leave-fit (MAP_FIT, about 1.4 s from a
  tap in a town), then calls the city frame's BOH_TRAVEL_TO_QUEST (WORLD 8), else P.jobGo. H.going {id, to, trav} is the mark: .jc.going
  (arrow or dot amber, bphGo on BEAT), .bpfd.quest.going, .po.qp.going; questTrack takes it off when TRAVEL ends or leads elsewhere (a
  re-aim at a hunt's moving pack keeps it: BohemiaQuestTravel.places). A no (no road, a road's card up) shakes it (bphNo). Read-outs:
  window.__PHONE_QUEST_GO, BohemiaPhone.going(), BohemiaPhone.questLog().
- GATES: gates/tap_a_quest_on_the_phone_gate.js 21/0 (new; upright and on its side, a finger: in a town, on the map, the strip, the feed
  page, the fallback, no NOTES; plants: no road, a plain mark). Re-aimed: the_phone_gate (268/0: the card's tap is stopped before PLAY is
  seen to go), the_place_in_the_dark_gate (20/0; the journey stopped before the marks are read; its phone D6 is red on clean main, 19/1).
NEXT: the old offers board (bohemia_phone_board.js, #cityfeed) is hidden on every screen, so its cards were left alone; if it ever comes
back its post() is the place to call questGo's twin. A road's card often stops a trip inside two blocks (raiders, a pack coming to
meet him): that is WORLD's road, the mark comes off with it.
[bb Battle Brothers: the contract's scroll on the world map's corner is the button; click its target and the company walks with the
clock running. Ours: the job's card on the phone in your hand, one tap.]
[analog horror: the card you sent them to pulses amber on the beat like a tracker's dot on a handheld, and goes dark when the road ends.]

UI (ui-7, the top and the crew's camp): 11/3 -- [the top is only resources] + [the crew sees the camp] BUILT, NOT YET SEEN (rules
368 and 369, ask lines 392 and 393; BUILD 11/3zzzzaj - THE TOP IS ONLY RESOURCES, code f6836bd76, on main 9025ec9f8; BUILD 11/3zzzzau - THE
CREW SEES THE CAMP, code 38ed041cc; LIVE: pages run 4258 SUCCESS for 1ee466f2e), IN THE DEMO, two VOTE cards WAS beside NOW (ui7-the-top-is-only-resources-11-3,
ui7-the-crew-sees-the-camp-11-3). Records records/BOHEMIA_UI7_THE_TOP_IS_ONLY_RESOURCES_11_3_26.md and
records/BOHEMIA_UI7_THE_CREW_SCREEN_SEES_THE_CAMP_11_3_26.md.
- THE TOP (slices/bohemia_ui_materials.js __THE_TOP_IS_ONLY_RESOURCES__): the day plate, the crew plate and the place stay in the bar's DOM
  off the glass (the phone's CREW presses the hidden crew tag; the phone reads the place from it); .r1 is gone for good, the gear (only
  with no phone) at the end of .r2, the pane 44 tall: the band is ONE height from its first frame, 108 -> 63 upright. Do NOT add a
  re-fit on band changes: a ResizeObserver that told the map 'resize' threw a drawImage page error on THE PHONE's computer walk.
- THE PHONE (slices/bohemia_phone.js): __THE_DAY_ON_THE_PHONE__ .stat .dt 'DAY n  hh:mm' (never in the fight), the place steps down to
  5.5 px before a letter is cut, the band under PLAY says GOING/STOPPED/RESTING/IN TOWN only, CREW in KEEP (ALWAYS). The crew face's .cman
  names the man picked (P.roster().man, read off his card).
- THE CREW SCREEN (slices/BOHEMIA_ROSTER_SCREEN.html __THE_CREW_SEES_THE_CAMP__, after __THEIR_CAMP_BEHIND__ whose campPaint/campMen/
  campFloor it rewired): CAM {k, ox, oy}; campTarget puts the picked man's feet on his figure's feet (campSpot); the camp at the figure's
  size, a town at cover x 1.5; campAim glides 450 ms from its first frame (log in CAM.log: ms, wait, gap, paint); choose()/draw() wrapped;
  campManAtPoint/campTapOpen are the tap's (and the gate's) one rule. The light: campLampGeom (the pool round him; the top and foot bands
  only where campWords sit), campFloor searches pool, top, foot in that order, campLamp drawn once a pick and cached. html.bm-camp-live
  (+ :not(#bm-x) for specificity over the kit) takes board/tin/receipt off the sheet; upright the bag pockets join the side columns,
  slots 54; on its side the line over the stash. On the map camp the picked man is the figure (his camp sprite skipped); in a town the
  town draws him (figure hidden). Men round the back of the fire in rings 4/6/8/12.
- THE UNSEEN TOWN (bohemia_ui_materials.js hudTownWin): a settle frame at opacity < 0.05 never takes the crew press.
- GATES: gates/the_top_is_only_resources_gate.js 69/0, gates/the_crew_screen_sees_the_camp_gate.js 33/0 (both new, both ways, plants);
  re-aimed to 368: the_days_once, one_hud_everywhere (merged with UI 6's NOTES re-aim), the_phone_gate (RELATIONS hides, CREW never), the_ui_
  belongs_to_the_world (map leg); to 369: the_crew_screen_shows_their_camp (its plant takes all three shades off).
NEXT (named, not mine to fix this round): THE COMPANY SCREEN, BATTLE BROTHERS SIMPLE reads 1.05 screens upright on main (COMBAT 7's
armour-class line a19b52b3 on the screen opened without a camp; 1.04 with mine, which passes the stranger's-path leg main fails): COMBAT 7
or UI. THE CREW SCREEN SHOWS THEIR CAMP's T legs are red on clean main too (they count the camp picture's download as work). In a town a man
the town stands at the picture's very edge lands as near the middle as the picture allows (105 pt upright, 200 on its side at Church):
RUN TWO could stand his men off the town's edge. The town's live copy costs 8 to 10 ms a glide frame on this GPU-less box (the camp 0.1).
[bb Battle Brothers keeps the day on a small dial at the top of its world map and its company screen over a painting of the camp's fire;
ours keeps only what you carry at the top, the clock on the phone in your hand, and the camp itself, live, under the company.]
[analog horror: one work lamp on the man you picked, the camp falling into the dark at the frame's top and foot like a CCTV picture.]

UI (ui-6, the camera feeds; the words belong to the picture; the menu frozen): 11/3 LATEST -- [the camera feeds] + [the start screen,
two ways] + [the words in the picture] + [notes gone] + [the menu frozen] BUILT (asks 351, 358 SEEN YES; 377, 378, 379, 380 BUILT, NOT
YET SEEN; rules 342, 348, 357, 358; BUILD 11/3zzzzab - THE WORDS BELONG TO THE PICTURE), IN THE DEMO, two VOTE cards (ui-the-camera-feeds-11-3, ui-the-words-belong-to-the-
picture-11-3). Record records/BOHEMIA_UI_THE_CAMERA_FEEDS_11_3_26.md; proof records/target/ui_the_camera_feeds/.
- THE FEED (slices/bohemia_ui_crashbox.js): the whole glass, first person; ten feeds a..j, a random one each open, never the last
  (localStorage bohemia.title.feed.last); after 40 s the monitor cuts (2 holds of roll, 1 of snow) to the next camera and its sound;
  each feed a tall 432 x 768 and a wide 768 x 432 sheet (6 or 12 frames one under the next); a turn cross-fades over 4 holds.
  Everything in slices/crashbox/crashbox.json (feed.options[k]: sheets, sound, the camera's corner, words[tall|wide] = where the
  title block (t) and the choices (m) sit, tink/mink = the inks). Probe switches: localStorage bohemia.title.feed holds one feed;
  BohemiaCrashbox.cutSoon() winds the clock to the cut.
- THE WORDS (rule 357): nothing behind them (no plate, box, shadow, outline, marks); placed per feed by the picture's own frames:
  tools/bohemia_ui_the_camera_feeds.py --place measures every frame on his phone both ways with the front screen's J5 (sun test) and
  writes words into crashbox.json. A new or re-shot feed: render, --post, then --place, then check THE CAMERA FEEDS C11.
- THE HOURS (rule 357 (f)): HOUR in the tool: dusk a, g; dawn h, i, j; noon d; afternoon f; night b, c, e. EXPOSE bakes the day
  feeds' film under the night's so the words have their place (a 0.74, f 0.68, g 0.8, i 0.42, j 0.8).
- NOTES IS GONE: the title's and the bar's #notebtn hidden by CSS (the city's own file still builds it; other lanes' code calls it),
  the phone's APPS without notes; its two gates in graveyard/the_notes_button_11_3_26/ with a post-mortem; eight gates re-aimed.
- FROZEN (rule 358): gates/the_loading_menu_is_frozen_gate.js holds the four words, the start screen's 21 rules of look and the roll's
  numbers against records/target/ui_the_loading_menu_frozen.json, and F5 SILENCE (rule 361: after a tap only the feed's own loop). A change needs a commit saying NEW RULING, then --freeze in it.
  More feeds are welcome (same bar: tall and wide, its own sound, --place, C11 green).
- PICTURES: tools/bohemia_ui_the_camera_feeds.py <a..j> <tall|wide> <dir> (bpy 4.2 venv; ~20 s a frame on four cores), --post
  into slices/crashbox/feed_<x>_<tall|wide>.webp; SOUNDS tools/bohemia_ui_the_camera_feeds_sounds.py (CC0 bank, -33 dB rms).
NEXT: (g) the MW2 Washington DC radio feel was not put into the feeds' sounds this round (RADIO's lane holds the last transmissions);
UI 5's 161 (the end screen's four on the phone) still the coordinator's call.
[bb Battle Brothers' main menu is a few words over one picture; ours is four words over a different camera each time, placed by it.]
[analog horror: a monitor cycling cameras nobody watches through a whole day, the sync rolling into snow, a dropped camcorder at dawn
still recording, a wolf in a trail camera's flash.]

UI (ui-5, the first minute and the phone's fixes): 11/3 -- [the loading screen] + [the start screen] BUILT, NOT YET SEEN; [the third
job], [the left phone], [the blood on the words], [the reload leg] BUILT, NOT YET SEEN; [the end screen on the phone] WALKED, NOT DONE
(asks 338, 340, 154, 133(a), 129, 282; 161 handed back; BUILD 11/3zzo - THE CAMERA'S OWN FEED), IN THE DEMO, two VOTE cards.
Record records/BOHEMIA_UI_THE_FIRST_MINUTE_AND_THE_PHONE_FIXES_11_3_26.md; proof records/target/ui_the_first_minute_feeds/ (6 sheets).
- THE FEED (slices/bohemia_ui_crashbox.js, UI's): the machine is gone (his 11/2 NO); the loading screen is a camera's own feed under
  his letters (rule 66a), the load read by the camera (A battery, B signal + the tear, C miles to Vegas), REC on the beat. Three
  feeds made through the master rig: tools/bohemia_ui_the_first_minute_feeds.py (Blender bpy 4.2: <venv>/bin/python ... A|B|C <dir>,
  then --post into slices/crashbox/feed_<x>.webp, 12 keys a bar, 390 x 520); sounds tools/bohemia_ui_the_first_minute_sounds.py
  (CC0 via ESC-50; two diesel stems frozen into the bank). D.feed.pick = 'b' in slices/crashbox/crashbox.json; localStorage
  bohemia.title.feed is a probe's switch only. The title's own player (TITLEWIND) plays the pick's mp3 in place of the bare wind.
- THE START SCREEN: the picks are the camera's own buttons (black plastic lit from above, the picked lit gold edge to edge); the
  feed's small window by the load's row; the strip snaps to the picked origin the first time it is on the glass (it read empty).
- THE PHONE (slices/bohemia_phone.js): up to three job cards (a rescue past the two contracts), names wrap on whole words; behind
  the settings card the phone is gone (a flip shows it 1.5 s). THE BLOOD (slices/bohemia_ui_materials.js bloodHoles): one wipe
  a block of words. THE PHONE gate's RELOAD leg takes a shooter's turn.
NEXT: 161 (the end screen's four on the phone) is a phone face plus seven lanes' checkers re-aimed (the spoils, the aftermath, the
fight opens the fight, scrap is tape, the wagon and the six, his map, bosses act one): the coordinator's call. His A/B/C on the
loading card; if A or C, set feed.pick. THE START SCREEN'S LOOK gate throws before its first leg on main (its own fix, not mine).
[bb Battle Brothers' loading screen is one painted scene of the company with a line under it; ours is the valley seen through one
camera, the line the camera's own readout.]
[analog horror: the medium is the horror: a security camera's grey at six pictures a second, a tape's tear at the foot, a sodium
lamp dying twice a bar, the siren a mile off once; nothing added on top.]

UI (ui-4, nothing pops): 11/2 LATEST -- [nothing pops] + [voices clear of the phone] + [the tooltips] SHIPPED, BUILT, NOT YET SEEN
(asks 322, 312, and 327/339 the feed one post at a time; rules 324, 329 and 316's tooltip note; BUILD 11/3zw - NOTHING POPS), IN THE DEMO. Record
records/BOHEMIA_UI_NOTHING_POPS_VOICES_CLEAR_TOOLTIPS_11_2_26.md; proof records/target/ui_nothing_pops/ (3 sheets).
- slices/bohemia_ui_nothing_pops.js (BohemiaPops, UI's): loaded once in the shell's head, arms every page from the top (MOTION's way).
  POPS table (one row a pop-up, by the page's own id): IN = three held poses on the music's grid, growing out of the finger (250 ms);
  OUT = a copy as it stood shrinks over two holds while the real one is gone at once; a tap finishes it; MOTION's LESS = a fade.
  A redraw (out and back in one go) moves nothing. VOICES: every speaking box fitted clear of BOH_PHONE_RECT by CSS 'translate' alone,
  8 pt off the phone, never measured mid-grow. TOOLTIPS: a 480 ms hold (a mouse 650 ms) on a stat, perk, trait, item, the fight's
  bare ground, a town building, the bar, the phone's apps and fight buttons, or anything with data-tip; the lift is not a press (the
  town's own cancel, the fight's own 'held'). Lines: WORDS' files + records/target/ui/BOHEMIA_TIPS.json (42 new, draft:true).
- alpha hook (1 line): the script tag after bohemia_motion.js. Probe switch for a BEFORE picture: BohemiaPops.off(true) (never set by the game).
- the phone's face (rule 329): ONE post at a time, up 1.2 s + 0.25 s a word in whole beats, then it sinks out (stripPaint);
  the numbers in slices/phone/feed_read.json (11/3zy - ONE POST AT A TIME).
- gate: gates/nothing_pops_voices_clear_gate.js (in the suite). Road card under the phone 5,955 sq pt -> 0 (up 60); kills card 7,860 -> 0.
NEXT: the stall's trade goods and the map's towns get lines (data-tip); the fight's statuses when COMBAT draws them; WORDS on the drafts;
MOTION may swap any POPS row for a true morph (the row is the one place to take it out).
[bb Battle Brothers' tooltip: the name and a line or two beside the pointer, never over the thing; ours is a held finger, kept off the phone.]
[analog horror: every pop-up a hand-cut tin plate shot on twos, growing out of the finger like a stick puppet, leaving as a cut-out copy.]

UI (ui-3, the first minute): 11/2 LATEST -- [the loading screen] + [the start screen] + [the tutorial toggle] SHIPPED, BUILT, NOT YET SEEN
(asks 280, 261, 262; BUILD 11/3zi - THE FIRST MINUTE, a69279ba), IN THE DEMO, three VOTE cards. Record records/BOHEMIA_UI_THE_FIRST_MINUTE_11_2_26.md.
- slices/bohemia_ui_crashbox.js (BohemiaCrashbox, UI's): THE MACHINE on the title (plywood, rusty tin, a cracked tube, DIRECTION's
  master-rig robot idling 12 keys a bar, the needle on #loadpct's own count, 4 bulbs a beat, the newest #loadgl line on tape; the
  wrongness 'loading_it_comes_closer' from a save's day 3, one load in four); THE PICKS re-ordered and on tin (name, ONE big origin
  card with arrows and swipe-to-pick, fights/shelves/map plates, the picked one's line in its heading); HINTS ON/OFF (bohemia.hints):
  the veteran's one line a place (map 8 s, town 3 s, camp 3 s quiet) with his face and mouth beside the phone, and the fight's
  teach:false when OFF; the title folds into the picks (3 holds), BEGIN switches the door off like an old set (4 holds, over the
  barber). Numbers and draft words: slices/crashbox/crashbox.json. Robot sheets slices/crashbox/robot_idle_s_120/_52.png.
- alpha hooks (3 lines): the script tag; __THE_DOOR_SWITCHES_OFF__ (the lift handed to doorOut); nfOpts teach:false. RUN's logic untouched.
NEXT: a hint for YOUR COMPANY and the first job if he wants more; WORDS on the drafts; a bigger robot sheet for a monitor.
[bb Battle Brothers' new campaign: the company name comes prepared with a reroll, the origin is one picture and its text at a time, the picked difficulty's line is shown under it.]
[analog horror: the loading box is a dead utility's machine a child taped back together; once in a while the tube shows a desert, and something in it is closer than last time.]

UI (ui-phone-fight): 11/2 LATEST -- [the phone runs the fight] + [the beat is seen] SHIPPED, BUILT, NOT YET SEEN (asks 257, 265, 270, 275;
BUILD 11/2y - THE PHONE RUNS THE FIGHT), IN THE GAME, no card. Record records/BOHEMIA_THE_PHONE_RUNS_THE_FIGHT_11_2_26.md.
- slices/bohemia_phone.js: the turn strip and the man's card on the phone (P.man, P.crew, P.card, P.peek read the fight's own HUD and
  drawer); the fight's #top and #bot translate off the glass with the phone up (hudEdges reads 0, 0); the pulse on the fight's own
  SONG clock (P.beat): the screen's rim, a heart-monitor trace in the status line, #bohbeat over the board under the phone.
- gates: the_phone_gate.js +4 legs (bar off, crew on the phone, one tap a sheet, the pulse vs beatPh); the_days_once_gate.js re-aimed.
NEXT: a held finger on STRIKE (the weapon's card) from the phone; the beat's Bluetooth calibration (blind spot C); sweep the other
screens for state changes that vanish instead of morph (ask 257).
