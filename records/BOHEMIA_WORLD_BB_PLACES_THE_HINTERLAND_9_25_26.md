# FOURTEEN PLACES, THREE SHELVES (9/25/26, WORLD lane)

Row `[bb places]` WHAT-A-PLACE-OFFERS-WHEN-YOU-ARRIVE. Rule 33 school, one page.
**Nothing shipped to a play surface** — this is school; the rows come after.

---

## 1. THE QUESTION

Rule 33 makes the map the game's spine and says **places are destinations**. A
destination is only a destination if arriving there gets you something you cannot
get elsewhere. So: what does a place in our valley offer when you arrive?

## 2. HOW BATTLE BROTHERS DOES IT

Researched rather than remembered. Every BB settlement has **attached locations**
— a mine, wheat fields, a goat pen, an arrow-maker's shed — sited around it on
the map, and they *"influence heavily the available goods, services and
recruitment options of that settlement."*

Three mechanisms, precisely:

1. **The hinterland decides the stock.** A settlement with an attached location
   that produces an item has that item, and **unusually cheap**.
2. **The hinterland decides the price level.** Base price plus **3% per attached
   location**; settlements carry 3 to 8 of them, so 9–24%.
3. **The hinterland decides who you can hire.** Some attached locations attract
   recruits of particular backgrounds.

The load-bearing idea underneath all three: **a place is a function of the ground
around it.** Two towns of the same size are different because their hinterland is
different, and that is why you choose one over the other.

## 3. WHAT WE HAVE, MEASURED

### THE GOOD NEWS FIRST: WE ALREADY BUILT THE ATTACHED LOCATIONS

`bohemia_towns.minesOf` flood-fills runs of **solar, dam and battery** and
attributes each site to whoever holds that ground. It is careful work — a *site*
is a building, not a cell, which is why 253 solar cells come back as one array and
Hoover comes back as one dam of four cells. Seed 1337:

```
4 sites, 308 generating cells
  solar   50 cells   held by Cartel
  dam      4 cells   held by Mob          (this is Hoover)
  solar  253 cells   held by Homeless
  battery  1 cell    held by Homeless
```

### *** AND THE FINDING THAT PROVES US WRONG ***

```
14 PLACES IN THE VALLEY.  3 DISTINCT SHELVES.

  5 fortresses  sell  water food salvage meds fuel power iodine
                      sterilewater lidocaine tweezers antibiotics
  4 towns       sell  water food salvage meds fuel power iodine sterilewater
  5 camps       sell  water food salvage meds
```

`goodsFor(tier, goods)` returns `all.slice(0, n)`. **A shelf is a function of tier
alone**, and tier comes off his act1_power ladder. So every camp in the valley
sells the same four things, every town the same eight, every fortress the same
eleven. **A place differs from the tier above it and is identical to its own
tier.** Depth is the only axis a place has; it cannot express *which* goods.

That is exactly the thing BB's attached locations solve, and we have the
ingredients and have never connected them.

### AND THE INVERSION THAT MAKES IT VIVID

```
HOMELESS   rank 13 of 14 on his own power ladder,  tier CAMP,  shelf of FOUR
           holds 254 of the valley's 308 generating cells
           makes 2 batteries a day, more than anybody

REMNANTS / NETWORK / CARAVANS   fortresses, shelf of ELEVEN
           hold no hinterland at all
```

**ONE OF THE POOREST PLACES IN LAS VEGAS MAKES THE MOST MONEY AND SELLS THE
LEAST**, and the deepest shelves in the valley stand on nothing. Nobody put that
there; it fell out of his own power ladder meeting the real map, and it is the
best argument for this row that exists.

*** AND MY FIRST DRAFT OF THIS PAGE SAID "rank 14 of 14" AND THE GATE CAUGHT IT.
*** Homeless is rank **13**; Colorful is 14. The finding does not move — still a
camp, still the shortest shelf, still 254 of 308 cells — but I had rounded a fact
about his own canon in my own favour, and the checker said so before he read it.
That is the fourth round running that one of my claims was wrong before the game
was, and the first time a gate of mine stopped it reaching him.

### AND THE SHELF HAS NEVER ASKED

`mktShelf` does not mention `minesOf`, `minesFor`, `MAKES` or `.sites`. The
hinterland has three callers in the walked city and none of them is the shop.

## 4. *** THE PART OF BATTLE BROTHERS WE MAY NOT TAKE ***

**BB's price mechanism is forbidden here, and this lane already learned that the
expensive way.** On 9/15 I built a stranger surcharge off ECONOMY Q38; it made the
first bag of rice cost two days' work, RICE CLOCK went red and was right, and his
ruling came back: *the surcharge is DEAD; EVERYTHING COSTS ONE holds everywhere
for everyone; the spread lives in ACCESS and DISTANCE.*

