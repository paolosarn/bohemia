# COOK — THE LANE LINE DRUMS TOO
## Round IV, 9/21/26. [fight floor] round 3. THE FIGHT VERDICT round 3, item 5, finished.
## COOKED AND REGISTERED IN VOTE: `cook-the-lane-line-drums-too-9-21`. Nothing went to the alpha or the demo.

---

## THE ONE THING MADE THIS ROUND

**The painted lines stop repeating.** `lane` goes 2 pictures → 8, `median` goes 3 → 9, and
the paint in every one of them is his, pixel for pixel. The fight floor bank is now 78
images at 44 px and 78 at 88 px, every column of the street varied:

    road 8   walk 8   lane 2->8   median 3->9   kerbL 8   kerbR 8
    gutterL 4   gutterR 4   house 7   yard 4   wall 4   lot 4   slab 2

THE FIGHT VERDICT round 3 still lists *"THE LEFT-EDGE TILED SPRITE STRIP — a drum against
R3's stillness."* Round 2 took the kerbs 1 → 8 and the gutters 1 → 4, and I wrote down in
the same breath what I had not finished: *"NOT DONE: lane (2 pictures) and median (3)."* A
column of fourteen cells drawn from two pictures is still a drum. This finishes the item.

---

## TWO WRONG CONSTRUCTIONS BEFORE THE RIGHT ONE, AND THE SECOND IS THE INTERESTING ONE

### THE KERB TRICK DOES NOT TRANSFER, and that was measured before it was tried

The kerb worked because `walk_kerb` is byte-identical to `walk_0` outside its lip, so "a
plain tile plus a feature" was provable. A marking tile is not that shape: `lane_h`,
`median_h` and `cross_ew` each differ from the **closest of the 18 street tiles** on
**74–85% of pixels**. They are their own drawings with their own asphalt underneath.

### THE COLOUR MASK SCORED PERFECTLY AND ERASED THE LANE LINE

Measured against the seven colours the street family actually uses, a marking tile is 98%,
93% and 88% family colours plus exactly **one** colour that is not. That looked like the
answer: lift "every pixel that is not a family colour" as the paint. It passed every guard
in the tool — 2 pictures to 8, paint never moved, no duplicates, opaque, under the ceiling.

**Then I rendered the column and the lane line was gone.**

Only 38 pixels of the stripe are that off-family colour. The **body** of the line is painted
in the material's own light tones, so a colour test catches the highlights and erases the
stripe. A mask built from a colour test cannot find a line drawn in the material's own
colours, and no number in that run said so. The picture said it.

### THE BAND IS GEOMETRY, AND GEOMETRY DOES NOT LIE

Row brightness across every marking variant, against a plain street tile at 53:

    lane_h[0]    rows 18-25 sit 8+ off the tile's own median      (the stripe)
    lane_h[1]    rows 17-24
    median_h[0]  rows 17-20 and 26-28                             (the dashes)
    median_h[1]  rows 18-21      median_h[2]  rows 18-21 and 26-27

**Every marking in every variant lives between rows 17 and 28.** So the mask is that band,
all twelve rows of it, exactly as the kerb's lip was rows 38–43: his rows unchanged, a
different approved asphalt field above and below, and the seam is asphalt meeting asphalt
on the same seven-colour ramp.

### AND THE SEAM WAS MEASURED, NOT ASSUMED

Grafting his band onto a different field could have created a value step down the column.
It did not create a new one:

    lane    band minus field: mine +15.7 median   the tile the game draws today: +21.2
    median  band minus field: mine  +7.4 median   the tile the game draws today:  +4.9

The lane's step is **smaller** than what ships, and the median's is 2.5 units larger, under
what reads at phone scale. The step is the painted line, which is supposed to be there.

---

## THE OTHER HALF OF THE ROUND: THE VERDICT'S HONEST RESIDUAL, MEASURED

THE FIGHT VERDICT round 3 passed this lane's floor bank and recorded one residual against
it: *"the street family itself (walked AND fight, identical by construction) measures
3.6–4.1 colours/kpx against the 5A density floor of 4.5... recorded here against the 9/13
street recook as a standing observation, one instrument, re-measure if the street is ever
re-cooked."*

I re-measured it with the card's own instrument
(`tools/bohemia_eyes_reference_score.py colours_per_kpx`, 8-quantised) before cooking
anything, and **the residual is real on density and an artifact on hue, and on both axes my
recook sits exactly where the art he approved sits.**

