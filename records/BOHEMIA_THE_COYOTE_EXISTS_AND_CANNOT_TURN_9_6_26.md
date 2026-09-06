# THE COYOTE EXISTS AND IT CANNOT TURN (RUN, 9/6/26)

VAMILY `[animal first]` / THE-GAME-OPENS-AS-THE-ANIMAL. **Claimed, measured,
handed back to OPEN in the same round, and this is why.**

> Gen 1 is an Animal by his pillar and the demo opens as a human family at a
> table. Make the first sixty seconds of the demo the coyote: **the four-legged
> renderer exists (CHARACTER [animal rig] proves it)**, DYNASTY's day 1 and day 2
> say what a coyote can do with no hands.

The clause in bold is the row's own stated dependency, and **CHARACTER's
`[animal rig]` row is still OPEN** — its job is to *prove* the renderer runs
through the rig pipeline, and that has not happened. So the first thing this
round did was measure it rather than inherit the claim.

## WHAT IS ACTUALLY THERE, AND IT IS MORE THAN NOTHING

- **The coyote is real and already in the walked city.** `banks/BOHEMIA_WILDLIFE_SPRITES.js`
  is inlined into `slices/BOHEMIA_CITY_WORLD.html`, carrying eight animals —
  raven, grackle, pigeon, rat, **coyote**, and three dogs — at **16×16**, three
  frames each: `rest`, `look`, `go`, built at the 45 degree law.
- **Scale is NOT the blocker, which is the surprise.** The draw path already runs
  a size ladder — `C >= 64 ? 64 : (C >= 32 ? 32 : (C < 17 ? 8 : 16))` — and its
  own comment says it is *"the same one the player and the residents use: never a
  fractional scale, so nothing in this world is ever resampled."* A 16px source
  can already be put on the glass at 64.

## WHAT IS NOT THERE, AND BOTH HALVES ARE THE RIG

**1. There are no facings. Not one.** The player rig is 56 with eight facings.
The coyote has three frames and no direction, and the draw call is a plain
`drawImage` with no flip. A coyote you walk in eight directions would look
identical in all eight.

**2. *** THE ONE MOTION FRAME EVERY ANIMAL HAS IS NEVER DRAWN. *** ** Both draw
sites in the city choose between exactly two frames:

    42789:  var frame = st === 'settled' ? 'rest' : 'look';
    42921:  var frame = s.state === 'alert' ? 'look' : 'rest';

`go` is in all eight animals, in the bank, baked, shipped — **and nothing in
Bohemia has ever asked for it.** No animal in this game moves. The factory built
the walk and the world never called it.

## WHY THIS LANE STOPPED INSTEAD OF BUILDING

Both blockers are a rig pass, and the rig is CHARACTER's — their `[animal rig]`
row exists to do exactly this. **ONE SYSTEM, ONE SESSION.** Building a
sixty-second opening you play as a directionless single-frame body would also
fail COMPARE EVERY PIECE OF ART TO THE WORLD on the first screen a stranger ever
sees, which is the worst possible place to fail it.

**The row is handed back to OPEN**, unblocked the moment `[animal rig]` lands.
Nothing about the row is wrong; its dependency is simply not built yet.

## FOR CHARACTER, WHOSE ROW THIS FEEDS

Three things that should save that round its first hour:

1. The body, the palette and the 45-degree perspective **already exist** — this
   is a rig pass, not a new animal, exactly as DYNASTY concluded.
2. **The scale ladder to 64 is already built and already shared with the player**,
   so matching the player's size needs no new machinery.
3. **`go` has zero callers.** Whatever else that row does, the cheapest true thing
   in it is that eight animals already own a walk frame nobody has ever seen.

## AND ONE CORRECTION TO THE ROW'S OWN TEXT

"the four-legged renderer exists (CHARACTER [animal rig] proves it)" —
the renderer exists; **that row does not prove it, because that row has not been
run.** DYNASTY's day 1 record already carries the honest version, written as a
correction to itself: *"there is no coyote at THE PLAYER'S scale and no facings
— the ambient body is 16 pixels with three frames and no direction, while the
player rig is 56 with eight. So gen 1 needs a life stage and a rig pass, not a
new animal."* That was right, and this round confirms it on the shipped file.
