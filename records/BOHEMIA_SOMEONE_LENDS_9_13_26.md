# WE BUILT THE COURTHOUSE AND NEVER ISSUED A LOAN (9/13/26, WORLD lane) — board row [someone lends]

Ship: `engine/bohemia_lend.js` (new), `engine/bohemia_owing.js` (a third kind), the
walked surface (the outfit card, the night, the fold), and
`gates/someone_lends_gate.js` (58 checks, registered as **SOMEONE LENDS**).
Tab: **CITY**, on the outfit card and the nightfall card. Also in the demo.

---

## THE ROW, HARVESTED FROM ECONOMY ROUND 9

> "Everything courtless credit needs is LIVE: news walks a real acquaintance graph
> three hops, memory decays, belonging and deeds are recorded, the purse refuses
> debt. Nothing in the game ever lends anybody anything, so the enforcement machine
> has never had a debt to enforce. Let a person or a faction lend you batteries, on
> a handshake, remembered by the machine that already exists; the debt names its
> lender (with [debt carried]) and the street finds out if you do not pay."

**Measured, and the row was exactly right.** Zero hits for lend, loan or borrow
anywhere in `engine/` that are not prose. The only two that read like credit are
BARKS in `bohemia_people.js`:

> "Everything's a loan. The only question is who's holding it."
> "Ten percent isn't greed, it's the reason there's anything to lend."

**People in this game talk about lending and nobody lends.**

## A LOAN IS NOT A NEGATIVE BALANCE, WHICH IS WHY THE PURSE NEVER HAD TO BEND

`bohemia_purse`'s own header:

> *"Balances never go negative, so no hidden debt system exists by accident — debt
> would be canon, and canon is Paolo's."*

That rule was never in the way. A real loan is **two facts, not one negative
number**: the batteries really arrive (a credit, positive, through the purse's own
writer) and an obligation is recorded beside them naming who it is to. The purse
stays a purse and the book stays a book.

## WHO LENDS IS THE GAME'S OWN ANSWER, NOT A NUMBER I PICKED

A lender is somebody who gives before you have earned it, **and the game already
says who that is.** `bohemia_favour`'s GIVES table carries `owes: true` for the
outfits whose first move is to hand you something for nothing — the same flag that
opens the account THE DEBT GETS CALLED IN (8/18) was written about.

Measured on the walked surface: **4 outfits lend, 12 will not.**

Inventing a rung or a standing floor would have been a threshold nobody ruled, and
it would have disagreed with that table the moment either one moved.

## EVERYTHING COSTS ONE, AND THE NIGHT ALREADY HAD THE SHAPE

One battery on a handshake, coming back **one a night** — which is exactly how rent
already works: billed at nightfall, and a night you cannot pay is a night you went
short. Nothing new had to be invented to make a loan bite; it bites the way the
lights already bite. It runs **after** rent, because the ground you are standing on
is collected before a handshake is.

How much you may owe in total, what interest is, and how long they wait are
**prices, and prices are his**. They ship empty and enumerable in `placeholders()`.

## AND IT CAN BE PAID OFF, WHICH IS THE MECHANIC, NOT A KINDNESS

THE DEBT GETS CALLED IN rule 2: *"AN INTERVAL MUST BE ABLE TO CLOSE. If an
obligation can only grow, it has stopped being a relationship and the player has
stopped having a decision."* The account is **deleted at zero** rather than kept at
zero. Interest is exactly the thing that would make the interval uncloseable, which
is the second reason it is not a number this file gets to pick.

## IT RIDES [debt carried] FOR FREE

The one book shipped last round gains a third kind and nothing else changes: a loan
is named on the nightfall card beside the favours and the rent, dies at the fold,
and leaves its lender standing — with **no part of that machinery knowing what a
loan is.**

```
CARTEL lent you 2 batteries on a handshake. You pay one back a night.
CHURCH gave you something for nothing, once. Nobody has mentioned it yet.
MOB let you stay on their ground without paying, 5 times.
```

## MEASURED END TO END ON THE WALKED SURFACE

```
WHO LENDS    CARTEL, CHURCH, NETWORK, SOCIAL_FORCES   (12 outfits will not)
HANDSHAKE    batteries 0 -> 1, owed 1, purse never negative
THE CARD     CARTEL lent you a battery on a handshake. You pay one back a night.
A NIGHT PAID {"who":"CARTEL","paid":1,"left":0,"square":true}
A NIGHT SHORT{"who":"CARTEL","paid":0,"left":1,"missed":true,"nights":1}
             deed loan:short published, purse still never negative
PAID OFF     the book is empty: square
```

## I ASSUMED THE WRONG REASON FOR THE STANDING, AND MEASURING CORRECTED IT

I wrote that a missed night does not move a standing **because his `DEED_WEIGHT`
ships empty, waiting on a ruling.** That was wrong, and I shipped the wrong sentence
into the module before checking it.

Measured: **`DEED_WEIGHT` has 83 rows.** Every one is keyed
`q:<quest>:<stage>@<FACTION>` — the weights are **derived from the authored quest
corpus**, off the `@DO` lines. And **not one of the five deed kinds the walked city
publishes is in it**: `claim:met`, `claim:refused`, `commit`, `favour` and now
`loan:short` are all missing.

So every act this surface publishes is witnessed, remembered and retold, **and
weighs nothing.** This one is the fifth in that position rather than a hole of its
own. **One gap for all five, ROUTED**, not patched with a number invented here.

## THE GATE WAS BROKEN TWICE AND THE MUTATIONS FOUND BOTH

**IT RE-IMPLEMENTED THE BUTTON INSTEAD OF PRESSING IT.** The surface drive ran
`BohemiaLend.take` and `BohemiaPurse.credit` side by side — the handler's own two
lines, copied into the test. Deleting the credit from the real handler, so the loan
recorded a debt and handed over nothing, left the gate **green**.

> **A GATE THAT RE-IMPLEMENTS THE THING IT IS TESTING CANNOT SEE IT BREAK.**

It now stands next to somebody from a lending outfit, opens their card the way
walking up to them does, and clicks. The mutation is red.

**AND MY FIRST TRY AT THAT FOUND NO BUTTON AND I NEARLY BLAMED THE BUTTON.** I used
`ctDraw()`, which only repaints the world; `ctSawCell()` + `ctOpen()` is what walking
up to somebody does. A negative result is a claim about your instrument until you
have shown the instrument could have seen a positive one.

**AND ONE CHECK COULD NOT TELL A MENTION FROM A USE.** "No threshold is typed here"
read the whole module and went red on its own header, which explains why no
threshold is typed *by naming the ones it refused to type*. Comments and strings are
stripped now.

## PROOF

- `node gates/someone_lends_gate.js` → **58 passed, 0 failed**, registered, driven on
  the walked surface AND the demo
- red **six** ways: make the debt never close → 3; let anybody lend → 1; take the
  whole lot in one night → 3; never publish the deed → 1; hand over nothing → 1
  (the one that caught the gate itself); keep it out of the one book → 3
- DEBT CARRIED 48/0, unchanged by the third kind

## ROUTED

- **Whoever owns the standing web**: the five deed kinds the walked city publishes
  (`claim:met`, `claim:refused`, `commit`, `favour`, `loan:short`) have **no weight
  at all**, because `DEED_WEIGHT` is derived from quest `@DO` lines and a city act is
  not a quest. The news travels and nobody's opinion moves. One row, five kinds.
