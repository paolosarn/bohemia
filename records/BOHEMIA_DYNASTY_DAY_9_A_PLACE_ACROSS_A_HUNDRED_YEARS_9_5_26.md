# DYNASTY STUDY -- ROUND 9 (Q9): A PLACE ACROSS A HUNDRED YEARS
# (DYNASTY lane, 9/5/26. MODE: RESEARCH -- nothing here is implemented.)
# VAMILY row: DYNASTY Q9 [century town], "A place across a hundred years. Real
# succession of a town (what stays, what is renamed, what is forgotten) for the
# century rule and for Act 3's city."
# Rounds 1-8: records/BOHEMIA_DYNASTY_DAY_1..8_*.md (round 6 carries a
# correction written in round 7: I published a false negative there.)
# Game titles appear in SOURCES only, never in the design, and never attached to
# a department they do not own (the 8/28 law as amended 9/5).

## 1. THIS ROW IS THE COMMISSION HIS OWN LAW ASKED FOR
THE CENTURY RULE (7/26, LOCKED), verbatim:
> *"dynasty building choices COMPOUND across the three acts (~100 years).
> Neglect production/power/clout and act three's city is visibly POORER; invest
> and it's visibly rebuilt. The city is the game's long memory. **Mechanism to
> be designed (research commissioned)**; numbers are Paolo's when the mechanism
> is ruled."*
So this round is not adjacent to a law, it **is** the research that law asked
for, and the sentence to hold onto is his: **the city is the game's long
memory.** Round 8 found that in a person, memory lasts about three generations
and then only what was built survives. Round 9 is that same clock, in a place.

## 2. THE REAL AISLE -- A TOWN DOES NOT CHANGE AT ONE SPEED. IT CHANGES AT THREE.
The morphological reading of towns, built on a century of survey work, splits a
place into layers that persist at **very different rates**:
```
THE STREET PATTERN   the most persistent thing in a town by a long way.
                     Old street systems stay legible for centuries and act as a
                     framework that keeps steering how everything after them is
                     built. This is the skeleton.
THE PLOTS            the boundaries between one holding and the next. Slower
                     than buildings, faster than streets. New building keeps
                     getting shaped by lines nobody remembers drawing.
THE BUILDING FABRIC  turns over in decades. This is the part that looks like
                     "change" and is actually the shallowest layer.
THE USE              what a building is FOR. The least resistant of all: it can
                     flip without a brick moving.
```
> **THE THING THAT LASTS A HUNDRED YEARS IS THE SHAPE. THE THING THAT CHANGES
> FASTEST IS WHAT THE ROOMS ARE FOR.**
That is the exact inverse of how a game would instinctively model it. A game
changes textures and leaves the map alone. In life the map is the part that
cannot be changed and the meaning is the part that changes constantly.

## 3. *** THE ONE SENTENCE ***
> **A HUNDRED YEARS LEAVES THE STREETS EXACTLY WHERE THEY WERE, REPLACES ALMOST
> EVERY BUILDING ON THEM, KEEPS NINE NAMES IN TEN, AND FORGETS WHAT EVERY ONE OF
> THOSE NAMES WAS FOR.**

## 4. WHAT ACTUALLY GETS RENAMED, AND IT IS FAR LESS THAN ANYONE GUESSES
Quantitative work on cities that went through a total political rupture, which
is the closest real analogue to a valley that lost its state:
```
Bucharest      288 of 4,369 streets renamed        6.59%
Sibiu           39 of   507 streets renamed        7.69%
Brasov                                             8.20%
Cluj-Napoca                                       12.40%
Timisoara      the outlier, the highest measured   25.99%
```
**A regime falls and roughly nine street names in ten survive it.** And the ones
that go are not random: the predictors are **how politicised the name was** and
**how central and how large the street is.** The main square changes. The lane
behind it does not.
> **RENAMING IS EXPENSIVE, SO IT HAPPENS AT THE FRONT AND NOT AT THE BACK.
> WHICH MEANS A CENTURY LATER THE CENTRE OF TOWN IS NAMED AFTER WHOEVER WON,
> AND THE SIDE STREETS ARE STILL NAMED AFTER PEOPLE NOBODY CAN PLACE.**
That is the forgetting, and it is more interesting than deletion: the name
survives and the reason for it does not.

