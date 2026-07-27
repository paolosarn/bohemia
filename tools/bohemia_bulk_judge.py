#!/usr/bin/env python3
"""
BOHEMIA BULK JUDGE (7/27/26, WORLD lane) — ONE PLACE TO JUDGE EVERYTHING.

Paolo, verbatim, the turn he approved the town and the ballpark:
  "is there anyway i can comment and judge all ur work in bulk and individually"

That is a complaint about the VERDICT SURFACE, and it is a fair one. The judge
pages that existed were one-subject and scattered: a hero page, a house-skin
page, an asset roundup, three quest pages. Nothing showed him a district's
GROUND and its ICON together, nothing let him clear forty items in one gesture,
and the only way to reach any of them was to know the filename. So a verdict
cost him a hunt per item, and STALE UNJUDGED IS DEAD did the rest.

WHAT THIS IS: every registered district, one row each — the PLOT YOU WALK on the
left, the CITY BUILDER ICON on the right, side by side, because they are supposed
to read as the same place (Paolo 7/24: "damn near the same") and that is only
judgeable when they are next to each other.

BULK **AND** INDIVIDUALLY, which is the actual ask:
  - per row: thumb up / thumb down / a comment box
  - per group: ALL UP / ALL DOWN across a whole category in one tap
  - global: ALL UP / ALL DOWN / CLEAR, and a live "42 of 48 judged" counter
  - a NEEDS A LOOK filter that hides everything already judged, so a second pass
    only shows him what is left
  - the global comment box, SUN MODE, and EXPORT .txt (never .json), per the
    standing verdict-workflow law

REUSE CHECK (REUSE-FIRST, Paolo 7/22): this tool cooks NO new graphic pixels at
all. The plot plates are rendered straight from the EXISTING district grid dump
(tools/bohemia_district_grid_dump.js -> grid + palette, the same canonical
generate() output the game walks) and the icons are read verbatim out of the
EXISTING bank banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt. Nothing here
invents art; it is a viewer over two things that already shipped. Banks opened in
code below: the hero candidates bank (json.load) and the grid dump (json.load).

  node tools/bohemia_district_grid_dump.js      # refresh the plates first
  python3 tools/bohemia_bulk_judge.py
    -> slices/BOHEMIA_BULK_JUDGE_7_27_26.html
"""
import base64
import json
import os
import struct
import subprocess
import sys
import tempfile
import zlib

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
BANK = 'banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt'
OUT = 'slices/BOHEMIA_BULK_JUDGE_7_27_26.html'
SCRATCH = os.environ.get('BOHEMIA_SCRATCH') or tempfile.gettempdir()
GRIDS = os.path.join(SCRATCH, 'bohemia_district_grids.json')

# ---- the plates come from the canonical grids, never from a fresh cook -------
if not os.path.exists(GRIDS):
    subprocess.run(['node', 'tools/bohemia_district_grid_dump.js'], check=True,
                   stdout=subprocess.DEVNULL)
grids = json.load(open(GRIDS))
bank = json.load(open(BANK))
icons = {h['district']: h for h in bank['heroes']}

# CATEGORIES so a bulk gesture has a meaningful unit. A "judge everything" button
# alone is not bulk judging, it is a rubber stamp; grouping is what lets him clear
# the parks and still look properly at the landmarks.
CATEGORY = {
    'residential': ['suburb', 'trailer', 'apartment', 'town'],   # gated + estate ARE suburb
    'commercial':  ['commercial', 'mall', 'downtown', 'swapmeet', 'truckstop'],
    'industrial':  ['industrial', 'warehouse', 'storage', 'boneyard', 'landfill',
                    'railyard', 'battery', 'solar', 'substation', 'watertreat'],
    'civic':       ['school', 'library', 'medical', 'firestation', 'policestation',
                    'courthouse', 'jail', 'cityhall', 'chapel', 'cemetery', 'terminal'],
    'leisure':     ['park', 'golf', 'stadium', 'ballpark', 'speedway', 'waterpark',
                    'drivein', 'campus'],
    'landscape':   ['wash', 'farm'],
    'surface':     ['rail', 'interchange', 'airport', 'airbase'],
}
PLACED = {d for ds in CATEGORY.values() for d in ds}
CATEGORY['unfiled'] = sorted(d for d in grids if d not in PLACED)
if not CATEGORY['unfiled']:
    del CATEGORY['unfiled']


