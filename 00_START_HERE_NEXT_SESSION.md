=== BOHEMIA HANDOFF 7/17/26 (REPO DAY ONE COMPLETE) ===
FILENAME LAW: this file is always named 00_START_HERE_NEXT_SESSION.md, lives at
repo root, sorts to the top of every file list, and is REWRITTEN at the end of
every working session. There is only ever ONE. It is the first thing any
session reads after CLAUDE.md.

READ ORDER: CLAUDE.md -> this file -> BOHEMIA_ARCHITECTURE_MAP.md ->
BOHEMIA_CANON_INDEX.md -> laws/BOHEMIA_STATE_OF_PLAY_7_17_26.md (the full
account of repo day one lives THERE; this file stays the pointer, not a pile).

## WHERE WE ARE
The repo is born, whole, and on main. 534/534 seed files verified. The layout:
/engine /gates /laws /banks /slices /tools /records /questbook /quests
/archive, spine docs at root. Push access works; everything commits to main
the turn it passes the gates.

ALL GATES GREEN: 16 gates (QUESTBOOK joined 7/17), ~35s.
  python3 gates/bohemia_gates.py          (everything)
  python3 gates/bohemia_gates.py --fast   (skips the two pixel sweeps)

DAY ONE IN ONE BREATH (details + lessons in STATE_OF_PLAY 7/17):
- V11 slice track CLEARED: lamps on (powergrid-ruled dark), patrol wired
  (empty roster IS the law), approved marking paint on the ground. Slice gate
  13 -> 33 checks.
- Engine: blockgen places turn pockets (cell.mk, certified vocabulary); LINE
  COLOR gate grew 6 checks.
- Graphics: a FULL verdict cycle in one day — arrows cooked, all 84 markings
  approved in chat, volume banked (224 tiles), act-1 art_gaps EMPTY. Wall
  batch 2: WB4 into perimeter pool v2; the 47 await other wall classes
  (REJECTION IS PER CLASS, taxonomy addendum 7/17).
- Questbook: batches 8-12, files #139-152, the 7/16 mining queue CLOSED,
  68 of >90. Gate #16 enforces the format; the searchable archive is back
  and freshness-gated.

## IN FLIGHT (resume here)
0. THE INTERSECTION EXISTS (7/17 evening, Paolo asked, same turn): blockgen
   type 'intersection' — two roads crossing, clean box (no paint inside, per
   real anatomy), four crosswalks at the box edges, medians stopping at the
   crossings, left-turn pockets feeding every approach, corner lamps. LINE
   COLOR gate grew 6 intersection checks (30 total). A real anatomy bug was
   caught mid-build (B-side lanes started with a divider against the median;
   fixed half-aware). The graphics core's inlined blockgen re-inlined from
   canon AGAIN (second time today — the sync gate keeps earning). Baked proof:
   slices/BOHEMIA_V12_INTERSECTION_PROOF_7_17_26.png. ALSO: the v1 arrows were
   ruled illegible at phone zoom (Paolo: "wtf is the purpose of these lines")
   — BOLD marking candidates cooked (banks/BOHEMIA_MARKING_BOLD_CANDIDATES_
   7_17_26.txt, UNJUDGED: 5px shafts, solid tips, edge-positioned pocket
   lines); the intersection proof renders them and IS their judging surface.
   If Paolo blesses the proof, bold goes through the verdict->volume flow and
   the v1 confetti arrows get graveyarded FOR ARROWS (per-class rule).
