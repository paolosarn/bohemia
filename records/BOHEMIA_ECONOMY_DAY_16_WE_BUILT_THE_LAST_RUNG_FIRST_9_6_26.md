# ECONOMY -- ROUND 16: WE BUILT THE LAST RUNG FIRST
# (ECONOMY lane, 9/6/26. MODE: RESEARCH -- nothing here is implemented.)
# Question Q16 [debt spiral], verbatim from VAMILY.md:
#   "How a debt becomes unpayable in the real world, step by step (interest,
#    fees, the missed payment, the collector, the thing they take), and where a
#    game should stop copying it because it stops being fun. Deliver the ladder
#    we should model and the rung we should refuse."
# Named DAY 16 for the machine. A round is one VAMILY and is never called a day
# to Paolo (NO CALENDAR TALK, 9/5, LOCKED).
#
# ROUND 9 [trust credit] ALREADY ANSWERED "what is a debt here" (it is a person
# who remembers, not a number) AND ALREADY REFUSED interest, schedules and
# partial payment under EVERYTHING COSTS ONE. This round does not relitigate any
# of that. It answers the different question: what makes a debt UNPAYABLE, and
# which rung of that we must not build.

## 0. THE HEADLINE

I measured what actually happens in Bohemia when you cannot pay. Six ways to fail.

> **FIVE OF THE SIX COST NOTHING AND ARE FORGOTTEN INSTANTLY. THE SIXTH IS
> PERMANENT, IRREVERSIBLE, AND MAKES YOU RICHER AND FREER.**

Fail to pay your power bill and the block goes dark forever, and in exchange: the
bill stops, your production is untouched, and **every gated plot in the valley
opens to you.** Measured across five seeds: 311 plots are permit-gated while the
lights are on, and **0 after they go out.**

> **THE QUESTION ASKED WHERE TO STOP COPYING THE REAL DEBT LADDER. WE HAVE NOT
> STARTED COPYING IT. WE SKIPPED EVERY MIDDLE RUNG AND SHIPPED ONLY THE LAST ONE
> -- THE REPOSSESSION -- AND THEN PAID THE PLAYER TO TAKE IT.**

## 1. WHAT I MEASURED ON OUR OWN BUILD FIRST

### 1a. SIX WAYS TO FAIL, AND THE LEDGER REMEMBERS NONE OF THEM
Run on the real modules with an empty purse:

```
buy a good           {applied:false, reason:"CANNOT_AFFORD", price:1, have:0}
build a plot         {applied:false, reason:"INSUFFICIENT", wanted:1, have:0, short:1}
the day eats         {applied:false, reason:"INSUFFICIENT", wanted:1, have:0, short:1}
the fight eats       {applied:false, reason:"INSUFFICIENT", wanted:1, have:0, short:1}
the night eats       {applied:false, reason:"INSUFFICIENT", wanted:1, have:0, short:1}
asking eats clout    {applied:false, reason:"INSUFFICIENT", wanted:1, have:0, short:1}

ledger entries written by six failures: 0
```

**Every refusal is honest, well-shaped, and completely forgotten.** The purse
reports the refusal in its return value and writes nothing. Nothing anywhere in
the game records that a payment was missed. Round 9 measured the same absence from
the other end: nothing records that one party owes another.

That is not a criticism of the purse. Its own header is right: *"Balances never go
negative, so no hidden debt system exists by accident -- debt would be canon, and
canon is Paolo's."* But it means **rung one of the real ladder, the missed
payment, does not exist here.**

### 1b. EXCEPT ONE, AND IT IS THE HARSHEST RUNG THERE IS
The night power bill is the one failure with a consequence. Measured:

```
a lit circuit           {live:true,  owner:"settlement", id:4}
after one unpaid night  {live:false, owner:"settlement", id:4, doused:true}
```

It rides the save on its own key. And `relight()` exists in the grid, is exercised
by two gates, and **has no caller anywhere in the game.** The walked surface says
so in its own words:

> *"Getting the lights back is a price, and prices are his, so nothing here calls
> relight()."*

**One battery short for one night, and that block is dark forever.** There is no
path back in the shipped game. WORLD's comment above it reads "no debt spiral",
and that is true in the narrow sense -- nothing compounds -- but the way they
avoided the spiral was to repossess permanently on the first miss.

