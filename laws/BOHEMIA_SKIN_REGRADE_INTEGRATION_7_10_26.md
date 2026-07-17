# BOHEMIA — SKIN REGRADE INTEGRATION (7/10/26)

## What this is
World-graded skin palettes so the player character and NPCs sit in the demo
world's light instead of glowing museum-clean. Graded MATHEMATICALLY against the
measured ambient of the actual wash/sewer demo tiles (ambient RGB ~(67,61,57),
world saturation ~0.23). Not a guess.

## The grade (method, reproducible)
For each of the 9 existing SKIN_TONES ramps, each shade:
1. desaturate 30% (world sat is low, clean skin pops unnaturally)
2. darken to 82% value (drop into the world's value range, still reads vs ground)
3. pull 10% toward world ambient (the dust tint everything in Vegas shares)
Homeless variant: 45% desat, 70% value, 22% ambient pull (dirt-caked).

## HOW THE CODE ACCEPTS IT (friction-free)
File shipped: `BOHEMIA_SKIN_PALETTES_WORLD_7_10_26.js`
1. **SKIN_TONES_WORLD** is a drop-in replacement for the existing `SKIN_TONES`
   array in the alpha. IDENTICAL structure: `[name,[[r,g,b]x3]]`, same 9 names,
   same order. Swap the array literal, nothing else changes.
2. `skinRampFor()` needs NO edit — it reads `skinTone[1]` and builds
   `[[outline], dark, mid, light, light, mid]` exactly as before.
3. Existing saves keep working: `look.skinToneName` matches by NAME and all 9
   names are unchanged.
4. ~~SKIN_TONES_HOMELESS~~ **DEAD (Paolo verdict 7/10/26, graveyard is final).**
   Agents use `SKIN_TONES_WORLD` like everyone else. The RAGS carry the homeless
   read, not the skin. No branch. No second tone array.
5. **CYBER_TELL** (PROPOSAL, not locked): two RGBs for subdermal magenta accents,
   pulled from the AMALGAM art direction. If Paolo approves the direction, they
   apply as 2-3 single-pixel accents (temple/chest/forearm) on the homeless
   sprite AFTER the ramp paint — cosmetic layer, no rig/region touch.

## LAWS HONORED
- Region geometry untouched. This is COLOR data only — ramps the existing
  skinColorLayer paints with. No mesh, no regions, no reshape.
- Old SKIN_TONES stays recoverable (it's in this doc's git-of-record below).

## Old values (recovery record)
pale[233,210,192] fair[245,222,202] olive[230,196,162] tan[224,182,142]
bronze[198,152,114] brown[162,118,86] deep[112,80,58] ebony[86,60,44] onyx[64,44,34]
(light shade shown; full old array lives verbatim in the alpha until swapped)

## PENDING PAOLO
- Approve/reject the world-graded ramps (preview: BOHEMIA_SKIN_REGRADE_PREVIEW.png)
- Approve/reject/redirect the magenta subdermal tell (it's a stab, your call)
- Homeless clothing/rags palette (not built — waiting on your direction)
