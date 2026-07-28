# THE TILE CRAFT BIBLE (7/28/26, WORLD lane — research, commissioned)

Paolo: *"do research on how to do everything properly code in pixel wise and looking
good and realistic, walkways and shit like that and not overlapping and meshing bullshit
features."*

Term two. The first bible was WHAT to draw. This is **HOW to build it so it does not
mesh into itself** — the pixel craft and the code that makes tiles meet cleanly.

NOTHING BUILT OFF IT YET. This is the spec the revamp gets made against, and most of it
becomes machine gates, because a law without a gate is not enforced.

---

# THE DIAGNOSIS: WHY OUR DISTRICTS MESH

His word for it is "meshing bullshit" and it is precise. There are exactly **four**
different bugs hiding under it, and they have four different fixes. We have all four.

| # | what he sees | what it actually is |
|---|---|---|
| 1 | features bleeding into each other, no clean edge | **no autotiling** — we paint flat codes, nothing decides the boundary |
| 2 | things drawn on top of the wrong things | **no depth sort** — draw order is array order, not position |
| 3 | stuff overlapping where it should not be at all | **no footprint reservation** — the generator draws over itself |
| 4 | mush and noise at a distance | **too much detail per tile, no shared light** |

---

# 1. THE EDGE PROBLEM — AUTOTILING, AND THE DUAL-GRID TRICK

**What we do now:** every tile is a flat code, and where two materials meet there is a
hard 90-degree stair-step. Pavement meets dirt with a pixel cliff. That is the single
biggest reason our plots read as *diagrams* rather than places.

**The standard fix is autotiling:** look at a cell's neighbours, compute a bitmask, and
pick the tile variant that matches. Wang tiles put a colour on each tile EDGE and only
allow neighbours whose shared edge matches. The complete version — a "blob" set —
needs **47 tiles per material**, which for our ~48 districts is unbuildable.

**THE ANSWER, AND IT IS THE BEST THING I FOUND THIS TERM: THE DUAL-GRID.**
Originally Oskar Stålberg's; the widely-used implementations are Jess Hammer's.

> Run **two grids**: the logic grid (what a tile IS) and a **display grid offset by
> exactly half a tile**. Each display tile then sits on the **corner intersection of
> four logic tiles**, so it only ever has to represent **2^4 = 16 states** instead of 47.
> Marching squares, essentially.

Why this matters to us, concretely:
- **16 tiles per material instead of 47** — and as few as **6** if the design is
  symmetrical. That is the difference between "a tile family per district is impossible"
  and "a tile family per district is a day's work."
- Corners come out **properly rounded** for free.
- Each tile checks **4 neighbours instead of 8** — cheaper, and it is a pure function of
  the logic grid, so it is deterministic and gateable.
- **It changes nothing about our existing generators.** The logic grid stays exactly what
  `K.grid` already produces. The dual grid is a render-time layer on top. We do not
  rewrite 48 districts to get this.

**This is the highest-value single change available to us and I want to build it first.**

---

# 2. THE OVERLAP PROBLEM — DEPTH SORTING DONE RIGHT

In a 3/4 view, things must be drawn **back to front by their position in the world**, not
by the order they happen to sit in an array. Sort by Y, low to high: things further up
the screen draw first.

**And the bug that bites everyone, which I am nearly certain we have:**

> The sort key must be the **BASE of the object, not its centre and not its top.**

A tall thing (a water tower, a light mast, a false front, a grandstand) whose sort origin
is its middle will sort as if it stands half a building further back than it does, and
then the player walks *behind* something they are standing in front of. Every reference
names this same failure. The rule:

- **sort key = the Y of the tile the object OCCUPIES AT GRADE** (its footprint), never
  the top of its sprite.
- an explicit z-index must never silently override the Y sort, or the sort is decorative.
- our LAYERING law already gives us exactly the right vocabulary for this —
  ground / structure / overhead / prop / portal. **Overhead is the special case**: it
  draws above the player regardless of Y, because you pass *under* it. That is already
  written down; it just has to be what the renderer actually does.

**Cast shadows, from the pixel-art side:** keep them **subtle and short**, and do not
throw them long in one direction — a long shadow crosses into the neighbouring tile and
*"conflicts with overlapping adjacent tiles."* A long dramatic shadow is exactly the
thing that turns a tidy tilemap into mush. Ours is a high desert sun, which conveniently
wants short shadows anyway.

