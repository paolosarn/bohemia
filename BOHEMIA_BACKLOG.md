# BOHEMIA BACKLOG (the fleet's queue — read via THE GO PROCEDURE)

## *** FLEET-WIDE FREEZE (7/26, ART-FIRST RESET — read laws/BOHEMIA_ADDENDUM_
## ART_FIRST_RESET_7_26_26.md). *** BOTH FREEZES ARE LIFTED AS OF 7/26. ***
## Paolo verdicted the target screen CBB, so the visual constitution EXISTS:
## records/target/BOHEMIA_VISUAL_CONSTITUTION.json, held by
## gates/target_match_gate.py. Every lane may cook new pixels again, and quest
## asks may be surfaced again. THE PRICE: every cook now passes the proxy gates
## (palette ceiling, per-layer value bands, no keyline, no dither, one light
## direction, hashable seam contracts) and every new art bank REGISTERS itself
## in target_match_gate.py's BANKS list. CBB also means the target itself is
## FROZEN and byte-locked - nobody makes another target screen. Verdict record:
## records/BOHEMIA_TARGET_SCREEN_VERDICT_7_26_26.txt ***

## LAB (THE REFERENCE LAB — first word "lab"; law: laws/BOHEMIA_ADDENDUM_
## THE_REFERENCE_LAB_7_26_26.md. One session = one system = one named game.)
1. STARDEW TOWN-WALK FEEL: one town screen, Stardew's exact walk feel (speed,
   acceleration, collision softness), enter/exit two furnished interiors with
   Stardew transitions, day-night tick, one scheduled NPC. Research the real
   numbers online first. | playable page + feel ledger + pattern note | the
   alpha, all engine modules | Paolo plays = the verdict.
2. ZOMBOID LOOT LOOP: containers, search, weight, the tension of rummaging a
   house. Same deliverables. | same | same | same.
3. (Paolo adds more targets by naming a game + system to any lab session or
   to the coordinator.)

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
1. [CLOSED 7/26 - CBB, SHIPPED, FROZEN] THE TARGET SCREEN. Paolo: "Could be
   better." Per the verdict pipeline that is SHIPS + FROZEN + NEVER SPAWNS
   VARIANTS. The tile-reassembled frame IS the target; it and the 42-tile
   starter set are byte-locked in the constitution and changing either needs a
   NEW RULING, not a new render. DO NOT MAKE ANOTHER TARGET SCREEN. All further
   look work happens in the act-1 tileset against this target. Verdict:
   records/BOHEMIA_TARGET_SCREEN_VERDICT_7_26_26.txt. Constitution +
   target-match gate shipped the same turn (215 checks).
   [HISTORY] Amendment C (ANTI-BIOSHOCK) was run for the first time and the mockup
   FAILED it: the painted plate cut into 262 unique tiles for 264 cells - it was
   never a tiled world. Fixed: banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt is
   a real, bounded, NAMED 38-tile set (+11 sprites + cast-shadow DATA), the frame
   is re-laid from nothing but those tiles, and it renders on a real browser
   canvas with integer blit and smoothing off. The first reassembly looked worse
   and the four reasons were specific: no wall corners, a hip roof laid as flat
   stripes, no runtime cast shadows, no gaps between buildings. All four fixed.
   Delta from the painting is now 34/255, essentially all of it the two poster
   passes that belong to the renderer. THE TILE-REASSEMBLED FRAME IS NOW THE
   TARGET and the judge page leads with it. Record:
   records/BOHEMIA_REASSEMBLY_TEST_7_26_26.md. Gate: 1,074 checks, including a
   hard 96-tile ceiling. Backlog item 2 (MASTER ACT-1 TILESET) is now partly
   delivered: this IS the starter set; what remains is the act triptych and
   palette indexing.
   [PRIOR ROUND] THE TARGET SCREEN.
   REV 3 answers the marked-up shot: the nameless bottom band, the fake
   chain-link and the fake power line are DELETED (invented decoration is
   deleted on sight); the radioactive barrel is a plain rusted drum and
   radiation/hazard iconography is now BANNED BY LORE everywhere; the crossing
   spans kerb to kerb with its bars across traffic, lined up with its walk; the
   front door shares a column with its own walk; the garage door is a real
   opening with the driveway running into it; the lamps are the slim blessed
   post, a tile taller and not one pixel wider; and two objects can no longer
   stand on the same ground - the BUILD FAILS. NEW LAW + gate:
   laws/BOHEMIA_ADDENDUM_NAME_IT_OR_DONT_DRAW_IT_7_26_26.md - every thing on
   screen is named, described, sourced, and the build dies if the drawn count
   ever exceeds the named count. Manifest ships with the render and is printed
   on the judge page. Gate: 483 checks.
   [PRIOR ROUND] THE TARGET SCREEN. Paolo:
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
2. (after the pick) MASTER ACT-1 TILESET to the target. INTERIOR COMPOSITION
   SOURCE (7/26): records/BOHEMIA_ROOM_RECIPE_BOOK_7_26_26.md — 12 room
   recipes + composition laws + the 70/20/10 dead-world translation,
   [PENDING Paolo bulk verdict]; on APPROVE, rooms are composed FROM the
   recipes (manifests mapped to the interior pool), never invented.
   INGREDIENT DELIVERED
   7/26 by CITY: banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt - Paolo's Great Sweep
   crossed to real images for the first time (all 87 swept packs resolve against
   the HD masters, 0 unresolved), filtered UP-ONLY, 465 tiles bucketed by room
   function with per-tile draw scale from the sweep's BIG/SMALL flags. Built by
   tools/bohemia_interior_pool_factory.py; re-run it with different caps for a
   bigger set. Bodies/gore excluded on purpose (UP, but a story Paolo places).
   Deliberately NOT wired into the game - the freeze and TILESETS-ARE-SETS say a
   look is judged as one assembled scene, after the pick. produced + judged as
   one assembled scene; act triptych variants in spec. | tileset gate +
   proportion gate (2-tile doors, human scale — the proportion half already
   ships inside target_screen_gate.py) | — | yes, as a set.
