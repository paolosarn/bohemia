# A LAW WITH AN IMAGINARY GATE IS WORSE THAN A LAW WITH NO GATE (9/11/26)

PLUMBER lane, VAMILY row [gate missing] THE-COMPARE-LAW-HAS-NO-CHECKER.

## WHAT THE ROW SAID, AND WHAT WAS ACTUALLY TRUE

The row: reference_check_gate does not exist, no .js, no .py, never run, while
CLAUDE.md advertised it as the gate for COMPARE EVERY PIECE OF ART TO THE WORLD
(Paolo 9/4, LOCKED). Build it.

**DIRECTION HAD ALREADY BUILT IT.** Commit 7f59b0e, "the reference check gate
exists at last - EYES' bounce-back closed". The board line still read OPEN, and I
read the line instead of the folder, and wrote a second one.

I got most of the way through a 245-line gate before the suite told me: running it
by name printed **two** rows. Mine at 339 and theirs at 525, same name, same file
path. I had overwritten their file on disk.

Theirs is restored untouched, mine is deleted, and there is one row again. What
follows is what this round actually contributed, which is smaller than what it set
out to do and is honest about why.

## THE LESSON, BECAUSE IT IS THE MOST USEFUL THING HERE

**A BOARD LINE IS A CLAIM ABOUT THE WORLD, NOT THE WORLD.** Rule 5 says take the
first OPEN line. It does not say the line is current. The check that costs ten
seconds and would have saved this whole detour:

```
  ls gates/ | grep reference          ->  reference_check_gate.py
  git log -1 -- gates/reference_check_gate.py
```

I have now shipped two gates in two rounds about exactly this class of defect --
a registry that drifts from the folder, a law index that names a file nobody wrote
-- and then walked into the same shape from the other side. The folder is the
truth. Ask the folder first.

## WHAT DIRECTION'S GATE DOES, SO NOBODY REBUILDS IT EITHER

It holds three things and it reached them independently: the reference index
parses and is real; every REF-ID cited inside a tool's REFERENCE CHECK block
resolves in that index (the "lie" clause 3 names); and a one-way ratchet over a
frozen pre-law baseline of 84 tools, where a new cook without a check is red the
turn it lands and a baseline tool that gains one leaves the list forever.

That is the same design I had arrived at separately, including the ratchet. Two
lanes converging on it is a decent sign it is the right shape for retrofitting a
law onto a codebase that has never once complied with it.

## THE ONE REAL GAP IN IT, MEASURED AND HANDED OVER

```
  REUSE-FIRST sweeps          170 tools   (86 cooks/factories + 84 drawing patch tools)
  REFERENCE CHECK sweeps       92 tools   (cooks and factories only)
  OUTSIDE THE ART LAW          84 tools   that draw
```

That is the exact hole REUSE-FIRST closed on 7/26, when Paolo said "you're not
using a single one of them": a patch tool had shipped floors and walls as flat hex
fills while 9,127 judged tiles sat unused in the same file. A `*_patch.py` that
injects `drawImage` paints as many pixels as a cook and answers to the compare law
the same way.

The logic is already written and tested in reusefirst_gate.py, including the 8/20
refinement that strips the docstring first so a tool that only MENTIONS
`putImageData` in prose is not swept. Widening the sweep adds tools to DIRECTION's
frozen baseline, which is their list and their call. One line is on their row. I
did not touch their gate.

## WHAT THIS ROUND DID BUILD: THE OTHER HALF, AND IT IS NOT ABOUT ART

The art gate was the symptom. **THE DEFECT WAS IN THE INDEX.** CLAUDE.md told every
chat that a LOCKED law was machine-enforced, and nothing ran, for three days. The
pillar law says "A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED" (7/16), and there is
a hole underneath it:

> A LAW WITH AN IMAGINARY GATE IS WORSE THAN A LAW WITH NO GATE, BECAUSE THE FIRST
> ONE STOPS ANYBODY LOOKING.

`gates/law_index_gate.py` closes it. Every `| gate <name>` in CLAUDE.md must
resolve to a file on disk AND be registered in the suite. Existing is not enough:
9/7 proved a gate can exist, pass by hand, and never be executed. First run: 23
advertised, 23 on disk, 23 run.

It pairs with last round's gate registry, and between them a claim of enforcement
has to be true in both directions:

```
  gate_registry_gate.js   a gate FILE the suite cannot see   -> red
  law_index_gate.py       a gate NAME nothing backs          -> red
```

Both teeth were proven to bite with throwaway files before it shipped, because a
gate that has never been shown to fail is decoration.

## AND ONE VIOLATION OF MY OWN, FOUND AND FIXED

REUSE-FIRST is RED on main with four failures, and one of them was **mine**:
`bohemia_fight_floor_cache_patch.py`, which I shipped on 9/6 with no REUSE CHECK
block. It injects `drawImage` as a string literal, which is a real use, so it is
swept and it was failing from the moment it landed.

It now carries both blocks, and the REUSE CHECK says the honest thing: this tool
opens no bank because it authors no pixels -- its output is required by its own
gate to be byte-identical to the picture already there, so an approved asset
cannot "fit better".

The other three belong to COMBAT and one to RUN, named on their rows and not
written by me. A reuse check written by somebody who never opened the banks is
worth nothing.

Taken by: gates/law_index_gate.py (4/0, both teeth proven), gates/reusefirst_gate.py
(now 202 passed / 4 failed, down from 5).
