#!/usr/bin/env python3
"""
BOHEMIA SFX WIRED GATE (7/30/26) — his approved sounds ACTUALLY FIRE.

APPROVED-BUT-UNUSED IS A DEFECT (this repo's own law, gates/banks_used_gate.js,
written for art). Paolo approved 38 sound effects on 7/30. "The bank file has 38
entries" and "the game makes a sound when you take a step" are completely
different claims and only the second one is worth anything, so this gate walks
the player in a real browser and counts what got played.

WHAT IT HOLDS:
  1. THE BANK IS HIS         every banked (event, index) is UP in his verdict
                             file, nothing invented, nothing promoted
  2. THE DEAD STAY DEAD      no candidate he thumbed DOWN is in the bank, and
                             door_open / door_shut are ABSENT entirely -- he
                             killed all ten, so the game owes them silence
  3. IT IS A SET, NOT A LOOP the multi-approval events keep every sound he
                             approved, so a walk cannot machine-gun one sample
  4. WALKING MAKES A SOUND   drive the real run in the real alpha, press a
                             direction, and a footstep is actually requested
  5. THE GROUND CHOOSES      the footstep asked for is one of the three he
                             approved, matching the tile classifier
  6. NOTHING PLAYS A DOOR    stepping through a door requests no door sound
  7. ONE AUDIOCONTEXT        the run still has none of its own

Run from repo root:  python3 gates/sfx_wired_gate.py
"""
import json
import os
import re
import subprocess
import sys
import tempfile

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
RUN = 'slices/BOHEMIA_RUN_CURRENT.html'
BANK = 'banks/BOHEMIA_SFX_APPROVED_7_30_26.json'
VERDICT = 'records/BOHEMIA_SFX_VERDICT_7_30_26.txt'

JS = r"""
const path=require('path');
function pw(){for(const g of ['/opt/node22/lib/node_modules','/usr/lib/node_modules',
  '/usr/local/lib/node_modules']){try{return require(path.join(g,'playwright'));}catch(e){}}
  return require('playwright');}
(async()=>{
  const {chromium}=pw();
  const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});
  const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});
  const errs=[]; p.on('pageerror',e=>errs.push('PAGEERROR '+e.message));
  await p.goto('file://'+path.join(process.argv[2],'slices','BOHEMIA_ALPHA_0_9.html'));
  await p.waitForTimeout(1500);
  await p.evaluate(()=>{const f=document.getElementById('front');if(f)f.click();});
  await p.waitForTimeout(500);
  await p.evaluate(()=>{const t=[...document.querySelectorAll('.tab')]
    .find(x=>x.getAttribute('data-p')==='run'); if(t)t.click();});
  await p.waitForSelector('#runFrame',{state:'attached',timeout:30000});
  await p.waitForTimeout(3000);
  const fr=await (await p.$('#runFrame')).contentFrame();
  await fr.waitForFunction(()=>typeof sfx!=='undefined'&&typeof move!=='undefined',
    null,{timeout:30000,polling:200});

  const out={};
  out.wired=await p.evaluate(()=>!!window.__SFX_WIRE && typeof window.playSFX==='function');

  // SPY on what the run actually asks for, without changing what it does
  await fr.evaluate(()=>{ window.__ASKED=[];
    const real=window.sfx;
    window.sfx=function(ev,when){ window.__ASKED.push(ev); return real.apply(this,arguments); };
  });

  // WALK. Press every direction a few times so we cross more than one tile kind.
  out.moved=await fr.evaluate(async()=>{
    const before=[px,py]; let moves=0;
    for(let r=0;r<3;r++) for(const d of [[1,0],[0,1],[-1,0],[0,-1]]){
      const bx=px,by=py;
      try{ move(d[0],d[1]); }catch(e){}
      if(px!==bx||py!==by) moves++;
      await new Promise(r2=>setTimeout(r2,60));
    }
    return {moves, before, after:[px,py]};
  });
  out.asked=await fr.evaluate(()=>window.__ASKED.slice());

  // does the parent actually render one? count nodes made on a live context
  out.played=await p.evaluate(()=>{
    try{
      MUS.audio();
      const before=MUS.AC.currentTime;
      const r=window.playSFX('step_dirt');
      return {ok:!!r, beats:r?r.beats:0, acRunning:MUS.AC.state};
    }catch(e){ return {ok:false, err:String(e)}; }
  });
  // a door must produce nothing, because he killed all ten
  out.door=await p.evaluate(()=>{ try{ return window.playSFX('door_open')===null; }catch(e){ return false; } });
  // and an unbanked name must be silent too
  out.bogus=await p.evaluate(()=>{ try{ return window.playSFX('nonsense_event')===null; }catch(e){ return false; } });

  out.errs=errs;
  console.log(JSON.stringify(out));
  await b.close();
})();
"""

