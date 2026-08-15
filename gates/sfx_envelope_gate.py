#!/usr/bin/env python3
"""
SFX ENVELOPE GATE (8/12/26) - the new sounds stay inside what he approved, and
the LAW stays tied to his thumbs instead of to a paragraph somebody wrote.

THIS GATE ALREADY DID ITS JOB ONCE, AND IT COST ME MY OWN FINDING.

Built in the morning off 140 verdicts, it asserted two things: MATERIAL IS THE
VERDICT (glass 100%, metal 20%, wood 33%, water 20%) and HE KILLS SOUNDS THAT
ARE PUSHED (makeup gain effect -1.17, drive -0.62). Both were re-derived from
his verdict files on every run rather than pasted in, specifically so his data
would stay upstream of the law. Hours later Paolo judged all 270 and the
re-derivation went RED:

    material   140 thumbs        270 thumbs
    water      1 UP / 4  (20%)   6 UP / 4   (60%)   <- best in the game now
    glass      5 UP / 0  (100%)  8 UP / 12  (40%)
    ash       13 UP / 17 (43%)  16 UP / 44  (27%)   <- near worst now
    metal      3 UP / 12 (20%)   3 UP / 22  (12%)   <- the ONE that held

Glass was five samples. Water was five samples. Every material ranking except
metal was small-sample noise that read like a finding. The knobs went the same
way: mkup -1.17 -> -0.36, drive -0.62 -> -0.23, and the approved and rejected
medians now nearly touch (0.880 vs 0.900).

The right move when a gate goes red on new data from the person whose taste it
encodes is to REWRITE THE LAW, never to loosen the check until the old claim
fits. So this gate now asserts only what 270 judgements support:

  1. METAL IS DEAD -- 3 UP / 22 DOWN, consistent across both sweeps, and both
     metal moments in the new batch died whole. No new recipe cooks from it.
  2. CONTAINMENT, NOT DIRECTION -- nothing predicts WHICH of five cousins he
     wants, so the gate stops pretending. It checks that every new candidate
     lands inside REGION, the bounding box of all 97 candidates he has ever
     approved. A coverage claim the data supports, instead of a taste claim it
     does not.
  3. The surviving weak direction is REPORTED and asserted only as a SIGN
     (approved mkup below rejected mkup). Never as a cap: a cap tight enough to
     mean anything would be red on sounds HE APPROVED, and a gate that outranks
     a ruling is the failure this lane already has a law about.
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

/* THE BATCH ITSELF, read off the SHIPPED recipes. Every candidate is checked
   against REGION, not the base recipe: the sound he would actually hear is the
   jittered one, so a jitter range that walks out of the approved box is exactly
   as much a violation as a base that starts outside it. */
/* THE LIST THE GATE WALKS IS batch UNION regionBinds, AND THAT UNION IS A
   BUG FIX (8/15). regionBinds shipped on 8/12 as the forward-binding list and
   every event on it is by definition NOT in `batch` -- batch is the 8/12 cook.
   So the loop below built rows only for batch, main() looked up B[ev] for each
   bound event, got undefined, read `undefined.outsideN` as falsy and PRINTED
   "all inside" for all seven. A pass that measured nothing, worded like a pass
   that measured everything. A CHECKER THAT CANNOT TELL A MENTION FROM A USE IS
   THE BROKEN ONE (8/1 craft law), and this was one. */
const E=S.ENVELOPE;
const WALK=E.batch.concat((E.regionBinds||[]).filter(x=>E.batch.indexOf(x)<0));
const batch={};
for(const ev of WALK){
  const r=S.RECIPE[ev];
  if(!r){ batch[ev]={missing:true}; continue; }
  const c1=S.cook(ev,5), c2=S.cook(ev,5);
  const outside=[];
  for(const v of c1) for(const k in E.REGION){
    const lo=E.REGION[k][0], hi=E.REGION[k][1], x=+v[k];
    if(x < lo-1e-6 || x > hi+1e-6) outside.push(v.id+'.'+k+'='+(+x.toFixed(3)));
  }
  batch[ev]={
    mat:r.base.mat, n:c1.length,
    invalid:c1.reduce((a,v)=>a+(S.validate(v).length?1:0),0),
    distinct:new Set(c1.map(v=>JSON.stringify(v))).size,
    deterministic:JSON.stringify(c1)===JSON.stringify(c2),
    mats:Array.from(new Set(c1.map(v=>v.mat))),
    outside:outside.slice(0,4), outsideN:outside.length,
    up:c1.reduce((a,v)=>a+(V[v.id]===1?1:0),0),
    judged:c1.reduce((a,v)=>a+(V[v.id]!==undefined?1:0),0)
  };
}
/* THE REGION MUST BE THE REAL ONE. If the shipped box is not the bounding box
   of his approvals it is a number somebody typed, which is the whole thing this
   gate exists to prevent. */
const realBox={}, boxOff=[];
for(const k in E.REGION){
  const v=up.map(x=>+x[k]);
  realBox[k]=[Math.min.apply(null,v),Math.max.apply(null,v)];
  if(Math.abs(realBox[k][0]-E.REGION[k][0])>0.01 || Math.abs(realBox[k][1]-E.REGION[k][1])>0.01)
    boxOff.push(k+': shipped ['+E.REGION[k]+'] vs measured ['+realBox[k].map(n=>+n.toFixed(3))+']');
}
console.log(JSON.stringify({
  judged:Object.keys(V).length, orphan:orphan.slice(0,5), orphanN:orphan.length,
  up:up.length, down:down.length,
  upMkup:mean(up,'mkup'), dnMkup:mean(down,'mkup'),
  upDrive:mean(up,'drive'), dnDrive:mean(down,'drive'),
  rate:rate, counts:mat, boxOff:boxOff,
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
    /* SAME UNION AS THE DERIVATION (8/15). The surface leg had the identical
       hole: it proved the 8/12 batch was listed, cooked, labelled and audible
       and said nothing at all about the seven moments added since. */
    const W=E.batch.concat((E.regionBinds||[]).filter(x=>E.batch.indexOf(x)<0));
    const r={events:BOH_SFX.EVENTS.length, batch:W.length};
    r.allListed = W.every(ev=>BOH_SFX.EVENTS.some(x=>x.ev===ev));
    r.allCook   = W.every(ev=>BOH_SFX.cook(ev,5).length===5);
    /* EVERY NEW MOMENT HAS A LABEL AND A WHY. A row he cannot read is a row he
       cannot judge, and an unjudgeable sound may as well not have been cooked. */
    r.allLabelled = W.every(ev=>{ const x=BOH_SFX.EVENTS.find(y=>y.ev===ev);
      return x && x.label && x.label.length>3 && x.why && x.why.length>18; });
    /* HIS 8/12 THUMBS REACHED THE TABLE THE GAME READS. This check was the
       opposite way round this morning -- nothing may be banked, because he had
       not judged them. He judged all 26 the same day, so the defect flipped
       from "banked without a verdict" to APPROVED-BUT-UNUSED, which is this
       lane's own law: 14 of the 26 moments have a sound he chose and every one
       of them has to be in the table playSFX consults. */
    const A=window.__SFX_APPROVED||{};
    r.banked=W.filter(ev=>A[ev]&&A[ev].length);
    /* AUDIBLE ON THE REAL RENDER PATH. Offline, through BOH_SFX.render itself,
       one candidate per new moment. A recipe that cooks clean and renders
       silence is the failure this catches. */
    const SR=44100; r.silent=[]; r.peaks={};
    for(const ev of W){
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
    print('=== SFX ENVELOPE GATE - what 365 of his thumbs actually support ===')
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

    # ---- 2. THE ONE DIRECTION THAT SURVIVED 270 --------------------------
    # Asserted as a SIGN, never as a cap. At 140 thumbs makeup gain looked
    # decisive (-1.17); at 270 it is -0.36 and the medians nearly touch. A cap
    # tight enough to mean anything would be red on sounds HE APPROVED.
    env = d['env']
    ok('QUIETER STILL WINS, WEAKLY: approved mkup %.3f is below rejected %.3f'
       % (d['upMkup'], d['dnMkup']), d['upMkup'] < d['dnMkup'])
    ok('CLEANER STILL WINS, WEAKLY: approved drive %.3f is below rejected %.3f'
       % (d['upDrive'], d['dnDrive']), d['upDrive'] < d['dnDrive'])
    ok('the engine records the REAL strength of that direction, not the '
       'inflated one it was first written with (mkup %.3f/%.3f)'
       % (env['mkupUp'], env['mkupDown']),
       abs(env['mkupUp'] - d['upMkup']) < 0.02
       and abs(env['mkupDown'] - d['dnMkup']) < 0.02)

    # ---- 3. THE ONE MATERIAL FINDING THAT SURVIVED 270 ---------------------
    # Every other ranking was small-sample noise and his full sweep flattened
    # it: water went 20% -> 60%, glass 100% -> 40%, ash 43% -> 27%. Only metal
    # held, and it held hard -- then the new batch drove it home, because BOTH
    # metal moments in it died whole.
    rate, counts = d['rate'], d['counts']
    for m in env['dead']:
        got = rate.get(m)
        ok('%s IS DEAD and stayed dead through the full sweep (%s UP / %s DOWN)'
           % (m, counts.get(m, [0, 0])[0], counts.get(m, [0, 0])[1]),
           got is not None and got < 0.25)
    n_dead = sum(counts.get(m, [0, 0])[0] + counts.get(m, [0, 0])[1] for m in env['dead'])
    ok('and it is dead by weight of evidence, not a coin flip (%d judgements)'
       % n_dead, n_dead >= 20)
    B = d['batch']
    metal_moments = [e for e in env['batch'] if not B[e].get('missing')
                     and B[e]['mat'] in env['dead']]
    ok('the new batch tested the finding and confirmed it: every metal moment '
       'in it died whole (%s)'
       % ', '.join('%s %d/5' % (e, B[e]['up']) for e in metal_moments),
       bool(metal_moments) and all(B[e]['up'] == 0 for e in metal_moments))
    # AND THE GATE NO LONGER CLAIMS MORE THAN THAT. Nothing is asserted about
    # the materials that merely happen to be ahead today: that is the exact
    # mistake this whole block is a correction for.
    ok('no material outside `dead` is asserted as good (the 140-thumb rankings '
       'were noise and are not law)', 'winners' not in env)

    # ---- 4. THE REGION IS MEASURED, AND IT BINDS FORWARD -------------------
    ok('the shipped REGION is the real bounding box of his %d approvals (%s)'
       % (d['up'], '; '.join(d['boxOff'][:2]) or 'exact'), not d['boxOff'])
    walk = env['batch'] + [e for e in env.get('regionBinds', [])
                           if e not in env['batch']]
    ok('all %d moments in the batch have a recipe' % len(walk),
       all(not B[e].get('missing') for e in walk))
    # THE BINDING LIST IS FORWARD-ONLY AND THE GATE SAYS SO OUT LOUD. Narrowing
    # a jitter range changes what casing.1 IS, and 130 of his thumbs are
    # attached to those exact vectors -- so SFX-03 is measured against the box,
    # never failed on it. Anything added after 8/12 goes in regionBinds.
    for ev in env.get('regionBinds', []):
        b = B.get(ev)
        # THE ROW HAS TO EXIST. This assertion is the bug fix: `b or {}` used to
        # swallow a missing row and report "all inside" for a bound event the
        # derivation had never looked at.
        ok('%s is a real cooked row, not a name the derivation skipped' % ev,
           bool(b) and not b.get('missing') and b.get('n') == 5)
        b = b or {}
        ok('%s is bound to the region and lands inside it (%s)'
           % (ev, ', '.join(b.get('outside', [])) or 'all inside'),
           b.get('n') == 5 and not b.get('outsideN'))
    strays = sum(B[e]['outsideN'] for e in env['batch'] if not B[e].get('missing'))
    print('  NOTE  %d of 130 SFX-03 candidate values sit outside the approved '
          'box; not a failure, and not re-cooked, because his thumbs are '
          'attached to these exact vectors' % strays)

    # ---- 4b. BATCH INTEGRITY ----------------------------------------------
    for ev in walk:
        b = B[ev]
        if b.get('missing'):
            continue
        ok('%s cooks five distinct candidates that all validate' % ev,
           b['n'] == 5 and b['distinct'] == 5 and b['invalid'] == 0)
        ok('%s cooks the same five every time (seeded, so a thumb keeps meaning '
           'the sound he heard)' % ev, b['deterministic'])
        ok('%s does not drift material across its own candidates' % ev,
           len(b['mats']) == 1)
        ok('%s was actually put to him and judged (%d of 5)' % (ev, b['judged']),
           b['judged'] == 5)

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
        # 14 from the 8/12 batch, plus miss_past / vital_deep / sleep_sink from
        # the 8/15 sweep. The floor moves with his thumbs, never down.
        ok('HIS THUMBS REACHED THE GAME: %d of the new moments now have a '
           'sound the run can actually play (%s)'
           % (len(s['banked']), ', '.join(s['banked'][:6])),
           len(s['banked']) >= 17)
        ok('EVERY NEW SOUND ACTUALLY MAKES SOUND on the real render path (%s)'
           % (', '.join(s['silent']) or 'none silent'), not s['silent'])
        ok('the page threw nothing: %s' % (s.get('errors') or 'clean'),
           not s.get('errors'))

    print('  %d passed, %d FAILED' % (p, f))
    if not f:
        print('  33 new moments put to him across three batches, 17 came back '
              'with a sound, and the law has been rewritten from his sweeps '
              'twice instead of defended once.')
    return 1 if f else 0


if __name__ == '__main__':
    sys.exit(main())
