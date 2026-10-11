# THE TASTE SESSION (DIRECTION 10/11/26, row [the moodboard and the taste session], part b)

Rule 108 ROUND TWELVE (5) (Paolo 10/11: his eye used ONCE, not per asset): 'a TASTE SESSION in the VOTE tab, twenty
pairs, once; both become rules in the skill file'. ROUND THIRTEEN: nothing is FINAL before the moodboard; this session
is not a FINAL card, it is the one place his taste is asked as choices. Part (a), the moodboard, waits for his folder
(nothing has landed; the intake is the coordinator's runner).

## HOW IT IS MADE (so his tap is about one thing)
Three scenes, each laid only from his own purchased tiles (reference/art_bank: the cracked street, the soil, his cars,
street props, barricades, rubble, roofs, fire barrels, debris). Nothing is drawn (ROUND ELEVEN: use the packs, do not
imitate them). Floor tiles have their baked frames cut per tile and are laid edge to edge with no grid (rule 104b).
Each pair is the SAME scene twice with ONE measured operation changed: a 1 or 2 px dark ring round the objects; a
median-cut to N colours with no dither; a hard or soft shadow down-right (light from the top-left, the card); grime
stains from his burnt ground plus his small debris; his rubble, trash and a wreck added; saturation scaled; value
scaled; red and blue shifted for warm or cold. Which side carries the change is seeded, so leaning one way cannot pass
for a taste. 1080 px wide: one art pixel to one phone pixel on his phone (rule 89).

THE VOTE TAB ASKS THUMBS: **UP = THE LEFT PICTURE, DOWN = THE RIGHT.** The answer key is
records/target/taste/DIRECTION_TASTE_KEY.json. Tool: tools/bohemia_direction_taste_session.py.

## THE TWENTY
| # | scene | the one question | UP (left) | DOWN (right) |
|---|---|---|---|---|
| 1 | street | A LINE ROUND THINGS? | no line, the pack as bought | a 1-pixel dark line round every object |
| 2 | yard | HOW THICK A LINE? | a 1-pixel line | a 2-pixel line |
| 3 | ruin | A LINE ROUND THE RUIN? | no line | a 1-pixel dark line |
| 4 | street | HOW MANY COLOURS? | every colour the pack has | cut to 24 colours |
| 5 | yard | HOW MANY COLOURS? | every colour | cut to 64 colours |
| 6 | ruin | HOW MANY COLOURS? | 16 colours | 64 colours |
| 7 | street | SOFT OR HARD SHADOWS? | hard shadows | soft shadows |
| 8 | yard | SHADOWS OR NONE? | hard shadows | no shadows |
| 9 | ruin | SOFT OR HARD SHADOWS? | soft shadows | hard shadows |
| 10 | street | HOW DIRTY? | grime baked into the ground | clean, as bought |
| 11 | yard | HOW DIRTY? | heavy grime | a little grime |
| 12 | ruin | HOW DIRTY? | heavy grime | clean |
| 13 | street | HOW BROKEN? | a street still in use | wrecked: rubble, trash, a burnt car |
| 14 | yard | HOW BROKEN? | a yard kept tidy | a yard falling apart |
| 15 | street | HOW STRONG THE COLOUR? | the pack's colour | the colour at 55% |
| 16 | yard | HOW STRONG THE COLOUR? | the colour at 60% | the pack's colour |
| 17 | ruin | HOW STRONG THE COLOUR? | the colour at 80% | the colour at 45% |
| 18 | street | HOW DARK? | as bright as the pack | 70% as bright |
| 19 | yard | HOW DARK? | 60% as bright | as bright as the pack |
| 20 | ruin | WARM OR COLD LIGHT? | cold, a grey dawn | warm, a desert afternoon |

## WHAT HAPPENS TO HIS TAPS
The round his verdicts land, each axis's taps (two or three pairs per axis) become one rule in the skill file
(skills/bohemia-pixel-art/SKILL.md, the art lanes' rulebook) and one line on the card of numbers: line or no line and
how thick; how many colours; shadow hardness; grime; how broken; colour strength; how dark; warm or cold. Two pairs on
one axis that disagree are written as a range, not a rule. A pair he skips is no rule. Nothing per asset follows.

## PARKED (sweep AI, 10/11: the session WAITS on his folder and goes to VOTE only after the moodboard lands)
Built ahead of that note; not registered. The round his folder lands: hold the twenty axes against the moodboard,
re-make any axis it says is wrong, then register direction-taste-01..20 (session 'taste', UP = left).
