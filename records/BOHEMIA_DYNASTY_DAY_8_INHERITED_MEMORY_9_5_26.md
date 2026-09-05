# DYNASTY STUDY -- ROUND 8 (Q8): REMEMBERING A LIFE YOU DID NOT PLAY
# (DYNASTY lane, 9/5/26. MODE: RESEARCH -- nothing here is implemented.)
# VAMILY row: DYNASTY Q8 [inherited memory], "Remembering a life you did not
# play. How the second generation remembers the first: what the game shows the
# heir about the parent, and what real second generations actually keep."
# Rounds 1-7: records/BOHEMIA_DYNASTY_DAY_1..7_*.md (round 6 carries a
# correction written in round 7: I published a false negative there.)
# Game titles appear in SOURCES only, never in the design, and never attached to
# a department they do not own (the 8/28 law as amended 9/5).

## 1. THE REAL AISLE -- SPOKEN MEMORY HAS A MEASURED LIFESPAN, AND IT IS OURS
The memory literature splits what a group remembers into two things:
```
COMMUNICATIVE MEMORY   lived, spoken, person to person. Everyday talk.
                       LASTS 80 TO 110 YEARS. THREE TO FOUR GENERATIONS.
CULTURAL MEMORY        written, ritualised, monumental. Formalised on purpose.
                       Can last thousands of years.
```
Between them sits what the fieldwork calls **the FLOATING GAP**: the empty space
between the recent past people still actually remember and the distant past a
group has formalised. There is plenty about the last eighty years and plenty
about the founding myth, and **almost nothing in between.** And the gap floats,
because it moves forward with every generation that dies.
> *** BOHEMIA IS ONE HUNDRED YEARS AND THREE GENERATIONS. THAT IS EXACTLY THE
> LIFESPAN OF SPOKEN MEMORY. THE GAME ENDS PRECISELY WHERE PEOPLE STOP BEING
> ABLE TO TELL YOU ABOUT IT. ***
### AND THE NUMBERS ON HOW FAST FAMILIES FORGET ARE BRUTAL
- **53% of Americans cannot name all four of their grandparents.**
- **21% cannot name a single great-grandparent**, and 34% know nothing further
  back than grandparents.
- In the UK, **10% know basic details about their great-grandparents** -- names,
  birthplaces, occupations.
- And **84% say knowing their heritage is important to them.**
That last number is the design brief. **People care enormously and remember
almost nothing.** The gap between 84% and 10% is exactly the feeling the second
generation should have.

## 2. *** THE ONE SENTENCE ***
> **GENERATION THREE IS STANDING ON THE EDGE WHERE YOUR GRANDFATHER STOPS BEING
> SOMEBODY PEOPLE TALK ABOUT AND BECOMES EITHER A MONUMENT OR NOTHING.**
That is not a theme we would be imposing. It is the measured shape of human
memory, and our game happens to be exactly that long.

## 3. THE GAMES AISLE -- FOUND THINGS, NOT TOLD THINGS
The craft's answer to "show the player a life they did not live" is
environmental: letters, diaries, photographs, recordings, and objects left in
the rooms where somebody used them. The praise is always for the same quality --
you assemble the person yourself from what they left -- and the failure mode is
always the same one: **exposition, a summary handed to you.**
This composes exactly with round 3's measured rule about heirlooms, which came
from a completely different literature: **an object somebody USED is valued above
one they merely OWNED.** Two aisles, one instruction.
> **DO NOT TELL THE HEIR WHO THEIR PARENT WAS. LEAVE THE THINGS THEY USED WHERE
> THEY USED THEM.**

