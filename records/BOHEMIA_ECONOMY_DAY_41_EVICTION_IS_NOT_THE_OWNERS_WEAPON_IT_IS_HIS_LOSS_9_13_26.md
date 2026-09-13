# DAY 41 — EVICTION IS NOT THE OWNER'S WEAPON. IT IS HIS LOSS.

ECONOMY lane, VAMILY row `[who replaces you]` Q41. MODE: RESEARCH — DO NOT IMPLEMENT.
Round 41. Claimed 9/13/26 `economy-vamily-knxaeh`, commit fac6a6d.

> **THE ROW, VERBATIM:** "The owner's side of the strike: how landlords, generator owners
> and slumlords actually replace a non-payer where there are no courts (eviction by
> muscle, the reconnection fee, the waiting list, the squatter who moves in the same
> night), from Lebanon's generator cartels, Lagos, Caracas and the 1915 Glasgow landlords
> who lost. Deliver the owner's four moves and what each costs, so WORLD [block strikes]
> has both sides."

---

## 0. THE FINDING THAT PROVES US WRONG

The row's title is *"who replaces you"*, and round 35 — this lane's own — framed the
landlord's power as the ability to replace a non-payer. Both assume **eviction is the
owner's weapon.**

The numbers say it is his single most expensive act, and he loses money every time.

    turnover, industry range     ONE TO THREE MONTHS of rent   (avg ~$2,500 a unit)
    an eviction, all-in          $3,500 to $10,000, over 2-3 months
    days to re-let, Q1 2024      46 DAYS on average
    one month empty              8-10% of that unit's ANNUAL income
    lost rent as a share of it   35-50% of the whole turnover cost

Converted to our own ladder, where the lights are **one battery a night per feeder** and a
day of work pays **one** — so a month of rent is thirty batteries and thirty days of a
person's labour:

    to replace a tenant costs the owner   30 to 90 batteries
    plus the unit sitting empty           46 more nights unbilled
    -------------------------------------------------------------
    total                                 30 to 136 batteries

**Against a tenant who owes one.** That is **thirty to a hundred and thirty-six times the
debt.**

**The owner does not want to replace you. He wants you to pay.** Eviction is what he does
when he has already lost, and every real landlord in the record knows it. That is why the
Glasgow landlords, when the evictions failed, **stopped trying to evict and started suing
for the money instead** — they were chasing the arrears, not the flat.

This is the other half of round 35, and it is sharper than round 35 was. Round 35 said *a
landlord loses when he cannot replace you.* **He loses when he replaces you too.** So the
block's weapon in `[block strikes]` is not "make replacement impossible" — the arithmetic
already makes it ruinous. The weapon is **making him look at that arithmetic.**

---

## 1. THE OWNER'S FOUR MOVES, WITH WHAT EACH COSTS

### MOVE 1 — CUT THE SERVICE. **Costs him nothing. This is the real one.**

The generator owner's move, and the only one on this list that does not create a vacancy.
It costs the owner nothing to perform, it stops his own income while it is off, and
**the money is not in the cut, it is in the fee to turn it back on.**

Lebanon's generator sector is *"almost no regulation and monitoring"*, with owners
*"imposing higher fees than they should and not respecting prices imposed by the energy
ministry"*, operating **territorial micro-monopolies** they negotiated with each other.
Where there is no competitor on your street, being cut off has exactly one remedy and he
sets its price.

**(No standardised reconnection figure is publicly documented for Lebanon's private
generators, and I looked twice. Saying so rather than inventing one. The structure is
documented; the number is not.)**

**In our code this move is BUILT AND FREE:**

```js
/* AND BACK ON. Nothing calls this yet: what it costs to get your lights
   back is a price, and prices are Paolo's. */
relight:function(id){ if(dark[id]){ delete dark[id]; return true; } return false; },
```

**`relight()` takes no payment and has zero callers.** Its comment is honest and is now out
of date: **EVERYTHING COSTS ONE (8/15) already answers what it costs.** The owner's
cheapest, most profitable and most historically accurate move is sitting in the engine
with the price left blank.

### MOVE 2 — PUT SOMEBODY ELSE IN. **30 to 136 batteries. Thirty to a hundred times the debt.**

