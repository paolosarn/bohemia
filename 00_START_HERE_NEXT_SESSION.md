SOUNDS (xk7pjp): 7/29 (h) LATEST — THE SOUNDS ARE REMADE. HE SAID v1 SOUNDED
LIKE 2006 SOFTWARE AND HE WAS RIGHT TO THE YEAR. MUSIC TAB, TOP OF THE PANEL.

HIS RULING on batch SFX-01: "okay its decent i appreciate it. it sounds like it
was made with some software from 2006 so if we could do better than that for all
of them. i want you to do big brain research on final fantasy 10's ui sound
system. by far my favorite ui sounds of all time. remember i love the idea of
apocolypictc horror final fantasy shit so remake all of these. they were mid at
best tbh but its the right direction."
  DIRECTION APPROVED (the 12 moments, the judge surface, the factory law).
  SOUNDS KILLED and remade. Graveyard 2026-07-29 with the full post-mortem.

HE DATED IT ALMOST EXACTLY. v1 was the sfxr topology -- one source, one filter,
one envelope -- and sfxr shipped in 2007. It was also behind RISSET'S BELL of
1969, which already gave each of eleven partials its OWN duration. Research with
sources: records/BOHEMIA_RESEARCH_FFX_UI_SOUND_7_29_26.md

WHAT THE RESEARCH FOUND, and what v2 does about it:
  - FFX played RECORDED RESONANT OBJECTS into the PS2 SPU2's HARDWARE REVERB
    (Room/Studio/Hall/Space), and FFX was the FIRST Final Fantasy to move its
    sound effects off MONO. v1 was synthetic, dry, and pan 0 on all 60 -- the
    exact axis FFX treated as its upgrade.
  - v2 is MODAL: every sound is a struck material with 8-16 INHARMONIC partials,
    each with its OWN decay, and the decay SHORTENS as the partial rises. That
    one property is the loudest "synthetic" tell there is; nothing physical
    stops all at once.
  - WARBLE: paired partials offset by a few Hz beat slowly, the way a real bell
    does from material asymmetry.
  - THREE LAYERS: transient (the snap), body (the modal bank), tail (the room),
    transients sample-aligned, snap slightly hotter than the body.
  - THE ROOM IS BUILT AS SOURCES, NEVER PROCESSORS, because the SCREECH LAW bans
    createDelay and createConvolver: early reflections are the body re-struck at
    scheduled offsets, and the late tail is filtered noise under an exponential
    decay -- which is what a late reverb tail physically IS (the velvet-noise
    result, inverted). Nothing can ring or feed back.
  - STEREO for real: partials radiate in different directions, reflections pan
    opposite.

THE MATERIALS (the apocalyptic-horror FF direction, applied):
  ash -> footsteps, dirt and gravel      stone -> asphalt, wet concrete
  metal -> doors, blocks, the phone      wood  -> the door shutting
  crystal -> UI tap and pickup           bell  -> the kill and the save (Risset)
  and bone for impacts. THE TAIL RULE: only sounds that MEAN something get the
  room. Footsteps stay dry and close, or walking turns the game into a
  cathedral. That contrast is the horror.

THE BANK IS STILL EMPTY AND MUST STAY EMPTY. Nothing is chosen. play() on an
unbanked event is silent on purpose.

WHAT THE MACHINE CAUGHT THIS ROUND (v2), all of it real:
  1. THE OUTPUT GAIN WAS DRIVING INTO THE SATURATOR, pinning HIT/BLOCK/KILL/
     PHONE at exactly 1.000. Same class of bug as v1's crush placement: a
     WaveShaper clamps past +-1, so a hotter input does not get louder, it pins.
     The saturator SHAPES, the gain LEVELS, in that order.
  2. MY DURATION MATHS WAS WRONG. beatsOf() ADDED the room to the body, but the
     room is triggered at the same instant as the strike -- so every roomy sound
     was reported about twice as long as it is. The gate then called five bells
     "a click" for being audible over a third of a length that never existed.
     A duration this engine reports is one the game schedules against.
  3. THE SATURATOR'S 2x OVERSAMPLING CARRIES STATE, and across the ~120 offline
     contexts a gate run creates, one candidate rendered 1.8% differently the
     second time while measuring 0.0001% in isolation. It is memoryless now: a
     judged sound cannot depend on how many sounds were rendered before it.
  4. THE STEREO SPREAD WAS A LEFT-TO-RIGHT RAMP, which put partial 0 -- the
     loudest in every bank -- hard on one side and collapsed several candidates
     back to near-mono. Partials now radiate in alternating, widening directions.

