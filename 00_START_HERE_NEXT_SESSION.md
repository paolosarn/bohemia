=== BOHEMIA HANDOFF (DIETED 7/26/26 — the pointer, never the pile) ===
FILENAME LAW: this file is always named 00_START_HERE_NEXT_SESSION.md, lives at
repo root, sorts first, and is REWRITTEN at the end of every working session.
There is only ever ONE.

DIET LAW (coordinator, Paolo-ordered 7/25): this file stays UNDER ~500 LINES.
Sessions append their entry at the TOP of the LANE STATUS section and TRIM the
oldest entries into laws/BOHEMIA_STATE_OF_PLAY (append, dated) when the cap
nears. The full pre-diet pile (4,387 lines, every entry 7/17-7/25) is preserved
verbatim at archive/BOHEMIA_HANDOFF_PILE_THRU_7_25_26.md and in git history.
Nothing was deleted; it was relocated.

READ ORDER: CLAUDE.md -> this file -> laws/BOHEMIA_COORDINATOR_ARCHITECTURE_MAP.md
(the whole machine: engine spine, the B64 embed/resync chains, gates, lanes) ->
BOHEMIA_CANON_INDEX.md -> your own lane's brief in laws/.

======================================================================## HOT LOCKED RULINGS (newest first — read before building anything)
=============================================================================
- WORLD BEFORE QUESTS (Paolo 7/26, LOCKED): laws/BOHEMIA_ADDENDUM_WORLD_BEFORE_
  QUESTS_7_26_26.md. "We are not ready to worry about quest right now we need to
  actually build a fucking world." The WORLD lane does NOT touch quests: not
  placement, not casting, not the bridge. Its quest items are PARKED in the
  backlog until Paolo reopens them. Build ground. (QUESTS lane still writes
  quests; that is its charter. What died is WORLD spending turns on quest
  plumbing.)
- SURFACE CELL LAW (7/26, machine-gated): a road is REAL GROUND but NOT a district.
  It registers in the world model's SURFACEGEN, never DISTGEN, so no faction,
  economy district or quest address can ever resolve to a street, and the loop's
  district count is unchanged by adding one. Gate: ROAD CELLS.
