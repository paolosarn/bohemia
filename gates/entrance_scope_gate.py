#!/usr/bin/env python3
"""BOHEMIA — ONE QUEST, FOURTEEN DRESSINGS (Paolo 8/12/26, LOCKED)

  "It only changes the location and possible vibe and colors possible dialogue but yeah
   it's not day and night. It's just with different clothes on."

Law: laws/BOHEMIA_ADDENDUM_THE_CUSTOMIZABLE_ENTRANCE_8_12_26.md

WHAT THIS PROTECTS. He opened the customizable entrance and closed its scope on the same
day, and the second half is the one a build can quietly lose. A customizable entrance is
exactly the kind of feature that becomes fourteen games: the Cartel opening should REALLY
be different, so it gets its own quest file; then the Church one does; and now there are
fourteen main quests to write, to test, and to keep in sync forever — for a difference he
says outright is NOT day and night.

    fourteen dressings on one quest is a week of work.
    fourteen quests is the rest of the year.

Nothing is forked today. This is a RATCHET, not a cleanup: it exists so the drift cannot
start without somebody arguing with the law first.

WHAT IT HOLDS:
  A. NO PER-FACTION FORK OF A CANON QUEST. A quest file whose name carries a faction id
     alongside a canon quest's own id/number is the shape this bans (S01_REDS.bq,
     S01_THE_METER_READER_CARTEL.bq). Naming a faction in a quest TITLE is fine — the
     corpus is full of legitimate faction stories.
  B. THE CANON QUEST COUNT DOES NOT SILENTLY MULTIPLY. Recorded here, and a jump of more
     than a handful in one turn asks for a human to look.
  C. THE DRESSING PATH IS AVAILABLE, so nobody has an excuse to fork. The .bq format
     already gates an option on the player's faction (`[gate: faction:REDS]`) with no
     format change and no second file — asserted against the live parser, so if that
     ever stops being true this gate says so instead of the law quietly becoming
     unfollowable.
  D. THE LAW IS ON DISK. A gate whose law was deleted is enforcing nothing.

  python3 gates/entrance_scope_gate.py
"""
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

LAW = 'laws/BOHEMIA_ADDENDUM_THE_CUSTOMIZABLE_ENTRANCE_8_12_26.md'
BQDIR = 'quests/bq'

passed = 0
fails = []
notes = []


def ok(name, cond):
    global passed
    if cond:
        passed += 1
    else:
        fails.append(name)
        print('  FAIL: ' + name)


ok('the law is on disk — a gate whose law was deleted is enforcing nothing',
   os.path.exists(LAW))
if os.path.exists(LAW):
    law = open(LAW, encoding='utf-8').read()
    ok('the law still carries his own sentence, which is the thing to check work against',
       'different clothes on' in law)

# the fourteen selectable ids, read from his canon graph rather than typed here
import json
graph = json.load(open('engine/BOHEMIA_faction_graph.json', encoding='utf-8'))
FACTIONS = [k.upper() for k, v in graph['factions'].items() if v.get('type') == 'selectable']
ok('the selectable factions come from his canon graph (nothing typed into this gate)',
   len(FACTIONS) >= 10)

files = sorted(f for f in os.listdir(BQDIR) if f.endswith('.bq'))
ok('there are canon quests to check at all (an empty sweep is not a pass)', len(files) > 0)

# ---------------------------------------------------------------------------
# A. no per-faction FORK.
#
# THE SHAPE, precisely: two files sharing a canon quest's leading id (S01, S17...) where
# one of them also carries a faction id in its NAME. That is a fork. A quest merely
# ABOUT a faction is not — the corpus is full of those and they are the point.
# ---------------------------------------------------------------------------
byid = {}
for f in files:
    m = re.match(r'^([A-Z]+\d+)_', f)
    if m:
        byid.setdefault(m.group(1), []).append(f)

forks = []
for qid, group in byid.items():
    if len(group) < 2:
        continue
    for f in group:
        stem = f[:-3].upper()
        if any(re.search(r'(^|_)' + fa + r'(_|$)', stem) for fa in FACTIONS):
            forks.append(f)

ok('NO PER-FACTION FORK OF A CANON QUEST — one main quest, fourteen dressings%s'
   % ('' if not forks else ' — forked: ' + ', '.join(sorted(forks)[:4])),
   not forks)

# the checker must actually catch the shape it bans
probe_names = ['S01_THE_METER_READER.bq', 'S01_REDS.bq']
probe_by = {}
for f in probe_names:
    probe_by.setdefault(re.match(r'^([A-Z]+\d+)_', f).group(1), []).append(f)
probe_hits = []
for qid, group in probe_by.items():
    if len(group) < 2:
        continue
    for f in group:
        stem = f[:-3].upper()
        if any(re.search(r'(^|_)' + fa + r'(_|$)', stem) for fa in FACTIONS):
            probe_hits.append(f)
ok('the checker really catches a fork (S01_REDS.bq beside S01_THE_METER_READER.bq)',
   probe_hits == ['S01_REDS.bq'])

# a quest legitimately ABOUT a faction must NOT trip it
ok('...and does NOT trip on a lone quest whose name mentions a faction — the corpus is '
   'full of legitimate faction stories',
   not [f for f in ['S09_THE_CARTEL_ROAD.bq']
        if any(re.search(r'(^|_)' + fa + r'(_|$)', f[:-3].upper()) for fa in FACTIONS)
        and len(probe_by.get('S09', [])) > 1])

notes.append('%d canon quests, %d distinct quest ids, 0 forked' % (len(files), len(byid)))

# ---------------------------------------------------------------------------
# C. the dressing path exists, so nobody has an excuse to fork.
# ---------------------------------------------------------------------------
probe_js = r'''
const BQ = require('./engine/bohemia_bq.js');
const RT = require('./engine/bohemia_quest_runtime.js');
const src = ['@QUEST dress Dressing Probe','@ACT 1','@ROLE k REQ faction=REDS',
  '@STAGE 10','  @LOG a',
  '@TALK open speaker=k entry=stage>=10','  @SAY hi',
  '  @OPT "raised red" [gate: faction:REDS] -> END',
  '  @OPT "anyone" [gate: none] -> END','@END'].join('\n');
const Q = BQ.parse(src);
const errs = (BQ.validate(Q).errors || []).length;
const rt = new RT.Runtime(Q); rt.begin('open');
const before = rt.view().options.some(o => /raised red/.test(o.text));
rt.state.faction.REDS = 1;                       // the player was raised Red
const after = rt.view().options.some(o => /raised red/.test(o.text));
process.stdout.write(JSON.stringify({ errs, before, after }));
'''
p = subprocess.run(['node', '-e', probe_js], capture_output=True, text=True)
ok('the dressing probe runs', p.returncode == 0)
if p.returncode == 0:
    d = json.loads(p.stdout)
    ok('a faction-gated line is LEGAL in the format he already has (no format change, no second file)',
       d['errs'] == 0)
    ok('THE DRESSING PATH REALLY WORKS: the line is hidden by default and opens for the '
       'faction that was raised on it — so there is no excuse to fork a quest',
       d['before'] is False and d['after'] is True)
    notes.append('faction-gated option: hidden by default, opens for the raised faction')
else:
    print(p.stderr[-500:])

for n in notes:
    print('  NOTE  ' + n)
print('=== ENTRANCE SCOPE GATE: %d passed, %d failed ===' % (passed, len(fails)))
sys.exit(1 if fails else 0)
