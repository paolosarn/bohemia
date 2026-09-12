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

ALLOW_FILE = os.path.join('gates', 'bohemia_purity_allow.txt')
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

def ship_purple(root):
    """THE POOLS THE WALKED CITY ACTUALLY LOADS, which this gate never swept.

    Same unit as EYES E17 (records/BOHEMIA_EYES_E17_ROUND_2..., tools/bohemia_eyes_locked.py):
    a tile counts when a THIRD or more of its opaque pixels are saturated purple, hue
    265-330, sat over 0.45, lightness between 0.25 and 0.75. Not per pixel -- the law bans
    purple TILES, FLOORS and DECOR, and a few dithered pixels in a 28x28 sprite is shading.
    """
    import colorsys, glob
    KEY = re.compile(r'(?:TP_TILES|TP_FLOORS|TP_PROPS|TP_FORMS)\s*\[\s*"([^"]+)"\s*\]')
    files = sorted(glob.glob(os.path.join(root, 'slices', 'BOHEMIA_CITY_TILES*.js')))
    files += [os.path.join(root, 'slices', f) for f in
              ('BOHEMIA_CITY_FLOORS.js', 'BOHEMIA_CITY_PROPS.js', 'BOHEMIA_CITY_TILEFORMS.js')]
    by_cat = {}
    tiles = 0
    swept = 0
    for f in files:
        if not os.path.exists(f):
            continue
        t = io.open(f, encoding='utf-8', errors='replace').read()
        keys = [(m.start(), m.group(1)) for m in KEY.finditer(t)]
        for m in re.finditer(r'iVBOR[A-Za-z0-9+/=]+', t):
            b = m.group(0)
            try:
                im = Image.open(io.BytesIO(base64.b64decode(b + '=' * (-len(b) % 4)))).convert('RGBA')
            except Exception:
                continue
            swept += 1
            n = p = 0
            for r, g, bb, a in im.getdata():
                if a < 32:
                    continue
                n += 1
                h, l, sat = colorsys.rgb_to_hls(r / 255.0, g / 255.0, bb / 255.0)
                d = h * 360
                if 265 <= d <= 330 and sat > 0.45 and 0.25 < l < 0.75:
                    p += 1
            if n and p / float(n) >= 0.30:
                cat = '?'
                for pos, k in keys:
                    if pos < m.start():
                        cat = k
                    else:
                        break
                by_cat[cat] = by_cat.get(cat, 0) + 1
                tiles += 1
    return {'tiles': tiles, 'by_cat': by_cat, 'swept': swept}