## 4. THE MEASUREMENT -- WE BUILT THE FADING HALF BEAUTIFULLY
The PEOPLE lane's standing web is, measured today, a genuinely good model of
communicative memory. It is not close to a stub:
```
SEE_RANGE      9      you have to have been near enough to see it
MAX_HOPS       2      a story can be retold at most twice
HEARSAY_LOSS   0.55   it weakens every time it changes mouths
GOSSIP_WINDOW  45     there is a window in which it spreads at all
GEN_LOSS       0.45   and it loses this much crossing a generation
```
And `inherit()` carries a parent's deeds to the child with one rule, stated in
its own comment: *"the eyewitness is dead. Only what was RETOLD is still in the
valley."* A deed with `hops > 0` is re-attributed to the child, its `inherited`
count goes up by one, and it records `of: parentId` so the deed is still
nameable as the father's. It returns `{carried, died}` -- **the machine counts
what survived the generation and what died with the witnesses.**
`legendOf()` then reports, per deed kind: **how many people still tell it, how
much force it still carries, and how many generations it has survived.**
> **THAT IS COMMUNICATIVE MEMORY, IMPLEMENTED, WITH FIVE CONSTANTS AND A
> RETELLING FILTER. IT IS THE BEST-MODELLED THING IN THIS REPO.**

## 5. *** THE FINDING THAT PROVES US WRONG ***
### THE ONLY THING THAT CROSSES THE FLOATING GAP IS THREE WORDS
The research says everything past roughly a century survives ONLY as cultural
memory -- what was written down, ritualised or built. In our game that is one
function:
```js
function monumentForm(folds) {
  const karma = folds[folds.length - 1].karma;
  const sacrifice = folds.reduce((a, f) => a + (f.virtues.sacrifice || 0), 0);
  if (karma > 10 && sacrifice > 5) return 'light';
  if (karma < -8) return 'stone';
  return 'organic';
}
```
**Two numbers in, one of three strings out, for a hundred years and three
generations of play.**
> **WE MODELLED THE HALF THAT FADES WITH FIVE CONSTANTS AND A HOP COUNTER, AND
> THE HALF THAT LASTS FOREVER WITH AN IF-ELSE.**
And it is worse than the line count suggests, because of what it reads. It takes
**the FINAL fold's karma**, so a hundred years of behaviour collapses to whatever
the last number happened to be, and a summed `sacrifice` virtue. It cannot see a
single deed, a single name, or a single thing anybody did -- while `legendOf`,
one repo away, knows exactly which deeds survived, who still tells them, and how
many generations they lasted.
### AND THE LANE'S OWN PATTERN AGAIN, FOR THE FIFTH TIME
Rounds 1, 2, 5 and 6 found the right mechanism attached to the wrong subject.
Round 7 found the answer filed under the wrong department. Round 8 finds the two
halves of the same idea built at **wildly different resolutions**: the thing that
is supposed to be temporary is modelled in fine grain, and the thing that is
supposed to be permanent is a coin flip between three shapes.
> **THE MONUMENT SHOULD BE MADE OF THE DEEDS THAT SURVIVED, AND THE MACHINE THAT
> KNOWS WHICH ONES THOSE ARE IS ALREADY RUNNING.**

## 6. WHAT WE TAKE AND WHAT WE REFUSE
**TAKE**
- **The floating gap as the shape of act 3.** Not a theme, a measurement: at a
  hundred years, gen 1 is either still being told or it is gone.
- **Two states, and the game should be able to show both**: what people still
  say about your grandfather, and the silence where they cannot say anything.
  The 84%-care / 10%-know gap is the feeling.
- **A monument made of what survived**, not of a final karma number. `legendOf`
  already returns exactly the input this needs.
- **Found things, not told things.** Objects where they were used. Same rule
  round 3 got from the heirloom literature.
- **`{carried, died}`.** The machine already counts what died with the
  witnesses, and that number is the most honest thing a fold could show a
  player. It should be sayable, not just returned.
**REFUSE**
- **A summary screen of your father's life.** That is the exposition failure and
  it also contradicts the measured amnesia: real second generations do NOT get
  a briefing, they get fragments and a lot of missing.
