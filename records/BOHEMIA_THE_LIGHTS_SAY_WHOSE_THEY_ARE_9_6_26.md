# THE LIGHTS SAY WHOSE THEY ARE
FACTIONS lane · VAMILY row `[light owners]` NAME-THE-CIRCUIT-OWNER · 9/6/26

## THE ONE LINE
The row was marked *"needs Paolo (who holds what)"*. Who holds what shipped
earlier the same round, so the blocker was already gone — and the biggest
remaining gap turned out to be answered in his own file, in one sentence nobody
had read.

## WHAT WAS MEASURED FIRST
    204 lit circuits
     42 could name a faction        (21%)
    162 answered with a CATEGORY    settlement 113 · network 34 · solar_lone 15

Against Paolo 9/4, LOCKED: *"EVERY PART OF THE VALLEY IS OWNED BY A FACTION."*

## THE SENTENCE NOBODY HAD READ
`bohemia_powergrid.js` carried this, and it is the reason 34 circuits stayed
anonymous:

> *"AND `network` IS LEFT ALONE ON PURPOSE, even though the graph has a faction
> called Network: the category predates the roster and treating the two as the
> same thing is **a guess about his canon, not a reading of it**."*

It is a reading, and it was already written down. `bohemia_belonging.js`, the
NETWORK rule, in his own words:

> **hold:** *"The feed, the radio repeaters, and **THE LIT GRID**. They are the
> reason a message crosses the valley in an hour instead of a day, and they have
> never once charged for it."*

The lit grid is theirs by canon. Refusing to say so left one lit circuit in six
nameless while his file named its owner — the authored-but-unread disease with
the answer sitting two modules away.

**And it is asked, never typed.** The city finds the grid-holder by scanning his
belonging rules for the one whose `hold` names the lit grid. Move the grid to
another faction in that file and this follows instead of arguing.

## THE SECOND HALF OF HIS SENTENCE IS A CONSTRAINT, NOT COLOUR
*"They have never once charged for it"* — said twice, in two places. A Network
circuit is now marked `free`, and `payTo()` answers **nobody** for it.

That matters immediately: `[block rent]` is the next row in this lane and its
whole premise is *"the faction that owns a neighbourhood's generator charges every
household on it monthly."* Without this it would have shipped a bill the Network
would never send.

## WHAT IS STILL NOT NAMED, AND SHOULD NOT BE
`settlement` (a neighbourhood pooling its own lights) and `solar_lone` (one
holdout with a panel) are not factions, and calling them one would invent canon.

They get **ground** instead. Since `[who holds]` every cell of the valley has a
named holder, so an unowned circuit can still say whose land it runs under — a
different fact from whose wire it is, and the one `[block rent]` actually needs. A
new `payTo(x,y)` answers *who do I pay for this block*: the wire's owner if it has
one, otherwise the landlord, and nobody at all if it is the Network's.

## THE NUMBERS
| on the walked surface | before | after |
|---|---|---|
| lit circuits naming a faction | 37 | **60** |
| circuits the Network holds | 5 | **28** |
| circuits marked free | 0 | **23** |
| circuits that know whose ground they are on | — | **173 of 173** |
| circuits that can name who you pay | — | 150 (the other 23 are free) |

## THE FAULT THAT TOOK LONGEST, AND IT IS A LOAD-ORDER ONE
The first cut resolved the grid-holder to a **value** at build time. The walked
city builds its power map at load — `let POWER = buildPower(om, seed)` — and the
module carrying his sentence is inlined further down the same file. Measured on
the real surface: the name resolved to `null`, **34 circuits stayed anonymous and
0 came back free**, while calling the same function directly answered "Network"
perfectly.

It is late-bound now: a **function** is accepted and asked when the answer is
needed. Same shape as the CLOUTMOD load-order bug `bohemia_loop.js` carries a
paragraph about.

Two smaller ones on the way:
- A bare `ctCanonFaction(...)` reference would have thrown `ReferenceError` at
  load and taken the whole grid with it — it is declared in a later script block,
  where hoisting does not reach. Guarded with `typeof`.
- The city module resync reported **UNRECOGNISED** for the powergrid, because I
  had edited the engine file twice without committing, so the embedded body
  matched a state git had never seen. The tool finds the old body by walking
  history. Fixed by replacing the embedded span directly and committing, and the
  resync tracks it again — 110 embedded, 110 fresh.

## AND A GATE THAT ARGUED AGAINST WHAT SHIPPED
`turf_gate` section 2 carried the same "it is a guess about his canon" sentence in
its own comment. A gate whose prose contradicts the code it guards is exactly the
rot the truth hierarchy exists to kill, so it was corrected rather than left. What
that check still proves is the thing worth proving: **handed no grid holder, the
naming is additive and `network` stays a bare category exactly as before.**

## GATES
`turf_gate` 43/0, up from 36/0 — extended, not duplicated. Seven new claims,
including that his sentence is really in his file (so the day he moves the grid
the gate says so), that the free flag really matches the second half of it, and
the late-binding proof: resolved lazily it names them, resolved to null it names
none.

## [PENDING Paolo] — NOTHING NEW
The row said "needs Paolo" and it did not. The one thing it needed had already
shipped in this lane, and the rest was in his own file.
