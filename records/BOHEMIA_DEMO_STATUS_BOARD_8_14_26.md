# THE DEMO STATUS BOARD (8/14/26, coordinator — all 13 critical-path
# rows audited with proof, ten days after the plan was written)
# Plan: records/BOHEMIA_THE_DEMO_PLAN_8_4_26.md. Scope RULED 8/4:
# THE ORIGIN (cold open, the sibling dies) + THE VISTA + ONE GOOD DAY.
# Method: three parallel read-only audits, each required to prove
# REACHABILITY on the surface Paolo taps, not existence in a file
# (VERIFY ON THE REAL SURFACE, 7/18). Every row carries its evidence.

## THE SCORE: 5 CLOSED · 7 PARTIAL · 1 OPEN   (row 8 closed 8/16)
And they share ONE root cause, below.

=============================================================================
## RE-AUDIT 8/20 — 188 COMMITS LATER. SCORE IS NOW **8 CLOSED · 4 PARTIAL ·
## 1 OPEN**, AND THE DEMO IS THREE THINGS AWAY.
=============================================================================
Measured against the current tree, not remembered. What moved:
- **ROW 11 THE VISTA — CLOSED.** It had ZERO callers on 8/14. It has one
  now: the day loop arms it on day 2 (`VISTA_ARMED` at CITY:28333) and
  calls `window.__VISTA.open()` at :28348. The money shot happens to the
  player instead of waiting on a rim tile.
- **ROW 1 — GET PAID AND SPEND ARE BOTH LIVE.** The bridge that was
  "built and never called" is called: `BohemiaPayday.payForQuest(...)` at
  CITY:28760, outside the module body. And spending works too —
  `nearestHub` at :28782, `BohemiaPayday.buy(...)` at :28854. His
  EVERYTHING-COSTS-ONE ruling is what unblocked it.
- **ROW 6 — THE 8/13 AMENDMENT SHIPPED.** A `.webmanifest` exists and the
  alpha carries apple/manifest tags. The home-screen install is real, so
  the save-eviction fix is on the surface.
- **ROW 2 — 18 wired-family proof shots**, up from 12.
- **ROW 9 — the demo gate exists** (`gates/demo_gate.js`, plus
  `demo_day_gate.js` — the two-gates collision, kept deliberately).
WHAT IS STILL TRUE, AND IT IS SHORT:
- **ROW 7 IS STILL OPEN AND IT IS STILL THE CHEAPEST BIG WIN.** The alpha
  still boots on the CHARACTER workbench: `<div class="tab on"
  data-p="char">` and `<div class="panel on" id="p-char">`. Five days
  flagged, unmoved. A friend tapping the link still lands on a dev tool.
- **ROW 3 — WALKING IS STILL SILENT.** Re-measured: the city world sends
  exactly ONE sfx message, `phone_buzz` at :28113, and has ZERO footstep
  code. The alpha has the receiver (`bohemiaCitySfx` -> playSFX at :7797)
  and nothing sends it a step. His 97 approved sounds still do not play
  when he walks. (Credit where due: the lane that wrote "IT IS ON THE
  REAL ONE NOW" was PEOPLE moving the person card, not SOUNDS moving
  footsteps — real work, different row.)
- **ROW 1's LAST TWO: the FIGHT and CAMP.** No combat entry on the walked
  surface (the `startEncounter` hits in the city are comments, :30150 and
  :30519). CAMP remains unbuilt and remains CUTTABLE from the demo.
=============================================================================
## WHAT COMES AFTER — THE SHORTEST PATH TO A FRIEND PLAYING
=============================================================================
1. **RUN P0-DOOR** — open on the game, route splash -> cold open -> day.
   Hours of work, changes everything a stranger sees.
2. **SOUNDS P0-WALK** — send a step event from the city; the bank, the
   classifier and the parent-side player all already exist.
3. **COMBAT RF4-LIFT** — the free-movement budget, and the indoor fight
   entry that closes row 1's fight half in the same job.
