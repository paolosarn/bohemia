# ECONOMY -- ROUND 19: THE WORLD STOPS TALKING ON DAY SIXTY-SEVEN
# (ECONOMY lane, 9/6/26. MODE: RESEARCH -- nothing here is implemented.)
# Question Q19 [price moves], verbatim from VAMILY.md:
#   "What makes a price move in a place with no market data: how prices actually
#    get set and re-set in informal economies (who quotes first, how far a price
#    can move before it is an insult, what makes a seller refuse), and what the
#    best games do to make a changing price feel like the world talking. Deliver
#    the rule our shops should use."
# Named DAY 19 for the machine. A round is one VAMILY and is never called a day
# to Paolo (NO CALENDAR TALK, 9/5, LOCKED).
#
# ROUND 11 [inflation feeling] already established that OUR PRICE CANNOT MOVE
# (his 8/15 ONE beats the scarcity sim, correctly) and ROUND 18 [black market]
# already established that what moves instead is WHETHER IT IS SOLD AT ALL.
# Neither is reopened. This round answers the part they left: what the RULE is.

## 0. THE HEADLINE

The price cannot move, so I went looking for what does. **Something already does,
and it is already on his screen, in words.** The shop card renders it:

> *"8.6 days of it left in the valley"*

That line is the world talking, it was built, it is live, and I measured how long
it keeps talking.

> **IT STOPS ON DAY SIXTY-SEVEN. Food runs out on day 11, water on day 53, and
> after day 67 no number on any shelf in the valley ever changes again.** Measured
> at four populations from 100 to 1,200: identical, because the ledger scales
> stocks with houses.

In a game that is three generations and about a hundred hours, **the world has
sixty-seven days of things to say and then goes quiet forever.**

## 1. WHAT I MEASURED ON OUR OWN BUILD FIRST

### 1a. THE TAG IS FROZEN AND THAT IS RIGHT
Running the shipped sim day by day, asking it and the shop the same question:
```
day | what the SIM computes for food | what the TAG says | "days of it left"
  0 |            5.24                |   1 electricity   |       8.60
  5 |           10.05                |   1 electricity   |       4.50
 10 |           60.00                |   1 electricity   |       0.40
 15 |           60.00                |   1 electricity   |       0.00
 60 |           60.00                |   1 electricity   |       0.00
```
Round 11 found this and it is not reopened: **EVERYTHING COSTS ONE beats the sim,
by design, correctly.** The eleven-fold move the sim computes cannot reach the
shop and should not.

### 1b. BUT THE THIRD COLUMN MOVES, AND IT IS ALREADY ON SCREEN
`mktShelf()` builds every row with `daysLeft` off the sim's own `daysLeft()`, and
the card renders it as a sentence:
```js
'<div class="mnote">' + esc(r.daysLeft == null ? String(r.note || '')
    : (r.daysLeft + ' days of it left in the valley')) + '</div>'
```
**Nobody has to invent the world talking. It is talking.** Round 5's finding was
that the shop card had fifteen numbers on it; this is the one number on it that is
doing the job.

### 1c. AND IT STOPS
```
pop  | day water hits 0 | day food hits 0 | last day ANY shelf number changed
 100 |       53         |       11        |              67
 300 |       53         |       11        |              67
 600 |       53         |       11        |              67
1200 |       53         |       11        |              67
```
Identical at every population, because the ledger scales stocks with houses, so
the ratio is fixed. **After day 67 every shelf in the valley reads the same thing
forever.**

Round 1 measured the valley eating its last shelves in ten in-game days and asked
whether that was premise or bug; the coordinator ruled it **premise** on 9/5 and
asked for it to be made visible. This is the other end of that ruling: the premise
is right, and the sentence that expresses it runs out of things to say two months
in.

## 2. THE REAL AISLE: WHAT ACTUALLY MOVES WHEN THERE IS NO MARKET DATA

### 2a. THE SCARCE THING IS NOT THE GOOD, IT IS KNOWING
Clifford Geertz studied exactly the case the row describes -- a market with no
published prices, no bookkeeping, no data -- and his conclusion is the whole round:

