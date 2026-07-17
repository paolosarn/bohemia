# BOHEMIA — TILE TYPE SYSTEM (7/8/26)

## Why
Judging good/bad/recut isn't enough. A sign, a cone, a doorway, a floor tile
all behave differently in the world. Type tells the game HOW to place a tile.

## Fixed shortlist v1 (Paolo, refine later)
- GROUND    — carpets the floor, walk on it (street, concrete, dirt, grass)
- OVERLAY   — sits ON TOP of ground, still walkable (stains, rubble, cracks, blood)
- PROP      — small object on the ground, walk AROUND it (cone, barrel, trash, crate)
- STANDING  — tall object that blocks + occludes (sign, statue, lamp post, tree)
- WALL      — building edge piece, blocks, part of a structure
- DOOR      — entrance piece, part of a wall, may be enterable later
- MULTICELL — spans more than one grid square (big vehicle, wide doorway, large debris)

## Rules
- One tap sets type. Type is separate from good/bad/recut verdict.
- Auto-guess seeds the type from category (ground cats->GROUND, etc); Paolo overrides.
- Type rides in the export so Claude places each tile correctly.
- List is v1, meant to be refined as real needs surface.

## Status
- 7 types locked as starting set
- Judging menu gets a TYPE row per tile (one-tap cycle or picker)
