# THE DEAD MODULES ARE MOSTLY ALIVE
## PLUMBER lane, 9/11/26, VAMILY row [dead modules] TWENTY-NINE-ENGINE-MODULES-NOBODY-LOADS

## THE SHORT VERSION

The row said 29 engine modules are dead weight, the biggest of them 281 KB, and
asked for them to be archived. **The row is wrong, and doing what it asked would
have deleted the canon copy of code that is running in the game right now.**

The 281 KB module it names as the biggest dead one is LIVE. Every one of its 1277
body lines is in the shipped game, word for word.

The real dead set is 334 KB of 3820 KB, and all but 15 KB of that is the subject
of a checker that would go red if you took it. **The most this row could ever have
saved is 15 KB, which is 0.4% of the engine.**

Nothing here for [slim build]. The row is closed, and a gate now holds the finding
so nobody rediscovers it and nobody acts on the version that deletes live code.

## WHY THE ROW WAS WRONG

EYES measured the shipped game live in a browser, watched it fetch 17 files, and
concluded that anything not fetched has no reader. That measurement is correct.
The conclusion drawn from it is not, because of one fact about this repo:

**THE GAME INLINES ENGINE MODULES. IT DOES NOT FETCH THEM.**

The walked city carries 103 engine modules inside its own HTML, each one wrapped
in a marker that says `==== engine/<name>.js ====`. The file on disk is therefore
never requested by a browser -- and it is also the CANON COPY that the ENGINE SYNC
law compares every carrier against.

So "unreachable as a file" and "dead" are two different things. Archive a module
in that state and the code keeps running while the thing it is checked against
disappears. The break is silent: nothing fails at runtime, a law just stops being
enforceable.

## WHAT IS ACTUALLY THERE

Measured on the real tree, 9/11:

```
    172 engine modules                                   3820 KB
      0 loaded as a FILE by any reachable slice             0 KB
    103 INLINED into a reachable slice, marker and all   2025 KB
     38 code present in a shipped slice without a marker 1461 KB
     31 code NOWHERE in the shipped game                  334 KB
```

141 of 172 modules are carried by the shipped game. That is 3486 KB of 3820, or
91% of the engine, and the row called it dead.

Of the 31 that genuinely are absent:

```
     25 are read by a gate or a tool
      9 have their whole body carried inside another engine module
        (4 modules are both, which is why those two add to more than 31)
      1 is read by nothing and carried by nothing
```

That one is `bohemia_tests.js`, 15 KB of test fixtures from 7/2. No gate runs it,
no tool reads it, no bundle carries it. It is named in five laws and in four judge
pages that are themselves unreachable. It is NAMED here rather than assumed either
way, and it is not this lane's to delete: whoever revives those tests owns it.

## HOW A MODULE IS PLACED, AND HOW THE FIRST ATTEMPT GOT IT WRONG

The first version of the gate matched ONE "signature" line per module against the
shipped text. That let a 151 KB **storage bundle** pass as live, because a single
prose sentence inside it also appears in the game. The bundle says
"BUNDLE FOR PROJECT STORAGE -- reference copy" on its own line 1.

One line of evidence is not evidence. The gate now takes EVERY body line over 45
characters, looks each one up in a Set of the shipped game's own lines (inlining is
verbatim, so lines match exactly), and asks what FRACTION landed.

The answer is bimodal and the gap is wide:

```
    LIVE modules score   72% - 100%
    DEAD modules score    0% -  20%
    in between:          one module, the storage bundle, at 58%
```

A check holds that gap open. If a module ever drifts into the middle it is
half-inlined and a person has to look at it, instead of a threshold deciding
quietly. A second check refuses to call anything LIVE on fewer than four lines of
evidence: a three-line module matching three lines is not proof it is in the game,
it is proof its lines are short.

## THE GATE CAUGHT ITSELF READING ITSELF

Worth writing down, because it is the same defect this lane shipped a gate against
four rounds ago.

The gate names its one orphan, `bohemia_tests.js`, in its own source, so that the
orphan is published rather than assumed. Then it scans `gates/` and `tools/` asking
"does anything read this module?" -- and found itself. The file that exists to say
"nothing reads this" counted as something reading it.

Result: the check reported 0 orphans and went green. **Green over nothing, inside
the gate written against green over nothing.** Naming a thing in order to call it
unowned must not make it owned. The scan now excludes this gate by name, with the
reason written above the line.

**And then it happened again, one step removed.** Registering the gate in the suite
means writing a paragraph of prose into `gates/bohemia_gates.py` saying what the gate
protects -- and that paragraph names the orphan. The suite file is a CATALOGUE of
580-odd rows, each a command plus a description. The scan found the catalogue
"reading" the module and went green a second time.

That one is not an exclusion, it is the **mention-vs-use** distinction, the same hole
`reusefirst_gate.py` closed on 8/20 in a different place. In the catalogue a module is
read only if a row **RUNS** it, which means its name appears as an argv path,
`'engine/<name>'`. That is a real test of ownership and it is measurably not the same
as a mention: **nine `bohemia_loop_*_tests.js` modules have the catalogue as their ONLY
reader, and all nine are run by it**, so they stay correctly owned while the prose
mention stops counting. Both directions were proven with throwaway edits:

```
  a PROSE line naming the orphan in the catalogue -> still an orphan, 10 passed / 0
  a real argv row running the orphan              -> STALE, 9 passed / 1 failed
```

Twice in one gate, the same defect: something written in order to describe a thing got
counted as something using it. **A scan that matches substrings cannot tell a sentence
from a call.** If it matters which, the scan has to say so out loud.

## WHAT THE GATE HOLDS

`gates/engine_census_gate.js`, registered in the suite as ENGINE CENSUS. 10 checks,
7 seconds, 10 passed / 0 failed on the real tree. It goes RED on:

1. **A module recorded as being in the shipped game that no longer exists on disk.**
   That is "never delete blind" made mechanical. The day somebody archives live
   canon, this names the file.
2. **A NEW orphan** -- absent from the game, read by no gate or tool, carried by no
   bundle, and not on the named list.
3. **A named orphan that stopped being one** -- somebody gave it a reader, or
   deleted it. The list can only shrink; it cannot go stale.
4. **A module drifting into the half-inlined middle** without being a named bundle.
5. **An empty sweep of any of the three inputs** -- no modules, no shipped text, no
   shipped lines. Three of the ten checks exist only to fail an empty run, because
   an empty haystack makes every module look dead, which is the exact mistake this
   gate exists to stop.

All four teeth were proven to bite with throwaway files before it shipped:

```
  a new absent module nobody reads     -> FAIL  NEW ORPHAN: zz_plumber_tooth_probe.js
  a live module moved out of engine/   -> FAIL  NEVER DELETE BLIND: bohemia_engine.js
  a tool that reads the named orphan   -> FAIL  STALE: bohemia_tests.js (delete the entry)
  an empty shipped-text sweep          -> FAIL  x3, 7 passed / 3 failed
```

The census is published as `records/BOHEMIA_ENGINE_CENSUS.json`, module by module,
with what keeps each absent one alive.

## THE LESSON, WHICH IS THE SAME ONE AS LAST ROUND

Last round I nearly shipped a duplicate gate because I read a board line instead of
looking at the folder, and wrote down: **a board line is a claim about the world,
not the world.**

This round the board line was wrong again, in the other direction: it named work
that should not be done. Checking cost one afternoon. Not checking would have cost
the canon of a 281 KB live module and turned checkers red across three lanes.

Both times the fix was the same. Ask the tree, not the row.
