#!/usr/bin/env python3
"""
SFX ENVELOPE GATE (8/12/26) - the new sounds are built out of what he approved,
and the law stays tied to his thumbs instead of to a paragraph somebody wrote.

Paolo 8/11: "we may need way more voices and way more sounds for the whole game."
The voices lane answered that by casting from an ENVELOPE derived from his six
approved voices. Sounds get the same treatment: before a single recipe in BATCH
SFX-03 was written, all 140 thumbs in records/BOHEMIA_SFX_VERDICT_*.txt were
joined against the cooked vectors and measured.

WHAT THE MEASUREMENT SAID (62 UP / 78 DOWN):
  MATERIAL IS THE VERDICT.  glass 100%, crystal 53%, stone 50%, bell 50%,
  choir 50%, ash 43%  --  and metal 20%, wood 33%, water 20%, which is
  9 UP / 26 DOWN across 35 separate judgements. That independently reproduces
  the 7/30 door post-mortem out of data the post-mortem never looked at.
  HE KILLS SOUNDS THAT ARE PUSHED.  mkup is the strongest continuous separator
  in the whole set (UP 0.92 / DOWN 1.28, effect -1.17); drive is second
  (UP 0.16 / DOWN 0.30, -0.62). Nothing else clears 0.45. That is his v1
  complaint -- "it sounds like it was made with some software from 2006" --
  restated as a number.

WHAT IT DID NOT SAY, and this gate refuses to pretend otherwise: WITHIN one
event's five candidates no parameter has a clean direction (8 events split, best
knob 5/7). Which cousin he wants is taste. The envelope picks the FAMILY; he
still picks the sound. A gate that claimed more than the data supports would be
the exact failure the craft law names -- fix the ruler, never the target.

THE ORDER OF AUTHORITY IS ALSO CHECKED, NOT ASSUMED. Checks 1-3 RE-DERIVE the
envelope from the verdict files every run. If Paolo's future thumbs flip the
direction, this gate goes red and the LAW gets rewritten from his data -- the
gate never outranks the ruling, it reads it.
"""
import json
import os
import re
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RECDIR = os.path.join(ROOT, 'records')

# The derivation runs in node against the SHIPPED engine, not a copy of its
# numbers: the whole point is that the law and the sounds come from one body.
DERIVE = r'''
const fs=require('fs'), path=require('path');
const ROOT=process.argv[2];
const S=require(path.join(ROOT,'engine','bohemia_sfx.js'));
const RECDIR=path.join(ROOT,'records'), V={};
for(const f of fs.readdirSync(RECDIR).filter(x=>/^BOHEMIA_SFX_VERDICT_.*\.txt$/.test(x)).sort())
  for(const line of fs.readFileSync(path.join(RECDIR,f),'utf8').split('\n')){
    const m=line.match(/^\s*(UP|DOWN)\s+([a-z_0-9]+\.\d+)\s*$/);
    if(m) V[m[2]] = m[1]==='UP' ? 1 : -1;      /* a later file overrides an earlier one */
  }
const cand={};
for(const E of S.EVENTS) for(const c of S.cook(E.ev,5)) cand[c.id]=c;
const up=[],down=[],orphan=[];
for(const id in V){ if(!cand[id]){ orphan.push(id); continue; }
  (V[id]===1?up:down).push(cand[id]); }
const mean=(a,k)=>a.reduce((x,y)=>x+ +y[k],0)/(a.length||1);
const mat={};
for(const c of up){ (mat[c.mat]=mat[c.mat]||[0,0])[0]++; }
for(const c of down){ (mat[c.mat]=mat[c.mat]||[0,0])[1]++; }
const rate={}; for(const m in mat) rate[m]=mat[m][0]/(mat[m][0]+mat[m][1]);

/* THE BATCH ITSELF, read off the shipped recipes. A jitter range that climbs
   out of the envelope is the same violation as a base that does -- the sound he
   would actually hear is the jittered one. */
const E=S.ENVELOPE, batch={};
for(const ev of E.batch){
  const r=S.RECIPE[ev];
  if(!r){ batch[ev]={missing:true}; continue; }
  const jitTop=k => (r.jit && r.jit[k]) ? Math.max(r.jit[k][0],r.jit[k][1]) : null;
  const c1=S.cook(ev,5), c2=S.cook(ev,5);
  batch[ev]={
    mat:r.base.mat, mkup:r.base.mkup, drive:r.base.drive,
    jitMkup:jitTop('mkup'), jitDrive:jitTop('drive'),
    n:c1.length,
    invalid:c1.reduce((a,v)=>a+(S.validate(v).length?1:0),0),
    distinct:new Set(c1.map(v=>JSON.stringify(v))).size,
    deterministic:JSON.stringify(c1)===JSON.stringify(c2),
    maxCookMkup:Math.max.apply(null,c1.map(v=>v.mkup)),
    maxCookDrive:Math.max.apply(null,c1.map(v=>v.drive)),
    mats:Array.from(new Set(c1.map(v=>v.mat)))
  };
}
console.log(JSON.stringify({
  judged:Object.keys(V).length, orphan:orphan.slice(0,5), orphanN:orphan.length,
  up:up.length, down:down.length,
  upMkup:mean(up,'mkup'), dnMkup:mean(down,'mkup'),
  upDrive:mean(up,'drive'), dnDrive:mean(down,'drive'),
  rate:rate, counts:mat,
  env:E, batch:batch,
  events:S.EVENTS.length, recipes:Object.keys(S.RECIPE).length
}));
'''