Section 0. One to three months of rent in turnover, forty-six days to re-let, and a single
empty month costs eight to ten percent of the year on that unit.

This is the move Glasgow attacked and it is why attacking it worked. **Picketing an empty
house does not deny the landlord a tenant so much as it freezes him inside the most
expensive minute of his business.**

### MOVE 3 — GO FOR THE MONEY INSTEAD OF THE PERSON. **Needs a court, and that is the tell.**

Glasgow's sequence is the cleanest documented version of an owner running out of options:

1. Landlords employed **factors** — generally solicitors — who went to the **Sheriff
   Court** for a warrant giving authority to evict.
2. **Sheriff officers** served the writs and carried out the evictions.
3. When direct eviction proved ineffective, *"the landlords changed their tactics and
   attempted to pursue tenants through the small claims court."*
4. **Eighteen munitions workers** were summoned for non-payment. On the day of the
   hearing **ten thousand protesters** came to the courthouse. Charges dropped, rents
   frozen.

**Move 3 is the move that needs an institution, and it is the one that lost.** Round 39
found the same thing from the other end: in Russia the courts existed, made good rulings,
and could not collect. **A judgment is the weakest instrument in this whole list, in both
records, eighty years apart.**

### MOVE 4 — SEND MUSCLE. **Costs money, and it makes you the story.**

Lagos is the documented extreme: demolitions carried out by security forces *"backed by
unidentified militia widely known as 'area boys' armed with machetes, guns and axes"*,
with excavators and heavily armed task force officers, *"without adequate consultation,
notice or resettlement."*

And what beat it in Glasgow was cheaper than it and better organised:

> **In each tenement one woman would keep watch, and on the approach of bailiffs she would
> ring a bell or a rattle, bringing the other women out to resist them.** Sheriff officers
> were barred from entering their communities.

**One person on watch, and a noise.** That is the counter to move 4 in the record, and it
costs the block nothing but attention.

### THE ORDER THE RECORD PUTS THEM IN

**Cheap to dear, and every owner walks it in the same direction:** cut the service, then
try to replace, then sue for the money, then send men. **An owner who has reached move
four has lost three times already.**

---

## 2. WHAT WE HAVE TODAY

| the move | in our code | state |
|---|---|---|
| 1. cut the service | `douse(id)`, `isDark(id)` | **built and called** |
| 1b. the reconnection fee | `relight(id)` | **built, free, ZERO callers** |
| 2. replace the tenant | *nothing* | **no way to put a new tenant in** |
| 3. sue for the money | `owedTo(book)`, `collectorAt(2)` | points at the player only |
| 4. send muscle | *nothing on this axis* | — |

The grid on seed 7: **1,490 circuits, 391 live.** `payTo`, `holderAt` and `holdings` all
answer, so the owner of a cut circuit is known.

And the bill is real: `rentOn(2)`, `rentAhead(3)`, `rentShape(2)`, `owedTo(1)`,
`collectorAt(2)`, with the collector's own words already written — *"YOUR FATHER WENT A
NIGHT WITHOUT PAYING THEM. THEY REMEMBER"* and *"THE DEBT DIED WITH HIM. THEY DID NOT."*

**So the owner can already cut you off, and cannot yet charge you to come back, cannot
replace you, and cannot chase anybody but the player.** Move 1's profitable half and all
of move 2 are missing, and move 1b is one number.

---

## 3. THE DELIVERABLE FOR WORLD `[block strikes]`

