#!/usr/bin/env python3
"""THE STAT ICONS READ AT A GLANCE  (UI [the stat icons read at a glance], 10/25/26; rule 189)

PAOLO 10/25: 'the icon for ranged defence has to look so much better; find out how others do icons for ranged defence,
because it literally just looks like a shield, and another shield for melee.'

MEASURED BEFORE: the 10/25 ranged defence was the melee shield's own polygon shot through, so the two shared one outline.
The eight are shown in the game at 24 points (the crew screen's numbers) and 18 (the hire's and the fight's drawer); on his
phone that is 72 and 54 real pixels, on a computer at 1x it is 18. At each of those sizes, the way the browser draws them
(image-rendering: pixelated, so the nearest pixel; and a smooth resample, the worse of the two counts):
  (1) NO PAIR ALIKE: a stranger tells two icons apart by their outline or by their colour, so a pair is mistakable when
      it shares ONE OUTLINE (its solid pixels overlap ONE or more, intersection over union: his 'a shield and another
      shield'), or when the outlines overlap CLOSE or more AND the colours are within NEAR of each other (CIE76 delta E of
      the solid pixels' mean). No pair of the eight is mistakable at any size, by either resample.
  (2) A STRANGER NAMES EACH FROM ITS PICTURE ALONE: every icon, glanced at GLANCES times (moved a pixel, a tenth bigger or
      smaller, softened, in the sun or in the dark), is nearer its own clean picture than any other of the eight; zero
      mistaken. The eye's three cues: the outline squinted, the light in it (its pattern, not its brightness: the sun
      changes that), the colour.
  (3) PLANTED: the 10/25 ranged defence (tools/bohemia_ui_stat_icons.py shield_shot, the shot-through shield) in place of
      the new one must turn (1) red, so the gate is proved to bite on the very defect he named.
      MEASURED, SAID PLAINLY: (2) alone does NOT catch the 10/25 pair (0 of 960 glances mistaken: their colours, 18 apart,
      are enough for a nearest match), which is exactly why (1) exists: his complaint was the one outline, and (1) catches it
      (outline 1.00). (2) is proved on its own plant: melee defence's twin in ranged defence's place.
EYES looks at them by eye next round (rule 189(e)).
Run: python3 gates/the_stat_icons_read_at_a_glance_gate.py
"""
import os, sys, importlib.util
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ICONS = ['hp', 'fatigue', 'resolve', 'initiative', 'melee_skill', 'ranged_skill', 'melee_defense', 'ranged_defense']
SIZES = [72, 54, 18]
ONE, CLOSE, NEAR = 0.85, 0.60, 30.0
GLANCES = 40
passed = failed = 0

def ok(msg, good, extra=''):
    global passed, failed
    if good: passed += 1
    else: failed += 1
    print(('  ok   ' if good else '  FAIL ') + msg + (('  [' + extra + ']') if extra else ''))

def at(im, n, how):
    return im.resize((n, n), Image.NEAREST if how == 'near' else Image.LANCZOS)

def mask(im):
    return np.asarray(im)[..., 3] > 127

def iou(a, b):
    u = (a | b).sum()
    return float((a & b).sum()) / u if u else 0.0

def lab(rgb):
    """sRGB 0..255 -> CIE Lab (D65)"""
    c = np.asarray(rgb, float) / 255.0
    c = np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    X = c @ np.array([[0.4124, 0.2126, 0.0193], [0.3576, 0.7152, 0.1192], [0.1805, 0.0722, 0.9505]])
    X = X / np.array([0.95047, 1.0, 1.08883])
    f = np.where(X > 0.008856, np.cbrt(X), 7.787 * X + 16 / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)

def colour(im):
    a = np.asarray(im).astype(float); m = a[..., 3] > 127
    return lab(a[m][:, :3].mean(0)) if m.any() else np.zeros(3)

def feats(im, n):
    """the eye's three cues: the outline squinted, the light's pattern in it, the colour"""
    sig = max(0.6, n / 24.0)
    al = np.asarray(im.getchannel('A').filter(ImageFilter.GaussianBlur(sig))).astype(float) / 255.0
    g = np.asarray(im.convert('L').filter(ImageFilter.GaussianBlur(sig))).astype(float) / 255.0 * al
    g = g / max(1e-6, g.sum() / max(1e-6, al.sum()))
    return al, g, colour(im)

def fdist(A, B):
    return float(np.sqrt(np.mean((A[0] - B[0]) ** 2))) + 0.5 * float(np.sqrt(np.mean((A[1] - B[1]) ** 2))) + float(np.linalg.norm(A[2] - B[2])) / 100.0