# THE SURFACE LEG. Everything above reads the engine file. This one loads the
# alpha he actually taps and asks the SHIPPED copy the same questions, because
# an engine edited but never re-inlined is a build where none of this is true.
SURFACE = r'''
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
    const E=BOH_SFX.ENVELOPE;
    if(!E) return {fatal:'the shipped alpha carries an engine with no ENVELOPE'};
    const r={events:BOH_SFX.EVENTS.length, batch:E.batch.length};
    r.allListed = E.batch.every(ev=>BOH_SFX.EVENTS.some(x=>x.ev===ev));
    r.allCook   = E.batch.every(ev=>BOH_SFX.cook(ev,5).length===5);
    /* EVERY NEW MOMENT HAS A LABEL AND A WHY. A row he cannot read is a row he
       cannot judge, and an unjudgeable sound may as well not have been cooked. */
    r.allLabelled = E.batch.every(ev=>{ const x=BOH_SFX.EVENTS.find(y=>y.ev===ev);
      return x && x.label && x.label.length>3 && x.why && x.why.length>18; });
    /* NOT BANKED. He has not thumbed one of these, and unjudged is silent -- that
       is the mechanism-mine/contents-his line, checked rather than trusted. */
    const A=window.__SFX_APPROVED||{};
    r.banked=E.batch.filter(ev=>A[ev]&&A[ev].length);
    /* AUDIBLE ON THE REAL RENDER PATH. Offline, through BOH_SFX.render itself,
       one candidate per new moment. A recipe that cooks clean and renders
       silence is the failure this catches. */
    const SR=44100; r.silent=[]; r.peaks={};
    for(const ev of E.batch){
      const v=BOH_SFX.cook(ev,5)[0];
      const secs=BOH_SFX.beatsOf(v)*BOH_SFX.BEAT+0.4;
      const OAC=new OfflineAudioContext(2,Math.ceil(SR*secs),SR);
      const bus=OAC.createGain(); bus.gain.value=1; bus.connect(OAC.destination);
      BOH_SFX.render(v,OAC,bus,0.05);
      const buf=await OAC.startRendering();
      const L=buf.getChannelData(0),R=buf.getChannelData(1);
      let pk=0; for(let i=0;i<L.length;i++){ const a=Math.max(Math.abs(L[i]),Math.abs(R[i])); if(a>pk)pk=a; }
      r.peaks[ev]=+pk.toFixed(5);
      if(pk<0.002) r.silent.push(ev);
    }
    return r;
  });
  out.errors=errs.slice(0,3);
  console.log(JSON.stringify(out));
  await b.close();
})();
'''


def run(js, timeout):
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as fh:
        fh.write(js)
        f = fh.name
    try:
        r = subprocess.run(['node', f, ROOT], capture_output=True, text=True, timeout=timeout)
    finally:
        os.unlink(f)
    line = [x for x in r.stdout.strip().split('\n') if x.startswith('{')]
    if not line:
        print('  > node produced nothing:\n' + (r.stderr or '')[-1200:])
        return None
    return json.loads(line[-1])


