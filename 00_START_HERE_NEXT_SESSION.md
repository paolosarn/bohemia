SOUNDS (xk7pjp): 7/29 (f) LATEST — THE SFX FACTORY IS IN THE GAME. 60 SOUNDS,
12 MOMENTS, ALL WAITING ON HIS THUMB. MUSIC TAB, TOP OF THE PANEL.

THE LANE EXISTS AS OF TODAY and this is its item 0, greenlit when Paolo ordered
the chat into existence. It answers the only 0% on his own progress ledger
(7/28: combat 40, rig 59, music 30, clothing 25, world 15, animations 15, quests
10, NPCs 5, items 5, SOUND EFFECTS 0). Full record: records/BOHEMIA_SFX_FACTORY_
7_29_26.md.

WHAT IS ON HIS SCREEN: the MUSIC tab, above the songs. Twelve game moments —
footstep on dirt / asphalt / gravel, door opens, door shuts, pick something up,
you land a hit, blocked, kill-on-the-beat, UI tap, phone buzzes, saved — five
candidates each. Tap to hear, PLAY 5 to hear a row back to back on the beat,
thumb up or down, a note per sound, a comment box at the bottom, SUN MODE,
EXPORT SFX -> bohemia_sfx.txt.

A SOUND IS NOT A FILE. It is 22 numbers rendered at play time on the MUSIC
studio's own AudioContext — ONE context, the parent's, with its brickwall
limiter already in the chain. The whole batch is 20 KB of parameters. The 33 MB
alpha did not get heavier by a single sample, and an approved sound banks as its
vector, which is why it can be fingerprinted and regression-gated at all.

THE BANK IS EMPTY AND MUST STAY EMPTY. banks/BOHEMIA_SFX_BANK_7_29_26.txt has no
rows, BOH_SFX.BANK is {}, and play() on an unbanked event is SILENT on purpose.
The game makes no sound he did not choose. Do not pick sounds for him. Do not
re-cook this batch: it is surfaced, and bulk silence is itself a verdict
(UNJUDGED IS DEAD).

WHAT THE MACHINE CAUGHT THAT READING THE CODE WOULD NOT HAVE. Three real defects,
none of them visible in the parameters, all found by measuring actual audio:
  1. eight candidates rendered DIFFERENTLY on a second render — the node cleanup
     timer is a wall-clock timer and an OfflineAudioContext renders faster than
     the wall clock, so the graph was torn down mid-render. Cleanup is realtime-
     only now.
  2. the twelve families came out 20 dB APART (a bandpass at Q 5 throws most of a
     saw away). He would have been thumbing which ones he could HEAR. Every
     family's makeup gain is now measured off the real render onto a deliberate
     loudness ladder — a kill still dwarfs a footstep, because it should.
  3. the makeup gain sat BEFORE the bitcrusher, and a WaveShaper curve clamps
     past +-1, so driving a crushed voice hotter hard-clipped four of five PICKUP
     candidates to one flat level instead of making them louder.
  -> the lesson worth carrying: for audio, "it validates" proves nothing. A legal
     vector can render to silence, to a clipped smear, or to something that never
     stops. VERIFY ON THE REAL SURFACE means the waveform.

TWO THINGS THE BATCH DOES ON PURPOSE: candidate 1 of every event is the recipe
UN-JITTERED (so "none of these" can never mean "you never played me the straight
one"), and no two candidates differ by VOLUME alone — two recipes were jittering
their output gain and it was taken out, because five volumes of one sound is not
a choice.

GATES (both proved able to fail, then restored):
  SFX FACTORY  gates/sfx_gate.js — 73 checks. Spec is the only vocabulary, every
    duration on the 16th-of-a-beat grid, generator deterministic, candidate 1 is
    the plain recipe, no second AudioContext, no createDelay/createConvolver,
    bank empty, and the verdict workflow really on the surface (thumbs, per-item
    note, bottom comment, SUN, .txt export). Proof of teeth: defeated the beat
    quantizer, watched the grid law go red, restored.
  SFX RENDER   gates/sfx_render_gate.py — 752 checks. Opens the ONE alpha in a
    real browser, renders all 60 through an OfflineAudioContext and measures the
    samples: each makes a sound, none clips, each is SILENT 60 ms past its own
    spec'd length (the SCREECH LAW proved on the waveform instead of by grepping
    for createDelay), each renders identically twice, each sits in the judgeable
    loudness band, and none has drifted from its recorded fingerprint
    (records/BOHEMIA_SFX_FINGERPRINTS_7_29_26.txt; re-record deliberately with
    --record). Proof of teeth: moved one recipe's makeup gain, watched 11
    fingerprint checks go red, restored.