def png(rgb_rows, w, h):
    """Minimal RGB PNG. No dependency, no cook — it is the grid's own colours."""
    raw = bytearray()
    for row in rgb_rows:
        raw.append(0)
        raw.extend(row)
    def chunk(tag, data):
        return (struct.pack('>I', len(data)) + tag + data +
                struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff))
    return (b'\x89PNG\r\n\x1a\n' +
            chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 2, 0, 0, 0)) +
            chunk(b'IDAT', zlib.compress(bytes(raw), 9)) +
            chunk(b'IEND', b''))


def plate(d, scale=2):
    """One district's plot, at 2x so a 128-tile cell reads at 256px on a phone."""
    g = grids[d]['grid']
    pal = grids[d]['palette']
    cache = {}
    for k, v in pal.items():
        cache[int(k)] = (int(v[1:3], 16), int(v[3:5], 16), int(v[5:7], 16))
    cache.setdefault(0, (0x46, 0x3f, 0x30))          # kit dead-dirt for code 0
    rows = []
    for y in range(len(g)):
        row = bytearray()
        for x in range(len(g[0])):
            c = cache.get(g[y][x], (0xff, 0x00, 0xff))
            row.extend(c * scale)
        for _ in range(scale):
            rows.append(bytes(row))
    n = len(g[0]) * scale
    return base64.b64encode(png(rows, n, len(g) * scale)).decode('ascii')


items = []
for cat in CATEGORY:
    for d in CATEGORY[cat]:
        if d not in grids:
            continue
        ic = icons.get(d)
        items.append({
            'd': d, 'cat': cat,
            'ground': plate(d),
            'icon': ic['b64'] if ic else '',
            'label': ic['label'] if ic else 'NO CITY ICON YET — this district owes one under the 7/27 icon law.',
        })

owed = [i['d'] for i in items if not i['icon']]
print('  %d districts plated, %d with icons, %d still owe one' %
      (len(items), len(items) - len(owed), len(owed)))

