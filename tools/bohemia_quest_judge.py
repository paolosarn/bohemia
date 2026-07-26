#!/usr/bin/env python3
"""
BOHEMIA QUEST JUDGE (7/25/26) - Paolo judges the NINE REAL CANON QUESTS, the
first playable Bohemia quests ever to ship into the live phone.

These are not mockups. Each card carries the quest's real parsed content, the
REAL tile the casting bridge cast it to in the live valley (faction + x/y,
computed by actually booting engine/bohemia_loop.js - so this page reports the
world, it does not imagine it), and a genuinely PLAYABLE runner: the same
engine/bohemia_bq.js + engine/bohemia_quest_runtime.js the game runs, inlined.
He taps through the real dialogue, hits a real ending, and sees which CLOUT tag
that ending carries - then thumbs it.

REUSE CHECK: no graphic pixels are cooked here at all (this is a text/dialogue
judge, not an art judge), so banks/ has nothing to offer and nothing was cooked.
The quest CONTENT is read verbatim from quests/bq/*.bq; the engines are the real
shipped modules, inlined, never reimplemented.

TASTE CHECK: laws/BOHEMIA_PAOLO_TASTE_CANON.md - no em dashes in any UI copy, no
purple anywhere (the Amalgamation's alone), exports .txt never .json, SUN MODE
daylight-readable, comment box at the bottom always. No art is generated, so the
45-degree / tan-ratio / flat-side-on NEVERs do not apply to this surface.

Verdict workflow per law: thumbs per quest, per-quest comment, global comment
box, SUN MODE, export .txt (never .json). Reached from inside the alpha:
LIFE tab -> hub -> JUDGE THE 9 CANON QUESTS (one-alpha law; a judge tool is
never "the build").

  python3 tools/bohemia_quest_judge.py
    -> slices/BOHEMIA_QUEST_JUDGE_7_25_26.html
"""
import json
import os
import re
import subprocess

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
BQ_DIR = 'quests/bq'
OUT = 'slices/BOHEMIA_QUEST_JUDGE_7_25_26.html'

files = sorted(f for f in os.listdir(BQ_DIR) if f.endswith('.bq'))
if not files:
    raise SystemExit('QUEST JUDGE REFUSES: no .bq quests found in ' + BQ_DIR)

# THE REAL CAST, from the REAL engine. We boot the actual loop and ask it where
# each quest lands, rather than re-deriving the rule here (two implementations of
# one rule is exactly how drift becomes canon).
CAST_JS = r'''
var fs=require('fs'), path=require('path');
var L=require('./engine/bohemia_loop.js');
var ctx=L.boot({seed:'bohemia'});
var out={};
fs.readdirSync('quests/bq').filter(function(f){return /\.bq$/.test(f);}).sort().forEach(function(f){
  var rec=ctx.quests.cast(fs.readFileSync(path.join('quests/bq',f),'utf8'));
  out[f]={x:rec.at.x,y:rec.at.y,channel:rec.at.channel,speaker:rec.at.speaker,faction:rec.at.faction};
});
process.stdout.write(JSON.stringify(out));
'''
cast = json.loads(subprocess.run(['node', '-e', CAST_JS], capture_output=True,
                                 text=True, check=True).stdout)

CLOUT = ('quiet', 'notable', 'risky', 'reckless')


def summarize(text):
    """Pull the human-readable spine out of a .bq: title, act, premise, endings.
    Read-only parsing for DISPLAY; the playable runner uses the real engine."""
    title = ''
    act = ''
    m = re.search(r'^@QUEST\s+(\S+)\s+(.*)$', text, re.M)
    qid, title = (m.group(1), m.group(2).strip()) if m else ('', '')
    m = re.search(r'^@ACT\s+(\S+)', text, re.M)
    act = m.group(1) if m else ''
    once = not re.search(r'^@ONCE\s+false', text, re.M)
    # premise: the @SAY lines of the first @TALK block
    premise = []
    blocks = re.split(r'^@TALK\s+', text, flags=re.M)
    if len(blocks) > 1:
        for line in blocks[1].split('\n'):
            s = re.match(r'^\s*@SAY\s+(.*)$', line)
            if s:
                premise.append(re.sub(r'\s*#\w+\s*$', '', s.group(1)).strip())
            if line.startswith('@END'):
                break
    # endings: terminal stages with their clout tag + log
    endings = []
    for sm in re.finditer(r'^@STAGE\s+(\d+)\s+(COMPLETE|FAIL)([^\n]*)\n((?:\s+@[^\n]*\n)*)',
                          text, re.M):
        tags = [t for t in re.findall(r'#(\w+)', sm.group(3)) if t in CLOUT]
        log = re.search(r'@LOG\s+(.*)', sm.group(4))
        endings.append({'n': int(sm.group(1)), 'kind': sm.group(2),
                        'clout': tags[0] if tags else '',
                        'log': log.group(1).strip() if log else ''})
    roles = [{'name': r.group(1), 'req': r.group(2) == 'REQ', 'cond': r.group(3).strip()}
             for r in re.finditer(r'^@ROLE\s+(\S+)\s+(REQ|OPT)\s+(.*)$', text, re.M)]
    noverbs = re.findall(r'^\s*@NOVERB\s+"?(.*?)"?\s*$', text, re.M)
    return {'id': qid, 'title': title, 'act': act, 'once': once, 'premise': premise,
            'endings': endings, 'roles': roles, 'noverbs': noverbs}


