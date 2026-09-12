# ECONOMY ROUND 32 -- Q32 [long injury]
# THE BONE IS NOT THE TIMER. GOING BACK TO WORK IS, AND IT IS TWO TO THREE TIMES
# LONGER. And the price is not a price, it is an order of things you give up.
# We built the hospital and we never built being hurt.

MODE: RESEARCH. NOTHING WAS IMPLEMENTED. This file and the bank lines are the
whole deliverable. Every finding becomes a PEOPLE, COMBAT or WORLD job later, and
only the coordinator puts it on the board.

THE ROW, VERBATIM:
  Q32 What a long injury costs a household when nobody dies of it: real material
  on convalescence in places with no hospital (who feeds the one who cannot work,
  how long a broken leg keeps someone out, what it costs in food and favours),
  and how games have made a long injury matter without a death. Deliver the timer
  ladder and the price ladder for PEOPLE [down not dead].

IT SERVES A LOCKED RULING OF HIS (9/11, laws/BOHEMIA_ADDENDUM_YOUR_PEOPLE_DO_NOT_
DIE_FOR_GOOD_9_11_26.md): "I don't want anyone to permanently die, or even have
permanent debuffs. There could be debuffs that are a lot longer than others." The
law names two rungs itself -- "a leg that takes a season, a hand that takes a year
of the valley's time" -- and closes with THE NUMBERS ARE THE COORDINATOR'S; THE
SHAPE IS HIS. So this round is allowed to bring numbers, and it brings them from
outside the studio.

---------------------------------------------------------------------------
## 1. WHAT I MEASURED IN OUR OWN CODE FIRST
---------------------------------------------------------------------------

**WE BUILT THE HOSPITAL AND WE NEVER BUILT BEING HURT.**

engine/bohemia_medical.js exists and it is 100% art. It draws a hospital campus in
full: the hospital and its ER wing, a separate ambulance court with staging bays
and a HELIPAD, a main-entrance canopy and drop-off lane, a decked parking garage,
a visitor lot and a medical office building, with an interior floorplan of ER,
intake, wards, halls and back-of-house. Its references are real hospital site
guides. And on the overmap:

    seed 1  medical tiles 2 | seed 2  4 | seed 3  4 | seed 4  2 | seed 5  2

Two to four tiles of hospital in a 9,216-tile valley, drawn to the fire-lane
standard, and NOT ONE LINE OF IT IS ABOUT AN INJURY. There is no wound state, no
downed state, no treatment, no recovery clock anywhere in the engine.

**AND THE TREATMENT LADDER IS ALREADY WRITTEN, IN THE GOODS TABLE, IN STEPS.**

engine/bohemia_economy.js GOODS carries a `kit:'field_surgery'` set, five of the
eleven goods in the game, every one base 1 and draft:true:

    step 1  iodine        mL      povidone-iodine 10%, shelf-stable for years
                                  unopened. "The most survivable disinfectant in
                                  a dead pharmacy."
    step 1  sterilewater  mL      sealed sterile water for irrigation; "boiling
                                  substitutes in a pinch, WHICH IS WHY STEP 3
                                  EXISTS AT ALL"
    step 2  lidocaine     vial    1-2%, multi-year shelf life. "The reason field
                                  extraction is survivable without a surgeon."
    step 4  tweezers      tool    DURABLE. "Sterilised, never consumed. The one
                                  piece you keep."
    step 5  antibiotics   course  injectable, and "THE SCARCE LINK -- composes
                                  with the antibiotics-runout already in canon...
                                  Everything before it is just practice if you
                                  skip it."

    STEPS PRESENT: 1, 1, 2, 4, 5.

Step 3 is absent and it is NOT a gap: the sterilewater note says out loud that
boiling substitutes for it, so step 3 is a step you pay for in TIME rather than in
goods. That is already the right shape for a place with no hospital and nobody had
to be told.

**AND THE ONE FIELD THAT WOULD HOLD A LASTING INJURY IS WRITE-ONLY.**
In engine/bohemia_engine.js, `wounds` appears EXACTLY TWICE: once declared
(`family: { heir:null, tree:[], wounds:[] }`) and once pushed
(`inh.family.wounds.push(e.target)`). Nothing reads it. A wound enters the century
and is never asked about again. (DYNASTY measured this from their side; it still
holds and I re-ran it.)

**AND THE LONGEST CLOCKS THE GAME OWNS, because a timer ladder has to be in units
the code actually has:**

    GOSSIP_WINDOW            45 min
    memory BASE_HALFLIFE    720 min   (half a day)
    a day (DAY_TURNS)      1440 min
    awake per day           960 min
    NEWS_LIFE             20160 min   (14 days)
    DEED_HALFLIFE         30240 min   (21 days)
    scav decay halflife               180 days, as 0.5^(day/180)

