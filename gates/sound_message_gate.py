#!/usr/bin/env python3
"""
BOHEMIA SOUND-IS-A-MESSAGE GATE (8/25/26, SOUND lane) — SILENT-1 stays true.

ROUTED BY SWEEP 19 (coordinator): "a sound may be the best copy of a message; it
may never be the only copy." SOUND classifies, RUN draws. This gate holds the
classification half, which is the half this lane is authoritative about.

THE FAILURE IT EXISTS FOR IS THE ONE THAT ALWAYS HAPPENS HERE: a classification
made once, in a document, that silently stops describing the game. This lane has
found that exact shape five times in a week -- a bank two sweeps stale, a wire
attached to a panel nobody opens, a matcher that only knew half the call shapes.
A list of which sounds are messages is worth nothing the moment a new moment is
approved and nobody decides which column it goes in.

WHAT IT ASSERTS:
  1. EVERY APPROVED MOMENT HAS A COLUMN. A newly approved sound with no ruling
     on whether it carries a message FAILS, which forces the decision at the
     moment it becomes cheap instead of a year later.
  2. THE RECORD DESCRIBES THE LIVE BANK, not the bank it was written against.
  3. NOTHING DEAD IS LISTED AS A MESSAGE. `done_ring` was routed to this lane as
     one of the three information cues and it is a CORPSE -- 0 UP / 5 DOWN. A
     classification that lists a dead sound as carrying a message sends the other
     lane off to draw a twin for something the player will never hear.
  4. THE STINGS ARE IN SCOPE. The sweep said "a one-column pass over the rack",
     and the transaction family (taken/paid/done/missed) is not in the rack at
     all. A pass that walked only the SFX table would have missed every message
     in the game that the music carries.

Run from repo root:  python3 gates/sound_message_gate.py
"""
import glob
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
REC = 'records/BOHEMIA_SOUND_IS_A_MESSAGE_8_25_26.json'

P = F = 0


def ok(msg, cond):
    global P, F
    if cond:
        P += 1
    else:
        F += 1
        print('  FAIL  ' + msg)


def main():
    print('=== SOUND-IS-A-MESSAGE GATE — SILENT-1 stays true ===')
    ok('the classification exists (%s)' % REC, os.path.exists(REC))
    if not os.path.exists(REC):
        print('  %d passed, %d FAILED' % (P, F))
        return 1
    rec = json.load(open(REC, encoding='utf8'))
    rows = rec.get('rows') or {}
    bank = json.load(open(sorted(glob.glob('banks/BOHEMIA_SFX_APPROVED_*.json'))[-1],
                          encoding='utf8'))

    # 1 + 2. every approved moment has a column, and it is THIS bank
    missing = [e for e in bank if e not in rows]
    ok('every approved moment is classified (%s)'
       % (', '.join(sorted(missing)) or '%d moments, all with a column' % len(bank)),
       not missing)
    stale = [e for e in rows if not e.startswith('STING:') and e not in bank]
    ok('and nothing is classified that the bank no longer holds (%s)'
       % (', '.join(sorted(stale)) or 'none'), not stale)

    # 3. nothing dead is called a message
    eng = open('engine/bohemia_sfx.js', encoding='utf8').read()
    declared = set(re.findall(r"\{ ev: '([a-z_]+)'", eng))
    dead_msgs = [e for e, v in rows.items()
                 if v.get('kind') == 'INFORMATION' and not e.startswith('STING:')
                 and not bank.get(e)]
    ok('no DEAD sound is listed as carrying a message (%s)'
       % (', '.join(sorted(dead_msgs)) or 'none -- done_ring stayed out'),
       not dead_msgs)
    ok('done_ring specifically is NOT listed as a message: it was routed here as '
       'one of the three and it is a corpse (0 UP / 5 DOWN)',
       rows.get('done_ring') is None or
       rows['done_ring'].get('kind') != 'INFORMATION')

    # 4. the stings are in scope
    stings = [e for e in rows if e.startswith('STING:')]
    ok('the stings are classified too, since the transaction family is not in '
       'the rack the sweep described (%d)' % len(stings), len(stings) >= 4)
    for f in ('taken', 'paid', 'done', 'missed'):
        ok('the %s sting has a ruling' % f, ('STING:' + f) in rows)

    # 5. the shortlist is real: every INFORMATION row says what the message IS
    info = {e: v for e, v in rows.items() if v.get('kind') == 'INFORMATION'}
    ok('every information cue names the message it carries (%d)' % len(info),
       all(v.get('msg') and v.get('why') for v in info.values()))
    need = sorted(e for e, v in info.items() if v.get('twin') == 'NONE')
    ok('and the no-twin shortlist is stated for SILENT-2 (%s)'
       % (', '.join(need) or 'none'), bool(need))

    print('  %d passed, %d FAILED' % (P, F))
    if not F:
        print('  %d information, %d atmosphere. The %d with no twin are RUN\'s.'
              % (len(info),
                 sum(1 for v in rows.values() if v.get('kind') == 'ATMOSPHERE'),
                 len(need)))
    return 1 if F else 0


if __name__ == '__main__':
    sys.exit(main())
