# THE FACE AT REST -- the analog horror bible, read against the faces we have
# PORTRAIT (chat 20), [horror face], 9/24/26.  Rule 20h, Paolo 9/21: "Horror analog,
# do stuff for that, for every chat." The row: "the face is a person a little too
# still, lit by what is in the room, never a monster (the bible, rule six); one page
# against the faces we have, then the first face."
# The bible: records/BOHEMIA_ANALOG_HORROR_BIBLE_9_20_26.md (DIRECTION, 14e03eb6).
# THIS IS THE PAGE. Every cell below is a number off the real renderer, not a word.

## WHY A PAGE AND NOT A FEELING
The bible ships with its own reading table, and the ONE FACE row is the emptiest row
in it:

    ONE FACE   R1 n/a   R2 ok   R3 FAIL(unmeasured idle)   R4 ok   R5 ok
               R6 UNMEASURED   R7 n/a   R8 ok   R9 n/a   R10 ok

Three of those ten cells are not judgements, they are blanks: R1 was never asked,
R3 says FAIL and then says it never measured, R6 says UNMEASURED outright. "Naming
it is rule 13" -- so the bible was honest about what it did not know. This page
closes R1, R3, R4 and R6 with instruments, and two of the four came back the
opposite of what the table guessed.

## THE READING, MEASURED

R1  THE ORDINARY FRAME, ONE WRONG THING           WAS: nothing wrong.  NOW: the gaze.
    "A frame is mundane except exactly one element that should not be there or
     should not be missing. One. Two wrong things is a haunted house; zero is a
     screenshot. MEASURE: name the wrong thing in one sentence or the frame fails."
    THE SENTENCE: *** HIS EYES ARE POINTED A LITTLE PAST YOUR SHOULDER. ***
    Built: spec.eyes.gaze, -1 / 0 / +1, the pupil moved inside the eye the eye
    already has, so it costs no width and cannot push an iris past a lid. Rolled at
    8.3%; MEASURED ON THE CROWD at 9.2% of 600 (one person in eleven).
    gaze 0 is BYTE-IDENTICAL to no gaze on 56 of 56 faces, which is the only way to
    add anything to art that is already approved.
    It moves 18 to 26 pixels where the eyes are visible (n=40, zero dead), and it
    moves nothing on the 20 of 60 whose eyes are behind shades -- that is a lens,
    not a dead dial.
    *** I MEASURED WHAT WAS ALREADY WRONG BEFORE ADDING ONE, because two wrong
    things fails the rule, and the first guess was WRONG: *** the hypothesis was
    that our faces are perfectly symmetric (a mirrored face is not a human face).
    They are not. 120 faces average 14.3% asymmetry, NOT ONE is perfect, and the
    player's own approved face is 13.8%. The faces are ordinary in that respect, so
    the gaze was free to be the wrong thing.
    *** AND THEN THE RULE CAUGHT A SECOND WRONG THING THAT NOBODY PUT THERE.
    See THE BRAID, below. That is the whole argument for rule 1 in one bug. ***

R2  THE CAMERA DOES NOT HELP                       ok, and structurally so.
    A portrait has no camera. Nothing in renderFace can zoom, pan or look at
    anything. The cell cannot go bad without somebody building a camera first.

R3  THE LONG HOLD                                  WAS: "FAIL (unmeasured idle)".
                                                   IS:  PASS, and it was never a fail.
    "In any 4-beat window, moving pixels < 10% of the frame."
    40 idle faces, 120 BPM, a 2000 ms window stepped a beat at a time, counting every
    pixel that changes at least once inside it:
        worst 4-beat moving share   2.34%     ceiling 10%
        faces at or over the ceiling   0 of 40
    It was a blank wearing the word FAIL. It passes with four times the headroom it
    needs. (After the R6 fix below: 2.05%.)