**THERE IS NO SEASON AND NO YEAR IN THE CODE.** I swept the day loop and the
century module for both words: nothing. So his "a season" and "a year of the
valley's time" have to be delivered in DAYS, which the game has, and the longest
existing clock in the game is the 180-day scavenge decay. That is the ceiling any
injury timer should live under, and it means a year-long injury is longer than any
clock currently in the build.

---------------------------------------------------------------------------
## 2. THE FINDING THAT PROVES US WRONG
---------------------------------------------------------------------------

The row asks "how long a broken leg keeps someone out", and the instinct -- mine
straight away -- is to look up how long a bone takes to knit and use that number.

**THE BONE IS NOT THE TIMER. GOING BACK TO WORK IS, AND IT IS TWO TO THREE TIMES
LONGER.**

The bone union figures are tidy and well documented:

    clavicle (collarbone)   6 to 8 weeks     42 to 56 days
    wrist                   6 to 8 weeks     42 to 56 days
    tibia (shin)            8 to 16 weeks    56 to 112 days
    femur (thigh)           8 to 20 weeks    56 to 140 days

And then the return-to-work data for the SAME injury, from workers' compensation
records for clavicle fractures:

    treated without surgery    69 days,  standard deviation 94
    treated with surgery      196 days,  standard deviation 287

A collarbone knits in six to eight weeks and keeps a working man out for TEN
WEEKS if it goes well and SIX AND A HALF MONTHS if it needed cutting. The sources
are explicit that full return to manual work runs several months past the point
the bone is structurally healed.

**AND LOOK AT THOSE STANDARD DEVIATIONS, BECAUSE THEY ARE THE DESIGN.** 196 plus
or minus 287. The same break, in the same bone, in the same body, is two months or
two years depending on whether it goes bad. THE SPREAD IS WIDER THAN THE MEDIAN.

That settles his two rungs against the medicine rather than against taste:
A LEG THAT TAKES A SEASON is the tibia band almost exactly -- 56 to 112 days, and
a season is about 90. A HAND THAT TAKES A YEAR is not the median of anything, and
it does not have to be: it is the TAIL, the one that went wrong, and the real
distributions have a tail that long. His instinct is defensible and the honest way
to build it is as a spread, not a fixed number per injury.

---------------------------------------------------------------------------
## 3. THE SECOND FINDING: THE PRICE IS NOT A PRICE
---------------------------------------------------------------------------

The row asks what it costs "in food and favours", and the research on what
actually happens to a poor household when somebody cannot work does not return a
price. It returns AN ORDER OF THINGS YOU GIVE UP, and it is the same order
everywhere it has been studied:

    1. BORROW
    2. SELL SOMETHING
    3. SPEND WHATEVER IS SAVED
    4. ASK FAMILY AND FRIENDS
    5. CUT FOOD
    6. TAKE SOMEBODY OUT OF SCHOOL OR SEND A CHILD TO WORK

Households use SEVERAL of these at once, not one. The last two are the ones the
literature flags as the damage: households with a high-disability member were
significantly more likely to cut food consumption, and the odds of withdrawing
children rose with severity. And the shape of the household changes: when the male
breadwinner falls ill the household becomes female-centred and assistance is
needed from the community, and it is worst when the person hurt was the only
earner.

**SO THE PRICE LADDER IS NOT "TREATMENT COSTS N". IT IS: TREATMENT COSTS SOMETHING
YOU CAN PAY, AND IF YOU CANNOT PAY IT THE HOUSEHOLD PAYS IN THAT ORDER, AND THE
BOTTOM OF THE ORDER IS WHERE IT HURTS.**

That is also round 23 [who eats first] arriving from a second direction. Cutting
food is rung five here and it was the whole subject there.

**AND WHO FEEDS THE ONE WHO CANNOT WORK, IN A PLACE WITH NO STATE: EACH OTHER, ON
A SUBSCRIPTION, AND IT TAPERS.**

Before any welfare state existed, this was solved by friendly societies -- sick
clubs. The numbers are worth having:

    contributions        a few pence a week
    sick pay             eight to ten shillings a week, and in some cases
                         designed to cover A THIRD TO A HALF of lost wages
    AND IT REDUCED AFTER A SPECIFIED NUMBER OF WEEKS
    scale, 1870s         about 32,000 societies, about 5 million members
    scale, 1910          9.5 million members
    and at the end of the 19th century they provided most of the insurance,
    benefits and pensions in Britain

**THE TAPER IS THE MECHANISM TO STEAL.** Support at a third to a half of what the
person was bringing in, stepping DOWN after a set number of weeks. Nothing about
the injury changes and month three is much harder than month one. That is how a
long injury gets worse over time without a single number on the person getting
worse, which is exactly what his no-permanent-debuffs ruling needs.

