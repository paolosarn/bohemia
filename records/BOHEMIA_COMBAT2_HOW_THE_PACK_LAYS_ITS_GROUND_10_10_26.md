# COMBAT TWO: HOW THE PACK LAYS ITS GROUND (the study page, rule 100c; Paolo 10/10 'understanding how those are cooked up so they don't stick out like sore thumbs')

COMBAT TWO is an art lane under rule 100(a): from this round it cooks to VOTE candidates and never writes slices/ or
engine/ until he votes FINAL on a family. Everything COMBAT TWO shipped before rule 100 stays as a PLACEHOLDER (rule 100e,
101a/c): not edited, not added to. This page is the study before any more board art.

## MEASURED (one 96 x 96 window = one pack tile; 40 random windows per picture, median distinct colours)
| what | colours per 96 px |
|---|---|
| his pack's ground tiles (reference/art_bank/ground, 392 tiles, most 94-96 x 96) | 4,140 (min 1,672) |
| COOK TWO's street kit from his pools (road_ew_both / walk / junction) | 1,909 / 2,109 / 1,699 |
| our cooked town blocks (subs.0 / corner.1 / ruin.0 / freeway.0) | 18 / 29 / 20 / 20 |
| our desert block (scrub.0, dressed from his desert pool) | 2,737 |
| our casino floor (cooked from the ramps) | 4 |

THE FINDING: where we dressed from his pools (the desert, the kit) the density is the pack's order of magnitude; where we
COOKED (flat fills from the eight-step ramps, rectangles, ellipses) it is two hundred times poorer. That is the 'AI slop'
he named, as a number. ROOT CAUSE IN THIS LANE: B.guard's colour set (his ramps plus his tile colours) let flat ramp fills
pass as 'his colours'; a colour check is not a density check. A pack tile is a photograph-dense surface: thousands of
colours, light from the upper left, no outline on the ground, texture at the single-pixel scale.

## HOW HIS TILES MEET A NEIGHBOUR
- the left and right columns of a pack ground tile differ by a median of 15 levels (of 255): near-tileable, never exact;
  the pack hides the seam with texture, not with a matching stripe. Our Lego studs (rule 77) match exactly by painting a
  12 px ring: correct for the edge reader, but a ring of copied pixels is the kind of border rule 104b now forbids.
- the kit (COOK TWO) meets by stamping one pool texture across the seam in brick rows: the right way.

## WHAT CHANGES IN THIS LANE (from this round)
1. No new board art: the warehouse interior and the settlement futures are not cooked here; they are new art (rule 101d is
   the cooks' one-at-a-time road) and the settlement pictures are COOK FOUR's placeholder (rule 101c).
2. Boards are laid only from kits a cook lane made from his tiles, as candidates in the VOTE tab, until he votes FINAL.
3. A density floor goes beside the seam checks the day the next kit lands: a laid tile under 1,000 colours per 96 px is a
   cooked fill, not his pack.

[bb the battle map] Battle Brothers' battle ground is painted-dense terrain with hand-placed props; nothing in it is a
flat fill. OURS: the same rule, measured.
