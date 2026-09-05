# ECONOMY -- DAY 1: THE PRICE IS NOT THE STORY. THE REFUSAL IS.
# (ECONOMY lane, 9/5/26. MODE: RESEARCH -- nothing here is implemented.)
# Question Q1, verbatim from VAMILY.md:
#   "The first thirty days after a currency dies. What actually happened to
#    prices, wages and shops in Argentina 2001, Zimbabwe 2008, Venezuela,
#    Lebanon 2019. Which of it a player would feel in a first hour."
# Lane rule: both aisles, one finding that challenges us, measured against our
# own repo, test lines draft:true in a bank file and never in the game, ROUTED
# at the end. A day that only confirms us has failed.

## 0. THE HEADLINE, SO NOBODY HAS TO READ TO THE END

**WE BUILT SCARCITY AS A QUANTITY. IN ALL FOUR REAL COLLAPSES IT ARRIVES AS A
REFUSAL.** Nobody in Buenos Aires in December 2001, Harare in 2008, Caracas in
2019 or Beirut in 2019 remembers a number going up. They remember being told
NO: the bank is open and your money is not yours, the shop has the flour and
will not sell it, the same dollar is worth two different amounts depending on
which pocket it came out of. The goods were mostly still there. What broke was
the willingness to trade.

And measured on our own build the same afternoon, across six seeds including
the game's own: **our valley runs out of food between day 10 and day 16 and out
of water between day 51 and day 60, and after that EVERY PRICE IN THE GAME IS A
CONSTANT FOR THE REST OF A HUNDRED-HOUR LIFE.** We have ten interesting days
and then a flat line. The real thing never flattens, because a refusal is
renewed every single time you walk up to somebody.

## 1. WHAT I MEASURED ON OUR OWN BUILD FIRST

Instrument: the shipped modules, run directly (`engine/bohemia_economy.js`,
`engine/bohemia_purse.js`, `engine/bohemia_payday.js`), driven the way
`slices/BOHEMIA_CITY_WORLD.html` drives them at the market hub (a ledger sized
from a head count, every head on the module's `scav` job, one `advanceDay` at
nightfall). Probes are scratch files; nothing was written into the game.

### 1a. THE GOOD NEWS, AND IT IS REAL
There IS a working market on the surface he walks. The shelf is READ, never
typed: four goods, all four priced, `source: 'economy'` on every one, days-left
computed and shown in words ("8.6 days of it left in the valley"). Buying is a
hard sink -- the stock really drops, so the next one really is dearer. It saves
and restores with the city. That is more economy than most of this study
expected to find, and it was built to the ruling he actually gave on 8/11.

### 1b. THE PRICE CURVE, DAY BY DAY (agents=24, houses=24, probe seed 1234)
Seed 1234 is a probe seed. The seed sweep in 1c is the honest version, and it
was run because asserting seed-independence without measuring it is exactly the
kind of confident claim this repo keeps paying for.
```
day  water$  wDays   food$  fDays   meds$  mDays   fuel$   shortfall/day
  0   0.25    52.4    5.24    8.6      12   33.3       3   {}
  5   0.25    47.4   10.40    4.3   12.71   28.3       3   {}
 10   0.25    42.4   60.00    0.1   15.43   23.3       3   {}      <- food PINNED
 15   0.25    37.4   60.00    0.0   19.64   18.3       3   {"food":20.59}
 20   0.25    32.4   60.00    0.0   27.00   13.3       3   {"food":20.65}
 30   0.33    22.4   60.00    0.0  108.00    3.3       3   {"food":20.78}
 60  10.00     0.0   60.00    0.0  480.00    0.0   13.50   {"water":96,"food":21.13,...}
365  10.00     0.0   60.00    0.0  480.00    0.0  120.00   {"water":96,"food":23.11,...}
```
Read the last two rows. **Day 60 and day 365 are the same game.** Every price
has hit its cap and stopped. Water 10, food 60, meds 480, fuel 120, from about
week nine until the heat death of the campaign.

