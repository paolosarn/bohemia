# BB STUDY — DAY 7: WHY YOU LEAVE THE HOUSE
# (coordinator, on his trigger plus five words: "YOU ARE NOT DONE WITH
# STUDYING BATTLE BROTHERS." Days 1-6: records/BOHEMIA_BB_STUDY_DAY_*.md)

## 0. THE QUESTION, AND IT IS THE ONE UNDER ALL THE OTHERS
Day 1 asked what work the world OFFERS you. Day 2 asked what things cost.
Day 6 asked who holds the ground. **NOBODY ASKED WHY YOU GET UP.**
In a hundred-hour game with no runs, the motor matters more than any
single system: what makes a player who is safe, housed and finished with
today decide to go out TOMORROW? Battle Brothers has a famous answer and
it is not the fighting.

## 1. BB'S MOTOR IS PAYROLL, AND ITS PUNISHMENT IS NOT DEATH
- **WAGES ARE PAID DAILY, AT NOON.** Every man has a wage in crowns. It
  goes UP as he levels (+2 a level), and a greedy man costs more from the
  day he joins.
- **EVERY MAN EATS 2 UNITS OF FOOD A DAY**, unless his background says
  otherwise (spartan eats less, gluttonous eats more).
- **AND THE KIT BURNS TOO:** tools to repair armour, medicine for the
  injured. The company consumes even when nothing happens.
- ***THE PENALTY FOR FAILING TO PAY OR FEED IS NOT DAMAGE. IT IS MOOD,
  AND THEN DESERTION.*** Miss payroll and their mood drops; keep missing
  it and men LEAVE. **You do not die of poverty in that game. YOU END UP
  ALONE.**
### WHY THAT SHAPE IS THE FINDING
**IT IS ONE NUMBER, IT SCALES WITH WHAT YOU OWN, AND IT IS PUNISHED
SOCIALLY.** One number, so the player can hold it in their head. Scaling,
so success itself raises the stakes — a bigger, better company is a bigger
bill, which is why the game never runs out of pressure. And social, so the
loss is a person walking away rather than a health bar going down.
**THAT IS A MOTOR WE CAN BUILD WITHOUT HIM RULING A SINGLE NUMBER, and
that is not a small point — see §5.**

## 2. THE SHELF, MEASURED ON THE SURFACE HE WALKS
### (a) THE DAY LOOP IS REAL AND ITS STAKES TABLE IS EMPTY ON PURPOSE
The walked surface has a full day: wake at 06:00 because "the sun is the
thing you are racing", nightfall at 22:00 whether you like it or not, the
option to sleep early and give the hours back, and a RECKONING card. And
its own header states the hole in plain words:
> *"WHAT THIS DELIBERATELY DOES NOT DO, and it is not an oversight: NO
> DAMAGE BEFORE THE DIAL. The reckoning REPORTS; it does not starve you,
> drain you, or kill you. Hunger, exhaustion, rent, a debt clock and every
> other stake are CONTENTS... The loop is built so that any of them drops
> in as one entry in a **STAKES table that is empty on purpose.**"*
**THE SOCKET IS BUILT AND LABELLED. NOTHING IS PLUGGED INTO IT.**
### (b) THE VALLEY BURNS EVERY DAY. YOU DO NOT.
At nightfall the walked surface calls `mktAdvanceDay()` →
`BohemiaEconomy.advanceDay(ledger, agents)`: **stock is produced, EATEN,
and the shortfall logged.** The economy can already answer
`daysLeft(ledger, good)` — how many days of a thing are left before it
runs out.
**SO THE MARKET EATS AND KNOWS HOW LONG IT HAS. THE PLAYER EATS NOTHING
AND HAS NO CLOCK AT ALL.** The world has a metabolism and you are a
tourist in it.
### (c) THE ONE THING THAT IS CHARGED — AND IT IS CHARGED IN THE DARK
There is exactly one daily cost on the walked surface, and it is not
food, rent or fuel. It is **PEOPLE YOU SAID YOU WOULD SHOW UP FOR.**
`ctNeglectFor()` walks every outfit you have made a commitment to, and if
you did not turn up today it takes standing away — "nothing said, nothing
owed", so it only bills what you actually promised.
**IT IS THE RIGHT MECHANIC AND THE PLAYER IS NEVER TOLD IT HAPPENED.**
Measured: `ctNeglectFor` has exactly two mentions in the file — its
definition and its one call. The call sits in the SLEEP-tap callback,
inside a `try{}catch{}`, **and its return value is thrown away.** It
returns a list of `{faction, lost, now}` and nobody reads it.
And the timing makes it worse than a missing line: the reckoning card is
built and shown FIRST, and the charge happens **on the tap that dismisses
it.** The card lists steps, districts, buildings entered, the job outcome
and what you were paid. **IT NEVER SAYS WHO YOU LET DOWN — and the bill
is rung up at the exact moment the card that could have told you is
already gone.**
### (d) AND DAY 6'S LANDLORD RULE IS ALREADY WRITTEN
`engine/bohemia_mandate.js` already implements the encompassing-interest
mechanic Day 6 derived from scratch, and better than I described it:
> *"A district pays only while it is BOTH yours and patrolled. Losing the
> patrol closes the faucet the same turn — no decay curve, no grace
> period, because the whole point is that holding ground costs something
> continuously. LIGHT = TERRITORY and nobody patrols the dark, so an
> unlit district cannot be patrolled and therefore cannot pay."*
Yours, LIT, and patrolled, or it pays nothing. **THE INCOME SIDE OF THE
MOTOR EXISTS AND IT IS EXCELLENT.** It is also, per Day 6, wired to a
faction world that does not run where he walks.

