#!/usr/bin/env python3
"""BOHEMIA -- DIRECTION [see while you draw]: THE FIRST THREE LESSONS OF THE LOOP, each a before and after made on his
car ('10. Abandoned cars' #3) the way the burnt-car loop made the mistake and then fixed it (rule 108 ROUND TWELVE (3):
study, not copy; a lesson goes into the skill with a before/after the chat made itself). Writes
skills/bohemia-pixel-art/references/lessons/LESSONS_01_03.png, every pair at 4x so the fault is visible.

  1 NEVER TURN A HUE ROUND THE WHEEL: teal lerped toward rust by hue goes through GREEN (cycle 7, camouflage);
    blend in RGB toward a colour taken from his own pixels.
  2 NEVER PICK A SOURCE PIXEL AT RANDOM: a random pick per pixel is noise by construction (cycle 9, speckle);
    take his pixels in place.
  3 ZOOM OR SHAPE A MASK, NEVER HIS PIXELS, AND SOFTEN THE MASK: a whole-number zoom of a mask shows its grid as
    square steps (cycles 12 and 16); soften the mask, his pixels stay untouched.

REFERENCE CHECK (the 9/4 standing duty): the compare law, the approved asset index (his 7/13 UP set via COOK TWO's
pack()), skills/bohemia-pixel-art, AH-01, AH-03. No reference game.
"""
import os, importlib.util, colorsys
import numpy as np
from PIL import Image, ImageDraw

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
s = importlib.util.spec_from_file_location('st', os.path.join(R, 'tools/bohemia_cook2_stretch_the_pack.py'))
ST = importlib.util.module_from_spec(s); s.loader.exec_module(ST)
OUT = os.path.join(R, 'skills/bohemia-pixel-art/references/lessons'); os.makedirs(OUT, exist_ok=True)
car = ST.pack('10. Abandoned cars', 3).astype(float); rgb0, al = car[..., :3], car[..., 3]; op = al > 127
burnt = ST.cut_frame(ST.pack('7. Burnt ground tiles', 0), '7. Burnt ground tiles').astype(float)[..., :3]
h, w = op.shape
img = lambda rgb: Image.fromarray(np.dstack([np.clip(rgb, 0, 255), al]).astype(np.uint8), 'RGBA')
hsv = lambda rgb: np.array([colorsys.rgb_to_hsv(*(c / 255.0)) for c in rgb.reshape(-1, 3)]).reshape(rgb.shape)
rgbof = lambda hv: np.array([colorsys.hsv_to_rgb(*c) for c in hv.reshape(-1, 3)]).reshape(hv.shape) * 255
L0 = rgb0 @ [0.299, 0.587, 0.114]; mid = (L0 > 50) & (L0 < 170) & op

# 1 hue round the wheel vs RGB toward his rust
hv = hsv(rgb0); hv[..., 0] = np.where(mid, hv[..., 0] * 0.5 + 0.06 * 0.5, hv[..., 0]); bad1 = rgbof(hv)
warm = op & (rgb0[..., 0] > rgb0[..., 2] + 30); rust = np.median(rgb0[warm], 0)
k = mid[..., None] * 0.5; good1 = rgb0 * (1 - k) + rust * (L0[..., None] / float(rust @ [0.299, 0.587, 0.114])) * k
# 2 random pick vs in place (on the whole body, to make the fault plain)
bL = burnt @ [0.299, 0.587, 0.114]; dark = burnt[bL <= np.percentile(bL, 10)]
allb = burnt.reshape(-1, 3)
bad2 = rgb0.copy(); idx = np.random.default_rng(1).integers(0, len(allb), op.sum()); bad2[op] = rgb0[op] * 0.5 + allb[idx] * 0.5
bt = np.tile(burnt, (h // burnt.shape[0] + 2, w // burnt.shape[1] + 2, 1))[:h, :w]
good2 = rgb0.copy(); good2[op] = rgb0[op] * 0.5 + bt[op] * 0.5
# 3 a zoomed mask, raw vs softened
tL = bt @ [0.299, 0.587, 0.114]; mL = np.kron(tL, np.ones((3, 3)))[:h, :w]
m = np.clip((np.percentile(mL, 35) - mL) / 12.0 + 0.5, 0, 1) * 0.9
soft = m.copy()
for _ in range(2):
    p = np.pad(soft, 1, mode='edge'); soft = sum(p[dy:dy + h, dx:dx + w] for dy in range(3) for dx in range(3)) / 9.0
darker = np.minimum(rgb0, bt * 0.4)
bad3 = rgb0 * (1 - m[..., None]) + darker * m[..., None]; good3 = rgb0 * (1 - soft[..., None]) + darker * soft[..., None]

pairs = [('1 HUE ROUND THE WHEEL -> GREEN', bad1, 'RGB TOWARD HIS OWN RUST', good1),
         ('2 RANDOM PICK PER PIXEL -> NOISE', bad2, 'HIS PIXELS IN PLACE', good2),
         ('3 ZOOMED MASK -> SQUARE STEPS', bad3, 'THE MASK SOFTENED', good3)]
Z = 4; cw = w * Z; ch = h * Z
sheet = Image.new('RGB', (3 * (2 * cw + 60) + 20, ch + 70), (22, 21, 20)); d = ImageDraw.Draw(sheet)
for i, (tb, b, tg, g) in enumerate(pairs):
    x = 20 + i * (2 * cw + 60)
    d.text((x, 8), tb, fill=(214, 110, 110)); d.text((x + cw + 20, 8), tg, fill=(150, 190, 160))
    sheet.paste(img(b).resize((cw, ch), Image.NEAREST), (x, 40), img(b).resize((cw, ch), Image.NEAREST))
    sheet.paste(img(g).resize((cw, ch), Image.NEAREST), (x + cw + 20, 40), img(g).resize((cw, ch), Image.NEAREST))
sheet.save(os.path.join(OUT, 'LESSONS_01_03.png')); print(sheet.size)
