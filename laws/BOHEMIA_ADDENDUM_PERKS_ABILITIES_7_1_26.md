# BOHEMIA — ADDENDUM: PERKS & ABILITIES (the build-variety layer)
### By Paolo Alexandre Sarnataro (Babypunk / Punk4Prez)
### Living document — updated every working session. The file IS the memory.
### 7.1.26 — consolidation pass. Everything catalogued below was previously scattered as inline `[PERK — not built]` / `[ABILITY — not built]` tags across the combat addendum, GDD v2, and the RF4 DNA doc. Pulled into one home so the build-variety axis can actually grow. NOTHING here is built. NOTHING here is new design. This is a recovery + consolidation doc.

---

## WHY THIS FILE EXISTS

The perk/ability system is Bohemia's **build-variety axis** — the RF4 DNA doc (6.30.26) flagged "build variety" as the single biggest [PENDING] question, because RF4's depth leans on many viable builds and Bohemia's equivalent is *this*: perks + abilities + weapon types. But the catalogue was living as loose tags inside a combat-mechanics doc, which is where ideas go to get lost in a compaction. This file is the home now. Every power Paolo names goes here the same session, tagged, never mistaken for a built mechanic.

Read the tags strictly:
- **[ABILITY — not built]** — an active power Paolo named for later. Costs from the second bar (mana / time-dilation). Catalogued, NOT a current mechanic.
- **[PERK — not built]** — a passive modifier Paolo named for later. Catalogued, NOT built.
- **[OPEN]** — a real fork still needing Paolo's call.
- **[LOCKED]** — Paolo confirmed the framing. Build on it.

---

## THE SPINE IT ALL PLUGS INTO (locked context, not new)

Abilities are not free-floating. They cost from the **secondary bar** — the resource already defined in GDD v2 §14-15 and v3, separate from health/stamina, that governs the **time-dilation mechanic**. In combat that bar is the VATS-adjacent power: see enemy action trajectories before they execute, buy an extended planning window or an extra action in the grid turn.

Three locked anchors this system hangs on:
1. **[LOCKED] The second bar = the mana bar = the time-dilation bar.** One resource. It powers time-dilation AND active abilities. (GDD v2 §14-15.)
2. **[LOCKED] The mana/ability layer lives in the POSITIONING/TILES game**, which comes AFTER the cover rewrite. Abilities are a tiles-layer system, not a dial-layer system. The dial is pure execution; abilities are the tactical resource spend around it.
3. **[LOCKED] Ties to the Ghost Time Layer (GDD v2 §20).** The read-ahead / see-the-future powers are the combat expression of the Ghost Time Layer, the same projected-trajectory visual used for city builds, pointed at enemies.

Design law inherited from the RF4 DNA doc: abilities must **merge/simplify, not add stat bloat** (RF4 pillar 5), keep the tell **on the battlefield** (pillar 7), and never **punish taking time** (Bohemia advantage 4). A perk that just adds a number nobody reads fails the yardstick and doesn't ship.

---

## ABILITIES CATALOGUE (active, cost the second bar — not built)

**[ABILITY — not built] Invincible run to cover.** Bullet-immune while you sprint to the nearest cover. Mana cost scales with THREE things: how far the cover is, how many guns have a line on you, and how much was in your pool. This is the get-out-of-the-open card. Being caught exposed is not an automatic game over IF you have the mana. If you don't have it and can't land the perfect shots, you'd better pray they miss. *(This is the flagship ability — it's the one that makes exposure survivable without making it safe. The scaling cost is the balance: the more desperate the situation, the more it drains.)*

**[ABILITY — not built] Move 2 tiles and shoot exposed enemies, in 1 turn.** A mobility+offense action that collapses reposition-and-fire into a single turn. Slots into the "clean chain = fewer turns" economy.

**[ABILITY — not built] Auto-killshot.** Lands a guaranteed killshot as one action — skips the dial for one kill. The panic button / guaranteed-close, paid for in mana instead of execution. *(Design tension to watch: this trades execution skill for resource. Has to cost enough that it's a real decision, not a default, or it undercuts the dial.)*

**[ABILITY — not built] See the enemy's next move / future enemy movement.** Read-ahead layered on top of waiting — turns "wait and guess" into "wait and know." Visualizes the enemies' projected movement. This is the direct Ghost Time Layer tie-in (GDD v2 §20). The purest expression of the second bar's original purpose: buy information, buy a planning window.

---

## PERKS CATALOGUE (passive modifiers — not built)

**[PERK — not built] Vital stun lasts 3 turns instead of 2.** A rhythm-control perk. Extends the freeze window a vital hit grants, giving the player more tempo control over a stunned enemy. Interacts with the locked stun rules: it lengthens the *initial* freeze, but does NOT override the no-stun-lock law (an enemy who survives with real HP still gets one full turn back before he can be re-stunned — see combat addendum Open Fork #1, RESOLVED). So this perk buys tempo, not a permanent coma.

---

## OPEN FORKS THIS SYSTEM RAISES (need Paolo's call)

**[OPEN] How big is the tree?** The RF4 DNA doc's central pending question: does Bohemia want RF4-level build diversity (7+ classes worth of viable builds), or is the dial execution the primary variety axis with perks/abilities as a lighter layer? This decides whether this file grows into a 40-node tree or stays a tight dozen high-impact powers. Paolo has not called it. *Claude's lean, for when he wants it: the dial is already a full skill ceiling; the perk layer should be LIGHTER than RF4's class system and MERGE-heavy per pillar 5 — a small set of powers that each change how you play, not a stat-bloat tree. But it's his call.*

**[OPEN] Are abilities dynasty-inherited?** Bohemia spans three generations. Do perks/abilities carry across the dynasty, reset per generation, or partially inherit (a "family knowledge" spine that persists + per-character picks on top)? This connects to the dynasty-misalignment replayability (GDD v2 §Replayability). Not yet raised.

**[OPEN] How are they acquired?** XP/level, found/looted, faction-reward, quest-locked, or bought? The VR_COMPANIONS_XP addendum owns XP; this needs to connect to it. Not specced.

---

## WHAT IS EXPLICITLY NOT DECIDED

- No perk tree structure, node count, or prerequisites exist.
- No mana costs are numbered (except the *scaling rule* for Invincible Run, which is directional, not a formula).
- No acquisition method is locked.
- No dynasty-inheritance rule is locked.
- This is a CATALOGUE of named powers + the locked spine they attach to. It is not a designed system yet.

---

*BOHEMIA — Perks & Abilities — 7.1.26*
*The build-variety axis. Powers cost the one second-bar (mana = time-dilation = Ghost Time). Lives in the tiles/positioning game, after the cover rewrite. Catalogued so no compaction ever eats it again.*
