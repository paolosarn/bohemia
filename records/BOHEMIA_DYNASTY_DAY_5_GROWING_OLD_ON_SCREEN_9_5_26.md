# DYNASTY STUDY -- ROUND 5 (Q5): GROWING OLD ON SCREEN
# (DYNASTY lane, 9/5/26. MODE: RESEARCH -- nothing here is implemented.)
# VAMILY row: DYNASTY Q5 [growing old], "Growing old on screen. How the best
# games show a character ageing in a way that changes play, not only the
# portrait."
# Rounds 1-4: records/BOHEMIA_DYNASTY_DAY_1..4_*.md
# Names appear in SOURCES only, never in the design (the 8/28 law).

## 1. THE REAL AISLE -- AGEING IS A TRADE, NOT A SLOPE
The instinct, and the genre's habit, is that ageing is a penalty after a peak.
The measurements say something more useful: **two curves crossing.**
### WHAT FALLS, AND HOW FAST
```
REACTION TIME   peaks early-to-mid twenties, then slows by roughly 1-2 ms a
                year. By sixty it is about 20-30% slower than peak.
MUSCLE          about 3-5% lost per decade from thirty, and as much as 8% a
                decade between sixty-five and eighty.
GRIP            rises to a peak in the early thirties, plateaus, then declines.
HEALING         a young adult replaces skin cells after a cut in about two
                weeks. An older adult takes three to four weeks or more.
```
### WHAT DOES NOT FALL, AND THIS IS THE HALF THE GENRE IGNORES
Anticipation, decision-making and pattern recognition are **more resistant to
ageing than raw speed**, and they keep improving with experience. Expert older
athletes routinely beat younger novices at sport-specific perceptual tasks:
their accumulated pattern recognition more than covers the slower processing.
The named mechanism is **temporal anticipation** -- predicting *when* something
will happen from rhythm, pattern and situation, so the response starts at the
best moment instead of the fastest one.
> **THE NUMBER THAT FALLS IS SPEED. THE NUMBER THAT RISES IS KNOWING WHAT
> HAPPENS NEXT. GROWING OLD IS THE CROSSOVER, NOT THE DECLINE.**
### AND ONE FALLS WITH NO COMPENSATION AT ALL
**Healing.** Nothing about experience makes a cut close faster. That is the one
honest, uncompensated cost of age, and it is the one a game can use without ever
touching a damage number, because it is about **time**, not about power.

## 2. *** THE ONE SENTENCE ***
> **AN OLD FIGHTER DOES NOT GET WEAKER. HE GETS FEWER CHANCES AND HE STOPS
> NEEDING AS MANY.**
On a game that runs at 120 BPM against a group, that is directly expressible and
it needs no number he has not ruled: **fewer inputs inside the bar, and a better
read of the bar.** The old body acts less often; the old head knows which beat
matters. NO DAMAGE BEFORE THE DIAL is untouched, because nothing here is damage.

## 3. THE GAMES AISLE, AND WHY THE QUESTION IS PHRASED THE WAY IT IS
The row says "in a way that changes play, not only the portrait", which is
already the finding: the common implementation is **a new portrait plus a stat
penalty after a peak age**, and it is disliked for the obvious reason that it is
a subtraction the player did not earn and cannot answer. The genre's own late
game literature says the same thing from the other side (round 4): raising and
lowering numbers trivialises decisions, and the cure is **horizontal change,
different options rather than bigger or smaller ones.**
Applied here: ageing should change **which verbs are good**, not how well the
verbs work. That is day 9's horizontal growth and day 10's access-not-power,
pointed at time instead of at loot.

## 4. THE MEASUREMENT -- NOBODY IN BOHEMIA HAS AN AGE, AND I CHECKED PROPERLY
Round 2 cost me a confident negative, so this one is bounded and controlled.
- **A PERSON'S AGE TAKES EXACTLY TWO VALUES IN THE WHOLE ENGINE**: `age:'child'`
  and `age:'adult'`, in `engine/bohemia_story_surface.js`, used only to choose
  which sprite to paint the player as in a cutscene.
  *(Positive control: the same search returns `age:'industrial'` three times,
  which is a BUILDING STYLE. Different noun, caught before it counted.)*
