=== BOHEMIA HANDOFF 7/17/26 (REPO BORN) ===
FILENAME LAW: this file is always named 00_START_HERE_NEXT_SESSION.md, lives at
repo root, sorts to the top of every file list, and is REWRITTEN at the end of
every working session. There is only ever ONE. It is the first thing any
session reads after CLAUDE.md.

READ ORDER: CLAUDE.md -> this file -> BOHEMIA_ARCHITECTURE_MAP.md (what depends
on what) -> BOHEMIA_CANON_INDEX.md (newest-date-wins map) -> STATE_OF_PLAY.

## WHERE WE ARE
THE REPO IS BORN (7/17/26). The master seed landed via 4 part zips + chunk
sets, every delivered file md5-verified against _MANIFEST.md5.txt, the HD tile
repos and the alpha rejoined byte-exact from chunks, and the flat pile is now
a real layout:

  /engine     game + graphics engine .js, tests, bundle, faction/region json
  /gates      every gate + every registry (graveyard, superseded, sync canon,
              purity allow, light sources v5) + canon index generator
  /laws       GDD v2-v5, STATE_OF_PLAY, all addenda, laws masters
  /banks      cooked art banks, verdict banks, tile repos (HD parts 1-4 live
              here, joined; they no longer travel as chunks)
  /slices     BOHEMIA_ALPHA_0_9.html (the ONE alpha) + LIVE_SLICE_V9
  /tools      chunk/intake/master/split tools, QUEST_LAB, PIPELINE_STATUS
  /records    csv records, audits, proposals
  /questbook  the 138 research dives + index + format/batch laws + gap matrix
  /quests     production quests 001-053 + vault index + .bq sample (PARKED)
  /archive    superseded files, ARCHIVE_ prefix dropped (the folder IS the tag)
  root        CLAUDE.md, this file, ARCHITECTURE_MAP, CANON_INDEX, _MANIFEST

ALL GATES GREEN at handoff: 15 gates, ~30s, every gate path repo-aware.
  python3 gates/bohemia_gates.py          (everything)
  python3 gates/bohemia_gates.py --fast   (skips the two pixel sweeps)

