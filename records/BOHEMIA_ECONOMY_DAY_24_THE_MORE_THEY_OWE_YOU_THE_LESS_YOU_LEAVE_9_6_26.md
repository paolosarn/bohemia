# ECONOMY -- ROUND 24: THE MORE THEY OWE YOU, THE LESS YOU LEAVE
# (ECONOMY lane, 9/6/26. MODE: RESEARCH -- nothing here is implemented.)
# Question Q24 [pay on time], verbatim from VAMILY.md:
#   "What being paid late does to a person and a town: real research on wage
#    arrears in informal work, how long people keep showing up unpaid, and when
#    they stop; and how games have made a missed payday matter. Deliver what our
#    shift's pay should do when it does not come."
# Named DAY 24 for the machine. A round is one VAMILY and is never called a day
# to Paolo (NO CALENDAR TALK, 9/5, LOCKED).
#
# THE ROWS THIS SITS BESIDE, both harvested from this lane and now on other
# boards: WORLD [a days work] (from round 20) and RUN [a shift] (from round 21).
# This round is what happens when that shift's pay does not arrive.

## 0. THE HEADLINE

Measured first: **pay in Bohemia cannot be late, because there is no gap for it to
be late in.**

```
finish a job at nightfall  ->  applied:true, paid {electricity:1}
a job that failed          ->  applied:false, reason NO_RULING
```

> **TWO STATES EXIST: PAID, AND NOBODY RULED WHAT IT IS WORTH. THERE IS NO THIRD
> STATE CALLED "THEY DID NOT PAY YOU."** The purse's kinds are source, drain,
> convert and transfer, and none of them is OWED.

And the real record says the thing I was going to design is backwards:

> **THE MORE COMMON IT IS FOR PEOPLE NOT TO BE PAID, THE LESS LIKELY THEY ARE TO
> LEAVE. In Russia at the end of 1999, nearly two thirds of employees were owed
> back wages, averaging 4.8 months of pay each, and the effect on quitting varied
> NEGATIVELY with how widespread the practice was locally.**

## 1. WHAT I MEASURED ON OUR OWN BUILD FIRST

### 1a. THE PAY LANDS ON THE SAME BEAT THE JOB ENDS
`payForToday()` fires at nightfall off the quest runtime's finished state, calls
`payForQuest`, and either credits or reports its refusal. There is no scheduling,
no due date, no arrears field, and nowhere for a payment to sit unpaid.

### 1b. AND THE PURSE CANNOT HOLD ONE, ON PURPOSE, WHICH IS RIGHT
> *"Balances never go negative, so no hidden debt system exists by accident --
> debt would be canon, and canon is Paolo's."*

Round 9 measured the same absence from the credit side and agreed with the
reasoning. It has a consequence nobody has written down before: **it means nobody
can be owed, in either direction.** Not the player, and not the people who depend
on him.

### 1c. THE THREE ARREARS THIS DESIGN ALREADY IMPLIES, AND NONE OF THEM IS BUILT
```
1  SOMEBODY OWES THE PLAYER    a job that does not pay        DOES NOT EXIST
2  THE PLAYER OWES HIS PEOPLE  day:ate refused                refusal recorded,
                                                              no consequence (round 23)
3  A FACTION STOPS PAYING      BB-UNPAID-TURNS-PREDATORY      QUEUED, unbuilt
```
The third one is already written in the backlog and it is good: *"AN ARMED GROUP
THAT STOPS BEING PAID DOES NOT DISAPPEAR. IT BECOMES SOMEBODY ELSE'S PROBLEM...
TAKE A FACTION'S LIGHTS AND YOU HAVE NOT WEAKENED THEM, YOU HAVE RELEASED THEM."*

## 2. THE REAL AISLE

### 2a. GETTING STIFFED IS NOT AN EDGE CASE. IT IS A COIN FLIP.
In the informal day-labour market that most resembles a shift in our valley:

> **49% of day labourers have experienced outright wage theft -- worked the day and
> were not paid at the end of it. 48% have experienced underpayment.** And it
> happens after days or even weeks of work, not just after one shift.

**About half.** Whatever our shift's pay does when it does not come, the record says
it should not be a rare event dressed as a disaster.

