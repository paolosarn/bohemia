# quests/bq — THE PLAYABLE CANON QUEST LAYER

This directory holds **playable `.bq` machine files** — the quests that actually RUN
in the engine (BQ parser -> BQRuntime -> the live loop's `ctx.quests`), as opposed to
the `../BOHEMIA_QUEST_###_*.md` **design docs** (the 53 fully-produced script-to-scene
teardowns). The `.md` layer is the WHAT; this `.bq` layer is the PLAYS-RIGHT-NOW.

Until this batch, the only `.bq` in the repo was `../BOHEMIA_QUEST_SAMPLE_THE_TRIBUNAL.bq.txt`,
explicitly marked "reference sample, NOT canon." These files are the first canon quests
that are genuinely playable end-to-end on the now-fully-wired engine (factions + economy
+ CLOUT all landed this session).

## THE BAR (enforced by gates/bohemia_canon_quests_gate.js — gate: CANON QUESTS)
Every file here must:
1. parse with no garbled/unrecognized lines,
2. round-trip lossless,
3. validate with **zero errors AND zero warnings** (canon holds a higher bar than the
   format floor — a warning is a defect for a shipped quest),
4. be exhaustively PLAYABLE: the gate walks every reachable option path and proves at
   least one reaches COMPLETE, the runtime never throws, and every terminal stage
   carries exactly one legal CLOUT tag,
5. load and start through the real `Loop.boot(...).quests`.

## THE CRAFT RULES BAKED IN (from the questbook research + the format's own laws)
- **No stat/karma gates, ever** — the parser bans them; branches gate only on
  knows/flag/has/role (things the player DID), never on a number they rolled.
- **No hardcoded names** — everyone is a `@ROLE`, cast at runtime against whoever
  exists, so a quest survives the dynasty turning over.
- **≥1 `@NOVERB`** per quest — the obvious thing you want to say that the quest
  deliberately will not let you say.
- **CLOUT is emergent, never a label** (Paolo 7/21): the SAME quest completes with a
  different CLOUT tag depending on how LOUD/dangerous your resolution was — quiet fix
  `#quiet`, public win `#notable`, dangerous confrontation `#risky`, loud spectacle
  `#reckless`. The player never picks a clout number; the deed's loudness sets it, and
  the feed's follower math (Loop.defaultFollowerScore) reads it. A reckless finish
  earns ~14x the followers of a quiet one — felt only through engagement, never shown.
- **Systems ARE the mechanic**, not flavor — the ELECTRICITY/MEDICINE economy and
  faction posture actually shift; the resolution changes the world, not a score.

## THE BATCH
| file | shape | factions | CLOUT endings |
|------|-------|----------|---------------|
| S01 THE METER READER | economy-as-morality (electricity) | TRADES / NETWORK | quiet / notable / reckless (+ quiet FAIL) |
| S02 THE SAME CRATE TWICE | double-agent, reputation-travels | REDS / BLUES | notable / risky / reckless (+ quiet FAIL) |
| S03 ONE MORE SET | tender release-valve (performer) | COLORFUL | quiet / notable / risky (+ quiet FAIL) |
| S04 WHAT CRIES IN THE DEEP | contract, the-monster-is-a-person | HOMELESS / NETWORK | quiet / reckless / risky (+ quiet FAIL) |
| S05 THE STANDING BOUNTY | repeatable dark grind (creeping-normality) | REMNANTS | risky / reckless (+ quiet FAIL) — `@ONCE false` |

S01 and S04 deliberately BRUSH the Amalgamation secret (the skim / the crying both run
DOWN toward the water) so the danger is PROXIMITY, not strength — going loud down there
sets an unrecorded `looked_under_the_rock` flag. The other three are human-scale on
purpose: contrast is what makes the dread quests land.
