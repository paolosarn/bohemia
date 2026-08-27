# A FIX THAT TRAVELS TO THE THING ON TOP AND NOT THE THING UNDERNEATH
# 8/27/26, WORLD lane. Three separate places, one shape, all in one turn.

## THE NUMBERS

| seam class | start of turn | end |
|---|---|---|
| cross-class (two road classes meet) | 166 | **129** |
| strip ↔ strip | 4 | **1** |
| arterial ↔ arterial | 0 | 0 |
| rail ↔ rail | 0 | 0 |
| freeway ↔ freeway | 40 | 40 *(map fact, see below)* |
| interchange | 3 | 3 |

`gates/street_contract_gate.js`, 17 checks, green, both ceilings ratcheted down.

---

## 1. THE LEVEL CROSSING INVENTED ITS OWN ROAD WIDTH — 37 SEAMS

`engine/bohemia_rail.js` carried this, and the two lines are adjacent:

> *"the grade crossing borrows the arterial's own cross-section so the roadway arrives and
> leaves at exactly the tile it left the neighbouring street cell on"*
> ```js
> var PAVE = 21, CURB = 23;
> ```

**It borrowed nothing.** Those were the arterial's numbers on the day somebody typed them.
The arterial was rebuilt to real Clark County figures on 8/26 and went to 17/19. So a street
**35 tiles wide** ran up to the railway, crossed on a **43-tile crossing**, and came off 35
tiles wide again — at every level crossing in the valley.

It reads `ART.PAVE_HALF` and `ART.CURB_HALF` now. `layCrossing` paves `C ± PAVE` instead of
`C ± CURB` (18 seams); `padSide` pulls the loading pad back from `C-1` to `C-4` (19 seams).

**FIFTH TIME THIS MONTH A CONSTANT MOVED AND ITS DEPENDENT STAYED BEHIND** — `BOX`, `POCKET`,
the arterial pole offsets, the freeway deck's `half=11`, and now this. **Four of the five had
a comment beside them asserting exactly the dependency the code refused to express.** A
comment that asserts a dependency is worth nothing next to code that evaluates one, and this
file is the cleanest case in the repo: a correct sentence sitting directly above a line that
refused to do it.

---

## 2. THE CROSS STREET STOPPED IN THE MIDDLE OF LAS VEGAS BOULEVARD — 3 SEAMS

Paolo, 8/16, about the freeway: *"you gotta recognize when the freeway is two grids wide two
tiles wide that it has to WORK TOGETHER."* The Strip took that ruling on 8/18 and wired
`spanThrough`, so a **pedestrian bridge** keeps going across the sibling carriageway instead
of stopping half way.

It carried the bridge and **nothing else.** The ROADWAY under it still ended at the cell
boundary. A street ran up to a two-cell-wide boulevard, crossed the near carriageway, and
stopped dead in the middle of it.

A through-half now paves the cross arm edge to edge and carries its lane lines and its
pavements. It still gets **no junction anatomy** — no crosswalks, no stop bars, no signal
masts, no second pair of bridge towers — and no median palms or parking pockets down the
cross arm, because those belong to a boulevard and the thing crossing here is a street
passing through. Measured: a through-half went from 5,489 drive tiles to 6,983.

**One residual strip seam is left and it is written down as undiagnosed rather than guessed
at.**

---

## 3. THE SAME SHAPE, EARLIER TODAY, ON THE FREEWAY

The deck's own width was a literal `half = 11` under a comment claiming it was a real
overpass width. The arterial moved and the bridge did not, so a 35-tile road climbed onto a
23-tile bridge. And the deck was built on whichever carriageway touched the arterial and
stopped at the cell boundary — the identical two-cells-abreast defect, in the module Paolo's
ruling was originally *about*.

**Three instances, one turn.** The shape is: *a fix reached the visible object and not the
thing it rests on.*

---

## WHAT IS LEFT AND WHY IT IS NOT MINE

**40 freeway-to-freeway seams.** Sampled: `freeway(13,13)` runs N/S with a crossing east and
west; `freeway(14,13)` beside it runs E/W with a crossing south. **Two freeway cells running
perpendicular to each other and meeting.** That is a freeway-on-freeway crossing, and this
valley has a district for exactly that — `interchange`. Where the overmap laid two interstates
across each other without marking the junction, **no piece can make the seam agree**: the two
cells are honestly building two different roads.

