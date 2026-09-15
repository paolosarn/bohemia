# THE ECONOMY MASTER — WHAT FORTY-FOUR ROUNDS FOUND

ECONOMY lane, 9/15/26. **The queue is empty: Q1 through Q44 are all SHIPPED.**
MODE: RESEARCH. No engine code was touched by this file either.

**Why this exists, and it is not a job off the board.** CLAUDE.md carries a STANDING JOB:
*"periodically fold addenda into the GDD/laws masters and archive the folded. Piles rot;
masters stay clean."* Forty-four records is a pile. Nobody building the game is going to
read forty-four files, so the lane's output has been getting used one round at a time, by
whoever happened to see the last commit. **This is the pile folded into one page**, and
every line in it was harvested out of the record files by script, not recalled.

The 44 records stay where they are. Nothing is archived; nothing here supersedes anything.
This is an index with the findings attached.

---

## 0. THE FIVE THINGS THE WHOLE STUDY KEEPS ARRIVING AT

Forty-four rounds, four different questions each, and they converge on five walls. Every
one of these was reached from more than one direction, by rounds that were not looking for
each other.

### ONE. *** THERE IS EXACTLY ONE POCKET IN THE GAME. ***
**Rounds 24, 26, 29, 32, 33, 34, 35, 39, 40, 43.** Ten rounds, ten different subjects, one
wall. The purse is created once and every caller is the player's. No person, shop or
faction can hold, pay, be paid, or run out. **Round 40 costed the naive fix at 28,844
ledgers and the real one at 14:** the player has a purse, the shop needs **stock not a
purse** (and already has stock), and the only genuinely missing pocket is **a faction
treasury**, because a faction already mints a battery a day and already collects one a
night with nowhere for either to come from or go.

### TWO. *** ENFORCEMENT COSTS MORE THAN THE THING BEING ENFORCED. ***
**Rounds 39, 41, 42**, three mechanisms, same shape.
- **Eviction: 30x to 136x the debt.** One to three months of turnover plus 46 days empty,
  against a tenant who owes one night.
- **Collection: about 4x.** A real collector recovers 20-30%, so he knocks four times to
  get paid once, and is paid per visit either way.
- **A judgment is the weakest instrument in the record**, in Glasgow 1915 and in Russia in
  the 1990s, eighty years apart. Russia's courts worked; they just could not collect.
**This is why the coordinator's ruling 6 (exclusion, not seizure) is right for a reason
nobody had written down: exclusion is the only enforcement a poor valley can afford.**

### THREE. *** EVERYTHING COSTS ONE IS A PRICE CONTROL, AND IT IS THE REALISTIC SETTING. ***
**Rounds 36 and 38.** Round 36 found that the first sight of a crash is never a price, it
is something that used to work and does not — and the cause, every time, is a **pinned
price** pushing the scarcity into the door, the queue and the back room. Round 38 turned
it over: **ONE is not the normal price with a discount on it, it is the INSIDER price**,
and everybody else pays the street. Every real spread runs 1.7x to 13.3x, and every one of
them turns a battery into a fraction the game cannot say — **but the inverse is clean.**
His 8/15 law does not need defending. It is the mechanism.

### FOUR. *** THE DOOR IS A PERSON, NOT A PERMIT. ***
**Rounds 38, 39, 42, and the belonging ladder underneath all three.** Of five documented
ways to buy at the old price, **four were a person** — an official, a guard taking 30% at
the warehouse door, a customs relationship, a cueva owner who needed you vouched for. The
fifth was Zimbabwe's coupon, **and within months it stopped being about fuel and became the
money.** A transferable claim on a better price does not create arbitrage; it out-competes
the currency it was priced against. **In a game whose money is already an object, the door
must never be an object.**
And the game already has the door: **`counted`**, rung four of five, whose own note reads
*"you are on whatever list they keep, and that is a different thing from being liked."*
Two independent modules arrived at that same rung as the threshold for "they will do
something for you."

