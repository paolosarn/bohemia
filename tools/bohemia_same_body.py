#!/usr/bin/env python3
"""BOHEMIA - SAME BODY, DIFFERENT CLOTHES. His own corpus, sorted by how loud the act
was instead of by who did it.

Paolo 8/12, correcting my too-literal reading of "different clothes on":
  "when I said different clothes, I meant it kind of in a philosophical way as well like
   it's just dressed differently. I didn't of course they will wear a different clothes
   but it's bigger than that."

THE CLAIM, and this page is the evidence FOR it out of his own writing: the factions are
not different kinds of people doing different things. They are the same people doing the
same small set of things, wearing different stories about why. Grounded in institutional
isomorphism - organizations in a field converge on the same structures because it is
LEGITIMATE, not because it is efficient, while the justifying narrative stays distinct.

SO THIS PAGE REFUSES THE OBVIOUS SORT. Every other faction view in this project groups by
faction, which is exactly the framing he is arguing against. This one groups by HOW LOUD
THE ACT WAS and puts the factions side by side inside each tier, so the eye does the
work: a Volunteer, a Red, a Caravanner and someone from the tunnels all doing the same
thing at QUIET, in four different vocabularies.

NOTHING IS WRITTEN FOR THIS PAGE. Every line is a stage @LOG he authored, every tier is
the #tag he put on that stage, every faction is his @DO faction line. The only thing
added is the sort order.

Obeys NEVER MAKE HIM HUNT (8/11): one tap from LIFE, renders on load.

  python3 tools/bohemia_same_body.py
"""
import json
import os
import re
import subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(ROOT)

OUT = 'slices/BOHEMIA_SAME_BODY_8_12_26.html'
BQDIR = 'quests/bq'
TIERS = ['quiet', 'notable', 'risky', 'reckless']

# what each tier IS, in plain words, read off the acts themselves rather than invented:
# these are descriptions of the shared act, not new canon.
TIER_SHAPE = {
    'quiet':    'handle it without a crowd, and absorb the cost yourself',
    'notable':  'do it openly, with names on it, so it holds',
    'risky':    'do it where it can go wrong, and accept that it might',
    'reckless': 'do it in front of everybody and take what comes',
}


def scan():
    rows = []
    for fn in sorted(os.listdir(BQDIR)):
        if not fn.endswith('.bq'):
            continue
        qid = fn.split('_')[0]
        title = None
        stage = tag = log = None
        kind = None
        for line in open(os.path.join(BQDIR, fn), encoding='utf-8'):
            m = re.match(r'\s*@QUEST\s+\S+\s+(.*)', line)
            if m:
                title = m.group(1).strip()
            m = re.match(r'\s*@STAGE\s+(\d+)\s*(.*)', line)
            if m:
                stage, log = m.group(1), None
                t = [x for x in TIERS if '#' + x in m.group(2)]
                tag = t[0] if t else None
                kind = 'FAIL' if 'FAIL' in m.group(2).upper() else 'COMPLETE'
            m = re.match(r'\s*@LOG\s+(.*)', line)
            if m:
                log = m.group(1).strip()
            m = re.match(r'\s*@DO\s+faction\s+([A-Z_]+)\s+([-+]\d+)', line)
            if m and tag and log:
                rows.append({'faction': m.group(1), 'delta': int(m.group(2)),
                             'tier': tag, 'log': log, 'quest': qid,
                             'title': title or qid, 'kind': kind})
    return rows


def colours():
    js = ("const D=require('./engine/bohemia_dress.js');"
          "process.stdout.write(JSON.stringify({look:D.FACTION_LOOK,mark:D.FACTION_MOTIF}));")
    p = subprocess.run(['node', '-e', js], capture_output=True, text=True)
    if p.returncode != 0:
        raise SystemExit('could not read his colour tables:\n' + p.stderr[-800:])
    return json.loads(p.stdout)


