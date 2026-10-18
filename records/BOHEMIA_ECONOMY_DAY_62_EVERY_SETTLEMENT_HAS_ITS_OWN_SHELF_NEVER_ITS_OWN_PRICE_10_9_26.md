# ECONOMY DAY 62: EVERY SETTLEMENT HAS ITS OWN SHELF, NEVER ITS OWN PRICE
# Rule 74 top row [prices per place], research (rule 40): how Battle Brothers sets prices per
# town (supply, what your actions did nearby, the raided village with no food) and ours per
# settlement, rolled per game and moved by what you do; the one-price-in-the-valley ruling
# re-read for settlement screens. One page, numbers to TUNING.

## 0. THE BB AISLE IS NOT THIN HERE -- IT IS THE FULLEST PAGE THIS LANE HAS FOUND
Unlike farming (round 61) or wages (round 52), Battle Brothers' own economy page
(reference/library/battle_brothers/07_ECONOMY.md) answers this question directly, three ways:
(a) EACH SETTLEMENT'S TYPE decides what it has to sell (a fishing village sells fish, a city
sells everything at a premium) -- a real-world shape, not a game invention: a one-industry town
sells what it produces and is thin on everything else, same as a real mining town's company
store. (b) SITUATIONS move the shelf: a RAIDED settlement's food goes scarce and dear, a
WELL-SUPPLIED one goes cheap. (c) RELATIONS move the price for YOU specifically: an allied
house gives a discount. And buying raises the local price, selling lowers it, both recovering
over days -- a real local-market mechanic (a shock to one town's stock moves that town's price,
not the whole world's).

## 1. OUR OWN LOCKED RULING ALREADY ANSWERS HALF OF THIS, AND IT IS NOT A NEW READ
[two prices] (SHIPPED 9/15, records/BOHEMIA_TWO_PRICES_THE_CAMP_SAYS_NO_9_15_26.md) already
closed the number question for the whole valley: EVERYTHING COSTS ONE is his pillar and it
holds EVERYWHERE FOR EVERYONE WHO BELONGS. A stranger surcharge was built, broke the opening
rice-and-rent loop (the first bag of rice cost two days' work two blocks from the player's own
spawn), and was ruled OUT. The spread Battle Brothers keeps in its PRICE NUMBER, this game
keeps in ACCESS: a stranger at a camp is refused outright (BARTER_ONLY) or sold a short SHELF;
a town still sells to a stranger at one; belonging (stranger/peripheral/useful/counted/inside)
opens doors, never discounts digits. Re-reading that ruling for the settlement screen changes
nothing about the number -- it says what moves per place is the SHELF, not the PRICE, which is
exactly BB's own first mechanic (settlement type decides what's for sale) and not its second
(the moving crown figure, which we do not have).

