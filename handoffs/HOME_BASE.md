HOME BASE 4 -> A FRESH HOME BASE (11/27 04:30 UTC): HANDOFF READY. HOME BASE 4 carried three builds this session (11/26q THE GRINDER,
ON PURPOSE; 11/26zf THE CAMERAS ON PATROL; 11/27a WHAT HE HAS SITS IN THE GROUND) and its context is long; the routine 'HOME BASE 4:
customize his place' (rule 347(c)) is a new feature and goes to a fresh session whole, research first.

## THE NEXT JOB: RULE 347(c), EVERYTHING AT HIS PLACE CUSTOMIZABLE, EASY, BY TAPPING (the routine, 11/27 04:30 UTC)
Paolo 11/3: 'literally every thing in our custom settlement can be customized... super easy to customize... that pseudo mayor vibe...
a Stardew Valley vibe' (rules 347(c), 343). The list: ITS NAME, WHAT EACH BUILDING IS MADE OF AND PAINTED, ITS SIGNS, WHERE THINGS STAND,
WHO LIVES THERE AND THEIR JOBS; upright and sideways, never choppy (480(c)); research first.
1. RESEARCH FIRST (a cited record, rules 'how did Battle Brothers do it' and 343's Stardew feel; Stardew is named for this, Battle
   Brothers for the company): Stardew Valley: naming the farm at the start, Robin's shop (build, MOVE a building: pick it, then tap
   where), the 1.5 paint bucket on a building (a few colour regions), signs you write on, the mobile version's taps; Battle Brothers:
   the company's name and banner (picked at the start, changed in the company screen), a man's name and title edited by tapping it,
   the retinue. What keeps both EASY: few choices, each a tap, seen at once on the thing itself, undoable.
2. WHAT EXISTS TO BUILD ON (slices/BOHEMIA_SETTLEMENT_SCREEN.html unless said): NAME IT on the desk (homePlaceRows' 'NAME IT', .hname,
   posts BOHEMIA_HOME_RENAME -> slices/BOHEMIA_CITY_WORLD.html homeRename -> BohemiaHome.rename); the lot he picks for the next build
   (S.homePick, buildFreeLot, homeLotsHeld); CLEAR a lot (homeClear); his own buildings' lots (engine/bohemia_home.js buildPlace,
   placeLots; the map's homePlaceLot, homeUnclash); the residents (S.home.residents, engine addResident) and who works a build
   (S.home.workers, the morning) and his men at his buildings (homeWorkers, HOME_WORK); the station (__THE_STATION__: a tap on a lot
   zooms the camera onto it and lays the sheet for the way the phone is held: the natural place for each choice is that sheet).
3. WHAT THE FOOTAGE CAN AND CANNOT SHOW, said plainly before building: the pieces are pre-rendered per camera, shape and lot of their
   row (tools/bohemia_home_settlement_pipeline_11_3_26.py; Blender is not on this box, pip install bpy would be the way), at night under
   sodium in the footage's grey-green, so: WHERE THINGS STAND is cheap (a piece has a picture for every lot of its row: MOVE = pick the
   thing in its station, the free lots of its row light, tap one; keep homeUnclash honest); ITS NAME and ITS SIGNS can be drawn on the
   footage (a plate on a lot or the gate, his words in the camera's own pixel font, like the OSD); WHO LIVES THERE AND THEIR JOBS is a
   tap on a person on the footage (openPerson) -> 'WORKS AT' (his buildings, the builds that take a man); WHAT IT IS MADE OF AND PAINTED
   reads on night CCTV only as light or dark: a paint choice can be kept on the record and shown as a value on the footage now, the
   colour wherever his place is seen by day; materials (tin, block, wood) need the pipeline's variants. Decide and say which.
4. Gates: YOUR PLACE, PLANTED (gates/home_base_gate.js, F1-F12) and ONCE, EVERYWHERE stay green; each new choice gets its leg (a real
   tap both ways, kept across a reload) and its planted red. A VOTE card that shows each choice made, before and after, both ways.

HOME BASE 4 (session_01GKDyuuxd1n5GC5qbBwv9B6): 11/27 LATEST -- BUILD 11/27a - WHAT HE HAS SITS IN THE GROUND, BUILT, NOT YET
SEEN (the routine 'HOME BASE 4: rule 482'; rules 482, 479(a)(b); ask rows 735, 721). Record
records/BOHEMIA_HOME_BASE_WHAT_HE_HAS_SITS_IN_THE_GROUND_11_27_26.md. VOTE card home-base-what-he-has-sits-in-the-ground-11-27.
- The bosses' things with no piece (homeFeedPaint's t.pic branch): a thing's size, contact and cast shadow (hfShade); DRAWN.grounded/H.
- Working pictures by homeFeedWorks (HOME_AT, S.home.workers, HF_USED from homeUsed after GRIND/PRESS/TRAIN); DRAWN.states.
- GRIND: HF_GOING, one bundle a beat. Closing a sheet: HST.outAt, the camera out at tau 110 ms.
- Gate F12; read hook __HOME_FEED_USED.
- NEXT (rule 482): the door's first paint (warm cam 1 while the map travels there); BUILD's desk and a prize's own door laid both ways
  like the stations; the bosses' things could get pieces of their own in the 11/3 pipeline (Blender is not on this box).

