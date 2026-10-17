---
name: bohemia-pixel-art
description: Load before making, cutting, recolouring, judging or describing ANY Bohemia art asset (a tile, a prop, a car, a house, a lamp, a door, a marking, a person, a portrait, an icon). Holds the numbers measured from Paolo's 1,927 purchased tiles, the family palettes, the build order, the faults with limits calibrated on his packs, the asset contract, the do-not list, and the one check every candidate runs before DIRECTION sees it.
---

# BOHEMIA PIXEL ART (the rulebook every art chat loads first)

Owner: DIRECTION. Source of every number: his purchased tiles in `reference/art_bank/` (CORPUS.json, the 7/13 UP set)
and the locked laws. Never our placeholders, never memory. Rules 100, 101, 104, 105, 107, 108.

## 0. THE FOUR THINGS THAT OVERRIDE EVERYTHING BELOW
1. **USE HIS PACKS, DO NOT IMITATE THEM** (rule 108 ROUND ELEVEN). An asset is cut, laid, recoloured or composited
   from his tiles, or made by the rig or the generator with his tiles as the reference. It is never drawn "to look like"
   them, rectangle by rectangle, in Python or JavaScript. Every asset names the bank path, model file or pack card it
   came from; no path, no asset.
2. **NOTHING IS FINAL UNTIL HE SAYS FINAL** (rules 100, 101, ROUND THIRTEEN). A round makes ONE asset on ONE sheet
   beside its pack twin at one art pixel to one phone pixel. Nothing goes into slices/, engine/ or the demo.
3. **YOUR OWN OPINION OF YOUR PICTURE IS NOT IN THE LOOP** (ROUND TEN). Never write "looks good". The check says built
   right or not; DIRECTION and he say good.
4. **LOOK WHILE YOU MAKE** (ROUND TWELVE). Render, look at 1x, 8x and shrunk to 16x16, write the faults in words, fix,
   again. A sheet rendered once is a failed sheet. Keep the log beside the asset.

## 1. THE NUMBERS (one table; detail in references/numbers.md)
| what | the number | from |
|---|---|---|
| a floor tile, door, wall piece, lamp | 96 px on the long side, never smaller | the bank; rule 105 |
| a prop | never under 29 x 36; a car or crate about 96 wide | the bank; rule 105 |
| an icon / a map marker / a portrait | at least 32 x 32 / 40 x 40 / 96 x 96 | rule 105 |
| a person | the 112 px box, about 100 painted, one size on every surface | rule THE PERSON MAY NOT ZOOM |
| colours in one tile | 3,000 to 4,500 (fewest tenth 1,900 to 3,100); the top 8 carry 4 to 9% | the card |
| value span (5th to 95th) | road 118, buildings 146, props 159, lamps 185; the mean sits at 51 to 72 of 255 | the card |
| saturation | doors 0.15, road 0.24, buildings 0.31, props 0.47; paint and blood 0.91 | the card |
| warmth | 83 to 93% of pixels have more red than blue | the card |
| light | from above, a little from the left: top half brighter in 72 to 100% of tiles | the card |
| outline | ground none; props and lamps soft (about 5 darker); buildings 1 px dark brown; doors a hard frame | the card |
| grain | a light-dark step holds 1.6 to 2.0 px along a row; never a flat fill, never a checker dither | the card |
| stray pixels | 6 to 12% at 8 light-dark steps (exact-colour orphans are NOT a fault on his kind of tile) | references/faults.md |
| pixel size | one; scale only by whole numbers; never a mixel | craft law 9 |
| seams | none you can see: cut his tiles' baked 3 to 4 px frame, make the edge meet (rule 104b) | COOK TWO's study |
| roofs | front gables, slopes seen from the front, never a roof plan (rule 104e) | COOK FOUR's study |
| facings | everything that turns: 8 drawn directions, each with idle, step and its own clip; a mirror is not a direction (rule 107) | rule 107 |
| motion | twelve drawn keys a bar at 120 BPM; no joint turns more than 120 degrees between two keys | the envelope law |
| the grid | square | the third votes |

## 1b. ANYTHING THAT TURNS: THE MASTER RIG
A person, a beast, a car: through tools/bohemia_direction_master_rig.py (one camera, tilt 45, never turned, 57 px a
metre, eight facings, his palette). Its rig.json must pass gates/sprite_scale_gate.py. Never a mirrored half, never a
hand-drawn facing (records/BOHEMIA_THE_MASTER_RIG_10_16_26.md).

## 2. THE PALETTES
`references/palettes/<family>.gpl` (road, ground, marking, settlement, door, lamp, prop): 64 colours each, median cut
over every opaque pixel of the family, dark to light, with each colour's share. They are a SNAP for anything the rig or
the generator makes (so it lands in his colours), and a reading aid. His tiles are not limited-palette art: a cut from
them keeps all its colours. Never invent a new palette for one asset.

## 3. THE BUILD ORDER (each stage looked at before the next; references/build.md)
1. **SOURCE**: pick the pack tiles or the model it comes from; write the path down.
2. **SILHOUETTE**: one flat value; does it read at 16 x 16? If not, stop here.
3. **BIG SHAPES AND LIGHT**: light from above-left; the shadow side is one step, not a gradient.
4. **RAMPS**: the family's palette; hue shifts warm into light and cool into shadow, never only darker.
5. **DETAIL**: wear where hands, feet, water and sun hit, authored, never a noise layer (AH-01 R10).
6. **EDGE**: the family's outline rule (section 1); a black line round anything is not his.
7. **SEAT IT**: a contact shadow down-right; next to nine of its family at 1:1 in one picture.

