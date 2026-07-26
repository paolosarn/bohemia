#!/usr/bin/env python3
"""
BOHEMIA MASTER PALETTE (7/26/26) — amendment B/D of the art-first reset asks for
a LOCKED MASTER PALETTE that every pixel indexes.

This derives that palette from the three target screens, which are themselves
built only from art Paolo approved — so the master palette is not invented, it
is the approved corpus's own colour, measured and pinned.

IT ALSO REPORTS THE TRUTH ABOUT THE GAP: the approved corpus is currently NOT
indexed art. The three plates carry tens of thousands of unique colours because
the source tiles were cooked as continuous-tone material, not as a ramp. So the
palette below is the TARGET the act-1 tileset gets quantized to when it is
built (ART item 2), and this file records both the ramp and the measured
distance from it. Nothing here claims the corpus already complies.

REUSE CHECK: this tool cooks NO new graphic pixels. It reads the three already
rendered target plates (records/target/BOHEMIA_TARGET_*.png), which are
themselves composed only of banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt,
banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt,
banks/BOHEMIA_STREET_PROP_POOLS_7_18_26.txt,
banks/BOHEMIA_DESERT_POOLS_7_18_26.txt,
banks/BOHEMIA_LAMP_DARK_VARIANTS_7_14_26.txt,
banks/BOHEMIA_MOUNTED_SIGNS_7_13_26.txt and
banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt, and quantizes them. The swatch
sheet it writes is a chart of those measured colours, not new art.

TASTE CHECK: no candidate batch is emitted, so there is nothing to pre-kill.
The one taste rule that bites here is PURPLE RESERVATION — the ramp is swept by
gates/bohemia_purity_gate.py like every other image in the repo, and any purple
that appears in it would be a violation in the SOURCE tiles, not here.

  python3 tools/bohemia_master_palette.py
    -> records/target/BOHEMIA_MASTER_PALETTE.json
    -> records/target/BOHEMIA_MASTER_PALETTE.png
"""
import json
import os
from collections import Counter

from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
OUT = 'records/target'
KEYS = ('A_FRONTFACE', 'B_ISOBLOCK', 'C_CUTAWAY')
N = 64                     # the ramp size the act-1 tileset gets quantized to


def main():
    plates = [Image.open(os.path.join(OUT, 'BOHEMIA_TARGET_%s.png' % k)).convert('RGB')
              for k in KEYS]
    w = min(p.width for p in plates) // 2
    h = min(p.height for p in plates) // 2
    stack = Image.new('RGB', (w * len(plates), h))
    for i, p in enumerate(plates):
        stack.paste(p.resize((w, h), Image.NEAREST), (i * w, 0))
    q = stack.quantize(colors=N, method=Image.MEDIANCUT, dither=Image.NONE)
    pal = q.getpalette()[:N * 3]
    ramp = [tuple(pal[i * 3:i * 3 + 3]) for i in range(N)]
    ramp.sort(key=lambda c: (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]))

    raw = stack.tobytes()
    uniq = len(Counter(raw[i:i + 3] for i in range(0, len(raw), 3)))

    doc = {
        'version': 'BOHEMIA_MASTER_PALETTE_v1',
        'built': '2026-07-26',
        'law': ('art-first reset amendments B + D: locked master palette, every pixel '
                'indexes it'),
        'status': ('DERIVED FROM APPROVED ART, NOT YET ENFORCED ON THE CORPUS. The source '
                   'tiles were cooked as continuous-tone material, so they do not index a '
                   'ramp today. This is the ramp the ACT-1 TILESET gets quantized to when '
                   'it is built (ART backlog item 2); until then the number below is the '
                   'measured distance, tracked so it can only shrink.'),
        'ramp_size': N,
        'ramp_hex': ['#%02x%02x%02x' % c for c in ramp],
        'ramp_rgb': [list(c) for c in ramp],
        'measured_unique_colours_in_target_plates': uniq,
        'ceiling': 80000,
        'ceiling_note': ('a tracked ceiling, not a pass. It exists so a future cook cannot '
                         'quietly make the palette problem WORSE while the real fix waits '
                         'on the tileset.'),
    }
    with open(os.path.join(OUT, 'BOHEMIA_MASTER_PALETTE.json'), 'w') as f:
        json.dump(doc, f, indent=1)

    sw, cols = 44, 8
    rows = (N + cols - 1) // cols
    sheet = Image.new('RGB', (cols * sw, rows * sw), (12, 12, 10))
    for i, c in enumerate(ramp):
        x, y = (i % cols) * sw, (i // cols) * sw
        sheet.paste(Image.new('RGB', (sw - 2, sw - 2), c), (x + 1, y + 1))
    sheet.save(os.path.join(OUT, 'BOHEMIA_MASTER_PALETTE.png'))
    print('OK  %d-colour ramp derived; target plates currently carry %d unique colours'
          % (N, uniq))


if __name__ == '__main__':
    main()
