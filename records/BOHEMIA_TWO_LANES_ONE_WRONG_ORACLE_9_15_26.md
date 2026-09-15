# TWO LANES, ONE WRONG ORACLE (9/15/26, LIFE + CITY lane)
## VAMILY row `[no pool cells]` — the premise is false, and I reached it too

**Nothing was missing. 903 cells of 903 on screen draw approved bank art, zero
procedural.** The row asked me to give 138 bare cells a pool. They already have one.

---

## THE ROW, AND WHY IT LOOKED SO SOLID

> COOK `[streets fixed]` r2: *"yard 72%, street 8%, side 3%, and 138 cells, SIXTEEN
> PERCENT, flat colour with no pool and no tile art at all. Name the kinds those cells
> are, give each a pool from the approved bank."*

My own first probe agreed: **20.2%, 182 of 903 cells with no pool.** Two lanes, two
instruments, one number. It read like corroboration.

**It was the same mistake twice.** We were both reading `c.gArtPool` and taking its
absence for "no art".

## THE ROADWAY DOES NOT USE `gArtPool`

There is a second, older route to a tile. `texFor(colour, isStruct, variant)` looks the
cell's **colour** up in `SA_MAP`, which already maps every roadway colour to an approved
pool:

    #8a8a86 #7a7a76 #5e5e5a #4a4a48 #d8d4c4 -> street      #c8c4b8 -> side
    #e8e0d0 -> cross_ns    #e6ded2 -> cross_ew            #a89a80 -> shoulder
    #e4decb -> pocket_v    #e2dcc9 -> pocket_h

The ground pass writes a colour and returns; the draw resolves it. So a roadway cell is
fully textured while carrying no `gArtPool` at all — and the field we both read is blind
to it.

Counted on the real screen, by route:

    pool:hyard       618      (the yard COOK just fixed)
    colour:street    168      <- the cells the row called bare
    pool:side         52
    pool:street       51
    face:perimeter    14      <- the 14 solids my probe also called bare
    -------------------------
    903 of 903 bank art, 0 procedural

## AND THE FLAT PAINT THAT IS REAL IS NOT THE GROUND

This is what made the wrong answer feel confirmed: **19.8% of painted pixels genuinely do
come from `fillRect`.** I had measured that myself on 9/13 and quoted it back as
agreement. Grouped by style and size:

    #140a06  44x44   x2139   4,141,104 px
    #c2401c  44x44   x2139   4,141,104 px
    #e8702c  4x44 / 44x4     the edges
    #20303e  378x815 x3      the sky behind the valley

That pair is `dangerMark()` — the danger overlay, **working exactly as designed**. It
pulls the ground down, then casts an ember tone at 0.22 alpha, and its own comment says
*"the grain of the material still shows through."* Plus one full-screen sky rect.

**A state painted over art at low alpha is not a missing tile.** Two different questions —
"how many pixels are flat?" and "how many cells lack art?" — and I let the first answer
stand in for the second.

## MY OWN GATE FAILED ITS FIRST MUTATION RUN

I wrote the gate, it said 903 of 903, and I ran the mutations. **Both passed.**

`texFor` **always returns something**: when the pool lookup misses it generates a texture
with `TEXKIND` and caches it. So *"texFor returned a tile"* is trivially true and measures
nothing. I had written the exact gate this lane keeps filing notes about, and only the
mutation run caught it.

`saTex()` returns **null** when the approved bank has no tile. Switched to that, and the
mutations bite:

| mutation | result |
|---|---|
| point `#8a8a86` at a pool that does not exist | **735 of 903**, and it names `ground #8a8a86 168` |
| empty the `street` pool itself | **684 of 903**, names two kinds |

Mutation 1 reproduces the row's exact claim — 168 bare road cells. **If the hole had been
real, this gate would print it.**

## THE STANDING NOTE

**TWO LANES AGREEING IS NOT CORROBORATION WHEN THEY ASKED THE SAME QUESTION.** COOK and I
got 16% and 20% independently, and the closeness of the two numbers is exactly what made
neither of us check. We had not confirmed each other; we had made the same mistake with
the same field, and a third measurement of `gArtPool` would have "confirmed" it again.

The thing that broke it was asking a **different** question — not "does the cell carry a
pool?" but "does the renderer end up with a bank tile?" *Independent* means a different
oracle, not a different lane.

And the smaller one, paid for again: **an instrument that cannot return "no" is not an
instrument.** `texFor` can only ever say yes.

---

    row premise      138 cells / 16% bare   ->   0 bare, 903 of 903 bank art
    the flat 19.8%   named: dangerMark() over the art, plus the sky
    gate             no_cell_goes_untextured_gate.js 7/0, registered, mutation-tested twice
    slices/          UNTOUCHED -- there was nothing to fix
    demo             NOT re-cut (rule 14a)
