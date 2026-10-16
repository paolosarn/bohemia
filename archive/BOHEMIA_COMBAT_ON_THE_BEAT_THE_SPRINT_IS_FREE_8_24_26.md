# ON THE BEAT, THE SPRINT IS FREE (RF4-40, the anti-dominant-ability rule)

COMBAT lane, 8/24/26. **TAB: COMBAT.** No change to the game this turn — a rule
got its machine, and the machine found something about every measurement this
lane has ever made.

## THE ROW

> *"Abilities **too effective in many situations** get nerfed or removed, on the
> stated grounds that leaning on one action reduces the need for varied tactics.
> **Counter-enemies exist specifically to push the player off a favourite
> playstyle.**"*

Our diff: **"ABSENT as a rule."**

**A rule without a machine is not enforced**, so RF4-40 ships as *the sweep*, not
as a nerf: a policy behind each verb the fight offers, the same 24 arenas for
each, every one inside its own real budget. `skill_gap` already sweeps one axis
(shoot against walk) and found the biggest dominant strategy in the build. This
sweeps **the verbs nobody had put a policy behind at all.**

## WHAT IT FOUND

| policy | won | HP lost |
|---|---|---|
| **SPRINT to the door** | **20-23 / 24** | **~6-9** |
| WALK to the door | 16-18 | ~35-42 |
| GRENADE every turn | 13-14 | ~48 |
| SUPPRESS every turn | **0** | ~100 |

**And then the reason, which is the actual finding.**

**V74 makes on-beat movement free.** `spendMove` takes a pip and **gives it back**
when the move grades PERFECT. A headless loop has no rhythm — it fires as fast as
JS runs — so it lands on the same grade every time. Measured directly:

> **40 moves. 40 PERFECT. Zero pips spent. Every sprint refunded.**

So this sweep is played by **somebody who never misses a beat**, and for that
player the sprint is free and worth **four extra wins and most of his health.**

That is V74 working exactly as written — *"player SKILL matters more than
stats"* — and it is also the honest caveat on every movement number this lane has
produced: **no headless arm in this repo has ever measured a player who misses.**
Every movement measurement here describes the ceiling.

## IT IS RECORDED, NOT NERFED

The sprint's shape is his own ruling (V110: *"sprinting basically just means you
get to take movement action"*), V74's free on-beat move is a deliberate skill
reward, and **RF4-40's own answer to a dominant ability is a counter — which
already exists**: V168's spotter refuses the sprint while he holds a line on you.
So the rule is satisfied in shape and the counter is simply weak.

**That is a finding for him, not a dial for me.**

## AND TWO STABLE NEGATIVES THE GATE BLOCKS ON

- **Suppressing every turn wins 0 of 24 and dies in every fight.** Suppress is a
  support action, not a win condition, and the sweep says so out loud rather than
  leaving it assumed.
- **The grenade every turn is worse than simply walking.** Two per fight is a tool
  for a moment, not a plan.

## THREE HARNESS CHEATS DIED MAKING IT HONEST

1. **Stamina refilled every turn** — an infinite sprint. Read 22 wins at 6.2 HP.
   *Refilling a resource every turn measures a button nobody has.*
2. **The grenade and suppress topped up the same way.**
3. **A sprint counter that incremented on any move** rather than on one that
   *spent a pip* — it read 201 sprints in 243 turns and **hid the refund
   entirely.** Counting only paid steps is what exposed V74.

## AND A WANTED CONCLUSION DIED TOO

The first version of this gate's headline said **"the sprint dominates."** It
survived two runs and reversed on the third (16 wins against the walk's 17).
**That is the third wanted conclusion this week to survive one reading and die on
the next.** The sweep now blocks on what repeats and reports the rest as what it
is.

## GATES

`gates/dominance_sweep_gate.js` — **8 pass / 0 fail**, registered, three
consecutive green runs.

**RF4-40 moves SPECED → BUILT** — the rule now has a machine, which is what
"built" means for a rule in this repo.
