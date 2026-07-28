# THE FAT AND ARM DIALS: THE CLOTHES NEVER MOVE
**7/28/26. Paolo: "Cool lets move on fat and arm length".**

Measured before touching anything. One root cause explains both dials, and it is
not in the dials.

---

## 1. THE FINDING

```
jacket pixels identical across the WHOLE belly range:  TRUE
body   pixels change across the whole belly range:     TRUE
```

`BOH_BODYVAR.apply()` reshapes `BAKED.layers` — the **body**. Garment art lives in
a separate structure (`PD.layers`) that it never touches. **Clothing is a fixed
shell that does not follow the body dials at all.**

## 2. WHAT THAT DOES TO EACH HALF OF THE DIAL

Silhouette width at the navel (y28) facing S:

| | body grid | dressed |
|---|---|---|
| belly −1 | **15** | 19 |
| belly 0 | 19 | 19 |
| belly +1 | 23 | 23 |

Getting **fatter** works, because the body swells past the coat and the coat gets
pushed out of the way. Getting **skinnier does nothing at all** — the body shrinks
to 15px underneath a coat that stays 19px, so the whole negative half of the dial
is invisible on a dressed character. He has been dragging a slider that is dead in
one direction.

## 3. AND IN PROFILE IT BARELY EXISTS

Full range, −1 to +1, on E:

```
y24  7 -> 9    swing 2
y26  7 -> 9    swing 2
y28  7 -> 10   swing 3    <- the navel, the widest point
y30  9 -> 10   swing 1
```

Three pixels of total travel on an 8-pixel-deep torso. **Profile is the view where
a gut reads hardest in real life, and it is the view where this dial does least.**

The head-on dial is not much better: 4 pixels of visible travel on a 19-pixel
torso, against the ±32% the config asks for (which should be closer to 12).

## 4. THE ARMS DIAL IS THE SAME BUG, AND IT IS NOT LENGTH

`arms` is **thickness** — `±45% of arm half-width`. There is **no arm-length dial
in the build at all.** He asked for "arm length" by name, so that is either a new
dial or a wording slip, and it is not mine to assume.

The thickness dial has the same fixed-shell problem: the sleeve does not follow the
arm, so a thinner arm hides inside a sleeve that never moves, and a thicker arm at
+1 swells until the gap between arm and coat closes and the silhouette reads as one
blob.

## 5. THE FIX, AND WHY IT IS NOT IN THIS TURN

Garments have to be warped by the **same per-row edge deltas the body already
computes**. `warpLayers()` builds exactly that map today — `edge = {torso row →
[dLeft, dRight]}` — and applies it only to body parts. The same map applied to
garment layers is the fix, and it is mechanical rather than inventive: garment
pixels get TRANSLATED along rows exactly as body pixels do, so RIG LAW holds and
nothing is repainted.

The work is real though: garment art is a 24x50 grid offset into 56-space
(`G24_OX 16, G24_OY 3`), so the row mapping has to be right, and it has to be
verified across 8 facings and every equipped slot, not just the coat on S.

**This session has already shipped three fixes that measured as no-ops or made
things worse because they were pushed out without enough verification budget left**
(a pass anchored before the garment composite; a skin test that matched the shared
dark ramp entry; a hand fix that brightened what it meant to hide). Starting a
change of this size on the remaining budget would be a fourth. The diagnosis is
solid, the fix is named and located, and it is the first thing to build next.

## 6. THE ONE DECISION

**"Arm length" — a real new dial, or did he mean the existing thickness one?**
The thickness dial exists and is broken by §4; a length dial does not exist and
would ride the bone like height does.

**[PENDING, Paolo's call]**

Sweep he can look at: `records/dials/DIAL_SWEEP_7_28_26.png` (both dials, full
range, S / E / SE).
