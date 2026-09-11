# ECONOMY ROUND 30 -- Q30 [perk price]
# THE RUNNER AND THE ENFORCER ARE PAID THE SAME. SO THE PRICE IS THE SAME ONE.
# THE DIFFERENCE GOES IN THE CURRENCY, NOT THE NUMBER.
# And rumour is not made by danger. It is made by not being able to check.

MODE: RESEARCH. NOTHING WAS IMPLEMENTED. This file and the bank lines are the
whole deliverable. Every finding becomes a COMBAT, CHARACTER or WORLD job later,
and only the coordinator puts it on the board.

THE ROW, VERBATIM:
  Q30 What people in a collapse actually pay to know more: real material on what
  information costs when it is scarce (a lookout, a runner, a rumour, a map),
  who sells it and how it is priced against food, and how the best games price
  seeing over hitting. Deliver whether a perception perk should cost the same one
  as a fight perk, or something else, and why.

It feeds COMBAT [perks see], whose own row carries his 7/1 LOCKED intent:
"perks become a PERCEPTION system on the zoomed-out layer, not just combat stats;
better perks = you see more of what is happening around you, read the map deeper,
catch things."

---------------------------------------------------------------------------
## 1. WHAT I MEASURED IN OUR OWN CODE FIRST
---------------------------------------------------------------------------

**THE GAME HAS A SOUND FOR TAKING A PERK AND IT HAS NO PERKS.**

The word `perk` appears SEVEN times in the alpha the player opens. I read all
seven:

    2872, 6027   a comment, twice, in two copies of the same block
    2903, 6058   `difficultyMods: req.difficultyMods||{}   // perk/ability hooks land here`
    19755        a sound event label: 'perk_taken' -> "A PERK COMES ON"
    21501, 21504 that same sound event's definition and its comment

Four comments, one sound, and its two definition lines. The 23-perk tree lives in
records/BOHEMIA_COMBAT_THE_TREE_8_26_26.md, not in the game. The walked city has
ZERO mentions. So the row asks what a perception perk should cost, and there is
no perk in the build to price it against.

**EVERY SIGHT NUMBER IN THE GAME IS A FIXED CONSTANT. This is the ladder a
perception perk would move, and every rung is frozen:**

    standing SEE_RANGE       9    how far you can see a deed happen
    standing MAX_HOPS        2    how many retellings a story survives
    standing HEARSAY_LOSS    0.55 how much a story loses per retelling
    standing GOSSIP_WINDOW   45   minutes two people must be together to talk
    deed reach  quiet        7    hops 1
    deed reach  notable     12    hops 3
    deed reach  risky       17    hops 4
    deed reach  reckless    24    hops 5

Eight numbers, all constants, none of them reachable by anything a player does.
The row on COMBAT's board is right that without a perception branch every one of
these is a fixed number forever, and I can now say how many there are.

**AND THE INFORMATION MARKET IS ALREADY BUILT, IN TWO TIERS, AND IT IS FREE.**

engine/bohemia_asking.js: 14 rows, 7 subjects (names, power, salvage, strangers,
the hill, water, work) across 4 trades, plus one refusal line per trade. And the
part that matters:

    ROWS CARRYING A `deeper` LAYER:  14 of 14
    ROWS CARRYING ANY PRICE FIELD:    0

Every single answer has a second tier under it -- a `line` and an `implies` --
and not one row has a price on it. The walked surface asks, posts `ask:leaned`
(one clout), prints the surface answer, AND writes the deeper layer into a
notebook (bohemia_known.js, capped at 200 items). And the card really does show
it: `YOU HEARD "<line>"`, `WHICH LEAVES <implies>`, and a count of things you
know across subjects.

I want to be exact here because I nearly got it wrong: THE DEEPER LAYER IS NOT
HIDDEN. It is written, stored and rendered. What is missing is a PRICE ON DEPTH.

**SO: INFORMATION IN BOHEMIA COSTS ONE CLOUT AND RETURNS THE SAME TWO TIERS TO
EVERYBODY, EVERY TIME. A SHARP PLAYER AND A DULL ONE LEARN EXACTLY THE SAME
THING.** A perception perk today would have nothing to buy, because depth is
already free.

