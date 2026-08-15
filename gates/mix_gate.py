#!/usr/bin/env python3
"""
MIX GATE (8/15/26) - the game stops letting everything shout at once.

Two defects, one cause: NOTHING IN THE GAME EVER MOVED OUT OF THE WAY OF
ANYTHING ELSE. 105 approved sounds, all placed in space, all carrying his
thumbs -- and when several land together they arrive at the same weight and
fight, and the one the player most needed is as likely to lose as any other.

1. THE VOICE CAP DROPPED WHATEVER ARRIVED NINTH. Eight sounds inside sixty
   milliseconds and the next one is refused, whatever it is -- so a flood of
   footsteps could silence the kill that landed behind it. A mix that discards
   by ARRIVAL ORDER is a queue, not a mix. Four coarse priority tiers now
   decide instead, and each tier may use only part of the window, so the sound
   the game makes most cannot crowd out the sound that matters most. CRITICAL
   bypasses the cap entirely.
   SAID PLAINLY: this is not voice STEALING. A Web Audio source already
   scheduled cannot be cheaply un-scheduled, so nothing already sounding is cut
   short. The cap decides what gets IN, and "priority" usually implies more
   than that.

2. THE MUSIC NEVER GOT OUT OF THE WAY OF A PERSON. Ducking under dialogue is
   the oldest move in the book -- broadcast has done it for decades and every
   game middleware ships it. The researched shape is about -9 dB with a typical
   game ramp of ~500 ms down and ~1000 ms back. THE ATTACK IS SHORTENED TO
   150 ms AND THE GATE SAYS SO: 500 ms buries the first third of a line that is
   often a second and a half long, which is the exact thing the duck exists to
   prevent. Recovery stays long, because a fast recovery pumps.

WHY THE DUCK HAS ITS OWN NODE. MUSVOL is the music volume Paolo sets. Ducking
it would fight his mixer and lose his setting the first time the two disagreed.
A dedicated gain sits between the music master and his slider, so the duck is
the only thing that ever writes to it -- and this gate checks his slider is
still where he left it after a duck has come and gone.

EVERYTHING BELOW IS MEASURED ON THE LIVE GRAPH, not read off the tables. The
duck reports its own numbers and a gate that believed them would be checking
that arithmetic equals itself, so the gain on the node is sampled over real
time while a real line is spoken.
"""
import json
import os
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

