#!/usr/bin/env python3
"""
BOHEMIA SUBURB INTERIOR — JUDGING TOOL (7/18/26)

Paolo: if I want his judgment it lives as an interactive in the SLICE menu. The
one thing that genuinely needs his ruling is the SUBURB INTERIOR — how a walled
Bohemia neighborhood is laid out inside (loops / culs / lots), which is HIS under
MAP LAW. Homes live here; agents (LIFE) live in homes; so this ruling unblocks
the whole next system.

FACTORY LAW: I mass-produce candidate layouts from the specified anatomy
(VEGAS_NEIGHBORHOOD_ANATOMY: curvilinear, loops + culs, walled, few entries).
Paolo KILLS / APPROVES. He is still placing canon by choosing; I only run the
machine. Nothing here graduates into bohemia_plotgen until he approves.

  python3 tools/bohemia_suburb_judge.py -> slices/BOHEMIA_SUBURB_JUDGE_7_18_26.html

Verdict workflow: SUN MODE, thumbs per style, per-style + global comments, export
as .txt (never .json). Set as the SLICE-menu current so it shows in the alpha.
"""
import os
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
OUT = 'slices/BOHEMIA_SUBURB_JUDGE_7_18_26.html'

# The candidate generator + judging UI is all client-side JS so Paolo can reseed
# and see the variety each style produces before ruling.
GEN = r"""
// ===== SUBURB INTERIOR candidate generator (curvilinear, from the anatomy) =====
// codes: 0 lawn, 1 road, 2 house, 3 driveway, 4 wall, 5 entrance-road
function mkRng(seed){var s=(seed>>>0)||1;return function(){s=(s*1103515245+12345)>>>0;return s/4294967296;};}
var SZ=100;   // plot render tiles (a 96m plot, schematic)
function blank(){var g=[];for(var y=0;y<SZ;y++){var r=[];for(var x=0;x<SZ;x++)r.push(0);g.push(r);}return g;}
function inb(x,y){return x>=1&&y>=1&&x<SZ-1&&y<SZ-1;}
function wall(g){for(var x=0;x<SZ;x++){g[0][x]=4;g[SZ-1][x]=4;}for(var y=0;y<SZ;y++){g[y][0]=4;g[y][SZ-1]=4;}
  // south entrance gap
  var ex=SZ>>1; for(var d=-2;d<=2;d++)g[SZ-1][ex+d]=5;}
function stampRoad(g,x,y,w){for(var dy=-w;dy<=w;dy++)for(var dx=-w;dx<=w;dx++){var nx=(x+dx)|0,ny=(y+dy)|0;
  if(inb(nx,ny)&&g[ny][nx]!==2&&g[ny][nx]!==4)g[ny][nx]=1;}}
function seg(g,x0,y0,x1,y1,w){var n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))|0;n=Math.max(1,n);
  for(var i=0;i<=n;i++)stampRoad(g,x0+(x1-x0)*i/n,y0+(y1-y0)*i/n,w);}
function ring(g,cx,cy,rx,ry,w){for(var a=0;a<Math.PI*2;a+=0.03)stampRoad(g,cx+Math.cos(a)*rx,cy+Math.sin(a)*ry,w);}
// A Vegas HOME: driveway from the street -> front-facing garage -> house body.
// codes add: 6 garage. Everything faces the road (nx,ny points road->lot).
function clearCells(g,cells){for(var i=0;i<cells.length;i++){var c=cells[i];if(!inb(c[0],c[1])||g[c[1]][c[0]]!==0)return false;}return true;}
function home(g,rx,ry,nx,ny,drive,gw,hw,hh){
  var px=-ny, py=nx;                          // perpendicular (lot frontage axis)
  var gw0=-(gw>>1), hw0=-(hw>>1);
  var driveC=[],garC=[],bodyC=[],all=[];
  for(var d=1;d<=drive;d++)for(var w=gw0;w<gw0+gw;w++){var c=[(rx+nx*d+px*w)|0,(ry+ny*d+py*w)|0];driveC.push(c);all.push(c);}
  for(var d=drive+1;d<=drive+3;d++)for(var w=gw0;w<gw0+gw;w++){var c=[(rx+nx*d+px*w)|0,(ry+ny*d+py*w)|0];garC.push(c);all.push(c);}
  for(var d=drive+3;d<drive+3+hh;d++)for(var w=hw0;w<hw0+hw;w++){var c=[(rx+nx*d+px*w)|0,(ry+ny*d+py*w)|0];bodyC.push(c);all.push(c);}
  if(!clearCells(g,all))return false;
  driveC.forEach(function(c){g[c[1]][c[0]]=3;});
  garC.forEach(function(c){g[c[1]][c[0]]=6;});
  bodyC.forEach(function(c){g[c[1]][c[0]]=2;});
  return true;
}
// place homes along every road cell, garage + driveway to the street, both sides
function lineHouses(g,r,drive,hw,hh,spacing){
  var gw=4;   // ~2-car garage / driveway width
  var roadCells=[];for(var y=1;y<SZ-1;y++)for(var x=1;x<SZ-1;x++)if(g[y][x]===1||g[y][x]===5)roadCells.push([x,y]);
  var k=0;
  for(var i=0;i<roadCells.length;i++){
    var x=roadCells[i][0],y=roadCells[i][1];
    for(var s=0;s<4;s++){
      var nx=[1,-1,0,0][s], ny=[0,0,1,-1][s];
      if(!inb(x+nx*2,y+ny*2)||g[y+ny*2][x+nx*2]!==0)continue;   // frontage must open to lawn
      if((k++ % spacing)!==0)continue;
      home(g,x,y,nx,ny,drive,gw,hw,hh);
    }
  }
}
function genSuburb(seed,style){
  var g=blank(); wall(g); var r=mkRng(seed); var ex=SZ>>1;
  if(style==='loop'){
    seg(g,ex,SZ-3,ex,66,2);                      // entrance connector
    ring(g,ex, (SZ*0.42)|0, (SZ*0.30)|0, (SZ*0.24)|0, 2);   // the loop
    lineHouses(g, g, 2, 10, 7, 6);
  } else if(style==='culs'){
    seg(g,ex,SZ-3,ex,14,2);                       // spine
    var ys=[SZ*0.30,SZ*0.55,SZ*0.78];
    for(var i=0;i<ys.length;i++){var y=ys[i]|0;var dir=(i%2===0)?1:-1;
      var bx=(ex+dir*26)|0; seg(g,ex,y,bx,y,2); ring(g,bx,y,6,6,2);       // cul branch + bulb
      if(i<ys.length-1){var bx2=(ex-dir*22)|0; seg(g,ex,(y+ (ys[1]-ys[0])/2)|0,bx2,(y+(ys[1]-ys[0])/2)|0,2);}
    }
    lineHouses(g, g, 2, 10, 7, 6);
  } else { // 'garden' : gentle S-curve avenue + short branches
    var pts=[]; for(var t=0;t<=1.001;t+=0.02){var y=(SZ-3)-t*(SZ-14);var x=ex+Math.sin(t*Math.PI*1.6)*(SZ*0.22);pts.push([x,y]);}
    for(var j=0;j<pts.length-1;j++)seg(g,pts[j][0],pts[j][1],pts[j+1][0],pts[j+1][1],2);
    for(var m=1;m<pts.length-1;m+=14){var p=pts[m];var dir2=(m%28===1)?1:-1;seg(g,p[0],p[1],p[0]+dir2*20,p[1],2);}
    lineHouses(g, g, 2, 10, 7, 6);
  }
  // count houses
  var houses=0,seen={};
  for(var y=1;y<SZ-1;y++)for(var x=1;x<SZ-1;x++)if(g[y][x]===2&&g[y-1][x]!==2&&g[y][x-1]!==2)houses++;
  return {g:g, houses:houses};
}
"""