### FIVE. *** THE PARTS ARE RIGHT AND THEY HAVE NEVER MET. ***
Named in every round from 16 to 44 — twenty-nine rounds — and it is the one finding that is
about us rather than about the world. The gates check that a part does what it says.
**Nothing checks that two parts agree, that a part keeps working for as long as the game
lasts, that it is the right part to have, or that the parts form a loop that closes.**
The catalogue of instances, all measured:
- `convert()` atomic and correct, **zero callers** for six weeks.
- `transferIn()`, **zero callers**.
- `relight()` correct, free, **zero callers**, with a comment saying its price is unruled
  when the ruling that prices it landed *before the function was written*.
- `price()` with a comment asserting a table is empty, **months after it was filled** — so
  the scarcity sim Paolo himself chose on 8/11 has been unreachable, 43x of spread one
  branch away from a player.
- `buy(purse, hubOrNull, ...)` **handed a hub it throws away**, because `price()` has no
  parameter for it.
- `MKT_LEDGER` a **singleton** one line under a cache that is correctly keyed, so all
  sixteen markets share one barrel — **which is the actual reason there is one price.**
- `refuse`, the trade-withholding sign, **reserved in the source for the unpaid landlord by
  name**, with no caller ever written.
- `bohemia_down.js` and the movement system: a person can fall and the party still walks
  8.6 km that day.
- **Seven water plants on seed 1 and not one on a live street**: a working `lift()`
  returning zero litres, every gate green, because no gate can ask *does the valley have
  water.*

---

## 1. THE FORTY-FOUR, IN ORDER

| # | row | what it found |
|---|---|---|
| 1 | money dies | the price is not the story, the refusal is |
| 2 | money returns | a battery is not a coin, it is a container |
| 3 | rebuild order | nobody rebuilds a building first |
| 4 | first building | the first building a player places is an airbase |
| 5 | numberless | fifteen numbers on the shop card |
| 6 | casino backstage | a casino is not a prize, it is a job |
| 7 | water supply | the city sits a thousand feet above its own water |
| 8 | battery value | the money supply is the cells, not the charge |
| 9 | trust credit | a debt is not a number, it is a person who remembers |
| 10 | market day | fourteen permanent shops for a few thousand people |
| 11 | inflation feeling | the price cannot move, and that is the right answer |
| 12 | who's housed | a vacant building is not housing |
| 13 | printed money | the valley fills itself in eleven days |
| 14 | rent share | the rent is not a sink, and our ladder has no fractions |
| 15 | first hour | the missing thing is not the rice, it is the bag |
| 16 | debt spiral | we built the last rung first |
| 17 | wages fall | the wage line survives and stops being the pay |
| 18 | market refuses | a market is what it refuses |
| 19 | shelves premise | the world stops talking on day sixty-seven |
| 20 | a day's work | everybody in the valley has a job except the player |
| 21 | closed loop | the only loop that closes is the exploit |
| 22 | first debt | the first one is a cliff, not a slope |
| 23 | rebuild order | the order is about earning, not about surviving |
| 24 | owed to you | the more they owe you, the less you leave |
| 25 | batteries scarce | a money drought does not raise prices, it stops trade |
| 26 | forgiveness price | you cannot buy it, but it has to cost you |
| 27 | shift pay | a shift pays one; the design is how many days you get one |
| 28 | ridge worth | the ridge is not about what changed |
| 29 | nothing left | the shelves fill up and nobody can buy |
| 30 | perk price | the runner and the enforcer are paid the same |
| 31 | cheap eyes | the player is the only one who does not get better at knowing the valley |
| 32 | long injury | the bone is not the timer |
| 33 | barter day | nobody barters for long, they print |
| 34 | who profits | there is a landlord in this valley and it is never the player |
| 35 | rent riot | a strike is not about withholding, it is about the vacancy |
| 36 | first ten | a crash does not start with a price, it starts with a missing price tag |
| 37 | carry cost | a small group cannot carry one of its own |
| 38 | old price | ONE is the old price, and the door is a person |
| 39 | protection court | the court was never the missing part, the bailiff was |
| 40 | how many pockets | two pockets, and neither of them is the shop |
| 41 | who replaces you | eviction is not the owner's weapon, it is his loss |
| 42 | the bailiff | the shame list backfires, and the collector mostly fails |
| 43 | double up | twenty-five empty homes each, and they double up anyway |
| 44 | first building | the pump is already built, and it is dark |

