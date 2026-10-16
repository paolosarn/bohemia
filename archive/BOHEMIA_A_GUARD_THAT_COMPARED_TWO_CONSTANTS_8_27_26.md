# A GUARD THAT COMPARED TWO CONSTANTS

**8/27/26 — FACTIONS lane. Two findings, same shape.**

## ONE. THE CHECK IN `ctBases()` COULD NEVER FIRE

```js
function ctBases(){
  if(String(BOH_SEED_TEXT) !== String(CT_BASES_SEED)) return null;
  return CT_BASES_BAKED;
}
```

`BOH_SEED_TEXT` is `const BOH_SEED_TEXT='bohemia'`. `CT_BASES_SEED` is baked
from that same constant at patch time. **Two constants.** The condition is
always false.

Its own comment says exactly what it is for:

> "keyed to the seed TEXT they were produced for: a different seed gets NULL
> rather than a confidently wrong answer."

The intent is right. The variable is wrong.

### WHAT ACTUALLY MAKES A DIFFERENT WORLD

```js
let seed = BOH_ONE_SEED();                  // boot, derived from the text
...
seed = (seed*1103515245+12345)>>>0;         // REROLL, one LCG step
```

REROLL builds an entire new overmap off that number and never touches the text.
So after a reroll the baked bases describe a world that no longer exists, while
the guard written to catch precisely that watches a variable that cannot move.

### MEASURED BY PRESSING THE REAL BUTTON

| | before | after |
|---|---|---|
| `seed` | 2691674296 | **3182853632** |
| `ctBases()` null? | false | **false** |

The world is genuinely new and the guard went on answering.

**The damage is not that factions vanish.** The census comes out identical
either way, because people and assignment are keyed to cell coordinates rather
than to `seed`. What changes is the *terrain* under the bases: the Colorful's
ground might now be a golf course. Quieter than a crash, which is exactly the
kind this lane keeps finding.

### THE FIX IS THE COMPARISON THE COMMENT MEANT

`seed === BOH_ONE_SEED()` — "are we still in the world these were made for."
The text check **stays**; it catches a different thing (somebody edits the seed
and forgets to re-bake).

### AND WHEN IT FIRES IT SAYS SO, WHICH IS THE HALF THAT MATTERS

Returning null in silence is how this lane lost thirteen days: `factionOf`
answered null for all 166 people, and *"nobody in Las Vegas runs with anybody"*
is indistinguishable from a world where nobody does.

**A guard that goes quiet is the bug it was written to prevent.**

Board, and once in the console:

> **YOU REROLLED THE WORLD.** The outfits' ground was mapped for the valley that
> was here before, so none of it applies any more and nobody runs with anybody.
> Reload to get that valley back.

REROLL lives in the builder drawer and is hidden from the demo, so this is a
workshop consequence rather than a player one. It is still the difference
between a tool that tells you what it did and one that doesn't.

## TWO. THE VALLEY LIST SAID WHERE TO WALK AND NEVER WHY

Yesterday's measurement: the nearest outfit is **29 cells** from the spawn, or
**3,712 tiles**. Yesterday's fix put every outfit on the board with a bearing
and a distance. That makes the system **findable**. It gives nobody a **reason**.

### AND THE REASONS WERE ALREADY WRITTEN

`engine/bohemia_belonging.js` `RULES` carries, for all sixteen outfits, a
one-line `anchorWant` and a `pays`:

| outfit | what they want | what they pay |
|---|---|---|
| COLORFUL | To know whether you are safe to be around | A NETWORK INSIDE EVERY OTHER FACTION |
| MOB | You ACCOUNTED FOR. Not loyal, not employed - listed | ENFORCEMENT OF A DEAL |
| HOMELESS | To be left alone, and underneath that, to be WARNED | THE UNDERGROUND, AND WHEN IT IS A GRAVE |
| CARTEL | They want you to OWE them | WHATEVER YOU NEEDED THAT WEEK |
| REDS | A counterparty. They want you solvent, productive and slightly in debt | CREDIT |
| CHURCH | You inside the structure. Attending, counted, and useful to somebody on the list | STORED FOOD AND A PLACE ON THE LIST |

**Every one of those was shown only on the card of somebody he had already
met** — which is to say, only after he had already made the walk it would have
justified.

Same shape as the four garments cooked for the Colorful in July and worn by
nobody for five weeks. **The material existed and never reached him at the
moment it would have mattered.**

### WHAT THE BOARD SAYS NOW — **RUN TAB**, ⚔ OUTFIT chip

```
NEAREST GROUND THAT BELONGS TO ANYBODY: COLORFUL, NORTHWEST, A LONG WAY OFF.

COLORFUL     NORTHWEST · A LONG WAY OFF            NEVER MET
             To know whether you are safe to be around
             THEY PAY: A NETWORK INSIDE EVERY OTHER FACTION

MOB          WEST · A LONG WAY OFF                 NEVER MET
             You ACCOUNTED FOR. Not loyal, not employed - listed
             THEY PAY: ENFORCEMENT OF A DEAL

HOMELESS     WEST · THE FAR SIDE OF THE VALLEY     NEVER MET
             To be left alone, and underneath that, to be WARNED
             THEY PAY: THE UNDERGROUND, AND WHEN IT IS A GRAVE
```

A list of directions became a list of reasons.

**Nothing is authored.** It is read out of the rules table and printed one
screen earlier. Gate claim **L4** compares every string against the module, so
the board may move his words but may never write new ones.

## GATE

`gates/faction_between_gate.js` — **81 claims, 0 failed** (was 73). Part L is new.

| mutation | went red |
|---|---|
| the guard reverted to two constants | L6, L7, L8 |
| the guard fires but goes silent | L7 |
| the board invents its own words | L4 |

## HOW I FOUND BOTH

Not by reading the code. By asking what happens when somebody presses a button,
and then pressing it.

The reroll finding came from chasing a different question entirely — *are the
baked bases even valid for the seed the player plays?* — and the answer was yes,
which is when the guard's inability to answer anything became visible.

## WHAT COMES AFTER

Unchanged from yesterday, and still not mine to decide:

1. **The spawn and the faction bases are placed by two systems that have never
   heard of each other.** I checked whether the loop has a player position to
   reconcile against: `bohemia_loop.boot()` returns `factionBases` and no player
   at all, so there is no existing answer to adopt. Reconciling them means
   *deciding* where the player starts relative to the outfits, which is
   placement, which is his.
2. **Or the dials move**: `AFFILIATED_RATE` (0.30) and `REACH_CELLS` (12), both
   marked `[PENDING Paolo]`.
3. **Or outfits get people who travel.** Real gangs have territory *and*
   runners. Needs a new dial, so it needs a ruling first.

The board now makes the system findable and gives a reason to go. It still does
not make it near.
