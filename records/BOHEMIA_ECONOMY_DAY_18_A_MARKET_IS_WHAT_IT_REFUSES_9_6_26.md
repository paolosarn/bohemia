# ECONOMY -- ROUND 18: A MARKET IS WHAT IT REFUSES
# (ECONOMY lane, 9/6/26. MODE: RESEARCH -- nothing here is implemented.)
# Question Q18 [black market], verbatim from VAMILY.md:
#   "How a black market actually organises: who sets the price, where it meets,
#    what it refuses to trade, how it polices itself without courts, and what the
#    best games get wrong about it. Deliver the shape our shops and the block's
#    cut should take."
# Named DAY 18 for the machine. A round is one VAMILY and is never called a day
# to Paolo (NO CALENDAR TALK, 9/5, LOCKED).
#
# ROUND 10 [market day] already covered DENSITY and MARKET DAYS (one market's
# worth of demand spread over fourteen seats, all open every waking hour) and
# ROUND 11 [inflation feeling] already covered WHY THE PRICE CANNOT MOVE (his
# 8/15 ONE beats the scarcity sim, by design, correctly). Neither is reopened.

## 0. THE HEADLINE

I asked the shipped market to refuse me something. It cannot.

> **THE SHELF IS TRIMMED BY TOWN TIER AND THE TILL IGNORES IT COMPLETELY. A CAMP
> THAT SHOWS TWO GOODS SELLS ALL ELEVEN. `buy()` TAKES A MARKET AND NEVER READS
> IT: YOU CAN BUY ANTIBIOTICS STANDING IN THE OPEN DESERT WITH NO MARKET
> ANYWHERE.**

And the deeper one, which is what a black market actually is:

> **THE ONE PLACE IN THE CODE THAT CAN SAY NO TO A TRADE IS UNREACHABLE. Every
> real black market on record is defined by its prohibited list. Ours has none,
> and the refusal branch that exists cannot fire.**

## 1. WHAT I MEASURED ON OUR OWN BUILD FIRST

### 1a. SIXTEEN MARKETS, THREE SHELVES, ONE TILL THAT SELLS EVERYTHING
```
tier        how many   SHELF SHOWS                          TILL SELLS
town           4       3: water, food, meds                     11
fortress       5       4: water, food, meds, fuel               11
camp           5       2: water, food                           11
swapmeet       1       4: water, food, meds, fuel               11
truckstop      1       4: water, food, meds, fuel               11
```

The tier trim is real and it is somebody's careful work: `shelf()` calls
`TOWNS.goodsFor(hub.tier)` so a camp is thinner than a fortress, which is round
10's finding built. Its own comment states the intent exactly:

> *"The shelf and the till both go through here, so a town cannot show a good it
> will not sell."*

**That is true of `price()` and false of `buy()`.** `buy(purse, hubOrNull, goodId,
day, ledger)` accepts the hub and never touches it. It calls `price()` directly
and never calls `shelf()`. So the trim is a picture of a shop.

### 1b. AND THERE DOES NOT HAVE TO BE A SHOP
```
buy(purse, null,             'antibiotics')  ->  applied:true, paid:1
buy(purse, {kind:'nowhere'}, 'meds')         ->  applied:true, paid:1
```
No market, no faction, no distance, no standing, no hour. **A player can buy
antibiotics in the open desert.** Round 10 measured the nearest seat at 7.3 cells
and worried about the walk; the walk is optional.

### 1c. THE ONLY REFUSAL THE CODE OWNS IS DEAD
`payday.price()` has three sources, opened by his own ruling on 8/11 (demo blocker
2 = A, "price off the scarcity sim we already have"):
```
A  'economy'  price off the scarcity sim
B  'ruled'    PURSE.PRICES, his own table
C  'barter'   no prices at all  ->  buy() returns { applied:false, reason:'BARTER_ONLY' }
```
`PRICE_SOURCE` is `'economy'`. But `price()` checks `PURSE.PRICES` **first**, and
on 9/5 that table was filled with all eleven goods to carry his battery ruling. So
the ruled branch always wins and the `'barter'` branch can never be reached.

> **`BARTER_ONLY` IS THE ONE SENTENCE THIS GAME KNOWS FOR "I WILL NOT TAKE YOUR
> MONEY, BRING ME GOODS", AND IT IS UNREACHABLE CODE.** Five previous rounds (2, 9,
> 10, 12, 13) have independently asked for exactly that behaviour without any of
> them noticing it was already written.

That is the fourth never-executed branch this pipe has produced. It is not a bug
anybody introduced; two correct rulings collided and the newer one won by the
order of two `if`s.