JS = r'''
const path=require('path');
function pwmod(){for(const g of ['/opt/node22/lib/node_modules','/usr/lib/node_modules','/usr/local/lib/node_modules']){try{return require(path.join(g,'playwright'));}catch(e){}}return require('playwright');}
const pw=pwmod();
(async()=>{
  const {chromium}=pw;
  const b=await chromium.launch();
  const p=await b.newPage({viewport:{width:390,height:844}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+path.join(process.argv[2],'slices','BOHEMIA_ALPHA_0_9.html'));
  await p.waitForTimeout(1500);
  await p.click('#front',{force:true}).catch(()=>{});
  await p.waitForTimeout(1000);

  const out=await p.evaluate(async()=>{
    const r={};
    r.hasDuck = typeof window.duckMusic === 'function';
    r.hasStats = typeof window.__voiceStats === 'function';
    if(!r.hasDuck || !r.hasStats) return r;
    try{ MUS.audio(); }catch(e){}

    /* ---- PRIORITY, asked of the shipped classifier ---- */
    const vs = window.__voiceStats();
    r.tiers = vs.tiers;
    r.prio = {};
    for(const ev of ['kill','hurt','shot','step_asphalt','step_dirt','air_night',
                     'generator','door_drag','save_chime','ui_tap'])
      r.prio[ev] = vs.prioOf ? vs.prioOf(ev) : null;

    /* THE FLOOD. Ask for far more footsteps than the window holds, then ask for
       a kill in the same instant, and see which survives. This is the defect in
       one experiment.
       ASKED OF THE ADMISSION FUNCTION, NOT OF FORTY RENDERS. The first version
       of this called playSFX forty times, and building forty real sounds took
       LONGER THAN THE SIXTY MILLISECOND WINDOW they were meant to be crowding --
       so the window drained underneath the experiment and a footstep sailed
       through afterwards. The measurement was the slow part. __voiceAdmit is
       the same function playSFX calls, asked directly. */
    /* AND THE FLOOD HAS TO BE MANY DIFFERENT SOUNDS. Asking for one event
       forty times admits ONE -- the 45 ms per-event guard sees to that, and
       measuring it is what corrected the claim this gate was first written on.
       A real crowded moment is a fight: distinct things landing together. */
    r.sameEventBurst = (function(){ let n=0;
      for(let i=0;i<40;i++) if(window.__voiceAdmit('step_asphalt')) n++; return n; })();
    const CROWD=['door_drag','save_chime','ui_tap','quest_done','phone_buzz',
                 'go_inside','eat','pickup','time_pass','demolish'];
    let inN=0;
    for(const e of CROWD) if(window.__voiceAdmit(e)) inN++;
    r.crowdAdmitted = inN;
    r.killAfterFlood = !!window.__voiceAdmit('kill');
    r.ordinaryAfterFlood = !!window.__voiceAdmit('door_shut');
    r.stepAfterFlood = !!window.__voiceAdmit('step_dirt');

    /* ---- DUCKING, sampled on the live node over real time ---- */
    const before = window.__duckStats();
    r.duckWiredBefore = before.wired;
    /* his music slider, so the gate can prove the duck never moved it */
    r.mixBefore = (window.getMix ? window.getMix().music : null);
    const musvolBefore = window.__MUSVOL ? window.__MUSVOL.gain.value : null;

    /* MEASURE THE AUDIO, NOT THE NUMBER. AudioParam.value does not reflect
       running automation in Chrome, so the first version of this gate sampled
       1.000 all the way through a duck that was working perfectly. Worse, a
       number can be right while the node sits outside the signal path -- which
       is the failure that matters most here. So: a steady tone into the music
       master, an analyser after the duck, and the LEVEL sampled over real time.
       If the duck node were ever disconnected, this goes flat. */
    const AC=MUS.AC;
    /* THE NODE IS BUILT ON FIRST USE, so a probe has to ask for one duck before
       it can attach to it. Done through the shipped API rather than a test-only
       hook, and waited out in full so the baseline below is a recovered graph. */
    window.duckMusic(0.05);
    await new Promise(res=>setTimeout(res,1400));
    const osc=AC.createOscillator(); osc.type='sine'; osc.frequency.value=220;
    const og=AC.createGain(); og.gain.value=0.2;
    osc.connect(og); og.connect(MUS.MAST);
    const an=AC.createAnalyser(); an.fftSize=2048;
    const probe=new Float32Array(an.fftSize);
    window.__DUCK.connect(an);
    osc.start();
    function level(){ an.getFloatTimeDomainData(probe);
      let sq=0; for(let i=0;i<probe.length;i++) sq+=probe[i]*probe[i];
      return Math.sqrt(sq/probe.length); }
    /* SAMPLED AGAINST THE AUDIO CLOCK, NOT THE WALL CLOCK. setTimeout drifts
       badly on a busy page -- a 100 ms sleep measured 1.1 s here -- so timing
       assertions written in milliseconds were testing the browser's scheduler
       rather than the duck. Every sample carries the AudioContext time it was
       taken at, and the assertions are made against the duck's own schedule. */
    await new Promise(res=>setTimeout(res,120));
    r.base = +level().toFixed(5);
    const tCall = AC.currentTime;
    /* A LONGER DUCK THAN THE GAME USUALLY ASKS FOR, on purpose: this page's
       timers drift so hard that a 0.8 s hold caught a single sample. The SHAPE
       is identical -- same depth, same ramps, the duration is just an argument
       -- and a longer hold gives the sampler room to prove it stays down
       rather than merely passing through on its way back up. */
    const info = window.duckMusic(2.5);
    r.duckInfo = info; r.tCall = tCall;
    const trace=[];
    for(let i=0;i<30;i++){
      await new Promise(res=>setTimeout(res,90));
      trace.push([+AC.currentTime.toFixed(3), +(level()/Math.max(1e-9,r.base)).toFixed(3)]);
    }
    r.trace = trace;
    try{ osc.stop(); }catch(_e){}
    r.musvolAfter = window.__MUSVOL ? window.__MUSVOL.gain.value : null;
    r.musvolBefore = musvolBefore;
    r.mixAfter = (window.getMix ? window.getMix().music : null);
    r.duckWiredAfter = window.__duckStats().wired;

    /* ---- AND A REAL LINE DUCKS IT, which is the only reason it exists ---- */
    if(typeof window.speakLine === 'function'){
      await new Promise(res=>setTimeout(res,300));
      const osc2=AC.createOscillator(); osc2.type='sine'; osc2.frequency.value=220;
      const og2=AC.createGain(); og2.gain.value=0.2;
      osc2.connect(og2); og2.connect(MUS.MAST); osc2.start();
      await new Promise(res=>setTimeout(res,120));
      r.spokeBase = +level().toFixed(5);
      window.speakLine('story:mother', 'Sit down, both of you.');
      await new Promise(res=>setTimeout(res,280));
      r.spokeDuck = +level().toFixed(5);
      try{ osc2.stop(); }catch(_e){}
    }
    return r;
  });
  out.errors=errs.slice(0,3);
  console.log(JSON.stringify(out));
  await b.close();
})();
'''


