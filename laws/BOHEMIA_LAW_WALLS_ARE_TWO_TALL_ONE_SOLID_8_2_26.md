# BOHEMIA LAW — EVERY WALL IS TWO TILES TALL AND ONE TILE SOLID
## Paolo, 8/2/26, LOCKED. He had to say it twice, because I collapsed three
## different quantities into one.

> "walls should always be two tiles tall. End of story... all walls should at
>  least be two tiles tall from fencing to concrete to brick whatever, but the
>  walkable border where it stops allowing you to walk should only be one tile.
>  Only the part where it stops you from walking should only be one tile, for all
>  walls... so if you are north but behind the wall because of how the camera
>  works, your feet should be one tile next to the wall border and that's when
>  the opacity matters. And then if you are south one tile below the wall, you
>  are already doing good."

He asked for this to go in the training data. **It cannot** — nothing from a
session reaches the weights, the same answer as the 8/1 hair-and-shape law. So
**this file is that memory**, and the gate below is the part that cannot forget.

---

## THE LAW: THREE QUANTITIES, AND THEY ARE NOT THE SAME NUMBER

| | | |
|---|---|---|
| **HEIGHT** | **2 tiles** | Every wall DRAWS two tiles tall. Fence, concrete, brick, chain-link, whatever it is made of. |
| **COLLISION** | **1 tile** | Exactly one tile stops you: the wall's own cell. The tile the upper course is painted over stays **WALKABLE**. |
| **OPACITY** | **on contact** | Stand on that covered tile — north of the wall, behind it from the camera — and the wall goes **SEE-THROUGH** so you can see your own feet. |

**Only a BUILDING may be taller than a wall.** A house facade is three tiles. A
wall is two. A fence is a wall, not a building.

**South of a wall was always correct** and is untouched. You stand below it, you
see its face, nothing overlaps you. He said so explicitly: *"you are already
doing good."*

## WHY THE THIRD CLAUSE IS NOT OPTIONAL
A two-tile wall over a one-tile collision means there is always one tile you can
stand on that the wall is painted over. Without the fade, you are invisible
behind your own neighbourhood wall and the game looks broken — which is exactly
what he first reported. The fade is not polish. **It is what makes the other two
clauses legible.**

---

## HOW I GOT IT WRONG, WHICH IS THE PART WORTH KEEPING

He said *"the wall border should end at that first tile, base of the wall."*
I read **BORDER** as the **DRAWN EDGE** and shipped `wallH=1`, making every
community wall shorter. He meant the **WALKABLE border** — where the collision
stops.

I also quoted his *"it has to be a building if walls are two tiles **thick**"* as
proof that walls are one tile **tall**. **Thick is footprint. Tall is height.**
They are different words and I treated them as one.

**THE TELL I MISSED, and it is a general one:** his own approved bank
(`banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt`) has said **"wall height min 2
tiles"** since 7/14. To ship a one-tile wall I had to write a long paragraph
explaining why his bank did not mean what it plainly said.

> **WHEN THE RECONCILIATION GETS THAT LONG, THE READING IS WRONG.**
> A rule that needs a paragraph of excuse to override a one-line ruling is not an
> interpretation. It is a mistake with footnotes.

The second general lesson: **a word like "border", "thick" or "tall" that could
mean two things in a spatial ruling is worth one measurement, not one guess.** I
had the tools to measure which quantity he meant and I picked instead.

## WHAT WAS ACTUALLY BROKEN, measured

- The CITY tab drew the community wall at `wallH = 2` and the draw does
  `top = dy - (wh-1)*C`, so the upper course painted over the tile to its north.
  **22,345 perimeter wall cells; 7,417 with a walkable tile under the face.**
  That was CORRECT all along — those tiles are supposed to stay walkable. What
  was missing was never the collision. It was the fade.
- **Fences stood three tiles tall** — the house-facade height — because the kit
  layers `kind:'fence'` as a structure and the CITY tab's structure branch never
  set a height, so every fence in the valley fell through to `WALL_H = 3`. Fixed
  by KIND, so every district built later inherits it without anyone remembering.

## THE GATE
`gates/wallclass_gate.js`, 24 assertions, all three clauses:
- **HEIGHT** `h === 2`, and strictly less than the house facade.
- **COLLISION** the wall cell is solid, and the covered tiles are counted and
  asserted still walkable — *a two-tile wall never costs a tile of ground.*
- **OPACITY** read **off the canvas**: sample the pixel where the wall paints
  over the player, with him standing there and standing away. Identical pixels
  mean the wall is not fading. A source-level check for `WALL_SEE` would have
  passed with the fade disconnected, and this lane has already shipped that
  mistake twice.

Proved able to fail: setting the wall back to one tile turns HEIGHT **and**
OPACITY red — which is precisely the state shipped on 8/1, now caught.

## KNOWN, FILED, NOT GUESSED AT
His thirteen approved tiles are complete 44x44 walls **with a cap along the top
edge**, so painting one across two tiles puts a cap in the MIDDLE of the wall.
That is the "two layers of walls" look. It is an **art** question — the lower
course wants the tile's body without its cap — and on his instruction
(*"end of story unless it's broken, then that's just an aesthetic decision"*) it
is recorded for the ART lane rather than invented here.

## THE LIFE LESSON UNDERNEATH (never preached in game)
How big something looks and how much room it actually takes are different
questions, and confusing them is how you end up arguing with someone who is
describing exactly what they see.
