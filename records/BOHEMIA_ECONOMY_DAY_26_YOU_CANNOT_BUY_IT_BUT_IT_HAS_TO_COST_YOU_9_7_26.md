# ECONOMY ROUND 26 -- Q26 [forgiveness price]
# YOU CANNOT BUY IT, BUT IT HAS TO COST YOU.
# And our ladder is flat: the worst thing a player can do is fourteen small
# favours away from settled.

MODE: RESEARCH. NOTHING WAS IMPLEMENTED. This file and the bank lines are the
whole deliverable. Every finding becomes a PEOPLE, WORLD or LIFE + CITY job
later, and only the coordinator puts it on the board.

THE ROW, VERBATIM:
  Q26 What settling a wrong actually costs in the real world: restitution
  customs, blood money, public apology, the debt of a favour; how much of the
  harm the wronged party expects back and in what form; and what the best games
  have charged a player to be forgiven. Deliver the ladder PEOPLE [make it
  right] should price against, now that a deed can be settled.

---------------------------------------------------------------------------
## 1. WHAT I MEASURED IN OUR OWN CODE FIRST
---------------------------------------------------------------------------

PEOPLE shipped [make it right] this round, so for the first time a deed can be
settled. I ran the shipped thing before reading anything.

**NOT ONE LINE OF THE SOCIAL SIDE OF THIS GAME TOUCHES MONEY.**

  grep for purse, electricity, resources, battery, BohemiaPurse across the six
  modules that hold every social mechanic we have:

    bohemia_standing.js    0 references     (deeds, opinion, forgiveness)
    bohemia_favour.js      1, and it is a comment quoting a definition
    bohemia_claim.js       0
    bohemia_belonging.js   0
    bohemia_commitment.js  0
    bohemia_deeds.js       0

  And from the other side: PURSE.PRICES has eleven keys and not one of them is
  a person, a deed, an apology or a debt. PURSE.VERBS has four and the only
  social one, `ask:leaned`, spends clout, never goods.

So Bohemia has TWO economies that have never met. One is batteries and shelves.
The other is who saw what you did. Nothing crosses.

**FORGIVENESS IS FREE, AND THE GAME ALREADY CALLS IT PAID.**

  engine/bohemia_standing.js:
    RIGHT_WORDS = { settled:  'SQUARED WITH THEM',
                    paid:     'PAID THEM BACK',
                    forgiven: 'THEY LET IT GO',
                    spared:   'YOU HAD THEM AND DID NOT' }
    makeRight(mind, actorId, opts)   arity 3, no purse, no currency, no amount.

  slices/BOHEMIA_CITY_WORLD.html:59477, the button on the walked surface:
    BohemiaStanding.makeRight(m,'@',{how:'paid',turn:ctMinuteNow()});

The one live caller in the game passes `paid`. The card says PAID THEM BACK.
NOTHING IS EVER PAID. The word for restitution already exists in the file and
there is no mechanism under it.

That is not a criticism of the lane that built it -- the row it shipped was
about a deed being settled at all, and it is a good build. It is the exact hole
this round was asked to price.

**WHAT IT ACTUALLY COSTS TODAY, MEASURED.**

wouldSquare() fires when everything else that person knows about you already
comes out positive: `rest > 0 && rest + grudge >= 0`. So the price of a wrong is
paid in later good turns, seen by the same person. That is the right shape and
I want to say so before I say what is wrong with it.

I filled DEED_WEIGHT locally (it ships empty by law) from the game's own clout
ladder in bohemia_deeds.js -- quiet 8, notable 25, risky 55, reckless 110 -- and
counted how many good turns it takes:

    the wrong you did      | in small good turns | in notable ones
    quiet      (8)         |          1          |        1
    notable    (25)        |          4          |        1
    risky      (55)        |          7          |        3
    reckless   (110)       |         14          |        5

And waiting never works, which is a good property and worth writing down. The
grudge decays with a halflife of 30,240 game minutes, about three weeks, but
`rest` stays at zero if you never did anything good, so wouldSquare never fires
on time alone:

    turn     0  would:false  grudge -110.00  rest 0.00
    turn  1000  would:false  grudge -109.68  rest 0.00
    turn  5000  would:false  grudge -108.39  rest 0.00

You cannot outlive a wrong in this game. You have to earn it back. Keep that.

**THERE IS ALREADY AN OWED LEDGER, AND I HAD IT WRONG.**

