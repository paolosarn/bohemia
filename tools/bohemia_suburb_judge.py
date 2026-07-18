#!/usr/bin/env python3
"""
BOHEMIA SUBURB INTERIOR — JUDGING TOOL (7/18/26, v3 MODULAR)

Paolo's rulings:
- Judgment lives as an interactive in the SLICE menu (not a chat image).
- MODULARITY LAW: every suburb design must snap into a 1x1, 1x2 OR 2x2 cluster
  (DISTRICT MERGE LAW). Standalone is fine, but if it cannot easily snap to the
  neighbor suburbs, he does not want it. So the generator is CLUSTER-AWARE: it
  fills a cw x ch union with ONE coherent, connected neighborhood (wall wraps the
  union, gates per street-facing cell, the internal road net is one network).
- Every Vegas home has a driveway from the street to a front-facing garage.

FACTORY LAW: I run the machine, Paolo kills/approves; nothing graduates into
bohemia_plotgen until he picks. The tool shows each style at 1x1 AND 2x2 so he can
see it snap. Verdict workflow: SUN MODE, thumbs, comments, export .txt.

  python3 tools/bohemia_suburb_judge.py -> slices/BOHEMIA_SUBURB_JUDGE_7_18_26.html
"""
import os
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
OUT = 'slices/BOHEMIA_SUBURB_JUDGE_7_18_26.html'

GEN = open(os.path.join(REPO, 'tools/bohemia_suburb_gen.js'), encoding='utf8').read()

UI = r"""
// ===== judging UI: each style shown at 1x1 AND 2x2 (proves it snaps) =====
var STYLES=[
  {id:'culs', name:'CUL-DE-SACS', blurb:'collectors off the gate with dead-end bulbs — the classic Vegas tract'},
  {id:'loop', name:'THE LOOPS',   blurb:'one loop road per cell, tied to the collectors, homes facing in and out'},
  {id:'garden',name:'GARDEN CURVE',blurb:'curvy avenues + green pockets, sparser and softer'}
];
var SUN=false, seedBase=7;
var verdict={},comments={};
function col(code){
  if(SUN)return ['#cfe0b0','#7c7c84','#c2b184','#eceaef','#cfc8b2','#c7a24a','#8a7454'][code];
  return ['#1e2618','#33333c','#8a7e6b','#c2bfc6','#2a3220','#c79a3f','#544636'][code];
}
function render(cv,style,seed,cw,ch){var res=genSub(seed,style,cw,ch),g=res.g,ctx=cv.getContext('2d');
  var W=g[0].length,H=g.length;var PX=Math.min(cv.width/W,cv.height/H);
  ctx.fillStyle=SUN?'#f2ead2':'#12140f';ctx.fillRect(0,0,cv.width,cv.height);
  var ox=(cv.width-W*PX)/2, oy=(cv.height-H*PX)/2;
  for(var y=0;y<H;y++)for(var x=0;x<W;x++){var c=g[y][x];if(c===0&&!SUN)continue;ctx.fillStyle=col(c);ctx.fillRect(ox+x*PX,oy+y*PX,PX+0.5,PX+0.5);}
  return res;}
function build(){var root=document.getElementById('root');document.body.style.background=SUN?'#efe7cf':'#0d0f0a';root.innerHTML='';
  STYLES.forEach(function(st){
    var card=document.createElement('div');card.style.cssText='margin:0 10px 20px;border-radius:10px;padding:10px;background:'+(SUN?'#e4dbc0':'#181a12');
    var h=document.createElement('div');h.style.cssText='font:600 15px sans-serif;color:'+(SUN?'#3a3320':'#cdbd8a');h.textContent=st.name;
    var b=document.createElement('div');b.style.cssText='font:12px sans-serif;color:'+(SUN?'#6a6045':'#8f8770')+';margin:2px 0 8px';b.textContent=st.blurb;
    var row=document.createElement('div');row.style.cssText='display:flex;gap:8px;align-items:flex-end';
    var mk=function(cw,ch,lbl,wpct){var box=document.createElement('div');box.style.cssText='flex:0 0 '+wpct+';';
      var cap=document.createElement('div');cap.style.cssText='font:11px sans-serif;color:'+(SUN?'#6a6045':'#7f7a68')+';margin-bottom:3px';cap.textContent=lbl;
      var cv=document.createElement('canvas');cv.width=cw*220;cv.height=ch*220;cv.style.cssText='width:100%;border-radius:6px;background:#000;display:block';
      box.appendChild(cap);box.appendChild(cv);render(cv,st.id,seedBase,cw,ch);return box;};
    row.appendChild(mk(1,1,'1x1 standalone','32%'));
    row.appendChild(mk(2,2,'2x2 snapped (merge law)','64%'));
    var vr=document.createElement('div');vr.style.cssText='display:flex;gap:10px;align-items:center;margin-top:10px';
    var up=document.createElement('button');up.textContent='👍';var dn=document.createElement('button');dn.textContent='👎';
    [up,dn].forEach(function(btn){btn.style.cssText='font-size:22px;width:56px;height:44px;border-radius:8px;border:2px solid #888;background:#0000';});
    function paint(){up.style.background=verdict[st.id]==='up'?'#3f8c3f':'#0000';dn.style.background=verdict[st.id]==='down'?'#b0453f':'#0000';}
    up.onclick=function(){verdict[st.id]='up';paint();};dn.onclick=function(){verdict[st.id]='down';paint();};paint();
    var cm=document.createElement('input');cm.placeholder='comment on '+st.name+'...';cm.value=comments[st.id]||'';
    cm.style.cssText='flex:1;padding:8px;border-radius:8px;border:1px solid #888;background:'+(SUN?'#fff':'#111')+';color:'+(SUN?'#222':'#ddd');
    cm.oninput=function(){comments[st.id]=cm.value;};
    vr.appendChild(up);vr.appendChild(dn);vr.appendChild(cm);
    card.appendChild(h);card.appendChild(b);card.appendChild(row);card.appendChild(vr);root.appendChild(card);
  });}
function exportTxt(){var lines=['=== BOHEMIA SUBURB INTERIOR VERDICT ==='];
  STYLES.forEach(function(st){lines.push(st.name+': '+((verdict[st.id]||'--').toUpperCase()));});
  lines.push('--- PER-STYLE COMMENTS ---');STYLES.forEach(function(st){if(comments[st.id])lines.push(st.name+': '+comments[st.id]);});
  lines.push('--- PAOLO COMMENTS ---');lines.push(document.getElementById('global').value||'(none)');
  var blob=new Blob([lines.join('\n')],{type:'text/plain'});var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='BOHEMIA_SUBURB_VERDICT.txt';a.click();}
document.getElementById('sun').onclick=function(){SUN=!SUN;build();};
document.getElementById('reseed').onclick=function(){seedBase=(seedBase*7+13)%9000+1;build();};
document.getElementById('exp').onclick=exportTxt;
build();window.__SUBURB_READY=true;
"""

HTML = """<h1 style="font:600 15px/1.35 -apple-system,sans-serif;color:#cdbd8a;margin:8px 10px">BOHEMIA — SUBURB INTERIOR: your call. Each style is shown as a 1x1 standalone AND snapped into a 2x2 (the merge law) so you can see it holds together as one neighborhood, not four walled boxes. Every home has a driveway to a front garage. Thumb what feels like Bohemia, kill what does not, comment, export. Nothing is canon until you pick. Reseed for variety.</h1>
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
print('suburb judge (modular) -> %s (%d KB)' % (OUT, len(HTML) // 1024))
