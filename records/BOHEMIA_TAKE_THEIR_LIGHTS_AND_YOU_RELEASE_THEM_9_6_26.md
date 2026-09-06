# TAKE THEIR LIGHTS AND YOU HAVE RELEASED THEM
FACTIONS lane · VAMILY row `[broke raiders]` BB-UNPAID-TURNS-PREDATORY · 9/6/26

## THE ONE LINE
Putting a faction's lights out used to be a free win. It costs something now: an
armed group that stops being paid does not disappear, it becomes somebody else's
problem — including yours, even if you never wronged them.

## HIS OWN STUDY IS THE SPEC
> The historical free companies *"regularly made a living by plunder when they
> were not employed"*; the White Company kept notaries and treasurers and signed
> binding contracts **and** pillaged widely at the same time; Caferro on the
> medieval mercenary: *"notoriously difficult to control and **prone to desertion
> if not paid regularly**."*
>
> Day 6 said a bandit who settles acquires an interest in his block prospering.
> **Day 7 says the reverse is also true: cut a stationary bandit's income and he
> GOES ROVING AGAIN.**

And the row names the mechanism outright: `bohemia_mandate.js`'s income rule — *a
district pays only while it is yours AND lit AND patrolled* — **is also the
aggression rule.**

## WHAT SHIPPED
`BohemiaMandate.roving()` is that rule read backwards, with nothing added:

> **They held ground** (so they had settled) **and nothing on it is lit** (so
> nobody is paying them).

A faction that never held anything is **not** roving — it never settled, and
calling a camp of scavengers "released" would be a claim about people an income
never held in check.

**Derived, never stored.** Ask again after the lights come back and it is simply
not true. A stored flag would need a rule for putting it back and would sit set
forever the first time somebody forgot to write one — the trap the coalition
avoided one round ago.

### The severity nobody ruled, and how it was avoided
The tempting version is *"a roving outfit is HOSTILE"*. That is a number nobody
gave me: it would make a faction with no opinion of you suddenly as dangerous as
one you had personally wronged, and it would make no difference at all to a
faction already at war.

**RELEASED is a comparative in his own sentence.** So it raises them **one rung**
on the ladder that already exists — no new level, and it cannot manufacture a war
out of nothing because there is no rung above war.

    no history + roving   ->  cold      "NOBODY IS PAYING THEM ANY MORE, AND THEY ARE LOOKING AROUND"
    cold      + roving    ->  hostile   "NOBODY IS PAYING THEM. THEY ARE TAKING IT WHERE THEY ARE"
    hostile   + roving    ->  war       "NOBODY IS PAYING THEM AND THEY HAVE STOPPED PRETENDING"
    already at war        ->  war       unchanged, and keeps its own story

That last line matters: a body that behaves identically must not be handed a new
explanation.

## THE ORDER THAT IS THE WHOLE ROW
The first cut applied the release **after** the "no reason at all" check. So a
roving faction the player had no history with came back as **nothing** — and they
are exactly who the row is about. *"It becomes SOMEBODY ELSE'S problem"* means
somebody who did nothing to them. Measured, fixed, and locked as its own claim.

## DRIVEN ON THE WALKED SURFACE
    the Mob holds 1,490 blocks and 7 lit circuits   reads: nothing
    douse all 7 of their circuits                   reads: cold / broke
    every other faction                             untouched

## AND A TEST THAT MEASURED A CALL THE GAME DOES NOT MAKE
The street helper in `coalition_gate` predated this row and passed the organ
`{rel, rung, coalition}` — no `roving`. So the check reported "nothing" after
dousing every circuit a faction had, while the game itself was correct.

Same shape as `commitment_gate`'s D11 earlier in this session: **a gate calling
something the game never calls is measuring its own invention.** It asks what the
city asks now.

## GATES
`mandate_gate` 44/0, up from 33 — the rule: never-settled is not roving, still-paid
is not roving, derived so the lights ending it needs no rule, one rung not an
absolute, cannot exceed war, additive when nobody is roving, and the ordering
claim.
`coalition_gate` 40/0, up from 38 — the street: lights out, they turn; and the rest
of the valley is untouched.
Green alongside: rung pays, turf, faction between, demo build, alpha loads.

## [PENDING Paolo] — NOTHING NEW
The row needed no ruling. What a roving outfit should *do* beyond turning on
whoever is in front of it — raid a specific block, recruit, move — is the same
open design question WORLD already carries for the coalition, and it is his.
