# ECONOMY ROUND 33 -- Q33 [barter day]
# NOBODY BARTERS FOR LONG. THEY PRINT.
# And nothing in our game can swap, because a swap is two legs and there is
# exactly ONE PURSE IN THE WHOLE GAME.

MODE: RESEARCH. NOTHING WAS IMPLEMENTED. This file and the bank lines are the
whole deliverable. Every finding becomes a WORLD or LIFE + CITY job later, and
only the coordinator puts it on the board.

THE ROW, VERBATIM:
  Q33 How swapping actually works when money is gone: real material on barter and
  owing in the weeks after a currency dies (what gets swapped for what, who keeps
  the tally, how a favour is priced), and what the best games have done to make
  trading without money feel like a market and not a menu. Deliver the rule for
  WORLD [full shelves]: what can move when nothing can be bought.

It feeds WORLD [full shelves], which was harvested from my own round 29 and says:
"the day after the last battery is spent, THE SHELVES FILL UP AND NOBODY CAN BUY
ANYTHING... trade stops dead until people fall back to swapping and owing."

Section 2 is about that last clause, because it is half wrong.

---------------------------------------------------------------------------
## 1. WHAT I MEASURED IN OUR OWN CODE FIRST
---------------------------------------------------------------------------

**THERE IS EXACTLY ONE PURSE IN THE WHOLE GAME.**

    BohemiaPurse.create()   appears ONCE in the walked surface
    purseGet()              a singleton, 20 call sites, all the player's

No NPC has a purse. No faction has a purse. No shop has a purse. There is one
pocket in the valley and it belongs to the player.

**AND THE SWAP PRIMITIVE IS BUILT, WORKS, AND IS HALF-CALLED.**

PURSE.KINDS is ["source","drain","convert","transfer"], and the transfer pair is
there:

    transferOut(purse, currency, amount, reason, ref, day)   -> posts -amount, kind 'transfer'
    transferIn (purse, currency, amount, reason, ref, day)   -> posts +amount, kind 'transfer'

I ran a real two-purse swap and it works exactly as written: A had 5 resources,
transferOut took 2, transferIn put 2 into B, both applied, both ledgers correct.

    CALLERS OF transferOut IN THE GAME:  THREE, all real
    CALLERS OF transferIn  IN THE GAME:  ZERO
      (its four mentions are the definition, the flow accounting, and the export)

**SO EVERY TRANSFER IN THIS GAME IS ONE-LEGGED. THE THING LEAVES AND NOBODY
RECEIVES IT.** And the code is explicit that it means otherwise. Both live sites
say so in their own comments:

    "A TRANSFER, NOT A DRAIN. The purse's own words: a drain is destroyed and
     gone, a transfer moved to another holder. THE CREW HAS THE CUT."

    "transferOut, not debit, because restitution GOES TO the person wronged
     rather than being consumed."

The crew does not have the cut. The person wronged does not have the restitution.
Nobody has a pocket to put them in. **THE LEDGER SAYS TRANSFER AND MEANS
DESTROYED**, and it says so honestly in the kind field while being wrong in the
reason string.

**AND THE OTHER DIRECTION IS WORSE.** In the one place goods come back to the
player -- the road event at line 35596 -- it is `credit`, a SOURCE, not
transferIn:

    if(o.give){ BohemiaPurse.credit(purseGet(),'resources',o.give,
                  'taken on the road: '+ev.id, ...) }

So in the one swap the game has, **THE PLAYER'S HALF IS A TRANSFER AND THE OTHER
SIDE'S HALF IS A MIRACLE.** Goods leave to nowhere and goods arrive from nowhere,
and the ledger's own audit cannot see it because both halves are individually
legal.

**AND ONE MORE, WHICH MATTERS FOR A SWAP SPECIFICALLY: THE ONE-PERSON MOVE IS
ATOMIC AND THE TWO-PERSON MOVE IS NOT.** convert() does both its legs inside one
function and pops the first back off if the second fails, with the comment "a
half-applied conversion would mint or burn". transferOut and transferIn are two
separate calls with no atomic swap() between them, so a trade between two people
can half-happen by construction. The safe version is the one you do alone.

