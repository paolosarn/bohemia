#!/usr/bin/env python3
"""
TF-CHAR-001 - CHARACTER CONTACT SHADOW (8/9/26). Merged job also consumes
TF-CHAR-003's anchor point (the dust puff shares the feet anchor).

WHAT: a soft foreshortened ELLIPSE stamped under every body at the 56x56
character frame's native scale. MULTIPLY-model: the asset is an ALPHA MAP with
no colour of its own - it darkens whatever ground is beneath and inherits the
ground's hue (Eastward-style warm shadow on warm ground). The body today sits
on the dirt like a sticker; this is the thing that glues feet to ground.

THE LAWS BAKED IN, from the merged job spec:
- 45-degree world: foreshortened ellipse, never a circle, never a rectangle,
  never a displaced copy of the sprite.
- Standing ~11-14px wide x 4-5px deep; walk slightly wider; crouched wider and
  deeper but NEVER past the body's widest row (56px frame, widest row ~18px:
  every stamp is measured against that cap below).
- Offset AWAY from the one global light (upper-left), so the bias is
  lower-right, tucked SHORT under the body (Vegas ~36N, near-overhead sun).
- Value: a measured STEP DOWN from the ground band, NEVER an approach to
  black - caliche is a bounce surface. Strength lit / unlit is a value knob
  only (unlit cells own their dark; the shadow nearly vanishes there).
- Soft edge, NO keyline, NO dither, NO purple drift (multiply is neutral by
  construction: alpha only, zero hue shift).
- NEVER baked into sprite pixels (SHADOWS ARE SEPARATE, 7/26 law).
- Single placement, one stamp per body, anchored to the feet row.

REUSE CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md was walked by the
triage agent: gore overlays are red story decals, fire/particle loops are
emissive - no ground-contact shadow exists in any bank; confirmed new cook.
What IS reused: banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt is opened
below and the stamps are PROVEN on its real dirt, yard, road, walk and
garage-floor tiles (the grounds he approved); the response numbers in the bank
are measured on those pixels, not asserted. TASTE CHECK: the reference for
lightness is Hyper Light Drifter's pale shadows, not a black sticker; on
asphalt it nearly disappears and that is CORRECT (dark ground already owns its
value).

  python3 tools/tfcook/TF-CHAR-001_cook.py
    -> banks/tileforms/TF-CHAR-001_CANDIDATES_8_9_26.json  (6 stamps, UNJUDGED)
    -> records/tileforms_proofs/TF-CHAR-001/*.png
"""
import base64
import io
import json
import os

import numpy as np
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.chdir(REPO)

F = 56                     # character frame native size
WIDEST_ROW = 18            # the canon body's widest row in px (measured cap)
OUT_BANK = 'banks/tileforms/TF-CHAR-001_CANDIDATES_8_9_26.json'
OUT_PROOF = 'records/tileforms_proofs/TF-CHAR-001'
os.makedirs(OUT_PROOF, exist_ok=True)

STARTER = json.load(open('banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt'))


def tile(idname):
    for t in STARTER['tiles']:
        if t['id'] == idname:
            return np.array(Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGB'),
                            dtype=np.float64)
    raise KeyError(idname)


def stamp(w, d, strength):
    """soft foreshortened ellipse alpha map on a 56x56 field, anchored to the
    feet row (bottom-centre), biased 1px lower-right away from the UL light"""
    a = np.zeros((F, F))
    cx, cy = F / 2 + 1.0, F - 5.0          # feet row anchor, lower-right bias
    yy, xx = np.mgrid[0:F, 0:F]
    dist = (((xx - cx) / (w / 2)) ** 2 + ((yy - cy) / (d / 2)) ** 2) ** 0.5
    core = np.clip(1.15 - dist, 0, 1)      # soft falloff, no hard rim
    a = np.clip(core * 1.6, 0, 1) * strength
    return a


VARIANTS = [
    ('standing', 13.0, 4.5),
    ('walk', 15.0, 5.0),
    ('crouched', 17.0, 6.5),
]
STRENGTHS = [('lit', 0.30), ('unlit', 0.11)]

GROUNDS = [('dirt', 'dirt'), ('yard_0', 'gravel yard'), ('road_0', 'asphalt'),
           ('walk_0', 'sidewalk'), ('garage_bottom', 'interior floor')]


def apply(ground, alpha):
    """multiply model: out = ground * (1 - alpha)"""
    g = ground.copy()
    a3 = alpha[..., None]
    return g * (1 - a3)


def lum(a):
    return a[..., 0] * 0.299 + a[..., 1] * 0.587 + a[..., 2] * 0.114


tiles, stamps = [], {}
for vname, w, d in VARIANTS:
    assert w <= WIDEST_ROW, '%s exceeds the widest body row' % vname
    for sname, s in STRENGTHS:
        a = stamp(w, d, s)
        stamps[(vname, sname)] = a
        # measured response on every approved ground
        resp = {}
        for gid, glabel in GROUNDS:
            g = tile(gid)
            gy = float(lum(g).mean())
            # measure inside the core of the stamp region on a 56-crop of ground
            gg = np.tile(g, (2, 2, 1))[:F, :F]
            out = apply(gg, a)
            m = a > 0.05
            step = float(lum(gg)[m].mean() - lum(out)[m].mean())
            darkest = float(lum(out)[m].min())
            resp[glabel] = dict(ground_lum=round(gy, 1), mean_step_down=round(step, 1),
                                darkest_px=round(darkest, 1))
        a8 = (np.clip(a, 0, 1) * 255).astype(np.uint8)
        im = Image.fromarray(np.dstack([np.zeros((F, F, 3), np.uint8), a8]), 'RGBA')
        b = io.BytesIO(); im.save(b, 'PNG')
        tiles.append(dict(
            name='shadow_%s_%s' % (vname, sname), px=F,
            kind='contact shadow, %s footprint, %s strength - ALPHA MAP ONLY, '
                 'multiply onto whatever ground is beneath, anchored to the feet '
                 'row, never baked into sprite pixels' % (vname, sname),
            footprint_px=[w, d], strength=s, widest_row_cap=WIDEST_ROW,
            response_measured=resp,
            b64=base64.b64encode(b.getvalue()).decode()))
        print(vname, sname, {k: v['mean_step_down'] for k, v in resp.items()})

