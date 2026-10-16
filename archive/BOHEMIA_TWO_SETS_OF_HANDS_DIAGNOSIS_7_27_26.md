# "TWO SETS OF HANDS" ON E/W — WHAT IT ACTUALLY IS
**7/27/26. Paolo, twice, with two screenshots.**

> 7/27 (1): *"on east and west the clothing is a little fucked up towards the actual
> hands. It might look like there's like two sets of hands or something."*
>
> 7/27 (2): *"you didt fix that skin near the hands bro first off i dont know if its
> double hands or just skin flap on the clothes or what but that previous screenshot
> witht the yellow circles you dint fix it"*

He is right. **I did not fix it, and my first attempt made it worse.** This is the
measurement, not another attempt.

---

## 1. WHAT I DID FIRST, AND WHY IT BACKFIRED

My `DRESS THE BACK LIMB` pass was painting the FAR hand with garment colour. I
removed the hands from it (`[[6,5],[8,7]]` → `[[6,5]]`) and shipped that as the fix.

**That is what made it more visible, not less.** Before the change the far hand was
sleeve-coloured — luminance ~42, invisible against a near-black coat. After it, the
far hand is bare skin — luminance ~153 against that same 42 coat. I converted a
hidden hand into a second bright pale blob. He noticed within one build.

Both states were wrong. Dressing a hand in sleeve colour is not anatomy; leaving it
bare with no depth cue is a duplicate.

## 2. THE THINGS IT IS NOT (each ruled out by measurement, not by reasoning)

| suspected cause | test | result |
|---|---|---|
| the hands are drawn in the wrong depth order | compare `BAKED.layerOverride` against what renders | **consistent.** On E his authored order is arm-R, hand-R nearest and arm-L, hand-L far; on screen at rest the near hand shows 13px and the far hand 2px. His layering is being obeyed exactly. |
| the far hand floats free of the body | 24 walk frames, E and W, check every far-hand pixel for a neighbour belonging to its own arm | **0 disembodied frames.** The far hand touches its own arm in every frame it is visible. |
| the far arm is invisible while its hand shows | same sweep, count far-arm pixels whenever the far hand renders | **0 frames.** The arm is always present with it. |

I had also mis-stated the part IDs to myself mid-investigation (5 is arm-L, 7 is
hand-L, 6 is arm-R, 8 is hand-R — line 1141) and briefly concluded the hands were
ordered backwards. They are not. Recorded here because the wrong conclusion was
one command away from becoming a "fix" to something that was never broken.

## 3. WHAT IT ACTUALLY IS

Measured over 12 walk phases, E and W, on the shipped build:

| | E | W |
|---|---|---|
| far hand brightness | 153.2 | 157.1 |
| near hand brightness | 153.8 | 158.1 |
| **difference** | **0.5** | **1.0** |
| sleeve brightness (the coat behind both) | 42.6 | 42.4 |
| frames where the far hand is fully visible (of 24) | 19 | 19 |

**Two hands, the same size, the same brightness to within one unit out of 255,
against a coat 110 units darker, for 19 of every 24 frames.** There is nothing in
the image telling the eye which one is farther away. That is the whole defect, and
it is exactly what "two sets of hands" and "skin flap" describe.

It is not geometry. It is a **missing depth cue.**

## 4. WHY I AM NOT FIXING IT THIS TURN

The only three things that separate a near hand from a far one in pixel art:

1. **Occlusion** — already applied. His authored layering hides the far hand behind
   the torso at rest (13px → 2px). Mid-swing it clears the torso legitimately, and
   forcing it to stay hidden would mean overriding the layering he authored. RIG LAW.
2. **Shade** — the far limb rendered darker. **He banned this on 7/26**: *"lighting
   and shadows is just a completely different layer."* The retired far-arm darkening
   code still carries the note that if the depth read returns it belongs in a
   separate render-time shading layer, not multiplied into sprite pixels mid-composite
   — and that it was flagged to him as undecided. It still is.
3. **Not drawing the far hand at all on E/W** — a design decision about what the
   character looks like, not a bug fix. Not mine to make.

Every route runs through a ruling only he can give. **STOP PRODUCING** (7/26) says a
turn that stops and names the one blocking thing is a good turn, and that writing a
further version of something already rejected means the failure already happened.
So: no third attempt. The diagnosis is the deliverable.

## 5. THE ONE DECISION

Should the far arm and hand on E/W read as **farther away** — and if so, as a
separate render-time shading layer (which respects the 7/26 law), or by not drawing
the far hand in profile at all?

**[PENDING, Paolo's call]**

Zoomed proof, 18x, exactly what ships: `records/hands/HANDS_ZOOM_7_27_26.png`
