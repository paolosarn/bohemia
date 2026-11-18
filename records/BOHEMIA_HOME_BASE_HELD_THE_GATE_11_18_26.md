# HOME BASE, 11/18/26: HELD THE GATE (BUILD 11/18c; VAMILY rule 453, rule 458(c), rule 86 kept, rule 459, rules 441, 454(a); ask line 571)

The coordinator's round (routine "HOME BASE next"): one build each, always shown through the cameras (458(c)): (1) the defence fight
at his place with COMBAT THREE, (2) more of his impact seen there. Rule 459: ECONOMY TWO owns every price; list where HOME BASE's
buildings' costs and pay are set and move none.

## (1) THE DEFENCE FIGHT AT HIS PLACE: MEASURED, IT EXISTS; THE RETIRED HALF NOT BUILT
Measured on the alpha (main c869a5ed), a raid planted the way A RAID ON YOUR BASE plants it, standing at his gate:
- A crew walking at his place, the raid opening at his gate (4 days), and standing there starts the fight through the one door
  (LIFE + CITY's raidDefend, 10/9): "The crew from Remnants is at the gate. You are here. Fight."
- The fight is ON HIS PLACE'S OWN GROUND: FIGHT_OPTS.ground is his block's own cell and zone (one run: a trailer park, cul-de-sac,
  zone_place place_trailer; another: a suburb block), COMBAT THREE's board through WORLD THIRTEEN's EVERY ZONE ITS GROUND.
- NOTHING HE BUILT IS ON THE BOARD (opts.built 0), and A RAID ON YOUR BASE D gates it: rule 86 (Paolo 10/10: 'what you build lives
  in the settlement screen of your base and nowhere else') retired A-FIGHT-AT-YOUR-BASE-STANDS-ON-WHAT-YOU-BUILT. His walls and roofs
  as the cover is that shape: NOT BUILT (graveyard is final), [PENDING Paolo] as in the 11/17 record.
- The fight starts the moment he is at his gate, so there is no moment to see the crew on his cameras before it. A beat where the
  crew stands at his gate on CAM 1 and he starts the fight from the feed would be LIFE + CITY's raidDefend waiting for his tap: named
  for them, not done here.

## (2) BUILT: A GATE HE HELD IS PINNED AT HIS PLACE
- slices/BOHEMIA_CITY_WORLD.html __HIS_GATE_HELD__: every two seconds the map reads FACTIONS' ledger (hbRec().raids, read only) and
  each raid on HIS planted place that closed 'held' (not moot) goes through the one seam as a deed (kind 'deed', held: true, the
  crew's name as its 'from'). One held elsewhere, a moot one, a taken one pin nothing; the same raid twice is one.
- engine/bohemia_home.js: a deed keeps its held mark (rec.deeds).
- The cork board (slices/BOHEMIA_SETTLEMENT_SCREEN.html): the held gate among the papers, "HELD THE GATE · REMNANTS"; the count
  stays the jobs' ("1 jobs done."). Seen through the camera: a tap on the board cuts CAM 1 close on it.
- One new line, draft (rule 454(a)): 'Held the gate'.
- THE REAL FLOW, on the alpha upright: the raid, the fight at his gate on his block's ground, a win ('Custom held. You stood at the
  gate and they broke.'), and two seconds later his place has "Held the gate*@Remnants" pinned, the board standing.

## THE GATE: gates/home_base_gate.js, YOUR PLACE, PLANTED
Engine E12 (a held deed keeps its mark, a job beside it does not; PLANTED: the mark left off reads as a job). Demo upright 119/0,
sideways 116/0: D18 a raid held at his place is pinned once, one held at another place is not; a real tap on the board through the
camera (CAM 1 close) shows HELD THE GATE with the crew and the jobs' count unchanged. The gate's raid comes down with its board.
A RAID ON YOUR BASE, THE LOTS ARE KEPT, BUILD A LOT, THE SETTLEMENT SCREEN: see the commit.
The alpha on its side: the tools' driver could not bring the map up on the alpha on its side (toMap, 'after 8 squeezes', three
tries), before any of this code ran; the demo on its side carries the leg.

## RULE 459: WHERE HOME BASE'S COSTS AND PAY ARE SET (ECONOMY TWO's to move; HOME BASE moved none)
- records/target/bb/home_base.json builds{}: each of the eight builds' goods cost (tape), what it gives a day, what a worker adds.
- records/target/bb/home_base.json places{}: the training yard (tape 3; mult 1.35, fights 3; price per_level 1, min 2), the forge
  (tape 4; takes 2 tape, makes 6 rounds), the lookout (tape 2; reach 10), the cork board (free, by itself).
- records/target/bb/home_base.json bill{}: keep, water and power cost by mark, prize_pays (a boss's prize off the bill).
- records/target/bb/nightly_bill.json: the nightly bill per person (BohemiaHome.bill).
- The one battery a build costs: the town screen's desk (P.debit 1 for his own buildings; lotbuild's own 1 for the eight), and
  lotbuild's catalogue (engine/bohemia_lotbuild.js, not HOME BASE's).
- engine/bohemia_home.js trainCost(level): reads the yard's per_level and min from the data file; nothing set in code.

## NOT DONE, SAID PLAINLY
- His walls and roofs as the fight's cover: rule 86's retired shape, [PENDING Paolo].
- The crew seen at his gate on his cameras before the fight: needs the fight to wait for him (LIFE + CITY's raidDefend).
- No picture of its own for a held gate (a paper among papers).

[bb Battle Brothers writes what the company did into its history; ours pins it to a board behind your place.]
[analog horror: the newest paper is the only one still white. Under it, a name you did not write.]