# ---------------------------------------------------------------- proofs
# 1. the stamps themselves at 4x, on mid-grey so alpha reads
sheet = Image.new('RGB', (6 * (F * 2 + 8) + 8, F * 2 + 40), (110, 104, 92))
x = 8
from PIL import ImageDraw
dr = ImageDraw.Draw(sheet)
for vname, w, d in VARIANTS:
    for sname, s in STRENGTHS:
        a = stamps[(vname, sname)]
        base = np.full((F, F, 3), (150, 140, 120), np.float64)
        im = Image.fromarray(apply(base, a).astype(np.uint8)).resize((F * 2, F * 2), Image.NEAREST)
        sheet.paste(im, (x, 28))
        dr.text((x, 8), '%s/%s' % (vname[:5], sname), fill=(20, 18, 14))
        x += F * 2 + 8
sheet.save(f'{OUT_PROOF}/STAMPS_2X_ON_FLAT.png')

# 2. ground response strips: each approved ground, bare | lit | unlit
rows = []
for gid, glabel in GROUNDS:
    g = np.tile(tile(gid), (2, 2, 1))[:F, :F]
    row = [g]
    for sname, s in STRENGTHS:
        row.append(apply(g, stamps[('standing', sname)]))
    rows.append((glabel, row))
W = 3 * (F * 2 + 6) + 6
strip = Image.new('RGB', (W, len(rows) * (F * 2 + 22) + 6), (13, 13, 18))
dr = ImageDraw.Draw(strip)
y = 6
for glabel, row in rows:
    x = 6
    for img in row:
        strip.paste(Image.fromarray(img.astype(np.uint8)).resize((F * 2, F * 2), Image.NEAREST), (x, y + 16))
        x += F * 2 + 6
    dr.text((6, y + 2), glabel + '  (bare | lit 0.30 | unlit 0.11)', fill=(216, 208, 188))
    y += F * 2 + 22
strip.save(f'{OUT_PROOF}/GROUND_RESPONSE_ALL_SURFACES.png')

# 3. REAL-SURFACE A/B: the live frame this session already shot from the
# shipped build (player standing at canvas centre). The multiply is applied to
# the flattened frame in the feet region - every pixel a wired shadow would
# show OUTSIDE the body silhouette is reproduced exactly; the body's own foot
# pixels also darken here, which the wired version will not do (stated caveat,
# the wired pass draws under the body).
LIVE = '/tmp/claude-0/-home-user-bohemia/ad310906-a596-54ea-ba26-48ee058a1e63/scratchpad/grime030_live.png'
if os.path.exists(LIVE):
    shot = np.array(Image.open(LIVE).convert('RGB'), dtype=np.float64)
    cx, cy = 400, 1348            # the standing body's feet in this frame (found by eye, not assumed)
    crop = shot[cy - 180:cy + 180, cx - 180:cx + 180]
    scale = 3                     # the shot is dpr-3, art at integer scale
    a = stamps[('standing', 'lit')]
    big = np.kron(a, np.ones((scale, scale)))
    H, W2 = crop.shape[:2]
    ah, aw = big.shape
    oy, ox = H // 2 - ah // 2, W2 // 2 - aw // 2
    ab = crop.copy()
    region = ab[oy:oy + ah, ox:ox + aw]
    region *= (1 - big[..., None])
    pair = Image.new('RGB', (W2 * 2 + 12, H + 24), (13, 13, 18))
    pair.paste(Image.fromarray(crop.astype(np.uint8)), (0, 24))
    pair.paste(Image.fromarray(ab.astype(np.uint8)), (W2 + 12, 24))
    dr = ImageDraw.Draw(pair)
    dr.text((4, 4), 'SHIPPED (no shadow)', fill=(216, 208, 188))
    dr.text((W2 + 16, 4), 'WITH standing/lit stamp (mock multiply on the flat frame)', fill=(216, 208, 188))
    pair.save(f'{OUT_PROOF}/REAL_FRAME_AB.png')
    print('real-frame A/B written')

bank = dict(
    form='TF-CHAR-001 (merged job; TF-CHAR-003 dust shares the feet anchor)',
    cooked='8/9/26, inline (board resume after the swarm clock)',
    law='UNJUDGED. Nothing here is canon until Paolo sweeps it.',
    render_model='MULTIPLY: out = ground * (1 - alpha). Alpha map only, no colour of its own, inherits ground hue. Never baked into sprite pixels (SHADOWS ARE SEPARATE 7/26).',
    anchor='bottom-centre of the 56px frame, feet row, 1px lower-right bias away from the upper-left light',
    unlit_rule='unlit-owned-light cells use the 0.11 stamp - essentially absent; full strength at night in unlit cells is banned by the form',
    tiles=tiles)
json.dump(bank, open(OUT_BANK, 'w'))
print('banked', len(tiles), 'stamps ->', OUT_BANK)
