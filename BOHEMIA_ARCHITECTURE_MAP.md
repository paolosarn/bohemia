# BOHEMIA — ARCHITECTURE MAP (what depends on what)
Built 7/16/26 at the GREAT MERGE. Regenerate the file list with
`python3 bohemia_canon_index.py .`; this file is the human map above it.

## THE ONE RULE FOR READING THIS
Nothing in this repo knows anything automatically. Truth is BUILT, in this order,
and CLAUDE.md's TRUTH HIERARCHY is the law:
CLAUDE.md -> GDD v5 + LAWS MASTERS + STATE OF PLAY -> addenda (NEWEST DATE WINS,
map = BOHEMIA_CANON_INDEX.md) -> /archive (history, never current).
A contradiction between two LIVE files is a BUG, not a judgment call.

---

# 1. THE SPINE (read in this exact order, every session)

    CLAUDE.md                          how to work. laws in brief. truth hierarchy.
      └─> 00_START_HERE_NEXT_SESSION.md   the ONE handoff. live state. rewritten every session.
            └─> BOHEMIA_CANON_INDEX.md      the newest-date-wins map. consult BEFORE citing any addendum.
                  └─> BOHEMIA_STATE_OF_PLAY_7_16_26.md   what is done / in flight / pending Paolo

## THE GDD LINEAGE — ALL FOUR ARE LIVE. THIS IS NOT NEGOTIABLE.
v5 does NOT replace v2/v3/v4. It EXTENDS them, and its own opening line says so.
Each version is the SOLE home of load-bearing canon:

    BOHEMIA_GDD_v2.md   THE LORE FOUNDATION. The only home of:
                        the three-dynasty ~100-year arc ("dynasty": v2=32, v5=0)
                        data portraits -> the Amalgamation's origin (v5=0)
                        Project Angel · The Crypto Collapse · The Mars and Moon Factor
                        Neuralink · Dubai The Warning City · The Fifth Dimensional Element
                        The Network's true structure vs what they present as
    BOHEMIA_GDD_v3.md   THE DIAL CORE + THE ENDGAME. The only home of:
                        the 52 patterns · the five difficulty packages · the killshot (v5=0)
                        The Nuke, the clock, and the last moral choice
                        The Three-Generation Device · Bohemia Is the Only Free City
                        Proc-gen vs the fixed servers (reconciled)
    BOHEMIA_GDD_v4.md   TIME, PERSISTENCE, THE FOLD. The only home of:
                        the fold (v4=25, v5=10) · succession · the character stack
                        Bunkerguy (v5=0) · engine laws through 7/2
    BOHEMIA_GDD_v5.md   7/3 through 7/6: valley scale, the overmap, the survival
                        economy, 120 BPM Request Law, vehicles, Factory Law.

GATE: `node gdd_gate.js` (26 checks, runs FIRST in bohemia_gates.py). It fails if
any of the four is archived, if the sole-home terms go missing, if v5 stops
declaring itself an extension, or if the registry ever re-adds the false claim.

WHY THE GATE EXISTS: at the 7/16 merge, TWO inherited registries both said
"GDD v2/v3/v4 superseded by v5." Both were wrong. Archiving on that claim would
have removed the antagonist and the ending from the live corpus. It was caught
only because Paolo asked whether the GDDs had been read. They had not.
THE RULE: a registry line is a CLAIM, not evidence. Verify supersession by
READING BOTH DOCUMENTS. Never by assertion, never by the date in a filename.

FILENAME LAW: the handoff is ALWAYS `00_START_HERE_NEXT_SESSION.md`. One only.
It sorts to the top so it cannot be missed. Git history is the archive of old ones.

---

# 2. THE TWO ENGINES (they are separate, do not confuse them)

## 2a. GAME ENGINE — the alpha's brain
    bohemia_engine.js  (12 modules, 281KB, the big one)
      ├─ bohemia_scheduler.js       120 BPM LAW. BEAT=0.5s. everything quantizes.
      ├─ bohemia_loop.js            I-MOVE-YOU-MOVE master loop
      │    └─ needs: bohemia_engine.js + bohemia_scheduler.js
      ├─ bohemia_overmap.js         valley scale, districts
      └─ BOHEMIA_faction_graph.json 13 factions, the relationship graph

    TESTS:  bohemia_tests.js       (80 checks) -> requires bohemia_engine.js
            bohemia_loop_gate.js               -> requires engine + scheduler + loop + faction_graph

    CONSUMES: BOHEMIA_ALPHA_0_9.html (31MB, the ONE alpha, stale, absorption pending)

