# ECONOMY -- ROUND 13: THE VALLEY FILLS ITSELF IN ELEVEN DAYS
# (ECONOMY lane, 9/6/26. MODE: RESEARCH -- nothing here is implemented.)
# Question Q13 [printed money], verbatim from VAMILY.md:
#   "When anyone who owns a building can make money, what happens? The real
#    history of money that anybody could produce (silver rushes, private
#    banknotes, cigarettes in camps, mining crypto), how fast it stopped being
#    worth anything, and what the best builder games do to keep a farmable
#    currency worth having (sinks, caps, decay, upkeep). Measured against our
#    repo: how many buildings could a player place in an hour, at one battery a
#    day each, and does the price ladder (everything costs one) survive that.
#    Paolo 9/5 ruled buildings auto-mine batteries and that gamified is fine
#    ("it's a fucking game"); this round finds what it breaks and what real fix
#    keeps it fun."
# Named DAY 13 for the machine. A round is one VAMILY and is never called a day
# to Paolo (NO CALENDAR TALK, 9/5, LOCKED).
#
# THIS ROUND WAS ORDERED BY THE LAW ITSELF. Paolo's own battery ruling closes
# with: "The list of power buildings, their yields and any cap are WORLD's to
# define and ECONOMY's to stress-test (a currency anyone can farm is the oldest
# way money dies; Q13)."
# -- laws/BOHEMIA_ADDENDUM_BATTERIES_ARE_THE_MONEY_AND_A_TILE_IS_A_HOUSE_9_4_26.md sec 4

## 0. THE HEADLINE

I did not model the ruling. I ran it, on the real modules, on five real seeds.

> **STARTING FROM ONE BATTERY, THE PLAYER OWNS EVERY BUILDABLE PLOT IN THE VALLEY
> ON DAY ELEVEN. From day twelve he earns about 511 batteries every night, forever,
> in a game whose entire shop list costs 11.**

The money supply DOUBLES every single day, because a building costs one battery
once and pays one battery every day after that. Payback is one day; everything
after that is free. There is no cap, no decay, no diminishing return, and the one
drain that scales -- the night lights bill -- misses **89.4% of the buildable
valley**, measured across five seeds.

And the deeper finding, the one that changes what the fix should be, is not about
supply at all. It is section 4.

## 1. WHAT I MEASURED ON OUR OWN BUILD FIRST

Everything below came out of `node` against the shipped modules, not out of
reading them.

### 1a. THE LOOP THAT SHIPPED WHILE I WAS AWAY

`engine/bohemia_production.js` (LIFE + CITY, 9/5, 257 lines) closed both halves in
one round, and its own header says why the second half had to exist:

> *"the whole consequence of placing a building was CBafterEdit() -- persist a
> delta, clear two caches, redraw. Purse touched 0. Free, silent, instant. So
> section 4 above had made the BUILD button a pure faucet: place a plot, get paid
> every wake beat, forever, for nothing."*

That is exactly right and it is exactly the reflex this round is here to check.
It then priced the build at one battery. **Measured:**

```
BUILDABLE TYPES                    59
COST     rows 59, every one        { currency:'electricity', amount:1, tuned:false }
PRODUCTION rows 59, every one      { resources:1, tuned:false }
PRICES   rows 11, every one        { currency:'electricity', amount:1, tuned:false }
PAYOUT   rows 1                    COMPLETE -> { electricity:1 }
```

Nothing is tuned and nothing should be; those are his 8/15 and 9/4 rulings held
honestly. The problem is not any number. **The problem is the SHAPE: a one-off
cost against a per-day yield with nothing on the other side.**

### 1b. PLACING A BUILDING COSTS NO TIME AT ALL

Q13 asks how many buildings a player could place in an hour. The answer is: **as
many as he has batteries for**, because building does not move the clock.

The city clock only moves when `advance(mins)` is called. Walking one cell calls
`advance(0.084)`; a road move calls `advance(10)`; a conversation calls
`advance(60)`. The build path -- `cbPaid()` -- calls `CE.build`, `charge`,
`centuryNote`, `phonePush`, `CBafterEdit`. **It never calls `advance`.** Nothing
in the game runs the clock on a real-world timer.

*Positive control, because a negative claim needs one:* the same search that
returns zero hits inside the build path returns fifteen callers elsewhere, so the
instrument can see a clock move. It is the build path that does not move it.

