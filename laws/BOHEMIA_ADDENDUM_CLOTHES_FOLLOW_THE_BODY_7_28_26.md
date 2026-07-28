# BOHEMIA ADDENDUM — CLOTHES FOLLOW THE BODY
**Paolo, 7/28/26. LOCKED.**

> "the arm and belly slider still need work" (7/27)
> "Cool lets move on fat and arm length" (7/28)

He said the body dials were wrong three times. It was never the dials.

---

## 1. WHAT IT WAS

```
jacket pixels identical across the WHOLE belly range:  TRUE
body   pixels change across the whole belly range:     TRUE
```

`BOH_BODYVAR.apply()` reshapes `BAKED.layers` — the **body**. Garment art lives in
`PD.layers`, which it never touched. **Clothing was a fixed shell.**

Silhouette at the navel (y28, facing S):

| | body grid | dressed, before | dressed, after |
|---|---|---|---|
| belly −1 | 15 | 19 | **15** |
| belly 0 | 19 | 19 | 19 |
| belly +1 | 23 | 23 | 23 |

Getting **fatter** worked, because the body swelled past the coat and shoved it
aside. Getting **skinnier did nothing at all** — the body shrank to 15px under a
coat that stayed 19px. **Half of that slider was dead**, and it was the half he
kept dragging.

## 2. THE LAW

**A garment is fitted to the body the dials made, before the skinner poses it.**
Cloth tracks the flank in BOTH directions — out when he gets fat, in when he gets
thin. A garment that ignores the body is a bug, on every slot, on every facing.

## 3. WHERE IT GOES, AND WHY THERE

The body warp happens in **rest space** (`warpLayers` on `BAKED.layers`). The
garment is placed into **rest space** too, at `(lx+G24_OX, ly+G24_OY)`, before
`skinColorLayer` deforms it. Both live in the same space at the same moment, so
fitting the cloth there means the skinner carries body and clothing through the
pose **together** — no second deform, no new resample, no new morph.

`CLOTHES_FIT[d][y] = [l0,r0,l1,r1]` is that rest row's body span before and after
the warp; a garment pixel on the row is remapped from the old span onto the new
one. It is driven by **the body's own measured extents**, not by a second copy of
the dial maths — which is what stops cloth and body ever drifting apart.

**A row shift would not have worked.** A shift moves a row sideways; it cannot
make a coat narrower. The broken half was the narrow half, so a shift would have
fixed the half that already worked.

## 4. WHAT IS GUARANTEED

- **Neutral is byte-identical.** Rows the body did not move are omitted from the
  map entirely, so the mapping is the identity. Measured over 8 facings x 2 clips
  x 4 phases with the feature on vs off: **0 pixels changed**.
- **No new holes.** Enclosed empty cells inside the silhouette at belly ±1 and
  arms ±1, across all 8 facings: **2 with the feature off, 2 with it on**.
- **Head slots never move.** Hair, hat, glasses and facial sit above the torso, so
  their rows are never in the map.
- **REUSE-FIRST:** cooks no art, invents no colour. Every pixel written is one
  Paolo painted, carrying its own ramp index, moved to a new column.

## 5. THREE SCOPE TRAPS ON THE WAY, ALL THE SAME SHAPE

1. **TDZ.** `rebuildFromRig()` runs once AT LOAD from a line *above* the flag, so a
   `const`/`let` flag was still in its temporal dead zone — and the `catch` meant
   to absorb that **also assigned to the dead variable**, throwing again. Both are
   `var` now.
2. **`CW` is not in scope.** `CW` lives inside the `SKINNER_API` closure.
   Referencing it threw, **the catch swallowed it**, and the map came back
   silently EMPTY while the code read perfectly correct. The pass measured as a
   total no-op. A local `_CW = 56` now, and the catch records the message.
3. This is the **third** closure boundary to cost a round in two days
   (`RIGFAITH`, `CHAR_OUTLINE`, this). **A `catch` around initialisation must
   record what it caught.** A silent catch turned a one-line bug into a fix that
   looked correct and did nothing.

## 6. THE SQUIGGLE AND THE SHOULDER ARE ONE BUG (Paolo 7/28/26, same day)

> "why can't you just compact and widen the shoulder to accommodate... it's very
> upsetting to see the arms getting fucked up... their arms squiggly fucked up."

Two complaints, one cause, measured on S:

| | shoulder (row 18) | navel (row 28) |
|---|---|---|
| belly −1 | **18** | 15 |
| belly 0 | **18** | 19 |
| belly +1 | **18** | 23 |

**The shoulder never moved.** The torso profile returned `0` for the top 35% — the
chest was pinned while the gut travelled a full 3px. A fixed shoulder over a moving
waist is a **step** in the silhouette, and a step is what reads as squiggly: the
outer edge went out at the shoulder, in at the waist, out again at the hip.
Direction flips down the edge, 1 at neutral, **3 at belly −1**.

### FIX A — the chest takes a share
A thin man is narrow at the shoulder too; a heavy one is broader. The chest now
takes `SH = 0.5` of the dial and eases to the full amount at the navel, so the
torso tapers as one shape. The very top still barely moves (`SH * 0.35` at t=0)
because that row joins the neck, and a shoulder that jumps away from the neck is
the detached-limb bug the zero was originally protecting against. **A share, not a
free pass.**

### FIX B — the arm is RIGID
The arm-follows-flank pass was handing `shiftPart` a **per-row** shift, so every row
of the arm moved by that row's own flank delta — which **bends the arm into the
waist contour**. On S at belly −1 the outer edge ran `35 35 35 36 36 36 35 35 35 36
36`: in, out, in, out. That wave *is* the squiggle.

An arm hangs **from the shoulder**. It takes **one** shift — the flank delta at the
row it attaches to — and every row moves by that same amount. The comment two
blocks above it has always said *"the arm is TRANSLATED, whole, full stop"*; it
simply was not doing it. RIG LAW is happier too: **one integer translation cannot
reshape his painted arm; a per-row one can.**

### MEASURED AFTER

```
belly -1  direction flips: 3 -> 1   (neutral is 1)
belly +1  shoulder row 18: 18 -> 20
belly -1  shoulder row 18: 18 -> narrows with the waist
```

The edge runs monotonic again at every dial value.

## 7. STILL HIS CALL

**ARM LENGTH DOES NOT EXIST.** The `arms` dial is **thickness** (`±45% of arm
half-width`). He asked for "arm length" by name. A length dial would ride the bone
the way `height` does. **[PENDING, Paolo's call]** — new dial, or did he mean
thickness?

Tool: `tools/bohemia_clothes_follow_the_body_patch.py` (idempotent).
Gate: `gates/clothes_follow_gate.js`.
Sweep: `records/dials/DIAL_SWEEP_7_28_26.png`.