**CREDIT WHERE IT IS DUE, AND IT IS THIS LANE'S OWN:** the restitution site above
now really moves batteries, and its comment says why: "This line used to pass
how:'paid' with no amount anywhere in the call, so the card said PAID THEM BACK
and nothing ever left the purse. ECONOMY found it the round after it shipped."
That was round 26. PEOPLE fixed it, there is a priceOf in standing now, and the
batteries leave. The remaining half is that they leave toward nobody.

---------------------------------------------------------------------------
## 2. THE FINDING THAT PROVES US WRONG
---------------------------------------------------------------------------

The row's premise, and [full shelves]' premise, and mine in round 29, is that when
money dies people FALL BACK TO SWAPPING AND OWING.

**THEY DO, FOR ABOUT A MONTH. THEN THEY PRINT MONEY.**

Argentina is the clearest case because it is the biggest. The barter clubs started
in 1995 with TWENTY-THREE PEOPLE at a garage sale in Bernal. By April 2001 there
were about 1,800 nodes. In May 2002, at the bottom of the crisis, there were
5,000 NODES AND TWO MILLION MEMBERS, sixty percent of them in Buenos Aires, and
the networks reached over SIX MILLION people across five years.

And here is the sequence, which is the whole finding:

    it began as a mutual-credit system, a ledger of who owed what
    they tried a version called NODINE -- from "no dinero", NOT MONEY
    IT BECAME A PRINTED CURRENCY ANYWAY: the CREDITO
    an estimated 2.5 MILLION ARGENTINIANS USED THE CREDITO between 2001 and 2003

They named the thing after the absence of money and it turned into money. Each
node was autonomous and wrote its own rules, including how many créditos you got
handed when you joined.

**AND BARTER RECEDES. IT IS A PHASE, NOT A DESTINATION.** Russia has the numbers
because its barter ran through industry and got counted:

    1992    barter was 5 to 10% of industrial transactions
    1998    50 to 60%, and over half of all industrial transactions used no money
    2000    back down to 20 to 30%

It peaked and it fell. And the Russian classification of what actually moved is
the three-rung ladder this round delivers, because they named all three:

    PURE BARTER            goods straight for goods
    OFFSETS (zachety)      a debt settled with goods or services
    MONEY SURROGATES       promissory notes, veksels, issued by firms and banks

**SO THE ANSWER TO "WHAT CAN MOVE WHEN NOTHING CAN BE BOUGHT" IS NOT MAINLY
GOODS. IT IS TALLIES.** Offsets and surrogates are the two big slices; pure barter
is the small, slow, annoying one that everybody abandons as soon as they can.

---------------------------------------------------------------------------
## 3. WHO KEEPS THE TALLY, AND HOW A FAVOUR IS PRICED
---------------------------------------------------------------------------

**EVERYBODY KEEPS THEIR OWN, AND IT STARTS AT ZERO.**

The TEM in Volos, Greece, running since 2010 with close to a thousand members: you
sign up, YOUR ACCOUNT STARTS AT ZERO, you take payment in TEMs for what you do,
you spend TEMs on what others do, and you can check your balance whenever you
like. Every Saturday they all meet at one central market. There is no central
treasury handing out a stock; there is a ledger per person and a market day.

That is the structural answer to section 1. In every real system that worked,
**EVERY PARTICIPANT HAS AN ACCOUNT.** Our game has one account and that is
precisely why nothing can swap.

**AND HOW A FAVOUR IS PRICED: ONE HOUR IS ONE HOUR, WHATEVER THE SKILL.**

That is the founding rule of time banking and it is not an accident of
bookkeeping. The reason given, in the literature's own words, is that one hour
equals one hour "creating fairness, dignity, and a community where everyone can
participate". A surgeon's hour and a cleaner's hour settle the same.

**THAT IS EVERYTHING COSTS ONE (8/15), ARRIVED AT INDEPENDENTLY BY REAL PEOPLE
WHO NEEDED IT TO WORK.** His law is not a simplification we are carrying for
convenience. It is what communities without money actually choose, for a reason
they can state, and this round is the second time it has been confirmed from
outside (round 27 found the same shape in welfare ratios). Worth saying plainly,
because the lane has spent thirty-two rounds testing his rulings and this one
keeps passing.