AND TWO PLACES WHERE MY OWN NEW GATE WAS WRONG, corrected against the reference
rather than around it:
  - "per-partial decay must fall monotonically" FAILED RISSET'S OWN TABLE
    (partial 6 rings 0.35 against partial 5's 0.325). Real bodies have local
    exceptions; what they never do is let the top ring as long as the bottom. It
    is a trend check now.
  - "every bank must be inharmonic" failed `choir`, and a sung voice really IS a
    harmonic series. choir and water are named exemptions, for physics.

GATES (both extended, both proved able to fail, then restored):
  SFX FACTORY  gates/sfx_gate.js — 135 checks. Now also: engine is v2, every
    material bank inharmonic (with the two physics exemptions named), per-partial
    decay trend, no partial outliving the fundamental, Risset's bell reproduced
    VERBATIM, three layers present, the batch not dead-centre mono, footsteps dry
    and the big moments roomy. Proof of teeth: flattened a bank back to one
    shared decay -- the exact v1 defect -- and watched it go red by name.
  SFX RENDER   gates/sfx_render_gate.py — 843 checks, now in STEREO. Each of the
    60 renders makes a sound, does not clip, is silent 60 ms past its own length,
    is not a click, has real stereo width, sits in the judgeable loudness band,
    and has not drifted from its recorded fingerprint. Determinism is measured
    RELATIVE to each sound's own peak (0.2%, -54 dB), because an absolute bar was
    measuring voice count rather than correctness.

FOR THE RUN LANE, NOT MINE TO FIX: **TILE FORM is RED on main right now**, and it
was red before this ship. TF-RUN-008_resources_icon, TF-RUN-009_energy_icon and
TF-RUN-010_clout_icon all declare `acts [1,2,3]` while the act-1 law requires
[1] unless a Paolo ruling is cited. Proved pre-existing by checking out clean
origin/main and running gates/tileform_gate.py there: same three failures, none
of those files in this lane's diff. Whether those icons are act-1-only or
all-acts is the RUN lane's content call and a session that is not that lane
should not be editing their forms to make its own suite green. 162 of 163 gates
were green on this tree; that one is the exception and it is inherited.

BUILD STAMP: 7/29i - SOUNDS REMADE: STRUCK MATERIALS (MUSIC TAB).
  (7/29g was the combat lane's, same afternoon. Check the stamp before you pick
   a letter; three lanes shipped on 7/29.)

READ THIS AFTER YOU PUSH (cost this session 25 minutes of watching nothing).
GITHUB PAGES CAN SILENTLY SKIP YOUR PUSH. An earlier push today produced NO
"pages build and deployment" run at all, while three other lanes pushed in the
same window and theirs all built. The only run after it was labelled with the
PARENT commit, so there was nothing to point at proving the live site carried the
work -- and BUILD STAMP + DEPLOY VERIFY (7/20) says pushing main is not shipping
until a run whose sha CONTAINS your content concludes SUCCESS.
  THE FIX, worked in one shot: push an EMPTY commit to main. Fresh run, correctly
  labelled, success in about two minutes. If no run appears within a few minutes
  of your push, nudge it; do not sit and watch.
  ALSO: this container cannot reach paolosarn.github.io at all (403 from the
  network policy), so curl-ing the live page to read its stamp is not available.
  The Actions API is the only deploy check you have.

READ THIS BEFORE YOU RUN THE GATES. A FRESH CONTAINER HAS NO IMAGE STACK. Eight
pixel-reading gates need Pillow + numpy and without them report ModuleNotFoundError
at the END of a 700-second suite, which reads exactly like eight real failures:
    pip install -r gates/requirements.txt
bohemia_gates.py now prints a loud banner BEFORE the first gate if either is
missing. Pass/fail semantics unchanged: a gate that cannot run still FAILS.

WHAT IS PENDING PAOLO:
  1. the 60 REMADE sounds — MUSIC tab. Nothing downstream moves without it.
  2. (fleet, open since 7/27) what colour rebuilt Vegas is, in his words
  3. (fleet, open since 7/28) cars 2x3 vs the re-cook's shorter read

NEXT UNBLOCKED WORK FOR THIS LANE, in order:
  - IF VERDICTS ARE IN: process them (approve -> bank the vector + cook its
    variant set, 3-4 alternations per footstep so a walk does not machine-gun one
    sample; kill -> graveyard + post-mortem), then wire the approved events.
  - IF NOT: SOUNDS item 1, THE RUN HAS NO BEAT. The walk's BEAT=500 is a
    hardcoded constant and no tempo or beat index crosses the postMessage
    vocabulary, while combat gets full song data + HERO BEAT. This lane owns the
    plumbing, RUN consumes it. Prerequisite for footsteps landing on the grid,
    and it needs no verdict.
  - A THIRD BATCH IS NOT THE MOVE. He has rejected once and remade once; STOP
    PRODUCING says a second rejection ends the feature for the session. If v2
    misses, the honest turn is to say so and stop, not to cook v3.

NOTE FOR THE OTHER LANES: this touched the MUSIC tab and engine/bohemia_sfx.js
only. It did not touch a single song, voice or note of the music studio, and it
added no second audio engine. If your lane wants a sound, call
BOH_SFX.play(event, AC, dest) — silent until Paolo has ruled on that event, and
that is correct behaviour, not a bug.

--------------------------------------------------------------------------------
EVERYTHING BELOW IS THE OTHER LANES' LIVE STATE, CARRIED FORWARD UNTOUCHED.
--------------------------------------------------------------------------------

*** MAIN IS RED AND IT IS NOT COMBAT'S BREAK (flagged 7/29 by the combat lane) ***
gates/tileform_gate.py (new, built by another lane the same day the form law asked
for it) fails 3 of 67 forms on origin/main ITSELF, at commit 31a4d9b:
  TF-RUN-008 / 009 / 010 (the currency icons): "caption acts must be [1] (act-1
  law) unless a Paolo ruling is cited; got [1, 2, 3]"