3. [RETIRED 7/26 - the work is dead, not done] RE-COOK VEHICLES TO ISO. This was
   only ever needed if candidate B or C won. A won and both are graveyarded, so
   the approved car art is already in the right projection. Removing it rather
   than leaving it to rot at the bottom of the lane.
3b. [PENDING Paolo, carried] THE CAR LENGTH. At true pixel scale the approved
   wreck art is ~2 tiles wide by >4 long, against his locked 2x3 footprint.
   Either the art is re-cooked shorter or the footprint becomes 2x5. Not a
   guess I get to make.

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
   [DONE 7/26] THE OVERWORLD LOOK — the block is laid from the FROZEN starter
   tileset of Paolo's CBB target. Consumed, never re-rendered; the builder
   refuses to ship if the bank md5 moves. CORRECTION ON RECORD: the target he
   picked is TOP-DOWN, so this lane's old "the run must go 3/4 iso" premise was
   wrong and is retired.
   Scoreboard: records/BOHEMIA_RUN_INTEGRATION_LEDGER_7_26_26.md (17/24),
   enforced by gates/integration_gate.js.
-1. INTERIORS TO THE TARGET (new top item). The outside now speaks the
   constitution; inside is still flat role-tinted plates. CITY already delivered
   the ingredient and deliberately left it unwired for exactly this:
   banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt (465 swept-UP tiles bucketed by room
   function, with per-tile draw scale). | interiors laid from the pool, target-
   match proxies green, real-surface screenshot | the pool is CITY's artifact,
   consume it, do not re-cook it | yes, fresh look.
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

0. [DONE 7/26, freeze lifted] THE FIVE SURFACES CONFORM TO THE VISUAL CONSTITUTION.
   Built during the freeze and flagged PROVISIONAL SKIN; the moment Paolo ruled the
   target CBB they were measured against it and the 5 out-of-band palette entries
   (road paint, crosswalks, stop bars, the lake ring) were toned into their layer's
   value band. Locked by a CONSTITUTION CONFORMANCE section in roadcell_gate and
   terrain_gate, which read the constitution at run time. Any NEW cook in this lane
   passes the same section plus the fleet's proxy gates, and any new art BANK
   registers itself in target_match_gate.py.
