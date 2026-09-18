#!/usr/bin/env python3
"""
THE BEAT SURVIVES A PHONE GATE (9/18/26, SOUNDS lane) - [scheduled beat].

A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED, and the 120 BPM law -- this lane's
central law -- had no machine watching it on a phone. BEAT FIRST exists and runs
UNTHROTTLED, so it has always been asking about a machine several times faster
than the one he holds. PLUMBER found that class of mistake fleet-wide (f90a810:
the speed gate has taken a phone-shaped CPU since 9/5 and discarded it every
time) and measured the consequence: 31.6% of beats late on a phone, 8.3%
swallowed whole, one beat in twelve never happening.

WHAT THIS GATE ASKS, and it asks the transport rather than the file: in one window
on a PHONE-SHAPED CPU, what fraction of the steps that should have been booked
into the audio graph really were?

WHAT IT REFUSES TO ACCEPT AS EVIDENCE, because each of these has burned somebody
here already:
  * AN UNTHROTTLED RUN. It throttles, and it PROVES the throttle real inside the
    same run with a busy loop, which is PLUMBER's rule: a throttle that silently
    failed to apply would publish fast numbers under a slow label.
  * A COLD YARDSTICK. The busy loop is warmed four times a side before it is
    timed. The first version of it ran cold then warm and reported 0.51x with NO
    throttle applied -- it was timing the JIT compiling the loop, not the CPU.
    An unthrottled control must come back near 1.0 or the yardstick is the thing
    being measured.
  * A GREP, OR A CALL COUNT. MUS.playStep is wrapped, so the only countable thing
    is a step really handed to Web Audio.
  * A COVERAGE NUMBER WITH NO COST NUMBER. A wider horizon always books more
    steps and always commits more unchangeable music, so the committed music must
    stay inside one beat as well. A coverage claim alone is satisfiable by making
    the game unresponsive.
  * AN ABSOLUTE COVERAGE FLOOR AT 4x, AT ALL. I wrote one at 40% off two runs, and
    five legitimate 4x runs then read 53.1, 50.0, 48.8, 33.8 and 32.5 percent -- the
    floor sat inside the real spread and failed a build that was fine. Coverage on
    a throttled box is partly a measurement OF THE BOX. So the verdict is PAIRED:
    the same window is run with the shipped horizon and then with the old 0.12 s
    one, minutes apart on the same machine, and what is held is the RATIO. The
    absolute percentages are printed on every run and none of them is asserted.
    That is the suite's own rule -- pair every before/after inside one window, or
    you measure the hour.
  * A PASS THAT SURVIVES THE FIX BEING REMOVED. The old horizon is not a side
    check here, it is the denominator of the verdict.
The ceiling on committed music is the engine's own beat, and the on-time claim is a
ratchet against the measured before-value. Neither is a constant of mine.
"""
import json
import os
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# *** THERE IS NO ABSOLUTE COVERAGE FLOOR HERE ANY MORE, AND THAT IS THE POINT. ***
# I wrote one at 40% off two runs. Five legitimate 4x runs (throttle proved 4.2 to
# 4.7x) then read 53.1, 50.0, 48.8, 33.8 and 32.5 percent -- the floor sat INSIDE
# the real spread, so it failed a build that was fine. THE RUN THAT PROVED THE PAIR
# WORKS is the last one: 32.5% would have failed the old floor, and the old horizon
# booked 12.5% on that same box, so the ratio read 2.60x and the verdict held.
# That was the fifth time in five rounds that a threshold of mine was measuring
# the box instead of the game.
#
# THE INSTRUMENT THAT CANNOT HAVE THAT BUG IS A PAIRED ONE, which is the fleet's
# own lesson in the suite's own words: "pair every before/after inside one window,
# or you measure the hour". This gate already runs the old horizon as its mutation,
# so coverage is held as the RATIO of the shipped horizon to the old one, measured
# minutes apart on the same box. Measured pairs so far: 48.8/23.1 = 2.1x,
# 50.0/27.5 = 1.8x, 33.8/7.5 = 4.5x, 32.5/12.5 = 2.6x. The floor is 1.4x,
# comfortably under the worst pair and far above 1.0, and no box speed can move it.
# Absolute percentages are still PRINTED on every run. None of them is asserted.
MIN_GAIN_OVER_OLD_HORIZON = 1.4
FLOOR_PCT_1X = 70.0          # 1x is the fast box: 94-95% measured, four runs


