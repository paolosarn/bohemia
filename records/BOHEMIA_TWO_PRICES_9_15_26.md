# TWO PRICES — I BUILT IT, IT BROKE THE TUTORIAL, AND I TOOK IT BACK OUT (9/15/26, WORLD lane)

Board row `[two prices]` / ONE-PRICE-IN-THE-WHOLE-VALLEY. **Nothing shipped to the
game.** This is the measurement, the reason the row cannot land as written, and the
one ruling it is blocked on.

---

## 1. THE ROW'S PRESCRIBED FIX DOES NOTHING, AND I CAN PROVE IT TWICE

> mktLedger() ... is never keyed, so SIXTEEN MARKETS SHARE ONE WAREHOUSE... price()
> is a pure function of stock, so one ledger is one price. **Key the ledger by
> MKT_HUB_KEY first, one line.**

**(1) The economy's `price()` never runs for anything on the shelf.**
`BohemiaPayday.price()` checks `BohemiaPurse.PRICES` first and returns. PRICES was
filled on 9/5 with all eleven goods at **1 battery**, ruling
`8/15 EVERYTHING COSTS ONE + 9/4 BATTERIES ARE THE MONEY`. Every quote on the walked
surface comes back `source:'ruled'`. The ledger prices nothing.

**(2) And if it did run, it would still be one price, by construction.**
`price = base × scarcity(stock / (need × agents))`, and `makeLedger` sets stock as a
multiple of agents. The agents term cancels exactly:

```
heads   20   food stock  169   daysLeft 8.4   price 5.33
heads 1000   food stock 8447   daysLeft 8.4   price 5.33
```

The valley's real markets run 20 to 204 heads and quote the same number.

**So there is one price because Paolo ruled one price.** His law working, not a bug.

**And a trap the row walks into:** `makeLedger` does `rng((seed ^ 0xEC0) >>> 0)`, so a
**string** seed coerces to NaN and `NaN ^ x === x`. `'hubA'` and `'hubB'` both seed
3776 and build the identical ledger. `MKT_HUB_KEY` **is a string**.

## 2. I BUILT THE ROW'S REAL SHAPE, AND THE GAME SHOWED ME IT BREAKS THE TUTORIAL

ECONOMY Q38, decided 9/13: *ONE is the INSIDER price; where you are nobody you pay the
street.* I built that — a stranger pays the ruled ONE plus a battery of carry at a
remote market, belonging forgives it — wired it to the shelf and the till, and proved
it on the walked surface: near market 1, far market 2 tagged THE STRANGER'S PRICE, the
till took 2, then belonging dropped it to 1 and the till followed. 38 checks,
mutation-tested five ways.

**Then RICE CLOCK went red, and it was right.**

```
a day of work pays ........ 1 battery   (PAYOUT COMPLETE, his 8/15 ruling)
a bag of rice costs ....... 1 battery   (PRICES food, the same ruling)
the player wakes at ....... cell 48,48
his nearest market is ..... the Church's seat at 47,50, TWO BLOCKS AWAY
```

With the surcharge on, that market charged a stranger **2** for food. **The first bag
of rice in the game costs two days' work**, at a shop two blocks from the bed, to a
player who by definition has not met anybody yet. That is the exact loop `[rice clock]`
exists to close — work → battery → rice → eaten, on day one — and it is in the first
five minutes, which beats my queue.

**Any stranger surcharge does this.** The player starts at rung *stranger* with
everyone, so forgiving the carry one rung earlier does not help. The collision is not
with my distance rule, it is with the surcharge itself.

## 3. AND DISTANCE HAS NO HONEST MEASURE IN THIS VALLEY

I wrote the distance term three times. All three are wrong, and the reason is
arithmetic, not taste.

A waking day covers **22.5 blocks** on foot (9 m a minute, 384 m a block, 16 hours), so
a **round trip fits a day up to 11 blocks**. The valley is **96 blocks across**. Almost
every pair of places in it is more than a day's round trip apart, so "inside a day"
cannot separate markets in any meaningful way. It separates noise:

| what I measured | what it said |
|---|---|
| distance to the nearest OTHER market | 10 near / 6 far — but seats are placed `MIN_APART = 6`, so this measures **seat spacing**, and it calls the Church's seat at (47,50), the most central market on a 96×96 map, "the end of the road" |
| distance from the centroid of all markets | **1 near / 15 far** — wrong the other way |

STOP PRODUCING (7/26): *"writing a fourth version of anything means you already failed
— stop and say so instead of fixing the attempt."* So I stopped.

## 4. WHAT I DID WITH IT

Took it out. `engine/bohemia_spread.js` and `gates/two_prices_gate.js` are deleted, the
shelf and the till are back to exactly what they were, and the optional `quote`
argument on `payday.buy` is gone. RICE CLOCK is 28/0 again.

A module nothing calls is the anti-pattern this lane has spent the round killing —
`transferIn` with zero callers, `canBuild` with zero callers for two months,
`produce()` called only by its own gate. The design is written down here instead, and
it is an hour's work to rebuild the moment there is a ruling.

## 5. WHAT THE ROW IS BLOCKED ON — [PENDING Paolo]

**Does a stranger pay more than one battery?**

His 8/15 law says EVERYTHING COSTS ONE. ECONOMY Q38 (decided by the coordinator 9/13,
not by him) says ONE is the insider price and a stranger pays the street. Measured,
those two cannot both hold at the first market in the game without the opening tutorial
costing two days' work for one meal. It is a real fork about the game, it has no
defensible default, and it is not mine to pick.

## 6. TWO THINGS THIS ROUND COST ME, KEPT BECAUSE THEY COST SOMETHING

**A. `bohemia_city_module_resync.py` can swallow a freshly spliced rider block.**
I edited `bohemia_payday.js`; the city carries its own inlined copy, so the till
charged 1 where the shelf said 2 — a source edit is not a shipped edit, again. The
resync fixed that, and then, run **after** the rider splice, it ate a block's **closing
marker** whole. That is exactly the trap `bohemia_city_work_patch.py`'s own header
warns about. **The order is RESYNC FIRST, RIDERS LAST.** The page still parsed and all
37 checks still passed, so nothing could see it.

**B. The check I wrote for that was itself broken.** It counted module **banners** and
read *56 opened against 12 closed on a perfectly healthy page*, because most banners are
plain section headers for canonically inlined modules and never had a closing marker. A
check that cannot tell a banner from a spliced block is the broken one. The working
version reads the rider list off the splicing tool itself:

```js
const riders = tool.slice(tool.indexOf('RIDERS = ['), ...).match(/bohemia_[a-z_]+\.js/g);
const bad = riders.filter(f =>
  raw.split('/* ==== engine/'  + f + ' ==== */').length !== 2 ||
  raw.split('/* ==== /engine/' + f + ' ==== */').length !== 2);
```

Worth ten lines in whatever gate wants it; it goes red on the real corruption and names
the module.
