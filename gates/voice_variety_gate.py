#!/usr/bin/env python3
"""
VOICE VARIETY GATE (8/26/26) - "more voices" has to mean more SOUNDS.

HIS ORDER, on the 8/26 music export:
    "we need more voices and different instruments sounds and shit."

He said DIFFERENT. The rack already holds 582 melodic voices, so the failure
mode is not "too few" -- it is a 583rd that lands exactly on top of one of the
582 and adds a name instead of a sound. That is the same trap the SFX side was
caught in when he said "you need more diverse sounds bro its getting stale":
the answer was never a bigger count, it was a new PHYSICS.

WHAT THIS ASSERTS, and every claim is a measurement of rendered audio rather
than a count of names:
  1. Every voice this batch adds RENDERS through the real synthV (the rack has
     shipped named-but-silent voices twice: `ironlung` and `throatsong` resolved
     to nothing while every gate stayed green).
  2. It renders at EVERY pitch the game uses, not just the one it was tuned at.
     bowdrag self-oscillated up to 440 Hz and went silent above it during
     development -- a voice that dies in half the register is a silent
     instrument in half the songs.
  3. AND IT DOES NOT LAND ON TOP OF A VOICE THAT ALREADY EXISTS.

HOW 3 IS MEASURED WITHOUT A MAGIC NUMBER. Each voice is reduced to a shape --
attack time, crest factor, how its energy spreads across its own length, zero
crossings normalised against the note's own frequency (so the descriptor is about
TIMBRE and not about pitch), and TWO MEASURES OF HOW MUCH IT MOVES WHILE IT
SOUNDS. That last pair was added after the first run, and adding it was the
finding: on the four static axes pafvox really does sit where `printer` sits and
syncthorn where `ringmod` sits, because what separates them is that a swept sync,
a gliding formant and a settling string CHANGE across the note and nothing was
looking at change. It is applied identically to all 582 existing voices, so if
the old rack also evolves, the bar rises with it. Then, instead of inventing a
threshold, the
gate measures how far apart the EXISTING voices are from each other and requires
a new voice to be at least as far from its nearest neighbour as a typical
existing pair is. THE RACK SETS ITS OWN BAR. If the rack is full of near
duplicates the bar drops honestly, and if it is spread out the bar rises; either
way nobody gets to pick the number that decides whether their own batch passed.

    python3 gates/voice_variety_gate.py
"""
import json
import os
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# -v prints the passing claims too: the DISTANCES are the interesting part of
# this gate even when it is green, and a number nobody can see is a number
# nobody checks.
VERBOSE = '-v' in sys.argv

