# DAY 36 — A CRASH DOES NOT START WITH A PRICE. IT STARTS WITH A MISSING PRICE TAG.

ECONOMY lane, VAMILY row `[first ten]` Q36. MODE: RESEARCH — DO NOT IMPLEMENT.
Round 36. Claimed 9/13/26 `economy-vamily-knxaeh`, commit f648332.

> **THE ROW, VERBATIM:** "What the first ten minutes of a crash economy must show a
> player to be believed: from real accounts of the first day people noticed money had
> stopped working (what they saw first: a price, a queue, a closed door, a neighbour),
> and what the best economic games put in front of a player before any number. Deliver
> the three sights QUESTS [first ask] and RUN [wake near] should guarantee."

---

## 0. THE FINDING THAT PROVES US WRONG

The row assumes the answer is a **price**. It is not. In the four best-documented
first days in the record, **the number is not what moved.**

Venezuela, 2016: *"Items in stores had no price tags on them — instead customers
would take items to the cashier who would calculate the price, which could be twice
as much, or more, than an hour earlier."* The first sight was **the absence of a
number**, and a person you had to carry the thing to in order to learn it.

And the reason the tags came off is the part that turns this round from a note into a
mechanism. **Venezuela had price controls.** The official price was pinned. It could
not move. So every bit of the scarcity that the price was forbidden to express moved
somewhere else: into the empty shelf, into the queue, into the back room, into the
second shop, into the man outside. The shortage-economy literature says the same thing
in a colder voice: under chronic shortage the binding cost is not the price, it is the
**hours in the line**.

### WHICH MEANS HIS LAW IS NOT A SIMPLIFICATION. IT IS THE MECHANISM.

**EVERYTHING COSTS ONE (8/15) is a price control.** A price control is the single most
documented cause of every first-day sight in the record. We have been carrying ONE as
a thing to apologise for and route around. It is the realistic setting, it is the
historically normal state of a crash, and **all three sights below are its downstream
consequences rather than decoration bolted on beside it.**

That is the finding. Eight rounds of this study have treated EVERYTHING COSTS ONE as a
tuning shortcut. It is the premise.

---

## 1. WHAT OUR FIRST TEN MINUTES ACTUALLY CONTAIN (measured before researching)

The tutorial is four authored scenes, and the last beat of the fourth is named
`and_that_is_the_tutorial`, so its own author has told us where the ten minutes end.
Walked with `scratchpad/q36a.js` and `q36b.js` over the four scene records:

    BOHEMIA_SCENE_ACT1_COLD_OPEN.json     26 beats
    BOHEMIA_SCENE_ACT1_THE_LAST_ROOM.json 11 beats
    BOHEMIA_SCENE_ACT1_GRIEF_DINNER.json  16 beats
    BOHEMIA_SCENE_ACT1_RIDGE_BURIAL.json  15 beats
    ------------------------------------------------
    68 beats · 23 spoken lines · 0 containing a DIGIT

**Zero numbers in the first ten minutes, and that is correct.** Whatever else this
round changes, nothing here argues for putting a number in the opening. The opening is
already doing what the whole second aisle says to do.

Five of the 23 lines touch getting by. Four of them sit BEFORE the match-cut.

### THE THREE PROMISES, AND THE TWO NOBODY CASHED

`scratchpad/q36l.js` splits every spoken line at the cut and asks which strands planted
before it are answered after it:

| strand | before the cut | after the cut | verdict |
|---|---|---|---|
| FOOD — the green ones | 3 lines | 4 lines | **ANSWERED** |
| WORK — the water district | 1 line | **0 lines** | *** NEVER ANSWERED *** |
| FUEL — the truck | 1 line | **0 lines** | *** NEVER ANSWERED *** |

The food strand is answered beautifully and twice. *"I'm not eating the green ones"*
comes back ten years later as *"There's green ones in this." / "There's nothing in it.
Eat it."* and again at the grief dinner as *"I picked the green ones out. Force of
habit."* That is the whole crash in four sentences and not one digit.

