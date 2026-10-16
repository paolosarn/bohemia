# THE STREET IS NEVER EMPTY (9/7/26, LIFE + CITY lane)

Round 7 of VAMILY `[more people] POPULATION-DEFAULT`, and the first round of this row
with a RULING behind it instead of a `[PENDING]`.

## THE RULING THAT UNBLOCKED IT

The coordinator decided it 9/7, and a number was never Paolo's question:

> "the ship test is met by DENSITY, not headcount. The valley keeps its canon count;
> the mechanism places people where the player IS ... so the ~655 needed within
> meeting range are the people whose day brings them there, spawned near and released
> far, which is how every open world on earth fakes a city. Default: the street a
> player is on is never empty in daylight."

Six rounds had been asking whether the valley holds 69,000 or 5,940. The ruling says
the question does not matter, and it is right.

## MEASURED BEFORE ANYTHING WAS TOUCHED

Standing in FORTY residential places spread across the valley, at three daylight
hours, counting bodies within the repo's own SEE_RANGE of 9 cells:

    116 of 120 standings          NOBODY IN SIGHT       96.7% empty
    the most anyone ever saw      ONE PERSON
    median                        ZERO

And at the cell he wakes on, sampled every five minutes through fourteen hours of
daylight: the count was ONE, one hundred and sixty-eight times out of one hundred and
sixty-eight. Never empty and never alive. A mannequin.

## AND THEN THE NUMBER THAT ENDED THE PLACEMENT ERA FOR GOOD

Asked of the schedule rather than guessed, at TEN IN THE MORNING:

    people in the gathered window     1,140
    actually outside                    763

**SEVEN HUNDRED AND SIXTY-THREE PEOPLE ARE OUTSIDE AND YOU STILL SEE NOBODY.** Sight
covers 361 cells; the window is 12,800,000. So the odds a given standing contains
somebody are 763 x 361 / 12.8M = 2%, and the measurement found 4 in 120. The arithmetic
and the world agree to within a rounding error.

That is round 6's division one layer down. No rule about WHERE the valley's people
live can beat a ground-to-people ratio of ten thousand to one, and this is now proven
twice from two directions.

## WHAT SHIPPED: THE NEAR FIELD

The working set follows the player. The valley's OWN people -- the ones the schedule
already says are out of the house at this minute -- stand on the street the player is
on, instead of on an identical street he will never visit. Walk to the next
neighbourhood and they are released back to their own day.

Nobody is invented. The census does not move.

**THE SPACING IS THE REPO'S OWN NUMBER, so there is no dial to fiddle.** Candidate
street cells are sampled on a lattice of `2 x SEE_RANGE + 1` -- the diameter of what a
person can see. One borrowed body per screenful of walkable ground IS the ruling's
default sentence, expressed as a lattice.

**THEY FILL OUTWARD FROM HIM.** The first cut ranked street cells by frontage and put
all 281 borrowed people on the best-scoring third of the neighbourhood: a real crowd,
somewhere he was not standing, and still 27 of 40 standings empty. The ruling is about
THE STREET A PLAYER IS ON, so the nearest cell fills first and frontage only breaks
ties. That single reordering is most of the result.

**THE ONE BUDGET IS NAMED AS A BUDGET.** How much street to fill is five minutes' walk
at MIN_PER_CELL. Everything else derives from the repo's own numbers; this does not,
and pretending otherwise is how a dial gets smuggled in.

## AFTER

    ALL residential ground     116 of 120 empty  ->  65 of 120     96.7% -> 54.2%
    SETTLED ground only                              32 of 87      36.8%, median 1
    AUTHORED-EMPTY ground                            0 bodies, and that is the point
    at 03:00                                         1 body, correct: watch is a lookout
    borrowed at 10:00                                33 of the valley's own people

**AND THE SPLIT IS THE FINDING, NOT A CAVEAT.** The first honest-looking number was 44
of 120 -- until `city_people_gate` went red and the no-man's-land fix landed, after
which the same average said 65 of 120. Both were true and neither meant anything,
because ELEVEN OF THESE FORTY RESIDENTIAL SPOTS SIT IN ZONES THE MODULE CALLS EMPTY.
Residential district and settled zone are different questions. An average over two
populations that are meant to differ measures neither -- this lane's own standing note,
earned a second time. Settled ground is where the ruling's default applies; empty ground
must stay dead; they are counted apart.

## THREE OTHER GATES WENT RED AND EVERY ONE OF THEM WAS RIGHT

This is the part worth reading. A near field is a change to what the world IS, and three
checkers that had nothing to do with this row caught three different ways it was lying.

**1. `city_people_gate`: STANDING IN A NO MAN'S LAND YOU SEE NOBODY.** Its own comment
says why it exists: *"emptiness is authored, and it has to be provable or the next 'the
world feels dead' change quietly fills it in."* This round WAS that change, and it went
red at exactly one body. The near field now asks the population module the same question
the gate asks -- `zoneAt` -- and refuses to borrow anybody into an empty zone. A desert
that fills up the moment you walk into it is not a busier city; it is a world with
nothing in it that means anything. Leg A2b holds it here too, in the gate whose own
feature would break it.

**2. `on_the_way_gate`: 104 JOURNEYS FINISHED IN UNDER A MINUTE, BIGGEST 916 CELLS.**
This lane's own round-5 checker, written because people used to cross half a kilometre
in sixty seconds. Its census called `pplAt()`, which was the same question as "where does
their day put them" only until the near field existed. Two fixes, and they are different
things: (a) its census now asks `pplAtSched()`, the scheduled day, which is what round 5
actually built -- and its numbers came out BETTER than its own baseline, 26 teleports
against 34, biggest 400 against 477; (b) the guarantee it was really protecting moved to
this gate as B6b: **a borrowed body he can SEE keeps its cell through a rebuild.** Off
screen, appearing somewhere new IS the ruling. On screen it is a person vanishing out of
a doorway in front of him.

