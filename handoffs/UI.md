# UI (the screens and the phone) -- the handoff block (written only by UI, newest first)

UI (ui-9, smaller never pages + the UI's size): 11/7 LATEST -- [smaller, never pages] + [the UI's size] BUILT, NOT YET SEEN (rule 402 amended,
ask line 481; rule 403, ask line 445, the coordinator's routine; BUILD 11/7i - SMALLER, NEVER PAGES), IN THE DEMO, VOTE card
ui9-smaller-never-pages-11-7 (STAND-IN). Corrects UI 8's 11/6g block below: its pager and tabs are OUT.
Record records/BOHEMIA_UI9_SMALLER_NEVER_PAGES_11_7_26.md.
- THE MACHINE (slices/bohemia_ui_no_scroll.js, BohemiaNoScroll, UI's, rewritten): no pages, no tabs. fit(box, {levels, before}) dresses a box
  dense (class ns-d1 on the host) and steps ns-d2, ns-d3 while it still runs past the glass; a box that cannot fit is left locked and said in
  state(box).over (state().pages is always 1). reveal() says yes; off(true) is the checker's switch (all dense looks off). FLOOR 11, TAP 44.
  Planted in the town's and the crew's frames from the shell every 700 ms, as UI 8's was.
- THE HALL: a man is a ROW (grid: face / name and trade / ns-hl: rare, ceiling, trait, gun / his eight in eight equal columns, one x per stat
  down the list / HIRE + price + night).
  hallRows() moves .hrare .hceil .htrait .hgun into div.ns-hl inside .hiret and wraps HIRE's money words in spans (textContent unchanged);
  his figure, trait words, why-pricier and quote are the row's data-tip. Step 2: face spans the row, reach and trait numbers to the tip
  (rows 50 px); step 3 on a short glass: three columns, his eight in two lines of four. Every class and data attribute the gates read kept.
- THE SHOPS: 44 px cells (icon + price), the name on the piece's card; the strip's man box one height while he browses (manHeight(), --ns-man-h,
  from the company's faces; rule 250); shopCols() wraps ns-shelf / ns-bag on every open; on its side
  shelf | bag | strip side by side (140 / 1fr / 172). The strip's faces wrap (44 wide), never slide.
- THE SETTINGS CARD: one grid (minmax 150), a row of 3+ choices spans two places (ns-span, set by mark()), #setphone is display:contents,
  step 2 packs with grid-auto-flow dense. The watcher fires only when the card OPENS (a class watcher that reacted to its own classes
  hung the page: measured, fixed).
- THE CREW SCREEN (BOHEMIA_ROSTER_SCREEN.html): fitBody() on body, steps 1-4 (his eight ALWAYS one column, rule 247(c); step 4 placeStats()
  stands them in the doll's open middle at its foot, the camp doll's middle read off its grid's second column); every word >= 11; KEPT row __THE_WHOLE_COMPANY_ON_THE_GLASS__ (the line
  holds 18, the company 20: two men were drawn nowhere): every living man off the line and not laid up, man:kept:i (tap picks, a drag onto
  the line puts him in, the man there comes down). On a short glass at step 2 KEPT/LAID UP stand right of the line in columns; step 3 the
  stash's buttons stand beside the bag (74 px), #said speaks over the card's foot.
- THE ORIGINS (bohemia_ui_crashbox.js __SMALLER_NEVER_PAGES__): 15 plates (5 across upright, 4 on its side), the picked one's name and
  difficulty in the heading's .cbxcap, its words in #cbxorgfacts; turnWire, originNav, stepOrigin and the arrows' look are gone. The frozen
  menu (rule 358, F2's block) untouched: THE LOADING MENU IS FROZEN 10/0.
- THE UI'S SIZE (rule 403): SIZES SMALL / NORMAL / LARGE / LARGEST in bohemia.uisize.v1 (BohemiaNoScroll.size(n)); the UI SIZE row
  (#setuirow, #setui [data-size]) replaces the TEXT row (.ns-gone; carryText() moves an old text size over once). cut() tries zooms
  from his size down to 1 in 0.05 steps (zoomsFor), each with the density steps (SMALL starts at step 2), the first that fits wins;
  opts.zoomEl (the town: #sbody, never the absolutely placed sheet, whose own width would grow past the glass), opts.sized (the card
  sets its width and max-height in its own units), opts.cap (a small sheet under half the glass at every size); fitBody zooms the
  crew's body; picksFit (#newco) and chromeFit (#bohphone, #bmtb) in the shell, each only while it stays on the glass. A fit runs
  only when the shape changes (B.sig: size, glass, the pieces, the building via opts.key): a card fitted 40 times a second kept
  its opening animation pending at LARGEST (measured, fixed). Frames refit on the storage event and on applySize's visit.
- GATES: gates/scrolling_is_illegal_gate.js RE-AIMED (lists whole on the glass at once, no pager, the floors, small sheets under half the glass;
  N6 twenty men and 36, N8 the fullest hall, N9 every leg at all four sizes, N4b the UI SIZE row kept; M bites on a planted strip, PAGE 1 OF 3, a 9 px word, a 30 px press, a 70% sheet). Results in
  the record. tools/bohemia_no_scroll.js: SMALL_SRC / small() / faults() for any lane (two named tap exceptions: a stat's row; the line's
  nine across a glass under 412, >= 36 wide, 44 tall). Re-aimed one line each: settings_gate, settings_in_our_materials_gate,
  the_best_recruit_at_the_top_gate, the_shop_taps_gate.
NEXT: RUN FIVE's spoils screen is still OWED (printed by the gate, not counted). The phone and the bar grow only where they stay on the glass (on a
phone held up they mostly stay at NORMAL); their own layouts (bohemia_phone.js, the bar) could make room for a true LARGEST. The town's hall row hides the whole figure (the card's
figure is a held finger away): if he wants the figure on the row, it is a 34 x 44 canvas in the face's place.
[bb Battle Brothers: the hiring list shows every recruit with his face and price; the market and the stash are fixed grids of small cells;
the options are one panel; the company screen keeps a reserve row under the formation.]
[analog horror: the hall's list reads like a parole board's clipboard, a row a man, a photo stapled to each.]

UI (ui-8, nothing scrolls + the weapon card): 11/6 LATEST -- [scrolling is illegal] + [the weapon card] BUILT, NOT YET SEEN (rules 402 and
397, ask lines 444 and 437; BUILD 11/6g - NOTHING SCROLLS), IN THE DEMO. Record records/BOHEMIA_UI8_NOTHING_SCROLLS_AND_THE_WEAPON_CARD_11_6_26.md.
- THE PAGER (slices/bohemia_ui_no_scroll.js, BohemiaNoScroll, UI's): page(box, {keep, key, atoms, barEnd, barSibling, blank}) locks a box and
  cuts what it holds into pages (atoms: whole blocks, a container taller than 55% of the box is cut into its children; a heading never ends a
  page; trailing pages of empty slots dropped; an atom too tall alone gets zoom, never under .75). The strip: prev, numbers (8 at most),
  next, PAGE n OF m (a narrow strip drops the words, then the numbers). A swipe across turns a page. element.scrollIntoView() inside a
  paged box turns to its page (patched in that frame). Re-cut on childList changes and resize; a new key starts on page 1.
  BohemiaNoScroll.off(true) is a checker's switch only. Loaded once in the shell; plant() puts itself AND the weapon card into the
  town's, the crew's and the spoils' frames every 700 ms (the town's file untouched but one data attribute).
- THE SETTINGS CARD: TABS SOUND / SCREEN / PLAY / GAME by the control ids (TABS); an unnamed row goes to PLAY. A short wide glass lays the
  card in two columns, the bar and BACK TO THE GAME on one row. The brightness picture is kept under its row (the phone's box landed
  between them).
- THE TOWN: #sheet paged (key: BohemiaSettlement.state.open; keep #close, #shopstrip, .hsort, and .who on a short wide glass). The hall's
  sheet is the glass's height. Short wide glass: UI's own two columns (bohemia_ui_materials SETTLE_CSS) narrowed to a 200 px keeper column
  with the page strip under him, a recruit's stats beside his lines, the shop's strip absolute in a 300 px right column with the page strip
  under it (the sheet floored at the strip's height, --ns-strip-h).
- THE ORIGINS (bohemia_ui_crashbox.js turnWire): the strip overflow hidden, the out cards hidden whole; swipe, wheel notch, arrow = one card.
- THE CREW SCREEN (BOHEMIA_ROSTER_SCREEN.html loads both files): crewFit() sizes #bag to what is left of the glass and pages it (the strip
  is the bag's next sibling); a wide glass zooms #man to fit (floor .66); upright, when no stash row fits, #man gives up height (floor .8).
- THE WEAPON CARD (slices/bohemia_ui_weapon_card.js, BohemiaWeaponCard): a click on data-item="weapon:<id>" (the shop's iconTile) or a kit
  icon's data-id (bohemia_ui_materials itemIcon now stamps it) shows #bwcard: every blow in the fight's words (name in capitals, STRIKE on the
  first, RELOAD), AP, BREATH, REACH (ours.melee_reach, the whip's, a ranged row's range; a pistol rides ours.pistol_shot's row and the light
  crossbow's reload, as the fight's weaponRow), a plain line from PHRASES (draft:true for WORDS), NO SPECIAL ABILITY when one blow. It stands
  in the half the finger is not in; the next touch hides it; the tap still does its own work.
- GATES: gates/scrolling_is_illegal_gate.js (new; 24/0 at the first full run, the one red fixed and its leg 8/0; re-run on the merged tree
  this round), gates/a_weapon_tells_you_what_it_can_do_gate.js (new; W1-W3 and M 5/0, W4 the shop re-aimed to open the town itself).
  tools/bohemia_no_scroll.js is the sweep any lane can call (NS.sweepAll(page), NS.crimes(rows)).
NEXT (named): THE END OF THE FIGHT (RUN FIVE's spoils/receipt screen) ran 1.83 screens upright, 1.85 on its side, 43 presses below the glass:
the gate prints it OWED; BohemiaNoScroll.page() is ready for RUN FIVE to call on its box. The road fight could not be started by a script
this round (the map's meet-and-dive); the fight's page alone fits. Rule 403 (the UI's size) should reuse the pager: at a larger size the
same boxes simply get more pages. The hall at full height covers the town picture while hiring (Battle Brothers' own is a whole screen);
RUN FIVE may want the picture behind it. Gates that tap a hire button or a bag slot by scrollIntoViewIfNeeded must call
BohemiaNoScroll.reveal(el) first (the shop gate's S6 scrolls the sheet to the bag: it turns pages now).
[bb Battle Brothers: no screen scrolls; the options are four tabs; the stash and the market are fixed grids; an item's tooltip lists each
skill with its AP, fatigue and a line.]
[analog horror: a page turns like a monitor's channel switch, one hold of black; a weapon's card is a pawn ticket stapled to it.]

UI (ui-7, tap a quest on the phone): 11/3 LATEST -- [tap a quest, your people go: the phone's half] BUILT, NOT YET SEEN (rule 376, ask
line 404; BUILD 11/3zzzzaz - TAP A QUEST ON THE PHONE, code 3b77e4afc + f5ac27e5a, on main 2a3511db0; LIVE: pages run 4265 SUCCESS for 2a3511db0), IN THE DEMO, VOTE card
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
