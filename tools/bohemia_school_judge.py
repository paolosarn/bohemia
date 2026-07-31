#!/usr/bin/env python3
"""BOHEMIA — JUDGE THE HIGH SCHOOL (7/28/26, WORLD lane)

Paolo asked "where can i judge it" and the honest answer was NOWHERE: the bulk
district judge is gone from main, and no surviving page shows a WALKABLE DISTRICT
PLOT at all -- only icons. So the thing he was asked to judge could not be judged.

This is the smallest page that fixes that: ONE district, the plot beside its city
icon, thumbs, a comment box, and a .txt export. Deliberately NOT another 45-row
bulk pile -- he judged 45 at once on 7/27 and the result was "it was mostly all
bad"; a single focused verdict is what a test case deserves.

REUSE CHECK: this cooks NO graphic pixels. Both images are rendered from things
that already exist -- the plot straight out of engine/bohemia_school.js's own
generate() + palette (the canonical body, ENGINE SYNC LAW), and the icon straight
out of banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt. Nothing is drawn here.

  python3 tools/bohemia_school_judge.py
"""
import base64, io, json, os, subprocess, sys
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
from PIL import Image

OUT = 'slices/BOHEMIA_SCHOOL_JUDGE_7_28_26.html'
SCALE = 4

# --- the PLOT, straight from the engine module (canonical body, no re-authoring)
js = """
const S=require('./engine/bohemia_school.js');
const K=require('./engine/bohemia_district_kit.js');
const r=S.generate(31,{streets:['S']});
process.stdout.write(JSON.stringify({g:r.g,pal:S.palette,
  edges:Object.keys(K.buildingEdges(r.g,S.legend))}));
"""
raw = subprocess.run(['node', '-e', js], capture_output=True, text=True, check=True).stdout
d = json.loads(raw)
g, pal = d['g'], d['pal']
# THE EAVE PASS, the same one the real map paints (engine/bohemia_valleymap.js) via the
# same K.buildingEdges answer. Paolo judges what the game draws, not a second renderer's
# opinion of it -- a side-door probe is a lie (VERIFY ON THE REAL SURFACE, 7/18).
edges = set(d['edges'])


def _lighten(hx, f=0.28):
    v = [int(hx[i:i + 2], 16) for i in (1, 3, 5)]
    return tuple(round(n + (255 - n) * f) for n in v)


N = len(g)
im = Image.new('RGB', (N * SCALE, N * SCALE))
px = im.load()
for y in range(N):
    for x in range(N):
        v = str(g[y][x])
        hx = '#463f30' if v == '0' else pal.get(v, '#ff00ff')
        c = _lighten(hx) if ('%d,%d' % (x, y)) in edges else (
            int(hx[1:3], 16), int(hx[3:5], 16), int(hx[5:7], 16))
        for dy in range(SCALE):
            for dx in range(SCALE):
                px[x * SCALE + dx, y * SCALE + dy] = c
b = io.BytesIO(); im.save(b, 'PNG')
plot_b64 = base64.b64encode(b.getvalue()).decode('ascii')

# --- the ICON, straight from the approved-format hero bank
bank = json.load(open('banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt'))
hero = [h for h in bank['heroes'] if h['district'] == 'school'][0]

