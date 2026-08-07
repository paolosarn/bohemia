#!/usr/bin/env python3
"""BOHEMIA - NOTHING HE AUTHORS GOES NOWHERE (8/7/26, FACTIONS lane)

THE DISEASE THIS MACHINE-LOCKS. Four times now, in four different costumes, this
project has shipped content Paolo authored that nothing ever read:

  7/30  APPROVED-BUT-UNUSED: a bank he thumbed UP that never draws a pixel.
  8/4   the reachability census: 17 finished things shipping where no player looks.
  8/6   the clout tags: 69 authored, read only by a vanity follower count.
  8/7   @DO faction_posture: 17 authored, parsed into a real field, read by nothing.

Every single one was found by a human noticing. Every gate in the repo was green
through all four, because no gate could ask the general question. A LAW WITHOUT A
MACHINE GATE IS NOT ENFORCED, and this one did not even have a law.

WHAT IT HOLDS:

  A. NO AUTHORED VERB IS INERT. Every @DO verb in the runtime's vocabulary must
     change SOMETHING when a quest carries it - the real world, or at minimum the
     quest's own state. A verb that changes nothing at all is an author writing
     into a bin.

  B. NO AUTHORED VERB IS UNPARSED. A verb he writes in a .bq that the runtime has
     no case for is worse than inert: it silently becomes a log line.

  C. THE VOCABULARY IS NEVER TYPED HERE. It is read out of the runtime's own switch,
     so a verb added, renamed, or deleted tomorrow is followed automatically and
     this gate cannot drift from the thing it checks.

  D. IT IS BEHAVIOURAL, NOT TEXTUAL, AND THAT IS THE WHOLE POINT. Two text-sweep
     versions were built first and BOTH were wrong in opposite directions - one
     grepped verb names and called advance_territory dead because the field it
     writes is camelCase; the other grepped state fields and called everything
     alive because two judge pages re-implement the runtime for preview and a
     simulator looks exactly like a consumer. This runs the real quest through the
     real runtime against a real booted world, twice, and diffs. It never reads a
     character of source, so a comment, a coincidence, or a 26 MB generated slice
     cannot fool it.

  python3 gates/authored_unread_gate.py
"""
import json
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

REPORT = 'records/BOHEMIA_AUTHORED_UNREAD.json'

fails = []
passed = 0


def ok(name, cond):
    global passed
    if cond:
        passed += 1
    else:
        fails.append(name)
        print('  FAIL: ' + name)


p = subprocess.run([sys.executable, 'tools/bohemia_authored_unread.py'],
                   capture_output=True, text=True)
ok('the behavioural probe runs at all — it boots a real world and resolves real quests',
   p.returncode == 0)
if p.returncode != 0:
    print(p.stderr[-1200:])
    print('=== AUTHORED UNREAD GATE: %d passed, %d failed ===' % (passed, len(fails)))
    sys.exit(1)

r = json.load(open(REPORT, encoding='utf-8'))
rows = r['rows']
ok('it actually probed the vocabulary (a sweep that found nothing proves nothing)',
   len(rows) >= 8)

inert = [x for x in rows if x['verdict'] == 'INERT']
ok('NO AUTHORED VERB IS INERT — every @DO he writes changes something: %s'
   % (', '.join('%s (%d authored)' % (x['verb'], x['authored']) for x in inert) or 'none'),
   not inert)

unparsed = [x for x in rows if x['verdict'] == 'UNPARSED']
ok('NO AUTHORED VERB IS UNPARSED — the runtime has a case for everything he writes: %s'
   % (', '.join('%s (%d authored)' % (x['verb'], x['authored']) for x in unparsed) or 'none'),
   not unparsed)

errored = [x for x in rows if x['verdict'] == 'ERROR']
ok('no verb crashes the runtime when a quest carries it: %s'
   % (', '.join(x['verb'] for x in errored) or 'none'), not errored)

world = [x for x in rows if x['verdict'] == 'WORLD']
ok('at least one verb reaches the REAL world — if none did, the probe is measuring nothing',
   len(world) > 0)

ok('the method on record is the behavioural one, not a text sweep',
   'behavioural' in r.get('method', ''))

# ---------------------------------------------------------------------------
# E. THE OTHER WAY AUTHORED CONTENT DIES: THE ONE WAY TO USE IT WARNS AT YOU.
#
# @DO bond is wired -- the runtime resolves a numeric gate whose key is a bond
# target (`else if(key in s.bonds)`), so `[gate: grower>=10]` genuinely works. But
# bq.js WARNED on it, because 'grower' is not in GATE_KEYS, a list it was never
# supposed to be in. 44 authored bond rulings, gated on ZERO times, and the one way
# to use them told the author they had got it wrong.
# A CHECKER THAT CANNOT TELL A USE FROM AN ERROR IS THE BROKEN ONE (Paolo 8/1), and
# you fix the ruler, never the target. Both halves are measured here: it must
# validate clean AND actually open the option at runtime, because a validator that
# stops complaining about something still broken is worse than the warning.
# ---------------------------------------------------------------------------
probe_js = r'''
const BQ = require('./engine/bohemia_bq.js');
const L  = require('./engine/bohemia_loop.js');
const head = ['@QUEST bondgate Bond Gate','@ACT 1','@ONCE true',
  '@ROLE grower REQ faction=BLUES','@STAGE 10','  @LOG a',
  '@TALK open speaker=grower entry=stage>=10','  @SAY hi',
  '  @OPT "needs bond" [gate: grower>=10] -> END  @DO set_stage 20',
  '  @OPT "raise it" [gate: none] -> open  @DO bond grower +18',
  '  @OPT "bogus" [gate: nosuchrole>=3] -> END','@END',
  '@STAGE 20 COMPLETE #quiet','  @LOG done'].join('\n');
const warns = (BQ.validate(BQ.parse(head)).warnings || []).map(w => w.msg || w);
const ctx = L.boot({ seed: 'bondgate' });
const rt = ctx.quests.start(head); rt.begin('open');
const vis = t => rt.view().options.filter(o => o.text.indexOf(t) >= 0).length > 0;
const before = vis('needs bond');
rt.choose(rt.view().options.filter(o => o.text.indexOf('raise it') >= 0)[0].i);
process.stdout.write(JSON.stringify({
  roleGateWarns: warns.some(w => /grower/.test(w)),
  bogusGateWarns: warns.some(w => /nosuchrole/.test(w)),
  before, after: vis('needs bond'),
}));
'''
bp = subprocess.run(['node', '-e', probe_js], capture_output=True, text=True)
ok('the bond-gate probe runs', bp.returncode == 0)
if bp.returncode == 0:
    b = json.loads(bp.stdout)
    ok('a numeric gate on a DECLARED @ROLE no longer warns — the one way to use 44 authored bonds stopped telling authors they were wrong',
       b['roleGateWarns'] is False)
    ok('and a genuinely unknown gate key STILL warns — the ruler was fixed, not switched off',
       b['bogusGateWarns'] is True)
    ok('the bond gate really GATES: the option is hidden before the bond and open after it',
       b['before'] is False and b['after'] is True)
else:
    print(bp.stderr[-600:])

print('')
print('  NOTE  %d @DO lines authored across the corpus' % r['authored_total'])
for k, v in r['totals'].items():
    if v:
        print('  NOTE  %-11s %d verb(s): %s'
              % (k, v, ', '.join(x['verb'] for x in rows if x['verdict'] == k)))
print('=== AUTHORED UNREAD GATE: %d passed, %d failed ===' % (passed, len(fails)))
sys.exit(1 if fails else 0)
