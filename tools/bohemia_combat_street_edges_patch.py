#!/usr/bin/env python3
"""BOHEMIA - COMBAT v96: THE SIDEWALK HAS TO END, AND THE GROUND HAS TO STOP REPEATING.

Two bugs in v94's OWN tile mapping, found by looking at the rendered fight rather
than by trusting that the swap worked. Both are mine, neither is the art's.

--- BUG 1: THE SIDEWALK NEVER ENDED --------------------------------------
v94's streetKindAt returned 'walk' for every cell past the kerb, forever. So the
fight took place on a road with an INFINITE CONCRETE SIDEWALK either side,
covering roughly two thirds of the screen. Nothing in Las Vegas looks like that,
and the sidewalk was visually shouting over the road it exists to edge.

FIX: the sidewalk is TWO TILES, which is what a real Clark County sidewalk is,
and past it the ground becomes the lot. The tile used for the lot is the approved
starter set's own `dirt`, whose dossier line reads, word for word, "the graded
dirt every lot sits on", plus the approved gravel yard and concrete slab. I am
following the tile's own description, not inventing a district: what is ACTUALLY
built on that lot is Paolo's call and no building is placed here.

--- BUG 2: THE GROUND VISIBLY REPEATED -----------------------------------
Three walk variants across a two-thirds-of-the-screen surface tiles VISIBLY. The
approved walk tiles carry a strong dark motif and the eye locked onto the grid
instantly. That is the exact "a busy floor is a failed floor" failure the desert
ground form already names, arriving from the other direction.

FIX, AND IT COSTS NOTHING: rotate at BLIT time. The scaled-tile cache already
rebuilds per tile size, so each entry now also carries a quarter-turn, and the
same coordinate hash picks the rotation as well as the variant. 3 tiles become
12 distinct cells, 6 lot tiles become 24. ZERO extra payload, ZERO new pixels,
and rotation is an operation this art already expects (the street bank ships its
own rot90_for_EW_road table).

Only isotropic surfaces are rotated. The kerb and the gutter are DIRECTIONAL --
their lip and their shadow have to face the road -- so they keep the measured
orientation v94 gave them and are never spun.

--- WHY A NEW TOOL AND NOT AN EDIT TO v94 --------------------------------
THE IDEMPOTENCY TRAP: v94 has shipped, so its patch function returns early on an
already-marked demo and editing it would do NOTHING to the build. A change to
shipped code goes in the NEXT patch as a migration. This tool extends v94's
STREET_B64 in place rather than restating a 51KB literal, and re-runs the loader
for the added keys only.

REUSE CHECK: no art or audio is cooked, read or written. New tiles consumed, all
USED BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt (Paolo approved 7/28,
picked again 7/29, byte-locked in the visual constitution, and what the RUN
ships): dirt, yard_0/1/2, concrete_0/1. Everything else is v94's already-loaded
approved art seen from a different quarter-turn.

Every replacement asserts its anchor count EXACTLY. Idempotent.

Usage: python3 tools/bohemia_combat_street_edges_patch.py
Gate:  node gates/combat_lab_gate.js   (section 30)
"""
import base64, io, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
RECOOK_BANK = 'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt'
RECOOK = os.path.join(ROOT, RECOOK_BANK)
MARK = 'V96 THE SIDEWALK ENDS'


def subN(src, old, new, tag, n=1):
    got = src.count(old)
    if got != n:
        sys.exit('FAIL anchor [%s]: found %d times (want %d)' % (tag, got, n))
    return src.replace(old, new)


