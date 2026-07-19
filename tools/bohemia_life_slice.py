#!/usr/bin/env python3
"""
BOHEMIA LIFE SLICE (7/19/26, LIFE session) - the approved block, ALIVE.

The suburb walk slice let you walk the dead streets. This one puts the PEOPLE
in: every house holds a generated household (bohemia_agents), dressed from the
canon wardrobe (bohemia_dress + the extracted bank), living a full day on the
120 BPM clock - asleep at 03:00, morning ration, the employed walking out the
gate to the commercial block east, scavengers sweeping the streets, midday
shelter from the heat, the evening return, sleep. The block ledger
(bohemia_economy) counts water/food/salvage and prices scarcity for real.

WATCH mode: one world-turn per beat (0.5s) - a day in 12 minutes. STEP mode:
I-MOVE-YOU-MOVE, the world only advances when you do. Both quantized.

Judge panel per the verdict workflow: thumbs per aspect, comments, SUN MODE,
export .txt. This is the interactive Paolo judges - never a chat PNG.

  python3 tools/bohemia_life_slice.py
    -> slices/BOHEMIA_LIFE_SLICE_7_19_26.html (dated build)
    -> slices/BOHEMIA_LIFE_CURRENT.html      (the stable URL the LIFE tab loads)
"""
import os, shutil

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
OUT = 'slices/BOHEMIA_LIFE_SLICE_7_19_26.html'
CUR = 'slices/BOHEMIA_LIFE_CURRENT.html'
MODULES = ['engine/bohemia_suburb.js', 'engine/bohemia_floorplan.js',
           'engine/bohemia_daycycle.js', 'engine/bohemia_agents.js',
           'engine/bohemia_dress.js']