## THE MISSING 54 (THE ZIP INCIDENT, THIRD BITE. READ THIS FIRST.)
The manifest promises 534 files. The four part zips delivered 480. 54 files
listed in _MANIFEST.md5.txt never made it into any zip, and they include
LOAD-BEARING pieces: bohemia_engine.js (the game engine itself),
BOHEMIA_GRAPHICS_LAWS_MASTER_7_16_26.md, BOHEMIA_LIVE_SLICE_V11 (the live
slice), PORTS_MASTER (the build queue), CRAFT/FLAWS/CONVERSATIONS masters,
QUEST_VAULT, QUESTBOOK_ARCHIVE.html, the street pools, and every picker/
gallery/proof awaiting Paolo's thumbs. Same failure class as the two banked
ZIP INCIDENT lessons: the wrap dropped files silently, the diff caught it.
_MANIFEST.md5.txt stays at root as the checklist; re-run the verify after the
missing files land. Gates are green WITHOUT these files only because none of
the 15 gates reads them; the repo is NOT whole until they land. Full list:

  ARCHIVE_BOHEMIA_BLOCKGEN_RENDER_PROOF_7_14_26.html
  BOHEMIA_ALPHA_SURFACE_UPGRADES_7_10_26.txt
  BOHEMIA_ANIM_GAP_COOK_7_14_26.txt
  BOHEMIA_ANIM_GAP_PROOF_7_14_26.html
  BOHEMIA_BAKE_V8_GALLERY_7_10_26.html
  BOHEMIA_BRIDGE_SET_7_10_26.txt
  BOHEMIA_CONVERSATIONS_MASTER_7_16_26.txt
  BOHEMIA_CRAFT_MASTER_7_16_26.txt
  BOHEMIA_DEMO_TILE_BAKE_7_10_26.txt
  BOHEMIA_DIRECTIONAL_VARIANT_BANK_7_10_26.txt
  BOHEMIA_DOOR_EW_BANK_7_10_26.txt
  BOHEMIA_DOOR_LEAF_COOK_V3_7_14_26.txt
  BOHEMIA_DOOR_SINGLE_LEAF_PROOF_7_14_26.html
  BOHEMIA_FLAWS_MASTER_7_16_26.txt
  BOHEMIA_GORE_OVERLAY_BANK_7_10_26.txt
  BOHEMIA_GRAPHICS_LAWS_MASTER_7_16_26.md
  BOHEMIA_GRAPHICS_VERDICTS_MASTER_7_16_26.txt
  BOHEMIA_GROUND_SEAMLESS_SET_7_10_26.txt
  BOHEMIA_HOUSE_FACTORY_BANK_7_14_26.txt
  BOHEMIA_HOUSE_FACTORY_GALLERY_7_14_26.html
  BOHEMIA_HOUSE_PART_ROLES_7_14_26.html
  BOHEMIA_LAMP_DARK_VARIANTS_7_14_26.txt
  BOHEMIA_LIVE_SLICE_V11_7_16_26.html
  BOHEMIA_MOUNTED_SIGNS_7_13_26.txt
  BOHEMIA_MULTICELL_TRAINING_7_10_26.html
  BOHEMIA_NIGHT_BLOCKS_PROOF_7_14_26.html
  BOHEMIA_OVERLAY_BANK_7_10_26.txt
  BOHEMIA_PARTICLE_LOOP_BANK_7_14_26.txt
  BOHEMIA_PARTICLE_LOOP_COOK_7_14_26.txt
  BOHEMIA_PATH_SEAMLESS_SET_7_10_26.txt
  BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt
  BOHEMIA_PORTS_MASTER_7_16_26.txt
  BOHEMIA_QUESTBOOK_ARCHIVE.html
  BOHEMIA_QUEST_VAULT.md
  BOHEMIA_REAL_VEGAS_BLOCKS_7_14_26.html
  BOHEMIA_ROOF_KIT_EXPANSION_7_14_26.txt
  BOHEMIA_ROOF_SEAMLESS_SET_7_10_26.txt
  BOHEMIA_SESSION_SHOWCASE_7_10_26.html
  BOHEMIA_STALL_STRIPE_CANDIDATES_7_14_26.txt
  BOHEMIA_STALL_STRIPING_PROOF_7_14_26.html
  BOHEMIA_STREET_ANATOMY_POOL_7_13_26.txt
  BOHEMIA_STREET_GEN_GALLERY_7_13_26.html
  BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt
  BOHEMIA_STREET_TILE_ROLES_7_13_26.html
  BOHEMIA_STREET_TUNER_7_13_26.html
  BOHEMIA_TERRAIN_PICKER_7_14_26.html
  BOHEMIA_TRANSITION_SET_7_10_26.txt
  BOHEMIA_TURN_MARKING_CANDIDATES_7_14_26.txt
  BOHEMIA_WALL_PICKER_7_14_26.html
  BOHEMIA_WALL_PICKER_BATCH2_7_14_26.html
  BOHEMIA_WALL_SEAMLESS_SET_7_10_26.txt
  BOHEMIA_WALL_VARIANT_BANK_7_10_26.txt
  BOHEMIA_WATER_SEAMLESS_SET_7_10_26.txt
  bohemia_engine.js

## THE RE-AUDIT (Paolo forced a second pass. It found four more. Read this.)
7. **THE REGISTRY ATE TWO LIVE FILES.** `bohemia_superseded.txt` had a line
   reading `BOHEMIA_QUESTBOOK_40_SINNERMAN.md | #122 is the primary (40 still
   rides)`. The prose said STILL RIDES. The parser reads column 1 and skips.
   #40 and #79 were DROPPED from the master: 44KB of research, silently gone.
   FIXED + LAW: if a file must keep riding, its name NEVER starts a registry
   line. Notes go in comments. Gated by carry_gate.py, which proves every
   skip-listed name is really absent from disk.
8. **THE CANON INDEX SPAWNED A NEW MAP EVERY RUN.** It wrote a date-stamped
   filename, so three indexes existed at merge time and a session could cite any
   of them. Now ONE name, `BOHEMIA_CANON_INDEX.md`. Git holds history.
9. **THE CHAIN DETECTOR WAS BLIND TO ITS OWN CORPUS.** It matched topics exactly,
   so SIDEWALK_SANCTITY and SIDEWALK_SANCTITY_ENFORCED read as unrelated: it
   reported ZERO supersession chains on a corpus full of them. The tool built to
   catch stale rulings masquerading as current could not see the commonest case.
   Now suffix-aware. Also its registry path was hardcoded to a dead directory, so
   DECLARED chains never loaded either. Both fixed.
