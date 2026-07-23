#!/usr/bin/env python3
"""
BOHEMIA CITY DISTRICT ART PATCH (7/22/26) - the generic marriage. "Hella
districts need textures" (Paolo). Traced it: ~32 district engine modules
(engine/bohemia_park.js, _commercial.js, _industrial.js, _downtown.js,
_medical.js, _mall.js, ... - the full built-lot canon, each already gated,
each already approved layout) sit fully built and NEVER MARRIED into the
city - the CITY still renders every one of them through a crude fallback
(PREFABS ascii stamps + a flat single SCOL color per district type,
literally commented `[PLACEHOLDER ART, pending Paolo]` in the code). This
is the suburb-before-7/20 situation, at 32x scale.

THE LEVERAGE: every one of these modules shares ONE interface
(engine/bohemia_district_kit.js's K.register/K.get/K.tileLayer - verified
by survey before writing this patch, not assumed) - generate(seed,{streets})
on the SAME SZ=128/TILE=0.75m grid as bohemia_suburb.js, a legend with a
CLOSED kind vocabulary (building/structure/fence/panel -> structure,
ground/drive/walk/marking/turf-dead/water-dead/court/play -> ground,
tree-dead/prop/vehicle -> prop, gate/portal -> portal, overhead ->
overhead) that K.tileLayer() already resolves generically. One marriage
mechanism covers all of them - no per-district code.

REUSE-FIRST (laws/BOHEMIA_ADDENDUM_REUSE_FIRST_LOCKED_7_22_26): every
structure cell routes through the CANON house-skin art (roof/wall/window/
boarded/door - Paolo's all-30-UP verdict) already married in for suburbs.
Nothing new cooked. Each district's own approved palette color rides along
as a light tint so districts still read as visually distinct from each
other under the same real material family.

SAFETY: SUB_RES districts (suburb/gated/estate) are UNCHANGED - they keep
riding bohemia_suburb.js exactly as before, this patch never touches that
path. Any district type with no registered kit module, or whose generate()
throws, falls through to the EXISTING PREFABS/SCOL system UNCHANGED (zero
regression risk - this is additive, not a replacement of the old path).
resort/casino have no dedicated module yet and correctly keep their old
megablock rendering.

SAME TURN: fixes a live standing-law violation this trace surfaced - the
PREFABS fallback's 'g'/'t' codes painted live grass/tree GREEN (park's
'grove' prefab, downtown's 'tower_plaza') - a DEAD WORLD LAW violation.
Districts that graduate to the kit path here stop hitting that code path
entirely; tools/bohemia_city_deadworld_prefab_patch.py is the standalone
fix for whatever still falls through.

Idempotent (marker 'DISTRICT ART'). city_tab_gate locks it in.

  python3 tools/bohemia_city_districtart_patch.py
"""
import base64
import sys
import os

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

MODULES = [
    'engine/bohemia_district_kit.js',   # MUST load first - every module below depends on it
    'engine/bohemia_apartment.js', 'engine/bohemia_boneyard.js', 'engine/bohemia_cemetery.js',
    'engine/bohemia_chapel.js', 'engine/bohemia_commercial.js', 'engine/bohemia_courthouse.js',
    'engine/bohemia_downtown.js', 'engine/bohemia_drivein.js', 'engine/bohemia_farm.js',
    'engine/bohemia_firestation.js', 'engine/bohemia_golf.js', 'engine/bohemia_industrial.js',
    'engine/bohemia_jail.js', 'engine/bohemia_landfill.js', 'engine/bohemia_library.js',
    'engine/bohemia_mall.js', 'engine/bohemia_medical.js', 'engine/bohemia_park.js',
    'engine/bohemia_policestation.js', 'engine/bohemia_railyard.js', 'engine/bohemia_school.js',
    'engine/bohemia_solar.js', 'engine/bohemia_stadium.js', 'engine/bohemia_storage.js',
    'engine/bohemia_substation.js', 'engine/bohemia_swapmeet.js', 'engine/bohemia_trailer.js',
    'engine/bohemia_truckstop.js', 'engine/bohemia_warehouse.js', 'engine/bohemia_wash.js',
    'engine/bohemia_waterpark.js', 'engine/bohemia_watertreat.js',
    'engine/bohemia_cityhall.js', 'engine/bohemia_battery.js', 'engine/bohemia_terminal.js',
]