---------------------------------------------------------------------------
## 2. WHAT THE REAL RECORD PAYS FOR KNOWING
---------------------------------------------------------------------------

**THE ONE ORGANISATION WITH REAL NUMBERS PAYS THE RUNNER AND THE ENFORCER THE
SAME.**

Levitt and Venkatesh got four years of a drug-selling gang's actual monthly books
-- revenues, costs, and wages by rank. The structure:

    local leader                          about $8,500 a month
    OFFICERS: enforcers, treasurers,
    AND RUNNERS                           about $1,000 a month each
    foot soldiers (the ones on the corner) about $3.30 an hour

The person who CARRIES INFORMATION sits in the same pay band as the person who
APPLIES FORCE. Not above, not below. Both are officers. The one out front taking
the risk, the foot soldier, earns near or below minimum wage while the average
across the whole organisation ran $6 to $11 an hour.

That is the row's question answered by a payroll: **seeing and hitting are priced
the same, and both are priced far above standing in the open.**

**AND THE MOST EXPENSIVE THING A POOR PERSON BUYS IS A ROUTE.**

Smuggling fees for getting somewhere run from under $20 to over $15,000 depending
on route, distance and who you are. Mexico to the US is about $2,000; from
further out, crossing several borders, up to $10,000. The English Channel runs
3,000 to 7,000 euros. Central America to the US averaged about $7,500 including
food and travel, and migrants from three countries paid $2.2 billion in a single
accounting, most of it to smugglers.

**AND THE PAYMENT STRUCTURE IS THE PART TO STEAL.** People with money buy a
package: the whole route, one price, faster and more likely to work. People
without money buy PAY-AS-YOU-GO: one leg at a time, each leg paid for when they
reach it. The poor buy knowledge in pieces, the rich buy it in one lump, and the
pieces cost more in total.

**WHO SELLS IT: WHOEVER STANDS STILL.** Our own asking module already worked this
out without being told. Its four refusal lines are the whole sociology of an
information market in four sentences: the worker says "I work, I do not keep
track of who is doing what to who"; the scav says "ask somebody who stands still
for a living, I am never in one place long enough"; the keeper says "I hear
things across this counter all day, that is not one of them"; the watch says "I
watch this street, that is not this street." The counter and the sentry sell.
The one who moves and the one who is heads-down do not.

---------------------------------------------------------------------------
## 3. THE FINDING THAT PROVES US WRONG
---------------------------------------------------------------------------

The instinct is that a collapse is full of rumour because a collapse is
dangerous. Frightening place, frightened talk.

**THAT IS BACKWARDS, AND THE FORMULA FOR IT IS EIGHTY YEARS OLD.**

Allport and Postman, 1947: rumour equals IMPORTANCE times AMBIGUITY. R = i x a,
and it is MULTIPLICATIVE, so if either one goes to zero the rumour dies. Rumour
thrives only in the absence of secure standards of evidence. Rumour lives on the
lack of news.

Their own example is the one that settles it: **there were almost no fear rumours
in Britain during the worst of the Blitz**, because people believed the
government was telling them the truth about the damage. Bombs every night, and
the talk stayed quiet, because there was nothing to be uncertain about.

**SO THE VALLEY DOES NOT TALK BECAUSE IT IS BAD. IT TALKS BECAUSE NOTHING CAN BE
CHECKED.** And that flips how a perception perk has to be valued:

    A FIGHT PERK IS WORTH THE SAME EVERYWHERE.
    A PERCEPTION PERK IS WORTH WHATEVER THE FOG IS WORTH.

Its value is not a flat bonus. It scales with how little else can be confirmed,
which is exactly what the i x a form says. A player standing somewhere with good
information gets almost nothing from it. The same perk at the edge of the map,
about a faction nobody has seen, is the most valuable thing he owns.

We already own half that machine: HEARSAY_LOSS at 0.55 and MAX_HOPS at 2 are a
distortion model. Our stories already get worse as they travel. Nothing anywhere
lets a player be better at seeing through it.

