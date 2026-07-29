ART (f3eu53): 7/29 (a) LATEST — ONE MASTER PALETTE, ON THE REAL STREET. 39 COLOURS
FOR THE WHOLE SET, AND THE M14 GREYSCALE FAILURE ACTUALLY FIXED (6.5 -> 13.3).

**PAOLO HAS NOT JUDGED THIS.** He judged the palette SHEET ("YOUR CLEARLY NOT DONE
I LIKE IT KEEP GOING") — the swatches, not the street. The candidate bank is NOT
wired into the game. **NOT IN A TAB YET.** The only way to see it is the A/B image,
`records/target/PALETTE_AB.png`.

WHAT SHIPPED
  banks/BOHEMIA_STARTER_TILESET_ACT1_MASTER_7_29_26.txt   the candidate, 42 tiles
  records/BOHEMIA_MASTER_PALETTE_7_29_26.md               the full record + the A/B
  records/target/PALETTE_AB.png                           three columns, colour + greyscale
  tools/bohemia_master_palette_design.py                  PASS 1 value skeleton, PASS 2 hue
  tools/bohemia_palette_apply.py                          puts it on the real tiles
  tools/bohemia_master_palette_proof.js                   drives all three in a real browser
  tools/bohemia_palette_ab.py                             composes the judgeable picture
  gates/master_palette_gate.py                            NEW GATE, registered as MASTER PALETTE

THE NUMBER THAT MATTERS: roof-to-ground separation was 6.5 and is now 13.3. At 6.5
a terracotta roof and a gravel yard are the same VALUE — in colour you can tell them
apart, in greyscale the roofs dissolve into the ground and buildings stop reading as
buildings. The bottom row of the A/B is that test with the colour off. Look at it
before touching any of this.

STRUCTURE: seven families, all subsets of ONE 39-colour palette. The 7/28 re-cook
had six INDEPENDENT ramps that knew nothing about each other — the named amateur
pattern, "each sprite has its own unrelated colour scheme". Value carries the
greyscale separation; SATURATION carries the material read. Asking value to do both
produced mud-coloured roofs on pass 3.

AND THE PART WORTH READING, because it is the same lesson four times: **I invented a
number in a place where the approved set was sitting right there waiting to be
measured.** Four passes, four failures, all four caught by rendering the frame and
LOOKING at it, none of them caught by a gate:
  1. per-tile rank mapping -> a wall in shadow came out as bright as a wall in sun,
     and the light-direction pairs passed BY LUCK.
  2. accents defined as "outside the ramp" -> 58.6% of the roof ridge, its MAIN BODY
     COLOUR, escaped as "sun-caught" and dragged roofs to 158 against a design of 78.
  3. no band for HOLES -> 39.2% of the approved corpus's structure pixels sit under
     luminance 48 (door interiors, glass, the dark under an eave). They had nowhere
     to go, got compressed into the wall band, and EVERY BLACK DOORWAY ON THE STREET
     TURNED INTO A LIGHT GREY PANEL. Plus bands 52/54/52 wide against a corpus that
     spans 106/93/110.
  4. invented saturation -> walls at 0.160 against the corpus's 0.411. Cold and washed.
Passes 1 and 2 had BETTER NUMBERS than the thing they replaced and a WORSE PICTURE.
That is the Pixel Bible's own failure record, live: *a green number, and a picture
nobody looked at.*

THE NEW GATE holds the STRUCTURE and has no opinion on the taste: every pixel is a
colour that exists in the designed palette (not "close to" — in it), the void band
still exists, the colour count cannot climb back, roof clears ground by 12+, and the
five light-direction pairs hold. 53 checks. PROVED IT CAN FAIL: wrote one off-palette
colour into wall_0, watched it go red, restored.

WHAT IS NOT FIXED (all stated in the record, none hidden):
  - wall_0 vs wall_under_eave went from 10.3 luminance apart to 2.8. The eave shadow
    is still correct in direction but quieter, because the whole stucco source span
    is squeezed onto a 90-wide band.
  - ramps still spaced in RGB, not perceptually (M6 debt).
  - banks still store RGB, not palette indices (M9 debt) — this is a 39-colour
    palette stored as 39 repeated triples.

WHAT IS PENDING PAOLO, and none of it should be decided by a session:
  1. THE PALETTE ITSELF. Column 2 (hot orange roofs, more punch) vs column 3 (cohesive,
     fixes greyscale). That is a taste call about what rebuilt Vegas looks like.
  2. what colour rebuilt Vegas is, in his words (open since 7/27)
  3. cars 2x3 vs the re-cook's shorter read (open since 7/28)
  4. TF-ART-017's parapet_corner duplicates TF-ART-012's parapet cap — coordinator call
  5. a verifier added board row 97 in the reserved 90-99 range; may now collide with
     the rows 28-37 this lane added

IF HE APPROVES THE PALETTE: the 42-tile candidate becomes the set, the 18 tile forms
(TF-ART-001..018) cook against these 39 colours, and the bank gets wired so it is IN
A TAB. If he kills it, the 7/28 re-cook stands and gates/master_palette_gate.py goes
with the candidate.

DO NOT re-cook anything before he rules. Four versions of one thing already happened
here and the STOP PRODUCING law names that as the tell.