### 2b. AND WHEN IT IS COMMON, PEOPLE DO NOT LEAVE. THEY STAY LONGER.
Russia in the 1990s is the best-documented mass case and it is the finding of the
round:

> **By the end of 1999, nearly two thirds of Russian employees reported being owed
> overdue wages, with an average debt of 4.8 monthly wages per affected worker.**

Almost five months of pay, owed, to two people in three. And the quitting behaviour
is the part that overturns the intuition:

> **The effect of arrears on quitting varies NEGATIVELY with how prevalent the
> practice is in the local labour market.** Arrears were highest in rural regions
> with low hiring rates, concentrated labour markets, and a history of arrears.
> **The practice became normalised, and normalisation reduced the incentive to
> leave.**

Two things hold somebody in place at once. **There is nowhere to go**, because
every employer locally does the same thing. And **leaving forfeits what you are
owed:** five months of wages is not a grievance, it is collateral, and it belongs
to the person who has not paid you.

> **UNPAID WAGES ARE A HOSTAGE. THE LONGER THEY OWE YOU, THE MORE EXPENSIVE IT
> BECOMES TO WALK AWAY.**

### 2c. EXCEPT FOR THE PEOPLE WHO HAVE ANOTHER WAY TO EAT
The historical mercenary record is the exact opposite case and the two together are
the rule.

Free companies were **"armies of mercenaries acting independently of any
government, and they regularly made a living by plunder when they were not
employed."** Caferro's judgement is that they were **"notoriously difficult to
control and prone to desertion if not paid regularly."** In peacetime they became a
marching plague, rolling from region to region leaving **devastation, plunder and
blackmail** behind them, and towns paid them to go away.

> **THE DIFFERENCE IS NOT LOYALTY. IT IS WHETHER THE UNPAID PERSON HAS ANOTHER WAY
> TO EAT.** A worker with no alternative stays and is owed more. An armed man with
> an alternative leaves and becomes the next town's problem.

### 2d. WHAT IT DOES TO A TOWN
Both halves land on the town, not the employer:
- The worker who stays unpaid **stops buying**, which is round 15's Argentina
  measurement from the other end: shop sales fell 50-70% in four days when the
  money became unreachable.
- The armed man who leaves unpaid **becomes a bill somebody else pays.** The
  employer saved a wage; a town three valleys away pays for it.

