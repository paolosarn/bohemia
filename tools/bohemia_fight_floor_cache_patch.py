#!/usr/bin/env python3
"""
BOHEMIA — THE FIGHT DRAWS ITS FLOOR ONCE INSTEAD OF 2,504 TIMES
(9/6/26, PLUMBER lane, VAMILY row [fight headroom] THE-FIGHT-HAS-NO-HEADROOM)

WHAT IS WRONG. A fighting beat spends 497.5 of its 500 ms. Timed from inside a
real fight, the frame callback makes 2,504 drawImage calls EVERY FRAME and 99.9%
of them are the same 24x24 street tile: 455,182 of 455,728 over five seconds.
The tile a cell shows is hash(wx, wy), a pure function of the cell's world
coordinates, so it cannot change during a fight. Only the camera changes. The
whole floor is therefore the same picture, repainted from scratch sixty times a
second, one blit per cell.

EVERY NUMBER BELOW WAS MEASURED IN A LIVE FIGHT BEFORE THIS PATCH WAS WRITTEN.

1. THE COST IS PER CALL, NOT PER PIXEL, AND IT IS NOT CLOSE.
     3,675 tile calls covering 2,116,800 px    8.6 ms
     1 composite call covering 1,861,974 px    0.7 ms
     1 composite call, 1:1, covering 1,056,120 px   0.5 ms
   Twelve times cheaper for the same pixels. Without a forced raster flush the
   JS half alone is 3.9 ms against 0.0 ms. This had to be measured first,
   because a composite blit copies MORE pixels than the tiles do, and if the
   cost had been per pixel this whole idea was dead.

2. THE CACHE HITS. The key below, sampled every animation frame of a live fight:
     441 frames, key changed 9 times   -> 98.0% hit, 10 distinct floors in 10 s
     535 frames, key changed 0 times   -> 100% hit once the camera has settled
   A miss costs one extra clear and one extra blit, about 0.5 ms, so even a
   coin-flip hit rate would win. It is not a coin flip.

3. THE CACHE IS IN DEVICE SPACE, AND THAT IS WHY IT IS EXACT.
   A world-space cache (compose the floor at natural size, blit it under the
   camera scale) is NOT pixel-identical: each tile is resampled on its own
   today, a composite is resampled as one image, and the seams differ. Measured
   at the real zoom of 1.234: mean channel difference 0.167, max 16, 0.37% of
   channels off by more than 8. Close, but this lane does not ship "close" into
   the one surface the 120 BPM law governs.
   So the cache is built THROUGH THE DESTINATION'S OWN TRANSFORM, at the
   destination's own size, and blitted back 1:1 with the transform reset. Same
   rasteriser, same transform, same draw order, so the pixels are the same
   pixels. It is also the FASTEST of the three (0.5 ms against 3.4 ms for the
   world-space blit and 10.9 ms for the tiles), because a 1:1 blit does no
   resampling at all.

WHAT THIS CHANGES. The floor block moves into fieldFloorPaint() verbatim -- not
one character of the drawing is edited -- and fieldFloor() wraps it with the
cache. drawField calls fieldFloor where the block used to sit.

THE KEY IS EVERYTHING THE BLOCK READS, and it was enumerated by reading the
block, not guessed: t, cx, cy, offx, offy, gx0/gx1/gy0/gy1, arenaKind, the room
size and offset, STREET_READY, plus the full destination transform and the
context state the strokes and fills depend on. Nothing else is read.

WHY IT IS SAFE:
  - THE SIM IS NOT TOUCHED. This is painting only.
  - THE CACHE STANDS DOWN RATHER THAN GUESS. It runs the original path
    untouched whenever anything could make a composite differ from N draws:
    globalAlpha below 1 (overlapping tiles would double-blend), any composite
    operation but source-over, any filter, or a destination whose size is not
    the W and H it was handed.
  - THE TRAILING STATE IS PRESERVED EXACTLY. The old block left ctx.fillStyle,
    strokeStyle, lineWidth and lineCap set to whatever its last fill and its
    grid lines left behind, and code after it could read that. The cache context
    is SEEDED from the destination before painting and its trailing state is
    copied back after the blit, so the leftovers are the same leftovers.
  - IT SELF-HEALS. A cache miss simply repaints. There is no state to reset.
  - IT IS PROVABLE, AND THAT IS THE POINT. fieldFloor takes a noCache flag, so
    the same frame can be composed BOTH WAYS into two canvases and compared to
    each other. A fight does not repeat across boots (this lane measured the
    noise floor at 44.74), so a before-and-after across two runs could never
    have proved this. One frame, both ways, is the only honest instrument.
    gates/fight_floor_cache_gate.js is that comparison, and it is a gate.

Applied to both shipped surfaces so they stay identical. Idempotent, and it
refuses rather than guesses if the anchor is not found exactly once.
"""
import base64
import sys

SURFACES = ['slices/BOHEMIA_ALPHA_0_9.html', 'slices/BOHEMIA_DEMO.html']
KEY = "const COMBAT_B64='"
MARK = '__FLOOR_CACHE__'

FN_ANCHOR = 'function drawField(x,W,H,cx,cy,aimo){'

