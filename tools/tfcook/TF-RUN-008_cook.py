#!/usr/bin/env python3
"""
TF-RUN-008/009/010 - THE THREE CURRENCY ICONS, ONE BATCH (8/9/26).

The game's first UI marks: RESOURCES (duct-tape roll dominant, hammer crossing
behind, apple at the base), ENERGY (jerrycan dominant, lightning bolt as a
decisive accent only, AA battery at the base), CLOUT (a crowd merged into ONE
blob with a bumpy top edge, a speech bubble with a decisive tail resolving it).
Cooked together per the forms' own law so they cannot be confusable; judged
together in one phone-chrome mock.

THE LAWS BAKED IN, from the merged job spec + the constitution:
- ONE-MARK RULE (Paolo 7/28 LOCKED): parts combine into ONE silhouette by
  overlap/union, never a shopping-list row of little icons.
- 32x32 native, single placement, never tiles; proofs at 32/64/96 INTEGER scale.
- NO black keyline, NO dither, NO glow (max hot-pixel fraction 0.02 - energy
  says STORED, not switched on), NO purple (Amalgamation's alone), sat 0.19-0.3.
- Solid-black test: each silhouette must still read and not be confusable.
- Colours snapped to the master ramp (records/target/BOHEMIA_MASTER_PALETTE.json).
- Each ships normal + dimmed (can't-afford) colorway.
- Placement law for the wiring lane, in the bank caption: NEVER on a feed post
  (the visible clout badge was KILLED 7/21); Wallet / ME readout only.

REUSE CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md walked by the
triage agent - the entire approved corpus is WORLD art; zero UI icons exist in
any bank, so there is nothing legal to reuse and this is a confirmed new cook.
What IS reused: records/target/BOHEMIA_MASTER_PALETTE.json (opened below, every
colour snapped to its 64-step ramp) and the constitution's light direction
(upper-left) and sat band. TASTE CHECK: scavenged wear is a hint, never the
subject; ordinary people in a hard decade, not a concert audience; nothing
candy, nothing borrowed from platform glyphs (no heart, star, crown, thumb).

  python3 tools/tfcook/TF-RUN-008_cook.py
    -> banks/tileforms/TF-RUN-008_CANDIDATES_8_9_26.json   (6 marks, UNJUDGED)
    -> records/tileforms_proofs/TF-RUN-008/*.png
"""
import base64
import colorsys
import io
import json
import os

import numpy as np
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.chdir(REPO)

S = 32
PAL = json.load(open('records/target/BOHEMIA_MASTER_PALETTE.json'))
RAMP = np.array([[int(h[1:3], 16), int(h[3:5], 16), int(h[5:7], 16)]
                 for h in PAL['ramp_hex']], dtype=np.float64)

OUT_BANK = 'banks/tileforms/TF-RUN-008_CANDIDATES_8_9_26.json'
OUT_PROOF = 'records/tileforms_proofs/TF-RUN-008'
os.makedirs(OUT_PROOF, exist_ok=True)
os.makedirs('banks/tileforms', exist_ok=True)


def snap(rgb):
    """nearest master-ramp colour"""
    d = ((RAMP - np.array(rgb)) ** 2).sum(axis=1)
    return RAMP[d.argmin()]


def canvas():
    return np.zeros((S, S, 3)), np.zeros((S, S))


def put(col, alpha, mask, rgb, a=1.0):
    """paint mask (float 0..1) with rgb; later paints go OVER earlier ones"""
    m = np.clip(mask, 0, 1) * a
    for c in range(3):
        col[..., c] = col[..., c] * (1 - m) + rgb[c] * m
    alpha[:] = np.clip(alpha + m, 0, 1)


