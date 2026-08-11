# ONE ZOOM, ALL THE WAY TO THE MOON — 8/12/26 (RUN lane)

Paolo:

> "in the run how do we combine the city builder map with the map in the phone. my
> original intention was that is was this zoom out vibe you could keep zooming out
> and zooming out until it showed the moon you know. that was my original
> philosophy and i want to stick with that thats my flavor."

---

## HE DID NOT ASK FOR A NEW FEATURE. HE ASKED WHY HIS OLD ONE WAS UNFINISHED.

`laws/BOHEMIA_ADDENDUM_CITYBUILDER_TOP_DOWN_ONLY_7_25_26.md`, **LOCKED**, opens
with his words from 7/25:

> "As you zoom out on your character then at some point it organically becomes the
> city builder, and then if you keep zooming out you could see the rest of the
> world." … keep it all "on this diamond isometric 45 degree angle view."

Two of its three bands shipped that day. Its **last line** reads:

> STILL TO COME: the third zoom band (keep zooming out to see the rest of the
> world) — that touches the MAP surface (another lane), so coordinate, don't jam.

That coordination never happened. **The band sat unbuilt for eighteen days, and
nothing was blocking it but a note to coordinate with nobody in particular.** That
is worth writing down as its own failure mode: *a [PENDING] that names no person
and no question is not a pending, it is a dropped stitch.*

## AND IT IS THE SPINE OF THE GAME

`laws/BOHEMIA_ADDENDUM_ACT3_MOONSHOT_STRUCTURE_7_19_26.md`, **LOCKED**:

> "the generations are Animal / Human / Angel and **the camera levels are street /
> city / planetary zoom**. Act 3 was always Angel, always the planetary level."

> THE MOONSHOT IS ONE-WAY. The gen-3 (Angel) heir goes and does not come back.
> **The dynasty ends looking down at the planet.**

So the zoom axis and the generation axis are **the same axis**, and the furthest
the camera can pull back is the exact place the story ends. Pulling out to the moon
on day 1 is the whole game foreshadowed in one gesture. His "flavor" is the
architecture.

---

## WHAT WAS ACTUALLY IN THE WAY: ONE LINE

```js
z = Math.max(zmin, Math.min(zmax, z));      // setZoomAt
```

`zmax` already had a seam — `__ZOOM_SEAM__`, shipped earlier: pinch **in** at the
closest city zoom and you become your character. `zmin` had a **wall**. The valley
fit the screen and that was the end of the world.

The fix is the same seam, outward.

## THE CHAIN, MEASURED IN A REAL BROWSER

```
human/44 → human/11 → city 1.00 → … → city 0.21 → REGION → PLANET → MOON
```

and back:

```
MOON → PLANET → REGION → city 0.21 → … → city 2.60 → human/11
```

One camera. One scalar. Zero page errors from his feet to the moon and back.

| band | what you see |
|---|---|
| REGION | the Mojave floor around the valley, haze on the horizon, the valley diamond shrinking |
| PLANET | the curve, the atmosphere rim going thin, the first stars |
| MOON | space, the earth a disc below, the moon up in frame |

## THE ANSWER TO HIS ACTUAL QUESTION

"How do we combine the city builder map with the map in the phone."

**Not by merging the two renderers.** That was the obvious reading and it is wrong:
a phone's map *should* look like a phone's map, because it is a device someone is
holding. Making it draw the isometric builder would make the phone stop being a
phone.

**They are combined by sharing the world and the camera.** The ONE MAP law (7/27)
already made both surfaces read the same world model. Now tapping a cell on the
phone's map moves the run's camera to it: the phone stops being a picture *of* the
valley and becomes a way *into* it. That is the only kind of "one map" that means
anything.

And it **never moves his body** — only the camera marker, exactly like tapping a
plot in the builder. That clause is in the law on purpose: on 8/11 I moved the
player away from his spawn and silently broke CITY TALK, whose cast is placed by
neighbourhood. The same mistake must not come back through a different door.

---

## WHAT IS PLACEHOLDER, AND THE SCREEN SAYS SO

The earth and the moon are **procedural discs** drawn from the palette the city
already uses, and the corner of the screen reads *"placeholder sky · art request
AR-005"*.

Measured, not assumed: **the repository contains no celestial art of any kind** —
no planet, no moon, no star field, in any bank. There was nothing to reuse, which
is exactly why it is REQUESTED rather than quietly invented. **AR-005** is filed
with the measured gap and a spec, and it names the marker (`__SKY_ART__`) that will
prove it shipped. The mechanism is the deliverable; the pixels are the ART lane's,
and they drop into two functions.

**The 45 DEGREE ART LAW is not broken by this**, and that is not a convenient
reading: that law governs objects seen in the world's three-quarter view, and canon
already names this camera separately — *"street / city / **planetary** zoom"* (7/19,
LOCKED). The valley diamond itself stays on the 45 the entire way out, which the
gate proves by moving the city marker in the REGION band and watching the painted
valley move with it through the city's own `iso()`.

---

## PROOF

`gates/onezoom_gate.js`, 16 assertions, driving the real camera in a real browser
with the network dead:

- the chain is unbroken **outward** and **inward**, and inward really lands back on
  his feet
- every band actually **paints**
- the pixels **differ** band to band — a state machine that renders the same frame
  is a state machine, not a zoom
- the REGION band uses the **city's own iso projection**, so the diamond survives
- the phone's GO moves the camera and **does not** move his body

Registered in the suite and in `shipped_truth_gate` (RUN lane 18/18 live).

---

## ONE THING I FOUND AND DID NOT FIX

The **mouse wheel** dead-ends at the human→city seam: the wheel handler clamps its
index to the lowest human zoom stop, so it never passes a value *below* it, and only
a pinch (which passes a continuous value) triggers the handoff. On his iPhone he
pinches, so the continuum is whole on the surface he plays. It is a desktop-only
paper cut in another lane's gesture code, and it is written down here rather than
jammed.
