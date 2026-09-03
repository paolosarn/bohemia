# BB STUDY — DAY 8: WHAT YOU USED TO BE
# (coordinator, on his trigger. Days 1-7: records/BOHEMIA_BB_STUDY_DAY_*.md)
# THE LAST BIG BB SYSTEM NOBODY HAD OPENED: THE ROSTER.

## 0. THE QUESTION
Day 7 found the motor. This is the thing the motor is FOR: **who are the
people?** In the game he named, the answer is a single field, and it is
the most quietly load-bearing thing in the whole design.

## 1. IN BB, THE BACKGROUND *IS* THE CHARACTER
Every man is a former job. Not a class, not an archetype: a JOB, from
before he picked up a spear.
> *"Character backgrounds define a character's story, his starting
> attributes and equipment, and also determine what kind of traits a
> character can get and **open up specific events and dialog choices**."*
One field carries: what he is good at, what he costs to hire, **his daily
wage** (day 7's motor), how much he eats, what he can be given, what
traits he can develop, and **which events and conversations exist for
him.** A daytaler costs 6 a day. A cripple costs 3 and is worse at
everything.
### AND THE STORY ENGINE IS IN THE VARIANCE, NOT THE AVERAGE
The cheap backgrounds — the labourer, the farmhand, the brawler — have
**WIDE stat ranges**. A lucky roll on a daytaler hands you a front-liner
who rivals a professional sellsword at a fraction of the wage.
**THAT IS WHERE "THE BEGGAR WHO BECAME A LEGEND" COMES FROM.** Not from
writing. From a cheap unpredictable tier sitting next to an expensive
reliable one, so the player finds the story themselves.

## 2. THE MEASUREMENT, AND IT IS THE STARKEST NUMBER IN EIGHT DAYS
Our identity layer (`engine/bohemia_people.js`, 7/31) is real and it is
good: a PERSON is an identity, a BODY is an agent, and identity is
**DERIVED, never stored** — the same (blockSeed, house, slot) resolves to
the same human on any device, on any load, forever. It carries his 7/31
YOU HAVE TO ASK ruling: nobody has a name until you ask for it, and then
they keep it.
**AND HERE IS THE WHOLE OCCUPATIONAL VOCABULARY OF LAS VEGAS:**
```
var ROLE_WORDS = { worker:'WORKER', scav:'SCAVENGER', keeper:'KEEPER', watch:'WATCH' };
```
**FOUR WORDS.** Verified on the walked surface. Against a roster system
whose entire point is that a man is a specific former life.
**AND NOBODY HAS A PAST AT ALL.** There is no former trade, no "used to
be", no history field anywhere. Positive control, stated because it
nearly fooled me: `background` appears 115 times in the walked city and
**every one of them is CSS** (`background`, `backgroundColor`). `job`
appears 167 times and every one is the DAY'S JOB — `jobSite`, `jobCell`,
`jobsNear` — a place to work, never a trade somebody has.
**SO: A PERSON IN THIS VALLEY IS ONE OF FOUR THINGS, AND HAS ALWAYS BEEN
THAT THING.** Ten years after the world ended, nobody used to be anybody.

## 3. THE OTHER AISLE, PART ONE — WHO ACTUALLY LIVED HERE
This is the part that makes the feature Bohemia's instead of generic, and
it is real data about the real city.
- **LEISURE AND HOSPITALITY WAS ~29% OF ALL NONFARM EMPLOYMENT** in the
  Las Vegas metro. Not a large sector. **THE** sector, by a mile.
- **370,000+ hospitality jobs in Clark County.**
- The top employers list is casino properties, one after another.
**SO THE VALLEY'S SURVIVORS ARE NOT A RANDOM DRAW OF HUMANITY. Something
close to a third of them worked in hospitality, and most of the rest
served the people who did.**
### *** AND THE INVERSION THAT FALLS OUT OF IT, WHICH IS THE BEST IDEA IN
### THIS RECORD: THE FRONT OF HOUSE IS USELESS AND THE BACK OF HOUSE RUNS
### THE VALLEY. ***
A blackjack dealer's trade died with the money. A concierge's died with
the guests. But **a Strip casino is not a building, it is a small city**,
and the same industry employed the people who ran it: industrial
laundries moving tons a day, kitchens feeding tens of thousands, boiler
and chiller techs, high-voltage electricians, water treatment and pool
plant, refrigeration, locksmiths, security, logistics docks, and the
people who know where the deep dry stores are.
**EVERY ONE OF THOSE IS NOW THE MOST VALUABLE PERSON IN THE VALLEY**, and
we already made the dry stores canon — `engine/bohemia_economy.js` says
the deep casino dry stores are *the reason downtown matters.*
**WE BUILT THE BUILDING AND NEVER ASKED WHO USED TO WORK IN IT.**

## 4. *** THE FINDING THAT CHALLENGES WHAT WE BELIEVE ***
The obvious way to copy BB is to make a background a **STAT PACKAGE WITH
A NAME**. We cannot do that anyway (NO DAMAGE BEFORE THE DIAL), and the
research says we should not want to.
- **55% of American workers, and 70% of college graduates, derive their
  self-identity from their job.** When somebody asks what you do, they
  are asking who you are.
- Losing the work role is a **status passage** that directly disrupts a
  person's ability to hold a consistent picture of themselves.
- And the behaviour that matters most for us: **people who lose a job
  build an alternative work identity rather than call themselves
  unemployed.** They stay a consultant, a student, a something. **THE
  OCCUPATIONAL IDENTITY OUTLIVES THE OCCUPATION.**
### SO THE FINDING IS THIS:
**A BACKGROUND IS NOT WHAT SOMEBODY CAN DO. IT IS WHAT THEY STILL THINK
THEY ARE.** Ten years after the collapse, in a city where a third of
everybody worked hospitality, the valley is full of people who still
introduce themselves by a job that has not existed for a decade. The pit
boss who still runs a room that way. The line cook who still calls out
tickets to nobody. The valet who still parks the cars that never move.
**THAT IS FUNNY AND SAD IN THE SAME BREATH, IT IS TRUE, AND IT COSTS
NOTHING** — it is a WORD on a person, not a number on a stat block.
**AND IT MEANS THE FEATURE SHIPS UNDER EVERY LAW WE HAVE.** No damage, no
dial, no balance table. Same shape as day 7's unlock: the useful half of
BB's system is the half that needs no numbers.

## 5. AND IT PLUGS A HOLE THE PEOPLE LANE ALREADY DOCUMENTED AND COULD
## NOT FILL
From `engine/bohemia_people.js`, counted across every canon quest:
> *"faction=X — 53 uses — THE WORLD CAN ANSWER THIS. ~60 other predicates,
> 1 use each: keeps_the_tunnel, reads_the_sky, found_the_stairwell,
> speaks_for_the_crew... The one-off predicates are the quest DESCRIBING
> THE PERSON IT NEEDS, and **nothing in the sim computes** [them]."*
**SIXTY TIMES, A QUEST HAS ASKED FOR SOMEBODY BY WHAT THEY CAN DO, AND
THE VALLEY HAS HAD NO WAY TO ANSWER.** Because the only dimension a
person has is which outfit they run with, and four role words.
**A FORMER TRADE IS EXACTLY THE MISSING DIMENSION.** "Reads the sky" is a
pool tech or a groundskeeper. "Keeps the tunnel" is somebody who worked
the service level. Not all sixty, and it must never be stretched to fake
a hit — but a real fraction of them get an honest answer for the first
time, and the quests that have been unplaceable become placeable.

## 6. WHAT WE TAKE, AND WHAT WE REFUSE
**TAKE:** every person carries what they USED TO BE, derived from the
same three numbers their identity already comes from, so it costs no
storage and survives every load; the mix is weighted to the real city, so
hospitality dominates and the back of house is the valuable half; a
former trade opens LINES and EVENTS that would not otherwise exist; and
it answers the quest predicates nothing could answer.
**REFUSE:** a background as a stat package (no numbers, and the research
says it is the shallower reading anyway); a trade that makes somebody
mechanically better at fighting — that is the dial and it is his; sixty
trades cooked at once, because COVERAGE BEATS COUNT and we have measured
what a big undifferentiated batch does to his keep rate; and any of it
that reopens the language work, which he capped on 8/26 and which is
FINISHED.

## 7. ROUTED
- **PEOPLE — BB-WHAT-YOU-WERE.** Every derived person gets a FORMER TRADE
  beside their current role, derived from (blockSeed, house, slot) like
  everything else in that module, weighted to the real Las Vegas mix
  (hospitality dominant, back-of-house the useful half). It is a WORD, not
  a stat. WHO the named people are stays HIS.
- **WORDS — BB-STILL-SAYS-IT.** A person's lines key off what they used
  to be, not only which outfit they run with. The occupational identity
  outlives the occupation, so the pit boss still runs the room that way.
  Voice card applies; nobody in Bohemia is wise; `draft:true`; and the
  8/26 language cap is not reopened by this.
- **QUESTS — BB-PREDICATE-ANSWER.** Use the former trade to answer a
  fraction of the ~60 one-off role predicates that nothing in the sim can
  currently compute. NOTHING IS RELAXED TO MAKE A HIT: no honest match
  still means NULL, per that module's own rule.
- **WORLD — BB-BACK-OF-HOUSE.** The casino is a small city: laundry,
  kitchens, boilers, chillers, water and pool plant, docks, dry stores.
  The economy module already makes the dry stores the reason downtown
  matters; the machines that fed them are not there yet. This is also
  where day 7's supply lines and day 6's territory meet.
**RUNNING ORDER:** behind the demo like the rest, EXCEPT that
BB-WHAT-YOU-WERE is a one-field addition to a module that already derives
everything, and it unblocks two other rows. If a lane has a spare turn,
that is the one.

## 8. CONFIDENCE
- The four role words, the absent past, and the CSS/`jobSite` false
  positives: **MEASURED** in `engine/bohemia_people.js` and the walked
  surface, with the positive control stated.
- The ~60 uncomputable predicates and the 53 faction uses: quoted from
  the people module's own counted note, not re-counted by me. **HIGH**,
  and flagged as second-hand within our own repo.
- BB's background definition and the wide-range cheap tiers: wiki and
  player discussion, consistent; the developer blog is proxy-blocked here
  and was NOT read. **MEDIUM-HIGH.** I did not find an authoritative total
  count of backgrounds and I am not going to invent one.
- The ~29% leisure-and-hospitality share and 370,000+ jobs: regional
  economic reporting and workforce sources. **HIGH.**
- The identity research (55%/70% self-identity from work, role loss as
  status passage, building an alternative work identity): published
  psychology, consistent across sources. **HIGH.**
- §3's front-of-house / back-of-house inversion, §4's conclusion, §6 and
  §7: **MY ARGUMENT AND MY ROUTING.** The casino-as-small-city claim is
  ordinary industry knowledge, not a cited study.

## SOURCES
Battle Brothers wiki (Character Backgrounds) and Steam gameplay
discussions on backgrounds defining story, attributes, equipment,
available traits and dialogue, on daytaler and cripple wages, and on
cheap backgrounds having wide attribute ranges. UNLV Center for Business
and Economic Research and Nevada workforce material on leisure and
hospitality as ~29% of Las Vegas metro nonfarm employment; Las Vegas
Convention and Visitors Authority on 370,000+ hospitality jobs in Clark
County; Clark County top-employer listings. Price, Friedland & Vinokur,
"Job Loss: Hard Times and Eroded Identity", and the job-loss/role-loss
literature on status passage and on constructing an alternative work
identity; Gallup on the share of workers deriving self-identity from
their job. IN-REPO: engine/bohemia_people.js (the identity layer,
ROLE_WORDS, the casting note and its predicate count),
engine/bohemia_economy.js (the deep casino dry stores),
slices/BOHEMIA_CITY_WORLD.html, laws/BOHEMIA_ADDENDUM_YOU_HAVE_TO_ASK_
7_31_26.md, laws/BOHEMIA_ADDENDUM_ENOUGH_IS_ENOUGH_ON_THE_SPANISH_
8_26_26.md, and days 1-7 of this study.
