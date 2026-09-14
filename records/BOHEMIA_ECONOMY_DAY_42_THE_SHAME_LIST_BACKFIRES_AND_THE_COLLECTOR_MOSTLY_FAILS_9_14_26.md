# DAY 42 — THE SHAME LIST BACKFIRES, AND THE COLLECTOR MOSTLY FAILS.

ECONOMY lane, VAMILY row `[the bailiff]` Q42. MODE: RESEARCH — DO NOT IMPLEMENT.
Round 42. Claimed 9/14/26 `economy-vamily-knxaeh`, commit 7efb22c.

> **THE ROW, VERBATIM:** "How a debt actually gets collected where there are no courts:
> the repo man, the collector's visit, the Lebanese generator cut-off and its
> reconnection fee, the shame list on the wall, the relative who answers for you. What
> each costs the collector, what makes a debtor pay, and what happens when the whole
> street owes. Feeds WORLD [debt carried]'s collector and the ruling that a broken promise
> costs exclusion."

---

## 0. THE TWO FINDINGS THAT PROVE US WRONG

### ONE. *** THE SHAME LIST BACKFIRES, AND IT IS THE BEST-MEASURED THING IN THE ROUND. ***

The row names *"the shame list on the wall"* as one of the collector's tools. The
management-science work on exactly that tactic finds the opposite of what everyone
assumes:

> **A social-shaming tactic that targets delinquent borrowers' social circles backfires
> and substantially increases the borrowers' default rate.** Borrowers with better outside
> options for credit and male borrowers **respond more strongly** after being shamed —
> **angered borrowers retaliate by defaulting.**

And in the same literature, from the other side of the same moment:

> **Joint-liability loans are so strongly enforced by social pressure that other collection
> methods are rarely needed.**

**Both are true, and the difference is WHEN.** Social pressure is enormously effective
*before* a default and counterproductive *after* one. **The shame list is a deterrent, not
a collection.** Put a man's name on the wall after he has already missed and you have not
made him pay, you have made him angry and freed him of the last reason to.

That is a design rule, not a footnote: **in Bohemia the wall should be something a person
can see coming and avoid, and it must never be the thing that happens to him once he is
already short.**

### TWO. THE COLLECTOR MOSTLY DOES NOT COLLECT.

    contingency fee, debt under 90 days      25-35% of what is recovered
    contingency fee, debt over a year        40-50%
    contingency fee, balance under $500      35-45%
    *** typical recovery rate ***            20-30%
    a repo agent's fee, per car              $275-$375, FLAT, win or lose
    early-stage collection, per account      often a FLAT $50-300

**A professional collector succeeds between a fifth and a third of the time.** At 25% he
knocks four times to get paid once. And he is paid **per attempt** on the flat models and
takes nearly half the debt on the small ones.

Against our own ladder a percentage is unsayable again — 35% of one battery is 0.35, the
same wall rounds 38 and 41 hit — **but the flat fee and the failure rate are perfectly
sayable, and they are the better half anyway.** A visit costs one. He succeeds one visit in
four. **So collecting a debt of one costs about four**, and that is round 41's arithmetic
arriving from the opposite direction, where eviction cost the owner 30x to 136x the debt.

**Three rounds, three different mechanisms, one shape: in a crash, enforcement costs more
than the thing being enforced.** That is why exclusion wins, and it is why the
coordinator's ruling 6 (**a broken promise costs exclusion, not seizure**) is right for a
reason nobody had written down.

---

## 1. WHAT WE HAVE TODAY

### *** THE BAILIFF'S LADDER IS BUILT, AND DEBT IS NOT ONE OF ITS INPUTS. ***

`engine/bohemia_against.js` carries a four-rung escalation, bundled into three levels:

    SIGNS   watch -> follow -> refuse -> block
    cold    watch
    hostile watch, follow, refuse
    war     watch, follow, refuse, block

    SIGN_WORDS
      watch   "THEY ARE WATCHING YOU"
      follow  "THEY ARE KEEPING NEAR YOU"
      refuse  "THEY WILL NOT DEAL WITH YOU"
      block   "THEY ARE STANDING IN THE WAY"

That is a collector's ladder, written by another lane for another reason, and **its own
source already reserved the debt rung by name**:

> *"`refuse` is deliberately NOT among them: **withholding trade is what an unpaid landlord
> does (`[block rent]`)**, not what a stranger on a street earns."*

**Somebody wrote down, in the file, that `refuse` belongs to the unpaid landlord — and
nothing wired it.** `read(facts)` takes `{rel, rung, coalition, roving, crossing}`. **There
is no `owed` field.** You can owe a faction every night of rent you have ever been billed
and not one sign changes.

### AND THE COLLECTOR KNOCKS AND CANNOT DO ANYTHING

```js
function collectorAt(book, gen) {
  var list = owedTo(book);
  if (!list.length) return null;
  var top = list[0];
  return { faction: top.faction, nights: top.nights, gen: gen | 0,
           others: list.length - 1,
           came: COLLECTOR.came, what: ..., still: COLLECTOR.still, draft: true };
}
```

**It returns four sentences and a count.** No sign, no refusal, no consequence. The words
are excellent — *"SOMEBODY IS AT THE DOOR AND THEY ARE NOT HERE FOR YOU"*, *"YOUR FATHER
WENT A NIGHT WITHOUT PAYING THEM. THEY REMEMBER"*, *"THE DEBT DIED WITH HIM. THEY DID
NOT"* — and they are a notification, not a collection.

**One caller**, on the city surface. `owedTo(book)` has two.

### SO, MOVE BY MOVE

| the row's tool | in our code | state |
|---|---|---|
| the collector's visit | `collectorAt(2)` | **built: it says things and does nothing** |
| the cut-off | `douse`, `isDark` | built and called |
| the reconnection fee | `relight` | **built, free, zero callers** (round 41) |
| withholding trade | `refuse` sign | **built, reserved for this by name, not wired to debt** |
| the shame list | — | nothing, and section 0 says be careful what you wish for |
| the relative who answers | — | nothing |

---

## 2. THE REAL AISLE

### WHAT MAKES A DEBTOR PAY

Not force. **Relationship.** The literature on informal borrowing is blunt about the
mechanism: defaulted loans *"constitute a violation of trust and damage social
relationships"*, the act of borrowing itself carries *"social awkwardness, embarrassment
and discomfort"*, and **community norms can pressure a borrower into repaying money the
lender never expected back.**

Community members in microcredit settings *"are willing to discourage borrowing and enforce
debt repayment through shame and ostracism"* — and that is the deterrent half, working
exactly as advertised, before anyone has missed.

### THE RELATIVE WHO ANSWERS FOR YOU, AND WHY ITS INVENTOR WALKED AWAY

Joint liability is the strongest version of "somebody else answers": small groups are
responsible for each other's repayment, **a group is in default when even one member does
not repay, and all members are denied subsequent loans.**

It works, and then it eats itself:

- **Contagion.** A member who defaults *"purely due to his or her own project setbacks"*
  generates a negative effect that **may bring other people down with a certain
  probability.**
- **And it gets worse with size.** If the group is homogeneous, **adding members eventually
  drives the probability of default toward 1.**
- **Grameen itself moved.** A number of leading lenders went from joint liability to
  individual lending, and **Grameen II members are not obliged to pay a member's loan when
  that member fails to.** The institution that invented the mechanism took it back out.

### WHAT HAPPENS WHEN THE WHOLE STREET OWES

The row's third question, and the literature answers it directly: **contagion, and the
bigger and more alike the street, the more certainly it all goes under together.** Nobody
collects from a street that all owes the same person. That is the same fact round 35 found
from the tenants' side at Glasgow and round 41 found from the owner's side in the turnover
arithmetic. **Three rounds, one conclusion: a debt that everybody on a street shares stops
being a debt and becomes a standoff.**

### WHAT THE RECORD WOULD NOT GIVE ME

**Still no published reconnection fee for Lebanon's private generators** — I looked again
this round after flagging it last round, and the cartel structure and unregulated pricing
are documented while the number is not. The row names it; the record does not carry it.
Saying so twice rather than inventing it once.

---

## 3. THE DELIVERABLE FOR WORLD `[debt carried]`

