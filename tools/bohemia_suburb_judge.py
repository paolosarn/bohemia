#!/usr/bin/env python3
"""
BOHEMIA SUBURB — JUDGING TOOL (7/18/26, v4: WALLED-BLOCK MODEL, 1x1)

Paolo's corrections, folded in:
- Homes BACK ONTO the perimeter wall (backyards to the wall, fronts facing the
  interior street). The streets run inside; homes fill the band to the wall.
- The DRIVEWAY is a car apron (3 tiles long, 4 wide for 2 cars), NOT a runway.
  The garage is the front corner of the house; the house is the bulk.
- Start with ONE grid (1x1). Remade a couple designs on the corrected model.

The generator is engine/bohemia_suburb.js (candidate; the judge embeds it and the
gate tests it). Verdict workflow: SUN MODE, thumbs, comments, export .txt.

  python3 tools/bohemia_suburb_judge.py -> slices/BOHEMIA_SUBURB_JUDGE_7_18_26.html
"""
import os
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
OUT = 'slices/BOHEMIA_SUBURB_JUDGE_7_18_26.html'
GEN = open(os.path.join(REPO, 'engine/bohemia_suburb.js'), encoding='utf8').read()

UI = r"""
var G = BohemiaSuburb;
var STYLES=[
  {id:'ring',name:'THE BLOCK — canonical suburb (APPROVED)',blurb:'houses-first walled block, homes both sides of every street, every home a 3-tile DEAD backyard to the wall. no grass, no pools, no trees. APPROVED 7/18 and now walkable in the alpha (WALK CAMPANA).'}
];
var SUN=false, seedBase=7, verdict={}, comments={};
// DEAD WORLD palette: dead dirt ground (textured so it reads as real dead earth,
// NOT an empty black hole), asphalt, stucco house, concrete driveway. No green,
// no pool-blue. Everything is dead but the ground is still GROUND.
function col(code){
  if(SUN)return ['#c6bb9c','#8b8b93','#c2b184','#cfccd2','#b8a878','#c7a24a','#8a7454','#c6bb9c','#c6bb9c','#d6cbac'][code];
  return ['#463f30','#3a3a44','#9c8e76','#5a5a62','#6a5c44','#c79a3f','#6d5f4b','#463f30','#463f30','#b3a488'][code];
}
// dead-ground texture: three close dead-dirt shades keyed to the tile, so backyards
// and yards read as cracked dead earth instead of void.
function gcol(x,y){var h=((x*73856093)^(y*19349663))>>>0,v=h%3;
  return SUN?['#c6bb9c','#bdb191','#cdc3a6'][v]:['#463f30','#3d382a','#4e4838'][v];}
function render(cv,style,seed){var res=G.generate(seed,style,1,1),g=res.g,W=res.W,H=res.H,ctx=cv.getContext('2d');
  var PX=Math.min(cv.width/W,cv.height/H);
  ctx.fillStyle=SUN?'#b7ac8c':'#2c281e';ctx.fillRect(0,0,cv.width,cv.height);
  var ox=(cv.width-W*PX)/2,oy=(cv.height-H*PX)/2;
  for(var y=0;y<H;y++)for(var x=0;x<W;x++){var c=g[y][x];ctx.fillStyle=(c===0?gcol(x,y):col(c));ctx.fillRect(ox+x*PX,oy+y*PX,PX+0.5,PX+0.5);}
  return res;}
function build(){var root=document.getElementById('root');document.body.style.background=SUN?'#efe7cf':'#0d0f0a';root.innerHTML='';
  STYLES.forEach(function(st){
    var card=document.createElement('div');card.style.cssText='margin:0 10px 20px;border-radius:10px;padding:10px;background:'+(SUN?'#e4dbc0':'#181a12');
    var h=document.createElement('div');h.style.cssText='font:600 15px sans-serif;color:'+(SUN?'#3a3320':'#cdbd8a');h.textContent=st.name;
    var b=document.createElement('div');b.style.cssText='font:12px sans-serif;color:'+(SUN?'#6a6045':'#8f8770')+';margin:2px 0 8px';b.textContent=st.blurb;
    var cv=document.createElement('canvas');cv.width=460;cv.height=460;cv.style.cssText='width:100%;border-radius:6px;background:#000;display:block';
    card.appendChild(h);card.appendChild(b);card.appendChild(cv);
    var res=render(cv,st.id,seedBase);
    var cnt=document.createElement('div');cnt.style.cssText='font:11px sans-serif;color:'+(SUN?'#6a6045':'#7f7a68')+';margin-top:4px';cnt.textContent=res.houses+' homes  (a 96 m block)';
    card.appendChild(cnt);
    var vr=document.createElement('div');vr.style.cssText='display:flex;gap:10px;align-items:center;margin-top:10px';
    var up=document.createElement('button');up.textContent='👍';var dn=document.createElement('button');dn.textContent='👎';
    [up,dn].forEach(function(btn){btn.style.cssText='font-size:22px;width:56px;height:44px;border-radius:8px;border:2px solid #888;background:#0000';});
    function paint(){up.style.background=verdict[st.id]==='up'?'#3f8c3f':'#0000';dn.style.background=verdict[st.id]==='down'?'#b0453f':'#0000';}
    up.onclick=function(){verdict[st.id]='up';paint();};dn.onclick=function(){verdict[st.id]='down';paint();};paint();
    var cm=document.createElement('input');cm.placeholder='comment on '+st.name+'...';cm.value=comments[st.id]||'';
    cm.style.cssText='flex:1;padding:8px;border-radius:8px;border:1px solid #888;background:'+(SUN?'#fff':'#111')+';color:'+(SUN?'#222':'#ddd');
    cm.oninput=function(){comments[st.id]=cm.value;};
    vr.appendChild(up);vr.appendChild(dn);vr.appendChild(cm);card.appendChild(vr);root.appendChild(card);
  });}
function exportTxt(){var l=['=== BOHEMIA SUBURB VERDICT (walled-block model) ==='];
  STYLES.forEach(function(st){l.push(st.name+': '+((verdict[st.id]||'--').toUpperCase()));});
  l.push('--- PER-STYLE COMMENTS ---');STYLES.forEach(function(st){if(comments[st.id])l.push(st.name+': '+comments[st.id]);});
  l.push('--- PAOLO COMMENTS ---');l.push(document.getElementById('global').value||'(none)');
  var b=new Blob([l.join('\n')],{type:'text/plain'});var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='BOHEMIA_SUBURB_VERDICT.txt';a.click();}
document.getElementById('sun').onclick=function(){SUN=!SUN;build();};
document.getElementById('reseed').onclick=function(){seedBase=(seedBase*7+13)%9000+1;build();};
document.getElementById('exp').onclick=exportTxt;
build();window.__SUBURB_READY=true;
"""

