#!/usr/bin/env python3
"""BOHEMIA - COMBAT v94: THE FIGHT STANDS ON THE APPROVED STREET.

Paolo: "lets continue working on combat please"

--- WHAT THIS IS ---------------------------------------------------------
This cooks NOTHING. It is the wiring job the COMBAT lane's own tile-form
shopping check turned up on 7/28 (records/BOHEMIA_COMBAT_TILE_SHOPPING_
FINDINGS_7_28_26.md): the fight has been painting its own ground and its own
road markings by hand while Paolo's approved art sat in banks with no consumer.

BEFORE: drawField computed a coordinate hash, took a +/-3 tone jitter off it,
and filled rgb(g+16,g+9,g+1) per cell. Then it hand-drew a double-yellow median
as two rgba(184,160,40,0.55) rectangles and white lane dashes at hardcoded world
coordinates. Every fight in the game happened on a procedural grey fill wearing
hand-painted stripes.

AFTER: every cell of the fight floor is a real approved tile.

--- REUSE CHECK: ---------------------------------------------------------
NO NEW GRAPHIC PIXELS ARE COOKED. This tool opens two approved banks in code and
lifts tiles straight out of them.
USED BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt (road_0/1/2, road_gutter,
walk_0/1/2, walk_kerb) and USED BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt
(pools.median x3, pools.lane_div x2). Detail on each, and why each:
  banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt
    Paolo approved this set 7/28 ("mark it approved") and picked it AGAIN 7/29
    ("A", over the master palette). It is byte-locked in
    records/target/BOHEMIA_VISUAL_CONSTITUTION.json and it is what the RUN
    ships. USED: road_0/1/2, road_gutter, walk_0/1/2, walk_kerb.
    *** THIS IS THE POINT: the run and the fight now stand on the same street.
        Combat was the only surface still inventing its own ground. ***

  banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt
    Approved (REAL_VEGAS R2), already wired in CITY. USED: pools.median x3 and
    pools.lane_div x2. WHY THIS BANK AND NOT THE STARTER SET: the starter set's
    only centre line is road_centre, which is WHITE, and the LINE COLOR LAW says
    yellow = direction split, white = lane. The starter set has no yellow
    median, so a median drawn from it would break a law. This bank has the one
    approved double-yellow in the game, and it carries Paolo's own
    markings_30yr_law (wash 0.55 + a second 0.40 pass, 7/14: "whites and yellows
    of all medians/crosswalks/lanes/parking should be more washed out").

  MEASURED BEFORE MIXING, not assumed: the two banks' asphalt is 2.6 luminance
  apart (recook road mean 60.7, pool median mean 63.3) and their saturation
  matches (0.14-0.16 vs 0.13-0.16). They sit together. Measuring this was the
  whole reason to open both instead of picking one and hoping.

  Checked and NOT used: GORE_OVERLAY_BANK (blood is [PENDING Paolo] - the index
  holds it for story placement and contents are his); MARKING_BANK's 84 items
  (the median/lane_div pools above are the same class and already cut as tiles);
  DEMO_PROP_POOL (props, not ground).

--- EVERY ROTATION IS MEASURED, NONE IS GUESSED ---------------------------
The approved tiles are authored for an EAST-WEST road. The combat street runs
NORTH-SOUTH (its median is at a constant world x, extending in y). So they turn,
and which way each one turns was measured off the pixels:

  walk_kerb   bottom 6 rows mean luminance 146.4 vs walk_0's 117.2 -> THE KERB
              LIP IS A BRIGHT BAND ON THE BOTTOM EDGE. Rotated so the lip faces
              the road: +90 on the left sidewalk, -90 on the right.
  road_gutter top 6 rows 49.5 vs bottom 61.4 -> THE KERB SHADOW IS ON THE TOP
              EDGE. Rotated so the shadow faces the kerb: -90 left, +90 right.
  median /    row-to-row variation 4.6 vs column-to-column 2.1 -> THE LINES RUN
  lane_div    HORIZONTAL. Rotated 90 so they run along the street.
  road_0/1/2  isotropic crack fields, no directional feature. Not rotated.

  The bank itself declares rot90_for_EW_road in its own orientation_table, so
  rotation is an expected operation on this art, not a liberty taken with it.

--- THE ANATOMY IS NOT AUTHORED HERE. MAP LAW HELD. ----------------------
drawField ALREADY declared this street: median at world x=2.5, lane lines at
x=-1.5 and x=6.5. This patch renders that declaration with real tiles instead of
fake ones. The one thing the grid forces is that a line living on a cell BOUNDARY
has to become a tile living IN a cell, so each marking snaps to the cell whose
centre is nearest, ties to the lower index: 2.5 -> cell 2, -1.5 -> cell -2,
6.5 -> cell 6. That is a rule, not a taste. No new street was designed.

--- AND IT KILLS THE ORANGE AT THE ROOT ----------------------------------
The hand-painted median was rgba(184,160,40,0.55) over the asphalt, which
composites to luminance 113 across a solid 2.4px-wide, full-screen-height
rectangle, drawn AFTER drawFloor's vignette. Paolo reported it as a persistent
orange for three turns and v84C patched it with a fade.

The approved median tile's brightest 1% of pixels reaches luminance 94-101, and
they are a handful of pixels in a dashed line, not a solid full-height bar. It is
dimmer AND smaller, because Paolo's own 30-year wash law was applied to it when
it was cooked. The bright object is gone because the object is gone.

The v84C fade is NOT deleted, it is GENERALISED and FIXED: during a killshot the
whole ground steps back, not one stripe, and it now reads visNow() instead of
performance.now() so a held freeze holds the ground with it. That was a latent
instance of THE PAUSE IS EMPTY sitting in the old code.

--- PERFORMANCE ----------------------------------------------------------
Rescaling 44px art per cell per frame would be the whole cost, so each tile is
pre-scaled ONCE per tile size into an offscreen canvas and blitted after that.
The cache invalidates on a tile-size change (zoom), which is the only time the
scale moves. Until the images decode, the ORIGINAL procedural fill runs, so the
floor is never blank for a frame.

Payload: 15 images, ~42KB of base64, about +0.17% on the alpha.

Every replacement asserts its anchor count EXACTLY. Idempotent.

Usage: python3 tools/bohemia_combat_street_tiles_patch.py
Gate:  node gates/combat_lab_gate.js   (section 30)
"""
import base64, io, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
# the bank paths are their own literals so the REUSE CHECK above is a claim the
# machine can check, not a sentence only a human can read
RECOOK_BANK = 'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt'
POOLS_BANK = 'banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt'
RECOOK = os.path.join(ROOT, RECOOK_BANK)
POOLS = os.path.join(ROOT, POOLS_BANK)
MARK = 'V94 THE FIGHT STANDS ON THE APPROVED STREET'


