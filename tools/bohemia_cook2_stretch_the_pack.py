#!/usr/bin/env python3
"""COOK TWO [stretch the pack]: THE RECIPES (rule 108 ROUND EIGHT (e); records/BOHEMIA_RESEARCH_UNLOCK_THE_LIMITS_08_
STRETCHING_THE_PACKS_KITBASHING_10_11_26.md). Nothing is drawn beside his pack: every new piece is CUT, PADDED,
LAYERED or RECOLOURED from his parts, then MEASURED against the family's seven numbers. Headless PIL, a module the
cook tools import. records/ only (rule 100).
  pack(name, idx)            -> his tile, RGBA, asserted UP in the confirmed set
  cut_frame(a, family)       -> his baked dark frame removed per side (measured on the study page)
  pad(a, w, h)               -> centred on a w x h cell by edge-extending his own border pixels (no fill colour
                                invented): his pieces are 92 to 96 wide, not a clean grid
  decal(base, src, mask, at, strength) -> darken-only overlay of HIS stain/crack pixels (never lightens, no outline)
  seven(a)                   -> the pack-rule sheet's seven numbers for one piece
  family_sheet(...)          -> the seven numbers' range across a family
  python3 tools/bohemia_cook2_stretch_the_pack.py   (writes the families' seven numbers)

REFERENCE CHECK (added at the seam by DIRECTION 10/11, the 9/4 standing duty): the compare law
(laws/BOHEMIA_LAW_COMPARE_EVERY_PIECE_OF_ART_TO_THE_WORLD_9_4_26.md), the approved asset index (his 7/13 UP set),
the card of numbers and skills/bohemia-pixel-art (load it first), AH-01 and AH-03. The source is his own tiles.
No reference game.

REUSE CHECK (REUSE-FIRST, 7/22): this module IS the reuse: it opens his HD tile repo (banks/BOHEMIA_HD_TILE_REPO_part1-4.txt)
and his 7/13 UP list and refuses any tile that is not UP (pack()); every recipe below cuts, pads, layers or recolours
his tiles, none draws.

TASTE CHECK: his 10/10 'look again at the tiles we downloaded' and his UP on the crossing, the 47 and the recolour; the
recolour keeps his luminance and (keep_grain) his grain, never a hue filter.
"""
import json, base64, io, os, colorsys
import numpy as np
from PIL import Image
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_P = {}
for _i in (1, 2, 3, 4): _P.update(json.load(open(os.path.join(R, f'banks/BOHEMIA_HD_TILE_REPO_part{_i}.txt')))['packs'])
UP = {(v['pack'], v['idx']) for v in json.load(open(os.path.join(R, 'banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt')))['verdicts'] if v['v'] == 'UP'}
SIDEWALK, ROAD, BURNT = '1. Cracked contrete tiles', '1. Cracked street tiles', '7. Burnt ground tiles'
# top, bottom, left, right: measured on records/BOHEMIA_HOW_THE_PACK_DID_IT_SIDEWALK_10_10_26.md (round two)
CUT = {SIDEWALK: (6, 7, 5, 5), ROAD: (5, 5, 5, 5), BURNT: (5, 5, 5, 5)}

def pack(name, idx):
    assert (name, idx) in UP, f'{name}#{idx} is not UP in his confirmed set'
    return np.asarray(Image.open(io.BytesIO(base64.b64decode(_P[name][idx]['b64']))).convert('RGBA'))

def cut_frame(a, family):
    t, b, l, r = CUT[family]; return a[t:a.shape[0] - b, l:a.shape[1] - r]