Rounds 24 and 25 both said nobody in this valley can be owed anything. That is
true of the PURSE -- KINDS is ["source","drain","convert","transfer"] with no
OWED -- and I generalised it further than the measurement supported.
engine/bohemia_favour.js has carried owedOf(), owedRow() and settle() the whole
time, and it is live on the walked surface: take a favour from an outfit and you
OWE them, they later make a CLAIM on you, and meeting the claim works one
favour off the account. bohemia_claim.js says so in its own comment, citing
Gouldner: "A debt you can never clear is a sentence, not a relationship."

So credit exists in Bohemia. It is social, it is faction-level, and it is paid
in turning up. What does not exist is a debt in a thing you own, to a person.
That is the honest version of the wall four rounds have hit, and it is a
smaller wall than I had been describing.

  FAVOUR_SIZE 1, STANDING_COST 1, TRIGGER_RUNG 3 ("COUNTED").
  Refusing a claim costs you the fall back off the rung PLUS one more rung per
  unpaid favour, and the module's own comment names why: "REFUSING A CREDITOR
  COSTS MORE THAN REFUSING A FRIEND. This is the whole reason the free thing was
  free."

That is a debt trap, correctly built, already shipped, and it is the closest
thing in the game to what the real record says a wrong should feel like.

---------------------------------------------------------------------------
## 2. THE FINDING THAT PROVES US WRONG
---------------------------------------------------------------------------

The row is called [forgiveness price] and it asks what settling a wrong COSTS.
The instinct in that framing, and mine walking in, is that forgiveness has a
price and the price is material: pay the man, square the ledger, move on.

**THE RESEARCH ON WHAT WRONGED PEOPLE ACTUALLY WANT SAYS THE OPPOSITE, AND IT
SAYS IT CONSISTENTLY.**

The restorative justice literature is unusually clear about this, because it has
randomised trials behind it rather than opinion. What victims say they came for
is an explanation, the chance to ask questions, and an apology they believe. In
face-to-face conferences victims report higher satisfaction, are more likely to
get an apology and to rate it as sincere, are less inclined to want revenge, and
show fewer post-traumatic symptoms. Money is not what they came for. Strang and
Sherman's systematic review is the standard cite and the finding survives across
trials.

So a shop that sells forgiveness is the wrong mechanism. That is also the most
common way games do it -- pay off the bounty, the guards forget -- and it is the
weakest version of the mechanic, because it makes being sorry a purchase and
makes a rich player untouchable.

**AND THEN THE OTHER HALF, WHICH IS WHY THIS IS NOT SIMPLY "MAKE IT FREE".**

An apology that costs nothing is not believed, and the reason is a piece of
theory that is easy to state: if saying sorry works, then people who are sorry
say sorry, AND SO DO PEOPLE WHO ARE NOT. The word stops carrying information.
The costly-signalling work on apology finds exactly what you would predict -- an
apology carrying a real cost is rated more sincere, and one carrying none is
read as cheap talk. It holds across the seven countries somebody bothered to
test it in.

**SO THE TWO HALVES RESOLVE, AND THE RESOLUTION IS THE ROUND'S ANSWER:
THE PAYMENT IS NOT WHAT BUYS THE FORGIVENESS. THE PAYMENT IS WHAT MAKES THE
APOLOGY BELIEVABLE. YOU CANNOT PAY INSTEAD OF SHOWING UP. YOU HAVE TO SHOW UP,
AND SHOWING UP HAS TO COST YOU SOMETHING, OR NOBODY BELIEVES YOU.**

Our built mechanism already has the first half exactly right. wouldSquare makes
you go and do something for the person you wronged, in front of them, and then
ask. What it is missing is that the something never costs you anything you own.
A rich player and a broke player pay the identical price for the identical
wrong, and in the real record they never did.

---------------------------------------------------------------------------
## 3. WHAT PEOPLE ACTUALLY PAID, AND THE SHAPE OF THE TARIFF
---------------------------------------------------------------------------

Every society that had no police wrote a price list, and they all look alike.

**ANGLO-SAXON WERGILD AND BOT.** Æthelberht's laws are the earliest English
attempt at a full tariff of injuries, and they are startlingly specific: a set
sum for each tooth, finger, ear, rib, for damaged speech, for a ruined face.
Under Alfred an ear cut off was thirty shillings, a nose sixty, a little finger
nine, a big toe twenty, a thumb twenty. A front tooth was worth more than a back
one. And a man himself had a price by rank: an ordinary freeman two hundred
shillings, a thegn twelve hundred, and a Mercian king seven thousand two
hundred.

  THE SPREAD IS THE PART TO STEAL. Nine shillings for a little finger, seven
  thousand two hundred for a king. EIGHT HUNDRED TIMES.
  OUR SPREAD IS QUIET 8 TO RECKLESS 110. FOURTEEN TIMES.

