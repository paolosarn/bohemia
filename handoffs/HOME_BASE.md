HOME BASE 2 (takes over HOME BASE's file, home-base-01gkdyuv's context filled): 11/21 LATEST -- BUILD 11/21s - IT STARTS BARE.
Last ship: BUILD 11/21s - IT STARTS BARE (rule 445(b)), record records/BOHEMIA_HOME_BASE_IT_STARTS_BARE_11_21_26.md. No VOTE card
(rule 466(a) killed the camera view its screenshots go through; the bare ground goes on the rebuilt cameras' card).

## THE NEXT JOB, NAMED: HIS CAMERAS REBUILT (rule 466(a), his NO on home-base-seen-through-the-cameras-11-17) + THE CORK BOARD KILLED (466(b))
His words 11/21: 'Bro, you are hallucinating... This is not the view that we're going to be having... Go back to when you originally
showed me what the shit would look like from the different camera angles... you're basically doing the same thing but like slightly
skewing some of the dimensions'; and on WHERE YOU BUILD: 'Not the camera view and angles i was promised'. THE ORDER (466(a)): the
skewed board (__HIS_PLACE_SEEN_AS_HE_WILL_SEE_IT__'s HLENS perspective on the town picture) is KILLED; his place is shown the way rules
354 and 373 say and the way the first feeds did (ui-the-camera-feeds-11-3, his YES; slices/BOHEMIA_UI_THE_CAMERA_FEEDS_11_3_26.html):
real security cameras mounted low, wide lens, steep, PS1 footage, several angles, intimate. The 11/3 mocks are this lane's own
(tools/bohemia_home_cameras_11_3_26.py, tools/bohemia_home_research_mocks_11_3_26.py, tools/bohemia_home_settlement_pipeline_11_3_26.py,
slices/BOHEMIA_YOUR_SETTLEMENT.html; records/BOHEMIA_PAOLO_YOUR_SETTLEMENT_THROUGH_ITS_OWN_CAMERAS_11_3_26.md): READ WHAT HE SAW
FIRST, then 3D renders of his bare ground (tools/bohemia_home_base_it_starts_bare_11_21_26.py's scene) and his builds from low
mounted cameras, the doors placed in each camera's picture. 466(b): home-base-his-impact-11-17 (the cork board) KILLED ('AI slop'):
the board, its auto-build and its sheet to graveyard/ with a post-mortem (A DEAD SHAPE DOES NOT COME BACK); the deeds stay in his
place's memory (engine, E11). held-the-gate-11-18 was a YES that rode on the board: say so in the post-mortem.
AFTER IT (in order): a camera sound for his feeds (SOUNDS owns sound: ask, do not make); CAM 1's empty lots are 23 to 33 px on the
glass (a miss still opens BUILD).

## WAITING ON PAOLO (build nothing of these)
- Row 638, THE GRINDER at his place: his A, B or C (does his own crew grind the human dead) is asked; nothing of the player's side
  until the coordinator sends his answer.
- His walls and roofs as the cover in the defence fight at his place: rule 86 (10/10) retired 'a fight at your base stands on what
  you built'. The fight itself EXISTS (LIFE + CITY's raidDefend) on his block's own ground (COMBAT THREE's zone board via
  FIGHT_OPTS.ground), nothing he built on it (gated: A RAID ON YOUR BASE D). If he lifts rule 86, the seam is COMBAT THREE's
  bohemia_big_inside.js: HOME BASE hands his place's lots as an inside's data file, COMBAT THREE lays it.
- Rule 465: none of his VOTE-tab homework goes into any line; rule 454(a): no standing line rewritten.

## WHAT THIS LANE HAS BUILT (each record in records/, each gate leg in gates/home_base_gate.js, YOUR PLACE, PLANTED)
- 11/8 PLANT YOUR PLACE (the map's YOUR PLACE page on the phone; one planted place, permanent; ledger 442(c)).
- 11/9 to 11/11 the place remembers, pays, starts with its doors shut until built (stall, arms, clinic), what each build gives.
- 11/10 THE SEAM: BohemiaHomeMap.give({id, kind: prize|trophy|build|person|deed, name, pic, gives, from, says, build, look, saved,
  held, day}); before planting a thing WAITS; the same id twice is one. Bosses' prizes (BohemiaBosses' state, read only), JOBS' deeds
  (one marked line in slices/bohemia_job_kinds.js settle), JOBS' paid-into-your-place builds, held raids (FACTIONS' ledger, read only).
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
- Tests: node gates/home_base_gate.js (--only phone_portrait | phone_landscape; --engine). Last run 11/21s: upright 125/0, sideways 122/0.

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