### 1c. AND THE PUNISHMENT PAYS
This is the part I did not expect and had to measure three ways.

**It stops the bill.** `heldCircuits()` skips any circuit that is not `live`, so a
doused circuit is no longer held and is never billed again. Not paying removes the
cost that you could not pay.

**It does not touch your income.** The production tick walks placed buildings and
calls `produce()`. No light check anywhere. Your buildings mint exactly as much in
the dark.

**And it unlocks the map.** The permit shipped 9/6 with [rung unlocks] reads the
light, and its own words are:
> *"nobody patrols the dark, so nobody is here to stop you"*

So a dark street has no permit at all. Measured across five seeds:

```
seed     buildable plots   gated while lit   gated after going dark
1        567               55                0
7        656               63                0
1234     555               67                0
90210    548               76                0
777777   600               50                0
                          311 of 2926        0
```

> **NOT PAYING YOUR POWER BILL UNLOCKS EVERY GATED PLOT IN THE VALLEY.**

Three separate shipped rows, each correct on its own, compose into an incentive to
default. Nobody wrote that; it fell out of the seams.

## 2. THE REAL AISLE: THE LADDER, RUNG BY RUNG

How a debt becomes unpayable, in the order it actually happens.

**RUNG 1 -- THE MISS.** You are short once. Nothing about you changed. The timing
did. In the US roughly **one household in seven is behind on their electric and
gas bills.** This rung is ordinary and it is where everything starts.

**RUNG 2 -- THE FLAT FEE.** A charge for being short, the same size whether you
were short by a dollar or a hundred. It is not priced to your failure; it is
priced to their convenience.

**RUNG 3 -- THE FEE ON THE FEE.** The charge joins the balance and comes due on
the same schedule that already beat you.

**RUNG 4 -- THE ROLLOVER, and this is where the arithmetic stops mattering and the
structure takes over.** The numbers are not ambiguous:
- **80% of payday loans are rolled over or reborrowed within 14 days.**
- The median fee is $15 per $100 on a 14-day term, which is **391% APR**.
- The average borrower is **in debt five months of the year and pays $520 in fees
  to repeatedly borrow $375.** You pay more in fees than you were ever handed.
- **Nearly one in four initial loans is reborrowed nine times or more**, and more
  than 80% of rollover borrowers owed **as much or more** on the last loan of the
  sequence than they borrowed at the start.

**RUNG 5 -- THE ONE COUNTERPARTY. This is the rung that makes a debt structurally
unpayable, and it needs no interest at all.** The Appalachian coal towns: miners
were paid in **scrip usable only at the company store**, given "advances against
unearned wages" at **50% to 80% of face value**, and many companies would not
exchange scrip for dollars at any rate. The company owned the store, the house,
the school and the church, and it set the prices in the only shop that took the
money it paid you in. Miners were perpetually in debt. It ran into **1964**.

> **THE DEBT WAS NOT MADE UNPAYABLE BY INTEREST. IT WAS MADE UNPAYABLE BY HAVING
> ONLY ONE PERSON TO PAY.**

**RUNG 6 -- THE DISCONNECTION, AND THE PRICE OF COMING BACK.** They take the
service. And the way back is charged at the exact moment you have least: a $250
past-due balance plus a $75 reconnection fee means **$325 to restore something you
lost over $250.** Reconnection fees run about $15 to $60 on top. The literature
names it plainly: *"the poorest consumers pay more, precisely at the moment they
are most financially distressed,"* which delays reconnection, prolongs the
hardship and makes the next disconnection more likely. Roughly **1.5 million
low-income US households had their electricity cut off in a single year.**

**RUNG 7 -- THEY TAKE THE THING THAT EARNED.** The last rung, and the only one
that is truly terminal: what gets taken is the thing that was producing the money
to pay with.

## 3. THE GAMES AISLE, IN PLAIN WORDS
(No game he has not named enters the design; these are mechanics as mechanics.)

The design literature has a name for rung 7 and a rule for it.

