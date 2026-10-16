# THE GROUND WAS A HEX COLOUR (8/18/26, WORLD lane)

**I spent the day proving the walked surface reads every district's own module. Then I
opened the game, stood in six places, and looked. The codes arrive. The ground is painted
as a flat fill.**

---

## WHAT LOOKING FOUND, AND WHAT IT ALMOST DIDN'T

First attempt: I moved the player, screenshotted, and got seven pictures. The HUD said
DESERT, WATER, MOUNTAIN. **Every image was byte-identical.** `swapMode()` moves `hx/hy` and
relabels the header; the canvas holds whatever was last painted. I nearly drew a conclusion
about the game from a stale frame — the same shape of error as everything else this week,
and the reason the harness now clears the caches and asks for the repaint explicitly.

With the repaint in, standing in a **`water`** cell at midday: a beige field. No bathtub
ring, no cracked lakebed, no launch ramp. In the **desert**: four big rectangles of slightly
different sand.

## WHY

`realizeCell`'s kit branch:

* **STRUCTURE** tiles draw an **approved tile from the bank** and tint it to the district's
  palette. That is why buildings have grain.
* **GROUND** tiles set `c.g = palette[code]` — a hex string — and the draw path falls
  through to a procedural fill. Only code 0 ever got a real texture.

So every walkable surface in every district except bare ground was **a colour**, no matter
how many codes its module emitted. My own `walked_surface_gate` counted colours and was
green through all of it: **a checker that counts is not a checker that looks.** That
limitation is now written into the gate's own header.

**It was also a quiet breach of STREETS ARE THE HARMONIZED POOL (Paolo 7/31).** The bank
carries `street` — 18 asphalt tiles with the paint already on them — and `side`, 36
sidewalk tiles. Both were loaded in the page and unused, while the kit path painted drive
and walk surfaces as hex. The law's gate watches the combat street; nothing watched this one.

---

## THE FIX, WHICH COOKS NOTHING

Ground now picks its texture **from the dossier's own `kind`**, never from a tile code, so a
district written next month is textured the afternoon it lands:

| kind | pool | tint |
|---|---|---|
| `drive`, `marking` | harmonized **asphalt** | none — it is already the colour |
| `walk`, `gate` | harmonized **sidewalk** | none |
| `water` | *nothing* | tinting dirt blue is worse than a flat fill |
| everything else | approved **yard grain** | the district's palette |

**REUSE CHECK: zero pixels cooked.** Every tile is already in `banks/` and already approved.
This only stops throwing them away.

---

## TWO THINGS I GOT WRONG FIRST, BOTH FOUND BY LOOKING

1. **I broke a named law on the first cut.** Hashing the variant *per tile* turned the
   amenity strip into a tan-and-brown **checkerboard** — the `desert_dominance_law` in the
   bank itself: *"one dominant tile at 85%, accents in coherent clusters, per-cell random
   shuffle BANNED. Paolo 7/14: 'too much diversity with the desert tiles.'"* The variant is
   hashed per plot now, the way the code-0 path has done since 7/6.
2. **Then I over-corrected.** At 0.62 the tint wiped the grain off and the band was one flat
   khaki field — coherent and dead. **0.38** is where the tint says *what* the material is
   without erasing the grain that says it is a material at all.

---

## WHAT IS STILL FLAT, AND IT IS NOT MINE

The valley has **no ground-tile art of its own** — the bank's pools are road, sidewalk,
roof, wall and yard. Sand, gravel, rock, lakebed and hardpan are all the yard grain wearing
a tint. That is the demo status board's row 2, open and unstarted since 8/7: *"every owned
ground tile is a transparent overlay and the base+scatter layer does not exist."*
**OWNER: ART.** This ship makes the codes arrive and gives them the best surface already
approved; real ground forms would replace the tint with a picture.
