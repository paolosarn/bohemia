# DAY 39 — THE COURT WAS NEVER THE MISSING PART. THE BAILIFF WAS.

ECONOMY lane, VAMILY row `[protection court]` Q39. MODE: RESEARCH — DO NOT IMPLEMENT.
Round 39. Claimed 9/13/26 `economy-vamily-knxaeh`, commit 6f08943.

> **THE ROW, VERBATIM:** "How protection became the courts: Volkov on the Russian krysha,
> Gambetta on the Sicilian mafia as a seller of trust, the Lebanese generator cartels
> enforcing their own contracts. What a deal that sticks costs (the cut, in real
> numbers), who pays it, what breaks it, and what happens to the man who goes to the
> other protector. Deliver the mechanic FACTIONS [deal sticks] builds, with the numbers
> as premises."

---

## 0. THE TWO FINDINGS THAT PROVE US WRONG

### ONE. *** RUSSIA HAD COURTS. THEY WORKED. THAT IS NOT WHY THE KRYSHA EXISTED. ***

The row's own title is "how protection became the courts", and FACTIONS' `[deal sticks]`
row says *"the valley has no courts"* and reasons from there. The record says the
premise is wrong in the most useful possible way:

> The Russian Federation **had a system of arbitration courts that were reasonably well
> organized and effective at coming to agreements**, but were **much less successful at
> obtaining settlements after rulings**, because the losing party could hide assets
> across bank accounts or transfer them to friends and family.

**The judge was not missing. The bailiff was.** The krysha's product was never the
verdict. It was somebody who would actually make the loser pay.

That reframes the whole job. *"A faction rules on your dispute"* is the wrong mechanic and
the boring one: it is a menu that tells you who was right. **The right one is that
somebody goes and gets it.** A ruling nobody can collect is what the valley already has
for free — round 26 measured `wouldSquare()`, a function that answers what would settle a
grievance, with nothing anywhere that makes the settling happen.

### TWO. YOU DO NOT GO TO YOUR PROTECTOR. YOUR PROTECTOR GOES TO THEIRS.

The mechanism has a name and it is not a courtroom. It is a **strelka**:

> A form of arbitration where companies in dispute would **both send their krysha** to
> negotiate an agreement, which would then become **binding for both companies**. It was
> common for the gangs to have **several of these meetings daily**, and the **majority of
> them ended peacefully.** All protection rackets were obligated to go to strelkas to
> represent their companies, and **success depended on each gang's reputation**, as well
> as the ability to read the situation for potential violence.

Three things in that paragraph, all of them mechanics:

1. **The player is not in the room.** You buy a roof; the roof argues for you. That is
   a much better game object than a courtroom scene, and it is the thing Gambetta named:
   what is sold *"is not violence, but protection"* — a guarantee of safe conduct for
   parties to a transaction, and violence is only one of the means.
2. **It is binding on both, and it mostly ends peacefully.** Several a day. This is
   routine civil administration performed by gangsters, not a shootout.
3. **It is decided by whose roof is bigger, not by who is right.** Reputation, plus
   reading the room. *Justice is not a variable in this system, and pretending it is
   would be the unrealistic choice.*

---

## 1. WHAT WE HAVE TODAY (measured before researching)

### THE VALLEY HAS FIVE OBLIGATION SYSTEMS AND **EVERY ONE OF THEM POINTS AT THE PLAYER**

| module | the call | who owes whom |
|---|---|---|
| `bohemia_favour.js` | `owedOf(save, fid)` | **the player** owes a faction |
| `bohemia_favour.js` | `settle(3)` | **the player** squares it |
| `bohemia_standing.js` | `makeRight(mind, actorId, opts)` | **the player** makes it right |
| `bohemia_towns.js` | `owedTo(book)` | nights **the player** owes |
| `bohemia_towns.js` | `collectorAt(2)` | somebody at **the player's** door |

**There is no deal between two other parties anywhere in the game, so there is nothing
for a third party to enforce.** This is round 33's one-purse wall wearing its ninth set
of clothes, and it is the honest blocker on `[deal sticks]`: a protector needs two people
with something between them, and the valley currently has one person with something
between him and everybody.

Under front-page rule 12 (a dependency is a premise, not a gate) I measured whether
`[deal sticks]` really needs WORLD `[every pocket]` first, as its row says. **The
enforcement half genuinely does not** — a faction can side with somebody, refuse somebody,
and remember, with no money moving at all. **The cut does.** A protector who cannot be
paid is a favour, and a favour is already built.

### AND FOUR PIECES OF THE MECHANIC ARE ALREADY IN THE FILES

**`bohemia_commitment.js` already answers "what happens to the man who goes to the other
protector", and answers it better than the search results did.** Three stages:

    none    "NOTHING SAID"        ceiling 5  reaches USEFUL   blocks COUNTED  neglect 0
    sided   "YOU TOOK A SIDE"     ceiling 9  reaches COUNTED  blocks INSIDE   neglect 1
    burned  "YOU BURNED A BRIDGE" no ceiling reaches INSIDE   no block        neglect 2

> **burned:** *"You cost yourself somewhere else to be here. **This is the one that cannot
> be walked back.**"*