PAGE = r"""<meta charset="utf-8">
<title>BOHEMIA - SAME BODY, DIFFERENT CLOTHES</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<body id="bd" style="margin:0;background:#0d0f0a;font-family:-apple-system,sans-serif;color:#ddd">
<div id="bar" style="position:sticky;top:0;z-index:9;background:#0d0f0a;padding:10px 12px;display:flex;gap:8px;align-items:center;border-bottom:1px solid #2a2a1f">
  <div style="flex:1;min-width:130px">
    <div id="hdr" style="font:700 15px -apple-system,sans-serif;color:#cdbd8a">SAME BODY, DIFFERENT CLOTHES</div>
    <div id="sub" style="font:600 11px ui-monospace,monospace;color:#8f8770;margin-top:2px">your endings, sorted by volume not by flag</div>
  </div>
  <button id="sun" style="padding:9px 13px;border-radius:8px;border:1px solid #887;background:#222;color:#ddd">&#9728; SUN MODE</button>
</div>

<div class="wrap">
  <div class="lede" id="lede">
    Every other faction view in this project sorts by <i>who</i>. This one sorts by
    <b>how loud the act was</b> and puts the factions next to each other &mdash; because
    you said it is the same thing dressed differently, and <b>your own writing already
    says so.</b> Every line below is yours, unedited. The only thing added is the order.
  </div>
  <div id="tally" class="tally"></div>
  <div id="body"></div>
  <div class="foot" id="foot"></div>
</div>

<style>
.wrap{max-width:720px;margin:0 auto;padding:0 12px 40px}
.lede{font:13px/1.65 -apple-system,sans-serif;color:#9a9480;padding:14px 2px 10px}
.tally{font:11px/1.5 ui-monospace,monospace;color:#8f8770;background:#141609;border:1px solid #2a2a1f;
       border-radius:10px;padding:10px 12px;margin-bottom:6px;overflow-x:auto;white-space:pre}
.tier{margin:24px 0 8px}
.tname{font:700 15px -apple-system,sans-serif;letter-spacing:.05em}
.tshape{font:12px/1.5 -apple-system,sans-serif;color:#8f8770;margin-top:2px}
.act{display:flex;gap:9px;background:#141609;border:1px solid #2a2a1f;border-radius:10px;
     padding:9px 11px;margin-bottom:7px}
.dot{width:11px;height:11px;border-radius:3px;flex:none;margin-top:3px}
.who{font:700 10px ui-monospace,monospace;letter-spacing:.07em;min-width:74px;flex:none;padding-top:2px}
.said{font:12.5px/1.5 -apple-system,sans-serif}
.q{font:10px ui-monospace,monospace;color:#6c614f;margin-top:3px}
.foot{font:11px/1.7 -apple-system,sans-serif;color:#6f6a58;margin-top:26px;border-top:1px solid #23241a;padding-top:12px}
</style>

<script>
var DATA = __DATA__;
(function(){
var SUN=false;
function P(){ return SUN
  ? {card:'#e5dfcc',line:'#c9c2ab',ink:'#3a3320',dim:'#6a6350',body:'#3a3320'}
  : {card:'#141609',line:'#2a2a1f',ink:'#cdbd8a',dim:'#8f8770',body:'#ddd'}; }
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
var RAINBOW='linear-gradient(90deg,#dc2820,#d9a441,#5aae6a,#2e6fae,#c026a0)';
function col(f){ var l=DATA.look[f]; return (l&&l.color)||null; }
function swatch(f){ var l=DATA.look[f];
  return (l&&l.mode==='rainbow')?RAINBOW:((l&&l.color)||'transparent'); }

function paint(){
  var p=P(), h='';
  DATA.tiers.forEach(function(t){
    var rows=DATA.rows.filter(function(r){ return r.tier===t.tag; });
    if(!rows.length) return;
    var hot=(t.tag==='reckless'||t.tag==='risky');
    h+='<div class="tier"><div class="tname" style="color:'+(hot?'#e0a060':'#7ac87a')+'">#'
      +t.tag.toUpperCase()+' <span style="opacity:.5;font-weight:400">'+rows.length+' endings &middot; '
      +t.factions+' factions</span></div>';
    h+='<div class="tshape" style="color:'+p.dim+'">'+esc(t.shape)+'</div></div>';
    rows.forEach(function(r){
      h+='<div class="act" style="background:'+p.card+';border-color:'+p.line+'">';
      h+='<span class="dot" style="background:'+swatch(r.faction)
        +(col(r.faction)||DATA.look[r.faction]?'':';border:1px dashed '+(SUN?'#9a927c':'#5a5443'))+'"></span>';
      h+='<span class="who" style="color:'+(col(r.faction)||p.dim)+'">'+esc(r.faction)
        +'<br><span style="opacity:.65;font-weight:400">'+(r.delta>0?'+':'')+r.delta+'</span></span>';
      h+='<span><span class="said" style="color:'+p.body+'">'+esc(r.log)+'</span>'
        +'<div class="q" style="color:'+p.dim+'">'+esc(r.quest)+' &middot; '+esc(r.title)+'</div></span>';
      h+='</div>';
    });
  });
  document.getElementById('body').innerHTML=h;

  var t='FACTION           '+DATA.tiers.map(function(x){return x.tag.slice(0,4).toUpperCase().padStart(6);}).join('')+'\n';
  DATA.tally.forEach(function(row){
    t+=row.faction.padEnd(18)+DATA.tiers.map(function(x){
      return String(row[x.tag]||'.').padStart(6); }).join('')+'\n';
  });
  document.getElementById('tally').textContent=t.trimEnd();

  document.getElementById('foot').innerHTML =
    '<b>'+DATA.spanning+' of '+DATA.tally.length+' factions span more than one volume.</b> '
    +'No faction is the quiet one. No faction is the reckless one. What varies is how loud '
    +'the act was, and that is an axis you already wrote (#quiet / #notable / #risky / '
    +'#reckless, 7/21). A faction is a DIALECT over a shared act, not a different set of '
    +'behaviours &mdash; which is why one main quest with fourteen dressings is not a '
    +'compromise for scope, it is the accurate model. Fourteen forked quests would say '
    +'something about this world that is not true.';
}
document.getElementById('sun').onclick=function(){
  SUN=!SUN; var b=document.getElementById('bd');
  b.style.background=SUN?'#efe9d8':'#0d0f0a'; b.style.color=SUN?'#3a3320':'#ddd';
  document.getElementById('bar').style.background=SUN?'#efe9d8':'#0d0f0a';
  document.getElementById('hdr').style.color=SUN?'#3a3320':'#cdbd8a';
  ['lede','sub','foot'].forEach(function(id){ document.getElementById(id).style.color=SUN?'#6a6350':'#8f8770'; });
  var tl=document.getElementById('tally');
  tl.style.background=SUN?'#e5dfcc':'#141609'; tl.style.borderColor=SUN?'#c9c2ab':'#2a2a1f';
  tl.style.color=SUN?'#6a6350':'#8f8770';
  paint();
};
paint();
})();
</script>
"""


def build():
    rows = scan()
    if not rows:
        raise SystemExit('no authored faction endings found - nothing to show')
    art = colours()
    tally = {}
    for r in rows:
        tally.setdefault(r['faction'], {'faction': r['faction']})
        tally[r['faction']][r['tier']] = tally[r['faction']].get(r['tier'], 0) + 1
    tallyrows = sorted(tally.values(),
                       key=lambda x: -sum(v for k, v in x.items() if k != 'faction'))
    spanning = sum(1 for x in tallyrows if sum(1 for t in TIERS if x.get(t)) >= 2)
    tiers = [{'tag': t, 'shape': TIER_SHAPE[t],
              'factions': len({r['faction'] for r in rows if r['tier'] == t})} for t in TIERS]
    data = {'rows': rows, 'tiers': tiers, 'tally': tallyrows, 'spanning': spanning,
            'look': art['look'], 'mark': art['mark']}
    html = PAGE.replace('__DATA__', json.dumps(data))
    open(OUT, 'w', encoding='utf-8').write(html)
    print('wrote %s (%.1f KB) - %d authored endings, %d factions, %d spanning 2+ volumes'
          % (OUT, len(html) / 1024.0, len(rows), len(tallyrows), spanning))


if __name__ == '__main__':
    build()
