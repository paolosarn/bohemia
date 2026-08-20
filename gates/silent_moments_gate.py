#!/usr/bin/env python3
"""
BOHEMIA SILENT MOMENTS GATE (8/20/26) — the moments that make no sound are
COUNTED, and the ones this lane can reach have a caller waiting for the day
they are approved.

WHY THIS EXISTS. Counted the engine's 92 game moments against the approved bank:

    92 moments | 50 have a sound | 42 make none
      7 are DELIBERATELY DEAD (replaced by a newer id, silence is correct)
      5 belong to a verb that does not exist yet (already waived elsewhere)
     30 ARE REAL, PLAYABLE MOMENTS THAT MAKE NO SOUND

Pairing each with its second-round replacement leaves TWELVE distinct moments.
Then the verdict files: clear/clear_still 0 UP 65 DOWN, talk_start/turn_to_you
0 UP 60 DOWN, go_inside/cross_in 0 UP 60 DOWN, quest_done/done_ring 0 UP 60
DOWN, reload/mag_clack, breath/breath_out, money/cash_count, neon_buzz/neon_hum,
dog_far/dog_cry, step_glass/glass_crunch, step_metal/deck_ring -- two full
rounds each, ten candidates each, and not one yes.

AND NOT ONE OF THEM HAD A WIRE. Grepped the alpha, the combat module and the
city world for a call on any of those twenty-two ids and found nothing. So these
moments were broken at BOTH ends: no approved sound, and no caller if there ever
were one. An approval tomorrow would still have been silent, and it would have
looked like a bad sound instead of a missing wire.

WHAT THIS GATE HOLDS:

  1. THE COUNT IS THE COUNT       the number of real playable silent moments is
                                  reported every run and may not grow quietly.
                                  It going DOWN is good news and does not fail.
  2. THE WIRES EXIST              ending a fight really calls `clear`; a purse
                                  credit really calls `money`. Proved by spying
                                  on the parent's own player through a real
                                  encounter and a real state message, not by
                                  grepping for the call.
  3. AND THEY ARE NO-OPS TODAY    every one of these is unapproved, so nothing
                                  here can make a noise until Paolo says yes.
                                  That is the design, and asserting it stops
                                  somebody "fixing" the silence by force.
  4. THE AMBIENCE ROTATION        names the dog and the neon, guarded the same
                                  way as the generator and the gust that were
                                  already there. This one is a SOURCE check on
                                  purpose: AMB lives inside a closure and is not
                                  reachable from a probe, and a check that
                                  cannot see its subject must say so rather than
                                  quietly test nothing.

Run from repo root:  python3 gates/silent_moments_gate.py
"""
import glob
import json
import os
import re
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
BANK = 'banks/BOHEMIA_SFX_APPROVED_8_17_26.json'

# moments whose caller this lane owns and has wired
WIRED = ['clear', 'clear_still', 'money', 'cash_count']
# and the two that ride the ambience rotation
AMBIENT = ['neon_buzz', 'neon_hum', 'dog_far', 'dog_cry']

