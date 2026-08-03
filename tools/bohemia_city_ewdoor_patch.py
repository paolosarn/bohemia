#!/usr/bin/env python3
"""
DOORS THAT FACE EAST AND WEST (8/3/26).

Paolo, on the original list: "WE MADE A COUPLE VERSIONS OF DOORS WHEN THEY ARE FACING
EAST AND WEST WHY ARE WE NOT DOING THAT."
Paolo, 8/3, after I said it was handled: "I never saw your eastern west facing doors,
bro what's up with that?"

HE IS RIGHT AND I CLOSED THIS TICKET WRONG. On 8/2 I read banks/BOHEMIA_DOOR_EW_BANK
as door JAMBS -- frame edges for the tile next door -- because the paint measures 7px at
the west or east edge of a 44x44 tile. I shipped them as a bleed into the neighbouring
cell (which he HAD separately asked for, on 8/2, in those words) and marked the E/W door
item done. Then I rendered the tiles and looked at them, which I should have done first:

    the first tile is a BROWN DOOR LEAF, SWUNG OPEN, SEEN EDGE-ON
    the rest are stone doorway arches and jambs, also edge-on

They are doors on a wall that faces east or west, drawn the only way a fixed 3/4 camera
can draw one: as a sliver on the mass edge. The 8/2 reading was not wrong about the
pixels, it was wrong about the JOB.

THE MEASURED GAP, from the 24-agent sweep:
    324 house cells have a SOUTH approach   ->  81 doors
    368 have an EAST approach
    336 have a WEST approach                ->   0 doors
Side approaches outnumber south approaches 2.2 to 1 and every one of them is a blank
wall. And the door pass I shipped an hour ago only reads the cell BELOW, so it did
nothing for any of them.

WHY IT CANNOT BE A THIRD FACADE FACE: `c.face` is set in exactly three places and all
three test the cell below, which is CORRECT for this camera -- you do not see a side
face in 3/4 view. That is precisely why his art is a 7px sliver and not a full door
plate, and why this draws as an OVERLAY on the mass edge instead of another facade pass.

THE RULE, identical in shape to the south rule shipped today:
    A DOOR GOES WHERE AN ENTERABLE BUILDING MEETS GROUND A PERSON CAN STAND ON.
    South approach -> the front-door plate on the facade.
    East / west approach -> his edge-on sliver on that side of the mass,
    one per contiguous vertical run (the topmost tile of the run takes it).
Never hashed. Read off the plot the generator already made, so every one is reachable
by construction because the cell it faces is walkable.

REUSE CHECK: cooks ZERO new graphic pixels and embeds ZERO new bytes. It reuses the
JAMB_WI / JAMB_EI image arrays already in the renderer -- the same 368 strips out of
banks/BOHEMIA_DOOR_EW_BANK_7_10_26.txt, which is where they came from and what they were
painted for. Same art, two jobs: the 8/2 bleed into the next tile, and now the side door
it always was. Nothing is resized, mirrored or recoloured.

Idempotent: re-running finds the marker and reports NOOP.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARKER = '__EW_FACING_DOORS__'

# 1. flag the cells, KIT path -- sits right after the south-door decision
KIT_ANCHOR = """        const gh=(Math.imul(gx,73856093)^Math.imul(gy,19349663))>>>0, pick=gh%20;
        c.artPool_face=doorHere?'hdoor':(pick<14?'hwall':(pick<19?'hwindow':'hboarded'));
        if(doorHere&&typeof window!=='undefined') window.__KIT_DOORS=(window.__KIT_DOORS||0)+1;
      }"""

KIT_NEW = KIT_ANCHOR[:-len("\n      }")] + """
      }
      /* """ + MARKER + """ -- a door on a wall that faces EAST or WEST.
         Measured: 368 cells have an east approach and 336 a west approach, against 324
         with a south approach, and the side ones got 0 doors because every door test in
         this renderer reads the cell BELOW. His own art has existed since 7/10 for
         exactly this: a 7px edge-on sliver, because a fixed 3/4 camera cannot show a
         side face any other way. Same rule as the south door -- ground a person can
         stand on, one per contiguous vertical run, topmost tile takes it. */
      if(entry&&entry.enter){
        const stand=(cd)=>{ if(cd===0)return true; const e2=spec.legend&&spec.legend[cd];
          if(!e2)return false; const L2=BohemiaDistrictKit.tileLayer(e2);
          return (L2.layer==='ground'||L2.layer==='portal')&&!L2.solid; };
        const isMass=(cd)=>{ if(cd===0)return false; const e2=spec.legend&&spec.legend[cd];
          return !!(e2&&e2.enter&&BohemiaDistrictKit.tileLayer(e2).layer==='structure'); };
        const upCode=(ly>0)?m.kit[(ly-1)*FN+lx]:0;
        const wCode=(lx>0)?m.kit[ly*FN+(lx-1)]:0, eCode=(lx<FN-1)?m.kit[ly*FN+(lx+1)]:0;
        const upW=(ly>0&&lx>0)?m.kit[(ly-1)*FN+(lx-1)]:0;
        const upE=(ly>0&&lx<FN-1)?m.kit[(ly-1)*FN+(lx+1)]:0;
        if(stand(wCode)&&!(isMass(upCode)&&stand(upW))) c.doorW=true;
        if(stand(eCode)&&!(isMass(upCode)&&stand(upE))) c.doorE=true;
        if((c.doorW||c.doorE)&&typeof window!=='undefined') window.__EW_DOORS=(window.__EW_DOORS||0)+1;
      }"""

# 2. the mass counts as having a door, so entry seals properly
MASS_ANCHOR = """    if(c.artPool_face==='hdoor'||(c.portal&&c.enter)){ has=true; break; }"""
MASS_NEW = """    if(c.artPool_face==='hdoor'||(c.portal&&c.enter)||c.doorW||c.doorE){ has=true; break; }"""

# 3. draw them -- an OVERLAY on the mass edge, hooked beside the traffic signals
DRAW_ANCHOR = """  sigPass(ox,oy,C);   /* __TRAFFIC_SIGNALS__ */"""
DRAW_NEW = """  sigPass(ox,oy,C);   /* __TRAFFIC_SIGNALS__ */
  ewDoorPass(ox,oy,C);   /* """ + MARKER + """ */"""

FUNC = """/* """ + MARKER + """ -- HIS east/west door art, finally drawing.
   banks/BOHEMIA_DOOR_EW_BANK_7_10_26.txt, the SAME 368 strips already embedded for the
   8/2 jamb bleed, so this adds zero bytes. Rendered and looked at before wiring: the
   first tile is a brown door leaf swung open, seen edge-on, and the rest are stone
   doorway arches. They are side doors, drawn the only way a fixed 3/4 camera can draw
   one. Two tiles tall, like every other door in this game. */
