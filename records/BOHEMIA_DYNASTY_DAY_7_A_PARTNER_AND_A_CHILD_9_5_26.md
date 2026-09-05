# DYNASTY STUDY -- ROUND 7 (Q7): A PARTNER AND A CHILD WITHOUT A CHORE
# (DYNASTY lane, 9/5/26. MODE: RESEARCH -- nothing here is implemented.)
# VAMILY row: DYNASTY Q7 [family arrives], "A partner and a child without a
# chore. How the best games handle a companion becoming family and a child
# arriving, and where it turns into babysitting."
# Rounds 1-6: records/BOHEMIA_DYNASTY_DAY_1..6_*.md (round 6 carries a
# correction at its top, written this round: I published a false negative.)
# Game titles appear in SOURCES only, never in the design, and never attached to
# a department they do not own (the 8/28 law as amended 9/5).

## 1. THE GAMES AISLE -- THE FAILURE MODE IS THE BEST-DOCUMENTED ONE IN THE CRAFT
"Where it turns into babysitting" already has an answer and it is unanimous:
**the escort mission.** The complaints are consistent across two decades:
- **It takes control away.** You cannot move at your own pace; you wait for the
  other body.
- **The outcome stops depending on your skill** and starts depending on an
  actor you do not drive.
- **The AI gets worse the moment it matters** -- walks into your line of fire,
  gets stuck, wanders off, exists to absorb damage.
The fixes the craft has actually found are equally consistent, and they are all
the same move in different clothes: **stop making the companion a liability.**
Either make them **invincible and useful** (out of your way, and handing you
things you need), or make them **genuinely able to hold their own**. Keep them
at least as fast as you, never let them block, and do not script ambushes
around them.
> **A COMPANION IS A CHORE EXACTLY WHEN THEY CAN LOSE THE GAME FOR YOU AND YOU
> CANNOT PLAY THEM.**

## 2. THE REAL AISLE -- AND IT DEMOLISHES THE PREMISE OF THE WHOLE MECHANIC
The genre assumes a child is a dependent attached to one adult. **Humans do not
work that way and never have.**
Humans are **cooperative breeders**. Care comes from group members other than
the mother as a matter of species design, not culture: grandmothers, older
siblings, extended family, ritual kin. Human interbirth intervals are short
enough that a mother has **several overlapping dependents at once**, which is
arithmetically impossible without other people, and communal rearing measurably
improves infant survival and development. The key trait named in the literature
is **flexibility**: allomothers take up the slack a mother cannot fill, and
mothers move toward wherever the help is.
Asked who looks after a child, the answer across a great many societies is
reported as the same three words: ***"We all do."***
> **RAISING A CHILD ALONE IS NOT THE REALISTIC OPTION. IT IS THE LEAST
> REALISTIC OPTION THERE IS.**

## 3. *** THE ONE SENTENCE ***
> **A CHILD IS NOT A THING YOU CARRY. A CHILD IS A REASON OTHER PEOPLE COME TO
> YOUR HOUSE.**
That single move turns the most hated mechanic in games into the thing this
project is already best at. We do not have a good escort system and should
never build one. We have an excellent **web of who saw what you did, who owes
you, and who would speak for you** -- and a child is the strongest possible
query against it. The question stops being *can you keep it alive* and becomes
***who turns up***, which is a question only our machine can answer.
And it is REALISM FIRST rather than a softening: the cooperative-breeding
literature says the group is the mechanism, so the group IS the accurate model.

## 4. THE PARTNER -- ANOTHER LANE ALREADY ANSWERED THIS AND NOBODY TOLD US
`engine/bohemia_resolve.js` carries a relationship study, done for faction
standing, that answers the partner half of this row almost exactly. Its three
findings, in its own words:
- **RATION -- LIMIT BY COUNT, NEVER BY PRICE.** *"A priced limit stops mattering
  the moment the player is rich; a rationed one never stops mattering."*
- **CEILING -- A CAP THAT ONLY MOVES ON A COMMITMENT.** An undated love interest
  hard-caps and *"no amount of gifting moves it. You cannot grind past a
  relationship; you have to ACT."* Accepting moves the cap; marrying moves it
  again. *"Progress gates are STATE CHANGES, not point totals."*
