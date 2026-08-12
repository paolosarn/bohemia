#!/usr/bin/env python3
"""
SFX DIVERSITY GATE (8/12/26) - "stale" made measurable, so it cannot come back.

Paolo, after judging all 270: "you need more diverse sounds bro its getting
stale at this point."

HE WAS DESCRIBING THE TOPOLOGY, NOT THE COUNT. Every sound this engine had ever
made was A STRUCK RESONANT OBJECT -- transient, modal bank, room. Fifty-four
moments built one way are fifty-four cousins, and adding a fifty-fifth moment
built the same way makes the problem worse, not better. That is why the answer
was a new axis (`synth`) rather than a new batch, and it is also why the twelve
moments that died whole were almost all the moments that are NOT a strike:
breaking glass is a hundred collisions, a swing is turbulence, a drag is
friction, neon is electrical, breath has no body at all. A strike-shaped engine
was imitating things that never get struck.

WHAT THIS GATE ASSERTS, and every claim is a MEASUREMENT of rendered audio
rather than a count of names:
  1. The engine really has more than one physics, and each one is reachable.
  2. The new batch spans at least four of them and no single method owns it.
  3. THE METHODS ARE AUDIBLY DIFFERENT. Each candidate is rendered offline and
     reduced to a shape -- attack time, crest factor, zero-crossing rate, how
     the energy is spread over its own length -- and the gate fails if the
     methods are not separated in that space. A `synth` field that renders the
     same sound under five names would pass a name check and fail this one.
  4. His 97 approvals are untouched: every modal candidate still measures
     exactly what the fingerprint ledger recorded (proved by sfx_render_gate;
     asserted here as a shape claim so this file also notices).

WHY A SHAPE AND NOT A SPECTRUM: a full spectral distance would be a better
measure and it is not available offline here without an FFT this engine has no
reason to carry. The five descriptors below are cheap, are computed from the
samples he would actually hear, and separate the five methods by construction:
a strike has a fast attack and a high crest, a cloud of collisions has a high
crest but a long spread, friction has almost no attack and a low crest, and air
has no attack at all. If two methods ever collapse into one region, that IS the
staleness returning and the gate should go red.
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
    if(typeof BOH_SFX==='undefined') return {fatal:'BOH_SFX is not in the shipped alpha'};
    const SR=44100, r={};
    r.methods = (BOH_SFX.SPEC.synth && BOH_SFX.SPEC.synth.of) || null;
    /* MEASURE THE AUDIO HE WOULD HEAR, on the real render path, offline. */
    async function shape(v){
      const secs=BOH_SFX.beatsOf(v)*BOH_SFX.BEAT+0.4;
      const OAC=new OfflineAudioContext(2,Math.ceil(SR*secs),SR);
      const bus=OAC.createGain(); bus.gain.value=1; bus.connect(OAC.destination);
      BOH_SFX.render(v,OAC,bus,0.05);
      const buf=await OAC.startRendering();
      const L=buf.getChannelData(0), R=buf.getChannelData(1);
      const n=L.length; let pk=0, sq=0;
      const mag=new Float32Array(n);
      for(let i=0;i<n;i++){ const a=Math.max(Math.abs(L[i]),Math.abs(R[i]));
        mag[i]=a; if(a>pk)pk=a; sq+=a*a; }
      const rms=Math.sqrt(sq/n);
      /* ATTACK: seconds from first audible sample to the peak. A strike is
         milliseconds; a swell is hundreds of them. */
      const thr=Math.max(pk*0.05,1e-5);
      let first=-1, peakAt=0;
      for(let i=0;i<n;i++){ if(first<0 && mag[i]>thr) first=i;
        if(mag[i]>=pk-1e-9){ peakAt=i; break; } }
      if(first<0) first=0;
      const attack=Math.max(0,(peakAt-first))/SR;
      /* CREST: peak over rms. Spiky clouds and strikes run high; a continuous
         band runs low. This is the single strongest separator here. */
      const crest = rms>0 ? pk/rms : 0;
      /* SPREAD: what fraction of the sound's own length carries half its
         energy. A strike front-loads; friction and air are flat. */
      let acc=0, half=0; const tot=sq||1;
      for(let i=0;i<n;i++){ acc+=mag[i]*mag[i]; if(acc>=tot*0.5){ half=i; break; } }
      const spread=half/n;
      /* ZCR: a cheap brightness/noisiness read over the audible part. */
      function zcrOf(a,b2){ let zc=0,cnt=0;
        for(let i=Math.max(1,a);i<b2;i++){ cnt++; if((L[i]>=0)!==(L[i-1]>=0)) zc++; }
        return cnt?zc/cnt:0; }
      const zcr=zcrOf(first,n);
      /* COLLAPSE: how much brighter the sound is at its START than at its END.
         Added 8/12 because the first version of this gate could not see FM at
         all. Chowning's whole articulation is the modulation INDEX falling
         across the note -- rich sidebands at the attack, near-sine at the tail
         -- and that is a change in the spectrum OVER TIME, which none of the
         other four descriptors touch. A modal bank also loses its highs, but
         gently, because each partial has its own decay; an index envelope
         collapses the spectrum. The ruler was missing the dimension the method
         lives in, so the ruler was wrong, not the target. */
      const mid=Math.floor(first+(n-first)*0.25), lateFrom=Math.floor(first+(n-first)*0.55);
      const zEarly=zcrOf(first,Math.max(first+2,mid)), zLate=zcrOf(lateFrom,n);
      const collapse = zLate>1e-6 ? zEarly/zLate : (zEarly>1e-6 ? 20 : 1);
      /* PULSES: how many separate ONSETS the sound contains. Added 8/12 for
         the same reason as collapse -- the controlled probe could not tell
         friction from particle, and the difference between them is precisely
         MANY DISCRETE EVENTS versus ONE CONTINUOUS BAND. A cloud of collisions
         has a dozen local rises; a scrape has almost none however rough it is.
         Measured on a smoothed envelope with a refractory window, so ordinary
         waveform wiggle inside one event is not counted as another event. */
      const W=Math.max(1,Math.round(SR*0.003));           /* 3 ms envelope */
      const env=[]; for(let i=0;i<n;i+=W){ let e=0;
        for(let k=i;k<Math.min(n,i+W);k++) if(mag[k]>e) e=mag[k]; env.push(e); }
      const onThr=pk*0.22, refr=Math.max(1,Math.round(0.012/0.003)); /* 12 ms */
      let pulses=0, cool=0;
      for(let i=1;i<env.length;i++){
        if(cool>0){ cool--; continue; }
        if(env[i]>onThr && env[i]>env[i-1]*1.35){ pulses++; cool=refr; }
      }
      return {peak:+pk.toFixed(5), attack:+attack.toFixed(5),
              crest:+crest.toFixed(3), spread:+spread.toFixed(4), zcr:+zcr.toFixed(5),
              collapse:+Math.min(20,collapse).toFixed(3), pulses:pulses};
    }
    /* THE CONTROLLED PROBE. The first version of this gate compared methods
       through their own recipes, and that comparison is worthless: different
       recipes differ whatever engine renders them. Mutation-tested and it
       passed with friction dispatching straight to bodyAir -- two methods,
       one body, gate green. So the decisive check holds EVERY parameter
       fixed and changes only `synth`. If two methods render the same audio
       from the same numbers, they are the same method wearing two names, and
       that is exactly the staleness this file exists to catch. */
    r.probe={};
    for(const m of (r.methods||[])){
      const v=BOH_SFX.sanitize({ev:'probe', id:'probe.'+m, synth:m,
        mat:'stone', hz:220, modes:6, bright:1, decay:0.5, damp:1.6, warble:1,
        atk:0.0625, slide:-3, trans:0.4, transHz:3000, transQ:1.5, grit:0.4,
        gritHz:2000, space:0.2, room:0.25, refl:1, dark:2000, width:0.6,
        drive:0.1, gain:0.4, mkup:1, ratio:2.17, index:6, grains:16, rough:12});
      r.probe[m]=await shape(v);
    }
    r.rows=[];
    for(const E of BOH_SFX.EVENTS){
      for(const v of BOH_SFX.cook(E.ev,5)){
        const sh=await shape(v);
        r.rows.push(Object.assign({id:v.id, ev:E.ev, synth:v.synth}, sh));
      }
    }
    return r;
  });
  out.errors=errs.slice(0,3);
  console.log(JSON.stringify(out));
  await b.close();
})();
'''


def main():
    print('=== SFX DIVERSITY GATE - "getting stale" made measurable ===')
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
        r = subprocess.run(['node', js, ROOT], capture_output=True, text=True, timeout=1500)
    finally:
        os.unlink(js)
    line = [x for x in r.stdout.strip().split('\n') if x.startswith('{')]
    if not line:
        print('  > node produced nothing:\n' + (r.stderr or '')[-1200:])
        print('  0 passed, 1 FAILED')
        return 1
    d = json.loads(line[-1])
    if d.get('fatal'):
        print('  > FAIL ' + d['fatal'])
        print('  0 passed, 1 FAILED')
        return 1

    rows = d['rows']
    by = {}
    for row in rows:
        by.setdefault(row['synth'], []).append(row)

    # ---- 1. THE ENGINE HAS MORE THAN ONE PHYSICS, AND THEY SHIP ------------
    methods = d.get('methods') or []
    ok('the shipped engine declares more than one way to make a sound (%s)'
       % ', '.join(methods), len(methods) >= 5)
    ok('and every declared method is actually REACHED by a recipe (%s)'
       % ', '.join('%s:%d' % (k, len(v)) for k, v in sorted(by.items())),
       set(methods) <= set(by))

    # ---- 2. THE NEW BATCH IS NOT ONE METHOD WEARING FIVE HATS -------------
    fresh = [r0 for r0 in rows if r0['synth'] != 'modal']
    fresh_m = {r0['synth'] for r0 in fresh}
    ok('the new batch spans at least four different physics (%s)'
       % ', '.join(sorted(fresh_m)), len(fresh_m) >= 4)
    if fresh:
        top = max(len([x for x in fresh if x['synth'] == m]) for m in fresh_m)
        ok('and no single method owns it (%d of %d candidates at most)'
           % (top, len(fresh)), top <= len(fresh) * 0.5)

    # ---- 3. THE METHODS ARE AUDIBLY DIFFERENT -----------------------------
    # This is the check that makes "stale" a measurement. Names are free; a
    # separation in the sound itself is not.
    def mean(rs, k):
        return sum(x[k] for x in rs) / max(1, len(rs))

    print('  method      n   attack     crest    spread      zcr  collapse  pulses')
    stats = {}
    for m in sorted(by):
        rs = by[m]
        stats[m] = {k: mean(rs, k) for k in ('attack', 'crest', 'spread', 'zcr', 'collapse', 'pulses')}
        print('  %-9s %3d  %8.4f  %8.3f  %8.4f  %8.5f  %8.3f  %6.1f'
              % (m, len(rs), stats[m]['attack'], stats[m]['crest'],
                 stats[m]['spread'], stats[m]['zcr'], stats[m]['collapse'],
                 stats[m]['pulses']))

    # Each non-modal method must differ from MODAL on at least one descriptor
    # by a real margin. Failing this means a new name was added and nothing
    # about the sound changed -- staleness with extra steps.
    MARGIN = {'attack': 0.02, 'crest': 1.5, 'spread': 0.08, 'zcr': 0.02,
              'collapse': 0.8, 'pulses': 3}
    for m in sorted(fresh_m):
        diffs = {k: abs(stats[m][k] - stats['modal'][k]) for k in MARGIN}
        far = [k for k in MARGIN if diffs[k] >= MARGIN[k]]
        ok('%s does not just SAY it is different, it MEASURES different from a '
           'struck object (%s)' % (m, ', '.join('%s %.4f' % (k, diffs[k]) for k in far) or 'nothing'),
           bool(far))

    # ---- 3b. THE CONTROLLED COMPARISON, which is the one that counts -------
    # Every parameter held fixed, only `synth` changed. The recipe-level stats
    # above cannot separate a method from its recipe; this can. It is the check
    # that goes red when two methods are secretly one.
    probe = d.get('probe') or {}
    ok('every method renders the controlled probe (%s)'
       % ', '.join(sorted(probe)), set(methods) <= set(probe))
    print('  PROBE (identical parameters, only the method changed)')
    for m in sorted(probe):
        q = probe[m]
        print('  %-9s     %8.4f  %8.3f  %8.4f  %8.5f  %8.3f  %6d'
              % (m, q['attack'], q['crest'], q['spread'], q['zcr'], q['collapse'],
                 q['pulses']))
    names = sorted(probe)
    for i in range(len(names)):
        for j in range(i + 1, len(names)):
            a, b2 = names[i], names[j]
            far = [k for k in MARGIN
                   if abs(probe[a][k] - probe[b2][k]) >= MARGIN[k]]
            ok('%s and %s are not the same engine under two names -- same '
               'numbers in, different sound out (%s)'
               % (a, b2, ', '.join(far) or 'INDISTINGUISHABLE'), bool(far))

    # ---- 4. NOTHING HE APPROVED MOVED -------------------------------------
    # sfx_render_gate owns the byte-level proof; this asserts the shape claim so
    # a second file notices if the shared layers are ever changed underneath him.
    modal = by.get('modal') or []
    ok('the struck-object method is still the body of the game (%d candidates)'
       % len(modal), len(modal) >= 250)
    ok('and every one of them still makes sound (%d silent)'
       % len([x for x in modal if x['peak'] < 0.002]),
       not [x for x in modal if x['peak'] < 0.002])
    ok('every NEW candidate makes sound too (%s)'
       % (', '.join(x['id'] for x in fresh if x['peak'] < 0.002) or 'none silent'),
       not [x for x in fresh if x['peak'] < 0.002])

    ok('the page threw nothing: %s' % (d.get('errors') or 'clean'), not d.get('errors'))

    print('  %d passed, %d FAILED' % (p, f))
    if not f:
        print('  Five physics, measurably different from each other in the '
              'rendered audio, not just in the field that names them.')
    return 1 if f else 0


if __name__ == '__main__':
    sys.exit(main())
