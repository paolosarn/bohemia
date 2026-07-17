# BOHEMIA — GRAPHICS CHAT RESTORE
**Date:** 7/16/26
**Reason:** previous graphics chat died. This is the clean re-mount.

## RESTORED, VERIFIED THIS TURN

**Graphics engine: 14/14 modules recovered bit-exact from the storage bundle.**
`BOHEMIA_GRAPHICS_ENGINE_MASTER_7_16_26.js` is a concatenation with plain-text `### FILE:` /
`### MD5:` headers, so it does not node-check as one file (by design, it is storage not code).
Split rule that reproduces every original byte: take the section body, strip leading newlines,
strip trailing newlines, add exactly one trailing newline. All 14 md5s match the upload master.

| module | md5 verified | node |
|---|---|---|
| BOHEMIA_AGENT_LOOK_7_10_26.js | yes | clean |
| BOHEMIA_AGENT_RAGS_7_10_26.js | yes | clean |
| BOHEMIA_SKIN_PALETTES_WORLD_7_10_26.js | yes | clean |
| bohemia_blockgen.js | yes | clean |
| bohemia_daycycle.js | yes | clean |
| bohemia_engine_graphics_7_14_26.js | yes | clean |
| bohemia_graphics_tests.js | yes | clean |
| bohemia_light_pass.js | yes | clean |
| bohemia_overmap_bridge.js | yes | clean |
| bohemia_plotgen.js | yes | clean |
| bohemia_powergrid.js | yes | clean |
| bohemia_prop_scale.js | yes | clean |
| bohemia_slice_core.js | yes | clean |
| bohemia_transitions.js | yes | clean |

**Graphics suite: 83 pass / 0 fail.**
**Purity gate: py-compiles clean.**

## BUG FOUND AND KILLED — bohemia_engine.js export clobber

The project copy of `bohemia_engine.js` did not run at all. Last IIFE in the file
(the Retarget module, line ~3622) did `module.exports = API`, wholesale replacing the
exports object that `BohemiaEngine`, `FrameCache`, `Persist`, `CombatBridge`, `NPCFactory`
and `Wardrobe` had already attached themselves to. Anything requiring the engine got an
object with 9 retarget functions and nothing else. `bohemia_tests.js` crashed on line 15.

Fix: `module.exports.Retarget = API` plus the browser global, instead of replacing exports.
Root cause, not a patch: the file has six export sites and only that one used assignment
instead of attachment.

**Alpha engine suite after fix: 80/80 pass.** 24 posed frames, 0 spurs.

## STATE CARRIED IN (from BOHEMIA_PROJECT_UPLOAD_MASTER_7_16_26.md)

**LOCKED**
- CLUSTERED POWER LAW: ~12% of circuits alive (10-15% band), every living cluster owned,
  light equals territory, NETWORK zones eerily perfect
- 1,662 feeder-scale circuits, seed 12345 = 11.6% alive, clustering proven
- Streetlight height + power law, tall lamps pour 12-cell arterial glow, dead lamps stay dead
- Great Sweep complete: 2,604 verdicts, 1,061 UP / 666 DOWN / 530 UP[BIG] / 300 UP[SMALL]

**PENDING, PAOLO'S CALL**
- WHERE the NETWORK's zones sit (machinery ready, placement is a map call)
- Act-1 grid-power ruling (which lights are active)
- Lamp spacing in game cells
- #26 tile color conflict
- Item scale law confirmation
- Currency logos (supplies, energy, medicine sit tagged in the verdict stream)
- LT0 eye pass, batch-2 wall picks, patrol

**MISSING, NOT LOST**
- Slice V10: built after the 7/14 manifest, never stamped, never zipped, died with the old chat.
  Highest stamped slice is V8 and V8 has zero powergrid refs, so V8 predates the power law.
  Rebuildable from `bohemia_slice_core.js` + `bohemia_powergrid.js`, both restored and green.

## IN THIS SESSION'S UPLOADS (art bytes, session-only, present and readable)
BOHEMIA_ACT1_GREAT_SWEEP_7_10_26.html (16 MB) · BOHEMIA_HOUSE_FACTORY_GALLERY_7_14_26.html (2.6 MB) ·
BOHEMIA_LIVE_SLICE_V5_7_14_26.html (5 MB) · BOHEMIA_LIVE_SLICE_7_14_26.html · BOHEMIA_DOOR_SINGLE_LEAF_PROOF_7_14_26.html ·
BOHEMIA_STALL_STRIPING_PROOF_7_14_26.html · BOHEMIA_GROUND_MASTER_SET_7_10_26.txt · BOHEMIA_MULTICELL_SET_7_10_26.txt ·
BOHEMIA_ITEM_CATEGORY_PROPOSAL_7_10_26.txt · BOHEMIA_TERRAIN_PICKS_7_14_26.txt · BOHEMIA_TILECAT_REDMAG_7_10_26.txt · bohemia_plotgen.js

**Not uploaded here:** the 4 HD tile repo parts (172 MB) and the cooked art banks (38.7 MB).
Those need to come in whenever tile cooking happens today.
