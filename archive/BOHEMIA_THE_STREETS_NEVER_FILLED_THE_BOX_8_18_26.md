# THE STREETS NEVER FILLED THE BOX (8/18/26, WORLD lane)

**Paolo ruled it on 8/11 and it was BUILT the same day. It reached the surface he walks
today — a week later. 3,386 cells, 37% of the valley.**

> "the streets should FILL THE WHOLE FUCKING BOX ABSOLUTELY... THE STREETS DONT HAVE
> WALLS." — Paolo, 8/11/26, LOCKED

---

## THE MEASUREMENT

`slices/BOHEMIA_CITY_WORLD.html` carries a **duplicate road renderer** — a four-number
`XSEC` table (lanes / median / side) plus a colour, drawing a thin ribbon and leaving the
rest of the cell as fallback dirt `#a89a80`. The engine modules were fixed on 8/11 and the
page has never used them. Asked the page's own per-tile function over a whole cell:

| | before | after |
|---|---|---|
| arterial | **8.6% drawn**, 91% bare dirt | **99.2%** |
| freeway | **17.9% drawn**, 82% bare | **85.5%** |
| strip | 20.7% | **100%** |
| interchange | 20.1% | 20.1% *(deliberately untouched — see below)* |

The modules fill **100.0%**. Zero page errors either side.

**This is what "the freeways are looking like dog shit" (Paolo, 8/16) actually is.** It was
never an art problem. His own approved ruling never got to the screen — he has been walking
a valley where 91% of every street cell is bare dirt with a thin strip of asphalt down the
middle.

It is also the third instance today of one bug: **a module the walked surface cannot see.**
The Strip districts had no module. Eighteen district types had a module the page did not
carry. The roads have a module the page carries *and ignores in favour of its own copy.*
Same fix all three times: delete the duplicate, use the module.

---

## WHAT THE STREET IS MADE OF NOW

Not one grey. The arterial cell comes back as seven surfaces the eye can tell apart —
asphalt `#33333c` (10,232 tiles), detached sidewalk `#8a8a92` (2,816), amenity strip, curb
and gutter, lane paint, block wall. The freeway adds embankment, shoulder and sound wall.
All of it out of each module's own palette, which is the harmonized street bank's colour
(STREETS ARE THE HARMONIZED POOL, 7/31) rather than a grey this page invented.

The RUN and the CROSSING resolve correctly too: `arterial` when the cell is a straight run,
`arterial_x` when a cross street arrives on the other axis — Paolo 8/11, *"2 DIFFERENT ITEMS
AND ICONS!!"*, which the page previously could not express at all because it had one XSEC
row for both.

---

## THE INTERCHANGE IS NOT IN THIS SHIP, AND THAT IS A MEASUREMENT

Routed through its module the interchange came back **worse than the table it replaces**:
8,843 tiles of bare fallback and **three tiles of road**, against 20% drawn before. A stack
is built from its cluster's **approach data** — which arm climbs, which dives, where each
ramp lands — and this page can hand it bounds but not that. Shipping it would have traded a
thin interchange for an empty one.

Sixteen cells, left exactly as they were. Its module is not inlined either, which is 30 KB
not spent. Named here so the next session does not re-derive the reason.

---

## COST

**+64 KB gzipped** on the walked surface (819 KB, from 755 KB) for 3,386 cells.

---

## STILL OPEN

* The interchange (16 cells) needs `clusterApproach` on the walked surface, the way the
  world model computes it.
* `roadcell_gate` has one failure — *"yellow appears only at the turn bay"* — and it had the
  same one before this work, with the same count. Not caused here, not fixed here.
* ART's **TF-ART-011 freeway tile family** was blocked on exactly this ("WORLD must realize
  freeway/arterial cells", demo status board row 2). It is unblocked: those cells now emit
  their modules' real tile codes instead of four page-invented greys.