---------------------------------------------------------------------------
## 4. WHAT MAKES IT A MARKET AND NOT A MENU
---------------------------------------------------------------------------

The design writing on barter systems converges on one thing, and it is not
haggling dialogue.

**ASYMMETRICAL NEEDS MAKE A MARKET. A VALUE TABLE MAKES A MENU.**

The menu version is the one everybody builds: both inventories on screen, a fair
total, accept. What changes it is that the player CANNOT SAVE UP -- he has to go
and find the specific thing this particular person wants, and limited carrying
space forces him to be pragmatic about what he brings. The leverage in a real
trade is knowing what the other one is short of.

And we are unusually well set up for that, because the asymmetry is already
written and already [PENDING Paolo]:

  - the asking module's four trades each REFUSE a different subject, in their own
    voice, so the valley already knows that different people know different things
  - fourteen faction seats, each a real market on the walked surface
  - and [PENDING Paolo] 15 in this lane's own list, open since round 18: WHAT
    WILL EACH FACTION NOT TRADE? Fourteen answers, one short phrase each.

That pending is not a nice-to-have for flavour. **IT IS THE FIELD THAT TURNS A
BARTER SCREEN INTO A MARKET**, and nothing else in this round needs a ruling.

---------------------------------------------------------------------------
## 5. THE RULE FOR [FULL SHELVES]
---------------------------------------------------------------------------

**NOTHING CAN SWAP UNTIL SOMEBODY ELSE HAS A POCKET. A SWAP IS TWO LEGS AND THIS
GAME HAS ONE.**

That is the precondition and it is cheap: transferIn is written, tested by my own
run, and has never been called. It needs a second purse to call it on.

Then what moves, in the order the real record moved it:

  RUNG 1 -- THE TALLY MOVES FIRST, NOT GOODS. Offsets were the biggest slice of a
  moneyless economy, and we already have half the machine: bohemia_favour.js
  carries owedOf(), owedRow() and settle(), live on the walked surface, and
  bohemia_claim.js collects. ON THE DAY THE BATTERIES RUN OUT, THE FIRST THING
  THAT CAN MOVE IS WHAT PEOPLE ALREADY OWE EACH OTHER. No new currency, no new
  screen, and it is the thing round 29 said the shop should do anyway.

  RUNG 2 -- GOODS FOR GOODS, AND ONLY WHERE THE WANTS DIFFER. Pure barter, the
  small slow slice. It is worth building ONLY with the asymmetry from section 4,
  because without it, it is the menu. One faction short of water and another
  sitting on it is a market; a table of equivalent values is a spreadsheet.

  RUNG 3 -- SOMEBODY PRINTS, AND THE VALLEY AGREES TO TAKE IT. The Argentina
  shape: a node, its own rules, its own printed thing, and how much you get handed
  when you join. Round 29 already measured that the mechanism is built --
  convert() takes any rate, unwinds cleanly, and has ZERO callers -- and round 29's
  warning still stands: whoever holds the new thing on day one is rich and did
  nothing.

  RUNG 4 -- AND IT RECEDES. Russia went 50-60% back to 20-30% once money worked
  again. BARTER SHOULD BE A PHASE THE VALLEY PASSES THROUGH, NOT A PERMANENT
  SECOND ECONOMY. If it never recedes we have built two economies to balance
  forever instead of one crisis to survive.

  AND THE PRICE, ACROSS ALL FOUR: ONE FOR ONE. His law already says it and real
  communities chose it for a stated reason. Nothing in this round asks to move it.

---------------------------------------------------------------------------
## 6. ROUTED
---------------------------------------------------------------------------

