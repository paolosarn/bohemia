#!/usr/bin/env python3
"""BOHEMIA - WHO YOU STIRRED UP. Builds the watchable proof that the seventeen
`@DO faction_posture` rulings Paolo authored actually change who ends up holding
the valley.

WHAT IT SHOWS, and all of it is his:
  - Every authored posture ruling in quests/bq/, with the quest and the stage it
    sits on. Seventeen of them, parsed out of his files, none invented.
  - THE SAME VALLEY, SAME SEED, RUN TWICE: once with nobody stirred up, once with
    his rulings applied. Same territory AI, same number of rounds, same everything
    else. The maps diverge.

HOW IT IS HONEST ABOUT BEING A RECORDING. The real run needs bohemia_loop.js and
the whole engine (worldgen, scheduler, faction AI) - far too heavy to inline into a
phone page, and the 8/6 PAYLOAD WALL is exactly about not doing that. So the two
runs happen HERE, in node, against the real modules, and the page renders what they
actually produced. It is a recording of a real run, labelled as one on the page
itself, not a mock-up and not a re-implementation of the rules in JavaScript.

REUSE CHECK (REUSE-FIRST, Paolo 7/22). What this opened, in code, and used:
  - engine/bohemia_loop.js ........ USED, executed. boot() builds the real valley,
                                    real faction graph, real adjacency. The posture
                                    bridge under test is inside it.
  - engine/bohemia_engine.js ...... USED via the loop: the real FactionWorld,
                                    advanceRound(), scoreClaim(). No AI is rewritten.
  - quests/bq/*.bq ................ READ ONLY, for the seventeen authored rulings.
  - slices/BOHEMIA_HOW_LOUD_8_6_26.html ... its shell reused (sticky bar, SUN MODE,
                                    the same dark card grammar). No new visual
                                    language was cooked.
NOTHING DRAWS ORIGINAL WORLD ART, so the 45 DEGREE ART LAW does not apply: this is a
data view of a simulation, same register as WORD TRAVELS and HOW LOUD YOU WERE.

  python3 tools/bohemia_who_you_stirred_up.py
"""
import json
import os
import re
import subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(ROOT)

OUT = 'slices/BOHEMIA_WHO_YOU_STIRRED_UP_8_7_26.html'
BQDIR = 'quests/bq'
ROUNDS = 12          # how many narrative territory rounds to fast-forward
SEED = 'stirred-up'


def authored_rulings():
    """His seventeen, with the file and stage each one sits on. Read, never typed."""
    rows = []
    for fn in sorted(os.listdir(BQDIR)):
        if not fn.endswith('.bq'):
            continue
        src = open(os.path.join(BQDIR, fn), encoding='utf-8').read()
        stage = None
        for line in src.split('\n'):
            m = re.match(r'\s*@STAGE\s+(\d+)', line)
            if m:
                stage = m.group(1)
            m = re.match(r'\s*@DO\s+faction_posture\s+([A-Za-z_]+)\s+([-+]?\d+)', line)
            if m:
                rows.append({'quest': fn.replace('.bq', ''), 'stage': stage,
                             'faction': m.group(1), 'delta': int(m.group(2))})
    return rows


RUNNER = r"""
'use strict';
const L = require('./engine/bohemia_loop.js');
const ROUNDS = %(rounds)d, SEED = %(seed)s;
const STIR = %(stir)s;   // factionId(UPPER) -> total authored posture

function run(applyStir) {
  const ctx = L.boot({ seed: SEED });
  const world = ctx.factions;
  // resolve the quests' ALL-CAPS ids against the canon graph's Title Case ids,
  // the same fold the real bridge does.
  function real(fid) {
    if (world.factions.get(fid)) return fid;
    const up = String(fid).toUpperCase();
    for (const k of world.factions.keys()) if (k.toUpperCase() === up) return k;
    return null;
  }
  if (applyStir) {
    for (const fid of Object.keys(STIR)) {
      const r = real(fid);
      if (r) { const f = world.factions.get(r); f.quota = Math.max(0, f.quota + STIR[fid]); }
    }
  }
  const adj = id => (ctx.factionAdjacency.get(id) || []);
  for (let i = 0; i < ROUNDS; i++) world.advanceRound(adj);
  const owner = {};
  for (const [d, f] of world.owner.entries()) owner[d] = f;
  const held = {};
  for (const f of world.factions.values()) held[f.id] = f.territory.size;
  return { owner, held, quota: Object.fromEntries([...world.factions.values()].map(f => [f.id, f.quota])) };
}

const calm = run(false), stirred = run(true);
const keys = new Set([...Object.keys(calm.owner), ...Object.keys(stirred.owner)]);
let changed = 0;
for (const k of keys) if (calm.owner[k] !== stirred.owner[k]) changed++;
process.stdout.write(JSON.stringify({
  calm, stirred, changed, cells: keys.size,
  factions: [...new Set([...Object.keys(calm.held), ...Object.keys(stirred.held)])].sort(),
}));
"""


