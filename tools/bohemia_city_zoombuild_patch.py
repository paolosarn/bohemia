#!/usr/bin/env python3
"""
BOHEMIA ZOOM-BUILD PATCH (7/25/26, LIFE+CITY session) - the city builder IS a
zoom level of the one isometric view.

Paolo 7/25: "as you zoom out on your character then at some point it organically
becomes the city builder, and then if you keep zooming out you could see the
rest of the world... on this diamond isometric 45 degree angle view." Plus: "the
only time I'll demolish and build shit is in the city builder [zoom]."

So building is NOT a separate map. This patches the ONE iso app (CITY_B64, the
alpha's CITY tab): zoomed in you walk your character (MODE 'human'); zoomed OUT
(MODE 'city') every plot is tappable and you DEMOLISH / BUILD / BUILD BIG on it.

HOW IT WORKS (mechanism only, no invented content):
  - VERBS: engine/bohemia_cityedit.js inlined verbatim - the canon delta engine
    already used by the rest of the build (demolish-to-desert, build a canon
    district, buildBig 4-lot, THE SKELETON IS SACRED). Nothing reinvented.
  - THE ONE SEAM: om.at(x,y) is what EVERY consumer reads - the city overview
    render AND tileMeta/realizeCell (the fine-grain walk tiles). Wrapping it so
    it resolves through the delta means an edit shows at EVERY zoom level, with
    no second copy of the world. metaCache/chunkCache are cleared on an edit so
    the walked streets regenerate from the edited plot.
  - TAP PICKING: the city view is a true iso projection
    (sx=ox+(x-y)*TW/2, sy=oy+(x+y)*TH/2, p = the tile's TOP vertex), so the
    inverse is exact: dx=sx-ox, dy=sy-oy-TH/2 -> x=dx/TW+dy/TH, y=dy/TH-dx/TW.
    A drag or a pinch is never a tap (movement is accumulated, 2-finger clears).
  - Edits persist device-local (localStorage), same key/format the standalone
    builder used, so a save system can carry them. A REROLL is a new valley, so
    it clears the edits.

REUSE CHECK: cooks NO graphic pixels - it wires existing verbs into the existing
iso renderer, so no banks/ art lookup applies. The build verbs are REUSED whole
from engine/bohemia_cityedit.js (opened and inlined below, not reimplemented).

Idempotent (marker ZOOM-BUILD). city_tab_gate + zoombuild_gate lock it.

  python3 tools/bohemia_city_zoombuild_patch.py
"""
import base64
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
EDIT_ENGINE = 'engine/bohemia_cityedit.js'

alpha = open(ALPHA, encoding='utf8').read()
key = "const CITY_B64='"
a0 = alpha.index(key) + len(key)
a1 = alpha.index("'", a0)
decoded = base64.b64decode(alpha[a0:a1]).decode('utf8')

if 'ZOOM-BUILD' in decoded:
    print('zoom-build already wired. no-op.')
    sys.exit(0)

edit_body = open(EDIT_ENGINE, encoding='utf8').read()   # REUSE: the canon verbs, verbatim

# ---- 1) inline the canon edit engine + install the delta on the ONE seam -----
ANCHOR_OM = 'let seed=2026, om=OM.buildOvermap(seed);'
assert decoded.count(ANCHOR_OM) == 1

INJECT = """/* ==== ZOOM-BUILD (7/25, Paolo: "as you zoom out ... it organically becomes the
   city builder"): the SAME iso 45 view. Zoomed in you walk; zoomed OUT (city
   mode) every plot is tappable: DEMOLISH / BUILD / BUILD BIG. The verbs are the
   canon delta engine below (engine/bohemia_cityedit.js, inlined verbatim - one
   body shared with the rest of the build). Edits resolve through om.at, the ONE
   seam every consumer reads (city overview AND the fine-grain walk tiles), so a
   change shows at every zoom. ==== */
/* ==== %s (inlined verbatim) ==== */
%s
""" % (EDIT_ENGINE, edit_body)

