# THE FIGHT IS ON THE GRID (COMBAT, 8/17/26, v162)

Paolo, 8/17: *"we really need this shit to play exactly like rogue fable four
right now."*

## MEASURED FIRST, AND IT IS THE WHOLE ANSWER

Twenty arenas, every body and every rock:

```
COVER sitting on an integer tile:   1405 / 1405
BODIES sitting on an integer tile:     16 / 160
ENEMY MOVES: shortest 0.90, median 1.80, longest 1.80 tiles
MOVES THAT WERE EXACTLY ONE CELL:       0 / 64
```

**The board is a perfect tile grid and the people were floating over it.** The
rocks are on cells. The men were at 7.34 tiles on a bearing of 2.1 radians,
sliding 1.8 tiles a turn in whatever direction the scorer liked.

**That is why it did not play like RF4, and it is not a feel problem, it is an
arithmetic one.** A roguelike is playable because you can *count*: he is four
tiles away, my gun reaches twelve, if I step back he steps forward and nothing
changes. None of that is available when a man is 7.34 tiles out and moves 1.8.
Positioning collapses into vibes, and the only honest strategy left is to sit
still and shoot — **which is exactly what he has been reporting for a week.**

**The player was already right.** His move is `v[0]*1, v[1]*1` over the eight unit
offsets, commented *"full tile steps, diagonals included (Chebyshev)"*. One tile,
always. Only the enemies were never held to it.

## AFTER

```
BODIES sitting on an integer tile:    160 / 160
MOVES THAT WERE EXACTLY ONE CELL:      64 / 64
STILL on a tile after the player walks: 960 / 960
```

## WHAT SHIPS

1. **Every body lives on a cell.** Spawn snaps; `worldShift` re-snaps. The grid is
   an *invariant*, not a one-time tidy-up.
2. **A man moves exactly one cell**, to one of the same eight neighbours the
   player uses. The scorer is untouched — it still wants an angle, still keeps its
   standoff, still pushes an objective. It just has to say all of that in a legal
   move, like the player always has.
3. **The player's cell is his.** OCCUPANCY LAW stops being a 0.6-tile fudge and
   becomes what it always said: one body per cell, checked as integers.

Nothing about the fight's *content* changed. Same men, same guns, same dial. They
stand on tiles now, which is the thing that makes a board readable.

## THE DEAD CONSTANT

`PRESS_STEP=1.8` — how far a man slid in a turn — is now unused. **Deleted, not
left orphaned.** Leaving it declared and unread is the present-and-dead shape that
cost this project `inMyRange` and the damage faces twice over: a dead dial is
worse than no dial, because the next session tunes it and nothing happens.

## THE MUTATION THAT ALMOST FOOLED ME

I deleted the re-snap guard to check it was load-bearing, and **every ordinary
measurement stayed perfect** — 160/160, 960/960. A player step moves the world by
an integer vector, and integers stay integers, so the happy path could not see it.

I nearly concluded my own guard was decoration. It is not. `worldShift`'s `mv()`
clamps a body to a **0.6 minimum radius**, and 0.6 is not a cell. Constructed the
case and measured both ways:

```
walk straight into a man
  WITH the guard:     he ends at (1.000, 0.000)   ON A CELL
  WITHOUT the guard:  he ends at (0.600, 0.000)   OFF THE GRID, and inside your own cell
```

That exact scenario is now the gate check, and disabling the snap takes it red.

## ON THE RF4 SPEC

The 8/16 law routes the teardown spec to LAB and says COMBAT builds from it. **The
spec still does not exist**, and he has now said twice, in his own words, to go
(8/16: *"look up rogue fable four weapon ranges please for the love of God"*;
8/17: *"play exactly like rogue fable four right now"*). Newest date wins, and a
direct instruction outranks a routing note.

Nothing here is a copied RF4 mechanic in any case. A tile grid is the format every
roguelike since 1980 is written in, and this is **Bohemia's own OCCUPANCY LAW**
finally applied to the bodies it names.

## GATE

`combat_lab_gate.js` — **820 pass / 0 fail**, four new grid checks plus the clamp
case. Three existing checks re-pointed: they pinned the slide's implementation
(`PRESS_STEP`, the hypot cap, the `Math.max` standoff clamp, the two-radius extra
push). Every law behind them survives intact — a move must beat standing put, a
man may be allowed past, the arc alone cannot carry him round — only the
implementation moved onto cells.

## HIS OTHER NOTE

*"Nothing is going in the run yet."* Understood, and the run/city entry wire from
yesterday is left alone rather than extended. It is one dial (`FIGHT_ODDS`) from
being switched off entirely if he wants the run quiet while combat is being fixed.

TOOL: `tools/bohemia_combat_the_fight_is_on_the_grid_patch.py`
