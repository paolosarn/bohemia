# BOHEMIA — ALPHA ABSORPTION PLAN (7/14/26)
How the demo-slice systems enter BOHEMIA_ALPHA_0_9.html. Grounded in actual
alpha recon (30.3MB single file; modules confirmed: face renderer
(renderFace), ANIMBEATS beat table with the 7/2 animation verdicts,
CombatBridge with headless LOD resolver, city-view LOD notes).

## What ships in (the modules, all tested)
1. bohemia_light_pass.js — LIGHT PHILOSOPHY LAW as code (5/5 tests).
   Alpha has NO lighting today (zero lightmap/composite hits) -> clean drop,
   no conflicts. Hook: the world-view draw path renders FULL-BRIGHT into a
   scene buffer, then pass.apply() multiplies the whole frame; flame/emissive
   sprites draw after. Phase feeds off the existing beat clock (ANIMBEATS
   already defines beats -> phase=(sub%8)/8). levelAt(gx,gy) is the future
   stealth/AI-vision primitive.
2. bohemia_blockgen.js — street/block generation (9/9 law tests: lane width
   2, line colors, crosswalks at intersections only, staggered lamps, car
   no-overlap, no-single-street variety, freeway preset, determinism).
   Hook: city view block expansion / exploration map gen.
3. BOHEMIA_STREET_POOLS_HARMONIZED (v6, Paolo-evidence orientation table) +
   BOHEMIA_SEAM_FIXED_SURFACES — LAW: alpha tile sources switch to processed
   banks; raw masters are NEVER rendered (baked-outline black-grid law).
4. BOHEMIA_DOOR_ANIM_BANK (27 approved, leaf-pixel law) — door entities:
   2-beat swing, collision flips at frame >= 5.
5. BOHEMIA_FIRE_FLICKER_BANK (34 loops) + BOHEMIA_ACT1_LIGHT_SOURCES v3
   (meter-grounded radii; ambient_night = Paolo's +10% values; electric
   entries PENDING his act-1 grid ruling).

## Order of surgery
1. Add light-pass module + scene-buffer refactor of world draw (biggest
   render change, do first, test in isolation).
2. Register emitters from LIGHT_SOURCES v3; wire flicker loops to beat.
3. Swap tile sources to processed pools (grep any raw repo reads, kill).
4. Door entities from the bank.
5. blockgen behind the city view (block -> cell grid -> renderer).
Each step: ENGINE SYNC LAW (sync inlined engine everywhere) + regression
gates (draw-order static check from LIVE SLICE V3 ports as an alpha test).

## LAW / CAUTION
ONE-ALPHA LAW: actual surgery happens on the canonical alpha with Paolo
present (main project), not on this chat's uploaded copy — this chat ships
the tested modules, banks, and this plan. The rig swap-in (BAKED.pose walker
into the slice's proxy slot) rides the same session since the rig engine
lives inline in the alpha.

## Next / next-next (standing report)
NEXT: continue act-1 completion between Paolo verdicts (vision sheets when
the channel cooperates; house factory v2 the moment his part roles land).
NEXT-NEXT: absorption session per this plan, rig swap-in included.
