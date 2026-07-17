#!/usr/bin/env python3
"""
BOHEMIA GUARDED INTAKE (7/16/26)

Paolo drops uploads every turn. Some of them are older copies of files I have
already edited this session. A blind `cp uploads/* .` silently reverts the
engine — that has now happened twice in one session, and the only reason it
was caught both times is that the sync gate ran afterwards.

A gate that catches a revert after the fact is worse than an intake that
cannot perform one.

Rules:
  - A file that does not exist in the working dir: copied. No question.
  - A file that exists and is byte-identical: skipped.
  - A file that exists, DIFFERS, and is DECLARED CANON in
    bohemia_sync_canon.txt: NOT overwritten. Kept as `<name>.incoming` and
    reported, so the diff is a decision instead of an accident.
  - A file that exists and differs but is not canon: copied, and the old one
    is kept as `<name>.prev` so nothing is ever destroyed.

  python3 bohemia_intake.py [uploads_dir] [work_dir]
"""
import sys, os, shutil, filecmp, hashlib

CANON_FILE = 'bohemia_sync_canon.txt'
TOUCHED_FILE = 'bohemia_touched.txt'   # explicit additions
OUTPUTS = '/mnt/user-data/outputs'     # THE manifest — see below

def md5(p):
    return hashlib.md5(open(p, 'rb').read()).hexdigest()

def canon_files(work):
    """Every file an upload must never silently replace.

    Two kinds:
      1. Files declared canon in bohemia_sync_canon.txt.
      2. ANY working .js/.html that carries a `const BOH_` module. A carrier is
         a carrier: reverting bohemia_slice_core.js is exactly as bad as
         reverting the declared canon file, because the sync gate then has to
         decide which of two live bodies is right. Protect the carrier, not
         just the label."""
    out = set()
    # 3. ANYTHING CLAUDE HAS SHIPPED. The outputs directory IS the manifest:
    #    a file only lands there because Claude authored or corrected it, and
    #    present_files runs every ship turn, so the list maintains itself.
    #
    #    Three reverts taught this in one session. First the engine carriers
    #    (protected them). Then five corrected DOCS (protected those by hand).
    #    Then bohemia_purity_gate.py — a python gate, not a carrier, not on the
    #    hand-written list — silently went back to v1 and crashed. Every
    #    hand-maintained list of what matters is a list that will be incomplete
    #    at the exact moment it counts. So: derive it.
    if os.path.isdir(OUTPUTS):
        for fn in os.listdir(OUTPUTS):
            out.add(fn)
    # 4. explicit additions, for anything not shipped yet
    p = os.path.join(work, TOUCHED_FILE)
    if os.path.exists(p):
        for line in open(p, encoding='utf-8'):
            line = line.strip()
            if line and not line.startswith('#'):
                out.add(line)
    for fn in os.listdir(work):
        if not fn.endswith(('.js', '.html')):
            continue
        try:
            head = open(os.path.join(work, fn), encoding='utf-8', errors='replace').read()
        except Exception:
            continue
        if 'const BOH_' in head:
            out.add(fn)
    p = os.path.join(work, CANON_FILE)
    if not os.path.exists(p):
        return out
    for line in open(p, encoding='utf-8'):
        line = line.split('#')[0].strip()
        if not line:
            continue
        parts = line.split()
        if len(parts) >= 2:
            out.add(parts[1])
    return out

def main():
    up = sys.argv[1] if len(sys.argv) > 1 else '/mnt/user-data/uploads'
    work = sys.argv[2] if len(sys.argv) > 2 else '.'
    protected = canon_files(work)
    new = same = replaced = blocked = 0
    blocks = []

    for fn in sorted(os.listdir(up)):
        src = os.path.join(up, fn)
        if not os.path.isfile(src):
            continue
        dst = os.path.join(work, fn)

        if not os.path.exists(dst):
            shutil.copy2(src, dst); new += 1
            continue
        if filecmp.cmp(src, dst, shallow=False):
            same += 1
            continue
        if fn in protected:
            shutil.copy2(src, dst + '.incoming')
            blocked += 1
            blocks.append((fn, md5(src)[:12], md5(dst)[:12]))
            continue
        shutil.copy2(dst, dst + '.prev')
        shutil.copy2(src, dst); replaced += 1

    print('=' * 70)
    print('BOHEMIA GUARDED INTAKE')
    print('=' * 70)
    print(f'  new       {new}')
    print(f'  identical {same}')
    print(f'  replaced  {replaced}   (old copy kept as .prev)')
    print(f'  BLOCKED   {blocked}   (declared canon — upload kept as .incoming)')
    for fn, a, b in blocks:
        print(f'      {fn}')
        print(f'        upload  {a}')
        print(f'        canon   {b}   <- kept')
    if blocked:
        print('\n  These uploads are older copies of live engine files.')
        print('  Nothing was reverted. Diff the .incoming if a real change is in there.')
    return 0

if __name__ == '__main__':
    sys.exit(main())
