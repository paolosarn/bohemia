# DAY 40 — TWO POCKETS, AND NEITHER OF THEM IS THE SHOP.

ECONOMY lane, VAMILY row `[how many pockets]` Q40. MODE: RESEARCH — DO NOT IMPLEMENT.
Round 40. Claimed 9/13/26 `economy-vamily-knxaeh`, commit 4a10023.

> **THE ROW, VERBATIM:** "The minimum number of separate purses a crash economy needs
> before prices bite: from the real record (household, shopkeeper, wholesaler, the
> faction's treasury, the state that is gone) and from the campaign-layer reference only,
> the one he named. Round 33 found ONE purse; WORLD [every pocket] is building the split;
> this answers HOW MANY and which two come first so the lane does not build fifty
> ledgers."

---

## 0. THE ANSWER, FIRST, BECAUSE THE ROW ASKS A COUNTING QUESTION

**TWO new pockets. Fourteen ledgers. And the shop is not one of them.**

    1. THE HOUSEHOLD   the player's purse            1   ALREADY BUILT
    2. THE STATE       a faction treasury           14   the sector that is gone, in a new hat
    3. THE FIRM        the market                    0   *** needs no purse at all ***

The naive read of `[every pocket]` — *"give every person, shop and faction a purse"* —
costs this, measured on seed 7 with the surface's own categoriser:

    factions                                    14
    markets (14 seats + 2 unowned)              16
    blocks                                     478
    people, at the ledger's own 40 a block   19,120
    cells                                     9,216
    ---------------------------------------------
    TOTAL LEDGERS                            28,844

**The row warns against fifty. The naive read is 577 times that.** The three-sector read
builds **14**, and leaves 28,814 ledgers unbuilt.

---

## 1. *** THE FINDING THAT PROVES US WRONG: SIXTEEN MARKETS, ONE WAREHOUSE ***

This round went looking for how many purses and found a missing one of a different kind.

`mktLedger()` on the walked surface:

```js
function mktLedger(){
  if(MKT_LEDGER) return MKT_LEDGER;          // <- never keyed, never reset
  var heads=mktHeads();
  if(!heads) heads=1;
  try{ MKT_LEDGER=BohemiaEconomy.makeLedger(seed, heads, heads); }catch(_e){ MKT_LEDGER=null; }
  return MKT_LEDGER;
}
```

**`MKT_LEDGER` is a singleton.** The hub beside it is keyed and re-resolved
(`MKT_HUB_KEY`), so the game knows perfectly well which market you are standing in — but
**the stock is created once, by whichever market you happened to walk into first, and
every other market in the valley then shares it.** Buying rice in the Mob's fortress
depletes the same barrel as buying rice at a swap meet forty cells away. The water pumps
top up `MKT_LEDGER.stocks.water` for the whole valley into the same singleton.

### AND THAT IS WHY THERE IS ONE PRICE

`price(ledger, good)` in `bohemia_economy.js` is a pure function of stock:

    daysLeft = ledger.stocks[good] / (need * ledger.agents)
    price    = base * scarcityMult(daysLeft)

**One ledger necessarily means one price.** Round 34 measured *"16 hubs, 11 goods, ONE
distinct price"* and diagnosed it as `price()` not taking a hub. That is true and it is
only the top half. **WORLD `[two prices]` could pass a hub to `price()` tomorrow and still
get one number out of both markets, because both would read the same `stocks`.**

**The stock singleton is the real blocker on `[two prices]` and nobody has written it
down.** It is one line — key the ledger the way the hub beside it is already keyed — and
it is the precondition for a row this board has been treating as ready to build.

---

## 2. THE REAL AISLE: HOW MANY SECTORS BEFORE PRICES BITE

The row's question has a literature and the literature agrees with itself from two
different directions.

### THE ACCOUNTING ANSWER: THREE

Godley and Lavoie's **model SIM**, the simplest stock-flow-consistent economy there is,
is closed and has exactly three sectors: **households**, who take wages, pay taxes and
consume; **firms**, who produce and pay wages; and a **government**, which buys output and
collects taxes. **One asset: money.** Everything a household does not consume is held as
cash.

### THE SIMULATION ANSWER: ALSO THREE

The agent-based literature lands in the same place from the other side: **a minimum of
three agent types — households, firms, banks — is sufficient for prices to emerge
endogenously**, with four (adding a government) for a fuller picture. Prices *"evolve from
interaction with neighbours following simple supply and demand rules"*, arising from the
agents rather than being imposed.

**Two independent traditions, one number. Three.**

### AND THE PART THAT DECIDES OUR BUILD: **FIRMS HOLD NO MONEY**

> *"In the SIM model, firms are not modelled explicitly… Total income is paid out to
> households as wages or profits… firms operating as simple intermediaries that don't hold
> independent monetary positions or accumulate net worth."*

The firm is a **pass-through**. It holds goods and it moves money; it does not sit on a
balance. So the minimum is three *sectors* but it is **not** three *purses* — it is **two
purses and a warehouse**.

That is exactly our situation. The shop already has its balance sheet: `ledger.stocks`,
which `advanceDay()` moves and which `mktBuy()` already decrements by one on every
purchase. **The firm sector in Bohemia does not need a pocket. It needs its own barrel,
and there are sixteen shops sharing one.**

### THE SECTOR THAT IS GONE, AND WHAT TOOK ITS PLACE

The row names *"the state that is gone"* as a candidate, and SIM makes that the load-
bearing one: in the simplest model **money exists because the government spends it into
existence and taxes it back out.** No third sector, no money.

In this valley that sector did not vanish, it changed hats. **The faction spends
(buildings mint one battery a day, 9/11 `[batteries mined]`) and the faction collects
(the lights bill at one a night per feeder, the rent, and a collector at your door who
remembers your father).** Both halves of the government's job are already running, with
nowhere for the money to land or come from. **That is the treasury, and it is the one
genuinely missing pocket.**

### THE CAMPAIGN LAYER

Thin, and said plainly rather than dressed up: the searches returned the company's single
crown pool and a daily wage per man, and **no technical account of how many money pools
the game tracks**. What is visible is consistent with the theory — **one purse for the
player, and towns holding goods and prices rather than money.** The wholesaler the row
asks about does not appear as a pocket anywhere I could verify, so it is not proposed
here.

---

## 3. THE DELIVERABLE FOR WORLD `[every pocket]`

> **BUILD TWO, NOT TWENTY-EIGHT THOUSAND, AND BUILD THE TREASURY FIRST.** The minimum
> from both the accounting record and the simulation record is **three sectors**, and in
> the simplest consistent model **the middle one holds no money at all** — firms pass
> income through and hold goods instead. So: the player's purse exists; the market needs
> **stock, not a purse**, and already has stock; and the only genuinely missing pocket is
> **the faction treasury, fourteen of them.** Build that one first, because both halves of
> its job already run with nothing behind them — a faction mints a battery a day off its
> own buildings and takes one a night off your feeder, and neither amount lands anywhere
> or comes from anywhere. Give it a purse on the existing primitive and `credit`/`debit`
> do the rest; the swap that round 33 found built and half-called becomes the one way
> batteries move between any two holders. **Then fix the warehouse, which is a smaller job
> and is blocking more:** `MKT_LEDGER` is a singleton created by whichever market you
> walked into first, so all sixteen share one barrel of rice, and because `price()` is a
> pure function of stock **that singleton is why there is one price in the valley.**
> `[two prices]` cannot work until it is keyed, no matter what arguments `price()` takes.
> **And do not give people, blocks or cells a pocket.** Nineteen thousand households is not
> realism, it is 19,120 ledgers to keep consistent; the record's own minimal model does
> not model firms explicitly and gets prices anyway. People are the firm's and the state's
> inputs, a block is a place and not a pocket, and the moment one of those 28,814 ledgers
> disagrees with the world nothing will ever find it.

### THE ORDER, AND WHY

1. **Split `MKT_LEDGER` per hub.** Smallest, and it unblocks `[two prices]`, which
   several rows are stacked behind. One line against a variable that is already keyed
   next door.
2. **Fourteen faction treasuries.** The missing sector. Both its verbs already run.
3. **Nothing else, until something measured demands it.** Not people, not blocks, not
   cells, not the wholesaler.

---

## 4. WHAT THIS ROUND DID NOT DECIDE

- **What a faction treasury starts with.** A starting balance is a number nobody ruled,
  and MECHANISM-MINE / CONTENTS-PAOLO'S says the table ships empty.
- **Whether a faction can go broke.** The interesting question and not this round's.
- **How a market's stock is sized once it is split.** `mktHeads()` already exists; whether
  a fortress starts deeper than a camp is FACTION-TOWNS' axis and they already own it.
- **Whether people ever get pockets.** Named as *not now*, not as *never*.
- **Anything about the demo.** Rule 14: research rounds continue and never touch it.

---

## 5. ROUTED

- **WORLD `[every pocket]`** — section 3. **Two pockets, fourteen ledgers, treasury first,
  and the shop needs stock rather than a purse.** The row's own "every person, shop and
  faction" reads as 28,844 ledgers when costed.
- **WORLD `[two prices]`** — *** its blocker is not `price()`'s arguments, it is
  `MKT_LEDGER` being a singleton. *** Passing a hub into a price computed from shared
  stock returns the same number twice. This is the most useful thing in the round.
- **FACTIONS** — the faction is the third sector: it already mints and already collects,
  with nothing behind either verb.
- **LIFE + CITY** — the water pumps top up the shared singleton, so every pump in the
  valley fills the same barrel. Same defect, different caller.
- **PLUMBER** — a keyed cache (`MKT_HUB_KEY`) sitting one line above an unkeyed one
  (`MKT_LEDGER`) is a gate-shaped defect: *if two caches describe the same thing, they key
  the same way.*
- **COORDINATOR** — nothing blocking.

---

## 6. THE GATE NOTE

**Pre-push pass** (the gates reading the files in this diff): economy, purse, payday,
attempt, canon rot, demo blockers, language. Results in the commit.

**Full suite unmeasured since f5a0529** — rule 13: THE SUITE LINE is still unposted. No
red is mine; this diff is records, the bank and the board.

**The project-level hole, round 25 of naming it.** These gates check that a part does what
it says. Nothing checks that two parts agree, that a part keeps working for as long as the
game lasts, that it is the right part to have, or that the parts form a loop that closes.

This round's instance is the clearest **"two parts do not agree"** yet: the hub is keyed
per market and the stock is not, in adjacent lines of the same file, and every gate is
green because each half is individually correct. A four-line check — *two caches of the
same subject key the same way* — would have caught it, and instead it has silently made
the whole valley one shop since the day markets were added.

## 7. THE PROBES THAT WERE WRONG, KEPT ON PURPOSE

Three in a row this round, all signature errors, all reported a plausible-looking number:

- **`derive(graph, districts, act)`**, not `derive(m, seed)`. Mine returned `[]` and I
  nearly wrote down "zero town seats".
- **`selectable(graph)`** takes the faction graph, not nothing.
- **`blocksOf(m, cat)` takes a CATEGORISER FUNCTION**, not a category name. Passing a
  string threw; passing an identity function flooded the whole map and reported **14
  blocks** where the real answer is **478**. The surface's own categoriser is
  `bohemia_cityedit.cat`, which buckets to water / road / freeway / rail / mount / open /
  sand.

The standing kept-mistakes list is DAY 36 section 9 and DAY 38 section 1.

---

*ECONOMY round 40. Research only. Nothing in the game changed.*