## 2b. GRAPHICS ENGINE — the world's body (14 modules)
    bohemia_engine_graphics_7_14_26.js    the core
      ├─ bohemia_tilepool.js         TAN WALL 85/15 lives here. tile selection.
      ├─ bohemia_blockgen.js         street/block anatomy. SIDEWALK + LINE COLOR live here.
      │     └─ consumes: BOHEMIA_STREET_ANATOMY_POOL, BOHEMIA_STREET_POOLS_HARMONIZED
      ├─ bohemia_plotgen.js          CELL IS PLOT. walled suburbs.
      ├─ bohemia_powergrid.js        CLUSTERED POWER. 12% lit. circuits decide.
      ├─ bohemia_light_registry.js   dark is default. reads ACT1_LIGHT_SOURCES_v5.
      │     └─ consumes: BOHEMIA_ACT1_LIGHT_SOURCES_v5_7_16_26.txt  (v1 is DEAD, see registry)
      ├─ bohemia_light_pass.js       the render-time lighting pass
      ├─ bohemia_patrol.js           owners walk what they light. nobody patrols the dark.
      │     └─ needs: bohemia_blockgen.js + bohemia_powergrid.js
      ├─ bohemia_daycycle.js         world clock
      ├─ bohemia_transitions.js      tile-to-tile seams
      ├─ bohemia_prop_scale.js       ITEM SCALE LAW resolver v2. 848 flags.
      ├─ bohemia_slice_core.js  +  bohemia_slice_engine.js    the live slice runtime
      ├─ BOHEMIA_AGENT_LOOK / AGENT_RAGS / SKIN_PALETTES_WORLD    agent paint
      └─ bohemia_overmap_bridge.js   graphics <-> overmap

    BUNDLE: BOHEMIA_GRAPHICS_ENGINE_MASTER_7_16_26.js
      This is a REFERENCE COPY of all 14 modules concatenated with per-module md5s.
      ENGINE SYNC LAW: the standalone .js files are CANONICAL. The bundle is a copy.
      If they drift, the standalone wins and the bundle gets rebuilt. The sync gate
      catches drift. (It caught 2 drifted modules at the merge: tests + prop_scale.)

    LIVE SLICE: BOHEMIA_LIVE_SLICE_V11_7_16_26.html   <- the playable graphics slice
      V9 = its blessed art base (Paolo-approved). V2-V8, V10 = superseded.
      V11 is W=24 H=63. VERIFY ITS OWN BAKE HEIGHT before placing anything on it.
      (The dead chat's LT0 patch used V8's H=62 against V9's H=60 bake. Do not repeat.)

---

# 3. THE GATES — a law without a machine gate is not enforced

    python3 bohemia_gates.py            everything, ~20s
    python3 bohemia_gates.py --fast     skips the two pixel sweeps

    GATE            GUARDS                              READS
    ─────────────── ─────────────────────────────────── ──────────────────────────
    ENGINE SYNC     no module has two bodies            bohemia_sync_canon.txt
                                                        bohemia_sync_ignore.txt
    (GDD LINEAGE and CARRY run FIRST, before anything else)
    GRAVEYARD       dead things stay dead               bohemia_graveyard.txt
    ENGINE TESTS    the graphics engine itself (105)    graphics_tests -> engine+tilepool
    SIDEWALK        sidewalk sanctity (17)              sidewalk_gate -> blockgen
    LINE COLOR      yellow=direction white=lane (18)    line_gate -> blockgen
    TAN WALL        85/15 tan, weather-independent (12) tan_gate -> tilepool
    ITEM SCALE      848 flags resolve (12)              scale_gate -> prop_scale
    LIGHT REGISTRY  dark default, circuits decide (25)  lightreg_gate -> light_registry
    PATROL          owners patrol what they light (28)  patrol_gate -> patrol+blockgen+powergrid
    SLICE V11       occupancy, beat, world clock (13)   test_v11 -> slice_engine
    LEAF PIXEL      structure frozen in every clip (95) bohemia_leaf_gate.py
    PURITY          purple is the Amalgamation alone    bohemia_purity_gate.py + purity_allow.txt

    GDD LINEAGE     v2/v3/v4 LIVE, v5 extends (26)      gdd_gate.js
    CARRY           the registry never eats a live file  carry_gate.py

    BUNDLE          the bundle never lies about md5s (16) bundle_gate.js

    STATUS AT MERGE: ALL GREEN. 15 gates, 359 checks, ~22s.

    THE LAW: new law = new gate, SAME TURN. Proven 7/16 when nine gates were built
    and six supposedly-locked laws turned out to be already broken.

---

# 4. THE QUEST TRACKS (two, never confuse them)

## 4a. RESEARCH — teardowns of OTHER games
    BOHEMIA_QUESTBOOK_MASTER_INDEX_7_16_26.md      THE ENTRY POINT. read first.
      ├─ BOHEMIA_QUESTBOOK_01..138_*.md            138 deep-dives
      ├─ BOHEMIA_QUESTBOOK_ARCHIVE.html            search all 3,420 findings
      ├─ BOHEMIA_QUESTBOOK_FORMAT_LAW_7_16_26.md   v2: CAST + NODE TREES + BRANCH MAP
      ├─ BOHEMIA_QUESTBOOK_BATCH_LAW_7_16_26.md
      └─ BOHEMIA_QUESTBOOK_GAP_MATRIX_7_16_26.txt
    EXTRACTION REPOS (what the research is FOR):
      BOHEMIA_CRAFT_MASTER   / FLAWS_MASTER / CONVERSATIONS_MASTER / PORTS_MASTER
      PORTS_MASTER = THE BUILD QUEUE. That is the one that turns research into game.
    TARGET: >90 individual quests at v2 depth before master compile. Currently 54.

## 4b. PRODUCTION — Bohemia's OWN quests. PARKED until Paolo says go.
    BOHEMIA_QUEST_001..053_*.md   53 quests, 132,215 words
    BOHEMIA_QUEST_VAULT.md + BOHEMIA_QUEST_BIBLE_INDEX.md + QUEST_PRODUCTION_LAW
    NEVER fold this track into the questbook compile. It is not research.

## 4c. THE .bq FORMAT — how a quest becomes code
    bohemia_bq.js                       the parser. roles cast at runtime (Bethesda alias model).
      └─ bohemia_bq_tests.js            29/29
    BOHEMIA_QUEST_LAB.html              the authoring surface
    BOHEMIA_QUEST_SAMPLE_THE_TRIBUNAL.bq.txt    the reference quest
    HARD RULE: STAT/KARMA GATES ARE BANNED AT PARSER LEVEL. NO KARMA BAR (4-leg proof).

---

# 5. THE ART PIPELINE

    HD TILE REPOS (4 x ~45MB) -> travel as .chunk sets, NOT inside the master parts
      python3 bohemia_chunk.py split FILE     -> chunks + .chunkmanifest.txt
      python3 bohemia_chunk.py join  FILE     -> md5-verified reassembly
      Why: GitHub's WEB UPLOAD door caps at 25MB/file. Inside the repo, 100MB is fine.

    BANKS (.txt = the record. the proof .html was the one-time judging surface.)
      DOOR_ANIM_BANK (27 clips) / FIRE_FLICKER_BANK (34 loops) / PARTICLE_LOOP_BANK
      HOUSE_FACTORY_BANK / PERIMETER_WALL_POOL / ROOF_KIT / GROUND+WALL+WATER seamless sets
      TILECAT_* (7 color categories) / DEMO_PROP_POOL / LAMP_DARK_VARIANTS

    VERDICT FLOW: interactive HTML tool (SUN MODE, tap thumbs, comments at bottom,
    export .txt never .json) -> verdicts land in /records SAME TURN -> approval
    unlocks volume -> rejects go to the graveyard with a post-mortem.

    LIVE TOOLS AWAITING PAOLO: BOHEMIA_WALL_PICKER_BATCH2 (48 candidates, needs thumbs)

---

# 6. THE MERGE THAT MADE THIS FILE (7/16/26)

Two chats each built a "complete" seed. NEITHER WAS WHOLE:
  - graphics seed: 318 files. All gates/slices/engines/banks. ZERO questbook.
  - questbook seed: 312 files. All 138 dives + 53 quests. ZERO graphics era.
  - 11 shared files CONFLICTED. Resolved by content, not by filename date:
      graphics copy won 10 (the questbook seed carried STUB tooling and a laws
      master still teaching the DEAD SKIN_TONES_HOMELESS palette)
      questbook copy won 1 (its questbook index was newer: 126 dives vs 124)
      the uploaded CLAUDE.md won over both (it adds THE HANDOFF FILE law)

THREE REAL BUGS FOUND AND FIXED AT THE MERGE (not path noise, actual rot):
  1. Chat-era absolute paths (`/mnt/user-data/outputs/...`) hardcoded in the
     graphics tests. Dead the instant the repo exists. -> repo-relative.
  2. lightreg_gate.js read BOHEMIA_ACT1_LIGHT_SOURCES_7_13_26.txt, a file its OWN
     superseded registry declared dead. -> reads v5.
  3. The lightreg purity test asserted a literal (firewood radius===4) to prove
     normalize() didn't mutate its input. But v5 baked UNLIT FUEL LAW into the
     source data, so the stack ships as radius 0 / type fuel. The law was applied
     twice, once in data, once in code, and the gate caught it. The assertion is
     now registry-agnostic: snapshot the source, run normalize, compare. It will
     survive v6, v7, and every registry after.
  4. ENGINE SYNC drift: bohemia_graphics_tests.js and bohemia_prop_scale.js had
     two bodies each (bundle vs standalone). Standalone were newer (prop_scale v2).
     Bundle rebuilt from canonical standalone. Zero drift now.

NOTHING WAS DELETED. Everything superseded is in /archive with a registry line.
