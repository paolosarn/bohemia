# EVERY OVERHEAD IN THE GAME WAS PAINT ON THE FLOOR
# 8/27/26, WORLD lane. Paolo caught it mid-turn, by eye, from one screenshot.

> "BRO PLEASE UNDERSTAND THE WORLD IS FROM AN OVER THE TOP 45 DEGREE VIEW DID YOU
>  JUST MAKE SOMETHING THATS 90 DEGREE OVERHEAD VIEW?"

**He was right, and it was not only the bridge.**

## THE FLAG WAS SET AND NOTHING EVER READ IT

`realizeCell` has set `c.overhead = true` on every overhead tile in this game since
August. Grepped the whole walked surface: **that flag is never read by the draw.** The
entire overhead branch is one line —

    if (tl.layer==='overhead') { c.g = pal; c.walk = true; c.overhead = true; return c; }

— a flat colour on the ground plane. So every one of these was painted onto the floor and
seen from **straight above**:

- the freeway overpass decks (116 cells)
- the Strip's enclosed pedestrian bridges
- fuel-station canopies
- downtown skybridges
- shop awnings
- substation busbars

In a game whose own **45 DEGREE ART LAW** (7/17) says every original thing is seen from
the world's three-quarter view and **never flat**.

## WHAT THIS GRID CAN AND CANNOT DO, HONESTLY

The world is **one layer**. The ground underneath a deck is not stored anywhere, so it
cannot be revealed by drawing — there is no "under the bridge" pixel to show.

But **what makes a thing read as ABOVE in this projection is not the hole under it.** It
is the **side you see** and the **shadow it throws**. A wall gets exactly that treatment —
a front face drawn toward the camera — and that is precisely why walls read as walls in
this build and overheads did not.

## SO AN OVERHEAD GETS BOTH, ON THE CAMERA-FACING EDGE OF EVERY RUN

`overheadPass()`, run in the same two-pass order as facades (behind him, then in front),
so a deck between him and the camera covers him exactly as a wall does:

- **THE FASCIA** — the beam/soffit you look at from the south, in the deck's own colour
  darkened, because a face turned away from the sky is darker than a top facing it. That
  is the same rule the wall pass and the 45-degree law already use.
- **THE SHADOW** — thrown on the ground beyond the beam, fading over two cells like every
  other cast shadow in this build, so the deck floats instead of lying down.
- **TWO EDGES** — a sky-lit lip where the deck's surface turns over into its own side, and
  the dark underside line at the bottom of the beam. Those two lines are what say *this
  has thickness*.

## THREE THINGS THE PICTURE CAUGHT THAT THE CODE LOOKED FINE ABOUT

**1. THE FIRST HEIGHT WAS TOO SMALL TO SEE.** Written as a fraction of one cell it came
out **three pixels** at play zoom, and the bridge still read flat. A side you cannot see
is not a side. An overpass sits about five metres over the road — seven tiles at 0.75 m —
and a wall in this engine is already drawn **three cells** tall for the same reason.
Apparent height here is counted in CELLS, like everything else that stands up.

**2. THE BRIDGE GREW WALLS DOWN THE MIDDLE OF ITSELF.** The pass finds the camera-facing
edge of a run by asking whether the cell to the south is also overhead — and the deck's
**lane stripes** were kind `marking`, which answered NO. So every stripe put a bridge
*side* across the middle of the bridge: a row of dark beams standing on the deck.
A deck, its paint and its parapet are **one object at one height**; the paint is not lying
on the ground under the bridge. All three are `overhead` now, and because the street
contract counts overhead as corridor, the crossing still measures exactly as wide as the
road it carries.

**3. THE STRIPE WAS TOO BRIGHT FOR A TOP SURFACE.** `roadcell_gate`'s visual-constitution
check caught it the moment the stripe moved onto the overhead layer: a top surface has its
own value band (72.8–137.4) and the arterial's worn white is **171**. The band is right
and the colour was wrong. A lane line on a deck that has taken thirty Mojave summers with
nobody repainting it is **not white** — it is a bleached ghost of white, which is what
every other marking in this game already says in its own act1 text. Measured to 134.4.

## VERIFIED ON TWO DIFFERENT OVERHEADS, NOT ONE

A change this broad cannot be checked on the thing that prompted it. Photographed the
freeway overpass **and** a Strip pedestrian bridge in a completely different district:
both now hang, both throw a shadow, both show a beam.

## THE LESSON

**A FLAG THAT NOTHING READS IS NOT A FEATURE.** `c.overhead` has been set correctly, on
the right tiles, for weeks — and the world drew none of it. The layering system knew what
these things were; the renderer never asked. That is the same shape as the six standable
structures the walked surface discarded on 8/26 and the room roles the floor never spent:
**the model was right and the picture never listened to it.**

And it took a human looking at one screenshot to find it, after a day of green gates.