COMBAT'S EIGHT TF-CMB FORMS PASS. Verified the failure reproduces on origin/main
with none of this lane's commits, so this lane pushed its own green work rather
than blocking on somebody else's red.
NOT FIXED BY ME ON PURPOSE: acts [1,2,3] may well be CORRECT canon -- a currency
icon plausibly exists in all three acts -- in which case the FORM needs to cite
the ruling, or the GATE is too strict. Either way that is a canon call inside
another lane's work and guessing at it is exactly what MECHANISM-MINE/
CONTENTS-PAOLO'S forbids. RUN/ART lane: this is yours, and it is currently
turning every lane's suite red.

COMBAT (04) 7/29 (b) - FOUR RULINGS BUILT, TWO MORE ANSWERED, TWO DELIBERATELY NOT
BUILT. Paolo sent four calls, then three more mid-turn.

*** v98 THE DARK SHRINKS THE RANGE (he approved the pitch: "i really like this
nice research lets do it") ***
NOT an accuracy penalty. A symmetric penalty changes no decision and just makes
the fight longer = the tally mistake. IT IS ONE NUMBER, and that is the elegance:
every range read in this fight already runs through distT, so shrinking the far
end moves MY dial (distPkg), THEIR hit chance (distAccuracy) AND the range
words+colour at once. *** POINT BLANK IS EXACTLY, PROVABLY UNTOUCHED: distT
subtracts PT_BLANK before dividing, so it is 0 for any d<=PT_BLANK whatever the
far end is. His 7/27 point-blank ruling gets LOUDER after dark instead of taxed.
*** Measured: a man 15 tiles out reads MID RANGE / their acc 0.67 at morning,
LONG RANGE / 0.52 at dusk, LONG RANGE / 0.37 at night. NIGHT_RANGE is a dial.

*** v98 THE ALLOWANCE IS A PERK, NOT A DIFFICULTY ***
Paolo: "the kilshot how many u get before its incredibly difficult is on a slider
unrelated to difficulty but to perks you get in the game."
v95's CHAIN_ALLOWANCE_BY_DIFF is DELETED. It comes from G.chainSkill only, and
the settings control now reads KILLSHOTS (PERK). *** THIS IS WHY MECHANISM-MINE/
CONTENTS-PAOLO'S EXISTS: the table shipped EMPTY, so his correction deleted a
WIRE and changed no gameplay. Five invented numbers would have silently
rebalanced the fight. *** The old v95 gate check was rewritten to record that.

*** v99 YOU CAN THROW A GRENADE (Paolo: "grenade first") ***
The only grenade in the game was thrown AT you. Now both directions.
*** THEY GET THE SAME TWO BEATS YOU DO. *** A man in the blast STEPS OFF THE TILE
and loses the stone he was tucked behind. That is what makes it a POSITIONING
tool instead of free damage: it FLUSHES people out of cover, pushes a shooter off
an angle, and still kills whoever cannot clear it. Costs a pip AND ends the turn
into the volley, like popping out to shoot. 2 per fight (dial). A grenade kill is
NOT a killshot: no dial cinematic, no chain -- the chain is the reward for the
DIAL, which is what keeps the allowance meaning something. Yours draws AMBER,
theirs stays RED.

*** v100 THE WAREHOUSE (Paolo: "for arena lets start off with a warehouse or
something. think about all the shit you will need to hide behind") ***
After "u have like a 4th grade level of understanding when i say arenas fr",
which was fair: what I had was a scatter of blocks, and A SCATTER HAS NO
THROUGH-LINES, so it can never make one plan better than another at any density.
A warehouse is ONE IDEA REPEATED: racking in long rows, which makes AISLES.
  ACROSS the racking you are SAFE (tall, no vault, no line)
  ALONG the aisle you are NAKED (a corridor, no lateral cover)
So the fight becomes WHICH AISLE DO I COMMIT TO AND WHERE DO I CROSS.
  RACKING tall | CROSS AISLES = the only way to change aisle = the kill zones |
  PALLETS low+vaultable IN the aisles = the only reason an aisle is survivable |
  STEEL COLUMNS on the bay grid | THE STAGING FLOOR left EMPTY on purpose (the
  shortest way across is the one with nothing on it) | THE MEZZANINE, always
  present indoors -- the FIRST TIME the v90 cross-level cover rule has paid for
  itself, because height means seeing down the rows.
MEASURED THEN TUNED: aisle 2 gave ONE-tile aisles and averaged 128 blocks (max
186) -- a corridor you cannot fight in. Aisle 3-4 gives 2-3 tile aisles, avg 100.
Rolls 50/50 with the street; the seed reproduces which kind you got.
Floor = approved concrete slab. The arena button says WAREHOUSE #nnnnn, because
an arena you cannot NAME is a field with rocks on it.

*** v101 HIT IN THE CHEST, NOT THE FEET (his reported bug) ***
Paolo: "when people are on a second story you just have the location of them
wrong when it comes to getting shot... its like their feet."
ROOT CAUSE: drawHuman blits the sprite 84px ABOVE the point it is handed, so
EVERY position in this file is a man's FEET and every ring drawn at it is on the
floor rather than on him. Always wrong; merely survivable on one floor. On a
second storey his feet are a whole storey below his body. MASS_DY=-42 is half of
drawHuman's OWN offset, so it is derived not eyeballed. Body marks moved (cover
arc, blade telegraph); GROUND marks deliberately did not (blood pool, brass).
AND THE DRIP CARRIES ITS LEVEL -- a man bleeding on the mezzanine was dripping
onto the ground floor.

*** v101 THE APPROVED STREET BANK (Paolo: "i really like the street please use
approved streets though but its looking so good") ***
The roadway was the starter set's RESIDENTIAL road while the markings came from
STREET_POOLS_HARMONIZED. Now the whole roadway is the STREET BLOCKS row of the
approved index (REAL_VEGAS R2, already wired in CITY): pools.street x8 +
pools.side x8. Road and markings finally cut from the SAME source, so they match
by construction instead of by a measurement I had to take, and 8 x the v96
quarter-turns is 32 faces instead of 12. The starter set keeps the kerb, gutter
and lot (the pieces the street bank does not carry, and whose orientation v94
measured).

GATE: combat 486 -> 513. ELEVEN older checks asserted superseded text and were
RE-POINTED AT THEIR INVARIANT, never relaxed. One of v95's checks was superseded
BY A RULING (the only legitimate way a check dies) and was rewritten to assert
what v95 got right. AND ONE OF MY OWN NEW CHECKS MATCHED A COMMENT AGAIN --
v98's comment names the dead table to explain why it is dead. Second time this
turn. The rule is now written into both: assert the DECLARATION, not the word.

*** NOT BUILT, ON PURPOSE, WITH THE DESIGN WRITTEN OUT ***
records/BOHEMIA_COMBAT_NEXT_TWO_DIAL_COVER_AND_CARS_7_29_26.md
Five things shipped this turn that he has not seen. Adding two more untested
features to that pile is the pile-up STOP PRODUCING exists to prevent.
  1. THE COVER POSE FOLLOWS THE DIAL ("so that killshot they better be out of
     cover"). Best idea in the message and nearly free: G.angle, the zone widths
     and the tuck/peek frames ALL already exist. It makes the dial a PICTURE OF
     THE TRUTH instead of a gauge drawn over the fight -- you stop reading a
     needle and start reading a man. It SELECTS existing poses, touches no rig,
     no clip, no BAKED pose, so it stays clear of the animation revamp.
  2. CARS. *** HIS RULING: A CAR IS 2 TILES BY 3 TILES. *** That is the first
     MULTI-TILE cover in the game, which is a genuinely different object: it
     blocks a LENGTH not a point, and the engine end hides you to the chest while
     the boot end hides you to the waist -- one object, two cover values, which
     no block can do. The work is that pillars are CIRCLES and a car is a
     RECTANGLE, so about five cover/collision functions need rectangle maths.
     DO THE SHOPPING CHECK FIRST: car_wreck x20 exists in STREET_PROP_POOLS but
     that bank is "corpus art, no new canon" and is NOT in the approved index --
     render the 20 at 2x3 and LOOK before deciding this is an art ask at all.
     His 2x3 ruling must also be amended into TF-CMB-003.

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

--------------------------------------------------------------------------------
7/29 (f) — HOUSE 01 KILLED. SHAPE STUDY IN THE LIFE TAB.

PAOLO, VERBATIM: "so this could be a fucking trailer home bro. a trailer home with
a grage? its ass lowkey. if you tride to made a trailer home it would have a garage
and the roof would be more ugly. so if its a trailer home its 75% done. i need you
to care about house shapes and shit bro. like fr. thats my verdict fo house 01"

HOUSE 01 IS DEAD. Graveyard 2026-07-29, verdict in
records/BOHEMIA_HOUSE_01_VERDICT_7_29_26.txt. Bank, judge page and sheet deleted.

HE IS RIGHT AND THE DIAGNOSIS IS EXACT. I measured everything and shaped nothing.
Every dimension was real and machine-checked and I still built a 15 x 9 m BAR with a
flat unbroken front and one continuous roof plane, which IS a trailer silhouette,
then bolted a garage on it, which a trailer does not have. The research convicts
every choice: mobile homes read as such at 2:12-3:12 with ~6 in eaves, site-built is
4:12+ with 12-16 in; and of every suburban type the ONLY one with no massing break
is the hip ranch with the garage absorbed into the main volume. That is exactly what
I drew, with the shallowest roof available.

THE REAL FAILURE IS ORDER OF OPERATIONS: I got the door right to the millimetre
before deciding what the building WAS. **Human sizing is a CONSTRAINT. Shape is the
DESIGN, and it comes first.**

AND THE THING EVERY FUTURE SESSION SHOULD TAKE FROM THIS: gates/human_scale_gate.py
was GREEN the entire time that house was a trailer. Eleven checks, all passing, on a
building he called ass. A green gate is evidence about the thing it measures and
evidence about NOTHING ELSE. Nothing in the machine had an opinion about shape,
because I had only ever taught it to care about measurements.

NOW IN THE LIFE TAB (top card, green): a 7-shape MASSING STUDY, silhouette only, no
detail to hide behind, all at true scale with the real player sprite. #1 is a real
single-wide and #2 is house 01, both on the sheet so the mistake is visible rather
than described. He picks which shapes go in the sixteen (multi-select).
  tools/bohemia_house_massing.py -> records/target/HOUSE_MASSING.png

NEW GATE: gates/house_shape_gate.py, registered as HOUSE SHAPE. The shape law, three
numbers from the research not from my taste: >=2 masses, >=4:12 pitch, >=12 in eave,
and nothing over 3.5:1 (a single-wide is 4.9:1). It carries TRAILER and HIP as its
own PERMANENT NEGATIVE TEST — the gate fails if it ever accepts the two shapes he
rejected, so the proof-it-can-fail lives inside the gate instead of in a throwaway
script. 8 checks. 5 legal shapes: L-RANCH, SNOUT, CROSS-GABLE, TWO-STORY, SPLIT.

WHAT SURVIVED THE KILL: the scale work and gates/human_scale_gate.py. 1 px = 1.705
cm, the sprite is 1.74 m, and the tile grid's 2-cell door is 1.50 m — 24 cm SHORTER
than the character. True of every future house and untouched by this verdict.

DO NOT COOK A HOUSE UNTIL HE PICKS SHAPES. He rejected once; STOP PRODUCING says a
second rejection ends the feature for the session. The next cook starts from his
picks, not from another guess.

[PENDING PAOLO] doubling the art cell 44 -> 88 px ("thats down the line").

BUILD STAMP: 7/29h (bumped past the RIG lane's 7/29g, which landed mid-rebase).

ALL MY GATES GREEN. **MAIN IS RED AND IT IS NOT MINE**, said plainly rather than
buried: gates/tileform_gate.py fails 3 of 8167 checks on TF-RUN-008/009/010 (the
currency icons, commit 31a4d9b, RUN lane) -- "caption acts must be [1] (act-1 law)
unless a Paolo ruling is cited; got [1, 2, 3]". VERIFIED PRE-EXISTING: checked out
clean origin/main in a throwaway worktree with none of my changes and got the
identical 3 failures. Not fixed here on purpose -- which ACTS a form targets is that
lane's content decision, and ONE SYSTEM ONE SESSION says I do not quietly edit
another lane's forms. **RUN lane: either drop those captions to act 1 or cite the
Paolo ruling that lets them span three acts.**

THE LANDMINE I NEARLY STEPPED ON, recorded because the WORLD lane armed a warning
about it and it saved me: slices/BOHEMIA_LIFE_CURRENT.html is now GENERATED by
tools/bohemia_life_hub.py. My hand-edit to the hub would have been silently wiped
the next time anyone regenerated. The dead HOUSE 01 card was removed and the SHAPE
card added IN THE GENERATOR; the artifact is just its output.
