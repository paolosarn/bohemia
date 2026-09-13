# DAY 38 — ONE IS THE OLD PRICE, AND THE DOOR IS A PERSON.

ECONOMY lane, VAMILY row `[old price]` Q38. MODE: RESEARCH — DO NOT IMPLEMENT.
Round 38. Claimed 9/13/26 `economy-vamily-knxaeh`, commit f5fc3a0.

> **THE ROW, VERBATIM:** "How buying at the old price actually worked at street level:
> Venezuela's CADIVI dollars and Mercal shelves, Argentina's blue dollar, Lebanon's
> Sayrafa rate and the importers who bought at an 88% discount, Zimbabwe fuel coupons.
> Who got the door, what it looked like to a person on the street (the queue, the second
> shop, the guy outside), how it was policed and how it leaked. Deliver: what a PLAYER
> would have to hold or be to buy at the old price in the valley, in one paragraph WORLD
> can build after [two prices]. Realism first; no game he has not named."

---

## 0. THE TWO FINDINGS THAT PROVE US WRONG

### ONE. THE ROW SAYS "HOLD OR BE". THE RECORD SAYS **BE**, FOUR TIMES OUT OF FIVE.

The instinct — and the row's own first word — is **hold**: a permit, a coupon, a card, an
item in a bag. Of the five real doors below, exactly one was an object you could hold,
and it was the leakiest of the lot. The other four were a **person**:

- an official who approved your quota,
- **a guard at the warehouse door who sold you the pallet at thirty percent off,**
- a customs relationship that made you a registered importer,
- a cueva owner who would not let you in without a referral.

### TWO. *** OUR GAME ALREADY HAS THE OLD PRICE AND CALLS IT THE ONLY PRICE. ***

Every real spread in section 2 runs between **1.7x and 13.3x**. Run any of them against
`EVERYTHING COSTS ONE` (8/15) and watch what happens:

    Venezuela CADIVI   4.6x   -> one battery becomes 0.22 batteries
    Lebanon importer   5.1x   -> one battery becomes 0.19 batteries
    Lebanon official  13.3x   -> one battery becomes 0.08 batteries
    Zimbabwe coupon    1.7x   -> one battery becomes 0.59 batteries
    bachaquero buy-in  2.6x   -> one battery becomes 0.39 batteries

**Not one of those is a number this game can say.** A battery is an object; there is no
half of one. So the old-price door cannot be a discount, and the whole round would dead-
end here — except that the ratio only breaks in one direction.

**Turn it over. ONE is not the normal price with a discount hanging off it. ONE IS THE
INSIDER PRICE, and everybody who is not inside pays the street.** Venezuela's controlled
6.5 was not a discount on 30; it was the official price, and 30 was what it cost if you
were nobody. Our one battery is the same object: **the price if you are somebody here.**

That lands exactly on top of round 36's finding, from the other end. Round 36 measured
that `EVERYTHING COSTS ONE` is a **price control**. A price control always has a door,
and the door is always the whole story. So the two rounds together say: **the one is the
controlled price, the door is who gets it, and the street is what it costs everybody
else.** No new law, no fraction, nothing of his moved.

---

## 1. WHAT WE HAVE TODAY (measured before researching)

### THE DOOR ALREADY EXISTS, AND IT IS THE SHELF, NOT THE PRICE

`goodsFor(tier, goods)` cuts the shelf by the town's tier off `DEPTH`
(fortress 1, town 0.667, camp 0.333). Measured on the real table:

| town | sells | what is missing |
|---|---|---|
| fortress | **11 of 11** | nothing |
| town | **8 of 11** | lidocaine, tweezers, antibiotics |
| camp | **4 of 11** | fuel, power, iodine, sterile water, lidocaine, tweezers, **antibiotics** |

**A camp does not charge you more for antibiotics. It does not have any.** Seven of
eleven goods are *absent*, not dearer — which is precisely how a shortage economy feels
from the outside, and it shipped on 9/5 without anybody calling it a door.