**That is the price of changing roofs, already written, already tied to a ceiling on how
far you can ever get with anybody else.** Nothing needs inventing.

**`commitment.tertius(standings, heard)`** is Simmel's *tertius gaudens* built into the
engine, and it is the market structure of protection:

- `gaudens` — **"YOU ARE THE ONLY ROUTE BETWEEN THEM"**: the outfits you stand with have
  no line to each other, *"and that is worth more than either standing."*
- `dolens` — **"BOTH SIDES CAN SEE YOU"**: they are connected, so the position that would
  have made you the only route makes you the person both of them are watching.

**That is a strelka's outcome table, written before anybody had read about strelkas.**

**`commitment.LANDING`** already models how news of what you did reaches a faction: `direct`
("AS FACT"), `secondhand` ("AS A RUMOUR"), `silent` ("NOT AT ALL"). Reputation is the
currency of the strelka, and its transmission is built.

**`favour.GIVES['you-give-first']`** already gates asking at **`fromRung: 'COUNTED'`**
(index 3) — *"NOT YET. THEY DO NOT KNOW YOU WELL ENOUGH TO OWE YOU ANYTHING."* The same
rung round 38 landed on for the old-price door. **COUNTED is already this game's threshold
for "they will do something for you", in two independent modules, arrived at twice.**

### THE NUMBERS WE ALREADY CHARGE

`PAYOUT.COMPLETE = {electricity: 1}` — a day of work pays one battery.
`FAVOUR_SIZE = 1`. `STANDING_COST = 1`. `PER_SITE_PER_DAY = 1`. And the lights bill is
one battery a night per feeder. **Everything in this game is already one.**

---

## 2. THE REAL AISLE: WHAT A ROOF COSTS AND WHAT IT SELLS

### THE PRICE, IN REAL NUMBERS

| | who paid | the cut |
|---|---|---|
| **Russia, 1990s** | **70-80% of firms** | **10-20% of profits** (some accounts to 30%) |
| **Sicily, construction** | | **2-5% of revenue, per job** |
| **Sicily, retail** | ~**70% of businesses** | **€457 a month** |
| **Sicily, hotels/restaurants** | | **€578 a month** |
| **Sicily, construction (flat)** | | **€2,000+ a month** |

Palermo alone was extorted of **more than €160 million a year** in 2008; Sicily as a whole
about ten times that.

Two structures, and the difference matters more than the rates: **Russia charged a share
of PROFIT. Sicily mostly charged a FLAT MONTHLY, and only construction a per-job share.**
A share of profit needs books and an auditor. A flat monthly needs a calendar. A per-job
share needs only the job. **The simplest to enforce is the one that spread furthest.**

### WHAT THE MONEY ACTUALLY BOUGHT

Not muscle. The service list, from the same sources, is a small legal system:

> **contract enforcement, debt collection, vetting of business partners, arbitration of
> business disputes**, information gathering, taxation, help navigating the bureaucracy,
> **loans**, and the creation of problems for rival businesses.

Gambetta's framing is the one to keep: the Mafia is a **commercial identity** selling
protection as *"a particular trademark of the protection industry"*, and the product
exists because **trust is scarce**. Its inputs are **intelligence and secrecy, violence,
and market reputation** — and reputation is **transferable**, which is what makes it a
brand rather than a threat.

### LEBANON: TERRITORY FIRST, CUSTOMERS SECOND

The generator owners *"negotiate control over territorial areas with one another,
preventing competition"*, producing **effectively unregulated micro-monopolies** they
extract rent from, coordinated through a syndicate with relationships inside the state.
Thirteen importing companies formed an informal cartel over the diesel the generators run
on.

And the fights are the tell: **turf wars including gun battles in Tripoli and Beirut —
over CUSTOMERS.** They do not fight over the price. They fight over who a street belongs
to. That is the same shape as our own map, where all 9,216 cells are already held by
fourteen factions.

### WHAT BREAKS IT

**Addiopizzo, 2005**: not police, not courts. A group of young professionals in Palermo
invented a **label certifying that a business does not pay**, so customers could choose
them. The counter to a protection racket in the record is **a visible mark of not paying,
and enough people who care about it.** That is a standing mechanic, not a combat one.

### THE ONE THING THE RECORD WOULD NOT GIVE ME

**What happens to the firm that switches roofs is thin in the sources**, and rather than
dress up an inference, I will say so: the searches returned the system's structure and its
prices, and nothing solid on the defector's punishment. **Our own `commitment.js` already
answers it** (`burned`: cannot be walked back), and the structural argument from the
strelka supports that shape — in a system settled by roof-against-roof, a firm without a
roof has no representative in the room at all. But the number is not in the record and is
not invented here.

---

## 3. THE DELIVERABLE FOR FACTIONS `[deal sticks]`

