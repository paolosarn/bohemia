#!/usr/bin/env python3
"""
BEAT FIRST GATE (9/5/26, SOUNDS lane) - the game has a pulse before it has a
song, and the song lands on it.

THE JOB: [heartbeat first] THE-BEAT-BEFORE-THE-SONG. "The city makes no sound
and the law is 120 BPM. Put a heartbeat on the walked street from the first
second, before any song loads, at 120, quiet, that the first fight's music lands
on."

MEASURED BEFORE THE WORK, on the real surface: the tap sounds at 110ms, it is
over by 401ms, and THE NEXT THING YOU HEAR IS AT 9,824ms. The opening music was
wired on 8/19 and it is the last line of the splash handler; the line before it
builds the 3.7 MB city iframe.

*** AND THE MAIN THREAD IS BLOCKED FOR THAT WHOLE WINDOW, WHICH BROKE THE FIRST
INSTRUMENT I POINTED AT IT. *** The energy meter samples on a 100ms
setInterval, and across the nine-second gap it recorded ZERO SAMPLES -- not
zero energy, zero samples. A main-thread meter cannot measure the one window
this feature exists for, so a gate that only watched the meter would report
"still silent" on a build where the pulse was playing perfectly. That is the
same class of mistake as every other broken ruler in this repo, and it is why
the claims below are split the way they are:

  * that it STARTS before the build begins            -- from the audio clock
  * that it MAKES SOUND, at 120, at the right level   -- metered, thread free
  * that it SURVIVES a blocked main thread            -- block it on purpose
  * that the song's first note LANDS ON A BEAT        -- to the millisecond
  * that it is QUIETER than a footstep                -- metered, side by side
  * that it ENDS at the song and does not come back   -- state, after

    python3 gates/beat_first_gate.py
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
  await p.waitForTimeout(1400);

  out.api = await p.evaluate(()=>({
    start: typeof window.__pulseStart==='function',
    next:  typeof window.__pulseNextBeat==='function',
    hand:  typeof window.__pulseHandOff==='function',
    state: typeof window.__pulseState==='function'
  }));
  if(!out.api.state){ console.log(JSON.stringify(out)); await b.close(); return; }

  /* SPY ON THE HANDOFF, AND PUT IT BACK. Its argument IS the audio time the
     song booked its step 0 for, which is the only way to ask "did the first
     note land on a beat" without guessing. */
  await p.evaluate(()=>{
    window.__HAND=[]; const real=window.__pulseHandOff;
    window.__pulseHandOff=function(t){ window.__HAND.push(t); return real.apply(this,arguments); };
    window.__handReal=real;
  });

  /* ---- THE TAP. Everything in that handler after the pulse builds the city. */
  await p.click('#front',{force:true}).catch(()=>{});
  out.rightAfterTap = await p.evaluate(()=>{
    const s=window.__pulseState();
    return {on:s.on, done:s.done, bpm:s.bpm, sec:s.sec, gap:s.gap, level:s.level,
            startedAt:s.startedAt,
            acNow:(typeof MUS!=='undefined'&&MUS.AC)?MUS.AC.currentTime:null,
            musPlaying:(typeof MUS!=='undefined')?!!MUS.playing:null};
  });

  /* ---- WAIT FOR THE HANDOFF, NOT FOR A DURATION. *** A FIXED WAIT IS NOT AN
     EVENT, AND THIS LINE ROTTED EXACTLY THAT WAY. *** It was `waitForTimeout
     (9000)`, chosen when the city build took about nine seconds. Other lanes
     kept adding to the city; the build now takes over ten, the pulse covers
     TWENTY beats instead of thirteen, and this gate walked up and looked at the
     handoff before it had happened. It reported "0.0 seconds of beat" and "the
     song never handed over" ON A BUILD WHERE THE PULSE RAN PERFECTLY -- proved
     by probing plain origin/main, where the handoff lands at exactly 20.0
     beats. The gate was measuring its own patience. Now it waits for the thing. */
  for(let i=0;i<60;i++){
    const got=await p.evaluate(()=>(window.__HAND||[]).length>0);
    if(got) break;
    await p.waitForTimeout(500);
  }
  await p.waitForTimeout(1200);   /* let the song settle after it takes the beat */
  out.afterBuild = await p.evaluate(()=>{
    const s=window.__pulseState();
    return {on:s.on, done:s.done, hand:(window.__HAND||[]).slice(),
            musPlaying:(typeof MUS!=='undefined')?!!MUS.playing:null,
            step:(typeof MUS!=='undefined')?MUS.step:null};
  });

  /* ---- DID THE SONG LAND ON A BEAT? The handoff time against the pulse grid. */
  out.landing = await p.evaluate(()=>{
    const s=window.__pulseState(), h=(window.__HAND||[]);
    if(!h.length||!s.startedAt) return null;
    const t=h[0], k=(t-s.startedAt)/s.sec;
    const off=Math.abs(k-Math.round(k))*s.sec*1000;   /* ms off the beat */
    return {bookedAt:t, startedAt:s.startedAt, beats:k, offMs:off};
  });

  /* ---- A CLEAN ROOM. Stop everything the game is playing, then start the
     pulse again by hand and measure it ALONE. Measuring it under the opening
     song would be measuring the song. */
  await p.evaluate(()=>{
    try{ if(window.MENUMUS) MENUMUS.stop(); }catch(e){}
    try{ if(window.CITYMUS) CITYMUS.stopShuffle(); }catch(e){}
    try{ if(window.__AMB) window.__AMB.tick=function(){}; }catch(e){}
  });
  await p.waitForTimeout(900);
  out.meter = await p.evaluate(async()=>{
    const wait=ms=>new Promise(z=>setTimeout(z,ms));
    if(typeof MUS==='undefined'||!MUS.AC) return null;
    const AC=MUS.AC, dst=MUS.OUT||MUS.MAST||AC.destination;
    /* THE WINDOW HAS TO COVER THE STEP, OR THE METER HAS BLIND GAPS (9/13).
       fftSize 1024 is 23ms of history at 44.1kHz, and this loop's setTimeout(12)
       really lands nearer 50ms on a page that is also running a game -- so
       consecutive reads left a hole of about 30ms, and a thump of about 40ms
       could fall entirely inside one. That is why this gate has been flaky on
       EVERY tree since it shipped: measured 9/13 over ten runs, five a tree, it
       went red 1 of 5 on plain main and 2 of 5 on a branch with the SAME pulse,
       while the claim that actually matters -- the song's first note landing on
       the grid -- read 0.00ms off in 10 of 10.
       A SAMPLER WHOSE WINDOW IS SHORTER THAN ITS OWN STEP DETECTS BY LUCK.
       2048 is 46ms of history, which covers the real step, and 46ms of smear is
       nothing against the 312ms lub-to-dub it has to tell apart. Both analysers
       in this gate get it: the stall meter can lose a thump the same way. */
    const an=AC.createAnalyser(); an.fftSize=2048; dst.connect(an);
    const buf=new Float32Array(an.fftSize);
    const read=()=>{ an.getFloatTimeDomainData(buf); let m=0;
      for(let i=0;i<buf.length;i++) if(Math.abs(buf[i])>m) m=Math.abs(buf[i]);
      return m; };

    /* the baseline: nothing at all should be running now */
    let base=0; for(let i=0;i<14;i++){ base=Math.max(base,read()); await wait(30); }

    /* PUT THE PULSE BACK. It is a one-shot in the game (the opening is one
       moment), so the measurement re-arms it deliberately rather than
       pretending the game would. */
    const s0=window.__pulseState();
    window.__PULSE_RESET && window.__PULSE_RESET();
    const trace=[];
    window.__pulseStart();
    const t0=AC.currentTime;
    for(let i=0;i<130;i++){ trace.push([+(AC.currentTime-t0).toFixed(3), +read().toFixed(5)]); await wait(12); }
    const st=window.__pulseState();

    /* peaks: a group of samples over the floor, separated by quiet.
       THE FLOOR IS RELATIVE, and the first cut's was not. A fixed 0.004 was
       fine when the pulse peaked at 0.068 and blind when the level came down
       to sit under a footstep: it started missing thumps and reported
       lub-to-lub gaps of 1.01 seconds, which is a dropped beat, not a slow
       one. A DETECTOR WITH A FIXED THRESHOLD MEASURES ITS THRESHOLD. */
    const CEIL=Math.max(0,...trace.map(r=>r[1]));
    const FLOOR=Math.max(0.0008, CEIL*0.18);
    const peaks=[]; let inHit=false, bestT=0, best=0;
    for(const [t,v] of trace){
      if(v>FLOOR){ if(!inHit){inHit=true;best=0;} if(v>best){best=v;bestT=t;} }
      else if(inHit){ inHit=false; peaks.push([bestT,best]); }
    }
    if(inHit) peaks.push([bestT,best]);
    const loud=peaks.filter(p=>p[1]>FLOOR*2);
    const pulsePeak=Math.max(0,...trace.map(r=>r[1]));
    /* A HEART HAS TWO THUMPS, AND THE FIRST CUT OF THIS FORGOT THAT. Measuring
       every peak gave gaps of 0.29 / 0.19 / 0.52 and the check called that a
       broken tempo -- it is lub, dub, lub, which is the thing being built. The
       BEAT is the lub, so the loud half is what the tempo is read off. */
    const top=Math.max(0,...loud.map(x=>x[1]));
    const lubs=loud.filter(x=>x[1]>top*0.6);
    const gaps=[]; for(let i=1;i<lubs.length;i++) gaps.push(+(lubs[i][0]-lubs[i-1][0]).toFixed(3));
    const allGaps=[]; for(let i=1;i<loud.length;i++) allGaps.push(+(loud[i][0]-loud[i-1][0]).toFixed(3));
    /* AND THE SAMPLER'S OWN RESOLUTION, REPORTED RATHER THAN ASSUMED. Nothing is
       asserted against it -- on a loaded machine that would red for everybody and
       say nothing about the beat -- but the next reader of a flaky run needs to
       see whether the meter could even see what it was counting. */
    const dts=[]; for(let i=1;i<trace.length;i++) dts.push(trace[i][0]-trace[i-1][0]);
    dts.sort((x,y)=>x-y);
    const sampleDt=dts.length?+dts[dts.length>>1].toFixed(4):null;
    const windowSec=+(an.fftSize/AC.sampleRate).toFixed(4);

    /* AND A FOOTSTEP, SIDE BY SIDE, SAME METER, SAME BUS. "Quiet" is not an
       adjective here: it is this number against that one. */
    window.__pulseHandOff(null);
    await wait(400);
    let stepPeak=0;
    for(let k=0;k<3;k++){
      try{ window.playSFX('step_asphalt'); }catch(e){}
      for(let i=0;i<40;i++){ stepPeak=Math.max(stepPeak,read()); await wait(12); }
    }
    return {base:+base.toFixed(5), pulsePeak:+pulsePeak.toFixed(5),
            stepPeak:+stepPeak.toFixed(5), peaks:loud.length, lubs:lubs.length,
            gaps:gaps, allGaps:allGaps, stateWhileOn:st.on, level:s0.level,
            sampleDt:sampleDt, windowSec:windowSec,
            traceSpan:trace.length?+(trace[trace.length-1][0]-trace[0][0]).toFixed(2):null};
  });

  /* ---- IT SURVIVES A BLOCKED MAIN THREAD, which is the whole reason it is a
     looping buffer and not a scheduler. Block hard, then read the analyser
     across one full beat and see whether the loop is still running. */
  out.stall = await p.evaluate(async()=>{
    const wait=ms=>new Promise(z=>setTimeout(z,ms));
    if(typeof MUS==='undefined'||!MUS.AC) return null;
    const AC=MUS.AC, dst=MUS.OUT||MUS.MAST||AC.destination;
    const an=AC.createAnalyser(); an.fftSize=2048; dst.connect(an);   /* 46ms of history: see the note on the meter's analyser above */
    const buf=new Float32Array(an.fftSize);
    const read=()=>{ an.getFloatTimeDomainData(buf); let m=0;
      for(let i=0;i<buf.length;i++) if(Math.abs(buf[i])>m) m=Math.abs(buf[i]);
      return m; };
    window.__PULSE_RESET && window.__PULSE_RESET();
    window.__pulseStart();
    await wait(700);
    /* THE STALL: a real busy loop, the same thing building the city does. */
    const t0=AC.currentTime, w0=Date.now();
    while(Date.now()-w0 < 3000){ Math.sqrt(Math.random()); }
    const blockedMs=Date.now()-w0, acMoved=AC.currentTime-t0;
    /* now read one whole beat and see whether anything is still coming out */
    let peak=0; for(let i=0;i<60;i++){ peak=Math.max(peak,read()); await wait(10); }
    const st=window.__pulseState();
    window.__pulseHandOff(null);
    return {blockedMs:blockedMs, acMoved:+acMoved.toFixed(3),
            peakAfter:+peak.toFixed(5), stillOn:st.on};
  });

  /* ---- AND IT IS OVER. The opening is one moment, not a metronome. */
  out.ended = await p.evaluate(()=>{
    window.__pulseStart();          /* ask for it again; it must refuse */
    const s=window.__pulseState();
    try{ window.__pulseHandOff=window.__handReal; }catch(e){}   /* spy put back */
    return {on:s.on, done:s.done, spyPutBack: window.__pulseHandOff===window.__handReal};
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

    print('=== BEAT FIRST GATE - a pulse before the song, and the song lands on it ===')

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

    api = d.get('api') or {}
    ok('the pulse is reachable at all (start/nextBeat/handOff/state)',
       all(api.get(k) for k in ('start', 'next', 'hand', 'state')))
    if not api.get('state'):
        print('  %d passed, %d FAILED' % (p, f))
        return 1

    # 1-3. IT IS ALREADY RUNNING WHEN THE TAP RETURNS. Everything after that
    #      line in the splash handler builds the city, and that build blocks the
    #      main thread for about nine seconds.
    tap = d.get('rightAfterTap') or {}
    # *** THIS CLAIM WAS MEASURED AT THE WRONG MOMENT FIRST, AND SAID SO. ***
    # It read the pulse state after p.click() returned and asserted it was
    # RUNNING. But the click does not return until the whole handler has run --
    # the city build and MENUMUS.open() with it -- so at that instant the song
    # has correctly taken the beat and the pulse is correctly finished. It was
    # asserting the opposite of the design on a build that worked.
    # WHAT ACTUALLY MATTERS IS THAT IT COVERED THE GAP, and the handoff time
    # answers that exactly: how many beats ran between the pulse starting and
    # the song booking its first note.
    lg = d.get('landing') or {}
    covered = (lg.get('beats') or 0) * 0.5
    ok('the pulse covered the silence: %.1f seconds of beat between the tap and '
       'the song\'s first note, across a city build that blocks the main thread '
       '(it was ten seconds of nothing)' % covered, covered >= 4.0)
    ok('and it was booked on the audio clock, not a timer (startedAt=%s, '
       'ac=%s)' % (tap.get('startedAt'), tap.get('acNow')),
       (tap.get('startedAt') or 0) > 0)
    ok('and it is 120 BPM by construction: a %ss loop, not a scheduler that a '
       'blocked thread can starve' % tap.get('sec'),
       tap.get('bpm') == 120 and abs((tap.get('sec') or 0) - 0.5) < 1e-9)
    ok('the two thumps are 0.3125s apart -- his own approved heartbeat recipe, '
       'hits:[0, 0.3125] (got %s)' % tap.get('gap'),
       abs((tap.get('gap') or 0) - 0.3125) < 1e-9)

    # 4-6. IT MAKES SOUND, IT IS ON THE BEAT, AND IT IS QUIET.
    m = d.get('meter') or {}
    # `(x or 1)` reads 0 as missing. The baseline being EXACTLY zero is the
    # best possible answer and the first cut of this line failed on it.
    _base = m.get('base')
    ok('the room was actually quiet before measuring (baseline %s) -- a meter '
       'that reads the opening song would call anything a pulse' % _base,
       _base is not None and _base < 0.004)
    ok('IT MAKES A SOUND: peak %s against a %s floor'
       % (m.get('pulsePeak'), m.get('base')), (m.get('pulsePeak') or 0) > 0.01)
    gaps = m.get('gaps') or []
    # *** A MISSED THUMP IS NOT A WRONG TEMPO, AND THIS CLAIM USED TO CONFUSE THE
    # TWO (9/13). It asked that 60% of consecutive lub-to-lub gaps sit within 60ms
    # of half a second, which a meter that misses one thump can never satisfy: the
    # gap becomes 1.0 or 1.5 and the tempo it was measuring is untouched. Measured
    # over ten runs, five a tree, on the SAME pulse: red 1 of 5 on plain main and
    # 2 of 5 on a branch, with gaps like [2, 0.47, 0.528] PASSING and
    # [1.481, 0.531, 1.489, 0.99, 0.51] FAILING. A coin flip was deciding every
    # lane's ship.
    # THE HONEST TEST IS THAT EVERY GAP IS A WHOLE NUMBER OF HALF-SECONDS: a
    # dropped thump lands on a multiple, a wrong rate does not. And the EXACT
    # tempo is not softened by this -- it is proven by the two construction claims
    # above (a 0.5s loop and a 0.3125s lub-to-dub, both to 1e-9) and by the first
    # note landing on the grid below. This meter's job is to prove the thing is
    # AUDIBLE and REGULAR, which is what it can honestly see. ***
    # *** AND THE TOLERANCE COMES OUT OF THE INSTRUMENT, NOT OUT OF MY HEAD.
    # A TOLERANCE TIGHTER THAN THE INSTRUMENT'S OWN RESOLUTION MEASURES THE
    # INSTRUMENT -- the same family as the fixed-threshold lesson two notes up.
    # With the blind gap closed, the one red left in ten runs was a gap of 0.560,
    # sixty milliseconds off half a second, judged against a FIXED sixty. But a
    # peak's timestamp is only good to the window that saw it (46ms) plus the step
    # between samples (21-41ms, measured and printed): the error bar and the
    # tolerance were the same size, so the claim was a coin flip on its own noise.
    # Derived instead, and it still has teeth: the mutation that renders the pulse
    # at 0.65s while declaring 0.5 sits 121-151ms off the multiples, well outside.
    tol = max(0.06, (m.get('sampleDt') or 0.04) + (m.get('windowSec') or 0.046))
    off = [g for g in gaps if g < 0.40 or abs(g - round(g / 0.5) * 0.5) > tol]
    ok('and the beat comes once every half second, which is 120: %d thumps, %d of '
       'them the loud one, lub-to-lub %s, and EVERY gap is a whole number of half '
       'seconds within %dms (%d off: %s). A missed thump makes a 1.0 or 1.5 gap and '
       'leaves the tempo alone; a wrong rate does not land on the multiples. '
       'Sampled every %sms through a %ss window across %ss, and THE TOLERANCE IS '
       'THAT SUM rather than a number I picked (every thump: %s -- a heart has two)'
       % (m.get('peaks') or 0, m.get('lubs') or 0, gaps[:6], round(tol * 1000),
          len(off), off[:4], round((m.get('sampleDt') or 0) * 1000, 1),
          m.get('windowSec'), m.get('traceSpan'), (m.get('allGaps') or [])[:6]),
       len(gaps) >= 2 and not off)
    # AND IF THE MACHINE IS SO SLOW THAT THE TOLERANCE SWALLOWS A QUARTER BEAT, the
    # claim above has stopped meaning anything and this says SO rather than passing
    # vacuously. It accuses the machine, which is true, and never the beat.
    ok('the meter could resolve the beat at all on this machine: a %dms tolerance '
       'against a 500ms beat. Past 125ms the multiples stop being distinguishable '
       'and the claim above is vacuous -- that is a statement about the sampler, '
       'not about the pulse' % round(tol * 1000), tol < 0.125)
    ok('and it is QUIETER THAN A FOOTSTEP, which is the quietest thing in the '
       'game by his 8/1 ruling: pulse %s vs step %s'
       % (m.get('pulsePeak'), m.get('stepPeak')),
       (m.get('pulsePeak') or 1) < (m.get('stepPeak') or 0))

    # 7-8. THE SONG LANDS ON THE BEAT.
    land = d.get('landing') or {}
    ok('the song handed over through the pulse at all (booked step 0 at %s)'
       % land.get('bookedAt'), bool(land))
    if land:
        ok('AND ITS FIRST NOTE LANDED ON A BEAT: %.2f ms off the pulse grid '
           '(%.3f beats after the pulse started). Before this the song began '
           '0.06s after whenever the code happened to run.'
           % (land.get('offMs') or 0, land.get('beats') or 0),
           (land.get('offMs') if land.get('offMs') is not None else 999) < 5.0)

    # 9-11. IT SURVIVES A BLOCKED MAIN THREAD. This is the whole design.
    st = d.get('stall') or {}
    ok('the stall was real: the main thread was blocked %sms and the audio '
       'clock moved %ss through it' % (st.get('blockedMs'), st.get('acMoved')),
       (st.get('blockedMs') or 0) >= 2900 and (st.get('acMoved') or 0) >= 2.5)
    ok('AND THE PULSE WAS STILL PLAYING AFTER IT: peak %s across the beat '
       'following a three-second block. A setInterval beat would be gone -- '
       'the meter itself recorded ZERO samples across the real nine-second '
       'city build.' % st.get('peakAfter'), (st.get('peakAfter') or 0) > 0.01)
    ok('and it did not need the main thread to stay alive (still on: %s)'
       % st.get('stillOn'), st.get('stillOn') is True)

    # 12-13. THE OPENING IS ONE MOMENT.
    e = d.get('ended') or {}
    ok('once the song has it, the pulse is done and asking again does nothing '
       '-- the opening is a moment, not a metronome under the game (on=%s, '
       'done=%s)' % (e.get('on'), e.get('done')),
       e.get('on') is False and e.get('done') is True)
    ok('and the probe put the game back the way it found it', e.get('spyPutBack'))

    ok('nothing threw (%s)' % (d.get('errs') or 'clean'), not d.get('errs'))

    # A GATE THAT ONLY PRINTS ITS NUMBERS WHEN IT FAILS CANNOT BE COMPARED ACROSS
    # RUNS (9/13, SOUNDS). This one is LOAD-TIMING SENSITIVE -- its coverage claim
    # is really "when did the opening song book its first note", which moves with
    # how fast the 3.7 MB city iframe parses on the machine of the moment. On 9/6
    # this lane measured it red 1 of 3 on main and 2 of 3 on a branch with thumps
    # swinging 16/20/21/22 for the SAME build, and on 9/13 it went red once in
    # three with covered=3.0s while main went 3 of 3 green. Both times the only
    # way to tell flake from regression was to re-run it and compare numbers, and
    # the numbers were invisible on a pass. Now they always print, so the next
    # lane can line up runs instead of guessing.
    print('  MEASURED  covered %.1fs (needs 4.0), first note %.3f beats after the '
          'pulse and %.2fms off its grid, %s thumps of which %s loud, gaps %s, '
          'sampled every %sms through a %ss window'
          % (covered, (lg.get('beats') or 0), (lg.get('offMs') or 0),
             m.get('peaks'), m.get('lubs'), (m.get('gaps') or [])[:6],
             round((m.get('sampleDt') or 0) * 1000, 1), m.get('windowSec')))
    print('  %d passed, %d FAILED' % (p, f))
    if not f:
        print('  You tap it and it has a pulse, ten seconds before it has a song, '
              'and the song comes in on the beat.')
    return 1 if f else 0


if __name__ == '__main__':
    sys.exit(main())
