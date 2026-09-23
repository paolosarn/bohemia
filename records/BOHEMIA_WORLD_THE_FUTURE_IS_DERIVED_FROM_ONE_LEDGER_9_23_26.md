# THE FUTURE IS DERIVED FROM ONE LEDGER (9/23/26, WORLD lane)

Rule 31, **THE THREE ACTS AT ONCE** (Paolo 9/23, LOCKED), plus rule 22 and rule
29. **Nothing shipped to a play surface** — rule 18 holds. The cook went to the
VOTE tab and it is drawn.

---

## 1. WHAT I DID NOT DO, AND WHY THAT IS DELIBERATE

My board row `[future city]` says: *"the valley at act 2 and act 3 as a FUNCTION
of the earlier ledgers, never hand-placed... Waits for DYNASTY's two school
rounds; claim nothing here yet."*

**So I did not claim it and I did not build the derive.** That is DYNASTY's, and
building it before their school would be building somebody else's job badly.

But rule 12 says a dependency is a **premise**, not a gate, and the premise worth
testing here was never "is DYNASTY ready". It is this:

> **when the derive comes, can the ledgers it reads answer the question it asks?**

That is my half. Nobody else owns the valley's map, its money and its towns. So I
measured the inputs.

## 2. *** THE LAW NAMES FOUR LEDGERS AND ONE OF THEM KNOWS WHICH ACT IT MEANS ***

His words: *"see the progress in the future from your past action... the city is
built like shit because you're not making enough of an impact in your earlier
act."* The law lists what the derive reads: **territory, batteries, what was
built, who lived.** Measured, all four:

| the ledger | where it lives | does it persist | does it carry an ACT |
|---|---|---|---|
| **what was built** | `bohemia_century` | yes, saved and loaded | **YES** |
| **batteries**, the player | `bohemia_purse` | yes, `{id, day, entries}` | no |
| **batteries**, the 14 factions | `bohemia_pockets` | **no save, no load at all** | no |
| **territory** | `turfGrid()` | not in the save at all | no |
| **who lived** | `ctPeopleSave()` | yes | no |

**ONE OF FOUR.**

### what was built is ready, and it is genuinely good

`bohemia_century` is a real per-act ledger. Entries carry their act, totals are
derived from entries so no number can drift from the events behind it, the walked
city writes it, saves it and loads it back, and its loader treats a broken blob as
an empty memory rather than a crash. Driven here: act 1 built 2, act 2 built 1 and
demolished 1, and `through(act 2)` answers the law's own word, COMPOUND.

### territory is a pure function of the seed

```js
function turfGrid(){
  var k = seed + ':' + ((om && om.n) | 0);
  ...
```

That is the whole key. **Seed and map size and nothing else.** It is recomputed
identically on every boot, and the walked city's save never mentions turf,
territory or a holder. So what the player took is written down **nowhere**.

### and the money that matters does not survive the night

The player's purse saves. The **fourteen faction treasuries do not** — `pockets`
exports no `save` and no `load`. Who holds Las Vegas's money is gone on every
reload. I built that on 9/14 in `[every pocket]` and left the save off **on
purpose**, because treasuries outliving a memory-only player purse would mint
batteries across a reload. That was the right call then. Under rule 31 it is a
hole, and it is mine.

## 3. WHY THAT IS NOT A DETAIL

The century module's own head already wrote the warning, two weeks before the law
existed:

> *"a generation that built forty homes and a generation that built none look
> identical the moment a later generation knocks them down."*

Feed the derive three snapshots and it reads **the city as it stands**, not what
the family did. **His sentence stops being true: the future cannot be built like
shit because of act 1 if nothing recorded what act 1 did.**

## 4. WHAT I DID NOT DECIDE

I did not act-stamp the purse, give the treasuries a save, or start a territory
ledger. All three are real work and all three touch systems other lanes are inside
this round. **They are routed below with the measurement attached**, which is the
useful thing, and the gate is written so that the day somebody closes one, the
measured line changes and says so out loud instead of quietly staying green.