---

# 3. THE COLLISION PROBLEM — THE LOGIC GRID IS NOT THE PICTURE

Standard practice, and we are already half-right: a **visual grid** (what to draw) and a
separate **logic grid** (what blocks, what is walkable, what pathfinds). They are not the
same grid and they must not be derived from each other by eye.

The part we should steal that we do NOT do: **transparent / non-blocking areas used
deliberately** so a body can walk *under* an overhead thing without being blocked. That
is our `overhead` layer and it should be free.

Our real gap is the reverse: **our footprints are drawn, not reserved.** Which is bug #3.

---

# 4. THE FEATURE-COLLISION PROBLEM — RESERVE, DON'T DRAW

This is the one that caused the actual bugs I hit this week, and it is worth naming as a
rule because it will keep happening otherwise:

> **A generator that draws straight into the grid will draw over itself, and nothing
> will tell it.**

Every one of these was that bug:
- the ballpark's **bullpens drawn straight through the parking ring**, severing the lot
  from the entrance
- the **water tower disc landing on a cross street**
- the **fallen sign spanning the full carriageway** and sealing the town in half
- the town's **boardwalk drawn inside the roadway**

The fix is not care, it is mechanism: **claim a footprint before drawing it.** A feature
declares the rectangle it wants; the claim fails if it overlaps a reserved rectangle or
crosses a circulation route; only then does it draw. Then the generator physically cannot
put a bullpen through a driveway, and a gate can prove it for every district at once.

Plus the standing checks we already have and should extend: a car reaches every stall
from the curb, no drive surface is severed, no enclosed pocket.

---

# 5. THE PIXEL RULES (so the tiles do not read as noise)

- **ONE light direction across every tile in the game.** Upper-left is the convention.
  Consistency across tiles matters more than the quality of any single tile — *"it's the
  overall visual cohesion that makes work look professional."*
- **8–32 colours.** Ours is already palette-locked by the visual constitution.
- **Dither sparingly, and only between ADJACENT palette shades.** Close tones blend;
  far-apart tones strobe. A light intentional pattern reads as atmosphere, a heavy one
  reads as noise.
- **At 16×16 and under, do not dither at all** — there is no room for the pattern to
  read and it just goes noisy. Dithering starts working at 32×32.
- **Never put a busy texture next to another busy texture.** Busy beside busy is
  exhausting and it is exactly how a whole district turns to mush at map zoom.
- **Man-made objects expose perspective errors instantly** — *"due to the precise
  geometry of man made objects the consistency of the sense of perspective is especially
  apparent."* Every object must obey the same projection. This is our 45-DEGREE ART LAW
  and it matters most on the straight-edged things, which in this game is everything.
- **Build wall sets from one front-facing texture that loops on all four sides**, then
  re-imagine it at 45 degrees for the angled pieces, then mirror and colour-swap for the
  other side. That is how you get a whole wall family cheaply and consistently.

---

# 6. THE PIXEL-PERFECT PIPELINE (or all of the above is wasted)

- **Render the world at native resolution into an offscreen buffer, then upscale that ONE
  buffer by a whole-number factor.** Everything resolves on-grid before anything is
  scaled, so nothing can land off-grid.
- **Only ever scale by an integer** — 2x, 3x, 4x.
- **Round the camera to whole pixels every frame before drawing.** Sub-pixel camera
  positions are what cause jitter and shimmer.
- **Extrude tile borders by 1px in the atlas** (duplicate the edge row/column). Without
  it the sampler picks up the neighbouring texel and you get **seams — thin bright lines
  between tiles**. This is the classic tilemap artifact and it is a one-line fix.
- Keep movement and camera updates in the **same** update step, or the world shears
  against the camera.

**Our position:** the CITY lane already fixed the integer-scale and smoothing half of
this and gates it. The **1px extrusion** is the piece nobody has done, and we will need
it the moment real tiles land.

---

# 7. WALKWAYS — HE ASKED SPECIFICALLY, AND THE ANSWER IS DESIRE PATHS

The term is **desire path**: the route people actually take, as opposed to the one the
designer drew. In *Going Medieval*, foot traffic wears dirt patches into the ground and
the player then paves them. Death Stranding makes them the whole game.

**What this means for our districts, and it is a real correction:**
- The paved walk should go where **people actually needed to go** — kerb to door, door to
  door, car to entrance. Right now we draw walks as decoration along edges.