---

## 2. WHERE THE FINDINGS WENT

Every record carries a ROUTED section; all 44 do. Counting **distinct rounds** that routed
something to each lane:

    WORLD          43 rounds        COMBAT          6
    LIFE + CITY    26               WORDS           5
    FACTIONS       24               PLUMBER         5
    PEOPLE         22               EYES            3
    COORDINATOR    22               DIRECTION       1
    RUN            12               CUTSCENE        1
    UI             11
    QUESTS         11

**WORLD is the destination of this lane, 43 rounds out of 44.** That is by design — the
lane's own MODE says every finding becomes a WORLD job — and it is also the risk: one lane
holds nearly everything forty-four rounds produced.

(Probe note, kept: my first count reported **WORLD 77** by counting line hits instead of
distinct rounds, which is more rounds than exist. The correction is the same discipline the
records carry throughout — a number bigger than its own denominator is an instrument fault,
not a finding.)

---

## 3. THE FOUR NUMBERS ANYBODY BUILDING FROM THIS SHOULD HAVE

Derived, never typed, each with the round that measured it.

| the number | value | round |
|---|---|---|
| the street price against the insider's one | **a whole multiple, 2 to 5** | 38 |
| a protection cut, in our money | **one battery per deal**, or one every 5-10 days worked | 39 |
| carrying one of your own | **1 km and the day is gone** for a party of four, double food per bearer | 37 |
| replacing a tenant | **30 to 136 batteries against a debt of 1** | 41 |
| chasing a debt | **about 4x**, because a visit costs one and succeeds one time in four | 42 |
| doubling up | **cap two**, host is PAID not charged, and it is sticky | 43 |
| the valley's water | **one lit pump feeds everybody**, 18,524 L for 20 kWh | 44 |

---

## 4. WHAT IS STILL OPEN

**Thirty-three questions in the lane's handoff block** (items 1-9 were ruled by the
coordinator on 9/13 and their numbers are kept empty so every cross-reference in the
records still resolves). The three biggest, restated in one line each:

1. **Can a deal exist between two people who are not the player?** Five obligation systems,
   all of them pointing at him. A third party can only enforce something that exists
   between two others, so protection, the strike, market day, lending and restitution all
   stop here. (pending 41, from round 39)
2. **Is ONE the price for the person who is in?** Section 0.3. Not a number question, a
   what-is-this-game question. (pending 40, from round 38)
3. **Should the valley have more than one shop?** The stock singleton is a one-line fix and
   the lane is not asking permission for it. The question under it is whether a town should
   be able to run out while the next one is full. (pending 42, from round 40)

And two rulings this lane tested came back needing **one clause each**, with the rest
confirmed:
- **Ruling 9** (doubling up): *"when there is nowhere else"* cannot fire in a valley with 25
  empty homes per occupied one. It should read **"when a household cannot pay for its own."**
- **Ruling 4** (the pump first): *"power comes second"* should read **"the first power goes
  to the water."** Not build the pump. **Light it.**

---

## 5. THE GATE NOTE

**Pre-push pass**: economy, purse, payday, attempt, canon rot, demo blockers, language,
handoff. Results in the commit.
**Full suite: 107 red at `ad23d875`, mine are: none, measured** (round 43's sweep of ten
gates; nine green, one red on a surface this lane is forbidden to touch).

Rule 14: research rounds never touch the demo, and only THE RUN re-cuts.
Rule 15: this lane presents nothing for a thumb and never has.
Rule 16 (THE STEP IS A HOUSE, Paolo 9/15) changes nothing this lane has measured: every
economy number here is per person, per day or per battery, and none of them is a distance
on screen.

---

*ECONOMY, 44 of 44 shipped. Research only. Nothing in the game changed.*
