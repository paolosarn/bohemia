#!/usr/bin/env python3
"""
BOHEMIA SFX RENDER GATE (7/29/26) — the 60 candidates are measured AS AUDIO.

A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED, and VERIFY ON THE REAL SURFACE
(7/18) says a side-door probe is a lie. For sound, the real surface is a running
Web Audio graph — so this gate opens the ONE alpha in a real browser, takes the
BOH_SFX that actually shipped inside it, renders every candidate through an
OfflineAudioContext, and measures the samples that come out.

Reading the parameters would prove nothing. A vector can be perfectly legal and
render to silence, to a clipped smear, or to something that never stops ringing.
These are pulled off the waveform:

  1. IT MAKES A SOUND         peak > 0.01 — no silent candidate reaches his thumb
  2. IT DOES NOT CLIP         peak <= 1.0 before the studio's master + brickwall
  3. IT ENDS                  fully silent 60 ms past its own spec'd length.
                              This is the SCREECH LAW (7/8) proved on real audio
                              rather than by grepping for createDelay: nothing
                              feeds back, nothing rings, every voice decays to
                              actual zero and its nodes are dropped.
  4. IT IS NOT A CLICK        the audible part is at least 30% of its envelope,
                              so a "sound" that is really one broken sample fails
  5. IT IS DETERMINISTIC      rendered twice, sample for sample identical. This
                              is what makes a verdict durable: the sound he
                              thumbs is the sound the game will make.
  6. IT KEEPS ITS SHAPE       peak / rms / length / brightness are fingerprinted
                              in records/, and a recipe edit that moves any of
                              them past tolerance FAILS instead of quietly
                              handing him a different sound than the one he
                              judged. Re-record deliberately: --record.
  7. THE DESIGN INVARIANTS    a footstep can never hang into the next footstep
                              (<= 3/8 beat), a kill fills at least 3/4 of a beat,
                              a UI tick is never louder than a punch.

  python3 gates/sfx_render_gate.py            # check
  python3 gates/sfx_render_gate.py --record   # re-record the fingerprints
"""
import json
import os
import subprocess
import sys
import tempfile

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

FP = 'records/BOHEMIA_SFX_FINGERPRINTS_7_29_26.txt'
SHOT = 'slices/BOHEMIA_SFX_JUDGE_PROOF_7_29_26.png'

# tolerances. Loose enough that a different Chromium build's float noise cannot
# fail the gate, tight enough that a recipe edit cannot slip past it.
TOL = {'peak': 0.06, 'rms': 0.06, 'dur': 0.02, 'zcr': 0.06}

