# THE MONEY KNOWS WHICH ACT, AND THE CORNER GOES THE OTHER WAY (9/24/26, WORLD)

Rows `[act stamp]` and `[sand is dirt]`, rule 31, rule 32(b) and rule 32(g).
Two of his rulings landed on this lane this round and both are built.

---

## 1. WHAT HE SAID, AND WHAT IT COST ME

Three of my items came back judged. **THE RIG ON THE ROOF: up. THE RING ROAD:
up.** The first approvals this lane has ever had. **THE SAME CORNER: down**, with
a reason that became a fleet rule.

> **On THE RING ROAD, while approving it:** *"why is the sand white grey, it'll
> be the same colour as the rest of the dirt."*

> **On THE SAME CORNER, killing it:** *"Bro the future gets better holy shit
> actually the right side is kinda what the beginning of the game is supposed to
> look like and it gets better how better is up to you and by better i mean when
> civilization reclaims parts of cities for economic purposes it will get more
> techy and modern and yeah man cmon"* → rule 32(b).

NOTES ARE RULINGS, so both were built this round, ahead of the claimed queue.

## 2. [sand is dirt] — AND THE REPO HAD ALREADY CAUGHT THIS ONCE

He is right, and it is worse than a taste note. The tile's sand was `#c0b79c`
against a desert of `#5b5344`: **the same hue (45 against 40) at twice the
lightness (0.68 against 0.35)**, and at that distance a matching hue stops
mattering — it reads as a different material.

**And this repo already fixed this exact mistake.** `bohemia_city_terrain_patch.py`
carries the line:

```
desert:0   desert pavement   #6e6045   (was rendering as generic sand #d8b078)
```

Somebody fixed generic pale sand to real desert pavement in the terrain, and I
put generic pale sand straight back into a tile. **So the dirt family is not a
value I chose: it is the walked city's own `#6e6045`**, and the drift is one step
of it.

**THE TOOL NOW REFUSES A RELAPSE**, on hue *and* on lightness — because a hue
check alone **would have passed the version he rejected**, which is exactly why
the second leg exists.

**AND FIXING IT BROKE ITS NEIGHBOUR IN THE SAME RENDER.** Lifting the desert put
the sound wall's cap within 0.055 of the ground it stands on and the top of the
wall stopped reading. Concrete really is lighter than desert dirt in daylight, so
the wall reads by its own step now, and the tool holds that separation too. **A
palette move is never local.**

## 3. [act stamp] — BOTH HALVES BUILT

The row, off this lane's own 9/23 measurement: of the four ledgers rule 31's
derive reads, only the century knew which act it meant.

### A. THE ACT IS ON THE ENTRY, NOT ON A SUMMARY

Same reason the balance is a sum and not a field: entries are the truth, and a
total that can drift from the events behind it is the bug this file exists to
avoid. Stamped in `_post`, **the one private writer**, and read off the purse **at
the time of the movement** — so if he ever re-rules where an act boundary falls,
the past does not silently change hands.

```
act 1 moved 3    act 2 moved 4    through act 2 = 7    total 7
```

`balanceIn`, `through` and `acts` are the century module's own three shapes, taken
rather than reinvented, so a reader that knows one ledger knows this one. Going
backwards is refused, same rule as the century's `setAct`.

**AN OLDER SAVE IS A PLAYABLE SAVE.** A blob written before this round has no act
anywhere and every entry reads as **act 1** — not a fudge, **rule 32(b)**: the
game starts in the ruin, act 1 is the floor, so money that existed before anybody
counted acts was act-1 money.

### B. THE TREASURIES SURVIVE A RELOAD AND CANNOT MINT

I left the save off on 9/14 and wrote down why: *"his own purse is memory-only and
treasuries outliving it would mint batteries across a reload."* **That reason is
now the rule rather than the excuse.** `load()` compares what the blob says the
supply was against what the restored book is worth, and refuses by name rather
than quietly minting or burning.

```
the hole, as it was:   a reload left 0 of 10, and 0 holders
now:                   10 of 10, Mob 7, Church 3
a blob that would mint: SUPPLY_WOULD_CHANGE, and the book is left untouched
a blob that would burn: the same
```

### C. *** AND MEASURING IT FOUND A BIGGER MINT THAN THE ONE I NAMED ***

`STOCKED` is the boolean guarding the opening stock — one battery per head, his
9/16 ruling — and **its own comment says "an opening stock that can be re-run is a
mint with a polite name."** Save the treasuries without it and every reload runs
it again, over the top of the restored one.

```
the valley opens with                                    80
a reload, then the opening stock tries again    ALREADY_STOCKED, still 80
with STOCKED dropped from the save                      160
```