ZB = """
// ---- ZOOM-BUILD state: the delta over the generator (never the generator) ----
const CE=window.BohemiaCityEdit;
const CB_LS='BOHEMIA_CITY_EDITS';
let EDITS=CE.parse((function(){try{return localStorage.getItem(CB_LS)||'';}catch(e){return '';}})());
function CBpersist(){ try{ localStorage.setItem(CB_LS,CE.serialize(EDITS)); }catch(e){} }
// THE ONE SEAM: every consumer (city overview render, tileMeta -> realizeCell ->
// the walked streets) reads om.at. Resolve the delta here and an edit is true at
// EVERY zoom level, with no second copy of the world.
function CBinstall(o){
  if(!o||o.__cbEdited)return o;
  const raw=o.at.bind(o); o.__cbRawAt=raw;
  o.at=function(x,y){ const t=raw(x,y); if(!t)return t;
    const d=EDITS.cells&&EDITS.cells[x+','+y];
    return (d&&d!==t.district)?Object.assign({},t,{district:d}):t; };
  o.__cbEdited=true; return o;
}
CBinstall(om);
const CB={_tapStart:null,_tapMoved:0,sel:null};
function CBdistAt(x,y){ const t=om.at(x,y); return t&&t.district; }
function CBafterEdit(){
  CBpersist();
  try{metaCache.clear();}catch(e){}     // the walked streets regenerate from the edited plot
  try{chunkCache.clear();}catch(e){}
  CBpanel(); render();
}
// exact inverse of iso(): p is the tile's TOP vertex, so centre is (sx, sy+TH/2)
function CBcellAt(sx,sy){
  const ox=cv.width/2-(city.x-city.y)*TW/2+panX, oy=cv.height/2-(city.x+city.y)*TH/2+panY;
  const dx=sx-ox, dy=sy-oy-TH/2;
  const x=Math.round(dx/TW+dy/TH), y=Math.round(dy/TH-dx/TW);
  if(x<0||y<0||x>=om.n||y>=om.n)return null;
  return [x,y];
}
function cityTapPlot(sx,sy){
  const c=CBcellAt(sx,sy);
  CB.sel=(!c||(CB.sel&&CB.sel[0]===c[0]&&CB.sel[1]===c[1]))?null:c;   // tap the same plot again to deselect
  CBpanel(); render();
}
function CBpanel(){
  let el=document.getElementById('buildpanel');
  if(!el){ el=document.createElement('div'); el.id='buildpanel';
    (document.getElementById('stage')||document.body).appendChild(el); }
  if(MODE!=='city'||!CB.sel){ el.style.display='none'; return; }
  const x=CB.sel[0], y=CB.sel[1], d=CBdistAt(x,y), sp=CE.spanAt(EDITS,x,y);
  el.style.display='block';
  const what = sp ? (d.toUpperCase()+' &middot; big building '+sp.w+'x'+sp.h+' ('+(sp.w*sp.h)+' lots)')
    : (String(d).toUpperCase()+(CE.isSkeleton(d)?' &middot; protected'
        :(d==='desert'?' &middot; empty desert':' &middot; plot')));
  let html='<div class="cbrow"><b>('+x+','+y+')</b> '+what+'</div><div class="cbrow" id="cbacts">';
  if(CE.isSkeleton(d)) html+='<span class="cbnote">the skeleton is sacred: streets, water, rail and mountains cannot be touched</span>';
  else if(d!=='desert') html+='<button id="cbdem">&#10005; '+(sp?'DEMOLISH THE WHOLE BUILDING':'DEMOLISH TO DESERT')+'</button>';
  else html+='<select id="cbtype"></select><button id="cbbuild">&#9878; BUILD</button><button id="cbbig">&#9965; BUILD BIG 2&times;2</button>';
  html+='</div>';
  el.innerHTML=html;
  const ty=el.querySelector('#cbtype');
  if(ty) CE.buildableTypes(OM.DISTRICT).forEach(function(t){
    const o=document.createElement('option'); o.value=t; o.textContent=t.toUpperCase(); ty.appendChild(o); });
  const dem=el.querySelector('#cbdem');
  if(dem) dem.onclick=function(){ const r=CE.demolish(EDITS,x,y,CBdistAt(x,y)); if(r.ok)CBafterEdit(); };
  const bd=el.querySelector('#cbbuild');
  if(bd) bd.onclick=function(){ const r=CE.build(EDITS,x,y,CBdistAt(x,y),ty.value,OM.DISTRICT); if(r.ok)CBafterEdit(); };
  const bg=el.querySelector('#cbbig');
  if(bg) bg.onclick=function(){
    const r=CE.buildBig(EDITS,x,y,2,2,ty.value,OM.DISTRICT,CBdistAt);
    if(r.ok)CBafterEdit();
    else { const a=el.querySelector('#cbacts');
      if(a)a.insertAdjacentHTML('beforeend','<span class="cbnote">'+r.why+' (needs a clear 2x2 down-right)</span>'); } };
}
"""

decoded = decoded.replace(ANCHOR_OM, INJECT + ANCHOR_OM, 1)
# the state block must sit AFTER om exists (it wraps om) - splice it after the
# POWER line that follows the om assignment
ANCHOR_POWER = 'let POWER=BOH_POWERGRID.powerMap(om,seed);'
assert decoded.count(ANCHOR_POWER) == 1
decoded = decoded.replace(ANCHOR_POWER, ANCHOR_POWER + '\n' + ZB, 1)

# ---- 2) om is rebuilt on reroll/restore: keep the seam installed -------------
REBUILD = 'om=OM.buildOvermap(seed);POWER=BOH_POWERGRID.powerMap(om,seed);'
assert decoded.count(REBUILD) == 2, decoded.count(REBUILD)
decoded = decoded.replace(REBUILD, 'om=CBinstall(OM.buildOvermap(seed));POWER=BOH_POWERGRID.powerMap(om,seed);')

