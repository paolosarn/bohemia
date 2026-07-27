#!/usr/bin/env python3
"""
BOHEMIA — THE PIXEL CRAFT JUDGE (7/27/26)

Paolo: "bro i need an interactive or something wdym". Right. A PNG and a wall of
numbers is not how he judges anything and never has been - the verdict workflow
in CLAUDE.md is explicit: interactive HTML, tap thumbs, per-item comments, a
comment box at the bottom always, SUN MODE, an export button, exports .txt never
.json. I handed him a static picture and a paragraph. That is on me.

So this builds the real thing. Every tile in the frozen act-1 set, big, beside a
live map of its orphan pixels, with its numbers under it, sorted worst first. He
taps. At the top, the ONE ruling that everything else waits on, as three big
buttons instead of a question buried in text.

WHAT IS BEING JUDGED HERE IS NOT THE ART. The art already has a verdict - he said
CBB on 7/26 and that stands. What is on this page is a DIAGNOSIS, and the thing
he is ruling on is whether I am allowed to re-cook against his own frozen
verdict. That distinction is printed on the page itself so it cannot be mistaken
for me sneaking a re-judge of art he already ruled on.

REUSE CHECK: cooks no new graphic pixels and opens no bank to draw from. It reads
banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt (byte-locked, READ ONLY) and
records/target/BOHEMIA_PIXEL_CRAFT_AUDIT.json, and emits an HTML page. The orphan
maps are drawn by the page itself, in the browser, from the tile's own pixels.

TASTE CHECK: a judging surface is not world art and the look rules do not apply
to its chrome. The tiles shown on it are shown UNTOUCHED, at integer NEAREST
zoom, which is the one taste rule that does bind here: never show him art through
a filter that flatters or damages it.

  python3 tools/bohemia_pixel_craft_judge.py
    -> slices/BOHEMIA_PIXEL_CRAFT_JUDGE_7_27_26.html
"""
import json
import os

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

BANK = 'banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt'
AUDIT = 'records/target/BOHEMIA_PIXEL_CRAFT_AUDIT.json'
OUT = 'slices/BOHEMIA_PIXEL_CRAFT_JUDGE_7_27_26.html'
RECOOK = 'records/target/RECOOK_road_0_PHONE.png'

