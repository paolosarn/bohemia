# THE GROUND LIBRARY IS AN OVERLAY SYSTEM AND NOBODY BUILT THE LAYER

8/7/26 · ART LANE · a measurement, not a build

## WHY THIS EXISTS

I told him twice, out loud and in records, that **"there is no seamless art in this
repo for ballast, field soil or desert floor"** and handed him a buy-or-cook
decision. I had opened two banks. The 8/6 consumption audit then found
`BOHEMIA_TILE_REPO.txt` sitting dark with 875 images and its own counts reading
**dirt 104, gravel 71, grass 103** — the exact things I said did not exist.

So this turn was spent doing the only honest thing available: **looking**, not
building. Ground has had four failed attempts and STOP PRODUCING says stop, so
nothing here was wired. This is what the pixels say.

## WHAT IS ACTUALLY IN THERE

`BOHEMIA_TILE_REPO.txt` — 875 images, never drawn, categorised by the bank itself:

| kind | tiles | declared type | mean transparency | fully opaque |
|---|---:|---|---:|---:|
| concrete | 293 | ground | 20.1% | **0** |
| street | 47 | ground | 27.1% | **0** |
| grass | 103 | ground | 29.4% | **0** |
| dirt | 104 | ground | 32.1% | **0** |
| burnt | 66 | ground | 43.1% | **0** |
| gravel | 71 | ground | 75.5% | **0** |
| metal | 68 | ground | 19.1% | **0** |

**NOT ONE FULLY OPAQUE TILE IN ANY CATEGORY.** Tiled four across, the dirt reads
as square patches with black gaps and soft grassy edges — exactly what it is.

`BOHEMIA_GROUND_VARIANT_BANK_7_10_26.txt` — 1,211 images, never drawn, and its own
note says why: *"Variant factory at scale ... **UNJUDGED** — banked for a future
mega-judging session per Continuous Cooking rule. Nothing here is canon until
Paolo sweeps it."* That one is dark **on purpose and correctly**. It is not a miss.

## THE FINDING, AND IT IS A MECHANISM GAP NOT AN ART GAP

Every ground tile he owns is an **OVERLAY** — a patch with a feathered,
transparent border, designed to be scattered ON a base surface. The game has no
base-plus-scatter ground layer. It draws one tile per cell and stops.

That is why five separate attempts to make a farm look like a farm failed. Four of
them I blamed on picking the wrong tile. **The tile was never the problem. The
LAYER does not exist.**

It also explains the concrete. Concrete is 20% transparent and draws fine today,
because at that density the feathering just blends into its neighbours. Dirt at
32% shows gaps. Gravel at 75% is pure scatter with nothing behind it. The library
is internally consistent — it always assumed something underneath.

## WHERE I WAS WRONG, PRECISELY

1. **"There is no seamless dirt in this repo."** Wrong as stated. There are 104
   dirt and 71 gravel tiles at exactly 44×44. I said it after opening two banks.
2. **"So it is a buy-or-cook decision."** Wrong, and worse, because it put a
   purchase on his plate that he does not need to make. He owns the art.
3. What was right, by accident: none of it is *base* ground. I got the conclusion
   from the wrong reasoning, twice, and only found out by finally looking.

## WHAT THIS CHANGES FOR HIM

The old question was *buy a terrain set, cook one, or accept it.* **All three are
now the wrong question.** The real one is much smaller:

> **Do we build a two-layer ground — a base fill under a scatter overlay?**

That is a mechanism, it is the thing 875 dark images were drawn for, and it needs
no purchase and no new art. It also unlocks the 1,211 variants the moment he
sweeps them.

**[PENDING, Paolo's call]** and this time the options are honest:
- **A** build the two-layer ground (base + scatter). No new art. Unlocks 875 images.
- **B** leave it — every district keeps reading as a lot.
- **C** sweep `GROUND_VARIANT_BANK` first (1,211 tiles, explicitly waiting on a
  judging session) so the scatter has judged variety when the layer lands.

## WHAT I DID NOT DO

I did not wire any of it. Ground is four failed attempts deep and STOP PRODUCING
says a fifth is not a fix, it is a symptom. The finding is the deliverable.
