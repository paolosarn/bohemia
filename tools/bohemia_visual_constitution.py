#!/usr/bin/env python3
"""
BOHEMIA — THE VISUAL CONSTITUTION (7/26/26)

Paolo verdicted the tile-reassembled target screen **CBB** on 7/26. Per the
verdict pipeline that means it SHIPS, it is FROZEN, and it never spawns
variants. So the target stops being a thing we iterate on and becomes a thing we
MEASURE AGAINST.

This tool reads the shipped target and writes down its measurable proxies —
exactly the six amendment B allows a machine to hold:

    "machine-gate the PROXIES only - locked master palette (every pixel indexes
     it), per-layer value bands (floors/walls/tops), one outline convention, one
     dither policy, one light direction, edge-pixel seam contracts (hashable).
     The gestalt 'matches the target' is ALWAYS a human side-by-side verdict
     (Paolo). Never a literal image-diff gate (gameable/false)."

That last sentence is load-bearing and this tool obeys it: it never records the
target's pixels as something to match. It records the RULES the target obeys, so
new art can be different and still be right.

It also BYTE-LOCKS the target. CBB means frozen; a frozen thing that anyone can
quietly re-render is not frozen. The md5s below are what
gates/target_match_gate.py checks, and changing them requires a new ruling from
Paolo, not a new render from me.

REUSE CHECK: cooks NO graphic pixels at all. It opens the shipped target frame
(records/target/REASSEMBLED.png), the shipped starter tileset
(banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt) and the derived ramp
(records/target/BOHEMIA_MASTER_PALETTE.json), measures them, and writes numbers.

TASTE CHECK: emits no candidates, so there is no pre-judge kill pass. It is the
machine that will run the taste rules on everyone else's candidates from now on.

  python3 tools/bohemia_visual_constitution.py
    -> records/target/BOHEMIA_VISUAL_CONSTITUTION.json
"""
import hashlib
import json
import os

from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
OUT = 'records/target/BOHEMIA_VISUAL_CONSTITUTION.json'
FRAME = 'records/target/REASSEMBLED.png'
TILESET = 'banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt'
PALETTE = 'records/target/BOHEMIA_MASTER_PALETTE.json'


def md5(path):
    return hashlib.md5(open(path, 'rb').read()).hexdigest()


def lum(px):
    return 0.299 * px[0] + 0.587 * px[1] + 0.114 * px[2]


def tile_stats(img):
    im = img.convert('RGBA')
    w, h = im.size
    raw = im.tobytes()
    vals, hot, black = [], 0, 0
    for i in range(0, len(raw), 4):
        if raw[i + 3] < 8:
            continue
        p = (raw[i], raw[i + 1], raw[i + 2])
        vals.append(lum(p))
        if p[0] > 226 and p[1] > 200 and p[2] < 130:
            hot += 1
        if max(p) < 14:
            black += 1
    n = max(1, len(vals))
    return {'mean': sum(vals) / n, 'min': min(vals), 'max': max(vals),
            'hot_frac': hot / float(n), 'black_frac': black / float(n), 'px': n}


def dither_energy(img):
    """A stipple pattern alternates every pixel. Measure how much of the image's
    energy sits at that frequency: high = dithered, which act 1 does not do."""
    im = img.convert('L')
    w, h = im.size
    d = im.tobytes()
    alt = same = 0
    for y in range(h):
        row = y * w
        for x in range(w - 2):
            a, b, c = d[row + x], d[row + x + 1], d[row + x + 2]
            if abs(a - c) < 6 and abs(a - b) > 26:
                alt += 1
            else:
                same += 1
    return alt / float(max(1, alt + same))


LAYER_OF = {
    'road': 'ground', 'walk': 'ground', 'yard': 'ground', 'concrete': 'ground',
    'dirt': 'ground', 'wall': 'wall', 'door': 'wall', 'garage': 'wall',
    'roof': 'top',
}


def layer_of(tile_id):
    for k, v in LAYER_OF.items():
        if tile_id.startswith(k):
            return v
    return 'other'


