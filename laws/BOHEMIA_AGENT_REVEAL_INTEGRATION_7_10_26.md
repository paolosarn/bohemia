# BOHEMIA — AGENT REVEAL INTEGRATION (7/10/26)

## What this is
Everything the code needs to render cybernetic-homeless agents in their three
states: INTACT (looks like an ordinary homeless person, purple eyes only),
REVEALED (took a hit, survived, NeuroLink glows purple at the head), DEAD.

## Files
- `BOHEMIA_AGENT_LOOK_7_10_26.js` — the data (this doc explains the plumbing)
- `BOHEMIA_SKIN_PALETTES_WORLD_7_10_26.js` — SKIN_TONES_WORLD (SKIN_TONES_HOMELESS is DEAD, 7/10)
- Preview: `BOHEMIA_AGENT_REVEAL_PREVIEW.png`

## HOW THE CODE ACCEPTS IT
1. **Skin**: agents paint with `SKIN_TONES_WORLD`, same as everyone. (Grime ramps DEAD 7/10.)
   One branch where the look-config resolves tone:
   `const tones = SKIN_TONES_WORLD;`  // no agent branch — the RAGS carry the read
   `skinRampFor()` untouched. Regions untouched (color data only).
2. **Eyes**: APPEND `AGENT_IRIS` to the alpha's existing `IRIS` array (do not
   reorder — existing saves index IRIS by position). Agents get
   `look.irisIndex = IRIS.length-1` at spawn. Civilians never roll it.
3. **Reveal state**: add `revealState` to the agent entity (AGENT_STATE enum).
   Transition hook lives in combat resolution: on a HIT/VITAL that does NOT
   kill an agent, set `revealState=REVEALED`. (KILL zone -> DEAD, no glow.)
4. **Glow render**: when `revealState===REVEALED`, after the normal sprite
   paint, stamp NEUROLINK_GLOW.core pixels at the temple cells of the HEAD
   region and NEUROLINK_GLOW.halo above them. This is a POST-PAINT cosmetic
   layer on the composed frame — it reads HEAD region cells, never writes
   region geometry.
   NOTE: terminal-clip law applies — glow layer joins headshot/ragdoll frames
   uncached like the rest of the terminal path.
5. **Beat sync**: glow can pulse on the 120bpm grid (BEAT=0.5s) like all
   animation. Suggested: halo alpha oscillates per beat, core steady.

## LAW COMPLIANCE
- Purple Reservation Law: purple renders ONLY on hatch + agents (eyes, reveal
  glow). Verified in preview: civilian figure contains zero purple pixels.
- Region geometry: untouched. All of this is paint + post-paint cosmetics.

## PENDING PAOLO
- Glow placement final call (temple pixels vs crown vs behind eyes)
- One shared purple vs variation by conversion age

## UPDATE — RAG OUTFITS (7/10/26)
- `BOHEMIA_AGENT_RAGS_7_10_26.js` — 8 preset rag outfits, tints SAMPLED from the
  categorized world tiles themselves (BROWN + NEUTRAL families, dark band), so
  agents literally wear the world's debris colors.
- Plugs into the EXISTING tint system: same shape as `G.tints`
  ({jacket,shirt,pants,shoes:[r,g,b]}), applied through `tintRamp()` — luminance
  preserved, outlines untouched, zero new code paths. Agents roll one at spawn.
- [PENDING Paolo: eyeball the 8; direction is dusty-brown/grey rags — redirect if
  the homeless should read differently.]

## UPDATE — REVEAL TONED DOWN (Paolo verdict 7/10/26)
Revealed state was doing too much purple. New spec: iris px unchanged; glow =
TWO temple core px + ONE dim (alpha~140) halo px per side. NO crown pixels,
NO bloom ellipse. Base-sprite purple footprint cut from ~14px to 6px.
The glow layer stamps exactly: core at HEAD-region temple cells, halo one px above.