`TIERS` — what a **poor** city and a **rebuilt** one MEAN — is still empty, and
the gate holds it that way. The law says the numbers are his.

## 5. THE COOK, AND IT IS DRAWN

**THE SAME CORNER, A HUNDRED YEARS ON.**
`slices/vote/WORLD_THE_SAME_CORNER.png`

Rule 31 says *"early in the game it is a ruin and the ruin is the tutorial."*
**Nobody has ever drawn that ruin**, so nobody could say whether it reads.

One residential corner of the valley, drawn **twice by one function**, a hundred
years apart. `act` is the only argument that differs. That is not a style choice:
it is the law made visible. If act 3 were drawn freehand it would be a
hand-placed city, which is the one thing rule 31 forbids.

It is the **do-nothing past** — the floor the law asks for, the poorest city the
derive may ever hand him, and therefore the one that has to read.

**What a century really does**, which had to be read up rather than imagined:
concrete and CMU block outlast everything else in the Mojave. Asphalt does not —
it oxidises, crazes, then breaks into plates, and the desert takes it from the
edges in. Untreated timber is gone. So the ruin is **not the same picture,
browner**: the soft things are subtracted and the hard things are cracked.
Measured: **the block wall keeps 81% of itself, the asphalt keeps 52%**, and the
corner survives **43% pixel for pixel**. The house is gone and its slab is still
there.

Compared to the world before calling it done (TG-05, CB-03, BLDG-05, PROP-02,
AH-01):

- **CB-03** — the real grain of a Vegas corner: two streets meeting, the sidewalk
  carried round the inside of the turn, the block wall running the lot line and
  **turning**, the pole in the strip.
- **TG-05** — a flat surface reads by what breaks it, and the breaks stay quiet.
- **AH-01** — ordinary frame, one thing wrong. The wrong thing is a
  doorway-shaped gap in the wall with no gate in it, in **both** panels, 0.37% of
  the tile. In act 3 the deeper wrong thing is that **the geometry is still
  perfectly legible with nobody left to use it.** The horror is the survival of
  the layout. Rubble would have been the cheap version.

### THREE CUTS, AND THE FIRST TWO WERE BAD

1. **I drew an elevation when the game's camera is top-down**, and the top 60% of
   the tile was a flat lot doing nothing. Redrawn as a real corner: two streets,
   the wall turning, the house on its slab.
2. **The cracks were LIGHT.** A crack seen from above is a **gap**, so it reads
   dark. I had it backwards and the sidewalk read as lightning.
3. **The pole vanished.** From above a pole is almost nothing and its **shadow**
   is everything. Drawn that way now.

I stopped at three. STOP PRODUCING says a fourth version means you already
failed, and this lane wrote six of something last round.

## 6. THE GATES

```
FUTURE LEDGERS   new, 31/0, red four ways
```

A default in TIERS -> 2 red. The loader crashing on a bad blob -> 1. The ruin
sharing nothing with the corner -> 1. The asphalt outlasting the block wall -> 1.

## 7. WHERE HE FINDS IT

**Tab: VOTE, in the alpha.** One row, a picture:
**THE SAME CORNER, A HUNDRED YEARS ON.**

## 8. ROUTED

**TO DYNASTY**, for the two school rounds, and this is the thing worth carrying
in:

> **Three of the four ledgers your derive will read cannot tell you which act
> they are talking about, and one of them is not written down at all.** The
> built-ledger is ready and good. Territory is a pure function of the seed.
> Design the derive knowing that, or it will read the city as it stands and his
> sentence will not come true.

**TO ECONOMY**, because it is the lane that owns the money's shape: the 14 faction
treasuries have no save by a decision I made on 9/14 for a good reason that rule
31 has now overtaken.

**TO LIFE+CITY**, who own `bohemia_century`: it is the only input that is ready,
and the gate now pins that it stays ready.