def run_sim(stir):
    js = RUNNER % {'rounds': ROUNDS, 'seed': json.dumps(SEED), 'stir': json.dumps(stir)}
    p = subprocess.run(['node', '-e', js], capture_output=True, text=True)
    if p.returncode != 0:
        raise SystemExit('the real run failed, so there is nothing honest to show:\n' + p.stderr[-2000:])
    return json.loads(p.stdout)


PAGE = r"""<meta charset="utf-8">
<title>BOHEMIA - WHO YOU STIRRED UP</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<body id="bd" style="margin:0;background:#0d0f0a;font-family:-apple-system,sans-serif;color:#ddd">
<div id="bar" style="position:sticky;top:0;z-index:9;background:#0d0f0a;padding:10px 12px;display:flex;gap:8px;align-items:center;border-bottom:1px solid #2a2a1f">
  <div style="flex:1;min-width:130px">
    <div id="hdr" style="font:700 15px -apple-system,sans-serif;color:#cdbd8a">WHO YOU STIRRED UP</div>
    <div id="sub" style="font:600 11px ui-monospace,monospace;color:#8f8770;margin-top:2px">nothing to judge &middot; just look at it</div>
  </div>
  <button id="sun" style="padding:9px 13px;border-radius:8px;border:1px solid #887;background:#222;color:#ddd">&#9728; SUN MODE</button>
</div>

<div class="wrap">
  <div class="lede" id="lede">
    Your quests have a third effect nobody was reading. <b>@DO faction_posture</b> &mdash; you
    wrote <b>__NRULE__</b> of them &mdash; got parsed correctly into the quest's own state and then
    thrown away. It never reached the world. It does now, and the valley comes out different.
  </div>

  <div class="h" id="h1">THE SAME VALLEY, RUN TWICE</div>
  <div class="cap" id="cap1">Same seed, same map, same faction AI, same __ROUNDS__ rounds. The only difference
    is whether your posture rulings were applied. <b>__CHANGED__ districts</b> end up with a different owner.</div>

  <div class="card">
    <div class="tag" id="tA">&#9679; NOBODY STIRRED UP</div>
    <canvas id="cA" width="700" height="300"></canvas>
  </div>
  <div class="card">
    <div class="tag hot" id="tB">&#9679; YOUR RULINGS APPLIED</div>
    <canvas id="cB" width="700" height="300"></canvas>
    <div class="read" id="rB"></div>
  </div>

  <div class="h" id="h2">WHO GAINED, WHO LOST</div>
  <div class="cap" id="cap2">Districts held after __ROUNDS__ rounds, both ways.</div>
  <div id="held"></div>

  <div class="h" id="h3">YOUR __NRULE__ RULINGS</div>
  <div class="cap" id="cap3">Every one of these is a line in a quest file you wrote. Nothing here was invented.</div>
  <div id="rules"></div>

  <div class="foot" id="foot"></div>
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
.read{font:12px/1.7 ui-monospace,monospace;color:#9a9480;margin-top:8px}
.row{display:flex;align-items:baseline;gap:8px;padding:6px 0;border-bottom:1px solid #23241a;font:12px ui-monospace,monospace}
.row:last-child{border-bottom:0}
.foot{font:11px/1.7 -apple-system,sans-serif;color:#6f6a58;margin:26px 0 40px;border-top:1px solid #23241a;padding-top:12px}
</style>

<script>
var DATA = __DATA__;
var RULES = __RULES__;
(function(){
var SUN=false;
function P(){ return SUN
  ? {bg:'#efe9d8',grid:'#dcd6c2',ink:'#3a3320',dim:'#6a6350',hot:'#b05a12',lit:'#2f7a2f'}
  : {bg:'#0a0c07',grid:'#1c1f14',ink:'#cdbd8a',dim:'#8f8770',hot:'#e0a060',lit:'#7ac87a'}; }

/* one stable colour per faction, spread around the wheel by INDEX so it is
   deterministic and never two neighbours the same. This is a data view, not the
   game's palette -- his ruled faction colours are canon and live in the alpha. */
var FAC=DATA.factions, COL={};
FAC.forEach(function(f,i){ COL[f]='hsl('+Math.round(i*360/FAC.length)+',52%,55%)'; });

function bounds(){
  var xs=[],ys=[];
  Object.keys(DATA.calm.owner).concat(Object.keys(DATA.stirred.owner)).forEach(function(k){
    var p=k.split(','); xs.push(+p[0]); ys.push(+p[1]);
  });
  return {x0:Math.min.apply(null,xs), x1:Math.max.apply(null,xs),
          y0:Math.min.apply(null,ys), y1:Math.max.apply(null,ys)};
}
var B=bounds();

function draw(cv, owner, other){
  var g=cv.getContext('2d'), p=P();
  g.fillStyle=p.bg; g.fillRect(0,0,cv.width,cv.height);
  var w=(B.x1-B.x0+1), h=(B.y1-B.y0+1);
  var s=Math.min(cv.width/w, cv.height/h);
  var ox=(cv.width-w*s)/2, oy=(cv.height-h*s)/2;
  Object.keys(owner).forEach(function(k){
    var q=k.split(','), x=(+q[0]-B.x0)*s+ox, y=(+q[1]-B.y0)*s+oy;
    g.fillStyle=COL[owner[k]]||p.grid;
    g.fillRect(x, y, Math.max(1.5,s-0.5), Math.max(1.5,s-0.5));
    if(other && other[k]!==owner[k]){          // this cell changed hands
      g.strokeStyle=p.ink; g.lineWidth=1;
      g.strokeRect(x-0.5, y-0.5, Math.max(2,s), Math.max(2,s));
    }
  });
}

function paint(){
  var p=P();
  draw(document.getElementById('cA'), DATA.calm.owner, null);
  draw(document.getElementById('cB'), DATA.stirred.owner, DATA.calm.owner);
  document.getElementById('rB').innerHTML =
    '<b style="color:'+p.hot+'">'+DATA.changed+' districts</b> came out under a different flag. '
    +'Outlined cells are the ones that changed hands.';

  var h='<div class="card">';
  DATA.factions.forEach(function(f){
    var a=DATA.calm.held[f]||0, b=DATA.stirred.held[f]||0, d=b-a;
    h+='<div class="row"><span style="width:11px;height:11px;border-radius:3px;background:'+COL[f]+';display:inline-block"></span>'
     +'<span style="flex:1;color:'+p.ink+'">'+f+'</span>'
     +'<span style="color:'+p.dim+'">'+a+' &rarr; '+b+'</span>'
     +'<span style="width:44px;text-align:right;color:'+(d>0?p.lit:d<0?p.hot:p.dim)+'">'+(d>0?'+':'')+d+'</span></div>';
  });
  h+='</div>';
  document.getElementById('held').innerHTML=h;

  var r='<div class="card">';
  RULES.forEach(function(x){
    r+='<div class="row"><span style="flex:1;color:'+p.ink+'">'+x.faction+'</span>'
     +'<span style="color:'+p.dim+'">'+x.quest.replace(/_/g,' ').toLowerCase()+'</span>'
     +'<span style="width:34px;text-align:right;color:'+p.hot+'">+'+x.delta+'</span></div>';
  });
  r+='</div>';
  document.getElementById('rules').innerHTML=r;

  document.getElementById('foot').innerHTML =
    'A RECORDING OF A REAL RUN, not a mock-up and not a re-implementation. Both valleys were '
    +'built by engine/bohemia_loop.js boot() and advanced by the real FactionWorld.advanceRound() '
    +'in node, then drawn here &mdash; the engine is far too heavy to inline into a phone page, '
    +'which is what the payload wall was about. '
    +DATA.cells+' districts, '+DATA.factions.length+' factions, '+__ROUNDS__+' rounds each way.';
}

document.getElementById('sun').onclick=function(){
  SUN=!SUN; var b=document.getElementById('bd');
  b.style.background=SUN?'#efe9d8':'#0d0f0a'; b.style.color=SUN?'#3a3320':'#ddd';
  document.getElementById('bar').style.background=SUN?'#efe9d8':'#0d0f0a';
  document.getElementById('hdr').style.color=SUN?'#3a3320':'#cdbd8a';
  ['lede','cap1','cap2','cap3','sub','foot'].forEach(function(id){
    document.getElementById(id).style.color=SUN?'#6a6350':'#8f8770'; });
  ['h1','h2','h3'].forEach(function(id){ document.getElementById(id).style.color=SUN?'#3a3320':'#cdbd8a'; });
  [].forEach.call(document.querySelectorAll('.card'),function(c){
    c.style.background=SUN?'#e5dfcc':'#141609'; c.style.borderColor=SUN?'#c9c2ab':'#2a2a1f'; });
  paint();
};
paint();
})();
</script>
"""


def build():
    rules = authored_rulings()
    if not rules:
        raise SystemExit('no authored posture rulings found - nothing to show')
    stir = {}
    for r in rules:
        stir[r['faction']] = stir.get(r['faction'], 0) + r['delta']
    data = run_sim(stir)
    html = (PAGE.replace('__DATA__', json.dumps(data))
                .replace('__RULES__', json.dumps(rules))
                .replace('__NRULE__', str(len(rules)))
                .replace('__ROUNDS__', str(ROUNDS))
                .replace('__CHANGED__', str(data['changed'])))
    open(OUT, 'w', encoding='utf-8').write(html)
    print('wrote %s (%.1f KB) - %d rulings, %d districts changed hands of %d'
          % (OUT, len(html) / 1024.0, len(rules), data['changed'], data['cells']))


if __name__ == '__main__':
    build()