def ellipse(cx, cy, rx, ry, soft=0.8):
    yy, xx = np.mgrid[0:S, 0:S]
    d = (((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2) ** 0.5
    return np.clip((1.0 - d) / (soft / max(rx, ry)) + 1, 0, 1) * (d < 1.25)


def rect(x0, y0, x1, y1):
    m = np.zeros((S, S))
    m[max(0, y0):min(S, y1), max(0, x0):min(S, x1)] = 1
    return m


def bar(x0, y0, x1, y1, w):
    """thick line segment"""
    yy, xx = np.mgrid[0:S, 0:S]
    dx, dy = x1 - x0, y1 - y0
    L = max((dx * dx + dy * dy) ** 0.5, 1e-6)
    t = np.clip(((xx - x0) * dx + (yy - y0) * dy) / (L * L), 0, 1)
    px, py = x0 + t * dx, y0 + t * dy
    d = ((xx - px) ** 2 + (yy - py) ** 2) ** 0.5
    return np.clip(w / 2 + 0.7 - d, 0, 1)


def shade_ul(col, alpha, amt=14):
    """upper-left light: rows/cols near the top-left of the FILLED mark get a
    lift, lower-right a drop. Applied on alpha>0 only, then re-snapped."""
    yy, xx = np.mgrid[0:S, 0:S]
    g = ((S - 1 - xx) + (S - 1 - yy)) / (2 * (S - 1))  # 1 at TL, 0 at BR
    adj = (g - 0.5) * 2 * amt
    on = alpha > 0.05
    for c in range(3):
        col[..., c][on] = np.clip(col[..., c][on] + adj[on], 0, 255)


def finish(col, alpha):
    """snap every opaque pixel to the ramp, kill stray faint alpha"""
    out = col.copy()
    on = alpha > 0.5
    flat = out[on].reshape(-1, 3)
    for i in range(flat.shape[0]):
        flat[i] = snap(flat[i])
    out[on] = flat
    a8 = (np.clip(alpha, 0, 1) > 0.5).astype(np.uint8) * 255
    return out.astype(np.uint8), a8


# ------------------------------------------------------------------ RESOURCES
def icon_resources():
    col, al = canvas()
    # hammer BEHIND, on the diagonal: handle lower-left -> head upper-right
    wood = snap((108, 99, 84))
    put(col, al, bar(3, 29, 25, 8, 3.2), wood)
    steel = snap((118, 114, 106))
    put(col, al, bar(20, 4, 30, 11, 4.6), steel)      # head: crossbar perpendicular
    put(col, al, bar(20, 4, 23, 6, 3.0), snap((94, 90, 83)))   # claw end
    # duct tape roll DOMINANT: ring with visible darker core
    tape = snap((150, 143, 130))
    put(col, al, ellipse(14, 15, 9.5, 9.5), tape)
    put(col, al, ellipse(11.5, 12.5, 5.5, 5.5, 1.4), snap((170, 162, 148)), a=0.55)  # TL sheen
    core = snap((74, 66, 55))
    put(col, al, ellipse(14, 15, 4.2, 4.2), core)
    put(col, al, ellipse(14, 15, 2.6, 2.6), snap((40, 36, 30)))
    # part-used: free tape tab at lower right
    put(col, al, bar(21, 21, 26, 24, 2.6), snap((132, 125, 112)))
    # apple nested at the base
    put(col, al, ellipse(23, 26, 4.0, 3.7), snap((106, 74, 60)))
    put(col, al, ellipse(21.6, 24.6, 1.6, 1.4, 1.2), snap((128, 98, 80)), a=0.7)
    put(col, al, bar(23, 22, 24, 20, 1.2), snap((80, 64, 40)))  # stem
    shade_ul(col, al, 10)
    return finish(col, al)


# --------------------------------------------------------------------- ENERGY
def icon_energy():
    col, al = canvas()
    olive = snap((100, 97, 80))
    dark_olive = snap((82, 78, 62))
    # jerrycan body
    put(col, al, rect(7, 9, 25, 29), olive)
    # top profile: three handle bars + spout right
    put(col, al, rect(9, 5, 12, 9), dark_olive)
    put(col, al, rect(14, 5, 17, 9), dark_olive)
    put(col, al, rect(19, 5, 22, 9), dark_olive)
    put(col, al, rect(23, 4, 27, 9), snap((94, 90, 70)))   # spout block
    # recessed X face (the pressed cross)
    put(col, al, bar(9, 11, 23, 27, 2.0), dark_olive, a=0.8)
    put(col, al, bar(23, 11, 9, 27, 2.0), dark_olive, a=0.8)
    # dent crease lower-left
    put(col, al, bar(9, 25, 14, 27, 1.6), snap((70, 66, 52)), a=0.8)
    # chalked top-left light
    put(col, al, rect(7, 9, 12, 14), snap((128, 124, 100)), a=0.45)
    # THE BOLT: decisive accent crossing the face, pale bone, never hot
    bone = snap((196, 184, 152))
    z = np.zeros((S, S))
    z += bar(20, 8, 15, 16, 2.2)
    z += bar(15, 16, 19, 16, 2.0)
    z += bar(19, 16, 12, 26, 2.2)
    put(col, al, np.clip(z, 0, 1), bone)
    # AA battery at the base-left
    put(col, al, rect(2, 24, 6, 31), snap((88, 84, 78)))
    put(col, al, rect(2, 24, 6, 26), snap((140, 134, 124)))  # cap
    put(col, al, rect(3, 23, 5, 24), snap((150, 144, 132)))  # nub
    shade_ul(col, al, 8)
    return finish(col, al)


# ---------------------------------------------------------------------- CLOUT
def icon_clout():
    col, al = canvas()
    # crowd: 4 head+shoulder shapes MERGED into one blob, bumpy top edge
    tones = [snap((100, 92, 79)), snap((92, 85, 74)), snap((110, 101, 86)), snap((96, 88, 74))]
    heads = [(7, 16, 3.4), (13, 14, 3.9), (20, 15, 3.6), (26, 17, 3.2)]
    for (hx, hy, hr), tone in zip(heads, tones):
        put(col, al, ellipse(hx, hy, hr, hr), tone)
        put(col, al, ellipse(hx, hy + 8, hr + 2.6, 7.5), tone)   # shoulders
    # merge the mass: fill the gaps between shoulders to one blob
    put(col, al, rect(3, 22, 30, 30), snap((98, 90, 77)), a=0.9)
    # faint head-top light
    for (hx, hy, hr), _ in zip(heads, tones):
        put(col, al, ellipse(hx - 1, hy - 1.4, hr * 0.55, hr * 0.5, 1.2), snap((126, 116, 100)), a=0.5)
    # SPEECH BUBBLE rising at top-right, decisive tail into the crowd
    bone = snap((198, 188, 160))
    put(col, al, ellipse(23.5, 6.5, 6.5, 4.4, 1.6), bone)
    put(col, al, rect(18, 4, 30, 9), bone)
    tail = np.zeros((S, S))
    tail += bar(22, 9, 17, 14, 2.6)
    put(col, al, np.clip(tail, 0, 1), bone)
    # bubble underside shade
    put(col, al, rect(18, 8, 30, 10), snap((160, 150, 126)), a=0.5)
    shade_ul(col, al, 8)
    return finish(col, al)


def dimmed(rgb, a8):
    """can't-afford: pulled toward mid-grey and darkened, same silhouette"""
    g = rgb.astype(np.float64)
    lum = g.mean(axis=2, keepdims=True)
    out = (g * 0.35 + lum * 0.65) * 0.62
    on = a8 > 0
    fin = rgb.copy().astype(np.float64)
    fin[on] = out[on]
    flat = fin[on].reshape(-1, 3)
    for i in range(flat.shape[0]):
        flat[i] = snap(flat[i])
    fin[on] = flat
    return fin.astype(np.uint8), a8.copy()


# ------------------------------------------------------------------- measure
def measure(rgb, a8):
    on = a8 > 0
    px = rgb[on].reshape(-1, 3) / 255.0
    sats, hot, purple = [], 0, 0
    for r, g, b in px:
        h, s, v = colorsys.rgb_to_hsv(r, g, b)
        sats.append(s)
        if v > 0.92:
            hot += 1
        if 0.70 <= h <= 0.88 and s > 0.2 and v > 0.2:
            purple += 1
    return dict(px=int(on.sum()), sat_mean=round(float(np.mean(sats)), 3),
                hot_frac=round(hot / len(px), 4), purple=purple)


def to_png(rgb, a8, scale=1):
    im = Image.fromarray(np.dstack([rgb, a8]), 'RGBA')
    if scale > 1:
        im = im.resize((S * scale, S * scale), Image.NEAREST)
    return im


def b64(im):
    b = io.BytesIO()
    im.save(b, 'PNG')
    return base64.b64encode(b.getvalue()).decode()


ICONS = [
    ('resources', icon_resources, 'RESOURCES: duct-tape roll dominant (ring, visible core, part-used tab), hammer crossing BEHIND on the diagonal, apple nested at the base. One union silhouette.'),
    ('energy', icon_energy, 'ENERGY: jerrycan dominant (handle-and-spout profile, chalked, dented), bolt as a decisive pale accent never hot, AA battery small at the base. STORED, not switched on.'),
    ('clout', icon_clout, 'CLOUT: the crowd as ONE merged blob with a bumpy top edge (never countable individuals), speech bubble with a decisive tail resolving it. NEVER ON A FEED POST (badge killed 7/21): Wallet/ME readout only.'),
]

tiles, marks = [], {}
for name, fn, cap in ICONS:
    rgb, a8 = fn()
    m = measure(rgb, a8)
    marks[name] = (rgb, a8)
    tiles.append(dict(name=name, px=S, kind=cap, state='normal',
                      metrics=m, b64=b64(to_png(rgb, a8))))
    drgb, da8 = dimmed(rgb, a8)
    tiles.append(dict(name=name + '_dim', px=S, kind=cap + ' [DIMMED / CANT-AFFORD]',
                      state='dimmed', metrics=measure(drgb, da8),
                      b64=b64(to_png(drgb, da8))))
    print(name, m)

# ------------------------------------------------------------------- proofs
# contact sheet at 32/64/96 integer scales
pad = 8
sheet = Image.new('RGBA', (3 * (96 + pad) + pad, 32 + 64 + 96 + 4 * pad), (13, 13, 18, 255))
x = pad
for name, _, _ in ICONS:
    rgb, a8 = marks[name]
    y = pad
    for sc in (1, 2, 3):
        im = to_png(rgb, a8, sc)
        sheet.paste(im, (x + (96 - S * sc) // 2, y), im)
        y += S * sc + pad
    x += 96 + pad
sheet.save(f'{OUT_PROOF}/CONTACT_32_64_96.png')

# solid-black silhouette test
sil = Image.new('RGBA', (3 * (96 + pad) + pad, 96 + 2 * pad), (200, 190, 165, 255))
x = pad
for name, _, _ in ICONS:
    rgb, a8 = marks[name]
    black = np.zeros_like(rgb)
    im = to_png(black, a8, 3)
    sil.paste(im, (x, pad), im)
    x += 96 + pad
sil.save(f'{OUT_PROOF}/SOLID_BLACK_TEST.png')

# phone-chrome mock: dark chrome row + pale desert row, numbers beside marks
def row_mock(bg, fg_dim):
    W, H = 3 * 110 + 20, 64
    im = Image.new('RGBA', (W, H), bg)
    x = 14
    from PIL import ImageDraw
    dr = ImageDraw.Draw(im)
    for (name, _, _), n in zip(ICONS, ('14', '6', '23')):
        rgb, a8 = marks[name]
        ic = to_png(rgb, a8, 2)
        im.paste(ic, (x, (H - 64) // 2 + 8), ic)
        dr.text((x + 70, H // 2 - 8), n, fill=fg_dim)
        x += 110
    return im


mock = Image.new('RGBA', (3 * 110 + 20, 132), (0, 0, 0, 0))
mock.paste(row_mock((21, 21, 28, 255), (216, 208, 188, 255)), (0, 0))
mock.paste(row_mock((199, 184, 152, 255), (40, 34, 24, 255)), (0, 68))
mock.save(f'{OUT_PROOF}/PHONE_CHROME_MOCK.png')

# dimmed row
dm = Image.new('RGBA', (3 * (96 + pad) + pad, 96 + 2 * pad), (21, 21, 28, 255))
x = pad
for name, _, _ in ICONS:
    t = [t for t in tiles if t['name'] == name + '_dim'][0]
    im = Image.open(io.BytesIO(base64.b64decode(t['b64']))).resize((96, 96), Image.NEAREST)
    dm.paste(im, (x, pad), im)
    x += 96 + pad
dm.save(f'{OUT_PROOF}/DIMMED_ROW.png')

bank = dict(
    form='TF-RUN-008 + TF-RUN-009 + TF-RUN-010 (one batch by the forms own law)',
    cooked='8/9/26, inline (board resume after the swarm clock)',
    law='UNJUDGED. Nothing here is canon until Paolo sweeps it.',
    placement_law='NEVER on a feed post - the visible clout badge was KILLED 7/21. Wallet / ME readout only.',
    one_mark_rule='Paolo 7/28 LOCKED: parts union into one silhouette, never a row.',
    palette='every opaque pixel snapped to records/target/BOHEMIA_MASTER_PALETTE.json (64-step ramp)',
    tiles=tiles)
json.dump(bank, open(OUT_BANK, 'w'))
print('banked', len(tiles), 'marks ->', OUT_BANK)