### DENSITY: EVERY TILE HE APPROVED ON 7/28 IS BELOW THE FLOOR TOO

    my 9/13 street   18 tiles   3.62 flat            FLOOR 4.5
    my 9/13 side     36 tiles   3.62 - 4.13          FLOOR 4.5
    HIS 7/28 BANK    road_0 3.10   walk_0 4.13   yard_0 2.58   dirt 2.07   wall_0 2.07
                     -> min 2.07, median 3.62, max 4.13        FLOOR 4.5

The card set the floor "at the leanest art he approved" and names `pz_0` at 4.6. That is the
**older** approved ground. The 7/28 act-1 bank he approved later runs down to 2.07, and the
card's own scope exempts it: *"The frozen act-1 set stays byte-locked under his CBB
verdict (a gate does not overrule a verdict)."* So the floor sits above his own newer
approved art, and raising the street to meet it would make the street **denser than every
tile it has to sit beside** — which is the opposite of the identity that just earned the
PASS. Not cooked, on purpose, and flagged as a canon question rather than decided here.

### HUE: THE FLOOR IS MEASURING A PIXEL THE CARD ITSELF BANS

The sidewalk reads 1.2–1.4 deg against the 3.0 floor, which looked like a clean failure.
Then I ran the same ruler on **his approved `walk_0`**, which passes at 3.70:

    his walk_0   raw 3.70 deg   with the near-black step removed: 1.26 deg
    my side[0]   raw 1.21 deg   with the near-black step removed: 1.21 deg

His tile passes **only** because of one 40-pixel near-black at `(4,4,3)` computing to hue 60
beside a step at hue 33, contributing 27 degrees on its own. Strip that and his sidewalk's
real hue variation is 1.26 against my 1.21 — the same place. The same artifact inflates the
road: `road_0` scores 53.12 and `street[0]` 86.75, both off a near-neutral darkest step at
hue 220.

And the pixel doing the inflating is one the style card **bans**: `"banned": [..., "pure
black", "pure white"]`. Measured:

    his walk_0/1/2   1.39% of pixels near-black (worst tile 2.12%), darkest (4,4,2)
    his road_0/1/2   0.69% (worst 2.07%), darkest (2,4,8)
    my 9/13 street   0.00%      my 9/13 side   0.00%

**The 9/13 recook already took pure black out of the ground.** The hue floor rewards putting
it back. That is a hole in the ruler, not a debt in the art, and it is the twelfth time this
lane has had to separate a clean number from the wrong oracle.

**FOR DIRECTION, not decided here:** the 5A hue ruler should ignore steps under a chroma
floor, the way its own density ruler ignores nothing and does not need to. Until it does,
a tile is rewarded for carrying a banned colour.

---

## THE REFERENCE CHECK (standing duty, 9/4 law)

- **AH-01 THE ANALOG HORROR BIBLE.** R3 THE LONG HOLD is the rule the verdict cites and the
  one this serves: a repeat short enough to read in two beats is motion the frame never
  asked for. R4 THE LIGHT WAS IN THE ROOM: the fields are day-neutral asphalt and the paint
  carries no light of its own, so nothing here lights anything. R10 GRIME IS BAKED: every
  pixel was baked on 9/13 and is only moved here.
- **TG-04 THE STREET TILE** — the family and its value band. Taken unchanged; the fields ARE
  that family, so a grafted tile cannot leave it.
- **CGRD-03 A VEGAS BLOCK FROM THE AIR** — a painted line on a real road runs continuously
  while the asphalt under it changes every few feet with patching and wear. That is the
  structural rule this serves, and it is exactly why the **paint is held constant per
  variant and only the road varies**, rather than the other way round.
- **REUSE CHECK:** no pixel is authored. The paint is his marking tiles; the fields are the
  18 street tiles the city already ships. A graft is a copy.

## WHAT THIS DOES NOT DO

- It does not touch `cross_ew`/`cross_ns` (3 each). They are crossing bars at an
  intersection, not a column that runs the length of a frame.
- It does not raise the street's density. See above: that would break family agreement to
  satisfy a floor his own approved art sits below, and it is a canon question.
- **Nothing was written to the alpha or the demo** (rule 18).

## HOW TO RE-RUN IT

    python3 tools/bohemia_the_lane_line_drums_too_cook_9_21_26.py