10. **THE GDDs WERE MISSING FROM THE CANON INDEX.** They carry no date stamp, so
   they scored (0,0,0) and sorted to the BOTTOM as four bare filenames: the top
   of the truth hierarchy ranked below every addendum with no note that all four
   are live. THAT IS HOW THE FALSE "v2 IS SUPERSEDED" CLAIM SURVIVED TWO
   REGISTRIES: the map never showed it. The lineage is now PINNED to the top of
   the index with what each version alone holds.

## WHAT THE MERGE FOUND (all fixed, all gated)
1. Graphics tests hardcoded /mnt/user-data/outputs/ paths. Dead on arrival in a
   repo. Now repo-relative.
2. lightreg_gate.js was reading BOHEMIA_ACT1_LIGHT_SOURCES_7_13_26.txt, a file
   its OWN superseded registry declared dead. Now reads v5.
3. The lightreg purity test proved normalize() was pure by asserting a literal
   (firewood radius===4). v5 baked UNLIT FUEL LAW into the source data, so the
   stack now ships radius 0 / type fuel: the law was applied twice, once in data
   and once in code. Test is now registry-agnostic (snapshot in, compare out) and
   will survive every future registry version.
4. ENGINE SYNC drift: graphics_tests.js and prop_scale.js each had two bodies
   (bundle vs standalone). Standalone were newer. Bundle rebuilt. Zero drift.
5. Three canon indexes existed. Three maps, one territory. Newest is the map.
6. Questbook seed's laws master still taught SKIN_TONES_HOMELESS, dead since 7/10.
   The graphics copy won. This is exactly the rot class the truth hierarchy kills.

## ACTIVE FILES (entry points)
- CLAUDE.md = operating manual + TRUTH HIERARCHY (now carries THE HANDOFF FILE law)
- BOHEMIA_ARCHITECTURE_MAP.md = NEW. what depends on what. the whole graph.
- BOHEMIA_GDD_v2/v3/v4/v5.md = the bible, ALL FOUR LIVE. v5 EXTENDS, it does not
  replace. v2 = lore foundation (dynasties, Project Angel, the Amalgamation's
  origin, the Fifth Dimensional Element). v3 = Dead Eye Dial core + the ENDGAME
  (the Nuke, the last moral choice, Bohemia Is the Only Free City). v4 = the fold,
  succession, character stack, Bunkerguy. v5 = 7/3-7/6 systems. Gated: gdd_gate.js
- BOHEMIA_LIVE_SLICE_V11_7_16_26.html = the LIVE slice (V9 = blessed art base)
- BOHEMIA_ALPHA_0_9.html = the ONE alpha (stale, absorption pending, ONE-ALPHA LAW)
- gates/bohemia_gates.py = every law's teeth, one command
- BOHEMIA_GRAPHICS_ENGINE_MASTER_7_16_26.js = 14-module reference bundle
  (standalone .js files are CANONICAL, the bundle is a copy, sync gate enforces)
- bohemia_engine.js = game engine, 12 modules + bohemia_tests.js (80 checks)
- BOHEMIA_QUESTBOOK_MASTER_INDEX_7_16_26.md -> 138 dives -> PORTS_MASTER = build queue
- bohemia_bq.js = quest parser (29/29). STAT/KARMA GATES BANNED AT PARSER LEVEL.
- bohemia_superseded.txt = what stopped riding and why. registry, never deletion.
- bohemia_chunk.py = the 25MB-door transport for the HD tile repos

## IN FLIGHT (resume here)
1. LAMPS ONTO V11 from real blockgen anatomy. V9's four blocks RECOVERED EXACTLY:
   B2 street 2+2 w/crosswalk (lanes2 med1 side1 H13) + B0 street (lanes3 med1
   side2 H21) + B5 residential (lanes1 med1 side1 H7) + B1 arterial (lanes3 med1
   side1 H19) = 60 rows, seed 12345, cells (33,6)(34,6)(35,6)(36,6). Lamps on
   grid[0]/grid[H-1] sidewalk rows, x every 8 alternating sides, lampH =
   lanes>=3?4:3, state dead, lit via BOH_POWERGRID. Powergrid says all four cells
   DEAD; nearest live circuit (31,7) settlement. Lamp art: LIT #0-6 in
   BOHEMIA_DEMO_PROP_POOL, DARK variants bank 7_14 (pairs 0-4 usable).
   WARNING: V11 is W=24 H=63. Verify its own bake height before placing anything.
   The dead chat's LT0 patch used V8's H=62 on V9's H=60 bake. That file is dead.
2. PATROL INTO THE SLICE: bohemia_patrol.js built and gated 28/28, not yet wired
   into V11's walkable loop.
