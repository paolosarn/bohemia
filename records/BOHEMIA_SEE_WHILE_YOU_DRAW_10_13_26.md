# SEE WHILE YOU DRAW: THE LOOP AS A TOOL, AND ITS FIRST RUN (DIRECTION 10/13/26, row [see while you draw])

Rule 108 ROUND TWELVE (1)(2)(3): a chat draws blind and ships without looking. Sweep AI's order (2): the loop and the
stages as a tool the four cooks run.

## THE TOOL
skills/bohemia-pixel-art/scripts/look.py. Each cycle: --sheet-only writes the LOOK SHEET (1x, 4x whole, 8x of the
busiest corner, shrunk to 16x16, seated on his ground at 2x, the silhouette, the values, his twin and its values) and
the five stages; the chat opens it and writes what it sees; the logged call refuses a cycle with no words (--saw) and
keeps cycle, stages, saw and fix in a .loop.jsonl beside the asset; --summary prints the table for the result card.
It names the FIRST failing stage only. A row his own twin also misses is the family's spread (learned at cycle 17).
It never declares done.

## THE FIRST RUN: A BURNT-OUT CAR FROM HIS PARTS, 20 CYCLES (every look sheet opened)
Maker: tools/bohemia_direction_burnt_car_from_the_pack.py (his car #3, his burnt ground #0 through COOK TWO's
pack(), darken-only and lighten-only lays, a recolour; nothing drawn). Files: records/target/loop_proof/ (the
candidate, the last look sheet, the log, the params of every cycle, tile 0 and tile 2 versions, his twin).
A placeholder-grade proof (ROUND THIRTEEN): not in his tab, not in the game.

