# COOK — [city from above] ROUND 2: THE LAST FIVE WERE NOT A DIFFERENT MECHANISM
9/12/26 · lane 16 COOK · job [city from above] · **56 of 61 → 61 of 61**

## WHAT I WROTE DOWN LAST ROUND, AND WHY IT WAS WRONG

> "STILL OPEN: convention, dam, fort, minigp and prison all carry `mod: KIT` and are
> authored as kit ENTRIES, a different mechanism; named rather than rounded away."

Naming it instead of rounding it away was right. **Calling it a different mechanism was not.**

All five register a spec with `generate(seed, opts)` AND `palette`, exactly like the other 56.
They go through `engine/bohemia_landmarks.js` into the kit's own **registry**, which is
reached by `KIT.get(name)` — and is *not* a property on the module object. My collector did
`M[k]`, got `undefined`, and I concluded the mechanism was different rather than asking the
registry.

Measured before changing a line, with the probe printing what it could see first:

    kit module loaded : true
    kit has get()     : true
    BEFORE requiring landmarks, KIT.get('convention'): false
    landmarks loaded  : true
      convention   spec:true  generate:true  palette:true
      dam / fort / minigp / prison   the same

Two lines: require the registrar, then ask `M.get(k)` before giving up. **56 → 61.**

## A FILENAME IS NOT A REGISTRY, FOR THE THIRD TIME

This lane has now lost ground to the same sentence three separate ways:

1. **A filename is not a registry** (the district round). Matching kinds against
   `engine/bohemia_<kind>.js` gave 42 and claimed nineteen kinds had no art. `DISTGEN`'s
   `mod` field gave 56.
2. **A module property is not a registry** (this round). `M['convention']` was undefined;
   `KIT.get('convention')` was the answer all along.
3. **And a gate's filename match is not a registry either** (found this round, routed):
   `reference_check_gate` decides what is a cook with `'cook' in t.lower()`.

Every time, the shape is identical: I asked something *adjacent* to the registry, got a clean
negative, and believed it. **A clean negative from the wrong oracle looks exactly like a fact.**

## THE ARM THAT COULD HAVE KILLED THE METHOD, MEASURED AGAIN

CB-04 says the road grid is the first thing legible at every zoom, and a street one cell wide
loses the vote inside a 4×4 dominant-code block. Round 1 measured all kinds: roads went fine
18.6% → coarse 20.3%, worst district losing 1.0 point. Round 2, the five new ones:

    convention  +0.9      dam  +0.1      fort  +0.2      prison  +2.5      minigp  -0.1

Worst loss across the five is a tenth of a point. Roads are wide runs and they win their
blocks.

## AND THE NUMBER CORRECTED THE EYE, WHICH IS THE OPPOSITE OF LAST ROUND

I rendered the five fine-and-coarse and looked at them. `fort` read as mostly empty tan, and
I nearly wrote down an emptiness defect. Measured instead:

    kind         codes used   biggest single code
    convention      15          17.9%  entry plaza
    dam             15          25.7%  reservoir
    fort            15          25.5%  dust yard
    minigp          15          27.7%  circuit
    prison          15          17.1%  rock lag

All five use the full 15-code legend, and fort is mid-pack. **A fort IS a walled yard and a
circuit IS mostly track.** The eye had found the art doing its job. Last round the picture
caught what the numbers could not; this round the numbers caught what the picture could not.
The rule is measure *and* look, not one of them.

## THE BANK

61 kinds, 32×32 each, median 10 colours a tile, every colour off that district's own ramp.
**All 61 round-trip exactly** (1024 indices each, no index past its palette). The five new:
convention 12, dam 14, fort 10, minigp 13, prison 13.

Nothing here is painted. Every coarse tile is that district's own art reduced 4×, so a
district that changes at street scale changes up here in the same commit.

## GATES

    reference_check  6/0     banklaw        8/0  (7/1 on main — see below)
    district_kit    24/0     pixel_craft   30/0
    art_45          16/0     derived_fresh  9/0
    reusefirst   202/5  identical to main     banks_used  24/2  identical to main

`banklaw_gate` reads 7/1 on main and 8/0 here, and the difference is **not my bank**. The gate
writes `records/BOHEMIA_BANK_LAW_INDEX.md` and re-indexing picked up three rows from
`BOHEMIA_EYES_SEEN_9_11_26.json` — EYES' file, landed on main without the index regenerated.
Committed because it is machine-written, costs nothing, and the alternative is every lane
tripping it.

## WHAT IS STILL NOT DONE, SAID PLAINLY

**Nothing on Paolo's screen changed this round.** The tiles exist for all 61 kinds; the
renderer is LIFE + CITY's row `[tiles not slabs]`, and city mode still draws filled
rectangles. No alpha change, so no build stamp and no demo re-cut — saying that rather than
stamping a build that carries nothing.

**The row stays CLAIMED.** Rule 7: a row is not shipped until it is in the walked surface and
the demo. The art half is complete at 61 of 61; the drawing half is not mine to write.
