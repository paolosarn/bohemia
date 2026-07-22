#!/usr/bin/env python3
"""
BOHEMIA CITY HOUSE ART PATCH (7/21/26) - the canon suburbs wear real houses.

Paolo's verdict on the overnight house-skin cook: ALL 30 candidates UP
(records/BOHEMIA_HOUSE_SKIN_VERDICT_7_21_26.txt) - shingle roofs, gravel
roofs, the researched S-tile batch, tan stucco walls, dead dark windows,
boarded windows, weathered doors, and three decomposed-granite yard blends.
Every class approved, so every class ships: real roof-top variety (14
tiles), a composed facade (plain/window/boarded/door), and real yard ground
replacing the flat judge-palette placeholder colors the suburb has worn
since 7/20.

THE ROUTING (marriage pattern, one step past the perimeter wall patch):
rather than encode variety into fake color strings for texFor's color-keyed
lookup, this patch gives cells their OWN art-pool fields (c.artPool for the
roof top, c.artPool_face for the front face, c.gArtPool/c.gArtVariant for
dead-dirt ground) and patches the two structure/ground draw call sites to
check them FIRST, falling back to the existing procedural/judge-palette
path if unset (nothing else in the city regresses).
  - ROOF: every house/garage/upper-floor top-render draws from the 14-tile
    hroof pool, picked by the cell's existing per-cell variant `v` (same
    variant already used everywhere else - no new randomness, regen-safe).
  - FACE: the front-facing row of each house buckets deterministically off
    a PURE f(global fine coords) hash (the STAGGERED LAW pattern - regen-
    safe, no confetti): 60% plain wall, 20% window, 10% boarded, 10% door.
    This is a composition RULE, not architecturally-precise door placement
    (that needs house-footprint segmentation this render layer doesn't
    have) - a known simplification, flagged for a future pass.
  - YARD: dead-dirt ground picks ONE of the 3 DG blends per SUBURB BLOCK
    (hashed from the 4x4 tile-group coords, same group bohemia_suburb.js
    already keys off) - one blend per neighborhood, never checkerboarded
    (the anti-confetti law).

Idempotent (marker 'hroof'). Requires the CANON SUBURB + street-art
patches already applied (SUB_RES/tileMeta/realizeCell + saTex/SA_IMG must
exist). city_tab_gate locks the art in.

  python3 tools/bohemia_city_houseart_patch.py
"""
import base64
import io
import json
import sys
import os

from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
BANK = 'banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt'
TPX = 16

bank = json.load(open(BANK))
by_id = {t['id']: t for t in bank['tiles']}


def shrink(id_):
    im = Image.open(io.BytesIO(base64.b64decode(by_id[id_]['b64']))).convert('RGB')
    im = im.resize((TPX, TPX), Image.LANCZOS)
    out = io.BytesIO()
    im.save(out, 'PNG', optimize=True)
    return base64.b64encode(out.getvalue()).decode('ascii')


ROOF_IDS = ['roof_shingle_0', 'roof_shingle_1', 'roof_shingle_2', 'roof_shingle_3',
            'roof_shingle_4', 'roof_shingle_5', 'roof_gravel_6', 'roof_gravel_7',
            'roof_stile_terracotta_21', 'roof_stile_terracotta_22',
            'roof_stile_desertbrown_23', 'roof_stile_desertbrown_24',
            'roof_stile_graybrown_25', 'roof_stile_graybrown_26']
WALL_IDS = ['wall_plain_8', 'wall_plain_9', 'wall_plain_10', 'wall_plain_11']
WINDOW_IDS = ['wall_window_12', 'wall_window_13', 'wall_window_14']
BOARDED_IDS = ['wall_boarded_15', 'wall_boarded_16', 'wall_boarded_17']
DOOR_IDS = ['wall_door_18', 'wall_door_19', 'wall_door_20']
YARD_IDS = ['yard_deserttan_27', 'yard_mojavegold_28', 'yard_rebelred_29']
ALL_IDS = ROOF_IDS + WALL_IDS + WINDOW_IDS + BOARDED_IDS + DOOR_IDS + YARD_IDS
assert len(ALL_IDS) == 30 and len(set(ALL_IDS)) == 30

POOLS = {
    'hroof': [shrink(i) for i in ROOF_IDS],
    'hwall': [shrink(i) for i in WALL_IDS],
    'hwindow': [shrink(i) for i in WINDOW_IDS],
    'hboarded': [shrink(i) for i in BOARDED_IDS],
    'hdoor': [shrink(i) for i in DOOR_IDS],
    'hyard': [shrink(i) for i in YARD_IDS],
}

alpha = open(ALPHA, encoding='utf8').read()
key = "const CITY_B64='"
a0 = alpha.index(key) + len(key)
a1 = alpha.index("'", a0)
decoded = base64.b64decode(alpha[a0:a1]).decode('utf8')

if "SA_TILES.hroof" in decoded:
    print('the suburbs already wear real houses. no-op.')
    sys.exit(0)

assert 'SA_TILES' in decoded and 'saTex' in decoded, \
    'street art patch must run first (SA_IMG/saTex machinery)'
assert "if(m.sub){" in decoded, 'canon suburb patch must run first (m.sub/tileMeta)'

