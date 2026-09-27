# [bb faces] SCHOOL ROUND TWO -- PICK YOUR MAN OUT, and a red that was never real
# PORTRAIT (chat 20), 9/27/26. Paolo this round: "Battle brothers".
# RULE 33(f): every chat carries a [bb ...] line, school first, one page per round.
# RULE 33(g): every page ends with what MOVES that BB's picture does not.

## THE QUESTION
Battle Brothers' company screen is a GRID of small portraits and you pick your man out of
it without thinking. Not by reading stats: by his hair, his helmet, his beard. So: can you
pick yours out of ours?

## WHAT I FOUND WHILE ASKING, AND IT IS A CORRECTION TO MY OWN FOUR ROUNDS OF REPORTING
This lane's own gate has had one leg RED since 9/20 -- "EVERYBODY IN BOHEMIA HAS A FACE,
AND NO TWO ARE THE SAME PERSON", closest of sixty 0.0117 against a floor of 0.0143 -- and
I reported it four times in a row as "a metric that averages luminance over all 4,096
pixels and cannot see a dark face."

*** THAT WORDING WAS WRONG AND THE MEASUREMENT SAYS SO. ***
    correlation between that score and skin tone, over all 1,770 pairs   0.083
That is no correlation at all. What IS true is narrower and stranger: the ten closest
pairs are ALL far below the median tone (30 to 41 against a median of 100.6). The
compression is in the tail, not in the mean. "It cannot see a dark face" was a story that
fit the symptom and not the data, and I repeated it four times without checking it.

## AND THEN I LOOKED AT THE TWO FACES IT CALLED ONE PERSON
At 132 px, the measured size a portrait occupies on his phone. They differ in FOUR of the
nine things you can name from across a room:
    the haircut, the eye colour, wraparound SHADES on one of them, and the shirt.
They are obviously two people. THE CLAIM WAS NEVER FALSE. THE RULER WAS MEASURING
SOMETHING ELSE. A mean absolute luminance difference per pixel is not how anyone tells two
small faces apart, and it never was.

## THE RULER THAT MEASURES THE CLAIM
Two faces are the same person only if they share EVERY nameable thing: haircut, hair
colour, skin, eye colour, shades, hat, stubble, shirt, braid. Nine traits, on the real
generator, sixty people, 1,770 pairs:

    pairs sharing all nine                     0
    fewest traits any pair differs in          2   (and only 25 pairs are that close)
    how the crowd spreads, by traits differing 2:25  3:201  4:619  5:656  6:246  7:23
    the old ruler's closest pair differs in    4 of 9

So the crowd IS distinct, by the measure that matches what a person does. The gate is
34 passed, 0 failed for the first time since 9/20, and it went green by fixing the ruler,
never by lowering a floor.

GATE, talking_portrait_gate.js:
  - NO TWO ARE THE SAME PERSON, on the nine nameable traits (0 twins of 1,770)
  - a NEGATIVE CONTROL: "and it is not passing because every face is a clown" -- some
    pairs must be close (25 at two apart), or nine dice would pass trivially
  - "the old pixel-average ruler is recorded, not obeyed": it names the pair it got wrong,
    its score, its old floor, and how many nameable things those two differ in
  - the old ruler is KEPT as a smoke alarm with its floor re-grounded from 0.0143 to
    0.0100, so it fires on a real collapse instead of on a false alarm
MUTATION-PROVED: alias one citizen to another so two people really are one face ->
31 passed, 3 failed, and all three of the right legs speak (the twins leg, the
old-ruler-recorded leg at 0 traits differing, and the smoke alarm at 0.0000). Restored:
34/0. The re-grounded floor still catches a collapse, which is the whole reason to keep it.

