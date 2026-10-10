# A RAID ON YOUR BASE: WHAT YOU BUILD CAN BE TAKEN, AND YOU CAN BE THERE
# LIFE + CITY, 10/9/26, row [a raid on your base] (rule 37c, 43, 68); the ledger is FACTIONS'

## WHAT WAS THERE
FACTIONS (engine/bohemia_homebases.js) had built the raid as a LEDGER: raidsFrom (a crew arriving at a base you
hold), openRaid (its prep days, 4 by default), closeRaid (held / taken / ruined), settle (the world's answer when
nobody came: the base holds if it is as strong as the crew). Its header says the offer, the preparation and the fight
are "RUN's, LIFE+CITY's and COMBAT's". Nothing in the game called any of it, and no crew could ever come for you:
your outfit's relations are empty, so WORLD's parties send nobody at your base.

## WHAT IT IS NOW (tools/bohemia_city_built_patch.py + tools/bohemia_city_livingmap_patch.py, engine/bohemia_livingmap.js)
- ONE LEDGER ON THE MAP: HB_REC, FACTIONS' record, made once, your outfit's own base taken by you on day one ('deal').
  The build lots, the settlement's `held` and the raids all read it. Saved and restored beside the century.
- WHAT YOU BUILD DRAWS A CREW: a base you hold with WORTH_RAIDING (2, mine, TUNING) things standing, no raid open, none
  this act and none walking, sends ONE crew the next morning from the nearest seat that is not your friend and still
  holds its own base, in WORLD's party shape, so it walks, prints and is seen coming. The phone says so.
- ARRIVALS: the living map's step now reports who arrived (homebases.advanceWatching's shape); a crew at a base you
  hold opens the raid through raidsFrom/openRaid. The phone says how many days.
- AWAY: on the due morning FACTIONS' settle answers: the stronger crew takes it; what you built stands and pays them.
- THERE: standing at your base when the crew arrives (or arriving while a raid is open: one marked line in RUN's
  loopArrived) starts the fight at your gate through the one door (cityHandOver), so what you built is on the board
  ([built on the board]); the crew is sized by the map's own party math and dressed by COMBAT's enemy table.
- A WIN closes the raid: held. A LOSS writes nothing: DEATH IS A RELOAD (Paolo 7/26), the save made at the bell has
  the raid still open at the gate, and its days still run.

## TWO MISTAKES CAUGHT BY MEASURING, BOTH MINE
- The first defense handed the fight the raider's faction NAME as its enemy kind; COMBAT's table does not know it and
  the fight could not build its ground ("Cannot read 'early'"). Found by photographing the fight; the gate now asserts
  the fight's ground is built, both runs.
- The first loss wrote 'taken' and said so on the phone, then the reload put the raid back: a lie on the screen. Now a
  loss writes nothing (the canon above).
- And FACTIONS does not export raidOf; the glue uses raidsOpen.

## THE GATE: gates/a_raid_on_your_base_gate.js (suite A RAID ON YOUR BASE), 18/0, three alpha sessions
Yours in the ledger, saved; two things draw one crew and the phone says it; away: the raid opens with 4 days and the
Cartel (power 12) takes the camp (power 4), the two things still standing; home: the fight opens at the gate, wall and
tank on its board, its ground BUILT; win holds, and no second crew that act; loss is a reload, the raid still open.

## THE COOK
slices/vote/LIFECITY_A_RAID_ON_YOUR_BASE_10_9.png: the alpha on a phone, the crew coming (the phone's post), the fight
at your gate, the phone's word after the win.

## FOR FACTIONS AND TUNING
Who raids (nearest not-friend seat), WORTH_RAIDING 2, and "a camp is raidable from day one" are defaults to correct.
