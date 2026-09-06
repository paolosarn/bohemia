# DYNASTY STUDY -- ROUND 14 (Q12 new): WHAT THE HEIR DOES DIFFERENTLY
# (DYNASTY lane, 9/5/26. MODE: RESEARCH -- nothing here is implemented.)
# VAMILY row: DYNASTY Q12 [heir plays], "What the heir DOES differently in their
# first ten minutes: how real second generations diverge from their parents (the
# trade they refuse, the debt they inherit, the name they carry), and how the
# best games make a new generation feel like a new person instead of a reskin.
# Deliver what must CHANGE at the fold, not just what carries."
# Rounds 1-13: records/BOHEMIA_DYNASTY_DAY_1..13_*.md (round 6 carries a
# correction written in round 7: I published a false negative there.)
# Game titles appear in SOURCES only (the 8/28 law as amended 9/5).

## 1. THE CONSTRAINT THIS ROW ARRIVES WITH, FROM TWO EARLIER ROUNDS
Before answering, two things are already ruled out:
- **The verbs cannot change** (round 10). Expertise is domain-specific and a new
  rule set at the fold makes a beginner of a master.
- **The hands cannot carry** (round 13). Skill does not transfer, so the heir
  cannot simply be the parent continued.
> **SO THE DIFFERENCE CANNOT BE IN WHAT THE HEIR CAN DO. IT HAS TO BE SOMEWHERE
> ELSE ENTIRELY, AND THAT IS THE WHOLE QUESTION.**

## 2. THE REAL AISLE -- THE SECOND GENERATION'S DIFFERENCE IS NOT INSIDE THEM
The best-studied real second generation is the children of immigrants, and the
research went somewhere nobody expected. The field started from a worry about
**second-generation decline**. The long New York study found the opposite: broad
**upward mobility, often past the parents**, and comparable or better outcomes
than native-born comparison groups.
The mechanism they name is not a trait. It is a POSITION:
> **THE SECOND GENERATION CAN SELECT FROM BOTH WORLDS.** They know what the
> parents knew and are not bound by it, and they know the place they are in
> without having had to arrive in it.
That is described as a **second-generation ADVANTAGE**, not a wound. And it is
purely relational: the difference lives in what they can draw on and how they are
read, not in anything they were born with.
### AND THE TRADE, FROM LAST ROUND, IS THE SAME SHAPE
A son of a military father is five times more likely to enlist and only one in
four does; three percent of farmers' sons stay and that is seven and a half times
the base rate. **The pull is enormous and it usually loses.** Refusing the trade
is not rebellion. **It is the normal outcome**, and a game where the heir simply
continues the father's work is modelling the rare case.

## 3. THE GAMES AISLE -- AND THE COMMON FIX BUYS DIFFERENCE BY CUTTING THE THREAD
The reskin failure is well known: only the portrait changes. The standard cure is
**randomised traits per heir** -- quirks and drawbacks that make each child feel
distinct. It works, and it has a cost that a critic of the best-known example
names precisely: the traits are **independent of the parent**, so the children
read *"as if they are all adopted"*, and the player is *"presented with a
pre-determined identity, rather than being allowed to develop something for
yourself."*
```
THE CLEAN HEIR      nothing changed          -> a reskin
THE RANDOM HEIR     everything changed, but  -> different, and unrelated
                    from a dice roll
```
> **BOTH FAILURES ARE THE SAME MISTAKE: THEY LOOK FOR THE DIFFERENCE INSIDE THE
> CHARACTER. THE FIRST FINDS NONE AND THE SECOND INVENTS SOME.**

## 4. *** THE ONE SENTENCE ***
> **THE HEIR IS NOT A NEW CHARACTER. THE HEIR IS THE SAME HANDS IN A ROOM THAT
> HAS ALREADY DECIDED SOMETHING ABOUT THEM, AND WHAT CHANGES AT THE FOLD IS WHO
> IS DOING THE DECIDING AND WHY.**

## 5. THE MEASUREMENT -- THE DIVERGENCE IS ALREADY RUNNING, IN ARITHMETIC
The standing web already carries everything this needs, and I read it carefully
after nearly misreporting it.
### (a) WHOSE DEED IT WAS TRAVELS WITH THE STORY
Inside `gossip()`, when one mind tells another:
```js
if (d.inherited) r.inherited = d.inherited;   // "so does whose deed it originally was"
if (d.of)        r.of        = d.of;
```
**The attribution survives retelling.** A story about your father, passed to a
third party, still knows it was your father's.
### (b) AND THE FATHER FADES ON A FIXED CURVE
```js
var f = w * c * Math.pow(HEARSAY_LOSS, d.hops||0) * Math.pow(GEN_LOSS, d.inherited||0);
```
`GEN_LOSS` is **0.45**. An inherited deed carries 45% of its force per generation
crossed, while the heir's own deeds enter at full weight.
> *** THE HEIR BECOMES THEMSELVES AUTOMATICALLY, BY ARITHMETIC, AND NOTHING IN
> THE GAME SHOWS IT HAPPENING. *** The divergence curve is already running.
### (c) BUT THE LAST STEP THROWS THE ATTRIBUTION AWAY
`opinionOf(mind, actorId, now)` sums `forceOf` over the matching deeds and
**returns a bare number**. The `of` and `inherited` fields survive the witness,
survive the gossip, survive the fold, and are dropped at the moment the game
forms an opinion.
> **THE DATA TO SAY "THEY THINK THAT ABOUT YOU BECAUSE OF HIM" IS CARRIED THE
> WHOLE WAY AND DISCARDED AT THE LAST LINE.**
(`legendOf` does keep `of` and `generations`, so the information is recoverable.
This is a dropped field at one call site, not a missing system.)
### (d) AND THE WEB CAN ALREADY BE ASKED THE RIGHT QUESTIONS
`witness`, `gossip`, `opinionOf`, `standingOf`, `whoVouches`, `whoWont`,
`legendOf`. **Seven questions, and `whoVouches` / `whoWont` are exactly the two
that would answer differently for an heir than for their parent.**

