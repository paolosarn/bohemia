# THE GAME KNEW SOMEBODY HELD THAT BLOCK AND COULD NOT SAY WHO
# 9/5/26, WORLD lane. VAMILY [held ground] — BB-TURF. **SHIPPED.**

> "different parts of Vegas as different faction holdings" — Paolo, by name
> "EVERY PART OF THE VALLEY IS OWNED BY A FACTION." — Paolo, **9/4**, LOCKED

## THE GAP, AND IT IS ONE WORD

LIGHT=TERRITORY has been live code since 7/20. Every lit circuit carries an owner, the
director's scene test already reads it, and the row put it well: *not a metaphor, the grid's
own data.*

**But the owner was a CATEGORY, not a name** — `{settlement, faction, network, solar_lone}`.
One circuit in five came back owned by the generic word **"faction"**.

So the game knew somebody held that block and could not say who. And worse, the seam test
compares those words:

> `if(n.live && n.owner && n.owner !== me.owner) return true;`

**The Mob's block and the Cartel's block were the same block.** Two rival outfits standing on
adjacent ground read as one owner, so there was no border between them and no scene could
spawn on it.

## THE NAME COMES OFF THE SEATS, AND NOTHING IS AUTHORED

FACTION-TOWNS put fourteen seats on the map last round. **A faction holds the ground around
its own town** — which is what "different parts of Vegas as different faction holdings" means
in plain words, and it needs no canon from anybody.

**A FORTRESS REACHES FURTHER THAN A CAMP**, off the `REACH` table that already sized a town
rather than a new number. Six cells from a fortress beats four cells from a camp. That is his
own *"the more prominent factions kind of feel like strong fortress parts"*, as a divisor.

Ties go to the stronger faction, then to the name, so the answer is the same on every device
and every load. `HOLDS` ships **empty** and an entry in it wins.

**ONLY THE `faction` CATEGORY IS RENAMED.** A `settlement` is a neighbourhood holding its own
lights and `solar_lone` is one holdout with a panel; naming those would be inventing canon the
row did not ask for. And **`network` is deliberately left alone** even though the roster has a
faction called Network — the category predates the roster, and treating the two as the same
thing is a guess about his canon, not a reading of it. Written down rather than quietly
resolved.

The grid takes **data, not a module**: `powerMap` gains a `holderAt` callback, so it stays a
pure function of the map and the seed, and handed nothing it is byte-for-byte what it was.

## THE MEASUREMENT THAT CHANGED THE DESIGN

I named the lit circuits, then counted the borders. Across five seeds:

| | |
|---|---|
| live cells | 2,155 |
| carrying a real faction name | **424** |
| lit borders (two different owners touching) | 127 |
| of those, **faction against faction** | **0** |

**Not one.** On any seed.

The reason is structural and it is not a bug: **neighbouring circuits fall inside the same
town's catchment, so they share a holder.** Two different factions' lit circuits landing
adjacent is rare by construction.

So a territory map made only of lit ground would leave **nine cells in ten belonging to
nobody** and would have no faction borders at all. That is not what he ruled.

**THE LIT CIRCUITS ARE THE TELL. THE TERRITORY IS THE CATCHMENT.** `turfAt(x,y)` answers for
any cell in the valley, lit or dark:

| | |
|---|---|
| cells in the valley | 9,216 |
| **cells with a holder** | **9,216** |
| **uncovered** | **0** |
| factions holding ground | 14 |
| borders between different holders | 712 |

And it reads the way it should: the fortresses hold the most — Church 1,742, Mob 1,375,
Remnants 1,278, Reds 1,263 — and the camps hold slivers: Trades 14, Homeless 16, Colorful 24.
Nobody sized that by hand; it falls out of the seats and the tier reach.

**The player opens the game on Mob ground**, seven cells from the Mob's own fortress.

## WHAT HE SEES

The reckoning card, on a day you walked across a line:

> **you crossed Mob into Homeless**

And when a block you were paying for goes dark, it now says whose block it was:

> the lights went out on **Mob's** arterial — nobody patrols the dark

Which is the sentence that ties this to [lights bill]: **you can be paying the power bill on
ground somebody else holds.** You built there; they hold it.

**AND THE COLOUR STAYS HIS.** The row says the tell is diegetic — you see who holds a block at
night, because the 12%-lit law already made light the tell. It would have been easy to colour
a lit block by its holder, and **COLOUR IS TERRITORY (8/26) says which faction owns which hue
is his.** There is no faction colour table the walked surface can reach, so the tell stays the
light itself and the name arrives in words, tagged `draft:true`.

## AND THE TEMPORAL DEAD ZONE GOT ME, IN A FILE THAT WARNS ABOUT IT

The first cut of the seat lookup guarded with `typeof CE === 'undefined'`. `const CE` is
declared **three lines below** the boot call that uses it — and **`typeof` on a `const` in the
temporal dead zone THROWS** rather than returning `'undefined'`. So the guard was not a guard,
the `try/catch` swallowed it, and every circuit came back unnamed with nothing saying why.

This file already carries a note about exactly this for `HOME` (8/11). It reads the globals off
`window` now, which have no dead zone.

**And the power map is built in THREE places** — boot, a save restored on a different seed, and
a re-rolled valley. A naming step added to two of them is a valley where a third of the time
nobody has a name, so all three go through one `buildPower()`.

## THE GATE — `gates/turf_gate.js`, 23 checks, registered as TURF

The holder is derived and deterministic, a fortress reaches past a camp, `HOLDS` ships empty,
the grid handed no seats is unchanged, every `faction`-category circuit gets a real name off
his own graph, nothing else is renamed, a whole feeder answers with one holder so no border
runs through a wire, a doused circuit keeps its holder, every cell of the valley is held on
three seeds, and the card tells him he crossed a line by name.

**Proved red both ways**: remove the fortress reach and check 1 fails; remove the card line and
two surface checks fail.

The faction-against-faction seam count is **reported, not asserted** — it is 0 by construction
today, and if it ever stops being 0 that is a finding rather than a failure.

## VERIFIED

| | |
|---|---|
| walked surface | 9,216 of 9,216 cells held, 14 factions, opens on Mob ground, card says "you crossed Mob into Homeless" |
| demo, through the splash | identical — all 9,216 held, 14 holders, same card line |
| gates | turf 23, faction towns 33, payday 38, demo build 25, purse 28, day pays 18, economy 13, demo blockers 22, four verbs 32, lights bill 30, placeholder 14, brownout 20, road cell 46, walkable valley 6, pages publish 18, loop faction bridge 68 — **434 checks, 0 failed** |

## WHAT IS STILL HIS

Which faction holds which ground (`HOLDS` is the one-line door). Which hue any of them wears.
Whether the `network` category is the Network faction. How much of the valley is lit at all —
the 12% and the owner weights are dials in the grid and both carry their own "tunable" note.