HOME BASE 4 (session_01GKDyuuxd1n5GC5qbBwv9B6): 11/26 LATEST -- BUILD 11/26zf - THE CAMERAS ON PATROL, BUILT, NOT YET SEEN (the routine
'HOME BASE 4: rule 482 next'; rules 482, 480(b), 479(a)(b), 441; ask rows 735, 721). Record records/BOHEMIA_HOME_BASE_THE_CAMERAS_ON_PATROL_11_26_26.md.
VOTE card home-base-the-cameras-on-patrol-11-26.
- THE PATROL (__THE_CAMERAS_ON_PATROL__ in the screen): homeTourTarget (from homeStationTarget when no station): 3.5 s wide, then a slow
  push (tau 900 ms) to HTOUR.pick, out 3.2 s before the cut; homeTourPick's order: his men at work, the pile, the residents, his own
  buildings then the tallest. The view follows the open area (FIT.open). Taps map through HF.tapV (the view at pointerdown).
  homeTourStop (from __HOME_FEED_AT / __HOME_FEED_PEOPLE, so the walk-up and every gate get the whole block) holds it off 15 s.
  Read hooks: __HOME_FEED_TOUR; for gates and cards: __HOME_FEED_TOUR_AT(ms) (the round's clock).
- HIS PEOPLE: homeFeedPaint draws each person with BohemiaIdles.activity (HOME_WORK act) or .frame, else the still; hfLit makes the
  IR-pale picture and its dark edge once per size; a worker faces NW/NE up his lot (homeFeedPeople).
- ONE LOT, ONE THING: the screen's homeLotsHeld/buildFreeLot; the map's homeUnclash (from homeState). __HOME_FREE_LOT read hook.
- GATES: YOUR PLACE, PLANTED F10, F11 (F8 starts the round fresh); ONCE, EVERYWHERE re-run.
- NEXT (rule 482): the door's first paint (warm cam 1 while the map travels to his place); BUILD's desk and a prize's own door laid
  both ways like the stations; if he wants it, a closer render (the 11/3 pipeline; Blender is not on this box, pip install bpy).

HOME BASE 4 (session_01GKDyuuxd1n5GC5qbBwv9B6): 11/26 LATEST -- BUILD 11/26q - THE GRINDER, ON PURPOSE, BUILT, NOT YET SEEN (rule 481(b),
ask row 733; rule 480(c), ask row 729; rule 479(c), ask row 721). Record records/BOHEMIA_HOME_BASE_THE_GRINDER_ON_PURPOSE_11_26_26.md.
VOTE card home-base-the-grinder-on-purpose-11-26 (redoOf home-base-the-grinder-11-22; before and now, both ways).

## WHAT THIS ROUND BUILT (HOME BASE 3's 'NEXT JOB, RULE 480' list is DONE, all three)
1. THE STATION (481(b), his NO 'sideways like you didn't even try'): slices/BOHEMIA_SETTLEMENT_SCREEN.html __THE_STATION__ (after the
   feed's code). A sheet of his place's (S.open h<n>) is a station: homeStationLay (wrapped onto placeChrome and hide) lays the sheet
   for the glass: SIDEWAYS (#sheet.hstation.hside, .hsl when the phone sits left) a column the glass tall in the phone's column,
   36 percent wide (280 to 380 px), the buttons at its bottom (margin-top:auto over UI's ns-d1 block, by specificity); UPRIGHT the
   sheet at the bottom, at most 52 percent. HST.R is what the sheet leaves; homeStationTarget frames the lot (its tap box, the
   picture's height, its sides held to the lot and a third; framed once per camera, way and lot) at most 3x the plain picture;
   homeStationView glides there (exp, 75 ms) and back. The camera's text (homeFeedOsd) is drawn on its own canvas at the footage's
   pixel: ZOOM n.nX, the brackets, the thing's name. Taps and __HOME_FEED_AT go through the view (homeFeedV). The waiting dead lie
   on the grinder's lot (homeFeedPile, one tarp bundle per body, six at most; HF.pile read when the grinder's sheet opens and every
   2.5 s). Read hooks: window.__HOME_STATION, __HOME_FEED_VIEW (z, paints, shows), __HOME_FEED_WARM; for the gate only:
   __HOME_FEED_NO_STATION, __HOME_FEED_ALWAYS.
2. THE SPECKS: every piece picture had a speck under it (a black puddle in the street) and a cut down to it; the pipeline's
   _no_specks (tools/bohemia_home_settlement_pipeline_11_3_26.py, in post and post_add) cleans and cuts; `specks` cleaned the 2,232
   made. A new piece: render, post_add, and it comes out clean. The dark puddles left in the street are the fan palm's shadow (11/3).
3. NEVER CHOPPY at his place (480(c)): the footage paints six times a second (homeFeedPaint when its frame turns or HF.dirty; the
   glass laid by homeFeedShow then or while the camera moves); the graded people cached (hfGraded); the town RESTS under the footage
   (loop: __THE_TOWN_RESTS_UNDER_HIS_CAMERAS__, folkList and busyHeard four times a second); the other cameras decoded while idle
   (homeFeedWarm). Measured with tools/bohemia_home_base_his_place_on_a_slow_phone_11_26_26.js (CPU 4x): see the record's table.
   NOT HIS PLACE'S, ROUTED (ask row 729): the job planner and the phone's board app (JOBS 2), the idles' warm-up (PLUMBER 8),
   nothing_pops (UI FIVE).
4. ONCE, EVERYWHERE (479(c)): gates/once_everywhere_gate.js (registered): the map at eight zooms walking and camped, the fourteen
   settlements and his place, the camp, both ways; no repeat found. Read and routed to BOSSES: THE POT's COOK verb leaves its fire
   on the block every use, painted for good (slices/bohemia_bosses.js S.marks).
GATES: YOUR PLACE, PLANTED 238/0 (F9 new, both ways); HOME SETTLEMENT 15/0 (S8 new); ONCE, EVERYWHERE 6/0 each way; the demo cut
exact. Full suite unmeasured by this lane (rule 13).

## THE NEXT JOB (rule 482: improve what is there)
1. The door into his place still paints his place's pictures at the door (a task about 220 to 460 ms at 4x): warm cam 1's plates
   and his pieces while the map's travel to his place is under way (the town frame is reused; homeFeedWarm can run before
   homeFeedSync turns the feed on).
2. The other sheets at his place that are not stations: BUILD (the desk) and a prize's own door (THE POT's kitchen opens its own
   shop): laid both ways on purpose the same way (the desk's two columns sideways, the plan short).
3. If he says the zoomed footage is too blocky: the pieces are PS1 size by his yes (11/3); a closer camera would need the 11/3
   pipeline (Blender is not on this box; pip install bpy is the way).

HOME BASE 3 (session_01GKDyutkCNC5cSDNauAG37o): 11/22 LATEST -- BUILD 11/22zm - THE GRINDER (8d48346ba) (rule 469, ask row 638) and the cameras' steps
2 to 4 (rule 466(a), ask row 663): the skewed board's code in the graveyard, the cameras' hum ASKED of SOUNDS (ask row 720), and THE OVERFLOW
(step 4, BUILD 11/22zt, a21c89ea6: a piece whose row is full stands on a lot behind it, its own picture). Record records/BOHEMIA_HOME_BASE_THE_GRINDER_11_22_26.md. VOTE
card home-base-the-grinder-11-22.

## RULE 479 (BUILD 11/22zz, 82b285056): ONCE AND IN THE GROUND
- Built: his men in the footage stand on their own shadows; one key is one thing (homeFeedSlots dedupes); gate F8 (every camera, each
  thing and person once; window.__HOME_FEED_DRAWN). Record records/BOHEMIA_HOME_BASE_ONCE_AND_IN_THE_GROUND_11_22_26.md.
- OWED: rule 479's VOTE card with a before and after (a man at his building in the footage without and with his shadow), not made
  this round (HOME BASE 3's context ran out); tools/bohemia_home_base_the_grinder_card_11_22_26.js drives to the footage.
- OPEN: THE TWENTY COOKS were not reproduced (the map at eight zooms on two grounds, the camp, his three cameras). Row 721 asks for the
  screen; the moment it comes, find it there. Not yet built for (a): the pieces in the footage already cast their own rendered shadows
  (the 11/3 pipeline's shadow catcher); a lane comparing them to COOK SIX's valley buildings may still find the edge too clean.

## THE NEXT JOB: 466(a) IS DONE (BUILD 11/22zy, fe3a7fa6c: the front five drawn on the rows behind too)
1. Nothing of HOME BASE's is open on the asks list but what he has not answered: the record's DECIDED HERE (his own dead ground or not;
   the -10 a town that finds out; the shakes never him), one line each if he speaks. SOUNDS holds row 720 (the cameras' hum).
2. A new piece for his place: add it to the pipeline (PIECES, its row), render `piece <id>` and `piece <id> --behind-only`, post_add both.

## THE GRINDER, WHERE IT LIVES (for any lane)
- engine/bohemia_grinder.js (BohemiaGrinder, pure): bring (the carry, the heat), pileNow, grind (one tap, the bad cut), reconcile (his
  sausage inside the one FOOD count, scaled down as the count goes down), sale (people sold, found out, a hungry town never asks), bought
  (the careless can), night (a bad night marks a man, never him), showing (a mark shows when its years pass: in a later act), townsShaking.
- records/target/bb/home_base.json: places.grinder (the build), places.words (grinder, grind, ground, nobody, found), story.lines.shakes,
  grinder{} (every number with its source; TUNING's to move).
- slices/BOHEMIA_CITY_WORLD.html __THE_GRINDER__ (after __HIS_OWN_BUILDINGS__): the fight's end (grindFightHome, BOHEMIA_CITY_COMBAT_END),
  a kill taken (read off BohemiaCarcass' state and taken list every 0.7 s; WORLD 12's file untouched), homeGrind, the night (crewBillNight
  wrapped), the stall's messages (BOHEMIA_SETTLEMENT buy, BOHEMIA_GRINDER_SOLD), grindShows every 3 s. Storage bohemia.grinder.v1 (by seed).
  BohemiaHomeMap.grind / grinder / grinderState / grinderShows / grinderFight.
- slices/BOHEMIA_SETTLEMENT_SCREEN.html: homePlaceSheet's grinder branch (one line, one button), HOME_WORK.grinder (a man at it),
  HF_PIECE.place.grinder, __THE_GRINDER__ (after __HIS_CAMERAS_AS_PROMISED__: stallDo wrapped for food sold; BOHEMIA_GRINDER_FOUND moves
  this town's bar by relMove and the strip says the word). The stall's functions live inside the screen's closure: a gate sells by real
  taps on '#sbody .stline[data-key="food"] .sb[data-side="sell"]' (two quick taps), never by calling stallTap.
- The piece: tools/bohemia_home_base_his_pieces_11_21_26.py grinder (built and working; under the middle row's 3.8 m: 3.61).
- FOR COMBAT / CHARACTER: a man with the shakes is BohemiaHomeMap.grinderState().shown[name] (marks in .marks with the act and the years);
  a tremor on his dial or his walk is theirs to add, never built here.

## THE CAMERAS NOW (rule 466(a))
- His place IS the 11/3 footage (__HIS_CAMERAS_AS_PROMISED__). The skewed board's code is OUT (graveyard/home_base_the_skewed_board_11_17_26/
  screen_the_skewed_board.js.txt); what stayed of __HIS_PLACE_SEEN_AS_HE_WILL_SEE_IT__: the door under the finger (the hitAt wrap), his men
  at his buildings on the footage (homeWorkers, HOME_WORK, the crewTown filter). Gate F1 holds the board dead.
- THE OVERFLOW (__THE_OVERFLOW__ in the screen, BUILD 11/22zt): homeFeedRowsOf(pid) is the manifest's rows for a piece (its own first);
  every piece takes its own row first, then the leftovers a free lot of a row behind that has their picture (HF.over, __HOME_FEED.over);
  the desk's row-full reads every row the piece has pictures for. Rendered behind: the seven middle pieces on the back lots, the front five
  on the middle and back (BUILD 11/22zy).
- THE HUM: ASKED (ask row 720): crashbox/feed_b.mp3, loop, 0.25, while window.__HOME_FEED.on in his place's town screen (the 11/3 page
  BOHEMIA_YOUR_SETTLEMENT.html's own hum(), after a tap).

---- HOME BASE 2, as it stood (kept: its systems map is still true) ----
HOME BASE 2 (home-base-01gkdyuv5w1u): 11/21 LATEST -- BUILD 11/21zc - HIS CAMERAS AS PROMISED (rule 466(a), ask row 663), after 11/21u THE
CORK BOARD IS DEAD (466(b), live run 4716) and 11/21s IT STARTS BARE (445(b), live run 4710). Records
records/BOHEMIA_HOME_BASE_HIS_CAMERAS_AS_PROMISED_11_21_26.md, ..._THE_CORK_BOARD_IS_DEAD_..., ..._IT_STARTS_BARE_... A FRESH HOME BASE
SHOULD TAKE THE NEXT JOB (context near full, rule 461(f)).

## HOME BASE 2'S NEXT JOB (DONE 11/22 by HOME BASE 3: 1 the cleanup, 2 the sound asked, 3 the overflow; see the block above)
1. The skewed board is OFF for good (homeCamOn() false wherever VAR.bare) but its code is inert in slices/BOHEMIA_SETTLEMENT_SCREEN.html:
   __HIS_PLACE_SEEN_AS_HE_WILL_SEE_IT__ (HLENS, homeLens*, the lens's hitAt/where/inPad wrappers, homeDrawEmpty/homeDrawLots chalk and
   plate), __HIS_PLACE_THROUGH_ITS_CAMERAS__ (HCAM). Take it out into graveyard/ (post-mortem written: POSTMORTEM_HOME_BASE_THE_SKEWED_
   BOARD_11_21_26.txt), keeping what the feed and the town screen still use: homeWorkers, HOME_WORK, the crewTown filter, homeLotFoot
   (homeAllLots), homeKitBox. Gate F1 holds it dead; run YOUR PLACE, PLANTED both ways after.
2. A camera sound for his feeds (the 11/3 page played crashbox/feed_b.mp3, the starred night feed's hum; SOUNDS owns sound: ask, do not
   make).
3. The overflow: things put on his place past four in a row by a boss or a job are not drawn (none can today); if a lane adds one, it
   needs a lot of its row or a render for the row behind.

## HOW HIS PLACE IS SHOWN NOW (__HIS_CAMERAS_AS_PROMISED__, after __IT_STARTS_BARE__)
The 11/3 manifest (records/target/home_settlement/manifest.json, fetched as ../records/target/...): plates per camera/shape/frame, 17
pieces per camera/shape/lot of their row, tap_px per lot, order far to near, near (the lens layer). His things (homeThingsHere) go on
the lots of their piece's row by the order he put them up (HF_PIECE maps lotbuild ids, his own buildings and the bosses' prizes to
pieces; a thing with no piece but a picture takes any free lot). #hfeed is a canvas over the town picture, under the sheet; the town
screen runs beneath it (its doors are what a lot's tap opens: openB(key), a shop by VAR.bareShopOf). For gates: window.__HOME_FEED
(on, cam, sh, slots n -> key/door/pid), __HOME_FEED_AT(n), __HOME_FEED_PEOPLE(), __HOME_FEED_AGE(ms), __HOME_FEED_TAP,
__HOME_FEED_SWALLOWED. BohemiaSettlement.where(k) answers where the footage shows k.

## WAITING ON PAOLO (build nothing of these)
- Row 638, THE GRINDER at his place: his A, B or C (does his own crew grind the human dead) is asked; nothing of the player's side
  until the coordinator sends his answer.
- His walls and roofs as the cover in the defence fight at his place: rule 86 (10/10) retired 'a fight at your base stands on what
  you built'. The fight itself EXISTS (LIFE + CITY's raidDefend) on his block's own ground (COMBAT THREE's zone board via
  FIGHT_OPTS.ground), nothing he built on it (gated: A RAID ON YOUR BASE D). If he lifts rule 86, the seam is COMBAT THREE's
  bohemia_big_inside.js: HOME BASE hands his place's lots as an inside's data file, COMBAT THREE lays it.
- Row 638, THE GRINDER: ANSWERED (469) and BUILT by HOME BASE 3 (BUILD 11/22zm).
- Rule 465: none of his VOTE-tab homework goes into any line; rule 454(a): no standing line rewritten.

## WHAT THIS LANE HAS BUILT (each record in records/, each gate leg in gates/home_base_gate.js, YOUR PLACE, PLANTED)
- 11/8 PLANT YOUR PLACE (the map's YOUR PLACE page on the phone; one planted place, permanent; ledger 442(c)).
- 11/9 to 11/11 the place remembers, pays, starts with its doors shut until built (stall, arms, clinic), what each build gives.
- 11/10 THE SEAM: BohemiaHomeMap.give({id, kind: prize|trophy|build|person|deed, name, pic, gives, from, says, build, look, saved,
  held, day}); before planting a thing WAITS; the same id twice is one. Bosses' prizes (BohemiaBosses' state, read only), JOBS' deeds
  (one marked line in slices/bohemia_job_kinds.js settle), JOBS' paid-into-your-place builds, held raids (FACTIONS' ledger, read only).
- 11/21 THE CORK BOARD IS DEAD (HOME BASE 2, rule 466(b)): no board, no auto-build, no sheet; an old save's board comes down on load;
  deeds still kept. graveyard/POSTMORTEM_HOME_BASE_THE_CORK_BOARD_11_21_26.txt.
- 11/21 IT STARTS BARE (HOME BASE 2): his place's own ground with nothing on it (slices/home_base/bare_tall.webp, bare_wide.webp and
  their nights, tools/bohemia_home_base_it_starts_bare_11_21_26.py); none of the camp's doors, keepers, crowd or strangers; a build that
  opens a door IS that door (vendor stall TRADE, shed MEND, roof HEAL). Screen block __IT_STARTS_BARE__ (window.__HOME_BARE_AT for gates).
- 11/14 three cameras; 11/17 his own buildings (training yard, forge, lookout; +35% XP counted on the crew screen); the cork board
  (jobs done, people brought home); 11/17zr SEEN THROUGH THE CAMERAS (the lens: perspective, sensor, tape, wrong clock; taps through
  the lens; close shots; his men at his buildings; BUILD picks a lot in the feed; no top-down plan); 11/18c HELD THE GATE; 11/20a WHERE
  YOU BUILD (empty lots chalked under a hammer's plate; infrared at night).

## THE SYSTEMS, WHERE THEY LIVE
- engine/bohemia_home.js (BohemiaHome): plant, give, placeWaiting, places (yard/forge/lookout/board), train/trained, trainCost, bill.
- records/target/bb/home_base.json: plan (12 lots), builds, places, opens, bill, words (draft). nightly_bill.json: the bill.
- slices/BOHEMIA_CITY_WORLD.html, HOME BASE's blocks at the file's end: homeState (posted to the town screen as BOHEMIA_HOME),
  homeGive, homeBossGifts, __HIS_OWN_BUILDINGS__ (placeBuild, press, watch, train), __HIS_GATE_HELD__ (homeRaidsHeld every 2 s).
- slices/BOHEMIA_SETTLEMENT_SCREEN.html, his place only: __HOME_BASE__ (the desk), __EVERYTHING_HIS_LIVES_THERE__ (his things as doors),
  __WHAT_YOU_BUILD_OPENS_A_DOOR__, __HIS_PLACE_THROUGH_ITS_CAMERAS__ (HCAM), __HIS_OWN_BUILDINGS__ (kit pieces, sheets),
  __HIS_PLACE_SEEN_AS_HE_WILL_SEE_IT__ (HLENS: homeLensSet/Apply/Frame/Region, the tap remap, homeWorkers, homeDrawLots/Empty).
- slices/BOHEMIA_ROSTER_SCREEN.html: one marked hook in afterFight (trained XP).

## FOR ANY LANE TESTING HIS PLACE
- Find a door with BohemiaSettlement.where(k): it answers where his camera shows it (never pan the picture under his cameras).
  BohemiaSettlement.lens() gives out/inv/hit for gates. window.__HOME_LOT_AT(i) gives a lot on the glass.
- Wait for a sheet's opening to finish before reading a row (it grows from a tenth of its size).
- Other towns are untouched by every HOME BASE block (all keyed on his planted place).
- At his place there is no stall, bench or clinic door until the build stands; then the build's own picture is the door
  (BohemiaSettlement.where('stall')). The middle of the BUILD ground may be a shop: tap an empty lot (window.__HOME_LOT_AT) for BUILD.
- Tests: node gates/home_base_gate.js (--only phone_portrait | phone_landscape; --engine). Last run 11/21zc: upright 116/0, sideways 113/0 (engine 34/0).

## RULE 459, FOR ECONOMY TWO: WHERE HOME BASE'S COSTS AND PAY ARE SET (HOME BASE moves none)
records/target/bb/home_base.json builds{} (goods cost, gives, worked), places{} (yard: tape 3, mult 1.35, fights 3, per_level 1, min 2;
forge: tape 4, takes 2 tape, makes 6 rounds; lookout: tape 2, reach 10; board free), bill{} (keep, water and power by mark,
prize_pays); records/target/bb/nightly_bill.json; the one battery a build costs: the town screen's desk (P.debit 1) and lotbuild's
catalogue (engine/bohemia_lotbuild.js, not HOME BASE's). engine/bohemia_home.js trainCost only reads the file.

## REDS SEEN ON MAIN'S OWN FILES, NOT THIS LANE'S (measured with and without HOME BASE's diff)
THE SETTLEMENT SCREEN 71/4 (the job card's new asks, the bar's price, the board's contracts); BUILD ON THE SCREEN 14/1 (the map's
ledger leg); EVERY JOB KIND 33/4 (quarantined for load); SCROLLING IS ILLEGAL N4 (the settings card). The alpha on its side sometimes
fails the tools' driver before any page code (toMap, 'after 8 squeezes'): retry once.

## HOW THIS LANE WORKS NOW (rule 461 amended 11/21)
Never call send_later, a scheduled trigger, or anything that waits on a person's tap: keep going in the same turn. One build each,
measured first, proven on the real page (alpha and demo, a phone both ways), a VOTE card, the record, this file, START, the ask row.
