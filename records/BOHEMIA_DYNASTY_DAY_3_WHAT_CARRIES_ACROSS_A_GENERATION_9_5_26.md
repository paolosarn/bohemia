# DYNASTY STUDY -- ROUND 3 (Q3): WHAT CARRIES ACROSS A GENERATION
# (DYNASTY lane, 9/5/26. MODE: RESEARCH -- nothing here is implemented.)
# VAMILY row: DYNASTY Q3 [heir keeps], "What carries across a generation. In the
# best games with inheritance, what the heir keeps, what they lose, and which of
# it the player actually cares about. Against our fold maths (selectHeir exists,
# unused)."
# Rounds 1 and 2: records/BOHEMIA_DYNASTY_DAY_1_*.md, _DAY_2_*.md
# (The file names say DAY because that is the records convention from the BB
# study. The front page is explicit that a research round is ONE VAMILY and not
# a calendar day, and that it is never called a day to Paolo.)
# Names appear in SOURCES only, never in the design (the 8/28 law).

## 1. THE MEASUREMENT FIRST, BECAUSE THE WHOLE ROUND TURNS ON IT
Our fold is `foldGeneration` in engine/bohemia_engine.js. It folds exactly
**eight** kinds of thing, and this is the complete list:
```
standing    factionId -> how a faction feels about the dynasty
territory   districtId -> who owned it at the handoff
build       buildingId -> tier
economy     currency -> productive capacity carried
invest      districtId -> accumulated investment score
karma       one number
virtue      virtue -> value
family      marry / child / sibling_child / death / heir, plus wound
```
And exactly **one** of the eight decays across a generation:
```
const STANDING_DECAY_TO_NEUTRAL = 0.25;
  // "a generation of no maintenance softens ties 25% toward 0 (tunable)"
inh.standings[f] = inh.standings[f] * (1 - STANDING_DECAY_TO_NEUTRAL);
```
**Territory, builds, economy capacity, investment, karma and virtues carry at
one hundred percent, forever, with no decay of any kind.**
Two more measurements, both narrow and both load-bearing:
- **A person in the family tree is `{ id, rel, alive }`.** Three fields. `rel`
  is one of spouse / child / sibling_child. **There is no name.** Sweeping the
  whole fold block for name, who, remember, memory, story or told returns
  nothing but comments.
- **A wound is `inh.family.wounds.push(e.target)`.** A bare list of targets.
  No who did it, no when, no whether it was settled.

## 2. THE REAL AISLE -- WHAT ACTUALLY CROSSES A GENERATION
Two numbers, and the gap between them is the finding.
- **STATUS AND NAME ARE THE PERSISTENT THING.** The surname work that tracks
  rare family names through English records finds status correlations declining
  by a factor of about **0.79 per generation**, so slowly that an elite surname
  takes **ten to fifteen generations, three to four and a half centuries**, to
  become ordinary. The rate is close to constant across wildly different
  societies, from feudal England to social-democratic Sweden.
- **MONEY AND PROPERTY ARE THE LEAKY THING.** Intergenerational wealth
  elasticity is measured at about **0.28 to 0.37**, and father-to-son
  occupational correlation at about **0.30 to 0.40**. Estimates vary by method
  and some run higher, but nothing in that literature approaches 0.79.
> **THE NAME OUTLASTS THE MONEY BY ROUGHLY A FACTOR OF TWO, AND IT IS NOT
> CLOSE.**
### AND WHAT FAMILIES THEMSELVES SAY THEY WANT
Reported surveys of older adults put **64% ranking heirlooms above money** as
the most important part of an inheritance. The psychology literature on why is
sharper than the sentiment: an object is valued through what is called
**essence**, and the measured consequence is that **an object a person actually
USED is valued more highly than one they merely OWNED.**

