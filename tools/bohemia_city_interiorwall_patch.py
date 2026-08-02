#!/usr/bin/env python3
"""
INTERIOR WALLS STAND UP (8/2/26) -- two tiles, like the door in them.

Paolo: "MY BIGGEST THING WITH INTERIORS WHY IS THE DOOR TWO TILES AND THE WALLS
ARE ONE TILE SOUTH AND NORTH."

MEASURED: one real interior frame, 127 drawImage calls, bucketed by destination:
    44x44  <- 22x22 : 113   floors, walls, windows -- ONE CELL
    44x88  <- 88x176:   6   the doors -- TWO CELLS
The ONLY draws taller than one cell in the entire interior were the six doors. So
the door stood in 3/4 elevation at two tiles while the wall carrying it lay flat
at one, and a door indoors read as a framed portrait hung on a tan floor-strip.
Two projections in the same frame. He is describing exactly that.

THE FIX: the wall body draws TWO tiles -- its own cell and the cell above --
matching the door that stands in it. The pass already iterates rows north-to-south,
so a wall rising into the row above paints over ground that is FURTHER AWAY, which
is the correct painter's order for this view and is how the outdoor facade pass
already works. The player is the last draw in the interior (measured: zero draws
after the body), so a wall can never hide him.

THE WINDOW GOES UP THE WALL, not on the floor. THREE-TILE WALL law (7/27): "a
window belongs UP the wall, at the middle tile, not lying on the ground." It moves
to the upper tile with the body it lives in.

WHY TWO AND NOT THREE. Outdoors a house facade is three tiles because you see its
full front face across the street. Indoors you are inside the box looking down --
three-tile partitions would swallow the room. Two matches the DOOR LAW's own
proportion (a door is 2 tiles) and makes the door and its wall agree, which is the
complaint. laws/BOHEMIA_LAW_WALLS_ARE_TWO_TALL_ONE_SOLID_8_2_26.md already sets
two tall / one solid as the floor for every wall in the game.

NOT FIXED HERE, and stated rather than hidden: the interior still uses 'hwall',
the same tan stucco as the exterior. That is his separate complaint ("WHY IS THE
INTERIOR WALLS OF A BUILDING THE SAME WALLS AS THE EXTERIOR") and it needs
interior materials he has approved, which do not exist in banks/ yet. Inventing
them would break MECHANISM-MINE / CONTENTS-PAOLO'S.

REUSE CHECK: cooks no graphic pixels and opens no bank. It draws the SAME pool the
interior already draws, one more time, one cell higher.

Idempotent: re-running finds the marker and reports NOOP.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARKER = '__INTERIOR_WALLS_STAND_UP__'

OLD = """    if(c.g==='wall'){
      if(!inBlit('hwall',inPatch(x,y,5),sx,sy,C)){ g.fillStyle='#463d33'; g.fillRect(sx,sy,C,C); }
      const wh=((Math.imul(x,2654435761)^Math.imul(y,40503))>>>0);
      if(onEdge(x,y)&&(wh%5)<2) inBlit((wh%5)===0?'hwindow':'hboarded',wh>>>4,sx,sy,C);"""

NEW = """    if(c.g==='wall'){
      /* """ + MARKER + """ (Paolo: "MY BIGGEST THING WITH INTERIORS WHY IS THE
         DOOR TWO TILES AND THE WALLS ARE ONE TILE SOUTH AND NORTH").
         Measured one real interior frame: 127 draws, and the ONLY ones taller than
         a single cell were the six doors. The door stood in 3/4 elevation at two
         tiles while the wall carrying it lay flat at one, so a door indoors read as
         a framed portrait hung on a tan floor-strip. Two projections in one frame.
         The wall body now draws TWO tiles -- its own cell and the one above -- so it
         agrees with the door standing in it. This pass already runs north-to-south,
         so rising into the row above paints over ground FURTHER AWAY, the correct
         painter's order and the same thing the outdoor facade pass does. The player
         is the last draw in here, so a wall can never hide him. Two and not three:
         outdoors a facade is three because you see its whole front across the
         street; in here you are inside the box looking down and three would swallow
         the room. Two is the DOOR LAW's own proportion. */
      if(!inBlit('hwall',inPatch(x,y,5),sx,sy-C,C)){ g.fillStyle='#463d33'; g.fillRect(sx,sy-C,C,C); }
      if(!inBlit('hwall',inPatch(x,y,5),sx,sy,C)){ g.fillStyle='#463d33'; g.fillRect(sx,sy,C,C); }
      const wh=((Math.imul(x,2654435761)^Math.imul(y,40503))>>>0);
      /* A WINDOW BELONGS UP THE WALL (THREE-TILE WALL law 7/27: "not lying on the
         ground"), so it rides the upper tile with the body it lives in. */
      if(onEdge(x,y)&&(wh%5)<2) inBlit((wh%5)===0?'hwindow':'hboarded',wh>>>4,sx,sy-C,C);"""


def main():
    alpha = open(ALPHA, encoding='utf8', errors='ignore').read()
    m = re.search(r"CITY_B64\s*=\s*['\"`]([A-Za-z0-9+/=]{5000,})", alpha)
    if not m:
        print('FAIL: CITY_B64 not found'); return 1
    city = base64.b64decode(m.group(1)).decode('utf8', errors='ignore')
    if MARKER in city:
        print('NOOP: the interior walls already stand two tiles'); return 0
    n = city.count(OLD)
    if n != 1:
        print('FAIL: the interior wall pass anchor found %d times, expected 1' % n); return 1

    city = city.replace(OLD, NEW, 1)
    out = base64.b64encode(city.encode('utf8')).decode('ascii')
    open(ALPHA, 'w', encoding='utf8').write(alpha[:m.start(1)] + out + alpha[m.end(1):])
    print('wrote %s' % ALPHA)
    print('  interior walls now stand TWO tiles, like the door in them')
    print('  windows ride up the wall instead of lying on the floor')
    return 0


if __name__ == '__main__':
    sys.exit(main())
