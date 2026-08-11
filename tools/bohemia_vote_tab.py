#!/usr/bin/env python3
"""
BOHEMIA VOTE TAB (8/7/26).

    "Are u gonna have me hunt for the changes or ur gonna put them in a voting tab"
                                                              -- Paolo, 8/7/26

HE IS RIGHT AND IT IS MY FAILURE. Five turns in a row I ended by telling him to open the
CITY tab and thumb thirty-one new icons. The CITY tab is the CITY BUILDER: the icons are
scattered across a map he has to navigate, at the size they render in play, with no thumbs
on them and no way to say anything about one. That is not a judging surface. That is a
scavenger hunt with my work hidden in it, and "he never digs" is the first line of how he
works.

There ARE sixteen judge pages in this repo, and every one of them is reached LIFE tab ->
hub -> the page. Three taps and a hub is still hunting. So: A TOP-LEVEL **VOTE** TAB, and
what it opens on is ONLY THE THINGS THAT HAVE NO VERDICT YET, newest first.

REUSE CHECK: cooks NO new graphic pixels. Every sprite on this page is the already-baked
hero out of banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt -- the same bytes the CITY
tab plants on a tile, so a thumb here is a thumb on what he actually sees in the builder.
Looked at tools/bohemia_district_hero_judge.py (the 7/23 judge, whose thumbs/comment/SUN/
export shell is the proven one and is reused here in shape) and tools/bohemia_judge_cards.py.
Nothing is drawn, generated or recoloured by this file.

WHAT IS UNJUDGED IS **DERIVED**, NEVER TYPED. A hand-written list of "the new ones" is the
house bug this repo keeps paying for, and it would go stale the first time he judged
anything. The judged set is read out of records/*VERDICT*.txt; everything in the hero bank
that no verdict file names is unjudged, and it sorts newest-baked first.

VERDICT WORKFLOW LAW: thumbs per item, a comment box per item, a global comment box at the
BOTTOM always, SUN MODE for daylight, and export as .txt (never .json).

  python3 tools/bohemia_vote_tab.py   ->  slices/BOHEMIA_VOTE_CURRENT.html
"""
import json
import os
import re

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

BANK = 'banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt'
OUT = 'slices/BOHEMIA_VOTE_CURRENT.html'
RECORDS = 'records'

bank = json.load(open(BANK, encoding='utf8'))
heroes = [h for h in bank['heroes'] if h.get('b64')]

# ---- WHO HAS ALREADY BEEN JUDGED, read off his own verdict files ----------------
# Any district named in a file with VERDICT in its name has had its say. This is
# deliberately generous: a false "judged" only ever hides something from the queue, and he
# can always ask for it back, whereas a false "unjudged" puts work in front of him twice
# and that is the thing he is annoyed about.
# A VERDICT IS DECLARED, NOT NARRATED, and this is the third time in one day this repo
# has landed on that. The first version of this scanned prose and marked 48 of 59 districts
# judged because their names appear in paragraphs. The second tightened to "a verdict token
# on the same line" and STILL got it wrong both ways: it missed "Chapel - 85 both" (no
# percent sign) and it invented rulings for `mountain` and `suburb` out of the sentence
# "70.1% of every mountain plot", which is a line about a BUG that reads exactly like a
# score. Prose numbers are subject-blind. So:
#
#     @VERDICT <district> <whatever he said>
#
# One line per ruling, in any file under records/. That is the whole grammar. The VOTE
# tab's own export emits this shape, so his .txt drops straight back in and the queue
# shrinks by itself.
DECLARED = re.compile(r'^\s*@VERDICT\s+([a-z]+)\b', re.I | re.M)

judged = set()
names = {h['district'] for h in heroes}
for fn in sorted(os.listdir(RECORDS)):
    if not fn.lower().endswith(('.txt', '.md')):
        continue
    try:
        txt = open(os.path.join(RECORDS, fn), encoding='utf8', errors='ignore').read()
    except Exception:
        continue
    for m in DECLARED.finditer(txt):
        d = m.group(1).lower()
        if d in names:
            judged.add(d)

