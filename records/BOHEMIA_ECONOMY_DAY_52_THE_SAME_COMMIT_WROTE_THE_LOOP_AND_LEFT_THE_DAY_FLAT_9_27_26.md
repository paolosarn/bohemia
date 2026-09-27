# ECONOMY -- ROUND 52, [bb money] THE-COMPANY-LEDGER, ROUND ONE OF TWO (rule 33 school)
# 9/27/26. MODE: RESEARCH -- NOTHING IN THIS FILE IS IMPLEMENTED.
# Board row: VAMILY.md line 796, CLAIMED 9/27/26 economy-vamily-knxaeh, commit e340066.
# Law: laws/BOHEMIA_LAW_THE_OVERWORLD_IS_BATTLE_BROTHERS_9_24_26.md s5.

THE ROW, VERBATIM, BECAUSE IT IS THE QUESTION THIS FILE ANSWERS:

  "rule 33 school (research lane, two rounds): BB's daily wages, provisions, tools and
   medicine consumed per day of travel, prices per town and how they move; the shape for
   us in batteries where everything costs one: a day of travel, a companion's day, the
   loan of one a night as the wage."

THE HEADLINE: the same row, on the same date, in two commits hours apart, wrote a bill
that scales per thing held and a bill that is flat per day. Twenty-two rounds later the
flat one has never been revisited, and it is the one that prices your people.

