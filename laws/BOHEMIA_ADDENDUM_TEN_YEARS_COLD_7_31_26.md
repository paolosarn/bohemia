# BOHEMIA ADDENDUM — TEN YEARS COLD (Paolo 7/31/26, LOCKED)

> "IM CONFUSED BY YOUR QUESTION THE WHOLE POINT OF THE GAME IS THAT IT STARTS
> TEN YEARS AFTER THE ECONOMIC CRASH BRO WTF LIKE I DONT WANT IN THE GAME U
> GOTTA BE DEALING WITH SOME WEIRD ECONOMIC GAMEPLAY THE WHOLE WORLD IS BASED ON
> THE UTILITY DYING EVERYWHERE WHAT DO YOU MEANN"

He is right and this is a correction, so it goes in as law before anything else
gets built. Three things lock here.

---

## CLAUSE 1 — THE CRASH IS BACKSTORY. THE GAME IS THE AFTERMATH.

Act 1 opens **TEN YEARS AFTER** the crash. The crash is not a thing the player
watches, survives, or manages. It is why the world looks like this. It happened,
it is over, and the game is what is left.

**Consequence, stated so it cannot be misread:** no surface, ever, simulates the
crash *happening*. No devaluation curve ticking down. No bank run. No watching a
number fall. That is a documentary about ten years ago, and the player was not
there.

## CLAUSE 2 — NO ECONOMIC GAMEPLAY. NONE.

> "I DONT WANT IN THE GAME U GOTTA BE DEALING WITH SOME WEIRD ECONOMIC GAMEPLAY"

This EXTENDS `laws/BOHEMIA_ADDENDUM_THREE_CURRENCIES_CENTURY_7_26_26.md`, whose
clause 2 already banned the Civ-5 / Surviving-the-Aftermath spreadsheet feel.
That clause banned COMPLEXITY. This one bans the CATEGORY.

BANNED OUTRIGHT, as player-facing mechanics: exchange rates. inflation. prices
that move on a clock. currency conversion. withdrawal limits, deposits, banks,
interest. any "market" the player reads or plays. any number whose job is to make
the player think about money as a system.

The THREE CURRENCIES stand exactly as ruled — **resources, electricity, clout** —
and they are counters on simple icons, not an economy. An exchange rate between
any two of them is a fourth currency wearing a hat and is banned by this clause.

**THE BOUNDARY, stated out loud so nobody has to infer it.** What is banned is a
price that **moves by itself** — not a price that exists. A game where you can
buy something needs a number on the tag, and `engine/bohemia_purse.js` is the
right shape: its `PRICES` table ships EMPTY and marked `[PENDING Paolo]`, because
*"an empty price table means the shop is real and the tag on the shelf is his."*
That is MECHANISM-MINE / CONTENTS-PAOLO'S done correctly and this clause does not
touch it.

BANNED is the price that changes without him: a rate, a drift, a per-day curve, a
scarcity multiplier the player can watch move. **A tag is fine. A market is not.**
This paragraph exists because the first version of this law's own gate failed the
purse module and would have accused a sibling lane of breaking a law it was
obeying.

## CLAUSE 3 — THE UTILITY IS DEAD EVERYWHERE, AND THAT IS THE WORLD, NOT AN EVENT

> "THE WHOLE WORLD IS BASED ON THE UTILITY DYING EVERYWHERE"

Dead. Everywhere. Already. It is not a timer, not a countdown, not a thing that
happens on day 14, and not a thing the player can prevent, delay, or restore at
the city scale.

This is not new canon — it is the STATE OF THE WORLD the existing laws already
describe, and this clause exists because I failed to read them as one thing:
**CLUSTERED POWER** (only ~12% is lit, that 12% is OWNED, and the network that
carries it is eerily perfect), **LIGHT = TERRITORY**, and **nobody patrols the
dark**. Those three were written as atmosphere. They are the infrastructure
ruling, and they were already complete.

**So the question I asked him — "when a utility dies, does it disappear or does it
get an owner?" — was a question he had already answered, twice, in canon.** It is
dead everywhere, and the fraction that still works belongs to somebody. Asking it
again was the error this addendum is written to prevent.

---

## WHAT THIS KILLS

`slices/lab/BOHEMIA_LAB_THE_CRASH_7_31_26.html` had five mechanics. **Two of them
are now dead by clause 1 and clause 2** — "the money dies" (a devaluation curve
the player watches) and "the freeze" (withdrawal caps). They were well built,
they were sourced to real history, and they are exactly the weird economic
gameplay he just banned. Being correct about Lebanon is not a defence.

There is **no v2**. Under
`laws/BOHEMIA_ADDENDUM_STOP_PRODUCING_7_26_26.md`, rebuilding a rejected thing in
a legal-looking new form IS the violation, and the tell is writing another version
of it at all.

**WHAT SURVIVES, and it survives because he confirmed it rather than because I
argued for it:** the finding that a dead utility has an OWNER. He said the world
is built on the utility dying everywhere; canon says the lit 12% is owned. Those
agree. The record keeps that half and the page keeps its two non-economic
mechanics; the economic pair is marked DEAD in place, where a future session will
read it before rebuilding it.

## WHAT THIS OPENS — AND IT IS THE REAL ANSWER

Ten years cold, with money banned as a system, there is nothing left to trade
*with*. What is left is **who owns the working thing, and whether they will deal
with you.**

That is why his next four words were **FALLOUT NEW VEGAS**, and why they arrived
in the same breath as "that also doubles as a city builder." The successor
question is not "what does a thing cost." It is **"what is your standing with
whoever has it"** — and the city-builder half is that what you BUILD is what
makes you worth dealing with, compounding across the three acts under the CENTURY
RULE.

Nothing in that paragraph is ruled yet. It is where the lane goes next, and the
numbers are his.

## GATE

`gates/ten_years_cold_gate.js`, registered as TEN YEARS COLD. A law without a
machine gate is not enforced, so it is machine-locked the same turn.

What it proves: the three clauses are still in this file; the two killed
mechanics on the lab page are marked DEAD and are no longer declared live to the
harness; **no shipped surface has grown an exchange rate, an inflation term, a
price that moves on a clock, or a withdrawal cap** (matched as a structure, never
a mention — the laws are required to name these things in order to ban them); and
no fourth currency has appeared beside resources, electricity and clout.

The sweep is the point. This is a law about a whole CATEGORY of mechanic, and a
category can only be kept out by something that looks for it everywhere, every
time.
