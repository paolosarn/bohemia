# DYNASTY STUDY -- ROUND 4 (Q4): THE THIRD GENERATION
# (DYNASTY lane, 9/5/26. MODE: RESEARCH -- nothing here is implemented.)
# VAMILY row: DYNASTY Q4 [third generation], "The third-generation curse. How
# real family businesses and dynasties survive or die by the third generation,
# and what a game could take from it for Gen 3."
# Rounds 1-3: records/BOHEMIA_DYNASTY_DAY_1_*.md, _DAY_2_*.md, _DAY_3_*.md
# Names appear in SOURCES only, never in the design (the 8/28 law).

## 0. THE ROW'S OWN PREMISE IS THE FIRST THING TO CHECK
The row is called the third-generation CURSE, and the folklore behind it is
everywhere: shirtsleeves to shirtsleeves in three generations, the same proverb
in Italian, Chinese and Scots, and the numbers everyone quotes, roughly 30% of
family firms reaching the second generation, 12% the third, 3% the fourth.
**The criticism of that is serious and I am not going to bury it.** The widely
repeated "70% fail by the third generation" is traced back to an early-2000s
study about family communication and felt control rather than any rigorous
measure of business survival. Family businesses on average outlast the typical
public company. Most of the longest-lived companies in the world are family
owned. And the survival figures that do exist mostly say that **keeping any
company alive for a century is extremely hard**, not that families are
specifically bad at it.
> **DO NOT BUILD A CURSE. REALISM FIRST MEANS WE DO NOT ENCODE A PROVERB AND
> CALL IT RESEARCH.**

## 1. WHAT ACTUALLY MAKES THE THIRD GENERATION HARD, AND IT IS NOT DECADENCE
Two mechanisms, both well documented, and neither is "the grandson is lazy."
### (a) THE OWNERSHIP SHAPE CHANGES, AND IT IS THE THIRD GENERATION THAT CHANGES IT
```
GEN 1   one owner. the founder.
GEN 2   a sibling partnership. a handful of owners who mostly all work there.
GEN 3   a COUSIN CONSORTIUM. many owners, and only some of them work there.
```
The literature calls the failure mode the **cousin consortium trap**: each
generation divides ownership into more pieces than the last, so *"by the third
generation you may have 20 cousins each holding 5%, none with meaningful
control."* One documented firm reached the third generation with **sixteen
shareholders, nine of whom worked in the business.** And the hardest named
problem is not money, it is **balance of power between branches**: a branch with
more heirs ends up with more managers, and the other branches resent it.
### (b) AND THE OTHER HALF IS MEMORY, WHICH IS MEASURED
A twenty-question yes/no scale asking children what they know about their own
family (how their parents met, where a grandparent grew up, and explicitly
*"an illness or something really terrible that happened in your family"*) turned
out to be **the best single predictor in the study of a child's emotional health
and resilience.** The follow-up is the sharper half: in families that told
**coherent, emotionally open stories about hard events**, the ten to twelve year
olds coped better over the following two years than children in families that
told those stories less openly.
The third generation is the first one with **no living memory of the struggle.**

## 2. *** THE ONE SENTENCE ***
> **THE THIRD GENERATION IS NOT CURSED. IT IS CROWDED, AND IT HAS FORGOTTEN.
> MORE PEOPLE WITH A CLAIM, AND FEWER PEOPLE WHO REMEMBER WHY.**

## 3. THE GAMES AISLE -- THE SAME ILLNESS UNDER ANOTHER NAME
The genre's late-game problem is this problem. Power creep is described as
trivialising decisions and making a game repetitive, and the specific complaint
worth having is that **the third act ends up easier than the first two even
while it hands you the best abilities in the game.** The named cures are
**horizontal additions rather than bigger numbers**, and seasons that compress
or reset the gap.
That is day 9's ruling in our own study, reached independently: growth is
horizontal, and day 10's version, **what you gain is access rather than power.**
So we already hold the right answer for act 3 and we did not get it from here.