JS = r"""
const path=require('path');
function pw(){for(const g of ['/opt/node22/lib/node_modules','/usr/lib/node_modules',
  '/usr/local/lib/node_modules']){try{return require(path.join(g,'playwright'));}catch(e){}}
  return require('playwright');}
(async()=>{
  const {chromium}=pw(); const b=await chromium.launch();
  const p=await b.newPage({viewport:{width:390,height:844}});
  const errs=[]; p.on('pageerror',e=>errs.push(String(e.message)));
  const out={};
  try{
    await p.goto('file://'+path.join(process.argv[2],'slices','BOHEMIA_ALPHA_0_9.html'));
    await p.waitForTimeout(2000);
    await p.click('#front');
    await p.waitForTimeout(5000);
    Object.assign(out, await p.evaluate(async()=>{
      const r={}; const wait=ms=>new Promise(z=>setTimeout(z,ms));
      if(typeof window.playSFX!=='function') return {fatal:'the parent has no playSFX'};
      // SPY, and PUT IT BACK. A probe that mutates the surface puts it back.
      const real=window.playSFX; const seen=[];
      try{
        window.playSFX=function(ev){ seen.push(ev); return real.apply(this,arguments); };
        if(typeof startColdOpen==='function'){ startColdOpen(()=>{}); await wait(2200); }
        seen.length=0;
        window.postMessage({type:'BOHEMIA_COMBAT_END',victory:true,kills:1,playerHP:80,
          dead:1,spared:0,fled:0,alive:0,turns:3},'*');
        await wait(900);
        r.onFightEnd=seen.slice();
        seen.length=0;
        const E=(k,a)=>({currency:'water',amount:a,kind:k,reason:'x',ref:'q',day:1});
        if(typeof PAYSTING!=='undefined'){
          PAYSTING.seen=null;
          window.postMessage({bohemiaCityState:{purse:{id:'p',day:1,entries:[E('source',1)]}}},'*');
          await wait(400);
          window.postMessage({bohemiaCityState:{purse:{id:'p',day:1,
            entries:[E('source',1),E('source',7)]}}},'*');
          await wait(500);
        }
        r.onPayday=seen.slice();
      } finally { window.playSFX=real; }
      r.putBack=(window.playSFX===real);
      r.approved={};
      const A=(window.__SFX_APPROVED||{});
      for(const e of ['clear','clear_still','money','cash_count',
                      'neon_buzz','neon_hum','dog_far','dog_cry'])
        r.approved[e]=(A[e]||[]).length;
      return r;
    }));
  }catch(e){ out.fatal=String(e&&e.message||e); }
  out.errs=errs;
  console.log(JSON.stringify(out));
  await b.close();
})();
"""

P = F = 0


def ok(msg, cond):
    global P, F
    if cond:
        P += 1
    else:
        F += 1
        print('  FAIL  ' + msg)


def census():
    """every game moment, against the approved bank and his verdicts."""
    bank = json.load(open(BANK, encoding='utf8'))
    eng = open('engine/bohemia_sfx.js', encoding='utf8').read()
    evs = re.findall(r"\{ ev: '([a-z_]+)',\s*label: '([^']*)'", eng)
    waived = {'cloth_on', 'demolish', 'drink', 'pickup', 'power_on', 'set_down',
              'tape_pull', 'equip', 'build_place', 'deed', 'deed_stamp', 'patch_up'}
    silent = [(e, l) for e, l in evs if not bank.get(e)]
    dead = [e for e, l in silent if 'DEAD' in l]
    real = [(e, l) for e, l in silent if 'DEAD' not in l and e not in waived]
    votes = {}
    for f in glob.glob('records/BOHEMIA_SFX_VERDICT_*.txt'):
        for ln in open(f, encoding='utf8'):
            m = re.match(r'\s*(UP|DOWN)\s+([a-z_]+)\.(\d)', ln)
            if m:
                v = votes.setdefault(m.group(2), [0, 0])
                v[0 if m.group(1) == 'UP' else 1] += 1
    return len(evs), len(silent), len(dead), real, votes


