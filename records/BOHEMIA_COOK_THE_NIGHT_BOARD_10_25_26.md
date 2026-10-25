# COOK [eyes: the night board] (rule 179; rule 167(a)) -- BUILT 10/25, NOT YET SEEN

## HIS WORDS
"the combat map like went completely like almost like black and white... I was like how it was previously" (rule 167, 10/25).
EYES 10/25 on BUILD 10/25o (records/eyes_every_ask_10_25/q39, q43): "by day the boards are back in colour; both night fights read
almost black and white, grey-blue with pools of light blown out to white." The row's DONE WHEN: a night board keeps the day's hues,
darker and cooler, no blown white, side by side with the same board by day.

## THE REASON (plainly)
The colour back (bc076ba3) put the fight's pictures back. The night is not in the pictures: the fight page darkens the board itself
(slices/BOHEMIA_FIGHT.html, nightPass and nightPools). Three things in it made the grey and the white:
1. it pulled the whole board a third of the way to grey;
2. then it multiplied in a strong blue moon (185, 198, 240). Blue times a sandy tan cancels the tan: the hue turned a median of
   161 degrees, a tan street came out blue-grey;
3. a lamp's pool DOUBLED the ground's light. Pale concrete doubled is past white, so it clipped: 3 to 6 percent of the board pure
   white, in tile-shaped slabs.

## WHAT CHANGED (the ground only; the men's moonlight is their stand-off, rule 73, and stays)
- The ground's night: no pull to grey; a lighter, less blue moon (176..186, 189..197, 224..228: NIGHT_GROUND); then the day's own
  hue and colour laid back over the night's light ('color' blend, NIGHT_HUE 0.45). A tan street is a darker, cooler tan.
- A lamp's pool: the ground's own light lifted a little (POOL_GAIN), the lamp's warm light SCREENED over it (screen never passes
  white), then taken through the lamp's sodium colour (LAMP_WARM). The palest slab under a lamp is a warm cream with its detail.
- The ring of map round the board gets the same night.

## MEASURED (tools/bohemia_cook_the_night_board_10_25_26.js; his phone 390 x 844 at 3x and a computer 1440 x 900; seed 31)
| | strip before | strip after | freeway before | freeway after | suburb before | suburb after |
|---|---|---|---|---|---|---|
| hue turn at night (median degrees) | 161.3 | 3.4 | 161.9 | 2.9 | 161.7 | 2.8 |
| colour kept (night chroma / day's, same texels) | 0.45 | 0.75 | 0.47 | 0.73 | 0.45 | 0.79 |
| texels pure white | 5.6% | 0 | 4.8% | 0 | 3.1% | 0 |
| a lit tile over the dark (the fight gate's leg, needs 3) | 3.75 | 3.41 | 3.25 | 2.89 | 2.70 | 1.99 |

The fight's own night legs (gates/the_rebuilt_fight_plays_gate.js, run by name): LIGHT THAT INTERACTS ok, THE LIT TILES LOOK LIT ok
(the dimmest 3.23 to 1, was 4.19), NIGHT IS A COLOUR ok (0.069 vs the day's 0.060), A LIT TILE STANDS THREE TO ONE ok (3.41), the
lamps and pools ok, the screens ok. ONE LEG RED, AND RED ON MAIN BEFORE THIS: "a man stands off his ground at night as well as by
day" (main: night 1.77 against the day's 2.16; this: 1.80; under the sun main 1.72, this 1.63, the leg's line 1.63). The men's
night (MOON_SHADE, MAN_MOON) is COMBAT's; NOTE on their board.

Side by side, day and night: records/target/cook_night_board/after/side_by_side_phone_portrait.jpg and _computer.jpg; before:
records/target/cook_night_board/before/side_by_side_phone_portrait.jpg.

## THE GATE
gates/the_night_keeps_its_colour_gate.js (THE NIGHT KEEPS ITS COLOUR, in the suite): hue turn at most 25 degrees, colour kept 0.6,
under 0.2% white, not greyer than the day by a tenth, still night. On main's old fight: 3 FAIL (161 degrees, 0.45, 5.6% white). Now
6 of 6.

## REFERENCE CHECK (the 9/4 standing duty)
His own 'how it was previously', the day board (bc076ba3), side by side with the night; and the world: a street at night under
sodium lamps keeps its brick and its paint, bluer in the shade, warm under the lamp, never a white disc.

## NOT DONE, SAID
EYES has not seen it (rule 179): BUILT, NOT YET SEEN. The demo's committed cut was already not a cut of the workshop on main before
this (the cast key; RUN re-cuts).
