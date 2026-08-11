# THE GIANTS WERE A REAL BUG, AND I LOOKED STRAIGHT AT THEM

**8/11/26 — COMBAT lane. Answers Paolo 8/11: "are you fucking for real like
you're going to stretch the fucking map so the characters look like fucking
Giants on the map... that was so creepy and so bad... that was a failure."**

---

## HE IS RIGHT. HERE IS EXACTLY WHAT I DID

To zoom the board out I lowered the tile size. **The floor obeyed. The people
did not**, because every human in this game is drawn from a 112×112 image at a
hardcoded size that does not know the board exists:

```js
x.drawImage(cv112, Math.round(ex-56), Math.round(ey-84));
```

So the ground shrank by 2.2× and the men stayed exactly as big as they were:

| | tile size | a man is |
|---|---|---|
| before | ~36.5 px | **~3 tiles tall** |
| what I shipped | ~16.3 px | **~6.9 tiles tall** |

That is not a zoomed-out board. That is a stretched floor with giants standing
on it, and "creepy" is the right word, because the proportions of the world
changed underneath him without anything saying so.

## THE PART THAT IS ACTUALLY MY FAILURE

I rendered the board at four sizes, looked at the screenshots, **saw that the
bodies were not shrinking**, and wrote down *"bodies stay readable at every
pitch"* as if that were good news. The bug was on my screen and I called it a
pass.

**Looking is not verifying if you do not know what would count as failure.** So
the thing I got wrong by eye is a number now, and the machine checks it:

> **How many tiles tall is a man? It must not change when the zoom changes.**

`gates/combat_scale_gate.js` boots the real game and measures it. I put the old
bug back in on purpose to confirm the gate catches it. It does.

---

## THE RESEARCH, AND WHY THE ZOOM IS A WHOLE NUMBER NOW

Pixel art may only be scaled by **whole numbers**. Scale by a fraction and some
source pixels cover two screen pixels while their neighbours cover one, so
columns come out visibly fatter and everything shimmers when it moves. Polished
pixel games either scale by integers and snap the camera to whole pixels, or
render the world to an offscreen image and blow *that* up by an integer.

The number I shipped was `0.038`, which is not the old size divided by anything
clean. **It was a number I picked off a screenshot.** Now:

- `FIELD_ZOOM` is a whole number: 1 = the old board, 2 = twice the ground, **3 =
  three times, which is what ships**
- the floor size and the people both divide by that same number

**One number drives both, so they can never disagree again.** The world keeps
the proportions it always had and you simply see more of it, which is what
zooming out was supposed to mean.

---

## THE SAME BUG TURNED UP TWICE MORE, AND I FOUND BOTH

**1. The edge of the board was empty by construction.** Cover stopped at a
hardcoded 28 tiles while the amount you can see moves with the zoom — so at this
zoom you could see 30 tiles and the outer ring was bare desert. Two numbers that
should be one. How far the world gets built is now derived from how far you can
see.

**2. My cover-density arithmetic was wrong, and I had written the opposite in
the record.** I claimed the bigger board "holds the density". Checked:

| | cover | over radius | works out to |
|---|---|---|---|
| original | avg 8.5 pieces | 11 tiles | 1 per **45** tiles² |
| what I shipped | avg 20 pieces | 28 tiles | 1 per **123** tiles² |

I **thinned** the cover by 2.7× while writing that I had held it. That is why
the big board read as empty sand with a road through it. It is ~55 pieces now,
which is the original density, and the board fills edge to edge.

**3. The chest marker — caught by the gate, not by me.** Every hit mark and
cover ring hangs off a point that is half of the sprite's own height offset. I
scaled the sprite and would have left that marker at its old size, floating
above a man a third that tall. The giants bug, inverted, on the aiming reticle.
An existing gate said "a sprite-height change has one number to follow" and
caught me not following it.

---

## WHAT IS ON THE BOARD NOW

Three times the ground you could see before, everything in correct proportion,
cover across the whole visible field, and the far gun sitting at the edge of the
world wherever that edge is rather than at a number that goes stale the next
time the zoom moves.

Tool: `tools/bohemia_combat_the_people_scale_with_the_board_patch.py`
Gates: `gates/combat_scale_gate.js` (new, in the suite) + `combat_lab_gate.js`
744 → 745 checks.

**WHERE TO SEE IT: the COMBAT tab.** People are people-sized next to the cars
again, and the arena is three times the size it was this morning.

---

Sources:
- [Pixel-Perfect Scaling: Why Your Pixel Art Goes Blurry and How to Fix It](https://spritesheetgenerator.online/blog/pixel-perfect-scaling-nearest-neighbor)
- [How to Scale Pixel Art Without Blur or Uneven Pixels — Divoom](https://divoom.com/blogs/setup-ideas/scale-pixel-art-without-blur)
- [Pixel Art Filtering — Gabriel's Virtual Tavern](https://jorenjoestar.github.io/post/pixel_art_filtering/)
- [Pixel-art scaling algorithms — Wikipedia](https://en.wikipedia.org/wiki/Pixel-art_scaling_algorithms)
