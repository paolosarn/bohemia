LAB (e2r7sv): 7/31 LATEST — WHAT AN ACTION COSTS, ANSWERED OFF REAL C++, AND A GATE
BUG THAT WAS PUNISHING HONEST NOTES.

=== WHY THIS EXISTED TO DO ===
Paolo's 7/28 correction is clause 17 of laws/BOHEMIA_ADDENDUM_THE_MOBILE_CAMP_7_27_26.md:
"time will pass just by taking actions in this game and you really need to understand
that sort of clock." He was right, and the moment he ruled it the repo had a hole —
NOTHING COULD SAY WHAT ONE ACTION COSTS. Clause 4 of the time law reserves the cost
TABLE to him ("no lane invents an action-cost table"), so writing costs was illegal.
The legal move was to go get the best engineered answer that exists and hand him the
SHAPE. Cataclysm: DDA was ranked #1 of nine for exactly this in
records/lab/BOHEMIA_LAB_RESEARCH_CANDIDATES_7_26_26.md, filed BEFORE it was needed.

=== SHIPPED, FULL SUITE GREEN ===
PAGE (NOT IN A TAB — a lab reference surface, and by lab_gate clause 3 it may NEVER
be linked from the alpha): slices/lab/BOHEMIA_LAB_CDDA_ACTION_COST_7_31_26.html
Five mechanics playable end to end: action cost / condition / travel / errands /
sleep debt. A real EMULATION, not a model — the game is open source, so all 34
constants were read off real lines of its C++ this session.

FINDING 1, better than a table of minutes: AN ACTION'S COST IS FIXED, IN "MOVES"
(calendar.h:289 — 100 moves = 1 turn = 1 second). YOUR CONDITION CONVERTS MOVES INTO
TIME. AND IT CAN NEVER EXCEED 4x, BECAUSE SPEED HAS A FLOOR (character.cpp:7652,
their comment verbatim: "Speed cannot be less than 25% of base speed"). The table
stays one stable number per action; the FELT cost moves with how wrecked you are; a
bad day can never become an infinite one. The floor is the part to steal first.

FINDING 2, straight onto our tile clock: A STEP IS AN ACTION, PRICED IN THE SAME
CURRENCY (character.cpp:6022 run_cost(100,false); :6103 caps bonuses so a step can
never cost LESS than 100). Their walking and doing are ONE clock. Ours are TWO on
purpose (clause 17: the buff burns on steps, the day burns on every action). That
divergence is now CHOSEN, not unexamined. Their WORST step is 4.00 s; our AVERAGE
step is 3.52 s (clause 16) — coincidence, but a useful one to feel.

SMALLER PATTERNS worth having: THRESHOLDS NOT SLOPES (weight free under your cap,
:7613; thirst free to 40, :7620) so a penalty arrives as a decision, not a drip; a
skill that halves BAD ground only (Parkour, :6096); TRAVEL = BASE + RATE (20 min +
dist x 10, mission_companion.cpp:1358); an ERRAND IS A DECLARED BLOCK paid rate x
hours (1/4/10/20 h at 3/4/5); and SLEEP DEBT'S FIRST RUNG IS TWO WHOLE DAYS
(character.h:247) — one rough night is free, which agrees with his own clause 6 that
ignoring the camp must stay playable.

RECORDS: records/lab/BOHEMIA_LAB_CDDA_TEARDOWN_7_31_26.txt (all 34 constants with a
file:line printed from the fetched source, plus every omission named by line so the
gap is countable) and records/lab/BOHEMIA_LAB_CDDA_PATTERN_NOTE_7_31_26.md.

=== TWO THINGS I GOT WRONG, BOTH RECORDED IN PLACE ===
1. FOUR OF MY FIRST-DRAFT CITATIONS WERE WRONG by a few lines, written from memory
   before the files were fetched (MOVES_PER_TURN 288->289; BASE_SPEED pointed at a
   call site instead of creature.cpp:189 where the value is set; SHORT_MIN 7545->7547;
   LONG_MIN a bare "1_hours"->character.cpp:2378). All corrected against the real
   files and OWNED at the top of the teardown. A number you did not print from the
   file is a guess wearing a citation — the 7/18 verify-on-the-real-surface law again.
2. A REAL GATE BUG, THIRD OF ITS KIND: lab_gate's A24 (the no-port-claims check) was
   failing the DENIAL that every honest note is required to write ("Nothing here is
   wired into the engine"). Same class as A10 (cited engine paths) and A12 (the toast
   "no recipe, no item"). Fixed properly: collapse whitespace, then scope the negation
   to the SENTENCE. THE PART WORTH READING: my first two fixes both passed a PLANTED
   REAL CLAIM ("I wired it into the engine this afternoon"), because per-line failed on
   hard-wrapped prose and a flat 90-char window caught a "never" from the sentence
   before. Only mutating in BOTH directions found that. A gate tested one way is half
   tested.

=== GATE ===
gates/lab_gate.js: new CDDA row, 28 live checks (D0-D27), and it learned .cpp/.h
citations — its first C++ master. 332 checks, 0 fail. Six mutations caught: floor
removed, cost drifting with pain, travel divided by speed, early errand collect, first
sleep rung moved to one day, thirst turned into a slope. Screenshotted on the real
390x844 surface, top and bottom.

=== WHERE THE LAB LANE ACTUALLY IS ===
NOTHING PORTED. Under laws/BOHEMIA_ADDENDUM_LAB_PORTS_ON_HIS_WORD_7_26_26.md a lab
finding moves into the game only when he says so.
BLOCKED ON PAOLO, and deliberately not producing around it (STOP PRODUCING law):
  1. THE ONE QUESTION FOR THIS PAGE: is the SHAPE right — a fixed cost in a fine
     currency, your condition as the divisor, and a hard cap on how bad the divisor
     can get? If yes, the numbers are a short conversation. If no, the table was
     never the problem.
  2. HIS PLAYTEST OF slices/lab/BOHEMIA_LAB_MOBILE_CAMP_DIAL_7_27_26.html. 31 dials,
     each with its law clause. Everything downstream of the camp waits on the feel.
  3. THE MOBILE-CAMP PENDINGS, none of which any lane may invent: (a) the pool's
     name, (c) supply costs, (d) whether max HP moves (MAX_HP_MOVES defaults OFF
     because "idk" is not a ruling), (e) exact stamina numbers, (f) carry limit,
     (g) the camp item list, (i) per-button time costs, (k) shelters per act,
     (l) meal buff size, (m) blood-loss policy (options written and a recommendation
     made in records/BOHEMIA_BLOOD_LOSS_OPTIONS_7_27_26.md — option 2, ONLY SERIOUS).
  4. THE ACTION COST TABLE itself, clause 4. This page exists to make that a feel
     question instead of a spreadsheet question.
HELD, not formed (tile forms): H5 the supply pool's searched-container state (blocked
on clause (a), and loot is a CLOSED lab subject after two kills); H6 friendly shelter
looks (blocked on clause (k), and it is WORLD's district content — LAB flags, does
not claim).
LOOT IS CLOSED. Two loot emulations died in two days (Zomboid house, A Dark Room
scavenge). No third one, by the STOP PRODUCING law. The graveyard gate keeps both
pages from coming back.

WORLD (9lfjtf): 7/30 — THREE GATES SHIPPED, AND I INDEPENDENTLY DIAGNOSED THE DEAD
ALPHA THEN THREW MY OWN FIX AWAY BECAUSE SOUNDS GOT THERE FIRST AND GOT IT RIGHTER.
Read the CHARACTER and SOUNDS sections below for the incident itself; this is only
what the WORLD lane adds on top.