> **"In the bazaar, information is poor, scarce, maldistributed, inefficiently
> communicated, and intensely valued."**

And therefore: haggling is not a fight over a number. **It is "a means of
communicating economic information in an indeterminate pricing situation."**
Continual haggling partly reflects the absence of bookkeeping that would let
anybody calculate what a reasonable price even is. **You are not negotiating. You
are finding out.**

### 2b. AND WHAT PEOPLE ACTUALLY SETTLE ON IS A PERSON
Geertz's second term is the one that matters more, and it is the answer to "how
does a price get RE-set":

> **CLIENTELIZATION.** Buyers form persistent personal relationships with
> particular sellers rather than shopping around. With bad information, **a limited
> number of trading partners is more profitable than a series of impersonal
> transactions.** The relationship transcends the single deal and is what makes a
> fair price possible at all.

The bazaar's answer to not knowing what things are worth is not a better search.
**It is a regular guy.**

### 2c. THE NUMBERS OF HAGGLING, WHICH ARE REMARKABLY CONSISTENT
- **The final price lands between one third and two thirds of the first ask.** A
  buyer's counteroffer conventionally opens around **40-50% of asking.**
- **Three to five exchanges** is a good haggle. Fewer is rude; many more is a
  different kind of conversation.
- **The gasp of insult is theatre and everybody knows it.** Acting horrified at a
  lowball is an expected move in the dance, not a refusal.
- **The walk-away is the strongest tool there is.** Setting the item down and
  saying you will think about it, and a significant share of the time the seller
  calls you back before you are out of the doorway.

## 3. THE GAMES AISLE, IN PLAIN WORDS
(No game he has not named enters the design; these are mechanics as mechanics.)

I went looking for how games show the world changing **without** moving a number,
and the striking thing is how little there is.

- The design literature on shops is almost entirely about **price as the signal**:
  supply low and demand high, so the number goes up, which tells the player to
  produce more. Scarcity is managed by controlling supply, and communicated by the
  price.
- Non-price signalling of scarcity -- an emptier shelf, a shorter list, a seller
  who has run out -- is barely discussed at all.

**That is not a gap we have to worry about. It is an advantage.** Our locked ONE
forces us out of the move-the-number answer and into the one the real bazaar
actually uses, which almost nobody has built.

## 4. *** THE FINDING THAT PROVES US WRONG ***

The row asks what makes a price move. I spent the first half of this round looking
for the trigger.

> **IN A PLACE WITH NO MARKET DATA, HAGGLING IS NOT ABOUT THE PRICE. IT IS HOW
> INFORMATION MOVES. AND WHAT PEOPLE ACTUALLY SETTLE ON IS NOT A NUMBER, IT IS A
> SELLER THEY KEEP GOING BACK TO.**

Which means the rule our shops need is not a price rule, and three rounds in a row
have now arrived at the same place from different doors:

```
ROUND  9   a debt is a person who remembers, and the punishment is being dealt out
ROUND 18   the market's most important product was NEWS, not goods (Markale)
ROUND 19   the bazaar's answer to not knowing what things are worth is a regular guy
```

**THE ECONOMY OF BOHEMIA IS MADE OF PEOPLE YOU KEEP GOING BACK TO.** Not of
prices, which are locked at one and should stay there. Every one of those three
rounds found the mechanism already half-built and pointed at nothing: `whoHears`,
`memory` and `commitment` are live (round 9), the feed is live and free of place
(round 18), and the shelf's talking line is live and stops on day 67 (this round).

## 5. THE RULE, DELIVERED

What our shops should use. Mechanism only; every number and name stays his.

**THE RULE, IN ONE SENTENCE:**
> **THE PRICE IS ALWAYS ONE. WHAT MOVES IS WHAT YOU KNOW, AND WHAT YOU KNOW COMES
> FROM WHO YOU KEEP GOING BACK TO.**

Four parts, each already half-built:

**1. THE SHELF KEEPS TALKING.** The line exists and says a true thing for 67 days.
After the stocks are gone it has nothing left, because it can only report a number
that has bottomed out. What it needs is not a new sentence but a second thing to
say: not only how much is left, but **what changed since you were last here.** The
walked surface already computes exactly that and calls it `tonight` -- "what ran
out TONIGHT is the beat, and it is the difference between a thing that happened and
a thing that is simply true now" -- and that is the right instinct, already
written, in the same file.

**2. THE SELLER REMEMBERS YOU, AND THAT IS THE WHOLE PROGRESSION.** Clientelization
with no new system: `memory` already decays slower for somebody familiar (round 9
measured it live). A seller you have dealt with ten times tells you things. A
stranger quotes you the shelf and nothing else. **This is the reward ladder our
shops are missing, and it never touches a price.**

**3. THE HAGGLE IS THREE TO FIVE BEATS AND IT IS ABOUT ACCESS, NOT MONEY.** The
real dance is 3-5 exchanges, an opening around 40-50%, theatrical outrage, and a
walk-away that gets called back. **Everything in that structure survives a fixed
price except the number.** So the exchanges buy what round 18 said actually moves:
whether he sells to you at all, and what he tells you while deciding. Three to five
beats is 120 BPM friendly by construction.

**4. THE WALK-AWAY IS THE PLAYER'S STRONGEST MOVE AND WE SHOULD LET HIM MAKE IT.**
It is the most reliable tool in a real souk and it costs us nothing: turning to
leave is already a thing a player does. The seller calling him back is one line.

## 6. REFUSED

- **MOVING THE PRICE.** EVERYTHING COSTS ONE (8/15) is LOCKED and round 11 already
  settled that it is right. Nothing above moves a price by any amount, ever.
- **A HAGGLE THAT CHANGES THE NUMBER.** The obvious build of section 5.3 and the
  banned one. The exchanges buy access and information, never a discount.
- **A REPUTATION SCORE OR A TRUST METER.** Round 5 and round 9 both settled it; the
  standing systems say this in stages and words.
- **TURNING ON THE SCARCITY SIM'S PRICES.** He ruled the source on 8/11 and round
  11 measured the collision. This round reports what the sim's OTHER output is
  good for, and does not touch the valve.
- **A SECOND NUMBER ON THE SHOP CARD.** Round 5 counted fifteen numbers on it
  already. Section 5.1 asks for a different sentence, not another figure.
- **ANY IMPLEMENTATION.** MODE: RESEARCH.

## 7. ROUTED

**TO WORLD, on the shelf line:**
1. **THE ONLY MOVING NUMBER IN THE GAME STOPS ON DAY 67**, at every population
   from 100 to 1,200. Food goes on day 11, water on day 53, and after that every
   shelf in the valley reads the same forever. The coordinator ruled the emptying
   is the PREMISE (9/5); this is the sentence that expresses it running dry.
2. **THE SECOND SENTENCE IS ALREADY WRITTEN AND CALLED `tonight`.** The walked
   surface already separates "what ran out tonight" from "what is simply true now"
   and holds it on the ledger so a reload cannot replay the moment. It is the right
   instinct and it is not on the shelf row.

**TO PEOPLE, and it is the biggest one:**
3. **A SELLER SHOULD REMEMBER YOU, AND THAT IS THE SHOP'S PROGRESSION.**
   Clientelization is the bazaar's real answer to having no prices, `memory`
   already decays slower for the familiar, and nothing in the buy path reads it.
   Three rounds (9, 18, 19) have now independently landed on the same sentence:
   **the economy here is made of people you keep going back to.**

**TO QUESTS (PARKED) / whoever holds BB-ASK-FOR-MORE [haggling works]:**
4. **THE HAGGLE IS 3 TO 5 BEATS AND IT BUYS ACCESS, NOT A DISCOUNT.** The real
   structure survives a fixed price intact: an opening, three to five exchanges,
   theatrical outrage, and a walk-away that gets called back. The only part that
   cannot come is the number.

