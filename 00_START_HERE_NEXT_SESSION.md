=== BOHEMIA HANDOFF 7/23/26 (BACKEND WIRING + FIRST PLAYABLE SIDE QUESTS) ===
FILENAME LAW: this file is always named 00_START_HERE_NEXT_SESSION.md, lives at
repo root, sorts to the top of every file list, and is REWRITTEN at the end of
every working session. There is only ever ONE. It is the first thing any session
reads after CLAUDE.md.

## LATEST (7/23/26) — READ THIS FIRST
Two backend systems landed, both machine-gated, ALL GATES GREEN (python3
gates/bohemia_gates.py --fast, ~59s). NO phone-app work (Paolo 7/22: "let's stop
with this phone app for now") — this was all engine/quest layer.
1. FACTIONS + ECONOMY WIRED into the loop boot context (gate: LOOP
   FACTIONS+ECONOMY, 31/31). bootFactions/bootEconomy were empty stubs; the real
   engine modules + canon faction graph already existed unwired. ctx.factions,
   ctx.factionConstraints, ctx.factionBases, ctx.economy are live now. Details:
   laws/BOHEMIA_ADDENDUM_FACTIONS_ECONOMY_WIRING_7_22_26.md. (Also fixed a real
   UMD closure-scope bug in bohemia_loop.js — the factory function is a sibling
   arg to the outer IIFE, NOT nested, so new outer-scope consts must be threaded
   through factory(...) as params, never assumed reachable by closure.)
2. PLAYABLE CANON SIDE QUESTS — NINE of them now (gate: CANON QUESTS, 134/134).
   Paolo: "CREATE THE BEST BOHEMIA SIDE QUESTS YOU POSSIBLY CAN" then "CONTINUE."
   The corpus had 53 design-doc quests (.md) + one non-canon reference .bq, but
   NOTHING canon actually PLAYED. Now nine playable .bq side quests live in
   quests/bq/: S01 The Meter Reader (electricity/TRADES/NETWORK), S02 The Same Crate
   Twice (double-agent/REDS/BLUES), S03 One More Set (performer/COLORFUL), S04 What
   Cries in the Deep (contract/HOMELESS/NETWORK), S05 The Standing Bounty (repeatable
   dark grind/REMNANTS), S06 Behind the Fence (MARCO + daughter, founding), S07 Say
   It Back (faith no-combat/CHURCH), S08 The Toll Road (racket-break/CARTEL/CARAVANS), S09 The Back Door (Marco pre-wall trust).
   Each parses clean, validates with ZERO errors AND warnings, plays exhaustively to
   COMPLETE, loads through the live loop, and is CLOUT-tagged by the LOUDNESS of the
   resolution (same quest, quiet finish = 8 follower-weight, reckless = 110, ~14x —
   emergent, never a visible label; mechanical proof of "reckless beats quiet" AND of
   Paolo's correction that the player does not CHOOSE clout). S06 is the clout
   mechanic's SOUL: Marco's daughter is a POST-WALL reveal (locked 7/23 -- she is
   HIDDEN/protected, revealed only after the wall comes down, recontextualizing
   everything; S09 is the pre-wall trust quest that sets it up). Receiving that
   trust quietly earns the FEWEST followers (8) + deepest bond (+35); going public
   costs Marco (-15). Sequence: S09 pre-wall -> wall -> S06 reveal.
   Details: laws/BOHEMIA_ADDENDUM_PLAYABLE_SIDE_QUESTS_7_23_26.md + quests/bq/README.md
   + the PLAYABLE section atop quests/BOHEMIA_QUEST_BIBLE_INDEX.md.
   PENDING PAOLO: world PLACEMENT (which NPC/block — MAP LAW, his call; they cast
   against ROLES so they are placement-ready), delta tuning, whether the
   looked_under_the_rock unrecorded flag (set by S01/S04 when you go loud "down
   toward the water") triggers a real Amalgamation escalation beat later.
4. ACT 1 = THE AMALGAMATION IS A GHOST (7/24, Paolo lore lock). The word
   "Amalgamation" is NOT used until the END of Act 1, and Act 1 NEVER reveals it is a
   machine/AI/server. It is presented as a haunting: ghost, demon, otherworldly,
   paranoid-psychosis, whispers, demonic/scary. The reveal that it was technology all
   along is the end-of-Act-1 rug-pull. Purple stays the wordless "near the secret" tell,
   read in Act 1 as the color of the haunting. See
   laws/BOHEMIA_ADDENDUM_ACT1_AMALGAMATION_IS_A_GHOST_7_24_26.md.
   THE DEMO DIRECTION (Paolo's original idea, now the spine): start in the OVERWORLD,
   descend into the WASH/TUNNELS. Surface = real crazy tech-scavenger homeless; deeper =
   "made-tech" NeuroLinked possessed-seeming homeless (the machine's, but Act-1-framed as
   the demon's). Design spine (canon-consistent): the homeless live over the deep servers
   safely because they never LOOK; the player's quest is to LOOK, which is the one thing
   that makes the deep lethal (proximity-to-the-secret = threat, not player strength).
   TECH RESEARCH LANDED (7/24): laws/BOHEMIA_ADDENDUM_EMERGING_TECH_RESEARCH_7_24_26.md. Two
   things LOCKED from it: (1) THE REVEAL ENGINE -- every Act-1 haunting has a documented real
   mechanism under it (TPJ stim = sensed presence, temporal-lobe stim = voices, DBS = agency
   loss/possession, edge-alive robots = restless dead, generative data-portraits = the dead
   who came back, distributed no-center process = the unkillable demon); the tech literally IS
   the ghost story. (2) THE ECONOMIC ACCELERANT -- the crash was a circular-vendor-financing
   tech bubble (Nvidia->OpenAI->Oracle in real life; Lucent/Nortel telecom crash as the exact
   historical rhyme; the bubble is WHY a dead world has sci-fi salvage everywhere). Rest of the
   file is a PALETTE (BCI/whisper, head-drone scout rig, puppeted humanoids, the mesh you
   can't kill, dark datacenters) -- Paolo's picks, not locked. The demo's REASON-TO-DESCEND
   is still the open question going to Paolo.
5. MARCO LOCKED (7/23, Paolo, "VERY IMPORTANT"): the founding Neighbor is named MARCO
   and HE HAS A DAUGHTER. The founding is now two real families behind the shared
   fence. Daughter's name/age NOT set (Paolo's call, do not invent). See
   laws/BOHEMIA_ADDENDUM_MARCO_THE_NEIGHBOR_7_23_26.md + the updated Neighbor section
   in laws/BOHEMIA_ADDENDUM_ACT1_OPENING_VISION_7_19_26.md. Canon index regenerated.

--- older state below ---

=== BOHEMIA HANDOFF 7/20/26 (STORY-SPINE MARATHON + THE QUEST SPINE PLUMBING) ===

READ ORDER: CLAUDE.md -> this file -> laws/BOHEMIA_STORY_MASTER_7_18_26.md (the
connected story spine) -> BOHEMIA_CANON_INDEX.md -> the 7/18-19 addenda listed
below. For the pre-story-marathon technical/art/questbook state, laws/
BOHEMIA_STATE_OF_PLAY_7_17_26.md + git history carry it.

## WHERE WE ARE
A long 7/18-19 LORE-DESIGN MARATHON with Paolo (a lore-yap session that turned
into locking the whole narrative architecture) built out the story spine end to
end: the world, the Amalgamation, the three-act shape, the Moon finale, the three
endings, the core theme, and the entire Act 1 opening. All committed as dated
addenda + one consolidation master. The live work is now STORY DESIGN and the
first ORIGINAL Bohemia quests. All gates green (python3 gates/bohemia_gates.py
[--fast], ~51s). Questbook hit 150 on 7/18 and is now 151 (added #235, the
Kingdom Come opening teardown, as the template for our own opening).

## THE PLAYABILITY PIVOT + THE VERTICAL-SLICE MAP (7/19 — the new north star)
PAOLO'S REALIZATION (7/19): he cannot judge a quest by READING it, only by PLAYING
it. He is the sole playtester. So QUEST-JUDGING IS GATED ON A PLAYABLE SLICE, and
his involvement in quest design is limited until then. This does NOT put quests on
hold; it REORDERS priority toward PLAYABILITY. He also said "I don't think we're
ready" for the big build, and "we'll try whatever you need" — so the near-term job
is getting READY, not forcing the build. The build itself is the deliberate
WITH-PAOLO, one-session, ONE-ALPHA-LAW job, done when he's ready.

THE GOAL SLICE: walk out of a house -> cross a small neighborhood -> reach an NPC
-> talk -> receive & play ONE quest (tracked objectives + one branch) -> SAVE/LOAD.
That one loop switches on his director's eye.

CODE-VERIFIED MAP (agent gap analysis 7/19). WE ARE ~HALF-WAY:
- HAVE (reusable): a walkable ANIMATED player in a streamed Las Vegas, 8-dir
  beat-quantized movement + collision + a bike ladder + day/night (the CITY module's
  human mode; ALSO likely present editable in slices/BOHEMIA_LIVE_SLICE_V11_7_16_26.html
  — the intended BUILD BASE, far better than the 31MB alpha blob). A working
  localStorage save/restore (CITYSAVE, but position/seed/time ONLY). The .bq parser
  (engine/bohemia_bq.js — PARSE/VALIDATE only). Combat dial (works; OUT of slice
  scope). Music (done; irrelevant to slice).
- BUILT 7/19 (the crux, done ahead of the build session): THE QUEST RUNTIME /
  interpreter. engine/bohemia_quest_runtime.js now actually PLAYS a parsed .bq
  (stages, talk nodes, entry/gate conditions, @DO verbs, objectives, COMPLETE/FAIL),
  UI-agnostic, state as plain JSON (ready for the quest-aware save). Proven headless
  by engine/bohemia_quest_runtime_tests.js (33/33: the reference sample played to
  both a COMPLETE and a FAIL), wired as the QUEST RUNTIME gate. The single hardest,
  no-prior-art piece is DONE.
- ALSO BUILT 7/19 (dev demo): slices/BOHEMIA_QUEST_DEMO_7_19_26.html, a tappable
  standalone that plays a .bq through the runtime (browser-verified). Paolo's rule:
  NO MORE fake demos without real assets — this one stays as a dev/verification tool.
- CORRECTION 7/19 (READ-BEFORE-BUILD paid off, and a mistake owned): the SAVE, the
  generational FOLD, deterministic HEIR selection, and the amalgamation model (which
  still carries a recorded flag, now ALWAYS true per TOTAL RECALL, so blindSpot=0)
  ALREADY EXIST, mature and tested, in engine/bohemia_engine.js
  (the 3,600-line chat-era monolith, 80/80 via engine/bohemia_tests.js — see
  BohemiaEngine.Save recordChoice/reconstruct/Persist and BohemiaEngine.Generations
  foldGeneration/selectHeir/foldFromSave/amalgamationModel, hardened by the
  FOLD_DETERMINISM addendum). Earlier this session I built bohemia_save.js and
  bohemia_ledger.js as "new bricks" — they DUPLICATED those and were REMOVED. The
  gap-analysis agent MISSED bohemia_engine.js; do not trust that agent's "fold/save
  is paper only" line. GATE GAP CLOSED: those 80 tests were not in the suite; added
  as the ENGINE CORE gate. So the real asset-free backend is: the quest RUNTIME (new,
  genuinely missing) + the existing engine monolith (fold/save/ledger/combat/factions/
  rig), now both gated. The runtime, when wired, feeds choices into the engine's
  recordChoice (with the recorded flag) — do NOT write a second save/ledger.
  [PENDING future: whether to EXTRACT the monolith's Save/Generations into modular
  files is a deliberate refactor (preserve the determinism laws + 80 tests), NOT a
  fresh parallel rewrite.]
- ACCESS SPINE (Paolo 7/19: "any part of the game can pull from it at any time"):
  the pull-from-anywhere architecture already exists — engine/bohemia_loop.js's
  GameContext (ctx), the single object every system hangs off (rng/clock/world/save/
  scheduler/worldMap/folds/...). It boots clean. The quest runtime was the one silo;
  now WIRED as ctx.quests (bootQuests + a QuestManager wrapping BQ+BQRuntime),
  save-bridged (in-flight quests resume on reload). Gated: LOOP QUESTS (12/12).
  RULE GOING FORWARD: any new system hangs off the GameContext, never a silo.
  SOCKETS POURED so far: ctx.quests (LOOP QUESTS gate) and ctx.spawner (bootEntities
  now creates the deterministic enemy Spawner + shares ctx.deltas; LOOP ENTITIES gate;
  spawnActorsForDistrict/updateDistrictLOD use it).
  THE FEED PIPE (7/20, LOOP LEDGER gate 16/16): quest choices AND COMPLETE/FAIL
  outcomes played through ctx.quests flow into the SAME choice-log the fold reads
  (E.Save.recordChoice), so a quest actually MOVES THE DYNASTY instead of dying in
  the runtime. TOTAL RECALL (Paolo 7/20): everything is remembered on the feed,
  ALWAYS recorded:true. There is NO secret/off-feed channel (the recorded:false
  split was a Claude-originated framing Paolo REJECTED and RETIRED 7/20 — see
  CANON CHANGE below). The record-sink wraps the runtime's own choose/begin/setStage
  (runtime untouched), fires the outcome once, and a restored-already-done quest
  never re-fires.
  THE TALK-TRIGGER + ACQUISITION CHANNELS (7/20, LOOP TALK 14/14, LOOP CHANNEL 11/11):
  ctx.quests.place(text,{x,y,layer,speaker,channel}) binds a quest to an NPC tile
  (starts it, rides the save). channel = 'feed' (pick up over the PHONE; surfaces in
  ctx.quests.feedOffers()) or 'inperson' (the phoneless, like the homeless: NOT on
  the phone, only reachable by pulling up). Loop.talkablesNear(ctx,px,py,radius=1) is
  "pull up on them" — the talk nodes begin-able now (NPC within chebyshev radius +
  entry holds; a done quest falls silent), and the ONLY way to reach an in-person
  quest. Loop.talkTo(ctx,questId,node) begins it, returns the speaker view; choosing
  feeds the feed automatically. Authors no dialogue, decides no geography.
  THE FEED VIEW (7/20, LOOP FEED gate 11/11): Loop.buildFeed(ctx,{limit}) = the master
  window Paolo described (the phone menu of everything you've done), the newest-first
  post stream projected over the recorded choice-log. Pure projection of save.choices;
  authors nothing; computes NO follower math (Paolo's call, PENDING). ctx.quests also
  exposes journal() (every live quest's title/act/stage/done/objectives/available/
  channel) and activeObjectives() (the flat objective-HUD line).
  THE SOCIAL PROFILE (7/20, LOOP PROFILE gate 10/10): Loop.socialProfile(ctx, scoreFn)
  = the phone's top-of-page readout (posts / questsTouched / questsCompleted /
  follower reach) over the feed. With no scoreFn it now defaults to the REAL CLOUT
  math (below) — no longer an empty hook. Whether followers/clout end up as one
  number or two is still open (call once per metric with its own scoreFn).
  CLOUT LAW (7/21, LOOP CLOUT gate 18/18, LOCKED — see the note below and
  BOHEMIA_ADDENDUM_CLOUT_RECKLESS_BEATS_QUIET_7_21_26.md): Paolo ruled reckless/
  dangerous deeds earn dramatically more followers than quiet ones. A quest's own
  completing @STAGE line can carry a #quiet/#notable/#risky/#reckless hashtag (the
  .bq format's existing #tag mechanism, no format change); Loop.defaultFollowerScore
  reads it (CLOUT_WEIGHTS: quiet 8, notable 25, risky 55, reckless 110; untagged =
  neutral 15). FAILed quests still post (total recall) and still score by their tag.
  The follower-scoring PENDING item from 7/20 is CLOSED.
  FACTIONS + ECONOMY NOW WIRED (7/22, LOOP FACTIONS+ECONOMY gate 31/31, registered in
  the main suite — see BOHEMIA_ADDENDUM_FACTIONS_ECONOMY_WIRING_7_22_26.md). Neither
  system was invented: BohemiaEngine.Factions/FactionCanon/Economy already existed
  fully built in bohemia_engine.js, plus a real canon faction graph (engine/
  BOHEMIA_faction_graph.json, "derived from GDD v2 §9, invents nothing," 14 map
  factions + 4 social-force groups) — only the loop's bootFactions/bootEconomy sockets
  were empty [SEAM]/[GAP] stubs. bootFactions now builds a real FactionWorld from that
  graph, wraps shiftStanding so every standing change is canon-constrained
  (enforceConstraints: war floors, protection floors, pair min/max), and seats every
  faction on a REAL worldgen factionSlot (MAP LAW respected: Claude only decided WHICH
  faction sits on WHICH already-placed slot, via a seeded shuffle — never invented a
  position), then claims each faction's nearest unclaimed district as founding
  territory. bootEconomy builds a real per-district Economy: every district gets a
  small electricity sink; the dam and solar worldgen sites become electricity
  faucets — modeled as TWO faucets each ('grid' shared + a smaller 'Network' skim),
  echoing the already-locked house-of-cards canon (power has no single owner, but
  "the Network skims covertly") and keeping any one producer safely under the
  engine's own MAX_PRODUCER_SHARE=0.6 invariant by construction. ctx.factions,
  ctx.factionConstraints, ctx.factionBases, ctx.economy are all live on the boot
  context now. The old gates/bohemia_loop_gate.js (previously orphaned, crashing) is
  FIXED and registered as gate LOOP FACTIONS+ECONOMY.
  REAL BUG FOUND + FIXED IN bohemia_loop.js WHILE WIRING THIS (7/22): the UMD wrapper's
  factory function is a SIBLING argument to the outer IIFE call, not lexically nested
  inside it — it only ever sees req/E/Sched/BQ/BQRT because those are passed in as
  real parameters, never via closure. DEFAULT_FACTION_GRAPH had been declared in the
  outer scope but never threaded through, so any code path that didn't pass
  opts.factionGraph explicitly hit a ReferenceError. Fixed by adding it as an explicit
  parameter through factory(...). Worth remembering: this file's UMD shape does NOT
  give the factory closure access to anything declared in the outer wrapper — new
  outer-scope consts must always be added to the factory(...) call AND its parameter
  list, never assumed reachable by closure.
  STILL PENDING PAOLO (not decided, do not invent): tuning the actual electricity
  sink/faucet rates and which non-dam/solar sites (if any) should also produce; medicine
  faucet placement entirely (still zero medicine sources — a deliberate empty table,
  not a bug); whether any starting territory/standing besides "founding claim on
  nearest district" should be canon.
- THE WHOLE GOAL-SLICE LOOP IS PROVEN HEADLESS (7/20, LOOP SLICE gate 20/20). One
  driver (engine/bohemia_loop_slice_tests.js) runs the ENTIRE loop with NO render:
  spawn the player as a real scheduler actor, WALK him across actual passable map
  tiles (occupancy + collision) via Loop.commit + finishSlides to an NPC a quest is
  bound to, confirm the talk only offers ON ARRIVAL, play the first-errand quest
  through its learn-the-plan BRANCH to COMPLETE, read the objective HUD, then SAVE ->
  reload -> and confirm the dynasty MOVED (choice-log carries it, quest still done,
  NPC binding restored). This is the "prove the loop" milestone: the render session
  now only has to DRAW what this already runs. Also added the QUEST JOURNAL
  (pull-from-anywhere): ctx.quests.journal() = every live quest's title/act/stage/
  done/objectives/available nodes; ctx.quests.activeObjectives() = the flat
  objective-HUD line across all quests.
- STILL MISSING (the WITH-PAOLO walkable build) — now just the FACE: the human-mode
  RENDER booting on a fixed seed/spawn, a faked house exit, drawing an NPC sprite at
  the placed tile, a DIALOGUE OVERLAY drawing runtime.view()/talkTo() on the "TALK"
  prompt, and the objective-HUD line drawing activeObjectives(). ALL the LOGIC beneath
  each of those is built and gated (walk, adjacency-TALK, dialogue play, journal/HUD,
  save, recorded-ledger, fold) and PROVEN TO COMPOSE by LOOP SLICE. Left besides the
  render: a written playable .bq (only ONE non-canon sample exists; the neighbor's
  first quest is pinned). Interiors deferred. The render needs the alpha/V11 slice +
  Paolo (one-alpha law) or clean assets.

## CITY TAB / WALKABLE ENGINE — AUDITED TRUE STATE (7/19, read the code directly)
Corrects the gap-analysis agent, which badly UNDERSOLD this (and missed
bohemia_engine.js entirely — do not trust that agent's engine claims).
- BUILT + MODULAR + TESTED (gates/test_v11.js, the SLICE V11 gate): the walkable
  ENGINE LOGIC in engine/bohemia_slice_engine.js (+ bohemia_slice_core.js):
  grid MOVERS with the occupancy law (no overlap, chain-step, run, smooth lerp),
  the 120 BPM beat clock + the I-MOVE-YOU-MOVE turn clock + a WORLD CLOCK (walk
  1.9s / run 0.9s per step -> time-of-day -> the 100-year arc), full day/night
  LIGHT pass, DOORS (2-beat swing, passable), a WANDERER NPC brain, occupancy-aware
  LAMPS. This is a real walkable engine, not a stub.
- BUILT + MODULAR: the CITY MAP + CONTENT: bohemia_overmap.js (overmap gen, big
  API), bohemia_blockgen.js (drill-in block types: street/desert/mountain/wash/
  solar/farm/airfield... each a grid + meta), bohemia_plotgen.js, bohemia_powergrid.js,
  bohemia_overmap_bridge.js.
- THE ONE REAL WALL (confirmed by grep: renderHuman/cityWalkable/stepOnce/drillIn
  appear NOWHERE in engine/ or the readable slices): the human-mode RENDER, the
  drill-in from overmap to walkable, and the on-screen city view live ONLY inside
  the 31MB alpha's CITY_B64 base64 blob (source bohemia_city_unified.html, which
  does NOT exist standalone). The city's brain is modular and editable; its FACE is
  trapped in a blob. That extraction/rebuild is the logistics crux of the walkable build.
- SO THE WALKABLE BUILD (with Paolo) IS: reuse the solid modular engine logic;
  rebuild the human-mode RENDER cleanly on top of it (recommended over editing the
  blob); then the quest slice adds a TALK-trigger NPC (a mover + proximity check —
  the wanderer brain is the primitive), a DIALOGUE OVERLAY drawing runtime.view(),
  and wiring runtime choices -> the engine's recordChoice. Smaller than it first looked.

SMALLEST PATH (ruthlessly scoped; BUILD IT LIKE THE COMBAT DEMO, Paolo 7/19 — a
tight, standalone, actually-PLAYABLE demo you hold with your thumbs, NOT bolted into
the 31MB studio; the combat demo/dial is both the proof this can be done and the
model for how, a small touchable loop Paolo can judge by feel): 0) harness boots
straight into human mode on a fixed seed/spawn. 1) FAKE the
house (a 2s intro at spawn, no interior engine). 2) one static NPC sprite + adjacency
"TALK" prompt — the ADJACENCY LOGIC is now DONE (Loop.place/talkablesNear/talkTo, LOOP
TALK gate); the slice only draws the sprite + prompt and passes player x,y in. 3) DIALOGUE — 3a the .bq INTERPRETER is DONE (engine/bohemia_quest_runtime.js, the
QUEST RUNTIME gate). 3b a STANDALONE DIALOGUE DEMO is DONE too:
slices/BOHEMIA_QUEST_DEMO_7_19_26.html plays a .bq through the runtime with tappable
options, an objective bar, live gate-unlocking, and a win/lose banner; iPhone-portrait,
references the canonical engine modules (no copies), browser-verified via Playwright
(the password option is hidden until earned, then appears; reaches QUEST COMPLETE, zero
console errors). This is the combat-demo-style proof of the dialogue UI. What REMAINS for
the full slice is DRAWING this UI in the walkable world (human mode + faked house);
NPC placement is now BUILT (Loop.place/talkablesNear), not building the dialogue system
from scratch. 4) an objective HUD line — the DATA is DONE (ctx.quests.activeObjectives(),
LOOP SLICE gate); the slice only draws the line. 5) write ONE playable .bq
(the neighbor's first errand once its design is unpinned). 6) SAVE/FOLD/recorded-ledger
ALREADY EXIST in engine/bohemia_engine.js (ENGINE CORE gate) AND are now WIRED: playing
a quest through ctx.quests feeds its choices/outcomes into recordChoice automatically
(LOOP LEDGER gate) — do NOT write a new save, and do NOT re-plumb the ledger.
7) prove the loop + add a slice_proof gate — DONE HEADLESS (LOOP SLICE gate, 20/20): the
whole walk->talk->play->journal->save/reload->fold loop composes and passes with no
render. The render session becomes "draw what LOOP SLICE already runs."
RISKS: (a) over-building the interpreter — discipline: one quest, not the spec; (b) the
base64 logistics — build on the V11 live slice, verify it has human mode first; ENGINE
SYNC LAW: edits go to the canonical source. CUT from the slice: overmap drill-in, real
interiors, combat, role-casting/factions, the generational fold, inventory.

