#!/usr/bin/env python3
"""
THE ROOM IS ON BEFORE THE SONG GATE (9/21/26, SOUNDS lane) - [first sound].

THE ROW'S SHIP TEST, IN ITS OWN WORDS: "sound within one beat of the tap on a 4x
phone profile", covering the measured gap to the first song, and "a room hum under
the bible, not a jingle".

*** WHY THIS GATE DOES NOT WATCH AND WAIT, WHICH IS WHAT I TRIED FIRST AND THREW
AWAY. Three separate polling instruments were built this round and all three were
wrong, and the third was wrong in the way that matters here: on a 4x profile each
round trip into the page costs about two seconds, so ninety samples spanned a
hundred and ninety-eight seconds and THE FIRST SAMPLE LANDED EIGHTY SECONDS AFTER
THE TAP. It reported "first sound 84 s after the tap". That was not the game. That
was my own observation latency with a timestamp on it. The build's own comment
says the same thing about main-thread meters: across the city build they record NO
SAMPLES AT ALL.
SO NOTHING IS OBSERVED HERE. The audio thread's clock is asked what it SCHEDULED,
which is a fact that exists whether or not the main thread is alive to see it. A
buffer booked to start at context-time 0.02 will be heard at 0.02 even if the main
thread is blocked for nine seconds afterwards, and that is the entire reason this
sound is a looping buffer and not a scheduler. ***

AND THE TAP IS CONTEXT-TIME ZERO, WHICH IS NOT A CONVENIENCE, IT IS A MEASUREMENT
FROM LAST ROUND: there are ZERO AudioContexts in existence before the door is
tapped, not even a suspended one, because a browser will not start audio without a
gesture. The context is created BY the tap. So "within one beat of the tap" is
exactly "startedAt <= one beat of context time", with no wall clock in it at all.

WHAT THIS GATE REFUSES TO ACCEPT AS EVIDENCE:
  * A GREP. Nothing reads the alpha as text.
  * A FUNCTION THAT WAS CALLED. Every sound claim is measured off a rendered
    buffer, through the room's own two filters, in an OfflineAudioContext.
  * A LEVEL CLAIM WITH NOTHING TO COMPARE IT TO. "Under the heartbeat" is
    measured on BOTH buffers through the same ruler in the same breath, and on
    rms, because a thump and a bed cannot be compared on peak.
  * A SEAM CLAIM WITH AN INVENTED TOLERANCE. This lane has now set five
    thresholds that measured the box instead of the game, so the loop seam is a
    PAIRED reading: the step across the seam against the typical step inside the
    same buffer. No absolute number.
  * A PASS THAT WOULD ALSO PASS WITH THE ROOM REMOVED. --mutate deletes the start
    call at runtime and the scheduling claim must go red.
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
const REPO = process.argv[2];
const MUTATE = process.argv[3] === '--mutate';
const CPU = 4;

(async () => {
  const { chromium } = pw;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport:{width:390,height:844}, hasTouch:true, isMobile:true });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const cdp = await p.context().newCDPSession(p);
  const out = { mutated: MUTATE };
  try {
    /* THE THROTTLE IS PROVED REAL INSIDE THE RUN, WITH A WARMED LOOP. An earlier
       version of this yardstick ran the loop once cold and once warm and reported
       0.51x with no throttle applied: it was timing the JIT, not the CPU. */
    await p.goto('about:blank');
    const yard = async () => { let last=0; for(let i=0;i<4;i++) last=(await p.evaluate(()=>{
      const t=performance.now(); let x=0; for(let j=0;j<3e6;j++) x+=j%7; return { ms:+(performance.now()-t).toFixed(1), x:x&1 }; })).ms; return last; };
    const y1 = await yard();
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU });
    const y2 = await yard();
    out.throttle = { off:y1, on:y2, ratio:+(y2/y1).toFixed(2), asked:CPU };

    /* THE MUTATION GOES IN BEFORE THE DOOR, NOT AFTER THE READING. This lane
       shipped a control once that ran AFTER the reading it was meant to falsify,
       and it controlled nothing. */
    if (MUTATE) await p.addInitScript(() => {
      Object.defineProperty(window, '__roomStart', { get(){ return undefined; }, configurable:false });
    });

    await p.goto('file://' + path.join(REPO, 'slices', 'BOHEMIA_ALPHA_0_9.html'));

    /* WAIT FOR A DOOR THAT IS REALLY THERE, AND PROVE IT OPENED. My second cut
       tapped at 2.5 s on a throttled box before the door was wired, so "the tap"
       was not a tap and every number after it was about nothing. */
    let vis = false;
    for (let i=0;i<120;i++){
      vis = await p.evaluate(() => { const f=document.getElementById('front');
        return !!f && getComputedStyle(f).display !== 'none'; });
      if (vis) break;
      await p.waitForTimeout(250);
    }
    out.doorVisible = vis;
    out.contextsBeforeTap = await p.evaluate(() => {
      try { return (typeof MUS !== 'undefined' && MUS.AC) ? 1 : 0; } catch(e){ return 'threw'; } });
    await p.click('#front', { force:true }).catch(e => { out.clickErr = String(e.message).slice(0,70); });
    out.doorClosed = await p.evaluate(() => { const f=document.getElementById('front');
      return !!f && getComputedStyle(f).display === 'none'; });

    /* ---- LEG A: WHAT THE AUDIO THREAD WAS TOLD, read once, no polling ------- */
    out.scheduled = await p.evaluate(() => {
      const r = {};
      try { r.hasRoomApi = typeof window.__roomState; } catch(e){ r.hasRoomApi = 'threw'; }
      try { const s = window.__roomState && window.__roomState(); if (s) {
        r.on = s.on; r.startedAt = s.startedAt; r.level = s.level;
        r.sec = s.sec; r.hum = s.hum; r.lo = s.lo; r.hi = s.hi;
        r.rel = s.rel; r.duckTo = s.duck; r.cycles60 = s.cycles60; r.beats = s.beats; } } catch(e){ r.stateErr = String(e&&e.message).slice(0,70); }
      /* the heartbeat's own accessor, for the record, and spelled the way the
         build spells it: __pulseState. I spent three instruments this round
         reading __pulseStats, which does not exist, and got a plausible false
         back every single time instead of an error. */
      try { const q = window.__pulseState && window.__pulseState(); if (q) r.pulseStartedAt = q.startedAt, r.pulseOn = q.on; } catch(e){}
      try { r.acNow = +MUS.AC.currentTime.toFixed(4); } catch(e){}
      return r;
    });

    /* ---- LEG B/C/E: THE SOUND ITSELF, rendered through its own machine ----- */
    out.sound = await p.evaluate(async () => {
      const SR = 44100;
      const probe = window.__ROOM_PROBE && window.__ROOM_PROBE(MUS.AC);
      if (!probe) return { fatal: 'no probe' };

      const rmsOf = (buf) => { const d = buf.getChannelData(0); let s=0;
        for (let i=0;i<d.length;i++) s += d[i]*d[i]; return Math.sqrt(s/d.length); };

      /* THE SEAM, PAIRED: the step across the loop point against the typical
         step inside the same buffer. No absolute tolerance anywhere. */
      const d = probe.roomBuf.getChannelData(0), n = d.length;
      const seamStep = Math.abs(d[0] - d[n-1]);
      const steps = []; for (let i=1;i<n;i+=97) steps.push(Math.abs(d[i]-d[i-1]));
      steps.sort((a,b)=>a-b);
      const typStep = steps[Math.floor(steps.length/2)];

      /* THE BAND, measured after the room's own two filters, offline. This is
         the claim that matters: the game has 0.02% of its energy above 5 kHz and
         this sound is supposed to be the half that lives up high. */
      const secs = Math.min(4, probe.sec);
      const OAC = new OfflineAudioContext(1, Math.ceil(SR*secs), SR);
      const src = OAC.createBufferSource(); src.buffer = probe.roomBuf; src.loop = true;
      const hp = OAC.createBiquadFilter(); hp.type='highpass'; hp.frequency.value = probe.lo; hp.Q.value=0.7;
      const lp = OAC.createBiquadFilter(); lp.type='lowpass';  lp.frequency.value = probe.hi; lp.Q.value=0.7;
      const g  = OAC.createGain(); g.gain.value = probe.roomLevel;
      src.connect(hp); hp.connect(lp); lp.connect(g); g.connect(OAC.destination);
      src.start(0);
      const rendered = await OAC.startRendering();
      const x = rendered.getChannelData(0);

      /* one real FFT over the loudest window, same maths as the school page */
      const N = 4096;
      const spec = (arr) => {
        const re = new Float64Array(N), im = new Float64Array(N);
        for (let i=0;i<N;i++){ const w = 0.5 - 0.5*Math.cos(2*Math.PI*i/(N-1)); re[i] = (arr[i]||0)*w; }
        for (let i=1,j=0;i<N;i++){ let bit=N>>1; for(;j&bit;bit>>=1) j^=bit; j^=bit;
          if(i<j){ let t=re[i];re[i]=re[j];re[j]=t; t=im[i];im[i]=im[j];im[j]=t; } }
        for (let len=2; len<=N; len<<=1){ const ang=-2*Math.PI/len, wr=Math.cos(ang), wi=Math.sin(ang);
          for (let i=0;i<N;i+=len){ let cr=1,ci=0;
            for (let k=0;k<len/2;k++){ const ur=re[i+k],ui=im[i+k];
              const vr=re[i+k+len/2]*cr-im[i+k+len/2]*ci, vi=re[i+k+len/2]*ci+im[i+k+len/2]*cr;
              re[i+k]=ur+vr; im[i+k]=ui+vi; re[i+k+len/2]=ur-vr; im[i+k+len/2]=ui-vi;
              const ncr=cr*wr-ci*wi; ci=cr*wi+ci*wr; cr=ncr; } } }
        const half=N>>1, pw=new Float64Array(half);
        for (let k=0;k<half;k++) pw[k]=re[k]*re[k]+im[k]*im[k];
        return pw;
      };
      const mid = Math.floor(x.length/2) - N;
      const pwr = spec(x.subarray(Math.max(0,mid), Math.max(0,mid)+N));
      const binHz = SR/N;
      let tot=0; for (let k=1;k<pwr.length;k++) tot += pwr[k];
      const share = (a,bb) => { let s=0; const ka=Math.max(1,Math.round(a/binHz)), kb=Math.min(pwr.length-1,Math.round(bb/binHz));
        for (let k=ka;k<=kb;k++) s+=pwr[k]; return tot>0 ? +(s/tot).toFixed(5) : null; };
      /* is 60 Hz really the hum: the strongest bin under 300 Hz */
      let lowPeakK = 1; const k300 = Math.round(300/binHz);
      for (let k=1;k<=k300;k++) if (pwr[k] > pwr[lowPeakK]) lowPeakK = k;

      let pk=0, sq=0, zeros=0;
      for (let i=0;i<x.length;i++){ const a=Math.abs(x[i]); if(a>pk)pk=a; sq+=x[i]*x[i]; if(x[i]===0) zeros++; }

      return {
        roomLevel: +probe.roomLevel.toFixed(6),
        roomBufRms: +rmsOf(probe.roomBuf).toFixed(5),
        pulseBufRms: +rmsOf(probe.pulseBuf).toFixed(5),
        pulseLevel: probe.pulseLevel,
        roomEnergy: +(rmsOf(probe.roomBuf)*probe.roomLevel).toFixed(7),
        pulseEnergy: +(rmsOf(probe.pulseBuf)*probe.pulseLevel).toFixed(7),
        relAsked: probe.rel,
        relMeasured: +((rmsOf(probe.roomBuf)*probe.roomLevel)/(rmsOf(probe.pulseBuf)*probe.pulseLevel)).toFixed(4),
        renderedPeak: +pk.toFixed(6), renderedRms: +Math.sqrt(sq/x.length).toFixed(6),
        exactZeroSamples: zeros, totalSamples: x.length,
        seamStep: +seamStep.toFixed(6), typicalStep: +typStep.toFixed(6),
        seamOverTypical: typStep > 0 ? +(seamStep/typStep).toFixed(2) : null,
        cycles60: probe.sec * probe.hum,
        lowPeakHz: Math.round(lowPeakK*binHz),
        binHz: +binHz.toFixed(2),
        /* the fundamental and the ballast harmonic, so "the low corner ate the
           fundamental" is a measured statement and not an excuse */
        powerAt60:  +(pwr[Math.round(60/binHz)]  / (tot||1)).toFixed(6),
        powerAt120: +(pwr[Math.round(120/binHz)] / (tot||1)).toFixed(6),
        shareAbove1k: share(1000, 22050), shareAbove4k: share(4000, 22050),
        shareAboveCorner: share(probe.hi, 22050), shareUnder320: share(20, 320)
      };
    });

    /* ---- LEG D: IT DUCKS AND IT NEVER REACHES ZERO ------------------------- */
    out.duck = await p.evaluate(() => {
      try {
        const before = window.__roomState().level;
        const st1 = window.__roomState();
        window.__roomDuck && window.__roomDuck(null);
        const st2 = window.__roomState();
        return { levelField: before, wasDucked: st1.ducked, isDucked: st2.ducked, duckTo: st2.duck,
                 duckedValueWouldBe: +(before * st2.duck).toFixed(7),
                 reachesZero: (before * st2.duck) === 0 };
      } catch(e){ return { threw: String(e && e.message).slice(0,80) }; }
    });

    out.pageErrors = errs.length; out.errs = errs.slice(0,3);
  } catch(e){ out.THREW = String(e && e.message); }
  console.log(JSON.stringify(out));
  await b.close();
})();
'''

ONE_BEAT = 0.5          # 120 BPM, the law. Not a number this gate chose.
SEAM_MAX_RATIO = 6.0    # paired, against the buffer's own typical step
REL_TOL = 0.08          # the ratio the tool states, allowed to land within 8%


def run(js, timeout, mutate=False):
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as fh:
        fh.write(js)
        f = fh.name
    args = ['node', f, ROOT] + (['--mutate'] if mutate else [])
    try:
        r = subprocess.run(args, capture_output=True, text=True, timeout=timeout)
    finally:
        os.unlink(f)
    line = [x for x in r.stdout.strip().split('\n') if x.startswith('{')]
    if not line:
        print('  > node produced nothing:\n' + (r.stderr or '')[-1200:])
        return None
    return json.loads(line[-1])


def main():
    print('=== FIRST SOUND: THE ROOM IS ON BEFORE THE SONG ===')
    ok = 0
    bad = []

    def claim(name, good, detail=''):
        nonlocal ok
        if good:
            ok += 1
            print('  ok   %s %s' % (name, detail))
        else:
            bad.append(name)
            print('  FAIL %s %s' % (name, detail))

    d = run(JS, 420)
    if not d or d.get('THREW'):
        print('FAIL: the run did not complete: %s' % (d or {}).get('THREW'))
        return 1

    th = d.get('throttle') or {}
    print('  throttle asked %sx, measured %sx (warmed yardstick)'
          % (th.get('asked'), th.get('ratio')))
    claim('THE THROTTLE IS REAL', (th.get('ratio') or 0) >= 2.0,
          'a phone claim on an unthrottled box is not a phone claim')

    claim('THE DOOR WAS REALLY THERE AND REALLY OPENED',
          bool(d.get('doorVisible')) and bool(d.get('doorClosed')),
          'visible %s, closed after the tap %s' % (d.get('doorVisible'), d.get('doorClosed')))

    # THE MEASUREMENT FROM LAST ROUND, RE-CONFIRMED: no audio before the gesture.
    claim('THE TAP IS CONTEXT-TIME ZERO', d.get('contextsBeforeTap') == 0,
          'audio objects in existence before the door: %s (a browser will not start '
          'audio without a gesture, so context time 0 IS the tap)' % d.get('contextsBeforeTap'))

    s = d.get('scheduled') or {}
    claim('THE ROOM REPORTS FOR ITSELF', s.get('hasRoomApi') == 'function',
          '(read as __roomState, the way the build spells __pulseState)')
    claim('THE ROOM IS RUNNING AFTER THE TAP', s.get('on') is True, '')

    st = s.get('startedAt')
    claim('SOUND WITHIN ONE BEAT OF THE TAP',
          isinstance(st, (int, float)) and 0 <= st <= ONE_BEAT,
          'booked to start at context time %ss, one beat is %ss (THE ROW\'S SHIP TEST)'
          % (st, ONE_BEAT))

    snd = d.get('sound') or {}
    if snd.get('fatal'):
        print('FAIL: %s' % snd['fatal'])
        return 1

    claim('IT MAKES A SOUND AT ALL', (snd.get('renderedPeak') or 0) > 0,
          'rendered through its own two filters: peak %s, rms %s'
          % (snd.get('renderedPeak'), snd.get('renderedRms')))

    # RULE 3: the half the game has none of.
    claim('THERE IS ENERGY UP HIGH', (snd.get('shareAbove1k') or 0) > 0.02,
          '%.1f%% above 1 kHz and %.1f%% above 4 kHz, against 0.02%% above 5 kHz '
          'for the whole shipped mix'
          % (100*(snd.get('shareAbove1k') or 0), 100*(snd.get('shareAbove4k') or 0)))

    # RULE 4: the machine is declared AND the corner is real.
    claim('THE BAND STOPS WHERE THE MACHINE STOPS',
          (snd.get('shareAboveCorner') or 1) < (snd.get('shareAbove1k') or 0),
          'above the declared %s Hz corner: %.2f%%, an AM broadcast is about '
          '100 Hz to 5 kHz' % (s.get('hi'), 100*(snd.get('shareAboveCorner') or 0)))

    # RULE 2: the hum is the grid's pitch, measured not asserted.
    # *** THIS CLAIM WAS WRONG THE FIRST TIME AND THE SOUND WAS RIGHT. It asked for
    # the strongest low bin to be 60 Hz and measured 118 Hz, and the cause is that
    # two of the school page's own rules pull against each other: rule 4 declares
    # an AM band with a 100 Hz low corner, and a 100 Hz highpass takes about 10 dB
    # off a 60 Hz fundamental. A hum heard THROUGH A TRANSMITTER loses its
    # fundamental. AND THE ANSWER WAS ALREADY IN RULE 2's OWN PARAGRAPH: a
    # fluorescent ballast hums at 120 Hz, twice mains, because the magnetic force
    # peaks twice per cycle. 118 Hz is one bin off 120. So this now tests what
    # rule 2 ACTUALLY says -- "60 Hz or an integer multiple of it" -- instead of
    # the narrower thing I typed, and the multiple is printed so it cannot hide.
    hum = s.get('hum') or 60
    low = snd.get('lowPeakHz') or 0
    mult = low / hum if hum else 0
    near = abs(mult - round(mult)) * hum
    claim('THE HUM IS THE GRID\'S PITCH OR A HARMONIC OF IT',
          low > 0 and round(mult) >= 1 and near <= (snd.get('binHz') or 11) * 1.5,
          'strongest bin under 300 Hz is %s Hz = %sx mains (%s Hz), off the exact '
          'harmonic by %.1f Hz against a %.1f Hz bin. The fundamental is down '
          'because the declared 100 Hz corner takes it, which is what a hum heard '
          'through a transmitter does, and 2x mains is the ballast\'s own pitch.'
          % (low, round(mult), hum, near, snd.get('binHz') or 0))
    claim('AND THE MISSING FUNDAMENTAL IS EXPLAINED, NOT IGNORED',
          (snd.get('powerAt60') is not None and snd.get('powerAt120') is not None
           and snd.get('powerAt60') < snd.get('powerAt120')),
          '60 Hz sits at %s and 120 Hz at %s, so the low corner really is doing '
          'what it claims' % (snd.get('powerAt60'), snd.get('powerAt120')))

    # RULE 1: never digital zero.
    claim('IT NEVER READS DIGITAL ZERO', (snd.get('exactZeroSamples') or 0) == 0,
          '%s exact zeros in %s samples' % (snd.get('exactZeroSamples'), snd.get('totalSamples')))

    # THE LEVEL, PAIRED, ON RMS, AGAINST HIS OWN APPROVED HEARTBEAT.
    rel_m, rel_a = snd.get('relMeasured'), snd.get('relAsked')
    claim('IT SITS UNDER THE HEARTBEAT AT THE STATED RATIO',
          rel_m is not None and rel_a is not None and abs(rel_m - rel_a) <= REL_TOL,
          'room energy %s against heartbeat %s = %sx, stated %sx (matched on rms, '
          'never on peak: a thump and a bed cannot be compared on peak)'
          % (snd.get('roomEnergy'), snd.get('pulseEnergy'), rel_m, rel_a))
    claim('AND IT IS GENUINELY QUIETER', (rel_m or 9) < 1.0,
          'the heartbeat stays the thing you notice')

    # THE SEAM, PAIRED. No absolute tolerance: five of this lane's own thresholds
    # measured the box instead of the game, so there is not a sixth in here.
    claim('THE LOOP SEAM DOES NOT TICK',
          (snd.get('seamOverTypical') or 99) <= SEAM_MAX_RATIO,
          'the step across the seam is %sx the buffer\'s own typical step '
          '(paired, no absolute number)' % snd.get('seamOverTypical'))
    claim('THE HUM CROSSES THE SEAM IN PHASE BY ARITHMETIC',
          float(snd.get('cycles60') or 0).is_integer(),
          '%s cycles of 60 Hz in the loop, so it is whole by construction'
          % snd.get('cycles60'))

    dk = d.get('duck') or {}
    claim('THE SONG MAKES IT QUIETER, NOT SILENT',
          dk.get('isDucked') is True and dk.get('reachesZero') is False,
          'ducks to %s of itself, landing at %s, and no path reaches zero '
          '(school rule 1 and rule 7)' % (dk.get('duckTo'), dk.get('duckedValueWouldBe')))

    claim('NO PAGE ERRORS', (d.get('pageErrors') or 0) == 0, str(d.get('errs') or ''))

    # ---- THE CONTROL, AND IT RUNS AFTER NOTHING IT IS MEANT TO FALSIFY -------
    print('  -- the control: the room\'s start is removed at runtime --')
    m = run(JS, 420, mutate=True)
    if not m:
        claim('THE CONTROL RAN', False, 'the mutated run produced nothing')
    else:
        ms = m.get('scheduled') or {}
        claim('WITHOUT THE ROOM, THE CLAIM GOES RED', ms.get('on') is not True,
              'mutated run reports running=%s (if this stayed true the gate would '
              'be proving nothing)' % ms.get('on'))

    total = ok + len(bad)
    print('  %d/%d' % (ok, len(bad)))
    if bad:
        print('RED: ' + '; '.join(bad))
        return 1
    print('GREEN: a room hum is booked onto the audio thread within one beat of the '
          'tap, it has energy where a phone has a speaker, it sits under his '
          'heartbeat, and it never goes to zero.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
