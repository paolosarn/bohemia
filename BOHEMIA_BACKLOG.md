# BOHEMIA BACKLOG (the fleet's queue — read via THE GO PROCEDURE)

## *** FLEET-WIDE FREEZE (7/26, ART-FIRST RESET — read laws/BOHEMIA_ADDENDUM_
## ART_FIRST_RESET_7_26_26.md before ANY visual work): until Paolo approves a
## TARGET SCREEN, all NEW visual cooking outside the ART lane is frozen
## (integrating already-approved assets is fine; new pixels are not), and NO
## session surfaces quest questions or quest verdicts to Paolo. ***

## ART (new lane — first word "art")
0. [SHIPPED 7/26] STEP ZERO — THE MOBILE RENDER CONTRACT (amendment D):
   laws/BOHEMIA_MOBILE_RENDER_CONTRACT_7_26_26.md. Pins frame, tile px, integer
   zoom, portrait viewport, proportion canon, ONE light direction, the three
   value bands, no-keyline, no-dither, the pipeline rule and the memory
   constraint. Every number is asserted against the factory's own constants by
   target_screen_gate.py, so contract and code cannot drift. TWO CLAUSES ARE
   HONESTLY UNMET AND SAY SO IN THE DOC: (a) the 64-colour master ramp is
   DERIVED (records/target/BOHEMIA_MASTER_PALETTE.json) but the approved corpus
   is continuous-tone, 59,377 colours across the plates — indexing lands with
   the act-1 tileset (item 2) and is held meanwhile by a ratchet ceiling;
   (b) live canvas memory vs the ~224MB iOS floor is NOT instrumented and the
   gate does not pretend to check it. Order note: amendment D landed on main
   mid-session, so the contract was written FROM the screens, not before them.
0b. (discovered 7/26, needs instrumentation) MEASURE LIVE CANVAS MEMORY on a
   real device against the ~224MB iOS floor. Until then section 8 of the
   contract is a constraint, not a check. | a probe + a gated ceiling | — | no.
1. [RULED 7/26 - DIRECTION SET, LOOK STILL UNJUDGED] THE TARGET SCREEN. Paolo:
   "Front base is the only one I'm concerned with and even then it looks like
   hallucinated AI slop. We made a rule that all cars are 2 x 3 tiles. Yeah the
   roofs are all fucked up not put on correctly yeah." A THE FRONT FACE is the
   direction; B and C are GRAVEYARDED (registry + post-mortem in
   records/BOHEMIA_TARGET_SCREEN_RULING_7_26_26.md) and their renderers were
   DELETED, not disabled. REV 2 fixes both named defects at the root: cars are
   sized from engine/bohemia_prop_scale.js at draw time (never a typed number)
   and turned along the road they died on; SHEAR is 0 forever, so a roof sits
   square on its own walls and is a real hip form (ridge, hip ends in the roof's
   own material, fascia, eave shadow). Judge page is now ONE TAP: GOOD ENOUGH /
   COULD BE BETTER / STILL SLOP, with both fixes shown under a tile grid.
   Gate: 91 checks. STILL OPEN: whether the LOOK is there. If it comes back
   STILL SLOP the named next suspects are the one-tan value range, the unindexed
   palette, and boxes-instead-of-massing. Do not act on those before he rules.
1-OLD. [superseded] the three-candidate sitting
   (A THE FRONT FACE / B THE ISO BLOCK / C THE CUTAWAY), each side-by-side with
   a real screenshot of the shipped run, judged from alpha -> LIFE -> PICK THE
   TARGET SCREEN. Built entirely from approved banks; the body is baked by the
   alpha itself. Record: records/BOHEMIA_TARGET_SCREENS_7_26_26.md. Gate:
   target_screen_gate.py (63 checks, registered) — it holds 2-tile doors, human
   scale, three-tone/no-keyline, dead-dark glass, and law 4's quest-ask freeze.
   NOTE: they were composed BEFORE amendment D landed on main, so item 0's
   MOBILE RENDER CONTRACT is written FROM them (records/target/BOHEMIA_TARGET_
   SPEC.json already pins resolution, tile px, integer scale, portrait viewport,
   light direction and the three-tone/no-outline rule) rather than the other way
   round. Amendments B+C (cut-and-reassemble acceptance, proxy gates) attach at
   the moment of the pick, not before it.
