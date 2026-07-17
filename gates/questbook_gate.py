#!/usr/bin/env python3
"""BOHEMIA QUESTBOOK GATE (7/17/26) — the BATCH LAW's teeth.

The format law (v2, locked 7/16) and the batch law both ship grep-specified
checks that until today lived in prose. A LAW WITHOUT A MACHINE GATE IS NOT
ENFORCED, so:

HARD CHECKS (fail the gate) — every v2-era mined file (#%d and up):
  - exactly 10 craft points        grep -cE '^W[0-9]+\\.'
  - >0 option lines                grep -cE '^> '  (the conversation machine)
  - CAST + CONVERSATIONS + BRANCH MAP sections present
  - branch COUNT stated in section 4
  - END marker (*END #N*) present and matches the file number
  - every fenced @TALK block parses through the real bohemia_bq.js with zero
    unrecognized lines (a port that cannot be pasted into the lab is a wish)

CORPUS CHECKS (fail the gate) — the whole questbook:
  - no number gaps, no collisions (carry gate also audits; two locks, one law)

INFO (reported, never fails) — the backfill ledger:
  - which files below the v2 era still lack option lines (the backfill queue)
  - how many legacy files lack an END marker (the *END #N* convention starts
    around #125; the pile before that just stops. Recorded, not punished.)

Run: python3 gates/questbook_gate.py  (cwd-independent, repo-aware)
"""
import os
import re
import subprocess
import sys

V2_ERA = 139   # first file cooked under this gate. 126-138 predate it: 126 is
               # the exemplar, 127-138 are the dead chat's fresh mines and sit
               # in the backfill queue (reported below, never failed here).

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
QB = os.path.join(ROOT, 'questbook')

p = f = 0
def ok(name, cond):
    global p, f
    if cond: p += 1
    else:
        f += 1
        print('  > FAIL ' + name)


def bq_parse_check(path, text):
    """Every fenced block containing @TALK must parse clean in the real parser."""
    blocks = [b for b in re.findall(r'```\n?(.*?)```', text, re.S) if '@TALK' in b]
    if not blocks:
        return None  # caller decides whether absence is legal
    import json
    js = (
        "const BQ=require(%r);let raw='';process.stdin.on('data',d=>raw+=d);"
        "process.stdin.on('end',()=>{const blocks=JSON.parse(raw);let bad=0;"
        "for(const b of blocks){const q=BQ.parse(b);"
        "for(const w of q.warnings){const m=w.msg||String(w);"
        "if(/unrecognized/.test(m)){bad++;console.error(m);}}}"
        "console.log(JSON.stringify({blocks:blocks.length,bad}));});"
    ) % os.path.join(ROOT, 'engine', 'bohemia_bq.js')
    r = subprocess.run(['node', '-e', js], input=json.dumps(blocks),
                       capture_output=True, text=True)
    if r.returncode != 0:
        return {'blocks': len(blocks), 'bad': -1, 'err': r.stderr[:200]}
    import json as j
    out = j.loads(r.stdout.strip().splitlines()[-1])
    out['err'] = r.stderr[:200]
    return out


files = {}
for fn in os.listdir(QB):
    m = re.match(r'BOHEMIA_QUESTBOOK_(\d+)_.*\.md$', fn)
    if m:
        files.setdefault(int(m.group(1)), []).append(fn)

# corpus: numbers audit
dupes = {n: v for n, v in files.items() if len(v) > 1}
ok('questbook: no number collisions', not dupes)
if dupes: print('    collisions:', dupes)
nums = sorted(files)
gaps = [i for i in range(nums[0], nums[-1] + 1) if i not in files]
ok('questbook: no gaps in %d-%d' % (nums[0], nums[-1]), not gaps)
if gaps: print('    gaps:', gaps)

backfill = []
no_end = []
for n in nums:
    fn = files[n][0]
    text = open(os.path.join(QB, fn), encoding='utf-8').read()
    lines = text.split('\n')
    wc = sum(1 for l in lines if re.match(r'^W[0-9]+\.', l))
    optc = sum(1 for l in lines if l.startswith('> '))
    if ('*END #%d*' % n) not in text:
        no_end.append(n)

    if n >= V2_ERA:
        ok('#%d: exactly 10 craft points (has %d)' % (n, wc), wc == 10)
        ok('#%d: conversation machine has option lines (%d)' % (n, optc), optc > 0)
        for sec in ('CAST + WHAT EACH ONE WANTS', 'THE CONVERSATIONS', 'THE BRANCH MAP'):
            ok('#%d: section present: %s' % (n, sec), sec in text)
        ok('#%d: branch COUNT stated' % n,
           re.search(r'\*\*COUNT[:\s]', text) is not None)
        ok('#%d: END marker matches number' % n, ('*END #%d*' % n) in text)
        bq = bq_parse_check(os.path.join(QB, fn), text)
        ok('#%d: ships @TALK trees in the ports' % n, bq is not None)
        if bq is not None:
            ok('#%d: all %d .bq blocks parse clean (lab-pasteable)' % (n, bq['blocks']),
               bq['bad'] == 0)
            if bq['bad']: print('    ' + bq.get('err', ''))
    elif optc == 0:
        backfill.append(n)

print('\n  backfill queue (pre-v2-era files with no conversation machine yet): %d files'
      % len(backfill))
print('  ' + ','.join(str(x) for x in backfill))
print('  legacy files without an *END #N* marker: %d (convention starts ~#125; recorded, not punished)'
      % len([x for x in no_end if x < V2_ERA]))
print('\n=== QUESTBOOK GATE: %d passed, %d failed ===' % (p, f))
sys.exit(1 if f else 0)
