#!/usr/bin/env python3
"""
THE DOOR STICKS OUT INTO THE NEXT TILE (8/2/26, corrected 8/3/26).

Paolo, 8/2: "if there is a door i need you to have it stick out slightly on the
next tile that its supposed to be on... lets say its assigned to tile 0 it will
have a slight appearance in tile -1 or 1."

Paolo, 8/3, after v1 shipped: "id dint see the side door."

HE ALREADY MADE THIS ART. banks/BOHEMIA_DOOR_EW_BANK_7_10_26 says so in its note:

    "E/W door edges generalized from Paolo's locked 7px reference (his circled
     photo): each door's OWN painted frame-edge strip, cropped (never
     squished/mirrored), positioned west/east in cell. 7px width"

Measured across all 184 doors, with zero variation:

    side W   44x44   opaque columns  0..6    7px on the LEFT edge of the tile
    side E   44x44   opaque columns 37..43   7px on the RIGHT edge of the tile

WHY HE DID NOT SEE IT (v1's two bugs, both geometry, both mine):

  1. WRONG PLACE. v1 blitted the W tile at dx-C and the E tile at dx+C -- a whole
     cell over. The strip is painted at the EDGE of its own tile, so a whole-cell
     shift lands the paint on the FAR edge of the neighbour: 37px of blank wall
     between the door and its own frame. That is not a jamb, that is a stripe.
     A strip painted at the tile edge only crosses the boundary if you shift the
     tile by the STRIP's width, not the CELL's: W goes to dx-7, E to dx+7 (scaled
     by C/44), which puts the paint flush against the opening on both sides.

  2. THE EAST ONE WAS PAINTED OVER. facadePass walks gx ascending, so the cell to
     the door's right is drawn AFTER the door. Its wall covered the east jamb
     every single time. The jamb is trim standing proud of the wall beside it, so
     it has to land on top of that wall: jambs now queue and flush at the END of
     each row, after every wall in that row is down. Per ROW, not per pass, so a
     facade one row south still occludes it correctly.

WHAT THIS DOES: when the facade draws a door, that door's own west jamb bleeds 7px
into the cell on its left and its east jamb 7px into the cell on its right, once
per row of the door's two-tile height, so the frame runs the full opening and the
door reads as an opening in a wall instead of a picture boxed inside one tile.
Never stretched, never mirrored -- his note bans both, and a 44x44 strip into a
C x C cell is the same 1:1 blit every other tile gets.

STATUS OF THE ART, stated honestly: the bank marks itself UNJUDGED and says "7px
was approved for the demo doors ONLY -- these are CANDIDATES; widths adjustable per
doorway when judged." He has now asked for the behaviour twice, which is the ruling
on the BEHAVIOUR. The WIDTH stays his to judge, and it is one number here (JAMB_PX).

REUSE CHECK: cooks no graphic pixels. Every strip is lifted verbatim from
banks/BOHEMIA_DOOR_EW_BANK_7_10_26.txt. Nothing is re-cooked, resized or mirrored.

Idempotent, and it UPGRADES: run it on a blob carrying v1 and it rips v1 out and
puts the corrected geometry in. Run it twice and the second is a NOOP.
"""
import base64
import json
import re
import struct
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
BANK = 'banks/BOHEMIA_DOOR_EW_BANK_7_10_26.txt'
MARKER = '__DOOR_JAMB2__'
OLD = '__DOOR_JAMB__'

# THE WHOLE if/else CHAIN. The first cut anchored on just the `if` line and
# inserted between it and its `else`, which is a syntax error ("Unexpected token
# 'else'") that killed the entire city script -- caught by the gate's browser half,
# not by reading. Append AFTER the chain closes.
ANCHOR = """        const dr=facadeDoor(v,C);
        if(dr)g.drawImage(dr,dx,dy-C,C,C*2);
        else { const d2=tallTex('hdoor',v,2);
          if(d2)g.drawImage(d2,dx,dy-C,C,C*2);
          else if(wall){ g.drawImage(wall,dx,dy-C,C,C); g.drawImage(wall,dx,dy,C,C); } }"""

# end of the gx loop / end of the gy loop / end of facadePass, then the next
# function. The flush goes between the two closing braces: after every wall in
# the row, still inside the row.
ROWEND = """      g.globalAlpha=1;
    }
  }
}
function playerBox(ox,oy,C){"""

ROWEND_NEW = """      g.globalAlpha=1;
    }
    /* __DOOR_JAMB2__ -- every wall in this row is down; now the door frames go
       on top of the walls they stand proud of. */
    jambFlush();
  }
}
function playerBox(ox,oy,C){"""

CALL = """        /* __DOOR_JAMB2__ -- the frame bleeds into the cells either side, so the
           door reads as an opening in a wall instead of a picture boxed in one tile. */
        doorJamb(v,dx,dy,C,a);"""


