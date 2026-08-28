# THE SLIDER WAS NEVER THE ANSWER
## Backlog row ALIVE-1. PEOPLE lane, 8/28/26.
## Gate: gates/alive_gate.js (16 claims, 0 red, 6 red on the mutation)
## Tab: RUN (walk out of the house and look)

---

## THE ROW

Paolo, 8/25 playtest dispatch, item 5:

> "I'M WALKING THROUGH THE CITY I THINK I SAW ONE WATCH PERSON ON ACCIDENT ...
> THE CITY SEEMS DEAD ASF AND I DONT LIKE THIS BEING THE DEFAULT I KNOW WE HAVE
> A SLIDER AND SHIT BUT YEAH MAN."

The row's own acceptance test is a sentence, not a head count: **"he walks one
block and sees somebody without hunting for it."** So the measurement walks.

---

## THE MEASUREMENT, AND IT IS WORSE THAN THE ROW SAYS

Thirty-two walks on the real demo build: eight starting points around the
spawn, four directions each, up to 800 steps per walk, counting every body the
surface actually blitted, and excluding the one authored neighbour who is
pinned to the spawn and would otherwise answer the question before it is asked.

```
dial  1  (what shipped)     0 of 32 walks met a single stranger
dial  8                     2 of 32
dial 20  (this)             6 of 32,  median 323 steps, closest 9
dial 26                     8 of 32,  median 261
dial 32  (the ceiling)      9 of 32,  median 261
frame cost across all of it     0.5 ms  ->  0.8 ms
```

**TWENTY-FIVE THOUSAND STEPS AT THE SHIPPED DEFAULT AND NOBODY IS THERE.**

And the one body he did see has id `12:12:900`, archetype **watch**. He said he
saw one watch person by accident. It is the same body.

---

## IT WAS NONE OF THE THINGS IT LOOKED LIKE

Each checked on its own, because guessing which one it is is how a week goes.

- **Not the draw path.** Stand two cells from any resident and they are drawn,
  three and four at a time.
- **Not the census.** The dial scales it exactly: 1, 9, 21, 29 people in the
  player's own block at dial 1, 8, 20, 28.
- **Not the hour.** Same result at 08:00, 13:00 and 18:00.
- **Not the draw budget.** It is 24 per neighbourhood at dial 1, against a
  census of 1.
- **And not performance**, which is the reason people usually give for keeping a
  world empty. Twenty-eight times the population costs 0.2 milliseconds.

---

## TWO PROBE MISTAKES, BOTH THE SAME CLASS, BOTH WORTH KEEPING

**1. A PROBE THAT CHANGES AN INPUT THE CACHE DOES NOT WATCH IS MEASURING THE
CACHE.** The first sweep moved the dial from 1 to 20 and got the identical
number five times. `PPL_PEOPLE` is keyed on the neighbourhood and busted only by
`rulesVersion()`; the dial does not clear it. Five clean-looking data points,
all of them the same cached list.

**2. I MEASURED AT THE EMPTIEST HOUR OF THE DAY AND ALMOST CONCLUDED THE
SCHEDULE WAS BROKEN.** 13:00 sits in the middle of the heat window, and the
heat rule is the one condition that fires every single day. At 13:00, 3 of 61
people are outdoors. At 10:00 it is 41 of 61.

---

## AND THE SCHEDULE WAS NEVER THE BUG. IT IS GOOD.

Measured across a full day, 61 people in the 3x3 the player wakes up in:

```
00-05    0% outdoors        asleep
06       5%
07      13%
08      48%
09      61%
10      67%   <- the fullest hour
11      54%
12      20%   the heat window opens
13       5%   <- the emptiest hour
14      11%
15      41%
16      59%
17      66%
18      54%
19-22    7%   dark, and the ones who stay in stay in
23       3%
```

That is a real day. The valley empties in the afternoon heat and comes back at
five, without anybody writing a schedule for a single person. The 7/31 address
book works. **Nothing here needed fixing and the next session should not go
looking.** That is why the shape is a gate claim now.

---

## WHAT SHIPPED

**1. THE DEFAULT COMES OFF THE MODULE'S OWN LANDMARK TABLE.**

