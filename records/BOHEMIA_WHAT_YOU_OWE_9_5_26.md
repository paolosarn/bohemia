# WHAT YOU OWE (RUN, 9/5/26)

VAMILY `[debts named]` / BB-WHAT-YOU-OWE. The study called it *"the smallest row
in seven days and the best effort-to-effect one on the whole board. It is one
line on a card he is already reading."*

## THE MECHANIC WAS RIGHT AND NOBODY WAS EVER TOLD

There is exactly **one daily cost in the walked game**, and it is not food, rent
or fuel. It is **people you said you would show up for.**

`ctNeglectFor()` walks every outfit you made a commitment to and takes standing
away if you did not turn up. *Nothing said, nothing owed* — it only bills what
you actually promised. That is the right mechanic, and the player was never told
it happened.

Three small things, all in one place:

1. **`ctNeglectFor` hands back `{faction, lost, now}` for every outfit, and its
   return value was thrown away.** It already computed exactly what the card
   needed to say.
2. **The timing made it unsayable.** `showReckoning` built and showed the card
   *first*, and the charge happened on the tap that **dismissed** it — the bill
   rung up at the exact moment the only surface that could report it was already
   gone.
3. So the card counted steps, districts, buildings entered, the job outcome and
   the pay, and **never once said whose day you ruined.**

The game he named makes you leave the house through PAYROLL, and its punishment
is not death, it is **people leaving**. We had built our version of that and hid
it.

## WHAT SHIPPED

The charge moves to the top of `showReckoning`, before a single line of the card
is built, and its answer is kept. The card now carries:

    WHO YOU LET DOWN
      REMNANTS waited on you · −1, now 1
    WHO IS EXPECTING YOU TOMORROW
      REMNANTS · not showing up costs 1

**The forward half is the row's own ask** and it is right: a bill you only ever
see after it is charged teaches nothing and motivates nothing. It is read-only
and it shares the charge's own module calls — same `stateOf`, same `neglectFor`,
same `gaveOf` — so the warning can never say anything the bill would not do. A
second rule for "who will bill me" written beside the rule for "who billed me" is
two answers to one question, and that is the drift this file has fixed six times.

**The old call is removed from the dismiss callback rather than left as a
harmless second one.** `ctNeglectFor` guards itself once per day per outfit, but
two call sites for one day's write is the two-writers bug, and a self-guarding
function is not a reason to keep it. `ctVouchSweep` is untouched and still runs
after the charge, which is the order it needs — it only *reads* the standing
neglect has written.

Checked rather than assumed: both callers of `showReckoning` are real end-of-day
(the sleep path and `DAY.phase==='ended'`), so charging at build time cannot fire
on a preview.

## A JUDGEMENT I GOT WRONG FIRST

The first cut **filtered anybody already billed today out of the forward list**,
on the theory that a name said twice reads as two debts.

Measured on the real card: that emptied the forward list at exactly the moment
the warning is worth most — **the night you already missed them.** Somebody you
let down today still expects you tomorrow. Nobody is filtered now, and the two
headings carry the difference: one is a charge that happened, one is a cost that
has not.

## *** AND A CLAIM THAT PASSED FOR THE WRONG REASON ***

The gate asserts *nothing said, nothing owed*. Mutation-tested by removing the
guard so everybody gets billed whether they promised anything or not — **and it
stayed green.**

The claim was being asked on a fresh save where nobody had any standing at all,
and both lists independently drop anybody with nothing left to lose. It agreed
for the wrong reason. It seeds **real standing with no promise behind it** now —
you have done things for them, you never said you were with them, they cannot
bill you for it — which is the exact case the guard exists for. The mutation
turns it red.

Eleventh ruler check this week, and the first one where the ruler *passed* when
it should have failed rather than the reverse.

## MUTATION PROOF

- Throw `ctNeglectFor`'s answer away again → **5 red**, including the card no
  longer naming anybody.
- Remove the nothing-said-nothing-owed guard → **1 red** (after the fix above).

## RESULT

    WHAT YOU OWE 17/0 (new)

The words are attempts, `draft:true`, per ALWAYS MAKE AN ATTEMPT. No new
mechanic, no new cost, no new number — the game already computed all of it and
said none of it.
