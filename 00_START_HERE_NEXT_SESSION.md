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

ALL GATES GREEN at handoff: 16 gates (QUESTBOOK joined 7/17), ~40s, every
gate path repo-aware.
  python3 gates/bohemia_gates.py          (everything)
  python3 gates/bohemia_gates.py --fast   (skips the two pixel sweeps)

## THE MISSING 54: RESOLVED SAME DAY (but bank the lesson)
The four original part zips delivered 480 of the manifest's 534 files. The 54
absent files (including bohemia_engine.js, GRAPHICS_LAWS_MASTER, LIVE_SLICE_V11,
PORTS/CRAFT/FLAWS/CONVERSATIONS masters, QUEST_VAULT, the street pools, and
every picker/gallery/proof) were a zip-build drop, the ZIP INCIDENT's third
bite. Paolo re-uploaded corrected part2+part3 zips the same turn; all 54 landed,
md5-verified EXACT, and were filed into the layout. FINAL SCORE: all 534
manifest entries verified. 509 live byte-identical on disk (3 of them renamed
into archive/, the folder replacing the old ARCHIVE_ prefix), 5 chunk-transport
manifests verified then retired with their chunks (git history holds them), and
22 files verified EXACT at delivery then deliberately edited the same session
(gate path fixes for the folder layout, the /mnt/project bug, the handoff and
map rewrites). _MANIFEST.md5.txt stays at root as the delivery record.
LESSON, same as the two banked ZIP INCIDENT bites: THE DIFF IS THE GATE. The
manifest-vs-disk diff caught the drop within minutes.

ALSO RUN THIS SESSION (beyond the 15): engine/bohemia_tests.js 80/80, the bq
parser 29/29. gates/bohemia_loop_gate.js still fails on its POURED checks
because bohemia_loop.js's faction/economy/spawner pours are declared [SEAM]
comments, unbuilt by design. That is the engine backlog, not rot.
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
1. LAMPS ONTO V11: DONE 7/17. tools/bohemia_lamps_v11.py is the factory: it
   verifies V11's anatomy against its own bake (the four blocks live at rows
   3-9 / 12-18 / 21-41 / 44-62; V11 is NOT V9's stitch, the warning below was
   right), asks BOH_POWERGRID per cell (all four dead, exactly as recorded),
   and injects 11 dead lamps per the blockgen STAGGERED LAW using Paolo's
   dark pairs 0-4. Slot (10,9) skipped: its sidewalk cell is already occupied
   by baked art (an existing pole). Lamp bases join the blocked set
   (OCCUPANCY LAW). Gated: test_v11.js now runs 20 checks, 7 of them lamp
   law. [EYE, Paolo]: baked V10 lit lamp at (16,44) + static warm light at
   (2,44) now sit next to grid lamps (18,44)/(2,44); if the pairing reads
   wrong, the factory can skip those two slots, one line.
   THE OLD NOTE (V9 anatomy, kept for the record): from real blockgen anatomy. V9's four blocks RECOVERED EXACTLY:
   B2 street 2+2 w/crosswalk (lanes2 med1 side1 H13) + B0 street (lanes3 med1
   side2 H21) + B5 residential (lanes1 med1 side1 H7) + B1 arterial (lanes3 med1
   side1 H19) = 60 rows, seed 12345, cells (33,6)(34,6)(35,6)(36,6). Lamps on
   grid[0]/grid[H-1] sidewalk rows, x every 8 alternating sides, lampH =
   lanes>=3?4:3, state dead, lit via BOH_POWERGRID. Powergrid says all four cells
   DEAD; nearest live circuit (31,7) settlement. Lamp art: LIT #0-6 in
   BOHEMIA_DEMO_PROP_POOL, DARK variants bank 7_14 (pairs 0-4 usable).
   WARNING: V11 is W=24 H=63. Verify its own bake height before placing anything.
   The dead chat's LT0 patch used V8's H=62 on V9's H=60 bake. That file is dead.
