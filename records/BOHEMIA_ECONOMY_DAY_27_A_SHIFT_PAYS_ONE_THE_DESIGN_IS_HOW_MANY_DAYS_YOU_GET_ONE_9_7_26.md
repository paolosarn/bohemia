# ECONOMY ROUND 27 -- Q27 [shift pay]
# A SHIFT PAYS ONE. THE DESIGN IS NOT THE NUMBER, IT IS HOW MANY DAYS YOU GET ONE.
# And right now a full day of work buys a bag of food and you still starve,
# because the food never lands in your hands.

MODE: RESEARCH. NOTHING WAS IMPLEMENTED. This file and the bank lines are the
whole deliverable. Every finding becomes a WORLD or LIFE + CITY job later, and
only the coordinator puts it on the board.

THE ROW, VERBATIM:
  Q27 What a shift is worth against everything else: with WORLD [a days work]
  coming, research real day-labour rates against daily food and shelter in
  collapsed economies, and deliver the number of batteries a shift should pay so
  a day of work covers a day of living and not much more.

---------------------------------------------------------------------------
## 1. I RAN THE WHOLE DAY IN OUR OWN CODE BEFORE READING ANYTHING
---------------------------------------------------------------------------

The row asks what a shift should pay against a day of living. So I priced a day
of living first, out of the real modules, and then ran a day.

**WHAT A DAY OF LIVING COSTS, from PURSE.VERBS, all four frozen and live:**

    day:ate       1 resources     the people who depend on you ate
    fight:plate   1 resources     the plate you wore at the bell is spent
    night:power   1 electricity   every lit circuit you hold burned one
    ask:leaned    1 clout         you leaned on somebody

So the floor of a day is ONE RESOURCE, and every lit circuit you hold adds ONE
BATTERY on top of it, every night, forever.

**WHAT WORK PAYS:**

    PAYOUT.COMPLETE          1 electricity   (finishing a job)
    PRODUCTION default       1 resources     (a building you placed, per day)

**AND THE FIRST THING THAT FALLS OUT IS THAT THEY ARE NOT THE SAME CURRENCY.**
Work pays batteries. Eating spends resources. A day of work does not cover a day
of living in the direct sense at all; it covers your electricity bill and buys
you the right to go to a shop.

**SO I RAN THE FULL LOOP, LIVE, ON THE REAL MODULES:**

    boot                      res 0 | elec 0 | clout 0
    after finishing one job   res 0 | elec 1 | clout 0     applied: true
    after buying food         res 0 | elec 0 | clout 0     applied: true, paid 1
    after the day eats        res 0 | elec 0 | clout 0     applied: FALSE
                                                           reason INSUFFICIENT

**A FULL DAY OF WORK BUYS A BAG OF FOOD AND YOU STILL STARVE.** The battery
leaves the purse and the food never arrives in it. payday.buy() debits the price
and never credits the good; its own comment explains, correctly, why the MONEY is
destroyed ("a hard sink, on purpose... the value is DESTROYED rather than moved")
and never mentions delivering the thing you bought.

SAY THE HONEST PART: this is a KNOWN GAP and it is already on the board. WORLD's
own STATE line names it and gives it to [rice clock]. I did not discover it. What
this round adds is that it is the exact reason the row's question cannot be
answered by a number: NO SHIFT PAY MAKES A DAY OF WORK COVER A DAY OF LIVING
WHILE THE PIPE BETWEEN BUYING AND HAVING IS OPEN AT ONE END.

**AND THE SHIFT ALREADY HAS A LENGTH, MEASURED, IN TWO PLACES THAT AGREE:**

    bohemia_dayloop.js   WAKE_MIN 360, NIGHT_MIN 1320   -> 960 waking minutes
    bohemia_agents.js    worker WORK 448 min            -> 47% of the waking day

A shift in this valley is 448 minutes. At the walked surface's own 0.084 minutes
per cell and 0.75 m cells, that is about 4 km of broken ground or 8 km of road,
against a full waking day of 8.6 km and 17.1 km. The clock for [a days work]
exists and nobody had to invent it.

---------------------------------------------------------------------------
## 2. THE FINDING THAT PROVES THE ROW'S OWN PREMISE WRONG
---------------------------------------------------------------------------

The row asks for a number "so a day of work covers a day of living and not much
more". That is a real and well-studied target -- economic historians call it a
WELFARE RATIO, the number of bare-bones subsistence baskets a labourer's wage
buys. A ratio of 1.0 means your work feeds you exactly and nothing more. Allen's
method is the standard one and it is used from early modern Spain to Buenos Aires
to colonial Chile. A subsistence household sitting at or near 1.0 is described in
that literature as a SEVERE LIFE-CYCLE SQUEEZE. Not a comfortable target. The
edge of the cliff.

**AND THEN THE THING THAT BREAKS THE WHOLE FRAMING: NOBODY WORKS EVERY DAY.**

