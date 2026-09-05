# DYNASTY STUDY -- DAY 2 (Q2): A COYOTE IN LAS VEGAS
# (DYNASTY lane, 9/5/26. MODE: RESEARCH -- nothing here is implemented.)
# VAMILY row: DYNASTY Q2 [coyote life], "A coyote in Las Vegas. The real
# ethology of urban coyotes (range, diet, how they read people, how they die)
# as the animal generation's actual life."
# Day 1: records/BOHEMIA_DYNASTY_DAY_1_WHAT_YOU_CAN_DO_WITH_NO_HANDS_9_5_26.md
# Names appear in SOURCES only, never in the design (the 8/28 law, see day 1 s0).

## 0. *** FIRST, A CORRECTION TO YESTERDAY, BECAUSE IT IS THE EXPENSIVE KIND ***
Day 1 measured "no renderer for a four-legged thing exists anywhere." **THAT
WAS FALSE.** `draw_beast` in tools/bohemia_wildlife_factory.py draws a
four-legged canid at 16x16 in three frames (rest / look / go), under the 45
degree law, and it is shared ON PURPOSE by the coyote and all three dogs
("a second generator for the same animal shape is how two things that should be
one drift apart"). Eight animals are baked in banks/BOHEMIA_WILDLIFE_SPRITES.js.
I searched for `drawCoyote`, `drawDog`, `drawRaven`, `drawAnimal`, `drawBird`,
`drawRat` and `drawQuadruped` -- **seven names I made up** -- got nothing, and
recorded an absence. CLAUDE.md has carried this exact lesson since 8/28 and I
paid it anyway.
> **WHEN YOU WRITE DOWN THAT SOMETHING DOES NOT EXIST, SAY WHERE YOU LOOKED.
> A CONFIDENT NEGATIVE IS THE MOST EXPENSIVE KIND OF WRONG, BECAUSE NOBODY
> RE-OPENS IT.**
The narrower claim that survives, and it is the one that matters: **there is no
coyote at the PLAYER'S scale and no facings.** The ambient animal is 16 pixels,
three frames, no direction; the player rig is 56 with eight facings. Gen 1 needs
a life stage and a rig pass, not a new animal. Day 1's record and its ROUTED row
are corrected in place.

## 1. THE REAL AISLE -- A COYOTE HAS TWO LIVES, AND THEY ARE NOT PERSONALITIES
This is the finding of the day and it is not a metaphor. The literature splits
every coyote population into **RESIDENTS** and **TRANSIENTS**, and the split is
measurable in one number:
```
RESIDENT   holds a defended territory with a mate and family group.
           mean home range measured at ~9 km2. territories have
           "very little overlap" and are defended.
TRANSIENT  holds nothing. mean home range measured at ~59 km2,
           SIX AND A HALF TIMES BIGGER, and it is not a bigger
           kingdom, it is homelessness with more walking.
```
Transients do not roam at random. They live in the **narrow, undefended zones
that exist between pack territories**, floating between resident families,
*"biding their time until a vacant territory opens."*
### HOW YOU BECOME ONE, AND HOW YOU STOP
Young coyotes leave at **nine to eleven months**, in **late October to January,
before the breeding season**, and a disperser may travel **fifty to a hundred
miles** looking for a vacant territory or a mate. Then it waits. It can join
another group if the breeding pair accepts it, or take empty ground when it
finds some. **Most die before they manage either.**
> **A TERRITORY IS NOT INHERITED. IT IS WAITED FOR.**
### AND THE PAIR BOND IS ABSOLUTE, WHICH NOBODY WOULD BELIEVE IF IT WERE WRITTEN
Genetic testing of **236 coyotes over six years** in the largest urban coyote
study ever run found **no polygamy at all** and **no coyote that ever left a
mate while that mate was alive**. The lead researcher's own words: *"I was
surprised we didn't find any cheating going on. Even with all the opportunities
for the coyotes to philander, they really don't."* The bond ends at death and
at nothing else. The proposed reason is not romance, it is labour: a city gives
a female big litters, and a big litter needs both parents.

## 2. *** THE ONE SENTENCE ***
> **A COYOTE'S LIFE IS ALREADY THE SHAPE OF THIS GAME: YOU ARE BORN ON GROUND
> YOU DO NOT OWN, YOU ARE SENT AWAY, YOU LIVE IN THE SEAMS BETWEEN OTHER
> PEOPLE'S TERRITORY UNTIL SOMEBODY DIES, AND WHAT YOU WIN IS A PLACE AND ONE
> PARTNER FOR THE REST OF YOUR LIFE.**
Nobody has to invent generation one's structure. It is measured, it is in the
literature, and **it is a dynasty already** -- ground, a pair, an heir who
leaves. It also arrives with a difficulty curve that needs no damage number:
the difference between the two lives is not strength, **it is how much ground
you have to cross and whether anywhere on it is safe.**
### AND OUR MAP IS ALREADY THE RIGHT SIZE FOR IT
Day 19 measured the valley at ~9.2 km across and ~151 km2, and a day of walking
at ~8.6 km. Against the ethology: a resident family holds ~9 km2, which is
**about 6% of our valley**, and a transient covers ~59 km2, which is **about
39% of it**. So the valley has room for roughly **sixteen coyote territories**,
and one homeless coyote walks over a third of the game. Nobody planned that and
it did not need planning: **the map is a market town's catchment (day 19) and a
market town's catchment is about sixteen coyote territories.**

## 3. THE CITY IS THE SAFEST PLACE A COYOTE HAS EVER LIVED, AND OURS IS SAFER
Four measured things, and every one of them is the opposite of the obvious:
- **Pup survival in a city runs up to 67%. In the rural Midwest it is 15%.**
  Nearly five times better. Adult annual survival in urban studies runs about
  0.62 to 0.74.
- **They do not eat our rubbish.** Urban coyote diet is rodents, rabbits, fruit
  and deer, much like the rural diet, and they *"generally avoid eating trash,
  even in urban areas."* There is a small drift toward human food in the most
  developed areas and that is all.
- **They move to the night to avoid us, not to hunt.** GPS work in metro areas
  finds up to **90% of movement between 10pm and 5am**, and the literature is
  explicit that the shift is about people rather than prey cycles.
- **The number one killer of an urban coyote is a car.** In cities vehicle
  collisions lead for young and old alike; in the countryside it is people
  shooting and trapping.
### *** AND THAT LAST ONE IS THE BOHEMIA-SPECIFIC PART ***
Our Las Vegas has almost no moving cars. **Take the traffic out and you have
deleted the leading cause of death of an urban coyote and replaced it with
nothing except people with guns.** So generation one's danger is not traffic,
not starvation and not the desert. **IT IS PEOPLE**, which is the game we
already have, and saying so costs no damage number at all.
### AND LAS VEGAS IS A REAL COYOTE CITY, WITH REAL ROADS FOR THEM
The valley is a bowl ringed by mountains on three sides, drained by washes and
flood channels that carry water and wildlife **into the middle of the city**,
ending in the Las Vegas Wash, which takes **more than 180 million gallons a day
of reclaimed water** and is described as a haven for mammals in the Mojave. Golf
courses are described as *"an all-inclusive resort"* for a coyote leaving the
far less hospitable open desert. **THE WASHES ARE THE COYOTE'S ROADS**, our own
8/25 bestiary research already said coyotes use them as corridors, and our
storm drains are already where the packs module dens them.

## 4. HOW THEY READ PEOPLE, AND IT IS A MEMORY RATHER THAN A TEMPER
The headline numbers are already in our repo (section 5). What day 2 adds is the
mechanism: **learning, not selection.** A coyote's response to a person is
shaped by what happened to it before -- coyotes that had been hand-fed needed
more hazing than coyotes with no history with people -- and over repeated
encounters the number of hazings a pair needed **went down**. The literature
also warns not to read a flight distance as habituation, because boldness,
aggression and risk-taking are different things wearing the same number.
> **A COYOTE'S BOLDNESS IS A MEMORY OF YOU.**
Which is day 16's shadow of the future in an animal: because Bohemia never
resets, the coyote you scared last week is the coyote in front of you.

## 5. THE MEASUREMENT -- WHAT WE ALREADY HAVE, AND IT IS MORE THAN I EXPECTED
Say the good part first, because I got the last one wrong by not looking.
**THE COYOTE IS ALREADY THE BEST-RESEARCHED ANIMAL IN THIS REPO.** The packs
module already carries, in its own comments and its own data:
- the Edmonton field study **verbatim**: 120 volunteers, 71 neighbourhoods,
  1,598 patrols, coyotes seen at all on about **11%** of walks, retreating
  before 40 m in **71%** of observations and immediately from **96%** of hazing
  events, shipped as `backDown: 0.956` with the right reading of it: *"ONE IN
  TWENTY-THREE DID NOT BACK DOWN. That is the encounter."*
- non-overlapping defended ground, as real code: `spacing: 140` against the
  dogs' 26, with the stated intent *"you meet dogs often and coyotes seldom."*
- `notice: 40`, the measured metres, *"because for a coyote the point is that
  it clocked you long before you saw it."*
- **the den, and it is already Las Vegas**: dry culverts and storm drains, about
  half of studied dens in human-built structures, *"and Las Vegas has the storm
  drains"*, plus the correct biology that **coyotes den only for pupping**, and
  the consequence that the 4% which does not back down is **100% at a den**.
- one shared four-legged sprite for the coyote and the dogs, on purpose.
- and not one health, damage or armour number on the page, with a gate that
  greps for that.
**NOTHING IN SECTION 1 CONTRADICTS ANY OF IT.** Everything above is a life
stage the file has not been asked about.

## 6. *** THE FINDING THAT PROVES US WRONG ***
### WE SHIPPED BOTH HALVES OF THE COYOTE'S LIFE AND NEVER NOTICED THEY WERE THE SAME ANIMAL
Two modules, two coyotes, and read side by side they look like a contradiction:
```
engine/bohemia_wildlife.js   id 'coyote'   flock [1,1]  -- ALWAYS EXACTLY ONE
                             dawn and dusk only, wide open ground,
                             alert 0, flush 0, reacts:FALSE
                             "crossing, and it has already decided you are
                              not worth it"
engine/bohemia_packs.js      id 'coyotes'  size [2,6]   -- A FAMILY
                             spacing 140, defended non-overlapping ground,
                             a den, notice 40
                             "it clocked you long before you saw it"
```
One coyote that ignores you, and a group that clocks you at forty metres. As
content rows that is two mechanisms that both mean "coyote", which is the ONE ID
ONE WHOLE PERSON mistake with a different noun. **BUT AGAINST THE LITERATURE
BOTH ARE EXACTLY RIGHT, AND THEY ARE THE SAME ANIMAL AT TWO POINTS IN ITS
LIFE.** The lone one crossing open ground and *going somewhere* is **A
TRANSIENT**. The spaced group with a den is **A RESIDENT FAMILY**. Two lanes,
working from the same sourced research on different days, built the whole life
cycle of the animal and shipped it as two unrelated tiers.
> **NOTHING IN THE GAME SAYS THE LONE ONE IS TRYING TO BECOME THE GROUP.**
This is not an engine-sync bug and the fix is **not** to delete one of them.
**IT IS THE GENERATION ONE DESIGN, ALREADY IN THE BUILD, MISSING ONE SENTENCE.**
It also corrects day 1's own routing a second time: I proposed a row for a body
that does not exist. The body exists, **and now the structure turns out to exist
too. The missing thing was never material. It was the line between two rows.**

### AND ONE SMALL REAL MISMATCH, WHICH IS NOT MINE TO FIX
Our ambient coyote is **dawn and dusk only** and `reacts:false`. The measured
urban coyote is a **night** animal (up to 90% of movement 10pm to 5am,
specifically to avoid people) that **retreats 71% of the time before forty
metres** -- and our own packs module holds those very numbers one file away.
The dawn/dusk window is the **desert** pattern, and the module says so in its
own comment (*"dawn and dusk are when the desert moves"*), which is true of the
Mojave and not of a city. A coyote that never reacts is a rural coyote. Small,
correctable, and it belongs to the lane that owns those files.

## 7. WHAT WE TAKE AND WHAT WE REFUSE
**TAKE**
- **The two lives, and the number between them.** Resident ~9 km2, transient
  ~59 km2. That is generation one's whole difficulty curve with **no damage
  number**: not stronger enemies, **more ground and nowhere safe on it.**
- **The seam.** Transients live in the undefended strips between territories,
  and **our valley already computes seams** -- LIGHT=TERRITORY is live code,
  every circuit carries an owner, and the game already works out where owners
  meet. Generation one walks the seams of the map generation two will fight
  over, which is the cheapest possible link between the two lives.
- **Dispersal as the shape of act one.** You do not begin as a loner. You begin
  at home, and at nine to eleven months you are sent away.
- **The pair bond, unedited.** One partner, ending only at death. Measured, not
  sentimental, stronger than any romance system anybody would design, and it
  does the dynasty's job for free: generation two has **one named other
  parent**, not a menu.
- **A territory is a vacancy.** You get ground because somebody stopped holding
  it. Day 6's turf and day 16's repeated game in a single verb.
- **The washes as roads**, which is real, local, and already in our notes.
- **Boldness as a memory of you.**
**REFUSE**
- A hunger meter, a thirst meter, or a stamina bar the player manages. Day 7,
  day 23 and day 1 all land there, and a desert is not an exemption from that
  rule, **it is the temptation that rule exists for.**
- **Rubbish as the coyote's food.** The research says they avoid trash even in
  cities, and a rummage-the-bins loop is exactly the boring animal game day 1
  refused.
- A coyote that is a monster. Our own files already refuse this correctly, and
  the one in twenty-three that does not back down is the entire encounter.
- **Raising a litter as a checklist.** The animal-sim genre is built on "grow
  up, find a mate, have young, raise them", which is precisely where a life
  turns into chores. That risk belongs to Q7 and I am flagging it, not solving
  it here.
- **Inventing Las Vegas coyote numbers.** The urban ethology is Chicago and
  Edmonton; Clark County gives the place and the washes. I could not reach any
  GPS-collar study of a Las Vegas coyote, and I am not going to write one.

## 8. ROUTED (proposals for the coordinator -- only the coordinator adds jobs)
- **PEOPLE -- THE-COYOTE-IS-ONE-ANIMAL.** The lone dawn coyote and the spaced
  family are one life. Say so in the two files that already hold both halves,
  and correct the ambient row's night window while there. No new content, no
  new art, no new numbers.
- **WORLD -- THE-SEAM-IS-WHERE-YOU-LIVE.** The undefended strip between two
  owners is a real place with a name, computed from the ownership map we
  already have. Serves gen 1 directly and BB-TURF afterwards.
- **COOK / CHARACTER -- A-COYOTE-AT-THE-PLAYER'S-SCALE.** Replaces day 1's
  row. The 16x16 three-frame body is good and stays; what is missing is the
  same animal at the rig's scale with eight facings, under the 9/4 compare law
  and the 8/28 every-angle law.
- **DYNASTY (this lane).** Q3 [heir keeps] now has its sharpest input: a
  territory is a vacancy, not an inheritance. Q7 [family arrives] owns the
  litter-as-chore risk named above. Q11 [lasting death] gets the pair bond that
  ends only at death.

## 9. CONFIDENCE
- Resident ~9 km2 versus solitary ~59 km2; transients in undefended zones
  between territories; dispersal at 9-11 months in late October to January;
  50-100 mile dispersal; joining a group or taking empty ground: peer-reviewed
  and extension literature, several sources agreeing. **HIGH.**
- 236 coyotes, six years, zero cheating, no mate left while alive: a widely
  reported genetic study, consistent across every write-up I read. **HIGH** on
  the result. The "big litters need two parents" explanation is the
  researchers' interpretation, **MEDIUM**, and the design does not need it.
- Urban pup survival up to 67% versus 15% rural, adult annual survival
  0.62-0.74, vehicles as the leading urban cause of death: **HIGH** on
  direction and **MEDIUM** on the exact figures, which vary a lot by study
  (one gave 13.5% vehicle mortality, another 40%). I have used the ranking, not
  a single number.
- Up to 90% of movement between 10pm and 5am: reported from GPS work; the
  direction of the effect is solid across sources, the exact percentage is
  **MEDIUM.**
- Diet dominated by rodents, rabbits and fruit with trash avoided: **HIGH.**
- Learning rather than selection driving boldness, and hazing frequency falling
  over time: peer-reviewed. **HIGH.**
- Las Vegas washes and flood channels as wildlife corridors into the city, the
  bowl geography, 180+ million gallons a day: local reporting plus Clark County
  material. **MEDIUM-HIGH.**
- The Edmonton numbers: **QUOTED FROM OUR OWN REPO**, where a previous lane
  already sourced them. I could not open the journal page directly (the network
  proxy blocks that host) and I have not re-verified them independently, so they
  are trusted at the level our own file trusts them.
- Everything in sections 0, 5 and 6 about our own code: **MEASURED** today.
- Sections 2, 6's argument, 7 and 8: **MINE.**
- The games-aisle search for criticism of family-raising loops in animal sims
  returned nothing usable. I have said that rather than padding around it, and
  the litter-as-chore risk is flagged as a risk, not asserted as a finding.

## SOURCES
NAMED AS RULERS, NOT AS REFERENCES. REAL AISLE: the long-running Cook County
urban coyote study (home ranges of 9 km2 for packs against 59 km2 for solitary
animals; the 236-coyote six-year genetic monogamy result; vehicles as the
leading urban cause of death; urban pup survival against rural). Peer-reviewed
work on resident and transient space use, and on early life experience and
dispersal in coyotes. Work on urban coyote nocturnality and on diet composition.
Peer-reviewed work on hazing, boldness and learning, including the Edmonton
volunteer-patrol study our packs module already cites. Clark County and Las
Vegas Valley material on the washes, flood channels, the Las Vegas Wash and its
reclaimed-water flow, and local reporting on coyotes in the valley.
IN-REPO: engine/bohemia_wildlife.js (SPECIES, the coyote row);
engine/bohemia_packs.js (KINDS, spacing, notice, backDown, the den, the shared
sprite); tools/bohemia_wildlife_factory.py (`draw_beast`, DRAW);
banks/BOHEMIA_WILDLIFE_SPRITES.js (8 animals, 3 frames, 16x16);
records/BOHEMIA_RESEARCH_WHAT_LIVES_IN_A_CITY_OF_CORPSES_8_25_26.md; day 1 of
this study; and days 6, 7, 16, 19 and 23 of the BB study.