R4  THE LIGHT WAS IN THE ROOM                      WAS: "ok".  IS: *** FAIL. ***
    "Every lumen has a source you can point at. No mood gradient, ever. MEASURE:
     every lit region names its fixture."
    Measured with THE WORLD'S OWN RULER, not a new one: art_45_gate.py says a 3/4
    mass is lit on its RIGHT face and shadowed on its LEFT, and the right third must
    out-lum the left third by at least 8% of the mass's own mean. Run on the portrait,
    on SKIN PIXELS ONLY (hair and clothes are not the face mass), 120 faces:
        lit on the right, like every wall in the game      0 of 120
        lit on the left                                    0 of 120
        no light direction at all                        120 of 120
        the face's actual right-minus-left, median        1.52
        what the world's ruler needs, median              9.84
    So the face leans the RIGHT WAY -- every one of the 120 is positive, 0.22 to 3.42
    -- and by about a SIXTH of what a wall in the same street shows. It is not lit
    wrong. It is barely lit. A face at his door that disagrees with every wall about
    the sun is a known wrong thing, and this measures exactly how far off it is.
    THIS IS THE HALF OF [horror face] THAT IS NOT DONE. The lighting pass this lane
    tried on 9/22 was killed by its own numbers and is in the graveyard with a
    post-mortem (graveyard/POSTMORTEM_THE_PORTRAIT_LIGHTING_9_22_26.txt): it was a
    DARKENING pass, it could only ever subtract, and it read as dirt. The coordinator
    routed the re-lit face to ship with the first person at the door, under
    [faces first]. 9.84 against 1.52 is the number that pass has to hit.

R5  THE DEAD INSTITUTION'S TYPE                    n/a. A portrait draws no words.

R6  THE STILL FACE                                 WAS: "UNMEASURED".  IS: FIXED.
    "A portrait holds; it under-reacts; the blink is rare and the smile is rarer.
     MEASURE: idle portrait, at most one micro-move per 8 beats."
    120 BPM, so eight beats is 4000 ms. A MICRO-MOVE is one unbroken run of
    non-resting frames, not one frame, because a blink is eight frames of one gesture.
        BEFORE:  worst 2,  ELEVEN OF FORTY faces made two
        AFTER:   worst 1,  ZERO OF FORTY make two
    *** AND IT WAS NOT THE BLINK. *** The blink cycles every 5500 ms at rest, which is
    LONGER than the 4000 ms window, so it can only ever fire once inside one. It was a
    SECOND CLOCK: the brow drift ran on its own 16.3 s sine, unrelated to the first, so
    on eleven faces it drifted while the blink was still inside the window and the face
    made two separate moves. ONE FACE, ONE CLOCK now: the brow rides the blink, on one
    blink in three, so the drift is inside the same unbroken run and the eye is shut
    while it happens. That is also the truer gesture -- a spontaneous blink and a small
    brow move are one thing on a real face, not two.
    THE DIAL IS STILL ALIVE, which is the half that matters, because the cheap way to
    pass this line is to stop the face moving at all and call a photograph "restraint":
        blinks in a minute, per face            10 to 11   (spontaneous rate, unchanged)
        of those, blinks carrying a brow        3 to 4
        faces that never brow at all            0 of 40
        pixels the brow moves with the lid down 12 to 34, zero dead

R7  THE LIT STREET WITH NOBODY HOME                n/a to a portrait. Owned by WORLD.

R8  DIEGETIC OR DEAD                               ok. renderFace writes pixels into a
    64x64 buffer and draws no overlay of any kind; there is nothing on the lens to
    remove. Read from the code, not assumed.

R9  THE MACHINES KEEP TALKING                      n/a to a portrait. Owned by SOUNDS.

R10 GRIME IS BAKED, NEVER SHADED                   ok. No runtime post-processing pass
    exists in the portrait path. Same reading as R8.

## THE BRAID: WHAT RULE ONE FOUND
The card for the gaze was rendered, and then LOOKED AT, and the face had a two-pixel
dark stripe running fifteen rows down its left temple. Rule 1 says one wrong thing;
that was a second one, so the card failed the rule it was arguing for.