def pad(a, w, h):
    """centre a on w x h; any new row or column repeats his own nearest edge pixel (np.pad 'edge')."""
    ph, pw = max(0, h - a.shape[0]), max(0, w - a.shape[1])
    a = np.pad(a, ((ph // 2, ph - ph // 2), (pw // 2, pw - pw // 2), (0, 0)), mode='edge')
    y0, x0 = (a.shape[0] - h) // 2, (a.shape[1] - w) // 2
    return a[y0:y0 + h, x0:x0 + w]

def decal(base, src, at, strength=1.0, thresh=None):
    """darken-only: a src pixel lands only where it is DARKER than the base under it; its mask is src's own dark
       pixels (below thresh, default its 35th percentile), so the decal is his stain, not a rectangle."""
    out = base.astype(float).copy(); y, x = at
    s = src[..., :3].astype(float); lum = s.sum(2)
    t = np.percentile(lum, 35) if thresh is None else thresh
    m = (lum < t).astype(float) * strength
    h = min(s.shape[0], out.shape[0] - y); w = min(s.shape[1], out.shape[1] - x)
    reg = out[y:y + h, x:x + w, :3]; s = s[:h, :w]; m = m[:h, :w, None]
    out[y:y + h, x:x + w, :3] = np.minimum(reg, reg * (1 - m) + s * m)
    return out.astype(np.uint8)

def seven(a):
    rgb = a[..., :3].astype(int); al = a[..., 3] if a.shape[2] == 4 else np.full(a.shape[:2], 255)
    op = al > 0; px = rgb[op]; lum = px.sum(1) / 3
    H, W = rgb.shape[:2]; L = rgb.sum(2) / 3
    # 1 outline: rings from the edge inward while darker than the inside's 25th percentile
    inside = np.percentile(L[H // 4:3 * H // 4, W // 4:3 * W // 4], 25); w = 0
    for r in range(12):
        ring = np.concatenate([L[r, r:W - r], L[H - 1 - r, r:W - r], L[r:H - r, r], L[r:H - r, W - 1 - r]])
        if ring.mean() < inside: w = r + 1
        else: break
    ring0 = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]]).mean(0).round().tolist()
    # 2 light: brighter half, as a clock (12 = from the top)
    tb = L[:H // 2].mean() - L[H // 2:].mean(); lr = L[:, :W // 2].mean() - L[:, W // 2:].mean()
    ang = (np.degrees(np.arctan2(lr, tb)) % 360); clock = round((12 - ang / 30) % 12) or 12
    # 3 saturation
    sat = np.array([colorsys.rgb_to_hsv(*(p / 255))[1] for p in px[::7]])
    # 4 cluster: mean run length of identical colour along rows (grain)
    runs = []
    for row in rgb[::4]:
        k = 1
        for j in range(1, len(row)):
            if (row[j] == row[j - 1]).all(): k += 1
            else: runs.append(k); k = 1
        runs.append(k)
    # 5 palette: unique colours; 6 ramp steps: distinct luma bands of 8 that hold >0.5% of pixels
    pal = len({tuple(p) for p in px})
    hist = np.bincount((lum // 8).astype(int), minlength=33) / len(lum)
    return dict(outline_px=w, outline_rgb=ring0, light_clock=clock, light_tb=round(float(tb), 1), light_lr=round(float(lr), 1),
                sat=[round(float(np.percentile(sat, q)), 2) for q in (5, 50, 95)], cluster_run=round(float(np.mean(runs)), 2),
                palette=pal, ramp_steps=int((hist > 0.005).sum()), footprint=[W, H])

def family_sheet(name, ids):
    rows = [seven(pack(name, i)) for i in ids]
    rng = lambda k: [min(r[k] for r in rows), max(r[k] for r in rows)]
    return dict(family=name, n=len(rows), outline_px=rng('outline_px'), light_clock=sorted({r['light_clock'] for r in rows}),
                sat_median=[min(r['sat'][1] for r in rows), max(r['sat'][1] for r in rows)], cluster_run=rng('cluster_run'),
                palette=rng('palette'), ramp_steps=rng('ramp_steps'), footprints=sorted({tuple(r['footprint']) for r in rows}))

if __name__ == '__main__':
    fams = {SIDEWALK: [i for i in range(45) if (SIDEWALK, i) in UP], ROAD: [i for i in range(36) if (ROAD, i) in UP]}
    out = {k: family_sheet(k, v) for k, v in fams.items()}
    json.dump(out, open(os.path.join(R, 'records/BOHEMIA_COOK2_THE_SEVEN_NUMBERS_GROUND_10_11_26.json'), 'w'), indent=1, default=list)
    for k, v in out.items(): print(k, v)

def _hsv(x):
    """vectorised rgb (0-1, n x 3) to hsv"""
    mx, mn = x.max(1), x.min(1); d = mx - mn; h = np.zeros(len(x))
    r, g, b = x[:, 0], x[:, 1], x[:, 2]; nz = d > 1e-9
    i = nz & (mx == r); h[i] = ((g - b)[i] / d[i]) % 6
    i = nz & (mx == g) & (mx != r); h[i] = (b - r)[i] / d[i] + 2
    i = nz & (mx == b) & (mx != r) & (mx != g); h[i] = (r - g)[i] / d[i] + 4
    return np.stack([h / 6, np.where(mx > 0, d / np.maximum(mx, 1e-9), 0), mx], 1)

def _rgb(x):
    """vectorised hsv (n x 3) to rgb"""
    h, s, v = x[:, 0] * 6, x[:, 1], x[:, 2]; i = np.floor(h).astype(int) % 6; f = h - np.floor(h)
    p, q, t = v * (1 - s), v * (1 - s * f), v * (1 - s * (1 - f))
    return np.select([i[:, None] == k for k in range(6)],
                     [np.stack(c, 1) for c in ((v, t, p), (q, v, p), (p, v, t), (p, q, v), (t, p, v), (v, p, q))])

def recolour(a, mask, target_hex, levels=6, shift_deg=10, sat_scale=1.0, keep_grain=False):
    """keep_grain (COOK TWO 10/18, round two of [the street joins for the map]): the bands set the hue and the
       saturation as before, and each pixel keeps its OWN offset from its band (its hue step and its saturation
       ratio), so his tile's colour grain survives the recolour. Measured on his soil tile #2: the plain recolour
       keeps 51 colours per 1,000 px of his 526, the twin gate reads it FAR; off by default, so every sheet made
       before this line regenerates bit for bit."""
    out = recolour_bands(a, mask, target_hex, levels, shift_deg, sat_scale)
    if not keep_grain or not mask.any():
        return out
    px = a[mask][..., :3].astype(float) / 255; nb = out[mask][..., :3].astype(float) / 255
    lum = px @ np.array([0.299, 0.587, 0.114])
    edges = np.quantile(lum, np.linspace(0, 1, levels + 1)[1:-1]); band = np.digitize(lum, edges)
    ho, hn = _hsv(px), _hsv(nb)
    for b in range(levels):
        sel = band == b
        if not sel.any(): continue
        ang = ho[sel, 0] * 2 * np.pi; mh = np.arctan2(np.sin(ang).mean(), np.cos(ang).mean()) / (2 * np.pi)
        dh = ((ho[sel, 0] - mh + 0.5) % 1 - 0.5) * np.clip(ho[sel, 1] * 4, 0, 1)   # a grey pixel's hue is noise
        ms = max(ho[sel, 1].mean(), 1e-6)
        hn[sel, 0] = (hn[sel, 0] + dh) % 1; hn[sel, 1] = np.clip(hn[sel, 1] * ho[sel, 1] / ms, 0, 1)
    rgb = _rgb(hn); y = rgb @ np.array([0.299, 0.587, 0.114])
    rgb = np.clip(rgb * (lum / np.maximum(y, 1e-3))[:, None], 0, 1)
    o = out[..., :3].astype(float); o[mask] = rgb * 255; out[..., :3] = o.round().astype(np.uint8)
    return out

def recolour_bands(a, mask, target_hex, levels=6, shift_deg=10, sat_scale=1.0):
    """FACTION RECOLOUR, shade to shade (the research: 'a palette swap is not a hue filter'). The masked pixels are
       quantised into `levels` luminance bands; each band is rebuilt on the target's hue keeping ITS OWN luminance,
       with the hue drifting warm in the lights and cool in the shadows (+/- shift_deg, the field norm 10-20) and
       saturation peaking mid-ramp. Pixels outside the mask are returned untouched, bit for bit."""
    t = tuple(int(target_hex[i:i + 2], 16) / 255 for i in (1, 3, 5)); th, ts, tv = colorsys.rgb_to_hsv(*t)
    out = a.copy(); px = a[mask][..., :3].astype(float) / 255
    if not len(px): return out
    lum = px @ np.array([0.299, 0.587, 0.114])
    edges = np.quantile(lum, np.linspace(0, 1, levels + 1)[1:-1]); band = np.digitize(lum, edges)
    new = np.zeros_like(px)
    for b in range(levels):
        sel = band == b
        if not sel.any(): continue
        f = b / max(1, levels - 1)                                   # 0 = darkest band, 1 = lightest
        h = (th + np.radians(0) + (f - 0.5) * 2 * shift_deg / 360) % 1
        s = ts * (0.75 + 0.5 * (1 - abs(f - 0.5) * 2)) * 0.9 * sat_scale   # saturation peaks mid-ramp
        for k in np.nonzero(sel)[0]:
            r, g, bb = colorsys.hsv_to_rgb(h, min(1, s), 1.0)
            y = r * 0.299 + g * 0.587 + bb * 0.114
            sc = lum[k] / max(y, 1e-3); new[k] = np.clip(np.array([r, g, bb]) * sc, 0, 1)
    o = out[..., :3].astype(float); o[mask] = new * 255; out[..., :3] = o.round().astype(np.uint8)
    return out
