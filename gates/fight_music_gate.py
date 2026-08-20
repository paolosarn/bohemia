#!/usr/bin/env python3
"""
BOHEMIA FIGHT MUSIC GATE (8/19/26) — the music knows when you are in a fight,
and it is PROVED BY PLAYING ONE, not by grepping for a function name.

WHY THIS GATE EXISTS. Measured on the shipped alpha before FIGHTMUS: tap in, let
the opening hand over to the streets, call startColdOpen -- THE COLD OPEN, the
first fight in the game, the one the demo opens on -- and 64 bars later the
street shuffle takes the music back MID-FIGHT:

    BEFORE THE FIGHT   city:true   THE WIND LEARNS WORDS
    IN THE FIGHT       city:true   HOMELESS
    AFTER 64 BARS      city:true   TWO COINS FOR THE FERRYMAN     <-- mid-fight

CITYMUS.on stayed true and its watchdog kept running while combat drove the same
transport. Two systems, one clock, neither aware of the other. A static check
for "is FIGHTMUS.enter called" would have gone green the moment the call site
existed and told you nothing about whether the shuffle actually let go, which is
the entire bug. So this gate PLAYS THE GAME.

WHAT IT ASSERTS, all of it off a real running transport:

  1. THE STREETS ARE PLAYING       after the opening hands over, CITYMUS owns it
  2. A FIGHT TAKES THE MUSIC       the song changes and the shuffle stands down
  3. AND KEEPS IT PAST 64 BARS     the transport is walked to the end of a pass
                                   -- which every real fight outlasts -- and the
                                   fight's song is STILL the one playing. This
                                   is the regression that shipped.
  4. LEAVING IS NOT A CUT          the frame the fight settles, the fight's song
                                   is still playing. Practitioner consensus is
                                   asymmetric: immediate IN, musical END OUT.
  5. BUT THE STREETS DO COME BACK  within one phrase, CITYMUS owns it again. A
                                   stand-down that never stands back up would
                                   pass check 4 and leave the valley silent.
  6. NEVER THE SCRATCH PATCH       FACTIONS[0] is CUSTOM, the studio's blank
                                   sandbox slot (motif 'plain', osc + pluck).
                                   Combat drew it uniformly, so one fight in
                                   fourteen was scored by a patch nobody wrote.
                                   200 redraws must never land on it, and must
                                   never land on a song he buried.

Run from repo root:  python3 gates/fight_music_gate.py
"""
import json
import os
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

