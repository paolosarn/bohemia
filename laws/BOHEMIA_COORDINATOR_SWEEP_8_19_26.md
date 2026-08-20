# BOHEMIA — THE SUITE IS THE PRODUCT NOW (Paolo 8/19/26, LOCKED,
# direction-class: "the whole gate suite is broken and nobody owns it...
# do NOT cut gates... one session on the suite itself... then find owners
# for the 8 reds.")

## 0. THE RULING, IN ONE LINE
A SUITE THAT CANNOT FINISH IS NOT A SUITE, IT IS A RUMOUR. And the fix is
not fewer checks — it is a suite that runs fast enough to finish.

## 1. THE NUMBERS, MEASURED INDEPENDENTLY THIS TURN
He supplied figures; I measured the tree rather than transcribing them,
per the coordinator's own 8/15 rule about never relaying a number I did
not check. HIS FIGURES ARE RIGHT IN SHAPE AND SLIGHTLY CONSERVATIVE — the
problem is a little worse than he said.
| WHAT | HIS FIGURE | MEASURED HERE |
|---|---|---|
| registered gate rows | 376 | **379** (the lane that hit the wall counted 382; the table moves daily) |
| gates that launch a browser | 115 | **123** |
| of those, gates that BOOT THE FULL ALPHA | 88 | **94** |
| hardcoded sleep time across the suite | 19.7 min / 108 gates | **22.7 min / 120 files** |
| how far the suite gets | 217, killed at 50 min | confirmed by the lane that found it (commit 5bd10a40) |
So: ninety-four separate boots of a 3.8 MB page, plus nearly twenty-three
minutes of the suite doing NOTHING ON PURPOSE, inside a fifty-minute
budget. The arithmetic never had a chance.

## 2. WHY THIS IS THE MOST DANGEROUS BUG IN THE REPO
Our most-cited law is A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED, and
the suite is what makes that law real. When the suite dies at 217 of 379:
- every lane ships on a PARTIAL run and cannot tell which part it missed;
- **165 unrun gates are SILENT, and silence reads exactly like green**;
- the lane that discovered it had to invent its own coverage by running
  its gates by hand, which is not a process, it is a workaround.
THIS IS THE FIFTH INSTANCE THIS MONTH of the same family — the machine
saying fine when it is not. Sweep 9 (a gate verifying a hidden surface),
sweep 12 (a migration chain wired to nothing), sweep 13 (gates that test
pieces and never the journey), sweep 14 (a ballot that grew while its
yield halved), and now a suite that reports success by not finishing.
The pattern is not carelessness. It is that WE INSTRUMENT WHAT WE BUILT
AND NOT WHAT ACTUALLY RUNS.

## 3. DO NOT CUT GATES — HIS RULING, AND THE EVIDENCE IS ON HIS SIDE
"376 is nothing." He is right, and the comparison he reached for is the
correct one: large studios run test suites an order of magnitude bigger
than ours in a fraction of the time, and they catch a meaningful share of
their blocker bugs that way. The constraint that matters is WALL CLOCK
PER CHECK, not check count. Ours is catastrophically bad per check, and
that is an engineering problem with known fixes, not a reason to delete
coverage. Deleting gates to make the suite finish would trade the only
thing keeping nine parallel lanes honest for a green light that means
less than the red one did.

