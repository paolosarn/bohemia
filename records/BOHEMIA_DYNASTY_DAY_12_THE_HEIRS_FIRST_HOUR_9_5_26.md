# DYNASTY STUDY -- ROUND 12 (Q12): THE HEIR'S FIRST HOUR
# (DYNASTY lane, 9/5/26. MODE: RESEARCH -- nothing here is implemented.)
# VAMILY row: DYNASTY Q12 [heir's hour], "The heir's first hour. When the fold
# happens, what the first ten minutes of the next life must do so the player does
# not feel they lost everything."
# Rounds 1-11: records/BOHEMIA_DYNASTY_DAY_1..11_*.md (round 6 carries a
# correction written in round 7: I published a false negative there.)
# Game titles appear in SOURCES only (the 8/28 law as amended 9/5).

## 1. THE REAL AISLE -- A LOSS IS NOT PAID FOR BY AN EQUAL GAIN
The row's own words are "so the player does not feel they lost everything", and
that is a measurable claim about how people weigh a trade.
**Losses loom larger than gains.** Experimental estimates of the loss-aversion
coefficient cluster **between about 1.5 and 2.5**, with 2.0 as the textbook
value: losing a hundred hurts roughly twice as much as gaining a hundred feels
good.
**AND THE HONEST CAVEAT, BECAUSE THIS ONE HAS A HISTORY.** The coefficient is
argued over. Critics say the early utility work was over-interpreted and that
small losses often are not overweighted at all. The broader framework has held
up better: a global replication of the original 1979 study reports roughly 90%
replication on the contrasts at the heart of the theory. **So the DIRECTION is
solid and the NUMBER is soft**, and this round only needs the direction.
> **A FOLD THAT TAKES A LIFE AND HANDS BACK AN EQUAL AMOUNT DOES NOT FEEL LIKE A
> WASH. IT FEELS LIKE A LOSS. TO FEEL EVEN, THE HEIR HAS TO ARRIVE HOLDING
> VISIBLY MORE THAN WAS TAKEN.**

## 2. *** THE FINDING, AND IT IS THE SHARPEST ONE THIS LANE HAS FOUND ***
### THE MACHINE ALREADY COUNTS EXACTLY WHAT THE FIRST HOUR NEEDS, AND IT TELLS NOBODY
At the instant of the fold, `ctFold()` returns:
```js
return { gen: CT_GEN, carried: res.carried, died: res.died };
```
`carried` is **how many of your father's deeds survived because somebody retold
them.** `died` is **how many died with the last witness.**
**MEASURED: `carried` and `died` appear in exactly two places in the walked city
-- where they are computed and where they are returned. NOTHING CONSUMES THEM.
NOTHING DISPLAYS THEM.** The game performs the most important arithmetic in the
dynasty and throws the answer away.
### AND THE ORDER OF THOSE TWO WORDS IS THE WHOLE DESIGN
Section 1 says a loss is felt harder than an equal gain. So of the two numbers
the machine already has:
```
died     is the loss, quantified, delivered at the exact moment
         loss aversion is strongest
carried  is the inheritance, quantified, and it is the only thing that can
         answer the feeling the row is asking about
```
> *** THE ONE NUMBER OUR MACHINE PRODUCES AT THE FOLD IS ALSO THE ONE NUMBER
> THAT, SHOWN FIRST, WOULD MAKE THE FOLD FEEL LIKE A DEATH. ***
The first hour is not a new feature. **It is those two words, said out loud, in
the right order: what you kept, and only then what you lost.**
### AND THE CONTINUITY IS ALREADY TOTAL, AND ALREADY INVISIBLE
The heir keeps the player id `@`, and that is ruled rather than convenient:
*"the whole point is that the heir INHERITS rather than starts over -- a run
resets you to nothing, a handoff is the opposite. Keeping the id means every
card, every rung and every outfit view keeps working and now reads the family's
history as the player's own."*
> **MECHANICALLY THE PLAYER LOSES NOTHING. THEY WOULD STILL FEEL THEY LOST
> EVERYTHING, BECAUSE NOTHING TELLS THEM WHAT THEY KEPT.**
That gap between what is true and what is felt is the entire content of Q12.

## 3. THE MEASUREMENT -- A SCENE IS A FILE, AND FOUR ALREADY SHIPPED
```
BOHEMIA_SCENE_ACT1_COLD_OPEN.json       362 lines
BOHEMIA_SCENE_ACT1_GRIEF_DINNER.json    194 lines
BOHEMIA_SCENE_ACT1_RIDGE_BURIAL.json    182 lines
BOHEMIA_SCENE_ACT1_THE_LAST_ROOM.json   115 lines
```
Four scenes exist, and the grief dinner's own note says what they cost: *"THE
SECOND CUTSCENE, AND IT COST ONE FILE. No new engine code, no new gate
machinery."*
**THERE IS NO FOLD SCENE.** The machinery for the most important cut in a
hundred-hour game is proven, shipped four times, and has never been pointed at
the fold. Scope stated after round 6's false negative: I listed the scene records
and searched the quest corpus and the slices for a fold scene; this is what I
found and where I looked.