It is the braid. The portrait's hair spec carries a `braid` field, and the default
spec -- the one renderFace's own comment calls "EXACTLY the face he approved" -- set
it to -1 meaning NONE. *** -1 IS TRUTHY. *** `if(h.braid)` drew one, on the left,
on every face ever generated.

    portraits drawing a braid, before      200 of 200   (6 to 76 pixels each)
    bodies wearing a braided cut           0 of 200
    values the braid field ever held       -1, and only -1
    side it was ever drawn on              left, 200 of 200

Eight lines below that field, this file already says in its own hand that "locs and
braid belong to dead styles, so there is nothing on the body to agree WITH yet."

THIS IS THE SAME SHAPE AS THE HAIR COLOUR BUG THIS LANE FIXED ON 9/20, for the third
time on these two renderers: THE PORTRAIT WAS CARRYING ITS OWN COPY OF SOMETHING THE
BODY OWNS. The fix is the same fix: ask the cut. hairDialsFor already parses each
cut's own `tex` out of its generator, so there is no new source and nothing to drift.
A braided cut gets a braid on a side this person's own die picks; any other cut gets
none; and the sentinel is 0, a value that reads as false.

    AFTER: portraits drawing a braid   11 of 200, all of them DUST WEAVE wearers
           bodies wearing DUST WEAVE   11 of 200
           disagreements               0

AND IT DID NOT COST US THE THING IT LOOKED LIKE IT WOULD. Removing 6 to 76 pixels
from every face sounds like removing variety, and the face-distance metric says the
opposite: the closest pair is 0.0117 either way, unmoved, and the crowd's MEAN
distance went UP, 0.0741 to 0.0747. A stripe every single face shared was pushing
them all toward each other, not apart.

GATE: portrait_haircut_gate.js, three new legs, 15/0.
  - only the people wearing a braided cut have a braid in their portrait (0 disagree of 200)
  - and it is not passing because nobody has one (12 of 200 do, so the check has both
    answers available to get wrong -- a negative control, because 0 disagreements is
    also what an empty room gives you)
  - "no braid" is a value that reads as no braid
MUTATION-PROVED: put the -1 sentinel back and drop the read, and the gate goes
13/2 RED on exactly those two claims, green again when restored.

GATE: talking_portrait_gate.js, two new legs for R6, both green (30 passed, 1 failed;
the 1 is the known face-distance floor, below).
  - an idle portrait makes at most ONE small move every eight beats
  - and it holds because it is restrained, not because the drift is dead

## WHAT THIS ROUND DID NOT FIX, SAID PLAINLY
1. R4, THE LIGHT. 1.52 against a 9.84 bar. Named above, routed to [faces first] with
   the first person at the door. This is why [horror face] stays CLAIMED and is not
   marked shipped: its own row says "a person a little too still, LIT BY WHAT IS IN
   THE ROOM", and only the first half of that sentence is built.
2. THE FACE DISTANCE FLOOR is still red (0.0117 against 0.0143) and it is still the
   same red it was: the metric averages luminance over all 4096 pixels and cannot see
   a dark face. Measured unchanged by this round's work, with the braid and without.
   It belongs to [blank faces], which is school first.
3. THE GAZE IS A DIE, NOT A MEANING. Bible rule 7 wants wrongness drawn from real
   world data. This is rolled from the person's own hash and hooked to nothing true
   about the world yet. When there is a state worth reading -- who is lying to you,
   who is already gone -- that is the hook. Saying so is rule 13.
4. nose.len and details.stubble still move zero pixels. Board row [dead dials].

## WHERE HE SEES IT
TAB: VOTE, in the alpha, item "THE FACE AT REST". It PLAYS (rule 25): two live faces
on the real 120 BPM clock, the same person, one looking at you and one not, both
holding. Built by tools/bohemia_cook_the_face_at_rest.js off the real renderer -- the
frames are renderFace's own pixels, deduped, nothing redrawn by hand. 166 timeline
steps collapse to 9 unique frames, which is the hold measured as a file size.
The faces themselves are everywhere in the alpha: TAB CHARACTER, and every person in
RUN and CITY.
