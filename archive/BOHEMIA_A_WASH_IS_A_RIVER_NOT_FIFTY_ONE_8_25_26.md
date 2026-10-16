# A WASH IS A RIVER, NOT FIFTY-ONE RIVERS

**8/25/26 — WORLD lane. The canon valley's flood-control channel is 51 cells long. Every one
of them was building a complete, self-contained wash: full concrete banks, invert, trickle,
fence, and its own box-culvert tunnel mouth. Along the east-west run that is **34 parallel
north-south channels standing shoulder to shoulder**, each diving under a street. A comb, not
a river. It is one channel now, every seam is machine-checked, and chasing it turned up a
collision between two lanes that neither of them could see.**

---

## WHAT IT ACTUALLY WAS

The wash cells on the canon seed, found by flood-filling the overmap:

```
7 runs, 51 cells
  y=47  x 56..62, 64..71, 73..80, 86..89     the channel running EAST
  x=89  y 47..53, 55..62, 65..71, 73..75     and then turning SOUTH
```

That is one river with four cross-street gaps in it. What was rendering, per cell:

```
.....rroBBBBBBB======~~=====BBBBBBBBorr....     fence | O&M road | riprap | bank
.....rroBBBBBBB======~~=====BBBBBBBBorr....     invert | trickle | invert
.....rro.........oo@@@@@@o??........orr....     HEADWALL and BOX CULVERT
```

Complete, correct, and repeated 51 times — including 34 times side by side across a run that
goes the other way. **51 tunnel mouths in one river.**

## WHY NEIGHBOURS, NOT BOUNDS

The solar farm got the same treatment yesterday and got it as a bounding **box**: 265 cells,
lay the field out once against the blob's extent, each cell copies its own window. That is
right for a field.

**A channel is a line, and this one turns a corner.** The bounding box of the corner run is
4 x 7 cells; a straight line drawn through that box misses most of the cells that are
actually wash. Extent is the wrong question.

What a linear district needs to know is which sides it arrives and leaves on — which is
exactly the four neighbours:

```
east and west   ->  it runs across
north and south ->  it runs down
east and south  ->  it turns
one only        ->  it ends here, and that is where the tunnel mouth goes
none            ->  a lone cell: unchanged, the build that already shipped
```

Straight runs, corners, tees and orphans all fall out of four booleans with no special cases
and no bounding box at all. `sameNeighbours(m,x,y,kind)` in the world model is six lines and
is now there for every cluster district.

## THE ELBOW, AND WHY IT IS A CLASSIFY AND NOT TWO PAINTS

First version painted the north-south arm and then the east-west arm over it. It looked
right in the map dump and it was wrong: **in the overlap the second arm's BANKS cut across
the first arm's invert**, so a channel that turned a corner ran into a concrete wall halfway
through the turn.

Asking each tile which centre-line it is NEAREST to fixes it by construction — invert
wherever either arm has invert — and leaves a straight run exactly what a single painted
section would have drawn:

```js
for (y…) for (x…) {
  var d = 999;
  if (runNS && y >= nsA && y <= nsB) d = Math.min(d, Math.abs(x - CL));
  if (runEW && x >= ewA && x <= ewB) d = Math.min(d, Math.abs(y - CL));
  var c = bandAt(d); if (c >= 0) g[y][x] = c;
}
```

A second correction fell straight out of looking at the result again: **a turn and an end
stop in different places.** At an END the arm must reach CL+51, because the headwall sits at
CL+40 and the culvert beyond it. At a TURN there is no headwall, so the arm only has to reach
the other arm's bank at CL+42 — and stopping there is what lets the riprap, the O&M road and
the fence wrap the OUTSIDE of the bend instead of being paved over by an invert carrying on
past the corner into open desert.

## AND THE DESERT DRESSING WAS ON THE WRONG SIDES

The canonical build clumps brush and rock down the LEFT and RIGHT strips, because its channel
always runs north-south so the desert is always east and west of it. On an east-west run that
dressing lands **in the middle of the water** and leaves the real margins blank. It now walks
a lattice and clumps into whatever is still bare, which gets it right on any axis and dresses
the ground behind a headwall too.

```
worst void 0.263 (bar 0.35)   worst blank blob 0.221 (bar 0.28)   legend + drive clean
across 8 neighbour shapes x 6 street placements x 3 seeds
```

The dressing also keeps one tile back from every edge. Seven of the forty-four seams broke on
a single tumbleweed or piece of litter landing on the boundary row — not a broken river, but a
seam check that has to forgive dressing cannot see a real break either. Cheaper to keep the
confetti off the edge and leave the check strict.

## WHAT IT IS NOW

```
IN THE MODEL   51 wash cells, 44 seams, 0 broken, tunnel mouths 51 -> 14
ON THE PAGE    60 wash cells, 21 ends,  tunnel mouths 60 -> 21
WASH GATE: 19 passed, 0 failed      WALKED SURFACE GATE: 12 passed, 0 failed
```

(The page counts 60 wash cells to the model's 51: the page's overmap runs post-passes the
model does not. Both are right about their own valley, and the mouth rule holds in both.)

Fourteen is one at each end of each of the seven runs: the channel dives under the cross
street and comes back out the other side, which is how the real Las Vegas system behaves. A
number that means something, instead of one per cell meaning nothing.

Mutation-tested by making the cluster path unreachable. It reproduces the original defect
exactly and the gate names all three symptoms:

```
51 tunnel mouths, 21 of 44 seams broken   ->   16 passed, 3 failed
```