def subN(src, old, new, tag, n=1):
    got = src.count(old)
    if got != n:
        sys.exit('FAIL anchor [%s]: found %d times (want %d)' % (tag, got, n))
    return src.replace(old, new)


def bake():
    """Open the approved banks, rotate what the measurements said to rotate,
    and hand back {key: [b64,...]}. Cooks nothing: every pixel out is a pixel in."""
    from PIL import Image

    rec = json.load(open(RECOOK, encoding='utf8'))
    pools = json.load(open(POOLS, encoding='utf8'))
    tiles = {t['id']: t['b64'] for t in rec['tiles']}

    def load(b64):
        return Image.open(io.BytesIO(base64.b64decode(b64))).convert('RGBA')

    def dump(im):
        buf = io.BytesIO()
        im.save(buf, format='PNG', optimize=True)
        return base64.b64encode(buf.getvalue()).decode('ascii')

    out = {}
    out['road'] = [dump(load(tiles['road_%d' % i])) for i in range(3)]
    out['walk'] = [dump(load(tiles['walk_%d' % i])) for i in range(3)]
    # the kerb lip is on the BOTTOM edge (measured); turn it to face the road
    out['kerbL'] = [dump(load(tiles['walk_kerb']).rotate(90, expand=True))]
    out['kerbR'] = [dump(load(tiles['walk_kerb']).rotate(-90, expand=True))]
    # the kerb shadow is on the TOP edge (measured); turn it to face the kerb
    out['gutterL'] = [dump(load(tiles['road_gutter']).rotate(-90, expand=True))]
    out['gutterR'] = [dump(load(tiles['road_gutter']).rotate(90, expand=True))]
    # the markings run horizontal (measured); turn them along the street
    out['median'] = [dump(load(b).rotate(90, expand=True)) for b in pools['pools']['median']]
    out['lane'] = [dump(load(b).rotate(90, expand=True)) for b in pools['pools']['lane_div']]

    n = sum(len(v) for v in out.values())
    size = sum(len(b) for v in out.values() for b in v)
    print('  baked %d approved tiles, %d b64 chars (%.0f KB)' % (n, size, size / 1024))
    return out


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo

    baked = bake()
    blob = json.dumps(baked, separators=(',', ':'))

    # ---- the tiles, the loader, the scale cache, and the anatomy ------------
    demo = subN(demo,
        "function drawFloor(x,W,H){",
        "/* ===== V94 THE FIGHT STANDS ON THE APPROVED STREET ==================\n"
        "   The fight used to paint its own ground: a coordinate hash, a +/-3 tone\n"
        "   jitter, and a flat fill per cell, with a hand-drawn double-yellow median\n"
        "   and hand-drawn lane dashes on top. Meanwhile the tileset Paolo approved\n"
        "   on 7/28 and picked AGAIN on 7/29 -- the one the RUN ships, the one\n"
        "   byte-locked in the visual constitution -- had never touched this surface,\n"
        "   and neither had the approved street markings.\n"
        "   COMBAT WAS THE LAST SURFACE STILL INVENTING ITS OWN GROUND. Now the run\n"
        "   and the fight stand on the same street.\n"
        "   Nothing here is cooked. Every tile is lifted from an approved bank, and\n"
        "   every rotation was MEASURED off the pixels (the kerb lip is a bright band\n"
        "   on the bottom edge, the gutter shadow is on the top edge, the markings run\n"
        "   horizontal) because these are authored for an east-west road and this\n"
        "   street runs north-south. */\n"
        "const STREET_B64=" + blob + ";\n"
        "const STREET_IMG={}; let STREET_READY=false, _stPend=0;\n"
        "(function(){ for(const k in STREET_B64){ STREET_IMG[k]=[];\n"
        "  STREET_B64[k].forEach((b,i)=>{ _stPend++; const im=new Image();\n"
        "    im.onload=()=>{ STREET_IMG[k][i]=im; if(--_stPend===0)STREET_READY=true; };\n"
        "    im.onerror=()=>{ if(--_stPend===0)STREET_READY=false; };\n"
        "    im.src='data:image/png;base64,'+b; }); } })();\n"
        "/* Rescaling 44px art once per cell per frame IS the cost. Each tile is\n"
        "   pre-scaled once per tile size and blitted after that; the cache drops on a\n"
        "   zoom, which is the only time the scale actually moves. */\n"
        "let _stCache={}, _stCacheT=-1;\n"
        "function streetTile(kind,idx,px){\n"
        "  if(!STREET_READY)return null;\n"
        "  if(_stCacheT!==px){ _stCache={}; _stCacheT=px; }\n"
        "  const key=kind+'|'+idx; if(_stCache[key])return _stCache[key];\n"
        "  const src=(STREET_IMG[kind]||[])[idx]; if(!src)return null;\n"
        "  const c=document.createElement('canvas'); c.width=c.height=px;\n"
        "  const g=c.getContext('2d'); g.imageSmoothingEnabled=false;\n"
        "  g.drawImage(src,0,0,px,px);\n"
        "  _stCache[key]=c; return c; }\n"
        "/* MAP LAW HELD: this authors no street. drawField ALREADY declared one --\n"
        "   median at world x=2.5, lane lines at x=-1.5 and x=6.5 -- and this renders\n"
        "   that declaration with real tiles. The only thing the grid forces is that a\n"
        "   line living on a cell BOUNDARY becomes a tile living IN a cell, so each\n"
        "   marking snaps to the nearest cell centre, ties to the lower index. */\n"
        "const ST_MED=2, ST_LANE_L=-2, ST_LANE_R=6;\n"
        "function streetKindAt(wx){\n"
        "  if(wx===ST_MED)return 'median';\n"
        "  if(wx===ST_LANE_L||wx===ST_LANE_R)return 'lane';\n"
        "  if(wx>ST_LANE_L&&wx<ST_LANE_R)return 'road';\n"
        "  if(wx===ST_LANE_L-1)return 'gutterL';\n"
        "  if(wx===ST_LANE_R+1)return 'gutterR';\n"
        "  if(wx===ST_LANE_L-2)return 'kerbL';\n"
        "  if(wx===ST_LANE_R+2)return 'kerbR';\n"
        "  return 'walk'; }\n"
        "function drawFloor(x,W,H){",
        'the approved street tiles + loader + anatomy')

    # ---- the floor loop now blits approved art ----------------------------
    demo = subN(demo,
        "      const j=(h%7)-3;                                    /* gentle tone jitter, never confetti */\n"
        "      const g=50+j*3;\n"
        "      x.fillStyle='rgb('+(g+16)+','+(g+9)+','+(g+1)+')';   /* asphalt brown-grey */\n"
        "      x.fillRect(sx2,sy2,t+1,t+1); } }",
        "      /* V94: a real approved tile per cell. The SAME hash that used to pick a\n"
        "         tone now picks a variant, so the variation pattern is unchanged -- only\n"
        "         what it selects is. Until the art decodes, the old fill runs, so the\n"
        "         floor is never blank for a frame. */\n"
        "      const _sk=streetKindAt(wx), _sn=(STREET_B64[_sk]||[1]).length;\n"
        "      const _st=streetTile(_sk,h%_sn,Math.ceil(t)+1);\n"
        "      if(_st){ x.drawImage(_st,Math.floor(sx2),Math.floor(sy2)); }\n"
        "      else { const j=(h%7)-3;                              /* gentle tone jitter, never confetti */\n"
        "        const g=50+j*3;\n"
        "        x.fillStyle='rgb('+(g+16)+','+(g+9)+','+(g+1)+')'; /* asphalt brown-grey */\n"
        "        x.fillRect(sx2,sy2,t+1,t+1); } } }",
        'the floor blits approved tiles')

    # ---- the hand-painted median and dashes are DELETED --------------------
    old_paint = (
        "    /* the street story: double-yellow median at world x=2.5, white lane dashes 4 tiles out */\n"
        "    const medX=cx+(2.5-offx)*t;\n"
        "    /* V84C THE MARKINGS FADE WITH THE SHOT. The instrument named this: during\n"
        "       the kill pause the game was drawing rgba(184,160,40,0.55) as a 2x2670\n"
        "       gold stripe, ten times, and Paolo has been calling it \"the orange from\n"
        "       the dial\" for three turns. It is the road's double-yellow median, and it\n"
        "       is drawn AFTER drawFloor's vignette -- so the one pass meant to dim the\n"
        "       scene runs before the brightest object in it. It is environment; during a\n"
        "       kill it has no business out-shining the body. */\n"
        "    const _mk=(G.ks&&G._ksAt)?Math.max(0,1-(performance.now()-G._ksAt)/260):1;\n"
        "    if(medX>-t*20&&medX<W+t*20){ x.fillStyle='rgba(184,160,40,'+(0.55*_mk).toFixed(3)+')';\n"
        "      x.fillRect(medX-3,-H*2,2.4,H*5); x.fillRect(medX+1,-H*2,2.4,H*5); }\n"
        "    x.fillStyle='rgba(215,205,185,'+(0.38*_mk).toFixed(3)+')';   /* V84C: the lane dashes go with it */\n"
        "    for(const lane of [-1.5,6.5]){ const lx=cx+(lane-offx)*t;\n"
        "      if(lx<-t||lx>W+t)continue;\n"
        "      const dashLen=t*1.2, gap=t*0.9;\n"
        "      let sy3=-H*2-((offy*t)%(dashLen+gap));\n"
        "      for(let yy=sy3; yy<H*3; yy+=dashLen+gap)x.fillRect(lx-1.4,yy,2.8,dashLen); }\n")
    demo = subN(demo, old_paint,
        "    /* ===== V94 THE HAND-PAINTED MARKINGS ARE GONE =====================\n"
        "       They were rgba(184,160,40,0.55) over asphalt -- luminance 113 across a\n"
        "       solid full-height bar, drawn AFTER the vignette meant to dim it. Paolo\n"
        "       called it orange for three turns and v84C patched it with a fade.\n"
        "       The approved median tile peaks at luminance 94-101 on a handful of\n"
        "       dashed pixels, because his own 30-year wash law (7/14: \"whites and\n"
        "       yellows of all medians/crosswalks/lanes/parking should be more washed\n"
        "       out\") was applied when it was cooked. The bright object is gone because\n"
        "       THE OBJECT is gone; the markings are in the ground now.\n"
        "       THE v84C FIX IS NOT DELETED, IT IS GENERALISED AND FIXED. On a kill the\n"
        "       whole ground steps back, not one stripe -- and it reads visNow() instead\n"
        "       of performance.now(), so a held freeze holds the ground with it. The old\n"
        "       line was a latent THE-PAUSE-IS-EMPTY bug: the world stopped and the\n"
        "       marking kept fading back in on wall-clock time. */\n"
        "    const _mk=(G.ks&&G._ksAt)?Math.max(0,1-(visNow()-G._ksAt)/260):1;\n"
        "    if(_mk<1){ x.fillStyle='rgba(0,0,0,'+((1-_mk)*0.42).toFixed(3)+')';\n"
        "      x.fillRect(0,0,W,H); }\n",
        'the hand-painted median and dashes are deleted')

    return demo


def main():
    src = open(ALPHA, encoding='utf8').read()
    key = "const COMBAT_B64='"
    i = src.index(key) + len(key)
    j = src.index("'", i)
    demo = base64.b64decode(src[i:j]).decode('utf8')
    print('decoded COMBAT_B64: %d bytes' % len(demo))
    new = patch(demo)
    if new is not demo:
        b64 = base64.b64encode(new.encode('utf8')).decode('ascii')
        src = src[:i] + b64 + src[j:]
        open(ALPHA, 'w', encoding='utf8').write(src)
        print('  demo: re-embedded (%d bytes, %+d)' % (len(new), len(new) - len(demo)))
    print('OK -> slices/BOHEMIA_ALPHA_0_9.html')


if __name__ == '__main__':
    main()
