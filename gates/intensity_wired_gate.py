#!/usr/bin/env python3
"""
INTENSITY WIRED GATE (8/27/26) - all four of his triggers, or it is not his
ladder.

HIS RULING, 8/26, LOCKED:
    "overworld calmness lvl 1 then an enemy trying to hurt you or someone is
     talking to you is lvl 2 then you either kill 2 enemies or theresa whole
     bunch of people close together talking type shit for lvl 3"

Two of the four shipped that day (kills, threat) and two did not. They were
reported as unwired rather than counted as shipped, which was honest, and then
they stayed unwired -- which is how a ruling quietly becomes half a ruling. This
gate exists so that cannot happen again: it drives ALL FOUR on the real surface.

THE ONE THAT NEARLY SHIPPED AS A DISASTER. The obvious signal for "someone is
talking to you" is `__CT.open()`, and it is not a getter:

    open:function(){ ctOpen(); return !!CT_OPEN; }

It OPENS a conversation and then reports that one is open. A watcher polling it
twice a second would have put a dialogue card in the player's face continuously
from the moment they stood next to anybody. A live probe of its RETURN VALUE
looked exactly like a getter -- it answered false over and over, because nobody
was adjacent in the probe -- so the side effect never fired and the wrong model
was confirmed. A NAME IS NOT A CONTRACT, and the check below is permanent.

    python3 gates/intensity_wired_gate.py
"""
import json
import os
import re
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

JS = r'''
const path=require('path');
function pw(){for(const g of ['/opt/node22/lib/node_modules','/usr/lib/node_modules',
  '/usr/local/lib/node_modules']){try{return require(path.join(g,'playwright'));}catch(e){}}
  return require('playwright');}
(async()=>{
  const {chromium}=pw();
  /* --allow-file-access-from-files: on the published site the shell and the city
     are the same origin with no flag. Under file:// Chromium gives every file an
     opaque origin, so without this the watcher's same-origin read would be
     blocked HERE and nowhere else, and the gate would measure the harness. */
  const b=await chromium.launch({args:['--allow-file-access-from-files',
                                       '--autoplay-policy=no-user-gesture-required']});
  const p=await b.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+path.join(process.argv[2],'slices','BOHEMIA_ALPHA_0_9.html'));
  await p.waitForTimeout(1500);
  await p.click('#front',{force:true}).catch(()=>{});
  await p.waitForTimeout(11000);

  const out={};
  const cf=p.frames().find(x=>x.url().includes('CITY_WORLD'));
  out.cityFrame=!!cf;
  if(cf){ await cf.waitForLoadState('load').catch(()=>{}); }
  await p.waitForTimeout(2500);

  out.watcher = await p.evaluate(()=>!!window.__intensityWatch);
  out.reach   = await p.evaluate(()=>{ try{
    const f=document.getElementById('cityFrame');
    return !!(f&&f.contentWindow&&f.contentWindow.__CT&&f.contentWindow.document);
  }catch(e){ return false; } });
  out.knobs   = await p.evaluate(()=>{ try{
    return {min:__intensityWatch.CROWD_MIN, r:__intensityWatch.CROWD_R};
  }catch(e){ return null; } });

  /* ---- 1+2. kills and threat, the two that shipped 8/26 ---------------- */
  out.ladder = await p.evaluate(()=>{
    const I=window.INTENSITY; if(!I) return {err:'no INTENSITY'};
    const L=()=>I.level();
    I.reset();                       const calm=L();
    I.setThreat(true);               const threat=L();
    I.reset(); I.killed();           const one=L();
    I.killed();                      const two=L();
    I.reset();
    return {calm, threat, one, two};
  });

  /* ---- 3. TALKING, driven on the REAL conversation card ---------------- */
  /* The card is shown and hidden directly. __CT.open() is NOT used to set it up:
     it is an action, it re-runs ctOpen(), and an earlier probe of this very
     behaviour silently undid its own setup that way. */
  out.talk = {};
  if(cf){
    await p.evaluate(()=>{ INTENSITY.reset(); __intensityWatch.look(); });
    out.talk.before = await p.evaluate(()=>INTENSITY.level());
    out.talk.cardSet = await cf.evaluate(()=>{ const c=document.getElementById('ctcard');
      if(!c) return 'no card'; c.style.display='block';
      return getComputedStyle(c).display; }).catch(e=>'ERR');
    await p.waitForTimeout(1200);                 /* its OWN timer, not a poke */
    out.talk.during = await p.evaluate(()=>INTENSITY.level());
    await cf.evaluate(()=>{ const c=document.getElementById('ctcard');
      if(c) c.style.display='none'; }).catch(()=>{});
    await p.waitForTimeout(1200);
    out.talk.after = await p.evaluate(()=>INTENSITY.level());
  }

  /* ---- 4. CROWD, at the threshold ------------------------------------- */
  /* THE CITY'S DISTANCES ARE REAL AND WERE MEASURED (this world reports people
     at d = 2, 192, 963, 964 from the player). What is under test here is the
     COUNTING AND THE THRESHOLD, which is the part this lane wrote, so
     everyone() is fed controlled input and put back afterwards. A probe that
     mutates the surface puts it back. */
  out.crowd = {};
  if(cf){
    const cases = [
      {name:'three within five',        ds:[1,2,4],       want:3},
      {name:'two within five',          ds:[1,2],         want:1},
      {name:'three but far apart',      ds:[9,12,40],     want:1},
      {name:'three on the radius edge', ds:[5,5,5],       want:3},
      {name:'three just outside it',    ds:[6,6,6],       want:1}
    ];
    out.crowd.rows=[];
    for(const c of cases){
      await cf.evaluate(ds=>{ window.__CT_REAL = window.__CT_REAL || window.__CT.everyone;
        window.__CT.everyone = ()=>ds.map((d,i)=>({key:'p'+i,tier:1,name:'x',
          heading:'',x:0,y:0,d:d})); }, c.ds);
      await p.evaluate(()=>{ INTENSITY.reset(); });
      await p.waitForTimeout(1200);
      const got = await p.evaluate(()=>INTENSITY.level());
      out.crowd.rows.push({name:c.name, ds:c.ds, want:c.want, got:got});
    }
    await cf.evaluate(()=>{ if(window.__CT_REAL){ window.__CT.everyone=window.__CT_REAL;
      delete window.__CT_REAL; } });
    await p.evaluate(()=>{ INTENSITY.reset(); });
  }

  out.errors=errs.slice(0,3);
  console.log(JSON.stringify(out));
  await b.close();
})();
'''


