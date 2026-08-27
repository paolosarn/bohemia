# THE BRIDGE WAS TWO THIRDS THE WIDTH OF ITS OWN ROAD
# 8/27/26, WORLD lane. Continuing STREETS-LEGO (Paolo 8/25 PLAYTEST DISPATCH item 4).

## THE NUMBER

| | before | after |
|---|---|---|
| broken seams, whole valley | 270 | **206** |
| where two different road classes meet | 263 | **166** |
| arterial ↔ freeway | **196** | **0** |
| arterial ↔ arterial | 0 | 0 |

**196 of the valley's 270 remaining broken seams were one thing**, and it was not what
it was filed as.

## THE CONTRACT WAS BLIND TO BRIDGES

An arterial crossing a freeway does not stop at the freeway. It **rides over on a
deck**, and a car drives along that deck. The deck's tiles are kind `overhead` — and
the street contract counted `drive`, `marking` and `gate` only. So every one of those
crossings read as **a street that simply ended**: 97 seams of ONE_SIDE and 99 of
OFFSET.

The kit has treated an overhead as a drive **conductor** since August, for exactly this
reason. The contract was the one place that did not.

## AND THEN THE REAL DEFECT CAME OUT FROM UNDER IT

With the deck counted, the seams were still broken — because the deck was the wrong
size:

    var half = 11;   // "~17 m of deck, a real overpass width"

It *was* a real overpass width, for the arterial as it stood the day it was typed. The
arterial's cross-section was rebuilt to real Clark County numbers on 8/26 and **this
number did not move.** Measured: the deck spans **23 tiles across a roadway that spans
35**, on all 116 freeway cells that carry one. An arterial ran up to the freeway 35
tiles wide, climbed onto a 23-tile bridge, and came off 35 tiles wide again.

**This is the fourth time this month a constant moved and its dependent stayed
behind** — `BOX` (the junction box, which cost a whole fix its picture), `POCKET`, the
pole offsets, and now this. So it is not a constant any more. **The width of a bridge
is a fact about the street**, and `bohemia_arterial.js` exports it.

## THREE MORE THINGS UNDERNEATH THAT

**THE BRIDGE ENDED IN MID-AIR.** Paolo 8/16, on this very module: *"you gotta
recognize when the freeway is two grids wide two tiles wide that it has to WORK
TOGETHER."* `bohemia_strip.js` took that ruling on 8/18 and wired `spanThrough`. **The
fix never travelled here.** An interstate is two cells abreast, and the deck was built
on whichever carriageway touched the arterial and simply stopped at the cell boundary —
a bridge over an eight-lane freeway that stops half way across. Invisible in any single
cell, which is how it survived a month.

**THE DECK AXIS CAME FROM THE WRONG QUESTION.** It was derived from `same` — the
family cells beside me — and at a corner, a merge, or a cell whose run length TIES,
`same` is L-shaped, so both axes are true and the branch chose *no* axis. Those cells
built no deck at all. It reads `streets` now: the axis the freeway actually runs on.

**A TIE WAS NOT AN ANSWER AND EVERY CALLER TURNED IT INTO ONE.** `roadAxis` returned
`''` for "genuinely a crossing", and every single caller wrote `roadAxis(...)||'ns'`.
So an ambiguous cell did not become a crossing — **it became a north-south road by
default.** That is the identical shape as the arterial bug fixed on 8/26. It polls its
same-ribbon neighbours now, one level deep, and only gives up if they cannot agree
either.

## AND THE BRIDGE WAS TAN, WITH DARK BLOCKS ON IT

Photographed it the moment the width was right. The deck came back **the colour of a
gravel drive**, with a row of **dark asphalt rectangles** where the lane line should
be. Neither was a colour anybody chose:

- the deck's kind is `overhead`, which fell through the pool table's else branch to
  `hyard` — the decomposed-granite **yard** pool
- its stripe's kind is `marking`, which routes to `street` — **asphalt, background
  included**

Both were correct table lookups. Both were nonsense on a bridge. A deck, its parapet
and its paint are poured concrete, so they take the walk's concrete pool and are told
apart by their own palette entries.

**A LEGEND NAME IS A ROUTING KEY IN THIS ENGINE, NOT A LABEL.** Second time this month
a name has silently chosen a renderer — the first was concrete falling through to the
approved house-roof pool and putting brickwork on a dam.

## AND THE PARAPET TAUGHT THE SINGLE-LAYER LESSON AGAIN

A parapet **is** solid — you cannot walk off the side of a bridge. Declared `structure`,
roadcell_gate went straight red: the corridor's largest traversable space fell from
14,133 tiles to 3,959, because a parapet running the length of the deck **severed the
freeway underneath it**. This grid is ONE LAYER. The deck already solves that by being
an overhead you pass under; its own edge is part of the same object.

It also has to sit *inside* the deck's span, not two tiles beyond it — drawn outside, it
made the bridge wider than the road it carries and the cross-class count went 166 → 263
in a single edit.

## WHAT IS LEFT, NAMED, AND WHY IT IS NOT MINE TO FIX

Counting the deck closed 196 seams and made **40 freeway-to-freeway breaks visible**
that were always there. Sampled: `freeway(13,13)` runs N/S with a crossing east and
west; `freeway(14,13)` beside it runs E/W with a crossing south. **Two freeway cells
running perpendicular to each other and meeting.** That is a freeway-on-freeway
crossing, and this valley has a district for exactly that: `interchange`.

Where the overmap laid two interstates across each other without marking the junction,
**no piece can make the seam agree** — the two cells are honestly building two
different roads. MAP LAW: Claude never designs map layouts, plumbing only. So it is
counted, named and left for a ruling rather than papered over with a special case.

## THE GATE

`gates/street_contract_gate.js`, 17 checks, still green, with the ceilings ratcheted
down: cross-class 263 → **166**, and a named `freeway: 40` beside the existing
`interchange: 3` and `strip: 4`. Arterial, rail and strip-to-strip stay at **zero with
no allowance** — Paolo's wording is "fails on a single mismatched edge" and that is what
the road he walks is held to.