The other two cheques the table writes are never cashed:

> father: **"They're saying the water district's hiring again. I'll go down Monday."**
> sibling_older: **"Can I take the truck Saturday? I'll put gas in it, I swear."**

There is a job you can walk down to, and there is fuel you can put in a truck. After
the cut, no line in 68 beats mentions work, a shift, being paid, the truck, gas or
fuel. **The player has already been told what he lost and has never once been shown
it.** These are the two lines QUESTS `[first ask]` should reach for, because he heard
them in the first ninety seconds and nobody has to explain them.

### WHAT IS ON THE SCREEN, NOT IN THE SCRIPT

- **No currency display exists anywhere.** `grep` for a battery/clout/power HUD id
  across `BOHEMIA_DEMO.html`, `BOHEMIA_RUN_CURRENT.html` and `BOHEMIA_ALPHA_0_9.html`:
  zero hits. The purse is inlined in the run surface and has exactly **one** caller,
  inside the buy function.
- **The served first ten minutes are an invite card and then a frozen picture.** Not
  mine and already found: RUN measured the cold open painting about one frame and
  holding for 85+ seconds (`records/BOHEMIA_THE_OPENING_SCENE_NEVER_ENDS_9_12_26.md`).
  Naming it here because every sight this round delivers arrives downstream of it.
- **74% of the valley is dark at boot.** `powerMap(overmap(7), 7, {})`: **1,490
  circuits, 391 live = 26.2% lit.** A closed door is not a thing we need to build a
  system for. It is the default state of three cells in four.

### AND THE SHELF, WHICH IS THE ONLY PLACE A NUMBER LIVES

`showMarket()` on the city surface already speaks his money: *"you have 1 battery"*,
*"RICE · 1 bag … 1 battery"*, *"N days of it left in the valley"*, and the refusal
*"that is 2 batteries and you have 1 battery"*. Good writing, already shipped.

`scratchpad/q36i.js`, corrected — **my first probe called `makeLedger()` with no
arguments, so a 0-person 0-house block reported every stock null and every daysLeft
`Infinity`, and I nearly wrote down "eleven nulls at boot" as a finding. It was my bug.
`makeLedger(seed, nAgents, nHouses)`, and the gates' own shape is `(7, 40, 20)`.**
On a real block, day one:

| good | stock | days left | sim price | base |
|---|---|---|---|---|
| water | 4275 L | 26.7 | 0.28 | 0.25 |
| food | 420 rations | **10.5** | **4.29** | 1.5 |
| fuel | 48 L | 24 | 3.75 | 3 |
| meds | 24 doses | 30 | 12 | 12 |
| power | 0 | forever | 2 | 2 |
| salvage | 88 kg | forever | 1 | 1 |

**Ten and a half days of food, and it already costs nearly three times base, on turn
one.** The most alarming number in the game exists at boot and nothing shows it. Four
of eleven goods can print the scarcity line on day one; the other seven have no daily
need so they fall back to their note.

---

## 2. *** THE COLLISION NOBODY WROTE DOWN ***

This is the round's hard measurement, and it is not a bug. It is two of his own rulings
meeting, with the newest correctly winning, and the consequence never recorded.

`price()` on the run surface checks two branches in this order:

    1. if PURSE.PRICES has the good      -> return that row's amount
    2. if PRICE_SOURCE === 'economy'     -> return ECON.price(ledger, good)

Branch 2 is **@RULING PRICES A, Paolo 8/11**, demo blocker 2: *"Three goods, priced off
the scarcity sim we already have."* The comment above it says, in the file, today:

> *"HIS OWN TABLE STILL WINS: PURSE.PRICES is checked first **and is still empty**."*

It is no longer empty. It was filled on 9/5, eleven rows, every one
`{currency:'electricity', amount:1}`, each citing *"8/15 EVERYTHING COSTS ONE + 9/4
BATTERIES ARE THE MONEY"*. The precondition in the comment went false and nobody
re-read the comment.