def js():
    return r'''
const path = require('path');
function pwmod(){for(const g of ['/opt/node22/lib/node_modules','/usr/lib/node_modules','/usr/local/lib/node_modules']){try{return require(path.join(g,'playwright'));}catch(e){}}return require('playwright');}
const pw = pwmod();
const REPO = process.argv[2];
const CPU = Number(process.argv[3] || 4);
const MUTATE = process.argv[4] === '--mutate';
const WATCH_MS = 20000;

(async () => {
  const { chromium } = pw;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport:{width:390,height:844}, hasTouch:true, isMobile:true });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const cdp = await p.context().newCDPSession(p);
  const out = { cpu: CPU, mutated: MUTATE, pageErrors: null };
  try {
    /* THE YARDSTICK, WARMED BOTH SIDES. */
    await p.goto('about:blank');
    const yard = async () => { let last = 0;
      for (let i = 0; i < 4; i++) last = (await p.evaluate(() => {
        const t = performance.now(); let x = 0;
        for (let j = 0; j < 3e6; j++) x += j % 7;
        return { ms:+(performance.now()-t).toFixed(1), x:x&1 }; })).ms;
      return last; };
    const y1 = await yard();
    if (CPU > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU });
    const y2 = await yard();
    out.throttle = { off:y1, on:y2, ratio:+(y2/y1).toFixed(2), asked:CPU };

    await p.goto('file://' + path.join(REPO, 'slices', 'BOHEMIA_ALPHA_0_9.html'));
    await p.waitForTimeout(1500);
    await p.click('#front', { force:true }).catch(()=>{});
    await p.click('#fronttap', { force:true }).catch(()=>{});

    let up = false;
    for (let i = 0; i < 220; i++) {
      up = await p.evaluate(() => { try { return !!(MUS && MUS.AC && MUS.playing); } catch(e){ return false; } });
      if (up) break; await p.waitForTimeout(500);
    }
    out.transportRunning = up;
    if (!up) { out.FATAL = 'the transport never started'; console.log(JSON.stringify(out)); await b.close(); return; }

    /* THE HORIZON THE BUILD IS REALLY USING, read by watching what it books. */
    out.armed = await p.evaluate((MUTATE) => {
      const L = window.__G = { booked: [], committed: [], t0: MUS.AC.currentTime };
      const real = MUS.playStep.bind(MUS);
      MUS.playStep = function(s,t,sc){
        try { L.booked.push({ ahead:+(t - MUS.AC.currentTime), now:+(MUS.AC.currentTime-L.t0) }); } catch(e){}
        return real(s,t,sc);
      };
      /* the committed-music watcher: how far past now the transport has booked */
      L.poll = setInterval(() => { try {
        L.committed.push(+(MUS.nextT - MUS.AC.currentTime)); } catch(e){} }, 50);
      if (MUTATE) {
        /* PUT THE OLD HORIZON BACK. The real timer is replaced with one whose only
           difference from the shipped loop is the number this round changed. */
        try { clearInterval(MUS.timer); } catch(e){}
        MUS.timer = setInterval(() => { try {
          const n = MUS.AC.currentTime;
          if (MUS.nextT < n - 0.25) { MUS.nextT = n + 0.06; MUS.step = 0; MUS.uiBar = 0; }
          let c = 0;
          while (MUS.nextT < MUS.AC.currentTime + 0.12) {
            MUS.playStep(MUS.step, MUS.nextT, null);
            MUS.nextT += MUS.stepDur(); MUS.step++;
            if (MUS.step > 1024) MUS.step = 0;
            if (++c > 400) break;
          }
        } catch(e){} }, 25);
      }
      return true;
    }, MUTATE);

    await p.waitForTimeout(WATCH_MS);

    out.result = await p.evaluate((watchMs) => {
      const L = window.__G; clearInterval(L.poll);
      const bk = L.booked;
      const stepDur = (()=>{ try { return MUS.stepDur(); } catch(e){ return 0.125; } })();
      const expected = Math.round((watchMs/1000)/stepDur);
      const com = L.committed.filter(x=>isFinite(x)).sort((a,b)=>a-b);
      const aheads = bk.map(x=>x.ahead).filter(x=>isFinite(x)).sort((a,b)=>a-b);
      let worst = 0;
      for (let i=1;i<bk.length;i++) worst = Math.max(worst, bk[i].now - bk[i-1].now);
      return {
        stepDur:+stepDur.toFixed(4), oneBeatMs:+(stepDur*4*1000).toFixed(0),
        booked:bk.length, expected:expected, pct:+(100*bk.length/expected).toFixed(1),
        horizonMaxMs: aheads.length ? +(aheads[aheads.length-1]*1000).toFixed(0) : null,
        bookedInThePast: aheads.filter(x=>x<0).length,
        committedMedianMs: com.length ? +(com[Math.floor(com.length/2)]*1000).toFixed(0) : null,
        committedMaxMs: com.length ? +(com[com.length-1]*1000).toFixed(0) : null,
        worstGapMs: +(worst*1000).toFixed(0)
      };
    }, WATCH_MS);

    out.pageErrors = errs.length; out.errs = errs.slice(0,3);
  } catch (e) { out.THREW = String(e && e.message); }
  console.log(JSON.stringify(out));
  await b.close();
})();
'''


