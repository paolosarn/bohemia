# COOK FOUR: THE STRAIGHT-ROOF FAMILY IN THE VALLEY'S TANS (10/18/26, round 6 of [a house a man can live in])

THE ASK. His vote on the family (10/17, the thirteenth votes, UP): "Bet, bro, I honestly should be able to color
the roof these roofs to make it more tan like they're looking bright, medieval, orange and like metal blue and
shit like bro." The coordinator's note on the board: "Next round: the family's roofs in the valley's tans from his
own tiles, nothing bright, one sheet." One asset this round (rule 101d): the same five houses, only the roofs.

## WHAT WAS MADE
One sheet, records/target/COOK4_THE_FAMILY_IN_THE_VALLEY_TANS.png (2353 x 1910): his pack house #30 and the man
at 1:1; a strip showing his clay field #26 beside its tan version and the source tile, and his slate field #27
beside its gravel version and its source, with the five-step ramp of each as swatches; then the five ranch kinds
exactly as he voted on them (plain, garage, carport, the L wing, the porch), roofs recoloured; and, bottom right,
the orange plain ranch he voted on, for the eye.

Files, all new (a placeholder is never edited, rule 101c; the orange family's files stay):
- reference/art_bank/settlement/COOK4_RANCH_TAN_{PLAIN,GARAGE,CARPORT,WING,PORCH}.png (the houses)
- reference/art_bank/settlement/COOK4_ROOF_TAN_FIELD.png, COOK4_ROOF_TAN_EAVE.png (his #26 and #14 in the desert tan)
- reference/art_bank/settlement/COOK4_ROOF_GRAVEL_FIELD.png, COOK4_ROOF_GRAVEL_EAVE.png (his #27 and #15 in the gravel tan)
- reference/art_bank/settlement/COOK4_THE_VALLEY_TANS.json (the palette file, rule 114c)
- tools/bohemia_cook4_the_valley_tans.py (the tool; it imports the round-4 family tool and redirects its roof tiles)

## WHERE THE TANS COME FROM (rule 82a: his tiles are the source and the bar)
His pack has three roof sets. The clay barrels (#26: hue 17, sat .89, the orange he named). The slate (#27: hue
357, sat .04, the "metal blue"). And a tan-hued set (#3, #8, #12, #16, #22, #24, #28, hue 32) which is THATCH:
DIRECTION ruled 10/10 "clay and slate only, no thatch", and no Las Vegas ranch has a straw roof. So the pack holds
no tan roof tile to lay, and the tans had to come from his other surfaces:

| tan | his tile | measured | goes on |
|-----|----------|----------|---------|
| the desert tan | Wall tiles (1) #7, his flat tan render | rgb 89 74 60, hue 30, sat .32, val .35 | the pitched tile roofs (was clay) |
| the gravel tan | rocks and stones #53, his grey-tan flagstones | rgb 108 101 87, hue 40, sat .20, val .43 | the garage, carport and porch roofs (was slate) |

The real thing: the Las Vegas tract roof is tan or sand concrete S-tile on the pitched roofs and grey-tan gravel
built-up roofing on the flat ones. Never glazed orange, never slate.

## HOW THE ROOF WAS RECOLOURED, AND WHY IT IS NOT A SHADE()
Rule 114's fourth tell is "a ramp that only darkens", the signature of a shade() function. This is the opposite:
- every face pixel of his field keeps its own rank in the field's light-to-dark order, so every barrel tile keeps
  its highlight, its body and its shadow gap exactly where he painted them (the structure is his, untouched);
- it takes hue and saturation from the pixel of the tan source that sits at the same rank in that source's own
  order, so the ramp is his tan tile's painted ramp, not one hue darkened;
- plus six tenths of the clay's own hue shift at that pixel (his clay runs 10 to 21 degrees dark to light), so
  the tan runs warm at the highlights the way the clay did;
- the value is pulled half way toward the source's value at that rank, so the clay's glare comes down ("nothing
  bright") without flattening the tiles;
- the wooden eave frame under the tiles (brown, hue 25 to 45, sat .4 to .75) is left as he painted it.

Measured by the tool every run (the palette file carries the same numbers):

| field | before (hue, sat, val) | after (hue, sat, val) | ramp hue 30th to 90th rank |
|-------|------------------------|-----------------------|----------------------------|
| COOK4_ROOF_TAN_FIELD (his #26) | 18, .89, .40 | 32, .33, .38 | 27 to 32 |
| COOK4_ROOF_TAN_EAVE (his #14) | 17, .89, .40 | 30, .33, .38 | +4 |
| COOK4_ROOF_GRAVEL_FIELD (his #27) | 0, .04, .22 | 41, .23, .33 | +2 |
| COOK4_ROOF_GRAVEL_EAVE (his #15) | 228, .09, .22 | 42, .20, .33 | -12 |

The tool refuses a result whose hue is outside 20 to 48 or whose saturation is .5 or over: a roof that came out
bright would not save.

## THE CAPTION (rule 114c): native pixel size, palette file, light
His 96 px pieces at 1:1, the body's 57 px a metre. Palette file reference/art_bank/settlement/COOK4_THE_VALLEY_TANS.json.
Light from above (+9.3 top over bottom, the study page records/BOHEMIA_COOK4_HOW_THE_PACK_DID_IT_THE_PLACES_10_10_26.md).

## THE THREE DIFFERENCES FROM THE TWIN (rule 82, on the card)
1. COLOUR: his pack house #30 wears the orange clay; ours wear the tan of his own render wall, and the flat roofs
   the grey-tan of his flagstones. Hue 17 at sat .89 became hue 32 at sat .33.
2. STRUCTURE: unchanged. Every tile keeps his highlight, body and shadow gap; the eave frame is his pixels; the
   roof shape is the measured one (roof/wall 1.49, eaves 14 percent, lean 6 percent).
3. GROUND AND MASSING: as the family he voted on; nothing else on the five houses moved, so his vote is on the
   colour alone.

## WHAT IS NOT DONE, SAID PLAINLY
- The tan ramp's hue shift is small (27 to 32 degrees over the 30th to 90th rank) because his render wall's own
  ramp barely shifts hue; rule 114a's style guide will want at least 8 degrees, and when DIRECTION writes that
  number this tool's HUE_KEEP goes up to meet it. Not guessed ahead of the guide.
- The tile roof's tan sits close in value to the cracked plaster wall under it (roof val .38, wall val .48); the
  eave shade, the outline and the tile structure keep them apart on the sheet. If he says the roof melts into the
  wall, the first thing to try is the darker tan of his wall #1 (hue 27, val .36) for the roof.
- One tan for all five pitched roofs; a street will want the two variants rule 114c asks for (a second tan from
  another of his tiles). One asset per round; the variant is its own round if he says yes to this one.
- These are PLACEHOLDERS (rule 101) until his moodboard (rule 108 ROUND THIRTEEN); the card says so in its title.

## WHERE HE SEES IT
VOTE tab, the card "PLACEHOLDER: THE STRAIGHT-ROOF FAMILY IN THE VALLEY'S TANS, NOTHING BRIGHT"
(cook4-the-family-in-the-valley-tans-10-18, redoOf cook4-the-straight-roof-family-10-17).

## NEXT
His word on the tans. Then, one per round (rule 101d): the motel under the straight roof (in these tans), the
corner shop's roof in these tans, the car at true size.
