# BUILT ON THE BOARD: A FIGHT AT A PLACE YOU BUILT ON STANDS ON WHAT YOU BUILT
# LIFE + CITY, 10/9/26, row [built on the board] (rule 40b's third place; 37g high ground is a roof)

## THE CHAIN (tools/bohemia_fight_built_patch.py, idempotent, three marked hooks)
1. THE MAP: at cityHandOver, the one door every fight goes through, a BOHEMIA_CITY_ENCOUNTER within two
   blocks of a place whose lots stand carries `built`: each standing thing's id and its fightTile() (wall,
   high, building, open) from engine/bohemia_lotbuild.js.
2. THE SHELL (BOHEMIA_ALPHA_0_9.html nfOpts): `o.built` to the fight's options (at most eight).
3. THE FIGHT (COMBAT's BOHEMIA_FIGHT.html): placeBuilt(), after the board is cut to the party and before
   anybody deploys, puts each thing on YOUR side on open ground, middle rows first: wall = the board's own
   BLOCK WALL cover on your front; building = a piece that blocks movement drawn with its own picture (the
   approved street's cut, slices/settlement/lot/); high = the tile turns to 'height' (+1 level, the terrain
   key's rule) and the roof is drawn on it, because the board draws no height of its own; open = nothing.
   A piece that would cut the two lines apart is taken back (connected()). S.built records what was placed.
   Two lines of the bake changed: "your" pieces are drawn fitted to their tile instead of at the cover
   art's raw size.

## THE GATE: gates/built_on_the_board_gate.js (suite BUILT ON THE BOARD), 11/0, on the real fight
Nothing handed nothing placed; wall, tank, roof placed on your side (x at most your front column + 1); the
wall is BLOCK WALL; the tank blocks and its picture is its own; the roof tile is height; a garden places
nothing; MUTATION: an unknown kind is left off; the map's door and the shell's hand-over are in place.

## THE COOK
slices/vote/LIFECITY_BUILT_ON_THE_BOARD_10_9.png: COMBAT's fight, seed 11, suburb, the far stop; your side
cropped, as dealt and with a wall, a tank and a roof handed in.

## FOR COMBAT
The hooks are marked __BUILT_ON_THE_BOARD__; when [board generator] lands, placeBuilt() is the place to hand
the built list to it instead.
