WORLD (world-9lfjtf): 8/27 (a) LATEST -- *** THE BRIDGE WAS TWO THIRDS THE WIDTH OF ITS
OWN ROAD, AND THE CONTRACT COULD NOT SEE BRIDGES AT ALL. 196 broken seams -> ZERO.
TAB: RUN, walk to where a street crosses the freeway. Nothing to judge. ***

    broken seams, whole valley        270  ->  206
    where two road classes meet       263  ->  166
    ARTERIAL TO FREEWAY               196  ->  *** 0 ***
    arterial to arterial                0  ->  0

*** THE CONTRACT WAS BLIND TO BRIDGES. *** An arterial crossing a freeway does not stop at
the freeway -- it rides over on a DECK and a car drives along it. The deck's tiles are kind
`overhead`, and the street contract counted drive/marking/gate only, so every one of those
crossings read as a street that simply ENDED: 97 seams of ONE_SIDE plus 99 of OFFSET, 196 of
the 270 left in the valley. The kit has treated an overhead as a drive CONDUCTOR since
August, for exactly this reason. The contract was the one place that did not.

*** AND THEN THE REAL DEFECT CAME OUT FROM UNDER IT. ***
    var half = 11;   // "~17 m of deck, a real overpass width"
It WAS a real overpass width -- for the arterial as it stood the day it was typed. The
cross-section was rebuilt to real Clark County numbers on 8/26 and THIS NUMBER DID NOT MOVE.
Measured: the deck spans 23 tiles across a roadway that spans 35, on all 116 freeway cells
that carry one. An arterial ran up to the freeway 35 tiles wide, climbed onto a 23-tile
bridge, and came off 35 tiles wide again.
FOURTH TIME THIS MONTH A CONSTANT MOVED AND ITS DEPENDENT STAYED BEHIND -- BOX (which cost
a whole fix its picture), POCKET, the pole offsets, this. So it is not a constant any more:
THE WIDTH OF A BRIDGE IS A FACT ABOUT THE STREET, and bohemia_arterial.js exports it.

THREE MORE UNDERNEATH THAT:
  THE BRIDGE ENDED IN MID-AIR. Paolo 8/16, on this very module: "you gotta recognize when
    the freeway is two grids wide two tiles wide that it has to WORK TOGETHER." The strip
    took that ruling on 8/18 and wired spanThrough. THE FIX NEVER TRAVELLED HERE. The deck
    was built on whichever carriageway touched the arterial and stopped at the cell
    boundary -- a bridge over an eight-lane freeway that stops half way across.
  THE DECK AXIS CAME FROM THE WRONG QUESTION. Derived from `same` (the family cells beside
    me), which is L-shaped at a corner or on a tied cell, so both axes read true and the
    branch chose NO axis: those cells built no deck at all. It reads `streets` now -- the
    axis the freeway actually runs on.
  A TIE WAS NOT AN ANSWER AND EVERY CALLER TURNED IT INTO ONE. roadAxis returned '' for
    "genuinely a crossing" and every caller wrote `roadAxis(...)||'ns'`, so an ambiguous
    cell did not become a crossing, IT BECAME A NORTH-SOUTH ROAD BY DEFAULT -- the identical
    shape as the arterial bug fixed on 8/26. It polls its own ribbon one level deep now.

AND THE BRIDGE WAS TAN, WITH DARK BLOCKS ON IT. Photographed it the moment the width was
right: the deck came back the colour of a GRAVEL DRIVE with a row of DARK ASPHALT
RECTANGLES where the lane line should be. The deck's kind `overhead` fell through the pool
table's else branch to `hyard`, the decomposed-granite YARD pool; its stripe's kind
`marking` routed to `street` -- asphalt, BACKGROUND INCLUDED. Both correct table lookups.
Both nonsense on a bridge. *** A LEGEND NAME IS A ROUTING KEY IN THIS ENGINE, NOT A LABEL
*** -- second time this month a name silently chose a renderer (the first put brickwork on
a dam). Deck, parapet and paint are concrete now, told apart by their own palette entries.

