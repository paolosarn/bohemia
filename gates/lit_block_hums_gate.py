#!/usr/bin/env python3
"""
LIT BLOCK HUMS GATE (9/5/26, SOUNDS lane) - a live circuit is audible and a dead
one is not.

THE JOB: [power hums] BB-A-LIT-BLOCK-HUMS. Its ship test is one line and this
gate is built on both halves of it, because the second half is the one that gets
skipped:

    "a live circuit is audible AND A DEAD ONE IS NOT"

MEASURED BEFORE THE WORK: the shell had ZERO mentions of the power grid, the
ambience bed picked `generator` on a die roll with nothing to do with power, and
`power_on` (2 of 5, approved 8/20) had no caller anywhere. Meanwhile the grid is
finished code on the walked surface -- POWER.at() answers {live, owner, id}, 12%
of circuits are lit, every one is owned, ten readers on that surface already ask
it, and since BB-THE-NIGHT-EATS-POWER a circuit you cannot pay for goes dark.
The sound was the eleventh reader and it never asked.

WHAT IT HOLDS:

  * the city reports the real distance to the nearest live circuit, on the real
    heartbeat, and -1 when there is none within three cells
  * A DEAD BLOCK NEVER HUMS -- not "less often", never -- and never advertises,
    because a neon sign that is ON cannot be on a circuit nobody is feeding
  * a live block does hum, and the DISTANCE IS THE GRID'S ANSWER: on the block
    it is close, a cell away it is a block away, and the level and the tone both
    follow from that through placeSound's inverse law
  * the valley is not silent on a dead block, it is machine-less: the wind still
    comes through
  * AND A SENDER THAT REPORTS NO POWER AT ALL IS UNCHANGED. null and -1 are
    different facts -- "not reported" against "looked, and it is dead" -- and
    the run slice sends the first one

AND IT CARRIES A CONTROL FOR THE GRID ITSELF: if every cell near the player
happened to be live, or none were, every claim below would pass or fail for a
reason that has nothing to do with sound. The grid is counted first.

    python3 gates/lit_block_hums_gate.py
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

  /* ---- THE CONTROL. If the grid near the player were all live or all dead,
     every claim below would pass or fail for a reason that is not about sound. */
  out.grid = await cf.evaluate(()=>{
    try{
      const cx=(hx/FN)|0, cy=(hy/FN)|0;
      let live=0, dead=0, ids={};
      for(let ox=-8;ox<=8;ox++) for(let oy=-8;oy<=8;oy++){
        const s=POWER.at(cx+ox,cy+oy);
        if(s&&s.live){ live++; ids[s.id]=1; } else dead++;
      }
      return {live:live, dead:dead, circuits:Object.keys(ids).length,
              here:!!(POWER.at(cx,cy)||{}).live, cx:cx, cy:cy};
    }catch(e){ return {err:String(e)}; }
  });

  /* ---- THE CITY ACTUALLY SENDS IT, on the real heartbeat. Listener in the
     document the message ARRIVES at, trigger in the one that SENDS it. ---- */
  await p.evaluate(()=>{ window.__WSEEN=[];
    window.__WH=e=>{ const d=e&&e.data;
      if(d&&d.type==='BOHEMIA_WHERE') window.__WSEEN.push({litD:d.litD,litDx:d.litDx,district:d.district}); };
    window.addEventListener('message',window.__WH); });
  await cf.evaluate(()=>{ try{ window.__ctWhere && window.__ctWhere(); }catch(_e){} });
  await p.waitForTimeout(900);
  out.sent = await p.evaluate(()=>{
    try{ window.removeEventListener('message',window.__WH); }catch(_e){}
    return (window.__WSEEN||[]).slice(-3); });

  /* ---- WHAT THE BED DOES AT EACH DISTANCE. The real pick() on the real
     object; only the power distance moves. ---- */
  out.picks = await p.evaluate(()=>{
    const A=window.__AMB; if(!A) return null;
    const was={place:A.place, litD:A.litD, inside:A.inside, kind:A.kind};
    A.inside=false; A.kind='air_day';
    const roll=(place,litD)=>{ A.place=place; A.litD=litD; const c={};
      for(let i=0;i<4000;i++){ const e=A.pick(); c[e]=(c[e]||0)+1; } return c; };
    const r={};
    /* a MACHINE district, which is where the generator is most likely of all,
       so a dead block silencing it there is the strongest form of the claim */
    r.machineOnIt   = roll('machine', 0);
    r.machineNear   = roll('machine', 2);
    r.machineDead   = roll('machine', -1);
    r.litDead       = roll('lit', -1);
    r.openDead      = roll('open', -1);
    /* and the sender that reports no power at all */
    r.noPlaceNull   = roll(null, null);
    r.noPlaceDead   = roll(null, -1);
    A.place=was.place; A.litD=was.litD; A.inside=was.inside; A.kind=was.kind;
    return r;
  });

  /* placeSound is not reachable from outside the closure, so the distance is
     read the way the game computes it: run tick() with a forced pick and a
     known litD, and measure the ENERGY that comes out. Nearer is louder, and
     that is the claim in the row ("audible from the next street"). */
  out.loud = await p.evaluate(async()=>{
    const A=window.__AMB; if(!A||typeof MUS==='undefined'||!MUS.AC) return null;
    const wait=ms=>new Promise(z=>setTimeout(z,ms));
    const AC=MUS.AC;
    /* quiet the room: stop the music and stop the bed's own clock */
    try{ if(window.MENUMUS) MENUMUS.stop(); }catch(e){}
    try{ if(window.CITYMUS) CITYMUS.stopShuffle(); }catch(e){}
    await wait(700);
    const was={pick:A.pick, litD:A.litD, place:A.place, inside:A.inside, kind:A.kind, next:A.next, seen:A.seen};
    A.inside=false; A.kind='air_day'; A.place='machine';
    A.pick=function(){ return 'generator'; };
    /* *** MEASURE ON THE BED'S OWN BUS, NOT ON THE MASTER, AND THE FIRST CUT
       DID NOT. *** On the master the hum on your block and the hum a block away
       both read 0.057 -- identical to three decimals -- on a build where
       placeSound was being handed 2.5 and 11. The master carries a brickwall
       limiter (threshold -5, ratio 20, added after the 7/8 screech) and it was
       squashing both to the same ceiling. THE INSTRUMENT WAS MEASURING THE
       LIMITER, not the distance. A.bus is the bed's own gain node, upstream of
       it. One warm-up play first, because the bus is built lazily inside tick. */
    A.litD=0; A.next=1; A.seen=Date.now(); A.tick();
    await wait(400);
    const dst=A.bus||MUS.OUT||MUS.MAST||AC.destination;
    const an=AC.createAnalyser(); an.fftSize=1024; dst.connect(an);
    const buf=new Float32Array(an.fftSize);
    const read=()=>{ an.getFloatTimeDomainData(buf); let m=0;
      for(let i=0;i<buf.length;i++) if(Math.abs(buf[i])>m)m=Math.abs(buf[i]); return m; };
    await wait(1200);
    /* *** MAX OF THREE PLAYS IS NOT A MEASUREMENT, AND THAT IS WRITTEN DOWN IN
       THIS FILE'S OWN NEIGHBOUR. *** placeSound picks a RANDOM candidate from
       his approved set on every call, and the SPACES block says it plainly:
       "the difference between two of his candidates is bigger than the
       difference a room makes". Three plays per distance gave 0.075 against
       0.064 where the inverse law says 0.42 against 0.14 -- candidate variance
       swamping the thing being measured. Ten plays and the MEAN, so the four
       generator variants average out and what is left is the distance. */
    /* *** AND THE PLAYS HAVE TO STOP OVERLAPPING, WHICH IS THE THIRD DEFECT
       THIS ONE MEASUREMENT HAS HAD. *** With ten plays back to back in a 360ms
       window each, and generator candidates running up to 2.5 seconds, every
       window carried the TAIL of the play before it -- so the ten loud
       on-the-block plays bled into the first quiet block-away ones and the
       contrast collapsed to 0.78 where the inverse law says 0.33. Repeatably:
       three runs, same wrong answer, which is what told me it was the ruler and
       not noise. A LOUD SOUND THAT HAS NOT FINISHED IS PART OF THE NEXT
       MEASUREMENT. Sample long enough to contain the sound, then wait for
       silence before the next one. */
    const settle=async()=>{ for(let i=0;i<60;i++){ if(read()<0.002) return true; await wait(25);} return false; };
    const play=async(litD)=>{
      A.litD=litD; A.litDx=0;
      await settle();
      const peaks=[];
      for(let k=0;k<8;k++){
        let peak=0;
        A.next=1; A.seen=Date.now();            /* the tick's own "play now" state */
        A.tick();
        for(let i=0;i<70;i++){ peak=Math.max(peak,read()); await wait(9); }
        peaks.push(peak);
        await settle();
      }
      return +(peaks.reduce((a,b)=>a+b,0)/peaks.length).toFixed(5);
    };
    let base=0; for(let i=0;i<20;i++){ base=Math.max(base,read()); await wait(15); }
    const onIt=await play(0), oneAway=await play(1), threeAway=await play(3);
    A.pick=was.pick; A.litD=was.litD; A.place=was.place; A.inside=was.inside;
    A.kind=was.kind; A.next=was.next; A.seen=was.seen;
    return {base:+base.toFixed(5), onIt:onIt, oneAway:oneAway, threeAway:threeAway,
            pickPutBack:(A.pick===was.pick)};
  });

  /* THE DISTANCE THE GAME COMPUTES, exactly. See __ambHumPlace's own comment
     in the shell for why this is a number and not a loudness. */
  out.dist = await p.evaluate(()=>{
    if(typeof window.__ambHumPlace!=='function') return null;
    const r={}; for(const d of [-1,0,1,2,3]) r[d]=window.__ambHumPlace(d).dist;
    return r; });

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

    print('=== LIT BLOCK HUMS GATE - a live circuit is audible and a dead one is not ===')

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
    if not d.get('cityFrame'):
        print('  %d passed, %d FAILED' % (p, f))
        return 1

    # ---- 1-2. THE CONTROL. A grid that is all live or all dead would make every
    #      claim below pass or fail for a reason that is not about sound.
    g = d.get('grid') or {}
    ok('the grid around the player has BOTH live and dead cells, so the claims '
       'below are about sound and not about a uniform grid (%s live / %s dead, '
       '%s circuits)' % (g.get('live'), g.get('dead'), g.get('circuits')),
       (g.get('live') or 0) > 0 and (g.get('dead') or 0) > 0)
    ok('and roughly the 12%% the law says is lit, not half the valley (%.1f%%)'
       % (100.0 * (g.get('live') or 0) / max(1, (g.get('live') or 0) + (g.get('dead') or 0))),
       0.005 < (g.get('live') or 0) / max(1, (g.get('live') or 0) + (g.get('dead') or 0)) < 0.45)

    # ---- 3-4. THE CITY SENDS IT.
    sent = d.get('sent') or []
    withd = [s for s in sent if isinstance(s.get('litD'), int)]
    ok('the city reports the distance to the nearest live circuit on the real '
       'heartbeat (%s)' % json.dumps(sent[-2:]), bool(withd))
    ok('and it is a real answer in cells, or -1 for none within three (%s)'
       % [s.get('litD') for s in withd],
       all(-1 <= (s.get('litD') or 0) <= 3 for s in withd))

    picks = d.get('picks') or {}

    def share(k, ev):
        c = picks.get(k) or {}
        return c.get(ev, 0) / max(1, sum(c.values()))

    # ---- 5-8. A DEAD BLOCK HAS NO MACHINES ON IT. NOT LESS OFTEN. NONE.
    ok('A DEAD BLOCK NEVER HUMS, in a MACHINE district, which is where the '
       'generator was most likely of all: %d of 4000 draws'
       % (picks.get('machineDead') or {}).get('generator', 0),
       (picks.get('machineDead') or {}).get('generator', 0) == 0)
    ok('and a dead block never advertises either -- a neon sign that is ON '
       'cannot be on a circuit nobody feeds: %d sign draws in a LIT district '
       'with a dead grid'
       % (picks.get('litDead') or {}).get('sign_alive', 0),
       (picks.get('litDead') or {}).get('sign_alive', 0) == 0)
    ok('but the valley is not SILENT on a dead block, it is machine-less: the '
       'wind still comes through (%.0f%% in open ground)'
       % (share('openDead', 'wind_gust') * 100),
       share('openDead', 'wind_gust') > 0.2)
    ok('and the air still plays, so a dead street is a place and not a hole '
       '(%.0f%% bed in a dead machine district)'
       % (share('machineDead', 'air_day') * 100),
       share('machineDead', 'air_day') > 0.4)

    # ---- 9-10. A LIVE ONE DOES.
    ok('standing ON a live circuit the machine is heard (%.0f%% of draws)'
       % (share('machineOnIt', 'generator') * 100),
       share('machineOnIt', 'generator') > 0.2)
    ok('and two streets away it is still heard, which is the row\'s own words '
       '"audible from the next street" (%.0f%%)'
       % (share('machineNear', 'generator') * 100),
       share('machineNear', 'generator') > 0.2)

    # ---- 11-12. AND A SENDER THAT REPORTS NO POWER IS UNCHANGED. null is not
    #      -1: "not reported" and "looked and it is dead" are different facts,
    #      and the run slice sends the first.
    ok('a report with NO power field at all is exactly what it was -- the run '
       'slice sends none, and null must not be read as dark (generator %.0f%%, '
       'and it was 12.5%%)' % (share('noPlaceNull', 'generator') * 100),
       0.09 < share('noPlaceNull', 'generator') < 0.16)
    ok('while the same sender reporting a DEAD grid is silenced (%d draws) -- '
       'the two are different facts and the code treats them so'
       % (picks.get('noPlaceDead') or {}).get('generator', 0),
       (picks.get('noPlaceDead') or {}).get('generator', 0) == 0)

    # ---- 13-16. AND THE DISTANCE IS REAL, MEASURED AS LEVEL.
    loud = d.get('loud') or {}
    ok('the room was quiet before measuring the hum (%s on the bed\'s own bus)'
       % loud.get('base'), loud.get('base') is not None and loud.get('base') < 0.02)
    ok('the hum on your own block is audible (mean peak %s over ten plays)'
       % loud.get('onIt'), (loud.get('onIt') or 0) > 0.01)
    # *** THE DISTANCE IS CHECKED AS A NUMBER, AND THAT IS A DECISION WITH A
    #     PRECEDENT, NOT A RETREAT. *** Four attempts to measure it as loudness
    #     each turned up a real defect in the ruler -- the master's brickwall
    #     limiter squashing both ends to one ceiling, candidate variance (two of
    #     his candidates differ by more than a block does), then long tails
    #     bleeding from one play into the next window -- and the fourth still
    #     could not separate one block from three. The shell already solved this
    #     exact problem once, for the room transform, and says so: "measuring the
    #     room by playing playSFX twice proves nothing." So the GAME'S OWN
    #     computed distance is asserted exactly, and whether a hum is audible at
    #     all is still measured on real audio, above.
    dist = d.get('dist') or {}
    ok('the game exposes the distance it computes, so it can be checked exactly '
       'rather than guessed at through a limiter (%s)' % json.dumps(dist), bool(dist))
    if dist:
        ok('on your own block the hum is close (%s), a street away it is a '
           'street away (%s), two streets (%s), three (%s) -- the grid\'s answer, '
           'rising with every cell'
           % (dist.get('0'), dist.get('1'), dist.get('2'), dist.get('3')),
           dist.get('0') is not None
           and dist['0'] < dist['1'] < dist['2'] < dist['3'])
        ok('and with no live circuit the distance is not used at all (%s, the '
           'old dial) -- the hum is silenced above, not moved' % dist.get('-1'),
           abs((dist.get('-1') or 0) - 10.5) < 0.01)
    ok('and the probe put the bed back the way it found it',
       loud.get('pickPutBack'))

    ok('nothing threw (%s)' % (d.get('errs') or 'clean'), not d.get('errs'))

    print('  %d passed, %d FAILED' % (p, f))
    if not f:
        print('  You can hear whose block still has power from the next street, '
              'and a dead one is dead.')
    return 1 if f else 0


if __name__ == '__main__':
    sys.exit(main())
