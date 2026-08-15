#!/usr/bin/env python3
"""
BOHEMIA THE WALL -- the page that runs the real wall, live.  (8/15/26, FACTIONS)

Writes slices/BOHEMIA_THE_WALL_8_15_26.html. EDIT THIS FILE, NEVER THE OUTPUT.

REUSE CHECK (REUSE-FIRST, Paolo 7/22): no graphic pixels are cooked. The page
INLINES the real engine bodies (bohemia_resolve, bohemia_standing,
bohemia_ties, bohemia_belonging) and runs them -- it is not a drawing of the
mechanic, it is the mechanic. Same pattern as BOHEMIA_WHO_KNOWS_WHO_8_12_26,
which ties_gate E1 asserts runs the real organ inlined.

NOTHING TO JUDGE ON THIS PAGE, by law. EVERYTHING IS A THUMB (Paolo 8/9) killed
the approvals queue: this is a room he MAY open, never a gate the work waits
behind. No thumb controls, no verdict export.
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'slices/BOHEMIA_THE_WALL_8_15_26.html')
MODULES = ['engine/bohemia_resolve.js', 'engine/bohemia_ties.js',
           'engine/bohemia_belonging.js', 'engine/bohemia_commitment.js']

PAGE = r'''<meta charset="utf-8">
<title>BOHEMIA — THE WALL</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<body style="margin:0;background:#0d0f0a;font-family:-apple-system,sans-serif;color:#ddd">
<div style="padding:14px 12px 40px;max-width:480px;margin:0 auto">

<div style="font:700 17px/1.3 -apple-system,sans-serif;color:#cdbd8a">THE WALL</div>
<div style="font:12px/1.55 -apple-system,sans-serif;color:#8f8770;margin:4px 0 16px">
You could climb from stranger to inside by pressing one button ten times. Now
turning up runs out of road, and the only thing that passes it is saying out
loud that you are with them &mdash; which other outfits hear about. Tap the
button under the card to do the thing they want, over and over, and watch it
stop working. Nothing to judge here.
</div>

<div id="pick" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px"></div>
<div id="card" style="background:#181a12;border:2px solid #6ec06e;border-radius:12px;padding:14px"></div>
<div id="acts" style="display:flex;gap:8px;margin:12px 0 22px"></div>

<div style="font:700 13px -apple-system,sans-serif;color:#cdbd8a;margin:22px 0 6px">
WHO CAN HEAR ABOUT IT</div>
<div style="font:12px/1.5 -apple-system,sans-serif;color:#8f8770;margin-bottom:10px">
Word about a commitment travels the acquaintance graph &mdash; people who share
a roof or a job. Where there is no line, there is no consequence, and you can
play both sides. Where there is one, both sides can see you.
</div>
<div style="background:#1a1610;border:1px solid #6b5a33;border-radius:10px;padding:11px;
     font:12px/1.55 -apple-system,sans-serif;color:#c9b98a;margin-bottom:10px">
<b>THIS IS A CROWDED VALLEY, AND THE GAME'S IS NOT.</b> The graph below is built
dense on purpose so you can see the mechanic fire &mdash; people share roofs here.
<b>The real city today measures 298 people, 27 who run with somebody, 10 outfits,
and only 3 of those 10 with any line to another.</b> So on the walked surface
most commitments really do cost you nothing with anybody, because the valley is
that shattered. That is a real result, not a broken mechanic, and it is thin for
two reasons that are not this lane's to move: the map puts most people further
than 12 cells from any base, and how far a base reaches is a dial still waiting
on you.
</div>
<div id="graph" style="background:#12140e;border:1px solid #2e3323;border-radius:10px;padding:12px;
     font:12px/1.6 ui-monospace,Menlo,monospace;color:#9a9480"></div>

<div style="font:700 13px -apple-system,sans-serif;color:#cdbd8a;margin:22px 0 6px">
WHERE THE WALLS SIT, AND WHY THEY ARE NOT TYPED</div>
<div id="derive" style="background:#12140e;border:1px solid #2e3323;border-radius:10px;padding:12px;
     font:12px/1.6 ui-monospace,Menlo,monospace;color:#9a9480"></div>

<div style="font:11px/1.5 -apple-system,sans-serif;color:#6d6a5c;margin-top:22px">
The clamp is BOH_RESOLVE.makeCeiling, which you approved on 7/26 and which
nothing had called since. Grounded in Portes 1998 (being inside makes claims on
you), Burt and Simmel's tertius gaudens (the broker between two disconnected
groups), the 2024 tertius dolens finding (when the two sides are connected the
same position costs you instead), and Lipset &amp; Rokkan on cross-cutting
cleavages. Every number on this page is derived from the ladder or tagged a
placeholder; none is a ruling.
</div>
</div>

<script>__MODULES__</script>
<script>
var S = BohemiaCommitment, B = BohemiaBelonging, T = BohemiaTies;
var FACS = B.keys().filter(function(k){ return B.RULES[k].wants &&
                                               B.RULES[k].wants !== 'nothing'; });
var cur = FACS[0], save = { meta:{} };
/* ONE SPELLING ON SCREEN. The graph reports normalised keys (SOCIALFORCES) and
   the picker holds the table's (SOCIAL_FORCES); showing both made one outfit
   look like two. The three-spellings problem, in miniature, on a page. */
function disp(f){ return String(f||'').replace(/_/g,' ')
  .replace(/^SOCIALFORCES$/,'SOCIAL FORCES'); }

/* A REAL VALLEY, built the way the world builds one: people share a roof by
   declared seat and a workplace by declared site. Deterministic. */
var FN = 128;
function valley(){
  var out = [], n = 0;
  for(var h=0; h<110; h++){
    var per = 1 + (h % 3);                       /* 1..3 to a roof */
    for(var s=0; s<per && n<298; s++, n++){
      var r = (n*2654435761) >>> 0;
      out.push({
        id: 'H'+h+'-'+(s+1), seed: r,
        home: { building: 'b'+h, bedRoom: 0 },
        job: { kind:'site', site: 'w'+((r>>>7) % 96) },
        faction: ((r>>>3) % 100) < 22 ? FACS[(r>>>11) % FACS.length] : null
      });
    }
  }
  return out;
}
var ROSTER = valley();

function row(k, v){
  return '<div style="display:flex;gap:10px;padding:5px 0;border-bottom:1px solid #23271b">'
    + '<div style="flex:0 0 120px;font:600 10px -apple-system,sans-serif;color:#7d8a6a;'
    + 'letter-spacing:.04em">' + k + '</div>'
    + '<div style="flex:1;font:12px/1.45 -apple-system,sans-serif;color:#ddd">' + v + '</div></div>';
}

function draw(){
  document.getElementById('pick').innerHTML = FACS.map(function(f){
    var on = f === cur;
    return '<button data-f="'+f+'" style="font:600 10px -apple-system,sans-serif;'
      + 'background:'+(on?'#6ec06e':'#1d2116')+';color:'+(on?'#0d1a0d':'#9a9480')+';'
      + 'border:1px solid '+(on?'#6ec06e':'#2e3323')+';border-radius:6px;padding:5px 8px">'
      + disp(f) + '</button>';
  }).join('');
  [].forEach.call(document.querySelectorAll('#pick button'), function(b){
    b.onclick = function(){ cur = b.dataset.f; draw(); };
  });

  var rule = B.ruleOf(cur), gave = B.gaveOf(save, cur);
  var st = S.stateOf(save, cur), w = S.wallOf(st, gave);
  var bar = B.bargain(rule, gave);

  var h = '<div style="font:700 15px -apple-system,sans-serif;color:#cdbd8a;'
        + 'margin-bottom:8px">' + rule.faction + '</div>';
  h += row('THEY WANT', bar.wantWord);
  h += row('YOU ARE', bar.rung.word
        + (bar.next && !w.atWall ? ' &middot; ' + bar.next.more + ' MORE TO ' + bar.next.rung.word : ''));
  if(w.state !== 'none') h += row('YOU HAVE', w.word);
  if(w.atWall && w.blocks){
    h += row('THE WALL', '<span style="color:#e8b76a">TURNING UP GETS YOU NO FURTHER THAN '
      + w.reaches + '. ' + w.blocks + ' IS NOT FOR SALE.</span>');
    h += row('TO PASS IT', w.passNote);
  } else if(w.blocks && w.room !== Infinity){
    h += row('THE WALL', w.room + ' more and turning up stops working');
  } else {
    h += row('THE WALL', 'NONE LEFT. YOU BURNED A BRIDGE TO GET HERE.');
  }

  /* who hears, from the real graph */
  var heard = S.whoHears(cur, ROSTER, [0,0], {ties:T});
  if(!heard.length){
    h += row('WHO WILL HEAR', 'NOBODY. NO OUTFIT HAS A LINE TO THEM.');
  } else {
    var fact = [], rum = [];
    heard.forEach(function(x){ (S.landing(x).key==='direct'?fact:rum).push(x.faction); });
    if(fact.length) h += row('HEARS IT AS FACT', fact.map(disp).join(', '));
    if(rum.length)  h += row('HEARS A RUMOUR', rum.map(disp).join(', '));
  }
  var standings = {}; standings[cur] = gave;
  heard.slice(0,1).forEach(function(x){ standings[x.faction] = 1; });
  var t = S.tertius(standings, heard);
  if(t) h += row(t.key === 'dolens' ? 'AND' : 'AND',
    '<span style="color:'+(t.key==='dolens'?'#e88a6a':'#8ec9e8')+'">' + t.word + '</span>');
  document.getElementById('card').innerHTML = h;

  var acts = '<button id="give" style="flex:1;font:600 12px -apple-system,sans-serif;'
    + 'background:#1d2116;color:#9a9480;border:1px solid #2e3323;border-radius:8px;padding:10px">'
    + (B.ACTS[rule.wants] || 'Nothing to press') + '</button>';
  if(w.atWall && w.passWord)
    acts += '<button id="commit" style="flex:1;font:600 12px -apple-system,sans-serif;'
      + 'background:#6ec06e;color:#0d1a0d;border:none;border-radius:8px;padding:10px">'
      + w.passWord + '</button>';
  acts += '<button id="reset" style="flex:0 0 62px;font:600 12px -apple-system,sans-serif;'
    + 'background:#1d2116;color:#7d8a6a;border:1px solid #2e3323;border-radius:8px;padding:10px">'
    + 'Reset</button>';
  document.getElementById('acts').innerHTML = acts;

  var g = document.getElementById('give');
  if(g) g.onclick = function(){
    var r = S.give(S.stateOf(save,cur), B.gaveOf(save,cur), 1);
    if(r.gained > 0) B.record(save, cur, 1);
    draw();
  };
  var c = document.getElementById('commit');
  if(c) c.onclick = function(){
    var r = S.commit(S.stateOf(save,cur), B.gaveOf(save,cur));
    if(r.moved) S.setState(save, cur, r.state);
    draw();
  };
  document.getElementById('reset').onclick = function(){ save = { meta:{} }; draw(); };

  /* THE GRAPH, measured on this page rather than described */
  var facs = {}; ROSTER.forEach(function(a){ if(a.faction) facs[a.faction]=(facs[a.faction]||0)+1; });
  var names = Object.keys(facs).sort();
  var lines = names.map(function(f){
    var hh = S.whoHears(f, ROSTER, [0,0], {ties:T});
    return { f:f, n:hh.length, to:hh.map(function(x){return x.faction;}) };
  });
  var withL = lines.filter(function(l){ return l.n; }).length;
  document.getElementById('graph').innerHTML =
    ROSTER.length + ' people &middot; ' + ROSTER.filter(function(a){return a.faction;}).length
    + ' run with somebody &middot; ' + names.length + ' outfits<br>'
    + withL + ' of ' + names.length + ' have any line to another outfit<br><br>'
    + lines.map(function(l){
        return '<span style="color:'+(l.n?'#8ec9e8':'#5d6152')+'">'
          + disp(l.f).padEnd(15).replace(/ /g,'&nbsp;')
          + (l.n ? '&rarr; ' + l.to.map(disp).join(', ') : '&rarr; nobody (a structural hole)')
          + '</span>';
      }).join('<br>');

  document.getElementById('derive').innerHTML =
    'the ladder, already shipped:  ' + B.RUNGS.map(function(r){return r.at+'='+r.word;}).join('  ')
    + '<br><br>each commitment buys exactly one more rung, so:<br>'
    + S.STAGES.map(function(s){
        return '&nbsp;&nbsp;' + s.state.padEnd(8).replace(/ /g,'&nbsp;')
          + 'ceiling ' + (s.ceiling==null?'none':s.ceiling)
          + ' &mdash; reaches ' + s.reaches
          + (s.blocks ? ', cannot reach ' + s.blocks : '');
      }).join('<br>')
    + '<br><br><span style="color:#e8b76a">not one of those numbers is typed.</span> '
    + 'change the ladder and they follow.<br><br>'
    + 'the only real number here is what neglect costs, and it is 1 per stage '
    + 'under EVERYTHING COSTS ONE, tagged placeholder:<br>'
    + S.placeholders().map(function(p){
        return '&nbsp;&nbsp;' + p.where + ' = ' + p.value + '  [placeholder]'; }).join('<br>');
}
draw();
</script>
'''


def main():
    bodies = []
    for m in MODULES:
        path = os.path.join(ROOT, m)
        if not os.path.exists(path):
            sys.exit('FAIL: missing ' + m)
        bodies.append('/* ==== ' + m + ' ==== */\n'
                      + open(path, encoding='utf-8').read())
    html = PAGE.replace('__MODULES__', '\n'.join(bodies))
    with open(OUT, 'w', encoding='utf-8') as fh:
        fh.write(html)
    print('wrote %s (%d KB, %d engine bodies inlined)'
          % (os.path.relpath(OUT, ROOT), len(html) // 1024, len(MODULES)))


if __name__ == '__main__':
    main()