3. HD TILE REPOS: DONE 7/17. Joined md5-exact, live in /banks, chunks deleted.
4. FRESH QUEST MINING: ~72 whole-game teardowns still in the pool. Target >90
   individual quests at v2 before master compile; currently 54.

## NEXT ACTION
Get THE MISSING 54 into the repo (Paolo re-zips or uploads them; verify against
_MANIFEST.md5.txt, then file them into the layout above). Then LAMPS ONTO V11
(V11 itself is among the missing files).

## OPEN FORKS PENDING PAOLO (never decide these)
GRAPHICS: 101 purple world tiles kill-or-REDMAG / flashlight_36 orange-or-cool-white
/ siren_blue emits orange / 11 proposed sidewalk furniture names / fire_23-32-40
baked glow repaint-or-keep / reveal layer vocab / stall-tree-container footprints
/ ASPHALT_BASE rgb / lamp spacing game math / NETWORK zone placement / wall picker
batch-2 48 candidates awaiting thumbs / single-file alpha vs streaming launcher
(speed+mobility words lean streaming, NOT locked) / alpha absorption session
(ONE-ALPHA: with Paolo, one session, preflight GO)
QUEST: which relationships gate which arc (Liberate/Respect/Become as three
ledgers, Q102/Q136 model) / Amalgamation mindscape-therapy centerpiece (Q135
PORT 1) / Glarthir-at-scale Act 2 spine (Q130 PORT 5) / the Emil/Halua
origin-grammar for the Amalgamation's center (Q124, ENTIRELY PAOLO'S) /
whether Bohemia stages a betrayal-in-loyalty's-UI quest at all (Q131 PORT 3) /
does anyone discover the SOMA-truth on-screen in 100 years (Q115) / when to end
the research phase and start the master compile (target >90 individual quests,
at 54) / whether to re-mine the whole-game teardowns systematically or keep
pulling fresh games / production quests 046-053 + master compile PARKED until
Paolo says go
STANDING: act-1 grid-power ruling (resolver built, canon call open) / ragdoll head
+ neck rigidity / multi-enemy dial model (3 candidates unlocked) / pinch-zoom R=26
cap / perks system (known gap, never documented) / female + child rigs / gloves slot
/ mirrored-facing asymmetric garment art / currency logo design / suburban kit path

## THE QUESTBOOK TRACK — LOCKED LAWS (folded 7/16 from the launch handoff)
Every law below is CONFIRMED in the research corpus (verified by grep at the
merge: the files are all in the repo). This list is the SUMMARY of what the
questbook sprint concluded, and it lived in exactly one file. Now it lives here.

- **FORMAT LAW v2**: every quest file carries CAST + WHAT EACH WANTS,
  CONVERSATIONS as node trees (gates/TRAPs/SILENCE/NOVERBs), BRANCH MAP with
  counts. Gate: exactly 10 W-points, >0 option lines, END marker.
  (`BOHEMIA_QUESTBOOK_FORMAT_LAW_7_16_26.md`)
- **.bq FORMAT**: plain-text quest format, roles cast at runtime (Bethesda alias
  model), **STAT/KARMA GATES BANNED AT PARSER LEVEL**. Validator: alias-fill,
  orphans, dead links, named-body zero-loot, round-trip. (`bohemia_bq.js`, 29/29)
- **Target RAISED: >90 individual quests at v2 before master compile.** At 54.
- **BATCH LAW**: `BOHEMIA_QUESTBOOK_BATCH_LAW_7_16_26.md`

**LAW LOCKS STAGED FOR COMPILE** (confirmation counts live in the questbook index):
  - COMPREHENSION IS A BRANCH (11x confirmed)
  - AUTHOR-CANNOT-DELEGATE + HEIR-CANNOT-DELEGATE (one law)
  - ABSENT-PARTY DECISION (3x)
  - RESCUE-DENIAL register (4 instruments)
  - truth-delivery grid (unasked / begged-against / pre-authorized)
  - honest-devil set (buys / collects / exchanges / hosts / dominates)
  - exit-design theory (last-exit / first-exit / no-exit)
  - THE FINALE IS A LEDGER-READ (theater Q136 + arithmetic Q137 + rooftop Q102)
  - persuasion trilogy (deserved / written / midwifed)
  - HELP DECLARED IS HELP DENIED + verbs-removed-for-the-hearer
  - NO KARMA BAR (4-leg proof)
  - reward-flat forks, or the gradient is the point
  - @REDLINE companions
  - lures need ledgers
  - singleton registry (one Strange-Man, one Papyrus-class, one Sheogorath-class
    per game)

