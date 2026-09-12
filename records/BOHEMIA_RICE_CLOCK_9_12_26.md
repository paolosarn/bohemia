# THE BAG OF RICE IS THE TUTORIAL (9/12/26, WORLD lane) — board row [rice clock]

Ship: `engine/bohemia_payday.js` (buy is a conversion), `engine/bohemia_hunger.js`
(new), the walked surface, and `gates/rice_clock_gate.js` (28 checks, registered as
**RICE CLOCK**). Tab: **CITY**, on the nightfall card. Also in the demo.

---

## THE ROW, THE MANAGER'S OWN CALL (9/5)

> "everything costs one and a day of work pays one; the one thing you must buy
> every day is the whole economy in miniature. Hunger is the clock: a day without
> the bag shows on the body and the purse, and the first purchase of the game is
> rice, taught by wanting it, not by a text box."

## THE BUG UNDERNEATH IT, AND IT WAS THE WHOLE LOOP

This lane's handoff has carried it for six rounds. Measured on the walked surface,
with five batteries in the purse:

```
buy food        applied:true, paid:1      electricity 5 -> 4
resources                                 0 -> 0
the day eats    day:ate REFUSED, INSUFFICIENT
ledger          drain electricity -1 buy:food        ...and nothing came back
```

**You bought food, the food did not exist, and then you starved.**

`buy()` debited the battery and credited nothing, on this reasoning, in its own
words: *"A HARD SINK, on purpose: the goods leave the world when you consume them,
so the value is DESTROYED rather than moved."* The second half of that sentence is
right and the code did the first half **at the wrong moment** — it destroyed the
battery at the shop, so the good never arrived and the verb that eats had nothing
to eat.

## THE FIX WAS ALREADY WRITTEN IN THE LAW AND ALREADY BUILT IN THE PURSE

The four-verbs law says where the sink belongs: *"each resource is spent by exactly
one verb, so you always know what took it"* — and the verb that spends `resources`
is `day:ate`.

**SHOPPING MOVES VALUE. EATING DESTROYS IT.**

`convert()` has been in `bohemia_purse.js` since 7/31 **with zero callers**, and it
is atomic on purpose: it unwinds the first leg if the second fails, so a battery can
never leave without the good arriving. It was built for exactly this.

The good lands in `resources` because that is where goods live — it is the pocket
both verbs that consume a good drain (`day:ate`, `fight:plate`). That is the game's
own statement about it, not a mapping invented here. One battery buys one of the
good; if the scarcity sim quotes more, you pay more for the same one thing, which is
what scarcity means and what a purchase means.

**After:**

```
buy food        electricity 5 -> 4,  resources 0 -> 1
the day eats    applied:true,        resources 1 -> 0
ledger          convert electricity -1 buy:food
                convert resources   +1 buy:food
                drain   resources   -1 day:ate
```

Work → battery → rice → eaten. The economy in miniature, closed.

## HUNGER IS COUNTED AND SAID, NEVER SUFFERED

*"a day without the bag shows on the **body** and the purse."* What a week without
food does to a body is **damage**, and NO DAMAGE BEFORE THE DIAL is locked. The day
loop had already written the same sentence about this same moment:

> "NO DAMAGE BEFORE THE DIAL. The reckoning REPORTS; it does not starve you"

So the clock counts the days and says them, with rising weight, and what that
finally costs a body is his dial. On the nightfall card:

```
Nobody ate today. There was no food in the house.
Two days now with nothing to eat. They are asking.
3 days with nothing to eat. Somebody has to buy food.
5 days with nothing to eat. They are not asking any more.
```

The words **name the thing to buy**, because "taught by wanting it, not by a text
box" means the game says what is missing and lets the player go and want it.

**The count is derived from the ledger, never stored.** The purse is the truth and
already records every `day:ate` that applied and every one that did not. A second
counter beside it is how two records of one fact start disagreeing — the same reason
the century ledger derives its totals and the production tick asks the ledger
whether a day was paid rather than keeping a boolean.

**And it reads the day that has HAD its nightfall.** The verb fires at nightfall, so
asking mid-morning whether today was fed would report every day as hungry all day
long — a clock running one day behind reality.

## MEASURED END TO END ON THE WALKED SURFACE

```
night 1   streak 1   Nobody ate today. There was no food in the house.
night 2   streak 2   Two days now with nothing to eat. They are asking.
night 3   streak 3   3 days with nothing to eat. Somebody has to buy food.
night 4   streak 4   ...
night 5   streak 5   5 days with nothing to eat. They are not asking any more.

then one battery buys one bag of rice
that night   streak 0, the hunger line gone, the food eaten
```

## ONE CHECK OF MINE WHOSE SUBJECT LEGITIMATELY MOVED

`payday_gate` asserted *"the spend is recorded as a HARD SINK, not a transfer"* by
checking that **buying** posts a drain. It does not any more — and that is the fix,
not a regression.

Unlike a broken ruler, this check's claim about the shop became genuinely false
because the design moved. So it was rewritten to guard the property it exists for,
in both halves: buying is **never a transfer** (nobody is paid; that is rent's
shape, not a shop's), the good **really arrives**, and **the hard sink is still
there one step later** when the day eats it. A faucet with no drain is still the
thing being guarded against. Proved still biting by putting a plain drain back:
3 red.

## PROOF

- `node gates/rice_clock_gate.js` → **28 passed, 0 failed**, registered, suite 601
- red both ways: put the original bug back → **7 red**; make the clock never run →
  **3 red**
- PAYDAY **40/0** (was 38/0; the rewritten check adds two), PURSE 28/0,
  OWN POWER 29/0, BATTERIES MINED 36/0, A DAYS WORK 37/0, VALLEY RUNS OUT 25/0,
  CENTURY STAYED 34/0, DEMO BUILD 25/0, PAGES PUBLISH 18/0, GATE REGISTRY 6/0
- MARKET 22/10, unchanged: it still expects `resources` to be the money and has
  been red since the money became batteries on 9/5. Not this row's, and not moved
  by it.

Build stamp: **BUILD 9/12u - THE BAG OF RICE IS THE TUTORIAL**
