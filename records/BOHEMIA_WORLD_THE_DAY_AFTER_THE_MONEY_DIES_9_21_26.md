# THE DAY AFTER THE MONEY DIES (9/21/26, WORLD lane)

Board row **[full shelves] / THE-DAY-AFTER-THE-MONEY-DIES**, plus rule 22 (COOK
EVERY ROUND). **Nothing shipped to a play surface** — rule 18 holds; the cook went
to the VOTE tab.

---

## 1. RULE 12: THE FIRST HALF OF THE ROW IS ALREADY TRUE, AND IT IS GRIM

The row: *"the day after the last battery is spent, THE SHELVES FILL UP AND
NOBODY CAN BUY ANYTHING. Goods exist, money does not, and trade stops dead until
people fall back to swapping and owing."*

Measured before building anything, by driving the real modules. Stock the valley
the way the game stocks it, then spend every holder down through the game's own
`payday.buy()`:

```
56 batteries burned buying food
BATTERIES IN THE VALLEY: 0 across 19 hands
made from nothing: 0            (nobody minted a single one)
goods still on the shelf: 4 kinds
any purchase, by anybody:       CANNOT_AFFORD
```

It works because **a purchase is a CONVERT, not a transfer**: the battery is
destroyed to make the good, so the supply falls with every sale and only a
building can put one back. **The valley really can run out, and it already
does.**

So the first half of the row needed nothing built.

## 2. AND THE SECOND HALF IS THE BUG

At zero, **nothing moves at all.** There is no fallback. Every shop answers
`CANNOT_AFFORD` forever and the game stands still with full shelves, permanently.

Trade does not stop when money dies in the real world. **It changes form.** That
is what `engine/bohemia_aftermoney.js` is.

## 3. AND BOTH FORMS WERE ALREADY BUILT, BY THIS LANE, WITH NO CALLER

```
SWAPPING   engine/bohemia_barter.js   a stranger at a camp refuses your battery
                                      and asks for goods.   [two prices], 9/15
OWING      engine/bohemia_lend.js     a named lender, a handshake, and the
                                      street finds out.     [someone lends], 9/13
```

The module **routes**; it does not invent a second economy. The row said so
itself: *"the ledger of who owes whom (which exists) becomes the only way
anything moves."*

**And that claim is proved rather than asserted.** The gate takes each module
away and checks the way it carried disappears: with barter gone, SWAP is gone;
with lending gone, OWE is gone. A module that had quietly re-implemented either
one would keep offering it.

## 4. *** YOUR EMPTY POCKET IS NOT A DEAD CURRENCY ***

This is the trap the file exists to avoid, and it is the same shape that cost the
block-strike row six rounds.

**An empty purse and an empty valley look identical from inside a shop.** Both say
`CANNOT_AFFORD`. They are not the same fact and the rules only change for one.

If being broke flipped the world into barter, the game would tell a player on
their first bad afternoon that money has collapsed — which is wrong, and it is
the death of the beat. **You cannot stage the day the money dies if it happens
every time somebody overspends.**

So `state()` has three answers:

```
WORKS   the valley has batteries; being broke is your problem
BROKE   the valley has batteries and you have none
DEAD    nobody has any, and only then do the rules change
```

## 5. AND AN UNSTOCKED SAVE IS NOT A COLLAPSED ONE

Zero batteries across **zero hands** is a game nobody has counted yet, not a
valley that has collapsed. Calling it DEAD would fire the beat on the first frame
of every new game.

**This is the same reading that made the night card say `BATTERIES IN THE VALLEY:
0` on the first night he ever played.** It cost a card once. It does not get to
cost a beat. A reading the module does not have is never a verdict.

## 6. PRICES STAY HIS

A dead currency does not re-tariff the valley. **EVERYTHING COSTS ONE** is his
pillar, and a collapse that quietly changed every price would be this lane
inventing economics he never ruled.

So `quote()` does not change the number. It **refuses** it, and carries the number
it would have been, so a shop can still post its list and a player can still read
it and see that it is worthless:

```
{ good: false, why: 'THE_PRICE_IS_IN_A_CURRENCY_NOBODY_HOLDS', wouldHaveBeen: 1 }
```

And a trade with neither goods nor a lender is **refused**. Nothing here quietly
gives anybody anything: *"the shelves are full and you cannot have any of it"* is
the beat, and softening it would delete the row.

## 7. THE COOK: THE LIST IS STILL ON THE WALL

A shop posts its prices. That is not decoration — a posted schedule is what a
price **is** in law, the thing a customer can hold a seller to.

So on the morning the last battery is spent, the list is still up:

```
RUBEN'S
SCHEDULE OF PRICES

POSTED AT: FREEWAY 75-5
EFFECTIVE: DAY 9 AT 08:05

ANTIBIOTICS   1 BATTERY
FOOD          1 BATTERY
FUEL          1 BATTERY
...
WATER         1 BATTERY

ALL PRICES ARE PAYABLE IN THE LAWFUL CURRENCY OF THE VALLEY.
THIS SCHEDULE IS POSTED AS REQUIRED.
```

**Nothing on it is wrong.** Every number is correct and current and enforceable
and worthless. The goods are read off the economy's own table, so a shelf that
changes changes this. **And the list does not know.** Whether anybody can pay it
is carried beside the document, never inside it — a list that printed "nobody can
pay this" would be a list that knows, and it does not, and it has no way to find
out.

A shop with nothing for sale gets no list rather than a blank page.

## 8. THE GATES

```
FULL SHELVES   34 / 0   new, driven, red two ways
FIRST NOTICE   48 / 0
```

Red proved: let being broke mean the money is dead (3 red); call an uncounted save
collapsed (3 red).

## 9. WHERE HE FINDS IT

**Tab: VOTE, in the alpha.** Six rows: THE FIRST NOTICE, WHO SENDS THE NOTICE,
YOU PAID IT, THE BLOCK HOLDS THE DOOR, THE RULES RUN WITH THE DIRT, and **THE DAY
THE MONEY DIES**.

## 10. ROUTED

**TO WHOEVER LIFTS THE HOLD:** the module is built and gated and has no caller on
a play surface, because rule 18 keeps this lane off them. The shop that should
ask it is the walked surface's own buy path, which today ends at `CANNOT_AFFORD`
with nowhere to go.

**STILL OPEN, carried:** the night card's `BATTERIES IN THE VALLEY: 0` on the
first night — the same class of reading as section 5, and the fix is written down
waiting for the hold to lift.
