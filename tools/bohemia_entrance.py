#!/usr/bin/env python3
"""BOHEMIA - THE ENTRANCE. Pick your faction; that is where your family lives.

Paolo 8/12 (laws/BOHEMIA_ADDENDUM_THE_CUSTOMIZABLE_ENTRANCE_8_12_26.md):
  "i want the factions and the way the main quest starts with the faction ypu chose at
   the faction neighborhood housing or whatever. wer decided your family will be the
   same and shit so yeah. customizable entrance to the game type shit"

NOTHING ON THIS PAGE WAS WRITTEN FOR IT. Every faction, its alignment and its one-line
note come out of engine/BOHEMIA_faction_graph.json - his canon graph, verbatim. Every
colour and mark comes out of bohemia_dress.js's FACTION_LOOK / FACTION_MOTIF, the tables
he picked on 8/2. Every NEIGHBOURHOOD is the district the real loop actually seats that
faction on, read off a real boot, with the district's own type from the world model. If
he retunes any of it, this follows on the next build.

CUSTOM HAS NO COLOUR ON PURPOSE. It is the player faction - "no preset philosophy,
identity emerges from play" - so it has a mark and no swatch, and the card SHOWS that
absence rather than inventing one. Handing an emergent faction a colour at the door would
be answering a question he deliberately left open.

WHAT IT IS NOT: it does not start a game, and it does not choose for him. It is the
entrance made visible so he can see whether the shape is right - which of the fourteen
read as a home you would be born into, and which do not (that is his open question 2).

Obeys NEVER MAKE HIM HUNT (8/11): one tap from the LIFE hub, renders on load.

  python3 tools/bohemia_entrance.py
"""
import json
import os
import subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(ROOT)

OUT = 'slices/BOHEMIA_THE_ENTRANCE_8_12_26.html'

RUNNER = r"""
'use strict';
const L = require('./engine/bohemia_loop.js');
const D = require('./engine/bohemia_dress.js');
const G = require('./engine/BOHEMIA_faction_graph.json');

const ctx = L.boot({ seed: 'the-entrance' });
const world = ctx.worldMap;
const rows = [];
for (const [id, f] of Object.entries(G.factions)) {
  if (f.type !== 'selectable') continue;
  const key = id.toUpperCase();
  const seat = ctx.factionBases[id] || null;
  /* the world model is a DISTRICTS ARRAY of {id,pos,kind,zone} - there is no .at(),
     and the field is `kind`, not `district`. The first cut assumed both and printed
     "0 seated on a real district" for all fourteen, which is exactly the kind of empty
     field that would have shipped looking like a design statement. */
  let district = null, zone = null;
  if (seat && world && world.districts) {
    const c = world.districts.find(d => d.pos && d.pos[0] === seat.x && d.pos[1] === seat.y);
    if (c) { district = c.kind || null; zone = c.zone || null; }
  }
  const look = D.FACTION_LOOK[key] || null;
  rows.push({
    id: id, key: key,
    align: f.align || '', note: f.note || '',
    act1: f.act1_power == null ? null : f.act1_power,
    act3: f.act3_power == null ? null : f.act3_power,
    color: look && look.color ? look.color : null,
    mode: look ? look.mode : null,
    mark: D.FACTION_MOTIF[key] || null,
    seat: seat ? [seat.x, seat.y] : null,
    district: district, zone: zone,
    /* HIS RULING SAYS "the faction neighborhood HOUSING". So the honest question this
       page has to answer is not just WHERE each faction sits, but whether that place is
       somewhere a family could live at all. Measured, not assumed. */
    housing: ['suburb','trailer','apartment','estate','gated'].indexOf(String(district)) >= 0,
    holds: (ctx.factions.factions.get(id) || { territory: new Set() }).territory.size,
  });
}
rows.sort((a, b) => a.id.localeCompare(b.id));
process.stdout.write(JSON.stringify({ rows: rows, total: rows.length }));
"""