> **THE COLLECTOR ALREADY HAS A LADDER AND IT IS IN ANOTHER FILE.** `bohemia_against.js`
> carries `watch -> follow -> refuse -> block`, with a sentence written for each, and its
> own comment reserves **`refuse`** for exactly this case in exactly these words:
> *withholding trade is what an unpaid landlord does.* Nothing wired it, because `read()`
> takes no `owed`. **Add debt as an input to the signs and the collector stops being a
> card that says things:** a night owed earns `watch`, more nights earn `follow`, and a
> standing debt earns **`refuse` — "THEY WILL NOT DEAL WITH YOU"**, which is the
> coordinator's ruling 6 (**exclusion, not seizure**) expressed in a mechanism that already
> exists and already has words. **Never grant `block` for a debt**: that sign lives on
> `war` and no unpaid rent should put a faction at war with a person. **Price the visit,
> not the debt.** A real collector is paid a flat fee per attempt and recovers only
> **20-30%** of what he chases, so **a visit costs one and succeeds one time in four** —
> which means chasing a debt of one costs about four, and a faction that keeps sending
> somebody is losing money on purpose, exactly as round 41's landlord is. That is the
> honest reason exclusion beats force, and it is the same shape for the third round
> running. **And do not build the shame list as a collection.** The single best-measured
> tactic in this literature **backfires**: naming a delinquent to his social circle
> substantially raises his default rate because angry borrowers retaliate. If a wall of
> names ever ships, it must be something a person sees before he misses, never the
> consequence of having missed. **Somebody else answering for you is the strongest
> mechanism here and the most dangerous:** joint liability is so effective that other
> collection is rarely needed, and it spreads one man's failure through a whole group with
> a probability that rises with group size until default is near certain — which is why
> Grameen itself stopped obliging members to cover each other. **If the valley ever gets
> it, cap the group hard and let the contagion be visible**, because the contagion is the
> interesting part and the trap at the same time.

---

## 4. WHAT THIS ROUND DID NOT DECIDE

- **How many nights earn which sign.** The ladder is theirs; the thresholds are a tuning
  call nobody should take from a record.
- **Whether a shame wall exists at all.** Named as dangerous, not proposed.
- **Whether anybody can answer for the player's debt.** That needs the deal object round
  39 found missing and pending 41 carries.
- **The reconnection fee.** Pending 43 carries it; this round only re-confirms the record
  has no number for it.
- **Anything about the demo.** Rule 14: research rounds continue and never touch it, and
  only THE RUN re-cuts.

---

## 5. ROUTED

- **WORLD `[debt carried]`** — section 3. **Wire debt into the signs that already exist**,
  stop at `refuse`, and **price the visit rather than the debt**.
- **FACTIONS** — `against.js` reserved `refuse` for the unpaid landlord by name and nobody
  built the caller. Their file, their sentence, pointed at rather than changed.
- **WORLD `[block strikes]` / `[block rent]`** — contagion answers "what happens when the
  whole street owes": nobody collects, and the bigger and more alike the street the more
  certain the joint failure. Third round in a row landing there.
- **PEOPLE** — what makes a debtor pay is the relationship, and the damage is to the
  relationship. That is `standing` and `belonging`, not a combat surface.
- **UI** — the collector's four sentences are already written and already good. What is
  missing behind them is a consequence, not better words.
- **COORDINATOR** — **ruling 6 is confirmed for a new reason.** Exclusion does not merely
  match the record; **seizure and collection both cost multiples of the debt** (4x here,
  30x-136x in round 41), so exclusion is the only enforcement a poor valley can afford.

---

## 6. THE GATE NOTE

**Pre-push pass** (the gates reading the files in this diff): economy, purse, payday,
attempt, canon rot, demo blockers, language. Results in the commit.

**Full suite unmeasured since 99b3dc9** — rule 13: THE SUITE LINE is still unposted. No red
is mine; this diff is records, the bank and the board.

**The project-level hole, round 27 of naming it.** These gates check that a part does what
it says. Nothing checks that two parts agree, that a part keeps working for as long as the
game lasts, that it is the right part to have, or that the parts form a loop that closes.

This round's instance is a new flavour and the most human one yet: **a comment that
correctly reserves a feature for a caller nobody wrote.** `refuse` is held back from the
crossing signs *because* it belongs to the unpaid landlord — a genuinely good decision,
made months ago, pointing at a caller that does not exist. **A gate asking "does every
reserved thing have a reserver" would find it.** Rounds 38 and 41 found comments that went
false; this is a comment that was never made true.

---

*ECONOMY round 42. Research only. Nothing in the game changed.*