(Probe note: my first call was `goodsFor(goods, tier)`, which sliced the string
`'fortress'` and reported three goods called `"for"`, `"to"` and `"ca"`. The signature is
`(tier, goods)`. Kept, because a later round will reach for this function.)

### WHAT THE PLAYER CAN ALREADY **BE**

`engine/bohemia_belonging.js` carries a five-rung ladder, per faction:

    0  stranger    at 0    "A STRANGER"           They have no reason to think about you.
    1  peripheral  at 1    "SOMEBODY WHO SHOWED UP"  You did the thing once.
    2  useful      at 3    "USEFUL"               Three times is a pattern.
    3  counted     at 6    "COUNTED"              You are on whatever list they keep.
    4  inside      at 10   "INSIDE"               The newcomer is the old-timer now.

And **each faction wants a different thing and pays a different thing**. Sixteen rows;
these five are the ones this round needs:

| faction | wants | who moves first | pays |
|---|---|---|---|
| MOB | legibility | you give first | **enforcement of a deal** |
| REDS | debt | you give first | **credit** |
| CARTEL | debt | **they** give first | **whatever you needed that week** |
| NETWORK | legibility | **they** give first | the feed, the repeaters, the lit grid |
| KARENS | legibility | you give first | fresh food, and **membership itself** |

`COUNTED` is *"on whatever list they keep"*, and its own note says **"That is a different
thing from being liked."** That sentence is a CADIVI registry written by somebody who had
never heard of CADIVI. The door this round is looking for is already in the file.

`bohemia_standing.js` carries the other half: RUNGS `HOSTILE -3, COLD -1, NEUTRAL 1, WARM
3, FWU`, a sight range of 9, hearsay at 0.55 over 2 hops, and a 45-minute gossip window.
**The valley already knows who you are to somebody.**

### AND WHAT IS NOT WIRED

`buy(purse, hubOrNull, goodId, day, ledger)` **takes a hub and never reads it for
price** — `price(purse, ledger, goodId)` has no hub argument at all. Round 34 measured
this; it is unchanged. Nothing anywhere reads a belonging rung or a standing to change
what a shop does. The shelf varies by tier and by nothing else about **you**.

---

## 2. THE REAL AISLE: FIVE DOORS

### VENEZUELA, CADIVI — THE DOOR WAS BEING A PERSON WHO COULD TRAVEL

From 2003 the state sold dollars at an overvalued official rate, but only to a select
few, rationed per person: **$2,500 a year on a credit card, $500 in cash, $400 for online
purchases.** Official **6.5 bolívars** to the dollar against a black market near **30**.

The street name for working it was **the raspao, "the scrape"**: get your allocation on
the card, **fly out of the country**, take a cash advance abroad, carry the cash home and
sell it black. **The door was your identity, and the price of using it was a plane
ticket.** It leaked through falsified documents and fictitious businesses given quotas.

### VENEZUELA, THE SHELVES — THE DOOR WAS THE GUARD, AND HE TOOK THIRTY PERCENT

This is the best material in the round.

Price-controlled staples, **fifteen-plus hours of queueing**, and an entire profession
grew in the gap: **bachaqueros**, who queued not for what they needed but for anything at
all, to resell on the street. At least **seven percent of the population — about two
million people — lived on it.**

And they mostly did not queue:

> **The few goods that arrive are sold to the bachaqueros by the guards at a 30%
> discount, and resold at more than 80% markup.** Bachaqueros give money to the
> policemen so they can go unnoticed.

Margins: **1,000 in, up to 8,000 out.** A bag of sugar at **up to forty times** the
official price.

The state's answer was to make the door harder to use rather than to open it: **20,000
fingerprint readers** in supermarkets in 2015, capping what one person could buy a week,
concentrated along the Colombian border. **Nothing about that changed the price. It only
changed who could stand at the counter.**

### LEBANON — THE DOOR WAS BEING A REGISTERED TRADE

The central bank subsidised imports of wheat, fuel and medicine at a special rate —
**3,900 LBP to the dollar** — against a pegged official **1,507** and a black market
around **20,000**. The subsidy went **to traders**, so the door was a licence to import.

