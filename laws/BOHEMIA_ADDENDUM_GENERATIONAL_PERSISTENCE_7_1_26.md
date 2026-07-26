# BOHEMIA — ADDENDUM: GENERATIONAL PERSISTENCE ARCHITECTURE (the 100-year problem)
### 7.1.26 — deep engine research on the single hardest systems problem in the game: how the world carries 100 years across three generations, so each heir inherits EVERYTHING the last built (compound, alliances, territory, family tree, wounds, mistakes) and the world visibly reflects all three lives at the end — while the save stays small and fully deterministic. Grounds GDD v2 §generations, §time mechanics, §act transitions, and the existing save/reconstruct model.

---

## WHAT THE LORE DEMANDS (the hard constraints, not negotiable)

1. **Three generations, ~100 years.** Gen 1 Animal, Gen 2 Human, Gen 3 Angel. The player lives all three.
2. **Each generation inherits EVERYTHING.** "Each generation inherits everything the previous one built." Compound, faction standings, territory, trade routes, the family tree, AND the unhealed wounds and compromises.
3. **The world reflects the whole dynasty at the end.** The closing monument and the city's textures show "what the player actually did across three generations, not just in abstract stats but visually." A district the dynasty never touched still looks like act-one apocalypse; one they invested in looks modern.
4. **Time is action-driven, not clock-driven.** "The world moves when the player acts. Sleeping saves and advances time." There is no real-time clock aging the world; time advances in discrete steps when the player does things and sleeps.
5. **The save must stay small and deterministic.** Established engine law: the world is a pure function of seed + choice log, recomputed forward on load. We do NOT store 65 square miles of per-tile state.
6. **The heir is not always the child.** "Sometimes it is the sibling's child who inherits." The transition picks an heir from the family tree, who carries forward modified traits.

The tension: inherit EVERYTHING + reflect three lives visually, but DON'T store the whole world. These look contradictory. They're not, if the generational skip is modeled as a deterministic fold, not a snapshot.

---

## THE CORE INSIGHT: A GENERATION IS A FOLD, NOT A SNAPSHOT

The existing save already says: world = f(seed, choiceLog). The generational skip extends this by ONE idea:

**At each generational transition, the accumulated choice log is FOLDED into a compact "inheritance state," and the next generation starts from that fold plus a fresh (but connected) choice log.**

Think of it as three deterministic layers stacked:

```
  Gen 1 choices ──fold──▶ Inheritance-1 ─┐
                                          ├─▶ Gen 2 starts here
  Gen 2 choices ──fold──▶ Inheritance-2 ─┤
                                          ├─▶ Gen 3 starts here
  Gen 3 choices ──────────────────────────▶ ending (reads all three folds)
```

- The **choice log** stays the small deterministic record it already is.
- At a transition, we don't throw the log away and we don't snapshot the world. We run a **fold function**: replay the generation's choices forward, read out the handful of durable summary values that carry to the next life (faction standings, territory ownership, compound upgrades, economy stocks, family-tree state, karma, "wounds"), and write them as a compact `inheritance` block stamped with the beat it happened at.
- The next generation's world is computed as: seed → worldgen → apply inheritance-1 → apply inheritance-2 → replay current-gen choices forward. Fully deterministic, still tiny, still replayable.

This is the same principle as the save-migration chain (each step does one forward transform), applied to TIME instead of versions.

---

## WHAT CARRIES (the inheritance block — the ONLY things that survive a generation)

The fold reads out a bounded, compact set. Everything else is recomputed. Candidate inheritance fields (numbers to lock with Paolo when the systems are built):

