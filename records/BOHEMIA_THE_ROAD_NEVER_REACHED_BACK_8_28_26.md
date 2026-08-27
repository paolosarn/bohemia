# THE CITY REACHED FOR THE ROAD AND THE ROAD NEVER REACHED BACK
# 8/28/26, WORLD lane. Paolo played the build and said the streets were still broken.
# The gate was green. He was right and the gate was the broken part.

> "streets are stillls uper fucked"

Said against build 8/28k, on which `street_contract_gate.js` reported **arterial 0 of 2594,
rail 0 of 86**, seventeen checks, all green.

## THE TWO LINES THAT MADE HIM RIGHT

```js
const t = om.at(tx, ty);            if (!t || !RD[t.district]) continue;
const u = om.at(tx + dx, ty + dy);  if (!u || !RD[u.district]) continue;
```

**Both sides of a seam had to be a ROAD DISTRICT or the seam was never looked at.** Every
edge where a street meets a shop block, a neighbourhood, a farm, a plaza, an apartment
building — every edge a person actually walks up to — was skipped in silence, while the gate
printed a number that sounded like it covered the valley.

It governed the road network talking to itself. It said nothing at all about the road network
talking to the city.

## THE NUMBER, ONCE SOMETHING ASKED

| | |
|---|---|
| road-to-road seams the old gate measured | 4,497 |
| edges in the valley where a street actually reaches one | **7,562** |
| of those, broken | **2,668 (36.3%)** |

Three quarters of the valley's street edges were never in the count, and more than a third of
the real total did not connect.

## AND THE BREAK WAS ONE-SIDED, WITH THE CITY DOING ITS JOB

```
ONE_SIDE  arterial(45,7) -E-> commercial(46,7)   -1..-1  vs  47..57
```

The **commercial block has a driveway at rows 47..57** reaching the shared edge. The arterial
next to it has **nothing there at all**.

Every district in this valley obeys the STREET-AWARE / DRIVABLE ACCESS LAW and puts its one
car entrance at the kerb. The arterial has **27 metres of parcel frontage** in the way, and it
never cut its kerb to meet one.

Photographed before touching anything: a shopping plaza with a full drive aisle, a driveway
poking out of its west side, and **about fifty metres of bare dirt** between that driveway and
the road. You could not drive into a single shop in Las Vegas.

The arterial's own 8/26 pad-site approach is a real driveway and it was still not this one: it
serves the arterial's *own* pad, it sits at a random spot along the cell, and it stops four
tiles short of the boundary. **A driveway that does not reach the property line does not serve
the property.**

## THE FIX

The world measures where each non-road neighbour's driveway actually arrives — off that
neighbour's own built grid, never declared — and hands the road the list. The road cuts its
kerb exactly there and runs the approach across the gutter, the kerb, the parkway, the walk
and the whole parcel, out to the cell edge.

Deliberately **not** on the freeway: an interstate is limited access, and a driveway off one
is not a fix, it is a defect. The world does not send the list to freeway, beltway or
interchange at all.

## THREE OF THE FOUR BUGS ON THE WAY WERE IN RULES I WROTE THE SAME HOUR

1. **A "widen a narrow mouth" rule.** Real drive approaches are 8–12 m, so I widened anything
   narrower. The kit hands most districts a **7-tile** entrance, so 61..67 became 60..67 —
   and 141 roads-that-end-in-dirt became 141 roads-that-are-one-tile-off. All six samples
   identical. **The district owns its own entrance; the road's job is to meet it, not to have
   an opinion about how wide it should have been.**

2. **`C - 63` lands on tile 1, not tile 0.** `C + 63` is 127, which *is* the east and south
   edge, so those closed. The north and west edges stayed one tile short — 276 seams, with the
   identical `-1..-1` on the road side. **This module's own header warns about exactly this
   off-by-one**, in those words, about a different constant.

3. **A driveway is a contiguous RUN, not an extent.** I took the outermost drive tile on the
   neighbour's edge, the way the seam profile does. `arterial(22,40)` fronts a reclamation
   plant whose *entire* north edge is yard: the span came back `9..99`, the road paved ninety
   metres of its own frontage out to the corner, and it broke **5 arterial-to-arterial seams**
   on a gate whose arterial ceiling is zero with no allowance. Outermost-extent is the right
   measure for *where is the road* and the wrong one for *where is the door*.
   **A ninety-metre yard still has one gate**, so a run wider than a real approach now gets a
   proper 12 m entrance at its centre.

## THE RESULT

| | before | after |
|---|---|---|
| broken edges, whole valley | **2,668** | **1,616** |
| share of all street edges | 36.3% | **22.0%** |
| `arterial ↔ commercial`, both directions | **563** | **0** |
| arterial ↔ arterial | 0 | **0** |
| rail ↔ rail | 0 | 0 |

Photographed after: a dark asphalt drive runs from the road across the full fifty metres of
frontage into the plaza.

Seven of the remaining breaks are a deliberate, written-down choice rather than a defect: the
wide-frontage yards get one real gate instead of ninety metres of pavement, and stop matching
tile for tile. That is the truthful state of the valley.

## THE GATE

The check went **into `street_contract_gate.js` itself**, not into a new file, because that is
where the blindness was. It sweeps every edge in the valley, counts the ones that honestly die
against desert or mountain apart so the headline cannot be padded, and carries a ceiling that
only goes down. It also asserts **it is looking at more edges than the road-to-road sweep it
was added to correct**, so nobody can quietly narrow it back and leave the ceiling meaning
nothing.

19 checks, green. Arterial, rail and strip-to-strip still hold at zero and one, no allowance.

## THE LESSON

**A GREEN GATE IS A CLAIM ABOUT ITS OWN SCOPE BEFORE IT IS A CLAIM ABOUT THE GAME.** This one
was honest about everything it measured and silent about the three quarters it did not, and
the silence read as coverage for two days.

He found it by walking around. It took one screenshot.
