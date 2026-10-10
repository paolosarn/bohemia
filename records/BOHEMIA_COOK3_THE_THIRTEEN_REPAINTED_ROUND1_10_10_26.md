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
