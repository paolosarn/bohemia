#!/usr/bin/env python3
"""
WHERE HIS TASTE ACTUALLY LIVES (8/27/26) - the post-mortem measurement for
batch 25, which he swept 0 for 8: "I didn't like any of the new shit that you
made."

REUSE CHECK: cooks nothing. No bank, no candidate, no pixel, no voice. It reads
the songs he has already ruled CANON, renders the voices those songs actually
use, and asks one question that should have been asked BEFORE batch 25 was
written.

THE SUSPICION THIS EXISTS TO TEST, and it is a suspicion about my own work.
Batch 25 was chosen by asking "what physics is MISSING from the rack", and then
gates/voice_variety_gate.py was built to prove each new voice sat FURTHER from
its nearest existing neighbour than a typical pair of existing voices sit from
each other. When two of the four failed that bar, I made them more extreme until
they passed, and I was pleased about it.

BUT THE EXISTING VOICES ARE THE ONES HE APPROVED. A metric that rewards distance
from every voice he has ever kept is a metric that walks AWAY from his taste, and
the harder a batch passes it the further it has walked. If that is true, batch 25
did not fail despite the gate. It failed BECAUSE of it.

WHAT THIS MEASURES:
  1. Which voices his 100+ CANON songs actually use as leads. Usage is a
     stronger signal than any list, because a song he ruled CANON is a voice he
     chose to keep hearing.
  2. Where those voices sit in the SAME six-axis shape space the variety gate
     used, so the two numbers are comparable and neither can be reframed later.
  3. Where the four dead voices sat relative to that region.
  4. And, for the next batch, WHICH LIVE VOICES ARE NEAREST HIS CENTRE and which
     approved regions are thinly populated -- the opposite question to the one
     batch 25 asked.

EVERY VOICE IS PLACED BY THE AVERAGE OF THREE RENDERS. Measured 8/26: this rack
is full of stochastic voices, and a single render samples a voice's noise as much
as its timbre (one voice moved 0.1489 / 0.0929 / 0.0779 across three identical
runs). One render is not a measurement.

  python3 tools/bohemia_where_his_taste_lives.py           # print
  python3 tools/bohemia_where_his_taste_lives.py --write   # write the record
"""
import json
import os
import re
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'records/BOHEMIA_WHERE_HIS_TASTE_LIVES_8_27_26.json')

