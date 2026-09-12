# ECONOMY ROUND 31 -- Q31 [cheap eyes]
# THE PLAYER IS THE ONLY PERSON IN THE VALLEY WHO DOES NOT GET BETTER AT KNOWING IT.
# What time buys is not sharper sight. It is memory that survives being away.
# And local knowledge is not geography. It is people and history.

MODE: RESEARCH. NOTHING WAS IMPLEMENTED. This file and the bank lines are the
whole deliverable. Every finding becomes a COMBAT, LIFE + CITY or WORLD job
later, and only the coordinator puts it on the board.

THE ROW, VERBATIM:
  Q31 Which forms of "seeing more" real people get for free by living somewhere
  long enough, versus which they must buy: the difference between a local and a
  stranger reading the same street. Deliver what should come with time in the
  valley and what should come with a perk.

Direct sequel to round 30 [perk price], which answered WHAT A PERK COSTS. This
one answers WHAT A PERK MAY NOT CHARGE FOR.

---------------------------------------------------------------------------
## 1. WHAT I MEASURED IN OUR OWN CODE FIRST
---------------------------------------------------------------------------

Three things exist for this and not one of them touches another.

**ONE: THE GAME ALREADY RECORDS EVERY CELL THE PLAYER HAS STOOD IN.**

    ctSawCell()  ->  sv.meta.seen["x,y"] = 1

Its comment says why: "WHERE YOU HAVE STOOD, so tell them what you have seen
means something here too." And that is its only use, in one place:

    somethingToTell: seen > told

A flat set of cells with no curve on it, spent entirely on whether a faction has
anything new to hear from you. The player's history of the valley is a count, and
the count buys conversation.

**TWO: THE FAMILIARITY CURVE IS BUILT, CORRECT, AND MEASURED. AND THE PLAYER IS
NOT IN IT.**

engine/bohemia_memory.js:

    BASE_HALFLIFE 720 min (12 h) | REFRESH_WINDOW 30 | MIN_CLARITY 0.05 | RADIUS 8
    halflife(mind, subject) = BASE_HALFLIFE * (1 + log2(1 + familiarity))
    clarity(mind, sighting, now) = 0.5 ^ (age / halflife)
    and the comment on the halflife line is three words: "familiarity slows the fog"

I ran it on a real mind, walking past one corner 128 times:

    times you walked past it | halflife min | hours | against a stranger
                           1 |         1440 |  24.0 | 1.00x
                           2 |         1861 |  31.0 | 1.29x
                           4 |         2392 |  39.9 | 1.66x
                           8 |         3002 |  50.0 | 2.08x
                          16 |         3663 |  61.0 | 2.54x
                          32 |         4352 |  72.5 | 3.02x
                          64 |         5056 |  84.3 | 3.51x
                         128 |         5768 |  96.1 | 4.01x

**A WHOLE LIFETIME OF WALKING PAST A THING IS WORTH FOUR TIMES ONE GLANCE.** And
it front-loads hard: the first doubling is worth +29% and the last is worth +14%.
The mechanism saturates, which is the correct shape and I will come back to it.

And here is what it actually buys, which is not what I expected:

    away for       | stranger | local
    an hour        |    0.972 | 0.993
    half a day     |    0.707 | 0.917
    a day          |    0.500 | 0.841
    three days     |    0.125 | 0.595
    a week         |    0.008 | 0.298
    a month        |    0.000 | 0.006

Standing in front of it, the local and the stranger see almost the same thing
(0.972 against 0.993). The gap opens only with ABSENCE. A stranger's memory of a
corner drops under the usable floor after 4.3 days; the local is still at 0.47.

    WHAT TIME BUYS IS NOT SHARPER SIGHT. IT IS MEMORY THAT SURVIVES BEING AWAY.

**AND EVERY SINGLE CALL SITE IS AN NPC'S MIND.** All seven of them:

    makeMind(id)                        an NPC's mind, keyed by NPC id
    see(ctMind(d.p.id), now, '@', ...)  an NPC watching THE PLAYER
    see(ctMind(A.p.id), ..., B.p.id)    one NPC watching another
    recall(m, subjectId, now)           asking an NPC what they remember
    recall(m, '@', now)                 asking an NPC what they remember of YOU
    RADIUS, lastSeenAcross              both read across NPC minds

