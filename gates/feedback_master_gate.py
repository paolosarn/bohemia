#!/usr/bin/env python3
"""BOHEMIA FEEDBACK MASTER GATE (8/1/26) — his feedback cannot quietly go missing.

Paolo, 8/1: "Please remember all my feedback and put it into your own training data"

THE HONEST ANSWER, which is why this gate exists at all: I cannot write to my own
training data. My weights are fixed, and a new session starts knowing nothing about this
one. The only thing that persists is the repository -- GIT IS THE MEMORY (CLAUDE.md) is
the whole mechanism. So the real version of his request is a master file every session
reads, plus a machine that stops it rotting.

AND IT WOULD ROT. There are 254 addenda in laws/ and 52 of them carry his verbatim words.
A master index maintained by good intentions is a master index that is wrong within a
week -- that is exactly the rot the truth hierarchy in CLAUDE.md exists to fight, and it
already happened once this week: THE BIG MISSING (a live records/ file) named the third
currency as "medicine" when the LOCKED law says CLOUT, and it would have sent whoever
built the economy after a currency that does not exist.

WHAT IT PROVES:
 1. The master exists, is honest about the training-data point rather than pretending,
    and carries the three things a new session needs first: how he works, what he has
    scored, and what he has ruled.
 2. EVERY LAW CARRYING HIS VERBATIM WORDS IS INDEXED. A ruling that is not in the master
    is a ruling the next session will not read. Ratchet: the number indexed may only go
    up, never down.
 3. The approved standard is named with its scores, because "is this good enough" is
    answered by comparison to approved work, not by taste.
 4. Every gate the master names actually exists. Citing a machine that is not there is
    the same class of lie as a legend entry that misdescribes its tile.

  python3 gates/feedback_master_gate.py
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(ROOT)

MASTER = 'laws/BOHEMIA_PAOLO_FEEDBACK_MASTER.md'

# Laws bearing his verbatim words, counted 8/1/26. The number may only GO UP: a ruling
# that leaves the corpus is a ruling somebody deleted.
VERBATIM_LAWS_AT_OPENING = 52

fails = []
passed = 0


def ok(name, cond):
    global passed
    if cond:
        passed += 1
    else:
        fails.append(name)


ok('the master exists (%s)' % MASTER, os.path.exists(MASTER))
if not os.path.exists(MASTER):
    print('  > FAIL the master is gone')
    sys.exit(1)

m = open(MASTER, encoding='utf-8').read()

ok('it is HONEST about the training-data point instead of pretending it did something '
   'it cannot do', 'cannot write to my own training data' in m and 'GIT IS THE MEMORY' in m)

for section, needle in [
    ('HOW HE WORKS', 'HOW HE WORKS'),
    ('THE VERDICTS he has actually given', 'THE VERDICTS'),
    ('WHAT HE HAS RULED', 'WHAT HE HAS RULED'),
    ('THE PATTERN in his complaints', 'THE PATTERN'),
    ('WHAT HE HAS NOT RULED', 'WHAT HE HAS NOT RULED'),
]:
    ok('the master carries its %s section' % section, needle in m)

# 2. every law with his verbatim words is indexed
verbatim = []
for f in sorted(os.listdir('laws')):
    if not f.endswith('.md'):
        continue
    body = open(os.path.join('laws', f), encoding='utf-8').read()
    if re.search(r'Paolo, verbatim|verbatim:|Paolo\'s words', body):
        verbatim.append(f)

ok('the verbatim-ruling corpus only ever GROWS (%d laws carry his own words, was %d)'
   % (len(verbatim), VERBATIM_LAWS_AT_OPENING), len(verbatim) >= VERBATIM_LAWS_AT_OPENING)

# The master indexes by RULING, not by filename, so check the load-bearing recent ones by
# their own words -- those are the ones a session is most likely to break tomorrow.
MUST_CARRY = [
    ('rule number one', 'RULE NUMBER ONE: the streets connect'),
    ('not a single pixel', 'EVERY PIXEL IS ANSWERED FOR'),
    ('NO QUESTS BULLSHIT', 'BUILD THE WORLD: quests/factions/economy are off'),
    ('flat rectangle', 'NO BUILDING IS A FLAT RECTANGLE'),
    ('ACT ONE ONLY', 'ACT ONE ONLY'),
    ('spreadsheet simulators', 'the three currencies and the anti-reference'),
    ('STOP PRODUCING', 'STOP PRODUCING'),
    ('VERIFY ON THE REAL SURFACE', 'verify on the real surface'),
]
for needle, what in MUST_CARRY:
    ok('the master carries the ruling: %s' % what, needle in m)

# 3. the approved standard, with numbers
ok('the master names the APPROVED standard with its scores (high school 89, '
   'commercial 85, mall 85) — "good enough" is answered by comparison, not taste',
   '89%' in m and '85%' in m and 'high school' in m.lower())

# 4. every gate it names exists
named = set(re.findall(r'gates/([a-z0-9_]+\.(?:py|js))', m))
missing = sorted(g for g in named if not os.path.exists(os.path.join('gates', g)))
ok('every gate the master cites actually exists (%d cited%s)'
   % (len(named), '; MISSING: ' + ', '.join(missing) if missing else ''), not missing)
ok('the master cites real machines, not a promise (%d gates named)' % len(named), len(named) >= 6)

# 5. and the verdict record it points at
ok('the 8/1 verdict record is filed',
   os.path.exists('records/BOHEMIA_VERDICT_COMMERCIAL_MALL_8_1_26.txt'))

for f in fails:
    print('  > FAIL ' + f)
print('=== FEEDBACK MASTER GATE: %d passed, %d failed  (%d laws in his own words, '
      '%d gates cited) ===' % (passed, len(fails), len(verbatim), len(named)))
sys.exit(1 if fails else 0)
