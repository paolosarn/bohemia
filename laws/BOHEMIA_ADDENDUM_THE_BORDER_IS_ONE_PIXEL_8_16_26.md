# BOHEMIA ADDENDUM — THE BORDER IS ONE PIXEL WHERE HE SEES IT
**Paolo, 8/14/26 and 8/15/26. LOCKED.**

> "the character models need twice as many pixels and the black border has to be
> thinner, like half as thin"

> "I'm looking at the character right now and again I want that black outline to be.
> It's thin in some parts and I like that but yeah like."

---

## THE LAW

**The black border around the character is ONE pixel at the size he sees it.**
Not one pixel in some internal buffer that then gets doubled on its way to the
screen. One pixel on his phone.

The border pass is therefore the last thing that happens before the frame is
displayed, at the display resolution — and it runs on **every** path that shows him
a character, not just the one that was noticed first.

Gate: `gates/border_gate.js`. Mutation-tested against the exact old behaviour.

---

## WHY IT WAS TWO, AND WHY NOBODY SAW IT IN THE CODE

`CHAR_OUTLINE` always drew exactly one pixel. It always did. Read it and it is
correct. It is *still* correct — not one line of its logic changed.

The bug was never in the pass. It was in **when the pass ran**:

```
compose at 56  ->  outline 1px  ->  Scale2x to 112  ->  he sees 2px
compose at 56  ->  Scale2x to 112  ->  outline 1px  ->  he sees 1px   <- the law
```

Its own comment claimed it was "THE LAST PASS IN THE FRAME, deliberately." It was.
It just was not the last pass before the **screen**, and the frame is not the screen.
Scale2x doubled his border along with everything else, faithfully, because that is
what an upscaler does.

**This is the general shape of the mistake, and it is worth keeping:** a pass can be
individually correct and still be wrong because of where it sits in a pipeline. No
amount of reading `CHAR_OUTLINE` finds this. Only measuring the pixels he actually
receives finds it. (VERIFY ON THE REAL SURFACE, 7/18.)

---

## THE RULER FAILED FIRST, AS IT ALWAYS DOES

The first attempt to measure the border took the widest row of the sprite, walked in
from the left, and counted black. It reported **10px**.

He wears **black trousers**. It was measuring his clothes.

A ruler that cannot tell the outline from a dark garment would have reported "no
change" straight through a working fix, or "fixed" straight through a broken one.
The measurement only became real when it was taken **where skin meets the border**,
across many rows, as a median.

> **ASK FOR THE THING THAT CHANGED. FIX THE RULER, NEVER THE TARGET.**

---

## BOTH TABS, OR IT IS NOT DONE

`drawChar` is not the only thing that draws him. `bake112` composes the sprites
handed to the combat module. Fixing only `drawChar` would have outlined him 1px in
CHARACTER and 2px in COMBAT — a split that reads as "the art is inconsistent"
rather than as a bug, and that nobody finds by looking at a diff.

The gate asserts both paths agree. Any future path that renders a character joins
that assertion or the law is not enforced on it.

---

## WHAT THIS ADDENDUM DOES **NOT** CLAIM

It does not deliver the other half of the 8/14 ruling — *twice as many pixels*.
That half is honest, unfinished, and written up in
`records/BOHEMIA_2X_WHY_THE_RIG_STAYS_AT_56_8_16_26.txt`. Short version: the
machinery to compose the character at 112 is built, proved, and in the file, dormant
at `RIG_RS = 1`. What is missing is not plumbing — it is **painted detail**, and
upscaling cannot invent it.

The border half shipped alone because it is real, visible, and costs nothing.

---

## THE ENFORCED SHAPE

| # | Assertion | Why it exists |
|---|---|---|
| 1 | Border is 1px on all 8 facings, measured against **skin** | his ruling; the naive ruler read his trousers |
| 2 | Worst run ≤ 2px, so a median cannot hide a fat edge | a median passes while one edge is wrong |
| 3 | **Only the border moved** — every non-border pixel matches the borderless frame upscaled identically | "we thinned the border" must never quietly mean "we resampled him" |
| 4 | The border still **closes** — no character pixel faces the outside unbordered | thinner must not mean gappy |
| 5 | `bake112` (COMBAT) carries the same 1px border | one character, one outline, every tab |

Assertion 3 is the one that makes this safe: it is a machine proof that the body he
approved is byte-for-byte the body still being drawn.
