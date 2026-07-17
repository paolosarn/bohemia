=== BOHEMIA HANDOFF 7/17/26 (REPO BORN) ===
FILENAME LAW: this file is always named 00_START_HERE_NEXT_SESSION.md, lives at
repo root, sorts to the top of every file list, and is REWRITTEN at the end of
every working session. There is only ever ONE. It is the first thing any
session reads after CLAUDE.md.

READ ORDER: CLAUDE.md -> this file -> BOHEMIA_ARCHITECTURE_MAP.md (what depends
on what) -> laws/BOHEMIA_CANON_INDEX.md (newest-date-wins map) ->
laws/BOHEMIA_STATE_OF_PLAY_7_16_26.md

## WHERE WE ARE
THE REPO IS BORN. Day One (per BOHEMIA_CODE_DAY_ONE_7_16_26.md, now in /laws)
executed 7/17/26:
- All six seed zips unpacked. 534 files verified against _MANIFEST.md5.txt:
  527 md5-exact, 7 expected diffs (the 5 chunkmanifests + bohemia_chunk.py +
  bohemia_master.py were regenerated AFTER the manifest was stamped; their
  zip copies are the newer ones and they PROVED themselves, see next line).
- All five chunked fatties rejoined md5 EXACT: BOHEMIA_ALPHA_0_9.html (31MB)
  + BOHEMIA_HD_TILE_REPO_part1-4.txt (~45MB each). Chunks and zips deleted.
- 535 files organized into the Day One layout: /engine /gates /laws /banks
  /slices /tools /records /questbook /quests /archive. Root keeps CLAUDE.md,
  this file, BOHEMIA_ARCHITECTURE_MAP.md, BOHEMIA_GRAPHICS_LAWS_MASTER, and
  BOHEMIA_ALPHA_0_9.html (the ONE alpha rides at root, visible, one of a kind).
- Every gate path rewired for the layout. TWO REAL BUGS FIXED in the process:
  bohemia_graphics_tests.js and patrol_gate.js still hardcoded
  /mnt/project/bohemia_overmap.js, a chat-era path. Dead on arrival in the
  repo: ENGINE TESTS and PATROL both failed on a clean checkout. This is the
  same failure class the 7/16 merge fixed for /mnt/user-data/outputs and the
  /mnt/project variant slipped through. Both now require ../engine/ relative.
  The bundle's graphics_tests section was rebuilt from the corrected
  standalone (ENGINE SYNC LAW: standalone is canonical, bundle is a copy).

ALL GATES GREEN post-reorg: 15 gates, ~31s, full pixel sweeps included.
  python3 gates/bohemia_gates.py          (everything)
  python3 gates/bohemia_gates.py --fast   (skips the two pixel sweeps)
Plus, run by hand and green: bohemia_tests.js 80/80, bohemia_bq_tests.js 29/29,
graphics tests 105/105 inside the suite.
NOTE: the pixel gates need numpy + pillow (pip install numpy pillow once per
fresh container; a SessionStart hook could pin this).

## KNOWN SEAM (pre-existing, verified present in the untouched seed too)
gates/bohemia_loop_gate.js CRASHES at 'factions loaded from canon':
bohemia_loop.js boots factions/economy/spawner as null [SEAM] placeholders
(lines 68, 173-174). The gate was written ahead of the wiring. It is NOT in
the 15-gate suite, so ALL GATES GREEN stands. Wiring those seams is real
engine work, not path work: it needs its own session.

