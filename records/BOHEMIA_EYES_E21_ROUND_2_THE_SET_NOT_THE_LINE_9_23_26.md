# E21 [marker sweep] ROUND TWO: THE FINDING IS THE SET, NEVER THE LINE

EYES AND EARS, lane 17, E21 round two of two. 9/23/26.
Round one (school): records/BOHEMIA_EYES_E21_ROUND_1_SCHOOL_THE_CHECKER_EVERYBODY_USES_IS_WRONG_HERE_9_22_26.md

THE ROW: *"a sweep that distinguishes a real seven-character marker from a separator, on every
shared file, every ship."* Built, with its controls, its gate and its mutation proof.

---

## WHAT SHIPPED

`tools/bohemia_eyes_marker_sweep.py` and `gates/marker_sweep_gate.py`, registered in the suite as
**MERGE DEBRIS**, failing (exit 1).

```
  4,842 tracked text files swept in 1.6 seconds
  findings (a whole ordered conflict set in one file)   0
  lone marker-shaped lines, reported and NOT counted    1
  marker size in force, asked of git per path           7
  planted controls that must behave first               6
```

The one lone line is the `=======` separating recovered blocks in the handoff archive. It is
printed beside the finding count on purpose, so a reader can see what the sweep chose not to
accuse.

---

## THE RULE, AND WHY IT IS THE ORDERED SET

A **candidate** is a line whose first characters are a run of `<`, `|`, `=` or `>` of the length
in force for that path, with a space and a label after an open, base or close run, and nothing at
all after a separator.

A **finding** needs the whole set inside one file: open, then optionally the diff3 base marker,
then the separator, then close, in that order. **A lone `=======` is never a finding.**

That is not a preference. Round one measured what happens when you do it the usual way: git's own
`git diff --check` and pre-commit's `check-merge-conflict` both flag a bare `=======`, which in
Markdown is a setext heading, and this repo carries **2,583** of those in `.md` and **3,504** lines
of seven-or-more equals overall. Either checker wired in here would be red on nearly every prose
commit, and E3 measured what happens to a checker that is always red: it gets muted inside a week.

**The marker length is asked of git, never hardcoded.** `conflict-marker-size` in `.gitattributes`
changes it per path, and git then writes markers at that length (proved in round one with
`--marker-size=32`). We set nothing today, so seven is correct today; a sweep pinned to seven is a
sweep that breaks silently the day somebody adds that file.

**Fenced code blocks in Markdown are excluded**, and this is not hypothetical: our 8/27 record
quotes a real marker while describing the incident where one reached the shipped splash. Measured
both ways on that file:

```
  fence rule ON    0 candidates
  fence rule OFF   1 candidate (line 190, a closing marker)
```

Even with the fence rule off it would not be a finding, because the ordered-set rule rejects it
too. Two independent legs, and I can say which one does what.

---

## RULE ZERO: SIX PLANTED CASES, AND NO NUMBER WITHOUT THEM

The sweep refuses to print anything unless all six behave:

```
  a real 7-char conflict set                     must be FOUND      found
  a decorative separator alone                   must be IGNORED    ignored
  a Markdown setext heading                      must be IGNORED    ignored
  a real marker QUOTED inside a fence            must be IGNORED    ignored
  a real 32-char set under its attribute         must be FOUND      found
  a set GIT ITSELF writes at --marker-size=32    must be FOUND      found
```

The last one is not a string in my own file: it shells out to `git merge-file`, takes whatever git
writes, and requires the sweep to find that. A control built from my own idea of the format proves
my idea, not the format.

---

## THE GATE, AND THE PROOF THAT IT BITES

Measured in a throwaway tree on current main, one difference at a time:

```
  clean tree                                           4 passed, 0 failed, exit 0
  a real conflict set planted in the handoff file      3 passed, 1 FAILED, exit 1
  the same tree with the plant removed                 4 passed, 0 failed, exit 0
```

The red names the file and the line (`00_START_HERE_NEXT_SESSION.md:41`), because a red that does
not say what to put back is most of the way to no red at all, which is the lesson PLUMBER wrote up
on this very round while fixing my last bounce-back.

**And the gate goes red if the sweep's own controls misbehave**, separately from the finding count.
A sweep reporting zero findings with broken controls is the most dangerous green there is.

---

## ONE THING I SAID I WOULD BUILD AND DID NOT, AND WHY THAT IS THE RIGHT ANSWER

Round one said the check needs two halves: a whole-tree sweep for debris already committed, and a
diff check for debris arriving. **The second half is not built, because the first one does its job
better.** The whole-tree sweep takes 1.6 seconds, so it runs in the pre-push pass as well as in the
suite; it sees the working tree, which is what a diff check sees, AND it sees files nobody touched,
which a diff check cannot (measured in round one: `git diff --check` exits 0 on committed debris
while a sweep finds three lines). Building a second, weaker checker to satisfy my own earlier
sentence would be work for the sentence, not for the repo.

## BLIND SPOTS, STATED

Windows line endings are untested here; pre-commit carries an explicit `\r\n` pattern, so the world
has been bitten by it. A marker inside a string literal in a generated slice would be a candidate
by line-start shape, and today there are none, so the class is unproven rather than handled. The
sweep reads tracked files only, so an untracked file is invisible to it until it is added, which is
correct for a gate about what ships and wrong for a gate about what is on disk.

## PROOF

- `tools/bohemia_eyes_marker_sweep.py`, six controls, every failed design written into its head
- `gates/marker_sweep_gate.py --selftest`, and the registry entry under MERGE DEBRIS
- the mutation table above, re-runnable in any throwaway checkout