- **A DEATH SPIRAL IS WHEN LOSING MAKES LOSING MORE LIKELY.** One failure reduces
  your capability, which makes the second failure likelier, which makes the third
  likelier still. The literature is blunt that there is virtually no escape once it
  starts.
- **AND IT IS A FLAT NEGATIVE.** Nothing about it is interesting for the player.
  Anyone good at the game never sees it, so it only ever happens to the person
  already having the worst time, and what they do about it is stop playing.
- **THE RULE, AND IT IS ONE SENTENCE:** *losing an exchange must not affect your
  ability to avoid the next loss.*
- **THE CLASSIC EXAMPLE IS HANDING OVER THE THING THAT PRODUCES** to settle a
  debt: now you have less income, so you are less able to survive the next bad
  turn. That is rung 7 exactly.

## 4. *** THE FINDING THAT PROVES US WRONG ***

I came into this round expecting to write a warning: be careful not to build a
debt spiral. The measurement says the opposite, and it is worse.

> **WE DID NOT BUILD A SPIRAL. WE BUILT THE LAST RUNG WITHOUT THE FIRST SIX, AND
> THEN ATTACHED A REWARD TO IT.**

The real ladder is: miss, fee, fee on fee, rollover, one counterparty,
disconnection, and finally they take the thing that earned. In Bohemia today:

```
rung 1  the miss                    DOES NOT EXIST. 0 ledger entries from 6 failures.
rung 2  the fee                     refused by his 8/15 law, correctly (round 9)
rung 3  the fee on the fee          refused, correctly
rung 4  the rollover                refused, correctly
rung 5  the one counterparty        NOT BUILT, AND WE ARE THREE ROWS FROM IT (below)
rung 6  the disconnection           SHIPPED, AND SHIPPED AS PERMANENT
rung 7  they take what earned       not built, and must never be
```

**The one thing a player can lose by not paying is permanent, and losing it makes
him richer, freer and unbilled.** A punishment that pays is not a punishment; it
is the optimal play. The first thing a real player will discover is that the way
to beat the permit system is to stop paying.

### 4b. AND HERE IS THE ONE TO WATCH: WE ARE THREE SHIPPED ROWS FROM A COMPANY STORE
Rung 5 is the one that needs no arithmetic, and it is the one our own design is
walking toward without anybody deciding to.

```
ROUND 13   a faction's ground mints the batteries
ROUND 14   the faction that owns your block collects a cut, and the record says
           the rent should be its income
ROUND 13   money far from where it was made is REFUSED, not discounted
           (the free-banking finding, five rounds voting the same way)
```

Put those three together and the faction that owns your block pays you, charges
you, and is the only one who takes what it paid you in. **That is the company
store, exactly, and it was still running in Kentucky in 1964.** It is the single
most realistic thing in this entire study and it is the rung that makes a debt
mathematically impossible to clear.

**It is not automatically wrong to build.** A world where one faction can do that
to a neighbourhood is a true and terrible thing and this game is an economic crash
simulator. But it must be **a thing a faction does**, that a player can see, name
and get out of, and never the default shape of every block in the valley. What
makes it survivable in the real record is the same thing every time: **a second
person who will deal with you.**

## 5. THE LADDER WE SHOULD MODEL, AND THE RUNG WE REFUSE

### THE LADDER (mechanism only; every price and every ruling stays his)

**RUNG 1 -- THE MISS IS REMEMBERED.** Today six failures write nothing. A missed
payment should be an open item with a face, which is round 9's finding and needs
no new concept: *it is open, it has a face, it is one, it travels, it costs
access.* No fee, no interest, no arithmetic. It just does not go away by itself.

**RUNG 2 -- THE MISS COSTS ACCESS, NOT PROPERTY.** Round 9 measured that every
organ for this is already live: `whoHears` walks a real acquaintance graph three
hops, `memory` decays slower for somebody familiar, `commitment` is a wall with
stages. The punishment for not settling is that doors stop opening. Nobody takes
anything.

**RUNG 3 -- THE COLLECTOR IS A PERSON AND THE COLLECTION IS A SCENE.** Round 9's
danger moment: it is AFTER you were helped, not before.