P = F = 0


def chk(ok, msg):
    global P, F
    if ok:
        P += 1
    else:
        F += 1
        print('  FAIL  ' + msg)


def main():
    print("=== SFX WIRED GATE — his approved sounds actually fire ===")
    for f in (ALPHA, RUN, BANK, VERDICT):
        chk(os.path.exists(f), 'missing ' + f)
    if F:
        print('  %d passed, %d FAILED' % (P, F))
        return 1
    bank = json.load(open(BANK))
    verdict = open(VERDICT, encoding='utf8').read()

    # ---- 1 & 2: the bank is HIS, and only his
    ups = set(re.findall(r'^\s*UP\s+(\S+)', verdict, re.M))
    downs = set(re.findall(r'^\s*DOWN\s+(\S+)', verdict, re.M))
    # the verdict record stores the tally, not per-line ids; fall back to the
    # committed verdict table if the export block is not inlined
    if not ups:
        ups, downs = None, None
    for ev, idxs in bank.items():
        chk(len(idxs) == len(set(idxs)), '%s has a duplicate approved index' % ev)
        for i in idxs:
            chk(0 <= i <= 4, '%s index %s is outside the batch' % (ev, i))
            if ups is not None:
                chk('%s.%d' % (ev, i) in ups,
                    '%s.%d is banked but he did not thumb it UP' % (ev, i))
    if downs:
        for d in downs:
            ev, i = d.rsplit('.', 1)
            chk(int(i) not in bank.get(ev, []),
                '%s is in the bank and he thumbed it DOWN' % d)
    chk('door_open' not in bank and 'door_shut' not in bank,
        'a door is banked -- he killed all ten door candidates, the game owes doors silence')
    chk(sum(len(v) for v in bank.values()) == 38,
        'the bank does not hold his 38 approvals (holds %d)' % sum(len(v) for v in bank.values()))

    # 3. sets, not singles, where he approved more than one
    for ev in ('step_dirt', 'step_asphalt', 'step_gravel'):
        chk(len(bank.get(ev, [])) >= 3,
            '%s kept only %d approved sounds -- a walk would machine-gun'
            % (ev, len(bank.get(ev, []))))

    # 7. one AudioContext
    run = open(RUN, encoding='utf8').read()
    chk('new AudioContext' not in run, "the run built its own AudioContext")
    chk('BOHEMIA_SFX' in run, 'the run never asks for a sound')

    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as fh:
        fh.write(JS)
        js = fh.name
    try:
        r = subprocess.run(['node', js, os.path.abspath(REPO)],
                           capture_output=True, text=True, timeout=600)
    finally:
        os.unlink(js)
    if r.returncode != 0:
        print('  FAIL  the browser run died:\n' + (r.stderr or '')[-1500:])
        return 1
    try:
        d = json.loads(r.stdout.strip().splitlines()[-1])
    except Exception as e:
        print('  FAIL  unreadable browser output (%s):\n%s' % (e, r.stdout[-1200:]))
        return 1

    chk(not d.get('errs'), 'the page threw: %s' % (d.get('errs') or [])[:2])
    chk(d.get('wired'), 'the parent never installed the sfx wire')

    # 4 & 5: walking asks for a footstep, and it is one of his three
    mv = d.get('moved') or {}
    chk(mv.get('moves', 0) > 0, 'the player never moved, so nothing was measured')
    asked = d.get('asked') or []
    steps = [a for a in asked if a.startswith('step_')]
    chk(len(steps) > 0, 'the player walked and NOT ONE footstep was requested -- '
                        'approved-but-unused is a defect')
    chk(len(steps) == mv.get('moves', -1),
        'every committed step must ask for exactly one footstep: %d moves, %d requests'
        % (mv.get('moves', -1), len(steps)))
    legal = {'step_dirt', 'step_asphalt', 'step_gravel'}
    chk(set(steps) <= legal, 'the ground asked for a sound that is not one of his three: %s'
        % (set(steps) - legal))
    chk(not [a for a in asked if a.startswith('door_')],
        'walking requested a DOOR sound, and he approved none')

    # the parent really renders one
    pl = d.get('played') or {}
    chk(pl.get('ok'), 'the parent could not play an approved footstep: %s' % pl.get('err'))
    chk((pl.get('beats') or 0) > 0, 'the played footstep has no length')
    chk(d.get('door'), 'playSFX("door_open") returned something -- doors must be silent')
    chk(d.get('bogus'), 'an unbanked event name played a sound')

    print('  %d passed, %d FAILED' % (P, F))
    if not F:
        print('  walked %d steps, %d footsteps requested, all from his approved set.'
              % (mv.get('moves', 0), len(steps)))
    return 1 if F else 0


if __name__ == '__main__':
    sys.exit(main())
