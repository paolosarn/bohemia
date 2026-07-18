#!/usr/bin/env python3
"""
BOHEMIA SUBURB — MODULAR PROOF (7/18/26, still image, NOT walkable).

Paolo 7/18: houses must be modular (not clones) AND the neighborhood must be modular
(gates only on streets it touches; a corner exits two streets; neighbor cells merge
into a connected 2x1 / 2x2). This is a top-down PROOF of all of that in one glance —
a still image, no walking (Paolo: don't spend tokens on walkables unless near done).

  python3 tools/bohemia_suburb_modular_proof.py -> slices/BOHEMIA_SUBURB_MODULAR_PROOF.html
"""
import os
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
OUT = 'slices/BOHEMIA_SUBURB_MODULAR_PROOF.html'
GEN = open('engine/bohemia_suburb.js', encoding='utf8').read()

UI = r"""
var G = BohemiaSuburb;
// dead-world palette; code 9 = two-story upper floor (lighter, reads taller)
function gcol(x,y){var h=((x*73856093)^(y*19349663))>>>0,v=h%3;return ['#463f30','#3d382a','#4e4838'][v];}
var COL={1:'#3a3a44',2:'#9c8e76',3:'#5a5a62',4:'#6a5c44',5:'#c79a3f',6:'#6d5f4b',9:'#b3a488'};
var CONFIGS=[
  {label:'ONE GRID — one street (gate on that street)', opts:{cw:1,ch:1,streets:['S']}},
  {label:'CORNER — touches two streets (exits both)', opts:{cw:1,ch:1,streets:['S','E']}},
  {label:'TWO-BY-ONE — merged, two gates on the main street', opts:{cw:2,ch:1,streets:['S']}},
  {label:'TWO-BY-TWO — merged block, two streets', opts:{cw:2,ch:2,streets:['S','E']}}
];
function render(cv,opts){var res=G.generate(7,opts),g=res.g,W=res.W,H=res.H,ctx=cv.getContext('2d');
  var PX=Math.min(cv.width/W,cv.height/H);
  ctx.fillStyle='#12140f';ctx.fillRect(0,0,cv.width,cv.height);
  var ox=(cv.width-W*PX)/2,oy=(cv.height-H*PX)/2;
  for(var y=0;y<H;y++)for(var x=0;x<W;x++){var c=g[y][x];ctx.fillStyle=(c===0?gcol(x,y):(COL[c]||'#463f30'));ctx.fillRect(ox+x*PX,oy+y*PX,PX+0.5,PX+0.5);}
  return res;}
function build(){var root=document.getElementById('root');
  CONFIGS.forEach(function(cf){
    var card=document.createElement('div');card.style.cssText='margin:0 10px 16px;border-radius:10px;padding:10px;background:#181a12';
    var h=document.createElement('div');h.style.cssText='font:600 14px sans-serif;color:#cdbd8a';h.textContent=cf.label;
    var cv=document.createElement('canvas');
    var res0=G.generate(7,cf.opts);var ar=res0.W/res0.H;
    cv.width=460;cv.height=Math.round(460/ar);cv.style.cssText='width:100%;border-radius:6px;background:#000;display:block;margin-top:6px';
    card.appendChild(h);card.appendChild(cv);
    var res=render(cv,cf.opts);
    var cnt=document.createElement('div');cnt.style.cssText='font:11px sans-serif;color:#8f8770;margin-top:4px';
    cnt.textContent=res.houses+' homes  ·  gates: '+res.gates.map(function(t){return t.edge;}).join('+')+'  ·  gold = gate to the street, lighter roofs = two-story';
    card.appendChild(cnt);root.appendChild(card);
  });
  window.__PROOF_READY=true;}
build();
"""

HTML = """<h1 style="font:600 15px/1.35 -apple-system,sans-serif;color:#cdbd8a;margin:8px 10px">BOHEMIA — SUBURB, MODULAR (still proof, not walkable). The houses vary now (different widths, garage on either corner, one- and two-story — lighter roofs). And the BLOCK is street-aware: gates (gold) sit only on the edges that touch a street. A one-grid on one street gets one gate; a CORNER exits two streets; neighbor cells MERGE into a connected two-by-one (two gates on the main street) or two-by-two — one wall, one road network, organically joined.</h1>
<div id="root"></div>
<script>__GEN__
__UI__</script>
"""
HTML = HTML.replace('__GEN__', GEN).replace('__UI__', UI)
open(OUT, 'w', encoding='utf8').write(HTML)
print('modular proof -> %s (%d KB)' % (OUT, len(HTML) // 1024))