HTML = """<!doctype html><meta charset=utf8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>JUDGE THE HIGH SCHOOL</title>
<style>
 :root{--bg:#0d0d12;--ink:#e8e3d4;--dim:#8d8676;--gold:#c79a3f}
 body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 ui-monospace,monospace}
 /* SUN MODE must recolour the CONTROLS too. The first pass only swapped the page
    background and left the buttons and the comment box dark, so in daylight the
    button text was dark-on-dark and unreadable -- on the one surface whose entire
    job is to be readable in the sun. */
 body.sun{--bg:#efe9d8;--ink:#22201a;--dim:#5f594a}
 body.sun button{background:#dcd4bd;border-color:#a89f86;color:#22201a}
 body.sun button.up.on{border-color:#3e7a2e;background:#cfe0be}
 body.sun button.dn.on{border-color:#9a3b3b;background:#e8c9c9}
 body.sun textarea{background:#f6f1e2;border-color:#a89f86;color:#22201a}
 body.sun header{border-bottom-color:#c3bba4}
 body.sun img{border-color:#a89f86}
 header{padding:16px;border-bottom:1px solid #333}
 h1{margin:0 0 4px;font-size:19px;letter-spacing:1px}
 .sub{color:var(--dim);font-size:13px}
 .wrap{padding:16px;max-width:900px;margin:0 auto}
 .pair{display:flex;flex-wrap:wrap;gap:14px;margin:10px 0 4px}
 .cell{flex:1 1 300px;min-width:280px}
 .cell h2{font-size:13px;letter-spacing:1px;color:var(--gold);margin:0 0 6px}
 img{width:100%;height:auto;image-rendering:pixelated;border:1px solid #444;background:#000}
 .note{color:var(--dim);font-size:12px;margin:6px 0 0}
 .thumbs{display:flex;gap:10px;margin:16px 0 6px}
 button{flex:1;padding:16px;font:600 16px ui-monospace,monospace;border:2px solid #444;
   background:#1a1a20;color:var(--ink);border-radius:10px;cursor:pointer}
 button.up.on{border-color:#6a5;background:#1d2a18}
 button.dn.on{border-color:#a55;background:#2a1818}
 textarea{width:100%;box-sizing:border-box;min-height:110px;background:#15151a;color:var(--ink);
   border:1px solid #444;border-radius:8px;padding:10px;font:14px ui-monospace,monospace}
 .bar{display:flex;gap:10px;margin:12px 0 40px}
 .bar button{flex:1;font-size:14px;padding:13px}
 ul{color:var(--dim);font-size:13px;padding-left:18px}
</style>
<header>
 <h1>JUDGE THE HIGH SCHOOL</h1>
 <div class=sub>You ruled &ldquo;High school&rdquo; &mdash; this is what that built. One district, one verdict.</div>
</header>
<div class=wrap>
 <div class=pair>
  <div class=cell><h2>THE PLOT YOU WALK</h2><img src="data:image/png;base64,__PLOT__" alt="school plot"></div>
  <div class=cell><h2>THE CITY ICON</h2><img src="data:image/png;base64,__ICON__" alt="school icon"></div>
 </div>
 <div class=note>Same place, two zooms. They are supposed to read as the same district.</div>
 <ul>
  <li>The landmark is the STADIUM &mdash; track, field, bleachers, four light towers.</li>
  <li>The student lot with the cars still in it is what makes it a HIGH school.</li>
  <li>The playground is gone. It was an elementary-school object.</li>
  <li>Colour went from 3 families to 9. Pocket City 2 runs 12.</li>
 </ul>
 <div class=thumbs>
  <button class="up" id=up>&#128077; UP</button>
  <button class="dn" id=dn>&#128078; DOWN</button>
 </div>
 <textarea id=cmt placeholder="What is wrong with it / what to change. Anything you type here is a ruling."></textarea>
 <div class=bar>
  <button id=sun>SUN MODE</button>
  <button id=exp>EXPORT .txt</button>
 </div>
</div>
<script>
var V=null;
function paint(){document.getElementById('up').className='up'+(V==='UP'?' on':'');
 document.getElementById('dn').className='dn'+(V==='DOWN'?' on':'');}
document.getElementById('up').onclick=function(){V=(V==='UP'?null:'UP');paint();};
document.getElementById('dn').onclick=function(){V=(V==='DOWN'?null:'DOWN');paint();};
document.getElementById('sun').onclick=function(){document.body.classList.toggle('sun');};
document.getElementById('exp').onclick=function(){
 var t="BOHEMIA VERDICT - HIGH SCHOOL (district + city icon)\\n"
  +"verdict: "+(V||"(not thumbed)")+"\\n"
  +"comment: "+(document.getElementById('cmt').value||"(none)")+"\\n";
 var a=document.createElement('a');
 a.href=URL.createObjectURL(new Blob([t],{type:'text/plain'}));
 a.download='BOHEMIA_VERDICT_SCHOOL.txt';a.click();};
paint();
</script>
"""
open(OUT, 'w', encoding='utf8').write(
    HTML.replace('__PLOT__', plot_b64).replace('__ICON__', hero['b64']))
print('school judge -> %s (%d KB)' % (OUT, os.path.getsize(OUT) // 1024))
