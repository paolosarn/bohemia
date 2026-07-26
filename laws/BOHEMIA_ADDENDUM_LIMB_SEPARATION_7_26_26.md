# BOHEMIA ADDENDUM — LIMB SEPARATION IS A LAYER, AND THE GARMENTS HAVE NO ROOM FOR IT
# (Paolo 7/26/26)

Paolo: "It's still kind of looking like morphing dog shit. Why is it so hard to
have the limbs look separated cleanly? And I think you have the back arm, but what
about the back leg? Why has this been so fucking difficult?"

Two questions, one answer, and then a wall that is not made of code.

## 1. THE CLOTHING WAS ERASING THE SEPARATION

Along every screen cell where one limb group touches another, does that cell read
DARKER than the limb interior — i.e. is there a separation line there at all?

    facing    BARE: arms / legs      DRESSED: arms / legs
    E          57.7% / 76.4%           24.3% / 22.1%
    W          68.3% / 62.7%           27.6% / 22.3%
    SE         64.0% / 70.5%           21.6% / 19.2%
    SW         77.3% / 77.7%           16.8% / 19.5%

**The body draws the line correctly. The clothing paints over it.** Dressing the
character destroys about 70% of its limb separation. That is why this has been so
difficult: every fix all day sat UPSTREAM of the thing erasing the result.

**AND IT ANSWERS THE BACK LEG.** The previous fix excluded legs because their
garment COVERAGE was fine. Coverage was the wrong measurement — dressed, the legs
separate at 19-22%, slightly WORSE than the arms. He was right to ask.

## 2. THE FIX, WHICH IS HIS OWN SENTENCE

"If you make it a different shade, that's a whole different layering process that
isn't actually color-coded on the clothing pixel wise."

So the separation line is now exactly that: a SEPARATE LAYER applied AFTER the
clothing, and colour-coded ON the clothing — a boundary pixel steps to the next
darker entry of ITS OWN GARMENT RAMP. No multiply, no invented shade. A colour
belonging to no known ramp is left alone. His blend exceptions are untouched:
nothing limb-vs-head, nothing at the waist, nothing above the shoulder line, torso
carries no shared edge.

Result, dressed: arms 24.3% -> 30.9% (E), 27.6% -> 31.8% (W); legs 22.1% -> 23.6%.
Real, and much smaller than it should be. Which leads to the actual wall.

## 3. THE WALL: THE GARMENTS HAVE NO DARKER COLOUR TO DRAW WITH

Measured over 8,568 limb-boundary cells:

    the pixel is ALREADY the darkest tone its garment owns : 79.9%
    a darker tone exists in its ramp                       : 20.1%
    colour belongs to no known ramp                        :  0.0%

The lookup is sound (0% unknown). The palette is the problem. Equipped ramp
luminances:

    shirt / cowl-hoodie          3 tones:  21, 24, 31
    jacket / japanese-fuzz       7 tones:  10, 18, 24, 47, 67, 171, 215
    hair  / curtain-bob          2 tones:  27, 232

**The hoodie's entire range is 10 luminance points, all of it near black.** You
cannot separate two black sleeves with a colour that does not exist in the art.
80% of the boundary has nowhere darker to go, and inventing one is precisely what
he forbade.

## WHAT THIS NEEDS FROM PAOLO, and it is art/data, not code

1. **A LINE TONE PER GARMENT.** Each ramp gains one dedicated darker entry used
   only for limb separation. Mechanical to add, and it makes the pass above work
   everywhere instead of on 20% of the boundary. This is the recommendation.
2. **OR separation by RIM LIGHT instead of a dark line** — lift the NEAR limb's
   edge rather than darken the far one. Near-black garments have plenty of room
   upward and none downward. This is a look decision and it is his.
3. **OR accept** that near-black garments read as one mass in profile.

Nothing here is a rendering problem any more. The pass is in place and correct; it
is starved of colour.

Tool: `tools/bohemia_limb_separation_patch.py` (idempotent).
Gate: `gates/limb_separation_gate.js`.