PAGE = """<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>BOHEMIA — PIXEL CRAFT JUDGE</title><style>
:root{--bg:#131311;--fg:#e9dcb6;--dim:#9a917a;--card:#1d1c18;--line:#33312a;--bad:#ff5a4d;--good:#7fd48a}
body.sun{--bg:#f4f0e4;--fg:#1a1a16;--dim:#5d5748;--card:#fffdf5;--line:#cdc6b2}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 ui-monospace,Menlo,monospace;
 padding:env(safe-area-inset-top) 0 90px}
header{padding:16px 14px 10px;border-bottom:1px solid var(--line)}
h1{font-size:17px;margin:0 0 6px;letter-spacing:1px}
p{margin:6px 0;color:var(--dim);font-size:13px}
.big{color:var(--bad);font-size:15px}
.bar{position:sticky;top:0;z-index:9;background:var(--bg);border-bottom:1px solid var(--line);
 padding:8px 14px;display:flex;gap:8px;flex-wrap:wrap}
button{font:600 13px ui-monospace,monospace;background:var(--card);color:var(--fg);
 border:1px solid var(--line);border-radius:8px;padding:9px 12px}
.ask{margin:14px;padding:14px;border:2px solid var(--bad);border-radius:12px;background:var(--card)}
.ask h2{font-size:15px;margin:0 0 4px;color:var(--bad)}
.ask .opt{display:block;width:100%;text-align:left;margin-top:8px;padding:14px}
.ask .opt.on{outline:3px solid var(--good)}
.ask img{width:100%;border-radius:8px;border:1px solid var(--line);margin:8px 0;image-rendering:pixelated}
.grid{display:grid;grid-template-columns:1fr;gap:12px;padding:12px}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px}
/* THE CANVASES GO SIDE BY SIDE AND THE NUMBERS GO UNDERNEATH. First cut put all
   three in one row and the numbers ran off the right edge of a 390px phone -
   which is the only screen that matters, and exactly the class of thing the
   VERIFY-ON-THE-REAL-SURFACE law exists to catch. Caught it in a real browser at
   real phone width before he ever saw it. */
.row{display:flex;gap:10px;align-items:flex-start}
.row canvas{image-rendering:pixelated;border:1px solid var(--line);border-radius:6px;
 width:calc(50% - 5px);height:auto;aspect-ratio:1}
.meta{margin-top:8px}
.capt{display:flex;gap:10px;font-size:11px;color:var(--dim);margin-top:4px}
.capt span{width:calc(50% - 5px)}
.id{font-weight:700;letter-spacing:1px}
.what{color:var(--dim);font-size:12px;margin:3px 0 6px}
.num{font-size:12px}
.num b{color:var(--bad)}
.thumbs{display:flex;gap:8px;margin-top:8px}
.thumbs button.on{outline:3px solid var(--good)}
textarea{width:100%;margin-top:8px;background:transparent;color:var(--fg);
 border:1px solid var(--line);border-radius:8px;padding:8px;font:13px ui-monospace,monospace}
footer{padding:14px}
.legend{display:flex;gap:14px;font-size:12px;color:var(--dim);margin-top:6px}
.sw{display:inline-block;width:11px;height:11px;border-radius:2px;vertical-align:-1px;margin-right:4px}
</style></head><body>
<header>
<h1>WHY IT LOOKS LIKE SLOP — AND IT IS MEASURABLE</h1>
<p class="big">Our tiles are 74% ORPHAN PIXELS. An orphan is a pixel touching no pixel of
its own colour. The craft calls them "responsible for the image looking noisy and confusing."</p>
<p>LEFT = the tile as it ships. RIGHT = the same tile with every orphan pixel in red.
Real pixel art is nearly all dark on the right. Ours is nearly solid red.</p>
<p><b>THIS IS NOT A RE-JUDGE OF THE ART.</b> You already ruled CBB on 7/26 and that stands.
The only thing being asked is whether I may re-cook against your own frozen verdict.</p>
<div class="legend"><span><span class="sw" style="background:#ff5a4d"></span>orphan pixel</span>
<span><span class="sw" style="background:#2a2a2a"></span>pixel in a real cluster</span></div>
</header>
<div class="bar">
<button id="sun">SUN MODE</button>
<button id="exp">EXPORT .txt</button>
<button id="sort">SORT: WORST FIRST</button>
</div>
<div class="ask">
<h2>YOU SAID SHOW ME ONE. HERE IS ONE.</h2>
<p><b>road_0, cracked asphalt</b> — the most repeated surface in the valley, and the worst
one we own. Rebuilt properly. <b>1191 colours &rarr; 6. 99% bad pixels &rarr; 0.</b></p>
<p>The big pair is 16 copies laid down, which is the only honest way to look at ground —
you never see one tile on its own.</p>
<img src="data:image/png;base64,__RECOOK__" alt="road_0 before and after">
<p>Every colour came out of your own approved tile. The one thing I changed and am not
hiding: I pulled the six apart from each other, because straight out of your tile they
came back as six near-identical browns, and a ramp with no steps in it draws a flat tile
however well it is built. That is why it reads warmer.</p>
<button class="opt" data-ask="GO">RIGHT DIRECTION — do the other 41</button>
<button class="opt" data-ask="TOOWARM">RIGHT BUILD, TOO WARM — same thing, pull the colour back</button>
<button class="opt" data-ask="NO">NO — leave the tiles alone</button>
</div>
<div class="grid" id="grid"></div>
<footer>
<div class="card"><b>ANYTHING ELSE</b>
<textarea id="all" rows="5" placeholder="whatever you want to say about any of it"></textarea></div>
</footer>
<script>
const TILES = __TILES__;
const V = {ask:null, tiles:{}, notes:{}, all:''};
const grid = document.getElementById('grid');

function orphanCanvas(img, cv){
  const w=img.width,h=img.height,o=document.createElement('canvas');
  o.width=w;o.height=h;const oc=o.getContext('2d');oc.imageSmoothingEnabled=false;
  oc.drawImage(img,0,0);
  const d=oc.getImageData(0,0,w,h), p=d.data;
  const out=oc.createImageData(w,h), q=out.data;
  const at=(x,y)=>((y*w+x)*4);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const i=at(x,y);
    if(p[i+3]<=8){q[i+3]=0;continue;}
    let alone=true;
    for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){
      const nx=x+dx,ny=y+dy; if(nx<0||ny<0||nx>=w||ny>=h)continue;
      const j=at(nx,ny);
      if(p[j+3]>8&&p[j]===p[i]&&p[j+1]===p[i+1]&&p[j+2]===p[i+2]){alone=false;break;}
    }
    if(alone){q[i]=255;q[i+1]=90;q[i+2]=77;q[i+3]=255;}
    else {q[i]=42;q[i+1]=42;q[i+2]=42;q[i+3]=255;}
  }
  cv.width=w;cv.height=h;
  const c=cv.getContext('2d');c.imageSmoothingEnabled=false;c.putImageData(out,0,0);
}

function render(list){
  grid.innerHTML='';
  list.forEach(t=>{
    const card=document.createElement('div');card.className='card';
    card.innerHTML=`<div class="row">
      <canvas class="a"></canvas><canvas class="b"></canvas></div>
      <div class="capt"><span>the tile</span><span>its orphan pixels</span></div>
      <div class="meta"><div class="id">${t.id}</div>
      <div class="what">${t.what||''}</div>
      <div class="num"><b>${Math.round(t.orphan*100)}%</b> orphan pixels &nbsp;·&nbsp;
      <b>${t.colours}</b> colours in ${t.px} pixels &nbsp;·&nbsp;
      <b>${t.clusters}</b> colour regions per 1000px</div></div>
      <div class="thumbs">
        <button data-v="UP">GOOD</button>
        <button data-v="DOWN">BAD</button>
        <button data-v="RECOOK">RECOOK THIS ONE</button>
      </div>
      <textarea rows="2" placeholder="note on ${t.id}"></textarea>`;
    grid.appendChild(card);
    const [ca,cb]=card.querySelectorAll('canvas');
    const img=new Image();
    img.onload=()=>{
      ca.width=img.width;ca.height=img.height;
      const c=ca.getContext('2d');c.imageSmoothingEnabled=false;c.drawImage(img,0,0);
      orphanCanvas(img,cb);
    };
    img.src='data:image/png;base64,'+t.b64;
    card.querySelectorAll('.thumbs button').forEach(b=>b.onclick=()=>{
      card.querySelectorAll('.thumbs button').forEach(x=>x.classList.remove('on'));
      b.classList.add('on'); V.tiles[t.id]=b.dataset.v;});
    card.querySelector('textarea').oninput=e=>{V.notes[t.id]=e.target.value;};
  });
}

let worstFirst=true;
function sorted(){
  const l=TILES.slice();
  l.sort((a,b)=>worstFirst?b.orphan-a.orphan:a.orphan-b.orphan);
  return l;
}
render(sorted());
document.getElementById('sort').onclick=e=>{
  worstFirst=!worstFirst;
  e.target.textContent='SORT: '+(worstFirst?'WORST FIRST':'BEST FIRST');
  render(sorted());
};
document.getElementById('sun').onclick=()=>document.body.classList.toggle('sun');
document.querySelectorAll('.ask .opt').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('.ask .opt').forEach(x=>x.classList.remove('on'));
  b.classList.add('on');V.ask=b.dataset.ask;});
document.getElementById('all').oninput=e=>{V.all=e.target.value;};

document.getElementById('exp').onclick=()=>{
  let s='BOHEMIA — PIXEL CRAFT VERDICT\\n';
  s+='date: '+new Date().toISOString().slice(0,10)+'\\n';
  s+='page: BOHEMIA_PIXEL_CRAFT_JUDGE_7_27_26.html\\n\\n';
  s+='THE RULING (road_0 recook — direction / too warm / no): '+(V.ask||'NOT ANSWERED')+'\\n\\n';
  s+='PER TILE\\n';
  TILES.forEach(t=>{
    const v=V.tiles[t.id], n=V.notes[t.id];
    if(v||n) s+='  '+t.id+'  '+(v||'-')+(n?'  // '+n:'')+'\\n';
  });
  s+='\\nNOTES\\n'+(V.all||'(none)')+'\\n';
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([s],{type:'text/plain'}));
  a.download='BOHEMIA_PIXEL_CRAFT_VERDICT.txt';a.click();
};
</script></body></html>
"""


def main():
    bank = json.load(open(BANK))
    rows = {r['id']: r for r in json.load(open(AUDIT))['banks'][0]['rows']}
    by_id = {t['id']: t for t in bank['tiles']}
    tiles = []
    for tid, r in rows.items():
        t = by_id[tid]
        tiles.append({
            'id': tid, 'what': t.get('what', ''), 'b64': t['b64'],
            'orphan': r['orphan_share'], 'colours': r['colours'],
            'clusters': round(r['clusters_per_1000px']),
            'px': r['size'][0] * r['size'][1],
        })
    # THE ANSWER TO "SHOW ME ONE" LIVES ON THE PAGE HE ALREADY HAS, not on a new
    # surface. A second judging page for the same question is how a fleet ends up
    # asking him the same thing twice.
    import base64 as _b64
    recook = _b64.b64encode(open(RECOOK, 'rb').read()).decode()
    html = PAGE.replace('__TILES__', json.dumps(tiles)).replace('__RECOOK__', recook)
    with open(OUT, 'w') as f:
        f.write(html)
    print('OK -> %s  (%d tiles, %.1f KB)'
          % (OUT, len(tiles), os.path.getsize(OUT) / 1024.0))


if __name__ == '__main__':
    main()
