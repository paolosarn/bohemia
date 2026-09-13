# THE SLABS WERE ALREADY GONE (9/13/26, LIFE + CITY lane)
## VAMILY row `[tiles not slabs]` THE-CITY-RENDERER-DRAWS-THE-TILES, round 1

**Nothing shipped to the game this round, on purpose. The row's premise is five days
stale and I have the number: the city already draws 9,050 images at the far zoom, and
only 1.7% of cells still fall through to a coloured slab.**

The renderer is built, correct, mutation-ready and **deliberately not wired in**. It
lives in `tools/bohemia_city_tiles_patch.py`, one command away, for the round where it
earns its place.

---

## THE ROW, AND WHY I TOOK IT

> **Paolo 9/8**, from his own frame
> (`records/target/PAOLO_WHY_DOES_THE_CITY_LOOK_LIKE_THIS_9_8_26.png`):
> *"why does the city keep looking like this when I'm zoomed out, bro, come on."*

Taken on two grounds: his bugs beat my queue, and COOK had already delivered the half
it was waiting on (61 of 61 coarse tiles, round-tripping exactly), with their own row
saying plainly *"the renderer is LIFE + CITY's and city mode still draws filled
rectangles."*

## I OPENED BY MEASURING, AND THEN I MEASURED WRONG

This lane has been burned three times by counting the SOURCE instead of the draws, so
I instrumented the real 2d context and rendered at four tile sizes:

    TW=18  drawImage 0   fill 9314        TW=44  drawImage 0   fill 2171
    TW=28  drawImage 0   fill 4995        TW=78  drawImage 0   fill  765

**"Zero images at every zoom."** I built a bank injector, an iso-blit renderer and a
per-zoom cache on that number. It was wrong.

**I set `TW` directly instead of driving the game's own zoom.** `TW` is recomputed by
`setZoomAt()` every frame, so assigning it produces one frame against a camera state
the game never actually has — and then the loop repaints over it. Two screenshots
labelled TW=18 and TW=28 came back **pixel-identical** and I nearly read them as a
before/after. Driving the real control:

    TW   3.7   drawImage 9050   fill 1634        TW  25.3   drawImage 2244
    TW  14.5   drawImage 4539   fill  824        TW  46.8   drawImage  782

**The city was already drawing nine thousand images.** It is hero art, not slabs.

Same shape as the three before it: **I asked something adjacent to the real thing, got
a clean answer, and believed it.** A forced `TW` is not the zoom, exactly as a filename
is not a registry.

## AND THE FALLTHROUGH IS 1.7 PERCENT

Wrapping `cityCoarse` itself and counting how often the renderer even *reaches* the
slab switch:

| TW | reached | of ~cells | which kinds |
|---|---|---|---|
| 3.7 | **152** | ~9,200 | airbase 108, airport 80, estate 58, gated 40, sphere 8, strat/springs/highroller/luxor 2 ea, sign 2 |
| 14.5 | 107 | | same shape |
| 25.3 | **14** | | airport 8, sphere 4, strat 1, highroller 1 |
| 36.0 | 10 | | |
| 46.8 | **5** | | sphere 4, highroller 1 |

With the bank wired in, **50 of those 152 became real art at the widest zoom and zero
changed at TW≥25** — because the kinds that still fall through are mostly `airbase` and
`airport`, and COOK's bank has no tile for either.

## SO I TOOK IT BACK OUT

Injecting **73 KB of bank into a 4.2 MB slice to change 1.7% of one zoom level is not
the row**, and BUILD SIZE is already over budget on main (82.83 MB against 78.85). A
deliverable that is correct and changes almost nothing is the mirror of round 6's
lesson, and it gets the same answer.

The tool stays, finished, with the correction as the first thing in its docstring. The
day COOK's bank grows `airbase`, `airport` and the landmarks, one command wires it in.

**And it cost me a real bug on the way:** the first injector computed its end offset by
arithmetic over `return true;\n}` and landed one brace short, putting a **stray `}`**
into the file. That does not fail loudly — it kills the parse for the whole 4.2 MB
inline script, so `renderCity` itself stopped existing and my next probe reported
"renderCity is not defined". The block is fenced at **both** ends now. *A marker cannot
be off by one; an offset can.*

## WHAT IS ACTUALLY LEFT OF THE ROW

The row has two halves. The first — "draws the coarse tiles instead of filled
rectangles" — is **1.7% of cells and shrinking**, done by other lanes' hero art while
this row sat open.

The second half is live: *"the diagram (the skeleton, the plots, protected, the edge
lines) becomes a LAYER a builder can turn on, off by default."* Grouping every stroke
by its style at the zoom he photographed:

    532  #c8a558 w1.5      121  #56db00 w1.5      89  #db1900 w1.5
    184  #4a8ddb w1.5      108  #db9400 w1.5      68  #db6403 w1.5

**But that chart is not the diagram — it is the faction territory overlay**, deliberate
and recent, with each faction's own hue lifted in value and saturation so a one-pixel
line survives on a night overmap. It belongs to this lane's *other* row,
`[owner shown] THE-CITY-SHOWS-WHO-OWNS-IT`, which is OPEN and explicitly wants it.

Turning it off by default would be deleting a feature another row is asking for. That
is a fork I do not get to settle by myself, and it is named in the handoff rather than
decided here.

## THE STANDING NOTE

**A PREMISE HANDED DOWN IS STILL A PREMISE, AND FIVE DAYS IS LONG ENOUGH FOR IT TO
DIE.** The row, the coordinator's correction to it, and COOK's round-2 note all agreed
the city drew filled rectangles — three independent statements, all counting source,
none counting draws, and the youngest of them two rounds old. The fleet was unanimous
and stale.

Rule 12 says a dependency on a line is a premise, not a gate. **The same is true of the
row's own description of the bug.** Measure the complaint before you build the fix, on
the real surface, through the real control.

---

    city file           unchanged (injection reverted, byte-identical to main)
    tools/bohemia_city_tiles_patch.py   built, correct, NOT wired in, and it says why
    row                 stays OPEN, with the 1.7% on it