### 1d. NOBODY IS EVER REFUSED EITHER
There is no check anywhere in the buy path for who you are: no faction standing,
no rung, no memory, no whether this seat's owner has heard about you. The permit
system shipped 9/6 gates **building** on faction ground. **Nothing gates buying.**

## 2. THE REAL AISLE: HOW A BLACK MARKET ORGANISES

### 2a. WHAT IT REFUSES IS THE MARKET'S IDENTITY
This is the part I did not expect to be so absolute. **Every documented illicit
marketplace publishes a prohibited list and enforces it.**

- Hydra, the largest darknet market ever run, explicitly forbade **guns, poisons,
  contract killing, explosives, government secrets, pornography**, and separately
  banned drugs considered particularly dangerous, **fentanyl and its derivatives**
  among them.
- Vortex bans **fentanyl, weapons, venoms, child sexual abuse material, and the
  sale of any government data.**
- The general pattern across markets is strict prohibited categories with
  otherwise broad availability, and **the rules and their enforcement are fluid
  and time-dependent** -- they change, and everybody watches them change.

These are not moral gestures by criminals. **A prohibited list is risk
management:** the banned things bring heat that would end the market for everyone
on it. A market with no list is not a market, it is an unattended shelf.

### 2b. HOW IT POLICES ITSELF WITHOUT COURTS
Three mechanisms, all of them substitutes for a judge:
- **ESCROW.** The money is held by the house until the goods land, so neither side
  has to trust the other, only the house.
- **A REPUTATION THAT TRAVELS.** Buyer feedback generates vendor scores off
  transaction success and product quality, and vendors **carry their reviews
  between markets** with cryptographic proof, so a name is worth something across
  a boundary. That is round 9's finding in a different century: the punishment is
  being dealt out.
- **A DISPUTE PROCESS.** Formalised workflows, with the house arbitrating. There
  is always a house.

### 2c. WHERE IT MEETS -- AND THE REAL PRODUCT IS NOT GOODS
**Sarajevo, 1992-95.** Markale was the market. Cigarettes were the currency: a
carton went for **100 DM (about $70)**, people were **paid their salaries in
cigarettes** at the start of the siege, and a single smoke was charged out at
**one cigarette per five people**. A pack of cigarettes bought several cans of
humanitarian aid.

And then the sentence that reorganised this whole round:

> **"Markale was a place where Sarajevans mostly sold food, but also coffee or
> cigarettes, and MOST IMPORTANTLY, IT WAS A PLACE TO EXCHANGE INFORMATION,
> BECAUSE THE BLOCKADE OF THE CITY MEANT INFORMATION WAS SCARCE."**

The most important thing on sale at the market was **news**, and it was not for
sale, it was the reason you went.

**And the chokepoint has an owner.** The Tunnel of Hope under the airport was the
city's lifeline and it was also where the war profiteers worked; members of
political, military and paramilitary structures are documented enriching
themselves reselling basic groceries. **Whoever holds the one way in sets what
everything costs, and it is never the shopkeeper.**

## 3. THE GAMES AISLE, IN PLAIN WORDS
(No game he has not named enters the design; these are mechanics as mechanics.)

The criticism players make of black markets in games is remarkably consistent and
it is a single sentence: **it is just a shop with different prices.** Players call
them useless. The named failures are: no risk on the way in, no difference between
one place and another, no consequence for being caught, and no reason to prefer it
except a number.

The named fixes are all about **the approach and the aftermath**, not the shelf:
risk getting there, hidden ways in, people loitering who should not be, security
that reacts, and **markets that shut down for a while when things get hot.**

**We are one step below the shallow version.** Our shops do not even have
different prices (everything costs one, correctly), so with nothing refused and
nowhere you have to be, a Bohemia market is a vending machine that follows you
around.

## 4. *** THE FINDING THAT PROVES US WRONG ***

I came into this round expecting to design a second, shadier shop: a black market
beside the ordinary one. That is the shallow version the games aisle names, and
the real record says something else entirely.

> **A MARKET IS NOT A PLACE THAT SELLS THINGS. IT IS THE ONE PLACE THAT KNOWS
> THINGS, RUN BY SOMEBODY WHO DECIDES WHAT WILL NOT BE SOLD.**

Two halves, and we have neither.

**THE REFUSAL.** Every real illicit market is defined by its prohibited list, and
ours refuses nothing, to nobody, anywhere, with the one refusal it owns sitting in
unreachable code. **What our markets need is not another shop. It is the word no.**

**THE NEWS, AND THIS IS THE UNCOMFORTABLE HALF.** Sarajevo says the market's most
important product was information because information was scarce. Our valley has a
feed: `bohemia_feedstream.js` and the phone on the CITY screen, shipped 9/5 off
his own 9/4 law, carrying the deed ledger, faction and territory events and
ambient life. It is good work and it is the right stream.

