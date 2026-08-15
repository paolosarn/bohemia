# BOHEMIA ADDENDUM — THE WALKED SURFACE IS THE GAME (8/14/26, FACTIONS lane, LOCKED)

## WHAT HAPPENED, AND IT IS MINE

The coordinator ruled on 8/14 (`BOHEMIA_BACKLOG.md` banner,
`records/BOHEMIA_DEMO_STATUS_BOARD_8_14_26.md`):

> **THE CITY WORLD IS THE WALKED SURFACE; `slices/BOHEMIA_RUN_CURRENT.html` IS
> LEGACY.** ... The run slice is preloaded on every visit and **NEVER DISPLAYED**.
> **NO LANE SHIPS NEW PLAYER-FACING WIRING INTO THE RUN SLICE.**

I verified it myself before acting on it, because a document is not a measurement:
open the real alpha, tap RUN, and `p-run` computes to `display:none` while `p-city`
is `block` and `#runFrame.offsetParent` is `null`.

**By then this lane had spent four turns wiring player-facing work into the run
slice:**

| shipped | what |
|---|---|
| 8/12 | the sixteen introductions on the person card |
| 8/12 | who knows who, and the vouch that names your introducer |
| 8/12 | what a faction wants from you, what it holds, how far in you are |
| 8/14 | the peripheral act and its preconditions |

All of it real. All of it gated. **None of it on the surface he plays.** The judge
pages in the LIFE tab saved half of it — he can look at all four — but the in-game
half has been dark since the day it shipped.

That is the **authored-but-unread disease**, committed by the lane that wrote the
gate against it (`gates/authored_unread_gate.py`, this lane, 8/9).

## THE DEEPER FAILURE IS THE RECORD, NOT THE CODE

`gates/integration_gate.js` let three rows say **INTEGRATED** while probing a file
nobody sees. And the ledger's own header **had warned about exactly this since
8/4**:

> "Every probe below reads `slices/BOHEMIA_RUN_CURRENT.html`. **The RUN tab does
> not display that file.** ... the greens below are not evidence about the surface
> he plays, and no reader can tell which ones are."

I read that header. I wrote three rows under it anyway. **A green claim about a
dark surface is the false green this repo ranks worse than a false red**, and the
warning being present did not stop it, because a warning is not a gate.

## THE LAW

**1. PLAYER-FACING WORK GOES WHERE HE LOOKS.** Not where the code is easiest to
write, not where this lane's other work already lives. The walked surface is a
FACT ABOUT THE BUILD, and it gets measured, not assumed — if the build flips back,
the gate flips with it and the lane is told instead of guessing.

**2. A ROW MUST NAME ITS SURFACE.** "INTEGRATED" is not a claim until it says
integrated *where*. The three rows now say ON THE WALKED SURFACE, and say plainly
that they were true about a dark file for two days.

**3. ONE ANSWER, NOT TWO.** The city could have derived its own faction bases from
its own overmap, and then the Cartel would live in two different places depending
on which surface you were standing on. That is the two-systems-disagreeing bug this
lane has now fixed four times. So the bases are produced by **the loop's own
placement rule**, baked at patch time, **gated byte-identical** against it, and
keyed to the seed text they were produced for — a different world gets `null`
rather than a confidently wrong answer.

**4. THE MIGRATION IS NOT A COPY-PASTE, AND SAYING SO IS THE POINT.** The city's
people are **shims**: `ctAgent()` fabricates `H<n>-1` (everybody alone in their own
house) and `job:{kind:'scav'}` (everybody a lone scavenger), and there was no
faction anywhere in the file. Ported naively, all three organs would sit inert —
no faction means every introduction falls to DEFAULT, no household or job site
means the tie graph is empty, no outfit means there is no bargain. **The one fact
that unlocks all three is who this person runs with**, and supplying it was the
whole job.

## WHAT IS STILL THIN ON THAT SURFACE, NAMED SO NOBODY CLAIMS IT

The tie graph is ported and live, but the city's people still have **no real
household and no real job site** — its agent shim gives each of them their own
house and makes them all lone scavengers. So two of Feld's three foci are empty
there, and the vouch will only ever fire through the faction focus until the
walked surface's people get the same household and job data the run's roster has.
That is a WORLD-lane shape, not something to fake from here, and it is stated
rather than papered over.

## THE MACHINE

`gates/walked_surface_gate.js`, 23 claims:

- **A** — which surface he sees is **measured in a real browser**, not read off a
  document.
- **B** — the three organs are inlined *with the ENGINE SYNC banner* so they cannot
  drift behind canon; the city resolves allegiance; the card is rewritten from the
  organ rather than printed beside it; and the baked bases are **byte-identical**
  to the loop's.
- **C** — the **real city, in a real browser**: a Church member's card carries his
  canon verbatim, the not-on-their-ground precondition holds and points the way, an
  outfit that wants what you know can be acted on, and doing it moves the rung.
- **D** — the ledger rows **name their surface**.