- **AND THE ONE THAT IS THE WHOLE ANSWER TO "WITHOUT A CHORE":** neglect gets
  **more expensive the closer you are** -- a stranger, someone you are seeing,
  and a spouse are three different costs for the same silence.
> **THE COST OF A PARTNER IS NOT MAINTENANCE. IT IS THAT IGNORING THEM HURTS
> MORE THE MORE THEY MATTER.** A chore is a task you perform on a schedule. This
> is a consequence you accept. Nothing has to be fed.

## 5. THE MEASUREMENT
- **THE COMPANION EXISTS AND IS HONEST ABOUT BEING HALF-BUILT.** The fight has an
  automated ally: `ALLY_NAME = 'ROSA'` with `ALLY_DRAFT = true` (the name is
  his), `ALLY_ON_DEFAULT = true`, `ALLY_LEASH = 6`, and
  `ALLY_DOWN_TURNS = 99` carrying its own comment: *"he stays down; picking him
  up is not built yet and is not pretended."* Round 1 measured the rest: he is
  `ARCH.human`, the same 60 hp and the same damage as every goon, so **an entire
  companion was added without authoring a single number.**
  That down-and-cannot-be-lifted state is section 1's failure mode in miniature,
  admitted in code rather than hidden.
- **NO CHILD EXISTS AS A PERSON ANYWHERE.** Searched for child, children, baby,
  infant, kid across the engine. What comes back: the fold's `child` event, a
  skeleton's child nodes in the rig, a corpse described as *"child-sized"*, and
  one comment in the deeds module quoting the standing law -- *"A NOTORIOUS ONE
  BECOMES THE THING YOUR CHILD IS JUDGED FOR."*
  **THE ONLY CHILDREN IN BOHEMIA ARE A BODY SIZE AND A SENTENCE ABOUT
  REPUTATION.**
- **A FAMILY IS FIVE EVENTS AND NOTHING ELSE.** `applyFamily` handles exactly
  `marry`, `child`, `sibling_child`, `death`, `heir`. A marriage pushes
  `{id, rel:'spouse', alive:true}`. Round 3 already measured that there is no
  name on any of it.
- **AND THE MACHINE FOR SECTION 3 IS ALREADY RUNNING.** The PEOPLE lane shipped
  the standing web that answers *who would speak for you* with an actual name,
  and the FACTIONS lane shipped `ctFold()`, which carries a parent's RETOLD
  deeds into the next generation. **The query "who turns up for this child" is
  the query those two organs already exist to answer.**

## 6. *** THE FINDING THAT PROVES US WRONG ***
### THE INSTINCT IS TO BUILD THE CHILD AS A DEPENDENT, AND THAT IS BOTH THE WORST GAME AND THE WORST REALISM
Everything about our current shape points at the escort mission: we have one
automated companion, on a leash of six, who can go down and cannot be picked up,
and the fold's only concept of a child is an id in a list. Adding "keep the
child alive" on top of that is the single most reliably hated mechanic in the
medium, **and it would also be the least accurate thing on the page**, because
the species does not raise children in pairs.
> **THE THING THAT MAKES A FAMILY EXPENSIVE IN REAL LIFE IS NOT THE WORK. IT IS
> THAT IT PUTS YOU IN DEBT TO OTHER PEOPLE.**
That is not a softer mechanic than babysitting, it is a harder one, and it is
the one our machine is built for: obligations, who owes whom, who is owed, and
what happens when nobody comes.
### AND A SMALLER ONE, ABOUT US RATHER THAN ABOUT FAMILIES
The partner half of this row was **already researched and written down inside a
module about faction standing**, and this lane did not know until it went
looking. Round 6 corrected, round 7 confirms: this repo's recurring failure is
not missing work, it is **work that exists in a file nobody thought to open.**
Four rounds found the mechanism attached to the wrong subject; this one found
the answer filed under the wrong department.

## 7. WHAT WE TAKE AND WHAT WE REFUSE
**TAKE**
- **The child as a query, not a cargo.** Who comes when there is a child is a
  question the standing web can already answer with a name.
- **The three rules from our own resolve module, unchanged**: ration by count,
  a ceiling that only moves on a commitment, and neglect that costs more the
  closer you are.
