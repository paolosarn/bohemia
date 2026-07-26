# BOHEMIA ADDENDUM — PROCEDURAL DISTRICTS (Paolo 7/18/26, LOCKED)

Ruled when I framed 60 of the 77 district types as "pending your ruling":
"No, I think it's fair that those can be randomly generated throughout the map
no? This is a procedural generated world game you know."

## THE RULING
The landmark/building district types are NOT hand-authored one by one. They
POPULATE THE MAP PROCEDURALLY. Placement was already procedural (seeded rules,
grounded in real Vegas); this ruling extends it to the RENDER: every district
generates a plot from a build ARCHETYPE instead of waiting on a per-type ruling.

This REFINES the MECHANISM-MINE / CONTENTS-PAOLO'S law for districts: the
"contents" of a generic district (a school, a mall, a fire station) are
procedural, not reserved. What stays reserved is only genuine game-lore — the
Amalgamation, purple, faction ownership, what SPAWNS in a place — never the
building footprint itself.

## THE ARCHETYPES (engine/bohemia_blockgen.js genBuiltLot)
~9 procedural rules cover every landmark type. district -> archetype lives in
engine/bohemia_overmap_bridge.js (ARCHETYPE map):
- civic         mid building set back + parking in front + street trees
                (fire/police station, courthouse, library, chapel, terminal, town, truckstop)
- bigbox        one large building + a big parking apron (mall, convention, swapmeet, resort)
- institutional campus of buildings around a green quad + paths (medical, campus, school, jail, prison)
- industrial    drive apron + big sheds + perimeter fence (industrial, railyard, storage, warehouse)
- utility       fenced yard + scattered equipment pads / tanks (reclaim, landfill, intake,
                substation, watertreat, reservoir, pumpstation, battery, fueldepot, basin,
                datafort, arsenal, granary, radio)
- landmark      one large centered structure on a paved plaza + tree ring (dam, sphere, luxor,
                strat, highroller, sign, boneyard, fort, springs, ballpark, stadium, speedway, robofactory)
- green         open turf + winding path + scattered trees (park, golf, cemetery, waterpark, minigp, drivein)
- water / rail / extraction  water surface / rail bed / terraced mine pit (water, rail, quarry, gypsum)
Plus two that reuse existing recipes: estate -> residential, interchange -> freeway.

Everything is deterministic per (seed, cell), semantic ground only (art pools
resolve at bake, exactly like every other recipe). The bridge no longer returns
null for any district — `default: return {type:'builtlot', archetype}`.

## STATUS AFTER THE RULING
77 types: 10 BAKES, 67 RECIPE, 0 PENDING. Nothing waits on a per-type ruling.
What is owed is ART POOLS per archetype (building/roof/signage/prop sprites),
the same bake-art step every recipe waits on. Proof render:
slices/BOHEMIA_BUILTLOT_PROOF_7_18_26.png (one lot per archetype).

## THE GATE
gates/district_registry_gate.js already enforces every enum type is catalogued;
the registry (laws/BOHEMIA_DISTRICT_REGISTRY_7_18_26.md, regenerated) now shows
each type's archetype in the recipe column, so a new district with no archetype
route shows up immediately.
