# DAY 49, ROUND TWO — THE LOAN IS ALREADY BUILT, AND HE IS EXACTLY ONE SHORT EVERY DAY

ECONOMY lane, VAMILY row `[first battery]` Q49. MODE: RESEARCH — DO NOT IMPLEMENT.
**Round two of two: the number.** Round one is
`records/BOHEMIA_ECONOMY_DAY_49_HE_CANNOT_ASK_AND_NOBODY_PAYS_MONEY_9_22_26.md`.
Claimed 9/22/26 `economy-vamily-knxaeh`, commit `a74d841`.

> **WHAT ROUND ONE HANDED THIS ROUND, AND THIS ROUND DOES NOT RE-DERIVE IT.** A man with
> nothing cannot buy, cannot trade, cannot be paid yet and cannot ask; zero of sixteen
> factions pay money; four of sixteen offer, and all four make him owe. So the first battery
> has to come out of the first person's hand. **Round two prices that, and the price turned
> out to be already written down.**

---

## 0. THE FINDING: THE MECHANISM EXISTS, IT IS EXACTLY RIGHT, AND NOBODY HAS READ IT

`engine/bohemia_lend.js` is a shipped module that **hands somebody one battery on a
handshake**, and its constants are the whole answer to this row:

    HANDSHAKE     1              one battery, handed over
    DUE_A_NIGHT   1              one back, a night
    CURRENCY      'electricity'  batteries
    SHORT_DEED    'loan:short'   going short is a DEED, with a name

Run night by night:

    take(book,'THE CARTEL',1)  -> { took:true, got:1, owed:1 }
    due(...,2)                 -> [{ owed:1, due:1 }]
    paid(...,1,2)              -> 0          <- the account CLEARS
    due(...,3)                 -> []          <- and nothing is asked again

    and when he CANNOT pay:
    short(...)                 -> { owed:1, nights:1, deed:'loan:short' }
    due(...,3)                 -> [{ owed:1, due:1 }]   <- STILL ONE. It did not grow.

*** THE DEBT DOES NOT GROW. WHAT GROWS IS THE COUNT OF NIGHTS HE WENT SHORT. ***

**EVERYTHING COSTS ONE means a loan in this game physically cannot compound**, so the
pressure is not interest, it is **memory** — which is round 9's finding, shipped as code
before this lane ever asked the question: *a debt is not a number, it is a person who
remembers.*

**I nearly wrote the opposite.** Income is one a day and the loan asks one a night, so my
first reading was a debt trap. **It is not one, and the module is why.** Measured before
written down.

---

## 1. WHO WILL DO IT, AND THE ANSWER DOES NOT IMPROVE WITH TIME

`offers(ask)` is two conditions: `ask.can && ask.owes`. Only the **they-give-first** rule
produces `owes: true`. So:

    given  0   A STRANGER                 4 lenders of 16
    given  1   SOMEBODY WHO SHOWED UP     4 of 16
    given  3   USEFUL                     4 of 16
    given  6   COUNTED                    4 of 16
    given 10   INSIDE                     4 of 16

**THE SAME FOUR AT EVERY RUNG. Climbing from stranger to INSIDE adds not one lender.** THE
CARTEL, THE CHURCH, THE NETWORK, THE SOCIAL FORCES — round one's four, and they are the
only four in the game who will put a battery in a stranger's hand.

**Because rising in this world does not get you a loan. It gets you the right to ASK, and
what you can ask for is goods.** The four who move first are the only ones who ever hand over
the thing itself, and the twelve who make you earn it never hand over money at all (round
one: zero of sixteen pay money). *That is a complete, coherent economy nobody designed on
purpose, and it is sitting in two files that have never been read together.*

---

## 2. THE LADDER, AND THE PRICE OF BEING ABLE TO ASK

Measured by running `bargain` and `askFor` up the giving count:

    given  0  ->  A STRANGER
    given  1  ->  SOMEBODY WHO SHOWED UP
    given  3  ->  USEFUL
    given  6  ->  COUNTED        <- the first rung that can ask for anything
    given 10  ->  INSIDE

**SIX THINGS GIVEN BEFORE HE CAN ASK ANYBODY FOR ANYTHING.** That is the price of the second
battery, in the game's own numbers, and it had never been put on a page.

**And taking the free one moves him nowhere.** `take()` on the Cartel as a stranger returns
`delta: 0` with the words **"YOU TOOK IT, AND IT WAS FREE."** *Charity does not make you less
of a stranger.* He still has to give six.

