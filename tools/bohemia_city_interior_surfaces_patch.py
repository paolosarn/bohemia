#!/usr/bin/env python3
"""
A HOUSE IS NOT MADE OF STREET (8/3/26).

Paolo's list, two separate items:
  "WHY IS THE INSIDE OF THE HOUSE USING CONCRETE TILES"
  "THE INTERIOR WALLS ARE THE SAME AS THE EXTERIOR WALLS"

Both were carried as [BLOCKED: no interior wall/floor art in any bank]. That was
wrong. Measured:

    banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt
      floors     48 tiles   48x48   from his PURCHASED HD tile repo, parts 1-4
      walls      48 tiles   48x48   same
      dirtfloor  24 tiles   48x48   same
      windows    16 tiles   48x48   same
    in the shipped alpha:  0 of 24 floors, 0 of 24 walls, 0 of 16 windows

The art exists, it is his, it was bucketed by room function on 7/26, and NONE of it
reaches the surface he plays. It DOES ship -- into slices/BOHEMIA_RUN_CURRENT.html,
where roomFloor()/ROLE_FLOOR/propAt were all written and gated. But the ONE WORLD TAB
law (8/2) settles which surface he plays: the RUN tab shows the CITY FRAME, not the
run slice. So the work was done once, in the wrong window.

WHAT THE CITY FRAME DRAWS INSTEAD, today:
  FLOORS -- inFloorPool(role) returns 'side' for every role except six. 'side' is
    pools.side of banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt: the 36-tile
    harmonized street SIDEWALK CONCRETE pool. The residential grammar is
    living/kitchen/bed/bed/bath and not one of those five is in the exception list,
    so a Vegas house's LIVING ROOM, KITCHEN, BEDROOMS and BATHROOM all render on
    outdoor cracked sidewalk with weeds growing through it. That is his "concrete
    tiles", exactly.
  WALLS -- 'hwall', with a comment saying so on purpose: "the SAME tan stucco the
    building wears on the outside, so the interior is literally made of the
    exterior." He looked at it and said that is wrong. His word is the ruling.

WHAT THIS DOES: ports the run slice's ONE FLOOR PER ROOM rule into the CITY frame,
verbatim in behaviour -- the floorplan says what the room IS, the pack name says what
the tile IS, and nothing is invented. ROLE_FLOOR is copied byte for byte from the run
slice so the two surfaces cannot disagree about what a bathroom floor looks like.
Interior walls come from his interior WALL bucket instead of the exterior stucco.

CROPPED, NEVER SQUISHED. The pool is 48x48 and the corpus cell is 44x44. Scaling
48->44 is a 0.917 non-integer resample, which the MOBILE RENDER CONTRACT bans outright
("a 3x phone blitting a 1.07x buffer destroys pixel art") and which RENDER PIXEL would
catch. So every tile is CROPPED to its centre 44x44 at patch time and blitted 1:1.
Cropping is the blessed operation in this repo and his own E/W door bank says so in
its note: "cropped (never squished/mirrored)".

REUSE CHECK: cooks ZERO new graphic pixels. Every tile is lifted from
banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt, which is itself an UP-ONLY filter of his
purchased HD tile repo (banks/BOHEMIA_HD_TILE_REPO_part1-4). The only transform is a
centre crop, never a resize, never a mirror, never a recolour. Nothing is drawn by me.

Idempotent: re-running finds the marker and reports NOOP.
"""
import base64
import io
import json
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
POOL = 'banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt'
MARKER = '__INTERIOR_SURFACES__'
CELL = 44

FLOOR_ANCHOR = """    const pool=inFloorPool(c.role);
    if(!inBlit(pool,inPatch(x,y,pool.length),sx,sy,C)){ g.fillStyle='#8f8878'; g.fillRect(sx,sy,C,C); }"""

WALL_ANCHOR = """      if(!inBlit('hwall',inPatch(x,y,5),sx,sy-C,C)){ g.fillStyle='#463d33'; g.fillRect(sx,sy-C,C,C); }
      if(!inBlit('hwall',inPatch(x,y,5),sx,sy,C)){ g.fillStyle='#463d33'; g.fillRect(sx,sy,C,C); }"""