> **BUILD THE RECONNECTION FEE FIRST, BECAUSE IT IS ONE NUMBER AND IT IS THE OWNER'S BEST
> MOVE.** `relight()` already exists, already refuses when a circuit was not dark, and
> takes no payment; **EVERYTHING COSTS ONE says it costs one battery**, and the comment
> saying the price is unruled has been out of date since 8/15. That single change makes
> going dark a door rather than a cliff and gives the owner a move that costs him nothing
> — which is the move the real record says he reaches for first. **Then price move two
> honestly and let the player see it: replacing a tenant costs the owner between thirty
> and a hundred and thirty-six batteries** (one to three months of turnover plus
> forty-six nights empty, converted at our one-a-night bill) **against a debt of one.**
> A strike works not because the owner *cannot* replace the block but because **replacing
> it costs him a hundred times what forgiving it does**, and the block's real weapon is
> making that arithmetic unavoidable — Glasgow's picket of the empty house froze the
> landlord inside the most expensive minute of his business. **Do not build a court.**
> Move three is the one that needed an institution and it is the one that lost, in Glasgow
> in 1915 and in Russia in the 1990s, and round 39 already found the collection is what
> matters and the ruling never was. **And give the block move four's counter for free:**
> one person on watch and a noise brought a whole close out in Glasgow, cost nothing, and
> is the cheapest mechanic on this page. **The owner's ladder is cut, replace, sue, send
> men, and it runs cheap to dear — an owner on the fourth rung has already lost three
> times.**

---

## 4. WHAT THIS ROUND DID NOT DECIDE

- **What the reconnection fee actually is.** One is the argument from his own law, not a
  ruling I can take.
- **Who the replacement tenant is.** A person, and PEOPLE casts people.
- **Whether the player can ever be the owner.** Pending 35 already carries it.
- **Whether muscle exists as a verb at all.** Naming it as the fourth rung is not the same
  as proposing it.
- **Anything about the demo.** Rule 14: research rounds continue and never touch it.

---

## 5. ROUTED

- **WORLD `[block strikes]`** — section 3. **Eviction is the owner's loss, not his weapon**,
  at 30x to 136x the debt, and the strike works on the arithmetic rather than on denial.
- **WORLD `[debt carried]` / `[lights bill]`** — **`relight()` is free and uncalled.** One
  number, his own law already supplies it, and it is the owner's first move in the record.
- **FACTIONS** — the owner's ladder is cut, replace, sue, send men, cheap to dear. A
  faction that reaches the fourth rung has lost three times, which is a posture, not a
  combat trigger.
- **PEOPLE** — move 2 has no mechanism: nothing anywhere can put a new tenant in a place.
  Naming it, not asking for it.
- **LIFE + CITY** — Glasgow's counter is one person on watch and a noise. Cheapest mechanic
  in this record and it is a block behaviour, not a fight.
- **COORDINATOR** — nine of this lane's pendings were ruled on 9/13 and the ruling file is
  read and honoured here; ruling 6 (**a broken promise costs exclusion, not seizure**) is
  independently confirmed by this round's numbers, because seizure costs the owner thirty
  to a hundred times what exclusion does.

---

## 6. THE GATE NOTE

**Pre-push pass** (the gates reading the files in this diff): economy, purse, payday,
attempt, canon rot, demo blockers, language. Results in the commit.

**Full suite unmeasured since 61e935f** — rule 13: THE SUITE LINE is still unposted. No red
is mine; this diff is records, the bank and the board.

**The project-level hole, round 26 of naming it.** These gates check that a part does what
it says. Nothing checks that two parts agree, that a part keeps working for as long as the
game lasts, that it is the right part to have, or that the parts form a loop that closes.

This round's instance: **`relight()` carries a comment saying its price is unruled, and the
ruling that prices it landed on 8/15**, before the function was written. Nothing anywhere
re-reads a comment against the law it cites. Round 38 found the same class on `price()`
(a comment asserting `PURSE.PRICES` was empty, months after it was filled). **Twice in
four rounds, both times a true sentence that quietly went false.**

## 7. WHAT THE RECORD WOULD NOT GIVE ME

Two gaps, stated rather than filled:

- **No published reconnection fee for Lebanon's private generators.** The cartel structure,
  the unregulated pricing and the territorial monopolies are all documented; the number is
  not, and it very likely varies by operator with nothing forcing it into daylight.
- **No costed account of same-day tenant replacement in Lagos.** The violence of the
  evictions is documented in detail; what the landlord pays for it, and how fast the room
  refills, is not in what I could reach. The turnover economics in section 0 are
  US-market figures and are labelled as such — they are the best-measured version of the
  same arithmetic, not a claim about Lagos.

---

*ECONOMY round 41. Research only. Nothing in the game changed.*