- APPROVED-ASSETS-FIRST (Paolo 7/26, LOCKED, hardens REUSE-FIRST):
  laws/BOHEMIA_ADDENDUM_APPROVED_ASSETS_FIRST_7_26_26.md. "If they're gonna
  create any sort of thing they have to be heavily inspired by the assets that
  I approved of or try to actually use them." THE APPROVED CORPUS IS THE SOURCE.
  Two traps this already caught in the CITY lane the same day: (a) painting flat
  hex fills counts as cooking pixels, and the reuse gate could not see it because
  it only swept *_factory/*_cook - it now sweeps anything that DRAWS; (b) "use
  the assets" does NOT mean the raw TP_TILES cut corpus embedded in the CITY app.
  That is the PRE-VERDICT judging surface (the TILES button) and sampling it put
  purple + neon + live grass in a dead house. Build from what he JUDGED: the
  all-30-UP house skins, the harmonized street pools, the Great Sweep's 1,927 UPs.
=======
- QUEST STUDY LAW (Paolo 7/26, LOCKED, in CLAUDE.md): the 240-file questbook
  (3,672 citable findings from 152 dissected quests) was being ignored in favor
  of summary bullets. Now every canon .bq CITES the corpus laws it is built on,
  machine-verified verbatim by QUEST STUDY gate against
  records/BOHEMIA_QUESTBOOK_LAW_INDEX.json. Query the index before writing a
  quest; never write from memory of the vibe.
  laws/BOHEMIA_ADDENDUM_QUEST_STUDY_LAW_7_26_26.md.
- ONE VALLEY (7/26, WORLD lane, machine-locked): the MAP tab renders the SAME
  valley the phone runs. It sat on seed 1337 for months while the game boots the
  text seed 'bohemia'; the map Paolo explored was never the map his quests were
  cast into. Pinned to the engine's own hashSeed('bohemia') in
  tools/bohemia_map_tab.py, asserted in gates/map_tab_gate.js. Never hand-type a
  seed number into a surface again.
- CHARACTER BOX = SHUFFLE ANIM (Paolo 7/26, his ask): the preview plays any
  clip, skeleton off, with the body sliders right underneath. Bodies get judged
  THROUGH THE ANIMATIONS now, never off an idle pose.
- SHADE MAP BEFORE SHIPPING A BODY CHANGE (7/26, learned the hard way twice):
  strays/holes/part-loss/frame-edge sweeps were all green while Paolo watched
  the arms turn into stripes. Dump WHICH PIXEL IS OUTLINE vs SKIN -- that is
  what a person actually sees. THE CHOPPED CHECKS in bodyvar_gate.js lock it.
- THE ONE RIG NOW HAS SLIDERS (shipped 7/26, CHARACTER lane). The female rig is
  GRAVEYARDED and gone from the code; a body is Paolo's painted rig + HEIGHT /
  BELLY / ARMS. Neutral is byte-identical canon. Nobody re-pitches a second
  authored body. Record: records/BOHEMIA_BODYVAR_SLIDERS_7_26_26.txt.
- NO PULL REQUESTS, EVER + ONE GATE PASS PER SHIP (Paolo 7/25, LOCKED, in
  CLAUDE.md ship flow). Push main directly, run the full suite once per ship.
  (Also: the stale PR badges #10-#20 on the reused character/sound branch name
  are 7/17-7/18 relics — ignore them, never click them.)
- THE FEMALE RIG IS DEAD — ONE RIG + VARIATION SLIDERS (Paolo 7/25, LOCKED):
  laws/BOHEMIA_ADDENDUM_ONE_RIG_VARIATIONS_7_25_26.md. Read it before touching
  bodies. The woman-rig v1-v4 arc is superseded by this ruling.
- V-NECK TEES GRAVEYARDED (Paolo verdict 7/25, screenshot: "delete these
  terrible"). Graveyard is final.
- HERO BEAT: beat 1 is canon for EVERY song (7/24 ruling). The ||1 default is
  intentional; never "fix" it.
- TERRITORY-AI PACING (7/24, LOCKED): advanceRound stays RARE and QUEST-GATED,
  never a tick/heartbeat. Written into engine/bohemia_loop.js.
- TLDR LAW for the coordinator (7/25): every coordinator reply to Paolo ends
  with a plain-English TLDR; assume zero coding knowledge.

=============================================================================
## LANE STATUS (as of the 7/26 diet — details in the archived pile + git log)
=============================================================================
RUN (01) 7/26 LATEST — DOORS + MUSIC. Paolo: "doors are always two tiles tall,
two by one... we already made a lot of doors with even animations where it opens,
you can't find that anywhere in the fucking files." He was right again: the bank
(banks/BOHEMIA_DOOR_ANIM_BANK_7_13_26.txt, 30 clips, 9 frames, 2 beats, queue
CLOSED 30/30) had existed since 7/13 and NOTHING consumed it, while every surface
drew a flat 1x1 still. Now law: laws/BOHEMIA_ADDENDUM_DOOR_LAW_TWO_TILES_TALL_
7_26_26.md — a door is 1 wide x 2 tall, it opens, a shut one BLOCKS you, and you
are through only at frame >= 5 (the 7/13 integration contract's own rule). The
builder refuses any frame that is not 88x176. Music too: the run asks the alpha's
own MUS/CITYMUS synth to score the walk (one AudioContext, in the parent, no
second music engine). Ledger now 14/23.
STANDING ORDER from the door law: before a surface draws a THING the game already
has, it opens banks/ first. REUSE-FIRST only ever swept COOKING tools; it never
asked whether a RENDERING surface went looking. That hole is what cost two weeks
of wrong-size frozen doors.

RUN (01) — RULED 7/26, READ THIS BEFORE ANY RUN WORK:
laws/BOHEMIA_ADDENDUM_THE_RUN_IS_THE_INTEGRATION_LANE_7_26_26.md. Paolo played
the first run and the verdict was that it did not use the game we spent six weeks
building ("it didn't use anything that we've done"). He is right: the player was
an orange dot. THE LANE'S JOB IS NOW INTEGRATION, NOT FEATURES. The run's quest
is disposable scaffolding whose only job is to route him past whatever was just
wired in — never surface it for a verdict, never spend a turn writing it.
SAME TURN, FIRST FIX: the run now wears the REAL CHARACTER. New cast bridge
(alpha runSendCast -> BOHEMIA_RUN_CAST), same bus the CITY tab already rode: the
parent bakes the real rig + wardrobe + face, 8 directions, 4-frame walk cycle,
and every body on the block (you, the neighbours, the quest NPC) is a real
Bohemia body with the real face in the dialogue portrait. Painter-sorted by depth.
THE SCOREBOARD (this is the answer to "what do I do with this"): every run ship
quotes records/BOHEMIA_RUN_INTEGRATION_LEDGER_7_26_26.md, enforced by
gates/integration_gate.js — a row may NOT be marked INTEGRATED without a machine
probe proving the wiring is in the shipped run.
NEXT: the overworld look is the loudest gap (Paolo 7/26: "it's kind of looking
like shit the whole overworld") but its OWNERSHIP moved the same day to the
ART-FIRST RESET (laws/BOHEMIA_ADDENDUM_ART_FIRST_RESET_7_26_26.md): the ART lane
produces TARGET SCREENS, Paolo picks one, and until then no lane cooks new
visuals. INTEGRATION OF ALREADY-APPROVED ASSETS EXPLICITLY CONTINUES, which is
this lane's whole job. So: keep pulling approved banks into the run, and the
moment a target screen is picked, move the run's world render toward it by
adopting the CITY tab's human-mode renderer instead of growing a second one.
Then the real valley, district art, day cycle + light.

RUN (01) — the loop itself, shipped earlier the same day: THE FIRST CONNECTED RUN.
New RUN tab in the alpha (first tab, preloads itself), one thumb: wake up inside
your own house -> out the front door -> the lineman on the street gives you a
throwaway errand -> follow it down his street -> resolve it quiet or LOUD -> a
LOUD resolution hands off to the REAL combat frame and comes back with
dead/spared/fled -> walk home -> the phone posts it with real CLOUT and
followers. Files: slices/BOHEMIA_RUN_SLICE_7_26_26.html (dev source, edit this)
-> tools/build_run_slice.js -> slices/BOHEMIA_RUN_CURRENT.html (generated, never
edit). Gate: gates/run_gate.js (80 assertions, both forks + inside the real
alpha). Record: records/BOHEMIA_THE_FIRST_CONNECTED_RUN_7_26_26.txt.
NOTE FOR EVERY LANE: the alpha now relays BOHEMIA_RUN_ENCOUNTER / _NEED_CAST /
_MUSIC and answers BOHEMIA_RUN_COMBAT_END / _CAST / _MUSIC_STATE
(runEncounterIn / runSendCast / RUNFIGHT / showTabPanel in the alpha shell).
Do not repurpose those names.

CITY (03) 7/26 — INTERIORS EVERYWHERE. You can now WALK INTO BUILDINGS in the
alpha's CITY tab (DROP IN, then walk into a wall whose dossier declares an
interior; walk out the door to come back). Three things landed:
(1) A LOCKED LAW WAS BEING BROKEN: bohemia_floorplan.js padded any footprint too
small for its zone's room grammar, so 343 buildings valley-wide were BIGGER
inside than out (storage unit rows 3x108 -> 10x108, farm strips, trailers, a
watertreat plant). world_gate's dim check passed because it sampled a coordinate
window and stopped at 200 buildings. Now 0 of 67,034 clamped, and world_gate
sweeps every married district type BY NAME across four seeds.
(2) Interiors reach everywhere: the 219 bespoke/landmark-cell buildings (casino,
resort, strip, airport, campus, prison...) answer interior() through the same
dispatch; the missing `leisure` zone exists; the interior door is cut on the side
the exterior actually opens on instead of always south.
(3) FOUND, NOT FIXED: COMMERCIAL WAS NEVER MARRIED. It never binds K, so the
registration behind `typeof K` was silently swallowed and the walked city still
renders commercial from LEGACY PREFAB STAMPS with nothing enterable. Binding K is
one line and it turns walkable_gate RED — on a single W or N street the plaza
builds only ONE store strip and parking fills the rest (drive 61% vs content 30%),
which is the [PENDING Paolo] "mid-block form" its own NOTES already flag. So the
binding is REVERTED, the numbers are written into the module's own head, and it is
backlog CITY-1: fix the mid-block form, THEN bind.
New tools/bohemia_city_module_resync.py re-syncs every engine module inlined in
CITY_B64 (the embedding tools were all one-shot, so engine fixes never reached the
app); it also caught district_kit a revision behind.
PAOLO CORRECTED THIS MID-TURN and he was right: the first interiors were painted
flat colours while the approved art sat unused ("half of the file size of bohemia
is the graphic assets and you're not using a single one of them"). Interiors are
now built from the pools he JUDGED: hwall / hwindow / hboarded / hdoor (the
all-30-UP house-skin cook) and the harmonized 'side' concrete. The interior is
made of the same material as the exterior. A second wrong turn is recorded too:
reaching into TP_TILES (the raw 9,127-tile PRE-VERDICT cut corpus) put purple and
neon in a dead house - never sample that for shipped art, it is the judging
surface. ROOT CAUSE FIXED: reusefirst_gate only swept *_factory/*_cook, so a
*_patch that paints pixels was invisible to it; it now sweeps any tool that
draws, and the six older drawing patches carry accurate REUSE CHECK blocks.
NEW GATE: interiors_gate.js (35 checks, registered). NEXT in this lane: CITY-1
interior props from the Great Sweep, then commercial, then garage/crypt interiors still render as ROOMS in the
alpha (the engine dispatches decks and vault halls correctly, the app does not
yet), then interior dressing off the dossiers.

WORLD MODEL (02): the big one landed — THE QUEST SYSTEM IS RESCUED ONTO MAIN.
9 playable canon quests (S01-S09) + quest runtime + casting bridge live in the
phone; quests actually move the factions (world bridge); the live phone runs
the REAL world (was a fake); MAP app render fixed. CANON QUESTS gate registered
and green. NEXT flagged: the run itself (see connected-run below).
RUN tab in the alpha (first tab, preloads itself). One loop, one thumb: wake up
inside your own house -> out the real front door -> the lineman on the street
gives you S01 THE METER READER (real canon .bq) -> follow the skimmed line 57
tiles down his street to the fixer -> resolve it quiet / in daylight / LOUD ->
a LOUD resolution hands off into the REAL combat frame and comes back with
dead/spared/fled -> walk home -> your phone posts it with the real CLOUT weight
and followers. Stitching only, no new systems. New gate: run_gate.js (69
assertions) plays the whole run in a real browser, both forks, AND again inside
the real alpha through the real combat bridge. Full record + the two [PENDING
Paolo] calls: records/BOHEMIA_THE_FIRST_CONNECTED_RUN_7_26_26.txt.
Files: slices/BOHEMIA_RUN_SLICE_7_26_26.html (dev source, edit this) ->
tools/build_run_slice.js -> slices/BOHEMIA_RUN_CURRENT.html (generated, never
edit). Hold-to-walk on the d-pad; the block is 128 tiles and tapping per step
was data entry, not a game.
NOTE FOR EVERY LANE: the alpha now relays BOHEMIA_RUN_ENCOUNTER ->
startEncounter -> BOHEMIA_RUN_COMBAT_END (runEncounterIn / RUNFIGHT /
showTabPanel in the alpha shell). Do not repurpose those names.


WORLD MODEL (02) — FREEZE COMPLIANCE NOTE (read with the entry below): the five new
surfaces (arterial, freeway, desert, mountain, water) were built in the same hours the
ART-FIRST RESET landed. They are STRUCTURE, not approved art: what ground exists, what
blocks, what you walk on, where the passes are. Every one is flagged PROVISIONAL SKIN in
its own module and dossier, and NONE of them is surfaced to Paolo for an art verdict.
When the ART lane's target screen is picked, these five get re-skinned to it. The ACT
TRIPTYCH gap (act-2 / act-3 materials) is recorded in each dossier as [PENDING Paolo].

WORLD MODEL (02): 7/26 (c) — THE GROUND IS BUILT. Two ships, same day, same ruling
("build a fucking world"). FIRST the roads: engine/bohemia_arterial.js (2,434 cells,
real Clark County cross-section, median opening to a yellow turn bay, detached walks,
curb ramps the gate forced into existence, crosswalks, signal masts, block walls
wall-to-wall so a street JOINS the districts either side) + engine/bohemia_freeway.js
(952 cells, eight lanes between barrier and sound wall, the traffic still stopped in
them, a real OVERHEAD overpass deck on piers where a street crosses). THEN the terrain:
engine/bohemia_terrain_noise.js (one valley-wide field, sampled in GLOBAL coordinates)
+ desert (620: self-spaced creosote on desert pavement, dry rills, OHV tracks, illegal
dumping, and the GHOST PLAT — a graded subdivision nobody ever built, on ~18% of lots)
+ mountain (927: ridge-and-ravine limestone, solid rock with walkable ravines as the
only passes, alluvial fans grading into the valley) + water (74: the reservoir in
DRAWDOWN — bathtub ring, exposed lakebed, a launch ramp stopping in mid-air).
THE VALLEY WENT 40% -> 95% GENERATED. All of it SURFACE cells, never districts (law).
Gates: ROAD CELLS (39) + TERRAIN (60), both green, both caught real defects first
(crosswalks dying at the gutter; mountain cells with no mountain in them). The MAP tab
can now FIND the mountains, the desert and the lake. Dossiers written for all five.
EARLIER 7/26 (a): quest placement candidates + the ONE VALLEY seed fix. Per the
ruling that judge page stays live in the LIFE tab, unjudged, and is NOT
re-surfaced at him.
NEXT IN THIS LANE (backlog WORLD-1 a-d): the airfield kit (airbase 54 + airport 40)
is the biggest thing still flat; then rail 90 + interchange 16 (network tiles, same
machinery as the roads); then the small landmark set (campus/town/speedway/ballpark/
convention/datafort/prison/dam/basin/reservoir). The Strip, the resorts and the
casinos stay RESERVED for Paolo's hand and are never auto-generated. After that, the
APPROVED ambient encounter director. Quests stay parked.

QUESTS (01) 7/26 — TWELVE MORE PLAYABLE QUESTS SHIPPED (S10-S21). The playable
corpus went 9 -> 21. Census, flash flood, triage, deed, dog on the landing,
marquee strike, pirate radio, hybrid seed, the crew problem, the blackout
birth, counterfeit charge tokens, the man who walked back in. All twelve are
live in the phone (same bytes the gate proves) and judged from inside the
alpha: LIFE tab -> THE 12 NEW CANON QUESTS. The canon-quests gate got HARDER
the same turn: no phantom endings, >=2 clout tags, >=1 silence option, no dead
objectives, unique ids — five checks the original nine also pass, nothing
grandfathered. 426/426 on 21 files; full suite green. Verified on the real
surface: a headless browser played all twelve to real endings, zero page
errors. The judge tool is now BATCHED per unjudged-is-dead (the 7/25 page for
S01-S09 stays byte-identical as the record; the fresh page carries only what he
has never seen). Record: laws/BOHEMIA_ADDENDUM_TWELVE_MORE_CANON_QUESTS_7_26_26.md.
THEN, same day, Paolo caught the real hole: the 150-quest study corpus was never
opened. Fixed at the root -- the questbook is now MACHINE-READABLE (3,672 citable
findings), every one of the 21 quests cites what it was actually built from, and
the QUEST STUDY gate checks the citations verbatim. Two ports the corpus had
queued by name are now real mechanics: the lie you must ARRANGE (S16) and
persuasion via the target's own surfaced doubt (S19).
NEXT in this lane: Act-1 main-quest beats as .bq chains (start by querying the
index), which first needs the cross-quest chain support the backlog names.
NOTE for WORLD: the placement factory now has 12 more quests to address.

LIFE + CITY (03): WALK-THIS-GAME redirect fully shipped — (1) SLICE walk
surface dressed to FINISHED, (2) neighbors homed+scheduled on the block,
(3) 4-lot big buildings + landmark zoom. Zoom-build: the city builder IS a
zoom of the one iso view (Paolo 7/25). 15 district heroes on the map.

COMBAT (04) 7/26 - v67: THE FOUR THINGS PAOLO CALLED OUT PLAYING IT.
(1) THE DIAL WAS NOT ON BEAT ONE AND COULD NOT BE. The sweep read `_bpmClock`, a
per-animation-frame counter started at page load; the music reads the
AudioContext and restarts its 16-step bar at step 0 on every song/faction
change. Two clocks, no shared origin, drifting. The AUDIO IS THE CLOCK now
(`_seq.t0` + `audioMs()`, output-latency compensated so it matches the EAR), and
cover cycles are WHOLE BARS (a 6-beat cycle can never start on a downbeat in
4/4; packages 2 and 3 were running one). Package 2 slowed 6->8 and package 3
quickened 6->4 as a side effect: [PENDING Paolo] if that rebalance is wrong.
(2) SUPPRESS DID NOTHING because the pin was `performance.now()+2200` -- a 2.2
SECOND wall-clock timer in a TURN-BASED game, so it expired while he was still
deciding. And a pinned man was dropped from the target pool, so suppressing
DELETED his own shots. Now: turn-based (XCOM contract), breaks the red lines
they were holding, pinned men STAY targetable with a 35% wider dial window,
they wear a PINNED tag, the action button counts them ("ENGAGE · 6 PINNED"),
1-turn cooldown.
(3) SPRINT WAS FREE. Costs 1 pip now -- and the turn-end refill no longer hands
the pip straight back (it is the reward for a turn you spent nothing on),
because a cost you cannot see in the pips is not a cost.
(4) SPRINT AND DASH BOTH ARMED THE SAME RING AND NEITHER DISARMED THE OTHER, so
an armed sprint could sit through a dash and fire on the next tap ("it
automatically moves for me"). Mutually exclusive now, auto-disarmed at turn end,
and the RING SAYS which move the next tap performs. SPRINT = 2 tiles, 1 pip,
ENDS YOUR TURN. DASH = 2 tiles, 2 pips, turn KEEPS going.
Tool: python3 tools/bohemia_combat_feel_patch.py (idempotent, anchor-asserted).
Gate: combat_lab_gate section 7 EXECUTES the clock math, the bar alignment, the
turn-based pin and the arm exclusivity (227 checks green). Verified on the real
surface by driving the actual buttons in the shipped alpha: suppress 3->2 pips
and the button reads PINNED, still pinned 7 real seconds later, sprint spends a
pip, arming dash disarms sprint. Headless has no audio device, so the CLOCK fix
is proven by executed math and code, NOT by ear -- Paolo's ear is the verdict.

COMBAT (04): v66 — THE RUN HANDOFF IS HARDENED AND THE RUN LANE CAN CALL IT
NOW. A quest step hands off with `startEncounter({questId, stepId, objective,
mercy, playerHP, roster, onEnd})` and gets back one settled outcome
(win/loss/aborted + dead/spared/fled/alive + fates + the quest context echoed).
Full contract: laws/BOHEMIA_ADDENDUM_RUN_HANDOFF_CONTRACT_7_26_26.md.
What landed: a HANDOFF CORE block inside COMBAT_B64 that owns the whole bus
(so the gate EXECUTES it instead of string-matching it), a declared LEAK LIST
that provably clean-slates every fight, cold handoff with the combat tab never
opened (frame built on demand + warmed at app open), a READY queue so an early
encounter is never dropped, abort, loud BOHEMIA_COMBAT_ERROR, and no demo
splash on a quest handoff. Verified on the real surface (headless Chromium on
the shipped alpha): 5 back-to-back cold handoffs, zero console errors,
slices/BOHEMIA_RUN_HANDOFF_PROOF_7_26_26.png.
THE BIG CATCH: the cold handoff took 12.9 SECONDS. A render-blocking
cross-origin Google Fonts link in the demo head was holding combat's entire
boot. Now non-blocking: 12,910ms -> 14ms. THE ALPHA SHELL STILL HAS THE SAME
LINK (backlog COMBAT 3, left alone for lane discipline; one line, whole-game
boot payoff, RUN lane's call).
REVERTED SAME DAY, on Paolo's report ("none of the enemies have clothing and
it's not the original player character"): the combat frame PRE-WARM is gone.
Building the frame at app open also pre-BAKES the player's sprites, so any part
of his look that restores late would be baked stale and the fight would wear
it. Gate now asserts the pre-warm stays dead. NOT REPRODUCED on a clean profile
or a save-and-restore profile, on either build (before or after v66), so the
cause may well be elsewhere: the ONE RIG / body-slider rewrite (3a7d9d9, 453
lines through the character+rig code) landed about an hour before he looked and
is the stronger suspect. NEXT SESSION IN THIS LANE: do not add combat features.
Find out whether the wrong character shows on the CHARACTER tab too (that would
make it the rig rewrite, not the combat bake) and fix the real cause.
Maintainer tool: python3 tools/bohemia_combat_handoff_patch.py (idempotent,
anchor-asserted). combat_lab_gate 208 checks green; v65 ramps intact.

CHARACTER/SOUND (05): 7/26 -- ONE RIG + VARIATION SLIDERS BUILT AND SHIPPED
(backlog CHARACTER-1). The whole female rig is deleted and graveyarded (gate,
tool, data, picker); rigSkel KEPT per the addendum. G.bodyVar {height, belly,
arms} is live on the CHARACTER tab, persists with the look, and rebuilds all 8
facings + every animation on drag. SECOND PASS same day, on his eyes: SHUFFLE
ANIM button on the preview box (+ skeleton off there), and four real "chopped"
defects he spotted and I had not -- thin arms collapsing to a stripe, the
minimum-width floor sliding the whole limb, the belly dial fattening the arms,
and the arms jumping to full thickness under the shoulder cap (the cape). All
four machine-locked; charpreview_gate.js added. engine/bohemia_bodyvar.js + inline (sync-
canon registered), gates/bodyvar_gate.js 37/37, and a real-browser capture
harness that sweeps the FULL clip set at every dial extreme (5,712 frames per
config; zero strays, zero shaves). Found and fixed ON THE REAL SURFACE: the
flank contract, the armpit bridge, the arm anchor, plus a FINAL FLOATER CULL in
buildFrame that now protects every garment ever made. MEASURED LIMIT worth
knowing: "taller" is capped by the 56px sprite frame at +5%, not by taste --
Paolo's painted body already fills the frame. DIAL RANGES ARE HIS CALL and are
waiting in the judge sheets. Earlier same day: marathon cook waves 1-3 (music
batch 20 = 9 faction-pool songs, wardrobe volume 29 items + 3 new shapes; music
batches 18/19 before that). That mega-verdict stack is still pending Paolo.

QUEST/LORE (01): its island content is rescued to main. The branch
claude/quest-log-access-ufcu1u still exists with its full separate history
(169 unique commits) — kept for reference until a session confirms nothing
else needs porting, then it can be retired to the archive. Per the
coordinator's plan this lane is chartered to be REBORN AS THE RUN LANE
(laws/BOHEMIA_COORDINATOR_PROMPT_LIBRARY_7_25_26.md, Prompt 2).

CONNECTED-RUN (branch claude/connected-run): the run-lane start exists — 2
additive commits (BOHEMIA_RUN_CURRENT.html base + S01 + Playwright harness
green). Unmerged, additive-only, waiting for its session to continue.

TASTE ENGINE: laws/BOHEMIA_PAOLO_TASTE_CANON.md + tools/bohemia_taste_filter.py
landed on main, validated both directions against Paolo's own past verdicts.
Factories pre-filter batches against his recorded NEVERs before he sees them.
The filter KILLS, it never APPROVES — that line never moves.

COORDINATOR (07): read-only across lanes. Produced the architecture map, the
findings (quest-rescue plan since executed, collision watch), the prompt
library, and this diet. REPO CLEANUP: DONE, both phases (7/26). The full
pre-slim history (every commit 7/16-7/26, all branches) lives permanently in
paolosarn/bohemia-vault, byte-verified before the rewrite; main is a SLIM
GENESIS of the identical tree. Procedure + keep-it-slim rules:
laws/BOHEMIA_ADDENDUM_REPO_DIET_7_25_26.md. Future slims repeat the same
archive-first procedure; the coordinator watches repo weight on check-ins.

=============================================================================
## PENDING PAOLO (the shelf — never decide these for him)
=============================================================================
- THE 12 NEW CANON QUESTS (S10-S21), fresh 7/26, never seen: LIFE tab ->
  THE 12 NEW CANON QUESTS. One sitting, thumbs per quest, export .txt.
- THE MEGA VERDICT (FRESH items only, per the UNJUDGED-IS-DEAD ruling 7/26):
  the marathon waves Paolo has never seen — music batch 20, wardrobe volume,
  plus whatever lanes stack next. STALE unjudged banks are presumed dismissed,
  never re-surfaced (laws/BOHEMIA_ADDENDUM_UNJUDGED_IS_DEAD_7_26_26.md).
- QUEST PLACEMENT PICKS (fresh, 7/26): 9 quests x 3 addresses in the alpha's LIFE
  tab. One tap per quest. Unpicked = stays where it is.
- FACTION TERRITORY SHAPE (discovered 7/26): every faction sits on a suburb tract
  and holds exactly 1 cell, because bases are an even stride across the district
  list. Whether a faction's ground should match its trade is HIS call; the
  mechanism is a small change to bootFactions the moment he rules.
- One-rig VARIATION SLIDERS: scope/next step after the 7/25 ruling.
- THE RUN's two calls, after he plays it (record has the full reasoning):
  (a) the lineman/fixer placements on the block, (b) whether a LOUD resolution
  should always draw a fight, and who shows up.
- BODY SLIDER RANGES (built 7/26, judge sheets in records/bodyvar/): how far
  each dial should go, what "and stuff" covers beyond height/belly/arms, and
  whether dials are per-NPC-random, player-chosen, or both. Nothing was wired
  to randomise NPC bodies -- that is his call, not mechanism.
- WHETHER "TALLER" IS ENOUGH: +5% is everything the 56px sprite frame allows.
  Going bigger needs a ruling (a taller frame, or re-centring canon).
- Combat grammar graduation batch (stacked per Prompt 4) when surfaced.
- Older shelf items live in the archived pile under their original sections.

=============================================================================
## NEXT UP (the standing plan)
=============================================================================
1. THE RUN: DONE and shipped 7/26 (above). Next in the lane: the phone-feel
   pass on real-device viewports, then widening the run past one block.
2. PLAYTEST: the run is the first thing Paolo can actually PLAY rather than
   thumb. His notes on it are first-class verdicts (SPIRIT loop).
3. Then: mega verdict sitting, then volume on whatever he approves.
=== END — keep this file under ~500 lines; the pile is the archive, not here ===
