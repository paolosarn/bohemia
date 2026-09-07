# A DAY TAKES FIFTY-EIGHT REAL MINUTES (9/7/26)

PLUMBER lane, VAMILY row [clock math] HOW-MANY-GAME-MINUTES-PER-REAL-MINUTE.
The row: "nobody has measured how many in-game minutes pass per real minute of
play. Without that number nobody can say how many days a hundred hours holds or
whether three generations fit. Measure it on the real surface, walking and idle,
publish it, hold it in a gate."

## THE NUMBER

Measured on the demo, walking the real city with a real held thumb, reading the
game's own clock either side. Four runs:

```
  in-game minutes per real minute, WALKING   16.28  16.38  16.49  16.53
  in-game minutes per real minute, IDLE       0      0      0      0
  minutes per cell (declared: 0.084)         .0823  .0823  .0840  .0840
  cells walked                                 99    101     99     99
```

Four samples inside a quarter of a minute of each other, which is a great deal
tighter than anything else this lane has measured on this surface.

From the walking rate, the two numbers the row actually wanted:

```
  A WAKING DAY  (06:00 to nightfall at 22:00 = 960 in-game minutes)
      58 TO 59 REAL MINUTES        (58.1, 58.2, 58.6, 59.0)

  A HUNDRED HOURS OF PLAY
      102 TO 103 DAYS

  A FIVE-MINUTE SESSION
      0.085 of a day -- about eight percent
```

Standing still earns nothing, three runs out of three, exactly as the day loop
says it should.

## WHAT THAT MEANS FOR THE THINGS THAT DEPEND ON IT

The coordinator's research said the arithmetic had to be checked against the
craft: the best-known farm-and-life game runs a day in about **14 real minutes**.

**Ours is fifty-eight. Four times longer.**

And the research offered two possibilities before anybody measured: about 15 real
minutes a day (400 days in a hundred hours, three generations of 130 days each)
or about 90 (66 days, and three generations do not exist). **The truth is between
them and much nearer the good end than the 17,000-steps guess feared:** 102 days
in a hundred hours, so three generations get about 34 lived days each.

Whether 34 days is a life is DYNASTY's question and the day length is RUN's dial.
This lane measured it; it does not get to choose it.

## THE INSTRUMENT WAS WRONG FIRST, AND BY THREE AND A HALF TIMES

The first version held ONE direction on the walk pad for the whole window. That
walks you north until a wall, and then the thumb is still down and nothing is
moving. Two separate runs both stopped at **exactly 28 cells** -- which is not a
walking speed, it is the distance to the nearest obstacle.

```
  holding one direction     4.6 game-min per real-min   ->  a day in 208 minutes
  turning when blocked     16.3 game-min per real-min   ->  a day in  59 minutes
```

The identical 28 in two runs is what gave it away. A measurement that repeats to
the unit is usually measuring a limit, not a rate.

So the walker watches the player's own coordinates and TURNS when they stop
changing, the way a person does, and it reports how much of the window was spent
moving against blocked (about 22 seconds against 5). The gate goes red if the
walker never turned, if most of the window was blocked, or if barely any ground
was covered -- because that specific self-deception is now a known one.

## AND THE NUMBER CHECKS ITSELF FROM TWO DIRECTIONS

The day loop declares `0.084` minutes per cell in its own source. The walk was
measured at 0.0823 to 0.0840 without ever reading that constant. The gate holds
the two against each other, so if walking ever stops spending time -- which is
exactly the bug that was found on 8/19, where `| 0` truncated every 0.084 to zero
and **walking could not move the clock at all, forever** -- the measured rate and
the declared constant part company and the gate says so.

## WHAT THE GATE HOLDS, AND WHAT IT REFUSES TO

HELD: standing still earns nothing. The measured cost of a cell agrees with the
declared constant. A deliberately WIDE band on the rate (above 4, below 120) as a
tripwire for an instrument that stopped walking, not as a target.

PRINTED AND NOT ASSERTED: the real minutes a day takes and the days a hundred
hours holds. **The day length is a dial and it is not this lane's.** The
coordinator routed it to RUN as [a day is], with the craft's 15 minutes as the
default. A gate that pins a number nobody has ruled is this lane deciding
content, which it may not do.

## ONE THING NOT MEASURED, SAID PLAINLY

Everything here is a phone-shaped Chromium, and the walk rate depends on how fast
the box steps you. A slower phone walks fewer cells a second and therefore lives a
LONGER day in real minutes. I tried to measure that with CPU throttling in one
boot and the run was invalid -- after the first walk window the player stopped
moving entirely, so the later arms measured nothing. Doing it properly needs one
boot per throttle rate, and it is the same [PENDING Paolo] as [sixty fps]: a real
handset.

Taken by: gates/bohemia_clock_rate.js, held by gates/clock_rate_gate.js.
