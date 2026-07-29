SOUNDS (xk7pjp): 7/29 (f) LATEST — THE SFX FACTORY IS IN THE GAME. 60 SOUNDS,
12 MOMENTS, ALL WAITING ON HIS THUMB. MUSIC TAB, TOP OF THE PANEL.
NOTE FOR THE OTHER LANES: this touched the MUSIC tab and added engine/
bohemia_sfx.js. It did not touch a single song, voice or note of the music
studio, and it added no second audio engine. If your lane wants a sound, call
BOH_SFX.play(event, AC, dest) — it is silent until Paolo has ruled on that
event, and that is correct behaviour, not a bug.

--------------------------------------------------------------------------------
EVERYTHING BELOW IS THE OTHER LANES' LIVE STATE, CARRIED FORWARD UNTOUCHED.
--------------------------------------------------------------------------------

ART (f3eu53): 7/29 (e) LATEST (see the 7/29 c-d-e sections below) — PAOLO RULED "A". THE MASTER PALETTE IS DEAD, AND THE
TILES HE APPROVED ON 7/28 ARE FINALLY IN THE GAME.

THE RULING: asked A or B on the LIFE-tab judge card, he said **"A"** — the 7/28
re-cook (orange roofs, 150 colours). B, the 39-colour master palette, is KILLED.
Verdict: records/BOHEMIA_PALETTE_VERDICT_7_29_26.txt. Graveyard + post-mortem:
gates/bohemia_graveyard.txt, 2026-07-29.

THE THING THAT MATTERED MORE THAN THE RULING. Executing it exposed a debt owed since
7/28: he approved the re-cook that day, and **it was never wired in.** The run had
been shipping the FROZEN 7/26 set this whole time (version ..._ACT1_v1, md5
f470e7cb). The tiles he approved, and has now picked TWICE, had never once been on
his screen inside the actual run. NOTES ARE RULINGS says build it into the real
thing the same turn. Nobody did, and nothing in the machine noticed. THAT is the
class of miss worth guarding against — an approval that lands in a bank and stops.

WIRED NOW, AND WHY THAT WAS LEGAL. The starter tileset is byte-locked by
records/target/BOHEMIA_VISUAL_CONSTITUTION.json (target screen verdicted CBB 7/26;
CBB ships frozen). The constitution's OWN note names the one thing that moves it:
"changing either of these requires a NEW RULING FROM PAOLO, not a new render."
There are two — 7/28 "mark it approved", 7/29 "A" — and NEWEST DATE WINS is the
truth hierarchy, not a loophole. The constitution now points at the re-cook and
carries his words verbatim in a `ruling` field. tools/build_run_slice.js TS_PATH
moved with it. **The frozen FRAME did not move**; he verdicted that picture and it
is still the picture.
  -> This is the ONLY legitimate reason a baseline ever moves: a human ruling,
     quoted and dated. Never because the code was easier to change than the gate.

VERIFIED ON THE REAL SURFACE, not asserted: tools/bohemia_street_shot.js walks OUT
the front door (BFS over the interior's own pass grid, last step pressed ON THE
BEAT because walking into a shut door spends the press opening it) and shoots the
street — because the INTERIOR does not use the street tiles at all, so a bedroom
screenshot proves nothing about a tileset swap. records/target/STREET_NOW.png.
target_match_gate then validated 266 checks against the NEW set: the re-cook obeys
the constitution's proxies, it did not just replace them.

