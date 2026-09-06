# EVERY PART OF VEGAS HAS AN OWNER, AND THE VALLEY HAD TWO SHOPS
# 9/5/26, WORLD lane. VAMILY [faction towns] — FACTION-TOWNS. **SHIPPED.**

> "each part of Vegas is owned by a faction and that's where you can do all your trading or
> whatever they'll have different buildings supporting them... there's different sizes of
> cities so maybe the more bigger or more prominent factions kind of feel like strong
> fortress parts... and then for the smaller ones like the colorful maybe they just have...
> not a lot of goods not a lot of buildings not a lot of good quests and it's just smaller."
> — Paolo, **9/4**, LOCKED

## THE FIRST MEASUREMENT, AND IT DECIDED THE WHOLE SHAPE

Before designing anything, I counted the markets in the valley.

| | |
|---|---|
| trading hubs on the whole 96×96 map | **2** |
| where they are | a swap meet at (44,10), a truck stop at (56,88) |
| where the game opens the player | (48,48) |
| **walk to the nearer one** | **38 cells** |

**The entire economy of Las Vegas was two shops, and the nearer one was three and a half
kilometres from the front door.** Day 19 had already measured the first required person at a
seven-hour round trip and written it down as a demo problem. It is the same problem.

## THE TIER IS DERIVED, AND HIS OWN WORDS ARE THE TEST

His faction graph has carried `act1_power` and `act3_power` for every faction since the GDD.
Rank them, cut in thirds: top third **FORTRESS**, bottom third **CAMP**.

**He named "the colorful" as the small one. Colorful is act1_power 1 of 14** — the bottom of a
graph he wrote months before that sentence. Nothing was tuned to make that land, which is the
only reason the derivation is worth trusting. Remnants, at 14, is a fortress.

And it gives the **CENTURY RULE with no new field**: `act3_power` is already there, so Reds
climb from town to fortress, Caravans fall from fortress to town, Anarchists drop to camp,
Trades rise. Four factions move between acts off numbers that already existed.

Every tier ships `draft:true`. Both override doors — `SEATS` and `TIER` — ship **empty**.

## THE BUG THIS FOUND, WHICH IS BIGGER THAN THE FEATURE

The law says the 14 factions are *"already placed on generated districts"*. They are. **In two
different places, and the two disagreed.**

| | |
|---|---|
| `bohemia_loop.js` strides over cells passing `bohemia_world.js`'s `isAutoDistrict` | **3,919** |
| the walked surface cannot load that module at all, and counts `bohemia_cityedit.js`'s `cat()=='sand'` | **4,009** |
| same seed, same valley, seats produced | **DIFFERENT** |

Ninety cells of disagreement, and therefore **two different answers to where the Mob lives.**

Nothing had noticed because **nothing had ever asked the walked surface the question.** Its own
`FACTION_ASSIGN` table is `{}` and its comment says so. The first thing that asked found it.

So the seat rule lives in `engine/bohemia_towns.js` now, once, and callers pass the map instead
of the answer. `bootFactions` was rewired to it. **Measured after: identical, all fourteen.**
Same reason PRICES is built from the economy's own GOODS instead of a hand-typed list.

## A SEAT IS A HUB, WHICH IS WHY ALMOST NOTHING HAD TO BE WRITTEN

His ruling says a seat is *"where you can do all your trading"* — so a seat **is** a market by
his own definition, and it belongs in the hub list rather than in a second list beside it.
`nearestHub`, the am-I-standing-in-a-market test, the shelf, the till and the card all work on
a seat with nothing changed.

| | before | after |
|---|---|---|
| markets in the valley | 2 | **16** |
| walk from the opening cell | 38 cells | **9** |

## A CAMP IS THINNER, NEVER DEARER

`shelf()` has taken a `hub` argument since it was written and **ignored it**, and the city
never passed one — so every market in the valley carried identical goods. It takes the tier now.

Photographed on the walked surface:

> **CARAVANS · FORTRESS** — 06:00 · you have 3 batteries
> WATER · FOOD · MEDS · FUEL, one battery each

> **COLORFUL · CAMP** — 06:00 · you have 2 batteries
> WATER · FOOD

