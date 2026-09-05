ECONOMY (economy-knxaeh): 9/5 LATEST -- *** THE ECONOMY LANE IS OPEN AND ITS
FIRST DAY MEASURED SOMETHING NOBODY HAD RUN: OUR VALLEY STARVES ON DAY 10 AND
EVERY PRICE IN THE GAME IS A CONSTANT FROM ABOUT WEEK NINE UNTIL THE END OF A
HUNDRED-HOUR LIFE. MODE: RESEARCH -- NOTHING WAS IMPLEMENTED. NOT IN A TAB YET
(a research day ships a record, not a surface). Nothing to judge. ***

Record: records/BOHEMIA_ECONOMY_DAY_1_THE_PRICE_IS_NOT_THE_STORY_9_5_26.md
Bank:   banks/BOHEMIA_ECONOMY_TEST_LINES_9_5_26.md  (27 lines, all draft:true)
Question: ECONOMY Q1, now SHIPPED in VAMILY.md.

THE FINDING, IN ONE SENTENCE: **SCARCITY IS NOT A NUMBER GOING UP, IT IS
SOMEBODY SAYING NO, AND WE BUILT THE HALF THAT ISN'T THE STORY.** Argentina
2001, Zimbabwe 2008, Venezuela and Lebanon 2019 all say the same thing about the
first thirty days: the goods were mostly still there. What broke was the
willingness to trade. Harare's famous empty shelves came from a PRICE FREEZE,
not a shortage -- sellers stopped selling because replacement cost beat the
sale, in their own confederation's words. Caracas took the price tags off the
goods entirely. Beirut invented a word for the fact that two people can hold
"the same" dollar and not be holding the same thing. And Buenos Aires froze the
banks on 1 December 2001 at 250 pesos a week, and eighteen days later thirty
people were dead. Our seller has no view about tomorrow. He will sell you a
ration on day 300 with zero food in the valley, cheerfully, forever.

WHAT WAS MEASURED ON THE SHIPPED BUILD (probes only, nothing written into the
game). The good news first: THERE IS A REAL MARKET ON THE SURFACE HE WALKS. Four
goods, all priced, prices READ from the scarcity sim and never typed, days-left
shown in words, buying is a hard sink, and it saves and restores. That is more
economy than this day expected to find. Then:
  - FOOD GONE DAY 10 ON THE REAL SEED (day 10-16 across six seeds). WATER GONE
    DAY 51-60. MEDS GONE DAY 32-36. Population does not move it AT ALL (stock and
    need both scale with heads), everybody working the best job the module has
    moves it two days, and the seed moves it by less than a week. The real
    valley, seed text "bohemia", is the worst of the six.
  - THE STARVATION IS ARITHMETIC: a person eats 1.0 food a day and produces 0.15
    scavenging, 0.30 at a site. The valley grows 15-30% of what it eats forever.
    Water need is 4.0 a day and NO JOB PRODUCES WATER AT ALL.
  - THE FLAT LINE: food pins at the 40x cap on day 10. Day 60 and day 365 are
    the same game -- water 10, food 60, meds 480, fuel 120, unchanging. Above 30
    days of supply the multiplier is exactly 1.0, so the water price does not
    move for the first 23 days and fuel does not move in the first 30 at all.
  - THE NUMBER THAT SAYS THE VALLEY IS STARVING HAS NO READERS. `shortfall` is
    computed every night (about 21 rations of unmet need), is correct, and
    `ledger.flows` is touched by the module's own return and by economy_gate and
    NOTHING ELSE. Zero occurrences inside any player-facing string.
  - THE FIRST HOUR CONTAINS NOTHING, and not for the reason anybody would guess:
    the purse starts 0/0/0, every buy answers CANNOT_AFFORD (water is 0.25 and
    you have nothing), PAYOUT/PRICES/PRODUCTION are still {} sixteen days after
    day 20 of the BB study said so, and dayReport prints blocking:["PAYOUT"] on
    every call. WE DO NOT HAVE AN ECONOMY PROBLEM IN THE FIRST HOUR, WE HAVE A
    FIRST-COIN PROBLEM.

*** AND THE CORRECTION THAT IS BETTER THAN THE ERROR, FOR THE NEXT SESSION: the
roadside director DOES fire on foot as of 8/31 (PEOPLE shipped it, it is the top
block of this file). What did NOT come with it is the money. There are two
directors: walkInterrupt on foot fires the twelve and says a line and touches the
purse zero times; roadInterrupt inside if(MODE==='city') fires the twelve AND
calls roadCard, which is the only route to the choices, the cost, and roadLeave
-- the one faucet in the walked game. THE ENCOUNTERS WALKED ONTO THE STREET AND
LEFT THEIR MONEY BEHIND. A migration list is a deletion list for everything not
on it, at the scale of one function, four days old, green the whole time. It is
also the cheapest first coin in the build: the code exists, it is approved, it is
already firing, one branch is holding its wallet. ***

A STALE FINDING READS EXACTLY LIKE A FRESH ONE. My first sweep said "the road
never fires on foot", which is written in three records still in this repo and
was true until 8/31. What caught it was the top of this handoff file.

ROUTED (coordinator places the rows; this lane changes status words only):
WORLD ECON-THE-SELLER-HAS-A-VIEW-ABOUT-TOMORROW (the finding),
ECON-THE-VALLEY-STARVES-ON-DAY-TEN (report it, do NOT quietly tune it),
ECON-SOMETHING-READS-THE-SHORTFALL, ECON-THE-FIRST-COIN, ECON-QUOTED-IN-BATTERIES,
ECON-THE-LARDER-IS-BORN-WHEN-YOU-LOOK, ECON-SAY-THE-BLOCK-NOT-THE-VALLEY (the
market card promises a region and counts a block, one string).
RUN ECON-THE-WALK-PAYS-WHAT-THE-MAP-PAYS.
UI ECON-NO-TAG-ASK-THE-MAN. PEOPLE/FACTIONS ECON-THE-SAME-THING-COSTS-YOU-MORE.
QUESTS (parked) ECON-PAID-IN-WHAT-THEY-HAVE. SHARED
ECON-A-GATE-CAN-ASK-IF-IT-IS-SURVIVABLE -- economy_gate proves the ledger is
consistent and never asks whether anybody lives; thirty simulated days would have
caught the day-ten famine on the day it shipped.

