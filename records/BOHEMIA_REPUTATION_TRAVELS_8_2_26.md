# REPUTATION HAS TO TRAVEL (8/2/26, PEOPLE lane) — gap 3, and it took 4, 7 and 10 with it

Paolo 8/2: *"lets do some faction shit... Do what you have to do next and know what comes
after."* All twelve faction gaps came back WANT. Gap 2 (the members were wallpaper) shipped
last turn. This is **gap 3**, and the research called it the documented failure of the
entire genre: **every NPC instantly knows what you did, anywhere, with no route the news
could possibly have taken.**

## WE ALREADY HAD THE HARD HALF

`engine/bohemia_memory.js` is a real witness organ — minds hold sightings, familiarity
slows forgetting, clarity decays as `0.5^(age/halflife)`, deterministic. It had no concept
of a **deed**, an **opinion**, or one person **telling another**. That is all
`engine/bohemia_standing.js` adds.

## THE FOUR RULES, AND WHAT EACH ONE BUYS

**1. A DEED IS WITNESSED, NEVER ANNOUNCED.** Only minds near enough to see it record it.
Measured: 2 of 3, and the one across the valley learned nothing.

**2. AN OPINION IS DERIVED, NEVER STORED.** Recomputed from remembered deeds, each weighted
by its clarity *right now*. No score exists, so there is nothing to save, migrate or desync.

> **AND THAT IS THE REDEMPTION PATH, FOR FREE — gap 4, unasked.** New Vegas's most-cited
> flaw is that reputation can never be removed, only buried under a bigger opposite number.
> Here memories fade. Measured on one bad deed: **4.00 → 1.00 → 0.06 → 0.00** over a week.
> Time softens it; being seen doing better in front of enough people is the fast way. And
> one night is *not* forgiveness — the gate asserts that too.

**3. HEARSAY IS WEAKER THAN EYESIGHT AND IT RUNS OUT.** Measured: **watched 3.96 vs heard
2.18**. And the one that matters — a rumour passed down a line of twelve people **reached
3 of them**. Without a hop limit a rumour crosses the valley in a sim day and reputation is
teleporting again.

**4. A FACTION'S VIEW IS ITS MEMBERS' VIEWS.** No ledger. `BUILD THE WORLD` (7/31) turned
"a standing ledger" off by name and **this is not one** — nothing is stored, and no faction
is even *named* in the module. The gate reads the source to prove it rather than believing
the header.

> **AND ZERO-SUM FALLS OUT — gap 7, also unasked.** Same deed, measured: **ALPHA (who
> watched) HOSTILE −4.00, BETA (elsewhere) NEUTRAL 0.00.** Nobody had to author a table of
> who hates whom. And a faction that saw nothing reports `whoSaw: 0`, so **"no view" is
> distinguishable from "neutral view"** — which most systems get wrong.

**Plus `becauseOf()` — gap 10:** the specific remembered deeds behind a standing, who holds
them, and whether they watched it or merely heard it. Standing a player cannot read is
standing they cannot play around.

## CONTENTS-PAOLO'S, KEPT TO THE LETTER

`DEED_WEIGHT` **ships EMPTY**. What counts as a deed and what it is worth is his ruling and
it has not been made. With it empty every opinion is exactly 0 and every faction reads
NEUTRAL — **the module is inert, and the gate proves that rather than trusting a comment.**

## THE GATE, AND A LESSON ABOUT GATES

`gates/standing_gate.js`, registered as **STANDING**. 23 claims, all measured.

**The first version of its self-test was decorative and said so.** Six probes that re-ran
the working module and asked whether it misbehaved — of course it did not, so it reported
**0/6 caught** and could never have caught anything. Rewritten to feed each *claim's own
predicate* the values a broken implementation would produce; a probe passes only if the
claim **rejects** them. Now 8/8. **A self-test that tests the thing instead of the CHECKER
is exactly the failure it exists to prevent.**

## WHAT COMES AFTER

1. **Nothing calls `witness()` yet.** The organ is built and inert; the run has to report
   deeds into it. That needs a deed vocabulary, which is his.
2. **Gap 5** — wearing another faction's colours. Now cheap: the colours are in, membership
   is in, and this gives "somebody who knows your face sees you in it".
3. **Gaps 6, 8, 9** — agendas, membership, internal politics. All sit on this.

---
*BOHEMIA — reputation has to travel — 8/2/26 — PEOPLE lane*
*One mechanism, four gaps: news that travels at the speed of people, and a way back.*