READ THIS AFTER YOU PUSH (cost this session 25 minutes of watching nothing).
GITHUB PAGES CAN SILENTLY SKIP YOUR PUSH. The push of the SFX commit produced NO
"pages build and deployment" run at all. Three other lanes pushed in the same
window and theirs all built. The only run after mine was labelled with my
commit's PARENT, so there was no run to point at proving the live site carried
the work — and BUILD STAMP + DEPLOY VERIFY (7/20) says pushing main is not
shipping until a run whose sha CONTAINS your content concludes SUCCESS.
  THE FIX, worked in one shot: push an EMPTY commit to main. That produces a
  fresh run labelled with a sha that contains everything; it concluded success in
  about two minutes. Do not sit and watch a second time — if no run appears
  within a few minutes of your push, nudge it.
  ALSO: this container cannot reach paolosarn.github.io at all (the network
  policy returns 403), so curl-ing the live page to read its build stamp is not
  available. The Actions API is the only deploy check you have.

READ THIS BEFORE YOU RUN THE GATES (cost this session a full re-run). A FRESH
CONTAINER HAS NO IMAGE STACK. Eight pixel-reading gates (HOUSE ART, ASSET
ROUNDUP, DOOR ART, ART 45, TARGET MATCH, TARGET SCREEN, LEAF PIXEL, PURITY) need
Pillow + numpy, and without them they report ModuleNotFoundError at the END of a
700-second suite - which reads exactly like eight real failures. It is one line:
    pip install -r gates/requirements.txt
That file is new, and bohemia_gates.py now prints a loud banner BEFORE the first
gate if either library is missing. Pass/fail semantics did not change: a gate
that cannot run still FAILS, because a gate that cannot run has held nothing.

BUILD STAMP: 7/29f - 60 SOUND EFFECTS TO JUDGE (MUSIC TAB).
GATES: full suite green (718s) on the merged tree, including both new SFX gates.
DEPLOY: verified — the pages run for this content concluded SUCCESS.

WHAT IS PENDING PAOLO:
  1. the 60 sounds themselves — MUSIC tab. Nothing downstream moves without it.
  2. (fleet, open since 7/27) what colour rebuilt Vegas is, in his words
  3. (fleet, open since 7/28) cars 2x3 vs the re-cook's shorter read

NEXT UNBLOCKED WORK FOR THIS LANE, in order:
  - IF VERDICTS ARE IN: process them (approve -> bank the vector + cook its
    variant set, 3-4 alternations per footstep so a walk does not machine-gun one
    sample; kill -> graveyard + post-mortem), then wire the approved events.
  - IF NOT: SOUNDS item 1, THE RUN HAS NO BEAT. The walk's BEAT=500 is a
    hardcoded constant and no tempo or beat index crosses the postMessage
    vocabulary, while combat gets full song data + HERO BEAT. This lane owns the
    plumbing, RUN consumes it. It is the prerequisite for footsteps landing on
    the grid, and it needs no verdict — do that one, not another sound batch.
  - DO NOT cook a second SFX batch while the first is unjudged. STOP PRODUCING.

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
COMBAT (04) 7/29 - THE FIGHT STANDS ON THE REAL STREET, AND YOU CAN PUSH PAST
YOUR KILLSHOTS. (Paolo: "lets continue working on combat please", then a
five-part message mid-turn.)