---------------------------------------------------------------------------
## 4. THE OTHER HALF, FROM THE GAMES SIDE, AND IT COMPLICATES THE ANSWER
---------------------------------------------------------------------------

There is a known and well-documented problem with pricing a seeing perk the same
as a hitting perk: **PLAYERS WILL NOT TAKE IT.**

The design research on this is consistent. Damage is immediate and measurable,
so players can feel it land. Utility works indirectly on the outcome, so they
cannot. The documented result is that players report characters as weak when the
numbers say they are fine, and the analysis calls it a cognitive bias plus an
expectations problem rather than a balance problem. Given a choice at the same
price between a thing that makes a number go up now and a thing that changes what
they can find out later, players take the number.

So the two aisles disagree, and the disagreement is the design problem:

    THE REAL RECORD SAYS SEEING AND HITTING ARE WORTH THE SAME.
    THE PLAYERS SAY SEEING IS WORTH LESS, AND THEY ARE WRONG, AND THEY WILL KEEP
    BEING WRONG UNLESS THE PRICE TAG TELLS THEM OTHERWISE.

---------------------------------------------------------------------------
## 5. THE ANSWER THE ROW ASKED FOR
---------------------------------------------------------------------------

**YES. THE SAME ONE. EVERYTHING COSTS ONE AND NOTHING IN THIS ROUND EARNS AN
EXCEPTION -- THE ONE PAYROLL WITH REAL NUMBERS PUTS THE RUNNER AND THE ENFORCER
IN THE SAME BAND. THE DIFFERENCE GOES IN THE CURRENCY, NOT IN THE NUMBER.**

    A FIGHT PERK IS BOUGHT WITH WHAT YOU SURVIVED.
    A PERCEPTION PERK IS BOUGHT WITH WHAT YOU WERE TOLD.

Both cost one. They are one of different things. And that is not a new mechanism:
this game already has three currencies, and one of them is CLOUT, which already
drains on `ask:leaned` and has no faucet -- the walked surface says so in its own
comment, "run out and they are done being asked needs a clout FAUCET first, and
that is not this row."

**THIS IS THAT FAUCET'S REASON TO EXIST.** You do not buy eyes with batteries.
You buy them by being somebody people talk to. That answers "or something else,
and why" without touching EVERYTHING COSTS ONE, and it puts a floor under the
third currency, which today spends and never fills.

Four rungs under it, cheapest first:

  RUNG 1 -- WHAT IT BUYS IS DEPTH, NOT DISTANCE. The `deeper` layer is already
  written on 14 of 14 rows and is currently free to everybody. The first
  perception perk should be the difference between hearing what somebody said and
  hearing what it means. Nothing new is authored; a thing that is free becomes a
  thing you earned.

  RUNG 2 -- THE EIGHT FROZEN NUMBERS ARE THE BRANCH. SEE_RANGE 9, MAX_HOPS 2,
  HEARSAY_LOSS 0.55, GOSSIP_WINDOW 45, and the four deed reaches. That is a whole
  perception tree already enumerated, and none of it is new content.

  RUNG 3 -- IT IS WORTH MORE WHERE LESS IS KNOWN. R = i x a. Do not give a
  perception perk a flat bonus, because its real-world value is not flat. Where
  the player can already confirm things it should do almost nothing. That is also
  the answer to the player-bias problem: a perk that is dead weight at home and
  decisive at the edge of the map teaches its own value the first time it pays.

  RUNG 4 -- THE POOR BUY IT ONE LEG AT A TIME. The smuggling structure: a package
  for whoever can pay once, pay-as-you-go for whoever cannot, and the pieces cost
  more in total than the package. That is a pricing shape we get for free and it
  is the realistic one.

**AND THE WARNING, WHICH IS THE PLAYER-BIAS FINDING TURNED INTO A BUILD RULE: A
PERCEPTION PERK PRICED THE SAME AS A FIGHT PERK AND PRESENTED THE SAME WAY WILL
NOT BE TAKEN.** Same price, different currency, and the first one has to pay off
somewhere the player can SEE it pay off, or the branch ships and nobody touches
it. That is not a reason to make it cheaper. It is a reason to make it land.