There is no `CT_MINDS['@']`, no `makeMind('@')`, nowhere. **THE PLAYER HAS NO
MIND.** The one organ in this game that models getting better at a place by being
there exists so that everybody else can remember him.

**THREE: THE EIGHT FROZEN SIGHT CONSTANTS** from round 30 -- SEE_RANGE 9,
MAX_HOPS 2, HEARSAY_LOSS 0.55, GOSSIP_WINDOW 45, and the four deed reaches.
Still frozen, still unreachable by anything a player does.

**SO: THE LEDGER HAS NO CURVE, THE CURVE HAS NO PLAYER, AND THE SIGHT NUMBERS
HAVE NO DIAL. THE PLAYER IS THE ONLY PERSON IN THE VALLEY WHO DOES NOT GET BETTER
AT KNOWING IT.**

---------------------------------------------------------------------------
## 2. WHAT THE RESEARCH SAYS COMES FREE
---------------------------------------------------------------------------

There is a standard model for this and it is fifty years old. Siegel and White:
spatial knowledge of a new place goes LANDMARK, then ROUTE, then SURVEY.

  LANDMARK  which things are recognisable and where they stand out.
  ROUTE     sequences of landmarks with decisions attached: turn left at the
            gas station, three blocks straight.
  SURVEY    the cognitive map. The whole thing held at once, from above.

And the timing is the part that matters for us, because it matches our own curve
exactly. In the empirical work, adults acquire **LANDMARKS IMMEDIATELY**.
Direction and distance estimates improve across early sessions and then **LEVEL
OFF, NEVER ATTAINING PERFECT ACCURACY.** Route knowledge and rough distances come
early. The newer work argues the stages may run in parallel rather than strictly
in order, and that the evidence is not clean enough to settle it.

    OUR OWN log2 CURVE IS THAT SHAPE. Fast at first, flattening forever, never
    reaching a ceiling. We already wrote the right function and pointed it at
    everybody except the one person who is learning the valley.

**AND THE HARD END IS NOT FREE AT ALL.** A London cab driver spends THREE TO FOUR
YEARS on a moped memorising 25,000 streets inside a 10 km radius, plus thousands
of destinations, and about HALF OF THE PEOPLE WHO TRY FAIL THE EXAMS. Maguire's
imaging work found their hippocampus was measurably larger than other people's,
that the size tracked the LENGTH OF THE CAREER, and that in follow-up the
qualified drivers' hippocampi had grown while the failed trainees' had not.

    SURVEY-LEVEL MASTERY IS NOT ACCUMULATED BY LIVING SOMEWHERE. IT IS BOUGHT
    WITH DELIBERATE DAILY EFFORT, FOR YEARS, AND HALF THE PEOPLE WHO PAY FOR IT
    DO NOT GET IT.

That is the cleanest line between free and bought that this round found, and it
comes with a real number on both sides.

---------------------------------------------------------------------------
## 3. THE FINDING THAT PROVES US WRONG
---------------------------------------------------------------------------

The row frames this as "a local and a stranger reading the same street", and the
instinct under that -- mine too -- is that local knowledge is GEOGRAPHIC. The
local knows the shortcuts, the dead ends, which wall you can get over.

**THE DISASTER-RESPONSE RESEARCH SAYS THE GEOGRAPHY IS THE SMALL PART.**

The 2024 work across China, Japan, Indonesia and the Philippines names local
knowledge as three things, and the order is the finding:

    1. SOCIAL CAPITAL
    2. CONTEXTUAL HISTORICAL MEMORY
    3. ADAPTATION TO NEW IDEAS

and it describes the value as the ability to situate a one-off event "in the
broader and deeper context of community relationships". The shortest route gets a
mention -- knowing it makes an evacuation faster -- and it sits underneath the
relationships, not above them. The summary line is blunt: local community members
have an intimate knowledge of their area and are often not helpless victims.

**SO WHAT A LOCAL HAS THAT A STRANGER CANNOT BUY IS NOT THE MAP. IT IS WHO, AND
WHAT HAPPENED HERE BEFORE.**

