# THE GATES COULD NOT SEE THE CITY — 8/4/26, PEOPLE lane

Not my lane. Fleet-critical, so I fixed it.

---

## WHAT HAPPENED

Until 8/4 the walked world was a base64 constant inside the alpha:

    const CITY_B64='PCFET0NUWVBFIGh0bWw+...'      35.76 MB, on one line

The CITY lane extracted it to `slices/BOHEMIA_CITY_WORLD.html` so the alpha opens
**29x faster**. That is plainly the right call and nobody should undo it.

But **twenty-one gates read the city by hunting for that constant**, each with its
own hand-rolled extractor copied from the last one. Two were migrated with the
move. **Nineteen were not**, and they all broke at once.

## WHY THAT IS WORSE THAN A RED SUITE

"Green or it does not ship" is the law every lane works under. When a third of
the suite is red for a reason that has nothing to do with anybody's code, **red
stops meaning anything** — and the next real breakage arrives in a suite nobody
is reading.

And it was not only noise. A broken extractor does not just fail its own claim,
it **skips everything downstream**:

> **CITY TAB went from 14 claims to 64.** The failed extraction was silently
> stepping over **fifty checks** — the canon overmap being married in, the street
> fixes, the island prune — none of them running, none of them reported missing.

That is the same shape as the bug I found in my own lane yesterday: a gate that
is green (or red) about the wrong door tells you nothing about the right one.

### The worst one did not even go red

`touch_guard_gate` looped over the three embedded frames and did
`if (src.indexOf(k) < 0) continue;`. The city key stopped existing, so the
biggest frame in the game **quietly stopped being checked** — no failure, no
claim, a GREEN gate. This is the gate that exists because Paolo could not walk:
holding the d-pad raised iOS's copy/paste magnifier instead of moving him. **A
gate that skips is worse than a gate that fails.** A missing payload is a
FAILURE now, for all three frames.

---

## THE FIX

**One answer to "where is the city", and every gate asks it.**
`gates/bohemia_city_src.js` and its Python twin `gates/bohemia_city_src.py`.

It prefers the standalone file and falls back to the old inline constant, so it
works on a fresh checkout of main *and* on any older tree. The next time the
world moves — and this is already its second home — that is **one edit** instead
of nineteen archaeological digs.

Two things had to change per gate, and both were mechanical:

1. **Reading it.** Replace the bespoke extractor with `citySrc(alpha)`.
2. **Booting it.** Thirteen browser gates found the city frame by
   `/srcdoc/.test(fr.url())`, because the city used to be decoded into `srcdoc`.
   It is a real page now, so the frame URL is a filename.

### And one gate was asserting the old world

`city_tab_gate` claimed *"CITY_B64 payload present in the alpha"* and *"the CITY
tab boots the iso view (CITY_B64 srcdoc)"*. Both are **false by design now**. The
gate was defending an architecture that had been deliberately replaced.

A GATE MUST NEVER OUTRANK A RULING. What those checks exist to protect is that
**the real iso city still exists and is still reached** — not where its bytes
happen to sit. Rewritten to say that.

---

## RESULT

| | |
|---|---|
| city gates repaired | **19 of 21** |
| CITY TAB | 14 claims -> **64** |
| still red, for their own real reasons | ICON, INTERIORS, WALLCLASS |
| **GRAVEYARD** | red again — and now for a **true** reason it could not see before |

**GRAVEYARD is the one to look at.** With the gate able to run, it reports
`HAIR AFRO is dead. 8/1/26 — 1 LIVE REFERENCE`. Dead things staying dead is one
of the oldest laws in this repo, and it was quietly unenforced while the gate
could not read the world. That is the CHARACTER lane's to resolve; it is named
here so it is not lost.

ICON, INTERIORS and WALLCLASS were each verified red on clean `origin/main`
before any of my work, and they fail on their own content now rather than on a
missing blob.

---

## WHAT I DID NOT DO, AND WHY

**Sixty tools in `tools/` also reach for `CITY_B64` and crash.** The entire city
patch toolchain cannot re-apply anything right now.

Thirty-one of them share one exact shape; the rest vary. Rewriting another
lane's whole toolchain blind — where a tool that half-works is worse than one
that crashes loudly — is not a thing to do at speed on somebody else's system.

So I migrated **one as the worked example**,
`tools/bohemia_city_zoombuild_patch.py`, because a gate depended on it. Its
header now carries the recipe verbatim, and it is the same three edits every
time:

1. read `CITY` (the standalone file) instead of hunting `CITY_B64` in `ALPHA`
2. write `CITY` back at the end instead of re-encoding into `ALPHA`
3. change nothing else — the patch body is untouched

`gates/bohemia_city_src.py` is there for anyone who wants the
fallback-to-old-trees behaviour as well. **The other 59 are an afternoon of
mechanical work for whoever owns them, and they are named in the backlog.**
