# BOHEMIA — ADDENDUM: THE FIRST PLAYABLE CANON SIDE QUESTS (LOCKED)
### 7.23.26 — Paolo: "FROM ALL THE QUESTS YOU COMPILED AND EVERYTHING U LEARNED EVEN DIALOGUE WISE CREATE THE BEST BOHEMIA SIDE QUESTS YOU POSSIBLY CAN THE BEST SIDE QUESTS EVER GO." Five playable `.bq` side quests, machine-gated, on the now-fully-wired engine.

---

## WHAT THIS IS
The quest corpus had two things and a gap. It had **53 fully-produced design docs**
(`quests/BOHEMIA_QUEST_###_*.md` — the whole script-to-scene enchilada) and **one
reference `.bq`** (`quests/BOHEMIA_QUEST_SAMPLE_THE_TRIBUNAL.bq.txt`, explicitly "NOT
canon"). The gap: **nothing canon actually PLAYED.** The `.bq` format had a parser
(bohemia_bq.js) and a runtime (bohemia_quest_runtime.js), and this session finished
wiring the loop (factions + economy + CLOUT all landed 7/22-7/23), so for the first
time the engine could actually run a quest end to end. This addendum records the first
five **playable canon side quests**, living in `quests/bq/*.bq`, each proven by a
machine gate.

## THE FIVE (all Tier-2 side, distinct shapes, distinct factions)
1. **S01 — THE METER READER** — economy-as-morality (electricity). TRADES/NETWORK. A
   block browns out nightly; someone skims the shared grid. Brushes the secret: the
   skim runs DOWN toward the water.
2. **S02 — THE SAME CRATE TWICE** — double-agent, reputation-travels. REDS/BLUES. Two
   gangs hire you to move the same crate of batteries; whatever you do, the other side
   hears it and posture shifts both ways.
3. **S03 — ONE MORE SET** — tender release-valve. COLORFUL. A busker's amp dies mid-set;
   the reward is a person, not loot. The warm contrast quest that makes the dark ones land.
4. **S04 — WHAT CRIES IN THE DEEP** — contract, the-monster-is-a-person. HOMELESS/NETWORK.
   The "haunt" in the deep tunnel is a grieving neurolinked person; the bounty reframes as
   mercy or rescue. Brushes the secret hardest (the deep runs down to the water).
5. **S05 — THE STANDING BOUNTY** — repeatable dark grind, creeping-normality. REMNANTS.
   `@ONCE false`. Pays in medicine; the pay scales with how ugly the target is, and the
   pitch gets more reasonable-sounding each run. The clean path pays less — which is what
   makes taking the ugly one a real choice.

## THE LOCKED CRAFT RULES (baked in, gate-enforced)
- **CLOUT is emergent, never a label** (reaffirms the 7/21 lock). The SAME quest completes
  with a different CLOUT tag depending on how loud/dangerous the RESOLUTION was — not a
  number the player picks. Proven end-to-end: S01 resolved quietly scores 8 follower-weight,
  resolved recklessly scores 110 — **~14x more followers for the loud deed**, felt only
  through engagement volume, shown nowhere. This is the mechanical realization of "reckless
  beats quiet" AND of Paolo's correction that the player does not CHOOSE clout: completing
  the quest raises it regardless; only the loudness of HOW varies the amount.
- **No stat/karma gates** — branches gate only on what the player DID (knows/flag/has/role),
  never a rolled number. Enforced by the parser.
- **No hardcoded names** — every character is a `@ROLE` cast at runtime, so a quest survives
  the dynasty turning over.
- **≥1 `@NOVERB` each** — the obvious thing you want to say that the quest will not let you.
- **Systems ARE the mechanic** — the ELECTRICITY/MEDICINE economy and faction posture
  actually move; the resolution changes the world, not a scoreboard.
- **The secret is proximity, not power** (Amalgamation canon) — S01/S04 brush it; going loud
  "down toward the water" sets an unrecorded `looked_under_the_rock` flag the fold can read.
  The other three stay human-scale on purpose; contrast is the weapon.

## THE MACHINE (FACTORY LAW — a law without a gate is not enforced)
`gates/bohemia_canon_quests_gate.js` (registered in `gates/bohemia_gates.py` as **CANON
QUESTS**) proves, for every `quests/bq/*.bq`: parses clean, round-trips lossless, validates
with **zero errors AND zero warnings** (canon bar > format floor), and is **exhaustively
playable** — an explorer walks every reachable option path and confirms at least one reaches
COMPLETE, the runtime never throws, and every terminal stage carries exactly one legal CLOUT
tag. It also loads each quest through the real `Loop.boot(...).quests`. 75/75 green.

## PENDING, PAOLO'S CALL (not decided, not invented)
- WHERE each quest is placed in the world (which NPC, which block) — MAP LAW: Claude only
  plumbs; Paolo places. These cast against ROLES, so they are placement-ready without a map.
- Whether any of these five graduate into the numbered `.md` bible (they are their own
  playable layer for now; the 53 design docs are untouched).
- Tuning: the exact faction/medicine/electricity deltas are placeholder magnitudes, ordering
  locked, numbers tunable.
- Whether the `looked_under_the_rock` unrecorded flag should trigger a real Amalgamation
  escalation beat later (canon supports it; not built).

---
*BOHEMIA — The First Playable Canon Side Quests — 7.23.26*
*Fifty-three of them were written. Now five of them can actually be played.*
