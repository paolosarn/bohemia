# THE ORANGE ARM — TWENTY REPORTS, AND THE SENTENCE THAT SOLVED IT (8/2/26)

> *"The orange part of the dead shot dial does not slowly disappear **like the
> rest** of the dead shot dial."*

**That sentence is the whole answer** and I had been reading past it for eleven
fixes. The rest fades. The orange part does not. That is not a missing gate —
which is what I hunted every single time — it is **one element escaping a fade
that already works on everything around it.**

---

## FINDING 1 — ONE `=` THAT SHOULD ALWAYS HAVE BEEN A `*=`

The whole dial renders under one alpha: `ctx.globalAlpha=_df`. Every band, tick,
arc, reticle and echo inherits it and fades with the bullet. Then, inside the
dial block, exactly one function does this:

```js
function drawArmNeedle(c2,px,py,ang,L,al){
  c2.save(); c2.globalAlpha=al;      // ASSIGNS — throws _df away
  ...
  c2.strokeStyle='#caa07a';          // THE ORANGE
```

**MEASURED: it is the only `globalAlpha` assignment anywhere in the dial block.**
Everything else inherits. `fxDrawDial` has none. That is precisely why "the rest"
behaves and this one does not.

Eleven fixes set `_df` harder, gated more members, moved the world dim, deleted a
heat slab. **None of them could ever have worked**, because this line discards
`_df` before drawing a pixel — and I never read it.

## FINDING 2 — AND A SNAP IS NOT A FADE

Then the measurement that explains why twenty reports never matched what I fixed:

**The arm's alpha DURING the killshot was already 0.** It is not on screen during
the kill at all.

What he photographs is **the CHAIN.** His own screenshot reads `SHOT 2 OF 2` with
the FIRE button green — the dial **slams back to full opacity the instant the
killshot ends**, while the camera is still zoomed on the body he just dropped.

| | first frame after the kill | peak across 200ms |
|---|---|---|
| **BEFORE** | 0.045 — full strength | 0.045 (100%) |
| **AFTER** | 0.003 | 0.022 (49%) |

The dial now **ramps back over 420ms** instead of arriving all at once on the
cinematic.

**And it keys off the kill's END, not its start.** My first attempt keyed off
`_ksAt` and did nothing at all — `_dfT` is only the *bullet's* travel (~90-300ms)
while the cinematic runs ~2s, so the ramp finished long before the dial was
allowed back and it snapped exactly as before. Measured, caught, and re-fixed
before shipping.

## FINDING 3 — THE WHOLE DIAL, IN ONE BRANCH

*"Make the WHOLE dead shot dial go away"* — his words, twice. v114 added
`DIAL_GONE` and spent it on the player's pose alone. It now wraps **the entire
instrument**: the wedge, the track, the ticks, the bands, both ghost fans, the
needle, the reticle and the muzzle heat. One branch, so nothing in there can
outlive the fade again no matter what gets added later.

---

## WHY IT TOOK TWENTY

Every investigation I ran asked **"what is drawing?"** and answered it by
instrumenting draw calls — first by count, then by area. Both found real bugs
(the ghost fans, the kick rail, the car heat slab) and shipped real fixes. **None
of them was ever going to find this**, because this is not a thing that draws
when it shouldn't. It is a thing that draws at *the wrong opacity*, and I was
never measuring opacity.

The check now asserts that **no `globalAlpha` assignment may live inside
`drawArmNeedle` again**, because that is the exact shape of the bug that survived
eleven fixes.
