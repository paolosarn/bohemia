# THE TRADING HUB (8/14/26, RUN lane)

## THE ONE-LINE VERSION

He can spend it now. The demo cut's row 3 said "GET PAID -> SPEND AT A TRADING HUB";
GET PAID shipped 8/12 and SPEND shipped today, and it was never blocked on anything.

## WHAT I GOT WRONG, FIRST, BECAUSE IT IS THE POINT

My own handoff, in my own words, said this half was waiting on Paolo:

> the OTHER half of that demo row is still dormant -- hubs, nearestHub, shelf, price,
> buy: "SPEND AT A TRADING HUB". All built, all uncalled. Same wire, and it needs one
> thing first: a price is a NUMBER, and numbers are his.

That was wrong and I had not read the file. He ruled it three days before I wrote it:

> **@RULING PRICES A (Paolo 8/11): "Three goods, priced off the scarcity sim we already
> have."** -- records/BOHEMIA_VERDICT_ICONS_AND_DEMO_BLOCKERS_8_11_26.txt

And `engine/bohemia_payday.js` has carried the answer in plain text ever since:

    var PRICE_SOURCE = 'economy';   // RULED 8/11 by Paolo, blocker 2 = A

So the lane asked him for a ruling, got it, wrote it into the code, and then spent
three days waiting for him to give it again. **A ruling nobody reads back is the same
as a ruling nobody asked for.** That is worse than the six other findings this week,
because those were things nobody had wired; this was a thing HE had already decided
and I put back on his plate.

This is the seventh time in one week this lane has found finished work that never
reached the surface he taps. The pattern is not "we lack rulings." It is "we do not
read them back."

## WHAT SHIPPED

**WHERE** -- `BohemiaPayday.hubs()` reads swap meets and truck stops out of the
overmap. MAP LAW holds absolutely: nothing is placed here. `bohemia_overmap.js` sites
those cells (L290 swapmeet, L315 truckstop); if the seed moves them, the market moves.

**WHAT** -- `bohemia_economy.js`'s GOODS: water, food, meds, fuel. Each already carries
its own real-world anchor in that file (3L sedentary vs 6-8L desert labor; a ration is
~2000 kcal; stale gas is cut with additives).

**HOW MUCH** -- the scarcity sim he ruled: hyperbolic in days-of-supply, anchored in
real siege data (Sarajevo 92-95, where staples moved 10-100x, not 2x). **Nobody typed
a price.** Thirty days of water is base price; four days is not.

**HIS TABLE STILL WINS AND IS STILL EMPTY.** `PURSE.PRICES` is checked before the sim
and has nothing in it. The day he names a price it beats the sim for that good and
nothing else changes. The gate asserts both halves and puts the table back the way it
found it.

**A MARKET IS A PLACE.** You cannot buy from the phone. The shelf only opens standing
IN the hub cell, which is what makes the walk from his house to the swap meet worth
anything. The phone's job is to tell him where it is, riding the GO door that already
exists (`__PHONE_JUMP__`, 8/12), not to sell to him.

**BUYING IS A HARD SINK.** Goods leave the world when consumed, so the stock the price
is computed from really drops and the next one is dearer. That is the half of a
faucet-and-drain economy that actually fights inflation.

**THE PRICES MOVE.** The ledger advances a day at every nightfall: produced, eaten,
shortfall logged. He will see a number change between day 1 and day 3 without anybody
touching a table, which is the entire reason ruling A was worth having.

## TWO CHOICES I MADE OUT LOUD SO NOBODY LATER READS THEM AS CANON

1. **The market is sized by the valley's own people.** The city page has no world
   model (payday's own header records that discovery), so there are no plots to
   census. What it does have is `BohemiaPopulation` -- the same module that decides
   who is standing on screen. So the customers are literally the people he can walk up
   to. A **sampled estimate**, built lazily on first open and cached in the save.

2. **Everyone scavs.** `advanceDay()` wants agents and the economy module defines
   exactly two job kinds: `site` (an organized crew at a real district) and `scav`
   ("subsistence sweep of an already-picked block"). Knowing who works a site needs
   plots this page does not have, so every head takes the module's own conservative
   kind. **Chosen, not invented.** When the run gains a real jobs model the same call
   takes real agents and nothing else changes.

## THE GATE

`gates/market_gate.js`, 32 assertions, registered in the suite as MARKET.

The one that exists because of the mistake above:

    ok('PRICES=A is READ BACK from the code that depends on it (Paolo 8/11), not re-asked',
       PAYDAY.PRICE_SOURCE === 'economy');

and the one that exists because of the other six:

> **VERIFY ON THE REAL SURFACE.** The sale is made twice -- once in the city page where
> I develop, and once **through the alpha's RUN tab where Paolo stands.** Every one of
> the six findings this week was green in the file it lived in.

It also drives, on the real surface: a hub the overmap placed, no button anywhere else,
a refusal while broke that says why, a real debit, buying making the next one dearer,
and a night in the valley moving the price again.

## WHAT IS STILL HIS, AND IS NOT BLOCKING ANYTHING

- `@DO pay <currency> <n>` amounts in the canon .bq quests. The verb shipped 8/12 and
  the reckoning says "nobody has ruled what this pays" and names the job. The moment a
  quest declares one it becomes a number and nothing else changes.
- What standing should unlock.
- `PURSE.PRICES` if he ever wants to override the sim on a specific good.