def glance(im, n, rng):
    """one look: moved up to a pixel, a tenth bigger or smaller, softened, lighter or darker"""
    s = rng.uniform(0.9, 1.1); m = max(4, int(round(n * s)))
    g = im.resize((m, m), Image.LANCZOS)
    c = Image.new('RGBA', (n, n), (0, 0, 0, 0))
    dx, dy = rng.integers(-1, 2), rng.integers(-1, 2)
    c.alpha_composite(g, (int((n - m) // 2 + dx), int((n - m) // 2 + dy))) if m <= n else c.alpha_composite(g.crop(((m - n) // 2, (m - n) // 2, (m - n) // 2 + n, (m - n) // 2 + n)), (0, 0))
    c = c.filter(ImageFilter.GaussianBlur(rng.uniform(0.0, 0.8) * n / 72 + 0.2))
    rgb, al = c.convert('RGB'), c.getchannel('A')
    rgb = ImageEnhance.Brightness(rgb).enhance(rng.uniform(0.75, 1.25))
    out = rgb.convert('RGBA'); out.putalpha(al)
    return out

def alike(v, de):
    return v >= ONE or (v >= CLOSE and de < NEAR)

def measure(set8):
    """(every mistakable pair, the worst outline overlap, the glance confusions)"""
    bad, worst = [], (0.0, None)
    C = {k: colour(set8[k]) for k in ICONS}
    for n in SIZES:
        for how in ('near', 'smooth'):
            M = {k: mask(at(set8[k], n, how)) for k in ICONS}
            for i, a in enumerate(ICONS):
                for b in ICONS[i + 1:]:
                    v, de = iou(M[a], M[b]), float(np.linalg.norm(C[a] - C[b]))
                    if v > worst[0]: worst = (v, '%s ~ %s at %d px (%s), colours %.0f apart' % (a, b, n, how, de))
                    if alike(v, de): bad.append('%s ~ %s at %d px (%s): outline %.2f, colour %.0f' % (a, b, n, how, v, de))
    rng = np.random.default_rng(1025)
    wrong = []
    for n in SIZES:
        clean = {k: feats(at(set8[k], n, 'smooth'), n) for k in ICONS}
        for k in ICONS:
            for _ in range(GLANCES):
                f = feats(glance(set8[k], n, rng), n)
                best = min(ICONS, key=lambda j: fdist(clean[j], f))
                if best != k: wrong.append('%s read as %s at %d px' % (k, best, n))
    return bad, worst, wrong

def main():
    here = {k: Image.open(os.path.join(ROOT, 'slices', 'stat_icons', k + '.png')).convert('RGBA') for k in ICONS}
    ok('the eight are drawn, 72 x 72 each', all(im.size == (72, 72) for im in here.values()), ' '.join('%s %dx%d' % (k, *im.size) for k, im in here.items() if im.size != (72, 72)))
    bad, worst, wrong = measure(here)
    ok('(1) no pair alike at 72, 54 or 18 px, nearest or smooth (one outline %.2f+, or %.2f+ with colours under %.0f apart)' % (ONE, CLOSE, NEAR), not bad,
       ('; '.join(sorted(set(bad))[:3])) if bad else 'the nearest outlines %.3f: %s' % worst)
    ok('(2) a stranger names each from its picture alone: %d glances each at three sizes, none mistaken' % GLANCES, not wrong, '%d mistaken%s' % (len(wrong), (': ' + '; '.join(wrong[:4])) if wrong else ''))
    # the two defences are not one outline: their own pair, said on its own line, at every size
    pair = max(iou(mask(at(here['melee_defense'], n, h)), mask(at(here['ranged_defense'], n, h))) for n in SIZES for h in ('near', 'smooth'))
    ok('    ranged defence is not a second shield: the two defences\' outlines overlap under %.2f' % CLOSE, pair < CLOSE, '%.3f' % pair)
    # (3) PLANTED: the 10/25 shot-through shield back as ranged defence
    spec = importlib.util.spec_from_file_location('si', os.path.join(ROOT, 'tools', 'bohemia_ui_stat_icons.py'))
    si = importlib.util.module_from_spec(spec); spec.loader.exec_module(si)
    old = dict(here); old['ranged_defense'] = si.render(si.shield_shot(), 1007)
    pb, pw, _ = measure(old)
    ok('(3) PLANTED: the 10/25 shot-through shield as ranged defence is caught by (1)', any('melee_defense ~ ranged_defense' in b for b in pb), (pb[0] if pb else 'not caught'))
    twin = dict(here); twin['ranged_defense'] = here['melee_defense'].copy()
    _, _, tw = measure(twin)
    ok('(3) PLANTED: melee defence\'s twin in ranged defence\'s place is caught by (2)', len(tw) > 0, '%d glances mistaken' % len(tw))
    # and the tool still makes exactly the files in the game (seeded): the new ranged defence is what ships
    fresh = si.render(si.cover(), 1000 + ICONS.index('ranged_defense'))
    same = np.array_equal(np.asarray(fresh), np.asarray(here['ranged_defense']))
    ok('the ranged defence in the game is the tool\'s cover, byte for byte (python3 tools/bohemia_ui_stat_icons.py)', same)
    print('\nTHE STAT ICONS READ AT A GLANCE: %d ok, %d failed' % (passed, failed))
    sys.exit(1 if failed else 0)

if __name__ == '__main__':
    main()