# NOTE: bohemia_economy is deliberately NOT embedded. Paolo parked the economy
# (7/19): no economy numbers surface at him until the world is built.
engine = '\n'.join('/* ==== %s ==== */\n%s' % (m, open(m, encoding='utf8').read()) for m in MODULES)
bank = open('banks/BOHEMIA_WARDROBE_CANON_7_19_26.txt', encoding='utf8').read()
BANK_JS = 'var WARDROBE_TXT=' + repr(bank).replace('\\n', '\\n') + ';'
# python repr -> JS string: single-quoted repr is JS-compatible for this ascii bank
GAME = r"""
// ===== LIFE SLICE - the approved block, alive =====
var SEED=7;
var res = BohemiaSuburb.generate(SEED,'ring',1,1);
var W=res.W, H=res.H, G=res.g;
var feet = BohemiaSuburb.homeFootprints(res);
var fpCache={};
function fpOf(i){ if(!fpCache[i]) fpCache[i]=BOH_FLOORPLAN.generate((SEED^((i+1)*0x9E3779B1))>>>0, feet[i].w, feet[i].h, {zone:'residential',entrance:'S'}); return fpCache[i]; }
// front doors (same rule the walk slice + life gate use)
var doorOf={}, spawn=null;
function pref(x,y,want){var nb=[[0,1],[0,-1],[1,0],[-1,0]];
  for(var k=0;k<4;k++){var ax=x+nb[k][0],ay=y+nb[k][1];
    if(ax>=0&&ay>=0&&ax<W&&ay<H&&G[ay][ax]===want)return true;}return false;}
feet.forEach(function(f,i){
  var pick=null;
  for(var pass=0;pass<3&&!pick;pass++){var want=[3,1,0][pass];
    for(var y=f.y;y<f.y+f.h&&!pick;y++)for(var x=f.x;x<f.x+f.w;x++){
      if(G[y][x]===2&&pref(x,y,want)){pick=[x,y];break;}}}
  if(pick)doorOf[pick[0]+','+pick[1]]=i;
});
for(var y=0;y<H&&!spawn;y++)for(var x=0;x<W;x++){ if(G[y][x]===5){
  var cands=[[x,y-1],[x,y+1],[x-1,y],[x+1,y]];
  for(var c=0;c<4;c++){var sx=cands[c][0],sy=cands[c][1];
    if(sx>=0&&sy>=0&&sx<W&&sy<H&&(G[sy][sx]===1||G[sy][sx]===3)){spawn=[sx,sy];break;}}
  if(spawn)break;}}
if(!spawn){ for(var yy=H-2;yy>0&&!spawn;yy--)for(var xx=0;xx<W;xx++)if(G[yy][xx]===1){spawn=[xx,yy];break;} }
// OCCUPANCY LAW means the player is a real body: standing on the gate's
// single-file approach road BLOCKADES the whole morning commute (found on the
// real surface, 7/19). Spawn OFF the approach column: nearest road cell at
// least 3 columns from the gate, so day one starts alive, not jammed.
(function(){ if(!spawn)return; var gx=spawn[0];
  var best=null,bd=1e9;
  for(var y2=0;y2<H;y2++)for(var x2=0;x2<W;x2++){ if(G[y2][x2]!==1)continue;
    if(Math.abs(x2-gx)<3)continue;
    var d=Math.abs(x2-spawn[0])+Math.abs(y2-spawn[1]);
    if(d<bd){bd=d;best=[x2,y2];} }
  if(best)spawn=best; })();

// ---- THE PEOPLE ----
// nearest work: the commercial block east of this plot (in the full world model
// jobsNear() reads it off the real overmap; the one-block slice states it).
var JOBS=[{district:'commercial',dir:'E',dist:1}];
var agents = BohemiaAgents.agentsForBlock(SEED, feet, JOBS, fpOf);
var wardrobe = BohemiaDress.parse(WARDROBE_TXT);
BohemiaDress.dressAll(agents, wardrobe);
var sim = BohemiaAgents.makeSim(res, feet, agents, {fpOf:fpOf, doorOf:doorOf, startTurn:6*60-30});
var LIVED={}; agents.forEach(function(a){LIVED[a.home.building]=1;});
var livedN=Object.keys(LIVED).length, day=1;

// ---- render ----
function gcol(x,y){var h=((x*73856093)^(y*19349663))>>>0,v=h%3;return ['#463f30','#3d382a','#4e4838'][v];}
var EXTCOL={1:'#3a3a44',2:'#9c8e76',3:'#5a5a62',4:'#6a5c44',5:'#c79a3f',6:'#6d5f4b',9:'#b3a488'};
var INT_ROLE={bed:'#8f94a0',bath:'#6ea0af',kitchen:'#beaa78',living:'#b4af96','null':'#96917d'};
var SKIN='#c9a184';
var mode='ext', px=spawn?spawn[0]:(W>>1), py=spawn?spawn[1]:(H-4);
var fp=null, fpDoor=null, backAt=null, curHouse=-1;
sim.playerAt=[px,py];
var cv=document.getElementById('cv'), ctx=cv.getContext('2d');
var HUD=document.getElementById('hud'), CLOCK=document.getElementById('clock');
var SUN=false, selAgent=null;
var lastView={CELL:14,halfW:14,halfH:14};

function passExt(x,y){ if(x<0||y<0||x>=W||y>=H)return false;
  if(doorOf[x+','+y]!=null)return true;
  if(sim.occ[x+','+y])return false;                       // OCCUPANCY: bodies block, both ways
  var c=G[y][x]; return c===0||c===1||c===3||c===5; }
function passInt(x,y){ if(!fp||x<0||y<0||x>=fp.W||y>=fp.H)return false;
  var c=fp.grid[y][x]; return c.g==='floor'||c.g==='door'; }

function enter(i){ curHouse=i; fp=fpOf(i);
  fpDoor=fp.doors.filter(function(d){return d[0]===0||d[1]===0||d[0]===fp.W-1||d[1]===fp.H-1;})[0]||[fp.W>>1,fp.H-1];
  mode='int'; px=fpDoor[0]; py=Math.max(0,Math.min(fp.H-1,fpDoor[1]-1)); if(!passInt(px,py)){px=fpDoor[0];py=fpDoor[1];}
  refreshHUD(); }

function drawPerson(X,Y,CELL,a){
  var o=a.outfit||{}; var topC=o.base?o.base.hex:'#8a8274', legC=o.legs?o.legs.hex:'#4a4a52';
  var u=CELL/8;
  if(o.outer) topC=o.outer.hex;                            // a coat covers the shirt at this scale
  ctx.fillStyle=legC; ctx.fillRect(X+2.6*u,Y+4.6*u,2.8*u,2.9*u);      // legs
  ctx.fillStyle=topC; ctx.fillRect(X+2.1*u,Y+2.2*u,3.8*u,2.7*u);      // torso
  ctx.fillStyle=o.head?o.head.hex:SKIN;                                // head (hat if worn)
  ctx.beginPath(); ctx.arc(X+4*u,Y+1.6*u,1.35*u,0,7); ctx.fill();
  if(!o.head){} else { ctx.fillStyle=SKIN; ctx.fillRect(X+3.3*u,Y+1.8*u,1.4*u,0.7*u); }  // face under the hat
  if(o.feet){ ctx.fillStyle=o.feet.hex; ctx.fillRect(X+2.6*u,Y+7.2*u,2.8*u,0.7*u); }
  if(selAgent===a){ ctx.strokeStyle='#ffd76a'; ctx.lineWidth=2; ctx.strokeRect(X+1,Y+1,CELL-2,CELL-2); }
}
function draw(){
  var gw=mode==='ext'?W:fp.W, gh=mode==='ext'?H:fp.H;
  var CELL=Math.max(6,Math.floor(Math.min(cv.width/28, cv.height/28)));
  var halfW=Math.floor(cv.width/CELL/2), halfH=Math.floor(cv.height/CELL/2);
  lastView={CELL:CELL,halfW:halfW,halfH:halfH};
  ctx.fillStyle=SUN?'#c9c2ae':'#12140f'; ctx.fillRect(0,0,cv.width,cv.height);
  var occDraw={};
  if(mode==='ext') sim.outAgents().forEach(function(a){ occDraw[a.loc.x+','+a.loc.y]=a; });
  for(var sy=-halfH;sy<=halfH;sy++)for(var sx=-halfW;sx<=halfW;sx++){
    var gx=px+sx, gy=py+sy; if(gx<0||gy<0||gx>=gw||gy>=gh)continue;
    var col;
    if(mode==='ext'){ var c=G[gy][gx]; col=(c===0)?gcol(gx,gy):(EXTCOL[c]||'#463f30');
      if(doorOf[gx+','+gy]!=null)col='#f0cd78'; }
    else { var ic=fp.grid[gy][gx]; col= ic.g==='wall'?'#2c2824' : ic.g==='door'?'#f0cd78' : (INT_ROLE[ic.role]||'#96917d'); }
    var X=(sx+halfW)*CELL, Y=(sy+halfH)*CELL;
    ctx.fillStyle=col; ctx.fillRect(X,Y,CELL-1,CELL-1);
    if(mode==='ext'&&occDraw[gx+','+gy]) drawPerson(X,Y,CELL,occDraw[gx+','+gy]);
  }
  if(mode==='int'){  // the household, standing in their rooms
    sim.inHouse(curHouse).forEach(function(a,k){
      var b=BohemiaAgents.whereAt(a,sim.turn);
      var sp=(b.act==='sleep')?a._bedSpot:a._commonSpot;
      var gx=sp[0]+(k%2), gy=sp[1];
      if(gx>=fp.W)gx=sp[0];
      var X=(gx-px+halfW)*CELL, Y=(gy-py+halfH)*CELL;
      if(X>=-CELL&&Y>=-CELL&&X<cv.width&&Y<cv.height) drawPerson(X,Y,CELL,a);
    });
  }
  // the player
  var pxs=halfW*CELL, pys=halfH*CELL;
  ctx.fillStyle='#ff5a3c'; ctx.beginPath(); ctx.arc(pxs+CELL/2,pys+CELL/2,CELL*0.38,0,7); ctx.fill();
  ctx.strokeStyle='#12140f'; ctx.lineWidth=2; ctx.stroke();
  // day/night ambient wash (the daycycle module, real curve) - skipped in SUN mode
  if(!SUN){ var amb=BOH_DAYCYCLE.ambientAt(BohemiaAgents.dayFrac(sim.turn));
    var dark=1-((amb[0]+amb[1]+amb[2])/48);
    if(dark>0.02){ ctx.fillStyle='rgba(8,10,20,'+(dark*0.55).toFixed(2)+')'; ctx.fillRect(0,0,cv.width,cv.height); } }
}
function counts(){ var inN=0,outN=0,away=0,asleep=0;
  agents.forEach(function(a){ var b=BohemiaAgents.whereAt(a,sim.turn);
    if(a.loc.mode==='in'){inN++; if(b.act==='sleep')asleep++;}
    else if(a.loc.mode==='out')outN++; else away++; });
  return {inN:inN,outN:outN,away:away,asleep:asleep}; }
var ROLE_WORD={worker:'works out the gate', scav:'scavenges the block', keeper:'keeps the house', watch:'walks the block at dusk'};
function refreshHUD(){
  var t=sim.tod(), cs=counts();
  CLOCK.textContent='DAY '+day+' - '+BohemiaAgents.fmt(t)+(BOH_DAYCYCLE.isNightish(t/1440)?' ☾':' ☀');
  if(mode==='ext') HUD.innerHTML=agents.length+' people left, in '+livedN+' of '+feet.length+' houses. The rest stand empty. '+cs.asleep+' asleep · '+(cs.inN-cs.asleep)+' indoors · '+cs.outN+' outside · '+cs.away+' out of the neighborhood. Tap a person to meet them.';
  else { var hh=sim.inHouse(curHouse).length;
    HUD.innerHTML= LIVED[curHouse]==null
      ? 'INSIDE house #'+(curHouse+1)+' - abandoned. Nobody lives here anymore.'
      : 'INSIDE house #'+(curHouse+1)+' - '+hh+' of the household home right now.'; }
  var ins=document.getElementById('inspect');
  if(selAgent){ var a=selAgent, b=BohemiaAgents.whereAt(a,sim.turn);
    var fit=Object.keys(a.outfit).map(function(l){return a.outfit[l].n;}).join(', ');
    ins.style.display='block';
    ins.innerHTML='<b>'+a.id+'</b> - house #'+(a.home.building+1)+', '+(ROLE_WORD[a.role]||a.role)
      +'<br>now: '+b.act.toUpperCase()
      +'<br>wearing: '+fit
      +'<br><span style="opacity:.55">name + faction: pending Paolo</span>';
  } else ins.style.display='none';
}
function tick(){
  sim.playerAt=(mode==='ext')?[px,py]:null;
  sim.step();
  if(sim.tod()===0) day++;
  refreshHUD(); draw();
}
// WATCH: one world-turn per 120BPM beat (0.5s). x4 = judging speed.
var WATCH=true, SPEED=1, timer=null;
function arm(){ if(timer)clearInterval(timer);
  timer=WATCH?setInterval(tick,500/SPEED):null; }
function move(dx,dy){ var nx=px+dx, ny=py+dy;
  if(mode==='ext'){
    if(doorOf[nx+','+ny]!=null){ backAt=[px,py]; enter(doorOf[nx+','+ny]); draw(); return; }
    if(!passExt(nx,ny))return; px=nx; py=ny;
  } else {
    if((nx===fpDoor[0]&&ny===fpDoor[1]) || (px===fpDoor[0]&&py===fpDoor[1]&&!passInt(nx,ny))){ mode='ext'; if(backAt){px=backAt[0];py=backAt[1];} refreshHUD(); draw(); return; }
    if(!passInt(nx,ny))return; px=nx; py=ny;
  }
  if(!WATCH) tick(); else { refreshHUD(); draw(); }        // STEP mode: I-MOVE-YOU-MOVE
}
document.addEventListener('keydown',function(e){var k=e.key;
  if(k==='ArrowUp'||k==='w')move(0,-1); else if(k==='ArrowDown'||k==='s')move(0,1);
  else if(k==='ArrowLeft'||k==='a')move(-1,0); else if(k==='ArrowRight'||k==='d')move(1,0);
  else return; e.preventDefault();});
['u','d','l','r'].forEach(function(id){var b=document.getElementById('b'+id);
  if(b)b.addEventListener('click',function(){move(id==='l'?-1:0+(id==='r'?1:0), id==='u'?-1:0+(id==='d'?1:0));});});
cv.addEventListener('click',function(e){
  var r2=cv.getBoundingClientRect();
  var CELL=lastView.CELL, gx=px+Math.floor((e.clientX-r2.left)*(cv.width/r2.width)/CELL)-lastView.halfW,
      gy=py+Math.floor((e.clientY-r2.top)*(cv.height/r2.height)/CELL)-lastView.halfH;
  var hit=null;
  if(mode==='ext'){ sim.outAgents().forEach(function(a){ if(a.loc.x===gx&&a.loc.y===gy)hit=a; }); }
  else sim.inHouse(curHouse).forEach(function(a,k){
    var b=BohemiaAgents.whereAt(a,sim.turn); var sp=(b.act==='sleep')?a._bedSpot:a._commonSpot;
    if(sp[0]+(k%2)===gx&&sp[1]===gy)hit=a; });
  selAgent=(hit===selAgent)?null:hit; refreshHUD(); draw();
});
document.getElementById('watch').onclick=function(){ WATCH=!WATCH; this.textContent=WATCH?'⏸ STEP MODE':'▶ WATCH'; arm(); refreshHUD(); };
document.getElementById('speed').onclick=function(){ SPEED=(SPEED===1)?4:1; this.textContent='×'+SPEED; arm(); };
document.getElementById('sunb').onclick=function(){ SUN=!SUN; draw(); };

// ---- JUDGE (verdict workflow; economy parked by Paolo 7/19, not judged) ----
var ASPECTS=[['routines','THE ROUTINES (their different clocks and lives)'],
             ['dress','THE DRESS (canon wardrobe on the people)'],
             ['feel','THE FEEL (does the half-empty block read TRUE?)']];
var verdict={}, jroot=document.getElementById('judge');
ASPECTS.forEach(function(p){ var id=p[0],label=p[1];
  var d=document.createElement('div'); d.style.cssText='margin:6px 0;padding:8px;border:1px solid #444;border-radius:8px';
  d.innerHTML='<div style="font:12px sans-serif;color:#cdbd8a;margin-bottom:4px">'+label+'</div>'
    +'<button data-v="up" style="padding:6px 14px;border-radius:6px">👍</button> '
    +'<button data-v="down" style="padding:6px 14px;border-radius:6px">👎</button> '
    +'<input placeholder="comment..." style="width:55%;padding:6px;border-radius:6px;background:#111;color:#ddd;border:1px solid #555">';
  d.querySelectorAll('button').forEach(function(b){ b.onclick=function(){
    verdict[id]=b.dataset.v; d.querySelectorAll('button').forEach(function(b2){b2.style.background='';});
    b.style.background=b.dataset.v==='up'?'#3f8c3f':'#8c3f3f'; }; });
  d.querySelector('input').oninput=function(){ verdict[id+'_c']=this.value; };
  jroot.appendChild(d);
});
function exportTxt(){
  var l=['=== BOHEMIA LIFE VERDICT (the block, alive) ==='];
  ASPECTS.forEach(function(p){ l.push(p[1]+': '+((verdict[p[0]]||'--').toUpperCase()));
    if(verdict[p[0]+'_c']) l.push('  comment: '+verdict[p[0]+'_c']); });
  l.push('--- PAOLO COMMENTS ---');
  l.push(document.getElementById('global').value||'(none)');
  var txt=l.join('\n');
  if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(txt).catch(function(){}); }
  var b=new Blob([txt],{type:'text/plain'});var a=document.createElement('a');
  a.href=URL.createObjectURL(b);a.download='BOHEMIA_LIFE_VERDICT.txt';a.click();
}
document.getElementById('exp').onclick=exportTxt;

function fit(){ cv.width=cv.clientWidth; cv.height=cv.clientHeight; draw(); }
window.addEventListener('resize',fit);
// warm the day to morning so the first look is ALIVE, not a sleeping block
for(var wt=0;wt<150;wt++){ sim.step(); }
window.__LIFE_TICK=function(n){ for(var i2=0;i2<n;i2++)tick(); };
refreshHUD(); fit(); arm();
window.__LIFE_READY=true;
"""

