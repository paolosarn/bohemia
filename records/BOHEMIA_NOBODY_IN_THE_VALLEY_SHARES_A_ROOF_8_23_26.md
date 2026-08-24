# NOBODY IN THE VALLEY SHARES A ROOF (8/23/26, PEOPLE lane)

## THIS IS A MEASUREMENT AND A CAUSE, HANDED TO THE LANE THAT OWNS THE FIX.
## It is not fixed here, and the reason it is not fixed here is at the bottom.
## It is also NOT NECESSARILY A BUG: see WHAT THIS DOES NOT CLAIM.

---

## THE NUMBERS

Measured on the real surface (the alpha's RUN tab), across the whole valley
roster, using the FACTIONS lane's own call pattern
(`ctValleyRoster()`, `ctCell()`, `ctVKey`):

```
people                       298
foci built                   564   (home 298, work 254, faction 12)
foci that are SINGLETONS     522   (home 298, work 220, faction 4)
```

**Every single one of the 298 home foci has exactly one member.** A focus of one
produces no ties, so:

```
pairs sampled (roster)       780  ->  8 know each other   (1.0%)
pairs who LIVE WITHIN 2 CELLS 60  ->  0 know each other   (0.0%)
```

People who sleep two cells apart are strangers to each other.

## THE CAUSE, EXACTLY

`bohemia_ties.fociOf()` builds the home focus from the declared seat, and its own
comment (8/15) explains why it prefers that over parsing the id:

> "on the CITY's roster they do not [agree]: its adapter mints a unique id per
> person, so every resident parsed out as the sole occupant of their own house and
> the home focus was empty on the surface he actually walks. **The declared seat
> is the fact; the id is a spelling of it. Read the fact.**"

The reader was fixed. The writer was not. In `ctAgent()`:

```js
home:{ building: (p.home ? p.home[0]+','+p.home[1] : h-1), bedRoom:0 }
```

**The declared building is the person's own fine-grid cell.** Every person stands
on a different cell, so every building id is unique, so every household is a
household of one. The 8/15 fix taught the reader to prefer a field whose value can
never be shared, and changed nothing.

## WHAT IT COSTS, AND IT IS FOUR THINGS ON ONE GAP

1. **Three of his sixteen dossier conditions are still unreachable.** That is what
   `bohemia_ties` was built for on 8/12, in its own header: MOB ("a third person
   supplies the name, and that person is vouching"), REMNANTS ("you hear another
   soldier use it"), COLORFUL ("introduced onward to three people"). All three
   need a third party. With a graph this sparse there usually is not one.
2. **`seatLineOf()` degrades to a number.** It is written to say
   `HOUSE 4 · THIRD OF FIVE`; measured on a real city person it returns
   **`HOUSE 901`**, because there is no household to count.
3. **`workLineOf()` degrades too**, it returns **`12:12, WEST`**, printing the
   raw neighbourhood key where a place name belongs. Same shape: a coordinate
   handed where an identity was expected.
4. **News cannot travel along relationships.** This lane's gossip currently moves
   between any two people standing together for long enough, strangers included.
   Gating it on "they actually know each other" is the obviously right deepening
   and it was the plan for this turn. **Measured first: it would have reduced
   gossip to zero.** That measurement is the only reason it was not shipped.

## WHAT THIS DOES NOT CLAIM

**It does not claim the world is wrong.** Ten years after the crash, a valley of
people squatting alone is entirely plausible worldbuilding, and if that is the
canon then the home focus SHOULD be empty and the ties module should lean on work
and faction instead.

What is certainly true is narrower and still worth acting on: **the adapter
declares a value that cannot be shared, so the question was never actually asked.**
Whether households exist is a ruling; right now the code answers "no" by accident
rather than by decision.

## WHY THIS LANE DID NOT FIX IT

- `ctAgent()` and the valley roster are the **FACTIONS lane's** (the
  `__CITY_STANDING__` block). `bohemia_ties` is theirs too, by its header.
- The fix needs a **building identity the world does not carry**: measured, a city
  cell holds only `{g, s, walk, q}`, no mass or structure id, so "same building"
  would have to be flood-filled or invented.
- And "do people share dwellings" is **worldbuilding**, not plumbing.

Faking a household to make my own gossip feature light up would have been building
on a number I made up. The measurement is the deliverable.

## WHAT THIS LANE DID SHIP INSTEAD

The one part of this that was ours and needed no household at all: **the card was
printing raw fine-grid coordinates at him.**

```
before   LIVES   HERE, 6205 6269
after    LIVES   Right about here          (and "south of here" from 25 cells away)
```

A coordinate is not an address; it is the variable, shown. It now uses this lane's
own `ctWhereWord()`, the same vocabulary the missing-persons witness already
answers in, so the card and the witness say it one way, and the day that phrasing
improves, both improve. `seatLineOf()` would say it better still once a household
exists; the gate's comment says so rather than papering over it.

The gate asserts the RULE, not the row: **no row on that card may print a bare
fine-grid pair.** A mutation putting the coordinates back turns 3 red.

## THE MACHINE

| file | what |
|---|---|
| `tools/bohemia_city_memory_patch.py` | the LIVES row, in words |
| `gates/city_memory_gate.js` | 31 -> 34 claims |

## FOR WHOEVER PICKS THE FINDING UP

The cheapest honest first step is not code, it is a ruling: **do people in this
valley live together?** If yes, the adapter needs a real building id (the
population module assigns homes; a shared house index at that layer is cheaper
than a flood-fill at the surface). If no, `bohemia_ties` should say so in its
header and stop counting a focus that is structurally empty, and the three dossier
conditions need a different route to their third party.
