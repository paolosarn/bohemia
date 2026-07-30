# BOHEMIA ADDENDUM — THE ALPHA MUST LOAD, AND IT IS CHECKED EVERY PUSH
# (7/30/26, LOCKED)

Paolo 7/29: "make those fixes then make those fixes forever please."

He said that about canvas scaling. This addendum is about the ship that carried
that fix, which reached main **completely dead**, and about the fact that the
"forever" half of his instruction applies to the process too, not just to the
pixels.

## WHAT SHIPPED

The ONE alpha went to main with the entire game script failing to parse:

    PAGEERROR: Unexpected token '<'
    BAKED defined: false   drawChar defined: false

Black screen. Every tab, every system. Not a character-lane regression — the
whole game, for as long as it sat on the live site.

## WHAT ACTUALLY HAPPENED

The ship rebased onto a main that had moved **161 commits**. The conflict
resolution in `slices/BOHEMIA_ALPHA_0_9.html` deleted three of the largest
embedded blocks in the file:

    const RIG_B64        127,857 chars   the embedded rig tool
    const COMBAT_B64   1,109,816 chars   the embedded combat slice
    const BAKED           30,339 chars   PAOLO'S PAINTED RIG PACKAGE

and dropped a stray `<div id="buildstamp">` into the `<script>` body where they
used to be. Raw HTML inside JavaScript is a syntax error, so nothing after it
ran.

`BAKED` is Paolo's hand-painted art and his hand-posed skeleton. It is the most
sacred asset in the repo — RIG LAW exists specifically to say his painted
regions are sacrosanct — and **a merge ate it.** Not a bad edit, not a bad
tool: a merge, silently, while the diff looked plausible.

## THE PROCESS FAILURE, NAMED

The full suite HAD run green. **Before the rebase.**

ONE GATE PASS PER SHIP (CLAUDE.md) is explicit that the second run earns its
keep exactly when main has moved: *"it is verifying a real merge, not
re-verifying your own unchanged tree."* Main moved 161 commits and the suite
was not re-run, because the earlier green still felt like it counted.

It did not. **A green from before a rebase describes a tree that no longer
exists.** The gates were never wrong; they were never asked.

The 7/29 conflict-marker incident produced a `grep -q "^<<<<<<< "` pre-push
guard. That guard passed here — cleanly, truthfully — because this merge left
no markers. It deleted a megabyte instead. A guard that checks one signature of
a bad merge says nothing about the others.

## THE LAW

1. **The alpha must LOAD before any push.** Not "should parse", not "the diff
   looks right" — loaded in a browser, zero page errors, globals present.
2. **A pre-rebase green does not transfer.** If main moved, the tree you are
   pushing is a tree no gate has ever seen.
3. **The guard has to be cheap enough that skipping it is never tempting.**
   The full suite is ~340s, and that is precisely why it got skipped under time
   pressure. `alpha_loads_gate.js` is one page load. **A guard you skip is not a
   guard**, so the cheapness IS the design, not a compromise on it.

## THE GATE

`gates/alpha_loads_gate.js`, wired into `gates/bohemia_gates.py`. It checks the
failure mode directly rather than a proxy for it:

- the page raises **zero** errors, and `BAKED` / `drawChar` / `MUS` actually
  exist at runtime, with `BAKED.pose` still carrying all 8 facings
- the three embedded blocks are present **and still their real size** — a
  truncated `BAKED` is a silent art loss that never throws
- exactly **one** `buildstamp` div, and no HTML tag loose in a script body
  (that is the signature of a merge dropping markup where code belongs)
- no conflict markers, keeping the 7/29 regression dead

Per VERIFY ON THE REAL SURFACE (7/18) it loads the actual file in Chromium, and
per the 7/27 outline post-mortem it binds `pageerror` **first**, before waiting
on anything — a load-time hang is a page error until proven otherwise.

## THE RESTORE

The three blocks were spliced back verbatim from `6a37174`, the parent of the
bad commit, with an assertion on each block's identity before writing. Paolo's
`BAKED` is byte-identical to what he painted. The canvas-scale work that the
bad ship was carrying survived and was re-applied on top: all 13 character
surfaces land on exact whole-number scales again.

## THE PATTERN

Twice now — 7/29 markers, 7/30 deletion — a rebase under time pressure has put
something on main that no gate had looked at. Both times the tell was the same:
**verifying after pushing instead of before.** The fix is not more care. It is
a check cheap enough to always run, that looks at the thing itself rather than
at a signature of one way it can go wrong.