**The whole valley's money, twice.** Measured, not argued.

### D. THE PLAYER IS NOT IN THIS BOOK'S SAVE

Deliberately. The walked city already saves his purse in its own slot, and two
copies of one balance is exactly what `adopt()` exists to prevent.

## 4. THE COOK: THE CORNER RECLAIMED

`slices/vote/WORLD_THE_CORNER_RECLAIMED.png`, a **redo** naming the id it
replaces and quoting the words that killed it.

**THE DRAWING WAS NOT WRONG. THE ARROW WAS.** The killed item ran act 1 → act 3
as subtraction. He read the ruined panel as the **beginning** and he is right: the
game opens thirty years after a crash, so a ruin is where the player starts and
there is nothing above it to fall from.

So: same corner, turned around. **Left is act 1, the ruin, unchanged** — his floor
has to be somewhere and this is it. **Right is the same ruin with things added.**

**THE ONLY OPERATION IN THE FILE IS ADD**, and the tool refuses itself if one
act-1 pixel turns into another act-1 value. That is rule 32(b) made mechanical: if
anything could be removed the future could get worse, and he ruled it cannot.
Measured: **reclaim added 36% of the corner and took away nothing.**

What reclaim means, in his words' order — *"for economic purposes"*, *"techy and
modern"*:

- **the slab carries a machine, not a home.** The house is not rebuilt; a workshop
  goes up on the foundation that was already there, wearing the panel array he
  approved this round.
- **the road is patched where it is driven and nowhere else.** The near street
  only; the cross street keeps its act-1 breaks. Same planned-shrinkage logic this
  lane measured in the light last round.
- **the power comes back**: a new head on the old pole, the conduit, the line out.

**REUSE-FIRST:** the corner is imported from the killed item's tool, not redrawn,
so *"the same corner"* is true by construction and not by my promise.

**AND IT IS STILL ANALOG HORROR.** The wall still stands, and **the gap in it
still has no gate** — kept identical in both panels by a refusal, because tidying
it away is the cheap version. Better is not kind.

**TWO CUTS.** The first drew a **lit lamp throwing a pool** — in a frame where the
wall has a sun side and a shade side and the roof casts an eave shadow. That is a
daylight drawing and a glowing lamp in it reads as a puddle. What says the power
is back in daylight is the hardware.

**AND MY OWN REFUSAL CAUGHT A REAL VIOLATION.** The first cut repainted the lane
line in act 1's faded white, which overwrote desert with an act-1 value and
tripped the nothing-decays check. It was right to. A line repainted on new asphalt
**is** brighter than a thirty-year-old one, so the fix the rule forced is also the
truer drawing.

## 5. THE GATES

```
ACT STAMP   new, 35/0, red five ways
```

Remove the supply check → 3. Stop `STOCKED` riding the save → 2. Load an
unstamped entry as act 0 → 1. Let the act run backwards → 1. Put the player in
the book's save → 2.

**AND MY OWN CHECK WAS WRONG BEFORE THE CODE WAS, THE THIRD ROUND RUNNING.** The
one-writer check counted `act: clampAct(purse.act` across the whole file and found
two — the **entry** stamp in `_post` and the **purse-level** act that `save()`
writes into the blob. Different facts; only the first is what "one writer" means.
It slices out `_post` and counts inside it now. I am keeping a tally of this
because three rounds of my instrument failing before the game did is a pattern,
not bad luck.

## 6. SHIPPED TO THE ENGINE, AND THE SLICES ARE IN STEP

The board row says this one is engine and **not held**. Rule 8: a diff that
touches `engine/` rebuilds the derived slices in the same commit, so both were
resynced. **Measured before doing it, because re-inlining can carry another
lane's held work onto the play surface: the city resync touched exactly my two
modules and left 136 already fresh.** Nothing else rode along.

The change is additive and backward-compatible: an entry gains a field, old saves
load as act 1, and no behaviour any caller depends on moves.

## 7. WHERE HE FINDS IT

**Tab: VOTE, in the alpha.** One new row, a picture: **THE CORNER RECLAIMED**.
And **THE RING ROAD**, which he already approved, now has its sand fixed.

## 8. ROUTED

**TO DYNASTY**, for the derive: the purse answers `balanceIn`, `through` and
`acts` now, and the treasuries survive a reload. **Two of the four ledgers carry
an act.** Territory is still a pure function of the seed and who lived still
carries none.

**TO WHOEVER OWNS THE LIGHT** (the change named last round, unchanged):
`engine/bohemia_powergrid.js`, `powerMap()`, the `live` roll.