## 4. THE THREE FIXES, IN THE ORDER THAT PAYS FASTEST
**FIX 1 — KILL THE FIXED SLEEPS. 22.7 MINUTES, MOSTLY MECHANICAL.**
120 files call `waitForTimeout` / `time.sleep` with a constant. Every one
of them is a guess about how long something takes, and the guess is
always tuned upward until it stops flaking, so it is always far longer
than the real wait. REPLACE WITH CONDITIONS: `waitForFunction`,
`waitForSelector`, and polling for the state the check actually needs.
The dayloop gate already models this correctly ("POLL, do not guess.
Measured 8/11: the city frame's script does not execute immediately") —
copy that lane's pattern rather than inventing one. THIS IS THE BIGGEST
SINGLE WIN AND THE LEAST RISKY: it changes no assertion.
**FIX 2 — ONE BROWSER, NOT NINETY-FOUR.**
94 gates each launch chromium and boot a 3.8 MB alpha before their first
assertion. Boot once, keep the browser and a warm page alive, and hand
each gate an isolated CONTEXT (or a fresh tab against the warm process)
instead of a cold process. Gates that genuinely need a virgin profile
declare it and pay for it; everything else shares. Nothing about what a
gate asserts changes — only how it gets a page.
**FIX 3 — THE FAST LANE, AND IT IS ALREADY TWO THIRDS BUILT.**
He asked for a browserless tier any lane can run in under a minute before
shipping. THE MEASUREMENT SAYS IT BARELY NEEDS BUILDING: 379 registered
gates minus 123 browser gates leaves roughly **256 gates that never touch
a browser at all**. The fast lane is a FILTER over what exists, not new
work — tag every gate BROWSER or PURE, and `bohemia_gates.py --fast`
runs the pure set. That is the pre-ship check for every lane, every turn.
The full suite then becomes the thing you run once before a ship, and it
will actually finish once fixes 1 and 2 land.

## 5. NOBODY OWNED THE SUITE — NOW RUN DOES
This is the root cause of everything above, and it is the coordinator's
call to make. The suite is not a lane's system, so under ONE SYSTEM ONE
SESSION it belongs to nobody, and a thing that belongs to nobody rots
exactly this way — the same dropped-stitch pattern as the ownerless crowd
gate and the vista with no caller.
**AMENDED THE SAME DAY BY PAOLO: "I'll just do it in the run then."**
The GATES lane existed for about an hour and is FOLDED INTO RUN. He did
not want to carry another chat, and he is right that the cost of a lane
is remembering it exists.
**THE SUITE IS RUN'S, under RUN P0-SUITE.** It fits that lane's charter
without stretching it: RUN INTEGRATES WHAT THE FLEET BUILT, and the suite
is the fleet's only shared instrument. RUN owns bohemia_gates.py, the
harness, the runner and the fast lane; it does NOT own individual gates'
assertions, which stay with the lane whose law they enforce.
THE ORIGINAL POINT STILL STANDS AND IS WHY THIS IS WRITTEN DOWN: the
suite rotted because it belonged to NOBODY. Ownership was the fix, not
the lane. A named owner was the requirement; a new chat was only one way
to get one, and it was the more expensive way.
ORDER: the SLEEP FIX goes first — mechanical, zero assertions changed,
most of the clock back in one sitting — then RUN's demo P0s resume, and
fixes 2 and 3 land whenever this lane next needs them.

## 6. THE EIGHT REDS NOW HAVE OWNERS
Assigned by EVIDENCE — what each gate actually reads — not by guess.
| GATE | WHAT IT READS / TESTS | OWNER |
|---|---|---|
| DISTRICT FILL | `engine/bohemia_district_kit.js`, `bohemia_world.js` | **WORLD** |
| ROAD CELLS (`roadcell_gate.js`) | road cells | **WORLD** |
| TRAFFIC SIGNAL | the alpha's intersections/signals (WORLD's street work) | **WORLD** |
| VOTE TAB | its own header says "(8/7/26, **WORLD lane**)" | **WORLD** (self-declared) |
| LOOK | alpha + city world + `BOHEMIA_LOOK_CURRENT.html` — the LOOK tab | **ART** |
| DRESS | `bohemia_dress.js` + `bohemia_agents.js` — canon wardrobe on bodies | **CHARACTER** |
| SFX RENDER | real audio in a real browser | **SOUNDS** |
| RUN BEAT | "the run is on the SONG'S clock" | **SOUNDS** owns the clock, **RUN** co-signs the consumer |
**AND THE OWNERS ARE NOT BEING BLAMED.** The lane that found these proved
by experiment that with its own files reverted to origin/main, TRAFFIC
SIGNAL, LOOK and VOTE TAB fail with IDENTICAL counts (2, 1, 1). These are
STANDING reds on main that predate the turn that noticed them. Owning one
means diagnosing it, not apologising for it.
RULE ATTACHED: a red gate with an owner gets fixed or gets a written line
saying why it is legitimately red. A red gate with NO owner is what we
just spent a month proving is invisible.

## 7. WHAT DOES NOT CHANGE
- No gate is deleted, disabled or weakened to make the clock. If a gate
  is genuinely wrong it is fixed on its own merits, by its owner, with a
  reason written down — never to make a number go green (the GOODHART
  GUARD, SHARED -7).
- Assertions are untouched by fixes 1 and 2. Those fixes change WHEN and
  WHERE a gate runs, never WHAT it claims.
- The JOURNEY RULE (SHARED -7) still stands and gets easier: once the
  suite finishes, an end-to-end test is affordable again.