So of BB's three mechanisms:

| BB | here |
|---|---|
| the hinterland makes an item **cheap** | **forbidden.** One battery, everywhere, for everyone |
| price rises 3% per attached location | **forbidden.** Never a number above one |
| the hinterland decides **what is stocked at all** | **this is ours**, and it is already how this game says a place is poor |
| the hinterland attracts certain **recruits** | not mine — routed to PEOPLE |

That is not a compromise. A camp's short shelf is *already* the access mechanism
his ruling names, so making the hinterland change **what is on the shelf** is the
same lesson BB teaches, expressed in the only currency he allows.

## 5. THE SHAPE FOR US, IN PLAIN WORDS

**A place's shelf is its tier's depth PLUS what its own ground makes.**

- Tier still sets how *deep* the shelf goes. That is built and it is his.
- The hinterland sets what is on it **that nobody else has**. The Homeless camp
  holds 254 cells of solar and a battery plant, so the Homeless camp sells
  **power** — at one battery, like everything — when four other camps cannot.
- Nothing is priced differently. Nothing is tuned. The list is derived from
  `minesOf`, which is derived from the map.

One line of consequence: **it gives the map a reason.** Today the only reason to
walk to a fortress is that it stocks more. After this, the reason to walk
somewhere is that it is the place that has the thing.

## 6. WHAT MOVES HERE THAT BATTLE BROTHERS' PICTURE DOES NOT (rule 33g)

He said it plainly: *"Battle Brothers is just a bunch of pictures... we can do
more and put more life into it."*

BB draws a settlement as **one still illustration you read**, and the attached
locations are icons on a map. Ours is **a street you arrive on**, so the same fact
is a thing you watch instead of a thing you read:

- the panel rows **track the sun** across the day;
- the cable from the array into the camp **sways**;
- and at night **this block is lit while the valley around it is dark** — which is
  the same sentence the shelf would have told you, told without a word.

That last one is not a wish. It is the lit-core measurement from last round: the
tell is the light, and a place that holds power should be the place that has some.

## 7. THE COOK

**THE CAMP THAT HOLDS THE POWER.**
`slices/vote/WORLD_THE_CAMP_THAT_HOLDS_THE_POWER.png`, at game scale (rule 32f).

The edge where the Homeless camp meets the array it lives off. **AH-01's one wrong
thing: the array is swept and the camp is not.** The rows are square and the dirt
between them is raked; the shelters are patched with whatever came to hand.
Somebody maintains the machine better than they live, and nothing says why.

His 9/23 sand ruling is held in the tool as a refusal, not just obeyed once: every
ground value must sit in the walked city's own `#6e6045` on hue **and** on
lightness.

**THREE CUTS, AND I AM CALLING THIS ONE LEGIBLE RATHER THAN BEAUTIFUL.** The first
read as three painted stripes and five cardboard boxes. The second gave the array
its real grid — panel divisions, legs, the shadow under the rake — and then **made
the huts into barcodes**, which is this lane's ring-road mistake in new clothes: I
made the texture the loudest thing on the surface when TG-05 says the breaks must
be quiet. The third quietened the ribs to one value step on the roof only. It now
reads as what it is, and it is a clear diagram of the finding rather than a
beautiful frame. STOP PRODUCING says a fourth version means I already failed, so
I stopped and said so instead of fixing it again.

## 8. THE GATES

```
BB PLACES   new, 41/0
```

It pins the finding (14 places / 3 shelves), the inversion, the fact that the
shelf never asks — and **his price ruling**, so that nobody imports BB's
hinterland discount later without meeting the 9/15 record first.

## 9. WHERE HE FINDS IT

**Tab: VOTE, in the alpha.** One row, a picture: **THE CAMP THAT HOLDS THE
POWER**.

## 10. ROUTED

**THE ROW THIS SCHOOL ASKS FOR, for the coordinator to write:** *the shelf reads
its own hinterland.* `minesOf` is built, owned and measured; `mktShelf` is the one
caller it needs. Tier keeps setting depth; the hinterland adds what is local.
Never a price.

**TO PEOPLE:** BB's attached locations also decide **who turns up to be hired**. A
place that holds a solar array should have people who know panels. That is your
lane, not mine.

**TO LIFE+CITY:** the buildings on a place's block are its services in the shape
this row names (the lit shop, the shed, the pump). What I measured is that today
the only place-bound service in the game is the shelf.

**TO DYNASTY:** the hinterland is a per-act ledger waiting to happen. Who held the
arrays in act 1 is exactly the kind of thing act 3 should be derived from, and
`minesOf` already attributes it.
