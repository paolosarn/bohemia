# BOHEMIA ADDENDUM: VEHICLE LADDER + NEIGHBORHOOD CELL SIZE (7/6/26)

## 1. VEHICLE LADDER LAW (LOCKED 7/6/26, Paolo verbatim intent)
"in this game you will absolutely have bikes to start off with. or scooters.
or skateboards. man powered travel. its the economic crash apocolypse. as the
game progresses cars can unlock if you build it right and get the resources
needed or ev's."
- START: MAN-POWERED travel only. Bikes, scooters, skateboards. This is the
  economic-crash apocalypse: gas economy is dead, human power is the economy.
- PROGRESSION: cars / EVs UNLOCK later, gated on building it right + acquiring
  the resources. Vehicles are an achievement of the rebuild, not a given.
- Grounding: real post-collapse economies (fuel crises, Cuba's Special Period)
  went bicycle-first. The ladder is honest economics.
- [PENDING, Paolo's calls: exact unlock chain, which factions gate parts/fuel/
  batteries, whether transit (bus/monorail) is a city-builder output.]

## 2a. CONTENT DENSITY LAW REVERSES THE REC (7/6/26, later same day)
Paolo: the world must be FILLED WITH CONTENT, not filler. Never a cheap way
to traverse an empty world. That input flips the recommendation from 256 to
128:
- 1 cell at 128 fine = 16,384 tiles = ~ONE PELICAN TOWN of area (13,200).
  The proven density unit of the exact art style. One neighborhood = one
  Pelican Town's worth of designed-feeling ground: 8-12 houses, yards,
  alleys, a corner spot. Every screen has a thing.
- At 256 each cell = 65,536 tiles = FIVE Pelican Towns of ground per
  neighborhood x ~6,000 urban cells. The stuff does not quadruple with the
  ground; same houses over 4x area = lawns and gaps = filler. Procedural
  stretched thin = the cheap empty world Paolo vetoed.
- Screen math (iPhone portrait ~12x25 tiles visible): 128 = ~5 screens per
  neighborhood, every screen earns a POI. 256 = 10+ screens, procedural must
  invent 4x content or go empty.
- Vehicle ladder SURVIVES at 128: walk 64s/cell + 1.7h valley (still too big
  to stroll), run 51min valley, bike 16s/cell + ~26min valley (the errand
  machine; Stardew added the horse for exactly this itch), car ~10min valley
  (the prize). Ladder intact, just tighter.
- Compression: 96m for a real 400m subdivision = 1:4 linear = GTA's exact
  number (Los Santos reads as all of LA). Valley = 5.7 mi = Los Santos scale.
- LAW UNDERNEATH: DENSE OVER VAST. Life lesson intact: a rebuilt world is
  measured by what fills it, not how far it stretches.

RECOMMENDATION NOW: 128. LOCKED by Paolo 7/6/26.

## 2b. ORIGINAL 256 ANALYSIS (superseded by 2a, kept for the record)
1 overmap cell = 256x256 fine cells = 16x16 chunks (CHUNK=16) = 192m x 192m.
Valley = 96 x 192m = ~11.5 miles across (1:2 linear compression of the real
22.9 mi valley; GTA compresses LA 1:3-1:4 and it reads as all of LA).
PZ Build 42 ships exactly 256x256 tiles per cell, continuous streamed world.

WHY 256 AND NOT 128 OR 512: the scale is sized to the vehicle ladder. The
world should feel slightly too big on foot, right on a bike, conquered by a
car. Each rung must matter:
- 128: walking alone is comfortable -> day-one bikes pointless, cars nothing.
  Ladder collapses.
- 512: even the bike crossing is 1.7h -> bikes do not fix the world, only
  cars do. Kills the man-powered-start fantasy.
- 256: foot serves the neighborhood, bike serves the district, car serves the
  valley.

## 3. THE TRAVEL TABLE (256, CELL_M=0.75, 120 BPM beat=0.5s)
| mode        | cells/beat | m/s  | cross 1 cell | cross valley |
| walk        | 1          | 1.5  | 2.1 min      | 3.4 h        |
| run         | 2          | 3.0  | 64 s         | 1.7 h        |
| bike        | ~4         | 6.0  | 32 s         | ~51 min      |
| car/EV late | ~10        | 15.0 | 13 s         | ~20 min      |
Skateboard/scooter land between run and bike (~3 cells/beat).
[PENDING, Paolo's calls: exact cells/beat per vehicle, whether vehicles move
in city mode as well as fine mode.]

## 4. WHAT CHANGES IN CODE IF 256 LOCKS
- bohemia_overmap.js: TILE_FINE 512 -> 256, SLOT_FINE likewise. ONE constant.
  The 96x96 authoring (Strip cells, arterials, districts) does NOT move; only
  the amount of fine world under each cell changes.
- Everything else from the VALLEY SCALE LAW addendum stands: whole-valley map,
  abstraction law, continuous walk law, deterministic per-(seed,cell) chunk
  streaming, border stitching.

## BIKE v1 IMPLEMENTED (7/6/26 evening, in the alpha)
- 🚲 BIKE button, human mode only, bottom-left. Tap = mount/dismount.
- LOCKED SPEED: 4 cells per beat while mounted, one REQUEST per beat under
  the 120 Request Law like all movement. A blocked cell stops the ride at
  the last open cell (partial advance). Time advances PER CELL traveled,
  distance-honest.
- NO RUN RAMP while mounted: the bike IS the speed tier.
- Rides the run clip for cadence; a placeholder two-wheel render sits under
  the body [PENDING, Paolo: riding pose + bike art].
- HUD reads RIDING; gates green (bike gate 7/7 incl. per=4 law, no-run-ramp
  law, per-cell time, open ring runs).
- BIKE ACQUISITION LOCKED (Paolo 7/6): POKEMON MODEL. You do NOT start
  with a bike; you acquire it in-world early, and once it is yours it is
  frictionless forever, one tap, no inventory fiddling. The friction lives
  in the acquisition moment, never in the daily use. WHERE/HOW you get it
  (gift, shop, build, quest) = story content [PENDING, Paolo's call].
  Alpha keeps the always-available button as dev mode until acquisition
  content exists.
- Off-street riding penalty (grass slower) vs free everywhere: still
  [PENDING, Paolo].

## HUMAN CAMERA ZOOM (built 7/6 evening, same session)
- Pinch to zoom in/out on the character in human mode, wheel on desktop,
  double-tap resets. Range 10-52 px/cell (default 22). Camera stays locked
  on the player. DROP IN / pull-up transitions animate to YOUR chosen zoom
  instead of a hardcoded value.
- HD2X CORRECTED TWICE (Paolo's catches, 7/6 evening). First fix (EPX past
  native) treated the symptom. The real violations: the bridge shipped
  pre-Scale2x'd 112 frames AND the city drew them at FRACTIONAL sizes
  (57px default, 135px zoomed), resampling the HD pixels every frame,
  which is why it never matched the rig tab's SCALE2X HD.
  FINAL ARCHITECTURE (LOCKED):
  * The bridge ships RAW 56 ART (bake56), halving the payload (same fat-
    payload family as the combat laptop crash, so a perf win too).
  * The city owns the ladder: 28 (exact 2:1 decimation) / 56 (raw) / 112
    (Scale2x) / 224 (Scale2x twice), each baked lazily, cached per frame.
  * ZOOM LEVEL LAW: human zoom SNAPS to HC 11/22/44/88. The character
    draws 28/56/112/224 at those levels: EXACT integer sizes only, char-
    to-world ratio constant (~2.55 cells) at every stop, zero fractional
    art scaling anywhere. Pinch steps between levels, wheel steps one
    level, double-tap returns to 22.
  Gate: real-pixel EPX test (dims double, zero invented colors, solids
  preserved).

## STATUS
- Vehicle ladder (man-powered start, cars/EVs unlock): LOCKED.
- Cell size 128: LOCKED 7/6/26. TILE_FINE=128 relocked in bohemia_overmap.js,
  builds clean, census healthy at seed 12345. 256 analysis superseded.
