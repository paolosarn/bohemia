#!/usr/bin/env python3
"""
BOHEMIA — MEASURE HIS RACK (8/19/26). The ruler for the borrowed voices.

REUSE CHECK: this tool cooks NO pixels and NO new sound. It is the opposite of
a cook -- it opens the ONE alpha, reaches the 602-voice music rack that is
ALREADY in it (window.synthV), and writes down what those voices actually do.
Banks opened: none, because the bank here IS his rack, live in the page. It
draws nothing of its own; drawing something of its own would have been the
violation.

WHY THIS EXISTS
The SFX engine borrows voices out of the music studio (`synth: 'instrument'`).
The first bridge assumed a borrowed voice behaves like this engine's own
synthesis: that its length follows the step you hand it, and that one drive
level means one loudness. Both are false, and sfx_render_gate caught it as 161
failures across 12 moments:

  * HALF THE RACK IGNORES THE STEP. `templeblock` is 45 ms whether you ask for
    100 ms or 600. `udu` is 99 ms. `washboard` is 42 ms. The other half
    (`dawnpad`, `bottle`, `ironstep`) stretch with it, linearly, up to 6 s.
  * THEY ARE NOT THE SAME LOUDNESS. `boneplate` peaks at 0.03 where `taiko`
    peaks at 0.53 off the same bank at the same drive: a 17x spread. Judging
    those side by side is judging which one is audible.
  * BOTH DEPEND ON PITCH TOO. `edenmist` peaks 7x higher two octaves up;
    `boneplate` is half as long an octave up.

So the engine does not guess. It carries a MEASURED grid -- 5 steps x 2
semitones per voice, piecewise in between -- and derives the note length and the
drive from it. That is VERIFY ON THE REAL SURFACE applied to a number instead
of to a picture.

THIS IS CALIBRATION, NOT CONTENT. Nothing here decides what anything sounds
like. It is a ruler held up to Paolo's own instruments, and MECHANISM-MINE /
CONTENTS-PAOLO'S is untouched: which voice plays which moment is still his.

A VOICE IS MEASURED ONCE AND THEN FROZEN (8/20). The first version re-measured
EVERY voice on every run, and thirteen of the forty-four came back with different
numbers each time -- the ones whose rack bodies draw from Math.random internally.
The engine seeds that draw when it PLAYS a voice; this tool did not seed it when
it MEASURED one. So adding six new moments silently re-tuned the calibration of
voices that already-approved sounds are built on, and sfx_render caught it as
twelve of Paolo's judged candidates drifting: hurt_more.3 moved 31% in RMS and
changed its beat count.
His calibration is now as frozen as his verdicts. Only names that are NOT already
in the table get measured; the rest are carried through byte-for-byte.
--remeasure forces the old behaviour, deliberately, and prints what it moved.

  python3 tools/bohemia_sfx_instrument_measure.py            # print the table
  python3 tools/bohemia_sfx_instrument_measure.py --write    # add NEW voices only
  python3 tools/bohemia_sfx_instrument_measure.py --write --remeasure   # redo all
"""
import json
import os
import re
import subprocess
import sys
import tempfile

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ENGINE = 'engine/bohemia_sfx.js'

# THE GRID, AND WHY IT IS THIS DENSE. Two steps looked like enough: most of the
# rack is linear in the step. `ironlung` is not -- it holds at 0.20 s all the way
# to a step of 0.20 and then JUMPS to 1.40 s at 0.25, and a two-point line
# through that predicts 0.56 s where the truth is 0.19. The engine INVERTS this
# curve to fit a voice into the room it has, so a modelling error there does not
# stay a modelling error: it hands his rack the wrong step and the sound comes
# out a tenth of the length it declared. Five steps, piecewise, tracks the jump.
# Pitch stayed linear across every voice measured, so two semitones is enough.
SD = [0.03, 0.08, 0.15, 0.30, 0.60]
# THREE PITCHES, NOT TWO (8/20). Two looked like enough because pitch measured
# linear on the voices that were checked. `breathpad` is not: it peaks 0.081 two
# octaves down and 0.165 an octave up, and a straight line between those predicts
# 0.126 in the middle where the TRUTH IS 0.0255 -- five times over. The engine
# solves the drive backwards from that number, so a five-times error there comes
# straight out as a sound five times too quiet, which is exactly how dog_calls.3
# and lungs_burn.0 landed at 0.027 and 0.021 against a judgeable floor of 0.15.
# The middle row is measured; the two outer rows are carried through frozen, so
# not one already-judged sound moves.
# TWO, FOR NOW, AND THE THIRD IS BUILT. Switching this to [-24, -6, 12] lays the
# middle row down in one pass -- the migration below carries the outer rows
# byte-for-byte so nothing that is already recorded moves. It is NOT on, because
# a denser ruler changes the INTERPOLATION for every voice and that re-tunes 460
# candidates Paolo has already ruled on (come_up.1 moved 46% in RMS off nothing
# but a better ruler). It rides WITH a deliberate re-record, never under one.
SEMI = [-24, 12]

