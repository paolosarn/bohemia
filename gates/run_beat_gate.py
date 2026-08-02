#!/usr/bin/env python3
"""
BOHEMIA RUN BEAT GATE (7/29/26) — the run is on the SONG'S clock, measured.

THE HOLE THIS CLOSES: the walk's beat was the literal `var BEAT=500`, and no
tempo, beat index or transport state ever crossed the parent->run postMessage
vocabulary. The run and the music agreed only because both numbers were typed
the same. That is two clocks that have not drifted yet, not the 120 BPM LAW.

A STATIC CHECK WOULD PROVE NOTHING HERE. "The message exists in the source" and
"the run is actually phase-locked to the studio's AudioContext" are completely
different claims, and only the second one is the law. So this opens the ONE alpha
in a real browser, starts the real MUSIC studio, and measures what the run
believes about time while a song is genuinely playing.

WHAT IT HOLDS:
  1. THE VOCABULARY EXISTS      BOHEMIA_RUN_BEAT is posted by the parent and
                                taken by the run
  2. NO HARDCODED BEAT SURVIVES the door and the slide read the live clock, not
                                a literal
  3. SILENCE IS THE OLD BEHAVIOUR with no song playing the run reports 500 ms
                                and 120 BPM, so this changed nothing about a
                                quiet run
  4. IT LOCKS                   with the studio playing, the run's beat index
                                and ms-per-beat match the studio's own
  5. THE PHASE IS REAL          the run's fractional beat advances with wall
                                clock, lands in [0,1), and two reads a known
                                interval apart differ by that interval in beats
  6. IT LETS GO                 when the music stops the run stops claiming to
                                be locked, instead of freezing on a stale beat
                                that will never be followed by another

Run from repo root:  python3 gates/run_beat_gate.py
"""
import json
import os
import subprocess
import sys
import tempfile

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
RUN = 'slices/BOHEMIA_RUN_CURRENT.html'

JS = r"""
const path=require('path');
function pw(){for(const g of ['/opt/node22/lib/node_modules','/usr/lib/node_modules',
  '/usr/local/lib/node_modules']){try{return require(path.join(g,'playwright'));}catch(e){}}
  return require('playwright');}
(async()=>{
  const {chromium}=pw();
  // autoplay must be allowed or the studio never starts and every measurement
  // below would be measuring silence
  const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});
  const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});
  const errs=[];
  p.on('pageerror',e=>errs.push('PAGEERROR '+e.message));
  await p.goto('file://'+path.join(process.argv[2],'slices','BOHEMIA_ALPHA_0_9.html'));
  await p.waitForTimeout(1500);
  await p.evaluate(()=>{const f=document.getElementById('front');if(f)f.click();});
  await p.waitForTimeout(500);
  // open RUN so the frame exists and boots
  await p.evaluate(()=>{const t=[...document.querySelectorAll('.tab')]
    .find(x=>x.getAttribute('data-p')==='run'); if(!t) throw new Error('that tab is not in the bar'); t.click();});
  // ATTACHED, not visible: the panel is display:none until its tab is on, and the
  // frame boots regardless. Waiting for visibility waits forever.
  await p.waitForSelector('#runFrame',{state:'attached',timeout:30000});
  await p.waitForTimeout(2500);
  const fr=await (await p.$('#runFrame')).contentFrame();
  await fr.waitForFunction(()=>typeof RB!=='undefined',null,{timeout:30000,polling:200});
  await p.waitForTimeout(800);

  const out={};
  out.bridge=await p.evaluate(()=>!!window.__RUNBEAT_BRIDGE);

  // ---- 3. SILENCE: the old behaviour, untouched
  out.silent=await fr.evaluate(()=>({ms:RB.msPerBeat(),bpm:RB.bpm(),playing:RB.playing()}));

  // ---- start the REAL studio
  await p.evaluate(()=>{ try{ MUS.build(); MUS.start(); }catch(e){} });
  await p.waitForTimeout(2200);
  out.studioPlaying=await p.evaluate(()=>{
    try{ return {playing:!!MUS.playing, step:MUS.step, ms:MUS.stepDur()*4*1000,
                 acState:MUS.AC?MUS.AC.state:'none'}; }catch(e){ return {playing:false}; }
  });

  // ---- 4. LOCK: what the run believes vs what the studio is doing.
  // Read both sides back to back rather than adding a probe responder to the
  // run: this gate belongs to the SOUNDS lane and the run file belongs to
  // another one, so it gets the plumbing and not a line of test scaffolding.
  // A beat is 500 ms; a few ms of skew between the two reads cannot move any
  // of the numbers below.
  const parentSide=await p.evaluate(()=>({
    parentBeat:Math.floor((MUS.step||0)/4), parentMs:MUS.stepDur()*4*1000 }));
  const childSide=await fr.evaluate(()=>({
    beat:Math.floor(RB.beatNow()), msPerBeat:RB.msPerBeat(), playing:RB.playing() }));
  out.locked={parentBeat:parentSide.parentBeat, parentMs:parentSide.parentMs, child:childSide};

  // ---- 5. PHASE advances with the wall clock
  const a=await fr.evaluate(()=>RB.beatNow());
  await p.waitForTimeout(1000);          // 1 second == exactly 2 beats at 120
  const c=await fr.evaluate(()=>RB.beatNow());
  out.advance={a,c,delta:c-a};
  out.phase=await fr.evaluate(()=>RB.phase());

  // ---- 6. LETTING GO when the transport stops
  await p.evaluate(()=>{ try{ MUS.stop(); }catch(e){} });
  await p.waitForTimeout(1800);
  out.afterStop=await fr.evaluate(()=>({playing:RB.playing(),ms:RB.msPerBeat()}));

  out.errs=errs;
  console.log(JSON.stringify(out));
  await b.close();
})();
"""

