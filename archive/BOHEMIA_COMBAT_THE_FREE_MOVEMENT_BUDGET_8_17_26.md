# THE FREE-MOVEMENT BUDGET (COMBAT, 8/17/26, v163)

**SPEC ITEM: RF4-08** (Speed Points — mobility as a spendable resource).
**SPECED → BUILT.**

The spec I was blocked on landed on main this turn, and its routing section is
unambiguous: *"COMBAT owns machines 1, 3, 4, 7, 8, 9... **START WITH THE
FREE-MOVEMENT BUDGET; it is the one he will feel first.**"*

## THE MECHANIC, IN HIS OWN WORDS

From his synthesis of the 83-screen corpus:

> *"The base rule. One action per turn. Attacking ends your turn. **MOVING ENDS
> YOUR TURN.** Waiting is a legal action and is frequently the correct one.*
>
> *The exception that makes the game. Speed Points. Sprinting moves you WITHOUT
> ending your turn. That means SP is not movement, it is a currency that buys
> free actions outside the turn economy entirely.*
>
> *The regen rule is the sharp part. SP regenerates on every 5th global game
> turn, **on a fixed world clock**. It is NOT a per-use cooldown that starts when
> you spend. Spend on turn 4 and it refunds on turn 5, one turn later, for free.
> It rewards clock-reading, not hoarding."*

## WHAT WE HAD, MEASURED

Twelve arenas, driving the real `doMove`:

```
REAL STEPS taken:            120
...that advanced the turn:    70
```

Movement was **partly free and inconsistently so**, which is the worst of both.
He cannot learn a rule that holds 58% of the time.

**And the regen was the exact shape RF4 rejects:**

```js
if(!G._stamSpent)G.stam=Math.min(STAM_MAX,(G.stam||0)+1);
```

A pip back *only* on a turn you spent nothing. That is a per-use cooldown wearing
a clock's clothes: it **punished spending and paid him to hoard** — the precise
inversion of the mechanic, and of the movement he has been asking for since 8/15.

## WHAT SHIPS

1. **Moving ends your turn.** One action per turn, all the time.
2. **Speed Points buy free actions.** Unchanged, and now load-bearing. Sprint, run
   and dash already cost pips and already end no turn — v54's own comment says
   *"stamina actions DON'T end your turn."* **Bohemia had the exception without
   the rule**, so the exception bought nothing.
3. **The clock is global and it refunds.** Every `SP_TICK` turns the budget
   refills, whatever he spent and whenever. Hoarding earns nothing.

**And it lands on a law we already have.** 120 BPM: *"everything quantizes to the
beat."* His synthesis: *"it creates a rhythm to the whole fight. The fight has a
heartbeat, and skilled play means acting on the beat."* The same sentence from two
directions — and the tick is now what makes that heartbeat cost something.

## MEASURED AFTER

```
REAL STEPS taken:              74
...that advanced the turn:     71     (the 3 are the stairs, which have their own pip path)
...that an enemy reacted to:   74     of 74

spent it all, then waited   turn:sp   1:0  2:0  3:0  4:0  5:3  6:3 ...
hoarded, never spent        turn:sp   1:3  2:3  3:3  4:3  5:3  6:3 ...
```

Spend to zero and it comes back on turn 5, exactly as his corpus describes. The
hoarder gains nothing.

## A LOCKED RULING WAS SUPERSEDED, AND IT IS NAMED

The per-use regen came from the **7/26 audit**, which is LOCKED. The **8/17 RF4
LIFT law is newer** and overturns it in his own words. **Newest date wins**
(TRUTH HIERARCHY), and §6 of that law routes this to COMBAT as the first thing to
build. Three gate checks pinned the old rule; all three are re-pointed with the
supersession written into them rather than quietly swapped.

What the 7/26 audit was actually protecting survives intact: the budget is small,
it is spendable, and spending it does not cost a turn.

## DEAD CODE DELETED, NOT ORPHANED

`_stamSpent` existed only to answer *"did he spend this turn"* — the per-use
question. The clock does not care, so the flag is unread. **Deleted.** Leaving an
unread flag that three gate checks were pinned to is the present-and-dead shape
that has already cost this project `inMyRange`, the damage faces, and `PRESS_STEP`.

## THE CHECKER THAT COULDN'T TELL A MENTION FROM A USE

My "the flag is gone" check failed — because **my own comment quotes the dead
line**. That is the exact failure mode the craft law names. The absence checks
strip comments before testing now.

## GATE

`combat_lab_gate.js` — **823 pass / 0 fail**. The clock check **runs the shipped
arithmetic** for a spender and a hoarder over twelve turns rather than reading a
string, because a per-use refund and a global clock are indistinguishable by
string and *which one it is* is the entire ruling.

**Mutation-tested, both halves**: disabling the clock takes 5 checks red; removing
the turn cost on movement takes 1 red.

## WHAT I DID NOT DECIDE

`SP_TICK=5` because his corpus says every 5th global turn. Whether a gun fight
wants 4 or 6 is a feel call and his.

TOOL: `tools/bohemia_combat_the_free_movement_budget_patch.py`