UI = r"""
// ===== judging UI =====
var STYLES=[
  {id:'loop',   name:'THE LOOP',   blurb:'one winding loop road off the gate, homes facing in and out'},
  {id:'culs',   name:'CUL-DE-SACS',blurb:'a spine with dead-end bulbs branching off, homes on the culs'},
  {id:'garden', name:'GARDEN CURVE',blurb:'a single S-curve avenue with short branches, softer + greener'}
];
var SUN=false, seedBase=7;
var verdict={};   // id -> 'up'|'down'
var comments={};  // id -> text
function col(code){
  // 0 lawn 1 road 2 house 3 driveway(bright concrete) 4 wall 5 entrance 6 garage(dark door)
  if(SUN){return ['#cfe0b0','#7c7c84','#c2b184','#eceaef','#cfc8b2','#7ec77e','#8a7454'][code];}
  return ['#1e2618','#33333c','#8a7e6b','#c2bfc6','#2a3220','#3f8c3f','#544636'][code];
}
function render(cv,style,seed){
  var res=genSuburb(seed,style),g=res.g,ctx=cv.getContext('2d');
  var PX=Math.floor(cv.width/SZ);
  ctx.fillStyle=SUN?'#f2ead2':'#12140f';ctx.fillRect(0,0,cv.width,cv.height);
  for(var y=0;y<SZ;y++)for(var x=0;x<SZ;x++){var c=g[y][x];if(c===0&&!SUN)continue;ctx.fillStyle=col(c);ctx.fillRect(x*PX,y*PX,PX,PX);}
  return res.houses;
}
function build(){
  var root=document.getElementById('root');
  document.body.style.background=SUN?'#efe7cf':'#0d0f0a';
  root.innerHTML='';
  STYLES.forEach(function(st){
    var card=document.createElement('div');card.style.cssText='margin:0 10px 20px;border-radius:10px;padding:10px;background:'+(SUN?'#e4dbc0':'#181a12');
    var h=document.createElement('div');h.style.cssText='font:600 15px sans-serif;color:'+(SUN?'#3a3320':'#cdbd8a');
    h.textContent=st.name;
    var b=document.createElement('div');b.style.cssText='font:12px sans-serif;color:'+(SUN?'#6a6045':'#8f8770')+';margin:2px 0 8px';b.textContent=st.blurb;
    var row=document.createElement('div');row.style.cssText='display:block';
    var cv=document.createElement('canvas');cv.width=500;cv.height=500;cv.style.cssText='width:100%;border-radius:6px;background:#000;display:block';row.appendChild(cv);
    render(cv,st.id,seedBase);
    var vr=document.createElement('div');vr.style.cssText='display:flex;gap:10px;align-items:center;margin-top:8px';
    var up=document.createElement('button');up.textContent='👍';var dn=document.createElement('button');dn.textContent='👎';
    [up,dn].forEach(function(btn){btn.style.cssText='font-size:22px;width:56px;height:44px;border-radius:8px;border:2px solid #888;background:#0000';});
    function paint(){up.style.background=verdict[st.id]==='up'?'#3f8c3f':'#0000';dn.style.background=verdict[st.id]==='down'?'#b0453f':'#0000';}
    up.onclick=function(){verdict[st.id]='up';paint();};dn.onclick=function(){verdict[st.id]='down';paint();};paint();
    var cm=document.createElement('input');cm.placeholder='comment on '+st.name+'...';cm.value=comments[st.id]||'';
    cm.style.cssText='flex:1;padding:8px;border-radius:8px;border:1px solid #888;background:'+(SUN?'#fff':'#111')+';color:'+(SUN?'#222':'#ddd');
    cm.oninput=function(){comments[st.id]=cm.value;};
    vr.appendChild(up);vr.appendChild(dn);vr.appendChild(cm);
    card.appendChild(h);card.appendChild(b);card.appendChild(row);card.appendChild(vr);root.appendChild(card);
  });
}
function exportTxt(){
  var lines=['=== BOHEMIA SUBURB INTERIOR VERDICT ==='];
  STYLES.forEach(function(st){lines.push(st.name+': '+((verdict[st.id]||'--').toUpperCase()));});
  lines.push('--- PER-STYLE COMMENTS ---');
  STYLES.forEach(function(st){if(comments[st.id])lines.push(st.name+': '+comments[st.id]);});
  lines.push('--- PAOLO COMMENTS ---');lines.push(document.getElementById('global').value||'(none)');
  var blob=new Blob([lines.join('\n')],{type:'text/plain'});
  var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='BOHEMIA_SUBURB_VERDICT.txt';a.click();
}
document.getElementById('sun').onclick=function(){SUN=!SUN;build();};
document.getElementById('reseed').onclick=function(){seedBase=(seedBase*7+13)%9000+1;build();};
document.getElementById('exp').onclick=exportTxt;
build();
window.__SUBURB_READY=true;
"""

HTML = """<h1 style="font:600 15px/1.35 -apple-system,sans-serif;color:#cdbd8a;margin:8px 10px">BOHEMIA — SUBURB INTERIOR: your call. Inside a walled neighborhood, which layout feels like Bohemia? These are candidates from the anatomy (curvilinear, loops + culs, walled). Thumb the ones that feel right, kill the ones that do not, comment, and export. Nothing becomes canon until you pick. Reseed to see the variety each makes.</h1>
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
print('suburb judge -> %s (%d KB)' % (OUT, len(HTML) // 1024))
