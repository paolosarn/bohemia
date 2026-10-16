# ONE SOLAR FARM, NOT 301

**8/24/26 — WORLD lane. The largest single district in the valley was building a complete,
separately fenced power plant in every one of its 301 cells: 301 substations, 301 control
buildings, 301 gates, and panel rows that restarted at every cell boundary. It is one plant
now. Measured on the real surface: 301 control buildings → 3, one per field.**

---

## HOW I GOT HERE, AND THE HYPOTHESIS I KILLED FIRST

The handoff's top item was the cluster seam on farm/warehouse/railyard — 13 sealed cells.
Before taking it I tested a bigger reframe: yesterday's finding said three neighbourhoods
survive on "a rounding difference", one shared tile out of seven, which would mean **every
front door in the valley is a one-tile slot**. If true, that dwarfs 13 cells.

It is not true. Swept every residential-to-street boundary in the valley:

```
shared walkable tiles   0    1    2    3    4    5    6    7+
boundaries              2    4    1   11    2    1    1   2377
```

**2,377 of 2,399 are seven or more.** Front doors are fine. The reframe was wrong and the
handoff's ordering stood — so the question became which cluster district to take first.

## SIZING IT PROPERLY INSTEAD OF TAKING THE FIRST ITEM ON THE LIST

Every district whose cells lay out independently has the same defect. So I measured the
blobs rather than assuming farm was the biggest:

```
district     blobs   cells   multi-cell blobs   cells in them   biggest blobs
solar            2     303                  2             303   265, 38
commercial     306     350                 38              82   4,3,3,3,3
farm            68      93                 13              38   9,4,4,3,2
downtown         7      28                  5              26   9,8,3,3,3
golf             1       9                  1               9   9
railyard         1       6                  1               6   6
```

**Solar is 265 cells in one blob** — twenty times farm's worst case, and 3.3% of the valley.
And crucially, for commercial and downtown the repetition is *correct*: adjacent city blocks
and strip malls SHOULD each be their own thing. A power plant should not.

At 96 m a cell, 265 cells is 2.4 km², which is a **correct** size for Mojave utility solar
(Copper Mountain is about that). The size was never the problem. The repetition was.

## WHAT WAS ACTUALLY WRONG

`generate(seed, opts)` only ever received a seed and a street list. So every cell ran the
whole plant:

```js
G.frame(3);                       // a perimeter fence on all four sides of EVERY cell
... substation switchyard ...     // in every cell
... control / O&M building ...    // in every cell
```

That is also why solar reads as a **wall**: the sealed-cell sweep measured `theirs=0` on
every solar edge, because every cell was fenced on all four sides — including the sides
facing the rest of its own plant.

## THE FIX, AND THE TWO THINGS IT HAD TO GET RIGHT

The 8/19 cluster pattern, already proven on airport / airbase / convention / prison / dam /
minigp / fort: the caller hands every cell **the bounds of its blob**, the plant is laid out
in valley coordinates once, and each cell keeps its own 128×128 window. Seams line up by
construction because there is only one layout.

Two things the airfield never had to handle:

**1. Speed.** An airfield is 3–9 cells, so looping the whole field per cell is free. At 265
cells the field is ~2,560 tiles across; the naive "loop the plant, clip to the window" is
6.5M iterations per cell × 265 cells. Every loop now starts at the first index that can
touch this cell and stops when it leaves. Measured on a 280-cell plant: **0.30 ms per cell.**

**2. No bounds must still mean the old plot.** With bounds absent the blob is this one cell
and every valley coordinate collapses to the cell-local one it used to be. Asserted, not
believed: **20 of 20 plots byte-identical** across five seeds × four street configs.

That test earned its keep immediately — the first version failed all 20. `fx1` is the last
tile *index* while the old code measured its setback off the *width* (`W-2-MARGIN`), so the
field was one tile short on two sides. One `+1`, found in seconds by a test that could only
answer yes or no.

## MEASURED, ON THE SURFACE

Before, from the byte-identical old output — every cell carried its own:

```
control building 126 tiles · switchgear 320 · gate 7 · fence ring 871
× 301 cells
```

After, counted across all 301 solar cells in the live valley:

```
cells with a control building   301  ->    3     (one per field)
cells with a gate               301  ->   84     (perimeter cells fronting a street)
fence tiles              ~262,000  -> 22,214     (the plants' outsides only)
```

And on a synthetic 3×3 plant, the seam: **128 of 128 rows carry the same code across the
interior boundary, with zero fence tiles on it.** The rows run through.

Walked surface: **93.2% → 93.3%**, +9 cells. Those nine are mountain that was cut off behind
a fence that should not have existed. The desert pocket at 6,0/6,1/6,2 is **still** sealed
and that is now correct — its only non-mountain neighbour is the plant's real outer fence,
and you cannot walk through a fenced solar farm.

## A GATE THAT WOULD HAVE GONE FLAKY, CAUGHT BY ITS OWN FAILURE

`legend_kept_gate` went red on `solar(2,6)` — "declares a control building and never builds
one." True of the sample, false of the world: the gate takes 30 evenly-spaced cells per
type, and after this change the control building exists in exactly **one** cell of 303. A
30-of-303 spread hits it about a tenth of the time.

So the gate would have passed nine runs in ten and failed the tenth, and that failure would
have been read as an intermittent generator bug. **A flaky gate is worse than a red one.**

Fixed generally rather than special-cased for solar: the sample now always includes the
eight extreme cells of each type — min and max of `x`, `y`, `x+y` and `x−y`, the bounding box
plus its diagonals. An evenly-spaced sample is precisely the thing that misses a corner, and
a corner is where a cluster-laid district anchors its one-off features. 5/0.

The debt is **unchanged at 31**, and saying so matters: the two entries that disappeared were
the false solar ones this change had just created, not real debt paid down.

## GATES

```
solar 7/0 · walked surface 11/0 · walkable 73/0 · district fill 53/0 · legend kept 5/0
truncation 5/0 · district kit 24/0 · interiors 42/0 · landlocked 16/0 · tilespec 310/0
city tab 64/0 · current slice 6/0 · map tab 9/0 · payday 35/0 · squint 4/0 · hue 4/0
art 45 12/0 · square icons 28/0
```

`current_slice` and `map_tab` went red first — the freshness class, exactly as on 8/22. An
engine module changed and two pages still embedded the old body. Both name their own rebuild
tool in the failure text; both rebuilt; both green. That is the third time this week that
class has fired, and it now gets checked by reflex after any engine edit.

## WHAT COMES AFTER

1. **The same fix for golf (9 cells) and railyard (6).** Both are single blobs and both are
   one facility, so they are the same shape of change with a much smaller blast radius than
   solar had. Landfill (4) too.
2. **Farm (38 cells in 13 multi-cell blobs)** is the messier one: the generator hard-codes a
   farmstead at the SE of every cell, so it needs the anchor moved to the blob rather than
   just the coordinates rebased.
3. **Warehouse (2 cells)** is barely worth it on its own; do it when farm is done.
4. **Leave commercial and downtown alone.** Adjacent blocks repeating is what a city IS.
