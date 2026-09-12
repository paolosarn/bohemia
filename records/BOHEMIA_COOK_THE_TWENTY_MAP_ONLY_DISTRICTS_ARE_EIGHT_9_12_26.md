# COOK — "ABOUT 20 MAP-ONLY DISTRICTS" IS EIGHT, AND SEVEN ARE VEGAS LANDMARKS
9/12/26 · lane 16 COOK · rows `[fortress buildings]` / `[missing districts]`

## THE NUMBER A LAW WAS BUILT ON

My section's STATE line has said *"about 20 map-only districts nobody draws"* since before I
held this lane, and the FACTION TOWNS law (9/4) builds a whole ART row on it:

> **ART:** the buildings a fortress needs that nobody has drawn are the **~20 map-only
> districts** already on ART's queue; the towns ruling is the reason to build them, in tier
> order.

That is the brief for `[fortress buildings]`. Measured this round: **the number is eight, and
not one of them is a fortress building.**

## GETTING THERE MEANT FINDING FOUR REGISTRIES, ONE AT A TIME

    DISTGEN       61 kinds   engine/bohemia_world.js
    SURFACEGEN    10 kinds   the roads and the raw land — "surfaces, never districts:
                             nobody bases a faction on a mountain"
    the KIT        5 kinds   reached by KIT.get(name), and ONLY after a registrar module
                             (bohemia_landmarks.js) has been required
    the overmap   79 names   engine/bohemia_overmap.js DISTRICT

My first pass asked DISTGEN and the KIT and got **18 missing** — a list headed by `mountain`,
`desert`, `water`, `freeway`, `arterial`. I was one keystroke from writing down that the
valley cannot draw its own mountains. `SURFACEGEN` sits forty lines below `DISTGEN` in the
same file and holds exactly those, with a comment saying so.

**This is the fourth time this lane has believed a clean negative from the wrong oracle**
(a filename, a module property, a gate's filename match, and now a second registry in the same
file). The difference this round is that I caught it myself, before it reached a record.

## THE EIGHT, AND WHAT THEY ACTUALLY ARE

Counted as **cells on a real 96×96 map**, not as names, because a name nothing places costs a
player nothing:

    sphere        4 cells      the Sphere
    highroller    1 cell       the High Roller wheel
    sign          1 cell       the Welcome to Las Vegas sign
    strat         1 cell       the Stratosphere
    springs       1 cell       Springs Preserve
    luxor         1 cell       the Luxor
    robofactory   1 cell
    ----------------------------------------------------------------
    beltway       0 cells      NEVER PLACED — a dead enum entry

`beltway` is the one worth naming separately: it is known to the graphics engine
(`case 'freeway': case 'beltway':`), it is in the district kit's `ROADSET`, and
`bohemia_arterial.js` discusses it by name — and a real generated map gives it **zero cells**.
Known everywhere, placed nowhere. It costs nothing and should not be counted as debt.

Confirmed against the world's own API rather than my reading: all seven landmarks return
`isAutoDistrict false`, `isSurfaceCell false`, `districtZone null`.

## AND THE PLACEMENT IS GOOD CANON NOBODY DREW

    springs   40,23      strat   53,28
    sphere    56,42 (2×2)
    highroller 55,46     luxor   53,61     sign   55,65
    robofactory 73,73

Stratosphere at the north end, Sphere and High Roller in the middle, Luxor and the Welcome
sign at the south, Springs Preserve out west. That is the real geography of Las Vegas, laid
out correctly, and a player walking to any of it finds bare ground.

## WHAT THE ROW'S PREMISE TURNS OUT TO BE

`[fortress buildings]` asks for ~20 undrawn districts to be built "in tier order" so fortresses
have their deep dry stores, kitchens and plant. **There is no such pile.** Every district a
faction town is made of already generates — all 61, verified last round when this lane took
the coarse-tile work from 56 to 61. What is undrawn is seven singular Las Vegas landmarks,
which are HEROES, not supporting buildings, and no fortress needs one.
→ **[FOR THE COORDINATOR]** the STATE line's "about 20" is wrong by a factor of 2.5 and the
towns law's ART clause rests on it. Lanes change status words only, so I have not edited the
STATE line myself.

## THE GATE, SO THIS CANNOT ROT AGAIN

`gates/map_names_it_gate.js`, registered in the suite as **MAP NAMES IT**, 9/0, 0.2s.

One claim: *if the map names it, something must be able to draw it.* It asks **all four**
registries, by RUNNING them, never by reading a filename. It counts **cells, not names**. And
it requires the KIT's registrar before asking the KIT, because not doing that returns an empty
answer indistinguishable from "these do not exist" — which is the exact mistake the gate is
about, and is one of the arms.

Ratcheted at 7 names over 10 cells, because eight undrawn names is a debt that predates the
gate and a hard zero on day one is a fleet-wide red on work nobody here did. It may only
shrink, and **a newly placed undrawable name is red whatever the totals say.**

Mutation-tested three ways, all red, restore green:
a new undrawable name appears · the undrawable cell count rises · the KIT registrar is not
required (caught, 0 types).

## WHAT I DID NOT BUILD, AND THE TWO THINGS THAT MAKE THE NEXT ROUND FAST

I did not cook a landmark this round, and the reason is worth writing down rather than
discovering twice:

1. **The Sphere is the worst first candidate, not the best.** It is a 2×2 blob, and `spec()`
   in `bohemia_landmarks.js` plans a SINGLE cell. A multi-cell landmark needs the
   `clusterBoundsOf` treatment the airfields already use ("a runway is three kilometres long
   and a cell is 96 metres"). Different mechanism, not a bigger version of the same one.
2. **The other six are single-cell and follow the `fort` spec pattern exactly** — palette,
   legend, notes, and a build function of `a.rect` / `a.ring` / `a.set` / `a.scatter`. That
   part is squarely this lane's. But registering one also needs a `DISTGEN` row in
   `engine/bohemia_world.js`, which is WORLD's file, and ONE SYSTEM, ONE SESSION says that is
   a boundary to check before crossing, not after.

Best first cook: **the Welcome to Las Vegas sign** — one cell, the most recognisable object in
the city, and geometrically honest at 96 m (the Strip lanes, the median, the sign, the little
parking loop).