alpha = open(ALPHA, encoding='utf8').read()
key = "const CITY_B64='"
a0 = alpha.index(key) + len(key)
a1 = alpha.index("'", a0)
decoded = base64.b64decode(alpha[a0:a1]).decode('utf8')

if 'DISTRICT ART' in decoded:
    print('the district kit is already married in. no-op.')
    sys.exit(0)

assert "if(m.sub){" in decoded and "SUB_RES[d]" in decoded, \
    'canon suburb patch must run first (SUB_RES/m.sub anchor)'
assert 'c.artPool=' in decoded and 'SA_TILES.hroof' in decoded, \
    'house art patch must run first (the roof/facade pools this reuses)'

bodies = []
for m in MODULES:
    src = open(m, encoding='utf8').read()
    bodies.append('/* ==== %s (canon, married 7/22) ==== */\n%s' % (m, src))
MODULE_BLOCK = '\n'.join(bodies)

MARK = '/* ============ dual traversal proof ============ */'
assert MARK in decoded
decoded = decoded.replace(MARK, MODULE_BLOCK + '\n' + MARK, 1)

# the generic block + tile-group cache (the __subBlock/__subGrid pattern,
# generalized to any K-registered district type)
KITJS = """
/* ==== DISTRICT ART (7/22): the generic marriage - every K-registered
   district module rides the city verbatim, one mechanism for all of them.
   4x4 TILE GROUP = one canon 128x128 grid, same 1:1 scale as the suburb
   patch (FN=TILE_FINE=32, SZ=128 -> 4x4 groups). ==== */
const __kitCache=new Map();
function __kitHash(s){ let h=0; for(let i=0;i<s.length;i++) h=(Math.imul(h,131)+s.charCodeAt(i))>>>0; return h; }
function __kitBlock(gx4,gy4,type){
  const k=type+'|'+gx4+','+gy4; let b=__kitCache.get(k); if(b)return b;
  const spec=(typeof BohemiaDistrictKit!=='undefined')?BohemiaDistrictKit.get(type):null;
  let g=null;
  if(spec){
    const st=[];
    const side=(name,cells)=>{ for(const [x,y] of cells){ const n=om.at(x,y); if(n&&RD[n.district]){ st.push(name); return; } } };
    side('S',[0,1,2,3].map(i=>[gx4*4+i,gy4*4+4]));
    side('E',[0,1,2,3].map(i=>[gx4*4+4,gy4*4+i]));
    side('W',[0,1,2,3].map(i=>[gx4*4-1,gy4*4+i]));
    side('N',[0,1,2,3].map(i=>[gx4*4+i,gy4*4-1]));
    const gseed=(om.seed ^ Math.imul(gx4,73856093) ^ Math.imul(gy4,19349663) ^ Math.imul(__kitHash(type),101)>>>0)>>>0;
    try{ const res=spec.generate(gseed,{streets:st.length?st:['S']}); if(res&&res.g)g=res.g; }
    catch(e){ g=null; }
  }
  b={g:g,spec:spec};
  __kitCache.set(k,b);
  if(__kitCache.size>60){ const it=__kitCache.keys(); __kitCache.delete(it.next().value); }
  return b;
}
function __kitGrid(tx,ty,type){
  const blk=__kitBlock(tx>>2,ty>>2,type);
  if(!blk.g) return null;
  const ox=(tx&3)*FN, oy=(ty&3)*FN;
  const out=new Uint16Array(FN*FN);
  for(let y=0;y<FN;y++)for(let x=0;x<FN;x++) out[y*FN+x]=blk.g[oy+y][ox+x];
  return {codes:out, spec:blk.spec};
}
"""
ANCHOR = 'function tileMeta(tx,ty){'
assert ANCHOR in decoded
decoded = decoded.replace(ANCHOR, KITJS + '\n' + ANCHOR, 1)

