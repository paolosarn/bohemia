# THE FIGHT VERDICT — ROUND 21: THE FLOOR ONLY (DIRECTION, 10/1/26)
# Rule 46f, Paolo 10/1: "Also combat is soooo fucked up bro holy shit the tiles below the people dont look good
# man its all fucked up." (records/BOHEMIA_PAOLO_COMBAT_IS_FUCKED_UP_THE_TILES_BELOW_THE_PEOPLE_10_1_26.md)
# The coordinator: DIRECTION judges the floor only; RUN cuts no fight whose floor fails this verdict.
# Judged LIVE, not off a sheet: the alpha's COMBAT tab on the one driver's phone profile (390 x 844 at 3x),
# COMBAT V233 (93d05a9, the newest fight on main), seeds 1, 5, 9, 13, the camera left alone.
# Picture: slices/vote/DIRECTION_THE_FLOOR_UNDER_THEIR_FEET.png (in VOTE). Tool:
# tools/bohemia_direction_the_floor_verdict.js (+ .py); numbers: slices/vote/DIRECTION_THE_FLOOR_UNDER_THEIR_FEET.json.

## THE VERDICT: FAIL, ON ALL FIVE TESTS, ON ALL FOUR BOARDS. He is right.

## THE FLOOR PASS BAR (what RUN's cut and EYES [fight floor measured] read; all five, every board)
F1. **THE CANVAS IS THE PHONE.** One painted unit <= 1.5 device px (the 9/29 floor's 3a; one density rule,
    map and fight). TODAY: the fight canvas is 390 x 635 on a 3x phone: **3.0 device px per painted unit,
    every board.** Every dot of his art is a 3 x 3 block before a single tile is drawn. COMBAT [device canvas].
F2. **THE GROUND HAS FINE DETAIL.** The fine band off the glass over the board >= 0.020 both axes (the 9/29
    floor's 3b). TODAY: **0.007 to 0.011 on all four.** F1 is most of this; F2 is how we know it was fixed.
F3. **NOTHING ON THE GROUND THAT IS NOT THE GROUND.** The board layer draws only ground tiles, the cover and
    blockers' own art, bodies and their shadows. Allowed marks, and only these: REACH = the square tile in
    the ground's own colour, value up or down, hue shift <= 10 degrees, no outline thicker than 1 device px;
    THE MAN'S BASE = one ring <= 2 device px, the ground's colour darkened (a shadow, not a sticker). Names,
    the aim cue, CLEAR, the settlement lines: the HUD, never the board. MEASURE (EYES, a lower bound): pale
    pad, saturated red, white-mark and green-word colour classes off the HUD = 0. TODAY: **3.1% / 9.6% /
    4.8% / 3.3% of the board** (seeds 1/5/9/13), and that misses the dark ovals and the diamonds, which no
    colour class can see. By eye on seed 5: pale ovals (1), a red disc (2), CLEAR, ROSA and four lines of
    text across the top (3), four see-through diamonds (4), a thick white ring (5).
F4. **THE GROUND IS THE BANKS.** Every board tile kind (road, sidewalk and kerb, yard, slab, roof, house)
    is drawn from the walk's bank for that kind (38e; his approved 7/28 bank is the ruler), and each holds
    the style card's 5A floor at its own pixels: ground >= 2.07 colours per 1000 px, wall >= 1.55, hue step
    >= 3.0 degrees. COMBAT names the bank tile per kind in the commit. TODAY: the road is a dark speckle and
    the sidewalk a flat brown with a faint grid; neither reads as his approved road and sidewalk (no
    lane line, no kerb, no wear), and the commit does not name the bank tile drawn, so it cannot be checked.
F5. **COVER IS A THING.** A house, a car, a wall, a barrier, a container: each its own silhouette from the
    banks or COOK [board assets]'s block-war kit, >= 3 values, a contact shadow. TODAY: the houses at the board
    edge are two flat tans, a box with an oval on top (6). COOK's kit (c18923e) exists and is not on the board.

## WHAT IS NOT ON THIS VERDICT (the floor only, rule 46f)
The bodies, the HUD ring, the edge chevrons and the camera are not judged this round. They pass or fail later;
none of them can make the floor pass. Round 20's paid items stand.

## THE ORDER THAT FIXES IT FASTEST (COMBAT's row, then COOK's)
1. F1 first: the backing store at the device ratio. One change, and F2 should rise with it (the map's own
   pixels already read 0.184; the fight's art is the same banks).
2. F3: delete, do not restyle. The ovals, the disc, the diamonds and the board words come off the board layer;
   reach comes back as the square tile in the ground's colour; the base ring thins to a shadow.
3. F4 and F5 with COOK: the walk's road, sidewalk, kerb and yard tiles at house size; the kit's cover.
EYES reads F1-F3 by machine on its next walk; F4-F5 by this verdict on the next fight that ships.

## THE BIBLE (rule 20h) AND THE AI-SLOP STRAND
R1 FAIL (five unmeant things on one board). R4 FAIL (the ovals and diamonds glow from nowhere). R5 FAIL (words
on the board). R10 FAIL (the cardboard houses are flat fill, not baked wear). AI-slop pair 2 FAIL: soft,
translucent UI shapes on the world are the machine's finish on the ground, the exact thing he hates.

```json
{"verdict":"FIGHT_VERDICT","round":21,"date":"10/1/26","scope":"floor only (rule 46f)","judged":{"lane":"COMBAT","version":"V233","sha":"93d05a9","surface":"alpha COMBAT tab, live, 390x844@3x","seeds":[1,5,9,13]},
 "result":"FAIL","pass_bar":{
  "F1":{"test":"painted unit <= 1.5 device px","today":[3.0,3.0,3.0,3.0],"pass":false},
  "F2":{"test":"fine band >= 0.020 both axes over the board","today":[[0.0091,0.0108],[0.0068,0.0075],[0.0096,0.011],[0.0102,0.0113]],"pass":false},
  "F3":{"test":"no non-ground marks on the board layer; reach = square tile in ground colour (hue shift <= 10 deg, outline <= 1 device px); base ring <= 2 device px, ground darkened; colour classes off-HUD = 0 (lower bound)","today_pct":[3.1,9.6,4.8,3.3],"by_eye_seed5":["pale ovals","red disc","CLEAR, ROSA, 4 text lines","4 diamonds","thick white ring"],"pass":false},
  "F4":{"test":"every tile kind from its bank; style card 5A at own pixels (ground >= 2.07 col/kpx, wall >= 1.55, hue step >= 3.0 deg); bank tile named per kind","today":"road speckle, flat sidewalk, no kerb, no lane line; bank tile not named so not checkable","pass":false},
  "F5":{"test":"cover is a thing: own silhouette, >= 3 values, contact shadow","today":"two-tone tan house boxes with an oval on top; COOK block-war kit c18923e not on the board","pass":false}},
 "order":["F1 device canvas","F3 delete the marks","F4+F5 with COOK"],
 "readers":{"RUN":"cuts no fight failing F1-F5","EYES":"F1-F3 by machine","COMBAT":"[house tiles back] step one [device canvas]","COOK":"floor tiles first"},
 "picture":"slices/vote/DIRECTION_THE_FLOOR_UNDER_THEIR_FEET.png",
 "bible":{"R1":"fail","R4":"fail","R5":"fail","R10":"fail","ai_slop_pair2":"fail"}}
```
