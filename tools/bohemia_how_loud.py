#!/usr/bin/env python3
"""BOHEMIA - HOW LOUD YOU WERE. Builds the watchable proof that a deed's VOLUME,
not just its size, decides what a faction ends up thinking of you.

WHAT IT SHOWS, and all of it is his:
  - His quest S17 THE SEED THAT DOES NOT COME BACK, parsed by the real .bq parser,
    all four of its real endings, each with the real faction delta and the real
    clout tag he tagged it with.
  - The same deed at two volumes, so the effect is isolated: identical faction,
    identical magnitude, identical spot, identical crowd. Only the tag differs.
  - Thirty years on: everyone who watched is dead, and what is left is what got
    repeated. The quiet version has almost nobody left telling it.

REUSE CHECK (REUSE-FIRST, Paolo 7/22). What this opened, in code, and used:
  - engine/bohemia_memory.js ...... USED, inlined verbatim. Real minds, real decay.
  - engine/bohemia_standing.js .... USED, inlined verbatim. Real witness/gossip/inherit.
  - engine/bohemia_bq.js .......... USED, inlined verbatim. His real quest parser; this
                                    page does not contain a second copy of the format.
  - engine/bohemia_deeds.js ....... USED, inlined verbatim. The bridge under test.
  - engine/bohemia_loop.js ........ READ, and its CLOUT block EXTRACTED VERBATIM rather
                                    than retyped, because the 7/21 law says those numbers
                                    stay tunable and a second copy would rot. The page
                                    does not inline all 68 KB of the orchestrator (the
                                    8/2 PAYLOAD WALL lesson: ship what the page loads).
                                    deed_bridge_gate.js asserts the shipped numbers still
                                    equal the live table.
  - quests/bq/S17_*.bq ............ READ ONLY, inlined verbatim as the demo content.
  - slices/BOHEMIA_WORD_TRAVELS_8_2_26.html ... its shell reused (sticky bar, SUN MODE,
                                    the dark card grammar he already knows). No new
                                    visual language was cooked.
NOTHING DRAWS ORIGINAL WORLD ART, so the 45 DEGREE ART LAW does not apply: this is a
data view of a simulation, in the same register as the existing WORD TRAVELS page.

  python3 tools/bohemia_how_loud.py
"""
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(ROOT)

OUT = 'slices/BOHEMIA_HOW_LOUD_8_6_26.html'
MODULES = ['engine/bohemia_memory.js', 'engine/bohemia_standing.js',
           'engine/bohemia_bq.js', 'engine/bohemia_deeds.js']
QUEST = 'quests/bq/S17_THE_SEED_THAT_DOES_NOT_COME_BACK.bq'
LOOP = 'engine/bohemia_loop.js'


def clout_shim():
    """Lift his CLOUT block out of bohemia_loop.js VERBATIM. Not retyped, not
    approximated, and machine-checked afterwards by deed_bridge_gate.js."""
    src = open(LOOP, encoding='utf-8').read()
    grabbed = []
    for pat in (r'const CLOUT_TAGS = \[[^\]]*\];',
                r'const CLOUT_WEIGHTS = \{[^}]*\};',
                r'const CLOUT_NEUTRAL = \d+;'):
        m = re.search(pat, src)
        if not m:
            raise SystemExit('FAILED to lift %s out of %s - the page will not ship a '
                             'guessed copy of his table' % (pat, LOOP))
        grabbed.append(m.group(0))
    return ('(function(root){\n'
            '  /* LIFTED VERBATIM from engine/bohemia_loop.js at build time. This page\n'
            '     does not own these numbers and must never be edited to disagree with\n'
            '     that file - deed_bridge_gate.js fails if it does. */\n  '
            + '\n  '.join(grabbed) + '\n'
            '  function cloutWeight(t){ return CLOUT_WEIGHTS.hasOwnProperty(t)?CLOUT_WEIGHTS[t]:CLOUT_NEUTRAL; }\n'
            '  function cloutTagFrom(tags){ tags=tags||[];\n'
            '    for(var i=0;i<CLOUT_TAGS.length;i++) if(tags.indexOf(CLOUT_TAGS[i])>=0) return CLOUT_TAGS[i];\n'
            '    return null; }\n'
            '  root.BohemiaLoop={CLOUT_TAGS:CLOUT_TAGS,CLOUT_WEIGHTS:CLOUT_WEIGHTS,\n'
            '    CLOUT_NEUTRAL:CLOUT_NEUTRAL,cloutWeight:cloutWeight,cloutTagFrom:cloutTagFrom};\n'
            '})(typeof globalThis!==\'undefined\'?globalThis:this);\n')


