# E21 [marker sweep] ROUND ONE, SCHOOL: THE CHECKER EVERYBODY USES WOULD BE RED ON ALMOST EVERY COMMIT WE MAKE

EYES AND EARS, lane 17, E21 round one of two. 9/22/26. MODE: SCHOOL THEN CHECK, so nothing is
built this round; this is the research and the premise measurement that round two is armed with.

THE ROW: *"ECONOMY reported a bare conflict marker in the handoff at the EYES/UI seam; the
coordinator's check found only the long decorative separators. School first (how teams catch merge
debris in shared prose files), then the check: a sweep that distinguishes a real seven-character
marker from a separator, on every shared file, every ship."*

---

## THE PREMISE FIRST (rule 12), AND IT IS NOT WHAT THE ROW ASSUMES

**There is no live merge debris in this repo right now.** Swept every tracked file for a line that
*starts* with a marker shape:

```
  lines starting <<<<<<<           0
  lines starting |||||||           0   (the diff3 base marker, which the row never mentions)
  lines starting >>>>>>>           1
  lines that are exactly =======   1
```

Both hits are lookalikes, and each one is a different class:

1. `records/BOHEMIA_I_WAS_WRONG_ABOUT_THE_FONT..._8_27_26.md:190` is a real marker **quoted inside
   a fenced code block**, in a record whose whole subject is that marker rendering on the splash.
   It is a photograph of debris, not debris.
2. `archive/handoffs/RECOVERED_2026-09-13.md:2715` is a bare `=======` used as a **separator**
   between recovered handoff blocks.

So ECONOMY's report and the coordinator's check are both explained and neither was wrong: what
exists is quotes, prose mentions and separators. The row's job is still real, because the thing it
guards against **did happen here once** (the 8/27 splash), but round two is building a guard, not
chasing a live bug.

And the size of the haystack, measured, because it decides the design:

```
  lines anywhere containing a marker shape   247 in 26 files
  lines that are 7+ equals signs           3,504 in 332 files
  lines of 3+ equals alone in a .md file   2,583
```

---

## WHAT THE WORLD USES, AND WHAT IT DOES ON OUR FILES

Two checkers are the standard answer. I ran both rather than reading about them.

**1. `git diff --check`, git's own.** It reports `leftover conflict marker` and exits 2. Measured
in a throwaway repo, one file at a time:

```
  a real conflict set (7-char markers)        FLAGGED, all three lines      correct
  a Markdown setext heading: text + =======   FLAGGED                       WRONG
  a marker quoted inside a fenced code block  FLAGGED                       WRONG (that is our own record)
  a diff3 base marker |||||||                 FLAGGED                       correct
  a prose mention of a marker mid-line        not flagged                   correct
  a REAL conflict set written with 32-char markers   NOT FLAGGED            WRONG, and see below
```

**On this repo that first wrong row is fatal: `=======` on its own line is legal Markdown, it is a
setext heading underline, and we have 2,583 of them.** The checker that every team reaches for
first would be red on nearly every prose commit here, and a gate that is always red is a gate
everybody turns off. That is the finding that proves the obvious plan wrong, and it is why this
row says "distinguishes a real marker from a separator" in the first place.

**2. pre-commit's `check-merge-conflict`.** Its patterns are `<<<<<<< `, `======= `, `=======\r\n`,
`=======\n`, `>>>>>>> `, matched at line start on the raw bytes, so it has **the same `=======`
false positive**. And it has a second failure mode that matters more to this lane: unless it is
given `--assume-in-merge`, it returns 0 **without scanning anything** when the repo is not in the
middle of a merge (it looks for MERGE_MSG plus MERGE_HEAD or a rebase directory). In CI that means
it passes by declining to look. A gate that never runs is not a gate.

---

## THE SEVEN IS NOT A LAW, AND I PROVED IT

The row says "a real seven-character marker". Seven is only the default. `conflict-marker-size` in
`.gitattributes` changes it per path, and git then writes longer markers:

```
  git merge-file --marker-size=32  ->  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< mine.txt
                                       ================================
                                       >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> theirs.txt
```

This repo sets nothing today (`git check-attr conflict-marker-size` says unspecified on the
handoff, and there is no `.gitattributes` at all), so seven is what we would get. But a sweep that
hardcodes seven is a sweep that breaks silently the day somebody adds that file, and silent is the
one thing this lane does not ship.

**And the attribute is also the published fix for the Markdown collision, which I checked in both
directions.** With `*.md conflict-marker-size=32` set:

```
  the 32-char conflict set      FLAGGED, all three lines   (git honours the attribute)
  the setext heading =======    NOT FLAGGED                (the false positive is gone)
```

That is a real, cheap option for round two, and it is a **fleet-wide change to how every lane's
merges are written**, so it is a proposal with a measurement behind it, not something this lane
sets on its own in a school round.

---

## THE OTHER HALF NOBODY MENTIONS: A DIFF CHECK CANNOT SEE OLD DEBRIS

`git diff --check` only reads the lines in a diff. Committed debris that nobody touches again is
invisible to it, measured:

```
  debris committed, then an unrelated later change   git diff --check: exit 0, nothing said
  the same tree, whole-file sweep                    3 marker lines found
```

Our one real incident was exactly this shape: it reached the shipped splash and was caught by a
page gate, not by a merge check. So the row's "on every shared file, every ship" is right, and it
needs **both** halves: a whole-tree sweep for what is already in, and the diff check for what is
arriving.

---

## WHAT ROUND TWO BUILDS, WRITTEN DOWN NOW SO IT CANNOT DRIFT

1. **A candidate is a line whose first characters are a run of `<`, `|`, `=` or `>` of the length
   in force for that path** (read from `git check-attr conflict-marker-size`, default 7), where an
   opening, base or closing run is followed by a space and a label, and an `=` run is alone on its
   line.
2. **A FINDING needs the ordered set inside one file**: an opening marker, then optionally a base
   marker, then a separator, then a closing marker, in that order. A lone `=======` is never a
   finding by itself. This is the discriminator the row asked for, and it is what the published
   write-ups converge on too.
3. **Fenced code blocks in Markdown are excluded**, because our own record is the counter-example
   and a checker that accuses a record of quoting an incident is a checker nobody trusts.
4. **RULE ZERO, the controls**: plant a real conflict set (must be found), plant a decorative
   separator file and a setext heading (must be ignored), plant a quoted marker in a fence (must be
   ignored), plant a 32-char set with the attribute set (must be found). No numbers get printed
   unless all five behave.
5. **Both halves, and the diff half runs even outside a merge**, unlike the standard hook.

## BLIND SPOTS, STATED

I did not test Windows line endings on our files; the pre-commit hook carries an explicit `\r\n`
pattern, which says the world has been bitten by it. I did not check whether any of our generated
slices could carry a marker inside a string literal, where a line-start test would fire on machine
output rather than prose. Both go on round two's list.

## PROOF

- every measurement above is a command in a throwaway repo or a sweep of this tree, re-runnable
- git's own docs on `conflict-marker-size`, and pre-commit's `check_merge_conflict.py` source
- round two writes the sweep, its controls, and the gate