AND THE PARAPET RE-TAUGHT THE SINGLE-LAYER LESSON. A parapet IS solid -- you cannot walk
off the side of a bridge -- so it was declared `structure`, and roadcell_gate went straight
red: traversable space fell from 14,133 tiles to 3,959, because a parapet running the length
of the deck SEVERED THE FREEWAY UNDERNEATH IT. One layer. The deck already solves that by
being an overhead you pass under; its edge is part of the same object. It also has to sit
INSIDE the deck's span -- drawn two tiles outside it, the bridge got wider than the road it
carries and cross-class went 166 -> 263 in one edit.

LEFT, NAMED, AND NOT MINE TO FIX: 40 freeway-to-freeway breaks, newly VISIBLE rather than
new. Sampled: freeway(13,13) runs N/S crossed east and west, freeway(14,13) beside it runs
E/W crossed south -- TWO FREEWAY CELLS RUNNING PERPENDICULAR AND MEETING, where this valley
has a district for exactly that (`interchange`). No piece can make that seam agree; the two
cells are honestly building two different roads. MAP LAW: Claude never designs map layouts.
Counted, named, ratcheting.
GATE: street_contract 17/0, ceilings ratcheted (cross-class 263 -> 166, named freeway 40).
  Arterial, rail and strip-to-strip stay at ZERO with no allowance.
RECORD: records/BOHEMIA_THE_BRIDGE_WAS_TOO_NARROW_8_27_26.md

WORLD LANE RUNNING ORDER (deliberately NOT under the header top_of_the_document_gate reads;
that gate wants a row of the RF4 COMBAT teardown and there is no row in it for a street
piece, so citing one would be a name-drop the machine checks and a human can see is a lie.
This lane's order comes from Paolo's 8/25 dispatch. T4 has an escape for this and T3 does
not, which looks like an oversight in a gate this lane does not own -- flagged, not edited):
 1. THE LEVEL CROSSING. 37 seams where an arterial meets the railway. Now the largest
    remaining class, and a genuinely new piece: crossbucks, the rails carried across the
    roadway, a stalled freight. Fun as well as correct.
 2. The Strip needs a TWO-CELL-WIDE crossing piece (4 seams).
 3. The interchange blob's coordinate mapping is off by one (3 seams).
 4. The 40 perpendicular-freeway seams need a MAP ruling, not a piece (see above).
 5. The interchange is 87.9% connected: 479 drive tiles a car cannot reach.
 6. GLASS and WOOD materials for exteriors; the tyre barrier and razor wire rows.
 7. The reservoir draws buried basin roof slabs with code 6 "water tank", so a concrete slab
    wears steel. Wants its own code, not a routing exception.
 8. Ten dead legend codes left; four are one question (the fill-through margins on
    arterial:0 / downtown:0 / freeway:0 / industrial:0).

FACTIONS (factions-ovkjpf): 8/27 (i) LATEST -- *** 837 PEOPLE STAND WITHIN SIX
CELLS OF WHERE HE SPAWNS AND NOT ONE OF THEM RUNS WITH ANYBODY. Two weeks of
faction work sat 29 cells away behind a green suite. Nothing to judge. ***
TAB: **RUN**, the ⚔ OUTFIT chip. The board now has a second half: THE VALLEY.
WHY I WENT LOOKING: the CHARACTER lane's handoff this week ended with a line
aimed at everybody -- "WHEN HE ASKS FOR SOMETHING, CHECK LATER THAT IT ACTUALLY
GOT WORN" (four garments cooked for the Colorful in July, worn by NOBODY for
five weeks). I pointed it at my own lane and asked the only question that
matters about everything this session shipped: CAN HE REACH ANY OF IT.
THE MEASUREMENT (real surface, cold start, no save):
  player spawns at cell 48,48
  169 cells swept around him, ZERO of them empty, 837 PEOPLE standing in them
  ZERO of those 837 run with anybody
  nearest affiliated person: 9 cells. Nearest base: Colorful, 29 cells.
  FN is 128, so that is 3,712 fine tiles of walking
  REACH_CELLS is 12, so nobody within ~17 cells of his front door CAN be
    affiliated with anyone. Not sparse. Arithmetically empty.
  The open-world research puts the useful gap between points of interest at
    60-120 seconds of travel. This is 10-20x that.