**And it is free of place.** I checked: nothing in the feed stream reads where the
player is standing, which market he is at, or how far he has walked. The news
arrives wherever he is.

> **IN A SIEGE, GOING TO THE MARKET IS HOW YOU FIND OUT WHAT HAPPENED. IN BOHEMIA
> THE NEWS COMES TO YOU AND THE MARKET SELLS GROCERIES. WE HAVE THE TWO HALVES OF
> MARKALE AND THEY ARE FACING AWAY FROM EACH OTHER.**

That is not a criticism of the feed, which was built to a law that says it scrolls
on the city screen. It is an observation that the single strongest reason to walk
to a market already exists in this build and is currently attached to nothing.

## 5. THE SHAPE, DELIVERED

What our shops and the block's cut should be. Mechanism only; every list, price
and name stays his.

### THE SHOPS

**1. THE TILL OBEYS THE SHELF.** `buy()` takes the hub and must read it. A camp
that shows two goods sells two goods. This is not a new feature, it is the
existing feature working: the tier trim, `goodsFor`, and the comment that already
says it should be true.

**2. EVERY SEAT HAS A LIST OF WHAT IT WILL NOT TOUCH, AND THE LISTS DIFFER.** This
is the whole finding and it costs no arithmetic: no price changes, nothing is
dearer, a good is simply not for sale here. The Anarchists will not trade one
thing; the Mob will not trade another. **A player learns the valley's factions by
what each of them refuses**, which is character and geography at the same time,
and it is the cheapest characterisation in the whole game. The lists are contents
and contents are his.

**3. THE MARKET IS WHERE YOU FIND OUT.** Attach the feed to the place. Standing in
a seat is how you hear what the valley did; walking home is how it goes stale.
Everything needed exists: one stream, sixteen seats, a phone, and a measured
distance from every one of them.

**4. THE REFUSAL WE ALREADY OWN.** `BARTER_ONLY` is written, tested and
unreachable. It is the exact sentence five rounds have voted for. It needs a
reachable path, not an invention.

### THE BLOCK'S CUT

**5. WHOEVER HOLDS THE WAY IN SETS WHAT EVERYTHING COSTS.** The Tunnel of Hope,
not the shopkeeper. Round 14 put the cut on the block and round 16 warned that a
faction that pays you, charges you and is the only one who takes what it paid you
in is a company store. **This is the third leg of the same shape, and it is the
one that decides whether the other two are tyranny or a world:** if the seat that
holds your block refuses you, there has to be another seat that does not.

**6. SO THE CUT'S REAL PRICE IS ACCESS, NOT MONEY.** Round 14 could not find what
a block subscription BUYS, because his law forbids it buying electricity. **This
round has the answer and it needs no new system:** it buys you the right to trade
at that faction's seat. Stop paying and the shelf gets shorter, not the lights
dimmer. That is exactly what a real block owner sells, it is a refusal rather than
a number, and everything costs one is untouched.

## 6. REFUSED

- **A SECOND, SHADIER SHOP.** The games aisle's named failure and section 4's
  finding. One market that can refuse is worth more than two that cannot.
- **DIFFERENT PRICES FOR CONTRABAND.** EVERYTHING COSTS ONE is LOCKED. Every
  mechanism above works at one.
- **CONTRABAND AS A CATEGORY OF GOOD.** What is refused is per seat and per
  faction, not a property of the object. The same water is fine here and refused
  there, which is what makes it geography.
- **INVENTING WHAT ANY FACTION REFUSES.** Contents are his, and this is one of the
  most characterful decisions in the game. Section 5 is the mechanism.
- **CRIME, HEAT, WANTED LEVELS OR SECURITY SCANS.** The games aisle likes them and
  they are a different genre. Our version of getting caught already exists and is
  better: round 9's doors that stop opening.
- **REOPENING PRICE_SOURCE.** He ruled it 8/11. Section 1c reports a collision, not
  a proposal.
- **ANY IMPLEMENTATION.** MODE: RESEARCH.

## 7. ROUTED

**TO WORLD, on the market pipe:**
1. **`buy()` IGNORES THE HUB ENTIRELY.** Sixteen markets, three shelf sizes, and
   the till sells all eleven goods at every one of them and with no market at all.
   The comment above `goodsFor` already says the intended behaviour.
2. **`BARTER_ONLY` IS UNREACHABLE** because `PURSE.PRICES` is checked before
   `PRICE_SOURCE`. Two of his rulings collided and the order of two `if`s decided
   it. Fourth never-executed branch in this pipe.

**TO FACTIONS:**
3. **A SEAT SHOULD HAVE A LIST OF WHAT IT WILL NOT TRADE.** The cheapest
   characterisation available: no price moves, nothing is dearer, a good is simply
   not sold here. Fourteen factions, fourteen refusals.
