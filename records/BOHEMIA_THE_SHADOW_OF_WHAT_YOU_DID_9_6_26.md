# THE SHADOW OF WHAT YOU DID (RUN, 9/6/26)

VAMILY `[drains shown]` / BB-THE-SHADOW-OF-WHAT-YOU-DID.

> The end-of-day card says it in the verb's own words — "the day ate one food,
> the night ate two power, the bell ate one tape" — **read straight off the
> ledger's `drain` reasons, never a second table.**

## HALF OF IT WAS ALREADY BUILT, AND I FOUND THAT BEFORE BUILDING ANYTHING

WORLD's `[living costs]` shipped the verb lines: grouped by verb and by
paid/unpaid, first-happened-first, in each verb's own words. **That work is
kept, not replaced.** Checking main before building is the rule this repo learned
the expensive way, and this is the second round running where it saved a
duplicate.

## *** WHAT WAS MISSING IS THE CLAUSE IN CAPITALS ***

`SPENT_TODAY` **is** a second table — a parallel array that only `upkeepPost`
writes. The ledger has **three** drain writers:

| writer | on the card |
|---|---|
| `upkeepPost('day:ate' / 'night:power' / 'fight:plate' / 'ask:leaned')` | **yes** |
| `debit(…, 'buy:' + goodId)` — everything you buy at a market | **silent** |
| `debit(…, 'build:' + type)` — everything you put up | **silent** |

So the card named **the four things that happen TO you** and said nothing about
**the two things you DID** — which are the drains a player most obviously
caused, and the only ones missing.

Reading `purse.entries` instead of the side table fixes all of it at once, and a
fourth writer tomorrow appears for free. That last part is asserted, not hoped
for: the gate posts a reason nothing in the game writes yet (`mend:boots`) and
requires it on the card.

## *** AND ONE THING THE LEDGER STRUCTURALLY CANNOT TELL YOU ***

`bohemia_purse`'s `_post` carries the comment:

> *"YOU CANNOT SPEND WHAT YOU DO NOT HAVE, and the refusal is part of the
> record."*

**And the code returns before pushing an entry.** Proved in Node: a refused debit
leaves zero entries. The comment and the code disagree. It is another lane's
module, so it is **reported here and not touched.**

That is the whole shape of the fix. Paid drains come off the ledger, where all
three writers are. The *"and you could not pay it"* lines can only come from
`SPENT_TODAY`, which is the only thing that ever saw them. They cannot
double-count, because a refused drain has no ledger twin — and the gate asserts
that rather than assuming it.

## THE CARD NOW

    THE DAY
      you bought rice ×2
      you put up a solar rack
      every lit circuit you hold burned one

The four upkeep verbs still speak in **their own words**, taken verbatim from the
frozen `VERBS` table rather than reworded. `buy:` and `build:` had no sentence,
so those are attempts in the same voice — what you did, not what it cost —
`draft:true`.

## MUTATION PROOF

- Point the paid lines back at `SPENT_TODAY` → **3 red**, and the card loses
  everything you bought and everything you put up.
- Drop the day filter → **1 red**, tonight's card showing five days of drains.

## AND THE ANCHOR THAT WOULD NOT MATCH, TWICE

The patch tool's render anchor was hand-typed with a literal em dash and multiply
sign. **The file writes them as `—` and `×`**, so it matched zero times
and the assert caught it — twice, because the first fix escaped the backslash one
level too deep inside a raw string. The anchor is built from the file's own
escapes now rather than retyped.

An assert that fires is the tool working. A tool that had quietly replaced
nothing would have shipped a card still reading the side table, and every gate
would have been green about it.

## RESULT

    DRAINS SHOWN 17/0 (new) · WHAT YOU OWE 17/0 · FOUR VERBS 32/0
    PURSE green · WHOLE DEMO 23/0

WORLD's own FOUR VERBS gate — which asserts the reckoning names the verb and
never a category — still passes on this change, which was the thing to check
before touching their lines.

No new mechanic, no new cost, no new number.
