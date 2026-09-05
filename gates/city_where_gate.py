#!/usr/bin/env python3
"""
CITY WHERE GATE (9/5/26, SOUNDS lane) - the walked surface reports where you are,
and four finished systems are alive because of it.

BB-THE-CITY-SENDS-WHERE and BB-THE-DAY-SONG-PLAYS. The second row's own text says
how to check it, and the instruction is the whole reason this file exists:

    "VERIFY BY OBSERVED PHASE, NOT BY READING THE CODE -- a fix that has already
     been undone once by a surface change is exactly the thing to gate."

IT HAS BEEN UNDONE ONCE ALREADY. The alpha's 8/4 block found CITYMUS.phase
hardcoded to 'NIGHT', fixed it for the run slice, and wrote down what it cost:
THE MARKER ON THE DOOR, tagged OVERWORLD DAY by his own hand and the one song in
this project he has said he likes, was undrawable. The 8/14 migration moved the
walked surface into another document and the fix went with the old one. So this
gate never reads a line of source to decide anything. It clicks through the
splash, waits for the walked city, moves THE CITY'S OWN CLOCK with THE CITY'S
OWN advance(), and reads the phase back off the shell.

WHAT IT MEASURED THE DAY IT WAS WRITTEN, before the wire existed:

    __AMB.seen        0        after 25 seconds of walking
    __AMB.kind        null     the ambience bed had never chosen a bed
    __musicPhase()    NIGHT    while the city's own clock said 06:00
    __sfxSpace()      STREET   nailed there forever
    __timePassStats   0 rows   the hour chime had never struck

FOUR CLAIMS, AND EACH ONE IS A DIFFERENT SYSTEM ON THE OTHER END OF THE SAME
MESSAGE: the ambience bed, the day/night music pool, the hour chime, and the
space the sound is placed in. A gate that only checked "the message was posted"
would pass on a message with every field wrong, which is the shape this repo has
been finding all month -- finished code with a caller and no effect.

AND IT CHECKS THE FIELDS ON THE REAL GEOMETRY, not on what the sender believes:
it stands the player on a road cell the CITY picked and asserts STREET, then
walks him through a real door with the city's own inEnter and asserts the space
became a ROOM or a HALL and the bed became the inside air.

    python3 gates/city_where_gate.py
"""
import json
import os
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
  const b=await chromium.launch({args:['--allow-file-access-from-files',
                                       '--autoplay-policy=no-user-gesture-required',
                                       '--mute-audio']});
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
  await p.waitForTimeout(6000);

  const shell=()=>p.evaluate(()=>({
    ambSeen:(window.__AMB&&window.__AMB.seen)||0,
    ambKind:(window.__AMB&&window.__AMB.kind)||null,
    ambInside:!!(window.__AMB&&window.__AMB.inside),
    phase:(window.__musicPhase&&window.__musicPhase())||null,
    space:(window.__sfxSpace&&window.__sfxSpace())||null,
    rows:((window.__timePassStats&&window.__timePassStats())||{}).rows
  }));

  out.first=await shell();
  out.city=await cf.evaluate(()=>({min:T.min, night:isNight(), inside:!!INSIDE, mode:MODE}));

  /* IS IT A HEARTBEAT OR WAS IT ONE MESSAGE? A single report at boot would
     satisfy every other claim here and then go quiet for the rest of the game. */
  const s1=(await shell()).ambSeen;
  await p.waitForTimeout(9000);
  const s2=(await shell()).ambSeen;
  out.beatDelta=s2-s1;

  /* ---- ORDER MATTERS, AND THE FIRST CUT HAD IT WRONG. The clock walk below
     runs the day loop past NIGHTFALL, which ends the day and wakes you
     somewhere else at 06:00, so anything measured after it is standing in a
     world the earlier claims did not describe -- the first version reported the
     night bed for a body that was supposed to be indoors at midday. The place
     claims run FIRST, on the world the page booted into. ---- */

  /* ---- STANDING ON A ROAD. The CITY picks the cell -- this scans outward with
     the city's own footstep classifier and stands the body there. The space is
     then computed by the game, not by the test. ---- */
  out.road=await cf.evaluate(()=>{
    try{
      for(let r=1;r<60;r++){
        for(let dx=-r;dx<=r;dx++) for(let dy=-r;dy<=r;dy++){
          if(Math.max(Math.abs(dx),Math.abs(dy))!==r) continue;
          const c=cellAt(hx+dx,hy+dy);
          if(c&&c.walk&&__surfaceOf(c)==='asphalt'){ hx=hx+dx; hy=hy+dy; return {ok:true,r:r}; }
        }
      }
      return {ok:false};
    }catch(e){ return {ok:false,err:String(e)}; }
  });
  await cf.evaluate(()=>{ try{ window.__ctWhere(); }catch(e){} });
  await p.waitForTimeout(300);
  out.onRoad=await shell();

  /* ---- THROUGH A REAL DOOR, with the city's own inEnter. ---- */
  out.door=await cf.evaluate(()=>{
    try{
      for(let r=1;r<70;r++){
        for(let dx=-r;dx<=r;dx++) for(let dy=-r;dy<=r;dy++){
          if(Math.max(Math.abs(dx),Math.abs(dy))!==r) continue;
          const nx=hx+dx, ny=hy+dy, c=cellAt(nx,ny);
          if(!(c&&c.enter)) continue;
          const fx=hx, fy=hy;
          if(inEnter(nx,ny,fx,fy,!!c.walk)) return {ok:true,r:r,label:INSIDE&&INSIDE.label};
        }
      }
      return {ok:false};
    }catch(e){ return {ok:false,err:String(e)}; }
  });
  await p.waitForTimeout(400);
  out.inside=await shell();
  out.insideCity=await cf.evaluate(()=>({inside:!!INSIDE}));

  /* ---- AND THE GROUND UNDER EVERY STEP. __surfaceOf read c.name and c.tile
     and a city cell has NEITHER, so 6,561 of 6,561 cells classified 'dirt' and
     every footstep in the valley was the dirt one. The fallback is an APPROVED
     SOUND, which is why nothing ever went red. Counted, not read, and counted
     HERE so it is the same neighbourhood the road claim stood in. ---- */
  out.ground=await cf.evaluate(()=>{
    const s={}; let n=0;
    for(let dx=-40;dx<=40;dx++) for(let dy=-40;dy<=40;dy++){
      const c=cellAt(hx+dx,hy+dy); if(!c||!c.walk) continue;
      const k=__surfaceOf(c); s[k]=(s[k]||0)+1; n++;
    }
    return {n:n, surf:s};
  });

  /* back outdoors, through the city's own exit, so the clock walk below is
     measuring the valley's air and not a room's */
  await cf.evaluate(()=>{ try{ if(INSIDE) swapMode(); }catch(e){} });
  await p.waitForTimeout(600);
  out.leftBuilding=await cf.evaluate(()=>({inside:!!INSIDE}));

  /* ---- THE DAY SONG. The city's own advance() moves the city's own clock, and
     the phase is read off the SHELL. Nothing here sets a phase. LAST, because
     it walks the day loop past nightfall and that ends the day. ---- */
  out.phaseWalk=[];
  for(const target of [8*60, 13*60, 18*60, 22*60+30]){
    await cf.evaluate((tm)=>{ const d=(tm-T.min+1440)%1440; if(d) advance(d); }, target);
    await cf.evaluate(()=>{ try{ window.__ctWhere(); }catch(e){} });
    await p.waitForTimeout(400);
    const s=await shell();
    const c=await cf.evaluate(()=>({min:T.min}));
    out.phaseWalk.push({cityMin:c.min, phase:s.phase, ambKind:s.ambKind});
  }

  /* ---- TWO SENDERS, ONE STATEFUL HANDLER. The run slice posts the same
     message off its OWN clock every four seconds. timePass keeps LASTMIN and
     turns the gap between reports into a JUMP, so two clocks taking turns read
     as a twelve-hour leap every four seconds and struck twelve hour chimes over
     the judge sheet -- which is a thing he has complained about by name. Load
     the run slice, let both senders run, and count what the handler computed. */
  const rowsBefore=await p.evaluate(()=>((window.__timePassStats&&window.__timePassStats())||{}).rows||0);
  await p.evaluate(()=>{ try{ window.__loadRunSlice && window.__loadRunSlice(); }catch(e){} });
  await p.waitForTimeout(16000);
  out.race=await p.evaluate((from)=>{
    const log=(window.__timePassLog&&window.__timePassLog(from))||[];
    let strikes=0, worst=0;
    for(const r of log){ strikes+=(r.strikes||0); if(Math.abs(r.jump||0)>worst) worst=Math.abs(r.jump||0); }
    return {rows:log.length, strikes:strikes, worstJump:worst,
            runLoaded:!!(document.getElementById('runFrame')||{}).src};
  }, rowsBefore);

  out.errs=errs.slice(0,8);
  console.log(JSON.stringify(out));
  await b.close();
})();
'''


def main():
    p = f = 0
    findings = []

    def ok(name, cond):
        nonlocal p, f
        if cond:
            p += 1
        else:
            f += 1
            print('  > FAIL ' + name)

    print('=== CITY WHERE GATE - the walked surface says where you are ===')

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
        print(r.stdout[-1500:])
        print(r.stderr[-1500:])
        return 1
    d = json.loads(line[-1])

    ok('the walked city loads at all', d.get('cityFrame'))
    if not d.get('cityFrame'):
        print('  %d passed, %d FAILED' % (p, f))
        return 1

    first = d.get('first', {})
    city = d.get('city', {})

    # 1. THE MESSAGE ARRIVES. Measured as an effect on the shell, never as a
    #    postMessage having been called: the whole class of bug this repo has
    #    been finding all month is a finished call with no effect.
    ok('the shell has heard from the walked surface (__AMB.seen is a real '
       'timestamp, not 0 -- it was 0 for three weeks)', (first.get('ambSeen') or 0) > 0)

    # 2. AND IT KEEPS ARRIVING. One report at boot satisfies every other claim
    #    here and then goes quiet for the rest of the game.
    ok('and it is a HEARTBEAT, not one message at boot: the report advanced by '
       '%sms over a nine-second wait (four-second tick, so two or three)'
       % d.get('beatDelta'), (d.get('beatDelta') or 0) >= 4000)

    # 3. THE AMBIENCE BED HAS CHOSEN A BED. air_day / air_night / air_inside are
    #    5 of 5 thumbs up each, fifteen of fifteen, and the bed that plays them
    #    could not pick one because it never learned whether it was day.
    ok('the ambience bed has chosen a bed (kind=%s, and it was null)'
       % first.get('ambKind'),
       first.get('ambKind') in ('air_day', 'air_night', 'air_inside'))

    # 4. THE HOUR CHIME COUNTED SOMETHING. timePass keeps one row per clock move.
    ok('the hour chime is receiving the clock (%s rows, and it was 0)'
       % first.get('rows'), (first.get('rows') or 0) > 0)

    # 5. THE PHASE IS NOT NAILED TO NIGHT. The premise of BB-THE-DAY-SONG-PLAYS.
    ok('the music phase is not stuck on NIGHT while the clock says %s minutes '
       '(phase=%s)' % (city.get('min'), first.get('phase')),
       not (first.get('phase') == 'NIGHT' and 6 * 60 <= (city.get('min') or 0) < 19 * 60))

    # 6-9. OBSERVED PHASE, the row's own instruction. The city's clock moves by
    #      the city's own advance(); the phase is read off the shell.
    walk = d.get('phaseWalk') or []
    want = [(8 * 60, 'DAY'), (13 * 60, 'DAY'), (18 * 60, 'DUSK'), (22 * 60 + 30, 'NIGHT')]
    for i, (mn, ph) in enumerate(want):
        got = walk[i] if i < len(walk) else {}
        ok('at %02d:%02d the walked city is in %s (observed: clock %s, phase %s)'
           % (mn // 60, mn % 60, ph, got.get('cityMin'), got.get('phase')),
           got.get('phase') == ph)

    # 10. AND THE DAY-TAGGED SONG IS DRAWABLE. That is the whole point of the row:
    #     THE MARKER ON THE DOOR is tagged OVERWORLD DAY and the walked city
    #     could never be in day.
    ok('a DAY-tagged song can be drawn on the walked surface -- the phase '
       'reached DAY, which it could not do since the 8/14 migration',
       any((w.get('phase') == 'DAY') for w in walk))

    # 11. AND THE BED FOLLOWS THE CLOCK, not just the phase. Night air is a
    #     different approved sound, and he called air_night "the horror".
    ok('the ambience bed follows the clock too: it was %s at night'
       % (walk[3].get('ambKind') if len(walk) > 3 else '?'),
       len(walk) > 3 and walk[3].get('ambKind') == 'air_night')

    # 12-13. THE SPACE FIELD IS REAL GEOMETRY. Standing on a road the city itself
    #        picked, with the city's own footstep classifier.
    road = d.get('road') or {}
    onroad = d.get('onRoad') or {}
    ok('the city found a road cell to stand on (%s)' % json.dumps(road), road.get('ok'))
    ok('and standing on it the shell is in STREET (space=%s)' % onroad.get('space'),
       onroad.get('space') == 'STREET')

    # 14-16. THROUGH A REAL DOOR, with the city's own inEnter -- the one place a
    #        body goes through a door.
    door = d.get('door') or {}
    ins = d.get('inside') or {}
    ok('the city walked the body through a real door with its own inEnter (%s)'
       % json.dumps(door)[:120], door.get('ok'))
    if door.get('ok'):
        ok('and the shell knows the body is indoors (occlusion had no listener '
           'on this surface at all: ambInside=%s)' % ins.get('ambInside'),
           ins.get('ambInside') is True)
        ok('and the space became a room (space=%s, and it was STREET forever)'
           % ins.get('space'), ins.get('space') in ('ROOM', 'HALL'))
        ok('and the bed became the inside air, which is what he approved for '
           '"a room with nobody in it but you" (kind=%s)' % ins.get('ambKind'),
           ins.get('ambKind') == 'air_inside')
        ok('and the way out reports too -- leaving a building is a crossing and '
           'the shell must not be left believing there is still a wall '
           '(INSIDE after the exit: %s)'
           % ((d.get('leftBuilding') or {}).get('inside')),
           (d.get('leftBuilding') or {}).get('inside') is False)
    else:
        findings.append('no enterable door was reachable from the spawn this run')

    # 17-19. THE GROUND UNDER EVERY STEP. This is the claim the WHERE message's
    #        own `space` field rests on: if the classifier cannot tell a road
    #        from a lawn, the new message ships a field that is permanently
    #        OPEN, which is the same bug in a different hat.
    g = d.get('ground') or {}
    surf = g.get('surf') or {}
    ok('the walked surface is not one enormous field: %d walkable cells around '
       'the player classify as %s (it was 6,561 of 6,561 dirt)'
       % (g.get('n') or 0, json.dumps(surf)), len(surf) >= 3)
    ok('and a road underfoot sounds like a road (asphalt cells: %s)'
       % surf.get('asphalt'), (surf.get('asphalt') or 0) > 0)
    ok('and a sidewalk sounds like concrete (concrete cells: %s)'
       % surf.get('concrete'), (surf.get('concrete') or 0) > 0)

    # 20-21. AND TURNING ON A SECOND SENDER DID NOT START A RACE. The run slice
    #        posts the same message off its own clock; timePass is stateful and
    #        reads the gap between two clocks as an hourly leap. Caught by
    #        sfx_wired_gate in its own words -- "THE GAME PLAYED OVER HIM WHILE
    #        HE WAS VOTING" -- with twelve hour strikes, the cap, over the judge
    #        sheet. Measured on what the handler actually computed.
    race = d.get('race') or {}
    ok('the run slice was loaded for this check, so the race is real and not '
       'assumed away (runFrame src: %s)' % bool(race.get('runLoaded')),
       bool(race.get('runLoaded')))
    ok('and with BOTH senders running the clock never leapt: %d report(s), '
       'worst jump %s minutes, %s hour strike(s). Two clocks taking turns '
       'struck twelve over the judge sheet before the city stamped its reports'
       % (race.get('rows') or 0, race.get('worstJump'), race.get('strikes')),
       (race.get('strikes') or 0) == 0 and (race.get('worstJump') or 0) < 60)

    # 22. NOTHING THREW. A heartbeat that throws every four seconds is a log the
    #     player never sees and a battery he does.
    ok('and nothing threw on the way (%s)' % (d.get('errs') or 'clean'),
       not d.get('errs'))

    print('  %d passed, %d FAILED' % (p, f))
    for x in findings:
        print('  NOTE: ' + x)
    if not f:
        print('  The valley makes a sound when you stand still, the clock reaches '
              'the middle of the day, and a wall is between you and the sound.')
    return 1 if f else 0


if __name__ == '__main__':
    sys.exit(main())
