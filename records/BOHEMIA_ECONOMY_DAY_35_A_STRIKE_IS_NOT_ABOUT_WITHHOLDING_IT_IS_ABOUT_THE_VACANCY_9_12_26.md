# ECONOMY ROUND 35 -- Q35 [rent riot]
# A RENT STRIKE IS NOT ABOUT WITHHOLDING MONEY. IT IS ABOUT CONTROLLING WHO CAN
# TAKE YOUR PLACE. And what a neighbourhood actually wins is not a lower price,
# it is a PUBLISHED one.
# We built the cut-off and never built the strike.

MODE: RESEARCH. NOTHING WAS IMPLEMENTED. This file and the bank lines are the
whole deliverable. Every finding becomes a WORLD, FACTIONS or LIFE + CITY job
later, and only the coordinator puts it on the board.

THE ROW, VERBATIM:
  Q35 What happens when a whole block cannot pay the owner: real material on rent
  strikes, generator cut-offs and the collective side of the Lebanese and Iraqi
  generator economies (when a neighbourhood refuses together, what the owner does,
  who wins), and how games have handled a district turning on its landlord.
  Deliver the rule for the day a block stops paying.

---------------------------------------------------------------------------
## 1. WHAT I MEASURED IN OUR OWN CODE FIRST
---------------------------------------------------------------------------

**THE BLOCK ALREADY EXISTS AS A REAL UNIT, AND IT IS ALREADY PRICED.**

engine/bohemia_towns.js blocksOf(m, cat) floods the map between edges
(SEEN_EDGE = road, freeway, rail, water, mount, open, none) and returns a list of
blocks, each one `{i, cells[], count, worth, cx, cy}`. Measured on five seeds:

    seed 1   493 blocks | cells: biggest 349, median 6, smallest 1
             worth: richest 1,956,654  median 20,294  poorest 0   valley 14,426,096
    seed 2   467 blocks | biggest 451, median 6 | richest 2,285,099, median 23,853
    seed 3   483 blocks | biggest 448, median 6 | richest 2,287,789, median 23,700
    seed 4   479 blocks | biggest 400, median 7 | richest 2,147,228, median 23,864
    seed 5   467 blocks | biggest 491, median 7 | richest 2,502,008, median 24,978

About four hundred and eighty blocks in the valley. A typical one is SIX CELLS --
small enough to be a street's worth of neighbours, which is exactly the unit a
strike happens on. And the inequality is already in the generator:

    THE RICHEST 10% OF BLOCKS HOLD 36.4% OF THE VALLEY'S WORTH (seed 1, measured)
    BLOCKS WORTH NOTHING AT ALL: 1 of 493

**THE OWNER'S WEAPON IS BUILT. THE BLOCK'S IS NOT.**

engine/bohemia_powergrid.js:

    douse(id)    cuts one circuit. Refuses if it was not live, or already dark.
    relight(id)  deletes the dark flag. TAKES NO PAYMENT.
    isDark(id)   reads it.

And the grain is wrong for a strike, measurably:

    circuits in the valley   1690
    blocks in the valley      493
    => about 3.4 circuits per block. A BLOCK IS NOT A CIRCUIT.

So the owner can cut a wire and cannot cut a street, and the street cannot do
anything at all: round 33 measured ONE PURSE in the whole game, and round 34
measured that the only debt ledger counts THE NIGHTS THE PLAYER OWES A FACTION.
Nobody on a block can refuse, because nobody on a block can pay in the first place.

**WE BUILT THE CUT-OFF AND NEVER BUILT THE STRIKE.**

**AND ONE THING WORLD GOT RIGHT THAT SECTION 4 SAYS TO KEEP.** Their own state
line: a circuit you cannot pay for "GOES DARK, stays dark, rides its own save key,
and stops billing him (no debt spiral)." And relight() takes no payment because
"what it costs to get your lights back is a price and prices are his". Both of
those are the correct call and section 4 explains why.

