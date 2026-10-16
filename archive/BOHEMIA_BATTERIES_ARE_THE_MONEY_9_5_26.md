# A DAY'S WORK PAYS ONE BATTERY, AND A BAG OF RICE COSTS ONE
# 9/5/26, WORLD lane. VAMILY [battery money] — BB-BATTERIES-ARE-THE-MONEY
# with BB-THE-LETTER-IS-ONE, which the queue marks as one job because they are.

## WHAT WAS ACTUALLY WRONG, AND IT WAS NOT CODE

> "just make everything cost one. Just start off with one and then I'll move from there."
> — Paolo, **8/15**
>
> "i dont want there to be money money maybe electronics like batteries are the currency.
> For one aa battery a bag of rice and so on so forth."
> — Paolo, **9/4**

He ruled the number twenty-one days ago and the denomination the day before yesterday. **The
tables were still `{}`.** A finished job answered
`{"applied":false,"reason":"NO_RULING","table":"PAYOUT"}`, a shelf priced nothing, and
`placeholder_number_gate` printed *"the three tables are still EMPTY"* **inside a green pass,
every run, for twenty days.**

Nothing was missing. **A ruling of his was sitting unimplemented and the machine was calling
that caution.**

## THE OWNER, SETTLED IN ONE LINE, BECAUSE THAT IS WHY NOBODY DID IT

8/11 put the reward **on the quest** ("whatever currency the quest decida to give"). 8/15
fills the **fallback table**. They compose perfectly and they hand the job to two different
lanes, so QUESTS and WORLD could each correctly believe it was the other's — and for twenty
days both were right and nothing moved.

**The quest owns its reward. The table is what answers when the quest says nothing.** That is
what `payForQuest` already did in code; it is now written down where the next lane will read
it, in the purse, in the gate, and here.

## WHAT SHIPPED

| | |
|---|---|
| `PAYOUT.COMPLETE` | **1 electricity** — a day's work pays a battery |
| `PRICES` | **11 goods, 1 battery each** — every good the economy actually has |
| `SALVAGE_CURRENCY` | `resources` → **`electricity`** |
| `PRODUCTION` | still `{}`, and it says why |

**PRICES IS BUILT FROM THE GOODS THAT EXIST, NEVER FROM A LIST TYPED IN THE PURSE.**
`engine/bohemia_economy.js` already holds them — water, food, salvage, meds, fuel, power and
the field-surgery kit — and a second list in the purse would drift the day somebody adds a
good. Same reason the street contract measures its connectors off the built tiles instead of
a declaration. **Which goods exist stays his; this reads them.**

**EVERY VALUE CARRIES `ruling` AND `tuned:false`**, which is the 8/15 law's own section 5 in
code: one generated list holds every number in the game and he tunes from it after a
playthrough. `placeholder_number_gate` still goes red on an untagged number, so a hand-typed
7 with nothing behind it still cannot ship.

**PRODUCTION STAYS EMPTY AND IT IS NOT AN OVERSIGHT.** Measured: `produce()` has **zero
callers** anywhere in the engine or the walked surface. There is no buildingId vocabulary to
key on, so every row I could write would be dead data. **A number with no consumer is
decoration, not content.**

**AND THE REFUSAL PATH IS INTACT**, which the 8/15 law asks for by name in section 4. `FAIL`
is deliberately absent from the table: what a failed job pays is not something he has said,
and the honest answer to a question nobody asked is still silence.

## THREE BRANCHES THAT HAD NEVER RUN, FOUND BY FILLING THE TABLES

The pipe was called "built, wired, gated and called". It was — and three of its branches had
**never once executed**, because they only run when a table is not empty.

1. **`payday.price()` returned the whole ROW** — `{currency, amount, ruling, tuned}` — where
   every caller wants a number. The shelf on the walked surface would have rendered
   **`[object Object] res`**.
2. **`payday.buy()`'s ruled branch returned `PURSE.spend()` raw** — a ledger entry, not a
   purchase — so a shop that could not afford something answered in a different vocabulary
   from the one the card reads.
