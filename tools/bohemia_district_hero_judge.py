#!/usr/bin/env python3
"""
BOHEMIA DISTRICT HERO JUDGE (7/23/26) - Paolo judges the 3/4-iso hero
buildings IN CONTEXT: every candidate is planted on an iso GROUND tile the
way the city builder plants it (a dead-dirt diamond, the hero rising above
it), never floating as a lonely sprite. Two massing variants per district
(standard / tall) so he picks the silhouette. Verdict workflow per law:
thumbs per candidate, per-item comment, global comment box, SUN MODE, export
.txt (never .json).

Reached from inside the alpha: LIFE tab -> hub -> DISTRICT HEROES (one-alpha
law; this page is a judge tool, not "the build"). On his thumbs, the winners
get married into the CITY tab's iso renderer.

  python3 tools/bohemia_district_hero_judge.py
    -> slices/BOHEMIA_DISTRICT_HERO_JUDGE_7_23_26.html
"""
import json
import os

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
BANK = 'banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt'
OUT = 'slices/BOHEMIA_DISTRICT_HERO_JUDGE_7_23_26.html'

bank = json.load(open(BANK))
heroes = bank['heroes']

DISTRICTS = [
    ('CITY HALL', 'cityhall', 'MATCHED to the walkable district: an admin BLOCK + a CLOCK TOWER over the entrance + a forecourt PLAZA with a DRY FOUNTAIN + flagpoles. Same palette as the tile you walk (engine/bohemia_cityhall.js).'),
    ('BATTERY (BESS YARD)', 'battery', 'MATCHED to the walkable district: a grid BATTERY-STORAGE yard — a control building + rows of BATTERY CONTAINERS with HVAC units + an INVERTER/TRANSFORMER rack + gravel + fence. Not a smokestack plant.'),
    ('TRANSIT TERMINAL (1x1)', 'terminal', 'MATCHED to the walkable district: a waiting HALL + a SCHEDULE-BOARD CLOCK over the doors + a gray boarding CANOPY over a ROW of dead BUSES + a kiss-and-ride. Compact 1x1.'),
]

meta = []
for h in heroes:
    meta.append({'district': h['district'], 'variant': h['variant'],
                 'label': h['label'], 'b64': h['b64'],
                 'w': h['w'], 'h': h['h'], 'bx': h['bx'], 'by': h['by']})

