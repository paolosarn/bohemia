# BOHEMIA OVERWORLD — HONEST STATUS (7/18/26)

Paolo asked: how far along is the ACTUAL proper overworld, and is this the longest
part? Grounded in our project files + research on procedural-city scope. No spin.

## THE LAYERS (what a "proper overworld" actually is)
An overworld is not one thing; it is a stack. Research on production procedural cities
(Shadows of Doubt, the L-system / road->building->street-element pipeline) converges on
the same stack we are building. Percent-done is per layer, because a late layer barely
started can make a nearly-done early layer feel like 1%.

| # | Layer | What it means | Done |
|---|-------|---------------|------|
| L0 | GEOGRAPHY | valley, 77 district types PLACED on the 96x96 overmap, streets connected, real Vegas | **~90%** |
| L1 | SPINE | world().at/plot/building/floorplan — one addressable, lazy, deterministic hierarchy | **~70%** |
| L2 | DISTRICT GENERATORS | a bespoke generator per district type (like suburb + commercial got) | **~7%** (2 of ~25-30 meaningful buildable types) |
| L3 | ART / TILES | the REAL textured render — proper tiles, 45-view art, lighting — not the schematic top-downs | **~2%** (10 bake families for street/terrain; buildings/districts have no tile pools yet) |
| L4 | 3-ACT STATES | every district/building upgradable across acts 1/2/3 (the arc changes the world) | **~0%** |
| L5 | LIFE | agents, economy, factions living in it | **~0%** |

## THE HONEST NUMBER
The SKELETON (L0+L1) is ~70-75% — the hard structural spine is real and gated.
The FLESH (L2+L3+L4+L5 — the overworld you SEE, WALK, and that's ALIVE) is ~3-5%.
Weighted as "a proper overworld," call it **~5-10% done.** Paolo's gut ("<1%") is
right about the VISIBLE FINISHED product; the spine is further than it looks, which is
exactly what makes the rest go faster than starting cold.

## WHAT TODAY PROVED vs WHAT'S MISSING
- PROVED: the factory works. Suburb (modular houses + street-aware neighborhoods,
  folded valley-wide: 2361 cells, ~56,540 enterable homes) and the commercial corner
  plaza are real generators + gates, not mockups.
- MISSING, and it's the bulk:
  1. THE OTHER ~25-30 district generators (downtown, casino, resort, strip, industrial,
     medical, campus, airport, stadium, gated, estate, park, mall...). Today they fall
     back to a generic built-lot placeholder. Each needs its own generator turn.
  2. REAL TILES. Everything I showed is semantic color (schematic). The 45-DEGREE ART
     LAW, the house factory, the parking/stall tiles exist but are NOT wired into the
     world render. This is the single biggest visible gap ("doesn't have proper tiles").
  3. 3-ACT UPGRADABILITY. Nothing yet carries act-1/2/3 states. This must be designed
     as a CROSS-CUTTING layer (a district describes itself once; acts restyle/degrade
     it) or it becomes 3x the work bolted on late.
  4. OVERWORLD-SCALE WALK (streets between plots, seamless) + LIFE.

## IS THIS THE LONGEST PART?
Almost certainly YES. L2+L3+L4 — a real generator for every district, real tiles for
each, three act-states each — is sheer content volume: the marathon. Combat and LIFE
are big SYSTEMS, but the overworld is big CONTENT. This is precisely why the FACTORY
LAW exists: hand-authoring 30 districts x tiles x 3 acts is impossible solo; generators
+ gates + batches is the only way it ships. Research backs the scale: a scoped solo
open world is 6 months to 2+ years, and the city/content is the long pole every time.

## THE UNLOCK: MAKE EVERY DISTRICT A KIT, NOT A ONE-OFF
Suburb and commercial already share the same bones: street-aware gates, dead-world
palette, footprints, a gate, render+look. The next move that collapses L2's timeline is
a shared DISTRICT KIT (a base every generator extends) so a new district is a short
config + its unique bits, not a from-scratch build. Same for a TILE PIPELINE (L3) and a
3-ACT STATE layer (L4) done ONCE and inherited by all. Build the machine, not the parts.