def run(cpu, mutate=False):
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as f:
        f.write(js())
        path = f.name
    try:
        argv = ['node', path, ROOT, str(cpu)] + (['--mutate'] if mutate else [])
        r = subprocess.run(argv, capture_output=True, text=True, timeout=420)
        lines = [l for l in r.stdout.strip().splitlines() if l.startswith('{')]
        if not lines:
            return {'FATAL': 'no json from the browser', 'stderr': r.stderr[-600:]}
        return json.loads(lines[-1])
    except Exception as e:                                   # noqa: BLE001
        return {'FATAL': str(e)}
    finally:
        os.unlink(path)


def claims(d, floor):
    c = []
    t = d.get('throttle') or {}
    r = d.get('result') or {}
    asked = t.get('asked', 1)

    c.append(('the transport is really running before anything is counted',
              d.get('transportRunning') is True, str(d.get('transportRunning'))))
    if asked > 1:
        c.append(('THE THROTTLE IS PROVED REAL INSIDE THIS RUN, warmed both sides',
                  isinstance(t.get('ratio'), (int, float)) and t['ratio'] >= asked * 0.6,
                  'asked %sx, busy loop %s ms -> %s ms = %sx'
                  % (asked, t.get('off'), t.get('on'), t.get('ratio'))))
    else:
        c.append(('the unthrottled control reads about 1.0, so the yardstick is honest',
                  isinstance(t.get('ratio'), (int, float)) and 0.75 <= t['ratio'] <= 1.35,
                  'busy loop %s ms -> %s ms = %sx with no throttle asked'
                  % (t.get('off'), t.get('on'), t.get('ratio'))))
    # THE COVERAGE NUMBER IS PRINTED, NEVER ASSERTED, at 4x. It varies 33.8% to
    # 53.1% across four legitimate runs because it is partly a measurement of the
    # box, so the verdict on coverage lives in the PAIRED check in main() instead.
    # At 1x the box is the fast one and the number is stable (94-95%, four runs), so
    # a floor there is still meaningful.
    if asked > 1:
        c.append(('steps booked at %sx, REPORTED not held (the verdict is the paired '
                  'comparison against the old horizon)' % asked,
                  True,
                  '%s of %s steps booked = %s%%, worst gap %s ms, throttle %sx'
                  % (r.get('booked'), r.get('expected'), r.get('pct'),
                     r.get('worstGapMs'), t.get('ratio'))))
    else:
        c.append(('THE BEAT REACHES THE AUDIO GRAPH: at least %.0f%% of steps booked at 1x'
                  % floor,
                  isinstance(r.get('pct'), (int, float)) and r['pct'] >= floor,
                  '%s of %s steps booked = %s%% (floor %.0f%%), worst gap %s ms'
                  % (r.get('booked'), r.get('expected'), r.get('pct'), floor,
                     r.get('worstGapMs'))))
    # AND THE BEATS THAT DO ARRIVE ARRIVE ON TIME. A step booked with a negative
    # lead is one Web Audio plays the instant it is handed over, so it is not a
    # missing beat, it is a beat in the WRONG PLACE.
    #
    # *** THE FIRST VERSION OF THIS CLAIM WAS MINE MEASURING MY OWN TOLERANCE, for
    # the fourth round running. It demanded "almost none" with a 2% allowance,
    # picked off ONE observation that happened to read zero. Re-run, the same build
    # at 4x read 5 of 80. Two samples is not a spread -- PLUMBER's own floor is
    # three -- so this does NOT invent a tighter number. It is a RATCHET against
    # the value really measured before the fix, which is the only figure here that
    # is not a guess: at 4x, 17 of 42 booked steps were in the past, 40.5%. The
    # floor is half of that, so a real regression is still caught and a spread I
    # have not measured cannot fail the build.
    past, booked = r.get('bookedInThePast'), r.get('booked')
    frac = (100.0 * past / booked) if (isinstance(past, int) and booked) else None
    c.append(('AND THE BEATS THAT ARRIVE ARRIVE ON TIME: far fewer booked into the past '
              'than before the fix',
              frac is not None and frac <= 20.0,
              '%s of %s booked in the past = %s%% (ceiling 20%%, half the measured '
              'before-value of 40.5%% at 4x; at 1x before it was 10 of 128)'
              % (past, booked, None if frac is None else round(frac, 1))))
    c.append(('AND THE COST IS HELD TOO: committed music stays inside one beat',
              isinstance(r.get('committedMaxMs'), (int, float))
              and isinstance(r.get('oneBeatMs'), (int, float))
              and r['committedMaxMs'] <= r['oneBeatMs'] * 1.35,
              'committed median %s ms, max %s ms against one beat %s ms'
              % (r.get('committedMedianMs'), r.get('committedMaxMs'), r.get('oneBeatMs'))))
    c.append(('the horizon really is about one beat, measured off what it booked',
              isinstance(r.get('horizonMaxMs'), (int, float))
              and r.get('oneBeatMs') and r['horizonMaxMs'] <= r['oneBeatMs'] * 1.2,
              'largest booked-ahead %s ms, one beat is %s ms'
              % (r.get('horizonMaxMs'), r.get('oneBeatMs'))))
    c.append(('nothing threw', d.get('pageErrors') == 0,
              '%s page errors %s' % (d.get('pageErrors'), d.get('errs') or '')))
    return c