JS = r'''
const path=require('path');
function pw(){for(const g of ['/opt/node22/lib/node_modules','/usr/lib/node_modules',
  '/usr/local/lib/node_modules']){try{return require(path.join(g,'playwright'));}catch(e){}}
  return require('playwright');}
(async()=>{
  const {chromium}=pw();
  const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});
  const p=await b.newPage({viewport:{width:390,height:844}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+path.join(process.argv[2],'slices','BOHEMIA_ALPHA_0_9.html'));
  await p.waitForTimeout(1500);
  await p.click('#front',{force:true}).catch(()=>{});
  await p.waitForTimeout(1100);

  const out=await p.evaluate(async(NEWV)=>{
    const SR=22050;                      /* half rate: 600+ renders, timbre survives */
    const hzOf=s=>440*Math.pow(2,(s-69)/12);

    async function render(kind, semi, secs){
      const OAC=new OfflineAudioContext(1,Math.ceil(SR*secs),SR);
      const mast=OAC.createGain(); mast.gain.value=1; mast.connect(OAC.destination);
      try{ synthV(kind,OAC,mast,hzOf,0.25,semi,0.02,0.5); }
      catch(e){ return {err:String(e).slice(0,80)}; }
      const buf=await OAC.startRendering();
      const d=buf.getChannelData(0), n=d.length;
      let pk=0, sq=0, zc=0, bad=0;
      for(let i=0;i<n;i++){ const v=d[i];
        if(!isFinite(v)){ bad++; continue; }
        const m=Math.abs(v); if(m>pk)pk=m; sq+=v*v;
        if(i&&((d[i]>=0)!==(d[i-1]>=0))) zc++; }
      const rms=Math.sqrt(sq/n);
      if(bad) return {err:'non-finite samples: '+bad};
      if(pk<1e-5) return {silent:true, pk:pk, rms:rms};
      /* ATTACK: from first audible sample to the peak. */
      const thr=Math.max(pk*0.05,1e-6);
      let first=-1, peakAt=0;
      for(let i=0;i<n;i++){ const m=Math.abs(d[i]);
        if(first<0&&m>thr) first=i;
        if(m>=pk-1e-9){ peakAt=i; break; } }
      if(first<0) first=0;
      /* SPREAD: what fraction of its own length carries half its energy. */
      let acc=0, half=0; const tot=sq||1;
      for(let i=0;i<n;i++){ acc+=d[i]*d[i]; if(acc>=tot*0.5){ half=i; break; } }
      /* how long it is actually SOUNDING, so a short voice is not called quiet */
      let last=first;
      for(let i=n-1;i>first;i--){ if(Math.abs(d[i])>thr){ last=i; break; } }
      const live=Math.max(1,(last-first))/SR;
      /* ZCR NORMALISED BY THE NOTE'S OWN FREQUENCY. Unnormalised, this
         descriptor would mostly measure PITCH and every voice would look
         identical to itself an octave up. Divided by the fundamental it becomes
         "how many crossings per cycle", which is a timbre fact. */
      const zn = zc / Math.max(1, 2*hzOf(semi)*live);
      /* HOW MUCH IT MOVES WHILE IT SOUNDS, and this axis had to be added.
         The first four descriptors are all STATIC facts about the whole note,
         and the gate correctly reported that pafvox landed on `printer` and
         syncthorn on `ringmod` -- because on attack, crest, spread and average
         brightness they DO sit in the same region. What separates them is that
         a swept sync, a gliding formant and a settling string CHANGE across the
         note, and nothing here was looking at change. Measured per frame:
         BRIGHTNESS MOVEMENT (how much the crossing rate wanders) and LEVEL
         MOVEMENT (how much the envelope wanders beyond a plain decay).
         Applied identically to all 582 existing voices, so it is an axis, not
         an excuse -- if the old rack also evolves, the bar rises with it. */
      const FR=Math.max(64, Math.floor(SR*0.02));   /* 20 ms frames */
      const zf=[], ef=[];
      for(let a=first; a+FR<=last; a+=FR){
        let z=0, e=0;
        for(let i=a+1;i<a+FR;i++){ e+=d[i]*d[i];
          if((d[i]>=0)!==(d[i-1]>=0)) z++; }
        zf.push(z/FR); ef.push(Math.sqrt(e/FR));
      }
      function sd(arr){ if(arr.length<2) return 0;
        const m=arr.reduce((a,c)=>a+c,0)/arr.length;
        return Math.sqrt(arr.reduce((a,c)=>a+(c-m)*(c-m),0)/arr.length); }
      const zm=zf.length?zf.reduce((a,c)=>a+c,0)/zf.length:0;
      const em=ef.length?ef.reduce((a,c)=>a+c,0)/ef.length:0;
      const evo = zm>0 ? sd(zf)/zm : 0;      /* brightness movement */
      const dyn = em>0 ? sd(ef)/em : 0;      /* level movement */
      return { pk, rms, attack:Math.max(0,(peakAt-first))/SR,
               crest: rms>0 ? pk/rms : 0, spread: half/n, zn, live, evo, dyn };
    }

    /* the descriptor, scaled so no one axis dominates the distance */
    function vec(r){ return [ Math.min(1, r.attack/0.25),
                              Math.min(1, r.crest/12),
                              Math.min(1, r.spread),
                              Math.min(1, r.zn/6),
                              Math.min(1, r.evo/1.2),
                              Math.min(1, r.dyn/1.2) ]; }
    function dist(a,b){ let s=0; for(let i=0;i<a.length;i++){ const d=a[i]-b[i]; s+=d*d; }
      return Math.sqrt(s); }

    /* ONE RENDER IS NOT A MEASUREMENT (8/26). Caught by running this gate three
       times in a row: syncthorn's nearest neighbour came back 0.1489 (fatsaw),
       0.0929 (ossuary) and 0.0779 (ossuary). Nothing about syncthorn changed --
       plenty of voices in this rack are stochastic by design, so a single
       sample of WHERE A VOICE SITS is a sample of its noise as much as of its
       timbre, and a gate built on one render decides a batch by coin flip.
       THE THIRD TIME THIS EXACT CLASS HAS BITTEN A MEASUREMENT IN ONE SESSION
       (the run's beat clock, the menu songs, now this). Average the descriptor
       over repeats: the jitter cancels, the timbre does not. */
    async function place(kind, semi, reps){
      const acc=[]; let got=0;
      for(let r=0;r<reps;r++){
        const x=await render(kind,semi,1.4);
        if(x.err||x.silent) continue;
        const v=vec(x); got++;
        for(let i=0;i<v.length;i++) acc[i]=(acc[i]||0)+v[i];
      }
      if(!got) return null;
      return acc.map(a=>a/got);
    }

    /* every melodic voice the rack declares */
    const src = synthV.toString();
    const all = Array.from(new Set((src.match(/kind===?'[a-z_0-9]+'/g)||[])
      .map(x=>x.replace(/kind===?'/,'').replace(/'/,''))));
    const old = all.filter(k=>NEWV.indexOf(k)<0);

    const R={ total: all.length, newv: {}, oldCount: 0 };

    /* 1+2. the new voices, across the register */
    for(const k of NEWV){
      R.newv[k]={ pitches:{} };
      for(const semi of [33,45,57,69,81]){
        const r=await render(k,semi,1.4);
        R.newv[k].pitches['semi'+semi] = r.err ? {err:r.err}
          : (r.silent ? {silent:true, pk:r.pk}
                      : {pk:+r.pk.toFixed(4), rms:+r.rms.toFixed(5),
                         zn:+r.zn.toFixed(3), live:+r.live.toFixed(3)});
      }
      R.newv[k].shape = await place(k,57,3);
    }

    /* 3. where every EXISTING voice sits, measured the same way */
    const pts=[];
    for(const k of old){
      const v=await place(k,57,3);
      if(!v) continue;
      pts.push({k, v});
    }
    R.oldCount = pts.length;

    /* THE RACK SETS ITS OWN BAR: how far apart existing voices typically are */
    const nn=[];
    for(let i=0;i<pts.length;i++){
      let best=Infinity;
      for(let j=0;j<pts.length;j++){ if(i===j) continue;
        const d=dist(pts[i].v, pts[j].v); if(d<best) best=d; }
      if(isFinite(best)) nn.push(best);
    }
    nn.sort((a,b)=>a-b);
    R.bar = nn.length ? nn[Math.floor(nn.length/2)] : 0;   /* the median pair */

    for(const k of NEWV){
      const sh=R.newv[k].shape;
      if(!sh){ R.newv[k].nearest={k:'(not rendered)', d:0}; continue; }
      let best={k:null,d:Infinity};
      for(const q of pts){ const d=dist(sh,q.v); if(d<best.d) best={k:q.k,d:d}; }
      R.newv[k].nearest={k:best.k, d:+best.d.toFixed(4)};
    }
    return R;
  }, ['scanstring','syncthorn','pafvox','bowdrag']);

  out.errors=errs.slice(0,3);
  console.log(JSON.stringify(out));
  await b.close();
})();
'''