===========================================================================
0. WHAT I GOT WRONG THIS ROUND, CAUGHT BEFORE IT WAS PUBLISHED
===========================================================================
My first probe printed `CAP IN THE MODULE: yes` for the company module. It was a lie my
own regex told me: I searched for /CAP|MAX_|limit/ against the file text and it matched the
word "limit" inside two COMMENTS (bohemia_company.js:76 "an honest limit", :223 "the honest
limit"). There is NO cap on company size anywhere in that file.

THIS IS THE THIRD ROUND RUNNING THAT I HAVE MADE THE SAME MISTAKE IN THE SAME SHAPE.
Round 50 round one: I reported our status-keep rate as 0.79 because I read a COMMENT
instead of the CONSTANT six inches below it (the constant is 0.25, so the code keeps 0.75).
Round 52: a regex matched prose and I nearly published "there is a cap" as a measurement.

THE RULE I AM WRITING DOWN FOR MYSELF AND FOR EVERY LANE THAT READS THIS FILE:
A GREP IS NOT A MEASUREMENT. A grep tells you a STRING is present. Only running the code,
or reading the declaration the code actually uses, tells you a NUMBER. Every number in
this record below comes from node output pasted verbatim, not from a search hit.

===========================================================================
1. WHAT THE REPO DOES TODAY -- MEASURED, PASTED VERBATIM
===========================================================================
Probe: scratchpad p1.js, requiring engine/bohemia_company.js, bohemia_purse.js,
bohemia_obligation.js directly. Output, unedited:

    COMPANY SIZE            9
    day:ate applied         true amount 1
    nine mouths cost        1 of resources
    one mouth cost          1 of resources  (company 1)
    upkeep signature args   4 (purse, verb, ref, day) -- no count, no amount
    a fifth verb            NO_SUCH_VERB
    five circuits, three batteries -> lit 3 dark 2

READ THOSE SEVEN LINES TOGETHER AND THE WHOLE FINDING IS IN THEM.

  A COMPANY OF NINE COSTS WHAT A COMPANY OF ONE COSTS. Both charge 1.
  A company of nine is real and the module builds it: nine bonds plus a cast resolved to
  nine named people, `yours(snap).length === 9`. No cap, so it could be ninety.

  THE PRIMITIVE CAN ALREADY SCALE. Five circuits against three batteries lights three and
  douses two. The purse did not need a new function for that and it does not need one for
  people: the CALLER loops.

  THE AMOUNT CANNOT BE PASSED IN, AND THAT IS CORRECT, NOT A DEFECT. `upkeep()` takes
  (purse, verb, ref, day) and debits exactly 1. EVERYTHING COSTS ONE (Paolo 8/15) lives in
  that signature. A caller that could pass 2 is a hole for an unruled number.

### 1b. THE TWO CALL SITES, AND THE DATE THAT MAKES THIS A FINDING

    slices/BOHEMIA_CITY_WORLD.html:58782
      try{ upkeepPost('day:ate', (DAYOPEN&&DAYOPEN.title)||'the day'); }catch(_e){}
                                  ONE CALL. ONE DAY. ANY NUMBER OF MOUTHS.

    slices/BOHEMIA_CITY_WORLD.html:60443-60452  (function nightPower)
      for(var i=0;i<held.length;i++){
        var r=upkeepPost('night:power', 'circuit '+held[i].id);
        if(r&&r.applied) continue;
        var went=false; try{ went=POWER.douse(held[i].id); }catch(_e){}
        ...
                                  ONE CALL PER CIRCUIT HELD. THE BILL IS THE HEADCOUNT.

GIT SAYS THEY ARE THE SAME ROW, THE SAME DATE:
    18e5992  2026-09-05  [living costs] THE FOUR VERBS ARE FROZEN, AND THE DAY EATS FOOD (1 of the 4 wired)
    5b61303  2026-09-05  [living costs] NOTHING IS FREE ANY MORE: four verbs, three currencies, all four eating

The loop and the flat charge were written by one lane, in one row, hours apart. The lane
that wrote the loop for circuits did not go back and apply it to the day. Nobody has since.
That is 22 rounds.

AND THE COMMENT ON nightPower ALREADY ARGUES OUR CASE FOR US, in its own words:
"IT PUTS OUT THE ONE IT COULD NOT PAY FOR, NOT ALL OF THEM. The bill is per circuit and so
is the failure: run out halfway down the list and the blocks you already paid for stay lit.
Anything else would be a wipe, and a wipe is a punishment nobody ruled."

Swap "circuit" for "person" and that paragraph is the company wage, including the reason it
is not cruel: you do not lose your company, you lose the one you could not feed.

### 1c. A SECOND LANE MEASURED THIS EXACT THING AND WAS RIGHT TO STOP

engine/bohemia_obligation.js:12-15 (PEOPLE lane, 9/7, row BB-OBLIGATION-BURN), verbatim:

      upkeep(purse, verb, ref, day)  debits exactly 1, always. No headcount is in
                                     its signature, so a household of nine costs
                                     what a household of one costs. (ECONOMY
                                     round 23 measured the same thing from the
                                     other side and routed it here.)

So this is measured THREE times now, by two lanes, from three sides: my round 23, PEOPLE on
9/7, and this round. It has never been wrong and it has never been fixed.

WHY PEOPLE STOPPED, in their own words: "NO DAMAGE BEFORE THE DIAL froze every stakes
conversation, and correctly: a hunger meter needs a RATE, and rates are his." They shipped a
truth-teller (waitingOn, sizeOf, showedUpFor, whoWalks) and deliberately charged nothing.
THAT WAS THE RIGHT CALL ON 9/7 AND IT IS WORTH SAYING SO. It is also the thing round two
has to re-examine, because the law they cited was amended on 9/22 (section 5 below).

### 1d. PRICES PER TOWN -- THE KEY IS ALREADY COMPUTED SIX LINES ABOVE THE LEDGER THAT IGNORES IT

Round 40 measured that all sixteen market hubs share one stock ledger. Still true, and this
round found the sharper version of it. Two functions, adjacent:

    61073  function mktHub(){
    61074    var key=seed+':'+city.x+','+city.y+':'+MODE;      <-- KEYED BY PLACE
    61075    if(MKT_HUB_KEY===key) return MKT_HUB;
             ...

    61112  function mktLedger(){
    61113    if(MKT_LEDGER) return MKT_LEDGER;                 <-- KEYED BY NOTHING
    61116    try{ MKT_LEDGER=BohemiaEconomy.makeLedger(seed, heads, heads); }catch(_e){ MKT_LEDGER=null; }

THE GAME KNOWS WHICH TOWN YOU ARE STANDING IN. It computes that key, caches on it, and
throws it away when it builds the shelf. One barrel of stock for the whole valley, saved as
one object (`st.market.ledger`, 61634). Sixteen doors, one pantry behind all of them.

AND THE ONE PRICE MOVES IN TIME AND THEN STOPS (round 40, re-confirmed):
food 4.29 -> 60 by day 10 and flat after; water 0.28 -> 10 by day 30 and flat after;
salvage never moves at all.

===========================================================================
2. AISLE TWO -- THE GAME HE NAMED (BATTLE BROTHERS: campaign layer + overworld, rule 33)
===========================================================================
Round 49 section 3 already banked the per-day consumption side, so it is CITED, NOT
RE-RESEARCHED (records/BOHEMIA_ECONOMY_DAY_48_NOTHING_IN_THIS_GAME_ARRIVES_9_21_26.md:182):

    a man's wage      +2 crowns a level, x1.1^(level-1) to level 11, then x1.03^(level-11)
                      a level-11 Hedge Knight costs 91 crowns a day; at level 21, 122
    food              2 units per brother per day
    medicine          1 per injury per day, or the injury does not heal
    tools             1 per 15 points of durability repaired, or the weapon breaks for good
    not paying        mood falls, and men DESERT

NEW THIS ROUND, and it is the part the row was actually asking for:

  THE ROSTER IS CAPPED AND THE FIELD IS CAPPED SMALLER. 20 in the company, 12 into a
  battle. The Peasant Militia origin runs 25 and 16, so the cap is a per-origin number and
  not a law of the engine. EIGHT BENCHWARMERS ARE THE NORMAL STATE and you pay every one
  of them.

  WAGES ARE PAID AT A TIME OF DAY, NOT ON A TICK. Daily, at noon, when Afternoon starts.

  EVERY MAN HAS HIS OWN PRICE. There is a small random factor on each character's daily
  wage demand, so two recruits of the same background cost different amounts. The price of
  a person is not a table lookup in that game; it is per-person.

  A DISCREPANCY I AM NOT PAPERING OVER. The developer blog's tweak says a cumulative 10%
  of base wage per level to 11, then 5% per level after. Round 49's record says 3% after
  11. Those cannot both be current. Patch versions differ and I could not date either to a
  build. BOTH NUMBERS ARE IN THE BANK WITH BOTH SOURCES NAMED; neither is ours to copy.

  PRICES PER TOWN, WHICH IS THE NEW HALF OF THE ROW:
    each attached location adds about 3% to what a settlement will pay, and a settlement
      has 3 to 8 of them, so a town's premium is roughly 9% to 24%
    the same gem sells 500 in one city and 800 in another
    a good run between a northern and a southern hub is 200-250 crowns of profit per item
    relations matter most: "you really want to only buy from those who like you"
    AMBUSHED TRADE ROUTES IS A SETTLEMENT EVENT, and while it is on you sell much higher,
      because the denizens have no reliable access to trade

READ THAT LAST BULLET AGAIN. BB's single strongest price signal is not geography and not a
table. IT IS A TOWN THAT HAS BEEN CUT OFF. That is access, not arithmetic.

===========================================================================
3. AISLE ONE -- THE REAL WORLD
===========================================================================
### 3a. NOT PAYING YOUR PEOPLE HAS ONE CONSEQUENCE AND HISTORY NEVER VARIES IT

Every period tells the same story. The Roman Republic could not settle its legions and got
internal strife and rebellion; Marius's reforms are the admission that pay and loyalty are
one thing. The early modern mercenary armies deserted or mutinied whenever pay ran late.
In the American Revolution, pay arrears plus inflation broke morale and the Continentals
MUTINIED when Congress could not pay even reduced sums. Washington's own papers put the
mechanism in one sentence: withholding pay "lay the Foundation of Discontent, and of Course
encourage a Spirit of Mutiny and Desertion among the Soldiers." Confederate troops west of
the Mississippi were never paid past August or September 1863.

So BB's "not paying -> mood falls -> men desert" is not a game mechanic. It is the most
consistently attested labour relation in military history.

### 3b. THE FINDING THAT PROVES US WRONG

And then the inversion, which is the finding this round owes:

    WHEN THE OUTSIDE ECONOMY GETS WORSE, DESERTION GOES DOWN.
    ("Army desertions drop as economy fizzles", San Antonio Express-News.)

A man deserts an unpaid army when there is somewhere else to be paid. In a collapse there
is nowhere else. So the punishment for not paying your people IS NOT that they leave.

THAT CUTS AGAINST THE DESIGN TWO LANES HAVE BEEN CONVERGING ON. bohemia_obligation.js is
built on "the punishment is a person walking away, not a bar draining" -- it ships
whoWalks() as the stake. My own round 49 leaned the same way. In the deepest collapse, and
the ruin IS the floor of this game (rule 32b), the realistic answer is that they STAY,
unpaid, and what changes is how they feel about you and what they will do for you.

REALISM FIRST says the realistic option leads. So: the unpaid man walking away is the
WRONG default for act one, and the right one is already built and already ours -- standings
and rungs (round 49: four of sixteen open to a stranger, six givings before you can ask).
An unpaid man does not vanish from the valley. HE DROPS A RUNG. He is still there, every
day, and he will not lend to you.

This is not mine to rule and I am not ruling it. It is written down as a measured
contradiction between a real-world finding and a shipped module's stated design, and it is
routed to PEOPLE, whose module it is.

### 3c. LEBANON SAYS OUR WEIRDEST LAW IS THE REALISTIC ONE

EVERYTHING COSTS ONE has always read like a placeholder we are stuck with. The collapse
record says it is the truth:

    A Lebanese worker who earned $5 an hour before the collapse was paid $5 to $6 for the
    ENTIRE SHIFT after it. (Al Jazeera, on Lebanon's domestic workers.)

THE NUMBER DID NOT MOVE. What one unit BOUGHT collapsed. Venezuela is the same picture from
the other end: a MONTHLY minimum wage of 1,307,000 bolivars, about $6 on the black market,
bought two cartons of eggs, a kilo of cornmeal and a box of pasta. A month of work, priced
in groceries you can count on one hand.

THAT IS OUR GAME'S ECONOMY, EXACTLY AS RULED. One battery is the wage. One battery is the
bag of rice. Neither number ever moves. What moves is whether the rice is THERE.

===========================================================================
4. THE FINDING
===========================================================================
BATTLE BROTHERS PUTS ITS VARIETY IN THE NUMBER. Wage demands vary per man. Prices vary per
town by a percentage per attached location. A level multiplies a base. Arbitrage is the
whole reason to cross that map.

WE ARE FORBIDDEN THE NUMBER. EVERYTHING COSTS ONE (8/15) and BATTERIES ARE THE MONEY (9/4)
mean a price spread cannot exist in this game. BB's core overworld loop -- buy low there,
sell high here -- IS ILLEGAL IN BOHEMIA BY HIS OWN LAW.

SO EVERY PLACE BATTLE BROTHERS VARIES A PRICE, WE MUST VARY A COUNT OR AN ACCESS INSTEAD.
That is the one sentence of this round, and it is not a new design. It is his 9/15 ruling 1
with the 9/16 correction, restated with BB's own numbers on the other side of it: THE
SPREAD LIVES IN ACCESS AND DISTANCE, NEVER IN THE NUMBER. You do not travel because it is
cheaper there. You travel because it is THERE AT ALL.

And BB's own best price signal agrees with us rather than with itself: the ambushed trade
route. A town that is cut off pays anything. That is access.

THREE THINGS FALL OUT, AND ALL THREE ARE ALREADY BUILT IN THIS REPO:

  1. A COMPANY'S DAY IS ONE PER HEAD, NOT ONE PER DAY.
     The mechanism is nightPower(), verbatim, with "person" for "circuit". One battery per
     head; the head you cannot pay is the one that suffers; the heads you already paid are
     fine. No amount is ever passed in, no fifth verb, no rate. A company of nine costs
     nine ONES, which is EVERYTHING COSTS ONE obeyed nine times, not broken once.
     THE COUNT IS THE DIFFICULTY CURVE, AND WE GET IT FOR FREE: BB caps the roster at 20
     and fields 12 because payroll is the brake on a growing company. Ours has no cap and
     no brake, which is why a bigger operation is currently free.

  2. SIXTEEN TOWNS NEED SIXTEEN SHELVES, AND NOT SIXTEEN PRICE TABLES.
     mktLedger() takes the key mktHub() already computes. Same one price everywhere, which
     the law demands. What differs is WHAT IS ON THE SHELF and WHETHER IT IS THERE. A town
     with no water has no water at any price, and that is the thing worth travelling for.
     THIS IS ALSO PENDING 42 ANSWERED FROM THE BB SIDE: the valley does not need a second
     SHOP, it needs the one shop to be sixteen different EMPTINESSES.

  3. THE LOAN OF ONE A NIGHT IS ALREADY THE WAGE, AND IT IS ALREADY WRITTEN.
     engine/bohemia_lend.js: HANDSHAKE 1, DUE_A_NIGHT 1, CURRENCY electricity. The row asks
     for "the loan of one a night as the wage" and that module is it, from the other
     direction: what somebody lends you a night is what a night of somebody's time costs.
     Round 49 proved it is not a debt trap (paid() clears the account, short() does not
     compound). Nothing needs inventing. It needs the two ends connected, which is round
     two's job to describe and NOT this lane's job to build.

===========================================================================
5. THE LAW THAT UNBLOCKED THIS FIVE ROUNDS AGO AND NOBODY TOLD THE MODULE
===========================================================================
PEOPLE stopped on 9/7 citing NO DAMAGE BEFORE THE DIAL, correctly: "a hunger meter needs a
RATE, and rates are his."

THAT LAW WAS AMENDED ON 9/22, rule 23, laws/BOHEMIA_ADDENDUM_THE_FIGHT_IS_BATTLE_BROTHERS_QUICKER_9_22_26.md
section 4, verbatim: "A hit inside reach on the beat lands and costs ONE (EVERYTHING COSTS
ONE). No dial, no pause, no number to read." And: "THE DIAL STILL OWNS EVERY NUMBER BIGGER
THAN ONE."

BE PRECISE ABOUT WHAT THAT DOES AND DOES NOT DO. Rule 23 is COMBAT's law and a reference
belongs to one department, so it does not hand the economy a permission. What it does is
remove the ARGUMENT PEOPLE used. One battery per head is not a rate and not a meter. It is
the same one, charged once per person. There is no second number anywhere in it.

AND THE ECONOMY DID NOT NEED RULE 23 ANYWAY, WHICH IS THE POINT: nightPower() won this
exact argument on 9/5, inside the economy, two days BEFORE the obligation module decided it
could not be won. The precedent was already in the building.

A LAW MOVED AND THE PART THAT WAS WAITING ON IT WAS NEVER TOLD. That is instance 41 of the
gate hole this lane has now recorded 41 times: THERE IS NO MACHINE THAT TELLS A PART ITS
BLOCKER IS GONE. A law lands, the lane that shipped it updates its own files, and every
other file that stopped because of the old law stays stopped forever. A comment citing a
dead law reads exactly like a live design decision.

### 5b. AND THE SAME THING HAPPENED TO A GATE, THIS ROUND, LIVE

The pre-push pass found it by accident. gates/four_verbs_gate.js -- the gate that
guards the very verbs this record is about -- CRASHES:

    page.$eval: Failed to find element matching selector "#daycardIn .dcgo"
        at gates/four_verbs_gate.js:141

NOT MINE, AND PROVEN RATHER THAN ASSERTED. The gate reads slices/BOHEMIA_CITY_WORLD.html,
engine/bohemia_purse.js and tools/bohemia_city_asking_patch.py. My working tree modified
exactly two paths, both of them text: this record (new) and the ECONOMY bank. Nothing the
gate touches.

WHAT IS ACTUALLY WRONG, as far as I took it: both strings still exist in the slice
(`daycardIn` 51 times, `dcgo` 15 times), so nothing was deleted. The selector the gate
waits for is the WAKE CARD'S BUTTON, built at 57348:

    h+='<div class="dcgo" data-act="go">GET UP</div>';

It is built by a function, not static markup, so it is only in the DOM when that card is
OPEN. The gate opens the page and expects it to be there. Rule 32(a) -- NOTHING IS FORCED
AND NOTHING HAPPENS IN THE FIRST SECOND (9/24) -- is the obvious suspect, because removing
forced openings is exactly what it did. I DID NOT PROVE THAT, and I am not claiming it: I
found the bark gate's rule-32a guard at 52678 and it is about mouths, not day cards. What
is certain is that the gate is red, the strings are present, and the four upkeep verbs
currently have no working end-to-end check.

SO SECTION 5 HAS A SECOND INSTANCE, FOUND THE SAME ROUND, IN A GATE INSTEAD OF A COMMENT.
A law landed on 9/24. A comment stopped on 9/7 because of a law amended on 9/22. A gate
broke because of a law landed on 9/24. THE MISSING MACHINE IS THE SAME ONE IN ALL THREE:
nothing in this repo asks "what did this law just break, and what did it just unblock?"

===========================================================================
6. WHAT THIS ROUND DID NOT MEASURE, SAID PLAINLY
===========================================================================
- BB's exact starting crowns and its exact food-per-day-of-travel-versus-per-day-camped
  split. Round 49 could not pin it and neither could this round.
- Which of 3% or 5% is BB's current post-level-11 wage step. Both are banked, both sourced.
- What a rung drop actually costs a player in our own numbers. That is round two.
- Whether a company of nine is even reachable in the demo today. The nine I built was
  SYNTHETIC (nine bonds plus a cast, written by my probe). I did not measure how many
  people a real playthrough accumulates, and I am not going to claim it.

===========================================================================
7. ROUTED
===========================================================================
PEOPLE      bohemia_obligation.js is held by a law that was amended on 9/22, and its own
            stated stake (whoWalks) is contradicted by the real-world finding in 3b: in a
            deep collapse desertion FALLS, because there is nowhere else to go. The
            realistic act-one punishment is a RUNG DROP, not a departure. Your module,
            your call. Everything you need is in sections 1c, 3b and 5.
WORLD       slices/BOHEMIA_CITY_WORLD.html:58782 charges one per DAY; :60443 charges one
            per CIRCUIT. Same row, same date, 18e5992 and 5b61303. The day is the one that
            prices your people and it never got the loop.
WORLD       mktLedger() (61112) ignores the place key mktHub() (61074) computes six lines
            above it. Sixteen doors, one pantry.
PLUMBER     gates/four_verbs_gate.js IS RED AND CRASHES, not fails: it waits at page load
            for "#daycardIn .dcgo", the wake card's GET UP button, which is built by a
            function and is only in the DOM while that card is open. Both strings are
            still in the slice, so nothing was deleted. THE FOUR UPKEEP VERBS HAVE NO
            WORKING END-TO-END CHECK RIGHT NOW. Proven not mine: section 5b. Rule 32(a)
            is the suspect and I did not confirm it.
PLUMBER     gates/purse_gate.js is still red on the leg "ACT ONE ONLY (Paolo 7/28)". Same
            red this lane measured and routed last round: a 7/28 gate greps the purse for
            act-2/3 modelling and goes red because WORLD added an act stamp obeying the
            9/23 law (rule 31, THE THREE ACTS AT ONCE). A GATE ENFORCING DEAD CANON
            AGAINST A LANE OBEYING LIVE CANON. It is instance 41's shape again.
PLUMBER     gates/canon_rot_gate.js is RED at 63 gone against a ceiling of 62, and the one
            new row is a ONE-WORD FILENAME MISMATCH, not missing work:
              records/tileforms/TF-ART-019_grid_kit.md  cites  tools/tfcook/TF-ART-019_grid_cook.py
              what exists is                                   tools/tfcook/TF-ART-019_cook.py
            The sheet has been in the repo since 9/1 (bf3c1b3d, PEOPLE lane), 26 days before
            this commit, and this commit touches three text files. Fixing the citation costs
            one word and drops the count back under the ceiling.
COMBAT      nothing owed. Rule 23 is cited here as the law whose AMENDMENT unblocked an
            argument, not as a combat reference imported into the economy.
DYNASTY     round 50's ruin-as-floor and this round's "the number never moves, what one
            buys does" (3c) are the same shape across a generation boundary.
COORDINATOR instance 41 of the gate hole, new flavour: A LAW MOVED AND THE PART THAT WAS
            WAITING ON IT WAS NEVER TOLD. See section 5.

===========================================================================
8. THE [bb ...] SCHOOL LINE (rule 33, every chat, continuously)
===========================================================================
[bb money] BB pays every man his own price, daily at noon, 20 in the company and 12 in the
field, and the payroll is what stops the company growing. We cannot copy one number of
that. We copy the SHAPE: one battery per head, charged once each, the head you cannot pay
drops a rung, and the cap we do not have is the brake we do not have.

===========================================================================
9. THE ANALOG HORROR LINE (rule 20h, every chat)
===========================================================================
The day's bill is one battery and it does not care how many of you there are. Nine people
eat what one person eats, and the ledger writes the same single line either way. Somebody
in that house is not eating and the books balance perfectly. THE HORROR IS THE CLEAN BOOK:
a ledger that cannot count the people it is starving, printing "the day ate: 1" every night
in the same handwriting while the house gets quieter.

===========================================================================
10. NOT IN A TAB YET
===========================================================================
Everything in this record is research. None of it is on a surface he can open. The purse and
the four verbs are live in the demo's day loop, which he reaches by playing, but nothing in
sections 4, 5 or 7 has been built and this lane does not build.
