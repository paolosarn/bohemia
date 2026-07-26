# 000_START_HERE — GITHUB LAUNCH HANDOFF — 7/16/26
Named with the 000_ prefix so it sorts to the TOP of the repo, always findable first.

=== BOHEMIA HANDOFF 7/16/26 ===

## WHERE WE ARE
Bohemia is moving to ONE PERMANENT HOME: a GitHub repo seeded from BOHEMIA_MASTER_part1-3_of_3.zip.
The seed is the union of: the full archive (186 files), all project canon (92 files), and this chat's
questbook sprint (27 new + 41 updated). 312 files total, manifest-verified, zero missing, zero mismatched.
This chat was the QUESTBOOK RESEARCH sprint: FORMAT LAW v2 locked, the whole backfill queue closed
(42/42 flow files upgraded to CAST + CONVERSATION NODE TREES + BRANCH MAP), then 12 fresh individual-quest
mines (#127-#138). Corpus now: 138 deep-dive files, 54 individual quests at full v2 depth, 3,420 extracted
findings, all machine-searchable.

## LAUNCH CHAT: FIRST ACTIONS
1. Unzip all three parts into the repo root. Verify: `md5sum -c _MANIFEST.md5.txt` (312 files must pass).
2. Read CLAUDE.md. Its TRUTH HIERARCHY governs every future merge. Read bohemia_superseded.txt.
3. git init, commit everything as "BOHEMIA SEED 7/16/26", push. The repo is the memory from then on.
4. Regenerate canon map any time files change: `python3 bohemia_canon_index.py .`
5. Rebuild carry parts at any wrap: `python3 bohemia_master.py --parts` (fails hard if html count is zero,
   prints by-extension proof). Chunk oversized repos with `python3 bohemia_chunk.py split FILE`.

## ACTIVE FILES (entry points)
- CLAUDE.md (operating manual + truth hierarchy)
- BOHEMIA_GDD_v5.md (game bible) + all ADDENDUM files (amendments by date)
- BOHEMIA_QUESTBOOK_MASTER_INDEX_7_16_26.md (research state) -> BOHEMIA_QUESTBOOK_ARCHIVE.html (search all findings)
- BOHEMIA_CRAFT/FLAWS/PORTS/CONVERSATIONS_MASTER_7_16_26.txt (extraction repos; PORTS = the build queue)
- bohemia_bq.js + bohemia_bq_tests.js (29/29) + BOHEMIA_QUEST_LAB.html + BOHEMIA_QUEST_SAMPLE_THE_TRIBUNAL.bq.txt
- BOHEMIA_ALPHA_0_9.html (the one alpha) + bohemia_engine.js + bohemia_tests.js (80 checks)
- BOHEMIA_GRAPHICS_LAWS_MASTER + GRAPHICS_ENGINE_MASTER + bohemia_purity_gate.py

## LAST DECISIONS LOCKED (this chat)
- FORMAT LAW v2: every quest file carries CAST + WHAT EACH WANTS, CONVERSATIONS as node trees
  (gates/TRAPs/SILENCE/NOVERBs), BRANCH MAP with counts. Gate: exactly 10 W-points, >0 option lines, END marker.
- .bq FORMAT: plain-text quest format, roles cast at runtime (Bethesda alias model), STAT/KARMA GATES
  BANNED AT PARSER LEVEL. Validator: alias-fill, orphans, dead links, named-body zero-loot, round-trip.
- Target RAISED: >90 individual quests at v2 before master compile. Currently 54.
- Law locks staged for compile (confirmation counts in the index): COMPREHENSION IS A BRANCH (11x);
  AUTHOR-CANNOT-DELEGATE + HEIR-CANNOT-DELEGATE (one law); ABSENT-PARTY DECISION (3x); RESCUE-DENIAL
  register (4 instruments); truth-delivery grid (unasked/begged-against/pre-authorized); honest-devil set
  (buys/collects/exchanges/hosts/dominates); exit-design theory (last/first/no-exit); THE FINALE IS A
  LEDGER-READ (theater Q136 + arithmetic Q137 + rooftop Q102); persuasion trilogy (deserved/written/midwifed);
  HELP DECLARED IS HELP DENIED + verbs-removed-for-the-hearer; NO KARMA BAR (4-leg proof); reward-flat forks
  or the gradient is the point; @REDLINE companions; lures need ledgers; singleton registry (one Strange-Man,
  one Papyrus-class, one Sheogorath-class per game).

## IN FLIGHT
- Fresh mining continues from the ~72 whole-game teardowns in the pool. Queue: Witcher contracts, Kenshi
  second story, Sunless Sea, Spec Ops white phosphorus, Undertale Sans, Obra Dinn, Mask of the Betrayer,
  Tyranny, SH2 Eddie, Vampyr citizen-webs, Shivering Isles, Vaermina, Pamela-sibling files (Sharp/Flat, Ikana suite).
- Engine backlog with named test: THE SETTLEMENT'S MISSING-PERSONS ORGAN (demanded by Q133/Q134/Q138) +
  vigilant-order response states. Also: generational audit engine (Q137 PORT 1), Fold ledger-view (Q136 PORT 1).

## OPEN FORKS PENDING PAOLO
- Which relationships gate which arc (Liberate/Respect/Become as three ledgers, Q102/Q136 model)
- Amalgamation mindscape-therapy centerpiece (Q135 PORT 1) and Glarthir-at-scale Act 2 spine (Q130 PORT 5)
- The Emil/Halua origin-grammar for the Amalgamation's center (Q124) — entirely Paolo's
- Whether Bohemia stages a betrayal-in-loyalty's-UI quest at all (Q131 PORT 3)
- Does anyone discover the SOMA-truth on-screen in 100 years (Q115)
- Production quests 046-053 + master compile: PARKED until Paolo says go
- Plus the standing pre-chat forks: act-1 grid-power ruling, ragdoll head/neck, multi-enemy dial model,
  pinch-zoom R=26 cap, perks system, female/child rigs

## DO NOT LOSE
- The 12 fresh mines (#127-#138) and all 42 v2 backfills are IN THE PARTS. The archive HTML is the search tool.
- bohemia_superseded.txt is registry-not-deletion: GDD v2-v4, #40-as-primary, early #79, pre-v2 copies.
- HD TILE REPOS ARE NOT IN THIS SEED. They live in the Bohemia Graphics project (4 x ~45MB). When they
  reach the repo, split with bohemia_chunk.py; they travel separately from parts. ONE-ALPHA LAW holds.
- Zero-dialogue-by-design registry (never "fix"): #99 #104 #110 #114.

## PASTE-ME FIRST LINE (for the launch chat)
"BOHEMIA GITHUB LAUNCH: I'm uploading BOHEMIA_MASTER_part1-3_of_3.zip. Unzip all three into the repo root,
run md5sum -c _MANIFEST.md5.txt (312 files must pass), read CLAUDE.md and 000_START_HERE_LAUNCH_HANDOFF_7_16_26.md,
then git init and commit as BOHEMIA SEED 7/16/26."
=== END HANDOFF ===