2. PATROL INTO THE SLICE: DONE 7/17. tools/bohemia_patrol_v11.py wires it:
   BOH_PATROL rides V11 verbatim (sync gate arbitrates), the roster is computed
   at build time from the real overmap+powergrid+patrol modules exactly like
   V10 computed its powerMap truth, walkers advance on the player's step and
   join the occupancy check. THE ROSTER IS EMPTY AND THAT IS THE LAW: all four
   cells are dead, nobody patrols the dark; the empty street is the reading.
   The walkers/occupancy/render wiring is live code for the first lit slice.
   Patrol owner COLORS are placeholder grays [PENDING Paolo] (purple stays the
   Amalgamation's). Gate: test_v11.js now 28 checks incl. roster-must-match-
   modules and a parse check on every script block after injection.
3. HD TILE REPOS: DONE 7/17. Joined md5-exact, live in /banks, chunks deleted.
4. FRESH QUEST MINING: BATCH 8 LANDED 7/17 (#139 the Spec Ops white phosphorus
   machine, #140 the Undertale judgment corridor, #141 Obra Dinn's
   identification loop; the last one IS the missing-persons organ's design
   document, Q133/Q134/Q138's demanded engine). 57 of >90. THE QUESTBOOK HAS
   TEETH NOW: gates/questbook_gate.py is gate #16 in the suite: 10 W-points,
   option lines, sections, branch counts, END markers, and every .bq port
   block parsed through the real bohemia_bq.js (a port that cannot be pasted
   into the lab is a wish). Masters + gap matrix are machine-appended by
   tools/bohemia_questbook_extract.py. NAMED FAILURES, standing jobs: the full
   extraction REGENERATOR did not survive the dead chat (the appender is the
   working half); ARCHIVE.html not regenerated this batch for the same reason.
   Backfill queue confirmed by the gate: 136 pre-v2 files with no conversation
   machine. Two law locks got fresh confirmations: FINALE-IS-A-LEDGER-READ
   (#140, fourth and cleanest) and COMPREHENSION-IS-A-BRANCH (#141, twelfth).

## NEXT ACTION
GRAPHICS COOK 7/17: the act-1 art_gaps item (turn-pocket arrows) is COOKED.
tools/bohemia_turn_arrow_factory.py built 48 tiles (left/right/thru x v/h +
TWLT opposing pairs, 6 weathered variants each), white-only per LINE COLOR
LAW, on the certified 7/14 candidates' own asphalt (paint erased + inpainted),
self-gated (yellow=0, purple=0, paint budget, base-faithful) and swept by the
purity gate in the suite (15,089 images, green). JUDGING SURFACE READY:
tools/BOHEMIA_MARKING_PICKER_7_17_26.html = both marking banks, 84 candidates,
SUN MODE, thumbs, per-item notes, comment box, exports .txt. Awaiting Paolo's
thumbs alongside WALL_PICKER_BATCH2. Dual/triple pockets = the arrow tile
repeated per pocket lane; placement is blockgen's job (MAP LAW: plumbing only).
THE 7/16 MINING QUEUE IS CLOSED (BATCH 12, 7/17): #151 the outpost story (the
city-builder core's own design document: findable-flag, the ledger's other
side, sieges that learn, the settlement testifies) and #152 the Greymarch
(succession as the prize: offices with verbs, lawful accession rites, the
chamberlain class, cycles priced in generations). 68 of >90. THE FORK IS NOW
PAOLO'S: (a) fresh game names, (b) systematic re-mine of the ~72-game pool,
(c) the 136-file backfill queue. Flagged [PENDING, Paolo's call] per the
standing rule; mining pauses at 68 until he picks.
THE ARCHIVE IS BACK (7/17): tools/bohemia_questbook_archive.py machine-appends
dives into BOHEMIA_QUESTBOOK_ARCHIVE.html's data array without touching the
shell or any old entry. All 12 new dives (139-150) are in: 150 files, 3,686
findings, searchable. The questbook gate now FAILS if the archive ever falls
behind the corpus (the freshness check). The batch law's last named failure is
CLOSED. Keep mining next: Kenshi second story, Shivering Isles, plus fresh
names from Paolo, or the systematic re-mine of the ~72-game pool (that fork is
Paolo's call, on the shelf). BATCH 11 landed 7/17, the first SOURCE-PULLED
batch (web research per file, cited in each SOURCES section): #148 the
contract formula, #149 the citizen web, #150 the god who lies at the finale
(the Network's whisper machine for the argue-finale, #142's companion piece).
66 of >90. BATCH 10 landed 7/17 (#145 the Conquest: the succession-chronicle
blueprint + standing-edicts port; #146 the unauthored quest: the five-property
emergent-condition checklist, schedules-on-the-beat rides the patrol wiring;
#147 Sharp and Flat: the grief relay, wounds-as-geography, provenance-gated
knowledge): 63 of >90. Remaining queue: Witcher contracts (needs a source-pull
session for contract-level facts), Kenshi second story (the pool's OTHER arc),
Vampyr, Shivering Isles, Vaermina, plus whatever fresh games Paolo names.
BATCH 9 landed 7/17 (#142 MotB argue-the-god, #143 SH2 Eddie +
the behavioral verdict engine, #144 Sunless Sea legacy fold): 60 of >90.
Remaining queue: Witcher contracts, Kenshi, Tyranny, Vampyr, Shivering Isles,
Vaermina, Undertale non-Sans cuts, the Pamela-sibling files (#138 exists;
Sharp/Flat + Ikana still to mine). Law-lock scoreboard: FINALE-IS-A-LEDGER-READ
now 5 confirmations (#140 moral, #143 behavioral registers); the argue-finale
has its blueprint (#142); the fold has its cornerstone (#144, pairs with Q46/
Q47/Q49/Q137). Also on deck: rebuild the questbook ARCHIVE/extraction
regenerator as a real factory. Waiting on Paolo: GitHub write access for the
push (SIX commits queued), WALL_PICKER_BATCH2 thumbs (48), the (16,44)/(2,44)
lamp-pairing eye call, patrol owner colors.

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