So the limit on building is money, and only money.

### 1c. THE VALLEY IS SMALLER THAN IT LOOKS, AND THAT MATTERS

`CE.build` refuses anything but literally `desert` ground. Not wash, not
boneyard, not landfill. Across five seeds:

```
seed     desert plots a player may build on
1        567
7        656
1234     555
90210    548
777777   600
                                   MEAN 585
```

585 plots. That is the whole ceiling of the builder half of the game, and
2^10 = 1024, which is why eleven days is enough to eat all of it.

### 1d. THE ONE DRAIN THAT SCALES MISSES NINE PLOTS IN TEN

WORLD's [lights bill] (9/5) is the only per-building running cost in the game: one
battery a night per lit circuit you hold, deduped by feeder. Its header says the
dedup is the point -- *"Four shops on one street are ONE feeder and ONE bill; four
shops spread across the valley are four."*

But a circuit only exists along a **street** cell, and only **12% of circuits are
lit** (CLUSTERED POWER LAW). So a plot is billed only if it happens to front a lit
street. Measured, five seeds:

```
seed     plots     billed     share
1        567       55         9.7%
7        656       63         9.6%
1234     555       67         12.1%
90210    548       76         13.9%
777777   600       50         8.3%
                              10.6%
```

> **89.4% OF EVERY BUILDING A PLAYER CAN PLACE COSTS NOTHING TO RUN, FOREVER.**

The drain is not small. It is *absent* on nine plots in ten. And the design intent
inverts: the dedup exists to make spreading out cost more than clustering, but the
cheapest thing in the game is to build in the dark, where nothing is lit, nothing
is billed, and -- by NOBODY PATROLS THE DARK -- nobody stops you either. The
dedup punishes the one player who builds on a lit street.

### 1e. THE RUN, ON THE REAL MODULES

Real `purse.create`, real `credit/debit/upkeep`, real `CE.build`, real
`PR.charge`, real `PR.placed`, real grid. Player starts with **one** battery and
reinvests everything.

```
 day | buildings | mined today | built today | batteries left
   1 |         1 |           0 |           1 |         0
   2 |         2 |           1 |           1 |         0
   3 |         4 |           2 |           2 |         0
   4 |         8 |           4 |           4 |         0
   5 |        16 |           8 |           8 |         0
   6 |        32 |          16 |          16 |         0
   7 |        64 |          32 |          32 |         0
   8 |       128 |          64 |          64 |         0
   9 |       256 |         128 |         128 |         0
  10 |       512 |         256 |         256 |         0
  11 |       555 |         512 |          43 |       425   <- VALLEY FULL
  12 |       555 |         555 |           0 |       936
  20 |       555 |         555 |           0 |      5024
  60 |       555 |         555 |           0 |     25464
```

**I ran it twice more to try to make it slower and could not.**

- *Optimising:* building the unbilled dark plots first (what any player works out
  in one night) versus building them in the order you walk past them. **Identical.
  Day 11 either way.** The lights bill does not even bend the curve.
- *Per-building upkeep instead of per-circuit* (the obvious fix): **still day 11.**
  Yield lands on the wake beat, the player spends it before nightfall, and the
  bill arrives to an empty purse. He gets the same city and every block of it goes
  dark. That is not a brake, it is a different ending.

### 1f. AND THERE IS NOTHING TO SPEND IT ON

There are exactly three doors a battery can leave the purse by: BUILD (one, once,
per plot), the night lights bill, and BUY. Once the valley is built the first door
is shut forever. So, per night, built out:

```
seed     made      lights bill    goods purchasable    made per battery spendable
1        567       42             11                   10.7x
7        656       45             11                   11.7x
1234     555       44             11                   10.1x
90210    548       48             11                    9.3x
777777   600       40             11                   11.8x
```

> **THE VALLEY MAKES 10.7x MORE MONEY EVERY NIGHT THAN THE ENTIRE GAME HAS
> ANYTHING TO SPEND IT ON.**

The whole shop list is eleven goods -- water, food, salvage, meds, fuel, power,
iodine, sterilewater, lidocaine, tweezers, antibiotics -- at one battery each.
Eleven batteries buys one of everything in Bohemia.

### 1g. A CEMETERY MINES MONEY, AND HIS OWN LAW SAYS IT SHOULD NOT