0b. [PENDING Paolo] ACT TRIPTYCH for the five surfaces: act-2 recovering and act-3
   rebuilt materials. Content, his call, recorded in every dossier.
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
1. [BLOCKED ON THE TARGET PICK] DRESS THE INTERIORS. Paolo killed the first
   interiors ("Dogshit.") and the diagnosis is empty rooms: the shell is lawful
   approved art but it is five textures and no furniture. The furniture is ready
   (banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt, UP-only, bucketed by room function)
   and the role->bucket mapping is written in
   records/BOHEMIA_INTERIOR_KILL_AND_THE_SWEEP_CROSSING_7_26_26.md. Do NOT wire
   it before the target screen is approved - that is the freeze, and dressing
   rooms from loose tiles against no reference is what the reset exists to stop.
   | interiors_gate extended: the pool is UP-only and every drawn tile traces to
   a UP verdict | the shell/mechanism is done, do not re-litigate it | yes - the
   dressed room is judged as an assembled scene, per TILESETS-ARE-SETS.
-1. [DONE 7/26, CITY] THE CITY TAB DREW WORLD ART SMOOTHED. It never set
   imageSmoothingEnabled at all, so it took the browser default (true) and
   bilinear-filtered every approved tile - worst on 3x phones. Fixed at the
   SOURCE (tools/bohemia_city_tab.py), both at context creation and inside
   fit(), because assigning cv.width/cv.height resets the entire 2D context
   state and silently turns smoothing back on. The ART lane's PIPELINE_DEBT
   exemption in target_screen_gate.py is DELETED per its own terms; that gate
   now holds every surface to the contract with no exceptions (484 checks).
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
1o. DONE 7/26 (v76): THE SONGS PLAY OUT + THE PULSE YIELDS. Law:
   laws/BOHEMIA_ADDENDUM_THE_SONGS_PLAY_OUT_7_26_26.md. v75 APPROVED BY EAR.
   (a) Corrected my own 4x error: the creepers run 2.17 kicks / 2.33 hats a bar,
   not 0.54/0.58; the gate now DERIVES the unit from stepDur. Placement is the
   sharper finding: nothing kicks on beat 2, one kick in the pool on beat 4.
   (b) His songs are 2:08 arrangements with the FULL section at 0:48, but every
   NEW ENCOUNTER reset them to bar 0, so he only ever heard the first 40s. Combat
   now waits for a full 1024-step pass before swapping, exactly as CITYMUS
   already did in the overworld. V71's bag fix stands; only the frequency changed.
   (c) The floor now YIELDS instead of doubling 11 kicks and 14 hats his songs
   already played.
   *** STILL FROZEN: every timing mechanic in 1v / 1t / v74's chain. ***
   *** [PENDING Paolo] should the 2/4 rungs unlock the MELODY at all, or only
   energy, or should kills FAST-FORWARD the form instead of unlocking it. His
   7/3 LOCKED law owns those rungs; nothing was moved. ***
1n. (discovered 7/26, NOT fixed, needs HIS ruling) THE OVERWORLD KILL LADDER IS
   A DEAD PATH. MUS.layers starts at 0 and the only assignment in the whole build
   is the studio's CALM/2 KILLS/4 KILLS preview buttons, so the four melody-klay
   creepers can never bloom in the city or the run. What drives intensity out
   there is lore. | gate records the single assignment | — | no.
1p. DONE 7/26 (v75): THE FIGHT PULSE. Law:
   laws/BOHEMIA_ADDENDUM_THE_FIGHT_PULSE_7_26_26.md. Paolo froze new timing
   mechanics until the music and the button work together, so the encounter
   music got COUNTED instead of clock-fixed a sixth time: his creepers average
   0.54 kicks / 0.58 hats a bar (four-on-the-floor is 4 / 8), all half-time. He
   was trying to lock to a pulse not in the recording. His songs untouched; a
   combat-only FLOOR under them in the song's own kit (kick on 4, eighth hats,
   backbeat on 2+4), thickening with the groove chain, plus the count is now the
   song's hat instead of a 415Hz UI beep. PULSE: HARD/SOFT/OFF for an honest A/B.
   *** EVERY TIMING MECHANIC IN 1v / 1t / v74's chain IS FROZEN until Paolo
   rules on this. A SECOND rejection ends the rhythm direction for the session. ***
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

## CHARACTER  (LANE LAW 7/26: laws/BOHEMIA_ADDENDUM_THE_RIG_IS_LAW_7_26_26.md
## — the rig is the starting point of ALL body/anim work; RIG CHECK mandatory;
## AND laws/BOHEMIA_ADDENDUM_SHADOWS_ARE_SEPARATE_7_26_26.md — shading never
## baked into asset pixels, render-time layer only. First items of the lane's
## next session: the rig-check gate assertion + the shading-separation gate
## assertion, same turn.)
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