## CANON CHANGE 7/20 — TOTAL RECALL + THE QUEST LOG IS THE SOCIAL FEED
Paolo locked (SOCIAL_FEED_QUEST_LOG_7_20_26): the quest log's PRESENTATION is a
social-media phone app (the "social tab") — you pick up quests through the feed, all
quests are documented there, you gain FOLLOWERS by doing cool shit. And TOTAL RECALL:
everything is remembered on the feed, no exceptions. This RETIRED the recorded/
unrecorded two-ledger split (RECORDED_VS_UNRECORDED_7_1_26 -> archive/) — a
Claude-originated framing Paolo rejected ("I never brought up the ledger, you did") —
and overrides GDD v2 §blind-spot's "off-feed is the dynasty's advantage." The Act 3
win now runs THROUGH the feed (§18: the feed is the battlefield), not around it.
ACQUISITION has two channels: FEED (over the phone) vs IN-PERSON (the phoneless, like
the homeless: no phone, you must pull up on them). Memory stays total — the player
posts about in-person deeds. LESSON FOR NEXT SESSION: do not reintroduce any
unrecorded/secret-ledger/off-feed mechanic; do not present Claude-coined systems back
as Paolo's canon.

## THE 7/18-19 STORY LOCKS (each is its own addendum in /laws)
- THE WORLD (LAKE_MEAD_HEALTHY_OASIS, HOUSE_OF_CARDS_POWER_SHARE,
  WORLD_BREAK_ANSWERS, COLLAPSE_ORIGIN_AND_DEATH_MODEL): crash ~2050, game starts
  ~2060 (founder was a CHILD at the crash). Multi-causal ECONOMIC collapse, dollar
  dead, currencies = medicine/electricity/resources. Civilization HELD ON BY A
  THREAD (brownouts, not blackout; Paolo never said the lights went out). Vegas is
  a functioning OASIS: Lake Mead healthy/recovering (die-off killed the vanity
  water demand); power + water are the draw, FOOD is the weak leg patched by MORE
  HYDROPONICS. Power/water = a HOUSE OF CARDS controlled by SHARE (no single owner,
  Network skims covertly), but NOT one-bomb fragile. Kindness = glimpses, not
  utopia. Working cars are a RARE Act 1 luxury (people walk/bike).
