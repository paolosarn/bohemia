# BOHEMIA — LIGHT PHILOSOPHY LAW (Paolo, 7/14/26)

"Everything can be touched by light. Nothing is above light."

## The law
Lighting is a WHOLE-FRAME FINAL PASS, never per-sprite tinting. Render
order, forever:
1. Draw the entire scene FULL-BRIGHT (grounds, props, doors, characters,
   UI-less world content).
2. Multiply the whole frame by the LIGHTMAP (ambient + all emitters,
   flicker wobble included).
3. ONLY emissives draw after the darkness pass (flames, glow cores,
   screens) — because they ARE light.
No sprite may ever be drawn after step 2 unless it emits. Per-sprite light
tinting is BANNED (it is how things escape the light).

## Engine consequence
Render contract layer 8 = this pass. Alpha integration inherits it.
