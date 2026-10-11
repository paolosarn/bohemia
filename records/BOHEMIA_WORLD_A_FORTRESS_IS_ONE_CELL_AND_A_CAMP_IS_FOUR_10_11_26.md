# A FORTRESS IS ONE CELL AND A CAMP IS FOUR

WORLD lane (chat 02), 10/11/26. A PAGE, not a round: WORLD is held (rule 88) and
sweep AI's re-affirmation says **"a page is still a ship for a held lane."** No
code, no gate, no VOTE sheet, nothing into the demo.

---

## 0. WHY THIS PAGE AND NOT ANOTHER

Rule 102 landed LOCKED (Paolo 10/10): *"the settlements are squeezing out of the
map, getting smaller than they should for no purpose; if a settlement is a 2 by 2
block it should just be large on the map like that."*

Its clause (a): **"on the map, settlements, roads, blocks and parties are drawn at
their true world size at every zoom; a settlement of two blocks by two blocks
covers two blocks by two blocks."**

**RUN owns drawing it.** But RUN cannot draw a settlement at its true size unless
the data says what size it is, and the data is this lane's. So the one question
worth a page while held is: **does a settlement in this valley have a size at
all?**

---

## 1. **IT DOES NOT. ZERO OF 280.**

Measured over **twenty rolled valleys, 280 settlements**:

| what a settlement record carries | |
|---|---|
| `faction, x, y, kind, why, tier, rank, power, act, seatRuled, draft` | |
| **a width, a height, a block count or a footprint** | **0 of 280** |

A settlement is **one point and a word**. The word is its tier: camp, fortress or
town. Rule 102(a) asks for "two blocks by two blocks" and nothing in the valley
can answer in blocks.

---

## 2. **AND THE ONLY STAND-IN AVAILABLE INVERTS THE TIERS**

If RUN had to derive a footprint today, the one thing it could use is the run of
same-district map cells the settlement sits in. Flood-filled from each
settlement's own cell, same twenty valleys:

| tier | n | mean cells | median | on a single cell | max |
|---|---|---|---|---|---|
| **camp** | 100 | **5.2** | **4** | 25% | 27 |
| town | 80 | 4.0 | 1 | 56% | 19 |
| **fortress** | 100 | **3.9** | **1** | **69%** | 16 |

**The camp is the biggest tier and the fortress is the smallest, on the mean and
on the median both.** Sixty-nine per cent of fortresses sit on exactly one cell.

That is checked two ways on purpose: a median of 1 against a max of 16 is a skewed
shape, so the median alone could mislead. The mean says the same thing. The
inversion is real.

**And half of all settlements, 50%, sit on a single cell.** Drawn at true world
size today, half the valley's places would be one block. That is his complaint
reached from the other end: they are not squeezing out of the map because the
drawing shrinks them, they are small because **the data never said they were
big.**

---

## 3. WHY THE INVERSION HAPPENS, AND WHY IT IS NOT A BUG TO PATCH

It is not a defect in the generator. A camp sits out in a wash or a desert, and a
wash and a desert are large unbroken districts, so the flood fill runs a long way.
A fortress sits on a dense, finely-cut part of the city where its own district is
one or two cells wide. **The fill is measuring the district it stands in, not the
place.** It was never a footprint and reading it as one would be the same mistake
this lane made with the legend count on 10/9: a true number that answers a
different question.

So the answer is not a better derivation. **A settlement needs a size of its own.**

---

## 4. WHAT THIS MAKES OF THE ROW

The open row **`[the three sizes of place]`** (CAMPS-TOWNS-AND-FORTRESSES-ON-THE-MAP)
is now the thing rule 102 is waiting on. Before this page it was a tidy row about
placing settlements by ground; after it, it is **the data RUN needs to obey a
LOCKED ruling.**

What it owes, in his terms rather than mine: a camp, a town and a fortress each
need a footprint in blocks, the fortress biggest and the camp smallest, so that
"if a settlement is a 2 by 2 block it should just be large on the map like that"
has something to read. The numbers themselves are TUNING's and the drawing is
RUN's; the footprint belongs here.

**Not done in this page.** Writing the footprints is building, and WORLD is held.
This page says what is missing and how much, which is what a held lane may ship.

---

## 5. ROUTED

- **RUN** — rule 102(a) cannot be built against today's settlement data. The size
  is not there to draw. This is the blocker, named with its numbers, before the
  work starts rather than after.
- **This lane, when the hold lifts** — `[the three sizes of place]` is the row,
  and it is now rule 102's dependency, not a nice-to-have.
- **TUNING** — whatever the three footprints turn out to be, they are felt numbers
  and carry `tuned:false` with their source.
- **The coordinator** — rule 102 names RUN as owner of all four clauses on the
  map. Clause (a) has a data half that is WORLD's, and nothing on the board said
  so until this page.

---

`[bb size]` **Battle Brothers never has this problem because its settlements are
not places, they are pins.** A village there is one icon on a painted map with a
menu behind it; it has no extent, so it can never be the wrong size, and the
player never expects to see the two-by-two shape of it. **OUR TWIST** (rule 39b):
he has ruled the opposite — the settlement is a real piece of the city, two blocks
by two blocks, large and towering at every zoom — and that is a better world,
because the place you fight in and the place you see on the map become the same
place. The price is a thing BB never has to carry: **a settlement has to know how
big it is**, in blocks, before anything can draw it honestly. Right now ours knows
only a word.
