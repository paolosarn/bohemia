#!/usr/bin/env python3
"""
CITYMUS ROTATION GATE (8/7/26) - the streets do not repeat, and the clock is heard.

THIS MEASURES BEHAVIOUR, NOT SOURCE. Both bugs it covers are invisible to a
grep: "pick() has no memory" and "a phase change waits out a 64-bar pass" are
both perfectly readable code that does the wrong thing. So this drives the real
CITYMUS in the real page, calls pick() hundreds of times, and counts.

THE PROBABILITY ARGUMENT IT RESTS ON. With a pool of N drawn uniformly and no
memory, the chance the next pick equals the current one is 1/N. His pools are
10 / 5 / 2, so at dusk that is a coin flip. Over 200 consecutive picks a broken
build produces roughly 100 repeats and a fixed one produces exactly zero. That
gap is not a threshold anyone has to tune -- ZERO is the assertion.

A MENTION IS NOT A USE: the checks below never test that the words are in the
file. They test what the function returns.
"""
import json
import os
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

JS = r'''
const path = require('path');
function pwmod(){for(const g of ['/opt/node22/lib/node_modules','/usr/lib/node_modules','/usr/local/lib/node_modules']){try{return require(path.join(g,'playwright'));}catch(e){}}return require('playwright');}
const pw = pwmod();

(async () => {
  const { chromium } = pw;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport:{width:390,height:844}, hasTouch:true, isMobile:true });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.join(process.argv[2], 'slices', 'BOHEMIA_ALPHA_0_9.html'));
  await p.waitForTimeout(1500);
  await p.click('#front', { force:true }).catch(()=>{});
  await p.waitForTimeout(900);
  // the studio has to have built once for MUS.cats to be loaded (the 7/6 fix)
  await p.evaluate(() => { const t=document.querySelector('.tab[data-p="music"]'); if(t)t.click(); });
  await p.waitForTimeout(2400);

  const out = {};

  // THE POOLS, as the game itself computes them. Not re-derived from the tags:
  // candidates() is the function that decides, so candidates() is what is asked.
  out.pools = await p.evaluate(() => {
    const r = {};
    for (const ph of ['NIGHT','DAY','DUSK','DAWN']) {
      CITYMUS.phase = ph;
      r[ph] = { cat: CITYMUS.phaseCat(), n: CITYMUS.candidates().length };
    }
    return r;
  });

  // NO REPEAT. Simulate the shuffle honestly: pick, ADOPT the pick as the thing
  // now playing (that is what play() does), pick again. A test that does not
  // adopt would never exercise the filter at all.
  out.repeats = await p.evaluate(() => {
    const r = {};
    for (const ph of ['NIGHT','DAY','DUSK']) {
      CITYMUS.phase = ph;
      let rep = 0, prev = null, distinct = new Set();
      for (let i = 0; i < 200; i++) {
        const c = CITYMUS.pick();
        if (!c) break;
        const key = c.fi + ':' + c.slot;
        if (prev !== null && key === prev) rep++;
        distinct.add(key);
        prev = key;
        MUS.cur = c.fi; MUS.curSlot = c.slot;      // adopt, exactly like play()
      }
      r[ph] = { repeats: rep, distinct: distinct.size };
    }
    return r;
  });

  // A ONE-SONG POOL MUST NOT GO SILENT. The filter has to yield when there is
  // nothing else to play, or the failsafe in candidates() is defeated by the
  // very fix meant to help it.
  out.singleton = await p.evaluate(() => {
    const real = CITYMUS.candidates.bind(CITYMUS);
    CITYMUS.candidates = () => [{ fi: MFACTIONS.length, slot: 1 }];
    MUS.cur = MFACTIONS.length; MUS.curSlot = 1;      // it IS the one playing
    const got = CITYMUS.pick();
    CITYMUS.candidates = real;
    return !!got;
  });

  // THE PHASE TURN, DRIVEN THROUGH THE REAL WATCH INTERVAL.
  //
  // The first version of this check re-implemented the tick inside the gate and
  // asserted against its own copy. It was GREEN against a build whose real
  // scheduler had been mutated to wait out the whole 64-bar pass -- a perfect
  // side-door probe, caught only by mutation testing. VERIFY ON THE REAL
  // SURFACE (7/18) is not just about pixels.
  //
  // So: start the actual shuffle (with play() counted instead of sounding, so no
  // audio and no MUS.start), then move MUS.step and let the shipped 400ms
  // interval decide. Nothing here knows what the boundary rule is.
  out.phase = await p.evaluate(async () => {
    const r = {};
    let played = 0;
    const realPlay = CITYMUS.play.bind(CITYMUS);
    CITYMUS.play = () => { played++; };
    const wait = ms => new Promise(res => setTimeout(res, ms));

    CITYMUS.stopShuffle();
    CITYMUS.pend = false; CITYMUS.pendAt = null;
    CITYMUS.onPhaseChange();
    r.armsWhenOff = CITYMUS.pend;                 // must be false: nothing is playing

    CITYMUS.startShuffle();                       // the REAL watch interval, live
    played = 0;                                   // startShuffle plays once by design
    MUS.step = 300;                               // mid-phrase, bar 18 of 64
    CITYMUS.pend = false; CITYMUS.pendAt = null;
    CITYMUS.onPhaseChange();
    r.armsWhenOn = CITYMUS.pend;                  // must be true
    r.playedOnArm = played;                       // must be 0: arming is not playing

    await wait(900);                              // two ticks of the shipped interval
    r.target = CITYMUS.pendAt;                    // 384 = the next 8-bar line
    r.playedEarly = played;                       // must be 0: step is still 300

    MUS.step = 383; await wait(900);
    r.playedAt383 = played;                       // still 0, one step short

    MUS.step = 384; await wait(900);
    r.playedAt384 = played;                       // now exactly 1

    // AND IT TURNS OVER ONCE, NOT EVERY TICK. Holding the step at the boundary
    // for several more ticks must not fire again. NOTE the earlier version of
    // this asserted !CITYMUS.pend and failed on a CORRECT build: the live world
    // clock keeps reporting, and a genuine phase change re-arms a fresh turn,
    // which is the feature working rather than a leak. Re-arming is fine; firing
    // twice for one change is not, so count firings instead of reading a flag.
    await wait(1200);
    r.playedAfterHold = played;                   // still exactly 1

    CITYMUS.stopShuffle();
    CITYMUS.play = realPlay;
    return r;
  });

  // AND THE WIRE REALLY CALLS IT. The hook existing is worth nothing if the
  // clock never rings it -- that is the exact shape of every bug this lane has
  // shipped. Move the clock across a real boundary and watch for the arm.
  out.wired = await p.evaluate(() => {
    let armed = 0;
    const real = CITYMUS.onPhaseChange.bind(CITYMUS);
    CITYMUS.onPhaseChange = () => { armed++; real(); };
    // NIGHT -> DAY -> NIGHT, through the parent's own message receiver
    for (const min of [3*60, 12*60, 3*60]) {
      window.postMessage({ type:'BOHEMIA_WHERE', inside:false, night:(min<6*60), min:min, space:'STREET' }, '*');
    }
    return new Promise(res => setTimeout(() => {
      CITYMUS.onPhaseChange = real;
      res({ armed: armed, phase: CITYMUS.phase });
    }, 400));
  });

  out.errors = errs.slice(0, 4);
  console.log(JSON.stringify(out));
  await b.close();
})();
'''


