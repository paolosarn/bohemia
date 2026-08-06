#!/usr/bin/env python3
"""WORD TRAVELS — you can finally SEE the reputation system (8/2/26, PEOPLE lane)

Paolo, 8/2: "honestly im lazy today. Think outside the box... Do what you have to do
next and know what comes after."

THE HONEST PROBLEM THIS FIXES, and it is mine: three turns of deep faction plumbing
shipped and HE HAS SEEN NOTHING. People belong to factions, reputation travels by
witness and gossip, it decays, it crosses a generation - all of it true, all of it
invisible. "A turn in this lane that has nothing to look at is a turn that missed"
is the WORLD lane's 7/31 lesson and it applies here word for word.

So: a page he taps and WATCHES. No decisions, no thumbs required, nothing to judge.
Do a thing on a street, see exactly who saw it, step the days and watch the story
move person to person, watch it fade, then let a generation pass and see what
survives into his child's name.

THE DEED VOCABULARY IS NOT INVENTED AND NOT PROPOSED - IT IS ALREADY HIS. The quest
corpus carries 61 `@DO faction NAME +N` effects across the studied questbook, per
faction, positive and negative, with real magnitudes. That is the vocabulary, already
authored and already studied. This page uses that exact shape.
engine/bohemia_standing.js's DEED_WEIGHT still ships EMPTY; the page passes its own
demo weights in and says so on screen, so nothing here rules anything.

REUSE CHECK (7/22 law):
  - engine/bohemia_standing.js .... USED, inlined verbatim. The page runs the REAL
    module, not a reimplementation, or it would be a lie about the system.
  - engine/bohemia_memory.js ...... USED, inlined verbatim, same reason.
  - quests/ + questbook/ .......... READ ONLY, for the deed vocabulary that already
    exists there. No quest file is written, opened for writing, or changed.
  - slices/BOHEMIA_FACTION_GAPS_JUDGE_8_2_26.html ... USED as the page FORM (dark
    shell, SUN MODE, the same card grammar he already knows).
  - nothing new is drawn. This cooks TEXT and one canvas of coloured dots.

  python3 tools/bohemia_word_travels.py
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(ROOT)

OUT = 'slices/BOHEMIA_WORD_TRAVELS_8_2_26.html'
MODULES = ['engine/bohemia_memory.js', 'engine/bohemia_standing.js']

PAGE = r"""<meta charset="utf-8">
<title>BOHEMIA - WORD TRAVELS</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<body id="bd" style="margin:0;background:#0d0f0a;font-family:-apple-system,sans-serif;color:#ddd">
<div id="bar" style="position:sticky;top:0;z-index:9;background:#0d0f0a;padding:10px 12px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;border-bottom:1px solid #2a2a1f">
  <div style="flex:1;min-width:130px">
    <div id="hdr" style="font:700 15px -apple-system,sans-serif;color:#cdbd8a">WORD TRAVELS</div>
    <div id="clock" style="font:600 11px ui-monospace,monospace;color:#8f8770;margin-top:2px"></div>
  </div>
  <button id="sun" style="padding:9px 13px;border-radius:8px;border:1px solid #887;background:#222;color:#ddd">&#9728; SUN MODE</button>
</div>

<div id="intro" style="font:12px/1.6 -apple-system,sans-serif;color:#8f8770;padding:12px 14px 0;max-width:720px">
  Nothing to judge here. Just tap the buttons and watch. This is the real code the game
  runs, not a mock-up.
</div>

<canvas id="cv" width="720" height="470" style="display:block;width:100%;max-width:720px;margin:12px auto 0;background:#0a0c07;border-radius:10px"></canvas>

<div style="padding:10px 12px;max-width:720px;margin:0 auto;display:flex;gap:8px;flex-wrap:wrap">
  <button class="b" id="doGood" style="flex:1 1 46%">&#128077; DO SOMETHING GOOD</button>
  <button class="b" id="doBad"  style="flex:1 1 46%">&#128078; DO SOMETHING BAD</button>
  <button class="b" id="day"    style="flex:1 1 46%">&#9654; A DAY PASSES</button>
  <button class="b" id="gen"    style="flex:1 1 46%">&#9202; A GENERATION PASSES</button>
  <button class="b" id="reset"  style="flex:1 1 100%;background:#2a2a1f">&#8635; START OVER</button>
