# THE NIGHT CARD SAID THE SAME LINE EIGHT TIMES (9/14/26, WORLD lane) — board row [owe lines]

Ship: `engine/bohemia_owing.js` (one line per lender) and the walked surface's
nightfall card. Checks added to `gates/debt_carried_gate.js`, the row's own gate,
extended not duplicated. Tab: **CITY**, the nightfall card. **This lane's first
five-minute break under rule 14.**

---

## THE ROW

FACTIONS measured the card he meets at the end of **every** day, on a phone: **916 px
in a 780 window**, and WHO YOU OWE was **270 px of it, eight lines**, twice the
overflow. *"That is [debt carried] rendering one line per row. Collapse the same
lender into one line with a count, biggest first, and the card fits with room."*

## MEASURED AGAIN HERE FIRST, AND IT SHARPENED THE DIAGNOSIS

With more accounts open than theirs:

```
WHO YOU OWE            405 px, 11 items   <- THE BIGGEST BLOCK ON THE CARD
THE DAY                297 px, 11 items
KEEP THIS VALLEY       121 px
WHAT YOU ARE WORKING ON 54 px
```

**Nothing was duplicated.** No two lines were ever byte-identical, and the merge in
`book()` works exactly as built. The eight "identical" lines are eight *different*
outfits each saying the same long sentence with a different name in it.

**The cause is `say()` being right about the wrong unit.** It writes a full sentence
per **account**, and one outfit can hold three of them — a favour, a night of rent,
and a loan — so the Church says three long sentences in a row:

```
CHURCH gave you something for nothing, 3 times. Nobody has mentioned it yet.
CHURCH let you stay on their ground without paying, twice.
CHURCH lent you a battery on a handshake. You pay one back a night.
```

On a phone, eleven sentences of the same shape read as the same line over and over,
and the card runs off the bottom of the screen. That is his *"nothing's complete"*.

## THE UNIT BECOMES THE PERSON, WHICH IS WHAT THE LIST WAS ALWAYS ABOUT

This block answers **WHO DO I OWE**, and a lender is one person whatever they are
owed for.

```
CHURCH: 1 battery lent, 3 taken free, 2 nights unpaid
CARTEL: 1 battery lent, 3 taken free
MOB: 1 battery lent, 2 nights unpaid
NETWORK: 3 taken free
```

Counts only, biggest first, and the lender still named — the same three refusals the
per-account line already made. What a favour or a night is **worth** is a weight and
weights are his.

## MEASURED AFTER

```
WHO YOU OWE   405 px, 11 items   ->   138 px, 6 items
longest line   83 chars          ->    60 chars
```

**267 px off the card**, which is twice the 136 px FACTIONS measured as the overflow.
The block is no longer the biggest thing on the card; THE DAY is, which is right.

## AND IT IS BOUNDED, WITH THE REST COUNTED OUT LOUD

Owing all sixteen outfits is a real state, and sixteen lines is the floor for naming
every one of them — which is the problem again. So the list shows five and says
`and 11 more you owe`.

**The cap is not a number invented here:** this card already caps its faction tally
at four and its followers list at five, so a short list with the remainder named is
the card's own convention. And the remainder is **counted, never silently dropped** —
the existing caps just stop, and a card that quietly hides who you owe is lying by
omission, which is the opposite of this row.

## PROOF

- `node gates/debt_carried_gate.js` → **65 passed, 0 failed** (was 49; the row's own
  gate extended, not duplicated)
- red three ways: go back to one line per account → 7; drop the remainder silently →
  2; let a price into the line → 4
- the worst case is exercised in the gate: 48 accounts, 16 lenders, 6 lines