## 3. THE GAMES AISLE -- ONE COMPLAINT AND ONE CONFESSION
The design problem in every generational game is stated the same way by the
people who play them: **the heir has to arrive with a real leg up, or the
handoff reads as deleting a high-level character and starting again**, which
players will not accept. That is the failure mode, and it is a mechanical one.
The confession is more useful, and it comes from a game that solved the
mechanical problem completely by carrying items, skills, money and shops
straight across: **its players say the biggest thing you lose is your family,
because all of them disappear.**
> **CARRYING EVERYTHING MATERIAL AND LOSING THE PEOPLE IS A KNOWN, SHIPPED,
> COMPLAINED-ABOUT OUTCOME. IT IS ALSO EXACTLY THE SHAPE OF OUR FOLD.**

## 4. *** THE FINDING THAT PROVES US WRONG ***
### OUR FOLD HAS THE PERSISTENCE BACKWARDS, FIELD FOR FIELD
Put section 1 beside section 2:
```
                        OUR FOLD              THE MEASURED WORLD
name / standing         decays 25% a gen      the MOST persistent thing (~0.79)
territory / builds /
economy / invest        carries 100% forever  the LEAST persistent (~0.3)
```
**We decay the one thing that really lasts and we preserve perfectly the things
that really go.** Every asset ledger in the fold is permanent and the only
social field in it is the only one that fades.
### AND THE HALF THAT IS ALMOST FUNNY: THE RATE IS RIGHT, IT IS ON THE WRONG FIELD
`STANDING_DECAY_TO_NEUTRAL = 0.25` multiplies a standing by **0.75** each
generation. The measured persistence of social status is **0.79**. A constant
our own comment calls *"tunable"* and nobody ever checked landed **within 0.04
of the best-measured figure in the social mobility literature.**
> **WE MEASURED THE RIGHT RATE AND ATTACHED IT TO THE WRONG THING.**
Nobody should touch that number. It is a good number. It belongs on the fields
that have no decay at all, and the field it currently sits on is the one the
research says should barely decay.
### AND THE SECOND HALF, WHICH MATTERS MORE THAN THE ARITHMETIC
The fold carries **four asset ledgers** and **not one object, not one name, and
not one memory.** A relative is `{id, rel, alive}` with no name. A wound is a
bare target with no who and no when. So the fold cannot express **the single
thing the research says people rank above money**, and it cannot express the
sharper version of it either, because **essence requires knowing that somebody
USED a thing**, and nothing in our model records use.
> **OUR FOLD CARRIES EVERYTHING THE EVIDENCE SAYS PEOPLE DO NOT CARE ABOUT,
> AND LOSES EVERYTHING IT SAYS THEY DO.**
### HOW THIS COMPOSES WITH THE FIRST TWO ROUNDS
Round 1 found the fold **generation-blind**, so an animal generation hands the
next one a block of zeroes. Round 3 finds that **even for a human generation the
fold carries the wrong things.** Round 2 found that in the animal's real life a
territory is **a vacancy, never an inheritance**, which is a direct contradiction
of `territory` being the fold's most permanent field. Three rounds, three
independent angles, one conclusion: **the fold is an asset register, and a
dynasty is not an asset register.**

## 5. WHAT WE TAKE AND WHAT WE REFUSE
**TAKE**
- **Move the decay.** The 0.75 is a good number sitting on the wrong field.
  Standing should be the slow one; the asset ledgers should be the ones that
  need holding on to. Mechanism ours, the exact split his.
- **A name in the family tree.** Three fields is not a person. This is the
  cheapest change on the page and it is what makes every other one legible.
- **A wound that knows who and when.** Today it is a bare target, so the game
  cannot tell the heir what happened, only that something did.
- **One object, and it has to have been USED.** The measured rule is essence:
  used beats owned. Day 10 already found our only example, the one item marked
  as the piece you keep, and this is the reason it works.
- **The leg up has to be real, and it does not have to be a number.** Day 9
  refused vertical growth and day 10 said loot is access, not power. Both
  answers apply here unchanged: the heir arrives with **doors**, not stats.
