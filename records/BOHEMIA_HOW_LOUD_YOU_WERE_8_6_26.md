# BOHEMIA — HOW LOUD YOU WERE
### 8.6.26 — PEOPLE lane. The 7/21 CLOUT LAW, finally applied to reputation instead of only to a follower count. Nothing new was decided; two columns Paolo already authored are now read by the same organ.

---

## THE HOLE, AND IT WAS HIDING IN PLAIN SIGHT

Every canon quest outcome in `quests/bq/` already writes down **two different things**:

```
@STAGE 33 COMPLETE #reckless
  @LOG Told his buyers, standing in his own yard, that the second generation
       of what he sells is worthless. True, loud, and it cost him the season.
  @DO faction CARAVANS -15
```

- `-15` — **how big the deed was**
- `#reckless` — **how loud it was**

The loud half only ever reached `defaultFollowerScore()`. The faction standing was applied **godlike**: the number moved, valley-wide, instantly, with nobody having seen anything.

So a back-yard handshake and a public humiliation in front of a whole block were worth **exactly the same** to a faction — in a game whose own 7/21 law is titled RECKLESS BEATS QUIET.

61 authored deltas. 69 authored clout tags. Two columns of the same table, and only one of them was wired to anything that matters.

## WHAT CHANGED

| | | |
|---|---|---|
| the `±N` | **how much** the deed weighs | already his |
| the `#tag` | **how far** the news carries, and **how many times** it gets retold | already his |

`engine/bohemia_deeds.js` is the bridge. It reads his `.bq` files with his own parser, reads his live `CLOUT_WEIGHTS` out of `bohemia_loop.js`, and turns a resolved quest stage into **witnessed deeds** in the heads of the people who were standing there — instead of a number written into a ledger nobody saw.

## THE ONE PIECE OF NEW MATH, AND WHY IT IS THAT SHAPE

```
reach = SEE_RANGE * sqrt(cloutWeight / CLOUT_NEUTRAL)
hops  = MAX_HOPS  * sqrt(cloutWeight / CLOUT_NEUTRAL)
```

A clout weight is, in effect, **how many people care**. That many people do not stand in a line — they occupy an **area**. Area grows with the count, so **radius grows with its square root**. That is not a game-feel knob, it is the geometry of people standing outdoors.

|tag|his weight|carries|retold|
|---|---|---|---|
|`#quiet`|8|7 tiles|1x|
|*(untagged)*|15|**9 tiles**|**2x**|
|`#notable`|25|12 tiles|3x|
|`#risky`|55|17 tiles|4x|
|`#reckless`|110|24 tiles|5x|

Three things fall out, and all three are why it is the right curve:

1. **AN UNTAGGED DEED LANDS EXACTLY ON `SEE_RANGE` AND `MAX_HOPS`.** `sqrt(15/15) = 1`. The default case is bit-for-bit the behaviour the world already had, so the tag can only ever move you *off* the old number, never silently redefine it.
2. **RECKLESS IS ~2.7x THE SIGHTLINE, NOT 13.75x.** Straight linear scaling on his weights would put one loud act in front of 66 tiles of valley and news would teleport again — the exact failure the whole witness organ exists to kill.
3. **HIS LOCKED ORDERING SURVIVES ANY RETUNE.** `sqrt` is monotonic. The 7/21 law says the ordering is canon and the numbers are tunable; the gate proves the ordering holds against a table it makes up on the spot to try to break it.

## THE UNITS CONVERSION IS DERIVED, NOT PICKED

His quest deltas run on the quest scale (biggest single act in the corpus: `|18|`). The standing organ's rungs run two apart (`HOSTILE -3 / COLD -1 / NEUTRAL 1 / WARM 3`). Something has to convert, and **a conversion factor picked by feel is an invented constant pretending to be mechanism**. So it is derived from a rule you can argue with in English:

> **The biggest thing a quest can do, done in front of an entire faction, moves you exactly one rung.**

`divisor = max|delta| / rung step` = `18 / 2` = **9**, measured off his files at load. If he ever writes a bigger deed the whole scale re-normalises itself and the rule still holds. Nothing to retune by hand, ever. The gate measures it to the rung.

## ONE ACT, TWO MEANINGS, AND A THIRD PARTY WHO DOES NOT CARE

S17 stage 32 is `CARAVANS +12` **and** `BLUES -6` — one thing that happened, a good customer to the traders and a betrayal to the growers. Measured on his real file:

```
CARAVANS  +1.33 WARM  |  BLUES  -0.67 NEUTRAL  |  uninvolved  0.00 NEUTRAL
```

A Red standing in the same street remembers **nothing**, because the Reds genuinely do not care who buys seed. That is zero-sum (gap 7) for free, and it is why a deed kind carries the faction in it.

**A side effect worth naming, because it is realistic rather than a bug:** gossip is faction-blind, so a Blue can tell a Red the Blue-flavoured version of an event. The Red then holds *the teller's framing* at hearsay strength. That is exactly how framing propagates in the real world.

## THE DYNASTY PAYOFF — THE LAW THAT WAS WRITTEN DOWN AND NEVER PRODUCED

`bohemia_standing.js` has stated this in its own comments since the day it shipped:

> A QUIET GOOD DEED DIES WITH THE WITNESS.
> A NOTORIOUS ONE BECOMES THE THING YOUR CHILD IS JUDGED FOR.

...because `inherit()` only carries a deed forward if somebody **retold** it. But **nothing in the game produced the difference** — every deed had the same hop budget, so "quiet" and "notorious" were the same word. The clout tag is what was missing.

Thirty years, measured across his full ordering (the valley, 385 people):

```
#quiet      6 saw it   ->    6 still say it
#notable   21 saw it   ->   36 still say it
#risky     36 saw it   ->   64 still say it
#reckless  77 saw it   ->  110 still say it
```

**18x spread, monotonic across all four of his tiers.** The life lesson underneath, which the game never says out loud: you inherit goodwill you did not earn and debts you did not run up, and neither one is fair.

## WHAT WAS *NOT* DECIDED (the law, kept to the letter)

- `bohemia_standing.js` **still ships `DEED_WEIGHT` empty.** The gate measures that *before* the bridge loads. Every row the bridge writes traces to a `@DO faction` line in one of his `.bq` files — checked by re-grepping the raw source text.
- **No faction is named in the bridge's code.** Checked against the real ids in `BOHEMIA_faction_graph.json`, with comments stripped first (Paolo 8/1: *a checker that cannot tell a mention from a use is the broken one*).
- The clout numbers are **read**, never copied. The one place a copy exists — the shipped demo page, which must not inline 68 KB of orchestrator to reach four numbers — is lifted verbatim at build time and the gate fails if it ever drifts from the live table.

## STILL GODLIKE, AND DELIBERATELY LEFT ALONE

`bohemia_loop.js` still applies `@DO faction` straight to `FactionWorld` — the omniscient scalar. **That was not ripped out**, because it is the quests/run lane's wiring and ONE SYSTEM ONE SESSION says it is not mine to cut. The witnessed organ is proved and watchable; swapping the loop over to it is a one-line change in somebody else's lane and is filed as such.

## WHAT HE CAN LOOK AT

**LIFE tab → HOW LOUD YOU WERE.** Auto-runs, nothing to tap. His real S17 quest, all four real endings, the same favour done at two volumes side by side, and the thirty-year bars. Runs the real modules inlined verbatim, not a mock-up.

```
QUIETLY  10 people found out of 88 -> they read NEUTRAL (0.18)
LOUDLY   73 people found out of 88 -> they read WARM    (1.33)
```

## HONEST NOTES ON GETTING IT WRONG

Three things were built wrong first and are worth keeping written down:

1. **A claim was written before the measurement.** The generational gate claim asserted a quiet deed carries *zero*. Measured, it carries a few — one retelling in a chatty street still reaches somebody. The claim was rewritten to what is true (the *spread*, across all four tiers), not the measurement bent to the claim.
2. **A threshold masquerading as a law.** "Reckless reach must be under 22 tiles" failed by two tiles and told me nothing. The property that actually matters is **sub-linearity** — twice the drama must be less than twice the sightline — which is exact, needs no constant of mine, and is checked against his live table.
3. **The world was too small for the question.** The thirty-year panel first ran in the faction-sized field, where the loudest deed reached 73 of 88 people and so had only 15 strangers left to hear about it — and the bar chart came out saying a reckless deed is *forgotten fastest*. The mechanism was right; the frame was wrong. The generational question is about the whole valley, and it has to be, because the thing being measured is whether there was anybody **left to tell**.

---
*BOHEMIA — How Loud You Were — 8.6.26*
*The size of a thing is what you did. The volume of it is who ever finds out. They were never the same number.*
