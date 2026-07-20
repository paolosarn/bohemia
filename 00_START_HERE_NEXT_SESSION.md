=== BOHEMIA HANDOFF 7/19/26 (THE STORY-SPINE MARATHON) ===
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
- MISSING (all paper, must be built): a QUEST RUNTIME / interpreter (the .bq is
  parse-only; nothing executes @STAGE/@TALK/@DO — THIS IS THE CRUX), a dialogue UI,
  an NPC system (placement + proximity "TALK" trigger), quest-aware SAVE (no flag/
  objective/choice state saved), enterable interiors (none), an objective HUD, and
  any content wired to run (53 quest .md + 151 questbook are DESIGN DOCS; only ONE
  .bq exists and it's a non-canon sample).
SMALLEST PATH (ruthlessly scoped; BUILD IT LIKE THE COMBAT DEMO, Paolo 7/19 — a
tight, standalone, actually-PLAYABLE demo you hold with your thumbs, NOT bolted into
the 31MB studio; the combat demo/dial is both the proof this can be done and the
model for how, a small touchable loop Paolo can judge by feel): 0) harness boots
straight into human mode on a fixed seed/spawn. 1) FAKE the
house (a 2s intro at spawn, no interior engine). 2) one static NPC sprite + adjacency
"TALK" prompt. 3) THE DIALOGUE RUNTIME (the real build): a .bq node-walker that renders
@SAY/@OPT, follows targets, evaluates simple gates, and executes ONLY the @DO verbs the
one quest needs (set_flag, show_objective, complete_objective, stage advance) — implement
for ONE quest, NOT the whole spec. 4) an objective HUD line. 5) write ONE playable .bq
(the neighbor's first errand once its design is unpinned). 6) add quest state to the
existing CITYSAVE payload. 7) prove the loop + add a slice_proof gate.
RISKS: (a) over-building the interpreter — discipline: one quest, not the spec; (b) the
base64 logistics — build on the V11 live slice, verify it has human mode first; ENGINE
SYNC LAW: edits go to the canonical source. CUT from the slice: overmap drill-in, real
interiors, combat, role-casting/factions, the generational fold, inventory.

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
  CAMP / HANGOUT (cook, tell stories, heal) = where the UNRECORDED bonds form = the
  secret anti-Amalgamation weapon. Retiring the old "companion death permanent on
  sleep" rule is PENDING his confirm.
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
