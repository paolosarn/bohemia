# ROAD INTERRUPTS ON FOOT (RUN, 9/5/26)

VAMILY `[street encounters]` / ROAD-INTERRUPTS-ON-FOOT. Open since 8/31.

THE ROAD INTERRUPTS shipped on 8/27: twelve approved road moments, the encounter
director wired to the clock, 70/20/10 held on the nose, the card, the leavings,
the choices. **All of it fired only when you were looking at the map.**
`roadInterrupt` had exactly one caller and it sat inside `MODE==='city'`, so the
surface Paolo actually walks — the one the demo opens on — had never produced a
single one of them in nine days.

## TWO THINGS WERE WRONG AND ONLY ONE OF THEM WAS THE MISSING CALL

**1. The missing call.** The human branch of `stepOnce` spends 0.084 minutes a
cell and handed that time to nobody. It hands it to the same director now — 5.04
seconds a cell, times the cells that beat actually covered, because a bike covers
four. No new pacing, no second director. *The time was always being spent, it
just never bought anything* — word for word the sentence the city branch's own
comment used on 8/27, and it was just as true one branch down.

**2. *** The interrupt was reading the map cursor, not the player. *** ** It took
the district **and** the power-grid lookups off `city.x` / `city.y`, which are
overmap cells that only move in city mode. Wired to the walked street unchanged,
it would have decided what happens to you from wherever the map was last left
sitting.

That is the one that would have shipped invisibly under a working-looking
feature: the call there, the time flowing, the cards appearing — and every answer
about the wrong place. `roadWhere()` answers "which overmap cell is the player
in" once, per mode, and every reader uses it. **Two places both claiming to be
where you are is a bug this file has now fixed five times under five different
names.**

## MEASURED BEFORE BUILDING

Because a feature that cannot reach the player is the trap this lane fell into
twice this round:

- **3,633 of 9,216 overmap cells (39.4%)** are one of the seven road districts
  the table covers; arterial alone is 2,434.
- The nearest road-district cell to the spawn is **one cell away**, at (49,47).

And measured after, on the served demo: walking off the suburb into arterial
produced **`coyote_shadow`, ambient, with its card on screen** — *"ON THE ROAD ·
ARTERIAL · DAY / COYOTE SHADOW / A coyote picks you…"* — and zero page errors.

## ON THE RATE, REPORTED RATHER THAN TUNED

Over one walk the director refused with `NO_TABLE` 6 (the suburb, correctly),
`GAP` 17, `NO_BUDGET` 21, and fired once.

`NO_BUDGET` dominating is **not** a wiring fault. Budget is `tension × quiet` and
both accrue with spent time, so on foot it *ramps* instead of jumping: a moment
needs roughly 180 seconds of walking — about thirty-six cells — where one map
press buys six hundred seconds outright. **Moments are rarer on foot than on the
map.** That is the approved director's own shape, and re-tuning approved pacing
without a ruling is not mine to do.

## *** AND THE HARNESS WAS WRONG TWICE BEFORE THE FEATURE WAS RIGHT ONCE ***

Two cuts of the gate reported **zero** moments where a hand-walk had already got
one. Both times it was the walk, not the game: **420 presses produced seventeen
moves.** It was pressing into buildings, and **a step that does not move spends
no time**, so the director was handed nothing. The harness was standing still and
calling it walking — the same family as the circle it walked two rounds ago. It
checks its own position every single step now and turns the moment it stops
moving.

A third claim was wrong on its merits rather than broken: it *asserted* the
director had refused with `NO_TABLE` at least once. That is a fact about the path
the harness happened to take — a walk that goes straight onto road ground never
sees one — and it went red on a run where the feature worked perfectly. The rule
it was reaching for (**NO GLOBAL SPAWNS EVER**: a district with no table produces
nothing, never something borrowed) is now tested directly against the module,
where it cannot depend on which way the wind blew.

## MUTATION PROOF

- Take the foot call back out → **4 red**, including zero moments over a walk.
- **Put `roadWhere` back to reading `city.x`/`city.y`** → the player walks into
  arterial and **the director is told SUBURB, ninety-nine times**, and fires
  nothing. The second bug, exactly.

## RESULT

    ROAD ON FOOT 12/0 (new)
    walked 17 cells, blocked 64 presses, ended in arterial, FIRED 1

No new content, no new tokens, no new pacing. Same twelve moments, same 70/20/10,
same costs, same card. **NO DAMAGE BEFORE THE DIAL** is untouched: the director
cannot return damage and the cost table is still minutes.