JS = r"""
const path=require('path');
function pw(){for(const g of ['/opt/node22/lib/node_modules','/usr/lib/node_modules',
  '/usr/local/lib/node_modules']){try{return require(path.join(g,'playwright'));}catch(e){}}
  return require('playwright');}
(async()=>{
  const {chromium}=pw();
  const b=await chromium.launch();
  const p=await b.newPage({viewport:{width:390,height:844}});
  const errs=[]; p.on('pageerror',e=>errs.push(String(e.message)));
  await p.goto('file://'+path.join(process.argv[2],'slices','BOHEMIA_ALPHA_0_9.html'));
  await p.waitForTimeout(1500);
  await p.evaluate(()=>{const f=document.getElementById('front');if(f)f.click();});
  await p.waitForTimeout(400);
  await p.evaluate(()=>{const t=[...document.querySelectorAll('.tab')]
    .find(x=>x.getAttribute('data-p')==='music'); if(t) t.click();});
  await p.waitForTimeout(2500);
  const cfg=JSON.parse(process.argv[3]);
  const out=await p.evaluate(async(cfg)=>{
    const SV = window.synthV || (typeof synthV!=='undefined'?synthV:null);
    if(!SV) return {fatal:'the music rack (synthV) is not in the shipped alpha'};
    const SR=44100, hzFn=x=>220*Math.pow(2,x/12);
    // THROUGH THE ENGINE'S OWN PATH, NOT A CLEAN WIRE (8/19). The first version
    // of this measured each voice straight into the destination, and the engine
    // then plays it through a closing gain and a panner -- so the table was a
    // ruler for a signal chain nobody uses. Two of his voices (`ironlung`,
    // `throatsong`) turned out to render SILENT the moment an intermediate gain
    // node is in front of them, and measuring on the clean wire could never see
    // that: it wrote down a healthy length and a healthy peak for a sound that
    // was not going to be there. VERIFY ON THE REAL SURFACE means the ruler
    // stands where the sound actually comes out.
    async function ring(name, sd, semi){
      const OAC=new OfflineAudioContext(1, Math.ceil(SR*(sd*8+1.5)), SR);
      const g=OAC.createGain(); g.gain.value=1; g.connect(OAC.destination);
      const ig=OAC.createGain(); ig.gain.value=1; ig.connect(g);
      try{ SV(name, OAC, ig, hzFn, sd, semi, 0.05, 0.3); }catch(e){ return {sec:0,peak:0}; }
      const buf=await OAC.startRendering(); const d=buf.getChannelData(0);
      let peak=0; for(let i=0;i<d.length;i++){const v=Math.abs(d[i]); if(v>peak)peak=v;}
      if(peak<1e-5) return {sec:0,peak:0};
      const thr=Math.max(peak*0.003,1e-5);
      let f=-1,l=-1;
      for(let i=0;i<d.length;i++){ if(Math.abs(d[i])>thr){ if(f<0)f=i; l=i; } }
      return {sec:+((l-f)/SR).toFixed(4), peak:+peak.toFixed(4)};
    }
    const rows=[];
    for(const n of cfg.names){
      const cells=[];
      for(const s of cfg.semi) for(const sd of cfg.sd) cells.push(await ring(n,sd,s));
      rows.push({n, cells});
    }
    return {rows};
  },cfg);
  out.errs=errs;
  console.log(JSON.stringify(out));
  await b.close();
})();
"""


def names_in_use(src):
    ns = set()
    for m in re.finditer(r'instSets:\s*\[(.*?)\]', src, re.S):
        ns |= set(re.findall(r"'([a-z]+)'", m.group(1)))
    for m in re.finditer(r"inst:\s*'([a-z]+)'", src):
        ns.add(m.group(1))
    return sorted(ns)


def measure(names):
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as fh:
        fh.write(JS)
        js = fh.name
    cfg = json.dumps({'names': names, 'sd': SD, 'semi': SEMI})
    try:
        r = subprocess.run(['node', js, os.path.abspath(REPO), cfg],
                           capture_output=True, text=True, timeout=1800)
    finally:
        os.unlink(js)
    if r.returncode != 0:
        raise SystemExit('the browser run died:\n' + (r.stderr or '')[-2000:])
    d = json.loads(r.stdout.strip().splitlines()[-1])
    if d.get('fatal'):
        raise SystemExit(d['fatal'])
    return d


def block(rows):
    """semi-major, then step. Row order: sec at each semitone in SEMI, then peak
    at each semitone in SEMI -- each row one number per entry in SD."""
    w = max(len(r['n']) for r in rows) + 2
    n = len(SD)
    out = []
    for r in sorted(rows, key=lambda x: x['n']):
        c = r['cells']
        m = len(SEMI)
        sec = ['%.3f' % c[i]['sec'] for i in range(m * n)]
        pk = ['%.4f' % c[i]['peak'] for i in range(m * n)]
        pad = ' ' * (w + 6)
        rows_txt = ([', '.join(sec[k * n:(k + 1) * n]) for k in range(m)]
                    + [', '.join(pk[k * n:(k + 1) * n]) for k in range(m)])
        out.append('    %-*s [%s],' % (w, r['n'] + ':',
                                       (',\n' + pad).join(rows_txt)))
    out[-1] = out[-1][:-1]
    return '\n'.join(out)