### 1c. THE DATES THE VALLEY DIES, AND ALMOST NOTHING MOVES THEM
Six seeds, including the valley's own (2691674296, the seed text "bohemia"),
24 people each:
```
seed          foodOut  waterOut  medsOut  food pinned at cap
1                  13        54       34        12
7                  13        54       32        12
42                 16        54       36        15
1234               11        53       34        10
99991              11        51       32        10
2691674296         10        60       32        10      <- the real valley
```
And the same three levers, at seed 1234:
```
                        24 people   120 people   everyone on the BEST job
food gone                 day 11      day 11        day 13
water gone                day 53      day 53        day 53
meds gone                 day 34      day 31        --
```
**Population does not move it at all**, because stock and need both scale with
heads. Working the best job the module has moves it two days. The seed moves it
by less than a week. **The real valley is the worst of the six: food gone on day
ten.**

And the flat line does not vary at all. Price at day 200, every seed:
```
water 10   food 60   meds 480   fuel 120     <- identical, all six
```
**The starvation is arithmetic, not a scenario:** a person eats 1.0 food a day and produces 0.15 scavenging or 0.30
at a real site, so the valley grows 15-30% of what it eats, forever. Water is
worse: need is 4.0 a day and **no job in the module produces water at all.**

### 1d. THE FLAT TOP AND THE FLAT BOTTOM
`scarcityMult` returns exactly 1.0 for anything at 30 days of supply or more.
```
60d=1.0  40d=1.0  30d=1.0  20d=1.5  14d=2.1  10d=3.0  7d=4.3  5d=6.0  3d=10.0  1d=30.0  0d=40.0
```
So a price is a flat line above 30 days and a flat line at the 40x cap below
half a day, and the whole of the drama lives in a four-week window. Measured:
**the water price does not move for the first 23 days of play. The fuel price
does not move in the first thirty days at all.**

### 1e. THE NUMBER THAT SAYS THE VALLEY IS STARVING HAS NO READERS
`shortfall` is computed every night, is correct, and is read by nothing. Grep
across the whole repo: `ledger.flows` is touched by the module's own `return`
and by `gates/economy_gate.js`. Positive control, because a negative result is a
claim about your instrument: I checked that `.flows` is reachable and read at
all (it is, by the gate), and I searched for the word inside quoted strings on
both the walked city and the alpha -- **zero.** Nothing in Bohemia ever says out
loud that twenty rations of need went unmet last night. This is the study's
oldest shape for the sixth or seventh time: the system exists and is aimed away
from the player.

### 1f. WHAT THE FIRST HOUR ACTUALLY CONTAINS TODAY
```
STARTING PURSE:            {"resources":0,"electricity":0,"clout":0}
PAYOUT / PRICES / PRODUCTION table sizes:   0 / 0 / 0
SHELF, day 1:   water 0.25   food 5.24   meds 12   fuel 3      (all priced, all real)
BUY, day 1, with the purse the game gives you:
   water {"applied":false,"reason":"CANNOT_AFFORD","price":0.25,"have":0}
   food  {"applied":false,"reason":"CANNOT_AFFORD","price":5.24,"have":0}
   meds  {"applied":false,"reason":"CANNOT_AFFORD","price":12,"have":0}
   fuel  {"applied":false,"reason":"CANNOT_AFFORD","price":3,"have":0}
dayReport blocking: ["PAYOUT"]
```
**You cannot afford one litre of water at a quarter of a resource, because
nothing in the game has ever given you a resource.** Day 20 of the BB study
found `@DO pay` used zero times in 687 quest calls and the three ruled-but-empty
tables; that was 8/28 and **it is still exactly true on 9/5.** The module's own
`dayReport` prints `blocking: ["PAYOUT"]` on every call, which is the same gate
politeness day 20 named: our machines can say broken or fine and have no word
for OWED.

### AND THE ONE FAUCET WALKED ONTO THE STREET WITHOUT ITS MONEY
This one nearly became a false finding, and the correction is better than the
error. My first measurement said the roadside director never fires on foot. That
was TRUE UNTIL 8/31 AND IS NOW FALSE: the PEOPLE lane wired his twelve approved
encounters to the walked surface that day, and the handoff at the top of the
repo says so. Read to the end of the record before acting on the middle of it.

