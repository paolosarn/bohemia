# BOHEMIA — NOBODY IN THE VALLEY SHARES A ROOF, AND IT IS NOT THE FACTION LANE'S TO FIX (8/19/26, FACTIONS lane)

**For the WORLD / PEOPLE lanes. This is a measurement and a dependency, not a
request and not a patch. Nothing in `bohemia_population.js` was touched.**

## 1. WHAT I MEASURED, AND WHY I WAS LOOKING

The faction stack (introductions → bargain → wall → commitment → claim → favour →
debt → the cost of taking a side) is built on **shared settings**: two people are
acquainted because they share a **roof**, a **job site**, or an **outfit**
(Feld 1981, foci of activity). Word travels between outfits down those ties.

Fixing a key-collision bug this turn revealed that **no outfit in the valley hears
anything**, so I went looking for why. Measured on the real page:

| | |
|---|---|
| people in the valley | **298** |
| populated neighbourhoods | 139 |
| distinct home coordinates | **298** |
| household size distribution | **`{1: 298}`** |
| people sharing a roof with anybody | **0** |

**Every person in Las Vegas lives alone.**

## 2. WHERE IT COMES FROM — AND MY FIRST READ WAS WRONG

I first blamed the city's person adapter (`ctAgent`), which sets
`home.building` from the person's exact fine-grid position. That was wrong, and
the measurement is what corrected it: **the underlying `pplPeople()` records
already carry 298 distinct `home` coordinates.** The adapter is faithfully
reflecting one-person-per-house; it is not creating it.

Sample records, straight from `pplPeople`:

```
{ id: "8:1:0",  home: [4264, 790]  }
{ id: "15:1:0", home: [7866, 1002] }
{ id: "20:1:0", home: [10367, 678] }
{ id: "6:2:0",  home: [3212, 1262] }
```

The last id segment is `0` for every person sampled.

And `bohemia_population.js` declares:

```js
var HOUSEHOLD_MEAN = 2.2;   // 1p 30% / 2p 35% / 3p 20% / ...
```

**So the module's own stated intent is 2.2 people per household, and what reaches
the walked surface is 1.0.** I have not chased which step flattens it — that is
inside a module this lane does not own, and the WORLD lane shipped into it twice
today.

## 3. WHAT IT COSTS, CONCRETELY

The `home` focus is **one of three** dimensions of the acquaintance graph, and on
the walked surface it can never fire — for anybody, affiliated or not. That is a
third of the social substrate, dead by construction.

Downstream, measured:

- 32 affiliated people live in **32 different buildings**
- **0** shared settings anywhere join two named outfits
- so `whoHears` returns **empty for all 11 outfits**, and the commitment cost, the
  tertius broker position and the word-of-mouth rows are all correct and **dormant**

Only the **work** focus can currently produce a tie at all.

## 4. WHAT I DID NOT DO

**I did not widen what counts as a shared setting to make my own systems look
alive.** That manufactures exactly the fictional ties the key fix deleted this
turn — the same bug, chosen on purpose.

**I did not edit `bohemia_population.js`.** ONE SYSTEM, ONE SESSION, and that
module had two commits land in it today from another lane.

**I am not asking for a number.** Whether households should be shared, and how big,
is that lane's call and Paolo's world. This is the dependency written down so it
is visible, with the numbers attached.

## 5. THE ONE LINE THAT MATTERS

> **If people ever share roofs, the faction lane's word-of-mouth, broker position
> and side-cost systems come alive with no further work — they are wired, gated
> and waiting on exactly this one fact.**

Nothing needs to be built for that to happen. It is a substrate change upstream,
and everything downstream already reads it.

Measured by: `gates/commitment_gate.js` part H (consistency, holds in both worlds)
Related: `laws/BOHEMIA_ADDENDUM_TWO_HUNDRED_PEOPLE_SEVENTEEN_NAMES_8_19_26.md`
