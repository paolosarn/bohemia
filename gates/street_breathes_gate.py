#!/usr/bin/env python3
"""
THE STREET BREATHES GATE (9/11/26, SOUNDS lane) - [music owned].

DOES THE MUSIC EVER STOP, AND CAN THE REST STRAND THE MASTER AT ZERO?

MEASURED before this existed, twelve minutes with a recorder in the page: the
street music NEVER went quiet, not once, and every song was swapped at EXACTLY
128 seconds -- the 64-bar pass, the engine's loop length, a number about buffers
rather than about music. The ambience bed this lane built on 9/5 plays
permanently underneath it.

So the street rests one phrase between songs, and this gate is mostly about the
ways that could go wrong, because a rest is a DUCK on the music master and a
ducked master that never comes back is a dead soundtrack.

THE THREE HAZARDS IT ASSERTS, AND THE SECOND ONE IS A BUG THIS GATE'S OWN PROBE
FOUND IN THE FIRST CUT:
  1. A FIGHT during a rest gets the music back on the next beat.
  2. THE WATCH KILLED MID-REST still comes back, because the way back is booked
     on the AUDIO CLOCK up front, not left to a timer. FIGHTMUS.enter() CLEARS
     CITYMUS.watch, so the first cut -- which relied on that timer to un-duck --
     produced a permanently SILENT FIGHT. A REST WHOSE ONLY WAY OUT IS A TIMER
     ANOTHER SYSTEM MAY DELETE IS A TRAP.
  3. THE SHUFFLE TURNED OFF mid-rest leaves no rest state behind for whatever
     plays next.

AND IT ASSERTS THERE IS ONLY ONE FORMULA FOR A PHRASE, because there were two and
BOTH WERE WRONG: (128/16)*(60/120)*1000 is 8 bars times a BEAT, 4000 ms, and a
phrase is 8 bars of TWO seconds, 16000. INTERIORMUS's door debounce ran at a
quarter of the size its own comment claimed. It is one function now and it asks
MUS.stepDur() rather than doing sums, so the tempo owns the tempo.

THE PASS END IS DRIVEN, NOT WAITED FOR. Walking the transport to step 1020 is the
same code path arriving sooner, which is the argument the fight music gate already
makes for the same trick -- waiting out real 128-second passes would put minutes
on the suite for nothing.

A MENTION IS NOT A USE: nothing below greps the alpha for a word. Every claim is
a value the running game returned.
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
  const out = {};
  try {
    await p.goto('file://' + path.join(process.argv[2], 'slices', 'BOHEMIA_ALPHA_0_9.html'));
    await p.waitForTimeout(1500);
    await p.click('#front', { force:true }).catch(()=>{});
    /* the opening hands over on its own -- forcing the shuffle here resets
       MUS.step under MENUMUS's watch and deadlocks the handoff for the run */
    out.openingOver = await p.evaluate(async () => { const t=Date.now();
      while (Date.now()-t < 60000) { await new Promise(r=>setTimeout(r,300));
        if (!MENUMUS.on && CITYMUS.on) return true; } return false; });

    out.hasRest = await p.evaluate(() => typeof CITYMUS.beginRest === 'function'
      && typeof CITYMUS.endRest === 'function');

    /* ---- ONE FORMULA FOR A PHRASE, AND IT ASKS THE ENGINE ---------------- */
    out.phrase = await p.evaluate(() => {
      const r = {};
      r.helper = typeof phraseMs === 'function' ? phraseMs() : null;
      r.restLen = CITYMUS.restLen ? CITYMUS.restLen() : null;
      r.stepDur = MUS.stepDur ? MUS.stepDur() : null;
      /* THE HELPER MUST FOLLOW THE TRANSPORT, not carry its own copy of 120 BPM.
         Swap stepDur for a doubled one and the phrase must double with it. */
      const real = MUS.stepDur;
      try { MUS.stepDur = () => real.call(MUS) * 2;
            r.doubled = typeof phraseMs === 'function' ? phraseMs() : null; }
      finally { MUS.stepDur = real; }
      r.afterRestore = typeof phraseMs === 'function' ? phraseMs() : null;
      return r;
    });

    /* ---- A REAL PASS END, DRIVEN: the watch's own step>=1024 branch ------- */
    out.realRest = await p.evaluate(async () => {
      const songOf = () => { const c = MUS.cur;
        const f = (c < MFACTIONS.length) ? MFACTIONS[c] : MLOOPS[c-MFACTIONS.length];
        return f ? f.n : null; };
      const before = songOf();
      MUS.step = 1020;                 /* the same branch, arriving sooner */
      const t = Date.now(); let began = null;
      while (Date.now()-t < 15000) { await new Promise(r=>setTimeout(r,100));
        if (CITYMUS.resting) { began = Date.now()-t; break; } }
      if (began === null) return { began: null };
      await new Promise(r=>setTimeout(r,2000));
      /* CAN THE BED STILL BE HEARD WITH THE MUSIC MASTER AT ZERO? That is the
         whole point of the gap, and A GAIN READ IS NOT THE PROOF: AMB.bus is
         null until a bed sound has actually played, and a bed gap is 25 to 130
         seconds, so a 16-second rest often contains none of its own. So ask it
         directly -- with the master ducked, make the bed play and count the
         renders. If the bed sat on the music master this would come back 0. */
      const mid = { gain: +MUS.MAST.gain.value.toFixed(3), beat: !!MUS.playing,
                    step: MUS.step, bed: (window.__AMB && window.__AMB.kind) || null };
      { let n = 0; const real = BOH_SFX.render;
        BOH_SFX.render = function(){ n++; return real.apply(this, arguments); };
        /* AMB.tick() IS THE PLAYER. AMB.pick() only CHOOSES A NAME and returns a
           string -- the first cut of this check called pick() six times and
           reported "0 renders", which reads exactly like a bed silenced by the
           duck. I CALLED THE CHOOSER AND EXPECTED SOUND.
           tick() rate-limits itself to its own gap (25 to 130 seconds), so the
           gap counter is cleared before each call to ask for one now. */
        try { for (let i=0;i<6;i++){
                try{ window.__AMB.next = 1; window.__AMB.tick(); }catch(e){}
                await new Promise(r=>setTimeout(r,120)); } }
        finally { BOH_SFX.render = real; }
        mid.bedPlaysWhileDucked = n;
        mid.gainStillDucked = +MUS.MAST.gain.value.toFixed(3); }
      const t2 = Date.now(); let ended = null;
      while (Date.now()-t2 < 40000) { await new Promise(r=>setTimeout(r,150));
        if (!CITYMUS.resting) { ended = Date.now()-t2; break; } }
      await new Promise(r=>setTimeout(r,900));
      return { began: began, mid: mid, restMs: ended,
               after: { gain: +MUS.MAST.gain.value.toFixed(3), song: songOf(),
                        beat: !!MUS.playing, changed: songOf() !== before } };
    });

    /* ---- HAZARD 1: A FIGHT DURING A REST --------------------------------- */
    out.fight = await p.evaluate(async () => {
      const ok = CITYMUS.beginRest();
      await new Promise(r=>setTimeout(r,1500));
      const ducked = +MUS.MAST.gain.value.toFixed(3);
      try { FIGHTMUS.enter(); } catch(e) {}
      const t = Date.now(); let back = null;
      while (Date.now()-t < 5000) { await new Promise(r=>setTimeout(r,100));
        if (MUS.MAST.gain.value > 0.4) { back = Date.now()-t; break; } }
      const r = { taken: ok, duckedTo: ducked, backMs: back,
                  resting: CITYMUS.resting, beat: !!MUS.playing };
      /* PUT THE STATE BACK. The last probe ran these in sequence without doing
         this, and FIGHTMUS.enter() leaves CITYMUS.on false, so the two hazards
         after it reported "never saw a rest" -- which reads exactly like a
         feature that does not work. A TEST THAT BREAKS THE STATE THE NEXT TEST
         NEEDS REPORTS A BUG THAT IS NOT THERE. */
      try { FIGHTMUS.on = false; FIGHTMUS.cityWas = false; } catch(e) {}
      CITYMUS.startShuffle();
      await new Promise(r=>setTimeout(r,500));
      r.restored = CITYMUS.on;
      return r;
    });

    /* ---- HAZARD 2: EVERY TIMER DEAD, the audio clock is the floor -------- */
    out.stranded = await p.evaluate(async () => {
      const ok = CITYMUS.beginRest();
      await new Promise(r=>setTimeout(r,1500));
      const ducked = +MUS.MAST.gain.value.toFixed(3);
      clearInterval(CITYMUS.watch); CITYMUS.watch = null;
      const t = Date.now(); let back = null;
      while (Date.now()-t < 30000) { await new Promise(r=>setTimeout(r,150));
        if (MUS.MAST.gain.value > 0.4) { back = Date.now()-t; break; } }
      const r = { taken: ok, duckedTo: ducked, backMs: back };
      CITYMUS.resting = false; CITYMUS.restGain = null;
      CITYMUS.startShuffle();
      await new Promise(r=>setTimeout(r,500));
      r.restored = CITYMUS.on;
      return r;
    });

    /* ---- HAZARD 3: OFF MID-REST leaves nothing behind -------------------- */
    out.off = await p.evaluate(async () => {
      const ok = CITYMUS.beginRest();
      await new Promise(r=>setTimeout(r,1500));
      CITYMUS.stopShuffle();
      await new Promise(r=>setTimeout(r,800));
      const r = { taken: ok, resting: CITYMUS.resting,
                  cleared: CITYMUS.restGain === null };
      CITYMUS.startShuffle();
      await new Promise(r=>setTimeout(r,1200));
      r.playsAgain = +MUS.MAST.gain.value.toFixed(3);
      return r;
    });
  } catch (e) { out.fatal = String(e && e.message || e); }
  out.pageErrors = errs.slice(0,5);
  console.log('@@' + JSON.stringify(out));
  await b.close();
})();
'''


def below(x, lim):
    """x is a real number AND under lim.

    NEVER `(x or default) < lim`. The first cut of this gate wrote
    `(duckedTo or 1) < 0.02` and a PERFECT ZERO -- the best possible result, the
    master fully ducked -- read as the default 1 and FAILED, because 0 is falsy
    in Python. This is the second time this lane has made that exact mistake; the
    earlier one read a perfect 0 peak as a missing measurement. A GUARD THAT
    TREATS THE IDEAL READING AS A MISSING ONE IS WORSE THAN NO GUARD.
    """
    return isinstance(x, (int, float)) and not isinstance(x, bool) and x < lim


def above(x, lim):
    """x is a real number AND over lim. Same reason as below()."""
    return isinstance(x, (int, float)) and not isinstance(x, bool) and x > lim


def main():
    p = f = 0

    def ok(name, cond):
        nonlocal p, f
        if cond:
            p += 1
        else:
            f += 1
            print('  > FAIL ' + name)

    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as fh:
        fh.write(JS)
        js = fh.name
    try:
        r = subprocess.run(['node', js, ROOT], capture_output=True, text=True,
                           timeout=400)
    except subprocess.TimeoutExpired:
        print('  > FAIL the probe did not finish')
        print('\n=== STREET BREATHES GATE: 0 passed, 1 failed ===')
        return 1
    finally:
        os.unlink(js)

    line = [l for l in r.stdout.splitlines() if l.startswith('@@')]
    ok('the probe drove the real alpha and reported', bool(line))
    if not line:
        print(r.stdout[-1500:])
        print(r.stderr[-1500:])
        print('\n=== STREET BREATHES GATE: %d passed, %d failed ===' % (p, f))
        return 1
    d = json.loads(line[0][2:])
    ok('and it did not die on the way (%s)' % (d.get('fatal') or 'no fatal'),
       not d.get('fatal'))
    ok('the page threw nothing (%s)' % (d.get('pageErrors') or 'none'),
       not d.get('pageErrors'))
    ok('the opening handed over on its own, unforced', d.get('openingOver'))
    ok('the street has a rest at all', d.get('hasRest'))

    # ---- ONE FORMULA, AND IT ASKS THE ENGINE -------------------------------
    ph = d.get('phrase') or {}
    ok('there is a phrase helper and it returns 16000ms -- 8 bars of TWO seconds '
       'at 120 BPM, not 8 bars of a beat (%s)' % ph.get('helper'),
       ph.get('helper') == 16000)
    ok('the rest is exactly one phrase long, from that same helper (%s vs %s)'
       % (ph.get('restLen'), ph.get('helper')),
       ph.get('restLen') is not None and ph.get('restLen') == ph.get('helper'))
    ok('and the phrase FOLLOWS THE TRANSPORT rather than carrying its own copy '
       'of 120 BPM: doubling MUS.stepDur doubled it (%s -> %s)'
       % (ph.get('helper'), ph.get('doubled')),
       isinstance(ph.get('helper'), (int, float))
       and ph.get('doubled') == ph.get('helper') * 2)
    ok('and the probe put the tempo back (%s)' % ph.get('afterRestore'),
       ph.get('afterRestore') == ph.get('helper'))

    # ---- A REAL PASS END ---------------------------------------------------
    rr = d.get('realRest') or {}
    mid = rr.get('mid') or {}
    aft = rr.get('after') or {}
    ok('the end of a 64-bar pass STARTS A REST instead of cutting straight to '
       'the next song (rest began after %s ms)' % rr.get('began'),
       rr.get('began') is not None)
    ok('THE MUSIC ACTUALLY GOES QUIET in it (master gain %s)' % mid.get('gain'),
       below(mid.get('gain'), 0.02))
    ok('AND THE BEAT NEVER STOPS -- the 120 BPM law is about a clock that keeps '
       'running (transport playing: %s, step %s)'
       % (mid.get('beat'), mid.get('step')), mid.get('beat') is True)
    ok('AND THE BED STILL SOUNDS WITH THE MUSIC MASTER AT ZERO -- it is what the '
       'gap is FOR, and it proves the duck cannot reach the SFX bus (%s, %s '
       'renders while the master sat at %s)'
       % (mid.get('bed'), mid.get('bedPlaysWhileDucked'), mid.get('gainStillDucked')),
       mid.get('bed') and above(mid.get('bedPlaysWhileDucked'), 0)
       and below(mid.get('gainStillDucked'), 0.02))
    ok('the rest lasted about one phrase (%s ms)' % rr.get('restMs'),
       rr.get('restMs') is not None and 13000 <= rr.get('restMs') <= 22000)
    ok('the music came back after it (master gain %s)' % aft.get('gain'),
       above(aft.get('gain'), 0.4))
    ok('and it came back as a DIFFERENT song (%s)' % aft.get('song'),
       aft.get('changed'))
    ok('the beat is still running at the end', aft.get('beat') is True)

    # ---- THE THREE HAZARDS ------------------------------------------------
    fi = d.get('fight') or {}
    ok('HAZARD 1, a fight during a rest: the rest was taken and the master was '
       'ducked (%s)' % fi.get('duckedTo'),
       fi.get('taken') and below(fi.get('duckedTo'), 0.02))
    ok('and the music comes back ON THE NEXT BEAT, not at the end of the phrase '
       '(%s ms) -- danger is now' % fi.get('backMs'),
       below(fi.get('backMs'), 2000))
    ok('and the rest is over, not merely inaudible', fi.get('resting') is False)
    ok('and the probe put the shuffle back for the tests after it',
       fi.get('restored'))

    st = d.get('stranded') or {}
    ok('HAZARD 2, EVERY TIMER DEAD MID-REST: the music still comes back, because '
       'the way out is booked on the AUDIO CLOCK (%s ms). FIGHTMUS.enter clears '
       'CITYMUS.watch, and the first cut of this produced a permanently silent '
       'fight' % st.get('backMs'),
       st.get('taken') and st.get('backMs') is not None)
    ok('and it came back at about a phrase, unaided (%s ms)' % st.get('backMs'),
       st.get('backMs') is not None and 12000 <= st.get('backMs') <= 22000)

    of = d.get('off') or {}
    ok('HAZARD 3, the shuffle turned off mid-rest leaves no rest running '
       '(resting %s, level cleared %s)' % (of.get('resting'), of.get('cleared')),
       of.get('taken') and of.get('resting') is False and of.get('cleared'))
    ok('and turning it back on plays at full level, with no ducked master '
       'inherited (%s)' % of.get('playsAgain'),
       above(of.get('playsAgain'), 0.4))

    print('  MEASURED  rest %s ms, master ducked to %s, beat alive, bed %s. '
          'Before this the music never stopped once in twelve minutes.'
          % (rr.get('restMs'), mid.get('gain'), mid.get('bed')))
    print('\n=== STREET BREATHES GATE: %d passed, %d failed ===' % (p, f))
    return 0 if f == 0 else 1


if __name__ == '__main__':
    sys.exit(main())
