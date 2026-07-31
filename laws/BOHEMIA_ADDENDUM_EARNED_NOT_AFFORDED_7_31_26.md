# BOHEMIA ADDENDUM — EARNED, NOT AFFORDED (7/31/26)
# Resolves a live contradiction between two canon files. Newest date wins.

> "VALHEIM PROJECT ZOMBOID FALLOUT NEW VEGAS WITH POCKET CITY 2 ONTOP OF IT"
> — Paolo, 7/31/26

Pocket City 2 was locked as the city-builder base on 7/1/26. He is naming the
whole stack, not introducing a new reference. Going to read that addendum before
building anything found a **BUG**, and CLAUDE.md is explicit that a contradiction
between two live files is a bug and not an interpretation choice.

---

## THE CONTRADICTION

`laws/BOHEMIA_ADDENDUM_CITYBUILDER_MODEL_7_1_26.md` says, verbatim:

> "**Daily upkeep on everything.** Zones, roads, most buildings cost currency per
> period to maintain. **Overbuilding past your income bankrupts you.** This is the
> discipline that makes the city-builder a real economy and not a paint tool."

`laws/BOHEMIA_ADDENDUM_TEN_YEARS_COLD_7_31_26.md` clause 2 bans economic gameplay
as a **category** — no prices that move on a clock, no markets the player reads,
nothing whose job is to make the player think about money as a system. Income and
bankruptcy are that category.

**TRUTH HIERARCHY: NEWEST DATE WINS. 7/31 beats 7/1.** Upkeep, income and
bankruptcy are **DEAD** as player-facing mechanics. The rest of the 7/1 addendum
stands untouched — zone-don't-hand-place, road/power/water access, demand signals,
building upgrades, three cities across three generations, act-gated buildings,
buildings anchoring quests, everything can genuinely be rubble, the mayor arc.

## THE REAL QUESTION IT LEAVES

The dead clause was carrying something important: **what stops the city-builder
being a paint tool?** Remove affordability and something has to replace it.

## THE ANSWER, AND POCKET CITY 2 ALREADY USES IT

**BUILDINGS ARE EARNED, NOT AFFORDED.**

Researched 7/31 against the reference itself: in Pocket City 2, buildings unlock by
**levelling up, completing quests, winning City Competitions, clearing Hard and
Expert difficulty, and opening regional cities in new biomes** — and *"there are no
microtransactions, all unlockable items are earned through gameplay."* Money exists
in that game, but **money is not the gate on progression.** Earned capability is.

Our own 7/1 addendum already wrote this down and then buried it under the upkeep
clause: *"buildings unlock by leveling / completing quests / clearing harder
difficulty... Progression is generational, not just XP."*

So the discipline was never affordability. It was **permission you had to go and
get** — and that is a better fit for a hardcore dynasty game than a budget
spreadsheet, because it makes the city a record of what you did rather than what
you saved.

## AND IT JOINS THE REST OF THE STACK ON ITS OWN

The research turned up one more thing that closes the loop: Pocket City 2 tracks a
**"Relation rating with institutions and citizens"** that rises as you complete
quests. That is the same axis as New Vegas standing, which
`slices/lab/BOHEMIA_LAB_TEN_YEARS_COLD_7_31_26.html` modelled — fame and infamy as
two counters that never cancel.

**So the four references were never four systems.** Valheim says what you built is
the only thing that rises. New Vegas says standing is the currency once money is
gone. Pocket City 2 says the city unlocks on earned capability and tracks your
relation with the people in it. Zomboid says the utilities are already dead. They
are one loop: **you do things → you earn standing and capability → the city grows →
the grown city makes you worth more to deal with.**

## WHAT IS STILL HIS

- **What each act's buildings actually cost you** in effort, quests or standing.
  The cost TABLE is canon, exactly as the action-cost table is
  (`laws/BOHEMIA_ADDENDUM_THE_ACTION_COST_SHAPE_7_31_26.md`). No lane invents it.
- **The building catalog** — which Pocket City 2 buildings make the cut, their
  Bohemia names, act tiers, and which anchor quests. Already `[PENDING Paolo]` in
  the 7/1 addendum and still is.
- **Whether degradation still needs a cost.** "Everything can genuinely be rubble"
  is locked, and neglect has to bite somehow. Without upkeep the bite must be
  something else — decay over time, or standing lost with the people living in it.
  **[PENDING Paolo]**, and it is the one real hole this resolution opens.
- **The naming of the zones.** Still `[PENDING Paolo]` from 7/1.

## GATE

`gates/earned_not_afforded_gate.js`, registered as EARNED NOT AFFORDED. It proves
the superseded clause is marked dead where it lives, that this file records the
newest-wins resolution, that no shipped surface has grown an upkeep or bankruptcy
mechanic, and that the pendings above have not been quietly filled in by a lane.
