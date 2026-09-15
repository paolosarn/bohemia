# BLOCK STRIKES — THE PICKET CANNOT BE COUNTED (9/15/26, WORLD lane)

Board row `[block strikes]` / WE-BUILT-THE-CUT-OFF-AND-NEVER-BUILT-THE-STRIKE.
**Nothing shipped to the game.** Put back to OPEN. The fix is PEOPLE's lane.

---

## THE ROW

> when a whole block stops paying, the owner's cut stops working unless he can
> replace them; the block's weapon is holding the door.
> Glasgow 1915: 25,000 families stopped paying and won in nine months, and the
> mechanism was not the money, it was the VACANCY.

## WHAT MEASURING FIRST SAID (rule 12)

**a. There is exactly one rent payer in the valley, and it is the player.**
`rentOn()` is handed `TURF_USED`, which counts the blocks the player walked, and
nothing else calls it. So "a whole block stops paying" cannot be twenty households
withholding twenty rents — those rents do not exist, and inventing an economy for the
neighbours to withhold would be inventing the thing the row is about.

**b. But the block is real and populated.** The player wakes on neighbourhood 12,12
with **20 homes and 20 people**, each with an id (`12:12:0`), a household
(`H12:12:6217:6475`), a home, an archetype and a schedule.

**c. And the game already has the picket.** `bohemia_standing` has carried
`whoVouches()` and `whoWont()` since it was written — who stands with you and who
won't, off real deeds, with gossip and half-life already applied.

**d. And since `[every pocket]` (9/14) the owner can actually lose money.** Until a
faction held a purse there was no way for a cut to cost an owner anything, so the
row's whole asymmetry was unbuildable. That row was the precondition for this one.

## SO I BUILT IT

`engine/bohemia_strike.js`: the block holds the door when **more of it vouches than
won't** — a majority is the shape of a picket, not a threshold somebody set, so
nothing ships a weight, a score or a dial. When the door is held the cut cannot be
made to stick and the owner gets nothing for it. Otherwise the light can be bought
back at his ruled ONE, read off `PRICES.power` rather than typed, paid into the
owner's own purse through the road `[every pocket]` built.

## AND THEN THE ONE MEASUREMENT THAT KILLED IT

```
CT_MINDS at the door ......................... 0
CT_MINDS after twelve hours of game time ..... 0
people on the player's block ................. 20
of those 20, how many have a mind ............  0
```

**Minds are born when something touches `ctMind()`, which is the outfit cards — not
people walking past.** The city's own comment says minds are "exactly the set of
people who have been near enough to witness anything", and measured, that set is
empty and stays empty through ordinary play. So `whoVouches()` over the block returns
nothing, always. The picket cannot be counted, and a mechanic that turns on a count
that is permanently zero is dead code.

**This is not a number nobody ruled.** The weights are fine: `bohemia_clout` fills
`DEED_WEIGHT` at load by scanning the quest corpus — 83 rows, 0.6 to 1.2, all real.
The problem is that the **people** have no minds.

## WHY I DID NOT FIX IT

Giving a block's residents minds so they can hold an opinion is **09 PEOPLE's lane**.
Building it here crosses ONE SYSTEM, ONE SESSION. Measured and handed over, not taken.

## ONE THING FOUND ON THE WAY, FOR WHOEVER OWNS IT

**None of the five city deed kinds is in the weight table.** `claim:met`,
`claim:refused`, `commit`, `favour` and `loan:short` are all absent, so a deed done in
the walked city is witnessed, remembered, retold — and weighs nothing. Every weighted
row is keyed `q:<quest>:<stage>@<FACTION>`, derived from the authored quest corpus. The
city's own comments already record this for four of the five; `loan:short` is mine,
from `[someone lends]`, and it is in the same position.

## THE SHAPE THIS ROUND KEEPS TURNING UP

Two rows in a row measured out blocked, and both the same way: **every part the row
names is real except the one it turns on.** `[two prices]` had a price table that
already answered everything; this had a standing web with nobody in it. The queue is
not blocked on effort, it is blocked on inert parts, and only measuring finds that.
