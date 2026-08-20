#!/usr/bin/env python3
"""
KILL THE FIXED SLEEPS (8/20/26, RUN lane, P0-SUITE fix 1).

Law: laws/BOHEMIA_COORDINATOR_SWEEP_8_19_26.md section 4, FIX 1 -- the sweep's
own "biggest single win and the least risky: it changes no assertion".

WHAT IT DOES, and it is deliberately the dumbest transformation that works:

    await pg.waitForTimeout(2500)   ->   await SETTLE(pg, 2500)

SETTLE polls for the page to stop changing and returns the moment it has, with
the ORIGINAL NUMBER AS A CEILING it can never exceed. So the worst case is
exactly today's behaviour, no gate can get slower, and only the typical case
improves. gates/bohemia_settle.js carries the reasoning.

WHY MECHANICAL RATHER THAN PER-GATE. 399 call sites across 125 files. Hand-
writing the right condition at each one is the honest ideal and is what the
dayloop gate does, but it means reading 125 gates' intent, and a mistake there
CHANGES WHAT A GATE CLAIMS -- the one thing the sweep law forbids. The generic
form cannot change a claim: it either waits the same time or less, and every
assertion runs against the same page it would have.

WHAT IT REFUSES TO TOUCH, because a rewrite that guesses is the disease:
  - anything inside a string or a template literal. suite_honesty_gate.js WRITES
    `time.sleep(300)` into fixture scripts as TEXT; rewriting that would corrupt
    a gate whose whole job is testing the runner's timeout behaviour.
  - a non-constant argument (`waitForTimeout(n)`), which is already a variable
    and not a guess this pass can improve.
  - a commented-out line.
  - a file that already imports settle (idempotent).

VERIFY, DO NOT ASSUME: --check prints what it would do and writes nothing.

Usage:
    python3 tools/bohemia_kill_fixed_sleeps.py --check
    python3 tools/bohemia_kill_fixed_sleeps.py
"""
import glob
import os
import re
import sys

CALL = re.compile(r'\b([A-Za-z_$][\w$]*)\.waitForTimeout\(\s*(\d+)\s*\)')
REQ = "const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');\n"

SKIP = {'bohemia_settle.js', 'suite_honesty_gate.js'}


def strip_strings(line):
    """blank out quoted spans so a match inside one is invisible.

    suite_honesty_gate.js writes `time.sleep(300)` into fixture files as TEXT.
    A rewriter that cannot tell a mention from a use is the broken one (the
    8/1 craft law says exactly this about checkers).
    """
    out, i, n = [], 0, len(line)
    quote = None
    while i < n:
        c = line[i]
        if quote:
            out.append(' ')
            if c == '\\':
                out.append(' ')
                i += 2
                continue
            if c == quote:
                quote = None
            i += 1
            continue
        if c in '\'"`':
            quote = c
            out.append(' ')
            i += 1
            continue
        out.append(c)
        i += 1
    return ''.join(out)


def convert(path, check):
    src = open(path, encoding='utf8').read()
    if 'bohemia_settle.js' in src:
        return 0, 0
    lines = src.split('\n')
    hits, saved_ceiling = 0, 0
    for idx, line in enumerate(lines):
        stripped = line.lstrip()
        if stripped.startswith('//') or stripped.startswith('*'):
            continue
        masked = strip_strings(line)
        if not CALL.search(masked):
            continue
        # rewrite only the spans that survived masking
        new, last, pos = [], 0, 0
        for m in CALL.finditer(masked):
            new.append(line[last:m.start()])
            new.append('SETTLE(%s, %s)' % (m.group(1), m.group(2)))
            last = m.end()
            hits += 1
            saved_ceiling += int(m.group(2))
        new.append(line[last:])
        cand = ''.join(new)
        # `await pg.waitForTimeout(x)` is already awaited; a bare one was fire
        # and forget and stays that way -- changing that would change ordering.
        lines[idx] = cand
    if not hits:
        return 0, 0
    if check:
        return hits, saved_ceiling
    body = '\n'.join(lines)
    # insert the require after 'use strict' if present, else after the banner
    m = re.search(r"^'use strict';\s*$", body, re.M)
    if m:
        body = body[:m.end()] + '\n' + REQ.rstrip('\n') + body[m.end():]
    elif body.startswith('#!'):
        # A SHEBANG MUST STAY ON LINE 1. Nine gates are executable scripts and
        # putting the require above `#!/usr/bin/env node` makes node parse the
        # shebang as code -- caught by checking every file still parses, which
        # is why that check runs before anything is trusted.
        nl = body.index('\n') + 1
        body = body[:nl] + REQ + body[nl:]
    else:
        body = REQ + body
    open(path, 'w', encoding='utf8').write(body)
    return hits, saved_ceiling


def main():
    check = '--check' in sys.argv
    files = sorted(glob.glob('gates/*.js'))
    tot_h, tot_ms, touched = 0, 0, 0
    for p in files:
        if os.path.basename(p) in SKIP:
            continue
        h, ms = convert(p, check)
        if h:
            touched += 1
            tot_h += h
            tot_ms += ms
            if check:
                print('  %-42s %3d calls  %6.1fs ceiling' % (p.split('/')[-1], h, ms / 1000))
    print('%s %d call site(s) in %d file(s); %.1f min of CEILING now polled'
          % ('WOULD CONVERT' if check else 'CONVERTED', tot_h, touched, tot_ms / 60000))


if __name__ == '__main__':
    main()
