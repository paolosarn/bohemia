# BOHEMIA — LINE COLOR LAW: ENFORCED (7/16/26)

## What was actually there
The blockgen header said "LINE COLOR LAW (semantic rows carry color class)."
Carrying a class is not enforcing a law. The generator wrote `yellow_direction`
on the median and `white_lane` on the dividers because the person writing that
line happened to know the law that day. Nothing checked it. Street gen v0 already
went DOWN once for exactly this family of miss.

And two real defects were hiding under it.

## Defect 1: nothing knew which way traffic went
The law is not "median = yellow." The law is **yellow separates DIRECTION,
white separates same-direction lanes.** The grid had no concept of direction at
all, so the colour was a coincidence that happened to be right. Any future
median/lane refactor flips it silently.

Lanes now carry `dir` (A or B). A divider is legal **iff the lanes actually
beside it agree (white) or disagree (yellow)** — checked against the real grid,
not against the intent of the code that wrote it.

## Defect 2: crosswalks inherited lane stripes
`grid[y][x].g = 'crosswalk'` overwrote the terrain and left `color` alone. So a
crosswalk cell landing on a divider row **kept `white_lane`**. Law rule 3 says a
marking across travel direction is legal ONLY as a crosswalk — and this was the
inverse: a with-axis lane stripe running straight through the crossing.

A crosswalk now OWNS its cell: `color=null`, `axis='NS'`, perpendicular by
definition.

## Defect 3: no axis anywhere
Rule 3 requires line tiles to run WITH the road axis. No cell carried an axis,
so nothing downstream could honor it — the tile picker had no way to ask. Line
cells now declare `axis`, and the block declares its road axis.

## The audit — `auditLines(block)`
Walks the real grid and re-derives every claim from the lanes actually present.
It catches a generator that writes the right colour for the wrong reason.

## Gate: `line_gate.js`, 18/18
Swept **2,000 street blocks** (500 seeds x 1/2/3/4 lanes each):
**0 violations, 59,024 yellow cells, 141,648 white, 11,168 crosswalk.**

The interesting half is the forgeries. The gate builds three illegal streets on
purpose and proves the audit catches each:
- yellow forged between same-direction lanes → caught
- white forged between opposing lanes → caught
- a line colour left behind on a crosswalk → caught

A gate that only ever sees correct input has proven nothing.

Also verified positively rather than by assertion: traffic really does oppose
across the median (`dir` A vs B), lanes either side of a white divider really do
agree, every line cell declares an axis, no crosswalk keeps an inherited colour.

## Sync
BOH_BLOCKGEN re-inlined across all carriers. Sync gate green, 11 modules.
Graphics 83/0 · line 18/18 · sidewalk 13/13 · tan 12/12 · scale 12/12 ·
lightreg 25/25 · V11 13/13.

## Four for four
ENGINE SYNC · TAN WALL · SIDEWALK SANCTITY · LINE COLOR. Every one locked and
filed, every one enforced by a comment, and every one either already broken or
one refactor from it. This one was broken in two places while the header claimed
compliance.
