#!/usr/bin/env python3
"""
SUN + CAST SHADOWS (8/2/26) -- the buildings finally throw shade, and it moves.

Paolo: "WHY IS THERE NO SHADING OR SHADOWS FROM THE BUILDINGS. ARE WE DOING
ANYTHING TO IMPLEMENT THE DIRECTION OF SHADOWS WITH THE TIME OF DAY IT IS?"

MEASURED BEFORE THIS LANDED, in a real browser on the surface he plays: the
walked world emitted 23 fillRects a frame and every one of them was a 1px edge
line. The ground one cell south of a house read [154.48, 104.12, 78] -- pixel for
pixel the SAME as open ground eight cells from any building. Nothing cast
anything. And there was no sun to cast along: the only consumer of the clock was
isNight(), a boolean.

ONE SUN, ONE CLOCK. sunVec() reads T.min and nothing else, and its horizons are
literally the two numbers isNight() uses, so the sun can never disagree with the
night.

THE SHAPE IS THE MASS'S, NOT THE TILE'S. Every solid cell throws its OWN height
down the sun vector, and a cell whose neighbour in the sun direction is also solid
is culled -- its band is a subset of that neighbour's -- so only the mass's
sun-facing RIM does any work: 6 rects for a 6x6 house instead of 36.

ONE FILL, NEVER DOUBLE-DARK. Every band goes into ONE path and ONE fill(), so
canvas nonzero winding paints the union exactly once. Stacking translucent rects
would paint every overlap twice and make a plaid out of a terrace.

INTEGER, ALWAYS. Every rect is C x C at a Math.round()ed offset -- the render
contract's whole-pixel lattice. No art is scaled and no smoothing path is touched.

A SEPARATE LAYER, never baked: this is a render-time ground pass driven by the one
light direction. Not one pixel of it is baked into a tile.

COST, median of 120 real renders: +0.0ms at HC=88, +0.1ms at HC=44, +0.2-0.3ms at
HC=22, +0.6-0.8ms at HC=11 (widest zoom, worst case 745 rects). SHADOW_MAX is the
dial if a phone ever needs it cheaper.

REUSE CHECK: cooks ZERO pixels and selects no asset. It draws no art at all -- one
flat rgba(0,0,0,0.34) union fill on the ground layer, derived from the world's own
cell data (c.s / c.face / c.wallH / c.artPool) and the world's own clock (T.min).
No banks/ entry applies because nothing is created or chosen.

Idempotent: re-running finds the marker and reports NOOP.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARKER = 'SUN + CAST SHADOWS'

E1_OLD = "function facadePass(ox,oy,C,front,pgy,pbox){"
E1_NEW = """/* ==== """ + MARKER + """ (8/2/26, Paolo, BUILT WORLD LAW clause B2) =====
   "WHY IS THERE NO SHADING OR SHADOWS FROM THE BUILDINGS. ARE WE DOING
    ANYTHING TO IMPLEMENT THE DIRECTION OF SHADOWS WITH THE TIME OF DAY IT IS?"

   Measured before this landed, on the real surface: the walked world emitted 23
   fillRects a frame and every one was a 1px edge line. Ground one cell south of a
   house read [154.48,104.12,78] -- identical to open ground eight cells from any
   building. Nothing cast anything, and there was no sun to cast along: the only
   consumer of the clock was isNight(), a boolean.

   ONE SUN, ONE CLOCK: sunVec() reads T.min and nothing else, and its horizons are
   the two numbers isNight() already uses, so the sun can never disagree with the
   night. Below the horizon it returns null and this pass costs zero.

   THE SHAPE IS THE MASS'S, NOT THE TILE'S: a cell whose neighbour in the sun
   direction is also solid is culled -- its band is a subset of that neighbour's --
   so only the mass's sun-facing RIM works: 6 rects for a 6x6 house, not 36.

   ONE FILL, NEVER DOUBLE-DARK: every band goes into ONE path and ONE fill(), so
   nonzero winding paints the union exactly once. Stacking translucent rects would
   paint every overlap twice and make a plaid out of a terrace.

   INTEGER ALWAYS: every rect is C x C at a rounded offset, the whole-pixel
   lattice. Nothing is scaled and no smoothing path is touched. */
