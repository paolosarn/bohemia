# THE GATES COULD NOT SEE THE CITY — 8/4/26, PEOPLE lane

## READ THIS FIRST: TWO SESSIONS FIXED THIS THE SAME DAY, AND THEIRS WON

I built `gates/bohemia_city_src.js` for this. So did the WORLD lane, as
`gates/bohemia_city_app.js`, in the same hours. **Theirs landed on main first, so
theirs is the one** — I deleted mine and moved my one surviving check onto it.

A second resolver for the same fact would be exactly the thing both of them exist
to stop. That is not a close call and there is nothing to argue about: the
incumbent wins, ENGINE SYNC LAW says one canonical body, and whose name is on it
does not matter.

**What survives from this session is one finding the reds-driven sweep could not
have caught**, and it is in Part 2. Parts 1 and 3 are kept because the *reasoning*
outlived the code.

---

## PART 1 — WHAT BROKE (both sessions found this independently)

Until 8/4 the walked world was a base64 constant inside the alpha:

    const CITY_B64='PCFET0NUWVBFIGh0bWw+...'      35.76 MB, on one line

It was extracted to `slices/BOHEMIA_CITY_WORLD.html` so the alpha opens **29x
faster**. Right call, nobody undo it. But **twenty-one gates read the city by
hunting that constant**, each with its own hand-rolled extractor copied from the
last one, and nineteen broke at once.

### Why that is worse than a red suite

"Green or it does not ship" is the law every lane works under. When a third of the
suite is red for a reason that has nothing to do with anybody's code, **red stops
meaning anything** — and the next real breakage arrives in a suite nobody is
reading.

And it was not only noise. A broken extractor **skips everything downstream**:

> **CITY TAB went from 14 claims to 64.** The failed extraction was silently
> stepping over **fifty checks** — the canon overmap being married in, the street
> fixes, the island prune — none of them running, none reported missing.

---

## PART 2 — THE ONE THAT NEVER WENT RED, AND IS STILL BROKEN ON MAIN

`touch_guard_gate` looped the three embedded frames and did:

    if (src.indexOf(k) < 0) continue;

The city key stopped existing, so **the biggest frame in the game quietly stopped
being checked** — no failure, no claim, a **GREEN** gate.

**This is why it survived a twenty-one-gate sweep.** A sweep driven by what is red
cannot see a gate that responds to a missing input by going quiet. Verified
directly: `origin/main` at `1ceb61c` still carries that `continue`.

That gate exists because Paolo could not walk — holding the d-pad raised iOS's
copy/paste magnifier instead of moving him. **A gate that skips is worse than a
gate that fails**, because it reports success. A missing payload is a FAILURE now,
for all three frames.

---

## PART 3 — A GATE MUST NEVER OUTRANK A RULING

`city_tab_gate` claimed *"CITY_B64 payload present in the alpha"* and *"the CITY
tab boots the iso view (CITY_B64 srcdoc)"*. Both **false by design** — it was
defending an architecture that had been deliberately replaced.

What those checks exist to protect is that **the real iso city still exists and is
still reached**, not where its bytes happen to sit. (Main's version says this too;
we reached the same conclusion separately, which is some evidence it is the right
one.)

---

## AND THE PART THAT WAS ALWAYS SOMEBODY ELSE'S

**Sixty tools in `tools/` also reached for `CITY_B64` and crashed.** Rewriting
another lane's whole toolchain blind — where a tool that half-works is worse than
one that crashes loudly — is not a thing to do at speed on somebody else's system.
The WORLD lane's resolver has a Python twin for exactly this. Backlog: P-N.