PAGE = r"""<meta charset="utf-8">
<title>BOHEMIA - HOW LOUD YOU WERE</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<body id="bd" style="margin:0;background:#0d0f0a;font-family:-apple-system,sans-serif;color:#ddd">
<div id="bar" style="position:sticky;top:0;z-index:9;background:#0d0f0a;padding:10px 12px;display:flex;gap:8px;align-items:center;border-bottom:1px solid #2a2a1f">
  <div style="flex:1;min-width:130px">
    <div id="hdr" style="font:700 15px -apple-system,sans-serif;color:#cdbd8a">HOW LOUD YOU WERE</div>
    <div id="sub" style="font:600 11px ui-monospace,monospace;color:#8f8770;margin-top:2px">nothing to judge &middot; just watch it</div>
  </div>
  <button id="sun" style="padding:9px 13px;border-radius:8px;border:1px solid #887;background:#222;color:#ddd">&#9728; SUN MODE</button>
</div>

<div class="wrap">
  <div class="lede" id="lede">
    Your quests already say how big a deed was <b>and how loud it was</b>. Until now only the
    follower count cared about the loud part &mdash; a faction's opinion moved the same amount
    whether you did it in a back yard or in front of a whole block. It doesn't any more.
  </div>

  <div class="h" id="h1">THE SAME DEED. TWO VOLUMES.</div>
  <div class="cap" id="cap1">Same faction, same size of favour, same spot, same crowd. The only difference is
    how loud you were about it. Watch how many people find out.</div>

  <div class="card">
    <div class="tag" id="tA">&#9679; QUIETLY</div>
    <canvas id="cA" width="700" height="300"></canvas>
    <div class="read" id="rA"></div>
  </div>
  <div class="card">
    <div class="tag hot" id="tB">&#9679; LOUDLY</div>
    <canvas id="cB" width="700" height="300"></canvas>
    <div class="read" id="rB"></div>
  </div>

  <div class="h" id="h2">YOUR QUEST, ALL FOUR WAYS IT CAN END</div>
  <div class="cap" id="cap2">S17 &mdash; <i>The Seed That Does Not Come Back</i>. Your file, your endings, your numbers.
    Nothing here was written for this page.</div>
  <div id="grid"></div>

  <div class="h" id="h3">THIRTY YEARS LATER</div>
  <div class="cap" id="cap3">Everyone who watched you do it is dead. The bar is <b>who they managed to tell</b> before
    they went &mdash; that, and only that, is what your kid gets judged for.</div>
  <div id="gen"></div>

  <div class="foot" id="foot"></div>
  <div style="padding:0 0 40px"><button class="b" id="again">&#8635; RUN IT AGAIN</button></div>
</div>

<style>
.wrap{max-width:720px;margin:0 auto;padding:0 12px}
.lede{font:13px/1.65 -apple-system,sans-serif;color:#9a9480;padding:14px 2px 2px}
.h{font:700 13px -apple-system,sans-serif;color:#cdbd8a;letter-spacing:.06em;margin:26px 0 4px}
.cap{font:12px/1.6 -apple-system,sans-serif;color:#8f8770;margin-bottom:10px}
.card{background:#141609;border:1px solid #2a2a1f;border-radius:12px;padding:10px;margin-bottom:12px}
.tag{font:700 11px ui-monospace,monospace;letter-spacing:.1em;color:#7ac87a;margin-bottom:6px}
.tag.hot{color:#e0a060}
canvas{display:block;width:100%;background:#0a0c07;border-radius:8px}
.read{font:12px/1.7 ui-monospace,monospace;color:#9a9480;margin-top:8px;min-height:60px}
.big{font:700 22px -apple-system,sans-serif;color:#cdbd8a}
.row{display:flex;align-items:baseline;gap:8px;padding:7px 0;border-bottom:1px solid #23241a}
.row:last-child{border-bottom:0}
.q{font:11px/1.55 -apple-system,sans-serif;color:#8f8770;padding:2px 0 8px}
.b{width:100%;padding:13px;border-radius:10px;border:0;background:#26301c;color:#dfe6d2;font:600 13px -apple-system,sans-serif}
.b:active{opacity:.7}
.bar{height:11px;border-radius:3px;background:#6ec06e}
.foot{font:11px/1.7 -apple-system,sans-serif;color:#6f6a58;margin:26px 0 14px;border-top:1px solid #23241a;padding-top:12px}
</style>

<script>
/* ===== THE REAL ENGINE, INLINED VERBATIM ===== */
__MODULES__
/* ===== HIS QUEST, INLINED VERBATIM ===== */
var QUEST_SRC = __QUEST__;

(function(){
var S=BohemiaStanding, M=BohemiaMemory, D=BohemiaDeeds, L=BohemiaLoop;

/* the corpus is one quest here, which is the point: the numbers come out of HIS file */
var CORPUS = D.loadCorpus([{id:'S17', src:QUEST_SRC}]);
var ROWS   = D.scanQuest(QUEST_SRC,'S17');
var TITLE  = (function(){ var m=/^@QUEST\s+\S+\s+(.*)$/m.exec(QUEST_SRC); return m?m[1].trim():'S17'; })();

/* ---- the crowd. A real field of people, not a line. Manhattan distance is what
   witness() actually uses, so the reach is drawn as the DIAMOND it really is. ---- */
/* SIZED SO THE ANSWER IS VISIBLE, and this took a measurement to get right. The first
   version put 323 people in the field, which is a district and not a faction - the loud
   version reached 170 of them and the average still read NEUTRAL, so the headline claim
   was true in the numbers and invisible on the screen. A faction is a group you could
   actually name. At this size the quiet version leaves them NEUTRAL and the loud version
   moves them a whole rung, which is the thing he is meant to see. */
var W=44, H=22, CX=22, CY=11;
function crowd(faction){
  var minds=[],pos={},fac={},k=0;
  /* deterministic scatter - no Math.random, so the picture is the same every time
     he opens it and he can compare two runs honestly */
  for(var y=0;y<H;y+=3) for(var x=(y/3%2?2:0);x<W;x+=4){
    var id='C'+(k++);
    minds.push(M.makeMind(id));
    pos[id]={x:x,y:y}; fac[id]=faction;
  }
  return {minds:minds,pos:pos,fac:fac,where:function(i){return pos[i];},factionOf:function(i){return fac[i];}};
}

var SUN=false;
function P(){ return SUN
  ? {bg:'#efe9d8',dot:'#c3bda6',lit:'#2f7a2f',hot:'#b05a12',ring:'#8a8468',ink:'#3a3320'}
  : {bg:'#0a0c07',dot:'#2c3122',lit:'#7ac87a',hot:'#e0a060',ring:'#4a4a36',ink:'#cdbd8a'}; }

function draw(cv, w, actorId, reach, prog, hot){
  var g=cv.getContext('2d'), p=P();
  var sx=cv.width/W, sy=cv.height/H;
  g.fillStyle=p.bg; g.fillRect(0,0,cv.width,cv.height);
  var r=reach*prog;
  /* the reach diamond, because Manhattan */
  if(prog>0){
    g.strokeStyle=p.ring; g.lineWidth=1.5;
    g.beginPath();
    g.moveTo((CX+r+.5)*sx,(CY+.5)*sy); g.lineTo((CX+.5)*sx,(CY+r+.5)*sy);
    g.lineTo((CX-r+.5)*sx,(CY+.5)*sy); g.lineTo((CX+.5)*sx,(CY-r+.5)*sy);
    g.closePath(); g.stroke();
  }
  for(var i=0;i<w.minds.length;i++){
    var m=w.minds[i], q=w.pos[m.owner];
    var saw=false, heard=false;
    if(m.deeds) for(var j=0;j<m.deeds.length;j++){
      if(m.deeds[j].actor!==actorId) continue;
      if((m.deeds[j].hops||0)>0) heard=true; else saw=true;
    }
    var inside = (Math.abs(q.x-CX)+Math.abs(q.y-CY)) <= r;
    var on = saw && inside;
    var told = heard && prog>=1;
    g.fillStyle = (on||told) ? (hot?p.hot:p.lit) : p.dot;
    g.globalAlpha = on ? 1 : (told?0.5:0.85);
    var rad = on?3.2:2.2;
    g.beginPath(); g.arc((q.x+.5)*sx,(q.y+.5)*sy,rad,0,6.284); g.fill();
    g.globalAlpha=1;
  }
  /* where it happened */
  g.fillStyle=hot?p.hot:p.lit;
  g.beginPath(); g.arc((CX+.5)*sx,(CY+.5)*sy,5,0,6.284); g.fill();
  g.strokeStyle=p.bg; g.lineWidth=2; g.stroke();
}

/* ---- THE HEADLINE: same delta, same faction, two volumes ---- */
var FAC='THEM', DELTA=12;
function runVolume(tag){
  var w=crowd(FAC);
  var kind='same:'+tag;
  S.DEED_WEIGHT[kind]=DELTA/CORPUS.divisor;
  var res=D.publish(w.minds,1000,'YOU',[{faction:FAC,delta:DELTA,clout:tag,kind:kind}],CX,CY,w.where,w.factionOf);
  var st=S.standingOf(w.minds,FAC,'YOU',1000,w.factionOf);
  return {w:w,tag:tag,reach:D.reachOf(tag),hops:D.hopsFor(tag),seen:res.witnesses,st:st};
}

/* ---- THIRTY YEARS: gossip a lifetime, hand over, see what is left ----------
   THIS RUNS IN A DIFFERENT, BIGGER WORLD ON PURPOSE, and getting that wrong is what
   made the first version of this panel lie. The top panel is ONE FACTION - 88 people
   you could name - which is the right frame for "what do they think of me". The
   generational question is about THE WHOLE VALLEY, and it has to be, because the
   thing being measured is whether there was anybody LEFT to tell. Run in the
   faction-sized field, the loudest deed reached 73 of 88 and so had only 15 strangers
   left to hear about it - and the bar chart came out saying a reckless deed is
   forgotten fastest, which is the exact opposite of what the mechanism does. The world
   was too small for the question, not the mechanism wrong. */
var VW=140, VH=44, VCX=70, VCY=22;
function valley(faction){
  var minds=[],pos={},fac={},k=0;
  for(var y=0;y<VH;y+=4) for(var x=(y/4%2?2:0);x<VW;x+=4){
    var id='V'+(k++);
    minds.push(M.makeMind(id));
    pos[id]={x:x,y:y}; fac[id]=faction;
  }
  /* who is near enough to talk to whom, computed ONCE - all-pairs every round would
     be 400^2 x 30 on a phone */
  var near=[];
  for(var i=0;i<minds.length;i++){
    near[i]=[];
    for(var j=i+1;j<minds.length;j++){
      var a=pos[minds[i].owner], b=pos[minds[j].owner];
      if(Math.abs(a.x-b.x)+Math.abs(a.y-b.y)<=5) near[i].push(j);
    }
  }
  return {minds:minds,pos:pos,fac:fac,near:near,
          where:function(i){return pos[i];},factionOf:function(i){return fac[i];}};
}
function runGenerations(tag){
  var w=valley(FAC);
  var kind='gen:'+tag;
  S.DEED_WEIGHT[kind]=CORPUS.maxAbs/CORPUS.divisor;
  var direct=D.publish(w.minds,0,'PARENT',[{faction:FAC,delta:CORPUS.maxAbs,clout:tag,kind:kind}],VCX,VCY,w.where,w.factionOf).witnesses;
  /* a lifetime of people who are near each other talking */
  for(var round=0;round<30;round++)
    for(var i=0;i<w.minds.length;i++)
      for(var n=0;n<w.near[i].length;n++) S.gossip(w.minds[i],w.minds[w.near[i][n]],round*60);
  var T=30*365*24*60;
  var h=S.inherit(w.minds,'PARENT','CHILD',T);
  return {tag:tag,direct:direct,carried:h.carried,died:h.died,pop:w.minds.length};
}

/* ---- render ---- */
var A,B,GEN;
function paintReads(){
  var p=P();
  [[A,'rA','tA','QUIETLY',false],[B,'rB','tB','LOUDLY',true]].forEach(function(e){
    var r=e[0];
    document.getElementById(e[2]).innerHTML='&#9679; '+e[3]+
      ' <span style="opacity:.6">&middot; #'+r.tag+' &middot; carries '+r.reach+' tiles</span>';
    document.getElementById(e[1]).innerHTML=
      '<div class="big" style="color:'+(e[4]?p.hot:p.lit)+'">'+r.seen+' people found out</div>'+
      'out of '+r.w.minds.length+' standing around &middot; retold up to '+r.hops+'x<br>'+
      'they now read <b style="color:'+p.ink+'">'+r.st.rung+'</b> ('+r.st.value.toFixed(2)+')';
  });
}
function paintGrid(){
  var p=P(), h='';
  var byStage={};
  ROWS.forEach(function(r){ (byStage[r.stage]=byStage[r.stage]||[]).push(r); });
  Object.keys(byStage).sort(function(a,b){return a-b;}).forEach(function(sn){
    var rs=byStage[sn], tag=rs[0].clout||'untagged';
    h+='<div class="card" style="padding:10px 12px">';
    h+='<div class="tag" style="color:'+(tag==='reckless'||tag==='risky'?p.hot:p.lit)+'">#'+tag.toUpperCase()
      +' <span style="opacity:.55;letter-spacing:0">carries '+D.reachOf(rs[0].clout)+' tiles &middot; retold '+D.hopsFor(rs[0].clout)+'x</span></div>';
    h+='<div class="q">&ldquo;'+esc(rs[0].label.slice(0,150))+(rs[0].label.length>150?'&hellip;':'')+'&rdquo;</div>';
    rs.forEach(function(r){
      var col=r.delta>0?p.lit:p.hot;
      h+='<div class="row"><span style="flex:1;color:'+p.ink+';font:600 12px ui-monospace,monospace">'+r.faction+'</span>'
       +'<span style="color:'+col+';font:700 12px ui-monospace,monospace">'+(r.delta>0?'+':'')+r.delta+'</span></div>';
    });
    h+='</div>';
  });
  document.getElementById('grid').innerHTML=h;
}
function paintGen(){
  var p=P(), max=0;
  GEN.forEach(function(g){ max=Math.max(max,g.carried); });
  var h='<div class="card">';
  GEN.forEach(function(g){
    var pc=max?Math.round(g.carried/max*100):0;
    h+='<div style="padding:7px 0">'
     +'<div style="display:flex;gap:8px;font:600 11px ui-monospace,monospace;color:'+p.ink+'">'
     +'<span style="flex:1">#'+g.tag+'</span><span style="opacity:.6">'+g.direct+' saw it &middot; all dead now</span></div>'
     +'<div style="display:flex;align-items:center;gap:8px;margin-top:4px">'
     +'<div style="flex:1;background:'+(SUN?'#dcd6c2':'#1c1f14')+';border-radius:3px"><div class="bar" style="width:'+pc+'%;background:'+(g.tag==='reckless'||g.tag==='risky'?p.hot:p.lit)+'"></div></div>'
     +'<span style="font:700 12px ui-monospace,monospace;color:'+p.ink+';width:88px;text-align:right">'+g.carried+' still say it</span>'
     +'</div></div>';
  });
  h+='</div>';
  document.getElementById('gen').innerHTML=h;
}
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function animate(){
  var t0=null, cA=document.getElementById('cA'), cB=document.getElementById('cB');
  function step(ts){
    if(t0===null) t0=ts;
    var e=(ts-t0)/1100;
    var pa=Math.min(1,e), pb=Math.min(1,e);
    draw(cA,A.w,'YOU',A.reach,pa,false);
    draw(cB,B.w,'YOU',B.reach,pb,true);
    if(e<1.02) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function run(){
  A=runVolume('quiet'); B=runVolume('reckless');
  GEN=L.CLOUT_TAGS.map(runGenerations);
  paintReads(); paintGrid(); paintGen(); animate();
  document.getElementById('foot').innerHTML=
    'Real code, not a mock-up: bohemia_standing.js (who saw it, who retold it, what fades), '
    +'bohemia_deeds.js (how far a tag carries), bohemia_bq.js (your quest format). '
    +'Quest: <b>'+esc(TITLE)+'</b> &middot; '+CORPUS.count+' faction deltas read out of it. '
    +'Your clout table, untouched: '+L.CLOUT_TAGS.map(function(t){return t+' '+L.CLOUT_WEIGHTS[t];}).join(' &middot; ')
    +'. An untagged deed still carries exactly '+S.SEE_RANGE+' tiles, same as before.';
}

document.getElementById('again').onclick=function(){ run(); };
document.getElementById('sun').onclick=function(){
  SUN=!SUN; var p=P(), b=document.getElementById('bd');
  b.style.background=SUN?'#efe9d8':'#0d0f0a'; b.style.color=SUN?'#3a3320':'#ddd';
  document.getElementById('bar').style.background=SUN?'#efe9d8':'#0d0f0a';
  document.getElementById('hdr').style.color=SUN?'#3a3320':'#cdbd8a';
  ['lede','cap1','cap2','cap3','sub','foot'].forEach(function(id){
    document.getElementById(id).style.color=SUN?'#6a6350':'#8f8770'; });
  ['h1','h2','h3'].forEach(function(id){ document.getElementById(id).style.color=SUN?'#3a3320':'#cdbd8a'; });
  [].forEach.call(document.querySelectorAll('.card'),function(c){
    c.style.background=SUN?'#e5dfcc':'#141609'; c.style.borderColor=SUN?'#c9c2ab':'#2a2a1f'; });
  run();
};
run();
})();
</script>
"""


def build():
    mods = []
    for m in MODULES:
        mods.append('/* ---- %s ---- */\n%s' % (m, open(m, encoding='utf-8').read()))
    # the clout shim has to load BEFORE bohemia_deeds.js, which reads root.BohemiaLoop
    mods.insert(3, '/* ---- CLOUT table, lifted verbatim from engine/bohemia_loop.js ---- */\n'
                + clout_shim())
    quest = open(QUEST, encoding='utf-8').read()
    html = (PAGE.replace('__MODULES__', '\n'.join(mods))
                .replace('__QUEST__', _jsstr(quest)))
    open(OUT, 'w', encoding='utf-8').write(html)
    print('wrote %s (%.1f KB)' % (OUT, len(html) / 1024.0))


def _jsstr(s):
    """His quest text goes in as a JS string literal, exactly as written."""
    out = (s.replace('\\', '\\\\').replace('"', '\\"')
            .replace('\n', '\\n').replace('\r', '')
            .replace('</', '<\\/'))
    return '"' + out + '"'


if __name__ == '__main__':
    build()