It leaked over the Syrian border, immediately and enormously: traders bought subsidised
fuel, flour and medicine inside Lebanon and sold at world prices outside. **Subsidised
medicine vanished from Lebanese shelves and reappeared as smuggling revenue.** The
supply, not the price, is what moved.

### ARGENTINA — THE DOOR WAS A REFERRAL

The blue dollar has a whole street apparatus. **Arbolitos, "little trees"**, stand on
Calle Florida calling *cambio, cambio, cambio*, and they are not the exchange — they walk
you to a **cueva**, a back office out of public view.

The rule everyone who uses them repeats: **never walk into one blindly.** You go on a
trusted introduction — hotel staff, a long-term resident — because **reputation and word
of mouth are the whole security model.** What the door costs you if you get it wrong is
counterfeit notes, or the man outside being told you are leaving with cash.

(Worth stating because it is the honest end of the story: under Milei the blue spread
collapsed to about **2-5%**, so this particular door barely pays now. A door is only a
door while the gap is wide.)

### ZIMBABWE — THE ONLY DOOR YOU COULD HOLD, AND IT TURNED INTO MONEY

Fuel coupons: **the Reserve Bank's logo, a serial number, a field for your car's
registration, petrol or diesel**, redeemable at **90-plus stations**. Two prices at the
pump on the same day: **US$20 per 20 L of diesel on a coupon against US$34 in cash**;
petrol **US$18 against US$30.** About **1.7x**, the smallest gap in this round.

And then the thing that matters most to us:

> **Schools, colleges and private businesses started accepting fuel coupons to settle
> bills, at 1 litre of petrol = US$1.00.**

**The coupon stopped being about fuel and became money.** That is a warning aimed
straight at Bohemia, because our money is already a physical object. A second
transferable object that buys more than the first does not create arbitrage — **it
becomes the currency**, and money that buys more always wins. If the old-price door in
this valley is ever a thing you can hand to somebody, batteries are finished.

It also leaked the ordinary way: **attendants were attacked by motorists who accused them
of taking bribes to let people jump the line**, and government coupon abuse was
documented outright.

### THE PATTERN

| case | the door | what you had to be | how it leaked |
|---|---|---|---|
| CADIVI | a yearly quota | a citizen who could fly | forged papers, ghost firms |
| the shelves | the man at the door | early, or his friend | **he sold it at 30% off** |
| Lebanon | an import licence | a trade | the Syrian border |
| Argentina | a referral | vouched for | counterfeit, and the robbery |
| Zimbabwe | **a coupon** | **holding it** | **it became money** |

**Four of five doors were people. The fifth ate the currency.**

---

## 3. THE GAMES AISLE

Nothing here. The row asks for real material only and says so — *"Realism first; no game
he has not named"* — and after section 2 there is nothing a reference could add that the
guard at the warehouse door has not already said better. Naming one to fill a heading
would be the violation the law exists to stop. **This section is empty on purpose.**

---

## 4. THE DELIVERABLE: ONE PARAGRAPH FOR WORLD, AFTER `[two prices]`

> **THE OLD PRICE IS ONE BATTERY, AND IT IS ALREADY IN THE GAME. The door is not a permit
> and not a coupon; it is the rung you hold with the faction that holds the market.** At
> `stranger` and `peripheral` you are a person on the street: you pay what the street
> pays, and the deep half of the shelf is not offered to you at all. At `useful` the shop
> stops treating you as traffic. At **`counted`** — *"on whatever list they keep, and that
> is a different thing from being liked"* — **you buy at one**, because you are the person
> the controlled price was set for. At `inside` you get what the town actually has, which
> is the fortress's eleven instead of the camp's four. **Nothing about the number changes;
> what changes is who is allowed to pay it.** Build it as two reads the shop already has
> in reach and does not use: the hub's holder, which `buy()` is already handed and throws
> away, and the player's rung with that holder, which `belonging` already computes. Give
> a market seat one extra row of goods it will only sell to `counted` and above, and quote
> the street multiple to everybody else — **between 2 and 5, never a fraction**, because
> every real spread is 1.7x to 13.3x and one battery cannot be cut in half. **And the door
> must never be an object.** Zimbabwe's coupon is the one case where the door was
> portable, and within months schools were settling bills in fuel coupons at a litre to
> the dollar: a transferable claim on a better price does not become arbitrage, it becomes
> the money, and it beats the money it was priced against. The door is a person's standing
> with a faction, which cannot be handed over, cannot be stolen, and is exactly what this
> repo already builds.

