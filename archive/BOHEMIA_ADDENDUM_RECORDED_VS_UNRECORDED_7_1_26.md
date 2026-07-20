# BOHEMIA — ADDENDUM: RECORDED vs UNRECORDED (the two-ledger engine principle)
### 7.1.26 — a big-picture engine/lore reconciliation, caught before it calcifies. The save model makes the world a deterministic function of the choice log. The core lore makes the dynasty's advantage the things that were NEVER recorded. These meet at the engine level and must be designed on purpose, not by accident. Extends the save model (bohemia_save.js), the Amalgamation threat logic, and GDD v2 §blind spot.

---

## THE TENSION (named honestly)

**Engine truth:** the save system stores seed + a CHOICE LOG, and the entire world is recomputed forward as a pure function of those inputs. Tiny saves, deterministic replay, clean migration. This is locked and correct.

**Lore truth:** the dynasty's single greatest advantage against the Amalgamation is explicitly **the things that were never recorded** — "face-to-face trust, love that costs something, decisions made with no digital record, conversations that happened in tunnels and quiet family moments that never made it to a screen. The most important things about them were never compiled." (GDD v2 §blind spot.)

**The collision:** if the world is a pure function of the LOGGED choices, how do you represent the decisions whose entire meaning is that they left NO log? Naively, everything the player does becomes a record (that's how the save works), which would erase the exact blind spot the whole game hangs on. If it's in the choice log, it was compiled. The Amalgamation, in-fiction, could model it.

---

## THE RESOLUTION: TWO LEDGERS (LOCKED principle, wiring PENDING)

The engine keeps **two distinct kinds of state**, and they are NOT the same ledger:

### 1. THE RECORDED LEDGER — the choice log (what the save stores, what the world computes from)
Public, consequential, world-shaping decisions. Who you allied with, what you built, what you cleared, what mega-projects you ran, faction standings. This is the deterministic input the world is a pure function of. **This is also, in-fiction, exactly what the Amalgamation can see and model** — it monitors the feed, flags anomalies, runs 100 years of analysis. The recorded ledger IS the digital footprint. The save model and the Amalgamation's knowledge are THE SAME DATA by design. That's not a bug, it's thematically perfect: the game's own save file is the thing the antagonist reads.

### 2. THE UNRECORDED LEDGER — off-ledger human state (what the save does NOT store as a compilable record)
The blind-spot decisions: the private family choices, the tunnel conversations, the loyalties built face-to-face. These affect the game, but they must be modeled so that **they are NOT part of the compilable footprint** — the Amalgamation cannot see or predict them, and mechanically they should read as "off the grid."

**How this stays deterministic (the key move):** the unrecorded ledger is STILL deterministic for save/replay purposes (Bohemia never gives up determinism), but it is **tagged as off-ledger** — flagged as the kind of state that, in-fiction, left no digital trace. The engine knows it; the Amalgamation-model inside the engine is DENIED it. Determinism for the save system, invisibility for the antagonist. One flag on a choice: `recorded: true|false`.

---

## WHAT THIS BUYS (why it's worth locking now)

1. **The Amalgamation's knowledge model becomes trivial to build correctly.** Its "what does the enemy know about the player" model = the recorded ledger, nothing else. You never have to hand-decide what it knows; it knows exactly the `recorded:true` choices and none of the `recorded:false` ones. The blind spot is enforced by a flag, not by careful authoring.

2. **The blind spot becomes a MECHANIC, not just flavor.** Off-ledger choices are the ones the Amalgamation can't predict — so the finale (whisper network, truth released simultaneously) literally runs on unrecorded coordination the antagonist never saw coming. The thing that beats it is, mechanically, the ledger it couldn't read. The lore's thesis becomes the engine's win condition.

3. **It tells the player something true without preaching it.** The choices that shape the visible world are the ones the machine sees. The choices made in private, off the record, with people you love, are the ones it can't. **What you do publicly can be modeled. What you do in trust cannot.** The two-ledger split is that life-lesson as architecture.

4. **Save stays tiny and deterministic.** Both ledgers are just choice-log entries; the only addition is a `recorded` boolean per entry. No new subsystem, no world-state bloat. The forward-compute reads both; the antagonist-model reads one.

---

## DESIGN CONSEQUENCES [PENDING — Paolo's calls when systems get built]

- **Which choices are `recorded:false`?** Needs a rule. Candidate: anything done in the tunnels, inside the compound with family/companions, or explicitly off-feed is unrecorded; anything public, feed-touching, or faction-facing is recorded. The feed being mandatory (GDD v2 §clout: "going dark is not an option") means most of the world is recorded BY DEFAULT, and unrecorded is the rare, precious, deliberate exception, which is exactly right.
- **Does the player KNOW which ledger a choice lands on?** Strong candidate: yes, subtly — a private conversation with no feed icon vs a public act that pings the feed. The player learns to feel which choices are "seen." That literacy becomes strategy by Act 3.
- **Can a `recorded:false` choice get accidentally exposed?** A dramatic hook: something meant to be off-ledger gets compiled (a betrayal, a leak, a surveillance drone that shouldn't have been there). That's a threat-escalation event — the Amalgamation suddenly KNOWS something it shouldn't.
- **Clout tension:** going viral accumulates clout (a currency) but clout is maximally recorded and "the Amalgamation watches viral moments most carefully." So the unrecorded ledger and the clout economy are opposite poles: power-via-visibility vs safety-via-invisibility. That's a real strategic axis worth building toward.

---

*BOHEMIA — Recorded vs Unrecorded — 7.1.26*
*The save file and the antagonist read the same ledger. The dynasty wins on the other one. Determinism for the engine, invisibility for the machine, one boolean between them.*
