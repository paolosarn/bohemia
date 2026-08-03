#!/usr/bin/env python3
"""
THE DOOR STICKS OUT INTO THE NEXT TILE (8/2/26).

Paolo, 8/2: "if there is a door i need you to have it stick out slightly on the
next tile that its supposed to be on... lets say its assigned to tile 0 it will
have a slight appearance in tile -1 or 1."

HE ALREADY MADE THIS ART, and I misread it once. banks/BOHEMIA_DOOR_EW_BANK_7_10_26
says so in its own note:

    "E/W door edges generalized from Paolo's locked 7px reference (his circled
     photo): each door's OWN painted frame-edge strip, cropped (never
     squished/mirrored), positioned west/east in cell. 7px width"

I read "E/W doors" as doors for east-facing and west-facing WALLS and wrote a whole
record claiming it needed a facade-geometry rebuild. Measured properly, the tiles
say otherwise:

    side W   44x44   opaque columns  0..6    7px on the LEFT edge of the tile
    side E   44x44   opaque columns 37..43   7px on the RIGHT edge of the tile

They are the door's JAMB -- the frame edge that belongs in the tile NEXT DOOR. 184
doors x {W,E} = 368 tiles, and 0 of them had ever shipped. Exactly the thing he
just asked for, sitting finished in the repo the whole time.

WHAT THIS DOES: when the facade draws a door, it also lays that door's west jamb
into the cell to its left and its east jamb into the cell to its right, once per
row of the door's two-tile height, so the frame runs the full opening. Never
stretched, never mirrored -- his note bans both, and a 44x44 strip into a C x C
cell is the same 1:1 blit every other tile gets.

WHY IT DRAWS AFTER THE NEIGHBOURING WALL: the jamb is trim standing proud of the
wall beside it, so it goes on top of that wall rather than under it. The facade
pass already walks cells in order, so the jamb is emitted with the DOOR, after its
neighbours are down.

STATUS OF THE ART, stated honestly: the bank marks itself UNJUDGED and says "7px
was approved for the demo doors ONLY -- these are CANDIDATES; widths adjustable per
doorway when judged." He has now asked for the behaviour directly, which is the
ruling on the BEHAVIOUR. The WIDTH stays his to judge, and it is one number here.

REUSE CHECK: cooks no graphic pixels. Every strip is lifted verbatim from
banks/BOHEMIA_DOOR_EW_BANK_7_10_26.txt. Nothing is re-cooked, resized or mirrored.

Idempotent: re-running finds the marker and reports NOOP.
"""
import base64
import json
import re
import struct
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
BANK = 'banks/BOHEMIA_DOOR_EW_BANK_7_10_26.txt'
MARKER = '__DOOR_JAMB__'

# THE WHOLE if/else CHAIN. The first cut anchored on just the `if` line and
# inserted between it and its `else`, which is a syntax error ("Unexpected token
# 'else'") that killed the entire city script -- caught by the gate's browser half,
# not by reading. Append AFTER the chain closes.
ANCHOR = """        const dr=facadeDoor(v,C);
        if(dr)g.drawImage(dr,dx,dy-C,C,C*2);
        else { const d2=tallTex('hdoor',v,2);
          if(d2)g.drawImage(d2,dx,dy-C,C,C*2);
          else if(wall){ g.drawImage(wall,dx,dy-C,C,C); g.drawImage(wall,dx,dy,C,C); } }"""


