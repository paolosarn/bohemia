# A PLACE IS A BLOCK, AND THE VALLEY HAS ONE PUMP (9/27/26, WORLD lane)

**Rule 33h**, both halves, done the same round: the **CUT** ("the asks as a text
stream") and the **REBUILD** ("a place is a block with its buildings as
services"). **Nothing shipped to a play surface** — rule 18 holds.

**No board row exists for this.** It comes from THE CUT LINE on the front page
and the REVAMP LIST, both of which name WORLD by hand. Rule 10 says only the
coordinator adds rows, so I did the work the list assigns and did not write
myself a line.

---

## 1. THE CUT, MEASURED BEFORE ANYTHING MOVED

> **THE ASKS AS A TEXT STREAM (QUESTS, WORLD, WORDS):** notices, the night card,
> offer cards, the spoken ask as a line on screen. Rebuilt as contracts and
> events from people in places.

`engine/bohemia_notice.js` — **cut this same round under rule 33h and now in
`archive/`, no longer live** — **was** the ask as a text stream, entirely: a
disconnection notice, a clearance, a notice to quit, a covenant violation, an
emergency alert, a price list. Six items, **all six voted down** ("So boring",
"Boring asfff"), which became rule 29.

**Measured before cutting, because a careless cut reds other people's gates:**

```
callers in the game (slices/BOHEMIA_CITY_WORLD.html)   ZERO
every reference                                        a gate, or its own cook tool
first_notice_gate.js                                   exists only to hold it
suburb_walls / full_shelves / block_strikes            import it and use exactly
                                                       ONE maker each
```

So: the module, its cook tool and its gate went to `archive/` with a
superseded-registry entry saying what and why. The suite no longer registers the
retired gate. The three other gates lost **one section each** — covenant,
priceList, toQuit — and kept everything else, which is real mechanics:

```
SUBURB WALLS   22/0    FULL SHELVES   25/0    BLOCK STRIKES   31/0
```

Nothing deleted. The six vote pages stay where they are, consumed.

**What is worth carrying into contracts and events** is the idea, not the prose:
`unanswered()` made every line declare **who would answer it** and asked the live
world, and the count dropped when a body came back. That is in the 9/21 record.

## 2. THE REBUILD: A SERVICE IS PRESENT BECAUSE A BUILDING IS STANDING THERE

`engine/bohemia_place.js`. The four the revamp list names, in its order: **shop,
shed, pump, fortress.**

This is the answer to what `[bb places]` measured last round: a shelf is a
function of **tier alone**, so fourteen places had three shelves and every camp
sold the same four things. Now a place offers what is **on** it.

- A place is a **block**, off `bohemia_towns.blocksOf` — not redrawn here.
- A service comes from a **district the overmap already generates**. This file
  reads the map the way `[beltway placed]` read a ring the map was already
  drawing; it adds no building type.
- **Never a price.** The module carries no number of two digits and no currency
  word. `EVERYTHING COSTS ONE`, and his 9/15 ruling after this lane built a
  stranger surcharge put the spread in **access**. BB's hinterland changes what
  things **cost**; ours changes **what is there**.
- **`STOCKS` ships empty.** What a shop, a shed, a pump and a fortress *give* is
  his.

## 3. *** THE CENSUS IS THE FINDING ***

```
467 blocks in the valley
252 offer something          215 OFFER NOTHING AT ALL
249 shops   12 sheds   7 fortresses   *** 1 PUMP ***
236 blocks carry exactly one service.  ONE block carries three.
```

**Battle Brothers settlements carry three to eight attached locations each. Ours
carry one or none.** And the valley is almost all shops: 249 of them against one
pump, because `commercial` is a common district and `pumpstation` is a single
cell.

**THE WHOLE VALLEY DRINKS THROUGH ONE BLOCK.**

### and the inversion survives the rebuild

The **Homeless block** — holding 254 of the valley's 308 generating cells, more
output than anybody — **offers nothing when you stand on it.** The place that
makes the most power in Las Vegas has no service on it at all.

## 4. THE COOK: THE ONLY PUMP

`slices/vote/WORLD_THE_ONLY_PUMP.png`, at game scale (rule 32f). Not a category
and not a diagram: **the one block in Las Vegas where the water comes out.**

Two pump skids on plinths, the discharge headers standing off the yard, the
cabinet, the fence on the lot line, the gate shut.

**AH-01's one wrong thing: there is one path worn into the yard and it goes to
the CABINET, not to the pumps.** Somebody comes here often and only ever touches
the switch. Nothing says why.

**Rule 33g, what moves that BB's picture does not:** BB draws attached locations
as icons beside a name. This is a yard you walk onto — the shafts turn when it is
running, the header shivers, and when the block loses its circuit it stops and
the valley's only water stops with it.

**AND THE THIRD TIME I HAVE MADE A TEXTURE THE LOUDEST THING ON A SURFACE.** The
ring road's joints read as a cattle grid, the camp's corrugation read as a
barcode, and this yard's slab joints read as bathroom tiling. TG-05 says a flat
surface reads by what breaks it **and the breaks must be quiet** — one value step,
every time. It is written into the tool now, because saying it once clearly has
not been enough.

## 5. THE GATES

```
PLACES ARE BLOCKS   new, 31/0
```

**AND IT CAUGHT ITS OWN AUTHOR TWICE.**

1. **`garage` was in the shed list and the overmap generates no garage
   district.** I had invented a building type in the one file whose entire claim
   is that it invents none. The check that caught it is the one I wrote for
   exactly that.
2. The cut-check demanded the three gates never **mention** the notice module —
   but a cut note naming what was cut is exactly right, so all three failed for
   doing the correct thing. The check now tests for an **import**.

## 6. WHERE HE FINDS IT

**Tab: VOTE, in the alpha.** One row, a picture: **THE ONLY PUMP**.

## 7. ROUTED

**TO THE COORDINATOR:** there is **no board row** for either half of this. The
cut line and the revamp list assign it to WORLD by hand. A row for the next step
would be *the shelf and the place are the same question* — `mktShelf` still
answers off tier while `bohemia_place` answers off the ground, and two answers to
"what can I get here" is the drift this repo keeps paying for.

**TO LIFE+CITY**, the other name on the PLACES line: the four services are
readable now; what a place **looks** like when you arrive is yours.

**TO QUESTS and WORDS**, the other names on the cut: my third of the text stream
is archived. The people-in-places half is yours.

**STILL OPEN, named again:** 215 blocks offer nothing, the one pump is a single
point of failure for the whole valley, and the block that makes the most power
offers nothing at all.
