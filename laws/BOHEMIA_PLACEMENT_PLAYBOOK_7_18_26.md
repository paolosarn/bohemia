# BOHEMIA PLACEMENT PLAYBOOK + POST-MORTEM (7/18/26)

Paolo's order: the modular suburb was an easy task that ate half a day of iteration.
Record WHY, so home/building placement never bleeds a day again. This is the
reference for the next ~30 home models AND for every new district generator
(commercial next). Read it BEFORE writing any tile-placement code.

## THE ONE PROCESS RULE THAT WOULD HAVE SAVED THE DAY
RENDER IT AND LOOK. Every placement change gets screenshotted (headless chromium ->
PNG) and eyeballed BY ME before I claim anything or show Paolo. Most of the day was
lost claiming "packed / looks good" from gate COUNTS while the picture was full of
empty bands, void corners, and clone houses. A green gate is not a look. The loop is:
edit -> render PNG -> LOOK -> gate -> ship. Never edit -> claim -> ask.
Corollary: Paolo should never be the render loop. Do not surface a thing for his
judgment until I have looked at it and it is near-done (his standing workflow law).

## HOW HOMES (AND LOTS) SHOULD BE PLACED — THE CORRECT MODEL
1. ROADS FIRST, HOUSES SECOND. Draw the ENTIRE road network, then place houses.
   home() requires its footprint to sit on open ground and self-rejects otherwise, so
   houses never sever a street. Placing houses first (or roads after) is how the
   interior court got severed and connectivity broke.
2. HOUSES-FIRST INTENT, ROADS-MINIMAL. The developer maximizes LOTS; the road is the
   minimum that serves them (a rail+rung ladder). Never add road to squeeze in a
   house — that is always a bad trade (the corner-stub fiasco). Fill from existing
   frontage or leave it as dead-yard.
3. EVEN-DISTRIBUTE, DON'T BLIND-STRIDE. To fill a run end-to-end, spread N positions
   from lo to hi INCLUSIVE (both endpoints hit). `for(x=lo+STRIDE/2; x<hi; x+=STRIDE)`
   never lands on the far end, so the tail/corner stays empty. Use spread(lo,hi).
4. FILL FROM BOTH GRAINS. Houses facing one street grain leave empty strips along the
   perpendicular streets (a rung-facing house cannot sit against a rail — its body
   overlaps the road). Place houses on BOTH sides of BOTH rails and rungs; the strip
   beside each rail needs its own inner-rail column fronting that rail.
5. STRAIGHT SEGMENTS ONLY for rigid footprints. A rigid axis-aligned house cannot
   front a smooth curved road — the wide footprint clips the curve (201/206 placements
   failed on a sine collector). Real curvilinear tracts are STRAIGHT segments in a
   non-grid NETWORK (spine + cul-de-sacs, loops), not drawn arcs.
6. EXPLICIT PLACEMENT over modulo-stride on complex shapes. fillHomes-by-frontage with
   a stagger modulo placed ~3 houses because the modulo rarely aligned and footprints
   collided. Walk the streets you drew and place explicitly (placeRow/placeCol), or go
   greedy and let the 3-tile skirt check self-space them.
7. CONSTANT DEPTH, VARY WIDTH/STORY. Keep house DEPTH constant so the back-to-back row
   spacing math stays stable (3-tile yards); get variety from WIDTH, garage size,
   garage SIDE (L/R corner), and stories. Varying depth breaks the packing rhythm and
   forces fewer rows -> empty bands.

## THE BUGS THAT COST THE MOST (don't repeat)
- ASYMMETRIC INSET. A clearance computed from the origin gave different margins on
  opposite edges: top/left homes cleared the wall (dist 4, passed) but right/bottom
  homes were dist 3 and my OWN wall-check silently rejected them -> whole right/bottom
  bands + all four corners empty. RULE: when insetting inside a bounded region, verify
  the margin on ALL FOUR edges, not one. Test the far edge explicitly.
- DEAD GROUND RENDERED AS VOID. Backyards were near-black, so a fully-developed block
  read as "empty holes." Developed-but-dead must look like dead EARTH (textured dirt),
  never the background color. Empty-looking is the same as empty to the person looking.
- CORNERS SKIPPED BY STRIDE. Columns started at lo+STRIDE/2 and stepped, so the far
  corner never got a house. spread() fixed it. (See rule 3.)
- COUNTING BY CORNER HEURISTIC. Counting houses via "code-2 cell with no code-2 up/left"
  broke once two-story inset (code 9) mixed in. Count distinct footprint components
  (homeFootprints), not corner heuristics.

## FOR THE NEXT ~30 HOME MODELS
The house factory is engine/bohemia_suburb.js MODELS[] (typed: w, gw, story). Scaling
to ~30 is SAFE now because depth is constant and placement is spread/both-grain/
roads-first. Add models by width band + garage + story; the gate already asserts 3+
widths and both stories. Keep every new model's width <= LOTW-GAP so it fits its lot.

## FOR EVERY NEW DISTRICT GENERATOR (commercial is next)
Same spine: typed spec -> generator -> batch -> gate, and roads/parking FIRST then
buildings, straight segments, explicit placement, render-and-look every change, dead
world palette (textured, never void). A corner lot exits the streets it TOUCHES
(reuse the suburb's street-aware gate model).
