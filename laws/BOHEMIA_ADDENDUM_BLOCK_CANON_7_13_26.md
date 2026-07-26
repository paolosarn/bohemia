# BOHEMIA — BLOCK CANON (Paolo, 7/13/26)

## The structure
A NEIGHBORHOOD / BLOCK = one grid cell of the city (overmap) view. Move up
one grid, that's the next block. The block is the unit of world generation,
loading, and identity.

## Block character (Paolo): STREET-SCENE-FIRST
Most blocks are STREETS with things happening in them, buildings on the
sides. Block types named by Paolo so far (open set, his to grow):
- STREET (default: road + flanking buildings + street life/chaos)
- FREEWAY (his sweep comment "on the freeway" signs already tagged)
- UNDERPASS
- WASH (flood channel — canon tunnel-world surface expression)
- SEWER ENTRANCE (his manhole-cover comment = the block's door downward)
- RESIDENTIAL (tract housing — one type among many, not the default)
Casinos noted earlier as their own animal.

## Pipeline consequence
The neighborhood/worldgen pass generates BLOCK TYPES, not just housing:
each type = a recipe (which act-pool textures, which prop families, which
street furniture, which entrances). House Factory remains queued but is one
recipe among many; STREET RECIPE is the priority recipe because most blocks
are streets. Paolo judges generated blocks via output galleries.