### AND THE FOUR LEAKS, BECAUSE A DOOR WITH NO LEAK IS A WALL

Every real door leaked, and each leak is a different verb this game already owns:

1. **The guard sells it out the back at 30% off.** A person inside the faction, selling
   your rung's access to somebody who has not earned it. This is the one the record
   shouts about and the one Bohemia is best equipped for, because standing is a web of
   people and one of them can always be got at.
2. **The paper is faked.** A quota granted to a business that does not exist. In our
   terms: being *counted* by a faction that never actually counted you.
3. **The border.** Buy inside, sell outside. This is the arbitrage round 34 asked for,
   and it only works once `[two prices]` lands.
4. **The queue is sold.** Fifteen hours, or money to the attendant to jump it. The queue
   is round 36's third sight, and this is what the third sight is *for*.

---

## 5. WHAT THIS ROUND DID NOT DECIDE

- **Which rung is the door.** `counted` is the argument, not a ruling; the ladder is
  BELONGING's and the shape of the offer is WORLD's.
- **The street multiple.** 2 to 5 is the real range, with a whole number required by his
  own law. Which whole number is a tuning call nobody should take from a record.
- **Which extra goods sit behind the door.** The camp's missing seven are the obvious
  candidates and they are FACTION-TOWNS' table, not mine.
- **Whether a guard can be bought.** Named as the first leak because it is the most
  documented thing in the round. Building a bribe is a design decision with teeth and it
  belongs to whoever owns the faction surface.
- **Anything about the demo.** Rule 14 (Paolo 9/13): research rounds continue and do not
  touch the demo. This round touched records, a bank and the board.

---

## 6. ROUTED

- **WORLD `[two prices]`** — section 4 is the paragraph the row asked for. The headline:
  **ONE is the old price already**, the street pays a whole multiple between 2 and 5, and
  `buy()` is already handed the hub it throws away.
- **WORLD `[old price]` follow-on** — the door is a rung read, not a new table. Two
  existing reads, no new field.
- **FACTIONS** — `goodsFor` is already a door and nobody called it one. A market seat with
  a row it will only sell to `counted` is the whole feature.
- **PEOPLE / BELONGING** — `counted`'s own note (*"on whatever list they keep"*) is a
  registry written before anybody needed one. Nothing to change; it is being pointed at.
- **QUESTS `[first ask]`** — the guard who sells out the back at thirty percent off is a
  first ask with two thousand years of history and needs no invention.
- **UI** — a shelf row the player can see and cannot buy is the sight. The card already
  greys unaffordable rows (`.mrow.no`); greyed-because-of-who-you-are is a different
  sentence and needs different words.
- **COORDINATOR** — nothing blocking. One premise in the pendings.

---

## 7. THE GATE NOTE

**Pre-push pass** (the gates reading the files in this diff): economy, purse, payday,
attempt, canon rot, demo blockers, language. Results in the commit.

**Full suite unmeasured since db7e535** — front-page rule 13: THE SUITE LINE is still
unposted, 331 of 603 gates never ran inside a 45-minute budget, and until PLUMBER writes
the first line that is the honest sentence. No red is mine; this diff touches only
records, the bank and the board.

**The project-level hole, round 23 of naming it.** These gates check that a part does what
it says. Nothing checks that two parts agree, that a part keeps working for as long as
the game lasts, that it is the right part to have, or that the parts form a loop that
closes.

This round's instance is a **dead argument** rather than dead code, which is a new
flavour: `buy()` accepts `hubOrNull` and hands it to a `price()` that has no parameter
for it. A gate that asked *does every argument reach a reader* would have gone red the
day the hub was added. It has now been measured in rounds 34 and 38 and is still there.

---

*ECONOMY round 38. Research only. Nothing in the game changed.*
