#!/usr/bin/env python3
"""BOHEMIA -- COOK [every 2D asset into 3D], THE MAP, STEP ONE: CAPTURE THE DISTRICT FACTORY'S OWN SCENES (10/20/26).
The map's 69 district pictures (HERO_SRC) are baked by tools/bohemia_district_hero_factory.py through a numpy software
renderer (tools/bohemia_iso3d.py): clean toy plastic, no wear, no grain, no grime. This runs the factory AS IT IS (never
edited) with its bake() wrapped, so every scene it bakes is kept exactly as built (each face's four corners, its normal,
its material) with the canvas, the origin and the scale it was baked at; the bank it writes goes to a scratch file,
never over banks/; each bake runs at one sample a pixel and the exact crop of the bank's picture is found by
fitting its alpha. Step two (tools/bohemia_cook_the_map_through_the_rig_10_20_26.py) renders the same geometry through
the master rig's look, registered to the pixel.

  python3 tools/bohemia_cook_the_map_capture_10_20_26.py      (-> records/target/cook_map_rig/scenes.pkl, regenerated)

REFERENCE CHECK (the 9/4 standing duty): nothing is drawn here; the factory's own scenes are read. No reference game.
REUSE CHECK (REUSE-FIRST): the district hero factory and its iso3d renderer, imported untouched.
TASTE CHECK: none needed, no pixel is made.
"""
import os, sys, pickle, json
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
os.chdir(R)
import bohemia_district_hero_factory as HF

OUT = os.path.join(R, 'records/target/cook_map_rig')
CAP = []
_bake = HF.bake


def bake(scene, w, h, origin=(0, 0), scale=1.0, **kw):
    """the factory's bake at one sample a pixel (the 4x supersample is 1.5 GB a district and an hour for the set; the
    geometry is the same), the scene kept face by face; the exact crop is recovered below against the bank's own picture"""
    kw['ss'] = 1
    img = _bake(scene, w, h, origin=origin, scale=scale, **kw)
    faces = [([tuple(map(float, v)) for v in verts], tuple(map(float, n)), m) for verts, _uv, n, m in scene.faces]
    CAP.append(dict(w=w, h=h, origin=tuple(origin), scale=float(scale), faces=faces, alpha=(img[..., 3] > 0)))
    return img


def crop_against(c, b64):
    """the bank's picture is the 4x bake cropped to its own box: find that box on this canvas by the alpha's best fit"""
    import base64, io
    import numpy as np
    from PIL import Image
    old = np.asarray(Image.open(io.BytesIO(base64.b64decode(b64))).convert('RGBA'))[..., 3] > 0
    a = c['alpha']; ys, xs = np.nonzero(a)
    x0, y0 = xs.min(), ys.min(); hh, ww = old.shape
    best = None
    for dy in range(-4, 5):
        for dx in range(-4, 5):
            X, Y = x0 + dx, y0 + dy
            if X < 0 or Y < 0 or X + ww > a.shape[1] or Y + hh > a.shape[0]: continue
            win = a[Y:Y + hh, X:X + ww]; iou = (win & old).sum() / max(1, (win | old).sum())
            if best is None or iou > best[0]: best = (iou, X, Y)
    iou, X, Y = best
    return (int(X), int(Y), int(X + ww), int(Y + hh)), float(iou)


HF.bake = bake
HF.OUT = os.path.join(OUT, 'bank_now.json')
HF._write_dossier = lambda heroes: None
HF.main()
bank = json.load(open(os.path.join(R, 'banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt')))
now = json.load(open(HF.OUT))
assert len(now['heroes']) == len(CAP), (len(now['heroes']), len(CAP))
B = {h['district']: h for h in bank['heroes']}
for h, c in zip(now['heroes'], CAP):
    old = B[h['district']]
    c['bbox'], c['iou'] = crop_against(c, old['b64'])
    c.update(district=h['district'], bank_w=old['w'], bank_h=old['h'], bx=old['bx'], by=old['by'], pad=old['pad'])
    del c['alpha']
    print('  %-12s crop %s fit %.3f' % (h['district'], c['bbox'], c['iou']), flush=True)
pickle.dump(CAP, open(os.path.join(OUT, 'scenes.pkl'), 'wb'))
print('captured', len(CAP), 'scenes ->', os.path.relpath(os.path.join(OUT, 'scenes.pkl'), R))