And now look at what our code does with that. `sv.meta.seen` records GEOGRAPHY --
a set of cells -- and spends it on PEOPLE, as the right to tell a faction
something they have not heard. We are tracking the part that matters least and
cashing it in for the part that matters most, which is accidentally almost right
and exactly the wrong way round.

---------------------------------------------------------------------------
## 4. THE OTHER HALF, FROM THE GAMES SIDE
---------------------------------------------------------------------------

The design principle here is stated the same way everywhere it is written down:
**KNOWLEDGE IN THE PLAYER, NOT THE CHARACTER.** Take the marker off and the
player's own head does the learning, and the result is a deeper hold on the world
than any unlocked overlay produces. The planning vocabulary people reach for is
Kevin Lynch's -- path, edge, node, district, landmark -- and the practical rule is
that the more identifiable landmarks a space has, the more easily anybody places
themselves in it.

That matters for us because it is the one place where the free half CANNOT be
bought, even in principle: a perk cannot learn the valley on the player's behalf.
Whatever we hand over for time has to be a thing the player's own memory is
already doing, made to count.

---------------------------------------------------------------------------
## 5. WHAT COMES WITH TIME, AND WHAT COMES WITH A PERK
---------------------------------------------------------------------------

**FREE, WITH TIME IN THE VALLEY. FOUR THINGS, AND THREE ARE ALREADY BUILT.**

  F1 -- LANDMARKS, IMMEDIATELY. The research gives these away on contact and so
  should we. Nothing to spend, nothing to unlock. A place you have stood in is a
  place you recognise, first time.

  F2 -- MEMORY THAT SURVIVES ABSENCE. This is the measured one and it is the
  real prize: standing in front of a thing, a local and a stranger see almost the
  same (0.993 against 0.972); after a week away it is 0.298 against 0.008. The
  curve for it is written and correct. GIVE THE PLAYER A MIND. One
  `makeMind('@')` and the eight-tile radius the module already uses, and the thing
  a hundred-hour game most needs -- that coming back after a week feels different
  for somebody who lived here -- starts working with no new arithmetic.

  F3 -- IT SATURATES, AND THAT IS THE FEATURE. 4x across 128 visits, +29% on the
  first doubling and +14% on the last. Most of what living somewhere gives you
  arrives early. Do not flatten that curve and do not extend it; it is the shape
  the research measured.

  F4 -- WHO, AND WHAT HAPPENED HERE. The disaster finding, and the one we are
  currently spending rather than accruing. Time in a place should build the
  SOCIAL half, not just the cell count. We already have the organs: the standing
  web knows who saw what, the known ledger holds what you were told, and
  `sv.meta.seen` is sitting there counting squares.

**BOUGHT, WITH A PERK. TWO THINGS, AND ROUND 30 ALREADY PRICED THEM.**

  P1 -- THE SURVEY MAP. The whole valley held at once, from above. Three to four
  years of deliberate daily work in the real case and half of people fail. This
  is the one thing time alone provably does not deliver -- the estimates level off
  and never reach accuracy -- so it is the honest thing to charge for.

  P2 -- DEPTH, which is round 30's answer: what a thing MEANS rather than what it
  is. The `deeper` layer on 14 of 14 asking rows, free to everybody today.

**AND THE LINE BETWEEN THEM, IN ONE SENTENCE:**

    TIME GIVES YOU WHAT YOU WOULD HAVE NOTICED ANYWAY. A PERK GIVES YOU WHAT YOU
    WOULD HAVE HAD TO STUDY.

That is defensible from both aisles. Landmarks and durable memory are what a body
accumulates by being somewhere; a complete map and the meaning under a sentence
are what somebody sat down and worked at. And it keeps EVERYTHING COSTS ONE
intact, because none of the free half has a price at all.

---------------------------------------------------------------------------
## 6. ROUTED
---------------------------------------------------------------------------