- THE AMALGAMATION (AMALGAMATION_SCOPE_GOOD_ENDING, DUBAI_PRECEDENT_SECRECY, +
  the older AMALGAMATION_THREAT_LOGIC 7/1): an INTERNATIONAL / distributed data
  service (like Claude), NOT a local machine, so it cannot be killed by unplugging
  Vegas. Built from Project Angel data-portraits = SIMULATIONS, not true uploads.
  Custodial; kills ONLY near its secret (proximity-to-secret, not power). Dubai
  stays UNEXPLAINED (the horror is nobody knows how the nuke happened; do not
  over-engineer it). A SHADOW SECRET, barely known until Act 3. It is the
  COUNTERFEIT FAMILY ("a family that never ends / nothing is ever lost") = the dark
  mirror of the game's whole theme.
- THE THREE-ACT RESTRUCTURE + THE MOON (ACT3_MOONSHOT_STRUCTURE): the local
  reckoning (discover it, the whisper broadcast, STOP THE EARTH NUKE, free Vegas)
  moves to the END OF ACT 2, achieved by the SUPER-CAPTCHA / VPN the player deploys
  that SEVERS the Amalgamation's reach (after it, no nuke, no direct control). ACT 3
  = a ONE-WAY rocket to the MOON to end it at its off-world source (you can't nuke
  the Moon; the Angel-gen heir goes and does not return, dynasty ends looking down).
  Act 3 = the CRUMBLING OF THE NETWORK: WAR path (ally factions, take the forge by
  force) or CONVERSION path (turn the non-implanted members; NeuroLink carriers
  can't be converted). Moon base holds the preserved Project Angel billionaire
  founders (fictional analogs per naming law). A full ROCKET LOGISTICS breakdown
  exists (Act 3 city-builder tech tree: power -> propellant plant -> metallurgy ->
  3D-printed engines -> avionics -> knowledge -> test campaign -> launch; the forge
  is the Network's, so Act 3 = take the dragon's forge).
- THE THREE ENDINGS (in the STORY MASTER; supersedes the GDD v2 six-ending list,
  registered in bohemia_superseded.txt): LIBERATE (free Vegas / warn the world /
  stop the nuke), RESPECT (coexist), BECOME (join / take the power).
- FAMILY IS THE CORE THEME (FAMILY_CORE_THEME) — the lens for ALL quest writing:
  strong family conquers all; nobody is anything without family (Alexander/Augustus
  grounding); the Amalgamation is the counterfeit family, so the whole game is true
  family vs the counterfeit, and grief must hurt because grief is the proof it was
  real.
- THE ACT 1 OPENING (ACT1_OPENING_VISION) — heavily designed, near-final:
  MATCH-CUT childhood dinner (pre-crash, warm, you're a kid, family whole) -> blink
  -> same TABLE 10 years later in a dingy house, RAID = the combat tutorial (July
  4th, the dead nation's last fireworks; father wakes you; a SIBLING dies; the
  SAME-GENDER-as-player sibling SURVIVES as your one authored companion; ends saving
  your mother, assault inferred never shown) -> next-day GRIEF DINNER (the empty
  chair; the TABLE STAYS SACRED, the death happened in the raid, not at the table)
  -> BURIAL on a ridge overlooking Bohemia = the first BotW-style VISTA = the
  MENU / TITLE SCREEN (upgrades per act, bookends the pre-launch look in Act 3) ->
  THE FOUNDING via the NEIGHBOR (see IN FLIGHT). PACIFISM: the raiders kill the
  sibling, never the player, so a no-kill run is pure from minute one and still
  carries the loss (preserve a real non-lethal opening).
- ACT 1 PROCEDURAL CLIMAX + THE DESTROYERS (ACT1_PROCEDURAL_ENDING_AND_DESTROYERS):
  the explosive Act 1 climax is PROCEDURAL, a combination of 9 approved elements
  shaped by how you played Act 1 (theme = those who BUILD civilization vs those who
  TEAR it down). THE DESTROYERS = an unjoinable, purely destructive FORCE (not a
  faction), hated by everyone incl. the Cartel; scattered, may only coalesce at the
  end of Act 1; placeholder name "bandits/raiders" (naming deprioritized).
- MAIN-QUEST ARCHITECTURE (researched, confirmed, not yet its own addendum):
  ONE shared main quest; factions = flavored ORIGINS that converge (Dragon Age
  Origins model) with different paths + divergent endings (New Vegas "same spine,
  different paths"). NEVER 20 separate main quests. The family opening is universal;
  the faction recolors location/clothes/how-the-sibling-dies/the-neighbor.
- COMBAT / CAMP LEAN (NOT fully locked, awaiting Paolo confirm): companions do NOT
  die (permadeath = unfun chore); a downed companion sits at ~1 HP until healed at a
  safe place/medic, and healing ADVANCES IN-GAME TIME (I-move-you-move). FFXV-style
  CAMP / HANGOUT (cook, tell stories, heal) = where family bonds form. (NOTE 7/20:
  the old "these are UNRECORDED, the secret anti-Amalgamation weapon" framing is DEAD
  — Paolo retired the recorded/unrecorded split; TOTAL RECALL now, camp bonds are
  remembered on the feed like everything else. See CANON CHANGE below.) Retiring the
  old "companion death permanent on sleep" rule is PENDING his confirm.
- QUEST #235 (KCD teardown, questbook/BOHEMIA_QUESTBOOK_235_THE_HUNT_BEGINS.md):
  the grief-to-action opening machine (Kingdom Come's Skalitz arc), the direct
  template for our opening + the neighbor's first quest. 3 laws (warm-before-earns-
  length, authored-loss-as-tragedy-not-stolen-save, first-quest-has-purpose-not-
  busywork); core port = a draft @TALK of the neighbor's first errand.

## IN FLIGHT — RESUME HERE (the story track)
- **THE NEIGHBOR'S FIRST QUEST (PINNED by Paolo 7/19, resume here first).** We were
  mid-design when he pinned it to sleep. Established so far: WE grieve, the NEIGHBOR
  does NOT (he already grieved earlier, a DIFFERENT night, which is exactly why he
  can pull you out of your paralysis, a veteran of loss reaching back). His vested
  interest = SURVIVAL BY BINDING (alone = dead; last night proved it). He arrives
  with a PLAN already (Claude's read, unconfirmed: his plan IS the backyard-wall
  compound we locked, combine the two adjacent households into one defensible base;
  the couple of earned quests = clear-the-immediate-threat, then build-the-perimeter;
  the wall coming down = the plan realized = the pseudo-faction's first ground). He
  recruits YOU because you're adjacent (the shared wall) AND you just proved your
  household can fight. He's the first BUILDER you meet (the Act 1 theme in a person).
  PAOLO PINNED the last open question: is his plan just the two households, or bigger
  from the jump. NEXT: resume, lock his plan + the specific errand, then WRITE the
  neighbor's first quest as the FIRST ORIGINAL Bohemia quest, using #235 as the frame
  and its 3 laws as the guardrails.
- STORY MASTER CONSOLIDATION: BOHEMIA_STORY_MASTER_7_18_26.md is the connected spine
  but predates the later 7/18-19 locks (the act restructure, the opening, the family
  theme). Fold those into it when stable (standing "masters stay clean" job).
- OPEN CONFIRMS: the combat/camp permadeath retirement; the non-lethal-opening lock;
  the Act 1 climax element combos; the neighbor's plan scope.

## STILL PARKED (pre-marathon, unchanged)
- THE MASTER COMPILE: fold the 4 extraction masters (CRAFT/FLAWS/CONVERSATIONS/
  PORTS) into the build queue; PORTS_MASTER = the game-build spec. 235 full-machine
  teardowns feed it. Now doubles as the training set for writing new quests (already
  being used, e.g. #235 mined to build our opening).
- FNV RULING (actioned this session): 6 FNV teardowns flagged; 2 kept portable
  (#208 Honest Hearts, #213 Dead Money), 4 STUDY-ONLY (#169, #190, #197, #201).
  Direct FNV ports capped at 2 to avoid comparison.
- MUSIC BATCH 9 drop-in still waiting for the ALPHA-CONNECTED session:
  banks/BOHEMIA_MUSIC_BATCH9_DROPIN.txt (4 voices + 4 songs + paste points).
  music_gate.py enforces it. ONE-ALPHA LAW: one session touches the alpha.
- ALPHA ABSORPTION: preflight GO since 7/14; ONE session, WITH Paolo.
- ART in-flight (bake factory V12, wall classes, bold markings, eye-calls): see the
  7/17 handoff detail preserved in git + STATE_OF_PLAY_7_17_26.

## WORKFLOW / LAWS
- Gates: python3 gates/bohemia_gates.py [--fast]. Green or it does not ship.
- New quest: write file -> python3 tools/bohemia_questbook_archive.py N ->
  python3 tools/bohemia_questbook_extract.py N -> gate -> commit. .bq @TALK format
  that parses: @TALK id speaker=X entry=Y / @SAY / @OPT "..." [gate: none] -> target
  / @NOVERB "..." / @END. Gate needs exactly 10 W-points, >0 `> ` option lines, the
  named sections, **COUNT:**, and *END #N*.
- Any addendum lands -> python3 gates/bohemia_canon_index.py the SAME turn.
- NO EM DASHES in any Bohemia artifact, ever. ONE bold question max per response.
- Branch this session works on: claude/quest-log-access-ufcu1u (everything pushed).

## DO NOT LOSE (carries)
- ALWAYS give Paolo THIS exact ALPHA LINK whenever you present anything (7/20 rule,
  his words): https://paolosarn.github.io/bohemia/slices/BOHEMIA_ALPHA_0_9.html
  This is the GitHub PAGES link, THE link he wants every time (not github blob source,
  not raw.githack). Pages deploys from `main`.
- HOW HE SEES NEW WORK — THE SLICE TAB (learned 7/20, the big lesson). The REAL alpha
  on main has tabs CHARACTER/CLOTHES/ANIMATION/RIG/COMBAT/MUSIC/CITY/**SLICE**/LIFE.
  The SLICE tab is an IFRAME: `<iframe data-src="BOHEMIA_CURRENT_SLICE.html">`. So to
  show Paolo new work you DO NOT edit the 31MB alpha — you make your work be
  slices/BOHEMIA_CURRENT_SLICE.html (SELF-CONTAINED, no external refs, since it loads
  standalone in the iframe) and deploy THAT ONE FILE to main. Then he opens the Pages
  link and taps SLICE. Delivery flow: build self-contained -> write
  slices/BOHEMIA_CURRENT_SLICE.html -> browser-verify -> push ONLY that file to main
  (base a temp branch off origin/main, checkout just that file, push to main;
  surgical, never merge this whole branch). The phone is the current slice as of 7/20.
- WARNING / STALE ALPHA: this feature branch's copy of slices/BOHEMIA_ALPHA_0_9.html is
  OLDER than main's (main has CLOTHES/SLICE/LIFE tabs this branch lacks). Do NOT try to
  "sync" this branch's alpha to main's — main's alpha carries a MUSIC-gate failure
  (batch 11 song 'THE CHOIR UNDER THE RESERVOIR' births no BATCH11 voice; the music
  gate reads the alpha), so pulling main's alpha onto this branch turns the gate RED.
  The branch keeps its own clean (green) stale alpha, which is FINE because the alpha
  on this branch is IRRELEVANT to delivery — the phone ships via the current-slice
  file, not the alpha. NEVER merge this branch's alpha to main either. main's alpha is
  authoritative for what Paolo sees; leave both alphas alone. (Someone's music session
  left main's music gate red — that's main's debt, not this branch's, and not the
  phone's.) The old PHONE-tab-in-alpha injector was DEPRECATED and removed; use the
  current-slice iframe mechanism above.
- THE PHONE IS NOW A DEVICE (7/20): the current slice is a whole salvaged smartphone.
  BOOT (NETWORK OS power-on) -> LOCK SCREEN (clock, in-world date, live notification
  cards from real unread DMs + available quests, tap to unlock) -> HOME SCREEN with app
  tiles. Apps built: FEED (the social app, full), MESSAGES (character DM threads; the
  neighbor delivers a quest by TEXT), MAP (salvaged GPS canvas of the REAL generated
  valley: the Strip/dam/solar/districts-by-texture/routes/hubs/mountain-walls +
  derived Network signal coverage & dead-zones + quest pins gold=over-phone /
  orange-triangle=in-person + player dot + radar sweep; MAP LAW respected — renders
  generated data, designs no layout). TOAST notifications on quest-complete / DM-quest.
  CAMERA was built (7/21), then KILLED same session — Paolo: "too much shit
  going on, i dont want the camera." Fully removed (tile/view/CSS/JS); GRAVEYARD
  entry added (`renderCamera`, gates/bohemia_graveyard.txt) — do NOT re-add a
  Camera app. Home screen is 4 tiles: Network, Map, Wallet, Profile. Every app
  runs on the same real engine; visual language = salvaged-smartphone apocalyptic
  (PHONE VISUAL DIRECTION in the SOCIAL_FEED addendum). Reproducible: edit
  slices/BOHEMIA_SOCIAL_PHONE_DEMO_7_20_26.html (dev source) ->
  node tools/build_current_slice.js -> deploy slices/BOHEMIA_CURRENT_SLICE.html to main.
- THE PHOTO SYSTEM IS NOW GENERATIVE, NOT JUST 4 HARDCODED STRINGS (7/21): the 4
  original TEXT-CAM pieces (water tower/antenna/tunnel/fence) are an explicit
  override table (TEXT_ART_OVERRIDE) for this demo's specific quests; any OTHER
  quest id falls back to a shared 8-piece ART_BANK, picked deterministically by a
  hash of the id (same zero-authorship pattern as avatar colors/voice
  archetypes — see textArtFor() in the phone demo). This means a real quest
  written later automatically gets plausible text-art with no per-quest art work
  required — directly answers the "we don't have quests yet" gap without
  blocking on it.
- WALLET IS NOW A BUILT EASTER EGG, NOT THE REAL ECONOMY (7/21): Paolo's idea — tap
  Wallet, it opens QuikPay by Meridian National, a dead pre-collapse fintech app
  frozen since collapse, every service SERVICE UNAVAILABLE, tapping anything toasts
  "no connection." Pure flavor, un-dimmed and tappable now. The REAL currency system
  (resources/electricity/clout) is still NOT built — see CLOUT addendum's ECONOMY
  DISCUSSION for Claude's pending recommendation (clout = non-spendable reputation
  gate; resources/electricity = the real spendable fungible currencies) and the new
  SURVIVING_THE_AFTERMATH_RESEARCH addendum for game-precedent swipe material. Also
  7/21: killed the visible QUIET/NOTABLE/RISKY/RECKLESS badge on feed posts (Paolo:
  hardcore game, normie-friendly presentation) — the clout data still drives
  engagement volume + comment tone invisibly, just never shown as a label. Fixed a
  real bug caught building Wallet: setView() only ever removed 3 hardcoded view-*
  classes, so two screens could render stacked; now strips every view-* class.
- CLOUT/AMALGAMATION CLAIM CORRECTED (7/21): Paolo caught a real design hole —
  quest completion is mandatory to finish the game, and completion is how clout
  grows (any tier), so "chasing clout is a risk you can choose to avoid" isn't
  actually true; there's no zero-clout playstyle available. The mechanism
  (reckless-tagged completions earn dramatically more) is UNCHANGED and still
  good; only the "strategic choice to stay invisible" framing was walked back to
  lore texture. See CLOUT addendum's correction section before citing this claim.
- FEED + MESSAGES MERGED INTO ONE APP (7/21, Paolo: "whatsapp and instagram
  combined, no phone number needed"). DMs are now a 5th bottom tab (Feed/Quests/
  DMs/Log/Me) inside the single "Network" app, not a separate home-screen app;
  unread shows as a dot on the DMs tab and folds into the Network tile's combined
  badge (offers + unread). The old standalone Messages view/renderMessages() is
  gone — dmsHtml() is a normal TAB branch like the others now.
- CROSS-APP PUSH NOTIFICATION BANNER (7/21, Paolo: "even in the overworld there
  can be a notification with text"). Researched Cyberpunk 2077's exact pattern
  (non-intrusive top banner, respond now or later) and built pushBanner()/
  pushBannerTap(): fires regardless of which app/view is open (proven while on
  Map/Wallet), tap it to jump straight into the relevant DM thread. This is the
  actual mechanism for "notification pops during gameplay" — once a walkable
  overworld exists, the same call fires the same banner over it; nothing else
  changes. A demo trigger (scheduleDemoNotification) fires one ~5s after unlock.
- DIALOGUE SFX RESEARCH + PREVIEW (7/21, Paolo's ask): researched Animal
  Crossing's Animalese and Undertale's per-character blip-voice systems (own file:
  BOHEMIA_ADDENDUM_DIALOGUE_SFX_RESEARCH_7_21_26.md) — a handful of base sound
  clips + deterministic per-character pitch, no spoken words, near-zero
  production cost per NPC. Built voiceFor(name) (same hash-derived pattern as
  avatar colors, zero manual per-character work) and a visual-only "voice
  signature" squiggle in the dialogue overlay as a preview. NO AUDIO EXISTS —
  that's a real production step for later; today is the assignment mechanism +
  a visual stand-in only.
- TEXT-CAM: PHOTOS ARE TEXT ART, NOT IMAGES (7/21, LOCKED, own addendum
  TEXT_ART_NETWORK_7_21_26.md). Paolo caught a real plausibility hole: a barely-
  surviving internet can't host real photo/video sharing. Researched BBS-era
  ANSI/ASCII art (existed purely because modems couldn't send real images, became
  real craft/social currency) and Shift-JIS art (still thriving on Japanese
  textboards 20+ years after bandwidth stopped being scarce — proves it becomes
  real culture, not just a workaround), plus real disaster-comms precedent (SMS
  survives congestion that kills voice/data). LOCKED: the Network is text-first
  by necessity; "photos" on the feed are community-made TEXT ART. Built:
  photoFor() renders small hand-drafted TEXT-CAM art per quest instead of a
  gradient placeholder. PENDING (not decided): whether an in-fiction text-art-
  crew subculture (echoing real ACiD/iCE groups) becomes a clout/reputation
  source.
- BOTH NOTIFICATION PATTERNS COEXIST (7/21, LOCKED): Paolo wants the live
  cross-app push banner (built earlier, Cyberpunk-style) AND the lock-screen
  recap-when-you-open-the-phone behavior, not one replacing the other. Built:
  the phone is now re-lockable anytime (a lock icon in the status bar) so
  "put the phone away, pick it back up, see what you missed" is demonstrable
  beyond first boot — reuses the existing renderLock(), no longer one-time.
  DESIGN NOTE FOR LATER POLISH: never let the push banner look like a literal
  iOS/Android system notification — keep it in Bohemia's own salvaged/mono
  visual language as fidelity increases, don't drift toward a real-phone-OS copy.
- NEVER send Paolo standalone HTML files to open (7/20 rule) — "I need you to never
  give me HTMLs ever again, I'm not opening them." Anything he should SEE/JUDGE goes
  IN THE ALPHA SLICE (slices/BOHEMIA_ALPHA_0_9.html) as a tab/screen. The PHONE tab is
  the pattern: build the system, inject it into the alpha additively, verify it in a
  browser, tell him which tab to open. The slice menu / the alpha IS the delivery
  surface, not a file transfer.
- Paolo works from iPhone + two laptops; decides, Claude produces. He hates being
  bogged down, hates Claude presenting Claude's own scaffolding back as his canon
  (e.g. "Megaton law"/"conscience system" were Claude coinages, NOT his), and wants
  READ-BEFORE-YOU-SPEAK (several trips this session came from talking on half-memory).
- GDD NEAR-MISS lesson (gated): v5 EXTENDS v2/v3/v4, never archive them; a registry
  line is a CLAIM, not evidence.
- AUDIT BY NUMBER not filename; THE DIFF IS THE GATE; a deferred fix never happens.
- Zero-dialogue-by-design questbook files (never "fix"): #99 #104 #110 #114.
- HD tile repos travel as chunks, not in the seed.
- GIT IS THE MEMORY: commit every decision the turn it is made.
=== END HANDOFF ===
