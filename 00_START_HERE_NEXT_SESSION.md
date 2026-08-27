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

