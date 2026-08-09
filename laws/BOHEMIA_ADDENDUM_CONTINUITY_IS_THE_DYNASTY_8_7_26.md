# BOHEMIA ADDENDUM — CONTINUITY IS THE DYNASTY (Paolo 8/7/26, LOCKED)

Asked as one question with three conclusions, answered with one letter.

> **Should quests start branching on what you already recorded?**
> **A.** Yes — a bond built in one quest opens a door in another. Continuity is the dynasty.
> B. No — quests stay self-contained; the recorded state is flavour for the feed and log.
> C. Bonds only — people remember you, but knowledge and flags stay flavour.

Paolo: **"A"**

---

## THE RULING

1. **A BOND CARRIES.** What you build with a person in one quest is there when a later
   quest names that same person. Every quest is played against everything you have
   already done.
2. **THIS IS WHAT THE RECORDED STATE IS FOR.** The corpus writes 142 pieces of memory
   — 62 `learn`, 36 `set_flag`, 44 `bond` — and had been conditioning on four. That
   was not the design; it was a missing wire and a validator that discouraged the one
   correct use.
3. **BONDS FIRST, BY MEASUREMENT.** Bonds are wired now because bonds were the ones
   with an unblocked path (the runtime already resolved a numeric gate off `s.bonds`).
   Knowledge and flags are the same shape and are NOT yet carried — named here so
   nobody assumes they are.

## WHAT A PERSON IS, AND WHY THIS NEEDED NO NEW AUTHORING

A bond attaches to a **person**, and a quest's *label* for someone is not a person.
Measured across the corpus before designing anything: 43 distinct role names, 5 used by
more than one quest. Those five answer the question by themselves.

```
neighbor   S06  is=the_neighbor household=behind_fence
           S09  is=the_neighbor household=behind_fence     IDENTICAL — one person
runner     S02  faction_any knows_the_load=true
           S12  faction=CARTEL moves_medicine=true         DIFFERENT — two people
```

**Paolo has been declaring identity in the `@ROLE` conditions since before anything
could read it.** Writing the neighbour's conditions verbatim, twice, IS the statement
that it is the same neighbour. So the identity key is the **condition set**, never the
label — which means continuity required no new authoring and cannot silently merge two
different runners into one person.

46 distinct people are identified across the 21 canon quests this way.

## GROUNDED

In small-scale societies an individual interacts with the same people over and over,
and cooperation runs on **dyadic reciprocity** — tracking, one-on-one, who helped you.
Known cooperators demonstrably gain more partners and more support; reputation diffuses
through a small community and changes who will deal with you. A valley with no courts
remembers **people**, not job titles.
Sources: [Social Norms of Cooperation in Small-Scale Societies](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4726523/) ·
[How small-scale societies achieve large-scale cooperation](https://www.sciencedirect.com/science/article/abs/pii/S2352250X21001597) ·
[The cultural foundations of cooperation enforcement](https://www.sciencedirect.com/science/article/pii/S0167268126000806)

## THE MECHANISM (built the same turn)

- One ledger per quest manager, handed to every runtime it makes.
- `@DO bond X +N` writes the quest's own state **and** the ledger, keyed by person.
- A numeric gate (`[gate: neighbor>=10]`) reads the **carried** bond.
- It is in the save, so continuity survives a reload.
- It **ships empty** — MECHANISM-MINE / CONTENTS-PAOLO'S. It holds only what his quests
  award, and a fresh world has nothing in it.
- A runtime built without a ledger is bit-for-bit what it was, so nothing existing moved.

Gate: `gates/continuity_gate.js`, 7 claims, 8 planted mistakes caught. It holds the
crossing, the identity discrimination (a different person sharing a label inherits
nothing), reload survival, no double-counting, and the untouched old behaviour.

## WHAT THIS DOES NOT DO YET — named so it is not assumed

- **`learn` and `set_flag` do not carry.** Same shape, same fix available, not built.
- **391 of 395 dialogue options are still `[gate: none]`.** The machinery is now real;
  whether the writing reaches for it is authoring, and authoring is his.
- **Nothing binds a quest role to one of the 268 derived world people yet.** Identity
  here is the author's condition set, which is stable and correct, but it is not the
  same thing as pointing at a body standing in a district.

---
*BOHEMIA — Continuity Is The Dynasty — 8.7.26*
*You are played against everything you already did. That is what makes it a family and not a series of errands.*