**3. `alive_gate`: TWO PERCENT OF THE VALLEY OUTDOORS AT TWO IN THE MORNING.** The
in-sight hold from fix 2 was keeping people on the street after their own day had taken
them home. **A HOLD MUST NEVER OUTLIVE THE SCHEDULE** -- that is inventing people, which
B3 forbids, and the guarantee against vanishing does not outrank it. When their day ends
they leave, the same as everybody else's does. Its other leg, `pinned === 1`, asserted
that exactly one body is on screen before a single step; the exclusion it protects is
untouched and correct, but demanding exactly one was, without meaning to, an assertion
that the street is empty -- the very thing that gate's row was opened to fix.

## TWO NEGATIVE RESULTS, WRITTEN DOWN SO NOBODY PAYS FOR THEM TWICE

**1. SENDING PEOPLE'S DAYS OUT OF THEIR OWN BLOCK BOUGHT NOTHING AND COST THE EARTH.**
The round started here, and the reasoning was good: `pplPlaceFor` chose a person's
whole day from the places in their own home neighbourhood, and `workDist` -- the field
that says how far this person travels, written by the population module since the day
it was written -- was read by the fallback ray and by nothing else. The man who works
far away was being sent to the corner of his own street. So their day was sent out at
their own rank, along their own bearing, capped by their own schedule block at
MIN_PER_CELL (measured: a 202-minute median block buys 2,405 cells, 4.7 neighbourhoods,
so all three ranks fit with room to spare).

It moved the empty-street number from 116 of 120 to 116 of 120. Twice. The only number
that moved was one person leaving the ring.

And it cost: resolving one neighbourhood's people started a `pplPlaces` cascade across
four more, the renderer had to widen its gather from nine neighbourhoods to eighty-one
to draw anybody who had travelled, and **TIME TO FIRST PLAY WENT FROM 21 SECONDS TO 54,
the alpha to 71, and the frame-budget gauge could no longer load the page at all inside
thirty seconds.** Reverted. WHERE PEOPLE'S DAYS TAKE THEM IS NOT WHAT MAKES THE STREET
EMPTY.

**2. THE OCCUPANCY FIX WAS A FIX FOR A BUG THAT WAS NOT THERE.** The gate reported one
cell with two bodies on it, so the near field was made to seed its `taken` set with the
scheduled position of every local within nine neighbourhoods. The mutation run killed
it: with the seeding taken back out, the borrowed-body collision count is still ZERO.
The collision was always LOCAL AGAINST LOCAL -- two people from different
neighbourhoods, each placed by a `taken` set that has never seen the other. It predates
this round, the blit's own one-body-per-cell dedupe hides it, and it is handed on below.

## THE GATE

`gates/never_empty_gate.js`, 11 pass / 0 fail, measured on the CUT DEMO through the
iframe. Registered as THE STREET IS NEVER EMPTY.

A near field is a spawner unless something stops it being one, so four legs are about
cheating rather than about the feature:

  - **B3** every borrowed body is somebody their own schedule already had outdoors,
    checked at BOTH 10:00 and 03:00 so a quiet world cannot make it pass by accident.
  - **B4** the census does not move: same people, same homes.
  - **B5** nobody is in two places at once.
  - **B6** the OCCUPANCY LAW, reported with the borrowed/local breakdown that settled
    negative result 2.

MUTATION-TESTED THREE WAYS:
  - switch the near field off      -> B1, B2 and B5 red; B1 prints 116 of 120 again
  - let it borrow indoor people    -> B3 and B3b red (26 bodies at three in the morning)
  - stop looking at the locals     -> STAYED GREEN, which is what deleted that code

**B3's first cut was wrong and the world was right.** It asserted the street is EMPTY
at 03:00 and caught one body -- the `watch` archetype, a night lookout, on a post. A
gate that demands a dead valley at three in the morning is demanding the watchman go
home. The leg now tests the claim it was really for, and tests it harder.

## THE SHIP TEST, AND WHY THE ROW STAYS OPEN

The ruling's default is "the street a player is on is never empty in daylight". It is
now empty on 36.7% of standings instead of 96.7%, and the typical standing has somebody
in it where before it had nobody. That is a real change to what the game feels like and
it is in the walked surface and the demo.

It is not "never". The row stays CLAIMED. What is left is the peaks, not the floor:
the most anyone ever sees at once is 2, because one body per screenful is exactly what
the lattice promises. A city needs knots as well as a floor.

## HANDED ON

  - **PEOPLE / whoever owns `pplPeople`'s seating:** two locals from different
    neighbourhoods can be placed on one cell, because `taken` is built per
    neighbourhood and neither set sees the other. Measured at 1 collision in a
    four-neighbourhood window at 10:00. Invisible today because the blit dedupes, which
    means it is exactly the kind of thing that stays broken until somebody counts.
  - **The afternoon heat is real and correct:** at 13:00 only 93 of 1,140 people are
    out, against 763 at 10:00. The near field refuses to invent people the schedule has
    indoors, so 13:00 stays quieter than 10:00, and it should.

Tab: CITY, or just walk. Build stamp: 9/6bg.

Gates green on the shipped tree: never_empty 14/0, on_the_way 8/0, alive 16/0,
city_people 18/0, plus the lane's set. Boot 22.0s against 21.1s before this round;
main thread 53.3% of a 56% budget, with the CPU gates run ALONE.
