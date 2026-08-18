# PULLING THE THREAD (8/17/26, PEOPLE lane)

## THE LOG SHIPPED READ-ONLY

Overhearing a conversation to the end writes a fact in your log. That landed
earlier today with eleven true things about this valley in it and **no way to do
anything with any of them.**

`Q018.W3 THE RUMOR WEB` asks for *"a thread to **pull**"*. A thread you cannot
pull is a list.

## WHAT IT IS NOW

Stand in front of somebody and you can **ask them about a subject you overheard.**
If their trade knows it, they tell you, and a second, later fact lands in the
same log under the same subject.

Driven on the real surface: overheard *the hill* on the street, asked a
scavenger, and the card came back with

    THEY SAID    "I went up once. There is nothing up there worth carrying
                  down. Somebody still thought it was worth watching."
    YOU HEARD    "There is nothing up the hill worth carrying down, and it is
                  watched anyway."
    WHICH LEAVES What is up the hill is not worth stealing, which is why it is
                  worth watching.

Log went 3 facts to 4, and *the hill* disappeared from that person's buttons.

## THE TRAP IT IS BUILT TO AVOID, NAMED BY BOTH THE RESEARCH AND THE CORPUS

The obvious shape is "every person has an answer for every topic", and it is a
content mountain nobody can climb. Disco Elysium's four player call signs alone
cost **428 new dialogue cards**, all localised and voiced. The corpus says the
same thing straight at a solo dev:

> **Q047.X1 ASTRONOMICAL WRITING/VO COST** — *"the VOLUME isn't achievable at
> Hades' scale solo — get the EFFECT with **SCOPED, smartly-templated**
> reactivity."*

So the content is:

    7 subjects x 2 answers   = 14 answers
    4 trades   x 1 refusal   =  4 deflections, reused everywhere
    ------------------------------------------------------------
    18 authored blocks covering 28 person-and-subject combinations

Adding a subject costs **two answers**, not one per resident. The gate asserts
that shape, because the moment somebody "improves" it into a line per person per
subject the content stops being writable.

## THE RULES IT KEEPS

- **`Q014.W4 MULTIPLE KEYS TO THE ANSWER`** — every subject is answerable by
  **two different trades**, so you are never hunting one specific body. The
  factory refuses to build a subject whose answers all come from one trade.
- **`Q001.P8 reward the listener`** — you can only ask about what you actually
  overheard to the end. Nothing is reachable from a menu. An empty log offers
  no buttons at all.
- **`Q037.W3 THE JOURNAL AS A DETECTIVE NOTEBOOK`** — the log **is** the map, so
  a refusal names **a trade** ("TRY A KEEPER OR A WORKER") and never a place.
- **`Q014.W3 SOCIAL DEDUCTION VIA DIEGETIC MEANS`** — asking a person *is* the
  mechanism. There is no lead list anywhere.
- **Three buttons, never seven.** The RUN lane spent 8/16 taking buttons *off*
  the surface he walks with because he said there were too many. A card that
  grows one per subject is a wall on a 390px phone.
- **Asking the same person twice is not a second answer.** Once they have
  answered a subject the button is gone for them. Somebody of another trade can
  still answer it, which is MULTIPLE KEYS working rather than a loophole.

## AND NOTHING RESOLVES

Every deeper fact asks a **sharper question** and stops. What is actually up the
hill, who owns the tank the block drinks from after five, and who is collecting
names are **CANON, and canon is Paolo's.** They ship unanswered on purpose.
MECHANISM-MINE / CONTENTS-PAOLO'S: this is the asking and the deepening; the
destinations are `[PENDING Paolo]` and are deliberately empty. A tool that
invented them would be writing his world for him.

## THE BUG I SHIPPED AND THE GATE THAT NOW CATCHES IT

The first cut drew **three perfect buttons that did nothing at all.** The patch
tool's "already applied?" guard was `if 'ctaskabout' in s` — and the step
immediately above it had just inserted the button markup containing that exact
string. So the tool believed it had already run and **the click handler was never
bound.** Everything looked right on screen.

**Second time this exact shape has bitten in two days.** A guard that matches
something an earlier step wrote is not a guard, it is a coin flip that always
lands the same way. It now guards on a sentinel unique to the block it protects.

Gate mutation `Array.prototype.forEach.call([], ...)` reproduces it exactly and
fails in three places.

## THE MACHINE

`gates/asking_gate.js` — 21 assertions, registered as ASKING. Mutation tested:

    the binding never lands (the bug that shipped)  -> B7 + B9 + B10 FAIL
    the three-button cap is removed                 -> B5 FAIL (7 buttons)

All 46 lines are `draft:true` and editable in the WORDS tab — including both
halves of every deeper fact, because he cannot edit a question he cannot see.
The WORDS harvester and the catalogue gate both learned the `asking` container
in the same turn, which is the discipline that stopped 124 exchange lines going
unreachable yesterday.

Tools: `tools/bohemia_asking_factory.py`,
`tools/bohemia_city_asking_patch.py` (idempotent by md5).
