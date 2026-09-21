# THEY TAKE THEIR SUNGLASSES OFF TO TALK TO YOU
## PORTRAIT lane, row [shades on], round 1 (9/21/26)

**Rule 22: a making lane cooks every round.** This is the cook. **VOTE** tab, in the alpha,
behind the gear.

ONE ID, ONE WHOLE PERSON (law, 8/27) pointing the other way.

---

## MEASURED, 200 CITIZENS, ON RENDERED PIXELS

| | |
|---|---|
| wear shades on the body | **70 of 200 (35.0%)** |
| the body actually draws them | 62 of 70 |
| **the portrait draws them now** | **0 of 70** |
| the portrait draws them after the cook | 70 of 70 |

**Zero is proved, not asserted.** The portrait side was tested the only honest way: render
the face, change the person's glasses, render again, and count the pixels that moved. None
move, because `renderFace` has no glasses argument at all. The word "glasses" appears
eighteen times in the alpha and **not once inside the face renderer**. Glasses are a BODY
layer and always have been.

So this is the FIRST mechanism, not a second one competing with an existing one, which is
the same shape the EYES themselves were in on 8/27. ENGINE SYNC LAW is satisfied by there
being exactly one.

---

## THE SHADES ARE READ, NOT DRAWN

Every colour comes out of the painted garment's own ramp,
`PD_DATA.ramps['glasses/shades']` = `[[16,16,20],[30,30,36],[86,90,104]]`. Frame, lens,
catch. The lens on the face is the lens on the body and nobody invented a colour.
REUSE-FIRST.

The lens is placed on **that face's own eye numbers** (`f.eyeY`, `spec.eyes.gap`,
`spec.eyes.w`, `spec.eyes.h`), never a fixed rectangle, so it fits a child's face and an
adult's without a second table.

**The catchlight sits on the right**, because that is where this game's sun is
(`art_45_gate.py`: *"a 3/4 iso mass is lit on its RIGHT face, shadowed on its LEFT"*) and
where this lane put the light on the face two rounds running. One light, everywhere, or it
is not a light.

---

## I PUT IT BESIDE THE STREET SPRITE AND THE FIRST CUT WAS THE WRONG GLASSES

The first version drew **two round lenses joined by a bridge**. That is a pair of
spectacles. The painted garment is a **wraparound**: one continuous dark band across both
eyes, which is what every head in the top row of the sheet plainly reads as.

**A portrait wearing a different pair of glasses from the body is the exact defect this row
exists to close, one layer down.** Every number in the table above was already correct while
the picture was wrong. The band is one piece now, and only the temple ends are frame.

**And the sheet ran off its own canvas.** Two portraits at 0.625 of a column each are 1.25
columns wide, so every pair drifted right and the last one was cut in half. A sheet he
cannot read is not evidence, and this lane has written that sentence before. The column is
sized from what actually goes in it now.

---

## MEASURED AND NOT FIXED, ROUTED

**8 of the 70 wear shades the BODY never draws either.** The garment is in their wardrobe
and nothing of it reaches the street sprite's pixels, presumably lost to a hat brim or hair
at 26px. The cook still draws those 8 in the portrait, deliberately: **the person is wearing
shades, and the HD view is where that is legible.** The body losing them at street size is
the body's problem, not the portrait's, and it is named here rather than papered over.

---

## WHAT IT DOES NOT DO

**It does not change the shipped renderer.** Rule 18 keeps code off the play surface and
rule 15 says he sees it in VOTE first, so `renderFace` is untouched and the face Paolo
approved has not moved. The cook is a tool
(`tools/bohemia_cook_the_portrait_wears_the_shades.js`).

`[shades on]` stays **CLAIMED, not shipped**: its ship test is the portrait wearing them in
the game, and nothing reaches the game until he votes.

---

## WHY THIS ROW AND NOT A THIRTEENTH LIGHT CARD

Twelve of this lane's candidates are in the VOTE tab with **no verdicts on any of them**.
Making a thirteenth version of the same four faces is the tell STOP PRODUCING names by its
own name. This is a different defect, measured by this lane on itself, on 70 people rather
than 4, and it is a LAW being broken rather than a matter of taste.

Sheet and card: `records/target/BOHEMIA_THE_PORTRAIT_WEARS_THE_SHADES_9_21_26.png`,
`slices/vote/PORTRAIT_SHADES_ON_9_21.png`. Numbers:
`records/target/BOHEMIA_THE_PORTRAIT_WEARS_THE_SHADES.json`.
