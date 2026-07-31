#!/usr/bin/env python3
"""
ANSWERED GATE (7/31/26, LAB lane)

Paolo 7/31: "BROTHER FOR BOHEMIA ITS NOT A ONE LIFE RUN IVE ANSWERED THIS LIKE 50
TIMESS!!!!!"

WHY THIS EXISTS. Twice in two turns I ended a reply by asking him a question that
canon had already answered -- whether a dead utility disappears or gets an owner
(settled by CLUSTERED POWER), and what happens to standing when a run ends
(settled in five separate law files: it is a DYNASTY, not a one-life run). Each
one cost him a reply and got a "wtf" and a "50 TIMESS".

The autonomy doctrine already requires every turn to end with a JUDGE THIS list.
NOTHING IN THE MACHINE CHECKED WHETHER THE QUESTIONS ON IT WERE REAL. A settled
question is worse than no question: it taxes the one human the whole apparatus
exists to protect and makes him re-litigate his own canon.

laws/BOHEMIA_ADDENDUM_NOTES_ARE_RULINGS_7_19_26.md says never make him re-confirm
his own WORDS. This gate is that rule one step further out: never make him
re-confirm his own LAWS. And it is a GATE rather than a note in a file, because a
promise to remember is precisely what failed twice.

WHAT IT DOES
  1. Reads the ```answered``` block in records/BOHEMIA_ANSWERED_QUESTIONS_INDEX.md.
  2. Proves every row cites a file that EXISTS (a citation to a deleted law is rot,
     and MECHANISM-MINE/CONTENTS-PAOLO'S means a row without a real ruling behind
     it has no business being here).
  3. Sweeps the handoff, the backlog and records/ for QUESTION-SHAPED text and
     fails if any of it matches a settled trigger.

WHAT IT DELIBERATELY DOES NOT DO
  It does not understand questions. It matches trigger phrases, which is crude and
  will sometimes be wrong. When it is wrong, SHARPEN THE TRIGGER -- never delete
  the row. And it only looks at question-shaped lines, because the index and the
  laws are REQUIRED to state these topics in order to settle them: a check that
  trips on its own prohibition is the mistake this repo has shipped five separate
  times now (lab_gate A10, A12, A24, Y18, and the ten-years-cold sweep).
"""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(ROOT)

INDEX = 'records/BOHEMIA_ANSWERED_QUESTIONS_INDEX.md'

passed = 0
failed = 0


def ok(name, cond):
    global passed, failed
    if cond:
        passed += 1
    else:
        failed += 1
        print('  FAIL: ' + name)


print('=' * 74)
print('ANSWERED GATE — never make him re-confirm his own laws')
print('=' * 74)

ok('A1 the index exists', os.path.exists(INDEX))
if not os.path.exists(INDEX):
    print('  cannot continue without the index')
    sys.exit(1)

text = open(INDEX, encoding='utf-8').read()

ok('A2 it quotes the ruling that caused it', 'IVE ANSWERED THIS LIKE 50 TIMESS' in text)
ok('A3 it says it is CONTENTS-PAOLO\'S, not mine to decide',
   'MECHANISM-MINE' in text and 'CONTENTS-PAOLO' in text)
ok('A4 it tells the reader what to do when the gate is wrong',
   'sharpen the trigger' in text.lower())

m = re.search(r'```answered\n(.*?)```', text, re.S)
ok('A5 the index carries a machine block', m is not None)
if not m:
    print('  cannot continue without the machine block')
    sys.exit(1)

rows = []
for line in m.group(1).split('\n'):
    line = line.strip()
    if not line or line.startswith('#'):
        continue
    parts = [p.strip() for p in line.split('|')]
    if len(parts) != 3:
        ok('A6 every row is trigger|answer|file (bad row: %r)' % line[:50], False)
        continue
    rows.append(parts)

ok('A6 every row parses as trigger|answer|file', True)
ok('A7 the index has real rows (%d)' % len(rows), len(rows) >= 10)

# every cited ruling must exist on disk
missing = sorted({r[2] for r in rows if not os.path.exists(r[2])})
ok('A8 every row cites a file that EXISTS' + (' (missing %s)' % ', '.join(missing) if missing else ''),
   not missing)