def main():
    print('=== THE BEAT SURVIVES A PHONE ===')
    bad = 0
    runs = {}
    for cpu, floor in ((4, None), (1, FLOOR_PCT_1X)):
        print('  -- %sx --' % cpu)
        d = run(cpu)
        runs[cpu] = d
        if d.get('FATAL') or d.get('THREW'):
            print('  FAIL %sx did not complete: %s' % (cpu, d.get('FATAL') or d.get('THREW')))
            if d.get('stderr'):
                print(d['stderr'])
            bad += 1
            continue
        for name, ok, detail in claims(d, floor):
            print('  %s %s' % ('PASS' if ok else 'FAIL', name))
            print('       %s' % detail)
            if not ok:
                bad += 1

    # ---- THE VERDICT ON COVERAGE IS A PAIRED ONE, on the same box minutes apart.
    # An absolute floor here was measuring the box and failed a good build; the
    # ratio of the shipped horizon to the old one cannot have that bug.
    print('  -- the paired comparison: the shipped horizon against the old 0.12 s one --')
    m = run(4, mutate=True)
    now = (runs.get(4) or {}).get('result') or {}
    old = (m.get('result') or {})
    npct, opct = now.get('pct'), old.get('pct')
    if m.get('FATAL') or m.get('THREW'):
        print('  FAIL the old-horizon run did not complete: %s'
              % (m.get('FATAL') or m.get('THREW')))
        bad += 1
    elif not isinstance(npct, (int, float)) or not isinstance(opct, (int, float)) or opct <= 0:
        print('  FAIL INCONCLUSIVE: one side of the pair produced no coverage number '
              '(shipped %s, old %s)' % (npct, opct))
        bad += 1
    else:
        gain = npct / opct
        ok = gain >= MIN_GAIN_OVER_OLD_HORIZON
        print('  %s ONE BEAT OF HORIZON BOOKS MORE OF THE BEAT THAN 0.12 s DID, on the '
              'same box' % ('PASS' if ok else 'FAIL'))
        print('       shipped %s%% against old %s%% = %.2fx (floor %.1fx). Absolute '
              'percentages vary with the box from 33.8%% to 53.1%% across runs, which '
              'is why the pair is the verdict and neither number alone is.'
              % (npct, opct, gain, MIN_GAIN_OVER_OLD_HORIZON))
        if not ok:
            bad += 1

    print('  %d failed' % bad)
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