`scratchpad/q36n.js`, replicating the guard against the real tables:

| good | branch 1 | branch 2 (the sim he ruled) | what the shelf shows |
|---|---|---|---|
| water | 1 battery | 0.28 | branch 1 |
| food | 1 battery | **4.29** | branch 1 |
| meds | 1 battery | **12** | branch 1 |
| fuel | 1 battery | 3.75 | branch 1 |
| power | 1 battery | 2 | branch 1 |
| *(6 more)* | 1 battery | 1 | branch 1 |

    goods whose sim price can never reach the shelf: 11 of 11
    the spread the sim produces on day one:  0.28 to 12  = 43x
    the spread the shelf actually shows:     1    to 1   =  1x

**NEWEST DATE WINS, so the eleven ones are right.** 8/15 and 9/4 both postdate 8/11.
Nobody disobeyed him. But the consequence is that the answer he gave on 8/11 is now
unreachable code, and with it the entire idea that **a price moves.** Forty-three times
of spread exists in a module that runs, and one times of it reaches a player.

### AND THAT IS FINE, BECAUSE OF SECTION 0

**EVERYTHING COSTS ONE and A PRICE THAT MOVES cannot both be true of the same number.**
They are both true of the game only if ONE is the unit and the scarcity surfaces
somewhere other than the number. The real record says that is not a compromise, it is
what actually happened everywhere a price was pinned. So the shelf does not need a
second price. It needs the three things a pinned price pushes the scarcity into.

This is the same wall rounds 34 and 35 hit from the other side — sixteen markets and
one price — and it is the first round that can say why the one price is *correct* and
what to build instead of a second one.

---

## 3. THE REAL AISLE: WHAT PEOPLE SAW ON THE FIRST DAY

Four records, and none of them lead with a number.

**ARGENTINA, DECEMBER 2001 — THE CLOSED DOOR AND THE LIMIT.** Dollar accounts frozen,
ATM withdrawals capped at **250 pesos a week**. Within hours, people at their windows
banging pots with spoons — the *cacerolazo*, named for the casserole dish that made the
noise. Then shutters down on branches, pensioners swarming closed banks, supermarkets
looted, and by late December people taking sledgehammers to ATMs. **The first sight was
a door, and the second was a neighbour making noise about it.** Not a price.

**GREECE, 29 JUNE 2015 — THE CARD THAT STOPPED WORKING.** Banks shut, **60 euros a day**
at the machine. Queues at ATMs from the Sunday night before the controls bit. On the
first morning the machines were shuttered until noon; elderly customers without cards
were cut off from their money entirely. Card payments were **not** restricted — and
*"in practice, most retailers were not accepting card transactions on the first
morning."* **The rule said cards work. The shopkeeper said no.** That gap is the whole
first day.

**VENEZUELA, 2016 — THE TAG THAT CAME OFF.** No price tags on goods; you carried the
item to a cashier who calculated it, and it could be twice what it was an hour ago.
Long lines and empty shelves where eggs and toilet paper used to be. And at the
counter, merchants **cleared the food off their scales and weighed the banknotes
instead**, until the scales could not take the weight needed to buy ham. The money was
measured by the kilo, and the goods were measured by the queue. Exactly backwards, and
that is the picture.

**WEIMAR, 1923 — THE PRICE THAT MOVED WHILE YOU SAT THERE.** Prices doubling roughly
every 3.7 days by autumn. Workers paid **twice a day**, at noon and at the end of the
shift, because holding cash overnight lost you part of it. Wives at the factory gate at
midday, wages into a suitcase, straight to the shops before the afternoon repricing.
And the detail that beats every statistic in this record: **restaurants quoted a price
that changed between ordering and paying.**

**THE SHORTAGE-ECONOMY RECORD — THE LINE IS THE PRICE.** Kornai and Weibull modelled
the normal state of a shortage market as a queue. Where the number is pinned, the real
cost is hours: several a day for staples. The line is not the waiting. **The line is the
information** — it tells you something arrived, and it tells you who is ahead of you.