GATES, this turn: ECONOMY 13/0, MARKET 32/0, PAYDAY 35/0. Full suite (479 gates)
run; two reds and NEITHER IS THIS LANE'S, both proved against a clean worktree of
origin/main rather than asserted:
  - ENGINE SYNC: BOH_FLOORPLAN has 2 distinct bodies across 11 carriers. FAILS
    IDENTICALLY ON CLEAN origin/main, so it is pre-existing drift somebody owns
    and nobody has picked up. ENGINE SYNC LAW is one canonical body per module;
    this one is red right now on main.
  - FIGHT MUSIC: failed inside the concurrent suite ("LANDS at the top of the
    next bar, want 4, layers 0") and passes 47/0 when run alone on BOTH trees.
    A load-timing flake in the suite runner, not a regression.
And two more from the markdown-sensitive subset, both also byte-identical on the
clean baseline:
  - BANKS-USED: 24/2. "INDEX SAYS DEBT, AND IT IS STILL A DEBT: house skins
    (7/21 UP - roof + wall + yard)".
  - DIALOGUE CATALOGUE: 61/2. The WORDS tab is baked from a852b32424dab382 and
    its sources now hash c95d11ddf447f7ca. The fix is one command, printed by
    the gate itself: python3 tools/bohemia_words_book.py. Somebody edited words
    and did not re-bake, so HIS EDITING SURFACE IS STALE, which is the one thing
    a judging surface cannot afford (8/28).
This lane changed markdown only (git diff --name-only against origin/main: four
.md files, zero code, zero json, zero bq), so none of the four can be its work.

*** THE CROSS-LANE FINDING, WHICH IS WHY IT IS WRITTEN HERE AND NOT SWALLOWED:
MAIN IS RED RIGHT NOW ON AT LEAST THREE GATES, and A LAW WITHOUT A MACHINE GATE
IS NOT ENFORCED has a partner nobody wrote down: A GATE NOBODY RUNS IS NOT A
GATE. The ship flow says green or it does not ship, and three reds are sitting on
main. One of them (the words re-bake) is a single command. ***

HONEST SCOPE OF THIS TURN'S GATE RUN: the lane's three gates, plus the subset
that can actually read what this turn changed (canon rot 13/0, attempt 15/0,
demo blockers 22/0, banks-used, dialogue catalogue), plus 43 of the full 479
before I stopped blocking on a suite that runs for hours. Every red seen was
reproduced on a clean worktree of origin/main first. Nothing here was
self-attested.
AND READ THE PAYDAY LINE: it passes 35/35 while its own summary says "every
amount still [PENDING Paolo]". Day 20 happening live. economy_gate's 13 checks
are all true of a valley where everybody is dead: they prove the ledger never
goes negative and prices monotonically in scarcity, and none of them asks
whether anybody lives. CONSISTENCY IS NOT SURVIVABILITY.

REFUSED: any meter on the player (day 7 and the scarcity science agree), any
rebalance of the yields (NO DAMAGE BEFORE THE DIAL -- the famine gets reported to
him, not tuned away, and it may even be his premise), a fourth currency, an
exchange rate, a chart, and inventing what a battery buys. And any
implementation at all, because the lane is MODE: RESEARCH.

[PENDING Paolo] -- for the coordinator to carry, ONE at a time, not a queue:
  1. The valley eats its last shelves in ten days. Is that the premise (a
     place that is running out) or a bug to fix? Nobody has ever ruled it.

NEXT IN THIS LANE: ECONOMY Q2, how money comes back, and the battery tested
against every way a commodity money has ever failed.

================================================================================
WORDS (words-8dqrnq): 9/4 (b) LATEST -- *** VAMILY Q2. WE ALREADY TAG THE EMOTION ON 229
LINES AND IT NEVER REACHES THE WORDS. *** MODE: RESEARCH, nothing implemented.
TAB: NOT IN A TAB YET (research day). Nothing to judge.

Q2 asked how a person talks when lying, scared or exhausted, in TEXT with no voice actor.

THE MEASUREMENT THAT MATTERS, and it is about us. 229 quest lines carry a hand-written
state tag (#dread 66, #wary 66, #flat 41, #tired 40, #cold 10, #hope 6). Shown five lines
of one state and five of another, can a machine place a sixth? #dread vs #tired 49.2%,
#dread vs #wary 50.1%, #wary vs #flat 45.2%, #tired vs #flat 47.0%. CHANCE IS 50. ALL FOUR
AT OR BELOW IT. Somebody wrote #dread beside a line and the line did not change.

EXCEPT ONE CHANNEL IS WORKING AND IT DESERVES CREDIT: sentence LENGTH tracks state without
being asked. #dread 15.3 words a line and 37% fragments; #flat 20.6 and 23%. One-word
sentences: #cold 30%, #tired 20%, #dread 18%, #flat 7%. Frightened people get short and
flat people run long, which is the right direction and matches the science.

EVERY OTHER PRINTABLE CHANNEL IS AT ZERO. Of 229 lines written to be frightened, exhausted
or cold, SIX carry any disfluency at all (2.6%). Zero filled pauses, zero word searches,
zero unfinished sentences, in every state. Nobody in this game has ever hunted for a word
while afraid.

THE CHALLENGE FROM THE SCIENCE: the strongest measured markers of stress are pitch,
intensity, rate and PAUSE DURATION, and a page carries NONE of them. The most robust
indicator, pause time, is exactly the channel text does not have. Text owns four channels
only: sentence length, complexity, repair, word-finding failure. Everything else is a stage
direction. Dose-response from the literature, usable as a ladder: 0% disfluent calm, 2%
under time pressure, 4% under time pressure plus cognitive load.

AND THE LIAR IS BACKWARDS FROM THE INSTINCT. Newman and Pennebaker: liars use FEWER
first-person pronouns, FEWER exclusive words (but, except), FEWER references to other
people, MORE negative emotion words, and LOWER complexity. Not a stammering over-explainer:
a flatter, simpler, less self-involved account. And the effect sizes are SMALL, which lands
where Q1 landed -- real difference is invisible at the length a player reads, so a written
liar must be AMPLIFIED or the scene teaches nothing.

HARD FLOOR CARRIED FORWARD: written dialogue keeps ~3% of real disfluency (film 0.12 per
100 words vs real speech 3.80). A frightened character does NOT go to the real 4%; he goes
up against HIS OWN baseline and the reader feels the jump, never the rate.

RECORD: records/BOHEMIA_WORDS_Q2_SPEECH_UNDER_STRESS_9_4_26.md
TEST LINES: banks/BOHEMIA_WORDS_TEST_LINES.md -- the same man at three rungs, an exhausted
keeper handing your words back, and a true/lie pair. All draft:true, NONE in the game.
VAMILY: Q2 SHIPPED. Next open is Q3, how a crowd talks without repeating itself.

ROUTED OUT OF THIS DAY:
 - WORDS  new row THE-STRESS-LADDER: three rungs per state in the four printable channels,
   so the tags stop being decoration. Held until MODE: BUILD.
 - QUESTS the state tags on 229 lines are a good idea nobody cashed. Keep them.
 - PEOPLE #hope has six lines and every one contains a negation. Worth one look.
 - UI / SOUNDS the unprintable channels are exactly what a BEAT or a sound cue could carry.
   A longer beat before a frightened line gives the page back the channel it lacks.

WHAT IS PENDING HIM: nothing from this lane.

RUN (run-eak241): 9/4 LATEST -- *** HE SAID ONE WORD, FAMILY. FAMILY IS THE CORE
THEME AND THERE WAS NO FAMILY IN THE GAME. There is now.
TAB: RUN, tap STANDING. Nothing to judge. ***

MEASURED BEFORE BUILDING ANYTHING:
    slices/BOHEMIA_ALPHA_0_9.html    runDynasty 0  selectHeir 0  family.tree 0
    slices/BOHEMIA_CITY_WORLD.html   runDynasty 0  selectHeir 0  family.tree 0
THOSE TWO FILES ARE THE GAME. Zero, every term, both files. A complete dynasty
engine has existed since 7/2 -- family tree, deterministic heir selection, three
generational folds, the monument -- living in engine/bohemia_engine.js and in
BOHEMIA_CURRENT_SLICE.html and BOHEMIA_RUN_CURRENT.html, TWO OLD SLICES NOBODY
OPENS. AND THE WALKED WORLD'S ONLY MENTION OF HIS SIBLING WAS A COMMENT QUOTING
HIM ASKING FOR IT ("I want that main quest origin in it when ur sibling dies").
Every other "sibling" in that file is a SIBLING ROAD CELL.

IT IS A WIRE, NOT AN INVENTION -- THIRD TIME THIS SHAPE THIS WEEK, and the third
time nothing was missing except the connection:
    the encounter director   258 approved lines, ZERO CALLERS       wired 8/27
    the build stamp          a fact the shell held, city blind      wired 8/27
    THE FAMILY               named, drafted, rendering, never told  wired 9/4
Everything needed existed: FAMILY_CAST (RAY, DENISE, MARCO, NINA -- named,
draft:true, dressed in approved garments, family_cast_gate 26/0); his 7/19 ruling
on which sibling is lost, ALREADY IMPLEMENTED as survivesIf; and a boot handshake
already carrying two other answers. THE SHELL KNEW WHO HE LOST AND THE WALKED
WORLD HAD NEVER BEEN TOLD. No new channel: the reply that already answers "which
surface am I on" and "which build am I" now also answers "who is my family".

MINE: that the run HOLDS a family, that it survives a reload, that he can reach
it. HIS AND UNTOUCHED: every name comes from FAMILY_CAST and is draft:true, so
renaming her there renames her everywhere -- NOT ONE NAME IS TYPED IN THE NEW
CODE, because two places holding one name is how the mother came back as DENISE
from a table the scene module had never heard of. WHICH sibling dies is read off
survivesIf and decided nowhere else. KNOWN_AT_START is NOT TOUCHED and stays
empty; people_gate still fails if it gains a row.

WHERE HE MEETS IT: the STANDING card, above the factions, because family comes
before factions in this game and that card is already called WHERE YOU STAND. He
never digs, so it goes on a card he already opens.
    YOUR PEOPLE     RAY  DENISE  MARCO
    WHO YOU LOST    NINA
AND IT NAMES WHO HE LOST, not only who is left. "Grief is the proof it was real"
(7/19). A family card listing only survivors is literally the Amalgamation's
pitch -- "a family that never ends" -- shipped by accident.

  FAMILY IN GAME 14/0 (new) · FAMILY CAST 26/0 · WHOLE DEMO 23/0, both unchanged
  MUTATIONS: the shell stops sending the family 5/9 · nobody is lost 10/4
REACHABILITY IS PROVED BY PRESSING THE REAL STANDING BUTTON, never by reading a
variable -- the whole defect being fixed is a thing that existed and could not be
reached, so reading a variable would be that mistake wearing a gate's clothes.

WHAT THIS IS NOT: it is not the dynasty. Three generations, the folds,
succession, the heir and the monument are STILL NOT IN THE GAME -- that is a real
build and it wants its own run. What shipped is the thing all of it stands on:
the game knows he has a family, knows who he lost, and does not forget either.
NEXT IN THIS LANE: the walked world. Everything the road system does -- interrupt,
leave salvage, ask a real question -- fires ONLY ON THE MAP, and most of the demo
is walked. Dispatch item 5, DEAD IS NOT THE DEFAULT, is still open where he
actually spends his time.
Record: records/BOHEMIA_FAMILY_IS_THE_CORE_THEME_AND_THERE_WAS_NONE_IN_IT_9_4_26.md

--------------------------------------------------------------------------------

PEOPLE (people-7h9sfy): 8/31 LATEST -- *** HIS TWELVE APPROVED STREET ENCOUNTERS
FIRE ON FOOT FOR THE FIRST TIME, AND WHERE ONE NAMES AN ANIMAL IT POINTS AT THE
ANIMAL THAT IS ACTUALLY THERE. TAB: RUN. Nothing to judge. ***

TAB: RUN. Build 8/31b - THE STREET HAS THINGS HAPPENING IN IT.
Walk. Things start happening to you that never happened before.

THE ROW: ALIVE-3, which ALIVE-1 named as lead 2 and ALIVE-2's record named as
mandatory.

*** HE APPROVED TWELVE ENCOUNTERS ON 7/26 WITH A PLAIN "Approve all" AND NOT ONE
HAD EVER FIRED FOR A PLAYER ON FOOT. *** roadInterrupt is called from exactly ONE
place, stepOnce's MODE==='city' branch, which is overmap travel at ten minutes a
cell. The walked surface had never called it. HIS OWN APPROVED CONTENT, never
reaching him -- the seventeen invisible hats, the four bright garments nobody
wore, the face maker with no route in, and now this, which is the biggest of them
because he actually approved it out loud.

AND ITEM ONE IS `feral_dog_pack`, ITEM TWO IS `coyote_shadow` -- the two animals
ALIVE-2 shipped the day before. So this is ENGINE SYNC AT THE DESIGN LEVEL, not a
content add: a director announcing dogs while this tier's dogs stand somewhere
else is two mechanisms that both mean "dogs", the ONE ID ONE WHOLE PERSON mistake
with a different noun.
THE DIRECTOR NEVER INVENTS AN ANIMAL. IT POINTS AT THE ONE THAT IS THERE. The
hook is tableFor(district, phase), which is MINE and which the module asks "what
can happen here" -- so it answers what can happen here RIGHT NOW. Measured
walking: coyote_shadow -> coyotes@6865,6302, feral_dog_pack -> dogs@6914,6312,
and the BACK OFF button already works on it.

ONE OPINION PER PLACE: a road class keeps the row ROAD_TABLE already authored.
NO GLOBAL SPAWNS EVER: a district with no row spawns nothing, no fallback.

*** AND A GATE CLAIM FOUND A REAL HOLE IN HIS ROSTER, NOT A TEST BUG. *** The mix
is 70% AMBIENT and only THREE of the twelve are ambient: coyote_shadow,
ghost_robotaxi, and patrols_collide which needs a seam. Because the table will not
offer an animal that is not on the glass, a district with no coyote had NO ambient
token at all and went silent seven beats in ten. The module is RIGHT to refuse a
substitute (a forced fight standing in for an ambient beat breaks the promise
70/20/10 makes), so the fix is SUPPLY: his approved ghost_robotaxi now sits in
every row with a street in it. WHERE an approved thing happens is mine; a
THIRTEENTH encounter would be his and there is not one here.
THE THIN AMBIENT BENCH IS A FINDING FOR HIM: seven beats in ten want an ambient
encounter and the roster has three, one a car and one needing a seam.

TWO BROKEN RULERS IN MY OWN GATE, BOTH FOUND BY IT GOING RED
  1. A WALKER THAT CANNOT TURN IS NOT MEASURING WALKING, IT IS MEASURING A WALL.
     The first cut hammered one direction 1,400 times; the player walked SIX CELLS
     into a wall and the gate called the feature dead while it worked. It turns
     when blocked now and covers 3,418 cells.
  2. The never-lies claim was NONSENSE THAT COULD NOT FAIL: it built an array,
     never called tableFor, and reported 0 because 0 is what an empty loop gives.
     Rewritten it leaned on walkInterrupt, which reads dayWhere(), so it was really
     asking WHERE THE WALKER HAPPENED TO STOP -- and it stopped somewhere with no
     row. A CHECK THAT DEPENDS ON WHERE THE TEST ENDED IS MEASURING THE TEST.

*** AND A SHIP-ROUTINE FACT WORTH NOT PAYING FOR TWICE. *** Changing ANY shared
surface makes every one of the 51 LOOK pictures stale by that gate's own rule
(picture older than the surface it photographs by six hours). Rebuilding them is
51 separate shooter tools and about twenty minutes. It happened twice in two
features today. IT BELONGS IN THE SHIP ROUTINE NEXT TO THE BUILD STAMP AND THE
DEMO CUT, not in the debugging loop where it keeps getting rediscovered. The gate
prints the exact command per picture, so the whole set is:
  node gates/look_gate.js  ->  run every 'RETAKE IT WITH' line it prints

FILES
  tools/bohemia_city_walk_encounters_patch.py   the table and the wiring
  gates/walk_encounter_gate.js                  15 claims, 3 mutations caught
  records/BOHEMIA_WHAT_A_PACK_ACTUALLY_DOES_8_30_26.md   (ALIVE-3 section)

*** WHAT COMES NEXT FOR THIS LANE ***
THE ENCOUNTERS ANNOUNCE AND DO NOT YET RESOLVE. Only the dogs resolve, through
the BACK OFF button. rattlesnake, the_snatcher, scavenger_shakedown and the rest
print their line and pass. Giving each a real resolution is the next row, and the
pack is the worked example of what "real" means: a decision with two answers and
a cost. NOTE the roster's own kinds when doing it -- three of the twelve are
`forced` and two of those are fights, which is where NO DAMAGE BEFORE THE DIAL
will finally bite.

CHARACTER (character-0lurbs): 8/30 (i) LATEST -- *** THE FACE MAKER SHIPPED ON 8/28
AND A PLAYER COULD NOT REACH IT. IT IS IN THE GAME NOW, AT THE MATCH-CUT, AND THE
DEMO IS WHERE I PROVED IT. ***

READ-BACK: from the handoff I took that the demo build now exists as its own link,
that the opening plays end to end (cold open -> raid -> grief dinner -> burial),
and that my own last turn deleted seven haircuts that were remakes of dead shapes.
I did not touch hair this turn.

THE HOLE, MEASURED BEFORE TOUCHING ANYTHING.
His 8/25 dispatch item 10 was "FACE CUSTOMISATION, never built, is on the board".
It was built on 8/28 -- 14 shape sliders, all 24 haircuts, a live portrait -- INTO
THE CHARACTER TAB. That is a DEV tab, and the demo cut strips all seventeen of them
out. So the panel sits in the demo FILE with no tab, no button and no route:
    demo tabs a player can see        city, run
    p-char panel present in the demo  yes
    ways for a player to open it      0
THIRD TIME THIS MONTH. Seventeen invisible hats, four bright garments nobody wore,
a VOTE tab that held no faces for three weeks. THE MATERIAL EXISTED AND NEVER
REACHED THE PLAYER.

WHERE IT GOES IS HIS, FROM JULY, AND I DID NOT INVENT IT.
The 7/19 locked opening turns on a match-cut: "the SAME table, ~10 years later ...
YOU ARE 20-SOMETHING." You are a child before the cut and an adult after it, and
THE ONE THING THE CUT CANNOT SHOW IS WHAT TEN YEARS DID TO YOU. The scene now HOLDS
on beat 15 (`actor you_adult`, the first frame of the grown player), shows TEN YEARS
LATER / Who did you become?, and resumes on THIS IS ME. Researched first: diegetic
creation is the standing answer where immersion matters (Outer Worlds' cryo-manifest,
Shadows Over Loathing's mirror) and the shared shape is that it happens INSIDE the
fiction at a moment the fiction already needed. Ours was written five weeks ago.
HE CAN MOVE IT: the hook reads a `become` flag off whatever beat carries it, never an
id and never an index, so dragging the moment in DIRECT moves it with no code change.

ONE SET OF CONTROLS, NOT TWO. faceControlsUI is the workbench's own body minus the
calibration pad and the EXPORT button (both about making the game, not playing it).
A second face editor is exactly how the portrait and the body became different people
on 8/27.

*** THREE LESSONS THAT GENERALISE BEYOND THIS LANE. ***
1. ANYTHING A PATCH TOOL OWNS MUST BE EDITED AT ITS SOURCE. I wrote hold()/resume()
   straight into the alpha. tools/bohemia_cutscene_tab_patch.py owns that block and
   inlines engine/bohemia_story_surface.js verbatim -- its next run WIPED THEM. The
   failure was silent and flattering: the creator still opened, the button still
   worked, and the scene played on HAPPILY BEHIND IT with every other check green.
2. THE SCENE THE GAME OPENS WITH HAS THREE COPIES AND ONLY ONE IS PLAYED. The record,
   `var BOHEMIA_COLD_OPEN` (read by coldopen_gate ONLY), and the inlined
   BOHEMIA_CUTSCENES catalogue (the only one openScene reads). I hand-edited the
   middle one; every report said success and the game did not change by one pixel.
   A DUPLICATE NOTHING READS IS WHERE YOUR FIX GOES TO DIE.
3. A GUARD BELONGS INSIDE THE THING IT GUARDS. "Ask once per device" lived in the beat
   hook, so it was a property of one CALLER; the gate called openBecome() directly and
   it re-opened over somebody who had already answered.

AND LOOKING CAUGHT TWO THINGS MEASURING DID NOT. The first screenshot came back BLACK
while every probe said success -- the probe hid the splash with display:none instead of
tapping it, which leaves #app display:none, so everything rendered into a hidden tree.
That is this file's own documented lie and it already cost a whole cutscene playing
inside a hidden panel on 8/25. TAP THE SPLASH THE WAY A FINGER TAPS IT. And the sliders
were PURPLE, which PURPLE RESERVATION gives to the Amalgamation alone -- fine on a bench,
not on a screen the player sees. Fixed with a CSS VARIABLE, not an override: my first cut
matched the inline style TEXT and missed, because cssText re-serialises #b39ddb as
rgb(179,157,219). No dev panel changed.

AND A FACE THAT FORGETS IS NOT A FACE -- FOUND AND FIXED THE SAME TURN. pface lived in
memory only, which was survivable while the only person touching it was Paolo on a bench
he keeps open, and stopped being survivable the moment a PLAYER met the creator: build a
head, lock the phone, come back, and you are Punk again WITH NO WAY BACK, because it only
ever asks once. Same class as the VOTE tab's three weeks of `var V={}` (fixed 8/28) --
second time this month a surface has lost somebody's work. THIS IS ME writes the face
now, and so does every control on the bench, so his own work survives a reload too. It
fails safe both ways: nothing stored, a private window, or a corrupt blob all render the
approved PUNK face, and the load MERGES onto PUNK so an old save cannot render a head
with a hole in it. MUTATION TESTED -- stubbing faceLoad turns the reload check red and
names the eye gap that moved.

WHAT IS ON THE BOARD FOR THE NEXT CHARACTER SESSION
1. NOBODY IN THE VALLEY HAS THEIR HAIR UP and it is over 40C. Still open, still needs a
   silhouette he has NEVER killed -- check gates/bohemia_graveyard.txt BEFORE cooking,
   which hair_graveyard_gate.js now enforces.
2. 24 haircuts and 16 faces are in the VOTE tab waiting on his thumb. None judged.
3. THE CREATOR ONLY OFFERS A FACE. His 7/30 board also lists leg length vs torso, frame
   and bulk, posture and neck length as unbuilt slider ideas, and those are BODY, not
   face -- a player who can shape a head and not a body will notice. Ruling-free: the
   mechanism is mine, and the rig already carries the proportions.
4. Carried, another lane: RUN's person-card still has no speech and no face.

Proof: become_gate 28/28 (drives the DEMO, not the workshop, and mutation tested),
coldopen 45/45,
hair_graveyard 9/9, GRAVEYARD 0 live refs, full suite run this turn.
Law: laws/BOHEMIA_LAW_THE_CUT_ASKS_WHO_YOU_BECAME_8_30_26.md
Record: records/BOHEMIA_THE_CUT_ASKS_WHO_YOU_BECAME_8_30_26.txt
Tab: RUN (the opening) / CHARACTER (same controls on the bench) / DIRECT (move it)

================================================================================
FACTIONS (factions-ovkjpf): 8/30 LATEST -- *** THE MAN WHO GAVE YOU THE JOB NEVER
FOUND OUT HOW YOU DID IT, AND IN THE DEMO NOBODY EVER COULD. *** Nothing to judge.

TAB: **RUN** (the demo's only screen). Play the day, resolve the job, then open the
OUTFIT board or read the card of anybody who runs with that outfit.

THE MEASUREMENT THAT MADE THE TURN, taken on slices/BOHEMIA_DEMO.html -- THE FILE A
STRANGER ACTUALLY GETS, not the workshop:
    34 people within six cells of the spawn ....... 0 affiliated
    61 people loaded in the whole valley .......... 0 affiliated
    30 cells to the nearest faction base
So a demo player could do the Trades' job perfectly and the Trades would never hear
of it. Everything this lane shipped on 8/27 and 8/28 -- the outfit's view, the quest
deeds, the card, the OUTFIT board -- was UNREACHABLE IN THE DEMO. Not a faction being
unimpressed: a system nobody can reach. MEASURING THE DEMO RATHER THAN THE BENCH IS
THE WHOLE REASON THIS WAS FOUND, and the UI lane's 8/30 turn is the precedent: twelve
of thirteen controls were under the thumb minimum ON THE DEMO while the bench looked
fine.

AND HIS FILES ALREADY SAID WHO IS IN THE SCENE:
    @ROLE lineman  REQ  faction=TRADES   block=browned
    @ROLE fixer    OPT  faction=NETWORK  met_before=false
53 of the 66 @ROLE lines in quests/bq carry an authored faction. REQ is not
decoration -- bohemia_bq.js FAILS THE BUILD on an unfilled REQ role -- and block=
binds the lineman to the very block the job happens on. A required character bound to
the place is IN THE SCENE. And the casting layer already existed and already worked:
measured 380 people around the Trades' ground, 109 of them Trades, both roles filled
with a real Trades lineman and a real Network fixer. NOTHING HAD EVER MADE THEM
WITNESSES.

WHAT SHIPPED, proved on the demo:
    before   members 0, whoSaw 0, rung null
    publish  witnesses 1
    after    value 0.8, rung NEUTRAL, members 1, whoSaw 1
    why      watched it: Handed the tap to the trades. Daylight patch, every name
             on the work order.
That last line is HIS OWN @LOG SENTENCE, on a card, in the demo.

COMBAT (combat-nfnki9): 8/31 (a) LATEST -- *** ONE MAN CLEARS ZERO EIGHT-MAN ROOMS
OUT OF SIXTY. THERE ARE TWO OF YOU NOW. *** Nothing to judge.

TAB: **COMBAT**. She is standing beside you when the bell rings. DEMO SETTINGS holds
SHE FIGHTS WITH YOU: ON/OFF so the same fight can be seen without her.

HIS WORDS, 8/31: "OKAY NOW WHAT ABOUT 2 V 8 WHEN I HAVE A COMPANION. THIS GAME WILL
ONLY WORK WHEN MULTIPLE PEOPLE CAN FIGHT AT THE SAME TIME!... I IMAGINE OUR COMBAT IS
WAY MORE AUTOMATED YOU REALLY ONLY NEED TO CONTROL YOURSELF FOR REAL!!!"

THE MEASUREMENT, TAKEN BEFORE ANYTHING WAS BUILT. Same 30 boards, same policy, one
man, TRIPLE the shipping health, fifty turns to finish. Rooms cleared:
    3 foes 78.3%   4 foes 48.3%   5 foes 30.0%
    6 foes  5.0%   7 foes  0.0%   8 foes  0.0%
ZERO OF SIXTY, TWICE. And he mostly does not DIE in those -- he is PINNED and the
fight never ends. ENC_SIZES has shipped [3,4,5,6] since V167 for exactly this, with
RF4's own notes reserving 7-8 for BOSS FIGHTS. HIS INSTINCT IS THE MEASUREMENT.
With her: 8 foes 0% -> 60%, 6 foes 3.3% -> 58.3%, 4 foes 55% -> 80%. She goes down in
13.3% of eight-man rooms and 0% of four-man ones, so the danger scales with the room.
And eight-with-her still clears WORSE than three-alone, so the curve keeps its shape.

THE MACHINERY WAS ALREADY BUILT AND HAD ONLY EVER BEEN GIVEN TO THE ENEMY. tickTurnEnd
has run meleeTurnRun, medicTurn, breachTurn, coverSeekAI and pressAI every turn since
this fight existed -- five automated actors, ALL FIVE THEIRS, and the medic already
walks to a body and picks it up. Nothing on your side had ever taken a turn. Same for
the geometry: V193's gunsOnTile is the fight's own exposure question ASKED FROM A TILE
THAT IS NOT WHERE YOU STAND, gated at 30/30 against posExposed, and a companion stands
on one. So it ships as ONE geometry -- gunsOnTile is now a count over hitsTile.

THE FIRE SPLITS, which is what separates a companion from a damage buff wearing a hat.
Battle Brothers' own measured targeting: melee takes the weakest body, RANGED FIRE
DISPERSES toward the nearer softer one, and its players' answer to being shot at is
"keep weaker characters behind somebody else" -- a sentence that only means anything
if there IS somebody else. AND THE COST IS NOT HIDDEN: a man out of reach of your tile
but in reach of hers is now shooting your side. The split is on the VOLLEY POOL and
NEVER on posExposed, which is a geometry question in its own words.

FOUR BROKEN RULERS, AND ONE OF THEM WAS YESTERDAY'S SHIPPED ART:
  * AN EYEBALLED LABEL OFFSET LANDS INSIDE THE TORSO. drawHuman blits the 112 art at
    ey-84*S, so a head top is 2.3 rings up. V196 shipped its HAS THE ROOM label at
    er*1.9 = 0.65 of a ring -- ON THE MAN'S CHEST -- and only looking at HERS found it.
  * A CHECKER THAT REBUILDS THE CAMERA MEASURES ITS OWN ARITHMETIC (V193's pixel arm,
    seven attempts). The frame writes down what it drew now.
  * A CHECK THAT READS WHAT YOU HANDED IT IS NOT A CHECK: the down-vs-up arm drew zero
    men on her and reported 0 -> 0 as a pass. It hunts for a live board now.
  * V164 flaked RED on a green ship reporting "0 landings in 0 MOVES" -- twelve arenas
    can produce no movement at all. It deals until it has movement to judge (needed 35).

WHAT COMES AFTER, IN ORDER:
  1. SHE CANNOT BE PICKED BACK UP. The enemy medic has done exactly that since it was
     written, in the same function -- THEY HAVE A MECHANIC FOR THEIR FALLEN AND YOU DO
     NOT.
  2. THE BLADES DO NOT KNOW SHE IS A PERSON. meleeTurnRun still runs at the player
     only; the split is on ranged fire.
  3. SHE HAS NO AMMO AND NO RELOAD -- V149/V157's magazine economy does not touch her.
  4. The night is still the interesting half (V196): the priority-target puzzle only
     exists after dark, and how many pips it takes to cross a room at night has never
     been measured.
  5. AND THE LAB ROUTED THREE THINGS TO THIS LANE THE SAME DAY
     (records/BOHEMIA_BATTLE_BROTHERS_LANE_DISPATCH_8_18_26.md sec 04):
       * THE DESTRUCTIBLE ARMOUR LAYER, a TWO-REFERENCE convergence (RF4's Protection
         Points and Battle Brothers' armour points are the same mechanic from two
         studios), and the `armor` field is already on every body in our fight WITH A
         ZERO IN EVERY ONE. Take RF4's absolute version, not BB's 10%-leak one.
       * MORALE, which the lab calls the cheapest aliveness in either reference: its
         triggers are "slaying an enemy, seeing an enemy slain by an ally, SEEING AN
         ALLY FALL, seeing an ally flee, being wounded, being outnumbered" -- every one
         already detected here, and AS OF TODAY "seeing an ally fall" is a thing that
         can happen on YOUR side too.
       * REFUSED there and worth keeping refused: the d100 to-hit and damage that
         always leaks. Take the layer, not the leak.
Still open and still combat's: "it could be more hardcore if you wanted it to be."
[FLAGGED TO LAB, not mine to edit] RF4-14's STATUS cell still reads "NOT MEASURED".

Law: laws/BOHEMIA_LAW_MULTIPLE_PEOPLE_FIGHT_AT_THE_SAME_TIME_8_31_26.md
Record: records/BOHEMIA_COMBAT_TWO_OF_YOU_8_31_26.md
Gates: fight_moves_you 155/0, combat_lab 931/1 (the red is another lane's, pre-existing),
one_engine 3/0, boss_ladder 87/0, pages_publish 18/0, demo_build 25/0, 0 page errors.

*** AND ONE THING EVERY LANE NEEDS TO KNOW, FOUND RUNNING THE FULL SUITE FOR THIS SHIP:
THE SUITE CAN NO LONGER FINISH INSIDE ITS OWN TIME BUDGET. *** It measured 9.4s a gate
against 477 gates -- about 4471s of work against a 2700s budget -- and stopped with 82
GATES NEVER RUN, listed as "NOT GREEN AND NOT RED: UNFINISHED". Among the ones that never
ran are BOSS LADDER, RF4 TEARDOWN, BATTLE BROS, ART 45, LEAF PIXEL, PURITY and REUSE
FIRST. "A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED" is the oldest rule in the file, and
a gate that never runs is a law without a gate. The suite itself prints the workaround:
  python3 gates/bohemia_gates.py --shard 1/3   (and 2/3, 3/3)
The 37 confirmed reds it did report are the repo's standing state across every lane, NOT
this turn's: ENGINE SYNC, COMBAT RUNS, MOTION VISIBLE, RENDER PIXEL, THE RUN and WALK
DEADLOCK were each run alone on origin/main AND on this tree and came back with
IDENTICAL pass/fail counts (22/2, 3/2, 124/2, 22/1). Nothing here turned anything red.

--------------------------------------------------------------------------------

WORLD (world-9lfjtf): 8/30 (e) LATEST -- *** THE DEMO IS A PERSON ON FOOT AND
NOTHING IN THIS REPO HAD EVER ASKED WHETHER HE CAN WALK ANYWHERE. He can: 95.7%
of the valley from where the game opens him, and everything out of reach is
MOUNTAIN except eighteen pockets. Now gated. Nothing to judge. ***

TAB: RUN. Walk in any direction. Build 8/30f - YOU CAN WALK TO 95.7% OF THE VALLEY.

THE HOLE
  Every reachability measure in this repo was about something else:
    street_contract_gate  does this seam line up (x7,600), and since 8/28 can a
                          CAR reach the road network
    walkable_gate         is this DISTRICT mostly parking lot, one at a time
    drive_network_gate    can a CAR reach every stall, inside one plot
  None of them asked the only question the player asks: FROM WHERE THE GAME
  STARTS ME, WHAT CAN I WALK TO?

THE ANSWER, AND IT IS GOOD NEWS
    cells carrying standable ground        9,043
    separate walk networks                    99
    the demo opens in                 suburb(48,48)
    CELLS HE CAN WALK TO FROM THERE        8,653   95.7%, and it IS the biggest
  Out of reach: 371 MOUNTAIN, plus EIGHTEEN cells, all of them 1-12 cell pockets
  against the rim -- four desert in the top-left corner, five estate on the
  massif's inner face where the overmap deliberately puts millionaires behind
  mountain, and singles. Only THREE are in the valley proper: warehouse(56,34),
  warehouse(57,34), suburb(7,83).

THE MEASURE
  A node per cell with any standable tile on an edge; an edge between two cells
  wherever there is an index i at which BOTH sides' edge tile is standable, which
  is exactly what a body needs to step across a boundary; then components, and
  the one containing the opening cell. Cell resolution ON PURPOSE: 96x96 cells of
  128x128 tiles is 150 MILLION tiles and a flood over that in a browser is a hang,
  not a measurement.

AND ITS FIRST ANSWER WAS ABOUT ITSELF
  The first draft read the district kit's own solidity -- correct for every kit
  district and BLIND TO THE SUBURB, because SUB_RES cells carry m.sub and never
  m.kit, and the suburb is the one district the demo starts in. It reported that
  the player can walk to 0.0% of the valley. FOURTH TIME THIS MONTH a
  measurement's first answer was about itself (the connector filter that returned
  everything; the crude green threshold that missed #49512e by one point; the
  seam metric that called a driveway a break; this).
  It calls realizeCell now -- the walked surface's OWN answer, which cannot drift
  from what a body experiences. Same reason occupancy_gate compares the model
  against the running page instead of trusting either alone.

THE GATE: gates/walkable_valley_gate.js, 6 checks, REGISTERED as WALK THE WORLD
  (75s, green -- an unregistered gate never runs)
    he can walk OUT of where the game put him (opening cell is on the biggest net)
    reach share floored at 95.5%, only ever goes UP
    what he cannot reach is MOUNTAIN, not somebody's street -- rim and water
      excluded from the headline on purpose, because 371 mountains would let a
      real stranding hide behind them. Ceiling 18, only goes down.
    MUTATION TEST: seal the opening cell and reach must collapse 8,653 -> 1.
      Given this sweep's first draft returned 0.0%, that is not theoretical.
  Probe kept: tools/bohemia_walk_reach_probe.js prints districts and coordinates.
  A COUNT IS NOT A LOCATION -- four failed freeway attempts paid for that lesson.

WHAT COMES AFTER
  The three strandings in the valley proper (2 warehouse, 1 suburb). The ceiling
  is 18 so closing them ratchets. The estate pockets on the massif are probably
  CORRECT -- the overmap puts estates on the mountain's inner face on purpose and
  a hillside street only a car road reaches is a real thing. That is a judgement
  about the MAP, not the plumbing, so it is written down rather than fixed.
  Streets themselves have no big fish left: 642 broken edges of 7,643 (8.4%)
  across 171 shapes, none bigger than 35.

RECORD: records/BOHEMIA_THE_WORLD_YOU_CAN_WALK_TO_8_30_26.md

================================================================================

COORDINATOR (coordinator-checkin-1y6dtv): 9/4 (ba) LATEST -- *** THE MEETING HALL:
VAMILY.md's front page now carries every rule, and every chat re-reads it every time
it hears the word. He never pastes anything again. Nothing to judge. ***
Paolo 9/4: "why should I be passing them any information other than saying VAMILY."
The primer's ten steps moved onto the front page of VAMILY.md; CLAUDE.md's first
block says read that page EVERY TIME; VAMILY_PRIMER.md is now a one-line pointer for
chats that predate today. LAST FEEDBACK RECEIVED: this -> the front page.

CITY (city-1eztay): 8/28 (a) LATEST -- *** THE DEMO NOW CARRIES THE CITY, AND NOBODY HAD
EVER MEASURED THE DEMO'S LOAD. *** THE DEMO IS ITS OWN LINK (his 8/25 law) makes it a
separate build at a separate url, and says the workshop link is never given to a player --
yet every load number this repo ever produced was measured on the WORKSHOP. time_to_play
opens BOHEMIA_ALPHA_0_9.html three times and had never once opened the demo. That is the
VERIFY ON THE REAL SURFACE mistake, and a live risk rather than a theoretical one, because
THE DEMO IS CUT BY A TOOL and a cut can drop the progressive-loading wiring while dropping
no visible feature. Measured, both surfaces, same server/throttle/tap: workshop world 10.1s
wait-after-tap 9.1s; DEMO world 10.5s wait 9.0s. The wiring survived -- but that was LUCK
UNTIL SOMETHING CHECKED IT. time_to_play 13/0 -> 18/0, reusing its existing browser and
server (a second browser gate costs ~40s, a second CONTEXT ~10s).
  AND THE DEMO WAS A STALE CUT: demo_build_gate 24/1 on "it is a CUT OF THE CURRENT
WORKSHOP, not a fork" -- it carried NONE of the day's city. Re-cut, 25/0. The thing he wants
to ship now contains the work.
  *** I HAD TO FIX MY OWN NEW LEG TWICE, BOTH TIMES BECAUSE I TESTED IT. *** (1) I wrote the
cut-quality check as a CLOCK -- demo within 3s of the workshop -- and it FAILED ITS OWN
MUTATION TEST: stripping the warm-up moved the demo 9.0 -> 9.8s and the leg stayed green.
Tightening is not the fix; noise is a few tenths, so a threshold that catches one second
reds on nothing. THE CLAIM IS "THE CUT KEPT THE WIRING", SO CHECK THE WIRING. (2) The
replacement was TWO LEGS THAT WERE ONE LEG WRITTEN TWICE -- I looked for the late loader by
name and that name sits INSIDE the warm-up block's own queue, so stripping the block failed
both for one reason. TWO CHECKS THAT DIE TOGETHER ARE ONE CHECK. Replaced with the failure
that happens separately: block kept, QUEUE EMPTIED, which looks identical from outside. Both
now mutation-tested INDEPENDENTLY.
  THE BLOCKING CHUNK GATE EARNED ITS KEEP ON ITS FIRST DAY: the rebase at the top of this
turn brought main's 4.35 MB chunk 1 back AGAIN and it went red in 0.085s -- where the day
before that cost a 43s three-browser gate to notice, or shipped. A guard nobody can afford
to run before every push is a guard that runs after the damage.
  AND THE STEP A NOTE COULD NOT ENFORCE IS NOW IN THE PUSH LOOP: it re-runs the chunker AND
re-cuts the demo after any rebase, and REFUSES TO PUSH if the blocking chunk is still fat.
"Run the chunker after every rebase" was followed correctly all day and still shipped the
slow load once, because the rebase that undid it ran inside an automated loop where there is
nobody to read a note.
  WHAT COMES AFTER, unchanged and in order: (1) THE SUITE AS A SHIP GATE -- measured today:
181 of 441 gates drive a browser, they are 90% of the wall clock (mean 27.3s vs 5.1s), and
they run 2-wide while everything else runs 4-wide. Raising BROWSER_JOBS is NOT the fix --
browser contention causes false reds, which I proved on myself. (2) LOOK clocks pictures by
mtime against a surface every ship touches, so it measures TREE AGE. (3) GRAVEYARD's 10 live
references, repo hygiene with no owning lane. (4) Aperture mismatch + midpoint keep-out from
8/22. (5) 31 unplaced legend codes.

UI (ui-kmqmrf): 8/30 (b) LATEST -- *** EVERY WALK BUTTON WAS DRAWING TWO ARROWS, AND
MY OWN EYE WAS WRONG ABOUT THOSE ARROWS FOR THE THIRD TIME IN THIS PROJECT. ***
TAB: RUN. The game's look is still untouched; round 7 is still waiting on his thumb.

FIRST, THE TOP ROW IN THIS LANE WAS ALREADY DONE BY SOMEBODY ELSE. UI-2 is his own
8/25 dispatch ("I HATE THAT THE ACTION BUTTON IS THE CITY BUTTON") and it SHIPPED
8/27 -- the city's own source says so: "before THE ACTION BUTTON DOES ACTIONS you had
to press DROP IN on purpose ... Making zoom the way in and out -- his ruling, and
correct." Row closed. Building it again would have been the fourth-version failure
STOP PRODUCING names. READ THE OTHER LANE'S FILE BEFORE BUILDING YOUR OWN ROW.

THE REAL DEFECT, found by reading padMode() on the way past: the city already carries
UI-12's fix -- the direction is DRAWN, a CSS border triangle on .pb::before, rotations
measured at exactly 0/45/90/135/180/225/270/315, correct for all eight -- BUT THE
ORIGINAL TEXT GLYPH WAS NEVER REMOVED. Still the button's textContent at 15px, so every
control renders a correct triangle WITH A STRAY ARROW STUCK TO IT. 8 of 8, proved by
hiding only the text and diffing. Same shape as the 8/27 hairline bugs: a half-finished
fix that left the old thing standing beside the new one. Fixed demo-side, gated,
mutation-proved. Checked in BOTH pad modes rather than assumed.

*** AND THEN I NEARLY FILED A SECOND BUG THAT DOES NOT EXIST. READ THIS BEFORE YOU
MEASURE ANY ROTATED SHAPE. *** The four diagonals read to me as pointing INWARD, and
two of my own rulers agreed. Both were broken. The first measured ink as "brighter than
the median" -- but the buttons are DARK CIRCLES ON A LIGHT BACKGROUND, so it was
measuring the corners of the background. The second modelled the tip as opposite the
centroid offset, which holds for an axis-aligned triangle and INVERTS at 45 degrees; it
reported all four diagonals EXACTLY 178 degrees off, all four identical, AND THAT
TIDINESS IS THE TELL -- a real bug is never that clean.
WHAT SETTLED IT WAS ARITHMETIC WITH NO MODEL IN IT: if the pad is one shape and eight
rotations, the UP button's own shipped pixels turned 45 degrees clockwise must equal the
NE button's pixels. Overlap 58-76% across all seven. THE ROTATIONS WERE RIGHT THE WHOLE
TIME. Third time I have been wrong about these same eight arrows.
STANDING LESSON, now earned three times: WHEN A SHAPE SITS AT 45 DEGREES, NEITHER A
BOUNDING BOX NOR YOUR OWN EYE CAN BE TRUSTED ABOUT WHICH WAY IT POINTS. Turn the
known-good one and compare pixels. Filed as UI-19 with both working methods.

One honest observation left in it and it is TASTE, not a bug, so it was NOT acted on: a
wide triangle is genuinely hard to read at a diagonal. He is mid-way through choosing
the whole UI look and a shape change now answers a question he has not been asked.

gates/thumb_gate.js is 11 claims now, mutation-proved five ways. Nine gates green
including four other lanes' demo gates.
Record: records/BOHEMIA_THE_THUMB_HAS_NEVER_BEEN_CHECKED_8_30_26.md (part two)

------------------------------------------------------------------------

SOUND (sound-xk7pjp): 8/30 (a) LATEST -- *** THE HUNDRED-HOUR GAME LEVELLED YOU
UP IN SILENCE. The tree and the fifty-three bosses -- the entire progression of
the game he described on 8/26 -- had ZERO sound calls between them. 7 moments,
35 candidates, 5 wired the same turn. TAB: MUSIC. ***

Build 8/30e - THE TREE MAKES A SOUND.

MEASURED
  tools/bohemia_combat_the_tree_patch.py         sfx references: 0
  tools/bohemia_combat_the_mini_bosses_patch.py  sfx references: 0
  You earn experience, cross a level, spend a point, a perk comes on, a boss
  goes down and hands you a NEW VERB -- all silent. That is his own 8/26
  sentence, the spine of the hundred hours, making no sound.

SEVEN MOMENTS, FIVE WIRED IN THE SAME TURN
  xp_lands treeEarn · level_up the V189 crossing · perk_taken treeBuy ·
  key_taken keyWin · held_back the already-hold branch     WIRED
  boss_here / boss_falls                                   NOT WIRED, reason
  written: rollBoss RETURNS a boss long before the player is told there is one,
  and a boss dies through the same kill path as everybody else with no branch
  that knows he was named. Both want a hook combat does not have, and inventing
  one would be this lane writing combat rather than wiring it.
  A COOK WITHOUT A CALLER IS A CANDIDATE ON A JUDGING SHEET, not a shipped
  sound -- this lane wrote that rule after shipping six callerless moments.

THE PALETTE AND THE SUBJECT AGREED, WHICH IS THE BEST SIGN NEITHER IS FORCED
  His 8/28 ruling left bell, choir, crystal, glass, water. It was made about a
  rack whose centre of gravity was dry gritty desert matter. PROGRESSION IS THE
  ONE SUBJECT THAT NEVER WANTED DRY MATTER: a level is a RING, a perk coming on
  is a RING, a man's key passing to you is a BELL.

*** TWO THINGS I HAD WRONG, BOTH CAUGHT BY READING THE REAL BUILD ***
  1. A PATCH TOOL IS NOT THE BUILD. I wrote "a level-up is not even an event
     yet", off the tree's patch tool. Decoding COMBAT_B64 showed the shipped
     module is four versions newer: V189 already added the crossing, comment and
     all -- "a level is a MOMENT, not a number that quietly ticks over". The
     moment existed; it had no sound. A patch tool tells you what a thing looked
     like the day it was written. The wire got smaller and invents nothing.
  2. SEVEN MOMENTS DOES NOT CLOSE THE DIVERSITY RED, and I only learned that by
     running it. The gate said "35 more non-instrument candidates" so I cooked
     35. It moved 58.1% -> 55.6% and asked for 25 more: its `fresh` list is
     [r for r in rows if r['synth'] != 'modal'] -- MODAL IS EXCLUDED FROM THE
     DENOMINATOR, because modal IS the stale baseline he complained about. Five
     of seven are modal so 25 of 35 were never going to count.
     NOTHING WAS CHANGED TO CHASE THE NUMBER. A level-up is a bell and a bell is
     modal; picking the method to satisfy a gate instead of the physics is what
     killed batch 25. The red needs five more moments that genuinely WANT
     friction, and progression is not where those live. Reported, not padded.

AND THE GATE CAUGHT A REAL RECIPE FAULT
  All five xp_lands rendered at peak 0.144, under the judgeable band. I wrote it
  "nearly nothing" because it fires on every body -- but HE CANNOT THUMB WHAT HE
  CANNOT HEAR, and a candidate too quiet to judge is a wasted slot, not a
  restrained sound. Quiet is a MIX decision and belongs in the mix.

IN FLIGHT / BLOCKED ON
  Nothing half-built. Nothing blocking. "Nothing, I'm good."

WHAT COMES AFTER
  His thumbs on 35 candidates. SFX DIVERSITY stays red at 55.6% and closing it
  honestly needs five more moments that genuinely want FRICTION -- not modal,
  not instrument, and not padding. boss_here and boss_falls get their callers
  the day combat has a hook for "a named man is here" and "the named man died".

PROOF
  records/BOHEMIA_THE_TREE_MAKES_A_SOUND_8_30_26.md
  tools/bohemia_sfx_batch12.py · tools/bohemia_the_tree_makes_a_sound.py
  SFX RENDER 635 candidates 0 FAILED · SFX WIRED · SFX SHUFFLE · SFX ENVELOPE ·
  SOUND MESSAGE · SILENT PLAY · SILENT MOMENTS · GRAVEYARD · ALPHA LOADS ·
  MATERIAL COOKED 11/0 -- all GREEN

------------------------------------------------------------------------------

DIRECTION (art-f3eu53): 9/5 (l) LATEST -- *** THE REFERENCE LIBRARY AND ITS
INDEX ARE SHIPPED (VAMILY rows 2 and 3 of the DIRECTION lane, after row 1's
MATCHED TO button earlier today). reference/library/ holds 9 kinds x 31
entries (real + pixel, each with the ONE structural rule it teaches, REF-ID
format, no copyrighted bytes copied - links and annotations only), placed
INSIDE the already-excluded reference/ folder because a sibling references/
was a near-twin name pages_publish_gate caught immediately.
records/BOHEMIA_REFERENCE_LIBRARY_INDEX.json is derived by
tools/bohemia_reference_index.py and is the ruler reference_check_gate
(SHARED's row, not yet built) resolves REFERENCE CHECK citations against.
NOTE FOR COOK: cite REF-IDs in every new cook's REFERENCE CHECK. NEXT OPEN
in this lane: RUNWAY-REFERENCE (the Balenciaga / Rick Owens silhouette
library), then PIXEL-CITY-BUILDER-REFERENCE, FIRST-HOUR-REFERENCE, and
THE-STYLE-CARD. [PENDING Paolo, carried by the coordinator: the farm tile
group is the one art-family drift - approved bank, needs his A/B from the
9/5 reply.] PREVIOUS:
LAB (lab-e2r7sv): 8/18 (a) LATEST -- *** THE SPEC IS BUILT ON HIS OWN 83-SCREEN CAPTURE NOW, NOT ON
MY SEARCHES -- AND FINDING THAT OUT MEANT ADMITTING I DID THE WRONG WORK FIRST. ***
JUDGE THIS: 1. records/BOHEMIA_RF4_TEARDOWN_SPEC.md (68 numbered items) NOT IN A TAB (records file).
The fight is the COMBAT tab.

Paolo 8/18: "do big brain online research if you need to then execute and have any questions on your
task WE HAVE a demo to ship more forward motion work we need to complete."

*** READ THIS BEFORE ANY RF4 WORK: laws/BOHEMIA_ADDENDUM_THE_RF4_LIFT_8_17_26.md. ***
PAOLO CAPTURED THE GAME HIMSELF. records/rf4/BOHEMIA_RF4_DANGER_SCHOOL_MASTER.md is his verbatim
capture of 83 RF4 tutorial screens, and records/rf4/BOHEMIA_RF4_COMBAT_SYSTEMS_SYNTHESIS_8_17_26.pdf
is his own 14-section analysis. The 8/17 law then AUTHORISED the lift, DECIDED all seven open forks,
NAMED six contradictions, and routed every lane. Its §6 defines this lane's job in one sentence:
"LAB -- its teardown job SHRANK. He did the research. LAB DOES NOT RE-SEARCH RF4; it turns his corpus
into the numbered spec with the diff column."
I RE-SEARCHED IT ANYWAY. The law was already on main and I did not read it before starting, so I spent
a pass chasing the damage math and the SP economy -- the exact two things his capture already closed.
It is recorded in the spec's CORRECTIONS block, not buried. THE LESSON IS ALREADY IN CLAUDE.md AND I
BROKE IT: read the laws first, then work. The search pass was not worthless (it corroborated mechanics
independently and closed two dossier gaps), but it was redundant AND IT CONTRADICTED SETTLED CANON
TWICE:
  C-A. RF4-15 said "do not import the resource tax." WRONG. Law C1 had already ruled TAKE IT, because
    SP IS UPSIDE-ONLY: it never taxes normal play, it grants free actions on top, and it refills on a
    WORLD clock rather than a punish timer. I had conflated "a resource exists" with "a resource taxes
    you." Corrected in place.
  C-B. RF4-10's "PP regenerates 5 points every 5 turns" came from a search summary. His capture
    documents a 5-turn GLOBAL cadence for SPEED POINTS and records that RF4's own tutorial contradicts
    itself on exactly that. I MAY HAVE ATTACHED AN SP FACT TO PP. Flagged, not trusted, with a
    pointer telling COMBAT to take the clock from RF4-49 instead.
The spec now runs a FOUR-TIER authority stack with his [CAPTURE] on top, above [LAW], [PRIMARY] and
[SOURCED]. If a search finding disagrees with his capture, the capture wins. He could just read the
game; I could not, because every primary domain is egress-blocked here as org policy.

*** HIS ONE SENTENCE, WHICH REFRAMES THE WHOLE RECREATION: *** "Rogue Fable IV is not a damage game.
It is a POSITION game with a damage readout, and almost every system in it exists to make geometry
more powerful than statistics." That is the deepest answer yet to why our fight can feel flat: WE HAVE
THE DAMAGE READOUT AND THE GEOMETRY IS DECORATION.

*** SECTION J IS HIS NINE MACHINES, KEPT AS THE BUILD ORDER (RF4-49..57), ROUTED BY THE LAW. ***
The one COMBAT starts with, because the law says it is "the one he will feel first": RF4-49 THE
FREE-MOVEMENT BUDGET. One action per turn, attacking ends it, moving ends it, waiting is legal and
often correct -- EXCEPT sprinting moves you WITHOUT ending your turn, so SP is a currency that buys
free actions outside the turn economy. And the sharp part: SP REFILLS ON EVERY 5TH GLOBAL GAME TURN ON
A FIXED WORLD CLOCK, NOT A PER-USE COOLDOWN. "A resource on a global clock tests TIMING; the same
resource on a per-use cooldown tests only PATIENCE." WE ALREADY HAVE THE SUBSTRATE: the 120 BPM global
clock, BEAT=0.5s. Also in J: vision as ONE variable gating FIVE enemy systems (the law calls it the
cheapest depth in the document, and we already own LOS and destructible cover); movement asymmetry
(slow enemies orthogonal-only, you diagonal, so geometry generates distance for free -- cleaner than
stat inflation and it needs no numbers); environmental kills that keep a bad-item run solvable;
bounded 50-100% damage variance so breakpoints are plannable and crits become a COMBO system; and
status effects as TURN DENIAL rather than damage.
SECTION K holds the six contradictions as RULINGS, and the one that will bite anybody who misses it is
RF4-62 / LAW C4: RF4 IS MELEE-AND-SPELL, WE ARE GUNS. There distance is safety, which is why kiting
works. HERE LINE OF SIGHT IS SAFETY -- so BREAKING LOS IS OUR KITE VERB, cover is our corridor, and a
corner is still a spacing tool. Do not copy the kite loop literally.
ALSO NOW FLEET-WIDE LAW and it binds every lane that writes player-facing text, not just combat: the
A/B/C TEACHING REGISTER (RF4-65..68). Tell them what they could not derive, hint at what they could,
SHOW them what the room can demonstrate. "NEVER EXPLAIN SOMETHING THE FLOOR COULD HAVE SHOWN."

*** THE TWO MEASURED GAPS STILL OPEN FOR COMBAT, unchanged and now better sourced: *** every fight is
EIGHT men (8.0, min 8, max 8, 0 of 40 inside his 3-4-typical / 5-6-very-hard / 7-plus-is-boss-only
rule, confirmed by two independent queries) and NO ENEMY READS ANY OTHER ENEMY. RF4 buys depth with
SYNERGY, which compounds; we buy it with BODIES, which only adds. Eight is still not a ruling (6/27
uses it as the STRESS CASE, "one enemy or eight"). COMBAT owns the curve and the composition table;
G.numEnemies was measured, never touched. Cheapest way in is RF4-38, one support body whose AI
actively avoids your line of sight so the thing you must kill keeps leaving.
ONE FORK NOBODY HAS RULED, flagged not decided: RF4-58, LEVELLING UP RESTORES ALL COOLDOWNS, so a held
level-up is a detonatable mid-fight reset and progression becomes a combat ability. The 8/17 law
decided seven forks and this was not one of them.

GATE: gates/rf4_teardown_gate.js, 94 checks, registered as RF4 TEARDOWN. It does NOT demand RF4's
numbers -- a gate must never outrank a ruling -- it demands the divergence stay MEASURED and DECLARED
and goes red when COMBAT lands the curve. It fails if the capture loses its place at the top of the
authority stack, if either correction is quietly removed, if the admission that the re-search was the
wrong call is edited out, if a [PENDING Paolo] fork gets answered by LAB, if any RF4-NN
cross-reference dangles, or if LAB's own diff touches any engine module or slice.
46 MUTATIONS RUN THIS TURN AND TWO FOUND REAL HOLES IN MY OWN CHECKS. H3 was written as
`A && B || C`, which JS groups as `(A && B) || C`, so its trailing clause alone passed it and deleting
the actual admission changed NOTHING -- a check that cannot fail is not a check. And A6 caught me
giving one item a DUAL status, inventing a fourth value the law does not define; I fixed the spec, not
the ruler. A cross-reference check now exists because a renumbering slip had left RF4-07 pointing at
RF4-15 instead of RF4-18, and in a file whose whole purpose is that COMBAT cites item numbers, a wrong
number is a real defect.

*** ENVIRONMENT WARNING, TWICE IN ONE SESSION AND IT COST REAL WORK. *** A stale .git/rebase-merge
directory kept resuming a days-old rebase and threw the tree back to an old commit mid-session, once
deleting committed-but-unpushed work and once nearly making me push a commit that DELETED five other
lanes' files. RECOVERY: check `ls .git/rebase-merge`, `rm -rf .git/rebase-merge .git/rebase-apply`,
verify your ships are ancestors of origin/main, hard-reset to origin/main, then re-apply your own
files only. ALWAYS diff against origin/main and read the file list before pushing. PUSH EARLIER THAN
FEELS NECESSARY.

*** WHAT COMES AFTER. *** The teardown is DONE and COMBAT is unblocked; do not rewrite it, extend it
only when COMBAT asks for a spec item. LAB DOES NOT RE-SEARCH RF4 -- that is law, and the two gaps
still open (the full talent lists, and RF3-to-RF4's omission list) are the least useful of the five
and unreachable behind the proxy anyway. THE NEXT LAB STUDY IS PAOLO'S CALL (one session = one system
= one named game). Strongest candidate on the demo board is ROW 7, THE FIRST FIVE MINUTES: still OPEN,
DEMO-BLOCKING, and described there as "the single highest ratio of player-impact to work on this
board" -- a new player lands on the CHARACTER workbench and has to find RUN among ~16 tabs. Owner is
RUN, so LAB's contribution would be a reference study of how the best-in-class roguelites open.
Offered, not started.

--------------------------------------------------------------------------------


