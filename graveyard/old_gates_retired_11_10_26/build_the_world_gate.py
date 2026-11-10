#!/usr/bin/env python3
"""BOHEMIA BUILD-THE-WORLD GATE (7/31/26) — the ruling that turned three systems off.

Paolo, 7/31: "WE ARE NOT WORKING ON QUESTS AT ALL WE WILL CONTINUE TO BUILD THIS WORLD!
NO QUESTS BULLSHIT RIGHT NOW. NO FACTION SHIT EITHER! WE GOTTA BUILD THIS FUCKING WORLD!!!
AND MAKE IT LOOK GOOD DUMBASS"

Law: laws/BOHEMIA_ADDENDUM_BUILD_THE_WORLD_7_31_26.md. A LAW WITHOUT A MACHINE GATE IS NOT
ENFORCED (proven 7/16, when six of nine gated laws turned out to be already broken), so the
ruling gets one the same turn it lands.

WHAT THIS ACTUALLY GUARDS, and why it is shaped as a RATCHET rather than a ban:
quests, factions and the economy all EXIST already — a questbook of 152 studied quests, a
faction beat predicate, a purse that shipped hours before the ruling. Deleting them is not
what he asked for and would be its own kind of stupid. What he asked for is that NO MORE
gets built while the world is the work. So this gate freezes the FOOTPRINT of those three
systems at the moment of the ruling and fails if it GROWS. The named set may shrink; it may
never gain a member.

That is a real check with a real failure mode behind it. The way this lane broke the
direction was not by ignoring him — it was by finding a legitimate-looking item on a
coordinator's ranked list and building it, which is exactly what the STOP PRODUCING law
(7/26) means by "finding a legal way to ship anyway IS the violation". A frozen lane
produces nothing in the frozen area. A ranked list in records/ is not a ruling; the human
is.

Lifting the freeze is Paolo's call and it means editing this file, which is the point:
turning the systems back on has to be a deliberate act somebody signs, not a drift.

  python3 gates/build_the_world_gate.py
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(ROOT)

LAW = 'laws/BOHEMIA_ADDENDUM_BUILD_THE_WORLD_7_31_26.md'

# The footprint of the three frozen systems, AS IT STOOD when Paolo made the ruling on
# 7/31/26. This list is the ratchet. It may shrink. It may not grow while the ruling holds.
FROZEN_AT_RULING = {
    'quests': [
        'engine/bohemia_quest_runtime.js',
        'engine/bohemia_quest_placement.js',
        'engine/bohemia_bq.js',
        'engine/bohemia_bq_tests.js',
        'engine/bohemia_quest_runtime_tests.js',
    ],
    'factions': [
        'engine/bohemia_factions.js',
    ],
    'economy': [
        'engine/bohemia_economy.js',
        'engine/bohemia_purse.js',
    ],
}

PATTERNS = {
    'quests': re.compile(r'^engine/bohemia_(quest|bq)[a-z_]*\.js$'),
    'factions': re.compile(r'^engine/bohemia_faction[a-z_]*\.js$'),
    'economy': re.compile(r'^engine/bohemia_(econom|purse|money|ledger|market|price)[a-z_]*\.js$'),
}

fails = []
passed = 0


def ok(name, cond):
    global passed
    if cond:
        passed += 1
    else:
        fails.append(name)


_law_raw = open(LAW, encoding='utf-8').read() if os.path.exists(LAW) else ''
_law_flat = ' '.join(_law_raw.replace('>', ' ').split())   # the quote is a wrapped blockquote
ok('the ruling is written down and quotes him verbatim (%s)' % LAW,
   'NO QUESTS BULLSHIT RIGHT NOW' in _law_flat and 'MAKE IT LOOK GOOD' in _law_flat)

engine = sorted('engine/' + f for f in os.listdir('engine') if f.endswith('.js'))

for system, pattern in PATTERNS.items():
    found = [f for f in engine if pattern.match(f)]
    frozen = set(FROZEN_AT_RULING[system])
    grew = sorted(set(found) - frozen)
    ok('%s: FROZEN — the footprint has not grown since the ruling (%d module(s)%s)'
       % (system.upper(), len(found), '; NEW: ' + ', '.join(grew) if grew else ''),
       not grew)

# The purse shipped hours before the ruling and STAYS — it is done, green and empty. But
# nothing further is built on it, and the clearest machine-readable proof of "nothing
# further" is that its canon tables are still empty. (purse_gate.py owns this claim too;
# it is repeated here because THIS gate is the one that names the ruling as the reason.)
purse = open('engine/bohemia_purse.js', encoding='utf-8').read()
for table in ('PAYOUT', 'PRICES', 'PRODUCTION'):
    m = re.search(r'var %s = (\{[^}]*\})' % table, purse)
    ok('the economy stays where it stopped: %s is still empty (it is the system that '
       'triggered this ruling)' % table, bool(m) and m.group(1).strip() == '{}')

# The lane's own reply contract is the tell that got walked past: a WORLD turn with nothing
# to look at is a WORLD turn that missed. Keep that sentence in the law where it can be read.
lawtext = open(LAW, encoding='utf-8').read() if os.path.exists(LAW) else ''
ok('the law names the tell — a turn in this lane with nothing to look at is a turn that missed',
   'nothing to look at' in lawtext)
ok('the law names the deeper error — a coordinator\'s ranked list is not a ruling',
   'is not a ruling' in lawtext)
ok('the law records the approved standard the world is built to (the high school at 89%)',
   'HIGH SCHOOL' in lawtext and '89%' in lawtext)

for f in fails:
    print('  > FAIL ' + f)
print('=== BUILD-THE-WORLD GATE: %d passed, %d failed ===' % (passed, len(fails)))
sys.exit(1 if fails else 0)
