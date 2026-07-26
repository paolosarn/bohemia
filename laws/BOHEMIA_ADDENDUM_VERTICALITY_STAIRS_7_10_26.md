# BOHEMIA — VERTICALITY: MULTI-STORY + STAIRS + UNDER-STAIRS (7/10/26)

## Status: PAOLO'S IDEA, CATALOGUED — design decisions pending his calls
Raised 7/10/26: second-story and third-story activity, stairs, and the player
being UNDER a stairway.

## What it implies technically (the honest picture)
1. **Z-LEVELS**: multi-story needs a floor index per cell (z=0 ground, z=1
   second story...). The map data schema extends cleanly: grid becomes
   per-level, walls per-level. Plumbing-ready.
2. **STAIRS as connector**: a cell type that moves the player between z-levels.
   The 7-type shortlist (Paolo's v1, marked "refine later") has NO stairs type.
   Candidate: add STAIRS as type 8, or treat as DOOR-variant (a door between
   floors). PAOLO'S CALL.
3. **UNDER-STAIRWAY = occlusion**: the player walking under an overhead thing
   is a RENDER-LAYER question — the stair/floor above draws OVER the player.
   The rig already has layerOverride semantics (DEPTH LAW: lowest index =
   nearest). Same principle extends to world cells: an OVERHEAD layer that
   draws above entities. Under-stairs is also a natural HIDING/ambush spot —
   fits the sewer agents and the whole surveillance theme.
4. **Second-story ACTIVITY**: NPCs/enemies on z=1 shooting down / being seen
   from below implies line-of-sight across levels + partial visibility of
   upper floors (cutaway or transparency when player is inside). Big system.
   Not demo scope unless Paolo says so.

## What the library has TODAY (checked this session)
Stairs/steps/ladders/platform packs exist in the HD masters (counts in session
log). Enough raw art to prototype stairs + a second story without new packs.

## PENDING PAOLO
- Is verticality IN the demo, or filed for the full game?
- STAIRS: new type 8, or DOOR-variant?
- Under-overhead occlusion: full hide, or silhouette/outline of the player
  showing through (common roguelite solve)?
- How many z-levels max (2? 3?)
