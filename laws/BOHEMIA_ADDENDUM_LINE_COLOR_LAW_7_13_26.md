# BOHEMIA — LINE COLOR LAW (Paolo, 7/13/26)

## The law
1. YELLOW/ORANGE lines ALWAYS separate DIRECTION of traffic (medians,
   centerlines). Never used between same-direction lanes.
2. WHITE lines separate LANES moving the same direction.
3. ORIENTATION INTELLIGENCE required: line tiles must run WITH the road
   axis — N-S road uses N-S-running lines, E-W road uses E-W-running lines.
   A marking crossing the travel direction is only legal as a CROSSWALK.

## Grounding
Matches real US/Nevada road marking standards (yellow = opposing traffic
boundary, white = same-direction lane boundary) — the game's streets read
true to anyone who has driven.

## Enforcement
- Anatomy pool v2 metadata: every line tile carries color_class
  (yellow_direction | white_lane) + line axis per rotation variant.
- Generator rule: median/centerline rows draw ONLY yellow_direction tiles in
  road-axis orientation; lane-divider rows ONLY white_lane tiles in road-axis
  orientation; crosswalk = perpendicular by definition.
- Any future line art (purpose-made lane markings on the art-gap queue)
  inherits the law at birth.