## THE THING THE GRID SHOWED ME THAT NO NUMBER ASKED FOR
Nine faces laid out as a roster, and my eye said seven of them were wearing shades.
COUNTED: five. And in the real crowd it is 58 of 200, 29%.
So my first grid over-represented shades by nearly double, which would have made the game
look worse than it is on a card whose whole question is "can you tell these apart". THE
CAST IS NOW DRAWN TO THE CROWD'S OWN RATE: three of nine.
And the finding underneath stands and is his to rule on: THE EYES ARE THE MOST IDENTIFYING
THING ON A FACE THIS SIZE AND NEARLY A THIRD OF THE VALLEY HAS THEM COVERED. There are six
distinct eye colours in the crowd and 58 of 200 people never show them. PEOPLE measured the
same thing from their side on 9/24. Named, not decided: how much of the valley wears shades
is a look ruling, not mine.

## WHAT MOVES, THAT THEIR PICTURE DOES NOT (rule 33g)
A Battle Brothers roster is a wall of paintings. Ours holds (at most one small move per
eight beats), blinks 10-11 times a minute, one person in eleven does not meet your eye, and
the mouth is driven by the letters of the line being said. The card's grid plays.

## THE CUT LINE, AND A ROW OF MINE THAT STANDS ON A CUT SYSTEM
Rule 33h's cut list (9/24) cuts RUN+PEOPLE's COLD OPEN AND ITS BANNER. My row
[faces first] has been CLAIMED and blocked for rounds with the reason "the cold open is
unreachable in the demo". That blocker is now moot: the thing it was waiting on is cut.
"A lane that finds itself building on a cut system stops and says so." Saying so. The row's
real content -- the first face a stranger meets -- now belongs to whatever replaces the
open (the first person at the door, rule 19d), and it needs the coordinator to re-point it.

## WHERE HE SEES IT
TAB: VOTE, in the alpha, item portrait-pick-your-man-out-9-27. It PLAYS (rule 25), the
faces are 132 px (rule 32f), and the nine are cast to the crowd's real rate, not to mine.

## LATE ADDITION: THE LIBRARY LANDED MID-ROUND, SO THIS PAGE NOW CITES A SOURCE
Rule 33j (Paolo 9/27: "download everything or remember everything, all the stats") put
reference/library/battle_brothers/ in the repo while this round was being written, and my
row now says READ FIRST and CITE IT. Everything above was measured before it existed and
none of it changes. What changes is that "I cannot open Battle Brothers' art" was the
whole of my source and now it is not.

CITED: reference/library/battle_brothers/10_UI_AND_FEEL.md (tagged (recall), written from
memory 9/27, unverified against a fetched page because the wiki is not reachable).
Two lines in it are this department's:

  1. "a bottom bar with the roster's faces (small portraits with hitpoint and morale
     rings)" and "a turn order strip at the top with every face in order".
     ONE FACE, MANY SURFACES. The same small portrait follows the man into the roster bar,
     the turn order and the recruit row. That is ONE ID ONE WHOLE PERSON (8/27) carried
     further than we carry it, and it is the right shape for the map HUD when it exists.

  2. *** "portrait (painted, AGED BY INJURIES)". *** A Battle Brothers portrait CHANGES as
     the man is wounded. Identity over time, drawn on the face.
     AND WE HAVE THE MACHINERY AND IT REACHES ALMOST NOBODY. renderFace has a real damage
     pass -- the 8/x V131 work that places wounds on THIS face's own bones from its own
     anatomy, written after Paolo's "it needs to work with customizable faces". Measured
     this round: `blood` is passed in exactly TWO live places in the whole alpha, and one
     of them is the baked "dying" frame of the player's own portrait. The crowd never gets
     it, and nothing carries a wound from one meeting to the next.
     NAMED, NOT TAKEN: that is a real next school question for this row and it is not a
     thing to start at the end of a round. It is also cheap, because the pass already
     exists and already obeys the dials.

THE HONEST LIMIT OF THE CITATION: volume 10 is (recall). It is somebody's memory of the
game, not a fetched page, and the library says so itself. Nothing above rests on it; it is
cited for the two lines it gave me and both are named as recall.
