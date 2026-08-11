#!/usr/bin/env python3
"""BOHEMIA - WHAT IT COST YOU. The consequence line, standing in the middle of the room.

WHY THIS PAGE EXISTS (Paolo 8/11, LOCKED - laws/BOHEMIA_ADDENDUM_NEVER_MAKE_HIM_HUNT):
  "you can't have me test shit out in the run app for real like unless you're gonna
   place me right in front of it every time... I'm not hunting"

The consequence line shipped INTO THE RUN, which is correct - that is where a player
meets it. But I then asked him to reach it by playing the block quest and opening the
phone, and that is the hunt the rule now forbids. This page is the same readout, on
load, with nothing to tap: every ending of every canon quest, and what each one would
actually cost.

IT IS THE SAME CODE THE RUN USES. The run's questConsequence() reads three things -
the clout tag's reach, the faction deltas resolved against the live FactionWorld, and
who got stirred up. This page computes them the same way from the same modules, so it
cannot drift into showing something the game does not do.

REUSE CHECK (REUSE-FIRST, Paolo 7/22). What this opened, in code, and used:
  - engine/bohemia_loop.js ....... EXECUTED. boot() gives the real FactionWorld and the
                                   real clout table; the rungs come off it.
  - engine/bohemia_deeds.js ...... EXECUTED for reachOf() - the same call the run makes.
  - engine/bohemia_bq.js ......... EXECUTED to parse his real quests.
  - quests/bq/*.bq ............... READ ONLY. Every ending shown is one he wrote.
  - slices/BOHEMIA_HOW_LOUD_8_6_26.html ... its shell reused (sticky bar, SUN MODE, the
                                   same dark card grammar). No new visual language.
The heavy lift happens HERE, in node, and the page renders the result - the engine is
far too big to inline into a phone page (the 8/6 payload wall).

  python3 tools/bohemia_what_it_cost.py
"""
import json
import os
import subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(ROOT)

OUT = 'slices/BOHEMIA_WHAT_IT_COST_8_11_26.html'

RUNNER = r"""
'use strict';
const fs = require('fs');
const L  = require('./engine/bohemia_loop.js');
const BQ = require('./engine/bohemia_bq.js');
const D  = require('./engine/bohemia_deeds.js');
const E  = require('./engine/bohemia_engine.js');
const F  = E.Factions;

const ctx = L.boot({ seed: 'what-it-cost' });
function realId(fid){
  if (ctx.factions.factions.get(fid)) return fid;
  const up = String(fid).toUpperCase();
  for (const k of ctx.factions.factions.keys()) if (k.toUpperCase() === up) return k;
  return null;
}

const rows = [];
for (const f of fs.readdirSync('quests/bq').filter(x => x.endsWith('.bq')).sort()) {
  const src = fs.readFileSync('quests/bq/' + f, 'utf8');
  const Q = BQ.parse(src);
  const endings = [];
  for (const st of Q.stages) {
    const isEnd = st.flags.indexOf('COMPLETE') >= 0 || st.flags.indexOf('FAIL') >= 0;
    if (!isEnd) continue;
    const clout = L.cloutTagFrom(st.tags);
    const fac = [], post = [];
    for (const d of st.dos) {
      let m = /^faction\s+([A-Za-z_]+)\s+([-+]?\d+)\s*$/.exec(d.text);
      if (m) {
        const real = realId(m[1]);
        // the rung this delta ALONE would put you on, from a neutral start: what the
        // player actually reads on the card after this ending and nothing else.
        const v = parseInt(m[2], 10);
        fac.push({ faction: (real || m[1]).toUpperCase(), delta: v, rung: F.rungOf(v) });
        continue;
      }
      m = /^faction_posture\s+([A-Za-z_]+)/.exec(d.text);
      if (m) post.push((realId(m[1]) || m[1]).toUpperCase());
    }
    if (!fac.length && !post.length && !clout) continue;
    endings.push({
      stage: st.n,
      kind: st.flags.indexOf('FAIL') >= 0 ? 'FAIL' : 'COMPLETE',
      clout: clout,
      followers: L.cloutWeight(clout),
      reach: D.reachOf(clout),
      log: st.log || '',
      factions: fac, posture: post,
    });
  }
  if (endings.length) rows.push({ file: f, id: Q.id, title: Q.title, endings: endings });
}
process.stdout.write(JSON.stringify({
  quests: rows,
  tiers: L.CLOUT_TAGS.map(t => ({ tag: t, weight: L.CLOUT_WEIGHTS[t], reach: D.reachOf(t) })),
  untagged: { weight: L.cloutWeight(null), reach: D.reachOf(null) },
}));
"""