**The lone-cell build is untouched and proved so — 48 of 48 byte-identical** across every
street placement and eight seeds. Canonical-south plus `rotateToStreet` is the right answer
for one cell, and it is art that already shipped; only a cell with a wash NEXT to it takes
the new path, because only then is there a neighbouring channel to line up with.

## THE GATE, AND THE ONE LINE IN IT THAT MATTERS

Everything a district gate normally checks — anatomy, legend, void, drivability — passes on a
single cell in isolation, which is exactly why this defect lived so long. Every one of those
lines was green the whole time the valley had 34 channels in a row.

So `wash_gate` now walks the **real valley**, generates every wash cell with the neighbours
the map actually gives it, and compares the touching edges tile for tile. It also asserts the
thing the old code got backwards: **a cell the channel RUNS THROUGH must never dive
underground**, and a cell where it ENDS must have the headwall, the culvert and the camp.

## AND THEN IT WAS ALL GREEN AND THE GAME STILL DREW SIXTY RIVERS

Everything above was true and the walked surface did not have one word of it.

`WASH GATE 19/0`. `WORLD MODEL 29/0`. `WALKED SURFACE 11/0`. `TILESPEC 310/0`. Mutation-tested.
And the page a player actually loads was still drawing **60 complete channels with 60 tunnel
mouths**, because:

```
/* ... WORLD.JS IS NOT ON THE PAGE. The walked surface inlines this module
   and the district kit, never world.js ... */
```

That comment is in the city page, dated 8/21, put there by this lane after the same class of
bug cost two days. I read it earlier this session while moving `landlockConnect`, and still
fixed the model and called it done.

The page keeps its own district dispatch. Wiring the wash into `world.js`'s DISTGEN reaches
the MODEL and nothing else. So the same change had to be made on the page — and the first
attempt at that missed too, because **wash is filed TERRAIN**: it is served by a
`KIT_TERRAIN` branch that returns before the cluster branch is ever reached. Adding it to the
page's `CLUSTER_KIT` changed nothing, and the probe still counted 60 of 60.

```
before          60 tunnel mouths in 60 wash cells
after           21 tunnel mouths -- 18 ends plus 3 lone cells, exactly
mutation        stop the page passing neighbours -> 60 again
```

**A LINEAR DISTRICT IS NOT A CLUSTER ONE**, and the page now says so in one line each: a
cluster gets the BOUNDS of its blob and fills them; a line gets its four NEIGHBOURS and runs
through the cell on whichever axis they name. Bounds cannot express a channel that turns.

### and the probe lied first, for the fifth time this session

The first page-level probe reported **0 tunnel mouths and 0 broken seams** and looked like a
pass. `m.kit` is a **flat `Uint16Array` of 16384**, not rows. `g[r][c]` is `undefined` for
every tile, and `undefined !== undefined` is false — so a wrongly-indexed probe reports a
perfect world. Indexed as `g[r*128+c]` it immediately said 60 of 60.

Worth naming precisely because of what it means for the seam number: on the page, the seam
check does **not** move under mutation. It is blind, so it is not evidence and it is not in
the gate. The mouth count moves 21 ↔ 60, so that is the one that went in.

### what now catches it

`walked_surface_gate` boots the page anyway, so it asks the page the question directly: the
tunnel mouths must track the ENDS, never the cells. A module gate structurally cannot see
this. **The fix and the gate have to be on the same surface, and for this game that surface is
the page, not the module.**

## AND A COLLISION IT SURFACED, WHICH WAS THE REAL FIND

`tool_idempotent_gate` went red on my tree and was green on plain main, which is how I knew it
was mine. It was:

`bohemia_city_hero_wire_patch.py` writes `var HERO_SRC=` into whichever page-referenced script
declares that name. Since the bank was chunked on 8/24, the file that declares it is **chunk
1** — the small BLOCKING script whose entire job is to be small. Running the hero tool put
**2.85 MB of hero art back onto the blocking chunk**: 1.75 MB -> 4.47 MB, past the browser
cache wall, and the wait before a world appears goes up with it.

It printed `already wired; nothing to write` while doing it. That is exactly the disease T2 in
its own gate exists to catch — the early-out only ever covered the page, never the extern
file.

**Main is carrying the result right now: chunk 1 on main is 4.47 MB.**

A placeholder is not a home. The tool now checks whether the chunks already carry exactly
these heroes and, if so, touches nothing; if the art really is new it writes and says plainly
that the chunker has to run after, because only the chunker decides which chunk a bank lives
in. `TOOL IDEMPOTENT GATE: 5 passed, 0 failed`, and chunk 1 stays 1.75 MB.

**Two lanes owned the same bytes under different placement rules and neither could see the
other.** The gate that caught it belongs to neither of them, and it caught it by comparing my
tree against main rather than by knowing anything about either lane.

## WHAT COMES AFTER

The same flood-fill says the handoff's list was short. Multi-cell blobs on the canon seed:

```
wash      51 cells   7 runs      DONE
farm      93 cells  13 blobs, biggest 9
golf       9 cells   1 blob      nine golf courses in a 3x3
railyard   6 cells   1 blob      six railyards in a row, and a yard is linear
stadium    4 cells   1 blob      FOUR STADIUMS in a 2x2
landfill   4 cells   1 blob
cemetery   4 cells   1 blob
park       3 cells   1 blob
medical    2 cells   1 blob
```

**Railyard is next** and it is the same shape of problem the wash was — a linear district that
should run through a cell rather than restart in it, and `sameNeighbours` is already there for
it. **Stadium is the most absurd per cell**: four stadiums in a 2x2 block, and a stadium is a
singular landmark.