1b. (blocked on the pick) WRITE THE PICK IN: status PICKED in the spec, losers
   to the graveyard with a post-mortem, target-match diffing on, proxy gates +
   the cut-and-reassemble acceptance test per amendments B+C, freeze lifted.
2. (after the pick) MASTER ACT-1 TILESET to the target, produced + judged as
   one assembled scene; act triptych variants in spec. | tileset gate +
   proportion gate (2-tile doors, human scale — the proportion half already
   ships inside target_screen_gate.py) | — | yes, as a set.
3. (discovered 7/26, blocked on the pick landing on B or C) RE-COOK THE VEHICLE
   FAMILY TO THE PICKED PROJECTION. The approved car wrecks were cooked
   near-top-down; in true 2:1 iso they read wrong, and the target screens show
   that cost on purpose instead of hiding it. Dead work if A wins. | vehicle
   sprites sit correctly in the picked projection, art_45 + vehicle_size green |
   the approved bank stays intact until a verdict retires it | yes.

Rules (full doctrine: laws/BOHEMIA_AUTONOMY_DOCTRINE_7_26_26.md): topmost
unblocked item in YOUR lane; [PENDING Paolo] items are SKIPPED, never resolved;
only Paolo/verdicts add direction-class items; agents may append (discovered)
items; every item works to the Definition of Done. Entry shape:
GOAL | DoD beyond the standard | DON'T TOUCH | needs-verdict-before-volume?

