# THE WAY OUT (COMBAT, 8/16/26, v159)

Paolo, 8/16, two rulings in one breath:

> *"I like that in rogue fable four you have to go down the dungeon so from one
> second to another so it is a movement goal for stuff so I think that's
> important."*

> *"I'm not a big fan of the ammo being depleted like I'm walking around like
> it's only four bullets like it's crazy."*

## 1. THE AMMO ENDS. SECOND REJECTION.

He said it on 8/16 (*"I hate that I ran out of ammo... unrealistic"*) and he has
now said it again. **STOP PRODUCING is explicit: a second rejection ends the
feature.** Tuning the number a third time is the fourth-version mistake wearing a
new hat, and finding a legal way to ship scarcity anyway *is* the violation.

So it goes quiet behind one dial, `AMMO_ON=false`. The gun never runs dry, the
counter disappears, the ground stops being littered with rounds. **Nothing is
deleted** — he said he was not a fan, not kill it, so one word turns it back on.

**And the mechanism was never the problem, the job I gave it was.** Ammo was
carrying the movement law. That is why it had to be scarce. That is why it kept
insulting him. With the movement law served properly below, ammo is free to come
back later as flavour at numbers nobody has to defend.

## 2. THE WAY OUT: HIS ROGUE FABLE IV PICK

Mechanism 5 from his own law, **the objective moves**.

**EVERY FIGHT NOW HAS A WAY OUT, AND REACHING IT IS HOW YOU WIN.**

Killing every man on the board no longer ends the encounter. That is the whole
point and it is the RF4 shape exactly: clearing a floor does not advance you,
taking the stairs does. You are not a soldier clearing a map. You are a person in
a collapsed city trying to get somewhere, and the men are what is between you and
it.

**Why this works where three previous attempts did not.** Cover decay, flankers
and the flush all make standing still *worse*, and every one of them can be tanked
by a good player — which is what he reported, four times. A destination cannot be
tanked. From one spot the win condition is not unlikely, it is **unreachable**.
That is the only shape that takes his test to zero without me shrinking a magazine
to force it.

**Derived, never designed (MAP LAW).** Placed on the bearing the threat is coming
*from*, at the range the nearest man is holding, clamped 10 to 18 tiles. It reads
where they already are. Push through them to leave.

## MEASURED

Same policy, two arms, one difference:

```
NEVER MOVES     won  0 / 16     (11 emptied the board and still had not won)
WALKS TO IT     won 16 / 16     after ~13 tiles
```

## THE BOUND, BECAUSE A JOURNEY IS NOT A FIGHT

First cut placed it beyond the **furthest** man and measured **32.8 tiles** — about
32 moves against a fight that lasts roughly 14 turns. That is a hike with a
gunfight at the start. It sits at the nearest man's range now, so the trip and the
fight happen in the same place: they close on him while he advances on it, and
they meet in the middle.

## TWO BUGS OF MINE, CAUGHT BY MEASURING

1. **The way out was placed and then wiped one line later.** `setupCombat` calls
   `resetFightState` *later* in its own body, and the reset clears `G.exit`.
   Measured: a null exit and 0 tiles walked in every single fight. Exactly the
   class of bug as v151's damage faces — written, then undone by the next
   statement.

2. **The gate had a hole and mutation testing found it.** Restoring
   "killing everyone wins" did not take the gate red, because my harness was
   killing men behind the engine's back so `checkClear` — the exact function that
   decides whether a cleared board ends the fight — was never called. The gate was
   not testing the thing it existed to test. Fixed, and now that mutation makes
   the never-moves arm win 10 of 16 and goes red.

## THE GATE BLOCKS AGAIN

`gates/fight_moves_you_gate.js` was downgraded to a printed warning for exactly one
turn while the law sat unmet after his magazine ruling. **It enforces again**, and
the law file records the law as SATISFIED with the numbers.

`combat_lab_gate.js` **814 pass / 0 fail** · `fight_moves_you_gate.js` **10 pass /
0 fail**.

## WHAT I DID NOT TOUCH

**The gun ranges.** He said again they *"still aren't good"* and he is right that
they are unfinished. He has not said which way, and the biggest suspect is a
ruling of his own: v151 floors his max range at the longest enemy reach **+3**, so
whatever gun he picks always outranges the entire field and the choice stops
mattering for range. He marked that temporary himself when he made it. **Not mine
to reverse.**

TOOL: `tools/bohemia_combat_the_way_out_patch.py`
