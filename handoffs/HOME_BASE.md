HOME BASE (home-base-01gkdyuv): 11/21 -- A FRESH HOME BASE SHOULD TAKE THIS (this session's context is near full; rule 461 as amended 11/21). NEXT JOB: IT STARTS BARE (rule 445(b)), below.
Last ship: BUILD 11/20a - WHERE YOU BUILD (212695d2c, follow-up 5a3f2c9f1), LIVE (pages run 4676 SUCCESS contains it). Nothing in flight.

## THE NEXT JOB, NAMED: IT STARTS BARE (rule 445(b), the oldest thing owed on this lane)
His words (rule 445): his settlement is built from the ground up. MEASURED and still true: his planted place opens on the CAMP picture
(CAMP TWO's camp: the stall, the bar, the gun stand, the clinic tent, the camp's people), his things standing in its BUILD corner. The
stall, arms and clinic doors are SHUT until he builds them (BUILD 11/11j), but their pictures stand from the first second. The honest
version: his place's ground with only what he built on it, seen through the cameras (rule 458(c)). Measure first on the demo, upright and
sideways (rule 441): what of the camp picture can come down at his place (the shops' sprites, the camp's crowd) without breaking the town
screen's doors, the walk-up, the crew's spots or another lane's gate (THE SETTLEMENT SCREEN, NOTHING TAPPABLE UNDER THE PHONE, the crew in
the town). The camp picture is CAMP TWO's and COOK's: hide at his place only, never edit their files. Through the one seam and this
lane's own blocks.
AFTER IT (in order): a camera sound for his feeds (the starred loading feeds each have one; SOUNDS owns sound: ask, do not make); the
3D camera renders of rule 354/373 (tools/bohemia_home_settlement_pipeline_11_3_26.py and slices/BOHEMIA_YOUR_SETTLEMENT.html have none
of his buildings; a big build, name it before starting); CAM 1's empty lots are 23 to 33 px on the glass (a miss still opens BUILD).

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
- Tests: node gates/home_base_gate.js (--only phone_portrait | phone_landscape; --engine). Last run: upright 124/0, sideways 121/0.

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
