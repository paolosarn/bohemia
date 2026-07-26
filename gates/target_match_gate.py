#!/usr/bin/env python3
"""THE TARGET-MATCH GATE (7/26/26) — the art director in the room when he isn't.

Paolo verdicted the target screen **CBB** on 7/26: it ships, it is FROZEN, and it
never spawns variants. The backlog said a target-match gate ships the same turn
the target is picked. This is it.

WHAT IT HOLDS — and only this. Amendment B of the art-first reset is explicit
that a machine may hold the PROXIES and nothing more:

    "machine-gate the PROXIES only - locked master palette, per-layer value bands
     (floors/walls/tops), one outline convention, one dither policy, one light
     direction, edge-pixel seam contracts (hashable). The gestalt 'matches the
     target' is ALWAYS a human side-by-side verdict (Paolo). Never a literal
     image-diff gate (gameable/false)."

So this gate NEVER diffs an image against the target. It measures whether new art
obeys the same rules the target obeys, which lets new art look like something new
and still belong to this world. Whether it LOOKS right stays Paolo's, forever.

It also enforces the FROZEN half of CBB: the target frame and the starter tileset
are byte-locked. A frozen thing anyone can quietly re-render is not frozen.

REGISTRY: every art bank that ships from here on adds itself to BANKS below and
gets held to the constitution. The starter tileset is the first member and the
reference implementation.

Run from repo root:  python3 gates/target_match_gate.py
"""
import base64
import hashlib
import io
import json
import os
import sys

from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

CONST = 'records/target/BOHEMIA_VISUAL_CONSTITUTION.json'
VERDICT = 'records/BOHEMIA_TARGET_SCREEN_VERDICT_7_26_26.txt'
# (bank path, key holding the sprite list) — the registry grows as art ships.
BANKS = [('banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt', 'tiles')]

LAYER_OF = {'road': 'ground', 'walk': 'ground', 'yard': 'ground',
            'concrete': 'ground', 'dirt': 'ground', 'wall': 'wall',
            'door': 'wall', 'garage': 'wall', 'roof': 'top'}
BAND_SLACK = 26.0

P = F = 0


def chk(ok, msg):
    global P, F
    if ok:
        P += 1
    else:
        F += 1
        print('  FAIL: ' + msg)


def lum(p):
    return 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2]


def stats(img):
    im = img.convert('RGBA')
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
    return sum(vals) / n, hot / float(n), black / float(n)


def dither_energy(img):
    im = img.convert('L')
    w, h = im.size
    d = im.tobytes()
    alt = same = 0
    for y in range(h):
        r = y * w
        for x in range(w - 2):
            a, b, c = d[r + x], d[r + x + 1], d[r + x + 2]
            if abs(a - c) < 6 and abs(a - b) > 26:
                alt += 1
            else:
                same += 1
    return alt / float(max(1, alt + same))


def layer_of(tid):
    for k, v in LAYER_OF.items():
        if tid.startswith(k):
            return v
    return None


def main():
    print('TARGET-MATCH GATE (the constitution)')
    chk(os.path.exists(CONST), 'the visual constitution has not been written')
    chk(os.path.exists(VERDICT), 'the CBB verdict is not on the record')
    if not os.path.exists(CONST):
        return 1
    C = json.load(open(CONST))
    chk(C['status'] == 'IN FORCE', 'the constitution is not in force')
    chk('CBB' in C['verdict'], 'the constitution does not carry the verdict it came from')
    chk('NEVER an image diff' in C['law'] or 'NEVER' in C['law'],
        'the constitution must say in its own text that the gestalt is never gated')
    chk('never_gated' in C, 'nothing records what this gate refuses to judge')

    # ---- CBB MEANS FROZEN ------------------------------------------------
    for what, rec in C['frozen'].items():
        if what == 'note':
            continue
        p = rec['path']
        chk(os.path.exists(p), 'the frozen %s is gone: %s' % (what, p))
        if os.path.exists(p):
            got = hashlib.md5(open(p, 'rb').read()).hexdigest()
            chk(got == rec['md5'],
                'THE FROZEN %s CHANGED. Paolo verdicted this CBB, which means it ships '
                'FROZEN and never spawns variants. Re-rendering it is not an improvement, '
                'it is overruling him. If it genuinely must change, get a new ruling and '
                're-run tools/bohemia_visual_constitution.py in the same commit.'
                % what.upper())

    # ---- THE PROXIES, on every registered bank ---------------------------
    PR = C['proxies']
    bands = PR['value_bands']
    for path, key in BANKS:
        chk(os.path.exists(path), 'registered art bank missing: %s' % path)
        if not os.path.exists(path):
            continue
        bank = json.load(open(path))
        seen_fam = {}
        for t in bank[key]:
            img = Image.open(io.BytesIO(base64.b64decode(t['b64'])))
            mean, hot, black = stats(img)
            tid = t['id']
            L = layer_of(tid)
            if L and L in bands:
                b = bands[L]
                chk(b['lo'] - BAND_SLACK <= mean <= b['hi'] + BAND_SLACK,
                    '%s: value %.0f is outside the %s band %.0f-%.0f (+/-%d). Per-layer '
                    'value bands are how a new tile stays in this world.'
                    % (tid, mean, L, b['lo'], b['hi'], BAND_SLACK))
            chk(black <= PR['outline']['max_near_black_frac'] + 0.02,
                '%s: %.1f%% near-pure black - that is a keyline, and edges here are value '
                'steps' % (tid, black * 100))
            chk(hot <= PR['glow']['max_hot_frac'] + 0.005,
                '%s: %.1f%% hot yellow - act 1 glass is DEAD DARK' % (tid, hot * 100))
            chk(dither_energy(img) <= PR['dither']['max_alt_energy'] + 0.02,
                '%s: stippled. Act 1 does not dither; falloffs are solid alpha ramps.' % tid)
            # EDGE-PIXEL SEAM CONTRACT, hashable
            fam = tid.rstrip('0123456789_')
            e = img.convert('RGB')
            w, h = e.size
            ring = [e.getpixel((x, 0)) for x in range(w)] + \
                   [e.getpixel((x, h - 1)) for x in range(w)]
            seen_fam.setdefault(fam, set()).add(
                hashlib.md5(str(ring).encode()).hexdigest()[:12])
        locked = PR['seams']['rings']
        for fam, rings in seen_fam.items():
            if fam in locked:
                chk(sorted(rings) == locked[fam],
                    '%s: the family\'s edge ring changed. Tiles in one family must meet '
                    'identically or the ground seams.' % fam)

    # ---- THE PALETTE RATCHET --------------------------------------------
    pal = json.load(open(PR['palette']['ramp']))
    got = pal['measured_unique_colours_in_target_plates']
    chk(got <= PR['palette']['ceiling'],
        'the corpus colour count rose to %d, over the tracked ceiling of %d'
        % (got, PR['palette']['ceiling']))

    # ---- THE FREEZES THE VERDICT LIFTED ----------------------------------
    v = open(VERDICT).read() if os.path.exists(VERDICT) else ''
    chk('A_FRONTFACE (tile-reassembled frame): CBB' in v,
        'the verdict file does not record the verdict in the exported format')
    chk('never spawns variants' in v,
        'the verdict record does not spell out what CBB obliges')

    print('  %d passed, %d failed' % (P, F))
    return 1 if F else 0


if __name__ == '__main__':
    sys.exit(main())