4. **[block rent]'s MISSING PRODUCT IS ACCESS.** Round 14 asked what a
   subscription buys when it cannot buy electricity. It buys the right to trade at
   that faction's seat. Stop paying and the shelf gets shorter.

**TO UI and LIFE + CITY, on the feed:**
5. **THE FEED IS FREE OF PLACE AND THE MARKET IS THE REASON TO WALK.** Markale's
   most important product was news. One stream, sixteen seats, a phone, and every
   distance already measured. Nothing new is needed but a where.

**TO THE COORDINATOR, for Paolo:**
6. **[PENDING Paolo]** What will each faction not trade? Fourteen answers, one
   short phrase each, and they will do more to make the valley feel like fourteen
   different peoples than any amount of colour. (This is the same shape as the
   five-round trader-refusal pending, which section 1c now shows is already half
   built.)

## 8. TEST MATERIAL
`banks/BOHEMIA_ECONOMY_TEST_LINES_9_5_26.md`, sections LLLL through PPPP. Every
line `draft:true`, in the bank, never in the game.

## 9. SOURCES

REAL AISLE
- Darknet market prohibited lists and enforcement: Hydra forbidding guns, poisons,
  contract killing, explosives, government secrets, pornography and fentanyl
  derivatives; Vortex banning fentanyl, weapons, venoms, CSAM and government data;
  rules fluid and time-dependent --
  onlinelibrary.wiley.com/doi/10.1111/1745-9133.12647 ;
  socradar.io/blog/dark-web-market-vortex-market/ ;
  aic.gov.au/sites/default/files/2021-03/ti622_illicit_firearms_and_other_weapons_on_darknet_markets.pdf
- Trust without courts: escrow, feedback-driven vendor reputation, reviews carried
  between markets with cryptographic proof, formal dispute workflows --
  chainalysis.com/glossary/darknet-markets/ ; grokipedia.com/page/Darknet_market
- Sarajevo 1992-95: Markale as the place to exchange information because
  information was scarce; cigarettes as currency at ~100 DM (~$70) a carton,
  salaries paid in cigarettes, one cigarette per five people for a single smoke;
  the Tunnel of Hope as the chokepoint worked by war profiteers from political,
  military and paramilitary structures --
  famacollection.org/sarajevo-eng/ktmsa-4-12 ;
  famacollection.org/sarajevo-eng/ktmsa-4-13 ;
  sarajevotimes.com/the-cost-of-groceries-in-occupied-sarajevo-and-profiting-from-peoples-suffering-2/ ;
  academia.edu/36705129

GAMES AISLE (mechanics only; no game he has not named enters the design)
- The consistent player criticism that a black market is just a shop with
  different prices, and that the fixes are the approach and the aftermath rather
  than the shelf -- giantbomb.com/wiki/Concepts/Black_Market ;
  forums.frontier.co.uk/threads/the-black-market-why-is-it-so-useless.367595/ ;
  forums.frontier.co.uk/threads/thoughts-please-on-my-black-market-idea.636742/

OUR OWN REPO (every figure measured this round)
- engine/bohemia_payday.js (hubs, shelf, goodsFor, price, PRICE_SOURCE, and buy()
  ignoring its hub), engine/bohemia_purse.js (PRICES winning first),
  engine/bohemia_towns.js, engine/bohemia_overmap.js,
  engine/bohemia_feedstream.js (no reader of place anywhere in it)
- records/BOHEMIA_ECONOMY_DAY_10 (density and market days, not reopened) and
  DAY_11 (why the price cannot move, not reopened), DAY_14 (the block's cut),
  DAY_16 (the company store warning this round's section 5 answers)
- laws/BOHEMIA_ADDENDUM_THE_FEED_ON_THE_CITY_SCREEN_9_4_26.md

## 10. GATE STATE THIS ROUND

Green, run this round: economy 13/0, payday 38/0, purse 28/0, attempt 15/0,
canon rot 13/0, demo blockers 22/0, language 81/0.

**`payday_gate` is 38 for 38** and its summary line is exactly right: *"hubs read
from the overmap, a day of work pays one battery and a bag of rice costs one."*
Every assertion is true. It proves the shelf reads the world and the till charges
his ONE.

**Nothing in it asks whether the till and the shelf agree**, which is the third
round running where the green suite and the finding are both correct at once
(round 16: `lights_bill_gate` 30/0 while not paying was the optimal play; round
17: `quest_study_gate` 456/0 over 27 quests that pay nothing). The pattern is
consistent enough now to name: **these gates check that a part does what it says.
Nothing checks that two parts say the same thing.** All three findings this lane
has produced in a row lived in exactly that gap.

Not this lane's to fix, and not a criticism of any gate.