html = r"""<meta charset="utf-8">
<title>BOHEMIA DISTRICT HEROES 7/23</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<h1 id="hdr" style="font:600 15px/1.4 -apple-system,sans-serif;color:#cdbd8a;margin:10px 10px 4px">BOHEMIA - DISTRICT HEROES v7, MATCHED TO THE WALKABLE DISTRICT (Paolo 7/24, "damn near the same"). Each 1x1 hero is hand-built from its OWN district's landmarks + palette, so the city-builder sprite and the tile you walk on foot read as the same place. City Hall = admin block + clock tower + plaza + dry fountain. Battery = a grid battery-storage yard (containers + inverters + control building), NOT a smokestack plant. Terminal = waiting hall + schedule clock + canopy over a bus row. Dead-world, zero purple. Thumbs the keepers; they get married into the CITY tab.</h1>
<div style="display:flex;gap:8px;padding:8px 10px;flex-wrap:wrap;position:sticky;top:0;z-index:5" id="bar">
  <button id="sun" style="padding:9px 13px;border-radius:8px;border:1px solid #887;background:#222;color:#ddd">&#9728; SUN MODE</button>
  <button id="exp" style="padding:9px 13px;border-radius:8px;background:#3f8c3f;color:#fff;border:0">&#10515; EXPORT .txt</button>
</div>
<div id="root"></div>
<div style="padding:10px 10px 30px">
  <div id="gcap" style="font:12px sans-serif;color:#8f8770;margin-bottom:4px">PAOLO COMMENTS (rides the export):</div>
  <textarea id="global" style="width:100%;height:80px;border-radius:8px;padding:8px;background:#111;color:#ddd;border:1px solid #888;box-sizing:border-box" placeholder="heights, massing, which building says the district best..."></textarea>
</div>
<script>
const BANK_VERSION=__BANK_VERSION__;
const META=__META__;
const DISTRICTS=__DISTRICTS__;
const IMG={}; let SUN=false; const verdict={}, comments={};
function key(m){ return m.district+'_'+m.variant; }
function img(m){ const k=key(m); if(IMG[k])return IMG[k];
  const im=new Image(); im.src='data:image/png;base64,'+m.b64; IMG[k]=im; return im; }

// plant the hero on an iso GROUND the way renderCity does: a dead-dirt diamond
// (TW:TH = 2:1, the city's tile shape, scaled up) with the hero's base anchor
// (bx,by) sitting on the diamond's center. This is the builder read.
function compose(cv,m){
  const ctx=cv.getContext('2d'); const W=cv.width,H=cv.height;
  ctx.clearRect(0,0,W,H);
  ctx.imageSmoothingEnabled=false;
  const im=img(m); const scale=Math.min((H-30)/m.h,(W-30)/m.w,3.2);
  const dw=m.w*scale, dh=m.h*scale;
  // the ground diamond, centered horizontally, near the bottom
  const gx=W/2, gy=H-28;
  const TWd=Math.max(dw*0.9,90), THd=TWd/2;
  ctx.fillStyle=SUN?'#a8927088':'#5a503e';         // a soft ground shadow pool
  ctx.beginPath();
  ctx.moveTo(gx,gy-THd/2); ctx.lineTo(gx+TWd/2,gy); ctx.lineTo(gx,gy+THd/2); ctx.lineTo(gx-TWd/2,gy);
  ctx.closePath(); ctx.fill();
  // the dead-dirt ground tiles behind (a small patch so it reads as terrain)
  ctx.fillStyle=SUN?'#9c8a68':'#463f30';
  ctx.beginPath();
  ctx.moveTo(gx,gy-THd/2-1); ctx.lineTo(gx+TWd/2+1,gy); ctx.lineTo(gx,gy+THd/2+1); ctx.lineTo(gx-TWd/2-1,gy);
  ctx.closePath(); ctx.stroke ? (ctx.strokeStyle=SUN?'#7d6e54':'#38321f', ctx.lineWidth=2, ctx.stroke()) : 0;
  // the hero: base anchor (bx,by) lands on the diamond center (gx,gy)
  const ox=gx-m.bx*scale, oy=gy-m.by*scale;
  ctx.drawImage(im,0,0,m.w,m.h,ox,oy,dw,dh);
  if(SUN){ ctx.fillStyle='rgba(255,246,214,0.10)'; ctx.fillRect(0,0,W,H); }
}

function build(){
  document.body.style.background=SUN?'#efe7cf':'#0d0f0a';
  document.getElementById('bar').style.background=SUN?'#efe7cf':'#0d0f0a';
  document.getElementById('hdr').style.color=SUN?'#3a3320':'#cdbd8a';
  document.getElementById('gcap').style.color=SUN?'#6a6045':'#8f8770';
  const root=document.getElementById('root'); root.innerHTML='';
  for(const [name,dist,blurb] of DISTRICTS){
    const h=document.createElement('div');
    h.style.cssText='font:700 14px sans-serif;margin:16px 10px 2px;color:'+(SUN?'#3a3320':'#cdbd8a');
    h.textContent=name; root.appendChild(h);
    const b=document.createElement('div');
    b.style.cssText='font:12px sans-serif;margin:0 10px 8px;color:'+(SUN?'#6a6045':'#8f8770');
    b.textContent=blurb; root.appendChild(b);
    const strip=document.createElement('div');
    strip.style.cssText='display:flex;gap:10px;flex-wrap:wrap;margin:0 10px 10px';
    META.filter(m=>m.district===dist).forEach(m=>{
      const card=document.createElement('div');
      card.style.cssText='flex:1;min-width:230px;max-width:340px;border-radius:10px;padding:10px;background:'+(SUN?'#e4dbc0':'#181a12');
      const t=document.createElement('div');
      t.style.cssText='font:600 13px monospace;color:'+(SUN?'#3a3320':'#cdbd8a');
      t.textContent=m.variant.toUpperCase()+' massing'; card.appendChild(t);
      const cv=document.createElement('canvas'); cv.width=320; cv.height=300;
      cv.style.cssText='width:100%;image-rendering:pixelated;border-radius:6px;margin-top:6px;display:block';
      card.appendChild(cv);
      const draw=()=>compose(cv,m);
      const im=img(m); if(im.complete)draw(); else im.onload=draw;
      setTimeout(draw,250); setTimeout(draw,800);
      const ctr=document.createElement('div'); ctr.style.cssText='display:flex;gap:8px;margin-top:8px;align-items:center';
      const mk=(lbl,val)=>{ const bt=document.createElement('button');
        bt.textContent=lbl; bt.style.cssText='padding:8px 14px;border-radius:8px;border:1px solid #887;background:#222;color:#ddd;font-size:16px';
        const paint=()=>{ bt.style.background=verdict[key(m)]===val?(val==='UP'?'#2f7c2f':'#8c3030'):'#222'; };
        bt.onclick=()=>{ verdict[key(m)]=verdict[key(m)]===val?undefined:val; paint(); }; paint(); return bt; };
      ctr.appendChild(mk('👍','UP')); ctr.appendChild(mk('👎','DOWN'));
      card.appendChild(ctr);
      const cm=document.createElement('input'); cm.placeholder='comment...'; cm.value=comments[key(m)]||'';
      cm.style.cssText='width:100%;margin-top:6px;padding:8px;border-radius:8px;border:1px solid #888;box-sizing:border-box;background:'+(SUN?'#fff':'#111')+';color:'+(SUN?'#222':'#ddd');
      cm.oninput=()=>{ comments[key(m)]=cm.value; }; card.appendChild(cm);
      strip.appendChild(card);
    });
    root.appendChild(strip);
  }
}

function exportTxt(){
  const l=['=== BOHEMIA DISTRICT HERO VERDICT 7/23/26 ===','bank: '+BANK_VERSION,''];
  META.forEach(m=>{ l.push(m.district+' '+m.variant+': '+(verdict[key(m)]||'SKIP')+(comments[key(m)]?'  |  '+comments[key(m)]:'')); });
  l.push(''); l.push('GLOBAL: '+(document.getElementById('global').value||'(none)'));
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([l.join('\n')],{type:'text/plain'}));
  a.download='BOHEMIA_DISTRICT_HERO_VERDICT_7_23_26.txt'; a.click();
}
document.getElementById('sun').onclick=()=>{ SUN=!SUN; build(); };
document.getElementById('exp').onclick=exportTxt;
build();
</script>
"""
html = html.replace('__BANK_VERSION__', json.dumps(bank['version']))
html = html.replace('__META__', json.dumps(meta))
html = html.replace('__DISTRICTS__', json.dumps(DISTRICTS))
open(OUT, 'w', encoding='utf8').write(html)
print('hero judge built -> %s  (%d heroes on iso ground)' % (OUT, len(meta)))