**REFUSE**
- Rewriting `STANDING_DECAY_TO_NEUTRAL` to 0.79 to match a paper. The number is
  already within 0.04 and NO DAMAGE BEFORE THE DIAL covers dials generally;
  matching a citation to three decimals is false precision on a game.
- Carrying skills across. It is the genre's stated failure mode in both
  directions: withhold them and the handoff reads as a deletion, carry them all
  and the people are what goes missing.
- Inventing who is in the family. Names, marriages, who dies, who the heir is:
  all canon, all his, and the fold should be able to HOLD a name without this
  lane choosing one.
- A second inheritance system beside the fold. There is one fold and it should
  stay one (ENGINE SYNC), which is also why this round proposes changing its
  fields rather than adding a parallel ledger.

## 6. ROUTED (proposals for the coordinator -- only the coordinator adds jobs)
- **WORLD -- THE-FOLD-CARRIES-THE-WRONG-THINGS.** Move the decay off standings
  and onto the asset ledgers; give a family tree node a name; give a wound a who
  and a when. Pure engine, headless, deterministic, no player surface, and it
  composes with the already-open QUESTS row for the handoff itself.
- **DYNASTY (this lane).** Q8 [inherited memory] is now the direct sequel to
  section 4 and should be taken before Q4. Q11 [lasting death] inherits the
  wound shape. Q12 [heir's hour] inherits the leg-up problem from section 3.
- **NOTHING FOR PEOPLE OR RUN THIS ROUND.** The five person-memory writes that
  round 1 routed are still the right row and nothing here changes it.

## 7. CONFIDENCE
- Section 1, every field and the decay: **MEASURED** today in the engine.
- Status persistence about 0.79 and ten to fifteen generations to fade: from a
  well-known body of surname research. It is **influential and it is contested**
  -- there are published critiques of both the method and the conclusion, and I
  read that it is argued over rather than settled. **HIGH** that the measured
  persistence of status is far above that of income and wealth, which is the
  only claim section 4 needs; **MEDIUM** on 0.79 as a precise figure.
- Wealth elasticity 0.28 to 0.37 and occupational correlation 0.30 to 0.40:
  multiple independent estimates, and they genuinely vary by method (one source
  reports 0.53 for income under a different instrument). **HIGH** on the range,
  **MEDIUM** on any single number. The comparison in section 4 is deliberately
  stated as roughly a factor of two, not as a ratio of exact figures.
- 64% ranking heirlooms above money: **MEDIUM.** It is widely repeated in
  practitioner and estate-planning writing and I did not reach the underlying
  survey or its sample. Treat it as directional.
- Essence, and used beating merely owned: psychology literature, reported
  consistently. **MEDIUM-HIGH.**
- The games aisle: player and community discussion, not peer-reviewed and not
  a developer statement. **MEDIUM**, and I have used it only for the shape of
  the complaint, which is unanimous, rather than for any number.
- Sections 4, 5 and 6: **MY ARGUMENT AND MY ROUTING.**

## SOURCES
NAMED AS RULERS, NOT AS REFERENCES. REAL AISLE: Gregory Clark's surname work on
the inheritance of social status (the ~0.79 per-generation persistence, ten to
fifteen generations to regress, constancy across societies) together with
published criticism of it. Intergenerational wealth and income mobility
estimates (Charles and Hurst; Conley and Glauber; Mulligan; St. Louis Fed and
Stanford summaries) for the 0.28 to 0.40 range. Practitioner and psychology
writing on heirlooms, including Lillios on objects of memory and the essence
result that used beats owned. GAMES AISLE: player community discussion of
generational and legacy systems, read for the shape of the complaint only.
IN-REPO: engine/bohemia_engine.js (`emptyInheritance`, `foldGeneration`,
`STANDING_DECAY_TO_NEUTRAL`, `applyFamily`, `selectHeir`); rounds 1 and 2 of
this study; and days 4, 9, 10, 16 and 21 of the BB study.
