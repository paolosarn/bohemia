# COOK THREE [the thirteen repainted], round 1 (10/10/26)
Ruling: Paolo 9/21 'Rick Owens meets Balenciaga meets Bottega Veneta', 9/23 vibrance down, 10/10 'like a seventh grader is making my game' (rule 87).
Sheet: records/cook3/thirteen_repainted.png (before row / after row / runway card). Tool: tools/bohemia_cook3_the_thirteen_repainted.js. Paint layer: engine/bohemia_cook3_runway_paint.json (draft:true). The alpha is NOT edited; CHARACTER's FACTION_LOOKS untouched.
## The rule
Cloth pixels only, on the real 112 rig. Above the waist (52% of height), pixels within 28 deg of the faction's territory hue keep hue at 35% less saturation: THE ONE ACCENT. Everything else goes to runway neutrals by luminance (black, oxblood shadow, concrete, dust, bone; warm or cool per faction). 1px near-black outline. Colorful is five on purpose: vibrance only.
## Measured (cloth saturation before -> after, % accent)
Caravans .388->.234 37 | Colorful .541->.366 100 | Anarchists .508->.342 41 | Blues .651->.234 42 | Homeless .148->.259 0 | Church .588->.282 44 | Reds .558->.369 39 | Cartel .186->.053 1 | Trades .409->.335 41 | Mob .388->.388 37 | Network .489->.230 45 | Volunteers .128->.048 0 | Remnants .314->.108 41
## The finding that proves us wrong
Round 0 kept 70-97% of every outfit as 'accent': the thirteen are each ONE colour head to toe, so 'one loud accent' had no meaning on them. That is the seventh-grader read: a costume, not an outfit.
## Known defects (round 2)
1. Long coats (Blues, Remnants, Reds duster) are split at the waist line: the accent must follow the GARMENT, not a y line; needs the outer layer's own mask from buildFrame (CHARACTER to expose, read-only).
2. Homeless warm neutral went UP in saturation (oxblood stop); Remnants .108 may fall under faction_colour_gate's .28 floor once wired. Both must be measured against the gate before it goes live.
3. Twin is a palette card, not photographs: DIRECTION files the runway photos.
## ROUTED
DIRECTION: judge the sheet against the twin (rule 87). CHARACTER: an outer-layer mask from buildFrame. Not in a tab yet; VOTE after DIRECTION.

# ROUND 2 (10/10, cook3-vamily): THE ACCENT FOLLOWS THE GARMENT
Defect 1 closed: the waist line is gone. Each candidate garment (outer, back, base) is drawn ALONE on the bare body; its mask is where that differs from naked and agrees with the full frame. Every garment holding at least half the best garment's territory pixels carries the accent. Read-only; no CHARACTER change was needed (rule 12: the named blocker was not the blocker).
FINDING: the first try ('take the coat off and diff') went blind on Blues 18%, Church 6%, Remnants 20%, because the shirt under the coat is the SAME ramp. The solo draw fixed it: Blues 57%, Church 45%, Remnants 62%.
Measured after (sat, % accent): Caravans .248 62 | Colorful .366 100 | Anarchists .347 70 | Blues .298 57 | Homeless .259 0 | Church .287 45 | Reds .377 71 | Cartel .051 0 | Trades .334 63 | Mob .419 45 | Network .306 65 | Volunteers .048 0 | Remnants .141 62
OPEN for round 3: Remnants .141 is under faction_colour_gate's .28 floor (olive drab is dark, the stretch pulls it down); Mob rose .388->.419 (mustard over charcoal stays loud); Homeless rises on the oxblood stop. Then DIRECTION, then VOTE.

# ROUND 3 (10/10, cook3-vamily): THE THREE OUTLIERS, per-faction rules in the paint file
Mob vibranceDown 0.55: .419 -> .354 (no longer louder than before). Homeless cool neutrals: .259 -> .058 (drab on purpose again). Remnants no pull, cool: .141 -> .206.
HONEST: .206 is the cloth AVERAGE including the neutral legs; faction_colour_gate measures the faction's colour on the live frame, and this layer is not wired, so the gate has not been run on it. When the draw reads the paint file, that gate is the test.
STATE: the sheet is complete for DIRECTION (rule 87). Row stays CLAIMED until DIRECTION passes it, VOTE, and the draw reads engine/bohemia_cook3_runway_paint.json (CHARACTER's hook, one read, on DIRECTION's pass).

# ROUND 4 (10/10, cook3-vamily): DIRECTION's BACK (records/BOHEMIA_THE_REVAMP_PASS_ROUND_ONE_10_10_26.md) answered
1. ONE ACCENT ABOVE THE WAIST: Colorful and Network capped at the waist (capWaist in the paint file); trousers to concrete/black. Colorful sat .366 -> .248, Network .239 -> .208.
2. FOLDS NOT SPECKLE: every cloth pixel re-lit from the median luminance of its 5x5 cloth neighbours (the dot stamp goes, the garment's own shading stays), then three creases down the body below the chest, dark in the crease and lit on the left, one light side.
3. Silhouette (drape, length, volume) is CHARACTER's per DIRECTION; not touched here.
Back to DIRECTION for the pass, then VOTE.