JS = r"""
const path=require('path');
function pw(){for(const g of ['/opt/node22/lib/node_modules','/usr/lib/node_modules',
  '/usr/local/lib/node_modules']){try{return require(path.join(g,'playwright'));}catch(e){}}
  return require('playwright');}
(async()=>{
  const {chromium}=pw();
  // DEFAULT autoplay policy on purpose. Launching with
  // --autoplay-policy=no-user-gesture-required would prove nothing about the
  // gesture this whole feature is built on.
  const b=await chromium.launch();
  const p=await b.newPage({viewport:{width:390,height:844}});
  const errs=[]; p.on('pageerror',e=>errs.push(String(e.message)));
  const out={};
  try{
    await p.goto('file://'+path.join(process.argv[2],'slices','BOHEMIA_ALPHA_0_9.html'));
    await p.waitForTimeout(2000);
    const has=await p.evaluate(()=>({fm:typeof FIGHTMUS!=='undefined',
      mm:typeof MENUMUS!=='undefined', cm:typeof CITYMUS!=='undefined',
      cold:typeof startColdOpen==='function'}));
    Object.assign(out,has);
    if(!has.fm||!has.cm||!has.cold){ out.fatal='FIGHTMUS/CITYMUS/startColdOpen missing from the shipped alpha';
      console.log(JSON.stringify(out)); await b.close(); return; }

    await p.click('#front');                      // the real gesture
    await p.waitForTimeout(22000);                // opening hands over to the streets
    const snap=()=>p.evaluate(()=>({fight:FIGHTMUS.on,city:CITYMUS.on,watch:!!CITYMUS.watch,
      step:MUS.step,playing:!!MUS.playing,
      now:(MUS.cur<MFACTIONS.length?MFACTIONS[MUS.cur].n:(MUS.lib()[MUS.cur]||{}).n)}));
    out.streets=await snap();

    await p.evaluate(()=>{ startColdOpen(()=>{}); });
    await p.waitForTimeout(4000);
    out.inFight=await snap();

    // WALK THE TRANSPORT TO THE END OF A 64-BAR PASS. That is what happens on
    // its own after ~128 seconds of any fight; doing it directly is the same
    // code path arriving sooner, not a different one.
    await p.evaluate(()=>{ MUS.step=1020; });
    await p.waitForTimeout(3000);
    out.past64=await snap();

    await p.evaluate(()=>{ window.postMessage({type:'BOHEMIA_COMBAT_END',victory:true,
      kills:2,playerHP:80,dead:2,spared:0,fled:0,alive:0,turns:5},'*'); });
    await p.waitForTimeout(1200);
    out.justEnded=await snap();

    out.returned=null;
    for(const w of [4000,5000,7000,9000,12000]){
      await p.waitForTimeout(w);
      const s=await snap();
      if(s.city){ out.returned=s; break; }
      out.stillHeld=s;
    }

    out.draws=await p.evaluate(()=>{ const c={};
      for(let i=0;i<200;i++){ const k=FIGHTMUS.realFaction(0);
        const f=MFACTIONS[k]; c[f?f.n:'?']=(c[f?f.n:'?']||0)+1; }
      return c; });
    out.buried=await p.evaluate(()=>Object.keys(MUS.V).filter(k=>MUS.V[k]===0));
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


def main():
    print('=== FIGHT MUSIC GATE — proved by playing a fight, not by grepping ===')
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as fh:
        fh.write(JS)
        js = fh.name
    try:
        r = subprocess.run(['node', js, ROOT], capture_output=True, text=True, timeout=900)
    finally:
        os.unlink(js)
    if r.returncode != 0:
        print('  FAIL  the browser run died:\n' + (r.stderr or '')[-1500:])
        return 1
    try:
        d = json.loads(r.stdout.strip().splitlines()[-1])
    except Exception as e:
        print('  FAIL  unreadable output (%s):\n%s' % (e, r.stdout[-1200:]))
        return 1
    if d.get('fatal'):
        print('  FAIL  ' + d['fatal'])
        return 1

    ok('FIGHTMUS is in the shipped alpha', d.get('fm'))

    st = d.get('streets') or {}
    ok('the streets are playing before the fight (city=%s, %s)'
       % (st.get('city'), st.get('now')), st.get('city') and st.get('playing'))

    inf = d.get('inFight') or {}
    ok('a fight TAKES the music (was %s, now %s)' % (st.get('now'), inf.get('now')),
       inf.get('now') and inf.get('now') != st.get('now'))
    ok('the street shuffle STANDS DOWN for the fight (city=%s, watchdog=%s)'
       % (inf.get('city'), inf.get('watch')),
       inf.get('city') is False and inf.get('watch') is False)
    ok('the fight is flagged as owning the music', inf.get('fight') is True)

    # 3. THE REGRESSION THAT SHIPPED
    p64 = d.get('past64') or {}
    ok('the streets do NOT take the music back 64 bars into a fight '
       '(fight song %s, after the pass %s)' % (inf.get('now'), p64.get('now')),
       p64.get('now') == inf.get('now') and p64.get('city') is False)

    je = d.get('justEnded') or {}
    ok('leaving a fight is not a CUT: the fight song is still playing the frame '
       'it settles (%s)' % je.get('now'), je.get('now') == inf.get('now'))

    ret = d.get('returned') or {}
    ok('but the streets DO come back within a phrase (%s)'
       % (ret.get('now') or 'they never came back'),
       bool(ret.get('city')) and bool(ret.get('playing')))
    ok('and the returned song is a street song, not the fight song (%s)'
       % ret.get('now'), ret.get('now') and ret.get('now') != inf.get('now'))

    draws = d.get('draws') or {}
    ok('200 redraws of the scratch slot never land on CUSTOM (%s)'
       % (draws.get('CUSTOM') or 0), not draws.get('CUSTOM'))
    buried = set(x.rsplit('#', 1)[0] for x in (d.get('buried') or []))
    hit = sorted(set(draws) & buried)
    ok('and never on a song he buried (%s)' % (', '.join(hit) or 'none'), not hit)
    ok('the redraw spreads across his factions (%d distinct)' % len(draws), len(draws) >= 5)

    ok('the page threw nothing: %s' % (d.get('errs') or 'clean'), not d.get('errs'))

    print('  %d passed, %d FAILED' % (P, F))
    if not F:
        print('  Fought a fight: the streets let go, held past 64 bars, and came '
              'back on the phrase. %d factions in the draw, no scratch patch.' % len(draws))
    return 1 if F else 0


if __name__ == '__main__':
    sys.exit(main())
