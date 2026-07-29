ART (f3eu53): 7/29 (b) LATEST — PAOLO RULED "A". THE MASTER PALETTE IS DEAD, AND THE
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
