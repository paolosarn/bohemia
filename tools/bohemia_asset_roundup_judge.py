#!/usr/bin/env python3
"""
BOHEMIA UNJUDGED ASSET ROUNDUP (7/21/26) - Paolo: "present me in the slice
any assets i didnt approve yet so we can add them. use these assets as much
as you can before u create your own." (laws/BOHEMIA_ADDENDUM_ACT_ASSET_TIERS
_7_21_26: the reuse-first law.)

Scope for this round: the pools directly relevant to the suburb house work
in flight, that already carry ready b64 art (no repo-crop resolution
needed) - WALL_CANDIDATES_POOL (47, explicitly "awaiting other wall
classes" per the batch-2 verdict - HOUSE is exactly an other wall class),
DOOR_EW_BANK (184 doors x W/E edges), ROOF_KIT_EXPANSION (36, "act-1-
approved roof-family... for HOUSE FACTORY v2"). NOT included this round:
WALL_SEAMLESS_SET/WINDOW_SET/ROOF_SEAMLESS_SET - these need resolving crops
out of the 4x45MB HD_TILE_REPO parts, and a resolver test showed they're a
MIXED-GENRE raw corpus (sci-fi/fantasy dungeon packs), a bigger sweep of
its own. Flagged for a next round, [PENDING Paolo: does he want that swept
too].

PURITY LAW pre-filter (mechanical, not taste): any candidate containing a
purple pixel (r>g+25 and b>g+25 - the Amalgamation's alone) is EXCLUDED
before it ever reaches the page. That is a hard law, not a judgment call.

Compact tap-to-cycle grid (not full composed-house cards - this is raw
material, not finished candidates): tap cycles NEUTRAL -> UP -> DOWN ->
NEUTRAL, per-section comment box, global comment box, export .txt.

  python3 tools/bohemia_asset_roundup_judge.py
    -> slices/BOHEMIA_ASSET_ROUNDUP_JUDGE_7_21_26.html
"""
import base64
import io
import json
import os

from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
OUT = 'slices/BOHEMIA_ASSET_ROUNDUP_JUDGE_7_21_26.html'


def has_purple(b64):
    im = Image.open(io.BytesIO(base64.b64decode(b64))).convert('RGB')
    for r, g, b in im.getdata():
        if r > g + 25 and b > g + 25:
            return True
    return False


wall_pool = json.load(open('banks/BOHEMIA_WALL_CANDIDATES_POOL_7_17_26.txt'))
roof_pool = json.load(open('banks/BOHEMIA_ROOF_KIT_EXPANSION_7_14_26.txt'))
door_pool = json.load(open('banks/BOHEMIA_DOOR_EW_BANK_7_10_26.txt'))

WALL = [{'id': 'wall_%s' % c['key'], 'label': c['key'], 'b64': c['b64']}
        for c in wall_pool['candidates'] if not has_purple(c['b64'])]
ROOF = [{'id': 'roof_%d' % i, 'label': '%s tier %s' % (t['pack'].split('.')[0], t.get('tier', '?')),
         'b64': t['b64']}
        for i, t in enumerate(roof_pool['tiles']) if not has_purple(t['b64'])]
DOOR = []
for i, d in enumerate(door_pool['doors']):
    w = next((v for v in d['variants'] if v['side'] == 'W'), None)
    if w and not has_purple(w['b64']):
        DOOR.append({'id': 'door_%d' % i, 'label': 'door %d' % i, 'b64': w['b64']})

print('purity filter: wall %d/%d kept, roof %d/%d kept, door %d/%d kept' % (
    len(WALL), len(wall_pool['candidates']), len(ROOF), len(roof_pool['tiles']),
    len(DOOR), len(door_pool['doors'])))

SECTIONS = [
    ('WALL CANDIDATES', 'wall', WALL,
     'banks/BOHEMIA_WALL_CANDIDATES_POOL_7_17_26 - RULED 7/21 ("its giving act 3, save these for when we judge act 3"): reserved for Act 3, not Act 1 house walls. Kept here for the record, not soliciting further thumbs.'),
    ('ROOF KIT', 'roof', ROOF,
     'banks/BOHEMIA_ROOF_KIT_EXPANSION_7_14_26 - act-1 roof-family tiles baked for the house factory, S/A/B seam-tier. Never judged.'),
    ('DOOR EDGES', 'door', DOOR,
     "banks/BOHEMIA_DOOR_EW_BANK_7_10_26 - west-edge crop of each candidate door (there's a matching east edge in the bank, not shown here to save space). Never judged."),
]