- **Faction standings** — the final standing toward each faction (the political map the heir wakes up into). Compact: ~14 numbers.
- **Territory ownership** — which faction/dynasty holds which district at handoff. Compact: districtId → ownerId.
- **Compound state** — which buildings/mega-projects exist and their tier. Compact: a build list.
- **Economy stocks** — carried electricity/medicine/clout balances (or a lore-justified fraction; a dynasty doesn't inherit infinite currency, see below).
- **Family tree** — the dynasty graph: who married in, who the children are, who died, who the next heir is, and the *traits/wounds* that heir carries. This is the emotional spine and it's small structured data.
- **Karma / virtue state** — the moral ledger that shapes act-three context ("all three pacifist" vs mixed).
- **Recorded vs unrecorded ledger** — the two-ledger split (see that addendum) folds too: what the Amalgamation has modeled about the dynasty carries, and the blind-spot advantage carries as an off-ledger value.
- **World texture deltas** — NOT per tile. A compact per-district investment score that the texture system reads to decide apocalypse/recovering/modern. A district's look is f(its investment score), so we store the score, not the pixels.

The rule: if it's something the heir would *feel the consequences of*, it folds. If it can be *recomputed from seed + folds*, it doesn't.

---

## HOW THE VISUAL "THREE LIVES" WORKS WITHOUT STORING THE WORLD

The ending city and the monument must show all three generations. They do, because:

- Each district carries a small **investment score** per generation (three numbers, or one accumulating number tagged by which gen moved it).
- The texture state of a district = a pure function of its accumulated investment score. Never touched → still apocalypse. Heavily invested across gens → modern. Invested once then neglected → recovering, frozen at the level it reached.
- So the city at the end is a deterministic READOUT of ~N districts × a small score, not a stored image. "The city reflects what the player did across three generations" becomes literally true and costs almost nothing to persist.
- The monument (stone / organic / light) is a readout of the karma+virtue fold across all three gens. One computed result, zero storage.

---

## ACTION-DRIVEN TIME (how the clock advances without a clock)

The lore says time is action-driven and "sleeping saves and advances time." This fits the heartbeat/beat model cleanly:

- The 120 BPM heartbeat drives *animation and presentation* (moment-to-moment).
- **World time** (the 100-year arc) is a separate, coarse counter that only advances on discrete events: completing quests, major builds, and especially SLEEPING. Sleep = the save+advance tick.
- So there are two clocks by design and they don't conflict: the fast heartbeat for how things move, and the slow action-clock for how the world ages. The generational transition is just the action-clock crossing a story threshold ("point of no return," which the game warns about first).
- This means the world never ages "while you're standing still," which is exactly the intended feel and also makes everything deterministic (time only moves on logged actions).

---

## THE TRANSITION SEQUENCE (what actually happens at a generation break)

1. Player reaches the act's point-of-no-return (warned in advance — a permanent decision gate).
2. Engine runs the **fold**: replay this generation's choices, read out the inheritance block, stamp it with the beat.
3. **Heir selection** from the family tree (child, or sibling's child per lore) — deterministic given the family-tree state and the player's earlier marriage/children choices.
4. The heir's starting traits are computed from the fold (they inherit the wounds and the advantages).
5. World is recomputed: seed → worldgen → apply all folds so far → hand control to the heir. The player wakes into a world a generation older that visibly carries what they built.
6. The new generation's choice log continues (it doesn't reset; it's tagged by generation so the ending can read all three).

---

## WHY THIS IS SAFE TO BUILD ON (ties to existing engine)

- **Save model unchanged in spirit:** still seed + choice log + forward-compute. We add an `inheritance[]` array (≤3 small blocks) and a `worldTime`/`generation` counter. Save stays tiny.
- **Deterministic:** folds are pure functions of the choice log. Same seed + same choices → same three generations → same ending, every time. Seeds stay shareable.
- **Reconstruct extends naturally:** on load, replay gen-1 choices → fold → replay gen-2 → fold → replay gen-3 → present. The existing `reconstruct()` already replays in beat order; this is that, segmented by generation.
- **Two-ledger compatible:** recorded/unrecorded both fold, so the Amalgamation's knowledge and the dynasty's blind-spot advantage persist correctly across 100 years — which is the whole point of the finale.

---

## OPEN FORKS [PENDING — Paolo's calls when the systems get built]

- **Economy carry:** does the heir inherit full currency balances, a fraction, or just the *productive capacity* (buildings/territory) and start with low liquid currency? Lore leans toward inheriting what was BUILT, not a pile of cash — a dynasty inherits the factory, not the bank account. Recommend carrying capacity + a modest stock.
- **How much standing decays across a generation?** A generation passes; do alliances soften toward neutral over the skip (relationships need maintenance) or hold exactly? Lore-justified partial decay toward neutral feels right and creates gen-to-gen texture. Number TBD.
- **The three act-two permanent decisions** are still "to be determined in GDD v3" — those will each produce fold values.
- **Wound modeling:** how the "wounds the family never healed" express mechanically in the heir (starting debuffs, locked dialogue, faction grudges inherited). Needs a small design pass.
- **Building persistence across the skip:** leaning "most stays, lore-justified" (a compound doesn't vanish in a generation), with neglect pushing texture backward. Confirm.

---

*BOHEMIA — Generational Persistence Architecture — 7.1.26*
*A generation is a fold, not a snapshot. The world is still a pure function of seed + choices; we just fold the log at each 100-year step. Inherit everything, store almost nothing, and let the city at the end be a deterministic readout of three lives.*
