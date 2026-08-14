#!/usr/bin/env python3
"""
SPATIAL SOUND GATE (8/13/26) - the valley stops being a flat stereo field.

Every sound in the game arrived at the same level from the same nowhere, with
exactly one exception: a neighbour's footstep, which got distance and pan on 8/2
and had been the only spatial sound since. A door across the lot, a generator
running somewhere, a dog far off -- all of them played as if they were happening
inside the player's head. In a game whose whole texture is walking an empty city,
WHERE a sound is IS the information.

WHAT IS BEING CLAIMED, and the honesty line runs through the middle of it:
  LEVEL and PAN are exact. Amplitude proportional to 1/r is the inverse law,
    about 6 dB per doubling; it is the model the footstep path already used and
    it is now generalised rather than copied a second time. Pan from the x
    offset is the whole truth available to a top-down game -- there is no
    front/back to encode and faking one would be inventing information.
  COLOUR IS A DIAL RESTING ON A REAL DIRECTION. Distant sound is duller for two
    real reasons -- air absorbs high frequencies faster than low ones (ISO
    9613-1 quantifies it), and the further away you are the more of what reaches
    you is reflection rather than direct sound. But across a city block literal
    atmospheric absorption is small, so the curve is chosen to READ right. This
    gate asserts the DIRECTION, never a number, because the direction is the
    part that is true.
  OCCLUSION is the cue a city needs: a sound made inside a building and heard
    from the street is quieter AND duller than the same sound in the open.

EVERY CHECK MEASURES RENDERED AUDIO. The placement code returns its own gain and
cutoff, and a gate that read those numbers back would be checking that
arithmetic equals itself. So this renders through the real path into an offline
context and measures what comes out: level, left/right balance, and
high-frequency content. If the filter were ever disconnected, the numbers it
reports would still be perfect and the samples would not.
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
  await p.waitForTimeout(900);
  const out=await p.evaluate(async()=>{
    const r={};
    r.hasPlace = typeof window.playSFXAt === 'function';
    r.hasListener = typeof window.__sfxListener === 'function';
    if(!r.hasPlace) return r;
    if(typeof BOH_SFX==='undefined') return {fatal:'BOH_SFX is not in the shipped alpha'};

    /* AN EVENT HE ACTUALLY APPROVED, so this measures the shipped path and not
       a probe vector nobody will ever hear. */
    const A = window.__SFX_APPROVED || {};
    const ev = ['step_asphalt','step_dirt','kill','pickup'].find(e=>(A[e]||[]).length);
    r.ev = ev || null;
    if(!ev) return r;

    const SR=44100;
    /* RENDER THROUGH THE REAL PLACEMENT CODE into an offline context. playSFXAt
       renders into the live context, so this calls it with an explicit
       destination inside an OfflineAudioContext -- the same function, the same
       filter chain, measured instead of listened to. */
    async function place(opts){
      const OAC=new OfflineAudioContext(2, SR*3, SR);
      const sink=OAC.createGain(); sink.gain.value=1; sink.connect(OAC.destination);
      /* MUS.AC is the live context; the placement code builds its nodes on it.
         Swap it for the offline one for the duration of the call. */
      /* MUS.audio() IS STUBBED FOR THE DURATION, AND SAYING SO MATTERS. Its
         whole job is resuming a suspended live context after a user gesture,
         and calling resume() on an OfflineAudioContext throws -- which is a
         complaint about the MEASUREMENT, not about the shipped code. Nothing
         acoustic is stubbed: the same placeSound builds the same gain, the
         same lowpass and the same pan, and the samples below come out of it. */
      /* ONE CANDIDATE ACROSS EVERY CONDITION, and this is not a nicety.
         The wire deliberately picks a RANDOM one of his approved sounds per
         call so walking is not a machine gun -- which means the first version
         of this gate compared a DIFFERENT SOUND at each distance and called
         the difference "space". It passed alone and went red inside the suite,
         which is the only reason it was caught. Math.random is pinned for the
         duration so every condition below places the same candidate and the
         only thing that changes is where it is. Nothing acoustic is stubbed. */
      const realAC = MUS.AC, realAudio = MUS.audio, realRand = Math.random;
      MUS.AC = OAC; MUS.audio = function(){ return OAC; };
      Math.random = function(){ return 0.5; };
      let info=null;
      try { info = window.playSFXAt(ev, opts, sink); }
      finally { MUS.AC = realAC; MUS.audio = realAudio; Math.random = realRand; }
      const buf = await OAC.startRendering();
      const L=buf.getChannelData(0), R=buf.getChannelData(1);
      let pk=0, sqL=0, sqR=0, sq=0, first=-1, last=-1;
      for(let i=0;i<L.length;i++){
        const a=Math.max(Math.abs(L[i]),Math.abs(R[i]));
        if(a>pk)pk=a; sqL+=L[i]*L[i]; sqR+=R[i]*R[i]; sq+=(L[i]*L[i]+R[i]*R[i]);
        if(a>1e-5){ if(first<0)first=i; last=i; }
      }
      if(first<0){ first=0; last=1; }
      /* HIGH-FREQUENCY CONTENT. The first difference is a one-pole high-pass,
         so rms(diff)/rms(signal) rises and falls with the spectral centroid --
         no FFT needed, and it is the thing a lowpass actually moves.
         MEASURED OVER THE WHOLE BUFFER, AND THAT IS THE WHOLE FIX. The first
         version measured between the first and last sample above a fixed
         amplitude threshold, so a quieter render had a SHORTER window -- and
         since the tail is the dull part, distance appeared to darken the sound
         even with the filter pinned wide open. It passed its own mutation test
         and was therefore measuring nothing. Silence contributes zero to both
         sums, so a fixed full-buffer window is level-independent by
         construction and there is no threshold left to be fooled by. */
      let dsq=0, ssq=0;
      for(let i=1;i<L.length;i++){
        const sv=L[i]+R[i], dv=sv-(L[i-1]+R[i-1]);
        dsq+=dv*dv; ssq+=sv*sv;
      }
      const hf = ssq>1e-16 ? Math.sqrt(dsq/ssq) : 0;
      return { peak:+pk.toFixed(6), rms:+Math.sqrt(sq/L.length).toFixed(7),
               rmsL:+Math.sqrt(sqL/L.length).toFixed(7),
               rmsR:+Math.sqrt(sqR/L.length).toFixed(7),
               hf:+hf.toFixed(5), info: info };
    }

    r.near   = await place({dx:0,  dist:1,  inside:false});
    r.mid    = await place({dx:0,  dist:6,  inside:false});
    r.far    = await place({dx:0,  dist:16, inside:false});
    r.left   = await place({dx:-6, dist:6,  inside:false});
    r.right  = await place({dx:6,  dist:6,  inside:false});
    /* THE LISTENER IS OUTSIDE, so a source marked inside has a wall in the way. */
    window.__sfxListener({inside:false});
    r.open     = await place({dx:0, dist:6, inside:false});
    r.occluded = await place({dx:0, dist:6, inside:true});
    /* AND WHEN BOTH ARE INSIDE THERE IS NO WALL: occlusion must not fire on
       everything indoors, which would just be a second distance dial. */
    window.__sfxListener({inside:true});
    r.bothInside = await place({dx:0, dist:6, inside:true});
    window.__sfxListener({inside:false});
    /* TOO FAR TO BE INFORMATION: the placement refuses rather than playing
       something too quiet to identify. */
    r.absurd = await place({dx:0, dist:400, inside:false});
    return r;
  });
  out.errors=errs.slice(0,3);
  console.log(JSON.stringify(out));
  await b.close();
})();
'''


def main():
    print('=== SPATIAL SOUND GATE - the valley has space in it ===')
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
    # READ THE SHIPPED FILES, NOT THE GENERATOR. A patch tool saying it wired
    # something is the tool's opinion; the alpha and the built run are what runs.
    alpha = open(os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html'),
                 encoding='utf8', errors='ignore').read()
    runp = os.path.join(ROOT, 'slices', 'BOHEMIA_RUN_CURRENT.html')
    run = open(runp, encoding='utf8', errors='ignore').read() if os.path.exists(runp) else ''
    d['wiring'] = {
        'listener':   'LISTENER.inside = !!d.inside' in alpha,
        'sfxAt':      "function sfxAt(" in run,
        'accepts':    "BOHEMIA_SFX_AT" in alpha,
        'doorPlaced': "sfxAt('door_drag'" in run,
        'ambPlaced':  'placeSound(ev, { dx: side*7' in alpha,
        'callers':    alpha.count('placeSound(') - alpha.count('function placeSound('),
    }
    if d.get('fatal'):
        print('  > FAIL ' + d['fatal'])
        print('  0 passed, 1 FAILED')
        return 1

    ok('the shipped alpha exposes a way to play a sound AT somewhere',
       d.get('hasPlace'))
    ok('and a way for the run to say where the listener is standing',
       d.get('hasListener'))
    if not d.get('hasPlace'):
        print('  %d passed, %d FAILED' % (p, f))
        return 1
    ok('it is measured on a sound HE APPROVED, not a probe (%s)' % d.get('ev'),
       bool(d.get('ev')))
    if not d.get('ev'):
        print('  %d passed, %d FAILED' % (p, f))
        return 1

    near, mid, far = d['near'], d['mid'], d['far']
    print('            rms         hf      L/R')
    for lbl, o in (('near  r=1', near), ('mid   r=6', mid), ('far   r=16', far),
                   ('left', d['left']), ('right', d['right']),
                   ('open', d['open']), ('occluded', d['occluded']),
                   ('both inside', d['bothInside'])):
        bal = (o['rmsL'] / o['rmsR']) if o['rmsR'] > 1e-9 else 0
        print('  %-12s %9.7f  %7.5f  %6.2f' % (lbl, o['rms'], o['hf'], bal))

    # ---- LEVEL: the inverse law, measured -------------------------------
    ok('FURTHER IS QUIETER: r=6 is below r=1 (%.7f vs %.7f)'
       % (mid['rms'], near['rms']), mid['rms'] < near['rms'] * 0.6)
    ok('and it keeps falling: r=16 is below r=6 (%.7f vs %.7f)'
       % (far['rms'], mid['rms']), far['rms'] < mid['rms'] * 0.75)

    # ---- COLOUR: the direction only, never a number ---------------------
    ok('FURTHER IS DULLER, which the old code had no answer for at all '
       '(hf %.5f at r=16 vs %.5f at r=1)' % (far['hf'], near['hf']),
       far['hf'] < near['hf'] * 0.95)

    # ---- PAN: left is left ----------------------------------------------
    lf, rt = d['left'], d['right']
    ok('A SOUND ON YOUR LEFT ARRIVES ON THE LEFT (L %.7f vs R %.7f)'
       % (lf['rmsL'], lf['rmsR']), lf['rmsL'] > lf['rmsR'] * 1.2)
    ok('and one on your right arrives on the right (L %.7f vs R %.7f)'
       % (rt['rmsL'], rt['rmsR']), rt['rmsR'] > rt['rmsL'] * 1.2)

    # ---- OCCLUSION -------------------------------------------------------
    op, oc = d['open'], d['occluded']
    ok('A WALL IN THE WAY IS QUIETER (%.7f vs %.7f at the same distance)'
       % (oc['rms'], op['rms']), oc['rms'] < op['rms'] * 0.85)
    ok('AND DULLER, not merely turned down (hf %.5f vs %.5f)'
       % (oc['hf'], op['hf']), oc['hf'] < op['hf'] * 0.9)
    bi = d['bothInside']
    ok('BUT A ROOM IS NOT A WALL: inside heard from inside is not occluded '
       '(%.7f vs open %.7f)' % (bi['rms'], op['rms']),
       bi['rms'] > op['rms'] * 0.85)

    # ---- AND IT REFUSES RATHER THAN WHISPERING --------------------------
    ok('TOO FAR IS SILENT, not a sound too quiet to identify (%.7f)'
       % d['absurd']['rms'], d['absurd']['rms'] < 1e-6)

    # ---- AND THE WORLD ACTUALLY USES IT ----------------------------------
    # THE ENGINE EXISTING AND THE GAME USING IT ARE TWO DIFFERENT CLAIMS, and
    # the first version of this gate only made the first one. Placement shipped
    # on 8/13 with exactly ONE caller -- a neighbour's footstep, which was
    # already spatial before any of it was written -- so a door across the lot
    # still arrived dead centre at full level. Built-but-not-triggered is the
    # defect this lane has a law about; it does not stop being that defect
    # because the thing built is good.
    src = d.get('wiring') or {}
    ok('THE LISTENER IS TOLD WHERE IT IS STANDING, or occlusion can never fire '
       'at all (%s)' % ('yes' if src.get('listener') else 'NOTHING SETS IT'),
       src.get('listener'))
    ok('the run can say a sound happened SOMEWHERE, not just that it happened '
       '(%s)' % ('sfxAt' if src.get('sfxAt') else 'no such call'), src.get('sfxAt'))
    ok('and the parent accepts it (%s)'
       % ('BOHEMIA_SFX_AT' if src.get('accepts') else 'no handler'), src.get('accepts'))
    ok('THE DOOR IS PLACED: it knows its own tile instead of playing from '
       'nowhere (%s)' % ('yes' if src.get('doorPlaced') else 'still flat'),
       src.get('doorPlaced'))
    ok('the rare valley sounds happen out in the valley, which is what his own '
       'briefs say -- "somewhere", "far off" (%s)'
       % ('yes' if src.get('ambPlaced') else 'still dead centre'),
       src.get('ambPlaced'))
    n_callers = src.get('callers', 0)
    ok('the placement path has more than the one caller it shipped with (%d)'
       % n_callers, n_callers >= 3)

    ok('the page threw nothing: %s' % (d.get('errors') or 'clean'),
       not d.get('errors'))

    print('  %d passed, %d FAILED' % (p, f))
    if not f:
        print('  Distance is quieter and duller, left is left, and a wall is '
              'both -- measured in the samples, not read back off the maths.')
    return 1 if f else 0


if __name__ == '__main__':
    sys.exit(main())
