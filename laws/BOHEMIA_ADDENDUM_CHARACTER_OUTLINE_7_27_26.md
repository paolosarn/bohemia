# BOHEMIA ADDENDUM — ONE BLACK PIXEL AROUND THE WHOLE CHARACTER
**Paolo, 7/27/26. LOCKED.**

> "I want there to be a one pixel one black pixel border around the whole
> character. You know just wrap around no matter what direction they're facing.
> I think it would help fit them in the world a lot better."

---

## 1. THE LAW

Every character sprite carries a **1-pixel black border** around its finished
silhouette, on **every one of the eight facings**, on **every frame**.

Four things are non-negotiable about it:

1. **EXACTLY ONE PIXEL.** Never two, never three, never thicker in the corners.
2. **NO GAPS.** Every empty cell touching the character orthogonally is black.
   A border with a hole in it is worse than no border.
3. **IT NEVER TOUCHES HIS ART.** Not one painted pixel changes colour. The
   outline only ever writes into cells that were EMPTY.
4. **IT IS COLOUR ONLY.** The occupancy `grid` stays 0 under the outline, so
   collision, hit-testing, OCCUPANCY LAW and every measurement tool still see
   the true silhouette. A character does not get 2px fatter because it got an
   outline.

---

## 2. IT IS THE LAST PASS. THAT IS THE WHOLE TRICK.

The outline is computed at the very end of `buildFrame`, after:

- the body composite
- garments
- DRESS THE BACK LIMB
- the LIMB SEPARATION line
- the final floater cull

It has to be last, for two separate reasons, and both were learned the hard way:

**Anything drawn after it covers it.** That is exactly the bug that made the
limb separation line worthless for an entire session: the line was drawn, then
clothing composited on top of it, and the measured effect was zero while the
code looked correct. A border drawn mid-pipeline is a border that is not there.

**Running after the floater cull means it never outlines a corpse.** The cull
deletes stranded specks. Outline first and you get a 3x3 black square floating
next to the character where a speck used to be.

---

## 3. SNAPSHOT, OR IT GROWS ON ITSELF

The outline is computed from a **frozen snapshot** of the finished sprite:

```
const solid = new Uint8Array(CW*CH);
for (let i=0;i<px.length;i++) if (px[i]) solid[i] = 1;   // SNAPSHOT FIRST
... then paint, reading only `solid`, never `px`
```

Read `px` live while painting and each new black pixel counts as a body pixel
for the next cell, so the border eats outward one ring per scanline and you get
a creeping 2-3px smear that is thick on the bottom-right and thin on the
top-left. Snapshot-then-paint is the difference between a border and a stain.
**The gate pins this.**

---

## 4. THE SCOPE BUG — DO NOT REPEAT IT

The `CHAR_OUTLINE` flag was first declared next to `RIGID`. That reads as the
obvious home for a render flag, and it is **wrong**: `RIGID` lives INSIDE the
`SKINNER_API` closure and `buildFrame` lives OUTSIDE it. Every frame threw
`ReferenceError: CHAR_OUTLINE is not defined`, the alpha never finished booting,
and the symptom presented as a **Playwright timeout** — which sends you hunting
a harness bug for as long as you are willing to be fooled.

`RIGFAITH` had already cost a round to the exact same closure boundary, and it
was fixed by exporting it on `SKINNER_API`. The flag is now declared in
**buildFrame's own scope, immediately above the function**, so there is no
boundary to cross at all.

**THE GENERAL RULE, worth more than this one flag: a load-time hang in the alpha
is a page error until proven otherwise. Capture `pageerror` FIRST, before you
touch the test.** A timeout tells you the page never got there; it never tells
you why.

---

## 5. WHAT WAS MEASURED

192 frames — all 8 facings x idle/balance/walk x 8 phases — each built twice,
once with `CHAR_OUTLINE.on=false` and once with it on, and differenced:

| check | result |
|---|---|
| outline pixels painted | 25,628 |
| double-thick / non-black outline pixels | **0** |
| silhouette cells missing an outline | **0** |
| painted (Paolo's) pixels changed | **0** |

Proof sheet: `records/outline/CHARACTER_OUTLINE_7_27_26.png` — every pair the
same pose, off then on, drawn on the pale desert ground he actually walks on.
Verified on the REAL SURFACE too (7/18 law): the live character menu.

---

## 6. THE ONE THING HE SHOULD KNOW

The visual constitution forbids a black **keyline** on art banks. **This is not
that.** This is a character/world separation outline, drawn at render time,
outside the sprite, into empty cells, and it is what he asked for by name. The
distinction is real: a keyline is baked into an asset; this is a render pass on
a silhouette and it comes off with one flag.

The honest caveat is a different one, and it is about how it LOOKS: his current
coat is nearly black, so the border mostly reads at the **head, hands and
boots** and against **pale ground**. It is loud where the character is light and
quiet where the character is already dark. If he wants it to read everywhere,
the alternative is the constitution's darkest ground value instead of pure
black, which separates from the coat as well as from the sand.

**That is his call. `CHAR_OUTLINE.color` is one line.** [PENDING, Paolo's call]

---

## 7. GATE

`gates/character_outline_gate.js` — registered in `gates/bohemia_gates.py`.

It pins: the flag exists and is in `buildFrame`'s scope (not the skinner
closure), the pass is last (after the floater cull, before the return), the
snapshot exists and the paint loop reads `solid` and not `px`, the grid is never
written, the colour is a flag and not a literal, and the measured numbers above
are in this file.