---------------------------------------------------------------------------
## 2. THE FINDING THAT PROVES US WRONG
---------------------------------------------------------------------------

The instinct -- the row's framing and mine -- is that the owner wins. He holds the
asset, he holds the generator, he can cut you off, and a block with no money has
nothing to fight with.

**THE BEST-DOCUMENTED CASE IS THE BLOCK WINNING IN NINE MONTHS, AND THE MECHANISM
IS NOT WITHHOLDING THE RENT.**

Glasgow, 1915. Landlords raised rents on munitions workers' families. Tenants
began paying only the old amount, refusing the increase. Mary Barbour, described
in the accounts as an ordinary housewife, formed the Glasgow Women's Housing
Association and organised a general strike across the city out of people's front
rooms.

    BY NOVEMBER, MORE THAN 25,000 WORKING-CLASS FAMILIES WERE REFUSING TO PAY.
    25 November: a bill restricting rent increases introduced.
    CHRISTMAS DAY 1915: it became law. Rents pegged back to pre-war levels and
    unable to rise unless the dwelling was improved.

And here is the mechanism, which is the whole finding. Two things, and only one of
them is about money:

    "Mrs Barbour's Housewives Committee DROVE BAILIFFS FROM THE DOORS of strikers"
    "EMPTY HOUSES WERE PICKETED, with new tenants who had agreed to pay the
     increased rent NOT PERMITTED TO ENTER THEIR NEW HOME"

**A LANDLORD DOES NOT LOSE MONEY WHEN YOU REFUSE TO PAY. HE LOSES MONEY WHEN HE
CANNOT REPLACE YOU.** Withholding rent is a nuisance he can answer with an
eviction. Picketing the empty house is what makes the eviction worthless, and it
is the reason twenty-five thousand families beat the law into a different shape in
nine months.

**A STRIKE IS NOT ABOUT WITHHOLDING. IT IS ABOUT CONTROLLING THE VACANCY.**

---------------------------------------------------------------------------
## 3. THE SECOND FINDING: WHAT A NEIGHBOURHOOD ACTUALLY WINS
---------------------------------------------------------------------------

Lebanon after the grid failed is the live version, and it answers the row's
"generator cut-offs" directly.

**FIRST, HOW IT IS SOLD, AND IT IS NOT BY THE UNIT OF POWER.** Private generator
owners sold flat-rate subscriptions by AMPERAGE -- 2.5, 5 or 10 amperes -- and the
reporting's own comparison is "akin to purchasing bandwidth in an Internet plan."
**YOU DO NOT BUY ELECTRICITY. YOU BUY A CAPACITY**, and what you can run at once
is the thing you are paying for.

**SECOND, AND THIS IS THE NUMBER OF THE ROUND.** In late 2021, eleven residents
who all had FIVE AMPERES reported paying between LL550,000 and LL2,000,000 a
month. Three of them lived in the same neighbourhood, Geitawi, all on five-ampere
flat-fee subscriptions:

    LL550,000   |   LL900,000   |   LL1,250,000

**SAME STREET. SAME SERVICE. MORE THAN TWICE THE PRICE, AND ACROSS THE WIDER
SAMPLE NEARLY FOUR TIMES.** The price was whatever your generator man decided you
would pay.

**THIRD, WHAT THE COLLECTIVE PRESSURE ACTUALLY PRODUCED.** Not a lower price. A
PUBLISHED one. The Ministry of Energy and Water now issues an official tariff at
the end of every month, built from the average diesel price plus operating costs
plus, in the reporting's own words, "a good profit margin for its owners." The
state became the PRICE-SETTER without ever becoming the supplier. And both sides
are unhappy with it, which is the sign of a real settlement: citizens say the
owners profiteer, owners say the tariff does not cover their costs.