BLOCK_HEAD = """  { G.worldOff=G.worldOff||{x:0,y:0}; const t=ring;
    const offx=G.worldOff.x, offy=G.worldOff.y;"""

BLOCK_TAIL = """       was the one thing exempt from it. See THE KILL DIMS THE WORLD below. */
  }"""

CALL = "  fieldFloor(x,W,H,cx,cy,aimo,ring,false,(aimo||G.inc)?null:fieldFloorCam);"

HEADER = """/* ===== __FLOOR_CACHE__ (9/6, PLUMBER, row [fight headroom]) ==============
   THE FIGHT REPAINTED ITS WHOLE FLOOR EVERY FRAME. Timed inside a real fight:
   2,504 drawImage calls per frame, 455,182 of 455,728 of them the same 24x24
   street tile. The tile a cell shows is hash(wx,wy) -- it cannot change during
   a fight. Only the camera moves.

   MEASURED FIRST, BECAUSE THE IDEA DIES IF THE COST IS PER PIXEL:
     3,675 tile calls, 2,116,800 px   8.6 ms   (JS alone 3.9 ms)
     1 composite call, 1:1            0.5 ms   (JS alone 0.0 ms)

   THE CACHE IS IN DEVICE SPACE ON PURPOSE. Composing at natural size and
   blitting under the camera scale is NOT pixel-identical -- each tile is
   resampled alone today, a composite is resampled as one image. Measured at
   zoom 1.234: mean channel difference 0.167, max 16. Building THROUGH the
   camera and blitting back 1:1 is exact, and it is also the fastest of the
   three, because a 1:1 blit resamples nothing.

   AND THE CAMERA IS REPLAYED, NEVER COPIED. The first cut of this rebuilt the
   camera on the cache context with setTransform(getTransform()), which LOOKS
   exact and is not: getTransform() hands back a float32-rounded matrix while
   the context rasterises from the ops that built it. Measured, one fight, one
   frame: the same floor under a copied matrix differed from the ops in 29,610
   channels, up to 12 apart, while ops-against-ops differed in ZERO. So the
   caller hands in the function that applies the camera and the cache replays
   it. fieldFloorCam is that function, and it is the ONLY reason this is
   pixel-exact.

   The painting below is the old block, moved, not edited. */
let _FLC=null,_FLK=null,_FLS=null;
function fieldFloorCam(q,W,H){ q.setTransform(1,0,0,1,0,0); uzApply(q,W,H); }
function fieldFloorPaint(x,W,H,cx,cy,t,offx,offy,gx0,gx1,gy0,gy1){
__PAINT__
}
function fieldFloor(x,W,H,cx,cy,aimo,ring,noCache,cam){
  G.worldOff=G.worldOff||{x:0,y:0}; const t=ring;
  const offx=G.worldOff.x, offy=G.worldOff.y;
  /* EXACT FLOOR V17: invert the real camera -- the board covers exactly
     what the viewport shows, any zoom, any pan. No heuristics to lose. */
  const _c0=uzInvert(0,0,W,H), _c1=uzInvert(W,H,W,H);
  let _wx0=(Math.min(_c0[0],_c1[0])-cx)/t, _wx1=(Math.max(_c0[0],_c1[0])-cx)/t;
  let _wy0=(Math.min(_c0[1],_c1[1])-cy)/t, _wy1=(Math.max(_c0[1],_c1[1])-cy)/t;
  if(aimo&&aimo.zb&&aimo.zb>0){ _wx0/=aimo.zb; _wx1/=aimo.zb; _wy0/=aimo.zb; _wy1/=aimo.zb; }
  const PAD=6;   /* cam bias + incoming pans live inside this */
  const gx0=Math.floor(offx+_wx0)-PAD, gx1=Math.ceil(offx+_wx1)+PAD;
  const gy0=Math.floor(offy+_wy0)-PAD, gy1=Math.ceil(offy+_wy1)+PAD;
  const paint=(q)=>fieldFloorPaint(q,W,H,cx,cy,t,offx,offy,gx0,gx1,gy0,gy1);
  /* THE CACHE STANDS DOWN RATHER THAN GUESS. Every one of these would make a
     single composite blit differ from N separate draws, or would mean the
     cache is not being built under the camera the frame is actually using. */
  if(noCache || !cam || x.globalAlpha!==1
     || x.globalCompositeOperation!=='source-over'
     || (x.filter && x.filter!=='none') || !x.canvas
     || x.canvas.width!==W || x.canvas.height!==H || !(W>0) || !(H>0)){
    paint(x); return; }
  /* THE KEY IS EVERYTHING THE FLOOR READS, and the camera is in it as the
     numbers that BUILD the transform, not as the transform, because two
     different cameras can round to one float32 matrix. */
  const key=[t,cx,cy,offx,offy,gx0,gx1,gy0,gy1,W,H,
    G.arenaKind, G.cityRoom?(G.cityRoom.w+'x'+G.cityRoom.h):'-',
    G._roomAt?G._roomAt.join(','):'-',
    (typeof STREET_READY!=='undefined'&&STREET_READY)?1:0,
    uzEff(), G.userPan.x, G.userPan.y,
    x.imageSmoothingEnabled?1:0, x.lineCap, x.lineJoin].join('|');
  if(_FLK!==key){
    /* IT BUILDS ON EVERY MISS, and that was not the first answer. The cover
       zoom glides for about 3 seconds at the start of a fight, so the key
       changes every frame for 3 seconds, and a build costs more JAVASCRIPT
       than the old path (13.1 ms a frame against 4.76). So the first cut
       waited for a key to repeat before building. THE BEAT SAID THE OPPOSITE:
       building every frame put a gliding fight at 419.5 ms of its 500 ms beat
       and waiting for a repeat put it back at 498. The beat is 80% raster, not
       JavaScript, and painting the floor once into an offscreen canvas and
       blitting it 1:1 rasterises cheaper than 2,500 blits onto the live canvas
       even when nothing is reused. The 120 BPM law is about the beat, so the
       beat is the number that decides. */
    if(!_FLC) _FLC=document.createElement('canvas');
    if(_FLC.width!==W||_FLC.height!==H){ _FLC.width=W; _FLC.height=H; }
    const q=_FLC.getContext('2d');
    if(!q){ _FLK=null; paint(x); return; }
    q.setTransform(1,0,0,1,0,0); q.clearRect(0,0,W,H);
    /* SEED the cache context from the destination, so the leftovers this block
       is known to leave behind come out identical. */
    q.imageSmoothingEnabled=x.imageSmoothingEnabled;
    q.fillStyle=x.fillStyle; q.strokeStyle=x.strokeStyle;
    q.lineWidth=x.lineWidth; q.lineCap=x.lineCap; q.lineJoin=x.lineJoin;
    cam(q,W,H);   /* REPLAY the camera. Never copy the matrix. */
    /* AND CHECK THE REPLAY LANDED, so a caller handing in the wrong camera
       falls back to the old path instead of drawing a shifted floor. */
    let a=null,b=null;
    try{ a=x.getTransform(); b=q.getTransform(); }catch(e){}
    if(!a||!b||a.a!==b.a||a.b!==b.b||a.c!==b.c||a.d!==b.d||a.e!==b.e||a.f!==b.f){
      _FLK=null; paint(x); return; }
    paint(q);
    _FLS={f:q.fillStyle,s:q.strokeStyle,w:q.lineWidth,c:q.lineCap,j:q.lineJoin};
    _FLK=key;
  }
  x.save(); x.setTransform(1,0,0,1,0,0);
  x.imageSmoothingEnabled=false;   /* 1:1, so this only forbids a stray resample */
  x.drawImage(_FLC,0,0); x.restore();
  if(_FLS){ x.fillStyle=_FLS.f; x.strokeStyle=_FLS.s; x.lineWidth=_FLS.w;
            x.lineCap=_FLS.c; x.lineJoin=_FLS.j; }
}
"""


