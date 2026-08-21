#!/usr/bin/env python3
"""
BOHEMIA — ADD A MOMENT TO THE FINGERPRINT LEDGER WITHOUT RE-FREEZING THE REST
(8/21/26, SOUND lane).

REUSE CHECK: renders nothing itself. It drives gates/sfx_render_gate.py --record,
which is the one measurement path this lane already trusts, and then throws away
every row that was already in the ledger.

WHY THIS EXISTS. Adding a single new moment moves the ROSTER, so sfx_render_gate
goes red with "the batch roster moved: 505 recorded vs 510 rendered". The obvious
fix is `--record`, and the obvious fix is DANGEROUS: --record rewrites the WHOLE
ledger from the current render, which silently re-freezes every sound Paolo has
already judged. That ledger's own header says why that matters:

    "A recipe edit MUST re-record here, deliberately, so a sound Paolo judged
     can never drift under him."

Thirteen of the rack's voices have internal Math.random, so a wholesale re-record
does not even reproduce the same numbers -- it quietly adopts whatever this run
happened to make as the new truth, and the drift protection for 500 judged
candidates is gone with no diff worth reading.

So: record to a SCRATCH ledger, keep the existing rows byte-for-byte, and append
only the ids that were genuinely not there before. A new moment gets a baseline;
nothing he judged is touched.

  python3 tools/bohemia_sfx_fingerprint_add.py            # show what would be added
  python3 tools/bohemia_sfx_fingerprint_add.py --write
"""
import os
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
FP = 'records/BOHEMIA_SFX_FINGERPRINTS_7_29_26.txt'


def rows(path):
    out = {}
    for ln in open(path, encoding='utf8'):
        body = ln.split('#')[0].strip()
        if not body:
            continue
        p = body.split()
        if len(p) >= 7:
            out[p[0]] = ln.rstrip('\n')
    return out


def main():
    write = '--write' in sys.argv
    if not os.path.exists(FP):
        raise SystemExit('no ledger at %s -- this tool ADDS to one, it does not '
                         'create the first one' % FP)

    bak = FP + '.keep'
    # CRASH RECOVERY, AND IT IS HERE BECAUSE IT HAPPENED (8/21). The restore
    # below sits in a `finally`, which does NOT run when the process is killed
    # outright -- the container was reclaimed mid-run and left a stray .keep
    # behind. That time the ledger survived, because .keep is written BEFORE the
    # record run and the kill landed first. It would not always. So: a .keep
    # sitting here means a previous run died between the copy and the restore,
    # and the ledger under it may be a WHOLESALE RE-RECORD -- exactly the state
    # this tool exists to prevent. Put the real one back before doing anything.
    if os.path.exists(bak):
        keep_rows, live_rows = rows(bak), rows(FP)
        if len(live_rows) != len(keep_rows):
            print('  RECOVERED: a previous run died mid-record and left the '
                  'ledger at %d rows. Restoring the %d saved rows.'
                  % (len(live_rows), len(keep_rows)))
            shutil.copy(bak, FP)
        os.unlink(bak)

    before_text = open(FP, encoding='utf8').read()
    before = rows(FP)
    shutil.copy(FP, bak)
    try:
        r = subprocess.run(['python3', 'gates/sfx_render_gate.py', '--record'],
                           capture_output=True, text=True, timeout=1800)
        if not os.path.exists(FP):
            raise SystemExit('the record run produced no ledger:\n'
                             + (r.stderr or r.stdout or '')[-800:])
        after = rows(FP)
    finally:
        # THE REAL LEDGER IS RESTORED NO MATTER WHAT. Even on a crash mid-run,
        # his 500 judged fingerprints go back exactly as they were.
        shutil.copy(bak, FP)
        os.unlink(bak)

    new = [k for k in after if k not in before]
    gone = [k for k in before if k not in after]
    print('=== fingerprint ledger ===')
    print('  recorded: %d rows   ledger: %d rows' % (len(after), len(before)))
    print('  NEW (would be appended): %s' % (', '.join(sorted(new)) or 'none'))
    print('  MISSING from the render: %s' % (', '.join(sorted(gone)) or 'none'))
    if gone:
        print('  A row in the ledger that no longer renders means a moment was '
              'REMOVED. That is not this tool\'s job -- do it deliberately.')
    if not new:
        print('  nothing to add')
        return 0
    if not write:
        print('\n(--write to append them)')
        return 0

    body = before_text.rstrip('\n')
    body += '\n' + '\n'.join(after[k] for k in sorted(new)) + '\n'
    open(FP, 'w', encoding='utf8').write(body)
    print('  appended %d row(s); every pre-existing row is byte-for-byte '
          'unchanged' % len(new))
    return 0


if __name__ == '__main__':
    sys.exit(main())
