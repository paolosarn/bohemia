# FAMILY: THE GENERATION TURNS, AND THE VALLEY REMEMBERS WHAT GOT REPEATED
## 9/5/26, FACTIONS lane. Paolo said one word: **FAMILY**.

TAB: **RUN** → the ⚔ OUTFIT board, under the outfits.
TAB: **DIRECT** → STANDING → *FOLD A GENERATION* (the instrument).

---

## 1. WHY THIS WAS THE WORK

CLAUDE.md's own top, his 8/28 ruling that the dynasty lives, says a handoff
**inherits everything** the last life built and names the list: "compound,
**STANDINGS**, territory, the family tree, and the unhealed wounds."

Standings are named. They are this lane's.

`engine/bohemia_standing.js` has carried `inherit()` and `legendOf()` since
8/20, and `tools/bohemia_organ_reach.js` has reported both reached by **NOTHING
ANYWHERE** on every run since. The module states the rule in its own words:

> A QUIET GOOD DEED DIES WITH THE WITNESS.
> A NOTORIOUS ONE BECOMES THE THING YOUR CHILD IS JUDGED FOR.

...because `inherit()` keeps only deeds with `hops > 0` — the ones somebody
**retold**, by a person still alive when the eyewitnesses are not.

**Neither could have meant anything sooner.** A deed's loudness did not decide
its hop budget on the walked surface until 8/28, when the quest corpus started
filling `DEED_WEIGHT` and clout tags started driving `reachOf`/`hopsFor`. **The
dynasty half was waiting on the reputation half, and nothing said so.**

---

## 2. MEASURED THROUGH THE REAL ORGANS — AND THE FIRST MEASUREMENT WAS WRONG

400 people over 40×40, one deed of each loudness published, gossiped ten rounds,
then a generation folds:

```
CLOUT       saw  gossiped   held  retold  CARRIED   died
  quiet       33        20     53      20       20     33
  notable     86        25    111      25       25     86
  risky      154        71    225      71       71    154
  reckless   285        60    345      60       60    285
```

**The run before that said `inherit()` carried NOTHING at all**, at every
loudness, in every valley size. I had placed the valley with
`x=(i*7919)%W, y=(i*104729)%W`, which collapses onto a lattice line instead of
filling the square — so almost nobody had a gossip neighbour, so nothing was
ever retold, so nothing could cross.

**I was one step from filing "the louder the deed, the less survives" as an
engine bug in the dynasty's own premise.** The ruler was broken, not the target,
and the tell was that the answer was *too dramatic*: an organ whose every unit
test passes does not usually fail totally.

> **WHEN A MEASUREMENT INDICTS SOMETHING THIS OLD, MEASURE THE MEASUREMENT FIRST.**

**One observation kept rather than fixed:** reckless (60) carries less than risky
(71), because at reach 24 nearly everybody is an *eyewitness*, and an eyewitness
cannot be told what they already saw — gossip dedupes on `(actor, kind, turn)`.
Saturation shrinks the pool who can carry the story. The ordering
`quiet << notable < risky ~ reckless` holds, and the 7/21 `CLOUT_WEIGHTS` are
**his**, so this is written down and not retuned.

---

## 3. WHAT SHIPPED

**`ctFold()`** folds every mind through `inherit`. Eyewitness memory dies with
the eyewitness; what was retold is re-attributed to the heir, marked with the
generation it crossed and whose deed it originally was.

**The heir is also `@`, and that is the ruling rather than a shortcut.** A run
resets you to nothing; a handoff is the opposite. Keeping the id means every
card, every rung and every outfit view keeps working and now reads the family's
history as the player's own — which is exactly *you are born owing what your
father owed*. `legendOf()` tells the two apart again, because it counts only
deeds carrying `inherited`.

**And it is readable.** On the OUTFIT board:

```
WHAT THEY STILL SAY ABOUT YOUR FAMILY
  YOUR FATHER            2 STILL TELL IT
    Handed the tap to the trades. Daylight patch, every name on the work order.
```

The sentence is the quest's own `@LOG` line out of `BohemiaDeeds.labels()` — the
same source the card's reasons use, so the family's history and the day's gossip
are never two different voices. **A row with no sentence is dropped rather than
shown as a raw machine id.**

**The generation is written down** (`boh.city.gen`), because a dynasty that
forgets which life it is on when you close the tab is not a dynasty.

---

## 4. AND HE CAN TURN IT HIMSELF

**TAB: DIRECT → STANDING → FOLD A GENERATION.**

HE MUST BE ABLE TO DIRECT IT (8/12). How a reputation crosses a generation is
mine and it is built. **When** one turns is a story decision and his, and the
game has no such beat yet — so without this, the answer to "where does he change
this himself" is "he tells me and I edit a file", which the law says is not
shipped.

Proved end to end: first tap arms and warns, second tap folds, and the city
answers with what it cost —

```
generation 2 · 2 still told, 2 died with the people who saw them
```

**It asks twice on purpose.** A fold kills every eyewitness memory in the valley
and cannot be undone from there. What it destroys is the only record of what the
player did, and a control that quietly eats a life on the first tap is one he
stops trusting — the lesson the VOTE tab paid for on 8/28.

**Nothing folds on its own.** No timer, no act boundary, no death.

---

## 5. THREE BROKEN RULERS IN ONE TURN

1. **The lattice-line valley** (§2) — nearly filed a false engine bug.
2. **The fold button measured 0px tall**, which would have failed THE THUMB.
   `#app` is `display:none` behind the front splash, so every DIRECT element
   measures zero height until the splash is tapped. The button was **44×174** the
   whole time. The gate now dismisses the splash before measuring, so the claim
   is on laid-out pixels rather than on a node nobody can see.
3. (Last turn's, for the pattern) the cast read one level too shallow.

Every one produced a confident, wrong number about somebody else's code.

---

## 6. GATES

```
FACTION BETWEEN   163 passed, 0 failed   (was 149)
DIRECT             33 / 0
STANDING           35 / 0
THE WHOLE DEMO     23 / 0
DEMO BUILD         25 / 0
ALPHA LOADS        20 / 0
```

**Three mutations, all bite:**

| mutation | dies |
|---|---|
| the fold carries everything (eyewitness memory survives death) | T6, T7 |
| the legend shows raw machine ids instead of his sentence | T9, alone |
| the generation is not written down | T8, alone |

T1 and T6 are the claims that matter and **both are about what must NOT
survive.** A gate that only checked that something crossed would pass just as
happily on a fold that carried everything — the version that quietly turns a
dynasty into a save file.

The demo carries only the `run` tab, so the dev fold control is unreachable
there; the demo build gate is green.

---

## 7. WHAT IS STILL DEAD, AND WHAT IS PENDING HIM

- `BohemiaPeople.peopleOf` and `BohemiaDeeds.sayWhy` remain reached by nothing.
  `sayWhy` is now superseded in practice by the surface reading `labels()`
  directly — worth collapsing to one path next time this is opened.
- **The demo still draws one person at a time** (measured 8/30, `maxDrewAtOnce:
  1` with 34 people within six cells). That caps every witness set in the game
  at one person, so the whole loudness model cannot express itself in play. It
  is RUN/WORLD's, and it is the biggest single thing holding this lane's work
  down.
- **Pending him, unchanged:** `AFFILIATED_RATE` (0.30), `REACH_CELLS` (12), and
  the 7/21 `CLOUT_WEIGHTS`. Nothing new was added to his queue.
