# BOHEMIA — STREET CANON (Paolo, 7/13/26)

## Verdict on street gen v0: DOWN (premature), idea credited
Claude generated before scale training was complete. Cars read 2x2 (law is
2x3); a fire extinguisher stood human-sized (ITEM_SCALE never applied);
no crosswalks; no middle lane. Sidewalk-vs-street distinction: credited.

## STREET CANON (Paolo-stated)
1. REALISTIC WIDTHS: Bohemia streets are real Vegas streets. A two-lanes-
   each-way road ≈ 16 cells wide, possibly more. Never toy-width (v0 used 5).
2. STREET ANATOMY required: lanes per direction, MIDDLE/turn lane,
   CROSSWALKS at intersections, sidewalks flanking. Lane markings are
   structure, not decoration.
3. Ties to VALLEY SCALE LAW + reference-grid: real arterial proportions.

## ORDER CORRECTION (Paolo steer)
Street generation PARKED until: Stage 1 vision audit complete (naming catches
scale absurdities like extinguishers) + scale law APPLIED in the render path.
Training before generating. Prerequisite chain: vision naming -> scale
application -> anatomy pieces (lane lines, crosswalk pool) -> then gen v1.
