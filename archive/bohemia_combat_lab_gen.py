#!/usr/bin/env python3
"""BOHEMIA — BEAT TACTICS LAB generator (7/19/26, COMBAT session).

Factory law: template in, slice out. The Dead Eye Dial motion engine is
NEVER hand-copied: this generator extracts the canonical ENGINE START..END
block LIVE from the alpha's COMBAT_B64 (the one canonical body of the dial
engine) and stamps it into the lab. Re-running always re-syncs the stamp.
combat_lab_gate.js verifies the stamp is byte-identical to the alpha's.

Usage: python3 tools/bohemia_combat_lab_gen.py
Writes: slices/BOHEMIA_COMBAT_LAB_7_19_26.html
"""
import base64, re, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
TEMPLATE = os.path.join(ROOT, 'tools', 'bohemia_combat_lab_template.html')
OUT = os.path.join(ROOT, 'slices', 'BOHEMIA_COMBAT_LAB_7_19_26.html')
STAMP_MARK = '<!--ENGINE_STAMP-->'


def engine_block_from_alpha():
    src = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64='([^']+)'", src)
    if not m:
        sys.exit('FAIL: COMBAT_B64 not found in alpha')
    demo = base64.b64decode(m.group(1)).decode('utf-8')
    a = demo.index('<!-- ENGINE START')
    b = demo.index('<!-- ENGINE END')
    end = demo.index('-->', b) + 3
    return demo[a:end]


def main():
    block = engine_block_from_alpha()
    tpl = open(TEMPLATE, encoding='utf-8').read()
    if STAMP_MARK not in tpl:
        sys.exit('FAIL: template missing ' + STAMP_MARK)
    out = tpl.replace(STAMP_MARK, block, 1)
    open(OUT, 'w', encoding='utf-8').write(out)
    print('OK: wrote %s (%d chars, engine stamp %d chars)' %
          (os.path.relpath(OUT, ROOT), len(out), len(block)))


if __name__ == '__main__':
    main()
