# BOHEMIA — THE VALLEY KEEPS BREATHING (ANIMATION lane, 9/5/26)

Row: ANIMATE-THE-CROWD. Tab: **RUN** (walk around; the city while you stand still).

---

## THE ROW'S PREMISE WAS WRONG, AND THE TRUTH WAS WORSE

The queue said: *"the bake already sends walk frames for the city cast; the decoder
keeps only idle, so every resident is a frozen sprite."* Measured before building:

```
alpha:8629   CITY cast   L.dirs[d]={idle:bake56(d,'idle',0.25,true)}
alpha:8680   RUN  cast   L.dirs[d]={idle:..., walk:[0.25,0.75].map(...)}
```

**Both halves are idle-only on the walked surface.** The walk frames the row
remembers belong to the RUN cast bridge, fifty lines away. Fixing the decoder alone
would have changed nothing, because there was nothing to decode — the shape this
repo already named: *a duplicate nothing reads is where your fix goes to die*, and
the ONE WALKED SURFACE migration leaving behind everything not on its list.

## AND PEOPLE NEVER WALK, SO WALK FRAMES WERE THE WRONG ANSWER ANYWAY

`pplAt(p)` returns one of three discrete spots — home, favSpot, outSpot. Residents
**teleport** between them; there is no in-transit state. A walk cycle on a standing
body is moonwalking in place.

What they actually needed was the **breath**. And the cast was baked as **one still
frame at phase 0.25** of a clip that does move — `idle` peaks at 6.9% of the body on
S. Every resident in the valley was frozen not because the clip is dead but because
nobody ever asked for a second frame.

## THE BIGGEST ONE, AND NOBODY HAD MEASURED IT

**Standing still in the walked city, `render()` was called ONCE across a
three-second wait (5.6 s of wall time).**

`animate()` runs a rAF loop for exactly one BEAT after a step, then cancels itself.
Nothing else asks for a frame. So the whole valley is a still photograph the moment
the player stops walking — including the **19 animals on screen**, whose pass has
computed its positions from `performance.now()/500` since 8/26. The motion was
built, correct, and never asked for. The seventeen invisible hats, in the render
loop.

This is a third direction on "THE CITY SEEMS DEAD ASF". Day 13 answered it with
content density, day 22 with sound. Neither asked whether the city was *drawing*.

## WHAT SHIPPED

1. **A heartbeat.** One `render()` on the BEAT (120 BPM LAW — the same clock the
   metronome, the footsteps and the animals are on). Four guards, because his
   dispatch item 7 is PERFORMANCE: human mode only, never while `animate()` owns
   the frame, never while the document is hidden.
2. **The city cast is baked with a breath cycle** — 4 phases, because
   `ANIMBEATS.idle` is 4, so it is exactly one frame per beat.
3. **The decoder keeps them, and `ctBody` picks by beat**, offset per person so
   nobody breathes in unison.

**The cost, measured, not argued:** `render()` takes ~1 ms. The heartbeat spends
**2 ms per second — 0.2% of one core**, against the 60 frames a second the city
already spends for a whole beat after every single step.

**Measured after:** renders while standing 1 → 7 per 3 s. Cast breath frames 0 → 4
per facing. The screen he is looking at changes every beat (4 of 4 screenshots
distinct; before, it could not have). 289 people around the player spread 69/75/76/69
across the four phases. Zero page errors.

## THE BUG I NEARLY SHIPPED, AND THE TWO RULERS THAT WOULD NOT HAVE CAUGHT IT

The first offset was `(p.id>>>0)`. `personFields` gives `id` as a **string**
(`"nx:ny:i"`), so that is **0 for every person in the valley** — the whole crowd
would have breathed on the same frame on the same beat, nothing would have thrown,
and the code would have read as though it staggered them. Hashed properly now.

Then the gate written to hold that claim **failed to catch it, twice**:

1. **v1 counted distinct frames over the whole roster.** The six cast *looks* are
   six different bodies, so it read 6 distinct and passed with the breath cycle
   deleted. **The look supplied the variety, not the breath.** Fixed by holding the
   look and the facing constant.
2. **v2 still passed** with the offset mutated back to the broken version. The sweep
   over 289 people takes longer than a 500 ms beat, so `beat` changed part way
   through the loop and **TIME supplied the variety** — the same shape as the 8/30
   gate whose answer depended on where its walker stopped. Fixed by pinning
   `performance.now()` so the instant is an actual instant.

Only then did the gate go red on the real bug. **Both wrong versions were green, and
both looked reasonable.** A claim about variety has to name every source of variety
it is not asking about.

## GATE

`gates/valley_breathes_gate.js` — 8 claims, **3 mutations proven caught**: the
heartbeat removed, the cast back to one still, and the string-id offset trap.

Registered in the suite as VALLEY BREATHES.
