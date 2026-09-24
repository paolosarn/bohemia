# A CONFLICTED FILE NEVER REACHES MAIN

PLUMBER, row `[no markers]`, 9/24. This lane named the job two rounds ago and did not build it
(33a3923: *"nothing stops a conflicted file reaching main... a pre-push leg is cheap and is this
lane's"*). The coordinator put it on the board. Here is what it turned out to be.

## THE ROW SAID TWICE. IT WAS FOUR, AND ONE WAS A PUBLISHED SLICE

Swept every commit in reach, 2,022 of them, for commits that ADDED a conflict-marker line, then
separated real conflicts from documents that merely quote one:

```
7 commits added marker lines
4 of them were REAL unresolved conflicts that reached main:

  9eec17d1  9/22  records/target/BOHEMIA_VOTE_REGISTRY.json    <- his VOTE tab
  548c26e3  9/12  00_START_HERE_NEXT_SESSION.md                <- the handoff
  ab03fdfb  9/12  00_START_HERE_NEXT_SESSION.md                <- the handoff, again
  1d5137d3  9/05  slices/BOHEMIA_CITY_WORLD.html               <- A PUBLISHED SLICE

3 were records quoting a marker while describing this exact class of bug.
```

Three weeks, four files, at least four lanes. **Not a one-round accident.**

A correction to the row while I am here: it names PEOPLE `d4b24e8` as the second offender. That
commit is the **fix** ("the rebase committed the vote registry with its conflict markers in it,
and..."); its diff adds zero marker lines. The other three are above.

## AND THE LEG THAT WAS ALREADY HERE COULD NOT HAVE CAUGHT A CONFLICT IN THE ALPHA

`gates/handoff_gate.js` had a sweep. It carried this line:

```js
if (body.length > 4e6) continue;      // the 34MB alpha, not text to diff
```

Measured what that exempts:

```
22 MB  slices/BOHEMIA_RUN_CURRENT.html
 7 MB  00_START_HERE_NEXT_SESSION.md        <- the file the leg above it is named for
 6 MB  slices/BOHEMIA_VOTE_CURRENT.html
 5 MB  slices/BOHEMIA_DEMO.html
 5 MB  slices/BOHEMIA_CITY_WORLD.html       <- the 9/5 incident, exempt
 5 MB  slices/BOHEMIA_ALPHA_0_9.html        <- THE FILE HE PLAYS
```

**Every surface Paolo actually touches was exempt from the check written to protect it.**

PROVED, not argued. Planted a real unresolved merge at the alpha's `<body>` and ran the gate as
it stood:

```
=== HANDOFF GATE: 8 passed, 0 failed ===   exit 0
```

Silence. And this is not hypothetical damage: the 8/27 record in this repo describes a merge
marker and seven lines of internal prose **rendering on the front splash of the game.**

**The skip bought nothing.** `git grep` over the whole tree, the four 45 MB tile banks included,
takes **0.31 seconds**. So git finds the candidate files and only those few are ever read. No
extension list, no size limit, and the gate got **faster**: 1,953 ms to 829 ms while sweeping
strictly more.

## THE RULE IS STRUCTURAL, NOT A WORD SEARCH, AND THAT DECISION WAS MEASURED

Across 4,879 tracked text files:

```
"any line starting <<<<<<< or >>>>>>>"   ->  1 file
   records/BOHEMIA_I_WAS_WRONG_ABOUT_THE_FONT_..._8_27_26.md
   which is the record QUOTING this exact bug

the ORDERED TRIAD  <<<<<<< x / ======= / >>>>>>> y   ->  0 files
```

A check that goes red on a document describing the failure is a check the fleet switches off,
and then it protects nothing. The triad separates the two cleanly with nothing in between, and
it is what an unresolved conflict actually *is*.

## SECOND LEG: EVERY JSON ON THE PUBLISHED SURFACE MUST PARSE

The markers were only how it broke that time. What reached his phone was **a file the VOTE tab
could not read**, and a stray comma does that with nothing to grep for. The published surface is
`slices/` + `engine/` + `records/target` (`_config.yml`), so those are the files a bad one
actually reaches him through.

## MUTATION-CHECKED FOUR WAYS, EXIT CODES READ WITHOUT A PIPE

| mutation | result |
|---|---|
| the real bytes of all four incidents, replayed one at a time | red every time, exit 1 |
| a real merge planted at the alpha's `<body>` | **8/0 exit 0 before, 8 passed 1 failed and named after** |
| one extra comma in the vote registry, no markers anywhere | red on the JSON leg only, marker leg correctly silent |
| the record that quotes a marker | 9 passed, 0 failed |

The second row is the one that matters. The third proves the two legs are independent. The
fourth is the one that keeps the leg switched on.

## WHAT IS STILL NOT FIXED, SAID PLAINLY

This runs in the pre-push pass, which means **it catches a conflict before YOUR push, not before
the push that already happened.** Every one of the four incidents was found by somebody else's
gate run, in somebody else's round. A leg in a gate cannot be a git hook, and this repo has no
hook install step. Until it does, the honest claim is: a lane that runs its pre-push pass cannot
ship a conflicted file, and a lane that skips it still can.

## THE THING BEHIND ALL OF IT

Every one of the four came from the same three keystrokes: a rebase resolver threw, `git add -A`
staged the file **with the markers in it**, and `rebase --continue` committed it without a
complaint. Git will happily commit a conflicted file the moment you stage it. The only defence
is a machine that looks, which is what this is.