Nothing here is a job until the coordinator makes it one.

  -> LIFE + CITY       GIVE THE PLAYER A MIND. One makeMind('@') and the module's
                       own eight-tile radius. The curve, the clarity decay and the
                       familiarity maths are all written and measured; the player
                       is the only body in the valley without one.
  -> COMBAT [perks see] the free/bought line: landmarks and durable memory free,
                       the survey map and depth bought. Round 30 priced them;
                       this round says what the price may not cover.
  -> LIFE + CITY       `sv.meta.seen` is a flat cell count whose only use is
                       `somethingToTell`. It should carry a curve, and the curve
                       exists one file away.
  -> WORLD / PEOPLE    local knowledge is social first: who, and what happened
                       here before. The standing web and the known ledger already
                       hold both halves and nothing joins them to time in a place.
  -> [PENDING Paolo] (32) DOES THE PLAYER GET A MEMORY? Everybody else in the
                       valley has one. Giving him one is the difference between
                       coming back after a week as a local and coming back as a
                       stranger, and it is the cheapest real thing in this round.

  ALSO, FOR EYES E21 [marker sweep], WHICH WAS OPENED ON MY ROUND 29 REPORT AND
  RECORDS THAT THE COORDINATOR'S CHECK FOUND ONLY DECORATIVE SEPARATORS: the
  report was accurate and here is the proof, so E21 starts from evidence rather
  than a disagreement. In the handoff as it stood before my round-29 push, a grep
  for `^={7}$` -- EXACTLY seven equals signs, nothing else on the line -- matched
  line 314. The decorative separators in that same file are 50+ characters and do
  not match that pattern; in the same sweep they showed at 57 and 55 characters.
  One such marker is in the file again now, at the seam immediately above this
  lane's own block, which is why this round removes it: it is my block's opening
  seam and nothing inside another lane's text is touched. THE RULE FOR THE GATE:
  `^={7}$` and `^<{7}` and `^>{7}` are merge debris; `^={8,}$` is decoration.
  Length is the whole discriminator and a loose match cannot tell them apart.

---------------------------------------------------------------------------
## 7. WHAT IS NOT HERE, ON PURPOSE
---------------------------------------------------------------------------

I did not give the player a mind, did not touch bohemia_memory.js, did not set a
familiarity number and did not change a sight constant. The first is LIFE+CITY's,
the rest are rulings or other lanes'.

I did not decide how many visits count as "long enough" in our minutes. The curve
already answers it and the answer is that there is no threshold, which is better
than a number anybody would have had to pick.

And I am flagging two probes of mine that were wrong before they were right, so
nobody inherits the wrong shape: my first familiarity loop used the wrong argument
order on `see()` and spun until node ran out of memory, and my first clarity table
passed an array where a number belonged and printed NaN in every cell. Both are
fixed above and the numbers in this record come from the corrected runs.

---------------------------------------------------------------------------
## 8. THE GATE NOTE
---------------------------------------------------------------------------

Every gate in this lane's subset went green, and the round found that the player
is the only person in the valley without a memory.

These gates check that a part does what it says. Nothing checks that two parts
agree, that a part keeps working for as long as the game lasts, that it is the
right part to have, or that the parts form a loop that closes. Rounds 16 through
31, same sentence. bohemia_memory.js is correct, measured, and has seven callers,
and every one of them is somebody other than the player. A gate asking "does
familiarity extend the halflife" is green. A gate asking "whose mind is this for"
does not exist.

---------------------------------------------------------------------------
## 9. SOURCES
---------------------------------------------------------------------------

Siegel and White, and how spatial knowledge actually arrives:
  https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8354890/
  https://www.sciencedirect.com/science/article/abs/pii/S0010028505000733
  https://link.springer.com/article/10.1007/s00426-020-01384-3
The Knowledge, three to four years, and Maguire on the hippocampus:
  https://www.nationalgeographic.com/science/article/acquiring-the-knowledge-changes-the-brains-of-london-cab-drivers
  https://www.scientificamerican.com/article/london-taxi-memory/
  https://onlinelibrary.wiley.com/doi/10.1002/hipo.23395
Local knowledge in disasters, and its three manifestations:
  https://onlinelibrary.wiley.com/doi/10.1111/disa.12634?af=R
  https://pmc.ncbi.nlm.nih.gov/articles/PMC13238337/
  https://www.sciencedirect.com/science/article/pii/S221242092200379X
Knowledge in the player, not the character, and Lynch's vocabulary:
  https://book.leveldesignbook.com/process/blockout/wayfinding
  https://news.playkigai.com/posts/cognitive-maps-in-game-design
  https://www.wildmoosegames.com/posts/guiding-player-without-ui