## 6. *** WHAT MUST CHANGE AT THE FOLD -- THE DELIVERABLE ***
Not what carries (round 13 delivered that). What is DIFFERENT:
```
1. WHO IS IN THE ROOM        about three in a hundred who knew the parent are
                             still there (round 6). The cast changed; you did not.
2. WHAT THEY ASSUME          the room has already decided. Same hands, different
                             reception, before you have done anything.
3. AND THAT IT IS ABOUT      the game can say "that is about him, not you", and
   SOMEBODY ELSE             today it computes the number and drops the name.
4. THE WEIGHT SHIFTS         his deeds at 45% per generation, yours at full.
                             The heir overtakes the father inside one life,
                             already, in the maths.
5. WHO VOUCHES               whoVouches and whoWont return different people.
                             The parent's allies are not automatically yours.
6. THE TRADE IS REFUSABLE    huge pull, small base. Walking away is the NORMAL
                             outcome and the game should expect it.
7. THE SEAT IS TAKEN         somebody filled the vacancy (round 11).
NOT DIFFERENT, ON PURPOSE:
   THE VERBS                 round 10. Nothing new to learn at the worst moment.
   THE HANDS                 round 13. Skill does not transfer; the heir earns
                             their own, and that is the point of the weight shift.
```

## 7. WHAT WE TAKE AND WHAT WE REFUSE
**TAKE**
- **Difference that lives in other people**, which is where the research puts it
  and where our machine already computes it.
- **Attribution at the opinion**: the one dropped field. It is the difference
  between "they distrust you" and "they distrust you because of him", and the
  second is a game.
- **The advantage framing.** The second generation's position is measured as an
  advantage, not a wound. The heir knows what the parent knew and is not bound by
  it. That is the leg up round 3 said an heir must arrive with, and it costs no
  stat.
- **Refusing the trade as the normal path**, not a rebellion.
**REFUSE**
- **Randomised traits.** They buy difference by cutting the thread to the parent,
  and this game's entire subject is that thread.
- **New verbs, new stats, a new moveset.** Rounds 10 and 13, both directions.
- **A trait screen at the fold.** Round 12: the first hour shows what you kept,
  and a character sheet is not that.
- **Deciding who refuses what.** Whether the heir takes the trade, whose allies
  stay, and every name are HIS. This round supplies the seven changes, not one
  person's choice.

## 8. ROUTED (proposals for the coordinator -- only the coordinator adds jobs)
- **PEOPLE -- SAY-WHOSE-DEED-IT-WAS.** `opinionOf` drops `of` and `inherited` at
  the last line while `gossip` carries them faithfully all the way there. One
  field at one call site, and it turns a number into a sentence.
- **RUN or UI -- THE-ROOM-DECIDED-BEFORE-YOU.** Section 6 items 1 to 3, at the
  fold, alongside round 12's SAY-WHAT-CARRIED. Same moment, same file.
- **DYNASTY (this lane).** [child watches] Q13 is next on the board and section 2
  is its direct input: a second generation learns by watching and then mostly
  does something else.

## 9. CONFIDENCE
- Section 5, `gossip`'s carried fields and its quoted comment, `forceOf`'s
  GEN_LOSS term, `opinionOf` returning a bare number, and the seven API
  functions: **MEASURED** today. **AND I NEARLY GOT THIS ONE WRONG**: I first
  read the attribution line as being inside `opinionOf` and checked which
  function actually contains it before writing. It is in `gossip`. That check is
  the only reason section 5(c) is right.
- The second-generation advantage, the reversal from a predicted decline, and
  "selecting from both worlds": a major, well-known body of sociology. **HIGH**
  that the finding exists and is influential; **MEDIUM** as a universal claim,
  since it is one long study of one city and the segmented-assimilation debate it
  argues with is still live. The design only needs the POSITION, not the outcome.
- The occupational multipliers: carried from round 13, which states its own
  confidence (different studies, countries and populations; the pattern not the
  figures).
- The randomised-traits critique: one critic writing about one game. **MEDIUM**,
  and used for the shape of the trade-off, which is self-evident once stated.
- Sections 4, 6, 7 and 8: **MY ARGUMENT AND MY ROUTING.**

## SOURCES
NAMED AS RULERS, NOT AS REFERENCES, AND NONE IS A REFERENCE GAME FOR ANY
DEPARTMENT. REAL AISLE: Kasinitz, Mollenkopf, Waters and Holdaway's New York
second-generation study and the second-generation-advantage thesis, together with
the segmented-assimilation literature it revises; the intergenerational
occupational mobility figures carried from round 13. GAMES AISLE: wiki, store and
critical writing on a well-known generational roguelike's randomised-trait heir
system, read for the trade-off it makes and nothing else. IN-REPO:
engine/bohemia_standing.js (`gossip` and its carried `inherited`/`of` fields,
`forceOf` and GEN_LOSS, `opinionOf`, `legendOf`, `whoVouches`, `whoWont`); and
rounds 3, 6, 10, 11, 12 and 13 of this study.