queue = [h for h in heroes if h['district'] not in judged]
done = [h for h in heroes if h['district'] in judged]
# newest first: the bank appends as the factory bakes, so later index = more recent
queue = list(reversed(queue))

LABEL = {h['district']: (h.get('label') or h['district']) for h in heroes}


def card(h, idx, judged_already):
    d = h['district']
    lab = (LABEL.get(d) or d)
    lab = lab.split('\u2014')[0].split(' - ')[0].strip()[:46]
    tag = 'JUDGED' if judged_already else 'NEW'
    return '''
<div class="card" data-d="%s">
  <div class="cardhead"><span class="nm">%s</span><span class="tag %s">%s</span></div>
  <div class="shot"><img alt="%s" src="data:image/png;base64,%s"></div>
  <div class="thumbs">
    <button class="tb up"   data-v="up">&#128077; YES</button>
    <button class="tb cbb"  data-v="cbb">&#128260; COULD BE BETTER</button>
    <button class="tb down" data-v="down">&#128078; NO</button>
  </div>
  <textarea class="note" rows="2" placeholder="what is wrong with %s (optional)"></textarea>
</div>''' % (d, d.upper(), tag.lower(), tag, d, h['b64'], d)


cards_new = '\n'.join(card(h, i, False) for i, h in enumerate(queue))
cards_old = '\n'.join(card(h, i, True) for i, h in enumerate(done))

# ---- DEMO BLOCKERS, ABOVE THE ICONS (8/9) -----------------------------------------
# Paolo 8/9: "First: DEMO BLOCKERS -- numbered, thumbable." A thumb is a verdict on a
# PICTURE; a blocker is a DECISION, and the ruled shape for a decision is the 8/4
# question format -- one question, two or three conclusions, answered with one letter,
# realistic option first and winning by default. So they render as lettered buttons in
# the same one-tap shell, ABOVE the art, because BOTTOM-UP says the thing he must not
# miss cannot be something he scrolls past.
# The list is DERIVED by tools/bohemia_demo_blockers.py -- rule one and it disappears
# from here on its own. This file only draws what that tool measured.
BLOCKERS = 'records/target/BOHEMIA_DEMO_BLOCKERS.json'
blockers = []
if os.path.exists(BLOCKERS):
    blockers = json.load(open(BLOCKERS, encoding='utf8')).get('blockers', [])


def blocker_card(b):
    opts = '\n'.join(
        '<button class="ob" data-o="%s"><b>%s.</b> %s<span class="obw">%s</span></button>'
        % (letter, letter, head, body)
        for letter, head, body in b.get('opts', []))
    why = ('<p class="why">%s</p>' % b['why']) if b.get('why') else ''
    return '''
<div class="blk" data-b="%s">
  <div class="blkhead"><span class="num">%d</span><span class="q">%s</span></div>
  %s
  <div class="opts">%s</div>
  <textarea class="bnote" rows="2" placeholder="or say it in your own words"></textarea>
  <div class="proof">%s</div>
</div>''' % (b['key'], b['n'], b['q'], why, opts, b.get('proof', ''))


blockers_html = ''
if blockers:
    blockers_html = ('<h2 class="blkh">DEMO BLOCKERS &mdash; %d things only you can decide'
                     '</h2><p class="blksub">Everything in flight in the WORLD lane that '
                     'needs you to finish it. One tap each. The first option is the '
                     'realistic one and wins if you say nothing.</p>%s'
                     '<h2>THE ICONS &mdash; thumb what you like</h2>'
                     % (len(blockers), '\n'.join(blocker_card(b) for b in blockers)))