# a REROLL is a brand-new valley: the old plot edits no longer mean anything
REROLL = 'seed=(seed*1103515245+12345)>>>0;'
assert decoded.count(REROLL) == 1
decoded = decoded.replace(REROLL, REROLL + '\n  EDITS=CE.makeEdits(); CBpersist(); CB.sel=null;   /* ZOOM-BUILD: new valley, edits reset */', 1)

# ---- 3) tap picking in city mode (a drag or a pinch is never a tap) ----------
PD_OLD = """    const a=two();
    if(a){ lastDist=dist(a); lastMid=mid(a); }
    else { lastMid=toCv(e);"""
assert decoded.count(PD_OLD) == 1
PD_NEW = """    const a=two();
    if(a){ lastDist=dist(a); lastMid=mid(a); CB._tapStart=null; }   /* ZOOM-BUILD: a pinch is never a tap */
    else { lastMid=toCv(e); CB._tapStart=toCv(e); CB._tapMoved=0;"""
decoded = decoded.replace(PD_OLD, PD_NEW, 1)

PM_OLD = "      panX+=c.x-lastMid.x; panY+=c.y-lastMid.y; lastMid=c; clampPan(); render();"
assert decoded.count(PM_OLD) == 1
PM_NEW = ("      if(CB._tapStart)CB._tapMoved+=Math.abs(c.x-lastMid.x)+Math.abs(c.y-lastMid.y);   /* ZOOM-BUILD: a drag is never a tap */\n"
          + PM_OLD)
decoded = decoded.replace(PM_OLD, PM_NEW, 1)

UP_OLD = 'function up(e){\n'
assert decoded.count(UP_OLD) == 1
UP_NEW = ('function up(e){\n'
          '    if(MODE===\'city\' && CB._tapStart && CB._tapMoved<8 && pts.size<=1){ cityTapPlot(CB._tapStart.x,CB._tapStart.y); }\n'
          '    if(MODE===\'city\') CB._tapStart=null;\n')
decoded = decoded.replace(UP_OLD, UP_NEW, 1)

# ---- 4) draw the selected plot (whole mass for a big building) --------------
MARK = '  // THE MARKER (you)'
assert decoded.count(MARK) == 1
HILITE = """  // ZOOM-BUILD: the selected plot (a big building highlights its WHOLE footprint)
  if(MODE!=='city'){ const _bp=document.getElementById('buildpanel');
    if(_bp&&_bp.style.display!=='none')_bp.style.display='none'; }
  else if(CB.sel){
    const _sp=CE.spanAt(EDITS,CB.sel[0],CB.sel[1]); const _cs=[];
    if(_sp){ for(let dy2=0;dy2<_sp.h;dy2++)for(let dx2=0;dx2<_sp.w;dx2++)_cs.push([_sp.ax+dx2,_sp.ay+dy2]); }
    else _cs.push(CB.sel);
    g.save(); g.globalAlpha=0.42;
    for(const c2 of _cs) dia(iso(c2[0],c2[1],ox,oy),'#f0cd78');
    g.restore();
    g.strokeStyle='#f0cd78'; g.lineWidth=2;
    for(const c2 of _cs){ const p2=iso(c2[0],c2[1],ox,oy);
      g.beginPath(); g.moveTo(p2.sx,p2.sy); g.lineTo(p2.sx+TW/2,p2.sy+TH/2);
      g.lineTo(p2.sx,p2.sy+TH); g.lineTo(p2.sx-TW/2,p2.sy+TH/2); g.closePath(); g.stroke(); }
  }
"""
decoded = decoded.replace(MARK, HILITE + MARK, 1)

# ---- 5) the panel's chrome (clear of the toolbar AND the drop-in pad) --------
CSS = """
/* ==== ZOOM-BUILD panel: the build verbs at the city zoom. Sits below the top
   toolbar and well above the DROP IN pad so it collides with neither. ==== */
#buildpanel{position:absolute;left:8px;right:8px;top:104px;z-index:8;display:none;
  background:rgba(12,10,8,0.95);border:1px solid var(--line);border-radius:8px;
  padding:8px 10px;font:11px 'Space Grotesk',system-ui,sans-serif;color:var(--ink)}
#buildpanel .cbrow{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:3px 0}
#buildpanel button{padding:7px 10px;border-radius:6px;border:1px solid var(--line);
  background:var(--face);color:var(--acc);font-weight:600;font-size:11px}
#buildpanel button:active{color:#fff;border-color:#5a4a2a;background:#1f1a10}
#buildpanel select{padding:6px;border-radius:6px;background:#111;color:#ddd;
  border:1px solid #555;max-width:44%;font-size:11px}
#buildpanel .cbnote{color:#8f8770;font-size:10px}
"""
CLOSE = '</style></head>'
assert decoded.count(CLOSE) == 1
decoded = decoded.replace(CLOSE, CSS + CLOSE, 1)

reencoded = base64.b64encode(decoded.encode('utf8')).decode('ascii')
open(ALPHA, 'w', encoding='utf8').write(alpha[:a0] + reencoded + alpha[a1:])
print('zoom-build wired: tap a plot at the city zoom -> demolish / build / build big')
print('  edit verbs reused from %s (inlined verbatim)' % EDIT_ENGINE)
