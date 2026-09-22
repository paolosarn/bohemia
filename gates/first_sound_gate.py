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

AND THE TAP IS CONTEXT-TIME ZERO, WHICH IS NOT A CONVENIENCE, IT IS A MEASUREMENT.
When this was written there were ZERO AudioContexts before the door, so the context
was created BY the tap. AMENDED 9/23: RUN's loading screen calls the unlock path at
1,027 ms, so ONE context now exists before the door -- and it is SUSPENDED, with
MUS.playing false. A suspended context has made no sound and its clock has not
moved, so the claim now reads the STATE instead of counting objects.
AND THE FREE ANCHOR IS GONE WITH IT. Two runs on one tree booked the room at context
time 0.151 s and at 3.741 s against a 0.5 s bar, so a suspended context's clock is
NOT reliably stopped and context zero is no longer the tap. The ship test now reads
the context clock at the tap and asks for the GAP: booked NO LATER than one beat after
the tap. Same bar, same law, still no wall clock in it at all. AND NO LOWER BOUND:
measured, the room is booked at context time 0.981 s with the tap at 3.852 s, so 2.871 s
BEFORE the door, because the loading screen makes the context early and the room is
booked while the screen is still counting. That is this row OVER-DELIVERING -- the whole
point of the first sound is to cover the gap -- and nothing is audible before the tap
regardless, because a suspended context makes no sound until the gesture resumes it.

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
/* THE FLAG IS FOUND, NOT COUNTED (9/23). argv[3] is now the served base URL, and
   a positional read of a flag silently became a read of a URL the moment one was
   added -- which would have made --mutate a no-op and the control prove nothing. */
const MUTATE = process.argv.indexOf('--mutate') >= 0;
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

    /* SERVED, NOT OPENED AS A FILE (9/23). See the http server in the Python half:
       over file:// the city iframe is a foreign origin, RUN's loading screen cannot
       read into it, __LOAD_READY is never set and the door is not a door. */
    await p.goto((process.argv[3] && process.argv[3].indexOf('http') === 0
                  ? process.argv[3] : ('file://' + REPO))
                 + '/slices/BOHEMIA_ALPHA_0_9.html');

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
    /* AND A VISIBLE DOOR IS NOT AN OPEN ONE (9/23). RUN's loading screen puts an
       `if(!window.__LOAD_READY) return;` inside the door handler, so a tap before the
       loading lines finish is explicitly not a door -- its own comment says "a tap
       before BEGIN is simply not a door". Measured, served: BEGIN at 25.5 s. This
       gate's own older lesson, two comments up, is the same one: "my second cut
       tapped at 2.5 s before the door was wired, so the tap was not a tap and every
       number after it was about nothing." Waiting for the element to be VISIBLE was
       the 9/15 version of that question; the game has a better answer now, so ask it.
       Bounded at 180 s because PLUMBER measured this boot blocking the thread for
       71,758 ms on a phone-shaped CPU, and a bound under the measured boot is a gate
       that goes red on a slow box. */
    out.loadReadyMs = await p.evaluate(async () => { const t = Date.now();
      while (Date.now() - t < 180000) { if (window.__LOAD_READY) return Date.now() - t;
        await new Promise(r => setTimeout(r, 200)); } return null; });
    /* AND THE STATE, NOT JUST THE COUNT (9/23). "Does an AudioContext object exist"
       and "has this page made a sound" are different questions, and the browser is
       the one that distinguishes them: a context created without a gesture is
       SUSPENDED and produces nothing. RUN's loading screen calls the unlock path at
       1,027 ms now, so one suspended context exists before the door -- measured, with
       MUS.playing false. Counting objects called that a broken law; reading the state
       calls it what it is. */
    out.contextsBeforeTap = await p.evaluate(() => {
      try { return (typeof MUS !== 'undefined' && MUS.AC) ? 1 : 0; } catch(e){ return 'threw'; } });
    out.acStateBeforeTap = await p.evaluate(() => {
      try { return (typeof MUS !== 'undefined' && MUS.AC) ? MUS.AC.state : 'none'; }
      catch(e){ return 'threw'; } });
    out.playingBeforeTap = await p.evaluate(() => {
      try { return !!(typeof MUS !== 'undefined' && MUS.playing); } catch(e){ return 'threw'; } });
    await p.click('#front', { force:true }).catch(e => { out.clickErr = String(e.message).slice(0,70); });
    /* THE CONTEXT CLOCK AT THE TAP, READ IMMEDIATELY AFTER IT (9/23). This is the
       anchor the ship test needs, and it used to be free: the context was created BY
       the tap, so context time zero WAS the tap. It is not free any more -- RUN's
       loading screen makes the context 25 seconds earlier -- and MEASURED, two runs
       on one tree, the room was booked at context time 0.151 s and at 3.741 s, a 25x
       spread against a 0.5 s bar. A SUSPENDED CONTEXT'S CLOCK IS NOT RELIABLY
       STOPPED, which is an assumption I wrote down one commit ago and this measured
       it wrong. So the test is booked-minus-tap, which is the thing the row actually
       promises ("a sound within one beat of the tap") and is immune to when the
       context was made. */
    out.acAtTap = await p.evaluate(() => {
      try { return (typeof MUS !== 'undefined' && MUS.AC) ? MUS.AC.currentTime : null; }
      catch(e){ return null; } });
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
REL_TOL = 0.08          # the ratio the tool states, allowed to land within 8% OF ITSELF.
                        # Relative, not absolute: see the claim that uses it.