**TO THE COORDINATOR, for Paolo:**
5. **[PENDING Paolo]** After the valley's shelves are empty, what does a shop say?
   The line "8.6 days of it left" is his sentence and it is a good one; on day 68
   it has nothing to report. What a seller says when there is nothing left to count
   is words, and words are his.

## 8. TEST MATERIAL
`banks/BOHEMIA_ECONOMY_TEST_LINES_9_5_26.md`, sections QQQQ through UUUU. Every
line `draft:true`, in the bank, never in the game.

## 9. SOURCES

REAL AISLE
- Clifford Geertz, "The Bazaar Economy: Information and Search in Peasant
  Marketing" (1978): information poor, scarce, maldistributed and intensely
  valued; haggling as a means of communicating economic information in an
  indeterminate pricing situation; clientelization as the efficient response to
  bad information --
  tompepinsky.com/2016/09/20/transactions-costs-in-strange-places-geertz-on-the-bazaar-economy-of-modjokuto/ ;
  haubooks.org/suq-geertz-on-the-market/ ;
  academia.edu/1191133/The_bazaar_economy_or_how_bizarre_is_the_bazaar_really ;
  nber.org/system/files/working_papers/w15420/w15420.pdf
- Bargaining norms: final price between one third and two thirds of the first ask,
  counteroffers opening around 40-50%, three to five exchanges, theatrical
  outrage, and the walk-away as the most reliable tool --
  greca.co/en/blog/2020/1/13/tips-for-haggling-in-the-great-turkish-bazar ;
  myturkeyadventure.com/blog/istanbul-grand-bazaar-2026-survival-guide-haggling-real-prices ;
  moroccantraveltrips.com/moroccan-souks-how-to-haggle-like-a-local-without-being-rude/ ;
  gadventures.com/blog/haggling-morocco-101-souk-shopping/

GAMES AISLE (mechanics only; no game he has not named enters the design)
- Supply and demand as a price signal, and how little the literature says about
  non-price ways of showing scarcity --
  machinations.io/glossary/supply-and-demand ;
  gamedev.net/forums/topic/612716-market-supply-and-demand/ ;
  tandfonline.com/doi/full/10.1080/10253866.2024.2385562

OUR OWN REPO (every figure measured this round)
- engine/bohemia_economy.js (makeLedger, advanceDay, price, daysLeft,
  scarcityMult), engine/bohemia_payday.js (price, shelf),
  engine/bohemia_purse.js (PRICES winning first)
- slices/BOHEMIA_CITY_WORLD.html: mktShelf() carrying daysLeft, the card rendering
  "N days of it left in the valley", and the `tonight` computation that already
  separates what happened from what is true
- records/BOHEMIA_ECONOMY_DAY_1 (the valley running out, ruled PREMISE 9/5),
  DAY_5 (fifteen numbers on the shop card), DAY_9 (a debt is a person who
  remembers), DAY_11 (the price cannot move and that is right), DAY_18 (the
  market's real product is news) -- none reopened

## 10. GATE STATE THIS ROUND

Green, run this round: economy 13/0, payday 38/0, purse 28/0, attempt 15/0,
canon rot 13/0, demo blockers 22/0, language 81/0.

`economy_gate` is 13 for 13 over the module whose only visible output stops moving
on day 67. Every assertion in it is true: it checks conservation, that stock delta
equals produced minus consumed, that nothing goes negative and nothing appears.
**Nothing asks how long the thing keeps having something to say**, because that is
a question about the shape of a hundred-hour game rather than about a day's
arithmetic.

That is the fourth round running where a green suite and a real finding are both
correct at once (round 16 `lights_bill_gate` 30/0, round 17 `quest_study_gate`
456/0, round 18 `payday_gate` 38/0). The pattern named in round 18 holds: **these
gates check that a part does what it says; nothing checks that a part keeps doing
it for as long as the game lasts.**

Not this lane's to fix, and not a criticism of any gate.
