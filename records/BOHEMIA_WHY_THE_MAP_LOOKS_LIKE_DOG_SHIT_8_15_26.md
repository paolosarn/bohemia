# WHY THE MAP LOOKS LIKE DOG SHIT — MEASURED (8/15/26, WORLD lane)

## HIS WORDS

> "The freeways are not fucking done and I saw like blue shit going on. Maybe
> that's like placeholder graphics or something but yeah, not close to being
> done. Looking like dog shit."

## I STOPPED. THAT IS THE FIRST THING IN THIS FILE.

Two corrections on the freeway in a row. Under
`laws/BOHEMIA_ADDENDUM_STOP_PRODUCING_7_26_26.md` a second rejection ends the
feature for the session, and "writing a fourth version of anything means you
already failed — stop and say so instead of fixing the attempt." **No third
freeway pass was written.** What follows is a measurement, not a fix.

## HE WAS RIGHT ABOUT THE PLACEHOLDER GRAPHICS. I WAS WRONG, TWICE.

Last turn I told him the blue was wash/water cells. I said it because the blue
survived a change I made, **not because I measured it** — which is the exact
thing this repo bans. Measured now, in the running app:

**18 district types have NO hero art at all, covering 372 cells.** Every one of
them falls through to the flat coloured-diamond switch — which is *literally*
placeholder graphics. He guessed that from a screenshot and he was right.

| district | cells | what it is |
|---|---|---|
| **resort** | **118** | the casino resorts |
| **strip** | **81** | **THE STRIP** |
| airbase | 54 | |
| airport | 40 | |
| estate | 29 | |
| gated | 20 | |
| convention | 6 | |
| casino | 5 | |
| sphere / prison / dam | 4 each | |
| fort / springs / strat / minigp / highroller / luxor / sign | 1 each | the landmarks |

Plus **74 water + 60 wash cells** drawing flat blue diamonds with no crossing
treatment where they cut the grid — that part of my answer was right, but it is
the smaller half of the problem.

## THE HEADLINE, AND IT IS NOT THE FREEWAY

**The Strip and the resorts — 199 cells, the single most recognisable thing in
Las Vegas — render as flat coloured diamonds.** No hero art exists for them.
That is what a player's eye lands on first, and it is why the map reads as
unfinished no matter what the roads do.

And this is not a new discovery he needs to rule on: **he already commissioned
it.** 8/11, verbatim:

> "RN WE ARE GOING TO MAKE THE STRIP HERO ART RN EACH BUILDING UNIQUE AS MUCH AS
> WE CAN LIKE WE ARE FOR EVERYTHING"

The ruling has been sitting there while this lane polished roads.

## WHAT THIS MEANS FOR THE FREEWAY WORK

The freeway *ribbon* fix is real and measured (968 cells were being classified
as junctions and never turned; now 461 north-south / 487 east-west). It is
shipped and it is not being reverted. But it is **not what he is looking at**,
and doing a third pass on it would be producing while he is unhappy with the
baseline — which the STOP PRODUCING law names as the failure itself.

## THE ONE THING BLOCKING EVERYTHING

Sixty district heroes exist and eighteen types have none. The eighteen include
the Strip, the resorts, and every named landmark. Until those exist, every other
improvement to the map is polish on a surface whose loudest cells are flat
colour.


---

## I TRIED TO BUILD IT AND HIT THE REAL BLOCKER (same day)

Told to go, I wrote `build_resort()` and `build_strip()` into the hero factory
— podium + tower + porte cochere + parking garage, which is the canonical Vegas
massing (podium floors 1-4 carry the casino/restaurant/convention, the guest
tower stands on it from 5 up, the porte cochere wraps the tower base, the garage
attaches to one end). The factory crashed with `KeyError: 'resort'`.

**That crash is the actual finding.**

The hero factory pulls each district's palette **live** from that district's own
engine module, because of HERO=WALKABLE (Paolo 7/24): the hero and the walkable
tile must share one source of truth. Measured:

- **63 walkable district modules exist.**
- **Of the 18 district types with no hero art, only 2 have a walkable module.**
- `resort`, `strip` and `casino` have **no walkable district at all.**

So the Strip and the resorts do not merely lack an icon. **They do not exist as
places.** There is nothing to walk into, which is why there is no palette, which
is why there is no hero, which is why they draw as a flat coloured diamond.

**Building the hero first would have violated HERO=WALKABLE** — it would put a
resort on the map that opens onto nothing. I reverted the builders rather than
ship a picture with no place behind it; the factory is back to green.

## THE ORDER THIS HAS TO HAPPEN IN

1. **The walkable districts first** — `resort`, `strip`, `casino` as real
   district modules with legends, the way the other 63 are built
   (`laws/BOHEMIA_HOW_TO_BUILD_A_DISTRICT.md` is the method).
2. **Then the heroes**, which then come almost free, because the factory reads
   the district's own palette and the massing research is already done and
   recorded above.

That is one district build, not an art pass, and it is the largest single thing
standing between the map and looking finished.
