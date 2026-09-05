#!/usr/bin/env python3
"""
BED IS THE PLACE GATE (9/5/26, SOUNDS lane) - a district that sounds different
is different, and it has to be different IN THE GAME, not in a table.

THE JOB: [district sound] BB-THE-BED-IS-THE-PLACE. Its own acceptance line is
"the bed varies by district on the walked surface". The row rode behind
BB-THE-CITY-SENDS-WHERE, which shipped earlier today; until the walked surface
said where you were standing, the bed knew day, night and indoors and nothing
else.

THE REAL AISLE, from the row: Schafer's KEYNOTE SOUNDS are the background bed --
not listened to consciously, but they imprint a sense of place. We shipped only
signals. This is the first keynote in the game.

*** THIS GATE IS BUILT AROUND ONE HONEST WORRY, AND IT SHOULD BE. *** The bed
speaks once every 40 to 95 seconds. A player crossing three districts in ninety
seconds hears ONE sound, so re-weighting WHICH sound is a change no human can
perceive. The lever that is actually audible is HOW OFTEN, and the gate holds
both, separately, so nobody can claim the feature on the half that cannot be
heard. A lit block speaks every 25 to 60 seconds; open desert every 60 to 130.

WHAT IT MEASURES ON THE REAL SURFACE:

  * every district in the game is in exactly one group -- counted against the
    game's own DISTRICT enum, not against the table's own idea of itself
  * the walked city actually reports its district in the message
  * the shell turns that into a KIND of place
  * the same place, asked a thousand times, produces a DIFFERENT DISTRIBUTION
    of bed sounds in a machine district than in open desert
  * the gap between beds is genuinely shorter where it should be shorter
  * AND AN UNGROUPED PLACE IS EXACTLY WHAT IT WAS YESTERDAY, which is the claim
    that stops a new field silently changing the thing it does not describe

    python3 gates/bed_is_the_place_gate.py
"""
import json
import os
import re
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CITY = os.path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html')
ALPHA = os.path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html')

JS = r'''
const path=require('path');
function pw(){for(const g of ['/opt/node22/lib/node_modules','/usr/lib/node_modules',
  '/usr/local/lib/node_modules']){try{return require(path.join(g,'playwright'));}catch(e){}}
  return require('playwright');}
(async()=>{
  const {chromium}=pw();
  const b=await chromium.launch({args:['--allow-file-access-from-files',
                                       '--autoplay-policy=no-user-gesture-required','--mute-audio']});
  const p=await b.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  const out={errs:errs};
  await p.goto('file://'+path.join(process.argv[2],'slices','BOHEMIA_ALPHA_0_9.html'));
  await p.waitForTimeout(1500);
  await p.click('#front',{force:true}).catch(()=>{});
  await p.waitForTimeout(11000);
  const cf=p.frames().find(x=>x.url().includes('CITY_WORLD'));
  out.cityFrame=!!cf;
  if(!cf){ console.log(JSON.stringify(out)); await b.close(); return; }
  await cf.waitForLoadState('load').catch(()=>{});
  await p.waitForTimeout(5000);

  out.api = await p.evaluate(()=>({
    places: typeof window.__ambPlaces==='function',
    amb:    !!window.__AMB
  }));
  if(!out.api.places){ console.log(JSON.stringify(out)); await b.close(); return; }

  /* ---- THE CITY ACTUALLY SENDS IT. Not "the code has a field": intercept the
     real message on the real heartbeat. ---- */
  /* TWO DOCUMENTS, AND THE FIRST CUT OF THIS FORGOT THAT. It armed the
     listener in the SHELL and then called __ctWhere() in the SHELL too -- but
     __ctWhere lives in the CITY, so nothing was ever posted and the intercept
     came back empty on a build that was sending the field perfectly. The
     listener belongs where the message ARRIVES and the trigger belongs where
     the message is SENT. */
  await p.evaluate(()=>{ window.__WSEEN=[];
    window.__WH=e=>{ const d=e&&e.data;
      if(d&&d.type==='BOHEMIA_WHERE') window.__WSEEN.push({from:d.from,district:d.district,inside:d.inside}); };
    window.addEventListener('message',window.__WH); });
  await cf.evaluate(()=>{ try{ window.__ctWhere && window.__ctWhere(); }catch(_e){} });
  await p.waitForTimeout(900);
  out.sent = await p.evaluate(()=>{
    try{ window.removeEventListener('message',window.__WH); }catch(_e){}
    return (window.__WSEEN||[]).slice(-4); });

  /* ---- AND THE SHELL TURNED IT INTO A KIND OF PLACE. ---- */
  out.place = await p.evaluate(()=>({
    place: window.__AMB ? window.__AMB.place : null,
    kind:  window.__AMB ? window.__AMB.kind  : null
  }));

  /* ---- WHAT A PLACE ACTUALLY SOUNDS LIKE, a thousand draws each.
     pick() is the real function on the real object; only `place` is moved,
     which is exactly the one variable the feature is about. ---- */
  out.draws = await p.evaluate(()=>{
    const A=window.AMB||window.__AMB; if(!A) return null;
    const was=A.place, wasInside=A.inside, wasKind=A.kind;
    A.inside=false; A.kind='air_day';
    const roll=(pl)=>{ A.place=pl; const c={};
      for(let i=0;i<3000;i++){ const e=A.pick(); c[e]=(c[e]||0)+1; }
      return c; };
    const gaps=(pl)=>{ A.place=pl; let lo=1e9, hi=0, s=0;
      for(let i=0;i<3000;i++){ const g=A.gap(); s+=g; if(g<lo)lo=g; if(g>hi)hi=g; }
      return {lo:+lo.toFixed(1), hi:+hi.toFixed(1), mean:+(s/3000).toFixed(1)}; };
    const r={counts:{}, gap:{}};
    for(const pl of ['machine','lit','open','lived',null]){
      const k=pl||'(ungrouped)';
      r.counts[k]=roll(pl); r.gap[k]=gaps(pl);
    }
    A.place=was; A.inside=wasInside; A.kind=wasKind;
    r.approved={}; const AP=(window.__SFX_APPROVED||{});
    for(const e of ['generator','wind_gust','sign_alive','air_day','air_night','air_inside'])
      r.approved[e]=(AP[e]||[]).length;
    return r;
  });

  /* ---- A ROOM IS A ROOM. Indoors must carry no place at all. ---- */
  out.indoors = await p.evaluate(()=>{
    const A=window.__AMB; if(!A) return null;
    const before={place:A.place};
    A.where({inside:true, night:false, min:720, space:'ROOM', district:'strip', from:'city'});
    const inside={place:A.place, kind:A.kind};
    A.where({inside:false, night:false, min:720, space:'STREET', district:'strip', from:'city'});
    const outside={place:A.place, kind:A.kind};
    return {before:before, inside:inside, outside:outside};
  });

  out.errs=errs.slice(0,8);
  console.log(JSON.stringify(out));
  await b.close();
})();
'''