JS = r"""
const path=require('path');
function pw(){for(const g of ['/opt/node22/lib/node_modules','/usr/lib/node_modules',
  '/usr/local/lib/node_modules']){try{return require(path.join(g,'playwright'));}catch(e){}}
  return require('playwright');}
(async()=>{
  const {chromium}=pw();
  const b=await chromium.launch();
  const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});
  const errs=[];
  p.on('pageerror',e=>errs.push('PAGEERROR '+e.message));
  await p.goto('file://'+path.join(process.argv[2],'slices','BOHEMIA_ALPHA_0_9.html'));
  await p.waitForTimeout(1500);
  await p.evaluate(()=>{const f=document.getElementById('front');if(f)f.click();});
  await p.waitForTimeout(500);
  await p.evaluate(()=>{const t=[...document.querySelectorAll('.tab')]
    .find(x=>x.getAttribute('data-p')==='music'); if(t)t.click();});
  await p.waitForTimeout(2500);

  const shot=process.argv[3];
  if(shot) await p.screenshot({path:shot});

  const out=await p.evaluate(async()=>{
    if(typeof BOH_SFX==='undefined') return {fatal:'BOH_SFX is not in the shipped alpha'};
    const SR=44100, BEAT=BOH_SFX.BEAT;

    async function pcm(v){
      const beats=BOH_SFX.beatsOf(v);
      const secs=beats*BEAT+0.6;                     // room to prove it went quiet
      const OAC=new OfflineAudioContext(1,Math.ceil(SR*secs),SR);
      const bus=OAC.createGain(); bus.gain.value=1; bus.connect(OAC.destination);
      BOH_SFX.render(v,OAC,bus,0.05);
      const buf=await OAC.startRendering();
      return buf.getChannelData(0);
    }
    function measure(d,v){
      const beats=BOH_SFX.beatsOf(v), t0=0.05, specEnd=t0+beats*BEAT;
      let peak=0,sq=0;
      for(let i=0;i<d.length;i++){const a=Math.abs(d[i]); if(a>peak)peak=a; sq+=d[i]*d[i];}
      const rms=Math.sqrt(sq/d.length);
      const thr=Math.max(peak*0.02,1e-4);
      let first=-1,last=-1;
      for(let i=0;i<d.length;i++){ if(Math.abs(d[i])>thr){ if(first<0)first=i; last=i; } }
      // everything after the spec'd end + 60 ms must be silence: nothing rings
      const tailFrom=Math.min(d.length-1,Math.ceil((specEnd+0.06)*SR));
      let tail=0;
      for(let i=tailFrom;i<d.length;i++) tail=Math.max(tail,Math.abs(d[i]));
      // zero-crossing rate over the audible part = a cheap brightness read
      let zc=0,n=0;
      for(let i=Math.max(1,first);i<=Math.max(1,last);i++){ n++; if((d[i]>=0)!==(d[i-1]>=0))zc++; }
      return {
        id:v.id, ev:v.ev,
        peak:+peak.toFixed(5), rms:+rms.toFixed(6),
        dur:+(((last-first)/SR)||0).toFixed(4),
        specDur:+(beats*BEAT).toFixed(4), beats:+beats.toFixed(4),
        tail:+tail.toFixed(6), zcr:+((n?zc/n:0)).toFixed(5)
      };
    }

    const rows=[];
    for(const E of BOH_SFX.EVENTS){
      for(const v of BOH_SFX.cook(E.ev,5)){
        const d=await pcm(v);
        const m=measure(d,v);
        // DETERMINISM: render it again, and measure how far the two renders sit
        // apart. NOT bit-for-bit: when several oscillators sum into one gain
        // node, Chromium is free to add them in a different order per context,
        // which moves float32 rounding by ~1e-8. That was measured, not assumed
        // (block/save_chime/gravel, the families with the most voices). 1e-6 is
        // -120 dB — inaudible and unmeasurable — and anything ABOVE it means the
        // synth really did change, which is what this check is for.
        const d2=await pcm(v);
        let md=(d.length===d2.length)?0:1;
        if(d.length===d2.length) for(let i=0;i<d.length;i++){
          const q=Math.abs(d[i]-d2[i]); if(q>md)md=q; }
        m.detDiff=+md.toFixed(9);
        m.det=(md<=1e-6);
        m.gain=v.gain;
        rows.push(m);
      }
    }
    return {rows:rows, mounted:!!document.getElementById('sfxWrap'),
            cards:document.querySelectorAll('#sfxWrap .sfxCard').length,
            candRows:document.querySelectorAll('#sfxWrap .sfxRow').length};
  });
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
    record = '--record' in sys.argv
    print('=== SFX RENDER GATE — the 60 candidates measured as audio ===')
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as fh:
        fh.write(JS)
        js = fh.name
    try:
        r = subprocess.run(['node', js, os.path.abspath(REPO), SHOT],
                           capture_output=True, text=True, timeout=600)
    finally:
        os.unlink(js)
    if r.returncode != 0:
        print('  FAIL  the browser run died:\n' + (r.stderr or '')[-2000:])
        return 1
    try:
        data = json.loads(r.stdout.strip().splitlines()[-1])
    except Exception as e:
        print('  FAIL  unreadable browser output (%s):\n%s' % (e, r.stdout[-1500:]))
        return 1
    if data.get('fatal'):
        print('  FAIL  ' + data['fatal'])
        return 1

    chk(not data.get('errs'), 'the alpha threw while the MUSIC tab built: %s' % (data.get('errs') or [])[:2])
    chk(data.get('mounted'), 'the SFX judge is not in the MUSIC tab of the shipped alpha')
    chk(data.get('cards') == 12, 'expected 12 game moments on the judge surface, saw %s' % data.get('cards'))
    chk(data.get('candRows') == 60, 'expected 60 candidate rows, saw %s' % data.get('candRows'))

    rows = data['rows']
    chk(len(rows) == 60, 'expected 60 rendered candidates, got %d' % len(rows))

    by_ev = {}
    for m in rows:
        by_ev.setdefault(m['ev'], []).append(m)

    for m in rows:
        i = m['id']
        chk(m['peak'] > 0.01, '%s renders to silence (peak %.5f)' % (i, m['peak']))
        chk(m['peak'] <= 1.0, '%s clips before the master bus (peak %.3f)' % (i, m['peak']))
        chk(m['tail'] < 2e-4, '%s is still making sound past its own length (tail %.6f) — '
                              'something rings, which is the SCREECH LAW' % (i, m['tail']))
        chk(m['dur'] >= 0.30 * m['specDur'], '%s is a click, not a sound: audible for %.3fs of a '
                                             '%.3fs envelope' % (i, m['dur'], m['specDur']))
        chk(m['dur'] <= m['specDur'] + 0.06, '%s outlives its own beats (%.3fs audible, %.3fs spec\'d) '
                                             '— EVERY DURATION IS A NOTE' % (i, m['dur'], m['specDur']))
        chk(m['det'], '%s renders differently twice (%.9f apart): a verdict on it would not '
                      'survive the day' % (i, m.get('detDiff', 1)))
        # 8. AUDIBLE IN THE SAME ROOM AS THE OTHERS. The first render had the
        # families 20 dB apart, so BLOCK and the asphalt steps would have lost to
        # KILL for being quiet rather than for being wrong.
        chk(0.15 <= m['peak'] <= 0.85, '%s peaks at %.3f — outside the judgeable band. He would '
                                       'be thumbing which one he can HEAR' % (i, m['peak']))

    # 7. the design invariants that are about the GAME, not about the waveform
    for m in rows:
        if m['ev'].startswith('step_'):
            chk(m['beats'] <= 0.375, '%s is %.4f beats — a footstep that hangs into the next '
                                     'footstep' % (m['id'], m['beats']))
    for m in by_ev.get('kill', []):
        chk(m['beats'] >= 0.75, '%s is %.4f beats — the kill has to fill the beat it lands on'
            % (m['id'], m['beats']))
    # THE DESIGNED LOUDNESS LADDER (engine/bohemia_sfx.js, the mkup block). A kill
    # SHOULD dwarf a footstep; what must never happen is a family losing because
    # it was quiet. Medians, so one jittered outlier cannot flip the ladder.
    def med(ev):
        xs = sorted(x['peak'] for x in by_ev.get(ev, []))
        return xs[len(xs) // 2] if xs else 0.0
    ladder = [('kill', 'hit'), ('hit', 'step_dirt'), ('hit', 'ui_tap'),
              ('door_shut', 'ui_tap'), ('step_asphalt', 'ui_tap')]
    for loud, quiet in ladder:
        chk(med(loud) > med(quiet), 'the mix ladder inverted: %s (%.3f) is not above %s (%.3f)'
            % (loud, med(loud), quiet, med(quiet)))

    # 6. the fingerprint ledger
    cur = {m['id']: m for m in rows}
    if record:
        lines = ['# BOHEMIA SFX FINGERPRINTS — batch SFX-01, 7/29/26',
                 '# Recorded off the REAL Web Audio render inside the ONE alpha.',
                 '# id  peak  rms  dur  zcr  beats',
                 '# gates/sfx_render_gate.py fails if any of these move past tolerance:',
                 '#   peak/rms/zcr +-6%, dur +-20ms. A recipe edit MUST re-record here,',
                 '#   deliberately, so a sound Paolo judged can never drift under him.']
        for m in rows:
            lines.append('%-16s %.5f %.6f %.4f %.5f %.4f'
                         % (m['id'], m['peak'], m['rms'], m['dur'], m['zcr'], m['beats']))
        open(FP, 'w').write('\n'.join(lines) + '\n')
        print('  RECORDED %d fingerprints -> %s' % (len(rows), FP))
    else:
        chk(os.path.exists(FP), 'no fingerprint ledger at %s — run with --record' % FP)
        if os.path.exists(FP):
            old = {}
            for ln in open(FP):
                ln = ln.split('#')[0].strip()
                if not ln:
                    continue
                pp = ln.split()
                if len(pp) >= 6:
                    old[pp[0]] = dict(peak=float(pp[1]), rms=float(pp[2]),
                                      dur=float(pp[3]), zcr=float(pp[4]), beats=float(pp[5]))
            chk(set(old) == set(cur), 'the batch roster moved: %d recorded vs %d rendered'
                % (len(old), len(cur)))
            for i in sorted(set(old) & set(cur)):
                o, n = old[i], cur[i]
                for k in ('peak', 'rms', 'zcr'):
                    base = max(abs(o[k]), 1e-4)
                    chk(abs(n[k] - o[k]) / base <= TOL[k],
                        '%s %s drifted %.1f%% (%.5f -> %.5f): the sound changed shape since it '
                        'was recorded' % (i, k, 100 * abs(n[k] - o[k]) / base, o[k], n[k]))
                chk(abs(n['dur'] - o['dur']) <= TOL['dur'],
                    '%s length drifted %.0f ms (%.4f -> %.4f)' % (i, 1000 * abs(n['dur'] - o['dur']),
                                                                  o['dur'], n['dur']))
                chk(abs(n['beats'] - o['beats']) < 1e-6,
                    '%s is a different number of beats than the one recorded' % i)

    print('  %d passed, %d FAILED' % (P, F))
    if not F:
        print('  60 candidates rendered, measured, silent on time, and identical twice.')
        print('  proof screenshot: %s' % SHOT)
    return 1 if F else 0


if __name__ == '__main__':
    sys.exit(main())