**DIYA, AND WHO GETS TO CHOOSE.** In Islamic law the compensation for a wilful
killing was agreed by the jurists at one hundred camels, and it is still live
law in Iran, Pakistan, Saudi Arabia and the UAE with an amount updated every
year. What matters for us is not the number, it is that the family of the wronged
person picks one of THREE doors: qisas, equal retaliation; diya, the payment; or
afw, a pardon, given as an act of charity, taking nothing at all.

  OUR MODULE HAS FOUR WORDS AND THEY ARE ALMOST THAT LIST ALREADY: settled,
  paid, forgiven, spared. `paid` is diya, `forgiven` is afw, and `spared` is the
  same choice made by the person who had the upper hand and put it down. The
  fourth door, retaliation, is the one we do not have and probably should not.

**MELANESIAN COMPENSATION, AND WHAT THE PAYMENT IS FOR.** In the Papua New
Guinea highlands compensation is proportionate to the severity of the act and
the magnitude of the dispute, and its function is stated plainly in the
literature: THE PAYMENT SIGNALS THE TERMINATION OF THE DISAGREEMENT. It is a
full stop, not a purchase. Pigs, shells, oils, and everybody watching.

**AND THE FAILURE MODE, WHICH IS THE MOST USEFUL THING IN THIS SECTION.**
PNG's Law Reform Commission had to draft an ANTI-EXCESSIVE-COMPENSATION BILL,
because the payments ran away. Demands for homicide compensation in the
Highlands got so large that payment began to aggravate the dispute rather than
end it, particularly where a big group had to share it out. Bride price in
recent cases has passed K400,000.

  A COMPENSATION ECONOMY HAS A RUNAWAY IN IT. If being wronged pays well enough,
  being wronged becomes a business, and the price of settling becomes the new
  grievance. Whatever we build has to have a ceiling, and history says the
  ceiling has to be imposed from outside, because nobody inside the exchange
  wants one.

**AND WHAT THE TARIFF WAS FOR IN THE FIRST PLACE.** Not to price a life. The
codes say it outright: to stop the feud, to offer a legal remedy instead of
revenge. The number existed so the killing would stop, not so a life could be
bought.

---------------------------------------------------------------------------
## 4. THE LADDER THE ROW ASKED FOR
---------------------------------------------------------------------------

PEOPLE [make it right] should price against this. Five rungs, and only the
first two are cheap to build.

  RUNG 1 -- SHOW UP. Already built and already correct. wouldSquare makes you do
  something for the person you wronged, in front of them, before the offer
  appears. Somebody whose only knowledge of you is the bad thing will not
  forgive you. Keep it exactly as it is.

  RUNG 2 -- THE LADDER HAS TO GET STEEPER AT THE TOP. Measured, our worst deed
  is fourteen small good turns from settled, and five notable ones. Every real
  tariff put hundreds of times between the smallest wrong and the largest. The
  cheapest honest fix is not a new mechanism at all: it is that the top of
  DEED_WEIGHT should be far further from the bottom than 14x. A thing that
  ought to follow you should not be a fortnight of errands.

  RUNG 3 -- THE PAYMENT IS THE PROOF, NOT THE PURCHASE. `paid` is already one of
  the four words and there is nothing under it. Under it should be a real
  handover of a real thing, which is the FIRST time the social economy and the
  battery economy would touch. And the rule that keeps it honest: paying alone
  can NEVER settle it. Payment on top of showing up makes the apology
  believable. Payment instead of showing up is the bounty shop and we should not
  build it.

  RUNG 4 -- WHAT IT COSTS DEPENDS ON WHAT YOU HAVE. Wergild priced by rank
  because a fixed number is not a real cost to a rich man. In our game every
  price is one battery, so a payment fixed at one is nothing to a player with
  forty. This is the one place where EVERYTHING COSTS ONE and realism are
  genuinely in tension, and it is his call, not mine.

  RUNG 5 -- THERE IS A CEILING AND SOMEBODY HAS TO IMPOSE IT. PNG had to
  legislate against its own compensation custom. If being wronged pays, being
  wronged becomes a job. Whatever the number is, it needs a stop on it.

**AND THE THING TO KEEP NO MATTER WHAT, WHICH WE ALREADY HAVE: FORGIVEN IS NOT
FORGOTTEN.** madeRightBy() keeps the deed, its kind, its reason and how it was
settled, forever; only the force goes. That single property is what separates
this from every "pay the fine and the guards forget" system, and it is the thing
the real record agrees with hardest. Nobody forgets. They stop holding it
against you.