His ruling is narrow and specific: *"A player who sets up a **power building** on
their land auto-mines batteries."* The coordinator's row says the same: *"a
generator, a solar rack, a wind rig; real things that make electricity in a
desert."*

The shipped `install()` writes a yield row for **all 59 buildable types**. So
today a cemetery, a chapel, a drive-in and a golf course each mine one a day. That
is not a design choice anybody made; `install()` was written before the ruling
landed and fills from the whole BUILD list.

**And the repo already carries the right list, written by ART, not by economy.**
`bohemia_district_kit.js` sorts the 59 types into eight families; 11 are
`infrastructure`, and inside that `bohemia_battery.js` names the power chain in
its own words: *"Storage, distinct from **solar** (generation) and **substation**
(distribution)."*

> **Three of fifty-nine. `solar` makes it, `battery` holds it, `substation` moves
> it. Reading his law literally cuts the faucet by 95% and invents nothing.**

That is necessary and it is **not sufficient**, and saying so is the point of a
stress test: a player who can place 555 solar racks still doubles every day. The
type restriction changes who mints. It does not change that minting is free.

## 2. THE REAL AISLE: WHAT HAPPENS WHEN ANYBODY CAN MAKE MONEY

Four cases, and they do not agree with each other, which is the useful part.

### 2a. THE SILVER RUSH -- SLOW (Potosi, 1545 onward)
American silver flooded Europe for a century and a half. Prices rose **about
sixfold over 150 years: 1 to 1.5% a year.** New money on an enormous scale, and
the currency took *six generations* to lose most of its value.

### 2b. THE PRIVATE BANKNOTE -- MESSY, AND THE BEST MECHANIC IN THE FILE
United States, 1837 to 1863. No federal oversight of any kind. **"Paper money was
issued by states, cities, counties, private banks, railroads, stores, churches,
and individuals."** Thousands of issuers, thousands of note designs.

The thing that actually governed it was not a cap and not a law:

> **A NOTE'S VALUE DEPENDED ON THE DISTANCE FROM THE BANK THAT ISSUED IT.** You
> had to travel to the issuer to redeem it, and further away nobody knew the
> issuer, so the note was taken below face value or not taken at all.

"Wildcat banks" deliberately set up in remote country so their notes were
practically unredeemable, printed, and circulated the paper at par far from home.
**Distance was the whole economy.** Not a rule anybody wrote. Geography.

### 2c. THE CAMP CIGARETTE -- IT WORKED, BECAUSE IT WAS SMOKED
Radford's POW camp, 1945. Cigarettes became money in about a month. Two things
kept it honest, and both are consumption, not policy:

- **The money got destroyed by being enjoyed.** Every smoke was a hard sink. When
  a Red Cross allocation arrived -- several hundred thousand cigarettes in a
  fortnight -- prices soared, then fell as stocks were smoked away, until the next
  delivery. The supply shock and the sink were the same object.
- **Gresham's law ran visibly.** Plump cigarettes were smoked, thin ones
  circulated. Prisoners pulled tobacco out of machine-made cigarettes and rolled
  their own (25 to the ounce issued, 30 rolled from it), so the real cigarette
  "virtually disappeared from the market." Then hand-rolled money stopped being
  homogeneous: **each cigarette was examined before it was accepted, thin ones
  refused, extra demanded as make-weight.** Some were debased on purpose, tobacco
  pulled from the middle and inferior material packed in.

### 2d. THE EMERGENCY NOTE -- FAST (Notgeld, Germany, 1914 to 1923)
When the Reichsbank could not print fast enough, the state let towns, companies
and banks print their own. **Up to 4,000 issuing bodies.** Denominations reached
50 trillion marks on a single note from Duisburg. This is the version that died in
months rather than centuries.

**The difference between 2a and 2d is not the number of issuers. It is whether
making the money cost anything real.** Potosi silver cost lives, mercury, ships
and a mountain. Notgeld cost paper and ink. **The faucet's real-world price is
what set the speed.** Ours, today, costs one battery once.