def main():
    print('=== MIX GATE - the important sound wins, and the music gets out of the way ===')
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
        r = subprocess.run(['node', js, ROOT], capture_output=True, text=True, timeout=900)
    finally:
        os.unlink(js)
    line = [x for x in r.stdout.strip().split('\n') if x.startswith('{')]
    if not line:
        print('  > node produced nothing:\n' + (r.stderr or '')[-1200:])
        print('  0 passed, 1 FAILED')
        return 1
    d = json.loads(line[-1])

    ok('the shipped alpha can duck the music', d.get('hasDuck'))
    ok('and reports what its voice limiter is doing', d.get('hasStats'))
    if not (d.get('hasDuck') and d.get('hasStats')):
        print('  %d passed, %d FAILED' % (p, f))
        return 1

    # ---- PRIORITY ---------------------------------------------------------
    pr = d['prio']
    print('  priority: ' + ', '.join('%s=%s' % (k, v) for k, v in pr.items()))
    ok('THE FIGHT IS CRITICAL: kill/hurt/shot outrank everything (%s/%s/%s)'
       % (pr.get('kill'), pr.get('hurt'), pr.get('shot')),
       pr.get('kill') == 3 and pr.get('hurt') == 3 and pr.get('shot') == 3)
    ok('A FOOTSTEP IS THE LOWEST, because it is the sound the game makes most '
       'and the only one that can flood the window alone (%s, %s)'
       % (pr.get('step_asphalt'), pr.get('step_dirt')),
       pr.get('step_asphalt') == 0 and pr.get('step_dirt') == 0)
    ok('the valley being the valley sits under things you did (%s vs %s)'
       % (pr.get('air_night'), pr.get('door_drag')),
       (pr.get('air_night') or 9) < (pr.get('door_drag') or 0))

    # THE EXPERIMENT THAT IS THE WHOLE POINT
    ok('ONE SOUND CANNOT FLOOD THE WINDOW ON ITS OWN: 40 asks for the same '
       'footstep admit %d, because the 45 ms per-event guard already stops that '
       '-- measured, and it corrected what this gate first claimed'
       % d['sameEventBurst'], d['sameEventBurst'] == 1)
    ok('a crowd of DIFFERENT sounds fills the window (%d of %d admitted)'
       % (d['crowdAdmitted'], 10), d['crowdAdmitted'] >= 7)
    ok('AND THE KILL STILL GETS THROUGH, which is the entire point: before, the '
       'ninth arrival was refused whatever it was', d.get('killAfterFlood'))
    ok('while one more ordinary sound does NOT, so the cap is still a cap',
       not d.get('ordinaryAfterFlood'))
    ok('and a footstep does not sneak in either, since its tier has least room',
       not d.get('stepAfterFlood'))

    # ---- DUCKING ----------------------------------------------------------
    trace = d['trace']
    until = d['duckInfo']['until']
    up = d['duckInfo']['up']
    down = d['duckInfo']['down']
    tcall = d['tCall']
    # inside the hold, after the ramp has had time to bite
    held = [v for (t, v) in trace if tcall + down + 0.05 < t < until]
    # after the recovery ramp has finished
    back = [v for (t, v) in trace if t > until + up + 0.15]
    print('  duck relative to the unducked song: %s'
          % ' '.join('%.2f' % v for (t, v) in trace[:14]))
    print('  held samples %d (min %.3f), recovered samples %d (min %.3f)'
          % (len(held), min(held) if held else -1,
             len(back), min(back) if back else -1))
    info = d.get('duckInfo') or {}
    ok('the duck reports the researched shape (-9 dB = %.3f, %.0f ms down, '
       '%.0f ms back)' % (info.get('depth', 0), 1000 * info.get('down', 0),
                          1000 * info.get('up', 0)),
       abs(info.get('depth', 0) - 0.355) < 0.01)
    ok('there was a song to duck in the first place (%.4f)' % d['base'],
       d['base'] > 1e-4)
    ok('the hold was actually sampled (%d times inside it)' % len(held), len(held) >= 2)
    ok('IT ACTUALLY DUCKS THE AUDIO, not just a number: every sample inside the '
       'hold is down (max %.3f of the unducked song)'
       % (max(held) if held else 9), held and max(held) < 0.55)
    ok('the recovery was sampled too (%d times after it)' % len(back), len(back) >= 2)
    ok('AND IT COMES BACK. A duck that never recovers is just a quieter game '
       '(min %.3f)' % (min(back) if back else -1), back and min(back) > 0.9)

    # ---- HIS SLIDER IS NOT THE DUCK ---------------------------------------
    ok('the duck has its own node and never touched his music slider (%s -> %s)'
       % (d.get('musvolBefore'), d.get('musvolAfter')),
       d.get('musvolBefore') == d.get('musvolAfter'))
    ok('and his stored music setting is exactly where he left it (%s -> %s)'
       % (d.get('mixBefore'), d.get('mixAfter')),
       d.get('mixBefore') == d.get('mixAfter'))
    ok('the duck node stays wired across a whole duck cycle',
       d.get('duckWiredAfter'))

    # ---- AND A PERSON TALKING IS WHAT DOES IT -----------------------------
    if 'spokeDuck' in d:
        ok('A PERSON TALKING DUCKS THE MUSIC, which is the only reason any of '
           'this exists (%.3f -> %.3f)' % (d['spokeBase'], d['spokeDuck']),
           d['spokeDuck'] < d['spokeBase'] * 0.7)
    else:
        ok('speakLine exists to be measured', False)

    ok('the page threw nothing: %s' % (d.get('errors') or 'clean'),
       not d.get('errors'))

    print('  %d passed, %d FAILED' % (p, f))
    if not f:
        print('  The kill survives a crowded moment, and the song steps back when '
              'somebody speaks.')
    return 1 if f else 0


if __name__ == '__main__':
    sys.exit(main())