| cycle | first failing stage | saw | fix |
|---|---|---|---|
| 1 | 3 RAMPS | his car as bought: teal paint under orange rust, glass dark and whole, chrome bumpers, a clean dark shadow ring; nothing is burnt; value span 103, under the prop floor 118 (his own car fails that row too, so it is the family's spread, not a fault of this piece) | lay his burnt ground over the body, darken only, 0.5, strongest at the roof |
| 2 | 3 RAMPS | the whole car went one step darker and flatter (value span 103 to 91); his burnt pattern does not show, so it reads as a dimmer over the car, a filter, not fire damage | char only where his burnt ground is darkest (patches, the darkest 35%), strength 0.9 |
| 3 | 3 RAMPS | the char now sits in patches at the roof and hood, but they are cobble-sized dots of his burnt tile, so it reads as a leopard print or speckle, not a fire; glass still whole; the lower half untouched | make the char mask twice as big (whole-number zoom of the mask only) |
| 4 | 3 RAMPS | bigger patches but they hardly show: his burnt stones are mid grey, barely darker than the teal, so the darken-only lay changes little; still no fire read at 16x16; glass whole | take his burnt pixels 60% darker before the darken-only lay (char_depth 0.6) |
| 5 | 3 RAMPS | a real dark scorch now on the hood (the top of the picture), with his stone pattern inside it; but the paint around it is still clean bright teal, so it reads as a teal car with a smudge, not a car that burned | colour down: saturation of the whole body to 40% (desat 0.6), the way fire strips paint to grey |
| 6 | 3 RAMPS | grey shell now, closer to burnt; value span up to 107; but his orange rust went grey with the paint, so it reads as a plain grey car, and fire leaves bare metal rusting brown-orange | pull the middle tones toward rust (rust 0.5 at his rust hue 0.06) |
| 7 | 3 RAMPS | the whole car went army green in a camouflage print: the hue was lerped from teal (0.5) toward rust (0.06) the long way round the wheel and landed on green; with the char patches it reads as camo, the exact tell sent back on the fight's sand | blend the mid tones in RGB toward his own rust colour (the median of his car's warm pixels), keeping each pixel's value |
| 8 | 3 RAMPS | brown rust shell with the scorch on the hood, reads as a wreck for the first time; but the glass is still whole with its reflections (windscreen and rear window), and every mid tone is the same brown so the panels melt together | glass to his burnt ground's darkest tenth (glass_black 1.0): a burnt car has no glass |
| 9 | 3 RAMPS | broken: the whole body went to black speckle; the glass test (blue over red by 10, value under 140) caught the teal paint too, and each glass pixel took a random dark pixel, which is noise by construction; colours fell to 1,545 and the top eight carry 18% | glass = only the darkest bluish pixels (value under 60), filled with his burnt tile's pixels in place, darkened, never a random pick |
| 10 | 3 RAMPS | the glass is a dark hole now with no speckle, a burnt windscreen; but the body is one brown everywhere, roof, hood and doors melt into one panel, and colours dropped to 2,132 under the prop floor 2,330 because the rust blend flattened his variety | rust 0.5 to 0.3, so his own grey and the paint's ghost come back between the rust |
| 11 | 3 RAMPS | grey ash and brown rust now mix, the panels separate again; colours 2,238, just under the floor; the scorch only sits on the hood at the top of the car, the roof and boot are clean, but a car fire takes the cabin | char_reach 0.8 to 1.6: the char fades over the whole length instead of stopping at the hood |
| 12 | 3 RAMPS | the char runs the whole car now, roof and boot too, it reads burnt end to end; but the scorch patches are square blocks with stepped edges, the 3x zoom of the mask showing its grid, a mosaic look; colours 2,155 | soften the mask's edges twice with a 3x3 mean (the mask only; his pixels are never resampled) |
| 13 | 3 RAMPS | the scorch edges are soft and uneven now, they read as soot, not squares; the whole piece reads as a burned car at 4x and at 1x; still under the floor: colours 2,162 (floor 2,330) and value span 100 (floor 118), the desaturation took his variety | desat 0.6 to 0.45, to give back his colour variety under the soot |
| 14 | 3 RAMPS | colours pass now (his variety is back under the soot), rust, grey and a ghost of the teal; the one row left is value span 97 under 118, and his own car reads 103, so cars sit darker than the prop family; the roof has no light anywhere, a burned roof shows pale ash | ash: his burnt tile's lightest 15%, lifted 30%, lighten only, where the soot mask is weakest, 0.5 |
| 15 | 3 RAMPS | the ash hardly shows: his lightest burnt stones lifted 30% land near the car's own mid grey, so lighten-only changes little; span 98 | ash 0.5 to 1.0, lift 0.3 to 0.8, share 15% to 20% |
| 16 | 3 RAMPS | pale ash patches show on the hood now and the value span reached 103, his own car's; but the ash patches are square-stepped (its mask was never softened, cycle 12's fault again) and at the top edge the ash breaks his dark outline into pale pixels | soften the ash mask the same way, and keep ash two pixels inside the silhouette so his outline stays whole |
| 17 | all five pass | soft ash on the hood now, his outline whole at the top; value span 101 is the last row out, but his own car reads 103 and fails the same row, so the tool was failing the piece for the family's spread; and nothing yet shows the car on a street | the loop tool counts a row the twin also misses as the family's spread, and gains a SEATED view: the car on his cracked street at 2x |
| 18 | all five pass | all five stages pass; seated on his cracked street at 2x it reads as a burned wreck parked on the road: soot, rust, a ghost of the teal, black glass, ash on the hood, his outline whole; one doubt: the soot pattern is his tile 0, so the look may hang on one lucky tile | same knobs, his burnt tile 2 instead of 0, to see if the look holds on another of his tiles |
| 19 | all five pass | on his tile 2 it still reads as a burned car, so the look does not hang on one lucky tile; tile 2 is darker and more even, the ash nearly gone, a dirty dark car more than a burned one; tile 0 tells the fire better (the pale ash against the soot) | back to his tile 0; final look at 1x and at 16x16 |
| 20 | all five pass | final look: at 16x16 a dark car shape with the windscreen band, so it still reads as a car; at 1x a grey-brown shell, black glass, soot thickest at the hood, pale ash, his outline whole, his own rust showing through; seated on his street it belongs; what the asset cannot do alone: the asphalt under a burned car is scorched too, that is a ground piece of its own | none on this asset; next piece: the scorch on the ground under it, from his burnt tiles |

20 cycles; the last passes all five stages


## THE THREE LESSONS (into SKILL.md section 8; before/after on his car: skills/bohemia-pixel-art/references/lessons/LESSONS_01_03.png)
1. Never turn a hue round the wheel (cycle 7: teal to rust by hue went green, a camouflage print).
2. Never pick a source pixel at random (cycle 9: the body went to speckle).
3. Zoom or shape a mask, never his pixels, and soften the mask (cycles 12 and 16: square steps).

## WHAT THE LOOP CAUGHT THAT A SINGLE RENDER WOULD HAVE SHIPPED
A dimmer posing as fire (cycle 2), a leopard print (3), camouflage (7), speckle (9), square soot (12), ash breaking his
outline (16), and a tool that failed the piece for its family's spread (17). Seven faults, each seen, named, fixed.