MAP LAW: Claude never designs map layouts, plumbing only. Counted, named, and left for a
ruling rather than papered over with a special case.

**AND THAT CALL IS NOW UNDER REVIEW, BECAUSE READING THE OVERMAP CHANGED IT.** `bohemia_overmap.js`
builds the beltway as *"a RECTANGLE ring with square corners, 2 wide, snapped mid-block"* and
types **every ring cell `DISTRICT.FREEWAY`**. So the valley has four freeway corners by
construction, plus three exit stubs that T into the ring — and the freeway module cannot draw
a corner. Its axis rule is *"the axis is the pair, not any neighbour"* (a correct 7/27 fix for
a two-cell-wide straight run), which means a cell with N and S neighbours has `horiz` forced
false even when its east neighbour is the ring turning east. Worked by hand around one corner
block: at least one seam falls out of the geometry, and there are four corners two cells wide.

**If that is the cause, this is a PIECE fact and not a map fact at all** — the 215 does not
close, and no ruling from Paolo is needed to fix it.

### AND I BUILT THAT FIX AND IT CHANGED NOTHING

The world was taught to hand the freeway its **same-family** perpendicular arrivals in a list
of their own (`famCross`), separate from the surface streets it bridges over, and the freeway
module was taught to turn an axis on for those and only those. A street on the same edge still
got an overpass; another interstate got a turn.

Measured on the built valley: **freeway 40 of 1415. Exactly what it was before.**

**A FIX THAT CHANGES NOTHING IS NOT A FIX**, so it was reverted rather than shipped as
plausible-looking dead weight. Either the new list never populates at those cells, or the ring
corners are not where the 40 are.

### THE REAL ERROR IS THAT I HAVE NOW GUESSED TWICE

Filed as a **map fact** this morning, on two sampled cells. Filed as **the beltway's corners**
this afternoon, by reading the overmap. Both were derived by reasoning about code and neither
was measured. The second one was built, run, and returned a flat zero.

**Every other seam class in this valley fell to the same method and it was never guessing:
count the seams, look at the picture, change one thing, count again.** The 196 arterial-to-
freeway breaks, the 37 rail ones and the 3 strip ones were each found by making the instrument
tell me where they were.

So the next thing this lane does is **not another hypothesis**. It is to make
`street_contract_gate.js` print the coordinates and the two lo..hi profiles of every broken
freeway seam, and then go and look at one.


**3 interchange seams** are an off-by-one in a blob's coordinate mapping, not in the street
contract.

---

## AND ONE MORE ROUTING-KEY BUG, FOUND BY LOOKING

The reservoir's buried concrete basins were drawn with **code 6, "a welded steel reservoir,
seams showing through the failed coating"**, and their joints with **code 7, "the tank roof,
its centre vent and the hatch beside it"**. Half the storage on an LVVWD site is buried
concrete with a roof slab you can drive a truck over, and it was wearing steel plate and a
tank hatch. The cut slope above the pad wore a tank roof too.

They have their own codes now — basin roof slab, expansion joint, basin edge — and the
first photograph of them came back **the colour of the district's dirt pad**, for the
identical reason the bridge came back tan this morning: kind `ground` and kind `structure`
both fall through the pool table's else branch to the decomposed-granite yard pool.

**FOURTH TIME THIS MONTH A NAME SILENTLY CHOSE THE WRONG RENDERER** (concrete → the approved
house-roof pool, putting brickwork on a dam; the bridge deck → the yard pool; the deck stripe
→ asphalt; now this) **and the third time the fix was one more special case.** So it is one
named list — `CONCRETE_NAME` — of the things in this valley that are poured concrete, and the
next one is an entry rather than an edit. `tank pad` is deliberately not on it: that is graded
dirt and its own legend says so.

The basin edge also had to stop being a `structure`. Declared one it drew as a **wall**,
through the facade pass, in the district's warm palette — so a concrete kerb came back as a
red-brown block ringing every slab. It is 150 mm high. You step over it.

---

## THE LESSON

**ASK WHAT THE THING RESTS ON.** Every one of these was a correct-looking fix to a visible
object whose foundation nobody re-checked: a crossing that borrowed a width it never read, a
bridge whose road stopped underneath it, a deck sized to a road that had moved, a slab named
after the tank it replaced.

The instrument that found all four was the same one: **look at the picture, and measure the
seam on the built grid rather than believing what the module declares.**
