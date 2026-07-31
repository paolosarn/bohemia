# BOHEMIA ADDENDUM — THE ACTION COST SHAPE (Paolo 7/31/26, LOCKED)

> "And sure the time cost shit sounds good"

That is the ruling. The SHAPE of Bohemia's action clock is now canon. It was
asked as one question, on one page, and answered in one line — so this addendum
is short on purpose.

This settles the SHAPE. It does not settle the NUMBERS: the action list and what
each action costs are still **[PENDING Paolo]** under clause 4 of
`laws/BOHEMIA_ADDENDUM_TIME_IS_SPENT_BY_ACTIONS_7_26_26.md` ("A COST TABLE IS
CANON, NOT MECHANISM... No lane invents an action-cost table"). Nothing here
gives any lane permission to write a cost.

Where it came from: `slices/lab/BOHEMIA_LAB_CDDA_ACTION_COST_7_31_26.html`, the
Cataclysm: DDA emulation, read off that project's own C++. Every number quoted
below is THEIRS, cited, and is here as evidence for the shape — never as our
value. Teardown: `records/lab/BOHEMIA_LAB_CDDA_TEARDOWN_7_31_26.txt`.

---

## CLAUSE 1 — AN ACTION'S COST IS FIXED

Every action has ONE cost, and that cost never changes. It is the same number
for a fresh character and a wrecked one, on day one and on day two hundred.

Consequence, and it is the reason to do it this way: the cost table stays a flat
list of one number per action, forever. Nobody has to maintain a fed variant, a
rested variant and a wounded variant of every entry.

## CLAUSE 2 — THE COST IS DENOMINATED FINER THAN THE CLOCK

The cost is stored in a unit SMALLER than the smallest unit of time the player
sees, so that dividing a cost by a condition still lands on a whole tick and
never on a fraction the player can notice.

Cataclysm's unit is the "move": 100 moves = 1 turn = 1 second (`calendar.h:289`).
Bohemia's unit is **[PENDING Paolo]** and there is an obvious candidate we
already have: the BEAT. Everything in this game already quantises to 120 BPM
(BEAT = 0.5 s, the 120 BPM LAW), so a sub-beat denomination is the natural fit
and a "move" borrowed from a keyboard game is not. NO LANE PICKS THIS.

## CLAUSE 3 — YOUR CONDITION IS THE DIVISOR, NOT A SECOND COST

Condition never adds a cost and never edits the table. It changes ONE number —
how fast you convert cost into time. Worse condition means the same fixed cost
eats more of your day.

This is why condition does not need a second system to matter. It already does,
on every action in the game, from one multiplier.

## CLAUSE 4 — THE DIVISOR HAS A HARD FLOOR, SO THE CONVERSION HAS A HARD CEILING

There is a floor under how bad your condition can get. Because the floor is a
fixed fraction of baseline, the worst any action can ever cost is a fixed
multiple of its listed cost — and no amount of piled-on damage, load or thirst
can push past it.

Cataclysm's floor is 25% of base speed, so their ceiling is exactly 4x
(`character.cpp:7652`, their comment verbatim: *"Speed cannot be less than 25%
of base speed"*). Their floor holds no matter how absurd the penalties get: at
ten times the penalty the cost does not move.

**Bohemia's ceiling number is [PENDING Paolo].** What is LOCKED is that there IS
one. A game where a bad day can become an infinite one is a game that stops
being playable exactly when the player most needs it not to, and this clause
exists so that can never happen by accident.

## CLAUSE 5 — THRESHOLDS, NOT SLOPES

A penalty arrives when a real line is crossed, not as a constant drip. Under the
line it is free.

Cataclysm: carried weight costs nothing until you are over your cap
(`character.cpp:7613`); thirst costs nothing until 40 (`character.cpp:7620`).
This keeps the player out of micromanagement and makes every penalty land as a
decision instead of a tax.

## CLAUSE 6 — THE TWO CLOCKS STAY TWO

Clause 17 of `laws/BOHEMIA_ADDENDUM_THE_MOBILE_CAMP_7_27_26.md` stands
unchanged: the CAMP BUFF burns on STEPS, the DAY burns on EVERY ACTION.

This is a deliberate divergence from the reference. Cataclysm prices a step in
the same currency as a job (`character.cpp:6022`, a plain step is 100 moves;
`:6103` caps the bonuses so a step can never cost less), which makes walking and
doing one clock with two kinds of purchase. Ours are two clocks. Recorded here so
nobody later "fixes" it into one, thinking it was an oversight. It is a choice.

For scale, since it is the number worth feeling: their WORST step (at the floor)
is 4.00 s and our AVERAGE step is 3.52 s (clause 16 of the camp law, 12,288
steps to cross the valley). Coincidence, but a useful one — our baseline walk
already costs about what their worst-case one does, because our map is a real
city.

---

## WHAT THIS DOES NOT DO

- It does not write a single action cost. Clause 4 of the time law still holds.
- It does not pick the denomination (clause 2) or the ceiling (clause 4).
- It does not port anything into the engine. Under
  `laws/BOHEMIA_ADDENDUM_LAB_PORTS_ON_HIS_WORD_7_26_26.md` the lab ports on his
  word, and the word he gave was about the shape.
- It does not touch damage. NO DAMAGE BEFORE THE DIAL.

## GATE

`gates/action_cost_shape_gate.js`, registered in the suite as ACTION COST SHAPE.
A law without a machine gate is not enforced, so this one is machine-locked the
same turn it was written. What it proves: the six clauses are still in this file;
the lab page that produced the shape still demonstrates all four of the
mechanical claims LIVE (cost fixed under changing condition, condition as the
divisor, a hard floor implying a hard ceiling, thresholds not slopes); the
pending items are still marked pending and have NOT been quietly filled in by a
lane; and no engine module has started implementing a cost table behind Paolo's
back.

The last check is the one that matters most. This addendum is the exact kind of
document that reads as permission to start building, and it is not.
