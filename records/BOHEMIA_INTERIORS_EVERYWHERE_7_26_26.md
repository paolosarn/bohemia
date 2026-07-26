# INTERIORS EVERYWHERE (CITY lane, 7/26/26)

Backlog item CITY-1: "every married district's buildings enterable per
interior=exterior." Shipped. Three parts: a locked law that was being broken in
343 places, an enterable rung that stopped short of the surface Paolo taps, and
a district that was never actually married.

## 1. THE LAW WAS BEING BROKEN (343 buildings, silently, under a green gate)

INTERIOR-MATCHES-EXTERIOR LAW (Paolo 7/19, LOCKED): "if your interior does not
match the width and length of the exterior every time, you are failing... I am
not having it any other way."

`engine/bohemia_floorplan.js` opened with `W=Math.max(minR+2,W|0)`. Any footprint
too small for its zone's room grammar was silently GROWN. Sweeping every one of
the 67,034 buildings in the seed-12345 valley:

    storage   unit row   3x108  ->  10x108     (a wall-to-wall row of units)
    storage   unit row   4x51   ->  10x51
    farm      strip      1x19   ->   6x19
    farm      strip     19x1    ->  19x6
    trailer   single     5x16   ->   6x16
    trailer   single     8x1    ->   8x6
    watertreat plant     7x6    ->  10x10
    ... 343 in total

world_gate's dimension check passed anyway, because it sampled a coordinate
window and stopped at 200 buildings — it never reached a storage row or a farm
strip. A green metric proving non-violation of what it happened to look at.

FIXED: the plate is now EXACTLY the footprint, always. The GRAMMAR shrinks to
fit the plate instead of the plate growing to fit the grammar, and a sliver too
thin to carry walled rooms (under 3 cells on either axis) becomes one open plate
with a perimeter entrance. A second, older bug fell out of it: the BSP cut
formula could hand one half fewer cells than the minimum, and at minRoom=1 it
handed it ZERO — a room with no area, that nothing could ever reach.

After: 67,034 buildings, 0 clamped.

## 2. INTERIORS EVERYWHERE, NOT JUST WHERE THE FACTORY REACHED

- 219 buildings on the BESPOKE/LANDMARK cells (casino, resort, strip — Paolo's
  own hand, no DISTGEN entry — plus airport, campus, prison, town, convention)
  exposed `floorplan()` but no `interior()`. They now answer the same uniform
  dispatch, returning the SAME floorplan they already generated. Mechanism only:
  nothing invented for the cells he reserved.
- `leisure` (drivein / golf / stadium / waterpark) was a zone DISTGEN asks for
  that the generator did not have — 46 buildings falling through to a nameless
  'room/room/service'. Its roles are read off those districts' own recorded
  dossiers (golf: "pro shop + bag room up front, grill + locker rooms behind").
