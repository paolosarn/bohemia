#!/usr/bin/env python3
"""
THE WHOLE BUILDING GOES TRANSPARENT, NOT A HALO (8/3/26).

Paolo, and he had already ruled it once before I asked again:
"Building should be absolutely transparent when I just gave you the fucking answer...
because of the nature of our game being a 45 asymmetric we gotta do better we gotta be
able to have people. See you when you're behind the building."

v1 of this was a 2-cell HALO at WALL_SEE=0.35. That is not what he said. He said
ABSOLUTELY TRANSPARENT, and he said the reason: the game is a fixed 3/4 view, so a body
behind a building has to still read. A 35% wall in a 2-cell bubble does neither.

WHAT THIS DOES:
  1. THE WHOLE BUILDING, not a bubble. The mass he is standing at or behind is resolved
     ONCE per frame through inFootprint -- the same flood fill the door rule already uses
     -- and every facade cell of THAT mass goes transparent together. A building is one
     object; half a transparent building is worse than none.
  2. ABSOLUTELY TRANSPARENT. XRAY_A=0.12, not 0.35. You can read a body through it.
  3. THE BODY IS DRAWN THROUGH IT ANYWAY. Even at 0.12 a wall tints what is behind it, so
     the front facade pass no longer paints over him at all inside that footprint: the
     mass he is behind is skipped in the FRONT pass, which is the pass that can cover a
     body. Nothing can hide him behind that building, which is the ruling.

STILL A BOUNDED SET, and that is not a hedge: only the building he is at goes clear.
Every other wall in the street stays solid, because a world where every wall is glass is
not a world, and the 7/17 note on this line is right that it must not shimmer as he walks.

WHY THE ROOF IS NOT TOUCHED: a mass's top is baked into the chunk canvas and drawn BEFORE
the body, so it is already behind him and can never hide him. The only thing that can
cover a body is the FRONT facade pass, and that is exactly what this turns off for his
building.

REUSE CHECK: cooks no graphic pixels, embeds no new bytes. Alpha constants only.

Idempotent: re-running finds the marker and reports NOOP.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARKER = '__XRAY_WHOLE_BUILDING__'

CONST_ANCHOR = """const XRAY_R=2;                 /* __XRAY_NEAR__ radius in cells: how close you stand before a building turns to glass */"""
CONST_NEW = """const XRAY_R=2;                 /* __XRAY_NEAR__ radius in cells: how close you stand before a building turns to glass */
/* """ + MARKER + """ (Paolo 8/3, ruling, after I asked a question he had already
   answered: "Building should be absolutely transparent... because of the nature of our
   game being a 45 asymmetric we gotta do better we gotta be able to have people see you
   when you're behind the building.")
   A 2-cell halo at 0.35 was not the ruling. ABSOLUTELY TRANSPARENT, and the WHOLE
   building, because a building is one object and half a clear building is worse than
   none. XRAY_A is the alpha; XRAY_FP is the footprint he is at, resolved once a frame. */
const XRAY_A=0.12;              /* absolutely transparent, not "a bit faded" */
let XRAY_FP=null, XRAY_FP_K='';
function xrayFootprint(){
  const k=hx+','+hy;
  if(k===XRAY_FP_K) return XRAY_FP;
  XRAY_FP_K=k; XRAY_FP=null;
  /* the mass he is standing at, in, or directly behind: check his own cell first, then
     the ring around him. inFootprint is the same flood fill the door rule uses. */
  for(let d=0;d<=XRAY_R&&!XRAY_FP;d++){
    for(let oy2=-d;oy2<=d&&!XRAY_FP;oy2++)for(let ox2=-d;ox2<=d&&!XRAY_FP;ox2++){
      if(Math.max(Math.abs(ox2),Math.abs(oy2))!==d)continue;
      const c=cellAt(hx+ox2,hy+oy2);
      if(c&&!c.walk&&c.enter){ const fp=inFootprint(hx+ox2,hy+oy2); if(fp)XRAY_FP=fp; }
    }
  }
  return XRAY_FP;
}
function xrayHas(gx,gy){
  const fp=xrayFootprint(); if(!fp)return false;
  return gx>=fp.x&&gx<fp.x+fp.w&&gy>=fp.y&&gy<fp.y+fp.h;
}"""

FADE_ANCHOR = """      if(a===1&&Math.abs(gx-hx)<=XRAY_R&&Math.abs(gy-hy)<=XRAY_R){
        a=WALL_SEE;
        if(typeof window!=='undefined') window.__XRAY_WALLS=(window.__XRAY_WALLS||0)+1;
      }"""

FADE_NEW = """      if(xrayHas(gx,gy)){
        /* """ + MARKER + """ -- his building, whole, and absolutely transparent.
           And in the FRONT pass it is skipped outright: the front pass is the only thing
           that can paint over a body, so nothing can hide him behind this building. */
        if(front){ g.globalAlpha=1; continue; }
        a=XRAY_A;
        if(typeof window!=='undefined') window.__XRAY_WALLS=(window.__XRAY_WALLS||0)+1;
      } else if(a===1&&Math.abs(gx-hx)<=XRAY_R&&Math.abs(gy-hy)<=XRAY_R){
        a=WALL_SEE;
        if(typeof window!=='undefined') window.__XRAY_WALLS=(window.__XRAY_WALLS||0)+1;
      }"""


def main():
    alpha = open(ALPHA, encoding='utf8', errors='ignore').read()
    m = re.search(r"CITY_B64\s*=\s*['\"`]([A-Za-z0-9+/=]{5000,})", alpha)
    if not m:
        print('FAIL: CITY_B64 not found'); return 1
    city = base64.b64decode(m.group(1)).decode('utf8', errors='ignore')
    if MARKER in city:
        print('NOOP: the whole building already goes transparent'); return 0
    if city.count(CONST_ANCHOR) != 1:
        print('FAIL: XRAY_R is not where this tool expects it -- run the xray patch first'); return 1
    if city.count(FADE_ANCHOR) != 1:
        print('FAIL: the halo test is not where this tool expects it'); return 1
    if 'function inFootprint(' not in city:
        print('FAIL: inFootprint missing'); return 1

    city = city.replace(CONST_ANCHOR, CONST_NEW, 1)
    city = city.replace(FADE_ANCHOR, FADE_NEW, 1)
    for nm in ('function xrayFootprint(', 'function xrayHas(', 'if(xrayHas(gx,gy)){', 'const XRAY_A=0.12;'):
        if city.count(nm) != 1:
            print('FAIL: post-edit %s count %d' % (nm, city.count(nm))); return 1

    out = base64.b64encode(city.encode('utf8')).decode('ascii')
    open(ALPHA, 'w', encoding='utf8').write(alpha[:m.start(1)] + out + alpha[m.end(1):])
    print('wrote %s' % ALPHA)
    print('  the WHOLE building he is at goes transparent (alpha 0.12),')
    print('  and the front pass skips it so nothing can hide his body behind it')
    return 0


if __name__ == '__main__':
    sys.exit(main())
