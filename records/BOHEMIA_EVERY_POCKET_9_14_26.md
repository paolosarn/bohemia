# EVERY POCKET — THE BATTERIES YOU PAID WERE BEING DESTROYED (9/14/26, WORLD lane)

Board row `[every pocket]` / THERE-IS-EXACTLY-ONE-PURSE-IN-THE-WHOLE-GAME.
Ships: `engine/bohemia_pockets.js`, `gates/every_pocket_gate.js` (56/0), four
payment sites on the walked surface rewired.

---

## 1. MEASURED FIRST, AND THE BOARD'S PREMISE WAS WRONG IN THE DIRECTION THAT MATTERED

Rule 12 says a dependency on a line is a premise, not a gate. The line said:

> The swap primitive is built, works (a real two-purse swap ran clean, both
> ledgers right) and is half-called.

Checked before anything was written:

| the line said | measured |
|---|---|
| the purse is created once, every caller is the player's | **TRUE.** `BohemiaPurse.create()` has two live call sites on the walked surface: `purseGet()`, and a dry-run costing probe that is thrown away. Everything else is a gate. |
| the swap primitive is built | **FALSE.** No function anywhere in `engine/` takes two purses. |
| it is half-called | **FALSE, and worse.** `transferIn()` has **ZERO callers in the whole game**. The receiving half had never been called once. |

`transferOut()` posts one negative entry of kind `transfer` to one purse. Nothing
receives it. So all four payment sites on the walked surface were one-legged.

## 2. THE NUMBER

Driven with the city's own rent-night call (`BOHEMIA_CITY_WORLD.html:55413`,
verbatim), one week:

```
the ledger says moved-to-another-holder:   10
batteries actually in somebody's hands:     0
the valley's money supply, day 0 -> day 7:  9 -> 0
```

**The player's balance WAS the money supply of Las Vegas, and it only ever fell.**
Every battery he paid in rent, in loan repayment, on the road and in restitution
was silently destroyed.

And the code said otherwise, out loud, at the road site:

> A TRANSFER, NOT A DRAIN. The purse's own words: a drain is destroyed and gone,
> a transfer moved to another holder. **The crew HAS the cut.**

The crew did not have the cut. That is rule 14(d) — a thing that promises and does
nothing — inside the economy instead of on a card.

## 3. AND THE GAME ALREADY NAMED WHO SHOULD HAVE RECEIVED

Every one of the four sites passes the counterparty in as the `ref` argument. The
receiving end was never missing information; it was missing a receiver.

| site | who it names |
|---|---|
| the road | `'roadpay:'+ev.seq` — the crew that stopped you |
| the night's rent | `r.faction` — whose ground it is |
| a loan repaid | `r.who` — the lender, by name |
| restitution | the person's id |

## 4. WHAT SHIPPED

`engine/bohemia_pockets.js`. The book of holders, and one road between them.

- **`hand(from, to, currency, amount, reason, ref, day)`** is the only way a
  battery moves between two holders: `transferOut` on one purse, `transferIn` on
  the other, **atomic**, unwinding leg one exactly the way `convert()` has inside
  one purse since 7/31. If either leg is refused, nothing happens.
- **Who holds one is ECONOMY Q40's ruling, TWO POCKETS AND A WAREHOUSE:** the
  player, plus a treasury for each of the 14 factions that can hold ground, and
  **no pocket for a shop at all** — a shop holds goods in `ledger.stocks`, and the
  naive read (a ledger per person) is 28,844 of them. This is 15.
- The 14 are **derived off the faction graph, never typed**, so the list cannot
  drift from the one the rest of the game uses.
- A lender, a crew or a person you wronged gets a pocket **the moment they are
  handed something**. That is a handful in a playthrough, and the alternative is
  destroying the battery.
- **Treasuries ship EMPTY.** What a faction starts with is a ruling.
- **No save key, on purpose.** The player's own purse is memory-only (`PURSEV`,
  nothing writes it to storage). Treasuries that outlived it would mint batteries
  across a reload. When his purse gets a save key, these ride the same one.
- `supply()` and `ranked()` make "who is holding the valley's batteries" and "the
  day the money dies" things you can watch instead of assert.

## 5. ON THE SURFACE HE WALKS, DRIVING THE GAME'S OWN NIGHT

Not a copy of `blockRent()` and `loanNight()` — those functions, in the real page:

```
holders from the first frame          15   (him and the fourteen)
three real rent nights: player        40 -> 37
                        the Mob        0 ->  3
the valley's money supply             40 -> 40      CONSERVED
a loan repaid: CHURCH                  0 ->  1      (a holder who did not exist before)
page errors                            0
```

## 6. THE GATE, AND THE CHECK OF IT THAT FAILED

`gates/every_pocket_gate.js`, 56 checks. Mutation-tested four ways:

| break it like this | checks that go red |
|---|---|
| drop the receiving leg from `hand()` | 6 |
| delete the unwind | 3 |
| revert one city site to a bare `transferOut` | 5, including the supply going 40 -> 37 on the real surface |
| type the faction list into the module | 1 |

**That last one passed at first.** The check was "no faction is named in this
module's code", scanning a source with strings stripped — and strings have to be
stripped for the mention-vs-use checks in section 7 to work at all, because the
comment at every payment site contains the word `transferOut`. A typed list lives
in strings, so the stripper that protects those checks blinded this one. It is now
behavioural: **add a fifteenth faction to the graph and watch the module find it,
then take it away and watch it go.** Nothing with a typed list can pass that.

## 7. STATED, NOT HIDDEN

- **The demo does not carry this, and this lane may not put it there.** Rule 14(a)
  reserves the cutter for THE RUN. The gate REPORTS what the demo carries and
  decides nothing on it, so nobody is pushed into breaking that rule to go green.
- **The night's power bill is untouched.** It is a `drain` — electricity consumed
  by a circuit — and a drain is correctly destroyed. Only transfers were wrong.
- **Nothing here prices anything.** Every amount is handed in by the caller.
- **Two of the four sites are owned by patch tools** (`the_road_is_a_decision`,
  `city_paid_means_paid`) and both are idempotent-by-presence, so editing the tool
  did **not** reach the page. Both the tool and the page were changed, and the gate
  now checks that they agree — otherwise the next run of either tool quietly puts
  the bug back.