def main():
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as f:
        f.write(JS)
        js = f.name
    try:
        r = subprocess.run(['node', js, ROOT], capture_output=True, text=True, timeout=600)
    finally:
        os.unlink(js)

    print('=== INTENSITY WIRED GATE - all four of his triggers, or it is not his ladder ===')
    line = [l for l in r.stdout.strip().split('\n') if l.startswith('{')]
    if not line:
        print('  > FAIL the browser run produced nothing')
        print(r.stdout[-1000:])
        print(r.stderr[-1000:])
        return 1
    d = json.loads(line[-1])
    p = f = 0

    def ok(name, cond):
        nonlocal p, f
        if cond:
            p += 1
        else:
            f += 1
            print('  > FAIL ' + name)

    # ---- THE SIDE-EFFECT TRAP, checked in the source, permanently ---------
    alpha = open(os.path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), encoding='utf8').read()
    i = alpha.find('__INTENSITY_WATCHER__')
    raw = alpha[i:i + 4000] if i >= 0 else ''
    # STRIP THE COMMENTS BEFORE SEARCHING FOR CODE. The first run of this check
    # went red on the watcher's own comment -- the one explaining why __CT.open()
    # must never be called. FOURTH TIME THIS SESSION a check has matched prose
    # instead of code (the deploy step, the graveyard sweep, the ghost-instrument
    # detector, this). A checker that cannot tell a mention from a use is the
    # broken one.
    body = re.sub(r'/\*.*?\*/', '', raw, flags=re.S)
    body = re.sub(r'//[^\n]*', '', body)
    ok('the watcher is in the shipped shell at all', i >= 0)
    ok('AND IT NEVER CALLS __CT.open(). That reads like a getter and is an '
       'ACTION -- `open:function(){ ctOpen(); return !!CT_OPEN; }` -- so polling '
       'it twice a second would open a dialogue card in the player\'s face '
       'forever. A NAME IS NOT A CONTRACT',
       '__CT.open(' not in body and '.open()' not in body)
    ok('and it reads the visible card instead, which is the same fact and costs '
       'nothing', 'ctcard' in body)
    ok('and the CITY FILE ITSELF IS NOT EDITED: this is a read across a frame '
       'the shell already owns, not a change to another lane\'s system',
       '__intensityWatch' not in
       open(os.path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), encoding='utf8').read())

    ok('the walked city is loaded, so this is the real surface', d.get('cityFrame'))
    ok('the watcher is alive in the shell', d.get('watcher'))
    ok('and it can actually READ the city frame (same-origin)', d.get('reach'))

    k = d.get('knobs') or {}
    ok('his unruled numbers are inspectable rather than buried: %s people within '
       '%s tiles' % (k.get('min'), k.get('r')), k.get('min') and k.get('r'))

    L = d.get('ladder') or {}
    ok('LEVEL 1 overworld calm (%s)' % L.get('calm'), L.get('calm') == 1)
    ok('LEVEL 2 an enemy trying to hurt you (%s)' % L.get('threat'), L.get('threat') == 2)
    ok('one kill is NOT enough, he said two (%s)' % L.get('one'), L.get('one') == 1)
    ok('LEVEL 3 two kills (%s)' % L.get('two'), L.get('two') == 3)

    t = d.get('talk') or {}
    ok('LEVEL 2 SOMEBODY TALKING TO YOU: a real conversation card raises it, and '
       'it does so ON ITS OWN TIMER rather than because the gate poked it '
       '(%s -> %s)' % (t.get('before'), t.get('during')),
       t.get('before') == 1 and t.get('during') == 2)
    ok('and it LETS GO when the conversation closes -- a level that only ever '
       'climbs is a stuck level (%s)' % t.get('after'), t.get('after') == 1)

    rows = (d.get('crowd') or {}).get('rows') or []
    ok('the crowd threshold was driven at its edges (%d case(s))' % len(rows),
       len(rows) == 5)
    for row in rows:
        ok('LEVEL 3 CROWD, %s: distances %s -> level %s (wanted %s)'
           % (row['name'], row['ds'], row['got'], row['want']),
           row['got'] == row['want'])

    ok('the page threw nothing: %s' % (d.get('errors') or 'clean'), not d.get('errors'))

    print('  %d passed, %d FAILED' % (p, f))
    if not f:
        print('  All four of his triggers fire on the real surface, and the one '
              'that would have opened a dialogue card forever cannot come back.')
    return 1 if f else 0


if __name__ == '__main__':
    sys.exit(main())
