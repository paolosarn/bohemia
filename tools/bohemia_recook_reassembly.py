#!/usr/bin/env python3
"""
BOHEMIA — THE RE-COOKED SET, ON THE REAL FRAME (7/28/26)

A contact sheet of 42 tiles tells you the tiles changed. It does not tell you
whether the STREET changed, and the street is the only thing Paolo is ever going
to look at. Amendment C is explicit: the acceptance test is the frame rebuilt out
of the tile set on the real render path, not a swatch page.

So this takes the frozen reassembly - the exact frame Paolo verdicted CBB, same
map, same layout, same code - and swaps only the TILE IMAGES for the re-cooked
ones. Identical indices, identical positions, identical renderer. The only
variable in the whole picture is the craft.

REUSE CHECK: draws nothing. It reads slices/BOHEMIA_REASSEMBLY_7_26_26.html and
banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt and writes a second page.

  python3 tools/bohemia_recook_reassembly.py
    -> slices/BOHEMIA_REASSEMBLY_RECOOK_7_28_26.html
"""
import json
import os
import re

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

SRC_HTML = 'slices/BOHEMIA_REASSEMBLY_7_26_26.html'
OUT_HTML = 'slices/BOHEMIA_REASSEMBLY_RECOOK_7_28_26.html'
BANK = 'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt'
OLD_BANK = 'banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt'


def main():
    html = open(SRC_HTML).read()
    m = re.search(r'var D = (\{.*?\});\n', html, re.S)
    if not m:
        raise SystemExit('the reassembly page no longer carries a D block')
    D = json.loads(m.group(1))

    new = json.load(open(BANK))
    old = json.load(open(OLD_BANK))
    # INDEX BY ID, NOT BY POSITION. The page's tile indices were baked against
    # the old bank's ORDER; matching on order would silently paint a roof where
    # a road goes the first time anybody reorders a bank. The page does not carry
    # ids, so they are recovered by matching the page's tile bytes back to the
    # old bank, then looked up by id in the new one.
    old_by_b64 = {t['b64']: t['id'] for t in old['tiles']}
    new_by_id = {t['id']: t['b64'] for t in new['tiles']}
    swapped, missed = 0, []
    for t in D['tiles']:
        tid = old_by_b64.get(t['b64'])
        if tid is None:
            missed.append('(a tile on the page is not in the frozen bank)')
            continue
        if tid not in new_by_id:
            missed.append(tid)
            continue
        t['b64'] = new_by_id[tid]
        swapped += 1
    if missed:
        raise SystemExit('could not swap: %s' % ', '.join(missed[:6]))

    out = html[:m.start(1)] + json.dumps(D) + html[m.end(1):]
    out = out.replace('<title>REASSEMBLING', '<title>RECOOK-REASSEMBLING')
    out = out.replace("document.title = 'REASSEMBLED'",
                      "document.title = 'RECOOK-REASSEMBLED'")
    open(OUT_HTML, 'w').write(out)
    print('swapped %d/%d tiles -> %s' % (swapped, len(D['tiles']), OUT_HTML))


if __name__ == '__main__':
    main()
