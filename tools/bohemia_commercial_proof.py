#!/usr/bin/env python3
"""
BOHEMIA COMMERCIAL — MODULAR PROOF (7/18/26, still image, NOT walkable).

Paolo's first commercial district: a corner shopping plaza. Top-down proof — the
L-shaped store building on the back property lines, the parking lot fronting the
streets, curb cuts connecting the lot back to the main streets, storefronts facing
the parking. Street-aware like the suburb (exits the streets it touches).

  python3 tools/bohemia_commercial_proof.py -> slices/BOHEMIA_COMMERCIAL_PROOF.html
"""
import os
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
OUT = 'slices/BOHEMIA_COMMERCIAL_PROOF.html'
GEN = open('engine/bohemia_commercial.js', encoding='utf8').read()

UI = r"""
var C = BohemiaCommercial;
function gcol(x,y){var h=((x*73856093)^(y*19349663))>>>0,v=h%3;return ['#463f30','#3d382a','#4e4838'][v];}
// 0 ground 1 asphalt 2 store 3 aisle 4 stripe 5 curb-cut 6 sidewalk 7 door
// 8 service-alley 9 back-door 10 gas-canopy 11 gas-pump
var COL={1:'#3a3a40',2:'#8c8477',3:'#4a4a52',4:'#c9c1aa',5:'#c79a3f',6:'#6a6a70',7:'#c7a24a',8:'#2f2f36',9:'#9a6a3a',10:'#5a6a86',11:'#d0483a'};
var CFG=[
  {label:'CORNER PLAZA — gas pad + back alley + 2 cuts/street', opts:{streets:['S','E']}},
  {label:'ONE STREET — single frontage', opts:{streets:['S']}}
];
function build(){var root=document.getElementById('root');
  CFG.forEach(function(cf){
    var card=document.createElement('div');card.style.cssText='margin:0 10px 16px;border-radius:10px;padding:10px;background:#181a12';
    var h=document.createElement('div');h.style.cssText='font:600 14px sans-serif;color:#cdbd8a';h.textContent=cf.label;
    var res=C.generate(7,cf.opts),g=res.g,W=res.W,H=res.H;
    var cv=document.createElement('canvas');cv.width=460;cv.height=460;cv.style.cssText='width:100%;border-radius:6px;background:#000;display:block;margin-top:6px';
    var ctx=cv.getContext('2d'),PX=460/W;ctx.fillStyle='#12140f';ctx.fillRect(0,0,460,460);
    for(var y=0;y<H;y++)for(var x=0;x<W;x++){var c=g[y][x];ctx.fillStyle=(c===0?gcol(x,y):COL[c]);ctx.fillRect(x*PX,y*PX,PX+0.5,PX+0.5);}
    card.appendChild(h);card.appendChild(cv);
    var cnt=document.createElement('div');cnt.style.cssText='font:11px sans-serif;color:#8f8770;margin-top:4px';
    cnt.textContent=res.stores.length+' store blocks  ·  cuts: '+res.gates.map(function(t){return t.edge;}).join(',')+(res.gas?'  ·  gas pad in the corner':'')+'  ·  dark strip behind stores = service alley + back doors; blue = gas canopy, red = pumps';
    card.appendChild(cnt);root.appendChild(card);
  });
  window.__PROOF_READY=true;}
build();
"""

HTML = """<h1 style="font:600 15px/1.35 -apple-system,sans-serif;color:#cdbd8a;margin:8px 10px">BOHEMIA — FIRST COMMERCIAL DISTRICT: the corner shopping plaza (still proof, not walkable). The L-shaped store building backs the far property lines; the PARKING LOT fronts the streets with striped stalls and drive aisles; curb cuts (gold) connect the lot back to the main streets; storefront doors face the parking. Street-aware like the suburb — a corner exits both streets. Dead world: landscaping is dead dirt, not green.</h1>
<div id="root"></div>
<script>__GEN__
__UI__</script>
"""
HTML = HTML.replace('__GEN__', GEN).replace('__UI__', UI)
open(OUT, 'w', encoding='utf8').write(HTML)
print('commercial proof -> %s (%d KB)' % (OUT, len(HTML) // 1024))