The table has been in the file since 8/1: `nobody 0 / today 1 / scale 1.1 /
story 20`, where `story` is GDD v5's ~69,000 people, about 3% of the real
valley's 2.3M. The shipped default was `today`, ~4,194.

**His design document said 69,000 and his game shipped 4,194.** A live document
contradicted by live code is a bug, not a taste question, and the truth
hierarchy says so. The default is now `LANDMARK.story` **by reference**, never a
number typed in twice, so the table stays the one place it lives and he moves it
by naming a different landmark.

**2. THE ONES WHO ARE OUT STAND SOMEWHERE OPEN.**

`pplOutSpot` walked 4 to 10 cells from the doorstep in one fixed compass
direction and took **the first standable cell**, which on this world's scale
does not clear the plot: the side of the house, the gap between two walls, the
back yard. The ray now reaches far enough to leave the block, and stops at the
**most open** cell along it, where openness is counted rather than guessed (how
many of the 24 cells around a candidate are walkable; a street scores near 24, a
gap between two houses scores four).

**The direction is still theirs.** The 7/31 address book is what made these
people individuals, and its own words are "two people on identical schedules
walk opposite directions at the same hour, which is the whole of Ultima VII's
trick". Only the stopping point moved.

Measured on its own: 6 of 32 to 7 of 32. Small, real, and honest about being
small.

**3. TWO GATE CLAIMS REPOINTED, NOT EXEMPTED.**

`people_gate` E1 and `population_dial_gate` A1 both asserted *"the dial still
ships at 1, nothing moved until he moves it."* That was exactly right on 8/1.
On 8/25 he moved it, in his own words, and from that moment those two claims
were **gates demanding the bug he had complained about.** They held it for three
days.

A GATE MUST NEVER OUTRANK A RULING. Both now hold something strictly stronger:
the default must be one of the module's own named landmarks, so it can never
become a number somebody typed into the file.

---

## AND WHAT THIS DOES NOT FIX, WHICH IS THE IMPORTANT HALF

At the **top** of the slider, dial 32, about 96,885 people, more than his GDD
asks for: **9 of 32 walks meet somebody, and 23 still meet nobody.** Median 261
steps, which is a couple of city blocks.

The valley is roughly 151 square kilometres and a step is about a metre. Ninety
seven thousand people spread across that is one person per hectare. **No value
of this number makes a street feel inhabited, and the next session must not turn
this knob again and call the job done.** That sentence is printed by the gate on
every run.

**WHAT IS LEFT IS NOT A COUNT, IT IS WHERE.** Two leads, both already built and
both already his:

1. **The module already sorts people cluster / spread / loner** and the canon
   seed reports 13 clusters, 208 spread, 141 loners. The demo walks a SPREAD
   suburb. Survivors in a collapsed city cluster; ours are evenly smeared.

2. **THE AMBIENT ENCOUNTER DIRECTOR EXISTS, IS APPROVED, HAS A COYOTE IN IT, AND
   HAS NEVER FIRED FOR ANYBODY ON FOOT.** `engine/bohemia_encounters.js` is the
   12-item act-1 roster he approved on 7/26 ("Approve all") with the 70/20/10
   pacing package. It is wired into `stepOnce`'s **city branch**, which is
   overmap travel. The walked surface, which is the demo, never calls it. Same
   shape as every other organ this repo has found: finished, correct, and with
   nothing calling it.

And the research he was already handed says the same thing from the other side
(`records/BOHEMIA_RESEARCH_WHAT_LIVES_IN_A_CITY_OF_CORPSES_8_25_26.md`):

> "the reason the city feels dead is not that we lack enemies. It is that we
> lack ANIMALS. Ravens on a roofline, rats at a bin, a coyote crossing the wash
> three blocks away and not caring about you ... Tier 1 is mostly not an enemy
> system at all. It is set dressing that moves, and it is the cheapest fix on
> this list for the loudest complaint on his list."

**Ambience does not need a census.** Unlike a resident, a raven can be placed
near the player, so the valley's scale stops mattering. That is the next build
and it is named in the handoff.

---

## MUTATION

Putting the default back to `today` (1): **six claims red**, headline reading
`0 of 32 walks, 0 different people`.