def strip_v1(city):
    """Rip v1 out: its decl block, its call site, its flushless everything."""
    i = city.find('\n/* ' + OLD + ' --')
    j = city.find('function facadePass(', i)
    if i < 0 or j < 0:
        print('FAIL: v1 marker present but its block is not where expected')
        return None
    city = city[:i] + '\n' + city[j:]
    k = city.find('        /* ' + OLD + ' --')
    if k < 0:
        print('FAIL: v1 call site not found')
        return None
    e = city.find('doorJamb(v,dx,dy,C);', k)
    if e < 0:
        print('FAIL: v1 call not found')
        return None
    city = city[:k] + city[e + len('doorJamb(v,dx,dy,C);') + 1:]
    if OLD in city:
        print('FAIL: v1 left residue')
        return None
    return city


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
    upgraded = False
    if OLD in city:
        city = strip_v1(city)
        if city is None: return 1
        upgraded = True
    if city.count(ANCHOR) != 1:
        print('FAIL: the door draw is not where this tool expects it'); return 1
    if city.count(ROWEND) != 1:
        print('FAIL: the facade row loop is not where this tool expects it'); return 1

    decl = ("\n/* " + MARKER + " -- THE DOOR STICKS OUT INTO THE NEXT TILE (Paolo 8/2:\n"
            "   \"if there is a door i need you to have it stick out slightly on the next tile\n"
            "    that its supposed to be on... assigned to tile 0 it will have a slight\n"
            "    appearance in tile -1 or 1\"; 8/3, on v1: \"id dint see the side door\").\n"
            "   HIS OWN ART, from banks/BOHEMIA_DOOR_EW_BANK_7_10_26.txt, whose note pins it:\n"
            "   \"each door's OWN painted frame-edge strip, cropped (never squished/mirrored),\n"
            "    positioned west/east in cell. 7px width\". Measured on all 184 doors, no\n"
            "   variation: the W tile is opaque in columns 0..6 and the E tile in columns\n"
            "   37..43 -- the door's JAMB, meant for the cell NEXT DOOR.\n"
            "   THE PAINT IS AT THE TILE'S EDGE, so the tile is offset by the STRIP's width,\n"
            "   not the CELL's: shift a whole cell and the paint lands on the neighbour's far\n"
            "   side with 37px of blank wall between it and the door, which is what he could\n"
            "   not see. Shift 7px and it sits flush against the opening.\n"
            "   AND IT DRAWS LAST IN THE ROW, because facadePass walks gx ascending and the\n"
            "   cell to the door's right is drawn AFTER the door -- its wall buried the east\n"
            "   jamb every time. Trim stands proud of the wall beside it. */\n"
            "const JAMB_W=" + json.dumps(W, separators=(',', ':')) + ";\n"
            "const JAMB_E=" + json.dumps(E, separators=(',', ':')) + ";\n"
            "const JAMB_WI=JAMB_W.map(function(b){const i=new Image();i.src='data:image/png;base64,'+b;return i;});\n"
            "const JAMB_EI=JAMB_E.map(function(b){const i=new Image();i.src='data:image/png;base64,'+b;return i;});\n"
            "const JAMB_PX=7;            /* his locked strip width, in 44px corpus pixels */\n"
            "let JAMB_Q=[];              /* this row's door frames, flushed after the row's walls */\n"
            "function doorJamb(v,dx,dy,C,a){\n"
            "  const n=JAMB_WI.length; if(!n)return;\n"
            "  JAMB_Q.push({i:(v>>>0)%n,dx:dx,dy:dy,C:C,a:(a===undefined?1:a)});\n"
            "}\n"
            "function jambFlush(){\n"
            "  if(!JAMB_Q.length)return;\n"
            "  for(let q=0;q<JAMB_Q.length;q++){\n"
            "    const j=JAMB_Q[q], C=j.C, wi=JAMB_WI[j.i], ei=JAMB_EI[j.i];\n"
            "    const off=Math.max(1,Math.round(JAMB_PX*C/44));\n"
            "    g.globalAlpha=j.a;\n"
            "    /* two rows, because the opening is two tiles tall */\n"
            "    for(let r=0;r<2;r++){\n"
            "      const ry=j.dy-r*C;\n"
            "      if(wi&&wi.complete&&wi.naturalWidth) g.drawImage(wi,j.dx-off,ry,C,C);\n"
            "      if(ei&&ei.complete&&ei.naturalWidth) g.drawImage(ei,j.dx+off,ry,C,C);\n"
            "    }\n"
            "    g.globalAlpha=1;\n"
            "    window.__JAMB_DRAWS=(window.__JAMB_DRAWS||0)+1;\n"
            "  }\n"
            "  JAMB_Q.length=0;\n"
            "}\n")

    city = city.replace("function facadePass(", decl + "function facadePass(", 1)
    city = city.replace(ANCHOR, ANCHOR + "\n" + CALL, 1)
    city = city.replace(ROWEND, ROWEND_NEW, 1)
    for nm in ('function doorJamb(', 'function jambFlush(', 'doorJamb(v,dx,dy,C,a);', 'jambFlush();'):
        if city.count(nm) != 1:
            print('FAIL: post-edit %s count %d' % (nm, city.count(nm))); return 1

    out = base64.b64encode(city.encode('utf8')).decode('ascii')
    open(ALPHA, 'w', encoding='utf8').write(alpha[:m.start(1)] + out + alpha[m.end(1):])
    print('wrote %s%s' % (ALPHA, ' (upgraded from v1)' if upgraded else ''))
    print('  %d of his jamb pairs embedded (%d strips)' % (len(W), len(W) * 2))
    print('  every door now bleeds 7px of its own frame into the tile left and right of it,')
    print('  drawn after the row\'s walls so the east side survives to the screen')
    return 0


if __name__ == '__main__':
    sys.exit(main())