## 3. THE GAMES AISLE, IN PLAIN WORDS
(No game he has not named is entering the design. These are mechanics, described
as mechanics, per this lane's MODE line.)

Five ways a game keeps a farmable currency worth having. Ranked by how well each
survived contact with our own numbers in section 1e.

1. **A FIXED POOL, SPLIT.** The world produces the same total no matter how many
   producers you build; each new one takes a thinner slice. This is the only one
   that changed the SHAPE of our curve rather than its height. Measured below.
2. **THE DEPOSIT RUNS OUT.** A source has a finite lifetime, then it is a
   building that does nothing. Real, and section 5 covers why it is not first.
3. **UPKEEP THAT SCALES WITH WHAT YOU OWN.** Measured in 1e: it does not slow the
   build-out at all, it only decides whether the lights are on at the end.
4. **THE MONEY DECAYS** (money that rots if you hold it). Section 5.
5. **PRICE THE GOOD THINGS ABOVE THE FAUCET.** Banned here on its face: everything
   costs one, and that is LOCKED.

**THE FIXED POOL, ON OUR OWN NUMBERS.** Same real modules, only the yield rule
changed -- the whole valley makes the same amount every day and the racks split it:

```
rule                                        valley full on
one battery per building per day (today)    DAY 11
valley yields 60 a day, split               DAY 16
valley yields 30 a day, split               DAY 24
valley yields 12 a day, split               DAY 50
```

The curve stops being a doubling and becomes a straight line the instant the pie
is fixed. **Exponential is not a game. Linear is.** And the player still gets
Paolo's ruling honoured word for word: more buildings, more batteries -- just not
twice as many.

**And it is the realistic option, which is why it leads (REALISM FIRST).** A
desert valley does not have unlimited electricity for the same reason it does not
have unlimited water (round 7): the resource is the sky over a fixed area, and it
is the same sky whether you put one rack under it or five hundred. The first men
on a strike get rich and the last ones get wages. That is not a game balance
patch, that is what a rush IS.

## 4. *** THE FINDING THAT PROVES US WRONG ***

I came into this round certain the answer was "cap the faucet," and the history
says that is the smaller half.

> **MONEY DOES NOT DIE BECAUSE TOO MUCH OF IT IS MADE. IT DIES WHEN IT STOPS
> BEING WANTED. AND OUR VALLEY'S DEMAND SIDE IS ELEVEN GOODS AT ONE BATTERY
> EACH.**

The proof is in his own state, Nevada, on the Comstock Lode.

The Comstock was found in 1859 and yielded roughly **$400 million** by 1878. It is
the biggest anybody-can-mine event in American history and Virginia City went from
2,345 people in 1860 to about **25,000 at its peak in the mid-1870s**.

Silver's value against gold fell steadily from **1859** onward -- fourteen years of
enormous new supply. Then it *"greatly accelerated in 1875 and 1876."* What
happened in between was not a bigger mine. **In February 1873 the United States
demonetized silver, and in July the new Germany went to the gold mark.** The
ratio, legislated at 16 to 1, ran out to 30 to 1 in the market.

**The supply flood alone moved the price slowly for fourteen years. The demand
collapse moved it fast.** And then Virginia City: 25,000 people, down to **2,695
by 1900.** The mountain still had ore in it. Nobody wanted what came out.

Radford's camp is the same law read forwards. Cigarette money worked, through
supply shocks that would have destroyed anything else, because demand for it was
structural and permanent: **people smoked it.** Every unit of the money supply had
somebody who wanted to destroy it for its own sake.

**MEASURED AGAINST US.** Our valley's problem is not that it mints 585 a night. It
is that once the building is done there are **eleven** things in the entire game
worth a battery, and one of everything costs eleven. Fix only the faucet and the
best case is a slow slide into the same wall on day 50 instead of day 11.

**So the real fix is two-sided and the second side is the one nobody is working
on:** cap the sky, AND give the money somewhere to go that is not a shop shelf.

And this valley already has the sink, built, shipped and running -- **the night
lights bill.** Every battery it takes is destroyed, not moved. Today it reaches
9 plots in 100. That is not a tuning problem, it is a **coverage** problem, and
coverage is geography, which is exactly what governed the free-banking note.

## 4b. THE FIFTH INDEPENDENT VOTE ON THE SAME PENDING

The free-banking record is the fifth round in a row to arrive, from a completely
different direction, at the same unanswered question.

A banknote far from its issuing bank was **not discounted, it was refused.**
Distance did not change the price of the goods. It changed whether your money was
taken at all.

That is the one mechanic in this entire file that costs his price ladder nothing.
**Rice still costs one battery.** But a trader four districts from your racks does
not know you, cannot check your batteries, and wants goods instead. The valley
already has the geography to run it: 16 faction market seats, measured distances,
roads that are twice as fast as broken ground, and a nearest market 7 cells away.

> **[PENDING Paolo, fifth vote]: will a trader ever refuse your money and ask for
> goods instead?**

Rounds 2, 9, 10, 12 and now 13 each said yes without knowing the others had.

## 5. REFUSED

Things this round found, checked, and is NOT recommending. Written down because
the version I nearly shipped was more flattering than the truth.

- **MONEY THAT ROTS (demurrage).** The famous case is Worgl, 1932: a 1% monthly
  stamp, scrip circulating 9 to 10 times faster than the schilling, local
  unemployment from 30% to near zero. It is the perfect-sounding fix for a
  battery pile. **But the record says the velocity came mostly from the injection
  of real schillings backing the scrip and the public works it paid for, not from
  the decay; comparable Depression-era stimuli without demurrage produced
  comparable short-term effects.** I was going to lead with this. It does not
  survive its own footnote, and a battery that quietly loses value in your pocket
  is also the single most infuriating mechanic you can put in front of a player
  who has been told everything costs one.
- **PER-BUILDING UPKEEP AS THE BRAKE.** Measured, section 1e: same day 11, and a
  valley in total darkness. It is a punishment, not a brake.
- **RAISING PRICES.** Would work instantly and is LOCKED shut. 8/15: everything
  costs one. Not proposed, not hinted at, not smuggled in as "a second tier."
- **A FOURTH CURRENCY.** Banned by the three-currencies law and by the purse's own
  header. The answer to a battery glut is never a new coin.
- **A VISIBLE CAP ("max 20 racks").** A number on a screen in a game whose whole
  identity is no spreadsheets. The fixed pool does the same job and the player
  discovers it by feeling his tenth rack pay less than his second.
- **DEBASEMENT (thin batteries, half-charged cells).** It is beautifully real --
  Gresham ran visibly in the camp and prisoners packed inferior material into the
  middles. But it needs a quality axis on the money, and his ruling is that a
  battery is a coin and nothing else. Recorded, not proposed.

## 6. ROUTED

Nothing here is implemented; this lane does not implement. These are the jobs the
findings become, for the coordinator to place.

**TO WORLD, on the row it already owns -- [batteries mined] BUILDINGS-MAKE-BATTERIES:**
1. **THREE TYPES, NOT FIFTY-NINE.** `install()` currently writes a yield for every
   buildable type. His ruling says power buildings. The repo's own taxonomy already
   answers which: `solar` generates, `battery` stores, `substation` distributes.
   No new list, no invented content.
2. **THE VALLEY HAS ONLY SO MUCH SUN.** Total daily battery yield across the
   valley is fixed and the racks split it. This is the one change that turns the
   doubling into a line (measured: full on day 11 becomes day 16 / 24 / 50 as the
   pool goes 60 / 30 / 12). The pool number itself is a balance decision and
   balance is Paolo's; the SHAPE is the finding.
3. **PAYBACK MUST NOT BE ONE DAY.** A building that costs one and pays one a day
   is free after 24 hours. Whatever else changes, this ratio is the engine of the
   doubling.

**TO WORLD, on [lights bill] as shipped:**
4. **THE DRAIN MISSES 89.4% OF WHAT IT IS AIMED AT**, because circuits only run
   along lit streets and only 12% of streets are lit. Not a tuning problem. Worth
   a look at whether a plot with no feeder should be reachable by the bill at all,
   or whether building in the dark should cost something else instead.

**TO LIFE + CITY:**
5. **THE BUILD BUTTON MOVES NO CLOCK.** Placing a building is instant and free of
   game time, so an hour of real play is bounded only by taps. Whether putting up
   a building should cost hours of the day is a real design question and it is not
   this lane's.

**TO THE COORDINATOR, for Paolo:**
6. **[PENDING Paolo, fifth vote]** Will a trader ever refuse your money and ask for
   goods instead? (Section 4b. Rounds 2, 9, 10, 12, 13.)
7. **[PENDING Paolo]** Once the valley is built out there are eleven things in the
   game a battery can buy. What should a rich player in a broken city want that he
   cannot simply build? This is the demand side and section 4 says it is the
   bigger half.

## 7. TEST MATERIAL
banks/BOHEMIA_ECONOMY_TEST_LINES_9_6_26 section, appended to
`banks/BOHEMIA_ECONOMY_TEST_LINES_9_5_26.md`, sections MMM through QQQ. Every line
`draft:true`, in the bank, never in the game.

## 8. SOURCES

REAL AISLE
- Free banking / wildcat era, issuers and distance discount:
  thismatter.com/money/banking/history/free-banking-national-banking-system.htm ;
  en.wikipedia.org/wiki/Wildcat_banking ;
  richmondfed.org/publications/research/econ_focus/2018/q1/economic_history
- Notgeld, up to 4,000 issuing bodies, 50-trillion-mark note:
  coinsweekly.com/currency-in-crisis-german-emergency-money-1914-1924/ ;
  learn.planetbanknote.com/notgeld-emergency-money/
- R.A. Radford, "The Economic Organisation of a P.O.W. Camp", Economica 1945:
  blog.lavoiedubitcoin.info/public/cigarettes/Radford_Cigarettes_.pdf ;
  timharford.com/2012/05/rules-of-trading-in-a-pow-camp/ ;
  newsroom.carleton.ca/archives/2010/11/09/prof-frances-woolley-the-pow-economy-explained/
- Comstock Lode production, Virginia City population 1860-1900:
  britannica.com/place/Comstock-Lode ; onlinenevada.org/articles/comstock-lode ;
  en.wikipedia.org/wiki/Virginia_City,_Nevada
- Silver demonetization 1873, ratio 16:1 to 30:1, fall accelerating 1875-76:
  econlib.org/book-chapters/chapter-part-ii-chapter-xii-cause-of-the-late-fall-in-the-value-of-silver/ ;
  chestofbooks.com/finance/banking/Money-And-Banking/5-The-Fall-In-The-Value-Of-Silver-After-1875.html ;
  metalorix.com/en/learn/history/demonetization-of-silver-1870s
- Price revolution, sixfold over 150 years, 1-1.5% a year:
  en.wikipedia.org/wiki/Price_revolution
- Worgl 1932 stamp scrip and the caution on what actually caused the effect:
  unterguggenberger.org/the-free-economy-experiment-of-woergl-1932-1933/ ;
  base.socioeco.org/docs/doc-278_en.pdf ; grokipedia.com/page/demurrage_currency

OUR OWN REPO (all figures re-measured this round, not quoted from a previous one)
- engine/bohemia_production.js, engine/bohemia_purse.js, engine/bohemia_cityedit.js,
  engine/bohemia_powergrid.js, engine/bohemia_overmap.js,
  engine/bohemia_district_kit.js, engine/bohemia_battery.js
- slices/BOHEMIA_CITY_WORLD.html: cbPaid(), heldCircuits(), nightPower(), advance()
- laws/BOHEMIA_ADDENDUM_BATTERIES_ARE_THE_MONEY_AND_A_TILE_IS_A_HOUSE_9_4_26.md sec 4

## 9. GATE STATE THIS ROUND

Green, run this round: economy 13/0, payday 38/0, purse 28/0, attempt 15/0,
demo blockers 22/0, canon rot 13/0, language 81/0, reply contract 17/0,
production tick 14/0, build-costs-its-price 14/0.

**MARKET GATE IS RED FOR THE TENTH ROUND AND IT GOT WORSE: 20 passed / 12 failed**,
up from 22/10. Proven on a clean `origin/main` worktree, so it is not this round's
tree. Same class as diagnosed in round 9 section 7b: the gate asserts `PRICES` is
EMPTY and asserts the debit lands in `resources`, while the shipped design has
`PRICES` filled by his own 8/15 + 9/4 ruling and debits `electricity`. **It is a
stale ruler, not a code regression** -- the real buy path still returns
`applied:true, paid:1, kind:'drain'`. The line-level work order in round 9 section
7b now needs two more lines added to it. This lane does not edit it: MODE: RESEARCH,
and it is not this lane's file.

Also red on clean main and not this lane's, proven this round on the same worktree:
banks-used 24/2 (both failures are "house skins (7/21 UP)"), engine sync
(BOH_FLOORPLAN), dialogue catalogue.