0b. FIRST COMMISSIONED ORIGINAL ART (7/17 night, Paolo's call: "you could
   hallucinate and actually draw yourself"): Vegas mast-arm TRAFFIC SIGNALS,
   drawn from scratch in the corpus style. tools/bohemia_traffic_signal_
   factory.py -> banks/BOHEMIA_TRAFFIC_SIGNAL_CANDIDATES_7_17_26.txt: 12
   sprites, 3 mast variants (two-head+sign / three-head arterial / two-head+
   pole-mount+sign) x dead/red/amber/green. FOUR COOKS TO GET HERE, lessons
   banked: v2 sampled lum 40-150 off the lamp and built all-rust orange
   poles (the lamps' DOMINANT metal is the near-black cluster); v3 went
   dark-flat with per-pixel flecks and Paolo's zoom verdict was "looks like
   dog shit in comparison" — THE CRAFT LESSON: the corpus is PAINTED, not
   filled. v4 paints: tone ramp sampled from the lamp (5 steps + warm rust
   cluster), cylindrical shading with a dithered highlight band, 1px
   silhouette outline pass, rust as coherent BLOTCHES + drip streaks below
   joints (never confetti), stacked base discs, bulged collars, rivet seam,
   cap. ALSO FIXED: seed used hash(state), which is process-salted — the
   determinism law was silently broken v1-v3; fixed mapping now. THEN v5,
   because Paolo ruled a NEW LAW off v4: THE 45 DEGREE ART LAW ("every art
   ... has to be viewed from like a 45 degree angle... yours is like a flat
   90, like it's a 2D scroller"). All original art is three-quarter view:
   ellipse cross-sections, sky-lit visible tops, bands bow toward the
   viewer. Law: laws/BOHEMIA_ADDENDUM_45_DEGREE_ART_LAW_7_17_26.md +
   CLAUDE.md law list; GATE THE SAME TURN: gates/art_45_gate.py (gate #18,
   ellipse-base + top-lit machine proxies on every registered commission
   bank). v5 stands on stacked ellipse discs with a lidded cap, bowed
   collars, sky-lit arm, heads with visible top + side faces. THEN v6
   (Paolo: "so close... do better. It's not good enough yet"), self-diagnosed
   against the lamp: (1) SHAPE — the arm is now a real smooth quadratic
   curve off a low junction, capped pole showing above it, nothing straight;
   (2) RANGE — a true 'spec' brass tone sampled at p97 of the lamp rides the
   highlight bands, rims, and clamp tops; (3) CALM — grain cut to 10%, bands
   decisive; (4) STORY — rust blob centers seeded below collars, base skirt,
   arm junction (where water sits), not scattered. THEN v7 (Paolo circled
   the base on his phone): OCCLUSION LESSON — the base discs drew AFTER
   the pole and read as standing in FRONT of it. Draw order IS depth:
   base first bottom-up, pole planted INTO the top disc (ends at its
   center line), back halves hidden, front rims wrapping the foot.
   Applies to every planted prop from now on. THEN v8 (Paolo's expansion,
   7/18 early): ARM LAW — arm reach tracks street width (1 lane -> short
   2 cells / 2 -> med 3 / 3 -> long 4.5, heads 1/2/3 like real warrants;
   mapping shipped in the bank as arm_law). COLOR RESEARCH — real masts
   are hot-dip galvanized (25-50yr zinc coat): majority weather to dull
   GRAY with rust at joints; only stripped ones brown to the lamp family.
   Two families cooked: galv + bronze. WRECKS — fallen_arm (jagged stub,
   span on the ground with a dead head still bolted), jury_rigged (lash
   splice, sags past it), headless (empty hangers, dangling cable).
   EAST+WEST both shipped per sprite with per-entry pcx anchors (bake
   reads pcx, no transpose). DOUBLE BORDER — sampled rim + 1px true black
   (Paolo: reading thin). THEN v9 (Paolo: "what about when it's facing
   north or south"): FACE LAW — in the billboard convention heads either
   face the camera (face s, lenses, serves northbound) or away (face n =
   the BACKS: yellowed plate, ribbed panel, visor edges poking out, no
   lenses; lit shows only as colored light SPILL around the housing;
   sign backs are unpainted metal, no green, nothing to read). Every
   intact mast ships both faces; the proof now stands all FOUR corners
   (south side faces, north side backs). THEN v10-v12, THE EAST/WEST
   SAGA (two wrong swings, banked so nobody swings wrong again): v10
   made skinny side-profile heads — Paolo circled them ("this is how the
   stoplight has to look, bro come on"): a stoplight NEVER diets, full
   mass always. v11 kept full heads on the horizontal arm with biased
   lenses — still wrong. THE RULING (v12, Paolo verbatim): "if its
   facing west or east it wont be having the stop lights extending east
   or west, left or right — it will be UP OR DOWN." Face e/w = the arm
   runs VERTICALLY on screen, spanning the EW road: arm_dir n (up) or s
   (down), FULL map length per the ARM LAW (grid distances never
   foreshorten in the billboard world), elbow + junction collar + tip
   cap, full-mass heads hanging along the arm at 66px spacing (46
   overlapped them into a totem), lenses biased toward the facing edge.
   draw_mast extracted and shared by both orientations. base_y per bank
   entry (vertical-south sprites extend below the pole foot; the bake
   anchors on base_y). MIRROR TRUTH RULE: flipping swaps e<->w and the
   bank stores the face AFTER the flip. THEN THE FACING-THE-STREET
   ARRANGEMENT (Paolo's arrow sketch on the proof, 7/18): one mast per
   SIDE, arms circling the intersection counterclockwise, every mast's
   lights facing the oncoming traffic on the road they hang over — N
   side arms east + lenses south (serves northbound), E side arms DOWN
   + lights west (eastbound), S side arms west + backs north
   (southbound), W side arms UP + lights east (westbound). The proof
   stands exactly these four; this is the placement law the engine
   wiring will follow once Paolo approves the art. CORRECTED same
   night (Paolo): (1) ONE POST PER CORNER — the engine's corner lamp
   yields wherever a signal mast stands; (2) every facing FLIPPED to
   the near approach: N side backs, E side lights east, S side faces,
   W side lights west. That flip exposed that arm chirality and lens
   facing are INDEPENDENT axes (a pole east of its road carries the arm
   west while lights still face east), so the vertical drawer grew
   head_facing and the bank now carries all four arm-side x facing
   combos. THEN ARM LAW v2 + LOOK-DOWN OCCLUSION (Paolo, same night):
   the arm extends HALFWAY ACROSS THE STREET covering every forward
   driving lane (1 lane -> 3 cells, 2 -> 6, 3 -> 9, heads ONE PER LANE
   at the lane centers, measured from the median end), and because the
   camera looks DOWN, the arm paints OVER the hanging heads. FINAL
   REFINEMENT (Paolo: "these should be under the pole, not jutting out
   to the side"): heads center DIRECTLY BENEATH the arm with a 4px lean
   toward the facing side (lens column clears the pipe), arm over their
   middles, clamps riding the arm. INTACT LOOK APPROVED by Paolo
   ("Awesomeee nice") — THEN v16 wrecks derived from it untouched
   ("take it how it is and break it and add it to the floor"): the
   horizontal fallen span now carries its lane-count of dead heads
   lying on their sides with glass; NEW vertical fallen_arm (both
   arm_dirs): jagged stub at the junction, the span lying on the ROAD
   beside its old line, dead heads on their backs staring at the sky,
   shattered lens glass. THEN v17 (Paolo): the broke-off span moved to
   THE BASE of the mast (lies on the floor from the foot out along the
   road), and a NEW wreck kind dropped_heads — pole and arm stay UP,
   the lights themselves lie dead on the floor below their clamps, one
   tipped sideways, glass around them (horizontal + vertical, both
   arm_dirs). Proof went HALF BROKEN HALF GOOD (N dropped_heads, E
   fallen, S+W intact) — Paolo: "So good!!!! Awesome!" THEN v18
   (Paolo: "broken street lights scattered around randomly on the
   floor nearby"): new kind SCATTERED — sheared stub + a seeded debris
   field: pipe chunks with torn ends at random angles, dead heads
   thrown in random rotations, glass, stray bolts; 3 variants per
   color horizontal + 2 per arm_dir vertical, every seed different so
   corners never repeat. THEN v19 (Paolo x2): (1) scattered FOR ALL
   DIRECTIONS — scatter demo proof slices/BOHEMIA_V12_SCATTER_PROOF_
   7_18_26.png stands debris fields on all four sides (bake gained a
   corner_mode arg; the approved half-broken proof unchanged); (2) THE
   SALVAGED HEAD ("people taking these red green yellow stop lights
   for themselves... world building"): the lone dead head as a
   standalone portable texture, 4 carry poses (kept/side_l/side_r/
   flipped), in the bank under salvaged_heads with salvage_lore.
   [PENDING Paolo]: WHERE salvaged heads appear around the map (MAP
   LAW — texture ready, placement is his). 348 sprites + 4 salvage
   props; wrecks + non-approved classes still UNJUDGED. JUDGING SURFACE
   READY: tools/BOHEMIA_SIGNAL_PICKER_7_18_26.html (gen:
   tools/bohemia_signal_picker_gen.py) — 16 classes, SUN MODE, thumbs +
   comments + export .txt. Paolo taps when ready; UP unlocks the cooked
   volume, NO -> graveyard w/ post-mortem; verdicts land in /records. Laws:
   DEAD is default (act-1 grid pending), lit lenses rgb-only glow, sign
   plates ILLEGIBLE (names are Paolo's), zero purple. STATUS: UNJUDGED.
   Two dead-state masts are composited onto the intersection proof (SW
   arm-east + NE mirrored) as the judging surface, same as the bold
   markings; bank carries pole_center_px for the bake's anchor math. PROOF
   PLACEMENT ONLY: engine prop placement waits for approval.
1. V12-class bake: THE BAKE FACTORY EXISTS (7/17, tools/bohemia_bake_factory.py
   — rebuilt from the harmonized pools' data-laws: 88/12 weather rarity, family
   edge harmonization, the APPROVED marking bank for native cell.mk, dark lamps).
   7/18: WRECKS + FIRE BARRELS ARE IN — tools/bohemia_street_prop_extract.py
   derives banks/BOHEMIA_STREET_PROP_POOLS_7_18_26.txt (20 top-down cars from
   HD part2 "Abandoned cars" — the V11 bake's own family — + 12 burn barrels
   from the demo prop pool, provenance recorded, corpus art not new canon);
   the baker composites car_wreck per the engine's w x h + facing (rot90 for
   EW) and fire_barrel/lamp props over them. ALL FOUR live cells baked:
   slices/BOHEMIA_V12_BAKE_PROOF_{33,34,35,36}_6.{png,html}.
   THE V12 SLICE EXISTS — THE OVERLAY ERA IS OVER (7/18):
   tools/bohemia_v12_slice.py bakes the same four canonical cells V11 walked
   ((33,6)(34,6)(35,6)(36,6), seed 12345 — all pure street variants, NO
   buildings so NO map canon needed), stitches them into one native DAY
   image (markings + cars + barrels + dead lamps all BAKED IN), builds
   OCCUPANCY from the baked prop footprints, and reuses V11's harness
   VERBATIM (light-pass module, patrol module, walk loop) with the three
   overlay payloads REMOVED. Result: slices/BOHEMIA_LIVE_SLICE_V12_7_18_26
   .html — 24x56, 1.46MB (half V11's 3.1MB, atlases gone), verified in
   chromium: renders clean (0 console errors), day/night + free-run +
   dpad + mode toggle all work, player walks the native-baked arterial.
   THE THESIS PROVED: the bake IS the world; the only live layers are what
   moves (you, survivors, the sun). NEXT for the bake track: plot/building
   strips (HOUSE_FACTORY_BANK) are the expansion when Paolo gives plot
   canon — the current four cells needed none.
   LIVE-SLICE HOSTING (7/18, Paolo asked how to host slices in the alpha
   organically): the alpha's menu is a TAB BAR (char/anim/rig/combat/
   music/city). The design: ONE new tab points at a STABLE URL,
   slices/BOHEMIA_CURRENT_SLICE.html, and slices/SLICES_MANIFEST.json
   decides which slice it shows (current pointer + a short entries list,
   catalog-ready but no catalog until the game ships). Updating the slice
   = bump the manifest + rerun tools/bohemia_slice_host.py; the 31MB alpha
   NEVER changes again. Loader built + verified (card in the alpha's style,
   ENTER loads the slice full-bleed + BACK bar, 0 errors). [PENDING, alpha
   session — ONE-ALPHA: music is currently on the alpha]: add the single
   tab (<div class="tab" data-p="NAME">NAME</div> + an iframe panel to
   BOHEMIA_CURRENT_SLICE.html). Tab NAME is Paolo's call (proposed: THE
   STREETS / WORKSHOP / SLICE).
2. Questbook mining: PAUSED AT 68 pending Paolo's lane pick (see below).
3. Alpha absorption: preflight GO since 7/14; ONE session, WITH Paolo.

## NEXT ACTION
Whatever Paolo picks off the PENDING shelf; if he says "do what's next"
without picking, the standing default is: keep the gates green, consolidate
(this file stays a pointer; STATE_OF_PLAY carries the day), and take the
largest unblocked item in IN FLIGHT.

## OPEN FORKS PENDING PAOLO (never decide these)
- THE MINING FORK: fresh game names / systematic re-mine of the ~72-game pool
  / the 136-file backfill queue (the gate counts it every run).
- THE NEXT WALL CLASS: names one -> the 47 waiting candidates re-enter
  judging under its banner (banks/BOHEMIA_WALL_CANDIDATES_POOL_7_17_26.txt).
- GRAPHICS EYE-CALLS: lamp pairing at (16,44)/(2,44); patrol owner colors
  (placeholder grays); 101 purple world tiles kill-or-REDMAG; flashlight_36
  orange-or-cool-white; siren_blue; ASPHALT_BASE rgb; NETWORK zone placement;
  suburban kit path; single-file alpha vs streaming launcher (NOT locked).
- QUEST: the 7/16 list stands unchanged (relationships-gate-arcs, Q135
  mindscape centerpiece, Q130 Act 2 spine, Q124 Emil grammar, Q131 betrayal
  staging, Q115 SOMA-truth, when to end research/start compile, production
  quests 046-053 + master compile PARKED).
- STANDING: act-1 grid-power ruling / ragdoll head+neck / multi-enemy dial /
  pinch-zoom cap / perks gap / female + child rigs / gloves slot / mirrored
  garment art / currency logos.
- ANIMATION, THE SECOND DEATH (7/18, UNJUDGED, now a FAKE-PHYSICS RAGDOLL):
  'headshot-2' beside 'headshot' THE TOPPLE (v1, untouched). The whole arc:
  physics-crumple -> keyframe-crumple (Paolo: "so stiff") -> RAGDOLL. Paolo's
  order: "have RULES FOR THE LIMBS and ragdoll it based on a fake physics thing
  for all directions" + he REVOKED the FACE-LAW head lock ("head always faces
  north, i dont like that anymore -- move it with the body"). Built a clean
  Verlet ragdoll (RG in the alpha): gravity + rigid bones + torso braces +
  LIMB HINGE rules (elbow/knee one-way, partial-correct) + a NECK CONE so the
  head flops in range. FREE HEAD that ROTATES with the body via headStampFrame
  (RG_HEADROT follows the real neck->headTop bone; the rigid-upright stamp WAS
  the 'faces north'). Per-direction shot impulse = 8 distinct falls. Anti-jitter
  (the hard part): speed cap + SOFT floor push (hard clamps caused 20-30px leaf
  teleports) + 2.5px/frame per-joint MOVE CAP + freeze-on-settle; waist-centered
  camera + fixed floor. None of v1's fighting laws. Verified all 8 in frame,
  freeze, distinct rests, head rotates. Record: records/BOHEMIA_ANIM_DEATHS_
  7_17_26.txt. Combat bakes both deaths. Judge the FEEL in ANIMATION tab,
  'headshot-2'; headshot-3 still on the table if the ragdoll feel needs tuning.
  LESSON BANKED: verify animation by WATCHING motion, never static frames.
- MUSIC (verdict pass 7/17 PROCESSED; gate #17 gates/music_gate.js guards it
  all): CANON now: THE CANCELLED MAN, THE WIND LEARNS WORDS, THE PIT BOSS IS
  GONE (Paolo loves it; added to the OVERWORLD playlist, now six, his verbatim
  "add to overworld rn"). BURIED 7/17: SUNKEN VESPERS, UNDERTOW (no kill
  reason given; post-mortem in the embedded repo block). FRESH + UNJUDGED
  (batch 9b, NEW badges live): TAPS FOR THE VALLEY (ladderhorn, harmonic-ladder
  bugle) / WHAT THE DAM HELD BACK (tidewheel, nested-AM cascade). STILL
  UNJUDGED from before: SALT ON THE HIGHWAY, WHAT GROWS IN THE VAULT, THE LAST
  TABLE STANDING, MOJAVE GHOST, LONG WALK HOME, ONE CANDLE, MOB THE HOUSE
  REMEMBERS. UI shipped 7/17 per Paolo: export COPY fixed (modern clipboard
  first; the old order burned the iOS gesture window), COMMENT SECTION at the
  bottom of the music page always (persists, rides the export as PAOLO
  COMMENTS). Repair banked: the 7/8 "CANON baked" claim for THE LAST DEALER
  FOLDS + WHAT THE MIRRORS KEPT had never landed in CANON_DEFAULTS; landed now.
  A verdict claimed is not a verdict baked.

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