*** v95 THE KILLSHOT ALLOWANCE, AND A CORRECTION I OWED HIM ***
Paolo: "i didnt notice my rule where whatever how many killshots u have after it
becomes extremely hard implemented i didnt see that."
He was right it was not built. I WAS WRONG ABOUT WHY, and the 7/27 thinking doc
(records/BOHEMIA_COMBAT_THE_KILLSHOT_ALLOWANCE_7_27_26.md) now carries the
correction at the top:
  I SAID "the chain is UNLIMITED, you shoot until you miss." FALSE - enterAim
  stopped it DEAD: if(G._chainN>wpnCap()) -> 'CHAIN SPENT', turn over. A WALL.
  I SAID "there is no per-turn shot counter anywhere in the file." FALSE -
  G._chainN has existed since v17, the read has printed "SHOT 1/2" the whole
  time, and there is a settings button KILLSHOTS/TURN cycling G.chainSkill 1-8.
  HOW: I searched for the mechanic by its ABSENCE instead of by its NAME. It was
  90% built. The missing 10% was the only part he cared about.
SO THE BUILD IS SMALL, WHICH IS WHY IT IS RIGHT: one wall came down.
  * allowance = his own KILLSHOTS/TURN dial (default 2), capped by the weapon
  * past it the shot STILL HAPPENS, at V.HARD then BOHEMIAN ("extremely hard" is
    his word, so it is extreme immediately)
  * THE RAMP IS A FLOOR: pkgDiff = max(rangeDial, rampDial). Point blank still
    pulls easier exactly as he ruled 7/27 but can never cancel the ramp, so
    closing the distance is HOW YOU AFFORD the extra shot
  * CONTENTS-PAOLO'S: CHAIN_ALLOWANCE_BY_DIFF ships [null x5]. When he names five
    numbers they go in and nothing else moves.
  * THE WEAPON CEILING IS STILL A WALL and is not ramped (physics, not
    difficulty): pistol 8, smg 2, shotgun 2, rifle 1. Pistol is the chain weapon.
  * THE READ SAYS IT, because "i didnt see that" IS the complaint: the headline
    flips to PUSHING in red, both reads say SHOT 3 OF 2 - PAST YOUR ALLOWANCE.
  TOOL: tools/bohemia_combat_killshot_allowance_patch.py | GATE section 31

