# V212 — THEY ARE RUNNING, DO I CHASE? (COMBAT lane, `[enemies flee]` BB-THE-ROUT)

**The row:** *"THE MOST DECISIVE MOMENT IN A REAL BATTLE IS CURRENTLY A DESPAWN."*

In pre-modern battle the winners rarely suffered more than 5% fatalities while the
losers averaged 10-15%, **and much of that was inflicted during the rout and
pursuit, not during the fighting.** A battle is decided by a decision to leave, and
the killing happens after the decision. **Winning is cheap and losing is expensive.**

So the interesting question in our fight is not *"can I kill all eight"*, it is
***"they are running — do I chase?"***

---

## MEASURED IN THE BLOB FIRST. THE ROW WAS RIGHT ON EVERY COUNT, PLUS ONE IT DID NOT KNOW

| | |
|---|---|
| the run | `e.edist=Math.min(30,...)` — one tile a turn, straight out, clamped at 30. He is never removed; he just stands there |
| the target | `modePool()` filters by `peeking()` and `exposedToMe()`, and **both exclude `fleeing`**. A running man could not be shot at all |
| **the one the row missed** | `aliveEnemies()` excludes the fleeing too, and **four separate end checks** read `aliveEnemies().length===0` |
| their side | their medic already has the second verb: `medicTurn`'s `need` is 3 for a downed man and **1 for a broken or fleeing one**, and it clears `fleeing` when it reaches him. They talk their runners round. We could not even look at ours |

> **The fight ended the instant the last man on his feet turned his back.** The
> question "do I chase?" was not merely unanswerable — **it could not be asked**,
> because the win screen was already up.

That is the sixth time this lane has found the same shape, and the sharpest one yet:
the behaviour exists, and the game closes before the player can reach it.

## WHAT WAS BUILT, AND NOTHING ELSE

- **The fight waits.** The end test becomes *"nobody can fight **and** nobody is
  worth chasing."* One idea, `fightOver()`, replacing the same expression at all four
  sites, so a fifth end check cannot be written against the old meaning by accident.
  **`aliveEnemies()` is untouched** — the music ladder and the last-man-surrenders
  rule both mean exactly what it says today.
- **He is a target.** A runner inside your reach enters the target pool. The pool's
  own range and smoke filters still apply, so **the dial decides the shot**. Nothing
  here makes a man's back easier or harder to hit.
- **The window closes by itself.** He walks a tile a turn, so his distance and your
  gun set it: measured, a pistol gives you **4 turns** and a rifle **5**. That is the
  decision, and it costs what the study says it costs — ground and turns, under
  whatever is still shooting.
- **And you are told.** Once when the shooting stops and men are still running, and
  once when a man you could have taken passes out of reach.

**What he was carrying leaves with him**, because loot only ever falls off a body
(V181). That needed no code at all, which is exactly why the row called this free
content landing on rulings we already have.

## PROOF

`gates/the_rout_gate.js` — **10 passed, 0 failed.**

The room breaks **through the shipped nerve roll**, not a flag: 4 of 8 down, and a
man broke and ran within 2 turns of the real turn loop. Setting `e.fleeing` by hand
would prove the rout works on a state the game might never reach — the
structurally-unreachable defect this lane has now found five times, once in its own
checker.

Mutation-proved five ways, each landing where it should:

| mutation | result |
|---|---|
| the fight ends under you again, as shipped | **2 red** |
| a runner is not a target again | **1 red** |
| nobody is told the window closed | **2 red** |
| the question is never asked out loud | **1 red** |
| the window never closes, everybody chaseable forever | **2 red** |

### Two staging bugs in my own gate, both worth writing down

**A three-man bench fight can never produce a runner**, and my first cut used one.
The shipped rule needs half the room down, and the *last* man puts his hands up
instead of running — so with three men there is no state where anybody flees. Fixed
by staging a full room.

**And asking for eight quietly gave me four.** `G.numEnemies = 8` is ignored while
the encounter curve is on, so the room came back under the threshold and nothing
broke for sixty turns. The gate turns the curve off first and says why.

## THE DIAL

No damage value, no hit chance, no roll and no accuracy term is authored. A runner
is added to the list of who you **may** shoot; what happens when you do is the dial
that was already there. `applyDamage` knows nothing about running, and the
one-tile-a-turn step and its clamp at 30 are the shipped V35/V53 step, untouched.

## DELIBERATELY NOT BUILT, SO THE NEXT ROUND DOES NOT THINK IT WAS MISSED

**The payload's contract is untouched.** `fled` is already counted and already goes
out per man, which is what a quest or the standing system reads. The outcome shape
lives in the shared handoff core, and adding a field would make this an engine change
instead of a combat one — V200's rule, and it still holds.

---

**Tool:** `tools/bohemia_the_rout_patch.py` (MARK `__THE_ROUT__`, replayable onto
fresh main) · **Gate:** registered in the suite as **THE ROUT** · **Tab:** COMBAT.