- **The corner cut is mandatory.** Real people cut corners; the campus quad already has
  its diagonals for exactly this reason and it is the one piece of our circulation that
  is right.
- **In act 1 the desire paths are the ONLY paths that still read.** Everything is dust and
  bleached concrete, but the routes that got walked ten thousand times are polished,
  worn, swept clear. A dead district still shows you where the life was. That is free
  environmental storytelling and it is the cheapest beautiful thing on this list.
- Walkways must **connect to something at both ends.** A path to nowhere is the footpath
  version of an empty parking lot.

---

# WHAT I WANT TO BUILD OUT OF THIS, IN ORDER

1. **THE DUAL-GRID RENDER LAYER.** 16 tiles per material instead of 47, corners for free,
   no district generator changes. Biggest win available, and it makes "a tile family per
   district type" actually affordable.
2. **DEPTH SORT ON THE FOOTPRINT**, with `overhead` exempt. Kills the walk-behind-the-
   wrong-thing class of bug permanently.
3. **FOOTPRINT RESERVATION IN THE KIT** — claim before draw. Makes this week's four bugs
   impossible rather than merely fixed, and gates every district at once.
4. **DESIRE-PATH WALKS** — routes that connect real endpoints and cut corners, worn
   clear against the dust.
5. **1PX ATLAS EXTRUSION**, the day real tiles land.

Items 1-4 are all in this lane and none of them need new art to start.

---

## SOURCES
- Autotiling / bitmask / Wang / 47-tile blob: [Red Blob Games](https://www.redblobgames.com/articles/autotile/claude/) · [Boris the Brave — classification of tilesets](https://www.boristhebrave.com/2021/11/14/classification-of-tilesets/) · [Tilesetter docs](https://www.tilesetter.org/docs/generating_tilesets)
- **Dual-grid** (Oskar Stålberg / Jess Hammer): [Jess Hammer — Godot](https://github.com/jess-hammer/dual-grid-tilemap-system-godot) · [Unity](https://github.com/jess-hammer/dual-grid-tilemap-system-unity) · [Excalibur.js writeup](https://excaliburjs.com/blog/Dual%20Tilemap%20Autotiling%20Technique/) · [explainer](https://www.spritecook.ai/blog/dual-grid-tilesets-explained)
- Depth / Y sorting and the tall-object origin bug: [Sprite ordering research](https://christt105.github.io/Sprite_Ordering_and_Camera_Culling_Personal_Research/) · [GameDev.net — top-down draw order](https://www.gamedev.net/forums/topic/707079-sprites-draw-order-sorting-for-top-down-2d-game-with-floors-and-bridges/5427325/)
- Collision layer vs visual layer: [MDN — tilemaps](https://developer.mozilla.org/en-US/docs/Games/Techniques/Tilemaps)
- Pixel rules, 3/4 projection, wall sets, shadow conflicts: [SLYNYRD Pixelblog 20 — Top Down Tiles](https://www.slynyrd.com/blog/2019/8/27/pixelblog-20-top-down-tiles) · [21 — Top Down Objects](https://www.slynyrd.com/blog/2019/9/18/pixelblog-21-top-down-objects) · [43 — Top Down Tiles 2](https://www.slynyrd.com/blog/2023/3/26/pixelblog-43-top-down-tiles-part-2) · [3 — Graphical Projection](https://www.slynyrd.com/blog/2018/3/14/pixelblog-3-graphical-projections-1)
- Dithering / noise / cohesion: [Spearite dithering guide](https://spearite.com/blog/pixel-art-dithering-guide) · [Divoom](https://divoom.com/blogs/setup-ideas/pixel-art-dithering-when-to-use-and-stop)
- Pixel-perfect pipeline, integer scaling, seam extrusion: [Integer scaling](https://tanalin.com/en/articles/integer-scaling/) · [Tiled2Unity — fixing seams](https://tiled2unity.readthedocs.io/en/latest/fixing-seams/) · [Pixel-perfect scaling](https://spritesheetgenerator.online/blog/pixel-perfect-scaling-nearest-neighbor)
- Desire paths: [The Level Design Book — Flow](https://book.leveldesignbook.com/process/layout/flow) · [Desire path](https://en.wikipedia.org/wiki/Desire_path) · [Cogmind — desire paths for a robot world](https://www.gridsagegames.com/blog/2021/07/desire-paths-for-a-robot-world/)