## 5. THE MEASUREMENT
- **THE PLAN IS FIXED, AND FOR THE WRONG REASON.** The architecture is
  `world = f(seed, choiceLog)`, so the street layout is regenerated
  deterministically from the seed. That gives us the right answer -- the plan
  does not move across a century -- **by accident rather than by design**: it is
  fixed because we regenerate it, not because it persists.
- **A DISTRICT'S ENTIRE HUNDRED-YEAR LIFE IS ONE NUMBER WITH THREE STOPS.**
  `districtTexture` is the **only** reader of `invest` anywhere in the engine or
  the walked city:
```js
  invest <= 0 -> 'apocalypse'
  invest <  5 -> 'recovering'
  else        -> 'modern'
```
  and round 4 measured that `invest` is written with `+=` and never decreases.
- **STREETS HAVE NO NAMES.** There is no street name anywhere in the engine.
- **AND THE FACTION WHOSE WHOLE JOB IS REMEMBERING ALREADY EXISTS AND HAS
  NOTHING TO REMEMBER.** The Remnants' own approved barks, shipped:
  *"This was a real city. I don't mean big. I mean real."*
  *"We kept the records. Somebody's going to want them."*
  *"Somebody has to remember what the street names were."*
  **A faction is standing in our valley asking somebody to remember street names
  in a game that has never had one.**

## 6. *** THE FINDING THAT PROVES US WRONG ***
### THE CODE CANNOT OBEY HALF OF HIS OWN LOCKED LAW
The century rule has two directions in one sentence: *"Neglect ... and act
three's city is visibly POORER; invest and it's visibly rebuilt."*
`invest` only ever accumulates, and `districtTexture` only ever climbs. So:
```
"invest and it's visibly rebuilt"      -> BUILDABLE TODAY
"neglect and it's visibly poorer"      -> ARITHMETICALLY IMPOSSIBLE TODAY
```
> **WE BUILT THE HALF OF THE CENTURY RULE THAT REWARDS AND NOT THE HALF THAT
> COSTS, AND NOBODY NOTICED BECAUSE THE HALF WE BUILT IS THE ONE YOU SEE WHEN
> YOU ARE PLAYING WELL.**
### AND THE PATTERN FROM ROUND 8, CONFIRMED IN A SECOND PLACE
Round 8: the monument, the only thing that outlives spoken memory, is **three
strings** from two numbers. Round 9: a district, the thing that carries a
hundred years of a place, is **three textures** from one number that only rises.
> **EVERY PERMANENT THING IN THIS GAME IS THREE-VALUED. THE STUFF THAT FADES IS
> MODELLED IN FINE GRAIN AND THE STUFF THAT LASTS IS A SWITCH WITH THREE
> POSITIONS.**
### AND THE THIRD ONE, WHICH IS FREE
The Remnants already are the cultural-memory faction, in his own approved words,
and round 8 said cultural memory is the half we never built. **The faction and
the mechanism were designed by two different lanes, on different days, for the
same idea, and neither knows about the other.** Sixth round of this lane finding
the same shape.

## 7. WHAT WE TAKE AND WHAT WE REFUSE
**TAKE**
- **Three speeds, not one.** The plan does not move; the buildings turn over;
  what a place is FOR changes fastest of all. Our act-texture progression law
  already graduates the skins, so the fabric layer is half-built; the layer
  nobody has touched is **use**, which is the cheapest to change and the most
  legible.
- **Neglect has to be expressible.** Not a punishment, a direction. Round 4 said
  a ratchet is a bug in a hundred-year machine; his own law says the same thing
  in his own words. This is the same row from a third angle.