# no answer may be empty -- a row without an answer teaches nobody anything
blank = [r[0] for r in rows if len(r[1]) < 8]
ok('A9 every row actually states the answer' + (' (%s)' % ', '.join(blank) if blank else ''),
   not blank)

# a trigger so short it will match ordinary prose is a bug in the trigger
short = [r[0] for r in rows if len(r[0]) < 8]
ok('A10 no trigger is so short it will catch ordinary prose' +
   (' (%s)' % ', '.join(short) if short else ''), not short)

# ---------------------------------------------------------------------------
# THE SWEEP
# ---------------------------------------------------------------------------
# Files a session uses to ask him things. The index itself is excluded -- it is
# REQUIRED to state every settled question in order to settle it.
TARGETS = []
for f in ['00_START_HERE_NEXT_SESSION.md', 'BOHEMIA_BACKLOG.md']:
    if os.path.exists(f):
        TARGETS.append(f)
if os.path.isdir('records'):
    for f in sorted(os.listdir('records')):
        p = os.path.join('records', f)
        if os.path.isfile(p) and f.endswith(('.md', '.txt')) and p != INDEX:
            TARGETS.append(p)

# QUESTION-SHAPED means: it ends in a question mark, or it sits under a heading
# that solicits his input. Prose that merely mentions a settled topic is fine and
# is usually the record of the ruling itself.
ASK_CONTEXT = re.compile(
    r'(WHAT I NEED FROM YOU|JUDGE THIS|WAITING ON HIM|PENDING Paolo|\[PENDING|'
    r'QUESTIONS?, and|THE ONE QUESTION|TWO QUESTIONS)', re.I)

hits = []
for t in TARGETS:
    try:
        lines = open(t, encoding='utf-8', errors='replace').read().split('\n')
    except OSError:
        continue
    for i, line in enumerate(lines):
        low = line.lower()
        if '?' not in line:
            continue
        # is this line in an ASKING context? look back a few lines for the heading
        window = '\n'.join(lines[max(0, i - 12):i + 1])
        if not ASK_CONTEXT.search(window):
            continue
        for trig, ans, src in rows:
            if trig.lower() in low:
                hits.append('%s:%d asks "%s" — ALREADY RULED: %s (%s)'
                            % (t, i + 1, trig, ans, src))

ok('B1 NO SESSION IS ASKING HIM A QUESTION HE HAS ALREADY ANSWERED' +
   ('\n         ' + '\n         '.join(hits[:6]) if hits else ''), not hits)

# The two questions that caused this gate must be RECORDED AS WITHDRAWN, not merely
# absent. Absence loses the lesson; a withdrawal notice teaches the next session why.
#
# AND NOTE WHAT THIS CHECK USED TO BE. The first version grepped the handoff for the
# phrases "standing when the run ends" and "disappear... owner" and failed if it found
# them ANYWHERE -- which failed on my own paragraph EXPLAINING that the questions were
# withdrawn. A gate written specifically to stop a discipline failure, making the exact
# mistake this repo has now shipped six times: HUNTING A WORD INSTEAD OF A THING.
# B1 above already catches a live question, because it requires a '?' in an asking
# context. So these two only need to prove the withdrawal is on the record.
hand = open('00_START_HERE_NEXT_SESSION.md', encoding='utf-8', errors='replace').read() \
    if os.path.exists('00_START_HERE_NEXT_SESSION.md') else ''
ok('B2 the handoff RECORDS that the run-ends question was withdrawn, and why',
   'NOT A ONE LIFE RUN' in hand.upper() and 'DYNASTY' in hand.upper())
ok('B3 the handoff points the next session at the index that stops this',
   'BOHEMIA_ANSWERED_QUESTIONS_INDEX' in hand and 'answered_gate' in hand)

print('=' * 74)
print('  ANSWERED GATE: %d pass / %d fail  (%d settled questions, %d files swept)'
      % (passed, failed, len(rows), len(TARGETS)))
print('=' * 74)
sys.exit(1 if failed else 0)
