#!/usr/bin/env python3
"""BOHEMIA -- DIRECTION [see while you draw], the proof asset: A BURNT-OUT CAR MADE ONLY FROM HIS PARTS, iterated in
the render-look-fix loop (skills/bohemia-pixel-art/scripts/look.py). Nothing is drawn (rule 108 ROUND ELEVEN): his car
('10. Abandoned cars'), darkened only by HIS burnt ground pixels ('7. Burnt ground tiles') through COOK TWO's
darken-only decal, and recoloured (saturation down, the glass to his burnt ground's darkest, a rust shift of his own
car's mid tones). Every knob is a number in a params file, so a cycle is: change one knob, render, look, write.
A PLACEHOLDER-grade proof of the loop (ROUND THIRTEEN): nothing here goes to his tab or the game.

REFERENCE CHECK (the 9/4 standing duty): the compare law, the approved asset index (his 7/13 UP set, asserted by
COOK TWO's pack()), the card of numbers, skills/bohemia-pixel-art (loaded first), AH-01 (R10 wear authored, baked)
and AH-03. The twin is his own car as bought. No reference game.

usage: python3 tools/bohemia_direction_burnt_car_from_the_pack.py <params.json> <out.png>
"""
import os, sys, json, importlib.util, colorsys
import numpy as np
from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
s = importlib.util.spec_from_file_location('st', os.path.join(R, 'tools/bohemia_cook2_stretch_the_pack.py'))
ST = importlib.util.module_from_spec(s); s.loader.exec_module(ST)
CARS, BURNT = '10. Abandoned cars', '7. Burnt ground tiles'


def make(p):
    car = ST.pack(CARS, p['car']).astype(np.float64)
    rgb, al = car[..., :3], car[..., 3]; op = al > 127
    L = rgb @ [0.299, 0.587, 0.114]
    # 1 the glass: his car's bluish, mid-dark pixels inside the body go to the burnt ground's darkest tenth
    burnt = ST.cut_frame(ST.pack(BURNT, p['burnt']), BURNT).astype(np.float64)
    bL = burnt[..., :3] @ [0.299, 0.587, 0.114]; dark = burnt[..., :3][bL <= np.percentile(bL, 10)]
    glass = op & (rgb[..., 2] > rgb[..., 0] + p['glass_blue']) & (L < p['glass_max_L'])
    if glass.any():   # cycle 9's lesson: never a random pick per pixel (that is noise); his burnt pixels IN PLACE
        h0, w0 = op.shape
        bt = np.tile(burnt[..., :3], (h0 // burnt.shape[0] + 2, w0 // burnt.shape[1] + 2, 1))[:h0, :w0]
        dk = bt * (np.percentile(bL, 10) / max(1.0, float(bL.mean())))
        rgb[glass] = rgb[glass] * (1 - p['glass_black']) + dk[glass] * p['glass_black']
    # 2 the paint: saturation down; then the mid tones blended IN RGB toward HIS rust (the median of his car's own
    #   warm pixels). Cycle 7's lesson: lerping the hue from teal to rust went round the wheel through green.
    warm = op & (rgb[..., 0] > rgb[..., 2] + 30)
    rust_rgb = np.median(rgb[warm], 0) if warm.sum() > 20 else np.array([140, 80, 40.0])
    hsv = np.array([colorsys.rgb_to_hsv(*(c / 255.0)) for c in rgb.reshape(-1, 3)]).reshape(rgb.shape)
    hsv[..., 1] *= (1 - p['desat'])
    rgb = np.array([colorsys.hsv_to_rgb(*c) for c in hsv.reshape(-1, 3)]).reshape(rgb.shape) * 255
    Lm = rgb @ [0.299, 0.587, 0.114]
    mid = ((Lm > 50) & (Lm < 170) & op).astype(float)[..., None] * p['rust']
    rgb = rgb * (1 - mid) + (rust_rgb * (Lm[..., None] / max(1.0, float(rust_rgb @ [0.299, 0.587, 0.114])))) * mid
    # 3 the char: his burnt ground laid over the body, darken only, strongest at the top (fire rises)
    h, w = op.shape
    tile = np.tile(burnt[..., :3], (h // burnt.shape[0] + 2, w // burnt.shape[1] + 2, 1))
    oy, ox = p['burnt_off']; tile = tile[oy:oy + h, ox:ox + w]
    ramp = np.clip(1 - np.arange(h)[:, None] / (h * p['char_reach']), 0, 1) * p['char']
    darker = np.minimum(rgb, tile * (1 - p.get('char_depth', 0)))   # his burnt pixels, taken darker (a recolour)
    tL = tile @ [0.299, 0.587, 0.114]
    if p.get('char_patch', 0) > 0:   # only where HIS burnt ground is darkest: patches, not a dimmer over everything
        sc = int(p.get('patch_scale', 1))   # a whole-number zoom of the MASK only (his pixels never rescaled)
        mL = np.kron(tL, np.ones((sc, sc)))[:h, :w] if sc > 1 else tL
        k = np.clip((np.percentile(mL, 100 * p['char_patch']) - mL) / 12.0 + 0.5, 0, 1)
        for _ in range(int(p.get('mask_soft', 0))):   # soften the MASK's square steps (cycle 12), never his pixels
            kp = np.pad(k, 1, mode='edge'); k = sum(kp[dy:dy + h, dx:dx + w] for dy in range(3) for dx in range(3)) / 9.0
        ramp = ramp * k
    rgb = np.where(op[..., None], rgb * (1 - ramp[..., None]) + darker * ramp[..., None], rgb)
    if p.get('ash', 0) > 0 and p.get('char_patch', 0) > 0:   # ash: his burnt tile's LIGHTEST pixels, lighten only,
        top = np.percentile(mL, 100 * (1 - p.get('ash_share', 0.15)))   # where the soot mask is weakest
        a = np.clip((mL - top) / 10.0, 0, 1)
        for _ in range(int(p.get('mask_soft', 0))):   # the same softening as the soot mask (cycle 16)
            ap = np.pad(a, 1, mode='edge'); a = sum(ap[dy:dy + h, dx:dx + w] for dy in range(3) for dx in range(3)) / 9.0
        a = a * p['ash'] * (np.clip(1 - np.arange(h)[:, None] / (h * p['char_reach']), 0, 1))
        inner = op.copy()   # never on his outline: two pixels in from the silhouette
        for _ in range(2):
            q = np.pad(inner, 1); inner = q[:-2, 1:-1] & q[2:, 1:-1] & q[1:-1, :-2] & q[1:-1, 2:]
        a = a * inner
        lighter = np.maximum(rgb, tile * (1 + p.get('ash_lift', 0.3)))
        rgb = np.where(op[..., None], rgb * (1 - a[..., None]) + lighter * a[..., None], rgb)
    out = np.dstack([np.clip(rgb, 0, 255), al]).astype(np.uint8)
    return Image.fromarray(out, 'RGBA')


if __name__ == '__main__':
    p = json.load(open(sys.argv[1])); make(p).save(sys.argv[2])
    ST.pack(CARS, p['car'])   # asserts UP
    Image.fromarray(ST.pack(CARS, p['car'])).save(os.path.join(os.path.dirname(sys.argv[2]), 'twin_car_%d.png' % p['car']))