HTML = r"""<meta charset="utf-8">
<title>BOHEMIA BULK JUDGE 7/27</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
 body{margin:0;background:#0d0f0a;font-family:-apple-system,system-ui,sans-serif}
 button{font:600 13px/1 -apple-system,sans-serif;cursor:pointer}
 .btn{padding:10px 13px;border-radius:9px;border:1px solid #7a7256;background:#1b1d15;color:#d8cda2}
 .btn.on{background:#3f8c3f;color:#fff;border-color:#3f8c3f}
</style>
<div id="hdr" style="padding:12px 12px 4px">
 <div style="font:700 16px -apple-system,sans-serif;color:#cdbd8a">BOHEMIA — JUDGE EVERYTHING</div>
 <div id="sub" style="font:13px/1.5 -apple-system,sans-serif;color:#8f8770;margin-top:5px">
  Every district, one row each: <b>the plot you walk</b> on the left, <b>the city builder icon</b> on the right.
  They are supposed to read as the same place, so they are next to each other.
  Thumb them one at a time, or clear a whole group with ALL UP / ALL DOWN. Comment anywhere. Export when done.
 </div>
</div>
<div id="bar" style="position:sticky;top:0;z-index:9;background:#0d0f0a;padding:8px 12px;display:flex;gap:7px;flex-wrap:wrap;align-items:center;border-bottom:1px solid #2a2c20">
 <button class="btn" id="allup">&#128077; ALL UP</button>
 <button class="btn" id="alldn">&#128078; ALL DOWN</button>
 <button class="btn" id="clear">CLEAR</button>
 <button class="btn" id="only">NEEDS A LOOK</button>
 <button class="btn" id="sun">&#9728; SUN MODE</button>
 <button class="btn" id="exp" style="background:#3f8c3f;color:#fff;border-color:#3f8c3f">&#10515; EXPORT .txt</button>
 <span id="count" style="font:600 13px monospace;color:#8f8770;margin-left:auto"></span>
</div>
<div id="root"></div>
<div style="padding:14px 12px 40px">
 <div id="gcap" style="font:12px sans-serif;color:#8f8770;margin-bottom:5px">PAOLO COMMENTS — anything at all, rides the export:</div>
 <textarea id="global" style="width:100%;height:96px;border-radius:9px;padding:9px;background:#111;color:#ddd;border:1px solid #888;box-sizing:border-box" placeholder="what is wrong with all of them, what to build next, what you never want to see again..."></textarea>
</div>
<script>
const ITEMS=__ITEMS__;
let SUN=false, ONLY=false;
const verdict={}, comments={};

function counts(){ let u=0,d=0; for(const k in verdict){ if(verdict[k]==='up')u++; else if(verdict[k]==='down')d++; }
  return {u:u,d:d,left:ITEMS.length-u-d}; }
function refreshCount(){ const c=counts();
  document.getElementById('count').textContent=c.u+' up / '+c.d+' down / '+c.left+' left'; }

function setV(d,v){ if(verdict[d]===v) delete verdict[d]; else verdict[d]=v; build(); }
function bulk(cat,v){ ITEMS.forEach(function(it){ if(cat===null||it.cat===cat) verdict[it.d]=v; }); build(); }

function build(){
  const bg=SUN?'#efe7cf':'#0d0f0a', fg=SUN?'#3a3320':'#cdbd8a', dim=SUN?'#6a6045':'#8f8770';
  document.body.style.background=bg;
  document.getElementById('bar').style.background=bg;
  document.getElementById('hdr').style.background=bg;
  document.querySelector('#hdr div').style.color=fg;
  document.getElementById('sub').style.color=dim;
  document.getElementById('gcap').style.color=dim;
  const root=document.getElementById('root'); root.innerHTML='';
  const cats=[]; ITEMS.forEach(function(i){ if(cats.indexOf(i.cat)<0)cats.push(i.cat); });
  cats.forEach(function(cat){
    const rows=ITEMS.filter(function(i){ return i.cat===cat && (!ONLY || !verdict[i.d]); });
    if(!rows.length) return;
    const head=document.createElement('div');
    head.style.cssText='display:flex;gap:7px;align-items:center;flex-wrap:wrap;margin:20px 12px 8px';
    const t=document.createElement('div');
    t.style.cssText='font:700 14px -apple-system,sans-serif;letter-spacing:1px;color:'+fg;
    t.textContent=cat.toUpperCase()+'  ('+rows.length+')';
    head.appendChild(t);
    [['\u{1F44D} all up','up'],['\u{1F44E} all down','down']].forEach(function(p){
      const b=document.createElement('button'); b.className='btn'; b.textContent=p[0];
      b.style.padding='6px 10px'; b.style.fontSize='12px';
      b.onclick=function(){ bulk(cat,p[1]); };
      head.appendChild(b);
    });
    root.appendChild(head);
    rows.forEach(function(it){
      const card=document.createElement('div');
      card.style.cssText='margin:0 12px 12px;padding:10px;border-radius:11px;background:'+(SUN?'#e4dbc0':'#161810')+
        ';border:2px solid '+(verdict[it.d]==='up'?'#3f8c3f':verdict[it.d]==='down'?'#8c3f3f':'transparent');
      const name=document.createElement('div');
      name.style.cssText='font:700 14px monospace;color:'+fg+';margin-bottom:2px';
      name.textContent=it.d.toUpperCase();
      card.appendChild(name);
      const lab=document.createElement('div');
      lab.style.cssText='font:11px/1.45 -apple-system,sans-serif;color:'+dim+';margin-bottom:8px';
      lab.textContent=it.label;
      card.appendChild(lab);

      const pair=document.createElement('div');
      pair.style.cssText='display:flex;gap:8px;flex-wrap:wrap';
      [['THE PLOT YOU WALK',it.ground],['THE CITY ICON',it.icon]].forEach(function(p){
        const cell=document.createElement('div');
        cell.style.cssText='flex:1;min-width:140px;text-align:center';
        const cap=document.createElement('div');
        cap.style.cssText='font:10px monospace;color:'+dim+';margin-bottom:3px';
        cap.textContent=p[0];
        cell.appendChild(cap);
        if(p[1]){
          const im=document.createElement('img');
          im.src='data:image/png;base64,'+p[1];
          im.style.cssText='width:100%;max-width:250px;image-rendering:pixelated;border-radius:6px;background:'+(SUN?'#d8cfb4':'#0a0b07');
          cell.appendChild(im);
        } else {
          const none=document.createElement('div');
          none.style.cssText='font:11px monospace;color:#a8663f;padding:34px 6px';
          none.textContent='NO ICON YET';
          cell.appendChild(none);
        }
        pair.appendChild(cell);
      });
      card.appendChild(pair);

      const btns=document.createElement('div');
      btns.style.cssText='display:flex;gap:7px;margin-top:9px';
      [['\u{1F44D}','up'],['\u{1F44E}','down']].forEach(function(p){
        const b=document.createElement('button');
        b.className='btn'+(verdict[it.d]===p[1]?' on':'');
        b.textContent=p[0]; b.style.flex='1';
        b.onclick=function(){ setV(it.d,p[1]); };
        btns.appendChild(b);
      });
      card.appendChild(btns);

      const cm=document.createElement('textarea');
      cm.placeholder='comment on '+it.d+'...';
      cm.value=comments[it.d]||'';
      cm.style.cssText='width:100%;margin-top:7px;padding:8px;border-radius:8px;border:1px solid #888;box-sizing:border-box;background:'+
        (SUN?'#fff':'#111')+';color:'+(SUN?'#222':'#ddd');
      cm.oninput=function(){ comments[it.d]=cm.value; };
      card.appendChild(cm);
      root.appendChild(card);
    });
  });
  refreshCount();
}

function exportTxt(){
  const c=counts();
  let s='BOHEMIA BULK VERDICT 7/27/26\n';
  s+=c.u+' up, '+c.d+' down, '+c.left+' unjudged, of '+ITEMS.length+' districts\n';
  s+='(each row: the walkable plot AND its city builder icon, judged together)\n\n';
  ['up','down'].forEach(function(v){
    const list=ITEMS.filter(function(i){ return verdict[i.d]===v; });
    if(!list.length) return;
    s+=(v==='up'?'APPROVED':'REJECTED')+' ('+list.length+')\n';
    list.forEach(function(i){ s+='  '+i.d+(comments[i.d]?'  -- '+comments[i.d]:'')+'\n'; });
    s+='\n';
  });
  const left=ITEMS.filter(function(i){ return !verdict[i.d]; });
  if(left.length){ s+='NOT JUDGED ('+left.length+')\n';
    left.forEach(function(i){ s+='  '+i.d+(comments[i.d]?'  -- '+comments[i.d]:'')+'\n'; }); s+='\n'; }
  const g=document.getElementById('global').value.trim();
  if(g) s+='PAOLO COMMENTS\n'+g+'\n';
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([s],{type:'text/plain'}));
  a.download='BOHEMIA_BULK_VERDICT_7_27_26.txt'; a.click();
}

document.getElementById('allup').onclick=function(){ bulk(null,'up'); };
document.getElementById('alldn').onclick=function(){ bulk(null,'down'); };
document.getElementById('clear').onclick=function(){ for(const k in verdict) delete verdict[k]; build(); };
document.getElementById('only').onclick=function(){ ONLY=!ONLY;
  document.getElementById('only').className='btn'+(ONLY?' on':''); build(); };
document.getElementById('sun').onclick=function(){ SUN=!SUN; build(); };
document.getElementById('exp').onclick=exportTxt;
build();
</script>
"""

html = HTML.replace('__ITEMS__', json.dumps(items))
open(OUT, 'w', encoding='utf8').write(html)
print('  bulk judge -> %s  (%.1f MB)' % (OUT, len(html) / 1048576.0))