What is actually true is narrower and worse. There are **two directors**:
```
walkInterrupt(5.04)   <- ON FOOT, line 30370. Fires the twelve. Calls walkSay().
                         Touches the purse ZERO times. No card, no choices.
roadInterrupt(600)    <- inside if(MODE==='city') in stepOnce, line 30306.
                         Fires the twelve, AND calls roadCard(), which is the
                         only route to roadChoose() (pay / give) and the only
                         caller of roadLeave(), the one faucet in the game.
```
So on foot you get the coyote and a line of whisper text. **You do not get the
card, the choice, the cost, or the salvage.** `roadLeave` credits `resources`
from nothing and it is reachable only from the zoomed-out map. **The encounters
walked onto the street and left their money behind.** A migration list is a
deletion list for everything not on it, at the scale of one function, four days
old, and green the whole time.

### 1f-bis. A SMALL HONEST ONE: THE CARD SAYS "THE VALLEY" AND MEANS THIS BLOCK
The market card's line is `daysLeft + ' days of it left in the valley'`. The
ledger behind it is built from `mktHeads()`, a census of at most ten
neighbourhoods around the hub, capped at 24 people each. So the number is a
local larder and the sentence promises a region. Nobody is misled today because
nobody can buy anything, but the moment somebody can, that word is doing work it
has not earned. Cheap to fix (say the block, or the swap meet) and it is the
kind of thing that only shows up when you read the string next to the number.

### 1g. AND THE LARDER IS BORN FULL ON THE DAY YOU FIRST LOOK AT IT
`mktLedger()` is lazy and `mktAdvanceDay()` no-ops while the ledger is null. So
the valley's stocks are created at day 0 the first time you open a market, and
the ten-day countdown starts then. A player who first trades on day 40 gets a
full pantry. Defensible as an optimisation (a census at boot is paid by every
player who never trades) and it is written down as one, but it means **the
scarcity clock is not the world's clock, it is the clock of your own first
visit.**

## 2. THE REAL AISLE: WHAT THE FIRST THIRTY DAYS ACTUALLY WERE

### 2a. ARGENTINA, DECEMBER 2001 -- THE MONEY IS THERE AND YOU CANNOT TOUCH IT
On 1 December 2001 the government froze every bank account, initially for 90
days: cash withdrawals capped at **250 pesos a week**, and only from peso
accounts. Dollar accounts could not be touched at all unless the holder agreed
to convert. The nickname was the *corralito*, the little playpen. Eighteen days
later the pot-banging was in the streets, thirty people were dead, the economy
minister resigned on the 19th and the president on the 20th.

What filled the hole was not one replacement money, it was **several at once**.
Fifteen provinces printed their own paper to pay their own staff -- patacones in
Buenos Aires, and more than twenty varieties nationally with names like
*federales* and *evitas* -- and they circulated like legal tender. Underneath
that, the barter clubs: about 500,000 people trading regularly by May 2001, and
at the peak in 2002 roughly **5,000 nodes and 2 million members**, with
estimates of 6-7 million touched over the year and 7-10% of the population
taking part, using their own club scrip.

**THE LESSON FOR US: when the money dies, the number of monies goes UP, not
down.** People do not fall back to pure barter and stay there; they invent
tokens within days and the tokens are LOCAL. A club's ticket was good at that
club's tables and nowhere else.

### 2b. ZIMBABWE, 2008 -- THE SHELVES EMPTIED BECAUSE OF A PRICE, NOT A SHORTAGE
Peak annual inflation in November 2008 is estimated at 89.7 sextillion percent,
with **prices doubling roughly every 24 hours** and shop staff walking the
aisles rewriting tags several times a day. But the famous empty shelves came
FIRST and came from **price controls**: the 2007-08 freeze made selling at the
legal price a loss, so shops stopped selling and manufacturers stopped
producing. The retailers' own confederation named the mechanism: *"the
replacement value has been our Achilles heel."* If tomorrow's restock costs more
than today's sale brings in, the rational move is to keep the flour.

Then dollarization happened from below, before it was legalised: people simply
priced in US dollars and rand. And because nobody imported coins, **change was
given in sweets** -- the small end of the money supply was literally candy.

**THE LESSON FOR US: an empty shelf is a decision, and the smallest
denomination is a design problem people solve with whatever is in the box.**