*** v94/96/97 THE FIGHT STANDS ON THE APPROVED STREET (the 7/28 wiring debt) ***
Combat was THE LAST SURFACE STILL INVENTING ITS OWN GROUND: a coordinate hash, a
tone jitter, a flat rgb() per cell, plus a hand-drawn double-yellow median and
lane dashes at hardcoded world coords. It now blits the tileset Paolo approved
7/28 and picked AGAIN 7/29 - the one the RUN ships, byte-locked in the
constitution - plus the approved median/lane_div from STREET_POOLS_HARMONIZED.
*** AND IT KILLS THE ORANGE AT THE ROOT. *** The hand-painted median composited
to luminance 113 across a solid full-height bar drawn AFTER the vignette meant to
dim it. The approved median tile peaks at 94-101 on a handful of dashed pixels,
because HIS OWN markings_30yr_law was applied when it was cooked. v84C could only
FADE the object; now the object is GONE, and the gate forbids that colour being
drawn by this file at any alpha.
MEASURED BEFORE MIXING TWO BANKS (not assumed): recook road vs pool median = 2.6
luminance apart, saturation 0.14-0.16 vs 0.13-0.16. They sit together.
EVERY ROTATION MEASURED OFF THE PIXELS, none guessed: the kerb lip is a bright
band on the BOTTOM edge (146.4 vs walk_0's 117.2), the gutter shadow is on the
TOP edge (49.5 vs 61.4), the markings run HORIZONTAL (row var 4.6 vs col 2.1).
All are authored for an EW road; this street runs NS, so they turn.
TWO BUGS I FOUND BY LOOKING AT THE RENDER, BOTH MINE:
  v96 THE SIDEWALK NEVER ENDED - 'walk' was returned for every cell past the kerb
    FOREVER, so the fight happened on an infinite concrete sidewalk covering two
    thirds of the screen. Two tiles now, then the lot.
  v97 *** I BROKE PAOLO'S OWN DOMINANCE LAW. *** v96 let the per-cell hash pick
    freely from a 6-tile lot pool -> a CHECKERBOARD. The street bank carries, in
    his words: desert_dominance_law, dominant 0.85, accents "one tile per
    region", BANNED "per-cell random shuffle", source "Paolo 7/14: too much
    diversity with the desert tiles". PER-CELL RANDOM SHUFFLE IS THE ONE THING
    THE LAW NAMES AS BANNED AND IT IS EXACTLY WHAT I WROTE - and I had quoted
    that same bank's markings laws into a record the day before without applying
    the law three lines above them. Now: one hash per 4x4 region, dominant or a
    single accent, never a mix. Concrete left the pool (a slab scattered through
    dirt is a BUILT thing placed by nobody = MAP LAW).
  THIRD PASS ON THIS GROUND. If it is still wrong the next turn SAYS I STOPPED
  rather than shipping a v98 of the same surface (STOP PRODUCING).
  TOOLS: bohemia_combat_street_tiles / _street_edges / _lot_dominance _patch.py
  GATE section 30. Combat gate 469 -> 486 checks. EIGHT older checks asserted the
  superseded code and were RE-POINTED AT THEIR INVARIANT, never relaxed; two of
  my own new checks were bugs (one matched a COMMENT quoting the dead colour).

*** ANSWERED, NOT BUILT ***
records/BOHEMIA_COMBAT_ANSWERS_NIGHT_GRENADES_ARENAS_7_29_26.md
  NIGHT ACCURACY - he asked if darkness should hurt everyone's accuracy. MY
    ANSWER IS NO: a symmetric penalty changes no decision, which is the tally
    mistake again. THE VERSION THAT IS A MECHANIC: darkness shrinks RANGE, not
    accuracy - multiply the distance term in distPkg. Far shots get much worse,
    point blank is untouched, so HIS OWN point-blank ruling gets LOUDER after
    dark. And it turns LIGHT=TERRITORY into a tactical map: lit = hittable from
    across the lot, dark = they have to come to you. One multiplier, no new
    system. The size of it is [PENDING Paolo].
  GRENADES - *** YOU CANNOT THROW ANYTHING. *** The only grenade in the game is
    thrown AT you (grenadeTurn: one per encounter, 2-beat fuse, move off the tile
    or eat it). Molotovs do not exist at all. Already built and reusable: the
    fused object, the pulsing danger tile with the count, the blast ring, the
    "you moved so you dodged" resolution, and the approved fire loops that have
    no consumer. Missing: a target picker, blast damage applied to ENEMIES (today
    it only measures YOUR distance), and what a throw costs.
    RECOMMEND THE MOLOTOV FIRST: fire that STAYS is area denial, which is a
    positioning mechanic (north star), and it consumes an approved bank.
  ARENAS - "u have like a 4th grade level of understanding when i say arenas fr".
    Taken at face value. What I built is a scatter of blocks on a field with no
    place, no purpose and nothing that says Las Vegas. An arena is a PLACE whose
    SHAPE makes one plan better than another. *** I AM NOT BUILDING A FOURTH
    VERSION ON A GUESS *** - it is question 1 to him.
  COMPANIONS + SNEAKING - recorded as the lane's next direction, not started.
    Sneaking is the bigger change: today every fight opens with both sides fully
    aware and placed, the flattest possible opening. Companions: the occupancy law
    and the 120 grid already carry a second friendly body; the open question is
    whether it takes its own turn or acts on yours [PENDING Paolo]. Both are
    downstream of the arena answer.

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