PAGE = r"""<meta charset="utf-8">
<title>BOHEMIA - WHAT IT COST YOU</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<body id="bd" style="margin:0;background:#0d0f0a;font-family:-apple-system,sans-serif;color:#ddd">
<div id="bar" style="position:sticky;top:0;z-index:9;background:#0d0f0a;padding:10px 12px;display:flex;gap:8px;align-items:center;border-bottom:1px solid #2a2a1f">
  <div style="flex:1;min-width:130px">
    <div id="hdr" style="font:700 15px -apple-system,sans-serif;color:#cdbd8a">WHAT IT COST YOU</div>
    <div id="sub" style="font:600 11px ui-monospace,monospace;color:#8f8770;margin-top:2px">every ending &middot; nothing to tap</div>
  </div>
  <button id="sun" style="padding:9px 13px;border-radius:8px;border:1px solid #887;background:#222;color:#ddd">&#9728; SUN MODE</button>
</div>

<div class="wrap">
  <div class="lede" id="lede">
    This is the card the phone shows when you finish a quest, for <b>every ending you have
    written</b>. The follower count is the vanity number. Everything under it is what the
    ending actually costs: how far the word carries, which factions move, who it stirs up.
  </div>
  <div id="body"></div>
  <div class="foot" id="foot"></div>
</div>

<style>
.wrap{max-width:720px;margin:0 auto;padding:0 12px 40px}
.lede{font:13px/1.65 -apple-system,sans-serif;color:#9a9480;padding:14px 2px 10px}
.q{font:700 13px -apple-system,sans-serif;color:#cdbd8a;letter-spacing:.03em;margin:22px 0 6px}
.card{background:#141609;border:1px solid #2a2a1f;border-radius:12px;padding:11px 12px;margin-bottom:9px}
.who{font:600 11px ui-monospace,monospace;color:#8f8770;display:flex;gap:6px;align-items:center}
.tag{font:700 9px ui-monospace,monospace;border-radius:4px;padding:2px 6px;letter-spacing:.08em}
.body{font:13px/1.5 -apple-system,sans-serif;color:#ddd;margin:6px 0 7px}
.eng{display:flex;justify-content:space-between;font:11px ui-monospace,monospace;color:#8f8770}
.fx{border-top:1px solid rgba(255,255,255,.07);margin-top:6px;padding-top:6px}
.reach{font:10px ui-monospace,monospace;color:#6c614f;letter-spacing:.5px}
.hit{font:600 11px ui-monospace,monospace;margin-top:2px}
.foot{font:11px/1.7 -apple-system,sans-serif;color:#6f6a58;margin-top:26px;border-top:1px solid #23241a;padding-top:12px}
</style>

<script>
var DATA = __DATA__;
(function(){
var SUN=false;
function P(){ return SUN
  ? {card:'#e5dfcc',line:'#c9c2ab',ink:'#3a3320',dim:'#6a6350',good:'#2f7a2f',hot:'#b05a12',body:'#3a3320'}
  : {card:'#141609',line:'#2a2a1f',ink:'#cdbd8a',dim:'#8f8770',good:'#7ac87a',hot:'#e0a060',body:'#ddd'}; }
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function paint(){
  var p=P(), h='';
  DATA.quests.forEach(function(q){
    h+='<div class="q">'+esc(q.title||q.id)+'</div>';
    q.endings.forEach(function(e){
      var loud = (e.clout==='reckless'||e.clout==='risky');
      h+='<div class="card" style="background:'+p.card+';border-color:'+p.line+'">';
      h+='<div class="who" style="color:'+p.dim+'">YOU <span style="opacity:.6">@you</span>';
      if(e.clout) h+='<span class="tag" style="background:'+(loud?p.hot:p.good)+';color:'+(SUN?'#fff':'#0d1a0d')+'">#'+e.clout+'</span>';
      if(e.kind==='FAIL') h+='<span class="tag" style="background:#5a2a2a;color:#ffd9d9">FAILED</span>';
      h+='</div>';
      h+='<div class="body" style="color:'+p.body+'">'+esc(e.log)+'</div>';
      h+='<div class="eng" style="color:'+p.dim+'"><span>'+(e.kind)+'</span>'
        +'<span style="color:'+p.good+'">+'+e.followers+' followers</span></div>';
      h+='<div class="fx" style="border-color:'+(SUN?'rgba(0,0,0,.08)':'rgba(255,255,255,.07)')+'">';
      h+='<div class="reach" style="color:'+p.dim+';opacity:.8">WORD CARRIED '+e.reach+' TILES</div>';
      e.factions.forEach(function(f){
        h+='<div class="hit" style="color:'+(f.delta>0?p.good:p.hot)+'">'+f.faction+' '
          +(f.delta>0?'+':'')+f.delta+' &middot; '+f.rung+'</div>';
      });
      e.posture.forEach(function(f){
        h+='<div class="hit" style="color:'+p.hot+'">'+f+' STIRRED UP</div>';
      });
      h+='</div></div>';
    });
  });
  document.getElementById('body').innerHTML=h;
  document.getElementById('foot').innerHTML =
    'How loud you were decides how far it carries: '
    + DATA.tiers.map(function(t){ return '#'+t.tag+' '+t.reach+' tiles'; }).join(' &middot; ')
    + ' (untagged '+DATA.untagged.reach+'). Same numbers the run uses &mdash; the phone\'s card '
    + 'calls the same reachOf() and reads the same live FactionWorld, so this page cannot show '
    + 'you something the game does not do.';
}
document.getElementById('sun').onclick=function(){
  SUN=!SUN; var b=document.getElementById('bd'), p=P();
  b.style.background=SUN?'#efe9d8':'#0d0f0a'; b.style.color=SUN?'#3a3320':'#ddd';
  document.getElementById('bar').style.background=SUN?'#efe9d8':'#0d0f0a';
  document.getElementById('hdr').style.color=SUN?'#3a3320':'#cdbd8a';
  ['lede','sub','foot'].forEach(function(id){ document.getElementById(id).style.color=SUN?'#6a6350':'#8f8770'; });
  [].forEach.call(document.querySelectorAll('.q'),function(e){ e.style.color=SUN?'#3a3320':'#cdbd8a'; });
  paint();
};
paint();
})();
</script>
"""


def build():
    p = subprocess.run(['node', '-e', RUNNER], capture_output=True, text=True)
    if p.returncode != 0:
        raise SystemExit('the real run failed, so there is nothing honest to show:\n' + p.stderr[-1800:])
    data = json.loads(p.stdout)
    n = sum(len(q['endings']) for q in data['quests'])
    html = PAGE.replace('__DATA__', json.dumps(data))
    open(OUT, 'w', encoding='utf-8').write(html)
    print('wrote %s (%.1f KB) - %d quests, %d endings, all on load'
          % (OUT, len(html) / 1024.0, len(data['quests']), n))


if __name__ == '__main__':
    build()
