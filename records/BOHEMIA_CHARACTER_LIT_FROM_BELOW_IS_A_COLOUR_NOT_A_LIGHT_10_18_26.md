# LIT FROM BELOW IS A COLOUR, NOT A LIGHT (CHARACTER, [lit from below], 10/18/26)

The coordinator's ask: MODS (2d9f2d9, records/BOHEMIA_MODS_THE_TEN_TESTS_ON_A_PACKED_SHEET_10_18_26.md) measured four
looks lit from BELOW on the fight sheets (satchel 68/68, colorful 66, caravans 62, church 45); fix those first.

## What was measured
The audit's light angle (tools/bohemia_pixel_craft_audit.py light_angle) is the brightness-weighted direction across the
WHOLE sprite. On a person it sees WHERE the colours sit before it sees any shading: dark hair or a dark top over a pale
skirt reads as a light from below. My own card said the same of the rig's pale coats (records/BOHEMIA_THE_THIRTEEN_
THROUGH_THE_RIG_10_18_26.md, cycle 4).

tools/bohemia_character_light_within_the_cloth.py reads the light INSIDE one surface: every pair of neighbouring pixels
of the same material (hue and chroma, value free) and under 40 value steps apart adds its brightness step. Hair against a
coat is a jump of more than 40, so it is skipped; a fold's ramp is kept. Same convention as the audit (y down, 270 is
straight up, 180 to 360 is from above). Standing frames only (sleep, floor-rise and crawl-dying skipped, MODS' own rule).

A first cut that summed each material's whole moment was fooled the same way: dark hair and a brown coat share a hue,
so the hair counted as the coat's dark top (cast_longcoat's coat material ran 15 at the crown to 103 at the hem). The
neighbour read replaced it before anything shipped.

## THE PROOF THE TOOL IS HONEST
On the rig's renders it recovers the rig's own sun. DIRECTION's calibration sphere reads screen_light_deg 155.4 in
the rig's convention (tools/bohemia_direction_master_rig.py line 335: screen y UP). In the audit's convention (y down)
that is 360 - 155.4 = 204.6, a low light from the upper left. The fourteen rig looks read 179.9 to 214.2 within the
cloth (median of medians about 193). The whole-sprite read on the same renders calls 37 of 56 Anarchists frames, 8 of 8
Volunteers and 7 of 8 of the body "from below".

## THE FOUR (old flat sprites, slices/fight_people, 48 standing frames each)
| look | whole sprite, frames below | within the cloth, frames below | within, median deg |
|---|---|---|---|
| cast_satchel | 48 | 1 | 281.3 |
| faction_caravans | 43 | 0 | 291.2 |
| faction_colorful | 48 | 4 | 265.4 |
| faction_church | 30 | 0 | 254.7 |

None of the four is lit from below. Satchel: near-black hair and an olive top over a cream skirt. Caravans: black hair
and a dark hat brim over khaki. Colorful: a red cap and a dark-green top over pale-green trousers. Church: a dark grey
hood over yellow. The fix is in the measurement, not in the pixels; nothing in slices/ was touched (rule 100).

## WHAT THE CLOTH READ FINDS INSTEAD (the real ones)
- cast_barearms: 36 of 48 frames from below within the cloth (median 98.5). Its whole-sprite read said 9. This is a real
  light from below on an old sprite, invisible to the whole-sprite test.
- faction_anarchists: 23 of 48 (median 182.7, on the edge).
- YOU 8, faction_reds 9, cast_skirt 5, cast_poncho 5: a few frames each.
Every other old look: 0 to 2. Both real ones go to the rig remake order (COOK THREE for the cast, this lane for the
Anarchists, whose rig model reads 200.4 with 2 of 56 below).

## ROUTED
- PLUMBER and DIRECTION (MODS' section 5, settled by measurement): the two numbers are two conventions. 155.4 (y up) is
  204.6 (y down). check.py's band 180 to 360 cuts the guide's own window (204.6 plus or minus 30 is 174.6 to 234.6), so
  a rig render can fail check.py's light row while matching the rig's sun (Caravans' rig median 179.9). G3 for the person
  class should be the within-the-cloth read against 204.6 plus or minus 30 in one convention; the whole-sprite angle on
  a person is a colour map. The tool is a pure image test, ready to lift into the family.
- MODS: the four are colour, not light; the sheet's real light outliers are cast_barearms and faction_anarchists.

REFERENCE CHECK: the twin is the game's own fight sheets and DIRECTION's rig renders; no reference game.