def main():
    p = f = 0

    def ok(name, cond):
        nonlocal p, f
        if cond:
            p += 1
        else:
            f += 1
            print('  > FAIL ' + name)

    print('=== BED IS THE PLACE GATE - a district that sounds different is different ===')

    # ---- 1-3. EVERY DISTRICT IN THE GAME IS IN EXACTLY ONE GROUP. Counted
    #      against the game's own enum, because a table that only checks itself
    #      will always agree with itself.
    city = open(CITY, encoding='utf8').read()
    i = city.index('const DISTRICT={')
    enum = set(re.findall(r"[A-Z0-9_]+:'([a-z0-9]+)'", city[i:city.index('};', i)]))
    alpha = open(ALPHA, encoding='utf8').read()
    k = alpha.index('var PLACE_OF = {')
    pairs = re.findall(r"([a-z0-9]+):'(machine|lit|open|lived)'", alpha[k:alpha.index('};', k)])
    grouped = dict(pairs)

    ok('the game still has a district list to check against (%d districts)'
       % len(enum), len(enum) > 40)
    missing = sorted(enum - set(grouped))
    ok('EVERY district in the game is in a group -- an ungrouped one falls back '
       'to the old odds silently, which is a feature that half exists. '
       'Ungrouped: %s' % (missing or 'none'), not missing)
    strays = sorted(set(grouped) - enum)
    ok('and the table invents nothing: %s' % (strays or 'no strays'), not strays)
    ok('and no district is in two groups (%d rows, %d names)'
       % (len(pairs), len(grouped)), len(pairs) == len(grouped))

    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as fh:
        fh.write(JS)
        js = fh.name
    try:
        r = subprocess.run(['node', js, ROOT], capture_output=True, text=True, timeout=600)
    finally:
        os.unlink(js)
    line = [x for x in r.stdout.strip().split('\n') if x.startswith('{')]
    if not line:
        print('  > FAIL the harness produced nothing')
        print(r.stdout[-1200:])
        print(r.stderr[-1200:])
        return 1
    d = json.loads(line[-1])

    ok('the walked city loads', d.get('cityFrame'))
    ok('the shell publishes the place table so it can be read and changed in '
       'one place', (d.get('api') or {}).get('places'))
    if not (d.get('api') or {}).get('places'):
        print('  %d passed, %d FAILED' % (p, f))
        return 1

    # ---- 5-6. THE CITY SENDS IT AND THE SHELL READS IT.
    sent = d.get('sent') or []
    withd = [s for s in sent if s.get('district')]
    ok('the walked city reports WHICH DISTRICT in the real message, on the real '
       'heartbeat (%s)' % json.dumps(sent[-2:]), bool(withd))
    pl = (d.get('place') or {}).get('place')
    ok('and the shell turned it into a kind of place (%s)' % pl,
       pl in ('machine', 'lit', 'open', 'lived'))

    draws = d.get('draws') or {}
    counts = draws.get('counts') or {}
    gap = draws.get('gap') or {}
    ap = draws.get('approved') or {}

    # ---- 7. THE SOUNDS IT USES ARE HIS.
    ok('it uses only sounds he approved: air_day %s, air_night %s, air_inside '
       '%s, generator %s, wind_gust %s, sign_alive %s'
       % (ap.get('air_day'), ap.get('air_night'), ap.get('air_inside'),
          ap.get('generator'), ap.get('wind_gust'), ap.get('sign_alive')),
       all((ap.get(e) or 0) > 0 for e in
           ('air_day', 'air_night', 'air_inside', 'generator', 'wind_gust', 'sign_alive')))

    def share(place, ev):
        c = counts.get(place) or {}
        tot = sum(c.values()) or 1
        return (c.get(ev, 0) / tot)

    # ---- 8-10. THE PLACE CHANGES WHAT YOU HEAR. Three claims, each naming the
    #      thing the group is FOR, so a table that is merely different cannot
    #      pass by being different in a meaningless direction.
    ok('a MACHINE district is where the generator lives: %.0f%% there against '
       '%.0f%% in open desert'
       % (share('machine', 'generator') * 100, share('open', 'generator') * 100),
       share('machine', 'generator') > share('open', 'generator') * 3)
    ok('a LIT district is where the sign lives: %.0f%% there against %.0f%% in '
       'a lived-in suburb'
       % (share('lit', 'sign_alive') * 100, share('lived', 'sign_alive') * 100),
       share('lit', 'sign_alive') > share('lived', 'sign_alive') * 1.5)
    ok('OPEN ground is where the wind lives: %.0f%% there against %.0f%% in a '
       'lived-in suburb'
       % (share('open', 'wind_gust') * 100, share('lived', 'wind_gust') * 100),
       share('open', 'wind_gust') > share('lived', 'wind_gust') * 1.5)
    ok('and a LIVED-IN place is mostly just the air, because people are asleep '
       '(%.0f%% bed, against %.0f%% in a machine district)'
       % (share('lived', 'air_day') * 100, share('machine', 'air_day') * 100),
       share('lived', 'air_day') > share('machine', 'air_day'))

    # ---- 11-13. AND THE HALF A PERSON CAN ACTUALLY HEAR.
    #      THE WHOLE REASON THIS CLAIM EXISTS: the bed speaks once every 40 to
    #      95 seconds, so a player crossing three districts in ninety seconds
    #      hears ONE sound. Re-weighting that one sound is imperceptible.
    #      The gap is the audible lever and it is asserted separately.
    ok('a lit block SPEAKS MORE OFTEN than open desert, which is the only half '
       'of this a person can actually hear: %ss on average against %ss'
       % ((gap.get('lit') or {}).get('mean'), (gap.get('open') or {}).get('mean')),
       ((gap.get('lit') or {}).get('mean') or 999)
       < ((gap.get('open') or {}).get('mean') or 0) * 0.7)
    ok('a machine district too (%ss against %ss in the desert)'
       % ((gap.get('machine') or {}).get('mean'), (gap.get('open') or {}).get('mean')),
       ((gap.get('machine') or {}).get('mean') or 999)
       < ((gap.get('open') or {}).get('mean') or 0))
    ok('and no place ever goes silent or turns into a metronome: every gap '
       'measured sits between 20 and 140 seconds (%s)'
       % json.dumps({x: [v.get('lo'), v.get('hi')] for x, v in gap.items()}),
       all(20 <= (v.get('lo') or 0) and (v.get('hi') or 999) <= 140
           for v in gap.values()))

    # ---- 14-15. AN UNGROUPED PLACE IS EXACTLY WHAT IT WAS YESTERDAY. This is
    #      the claim that stops a new field silently changing what it does not
    #      describe -- the run slice's own report carries no district.
    ug = gap.get('(ungrouped)') or {}
    ok('with no district at all the gap is still his 40-to-95 (%s to %s) -- the '
       'run slice reports no district and must sound exactly as it did'
       % (ug.get('lo'), ug.get('hi')),
       38 <= (ug.get('lo') or 0) and (ug.get('hi') or 0) <= 96)
    ok('and with no district the OLD odds still run: generator %.0f%%, wind '
       '%.0f%% (they were 12.5%% and 25%% and nothing about them changed)'
       % (share('(ungrouped)', 'generator') * 100, share('(ungrouped)', 'wind_gust') * 100),
       0.09 < share('(ungrouped)', 'generator') < 0.16
       and 0.20 < share('(ungrouped)', 'wind_gust') < 0.30)

    # ---- 16. A ROOM IS A ROOM.
    ind = d.get('indoors') or {}
    ok('indoors carries no place at all, because a room is a room whatever '
       'block it is on (inside: %s, back outside: %s)'
       % (json.dumps(ind.get('inside')), json.dumps(ind.get('outside'))),
       (ind.get('inside') or {}).get('place') is None
       and (ind.get('inside') or {}).get('kind') == 'air_inside'
       and (ind.get('outside') or {}).get('place') == 'lit')

    ok('nothing threw (%s)' % (d.get('errs') or 'clean'), not d.get('errs'))

    print('  %d passed, %d FAILED' % (p, f))
    if not f:
        print('  The strip sounds busy, the desert sounds empty, and not one new '
              'sound was cooked to do it.')
    return 1 if f else 0


if __name__ == '__main__':
    sys.exit(main())