3. **`purse.payQuest()` returned `paid` as an array of ledger entries** where the
   quest-declared path returns a `{currency: amount}` map, and the reckoning card renders
   `paid` with a for-in. It would have printed the ledger's guts at the player.

**A BRANCH THAT HAS NEVER EXECUTED IS NOT CODE, IT IS AN INTENTION.** All three are fixed and
all three now have one shape: the shelf quotes `price()` and the till charges through
`price()`, so **the tag and the till cannot disagree.**

## AND THE SHOP WAS STILL SPEAKING THE OLD MONEY

The market card said *"you have N resources"* and priced everything in *"res"* — the money of
the day before his ruling — while the till underneath it had already moved to batteries. **A
shop whose tag and till name different money is worse than one with no prices at all.**

Photographed on the walked surface: **"SWAP MEET — 06:00 · you have 3 batteries"**, and every
row reads **1 battery**. `FOOD · 1 ration` for one battery is his bag of rice. The reckoning
card says **"paid: 1 battery"** in his own word for it, in the place he already reads.

## THE RUN SLICE HAD NEVER BEEN RESYNCED BY ANYTHING

`BOHEMIA_RUN_CURRENT.html` inlines the purse under its **own** banner, which is not the one
`bohemia_city_module_resync.py` looks for. BB-THE-LETTER-IS-ONE named it as one of the three
places carrying `[PENDING Paolo]`, and it was the only one nothing could reach.

`tools/bohemia_run_slice_purse_resync.js` now splices the **whole module** straight out of
the engine. Its first cut spliced only the tables and left `payQuest` stale — **a second copy
is a second copy however small the window is** — so it replaces the module body between its
own banner and the next one. Re-runnable, idempotent, proved both ways.

## FOUR GATES ASSERTED THE PRE-RULING WORLD, AND THEY MOVED

`purse_gate`, `payday_gate`, `day_pays_gate` and `demo_blockers_gate` all held some form of
*"the tables ship empty"* and *"a finished job is refused"*. **A GATE MUST NEVER OUTRANK A
RULING** (Paolo 8/1) — and `payday_gate` already carried that exact precedent in its own text,
for his 8/11 price ruling, twenty lines from the check that failed.

Every one kept its teeth:

- the refusal is still proved, on something **genuinely uncovered** (`FAIL`) rather than on
  `COMPLETE`, which is now ruled;
- every refusal test gained a **positive control**, because a refusal test with no positive
  control passes just as well on a table nobody can reach;
- **the scarcity sim is proved still alive** by lifting one good out of his table for one
  call and watching the sim price it again — so tuning a good off the one costs nothing;
- `demo_blockers_gate`'s *"there must be an empty table to derive from"* guard became a
  **mutation**: plant a synthetic `[PENDING Paolo]` table and the deriver must find it. It
  keeps its tooth on a clean repo instead of demanding the repo stay broken.

## 120 BPM

No timer was added and that is deliberate. A purchase lands on the tap, on the player's own
clock, the same clock everything else moves on. **A shop that makes you wait half a second is
not more musical, it is worse**, and nothing in the build gates a card tap to the beat today.

## VERIFIED

| | |
|---|---|
| walked surface | shelf all `ruled` at 1 battery; work pays 1; buy charges 1; ledger `source electricity 1 quest:COMPLETE` then `drain electricity -1 buy:food` |
| demo, through the splash | identical, in the frame, after one tap the way a person does it |
| gates | placeholder 14, purse 28, payday 37, day pays 18, demo blockers 22, economy 13 — **132 checks, 0 failed** |
| demo | re-cut, `demo_build_gate` 25/25 byte-identical |

**The economy circulates end to end for the first time.** A quest pays, the payout lands in
the purse, a hub sells something, the purchase clears, and every number in it is tagged for
the day he tunes.

## WHAT IS STILL HIS

Which goods exist. Any price above 1. Whether battery **sizes** are denominations. What a
**failed** job pays. All of it untouched, and every value in the build now carries a
`tuned:false` so one generated list finds them.