def main():
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as f:
        f.write(JS)
        js = f.name
    try:
        r = subprocess.run(['node', js, ROOT], capture_output=True, text=True, timeout=420)
    finally:
        os.unlink(js)

    line = [l for l in r.stdout.strip().split('\n') if l.startswith('{')]
    if not line:
        print('=== CITYMUS ROTATION GATE ===')
        print('  > FAIL the browser run produced nothing')
        print(r.stdout[-1200:])
        print(r.stderr[-1200:])
        return 1
    d = json.loads(line[-1])

    print('=== CITYMUS ROTATION GATE - the streets do not repeat themselves ===')
    p = f = 0

    def ok(name, cond):
        nonlocal p, f
        if cond:
            p += 1
        else:
            f += 1
            print('  > FAIL ' + name)

    pools = d.get('pools') or {}
    for ph in ('NIGHT', 'DAY', 'DUSK', 'DAWN'):
        ok('the %s pool is not empty (a silent phase is a dead phase)' % ph,
           (pools.get(ph) or {}).get('n', 0) > 0)
    ok('DUSK and DAWN share one pool, the way he tagged them',
       (pools.get('DUSK') or {}).get('cat') == (pools.get('DAWN') or {}).get('cat'))

    reps = d.get('repeats') or {}
    for ph in ('NIGHT', 'DAY', 'DUSK'):
        r = reps.get(ph) or {}
        n = (pools.get(ph) or {}).get('n', 0)
        # with no memory this is ~200/n. ZERO is the assertion, not a threshold.
        ok('%s: ZERO back-to-back repeats in 200 picks (pool of %d, so a memoryless '
           'shuffle would give about %d)' % (ph, n, (200 // n) if n else 0),
           r.get('repeats') == 0)
        ok('%s: the shuffle still reaches the whole pool (%d of %d distinct)'
           % (ph, r.get('distinct', 0), n),
           n <= 1 or r.get('distinct', 0) == n)

    ok('a ONE-song pool still plays instead of going silent (the filter yields)',
       d.get('singleton'))

    ph = d.get('phase') or {}
    ok('a phase change while the shuffle is OFF arms nothing', ph.get('armsWhenOff') is False)
    ok('a phase change while it is ON arms a turn', ph.get('armsWhenOn') is True)
    ok('arming NEVER plays by itself (a clock report cannot interrupt a song)',
       ph.get('playedOnArm') == 0)
    ok('the turn is scheduled on an 8-bar line (step 300 -> 384)', ph.get('target') == 384)
    ok('nothing turns over early, mid-phrase', ph.get('playedEarly') == 0)
    ok('nothing turns over at step 383, one step short of the line',
       ph.get('playedAt383') == 0)
    ok('it DOES turn over the moment the 8-bar line lands (16s worst case, was 128s)',
       ph.get('playedAt384') == 1)
    ok('it turns over ONCE, not on every tick of the interval',
       ph.get('playedAfterHold') == 1)

    w = d.get('wired') or {}
    ok('THE CLOCK REALLY RINGS IT: moving the world clock across a boundary armed '
       'the turn %d time(s)' % (w.get('armed') or 0), (w.get('armed') or 0) >= 2)

    ok('the page threw nothing: %s' % (d.get('errors') or 'clean'), not d.get('errors'))

    print('    pools: ' + ', '.join('%s %d' % (k, (v or {}).get('n', 0))
                                    for k, v in pools.items()))
    print('  %d passed, %d FAILED' % (p, f))
    if not f:
        print('  A two-song pool used to be a coin flip on repeat. It now strictly '
              'alternates, and dawn is audible in 16 seconds instead of 128.')
    return 1 if f else 0


if __name__ == '__main__':
    sys.exit(main())
