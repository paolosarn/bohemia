# BOHEMIA ADDENDUM — ROUND ROOFS AND DOORS ON WALLS
**8/2/26. LOCKED. Machine: `gates/round_and_doors_gate.py`.**

> "The icons are tweaking out a little bit. I don't know why every time you make a
> circular shape the roof of all your circles **looks like tarps** and shit. It's very
> bad. **Doors aren't where they're supposed to.**
> City hall is like 50% · courthouse like 50% · terminal like 40% · chapel like 30%"
> — Paolo, 8/2/26

---

## HE FOUND TWO PIPELINE BUGS IN ONE SENTENCE

Neither of these was content. Both were in the shared machinery, which is exactly why he
kept seeing them survive rebuild after rebuild while I adjusted the buildings.

**VERIFY ON THE REAL SURFACE (7/18) already named this: a symptom that survives content
changes is a PIPELINE bug.** I had that law, I had been told it before, and I still spent
four district rebuilds adjusting drums instead of reading the primitive that draws drums.

### 1. THE ROOF OF EVERY CIRCLE

`Scene.prism` in `tools/bohemia_iso3d.py` capped its cylinder like this:

```python
for i in range(0, n - 2, 2):
    self.quad(topv[0], topv[i + 1], topv[i + 2], topv[min(i + 2, n - 1)], top_mat, (0, 0, 1))
```

Two faults at once:

- **It steps by two**, so half the triangle fan is never emitted at all — the cap has
  wedge-shaped **HOLES** in it.
- **Its fourth vertex is the same point as its third** (`min(i+2, n-1)` == `i+2` for every
  i in range), so every quad it *does* emit is a **degenerate sliver**.

Holes plus slivers, seen at 2:1 isometric, is precisely a tarp pegged over a drum. And it
was in **every circular thing the factory has ever baked** — the library drum, the city
hall council chamber, the courthouse rotunda, the terminal concourse, every silo, every
tank, every dry fountain basin.

**THE FIX:** a centred fan — every wedge runs `centre → a → b → c`, so the cap is closed,
convex, gap-free, and has no repeated vertices. The rim keeps its full n-gon of side quads,
so the silhouette is untouched. Only the lid is repaired.

### 2. DOORS OFF THEIR WALLS

`_door(s, at, lo, hi, ztop)` takes a bare plane and a bare span and draws a leaf there.
**Nothing ever checked a wall was behind it.** Seven heroes had doors hanging in the air:
the city hall's ran 1.2 units off the end of its own block, the courthouse's floated clear
of the rotunda, the campus library's overhung its colonnade, both of the school's missed.

This is the recurring shape of almost every bug in this repo: **a value passed by hand
where a value could be DERIVED.** So it is derived now. `_door_face(s, origin, size, …)`
takes the same two tuples you gave `Scene.box` and computes the face plane and the leaf
span from the solid itself. **A door placed that way cannot be off its wall.**

---

## THE MACHINE, AND WHY IT MEASURES INSTEAD OF GREPPING

The cheap version of this gate greps the factory for `_door_face` and greps `prism` for a
centred fan. That passes on a tool edited around it, and the **8/2 library post-mortem** is
about a gate that asserted the wrong thing and then forced every future session to keep the
bug. So `round_and_doors_gate.py` asks the **geometry**:

- it bakes a prism at 12, 18, 20 and 24 sides and checks the cap **uses every rim vertex**
  (a missing one is a hole), **repeats no vertex** (a repeat is a sliver), and **sums to the
  polygon's own area** within 2% (under is a gap, over is an overlap)
- it builds **all 27 heroes** and checks every door has a solid whose `+x` face it sits on,
  whose y-span contains it, and whose roof is over its head — allowing a wall that stands on
  a podium reaching grade, because a door at the top of a plinth is a real door

**DOORLESS DEBT (ratchet, may only shrink):** 12 heroes have no door at all — a building you
cannot enter is not a building. Named in the gate so nothing new joins the list and nothing
stays on it once it is fixed.

---

## 3. AND THEN HE SAID "DETAILS", SO I LOOKED CLOSER

> "Details shits just looking glitchy for all of them bro" — Paolo, 8/2

Asked whether the icons were wrong in **style** or in **detail**, he said detail — the
approach is fine, the execution is glitchy. Zooming the icons 5× found two more of the
same family, and **both are the same root cause a third and fourth time: a value passed
by hand where a value could be DERIVED.**

### THE WINDOW GRID WAS NEVER ON THE PIXEL GRID

Window walls were laid out in UV with **fixed fractional thresholds** — a mullion was
always 13% of a pane, whatever a pane happened to measure. A face 41 final pixels wide
divided into 8 panes gives a **5.125 px pitch and a 1.33 px mullion**, and after the 4×
supersample is box-downscaled those land as 5px and 6px panes with 1px and 2px mullions in
no pattern at all. **Every window wall in the game was ragged**, and ragged detail at icon
size reads as exactly one thing: glitchy.

`_snap_grid(span_px, count)` measures the face's own projected span and returns a cell
pitch that is a **whole number of final pixels** with a mullion of **exactly one**. The
authored count is a wish; the pitch is what has to be integral, and the pitch is
measurable. It floors rather than rounds, so the last cell is never sliced.

### SLABS TUNNELLED THROUGH BUILDINGS

**A canopy projects OFF a building. It does not pass THROUGH one.** The city hall's entry
canopy ran across the council chamber, the courthouse's cantilever crossed the rotunda, and
the terminal's solar deck went straight through the curved concourse. A thin slab crossing a
mass at mid-height reads as a rendering error — his word exactly.

The gate's test: does a slab overlap, in plan, a mass standing **meaningfully taller than
the slab's own top**? A cap sitting on its own drum grazes a neighbour by hundredths of a
unit and is not this; the 0.5 margin is what separates a merge seam from a tunnel.

---

*Filed under the TRUTH HIERARCHY: on any conflict the newest date wins. Indexed in
`BOHEMIA_CANON_INDEX` and in `laws/BOHEMIA_PAOLO_FEEDBACK_MASTER.md`.*