**FRESH MINING QUEUE** (from the ~72 whole-game teardowns still in the pool):
  Witcher contracts · Kenshi second story · Sunless Sea · Spec Ops white
  phosphorus · Undertale Sans · Obra Dinn · Mask of the Betrayer · Tyranny ·
  SH2 Eddie · Vampyr citizen-webs · Shivering Isles · Vaermina · Pamela-sibling
  files (Sharp/Flat, Ikana suite)

**ENGINE BACKLOG, EACH WITH A NAMED TEST**:
  - THE SETTLEMENT'S MISSING-PERSONS ORGAN (demanded by Q133/Q134/Q138) +
    vigilant-order response states
  - generational audit engine (Q137 PORT 1)
  - Fold ledger-view (Q136 PORT 1)

**EXTRACTION REPOS** (what the research is FOR):
  CRAFT_MASTER / FLAWS_MASTER / CONVERSATIONS_MASTER / **PORTS_MASTER = THE BUILD
  QUEUE**. PORTS is the one that turns research into game.

## BANKED LESSONS (folded from the questbook handoff, 7/16 merge. Do not lose.)
- **THE #102 INCIDENT.** A carried note said "two files at #102, fix the collision
  at compile." It was WRONG: not a collision, a LOSS. The EMIL file had been built,
  verified, shipped and presented, and was gone anyway. Transcript grep recovered
  it verbatim; it is now #124. FOUR LESSONS: (1) NEVER-LOSE-FILES LAW works and
  paid for itself; (2) a deferred fix is a fix that never happens, fix on
  discovery; (3) same-number-different-filename does NOT collide at the filesystem
  level, so it survives silently until someone counts: AUDIT BY NUMBER, NOT
  FILENAME; (4) never trust a carried note about file state over `ls`.
- **THE ZIP INCIDENT.** The first archive zip globbed BOHEMIA_QUESTBOOK_* only,
  silently excluding 57 files of Paolo's actual written work sitting in the same
  directory. LESSON: a wrap zip globs by DIRECTORY, then subtracts what is
  deliberately excluded. It NEVER globs by name prefix, because a prefix silently
  drops everything that does not match. Diff zip contents against disk every time.
  (This bit AGAIN at the 7/16 merge: a `*HD_TILE_REPO*.txt` skip glob also ate the
  `.chunkmanifest.txt` files. Same failure class, six days later. The diff caught
  it both times. THE DIFF IS THE GATE.)
- **THE GDD NEAR-MISS (7/16).** Two inherited registries claimed v2/v3/v4 were
  superseded by v5. Both wrong. v5 EXTENDS them and says so in its own first line.
  Archiving on that claim would have deleted the three-dynasty arc, the
  Amalgamation's origin, the Fifth Dimensional Element, the endgame and the fold.
  Caught only because Paolo asked "did you read the GDDs." LESSON, now gated by
  gdd_gate.js: a registry line is a CLAIM, not evidence. Read both documents
  before anything stops riding.
- Questbook files 01-16 run 11-13 craft points BY DESIGN (early format). Not
  damage. Do not "fix."
- Flaw laws locked 7/16: (12) the music repo's most emotional cue must have a KILL
  PATH (Q123, SCREECH LAW); (15) if a character asks the player for something, let
  the player be asked FOR REAL (Q124).
- Craft findings 7/16: the horror is the CLIPBOARD not the cross (Q122); mercy
  shows up in the PASSENGER MANIFEST (Q123); the enemy faction leaves if you fix
  their logistics (Q123); hope as a 12.5% trajectory improvement (Q123); the room
  list AS the atrocity (Q124); quest hooks as FORGERIES sent by people who love the
  target (Q124).

## DO NOT LOSE
- Paolo works from iPhone + two laptops. The alpha is stale and he wants ONE
  beautiful package: launcher UI tying alpha + music menus + character
  customization, fast on phones. First big build of the repo era. ONE session,
  with him, ONE-ALPHA LAW.
- Zero-dialogue-by-design registry (never "fix"): questbook #99 #104 #110 #114.
- 40/79 questbook files are superseded AS PRIMARY only (#122/#123 are primary).
  Both still ride. Registry-not-deletion.
- HD tile repos are NOT in the seed. They travel as chunks, separately.
- 103+ songs, faction genre bible locked for all 13 factions, music repo embedded
  in the alpha (lines 3249-5465), extractable as bohemia_music.js.
=== END HANDOFF ===