- **Nine names in ten survive, and the reason for them does not.** That is the
  forgetting worth building: not a deleted name, a name nobody can explain.
- **Rename the middle, never the edge.** Centrality and politicisation are the
  measured predictors, so the square changes hands and the back lane does not.
- **The Remnants as the people who hold what the machine forgets.** They already
  say it. Give them something to be right about.
**REFUSE**
- **Changing the street plan across acts.** It is the most persistent layer in
  life and it is seed-fixed in our engine; making it move would be wrong twice.
- **A decay number on a timer.** The law says neglect, which is a player's
  choice not to act, and day 7 killed anything that drains while you watch.
- **Renaming everything at a regime change.** The measured range tops out at
  about a quarter of streets and usually sits under a tenth.
- **Inventing a single street name, district name, or what the Remnants kept.**
  Contents are his. This round supplies layers and rates, not one noun.
- **A fourth texture tier.** Three is not the problem; three read off ONE
  MONOTONIC NUMBER is the problem.

## 8. ROUTED (proposals for the coordinator -- only the coordinator adds jobs)
- **WORLD -- THE-CENTURY-RULE-ONLY-GOES-UP.** His locked law asks for visibly
  poorer and the code cannot express it. Same underlying fix as round 4's
  ratchet and round 3's misplaced decay: **one row, now with a law quoting
  itself as the reason.**
- **WORLD or LIFE+CITY -- WHAT-A-PLACE-IS-FOR.** Use is the fastest-changing
  layer in the real research and the one we have never modelled. Cheaper than
  new art, because it changes meaning rather than pixels.
- **FACTIONS or WORDS -- THE-REMNANTS-KEPT-THE-NAMES.** The faction already
  claims to remember the street names. Making that true is a words-and-content
  job on an existing faction, not a new system.
- **DYNASTY (this lane).** Q10 [final act] is next on the board. Q12 [heir's
  hour] inherits section 4: the heir should meet a name nobody can explain.

## 9. CONFIDENCE
- Section 5, `districtTexture` being the only reader of `invest`, the absence of
  street names, the seed architecture, and the three Remnants barks quoted
  verbatim: **MEASURED** today. Scope stated after round 6's false negative: I
  searched the engine and the walked city for readers of `invest` and for street
  naming; I did not sweep every slice, so the honest claim is that these are
  what I found and where I looked.
- The century rule quoted in section 1: **VERBATIM** from the locked addendum.
- The persistence hierarchy (plan, then plots, then fabric, then use): a
  long-established framework in urban morphology with a large literature.
  **HIGH** as a framework. It is a qualitative ordering, not a measured rate,
  and I have not put numbers on it because the sources do not.
- The renaming percentages: from quantitative studies of specific Romanian
  cities. **HIGH for those cities**, and explicitly **NOT a universal rate** --
  five cities in one country after one particular rupture. I have used the
  ordering (most names survive; the political and central ones go) rather than
  any single figure, because that is the part the papers actually argue.
- Sections 3, 6, 7 and 8: **MY ARGUMENT AND MY ROUTING.**

## SOURCES
NAMED AS RULERS, NOT AS REFERENCES, AND NONE IS A REFERENCE GAME FOR ANY
DEPARTMENT. REAL AISLE: Conzenian urban morphology and town-plan analysis on the
hierarchy of persistence between street pattern, plot pattern, building fabric
and land use; quantitative critical-toponymy studies of post-socialist street
renaming in Bucharest, Sibiu, Brasov, Cluj-Napoca and Timisoara. IN-REPO:
laws/BOHEMIA_ADDENDUM_THREE_CURRENCIES_CENTURY_7_26_26.md (the century rule,
quoted); laws/BOHEMIA_ADDENDUM_ACT_TEXTURE_PROGRESSION_7_10_26.md;
engine/bohemia_engine.js (`districtTexture`, `invest`, `world = f(seed,
choiceLog)`); engine/bohemia_people.js (the Remnants' barks); and rounds 3, 4
and 8 of this study.
