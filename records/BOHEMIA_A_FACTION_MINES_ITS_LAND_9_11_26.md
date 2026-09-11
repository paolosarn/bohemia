# A FACTION MINES ITS LAND
FACTIONS lane · VAMILY row `[power territory]` A-FACTION-MINES-ITS-LAND · 9/11/26

## THE ONE LINE
A faction's strength was a number typed once and it never moved. Take every block
off the Mob and the Mob was still 13. What a faction's land is worth is a real
reading now, and losing the block loses the output.

## WHAT IT WAS SET AGAINST, MEASURED FIRST
Faction strength in this game is `act1_power` / `act3_power`, and his own graph's
meta calls it what it is: **"Power = ordinal rank (1=weakest) per act."** It is
read in exactly two places, and both are about setup:

    the TIER        top third fortress, middle town, bottom camp
    the TURF DRAFT  strongest picks its blocks first

Nothing read it afterwards and nothing ever changed it. There was no reading
anywhere in the game that could answer *"what does this faction's land make?"*

## THE NAMED BLOCKER WAS NOT TRUE
The row says *"the numbers flow from WORLD [batteries mined]"*, which is still
OPEN. But the number was already ruled and written down twice:

> 7/26 BUILDINGS PRODUCE ONE OF THE THREE + 8/15 EVERYTHING COSTS ONE

`bohemia_production.js` already carries that exact string as the reason its rows
say 1, and WORLD's own row spells it out: *"start at ONE battery per day per
building."* So the yield needed no invention and no waiting. **Third time this
lane has found a named blocker that had already been answered.**

## WHAT MAKES POWER, AND THE ONE THAT DOES NOT
Three kinds of ground generate electricity in this valley: **solar, dam,
battery**. A **substation is deliberately not on the list** — it steps voltage
down and passes it along. Counting it would be counting the wire as the well.

## A SITE IS A BUILDING, NOT A CELL
The valley holds 301 solar cells. That is not 301 generators. Flood-filled runs
of one kind give the real answer, and **the dam is the check that the unit is
right: four cells, one site, which is Hoover.**

    THE WHOLE VALLEY MAKES POWER IN FIVE PLACES
      solar farm   188 cells    Network
      solar farm    84 cells    Network
      solar farm    29 cells    Trades
      battery plant  1 cell     Volunteers
      the dam        4 cells    Cartel

So: **Network 2 a day, Trades 1, Volunteers 1, Cartel 1, and ten of the fourteen
make nothing at all.**

## THE TRAP I WALKED INTO AND MEASURED MY WAY OUT OF
The obvious version gates output on the lights, because this lane's own income
rule says a district pays only while it is yours AND lit AND patrolled.

**Measured: all five sites have ZERO lit cells.** Circuits only run along STREET
cells and a solar farm stands in the desert. That version would have made the
entire valley produce nothing while every check stayed green.

A generator MAKES power. Whether it reaches anybody is the grid's job and the
grid already models it. **The income rule governs what a district PAYS, not what
a plant MAKES.**

## AND HIS SENTENCE IS FALSE ON HIS OWN MAP, SO IT IS REPORTED, NOT FORCED
The row says *"a fortress makes more than a camp."* On this map:

> **The Mob is a fortress at strength 13 with 1,490 cells and it makes NOTHING.
> The Remnants are the strongest faction he wrote, at 14, and they make NOTHING.**

Making that sentence true would have meant typing a tier multiplier nobody ruled,
on top of a map that is his (MAP LAW). No tier scaling was applied at all: output
is sites held, and `DEPTH`/`REACH` are left to the things they already scale. The
counterexample is named in the gate so nobody later "fixes" it into a number.

## DERIVED, NEVER STORED
Losing a block loses its output with no rule of its own: the block changes hands,
the site goes with it, and asking again is simply a different answer. Proved by
taking a holder's seats away and asking again — their output goes to zero, the
valley keeps all five sites, and somebody else picked it up. **Output moves; it
does not evaporate.**

A split site goes to whoever holds most of it, and that rule earns its keep rather
than waiting for a rainy day: on the boot seed the dam really is split, three
cells to the Anarchists and one to the Mob.

## WHERE HE SEES IT
    DIRECT tab, TOWN SIZES   all 14 rows, under the tier chips:
                             "its land makes 2 batteries a day off 2 solar farms"
                             "its land makes no power"
    the walked city          the nightfall card, on the line that already names
                             whose ground he crossed: "Cartel land makes 1
                             battery a day off the dam"
Both driven on a phone-sized screen, and the demo proved separately because the
demo loads the same walked city. No page errors on either.

A faction with nothing says **"its land makes no power"** rather than showing a 0,
because 0 reads as broken and the sentence reads as true.

## GATES
`faction_towns_gate` 65/0, up from 48 — extended, not duplicated. Seventeen new
claims: the named list and the substation's absence, a site is a building and the
dam proves it, the holder comes from turf, the split rule with its real split, the
yield carries his ruling, losing the ground loses the output, output moves rather
than evaporating, derived so there is nothing to put back, an honest zero for most
of the valley, the fortress counterexample, and both surfaces really asking.
Green alongside: turf 43/0, engine sync zero drift, demo build 25/0, alpha loads 20/0.

## [PENDING Paolo] — ONE, AND IT IS A REAL FORK
His towns law says a fortress has *"the deep dry stores, the kitchens and **the
plant**"* while a camp has a stall. Read one way, "the plant" is a back-of-house
boiler room. Read another, it is a generator, and every fortress would make power
from its own seat regardless of where the solar sits — which would make his
"a fortress makes more than a camp" true everywhere.

**That reading would author canon in the most sensitive place in the game: what
the money supply is and who holds it.** It is not taken. Today the map decides,
and the map says the Network holds most of the valley's electricity, which matches
his own note that they hold the lit grid.
