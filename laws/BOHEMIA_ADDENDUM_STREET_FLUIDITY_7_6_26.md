# BOHEMIA ADDENDUM: STREET FLUIDITY PASS + RAIL CROSSING FIX (7/6/26)

## RAIL CROSSING FIX (Paolo's bug report: "i cant walk past the traintracks
## ever thats goofy")
Root cause: rail was a road-class district in the fine world but NOT in the
city-mode ROAD walkability set, so the valley-spanning rail line was an
uncrossable wall for the city marker. FIXED: rail added to city-mode
walkability. LAW: TRACKS ARE CROSSABLE PATHS, NEVER WALLS. (Post-crash
grounding: rail lines are walking corridors; every crossing is at grade.)
Human mode was already correct (rail cells walkable). Gate added: rail tile
exists + is city-walkable.

## THROUGH-STREET LAW (LOCKED, the fluidity core)
Interior street offsets now hash per COLUMN (vx from hash(seed,tx)) and per
ROW (hz from hash(seed,ty)) instead of per cell. Result: the two interior
streets of every built neighborhood ALIGN with their neighbors', so secondary
streets read as CONTINUOUS lines running the valley through ring after ring,
not per-cell dead-ends. Combined with the street-ring law, the walkable
street graph is now: valley-long secondary streets + neighborhood rings +
overmap road bands, all connected.

## SIDEWALK LAW (built)
One paved band beside the ring (inside face) and beside every interior
street, both sides. Paved texture (slab seams) against asphalt reads the
street edge instantly.

## CENTER-LINE DASHES (built)
Road-district bands (arterial/strip/freeway/beltway/interchange) draw a
dashed center line along the band axis. Rail keeps ties, no dashes.

## BUG FIXES SHIPPED WITH THE PASS
- SIGNED-SHIFT BUG: lot jitter used h>>4 / h>>8 on a uint32 hash; hashes
  >= 2^31 went negative and stamped prefabs at negative coords (a house at
  y=-7, off the neighborhood). Fixed to unsigned shifts.
- BLOCK-FIT BUG: the lot grid force-fit blocks narrower than the prefab
  (cols=max(1,...)), pushing houses onto street bands. Fixed: lots skip
  prefabs their block cannot fit + stamps clamp inside the block.
- Gate recalibrated: structure-mass threshold was tuned to the old dense
  rect scatter; now tuned to the locked 8-12 house read.

## GATES
15/15 world proofs (incl. through-street column alignment + rail
crossability), 19/19 texture, 7/7 bike.

## STILL OPEN ON STREETS [PENDING Paolo]
- Whether neighbor rings should open GATES onto arterial sidewalks visually
  (functionally connected already).
- Crosswalk markings at ring corners.
- Rail crossing planks where streets meet tracks (visual).

## BLUE VOID BUG (Paolo's field report 7/6 night: rode far, world went blue)
ROOT CAUSE (reproduced headless, then fixed): new chunks were born with LRU
timestamp t=0; the cell-cache eviction picks minimum-t, so the moment the
cache hit its 520 cap (~33 neighborhoods of travel), EVERY newborn chunk was
evicted the instant it was created. chunkCanvas then found no record and
painted nothing: void. One-line fix: chunks are born LIVE (t=++tick).
SHIPPED WITH IT: CANVAS POOL LAW: chunk texture canvases come from a bounded
recycled pool (48 pooled + 110 live cap; evicted canvases recycle or zero
their buffers) so total live canvas memory is bounded forever, protecting the
iOS canvas budget on any ride length. STRESS GATE added: 80-neighborhood ride,
far chunks must still bake, live canvases <=111.

## MUSIC CATALOG FINDINGS (7/6 night)
- This alpha bundles 50 songs (14 factions + slot-2s + 36 loops + 2 menu).
  REPO MAN and the newest batch are NOT in this lineage; they live in the
  session that cooked them. [PENDING: Paolo provides that session's export
  or alpha, Claude merges the new catalog in.]
- Paolo's field read (filed as direction): the existing catalog fits FACTION
  SCENES, dialogue, and interiors. ACT-ONE OVERWORLD AMBIENCE is a missing
  music category and needs its own cook batch. [PENDING, Paolo's vibe
  direction for overworld ambience.]
