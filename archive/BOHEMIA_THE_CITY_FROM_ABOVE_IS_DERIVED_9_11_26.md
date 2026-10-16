# THE ZOOMED-OUT CITY HAS NO ART IN IT AT ALL, AND NOW IT IS DERIVED FROM THE STREET
COOK (16, the Production Artist), VAMILY [city from above], 9/11/26. Round 1.

## HIS WORDS
> **"why does the city keep looking like this when I'm zoomed out, bro, come on."**
> — Paolo 9/8, from his own frame, `records/target/PAOLO_WHY_DOES_THE_CITY_LOOK_LIKE_THIS_9_8_26.png`

The row is top of this lane, above the car, so `[car recook]` and `[fortress buildings]`
both paused.

## AND THE ROW'S OWN NUMBER IS COUNTING THE WRONG FILE, WHICH MAKES IT BETTER NOT WORSE
The 9/8 ruling says the view is *"19 filled rectangles against 9 image draws"*. That is the
**alpha's whole file**, and the alpha is a shell — its top bar does not even contain the
string `CITY MODE`. The screen in his photograph is drawn by `renderCity()` in
`slices/BOHEMIA_CITY_WORLD.html`, and measured there:

    73 fillRect      8 strokeRect      17 stroke()      AND ZERO drawImage

**There is not one image in the zoomed-out city.** Ninety-eight vector operations: coloured
slabs with green and yellow edge lines. It is the builder's diagram, exactly as the ruling
says, and the honest number is worse than the one on the row.

## WHAT THIS ROUND IS, AND WHAT IT DELIBERATELY IS NOT
The 9/8 ruling splits the job three ways and this is one of them:
- **COOK (this)** — the coarse tiles.
- **DIRECTION `[city look]`** — the 7/1 lock written as a card.
- **LIFE + CITY `[tiles not slabs]`** — the renderer draws them, the diagram becomes a layer.

So this produces **tiles** and touches no renderer. Nothing on his screen changes until
LIFE + CITY draws them, and saying so is the point rather than a hedge.

## DERIVED, NEVER DRAWN, WHICH IS THE ENTIRE DESIGN
The ruling requires the coarse tiles come from the fine ones *"so they cannot drift (NOTHING
IS BAKED ONCE)"*. That turned out to be literally available: **every district generator runs
headlessly** and hands back its own 128x128 grid of legend codes together with its own
palette. So a coarse tile is not a new picture of a district — it *is* that district's real
art, reduced.

    56 of the valley's 61 district kinds derive cleanly, each with its own palette
    128 fine -> 32 coarse, a clean 4x integer reduction
    a coarse tile carries a median of 10 colours, every one off that district's own ramp

Nobody hand-draws a second city, and a district that changes at street scale changes up here
in the same commit. That is the anti-drift clause satisfied by construction rather than by
discipline.

**Why 32.** One cell in city mode is an isometric diamond, `TW=18 x TH=9` at zoom 1, and his
frame is around five times that. A 32 px square source covers the whole band without
inventing detail it does not have, and 128/32 is an integer so no cell is half-counted.

## DOMINANT CODE, NOT AVERAGE COLOUR, AND THAT IS HIS LOCK AND NOT MY TASTE
Averaging the colours in a 4x4 block is what a photograph does. A red roof beside a grey road
averages to a brown nothing, and the palette stops being the palette — which is the exact
mistake the car round had to undo. Taking the most common **code** in each block keeps every
pixel a real colour out of that district's own ramp, and that is *"SAME PIXEL STYLE"* in one
operation.

Both were rendered side by side and looked at rather than argued about. Dominant is crisper
and keeps blocks distinct; average smears structure into bands, worst on farm and downtown.

## THE REFERENCE CHECK (9/4 standing duty), AND ONE ARM OF IT IS MEASURED
Against this lane's own sheet, `reference/library/city-builder/INDEX.md`:

- **CB-04** — *the road grid is the first thing legible at every zoom.* **This is the one that
  could have killed the method**, because a street one fine-cell wide loses the vote inside a
  4x4 block and vanishes. So it was measured rather than admired:

      across the 42 districts: road cells fine 18.6% -> coarse 20.3%
      worst single district loses 1.0 percentage point (boneyard)

  Roads survive and very slightly gain, because a road is a wide contiguous run that wins its
  blocks. The grid is legible at the far zoom.
- **CB-01** — *density reads from ROOF PATTERN alone.* Held: suburb is many small blocks,
  downtown is big towers, industrial is long roofs, trailer is small rows — distinguishable
  at a glance in the render.
- **CB-05** — *zoomed out a city becomes colour masses by function, and a district's identity
  must survive the switch.* Held: all eight sampled kinds are identifiable without a label.

## AND IT WAS LOOKED AT AT HIS OWN ZOOM, NOT ONLY AS THUMBNAILS
A patch of valley was laid out isometrically at `TW=90 TH=45` — the zoom in his frame — out
of a realistic district mix. It reads as an aerial city: rows of houses with streets between
them, red-roofed blocks, long warehouse roofs, parking, towers. Against the flat slabs and
green outlines in his screenshot it is not an improvement, it is a different thing.

## AND A BANK NOBODY CAN INLINE IS A BANK NOBODY USES

The first emit was **786 KB** — 56 kinds of 1,024 repeated hex strings. A tile carries a
median of 10 colours and at most 18, so one character indexes it. Packed as a palette plus an
index string it is **68 KB**, decodes in two lines
(`pal[ALPH.indexOf(idx[y*32+x])]`), and all **56 kinds round-trip to exactly the derivation,
0 differing**. Handing the next lane something they cannot inline would have been handing them
the work back.

## A GATE WENT RED AND IT IS NOT THIS BANK

`build_size_gate.js` fails on *"REACHABLE FROM NOTHING STAYS WITHIN ITS BUDGET (80.75 MB <=
78.85 MB)… this line may only ever come down"*. That is a good gate and its rule is right, so
it got checked rather than argued with: stashing every change in this round and re-running
gives **the identical 80.75 MB and the identical failure**. It is red on main already, and this
bank does not move the number — `banks/` is not in the set it counts.

**[FOR THE PLUMBER]** `build_size_gate.js`'s unreachable-bytes ratchet is over budget on
`origin/main` (80.75 against 78.85) and therefore red for the whole fleet, which is how a
ratchet gets switched off by the next session that meets it.

## WHAT IS NOT DONE
**[FOR LIFE + CITY]** The renderer. `renderCity()` still draws 98 vector operations and no
images; the bank is `banks/BOHEMIA_CITY_FROM_ABOVE_9_11_26.txt`, keyed by district kind, 32x32
of hex per kind, ready to blit into the isometric diamond. The diagram becoming a toggleable
layer is the same row.

**[FOR DIRECTION]** `[city look]` is still open and this cooked without the card, because the
row said to and the ruling wrote the brief out in full. If the card lands and disagrees, the
tiles are regenerated by one command — that is what deriving them buys.

**AND A FILENAME IS NOT A REGISTRY, WHICH THIS LANE HAD ALREADY LOST A ROUND TO.** The first
pass matched district kinds against `engine/bohemia_<kind>.js` and got **42**, concluding the
other nineteen had no art. That is the same mistake the fortress row made a week ago, so it
got checked rather than written down: `DISTGEN` names the **module** each kind builds through,
and nineteen of them share one. `gated` and `estate` build through the suburb generator, and
eleven utility kinds are **sub-objects** on one file — `U.arsenal.generate`, `U.radio.generate`.
Following the `mod` field and then looking *inside* the module took it from 42 to **56**.

**THE FIVE THAT REMAIN, NAMED RATHER THAN ROUNDED AWAY:** `convention`, `dam`, `fort`,
`minigp`, `prison`. All five carry `mod: KIT` — they build through the district *kit*, which is
a factory with no `generate` of its own, so they are authored as kit entries rather than as
modules. A different mechanism, and a bounded one. `fort` is on that list, which the paused
`[fortress buildings]` row cares about.
