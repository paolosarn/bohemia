#!/usr/bin/env python3
"""BOHEMIA MODULE RE-INLINE -- put one module's CANON body into every carrier.

ENGINE SYNC LAW: no module has two bodies. When an engine module changes, every
slice that inlines it has to catch up, and gates/bohemia_sync_gate.py refuses to
auto-fix on purpose ("Not auto-fixed on purpose. Re-inline from canon, then
re-run"). tools/bohemia_city_module_resync.py only ever updates the walked city,
so a module carried by nine slices came back DRIFTED with the city alone fixed --
which is exactly what happened to BOH_FLOORPLAN on 9/13 when [back of house] added
the casino's dry store.

*** IT USES THE SYNC GATE'S OWN READER. *** The body is found and bounded by
importing grab() from the gate itself rather than re-implementing balanced-brace
scanning here. A second extractor is a second chance to disagree with the checker,
and then the fix and the check argue about what a module body even is.

  python3 tools/bohemia_module_reinline.py BOH_FLOORPLAN
  python3 tools/bohemia_module_reinline.py BOH_FLOORPLAN --dry

Gate: gates/bohemia_sync_gate.py (run it after, always).
"""
import os
import sys
import importlib.util

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GATE = os.path.join(ROOT, 'gates', 'bohemia_sync_gate.py')


def load_gate():
    spec = importlib.util.spec_from_file_location('bohemia_sync_gate', GATE)
    mod = importlib.util.module_from_spec(spec)
    sys.argv = [GATE]                       # the gate reads argv at import time
    spec.loader.exec_module(mod)
    return mod


def carriers():
    out = []
    for dp, dn, fn in os.walk(ROOT):
        dn[:] = [d for d in dn if d not in ('.git', 'node_modules', '__pycache__')]
        for f in fn:
            if f.endswith(('.js', '.html')):
                out.append(os.path.join(dp, f))
    return out


def main():
    if len(sys.argv) < 2:
        sys.exit('usage: bohemia_module_reinline.py BOH_MODULE [--dry]')
    name = sys.argv[1]
    dry = '--dry' in sys.argv
    G = load_gate()

    canon = G.load_canon([ROOT]).get(name)
    if not canon:
        sys.exit('REFUSING: %s has no CANON carrier declared in '
                 'gates/bohemia_sync_canon.txt. Canon is DECLARED, never inferred.' % name)

    needle = 'const ' + name + '='
    src = None
    for p in carriers():
        if os.path.basename(p) != canon:
            continue
        text = open(p, encoding='utf8', errors='replace').read()
        i = text.find(needle)
        if i < 0:
            i = text.find('const ' + name + ' =')
        if i < 0:
            continue
        src = G.grab(text, i)
        break
    if not src:
        sys.exit('REFUSING: could not read a body for %s out of its canon %s.' % (name, canon))

    changed, same, skipped = [], 0, 0
    for p in carriers():
        if os.path.basename(p) == canon:
            continue
        text = open(p, encoding='utf8', errors='replace').read()
        i = text.find(needle)
        if i < 0:
            i = text.find('const ' + name + ' =')
        if i < 0:
            continue
        body = G.grab(text, i)
        if body is None:
            skipped += 1
            print('  SKIPPED (unreadable body): ' + os.path.relpath(p, ROOT))
            continue
        if G.normalize(body) == G.normalize(src):
            same += 1
            continue
        if not dry:
            open(p, 'w', encoding='utf8').write(text[:i] + src + text[i + len(body):])
        changed.append(os.path.relpath(p, ROOT))

    print('RE-INLINE %s from %s' % (name, canon))
    print('  already fresh : %d' % same)
    print('  %s: %d' % ('would rewrite' if dry else 'rewritten    ', len(changed)))
    for c in changed:
        print('      ' + c)
    if skipped:
        print('  UNREADABLE    : %d (left alone rather than guessed at)' % skipped)
    if not changed:
        print('  -> nothing to do')


if __name__ == '__main__':
    main()
