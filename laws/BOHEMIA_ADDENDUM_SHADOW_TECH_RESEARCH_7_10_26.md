# BOHEMIA — SHADOW/LIGHT TECH RESEARCH: HOW GOOD 2D GAMES DO IT (7/10/26)

## Technique menu (all canvas/iPhone-feasible, ranked for Bohemia)

### 1. RECURSIVE SHADOWCASTING (grid FOV) — the roguelike standard
The grid is split into 8 octants around the source; cells are traversed
row-by-row outward, and when an occupied cell is hit the octant recursively
splits into smaller regions bounded by rays to the blocker's corners. Result:
exact per-cell visibility with hard shadow lanes behind obstacles.
WHY US: grid-native, integer, deterministic (FOLD-safe), no geometry needed.
This upgrades our flood-fill from "diamond glow" to true line-of-sight light.

### 2. SMOOTH CORNER-AVERAGED LIGHTMAP — the Terraria look
Tiles render full-bright; a darkness overlay is drawn on top where each cell
corner's alpha is the AVERAGE of the four surrounding cells' light. Light
becomes a smooth gradient while the pixel art underneath stays crisp.
Performance trick from the same lineage: paint the light values into ONE tiny
offscreen bitmap (a pixel per cell), stretch it over the scene as a single
draw with smoothing ON — light is smooth, art is sharp, draw cost is one quad.
WHY US: kills the blocky per-cell lighting instantly; ~zero cost.

### 3. FUZZY/SOFT SHADOWS — multi-origin sampling
The Sight&Light technique: cast rays only toward wall-segment endpoints (plus
two rays offset ±0.00001 rad to catch the wall behind each corner), sort hits
by angle, connect into a visibility polygon. Penumbra comes from drawing
SEVERAL visibility polygons from slightly offset origins and blending them as
an alpha mask — soft creepy edges, famously "creepy result."
WHY US: 2-3 jittered origins per major source = soft shadow edges in the
sewer without any GPU tricks. Use sparingly (hero sources only).

### 4. COLORED LIGHT — RGB lightmap channels
Same lighting algorithm run per color channel (or store r,g,b per cell instead
of one level). Fire is orange, work lights white, the hatch purple — mixing
happens naturally where pools overlap.
WHY US: the amalgam purple bleeding into firelight IS the horror palette.

### 5. PERFORMANCE LAWS (from Terraria-like engines)
- Bake static lights; recompute only when something changes.
- Amortize: dynamic lights may update progressively across frames.
- Keep the light bitmap LOW RES (per-cell) and scale up; never per-pixel CPU.

## Recommended Bohemia stack (pending Paolo)
flood-fill levels (VALIDATED) + shadowcasting occlusion (1) + corner-averaged
smooth overlay (2) + RGB channels (4), with fuzzy multi-origin (3) reserved
for hero moments (the hatch room). Beat-flicker from the shadows addendum
rides on top. This is Terraria-smooth + Darkwood-menace on our engine.

## Demo image in words
Wash mouth: bright, soft-edged daylight cone. Tunnel: firelight pools with
smooth falloff, hard black lanes behind pillars. Hatch room: one purple
source, soft-edged, tinting the walls — the only color in the dark.