=== SHIPPED (6582eed, full suite ALL GREEN 586s) ===
Three laws that had no machine behind them now have one. All three RATCHET: floors
set from what is already true, named debt may only shrink, new work cannot add.
  - TOOLS RUN (gates/tools_run_gate.py) — every tools/*.py and *.js PARSES, every
    gate parses, and the hero bank is REPRODUCIBLE byte-for-byte from its factory
    (snapshot, re-run, compare, restore). The hole I proved by falling in it: on
    7/28 I shipped the hero factory to main WITH A PYTHON SYNTAX ERROR and all ~130
    gates went green, because nothing in the suite ever EXECUTES that tool. On its
    first run it found a SECOND broken tool that was not mine —
    tools/bohemia_skin_above_hand_and_throat_patch.py, unterminated string, could
    not execute at all. Syntax fixed, content untouched. Now 186 tools, 164 gates.
  - SQUINT (gates/squint_gate.py) — EVERY DISTRICT IS ITS OWN LANDMARK (Paolo 7/28)
    had no gate. 16x16 silhouettes, TOP HALF ONLY (the full icon is mostly the
    shared ground plate; the top half separates 38% better). 13 twin pairs declared
    as debt, worst is storage/warehouse at 0.8% different.
  - HUE (gates/hue_gate.py) — locks the Pocket City colour measurement so nothing
    slides back to mud. Set median 3 families / 37.2% chromatic; best is the school
    at 9. Deliberately does NOT chase the reference's 88%: a dead Vegas should not
    look like a living sunny city.

=== THE COLLISION, RECORDED HONESTLY ===
I hit the dead alpha independently while rebasing: 21 gates red across four lanes,
traced it to `Unexpected token '<'`, restored the three blocks byte-exact from the
parent, re-landed the rig-tool pixelated fix, wrote a gate (alpha_parses_gate.js,
9 of 11 claims fire on the broken tree) and a post-mortem. Then I fetched and found
ccb0d68 + bc68090 already on main doing the same job, with a BETTER root cause than
mine: I had inferred an ad-hoc line-position stamp edit; SOUNDS proved it was a
rebase conflict resolution across 161 commits. I dropped ALL of it — restore, gate,
post-mortem. Two gates for one law is noise, and a wrong root cause in records/ is
worse than no record. Nothing of mine on that incident is in the repo.

ONE THING STILL WORTH SOMEBODY'S TIME (not urgent, flagged not claimed): the
alpha-loads gate floors RIG_B64/COMBAT_B64 on LENGTH. A blob that is long but
corrupt still passes. Decoding them and asserting they are whole HTML documents is
a two-line upgrade whenever that lane next touches it.

=== THE WALL CLASS RED, AND WHY IT IS ALREADY SOLVED ===
My post-rebase suite came back "1 GATE(S) FAILED: WALL CLASS". It passed 19/0
standalone and 3-for-3 under deliberate parallel load — a contention flake, from
fixed waitForTimeout waits. That is the same finding 5826514 shipped the pid lock
for. The lock is the right fix and it is in. Do not chase WALL CLASS.

=== WHERE THE WORLD LANE ACTUALLY IS ===
BLOCKED ON PAOLO, and deliberately not producing around it (STOP PRODUCING law):
  1. THE HIGH SCHOOL THUMB. He judged it "79% there", gave 8 specific notes across
     plot and icon, all 8 are applied and judgeable at
     slices/BOHEMIA_SCHOOL_JUDGE_7_28_26.html. His thumb on the REBUILT one is what
     unlocks rolling the treatment to the other 35 districts. DO NOT roll it early —
     that is exactly the four-versions failure the STOP PRODUCING law is about.
  2. WHICH TILE FORMS THE ART LANE COOKS FIRST. 15 forms filed in records/tileforms/
     (TF-WORLD-001..015) from an actual walk of 687 legend entries. My proposed
     order: roofs -> signs -> kerbs. ART has already cooked TF-ART-001 (CMU block).
  3. HOW LONG SINCE THE COLLAPSE. Still unanswered, still sets the damage level for
     all 45 districts. Nothing about weathering can be authored until he rules it.
NOT BLOCKED, available if this lane gets a "go" with no verdicts in: pull the 13
SQUINT twin pairs apart, starting with storage/warehouse.

STANDING FOR THIS LANE: ACT ONE ONLY (Paolo 7/28). Every district cell is its own
landmark. Do not cook art here — the ART lane cooks from forms only. Resolver
tables stay empty until he rules numbers. Never auto-generate strip/resort/casino/
luxor/sphere/strat/highroller/sign: Paolo's hand by law.

CHARACTER (0lurbs): 7/30 LATEST — I CAUSED THE DEAD ALPHA BELOW, AND I BUILT THE
GATE THAT MAKES IT UNREPEATABLE. The one red the SOUNDS lane left me is now GREEN.
Read their section next; it is accurate and I am not softening any of it.

=== WHAT I OWED THEM, PAID ===
SOUNDS was right on every point. Their handoff says CANVAS SCALE was red on main
for one check -- "the RIG preview composites NEAREST-NEIGHBOUR" -- because my
commit deleted RIG_B64 instead of replacing it with the patched one, and that the
restore neither caused nor worsened it. Correct, and they were right not to touch
my tab's blob. RIG_B64 is now regenerated with image-rendering:pixelated inside
its <style>. CANVAS SCALE: 29 passed, 0 failed. 165 of 165.

All 13 character surfaces now land on exact whole-number scales:
    charCv x3 · portraitCv x2 · cloBig x3 · cloCv x1 · g8_0..7 x1 · rig cv x1
Fractional canvases 19 -> 4. The 4 left are combat/city and belong to those lanes.

=== THE GATE THAT COMES OUT OF THE EMERGENCY ===
SOUNDS wrote: "a page-error probe ... takes 10 seconds and would have caught this
before it ever reached him." That is now a gate, not a suggestion.

gates/alpha_loads_gate.js (wired into the suite, ~5s, ALPHA LOADS 20/0):
  - the alpha loads in a real browser with ZERO page errors, and BAKED / drawChar
    / MUS exist at runtime with all 8 facings present
  - RIG_B64, COMBAT_B64 and BAKED are present AND still full size -- a floor on
    each, because a TRUNCATED blob is a silent art loss that never throws
  - exactly ONE buildstamp div, and no loose HTML tag at the start of a line in
    any script body (that is the exact signature of what I shipped)
  - no conflict markers (keeps the 7/29 regression dead too)
Law: laws/BOHEMIA_ADDENDUM_THE_ALPHA_MUST_LOAD_7_30_26.md

WHY IT IS DELIBERATELY CHEAP: the full suite is ~590s, and that is precisely why
it got skipped under time pressure. A guard you skip is not a guard. Run this one
before every push; it is affordable enough that there is never a reason not to.

THE PROCESS FAILURE, NAMED SO IT IS NOT REPEATED: my full suite HAD run green --
BEFORE the rebase. Main moved 161 commits and I did not re-run, because the
earlier green still felt like it counted. It did not. A green from before a
rebase describes a tree that no longer exists. The 7/29 conflict-marker pre-push
guard passed truthfully here; this merge left no markers, it deleted a megabyte
instead. A guard that checks one signature of a bad merge says nothing about the
others.

I FOLLOWED THEIR RULE THIS TIME. Their "NEVER RESOLVE AN ALPHA CONFLICT BY HAND"
is now how this lane ships: `git checkout --ours slices/BOHEMIA_ALPHA_0_9.html`
(take main's alpha whole), re-run the idempotent patch tool, re-set the stamp,
run ALPHA LOADS, push. This ship did exactly that and lost nobody's bytes.
NOTE FOR WHOEVER IS NEXT: the RUN lane landed the restore (ccb0d68) while my
suite was running, so the BAKED on main is THEIRS, not my splice. Mine was
byte-identical from 7bf83a1~1 but it is theirs that shipped. Credit where due.

=== CHARACTER LANE STATE ===
SHIPPED AND GREEN (this session): the 1px black outline on all 8 facings; the
neck as its own skin TONE (not a shadow) + throat rows, E/W one row shorter per
his ruling; his curtain-bob hair applied verbatim; his chin/neck rig edit applied;
A LONG SLEEVE STOPS AT THE HAND (0 arm cells render bare skin on E/W/S);
CLOTHES FOLLOW THE BODY; shoulder share + rigid arm; the SHOULDERS / ARM LENGTH /
HIPS dials with legs tied to the arms dial; whole-pixel canvas scaling.

[PENDING, PAOLO'S CALL] -- do not decide these:
  1. Border tone: pure black / dark brown 38,30,26 / softer brown 58,46,40 / none
     (anchors: records/outline/BORDER_TONE_CHOICES_7_27_26.png)
  2. Far-hand depth on E/W: far reads 153.2 vs near 153.8, so there is no depth
     cue at all. Either a separate shading layer (SHADOWS ARE SEPARATE, 7/26) or
     do not draw the far hand in profile. Not my call.
  3. Unbuilt slider proposals he has not ruled on: LEG LENGTH vs TORSO,
     FRAME/BULK, POSTURE, NECK LENGTH.

ANSWERED HONESTLY, NOT QUIETLY DROPPED: he asked for a 0.5px border. It is
impossible -- the pixel grid plus the RENDER PIXEL gate forbid half-pixel draws.
The `outerOnly` alternative was measured byte-identical (12,170 pixels either
way, 0% less black), so the dead code was removed instead of shipped as a fake
improvement.

RULINGS RECORDED THIS SESSION: FAT IS FAT -- no sex-aware fat distribution, and
the gate blocks `bust` / `fatDistribution` / `gynoid` as identifiers. A woman
reads through "slightly skinnier arms, shorter" plus narrow shoulders. NO female
rig, ever.

TILE FORMS FILED (art lane cooks from these, I cooked nothing):
  TF-CHAR-001 contact shadow (row 7, HIGH) · TF-CHAR-002 stage ground (row 8,
  HIGH) · TF-CHAR-003 footfall dust (row 12, MED) · TF-CHAR-004 portrait
  backdrop (row 13, LOW)

--------------------------------------------------------------------------------

SOUNDS (xk7pjp): 7/30 LATEST — TWO THINGS. (1) I RESTORED THE RIG, THE COMBAT TAB
AND PAOLO'S PAINTED BODY: main was shipping a DEAD alpha for ~12 minutes. (2) THE
RUN IS ON THE SONG'S CLOCK (SOUNDS item 1 done). The 60 remade sounds are still
unjudged and that is still the only thing blocking this lane.

=== THE EMERGENCY, FIRST, BECAUSE IT WILL HAPPEN AGAIN ===
Commit 7bf83a1 (CHARACTER lane, "EVERY CHARACTER SURFACE LANDS ON WHOLE PIXELS")
landed on main having DELETED three lines of the alpha and left a stray
build-stamp <div> where they were -- inside a <script>:
    const RIG_B64=...      127,857 bytes   THE ENTIRE RIG TAB
    const COMBAT_B64=...  1,109,816 bytes  THE ENTIRE COMBAT TAB
    const BAKED={...}        30,339 bytes  PAOLO'S HAND-PAINTED RIG DATA
An HTML div inside a script is a syntax error, so the whole block failed to parse:
"Unexpected token '<'" on load, no BAKED, no MUS, EVERY TAB DEAD. And it deployed
-- the Pages run for that main concluded SUCCESS at 16:45, so the live link was
broken for him until the restore at 16:58.
RESTORED verbatim from 7bf83a1~1, asserting none of it was already present so
nothing of theirs could be clobbered. Their canvas-sizing work is untouched.
VERIFIED AFTER: zero page errors, RIG IS LAW 12/12, COMBAT 513/513, THE RUN
126/126, SFX 135/135, SFX RENDER 843/843, RUN BEAT 22/22.

THE RULE THAT COMES OUT OF IT, and this lane made the same class of mistake TWICE
today before catching it: **NEVER RESOLVE AN ALPHA CONFLICT BY HAND.** The alpha
is 33 MB of single-line data blobs; a conflict in it cannot be read by eye, and a
regex-spliced resolution silently ate content both times. The safe move, every
time:
    git checkout origin/main -- slices/BOHEMIA_ALPHA_0_9.html
    <re-run your patch tool(s)>          # they are idempotent, that is the point
    <re-set the build stamp>
That reproduces your change deterministically on top of whatever main has, and it
cannot lose anybody else's bytes. A page-error probe (open the alpha in a real
browser, listen for `pageerror`) takes 10 seconds and would have caught this
before it ever reached him.

FOR THE CHARACTER LANE, THE PART I DID **NOT** FIX: CANVAS SCALE is red on main,
one check -- "the RIG preview composites NEAREST-NEIGHBOUR". That check is YOURS,
added in 7bf83a1, and the content it demands never landed: the commit deleted
RIG_B64 rather than replacing it with the fixed one. I restored the PRE-EXISTING
rig, which does not carry your image-rendering change, so your check still fails.
  I MEASURED WHETHER I CAUSED IT: ran your gate on your own broken main --
  28 passed, 1 failed. On the restored tree -- 28 passed, 1 failed. IDENTICAL.
  You shipped that gate red; the restore neither caused nor worsened it.
  I did not fix it because it is a CSS property inside your tab's base64 blob and
  that is your content, not a merge artifact. Regenerate RIG_B64 with the
  image-rendering fix and it goes green. 164 of 165 gates are green on main now.

=== SOUNDS ITEM 1: THE RUN IS ON THE SONG'S CLOCK ===
THE HOLE: the walk's beat was the literal `var BEAT=500` and nothing about tempo,
beat index or transport crossed the parent->run postMessage vocabulary, while
COMBAT got full song data and a HERO BEAT. The run and the music agreed only
because both numbers were typed the same. Two clocks that had not drifted yet.
  PARENT (tools/bohemia_run_beat_patch.py): the studio already schedules every
    16th on the AudioContext clock, so on each beat it posts BOHEMIA_RUN_BEAT with
    the beat index, BPM, ms-per-beat and how many ms from now that beat lands.
  RUN: an RB receiver phase-locks and exposes msPerBeat/beatNow/phase/
    msToNextBeat. The door animation and the slide read the live tempo. A SILENT
    RUN IS UNCHANGED: RB reports 500 ms and 120 BPM when nothing plays.
  GATE: gates/run_beat_gate.py (RUN BEAT), 22 checks driving the real alpha with
    the real studio playing. Proved able to fail by reintroducing the timebase
    bug: red on the lock AND the phase rate, restored.

THREE REAL BUGS THIS ROUND, none visible outside a real browser:
  1. performance.now() IS PER-CONTEXT. An iframe's time origin is when the iframe
     was created, so a parent timestamp runs ahead of the child's clock by however
     long the page had been up -- it measured the run 22 beats off. The message
     carries a DELTA now, true in anybody's clock.
  2. MY IDEMPOTENT REMOVAL CUT ONE LINE SHORT and left an orphaned `})();` in its
     own <script>. The block parsed fine in isolation; only opening the page
     caught it. Marker-bounded now: a wrapper you insert is a wrapper you delete
     whole.
  3. I PATCHED A GENERATED FILE. slices/BOHEMIA_RUN_CURRENT.html is built by
     tools/build_run_slice.js and says "never edit this file directly";
     gates/run_gate.js caught it via "regenerating changes nothing". The patch
     edits the dev source and runs the builder now.

=== STATE ===
BUILD STAMP: 7/29l - THE RUN RUNS ON THE SONG (RUN TAB).
  (Letters are contended -- three other lanes shipped 7/29g through 7/29k the same
   day, and one of them reused a letter. CHECK THE STAMP IN THE FILE before you
   pick, and never assume your letter is free.)

WHAT IS PENDING PAOLO:
  1. THE 60 REMADE SOUNDS — MUSIC tab. Still the only thing blocking this lane.
  2. (fleet) what colour rebuilt Vegas is, in his words (open since 7/27)
  3. (fleet) cars 2x3 vs the re-cook's shorter read (open since 7/28)

NEXT FOR THIS LANE:
  - IF VERDICTS ARE IN: approve -> bank the vector, cook its variant set (3-4
    alternations per footstep), and wire the approved events to real steps, which
    is now possible because the beat clock exists.
  - IF NOT: item 2 (ambient beds) still waits on RUN 0d's daycycle. There is no
    third sound batch. He rejected once and I remade once; STOP PRODUCING says a
    second rejection ends the feature for the session.

READ BEFORE YOU RUN THE GATES: a fresh container has no image stack, and this
session hit that TWICE (the container reset mid-session). Nine pixel-reading
gates need it: pip install -r gates/requirements.txt. bohemia_gates.py prints a
banner naming them before the first gate if either library is missing.

READ AFTER YOU PUSH: GitHub Pages can silently skip a push. If no
"pages build and deployment" run appears within a few minutes, push an EMPTY
commit to main -- that produces a correctly-labelled run in about two minutes.
This container cannot reach paolosarn.github.io (403 from the network policy), so
the Actions API is the only deploy check available.

--------------------------------------------------------------------------------
SOUNDS (xk7pjp): 7/29 (j) LATEST — THE RUN IS ON THE SONG'S CLOCK (backlog item 1
DONE), and the 60 remade sounds are still waiting on his thumbs.

ITEM 1 SHIPPED: THE RUN HAD NO BEAT. The walk's beat was the literal `var
BEAT=500` and nothing about tempo, beat index or transport ever crossed the
parent->run postMessage vocabulary, while COMBAT got full song data and a HERO
BEAT. The run and the music agreed only because both numbers were typed the
same. That is two clocks that have not drifted yet, not the 120 BPM LAW.
  PARENT (tools/bohemia_run_beat_patch.py): the studio already schedules every
    16th on the AudioContext clock, so on each beat boundary it posts
    BOHEMIA_RUN_BEAT with the beat index, BPM, ms-per-beat, and how many
    milliseconds from now that beat lands.
  RUN: a small RB receiver phase-locks and exposes msPerBeat/beatNow/phase/
    msToNextBeat. The door animation and the slide read the live tempo instead
    of a literal. SILENT RUN IS UNCHANGED: RB reports 500 ms and 120 BPM when
    nothing is playing, so a quiet run behaves exactly as before.
  GATE: gates/run_beat_gate.py, registered as RUN BEAT, 22 checks in a real
    browser with the real studio playing. Proved able to fail by reintroducing
    the timebase bug: went red on the lock AND on the phase rate, restored.

TWO REAL BUGS THIS ROUND, both caught only by driving a real browser:
  1. performance.now() IS PER-CONTEXT. An iframe's time origin is when the
     iframe was created, so a timestamp taken in the parent is ahead of the
     child's clock by however long the page had been up -- it measured the run
     22 beats away from the studio. The message carries a DELTA now ("this beat
     lands in N ms"), which is true in anybody's clock.
  2. MY OWN IDEMPOTENT REMOVAL CUT ONE LINE SHORT and left an orphaned `})();`
     inside its own <script> tag, throwing "Unexpected token '}'" on every page
     load. Invisible to a syntax check of the block (it parsed fine alone) and
     invisible to grep. The injection is marker-bounded now: a wrapper you
     insert is a wrapper you delete whole.

NEXT FOR THIS LANE: item 2 (ambient beds) still waits on RUN 0d's daycycle. The
real next move is HIS VERDICT on the 60 sounds -- approve unlocks the variant
sets and the wiring of actual footsteps to actual steps, which is now possible
because the clock exists. DO NOT cook a third batch.

--------------------------------------------------------------------------------
SOUNDS (xk7pjp): 7/29 (h) — THE SOUNDS ARE REMADE. HE SAID v1 SOUNDED

--------------------------------------------------------------------------------
ANOTHER LANE'S SECTION, CARRIED FORWARD UNTOUCHED.
--------------------------------------------------------------------------------

[CANVAS SCALE: FLAGGED RED BY THIS LANE, THEN FIXED BY ANOTHER LANE'S ALPHA RESTORE
 BEFORE THIS COMMIT LANDED. Re-measured on the rebased tree: 29 passed, 0 failed.
 Leaving the note because the METHOD is the reusable part and the next inherited red
 will want it: gates/canvas_scale_gate.js was failing one assertion (the rig preview
 compositing bilinear instead of nearest-neighbour). Rather than assume it was not
 mine, I checked out 7bf83a1 DETACHED and ran the gate there, where it failed HARDER
 (the audit could not reach the real surfaces at all, which was the dead alpha). That
 proved the red predated this lane's commit and belonged to the CHARACTER lane. A red
 you did not cause still has to be PROVED inherited, on the tree where it started, and
 flagged by owner. It never gets fixed by editing another lane's system to make your
 own suite green.]

*** ONE SUITE AT A TIME, AND NOW THE MACHINE ENFORCES IT (7/30, RUN lane) ***
  I ran two gate suites on one tree at the same time. They reported "ALL GATES GREEN"
  and "10 GATE(S) FAILED" within minutes of each other, on identical trees, and I
  shipped on the green one. Both verdicts were garbage: run_gate REGENERATES the run
  slice in place and current_slice_gate regenerates the slice, both drive real
  Chromium, so a second suite reads half-written files and starves the first of CPU.
  Every one of those 10 "failures" came back green when re-run alone (front door 3 for
  3). A GATE SUITE WHOSE ANSWER DEPENDS ON WHAT ELSE IS RUNNING IS NOT A GATE SUITE.
  gates/bohemia_gates.py now takes a pid lock and REFUSES to start while another suite
  is live; stale locks self-clear by checking the pid, so a killed run never wedges the
  repo. Proved all three ways (blocks a live owner, clears a dead one, releases on
  exit). If you see "REFUSING TO RUN", that is the fix working, not a bug.
  THE TELL FOR ANY SESSION: if you are about to launch a suite while one is in flight,
  you are about to generate a number you cannot trust. Wait for it.

RUN (eak241): 7/31 LATEST — HIS TWO STREET RULINGS ARE IN AND LOCKED.

  "New rule all drive ways [2] tiles wide not three and Im upset your sururbs
   dont have a 1 grid sidewalk next to the streets whata wrong with you bro"
  (with a screenshot: a yellow line traced down the road edge, a circle round a
  fat driveway)

DRIVEWAYS: DVW was 4 and measured 3 or 4 on the real surface depending on
clipping. Now exactly 2 wide x 3 long, verified as BLOBS across 5 seeds and 32
blocks -- no other shape exists.

THE SIDEWALK IS THE ONE TO READ, because it is a whole class of bug. The RUN's
renderer ALREADY drew a kerb band: groundTile() asked "is this ground next to a
road?" and laid the approved walk_kerb tile. Measured on the real surface, all
709 ground-touching-road cells came back walk_kerb. On the one screen anybody
looked at, it was done.
It was a costume. bohemia_suburb.js had codes 0,1,2,3,4,5,6,9 and none of them
was a sidewalk. So the CITY drew none (different renderer, same world), the
tilespec dossier had no row for the tiling phase, the world model reported no
walk surface, and NO GATE COULD EVER FAIL because there was nothing to check.
  A FEATURE THAT LIVES INSIDE ONE RENDERER'S IF-STATEMENT IS NOT IN THE GAME.
Code 10 now, laid by the generator in a final pass after homes and driveways, so
the walk breaks where an apron crosses it. The run's inference trick is DELETED
on purpose: as a fallback it would re-fake the walk the moment the generator
regressed, which is exactly how this hid.

TWO GATES CAUGHT ME MID-FIX, both correctly:
  1. I first used code 7. suburb_modular_gate went red on "no vegetation
     anywhere" -- 7 is the retired TREE code, 8 is POOL, and the dead-world law
     forbids both. A code that no longer appears in output is not a free code.
  2. Then population_gate went red on OFFLINE/ONLINE AGREEMENT: bohemia_agents.js
     has its own hardcoded passability whitelist (0,1,3,5) and nothing added 10,
     so the neighbours could not cross their own kerb. A SIDEWALK THE SIM TREATS
     AS A WALL is the most obvious way this feature can be wrong and my first
     gate did not check it. It does now.
  ANY NEW GROUND CODE must be re-declared in every hardcoded whitelist that
  decides what a body may stand on. Grep before you assume.

gates/suburb_street_gate.js (12 checks) checks the WORLD MODEL, never the
renderer, so it would have caught the original bug. Proven able to fail three
ways before being trusted. Law: laws/BOHEMIA_ADDENDUM_KERB_AND_DRIVEWAY_7_31_26.md
Measured after: 35 px of walk between asphalt and yard = exactly one tile.
Shipped 4fad0dd, stamp 7/31c.

NOTE FOR THE NEXT SESSION ON MAIN VELOCITY: this ship took four rebases because
main moved every few minutes while an 11-minute suite ran. The last one was
verified TARGETED (both lanes' gates on the merged tree, all green) rather than
by a fourth full pass, and the commit says so. If you hit the same treadmill,
say which you did -- do not imply a full pass you did not run.

RUN (eak241): 7/30 LATEST — EVERYTHING THIS LANE BUILT IS ON MAIN AND GREEN, AND THE
LANE IS PARKED ON ONE DECISION. Read this section before touching the run.

WHAT LANDED (all shipped, all gated):
  - THE BUILDING STACK, rebuilt. He said the garages looked like "sideways U's" and he
    was right. Doors now only ever sit on the SOUTH face (the only face a 3/4 top-down
    projection can draw), walls are 4 courses under a 3-course roof cap measured off the
    frozen target frame, garage bays are max 3 wide at the driveway end of a south run.
  - OCCLUSION. Standing under a canopy/deck fades it to 0.35. My FIRST cut faded whatever
    sat north of him, which ghosted him standing in his own front yard — he is IN FRONT
    of that wall. Restricted to the overhead layer plus the doorway leaf.
  - OFF MEANS SILENT (law, 7/27). MUS.stop() cut the scheduler but not the master gain,
    so booked notes kept playing after the button said off.
  - THE D-PAD IS NOT TEXT. iOS raised copy/paste on every direction press. The run is the
    ONE tab loaded by iframe src (the other three are base64 blobs), so the 7/27 guard and
    its gate both skipped it. Guard is in the DEV SOURCE — the generated file gets erased.
  - FRONT PATHS instead of concrete confetti: a real BFS path from the door to the street.
  - ONE VEGAS. The run and the city were literally two different valleys (hashSeed
    ('bohemia')=2691674296 vs a hardcoded 2026). Same seed now, plus a run->city position
    bridge and a CHOSEN home cell [39,23] instead of the map rim.
  - THE BANKS-USED GATE (from his "are you drifting off?" — laws/BOHEMIA_ADDENDUM_
    NEVER_DRIFT_7_28_26.md). Approved-but-unused art is a DEFECT, waivers must be named,
    ticketed, and asserted honest in both directions.
  - PAPERWORK, no pixels cooked: 9 tile forms, the UI catalogue, 45 currency icon options
    and his three combined picks (laws/BOHEMIA_ADDENDUM_COMBINED_CURRENCY_ICONS_7_28_26).

*** [DONE 7/31, HIS RULING] THE DISTRICTS ARE FULL SIZE. Paolo 7/30: "The districts
should have always been full size bro." TILE_FINE/SLOT_FINE 32 -> 128. A cell is now
128x128 = 16,384 walkable cells = 96m a side; the valley reads 5.73 mi across instead
of 1.43. Every district generator, walkable-land, landlocked and the kit took it with
ZERO changes -- they were already parameterised, the constant was just wrong.
  bohemia_world.js no longer keeps its own `var T = 128`; it reads OM.TILE_FINE, so
  there is ONE number. gates/valley_scale_gate.js (14 checks) reads the size OUT OF
  THE LAW FILE rather than a value typed into the gate, and fails if any engine module
  outside the overmap assigns a scale constant a literal.
  THE CITY TAB NEEDED MORE THAN THE CONSTANT and this is the transferable part: a
  canon block is 128x128, so when a cell was 32 the renderer glued a 4x4 GROUP of
  cells into one block and each cell drew its own 32x32 window (`tx>>2`, `(tx&3)*FN`).
  At 128 that asks for a 512-wide block and windows to offset 384 in a 128-row array:
  undefined, every suburb and kit district. Byte-marrying the blob to canon WITHOUT
  fixing that would have turned the gate GREEN ON A BROKEN CITY, which is worse than
  the red. Fix is not "4 -> 1" but `const GRP = Math.max(1, Math.round(128/FN))`:
  4 at the old scale (arithmetically identical to what shipped), 1 now, right at any
  future scale. tools/bohemia_city_scale_patch.py, exact strings never a regex sweep
  of `>>2`/`&3` (ordinary bit math elsewhere), refuses to write if any expected text
  is missing, idempotent. Six slices carrying an embedded overmap rebuilt.
  Shipped dbd6c90, full suite ALL GREEN 661s, stamp 7/31a. Below is the finding that
  led here, kept because the ROOT CAUSE (two sources of truth for one number) is the
  lesson, not the number. ***

THE FINDING THAT UNBLOCKED IT — records/BOHEMIA_DISTRICT_SCALE_FINDING_7_28_26.md.
He asked why the districts feel small. They WERE small, by 16x, and his own law said so.
  RUN   engine/bohemia_world.js   `var T = 128`     128x128 = 96m x 96m   valley 5.73 mi
  CITY  engine/bohemia_overmap.js `TILE_FINE=32`     32x32  = 24m x 24m   valley 1.43 mi
laws/BOHEMIA_ADDENDUM_VALLEY_SCALE_LAW_7_6_26.md is LOCKED, is titled "revokes the 24m
SLOT SCALE LAW of 7/5", says 128, and its own checklist marks the relock DONE. The file
still reads 32 and its header still cites the revoked law by name.
ROOT CAUSE, and it is the transferable part: TWO SOURCES OF TRUTH FOR ONE NUMBER. The run
hardcodes 128 and never reads the overmap, so it has been right by coincidence rather than
by obeying the law, and nothing in the repo compared them. Same shape as the ONE MAP seed
bug fixed the same week in the same module.
I DID NOT FLIP IT UNASKED. FN appears 4,812 times in the city renderer, 48 generators fill the
cell, and WALKABLE-LAND would fire loudly the moment a lot becomes a neighbourhood. That
was a fleet-wide change on his word, not mine. [ANSWERED 7/30: yes. DONE, see above.]
HE SAID YES, AND THIS IS WHAT IT TOOK: set TILE_FINE = SLOT_FINE = 128, delete the stale 7/5 header comment,
re-run every district gate, and ADD THE MISSING GATE that asserts the run's TILE_PER_CELL
and the overmap's TILE_FINE are the same number. Without that gate this silently rots again.

ALSO PENDING PAOLO (nothing here blocks the fleet): district floors (de-border the desert
tiles / shop another bank / dress by structure); walk feel GRID/SLIDE/HYBRID/FREE has been
live and unjudged since 7/26; what eating costs in time; the moment table + per-unit rates
(backlog A2, and it blocks everything downstream of the resolver); reach in tiles.

WHAT I'D DO NEXT WITHOUT A WORD FROM HIM: backlog RUN item 1, the PHONE-FEEL PASS — real
device-shaped viewports, hold-to-walk tuning, tap target sizes. It needs no verdict and no
art. DISTRICT ART is the biggest visible gap in the ledger but it sits behind both pending
items above, so starting it now would be building on a number that may change by 4x.

DO NOT: edit slices/BOHEMIA_RUN_CURRENT.html. It is GENERATED. The dev source is
slices/BOHEMIA_RUN_SLICE_7_26_26.html and the builder overwrites everything else.
DO NOT: run the full suite while files are still being edited — the run gate asserts
"rebuilding changes nothing" and you will invalidate your own pass. I did this to myself.

CITY (03): 7/29 LATEST — THE WALK SURFACE HAS PEOPLE IN IT NOW. This was the lane's #1
item (ER, the engine reality audit) and it is also his 7/29 ruling made real, so it was
the one obvious thing to do on "go".

THE FINDING, measured before touching anything: human mode had the best render
architecture in the repo — chunk LRU, canvas pool sized against the measured iOS floor,
genuinely seamless streaming — and ZERO people. Not few. Zero. No BohemiaAgents, no body
drawing of any kind; the only movers were cars and planes.

MEASURED ON THE REAL SURFACE, real browser, real tab, real splash dismissed:
  standing in a CLUSTER        9 people on screen
  standing in a NO MAN'S LAND  0 people on screen

engine/bohemia_population.js is his zone map as a SHARED module, deliberately not a patch
inside one renderer. The RUN and the CITY tab share almost no drawing code and this lane
has already been burned once by fixing the surface he does not play. If each invented its
own idea of who lives where, the same neighbourhood would be a ghost town in one and a
settlement in the other.

IT FEEDS THE EXISTING SIM RATHER THAN FORKING IT, and this is the part worth copying.
bohemia_agents.js (WORLD's module) ALREADY holds a two-plane census and ALREADY takes a
per-call `occupiedRate` — whose own source comment calls the flat 0.30 "a PLACEHOLDER...
[PENDING Paolo]". His 7/29 ruling answered that pending item. So the new module supplies
that rate per neighbourhood (cluster 0.115, spread/loner 0.005, empty 0.000) and adds no
second census. No edit to another lane's file, ENGINE SYNC intact. BEFORE BUILDING A
PARALLEL ANYTHING, CHECK WHETHER THE EXISTING MODULE ALREADY TAKES THE OPTION YOU NEED.

THREE THINGS FOUND BY LOOKING AT THE SCREEN, not by reading code:
  1. A cluster scattered evenly over its 128x128 subdivision put exactly ONE person in
     view — indistinguishable from a loner. A phone shows ~17 cells across at walk zoom,
     so the radius is 8 now and 3-5 neighbours are visible at once. You still never see
     all 13 and you should not: you hear a settlement before you see it.
  2. My first standable test was homegrown (`!solid && !face`) and put residents ON
     ROOFTOPS. Fixed to the frame's OWN `walk` flag, the exact predicate move() uses. IF
     A PERSON CAN STAND WHERE THE PLAYER CANNOT WALK, THE TEST IS WRONG, NOT THE WORLD.
  3. Placement is CACHED per neighbourhood and the player MOVES, so a standable test that
     consulted hx/hy would bake a stale answer into the cache. Occupancy is enforced at
     DRAW time instead, and the gate proves it by stepping him onto a resident and
     watching the count drop by exactly one.

TWO NEW GATES, and note the name check: gates/population_gate.js ALREADY EXISTED (LIFE
session, 7/19, two-plane sim). Mine are gates/zone_map_gate.js (56 assertions, node) and
gates/city_people_gate.js (14, real browser). Both proved able to FAIL before being
trusted — sabotaging the module produced 1,232 desert ghosts and killed the no man's land.

ZERO PIXELS COOKED. Every body is the character he already built, tinted: the canon
"enemies are tints of me" mechanism (7/3), the same one the RUN's townsfolk already use.

NOBODY MOVES YET, ON PURPOSE. Schedules live in bohemia_agents.js and duplicating them
here would fork the simulation. This draws PRESENCE, which is exactly what "how busy the
city feels" asks for.

WHAT COMES AFTER, in order: (1) wire the real schedules through the same module so the
clusters wake up, work and come home — the agent module already has them, it just needs
the zone map's rate; (2) the RUN consumes the SAME module so both surfaces describe one
city (it is already importable, nothing to design); (3) the eight tile forms from 7/28
are still waiting on the ART lane and nothing here blocks them.

BLOCKED ON PAOLO: nothing new.

DO NOT: add movement inside the city frame. That forks WORLD's sim. Do not raise the
population because "it feels empty" — a quarter of the map is empty ON HIS ORDER and the
gate will catch you.

SOUNDS (xk7pjp): 7/29 (h) LATEST — THE SOUNDS ARE REMADE. HE SAID v1 SOUNDEDLIKE 2006 SOFTWARE AND HE WAS RIGHT TO THE YEAR. MUSIC TAB, TOP OF THE PANEL.

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

[RESOLVED 7/30 — tileform_gate is GREEN on main, 8167 passed / 0 failed. The gate was
taught that acts beyond 1 are legal when the form says why (e0dc1a5), and the three
RUN icon forms declared acts [1,2,3] against the act-one law (8bb1588). Leaving the
original flag below because the SECOND paragraph of it is the reusable lesson: a lane
that is not the owning lane should not edit another lane's forms to make its own suite
green — it should prove the red is inherited and say so, which is exactly what happened.]

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

*** THE DEAD ALPHA: I FOUND IT INDEPENDENTLY, ANOTHER LANE FIXED IT FIRST, AND
*** WHAT SURVIVES FROM MY SIDE IS THE GATE. ***
Hit it while rebasing: commit 7bf83a1 had replaced THREE LINES of the alpha --
RIG_B64, COMBAT_B64 and BAKED -- with A DUPLICATE COPY OF THE BUILDSTAMP DIV.
1.27 MB gone, shipped to main, and every line that USES those blobs still sitting
there, so the live build had a combat tab and a rig tab pointing at nothing.
The fingerprint was the second stamp div sitting exactly where the blobs had
been, which is what a stamp edit matching the wrong span leaves behind.
I repaired it locally (verbatim restore from 1399312, stray div deleted, line
counts matched to the last good alpha) and by the time I pushed, ANOTHER LANE HAD
ALREADY REPAIRED MAIN PROPERLY and shipped 7/30a with a newer RIG_B64 carrying
their real pixel-snapping work. THEIRS IS BETTER AND THEIRS WON: my repair
commits are superseded and my one-line rig CSS patch is DELETED, exactly as its
own docstring said it should be if that lane shipped their own fix.
*** WHAT DOES SURVIVE, AND IS THE POINT: THE GATE DID NOT REPORT THIS, IT
CRASHED ON IT. *** The COMBAT_B64 match was null and m[1] threw a stack trace,
which reads like a broken GATE rather than a broken BUILD. combat_lab_gate
section 0 now:
  - every blob (CITY/COMBAT/PREFAB/RIG) declared EXACTLY ONCE, plus BAKED
  - EXACTLY ONE buildstamp div, because a second one is this bug's fingerprint
  - a plain STOP message and exit(1) instead of a stack trace when the demo is gone
PROVEN against main's real broken alpha before it was fixed: it fails cleanly and
names the loss. That complements the other lane's new ALPHA-MUST-LOAD gate rather
than duplicating it -- theirs proves the page boots, mine names WHICH blob went
and refuses to pretend the rest of the run means anything without it.

COMBAT (04) 7/29 (c) - THE NEEDLE IS HIS BODY. (Paolo: "whats up. whats next.")
Built the thing I deferred last turn rather than asking a second time.

*** v102 THE DIAL IS A PICTURE OF THE TRUTH ***
Paolo: "i want their cover animation to be tied to where there deadshot dial
lands perfectly in the center. so that killshot they better be out of cover. and
when its in miss territory they are under cover."
The dial was an abstraction sitting ON TOP of the fight: the needle swept, you
pressed, a number decided, and the man was on his own timer. Now the needle IS
how exposed he is, so you stop reading a gauge and start reading a man.
*** HE IS OUT EXACTLY WHEN THE RETICLE GOES GREEN *** -- not an approximation
picked to feel right, the SAME expression that has driven the green reticle since
the dial shipped. Measured live: |angle| 0 and 0.055 (inside the 0.061 kill zone)
-> exposure 1.0; 0.175 (halfway to the 0.289 hit edge) -> 0.5; 0.433 (past it)
-> 0.0.
NOTHING WAS ANIMATED: rise112 is already baked (the body coming UP OUT OF THE
CROUCH, already used when a man gets off the deck). The needle INDEXES its 4
frames. Touches no rig, no clip, no BAKED pose, no bank -- clear of the animation
revamp in another session.
ONLY THE MAN UNDER THE DIAL ("i still like how they animate already"): verified
a second covered man's frame is identical at both ends of the sweep and his
_expo is never even set.
IT IS A READ, NOT A RULE CHANGE: verified e.gcov is unchanged across the whole
sweep, so cover/damage/exposure/AI resolve exactly as before.
THE BODY LAGS THE NEEDLE ON PURPOSE (EXPO_FOLLOW): the sweep is fast and
reverses, so mirroring it frame-for-frame would make him vibrate. A man reacting
to your aim is half a beat behind it.
TOOL: tools/bohemia_combat_dial_cover_patch.py | GATE section 36

*** I BROKE THE ENTIRE DEMO AND THE GATE DID NOT NOTICE. READ THIS. ***
The first version of v102 anchored on this line:
    if(!isChain){G._chainN=1;G._poppedOut=false;}
and inserted AFTER it. That line is the FIRST HALF OF AN IF/ELSE. The insert
orphaned the else and the whole combat demo stopped parsing -- G undefined,
nothing ran, black tab.
*** AND ALL 500+ STRING CHECKS STILL PASSED, because a string check cannot tell
the difference between valid code and rubble. *** The anchor was UNIQUE and the
anchor was WRONG, which is the exact lesson this lane already had written down
and did not apply.
SO THE GATE NOW PARSES THE DEMO. combat_lab_gate.js runs node --check over every
<script> body in COMBAT_B64. Cheapest possible catch for the most expensive class
of mistake this lane makes, and it should have existed 100 patches ago.
COMBAT GATE: 513 -> 524 (section 36 + the parse checks).

*** AND I CORRECTED MY OWN CHECK THE SAME TURN ***
I wrote a check claiming "ONE EXPRESSION, NOT TWO" and it failed, and IT WAS
RIGHT TO. There have always been TWO different multipliers here:
   fgv = what the BANDS DRAW      (difficulty, steady aim, kill streak)
   fg  = what the SHOT RESOLVES ON (all that PLUS the on-the-one bonus + groove)
That is a DESIGNED difference, not drift, and it stays. What v102 actually fixed
is that the BAND expression was an inline const the pose would have had to copy;
it is dialFgv() now, defined once, shared. Check and tool docstring both
corrected to the true claim.
ALSO RE-POINTED: the NORTH STAR AUDIT PIN ("no positional term multiplies the
player's damage or hit window") read the old inline const. It follows the
expression into dialFgv(). Invariant unchanged; it is the most important pin in
this file and it must never be allowed to quietly stop looking at anything.

STAMP NOTE: set 7/29i first, which is BEFORE another lane's 7/29k -- the letters
are a sequence and I went backwards. Then 7/29L, which the run gate rejects
(the law's shape is lowercase). Landed on 7/29m, skipping l on purpose because a
lowercase l reads as a 1 on a phone.

STILL NOT BUILT, and it is the only thing left from his last message:
*** CARS, 2 TILES BY 3 (his ruling). *** Design is written:
records/BOHEMIA_COMBAT_NEXT_TWO_DIAL_COVER_AND_CARS_7_29_26.md
First MULTI-TILE cover in the game, which is a different object: blocks a LENGTH
not a point, and the engine end hides you to the chest while the boot end hides
you to the waist -- one object, two cover values, which no block can do. The work
is that pillars are CIRCLES and a car is a RECTANGLE (about five cover/collision
functions need rectangle maths). DO THE SHOPPING CHECK FIRST: car_wreck x20 is in
STREET_PROP_POOLS but that bank is "corpus art, no new canon" and is NOT in the
approved index -- render the 20 at 2x3 and LOOK before deciding it is an art ask
at all. His 2x3 ruling must also be amended into TF-CMB-003.

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

--------------------------------------------------------------------------------
7/29 (g) — TF-ART-001 COOKED: THE CMU BLOCK FAMILY (4 tiles). NOT IN A TAB YET.

He asked "whats up. whats next." Answer: houses are BLOCKED on his shape tap, so the
lane popped its top unblocked item — the first of the eighteen filed tile requests.

WHAT IT FIXES, from the form: every non-residential building in the valley wears the
same pale suburban stucco as the houses, so a jail, a warehouse and a family home are
the same material. Twenty-odd industrial/civic/service districts are CMU in real
Clark County and all render in house stucco today.

4 tiles: cmu_wall (plain running-bond), cmu_cap (bond beam + cast cap), cmu_pilaster,
cmu_vent (the pierced screen block that is everywhere in 60s-80s Vegas).
tools/bohemia_cmu_cook.py -> banks/BOHEMIA_CMU_BLOCK_7_29_26.txt

THE BOND IS DESIGNED FIRST, WHICH IS THE HOUSE 01 LESSON APPLIED. A real CMU is
8x16 in with a 3/8 joint = 12 px course, 24 px block, and NEITHER divides 44. So:
course 11 px (7.4 in, 4 per cell exact), block 22 px (14.8 in, 2 per cell exact).
Both within 8% of the real unit, both dividing the cell, so the wall runs any length
and height with no seam. Exact-real would have bought 0.6 in and a visible break
every four courses.

THREE THINGS I GOT WRONG AND FIXED BY LOOKING:
 1. first cook came out TAN-BROWN. The approved concrete family is warm — it belongs
    to a residential street — and a warm jail is the exact bug the form was filed
    against. Now each sampled colour keeps its VALUE and gives up its warmth, with a
    faint cool cast. Documented transform of approved colour, not a new palette.
 2. that cooling drove the darkest step to luminance 3 — PURE BLACK, act-1 law break,
    measured not guessed (the vent holes came out #010308). Floor clamped at 20 on
    the RESULT so no amount of cooling can go under.
 3. efflorescence streaks STAMPED. Laid up 6x3 the same pale streak landed in the
    same column of every cell. Thinning them just made them cluster. The truth: ONE
    tile repeated will always stamp whatever is in it, and a full-height streak is
    the most stampable mark there is. Streaks are OUT of the base tile; they belong
    on a variant, the way the corpus already carries road_0/1/2.

AND MY OWN SEAM TEST WAS WRONG BEFORE THE ART WAS. Comparing column 0 to column 43
assumes a wall repeats identically edge to edge, which running bond must not — the
lit top arris is SUPPOSED to sit above the next mortar line. A test demanding that
would fail correct art and pass graph paper. The gate now lays the tile 2x2 and
checks the pattern continues, and separately asserts the bond is RUNNING not STACK.

NEW GATE: gates/cmu_gate.py, registered as CMU BLOCK. 12 checks. Also REGISTERED THE
BANK with gates/target_match_gate.py's BANKS list, per the art-first reset's price —
a bank graded only by its own gate is grading its own homework. 279 constitution
checks pass on it.

BUILD STAMP unchanged (nothing he can see moved; the tiles are NOT IN A TAB YET).
ALL GATES GREEN (623s).

STILL BLOCKED ON HIM: the house shape picks (LIFE tab, top card). No house until then.
17 tile forms left in the queue after this one.

--------------------------------------------------------------------------------
7/29 (h) — HOUSES STOPPED. AND THE 30 APPROVED HOUSE SKINS I NEVER USED.

PAOLO, VERBATIM: "Im not gonna lie all of these looked just horrible tbh"

ALL SEVEN SHAPES KILLED. Graveyard 2026-07-29. Verdict:
records/BOHEMIA_HOUSE_SHAPES_VERDICT_7_29_26.txt.

**THIS WAS THE SECOND HOUSE REJECTION OF THE DAY, SO HOUSES ARE FINISHED FOR THIS
SESSION.** laws/BOHEMIA_ADDENDUM_STOP_PRODUCING_7_26_26.md. No third attempt, no
revised study, no rebuilding it "properly" — finding a legal way to ship anyway IS
the violation the law names. The next house work starts from a ruling of his.

THE FINDING, AND IT IS THE ONE THING BLOCKING EVERYTHING:

  banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt
  status CANON — Paolo verdict 7/21/26, ALL 30 UP

THIRTY PIECES OF HOUSE ART HE APPROVED EIGHT DAYS AGO: 6 shingle roofs, 2 gravel,
6 barrel-tile (terracotta / desert brown / gray brown), 4 plain stucco walls, 3 with
windows, 3 boarded, 3 with doors, 3 yards. They are GOOD — real shingle courses,
barrel pans, settlement cracks, plank shadows on the boards, stiles and rails on the
doors. Everything my two attempts lacked.

**I DREW HOUSES FROM SCRATCH TWICE WHILE THESE SAT IN THE BANK.** REUSE-FIRST broken
outright (Paolo 7/22: "check out the approved assets first before cooking").

AND THE SUBTLE PART EVERY FUTURE SESSION SHOULD READ: house 01 DID carry a reuse
check. It opened the approved street bank and sampled COLOURS from it. Sampling a
colour off approved art is NOT using approved art, and I let the cheap reading
satisfy a law that meant the expensive one. A REUSE CHECK THAT OPENS A BANK FOR ITS
PALETTE AND THEN DRAWS EVERY PIXEL ITSELF IS A REUSE CHECK IN NAME ONLY. The
reusefirst gate cannot currently tell those two apart.

STANDING QUESTION FOR PAOLO, his alone: should the sixteen houses be BUILT OUT OF HIS
THIRTY APPROVED SKINS rather than drawn new? Nothing house-shaped moves until he says.

WHAT SURVIVED: gates/house_shape_gate.py — its numbers (>=2 masses, >=4:12 pitch,
>=12 in eave, nothing over 3.5:1) came from research, not from the rejected drawings,
and would still refuse a trailer. tools/bohemia_house_massing.py survives ONLY as
that gate's spec table and is marked dead-as-art at the top of the file; its rendered
sheet and judge page are deleted.

STILL LIVE AND UNBLOCKED: 17 more filed tile forms after TF-ART-001 (the CMU block
family, shipped 7/29g and NOT IN A TAB YET).

--------------------------------------------------------------------------------
COORDINATOR (07), 7/29 — THE BIG MISSING (Paolo: "11 months of forward motion,
what are we BIG missing"). records/BOHEMIA_THE_BIG_MISSING_7_29_26.md is the
answer of record: (1) the GAME DAY loop has never run end to end (RUN's next
milestone — integration, not features), (2) the CITY-BUILDER half is lore not
gameplay [HIS DESIGN — the biggest undesigned system, yap-session agenda],
(3) the economy doesn't run (WORLD: ledger/payout mechanism ships empty),
(4) no faction system (WORLD: standing/territory skeleton ships empty),
(5) companions ruled/zero built (sequenced behind combat extraction),
(6) NPCs are bodies not people + no dialogue system, (7) the iOS save-eviction
landmine + unruled ship vehicle (RUN: cloud blob; ruling ~month 8),
(8) vehicle ladder locked/unbuilt. Plus an 11-month straw milestone map,
dates pending his blessing. Lanes: read it before inventing your next big
item — if your lane owns a listed organ, IT outranks lane-local wants.
--------------------------------------------------------------------------------
7/30 (c) — HOUSE 02: DRAWN THE WAY ISOMETRIC GAMES ACTUALLY DRAW HOUSES. LIFE TAB.

Paolo overrode the stop: "BRO WE NEED TO GET 1 house shape done bro do big brain
online research and execute WHEN IN DOUBT HOW TO OTHER ISOMETRIC PIXEL GAMES MAKES
HOUSES COPY THEM TO START OFF HOLY SHIT". His call, so houses resumed.

THE RESEARCH FOUND THE ACTUAL MISTAKE, AND IT WAS BIGGER THAN SHAPE. Both dead
houses were FLAT ELEVATIONS — the building seen face-on, one wall, like a
side-scroller. That is not what an isometric game draws:
  - "isometric projection ROTATES THE BUILDING 45 DEGREES, revealing THE ROOF AND
    MULTIPLE WALLS AT THE SAME TIME" [slynyrd pixelblog 41]
  - every diagonal is 2:1 — two pixels across per one down, 26.565 deg, technically
    dimetric. It is the only ratio that gives a clean staircase with no
    anti-aliasing. [the-pixel.art, pixnote]
  - method: floor plan on the iso grid, EXTRUDE WALLS UP, then roof; three visible
    faces each holding a flat value, because "depth comes from contrast in light
    where sharp angles meet" [tuts+, pixel parmesan]

THE GRID FALLS OUT OF THE CORPUS CELL WITH NO FUDGING: 44 px cell -> a 44x22 diamond,
exactly 2:1, one-cell cube stands 22 px, 1 m of height = 29.3 px.

TWO MASSES, BECAUSE MY OWN GATE SAID SO. The first iso draw was one box with a long
gable and read as a barn — the trailer failure again in a new projection.
house_shape_gate would have refused it. It is now an L: main bar (ridge along X) plus
a wing projecting streetward with its own gable END, garage on the bar's other face.
1302 sq ft, 5:12 pitch, 18 in eave.

REUSE, FIXED PROPERLY: every colour comes from banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_
7_21_26.txt (CANON, all 30 UP 7/21) and gates/iso_house_gate.py VERIFIES IT — every
colour in the output must exist in his bank. That is the check house 01 would have
failed: it carried a reuse check, sampled a few colours off a street tile, and drew
every pixel itself. A reuse check the machine cannot verify is a sentence.

NEW GATE: gates/iso_house_gate.py, registered as ISO HOUSE. 10 checks.

THREE BUGS FIXED BY LOOKING: windows drawn after the wing FLOATED ON THE ROOF (an
opening belongs to its mass and must be painted with it); a window placed 8.42 m
along a 7.5 m wall hung in space off the corner (iso will happily draw an opening
past the end of its own wall — check against the MASS, not the canvas); and the roof
at 6:12 over 9 m depth read as a barn because in iso the roof plane ALSO spans the
depth on screen.

*** AND A REAL SELF-INFLICTED SCARE, RECORDED SO NOBODY REPEATS IT ***
1. I ran `git stash -u`, then `cd` into a throwaway worktree, then `git stash pop`
   THERE. The pop landed in the worktree, which I then force-removed. All
   uncommitted work gone; the stash was dropped by the successful pop and fsck
   times out on this repo. REBUILT FROM SCRATCH rather than doing object
   archaeology, which was faster and deterministic. NEVER pop a stash from inside
   another worktree.
2. Worse: a one-liner `open(p,'w').write(s.replace(m.group(0), ...))` where the
   regex missed. **Python opens and TRUNCATES the file before evaluating the
   argument**, so the AttributeError left slices/BOHEMIA_ALPHA_0_9.html at ZERO
   BYTES. That is what "the CITY frame never loaded" and "the alpha has no LIFE tab"
   actually meant — I nearly chased a phantom rendering bug. Restored with
   `git checkout --`. The stamp helper now READS, CHECKS, and only then writes, with
   a size assert. Any future in-place edit of a big shipped file must do the same.
   (The stamp regex missed because another lane had rolled the date to 7/30.)

BUILD STAMP: 7/30c. ALL GATES GREEN (622s).