**SO WHAT A BLOCK WINS IS NOT CHEAPER POWER. IT IS THE END OF BEING CHARGED
DIFFERENTLY FROM THE MAN NEXT DOOR.**

---------------------------------------------------------------------------
## 4. WHAT THE GENRE DOES, AND WHY OURS IS ALREADY BETTER
---------------------------------------------------------------------------

In plain words, no game named, because no game he has not named enters the design:
the standard city-builder answer to a district turning on you is ONE CONTENTMENT
NUMBER WITH A LINE AT ZERO. Below the line the place starts damaging its own
buildings, one per turn. A clock runs, and if you do not fix it inside the clock
the place is lost to a neighbour for good. Output falls as buildings break, which
lowers contentment further, which breaks more buildings.

**THAT IS A DEATH SPIRAL AND IT IS THE KNOWN FAILURE OF THE SHAPE.** Once it
starts it feeds itself, the player's only real move was to have prevented it, and
the punishment arrives as arithmetic rather than as anybody's decision.

**AND WORLD ALREADY REFUSED IT, IN WRITING.** A circuit our player cannot pay for
goes dark, STAYS dark, and STOPS BILLING HIM -- their own note says "no debt
spiral". That is the right call and it should survive into the collective version:
a block that stops paying must reach a new stable state, not a slide.

---------------------------------------------------------------------------
## 5. THE RULE FOR THE DAY A BLOCK STOPS PAYING
---------------------------------------------------------------------------

**WHEN A WHOLE BLOCK STOPS PAYING, THE OWNER'S CUT STOPS WORKING, BECAUSE A CUT
ONLY HURTS SOMEBODY WHO CAN BE REPLACED.** That is the rule. Four rungs under it.

  RUNG 1 -- THE BLOCK IS THE UNIT, AND IT ALREADY EXISTS. About 480 of them per
  seed, a typical one six cells, each with its own worth. The day a block stops
  paying is a BLOCK-level event and the block already has an identity, a centre
  and a price. Nothing new has to be generated.

  RUNG 2 -- THE OWNER'S FIRST MOVE IS THE CUT, AND IT IS BUILT. douse() exists and
  works. Two things must hold: it has to be able to reach a whole block (today it
  cuts one circuit of the 3.4 in an average block), and the result must stay the
  stable dark WORLD already chose -- dark, still dark, no longer billed. NO SPIRAL.

  RUNG 3 -- THE BLOCK'S WEAPON IS THE VACANCY, NOT THE REFUSAL. This is the
  finding and it is the one thing nothing in our game can express. The question on
  the day a block stops paying is not "how long can they go without" -- it is CAN
  ANYBODY ELSE BE FOUND TO PAY. If the owner can put somebody else on that block
  tomorrow, the strike is a tantrum. If the block can keep the next tenant out,
  the block wins, and it wins in weeks rather than never.

  RUNG 4 -- AND WHAT THE BLOCK WINS IS A PUBLISHED PRICE. Lebanon's actual
  outcome: not cheaper, the same for everybody, set out loud, with a margin the
  owner can live with and both sides grumbling. That is a far better prize than a
  discount because it is a thing the whole valley can SEE change.

**AND THE TWO ROUNDS MEET HERE, WHICH IS WORTH SAYING PLAINLY.** Round 34 measured
SIXTEEN MARKETS AND ONE PRICE and found it makes the biggest real road to wealth
impossible. Round 35 finds the same fact makes a rent strike POINTLESS: if
everybody in the valley is already charged the same one, there is nothing to
strike about. A price that varies BY BLOCK is the precondition for both -- for a
player getting rich on knowing two prices, and for a street having a grievance
worth organising around. ONE PRICE EVERYWHERE IS NOT A SIMPLIFICATION WE ARE
CARRYING. IT IS THE REASON TWO WHOLE SYSTEMS CANNOT EXIST.

---------------------------------------------------------------------------
## 6. ROUTED
---------------------------------------------------------------------------