## 4. THE CHECK (run it on every candidate, paste its lines on the sheet)
```
python3 skills/bohemia-pixel-art/scripts/check.py <candidate.png> <family>
```
It runs the card's eight rows (size, colours, top eight, value span, saturation, light, edge, grain, on his family's
own bands) and four craft rows (stray pixels at 8 steps, one pixel size, no banding, light from above). BACK when the
card says BACK or two craft rows are out. On his own tiles 6% come back; on our fight placeholders, all of them.
Passing it gets a sheet to DIRECTION's eye, never to FINAL. The faults and their sources: references/faults.md.

## 5. THE ASSET CONTRACT (references/contract.md)
One asset, one sheet: the candidate at 1:1, its pack twin beside it, the check's lines, the source path, the loop log.
Names: `<lane>_<family>_<thing>_<n>.png`. Canvas per kind from section 1. Transparent background, no matte. Anchor at
the foot centre. A sheet goes to records/ or the cook folder only.

## 6. WHAT NOT TO DO (references/dont.md)
- No pixel drawn as a number in code. No rectangle-by-rectangle tile in Python or JavaScript (ROUND ELEVEN).
- No asset smaller than its floor. No non-integer scale. No blur, no resample, no filter to fake grit or horror.
- No black outline. No pillow shading. No checker dither on a surface. No flat fill bigger than a thumbnail.
- No visible border where two floor tiles meet. No roof plan. No mirrored half sold as a facing.
- No "it looks good" from the maker. No FINAL before his word. No reference game he has not named.
- No colour that is not on the family's palette in anything the rig or generator made (snap it).

## 7. WHERE EACH RULE LIVES
The card of numbers: records/BOHEMIA_THE_CARD_OF_NUMBERS_10_10_26.md. The craft laws: laws/BOHEMIA_PIXEL_CRAFT_LAWS_7_27_26.md.
The floor: records/BOHEMIA_PAOLO_THE_PIXEL_FLOOR_IS_THE_PACKS_10_10_26.md. The studies: records/BOHEMIA_HOW_THE_PACK_DID_IT_*.md
and records/BOHEMIA_COOK4_HOW_THE_PACK_DID_IT_THE_PLACES_10_10_26.md. The analog horror bible: records/BOHEMIA_ANALOG_HORROR_BIBLE_9_20_26.md.
His taste, when the moodboard and the taste session land: a new section 9 here, one rule per axis.

## 8. THE LOOP: LOOK WHILE YOU MAKE (every asset, every cycle)
```
python3 skills/bohemia-pixel-art/scripts/look.py <cand.png> <family> --twin <his tile.png> --ground <his ground.png> --sheet-only
#   -> OPEN <cand>.look.png (1x, 4x, 8x busiest corner, 16x16, seated on his ground, silhouette, values, his twin)
python3 skills/bohemia-pixel-art/scripts/look.py <cand.png> <family> --twin ... --ground ... --log <asset>.loop.jsonl \
        --saw "<what you see, in words>" --fix "<the one knob you change next>"
python3 skills/bohemia-pixel-art/scripts/look.py --summary <asset>.loop.jsonl     # the table for the sheet
```
It names the FIRST failing stage (silhouette, shapes and light, ramps, detail, edge); work on that one only. A row his
own twin also misses is the family's spread, not a fault. Change ONE knob a cycle. Twenty cycles or more, the last
passing all five, then DIRECTION's eye. The proof run: records/target/loop_proof/ (a burnt car from his parts,
20 cycles, records/BOHEMIA_SEE_WHILE_YOU_DRAW_10_13_26.md).

LESSONS (each one cost a cycle; the before and after are in references/lessons/LESSONS_01_03.png, on his car):
1. **Never turn a hue round the wheel.** Teal pulled toward rust by hue goes through green (camouflage). Blend in RGB
   toward a colour taken from his own pixels.
2. **Never pick a source pixel at random.** A random pick per pixel is noise by construction. Take his pixels in place.
3. **Zoom or shape a mask, never his pixels, and soften the mask.** A whole-number zoom of a mask shows its grid as
   square steps. Soften the mask; his pixels stay as they are.
4. **Light a lit side TOWARD the light's colour, multiply only the shade side.** Multiplying a red brighter turns it pink. (COOK THREE, Reds loop L07, records/cook3/loop/REDS_LOOP_LOG.md)
5. **Smooth inside one body part, never across parts.** A blur that crosses the sleeve erases the arm. (Reds L04)
6. **Do not snap a pack-style asset's shading to a few steps.** It reads crisp to the eye and fails the card: 113 colours, the top 8 at 49%. His art is not limited-palette. (Reds look 9, look.py cycle 1)
7. **A paint pass cannot add colours the source does not have.** A code-drawn garment carries 3 shades per ramp; no pass on top reaches his 2,330. Fix the source (the rig, the generator), not the paint. (Reds looks 10-12)

8. **Read a render's shading stretched between its own dark and its own white.** A white mannequin read from zero puts every pixel at the top of the ramp (one flat); a clamp at either end makes a flat the top-8 row catches. (COOK THREE, the rig's man L17 to L20)
9. **When a colour is wrong, test the BASE before the light.** Two light knobs did nothing to the salmon; the accent's value was the fault. (the rig's man L14 to L16)
10. **Count a sprite's colours as DENSITY, colours a pixel, against his 0.81.** The card's 2,330 is a 96 x 96 tile's number; a person has about 1,660 opaque pixels. (the rig's man L21, L26)
11. **A weave is his tile's detail with its fill taken out, laid in place; its colour at a low strength.** Full strength drags the tile's greens onto wool as hot specks. (the rig's man L22, L26, L27)
12. **Look at every facing before trusting one.** The skin sample hitting the twin's brow and the hand rule reading a hanging forearm as skin were invisible from the front. (the rig's man L29, L32, L33)