PAGE = r"""<meta charset="utf-8">
<title>BOHEMIA - THE ENTRANCE</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<body id="bd" style="margin:0;background:#0d0f0a;font-family:-apple-system,sans-serif;color:#ddd">
<div id="bar" style="position:sticky;top:0;z-index:9;background:#0d0f0a;padding:10px 12px;display:flex;gap:8px;align-items:center;border-bottom:1px solid #2a2a1f">
  <div style="flex:1;min-width:130px">
    <div id="hdr" style="font:700 15px -apple-system,sans-serif;color:#cdbd8a">THE ENTRANCE</div>
    <div id="sub" style="font:600 11px ui-monospace,monospace;color:#8f8770;margin-top:2px">pick who you were born under</div>
  </div>
  <button id="sun" style="padding:9px 13px;border-radius:8px;border:1px solid #887;background:#222;color:#ddd">&#9728; SUN MODE</button>
</div>

<div class="wrap">
  <div class="lede" id="lede">
    <b>&ldquo;It&rsquo;s just with different clothes on.&rdquo;</b> One game, fourteen
    dressings &mdash; not fourteen games. The fight, the sibling, the dinner, the burial
    on the ridge, the whole arc: none of it moves. What you pick changes <b>where you
    start, the vibe, the colours, and some of what people say to you</b>. Same body,
    different clothes.
  </div>
  <div id="grid"></div>
  <div class="foot" id="foot"></div>
</div>

<style>
.wrap{max-width:720px;margin:0 auto;padding:0 12px 40px}
.lede{font:13px/1.65 -apple-system,sans-serif;color:#9a9480;padding:14px 2px 12px}
.card{background:#141609;border:1px solid #2a2a1f;border-left-width:5px;border-radius:10px;
      padding:11px 12px;margin-bottom:9px}
.top{display:flex;align-items:center;gap:8px}
.nm{font:700 14px -apple-system,sans-serif;letter-spacing:.02em}
.al{font:600 10px ui-monospace,monospace;letter-spacing:.09em;opacity:.75;margin-left:auto}
.note{font:12px/1.55 -apple-system,sans-serif;color:#9a9480;margin:6px 0 7px}
.meta{display:flex;flex-wrap:wrap;gap:5px 14px;font:11px ui-monospace,monospace;color:#6c614f}
.foot{font:11px/1.7 -apple-system,sans-serif;color:#6f6a58;margin-top:22px;border-top:1px solid #23241a;padding-top:12px}
</style>

<script>
var DATA = __DATA__;
(function(){
var SUN=false;
function P(){ return SUN
  ? {card:'#e5dfcc',line:'#c9c2ab',ink:'#3a3320',dim:'#6a6350'}
  : {card:'#141609',line:'#2a2a1f',ink:'#cdbd8a',dim:'#8f8770'}; }
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
var RAINBOW='linear-gradient(90deg,#dc2820,#d9a441,#5aae6a,#2e6fae,#c026a0)';

function paint(){
  var p=P(), h='';
  DATA.rows.forEach(function(f){
    var col = f.color || (f.mode==='rainbow' ? '#9a9480' : null);
    var edge = col || (SUN?'#c9c2ab':'#3a3a2c');
    h+='<div class="card" style="background:'+p.card+';border-color:'+p.line+';border-left-color:'+edge+'">';
    h+='<div class="top">';
    h+='<span style="width:13px;height:13px;border-radius:4px;flex:none;background:'
      +(f.mode==='rainbow'?RAINBOW:(f.color||'transparent'))
      +(f.color||f.mode==='rainbow'?'':';border:1px dashed '+(SUN?'#9a927c':'#5a5443'))+'"></span>';
    h+='<span class="nm" style="color:'+(col||p.ink)+'">'+esc(f.key)+'</span>';
    h+='<span class="al" style="color:'+p.dim+'">'+esc(f.align)+'</span>';
    h+='</div>';
    h+='<div class="note" style="color:'+(SUN?'#5c5647':'#9a9480')+'">'+esc(f.note)+'</div>';
    h+='<div class="meta" style="color:'+p.dim+'">';
    h+='<span>HOME &middot; '+(f.district?esc(String(f.district).toUpperCase()):'NO GROUND YET')
      +(f.zone?(' / '+esc(String(f.zone).toUpperCase())):'')
      +(f.seat?(' ['+f.seat[0]+','+f.seat[1]+']'):'')+'</span>';
    h+='<span>MARK &middot; '+(f.mark?esc(String(f.mark).toUpperCase()):'&mdash;')+'</span>';
    if(!f.housing) h+='<span style="color:#e0a060;font-weight:700">NO HOUSING HERE YET</span>';
    if(!f.color && f.mode!=='rainbow') h+='<span style="opacity:.8">NO COLOUR YET &middot; IT EMERGES</span>';
    if(f.act1!=null) h+='<span>ACT1 '+f.act1+(f.act3!=null?(' → ACT3 '+f.act3):'')+'</span>';
    h+='</div></div>';
  });
  document.getElementById('grid').innerHTML=h;
  document.getElementById('foot').innerHTML =
    DATA.total+' selectable factions, every one of them read straight out of your canon graph '
    +'— the alignment and the sentence under each name are yours, the colour and the mark are '
    +'the tables you picked on 8/2, and HOME is the district the real world generator actually '
    +'seats that faction on. Nothing here was written for this page, and nothing here starts a '
    +'game yet: it is the entrance made visible so you can see whether the shape is right. '
    +'<br><br><b style="color:#e0a060">'+DATA.rows.filter(function(r){return !r.housing;}).length
    +' of '+DATA.total+' have nowhere to be born yet.</b> You said the game starts at the faction '
    +'neighbourhood HOUSING, and the world currently seats those on a solar farm, a shop or a '
    +'field. Where a faction lives is map content, which is yours, not mine \u2014 so it is '
    +'measured here and left alone.';
}
document.getElementById('sun').onclick=function(){
  SUN=!SUN; var b=document.getElementById('bd');
  b.style.background=SUN?'#efe9d8':'#0d0f0a'; b.style.color=SUN?'#3a3320':'#ddd';
  document.getElementById('bar').style.background=SUN?'#efe9d8':'#0d0f0a';
  document.getElementById('hdr').style.color=SUN?'#3a3320':'#cdbd8a';
  ['lede','sub','foot'].forEach(function(id){ document.getElementById(id).style.color=SUN?'#6a6350':'#8f8770'; });
  paint();
};
paint();
})();
</script>
"""


def build():
    p = subprocess.run(['node', '-e', RUNNER], capture_output=True, text=True)
    if p.returncode != 0:
        raise SystemExit('the real boot failed, so there is nothing honest to show:\n' + p.stderr[-1800:])
    data = json.loads(p.stdout)
    html = PAGE.replace('__DATA__', json.dumps(data))
    open(OUT, 'w', encoding='utf-8').write(html)
    withground = sum(1 for r in data['rows'] if r['district'])
    print('wrote %s (%.1f KB) - %d selectable factions, %d seated on a real district'
          % (OUT, len(html) / 1024.0, data['total'], withground))


if __name__ == '__main__':
    build()
