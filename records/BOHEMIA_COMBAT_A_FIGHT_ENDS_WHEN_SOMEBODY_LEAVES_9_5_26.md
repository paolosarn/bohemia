# V199 — A FIGHT ENDS WHEN SOMEBODY LEAVES (COMBAT lane)

VAMILY job: **BB-NERVE-ON** `[fights end]`, claimed from COMBAT's section.

> "every time it's ONE FUCKING BATTLE, it's not a 40 MINUTE LONG CHESS MATCH."
> — his acceptance test, quoted in the row

The row: *"the mechanic that ends fights early is switched off and sold as an
upgrade… THE PERK NOW EXISTS. So flip the default: MORALE IS DEFAULT BEHAVIOUR,
NOT AN UPGRADE, and the perk goes on to do something BETTER."*

---

## MEASURED BEFORE FLIPPING ANYTHING, AND THE ROW'S HEADLINE IS HALF RIGHT

Same 30 boards, one thing different — nerve off, then on at V35's own untouched
rates — at **three player paces**, because the check only starts once *half the
room is down* and a fast player never gives it time to roll:

| player pace | turns to end | ended by a break | men who leave |
|---|---|---|---|
| fast (24 a turn) | 18.0 → **16.9** | 23.3% | 6.6% |
| realistic (12) | 30.7 → **29.3** | 16.7% | 4.9% |
| slow (7) | 39.5 → **39.1** | 10.0% | 4.1% |

**It is switched off — that part is true. But it does not end fights early: it
buys 1.2 turns.** Breaks really do happen and really do end fights, one in five
at a fast pace. The trigger is *half the room down*, and by the time half a room
is down the rest fall within a couple of turns anyway.

**THE LENGTH OF A FIGHT DOES NOT LIVE IN THIS MECHANIC.** At a realistic pace a
fight is 30.7 turns and this takes it to 29.3. That is in the handoff for the
coordinator. *Inventing a row for it is not this chat's job.*

## AND THE THING HE REJECTED DOES NOT COME BACK — WHICH IS A NUMBER, NOT A REASSURANCE

Paolo 8/26, playing it: *"I don't wanna see anyone run away anymore unless I have
a perk… **YOU'RE NOT SCARY ENOUGH.** I don't know why **so many people are running
away**."*

At the untouched rates that is **4.1% to 6.6% of men** — about one in twenty, not
"so many". What he saw came from the check firing for **every standing man every
turn from the third body on**.

**If this had reinstated his complaint the flip would not have shipped.** A second
rejection ends a feature, and walking back into one knowingly is exactly what
STOP PRODUCING names.

## AND HIS FICTION SURVIVES INSTEAD OF BEING OVERRULED

V183's objection was *"a man who has just started does not frighten anybody"* —
which is an argument about **fear of you**, not about morale.

- **Default, no perk:** men break because **half their friends are dead**. That is
  not about you at all. It is what people do.
- **THEY KNOW YOU:** they break **sooner**, because it is **you**. Threshold drops
  from half the room to a third; the roll steepens.

So the perk stops being the on-switch for a whole system and becomes a real verb —
which is what the row asked for — and V183's sentence (*being someone people run
from is a thing you BECOME*) is still literally true.

## WHAT SHIPPED, MEASURED

| arm | turns | ended by a break | men who leave |
|---|---|---|---|
| nerve off (before) | 30.9 | 0% | 0% |
| **default** | 28.7 | **30.0%** | 8.2% |
| **THEY KNOW YOU** | **26.6** | **46.7%** | 13.9% |

Dials: default `0.5 / 0.10 / 0.05` — **V35's, byte for byte**. Perk
`0.34 / 0.16 / 0.07` — the only new numbers in the row.

`NO DAMAGE BEFORE THE DIAL`: `applyDamage` is 40, archetypes byte-identical.
Nerve is a rule about **who may act**.

## THREE GATE ANCHORS RE-POINTED, AND ONE IS A RULING BEING SUPERSEDED

- **V183's arm** asserted `FEAR_ON === false`. That is the 8/26 ruling this row
  supersedes, newest date wins, and it is written out in full in the arm rather
  than quietly relaxed. What it still holds is the half that never depended on
  the default: **the perk makes more men leave than the default does.**
- **V33's arm** held `0.10+0.05*(_down-_half)` as exact text. The numbers are
  byte-identical; they are just **named** now, because the perk needs a second
  pair to be steeper than.
- **V197's companion arm** compared eight-man rooms per size. Morale moved every
  absolute rate, and the eight-man cell over 24 boards can read 0% in both arms
  and fail on nothing. The claim is read across both roster sizes together now;
  the one-sided guards are untouched.

## GATES AT CLOSE

| gate | |
|---|---|
| `fight_moves_you_gate.js` | **165 pass / 0 fail** (was 160/0) |
| `combat_lab_gate.js` | **931 pass / 1 fail** (the red is another lane's, pre-existing) |
| `boss_ladder_gate.js` | 87 / 0 |
| `one_engine_gate.js` | 3 / 0 |
| page errors | **0** |

## FOR THE COORDINATOR

**If short fights are the requirement, nerve is not the lever.** Measured: a fight
is ~31 turns at a realistic pace and this row takes it to ~29. The length lives
somewhere else, and no row on the board currently names it. *Not this chat's to
add.*
