# [bb faces] SCHOOL ROUND ONE -- THE BUST, and a bug hiding under a question of taste
# PORTRAIT (chat 20), 9/24/26.  RULE 33 (Paolo 9/24, "an executive decision"):
# THE OVERWORLD IS BATTLE BROTHERS, and 33(f) -- EVERY CHAT CARRIES A [bb ...] LINE,
# school first, one page per round on how BB does that department well, then the shape
# for us. 33(g), same round: "Battle Brothers is just a bunch of pictures... we can do
# more and put more life into it with this analog horror pixel direction", so every
# [bb ...] page ends with WHAT MOVES that BB's picture does not.
# Row: [bb faces] THE-EVENT-FACE. Law: laws/BOHEMIA_LAW_THE_OVERWORLD_IS_BATTLE_BROTHERS_9_24_26.md s5

## WHAT I CAN HONESTLY SAY ABOUT THEIR FACES, AND WHAT I CANNOT
I cannot open Battle Brothers' art, so this page makes NO measurement of their pixels.
What is not in dispute and is the whole of the lesson: THEIR PORTRAITS ARE BUSTS. Head,
neck and shoulders, the person filling the frame, a thin rim of background behind them.
Every number below is measured on OURS.

## OURS, MEASURED ON 200 PORTRAITS
    the person                       32% of the frame   (median)
    flat background                  54%
    the shirt                        13%
    the top quarter of the canvas    72.7% nobody
    value range of the person        107 of 255, using 6 of 8 value bands
    distinct colours in the 64x64    53

The value structure is fine. SIX OF EIGHT BANDS and a 107-point range is a real painted
face, not a flat one. THE COMPOSITION IS WHAT IS WRONG: more than half of every portrait
in this game is empty gradient.

## AND MY FIRST TWO READINGS OF THAT NUMBER WERE BOTH WRONG
1. "The head is too small, crop in." WRONG. The person's bounding box is 49 x 61 in a
   64 x 64 frame. It already fills the canvas. There is nothing to crop.
2. "The head sits too low, lift it." WRONG. The median gap above the hair is THREE ROWS.
   The top quarter is empty at the SIDES, because a head is narrow at the top, which is
   what a head looks like.
3. The third reading survived, and it is not a matter of taste at all:

    *** THE SHOULDERS DO NOT KNOW WHERE THE HEAD IS. ***
    The shirt is a FIXED polygon, hard-coded at y=50, spanning x 8..56 of 64.
    The chin it is meant to sit under runs y=42 to y=54 across the crowd.
    And from this round it also moves whenever Paolo drags FACE TOP or FACE LENGTH,
    two of the 32 sliders he now owns.
    On a short face that is EIGHT ROWS OF BARE NECK. On a long one the shoulders climb
    into the jaw. It is the same defect this lane has now found four times in four
    rounds: one side of the face carrying a hard-coded copy of something the other side
    owns (the cut SHAPE 8/28, the hair COLOUR 9/20, the braid sentinel 9/24, this).

## THE FIX, AND ITS SIZE SAID PLAINLY
The shoulder line is derived from THIS face's chin, a short fixed neck under it, running
the full width of the canvas with the trapezius rising toward the neck.

    of 200 faces      145 less empty, 27 slightly more, 28 unchanged
    median            2.1 points of empty removed
    best case         11.7 points        worst case  -0.5

IT IS A REAL FIX AND A MODEST ONE, and it does NOT turn our portraits into Battle
Brothers busts. To fill the frame the way theirs do, the HEAD has to be bigger in frame,
and that is his own dials plus the existing feature-scale knob. That is not a decision to
make quietly inside a school round, so it is named here and not taken.

## AND I BROKE IT ON A LONG FACE FIRST, WHICH IS WHY THE CAST IS THREE
The first version used chin+3 with no real ceiling. On a long face (chin 54) it pushed the
shoulder mass off the bottom of the canvas: 50.3% empty became 54.1%, WORSE than what it
replaced, while the short face went 56.2% to 46.0%. One face would have shipped it. Three
faces caught it. Ten rows is all there is under a chin at 54, so the line is capped.
THE CAST IS THE CLAIM: the claim is that the shoulders must follow the chin, so the cast
is a short, a median and a long chin, not three faces I liked the look of.

## WHAT MOVES, THAT THEIR PICTURE DOES NOT (rule 33g)
A Battle Brothers portrait is a painting. It never moves.
Ours, measured in this lane over the last two rounds:
    it HOLDS          at most one small move every eight beats, 0 of 40 faces over
                      (the bible's rule 6, which its own table had left UNMEASURED)
    it BLINKS         10 to 11 times a minute, the real spontaneous rate
    it LOOKS PAST YOU one person in eleven does not meet your eye
    it TALKS          the mouth is driven by the letters of the line being said
That is the answer to 33(g) for this department, and it is the one thing on this page
that needs no new work: it is already built and already gated.

## THE SHAPE FOR US (the row's brief)
The face that speaks an event on the map is THE PERSON'S OWN PORTRAIT, under exactly the
rules the face at the door obeys: ONE ID ONE WHOLE PERSON, the portrait wears the haircut
and the shades the body wears, it holds and it blinks, and nothing speaks without a face
(rule 19c). An event on the road is not an illustrated card; it is somebody standing
there. Nothing new is needed in this lane to serve that: the event face IS the door face.

## WHERE HE SEES IT
TAB: VOTE, in the alpha, item portrait-the-bust-9-24. It PLAYS (rule 25) and the faces are
132 px, the measured size a portrait occupies on a 390-wide phone (rule 32f).
*** IT IS OFF BY DEFAULT. *** It reframes every face in the game, so under rule 18 the
making goes to VOTE and not to the play surface. His approved face is byte-identical with
it off. window.BOH_FACE_BUST or opts.bust turns it on.
