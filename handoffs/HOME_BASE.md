HOME BASE 2 (takes over HOME BASE's file, home-base-01gkdyuv's context filled): 11/21 LATEST -- BUILD 11/21u - THE CORK BOARD IS DEAD
(rule 466(b)), after BUILD 11/21s - IT STARTS BARE (rule 445(b)). Records records/BOHEMIA_HOME_BASE_THE_CORK_BOARD_IS_DEAD_11_21_26.md,
records/BOHEMIA_HOME_BASE_IT_STARTS_BARE_11_21_26.md. No VOTE card for either (466(a) killed the camera view their screenshots go
through; the bare ground goes on the rebuilt cameras' card).

## THE NEXT JOB, IN FLIGHT: HIS CAMERAS REBUILT (rule 466(a), ask row 663; his NO on home-base-seen-through-the-cameras-11-17)
His words 11/21: 'Bro, you are hallucinating... This is not the view that we're going to be having... Go back to when you originally
showed me what the shit would look like from the different camera angles... you're basically doing the same thing but like slightly
skewing some of the dimensions'; on WHERE YOU BUILD: 'Not the camera view and angles i was promised'. THE ORDER: the skewed board
(__HIS_PLACE_SEEN_AS_HE_WILL_SEE_IT__'s HLENS, a perspective transform on the 45-degree town picture) is KILLED; his place is shown as
rules 354 and 373 say: real security cameras mounted low, a wide lens, steep, PS1 footage, several angles, intimate.
WHAT HE WAS SHOWN FIRST (11/3, this lane's own, read these first): records/target/home_settlement/vote_intimate.webp (the NOW panels:
3D renders, low on a street light / a power pole / a billboard, a bent wide lens, night under sodium, a fenced block of 12 lots, wires
and a lamp at the lens) and vote_all_twelve.webp; rule 354(g) to (o) and 373.
MEASURED: IT EXISTS, UNWIRED. tools/bohemia_home_settlement_pipeline_11_3_26.py makes every picture by machine: the lot template (12
lots, three rows of four stepping back and up; row height limits front 2.6 m, middle 3.8, back 8.0), the three fixed cameras (CAM 1
the street light 13 m, CAM 2 the power pole 13.6 m, CAM 3 the billboard 14.8 m; Cycles' equisolid fisheye), each shot tall 180x320 and
wide 320x180 (the PS1 size), plates (records/target/home_settlement/plates/block_cam{1,2,3}_{tall,wide}_{0,1,2}.png), pieces rendered
per camera, shape and lot of their row (pieces/, 528 files), what hangs at the lens (near/), tap boxes per lot per camera
(manifest.json tap_px), draw order (order), its own gate (gates/home_settlement_gate.py: 12 of 12 lots seen, 44-point boxes). Venv:
python3.11 -m venv bv && bv/bin/pip install bpy==4.2.0 numpy pillow scipy (works on this box; the tool's VENV path is /tmp/v). The
standalone page slices/BOHEMIA_YOUR_SETTLEMENT.html (190 lines) draws plate + pieces + near, cycles the cameras every 20 s (rule
354(h): he never picks the next; held while a sheet is open or a finger is down), taps a lot by tap_px. It was never wired to his
planted place; HOME BASE built on the town screen instead and that is what he killed.
WHAT IS MISSING (the work, in order):
1. PIECES for his things: the pipeline has main (THE TAP's prize), purifier (THE FILTER's), kitchen (THE POT's), garden_bed (lotbuild
   garden), water_tank (tank), solar_panel (solar), four houses (roof can be a house); it lacks lotbuild's wall, shed, pump, stall and
   HOME BASE's yard, forge, lookout. One model each through the pipeline's own piece() (rule 354(m): never a hand-made angle).
2. ROWS: HOME BASE puts a build on the first free open lot (lots 0-3 open first: the front row, 2.6 m), but a piece may only stand in
   its row's height (so all 12 lots stay seen, 354(g)). Decide each kind's row and make the engine place by row (BohemiaHome placing,
   lotsOpen by row), gate E6/E10/D10/D13/D17 follow.
3. THE SCREEN: at his planted place the town screen's canvas shows the camera feed (plate + his pieces by lot + near, the camera's own
   text), the three cameras cycling on their own; a tap on a lot (tap_px) opens what the town screen opens now (BUILD with the lot
   picked, his thing's sheet, the shop of a build that opened one); his people (residents, his men at his buildings) drawn at their
   lots' feet scaled by the lot box. The HLENS block and the CAM buttons go (graveyard, post-mortem: the skewed board). Keep
   __IT_STARTS_BARE__'s rules (no camp doors, keepers, crowd, strangers).
4. Gate legs (the feed on the glass upright and sideways, every lot tappable 44 pt, the cycle, a planted skew reads red) and a VOTE
   card from the real page: bare, then with his things.
AFTER IT: a camera sound for his feeds (SOUNDS owns sound: ask, do not make; the 11/3 page plays crashbox/feed_b.mp3).

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
- Tests: node gates/home_base_gate.js (--only phone_portrait | phone_landscape; --engine). Last run 11/21u: upright 123/0, sideways 120/0 (engine 34/0).

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
