# A FLAT THING READS FLAT (9/13/26, LIFE + CITY lane)
## VAMILY row `[freeway reads]` — the lane's first job under rule 14, THE FIVE MINUTES

> **Paolo 9/13:** *"I thought something was an overpass over a freeway, of a regular
> street crossing over the freeway section, and it was just it."*

**He was right, and the lie was one word in one test.**

| | drawn | genuinely crossed | **false** |
|---|---|---|---|
| lifted decks, before | 198 | 168 | **30** |
| lifted decks, after | 168 | 168 | **0** |
| dipping streets, before | 201 | 172 | **29** |
| dipping streets, after | 172 | 172 | **0** |

---

## THE BUG

`overpassAt` asked whether an ordinary street was **next to** the cell. So a freeway
that merely **runs alongside** a street has a street neighbour down its entire length —
and was jacked onto a deck, `TH*0.55` up, with a cast shadow painted under it, while
being perfectly flat ground. The same test from the other side sank any street running
parallel to a freeway into a trough for its whole run.

Thirty pieces of flat ground wearing a bridge. That is exactly the thing he described.

## THE FIRST NUMBER WAS TOO GOOD, AND IT WAS WRONG

My first test asked: *is there an ordinary road on the opposite side of this cell?* That
said **194 of 198 decks were false — 98%**. A far better headline, and not true.

**The freeway is two cells wide** — 164 of the 168 bands. A genuine crossing therefore
never puts a road against the deck cell at all; the road is on the far side of the
*band*. Stepping across the whole band instead gave the real number: **30 false, not
194.**

I caught it only because the first result was suspiciously clean and I checked before
writing it down. Last round I did not check, and shipped a headline that was wrong.

## THE FIX

The test is now the crossing itself: step across the freeway band and ask whether the
ordinary street is there on **both** far sides. That is what "a street crosses the
freeway" means, and nothing else is. The dip chains to a real crossing the same way —
a street dips because it is about to go *under* something, so the street has to pick up
again on the far side.

**It removes no overpass he asked for**, which is the point:

> **Paolo 8/15:** *"there has to be an intersection of when the freeway meets the street
> you gotta look decent like you gotta be like an underpass an overpass or something
> most of the time probably a overpass though ... and then the streets right before that
> intersection like they gotta look like they dip a little bit."*

All 168 real decks and all 172 real dips stand exactly as they did. Only the flat ground
that was pretending stops pretending.

## THE COST, SAID BEFORE THE SAVING

The new test walks the band, so it is dearer than four neighbour lookups. Measured over
the whole 96×96 map: **old 2.60 ms, new 4.26 ms** — I *added* 1.66 ms of worst-case
frame work against a 48 ms frame.

Then cached. Which cells carry a deck is a pure function of the district map, and every
write to `t.district` in the file happens during **map generation**, never at runtime —
the builder places buildings on plots, it does not re-zone a cell. Cached, it measures
**2.56 ms**, so the corrected test costs what the broken one did. The cache is thrown
away if the valley is rerolled, which makes a new `om`.

## WHERE HE SAW IT, MEASURED RATHER THAN ASSUMED

Rule 14 says the first five minutes is the only measure, so I asked whether he could
even reach a freeway. Breadth-first over ground he can actually stand on, from the
demo's door:

    the door            fine (6205,6271) = overmap (48,48), a suburb
    nearest freeway     324 walked cells
    at MIN_PER_CELL     27.2 MINUTES on foot

He cannot have walked to it inside the five. **This is a city-mode break** — and city
mode is the only caller of `overpassAt` in the whole file. That also means the row's own
brief, which points at "the street renderer's layering", points at the wrong renderer.

*(That measurement cost me a coordinate-system bug first: `hx,hy` are fine street cells
and `om.at` takes overmap cells. The repo's own conversion is `om.at(floor(hx/FN), …)`
with FN=128. My first pass mixed them and reported "no freeway reachable, 1 cell of
ground".)*

## THE GATE, AND THE LEG THAT STOPS THE CHEAP FIX

`gates/a_flat_thing_reads_flat_gate.js`, **9 pass / 0 fail**, registered in the suite.
It judges the map **independently** — it walks the band itself rather than asking
`overpassAt` whether `overpassAt` was right.

| mutation | expected | result |
|---|---|---|
| `&&` back to `\|\|` (the neighbour test — his bug) | RED | **A1 + B1 red, 303 decks drawn, 135 false** |
| make `overpassAt` always return 0 | RED | **B1–B4 red** |

The second one matters most: deleting every overpass makes "zero false decks" trivially
true. **B3 exists so that buying the honesty by deleting his feature reads as red**, not
green.

## WHAT I DID NOT MANAGE

**I have strong numbers and I did not get a before/after picture at a named false deck.**
Three attempts failed the same way: assigning `TW`, `city.x/city.y` or `MODE` does not
survive the game's own loop, which recomputes them every frame — so I get one frame
against a camera state the game never has, repainted before the shutter. At whole-map
zoom the lift is about one pixel, so that view cannot show it either.

The honest position is that this fix is verified by measurement and mutation, not by
eye. The next round that needs a picture should drive the camera the way a player does
— a real drag and a real pinch — not by assignment. **That is the same lesson as the
zoom, and I have now paid for it twice.**

---

    decks   198 / 168 / 30 false   ->   168 / 168 / 0
    dips    201 / 172 / 29 false   ->   172 / 172 / 0
    cost    2.60 ms before, 4.26 ms uncached, 2.56 ms cached
    gate    a_flat_thing_reads_flat_gate.js  9/0, mutation-tested two ways
    demo    NOT re-cut (rule 14a: only RUN cuts the demo)