def existing(src):
    """the calibration already recorded, as raw text per voice."""
    m = re.search(r'var INST_VOICE = \{\n(.*?)\n  \};', src, re.S)
    if not m:
        return {}
    return dict(re.findall(r'^\s{4}([a-z0-9]+):\s*\[(.*?)\],?\s*$',
                           m.group(1), re.S | re.M))


def main():
    src = open(ENGINE, encoding='utf8').read()
    names = names_in_use(src)
    have = existing(src)
    remeasure = '--remeasure' in sys.argv
    todo = names if remeasure else [n for n in names if n not in have]
    kept = 0 if remeasure else len([n for n in names if n in have])
    print('=== %d BORROWED VOICES: %d already calibrated and FROZEN, '
          'measuring %d ===' % (len(names), kept, len(todo)))
    if remeasure:
        print('  --remeasure: EVERY voice is being re-read. Thirteen of them draw '
              'from Math.random internally and will come back different, which '
              'moves already-approved sounds. Only do this on purpose.')
    # ---- MIGRATION: the table gained a pitch row, so every FROZEN voice needs
    # its middle numbers measured and spliced into rows it already has. The two
    # outer rows are carried through byte-for-byte, which is the whole point:
    # adding a row must not move one sound Paolo has judged.
    need_mid = [n for n in names
                if n in have and len(have[n].split(',')) < len(SD) * len(SEMI) * 2]
    mid = {}
    if need_mid:
        print('  MIGRATING %d frozen voices: measuring the new middle pitch only, '
              'and carrying their existing rows through untouched.' % len(need_mid))
        global SEMI
        keep, SEMI = SEMI, [SEMI[1]]
        try:
            dm = measure(need_mid)
        finally:
            SEMI = keep
        n = len(SD)
        for r in dm['rows']:
            c = r['cells']
            mid[r['n']] = (['%.3f' % c[i]['sec'] for i in range(n)],
                           ['%.4f' % c[i]['peak'] for i in range(n)])
        for k, (msec, mpk) in mid.items():
            p = [x.strip() for x in have[k].split(',')]
            have[k] = ', '.join(p[0:n] + msec + p[n:2 * n]
                                + p[2 * n:3 * n] + mpk + p[3 * n:4 * n])

    if not todo:
        if mid:
            d = {'rows': []}
        else:
            print('  nothing new to measure.')
            return 0
    else:
        d = measure(todo)
    if d.get('errs'):
        print('  NOTE the alpha threw while measuring: %s' % d['errs'][:2])
    dead = [r['n'] for r in d['rows'] if all(c['peak'] <= 0 for c in r['cells'])]
    if dead:
        print('  SILENT IN THE RACK (a name that renders nothing): %s' % ', '.join(dead))
    # CARRY THE FROZEN ONES THROUGH VERBATIM, then add the new.
    w = max([len(r['n']) for r in d['rows']] + [len(k) for k in have] + [2]) + 2
    lines = []
    for k in sorted(set(list(have) + [r['n'] for r in d['rows']])):
        if k in have and not remeasure:
            lines.append('    %-*s [%s],' % (w, k + ':', have[k].strip()))
        else:
            r = [x for x in d['rows'] if x['n'] == k][0]
            c = r['cells']
            n = len(SD)
            sec = ['%.3f' % c[i]['sec'] for i in range(2 * n)]
            pk = ['%.4f' % c[i]['peak'] for i in range(2 * n)]
            pad = ' ' * (w + 6)
            lines.append('    %-*s [%s,\n%s%s,\n%s%s,\n%s%s],'
                         % (w, k + ':', ', '.join(sec[:n]), pad, ', '.join(sec[n:]),
                            pad, ', '.join(pk[:n]), pad, ', '.join(pk[n:])))
    lines[-1] = lines[-1][:-1]
    txt = '\n'.join(lines)
    if '--write' not in sys.argv:
        print(txt)
        print('\n(--write to patch %s)' % ENGINE)
        return 0
    new = re.sub(r'(var INST_VOICE = \{\n).*?(\n  \};)', lambda m: m.group(1) + txt + m.group(2),
                 src, count=1, flags=re.S)
    if new == src:
        raise SystemExit('could not find the INST_VOICE table in %s' % ENGINE)
    open(ENGINE, 'w', encoding='utf8').write(new)
    print('  wrote %d voices into %s' % (len(d['rows']), ENGINE))
    print('  now rebuild the alpha: python3 tools/bohemia_sfx_factory.py')
    return 0


if __name__ == '__main__':
    sys.exit(main())