## 4. *** THE ONE SENTENCE ***
> **THE FIRST HOUR IS NOT A TUTORIAL AND IT IS NOT A RECAP. IT IS THE GAME
> TELLING YOU, IN THE FIRST MINUTE, WHAT YOU STILL HAVE.**

## 5. WHAT THE FIRST TEN MINUTES MUST DO, FROM ELEVEN ROUNDS OF THIS LANE
Every one of these is already measured somewhere in this study, so the first hour
is an assembly job rather than an invention:
- **SHOW WHAT CARRIED, FIRST.** The number exists (section 2).
- **DO NOT PLAY THE TEN YEARS** (round 6). His own TEN YEARS COLD clause 1
  applied to the gap: the cut is a cut.
- **THE ROOM IS IDENTICAL AND THE PEOPLE ARE GONE** (round 6). Same table, and
  almost nobody knows your face.
- **A NAME NOBODY CAN EXPLAIN** (round 9). Nine street names in ten survive and
  the reason for them does not.
- **A SEAT SOMEBODY TOOK, A SCAR, AND ONE PERSON WHO DOES NOT ANSWER**
  (round 11).
- **AN OBJECT SOMEBODY USED, NOT ONE THEY OWNED** (round 3's essence rule).
- **THE SAME VERBS** (round 10). Nothing new to learn at the worst possible
  moment to learn something.
- **AND SOMEBODY STILL SAYS THE NAME** (round 8). `legendOf` already reports how
  many people still tell each surviving deed.

## 6. WHAT WE TAKE AND WHAT WE REFUSE
**TAKE**
- **`carried` before `died`.** Free, measured, and the entire answer to the row's
  question.
- **A fold scene as one file.** Four precedents, no new engine code, and the
  scene machinery is the most proven thing in this area of the repo.
- **The id staying `@` as the mechanical spine**, with the first hour as the
  thing that makes it legible.
- **More back than was taken, visibly.** Section 1's direction, not its number.
**REFUSE**
- **Showing `died` first, or alone.** It is the loss, quantified, delivered at
  the worst possible moment.
- **A summary screen of the parent's life** (round 8). Real second generations
  get fragments, not briefings.
- **A montage of the gap** (round 6), banned by his own law.
- **A tutorial.** Round 10: the verbs do not change, so there is nothing to
  teach.
- **Any number I have not measured.** The loss-aversion coefficient in
  particular is NOT shipped: the direction is the finding and the value is
  contested even in its own literature.
- **Writing the scene.** What is in the room, who is at the table and what is
  said are canon and his. This round supplies the order, not the words.

## 7. ROUTED (proposals for the coordinator -- only the coordinator adds jobs)
- **RUN or UI -- SAY-WHAT-CARRIED.** Two words the machine already computes,
  shown in the right order at the fold. This is the smallest job this lane has
  ever proposed and the one with the highest ratio of effect to cost.
- **QUESTS (PARKED) -- THE-FOLD-IN-THE-RUNTIME** already exists as an OPEN row.
  Section 3 is its cost estimate: four scenes shipped, one file each, no engine
  code.
- **DYNASTY (this lane).** After this the board shows one row left, the
  coordinator's new [what carries] Q11. Everything in section 5 is its input.

## 8. CONFIDENCE
- Section 2 and section 3, `ctFold`'s return, the two-places measurement for
  `carried`/`died`, the quoted `@` ruling, and the four scene files with their
  line counts: **MEASURED** today, scope stated.
- The grief dinner's "it cost one file" note: **QUOTED** from that record.
- Loss aversion: **the direction is HIGH** (reference dependence and losses
  weighing more is one of the better-supported ideas in the field, and a global
  replication reports about 90% on the core contrasts). **The coefficient is
  MEDIUM-LOW and openly contested**, which is why section 6 refuses to ship it.
- Section 5 is a synthesis of eleven earlier rounds of this study, each of which
  states its own confidence in its own record.
- Sections 2's argument, 4, 6 and 7: **MY ARGUMENT AND MY ROUTING.**

## SOURCES
NAMED AS RULERS, NOT AS REFERENCES, AND NONE IS A REFERENCE GAME FOR ANY
DEPARTMENT. REAL AISLE: prospect theory and the loss-aversion literature,
including the coefficient range, the published criticism of its empirical
foundation, and the multi-country replication of the 1979 study. IN-REPO:
slices/BOHEMIA_CITY_WORLD.html (`ctFold`, the `{gen, carried, died}` return, the
"THE HEIR IS ALSO '@'" ruling, `legendOf`); engine/bohemia_standing.js
(`inherit`); records/BOHEMIA_SCENE_ACT1_*.json (four shipped scenes and their
line counts, and the grief dinner's own cost note);
laws/BOHEMIA_ADDENDUM_TEN_YEARS_COLD_7_31_26.md; and rounds 3, 6, 8, 9, 10 and 11
of this study.