**RUNG 4 -- THE THING THEY TAKE IS THE SERVICE, AND THE WAY BACK IS WORK.** The
disconnection is legitimate and we already ship it. What we must not ship is the
$75 on top of the $250. **A price to relight is the trap the research names by
name**, because being broke is the reason the lights went out. The way back should
cost time and effort, which a broke player still has, rather than money, which he
by definition does not.

**AND THE INVERSION HAS TO GO EITHER WAY:** whatever else happens, the dark cannot
keep paying. Going dark must not stop the bill, must not free the map, or the
whole ladder is upside down.

### THE RUNG WE REFUSE, AND IT IS RUNG 7

> **NOTHING IN BOHEMIA MAY EVER TAKE THE THING THAT EARNS.**

Never the building that produces. Never the market seat. Never the tool. The games
rule and the Monopoly example agree with the real record: the moment losing
reduces your ability to stop losing, the player is in a spiral he cannot see the
end of, and what he does about it is close the tab. **A player at his lowest must
still be able to earn his way back at the same rate he could before.**

That is also the honest reading of his own 8/9 ruling that the bar goes UP: a
punishment the player cannot recover from is not difficulty, it is an ending
nobody chose.

## 6. REFUSED

- **INTEREST, FEES, SCHEDULES, COMPOUNDING.** Already refused in round 9 under
  EVERYTHING COSTS ONE and not reopened. Rungs 2, 3 and 4 of the real ladder are
  arithmetic, and arithmetic here rebuilds the spreadsheet he banned. The good news
  from this round is that **rung 5 proves you do not need them:** the company store
  made debts unpayable with no interest at all.
- **A NEGATIVE BALANCE.** The purse's reasoning stands and round 9 said it first.
- **A PRICE TO RELIGHT.** [PENDING Paolo] today. This round is a recommendation
  against a number, not a number: section 5, rung 4.
- **A DEBT METER, A CREDIT SCORE, OR A COLLECTIONS SCREEN.** Anti-spreadsheet, and
  round 9 already settled that the standing systems say this in stages and words.
- **BUILDING ANY OF IT.** MODE: RESEARCH. The permit, the grid and the bill belong
  to WORLD and LIFE + CITY.
- **DECIDING WHETHER THE COMPANY STORE HAPPENS.** Section 4b is a warning and a
  measurement. Whether a faction may do that to a block is canon and canon is his.

## 7. ROUTED

**TO WORLD, on [lights bill] as shipped -- and this is the urgent one:**
1. **NOT PAYING IS THE OPTIMAL PLAY.** Measured across five seeds: going dark stops
   the bill, leaves production untouched, and takes the valley from 311 gated plots
   to 0. Three correct rows compose into an incentive to default.
2. **THE DARK IS PERMANENT.** `relight()` has no caller. One battery short for one
   night and that block is out for the rest of the game.
3. **THE WAY BACK SHOULD COST WORK, NOT MONEY.** A reconnection price is the exact
   documented poverty trap, charged when the player by definition cannot pay it.

**TO PEOPLE (owns memory, ties and standing):**
4. **RUNG 1 DOES NOT EXIST: SIX FAILURE PATHS WRITE ZERO LEDGER ENTRIES.** A missed
   payment should be an open item with a face. Every organ it needs is already
   live and round 9 named them.

**TO FACTIONS, on [block rent] and [power territory]:**
5. **THE COMPANY STORE IS THREE SHIPPED ROWS AWAY AND NOBODY CHOSE IT.** If the
   faction that owns your block also pays you, charges you, and is the only one who
   takes what it paid you in, the debt is unpayable by construction, with no
   interest anywhere. The counter is one thing and it is the same in every real
   record: **a second person who will deal with you.**

**TO COMBAT and anybody who ever writes a loss:**
6. **NEVER TAKE THE THING THAT EARNS.** Not the building, not the seat, not the
   tool. Losing must not reduce the rate at which a player can climb back.

**TO THE COORDINATOR, for Paolo:**
7. **[PENDING Paolo]** What does it take to get the lights back on? It is already
   a pending and this round has an opinion for the first time: the research says a
   PRICE is the trap. A day of work, a walk, a favour owed to whoever holds the
   block, are all payable by somebody with nothing.

## 8. TEST MATERIAL
`banks/BOHEMIA_ECONOMY_TEST_LINES_9_5_26.md`, sections BBBB through FFFF. Every
line `draft:true`, in the bank, never in the game.

