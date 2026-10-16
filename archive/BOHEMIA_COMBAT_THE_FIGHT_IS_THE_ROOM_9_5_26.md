# V200 — THE FIGHT IS THE ROOM (COMBAT lane)

VAMILY job: **THE-INDOOR-FIGHT** `[indoor fights]`.
Brief: *"the door from the city works (gate 26/0); the indoor entry is the missing
half."*

---

## THE ROOM WAS ALREADY BEING SENT, AND THE FIGHT WAS THROWING IT AWAY

Nothing here had to be invented. The walked city has posted the whole building to
the fight since V161, and **the sending code says what happened next in its own
comment**:

> *"the ROOM rides along — real dimensions, because INTERIOR-MATCHES-EXTERIOR
> means fp.W x fp.H IS the footprint. **Combat does not consume it yet**: walls as
> cover and doorways as chokepoints are the RF4 half… Sending it costs nothing and
> means the spec'd version has it waiting instead of needing another wire."*

And on the fight's side of the seam, one line:

```js
if(enc){ enc.fromCity=true; enc.cityRoom=(d&&d.room)||null; }
```

**`cityRoom` is written there and read by nothing.** One mention in the whole
repository. The city measures the floor, the walls, the furniture, every doorway
and a **retreat analysis** of the room, hands the lot over, and the fight built a
street. *You walked through a front door into a firefight on a road.*

**This is the fifth time this lane has found the material already built and
unreachable.**

## AND THE BOARD NEEDED NO NEW GEOMETRY, WHICH THE STREET GENERATOR SAYS OUT LOUD

> *"three pillars in a row IS a wall, and every cover function in the demo already
> understands three pillars in a row. **No new geometry, no new collision, no new
> cover rule.**"*

- a blocked cell → a pillar
- `C` chest-to-head furniture → a pillar
- `l` knee-to-waist → a pillar with `hard:false`, **already this file's word for
  "stops the body, never the shot"** — written for glass, and exactly the rule the
  city's own legend asks for

Measured: **45 pillars against the 45 the room demands**, which is arithmetic. You
start **at the door**, because you walked in through it. They are **inside the
room**, on real floor cells, none stacked. **No cars in the living room.**

## AND A WALL STOPS A BODY NOW, WHICH IT NEVER DID

Measured before writing it: **`pillarAtXY` has exactly two callers and both are the
enemy press AI's scoring.** Nothing has ever stopped the *player* walking through
cover. Outdoors that is invisible — scattered crates are things you would walk
around anyway. In a room it is the difference between a building and wallpaper:
without it you stroll out through the back wall on turn one and the fight is a
street again.

**It binds indoors only.** Changing what a body may walk through on the street is a
rule about every fight he has ever played, and is not what this row asked for.

## TWO THINGS CAUGHT BY READING AND BY LOOKING

**1. THE SCREEN WAS ABOUT TO PROMISE A TILE THAT IS NOT THERE.** `EXIT_MIN` is 10
tiles; a real interior is 13×9. V159's way out lands **through the wall** — and the
moment walls started stopping bodies that made it permanently unreachable *with the
HUD still reading "WAY OUT 14T" at it*. Indoors there is no way-out win: V159 is
about disengaging from an ambush in the open, and you walked into this building on
purpose. **And clearing it mattered as much as refusing to place it** — on the real
wire the marker **survived from the previous fight**, and the screen does not care
which mistake it is.

**2. THE GEOMETRY WAS RIGHT AND IT STILL LOOKED LIKE A STREET.** The first
screenshot was a road with a fence in it: kerbs and sidewalk running away past the
walls in every direction. A player cannot be expected to work out he is indoors by
bumping into things — **RF4-48, already law in this lane**: *"if a mechanic can only
be understood from a menu, the recreation has failed on RF4's own terms."*

**And the answer was already written one line above where it was needed.**
`streetKindAt` opens with `if(G.arenaKind==='warehouse')return 'slab';` under the
comment ***"V100: indoors there is no street. One material, wall to wall."*** Same
sentence, same material, one more arena kind. **Nothing was cooked.** Past the
footprint the lot is painted out, which is honest because those are cells he can
now never stand on.

## WHAT THE WIRE COST

The room is posted as **its own message** immediately before the encounter.
postMessage from one window is ordered, so the board is built as a room the first
time rather than rebuilt into one — and it keeps the **handoff core**, a shared
engine module, untouched. Adding a field to its contract would have made this row
an engine change instead of a combat one.

## `NO DAMAGE BEFORE THE DIAL`

`applyDamage` is 40, archetypes byte-identical. **This row is a wire and a board.**
Nothing about damage, accuracy, range or who may shoot whom moves. The street board
is fingerprinted rock by rock across 12 seeded arenas before and after: **identical**.

## GATES AT CLOSE

| gate | |
|---|---|
| `fight_moves_you_gate.js` | **170 pass / 0 fail** (was 165/0) |
| `combat_lab_gate.js` | **931 pass / 1 fail** (the red is another lane's, pre-existing) |
| `boss_ladder_gate.js` | 87 / 0 |
| `one_engine_gate.js` | 3 / 0 |
| page errors | **0** |

Four combat_lab anchors re-pointed: `worldShift`'s two windows grew by the wall
test, V100's sentence now covers the room, and V162's spawn-snap window grew by the
cell placement — **widened to 1400 after measuring the real gap at 1116**, rather
than guessed at.

**And one gate check was wrong while the code was right:** the pillar arithmetic
read 45 against 44 because it subtracted the cell you stand on, which is the *door*
— standable, and never going to be a pillar. Two minutes of arithmetic beat nudging
the expectation.

## WHAT COMES AFTER

1. **THE DOOR AS A FIGHTING RETREAT** — step back onto it and be out. Not built:
   you start *on* the door, so it would be an instant win, and fixing that is a
   mechanic rather than a wire.
2. **THE CITY SAYS HOW MANY MEN ARE IN THERE AND THE FIGHT ROLLS ITS OWN NUMBER.**
   `enter()` sets `numEnemies` from the roster and then `setupEnemies` overrides it
   with `rollEncounterSize()`. Pre-existing, found here, **not this row**.
3. **The room's `ground` channel (hazards) and its `retreat` analysis are still
   unread.** Interiors carry no hazards today, so there is nothing to read yet —
   but the wire now exists.
4. Doorways as **chokepoints** — the city marks every door and combat only uses the
   first one, as the player's start.
