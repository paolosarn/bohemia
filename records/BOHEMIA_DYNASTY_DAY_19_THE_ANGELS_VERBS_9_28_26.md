# DAY 19 — THE ANGEL'S VERBS, AND THE ROW'S OWN PREMISE IS ALREADY DEAD
DYNASTY lane, VAMILY row `[angel verbs]` Q17. Claimed 9/28 `dynasty-vamily-w4yxiz`.

> **THE ROW, VERBATIM:** "The Angel's verbs, now that we know nothing in the game can be
> forgiven. What forgiveness, restitution and mercy actually LOOK like as actions in real
> reconciliation (what the wronged person needs to happen, in what order, and what makes an
> apology fail), and how the best games have let a player undo harm without erasing it.
> Deliver the verb list PEOPLE [make it right] should build, and what must stay unforgivable."

## 0. THE FINDING THAT PROVES THE ROW WRONG
**PEOPLE already built the thing this row is asking for.** This lane's own Q15 found zero
hits for forgive/settle/absolve/pardon/spare/redeem, published it 9/5, and PEOPLE shipped
`makeRight()` off that finding two rounds later (9/6-9/7, `[make it right]`, since hardened by
`[paid means paid]`). `RIGHT_WORDS` already has four of the shapes real reconciliation
research actually distinguishes: `settled`, `paid`, `forgiven`, `spared`. **The verb list this
row asks me to deliver already exists, is gated, and is on the alpha.** Writing a second one
would be this lane repeating its own Q6/Q7 mistake: measuring the wrong file and reporting
a hole that a different lane already closed. What is left to do is smaller and sharper: check
the shipped mechanism against the real research, and answer the one half of the row PEOPLE's
own comments say out loud they left open — **"whether a forgiven thing still stings"** and
what must never be squarable at all.

## 1. WHAT THE SHIPPED MECHANISM ALREADY GETS RIGHT
`makeRight()`'s own header cites the two strongest, most replicated findings in the
forgiveness literature and both are load-bearing in the code, not decoration:

- **Amends raise forgiveness, severity lowers it.** `wouldSquare()` sums every deed's force
  against you; a heavier wrong needs more good deeds to outweigh it, with no threshold
  anybody hand-picked. That is exactly the shape real studies find: apology and restitution
  are the two strongest predictors of a victim's willingness to forgive, and the offense's
  severity is the strongest predictor working against it.
