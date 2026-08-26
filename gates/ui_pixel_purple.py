#!/usr/bin/env python3
"""
BOHEMIA — THE PURPLE TEST, ON REAL PIXELS (8/26/26, UI lane)

PURPLE RESERVATION (Paolo 7/10, LOCKED): purple/magenta/violet belongs to the
Amalgamation alone. "Scarcity is what gives it power."

gates/bohemia_purity_gate.py has enforced that for a month -- on the BANKS.
It walks 33 banks of embedded world art and it has never once looked at the
INTERFACE, which is why the workshop's own tab underline and the edge of every
selected button in the build were the Amalgamation's magenta and nothing
complained. A law enforced on the art and not on the screen is enforced on half
the pixels he sees.

This is the other half, and it reads the SCREEN, not the source: a PNG shot of
the real page in a real browser at iPhone size. Same arithmetic as the bank
gate, deliberately -- one law, one test, two surfaces.

  python3 gates/ui_pixel_purple.py SHOT.png [--max N]

Prints JSON. Exit 1 if the purple pixel count is over the allowance.
"""
import sys, json

try:
    import numpy as np
    from PIL import Image
except ImportError:
    print(json.dumps({'error': 'needs numpy + pillow'})); sys.exit(2)


def main():
    args = sys.argv[1:]
    if not args:
        print(json.dumps({'error': 'no image'})); sys.exit(2)
    path = args[0]
    cap = 0
    if '--max' in args:
        cap = int(args[args.index('--max') + 1])

    im = Image.open(path).convert('RGB')
    a = np.asarray(im).astype(int)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    # THE SAME THREE CLAUSES bohemia_purity_gate.py's check_png uses. Copying the
    # arithmetic is deliberate: two different tests for one law is two laws.
    mask = (r > g + 25) & (b > g + 25) & (r > 80)
    n = int(mask.sum())
    total = int(mask.size)

    out = {'file': path, 'w': im.size[0], 'h': im.size[1],
           'purple_px': n, 'total_px': total,
           'purple_pct': round(100.0 * n / total, 5), 'cap': cap}
    if n:
        ys, xs = np.nonzero(mask)
        # where, and what colour, so a failure is fixable instead of just true
        out['first_at'] = [int(xs[0]), int(ys[0])]
        out['sample_rgb'] = [int(r[ys[0], xs[0]]), int(g[ys[0], xs[0]]), int(b[ys[0], xs[0]])]
    print(json.dumps(out))
    sys.exit(1 if n > cap else 0)


if __name__ == '__main__':
    main()