def bake_lot():
    """The lot beyond the sidewalk, straight out of the approved starter set."""
    rec = json.load(open(RECOOK, encoding='utf8'))
    tiles = {t['id']: t['b64'] for t in rec['tiles']}
    ids = ['dirt', 'yard_0', 'yard_1', 'yard_2', 'concrete_0', 'concrete_1']
    out = {'lot': [tiles[i] for i in ids]}
    size = sum(len(b) for b in out['lot'])
    print('  lot ground: %d approved tiles, %.0f KB (%s)' % (len(ids), size / 1024, ', '.join(ids)))
    return out


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo
    if 'V94 THE FIGHT STANDS ON THE APPROVED STREET' not in demo:
        sys.exit('FAIL: v94 must be applied first (this migrates its mapping)')

    blob = json.dumps(bake_lot(), separators=(',', ':'))

    # ---- 1. the lot tiles join the set, loaded the same way -----------------
    demo = subN(demo,
        "/* Rescaling 44px art once per cell per frame IS the cost.",
        "/* ===== V96 THE SIDEWALK ENDS ======================================\n"
        "   v94 returned 'walk' for every cell past the kerb, FOREVER, so the fight\n"
        "   happened on a road with an infinite concrete sidewalk either side covering\n"
        "   two thirds of the screen. A sidewalk is TWO TILES and then it is somebody's\n"
        "   lot. This is the approved starter set's own `dirt`, whose dossier line is\n"
        "   \"the graded dirt every lot sits on\", with the gravel yard and concrete slab\n"
        "   for variety. WHAT IS BUILT on that lot is Paolo's call: nothing is placed. */\n"
        "const STREET_B64X=" + blob + ";\n"
        "(function(){ for(const k in STREET_B64X){ STREET_B64[k]=STREET_B64X[k]; STREET_IMG[k]=[];\n"
        "  STREET_B64X[k].forEach((b,i)=>{ _stPend++; const im=new Image();\n"
        "    im.onload=()=>{ STREET_IMG[k][i]=im; if(--_stPend===0)STREET_READY=true; };\n"
        "    im.onerror=()=>{ if(--_stPend===0)STREET_READY=true; };\n"
        "    im.src='data:image/png;base64,'+b; }); } })();\n"
        "/* V96 QUARTER TURNS, FOR FREE. Three walk variants across two thirds of the\n"
        "   screen TILED VISIBLY -- the eye locked onto the grid instantly, which is the\n"
        "   \"a busy floor is a failed floor\" failure arriving from the other direction.\n"
        "   The blit cache already rebuilds per tile size, so each entry now carries a\n"
        "   quarter-turn too and the same hash picks it. 3 tiles become 12 cells, 6\n"
        "   become 24, at ZERO payload and with no new pixels.\n"
        "   DIRECTIONAL tiles are NEVER spun: the kerb lip and the gutter shadow have to\n"
        "   face the road, and v94 measured which way that is. */\n"
        "const ST_SPIN={road:1,walk:1,lot:1};   /* isotropic surfaces only */\n"
        "/* Rescaling 44px art once per cell per frame IS the cost.",
        'the lot ground joins the set')

    # ---- 2. the cache carries a rotation ------------------------------------
    demo = subN(demo,
        "function streetTile(kind,idx,px){\n"
        "  if(!STREET_READY)return null;\n"
        "  if(_stCacheT!==px){ _stCache={}; _stCacheT=px; }\n"
        "  const key=kind+'|'+idx; if(_stCache[key])return _stCache[key];\n"
        "  const src=(STREET_IMG[kind]||[])[idx]; if(!src)return null;\n"
        "  const c=document.createElement('canvas'); c.width=c.height=px;\n"
        "  const g=c.getContext('2d'); g.imageSmoothingEnabled=false;\n"
        "  g.drawImage(src,0,0,px,px);\n"
        "  _stCache[key]=c; return c; }",
        "function streetTile(kind,idx,px,rot){\n"
        "  if(!STREET_READY)return null;\n"
        "  if(_stCacheT!==px){ _stCache={}; _stCacheT=px; }\n"
        "  rot=ST_SPIN[kind]?((rot|0)&3):0;   /* V96: directional tiles never spin */\n"
        "  const key=kind+'|'+idx+'|'+rot; if(_stCache[key])return _stCache[key];\n"
        "  const src=(STREET_IMG[kind]||[])[idx]; if(!src)return null;\n"
        "  const c=document.createElement('canvas'); c.width=c.height=px;\n"
        "  const g=c.getContext('2d'); g.imageSmoothingEnabled=false;\n"
        "  if(rot){ g.translate(px/2,px/2); g.rotate(rot*Math.PI/2); g.translate(-px/2,-px/2); }\n"
        "  g.drawImage(src,0,0,px,px);\n"
        "  _stCache[key]=c; return c; }",
        'the blit cache carries a quarter turn')

    # ---- 3. the sidewalk ends -----------------------------------------------
    demo = subN(demo,
        "  if(wx===ST_LANE_L-2)return 'kerbL';\n"
        "  if(wx===ST_LANE_R+2)return 'kerbR';\n"
        "  return 'walk'; }",
        "  if(wx===ST_LANE_L-2)return 'kerbL';\n"
        "  if(wx===ST_LANE_R+2)return 'kerbR';\n"
        "  /* V96: TWO tiles of sidewalk, the real Clark County width, and then it is\n"
        "     somebody's lot. Before this it was sidewalk to the horizon. */\n"
        "  if(wx>=ST_LANE_L-4&&wx<=ST_LANE_R+4)return 'walk';\n"
        "  return 'lot'; }",
        'the sidewalk is two tiles wide')

    # ---- 4. the hash picks a rotation as well as a variant ------------------
    demo = subN(demo,
        "      const _sk=streetKindAt(wx), _sn=(STREET_B64[_sk]||[1]).length;\n"
        "      const _st=streetTile(_sk,h%_sn,Math.ceil(t)+1);",
        "      /* V96: the SAME hash now picks the quarter-turn too, so the variation\n"
        "         pattern is still one deterministic function of the cell -- there are\n"
        "         just four times as many faces it can land on. */\n"
        "      const _sk=streetKindAt(wx), _sn=(STREET_B64[_sk]||[1]).length;\n"
        "      const _st=streetTile(_sk,h%_sn,Math.ceil(t)+1,(h/_sn)|0);",
        'the hash picks the rotation too')

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