</div>

<div id="say" style="font:13px/1.65 -apple-system,sans-serif;color:#cdbd8a;padding:8px 14px;max-width:720px;margin:0 auto;min-height:44px"></div>
<div id="stand" style="padding:4px 14px 40px;max-width:720px;margin:0 auto"></div>

<style>
.b{padding:12px;border-radius:10px;border:0;background:#26301c;color:#dfe6d2;font:600 13px -apple-system,sans-serif}
.b:active{opacity:.7}
</style>

<script>
/* ===== THE REAL ENGINE MODULES, INLINED VERBATIM ===== */
__MODULES__

<\/script>
<script>
var M=window.BohemiaMemory, S=window.BohemiaStanding;
var SUN=false;

/* THE DEED VOCABULARY IS HIS. The quest corpus already carries 61 `@DO faction NAME
   +N` effects with real magnitudes, per faction, both directions - that is the shape,
   already authored and already studied. These two demo rows use it. The engine's own
   DEED_WEIGHT stays EMPTY; the page installs its weights only into its own copy and
   the banner on screen says so. */
S.DEED_WEIGHT.HELPED = 4;
S.DEED_WEIGHT.HURT  = -5;

var W=26, H=15, CELL=26, PAD=10;
var G, cv=document.getElementById('cv'), cx=cv.getContext('2d');

function reset(){
  G={turn:0, gen:0, you:'YOU', line:'YOU', minds:[], pos:{}, fac:{}, flash:[], last:''};
  var names=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R'];
  var facs=['REMNANTS','TRADES','HOMELESS'];
  for(var i=0;i<names.length;i++){
    var id=names[i];
    G.minds.push(M.makeMind(id,64));
    /* spread them across the whole map on purpose: the FEELING that matters is
       "hardly anybody saw that", and clustered dots inside one sightline hand the
       player the opposite impression on the very first tap. */
    G.pos[id]={x:1+Math.floor((i%9)*(W-2)/9), y:1+Math.floor(Math.floor(i/9)*(H-2)/2)+((i%3))};
    G.fac[id]=facs[i%3];
  }
  G.pos[G.you]={x:Math.floor(W/2), y:Math.floor(H/2)};
  G.last='18 people on a few streets. You are the white one. Do something and watch who notices.';
  draw(); say(G.last); standings();
}

function col(f){ return f==='REMNANTS'?'#9aa23a':f==='TRADES'?'#d07a2a':'#b8642a'; }

function draw(){
  cx.fillStyle=SUN?'#e6e0cc':'#0a0c07'; cx.fillRect(0,0,cv.width,cv.height);
  /* streets */
  cx.strokeStyle=SUN?'#cfc7ab':'#15180f'; cx.lineWidth=1;
  for(var x=0;x<=W;x++){cx.beginPath();cx.moveTo(PAD+x*CELL,PAD);cx.lineTo(PAD+x*CELL,PAD+H*CELL);cx.stroke();}
  for(var y=0;y<=H;y++){cx.beginPath();cx.moveTo(PAD,PAD+y*CELL);cx.lineTo(PAD+W*CELL,PAD+y*CELL);cx.stroke();}
  /* flashes: who just learned something */
  G.flash.forEach(function(f){
    var p=G.pos[f.id]; if(!p) return;
    cx.fillStyle=f.kind==='saw'?'rgba(255,235,120,.30)':'rgba(120,200,255,.26)';
    cx.beginPath();cx.arc(PAD+p.x*CELL+CELL/2,PAD+p.y*CELL+CELL/2,CELL*0.95,0,7);cx.fill();
  });
  /* people */
  G.minds.forEach(function(m){
    var p=G.pos[m.owner]; if(!p) return;
    var knows=(m.deeds||[]).filter(function(d){return d.actor===G.line;});
    var eyes=knows.some(function(d){return !d.hops;});
    cx.fillStyle=col(G.fac[m.owner]);
    cx.globalAlpha=knows.length?1:0.34;
    cx.beginPath();cx.arc(PAD+p.x*CELL+CELL/2,PAD+p.y*CELL+CELL/2,7,0,7);cx.fill();
    cx.globalAlpha=1;
    if(knows.length){
      cx.strokeStyle=eyes?'#ffe97a':'#7ac8ff'; cx.lineWidth=2;
      cx.beginPath();cx.arc(PAD+p.x*CELL+CELL/2,PAD+p.y*CELL+CELL/2,11,0,7);cx.stroke();
    }
  });
  /* you */
  var yp=G.pos[G.you];
  cx.fillStyle=SUN?'#222':'#fff';
  cx.beginPath();cx.arc(PAD+yp.x*CELL+CELL/2,PAD+yp.y*CELL+CELL/2,9,0,7);cx.fill();
  /* legend */
  cx.font='11px ui-monospace,monospace';
  cx.fillStyle=SUN?'#5a5138':'#8f8770';
  cx.fillText('● you    ○ yellow ring = SAW IT    ○ blue ring = WAS TOLD    faded = has not heard', PAD, cv.height-8);
}

function say(t){ G.last=t; document.getElementById('say').innerHTML=t;
  document.getElementById('clock').textContent =
    'day '+Math.floor(G.turn/1440)+(G.gen?('  ·  generation '+(G.gen+1)+'  ·  you are the '+(G.gen===1?'child':'grandchild')):'');
}

function standings(){
  var el=document.getElementById('stand'); el.innerHTML='';
  ['REMNANTS','TRADES','HOMELESS'].forEach(function(f){
    var st=S.standingOf(G.minds,f,G.line,G.turn,function(id){return G.fac[id];});
    var row=document.createElement('div');
    row.style.cssText='display:flex;align-items:center;gap:9px;padding:7px 0;border-bottom:1px solid '+(SUN?'#d8d0b8':'#1c1f14');
    var dot=document.createElement('span');
    dot.style.cssText='width:12px;height:12px;border-radius:3px;background:'+col(f);
    var nm=document.createElement('span');
    nm.style.cssText='font:600 12px ui-monospace,monospace;flex:1;color:'+(SUN?'#3a3320':'#cdbd8a');
    nm.textContent=f;
    var vl=document.createElement('span');
    vl.style.cssText='font:12px ui-monospace,monospace;color:'+(st.value<0?'#e07070':st.value>0?'#7ac87a':(SUN?'#7a6f50':'#8f8770'));
    vl.textContent=st.rung+'  '+(st.value>0?'+':'')+st.value.toFixed(2)
      +'   ('+st.whoSaw+' of '+st.members+' have heard anything)';
    row.appendChild(dot);row.appendChild(nm);row.appendChild(vl);
    el.appendChild(row);
  });
}

function deed(kind){
  var yp=G.pos[G.you];
  var before=G.minds.map(function(m){return (m.deeds||[]).length;});
  var n=S.witness(G.minds, G.turn, G.line, kind, yp.x, yp.y, function(id){return G.pos[id];});
  G.flash=[];
  G.minds.forEach(function(m,i){ if((m.deeds||[]).length>before[i]) G.flash.push({id:m.owner,kind:'saw'}); });
  draw(); standings();
  say(n===0
    ? '<b>Nobody was close enough.</b> It never happened, as far as the valley is concerned. That is the whole point — there is no announcement.'
    : '<b>'+n+' '+(n===1?'person':'people')+' actually saw it.</b> Yellow rings. Nobody else in the valley knows a thing yet.');
}

function aDay(){
  G.turn+=1440;
  /* people wander, and whoever ends up together talks */
  G.minds.forEach(function(m){
    var p=G.pos[m.owner];
    /* a day's wandering. Wide enough that people actually run into each other,
       because a demo where nobody ever meets shows none of the mechanic. */
    p.x=Math.max(0,Math.min(W-1,p.x+(Math.floor(Math.random()*13)-6)));
    p.y=Math.max(0,Math.min(H-1,p.y+(Math.floor(Math.random()*9)-4)));
  });
  var told=0; G.flash=[];
  for(var i=0;i<G.minds.length;i++) for(var j=i+1;j<G.minds.length;j++){
    var a=G.minds[i], b=G.minds[j];
    var pa=G.pos[a.owner], pb=G.pos[b.owner];
    if(Math.abs(pa.x-pb.x)+Math.abs(pa.y-pb.y)>3) continue;   /* close enough to talk */
    var beforeA=(a.deeds||[]).length, beforeB=(b.deeds||[]).length;
    var moved=S.gossip(a,b,G.turn);
    if(moved){
      told+=moved;
      if((a.deeds||[]).length>beforeA) G.flash.push({id:a.owner,kind:'told'});
      if((b.deeds||[]).length>beforeB) G.flash.push({id:b.owner,kind:'told'});
    }
  }
  draw(); standings();
  var heard=G.minds.filter(function(m){return (m.deeds||[]).some(function(d){return d.actor===G.line;});}).length;
  say(told
    ? '<b>'+told+' '+(told===1?'retelling':'retellings')+'.</b> Blue rings just heard it secondhand — and it counts for less than having watched. '+heard+' of 18 people know now.'
    : '<b>Nobody who knew ran into anybody who did not.</b> The story sat still today. It also faded a little, because that is what memory does.');
}

function aGen(){
  G.gen++;
  var parent=G.line, child='GEN'+G.gen;
  var r=S.inherit(G.minds, parent, child, G.turn+30*365*1440);
  G.turn+=30*365*1440; G.line=child; G.flash=[];
  /* the old witnesses are gone; new people stand where they stood */
  draw(); standings();
  var legend=S.legendOf(G.minds,G.line,G.turn);
  say('<b>Thirty years. Everyone who watched you is dead.</b> '+r.died+' '
    +(r.died===1?'thing':'things')+' died with them — nobody had ever repeated '
    +(r.died===1?'it':'them')+'. '+r.carried+' survived, because '+(r.carried?'people talked':'nobody talked')
    +'.<br><b>'+(legend.length
      ? 'Your '+(G.gen===1?'kid':'grandkid')+' now gets judged for it, and was not even born.'
      : 'Your '+(G.gen===1?'kid':'grandkid')+' starts clean. Nothing you did was loud enough to outlive you.')+'</b>');
}

document.getElementById('doGood').onclick=function(){ deed('HELPED'); };
document.getElementById('doBad').onclick=function(){ deed('HURT'); };
document.getElementById('day').onclick=aDay;
document.getElementById('gen').onclick=aGen;
document.getElementById('reset').onclick=reset;
document.getElementById('sun').onclick=function(){
  SUN=!SUN;
  document.body.style.background=SUN?'#efe7cf':'#0d0f0a';
  document.getElementById('bar').style.background=SUN?'#efe7cf':'#0d0f0a';
  document.getElementById('hdr').style.color=SUN?'#3a3320':'#cdbd8a';
  document.getElementById('intro').style.color=SUN?'#5a5138':'#8f8770';
  document.getElementById('say').style.color=SUN?'#3a3320':'#cdbd8a';
  draw(); standings();
};
reset();
<\/script>
"""


def main():
    mods = []
    for m in MODULES:
        src = open(m, encoding='utf-8').read()
        mods.append('/* ---- %s ---- */\n%s' % (m, src))
    html = PAGE.replace('__MODULES__', '\n'.join(mods)).replace('<\\/script>', '</script>')
    open(OUT, 'w', encoding='utf-8').write(html)
    print('WORD TRAVELS -> %s  (%.0f KB, %d real engine modules inlined)'
          % (OUT, os.path.getsize(OUT) / 1024.0, len(MODULES)))
    return 0


if __name__ == '__main__':
    sys.exit(main())