## 4. THE MEASUREMENT -- OUR THIRD GENERATION CANNOT GET WORSE
Every write the fold makes to an inheritance block, measured today:
```
builds            Math.max(existing, tier)   <- A HARD RATCHET. NEVER FALLS.
invest            += amount
economyCapacity   += amount
karma             += amount
virtues           += amount
blindSpot         += 1                       <- monotonic
recordedKnown     += 1                       <- monotonic
territory         = owner                    (can change hands)
standings         decays 25% a generation    <- the ONLY decay in the fold
wounds            .push(target)              <- append only
```
> **THERE IS NO `-=` AND NO `Math.min` ANYWHERE IN THE FOLD.**
And the readout act 3's city is drawn from makes that visible:
```
districtTexture(fold, id):  invest <= 0 -> 'apocalypse'
                            invest <  5 -> 'recovering'
                            else        -> 'modern'
```
`invest` only ever accumulates, **so a district can travel apocalypse to
recovering to modern and can never travel back.** Act 3's city is arithmetically
incapable of looking worse than act 2's.
### AND THE TWO THINGS THE RESEARCH SAYS ACTUALLY MATTER ARE THE TWO WE CANNOT REPRESENT
- **DILUTION DOES NOT EXIST.** `selectHeir` filters living children, picks one
  by a seeded index, and **the other children are never referenced again
  anywhere in the engine.** There are no cousins, no branches, no shares, no
  claimants. Our third generation is one person, which is precisely the shape the
  research says the third generation stops having.
- **FORGETTING IS TOTAL, BECAUSE MEMORY IS WRITE-ONLY.** `wounds` appears
  **exactly twice in the whole engine**: once in the declaration, once in
  `wounds.push(e.target)`. **Nothing ever reads a wound. Nothing ever settles
  one.** Round 3 found the fold has no name and no memory; round 4 adds that the
  single field in it that IS about family memory is written and never read.

## 5. *** THE FINDING THAT PROVES US WRONG ***
It has two halves and they point in opposite directions, which is why it is
worth the round.
**FIRST, THE ROW'S OWN NAME IS WRONG AND WE SHOULD NOT BUILD IT.** The curse is
folklore resting on a contested number. A scripted decline in act 3 would be
superstition wearing a research coat.
**SECOND, AND WORSE, OUR MACHINE HAS THE OPPOSITE DISEASE.**
> **WE BUILT A DYNASTY THAT CANNOT LOSE ANYTHING AND CANNOT REMEMBER ANYTHING,
> AND LOSING AND REMEMBERING ARE THE ONLY TWO FORCES THE RESEARCH SAYS MATTER.**
Our third generation is structurally guaranteed to be the richest and safest
one that ever lived: buildings ratchet, districts only improve, the dynasty's
hidden advantage over the antagonist only grows, and nothing anywhere can
subtract. Meanwhile the crowd that makes a real third generation hard does not
exist in our model, and the memory that makes a real third generation survive is
stored in a field nothing reads.
### THE FOURTH ROUND IN A ROW LANDING ON THE SAME FILE
Round 1: the fold is generation-blind and hands an animal generation zeroes.
Round 2: a territory in a real life is a vacancy, not an inheritance, which
contradicts `territory` being permanent. Round 3: the fold decays the one thing
that really lasts and preserves the things that really go. Round 4: it cannot
model decline at all, and its only memory field is write-only. **Four
independent questions, one answer: the fold is an asset register that only goes
up, and a hundred-year dynasty is neither of those things.**

## 6. WHAT WE TAKE AND WHAT WE REFUSE
**TAKE**
- **The crowd as the shape of act 3.** More claimants than seats, and branches
  that can resent each other. Mechanism ours; who they are, how many, and what
  they want is entirely his.
- **A wound you can read.** The measured resilience finding is about knowing the
  hard story, and today ours is unreadable. This is the same row round 3 opened
  and it just got a second reason.