def crop44(b64):
    from PIL import Image
    im = Image.open(io.BytesIO(base64.b64decode(b64))).convert('RGBA')
    w, h = im.size
    if (w, h) == (CELL, CELL):
        out = im
    else:
        L, T = (w - CELL) // 2, (h - CELL) // 2
        out = im.crop((L, T, L + CELL, T + CELL))
    buf = io.BytesIO(); out.save(buf, 'PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode('ascii')


def main():
    pool = json.load(open(POOL))
    if 'UP-ONLY' not in (pool.get('law') or ''):
        print('FAIL: %s is not the UP-only pool' % POOL); return 1
    buckets = {}
    for b in ('floors', 'dirtfloor', 'walls'):
        src = pool['buckets'].get(b) or []
        if not src:
            print('FAIL: bucket %s is empty' % b); return 1
        buckets[b] = [{'p': e['pack'], 'b': crop44(e['b64'])} for e in src]
        print('  %-10s %d tiles cropped to %dx%d' % (b, len(buckets[b]), CELL, CELL))

    alpha = open(ALPHA, encoding='utf8', errors='ignore').read()
    m = re.search(r"CITY_B64\s*=\s*['\"`]([A-Za-z0-9+/=]{5000,})", alpha)
    if not m:
        print('FAIL: CITY_B64 not found'); return 1
    city = base64.b64decode(m.group(1)).decode('utf8', errors='ignore')
    if MARKER in city:
        print('NOOP: the interior already wears his own surfaces'); return 0
    if city.count(FLOOR_ANCHOR) != 1:
        print('FAIL: the interior floor pass is not where this tool expects it'); return 1
    if city.count(WALL_ANCHOR) != 1:
        print('FAIL: the interior wall pass is not where this tool expects it'); return 1
    if 'function renderInside(' not in city:
        print('FAIL: renderInside missing'); return 1

    decl = ("\n/* " + MARKER + " -- A HOUSE IS NOT MADE OF STREET (Paolo: \"WHY IS THE INSIDE\n"
            "   OF THE HOUSE USING CONCRETE TILES\" and \"THE INTERIOR WALLS ARE THE SAME AS THE\n"
            "   EXTERIOR WALLS\"). Both were carried as [BLOCKED: no art]. Measured, that was wrong:\n"
            "   banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt holds 48 floors, 48 walls and 24 dirt floors\n"
            "   at 48x48, bucketed by room function on 7/26 out of his PURCHASED HD tile repo -- and\n"
            "   0 of them reached this surface. They DO ship, into the run slice, where roomFloor()\n"
            "   and ROLE_FLOOR were written and gated; but the ONE WORLD TAB law says the RUN tab\n"
            "   shows the CITY FRAME, so the work was done once in the wrong window.\n"
            "   What this frame drew instead: inFloorPool() returned 'side' for every role but six,\n"
            "   and 'side' is the harmonized STREET SIDEWALK pool -- so a living room, a kitchen,\n"
            "   two bedrooms and a bathroom all rendered on outdoor cracked sidewalk with weeds in\n"
            "   it. And the walls were 'hwall', the exterior stucco, deliberately.\n"
            "   ONE FLOOR PER ROOM, and the room's own function picks WHICH KIND: the floorplan says\n"
            "   what the room is, the pack name says what the tile is, nothing is invented.\n"
            "   ROLE_FLOOR is copied from the run slice so the two surfaces can never disagree.\n"
            "   CROPPED, NEVER SQUISHED: 48x48 into a 44px cell would be a 0.917 resample, which the\n"
            "   MOBILE RENDER CONTRACT bans, so each tile carries its own centre 44x44 crop and is\n"
            "   blitted 1:1. His E/W door bank names the same operation: \"cropped (never\n"
            "   squished/mirrored)\". */\n"
            "const IN_SURF=" + json.dumps(buckets, separators=(',', ':')) + ";\n"
            "const IN_SURF_IMG={};\n"
            "for(const k in IN_SURF) IN_SURF_IMG[k]=IN_SURF[k].map(function(e){\n"
            "  const i=new Image(); i.src='data:image/png;base64,'+e.b; return {im:i,p:e.p}; });\n"
            "/* the room's function asks the pack by name -- byte-for-byte the run slice's table */\n"
            "const IN_ROLE_FLOOR={ bath:/tile/i, kitchen:/tile/i, hall:/contrete|concrete|stone/i,\n"
            "                      entry:/contrete|concrete|stone|cobble/i,\n"
            "                      closet:/metal|contrete|concrete/i };\n"
            "/* A ROOM NOBODY ASKED ABOUT GETS THE PLAIN FLOOR. The bucket holds specialists --\n"
            "   rusted metal, cobblestone, stone path -- and a role with no rule drew any of the\n"
            "   48 at random, which put rusted metal plate down in a bedroom. A named special\n"
            "   material appears only where something ASKS for it; everything else is plain. */\n"
            "const IN_PLAIN_FLOOR=/^(\\d+\\. )?Floor tiles/i;\n"
            "let IN_ROOMFLOOR={};\n"
            "function inRoomKey(fp,x,y){ const c=fp.grid[y][x];\n"
            "  return (c.room!=null?c.room:(c.role||'null')); }\n"
            "function inRoomFloor(fp,x,y){\n"
            "  const c=fp.grid[y][x], k=(INSIDE&&INSIDE.zone||'')+':'+(fp.W*131+fp.H)+':'+inRoomKey(fp,x,y);\n"
            "  if(IN_ROOMFLOOR[k]) return IN_ROOMFLOOR[k];\n"
            "  const h=(Math.imul(String(k).length+1,2654435761)^Math.imul(fp.W*131+fp.H,40503)\n"
            "          ^Math.imul(String(k).charCodeAt(0)|0,19349663))>>>0;\n"
            "  let list=IN_SURF_IMG.floors;\n"
            "  if(c.role==='garage') list=IN_SURF_IMG.dirtfloor;\n"
            "  else { const want=IN_ROLE_FLOOR[c.role];\n"
            "    const fit=list.filter(function(e){ return (want||IN_PLAIN_FLOOR).test(e.p); });\n"
            "    if(fit.length) list=fit; }\n"
            "  IN_ROOMFLOOR[k]=list[h%list.length]; return IN_ROOMFLOOR[k];\n"
            "}\n"
            "/* ONE WALL MATERIAL PER BUILDING, cached on the entry itself so it cannot flicker\n"
            "   between frames. The first cut rolled a tile PER CELL and the room came out a\n"
            "   patchwork of brick, chainlink, scrap panel and cobblestone -- a texture sheet, not\n"
            "   a house. Rendered and looked at, which is the only reason it was caught. A building\n"
            "   is built of ONE thing, the same discipline the floor already has per room. */\n"
            "function inHouseWall(){\n"
            "  if(!INSIDE) return null;\n"
            "  if(INSIDE._wall) return INSIDE._wall;\n"
            "  const f=INSIDE.foot||{x:0,y:0,w:1,h:1};\n"
            "  const h=(Math.imul(f.x|0,73856093)^Math.imul(f.y|0,19349663)\n"
            "          ^Math.imul((f.w|0)*131+(f.h|0),2654435761))>>>0;\n"
            "  INSIDE._wall=IN_SURF_IMG.walls[h%IN_SURF_IMG.walls.length];\n"
            "  return INSIDE._wall;\n"
            "}\n"
            "/* 1:1, because the tile is already the corpus cell size. Never scaled. */\n"
            "function inSurfBlit(e,sx,sy,C){\n"
            "  if(!e||!e.im.complete||!e.im.naturalWidth) return false;\n"
            "  g.drawImage(e.im,sx,sy,C,C);\n"
            "  window.__IN_SURF_DRAWS=(window.__IN_SURF_DRAWS||0)+1; return true;\n"
            "}\n")

    floor_new = ("    /* " + MARKER + " -- HIS floor, one per room, never the street's sidewalk. */\n"
                 "    if(!inSurfBlit(inRoomFloor(fp,x,y),sx,sy,C)){\n"
                 "      const pool=inFloorPool(c.role);\n"
                 "      if(!inBlit(pool,inPatch(x,y,pool.length),sx,sy,C)){ g.fillStyle='#8f8878'; g.fillRect(sx,sy,C,C); } }")

    wall_new = ("      /* " + MARKER + " -- HIS interior wall, not the exterior stucco. Two tiles\n"
                "         tall exactly as before, so the DOOR LAW proportion is untouched, and ONE\n"
                "         MATERIAL for the whole building (see inHouseWall). */\n"
                "      const iw=inHouseWall();\n"
                "      if(!inSurfBlit(iw,sx,sy-C,C) && !inBlit('hwall',inPatch(x,y,5),sx,sy-C,C)){ g.fillStyle='#463d33'; g.fillRect(sx,sy-C,C,C); }\n"
                "      if(!inSurfBlit(iw,sx,sy,C)   && !inBlit('hwall',inPatch(x,y,5),sx,sy,C)){ g.fillStyle='#463d33'; g.fillRect(sx,sy,C,C); }")

    city = city.replace('function renderInside(', decl + 'function renderInside(', 1)
    city = city.replace(FLOOR_ANCHOR, floor_new, 1)
    city = city.replace(WALL_ANCHOR, wall_new, 1)
    for nm in ('function inRoomFloor(', 'function inSurfBlit(', 'inRoomFloor(fp,x,y)'):
        if city.count(nm) < 1:
            print('FAIL: post-edit %s missing' % nm); return 1

    out = base64.b64encode(city.encode('utf8')).decode('ascii')
    open(ALPHA, 'w', encoding='utf8').write(alpha[:m.start(1)] + out + alpha[m.end(1):])
    print('wrote %s' % ALPHA)
    print('  a house is no longer floored in outdoor sidewalk, and its walls are no longer')
    print('  the stucco it wears on the outside')
    return 0


if __name__ == '__main__':
    sys.exit(main())