## 3. THE GAMES AISLE, IN PLAIN WORDS
(No game he has not named enters the design. The campaign layer is BATTLE
BROTHERS' department by his 9/5 ruling, and the backlog already cites it there.)

Our own canon has the mechanic and it is the right one:
> *"Its burn is PAYROLL and its punishment is LONELINESS: miss wages or food and
> mood drops, keep missing and men DESERT. You do not die of poverty in that game,
> YOU END UP ALONE."*
> *"ONE thing not five meters; it SCALES WITH SUCCESS so a bigger operation is a
> bigger obligation; the punishment is a person walking away, not a bar draining."*

**And section 2b says that is only half of it.** Desertion is what happens to people
who have somewhere to go. The other half, the one the campaign-layer mechanic does
not model and the real record insists on, is **the person who cannot leave and is
owed more every week.**

## 4. *** THE FINDING THAT PROVES US WRONG ***

I came into this round expecting to deliver a patience meter: miss a payday and
people are annoyed, miss three and they walk. That is the intuitive design and it is
what our own backlog assumes.

> **THE REAL RECORD SAYS THE OPPOSITE. WHEN NOT PAYING IS NORMAL, NOBODY WALKS.
> THEY STAY, THEY ARE OWED MORE, AND STAYING IS THE RATIONAL THING TO DO BECAUSE
> LEAVING FORFEITS THE ARREARS.**

Two thirds of a country owed almost five months of pay, and the more common it was
where you lived, the less likely you were to quit.

**And the exception is the whole rule.** The people who did leave were the ones with
another way to eat, and what they did with it was rob the next town. So Bohemia
already has both halves and they are the same mechanism seen from two sides:

```
BB-OBLIGATION-BURN            a man with somewhere to go walks away    (built as design, unbuilt)
BB-UNPAID-TURNS-PREDATORY     and what he does next is somebody else's problem
THE MISSING HALF              a man with nowhere to go stays, and is owed more
```

**Which means an unpaid shift is not a punishment. It is a hold.** And that is the
better mechanic, because a punishment makes a player stop and a hold makes him come
back angrier.

## 5. WHAT OUR SHIFT'S PAY SHOULD DO WHEN IT DOES NOT COME

Mechanism only; every amount, name and ruling stays his. Nothing here puts a debt
on the purse or a meter on anybody.

**1. IT HAS TO BE POSSIBLE FOR PAY NOT TO COME.** Today there are two states and
neither is it. **A third is needed and it is not a negative balance:** the purse's
refusal to go negative is correct and round 9 already settled it.

**2. BEING OWED IS AN OPEN ITEM WITH A FACE.** Round 9's exact shape, and every
organ is live: *it is open, it has a face, it is one, it travels, it costs access.*
An unpaid shift is that, pointed the other way: **somebody owes the player, and the
player knows who.**

**3. IT SHOULD BE COMMON.** Half of real day labourers have been stiffed. A shift
that always pays is not a shift in this valley; a shift that never pays is a
different game. **Half is the number the record gives and the ratio is his.**

**4. AND BEING OWED SHOULD PULL HIM BACK, NOT PUSH HIM AWAY.** This is the finding
and the whole design. The more they owe, the more expensive it is to walk. **A
player who is owed four shifts is a player with a reason to return to somebody he
does not like.** No meter, no anger bar, no timer: just a number of unpaid days
attached to a person's name.

**5. AND THE WAY OUT IS HAVING SOMEWHERE ELSE TO EAT.** The exit exists only for
somebody with an alternative, and that is round 18's second seat, round 19's second
regular, and round 21's container, all the same door. **Walking away from arrears
should cost the arrears**, which is what makes the alternative worth having.

**6. WHAT THE PLAYER OWES RUNS THE SAME WAY.** Round 23 measured that when
`day:ate` cannot be paid, the refusal is recorded and nothing follows. The people
who depend on him are in exactly the position section 2b describes: **they stay
because they have nowhere to go, until one of them does.** That is
BB-OBLIGATION-BURN's *"you end up alone"* with the missing middle put in.

## 6. REFUSED

- **A NEGATIVE BALANCE OR A DEBT ON THE PURSE.** Its own reasoning, round 9's
  finding, and this round does not reopen it.
- **A PATIENCE METER OR AN ANGER BAR.** Section 4 says it is the wrong shape and
  the anti-spreadsheet ruling forbids the surface.
- **A TIMER THAT FIRES DESERTION AT N MISSED PAYDAYS.** Same reason. Whether
  somebody leaves depends on whether they have somewhere to go, not on a count.
- **INTEREST ON ARREARS.** Round 9 refused interest and round 16 refused the fee
  ladder. Unpaid wages grow by not being paid, not by a rate.
- **RULING HOW OFTEN A SHIFT STIFFS YOU.** The record says about half; the ratio is
  contents and contents are his.
- **ANY IMPLEMENTATION.** MODE: RESEARCH.

## 7. ROUTED

**TO WORLD, on [a days work] and RUN's [a shift]:**
1. **A SHIFT NEEDS TO BE ABLE TO NOT PAY.** Two states exist and neither is "they
   did not pay you". It is not a negative balance; it is an open item with a face.
2. **AND BEING OWED SHOULD BRING HIM BACK.** The more they owe, the more expensive
   walking away is. That is the hook, it is realistic, and it needs no meter.

**TO PEOPLE, who own the open-item organs:**
3. **THIS IS ROUND 9'S SHAPE POINTED THE OTHER WAY.** Everything needed
   (`whoHears`, `memory`, `commitment`, the standing rungs) is live. Round 9 had the
   player owing; this has the valley owing the player.

**TO WORLD, on [neglect costs] BB-OBLIGATION-BURN and BB-UNPAID-TURNS-PREDATORY:**
4. **THEY ARE ONE MECHANISM, NOT TWO.** A man with somewhere to go leaves and turns
   predatory; a man with nowhere to go stays and is owed more. **The missing half is
   the second one**, and it is the more common one by a long way.

**TO THE COORDINATOR, for Paolo:**
5. **[PENDING Paolo]** Can somebody in this valley owe the player, and be seen not
   paying? It is the mirror of the standing pending from round 22 and of the debt
   pending from round 9, and all three are the same ruling: **whether an unsettled
   thing between two people is a thing this game keeps.**

## 8. TEST MATERIAL
`banks/BOHEMIA_ECONOMY_TEST_LINES_9_5_26.md`, sections PPPPP through TTTTT. Every
line `draft:true`, in the bank, never in the game.

## 9. SOURCES

REAL AISLE
- John S. Earle and Klara Sabirianova Peter, "How Late to Pay? Understanding Wage
  Arrears in Russia" (Journal of Labor Economics, 2002): nearly two thirds of
  employees owed overdue wages by the end of 1999, averaging 4.8 monthly wages per
  affected worker; and the effect of arrears on quitting varying negatively with
  how prevalent the practice was locally, with arrears highest in rural regions
  with low hiring rates and a history of the practice --
  journals.uchicago.edu/doi/10.1086/339612 ;
  research.upjohn.org/up_workingpapers/77/ ; docs.iza.org/dp65.pdf ;
  research.upjohn.org/cgi/viewcontent.cgi?article=1114&context=up_workingpapers
- Abel Valenzuela and colleagues, national day labor study: 49% of day labourers
  having experienced wage theft and 48% underpayment, sometimes after days or weeks
  of work -- link.springer.com/article/10.1007/s12134-013-0303-7 ;
  du.edu/news/professors-research-investigates-wage-theft-among-colorado-day-laborers ;
  epi.org/publication/employers-steal-billions-from-workers-paychecks-each-year/
- Free companies: mercenaries acting independently of any government who regularly
  made a living by plunder when not employed; William Caferro on their being
  notoriously difficult to control and prone to desertion if not paid regularly;
  and the peacetime pattern of devastation, plunder and blackmail --
  en.wikipedia.org/wiki/Free_company ; en.wikipedia.org/wiki/White_Company ;
  peterleeson.com/The_Golden_Age_of_Mercenaries.pdf ;
  warhistory.org/article/medieval-free-companies-i

GAMES AISLE (mechanics only; the campaign layer is BATTLE BROTHERS' department by
his 9/5 ruling, and the backlog cites it there)
- BOHEMIA_BACKLOG.md, BB-OBLIGATION-BURN (payroll as the burn, loneliness as the
  punishment, a person walking away rather than a bar draining, one thing scaling
  with success) and BB-UNPAID-TURNS-PREDATORY (an unpaid armed group becoming
  somebody else's problem)

OUR OWN REPO (every figure measured this round)
- engine/bohemia_purse.js (KINDS with no OWED, and the no-negative-balance
  reasoning), engine/bohemia_payday.js (payForQuest and its two outcomes)
- slices/BOHEMIA_CITY_WORLD.html: payForToday() firing at nightfall with no due
  date and no arrears field
- VAMILY.md: WORLD [a days work] and RUN [a shift], both harvested from this lane
- records/BOHEMIA_ECONOMY_DAY_9 (an open item has a face), DAY_15 (Argentina's
  shops losing two thirds of trade in four days), DAY_23 (day:ate refused with no
  consequence) -- re-cited, not re-derived

## 10. GATE STATE THIS ROUND

Green, run this round: economy 13/0, payday 38/0, purse 28/0, attempt 15/0,
canon rot 13/0, demo blockers 22/0, language 81/0.

**AND THE GATE PATTERN THIS LANE HAS BEEN NAMING SINCE ROUND 16 GOT ANSWERED BY
SOMEBODY ELSE THIS ROUND**, which is worth recording as a correction to the shape
of my own note rather than a repeat of it. A commit landed on main titled *"A GATE
THAT NEVER RUNS IS NOT A GATE: six shipped jobs had green gates the suite never
ran, so the suite goes red on zero and registration is derived."*

That is a different hole from the one this lane kept finding, and a real one: a
gate that exists but is not in the suite. **Mine was gates that run, pass, and are
correct, while the thing they check is connected to nothing.** Both are true and
they are not the same defect. Recorded so a future round does not read the fix as
covering the pattern in rounds 16 to 23, because it does not.

`payday_gate` is 38 for 38 this round over a pipe in which pay cannot be late,
which is the ninth round running of the same shape. Not this lane's to fix and not
a criticism of any gate.