---

## 3. *** THE NUMBER THIS ROW EXISTS FOR: HE IS EXACTLY ONE SHORT, EVERY DAY. ***

Three shipped numbers, none of them invented here, put together for the first time:

    a day's work pays            +1      (payForWork, and PAYOUT.COMPLETE for a quest)
    food costs                   -1      (EVERYTHING COSTS ONE, and the shelf)
    the loan asks, per night     -1      (DUE_A_NIGHT)
    ------------------------------------
    his day                      -1

**On any night he squares up with the person who helped him, he has not eaten. On any night
he eats, he is a night short and it is written down with his name on it.**

That is a one-battery choice, every single night, from the first morning — and **it is what
the first quest is for.** A quest pays one on COMPLETE, which is the only thing in the engine
that breaks the tie. *The first person hands him a battery; the second thing that person does
has to be give him a reason to earn a second one, or the arithmetic eats him.*

**Nothing above is a proposal.** Every number in that little table is already shipped, and
the subtraction is the only new thing in this round.

---

## 4. THE REAL RECORD SAYS THE MODULE IS ALREADY RIGHT

Every part of `bohemia_lend.js` matches the documented shape of lending between people who
have nothing, and it was built without this study.

- **Most family and neighbour loans are interest-free.** Ours cannot charge interest at all,
  because EVERYTHING COSTS ONE. *Same answer, reached by a different law.*
- **Enforcement is the threat of severed social ties, and relationships deteriorate after
  default.** Ours records `loan:short` as a DEED and counts the nights. **Not a penalty. A
  memory.**
- **95.16% of informal loans are fully repaid.** So the first battery is not a trap and not a
  threat. **It is a thing almost everybody honours**, and the tension in the first five
  minutes is whether he is the one in twenty.
- And the day-labour half from round one stands beside it: **paid in cash at the end of the
  day, and some men wait days on the corner without being picked.** The loan is what covers
  the waiting. That is what it is FOR in the real record and it is what it would be for here.

---

## 5. THERE IS NO PAWN, AND I AM NOT ASKING FOR ONE

Round one found the pawn's real shape: hand over a thing you care about, get one, it waits
for you until it does not, **85% redeem.** `bohemia_lend.js` takes **no collateral** — there
is no pawn anywhere in the engine.

**Leave it that way.** The pawn is a second mechanism for a problem the handshake already
solves, and the handshake is better here: it needs no item table, no fraction (the pawn's
25-60% is a fraction and this game has none, round 14), and it puts a PERSON on the other
side of the transaction instead of a counter. **REUSE-FIRST.** If a pawn is ever wanted it
should be a flavour of the same loan book, not a new one.

---

## 6. THE DELIVERABLE

> **THE FIRST BATTERY IS A LOAN OF ONE, ON A HANDSHAKE, FROM ONE OF FOUR, AND THE MODULE IS
> ALREADY BUILT.** `bohemia_lend.js`, HANDSHAKE 1, DUE_A_NIGHT 1, and going short is a deed
> with a night count and no growth. **Nothing needs to be designed. It needs a caller and a
> face.**
>
> **THE FOUR ARE THE CARTEL, THE CHURCH, THE NETWORK AND THE SOCIAL FORCES, AND THAT DOES NOT
> CHANGE AS HE RISES.** Four of sixteen at every rung from stranger to INSIDE. Rising gets him
> the right to ask for goods, never money.
>
> **SIX THINGS GIVEN BEFORE HE CAN ASK ANYBODY FOR ANYTHING**, and taking the free one moves
> him zero rungs. *"YOU TOOK IT, AND IT WAS FREE."*
>
> **AND THE ONE NUMBER NOBODY HAD: HE IS EXACTLY ONE SHORT EVERY DAY.** Work pays one, food
> costs one, the loan asks one a night. Eat or square up, every night, from the first morning.
> **That is the tension the first five minutes has been missing and it costs nothing to build,
> because all three numbers are already shipped.**
>
> **DO NOT ADD INTEREST AND DO NOT ADD A PAWN.** The real record says neighbour lending is
> interest-free and 95% repaid, and our law makes compounding impossible anyway. The pressure
> is the night count with his name on it.

---

## 7. WHAT THIS ROUND DID NOT DECIDE

- **Whether a faction should ever pay money.** Zero of sixteen do. Changing it is a design
  ruling about what a faction is, and it is **pending 41 again**: can a deal exist between two
  people who are not the player.