DEAD25 = ['scanstring', 'syncthorn', 'pafvox', 'bowdrag']

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

  const out=await p.evaluate(async(DEAD)=>{
    const SR=22050, hzOf=s=>440*Math.pow(2,(s-69)/12);
    /* the SAME descriptor the variety gate used, so the two numbers are
       comparable and neither can be quietly reframed later */
    async function render(kind, semi, secs){
      const OAC=new OfflineAudioContext(1,Math.ceil(SR*secs),SR);
      const mast=OAC.createGain(); mast.gain.value=1; mast.connect(OAC.destination);
      try{ synthV(kind,OAC,mast,hzOf,0.25,semi,0.02,0.5); }catch(e){ return null; }
      const buf=await OAC.startRendering(), d=buf.getChannelData(0), n=d.length;
      let pk=0,sq=0,zc=0;
      for(let i=0;i<n;i++){ const v=d[i]; if(!isFinite(v)) return null;
        const m=v<0?-v:v; if(m>pk)pk=m; sq+=v*v;
        if(i&&((d[i]>=0)!==(d[i-1]>=0))) zc++; }
      if(pk<1e-5) return null;
      const rms=Math.sqrt(sq/n), thr=Math.max(pk*0.05,1e-6);
      let first=-1,peakAt=0;
      for(let i=0;i<n;i++){ const m=Math.abs(d[i]);
        if(first<0&&m>thr) first=i; if(m>=pk-1e-9){ peakAt=i; break; } }
      if(first<0) first=0;
      let acc=0,half=0; const tot=sq||1;
      for(let i=0;i<n;i++){ acc+=d[i]*d[i]; if(acc>=tot*0.5){ half=i; break; } }
      let last=first;
      for(let i=n-1;i>first;i--){ if(Math.abs(d[i])>thr){ last=i; break; } }
      const live=Math.max(1,(last-first))/SR;
      const zn=zc/Math.max(1,2*hzOf(semi)*live);
      const FR=Math.max(64,Math.floor(SR*0.02)); const zf=[],ef=[];
      for(let a=first;a+FR<=last;a+=FR){ let z=0,e=0;
        for(let i=a+1;i<a+FR;i++){ e+=d[i]*d[i]; if((d[i]>=0)!==(d[i-1]>=0)) z++; }
        zf.push(z/FR); ef.push(Math.sqrt(e/FR)); }
      const mean=a=>a.length?a.reduce((x,c)=>x+c,0)/a.length:0;
      const sd=a=>{ if(a.length<2) return 0; const m=mean(a);
        return Math.sqrt(a.reduce((x,c)=>x+(c-m)*(c-m),0)/a.length); };
      const zm=mean(zf), em=mean(ef);
      return [ Math.min(1,Math.max(0,(peakAt-first))/SR/0.25),
               Math.min(1,(rms>0?pk/rms:0)/12),
               Math.min(1,half/n),
               Math.min(1,zn/6),
               Math.min(1,(zm>0?sd(zf)/zm:0)/1.2),
               Math.min(1,(em>0?sd(ef)/em:0)/1.2) ];
    }
    async function place(kind,reps){
      const acc=[]; let got=0;
      for(let r=0;r<reps;r++){ const v=await render(kind,57,1.4);
        if(!v) continue; got++; for(let i=0;i<v.length;i++) acc[i]=(acc[i]||0)+v[i]; }
      return got? acc.map(a=>a/got) : null;
    }
    const dist=(a,b)=>{ let s=0; for(let i=0;i<a.length;i++){const d=a[i]-b[i]; s+=d*d;} return Math.sqrt(s); };

    /* WHICH VOICES HIS CANON SONGS ACTUALLY USE. Usage, not a list: a song he
       ruled CANON is a voice he chose to keep hearing. */
    const canon=new Set();
    for(const k in CANON_DEFAULTS){ if(CANON_DEFAULTS[k]>=1) canon.add(k.replace(/#\d+$/,'')); }
    const lead={}, allUsed={};
    for(const s of MLOOPS){
      if(!canon.has(s.n)) continue;
      const l=s.inst&&s.inst.l, bs=s.inst&&s.inst.b, am=s.am;
      if(l){ lead[l]=(lead[l]||0)+1; allUsed[l]=1; }
      if(bs) allUsed[bs]=1;
      if(am) allUsed[am]=1;
    }
    const R={ canonSongs:canon.size, leadVoices:Object.keys(lead).length,
              leadUse:lead, pts:{}, dead:{} };

    /* place every lead he keeps */
    const keys=Object.keys(lead);
    for(const k of keys){ const v=await place(k,3); if(v) R.pts[k]=v; }
    /* and the four he just swept */
    for(const k of DEAD){ const v=await place(k,3); if(v) R.dead[k]=v; }

    /* HIS CENTRE, and how tight the region is */
    const P=Object.values(R.pts);
    if(P.length){
      const c=P[0].map((_,i)=>P.reduce((a,q)=>a+q[i],0)/P.length);
      R.centre=c;
      const ds=P.map(q=>dist(q,c)).sort((a,b)=>a-b);
      R.radiusMedian=ds[Math.floor(ds.length/2)];
      R.radiusP90=ds[Math.floor(ds.length*0.9)];
      R.deadFromCentre={};
      for(const k in R.dead) R.deadFromCentre[k]=+dist(R.dead[k],c).toFixed(4);
      /* and how far a TYPICAL approved lead is, for the comparison to mean
         anything */
      R.approvedMedianFromCentre=+ds[Math.floor(ds.length/2)].toFixed(4);
      R.approvedMaxFromCentre=+ds[ds.length-1].toFixed(4);
      /* which approved leads are nearest his centre -- the shortlist a next
         batch should be listening to, rather than the far corners */
      const near=keys.filter(k=>R.pts[k]).map(k=>({k, d:+dist(R.pts[k],c).toFixed(4),
        used:lead[k]})).sort((a,b)=>a.d-b.d);
      R.nearestHisCentre=near.slice(0,12);
      R.farthest=near.slice(-6);
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
    line = [l for l in r.stdout.strip().split('\n') if l.startswith('{')]
    if not line:
        print('the browser run produced nothing')
        print(r.stdout[-900:])
        print(r.stderr[-900:])
        return 1
    d = json.loads(line[-1])

    print('=== WHERE HIS TASTE ACTUALLY LIVES ===')
    print('  songs he has ruled CANON            : %d' % d.get('canonSongs', 0))
    print('  distinct LEAD voices those songs use: %d' % d.get('leadVoices', 0))
    print('  of those, renderable and placed     : %d' % len(d.get('pts') or {}))
    print()
    med = d.get('approvedMedianFromCentre')
    mx = d.get('approvedMaxFromCentre')
    print('  HIS REGION, measured on the same six axes the variety gate used:')
    print('    a typical approved lead sits %s from the centre of his taste' % med)
    print('    the farthest approved lead sits %s' % mx)
    print()
    print('  THE FOUR HE JUST SWEPT, same axes, same centre:')
    dc = d.get('deadFromCentre') or {}
    for k in sorted(dc, key=lambda x: dc[x]):
        flag = '  <-- OUTSIDE every lead he has ever kept' if mx and dc[k] > mx else ''
        print('    %-12s %s%s' % (k, dc[k], flag))
    out_n = sum(1 for k in dc if mx and dc[k] > mx)
    print()
    print('  VERDICT ON THE METHOD: %d of %d sat further from his centre than the '
          'farthest voice he has ever approved.' % (out_n, len(dc)))
    if out_n:
        print('  The variety gate rewarded exactly that, and I tuned two of them '
              'harder until they cleared it.')
    print()
    print('  NEAREST HIS CENTRE (what a next batch should be listening to):')
    for row in (d.get('nearestHisCentre') or [])[:10]:
        print('    %-16s %s   used as a lead in %d canon song(s)'
              % (row['k'], row['d'], row['used']))

    if '--write' not in sys.argv:
        print('\n(--write to bake the record)')
        return 0
    json.dump(d, open(OUT, 'w', encoding='utf8'), indent=1, sort_keys=True)
    print('\n  wrote %s' % os.path.relpath(OUT, ROOT))
    return 0


if __name__ == '__main__':
    sys.exit(main())
