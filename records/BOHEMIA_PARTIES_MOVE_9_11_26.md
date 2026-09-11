# PARTIES MOVE (9/11/26, WORLD lane) — board row GROUPS-WITH-THEIR-OWN-BUSINESS

Ship: `engine/bohemia_parties.js` (new), the walked surface, and
`gates/parties_move_gate.js` (39 checks, registered as **PARTIES MOVE**, suite 574).
Tab: **CITY**, and on the nightfall card. Also in the demo.

---

## THE ROW

> "the map is populated by the world's own business, not by a spawner aimed at the
> player. Places BUY and SEND parties out of what they have, each with an agenda (a
> caravan carrying, a patrol holding a border, a crew going to take something), and
> they travel whether or not the player is looking. A party's strength is real and
> readable, because pursuit depends on how strong you look next to it. This is what
> makes a chance encounter a chance and not a script."

## MEASURED BEFORE IT WAS BUILT

The only thing that ever put anybody in front of the player was
`bohemia_encounters.js`, and its own header says exactly what it is: a director
that is **PULLED** by a block of time the player actually spent, with **no clock**,
by deliberate ruling — *"a world that keeps rolling at an idle player is the thing
the ruling forbids, and the only way to be sure is to own no clock at all."*

That is correct for ambient encounters on a walk, and it is precisely what this row
is set against. `bohemia_patrol.js` is a **block's** sidewalk loop, not a
valley-scale party. **Nothing in this valley had business of its own. Nobody was
going anywhere.**

## NOT ONE NUMBER IS TYPED, AND EVERY PIECE IS SOMEBODY ELSE'S

| what | who already owned it |
|---|---|
| WHO can send | `BohemiaTowns` — his 14 seats |
| HOW MANY it sends | `BohemiaTowns.REACH` — fortress 3, town 2, camp 1, the table that already sized a town's reach |
| HOW STRONG it is | his own act power column: Remnants 14, Mob 13, Cartel 12 … Colorful 1 |
| WHO it is sent at | `BohemiaBetween` — his authored relations plus what this run earned |
| WHOSE GROUND is whose | `BohemiaTowns.holderOf` — BB-TURF's catchment |
| HOW FAR IT GETS IN A DAY | the walked surface's own ROADS-ARE-FAST rule |

The gate strips the comments and greps the module's logic: the only numerals left
are `0` and `1`.

**The strength is not a combat number and nothing here deals damage.** NO DAMAGE
BEFORE THE DIAL governs what a hit takes off; this governs what a party *looks
like* from across a street, which is what the row asks for. The act power column is
already how this game ranks factions, so handing it over unchanged is the only
answer that cannot drift from the rest of the world. The player's own strength is
never invented here — `against(party, mine)` makes the caller supply it.

## HOW A PLACE DECIDES WHAT TO SEND

A rule, not a table, so it cannot rot. A place sends `REACH[tier]` parties:

1. a **crew** at the worst faction it has a feud with,
2. then a **patrol** to its own nearest border,
3. then a **caravan** to the nearest place it has no feud with.

A place with nobody to fight and nowhere to trade sends nothing, which is the
honest empty state rather than a party invented to fill a slot.

Measured on the real map: **28 parties from the 14 seats** — 14 patrols, 10
caravans, 4 crews. Only 4 crews because his `PAIRS` table has few hostile edges;
that is his graph, not a cap.

## HOW FAR THEY GET, AND WHY IT IS THE PLAYER'S OWN RULE

`MIN_PER_CELL` is the walked surface's cost to cross one tile, and `FN` tiles make
an overmap cell, so a waking day of travel is `(waking minutes / minutes per tile)
/ tiles per cell`. On this valley that is **89.3 cells against a 96-cell map** —
ROADS-ARE-FAST's own "you can cross it in a day", arrived at from the same two
numbers rather than from a second opinion. The gate re-derives it independently, so
a typed speed would show up as a disagreement instead of as a comment nobody checks.

They take the **baseline, not the paved half-cost**, deliberately: nothing here
routes a caravan down a street, so claiming road speed would be claiming a road it
never drove.

## THEY TRAVEL WHETHER OR NOT HE IS LOOKING

