# BOHEMIA — PATROL: OWNERS WALK WHAT THEY LIGHT (7/16/26)

Next on the list after the power grid, per the last session: **patrol.**

## Why this module exists
One locked line: **LIGHT = TERRITORY.** If a live circuit is owned, the owner is
not an abstraction on a map. Somebody walks it. The patrol *is* the ownership,
made visible at street level. You read who owns a block by who is walking it,
and you read it from a rooftop before anyone sees you.

## The rule
```
power.at(cell).live === false   ->   ZERO patrols.
```
**Nobody patrols the dark.** That falls straight out of the CLUSTERED POWER LAW:
12% alive, every living cluster owned, and the other 88% is nobody's. Walking
into darkness in Bohemia means walking out of everyone's jurisdiction at once,
which is both the safest and the worst thing that can happen to you.

## NETWORK IS EERILY PERFECT — your word, now a behaviour
That phrase was the whole design spec and it needed no addition:

| owner | patrols | pause | drift | reverses | gap |
|---|---|---|---|---|---|
| **network** | 2 | **0.00** | **0.00** | **never** | **EXACT** |
| faction | 2 | 0.10 | 0.15 | yes | offset |
| settlement | 1 | 0.25 | 0.25 | yes | offset |
| solar_lone | **0** | — | — | — | — |

A NETWORK patrol never pauses, never drifts, never turns early, and two of them
hold their gap **forever**. The gate proves it over 500 steps: gap 35 → gap 35,
zero pauses, zero reversals. Everyone else is human and the contrast is the tell.
You don't get told which blocks are NETWORK. You notice that the guards are too
correct.

A lone survivor with a solar panel does not patrol. His light is on and nobody
is walking. That reads as exactly what it is.

## The route
Sidewalk rows, west to east on top, **cross at the block end**, east to west on
the bottom, cross back. A closed loop. A patrol that doesn't close its loop is a
guard teleporting home every lap and the eye catches that instantly.

The crossing legs sit at x=0 and x=W-1 — the block boundaries, which is where
the intersections are. **Nobody jaywalks mid-block.** Same reason CROSSWALKS
ONLY AT INTERSECTIONS exists: the corner is where you cross, in Vegas and
everywhere else.

## Laws obeyed
- **120 BPM** — steps land on the grid tick, never between
- **I-MOVE-YOU-MOVE** — patrols advance on your step, not on wall time
- **OCCUPANCY** — a blocked patrol **waits**. It does not clip and it does not
  teleport. `commit(false)` costs it a beat, same as it would cost you
- **SIDEWALK SANCTITY** — patrols walk the sidewalk. The whitelist governs
  objects; people are not props

## The valley right now, seed 12345
```
9,216 cells · 527 lit · 688 patrols walking
settlement 298 · faction 212 · network 178 · solar_lone 0
in the dark: 0
```
688 bodies, and every one of them is standing in somebody's light.

**Gate: `patrol_gate.js`, 28/28.** Added to `bohemia_gates.py`.

## Still yours
WHERE the NETWORK glows is still your map call, unchanged. The machinery reads
whatever you rule. Right now their zones fall where the seed put them.