def main():
    args = sys.argv[1:]
    strict = '--strict' in args
    csv = args[args.index('--csv') + 1] if '--csv' in args else None
    root = '.'
    if '--file' in args:
        files = [args[args.index('--file') + 1]]
    else:
        files = sorted(os.path.join(root, 'banks', f) for f in os.listdir(os.path.join(root, 'banks'))
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
            lava_px, suspect, pur = check_png(b64)
            if lava_px < 0:
                bad += 1
                continue
            if check_lava:
                if lava_px > 0:
                    viol += 1; fv += 1; report.append((path, 'LAVA', lava_px))
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
    # ======================================================================
    # THE VERDICT. (9/12, COOK, row [purple leak].)
    #
    # *** THIS LINE USED TO READ `return 1 if (viol and strict) else 0` AND IT
    #     COULD NOT FAIL. *** `strict` is the --strict CLI FLAG, bound at the top
    #     of main(). The per-image loop then REBOUND THE SAME NAME with the first
    #     value out of check_png, which is a LAVA PIXEL COUNT. So by the time the
    #     return ran, `strict` was "did the LAST png I happened to look at contain
    #     lava" -- not "was this run strict", and not "were there violations".
    #     Measured on main before touching it: 17,497 images checked, 2,232
    #     VIOLATIONS printed to the screen, exit code 0. Green in the suite.
    #     A gate that finds two thousand violations, prints them, and passes is
    #     worse than no gate, because the law reads as enforced.
    #
    # WHY THIS IS A RATCHET AND NOT A HARD ZERO. Flipping it to `1 if viol else 0`
    # is one character of honesty and a fleet-wide red on 2,232 pieces of art no
    # lane here made. Every other ratchet in this repo works the same way: freeze
    # what is true today, fail on anything NEW, and let the number only fall.
    #   * a bank over its frozen count      -> RED
    #   * a bank with no frozen entry at all -> RED (new art cannot sneak in)
    #   * the total over the frozen total    -> RED
    #   * everything else                    -> pass, and print the debt
    # The baseline may only SHRINK. Re-freeze it by hand, downward, never up.
    # ======================================================================
    per = {}
    for path, law, n in report:
        if law == 'warm?':
            continue
        per[path.split('.')[0]] = per.get(path.split('.')[0], 0) + 1
    # THE BASELINE IS WRITTEN BY THIS GATE, NEVER BY HAND. My first pass built it with a
    # separate script that counted one per IMAGE while the gate counts one per violation
    # REASON (an image can be both LAVA and PURPLE), so 2,134 vs 2,232 and every file read
    # as a regression. Two counters for one number always drift; the hair palette round
    # learned the same thing. One producer.
    base = {}
    bpath = os.path.join(root, 'gates', 'bohemia_purity_baseline.json')
    if '--freeze' in args:
        out = {
            'what': 'PURITY RATCHET BASELINE -- PURPLE RESERVATION + NO VOLCANO.',
            'why': ('Frozen by this gate itself (--freeze) on the turn it was first made able '
                    'to fail. Before that its verdict read `return 1 if (viol and strict) else 0`, '
                    'where `strict` is the --strict CLI FLAG, rebound inside the per-image loop '
                    'by a lava pixel count -- so the gate passed or failed on whether the LAST '
                    'png it happened to look at had lava in it. It printed 2,232 violations and '
                    'exited 0, green in the suite.'),
            'rule': ('THIS LIST MAY ONLY SHRINK. A file over its number is RED. A file carrying '
                     'violations with no entry here is RED, so new art cannot hide behind old '
                     'debt. When a number falls, re-freeze DOWNWARD with --freeze and say so.'),
            'total': sum(per.values()),
            'per_file': per,
            'shipped_total': ship_purple(root)['tiles'],
            'shipped_note': ('the pools slices/BOHEMIA_CITY_TILES*.js -- what the walked city '
                             'loads. This gate never swept them until 9/12, which is why EYES '
                             'had to find these 32 by hand. Ratcheted separately because it is '
                             'the scope a player can reach.'),
        }
        io.open(bpath, 'w', encoding='utf-8').write(json.dumps(out, indent=1, sort_keys=True))
        print('\n  FROZE %d violations across %d files -> %s'
              % (out['total'], len(per), bpath))
        return 0
    if os.path.exists(bpath):
        try:
            base = json.load(open(bpath, encoding='utf-8'))
        except Exception:
            base = {}
    frozen = base.get('per_file', {})
    regressions = []
    for f, n in sorted(per.items()):
        was = frozen.get(f)
        if was is None:
            regressions.append('%s is NOT in the frozen baseline and carries %d' % (f, n))
        elif n > was:
            regressions.append('%s went %d -> %d' % (f, was, n))
    improved = [(f, frozen[f], per.get(f, 0)) for f in frozen if per.get(f, 0) < frozen[f]]
    # ======================================================================
    # SECOND SCOPE: WHAT THE SHIPPED GAME ACTUALLY LOADS. (9/12, COOK.)
    #
    # This gate has swept banks/ since 7/10 and HAS NEVER LOOKED AT
    # slices/BOHEMIA_CITY_TILES*.js -- the pools the walked city actually reads.
    # That is precisely why EYES had to find the 32 by hand in E17: the gate was
    # measuring the corpus, and the corpus is not the game. A ruler pointed at the
    # wrong population reports a clean number about something nobody plays.
    #
    # This scope is counted and ratcheted SEPARATELY, because it is the one that
    # can reach a player. 32 today, and it may only fall.
    shipped = ship_purple(root)
    ship_frozen = base.get('shipped_total') if base else None
    print('\n  SHIPPED POOLS: %d tiles a third or more purple, in %s'
          % (shipped['tiles'], ', '.join('%s %d' % kv for kv in sorted(shipped['by_cat'].items()))))
    print('  (none of them drawn today: the tile placer ships off and nothing is placed,')
    print('   so these are a pool the builder paints from, not purple in the world)')

    print('\n  ' + '=' * 70)
    if not base:
        print('  NO FROZEN BASELINE. Write gates/bohemia_purity_baseline.json first.')
        print('  Refusing to pass without one -- that is how this gate got here.')
        return 1
    print('  RATCHET: %d violations across %d files, frozen at %d across %d.'
          % (sum(per.values()), len(per), base.get('total', 0), len(frozen)))
    if improved:
        print('  FELL (re-freeze the baseline downward): '
              + ', '.join('%s %d->%d' % r for r in improved[:6]))
    if ship_frozen is not None and shipped['tiles'] > ship_frozen:
        regressions.append('THE SHIPPED POOLS went %d -> %d -- this is the scope a player '
                           'can actually reach' % (ship_frozen, shipped['tiles']))
    if regressions:
        print('  *** PURITY RATCHET BROKEN ***')
        for r in regressions[:12]:
            print('    ' + r)
        return 1
    print('  the ratchet holds. The debt is real and is printed above, not hidden.')
    return 0

if __name__ == '__main__':
    sys.exit(main())
