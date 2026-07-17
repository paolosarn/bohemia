# BOHEMIA — WHERE THE EXPLODED CHAT LEFT OFF (organized, 7/16/26)

Read the PDF. This is the graphics chat's actual state, not a new plan.

---

## 1. THE BLOCKER IS GONE. TWICE OVER.

The last thing that chat asked you for:

> "Grab `BOHEMIA_BLOCKGEN_RENDER_PROOF_7_14_26.html` and I'll fix the lamps
> against the real anatomy instead of asking you to choose between rebuilding
> your bake or reciting block configs from memory."

**You already uploaded it.** It's on disk, 2,041 KB. So are
`BOHEMIA_NIGHT_BLOCKS_PROOF`, `BOHEMIA_PIPELINE_STATUS`, and every slice V2
through V10. All 4 "files that actually matter" are here. Nothing is missing.

**And you never needed it.** The A-or-B question was answered inside V9 the
whole time. V9's own explainer text:

> "four generated blocks stitched (**2-lane w/ crosswalk, 2-lane,
> residential 1+1, 3-lane**) ... you are walking canonical cells
> **(33,6) suburb → (34,6) suburb → (35,6) commercial → (36,6) arterial
> from seed 12345**"

The block configs were written on the page. The chat asked you to recite from
memory something the file says out loud.

---

## 2. A CORRECTION TO THAT CHAT'S DIAGNOSIS

It told you:

> "V9's bake is 2640px = 60 rows tall while the code says H=62, so the bottom
> two rows have no art at all. **That's a V9 bug that predates me**, and it's a
> real lead on the invisible walls."

That is wrong. Measured just now, straight off your files:

```
V8   const W=24,H=62
V9   const W=24,H=60      <- V9 says 60. 2640px / 44 = 60. V9 is CORRECT.
V10  const W=24,H=63      (the 7/14 V10)
```

**V9 has no dead-row bug.** Its code and its bake agree exactly. The H=62 came
from V8, so the LT0-walk V10 patch carried V8's H onto V9's bake. That mismatch
was *created by the patch* and then blamed on your file. The invisible-walls
lead pointed at the wrong file.

---

## 3. THE FOUR BUGS YOU REPORTED, SORTED BY WHOSE THEY ARE

| bug | whose | status |
|---|---|---|
| **lights in the middle of the street** | the patch's | diagnosed. Lamps were hand-placed at x=3/x=20 as a vertical column down the median. Real law: `grid[0]` and `grid[H-1]`, the sidewalk rows, staggered x every 8. Wrong axis entirely. |
| **grid H mismatch → invisible walls** | the patch's | V8's H=62 landed on V9's H=60 bake. Not V9's fault. |
| **doors in the street** | V9's payload | `DOORS=[{x:3,y:0,...}]` — door sits at row 0, which IS the sidewalk row. Needs your eye on whether that's the bug or the bake. |
| **door vanishes after animating** | V9's payload | not yet diagnosed. V9's door frames, untouched by any patch. |

---

## 4. THE ONE THING STILL GENUINELY OPEN

V9's anatomy is recoverable but not unique. Rows are
`H = 2*sidewalk + 6*lanes - 2 + median`, and lanes are known (2/2/1/3). Solving
for H=60:

- 125 combinations fit
- apply your street canon (sidewalk 1 default / 2 busy / 3 Strip max, and
  residential is not busy) → **9 candidates**
- the cleanest, and the only one where every median is the same:
  **sidewalks 1-2-1-2, medians 2-2-2-2**

That reads right: the 2-lane w/ crosswalk and the residential block get 1-cell
sidewalks, the plain 2-lane and the 3-lane arterial get 2. Busy streets get the
wider walk.

**That is a guess with good manners, and guessing off pixels is exactly what
broke the lamps.** So it stops here until you say.

---

## 5. THE ZIP THING, CONFIRMED
113 files, **zero HTML**. 55 md, 29 txt, 14 js, 1 py. The download didn't do
nothing — it moved every text file and silently dropped every HTML artifact,
which is the whole category you look at. That's why V9 was invisible and why
you've been hand-uploading. You've now hand-uploaded all four that mattered.

---

## 6. PROJECT AT 91%
Unchanged from that chat's read: the 1,854 KB verdicts bundle is the bulk. Laws
+ engine are ~250 KB. No external hosting needed. Verdicts ride in-session like
the art banks, since they're only needed when judging or baking.

---

## NEXT ACTION IS ONE ANSWER FROM YOU
Sidewalks **1-2-1-2, medians all 2** for V9's four blocks — yes, and I place the
lamps on the real anatomy against your existing bake, no regeneration, nothing
lost. Or you name the numbers and I use yours.