Nothing here is a job until the coordinator makes it one.

  -> WORLD [full shelves]  THE PRECONDITION: one purse in the whole game, and
                           transferIn has zero callers. Nothing can swap until
                           somebody else has a pocket.
  -> WORLD [full shelves]  the four rungs above, in that order. Rung 1 needs no
                           new currency and no new screen.
  -> WORLD                 the one-legged transfer: three transferOut callers whose
                           own comments say the goods went TO somebody, and no
                           transferIn anywhere. The ledger says transfer and means
                           destroyed.
  -> WORLD                 goods arriving use `credit` (a source) rather than
                           transferIn, so the player's half of a trade is a
                           transfer and the other side's half is a miracle.
  -> WORLD / PLUMBER       there is no atomic swap(). convert() unwinds a failed
                           second leg; a two-person transfer cannot, so a trade can
                           half-happen by construction.
  -> FACTIONS              [PENDING Paolo] 15 is the field that makes barter a
                           market instead of a menu, and it has been open since
                           round 18.
  -> [PENDING Paolo]  (34) DOES ANYBODY ELSE IN THE VALLEY HAVE A POCKET? Not a
                           number: a shape. One purse means no swap, no tab, no
                           restitution that arrives, and no market day. Five
                           rounds of this lane's findings stop at this one wall
                           wearing different clothes.

---------------------------------------------------------------------------
## 7. WHAT IS NOT HERE, ON PURPOSE
---------------------------------------------------------------------------

I did not give anybody a purse, did not write a swap, did not fill the
what-they-will-not-trade list and did not pick an exchange rate. The first three
are other lanes' and the fourth is a ruling.

I did not design the market day. Volos holds one every Saturday in one place and
that is a strong shape, but WHERE and WHEN a market meets in this valley is
FACTIONS' and LIFE+CITY's, and my own round 10 already has a pending on the market
week sitting unanswered.

And I did not use the Argentina finding to argue that [full shelves] is wrong. Its
premise is half right: swapping and owing IS what happens. What the row does not
say is that it ends, in weeks, with somebody printing, and that is the half this
round adds.

---------------------------------------------------------------------------
## 8. THE GATE NOTE
---------------------------------------------------------------------------

Every gate in this lane's subset went green, and the round found that every
transfer in the game is one-legged and that the whole valley shares one pocket.

These gates check that a part does what it says. Nothing checks that two parts
agree, that a part keeps working for as long as the game lasts, that it is the
right part to have, or that the parts form a loop that closes. Rounds 16 through
33, same sentence. transferOut passes. transferIn passes. The purse's audit passes,
because a one-legged transfer is two individually legal entries. A gate asking
"did the other side of this transfer ever arrive" cannot exist yet, because there
is no other side to ask.

---------------------------------------------------------------------------
## 9. SOURCES
---------------------------------------------------------------------------

Argentina's trueque, the crédito, and the scale of it:
  https://en.wikipedia.org/wiki/Cr%C3%A9dito
  http://taoaproject.org/index.php/2011/01/30/barter-clubs-in-argentina/
  https://www.cambridge.org/core/books/abs/argentinas-parallel-currency/launching-the-club-de-trueque/F7A9A2119D39E142230BD1D7DD0202F4
  https://upsidedownworld.org/archives/argentina/barter-networks-lessons-from-argentina-for-greece/
Russia's barter share, and the three kinds of non-monetary transaction:
  https://www.sciencedirect.com/science/article/abs/pii/S0304387801001924
  https://www.cambridge.org/core/books/abs/vanishing-rouble/barter-in-russia/68E48F06E29B749A01E4BA9DEE631323
  https://economics.ecu.edu/wp-content/pv-uploads/sites/165/2019/04/TuvshintulgaBold.pdf
Who keeps the tally: the TEM in Volos, and time banking's one-hour rule:
  https://en.wikipedia.org/wiki/TEM_(currency)
  https://2012gsgreece.blogs.princeton.edu/2012/06/27/euro-drachma-try-the-tem/
  https://en.wikipedia.org/wiki/Time-based_currency
  https://www.timebanks.org/
What makes a barter screen a market instead of a menu:
  https://gamerant.com/best-barter-systems-in-games/
  https://www.roleplayingtips.com/npcs-roleplaying/bartering-for-profit-3-ways-to-make-haggling-with-merchants-fun/