## 9. SOURCES

REAL AISLE
- Payday rollovers: 80% rolled over or reborrowed within 14 days; $15 per $100 on
  a 14-day term = 391% APR; average borrower in debt five months a year paying
  $520 in fees to borrow $375; nearly one in four reborrowed nine times or more;
  80%+ owing as much or more at the end of a sequence --
  consumerfinance.gov/about-us/newsroom/cfpb-finds-four-out-of-five-payday-loans-are-rolled-over-or-renewed/ ;
  files.consumerfinance.gov/f/201403_cfpb_report_payday-lending.pdf ;
  pew.org/-/media/assets/2016/06/payday_loan_facts_and_the_cfpbs_impact.pdf
- Company scrip and the truck system: wages paid in scrip usable only at the
  company store, advances against unearned wages at 50-80% of face, many companies
  refusing to exchange scrip for dollars, miners perpetually in debt, scrip issued
  into 1964 -- en.wikipedia.org/wiki/Company_scrip ; wvencyclopedia.org/entries/190 ;
  wvminewars.org/16tons ;
  cambridge.org/core/journals/journal-of-economic-history/article/abs/did-coal-miners-owe-their-souls-to-the-company-store-theory-and-evidence-from-the-early-1900s/F576B08F8DB66BDFBBA7D4E346B97873
- Disconnection and reconnection as a documented poverty trap: $250 arrears plus a
  $75 reconnection fee to restore, fees typically $15-$60, one household in seven
  behind on energy bills, ~1.5 million low-income US households disconnected in a
  year -- congress.gov/crs-product/R47417 ;
  justsolutionscollective.org/left-in-the-dark-utility-disconnections-in-the-united-states/ ;
  raponline.org/blog/modernizing-regulatory-framework-residential-collections/ ;
  rmi.org/resources/disconnection-data-is-finally-available-what-does-it-tell-us/

GAMES AISLE (mechanics only; no game he has not named enters the design)
- The death spiral, why it is a flat negative, and the one-sentence rule --
  gamedeveloper.com/design/the-designer-s-notebook-preventing-the-downward-spiral ;
  socratesrpg.blogspot.com/2006/03/what-is-death-spiral.html ;
  old.strateggames.com/a/death-spiral-in-game-design/

OUR OWN REPO (every figure measured this round)
- engine/bohemia_purse.js (six refusal paths, zero ledger writes),
  engine/bohemia_powergrid.js (douse, and relight with no caller),
  engine/bohemia_production.js (no light check on the yield),
  engine/bohemia_overmap.js, engine/bohemia_cityedit.js
- slices/BOHEMIA_CITY_WORLD.html: heldCircuits(), nightPower(), cbLitFront(),
  cbPermit() and its "nobody patrols the dark" branch
- records/BOHEMIA_ECONOMY_DAY_9_A_DEBT_IS_A_PERSON_WHO_REMEMBERS_9_5_26.md (the
  shape of a debt here, and the refusals this round honours rather than reopens)
- records/BOHEMIA_ECONOMY_DAY_13, DAY_14 (the mint, the rent, the refusal at a
  distance -- the three rows that compose into section 4b)

## 10. GATE STATE THIS ROUND

Green, run this round: economy 13/0, payday 38/0, purse 28/0, attempt 15/0,
canon rot 13/0, demo blockers 22/0, language 81/0, **lights bill 30/0.**

That last one is worth saying out loud. `lights_bill_gate` is 30 for 30 and its
summary line is exactly right: *"a held circuit is billed at nightfall, an unpaid
one goes dark, and it stays dark."* Every assertion in it is true and every one of
them passes while section 1c is also true.

**A gate can only check the mechanism it was written for.** This one proves the
bill is charged and the dark persists. Nothing in it asks whether going dark is
something a player would *want*, because that question spans three modules and two
lanes: the grid, the production tick and the permit. The incentive lives in the
seams between correct parts, which is exactly where a per-row gate cannot look.

Not this lane's to fix (MODE: RESEARCH), and not a criticism of the gate. Noted
because "all gates green" was true the whole time the incentive was upside down.