# tileMeta: route any K-registered, non-SUB_RES district through the kit grid
OLD_TM = "  if(SUB_RES[d]){ m.sub=__subGrid(tx,ty); metaCache.set(key,m); return m; }"
assert OLD_TM in decoded
NEW_TM = OLD_TM + """
  if(!SUB_RES[d] && typeof BohemiaDistrictKit!=='undefined' && BohemiaDistrictKit.get(d)){
    const kg=__kitGrid(tx,ty,d);
    if(kg){ m.kit=kg.codes; m.kitSpec=kg.spec; metaCache.set(key,m); return m; }
  }"""
decoded = decoded.replace(OLD_TM, NEW_TM, 1)

# realizeCell: interpret the kit grid via legend/tileLayer - one generic branch
NONROAD = "  const c={g:slotGround(d),s:null,walk:d!=='water'&&d!=='mountain',q:m.q};"
assert NONROAD in decoded
KIT_REALIZE = """
  if(m.kit){
    const code=m.kit[ly*FN+lx];
    if(code===0){
      c.g=slotGround(d);
      const bh=(Math.imul(tx>>2,2654435761)^Math.imul(ty>>2,40503))>>>0;
      c.gArtPool='hyard'; c.gArtVariant=bh%3;
      return c;
    }
    const spec=m.kitSpec, entry=spec&&spec.legend&&spec.legend[code];
    const tl=BohemiaDistrictKit.tileLayer(entry);
    const pal=(spec&&spec.palette&&spec.palette[code])||'#98948a';
    if(tl.layer==='structure'){
      c.s=pal; c.walk=false; c.artPool='hroof'; c.tint=pal;
      const belowCode=(ly+1<FN)?m.kit[(ly+1)*FN+lx]:0;
      const belowEntry=belowCode!==0&&spec.legend&&spec.legend[belowCode];
      const belowSolid=belowEntry&&BohemiaDistrictKit.tileLayer(belowEntry).layer==='structure';
      if(!belowSolid){
        c.face=true;
        const gh=(Math.imul(gx,73856093)^Math.imul(gy,19349663))>>>0, pick=gh%10;
        c.artPool_face=pick<6?'hwall':(pick<8?'hwindow':(pick===8?'hboarded':'hdoor'));
      }
      return c;
    }
    if(tl.layer==='prop'){ c.s=pal; c.walk=false; return c; }
    if(tl.layer==='portal'){ c.g='#8a8a86'; c.walk=true; return c; }
    if(tl.layer==='overhead'){ c.g=slotGround(d); c.walk=true; return c; }
    c.g=pal; c.walk=true; return c;
  }"""
decoded = decoded.replace(NONROAD, NONROAD + KIT_REALIZE, 1)

# draw call site: paint the district's own color as a light tint OVER the
# real art, so districts stay visually distinct under the shared material
TINT_ANCHOR = "if(_ht2) x.drawImage(_ht2,i2*TPX,y*TPX);"
assert TINT_ANCHOR in decoded
decoded = decoded.replace(TINT_ANCHOR,
    "if(_ht2){ x.drawImage(_ht2,i2*TPX,y*TPX); if(c.tint){ x.globalAlpha=0.16; x.fillStyle=c.tint; x.fillRect(i2*TPX,y*TPX,TPX,TPX); x.globalAlpha=1; } }",
    1)

reencoded = base64.b64encode(decoded.encode('utf8')).decode('ascii')
open(ALPHA, 'w', encoding='utf8').write(alpha[:a0] + reencoded + alpha[a1:])
print('district art married: %d canon modules embedded, generic legend-driven '
      'routing live (structure->house-skin art, tinted per district; ground/prop/portal/overhead per kind)'
      % len(MODULES))