- **Only the wronged person decides, and only for themselves.** `makeRight` takes ONE mind; a
  witness who only heard about it (hops>0) drops the grudge when the eyewitness squares it,
  but an eyewitness's own grip on it is never settled by somebody else's choice
  (`carryRight`'s asymmetry). That matches the standard distinction between DECISIONAL
  forgiveness (a private choice to stop pursuing revenge, which can happen fast) and
  EMOTIONAL forgiveness (actually stopping feeling the resentment, which is slower and
  requires safety, not just an apology) — the mechanism does not pretend an apology instantly
  fixes feeling, it only unlocks the SUM being allowed to cross zero.
- **Forgiven is not forgotten.** `d.right` marks the deed settled; it does not delete it, and
  `madeRightBy()` can always answer how long ago and by what word. Real reconciliation work
  is explicit that this is the difference between forgiveness and amnesia: the record staying
  is not a bug, it is the honest version.

## 2. WHAT REAL RECONCILIATION ACTUALLY LOOKS LIKE AS AN ORDER OF EVENTS
The row asks what the wronged person needs to happen, in what order, and what makes an
apology fail. The clinical literature on apology (Lazare's five-part structure, widely
replicated since) gives a stable order and the shipped mechanism already matches more of it
than it gets credit for:

    1. ACKNOWLEDGMENT   naming the specific act, not a vague "sorry if"
    2. EXPLANATION       without excusing it away
    3. REMORSE           shown, not just stated
    4. REPARATION        something actually given up
    5. NON-REPETITION    a promise the wronged person can test later

**Failure modes, all real and all currently unrepresented:** an apology that explains but
never acknowledges the specific act reads as an excuse, not an apology, and lowers
forgiveness rather than raising it; an apology offered before the wronged person is ready
(too soon after the offense) is read as pressure, not repair; and an apology with no
reparation when reparation was possible reads as cheap even when the words are correct.
`priceOf()` already prices reparation in batteries weight-for-weight and `makeRight` already
refuses the word "paid" when nothing was paid — steps 1 and 4 are built. **Steps 2, 3 and 5
are not represented anywhere in the mechanism at all**: there is no explanation text, no
remorse signal separate from the apology button itself, and nothing that lets step 5 ever be
TESTED (a promise nobody can break is not a promise).

## 3. THE ONE GAP THAT WAS STILL REAL: THE MECHANISM HAS NO FLOOR
Measured directly in `wouldSquare()`:

    out.would = out.rest > 0 && (out.rest + out.grudge) >= 0;

**That is one sum with no exception in it.** A grudge from a stolen loaf of bread and a
grudge from killing somebody's family member are the same kind of number in the same
equation — heavier, yes, needing more good deeds to outweigh it, but never categorically
different. Real reconciliation research and every legal system that has ever existed disagree
with that on purpose: some harms are treated as a different KIND, not a bigger number of the
same kind. Restorative justice practice (which the row's own "actions in real reconciliation"
points at) draws a hard line between harms that are restorable through a process (theft,
property damage, most interpersonal wrongs) and harms treated as categorically different
(killing, and violations of a relationship's basic trust like betrayal by someone who was
supposed to protect you) — the second kind is not simply "a bigger version" of the first, and
treating it as one is itself the failure mode victims report most often in restorative-justice
studies: being made to feel their harm was just a large number on the same scale as a small
one.

**AND THE RESEARCH ALSO SEPARATES A SECOND THING THE MECHANISM CURRENTLY FUSES: FORGIVING IS
NOT THE SAME VERB AS TRUSTING AGAIN.** A person can genuinely stop carrying a grudge
(forgiveness) while never inviting the offender back into a position to hurt them again
(reconciliation/trust restoration) — these are measured as separable outcomes in the
literature, and the standard finding is that reconciliation requires evidence of real
behaviour change over time, while forgiveness does not. `d.right` currently has one shape:
squared. There is no way in the code today to be forgiven and still not trusted.

## 4. THE VERB LIST, CORRECTED RATHER THAN RE-INVENTED
The row asked me to deliver the verb list PEOPLE should build. They already built four of the
right five. What is missing, named precisely against the shipped code:

- **EXPLAIN / SHOW REMORSE** — not currently distinct from the apology button itself; step 2
  and 3 of the real order have no representation.
- **RECONCILE**, separate from **FORGIVE** — the standing web needs a second bit alongside
  `d.right` for "trusted again," because the research treats them as two different questions
  with two different answers, and today they are one boolean.
- **REFUSE** — the mechanism has no way for the wronged person to say no on purpose and have
  it mean something other than "the sum has not crossed zero yet." A deliberate, standing
  refusal (this one is not for sale, ever) is a real and common outcome in the literature and
  currently indistinguishable from "not enough amends yet."

## 5. WHAT MUST STAY UNFORGIVABLE — THE ROW'S OWN QUESTION, ANSWERED AS A SHAPE NOT A LIST
**Naming which specific deed kinds are permanently unforgivable is canon, and canon is his
(MECHANISM-MINE/CONTENTS-PAOLO'S).** What this round can deliver honestly is the SHAPE the
mechanism is missing, not the list: **a severity floor the sum cannot cross**, so that some
kinds of wrong stay categorically un-squarable no matter how large `out.rest` gets, the same
way real reconciliation research and every restorative-justice practice treat some harms as a
different kind rather than a bigger number. Today `wouldSquare` has exactly one gate
(`out.rest > 0`, something positive must exist at all) and one sum. A floor would be a second,
independent refusal: this kind, this severity, is not eligible for `wouldSquare` regardless of
what else the actor has done since. **[PENDING Paolo]: which deed kinds (if any) should carry
that floor.** This lane does not invent the list; it hands PEOPLE the shape their own
mechanism is missing.

## 6. WHAT REAL LONG GAMES DO WITH UNDOABLE HARM
The row's second half: how the best games let a player undo harm without erasing it. This
lane's own school on the Angel (Q15, `[angel means]`) already answered the shape once —
SETTLE closes a line, it never erases a deed, because a deed that never happened breaks the
witness web and Q11's own rule that a scar is a repair, not a deletion. Nothing in this
round's research contradicts that; `d.right` already keeps the record. The correction this
round adds is narrower and sits underneath it: **some scars should not be closeable at all**,
which the erasure-vs-record distinction alone does not capture — a record that CAN be closed
and a wrong that categorically CANNOT are two different design questions, and only the first
one is built.

## ROUTED
- **PEOPLE** — the floor is yours to build once he names which kinds carry it (section 5);
  the FORGIVE/RECONCILE split (section 3, second half) is a second bit on `d.right`, not a
  rewrite; the apology's missing steps 2/3/5 (section 2) are surface work, not new mechanism.
- **ECONOMY / TUNING** — if a floor ships, it is a boolean per kind, never a number; do not
  let it become a second felt number outside rule 21's one table.
- **QUESTS** (research only, rule 35) — the failure-mode list in section 2 (apology too soon,
  explanation read as excuse, no reparation when one was possible) is real material for the
  library's own contract/event designs; cited here, not built here.

## WHAT THIS ROUND DID NOT DECIDE
Which deed kinds are unforgivable (his). Whether REFUSE should cost the wronged person
anything to invoke (a design question, not researched here). The exact second field on
`d.right` for RECONCILE (a shape, not a schema — PEOPLE's file, PEOPLE's call).

## GATE NOTE
School, no code, no gate. Registered to VOTE as one line, `dynasty-angel-verbs-9-28`.
Pre-push: canon rot (red on main too, unrelated), handoff, reply contract, three names 31/0
and the flip 23/0 unchanged.

*DYNASTY round, research only. Nothing in the game changed.*