HTML = '''<!doctype html><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>BOHEMIA &mdash; VOTE</title>
<style>
  :root{--ink:#e8e0cc;--bg:#0d0d12;--card:#16161d;--line:#33313d;--gold:#c79a3f}
  body.sun{--ink:#14120c;--bg:#e9e2cd;--card:#f4efdf;--line:#b9ae90}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.45 ui-monospace,SFMono-Regular,Menlo,monospace}
  header{position:sticky;top:0;z-index:5;background:var(--bg);border-bottom:1px solid var(--line);
    padding:10px 12px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
  h1{font-size:14px;letter-spacing:2px;margin:0;flex:1}
  .count{color:var(--gold);font-size:12px}
  button{font:inherit;color:var(--ink);background:var(--card);border:1px solid var(--line);
    border-radius:5px;padding:7px 10px;cursor:pointer}
  .wrap{padding:10px 12px 120px;max-width:640px;margin:0 auto}
  .card{background:var(--card);border:1px solid var(--line);border-radius:8px;margin:0 0 12px;padding:10px}
  .cardhead{display:flex;align-items:center;gap:8px;margin-bottom:6px}
  .nm{letter-spacing:2px;font-size:13px;flex:1}
  .tag{font-size:10px;letter-spacing:1px;padding:2px 6px;border-radius:3px;border:1px solid var(--line)}
  .tag.new{color:#0d0d12;background:var(--gold);border-color:var(--gold)}
  .tag.judged{opacity:.5}
  .shot{display:flex;justify-content:center;background:rgba(0,0,0,.18);border-radius:6px;padding:6px}
  body.sun .shot{background:rgba(0,0,0,.06)}
  .shot img{max-width:100%;height:auto;image-rendering:pixelated}
  .thumbs{display:flex;gap:6px;margin:8px 0 6px}
  .tb{flex:1;text-align:center;padding:9px 4px;font-size:12px;letter-spacing:1px}
  .tb.on.up{background:#2f6b3a;border-color:#3f8b4a;color:#fff}
  .tb.on.cbb{background:#7a6320;border-color:#a5871f;color:#fff}
  .tb.on.down{background:#6b2f2f;border-color:#8b3f3f;color:#fff}
  .note{width:100%;background:transparent;color:var(--ink);border:1px solid var(--line);
    border-radius:5px;padding:6px;font:inherit;resize:vertical}
  h2{font-size:12px;letter-spacing:2px;opacity:.65;margin:22px 0 8px;border-top:1px solid var(--line);padding-top:14px}
  footer{position:fixed;left:0;right:0;bottom:0;background:var(--bg);border-top:1px solid var(--line);
    padding:8px 12px;display:flex;gap:8px;align-items:flex-end}
  footer textarea{flex:1;background:transparent;color:var(--ink);border:1px solid var(--line);
    border-radius:5px;padding:6px;font:inherit;resize:none}
  .empty{opacity:.6;padding:20px 0;text-align:center}
  .blkh{color:var(--gold);opacity:1;border-top:0;margin-top:4px}
  .blksub{opacity:.7;font-size:12px;margin:0 0 12px}
  .blk{background:var(--card);border:1px solid var(--gold);border-radius:8px;margin:0 0 12px;padding:10px}
  .blkhead{display:flex;gap:8px;align-items:flex-start;margin-bottom:6px}
  .num{color:#0d0d12;background:var(--gold);border-radius:3px;padding:1px 7px;font-size:12px;flex:none}
  body.sun .num{color:#f4efdf}
  .q{font-size:13px;line-height:1.35}
  .why{font-size:12px;opacity:.72;margin:0 0 8px}
  .opts{display:flex;flex-direction:column;gap:6px;margin-bottom:6px}
  .ob{text-align:left;padding:9px 10px;font-size:12px;line-height:1.35}
  .ob.on{background:#2f6b3a;border-color:#3f8b4a;color:#fff}
  .obw{display:block;opacity:.72;font-size:11px;margin-top:3px}
  .ob.on .obw{opacity:.9}
  .bnote{width:100%;background:transparent;color:var(--ink);border:1px solid var(--line);
    border-radius:5px;padding:6px;font:inherit;resize:vertical}
  .proof{font-size:10px;opacity:.4;margin-top:6px;word-break:break-all}
</style>
<header>
  <h1>VOTE</h1>
  <span class="count" id="count"></span>
  <button id="sun">SUN</button>
  <button id="exp">EXPORT</button>
</header>
<div class="wrap">
  <div id="blockers">__BLOCKERS__</div>
  <div id="newlist">__NEW__</div>
  <div id="oldwrap"><h2>ALREADY JUDGED &mdash; here so you can change your mind</h2>__OLD__</div>
</div>
<footer>
  <textarea id="global" rows="2" placeholder="anything about the whole batch"></textarea>
  <button id="exp2">EXPORT</button>
</footer>
<script>
(function(){
  var V={}, N={}, B={}, BN={};
  document.addEventListener('click',function(e){
    var ob=e.target.closest('.ob');
    if(ob){
      var blk=ob.closest('.blk'), k=blk.getAttribute('data-b');
      blk.querySelectorAll('.ob').forEach(function(t){t.classList.remove('on');});
      ob.classList.add('on'); B[k]=ob.getAttribute('data-o'); tally(); return;
    }
    var b=e.target.closest('.tb'); if(!b) return;
    var card=b.closest('.card'), d=card.getAttribute('data-d');
    card.querySelectorAll('.tb').forEach(function(t){t.classList.remove('on');});
    b.classList.add('on'); V[d]=b.getAttribute('data-v'); tally();
  });
  document.addEventListener('input',function(e){
    if(e.target.classList.contains('bnote')){
      BN[e.target.closest('.blk').getAttribute('data-b')]=e.target.value; return;
    }
    if(!e.target.classList.contains('note')) return;
    N[e.target.closest('.card').getAttribute('data-d')]=e.target.value;
  });
  function tally(){
    var total=document.querySelectorAll('#newlist .card').length;
    var done=Object.keys(V).filter(function(k){
      return document.querySelector('#newlist .card[data-d="'+k+'"]'); }).length;
    var bt=document.querySelectorAll('.blk').length, bd=Object.keys(B).length;
    document.getElementById('count').textContent=
      (bt? bd+' / '+bt+' decided  \\u00b7  ' : '')+done+' / '+total+' voted';
  }
  document.getElementById('sun').onclick=function(){document.body.classList.toggle('sun');};
  function exp(){
    var L=['BOHEMIA - VOTE, DISTRICT MAP ICONS','__STAMP__','',
           'YES = ship it.  COULD BE BETTER = ships frozen, fix later.  NO = kill it.',''];
    var blks=document.querySelectorAll('.blk');
    if(blks.length){
      L.push('DEMO BLOCKERS -- your answers:','');
      blks.forEach(function(b){
        var k=b.getAttribute('data-b'), a=B[k], n=(BN[k]||'').trim();
        if(!a && !n) return;
        var q=b.querySelector('.q').textContent.trim();
        L.push('@RULING '+k+' '+(a||'-')+'   ('+q+')');
        if(a){
          var on=b.querySelector('.ob.on');
          if(on) L.push('    = '+on.querySelector('b').nextSibling.nodeValue.trim());
        }
        if(n) L.push('    '+n);
      });
      L.push('');
    }
    document.querySelectorAll('.card').forEach(function(c){
      var d=c.getAttribute('data-d'), v=V[d], n=(N[d]||'').trim();
      if(!v && !n) return;
      L.push('@VERDICT '+d+' '+(v?({up:'YES',cbb:'COULD BE BETTER',down:'NO'})[v]:'no-vote'));
      if(n) L.push('    '+n);
    });
    var g=(document.getElementById('global').value||'').trim();
    if(g){L.push('','ON THE WHOLE BATCH:',g);}
    if(L.length<6){L.push('(nothing voted yet)');}
    var blob=new Blob([L.join('\\n')],{type:'text/plain'});
    var a=document.createElement('a');
    a.href=URL.createObjectURL(blob); a.download='BOHEMIA_VOTE.txt'; a.click();
  }
  document.getElementById('exp').onclick=exp;
  document.getElementById('exp2').onclick=exp;
  tally();
})();
</script>
'''

HTML = HTML.replace('__BLOCKERS__', blockers_html)
HTML = HTML.replace('__NEW__', cards_new or '<div class="empty">Nothing waiting. You are all caught up.</div>')
HTML = HTML.replace('__OLD__', cards_old)
HTML = HTML.replace('__STAMP__', '%d waiting, %d already judged' % (len(queue), len(done)))

open(OUT, 'w', encoding='utf8').write(HTML)
print('VOTE TAB: %s' % OUT)
print('  %d waiting for a vote: %s' % (len(queue), ' '.join(h['district'] for h in queue)))
print('  %d already judged: %s' % (len(done), ' '.join(sorted(h['district'] for h in done))))
