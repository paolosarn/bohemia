# BOHEMIA — SHADOWS: DESIGN CONCEPTS (7/10/26, invited by Paolo)

## What the lighting system already gives free
Walls stopping the flood-fill IS hard shadow: the dark behind a wall relative
to a source. Zero extra cost, already working in the playground.

## Concept options [ALL PENDING PAOLO]
1. **CAST SHADOWS (directional)** — per source, raycast (Bresenham) from the
   source to each lit cell; a wall on the ray blocks light past it. Turns the
   diamond glow into true line-of-sight pools with hard-edged shadow lanes
   behind obstacles. Cost: modest (small maps, few sources). The dramatic one:
   an agent steps between you and the fire barrel and its shadow crosses you.
2. **ENTITY BLOB SHADOWS** — soft ellipse under every rig, offset away from
   the nearest strong source. Pure cosmetic paint, cheap, sells grounding.
3. **FLICKER ON THE BEAT** — fire sources oscillate ±1 light level on the
   120bpm grid. The whole tunnel breathes with the soundtrack. Very Bohemia.
4. **SHADOW AS STEALTH RULE** — cells in shadow (light below threshold AND
   occluded from sources) count as hiding spots — for the player AND for
   agents. Ties to under-stairway ambush idea + agent ambush thresholds.
5. **LONG SHADOWS AT THE WASH MOUTH** — surface daylight entering the tunnel
   mouth casts one long directional shadow lane inward. One-off scripted
   moment, cheap, cinematic descent beat.

## Recommendation order (engine-first, cheapest real win first)
2 (blob) -> 3 (beat flicker) -> 1 (raycast) -> 4 (stealth rule) -> 5 (set piece)
All compose with the validated flood-fill; none replace it.
