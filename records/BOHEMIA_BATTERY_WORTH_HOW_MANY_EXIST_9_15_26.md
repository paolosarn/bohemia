# BATTERY WORTH — THE ROW ASKED WHAT ONE IS WORTH; THE ANSWER IS HOW MANY EXIST (9/15/26, WORLD lane)

Board row `[battery worth]` / YOU-ARE-BUYING-THE-CONTAINER.
Ships: `engine/bohemia_cells.js`, `gates/battery_worth_gate.js` (25/0), one line on the
card he reads every night.

---

## 1. THE ROW ASKED FOR A LADDER AND ITS OWN SOURCE REFUSES ONE

> Put the ladder in the game so a big battery is not just a bigger number.

`records/BOHEMIA_ECONOMY_DAY_8_THE_MONEY_SUPPLY_IS_THE_CELLS_9_5_26.md`, §4b:

> Q8 asks for denominations. The honest answer is that **EVERYTHING COSTS ONE already
> removed the denominations of price**, so all of the design work has moved into the
> SIZE OF ONE UNIT of each good... If he ever wants physical denominations, make them
> **BODY-SCALE, NOT NUMERIC**: a cell in a pocket, a car battery two people carry, a
> bank on a cart. **Not one, five and twenty five.**

So a numeric ladder is refused by the record the row cites. What that record puts in
its place is the finding it calls the one that proves us wrong:

> **WE HAVE BEEN ASKING WHAT A BATTERY IS WORTH. THE REAL QUESTION IS HOW MANY
> BATTERIES EXIST, BECAUSE THE VALLEY CAN MAKE CHARGE ALL DAY AND CANNOT MAKE A
> SINGLE CELL.**
> The supply is fixed and shrinking. The value inside each one is renewable. So the
> money gets scarcer while staying just as useful.

## 2. AND NOTHING IN THE GAME HAD EVER ASKED IT

Until `[every pocket]` (9/14) nothing **could**: there was one purse in the whole
game, and the sum of one purse is not a money supply.

Asked now, on the real pipe:

```
ten days of work
  the valley's batteries .... 0 -> 10
  the purse's own flow ...... source (made from nothing) 10, drain 0, transfer 0
```

**A day of work mints a cell.** `payForWork` credits kind `source`, which is the
purse's own word for created-from-nothing, so the money supply grows by one every day
the player works, without bound. That is exactly the infinite money the record warns
about — *"a single working panel is infinite money unless the number of cells is
fixed"* — and it is live today.

## 3. WHAT SHIPPED

`engine/bohemia_cells.js` asks the question and the night card answers it:

```
BATTERIES IN THE VALLEY: 10 across 15 hands, and 10 more exist than last night
```

`count()` is the valley's cells across every holder. `made()` is how many were
created rather than found, read off the purse's own `source` vs `transfer` split
rather than inferred. The money is read off his price table, never typed — rename the
currency in `PRICES` and this follows it.

## 4. WHAT DID NOT SHIP, AND WHY

**The fix.** Making the supply fixed needs a **starting stock** — how many cells were
in the valley when the lights went out — and that number is not ruled. Every version
needs it: a pool that work draws from needs a size; paying the player out of a faction
treasury needs those treasuries to start non-empty, which is the same number wearing a
hat. Ship an empty pool and a day's work pays nothing on day one, which breaks the
loop `[rice clock]` exists to close.

**This lane already broke the first bag of rice once this round.** It will not do it
again to make a mechanism fire.

When the number lands this becomes the fix in about an hour: seed a holder with it,
turn `payForWork`'s credit into a `hand()` from that holder, and `count()` becomes a
countdown instead of a tally. Nothing else moves.

## 5. NAMED SO NOBODY HUNTS IT

**The 267x unit bug is real and unreachable.** `power` is priced at one battery with
unit `kWh`, and one kWh is 267 AA cells of energy — the record calls this the one row
in the table where the unit is wrong. But `power` is on **no shelf** (fortress:
water, food, meds, fuel; town: water, food, meds; camp: water, food) and nothing
anywhere converts kWh into batteries — the pumps compute kWh and `[water lifted]`
deliberately left them uncharged. Wrong, and not a live pump.

## 6. THE GATE

| break it like this | checks that go red |
|---|---|
| count only the player instead of the valley | 5 |
| drop the line off the night card | 1 |
| let `made()` count transfers as minting | 1 |

**That last one passed at first.** Nothing had moved yet when the check asked, so
adding transfers changed nothing. The check now moves cells between holders *before*
asking. A check that cannot tell **made** from **moved** is the broken one, and that
is the whole claim of the row.

## 7. THE RATCHET

Rule 14(a) as amended 9/15: the demo at the link is cut from the alpha on every
deploy, so shipping to the alpha is shipping to him, and the ratchet binds every push.
Walked with the one driver on this tree: door opens, controls render, the seam crosses
by pinch and comes back, **zero page errors**. Nothing is worse.

## 8. [PENDING Paolo]

**How many batteries are in the valley on day one?** Everything else about the money
supply is built and measured; this is the one number, and it turns a tally into a
countdown.
