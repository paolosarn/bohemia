# THEY ARE ON THE WAY — and the honest headline is that it did not move the ship test
(9/6/26, LIFE + CITY lane. VAMILY job `[more people] POPULATION-DEFAULT`, round 5. The row stays OPEN.)

## WHAT WAS STILL WRONG

Four rounds put people in the houses, gathered their days at places, marked the
crowds on the map and made them audible. **They still teleported.**

Measured on the demo, the 61 people around where he wakes, minute by minute through
one morning, with a jump defined as **moving faster than the world walks**:

```
journeys finished in under a minute        34
the biggest                               477 CELLS — half a kilometre in sixty seconds
people ever visibly on the way, all day   NONE
```

And the schedule already has rush hours. **16 of 61 change place at 08:00, 14 at
15:00, twenty-eight at 17:00, 16 at 19:00.** Four times a day this neighbourhood
empties and refills, and not one of those journeys had ever happened on a street.

A city is met on the way to work. That is where strangers share ground, and it looked
like the plainest answer left.

## WHAT SHIPPED, AND NOT ONE NUMBER OF IT IS MINE

A journey takes **distance × `MIN_PER_CELL`** — the surface's own 0.084 minutes a
cell from `BB-ROADS-ARE-FAST`, **the same cost the player pays** to cross one. The
schedule's own block boundary says when they set off; the block before it says where
from. A twenty-cell errand is over in under two minutes; the 477-cell commute takes
forty. Both are the world's own arithmetic.

**A walker stands on ground a person can stand on.** The straight line between two
places runs through buildings. A two-cell nudge was not enough — 68 journeys still
snapped — so a blocked walker steps **back along their own route** until the ground
is walkable, which is what anybody going round a building does. A body inside a wall
would be worse than a body that teleports.

## AND THE HONEST HEADLINE

Twelve walks from the wake cell at 08:00, 12:00 and 17:00, counting only people not
already on the glass, run **before and after**:

```
before   3 of 12 walks met somebody
after    3 of 12 walks met somebody
```

**IT DID NOT MOVE THE SHIP TEST.** What did change:

```
teleports              34 -> 26        biggest 477 cells -> 400
visibly on the way      0, all day, every hour  ->  peak 7 at once
cost                    0.07 ms to place all 61 at rush hour
```

That is **a defect in the world's honesty fixed, not a meeting rate improved.** B4 in
the gate states it in those words, because a gate that let those two be confused
would be doing the confusing.

Is it worth shipping anyway? Yes, and for a reason that has nothing to do with the
ship test: **a body crossing half a kilometre in sixty seconds is a bug regardless of
whether fixing it helps anybody meet anybody.** It costs 0.07 ms. The world is more
honest than it was.

Twenty-six teleports remain, and they are named rather than hidden: most journeys are
short enough (median 20 cells, under two minutes) to finish between two samples, and
a few long ones still snap when the route is blocked past the 24-cell backtrack.

## THE PROBE THAT REPORTED THE FIX MADE IT WORSE

The first measurement after building this said teleports had gone **from 59 to 610**.

The probe called anything moving more than **two cells a minute** a teleport. The
world's own walking speed is **twelve** cells a minute. So the moment people started
actually walking, every honest step counted as a teleport and the instrument reported
the fix as a catastrophe.

> **A THRESHOLD THAT IS NOT THE WORLD'S OWN NUMBER MEASURES THE PROBE.** The
> definition of "too fast" has to come from the same place the speed does — here,
> `MIN_PER_CELL`, which the file was already using to charge the player.

With the threshold corrected, before was 34 and after was 68 — which is how the
wall-clipping problem was found at all, and led to the backtrack that took it to 26.

## THE GATE

`gates/on_the_way_gate.js`, **8 pass / 0 fail**, in the cut demo.

| mutation | legs that went red |
|---|---|
| remove the commute, they teleport again | B1 (34 and 477), B2 (peak 0) |
| let walkers stand inside walls | B3 (9 hours with a body off walkable ground) |

## WHERE THE JOB IS AFTER FIVE ROUNDS

1. people live at their front doors, on ground that has houses
2. their day gathers them at places instead of scattering them — 2 of 32 walks
   meeting somebody became 9 of 32
3. the map shows the thirteen crowds
4. the street says when one is within earshot
5. and they walk there instead of vanishing

**He still does not meet people without trying.** Rounds 2 and 3 moved the number;
rounds 4 and 5 made the world honest and legible without moving it. That is worth
saying plainly rather than dressing up.

And the thing standing behind all five is unchanged and is not mine: **`[PENDING
Paolo]` — is the valley the GDD's 69,000, or the zone map's ruled 297 times the dial
(5,940)?** Every mechanism here reads four times louder at the larger number, and no
mechanism closes a gap of twelve.

## THE STANDING NOTE

**REPORT THE NUMBER THAT DID NOT MOVE.** The temptation after five rounds is to lead
with the teleports falling and let the meeting rate go unmentioned. The meeting rate
is the row's whole reason to exist, it did not move, and a record that buried that
would make the next round start from a lie.