---------------------------------------------------------------------------
## 5. ROUTED
---------------------------------------------------------------------------

Nothing here is a job until the coordinator makes it one.

  -> PEOPLE          rung 2, the ladder is flat: reckless is 14 small good turns
                     from settled, and every real tariff was hundreds of times
                     from bottom to top.
  -> PEOPLE          rung 3, `paid` is a word with nothing under it, and the one
                     live caller in the game passes it.
  -> WORLD           the first crossing: if a payment ever settles anything, the
                     purse and the standing web have to touch, and today six
                     social modules contain zero references to money.
  -> LIFE + CITY     the payment is public or it is not a payment. Melanesian
                     compensation is watched by everybody; witness() already
                     works exactly that way.
  -> [PENDING Paolo] (25) WHAT DOES IT TAKE TO BE FORGIVEN, AND CAN IT EVER BE
                     BOUGHT? Three doors exist in the real record and our module
                     already has words for all three.
  -> [PENDING Paolo] (26) DOES A WRONG COST MORE IF YOU HAVE MORE? Wergild
                     priced by rank. EVERYTHING COSTS ONE says it does not.
                     Genuine tension, genuinely his.

  CORRECTION TO MY OWN EARLIER ROUNDS, carried here so nobody inherits it: rounds
  24 and 25 said nobody in this valley can be owed anything. That is true of the
  purse and false of the game. bohemia_favour.js has owedOf and settle, live on
  the walked surface, and bohemia_claim.js collects. Social credit exists. Only
  material credit does not.

---------------------------------------------------------------------------
## 6. WHAT IS NOT HERE, ON PURPOSE
---------------------------------------------------------------------------

No number was set and no table was filled. I did not pick how much steeper the
deed ladder should be, what a payment should be, or where the ceiling goes. I
wrote DEED_WEIGHT locally in a scratch script to measure the shipped mechanism
and nothing was written to the repo; it still ships empty.

I did not add retaliation, which is the fourth real door, because taking
something back by force is a combat and quest question and not this lane's.

And I did not use the "Roman salt" class of story anywhere: every price above is
from a code, a law report or a trial, not a saying.

---------------------------------------------------------------------------
## 7. THE GATE NOTE
---------------------------------------------------------------------------

Every gate in this lane's subset went green, and PEOPLE's own make-it-right gate
is green too, and the round found that the game's one live forgiveness caller
says PAID THEM BACK while nothing is paid.

These gates check that a part does what it says. Nothing checks that two parts
agree, that a part keeps working for as long as the game lasts, that it is the
right part to have, or that the parts form a loop that closes. Rounds 16 through
26, same sentence. A gate asking "does makeRight settle the deed" passes. A gate
asking "does the word on the card describe what happened" does not exist.

---------------------------------------------------------------------------
## 8. SOURCES
---------------------------------------------------------------------------

Wergild, bot, and the Æthelberht and Alfred injury tariffs:
  https://museumfacts.co.uk/history-of-personal-injury-law-anglo-saxon-wergild/
  https://www.medievalists.net/2018/01/anglo-saxon-punishments-price-pinky/
  https://en.wikipedia.org/wiki/Weregild
Diya, qisas and afw, and the modern amounts:
  https://en.wikipedia.org/wiki/Diyah
  https://islamqa.info/en/answers/104855/
Restorative justice: what victims came for, and Strang and Sherman's review:
  https://onlinelibrary.wiley.com/doi/abs/10.4073/csr.2013.12
  https://journals.sagepub.com/doi/10.1177/02697580251314901
  https://journals.sagepub.com/doi/10.1177/02697580221079994
Costly signalling and apology credibility:
  https://www.sciencedirect.com/science/article/abs/pii/S0144818811000883
  https://www.researchgate.net/publication/40825188_Do_sincere_apologies_need_to_be_costly_Test_of_a_costly_signaling_model_of_apology
  https://www.researchgate.net/publication/235935570_Are_costly_apologies_universally_perceived_as_being_sincere
Melanesian compensation, its function, and the anti-excessive-compensation bill:
  http://www.paclii.org/pg/lawreform/PGLawRComm/1981/1.pdf
  https://www.ojp.gov/ncjrs/virtual-library/abstracts/homicide-compensation-papua-new-guinea-problems-and-prospects
Paying off a bounty as the common game answer:
  https://gamerant.com/best-reputation-systems-open-world-games/
  https://giantbomb.com/wiki/Concepts/Reputation
