#!/usr/bin/env python3
"""BOHEMIA -- COOK [every 2D asset into 3D], THE MAP, STEP ONE: CAPTURE THE DISTRICT FACTORY'S OWN SCENES (10/20/26).
The map's 69 district pictures (HERO_SRC) are baked by tools/bohemia_district_hero_factory.py through a numpy software
renderer (tools/bohemia_iso3d.py): clean toy plastic, no wear, no grain, no grime. This runs the factory AS IT IS (never
edited) with its bake() wrapped, so every scene it bakes is kept exactly as built (each face's four corners, its normal,
its material) with the canvas, the origin and the scale it was baked at; the bank it writes goes to a scratch file,
never over banks/. Step two (tools/bohemia_cook_the_map_through_the_rig_10_20_26.py) renders the same geometry through
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
    img = _bake(scene, w, h, origin=origin, scale=scale, **kw)
    faces = [([tuple(map(float, v)) for v in verts], tuple(map(float, n)), m) for verts, _uv, n, m in scene.faces]
    CAP.append(dict(w=w, h=h, origin=tuple(origin), scale=float(scale), faces=faces, bbox=__import__('PIL.Image', fromlist=['Image']).fromarray(img, 'RGBA').getbbox()))
    return img


HF.bake = bake
HF.OUT = os.path.join(OUT, 'bank_now.json')
HF._write_dossier = lambda heroes: None
HF.main()
bank = json.load(open(HF.OUT))
assert len(bank['heroes']) == len(CAP), (len(bank['heroes']), len(CAP))
for h, c in zip(bank['heroes'], CAP):
    c.update(district=h['district'], bank_w=h['w'], bank_h=h['h'], bx=h['bx'], by=h['by'], pad=h['pad'])
pickle.dump(CAP, open(os.path.join(OUT, 'scenes.pkl'), 'wb'))
print('captured', len(CAP), 'scenes ->', os.path.relpath(os.path.join(OUT, 'scenes.pkl'), R))
