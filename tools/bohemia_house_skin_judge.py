#!/usr/bin/env python3
"""
BOHEMIA HOUSE SKIN JUDGE (7/21/26) - Paolo judges the overnight house-skin
cook IN CONTEXT: every candidate is composed onto a mock house (roof top +
front face, the world's three-quarter read), never floating as a lonely
swatch. Verdict workflow per law: thumbs per candidate, per-item comments,
global comment box at the bottom, SUN MODE, export .txt (never .json).

Reached from inside the alpha: LIFE tab -> hub -> HOUSE SKIN JUDGE (the
one-alpha law; this page is a judge tool, not "the build").

  python3 tools/bohemia_house_skin_judge.py
    -> slices/BOHEMIA_HOUSE_SKIN_JUDGE_7_21_26.html
"""
import json
import os

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
BANK = 'banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt'
OUT = 'slices/BOHEMIA_HOUSE_SKIN_JUDGE_7_21_26.html'

bank = json.load(open(BANK))
tiles = bank['tiles']
by_id = {t['id']: t for t in tiles}

# every feature candidate composes onto the PLAIN wall of its own tan base so
# the face never seams (factory cooked features on WALL_BASES[:3], plains on
# WALL_BASES[0..3] in id order)
plain_ids = [t['id'] for t in tiles if t['id'].startswith('wall_plain_')]
feat_mate = {}
for cls_prefix in ('wall_window_', 'wall_boarded_', 'wall_door_'):
    feats = [t['id'] for t in tiles if t['id'].startswith(cls_prefix)]
    for j, fid in enumerate(feats):
        feat_mate[fid] = plain_ids[j]

meta = []
for t in tiles:
    meta.append({'id': t['id'], 'cls': t['cls'], 'b64': t['b64'],
                 'mate': feat_mate.get(t['id'])})

SECTIONS = [
    ('ROOFS', 'roof', 'the visible top of every house. RULED (Paolo 7/21): SHINGLE is the Bohemia roof - "most houses look like shingles... idgaf about the material." The S-tile candidates from the material research stay here for the record, not as the winner. Gravel flats for the odd flat roof.'),
    ('WALLS', 'wall', 'the tan stucco face family (85/15) - research confirms Vegas HOA earth tones ARE this palette. Cracks from the top plate, 30 years of wear.'),
    ('WINDOWS', 'window', 'dead world: glass is DARK, or the window is BOARDED. No lit rooms ever in act 1.'),
    ('DOORS', 'door', 'weathered plank doors, frame catches the sun, one knob highlight.'),
    ('YARDS', 'yard', 'the ground between houses. Real Vegas yards are decomposed-granite rock (lawns are banned out there), in the trade blends: Desert Tan, Mojave Gold, Rebel Red. Shown as the ground around the house.'),
]