- **Alloparents as the real content.** Who takes the child for an afternoon,
  who refuses, and what that costs you later. That is the family layer, and it
  is made of people we already model.
- **The companion made competent or made safe, never made fragile.** The craft
  is unanimous and our own ally is already the same 60 hp as everyone else,
  which is the right instinct.
**REFUSE**
- **An escort mission, in any costume.** No follow-me, no keep-it-alive, no fail
  state attached to a body the player does not drive.
- **A care meter.** Feeding, nappies, a bar that empties. Day 7 killed survival
  meters, round 1 refused a hunger bar for an animal, and a child is not an
  exemption from either.
- **A child that is only a stat bonus or only a cutscene.** The first is a
  spreadsheet, the second is not a mechanic at all.
- **Grinding toward a partner.** Our own module already ruled that a ceiling
  moves on a commitment and never on points.
- **Deciding who anybody is.** Whether there is a partner at all, who, whether
  there is a child, how many, and every name: HIS. This round supplies a shape
  and not one person.
- **A second relationship system.** `bohemia_resolve.js` has the study and the
  standing web has the people. ENGINE SYNC: use them.

## 8. ROUTED (proposals for the coordinator -- only the coordinator adds jobs)
- **PEOPLE -- WHO-COMES-WHEN-THERE-IS-A-CHILD.** The strongest query the
  standing web has ever been asked, and it reuses the organ that already answers
  who would speak for you. No new system.
- **COMBAT -- PICKING-HIM-UP.** `ALLY_DOWN_TURNS = 99` and its own comment says
  the lift is not built and not pretended. That is the honest gap between our
  companion and section 1's bar.
- **WORLD -- TWO-FOLDS-SHOULD-BE-ONE** (renamed this round from round 6's wire).
  Unchanged in substance.
- **DYNASTY (this lane).** Q8 [inherited memory] is the direct sequel to section
  5's last bullet. Q11 [lasting death] inherits section 4's neglect curve: if
  ignoring a spouse costs more than ignoring a stranger, losing one should too.

## 9. CONFIDENCE
- Section 5, every constant, every comment quoted, and the child search:
  **MEASURED** today. The child search is bounded: I searched the engine for
  child, children, baby, infant and kid, and I read what each hit actually was.
  **After round 6's false negative I am stating the scope rather than the
  conclusion**: I did not sweep every slice for a child system, so the honest
  claim is that none exists in the engine and I did not find one.
- Section 4's three findings: **QUOTED VERBATIM** from bohemia_resolve.js. They
  are that module's summary of another game's numbers, so the numbers are its
  reading, not mine.
- Humans as cooperative breeders, allomothers, short interbirth intervals with
  overlapping dependents, and flexibility as the key trait: mainstream
  evolutionary anthropology, a well-known position with a large literature.
  **HIGH.** The "we all do" line is a reported summary of fieldwork rather than
  a statistic: **MEDIUM**, and used as a sentence, not a number.
- The escort-mission complaints and the named fixes: press, developer and
  community writing, consistent for twenty years. **HIGH** as a description of
  what players report; it is not an experiment.
- Sections 3, 6, 7 and 8: **MY ARGUMENT AND MY ROUTING.**

## SOURCES
NAMED AS RULERS, NOT AS REFERENCES, AND NONE OF THEM IS A REFERENCE GAME FOR ANY
DEPARTMENT. REAL AISLE: the cooperative-breeding and alloparenting literature in
evolutionary anthropology, including Hrdy's work on humans as cooperative
breeders and the allomothering reviews that follow it. GAMES AISLE: developer,
press and community writing on why escort missions fail and what the working
counterexamples do differently, read for the shape of the complaint and the
shape of the fix only. IN-REPO: the decoded fight (`ALLY_NAME`, `ALLY_DRAFT`,
`ALLY_LEASH`, `ALLY_DOWN_TURNS` and its comment); engine/bohemia_engine.js
(`applyFamily`, the five events); engine/bohemia_resolve.js (RATION, CEILING and
the neglect curve); engine/bohemia_deeds.js and engine/bohemia_standing.js (the
child-is-judged line, and `inherit`); slices/BOHEMIA_CITY_WORLD.html (`ctFold`);
and rounds 1, 2, 3 and 6 of this study.
