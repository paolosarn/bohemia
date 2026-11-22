HOME BASE 3 (session_01GKDyutkCNC5cSDNauAG37o): 11/22 LATEST -- BUILD 11/22zm - THE GRINDER (8d48346ba) (rule 469, ask row 638) and the cameras' steps
2 to 4 (rule 466(a), ask row 663): the skewed board's code in the graveyard, the cameras' hum ASKED of SOUNDS (ask row 720), and THE OVERFLOW
(step 4, BUILD 11/22zt, a21c89ea6: a piece whose row is full stands on a lot behind it, its own picture). Record records/BOHEMIA_HOME_BASE_THE_GRINDER_11_22_26.md. VOTE
card home-base-the-grinder-11-22.

## THE NEXT JOB: THE FRONT ROW BEHIND (the last of 466(a))
1. Render the five front pieces onto the middle and back lots: `nice -n 19 /tmp/v/bin/python tools/bohemia_home_settlement_pipeline_11_3_26.py
   piece <wall|stall|yard|main|purifier> --behind-only` (8 lots each, about 11 minutes a piece alone on 4 cores), then `python3
   tools/bohemia_home_settlement_pipeline_11_3_26.py post_add <ids>`. Needs the raw empty plate first (`... empty`, 30 s) and the venv
   (python3.11 -m venv /tmp/v && /tmp/v/bin/pip install bpy==4.2.0 numpy pillow scipy). The screen places them already.
2. If he answers the record's DECIDED HERE (his own dead ground or not; the -10; never him): one line each.

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
  the desk's row-full reads every row the piece has pictures for. Rendered behind: the seven middle pieces on the back lots.
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