**Depth is the only axis his words give.** Everything costs one battery wherever you buy it
(8/15 + 9/4), so a camp charging more would be a number nobody ruled. "Not a lot of goods" is
a count. **Which** goods a town carries belongs to its buildings and is BB-WANTS' row.

## THE GAP THAT KEPT THIS ROW OPEN A ROUND, AND WHAT CLOSED IT

Adding 14 seats broke `payday_gate`'s reachability check, which had been green. Good.

Diagnosed rather than assumed: the failing seats were on **solar arrays, golf courses and
farms** — plots with **zero buildings**. Not a road problem. **A solar field is not a town**,
and his own law says in its own words that *what supports a town is buildings*.

**MY FIRST MEASUREMENT ASKED THE WRONG QUESTION.** I asked which district kinds are *always*
empty and got four — airbase, airport, solar, strip — excluded them, and the count went 7 → 2.
Two seats were still standing on nothing.

**A seat lands on ONE cell.** So what matters is not whether a kind is always empty but whether
it can **ever** be: a kind that is usually built and sometimes not will eventually put a market
on nothing. Asked again, exhaustively, over every buildable kind across two seeds:

| | |
|---|---|
| kinds with at least one empty plot | **8** — airbase, airport, datafort, farm, golf, solar, speedway, strip |
| kinds built on every plot examined | **49** |

All eight are out. Re-measured: **84 seats across six seeds, ZERO unreachable.** The ceiling in
`payday_gate` is now **0** and only ever goes down, so a kind that starts generating an empty
plot shows up as a red gate rather than as a shop nobody can reach.

It is also the reading that matches his ruling in plain words: **a runway, a solar field, a
fairway and a farm are not parts of a city you trade in.**

And the fix stayed where it had to. I could have filtered in the caller instead. **That is the
wrong fix and I did not take it**: `reachable()` needs `plot()`, so the loop would nudge those
seats and the walked surface could not, and the two would disagree again — the exact drift this
work exists to end.

## THE GATE — `gates/faction_towns_gate.js`, 32 checks, registered as FACTION TOWNS

Fourteen seats, fourteen tiers, both override tables empty, Colorful in CAMP, thirds at 5/4/5,
four factions moving between acts, depth strictly increasing camp→town→fortress, a market that
opens where a faction sits, a card naming the faction and the size, a real purchase in
batteries, and the demo clause.

**Check 3 is the whole point of the file**: it asks *both* surfaces, through the **shipped
module** rather than a rule retyped in the gate, and they must name the same fourteen seats.
Proved red: make one side stale and all fourteen differ.

**And my first comparison was wrong in exactly that way** — it re-implemented the seat rule
inside the probe, so when the real rule changed it reported a disagreement that was its own.
A comparison that reimplements one side proves nothing about the other.

**One of my own checks was wrong too**: it grepped the module source for `/price/i` and went
red on its own comments (*"prices are Paolo's"*). **A checker that cannot tell a mention from a
use is the broken one** — 8/1 law, third time this repo has paid for it. It asks the data now.

## VERIFIED

| | |
|---|---|
| walked surface | 16 markets; stand in Caravans' fortress and buy water for a battery; Colorful's camp carries half the goods |
| demo, through the splash | 14 seats; nearest is **HOMELESS · CAMP**, **7 cells** out; market opens; water bought for 1 battery |
| seat reachability | **0 unreachable across 84 seats on 6 seeds** (was 7) |
| the two surfaces | **identical fourteen seats**, asked through the shipped module |
| gates | faction towns 33, payday 38, demo build 25, purse 28, day pays 18, economy 13, demo blockers 22, four verbs 32, lights bill 30, placeholder 14, pages publish 18, loop faction bridge 68 — **338 checks, 0 failed** |

Two gates were **already red on main before this round and still are**: `market_gate` 22/10
(a stale ruler another lane has flagged for three rounds) and `faction_outfit_gate` 16/2 (two
faction outlines too close). Neither is mine and neither moved.

## WHAT IS STILL HIS

Which faction sits where. Any tier he wants to move. What a town **sells** and **wants**, which
comes from its buildings. Every amount.