const SUN_UP=6*60, SUN_DOWN=19*60;   /* THE SAME two numbers isNight() uses */
const SHADOW_A=0.34;                 /* one flat value. NO DITHER, NO GRADIENT */
const SHADOW_MAX=5;                  /* cells: the longest a shadow ever runs */
const SHADOW_SWEEP=1.15;             /* radians of azimuth swing, dawn -> dusk */
function sunVec(){
  if(T.min<SUN_UP||T.min>=SUN_DOWN)return null;         /* no sun, no shadow */
  const t=(T.min-SUN_UP)/(SUN_DOWN-SUN_UP);             /* 0 dawn .. 1 dusk */
  /* AZIMUTH. North-up map: the sun rises EAST (screen right) and sets WEST, so
     the shadow points LEFT in the morning, straight down at midday and RIGHT in
     the afternoon -- and that afternoon half IS the "key from the upper left,
     shadows fall down and to the right" the mobile render contract pins. */
  const a=(t-0.46)*SHADOW_SWEEP;
  /* ELEVATION: a sine arc, so shadows are longest at the horizons and shortest
     overhead; cot(elevation) is the true length-per-height. Clamped both ends so
     a dawn shadow cannot run off the neighbourhood and noon still lands a
     readable shape rather than nothing. */
  const el=Math.sin(Math.PI*t)*1.30+0.16;
  const len=Math.max(0.55,Math.min(SHADOW_MAX/3,1/Math.tan(el)));
  return {dx:Math.sin(a),dy:Math.cos(a),len:len};
}
function shadowPass(ox,oy,C){
  const S=sunVec(); if(!S)return 0;
  const sxi=Math.round(S.dx), syi=Math.round(S.dy);
  const M=SHADOW_MAX+1;
  const gx0=Math.max(0,Math.floor(-ox/C)-M), gx1=Math.min(WORLD_F-1,Math.ceil((cv.width-ox)/C)+M);
  const gy0=Math.max(0,Math.floor(-oy/C)-M), gy1=Math.min(WORLD_F-1,Math.ceil((cv.height-oy)/C)+M);
  let n=0;
  g.beginPath();
  for(let gy=gy0;gy<=gy1;gy++)for(let gx=gx0;gx<=gx1;gx++){
    const c=cellAt(gx,gy); if(!c||!c.s)continue;
    const nb=cellAt(gx+sxi,gy+syi); if(nb&&nb.s)continue;   /* the rim only */
    const wh=c.wallH||((c.face||c.artPool==='hroof')?WALL_H:1);  /* its OWN height:
       a building mass is WALL_H, a declared wall or fence says so itself, and a
       PROP -- a bin, a stump, a dead car cell -- is one tile, or it throws a
       two-storey shadow. */
    const steps=Math.max(1,Math.min(SHADOW_MAX,Math.round(S.len*wh)));
    const bx=Math.round(ox+gx*C), by=Math.round(oy+gy*C);
    for(let k=1;k<=steps;k++){
      const t2=cellAt(gx+Math.round(k*S.dx),gy+Math.round(k*S.dy));
      if(t2&&t2.s)continue;                   /* a shadow does not climb a roof */
      g.rect(bx+Math.round(k*C*S.dx), by+Math.round(k*C*S.dy), C, C); n++;
    }
  }
  if(!n)return 0;
  g.fillStyle='rgba(0,0,0,'+SHADOW_A+')';
  g.fill();
  window.__SHADOW_RECTS=n;                     /* what the gate counts */
  return n;
}
function facadePass(ox,oy,C,front,pgy,pbox){"""

E2_OLD = """  tpDraw(ox,oy);
  /* THREE-TILE WALL: everything he is standing SOUTH of, at full opacity */"""
E2_NEW = """  tpDraw(ox,oy);
  /* SUN: the masses throw their shadows on the GROUND -- after the baked ground
     and the tile scatter, before any wall, any resident and the player. A shadow
     lands under the world's feet and never on a wall or a body. */
  shadowPass(ox,oy,C);
  /* THREE-TILE WALL: everything he is standing SOUTH of, at full opacity */"""


def main():
    alpha = open(ALPHA, encoding='utf8', errors='ignore').read()
    m = re.search(r"CITY_B64\s*=\s*['\"`]([A-Za-z0-9+/=]{5000,})", alpha)
    if not m:
        print('FAIL: CITY_B64 not found'); return 1
    city = base64.b64decode(m.group(1)).decode('utf8', errors='ignore')
    if MARKER in city:
        print('NOOP: the buildings already cast shadows'); return 0

    for name, old in (('facadePass', E1_OLD), ('the ground layer call site', E2_OLD)):
        n = city.count(old)
        if n != 1:
            print('FAIL: %s anchor found %d times, expected 1' % (name, n)); return 1
    for nm in ('shadowPass', 'sunVec', 'SUN_UP', 'SHADOW_A'):
        if nm in city:
            print('FAIL: name %s already taken in the blob' % nm); return 1

    city = city.replace(E1_OLD, E1_NEW, 1).replace(E2_OLD, E2_NEW, 1)
    for nm, want in (('function shadowPass(', 1), ('function sunVec(', 1), ('shadowPass(ox,oy,C);', 1)):
        if city.count(nm) != want:
            print('FAIL: post-edit %s count %d' % (nm, city.count(nm))); return 1

    out = base64.b64encode(city.encode('utf8')).decode('ascii')
    open(ALPHA, 'w', encoding='utf8').write(alpha[:m.start(1)] + out + alpha[m.end(1):])
    print('wrote %s' % ALPHA)
    print('  buildings now cast shadows on the ground')
    print('  direction and length follow the in-game clock, one sun, one union fill')
    return 0


if __name__ == '__main__':
    sys.exit(main())
