#!/usr/bin/env python3
"""
BOHEMIA PURITY GATE v2 — LIBRARY SWEEP (7/16/26)

PURPLE RESERVATION LAW (Paolo, 7/10, LOCKED):
  Purple/magenta/violet is RESERVED. Only the hatch into the Network build and
  the Amalgamation's agents (purple iris, NeuroLink reveal) may carry it. No
  purple runes, no purple floors, no ambient purple decor.
  "Scarcity is what gives it power."

NO VOLCANO LAW (Paolo, 7/10, LOCKED): no lava-hot emissive pixels.

v1 took ONE repo path and understood ONE file format, so the law was something
someone had to remember to run, on one file, in the right shape. The library is
33 banks in half a dozen shapes now. A law enforced on one file out of 33 is not
enforced.

v2 walks EVERY bank in a tree, finds every embedded PNG wherever it sits in the
JSON, records its path, and checks it. One command, whole library.

  python3 bohemia_purity_gate.py                 # sweep
  python3 bohemia_purity_gate.py --file X.txt    # one bank
  python3 bohemia_purity_gate.py --strict        # exit 1 on any violation
  python3 bohemia_purity_gate.py --csv out.csv   # full violation list

ALLOWLIST: bohemia_purity_allow.txt — only what the law itself blesses.
"""
import json, base64, io, sys, os, re

try:
    import numpy as np
    from PIL import Image
except ImportError:
    print('purity gate needs numpy + pillow'); sys.exit(2)

ALLOW_FILE = 'bohemia_purity_allow.txt'
SAMPLE = 26

# LEARNED RULE #6 (Paolo, 7/10, LOCKED):
#   "Purity applies to STRUCTURAL surfaces (walls/floors/roofs/doors); emissive
#    PROPS (torches, fire barrels) are legal. Gate scoped accordingly."
#
# So NO VOLCANO is a law about SURFACES, not about everything with a hot pixel.
# A campfire has hot orange pixels because it is a campfire. Running the lava
# detector over the fire bank does not find a law violation, it finds fire.
# An unscoped gate that screams 1,450 times is a gate nobody reads.
#
# PURPLE is different: it applies EVERYWHERE except what the law blesses,
# because purple is a story tell, not a material property.
EMISSIVE_BANKS = re.compile(
    r'FIRE_FLICKER|PARTICLE|ANIM_GAP|FX|EMBER|GORE|DEMO_PROP_POOL|'
    r'LAMP_DARK|DOOR_ANIM|DOOR_LEAF|LIGHT', re.I)

def lava_applies(fn):
    """True only for banks of STRUCTURAL surfaces."""
    return not EMISSIVE_BANKS.search(fn)

def load_allow(root):
    pats = []
    p = os.path.join(root, ALLOW_FILE)
    if not os.path.exists(p):
        p = os.path.join(os.path.dirname(os.path.abspath(__file__)), ALLOW_FILE)
    if os.path.exists(p):
        for line in open(p, encoding='utf-8'):
            line = line.split('#')[0].strip()
            if line:
                pats.append(re.compile(line, re.I))
    return pats

def check_png(b64):
    """Returns (lava_strict, lava_suspect, purple).

    TWO LAVA TIERS, on purpose. v1's classifier (r>140, r>b+70, g<r, g>b) is
    Paolo's and it is KEPT — but measured against the real banks it flags this:

        (232,180,121) "2. Soil and dirt tiles"   <- desert sand
        (186,126,73)  "2. Soil and dirt tiles"   <- soil
        (194,117,68)  "Floor, walls"             <- warm rust

    That is not lava. That is Vegas. The loose classifier condemns the exact
    desert palette the TAN WALL LAW says 85% of the game is made of, which is
    why the 7/10 sweep produced 1,387 SUSPECTS and not 1,387 kills.

    So v1 stays as SUSPECT (Paolo's threshold, his eye finalizes) and a strict
    emissive test carries the VIOLATION tier. Strict is grounded in what molten
    rock actually looks like: it EMITS. Red near saturation, green far below
    red, blue almost gone. Desert sand reflects; its green sits high.
    [The strict thresholds are mine and flagged for Paolo.]"""
    try:
        im = Image.open(io.BytesIO(base64.b64decode(b64))).convert('RGB')
    except Exception:
        return (-1, -1, -1)
    im = im.resize((SAMPLE, SAMPLE))
    a = np.asarray(im).astype(int)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    suspect = int(((r > 140) & (r > b + 70) & (g < r) & (g > b)).sum())
    strict = int(((r > 200) & (g < r * 0.55) & (b < r * 0.35)).sum())
    pur = int(((r > g + 25) & (b > g + 25) & (r > 80)).sum())
    return strict, suspect, pur

