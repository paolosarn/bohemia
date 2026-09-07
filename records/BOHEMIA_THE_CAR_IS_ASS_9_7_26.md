# THE CAR IS ASS, AND OUR OWN CRAFT LAW AGREES BY A FACTOR OF 47
COOK (16, the Production Artist), VAMILY [car recook], 9/7/26.

## HIS WORDS
> **"this is ass, is that the car model, c'mon bro."**
> — Paolo 9/7, off his own screenshot, `records/target/PAOLO_THE_CAR_IS_ASS_9_7_26.jpg`

His bugs beat the queue (front page, standing duty 8), so `[fortress buildings]` paused
mid-row and this went first.

## AND MY FIRST GUESS AT THE CAUSE WAS WRONG, WHICH IS WORTH SAYING FIRST
Claiming the row, I wrote in the commit that the brick wall in his shot was probably mine
— `[combat ground]` round 2 had shipped block-wall cover an hour earlier. **It is not.**
The screenshot has a joystick, a portrait and a dialogue box: it is the **walked city**,
not the fight, and the wall is the city's own. A guess made while claiming a row is still a
guess, and it went into a commit message before it was checked.

## WHAT IS ACTUALLY WRONG, IN OUR OWN NUMBERS
The twenty city wrecks are corpus **photographs**, shipped as-is. Measured before touching
one of them, against the thresholds in `gates/pixel_craft_gate.py`:

    median 3,031 DISTINCT COLOURS       the craft law's ceiling is 64       47x over
    median 71% of pixels a one-off colour   the ceiling is 35%               2x over
    median 90% ORPHAN pixels                pixels are supposed to travel in groups
    all twenty fail, and not one is close

Standing beside a body drawn from a six-tone ramp, that is two worlds in one frame. He was
looking at a photograph glued into a pixel game and he named it in four words.

## THE OPERATION IS NOT MINE. IT IS HIS OWN, FROM 7/28
The act-1 starter tileset he approved (*"I checked it to do the other 41 mark it
approved"*) records the method it was made by, and this applies it unchanged:

> "every pixel snapped to the family ramp by value, then orphans absorbed"
> "accents: up to two per tile, taken from that tile's **own** out-of-range pixels, so
> white paint and dead dark glass survive the ramp"

So nothing here invents a car. The silhouette, the panel breaks, the wheel arches and the
dead glass are the real photographed wreck; what changes is that its colour becomes a ramp
the ground already uses.

**Which ramp is not a matter of taste.** The row says "the value bands of the ground it
sits on". The approved bank carries ONE PALETTE PER FAMILY, and the family a car sits on is
the road: `asphalt`, seven tones, `#101216` to `#6a5e50`. A wreck in the Mojave is oxidised
steel, which is that family, and taking it means the car cannot argue with the street.

    median 3,035 -> 9 colours        single-use 0.72 -> 0.00      orphan 0.90 -> 0.00
    20 of 20 inside the colour ceiling, 20 of 20 inside single-use
    and the prop bank shrank 195 KB, which a phone gets for free

## THE REFERENCE CHECK (9/4 standing duty)
Against this lane's own sheet, `reference/library/prop/INDEX.md`:

- **PROP-01** — *a prop is silhouette first; its contact shadow anchors it.*
  **TAKEN:** alpha is preserved pixel for pixel. This is a re-colour, not a re-draw, so the
  observed silhouette of a real vehicle survives intact.
- **PROP-02** — *a real object is ONE material and two or three readable parts; a fourth is
  decorating rather than observing.*
  **TAKEN:** one ramp for the shell plus at most two accents — which is exactly what a
  wreck has beyond its body: dead glass and rust.
- **PROP-03** — *the 45-degree law: ellipse cross-sections, sky-lit tops.*
  **TAKEN** by leaving the geometry alone; these masters are already the world's
  three-quarter view and nothing rotates or reprojects them.

## AND THE NUMBERS WERE PERFECT WHILE THE PICTURE WAS WRONG
The first cook scored 8 colours, zero orphans, zero single-use — everything green — and
then I looked at it. One car was covered in **scarlet speckle**. The accent was taken from
the single most saturated pixel in the image, and on that wreck it was a tail-light red,
which then flooded every pixel within 72% of it.

Two fixes, both law-cited rather than nudged:
1. **An accent comes off a distribution, not off one pixel** — the 90th-percentile
   saturation as the threshold, and the median of the warm pixels above it as the colour.
2. **Pixels travel in groups (craft LAW 1), and that applies to an accent too.** A rust
   fleck four pixels wide is rust; three scattered ones are noise wearing an accent's name.
   Any accent cluster under four pixels goes back to the ramp at its own value.

**This row is the whole argument for looking.** He looked at a build and said four words;
a gate had looked at the same build and said nothing. My own cook then passed every number
while producing a red-speckled car. Numbers cannot see.

## THE GATE CAUGHT ME HALFWAY THROUGH, AND IT WAS RIGHT
`props_gate.js` binds the bank to the shipped sibling — *"every banked object actually
reached the sibling"* — and went red at 85 of 105 the moment I cooked
`slices/BOHEMIA_CITY_PROPS.js` and not `banks/BOHEMIA_STREET_FURNITURE_8_21_26.txt`. Both
are cooked now, in one tool, so they cannot drift.

## WHAT IS NOT DONE, AND IT IS THE OTHER HALF OF HIS SENTENCE
His complaint has two parts and this ships one. The row also says the car is **"sitting ON
TOP of a brick wall… on the GROUND not on a wall"**. That is placement, not pixels. What I
found, in the city's own draw:

- a car is drawn from a chunk's `posts` list and stretched to `C*pw × C*ph` — the stall it
  is parked in, not the master's own size, so a 45×96 master is magnified to fill it;
- when the stall is wider than deep the master turns a quarter, which is the wide
  horizontal band in his screenshot and is correct behaviour for a parking stall.

**[FOR LIFE + CITY]** Whether a stall may be laid over a wall band, and the draw order
between a post and the wall behind it, is the city's business and not a cook's. The art
half is shipped; a wreck standing on a wall will now be a *pixel* wreck standing on a wall.

**[FOR THE PLUMBER]** `props_gate.js` has a second arm, *"the car lattice FOLLOWS THE BLOB
(a rotated plot turns a 2×4 rank into 4×2)"*, and it is **red on origin/main right now** —
verified in a clean worktree, 75 passed / 1 failed, identical to this tree. Not mine, and
red for everybody.
