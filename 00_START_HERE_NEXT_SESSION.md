=== BOHEMIA HANDOFF 7/20/26 (STORY-SPINE MARATHON + THE QUEST SPINE PLUMBING) ===
FILENAME LAW: this file is always named 00_START_HERE_NEXT_SESSION.md, lives at
repo root, sorts to the top of every file list, and is REWRITTEN at the end of
every working session. There is only ever ONE. It is the first thing any session
reads after CLAUDE.md.

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
  THE SOCIAL PROFILE (7/20, LOOP PROFILE gate 8/8): Loop.socialProfile(ctx, scoreFn)
  = the phone's top-of-page readout (posts / questsTouched / questsCompleted /
  follower reach) over the feed. MECHANISM-MINE: the tally. CONTENTS-PAOLO'S: the
  follower SCORING ("what counts as cool shit," how many followers a deed is worth)
  is an EMPTY hook — no scoreFn => reach 0. Whether followers/clout are one number or
  two is NOT decided (call once per metric). [PENDING Paolo: the scoring + one-vs-two.]
  THE PHONE IS IN THE ALPHA (7/20): Paolo's rule — NO standalone HTMLs, he won't open
  them; judge-able things go IN THE ALPHA SLICE. slices/BOHEMIA_ALPHA_0_9.html now has
  a PHONE tab (alongside CHARACTER/ANIM/RIG/COMBAT/MUSIC/CITY) running the real
  feed/quests/profile: feed (one post per completed quest, photo + follower-scaled
  comments), offers (over-the-phone vs pull-up-in-person), quest log, profile with
  followers, dialogue overlay, and a signal toggle (valley/live vs tunnels/NO SIGNAL).
  REPRODUCIBLE: canonical phone body is slices/phone/{phone_app.js,phone.css}; run
  `node tools/bohemia_inject_phone.js` to (re)generate the PHONE tab in the alpha from
  the engine modules + that source (idempotent, additive, collision-safe — new globals
  only, never touches the alpha's own engine/tabs). The phone runs on a MINIMAL
  self-contained ctx (choices + quest manager), so it does NOT depend on the alpha's
  older engine (which lacks Save.recordChoice/newSave). Re-run the injector after any
  loop.js/bq/runtime/phone-source change. Browser-verified (alpha boots, CHAR tab
  works, PHONE plays a quest to a feed post, zero console errors). Demo quests are
  throwaway; follower score is a placeholder. The old standalone
  slices/BOHEMIA_SOCIAL_PHONE_DEMO_7_20_26.html remains only as a fast dev harness
  (easier to iterate than the 31MB alpha); it is NOT for Paolo.
  STILL EMPTY (design-sensitive, need Paolo's rulings, NOT pure plumbing): bootFactions
  (faction placement/standings into worldgen slots) and bootEconomy (what the three
  currencies key off of, sources from geography). The old gates/bohemia_loop_gate.js
  is ORPHANED (crashes, not in the suite, expects factions/economy poured) — a real
  future task, left untouched.
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
  This is the GitHub PAGES link and it is THE link he wants, every time, no other
  format (not github blob source, not raw.githack). CRITICAL: Pages deploys from the
  `main` branch, so ANYTHING you want him to see at that link must be MERGED TO MAIN.
  Work done only on the feature branch will NOT appear at that link. So the delivery
  flow is: build on the branch, get it onto main (merge), THEN the Pages link shows
  it. Always tell him which tab to open (e.g. PHONE).
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
