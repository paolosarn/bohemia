# WHO SAYS THIS, WITH WHAT FACE, STANDING WHERE
FACTIONS lane · rule 19(c), and rule 18(b) hold · round eleven · 9/20/26

## THE ONE LINE
Rule 19 says every lane answers three columns before it ships a sentence. This lane
has shipped seventeen rows and nine of them talk, so before anything else goes in,
the three columns got answered for the sentences **already on his screen**, measured
on the glass. The answer is **nine of nine have no mouth**. The useful half is what
turned up while counting: **this game already has a mouth, and it already has a
working portrait pipe, and nothing joins them.**

Nothing was pushed to the alpha. Rule 18(b).

## WHAT THIS LANE SAYS RIGHT NOW, AND WHO SAYS IT
Driven with the one driver, at the door of the demo, day 1 06:00, one boot.

| the sentence on screen | who says it | with what face | standing where |
|---|---|---|---|
| "somebody steps into your way. they meant to." | **nobody** (the game knows the id) | none | a real body, on a named cell, beside him |
| "*faction* came through here. a patrol." | the ground | none | the cell under his feet |
| "Mob want 1 battery tonight for the 1 block of theirs you have used" | nobody | none | a panel he opens |
| "46 WOULD COME WITH YOU FROM THIS BLOCK · 16 SCAVENGER, 12 WORKER, 10 WATCH" | nobody | none | a panel he opens |
| "1 battery a day off the dam" (4 of 14 seats answer) | nobody | none | the card that pops up |
| the lender who visits the heir | a named lender, by design | none | the card that pops up |
| why nobody runs with anybody | nobody | none | the outfit panel |
| who is out on the valley | nobody | none | the travel map |
| whose ground he crossed | nobody | none | marks the day, says nothing |

**Nine of nine, no mouth.** One is close: *somebody steps into your way* is said while a
real person is holding a real cell one step away, and the game can name which person.
It has the body and the place and is missing only the name and the face.

**One is exactly the shape he just killed.** "46 WOULD COME WITH YOU FROM THIS BLOCK ·
16 SCAVENGER, 12 WORKER, 10 WATCH, 8 KEEPER" is a progress readout with four numbers
and no person in it, which is his sentence about the card word for word.

## THE POP-UP IS STILL ALIVE, MEASURED
At the door, before he touches anything: the card covers **310,716 px** of a 378x815
screen, and the finger lands on the card, not the glass. Its own words:

> DAY 1 · 06:00 · light until 22:00 / Something came in on your phone overnight. /
> **THE METER READER** / nobody has picked it up yet / about 4 and a half hours

and six replies under it, written as **first-person speech with nobody speaking**:
*"Half of it now, before I go" · "I will go first, on something small" · "I'LL TAKE
IT" · "Make it a bag instead" · "Make it a favour instead" · "Leave it with somebody
who holds things for strangers".*

The words for a mouth are already written. There is no mouth attached to them. (That
card is RUN's row [no pop ups] and QUESTS' and WORDS Q26's; this is the measurement,
not a claim on their work.)

**AND THE CARD IS NOT THE ENEMY, THE UNASKED CALL IS.** `cardShow()` targets
`#daycard`, and so does the STANDING panel: measured, tapping STANDING takes the same
element from `none` to `flex`. The wake card, the night card and a panel he asks for
are **one surface**. Rule 19(a) kills the surface coming up by itself, not the element,
and a lane that deletes the element takes the panels with it.

## THE THING WORTH CARRYING: THE MOUTH AND THE FACE BOTH EXIST
Counting the misses turned up two pieces nobody has joined.

**1. There is already a card where a named person speaks.** `#ctcard` prints the
person's name into `.who` and their line into `.say`, and it opens off `ctAdjacent()`
— somebody standing beside him — not off a timer. That is the "who says this" column
and the "standing where" column, already built and already correct.

**It has no face in it.** Zero canvases. The speaker has a name and no face.