def main():
    touched = 0
    for path in SURFACES:
        src = open(path, encoding='utf8').read()
        if KEY not in src:
            print('  %s: no COMBAT_B64, skipped' % path)
            continue
        i0 = src.index(KEY) + len(KEY)
        j0 = src.index("'", i0)
        combat = base64.b64decode(src[i0:j0]).decode('utf8')
        if MARK in combat:
            print('  %s: already patched' % path)
            continue
        for a in (FN_ANCHOR, BLOCK_HEAD, BLOCK_TAIL):
            n = combat.count(a)
            if n != 1:
                print('  %s: anchor appears %d times, refusing to guess:\n%s' % (path, n, a[:70]))
                sys.exit(1)
        h = combat.index(BLOCK_HEAD)
        e = combat.index(BLOCK_TAIL) + len(BLOCK_TAIL)
        if e <= h:
            print('  %s: block tail is before its head, refusing' % path)
            sys.exit(1)
        block = combat[h:e]
        # the paint half is the tile loop and the grid lines, moved verbatim
        p0 = block.index('    for(let wy=gy0; wy<=gy1; wy++){')
        p1 = block.index("x.beginPath(); x.moveTo(-W*2,sy2); x.lineTo(W*3,sy2); x.stroke(); }")
        p1 += len("x.beginPath(); x.moveTo(-W*2,sy2); x.lineTo(W*3,sy2); x.stroke(); }")
        paint = block[p0:p1]
        if 'drawImage(_st' not in paint or 'strokeStyle' not in paint:
            print('  %s: the paint half does not look like the floor, refusing' % path)
            sys.exit(1)
        before = len(combat)
        combat = combat[:h] + CALL + combat[e:]
        combat = combat.replace(FN_ANCHOR, HEADER.replace('__PAINT__', paint) + FN_ANCHOR, 1)
        b64 = base64.b64encode(combat.encode('utf8')).decode('ascii')
        open(path, 'w', encoding='utf8').write(src[:i0] + b64 + src[j0:])
        print('  %s: patched (%d -> %d chars in the fight, %d chars of floor moved)'
              % (path, before, len(combat), len(paint)))
        touched += 1
    print('OK, %d surface(s) patched' % touched)


if __name__ == '__main__':
    main()
