#!/usr/bin/env python3
"""
BOHEMIA — BAKE HIS THUMBS INTO THE BANK (8/20/26).

REUSE CHECK: cooks nothing. It reads a verdict file he produced and writes the
approved-sound bank. No pixel, no note, no candidate. The only thing it creates
is a JSON list of the ids he said yes to.

WHY IT EXISTS. The bank has been built by hand every sweep, and a hand-built
bank is how a thumb goes missing: BOHEMIA_SFX_APPROVED_8_17_26.json holds 148
sounds and nothing in the repo could regenerate it from his words. His verdicts
are a REPO FILE and the bank is derived, so the derivation should be a tool that
anyone can re-run and a gate can check.

WHAT IT WILL NOT DO. It never invents an approval and never keeps one whose
candidate no longer exists -- a thumb pointing at an id the engine does not cook
is a thumb pointing at nothing, and it is reported rather than silently carried.

  python3 tools/bohemia_sfx_bank_from_verdict.py records/BOHEMIA_SFX_VERDICT_8_20_26.txt
  python3 tools/bohemia_sfx_bank_from_verdict.py <verdict> --write
"""
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)


def cooked_ids():
    """every candidate the engine actually cooks, straight from the engine."""
    js = ("const S=require('./engine/bohemia_sfx.js');"
          "const o={};S.EVENTS.forEach(function(E){"
          "o[E.ev]=S.cook(E.ev,5).map(function(v){return v.id;});});"
          "console.log(JSON.stringify(o));")
    r = subprocess.run(['node', '-e', js], capture_output=True, text=True, timeout=300)
    if r.returncode != 0:
        raise SystemExit('the engine would not load:\n' + (r.stderr or '')[-800:])
    return json.loads(r.stdout.strip().splitlines()[-1])


def main():
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    src = sys.argv[1]
    write = '--write' in sys.argv
    txt = open(src, encoding='utf8').read()

    # THE UP BLOCK ONLY. The file also names what died, in prose, and a regex
    # loose enough to catch an id in a sentence would bake a corpse.
    m = re.search(r'^--- UP ---\s*$(.*?)^--- ', txt, re.S | re.M)
    if not m:
        raise SystemExit('no "--- UP ---" block in %s' % src)
    ids = re.findall(r'\b([a-z_]+)\.(\d)\b', m.group(1))

    cooked = cooked_ids()
    bank, missing = {}, []
    for ev, i in ids:
        if ev not in cooked or int(i) >= len(cooked[ev]):
            missing.append('%s.%s' % (ev, i))
            continue
        bank.setdefault(ev, [])
        if int(i) not in bank[ev]:
            bank[ev].append(int(i))
    for k in bank:
        bank[k].sort()

    print('=== %s ===' % src)
    print('  %d approvals across %d moments' % (sum(len(v) for v in bank.values()), len(bank)))
    if missing:
        print('  THUMBS POINTING AT NOTHING (the engine does not cook these): %s'
              % ', '.join(missing))

    old_path = 'banks/BOHEMIA_SFX_APPROVED_8_17_26.json'
    old = json.load(open(old_path, encoding='utf8')) if os.path.exists(old_path) else {}
    gained = {k: sorted(set(bank.get(k, [])) - set(old.get(k, []))) for k in bank}
    gained = {k: v for k, v in gained.items() if v}
    lost = {k: sorted(set(old.get(k, [])) - set(bank.get(k, []))) for k in old}
    lost = {k: v for k, v in lost.items() if v}
    print('  GAINED: %s' % (', '.join('%s%s' % (k, v) for k, v in sorted(gained.items())) or 'none'))
    print('  LOST:   %s' % (', '.join('%s%s' % (k, v) for k, v in sorted(lost.items())) or 'none'))

    if not write:
        print('\n(--write to bake it)')
        return 0
    out = 'banks/BOHEMIA_SFX_APPROVED_8_20_26.json'
    json.dump(bank, open(out, 'w', encoding='utf8'), indent=0, sort_keys=True)
    print('  wrote %s' % out)
    print('  NEXT: point BANK/VERDICT in tools/bohemia_sfx_wire_patch.py at it, '
          'then re-run that tool')
    return 0


if __name__ == '__main__':
    sys.exit(main())