def main():
    print('=== SFX ENVELOPE GATE - the new sounds come out of his 140 thumbs ===')
    p = f = 0

    def ok(name, cond):
        nonlocal p, f
        if cond:
            p += 1
        else:
            f += 1
            print('  > FAIL ' + name)

    d = run(DERIVE, 180)
    if d is None:
        print('  0 passed, 1 FAILED (the derivation could not run)')
        return 1

    # ---- 1. THE DERIVATION STILL RUNS AGAINST HIS REAL THUMBS ---------------
    ok('his verdict files are still readable and still join to cooked sounds '
       '(%d judged, %d orphan)' % (d['judged'], d['orphanN']),
       d['judged'] >= 140 and d['orphanN'] == 0)
    ok('the judged set is still split enough to learn from (%d UP / %d DOWN)'
       % (d['up'], d['down']), d['up'] >= 40 and d['down'] >= 40)

    # ---- 2. THE TWO DIRECTIONS THE DATA GAVE -------------------------------
    # These are the LAW being re-derived, not re-asserted. If his future thumbs
    # reverse either one, this goes red and the recipes get rebuilt from the
    # new data. The ruling is upstream of the gate, always.
    ok('QUIETER STILL WINS: approved mkup %.2f is below rejected %.2f'
       % (d['upMkup'], d['dnMkup']), d['upMkup'] < d['dnMkup'])
    ok('CLEANER STILL WINS: approved drive %.2f is below rejected %.2f'
       % (d['upDrive'], d['dnDrive']), d['upDrive'] < d['dnDrive'])
    env = d['env']
    ok('the shipped mkup cap %.2f sits between what he keeps and what he kills'
       % env['maxMkup'], d['upMkup'] <= env['maxMkup'] <= d['dnMkup'] * 1.05)
    ok('the shipped drive cap %.2f sits between what he keeps and what he kills'
       % env['maxDrive'], d['upDrive'] <= env['maxDrive'] <= d['dnDrive'] * 1.05)

    # ---- 3. THE MATERIAL SPLIT IS STILL WHERE THE LAW SAYS ------------------
    rate, counts = d['rate'], d['counts']
    for m in env['losers']:
        got = rate.get(m)
        ok('%s is still a losing material (%s UP / %s DOWN)'
           % (m, counts.get(m, [0, 0])[0], counts.get(m, [0, 0])[1]),
           got is not None and got < 0.40)
    for m in env['winners']:
        got = rate.get(m)
        ok('%s still earns its place (%s UP / %s DOWN)'
           % (m, counts.get(m, [0, 0])[0], counts.get(m, [0, 0])[1]),
           got is not None and got >= 0.40)
    lw = sum(counts.get(m, [0, 0])[0] for m in env['losers'])
    ld = sum(counts.get(m, [0, 0])[1] for m in env['losers'])
    ok('metal + wood + water together are still the dead end (%d UP / %d DOWN)'
       % (lw, ld), ld >= lw * 2)

    # ---- 4. EVERY RECIPE IN THE BATCH OBEYS IT -----------------------------
    B = d['batch']
    ok('all %d moments in the batch have a recipe' % len(env['batch']),
       all(not B[e].get('missing') for e in env['batch']))
    for ev in env['batch']:
        b = B[ev]
        if b.get('missing'):
            continue
        ok('%s: makeup gain stays inside the envelope (%.2f, jitter to %s)'
           % (ev, b['mkup'], b['jitMkup']),
           b['maxCookMkup'] <= env['maxMkup'] + 1e-9)
        ok('%s: drive stays inside the envelope (%.2f, jitter to %s)'
           % (ev, b['drive'], b['jitDrive']),
           b['maxCookDrive'] <= env['maxDrive'] + 1e-9)
        if b['mat'] in env['losers']:
            # A LOSING MATERIAL NEEDS A REASON ON THE RECORD, not permission.
            ok('%s uses %s and says in the engine why the object has to be that '
               '("%s")' % (ev, b['mat'], env['loserOK'].get(ev, '')),
               ev in env['loserOK'] and len(env['loserOK'][ev]) > 8)
        ok('%s cooks five distinct candidates that all validate' % ev,
           b['n'] == 5 and b['distinct'] == 5 and b['invalid'] == 0)
        ok('%s cooks the same five every time (seeded, so a thumb keeps meaning '
           'the sound he heard)' % ev, b['deterministic'])
        ok('%s does not drift material across its own candidates' % ev,
           len(b['mats']) == 1)

    # ---- 5. THE BATCH ACTUALLY GREW THE GAME -------------------------------
    ok('the game has far more moments than the demo set (%d, was 28)'
       % d['events'], d['events'] >= 54)
    ok('every event still has a recipe behind it (%d events, %d recipes)'
       % (d['events'], d['recipes']), d['events'] == d['recipes'])

    # ---- 6. AND IT IS TRUE ON THE SURFACE HE TAPS --------------------------
    s = run(SURFACE, 420)
    if s is None or s.get('fatal'):
        ok('the shipped alpha carries this engine (%s)'
           % ((s or {}).get('fatal') or 'the surface leg could not run'), False)
    else:
        ok('the shipped alpha carries the same %d moments as the engine file'
           % s['events'], s['events'] == d['events'])
        ok('all %d new moments are listed on the surface' % s['batch'], s['allListed'])
        ok('all %d new moments cook on the surface' % s['batch'], s['allCook'])
        ok('every new moment tells him what it is and why it matters', s['allLabelled'])
        ok('nothing new is banked yet -- unjudged is silent, and that is his call '
           'to make (%s)' % (', '.join(s['banked']) or 'none banked'),
           not s['banked'])
        ok('EVERY NEW SOUND ACTUALLY MAKES SOUND on the real render path (%s)'
           % (', '.join(s['silent']) or 'none silent'), not s['silent'])
        ok('the page threw nothing: %s' % (s.get('errors') or 'clean'),
           not s.get('errors'))

    print('  %d passed, %d FAILED' % (p, f))
    if not f:
        print('  %d new game moments, every one built inside what his 140 thumbs '
              'said he keeps.' % len(env['batch']))
    return 1 if f else 0


if __name__ == '__main__':
    sys.exit(main())