- **Something has to be able to go down.** Not a curse and not a script: a
  ratchet is simply a bug in a hundred-year machine. Which fields, and how far,
  is his.
- **Horizontal, not bigger, for act 3's power.** The genre's own answer and
  already ours since day 9 and day 10.
**REFUSE**
- **A scripted third-generation curse**, for the reason in section 0.
- **Decadence as the cause.** The evidence says structure. "The grandson is lazy"
  is a story about character that the research does not support, and it is also
  a worse story.
- Turning the ratchet into a decay rate inside this round. Round 3 already routed
  the decay question and one row should carry both halves.
- Inventing how many children anybody has, or which branch is which. Canon, his.

## 7. ROUTED (proposals for the coordinator -- only the coordinator adds jobs)
- **WORLD -- THE-FOLD-CARRIES-THE-WRONG-THINGS** (already proposed in round 3)
  gains a second half and gets bigger: nothing in the fold can go down, and
  `wounds` is write-only. Same row, same file, one job.
- **DYNASTY (this lane).** Q8 [inherited memory] is now doubly the sequel to
  this. Q9 [century town] inherits `districtTexture`'s one-way ladder directly.
  Q11 [lasting death] inherits the write-only wound. Q12 [heir's hour] inherits
  the crowd.
- **NOTHING FOR ANY OTHER LANE THIS ROUND.**

## 8. CONFIDENCE
- Section 4, every write, the absence of `-=` and `Math.min`, `wounds` appearing
  exactly twice, and the unreferenced non-heir children: **MEASURED** today in
  engine/bohemia_engine.js.
- The criticism of the 30/12/3 and "70%" figures: **MEDIUM-HIGH.** Several
  independent family-business practitioners and researchers make the same
  argument and trace the number to the same misused source. I did not read the
  original 1987 or early-2000s papers, so I am confident the figure is contested
  and NOT confident about the exact provenance chain.
- The cousin consortium stage, many owners with few managers, the twenty-cousins
  -at-five-percent trap and branch imbalance: consistently described across the
  family-business literature. **HIGH** as a description of the structure,
  **MEDIUM** for the specific illustrative counts, which are examples rather
  than population statistics.
- The twenty-question family-knowledge scale and its resilience result: real
  published research, and the follow-up on coherent storytelling about hard
  events is the stronger part. But it is **correlational**, it has been heavily
  popularised beyond what it claims, and knowing family stories plausibly
  travels with having the kind of family that tells them. **MEDIUM-HIGH on the
  association, LOW on any causal reading**, and the design only needs the
  association.
- The games aisle: forum and blog discussion, not peer-reviewed. **MEDIUM**, and
  used only for the shape of the complaint, which matches what our own days 9
  and 10 already ruled.
- Sections 2, 5, 6 and 7: **MY ARGUMENT AND MY ROUTING.**

## SOURCES
NAMED AS RULERS, NOT AS REFERENCES. REAL AISLE: family-business practitioner and
research writing on the shirtsleeves proverb and the 30/12/3 survival figures,
including several pieces specifically debunking the "70% by the third
generation" claim and tracing its provenance. Family-business governance
literature on the founder / sibling partnership / cousin consortium stages, the
cousin consortium trap, and balance of power between branches. Duke and Fivush's
"Do You Know?" family-knowledge scale (Emory) and the follow-up work on coherent
family storytelling about difficult events and adolescent coping. GAMES AISLE:
community and blog discussion of power creep and late-game triviality, read for
the shape of the complaint only.
IN-REPO: engine/bohemia_engine.js (`foldGeneration` and every write it makes,
`STANDING_DECAY_TO_NEUTRAL`, `selectHeir`, `districtTexture`, `monumentForm`,
`finaleLedger`, `family.wounds`); rounds 1, 2 and 3 of this study; and days 9,
10 and 16 of the BB study.