## RUN  (LANE CHARTER CHANGED 7/26 — read
##       laws/BOHEMIA_ADDENDUM_THE_RUN_IS_THE_INTEGRATION_LANE_7_26_26.md first.
##       This lane INTEGRATES what the fleet built; it does not add features, and
##       the run's quest is disposable scaffolding, never judged.)
   [DONE 7/26] THE FIRST CONNECTED RUN — shipped, gated. Record:
   records/BOHEMIA_THE_FIRST_CONNECTED_RUN_7_26_26.txt.
   [DONE 7/26] THE REAL CAST — the run wears the real rig + wardrobe + face.
   [DONE 7/26] REAL ANIMATED DOORS (2 tiles tall, approved 7/13 bank) + MUSIC
   (the alpha's own synth scores the walk). Law:
   laws/BOHEMIA_ADDENDUM_DOOR_LAW_TWO_TILES_TALL_7_26_26.md.
   [DONE 7/26] SAVE / LOAD — one portable versioned blob (sleep + manual +
   autosave, export/import code, no device prefs inside, old versions migrate
   forward) and DEATH IS A RELOAD wired to it.
   Scoreboard: records/BOHEMIA_RUN_INTEGRATION_LEDGER_7_26_26.md (16/24),
   enforced by gates/integration_gate.js.
-1. THE OVERWORLD LOOK. Paolo 7/26: "it's kind of looking like shit the whole
   overworld." SUPERSEDED IN OWNERSHIP by the ART-FIRST RESET the same day
   (laws/BOHEMIA_ADDENDUM_ART_FIRST_RESET_7_26_26.md): the ART lane owns the
   TARGET SCREEN, and until one is approved NO new visual cooking happens
   outside that lane. So this lane does NOT cook a look. What it does, in
   order: (a) keep integrating ALREADY-APPROVED assets (explicitly still
   allowed), (b) the moment a target screen is picked, move the run's world
   render toward it — the CITY tab's human mode already renders the real
   three-quarter world with the real character, so adopt that renderer rather
   than growing a second one. | ledger row flips with a probe + a real-surface
   screenshot | CITY_B64 is the CITY lane's file; the target screen is the ART
   lane's | blocked on the target-screen verdict.
0b. THE REAL VALLEY (ledger priority 2): the run's block becomes a real cell of
   the generated valley, so walking off it lands in a real district. | run_gate
   proves a second district reached on foot | district engines | no.
0c. DISTRICT ART / MUSIC / DAY CYCLE (ledger priorities 3-5), in that order.
1. Phone-feel pass on the run (touch responsiveness at arm's length): real
   device-shaped viewports, hold-to-walk tuning, tap-to-step target sizes,
   the objective bar at arm's length. | run_gate extended with a real-device
   viewport pass | engine/bohemia_loop.js (flag needs to WORLD) | no.
2. (discovered) WIDEN THE RUN: the run is one seed-7 block. Walking off the
   block into the neighbouring district is the next real milestone — needs the
   world model's plot-to-plot transition, not new content. | run_gate proves a
   second district reached on foot | district engines (CITY lane owns them) | no.
3. (discovered) The player is not registered in ctx.scheduler, so the run's
   grid clock is the block sim's, not the loop's turn scheduler. Engine request
   for WORLD: a player actor the run can commit() through. | loop gate section
   | engine/bohemia_loop.js | no.
4. (discovered) Only S01 is wired into the run. Once placement is ruled, the
   other twenty canon quests should be reachable from a run surface too. |
   run_gate covers a second quest end to end | quest text | [PENDING Paolo
   placement].

## WORLD
LANE RULING (Paolo 7/26, LOCKED — laws/BOHEMIA_ADDENDUM_WORLD_BEFORE_QUESTS_7_26_26.md):
"we need to actually build a fucking world." This lane does NOT work on quests. Every
quest item is PARKED until Paolo himself reopens it. Build ground, not plumbing for
stories the world cannot host yet.

0. UNDER THE VISUAL FREEZE (ART-FIRST RESET, Paolo 7/26): this lane ships STRUCTURE
   only until the target screen is approved. Ground that exists, blocks, and can be
   walked is structure; a palette is not. The five surfaces already built are flagged
   PROVISIONAL SKIN and get re-skinned to the target when it lands. Do not surface any
   of them for an art verdict, and do not cook decorative tiles in this lane.
1. DONE 7/26: THE GROUND IS BUILT. Roads (arterial 2,434 + freeway 952) and terrain
   (mountain 927 + desert 620 + water 74) all generate real ground on one continuous
   valley-wide noise field. Valley: 40% -> 95% generated. Gates ROAD CELLS + TERRAIN.
   WHAT IS LEFT UNBUILT, in order of size, and it is all LANDMARK work now:
     a. airbase 54, airport 40 (one generator, an airfield kit: runways, aprons,
        hangars, taxiways) | its own gate | — | new ground LOOK = judge before volume.
     b. rail 90 + interchange 16 (rail corridor cells + freeway-to-freeway ramps;
        both are network tiles like the roads, same machinery) | roadcell_gate
        extended | — | no.
     c. campus 16, town 9, speedway 12, ballpark 8, convention 6, datafort 6,
        prison 4, dam 4, basin 8, reservoir 3 (small landmark set, one at a time).
     d. NEVER AUTO-GENERATED, by law: strip 81, resort 118, casino 5, luxor, sphere,
        strat, highroller, sign. Paolo's hand. Leave them reserved.
2. AMBIENT ENCOUNTER DIRECTOR (APPROVED 7/26, records/BOHEMIA_VERDICT_ACT1_
   ROSTER_7_26_26.txt): the walk-surface encounter system — storyteller tension budget
   (never dice), 70/20/10 ambient/interactive/forced ratio, district+day/night spawn
   tables, rare-is-sacred caps, ~90s min gap. The 12 approved act-1 encounter types as
   spawnable tokens routing into the standard encounter handoff; patrols-collide as
   world-on-world. Enemy ART is NOT this item (approved-assets-first, separate judge).
   | director proven headless: ratios hold over a simulated long walk, no repeat-spam,
   deterministic per seed | pacing ruling (no background ticking when player idle) |
   design approved; art needs thumbs.
   NOTE: this is world content, not quest plumbing, so the 7/26 ruling does not park it.
3. INTERIORS FOR THE GROUND THAT HAS THEM: coordinate with CITY (they own the district
   interiors item) so nothing is built twice. | — | CITY lane's item 1 | no.
4. [DONE 7/26] Engine support for RUN, request 1 of 2: THE VALLEY TILE + CROSSING
   (world.tile / solidAt / step / walk / route). The run can now ask the world model for
   any tile in the valley and walk across cell boundaries on real ground; gate CROSSING
   proves district -> street -> district on foot. RUN's ledger priority 2 is unblocked.
   [DONE 7/26] request 2 of 2 as well: THE WALK SURFACE
   (Loop.makeWalkSurface + ctx.walk) — a player actor in a real loop scheduler in
   valley tile space, blocked by the world's own tiles, with commit/routeTo/follow.
   Gate CROSSING is 22 checks and walks it end to end. RUN item 3 is unblocked.
5. Further engine support requests flagged by RUN (as they arrive, priority). | per
   request | — | no.
5. (discovered 7/26) VALLEY COMPOSITION: 70% of the built valley is suburb, and there are
   301 solar cells but 1 library, 1 firestation, 1 jail. Whether that is the city he wants
   is a DIRECTION call. | — | — | [PENDING Paolo].
6. (discovered 7/26) Faction bases are an even stride across the district list, so all 14
   factions sit on suburb tracts holding 1 cell each. Whether a faction's ground should
   match its trade is his call; the mechanism is a small change to bootFactions.
   | — | — | [PENDING Paolo].

PARKED BY THE 7/26 RULING (do not pick these up):
- P1. Quest placement picks -> apply as a casting-bridge override. The candidates shipped
  (all 21 quests after the QUESTS lane folded theirs in) and the judge page is live in
  the LIFE tab; it stays there, unjudged, unsurfaced.
- P2. World bridge deepening (quest outcomes moving factions on the map).

## CITY
-1. (discovered 7/26 by the ART lane's render-contract gate, ONE LINE) THE CITY
   TAB DRAWS WORLD ART SMOOTHED. slices/BOHEMIA_CITY_CURRENT.html never sets
   imageSmoothingEnabled at all, so it takes the browser default (true) and the
   pixel art is bilinear-filtered on every device — worst on 3x phones. The RUN
   slice sets it false in two places; the city never did. The ART lane did not
   reach into another lane's live file: target_screen_gate.py prints it as a
   KNOWN GAP on every run and the exemption must be DELETED the moment this is
   fixed. | smoothing off wherever the city context draws world art; the ART
   gate's PIPELINE_DEBT entry removed in the same commit | — | no.
1. INTERIOR PROPS FROM THE GREAT SWEEP (discovered, CITY 7/26). Interiors ship as
   a blessed but EMPTY shell: approved walls/doors/windows/floors, no furniture.
   The prop authority is banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt (2,604
   judged, 1,927 UP), keyed by (pack, idx) into banks/BOHEMIA_HD_TILE_REPO_part
   1-4. The app's TP_TILES is a DIFFERENT cut, keyed by category/index, and it is
   the raw un-swept corpus (sampling it put purple + neon in a house). Build the
   pack/idx -> app mapping, emit an UP-only interior prop pool, then dress rooms
   BY ROLE off the district dossiers ("registers + coolers + aisles up front",
   "rows of rusted lockers, a dead shower block"). | reusefirst + purity + the
   dead-world laws green with props on; interiors_gate extended to assert the
   prop pool is UP-only | never sample TP_TILES for shipped art | yes, fresh look.
2. MARRY COMMERCIAL (discovered, CITY 7/26). The corner plaza has NEVER been
   registered with the district kit (it never binds K, and the registration sits
   behind a `typeof K` guard that silently swallowed it), so the walked city
   still renders commercial from the LEGACY PREFAB STAMPS — not the canon plaza,
   nothing enterable. Binding K is one line and turns walkable_gate RED: on a
   single W or N street the generator builds only ONE store strip and parking
   fills the rest (drive 61% vs content 30%). Fix the mid-block/single-edge form
   FIRST, then bind K. Full numbers in the module's own head comment + records/
   BOHEMIA_INTERIORS_EVERYWHERE_7_26_26.md. | walkable_gate green with commercial
   swept + interiors_gate proves a plaza store is enterable | the S/corner form is
   approved, do not reshape it | the mid-block plaza form is [PENDING Paolo] per
   the module's own NOTES — surface it as rendered candidates, do not pick one.
3. GARAGE + CRYPT INTERIORS IN THE ALPHA (discovered, CITY 7/26). The engine
   DISPATCHES a building's interior by kind (garage -> multi-deck parking, crypt
   -> vault hall, everything else -> rooms) and world_gate proves it. The alpha's
   STEP-INSIDE renders the ROOMS kind only, so walking into a parking structure
   or a mausoleum gets you a floorplan instead of decks/vaults. Embed
   bohemia_garage.js + bohemia_crypt.js in CITY_B64 (resync tool exists now) and
   branch the render the way the engine branches. | interiors_gate extended to
   assert all three kinds render | engine dispatch is correct, do not touch it |
   the deck/vault LOOK = judge before volume.
4. Interiors everywhere: DONE 7/26 (records/BOHEMIA_INTERIORS_EVERYWHERE_7_26_26
   .md). Left standing: THE UNDERGROUND behind wash's sewer tunnel mouth is a
   LIFE-lane below-grade level, not a room in a footprint. [PENDING — LIFE lane]
5. District volume: next Pocket-City-type gaps that fit the dead world, on
   the KIT, full touchpoint list per the architecture map. | per-district gate
   x6 configs | bespoke strip/casino (Paolo's hand) | new district LOOK =
   judge before volume.
6. (discovered, coordinator 7/25) RIG_B64/PREFAB_B64 byte-lock holes + sync-
   canon gaps (PLOTGEN/POWERGRID/FLOORPLAN/TRANSITIONS). NON-COOK item. |
   new byte-lock gates registered | — | no.
   (CITY 7/26 note: tools/bohemia_city_module_resync.py now re-syncs every
   engine module inlined in CITY_B64 and `--check` reports staleness, which is
   the freshness half of this item for the CITY app. It caught commercial +
   suburb + district_kit all silently behind. The remaining half is the same
   treatment for RIG_B64/PREFAB_B64.)

## COMBAT
1w. DONE 7/26 (v69): the four rhythm-game pillars - approach ring, graded press
   with a persistent ms strip, the shot plays a note in the song's key, and a
   SYNC tap-calibration. Law + what is still missing:
   laws/BOHEMIA_ADDENDUM_WHAT_MAKES_IT_A_RHYTHM_GAME_7_26_26.md.
1v. RHYTHM AS DIFFICULTY (next, from that addendum): the 52 dial patterns are
   curve shapes, not rhythms. A rhythm game gets harder by getting more
   syncopated, not faster. Author patterns as note values against the bar.
   | gate asserts each pattern's kill moments land on declared note values |
   the PHASE re-bake machinery exists, reuse it | new dial feel = he plays it.
1u. THE WHOLE FIGHT ON THE GRID: the return volley, deaths, steps and camera
   hits are not quantized, so only the dial is musical. | gate proves every
   fight event resolves on a beat | 120 BPM law | no.
1t. A COUNT-IN BAR when an engagement opens, so you enter already inside the
   pulse. | — | do not delay the pop itself | no.
1z. DONE 7/26 (v68, Paolo's 120-BPM-FIRST law): every dial cycle is a whole BAR
   (44% of pattern x difficulty combos could never land the perfect shot on a
   downbeat), the PHASE table re-solved against it, and the press is now a
   REQUEST granted on the beat. [PENDING Paolo] whether the POP should be
   beat-gated too (it would neutralise the ON THE ONE streak reward).
1y. (discovered 7/26) THE DIAL ENGINE HAS NO MASTER. The stamped block says
   "edit engine/bohemia_engine.master.js then re-stamp"; that file and the
   stamper do not exist anywhere in the repo. Either restore a master + stamper
   or delete the misleading header. NON-COOK. | a sync/byte-lock gate for the
   engine block | — | no.
1a. DONE 7/26 (v67, straight from Paolo playing it): dial locked to the AUDIO
   clock + whole-bar cover cycles; suppression turn-based and legible; sprint
   costs stamina and the refill no longer refunds it; sprint/dash mutually
   exclusive with the armed move named on the ring. [PENDING Paolo] the cycle
   rebalance it forced: package 2 slowed 6->8 beats, package 3 quickened 6->4.
0. ALLY-IN-COMBAT foundation (RULED 7/26, companions addendum): the encounter
   system supports friendly combatants on the player's side — spawn, target
   correctly, go down but never permanently die. Mechanism only; WHO joins
   and companion personalities are Paolo's/quest canon. | proven headless: an
   ally fights alongside through the real bus, downed ally never deleted |
   CITY_B64 | no.
1. DONE 7/26 (v66): encounter handoff hardening for the RUN. Contract:
   laws/BOHEMIA_ADDENDUM_RUN_HANDOFF_CONTRACT_7_26_26.md. Quest context in,
   dead/spared/fled out, declared LEAK LIST, cold handoff with the tab never
   opened, READY queue, abort, loud errors, no splash. 5 back-to-back
   EXECUTED headless in combat_lab_gate sections 5-6, plus a real-surface
   Playwright proof. The cold handoff went 12.9s -> 14ms (blocking font).
2. Combat grammar graduation: stack candidates in ONE judge surface. | judge
   reachable from alpha, side-by-side anchors | — | yes (thumbs then build
   the winner).
3. (discovered 7/26, RUN lane's call) The alpha SHELL carries the same
   render-blocking cross-origin font link the combat demo did. Combat fixed
   its own blob only (lane discipline). Same one-line fix, whole-game boot
   payoff: `media="print" onload="this.media='all'"`. NON-COOK.
4. (discovered 7/26) The demo's melee/nerve loop re-rolls `pickRandomFaction`
   twice on a quest handoff (startGame + the shuffle hook). Harmless, same
   distribution, but it is duplicate work on the enter path. NON-COOK tidy.

## CHARACTER
1. (DONE 7/26 -- records/BOHEMIA_BODYVAR_SLIDERS_7_26_26.txt) ONE-RIG VARIATION
   SLIDERS. Shipped with gates/bodyvar_gate.js + a real-browser clip-set sweep.
   The RANGES are now waiting on Paolo's thumb; do not re-cook them, and do not
   wire per-NPC randomisation until he rules on it.
2. Wardrobe: new SHAPES (structure-not-color), taste-filtered before
   surfacing. | structure_gate | — | fresh shapes = thumbs.
3. Music pool volume in approved styles, taste-filtered. | music gates | — |
   fresh songs = thumbs.

## QUESTS — HIBERNATED (Paolo 7/26, laws/BOHEMIA_ADDENDUM_QUESTS_LANE_
## HIBERNATED_7_26_26.md). Do NOT pick up items below; no "quests" sessions
## until Paolo reopens the lane. All shipped quest work stays live and gated.
1. DONE 7/26 (S10-S21 shipped, corpus 9 -> 21, gate hardened with 5 new checks,
   laws/BOHEMIA_ADDENDUM_TWELVE_MORE_CANON_QUESTS_7_26_26.md). Sitting is live in
   the alpha: LIFE tab -> THE 12 NEW CANON QUESTS. Awaiting thumbs.
2. Act-1 main-quest beats from the locked lore (cold open -> flash-flood climax)
   drafted as .bq chains. START by querying records/BOHEMIA_QUESTBOOK_LAW_INDEX.json
   (QUEST STUDY LAW) and cite what you build from. | same bar as S10-S21, plus
   chain continuity proven headless | engine code, the alpha | yes.
2b. (discovered 7/26) The PORTS master is a 1,276-item BUILD QUEUE written for
   Bohemia by name and almost none of it is built. Mine it for the next quest
   batches instead of inventing shapes. NON-COOK triage first: list the ports
   that are already satisfied vs open. | the index makes this queryable | — | no.
3. (discovered 7/26) MULTI-QUEST CHAIN SUPPORT: nothing in the format or the
   runtime lets quest B read that quest A resolved (S09 -> S06 is a chain only in
   prose). Act-1 beats need it. NON-COOK item: a cross-quest flag surface on
   ctx.quests + a gate proving A's ending really opens B. | new gate section |
   the .bq format's no-stat-gates law is untouchable | no.
4. (discovered 7/26) The batch plants unread flags (opened_the_deep,
   aired_the_method, killed_the_token, walked_them_out, owes_the_cartel,
   sold_the_forger). Nothing consumes them. Wiring them to world beats is
   [PENDING Paolo] at the canon level; the mechanism half is item 3.

## SHARED / ANY IDLE SESSION (non-cook)
1. VERDICT TOOLING upgrade per the doctrine: one AGGREGATED judge page across
   lanes grouped by discipline, side-by-side anchors, APPROVE/CBB/KILL
   buttons, kill-reason tags, .txt export. | replaces per-lane judge sprawl;
   gate: the page exists + exports parse | — | no (tooling, not art).
2. [PRIORITY UP 7/26, Paolo direct order — approved-assets-first addendum]
   CANON EXEMPLAR INDEX + KILL-REASON TAXONOMY distilled from banks +
   graveyard post-mortems (machine-readable; cooking tools cite which
   exemplar anchored each cook). | reusefirst-style gate extension | — | no.
3. DRIFT CANARY harness: re-render fixed approved anchors, diff vs blessed.
   | canary gate registered | — | no.
