# THE VALLEY REMEMBERS — 8/12/26 (RUN lane)

Paolo:

> "we are trying tk create the best funnest deepest videogame ever"

**Depth is not more surface. It is yesterday still being true today.** So before
building anything I measured what actually survives a night in the shipped build,
across a real day boundary:

```
day 1 ends    TRADES +8      (he handed the tap to the trades, in daylight)
day 2 opens   {}             gone
```

A **bond** survived. Everything he did to a **faction** was forgotten by morning —
in a valley whose entire spine is factions: REDS, BLUES, NETWORK, TRADES, CARTEL,
REMNANTS.

That was the deepest hole in the loop, and it was not a missing feature. It was
**half a wiring job somebody stopped in the middle.**

---

## THE RULING WAS ALREADY MADE, AND ONLY HALF APPLIED

Paolo 8/7, ruling A, quoted in `engine/bohemia_quest_runtime.js`'s own source:

> "a bond built in one quest opens a door in another. **Continuity is the dynasty.**"

Bonds were wired into the shared ledger that day. **Faction standing and posture
were not**, so they lived only in the quest's own state — and a quest's state dies
with the quest. Every quest handed you a fresh, empty world.

Fifth time this lane has found the same shape this week: the machinery exists and
is not connected.

## WHAT SHIPS

**Standing, posture and bonds all carry now**, in the shared ledger the runtime was
built around. And each move keeps its **reason**: the completing stage's own `@LOG`
line, captured at the moment the stage fires.

So the game can now say not just *TRADES +8* but *why*:

> **TRADES +8**
> *"Handed the tap to the trades. They patched it in daylight, names on the work order."*

Those are the quest's words, verbatim out of the `.bq`, under the same law as the
offer and the resolution buttons: **I show his prose, I never write prose about
it.** The gate diffs it against the file.

## AND IT IS VISIBLE, BECAUSE A LEDGER NOBODY CAN READ IS BOOKKEEPING

The phone's home screen now carries **WHAT THE VALLEY REMEMBERS**: who you're solid
with, which factions you moved, who's watching you, and the line from the job that
did it.

**Why the phone and not a stats screen.** It is already the thing that brings you
work, and standing is *why* the work comes. A menu would be a menu; on the phone it
is the same object that rang this morning telling you what last week cost you. It
also makes the Profile honest — it had been showing a follower count and nothing
else, on a device whose entire job is who knows you.

**Day one says so out loud**: *"Nobody here knows you yet."* An empty ledger is not
an error, it is the start of a run, and saying it is better than an empty box.

## THE PHONE BUZZES, AND IT IS HIS SOUND

I said last turn this was a wiring job rather than a cook, and it was — more so than
I knew. **He already judged it.** In his 8/9 SFX verdict:

```
[PHONE BUZZES]  phone_buzz
  DOWN phone_buzz.0
  DOWN phone_buzz.1
  UP   phone_buzz.2
  DOWN phone_buzz.3
  UP   phone_buzz.4
```

Two candidates **UP**, and nothing in the game had ever played one. **Approved-but-
unused is a named defect here.** The city now asks the alpha to play it when a job
comes in, through `window.playSFX` — the game's own call, the same one the run and
combat use, never a private preview path. The gate asserts the sound is one he put
up, because playing an *unapproved* sound would be worse than silence.

---

## THE ONE THING I WAS CAREFUL NOT TO BREAK

The runtime's own comment promises:

> The cross-quest ledger is **optional, and null is EXACTLY the old behaviour**, so a
> runtime built the old way is bit-for-bit unchanged.

That promise is load-bearing for every other consumer of the runtime. The gate
builds a runtime with **no shared ledger at all**, runs a stage that writes faction
standing, and asserts it neither throws nor changes — so this addition cannot have
cost another lane anything.

## PROOF

`gates/continuity_gate.js`, 20 assertions:

- **standing survives the night** — the exact measurement that was red
- so does posture, and bonds still do (no regression on the half that worked)
- the reason is kept and is the quest's own line, verbatim against the `.bq`
- the phone **shows day 1's move on day 2**, driven by tapping the real buttons
- an empty ledger says *"Nobody here knows you yet"*
- a runtime with no shared ledger is unchanged
- the buzz is a sound he put **UP** on 8/9

Plus PHONE RINGS 21/21, DAY LOOP 54/54, HOME + PHONE 24/24, ALPHA LOADS 20/20,
SHIPPED TRUTH 39/39.

**The sweep I fixed this morning earned itself back immediately**: I changed two
engine modules and `bohemia_city_module_resync.py` carried both into the city
automatically — modules that were silently outside that sweep twelve hours ago.

---

## WHAT COMES AFTER

Standing now **accumulates**. Nothing **reads** it yet: no door opens because the
trades owe you, no price changes because the Network is watching. That is the next
depth step and it is genuinely his call, because which door opens is content:

- the mechanism is ready (`standingWith(name)`, `bondWith(role)`) and gated
- the quests already carry `[gate: ...]` options the runtime evaluates
- what I must not do is invent which faction opens which door — that is canon he
  reserved, and it is exactly the line MECHANISM-MINE / CONTENTS-PAOLO'S draws
