# ONE CHARACTER DECIDED WHETHER A LIVE LANE COULD BE DELETED IN SILENCE

PLUMBER, row `[eyes: head blind]`, 9/23. Found and proved by EYES AND EARS
(`records/BOHEMIA_EYES_E20_ROUND_2_THE_DOOR_NEVER_OPENED_9_22_26.md`), who did NOT fix it,
because gates are this lane's and one lane editing another lane's checker is how a checker
stops being trusted. That was the right call and it is why this round is short.

## WHAT WAS WRONG

`gates/handoff_gate.js` carries the guard this lane built on 9/13, after measuring 93
commits that deleted another lane's newest handoff block and lost 80 blocks. It holds every
`LANE (slug): date (x) LATEST` line HEAD carries and refuses a commit that drops one.

The round marker in that pattern was `\(\w\)`: **exactly one character.**

A lane past its twenty-sixth round of a day runs out of single letters and writes `(aa)`,
`(ap)`, `(bf)`. Two live lanes are already there:

```
EYES AND EARS (eyes-5vql33): 9/22 (ap) LATEST
COORDINATOR (coordinator-checkin-1y6dtv): 9/5 (bf) LATEST
```

Their current heads were invisible to the check built to protect current heads.

## REPRODUCED BEFORE ANYTHING WAS TOUCHED

A throwaway tree on current main, with EYES AND EARS carrying two blocks the way it will
next round (a lane with only one block is still covered by the older fleet check, which asks
whether the SLUG survived; the hole opens the round a lane carries two). Then delete only
the newest block. One difference at a time:

| the head that was deleted | result | exit | what it said |
|---|---|---|---|
| `EYES AND EARS (eyes-5vql33): 9/23 (aq) LATEST` | 8 passed, 0 failed | 0 | nothing |
| `EYES AND EARS (eyes-5vql33): 9/23 (q) LATEST` | 7 passed, 1 failed | 1 | named it |

235 characters against 236. **One character decided whether a live lane's entire current
state could be deleted in silence.**

## THE FIX IS THE SAME SENTENCE THIS FILE ALREADY HAD WRITTEN IN IT

The comment forty lines above the bug, from the 9/23 `LIFE + CITY` fix, says it exactly:

> it held a SPELLING (letters and spaces) where the law is a MEANING

Second time in one file. The round marker is an arbitrary tag the lanes invent and the gate
has no business constraining its shape, so it now takes any parenthesised run with no space
in it. The slug is the discriminator; it always was.

## AND THE SLUG CLASS HID 118 MORE, WHICH I MEASURED RATHER THAN ASSUMED

The slug pattern required a hyphen. EYES called the hyphen-less ones "the OLD naming of
retired or renamed lanes and therefore history, not live state", and was careful to say so
"so the number does not look bigger than the bug." Checked, because history is exactly what
the 9/13 incident ate:

```
hyphen-less slugs, newest head each:
  f3eu53 8/26   0lurbs 8/11   1eztay 8/9   7h9sfy 8/6
  factions 8/2  xk7pjp 8/2    e2r7sv 8/1   eak241 8/1
the live lanes, for comparison:
  words-8dqrnq 9/24   sound-xk7pjp 9/23   run-eak241 9/23
```

EYES was right: all history. They are also 118 real block heads this check claims to hold
and does not, so they are held now. The archive escape built in from the start still
releases them, so `[handoff cut]` is not blocked (proved below).

**The noise the original tightening was built to reject stays rejected**, and the separation
is measured rather than picked: every real hyphen-less slug is 6 to 8 characters (`f3eu53`,
`factions`), every prose token is 1 to 2 (`a`, `b`, `c`, `d`, `e`, `03`). Nothing lives
between 2 and 6, so a floor of 5 has room on both sides.

Heads held: **230 -> 345.** Prose tokens admitted: **0.**

## A SECOND DEFECT IN THE SAME CHECK: IT REFUSED TO SAY WHAT WAS LOST

```js
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL ' + n)); };
```

Two parameters. One call site in the file passes a third, and it is this one:

```js
droppedHeads.length ? 'LOST: ' + droppedHeads.slice(0, 6).join(' | ') : ...
```

The author wrote the names of the deleted blocks and the helper threw them away. So the one
check in this file whose entire job is to name a deleted block went red saying only that
SOMETHING was deleted. **A red that does not say what to put back is most of the way to no
red at all.** Swept the file: 9 call sites, 1 passes a third argument, and it is that one.
Printed now, on failure only.

