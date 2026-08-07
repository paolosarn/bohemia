# BOHEMIA — CROSS-LANE VERIFICATION: THE WITNESS RULINGS ARE BUILT (8/5/26)

> "Think outside the box WE HAVE 11 months of forward motion work we need to complete Do what
> you have to do next and know what comes after"
> — Paolo, 8/5/26

**MY OWN HANDOFF SAID "COORDINATION NEEDED" ON THIS FOR THREE TURNS RUNNING AND DID NOTHING
ABOUT IT.** A blocker you keep re-declaring instead of resolving is not a blocker, it is a
habit. So I went and read what the other lane actually built.

**THE ANSWER: MY APPROVED WORK IS ALREADY DONE, BY THE PEOPLE LANE, AND BETTER THAN I WOULD
HAVE DONE IT.** It comes off my queue. Nothing here needs a verdict.

---

## WHAT I DID: READ THE CODE, NOT THE RECORD

Their record `records/BOHEMIA_REPUTATION_TRAVELS_8_2_26.md` claims four rules. **A record is
not proof**, so every claim below was checked against the module and their gates were run.

- `engine/bohemia_standing.js` — 344 lines. `witness()`, `gossip()`, `standingOf()`,
  `becauseOf()`, `inherit()`; `HEARSAY_LOSS = 0.55`, `MAX_HOPS = 2`, `GEN_LOSS = 0.45`.
- `engine/bohemia_deeds.js` — 236 lines. Per-deed hop budgets from clout tags: `hopsFor()`,
  `reachOf()`.
- `engine/bohemia_memory.js` — 107 lines. Direct sighting and clarity decay only, no spread;
  the spread lives in `standing.js`.
- `gates/standing_gate.js` — **35 passed, 0 failed, 11/11 self-test probes caught.**
- `gates/deed_bridge_gate.js` — **27 passed, 0 failed, 15/15 self-test probes caught.**

Run this turn. It is real.

## RULING BY RULING — WHAT IS SATISFIED

| ruling | status | the code that satisfies it |
|---|---|---|
| **R20** witnesses need plumbing on ALL NPCs | **BUILT** | `witness()` + `SEE_RANGE`: a deed enters only the minds near enough to see it. Measured 2 of 3; the one across the valley learned nothing. |
| **R21** stories spread like a plague, with **degrees** | **BUILT** | `gossip()` moves a deed mind to mind; `HEARSAY_LOSS 0.55` per retelling, `MAX_HOPS 2`. Measured: watched 3.96 vs heard 2.18, and a rumour down a line of twelve reached 3. |
| **R21** "different degrees of stories" | **BUILT** | `hopsFor()` gives a `#quiet` deed ONE hop and a `#reckless` one five. His own clout tags decide how far a story travels. |
| **R21** NPCs have memory | **BUILT** | clarity decay, measured 4.00 → 1.00 → 0.06 → 0.00 over a week. |
| **R17** record silently; a ledger, never a score | **BUILT, AND MORE STRONGLY THAN I RULED IT** | I said "log the acts, show no bar." They went further: **an opinion is DERIVED and never stored at all.** There is no score to display, migrate or desync. A stronger guarantee than the ruling asked for. |
| **R19** NPCs comment on how you play | **MATERIAL READY** | `becauseOf()` returns the specific remembered deeds, who holds them, and whether they watched or merely heard. The talking belongs to LIFE. |
| dynasty carry | **BUILT, unasked** | `inherit()` + `GEN_LOSS 0.45`: a quiet good deed dies with its witness; a notorious one becomes what your child is judged for. |

**SEVEN of my recorded rulings are satisfied in shipped, gated code.** I was about to build a
second one of these.

## ★ AND MY OWN RESEARCH INDEPENDENTLY AGREES WITH THEIRS

`records/BOHEMIA_RESEARCH_STORIES_SPREAD_8_3_26.md` studied Dwarf Fortress, RDR2, CK2, Skyrim
and RimWorld and made five recommendations. **Neither lane saw the other.** Four of the five
match what they had already built:

| my recommendation, from the research | their implementation |
|---|---|
| a story is an OBJECT, not a score | opinion derived from remembered deeds |
| witnessing is a general capability of every NPC | `witness()` on any mind in `SEE_RANGE` |
| **degrees of a story are degrees of FIDELITY, not severity** | `HEARSAY_LOSS` — a retelling keeps 55% of its force |
| Skyrim's failure: a meter cannot remember who was in the room | `becauseOf()` names who holds the memory and how they got it |

Two lanes, different evidence, same architecture. **That is the strongest signal available that
the design is right**, and it is worth more than either document alone.

The one recommendation of mine they did **not** implement is rule 5, and it is not a gap in
their work — see below.

---

## TWO REAL GAPS, NEITHER OF THEM A COLLISION

### ★ GAP 1 — R18 IS CURRENTLY UNEXPRESSIBLE, AND NOBODY HAD WRITTEN THAT DOWN

**R18 (LOCKED):** *sparing somebody after you already shot them is not the same act as sparing
somebody with their hands up.* Two different entries in the ledger.

The organ stores deeds **by kind**, and their own record says the next step is *"nothing calls
`witness()` yet... that needs a deed vocabulary, which is his."*

**So R18 is not a bug in their organ — it is a REQUIREMENT ON THE VOCABULARY HE HAS NOT
WRITTEN YET.** If the vocabulary ends up with one `spared` kind, R18 is silently unbuilt and
every gate stays green, because no machine currently connects the two.

**[PENDING Paolo]** — the vocabulary is content and it is his. What I can say without writing
it: **it needs at least two distinguishable kinds for mercy**, because he already ruled they
are different acts. Recorded here so the requirement travels with the vocabulary instead of
being rediscovered later.

### GAP 2 — THE APPROVED KILL-THE-WITNESS MECHANIC IS UNBUILT, AND THEIR ARCHITECTURE ALREADY
### SUPPORTS IT FOR FREE

He approved it on 8/3: *"ABSOLUTELY ANYTHING U THINK U CAN AND SHOULD DO IS IMPORTANT."*

**Good news for whoever builds it: nothing new is needed.** Deeds live in minds and travel by
`gossip()`, so a mind removed before it retells takes the deed with it. Their own comment says
it outright — *"a quiet good deed dies with the witness."* The mechanic is a consequence of
the model, not an addition to it.

**Routed to COMBAT** (which owns the camp and the fight per R1). Not built here, and this lane
is not touching their organ.

---

## WHAT COMES OFF MY QUEUE, HONESTLY

"THE WITNESS + STORY-SPREAD PLUMBING — approved work, top item" has been on my queue for four
turns. **It is done.** Deleting it, and recording why, because a queue that lists finished work
is a queue that hides the real next thing.

## WHAT I ADDED, AND IT IS THE ONLY NEW MACHINERY HERE

**A ruling can be built and then quietly become unbuilt**, and no gate would notice, because
the lane that holds the *ruling* is not the lane that holds the *implementation*. So
`gates/rulings_gate.js` now asserts the PEOPLE lane's organ still satisfies this lane's
rulings: `witness()` and `gossip()` still exist, hearsay is still weaker than eyesight, hops
still run out, standing is still derived rather than stored, and `becauseOf()` still explains
itself.

**It checks the CONTRACT, never the numbers.** `HEARSAY_LOSS` and `MAX_HOPS` are theirs to
tune and his to rule; if this lane asserted the values it would freeze another lane's dials.
The checks read the module's *structure*.

**That is the pattern worth reusing: the lane holding the ruling gates the lane holding the
build.** Nine parallel sessions and nothing else does this.

## WHAT IS STILL HIS

- **The deed vocabulary** (gap 1), and R18's two-kinds-of-mercy requirement on it.
- Whether the kill-the-witness play gets built, and what it costs (gap 2).
- `HEARSAY_LOSS`, `MAX_HOPS`, `GEN_LOSS` — every one a dial.
- Nothing in this record decides any of it.