- **EVERYWHERE ELSE IN THE ENGINE, `age` MEANS ELAPSED TIME, NOT HOW OLD
  SOMEBODY IS.** Days a claim is overdue (`bohemia_claim.js`), turns since a
  sighting (`bohemia_memory.js`), turns since a deed (`bohemia_standing.js`).
- **THERE IS NO AGE IN THE FIGHT AT ALL.** *(Positive control: 39 raw hits for
  age/old/young/elder in the decoded fight, and they are `hold`, `holds`, `gold`,
  `bold`, `damage`, `wager`, two elapsed-time variables for a fire animation and
  a log fade, and one game title inside a comment. Zero real uses.)*
- The fold has no `born`, no `died` and no age at all: round 3 measured a
  relative as `{id, rel, alive}`.
### AND A DELIBERATE PRIOR REFUSAL THAT I AM NOT GOING TO OVERTURN
`engine/bohemia_people.js` says it out loud: *"NO CALENDAR YEAR IS ASSUMED -- the
game has never locked one, and a cohort-by-birth-year generator would be
inventing canon to do arithmetic on."* That lane was right. **So whatever ageing
we do has to work WITHOUT a calendar and without birth years**, which is a real
constraint on this round's answer and not an obstacle to it.

## 5. *** THE FINDING THAT PROVES US WRONG ***
### WE ALREADY BUILT THE AGEING EQUATION AND POINTED IT AT MEMORIES
`engine/bohemia_memory.js`, shipped, live, and commented in its own words:
```
clarity  = 0.5 ^ (age / halflife)
halflife = BASE_HALFLIFE * (1 + log2(1 + familiarity))   // "familiarity slows the fog"
```
That is **exactly the shape section 1 describes for a person**: something decays
exponentially with time, and **experience extends the halflife with diminishing
returns.** A face seen often keeps for days. An expert's read holds up when the
speed has gone.
> **WE HAVE THE MATHEMATICS OF GROWING OLD. IT IS RUNNING ON WHAT THE CITY
> REMEMBERS ABOUT YOU INSTEAD OF ON WHAT YOUR BODY CAN DO.**
Third time this lane has found that shape: round 1 found the material existing
and never reaching the player, round 2 found both halves of the coyote's life
shipped as unrelated tiers, and now the ageing curve itself, aimed at a different
noun. **The pattern is not that we are missing things. It is that we build the
right mechanism and attach it to the wrong subject.**
### AND THE STANDING WEB ALREADY AGES ACROSS GENERATIONS, IN THE RIGHT DIRECTION
The same lane already wrote the rule this study needs and did it before anybody
asked: *"Thirty years pass. EVERY PERSON WHO WATCHED YOU DO ANYTHING IS DEAD...
A QUIET GOOD DEED DIES WITH THE WITNESS. A NOTORIOUS ONE BECOMES THE THING YOUR
CHILD IS JUDGED FOR."* That is round 3's "the name outlasts the money" arrived at
independently from anthropology, and it is **already built**. Round 5 adds only
that the same decay belongs on the body as well as on the reputation.

## 6. WHAT WE TAKE AND WHAT WE REFUSE
**TAKE**
- **The crossover, not the slope.** Fewer chances inside the bar, and a better
  read of which beat matters. Two curves, and the player should feel the second
  one arrive.
- **Healing as the one honest cost.** It is time, not power; it needs no damage
  number; and it composes with round 4's write-only wound, because a wound that
  takes longer to close is a wound the game has to be able to describe.
- **No calendar.** Turns and beats, the way the memory module already does it.
  Age is elapsed time since something, which is a word this engine already uses
  correctly everywhere except on people.