html = r"""<meta charset="utf-8">
<title>BOHEMIA ASSET ROUNDUP 7/21</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<h1 id="hdr" style="font:600 15px/1.4 -apple-system,sans-serif;color:#cdbd8a;margin:10px 10px 4px">BOHEMIA - UNJUDGED ASSET ROUNDUP. Everything below already exists in the corpus and has never been thumbed. Purple-contaminated tiles are already pulled (purity law, not taste). Tap a tile to cycle SKIP -> UP -> DOWN. This round covers wall/roof/door candidates for the house work; the bigger mixed-genre corpus (seamless wall/window/roof packs) is a separate sweep if you want it.</h1>
<div style="display:flex;gap:8px;padding:8px 10px;flex-wrap:wrap;position:sticky;top:0;z-index:5" id="bar">
  <button id="sun" style="padding:9px 13px;border-radius:8px;border:1px solid #887;background:#222;color:#ddd">&#9728; SUN MODE</button>
  <button id="exp" style="padding:9px 13px;border-radius:8px;background:#3f8c3f;color:#fff;border:0">&#10515; EXPORT .txt</button>
</div>
<div id="root"></div>
<div style="padding:10px 10px 30px">
  <div id="gcap" style="font:12px sans-serif;color:#8f8770;margin-bottom:4px">PAOLO COMMENTS (rides the export):</div>
  <textarea id="global" style="width:100%;height:80px;border-radius:8px;padding:8px;background:#111;color:#ddd;border:1px solid #888;box-sizing:border-box" placeholder="anything about the roundup overall..."></textarea>
</div>
<script>
const SECTIONS=__SECTIONS__;
let SUN=false; const verdict={};
const STATES=[null,'UP','DOWN'];

function build(){
  document.body.style.background=SUN?'#efe7cf':'#0d0f0a';
  document.getElementById('bar').style.background=SUN?'#efe7cf':'#0d0f0a';
  document.getElementById('hdr').style.color=SUN?'#3a3320':'#cdbd8a';
  document.getElementById('gcap').style.color=SUN?'#6a6045':'#8f8770';
  const root=document.getElementById('root'); root.innerHTML='';
  for(const [name,cls,items,blurb] of SECTIONS){
    const wrap=document.createElement('div'); wrap.style.margin='14px 0';
    const h=document.createElement('div');
    h.style.cssText='font:700 14px sans-serif;margin:0 10px 2px;color:'+(SUN?'#3a3320':'#cdbd8a')+';cursor:pointer';
    h.textContent='▸ '+name+'  ('+items.length+')'; wrap.appendChild(h);
    const b=document.createElement('div');
    b.style.cssText='font:12px sans-serif;margin:0 10px 8px;color:'+(SUN?'#6a6045':'#8f8770');
    b.textContent=blurb; wrap.appendChild(b);
    const grid=document.createElement('div');
    grid.style.cssText='display:none;flex-wrap:wrap;gap:6px;padding:0 10px';
    let opened=false;
    h.onclick=()=>{ opened=!opened; grid.style.display=opened?'flex':'none';
      h.textContent=(opened?'▾ ':'▸ ')+name+'  ('+items.length+')';
      if(opened && !grid.dataset.built){ grid.dataset.built='1'; renderGrid(grid,items); } };
    wrap.appendChild(grid);
    const cm=document.createElement('input'); cm.placeholder='section comment ('+name+')...';
    cm.style.cssText='display:block;width:calc(100% - 20px);margin:6px 10px 0;padding:8px;border-radius:8px;border:1px solid #888;background:'+(SUN?'#fff':'#111')+';color:'+(SUN?'#222':'#ddd')+';box-sizing:border-box';
    cm.oninput=()=>{ verdict['__section_'+cls]=cm.value; };
    wrap.appendChild(cm);
    root.appendChild(wrap);
  }
}
function renderGrid(grid,items){
  items.forEach(it=>{
    const box=document.createElement('div');
    box.style.cssText='width:60px;text-align:center';
    const cv=document.createElement('div');
    cv.style.cssText='width:56px;height:56px;border-radius:6px;border:3px solid #444;background-image:url(data:image/png;base64,'+it.b64+');background-size:cover;image-rendering:pixelated;cursor:pointer';
    const paint=()=>{ const v=verdict[it.id]; cv.style.borderColor=v==='UP'?'#2f7c2f':(v==='DOWN'?'#8c3030':'#444'); };
    cv.onclick=()=>{ const cur=STATES.indexOf(verdict[it.id]||null); verdict[it.id]=STATES[(cur+1)%STATES.length]; paint(); };
    paint();
    box.appendChild(cv);
    const lb=document.createElement('div'); lb.style.cssText='font:9px monospace;color:'+(SUN?'#6a6045':'#8f8770')+';overflow:hidden;text-overflow:ellipsis;white-space:nowrap';
    lb.textContent=it.label; box.appendChild(lb);
    grid.appendChild(box);
  });
}

function exportTxt(){
  const l=['=== BOHEMIA ASSET ROUNDUP VERDICT 7/21/26 ===',''];
  for(const [name,cls,items] of SECTIONS){
    l.push('--- '+name+' ---');
    if(verdict['__section_'+cls]) l.push('  section comment: '+verdict['__section_'+cls]);
    items.forEach(it=>{ const v=verdict[it.id]; if(v) l.push('  '+it.id+' ('+it.label+'): '+v); });
    l.push('');
  }
  l.push('GLOBAL: '+(document.getElementById('global').value||'(none)'));
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([l.join('\n')],{type:'text/plain'}));
  a.download='BOHEMIA_ASSET_ROUNDUP_VERDICT_7_21_26.txt'; a.click();
}
document.getElementById('sun').onclick=()=>{ SUN=!SUN; build(); };
document.getElementById('exp').onclick=exportTxt;
build();
</script>
"""
html = html.replace('__SECTIONS__', json.dumps(SECTIONS))
open(OUT, 'w', encoding='utf8').write(html)
total = sum(len(s[2]) for s in SECTIONS)
print('roundup built -> %s (%d candidates across %d sections)' % (OUT, total, len(SECTIONS)))