### 2c. VENEZUELA -- THE SHOP STOPS QUOTING A PRICE AT ALL
Transactional dollarization ran from "more than half" to about **two thirds of
all transactions** on the same consultancy's numbers across 2019-2021, with the
cash share moving between roughly 51% and 80% depending on the survey. On the
ground the reported texture is the one that matters to us: **stores with no
price tags on the goods**, where you carry the item to the till and are told the
number, which may be double what it was an hour ago. Corn flour at 220 one day,
240 the next, 260 the day after.

**THE LESSON FOR US: the price stops being a property of the object and becomes
a property of the CONVERSATION.**

### 2d. LEBANON, OCTOBER 2019 -- THE SAME WORD FOR MONEY MEANS TWO THINGS
The banks did not freeze accounts by decree, they simply stopped paying out, and
the country invented a word for the difference. A dollar deposited before the
crisis ("lollar", coined by an economist and adopted by everybody) pays out at
something like **15% of the value** of a dollar you carry in your hand ("fresh
dollar"). At the same time the country ran the official peg, the market rate,
the central bank's platform rate and the money-transfer rate **simultaneously**.
Food: the survival food basket rose **56.1% between September 2019 and April
2020**, and the food price index registered **423% over October 2019 to November
2020.**

**THE LESSON FOR US, AND IT IS THE SHARPEST ONE: two people can hold "the same"
money and not be holding the same thing.** The exchange rate stopped being a
number and became a question about who you are and where your money has been.

### 2e. WAGES, ALL FOUR
Wages lag, always, and the adaptation is behavioural rather than arithmetic:
pay periods shorten (in the worst episodes people were paid twice a day so they
could spend before the afternoon), salaries get paid in whatever the employer
has (provincial scrip, goods, rent in food), and long-term planning is abandoned
as a category error. Argentina's measured real wage fell 19.3% from December
2020 to 2023 in an episode nobody calls a collapse.

**THE LESSON FOR US: the interesting variable is not the size of the wage, it is
HOW OFTEN IT ARRIVES.** A daily wage in a game where prices move is a completely
different feeling from a weekly one, and it costs no damage number to change.

### 2f. THE SCIENCE UNDERNEATH: WHAT SCARCITY DOES TO A HEAD
The best-replicated finding in the psychology of scarcity is that having too
little of something **captures attention automatically**: a person short of
money thinks about money constantly. That has two halves, and both are design
facts for us. The **focus dividend**: scarcity tunnels you onto the scarce
thing, which is engagement for free. The **bandwidth tax**: the same tunnelling
crowds everything else out, measurably degrading unrelated decisions, and merely
being asked to think about a money problem is enough to do it.

**THE LESSON FOR US, AND IT COLLIDES WITH A LIVE COMPLAINT: a player who is
short of four things at once will tunnel onto a meter and stop seeing the city.**
His loudest playtest note is "the city seems dead asf". A starving player looks
at the bar, not at the street. One scarce thing in the first hour, not four.

## 3. THE GAMES AISLE, IN PLAIN WORDS
(Per the 8/28 law: mechanisms only, no game he has not named enters this record,
the design or the vocabulary. Rogue Fable 4, Battle Brothers and Final Fantasy
XII are his set. Everything below is described as a mechanism.)

- **Faucets and drains must be sized against each other before anything ships.**
  The standing practitioner rule is that if the sources give too little the
  player cannot participate at all and if they give too much every purchase
  stops mattering. **We are hard against the first wall: our faucet is zero.**
- **Prototype the economy outside the game before coding it.** The advice is
  boring and it is exactly what this day did: 30 lines of probe found a day-ten
  famine that no gate had ever mentioned, because our gate asks whether the
  ledger is CONSISTENT and never asks whether it is SURVIVABLE.
- **A scarcity economy is a tone, not a spreadsheet.** The same numbers read as
  tense or cosy depending entirely on how the game tells you about them.
- The mechanism worth stealing outright, and it is a refusal mechanism: **a
  trader who will not deal is more memorable than a trader who is expensive.**
  A price teaches arithmetic. A refusal teaches WHO SOMEBODY IS.

## 4. *** THE FINDING THAT CHALLENGES US ***

> **SCARCITY IS NOT A NUMBER GOING UP. IT IS SOMEBODY SAYING NO, AND WE HAVE
> BUILT THE ONE HALF THAT ISN'T THE STORY.**

Our market always sells. At day 300, with zero food in the valley and a standing
unmet need of 21 rations a night, our shopkeeper will still hand you a ration
for 60 resources, cheerfully, forever. **He has no view about tomorrow.** Every
real seller in every one of the four collapses had exactly one view about
tomorrow and it governed everything they did: *what will it cost me to replace
this?*

That single missing question explains all four of the textures above at once.
Replacement cost is why the shelves emptied in Harare. It is why the tags came
off in Caracas. It is why a Beirut merchant will take one kind of dollar and not
another. And it is a BEHAVIOUR, which means for us it is free: it needs no
damage dial, no balance pass, and no ruling from him, because a refusal costs
nothing to state and cannot be inflated.

It also fixes our flat line without touching the curve. A stock model has one
cliff and then silence. A refusal renews every time you walk up to a person,
which means it scales to a hundred hours by construction. **And it lands in a
shape we already own everywhere else:** all 27 canon quests fail by somebody
telling you no to their face rather than by a clock running out (day 20); the
asking module's own header reads "ONE refusal per trade reused everywhere.
Eighteen blocks cover every person and every subject", so a refusal is already
the cheapest reusable unit of speech we own; `NO_RULING` is already
the machine's own way of saying "I will not answer that". **Bohemia is already a
game about being refused. The market is the one place we forgot.**

### 4b. THE SECOND CHALLENGE, AND IT IS ABOUT HIS OWN RULING
9/4: *"i dont want there to be money money maybe electronics like batteries are
the currency. For one aa battery a bag of rice."* Read that sentence again. **It
is not a wallet, it is a PRICE.** The real record says the same: what a dying
economy reaches for first is not a thing to hoard but a thing two strangers can
AGREE IN, one move, no argument. Cigarettes won in the camps because everyone
knew what one was worth. Candy became change in Harare because it settled the
last decimal. So the battery's first job is to be the **unit of account** -- the
word prices are said in -- and only second a thing in a purse. Which means the
cheapest possible first ship is **the market card quoting in batteries**, and
that is a labelling change, not an economy change.

### 4c. AND ONE CHALLENGE AIMED AT THIS LANE'S OWN QUESTION
Q1 asks what a player would feel in a first hour. The honest measured answer
today is **nothing**, and not for the reason anybody would guess. It is not that
the economy is missing. It is that the economy is real, correct, priced, saved,
and **standing behind a door the player has no key to**, because the purse
starts at zero and the only faucet is reachable only from the zoomed-out map.
We do not have an economy problem in the first hour. **We have a first-coin problem.**

## 5. WHAT A PLAYER WOULD FEEL IN THE FIRST HOUR (the question, answered)
Ranked by what the four collapses say people actually noticed first, and scored
by what it would cost us:

1. **BEING TOLD NO BY SOMEBODY WHO HAS IT.** Universal, first-day, remembered
   for twenty years. Costs: one behaviour on a seller. No numbers.
2. **A THING YOU OWN THAT YOU CANNOT USE.** The corralito, the lollar. This is
   the sharpest first-hour feeling in the whole record and we have no version of
   it. Costs: nothing but a rule about access.
3. **THE PRICE SAID OUT LOUD INSTEAD OF WRITTEN DOWN.** No tag, ask the man.
   Costs: a line of copy on the market card.
4. **THE SAME THING COSTING DIFFERENT PEOPLE DIFFERENT AMOUNTS.** Standing,
   faction, who you came in with. Costs: one multiplier we already have inputs
   for (standing exists).
5. **PAY THAT ARRIVES OFTEN AND SMALL.** The day's wage is the felt unit, not
   the week's.
6. **The absolute price level.** Dead last. Nobody remembers the number.

**Our shipped build implements exactly number 6, and only number 6.**

## 6. INSTRUMENT NOTES (things that would have become false findings)
- **THE NEAR-MISS OF THE DAY, and it is the fifth of its class in this study.**
  "The roadside director never fires on foot" was true on 8/30 and false on
  8/31, and it is written in three records that are still in the repo. A stale
  finding reads exactly like a fresh one. The positive control that caught it
  was the handoff file's own top block, which is the newest thing in the repo
  and the first thing a session is told to read.
- **The market is NOT missing.** My first assumption walking in was that the
  economy module had no caller on the walked surface, which is the shape this
  study has found six times. It is false: there is a real market with a real
  ledger, real prices and a real sink. Checked before it was written down.
- **`shortfall` really does have no reader**, and the positive control is that
  the same field IS read by `gates/economy_gate.js`, so the search can see it
  when it is there.
- **Do not measure the fight from the alpha** (day 23's note) and do not measure
  the city from the alpha either: the alpha loads `BOHEMIA_CITY_WORLD.html` by
  `src`, so city tokens read zero in the alpha while being present.
- **The day-ten famine is not visible from reading the code.** Every constant in
  that module carries a researched anchor and every one of them is defensible on
  its own. The famine is what the anchors do TOGETHER, and only running it for
  thirty days shows it. A module can be correct line by line and still describe a
  place where everybody dies.

## 6b. THE LANE'S OWN GATES, RUN THIS TURN
```
ECONOMY GATE: 13 passed, 0 failed
MARKET  GATE: 32 passed, 0 failed
PAYDAY  GATE: 35 passed, 0 failed
   (the money is on the walked surface . hubs read from the overmap .
    every amount still [PENDING Paolo])
```
Full suite, 479 gates, two reds and neither is this lane's, each proved against
a clean worktree of `origin/main` rather than asserted: **ENGINE SYNC is red on
main right now** (`BOH_FLOORPLAN`, 2 distinct bodies across 11 carriers, fails
identically on the untouched baseline, and ENGINE SYNC LAW is one canonical body
per module), and **FIGHT MUSIC fails only inside the concurrent suite** and
passes 47/0 alone on both trees, which makes it a load-timing flake in the
runner. This lane changed four markdown files and zero code. Two more reds came out of
the markdown-sensitive subset and both are also byte-identical on the baseline:
BANKS-USED (24/2, an index debt row) and DIALOGUE CATALOGUE (61/2, the WORDS tab
baked from `a852b32424dab382` while its sources now hash `c95d11ddf447f7ca`).
**So main is red on at least three gates as of 9/5**, and one of the three is a
single command the gate prints itself. A LAW WITHOUT A MACHINE GATE IS NOT
ENFORCED has a partner nobody wrote down: **A GATE NOBODY RUNS IS NOT A GATE.**
The dialogue one matters most, because it means his editing surface is showing
him stale words, and a surface he cannot trust is the one thing a judging
surface cannot afford.

**Read the payday line.** It is green, it is honest, and it says in its own
summary that every amount in the game is still unruled. That is day 20's finding
happening live: our gates can say BROKEN or FINE and have no word for OWED, so a
thing that has been waiting sixteen days reports as a pass. Same shape one line
down: economy_gate's 13 checks prove the ledger never goes negative, never
creates matter, and prices monotonically in scarcity. **All thirteen are true of
a valley where everybody is dead.** Consistency is not survivability, and only
one of those two is a game.

## 7. REFUSED (things this day will not propose)
- **A hunger meter, a thirst meter, or any bar on the player.** Day 7 settled it
  and the scarcity science above independently agrees: a meter is what the player
  tunnels onto instead of the city.
- **Rebalancing the yields to make the valley survive.** That is a numbers pass
  and NO DAMAGE BEFORE THE DIAL covers the spirit of it. The famine is worth
  REPORTING to him, not quietly tuning away. It may even be canon: a valley that
  is eating its last shelves is his premise.
- **A fourth currency, an exchange rate, or a chart.** Three currencies are
  locked (7/26) and a second number invites the comparison that day 17 banned.
- **Inventing what a battery buys.** EVERYTHING COSTS ONE already ruled the
  number and 9/4 already ruled the pairing. Anything past that is his.
- **Any implementation at all.** MODE: RESEARCH.

## 8. ROUTED
Rows for the coordinator to place. Nothing here is added to VAMILY.md by this
lane; lanes change status words only.

**WORLD**
- `ECON-THE-SELLER-HAS-A-VIEW-ABOUT-TOMORROW` -- a seller refuses when
  replacement cost beats the sale, instead of always selling at the cap. The
  finding of the day. No damage number, no ruling needed, fixes the flat line.
- `ECON-THE-VALLEY-STARVES-ON-DAY-TEN` -- report the measured famine and the
  zero-water-production arithmetic to Paolo before anybody touches a yield. Ships
  as a finding, not a tuning pass.
- `ECON-SOMETHING-READS-THE-SHORTFALL` -- the nightly unmet need reaches a
  surface (the reckoning card is where day 7 and day 13 already converge).
- `ECON-THE-FIRST-COIN` -- the purse starts at zero and the only faucet is
  reachable only from the zoomed-out map. Sits directly in front of
  BB-THE-LETTER-IS-ONE and is the reason that job matters.
- `ECON-QUOTED-IN-BATTERIES` -- the market card says the price in batteries. A
  labelling change on his 9/4 ruling, not an economy change.
- `ECON-THE-LARDER-IS-BORN-WHEN-YOU-LOOK` -- decide, out loud, whether the
  scarcity clock is the world's or the player's first visit.
- `ECON-SAY-THE-BLOCK-NOT-THE-VALLEY` -- the market card promises a region and
  counts a block. One string.

**RUN**
- `ECON-THE-WALK-PAYS-WHAT-THE-MAP-PAYS` -- and this **replaces** the reading of
  the existing `ROAD-INTERRUPTS-ON-FOOT` row, which is now half done. The
  encounters DO fire on foot as of 8/31. What did not come with them is
  `roadCard`, and with it the choices, the cost and `roadLeave` -- the only
  faucet in the walked game. On foot the road cannot pay you or charge you.
  This is the cheapest first coin in the build: the code exists, it is approved,
  it is already firing, and one branch is holding its wallet.

**UI**
- `ECON-NO-TAG-ASK-THE-MAN` -- the price is spoken, not printed, at some hubs.
  One number still (day 17 holds), but it comes out of a mouth.

**PEOPLE / FACTIONS**
- `ECON-THE-SAME-THING-COSTS-YOU-MORE` -- standing changes the price you are
  quoted. The inputs exist; who is dear to whom is his.

**QUESTS** (parked, banked for reopening)
- `ECON-PAID-IN-WHAT-THEY-HAVE` -- a job that pays in scrip, goods or a favour
  rather than resources, which is what actually happened in all four collapses.

**SHARED**
- `ECON-A-GATE-CAN-ASK-IF-IT-IS-SURVIVABLE` -- `economy_gate.js` proves the
  ledger is consistent and monotone and never asks whether anybody lives. Thirty
  simulated days in a gate would have caught the day-ten famine on the day it
  shipped. This is BB-A-GATE-CAN-SAY-OWED's twin.

## 9. TEST LINES
Drafts live in `banks/BOHEMIA_ECONOMY_TEST_LINES_9_5_26.md`, every line
`draft:true`, none of them in the game.

## 10. SOURCES
Argentina: Wikipedia "Corralito"; Wikipedia "Patacon (bond)"; Wikipedia
"Credito"; Toward Freedom, "Argentina: Barter Clubs"; CNN, "Barter clubs expose
Argentina's weakness"; Inter Press Service, "Argentina: Bartering, Here to
Stay?"; La Tercera/Los Andes crisis retrospectives.
Zimbabwe: Al Jazeera, "Zimbabwe seeks to end buying spree" (2007 price freeze);
NPR, "How crumbling U.S. dollars bailed out Zimbabwe" (change in sweets);
Michigan Journal of Economics, "Hyperinflation and Monetary Breakdown in
Zimbabwe"; PressReader/Cape Times, "Hyperinflation a nightmare in Zimbabwe"
(replacement value).
Venezuela: Ecoanalitica, "General features of transactional dollarization in
Venezuela"; NPR, "Use Of U.S. Dollar In Venezuela Sustains Some Economic
Activity"; Al Jazeera, Venezuela dollarisation (2020).
Lebanon: Baz, "Lebanon: From Dollars to Lollars", International Finance (Wiley);
WFP Lebanon VAM food price updates, May 2020 and December 2020; Middle East
Institute, "Lebanon's monetary crisis and the future of the Central Bank".
Prices/wages behaviour: ADP ReThink Q, "Payroll during hyperinflation";
WageIndicator, Argentina cost of living.
Scarcity psychology: Mullainathan and Shafir, *Scarcity*; Princeton/Science
(2013), "Poverty impedes cognitive function"; Harvard Magazine, "The Science of
Scarcity".
Game economy practice: gamedesignskills.com economy design; Game Developer,
"Economy as Gameplay"; gamedevessentials.com economy framework.