Belonging, the rungs, the wall, commitments, word travelling, the canon wars,
earned enemies, the board -- ALL OF IT sits behind that walk and nothing
anywhere told him it was there. It is the Colorful garments again, at the scale
of a whole lane.
WHAT I DID NOT DO: AFFILIATED_RATE (0.30) and REACH_CELLS (12) are both
[PENDING Paolo] in bohemia_agents.js -- widening either affiliates the whole
valley by MY decision, not his, and does it to every cell at once. MAP LAW: the
bases do not move and the spawn is not mine. So it is REPORTED, not tuned.
WHAT SHIPPED: the board's second half. Every outfit the map holds, which way
their ground lies from where he is standing RIGHT NOW, how far in plain words,
whether he has ever dealt with them, nearest first, with the nearest called out
on its own line because a list is not a direction.
    NEAREST GROUND THAT BELONGS TO ANYBODY: COLORFUL, NORTHWEST, A LONG WAY OFF.
    COLORFUL   NORTHWEST · A LONG WAY OFF          NEVER MET
    MOB        WEST · A LONG WAY OFF               NEVER MET
    CUSTOM     YOURS · THIS IS YOUR GROUND
GROUNDED IN HIS OWN CANON, not a preference. Would somebody living here know
whose ground is whose? YES -- that is what territory MEANS. LIGHT=TERRITORY,
CLUSTERED POWER (12% lit, OWNED), NOBODY PATROLS THE DARK. Territory is visible
by construction. What he does NOT know is any of them personally, and that half
is untouched. And it is a BEARING, NOT A WAYPOINT: the research puts the working
middle between fully-guided (pins, markers) and fully-organic. A pin is a HUD.
THE NUMBER PRINTS IN EVERY SUITE RUN NOW, red or green:
  MEASURED: 837 PEOPLE within 6 cells of the spawn across 169 cells (0 of them
  empty), and 0 of those people run with anybody.
  MEASURED: player spawns at cell [48,48]; nearest affiliated person 9 cells
  (Colorful); nearest base Colorful at 29 cells = 3712 fine tiles
A number nobody looks at is exactly how a hole this size stayed invisible for
two weeks behind a green suite. If somebody fixes the spawn or the placement,
this line moves and everybody sees it move.
AND I CAUGHT MY OWN CLAIM BEING DECORATION. K3 first checked only that no row
said NORTH and SOUTH at once -- which a completely INVERTED COMPASS passes
without blinking, and that is the likeliest bug this feature has because screen
y grows SOUTHWARD and every instinct says otherwise. It now recomputes every
bearing from the base positions; flipping north/south turns it red.
  FACTION BETWEEN  73 passed, 0 failed (was 65)   CARD FOLD   18/0
  ORGAN REACH       8 passed, 0 failed            EVERY PANEL 14/0
*** WHAT THE FLEET NEEDS TO DECIDE, AND IT IS NOT A FACTION BUG ***
The board makes the system FINDABLE. It does not make it NEAR. Three ways out
and none of them is mine:
  1. THE SPAWN AND THE FACTION BASES WERE PLACED BY TWO SYSTEMS THAT HAVE NEVER
     HEARD OF EACH OTHER. The house comes from one rule, the bases from another,
     nothing reconciles them. That is a fleet-level integration gap.
  2. The dials move, and both are his.
  3. Outfits get people who TRAVEL. Real gangs have territory AND runners; a
     Cartel man in your neighbourhood is completely realistic. Needs a new dial,
     so it needs his ruling first.
