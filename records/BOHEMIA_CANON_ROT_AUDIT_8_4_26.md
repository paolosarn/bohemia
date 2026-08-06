# BOHEMIA — THE FIRST CANON ROT AUDIT (8/4/26)

> "honestly im lazy today Think outside the box WE HAVE 11 months of forward motion work
> we need to complete Do what you have to do next"
> — Paolo, 8/4/26

Nothing here needs a verdict. This is the unglamorous work that nobody asks for.

---

## THE PROBLEM NOBODY OWNED

**Nine sessions write canon in parallel.** There are **338 law files** and **245 record
files** and they cite each other constantly — `laws/...md`, `records/...md`,
`gates/...js`, `engine/...js`. **Nothing has ever checked that those citations resolve.**

A law pointing at a file that does not exist is worse than a law with no citation at all,
because a session follows the path, finds nothing, and concludes the thing was never
built. Over eleven months that is how a project this size rots from the inside.

I have found four real canon contradictions by hand in the last week and written a
bespoke gate for each one. **That is the wrong shape.** FACTORY LAW: stop hand-finding
them and build the thing that finds them.

## ★★ THE FIRST RUN OF THIS AUDIT WAS WRONG, AND IT WAS MY BUG

Before any finding, the failure, because it is the most useful thing in this document.

My citation regex was:

```
/(?:laws|records|gates|...)\/[A-Za-z0-9_\/.]+\.(?:md|txt|js|py|json|html)/
```

**Regex alternation is FIRST-MATCH, not longest-match.** `js` is tried before `json` ever
gets a turn, so **every real `.json` path in the repo was captured as a `.js` path** — and
therefore reported as a broken citation, because `...MASTER_PALETTE.js` does not exist.

The audit reported **43 broken citations. Forty-two of them were phantoms of my own
making.** Then my fixer "repaired" 40 already-correct paths into `.jsonon` — including the
master palette in two live laws.

**Reverted before commit. Nothing shipped, nothing pushed, 40 files restored, tree
verified clean.** I caught it because the fixer's own output looked wrong: both `.js` and
`.json` showed up once each in a file that should have had one path.

**THE FIX IS NOW A PERMANENT SELF-TEST.** `gates/canon_rot_gate.js` check A1-A4 proves its
own regex captures a `.json` path whole before it is allowed to judge anybody's files —
and A4 is a **negative control** that runs the OLD broken pattern and asserts it fails, so
if a later session "simplifies" the alternation back, the gate goes red instead of
silently lying.

This repo has shipped nine bugs of the form *a checker that cannot tell a thing from a
lookalike*. **This is the first one where the CHECKER'S OWN PATTERN was the lookalike**,
and it is the most dangerous version, because a broken checker that also has a fixer
attached does damage instead of just missing things.

## WHAT THE AUDIT ACTUALLY FOUND, ONCE THE RULER WAS FIXED

**583 canon documents swept.**

### 1. ONE real extension drift — FIXED

`laws/BOHEMIA_ADDENDUM_EVERY_PIXEL_ANSWERED_7_31_26.md` cited
`gates/answered_for_gate.py`. The gate is `gates/answered_for_gate.js`. One character, and
it meant the law pointed at nothing. Corrected.

That is the whole of category A. **Not 43. One.**

### 2. ★ SIX citations of an ARCHIVED file, and one of them is REAL ROT — FLAGGED, NOT FIXED

Six documents cite files that live in `/archive` without saying near the citation that they
are superseded. My first pass checked for that language **anywhere in the file** and called
all of them clean. **That was too coarse** — a document can discuss being superseded in one
paragraph and cite something as live in another, and a file-wide grep calls that fine. Scoped
to the citation, six fail.

**THE ONE THAT MATTERS.** `laws/BOHEMIA_PAOLO_TASTE_CANON.md:93` lists as a live **LIKE**:

> "every generator reads only the part-id grid so the whole wardrobe carries to the woman rig"
> (src: `laws/BOHEMIA_ADDENDUM_WOMAN_RIG_7_21_26.md`)

**The woman rig was KILLED on 7/25** — Paolo: *"remove the whole female rig... this two-rig,
male and female shit you're doing is really bad."* The addendum is in `/archive`, superseded
by `ONE_RIG_VARIATIONS`. So a live taste-canon preference is sourced to a dead premise, and
"carries to the woman rig" describes a thing that no longer exists.

**I DID NOT FIX IT.** Whether that preference survives the one-rig ruling — reworded to the
variation sliders, or dropped — is a **canon-level** question about his taste, not a path I
can retype. CLAUDE.md's rule is exact: *fix it if mechanical, flag it [PENDING Paolo] if
canon-level.* **[PENDING Paolo / the CHARACTER lane.]**

The other five are lower-stakes references in coordinator notes and clothing records. All six
are **printed by the gate on every single run** so they cannot be buried, and ratcheted so the
count cannot grow.

### 2b. The seven I originally called clean — and why that was wrong

Six documents cite `laws/BOHEMIA_ADDENDUM_WOMAN_RIG_7_21_26.md`, which lives in
`/archive` (superseded 7/25 by `ONE_RIG_VARIATIONS`, after Paolo killed the separate
female rig). One cites the retired `tools/bohemia_combat_lab_gen.py`.

My first check looked for superseded language **anywhere in the file**, which passed all
seven. Tightening the scope to the citation's own vicinity dropped that to one clean and six
flagged. **A file-level grep for a per-item property is the same mistake three other gates in
this repo have already shipped**, and it produced a wrong "all clear" in the first draft of
this very document. Corrected above.

### 3. EIGHTY truly-gone citations — RATCHETED, and not this lane's to guess at

Eighty citations across six lanes' documents point at files that genuinely no longer
exist: June and July tools (`tools/basebody.py`, `tools/portrait.py`,
`tools/dead_eye_arms.py`), killed lab surfaces (the Zomboid house, the darkroom scavenge,
my own crash lab), and a superseded `gates/woman_rig_gate.js`.

**Most of these are legitimate tombstones** — a record saying "this was killed, here is
the post-mortem" *should* name the dead file. Some are just stale. **I cannot tell which
from outside the owning lane, and guessing would either red-gate five other lanes for
somebody else's debt or quietly delete their record of what died.**

So the gate **ratchets** instead: the count may fall, never rise. **No new rot, and no
lane blocked by another's.** Any lane cleaning its own up should lower `CEILING` in the
gate to lock the win in.

## WHAT THIS BUYS OVER ELEVEN MONTHS

Every future law, record and dossier gets its citations checked the moment it lands. The
specific failure this prevents is the one that already cost real work this week: **a
session cannot follow a citation into nothing and conclude a thing was never built.**

And it closes a hole in the truth hierarchy. CLAUDE.md says a contradiction between two
live files is a bug to fix if mechanical — but until now "if mechanical" depended on
somebody noticing. Now the mechanical half runs every build.

## WHAT IS STILL HIS, AND WHAT IS STILL OPEN

- **Nothing needs a verdict here.** No canon was decided, no content written, no pixel
  touched.
- **The 80 truly-gone belong to their lanes.** Listed in the gate's own output on every
  run so they are visible rather than buried.
- **The harder half is not built:** SEMANTIC contradictions, where two live files state
  different values for the same canon quantity. This audit only proves citations RESOLVE,
  not that they AGREE. That is the next machine, and it is a bigger one.

## GATE

`gates/canon_rot_gate.js`, registered as CANON ROT. Its first four checks test the gate
itself, because a ruler that has already been wrong once should have to prove it is
straight before it measures anything.