## PURITY SWEEP GREW (flag for Paolo, no ruling made)
The purity gate now sweeps /banks INCLUDING the four rejoined HD tile repos,
which never traveled inside the seed before: 15,041 images checked, 2,098
violations recorded (was 793 on the smaller pre-repo sweep), 5,630
warm-suspect. Same standing question as before, now with the full corpus in
view: kill or quarantine into REDMAG. [PENDING, Paolo's call]

## ACTIVE FILES (entry points, new layout)
- CLAUDE.md = operating manual + TRUTH HIERARCHY (root)
- BOHEMIA_ARCHITECTURE_MAP.md = what depends on what (root; commands updated)
- BOHEMIA_ALPHA_0_9.html = the ONE alpha, WHOLE AGAIN at root (stale,
  absorption pending, ONE-ALPHA LAW)
- laws/BOHEMIA_GDD_v2/v3/v4/v5.md = the bible, ALL FOUR LIVE (gdd_gate enforces)
- laws/BOHEMIA_CANON_INDEX.md = newest-date-wins map
  (regenerate: python3 gates/bohemia_canon_index.py)
- slices/BOHEMIA_LIVE_SLICE_V11_7_16_26.html = the LIVE slice (V9 = blessed base)
- gates/bohemia_gates.py = every law's teeth, one command
- engine/ = both engines: bohemia_engine.js (12 modules) + the 14 graphics
  modules + BOHEMIA_GRAPHICS_ENGINE_MASTER_7_16_26.js (reference bundle)
- questbook/BOHEMIA_QUESTBOOK_MASTER_INDEX_7_16_26.md -> 138 dives ->
  questbook/BOHEMIA_PORTS_MASTER_7_16_26.txt = build queue
- engine/bohemia_bq.js = quest parser (29/29). STAT/KARMA GATES BANNED.
- gates/bohemia_superseded.txt = registry, never deletion
- banks/ = all art + music (BOHEMIA_MUSIC_REPO.txt rides there) + the four
  HD tile repos, whole
- tools/bohemia_chunk.py = the 25MB-door transport (only needed at GitHub's
  web-upload door; inside the repo 100MB files are fine)

## IN FLIGHT (resume here)
1. LAMPS ONTO V11 from real blockgen anatomy. V9's four blocks RECOVERED
   EXACTLY: B2 street 2+2 w/crosswalk (lanes2 med1 side1 H13) + B0 street
   (lanes3 med1 side2 H21) + B5 residential (lanes1 med1 side1 H7) + B1
   arterial (lanes3 med1 side1 H19) = 60 rows, seed 12345, cells
   (33,6)(34,6)(35,6)(36,6). Lamps on grid[0]/grid[H-1] sidewalk rows, x every
   8 alternating sides, lampH = lanes>=3?4:3, state dead, lit via
   BOH_POWERGRID. Powergrid says all four cells DEAD; nearest live circuit
   (31,7) settlement. Lamp art: LIT #0-6 in BOHEMIA_DEMO_PROP_POOL, DARK
   variants bank 7_14 (pairs 0-4 usable). WARNING: V11 is W=24 H=63. Verify
   its own bake height before placing anything.
2. PATROL INTO THE SLICE: bohemia_patrol.js built and gated 28/28, not yet
   wired into V11's walkable loop.
3. FRESH QUEST MINING: ~72 whole-game teardowns still in the pool. Target >90
   individual quests at v2 before master compile; currently 54.
4. THE ONE-ALPHA SESSION (with Paolo, preflight GO): absorption + launcher UI
   tying alpha + music menus + character customization, fast on phones. The
   alpha is whole again as of today, so this is finally possible.

## NEXT ACTION
Pick up IN FLIGHT #1 (LAMPS ONTO V11), or if Paolo is present, the ONE-ALPHA
session. Music track note: last cook was 7/7-7/8; the remake batch (HIGHWAY 15
SOUTH v2, CARAVAN DUST v2, ONE CANDLE v2) plus THRONE OF STATIC, CHOIR FOR THE
MACHINE, FLOWERS ON THE FREEWAY and MOB THE HOUSE REMEMBERS all sit UNJUDGED,
and MOJAVE GHOST / LONG WALK HOME are still fate-pending. A music verdict
session is cheap now that the alpha is whole.

## OPEN FORKS PENDING PAOLO (never decide these)
GRAPHICS: 101 purple world tiles kill-or-REDMAG (now 2,098 hits on the full
corpus, see PURITY SWEEP GREW above) / flashlight_36 orange-or-cool-white
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
MUSIC: remake batch v2 thumbs (HIGHWAY 15 SOUTH / CARAVAN DUST / ONE CANDLE) /
THRONE OF STATIC + CHOIR FOR THE MACHINE + FLOWERS ON THE FREEWAY verdicts /
MOB THE HOUSE REMEMBERS verdict / MOJAVE GHOST + LONG WALK HOME fate
CHARACTER: agent reveal glow placement (temple vs crown vs behind eyes) / one
shared purple vs variation by conversion age / the 8 rag outfits eyeball
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
  (`questbook/BOHEMIA_QUESTBOOK_FORMAT_LAW_7_16_26.md`)
- **.bq FORMAT**: plain-text quest format, roles cast at runtime (Bethesda alias
  model), **STAT/KARMA GATES BANNED AT PARSER LEVEL**. Validator: alias-fill,
  orphans, dead links, named-body zero-loot, round-trip. (`engine/bohemia_bq.js`, 29/29)
- **Target RAISED: >90 individual quests at v2 before master compile.** At 54.
- **BATCH LAW**: `questbook/BOHEMIA_QUESTBOOK_BATCH_LAW_7_16_26.md`

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
  - loop seams: factions/economy/spawner POURED (bohemia_loop_gate.js is the
    named test, currently red by design, see KNOWN SEAM)

**EXTRACTION REPOS** (what the research is FOR):
  CRAFT_MASTER / FLAWS_MASTER / CONVERSATIONS_MASTER / **PORTS_MASTER = THE BUILD
  QUEUE**. PORTS is the one that turns research into game. All in /questbook.

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
- **THE /mnt/project GHOST (7/17, Day One).** The 7/16 merge fixed the
  /mnt/user-data/outputs hardcodes and declared the class dead. A SECOND
  chat-era absolute path (/mnt/project) survived in two gate files and killed
  ENGINE TESTS + PATROL on the repo's first real run. Same class, one day
  later, different prefix. LESSON: sweep for the CLASS (`grep -r '/mnt/'`),
  never for the instance.
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
  with him, ONE-ALPHA LAW. The alpha is WHOLE at repo root as of 7/17.
- Zero-dialogue-by-design registry (never "fix"): questbook #99 #104 #110 #114.
- 40/79 questbook files are superseded AS PRIMARY only (#122/#123 are primary).
  Both still ride. Registry-not-deletion.
- HD tile repos are WHOLE in /banks now (repo holds them fine; chunking is only
  for GitHub's 25MB web-upload door).
- 103+ songs, faction genre bible locked for all 13 factions, music repo embedded
  in the alpha (lines 3249-5465), extractable as bohemia_music.js; the portable
  save file is banks/BOHEMIA_MUSIC_REPO.txt.
=== END HANDOFF ===
