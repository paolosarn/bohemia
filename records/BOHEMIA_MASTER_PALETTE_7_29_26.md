# THE MASTER PALETTE — CANDIDATE, NOT APPROVED (7/29/26)

**Paolo has not judged this.** He judged the palette SHEET ("YOUR CLEARLY NOT DONE
I LIKE IT KEEP GOING") — the swatches, not the street. This file is what happened
when the swatches went onto the real tiles, and it is the thing waiting for a
verdict.

**NOT IN A TAB YET.** The candidate bank is not wired into the game. Nothing in
RUN / CITY / SLICE or anywhere else has changed. The only way to see this is the
A/B image.

- the A/B: `records/target/PALETTE_AB.png`
- the palette: `records/target/MASTER_PALETTE_SHEET.png`
- the candidate bank: `banks/BOHEMIA_STARTER_TILESET_ACT1_MASTER_7_29_26.txt`
- the frame, rebuilt: `slices/BOHEMIA_REASSEMBLY_MASTER_7_29_26.html`

## WHAT CHANGED, IN NUMBERS

| | approved 7/26 | re-cook 7/28 | one palette 7/29 |
|---|---|---|---|
| colours in the whole set | 9582 | 150 | **39** |
| roof-to-ground separation | 6.5 | 6.5 | **13.3** |
| ground / wall / roof mean value | 104 / 139 / 110 | 105 / 137 / 110 | 111 / 141 / 98 |
| mean saturation, walls | 0.411 | 0.413 | 0.406 |

The roof-to-ground number is the one that matters and it is the reason the work
happened. At 6.5 points apart, a terracotta roof and a gravel yard are the same
value: in colour you can tell them apart, in greyscale the roofs dissolve into the
ground and the buildings stop reading as buildings. The bottom row of the A/B is
that test with the colour turned off. In the first two columns the roof merges into
the wall. In the third it is the darkest large plane on the screen.

## WHAT IT COST TO GET HERE, HONESTLY

Four passes, and three of them failed on the same mistake: **I invented a number in
a place where the approved set was sitting right there waiting to be measured.**

1. **Per-tile rank mapping.** Each tile's own steps stretched across the full family
   ramp, so every tile spanned the same range and a wall in shadow came out as
   bright as a wall in sun. The light-direction pairs passed by luck.
2. **Accents defined as "outside the ramp".** 58.6% of the roof ridge — its main
   body colour — escaped as "sun-caught" and dragged the roofs to 158 when the
   design put them at 78.
3. **No band for holes, and bands half as wide as the corpus.** 39.2% of the
   approved corpus's structure pixels sit under luminance 48 — door interiors,
   window glass, the dark under an eave. They had nowhere to go, got compressed
   into the wall band, and **every black doorway on the street turned into a light
   grey panel.** Separately, the designed bands were 52/54/52 wide against a corpus
   that spans 106/93/110.
4. **Invented saturation.** Walls came out at 0.160 mean saturation against the
   corpus's 0.411, ground 0.116 against 0.274. The street rendered cold and washed.

Every one of those four was caught by rendering the frame and looking at it. **None
of them was caught by a gate.** Passes 1 and 2 had better numbers than the thing
they replaced and a worse picture — which is the exact entry already in the Pixel
Bible's failure record: *a green number, and a picture nobody looked at.*

## THE STRUCTURE, FOR WHOEVER TOUCHES THIS NEXT

Seven families, all subsets of one 39-colour palette, sharing steps with their
neighbours. The 7/28 re-cook had six INDEPENDENT ramps that knew nothing about each
other, which is the named amateur pattern: *games where each sprite has its own
unrelated colour scheme.*

- **void** (22–46, 4 steps) — holes. Door interiors, dead glass, the dark under an
  eave. Shared by every family because a hole reads the same whatever surrounds it.
  Applied only to families that actually have openings cut into them; a crack in
  asphalt is dark asphalt, not a doorway.
- **ground** (54–160, 6) — mean 107, the corpus's own mean and its own 106-wide
  spread. Kept, not redesigned.
- **structure** (88–178, 6) — mean 133, the corpus's 93-wide spread, so a wall in
  shadow still has somewhere to be.
- **top** (40–130, 6) — mean 85. **The only band that moves**, down from the
  corpus's 112.6. Fired clay is a dark red material; making it lighter than a stucco
  wall was my error, not the corpus's.
- **accent** (196–226, 2) — paint, and the ridge the sun hits square.

Value carries the greyscale separation; **saturation carries the material read.**
Asking value to do both is what produced mud-coloured roofs on pass 3.

## WHAT IS NOT FIXED

- Wall-to-wall shading gaps compressed. `wall_0` vs `wall_under_eave` went from
  10.3 luminance apart to 2.8, because the whole stucco source span is squeezed onto
  a 90-wide band. The eave shadow is still there and still correct in direction, but
  it is quieter than it was.
- Ramps are still spaced in RGB, not perceptually (M6 debt, unchanged).
- Banks still store RGB, not palette indices (M9 debt, unchanged) — this set is a
  39-colour palette stored as 39 repeated RGB triples.

## THE DECISION IN FRONT OF PAOLO

Three columns of the same street. Column 3 is more cohesive and fixes the greyscale
failure; column 2 has hotter orange roofs and more punch. That is a taste call about
what rebuilt Vegas looks like, and it is his, not mine.