quests = []
for f in files:
    text = open(os.path.join(BQ_DIR, f), encoding='utf-8').read()
    q = summarize(text)
    q['file'] = f
    q['src'] = text
    q['cast'] = cast.get(f, {})
    quests.append(q)

bq_js = open('engine/bohemia_bq.js', encoding='utf-8').read()
rt_js = open('engine/bohemia_quest_runtime.js', encoding='utf-8').read()

html = """<meta charset="utf-8">
<title>BOHEMIA - JUDGE THE 9 CANON QUESTS</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<body id="bd" style="margin:0;background:#0d0f0a;font-family:-apple-system,sans-serif;color:#ddd">
<div id="bar" style="position:sticky;top:0;z-index:9;background:#0d0f0a;padding:10px 12px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;border-bottom:1px solid #2a2a1f">
  <div id="hdr" style="font:700 15px -apple-system,sans-serif;color:#cdbd8a;flex:1">THE 9 CANON QUESTS <span id="tally" style="font:600 11px monospace;color:#8f8770"></span></div>
  <button id="sun" style="padding:9px 13px;border-radius:8px;border:1px solid #887;background:#222;color:#ddd">&#9728; SUN MODE</button>
  <button id="exp" style="padding:9px 13px;border-radius:8px;background:#3f8c3f;color:#fff;border:0">&#10515; EXPORT .txt</button>
</div>
<div id="intro" style="font:12px/1.6 -apple-system,sans-serif;color:#8f8770;padding:12px 14px 0;max-width:760px">
  These are the first playable Bohemia quests, live in the phone right now. Every one
  is real: real dialogue, real forks, real endings. Tap PLAY IT and walk one to an
  ending, then thumb it. The ending you land on decides your CLOUT, which is what the
  feed rewards. WHERE says the real tile the engine cast the quest to in the valley.
</div>
<div id="list"></div>
<div style="padding:16px 14px 60px;max-width:760px">
  <div id="gcap" style="font:12px sans-serif;color:#8f8770;margin-bottom:4px">PAOLO COMMENTS (rides the export):</div>
  <textarea id="gc" rows="5" style="width:100%;padding:10px;border-radius:10px;border:1px solid #888;box-sizing:border-box;background:#111;color:#ddd;font:13px sans-serif"></textarea>
</div>
<script>__BQ__</script>
<script>__RT__</script>
<script>
const QUESTS = __DATA__;
let SUN=false; const verdict={}, comments={}, played={};
const CLOUT_COL={quiet:'#7f9a6a',notable:'#c79a3f',risky:'#d47a30',reckless:'#c8503a'};

function tally(){
  const up=Object.values(verdict).filter(v=>v==='up').length;
  const dn=Object.values(verdict).filter(v=>v==='down').length;
  document.getElementById('tally').textContent='('+up+' up / '+dn+' down / '+(QUESTS.length-up-dn)+' unjudged)';
}

function runner(q, host){
  const rt = new BQRuntime.Runtime(BQ.parse(q.src)).start();
  const seenNodes = {};
  const log = document.createElement('div');
  log.style.cssText='font:12px/1.6 ui-monospace,monospace;white-space:pre-wrap;margin-top:8px;padding:10px;border-radius:8px;max-height:320px;overflow:auto;background:'+(SUN?'#fff8e6':'#0a0c08')+';color:'+(SUN?'#3a3320':'#b9b09a');
  const opts = document.createElement('div');
  opts.style.cssText='display:flex;flex-direction:column;gap:6px;margin-top:8px';
  function say(t,col){ const p=document.createElement('div'); if(col)p.style.color=col; p.textContent=t; log.appendChild(p); log.scrollTop=log.scrollHeight; }
  function draw(){
    opts.innerHTML='';
    if(rt.state.done){
      const tag=(rt.state.doneTags||[]).filter(t=>CLOUT_COL[t])[0]||'';
      say('');
      say('>> '+rt.state.outcome+(tag?('  #'+tag):''), CLOUT_COL[tag]||'#cdbd8a');
      played[q.id]=(rt.state.outcome||'')+(tag?(' #'+tag):'');
      const again=document.createElement('button');
      again.textContent='play it again';
      again.style.cssText='padding:8px;border-radius:8px;border:1px solid #776;background:transparent;color:'+(SUN?'#3a3320':'#9a9480');
      again.onclick=()=>{ host.innerHTML=''; runner(q,host); };
      opts.appendChild(again);
      return;
    }
    if(!rt.node){
      const avail=rt.available();
      if(!avail.length){ say('(nothing more to say right now)'); return; }
      /* A quest's entry nodes stay open as long as their stage gate holds, so an
         intro you already heard is still legally re-enterable. Mark what you have
         already sat through so the NEW thread is the obvious one to tap - without
         touching the quest's own content, which decides what is reachable. */
      avail.forEach(id=>{
        const b=document.createElement('button');
        const seen=!!seenNodes[id];
        b.textContent=(seen?'\\u21BA again: ':'\\u25B8 talk: ')+id;
        b.style.cssText='text-align:left;padding:9px;border-radius:8px;border:1px solid '+(seen?'#4a4a3a':'#6a5')+';background:transparent;opacity:'+(seen?'0.55':'1')+';color:'+(SUN?'#3a3320':'#cdbd8a')+';font:13px sans-serif';
        b.onclick=()=>{ seenNodes[id]=true; rt.begin(id); const v=rt.view(); (v.says||[]).forEach(s=>say(s)); draw(); };
        opts.appendChild(b);
      });
      return;
    }
    const v=rt.view();
    if(!v.options.length){ rt.node=null; draw(); return; }
    v.options.forEach(o=>{
      const b=document.createElement('button');
      b.textContent=(o.silence?'(say nothing) ':'')+o.text+(o.trap?'   \\u26A0':'');
      b.style.cssText='text-align:left;padding:9px;border-radius:8px;border:1px solid #6a5;background:transparent;color:'+(SUN?'#3a3320':'#cdbd8a')+';font:13px sans-serif';
      b.onclick=()=>{ say('   > '+o.text, SUN?'#6a6045':'#8f8770'); rt.choose(o.i); const nv=rt.view(); (nv.says||[]).forEach(s=>say(s)); draw(); };
      opts.appendChild(b);
    });
    if(v.noverbs && v.noverbs.length){
      v.noverbs.forEach(n=>{
        const d=document.createElement('div');
        d.textContent='\\u2716 '+n+'  (the thing you cannot say)';
        d.style.cssText='font:12px sans-serif;color:'+(SUN?'#9a8f70':'#6a6455')+';padding:4px 2px';
        opts.appendChild(d);
      });
    }
  }
  host.appendChild(log); host.appendChild(opts);
  say('(tap a talk to begin)');
  draw();
}

function build(){
  document.body.style.background=SUN?'#efe7cf':'#0d0f0a';
  document.getElementById('bar').style.background=SUN?'#efe7cf':'#0d0f0a';
  document.getElementById('hdr').style.color=SUN?'#3a3320':'#cdbd8a';
  document.getElementById('intro').style.color=SUN?'#6a6045':'#8f8770';
  document.getElementById('gcap').style.color=SUN?'#6a6045':'#8f8770';
  const gc=document.getElementById('gc');
  gc.style.background=SUN?'#fff':'#111'; gc.style.color=SUN?'#222':'#ddd';
  const list=document.getElementById('list'); list.innerHTML='';
  QUESTS.forEach(q=>{
    const card=document.createElement('div');
    card.style.cssText='margin:14px 12px;border-radius:12px;padding:14px;background:'+(SUN?'#e4dbc0':'#181a12')+';border:1px solid '+(SUN?'#c9bd9a':'#2a2a1f');
    const t=document.createElement('div');
    t.style.cssText='font:700 16px -apple-system,sans-serif;color:'+(SUN?'#3a3320':'#cdbd8a');
    t.textContent=q.title;
    card.appendChild(t);

    const meta=document.createElement('div');
    meta.style.cssText='font:11px ui-monospace,monospace;color:'+(SUN?'#7a6f50':'#8f8770')+';margin-top:3px';
    const c=q.cast||{};
    meta.textContent='ACT '+q.act+'  \\u00B7  '+q.file+(q.once?'':'  \\u00B7  REPEATABLE');
    card.appendChild(meta);

    const where=document.createElement('div');
    where.style.cssText='font:11px ui-monospace,monospace;margin-top:6px;padding:7px 9px;border-radius:7px;background:'+(SUN?'#d8ceae':'#12140d')+';color:'+(SUN?'#5a5138':'#9a9480');
    where.textContent='WHERE: '+(c.faction?('on ground the '+c.faction+' hold'):'anywhere real in the valley')
      +'  \\u00B7  X'+c.x+' Y'+c.y+'  \\u00B7  '+(c.channel==='inperson'?'IN PERSON ONLY (no phone)':'over the phone')
      +(c.speaker?('  \\u00B7  '+c.speaker):'');
    card.appendChild(where);

    if(q.premise.length){
      const p=document.createElement('div');
      p.style.cssText='font:13px/1.6 -apple-system,sans-serif;margin-top:9px;color:'+(SUN?'#3a3320':'#c8c0a8');
      p.textContent='\\u201C'+q.premise.join(' ')+'\\u201D';
      card.appendChild(p);
    }

    const eh=document.createElement('div');
    eh.style.cssText='font:11px sans-serif;color:'+(SUN?'#7a6f50':'#8f8770')+';margin:11px 0 5px';
    eh.textContent='HOW IT CAN END';
    card.appendChild(eh);
    q.endings.forEach(e=>{
      const row=document.createElement('div');
      row.style.cssText='font:12px/1.5 -apple-system,sans-serif;margin:0 0 5px;padding-left:9px;border-left:3px solid '+(CLOUT_COL[e.clout]||'#555')+';color:'+(SUN?'#4a4230':'#b0a890');
      row.textContent=(e.clout?('#'+e.clout+'  '):'')+(e.kind==='FAIL'?'(walk away)  ':'')+e.log;
      card.appendChild(row);
    });

    const playWrap=document.createElement('div');
    const play=document.createElement('button');
    play.textContent='\\u25B6 PLAY IT';
    play.style.cssText='margin-top:11px;padding:10px 14px;border-radius:9px;border:0;background:#3f6c8c;color:#fff;font:600 13px sans-serif';
    play.onclick=()=>{ play.remove(); runner(q, playWrap); };
    card.appendChild(play); card.appendChild(playWrap);

    const row=document.createElement('div');
    row.style.cssText='display:flex;gap:8px;margin-top:12px';
    [['up','\\uD83D\\uDC4D','#3f8c3f'],['down','\\uD83D\\uDC4E','#8c3f3f']].forEach(([k,glyph,col])=>{
      const b=document.createElement('button');
      b.textContent=glyph;
      b.style.cssText='flex:1;padding:11px;border-radius:9px;font-size:19px;border:2px solid '+(verdict[q.id]===k?col:'transparent')+';background:'+(verdict[q.id]===k?col:(SUN?'#d8ceae':'#12140d'));
      b.onclick=()=>{ verdict[q.id]=(verdict[q.id]===k?null:k); build(); };
      row.appendChild(b);
    });
    card.appendChild(row);

    const cm=document.createElement('textarea');
    cm.rows=2; cm.placeholder='comment on '+q.title;
    cm.value=comments[q.id]||'';
    cm.style.cssText='width:100%;margin-top:7px;padding:8px;border-radius:8px;border:1px solid #888;box-sizing:border-box;background:'+(SUN?'#fff':'#111')+';color:'+(SUN?'#222':'#ddd')+';font:13px sans-serif';
    cm.oninput=()=>{ comments[q.id]=cm.value; };
    card.appendChild(cm);

    list.appendChild(card);
  });
  tally();
}

function exportTxt(){
  const L=[];
  L.push('BOHEMIA QUEST VERDICT - THE 9 CANON QUESTS');
  L.push('the first playable Bohemia quests, live in the phone');
  L.push('');
  QUESTS.forEach(q=>{
    const v=verdict[q.id]||'UNJUDGED';
    L.push('['+(v==='up'?'UP':v==='down'?'DOWN':'UNJUDGED')+']  '+q.title+'   ('+q.file+')');
    const c=q.cast||{};
    L.push('    cast to: '+(c.faction||'any real district')+' X'+c.x+' Y'+c.y+' '+(c.channel||''));
    if(played[q.id]) L.push('    Paolo played it to: '+played[q.id]);
    if(comments[q.id]) L.push('    comment: '+comments[q.id]);
    L.push('');
  });
  const up=Object.values(verdict).filter(v=>v==='up').length;
  const dn=Object.values(verdict).filter(v=>v==='down').length;
  L.push('TALLY: '+up+' up, '+dn+' down, '+(QUESTS.length-up-dn)+' unjudged');
  L.push('');
  L.push('PAOLO COMMENTS:');
  L.push(document.getElementById('gc').value||'(none)');
  const blob=new Blob([L.join('\\n')],{type:'text/plain'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='BOHEMIA_QUEST_VERDICT_7_25_26.txt'; a.click();
}
document.getElementById('sun').onclick=()=>{ SUN=!SUN; build(); };
document.getElementById('exp').onclick=exportTxt;
build();
</script>
"""

html = (html.replace('__BQ__', bq_js)
            .replace('__RT__', rt_js)
            .replace('__DATA__', json.dumps(quests)))
open(OUT, 'w', encoding='utf-8').write(html)
print('built %s (%d quests, %d bytes)' % (OUT, len(quests), len(html)))