function ewDoorPass(ox,oy,C){
  const n=(typeof JAMB_WI!=='undefined')?JAMB_WI.length:0; if(!n)return;
  const gx0=Math.max(0,Math.floor(-ox/C)-1), gx1=Math.min(WORLD_F-1,Math.ceil((cv.width-ox)/C)+1);
  const gy0=Math.max(0,Math.floor(-oy/C)-1), gy1=Math.min(WORLD_F-1,Math.ceil((cv.height-oy)/C)+2);
  for(let gy=gy0;gy<=gy1;gy++)for(let gx=gx0;gx<=gx1;gx++){
    const c=cellAt(gx,gy); if(!c||(!c.doorW&&!c.doorE))continue;
    const dx=Math.round(ox+gx*C), dy=Math.round(oy+gy*C);
    const i=(OM.hash2(gx,gy,707)>>>0)%n;
    for(let r=0;r<2;r++){
      const ry=dy-r*C;
      if(c.doorW){ const im=JAMB_WI[i]; if(im&&im.complete&&im.naturalWidth) g.drawImage(im,dx,ry,C,C); }
      if(c.doorE){ const im=JAMB_EI[i]; if(im&&im.complete&&im.naturalWidth) g.drawImage(im,dx,ry,C,C); }
    }
    window.__EW_DOOR_DRAWS=(window.__EW_DOOR_DRAWS||0)+1;
  }
}
"""


def main():
    alpha = open(ALPHA, encoding='utf8', errors='ignore').read()
    m = re.search(r"CITY_B64\s*=\s*['\"`]([A-Za-z0-9+/=]{5000,})", alpha)
    if not m:
        print('FAIL: CITY_B64 not found'); return 1
    city = base64.b64decode(m.group(1)).decode('utf8', errors='ignore')
    if MARKER in city:
        print('NOOP: east/west facing doors already draw'); return 0
    for nm, txt in (('kit door pass', KIT_ANCHOR), ('massHasDoor', MASS_ANCHOR),
                    ('the signal hook', DRAW_ANCHOR)):
        if city.count(txt) != 1:
            print('FAIL: %s is not where this tool expects it (%d)' % (nm, city.count(txt))); return 1
    if 'const JAMB_WI=' not in city:
        print('FAIL: his E/W strips are not embedded -- run the jamb patch first'); return 1

    city = city.replace(KIT_ANCHOR, KIT_NEW, 1)
    city = city.replace(MASS_ANCHOR, MASS_NEW, 1)
    city = city.replace('function facadePass(', FUNC + 'function facadePass(', 1)
    city = city.replace(DRAW_ANCHOR, DRAW_NEW, 1)
    for nm in ('function ewDoorPass(', 'ewDoorPass(ox,oy,C);', 'c.doorW=true', 'c.doorE=true'):
        if city.count(nm) != 1:
            print('FAIL: post-edit %s count %d' % (nm, city.count(nm))); return 1

    out = base64.b64encode(city.encode('utf8')).decode('ascii')
    open(ALPHA, 'w', encoding='utf8').write(alpha[:m.start(1)] + out + alpha[m.end(1):])
    print('wrote %s' % ALPHA)
    print('  a building whose way in is to its EAST or WEST now has a door there,')
    print('  drawn with his own 7/10 edge-on art, and the wall beside it is sealed')
    return 0


if __name__ == '__main__':
    sys.exit(main())
