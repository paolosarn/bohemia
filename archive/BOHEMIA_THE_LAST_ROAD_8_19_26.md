# THE LAST ROAD (8/19/26, WORLD lane)

**Every road in the valley is now drawn by its own module. The interchange was the last one,
and it was left behind on a measurement rather than an oversight.**

| | before | after |
|---|---|---|
| arterial | 8.6% drawn | **100%** |
| strip | 20.7% | **100%** |
| freeway | 17.9% | **85.4%** |
| rail | 2.3% | **82.0%** |
| **interchange** | **20.1%** | **69.9%** |

Zero page errors.

---

## WHY IT WAS LEFT, AND WHAT IT WAS MISSING

Yesterday I routed every road through its module except this one, and wrote the reason into
the code: routed with only its **bounds**, the interchange came back **worse than the
four-number table it replaced** — 8,843 tiles of bare fallback and **three tiles of road**
against 20% drawn.

**A stack is not built from its outline. It is built from its approaches.** Which columns
have a highway arriving from the north or south, and which rows have one arriving from east
or west — that is what says where each ramp starts and which arm goes over. The world model
has computed exactly that since 7/26 (`clusterApproach`); the walked surface never had to,
because it never carried the module.

Fifteen lines ported, and the interchange went **20.1% → 69.9% with ten distinct surfaces** —
asphalt, embankment, ramp deck, shoulder, barrier.

**FREEWAY FAMILY ONLY, NOT EVERY ROAD**, and the world model's own comment says why: the mile
arterials run right up against the interchange block on all four sides, so asking *"is this a
road"* answers yes for every column and every row, the corridors swallow the block, and eight
ramps render as nothing. An interchange is where two **highways** cross; a surface street that
happens to touch it is a neighbour, not an approach.

---

## THE RATCHET DID ITS JOB

`walked_surface_gate.js` carries a `NOT_ROUTED_DEBT` list that **ratchets both ways** — a type
that gets fixed and stays on the list fails too. The interchange was its only entry. **That
list is now empty**, and it emptied because the gate would have gone red otherwise, not
because anyone remembered.

---

## WHAT IS LEFT

**Nine cells, and every one is Paolo's:** `sphere` (4), `luxor`, `strat`, `sign` (the Welcome
sign), `highroller`, `springs`. Named, real Las Vegas landmarks. What each one IS in Bohemia
is a ruling, not geometry.

`roadcell_gate` still has its one long-standing failure — *"yellow appears only at the turn
bay where the median opens"* — with the same count it has had for days. Not caused here, not
touched here.
