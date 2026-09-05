# THE CITY IS THE LONG MEMORY — CENTURY-RECORD, mechanism only
(9/5/26, LIFE + CITY lane. VAMILY job `[century memory] CENTURY-RECORD`.)

## THE LAW'S LAST SENTENCE IS THE BRIEF

`laws/BOHEMIA_ADDENDUM_THREE_CURRENCIES_CENTURY_7_26_26.md`, clause 4, LOCKED:

> **THE CENTURY RULE:** dynasty building choices COMPOUND across the three acts
> (~100 years). Neglect production/power/clout and act three's city is visibly
> poorer; invest and it's visibly rebuilt. The city is the game's long memory.
> **Mechanism to be designed; numbers are Paolo's when the mechanism is ruled.**

So this round is the **mechanism and nothing else**. It records what each generation
did. What counts as poor, what counts as rebuilt, and what act 3 does about it are
his — `TIERS` ships **empty** and `tierOf()` answers `NO_RULING` by name while still
handing over the totals.

## WHY A LEDGER AND NOT THREE COUNTERS

The delta (`bohemia_cityedit.js`) is the city **as it stands**. It cannot answer the
century question, and the reason is the whole point of the rule:

> **A generation that built forty homes and a generation that built none look
> identical the moment a later generation knocks them down.**

"The dynasty that built and lost it" is exactly the story the century rule exists to
tell. So: **the delta is the city; this is what the family did.** Entries are the
truth, totals are their fold — the same argument the purse makes, and it is right
again here.

## ONE MEANING PER FIELD, AND THE FIRST CUT HAD TWO IN ONE OBJECT

| field | means |
|---|---|
| `built` / `demolished` | what this generation put up and took down |
| `net` | how much more city there is than when the act began |
| `housing` | the **net change** in household capacity this generation made — **allowed to be negative** |
| `byType` | **what this generation built**, by kind. Builds only; it never decrements |

The first cut had `byType` going down on a demolish, which made *"the dynasty built
one suburb"* and *"there is one suburb standing"* the same field wearing one name.
Different questions, different answers. What is **standing** is the delta's job.

And `housing` was clamped at zero, which would have hidden the exact story the rule
is for: a generation that tore down housing really did reduce it.

## THE ACT IS NOT INVENTED HERE EITHER

Measured: the walked city carries **no act** — `act: 1..3` lives in
`bohemia_engine.js`'s save, which the walked surface does not load. And the
generation handoff is another line's job (`[generation handoff]
THE-FOLD-IN-THE-RUNTIME`, PARKED). So the record defaults to act 1 and offers **one
setter** for the fold to call when it exists. It refuses to run backwards, because a
century that can go in reverse is not a memory.

**Inventing a generation handoff to make my own record look finished would be
building somebody else's job badly.**

## WHAT HE SEES

One line on the reckoning card, where a ledger belongs:

> *this generation: one building up, one down*

It is the **generation's** tally, not the day's — the century rule is about a hundred
years, so a per-day count would be the wrong unit for the one thing this record
exists to answer. Absent entirely when the family has built nothing.

## THE GATE

`gates/century_record_gate.js`, **18 pass / 0 fail**, walked surface and cut demo.

`B4` drives the **real** save path, both ends: `citySnapshot()` then `applyRestore()`
with the memory forgotten in between. `A9` proves the past is not rewritten — the
household is stamped when it happens, so the day he rules an apartment holds more
than a trailer, what the family built under the old rules stays what it built.

| mutation | legs that went red |
|---|---|
| make totals a view over what still stands | A2, A3, A5, A7 |
| give `TIERS` a sensible default | A7 |
| record the demolition after the redraw | B2 ("recorded desert") |

## THE MUTATION THAT DID NOT WORK, WHICH IS THE FINDING

My first attempt at the B2 mutation was to move the type read to **after**
`CE.demolish`. It did **not** go red — because the edit-seam frame cache had not been
bumped yet, so both orders answered `"suburb"`.

**The two orders were equivalent only by accident of a cache.** The mutation that
reflects the real bug — recording after `CBafterEdit()`, which bumps the cache — goes
red instantly with `recorded desert`. So the leg is written against the **fact** (the
record names what was standing, and never `desert`) rather than against the line
ordering that currently produces it.

## THE STANDING NOTE

**ACCIDENTAL CORRECTNESS IS THE KIND THAT ROTS.** Code that is right because of
something two systems away will stay right exactly until that something moves, and
nothing in the file will say why it broke. A test aimed at the fact survives the
refactor; a test aimed at the line ordering ships a false green the day somebody
tidies it.