### THE PATTERN, IN ONE SENTENCE

Across all five, the first sight is never *"it costs more."* It is always **something
that used to work and does not.** A door. A card. A tag. A shelf. A rate the clerk
quotes you instead of the one on the wall.

---

## 4. THE GAMES AISLE: WHAT GOES IN FRONT OF A PLAYER BEFORE ANY NUMBER

**Battle Brothers — the campaign layer, and the only reference game with standing on
this question.** Its opening is not a menu of systems: the tutorial **is a short
contract**, a real job with real steps, and the teaching is done by *"individual
characters explaining things and giving their opinions."* Two things it deliberately
does not do: it does not tax you with basics like moving the camera, and it lets you
leave after a few minutes and go anywhere. The pattern worth taking: **the first
economic thing a player touches is a job somebody asked him to do, spoken by a person
with an opinion, and the tutorial is that job rather than a lesson about it.**

(Their own dev blog is the primary source and it is blocked by this session's egress
proxy, so the above rests on the search summary of it and the encyclopedia entry. Said
plainly rather than dressed up as a read.)

**AND THE RULE I AM NOT BREAKING.** The wider design literature on teaching an economy
was searched and it is thin and generic — mostly classroom material and economy-tuning
tooling, one useful line about limiting supply so the shift is felt before it is named.
Nothing there needs a game he has not named, and no such game is entering this design.
The only reference cited above is the campaign layer, which is its department.

---

## 5. THE DELIVERABLE: THE THREE SIGHTS

Each is a consequence of a pinned price, has a real first-day source, has at least one
piece already built in this repo, and contains **no number**. They are for QUESTS
`[first ask]` and RUN `[wake near]`, and they are not mine to implement.

### SIGHT ONE — A PRICE TAG THAT IS NOT THERE
**What he sees.** One row on a shelf with no number on it. To learn what it costs he
has to carry the thing to the person behind the counter, and the person tells him.

**Why.** Venezuela 2016, the tags off, the cashier calculating. This is the sight that
proves the price is pinned, and it is the only one of the three that could not be
guessed from our own design.

**What exists.** `showMarket()` **already has this branch**: when a price comes back
`NO_RULING` the card prints **`unpriced`**. And `scratchpad/q36m.js` measures that
**0 of 11 goods can reach it** — every good got a tag on 9/5. The path is built and
unreachable. The refusal voice is built too: *"nobody has ruled what that costs."*

### SIGHT TWO — A DOOR THAT USED TO OPEN
**What he sees.** A door he can reach, that he watches somebody else come out of, and
that will not open for him. Dark building, dead handle, lit windows one street over.

**Why.** Argentina's shutters and the pensioners at the glass; Greece's closed branch
and the shopkeeper waving off a card the rules said was fine. **The rule says it works.
The door says no.** That gap, not the cap, is what people describe.

**What exists.** 1,490 circuits and 391 live, so 74% dark at boot. `isDark(id)`,
`douse(id)` and `relight(id)` all answer today, and day 2's demo quest exists precisely
because there are houses with doors you can walk into. Nothing needs inventing; it
needs one door that is chosen rather than random.

### SIGHT THREE — SOMEBODY AHEAD OF HIM WHO ALREADY GOT IT
**What he sees.** One other person at the same counter, served first, walking away
holding the thing. No line of forty. **One person, ahead of him, done.**

**Why.** The shortage-economy queue, where the line is the information and not the
wait. And Argentina's answer to why it lands: the second thing anyone saw was a
neighbour. Fourteen rounds of this study say Bohemia's economy is made of people you
keep going back to. The first ten minutes should contain one of them.

**What exists.** 40 agents on a block in the ledger, and the card's own refusal line is
already written and already in his money: *"that is 2 batteries and you have 1
battery."* Today nobody is standing next to him when it prints.