HTML = """<h1 style="font:600 15px/1.35 -apple-system,sans-serif;color:#cdbd8a;margin:8px 10px">BOHEMIA — SUBURB, packed. Both fill the WHOLE block (houses first). Campana has a central cul-de-sac court; the block is the tight grid. The ground between houses is DEAD DIRT (act 1, no water for landscaping — no grass/trees/pools), textured so you can see it's dead earth, not empty. Every home keeps its 3-tile dead backyard to the wall. Reseed for variety. Thumb each, comment, export.</h1>
<div style="display:flex;gap:8px;padding:0 10px 8px;flex-wrap:wrap">
  <button id="sun" style="padding:8px 12px;border-radius:8px">☀ SUN MODE</button>
  <button id="reseed" style="padding:8px 12px;border-radius:8px">⟳ RESEED</button>
  <button id="exp" style="padding:8px 12px;border-radius:8px;background:#3f8c3f;color:#fff;border:0">⤓ EXPORT .txt</button>
</div>
<div id="root"></div>
<div style="padding:10px">
  <div style="font:12px sans-serif;color:#8f8770;margin-bottom:4px">PAOLO COMMENTS (rides the export):</div>
  <textarea id="global" style="width:100%;height:70px;border-radius:8px;padding:8px;background:#111;color:#ddd;border:1px solid #888" placeholder="anything about the neighborhoods..."></textarea>
</div>
<script>
__GEN__
__UI__
</script>
"""
HTML = HTML.replace('__GEN__', GEN).replace('__UI__', UI)
open(OUT, 'w', encoding='utf8').write(HTML)
print('suburb judge (walled-block) -> %s (%d KB)' % (OUT, len(HTML) // 1024))
