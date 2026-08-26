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
import re
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
    r.env = BOH_SFX.ENVELOPE || {};
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

    all_rows = d['rows']

    # ---- 0. A DEAD CANDIDATE IS NOT DIVERSITY (8/25) ---------------------
    # THIS GATE WAS COUNTING CORPSES, AND IT WAS GETTING HAPPIER EVERY TIME A
    # SOUND DIED. It measured every recipe the engine can cook, whether or not
    # the candidate still exists as a sound anybody will ever hear. GRAVEYARD IS
    # FINAL, so a tombstoned candidate is never coming back -- counting it as a
    # physics the game HAS is counting a physics the game LOST.
    #
    # AND THE ERROR RAN THE WRONG WAY, which is what makes it serious rather
    # than untidy. Every one of the ten whole moments killed since 8/12 was a
    # NON-instrument moment; not one instrument candidate has ever been
    # tombstoned. So each death padded the denominator and made the ratio look
    # better while the game got staler. MEASURED, the day this was found:
    #     counting corpses : instrument 105 of 205 = 51.2%  (cap 50%)
    #     LIVING SOUND     : instrument 105 of 155 = 67.7%
    # and worse, PARTICLE AND AIR HAVE ZERO LIVING CANDIDATES between them --
    # cash_count, deck_ring, glass_crunch, mag_clack, breath_out and dog_cry all
    # went 5 for 5 -- while the span check below still said "at least four
    # physics" and passed. Two of the engine's five physics are extinct in
    # audible sound and the gate that exists to catch exactly that could not see
    # it. That is the staleness his ruling names, wearing the gate's own badge.
    #
    # THE MATCH IS ANCHORED, because this repo has now made the same mistake
    # twice: the graveyard file is PROSE as well as tombstones, and a loose
    # search finds "swing_air.2 .3, tape_pull.1 .4" inside a sentence listing the
    # candidates that LIVED and buries four survivors. A tombstone is a line
    # whose id starts the line and is followed by its synth column. Nothing else
    # counts as a death.
    grave = open(os.path.join(ROOT, 'gates', 'bohemia_graveyard.txt'),
                 encoding='utf8').read()
    tomb = set(re.findall(r'^\s*([a-z_][a-z_0-9]*\.\d+)\s+synth=', grave, re.M))
    # AND WHICH WHOLE METHODS HE BARRED. Read, never copied -- see section 2.
    _mb = re.search(r'^BARRED-FROM-NEW-COOKS:[ \t]*(.+)$', grave, re.M)
    barred = set((_mb.group(1) if _mb else '').split())
    rows = [r0 for r0 in all_rows if r0['id'] not in tomb]
    buried = len(all_rows) - len(rows)

    by = {}
    for row in rows:
        by.setdefault(row['synth'], []).append(row)

    # ---- 1. THE ENGINE HAS MORE THAN ONE PHYSICS, AND THEY SHIP ------------
    methods = d.get('methods') or []
    ok('the shipped engine declares more than one way to make a sound (%s)'
       % ', '.join(methods), len(methods) >= 5)
    # EVERY METHOD HE STILL ALLOWS, not every method the engine can name. air and
    # particle are deliberately still DECLARED after 8/14 -- the post-mortem kept
    # them in the engine rather than deleting them, on the stated grounds that
    # 0/30 condemns the recipes and cannot fully separate the method from the
    # writing of it. So the engine keeping them is correct AND them having no
    # living candidate is correct, and only a gate that knows about the bar can
    # hold both at once. Before this it held neither and just went red.
    ok('and every declared method HE HAS NOT BARRED is actually REACHED by a '
       'living recipe (%s)%s'
       % (', '.join('%s:%d' % (k, len(v)) for k, v in sorted(by.items())),
          '  [barred, correctly silent: ' + ', '.join(sorted(barred)) + ']'
          if barred else ''),
       (set(methods) - barred) <= set(by))
    ok('and a barred method is still DECLARED in the engine, because he barred '
       'the recipes and not the physics -- deleting it would make the bar '
       'unliftable (%s)' % (', '.join(sorted(barred)) or 'nothing barred'),
       barred <= set(methods))

    # ---- 2. THE NEW BATCH IS NOT ONE METHOD WEARING FIVE HATS -------------
    fresh = [r0 for r0 in rows if r0['synth'] != 'modal']
    fresh_m = {r0['synth'] for r0 in fresh}
    dead_m = {r0['synth'] for r0 in all_rows
              if r0['synth'] != 'modal' and r0['id'] in tomb} - fresh_m

    # A GATE MUST NEVER OUTRANK A RULING (8/1). This asked for FOUR physics in
    # the batch, and on 8/14 Paolo's verdicts made four impossible: particle and
    # air went 0 UP / 30 DOWN across two batches and the post-mortem barred them
    # from new cooks in as many words -- "there is no third cook for these slots,
    # in this session or any other, unless he asks for one". Three methods are
    # still allowed to be cooked, so a gate demanding four was demanding that
    # somebody violate STOP PRODUCING to turn it green. It sat red for eleven
    # days with no legal way out, which is the shape of a gate outranking a
    # ruling.
    # THE BAR IS READ, NOT COPIED. It lives on one anchored line in the graveyard
    # registry -- the canonical home of what is dead -- so if he ever asks for
    # particle again, one line changes and this gate follows. Copying the two
    # names into this file is the mirrored-constant rot that cost this lane its
    # whole week.
    ok('the graveyard names which methods are barred from new cooks, so this '
       'gate can never ask for one (%s)' % (', '.join(sorted(barred)) or 'NONE FOUND'),
       bool(barred))
    allowed = {r0['synth'] for r0 in all_rows if r0['synth'] != 'modal'} - barred
    ok('EVERY PHYSICS HE STILL ALLOWS IS ACTUALLY MAKING SOUND (%s)%s'
       % (', '.join(sorted(fresh_m & allowed)),
          '  SILENT AND ALLOWED: ' + ', '.join(sorted(allowed - fresh_m))
          if allowed - fresh_m else ''),
       allowed and not (allowed - fresh_m))
    ok('and the barred ones are barred because they are DEAD, not merely unused '
       '-- if one ever comes back alive without him asking, that is a remake '
       '(%s)' % (', '.join(sorted(barred & fresh_m)) or 'none alive, correct'),
       not (barred & fresh_m))
    if fresh:
        top_m = max(fresh_m, key=lambda m: len([x for x in fresh if x['synth'] == m]))
        top = len([x for x in fresh if x['synth'] == top_m])
        # AND SAY WHAT CLOSING IT WOULD COST, so nobody closes it by padding.
        # STOP PRODUCING names the tell; a gate that reports only a number
        # invites somebody to cook eleven moments the game never asked for.
        need = max(0, top * 2 - len(fresh))
        ok('and no single method owns it (%s holds %d of %d LIVING candidates, '
           '%.1f%%; %d tombstoned candidate(s) excluded -- counting them said '
           '%d of %d). CLOSING THIS HONESTLY NEEDS %d MORE NON-%s CANDIDATES '
           '(~%d moments) THAT THE GAME ACTUALLY WANTS -- friction first, it is '
           'the best-scoring method he has. IT IS NOT CLOSED BY PADDING: 30 of '
           'the 32 silent moments were already shown and got zero ups, so they '
           'are spent, and particle and air are barred.'
           % (top_m, top, len(fresh), 100.0 * top / len(fresh), buried, top,
              len([x for x in all_rows if x['synth'] != 'modal']),
              need, top_m.upper(), -(-need // 5)),
           top <= len(fresh) * 0.5)

    # ---- 2b. NOT EVERYTHING IN THIS GAME IS ON THE GRID (8/21) -----------
    # THE CAR TICKS died 10 for 10 across panel_tick and car_heat, and one of
    # the two reasons was RHYTHM: every hit-set in both ids lands on a 32nd-note
    # grid (each value a multiple of 0.0625). Contracting metal is stick-slip --
    # the intervals are irregular AND THEY LENGTHEN, because the panel
    # approaches ambient temperature asymptotically. A tick on a grid reads as a
    # meter, which is exactly what the dead brief asked for ("a clock you can
    # watch"). That is a STALENESS property, which is why it lives in this gate.
    #
    # This does NOT touch the 120 BPM law. That law is about GAMEPLAY -- "when a
    # mechanic and the beat disagree, THE MECHANIC MOVES: difficulty, pattern
    # speed, cycle length, cover windows" -- it governs WHEN a sound is asked
    # for, never the grain texture inside one triggered event.
    esrc = open('engine/bohemia_sfx.js', encoding='utf8').read()
    mm = re.search(r'\n    metal_ticks: \{(.*?)\n    \},', esrc, re.S)
    ok('the engine still carries metal_ticks, the off-grid moment', bool(mm))
    if mm:
        body = mm.group(1)
        arrs = re.findall(r'\[([0-9.,\s]+)\]', body[body.index('hitSets:'):])
        sets = [[float(x) for x in a.split(',') if x.strip()] for a in arrs]
        ok('metal_ticks declares its five hit-sets (%d)' % len(sets), len(sets) == 5)
        vals = [v for a in sets for v in a if v]
        off = [v for v in vals
               if abs(round(v / 0.0625) * 0.0625 - v) > 1e-9]
        ok('every metal_ticks hit is OFF the 32nd grid, so it cannot read as a '
           'meter the way all ten dead candidates did (%d of %d)'
           % (len(off), len(vals)), vals and len(off) == len(vals))
        bad = []
        for a in sets:
            g = [round(a[k + 1] - a[k], 4) for k in range(len(a) - 1)]
            if not all(g[k + 1] > g[k] for k in range(len(g) - 1)):
                bad.append(a)
        ok('and every set LENGTHENS as it goes, because metal approaching '
           'ambient contracts more and more slowly (%s)'
           % (bad or 'all %d sets decelerate' % len(sets)), not bad)

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

    # ---- 5. AND THEN HE JUDGED IT (8/14) ---------------------------------
    # The batch was built to answer "everything sounds the same" with four new
    # physics. He swept all 330 the same day and the answer is sharper than the
    # question: friction 40% (the best method in the game), modal 36%, fm 13%,
    # particle 0/20, air 0/10. The two methods added specifically because
    # breaking glass and breath are not struck objects are the two he wants
    # least -- and FRICTION, which did not exist three days ago, is the only
    # thing that has ever given a sound to swing, patch_up, build_place or
    # equip. A diversity gate that could not notice that would be measuring
    # variety for its own sake.
    env = d.get('env') or {}
    dead_m = env.get('deadMethod') or []
    ok('the engine records which methods his sweep killed (%s)'
       % (', '.join(dead_m) or 'none recorded'), len(dead_m) == 2)
    rate = env.get('methodRate') or {}
    for m in dead_m:
        ok('%s is recorded at the rate he actually gave it (%s)'
           % (m, rate.get(m)), rate.get(m) == 0)
    ok('friction is recorded as the method that beat the original (%s vs modal '
       '%s)' % (rate.get('friction'), rate.get('modal')),
       (rate.get('friction') or 0) > (rate.get('modal') or 1))
    twice = env.get('twiceDead') or []
    ok('the eight moments he has now killed TWICE are named, so no third cook '
       'answers them (%d)' % len(twice), len(twice) == 8)
    # AND NOTHING NEW MAY BE COOKED FROM A DEAD METHOD. Today that is vacuous --
    # SFX-04 predates the finding and keeps its ids so his thumbs still resolve
    # -- so the check is on what comes NEXT, and it says so rather than
    # pretending to have caught something.
    later = [e for e in (env.get('batch') or []) if e in twice]
    ok('the twice-dead are not sitting in a live batch list (%s)'
       % (', '.join(later) or 'none'), not later)

    ok('the page threw nothing: %s' % (d.get('errors') or 'clean'), not d.get('errors'))

    print('  %d passed, %d FAILED' % (p, f))
    if not f:
        print('  Five physics, measurably different from each other in the '
              'rendered audio, not just in the field that names them.')
    return 1 if f else 0


if __name__ == '__main__':
    sys.exit(main())