- THE DOOR NOW MATCHES THE BUILDING. Every interior entrance was hardcoded 'S'.
  It is now read off the plot: score each side by the exterior tiles actually
  lying against it, a declared PORTAL tile (the dossier's own door) outranking
  plain walkable ground, ties broken S>E>W>N — the same primary-street ordering
  the STREET-AWARE law uses.

## 3. WALK INTO THE WALL AND YOU GO IN (the alpha, CITY tab)

The enterable rung had existed since 7/18 and was reachable from nowhere Paolo
taps. In the alpha's CITY app, walk mode, stepping into a solid tile whose
DOSSIER declares an `enter` now puts you inside instead of blocking you. No new
button, no menu, no mode toggle. Walk back out the door and you are on the plot
again, on the exact cell you came in from.

- the plate is the flood-filled footprint's bounding box, handed to the
  generator unmodified — the law enforced by construction
- the rooms are engine/bohemia_floorplan.js INLINED VERBATIM (ENGINE SYNC LAW)
- the district -> room-grammar table is transcribed from bohemia_world.js's
  DISTGEN at patch time; the gate re-derives it and fails on any drift
- what counts as enterable is the district's own dossier. Never a new list.
- LIGHT = TERRITORY: dark inside at night unless the plot is on the live network

## 4. COMMERCIAL WAS NEVER ACTUALLY MARRIED — FOUND, NOT FIXED

Chasing "which districts have enterable tiles in the app" turned up that
`commercial` had ZERO. `engine/bohemia_commercial.js` (and `bohemia_suburb.js`)
never bound `K` — they referenced a bare `K` behind `typeof K!=='undefined'`, so
in the browser the guard silently swallowed the registration and the module never
joined the district kit. The whole generic marriage keys off that registry, so
the walked commercial district is still the LEGACY PREFAB STAMPS: not the canon
corner plaza, and not one enterable building in it.

Binding K is a one-line fix. It was tried, and it turned walkable_gate RED:

    streets ['S']      drive 49%  content 41%   gap  8   PASS
    streets ['S','E']  drive 46%  content 44%   gap  2   PASS
    streets ['W']      drive 61%  content 30%   gap 30   FAIL
    streets ['N']      drive 61%  content 31%   gap 30   FAIL

On a SINGLE W or N street the generator builds only ONE store strip (a lone
street edge leaves just the top band) and parking fills the rest — a
WALKABLE-LAND LAW violation that the unregistered state has been hiding. That is
exactly the gap this module's own NOTES already flag: "[PENDING Paolo] its
standalone / mid-block form (how a plaza reshapes off a corner) — gated on
S/corners/N only for now, NOT arbitrary single edges."

Designing the mid-block plaza is a district-build decision with a [PENDING Paolo]
on it, not a one-line binding at the tail of another turn. So: the binding is
REVERTED, the finding is written into the module's own head where the next person
to touch it cannot miss it, and it is the top CITY backlog item. `suburb` keeps
its K binding (it fixes standalone module loading and changes nothing in the app,
where the SUB_RES path already takes precedence).

Also new: `tools/bohemia_city_module_resync.py`. The tools that inlined those 39
engine modules are all one-shot (marker, then no-op forever), so an engine fix
left the app silently behind with nothing to re-run. This is the re-run. It found
`district_kit` in the app was a revision old too (missing `cityhall:'civic'`).

## VERIFIED ON THE REAL SURFACE

Driven through the actual alpha in an iPhone-portrait viewport: front splash ->
CITY tab -> DROP IN -> walk into a building via the same step call the d-pad
makes. Screenshots are the real canvas.

    slices/BOHEMIA_INTERIOR_PROOF_HOUSE_7_26_26.png       suburb    13x12,  4 rooms
    slices/BOHEMIA_INTERIOR_PROOF_APARTMENT_7_26_26.png   apartment  5x12,  2 rooms
    slices/BOHEMIA_INTERIOR_PROOF_SCHOOL_7_26_26.png      school    33x27, 11 rooms

Interior dims === footprint dims in every one. All three were taken on the
SHIPPED build, after the commercial revert — nothing in them depends on a state
that is not on main. (A 70x25 / 22-room retail plate was also walked, during the
window the commercial binding was in place: big plates render and walk correctly.
That shot is not kept, because commercial is not married today.)

## GATES

- NEW: `gates/interiors_gate.js` (registered as INTERIORS) — 22 checks: the
  generator inlined byte-identical, the zone table matching DISTGEN both
  directions, only the dossier declaring enterability, the plate handed over
  unmodified, the door on the side you came in from, the way back out, and the
  law executed for real across the valley's actual pathological footprints.
- EXTENDED `gates/floorplan_gate.js`: every zone x every entrance side x every
  plate from 1x1 up, plus the exact footprints the valley scan caught.
- EXTENDED `gates/world_gate.js`: sweeps EVERY married district type by name
  across four seeds (a rare landmark does not place in every valley), all of its
  buildings — not a coordinate sample that stopped at 200. Districts with no
  surface buildings must be deliberate about it: `wash` is a flood channel whose
  only way in is the sewer tunnel mouth down to THE UNDERGROUND, so it declares
  zero footprints on purpose and the gate names it rather than hiding it.

## THE KNOWN HOLE (not mine to fill)

`wash`'s SEWER TUNNEL MOUTH declares `enter: 'THE UNDERGROUND: the LIFE
flood-tunnel network where the unhoused live (a separate below-grade level; this
is the door)'`. That is a LIFE-lane system and a below-grade level, not a room in
a footprint. It stays a declared door with nothing behind it until that lane
builds it. [PENDING — LIFE lane, not a CITY call]