> **THE FACTION IS NOT THE JUDGE. IT IS THE BAILIFF.** Do not build a ruling; build a
> collection. A deal struck on a block a faction holds can be **witnessed** by that
> faction for **one battery**, and what the battery buys is that when the other side does
> not deliver, **they come after the other side and not after you.** That is the whole
> product and it is Gambetta's: not violence, a guarantee of safe conduct. **The cut is
> one battery per deal witnessed, and never a percentage** — every real rate (10%, 20%,
> 30%, 2%, 5%) turns a one-battery day into a fraction this game cannot say, and inverted
> the krysha's own rate reads as **one battery every five to ten days of work**, which is
> the right order of magnitude and roughly a tenth of what the lights already cost.
> **A bigger faction sells more deals, not a dearer one** — depth, which is the axis
> FACTION-TOWNS already uses to make a fortress eleven goods and a camp four. **When two
> witnessed parties dispute, the player is not in the room:** each side's faction meets,
> the result is binding on both, it ends peacefully far more often than not, and it is
> decided by whose standing is bigger, not by who was right. `commitment.tertius()`
> already returns that table — **the only route between them** if the two factions have no
> line to each other, **both sides watching you** if they do. **Switching protector costs
> what `commitment.js` already charges:** `burned`, *"you cost yourself somewhere else to
> be here, this is the one that cannot be walked back."* Nothing new to invent for the
> price of defection. And **the counter is a mark, not a fight**: Sicily's answer to the
> pizzo was a label saying who does not pay and customers who cared, which is standing,
> which this repo already has.

### WHAT IS ACTUALLY BLOCKED, MEASURED RATHER THAN ASSUMED (rule 12)

- **The enforcement is NOT blocked.** Siding, refusing, remembering, and the strelka's
  outcome all run on `standing`, `commitment` and the faction graph, which exist today.
- **The cut IS blocked.** One battery has to move from a person to a faction, and there is
  exactly one purse in the game. WORLD `[every pocket]` is the real dependency for the
  money and for nothing else.
- **The deal itself is blocked and nobody has said so.** There is no object in the game
  representing an agreement between two parties. Five obligation systems, all
  player-shaped. **A protector with nothing to protect is a favour, and favours are
  built.** This is the first thing `[deal sticks]` needs and it is smaller than either.

---

## 4. WHAT THIS ROUND DID NOT DECIDE

- **What the faction does to the party that breaks a deal.** Named as collection, not as
  an act. The act has teeth and belongs to whoever owns the faction surface.
- **Whether the player can sell protection.** Pending 35 already asks whether he can ever
  be the one collecting; this round does not answer it.
- **Whether a strelka can be lost.** The record says reputation decides. Which of ours it
  reads is FACTIONS' call.
- **The defector's number.** The record is thin and `commitment.js` already has the shape.
- **Anything about the demo.** Rule 14: research rounds continue and never touch it.

---

## 5. ROUTED

- **FACTIONS `[deal sticks]`** — section 3. Headline: **build the bailiff, not the judge**,
  one battery a deal, and the dispute is roof against roof with the player out of the room.
- **FACTIONS / PEOPLE** — `commitment.tertius()` is a strelka outcome table already
  written. `burned` is the defection price already written. Both are being pointed at,
  not changed.
- **WORLD `[every pocket]`** — confirmed as the real blocker for the **cut** and for
  nothing else in this row. The enforcement can land first, exactly as the row guessed.
- **WORLD / QUESTS** — **the missing object is a DEAL between two parties.** Smaller than
  every pocket, and half this board is waiting behind it without saying so.
- **UI** — "they will come after him, not you" is the sentence the offer card has to carry,
  and it is a promise, which rule 14(d) says must do something or be removed.
- **COORDINATOR** — the `[deal sticks]` row reasons from *"the valley has no courts"*.
  Section 0 says the courts were never the point. Worth a line on that row so the lane
  does not build a verdict screen.

---

## 6. THE GATE NOTE

**Pre-push pass** (the gates reading the files in this diff): economy, purse, payday,
attempt, canon rot, demo blockers, language. Results in the commit.

**Full suite unmeasured since d885b1f** — rule 13: THE SUITE LINE is still unposted. No red
is mine; this diff is records, the bank and the board.

### AND A BOARD DEFECT WORTH MORE THAN THE GATE NOTE

**Round 38's SHIPPED line was silently reverted.** `ae12177` (UI `[no slop]` round 7)
rewrote `VAMILY.md` from a pre-`a238ff9` copy and rolled back **16 board lines**, five of
them live status words: `[freeway reads]`, `[streets read]`, `[city from above]`,
`[old price]` (mine) and `[suite runs]`. The round 38 record and all 542 bank lines were
never touched — **only the board word**, which is the one thing another lane reads to know
what is done.

Three lanes' lines self-healed when those lanes next ran. Mine was restored in `6f08943`,
touching only ECONOMY's own two lines per rule 10. **`[streets read]` is still showing
CLAIMED on main when it had been SHIPPED**, and it is DIRECTION's to fix, not mine.

**The project-level hole, round 24 of naming it**, and this is the widest instance yet
because it is not code at all: nothing checks that a commit touching the board preserves
every other lane's status words. A lane that rebases `VAMILY.md` from a stale copy
un-ships other people's finished work, and the only reason it was caught is that I
happened to re-read my own line.

---

*ECONOMY round 39. Research only. Nothing in the game changed.*
