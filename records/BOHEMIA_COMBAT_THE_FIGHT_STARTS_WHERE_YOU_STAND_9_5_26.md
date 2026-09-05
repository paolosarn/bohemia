# V201 — THE FIGHT STARTS WHERE YOU STAND (COMBAT lane)

VAMILY job: **THE-FIGHT-STARTS-WHERE-YOU-STAND** `[street fight]`.

> "Awesome I just played the run. **Where the enemies at bro**" — Paolo 9/5

---

## THE HONEST SENTENCE WAS ALREADY WRITTEN, IN THE RULING THAT MADE THIS ROW

> **"The game knows who your enemies are. It has never once put one in front of
> you."**
> — `records/BOHEMIA_RULING_WHERE_THE_ENEMIES_AT_9_5_26.md`

Re-checked before a line was written: every `hostile` and `enemy` string in the
alpha, the city and the demo is **prose**. Hostility exists in
`engine/bohemia_between.js` as a **sign on a relationship** — they charge you
more, they watch you, the board sorts them first — and it is a **ledger, never a
body**. The fight is real and reachable, but only through the city map door:
never because somebody walked up to you.

**So the ledger already knows, and the street has never asked it.** Same shape as
the two rows before this one: the material was built, and nothing consumed it.

## WHAT IS MINE HERE AND WHAT IS NOT

Three lanes are on that ruling and the row names the split:

| lane | row | |
|---|---|---|
| RUN | `[enemies exist]` | hostile bodies stand, walk and close on the street |
| PEOPLE | `[who is hostile]` | the crowd wears the sign the ledger computes |
| **COMBAT** | **`[street fight]`** | **bumping a hostile group starts the fight where you stand** |

**No hostility is authored here.** The trigger reads, in order:

1. **A real hostile body** — `p.hostile` / `p.foe`, read *first*, so the moment
   RUN's or PEOPLE's row lands this entry uses it **with no second wire**.
2. **The between-ledger** — their outfit against yours, and the edge's own `sign`.
   *Consuming canon is not authoring it.*
3. Nothing. The street stays quiet.

Gated: a plain person is **not** a foe, and a stranger starts nothing.

## AND IT REUSES THE DOOR'S ENTIRE PIPELINE

`cityFightOnEnter` already posts `BOHEMIA_CITY_ENCOUNTER`; the shell already
consumes it, starts the fight, and walks you home through
`BOHEMIA_CITY_COMBAT_END`. This posts **the same message** from the street, hooked
to the walked step — **the one place a body arrives on foot**, exactly as
`inEnter` is the one place a body goes through a door.

**AND IT SENDS NO ROOM, WHICH IS THE WHOLE DIFFERENCE.** V200 taught the fight to
build its board out of the building you walked into. With no room it builds a
**street**, which is correct, because you are standing on one. **One field decides
which board you fight on**, and it is the field the city already fills — so a
street ambush can never be fought inside somebody's living room.

Measured on the real surface, end to end: fires **true**, message reaches the
shell, `arenaKind` comes back **`street`**, room **null**, way out **present**
(V159 applies outdoors), objective reads **"out on the block"**.

## THE GUARDS, BECAUSE AN ENTRY WITH NO GUARDS IS A CORRIDOR OF FIGHTS

- **He only ambushes you once.** Once he has swung at you he is not an ambush.
- **A cooldown in steps**, so one bad block is not a corridor of fights.
- **Not before you are out of your own street** — the `__NOT_YOUR_OWN_HOUSE__`
  lesson from the door path, one surface along.
- **Not indoors**, because indoors is the door's fight.
- **Deterministic off the person**, never a coin flip per step — the door's own
  rule and its own reason: he cannot farm an encounter by stepping back and forth
  over a kerb. *A street is a place, not a slot machine.*

## THREE INSTRUMENTS WERE WRONG BEFORE THE CODE WAS

**1. THE FIRST HARNESS LOADED THE CITY SLICE DIRECTLY AND THE TRIGGER NEVER
FIRED.** A top-level page has `window.parent === window`, and the entry correctly
refuses to post to itself. **That was the harness, not the code** — and it is
exactly the shape that gets called a broken feature. Re-run inside the alpha,
where the city is a real iframe, it fired first time.

**2. THE GATE COULD NOT INTERCEPT `postMessage` FROM INSIDE THE FRAME.** `file://`
origins are `null` and cross-origin to each other, so the browser refused it. The
message is caught **where it lands, on the shell** — which is also the honest
test, because it is the path the real chain uses.

**3. THE HOOK CHECK READ THE WRONG FUNCTION.** `stepOnce` is **reassigned** by the
interiors wrapper (`const _inStepOnce = stepOnce; stepOnce = function...`), so
stringifying it reads the wrapper and reports the hook missing while it sits in
the original. **It went red on working code.** It is proved against the source
now, immediately after the walk spends its 5.04 seconds.

## AND ONE PIECE OF TEXT CAUGHT BY READING IT

`cityEncounterIn` builds `"inside the " + label`, which is right for a room and
would have read **"INSIDE THE OUT ON THE BLOCK"** on a street. A street is
somewhere you are *on*, not *inside*. The template now respects the street flag.

## `NO DAMAGE BEFORE THE DIAL`

This row contains **no damage, accuracy, range or resource number**. It is an
entry.

## GATES AT CLOSE

| gate | |
|---|---|
| `combat_entry_gate.js` | **31 pass / 0 fail** (was 26/0) |
| `there_are_enemies_gate.js` (RUN's) | 27 / 0, still green with this consuming their model |
| `fight_moves_you_gate.js` | **170 pass / 0 fail** |
| `combat_lab_gate.js` | **931 pass / 1 fail** (the red is another lane's, pre-existing) |
| `one_engine_gate.js` | 3 / 0 |
| `boss_ladder_gate.js` | 87 / 0 |
| page errors | **0** |

## AND THEN RUN'S HALF LANDED IN THE SAME ROUND, AND IT NEARLY MISSED

RUN shipped `[enemies exist]` while this row was closing, and checking it rather
than assuming it is the only reason the two halves meet.

**RUN's hostiles are a CREW standing at a cell** — `BohemiaHostiles.near()`, with
`stateOf()` returning `idle` / `watch` / **`close`** ("they are coming"). **It never
decorates a `ctAdjacent()` person**, so the `p.hostile` path this entry shipped
with *would never have been set by it*. The two halves of one ruling would have
sat next to each other doing nothing — **the exact defect this ruling is about,
one layer up.**

So the entry now reads `HOST_DREW`, which their own draw already computed, and
fires on a crew that is **closing**:

| | |
|---|---|
| a crew that is **coming** | starts the fight |
| the same crew twice | **no** |
| a crew that is only **watching** | **no** — they have clocked you and are not coming |
| roster size | **their crew's own count**, because RUN decided how many are on that corner |

*Reading what their draw computed is not a second copy of the question. Asking
`BohemiaHostiles.near()` again here would have been.*

## WHAT COMES AFTER
2. **PEOPLE `[who is hostile]`** puts the sign on the crowd, so you can see it
   coming — and UI `[danger visible]` is the coordinator's own row for the same
   reason: *a fight that arrives with no warning on a phone is a rage quit.*
3. **The group is drawn from archetypes, not from the people actually standing
   there.** The man you bumped becomes a roster slot rather than himself.