**2. A portrait already reaches the walked city every boot.** The city frame has **no
face renderer of its own** — it cannot draw a face. What it has is a decoder, a
listener for the `BOHEMIA_CITY_PLAYER` message, and one target, and the alpha paints
that target: `#modeFace`, 64x64, on screen at 40x40, **ink 100%**. A real face, drawn,
in the city, right now.

**The message carries exactly one face: the player's own.** There is one slot and
nobody else can use it.

So rule 19(d)'s fourth thing — a person at his door with a portrait, speaking, inside
the first minute — is not a new system. Measured, it is: a speaker card that works, a
face pipe that works, and **no second slot**.

**And the person is already there.** At spawn, of **61 people placed**, the nearest is
**2 away in the game's own reach metric, and TALK appears at 1**. Nobody has to be
spawned for somebody to be at his door. The nearest human being in this game is one
cell outside arm's reach.

## THE MACHINE
`gates/who_says_this_gate.js`, **9/0**, registered in the suite as WHO SAYS THIS.

A mouth means **both halves**: the surface names its speaker *and* carries their face.
A name with no face is the blank-face defect the portrait law is named after; a face
with no name is a decoration.

It is a **ratchet, not a wall**. All nine sentences were legal when they landed, so the
count is frozen at nine and may only fall. A tenth mouthless sentence from this lane
turns it red. Failing on the nine would paint the lane red for finished work and teach
every lane to route around the gate.

It also **guards the route to the fourth thing**: the decoder, the listener, the target,
and that the face arriving is really drawn. Nothing was watching that pipe, and cutting
any leg of it would take the fourth thing with it silently.

**Mutation-proved four ways**, one boot each: rename the talking card's line class,
break the message name, blank the face, raise the count by one — four claims go red,
each naming what it lost.

## AND THE GATE'S OWN BUG, CAUGHT BY MUTATING IT
The first mutation run expected four reds and got three. The class check asked whether
the page contained `#ctcard .say` — and the mutation renamed the rule to `#ctcard
.sayZ`, **which still contains it**. The check stayed green while the thing it guards
was gone.

**A substring test that matches its own mutation is not a test.** It asks for the
rule's opening brace now. This is the same family as the 9/16 run where three caches
answered `null` twice and scored "same": a check that cannot fail is indistinguishable
from a check that passed.

## AND ONE WRONG SHAPE CAUGHT BEFORE IT RAN
The nearest-person number was first written against `pplGrid()`, which is a
heads-per-block grid with no people in it — it would have reported "could not measure"
and looked like an answer. It is asked through `ctEveryone()` and `ctAt()`, **the same
pair `ctAdjacent()` uses**, so the distance and the button agree by construction.

## WHAT THIS HANDS THE FOUR LANES BUILDING THE FOURTH THING
Measured, not suggested:
- **UI [talk panel]**: the panel exists, names its speaker and carries their line. It
  needs a face, not a rebuild.
- **PORTRAIT / PEOPLE [face at the door]**: the city cannot draw a face. The only route
  is a second slot on the message the alpha already sends and the city already decodes.
- **QUESTS [a person asks]**: nobody needs spawning. 61 people are placed and the
  nearest is one cell outside the reach that makes TALK appear.
- **WORDS Q26**: THE METER READER is already the name on the card, and six first-person
  replies are already written.

## GATES
WHO SAYS THIS 9/0 (new, registered). Pre-push pass green. Full suite: 107 red at
ad23d875; none of them are this lane's.

## RULE 18, OBSERVED
No alpha push, no demo cut, no build stamp. **No game file changed this round** — the
diff is one instrument, one checker, its registry line, this record and the handoff.

## [PENDING Paolo] — NOTHING NEW

## THE THING TO CARRY FORWARD
When a new law lands, the first useful round is not building to it, it is **counting
how far the built thing already is from it** — because the count is where the finished
halves turn up. Nine misses were the boring half. The mouth and the face pipe, both
working and never introduced, were sitting inside the same measurement.