Nothing here is a job until the coordinator makes it one.

  -> WORLD / LIFE + CITY  RUNG 3, and it is the one that needs building: a block
                          can refuse only if there is a next tenant to keep out.
                          Nothing in the game models a replacement.
  -> WORLD                douse() cuts ONE circuit and a block holds about 3.4.
                          The owner's weapon is finer-grained than the unit a
                          neighbourhood refuses on.
  -> WORLD                KEEP THE STABLE DARK. The genre's answer to unrest is a
                          death spiral; WORLD already refused one in writing and
                          the collective version must inherit that refusal.
  -> FACTIONS / WORLD     RUNG 4: a published price is what a block wins. Our one
                          price is already published and charged to everybody, so
                          the thing to build is the VARIATION first.
  -> LIFE + CITY          the block data is richer than anything using it: 480
                          blocks, each with a worth, richest 10% holding 36.4%.
                          That is a map of who has something to lose.
  -> [PENDING Paolo] (36) DOES A PRICE EVER DIFFER FROM ONE BLOCK TO THE NEXT?
                          EVERYTHING COSTS ONE is his and this round does not ask
                          to move it. The question is narrower: may the SAME one
                          battery buy a different amount of the same thing
                          depending on whose block you are standing on? Two whole
                          systems -- rounds 34 and 35 -- wait on that one answer.

---------------------------------------------------------------------------
## 7. WHAT IS NOT HERE, ON PURPOSE
---------------------------------------------------------------------------

I did not make douse() reach a block, did not write a vacancy, did not set a
tariff and did not pick how long a strike takes to bite. The first two are other
lanes' and the last two are rulings.

I did not use the Lebanese spread to argue against EVERYTHING COSTS ONE. His law
says the PRICE is one and nothing in this round contradicts that; what the real
record varies is what the one buys, which is a different field and is why the
pending is phrased the way it is.

And I did not name the city-builder whose unrest mechanic section 4 describes. It
is not on his reference list, so it arrives as a mechanic in plain words and
leaves again.

---------------------------------------------------------------------------
## 8. THE GATE NOTE
---------------------------------------------------------------------------

Every gate in this lane's subset went green, and the round found that the game can
cut a block off and the block cannot refuse.

These gates check that a part does what it says. Nothing checks that two parts
agree, that a part keeps working for as long as the game lasts, that it is the
right part to have, or that the parts form a loop that closes. Rounds 16 through
35, same sentence. douse() passes, relight() passes, blocksOf() passes. A gate
asking "can anybody other than the player refuse to pay for anything" does not
exist, and on today's build it would be red.

---------------------------------------------------------------------------
## 9. SOURCES
---------------------------------------------------------------------------

Glasgow 1915: the scale, the bailiffs, the picketed empty houses, and the Act:
  https://en.wikipedia.org/wiki/1915_Glasgow_rent_strikes
  https://nvdatabase.swarthmore.edu/content/glaswegian-women-campaign-rent-control-scotland-1915
  https://remembermarybarbour.wordpress.com/mary-barbour-rent-strike-1915/
  https://en.wikipedia.org/wiki/Increase_of_Rent_and_Mortgage_Interest_(War_Restrictions)_Act_1915
Lebanon's generator economy: amperes, the spread on one street, and the tariff:
  https://today.lorientlejour.com/article/1285477/lebanons-generator-sector-the-known-workings-of-a-once-illegal-largely-unregulated-industry.html
  https://raseef22.net/english/article/1092975-no-power-to-the-people-how-private-generator-owners-own-lebanons-electricity
  https://today.lorientlejour.com/article/1493337/generator-tariffs-fall-for-second-consecutive-time-in-january.html
  https://smartioleb.com/generator-tariff-lebanon/
The unrest-and-revolt shape the genre uses, and its death spiral:
  https://primagames.com/tips/how-to-fix-and-prevent-revolts-in-civilization-7