A day rate at ratio 1.0 only feeds you if you get hired 365 times a year, and
day labour has never worked like that. Measured in a Gujarat survey: casual
workers averaged 254 days of work a year, against 354 for salaried workers and
338 for the self-employed, AND THE BOTTOM THIRD WORKED 137 DAYS. Village studies
of rural India find workers getting less than six months of employment in a year
and call it severe underemployment. The standard planning assumption of 22 days a
month is roughly the AVERAGE, not the floor.

So a shift that exactly covers a day of living pays you, across a year:

    254 days worked / 365      = 0.70 of a living
    137 days worked / 365      = 0.38 of a living

**A DAY RATE THAT COVERS A DAY IS A STARVATION WAGE, BECAUSE THE DAYS YOU DO NOT
WORK STILL EAT.**

The theory has an answer for this and the theory does not hold. Casual work is
supposed to carry a loading -- commonly 25% -- to compensate for insecurity and
for having no paid leave. In practice, measured across occupations, most casual
workers get a premium of 2% to 5%, three occupations carry a PENALTY of 3% to 6%,
and 34.3% of casual workers surveyed said they received no loading at all. The
premium that is supposed to pay for the idle days mostly does not exist.

**THAT IS WHY DAY LABOURERS ARE POOR, AND IT IS NOT THE RATE. IT IS THE GAPS.**

---------------------------------------------------------------------------
## 3. AND IN AN ACTUAL COLLAPSE THE RATIO IS NOT 1.0. IT IS 0.2.
---------------------------------------------------------------------------

The row says "in collapsed economies", and the collapsed numbers are not a
squeeze, they are a different universe.

  VENEZUELA. The minimum wage covers less than 0.2% of the basic basket. Stated
  the other way round, which is the way that lands: IT TAKES JUST OVER FIFTEEN
  MONTHS OF THE MINIMUM WAGE TO EAT FOR ONE MONTH. The basket for a family of
  five ran $322 in March 2021 and $471 in March 2022, up 46% in a year.

  LEBANON. In July 2021 a family's food budget alone was about FIVE TIMES the
  minimum wage; more recent reporting puts the basics at nearly TEN TIMES. A
  month's bread alone reached 44% of the minimum wage.

So in the crash this game simulates, the welfare ratio of a wage is not 1.0 and
not 0.7. It is somewhere between 0.2 and 0.1, and the honest reading is that
**WAGES STOP BEING HOW ANYBODY EATS.** Which is the same sentence this study has
now arrived at from five directions: work is one strand, and in a collapse it is
not the thickest one. What fills the gap is scavenging, the household, credit,
favours, and going without -- rounds 15, 21, 23, 24 and 26 in order.

---------------------------------------------------------------------------
## 4. THE DESIGN SIDE, AND WHY A RATIO OF EXACTLY 1.0 IS ALSO BAD GAME
---------------------------------------------------------------------------

The economy-design literature has a name for income that exactly equals upkeep:
THE TREADMILL. The player runs faster to stay in the same place. It is the
failure mode that gets named every time somebody writes about upkeep costs, and
it is what a welfare ratio of exactly 1.0 produces mechanically.

So the two sides agree from opposite directions:
  the historians say 1.0 is the edge of the cliff, not a resting place;
  the designers say 1.0 is a treadmill and it feels like one.

**THE RESOLUTION: A SHIFT SHOULD PAY MORE THAN A DAY COSTS, AND THE DAYS YOU
CANNOT GET A SHIFT SHOULD BE WHAT TAKES IT BACK.** The surplus is real and it is
visible and the player can feel themselves getting ahead, and then a week arrives
with three shifts in it. That is both what the record says happened and the
version that is a game rather than a chore.

---------------------------------------------------------------------------
## 5. THE NUMBER THE ROW ASKED FOR
---------------------------------------------------------------------------

**A SHIFT PAYS ONE BATTERY.**

That is not me picking a number. EVERYTHING COSTS ONE (8/15) and BATTERIES ARE
THE MONEY (9/4) already picked it, PAYOUT.COMPLETE already carries it with both
rulings on the row, and nothing in this round gives a reason to move it. Against
a day of living that costs one resource plus one battery per circuit held, one
battery a shift is a welfare ratio of about 1 for a player holding nothing, which
is exactly the target the row names.

**SO THE DELIVERABLE IS NOT THE PAYOUT. IT IS THE THREE THINGS AROUND IT.**

  1. HOW MANY DAYS YOU GET ONE IS THE WHOLE DESIGN. The real spread is 137 to
     254 days out of 365 and the bottom third lives at the bottom of it. Tuning
     the payout does nothing the availability does not undo. If WORLD [a days
     work] ships a shift you can take every single day, it has built a salary and
     called it day labour, and every finding above stops applying.

  2. THE SHIFT MUST NOT BE THE ONLY WAY TO EAT, BECAUSE IT NEVER WAS. At a real
     collapse ratio of 0.2 the wage is a strand, not the rope. The other strands
     are already built or already found: scavenging (bohemia_economy's own
     scav yield, decaying at half every 180 days), a placed building's daily
     yield, favours you are owed, and going without, which round 23 priced.

  3. THE SURPLUS IS THE POINT AND SO IS LOSING IT. One battery clear on a day you
     work, nothing on a day you do not. Never exactly break-even, or it is a
     treadmill by construction.