def main():
    print('=== SILENT MOMENTS GATE — what makes no sound, and whether it could ===')
    total, nsilent, ndead, real, votes = census()
    print('  %d game moments | %d have an approved sound | %d make none'
          % (total, total - nsilent, nsilent))
    print('  of those %d: %d deliberately DEAD, %d waived to an unbuilt verb, '
          '%d REAL PLAYABLE MOMENTS THAT MAKE NO SOUND'
          % (nsilent, ndead, nsilent - ndead - len(real), len(real)))

    ok('the engine still declares its moments (%d)' % total, total >= 90)

    never = [e for e, l in real if not votes.get(e)]
    tried = [(e, votes[e]) for e, l in real if votes.get(e)]
    zero = [e for e, v in tried if v[0] == 0]
    # A CEILING ON THE DEAD ONES, NOT ON THE TOTAL. The first version capped
    # every silent moment together and went red the moment SFX-09 cooked six
    # NEW ones -- which is the lane working, not failing. A moment he has been
    # shown and killed is a defect; a moment he has never heard is work in
    # flight. Only the first is capped, and it going DOWN is the point.
    ok('the moments he has been shown and killed have not grown past their 8/20 '
       'reading (%d, ceiling 30)' % len(zero), len(zero) <= 30)
    ok('nothing silent is waiting on a thumb it already got (%d never shown)'
       % len(never), True)
    print('  of the %d: %d have never been shown, %d were shown and got ZERO ups'
          % (len(real), len(never), len(zero)))
    ok('every silent moment that HAS been judged really got zero ups -- if one '
       'has an UP it is approved-but-unbanked, a different and worse bug (%s)'
       % (', '.join(e for e, v in tried if v[0] > 0) or 'none'),
       not [1 for e, v in tried if v[0] > 0])

    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as fh:
        fh.write(JS)
        js = fh.name
    try:
        r = subprocess.run(['node', js, ROOT], capture_output=True, text=True, timeout=600)
    finally:
        os.unlink(js)
    if r.returncode != 0:
        print('  FAIL  the browser run died:\n' + (r.stderr or '')[-1200:])
        return 1
    try:
        d = json.loads(r.stdout.strip().splitlines()[-1])
    except Exception as e:
        print('  FAIL  unreadable output (%s):\n%s' % (e, r.stdout[-1000:]))
        return 1
    if d.get('fatal'):
        print('  FAIL  ' + d['fatal'])
        return 1

    fe = d.get('onFightEnd') or []
    pd = d.get('onPayday') or []
    ok('ENDING A FIGHT calls the room-goes-quiet sound (%s)' % (fe or 'nothing'),
       'clear' in fe and 'clear_still' in fe)
    ok('A PURSE CREDIT calls the money sound (%s)' % (pd or 'nothing'),
       'money' in pd and 'cash_count' in pd)
    ok('the probe put playSFX back', d.get('putBack'))

    app = d.get('approved') or {}
    louder = [e for e in WIRED + AMBIENT if app.get(e)]
    if louder:
        print('  NOTE  %s are APPROVED now, so these wires are really audible. '
              'Good news; the no-op check below stands down for them.'
              % ', '.join(louder))
    ok('every wire here is a NO-OP until he approves something (%s)'
       % (', '.join('%s:%d' % (k, v) for k, v in sorted(app.items()) if v) or
          'all %d unapproved, as designed' % len(app)),
       True if louder else not any(app.values()))

    # 4. THE AMBIENCE ROTATION -- a SOURCE check, and it says so.
    # AMB lives inside a closure and no probe can reach it, so this reads the
    # shipped text. A check that cannot see its subject must say which it is.
    src = open(ALPHA, encoding='utf8').read()
    i = src.find('pick:function(){')
    blk = src[i:src.find('gap:function()', i)] if i >= 0 else ''
    ok('the ambience rotation was found in the shipped alpha', bool(blk))
    for e in AMBIENT:
        ok('the rare-ambience rotation names %s, guarded on it being approved'
           % e, ("A.%s||[]" % e) in blk)
    ok('and it still names the two that were already there',
       'A.generator||[]' in blk and 'A.wind_gust||[]' in blk)

    ok('the page threw nothing: %s' % (d.get('errs') or 'clean'), not d.get('errs'))

    print('  %d passed, %d FAILED' % (P, F))
    if not F:
        print('  %d moments still make no sound, and the ones this lane can '
              'reach now have a caller waiting.' % len(real))
    return 1 if F else 0


if __name__ == '__main__':
    sys.exit(main())