HJS = """
/* ==== HOUSE ART (7/21): Paolo verdict ALL 30 UP (records/BOHEMIA_HOUSE_
   SKIN_VERDICT_7_21_26). Source: %s. Rides the street pools' saTex/SA_IMG
   machinery - six more pool keys, same cache-flush. ==== */
SA_TILES.hroof=%s; SA_TILES.hwall=%s; SA_TILES.hwindow=%s;
SA_TILES.hboarded=%s; SA_TILES.hdoor=%s; SA_TILES.hyard=%s;
for(const _hk of ['hroof','hwall','hwindow','hboarded','hdoor','hyard']){
  SA_IMG[_hk]=SA_TILES[_hk].map(b=>{ SA_LEFT++;
    const im=new Image();
    im.onload=()=>{ if(--SA_LEFT===0)saFlush(); };
    im.src='data:image/png;base64,'+b; return im; }); }
""" % (BANK, json.dumps(POOLS['hroof']), json.dumps(POOLS['hwall']),
       json.dumps(POOLS['hwindow']), json.dumps(POOLS['hboarded']),
       json.dumps(POOLS['hdoor']), json.dumps(POOLS['hyard']))

# 1) inject the pools + loaders right after SA_TILES/SA_IMG/saTex exist
ANCHOR = 'function texForKind(kind,col,variant){'
assert ANCHOR in decoded
decoded = decoded.replace(ANCHOR, HJS + '\n' + ANCHOR, 1)

# 2) the CANON SUBURB cell realizer: assign art pools per cell
OLD_SUB = """  if(m.sub){ /* CANON SUBURB codes: 0 dead 1 road 2 house 3 drive 4 wall 5 gate 6 garage 9 upper */
    const v=m.sub[ly*FN+lx];
    c.g='#8a7a5e';                                   // dead dirt (act-1: nothing grows)
    if(v===1||v===5){ c.g='#8a8a86'; }               // interior street / gate opening
    else if(v===3){ c.g='#c8c4b8'; }                 // driveway apron
    else if(v===4){ c.s='#6a5c44'; c.walk=false; }   // perimeter wall (approved judge palette)
    else if(v===2||v===6||v===9){
      /* the APPROVED suburb-judge palette (Paolo thumbed these exact tones);
         real house ART is [PENDING Paolo]: needs a cook + verdict cycle */
      c.s=v===9?'#b3a488':(v===6?'#6d5f4b':'#9c8e76'); c.walk=false;
      const below=(ly+1<FN)?m.sub[(ly+1)*FN+lx]:0;
      if(!(below===2||below===6||below===9)) c.face=true;
    }
    return c;
  }"""
assert OLD_SUB in decoded
NEW_SUB = """  if(m.sub){ /* CANON SUBURB codes: 0 dead 1 road 2 house 3 drive 4 wall 5 gate 6 garage 9 upper */
    const v=m.sub[ly*FN+lx];
    c.g='#8a7a5e';                                   // dead dirt (act-1: nothing grows)
    if(v===1||v===5){ c.g='#8a8a86'; }               // interior street / gate opening
    else if(v===3){ c.g='#c8c4b8'; }                 // driveway apron
    else if(v===0){                                  // dead dirt: one DG blend per BLOCK
      const bh=(Math.imul(tx>>2,2654435761)^Math.imul(ty>>2,40503))>>>0;
      c.gArtPool='hyard'; c.gArtVariant=bh%3;
    }
    else if(v===4){ c.s='#6a5c44'; c.walk=false; }   // perimeter wall (rides WALL_MAP)
    else if(v===2||v===6||v===9){
      /* CANON house/garage/upper: real roof + facade art (Paolo verdict 7/21) */
      c.s=v===9?'#b3a488':(v===6?'#6d5f4b':'#9c8e76'); c.walk=false;
      c.artPool='hroof';
      const below=(ly+1<FN)?m.sub[(ly+1)*FN+lx]:0;
      if(!(below===2||below===6||below===9)){
        c.face=true;
        const gh=(Math.imul(gx,73856093)^Math.imul(gy,19349663))>>>0, pick=gh%10;
        c.artPool_face=pick<6?'hwall':(pick<8?'hwindow':(pick===8?'hboarded':'hdoor'));
      }
    }
    return c;
  }"""
decoded = decoded.replace(OLD_SUB, NEW_SUB, 1)

# 3) the draw call sites: art pools win when set, else the existing path holds
GROUND_OLD = "x.drawImage(_gt||texFor(c.g,false,v),i2*TPX,y*TPX);"
assert GROUND_OLD in decoded
GROUND_NEW = ("if(!_gt&&c.gArtPool){ const _ht=saTex(c.gArtPool,c.gArtVariant); if(_ht)_gt=_ht; }\n"
              "    x.drawImage(_gt||texFor(c.g,false,v),i2*TPX,y*TPX);")
decoded = decoded.replace(GROUND_OLD, GROUND_NEW, 1)

STRUCT_OLD = ("if(c.s){ if(c.face)x.drawImage(texForKind('wall',c.s,v),i2*TPX,y*TPX);\n"
              "      else x.drawImage(texFor(c.s,true,v),i2*TPX,y*TPX);")
assert STRUCT_OLD in decoded
STRUCT_NEW = ("""if(c.s){ let _ht2=null;
      if(c.face&&c.artPool_face) _ht2=saTex(c.artPool_face,v);
      else if(!c.face&&c.artPool) _ht2=saTex(c.artPool,v);
      if(_ht2) x.drawImage(_ht2,i2*TPX,y*TPX);
      else if(c.face)x.drawImage(texForKind('wall',c.s,v),i2*TPX,y*TPX);
      else x.drawImage(texFor(c.s,true,v),i2*TPX,y*TPX);""")
decoded = decoded.replace(STRUCT_OLD, STRUCT_NEW, 1)

reencoded = base64.b64encode(decoded.encode('utf8')).decode('ascii')
open(ALPHA, 'w', encoding='utf8').write(alpha[:a0] + reencoded + alpha[a1:])
n = sum(len(v) for v in POOLS.values())
print('the suburbs wear real houses: %d canon tiles embedded (%d KB) - '
      '14 roofs, plain/window/boarded/door facades, 3 yard blends' %
      (n, sum(len(t) for v in POOLS.values() for t in v) // 1024))