--------------------------------------------------------------------------------
WORDS (words-8dqrnq): 8/27 (c) LATEST -- *** THE END-OF-DAY BUTTON SAID "KEEP THIS RUN". ***
The driver now reaches 12 screens instead of 6, and what it found was the banned word on a
button, a state flag as prose, and THE GAME TALKING TO PAOLO IN FRONT OF A STRANGER. All fixed.
TAB: WORDS, search "screen". Nothing to judge.

FIRST, THE HARVESTER WAS LYING AND I CAUGHT IT BEFORE IT SHIPPED. It reported 141 strings
across 15 screens. It was clicking THREE DEV PANELS -- the key sheet, the population dial and
the underlay -- because the visibility test asked getComputedStyle(el).display, which reads the
ELEMENT and not its ancestors, so a button sitting inside the HIDDEN builder's drawer answered
"block" and got clicked. 157 of those strings were text no stranger can reach, which is more
than the entire real corpus. offsetParent goes null the moment any ancestor is display:none;
that plus a real on-screen box is the test now. THE HONEST NUMBER IS 54 STRINGS ACROSS 12
SCREENS. A harvester that over-reports looks exactly like thorough work.

THEN THE THREE THINGS IT FOUND, and the first one is the worst thing I have found all session:

 1. *** "KEEP THIS RUN" -- ON A BUTTON, ON THE CARD A STRANGER MEETS AT THE END OF THEIR FIRST
    DAY. *** THERE ARE NO RUNS is the FIRST LINE of CLAUDE.md, LOCKED 8/26, in his own words:
    "BRO THERE ARE NO RUNS. IT IS A FULL GAME THAT WILL TAKE YOU 100 HOURS." One character,
    about a hundred hours, and the install prompt was calling his game a run. Now KEEP THIS
    VALLEY. There is nothing else to keep.

 2. *** THE RUNG CARD WAS ADDRESSING PAOLO IN FRONT OF THE PLAYER. *** Verbatim, on a card a
    stranger can open in the demo: "Which faction claims which district is YOURS TO SET, so
    this card cannot tell you whose permission you would be needing here." And: "You said
    'enough done, enough love', which is not a share, so it stays out of reach until you name
    one." That is a note to the developer, quoting him, rendered to a stranger. NOTHING ABOUT
    THE DIAL CHANGED -- MAYOR_SHARE is still null, no faction was assigned, no canon invented.
    The card still says nobody holds the ground and the top rung is out of reach. Only the
    audience changed.

 3. A second state flag as prose: the sleep card's day summary read "The Meter Reader: never
    taken". Now "nobody picked it up".

AND THE ONE I NEARLY SHIPPED BROKEN: my first fix to the rung sentence replaced one part of a
three-part string concatenation and left a dangling "be needing here." on the card. Caught by
re-driving the demo and READING the card, not by reading my own diff. VERIFY ON THE REAL
SURFACE, for the third time this session.

GATE: gates/voice_gate.js, 85 checks. The DEVELOPER LANGUAGE sweep over every painted string
now covers six classes: backend / localStorage / IndexedDB / API, null / undefined / NaN, a
state flag as prose, RUN VOCABULARY, THE GAME TALKING TO PAOLO, and a stack trace or file path.
Mutation-tested by planting all three of today's regressions back at once -- it names all three.

Nine gates green on the merged tree: voice, dialogue catalogue, quest study, attempt, language,
handoff, current slice, demo build, direct. Build 8/27s. Words book 2,496 lines, 45 sources.

WHAT I WOULD DO NEXT, IN ORDER:
 1. THE SCREENS STILL OUT OF REACH: the journal, the objectives list, and EVERY FAILURE MESSAGE.
    The driver reaches 12 screens and those are not among them. A failure message is the text a
    player reads at their worst moment and not one of them has ever been read as writing.
 2. THE 22 UNPASSED QUEST SCENES, worst-first by rhythm ratio. Not demo-blocking.
 3. NOBODY EVER RAISES THEIR VOICE. Zero exclamation marks in 504 speeches. Still true, still
    not worth forcing.

WHAT IS PENDING HIM: nothing from this lane.