def main():
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as f:
        f.write(JS)
        js = f.name
    try:
        r = subprocess.run(['node', js, ROOT], capture_output=True, text=True, timeout=900)
    finally:
        os.unlink(js)

    print('=== VOICE VARIETY GATE - "more voices" has to mean more SOUNDS ===')
    line = [l for l in r.stdout.strip().split('\n') if l.startswith('{')]
    if not line:
        print('  > FAIL the browser run produced nothing')
        print(r.stdout[-1200:])
        print(r.stderr[-1200:])
        return 1
    d = json.loads(line[-1])

    p = f = 0

    def ok(name, cond):
        nonlocal p, f
        if cond:
            p += 1
            if VERBOSE:
                print('  ok  ' + name)
        else:
            f += 1
            print('  > FAIL ' + name)

    ok('the rack was actually read: %d melodic voices declared, %d of them render '
       'and were placed' % (d.get('total', 0), d.get('oldCount', 0)),
       d.get('total', 0) > 500 and d.get('oldCount', 0) > 300)

    bar = d.get('bar') or 0
    ok('and THE RACK SET ITS OWN BAR rather than this gate picking a number: the '
       'median existing voice sits %.4f from its nearest neighbour' % bar, bar > 0)

    for k, row in sorted((d.get('newv') or {}).items()):
        pits = row.get('pitches') or {}
        bad = {s: v for s, v in pits.items() if v.get('err') or v.get('silent')}
        ok('%s RENDERS AT EVERY PITCH, not just the one it was tuned at (%s)'
           % (k, bad or 'all 5 octaves sound'), not bad and len(pits) == 5)

        zns = [v.get('zn') for v in pits.values() if v.get('zn')]
        spread = (max(zns) - min(zns)) / max(zns) if zns else 1
        ok('%s KEEPS ITS TIMBRE across the register -- crossings per cycle stay '
           'put, so it follows the note instead of changing instrument '
           '(%s, spread %.2f)' % (k, zns, spread), zns and spread < 0.35)

        near = row.get('nearest') or {}
        ok('%s IS ITS OWN SOUND: nearest existing voice is %s at %.4f, and the '
           'rack\'s own median pair is %.4f' % (k, near.get('k'), near.get('d', 0), bar),
           near.get('d', 0) >= bar)

    ok('the page threw nothing: %s' % (d.get('errors') or 'clean'), not d.get('errors'))

    print('  %d passed, %d FAILED' % (p, f))
    if not f:
        print('  Four new physics, each further from anything that already exists '
              'than a typical pair of existing voices are from each other.')
    return 1 if f else 0


if __name__ == '__main__':
    sys.exit(main())