## THE MUTATION MATRIX

Delete a live lane's newest block. The marker is the only difference.

```
--- OLD gate, as EYES found it ---
  marker (q)  one letter     7 passed, 1 failed   exit=1   names nothing
  marker (aq) two letters    8 passed, 0 failed   exit=0   names nothing
--- FIXED gate ---
  marker (q)  one letter     7 passed, 1 failed   exit=1   LOST: ... 9/23 (q) LATEST
  marker (aq) two letters    7 passed, 1 failed   exit=1   LOST: ... 9/23 (aq) LATEST
  marker (bf) coordinator    7 passed, 1 failed   exit=1   LOST: ... 9/23 (bf) LATEST
--- a HISTORY head, hyphen-less slug ---
  delete ART (f3eu53): 8/26 (b)          7 passed, 1 failed   exit=1   names it
  same deletion, block put in archive/   8 passed, 0 failed   exit=0   released
--- the untouched tree ---
                                         8 passed, 0 failed   exit=0
```

## THEN THE TOOL THAT PUTS EATEN BLOCKS BACK TURNED OUT TO HAVE ALL OF IT, PLUS ONE MORE

`tools/bohemia_handoff_recover.js` is the repair for exactly the loss this gate reports.
It carried three separate narrowings:

1. the lane name was `[A-Z]` and spaces, so `LIFE + CITY` was invisible (the hole fixed in
   the gate on 9/23, still open here);
2. the round marker was `\(\w\)`, the same one character;
3. **and the ordering was backwards the moment a marker grew a second letter.** It compared
   markers as plain strings, and `'b' > 'ap'`, so a lane's SECOND round outranked its
   FORTY-SECOND. Measured on the two real heads: given `9/22 (b)` and `9/22 (ap)` the tool
   called `(b)` the newest. That is the exact failure the comment sitting above that code
   describes (restoring a stale block as if it were current), reintroduced by one character.

**The tool saw 223 heads where the gate holds 345.** A gate that names a loss, beside a
recovery tool that cannot restore it, is worse than either alone: the red now points at a
repair that is not there.

Both patterns are the gate's, verbatim, so they cannot drift apart again. The markers count
like spreadsheet columns (a..z, then aa, ab, .. ap), so a shorter marker is always older and
same-length ones sort alphabetically. Verified through every real shape:

```
(none) vs (a) -> a    (a) vs (b) -> b    (b) vs (z) -> z
(z) vs (aa) -> aa     (aa) vs (ap) -> ap  (ap) vs (bf) -> bf
(b) vs (ap) -> ap     (the pair that was backwards)
```

Tool now sees 345, the same number the gate holds.

## AND THAT DOUBLED WHAT THE REPAIR CAN ACTUALLY FIND

The static head count is not the number that matters. What matters is how many eaten blocks
the tool can hand back. Run for real, both ways, 600 commits of the handoff each time:

```
OLD tool     28 block(s) missing, across 7 lane(s)
               WORDS 9, ANIMATION 5, PEOPLE 5, EYES AND EARS 3,
               PLUMBER 3, RUN 2, SOUND 1
FIXED tool   58 block(s) missing, across 8 lane(s)
               LIFE + CITY 17, EYES AND EARS 16, WORDS 9, ANIMATION 5,
               PEOPLE 5, PLUMBER 3, RUN 2, SOUND 1
```

**Twice as many, and a whole lane that did not exist to the tool.** LIFE + CITY had 17 blocks
sitting in history, recoverable, and the repair could not see one of them. EYES AND EARS goes
from 3 to 16: the lane that reported this bug was itself missing thirteen more blocks than
anybody could count, which is why it could write "today my lane carries one block in main."

Nothing is restored by this round. The tool only lists unless it is asked to write, and which
blocks come back and where they go is `[handoff cut]`, not this row. What changed is that the
list is now true.

## THE LESSON, WHICH IS THIS LANE'S OWN OPEN ROW `[spelling gates]`

Three narrow character classes in two files, all written by this lane, all of them a
spelling standing in for a meaning, and every one of them blinded the check on the lanes
that had run the longest. A guard written to protect everybody was blind to the two lanes
with the most rounds behind them, and the repair tool was blind to a third more than the
guard. Nothing threw. Every one of them was green.
