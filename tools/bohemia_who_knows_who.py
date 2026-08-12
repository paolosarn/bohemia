#!/usr/bin/env python3
"""BOHEMIA WHO KNOWS WHO -- the valley's people finally know each other (8/12/26, FACTIONS lane)

Paolo, 8/12: "do big brain online research if you need to then execute... Do what
you have to do next and know what comes after."

WHAT CAME AFTER, and I named it myself yesterday. The sixteen introductions
shipped with three of eight earning conditions dead, and all three died of the
same thing: EVERY PERSON IN BOHEMIA WAS AN ISLAND. Four of his sixteen dossiers
ask for a third party and there was no such thing as a third party:

  MOB       "a third person supplies it, and that person is vouching"
  REMNANTS  "you hear another soldier use it before they ever offer it"
  COLORFUL  "you are introduced onward to three people"
  CARAVANS  "a caravanner nobody vouches for"

THE RESEARCH, because he asked for it and because the game's identity is the most
realistic crash simulator that is still fun:

  FELD 1981, THE FOCUSED ORGANIZATION OF SOCIAL TIES (Am. J. Sociology 86:1015).
  Ties are not random and they are not mostly about liking. They form around FOCI
  -- shared settings people are jointly organised around. Homophily is largely an
  OUTPUT of that structure, not an innate preference: the setting puts similar
  people in one room and the room does the rest. The more restrictive the focus,
  the more segregated the network it produces.
  THE PART THAT MADE THIS BUILDABLE TODAY: this engine already stamps exactly
  three foci on every agent and had never used one of them socially --
    HOME     the house seat (bohemia_people.seatOf)
    WORK     the job site the generator scanned off the real overmap
    FACTION  the outfit (bohemia_agents.factionOf)
  So no dice are rolled here that the world had not already rolled.

  DUNBAR'S LAYERS (support clique 5, sympathy group 15, affinity group 50, active
  network 150, scaling ratio ~3). These are CEILINGS, and they are why the graph
  cannot be "everyone in a focus knows everyone" once a focus gets big. Below the
  layer a shared setting really does acquaint everybody; above it the graph thins
  to an expected degree of exactly the layer. Measured on 400 people in one
  faction: average 49.1 ties against a layer of 50.

  VOUCHING IS NOT A FLAG, IT IS A GUARANTEE. In the Russian thieves-in-law a
  candidate is nominated by existing members who act as sponsor and 'crowners',
  and the crowners are GUARANTORS of his reputation; joining the yakuza runs
  through an introduction by an existing member who can vouch for you. A
  stranger's word is not a vouch. So the person who introduces you to a Mob member
  has to be somebody whose NAME YOU ALREADY KNOW and who is IN THAT OUTFIT. That
  is what makes the Mob genuinely closed instead of merely slower.

MECHANISM-MINE / CONTENTS-PAOLO'S: the graph, the layers and the vouch rule are
mechanism. Who lives where, works where and runs with whom is the world's, decided
long before this file existed. Nothing here names anybody or says anything.

REUSE CHECK (7/22 law):
  - engine/bohemia_ties.js ........ OPENED IN CODE and inlined whole. The page runs
    the REAL organ; a judge page that re-implements the system is a lie about it
    (VERIFY ON THE REAL SURFACE, 7/18).
  - engine/bohemia_people.js ...... OPENED IN CODE and inlined, for the identity
    keys and the role words. No name pool is cooked here.
  - engine/bohemia_agents.js ...... OPENED IN CODE and inlined, so the block on the
    page is the REAL generated block with the real jobs and the real allegiance.
  - engine/bohemia_suburb.js ...... OPENED IN CODE and inlined, same reason.
  - engine/bohemia_dress.js ....... OPENED IN CODE, parsed for his 8/2 FACTION_LOOK
    colours. No new palette.
  - slices/BOHEMIA_THE_SIXTEEN_INTRODUCTIONS_8_12_26.html ... COPIED BY HAND, not by
    code: the same dark shell and card grammar he already knows, retyped. No bytes
    of it are opened at build time.
  - nothing is drawn as art. One SVG of dots and lines, plus text.

  python3 tools/bohemia_who_knows_who.py

Writes: slices/BOHEMIA_WHO_KNOWS_WHO_8_12_26.html

Law:  laws/BOHEMIA_ADDENDUM_WHO_KNOWS_WHO_8_12_26.md
Gate: gates/ties_gate.js
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
OUT = os.path.join(ROOT, 'slices', 'BOHEMIA_WHO_KNOWS_WHO_8_12_26.html')
# bohemia_suburb refuses to load without the district kit (it builds on it), and
# bohemia_agents reaches for the population dial. Canonical order, same as the
# alpha's own embed order -- a page that loads them in a convenient order is not
# running what the game runs.
MODULES = ['bohemia_district_kit', 'bohemia_suburb', 'bohemia_population',
           'bohemia_people', 'bohemia_agents', 'bohemia_ties']


def read(rel):
    p = os.path.join(ROOT, rel)
    if not os.path.exists(p):
        sys.exit('MISSING: ' + rel)
    with open(p, 'r', encoding='utf-8') as f:
        return f.read()


def faction_look():
    """his 8/2 colours, parsed out of the dress module rather than retyped."""
    src = read('engine/bohemia_dress.js')
    out = {}
    for m in re.finditer(r"([A-Z_]+)\s*:\s*\{[^}]*color\s*:\s*'(#[0-9a-fA-F]{3,8})'", src):
        out[m.group(1)] = m.group(2)
    return out


PAGE = r'''<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>WHO KNOWS WHO</title>
<style>
:root{--bg:#0d0b09;--ink:#e9e2d2;--dim:#8b8272;--line:#2a251d;--card:#161310;--hot:#cdbd8a}
body.sun{--bg:#efe9dc;--ink:#1a1712;--dim:#5d564a;--line:#c9c0ac;--card:#fdfaf2;--hot:#6b5a24}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);
 font:14px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;-webkit-text-size-adjust:100%}
header{position:sticky;top:0;z-index:9;background:var(--bg);border-bottom:1px solid var(--line);
 padding:14px 14px 10px}
h1{margin:0;font-size:16px;letter-spacing:.09em}
.sub{color:var(--dim);font-size:11.5px;margin-top:5px;line-height:1.45}
.bar{display:flex;gap:7px;margin-top:10px;flex-wrap:wrap}
button{font:inherit;font-size:11px;letter-spacing:.06em;background:var(--card);color:var(--ink);
 border:1px solid var(--line);border-radius:7px;padding:7px 11px}
button.on{background:var(--hot);color:var(--bg);border-color:var(--hot)}
main{padding:12px 12px 60px;max-width:760px;margin:0 auto}
h2{font-size:12px;letter-spacing:.1em;color:var(--hot);margin:22px 0 8px}
.c{background:var(--card);border:1px solid var(--line);border-radius:11px;padding:13px;margin:11px 0}
.note{color:var(--dim);font-size:11.5px;line-height:1.55;margin:8px 0 0}
svg{width:100%;height:auto;display:block;touch-action:manipulation}
.key{display:flex;gap:12px;flex-wrap:wrap;margin:9px 0 0;font-size:10.5px;color:var(--dim)}
.key i{display:inline-block;width:16px;height:2px;vertical-align:3px;margin-right:5px}
.who{font-weight:700;letter-spacing:.06em;font-size:12.5px}
.row{display:flex;gap:9px;padding:5px 0;border-top:1px solid var(--line);font-size:11.5px}
.row:first-of-type{border-top:0}
.row .k{flex:none;width:96px;color:var(--dim);letter-spacing:.05em}
.row .v{flex:1}
.tag{font-size:9.5px;letter-spacing:.07em;border:1px solid var(--line);border-radius:5px;
 padding:2px 5px;color:var(--dim);margin-right:4px;display:inline-block}
.big{font:700 25px ui-monospace,monospace;color:var(--hot);letter-spacing:.03em}
.step{display:flex;gap:9px;margin:8px 0;align-items:flex-start}
.n{flex:none;width:17px;height:17px;border-radius:5px;background:var(--line);color:var(--ink);
 font-size:10px;display:flex;align-items:center;justify-content:center;margin-top:2px}
.no{color:var(--dim)}
.yes{color:var(--hot);font-weight:700}
table{width:100%;border-collapse:collapse;font-size:11.5px;margin-top:6px}
td,th{text-align:left;padding:4px 6px;border-top:1px solid var(--line)}
th{color:var(--dim);font-weight:400;font-size:10px;letter-spacing:.07em;border-top:0}
.foot{color:var(--dim);font-size:11px;padding:16px 2px;line-height:1.6}
</style></head><body>
<header>
<h1>WHO KNOWS WHO</h1>
<div class="sub">Until today every person in the valley was an island, which is why four of your
sixteen introductions could never finish: the Mob needs somebody to vouch, the Remnants need you
to overhear another soldier, the Colorful introduce you onward. Now people know each other, out
of three things the world had already decided about them. <b>Nothing to judge.</b></div>
<div class="bar"><button id="sun">SUN MODE</button><button id="reroll">ANOTHER BLOCK</button></div>
</header>
<main id="m"></main>
<script>
__ENGINE__
var LOOK=__LOOK__;
var VIA_COL={home:'#d98a6a',work:'#7fa8c9',faction:'#cdbd8a'};
var SEEDS=[12345,777,90210,4242,1861,99, 20260812];
var SI=0;
function esc(s){ return String(s==null?'':s).replace(/[&<>]/g,function(c){
  return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c]; }); }

/* THE REAL BLOCK. Same generator the game runs, same agents, same allegiance --
   this is not a diagram of the system, it is the system. */
function block(seed){
  var cell=[40,40];
  var r=BohemiaSuburb.generate(seed,{cw:1,ch:1,streets:['S']});
  var feet=BohemiaSuburb.homeFootprints({g:r.g,W:r.W,H:r.H});
  var jobs=[{district:'commercial',dir:'N',dist:2},{district:'industrial',dir:'E',dist:1},
            {district:'farm',dir:'W',dist:3}];
  var bases=[{name:'MOB',x:41,y:41},{name:'TRADES',x:38,y:44},{name:'CHURCH',x:44,y:39},
             {name:'REMNANTS',x:37,y:38}];
  var ag=BohemiaAgents.agentsForBlock(seed,feet,jobs,null,
        {households:7, cell:cell, factionBases:bases, preDialled:true});
  var keyOf=function(a){ return BohemiaPeople.keyOf(seed,a); };
  return {seed:seed, cell:cell, roster:ag, keyOf:keyOf};
}

function graph(B){
  var R=B.roster, K=B.keyOf, N=R.length;
  var W=340, H=250, cx=W/2, cy=H/2, rad=Math.min(cx,cy)-48;
  var pos={};
  R.forEach(function(a,i){
    var t=(i/N)*Math.PI*2 - Math.PI/2;
    pos[K(a)]={x:cx+Math.cos(t)*rad, y:cy+Math.sin(t)*rad, a:a};
  });
  var seen={}, lines=[];
  R.forEach(function(a){
    BohemiaTies.tiesOf(K(a),R,B.cell,K).forEach(function(t){
      var lo=K(a)<t.key?K(a):t.key, hi=K(a)<t.key?t.key:K(a);
      if(seen[lo+'|'+hi]) return; seen[lo+'|'+hi]=1;
      lines.push({a:pos[lo], b:pos[hi], via:t.via});
    });
  });
  var s='<svg viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg">';
  lines.forEach(function(l){
    if(!l.a||!l.b) return;
    s+='<line x1="'+l.a.x.toFixed(1)+'" y1="'+l.a.y.toFixed(1)+'" x2="'+l.b.x.toFixed(1)
      +'" y2="'+l.b.y.toFixed(1)+'" stroke="'+VIA_COL[l.via]+'" stroke-width="'
      +(l.via==='home'?1.9:l.via==='work'?1.1:0.8)+'" opacity="'+(l.via==='home'?0.9:0.55)+'"/>';
  });
  R.forEach(function(a){
    var p=pos[B.keyOf(a)]; if(!p) return;
    var col=(a.faction&&LOOK[String(a.faction).toUpperCase()])||'#6e675a';
    s+='<circle cx="'+p.x.toFixed(1)+'" cy="'+p.y.toFixed(1)+'" r="5.5" fill="'+col
      +'" stroke="#0d0b09" stroke-width="1"/>';
    /* push the label AWAY from the middle of the ring, or the left arc stacks its
       labels on top of its own dots. */
    var ox=(p.x-cx)/rad, oy=(p.y-cy)/rad;
    s+='<text x="'+(p.x+ox*13).toFixed(1)+'" y="'+(p.y+oy*13+2.6).toFixed(1)+'" font-size="7.5"'
      +' fill="#8b8272" text-anchor="'+(ox<-0.3?'end':ox>0.3?'start':'middle')+'"'
      +' font-family="ui-monospace,monospace">'+esc(a.id)+'</text>';
  });
  return s+'</svg>';
}

function people(B){
  var R=B.roster, K=B.keyOf;
  return R.map(function(a){
    var f=BohemiaTies.fociOf(a,B.cell);
    var ties=BohemiaTies.tiesOf(K(a),R,B.cell,K);
    var col=(a.faction&&LOOK[String(a.faction).toUpperCase()])||'#6e675a';
    var h='<div class="c"><div class="who"><span style="color:'+col+'">&#9632;</span> '+esc(a.id)
      +(a.faction?(' <span class="tag">'+esc(String(a.faction).toUpperCase())+'</span>'):'')+'</div>';
    h+='<div class="row"><div class="k">SHARES</div><div class="v">'
      + (f.home?'<span class="tag">A ROOF</span>':'')
      + (f.work?'<span class="tag">A JOB SITE</span>':'<span class="tag">SCAVENGES ALONE</span>')
      + (f.faction?'<span class="tag">AN OUTFIT</span>':'')+'</div></div>';
    if(!ties.length){
      h+='<div class="row"><div class="k">KNOWS</div><div class="v no">NOBODY. Lives alone, works alone, runs with nobody.</div></div>';
    } else {
      h+='<div class="row"><div class="k">KNOWS</div><div class="v">'+ties.length
        +(ties.length===1?' PERSON':' PEOPLE')+'</div></div>';
      ties.slice(0,6).forEach(function(t){
        var who=R.filter(function(x){ return K(x)===t.key; })[0];
        h+='<div class="row"><div class="k" style="color:'+VIA_COL[t.via]+'">'
          +esc(BohemiaTies.viaWords(t.via))+'</div><div class="v">'+esc(who?who.id:'?')+'</div></div>';
      });
      if(ties.length>6) h+='<div class="note">and '+(ties.length-6)+' more.</div>';
    }
    return h+'</div>';
  }).join('');
}

/* THE VOUCH, played out on this block: a closed outfit you cannot talk your way
   into. Runs the real bohemia_ties.vouchFor at each step. */
function vouch(B){
  var R=B.roster, K=B.keyOf;
  var byF={}; R.forEach(function(a){ if(a.faction) (byF[a.faction]=byF[a.faction]||[]).push(a); });
  /* THE MOB IS THE FACTION THIS RULE IS WRITTEN FOR, so demo it on the Mob when the
     Mob is here. Showing the Mob's own sentence over a Church member was the first
     version of this card and it read as though the rule had been misfiled. */
  var pick=null, isMob=false;
  if(byF['MOB'] && byF['MOB'].length>=2){ pick=byF['MOB']; isMob=true; }
  Object.keys(byF).sort().forEach(function(f){ if(!pick && byF[f].length>=2) pick=byF[f]; });
  if(!pick){
    return '<div class="c"><div class="who">THE VOUCH</div><div class="note">On this block no '
      +'outfit has two members, so nobody here can vouch for anybody. That is the correct answer '
      +'and it is the whole point: a closed faction stays closed until you know somebody inside. '
      +'Tap ANOTHER BLOCK.</div></div>';
  }
  var stranger=K(pick[0]), insider=K(pick[1]);
  var outsider=null;
  BohemiaTies.tiesOf(stranger,R,B.cell,K).forEach(function(t){
    var w=R.filter(function(x){return K(x)===t.key;})[0];
    if(!outsider && w && String(w.faction||'')!==String(pick[0].faction)) outsider=t.key;
  });
  function tryIt(known){ return BohemiaTies.vouchFor(stranger,R,B.cell,{keyOf:K,known:known}); }
  var steps=[
    ['You know nobody on the block.', tryIt({})],
    ['You know somebody who is tied to them, but is NOT in the outfit.',
      outsider?tryIt((function(o){var m={};m[o]=1;return m;})(outsider)):null],
    ['You know somebody who IS in the outfit.', tryIt((function(){var m={};m[insider]=1;return m;})())]
  ];
  var h='<div class="c"><div class="who">THE VOUCH &mdash; '+esc(String(pick[0].faction).toUpperCase())
    +' '+esc(pick[0].id)+'</div>'
    +'<div class="note">'
    +(isMob?'':'The Mob has nobody on this block, so here is their rule running on the outfit that '
            +'does. ')
    +'Your Mob dossier: <i>"a third person supplies it, and that person is '
    +'vouching."</i> In the real thing the sponsor is a GUARANTOR, so the word of a stranger is '
    +'worth nothing. Watch what does and does not open the door.</div>';
  steps.forEach(function(s,i){
    if(s[1]===null && i===1){ h+='<div class="step"><div class="n">'+(i+1)+'</div><div>'+esc(s[0])
      +'<br><span class="no">nobody like that on this block.</span></div></div>'; return; }
    h+='<div class="step"><div class="n">'+(i+1)+'</div><div>'+esc(s[0])+'<br>'
      +(s[1]?('<span class="yes">INTRODUCED &mdash; '+esc(BohemiaTies.viaWords(s[1].via))+'</span>')
            :'<span class="no">STILL A STRANGER.</span>')+'</div></div>';
  });
  return h+'</div>';
}

/* DUNBAR, MEASURED. Not a claim about the ceiling -- the ceiling, counted. */
function dunbar(){
  var rows=[];
  [{n:8,f:'faction'},{n:60,f:'faction'},{n:150,f:'faction'},{n:400,f:'faction'}].forEach(function(c){
    var R=[]; for(var i=0;i<c.n;i++) R.push({id:'H'+i+'-1', seed:i*2654435761, faction:'MOB', job:null});
    var kb=function(a){ return a.id; };
    var d=BohemiaTies.degrees(R,[0,0],kb);
    var v=Object.keys(d).map(function(k){ return d[k]; });
    var avg=v.reduce(function(s,x){return s+x;},0)/v.length;
    rows.push([c.n, avg.toFixed(1), Math.min.apply(null,v), Math.max.apply(null,v)]);
  });
  var h='<div class="c"><div class="who">THE CEILING IS REAL</div>'
    +'<div class="note">Dunbar\'s layers are limits on how many people one person can actually '
    +'hold: 5 in the support clique, 15 in the sympathy group, 50 in the affinity group, 150 in '
    +'the active network. A small shared setting really does acquaint everybody. A big one cannot, '
    +'or 300 survivors would all know all 300. Put N people in ONE outfit and count what they end '
    +'up holding:</div>'
    +'<table><tr><th>IN THE OUTFIT</th><th>AVG THEY KNOW</th><th>FEWEST</th><th>MOST</th></tr>';
  rows.forEach(function(r){ h+='<tr><td>'+r[0]+'</td><td class="yes">'+r[1]+'</td><td>'+r[2]
    +'</td><td>'+r[3]+'</td></tr>'; });
  return h+'</table><div class="note">The affinity layer is 50. It stops binding the moment the '
    +'outfit is smaller than it, and it holds hard when the outfit is bigger.</div></div>';
}

function draw(){
  var B=block(SEEDS[SI%SEEDS.length]);
  var R=B.roster, K=B.keyOf;
  var deg=BohemiaTies.degrees(R,B.cell,K);
  var vals=Object.keys(deg).map(function(k){return deg[k];});
  var avg=vals.length?(vals.reduce(function(s,v){return s+v;},0)/vals.length):0;
  var alone=vals.filter(function(v){return v===0;}).length;
  document.getElementById('m').innerHTML =
    '<h2>ONE REAL BLOCK &middot; SEED '+B.seed+'</h2>'
    +'<div class="c">'+graph(B)
    +'<div class="key"><span><i style="background:'+VIA_COL.home+'"></i>SHARE A ROOF</span>'
    +'<span><i style="background:'+VIA_COL.work+'"></i>WORK THE SAME PLACE</span>'
    +'<span><i style="background:'+VIA_COL.faction+'"></i>RUN WITH THE SAME OUTFIT</span></div>'
    +'<div class="note">'+R.length+' people. Each one knows <span class="big">'+avg.toFixed(1)
    +'</span> others on average'+(alone?(', and '+alone+' know nobody at all'):'')
    +'. The dot colour is the outfit, in your 8/2 palette. Nothing here was invented: the houses, '
    +'the jobs and the allegiances were all decided by the world before this page opened them.</div>'
    +'</div>'
    + vouch(B)
    +'<h2>EVERY PERSON ON THE BLOCK</h2>'
    + people(B)
    +'<h2>THE MATH HOLDS</h2>'
    + dunbar()
    +'<div class="foot">Feld 1981, THE FOCUSED ORGANIZATION OF SOCIAL TIES: ties form around '
    +'shared settings, and similarity is mostly an OUTPUT of that, not the cause. The three '
    +'settings this engine already had on every person were their roof, their job site and their '
    +'outfit, and none of them had ever been used socially. The graph above is the real '
    +'engine/bohemia_ties.js running on the real generated block, not a picture of one.</div>';
}
document.getElementById('sun').addEventListener('click',function(){
  document.body.classList.toggle('sun'); this.classList.toggle('on'); });
document.getElementById('reroll').addEventListener('click',function(){ SI++; draw(); });
draw();
</script></body></html>
'''


def main():
    engine = '\n'.join(
        '/* inlined: engine/%s.js */\n%s' % (m, read('engine/%s.js' % m)) for m in MODULES)
    engine = engine.replace('</script>', '<\\/script>')
    html = (PAGE.replace('__ENGINE__', engine)
                .replace('__LOOK__', json.dumps(faction_look(), ensure_ascii=False)))
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write(html)
    print('WHO KNOWS WHO: %d engine modules inlined -> %s (%d bytes)'
          % (len(MODULES), os.path.relpath(OUT, ROOT), len(html)))


if __name__ == '__main__':
    main()