## 3. THE OTHER AISLE — WHAT UNPAID SOLDIERS ACTUALLY DID
The historical companies are the real version of BB's payroll problem and
they answer a question our design has not asked.
- Free companies were mercenary armies hired by private employers, and
  they ***"regularly made a living by plunder when they were not
  employed."***
- The White Company kept chancellors, notaries and treasurers and signed
  legally binding contracts — **and was simultaneously known for
  widespread pillaging and extortion.** Organised and predatory at once.
- The historian William Caferro on the medieval mercenary: ***"notoriously
  difficult to control and prone to desertion if not paid regularly."***
- After the 1360 peace, large armies were disbanded, sometimes **without
  being paid at all**, and the countryside got the consequences.
**THE MECHANIC IN ONE SENTENCE, AND IT CLOSES DAY 6'S LOOP: AN ARMED
GROUP THAT STOPS BEING PAID DOES NOT DISAPPEAR. IT BECOMES SOMEBODY
ELSE'S PROBLEM.** Day 6 said a bandit who settles down acquires an
interest in his block prospering. Day 7 says the reverse is also true:
**cut a stationary bandit's income and he goes roving again.** That is
not flavour, it is a state transition, and it means the income rule in
§2(d) is also the aggression rule. Take a faction's lights and you have
not weakened them, you have RELEASED them.

## 4. *** THE FINDING THAT CHALLENGES WHAT WE BELIEVE ***
**WE ASSUME THE DAILY STAKE IS SURVIVAL. OUR OWN CODE SAYS SO — the
stakes table's placeholder list is "hunger, exhaustion, rent, a debt
clock", and the valley is a desert, so hunger and thirst feel like the
obvious, realistic, grounded answer.**
**THE GENRE EVIDENCE SAYS THAT IS THE SINGLE MOST RELIABLY HATED MECHANIC
IN GAMES.** The recurring criticism is not that survival meters are hard,
it is that they are BUSYWORK: "it's rare to see them actually having
improved a game", players "spending time running between food sources"
and losing interest almost immediately, urgency cranked up and called
survival. The cases that work do so for one reason — the meter creates a
REAL CONUNDRUM ("use it now or save it for a more desperate time") rather
than a chore.
**AND HERE IS THE PART THAT SHOULD CHANGE OUR PLAN: THE GAME HE NAMED,
WHICH IS ONE OF THE MOST PUNISHING CAMPAIGNS EVER SHIPPED, HAS NO HUNGER
METER ON THE PLAYER AT ALL.** Its burn is PAYROLL, and its punishment is
LONELINESS. The pressure to leave the house is not "you will starve." It
is **"these people are relying on you and they will not wait forever."**
**SO THE STAKES TABLE SHOULD NOT BE FILLED WITH METERS. IT SHOULD BE
FILLED WITH OBLIGATIONS TO PEOPLE.** And this is where it gets
embarrassing in the good way:
***WE ALREADY BUILT EXACTLY THE RIGHT ONE, IT IS THE ONLY DAILY COST IN
THE GAME, AND WE HID IT.*** `ctNeglectFor` charges you for not showing up
for people you gave your word to. That is BB's motor, in our vocabulary,
already running — and it runs silently, after the card, with its answer
discarded.
**THIS IS THE SIXTH TIME IN SEVEN DAYS.** The engine exists and is aimed
at nothing. Except this one is not even wiring: **it is one line of text
on a card the player is already reading.**
### AND THE UNLOCK THAT COMES WITH IT
A social burn is **NOT DAMAGE**. Standing is not health. So the whole
motor can ship **without Paolo ruling one number**, which is the thing
that has blocked every stakes conversation since NO DAMAGE BEFORE THE
DIAL was written. Hunger needs a rate. "Three people are waiting on you"
needs nothing but the truth.