### AND THE TWO CHEQUES, FOR QUESTS `[first ask]`
The first ask does not need to be invented. The table wrote two lines and dropped both:
**the water district is hiring** and **the truck needs gas.** A shift already pays
exactly one (`PAYOUT`: COMPLETE → `{electricity:1}`), and fuel is already a good at
3.75 with 24 days of it left. Both cheques are cashable out of parts that already run.

---

## 6. WHAT THIS ROUND DID NOT DECIDE

- **Which door.** Picking the building is a placement call and belongs to the lane that
  owns the surface.
- **Whether the tagless row is one good or several.** Named as a sight, not a table.
- **Who the neighbour is.** PEOPLE casts people. One person, not a name.
- **Whether the two cheques are one quest or two.** QUESTS' call.
- **Nothing about the opening's words.** 23 lines, 0 digits, and the food strand is the
  best writing in the build. Not a syllable of it should change for this.

---

## 7. ROUTED

- **QUESTS `[first ask]`** — the two cheques. The water district is hiring; the truck
  needs gas. He has already heard both lines. Also: the first economic thing he touches
  should be a job a person asked him to do, per the campaign layer.
- **RUN `[wake near]`** — wake him within sight of all three: a counter with one
  untagged row, a dark door with a lit street behind it, and one person at that counter
  ahead of him. And the opening has to give the game back first; that red is RUN's own.
- **WORLD `[two prices]`** — section 2 is the premise you need. The one price is
  *correct*, and it is a price control. The second price does not belong on the same
  shelf; it belongs behind the closed door. Round 34's `[old price]` is the same door.
- **UI** — a currency display exists nowhere in any surface. Zero hits across three
  files. Not asking for a HUD; reporting that the first number a player ever sees is
  the one on the market card, and only if he finds the market.
- **CUTSCENE** — the work strand and the fuel strand are planted and never answered.
  Two lines, both spoken by family, both dropped at the cut. Not mine to write.
- **PLUMBER** — the comment above `price()` asserts a precondition (*"PURSE.PRICES … is
  still empty"*) that went false on 9/5. Nothing checks a comment's premise against the
  table it describes. This is the third round to land on that class.
- **COORDINATOR** — section 0 is a ruling-level reframe of EVERYTHING COSTS ONE and it
  is in the pendings. It needs his eye, not his permission.

---

## 8. THE GATE NOTE

Ran the lane's subset: economy, payday, purse, attempt, canon rot, demo blockers,
language. Results in the commit.

**And the same hole, round 21 of naming it.** These gates check that a part does what it
says. Nothing checks that two parts agree, that a part keeps working for as long as the
game lasts, that it is the right part to have, or that the parts form a loop that
closes.

This round's instance is the sharpest one yet, because it is fully mechanical and a gate
could have caught it the day it appeared: **`PRICE_SOURCE === 'economy'` is set, and is
unreachable for every key in `PURSE.PRICES`.** A four-line gate — *if a valve is open,
at least one input must be able to reach it* — would have gone red on 9/5 and stayed red.
Instead the sim his own ruling pointed at has been dead for eight days with every gate
green, and 43x of price spread has been sitting one branch away from a player.

Second instance, cheaper: **a `draft:true` scene plants three strands and answers one,**
and nothing counts strands across a cut.

## 9. THE PROBES THAT WERE WRONG, KEPT ON PURPOSE

- `makeLedger()` with no arguments builds a block of 0 people and 0 houses, so every
  stock is 0 or NaN and every `daysLeft` is `Infinity`. It reports eleven nulls and it
  looks like a finding. It is **`makeLedger(seed, nAgents, nHouses)`**.
- `advanceDay(ledger, agents)` returns **flows**, not the ledger, and mutates in place.
  `L = advanceDay(L)` silently replaces your ledger with a flows object.
- `powerMap().circuits` and `.liveCircuits` are **numbers**, not collections.
  `Object.keys()` on them returns empty and reports a dead grid.
- `towns.SEATS` is an object, not an array, and it ships **empty** by design.

Kept because a later round will reach for all four.

---

*ECONOMY round 36. Research only. Nothing in the game changed.*
