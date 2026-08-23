#!/usr/bin/env python3
"""
BOHEMIA BANK LAW GATE (7/28/26) - a ruling inside a bank is still a ruling.

THE SAME FAILURE HAPPENED THREE TIMES IN ONE DAY, 7/28:

  1. banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt has said "wall height min 2
     tiles" in its own `law` field since 7/14. The wall was drawn flat on the
     ground for ten days.
  2. banks/BOHEMIA_REAL_VEGAS_VERDICTS_R2_7_14_26.txt carries a `paolo_laws`
     block that says "per-cell wall shuffle BANNED". The game picked the wall
     tile with a per-cell hash.
  3. The cap in that same expression meant nine of his thirteen approved border
     walls had never once been drawn.

Every one was a written Paolo ruling, in the repo, obeyed by nothing. `/laws` is
indexed by BOHEMIA_CANON_INDEX and swept by gates; the BANKS were indexed by
nothing, and a `law` field inside a 2MB JSON blob is invisible to a human and to
every gate, so it may as well not exist.

A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED. This is that machine, for the
rulings that live in banks:

  CURRENT   records/BOHEMIA_BANK_LAW_INDEX.md is regenerable and matches what is
            in the banks RIGHT NOW - a new bank cannot land a rule that never
            reaches the index
  KNOWN     the rulings this session verified by hand are still present and still
            say what they said, so nobody edits one out quietly

  python3 gates/banklaw_gate.py
"""
import os
import subprocess
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
INDEX = 'records/BOHEMIA_BANK_LAW_INDEX.md'
TOOL = 'tools/bohemia_bank_law_index.py'

passed = failed = 0


def ok(name, cond):
    global passed, failed
    if cond:
        passed += 1
    else:
        failed += 1
        print('  FAIL: ' + name)


ok('the bank-law index tool exists', os.path.exists(TOOL))
ok('the bank-law index exists', os.path.exists(INDEX))
if failed:
    print('BANK LAW GATE: %d passed, %d failed' % (passed, failed))
    sys.exit(1)

before = open(INDEX, encoding='utf8').read()
# THE INDEX TOOL NOW REFUSES TO WRITE A SMALLER INDEX (8/22, RUN lane), and a
# refusal is a RED, not a traceback. It exits 1 when a bank file EXISTS but
# cannot be READ, because a swallowed read error silently dropped eight banks --
# PENDING PAOLO ones among them -- out of this very index today. check=True
# turned that into a CalledProcessError stack trace, which is a gate that cannot
# report. Read the reason and say it.
_r = subprocess.run([sys.executable, TOOL], capture_output=True, text=True)
if _r.returncode != 0:
    _why = (_r.stderr or _r.stdout or '').strip().split('\n')
    ok('the index tool could rebuild the index (' + (_why[0][:110] if _why else 'no reason given') + ')', False)
    for _l in _why[1:4]:
        print('      ' + _l.strip()[:120])
    print('BANK LAW GATE: %d passed, %d failed' % (passed, failed))
    sys.exit(1)
after = open(INDEX, encoding='utf8').read()
ok('THE INDEX IS CURRENT: regenerating it changes nothing - a bank cannot land a '
   'ruling that never reaches the index (run `python3 %s` the same turn any bank lands)' % TOOL,
   before == after)

# The rulings this session verified by hand, quoted from the banks. If one of
# these disappears or changes wording, that is a canon edit and it stops the ship.
MUST = [
    ('one_wall_per_community', 'per-cell wall shuffle BANNED'),
    ('gates_touch_streets', 'entrances must align with adjacent street network'),
    ('gated_is_rich', 'most Vegas communities are walled but NOT gated'),
    ('the perimeter wall height rule', 'wall height min 2 tiles'),
    ('the 85/15 tan direction', '85% of Vegas walls are desert yellow tan brick vibes'),
]
low = after.lower()
for name, quote in MUST:
    ok('the index still carries %s ("%s")' % (name, quote), quote.lower() in low)

# ALL THREE VEGAS SUBURB LAWS NOW HAVE A MACHINE. This block used to name two of
# them as deliberately ungated, which is the honest thing to do with a debt but a
# bad thing to leave standing for eighteen days. `gated_is_rich` and
# `gates_touch_streets` were closed 8/1 by gates/gated_is_rich_gate.js, which
# found that the world model never told the suburb generator WHICH district it
# was building - so all 2,582 ordinary suburbs in the valley were built as gated
# communities, the exact inversion of his ruling.
print('  (all three Vegas suburb laws are machine-held: one_wall_per_community by '
      'gates/wallclass_gate.js since 7/28; gated_is_rich and gates_touch_streets by '
      'gates/gated_is_rich_gate.js since 8/1.)')

print('BANK LAW GATE: %d passed, %d failed' % (passed, failed))
sys.exit(1 if failed else 0)