- **Horizontal.** Ageing changes which verbs are good, never how well they work.
**REFUSE**
- **A portrait change plus a stat penalty.** That is the thing the row is asking
  us not to do, and it is a subtraction the player cannot answer.
- **Birth years and a locked calendar year.** Already refused by the PEOPLE lane
  with a good reason, and this round agrees with them.
- **Any damage, health or armour number.** Nothing in section 2 needs one.
- **Ageing the animal generation on the same curve.** Round 2 measured a very
  different life: a coyote's danger is a vacancy and a car, not a slow decline,
  and gen 1 is short on purpose (round 1). One curve for three generations would
  be the generation-blind mistake round 1 already found in the fold.
- **A wisdom stat.** "Knowing what happens next" is anticipation, which is a
  READ, not a number: the old character should see the tell sooner, not roll
  higher.

## 7. ROUTED (proposals for the coordinator -- only the coordinator adds jobs)
- **COMBAT -- THE-OLD-HAND.** Fewer inputs inside the bar and an earlier read of
  the tell. Composes with the 120 BPM law and needs no damage number. This is
  the only row in this round that touches play directly.
- **WORLD -- THE-FOLD-CARRIES-THE-WRONG-THINGS** (rounds 3 and 4) gains a small
  third item: a tree node has no `born` and no `died`, and it can have them
  **without a calendar year** by storing beats, the way memory already does.
- **PEOPLE -- NOTHING NEW.** The standing web already ages memory correctly and
  already carries the cross-generation rule. Saying so is the finding.
- **DYNASTY (this lane).** Q6 [time skip] inherits section 1 directly: a ten-year
  cut is the crossover happening off screen. Q11 [lasting death] inherits
  healing.

## 8. CONFIDENCE
- Section 4, every count, both positive controls, and the quoted refusal in
  people.js: **MEASURED** today.
- Section 5's equation and comment: **QUOTED VERBATIM** from bohemia_memory.js.
- Reaction time peaking in the early-to-mid twenties and slowing ~1-2 ms a year
  to 20-30% slower by sixty: **MEDIUM-HIGH.** The direction and rough magnitude
  are well established; the per-year figure comes from summary writing rather
  than a paper I read.
- Muscle loss 3-5% per decade from thirty, up to 8% between sixty-five and
  eighty; grip peaking in the early thirties: **HIGH** on the pattern, **MEDIUM**
  on exact percentages, which differ between sources (one gave 15% a decade after
  sixty).
- Anticipation and pattern recognition resisting age, and expert olds beating
  young novices on domain tasks: **HIGH** as a finding, and it is the load
  bearing one.
- Healing taking three to four weeks against two: **MEDIUM.** Clinical summary
  writing, not a primary source, and it varies enormously by wound and person.
- Sections 2, 5's argument, 6 and 7: **MINE.**

## SOURCES
NAMED AS RULERS, NOT AS REFERENCES. REAL AISLE: work on age-related change in
simple reaction time and on preparation rather than initiation as its cause;
sports-science and cognitive writing on anticipation, temporal anticipation and
pattern recognition resisting age, and on expert older performers outperforming
younger novices in-domain; clinical and public-health material on sarcopenia
(3-5% per decade from thirty, up to 8% at sixty-five to eighty), NHANES-based
analysis of grip strength across the lifespan, and clinical writing on slower
wound healing with age. GAMES AISLE: community and blog discussion of power creep
and late-game triviality (round 4's sources), read for the shape only.
IN-REPO: engine/bohemia_memory.js (`clarity`, `halflife`, the familiarity term);
engine/bohemia_standing.js (deed decay, and the thirty-years comment);
engine/bohemia_claim.js (`age` as days overdue);
engine/bohemia_story_surface.js (`age:'child'` / `age:'adult'`);
engine/bohemia_people.js (the refusal of birth years); the decoded fight;
rounds 1-4 of this study; and days 9 and 10 of the BB study.