HTML = """<h1 style="font:600 15px/1.35 -apple-system,sans-serif;color:#c9b98a;margin:8px 10px">BOHEMIA - LIFE: the block, half-dead. Most houses stand empty. The people who stayed live on their own clocks: some work out the gate, some scavenge, some barely leave the house. WATCH = a day in 12 minutes. STEP = it only moves when you move. Tap anyone to meet them; walk into any house.</h1>
<div id="clock" style="font:700 16px monospace;color:#f0cd78;padding:0 10px"></div>
<div id="hud" style="font:13px -apple-system,sans-serif;color:#a99;padding:2px 10px 6px"></div>
<div style="display:flex;gap:8px;padding:0 10px 8px;flex-wrap:wrap">
  <button id="watch" style="padding:8px 12px;border-radius:8px">⏸ STEP MODE</button>
  <button id="speed" style="padding:8px 12px;border-radius:8px">×1</button>
  <button id="sunb" style="padding:8px 12px;border-radius:8px">☀ SUN MODE</button>
  <button id="exp" style="padding:8px 12px;border-radius:8px;background:#3f8c3f;color:#fff;border:0">⤓ EXPORT .txt</button>
</div>
<div style="padding:0 10px"><canvas id="cv" style="width:100%;height:52vh;background:#12140f;border-radius:8px;display:block"></canvas></div>
<div id="inspect" style="display:none;font:12px monospace;color:#cdc4a8;background:#1a1c16;border:1px solid #444;border-radius:8px;margin:8px 10px;padding:8px"></div>
<div style="display:flex;justify-content:center;gap:8px;margin-top:8px;user-select:none">
  <button id="bl" style="width:64px;height:56px;font-size:22px">◀</button>
  <div style="display:flex;flex-direction:column;gap:8px">
    <button id="bu" style="width:64px;height:56px;font-size:22px">▲</button>
    <button id="bd" style="width:64px;height:56px;font-size:22px">▼</button>
  </div>
  <button id="br" style="width:64px;height:56px;font-size:22px">▶</button>
</div>
<div id="judge" style="margin:0 10px"></div>
<div style="padding:10px">
  <div style="font:12px sans-serif;color:#8f8770;margin-bottom:4px">PAOLO COMMENTS (rides the export):</div>
  <textarea id="global" style="width:100%;height:70px;border-radius:8px;padding:8px;background:#111;color:#ddd;border:1px solid #888" placeholder="anything about the living block..."></textarea>
</div>
<script>
__BANK__
__ENGINE__
__GAME__
</script>
"""
HTML = HTML.replace('__BANK__', BANK_JS).replace('__ENGINE__', engine).replace('__GAME__', GAME)
open(OUT, 'w', encoding='utf8').write(HTML)
shutil.copyfile(OUT, CUR)
print('life slice -> %s + %s (%d KB)' % (OUT, CUR, len(HTML) // 1024))
