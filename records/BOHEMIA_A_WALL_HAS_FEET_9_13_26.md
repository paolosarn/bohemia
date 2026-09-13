# A WALL HAS FEET (9/13/26, LIFE + CITY lane)
## VAMILY row `[base shadows]` — routed from his #1 break, "the streets don't look like streets"

DIRECTION `[streets read]` judged the demo's spawn street at phone size and routed item 4
of the verdict here:

> **"THE WALL WITH NO FEET.** It cuts across with no base shadow, so it reads as a
> **texture change** instead of a standing thing. → LIFE+CITY layering: standing
> structures carry a 1-2px ground shadow at their base line, **always**."

**Shipped. 6 feet on the spawn screen at 2px, and 6 still drawn at two in the morning.**

---

## THE CAST SHADOW WAS ALREADY THERE, AND IT IS NOT THIS

Measured at the spawn before writing a line — my new rule is to prove the instrument can
show a positive before believing a negative:

    48 cast shadow rects drawn      33 solid cells on screen
    sun at 06:00 = (-0.50, 0.86)    23 of them sitting on open ground

**The pass works.** But a cast shadow is thrown by the sun and lands a whole cell away:
the first rect is half a cell left and most of a cell down. **Nothing touches the foot.**
That gap between the wall's bottom edge and where its shadow begins is what makes the
brick band read as a stripe of different paint.

A **contact** shadow is not a cast shadow. It is the light that cannot get into the join,
so it does not move with the sun and does not stop at night — which is exactly why the
verdict says *always*, and why this runs **before** `sunVec()`'s early return.

## WHAT SHIPPED

A contact pass at the base line: every solid cell whose ground below is open gets a dark
strip on the ground at its foot.

- **`CONTACT_OF_C = 0.05`** — 2px at the walk zoom's 44, 1px zoomed out. The verdict's own
  "1-2px", expressed against the cell it is measured on rather than typed twice.
- **Reuses `SHADOW_A`** rather than inventing a second alpha, because the line four above
  it says *"one flat value. NO DITHER, NO GRADIENT"* and a contact shadow with its own
  dial would be the first crack in that.
- **Only at the base line.** A solid cell with solid below it is mid-wall; shading it
  would draw a line across the brickwork.

Before and after, cropped to the same box and looked at: the brick band's bottom course
now has a dark line under it and sits **on** the ground. Honestly — it is a *modest*
change. The wall still reads flatter than a real one, and that remainder is the wall
**face** having no light variation, which is COOK's art half of the same verdict, not
mine.

**What I did NOT do:** the row also says "and kerb edge". The verdict's own routing puts
the kerb line in item 3 → **COOK** ("1px kerb edge, weeds to the seams"). That is art, not
layering, and I left it there rather than drawing a second lane's line.

## THE MUTATION TEST FOUND A HOLE IN MY OWN GATE

| mutation | expected | first result |
|---|---|---|
| move the feet **behind** the sun check | RED | **A1 red — but B3, the "always" leg, stayed GREEN** |
| shade every solid cell, not just the base line | RED | A2 red ✓ |

**B3 is the leg the entire claim rests on, and it was not measuring.**
`window.__CONTACT_RECTS` was a plain global, so when the pass stopped running at night the
leg read **last frame's 6**. The gate went green on a mutation that broke the very thing
it exists to hold.

Counter now cleared every frame. Same mutation re-run: **night reads 0, B3 bites.**

> **A COUNTER THAT IS NEVER RESET IS NOT A MEASUREMENT, IT IS A MEMORY** — and "the feet
> stay at night" is exactly the claim that cannot rest on one.

*Noted, not touched:* `__SHADOW_RECTS` has the same staleness (it reads 48 at two in the
morning, from the afternoon). Another lane's gate counts it and resetting it here could
turn that red for a reason unrelated to this row.

## AND I FOUND A CRASH OF MY OWN, TWO ROUNDS OLD

`tap_picks_gate` was red on main — **verified identical on a clean checkout, so not caused
by this diff** — with a harness crash: `Cannot read properties of undefined (reading 'src')`.

It is mine. `prism()` records `{sx,sy,h}` with **no image**, and both halves of the picker
I shipped on 9/11 reached through it: `cbArtRise` read `.src`, `cbPaintAt` read
`.naturalWidth`. **A tap on a tile raised an exception instead of selecting anything.**

It hid because when `[tap picks]` shipped I measured **zero prism calls at every zoom** and
took *"never happens"* for *"cannot happen."* Something on main draws one now.

Fixed properly rather than guarded: the hit test **dispatches on what was actually drawn**.
A plate is asked for its pixel exactly as before; a prism is asked for its **geometry** —
it is the tile's own diamond lifted by `h`, so the test is `dia()`'s vertex walk moved up.

**And the gate carried the identical defect**, calling `cbArtRise(v.im)` on every record
including prisms — *the ruler had the same bug it exists to catch*, and went red as a
crash rather than as a finding.

**It is still red, and I am not claiming otherwise.** It now reports an honest **0 of 0**
instead of crashing, and the remaining cause is named: that gate drives by
`MODE='city'; TW=t; render()` — **assignment, the technique I have now twice proved
wrong.** Rebuilding it on the player driver is its own round, not a line in this one.

---

    contact shadows   0 -> 6 on the spawn screen, 2px at walk zoom 44
    at night          6, with sunVec() null            (the verdict's "always")
    gate              a_wall_has_feet_gate.js 9/0, registered, mutation-tested twice
    tap_picks_gate    red on main before and after; crash -> honest 0 of 0, cause named
    demo              NOT re-cut (rule 14a)
