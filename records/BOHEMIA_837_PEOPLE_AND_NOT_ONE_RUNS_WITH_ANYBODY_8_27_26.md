# 837 PEOPLE, AND NOT ONE OF THEM RUNS WITH ANYBODY

**8/27/26 — FACTIONS lane. A measurement, and what it means.**

## WHY I WENT LOOKING

The CHARACTER lane's handoff this week ended with a sentence aimed at the whole
fleet:

> **IF YOU TAKE ONE THING FROM THIS HANDOFF: WHEN HE ASKS FOR SOMETHING, CHECK
> LATER THAT IT ACTUALLY GOT WORN.**

Four garments cooked for the Colorful in July, with Paolo's own words attached to
them, worn by **nobody** for five weeks. The material existed and never reached
the player.

So I pointed that at my own lane and asked the only question that matters about
everything this session shipped: **can he reach any of it.**

## THE MEASUREMENT

Real surface, cold start, no save, the player's actual spawn:

| | |
|---|---|
| player spawns at | cell **48,48** |
| cells swept around him (±6) | **169** |
| how many of those cells are empty | **0** |
| **people standing in them** | **837** |
| **how many of those 837 run with anybody** | **0** |
| nearest affiliated person | **9 cells** |
| nearest faction base | Colorful at 34,33 — **29 cells** |
| in fine tiles (FN = 128) | **3,712** |

`REACH_CELLS` is **12**, so nobody within roughly **17 cells of his own front
door** *can* be affiliated with anyone. It is not a sparse neighbourhood. It is
arithmetically empty.

The open-world research puts the useful distance between points of interest at
**60–120 seconds of travel**. This is ten to twenty times that.

### AND IT IS NOT A MEASUREMENT ARTIFACT

The obvious objection is that the sweep is hitting world that hasn't generated
yet. It isn't. **Zero of the 169 cells are empty and there are 837 people
standing in them.** Gate claim K0 exists so that objection can't be raised again
without the numbers answering it.

## WHAT THIS MEANS

Belonging. The rungs. The wall. Commitments. Word travelling the acquaintance
graph. The canon wars. Earned enemies. The board.

**All of it sits behind a 3,712-tile walk, and nothing anywhere told him it was
there.** Every gate in this repo was green the whole time.

It is the Colorful garments again, at the scale of an entire lane.

## WHAT I DID NOT DO, AND WHY

`AFFILIATED_RATE` (0.30) and `REACH_CELLS` (12) are both marked
`[PENDING Paolo]` in `bohemia_agents.js`. Widening either would make the valley
affiliated **by my decision instead of his**, and it would do it to every cell in
the game at once.

**MAP LAW**: Claude never designs map layouts. The bases don't move. The spawn
isn't mine either.

So the dead zone is **reported, not tuned**. This record and the gate's printed
measurement are the report.

## WHAT IS MINE, AND WHAT I BUILT

The board. And the board is where the game can stop pretending the valley is
empty.

It grows a second half: **THE VALLEY**. Every outfit the map holds, which way
their ground lies from where he is standing *right now*, how far in plain words,
and whether he has ever dealt with them. Nearest first.

```
THE VALLEY

NEAREST GROUND THAT BELONGS TO ANYBODY: COLORFUL, NORTHWEST, A LONG WAY OFF.

COLORFUL      NORTHWEST · A LONG WAY OFF             NEVER MET
MOB           WEST · A LONG WAY OFF                  NEVER MET
HOMELESS      WEST · THE FAR SIDE OF THE VALLEY      NEVER MET
CHURCH        NORTHWEST · THE FAR SIDE OF THE VALLEY NEVER MET
CUSTOM        YOURS · THIS IS YOUR GROUND
NETWORK       WEST · THE FAR SIDE OF THE VALLEY      NEVER MET
VOLUNTEERS    SOUTH · THE FAR SIDE OF THE VALLEY     NEVER MET
BLUES         NORTH · THE FAR SIDE OF THE VALLEY     NEVER MET
```

The nearest one is called out on its own line, because **a list is not a
direction** and a system with no next step has no next step.

**TAB: RUN**, the **⚔ OUTFIT** chip in the top bar.

## THE DESIGN CALL IS GROUNDED IN HIS OWN CANON, NOT IN A PREFERENCE

Should the game tell you where the outfits are, or should you find them?

**REALISM FIRST**, which is his identity law. Would somebody living in this
valley know whose ground is whose? **Yes.** That is what territory *means*, and
not knowing would be the unrealistic option. This repo already says so out loud:

- **LIGHT = TERRITORY**
- **CLUSTERED POWER** — 12% lit, *owned*, the network eerily perfect
- **NOBODY PATROLS THE DARK**

Territory is visible by construction. What he does *not* know is any of them
personally, and that half is completely untouched: he still walks there, turns
up, hits the wall, and earns every rung.

### A BEARING, NOT A WAYPOINT

The open-world research is consistent that the working middle sits between
fully-guided (pins, markers, minimap icons) and fully-organic: you see something
in the distance, you travel toward it, and from the new vantage point you spot
the next thing.

A compass direction and a plain-English distance is what a person actually
carries in their head. **A pin on a map is a HUD.**

## THE NUMBER PRINTS IN EVERY SUITE RUN NOW

```
MEASURED: 837 PEOPLE within 6 cells of the spawn across 169 cells
          (0 of them empty), and 0 of those people run with anybody.
MEASURED: player spawns at cell [48,48]; nearest affiliated person 9 cells
          (Colorful); nearest base Colorful at 29 cells = 3712 fine tiles
```

A number nobody looks at is exactly how a hole this size stayed invisible for two
weeks behind a green suite. If somebody fixes the spawn or the placement, this
line moves and everyone sees it move.

## AND I CAUGHT MY OWN CLAIM BEING DECORATION

K3 first checked only that no row said NORTH and SOUTH at once. **A completely
inverted compass passes that without blinking** — and an inverted compass is the
single likeliest bug this feature has, because screen `y` grows *southward* here
and every instinct says otherwise.

It now recomputes every bearing from the base positions. Mutation: flipping north
and south turns it red.

## GATE

`gates/faction_between_gate.js` — **73 claims, 0 failed** (was 65). Part K is new.

| mutation | went red |
|---|---|
| the board stops listing the valley | K4, K5, K7 |
| the wrong outfit named as nearest | K5 |
| the compass inverted | K3 |

## WHAT COMES AFTER

The board makes the system **findable**. It does not make it **near**. That is
the open question and it is not mine to answer:

1. **The spawn and the faction bases were placed by two systems that have never
   heard of each other.** The player's house comes from one rule, the bases from
   another. Nothing reconciles them. That is a fleet-level integration gap, not a
   faction bug.
2. **Or the dials move**, and both are his: `AFFILIATED_RATE` and `REACH_CELLS`.
3. **Or outfits get people who travel.** Real gangs have territory *and*
   runners; a Cartel man in your neighbourhood is completely realistic. That
   would need a new dial, so it needs his ruling first.

Nothing here is blocked on him. The lane keeps building; this is the thing that
decides whether any of it gets played.

## Sources

- [How to Design an Open-World Game](https://gamedesignskills.com/game-design/open-world/)
- [Open World Game Design: Pacing, Points of Interest, and Player Freedom](https://www.strayspark.studio/blog/open-world-design-pacing-player-freedom)
- [Deconstructing Open-World Game Mission Design Formula](https://arxiv.org/pdf/2603.18398)
