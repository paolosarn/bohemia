# TWO PRICES — HIS RULING CAME BACK AND THE ROW LANDED (9/15/26, WORLD lane)

Board row `[two prices]` / ONE-PRICE-IN-THE-WHOLE-VALLEY, as **re-aimed by Paolo 9/15**.
Ships: `engine/bohemia_barter.js`, `gates/two_prices_gate.js` (28/0), the market shelf
and the till on the walked surface.

---

## 1. THE PENDING I RAISED CAME BACK ANSWERED

Last round I built the stranger's surcharge, measured that it made the first bag of
rice cost two days' work, took it out, and put the fork to him. His ruling:

> **THE SURCHARGE IS DEAD.** EVERYTHING COSTS ONE is his pillar and it holds
> everywhere for everyone. The spread lives in **ACCESS** and DISTANCE... **never a
> number above one.**

So the aim moves from *what it costs* to *whether they will take your money at all*.

## 2. AND RULING 8 ALREADY SAID EXACTLY WHERE

From the nine defaults (9/13), needing nothing added:

> **A TRADER WILL REFUSE MONEY AND ASK FOR GOODS: YES, AT A CAMP, TO A STRANGER.**
> BARTER_ONLY already exists and is unreachable. Wire it: a camp's shelf to a stranger
> (rung 0) trades goods for goods; a counted person pays one. In a real shortage the
> seller wants the thing, not the paper, from people he does not know.

**`BARTER_ONLY` had never run.** `bohemia_payday` carries the branch and answers with
that reason, and `PRICE_SOURCE` is the hard-coded string `'economy'`, so neither line
had ever executed. The pipe was built and never opened. This is the door it was built
for, opened where his ruling says and nowhere else.

## 3. THE SWAP ITSELF IS NOT BUILT, AND THAT IS MEASURED, NOT ASSUMED

The first cut really did trade, through the purse's own atomic `convert()`. On the
walked surface:

```
campBuy   applied: true      goods delta: 0      battery delta: 0
```

**The purse has ONE goods pocket** (`resources`, a count), so "one good for one good"
takes a resource and hands a resource straight back. A transaction that reports
success and changes no balance is rule 14(d) exactly — a thing that promises and does
nothing, the worst bug in the game.

So what ships is the **refusal**, which is real, visible, and is precisely what the
re-aim asked for. The swap waits on goods the purse can tell apart, which is an
inventory and not this row.

## 4. ON THE REAL MAP

Reading the game's own `mktShelf()` and `mktBuy()` at **every** market in the valley:

```
the market he wakes beside .... the Church's seat, a TOWN, two blocks from the bed
the first bag of rice ......... 1 battery, bought, battery -1 and goods +1
every shelf in the valley ..... not one price above one
a camp (Colorful, 35,56)
  as a stranger ............... shelf tagged TRADE, NOT COIN; buy REFUSED, BARTER_ONLY
                                battery delta 0, goods delta 0 -- nothing moves
  once they count you ......... barter off, price 1, battery -1, goods +1
page errors ................... 0
```

Nothing is typed. The stranger rung is read off his own ladder, and the gate proves it
**behaviourally**: move the bottom rung and the refusal moves with it.

## 5. THE TUTORIAL TRIPWIRE

The check that matters most in this gate is the one guarding the mistake I made last
round: **the first bag of rice still costs one battery.** Mutation-tested — make a
*town* refuse a stranger too, and that check goes red reading `battery 0, goods 0`.

| break it like this | checks that go red |
|---|---|
| a town refuses a stranger too | 3, **including the rice tripwire** |
| the camp never refuses anybody | 3 |
| a price above one onto a shelf | 6 |

## 6. NOT MINE, NAMED

`gates/you_can_start_it_gate.js` is an orphan — it exists and the suite does not run
it, so GATE REGISTRY is red. It is COMBAT's, from `08672ae2`, shipped concurrently.
Not touched here; registering another lane's gate means writing a description of work
this lane did not do.