---------------------------------------------------------------------------
## 6. ROUTED
---------------------------------------------------------------------------

Nothing here is a job until the coordinator makes it one.

  -> COMBAT [perks see]    the answer: same one, different currency. A fight perk
                           is bought with what you survived, a perception perk
                           with what you were told.
  -> COMBAT [perks see]    the branch is already enumerated: eight frozen sight
                           numbers, listed in section 1.
  -> COMBAT / WORDS        rung 1, the cheapest: the `deeper` layer is on 14 of 14
                           asking rows and is free to everybody today.
  -> WORLD                 THE CLOUT FAUCET. Clout drains on `ask:leaned` and has
                           no source; the walked surface names this in its own
                           comment. If perception is bought with what you were
                           told, this stops being a nice-to-have.
  -> WORLD / LIFE + CITY   rung 3: a perception perk should do almost nothing
                           where things can be confirmed, and a lot where they
                           cannot. R = i x a, and it is multiplicative.
  -> [PENDING Paolo]  (31) IS CLOUT WHAT YOU SPEND TO SEE MORE? The mechanism is
                           there (three currencies, clout already draining on the
                           ask) and EVERYTHING COSTS ONE is untouched either way.
                           Which pocket a perk comes out of is his.

---------------------------------------------------------------------------
## 7. WHAT IS NOT HERE, ON PURPOSE
---------------------------------------------------------------------------

I did not write a perception perk, did not set a sight number, did not pick how
much a deeper answer should cost, and did not design the clout faucet. Three of
those are COMBAT's or WORLD's and the fourth is a ruling.

I did not name a reference game for the perk tree. The player-bias finding is
from design research and user-research write-ups rather than from a title, and it
stays in plain words.

And I did not claim the deeper layer was hidden. My first read of the code was
heading there and the surface proved me wrong: it is stored AND rendered. What is
missing is a price on it, which is a smaller and truer finding.

---------------------------------------------------------------------------
## 8. THE GATE NOTE
---------------------------------------------------------------------------

Every gate in this lane's subset went green, and the round found that the game
ships a sound effect for taking a perk and has no perks.

These gates check that a part does what it says. Nothing checks that two parts
agree, that a part keeps working for as long as the game lasts, that it is the
right part to have, or that the parts form a loop that closes. Rounds 16 through
30, same sentence. A gate asking "does the perk sound event exist and is it
reachable from the sound bank" is green. A gate asking "is there anything to make
that sound about" does not exist.

---------------------------------------------------------------------------
## 9. SOURCES
---------------------------------------------------------------------------

Levitt and Venkatesh on a drug-selling gang's actual books, and the wage bands:
  https://pricetheory.uchicago.edu/levitt/Papers/LevittVenkateshAnEconomicAnalysis2000.pdf
  https://www.nber.org/papers/w6592
What a route costs, and the package versus pay-as-you-go split:
  https://www.unodc.org/unodc/en/frontpage/2026/June/who--where--how-and-why-a-data-driven-look-behind-migrant-smuggling-around-the-world.html
  https://www.cnn.com/2021/11/24/us/central-american-migration-costs/index.html
  https://www.migrationdataportal.org/themes/smuggling-migrants
Allport and Postman on rumour, R = i x a, and the Blitz:
  https://www.romolocapuano.com/wp-content/uploads/2018/10/ALLPORT_POSTMAN_AN-ANALYSIS-OF-RUMOR.pdf
  https://www.crisisnavigator.com/Killing-Rumors-A-50-Year-Old-Mathematical-Formula-Is-Key-Tool-in-Managing.491.0.html
Information under siege, and the channels people build when there is no news:
  https://link.springer.com/chapter/10.1057/9780230281479_10
  https://sarajevo.com/history/uncovering-the-siege-sarajevos-survival-and-resilience
Why players take the damage option, and call the other one weak:
  https://www.gamedeveloper.com/game-platforms/user-research-do-players-complain-about-weak-characters-because-of-too-little-damage-
  https://dl.acm.org/doi/full/10.1145/3675807