- **A complete family history.** 21% of people cannot name one
  great-grandparent. A game where the heir knows everything is a fantasy about
  memory, and REALISM FIRST rules against it.
- **Rewriting the standing web.** It is the best-modelled organ we have and this
  round is not a criticism of it.
- **A fourth memory system.** Round 6 already found two folds; the answer is
  fewer, not more.
- **Choosing what the monument says.** Its shapes, its names and its meaning are
  canon and his. This round says only that three is too few and that it should
  read the deeds instead of a number.

## 7. ROUTED (proposals for the coordinator -- only the coordinator adds jobs)
- **WORLD -- THE-MONUMENT-IS-THREE-WORDS.** The only thing that crosses the
  hundred-year gap is `monumentForm`, and it reads two numbers when `legendOf`
  can hand it the deeds that actually survived. Mechanism ours, every shape and
  name his.
- **WORDS -- WHAT-THE-VALLEY-STILL-SAYS.** `legendOf` returns deed KINDS, which
  are machine ids; the city already maps them through the quest corpus's own
  lines so the family's history and the day's gossip are one voice. Making that
  reach the heir is a words job, not a systems one.
- **PEOPLE -- NOTHING NEW, AND SAYING SO IS THE POINT.** The fading half is
  built and it is right.
- **DYNASTY (this lane).** Q9 [century town] is the same question asked about a
  place instead of a person and should be taken next as the board has it.
  Q12 [heir's hour] inherits `{carried, died}` directly.

## 8. CONFIDENCE
- Section 4 and section 5, every constant, the quoted comment, `inherit`'s rule,
  `legendOf`'s fields and `monumentForm` verbatim: **MEASURED** today.
  Scope stated after round 6's false negative: I read these functions in
  engine/bohemia_standing.js and slices/BOHEMIA_CITY_WORLD.html directly. I did
  not sweep every slice for a second monument implementation, so the claim is
  that this is the monument I found and the only one referenced by the fold.
- Communicative memory at 80 to 110 years and three to four generations, and the
  floating gap: a standard and widely used framework in memory studies, with the
  gap term borrowed from oral-history fieldwork. **HIGH** as a framework;
  the 80-110 figure is a characterisation rather than a measurement, so
  **MEDIUM** on the number. The design only needs "about three generations",
  which is the robust part.
- 53% cannot name four grandparents, 21% cannot name a great-grandparent, 10%
  in the UK, 84% say heritage matters: **commercial surveys**, run by companies
  with an interest in the answer, and I did not see their methods. **MEDIUM at
  best**, and I have used them as a direction rather than as figures. The
  direction is corroborated by the independent framework above, which is why I
  trust the shape and not the decimals.
- The environmental-storytelling practice and the exposition failure: press and
  design writing, consistent. **HIGH** as a description of practice.
- Sections 2, 5, 6 and 7: **MY ARGUMENT AND MY ROUTING.**

## SOURCES
NAMED AS RULERS, NOT AS REFERENCES, AND NONE IS A REFERENCE GAME FOR ANY
DEPARTMENT. REAL AISLE: Jan Assmann's communicative and cultural memory, and the
floating gap as described in oral-history fieldwork (Vansina); commercial
genealogy and heritage surveys on how many people can name grandparents and
great-grandparents. GAMES AISLE: design and press writing on environmental
storytelling, letters, diaries and found objects, read for the shape of the
practice and its failure mode only. IN-REPO: engine/bohemia_standing.js
(SEE_RANGE, MAX_HOPS, HEARSAY_LOSS, GOSSIP_WINDOW, GEN_LOSS, `inherit`,
`legendOf`, `whoVouches`, `whoWont`); slices/BOHEMIA_CITY_WORLD.html (`ctFold`,
and the note that legendOf's kinds are read through the quest corpus's own
lines); engine/bohemia_engine.js (`monumentForm`, `foldGeneration`); and rounds
3, 4, 6 and 7 of this study.