html = r"""<meta charset="utf-8">
<title>BOHEMIA HOUSE SKINS 7/21</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<h1 id="hdr" style="font:600 15px/1.4 -apple-system,sans-serif;color:#cdbd8a;margin:10px 10px 4px">BOHEMIA - HOUSE SKINS (overnight cook 7/21). The canon suburbs stand in placeholder tones because no judged house art exists yet. These are the candidates: every tile is shown ON a composed house (roof top + front face) so you judge it the way the world will show it. Thumb each, comment what you want changed, hit EXPORT and send me the .txt. Nothing touches the city until you rule.</h1>
<div style="display:flex;gap:8px;padding:8px 10px;flex-wrap:wrap;position:sticky;top:0;z-index:5" id="bar">
  <button id="sun" style="padding:9px 13px;border-radius:8px;border:1px solid #887;background:#222;color:#ddd">&#9728; SUN MODE</button>
  <button id="exp" style="padding:9px 13px;border-radius:8px;background:#3f8c3f;color:#fff;border:0">&#10515; EXPORT .txt</button>
</div>
<div id="root"></div>
<div style="padding:10px 10px 30px">
  <div id="gcap" style="font:12px sans-serif;color:#8f8770;margin-bottom:4px">PAOLO COMMENTS (rides the export):</div>
  <textarea id="global" style="width:100%;height:80px;border-radius:8px;padding:8px;background:#111;color:#ddd;border:1px solid #888;box-sizing:border-box" placeholder="anything about the house skins overall..."></textarea>
</div>
<script>
const BANK_VERSION=__BANK_VERSION__;
const META=__META__;
const SECTIONS=__SECTIONS__;
const T=44, byId={}; META.forEach(m=>byId[m.id]=m);
const IMG={}; let loaded=0;
let SUN=false; const verdict={}, comments={};

function img(id){ if(IMG[id])return IMG[id];
  const im=new Image(); im.src='data:image/png;base64,'+byId[id].b64; IMG[id]=im; return im; }

// THE COMPOSED HOUSE (7/21, rebuilt per Paolo's call - "the graphic assets
// are fire but the architecture of the house is dogshit"): the tiles were
// never wrong, the mock was - a flat elevation box (roof slab stacked dead
// flat over a wall strip) is not how ANY Bohemia house reads. This is the
// real architecture instead, matching THE BLOCK (canon suburb, approved
// 7/18) and the 45-degree research: a HIP ROOF (a big lit front plane + a
// smaller shaded side hip facet, split by a diagonal ridge line with a
// sky-lit cap), a front-corner GARAGE, and a short DRIVEWAY apron off the
// curb - the actual shape a suburb house has, not a dollhouse front.
function compose(cv,m){
  const ctx=cv.getContext('2d'); const W=cv.width,H=cv.height;
  const FACE_Y=H-T-28, ROOF_Y=10, cols=(W/T)|0;
  if(m.cls==='yard'){ // the candidate IS the ground: DG gravel around the house
    const gp=ctx.createPattern(img(m.id),'repeat'); ctx.fillStyle=gp; ctx.fillRect(0,0,W,H);
  } else { // dead dirt ground (act 1: nothing grows)
    ctx.fillStyle=SUN?'#9c8a68':'#8a7a5e'; ctx.fillRect(0,0,W,H);
    let g=1234;const rnd=()=>{g=(g*1103515245+12345)>>>0;return g/4294967296;};
    ctx.fillStyle=SUN?'#8e7c5c':'#7d6e54';
    for(let i=0;i<160;i++)ctx.fillRect((rnd()*W)|0,(rnd()*H)|0,2,1);
  }
  const roofId = m.cls==='roof' ? m.id : 'roof_shingle_2';
  const GARW=T*1.6;
  const DEFAULT_FACE=['wall_plain_9','wall_window_13','wall_plain_9','wall_door_19','wall_plain_9','wall_window_13','wall_plain_9'];
  let faceIds;
  if(m.cls==='roof'||m.cls==='yard'){ faceIds=DEFAULT_FACE; }
  else if(m.cls==='wall'){ faceIds=Array(cols).fill(m.id); }
  else { const p=m.mate; faceIds=Array(cols).fill(p);
    if(m.cls==='door'){ faceIds[2]=m.id; }
    else { faceIds[1]=m.id; faceIds[4]=m.id; } }

  // ROOF: a hip, not a slab. Big front plane (lit) + a small side hip facet
  // (shaded), split by ONE diagonal ridge line with a sky-lit cap along the
  // long edge - exactly the two-plane read the research called for.
  const roofBot=FACE_Y, roofH=roofBot-ROOF_Y;
  const hipCut=W*0.22, hipDrop=roofH*0.42;
  const pat=ctx.createPattern(img(roofId),'repeat');
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0,ROOF_Y); ctx.lineTo(W-hipCut,ROOF_Y);
  ctx.lineTo(W,ROOF_Y+hipDrop); ctx.lineTo(W,roofBot); ctx.lineTo(0,roofBot);
  ctx.closePath(); ctx.clip();
  ctx.fillStyle=pat; ctx.fillRect(0,ROOF_Y,W,roofH);
  ctx.restore();
  ctx.save();                                   // the shaded side hip facet
  ctx.beginPath();
  ctx.moveTo(W-hipCut,ROOF_Y); ctx.lineTo(W,ROOF_Y); ctx.lineTo(W,ROOF_Y+hipDrop);
  ctx.closePath(); ctx.clip();
  ctx.fillStyle=pat; ctx.fillRect(0,ROOF_Y,W,roofH);
  ctx.fillStyle='rgba(0,0,0,0.34)'; ctx.fillRect(0,ROOF_Y,W,roofH);
  ctx.restore();
  ctx.strokeStyle='rgba(0,0,0,0.55)'; ctx.lineWidth=2;   // the hip ridge line
  ctx.beginPath(); ctx.moveTo(W-hipCut,ROOF_Y); ctx.lineTo(W,ROOF_Y+hipDrop); ctx.stroke();
  ctx.strokeStyle='rgba(255,244,214,0.4)'; ctx.lineWidth=1.5;  // sky-lit ridge cap
  ctx.beginPath(); ctx.moveTo(0,ROOF_Y+1); ctx.lineTo(W-hipCut,ROOF_Y+1); ctx.stroke();
  // eave shadow between roof and face
  ctx.fillStyle='rgba(0,0,0,0.45)'; ctx.fillRect(0,FACE_Y-3,W,3);

  // FRONT FACE: the door/window band, starting after the garage corner
  for(let i=0;i<cols;i++){
    const x=GARW+i*T; if(x+T>W)break;
    ctx.drawImage(img(faceIds[i]||faceIds[0]),x,FACE_Y);
  }
  // GARAGE: the front-corner box THE BLOCK actually builds (sectional door
  // seams, darker than the wall - it is not a wall, it is the garage face)
  ctx.fillStyle=SUN?'rgba(0,0,0,0.16)':'rgba(0,0,0,0.30)';
  ctx.fillRect(0,FACE_Y,GARW,T);
  ctx.strokeStyle='rgba(0,0,0,0.4)'; ctx.lineWidth=1;
  for(let gx=4;gx<GARW-2;gx+=6){ ctx.beginPath(); ctx.moveTo(gx,FACE_Y+4); ctx.lineTo(gx,FACE_Y+T-4); ctx.stroke(); }
  // ground contact shadow
  ctx.fillStyle='rgba(0,0,0,0.30)'; ctx.fillRect(0,FACE_Y+T,W,3);
  // DRIVEWAY: the short apron off the curb, leading up to the garage
  ctx.fillStyle=SUN?'#cfc6b0':'#c8c4b8';
  ctx.fillRect(GARW*0.1,FACE_Y+T+4,GARW*0.8,H-(FACE_Y+T+4)-2);
  if(SUN){ ctx.fillStyle='rgba(255,246,214,0.14)'; ctx.fillRect(0,0,W,H); }
  else { ctx.fillStyle='rgba(10,12,20,0.10)'; ctx.fillRect(0,0,W,H); }
}

function build(){
  document.body.style.background=SUN?'#efe7cf':'#0d0f0a';
  document.getElementById('bar').style.background=SUN?'#efe7cf':'#0d0f0a';
  document.getElementById('hdr').style.color=SUN?'#3a3320':'#cdbd8a';
  document.getElementById('gcap').style.color=SUN?'#6a6045':'#8f8770';
  const root=document.getElementById('root'); root.innerHTML='';
  for(const [name,cls,blurb] of SECTIONS){
    const h=document.createElement('div');
    h.style.cssText='font:700 14px sans-serif;margin:14px 10px 2px;color:'+(SUN?'#3a3320':'#cdbd8a');
    h.textContent=name; root.appendChild(h);
    const b=document.createElement('div');
    b.style.cssText='font:12px sans-serif;margin:0 10px 8px;color:'+(SUN?'#6a6045':'#8f8770');
    b.textContent=blurb; root.appendChild(b);
    META.filter(m=>m.cls===cls).forEach(m=>{
      const card=document.createElement('div');
      card.style.cssText='margin:0 10px 18px;border-radius:10px;padding:10px;background:'+(SUN?'#e4dbc0':'#181a12');
      const t=document.createElement('div');
      t.style.cssText='font:600 13px monospace;color:'+(SUN?'#3a3320':'#cdbd8a');
      t.textContent=m.id + (m.id.includes('boarded')?'  (boarded)':''); card.appendChild(t);
      const row=document.createElement('div'); row.style.cssText='display:flex;gap:8px;align-items:flex-start;margin-top:6px';
      const cv=document.createElement('canvas'); cv.width=T*8; cv.height=T*3+T+40;
      cv.style.cssText='flex:1;min-width:0;max-width:420px;image-rendering:pixelated;border-radius:6px';
      row.appendChild(cv);
      const sw=document.createElement('canvas'); sw.width=T; sw.height=T;
      sw.style.cssText='width:72px;height:72px;image-rendering:pixelated;border-radius:6px;flex:none';
      row.appendChild(sw); card.appendChild(row);
      const draw=()=>{ compose(cv,m); sw.getContext('2d').drawImage(img(m.id),0,0); };
      const im=img(m.id); if(im.complete)draw(); else im.onload=draw;
      setTimeout(draw,300); setTimeout(draw,900);
      const ctr=document.createElement('div'); ctr.style.cssText='display:flex;gap:8px;margin-top:8px;align-items:center';
      const mk=(lbl,val)=>{ const bt=document.createElement('button');
        bt.textContent=lbl; bt.style.cssText='padding:8px 14px;border-radius:8px;border:1px solid #887;background:#222;color:#ddd;font-size:16px';
        const paint=()=>{ bt.style.background=verdict[m.id]===val?(val==='UP'?'#2f7c2f':'#8c3030'):'#222'; };
        bt.onclick=()=>{ verdict[m.id]=verdict[m.id]===val?undefined:val; paint(); }; paint(); return bt; };
      ctr.appendChild(mk('👍','UP')); ctr.appendChild(mk('👎','DOWN'));
      const cm=document.createElement('input'); cm.placeholder='comment...'; cm.value=comments[m.id]||'';
      cm.style.cssText='flex:1;padding:8px;border-radius:8px;border:1px solid #888;background:'+(SUN?'#fff':'#111')+';color:'+(SUN?'#222':'#ddd');
      cm.oninput=()=>{ comments[m.id]=cm.value; }; ctr.appendChild(cm);
      card.appendChild(ctr); root.appendChild(card);
    });
  }
}

function exportTxt(){
  const l=['=== BOHEMIA HOUSE SKIN VERDICT 7/21/26 ===','bank: '+BANK_VERSION,''];
  META.forEach(m=>{ l.push(m.id+': '+(verdict[m.id]||'SKIP')+(comments[m.id]?'  |  '+comments[m.id]:'')); });
  l.push(''); l.push('GLOBAL: '+(document.getElementById('global').value||'(none)'));
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([l.join('\n')],{type:'text/plain'}));
  a.download='BOHEMIA_HOUSE_SKIN_VERDICT_7_21_26.txt'; a.click();
}
document.getElementById('sun').onclick=()=>{ SUN=!SUN; build(); };
document.getElementById('exp').onclick=exportTxt;
build();
</script>
"""
html = html.replace('__BANK_VERSION__', json.dumps(bank['version']))
html = html.replace('__META__', json.dumps(meta))
html = html.replace('__SECTIONS__', json.dumps(SECTIONS))
open(OUT, 'w', encoding='utf8').write(html)
print('judge built -> %s  (%d candidates on composed houses)' % (OUT, len(meta)))
