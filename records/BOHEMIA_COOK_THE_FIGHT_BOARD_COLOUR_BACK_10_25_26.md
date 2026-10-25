# COOK [the fight board's colour back] (rule 167, Paolo 10/25) -- SHIPPED

## HIS WORDS
"the combat map like went completely like almost like black and white... I was like how it was previously... I don't
know why you did that. Please have a reason."

## THE REASON (said plainly)
COOK 9cae20af (10/25 08:18, THE FIGHT FLOOR IN ACT ONE'S PALETTE) read rule 159 ("no rainbow, an economic apocalypse")
as "take the colour out" so the fight would match the regraded map. It multiplied the colour of every fight picture by
0.3 and capped it at 7 (CIELAB chroma). That took the board most of the way to black and white. Rule 159 meant faded,
dirty and rare colour. It never meant grey. The grade passed every number it was checked against and failed the only
check that counts: his eye on the real fight. Rule 167(b) now fences it: a grade that cuts colour by more than half is a
new look and goes to him first.

## WHAT CHANGED
- The 121 fight pictures are back to 9cae20af's parent, BYTE FOR BYTE (every git hash checked against the parent):
  the 35 present-day blocks (slices/fight_ground/block_<name>.webp), their 35 raided futures (block_<name>_raided.webp)
  and the 51 cover pieces (slices/fight_ground/cover_*.webp). The reclaimed futures were never graded and are untouched.
- SOUNDS' floor-table thresholds in tools/bohemia_sounds_fight_floors.py back with them: SAT, VAL = 0.18, 0.42 (the
  grade had moved them to 0.07, 0.35 to fit the grey floor). The table (slices/vote/travel_steps/fight_floors.json) was
  never rewritten by the grade, so it needed nothing; --check names the same three blocks it named before the grade
  (shore.0, shore.1, works.0; FIGHT STEPS 33/1, the same as main).
- No other lane touched any of these 122 files after 9cae20af (git log 9cae20af..origin/main on all of them: empty), so
  nothing of COMBAT's, UI's, RUN TWO's, ANIMATION's or SOUNDS' had to be kept around the restore.
- The grade tool (tools/bohemia_cook_the_fight_floor_in_act_one_10_25_26.py) now REFUSES --write and says why (rule
  167); its 'measure' stays as the instrument. Nobody can re-run the grey grade into the game by accident.
- Everything else COOK did in that round stands: the map, the towns in the ground, the streets, the region.

## MEASURED
| | the grey grade (9cae20af) | the colour back (now) |
|---|---|---|
| the 35 blocks' pixels, median chroma (tools/...fight_floor_in_act_one... measure) | under 4 | 12.7 (the pre-grade number exactly) |
| the demo fight on his phone, whole screen, median chroma | 3.7 | 8.7 |
| the demo fight on a computer (1440 x 900), whole screen, median chroma | 3.4 | 9.5 |
| the map he walks out of, whole screen, median chroma | 3.0 | 3.0 (untouched) |

The colour back is still a long way from a rainbow: a median chroma of 9 is dusty tan, sun-bleached roofs and grey
asphalt, the floor he knew. The map stays darker and greyer than the fight; that is how it was before 9cae20af too.

## THE CHECK ON THE REAL SURFACE: THE DEMO, PHONE AND COMPUTER
tools/bohemia_cook_the_fight_colour_back_shots_10_25_26.js walks the BAKED DEMO into a road fight the way
gates/every_fight_hands_him_back_gate.js does (a step, roadContactFight, ENGAGE pressed), with the fight's seed fixed
at 31 so both runs deal the SAME board (suburb + strip: suburb_stem.0/.1, corner.0/.1, strip.0/.1). "Before" serves the
graded pictures from 9cae20af in place of the game's; "after" is the game as it is now. Zero page errors on all four runs.

Before and after, side by side:
- His phone, held upright (390 x 844 at 3x): records/target/cook_fight_colour_back/phone_portrait_before_after.jpg
- A computer (1440 x 900): records/target/cook_fight_colour_back/computer_before_after.jpg

The map he walks out of beside the fight he walks into (after):
- records/target/cook_fight_colour_back/phone_portrait_map_beside_fight.jpg
- records/target/cook_fight_colour_back/computer_map_beside_fight.jpg

Numbers and the board each run dealt: records/target/cook_fight_colour_back/shots.json

## GATES (the same reds as main, none new)
EVERY FLOOR TILE IS A TRANSLATION 19/0; FIGHT STEPS 33/1 (the three blocks above, the same as main and as before the
grade); THREE BLOCKS 21/1 (cornerw missing from the library, not this); THE PIXEL FLOOR 11/2 (F2/F3 the same as main;
the new proof folder has its kind line in gates/pixel_floor_kinds.json); TILES ARE LEGOS the same LEG 3 lines as main;
REFERENCE CHECK 506/2, one fewer unchecked cook tool than main (the grade tool now carries its check; the new shots tool
carries one); PAGES PUBLISH the same two reds as main (the surface size, three kept folders).

## [bb research]
Battle Brothers never drains its battlefields: a steppe is yellow-green, a tundra blue-white, a swamp brown-olive, and
the grimness comes from the light, the blood and the ruin on top. The floor keeps its own colour and the mood rides above
it. That is the line 167(b) draws: wear, dirt and dust on the colour, never the colour removed.

## [analog horror]
Analog horror lives in a tape's colour going wrong (a cast, a bleed, a fade toward one hue), not in a picture with its
colour taken away. A grey floor reads as a rendering mistake; a dusty, faded, warm one reads as an old tape of a real place.
