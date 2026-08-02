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

*Filed under the TRUTH HIERARCHY: on any conflict the newest date wins. Indexed in
`BOHEMIA_CANON_INDEX` and in `laws/BOHEMIA_PAOLO_FEEDBACK_MASTER.md`.*