def walk(node, path, out):
    """Banks disagree about structure (tiles{}, packs{}, houses[], strips[]).
    The law does not care about structure."""
    if isinstance(node, dict):
        for k, v in node.items():
            if k in ('b64', 'png', 'data', 'stamp') and isinstance(v, str) and len(v) > 100:
                out.append((path + '.' + k, v))
            else:
                walk(v, path + '.' + str(k), out)
    elif isinstance(node, list):
        for i, v in enumerate(node):
            if isinstance(v, str) and len(v) > 400 and v[:4] in ('iVBO', 'data'):
                out.append((path + '[%d]' % i, v))
            else:
                walk(v, path + '[%d]' % i, out)

def main():
    args = sys.argv[1:]
    strict = '--strict' in args
    csv = args[args.index('--csv') + 1] if '--csv' in args else None
    root = 'banks' if os.path.isdir('banks') else '.'
    if '--file' in args:
        files = [args[args.index('--file') + 1]]
    else:
        files = sorted(os.path.join(root, f) for f in os.listdir(root)
                       if f.endswith('.txt') and f.startswith('BOHEMIA_'))
    allow = load_allow(root)
    print('=' * 74)
    print('BOHEMIA PURITY GATE v2 — PURPLE RESERVATION + NO VOLCANO')
    print('allowlist patterns: %d' % len(allow))
    print('=' * 74)

    tot = viol = bad = skipped = susp = 0
    report = []
    for fn in files:
        try:
            d = json.load(open(fn, encoding='utf-8'))
        except Exception:
            continue
        found = []
        walk(d, os.path.basename(fn), found)
        if not found:
            continue
        fv = 0
        check_lava = lava_applies(fn)
        for path, b64 in found:
            tot += 1
            if any(p.search(path) for p in allow):
                skipped += 1
                continue
            strict, suspect, pur = check_png(b64)
            if strict < 0:
                bad += 1
                continue
            if check_lava:
                if strict > 0:
                    viol += 1; fv += 1; report.append((path, 'LAVA', strict))
                elif suspect > 0:
                    susp += 1; report.append((path, 'warm?', suspect))
            if pur > 0:
                viol += 1; fv += 1; report.append((path, 'PURPLE', pur))
        scope = 'struct' if check_lava else 'emissive'
        flag = '' if fv == 0 else '   <-- VIOLATIONS'
        print('  %-46s %5d img  %-8s %4d%s' % (os.path.basename(fn), len(found), scope, fv, flag))

    print('=' * 74)
    print('  %d images checked · %d VIOLATIONS · %d warm-suspect (Paolo eye) · %d law-blessed'
          % (tot, viol, susp, skipped))
    if report:
        byfile = {}
        for path, law, n in report:
            byfile.setdefault(path.split('.')[0], []).append((law, n, path))
        print('\n  worst offenders:')
        for f, rows in sorted(byfile.items(), key=lambda kv: -len(kv[1]))[:12]:
            lav = sum(1 for r in rows if r[0] == 'LAVA')
            pur = sum(1 for r in rows if r[0] == 'PURPLE')
            wrm = sum(1 for r in rows if r[0] == 'warm?')
            if pur or lav:
                print('    %-46s PURPLE %-4d LAVA %-4d (warm-suspect %d)' % (f, pur, lav, wrm))
        print('\n  every PURPLE violation (the law with teeth):')
        for path, law, n in [r for r in report if r[1] == 'PURPLE'][:40]:
            print('    px=%-5d %s' % (n, path))
    else:
        print("\n  PURITY HOLDS: purple is the Amalgamation's alone. No lava.")
    if csv and report:
        with open(csv, 'w') as fh:
            fh.write('law,pixels,path\n')
            for path, law, n in report:
                fh.write('%s,%d,%s\n' % (law, n, path))
        print('\n  full list -> %s (%d rows)' % (csv, len(report)))
    return 1 if (viol and strict) else 0

if __name__ == '__main__':
    sys.exit(main())
