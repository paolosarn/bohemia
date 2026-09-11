#!/usr/bin/env python3
"""
BOHEMIA LAW INDEX GATE -- CLAUDE.md MAY NOT ADVERTISE A GATE THAT IS NOT THERE.
(9/11/26, PLUMBER lane, VAMILY row [gate missing])

REUSE CHECK (REUSE-FIRST, Paolo 7/22): opens no bank and cooks no pixels. It reads
CLAUDE.md's own law index and the gates/ folder, and holds one against the other.

WHY IT EXISTS, AND IT IS NOT THE ART LAW. The row that produced this file was
"THE COMPARE LAW HAS NO CHECKER": CLAUDE.md's law index listed
`| gate reference_check_gate` beside a LOCKED law (COMPARE EVERY PIECE OF ART TO
THE WORLD, Paolo 9/4) while no such file existed. EYES E11 found it on 9/7.
DIRECTION then built that gate, and it is theirs and it is good.

But the ART half of that row was only the symptom. THE DEFECT WAS IN THE INDEX:
the file every chat reads first said a law was machine-enforced, every chat
believed it, and nothing ran for three days. "A LAW WITHOUT A MACHINE GATE IS NOT
ENFORCED" (7/16) has a hole under it -- A LAW WITH AN IMAGINARY GATE IS WORSE
THAN ONE WITH NO GATE, because the first one stops anybody looking.

That hole is not about art and cannot be closed by an art gate. It is the same
shape as the two the PLUMBER lane closed on 9/7 and 9/11:
  [unregistered gates]  a gate the SUITE cannot see       -> gate_registry_gate.js
  this one              a gate the LAW INDEX invents      -> here
Between them: a gate file that nothing runs is red, and a gate name that nothing
backs is red. A claim of enforcement now has to be true in both directions.

WHAT MAKES IT RED:
  - a `| gate <name>` in CLAUDE.md with no gates/<name>.py, .js or <name> on disk
  - a gate advertised but NOT registered in the suite, so it exists and never runs
    (the 9/7 law: "a gate that never runs is not a gate")
  - the index parsing to nothing, or gates/ reading as empty (the anti-silent-pass
    floors: a sweep that found no claims agrees with everything perfectly, and
    this whole file is about a check that looked like it passed while doing
    nothing)

WHAT IT DELIBERATELY DOES NOT DO: judge whether the gate is any GOOD, or whether
it truly enforces the law beside it. A machine cannot grade that. It holds the
one thing a machine can: the name resolves to a file, and the file is run.

  python3 gates/law_index_gate.py
"""
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

passed = 0
failed = []


def check(name, ok, detail=''):
    global passed
    if ok:
        passed += 1
    else:
        failed.append(name + ((': ' + detail) if detail else ''))
    print('  %s %s%s' % ('PASS' if ok else 'FAIL', name,
                         ('  (' + detail + ')') if detail else ''))


print('=== LAW INDEX GATE ===')
print('    every gate CLAUDE.md promises beside a law is a gate that exists and runs')

claude = open('CLAUDE.md', encoding='utf8').read()
# the law index's own shape: "- SOME LAW -> laws/FILE.md | gate some_gate.js"
advertised = sorted(set(re.findall(r'\|\s*gate\s+([A-Za-z0-9_]+(?:\.[a-z]+)?)', claude)))

registry = open('gates/bohemia_gates.py', encoding='utf8').read()

# ---- the floors, before any verdict -------------------------------------
check('CLAUDE.md actually named some gates', len(advertised) > 10,
      '%d advertised beside laws' % len(advertised))
check('the suite registry was actually read', 'GATES = [' in registry and len(registry) > 10000,
      '%d chars' % len(registry))

# ---- 1. THE NAME RESOLVES TO A FILE -------------------------------------
def on_disk(name):
    for cand in (name, name + '.py', name + '.js'):
        if os.path.isfile(os.path.join('gates', cand)):
            return cand
    return None

resolved = {g: on_disk(g) for g in advertised}
missing = sorted(g for g, f in resolved.items() if not f)
check('every advertised gate exists on disk. A law index that names a file nobody '
      'wrote tells every chat the law is enforced and stops anybody looking -- worse '
      'than a law with no gate at all',
      not missing, ', '.join(missing) if missing else '%d resolved' % len(advertised))

# ---- 2. AND THE SUITE RUNS IT -------------------------------------------
# Existing is not enough: 9/7 proved a gate can exist, pass by hand, and never be
# executed by the suite. An advertised gate that nothing runs is the same lie one
# step further in.
unrun = sorted(g for g, f in resolved.items() if f and ('gates/' + f) not in registry)
check('every advertised gate is REGISTERED in the suite. A gate that exists and is '
      'never run is a law without a gate wearing a gate\'s clothes (9/7 law)',
      not unrun, ', '.join(unrun) if unrun else '%d registered' % len(advertised))

print()
print('    %d gates advertised in the law index; %d on disk; %d run by the suite.'
      % (len(advertised), len(advertised) - len(missing), len(advertised) - len(missing) - len(unrun)))

print()
print('=== %d passed / %d failed ===' % (passed, len(failed)))
if failed:
    for f in failed:
        print('  FAIL ' + f)
    sys.exit(1)