**AND THE BLOCKER, WHICH IS BIGGER THAN ANY OF IT: TODAY A FULL SHIFT'S PAY BUYS
FOOD AND THE FOOD DOES NOT ARRIVE.** Until buy() hands you the thing, a shift
that pays one battery and a shift that pays a hundred are the same shift, because
neither of them feeds anybody.

---------------------------------------------------------------------------
## 6. ROUTED
---------------------------------------------------------------------------

Nothing here is a job until the coordinator makes it one.

  -> WORLD [a days work]   the shift is 448 minutes and the clock already exists
                           in two modules that agree. It pays ONE, off his own
                           two rulings, and NOTHING NEW HAS TO BE TUNED.
  -> WORLD [a days work]   the design is the availability, not the payout: 137 to
                           254 days out of 365 is the measured real spread. A
                           shift you can take every day is a salary.
  -> WORLD [rice clock]    already theirs, and this round is the arithmetic proof
                           of why it blocks everything: work, buy, eat, INSUFFICIENT.
  -> LIFE + CITY           work pays batteries and eating spends resources, so the
                           two halves of a day are in different currencies and the
                           only bridge is a shop that does not deliver.
  -> [PENDING Paolo]  (27) HOW OFTEN CAN A PLAYER GET A SHIFT? This is the only
                           number in the round that his rulings do not already
                           answer, and it is the one that decides everything.

---------------------------------------------------------------------------
## 7. WHAT IS NOT HERE, ON PURPOSE
---------------------------------------------------------------------------

I did not invent a second payout number, a loading, a surplus size or a
days-per-week figure. The payout is his and already ruled; the availability is
his and is pending; the rest is arithmetic on top of them.

I did not price shelter, which the row also names, because a night in this game
costs by CIRCUIT HELD and not by roof, so there is no rent to compare against.
Saying that plainly is more useful than converting somebody else's rent figure
into a mechanic we do not have.

And I did not claim the buy-does-not-deliver gap as a finding of mine. It is on
the board already and this round only measured what it costs.

---------------------------------------------------------------------------
## 8. THE GATE NOTE
---------------------------------------------------------------------------

Every gate in this lane's subset went green, and a run of the game's own modules
in the game's own order -- finish a job, buy food, eat -- ends in INSUFFICIENT.

These gates check that a part does what it says. Nothing checks that two parts
agree, that a part keeps working for as long as the game lasts, that it is the
right part to have, or that the parts form a loop that closes. Rounds 16 through
27, same sentence, and this round is the plainest statement of the last clause
the study has produced: THE LOOP IS WORK, BUY, EAT, AND IT DOES NOT CLOSE. Every
one of the three parts passes its own gate.

---------------------------------------------------------------------------
## 9. SOURCES
---------------------------------------------------------------------------

Welfare ratios and the bare-bones basket (Allen's method):
  https://www.sciencedirect.com/science/article/abs/pii/S169869891630073X
  https://link.springer.com/chapter/10.1007/978-3-031-91930-5_10
  http://glineq.blogspot.com/2018/06/bob-allens-new-poverty-machine-and-its.html
Days actually worked by casual labour, and rural underemployment:
  https://ras.org.in/index.php?Article=on_days_of_employment_of_rural_labour_households
  https://www.wiego.org/wp-content/uploads/2020/10/WIEGO_Statistical_Brief_N24_India.pdf
  https://www.dataforindia.com/informal-sector/
The casual loading that is supposed to pay for the idle days, and does not:
  https://www.actu.org.au/wp-content/uploads/2023/05/media1034177a4_ctr_casual-loading.pdf
  https://theconversation.com/the-costs-of-a-casual-job-are-now-outweighing-any-pay-benefits-82207
Wage against the food basket in a real collapse:
  https://latinoamerica21.com/en/the-reality-of-wages-in-venezuela/
  https://www.infobae.com/en/2022/04/21/inflation-in-venezuela-the-basic-food-basket-increased-by-46-in-one-year
  https://www.france24.com/en/live-news/20210721-lebanon-families-spend-5-times-minimum-wage-on-food-study
  https://reliefweb.int/report/lebanon/lebanon-months-worth-bread-costs-44-minimum-wage-families-cut-back-basic-food
The treadmill, and upkeep against income in game economies:
  https://gamedesignskills.com/game-design/economy-design/
  https://machinations.io/articles/the-machinations-manifesto-for-building-sustainable-game-economies