P = F = 0


def chk(ok, msg):
    global P, F
    if ok:
        P += 1
    else:
        F += 1
        print('  FAIL  ' + msg)


def main():
    print('=== RUN BEAT GATE — the run is on the song\'s clock ===')

    # ---- 1 & 2: the wiring is really there, in both files
    alpha = open(ALPHA, encoding='utf8').read()
    run = open(RUN, encoding='utf8').read()
    chk('RUN BEAT BRIDGE' in alpha, 'the parent carries no beat bridge')
    chk("type:'BOHEMIA_RUN_BEAT'" in alpha, 'the parent never posts BOHEMIA_RUN_BEAT')
    chk('RUN BEAT RECEIVER' in run, 'the run carries no beat receiver')
    chk("'BOHEMIA_RUN_BEAT'" in run, 'the run never listens for the beat')
    chk('rbDoorMs()' in run, 'the door still uses a hardcoded beat')
    chk('rbBeatMs()' in run, 'the slide still uses a hardcoded beat')
    chk('/DOOR_MS)' not in run, 'a hardcoded DOOR_MS is still driving the door animation')

    # the run must not have grown a second AudioContext to do this
    chk('new AudioContext' not in run and 'new (window.AudioContext' not in run,
        'the run built its own AudioContext — one context, the parent\'s')

    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as fh:
        fh.write(JS)
        js = fh.name
    try:
        r = subprocess.run(['node', js, os.path.abspath(REPO)],
                           capture_output=True, text=True, timeout=600)
    finally:
        os.unlink(js)
    if r.returncode != 0:
        print('  FAIL  the browser run died:\n' + (r.stderr or '')[-1500:])
        return 1
    try:
        d = json.loads(r.stdout.strip().splitlines()[-1])
    except Exception as e:
        print('  FAIL  unreadable browser output (%s):\n%s' % (e, r.stdout[-1200:]))
        return 1

    chk(not d.get('errs'), 'the page threw: %s' % (d.get('errs') or [])[:2])
    chk(d.get('bridge'), 'the beat bridge never installed in a real browser')

    # 3. silence is the old behaviour
    s = d.get('silent') or {}
    chk(abs(s.get('ms', 0) - 500) < 1e-6,
        'a silent run no longer reports 500 ms (got %s) — this was supposed to change '
        'nothing about a quiet run' % s.get('ms'))
    chk(abs(s.get('bpm', 0) - 120) < 1e-6, 'a silent run is not at 120 BPM (got %s)' % s.get('bpm'))
    chk(s.get('playing') is False, 'the run thinks a song is playing when none is')

    # the studio genuinely started, or nothing below means anything
    sp = d.get('studioPlaying') or {}
    chk(sp.get('playing'), 'the MUSIC studio never started, so the lock was never tested '
                           '(audio state: %s)' % sp.get('acState'))

    # 4. it locks
    lk = d.get('locked') or {}
    child = lk.get('child')
    chk(child is not None, 'the run never answered the probe, so its clock is unreadable')
    if child:
        chk(child.get('playing') is True, 'the run does not know a song is playing')
        chk(abs(child.get('msPerBeat', 0) - lk.get('parentMs', 0)) < 1e-6,
            'tempo disagreement: studio %s ms, run %s ms' % (lk.get('parentMs'), child.get('msPerBeat')))
        # the run may legitimately be a beat behind the studio's SCHEDULER, which
        # runs ahead of what you can hear. More than 2 beats apart is a real fault.
        drift = abs(child.get('beat', -999) - lk.get('parentBeat', 0))
        chk(drift <= 2, 'the run is %s beats away from the studio — that is not a lock' % drift)

    # 5. phase is real and moves with the wall clock
    adv = d.get('advance') or {}
    chk(abs(adv.get('delta', 0) - 2.0) < 0.25,
        'one second of wall clock moved the run %.3f beats, not 2 (120 BPM)' % adv.get('delta', 0))
    ph = d.get('phase', -1)
    chk(0 <= ph < 1, 'phase is outside [0,1): %s' % ph)

    # 6. it lets go
    af = d.get('afterStop') or {}
    chk(af.get('playing') is False,
        'the music stopped and the run still claims to be locked — it would sit on a '
        'stale beat forever')
    chk(abs(af.get('ms', 0) - 500) < 1e-6,
        'after the music stopped the run free-runs at %s ms instead of the last tempo'
        % af.get('ms'))

    print('  %d passed, %d FAILED' % (P, F))
    if not F:
        print('  the run took the studio\'s tempo, tracked its phase, and let go on stop.')
    return 1 if F else 0


if __name__ == '__main__':
    sys.exit(main())
