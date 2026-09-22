# WORDS -- THE TRADE OUTLIVES THE TRADE
# VAMILY round, 9/23/26, lane WORDS (words-8dqrnq). Row [trade slang] BB-STILL-SAYS-IT.
# Fifteen lines wired into the table the game already keeps. NOTHING registered in VOTE,
# which is rule 29.

## WHAT GOT COOKED
**Every former trade in the game now has a line somebody says because of it.** Fifteen
trades, fifteen lines, written straight into the row each trade already occupies, so the
word travels with the person instead of sitting on a card.

## RULE 12, AND THE NAMED BLOCKER WAS GONE AGAIN
The row says it depends on PEOPLE's BB-WHAT-YOU-WERE. **PEOPLE built it.** Every person
carries a `was` (what they did before) and a `keeps` (what that leaves them able to do),
with a real-city mix behind it. Measured before writing a word, and the blocker had
already landed. Third round running.

## THE FINDING, AND IT IS THE SAME SHAPE AS THE LAST TWO
**Fifteen former trades exist, with a genuinely good design in them, and not one of them
says anything.**

And the design is the part worth reading. The table splits into three houses, and the
front-of-house rows carry `keeps: null` **on purpose**, with the reason written beside
them: the trade died, and the empty half has to be visible or the joke is not there.

    BACK OF HOUSE    ran a kitchen, ran the laundry, kept the boilers, pulled high
                     voltage, ran the water plant, worked the docks
                     -> they kept a machine running and the machine still matters
    FRONT OF HOUSE   dealt cards, parked cars, ran a pit, worked the floor
                     -> keeps: null. They served the money, and the money is gone.
    OFF THE STRIP    poured concrete, drove a cab, worked a ward, taught school,
                     fixed engines

**Somebody built the sadness into the data structure and then had nobody say it.** That
is the third time in three rounds the find was already in the repo: twelve endings in the
encounter table, a refusal system in the quirk factory, and now fifteen trades with a
null where the joke goes.

## WHAT THE LINES DO
The back of house still has the skill, so their line is the old frame applied to the new
world: a water-plant hand says "Do not drink that. I ran the plant. I would know." A
sparks says "I will put my hand on that panel. You will not."

**The front of house is the round.** Their trade has no object any more, and they still
do it:

    DEALT CARDS        I still cut the deck twice. There is no deck.
    PARKED CARS        I can still park anything. There is nothing to park.
    RAN A PIT          I ran a room. I still count the room when I walk in.
    WORKED THE FLOOR   I worked a floor with four thousand people on it.

That is the dead institution in a mouth, which is the register he approved out loud, and
it arrives without a narrator, a card or a single word of explanation. The row asked for
funny and sad in the same breath. The dealer's line is four words of habit and three
words of fact.

## THE FORM, BECAUSE HE KILLED THE LAST SEVEN
**Rule 29: no text-only item, the words ride inside a thing.** So nothing is registered
in VOTE this round. The lines are a field on a row that already exists, beside the trade
they belong to, in both copies of the module.

**AND NOTHING NEW DRAWS.** Rule 18 holds the play surface, and this respects it the way
the law itself blessed for the encounter tables: the field is added, nothing reads it,
nothing is shown. Verified rather than asserted: no reader of the trade rows' new field
exists anywhere in the engine or the city.

## A FIFTH RULER FAILURE, CAUGHT BY CHECKING INSTEAD OF BELIEVING
My verification said **14 of 15** trades got a line, and the honest reflex was to go hunt
the missing one. Instead I looked at the ruler. My pattern read `keeps: ([^,]+)`, and the
laundry row's value is "KNOWS WATER, HEAT AND SOAP AT SCALE". **A comma inside a value
broke the check, not the data.** Re-counted by id, which punctuation cannot fool: 15 of
15, no duplicates, fifteen distinct lines.

Fifth one this lane has recorded. The pattern across all five is the same: a ruler
believed because it produced a number.

## WHAT THIS DOES NOT CLAIM
- **Nothing new is visible.** No surface reads the field yet, by design and by rule 18.
- **No new mechanism.** One field on fifteen rows that already existed.
- **No break reported, no reference game cited.**

## ROUTED
- **PEOPLE** the trades you built now have words in them. When a surface wants a line off
  who somebody used to be, it is there beside the `was` it belongs to and it needs no
  lookup table of mine.
- **whoever gives a stranger a second thing to say** the quirk is "one thing that is
  theirs"; this is the other one, and the two do not collide: a quirk is about now, this
  is about before.
- **WORDS, standing, third round running** read the table before writing the words.

## SOURCES
- `engine/bohemia_people.js` and its copy in `slices/BOHEMIA_CITY_WORLD.html`: the trade
  table, its three houses, and the deliberate `keeps: null`.
- `BOHEMIA_BACKLOG.md` BB-STILL-SAYS-IT and BB-WHAT-YOU-WERE, read this round.
- `engine/bohemia_stage.js`, executed for every length: all fifteen are whole bars, none
  in the dead zone.