---------------------------------------------------------------------------
## 4. HOW THE CAMPAIGN LAYER DOES IT, AND THE ONE MERCY IT BUILDS IN
---------------------------------------------------------------------------

The campaign reference (its one department, per the 9/5 law, and the same one his
own 9/11 ruling quotes) runs injuries this way, in plain words:

  - HOW BAD IT IS COMES OFF HOW BIG THE HIT WAS, not off a roll after the fact.
  - RECOVERY TIME VARIES BY INJURY, and a broken leg takes a great deal longer
    than a light concussion.
  - TREATMENT COSTS MONEY AND BUYS TIME: a wound treated properly heals faster
    and does not go bad while you travel. MONEY DOES NOT REMOVE THE INJURY, IT
    SHORTENS IT.
  - THE SENSIBLE PLAY IS A BENCH, and the game says injured people in reserve DO
    NOT COMPLAIN ABOUT IT.
  - and the part he refused: permanent disabilities behind a survival roll, with
    one legendary item as the only cure.

**THE MERCY IS THE BENCH AND IT IS NOT OPTIONAL.** If sitting somebody out costs
you standing with them, the whole mechanic becomes a punishment for using your
people, and players respond by never taking anybody they care about. Injured
people resting have to be fine with resting.

---------------------------------------------------------------------------
## 5. THE TIMER LADDER
---------------------------------------------------------------------------

Four rungs, in DAYS because that is the unit the code owns, each one a RANGE
because the real data's spread is wider than its median, and each anchored to a
real figure rather than to feel. Out means out of the fight and off work.

  RUNG 1 -- KNOCKED ABOUT. 2 to 4 days. A light concussion, a bad bruise, a
  cracked rib. No treatment needed, no kit, back before anything about the
  household changes. This rung exists so that most fights cost nothing lasting.

  RUNG 2 -- AN ARM OR A HAND. 45 days to walk around with it, 70 DAYS BEFORE REAL
  WORK. The clavicle and wrist band, 42 to 56 days of bone union, and the measured
  69-day return to work for the case that went well.

  RUNG 3 -- A LEG. 56 TO 112 DAYS, AND THIS IS HIS SEASON. Straight off the tibia
  band. A season in the valley is about 90 days and it sits in the middle of that
  range, so his own word is the right word and the medicine agrees with it.

  RUNG 4 -- THE ONE THAT WENT BAD. 196 DAYS, AND THE TAIL RUNS PAST A YEAR. This
  is the surgical clavicle figure, 196 plus or minus 287, and it is the only place
  his "a hand that takes a year" belongs: not as what a hand costs, but as what a
  hand costs WHEN IT GOES WRONG. It should be rare, it should be the same injury
  as rung 2, and the difference should be whether it was treated.

**AND THE RULE THAT HOLDS THE WHOLE LADDER TOGETHER: THE RUNG IS NOT PICKED BY
THE INJURY, IT IS PICKED BY WHETHER SOMEBODY LOOKED AFTER IT.** Rung 2 and rung 4
are one broken bone. What separates them is the kit, and the kit is already in the
goods table.

Two honest notes on the units. The longest clock in the build today is the 180-day
scavenge decay, so rung 4's tail is longer than anything the game currently
counts, and somebody will have to decide whether that is a clock or a story beat.
And there is no season and no year in the code, so every one of these has to land
as days.

---------------------------------------------------------------------------
## 6. THE PRICE LADDER
---------------------------------------------------------------------------

  P1 -- TREATMENT COSTS ONE, FIVE TIMES. EVERYTHING COSTS ONE (8/15), and the
  field surgery kit is already five goods at base 1 in five steps. A full
  treatment is five ones, and ONE OF THEM IS DURABLE -- the tweezers are kept and
  reused forever, so the second patient is cheaper than the first. That is a real
  ladder, already written, and it needs no new number at all.

  P2 -- THE MONEY BUYS TIME, NOT THE CURE. Treating a wound moves it DOWN the
  timer ladder and stops it going bad. Nobody should ever be able to pay an injury
  away; that is what makes rung 4 a consequence rather than a tax.

  P3 -- A PARTIAL KIT IS NOT A PARTIAL CURE. The table already says it: step 5,
  the antibiotics, is "THE SCARCE LINK" and "everything before it is just practice
  if you skip it". Steps one to four with no step five is not eighty percent of a
  treatment. And step 3 costs TIME rather than goods, because boiling substitutes,
  which is the right answer for a valley with no hospital.

  P4 -- WHEN YOU CANNOT PAY, THE HOUSEHOLD PAYS IN ORDER. Borrow, sell, spend what
  is saved, ask family, cut food, send somebody out to work. Several at once, not
  one at a time. The last two are the failure state and the game should make them
  visible rather than silent.

  P5 -- THE HELP TAPERS. A third to a half of what they were bringing in, stepping
  down after a set number of weeks. This is the single most useful thing in the
  round: it makes a long injury get harder over time while OBEYING HIS RULE THAT
  NOTHING ON THE PERSON IS PERMANENT. The person is not getting worse. The help is
  running out.

  P6 -- AND THE BENCH IS FREE. Resting costs nothing in standing. Not a number, a
  refusal to charge one.

