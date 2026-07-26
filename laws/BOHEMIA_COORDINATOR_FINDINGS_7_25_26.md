# BOHEMIA — COORDINATOR DEEP FINDINGS (7/25/26)

Read-only coordinator work. No game code touched, nothing on main. Companion to
laws/BOHEMIA_COORDINATOR_ARCHITECTURE_MAP.md. Everything here is a FINDING or a
DRAFT for Paolo — never a decision, never a dispatch.

=============================================================================
## HEADLINE FINDING: the whole playable-quest + lore system is STRANDED
=============================================================================
The lore/quest lane (branch claude/bohemia-quest-log-access) shares NO git ancestor
with main — two separate histories (quest root = the original 7/16 upload; main was
re-rooted ~7/21). Verified 7/25. Consequences, confirmed at the file level:

- The SHIPPED game (main) has the `.bq` quest PARSER (engine/bohemia_bq.js) but:
  * ZERO authored playable quests (no quests/bq/*.bq on main),
  * NO quest RUNTIME (engine/bohemia_quest_runtime.js exists only on the quest lane),
  * NO canon-quests gate.
  So main can parse a quest format it has no quests for and cannot play.
- ALL of this lives only on the stranded lane: 9 playable, gate-proven side quests
  (S01–S09), the quest runtime, the CLOUT scoring, the feed/social/profile/ledger
  loop subsystems, the canon-quests gate (134/134), and ~25 locked lore addenda
  (Marco + post-wall daughter reveal, the cold open / stolen power station, the
  smart-cart three-act companion, the flash-flood demo climax, "Act-1 Amalgamation
  is a ghost," emerging-tech). This is the game's STORY and its entire quest
  capability, and it cannot fast/clean-merge as-is.

WHY THIS MATTERS DOUBLE: the stranded lane already embodies the single biggest
architecture upgrade the outside-RPG research pointed to — QUESTS AS VALIDATED DATA.
Its .bq files are declarative quest records; bohemia_quest_runtime.js is the small
interpreter; gates/bohemia_canon_quests_gate.js is the reachability/validation gate
(every quest parses clean, validates zero-errors/zero-warnings, and plays
exhaustively to COMPLETE). That is exactly the Bethesda-stages / Larian-Osiris /
"reachability gate" pattern. So the highest-leverage move for the whole project is
NOT to build quests-as-data fresh on main — it already exists — it is to RECONCILE
the lane so main finally gets it. Right now the best-architected system in the repo
is the one the players will never see.

=============================================================================
## THE RECONCILE PLAN (a plan — NOT for the coordinator to execute)
=============================================================================
This is real engine work; it belongs to ONE dedicated session on a branch, fully
gated, NOT to any lane casually and NOT to the coordinator. The shape:

BASE = main. Main holds the NEWER shared infrastructure (the whole city/combat/
district/hero/music build, and a newer world-model loop.js with territory AI +
real-overmap boot). The quest lane's copies of overmap/blockgen/graphics/
markings-tools are the OLDER 7/16-era versions — DO NOT take them; keep main's.

STEP 1 — ADDITIVE PORTS (near-zero conflict; these files don't exist on main):
  - quests/bq/S01..S09 + README  (the 9 playable quests)
  - engine/bohemia_quest_runtime.js (+ its tests) and the loop-subsystem test files
    (feed/clout/channel/ledger/profile/quests/slice/talk/entities)
  - gates/bohemia_canon_quests_gate.js
  - the ~25 laws/ lore addenda + the questbook/ research corpus
  Caveat: the runtime + tests DEPEND on the quest lane's social/quest additions to
  loop.js, so Step 1 is not truly standalone — it lands with Step 2.

STEP 2 — THE ONE HARD ARTIFACT: engine/bohemia_loop.js (main 635 lines vs quest 957).
  Main's loop.js = territory AI + real-world boot + real adjacency + the LOCKED
  pacing ruling (advanceRound stays rare + quest-gated). The quest lane's loop.js =
  the whole quest/social layer (BQ/BQRT wiring, CLOUT_TAGS/WEIGHTS scoring, the feed,
  social profile, ledger, quest-acquisition channels). RECONCILE = take main's newer
  world-model foundation as the base and RE-APPLY the quest lane's additive
  subsystems on top of it. Hand-port, do not auto-merge.

STEP 3 — REGISTRY UNIONS (both histories edited these; union, don't overwrite):
  - gates/bohemia_gates.py — register CANON QUESTS (and reconcile the music gate:
    main ships music_gate.JS, the quest lane has music_gate.PY — resolve which is canon).
  - gates/bohemia_graveyard.txt, bohemia_superseded.txt, bohemia_sync_canon.txt —
    union the lines.
  - gates/bohemia_loop_gate.js and gates/questbook_gate.py — reconcile (both diverged).

STEP 4 — DROP the stale duplicates the quest lane carries (overmap, blockgen,
  graphics engine + master + tests, the marking/bake/lamp tools, and the stray
  committed .pyc). Verify no quest content depends on old overmap behavior.

STEP 5 — GATE IT: full suite green (main's gates + the newly-registered CANON QUESTS),
  and verify the 9 quests still play to COMPLETE on the reconciled loop. Then it ships
  the normal way (merge to main). After this, main HAS a story.

=============================================================================
## COLLISION THIS REVEALS (the coordinator-catch)
=============================================================================
Both histories INDEPENDENTLY wired Factions + Economy into the loop boot context —
main via the world-model lane ("Master loop gate fixed: factions/economy/entities
wired"), the quest lane via "Wire Factions + Economy engines into the loop's boot
context." Two sessions solved the same wiring on two invisible-to-each-other
histories, differently. This is the exact ONE-SYSTEM-ONE-SESSION failure the
coordinator role exists to surface — it could not have been caught from inside
either lane. The reconcile must pick ONE of the two wirings, not blend both.

=============================================================================
## DISPATCH-READY PROMPT MENU (drafts only — Paolo picks + fires; I never send)
=============================================================================
Each pulled from that lane's OWN recorded NEXT notes, plumbed with the exact
files/tools/gates from the architecture map so the receiving lane can't fuck up the
sync. Voice matched to how Paolo talks to each lane. NONE invented — all trace to a
real handoff note.

--- PROMPT A · THE RECONCILE (highest leverage; a NEW dedicated session, world-model
    lane's territory since it owns loop.js on main) ---
"You're the quest-reconcile session. The whole playable quest system + all the lore
is stranded on a separate git history (branch claude/bohemia-quest-log-access) that
shares no ancestor with main — main has zero playable quests right now. Get it onto
main WITHOUT breaking anything. Base is main (it has the newer city/combat/loop). Port
the additive stuff clean (the 9 quests/bq/*.bq, engine/bohemia_quest_runtime.js + its
tests, gates/bohemia_canon_quests_gate.js, the lore addenda + questbook). The ONE hard
file is engine/bohemia_loop.js — take MAIN's version (territory AI + real-world boot +
the locked quest-gated pacing ruling) as the base and re-apply the quest lane's
quest/social/CLOUT subsystems on top; hand-port, never auto-merge. Union the registries
(bohemia_gates.py register CANON QUESTS, reconcile music_gate .js-vs-.py, union
graveyard/superseded/sync_canon). Drop the quest lane's STALE overmap/blockgen/graphics/
tools copies — keep main's. Then full gate suite green AND prove all 9 quests still play
to COMPLETE on the reconciled loop before you ship. Read
laws/BOHEMIA_COORDINATOR_FINDINGS_7_25_26.md for the full step-by-step."

--- PROMPT B · LIFE/CITY lane (from NEXT notes: more Pocket-City district types;
    mark/zoom landmarks) ---
"Keep building out the city. Two open threads from your own notes: (1) the Pocket-City
district types Bohemia still has no equivalent for — resort/casino/strip aside (that's
my hand-crafted territory), the civic/leisure ones like a real zoo/aquarium or campus
if they fit the dead Vegas world; each on the DISTRICT KIT, gated, dossier'd, walkable-
land compliant, married on the existing generic district-art path (zero new pixels —
reuse the house-skin bank). (2) mark/zoom the real landmarks on the map. Full new-
district touchpoint list is in the architecture map (overmap enum, world DISTGEN,
tilespec + gate, map_tab.py re-sync, district_registry, taxonomy). Run bohemia_map_tab.py
after and confirm map_tab_gate + the new district gate green."

--- PROMPT C · CHARACTER/SOUND lane (quiet since 7/24; from NEXT: clothing new-SHAPES
    waves, the locked woman rig, combat sound pass) ---
"Back on characters. From your own open threads: keep the clothing waves coming but
STRUCTURE not color — new garment SHAPES/silhouettes (structure_gate locks recolors
out of counting as progress), and the woman rig is ruled and ready to build on your go
(laws/BOHEMIA_ADDENDUM_WOMAN_RIG_7_21_26.md). If you touch anything that bakes into
COMBAT_B64, decode FRESH from HEAD (parallel combat sessions live in that same blob),
re-encode, run the FULL gate suite — never a spot check."

--- PROMPT D · COMBAT lane (from NEXT: graduate the winning combat grammar once
    thumbed; the movement toolkit is in) ---
"Combat's in a good spot (mobility toolkit + time-of-day shuffle shipped). Your own
NEXT is graduating the winning combat grammar once I've thumbed it — surface the
candidates for a verdict, then build the winner into the real dial. Everything you edit
lives in COMBAT_B64: decode fresh from HEAD, re-encode, run the full combat gate stack
(combat_lab/pool/anim/herobeat) AND look at the real rendered combat, not just the gate
numbers."

Note on WHO gets the reconcile: it is loop.js territory, which the world-model lane
owns on main. Giving it to a fresh dedicated session (Prompt A) keeps the other lanes
un-blocked and honors ONE-SYSTEM-ONE-SESSION on loop.js.

=============================================================================
## LIVE BUILD HEALTH (full gate suite, this session)
=============================================================================
Ran the full suite (--fast) against HEAD of main, 7/25. RESULT: the entire build
is GREEN across every lane's merged work. Representative greens: every district
gate, COMBAT 173/0, LOOP 36/0, CITY TAB 62/0 (byte-locks intact), MAP TAB 8/0 (44
embedded modules byte-locked), LIFE 24/0, DRESS 43/0 (195 canon items), STRUCTURE
125/0, HERO WIRE 35/0 (15 districts), QUESTBOOK 129/0, REUSE FIRST 20/0.
The suite first reported 4 FAILs (HOUSE ART, ASSET ROUNDUP, DOOR ART, ART 45) — ALL
were ModuleNotFoundError (PIL/numpy) from THIS coordinator container lacking the
image libraries, NOT code regressions. After `pip install pillow numpy` all four
re-ran GREEN (24/0, 10/0, 11/0, 8/0). The two slow pixel sweeps (LEAF PIXEL, PURITY)
were --fast-skipped, not run. The gate run touched no game files (tree stayed clean).
BOTTOM LINE: main is fully green; nothing is stuck or red. A clean report is the
finding.