def main():
    bank = json.load(open(BANK))
    W, E = [], []
    for d in bank['doors']:
        w = e = None
        for var in d['variants']:
            if var.get('side') == 'W': w = var['b64']
            elif var.get('side') == 'E': e = var['b64']
        if w and e:
            for b in (w, e):
                raw = base64.b64decode(b)
                if struct.unpack('>II', raw[16:24]) != (44, 44):
                    print('FAIL: a jamb strip is not 44x44'); return 1
            W.append(w); E.append(e)
    if not W:
        print('FAIL: no W/E jamb pairs in the bank'); return 1

    alpha = open(ALPHA, encoding='utf8', errors='ignore').read()
    m = re.search(r"CITY_B64\s*=\s*['\"`]([A-Za-z0-9+/=]{5000,})", alpha)
    if not m:
        print('FAIL: CITY_B64 not found'); return 1
    city = base64.b64decode(m.group(1)).decode('utf8', errors='ignore')
    if MARKER in city:
        print('NOOP: the door already sticks out into the next tile'); return 0
    if city.count(ANCHOR) != 1:
        print('FAIL: the door draw is not where this tool expects it'); return 1
    if 'function facadePass(' not in city:
        print('FAIL: facadePass missing'); return 1

    decl = ("\n/* " + MARKER + " -- THE DOOR STICKS OUT INTO THE NEXT TILE (Paolo 8/2:\n"
            "   \"if there is a door i need you to have it stick out slightly on the next tile\n"
            "    that its supposed to be on... assigned to tile 0 it will have a slight\n"
            "    appearance in tile -1 or 1\").\n"
            "   HIS OWN ART, from banks/BOHEMIA_DOOR_EW_BANK_7_10_26.txt, whose note pins it:\n"
            "   \"each door's OWN painted frame-edge strip, cropped (never squished/mirrored),\n"
            "    positioned west/east in cell. 7px width\". Measured: the W tile is opaque in\n"
            "   columns 0..6 and the E tile in columns 37..43 -- the door's JAMB, meant for the\n"
            "   cell NEXT DOOR. 368 strips, 0 of which had ever shipped.\n"
            "   Never stretched, never mirrored: a 44x44 strip into a C x C cell is the same 1:1\n"
            "   blit every other tile gets, and it is laid once per row of the door's two-tile\n"
            "   height so the frame runs the full opening. */\n"
            "const JAMB_W=" + json.dumps(W, separators=(',', ':')) + ";\n"
            "const JAMB_E=" + json.dumps(E, separators=(',', ':')) + ";\n"
            "const JAMB_WI=JAMB_W.map(function(b){const i=new Image();i.src='data:image/png;base64,'+b;return i;});\n"
            "const JAMB_EI=JAMB_E.map(function(b){const i=new Image();i.src='data:image/png;base64,'+b;return i;});\n"
            "function doorJamb(v,dx,dy,C){\n"
            "  const n=JAMB_WI.length; if(!n)return;\n"
            "  const i=(v>>>0)%n, wi=JAMB_WI[i], ei=JAMB_EI[i];\n"
            "  /* two rows, because the opening is two tiles tall */\n"
            "  for(let r=0;r<2;r++){\n"
            "    const ry=dy-r*C;\n"
            "    if(wi&&wi.complete&&wi.naturalWidth) g.drawImage(wi,dx-C,ry,C,C);\n"
            "    if(ei&&ei.complete&&ei.naturalWidth) g.drawImage(ei,dx+C,ry,C,C);\n"
            "  }\n"
            "  window.__JAMB_DRAWS=(window.__JAMB_DRAWS||0)+1;\n"
            "}\n")

    new = (ANCHOR + "\n"
           "        /* " + MARKER + " -- the frame bleeds into the cells either side, so the\n"
           "           door reads as an opening in a wall instead of a picture boxed in one tile. */\n"
           "        doorJamb(v,dx,dy,C);")

    city = city.replace("function facadePass(", decl + "function facadePass(", 1)
    city = city.replace(ANCHOR, new, 1)
    for nm in ('function doorJamb(', 'doorJamb(v,dx,dy,C);'):
        if city.count(nm) != 1:
            print('FAIL: post-edit %s count %d' % (nm, city.count(nm))); return 1

    out = base64.b64encode(city.encode('utf8')).decode('ascii')
    open(ALPHA, 'w', encoding='utf8').write(alpha[:m.start(1)] + out + alpha[m.end(1):])
    print('wrote %s' % ALPHA)
    print('  %d of his jamb pairs embedded (%d strips)' % (len(W), len(W) * 2))
    print('  every door now bleeds its frame into the tile left and right of it')
    return 0


if __name__ == '__main__':
    sys.exit(main())
