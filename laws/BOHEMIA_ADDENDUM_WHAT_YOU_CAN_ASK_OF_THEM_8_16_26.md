# BOHEMIA ADDENDUM — WHAT YOU CAN ASK OF THEM (8/16/26, FACTIONS lane, LOCKED)

## 1. THE HOLE: THE LADDER POINTED AT NOTHING

8/12 built the ladder, 8/15 the wall, 8/16 the claim. So an outfit could COUNT
you and start **leaning on you**. What it could never do was **give you
anything**.

His sixteen `pays` and `hold` lines — real economies, thumbed 8/2 — were **card
text and nothing else**. Verified by sweep: there was no `ask`, `request`,
`receive` or `grant` anywhere in `engine/`. You could climb to INSIDE and the
only thing that changed was a word on a card.

## 2. THE RESEARCH, AND HIS OWN CANON GOT THERE FIRST

**SCOTT 1972**, *Patron-Client Politics and Political Change in Southeast Asia*
(Am. Pol. Sci. Rev. 66:91–113): a patron "uses his own influence and resources
to provide protection or benefits" to a client who "reciprocates by offering
general support and assistance". Asymmetric, personal, and **not a market
trade**.

**EISENSTADT & RONIGER 1984**, *Patrons, Clients and Friends*: the tie carries
"a strong element of unconditionality and of **LONG-RANGE CREDIT AND
OBLIGATIONS**", with "diffuse obligation and durability".

**That phrase is the mechanic.** A patron tie is not a transaction, it is a
**running account**. You do not pay for a favour; you carry one.

**AND HIS CARTEL DOSSIER SAID IT ON 8/2, IN HIS OWN WORDS:**

> "They want you to OWE them. Not to work for them, not yet. **The first thing
> they give you is free and it is exactly the thing you needed that week.**"

That is Eisenstadt & Roniger's long-range credit, written as a faction, three
weeks before I read the paper. The research did not tell me what to build. It
told me what he had already built and I had not read as a mechanic.

## 3. THREE ECONOMIES, ALL READ OUT OF CANON THAT HAD NEVER DONE ANYTHING

`firstMove` already sorts his sixteen outfits three ways. Until now its **only**
effect was one warning row on the card.

| firstMove | outfits | what happens |
|---|---|---|
| `they-give-first` | 4 | give from the **very first meeting**, cost no standing, and put you in **DEBT** |
| `you-give-first` | 11 | give nothing until they **COUNT** you, and then it **SPENDS** the standing you built |
| `never` | 1 | give nothing to anybody, **at any depth** |

The threshold is DERIVED from the shipped ladder, never typed. What they hand
over is his `pays` line **verbatim**, compared byte for byte by the gate across
every outfit, so nothing here can quietly invent a resource. The module names no
outfit in its code.

## 4. THE ONE-GESTURE MERGE, WHICH IS HIS CANON BEING CLEVERER THAN MY WIRING

The Cartel's `wants` is `debt`. So the thing they want **from** you and the
favour they offer **to** you are **the same motion**, and the card was offering
it twice: "Take what they are offering" beside "Take it".

That is not a wiring accident to paper over. With the Cartel, **helping yourself
is how you climb, and every rung is a debt.** One button now fires both halves:
one press moves the ladder *and* the account. Measured on the real card:
`gave:1`, `owed:1`.

## 5. FOUR BUGS, ALL MINE, ALL FOUND BY LOOKING

- **`ctAct.label` off null.** The favour is takeable when the act is blocked (not
  on their ground, already gave today). Threw on the real card.
- **THE MERGE WAS COMPUTED BEFORE THE THING IT READS.** `ctFavIsAct` sat above
  `ctAct`'s assignment, so it was always false and the dedupe silently never
  fired.
- **`var x = false` AFTER AN EARLIER ASSIGNMENT.** Hoisting meant the declaration
  ran *after* the set and clobbered it back. Same class as the one above:
  **order is a fact, not a formatting preference.**
- **"1 times you took what they were offering."** The tell of a string nobody
  read out loud. once / twice / N times.

## 6. THE LAW

**1. A LADDER MUST POINT AT SOMETHING.** Any system the player climbs has to
hand something back, or the climbing is bookkeeping.

**2. A FAVOUR IS CARRIED, NOT PAID FOR.** Taking help opens a running account,
not a settled trade. What is owed persists and accumulates.

**3. THE REFUSAL IS A ROW, NOT AN ABSENCE.** "They will never give anybody
anything" and "they do not know you well enough yet" are completely different
facts about the world, and a missing button says neither.

**4. WHEN TWO SYSTEMS DESCRIBE THE SAME GESTURE, SHIP ONE BUTTON.** Two buttons
for one motion is a seam in the fiction, and the fix is usually that the canon
already meant them to be one thing.

## 7. THE MACHINE

`gates/favour_gate.js`, 31 claims — A the three economies are his and they
actually differ, B what they give is his line byte-for-byte across every outfit
and no outfit is named in the code, C the account runs and accumulates while an
earned favour spends instead, and **this file never opens a claim** (that
boundary asserted, not trusted), D every unruled number tagged and every string a
draft attempt, E the real city in a real browser with **no stub**, F generated
and the anchors refuse when stale.

## 8. WHAT IS STILL NOT MINE

The debt is recorded but **not yet collected** — `bohemia_claim` owns asking, and
a second opener is how two systems start disagreeing. Wiring "you owe them, so
they ask harder" is the obvious next connection and it belongs in one place.

And the reachability finding is unchanged: from the spawn cell the nearest 1,438
people still include zero who run with anybody.