The hook is `advance(mins)` — every block of time the world really spent — **not**
nightfall, which would mean a caravan teleports once a day. So a party crosses the
valley while he is doing something else and he can meet it halfway.

"Whether or not he is looking" means it does not need him **nearby** and does not
need him to **observe** it. It does not mean wall time: NO BACKGROUND TICKING and
I-MOVE-YOU-MOVE both stand, this owns no timer, and the minutes handed over are
minutes the world actually spent.

**Proved with him standing absolutely still:** over half a day at his spawn cell he
moved not one cell, **27 of 28 parties did**, and the nearest got no closer than 19
cells. He never met any of them and the valley got on with its day.

## WHAT HE READS

One line on the nightfall card, above his own day, because this is the one line on
that card that is not about him:

```
Cartel sent a crew onto Caravans' ground (6 parties moved in the valley today)
Mob got a caravan through to Network (8 parties moved in the valley today)
Remnants put a patrol on its border with Blues (25 parties moved in the valley today)
```

One line, not eight — the same reason the spend list groups by verb: eight arrivals
is a wall, not a reckoning.

## THREE THINGS MEASURING CAUGHT, AND ONE WAS A DESIGN FLAW

**1. A PATROL THAT PARKS IS A STATUE.** The first cut had a patrol stop dead on its
border cell for ever, on the reading that "holding a border" means standing on it.
Measured: that froze **fourteen of twenty-eight parties** after day one, so half the
valley's business was statues and the row's own words were only half true. A patrol
holds a border by **walking** it — which is what this game's own block-scale
`bohemia_patrol.js` has modelled since 7/16, whose comment says *"a patrol that
never closes its loop is a guard teleporting home every lap, and the eye catches
that immediately."* Patrols now run seat to border and back, for ever.

**2. A STATE THAT LIES FOR ONE TICK.** Arrival was checked at the *top* of the step,
so a party standing on its destination reported "still walking" for a whole day, and
anything reading it — a card, a pursuit, a gate — was told the wrong thing. The flag
is now set in the step that arrives.

**3. THE CARD LINE WAS NEARLY DEAD ON ARRIVAL.** Before writing it I measured how
often a party comes within sight of a standing player: at radius 1, **zero times in
twenty days**. So a "what passed your window" line would have been a branch that
never executes. What *does* happen every day is arrivals — measured at **6 to 10 a
day** once the first day settles — so the card reports the valley's business, not
your window. *A branch that has never executed is not code, it is an intention.*

**And one grammar bug each in two places**, both caught by reading the real sentence
on the real card rather than by thinking about it: `'a ' + faction` produced "a
Anarchists patrol" (his faction names are plural, so no single article is ever
right — the article is gone), and a bare possessive produced "Caravans's ground".

## ONE CHECK OF MINE THAT WAS SIMPLY WRONG

The first surface check drove four nights and then failed because the player had
moved from 48,48 to 17,36. He had — **waking puts him back at his own house**, which
is the day loop doing its job. The claim I actually wanted is that the valley's
business does not need him to go anywhere, so it is now measured inside a single
day where nothing else is allowed to move him. **A check that cannot be true is not
a stricter check, it is a broken one.**

## WHAT THIS ROW DELIBERATELY DID NOT BUILD

- **RUN [travel map]** — the map you watch them on. This is the world model under it.
- **Pursuit itself.** `against()` reports the comparison and never a verdict:
  whether you run is not this module's ruling.
- **Routing down roads.** Stated in the code rather than implied.

## PROOF

- `node gates/parties_move_gate.js` → **39 passed, 0 failed**, registered, suite 574
- red both ways: type a party count → **2 red**; let the player's position decide
  what exists → **2 red** (including the check written for exactly that)
- neighbours all green on this tree: A DAY'S WORK 37/0, VALLEY RUNS OUT 25/0,
  COALITION 40/0, FACTION TOWNS 48/0, ENCOUNTER 69/0, WALK ENCOUNTER 25/0,
  PATROL 28/0, ROADS ARE FAST 17/0, DAY LOOP 59/0, DEMO BUILD 25/0,
  PAGES PUBLISH 18/0, ATTEMPT 15/0

Build stamp: **BUILD 9/11a - THE VALLEY HAS BUSINESS OF ITS OWN**
