# BOHEMIA — LIGHTING SYSTEM RESEARCH: MINECRAFT MODEL (7/10/26)

## Paolo's directive
Research the Minecraft lighting system. Bohemia could use lights like that but
"maybe even more intense" — and NOT necessarily Minecraft's fast falloff that
forces tons of sources. Decisions below are PENDING Paolo.

## How Minecraft does it (researched, verified)
- 16 integer light levels, 0 (pitch black) to 15 (max).
- TWO channels per cell: SKY light and BLOCK light; rendered brightness = the
  MAX of the two, never the sum. Light is non-additive — a second torch only
  extends coverage, it never stacks brightness.
- Block light spreads by FLOOD FILL: minus 1 per cell of taxicab distance,
  producing a diamond-shaped pool around each source (diagonal costs 2).
- A torch emits 14, so it lights ~14 cells; cave-proofing means a source every
  13-14 cells. This is the "light dies quick, need lots of sources" feel Paolo
  noted.
- Opaque cells stop light dead. Some materials attenuate instead (water cuts
  light by 2 per cell). Sky light is 15 under open sky, dimmed by weather
  (rain 12, thunderstorm 10), moonlight ~4.
- Light level gates GAMEPLAY, not just visuals: hostile spawns need darkness,
  crops need light. The light map IS a rules layer.

## Why this model fits Bohemia's engine
- Integer levels on a grid = cheap flood-fill, deterministic (FOLD-safe),
  quantizes cleanly with the 120bpm world.
- Two-channel max() = day/night city on the surface, ZERO sky channel in the
  sewers — the demo becomes pure block light, dread by arithmetic.
- Light as a RULES layer is very Bohemia: agents ambush below a light
  threshold (the dark literally spawns danger, like Minecraft mobs), crops in
  the city-builder need light, curfew/blackout events change the map.

## Bohemia design options [ALL PENDING PAOLO]
1. FALLOFF RATE: (a) Minecraft-exact -1/cell; (b) HALF falloff -1 per 2 cells
   (sources reach twice as far — "more intense", fewer sources needed);
   (c) per-source profiles (candle falls fast, floodlight carries).
2. INTENSITY CEILING: keep 0-15, or 0-31 for stronger-than-Minecraft sources.
3. SOURCES (canon-flavored): fire barrels, work lights, neon remnants, the
   HATCH's fiber-optic purple (a light SOURCE — ties to the lighting-client
   note), NeuroLink reveal glow as a tiny emitter on revealed agents.
4. WATER ATTENUATION: sewer water cutting light by 2/cell (Minecraft-style).
5. GAMEPLAY GATES: agent ambush threshold, crop growth, visibility radius.

## Demo implication (once Paolo picks)
Sewer demo = no sky channel. The wash entrance glows with daylight at the
mouth, decays into the tunnel, and the last light before the hatch room is the
hatch itself, purple. The descent-into-dark pacing becomes literal math.
