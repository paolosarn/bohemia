# BOHEMIA — TILING-PHASE INSTRUCTIONS (READ THIS WHEN IT IS TIME TO PLACE TILES)

Paolo 7/19: "as long as you leave instructions for yourself when it's time to place down
tiles, then that's all OK." This is that note-to-self. Everything the tiling phase needs, in
one place. All of it is machine-gated (`python3 gates/bohemia_gates.py`).

## THE ONE ENTRY POINT
`records/BOHEMIA_TILESPEC_INDEX.md` lists every built district. Each row links to that
district's DOSSIER: `records/tilespec/BOHEMIA_TILESPEC_<name>.md`. A dossier carries the
district's summary, real-world reference, layout, circulation, LAYERING, decisions, and a
TILE TABLE — every code -> color, name, kind, ACT-1 material, layer, solid, enter. **You tile
from that sheet.** If a district changed, regenerate all dossiers: `node tools/bohemia_tilespec.js`.

## THE SCALE
1 overmap cell = 96 m x 96 m = 128 x 128 fine tiles. TILE = 0.75 m/tile. Author tile art at
this fine resolution.

## THE LAWS THAT GOVERN TILING (all gated)
1. **ACT-1 IS DEAD.** Tile the ACT-1 material column NOW: dead-brown, weathered, cracked,
   dust-caked, abandoned; no living vegetation; empty/scummy water. ACT-2/3 evolution of each
   material is [PENDING Paolo] — never invent it (MECHANISM-MINE / CONTENTS-PAOLO'S).
2. **45-DEGREE ART LAW.** Every tile/prop is seen from the world's three-quarter 45 view
   (ellipse cross-sections, sky-lit tops, bands bow to the viewer), NEVER flat 90 side-on.
   Gate: art_45_gate.py.
3. **VERIFY ON THE REAL SURFACE.** Verify on the actual render/preview path; LOOK at the
   pixels before shipping. A symptom that survives content changes is a pipeline bug. /laws.
4. **PURPLE RESERVATION.** No purple anywhere (the Amalgamation alone). Purity gate sweeps.
5. **TAN WALL 85/15, LINE COLOR** (yellow=direction, white=lane), **SIDEWALK SANCTITY** —
   apply where the codes call for them.

## LAYERING -> HOW A TILE RENDERS AND WHAT BLOCKS (the dossier `layer` + `solid` columns)
- **ground** — a flat floor tile on the ground plane; walk/drive on it; not solid.
- **structure** — has a three-quarter FRONT FACE that rises above its footprint cell; SOLID
  (blocks). Draw the face toward the viewer; the footprint cell is occupied. (This is the
  "capacity when front-facing" case: it occupies its ground cell AND draws up with a face.)
- **overhead** — drawn ABOVE the ground; the player passes UNDER it (canopy, upper garage
  deck); it does NOT block the cell beneath — render on a separate overhead layer.
- **prop** — an object sitting on the ground; solid per the `solid` column (weave between).
- **portal** — a transition INTO an interior (door / garage ramp / tunnel mouth / gate); tile
  it as the entrance; it opens the `enter` interior.
The `solid` column IS the occupancy answer (does a body block here). Live at runtime via
`world.plot().solidAt(x,y)` and `world.plot().tileInfo(x,y)`.

## EXTERIOR <-> INTERIOR (the zoom) + THE HARD DIMENSION RULE
A building/portal opens into an INTERIOR the world model serves:
`plot.building(i).interior()` (garage decks / room floorplan / crypt / tunnel),
`plot.portals()` (the ways in), each building's `.enter` (what is inside).
- **INTERIOR-MATCHES-EXTERIOR LAW (LOCKED, Paolo, "not having it any other way"):** the
  interior floor plate is ALWAYS exactly the exterior footprint's width x length. Tile the
  interior at those EXACT dimensions. Multi-level interiors (garages) have several decks;
  each deck is still exactly the footprint W x H. Gate: world_gate.js.
- So for each enterable structure you tile TWO sets: the exterior tiles AND the interior
  tiles. Interior tile-sets: garage = aisle/stall/car/ramp/stair/entrance (engine/bohemia_
  garage.js codes); room floorplan = floor/wall/door per room role (engine/bohemia_floorplan.js).

## ORDER OF OPERATIONS (tiling one district)
1. Open its dossier sheet (records/tilespec/).
2. For each tile code: author the ACT-1 material at 128-fine resolution, three-quarter view,
   dead-world, honoring its LAYER (ground flat / structure face / overhead above / prop object
   / portal entrance) and `solid`.
3. Author the interior tile-set(s) for every enterable structure — at the EXACT footprint W x H.
4. Verify on the real render surface; run the gates (art_45, purity, tan, line, sidewalk).
5. Ship; approval unlocks variants (weather/wear colorways off the approved base).

## THE DISTRICTS READY TO TILE (8, each with a dossier)
suburb · commercial · industrial · medical · solar · park · wash · cemetery.
Plus interiors: the multi-deck GARAGE (bohemia_garage) and the generic ROOM FLOORPLAN
(bohemia_floorplan). NEXT interiors owed: the mausoleum CRYPT, the sewer TUNNEL network.

## WHAT IS NOT MINE (leave empty for Paolo)
Names on signs/headstones, act-2/3 evolution, faction ownership/colors, what spawns. Tile the
mechanism; never fill the canon he reserved.
