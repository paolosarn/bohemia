# THE INTERIOR ART EXISTS — two "blocked" items were never blocked, and I stopped one step short of shipping a look he has not ruled on (8/3/26, RUN lane)

## TWO ITEMS OFF HIS LIST, BOTH CARRIED AS BLOCKED, BOTH WRONG

> "WHY IS THE INSIDE OF THE HOUSE USING CONCRETE TILES"
> "THE INTERIOR WALLS ARE THE SAME AS THE EXTERIOR WALLS"

Both were carried as **[BLOCKED: no interior wall/floor art in any bank]**. Measured:

```
banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt      (UP-ONLY filter of his PURCHASED HD repo)
  floors      48 tiles   48x48
  walls       48 tiles   48x48
  windows     16 tiles   48x48
  dirtfloor   24 tiles   48x48
in slices/BOHEMIA_ALPHA_0_9.html:   0 of 24 floors, 0 of 24 walls, 0 of 16 windows
```

**The art has existed since 7/26.** It is bucketed by room function. None of it reaches
the surface he plays.

It is not even unwired: `tools/build_run_slice.js` ships it into
`slices/BOHEMIA_RUN_CURRENT.html`, complete with `roomFloor()`, `ROLE_FLOOR`, `propAt()`
and an `integration_gate` probe proving it draws. But the **ONE WORLD TAB law (8/2)**
settles which surface he plays: *the RUN tab shows the CITY FRAME, not the run slice.*
**The work was done once, correctly, in a window he never opens.** That is the seventh
instance of approved-but-unused this month.

## WHAT THE CITY FRAME DRAWS TODAY

- **FLOORS.** `inFloorPool(role)` returns `'side'` for every role but six. `'side'` is
  `pools.side` of the harmonized STREET pool — the 36-tile **outdoor sidewalk concrete**.
  The residential grammar is living/kitchen/bed/bed/bath and not one of those five is in
  the exception list, so a Vegas house's living room, kitchen, both bedrooms and bathroom
  all render on **cracked outdoor sidewalk with weeds growing through it.** That is his
  "concrete tiles", exactly, and it is worse than he described.
- **WALLS.** `'hwall'` — the exterior stucco, on purpose, with a comment saying "the
  interior is literally made of the exterior." He looked at it and said that is wrong.

## THE MECHANISM IS BUILT AND IT WORKS

`tools/bohemia_city_interior_surfaces_patch.py`, written, run, rendered and looked at:

- **ONE FLOOR PER ROOM**, the room's own function picking which kind. `ROLE_FLOOR` copied
  from the run slice so the two surfaces cannot disagree.
- **ONE WALL MATERIAL PER BUILDING.** The first cut rolled a tile per cell and the room
  came out a patchwork of brick, chainlink, scrap panel and cobblestone — a texture sheet,
  not a house. Only caught by rendering it and looking.
- **A ROOM NOBODY ASKED ABOUT GETS THE PLAIN FLOOR**, never a specialist material. Without
  that rule, a bedroom drew rusted metal plate.
- **CROPPED, NEVER SQUISHED.** 48x48 into a 44px cell is a 0.917 resample, which the
  MOBILE RENDER CONTRACT bans and RENDER PIXEL would catch. Every tile carries its own
  centre 44x44 crop and blits 1:1. His E/W door bank names the same operation: "cropped
  (never squished/mirrored)".
- 163 of his tiles measured drawing in one real interior frame.

## AND THEN I STOPPED, DELIBERATELY

Version 2 renders a coherent room. **It reads as an industrial bunker, not a suburban
Las Vegas house** — the wall bucket's packs are "Broken building walls", "Broken wall
tiles", "Scrap wall and panels", and the plain floors read as rusted plate and plank.

That may well be right for a dead world ten years cold. It may be completely wrong for
the house he spawns beside. **I cannot rule on that and it is not mine to rule on**
(MECHANISM-MINE / CONTENTS-PAOLO'S). The 8/2 diagnosis wrote the warning in advance:

> "changing sidewalk concrete to dungeon cobblestone is a different wrong answer"

Shipping a bunker to fix a sidewalk is that warning coming true. So **the patch is NOT
applied to the alpha.** The tool is committed, the finding is recorded, and the shipped
build is untouched.

**THE ONE THING BLOCKING BOTH ITEMS: which of his own packs is a Vegas house made of
inside?** Everything else is done and measured.

## WHAT THE NEXT SESSION DOES WITH THIS

Do NOT re-cook interior art — 465 tiles of his already exist. Do NOT guess the look; it
was guessed once and stopped. When he rules, run
`python3 tools/bohemia_city_interior_surfaces_patch.py`, narrow `IN_ROLE_FLOOR` and the
wall bucket to the packs he named, render, look, and gate it.

The floor packs available to him, by name and count:

```
FLOORS   Cracked contrete tiles 8 · Cobblestone floor tiles 7 · Metal floor tiles 7
         Floor tiles! 6 · Stone paths 4 · Floor tiles and wall tiles 4
         1. Floor tiles 3 · 1. Floor tiles (1) 3 · Floor tiles 3
         Rusted metal floor tiles 2 · Floor tiles (1) 1
WALLS    Floor, walls 13 · Wall tiles (1) 11 · Broken wall tiles 10
         Broken building walls 7 · Scrap wall and panels 7
DIRT     Dirt path tiles · Soil and dirt tiles · Burnt ground tiles · Burned Ground
```