## 5. WHAT WE TAKE, AND WHAT WE REFUSE
**TAKE:** a daily burn that is ONE thing, not five meters; a burn that
SCALES WITH SUCCESS, so a bigger operation is a bigger obligation; a
punishment that is people leaving rather than a bar draining; a world
that visibly counts down its own supplies; and the state transition that
an unpaid armed group turns predatory.
**REFUSE:** hunger and thirst meters on the player as the day's stake —
the desert is the SETTING, not the scoreboard, and the genre has thirty
years of evidence that this is where survival games go to become chores;
any burn the player cannot see; and any of it that needs a number from
him before it can exist.

## 6. ROUTED
- **RUN — BB-WHAT-YOU-OWE.** *The smallest row in seven days.* The
  reckoning card names who you let down today. Move the charge to BEFORE
  the card is built and read its return instead of discarding it. It
  already computes exactly what to say: `{faction, lost, now}`. And add
  the forward half — who is expecting you TOMORROW — because a bill you
  see only after it is charged teaches nothing.
- **PEOPLE — BB-OBLIGATION-BURN.** The STAKES table gets its first entry
  and it is an obligation, not a meter. It is the mechanism that makes a
  player leave the house, it scales as you take on more people, and it
  needs NO number from him because standing is not damage.
- **WORLD — BB-DAYS-LEFT.** The economy already answers "how many days of
  this are left" and the player cannot see it anywhere. A shortage the
  valley can feel coming should be visible BEFORE it is a crisis; that is
  what makes a trade decision a decision.
- **PEOPLE — BB-UNPAID-TURNS-PREDATORY.** An outfit whose income fails
  (yours+lit+patrolled, §2d) does not fade out, it goes roving. Closes
  the Day 6 loop and makes taking somebody's lights a real decision with
  a real consequence instead of a free win.
- **NOTE FOR WHOEVER TAKES BB-TURF (WORLD, day 6):** `income(holdings)`
  in `engine/bohemia_mandate.js` is already the landlord rule and it is
  already keyed to LIGHT=TERRITORY. Do not write a second one.
**RUNNING ORDER:** BB-WHAT-YOU-OWE is one card line against a value we
already compute, and it turns the only daily cost in the game from
invisible into the reason he plays tomorrow. **It is the best
effort-to-effect row in this entire study and I would take it before
anything else on the BB board except the two already jumping the queue.**

## 7. CONFIDENCE
- Everything in §2: **MEASURED** in `slices/BOHEMIA_CITY_WORLD.html` (the
  file the alpha actually loads, verified) and `engine/bohemia_mandate.js`,
  with the call-site counts stated so anybody can re-run them.
- BB's wages, food, tools, medicine, mood and desertion: wiki and player
  discussion, consistent across sources; the developer blog is
  proxy-blocked from this environment and was NOT read. **MEDIUM-HIGH.**
- The free companies, the White Company's double character, and Caferro's
  line on desertion: standard medieval military history. **HIGH.**
- The survival-meter criticism: design press and long-running player
  discussion, consistent. **HIGH as a genre pattern**, and it is
  qualitative — it is a strong argument, not a measurement.
- §4's conclusion, §5 and §6: **MY ARGUMENT AND MY ROUTING.** The
  measured half is that we already built the obligation charge and hid it;
  the claim that obligations should REPLACE meters is my design position,
  and the dial on all of it is his.

## SOURCES
Battle Brothers wiki (Game Mechanics, Getting Started, Game Guide) and
Steam gameplay discussions on daily wages at noon, wage growth per level,
the greedy trait, 2 food per man per day, tools and medicine, and mood
falling to desertion when unpaid or unfed. William Caferro on the
medieval mercenary's unreliability without regular pay; standard accounts
of the free companies living by plunder when unemployed, the White
Company's contracts alongside its pillaging, and the unpaid disbandments
after the 1360 peace. PC Gamer, "How survival games get hunger and thirst
wrong, and how to fix it", Kotaku's "Sadly, most survival games aren't
really about survival", and the long-running player discussion on
survival meters as busywork. IN-REPO: slices/BOHEMIA_CITY_WORLD.html (the
day loop header and its empty STAKES table, showReckoning, onNightfall,
mktAdvanceDay, ctNeglectFor and its single discarded call),
engine/bohemia_economy.js (advanceDay, daysLeft),
engine/bohemia_mandate.js (income(holdings) and the patrol rule), and
days 1-6 of this study.