WHAT DIED WITH B: the bank, the designer, the applier, the A/B composer, the proof
harness, and gates/master_palette_gate.py (its own docstring said "if Paolo kills
it, this gate goes with it" — a gate guarding a corpse is rot). Unregistered from
the suite. GRAVEYARD IS FINAL: no remake, no "one more pass at cohesion", no
reviving the value-skeleton set under a new date.

WHAT SURVIVED B, because it is measurement and not art (records/BOHEMIA_MASTER_
PALETTE_7_29_26.md) and it is true of ANY future set:
  - 39.2% of approved structure pixels sit under luminance 48. Holes (doorways,
    glass, eave shadow) are their own MATERIAL, not a dark value of the wall.
  - The corpus's real per-band spreads are 106 / 93 / 110 wide, not the 52/54/52 I
    invented. "Where the corpus has it" means the SPREAD as well as the mean.
  - Measured per-family saturation: asphalt 0.20, concrete 0.35, desert 0.52,
    stucco 0.51, terracotta 0.81, deck 0.39.
  - Value carries greyscale separation; SATURATION carries the material read.

THE LESSON, and it is the third time it has been written down: **I invented a number
in a place where the set he already approved was sitting right there waiting to be
measured.** And the numbers on B were REAL — greyscale separation 6.5 -> 13.3, 150
colours -> 39, zero orphan pixels, 53 machine checks — and it lost anyway, because
what he is choosing is what the game LOOKS like and a metric is not a look. I also
wrote a FOURTH version of the applier; STOP PRODUCING names that as the tell you
already failed, and I wrote it anyway.

THE OTHER MISS WORTH COPYING: he asked "WHERE DO I SEE?" and the answer was nowhere
— I had shipped an A/B image into the chat and called that showing him. The judge
card was then built into the LIFE tab, and its FIRST version rendered two blank
rectangles (it fetch()ed the banks; Chromium blocks fetch on file://). Caught only
by driving the page in a real browser. A file that exists is not a page that works.
That card is now off the hub (answered same day; the hub is a to-do list for his
thumb, not an archive) with a named exemption in gates/name_the_tab_gate.py.

BUILD STAMP: 7/29b - YOUR TILES ARE IN THE GAME (RUN TAB). ALL GATES GREEN (462s).

WHAT IS PENDING PAOLO — none of it decidable by a session:
  1. what colour rebuilt Vegas is, in his words (open since 7/27)
  2. cars 2x3 vs the re-cook's shorter read (open since 7/28)
  3. TF-ART-017's parapet_corner duplicates TF-ART-012's parapet cap — coordinator
  4. a verifier added board row 97 in the reserved 90-99 range; may collide with the
     rows 28-37 this lane added

NEXT UNBLOCKED WORK FOR THIS LANE: the palette question is settled and the approved
set is live, which UNLOCKS VOLUME. The eighteen filled forms (records/tileforms/
TF-ART-001..018) cook against the re-cook's colours now, top of the board first.
Do NOT cook a variant of anything B touched.

--------------------------------------------------------------------------------
7/29 (c) — BOTTOM-LEFT BUTTONS UNSTACKED (CITY TAB)

Paolo, screenshot, three buttons ringed in yellow: "Fix this in the ui pls."
BUFFET ON / PLACE / TILES were on top of the hint text, running under the nav ring,
and clipping off the left edge.

SAME BUG THE TOP BAR HAD ON 7/25. Four things share that corner and every one was
absolute-positioned with its own hardcoded offset, so none knew the others existed:
#note bottom:58px (and it WRAPS, so it grows up into them), the toolbar bottom:70px
max-width:62vw, #bikebtn bottom:14px, #nav 180x180 at right:6px. Twelve pixels of
clearance against a multi-line text block, and 62vw = 242px on a 390px phone while
the ring starts at x=204. Neither number is wrong alone; they are wrong because
nothing measured them against each other.

FIX: one bottom-left flex COLUMN (#blstack), right-bounded at 196px so it can never
reach the ring, children laid out bottom-up with a gap and their offsets neutralized.
The layout does the arithmetic now. tools/bohemia_city_bottomleft_patch.py, idempotent.
It RE-ADOPTS its children every 600ms on purpose: these chips are created and
re-created by different systems, so claiming them once at boot would quietly stop
working the day one is rebuilt — which is how the offsets drifted apart to begin with.

NEW GATE: gates/bottomleft_gate.py, registered as BOTTOM-LEFT. Measures real
rectangles in a real browser at 390px (you cannot read overlap out of a stylesheet
when four systems position four elements). Holds: every chip fully on screen, no chip
on another, no chip under the ring, and all still VISIBLE so "fixed by hiding it"
fails. 21 checks. PROVED IT CAN FAIL: put the old offsets back, watched it go red on
exactly the collision in his shot (TILES on the hint text), restored.

NOTE FOR THE CITY LANE: this touched CITY-tab chrome from the ART lane because he
asked directly. CSS/DOM reflow only — no game logic, no city verbs, no art.

--------------------------------------------------------------------------------
7/29 (d) — THE BUFFET/PLACE/TILES BUTTONS ARE DEAD (CITY TAB)

Paolo, an hour after the layout fix: "I dont want those button anymore." Killed.
tools/bohemia_city_killbuffet_patch.py, idempotent. Graveyard 2026-07-29.

KILLED, NOT HIDDEN: the bar is never built and any leftover from a stale build is
torn out on sight, so there is no invisible tap target in that corner and no
off-screen node paying for layout.

THE SYSTEM BEHIND THEM IS NOW PERMANENTLY DORMANT, which is why the kill is safe:
TP already defaults to { on:false, scatter:false } and those three chips were the
ONLY way to flip either flag. With them gone the buffet cannot happen to his screen.
TP's internals were deliberately NOT ripped out - gates/city_tab_gate.js asserts that
scatter default, and that check should keep holding a real object rather than pass
because the object vanished.

READ THIS BEFORE YOU WRITE YOUR NEXT GATE. I wrote gates/bottomleft_gate.py that
morning demanding those three chips EXIST and not overlap. One message later they
were gone and the gate had to assert the exact opposite within the hour. The layout
fix was still worth having (the column protects the hint and the bike chip, which
stay), but the GATE was pointed at the wrong thing:
  -> a gate that names specific CONTENT ("these three chips exist") is betting on a
     product decision, and he is entitled to change his mind at any time.
  -> a gate that names an INVARIANT ("nothing in this corner overlaps anything else
     in it") survives him changing it.
The flipped gate is written that way now: it proves the buttons are absent and both
flags off, then measures whatever chrome is ACTUALLY down there. 9 checks. PROVED IT
CAN FAIL: resurrected the buttons, watched it go red, restored.

BUILD STAMP: 7/29d - BUFFET/PLACE/TILES BUTTONS GONE (CITY TAB). ALL GATES GREEN (667s).

--------------------------------------------------------------------------------
COORDINATOR (07), 7/28 EVENING — PAOLO'S OWN PROGRESS LEDGER + THE ACCELERATORS

PAOLO'S NUMBERS, recorded verbatim as ruling-class state (records/BOHEMIA_PAOLO_
PROGRESS_LEDGER_7_28_26.md): combat 40, rig 59, music 30, clothing 25, world 15,
animations 15, quests 10 ("even though we havent made a single one yet" — text
is not a playable quest to him), NPCs 5, items 5, SOUND EFFECTS 0. Calibrate
against HIS numbers, not lane optimism. The named holes are the zeroes and fives.

ON HIS ACCELERATOR ASK, researched + routed two frictionless force multipliers
(records/BOHEMIA_RESEARCH_FRICTIONLESS_ACCELERATORS_7_28_26.md):
1. THE SFX FACTORY (CHARACTER lane, item SFX): procedural synthesis on the
   alpha's own Web Audio stack (sfxr/jsfxr lineage — a sound is ~20 synth
   parameters, no files, no asset weight). Batches per game event, ONE judge
   page; a 60-sound batch is one two-second-per-item Paolo sitting — the
   cheapest verdict pipeline in the game, against his only 0%.
2. PLAYTEST TELEMETRY (RUN 0e + SHARED reader): the run logs positions/verbs/
   fights/deaths/where-he-quit locally and exports it like the save blob; any
   chat pastes it into a reader for a path heatmap + plain-English digest.
   His playtests become the fleet's highest-truth input with zero writing
   from him. Research consensus: where-he-quit beats any survey.

Earlier 7/28 (still live): ENGINE REALITY MAP (laws/BOHEMIA_ENGINE_REALITY_MAP_
7_28_26.md, in the GO read order) + three rulings recorded (REAL combat on the
walk = extraction never rewrite; VEGAS WEATHER 3 states rain-monthly; the TILE
FORM law + board, 54 forms filed by 7 lanes day one).

--------------------------------------------------------------------------------
COORDINATOR (07), 7/29 — THE SOUNDS LANE EXISTS (Paolo: "i should just make a
didicated sounds chat"). Doctrine lane words now include "sounds" (also
answers to "sound"/"music"); lane intent added (§6); BOHEMIA_BACKLOG.md has a
## SOUNDS section whose item 0 is the GREENLIT SFX FACTORY, then run-beat
plumbing, then ambient beds. AUDIO MOVED OUT OF CHARACTER (one system one
session): the character chat is bodies/clothing/animation only now — if it has
in-flight audio work it finishes nothing new and hands off via the handoff.
Paolo opens the new chat with the single word "sounds" and it goes.
--------------------------------------------------------------------------------
7/29 (e) — HOUSE 01, BUILT TO A REAL PERSON (LIFE TAB, awaiting his thumb)

Paolo: "i think we need to make like 16 houses i approve of that will go in the
suburb slots... lets make a single house realistic to human sizing please."
This is candidate 1 of 16. NOT APPROVED. LIFE tab, top card, green border.

THE FINDING, AND IT MATTERS MORE THAN THE HOUSE. CELL_M = 0.75 m and the art cell is
44 px, so 1 px = 1.705 cm. The THREE-TILE WALL law gives a 3-cell facade and the DOOR
LAW gives a 2-cell door:
    plate  3 x 0.75 = 2.25 m   (real: 2.44 m)
    door   2 x 0.75 = 1.50 m   (real: 2.03 m)
The player sprite measures 102 px = 1.74 m. **The door is 24 cm SHORTER than the
character.** He cannot walk through his own front door standing up.
And a third tile does not save it: real door-to-plate is 2.03/2.44 = 0.83, whole
tiles only offer 2/3 = 0.67 or 3/4 = 0.75. YOU CANNOT BUILD A HUMAN-PROPORTIONED
FACADE OUT OF WHOLE 0.75 m TILES. So a house is AUTHORED AS ONE IMAGE at true scale;
only its FOOTPRINT snaps to cells so it drops in a suburb slot. The other fifteen
inherit that decision.

DIMENSIONS, ALL REAL (web-confirmed: 36x80 in door and 16x7 ft garage are the
residential standards; ranch plans average 1500-1700 sq ft):
  footprint 15.0 x 9.0 m (20 x 12 cells, 1453 sq ft) / plate 8 ft / door 36x80 in /
  garage 16x7 ft / window 4x4 ft, sill 3 ft / eave 24 in / pitch 4:12

REUSE: every colour sampled from banks/..._RECOOK_7_28_26.txt, the set he approved
and chose again. 13 colours total. The house cannot drift from its own street.

THREE ART ERRORS, ALL CAUGHT BY LOOKING AT IT, NONE BY A GATE:
  1. drew the roof at full PLAN depth (528 px) so the house was 79% roof and the
     roof read as a second wall. Cropped the house he ACTUALLY approved out of the
     re-cook frame: its roof is ~2 cells against a ~4 cell facade. Now 120 px.
  2. shaded with continuous gradients -> 426 colours of smooth airbrush. Now flat
     ramp steps only: 13 colours.
  3. sampled the roof family by frequency, got #fdfdf8 (luminance 252 — the
     sun-caught ridge glint), and filled an entire hip PLANE with it. ramp_from now
     refuses anything over the act-1 ceiling: a highlight is not a material.
  Also: hips drawn by x-position gave vertical stripes, not a hip. Real 45 diagonals
  now. And barrel tile streaks run DOWN the slope, not across it.

NEW GATE: gates/human_scale_gate.py, registered as HUMAN SCALE. Holds the ONE
invariant all sixteen inherit — A PERSON FITS THROUGH THE DOOR — plus the art
agreeing with its own metre table and with the engine's CELL_M, and no white/black.
11 checks. PROVED IT CAN FAIL: set the door to the tile grid's 1.50 m and it refused
it, "-24 cm of headroom".

The judge card renders from an INLINED image, not fetch() — the palette card shipped
blank rectangles that way earlier today. Verified by clicking through from LIFE in a
real browser: image painted, vote registers, zero horizontal overflow at 390px.

[PENDING PAOLO] he also said "im concerned we may have to double the art size of the
tiles they looking a little low quality but thats down the line." NOT ACTED ON — he
scoped it as later. Doubling the art cell 44 -> 88 px is a whole-corpus decision.

BUILD STAMP: 7/29e. ALL GATES GREEN (632s).
