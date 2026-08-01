# ONE WORLD INTERIORS — THE SPEC (7/31/26)

> "i want it like project zomboid when you enter a house you still are part of the
> same world no loading screens thats why were making this html game its not a lot
> of processing"
>
> "you can take a shot at interior rebuilds please do big brain online research if
> you need to"

He greenlit this. This is the research half, written down BEFORE the code so the
execution cannot drift, because six of his complaints collapse into this one job
and getting it half-right is worse than not starting.

## THE SIX COMPLAINTS THAT ARE ALL ONE BUG

| his words | what it really is |
|---|---|
| "why when i enter a house i cant go left and right" | the interior is a different, narrower grid |
| "windows of the wall not consistent with whats happening outside" | the interior grid does not know where the world is |
| "INTERIOR WALLS... THE SAME WALLS AS THE EXTERIOR" | one wall material because there is one tile vocabulary |
| "INSIDE OF THE HOUSE USING CONCRETE TILES" | the floor is picked without a room to pick for |
| "walking TO ANY WALL... NOW IM MAGICALLY IN THE BUILDING" | entry is a mode swap, so any contact can trigger it |
| "no loading screens... same world" | there IS a mode swap, and it is the loading screen |

**ROOT CAUSE, ONE LINE:** `mode` is `'int'` or `'ext'`, and entering swaps the
player onto a separate grid `fp` instead of leaving him in the world grid `G`.

## WHAT THE RESEARCH SAYS

**Project Zomboid, the game he named.** Its interiors are NOT separate files or
separate maps. Buildings live in the same cell grid as the street; inside/outside
is a **detection** (a room/roof property of the tiles), not a mode the player is
put into. That is why you can shoot through a window from the street, why weather
stops at the doorway, and why there is no load when you step through a door.
Build 42 raised the height limit on that same grid, which is how basements and
32-floor towers exist without any new mechanism.

**The standard technique for revealing an interior, across engines** (Unity,
Unreal, GameMaker, Roblox threads all converge on the same four, and the flood
fill is the one recommended for tile games because it needs no per-building
authoring):

1. **FLOOD FILL over connected roofed tiles** — the group is one indoor area, and
   the whole group reveals together. No manual setup per building.
2. sensors/triggers at doorways (fragile, needs authoring per door)
3. raycast player-to-camera and hide what it crosses (per-frame cost, no rooms)
4. height-based transparency (works for occlusion, does not give you *rooms*)

**We take 1, and it fits what Bohemia already has**: footprints are already
flood-filled out of the grid by `homeFootprints()`, and doors are already derived
per footprint. The room grouping is the same algorithm already in the file.

## THE SPEC

### S1. THE INTERIOR IS REAL CELLS IN THE WORLD GRID
The floorplan is stamped INTO `G` at the building's own coordinates. Interior
floor plate === exterior footprint, exactly — that is already the
INTERIOR-MATCHES-EXTERIOR law (7/19) and this does not weaken it, it finally
makes it literally true in one array.
**There is no `fp` grid and no `mode`.** Both are deleted, not bypassed. Leaving
them as a fallback is how the sidewalk stayed fake for weeks.

### S2. INSIDE IS A PROPERTY OF THE CELL, NOT A STATE OF THE PLAYER
Each cell gains `room` (an id, 0 = outdoors) and `roof` (which roof group covers
it). "Am I inside?" is `roomAt(px,py) !== 0`. Nothing else asks.

### S3. THE ROOF IS AN OVERHEAD LAYER, AND IT HIDES BY ROOM
Roof tiles draw on the existing `overhead` layer. When the player's room id equals
a roof group's room id, that whole group stops drawing — the flood-fill reveal.
This reuses the occlusion path that already exists for canopies and decks; it is
not a new renderer.

### S4. ENTRY IS GEOMETRY, NOT AN EVENT
There is no `enter()`. You walk, and the cell you arrive on happens to be inside.
A wall is solid, so bumping it stops you — which is his A3 for free, because
"entering through any wall" cannot exist when entering is not a thing that fires.

### S5. MOVEMENT IS ONE CODE PATH
`passExt`/`passInt` collapse to one predicate over `G`. Eight directions inside
and out, same feel — his A4, also for free, because there is no second mover.

### S6. MATERIALS COME FROM THE ROOM
Interior wall and floor tiles are chosen by the room's function, from the
interior pool, and are never the exterior's stucco (C1) and never concrete in a
living room (C2). A garage floor stays concrete because a garage IS concrete.

### S7. WINDOWS SEE THE WORLD
A window cell is transparent to the renderer: what draws behind it is the actual
world beyond that wall, because there is only one grid to read. His "windows not
consistent with outside" stops being possible rather than being fixed.

## THE ORDER TO BUILD IT

1. `room` + `roof` on the cell, and the flood fill that assigns them. Nothing
   renders differently yet. **Gate: every building has exactly one room group per
   enclosed space, and no room id leaks outdoors.**
2. Stamp the floorplan into `G`. **Gate: the plate is exactly the footprint —
   world_gate already asserts this and must keep passing.**
3. One movement predicate; delete `passInt`. **Gate: reachability inside equals
   reachability outside, all eight directions.**
4. Roof-by-room reveal on the overhead layer. **Gate: standing inside hides
   exactly one roof group; standing outside hides none.**
5. Delete `mode`, `enter()`, `leave()`, `fp`. **Gate: the strings are gone from
   the source, so the old path cannot come back as a fallback.**
6. Room-driven materials (S6) and window see-through (S7).

**Each step ships green on its own.** This is not one commit.

## THE TRAP THIS SESSION ALREADY PROVED

**THE SURFACE HE PLAYS IS THE CITY RENDERER** — the RUN tab opens `CITY_B64`.
Two rendering fixes this session landed in the run slice and were invisible to
him. Steps 3, 4, 6 and 7 above are RENDER-side and **must land in the city blob**
(via a patch tool, it is base64) or they do not exist. Steps 1, 2 and 5 are
engine-side and flow to both.

## WHAT IS NOT IN THIS SPEC

Multi-floor. He has asked for 2-3 storeys with climbable stairs elsewhere, and PZ
does it on this same grid with a height axis — but adding a Z axis at the same
time as removing the mode swap is two rewrites at once. **Land one-world first.**

## SOURCES

- [Project Zomboid — Features Overview: Build 42.20](https://projectzomboid.com/blog/features-overview-build-42-20/)
- [PZwiki — Mapping (cell/tile structure)](https://pzwiki.net/wiki/Mapping)
- [GameDev.net — How to mark roof for show/hide (flood fill grouping)](https://gamedev.net/forums/topic/673689-how-to-mark-roof-for-showhide/5265116/)
- [Unity Discussions — hiding roofs/floors when the player enters a building](https://discussions.unity.com/t/if-my-player-walks-into-a-3d-building-in-a-top-view-game-how-would-i-get-the-roof-or-rest-of-the-buildings-stories-to-become-invisible/163081)
- [Unity Forum — 2D topdown hiding floors between player and camera](https://forum.unity.com/threads/2d-topdown-hiding-floors-between-player-and-camera.292726/)
- [Roblox DevForum — roofs/walls transparent between player and camera](https://devforum.roblox.com/t/top-down-view-game-roofs-and-walls-go-transparent-when-in-between-player-and-camera/2582202)
