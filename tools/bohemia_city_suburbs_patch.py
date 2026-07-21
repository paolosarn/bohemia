#!/usr/bin/env python3
"""
BOHEMIA CITY SUBURBS PATCH (7/20/26) - the city's neighborhoods ARE Paolo's
approved suburb.

Paolo (furious, right): "we have SUBURBS for this reason, and REAL HOUSE
SIZES - you're not gonna freestyle some 3-grid house." The city's
residential tiles were stamping the OLD build's 7/6 freestyle prefabs
(3-cell shacks) while the CANON suburb generator sat in the repo:
engine/bohemia_suburb.js - THE BLOCK Paolo approved, at his signed-off
scale study sizes (0.75 m/tile: ~14x9 m bodies, front-corner garages, car
apron driveways), walled ring, one street gate, the modularity law, its
own gates.

This patch marries it in (the streets pattern, again):
  - the CANON suburb module rides the city verbatim (byte-locked)
  - every residential tile (suburb/gated/estate) generates Paolo's block
    from its own seed, street-gated toward its REAL road neighbors -
    exactly how the world model routes it
  - the 128-fine canon block downsamples 4:1 to the city's 32-cell tile
    with PRESENCE-PRIORITY (thin walls and gates survive; houses keep
    their true footprint ratios: ~5x3 city cells = the real 14x9 m)
  - codes realize: houses/garages = structures in the APPROVED suburb-judge
    palette (real house ART pending a Paolo verdict cycle), driveway aprons, interior streets, the perimeter WALL
    (tan, solid), the gate. Ground is DEAD DIRT - which also kills the
    act-1 lawn violation found yesterday. The freestyle prefab path no
    longer runs for residential tiles.

Seed-regen friendly: pure f(cell.seed + road neighbors), cached per tile.
Idempotent (marker CANON SUBURB). city_tab_gate locks the module byte-wise.

  python3 tools/bohemia_city_suburbs_patch.py
"""
import base64
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
SUBURB = 'engine/bohemia_suburb.js'

sub = open(SUBURB, encoding='utf8').read()
assert 'BohemiaSuburb' in sub and 'homeFootprints' in sub

alpha = open(ALPHA, encoding='utf8').read()
key = "const CITY_B64='"
a0 = alpha.index(key) + len(key)
a1 = alpha.index("'", a0)
decoded = base64.b64decode(alpha[a0:a1]).decode('utf8')

if 'CANON SUBURB' in decoded:
    print('the city already builds canon suburbs. no-op.')
    sys.exit(0)

# 1) the canon module, verbatim, before the game script
MARK = '/* ============ dual traversal proof ============ */'
assert MARK in decoded
decoded = decoded.replace(MARK, '/* ==== %s (canon, married 7/20) ==== */\n%s\n%s' % (SUBURB, sub, MARK), 1)

# 2) the downsampler + tile hook (CANON SUBURB)
HOOK = """
/* ==== CANON SUBURB (7/20): residential tiles generate Paolo's approved
   block (real house sizes, walls, gate, driveways) and downsample 4:1 with
   presence-priority so thin walls survive. Freestyle prefabs are DEAD for
   residential. Ground is DEAD DIRT (act-1: no living lawn). ==== */
const SUB_RES={suburb:1,gated:1,estate:1};
function __subGrid(tx,ty,seed){
  const nb={N:om.at(tx,ty-1),S:om.at(tx,ty+1),W:om.at(tx-1,ty),E:om.at(tx+1,ty)};
  const st=[]; for(const k of ['S','E','W','N']){ const n=nb[k]; if(n&&RD[n.district])st.push(k); }
  const res=BohemiaSuburb.generate(seed>>>0,{cw:1,ch:1,streets:st.length?st:['S']});
  const G2=res.g, S=res.W/FN;             // 128 canon fine -> 32 city cells (S=4)
  const out=new Uint8Array(FN*FN);
  for(let y=0;y<FN;y++)for(let x=0;x<FN;x++){
    const cnt={};
    for(let dy=0;dy<S;dy++)for(let dx=0;dx<S;dx++){
      const v=G2[y*S+dy][x*S+dx]; cnt[v]=(cnt[v]||0)+1; }
    const houseN=(cnt[2]||0)+(cnt[6]||0)+(cnt[9]||0);
    let v=0;
    if(houseN>=6){ v=(cnt[9]||0)>=(cnt[2]||0)&&(cnt[9]||0)>=(cnt[6]||0)?9:((cnt[6]||0)>(cnt[2]||0)?6:2); }
    else if((cnt[4]||0)>=2) v=4;
    else if((cnt[5]||0)>=2) v=5;
    else if((cnt[3]||0)>=4) v=3;
    else if((cnt[1]||0)>=4) v=1;
    out[y*FN+x]=v;
  }
  return out;
}
"""
ANCHOR = 'function tileMeta(tx,ty){'
assert ANCHOR in decoded
decoded = decoded.replace(ANCHOR, HOOK + '\n' + ANCHOR, 1)

# 3) tileMeta: residential tiles carry the canon block, skip prefab lots
OPEN_BLOCK = """  if(m.open){ // scattered unwalkable clutter (rocks, brush) on open ground
    if(d!=='water')for(let k=0;k<10;k++)m.rects.push({x:4+((r()*118)|0),y:4+((r()*118)|0),w:2,h:2,col:d==='mountain'?'#6a5e50':'#b09468'});
    metaCache.set(key,m); return m;
  }"""
assert OPEN_BLOCK in decoded
decoded = decoded.replace(OPEN_BLOCK, OPEN_BLOCK + """
  if(SUB_RES[d]){ m.sub=__subGrid(tx,ty,t.seed); metaCache.set(key,m); return m; }""", 1)

# 4) realizeCell: canon codes realize with the approved art hooks
NONROAD = "  const c={g:slotGround(d),s:null,walk:d!=='water'&&d!=='mountain',q:m.q};"
assert NONROAD in decoded
decoded = decoded.replace(NONROAD, NONROAD + """
  if(m.sub){ /* CANON SUBURB codes: 0 dead 1 road 2 house 3 drive 4 wall 5 gate 6 garage 9 upper */
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
  }""", 1)

reencoded = base64.b64encode(decoded.encode('utf8')).decode('ascii')
open(ALPHA, 'w', encoding='utf8').write(alpha[:a0] + reencoded + alpha[a1:])
print('canon suburbs in the city: approved block, real house sizes, walls+gates, dead-dirt ground; freestyle prefabs dead for residential')
