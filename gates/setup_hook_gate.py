#!/usr/bin/env python3
"""
BOHEMIA - SETUP HOOK GATE. A fresh container can run its own gates.

BACKLOG SOUNDS #5, open since 7/29 and explicitly marked NON-COOK / any lane:
nine gates read pixels and need Pillow + numpy, a fresh container has neither,
and all nine die with ModuleNotFoundError at the END of a ~700 second suite run.
They read like nine real art failures. It cost one session a whole re-run to
discover it was one pip install.

bohemia_gates.py already WARNED about it. A warning is not a fix, and the half
of the item that stayed open said exactly that: "nothing installs it
automatically."

WHAT THIS GATE HOLDS, and every one of these was a way the fix could rot:
  1. the SessionStart hook exists and points at a script that exists
  2. the script never exits non-zero -- a session that cannot START is worse
     than a session with a missing library, and this runs before any work
  3. the script is a NO-OP when the stack is already there, so the common case
     costs one python startup instead of a pip round trip every session
  4. gates/requirements.txt still names both packages, so the hook cannot
     quietly install nothing
  5. the image stack is importable RIGHT NOW, which is the only thing the nine
     pixel gates actually care about

A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED, and a fix without one is a fix
that lasts until the next person edits the file.

  python3 gates/setup_hook_gate.py
"""
import json
import os
import subprocess
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

P = F = 0


def chk(ok, msg):
    global P, F
    if ok:
        P += 1
    else:
        F += 1
        print('  FAIL  ' + msg)


def main():
    print('=== SETUP HOOK GATE - a fresh container can run its own gates ===')

    SET = '.claude/settings.json'
    chk(os.path.exists(SET), 'no %s, so nothing runs at session start' % SET)
    if not os.path.exists(SET):
        print('  %d passed, %d FAILED' % (P, F))
        return 1

    try:
        cfg = json.load(open(SET))
    except Exception as e:
        chk(False, '%s is not valid JSON (%s) -- a broken settings file is worse '
                   'than none, it can stop a session starting at all' % (SET, e))
        print('  %d passed, %d FAILED' % (P, F))
        return 1

    cmds = []
    for grp in (cfg.get('hooks') or {}).get('SessionStart') or []:
        for h in grp.get('hooks') or []:
            if h.get('type') == 'command' and h.get('command'):
                cmds.append(h['command'])
    chk(bool(cmds), 'there is no SessionStart command hook')

    script = 'tools/bohemia_session_setup.sh'
    chk(any(script in c for c in cmds),
        'no SessionStart hook runs %s' % script)
    chk(os.path.exists(script), '%s does not exist, so the hook runs nothing' % script)
    if not os.path.exists(script):
        print('  %d passed, %d FAILED' % (P, F))
        return 1

    body = open(script, encoding='utf8').read()
    # 2. NEVER BLOCKS A SESSION.
    chk('exit 0' in body,
        '%s can exit non-zero. It runs BEFORE any work, so a failure here can '
        'stop the session starting -- which is worse than a missing library' % script)
    chk('set -e' not in body,
        '%s uses set -e, so any failing command aborts it mid-way and it stops '
        'being the safe no-op it has to be' % script)
    # 3. NO-OP WHEN THERE IS NOTHING TO DO.
    chk('import PIL, numpy' in body or 'import PIL,numpy' in body,
        '%s does not check before installing, so every session pays a pip round '
        'trip for nothing' % script)

    req = 'gates/requirements.txt'
    chk(os.path.exists(req), '%s is gone, so the hook installs nothing' % req)
    if os.path.exists(req):
        r = open(req, encoding='utf8').read()
        for pkg in ('Pillow', 'numpy'):
            chk(pkg in r, '%s no longer names %s' % (req, pkg))

    # THE HOOK RUNS CLEAN AND FAST WHEN THE STACK IS ALREADY THERE.
    run = subprocess.run(['sh', script], capture_output=True, text=True, timeout=300)
    chk(run.returncode == 0,
        'the hook exited %d; it must never fail a session start' % run.returncode)

    # 5. AND THE THING IT EXISTS FOR: the nine pixel gates can import.
    ok = subprocess.run([sys.executable, '-c', 'import PIL, numpy'],
                        capture_output=True).returncode == 0
    chk(ok, 'Pillow/numpy are STILL not importable after the hook ran, so the '
            'nine pixel gates will fail for a reason that has nothing to do '
            'with the art')

    print('  %d passed, %d FAILED' % (P, F))
    if not F:
        print('  a fresh container installs its own image stack and never blocks '
              'the session doing it.')
    return 1 if F else 0


if __name__ == '__main__':
    sys.exit(main())