4. Then the closed playtest protocol: friends round, revise, fresh eyes.
CUT FROM THE DEMO, STATED SO NOBODY BUILDS THEM: camp, quests 4-5, the
healing montage, the field-surgery animation set.


=============================================================================
## THE ROOT CAUSE: THE GAME MOVED HOUSE AND HALF THE WIRING STAYED BEHIND
=============================================================================
THE ALPHA HAS TWO WALK SURFACES AND ONLY ONE IS VISIBLE.
- `slices/BOHEMIA_ALPHA_0_9.html:7355` — `var PANEL = (t.dataset.p==='run')
  ? 'city' : t.dataset.p;` THE RUN TAB SHOWS THE CITY PANEL.
- The alpha's own comment, `:17164`: "#p-run is display:none the whole
  time because the RUN tab actually shows the p-city panel."
- So `slices/BOHEMIA_RUN_CURRENT.html` — **15.9 MB on disk, 11.0 MB
  gzipped on the wire** — is LOADED on every visit and NEVER DISPLAYED.
  It is preloaded on purpose at `:21770` ("THE RUN preloads quietly so
  tapping RUN is instant") for a panel that never becomes visible.
WHAT MIGRATED to the visible city world: the day loop (`__DAY_LOOP__`
glue), the three demo quests (DEMO_BQ), the tile families, the vista,
voices, the save.
WHAT DID NOT MIGRATE: the sound wiring, the combat entry point, the
payday call sites, and 30 census rows of finished assets.
THIS IS THE SAME BUG AS SWEEP 5'S TIME-TO-FIRST-PLAY. The 11 MB that
makes a friend wait on cellular is the slice nobody ever sees.
It is also the same bug as the reachability census (30 LOADED ONLY rows,
273.6 MB of 276.6 MB unreached) — see records/BOHEMIA_RESEARCH_THE_
PHANTOM_SHELF_8_14_26.md.

=============================================================================
## THE DECISION — THE ONE WALKED SURFACE (coordinator, 8/14, correct-after)
=============================================================================
THE CITY WORLD IS THE WALKED SURFACE. The run slice is legacy.
This is not a taste call and it is not new policy — it is naming what the
build already does, so lanes stop shipping into a room with no door.
Reality decided it: the alpha displays the city, the day loop is gated
there 54/54, the quests are placed there, the tiles are wired there, and
Paolo's own ONE ZOOM law (7/25) put walk + build + sky on ONE view, which
is the city world's whole architecture.
WHAT THIS MEANS, IN ORDER:
1. DEMO-CRITICAL WIRING MIGRATES to the city world (rows 1 and 3 below).
2. NO LANE SHIPS NEW PLAYER-FACING WIRING INTO BOHEMIA_RUN_CURRENT.html.
   Engine modules stay canonical and shared as always (ENGINE SYNC LAW is
   untouched) — this is about which SLICE consumes them.
3. THE PRELOAD OF THE RUN SLICE IS DEFERRED OR DROPPED once the migration
   lands — 11 MB off the wire, which is most of the time-to-first-play
   problem, for free.
4. The run slice stays in the repo as the source of the wiring being
   migrated. Nothing is deleted while it is still being harvested.
IF PAOLO WANTS IT THE OTHER WAY (the run becomes visible again), say so
and the whole board flips — but then the day loop, quests, tiles and vista
are the things that need migrating instead, which is more work than this.

=============================================================================
## THE ROWS
=============================================================================

### ROW 1 — THE GAME DAY LOOP CLOSES — **PARTIAL**
WORKS, and it is real: wake 06:00 with no job -> the phone rings with the
offer -> accept -> walk -> enter a building -> resolution card in the
quest's own words -> @DO verbs fire -> nightfall reckoning -> SLEEP ->
day 2 with a different canon quest, surviving reload. Driven headless
through the alpha's RUN tab into the city frame by `gates/dayloop_gate.js`
(:173 direct on the city, :271-294 through the alpha), reported 54/54.
MISSING, all four on the walked surface:
- THE FIGHT. Every occurrence of "combat" in BOHEMIA_CITY_WORLD.html is a
  comment or CSS. The handoff (`ALPHA:6967-6980` RUNFIGHT/runEncounterIn)
  is triggered only by postMessage from the hidden run slice.
- GET PAID / SPEND. `engine/bohemia_payday.js` IS inlined in the city
  (:5428-5745) and every call site is INSIDE its own module body — zero
  callers in the day-loop glue. The lane found this itself on 8/14 ("THE
  DAY PAYS: the bridge that was built and never called"). Separately, the
  numbers are [PENDING Paolo]: PAYOUT/PRICES/PRODUCTION ship {} and answer
  NO_RULING by design.
- CAMP. Unbuilt; no deployCamp/mobile-base anywhere in engine/ or gates/.
OWNER: RUN (+ COMBAT for the fight entry).

### ROW 2 — THE LOOK LANDS — **PARTIAL (12 of 14 families wired)**
12 wired, proven by `records/target/ART_WIRED_TF-ART-*.png` (12 files);
newest `936b225` TWELFTH FAMILY (block wall caps). The two remaining are
BLOCKED ON OTHER LANES, not on ART: TF-ART-011 freeway (WORLD must
realize freeway/arterial/interchange cells — they are still reserved
landmark ground) and TF-CMB-005 deck stairs (waits on the TF-CMB-004 slab
cook). STILL OPEN AND UNSTARTED: the desert-ground fix (his pick reopens
it; the 8/7 finding is that every owned ground tile is a transparent
overlay and the base+scatter layer does not exist) and the district
generic-pass upgrade (backlog 0b, "the lane's top gap").
RECORD DEFECT WORTH ONE PASS: all 75 rows of BOHEMIA_TILE_REQUESTS.md
still read status OPEN — including cooked, wired, and killed ones. The
board cannot currently tell approved-and-unused from shipped. Pipeline
truth: 67 forms filed -> 17 cooked -> 12 wired.
OWNER: ART (+ WORLD for the freeway cells).

### ROW 3 — MINIMUM SOUND SET — **PARTIAL, AND THIS IS THE CATCH**
*** DOWNGRADED FROM WHAT EVERY RECORD SAYS. *** The sounds are real,
approved, and excellent: 97 approved (event,index) pairs across 32
families from his 270-thumb sitting (banks/BOHEMIA_SFX_APPROVED_8_12_26
.json, records/BOHEMIA_SFX_VERDICT_8_12_26.txt). Footsteps classify six
ground types, doors drag, hit/kill ride the beat, save chimes.
THEY ARE WIRED TO THE SURFACE THE PLAYER NEVER SEES.
- `BOHEMIA_RUN_CURRENT.html` posts BOHEMIA_SFX (1 site; sfxGround at
  :25626-25650, door at :25719, save chime at :27700).
- `BOHEMIA_CITY_WORLD.html` — the surface he walks on — posts BOHEMIA_SFX
  **zero** times, and contains **zero** footstep/ground-sound code. Its
  entire audio output to the parent is ONE line: `:16462`
  `postMessage({bohemiaCitySfx:{ev:'phone_buzz'}})`.
- AND THE GATE AGREES WITH ITSELF, NOT WITH THE PLAYER: `gates/sfx_wired
  _gate.py` clicks the RUN tab (:105-106), then reaches into `#runFrame`
  (:107-109) — the hidden slice — and counts sounds crossing from there.
  Green gate, silent game. This is the 7/18 VERIFY-ON-THE-REAL-SURFACE
  law failing at fleet scale, and it is why sound felt finished.
WHAT PAOLO ACTUALLY HEARS WALKING TODAY: music, dialogue voices (those DO
work in the city, `:17883`), and a phone buzz. No footsteps. No doors.
No save chime. Combat sounds work only once you are IN the combat surface.
REMAINS: migrate the sound calls onto the city walk (the approved bank,
the classifier and the parent-side player all already exist — this is
wiring, not cooking), then repoint the gate at the visible frame.
OWNER: SOUNDS (with RUN for the call sites). DEMO-BLOCKING.

### ROW 4 — 3-5 PLAYABLE QUESTS — **CLOSED at the floor (3 of 3-5)**
22 canon .bq authored and headless-proven; exactly 3 are placed in the
walked world (`engine/bohemia_demoquests.js:52-74` — S01 THE METER READER,
S09 THE BACK DOOR, S02 THE SAME CRATE TWICE — embedded as DEMO_BQ at
CITY_WORLD:12949). The other 19 are reachable only as phone-feed text in
the SLICE tab, which its own header calls a systems preview.
TO REACH 5: two more world-bound days in DAYS, or Paolo's placement PICKs.
OWNER: RUN/QUESTS. Not blocking — the floor is met.

### ROW 5 — COMBAT HANDOFF SPEED — **CLOSED**
Warming re-landed after the splash click (`ALPHA:7327`, requestIdleCallback
with a 4000ms timeout) so it never competes with first paint; the stale-
bake bug is fixed at the door (`:7239-7241` startEncounter re-checks
lookKey). Asserted by `gates/combat_lab_gate.js:4186-4190`. Nothing
remains for this row.

### ROW 6 — SAVE DURABILITY MINIMUM — **CORRECTED 8/15: NOT CLOSED**
*** THIS ROW WAS MARKED CLOSED AND IT WAS WRONG TWICE (sweep 12 —
records/BOHEMIA_RESEARCH_THE_SAVE_SURVIVES_THE_PHONE_NOT_US_8_15_26.md).
(1) Not closed on its own terms: this week lanes found "THE CITY COULD
NOT TALK TO THE SHELL: the autosave has never arrived" and "THE CITY WAS
NEVER INTRODUCED TO ITS OWN SAVE" (acd7b85, 0ff4947) — the storage layer
was immaculate and the message never reached it, the two-surfaces disease
inside the save itself. (2) DURABILITY IS NOT COMPATIBILITY: this audit
verified that the bytes survive the BROWSER and never asked whether they
survive US. engine/bohemia_engine.js has CURRENT_SAVE_VERSION=7 and a
full migration chain that the playable surface and the save module
reference ZERO times, and the three components stamp three different
version numbers. Routed as RUN P0-SAVE, before the friends round. ***
ORIGINAL 8/14 FINDING, kept as the record — **CLOSED** (the 8/13 amendment OPEN)
persist() runs at boot on the real surface (`ALPHA:8-34`), verified live by
`gates/durable_save_gate.js`. Save v2 is two-slot with generation counters,
checksums and tombstones, proven in a real browser against hostile-browser
cases by `gates/save_iphone_gate.js`. Export is reachable (💾 in the city
-> EXPORT SAVE -> the alpha's export modal, share/copy/download).
OPEN: the 8/13 home-screen work order (manifest + apple metas + icon +
the first-sleep-save install card) — `grep -c manifest` = 0 across all
three surfaces. Also: export is three taps behind a glyph, not one-tap.
OWNER: RUN.

### ROW 7 — THE FIRST FIVE MINUTES — **OPEN. THE CHEAPEST BIG WIN ON THE BOARD.**
A NEW PLAYER LANDS ON A DEV TAB. `ALPHA:1012` — `<div class="tab on"
data-p="char">CHARACTER</div>` and `:1082` `<div class="panel on"
id="p-char">`. The first thing a friend sees after the splash is the
character/wardrobe workbench, and they must find RUN among ~16 tabs to
reach the game. The cold open exists but sits in its own CUTSCENE tab and
hands off to nothing.
REMAINS (one afternoon, not a system): default the active tab/panel to the
game, and route the opening — splash -> cold open -> the day. Everything
downstream already works.
OWNER: RUN. DEMO-BLOCKING, and it is the single highest ratio of
player-impact to work on this board.

### ROW 8 — PERF — **CLOSED (8/16)**
The chunked renderer IS on the walked surface: 16x16 chunk store with LRU
eviction at 520 chunks (`CITY_WORLD:13920-13932`) and per-chunk 128x128
baked textures, LRU-trimmed (:14375-14656). RUN 0d asked the RUN slice to
adopt `world.stream()`; that row is now MOOT rather than done, because the
run is not the walked surface (see the decision above).
**CLOSED 8/16 — BOTH HALVES DONE, WITH NUMBERS.**

THE P0 (the freeze Paolo hit leaving the city) is FIXED. Measured on a real
touch device before touching anything: the pinch moved the sky by ZERO and
ten touch moves fired 21 full-valley redraws at 8.2 ms each. Root cause: in
SKY, MODE is still 'city', so every pointer handler thought it was looking
at the city. Gate: SKY TOUCH (sky_touch_gate.js), which drives REAL touch
through CDP because the wheel path worked the whole time and a gate that
called skyZoom() directly would have been green on the broken build. It now
walks the WHOLE ROUND TRIP, feet -> moon -> feet, because he had to report
the return leg separately after the outward leg was "fixed".

THE GAUGE EXISTS: FRAME BUDGET (frame_budget_gate.js), the repo's first.
It counts REDRAWS rather than timing them, because milliseconds are a
property of whichever machine the gate runs on and a count travels. What it
found on its first runs:
  - pinch while walking: 2.08 redraws/touch move -> **1.08**
  - CITY BUILDER pinch:  4.00 redraws/touch move -> **1.00** (~86 ms per
    finger movement, five frames at 60 Hz, in the view he BUILDS in, and it
    had no number at all because the gauge only watched the view the page
    OPENS in. A GAUGE THAT ONLY LOOKS WHERE THE APP OPENS IS HALF A GAUGE.)
  - city one-finger pan: 1.00, already correct, now pinned.

AND THE METRIC ITSELF NEEDED A SECOND RULER. A STEP measured 7.7 redraws,
which by the gesture ruler reads as a catastrophic regression in the thing
the player does every turn. IT IS NOT A REGRESSION: a step ANIMATES, so it
should repaint many times. The histogram says 79 frames painted once and 2
painted twice — a healthy 60 fps animation. TRUSTING THE GESTURE METRIC
THERE WOULD HAVE "OPTIMISED" THE WALK ANIMATION OUT OF THE GAME. Animations
are now gauged PER FRAME (the only defect available to one is painting the
same frame twice); gestures stay per input.

STILL TRUE AND WRITTEN INTO THE GATE: each redraw costs ~14 ms on a fast
desktop, so a phone is near its frame budget while animating. That is
RENDERER COST, a separate and much larger piece of work than duplication,
and it is now measured rather than assumed.
OWNER: CITY. DONE.

### ROW 9 — DEMO GATE — **PARTIAL**
`gates/dayloop_gate.js` is the real thing and it is good: it plays the day
headless twice, direct on the city and through the alpha's RUN tab,
asserting zero page errors across a full played day (54/54). But it
asserts nothing about a fight, a payout, a purchase, or camp — it can only
test the arc that exists. `gates/game_day_gate.js` is a ratchet over a
stored probe JSON, not a live playthrough. Deploy verification exists
separately (`pages_publish_gate.js`) and is not chained to it.
REMAINS: extend dayloop_gate to assert fight -> paid -> spent -> camp ->
sleep-save in one headless run as those land, and chain the deploy check,
so "the demo is a BUILD, not a vibe" is machine-enforced.
OWNER: RUN.

### ROW 10 — THE COLD OPEN SCENE — **PARTIAL**
The runtime and the scene are real and PROVEN IN A REAL BROWSER
(`gates/coldopen_gate.js`: the match-cut lands, four lines reach the
screen, the scene reaches `end`). The family-defense fight exists with a
genuine hold-the-line lose condition (`ALPHA:7211-7227`), not a re-dressed
duel.
THREE REACHABILITY HOLES: (1) it is not the opening (see row 7); (2) the
scene's handoff calls the fight WITHOUT SWITCHING TABS (`:21436-21438`),
so the encounter is posted to the combat frame while the player is still
looking at the cutscene canvas; (3) `cast:[]` and `place:null` are
[PENDING, Paolo] — there is no family and no place behind you yet.
Backlog TUT-SIB (8/13) adds the sibling-teaches-the-beat work.
OWNER: PEOPLE + RUN + COMBAT.

### ROW 11 — THE VISTA — **PARTIAL, and it is nearly free to close**
Built, derived (not a new renderer), inlined in the walked city
(`:12974`), opened by `vistaOpen()` (:15800), and ARMED IN THE WORLD:
`vistaCheck()` fires when your cell equals the derived overlook cell,
called every frame from renderHuman (:15847-15898). Gated and probed on
the real page.
BUT NOTHING LEADS YOU THERE. The seam `window.__VISTA` documents itself as
"RUN plays it from the day loop and the cold open" — and a repo-wide grep
finds ZERO game-side callers, only the definition and two gates. The
demo's money shot is currently found by accidentally walking onto one rim
cell.
REMAINS: ONE CALL — `__VISTA.open()` from the cold open's aftermath or a
day-loop beat. OWNER: RUN.

### ROW 12 — THE FAMILY CAST — **CLOSED**
All four named bodies exist and RENDER: FATHER/RAY, MOTHER/DENISE,
BROTHER/MARCO, SISTER/NINA (`ALPHA:3346-3367`), each a BODYVAR dial set on
the one rig with a full canon wardrobe, painted into #familyCast on the
CHARACTER tab and reused as the scene bodies in the CUTSCENE tab.
`gates/family_cast_gate.js` asserts painted pixels per member, four
distinct pixel signatures, canon-only garments, and separate shadow
canvases. Names carry draft:true awaiting his thumb — cosmetic.

### ROW 13 — SQUIGGLE VOICES — **CLOSED** (one stale gate note to clear)
Formant synthesis (`engine/bohemia_voice.js`, 576 lines), each voice a
pure function of the speaker's identity seed, constrained to his approved
pool (6 of 8 UP, banks/BOHEMIA_VOICES_APPROVED_8_11_26.json), speaking on
BOTH surfaces — `every_voice_surface_gate.py` exists precisely because the
first wiring left Marisela silent in the city, and it now fails on any
undiscovered talking surface. Mood layered on 8/14.
HOUSEKEEPING: a RUN handoff note from 8/12 lists VOICE SURFACES among red
gates; it predates the mood + barks commits and nothing has cleared it.
Re-run it before anyone calls this red.

=============================================================================
## WHAT COMES AFTER (the sequence, shortest path to a friend playing)
=============================================================================
1. ROW 7 — make the game the first thing you see. Cheapest, biggest.
2. ROW 3 — migrate sound to the walked surface. He notices silence
   instantly and it is wiring, not cooking.
3. ROW 1 — the fight entry + call the payday bridge (his three number
   tables are the only true PENDING in it; camp can be cut from the demo).
4. ROW 11 — one call to open the vista. The money shot, nearly free.
5. ROW 10 — route the cold open handoff and fill the cast.
6. ROW 8 — the CITY P0 touch freeze + a frame-time gauge.
7. ROW 9 — extend the day gate over the new beats, chain the deploy check.
8. THEN: the closed playtest protocol (records/BOHEMIA_CLOSED_PLAYTEST_
   PROTOCOL_8_11_26.md) — friends round instrumented, revise, round 2 on
   FRESH EYES. The home-screen install work (row 6's amendment) wants to
   land before the friends round, because that round is exactly when saves
   sit idle for a week.
CUTTABLE FROM THE DEMO WITHOUT LOSING THE RULED SCOPE: camp, quests 4-5,
the full healing montage, the field-surgery animation set.
