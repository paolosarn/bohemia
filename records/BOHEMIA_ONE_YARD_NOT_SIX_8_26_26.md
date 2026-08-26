# ONE YARD, NOT SIX

**8/26/26 — WORLD lane. The valley's railyard is a 3x2 blob and every one of its six cells was
building a COMPLETE classification yard: its own engine shed, its own office, its own container
stack, its own gantry crane, its own perimeter fence. **Six engine sheds and six gantry cranes
in a block 288 metres across.** It is one yard now. And the walked surface did not get it until
I went and looked, which is the second time in two days.**

---

## A YARD TAKES BOUNDS. A CHANNEL TAKES NEIGHBOURS.

Yesterday's wash was a **line**, and a line needs to know which sides it arrives and leaves on —
its four neighbours — because it turns corners and a bounding box cannot express that.

A classification yard is an **area**: one shed at the west end, one container stack at the east,
and a fan of tracks running the whole length between them. That is the solar farm's shape, so
it gets the solar farm's treatment — laid out once in valley tiles against the blob's bounds,
each cell keeping only its own window.

Naming the two as different kinds of problem is the reusable part. The mechanism for both now
exists side by side in the world model and on the page.

## TWO THINGS THAT ONLY SHOW UP ONCE IT SPANS CELLS

**The trains had to stop being random per cell.** Every cell has its own seed, so a boxcar
decided with the cell's own `r()` exists in one cell and not in the neighbour that shares the
same rail — a wagon cut in half at every boundary, on every rail, forever. The gaps and the
locomotives now come from a hash of the **valley** coordinate and the **blob**, so the same rail
carries the same train however many cells it crosses.

**Drive access failed for four of the six cells.** One service lane along the yard's south front
is what a single-cell yard has; across a 3x2 blob that leaves the entire top row with no
drivable surface at all, and `driveConnected` said so for five street placements. A yard this
size has a **perimeter access road inside the fence** — that is how they are actually built, it
is what the gate is really asking about, and it sits in the desert margin between the fence and
the ballast where nothing else wants to be.

```
before   worst void 0.091   min drive reach —  (4 of 6 cells unreachable)
after    worst void 0.030   min drive reach 0.974   min content 22.3%
```

## WHAT IT IS NOW

```
THE YARD: 6 cells, 1 engine shed, 1 gantry, 4 east-west seams, 0 broken
RAILYARD GATE: 18 passed, 0 failed
```

Mutation-tested by making the cluster path unreachable — it reproduces the defect exactly and
the gate names all three symptoms:

```
6 engine sheds, 6 gantries, 6 depot footprints  ->  15 passed, 3 failed
```

**The lone-cell build is untouched and proved so — 48 of 48 byte-identical** across every street
placement and eight seeds.

### the seam check is east-west ONLY, and that is deliberate

The rails run east-west, so two cells side by side share the same rail rows and their touching
**columns** must agree. Two cells stacked north-south share no rail at all: adjacent **rows**
there legitimately differ, one carrying a rail and the other ballast. A check that demanded they
match would be measuring nothing and failing — which is exactly what my first scratch probe did,
reporting three "broken" seams that were the yard working correctly.

Worth saying plainly: on this district the seam check is **not** the discriminator. Under
mutation it reads 0 broken either way, because a per-cell yard puts its own fence on its own
edge and fence meets fence. **The shed and gantry counts are what move.** A number that does not
move under mutation is not evidence, and it does not go in the gate as though it were.

## AND THE PAGE DID NOT HAVE IT — AGAIN

`RAILYARD GATE 18/0`. `WORLD MODEL 29/0`. `TILESPEC 310/0`. Mutation-tested. And the page a
player loads still drew **six engine sheds**.

Yesterday it was `world.js` not being on the page. Today it is one layer down: **the walked
surface carries its own INLINED COPY of every engine module**, ninety-five of them, and that
copy was the old railyard. One tool resyncs it and nothing forces anybody to run it.

```
python3 tools/bohemia_city_module_resync.py
  CITY MODULE RESYNC: 95 embedded, 94 already fresh
  RESYNCED: engine/bohemia_railyard.js
```

```
on the page, before   6 engine sheds, 6 gantry cranes, in 6 cells
on the page, after    1 engine shed,  1 gantry crane
mutation              stop the page treating it as a cluster -> 6 and 6 again
```

So `walked_surface_gate` — the one gate here that opens the real alpha and asks THE PAGE — now
carries both questions:

```
the railyard: 6 cells, 1 engine sheds, 1 gantry cranes (one of each per cell was the bug)
the wash: 60 cells, 21 ends, 21 tunnel mouths (one per cell was the bug)
WALKED SURFACE GATE: 13 passed, 0 failed
```

**Two days, two district fixes, two times the model was right and the game was not.** The
failure mode is not going away on its own: engine module, world model, page dispatch and page
module copy are four places and only the last one is what he sees. Every district fix from here
ends with a page-level assertion in this gate, not a module gate that cannot see the game.

## WHAT COMES AFTER

Multi-cell blobs left on the canon seed:

```
wash      51 cells   7 runs      DONE (8/25)
railyard   6 cells   1 blob      DONE
farm      93 cells  13 blobs, biggest 9
golf       9 cells   1 blob      nine golf courses in a 3x3
stadium    4 cells   1 blob      FOUR STADIUMS in a 2x2
landfill   4 cells   1 blob
cemetery   4 cells   1 blob
park       3 cells   1 blob
medical    2 cells   1 blob
```

**Stadium is the most absurd per cell** — four stadiums in a 2x2 and a stadium is a singular
landmark — and it is an AREA, so it is the railyard's shape, not the wash's. **Golf next after
that** at nine cells. Both now have the mechanism sitting there waiting.

Still open behind that: the load number is measured with **no compression** while GitHub Pages
gzips on the fly. The three files on the critical path are 6.15 MB raw and 3.54 MB gzipped, so
the real wait is likely nearer 6 s than the 11 s the gate reports, and the gate is measuring a
phone that does not exist.