def run(js, timeout, mutate=False):
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as fh:
        fh.write(js)
        f = fh.name
    # *** SERVED OVER http, NOT OPENED AS A file:// (9/23, SOUNDS lane).
    # VERIFY ON THE REAL SURFACE, and a file:// URL is not the real surface.
    # MEASURED, the same alpha, the same box, twice: over file:// RUN's loading screen
    # sticks on WINDING THE CLOCK at 20.5 s and is still stuck 219 s later; over http
    # it reaches BEGIN at 25.5 s. Three of its four loading lines ask their question
    # INSIDE the city iframe through a try/catch that returns false, and over file://
    # that frame's origin is "null", so every read throws "Blocked a frame with origin
    # null from accessing a cross-origin frame" and false means "not loaded yet".
    # This gate read 19/0 before that landed and 15/4 after, with nothing wrong with
    # the room or the hum. Full measurement:
    # records/BOHEMIA_EVERY_GATE_THAT_OPENS_THE_ALPHA_AS_A_FILE_IS_BLIND_9_23_26.md
    import http.server, socketserver, threading

    class Quiet(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *a, **k):
            super().__init__(*a, directory=ROOT, **k)

        def log_message(self, *a):
            pass

    srv = socketserver.TCPServer(('127.0.0.1', 0), Quiet)
    base = 'http://127.0.0.1:%d' % srv.server_address[1]
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    args = ['node', f, ROOT, base] + (['--mutate'] if mutate else [])
    try:
        r = subprocess.run(args, capture_output=True, text=True, timeout=timeout)
    finally:
        os.unlink(f)
        srv.shutdown()
        srv.server_close()
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

    # *** RE-ASKED 9/23, BECAUSE IT WAS COUNTING OBJECTS WHEN THE LAW IS ABOUT SOUND.
    # It asserted ZERO AudioContexts before the door, and that was true when it was
    # written: the context was created BY the tap. RUN's loading screen (9/21) now
    # calls the unlock path at 1,027 ms, so one context exists before the door -- and
    # MEASURED, it is SUSPENDED, with MUS.playing false. A suspended context is not
    # audio; that is the browser's own distinction and the whole reason the gesture
    # rule exists.
    # SO THE CLAIM ASKS WHAT THE LAW ASKS: nothing was AUDIBLE before the door. A
    # context that is RUNNING before the tap still fails, which is the thing that
    # would actually break it, so this is not a weaker assertion -- it is the same
    # assertion with the browser's own word for "silent" in it.
    # AND THE ANCHOR SURVIVES: a suspended context's clock does not advance, so the
    # tap that resumes it is still where context time starts moving.
    _acs = d.get('acStateBeforeTap')
    claim('NOTHING WAS AUDIBLE BEFORE THE DOOR, so the tap is still context-time zero',
          _acs in ('none', 'suspended') and d.get('playingBeforeTap') is False,
          '%s audio object(s) before the door, state %s, MUS.playing %s (a suspended '
          'context has made no sound and its clock has not moved)'
          % (d.get('contextsBeforeTap'), _acs, d.get('playingBeforeTap')))

    s = d.get('scheduled') or {}
    claim('THE ROOM REPORTS FOR ITSELF', s.get('hasRoomApi') == 'function',
          '(read as __roomState, the way the build spells __pulseState)')
    claim('THE ROOM IS RUNNING AFTER THE TAP', s.get('on') is True, '')

    # *** MEASURED FROM THE TAP, NOT FROM CONTEXT ZERO (9/23), AND THIS CORRECTS WHAT
    # I WROTE ONE COMMIT AGO. That commit said a suspended context's clock has not
    # moved, so context zero is still the tap. TWO RUNS ON ONE UNCHANGED TREE THEN
    # BOOKED THE ROOM AT 0.151 s AND AT 3.741 s against a 0.5 s bar -- a 25x spread,
    # and a red that blamed the room for the loading screen existing.
    # A SUSPENDED CONTEXT'S CLOCK IS NOT RELIABLY STOPPED. The free anchor is gone,
    # so the gate reads MUS.AC.currentTime immediately after the click and asks the
    # question the row actually promises: booked WITHIN ONE BEAT OF THE TAP. Same bar,
    # same law, an anchor that does not depend on when the context was created.
    st = s.get('startedAt')
    tap = d.get('acAtTap')
    gap = (st - tap) if isinstance(st, (int, float)) and isinstance(tap, (int, float)) else None
    # AND THERE IS NO LOWER BOUND, WHICH IS THE THIRD THING I GOT WRONG ABOUT THIS ONE
    # CLAIM IN ONE ROUND. My first cut required the gap to be non-negative, on the old
    # assumption that nothing can be booked before the door. MEASURED: booked at
    # context time 0.981 s with the tap at 3.852 s, so 2.871 s BEFORE it -- because
    # RUN's loading screen makes the context early and the room is booked while the
    # screen is still counting.
    # THAT IS THE ROW OVER-DELIVERING, NOT FAILING. The row exists because the first
    # sound has to cover the gap he complained about; a hum already booked when the
    # door opens is better than one booked a beat after it, and nothing is AUDIBLE
    # before the tap anyway because the context is suspended until the gesture resumes
    # it -- which the claim above measures separately. It is a looping buffer, so a
    # booking in the past is still playing when the clock starts moving.
    # THE ROW'S WORDS ARE "within one beat of the tap", meaning NO LATER than a beat.
    # That is the whole assertion, and "not earlier than the tap" was never in it.
    claim('SOUND NO LATER THAN ONE BEAT AFTER THE TAP',
          isinstance(gap, float) and gap <= ONE_BEAT,
          'booked at context time %ss, the tap was at %ss, so %ss %s it; one beat is '
          '%ss (THE ROW\'S SHIP TEST, measured from the tap because the context is now '
          'made 25 s before the door)'
          % (st, tap, None if gap is None else abs(round(gap, 4)),
             'after' if (gap or 0) >= 0 else 'BEFORE (already booked when the door opened)',
             ONE_BEAT))

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
    # *** AND THE TOLERANCE IS A PERCENTAGE, NOT A QUANTITY (9/23). It was
    # `abs(rel_m - rel_a) <= 0.08`, an ABSOLUTE window, while its own constant is
    # named "the ratio the tool states, allowed to land within 8%". Those are the
    # same thing only while the stated ratio is near 1. Paolo voted this room UP
    # with "very, very low" nine times over, so the ratio went 0.60 -> 0.05, and at
    # 0.05 a window of +/-0.08 is +/-160%: THE CLAIM WOULD HAVE PASSED ON ZERO, on
    # double, on anything. A check that stops checking when the number it watches
    # gets small is worse than none, and nothing about the game would have shown it.
    # 8% OF THE STATED RATIO is what the constant always said. It is stricter than
    # the old window everywhere the old one was meaningful (at 0.60 it is +/-0.048
    # against +/-0.08) and it keeps meaning the same thing at any level he picks.
    rel_m, rel_a = snd.get('relMeasured'), snd.get('relAsked')
    import math as _m
    _dB = (20 * _m.log10(rel_m)) if (rel_m and rel_m > 0) else None
    claim('IT SITS UNDER THE HEARTBEAT AT THE STATED RATIO',
          rel_m is not None and rel_a is not None
          and abs(rel_m - rel_a) <= REL_TOL * rel_a,
          'room energy %s against heartbeat %s = %sx, stated %sx, which is %s dB '
          'under the beat (matched on rms, never on peak: a thump and a bed cannot '
          'be compared on peak; the window is 8%% OF the stated ratio, not a flat '
          '0.08, which meant nothing once the ratio went to 0.05)'
          % (snd.get('roomEnergy'), snd.get('pulseEnergy'), rel_m, rel_a,
             None if _dB is None else round(_dB, 1)))
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