- **Whether going short should ever cost more than memory.** The module records nights and
  stops. Whether anything in the valley acts on that count is the same ruling as round 48's
  *"can the paper ever bite"*, and it is not assumed here.
- **Who the first person is.** PEOPLE casts people; QUESTS owns `[wire the door]`.
- **What he gives, to climb the six.** The ladder counts givings; what a giving IS belongs to
  whoever builds the act.
- **Anything about the demo.** Rule 14: research rounds never touch it; only THE RUN re-cuts.
  Rule 15: nothing for a thumb. Rule 18(b): research lanes continue. **Rule 22** binds MAKING
  lanes and names twelve; ECONOMY is not one. **Rule 29** (text items are boring) names WORLD,
  WORDS and QUESTS for the registry and this lane registers nothing — *and its spirit is
  honoured anyway, because this round's deliverable is a battery in a hand and a night count,
  not a card of words.*

---

## 8. ROUTED

- **QUESTS `[wire the door]`** — **the first person hands over a loan of one and the module is
  built.** What that person does SECOND is the real ask: a quest pays one on COMPLETE and it
  is the only thing in the engine that breaks the eat-or-repay tie.
- **WORLD** — `bohemia_lend.js` has **no caller**. HANDSHAKE 1, DUE_A_NIGHT 1, the account
  clears on payment, going short writes `loan:short` with a night count. It needs wiring, not
  designing.
- **WORLD / FACTIONS** — the four lenders are fixed at four from stranger to INSIDE, because
  `offers()` needs `owes:true` and only they-give-first produces it. **If that is wrong it is a
  design ruling, not a number.**
- **PEOPLE** — *"YOU TOOK IT, AND IT WAS FREE"* is already written, and the man who said it is
  one of four. Charity moves him zero rungs; that is the line to play.
- **COORDINATOR** — **Q49 complete, both rounds.** Pending 41 is named again, by a third
  route.

---

## 9. THE GATE NOTE

**Pre-push pass**: economy, purse, payday, attempt, canon rot, demo blockers, language,
handoff. Results in the commit.
**Full suite: 107 red at `ad23d875`, mine are: none.** The suite line has not moved since
9/14.

**RULE 27 CHECKED ON THIS LANE'S OWN BANK, THE ROUND IT LANDED.** *The player does not speak
Spanglish* — and the stronger fact is that **the player does not speak at all in this bank:
512 role-place entries, ZERO of them the player talking.** The seven whose descriptor names
him have him as the listener (*"keeper, when the player picks something up"*, *"somebody
correcting you"*). The file asserts it fourteen times in its own "what is not here" sections
and the assertion holds. **Rule 27 costs this lane nothing, measured rather than assumed.**

**The project-level hole, instance 36.** These gates check that a part does what it says.
Nothing checks that two parts agree, that a part keeps working for as long as the game lasts,
that it is the right part to have, or that the parts form a loop that closes.

**This round's instance is the largest one this study has found, and it is made of correct
parts.** The lend module is right. The favour module is right. The purse is right. The shelf
is right. **Put the four together and a new player is one battery short every day of his life
and nothing in the suite can say so**, because the subtraction crosses four files and every
one of them passes its own gate. *Round 36 asked what the first ten minutes hands a stranger,
round 45 asked what a save with no history sees, round 49 round one asked whether any door is
open, and this asks whether the arithmetic of his first week adds up. Four rounds, one missing
gate: play the first morning as a man with nothing.*

## 10. THE PROBE THAT WAS WRONG, AND THE ONE I ALMOST PUBLISHED

**`offers(ask)` takes the RESULT of `askFor`, not a rung.** I ran it against all five rung
words and got `false` five times, which reads exactly like *"nobody in this game lends to
anybody"* — a spectacular finding, and wrong. It takes the ask object and checks
`can && owes`. Run properly it is four of sixteen at every rung. **Fifth signature fault in
two rounds, and the fifth one to produce a clean, quotable, false negative.**

**And the one I almost published, which is worse than a signature fault.** Income one a day
against a loan asking one a night reads as a debt trap, and I had the sentence half written.
**Then I ran `paid()` and the account cleared, and `short()` and the debt did not grow.** The
trap does not exist. *The difference between the wrong version and the right one was one more
probe, and the wrong one was more dramatic.*

---

*ECONOMY round 49, two of two. Q49 complete. Research only. Nothing in the game changed.*