---------------------------------------------------------------------------
## 7. ROUTED
---------------------------------------------------------------------------

Nothing here is a job until the coordinator makes it one.

  -> PEOPLE [down not dead]  the timer ladder (4 rungs, in days, as ranges) and
                             the price ladder (6 rungs) above. The rung is picked
                             by whether anybody treated it, not by the injury.
  -> PEOPLE [down not dead]  THE TAPER is the mechanism his ruling needs: support
                             at a third to a half, stepping down by the week, so a
                             long injury worsens with nothing on the person
                             worsening.
  -> COMBAT [downed body]    how bad it is should come off HOW BIG THE HIT WAS,
                             not a roll after the fact.
  -> WORLD                   the field surgery kit is five goods, five steps, one
                             durable, step 3 paid in time not goods, and NOTHING
                             IN THE GAME USES ANY OF IT.
  -> WORLD / LIFE + CITY     we drew a hospital campus with a helipad on 2 to 4
                             tiles of every seed and the game has no concept of
                             being hurt.
  -> WORLD                   `wounds` in the fold is declared once, pushed once,
                             read never. An injury that crosses a generation has
                             nowhere to be.
  -> [PENDING Paolo]  (33)   IS A YEAR-LONG INJURY A CLOCK OR A STORY BEAT? The
                             longest clock in the build is 180 days, so rung 4's
                             tail is longer than anything the game counts. His
                             "a hand that takes a year" is either a new clock or a
                             scene, and that is a shape question, not a number.

---------------------------------------------------------------------------
## 8. WHAT IS NOT HERE, ON PURPOSE
---------------------------------------------------------------------------

I did not write an injury state, did not touch the goods table, did not set the
taper's step size or the rate of the reduction, and did not decide how rare rung 4
should be. The first three are other lanes'; the last two are rulings.

I did not invent a fifth rung for an injury nobody has a figure for. Four rungs is
what the data supports and a fifth would have been taste wearing a number.

And I did not use the medicine to argue against his ruling. Realism first says
people die of this; he traded that for attachment and the 8/4 law says the trade
is his. Everything above is inside the trade he made.

---------------------------------------------------------------------------
## 9. THE GATE NOTE
---------------------------------------------------------------------------

Every gate in this lane's subset went green, and the round found a fully drawn
hospital in a game with no injuries and a five-step surgery kit with no caller.

These gates check that a part does what it says. Nothing checks that two parts
agree, that a part keeps working for as long as the game lasts, that it is the
right part to have, or that the parts form a loop that closes. Rounds 16 through
32, same sentence. The medical district kit passes every art gate it has. A gate
asking "is there anything in this game that would send somebody here" does not
exist.

---------------------------------------------------------------------------
## 10. SOURCES
---------------------------------------------------------------------------

Bone union times by bone, and return to work against them:
  https://www.manipalhospitals.com/jaipur/blog/bone-fracture-healing-time/
  https://www.physioathome.uk/post/the-healing-process-for-upper-and-lower-limb-fractures-timeframes-treatment-and-recovery
  https://pubmed.ncbi.nlm.nih.gov/27066964/
  https://www.orthovirginia.com/blog/tibia-fracture-treatment-and-recovery/
What a household actually does when somebody cannot work, and in what order:
  https://pmc.ncbi.nlm.nih.gov/articles/PMC12281525/
  https://pmc.ncbi.nlm.nih.gov/articles/PMC6419871/
  https://www.ncbi.nlm.nih.gov/books/NBK525297/
  https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6730576/
Friendly societies: the sick pay, the taper, and the scale:
  https://robertblincoe.blog/friendly-societies-in-19th-century-britain/
  https://www.whodoyouthinkyouaremagazine.com/feature/friendly-societies
  https://fee.org/articles/friendly-societies-voluntary-social-security-and-more/
  https://en.wikipedia.org/wiki/Benefit_society
The campaign layer's injury system, in its one department:
  https://battlebrothers.fandom.com/wiki/Injuries
  https://battlebrothersgame.com/dev-blog-79-progress-update-injury-mechanics/
