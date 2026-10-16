# THE SECOND FLOOR EXISTED IN THE DATA AND NOWHERE ELSE
**8/7/26. WORLD lane. 71 of 207 sampled valley buildings now have a real upper storey with a
real staircase. Machine: `gates/verticality_gate.js`.**

> "Think outside the box. WE HAVE 11 months of forward motion work we need to complete."
> — Paolo, 8/7/26

---

## THE GAP, AND HOW LONG IT HAD BEEN OPEN

Paolo's stated direction is **two-and-three-storey buildings with climbable stairs.**

- `bohemia_suburb.js` has computed `story:2` for two-storey house blobs since it was written.
- `bohemia_world.js` carried that value faithfully all the way down the ladder — valley →
  district → plot → **building**, where it appears as `story: f.story||1`.
- And at the bottom rung it **died**. `bohemia_floorplan.js` knew three words —
  `floor`, `wall`, `door` — and had *"multi-floor stacking"* sitting in its own `pending`
  list. **Every two-storey house in the valley had exactly one floor inside it.**

`bohemia_garage.js` has meanwhile been generating real 2–6 deck structures with ramps and
stair cores **that nothing renders and nothing walks.** The generation was never the missing
half. The floorplan was.

## WHAT A STOREY IS NOW

Another **full plate**. INTERIOR-MATCHES-EXTERIOR (Paolo 7/19, LOCKED — *"not having it any
other way"*) applies **per level**: every floor of a building is exactly the footprint w × h,
never clamped, never grown. Decks are a separate axis and each one still equals the footprint.

**The stair is placed where BOTH plates already have floor**, and that is derived rather than
authored: generate the upper plate, intersect the two floor sets, take the cell deepest inside
the biggest shared room. A stair chosen on one floor and then forced through the other is
exactly how you get a staircase arriving inside a wall.

**No street door upstairs.** An upper plate's perimeter door is put back to wall — a door on
the second storey opening onto thin air is the class of thing this repo keeps shipping and
then finding in a render. Rooms up there stay mutually reachable because the door graph is a
spanning tree over rooms, which never depended on the street door.

## TWO DECISIONS THAT LOOK TIMID AND ARE NOT

**A stair keeps `g:'floor'` and gains `kind:'stair'`.** Every consumer in this repo tests
`g==='floor' || g==='door'` for passability. A new `g` value would have made **stairs
impassable the day they shipped** — a staircase nobody can stand on.

**The ground floor IS still the returned object.** `world_gate`, `interiors_gate` and the run
all read `.grid`, `.rooms` and `.doors` off what `generate()` returns. The stack hangs off it
as `.levels`; nothing that reads a floorplan today had to change.

## THE BUG I INTRODUCED AND THE GATE THAT CAUGHT IT IN ONE RUN

`levels = [ground]` made **level 0 a pointer back to the object holding the array.**
`floorplan_gate` died instantly on *"Converting circular structure to JSON"* — and so would
anything that ever serialises an interior: a save, a payload, a gate comparing two plans.

Level 0 is a **view** now: the same `grid`, `rooms` and `doors` arrays **by reference** (no
copy, no second source of truth) in an object that does not contain the level list. The cycle
is gone and the identity of the data is not.

## THE GATE WALKS IT RATHER THAN READING IT

`verticality_gate.js`, 12 checks: flood from the street door across floor+door cells, require
the stair to be **reached** and not merely present, step up, flood the next plate from the
stair's own cell, repeat to the top. Plus: every room on every floor reachable that way; every
level exactly the footprint; no perimeter door above the ground; stairs aligned and floor on
both plates; `g` unchanged; and it must hold **in the real valley**, not just a unit test —
because if `story` were still dying upstream, a synthetic test would never notice.

**13 storeys climbed. 71 of 207 sampled valley buildings multi-storey.**

## AND THE SAME LESSON AS THIS MORNING, LEARNED PROPERLY THIS TIME

Changing a canonical engine module leaves every carrier holding the old body — nine of them
here. Earlier today I refreshed a built slice by **regenerating** it and **broke thirty
gates**, because `BOHEMIA_RUN_CURRENT.html` is a built artefact other lanes patch by hand.

So this time: **re-inline the module body, and nothing else.** Find the module's own span by
its first and last line, swap that span for canon byte-for-byte, leave every other byte in the
file alone. Five carriers refreshed including the run slice, **every other lane's patches
intact**, and `ENGINE SYNC LAW HOLDS: 17 modules, zero drift.`

Re-inlining a module is not the same operation as rebuilding somebody else's page, and today
is the second time that distinction cost a full suite run to learn.

## ALSO CLOSED ON THE WAY THROUGH

`tools/bohemia_city_interiors_patch.py` had thrown `ValueError: substring not found` since the
8/2 payload-wall pass moved the city app — it hand-wrote where the city lives instead of
asking `gates/bohemia_city_app.py`, which exists for exactly that. The zone map it maintains
was 12 districts behind. **The map is now rebuilt from `DISTGEN` itself** — the same slice the
gate reads, so it cannot drift and cannot be retyped wrong.

---

*Filed under the TRUTH HIERARCHY: on any conflict the newest date wins.*