def main():
    ts = json.load(open(TILESET))
    import base64
    import io
    layers = {}
    dith = 0.0
    seams = {}
    for t in ts['tiles']:
        img = Image.open(io.BytesIO(base64.b64decode(t['b64'])))
        st = tile_stats(img)
        L = layer_of(t['id'])
        layers.setdefault(L, []).append(st['mean'])
        dith = max(dith, dither_energy(img))
        # EDGE-PIXEL SEAM CONTRACT: a family's tiles must meet identically, so
        # their edge rings hash to the same value. Hashable, per amendment B.
        fam = t['id'].rstrip('0123456789_')
        e = img.convert('RGB')
        w, h = e.size
        ring = [e.getpixel((x, 0)) for x in range(w)] + [e.getpixel((x, h - 1)) for x in range(w)]
        seams.setdefault(fam, []).append(hashlib.md5(str(ring).encode()).hexdigest()[:12])

    frame = Image.open(FRAME).convert('RGB')
    fs = tile_stats(frame)
    pal = json.load(open(PALETTE))

    doc = {
        'version': 'BOHEMIA_VISUAL_CONSTITUTION_v1',
        'built': '2026-07-26',
        'status': 'IN FORCE',
        'verdict': 'CBB (Paolo 7/26/26) - ships, FROZEN, never spawns variants',
        'verdict_record': 'records/BOHEMIA_TARGET_SCREEN_VERDICT_7_26_26.txt',
        'law': ('laws/BOHEMIA_ADDENDUM_ART_FIRST_RESET_7_26_26.md amendment B - machine-gate '
                'the PROXIES only. The gestalt "does it look like the target" is ALWAYS a '
                'human verdict, Paolo\'s, and is NEVER an image diff.'),
        # ---- FROZEN: byte-locks, because CBB means frozen -----------------
        'frozen': {
            'frame': {'path': FRAME, 'md5': md5(FRAME), 'size': list(frame.size)},
            'tileset': {'path': TILESET, 'md5': md5(TILESET), 'tiles': len(ts['tiles'])},
            'note': ('changing either of these requires a NEW RULING FROM PAOLO, not a new '
                     'render. CBB does not get quietly improved.'),
        },
        # ---- THE SIX PROXIES amendment B allows a machine to hold ---------
        'proxies': {
            'palette': {
                'ramp': PALETTE, 'ramp_size': pal['ramp_size'],
                'measured_colours': pal['measured_unique_colours_in_target_plates'],
                'ceiling': pal['ceiling'],
                'rule': 'a cook may not raise the corpus colour count above the ceiling',
            },
            'value_bands': {k: {'mean': round(sum(v) / len(v), 1),
                                'lo': round(min(v), 1), 'hi': round(max(v), 1),
                                'tiles': len(v)}
                            for k, v in sorted(layers.items())},
            'value_band_rule': ('each layer has its OWN measured band and a new tile whose '
                                'layer mean falls more than 26 outside it is not in this '
                                'world. The ordering is NOT assumed - it is measured, and in '
                                'this target it comes out top brightest, then ground, then '
                                'wall, because the yard is bare sun-struck dirt and the '
                                'walls are the faces sitting in their own eave shadow. '
                                'Writing "ground darkest" here would have been a guess that '
                                'the numbers contradict.'),
            'outline': {'max_near_black_frac': 0.06, 'measured': round(fs['black_frac'], 4),
                        'rule': 'NO black keyline. Edges are value steps.'},
            'dither': {'max_alt_energy': round(min(0.5, dith * 1.6 + 0.05), 4),
                       'measured': round(dith, 4),
                       'rule': 'act 1 does not stipple. Falloffs are solid alpha ramps.'},
            'light': {'key': 'upper left', 'shadows': 'down and to the right',
                      'rule': 'ONE direction everywhere. A mass is brightest on top.'},
            'glow': {'max_hot_frac': 0.02, 'measured': round(fs['hot_frac'], 4),
                     'rule': 'act 1 windows are DEAD DARK glass. Never a warm night glow.'},
            'seams': {'families': len(seams),
                      'rule': ('tiles in one family must meet identically - their edge rings '
                               'hash the same. Hashable, per amendment B.'),
                      'rings': {k: sorted(set(v)) for k, v in sorted(seams.items())}},
        },
        'never_gated': ('whether a thing LOOKS right. That is Paolo, side by side, forever. '
                        'A literal image-diff gate is gameable and false and is banned.'),
    }
    with open(OUT, 'w') as f:
        json.dump(doc, f, indent=1)
    b = doc['proxies']['value_bands']
    print('OK  constitution IN FORCE  ->', OUT)
    print('    frozen: frame %s, tileset %s' % (doc['frozen']['frame']['md5'][:8],
                                                doc['frozen']['tileset']['md5'][:8]))
    print('    value bands: ' + '  '.join('%s %.0f' % (k, v['mean']) for k, v in b.items()))


if __name__ == '__main__':
    main()