## 2. SO THE QUESTION THIS ROW ACTUALLY ASKS IS "WHAT MOVES PER SETTLEMENT," NOT "WHAT NUMBER"
Three BB levers translate clean, none of them touching the one-battery floor:
**SETTLEMENT TYPE -> WHAT IS ON THE SHELF.** A real Nevada-adjacent precedent exists for this
without inventing anything: a company town built around one industry (a mine, a mill, a
railhead) historically sold what that industry needed and little else at its own store, and a
real desert settlement's shelf is shaped by what actually survives transport to it (canned and
dried goods travel, anything that needs refrigeration does not without power). Translate: a
settlement rolled as a WATER-HOLDER's shelf leans water and water-adjacent goods; a FARMING
settlement (round 61's held lots) leans the slow crops; a SCAVENGE settlement leans parts and
batteries. [the roll]'s own per-game seed already decides who holds what (WORLD), so the shelf
follows the hold, nothing new to roll.
**SITUATIONS -> WHETHER THE SHELF IS THERE AT ALL, AND HOW MUCH OF IT.** A raided settlement
(rule 68, already live on the map: raiding parties move with purpose toward a camp or town) is
BB's "food scarce and dear" read as our own locked grammar: not a price spike, a SHELF cut --
fewer units, some goods gone outright, same one-battery floor on what remains. A well-supplied
settlement (a market-day crowd, already live in bohemia_livingmap.js per rule 68a) is a FULLER
shelf, not a cheaper one. This is a straight reskin of an existing live system (the map's own
crowd-thickening/thinning multiplier already answers "is this place doing well or badly" for
free) rather than a new mechanic.
**RELATIONS -> ACCESS, NOT A DISCOUNT.** [two prices] already built this exact shape for
belonging rungs (stranger refused or barter-only, inside served); a settlement you hold or a
house that likes you opens its full shelf to you at the same one battery everyone who belongs
already pays. BB's "allied house discount" becomes our "allied house does not refuse you,"
which is the same lever translated into the locked grammar instead of contradicting it.

## 3. "WHAT YOUR ACTIONS DID NEARBY" -- THE ROW'S OWN SECOND ASK, SOURCED NOT INVENTED
BB's buy-raises/sell-lowers/recovers-over-days mechanic is a real supply-and-demand fact (a
local shock to one town's stock moves that town's own shelf, recovering as the next caravan or
harvest refills it) and it maps onto something we already ship: a market-day crowd or a raid's
thinning is already a LOCAL, PER-SETTLEMENT state that recovers on its own clock (the living
map's prints fade over 24 hours; the gate crowd is already a function of the settlement's own
tier and trait, not a global number). The direction, sourced not felt: a settlement you have
recently SOLD INTO (dumped loot, delivered a contract's goods) should read as temporarily
BETTER-SUPPLIED on its own shelf for a while, the mirror of a raid thinning it; a settlement
you have recently BOUGHT OUT (cleared a scarce good) should read thinner for a while. Both are
the SAME mechanic the map already has (a temporary per-place state that decays), never a new
number system.

## 4. THE NUMBERS TABLE TO TUNING -- DIRECTIONS AND RATIOS, NO FELT DIGIT
| Lever | BB's shape | Our translation | Numeric gap, TUNING's | Source |
|---|---|---|---|---|
| Settlement type | fishing village sells fish, city sells everything at a premium | the shelf's GOODS LIST follows what the settlement holds/produces ([the roll]'s own seed) | which goods list per settlement kind | reference/library/battle_brothers/07_ECONOMY.md |
| Raided situation | food scarce and dear | shelf CUT (fewer units, some goods absent), floor stays one | how many units cut, how long the cut lasts | same; our own rule 68 raiding parties |
| Well-supplied situation | cheap | shelf FULLER, floor stays one | how much fuller, how long it lasts | same; our own bohemia_livingmap.js market-day crowd |
| Relations/allied house | a discount | access only: refusal lifted, full shelf opens at one | which belonging rung opens which shelf tier | our own [two prices], 9/15 LOCKED |
| Buy raises / sell lowers, recovers over days | a moving crown number | a moving SHELF STATE (thinner/fuller) that decays, mirrors the living map's fading prints | the decay half-life | reference/library/battle_brothers/07_ECONOMY.md; our own bohemia_livingmap.js (prints fade at 24h) |
No digit above is typed as final; every cell is a direction with its real or in-engine source
named, same discipline as every prior round.

## 5. BANK
Eight role-place lines, draft:true, in banks/BOHEMIA_ECONOMY_TEST_LINES_9_5_26.md (round 62,
prefix one S longer than round 61's).

## 6. ROUTED
- WORLD [the roll]: the per-settlement goods list (what a water-holder, a farm-holding place
  and a scavenge-heavy place each stock) is a direct read of the same seed WORLD already rolls
  home bases and hold from; no new roll needed, only a new table keyed to it.
- LIFE+CITY/RUN TWO [settlement screen]: the shelf-cut-on-raid and shelf-fuller-on-market-day
  states are the same live multiplier the map's crowd gate already computes; wiring the
  settlement screen's shelf to read it is a reuse, not a build.
- TUNING: every unfilled cell in section 4, none typed as a final digit here.
- MODS: if a per-settlement-type goods list becomes a data file, it is one more table a modder
  edits, same shape as the existing content-in-a-data-file rule.
