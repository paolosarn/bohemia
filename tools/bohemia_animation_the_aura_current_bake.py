#!/usr/bin/env python3
"""BOHEMIA -- ANIMATION [the aura of the one you control], CANDIDATE C, THE CURRENT: THE BAKE. DIRECTION's master rig drew
the wire-and-foil arcs (tools/bohemia_animation_the_aura_current_prep.py) round a stand-in man in eight facings and twelve
keys; this keeps ONLY the arcs' own pixels and packs them for the VOTE page (rule 108 (a): nothing here draws a pixel, it
only chooses which of the rig's pixels survive).

  * WHICH PIXELS: the rig's object-id pass (rigobj_Arcs_<F>_kNN.png, every mesh part one flat colour, obj_table in
    rig.json) names the part on every pixel of every clip key. A pixel survives when its part is an arc OF THAT KEY and the
    colour render is opaque there; the stand-in (its body, the arcs it hides, its contact shadow, its four ground markers)
    and the background go transparent. An arc of another key showing (it should be a speck inside the stand-in's belly)
    is counted as a stray and refused.
  * THE SHEET: one lossless webp, slices/vote/ANIMATION_THE_AURA_CURRENT.webp, rows the facings N NE E SE S SW W NW,
    columns keys 0..11, every cell the rig's one crop box (so no key jitters against another).
  * THE TABLE: slices/vote/ANIMATION_THE_AURA_CURRENT_TABLE.js, window.AURA_CURRENT {cell, keys, keys_per_beat, bpm, ppm,
    rows, origin}. origin[F] is the cell pixel where the world point (0,0,0), the stand-in's feet centre on the ground,
    lands: COMPUTED from the rig's own camera numbers (rig.json ground_screen minus crop_box_px: the camera looks at half
    the stretched height, so the ground sits look_z x sin(tilt) x ppm below the image centre), the same for every facing
    because the model turns about that point; then CHECKED against the render: the stand-in's sole (its lowest ring) is
    projected through the same camera in every facing and its lowest row and centre compared with the stand-in's id pixels.
  * THE NUMBERS: arc pixels per key, and how much of the body's outline the arcs touch (the outline is the stand-in's
    silhouette, the union of its id pixels over the twelve keys; touched = an arc pixel within one pixel), and the share of
    arc pixels that lie in the two-pixel band just outside the silhouette (an arc hugging the outline would be all band).
  * --check <png> [crew_rig_dir]: the alignment sheet: keys 0, 1, 3, 6 over the crewman cast_poncho in all eight facings,
    both aligned by where each rig puts the world origin, 3x nearest on #2a2219.

REFERENCE CHECK (the 9/4 standing duty): the rig's own boxes and camera; the crewman cast_poncho is the body. No reference game.
Run: python3 tools/bohemia_animation_the_aura_current_bake.py [--rig records/target/master_rig/aura_current] [--check <png>]
"""
import os, sys, json, math
import numpy as np
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FACINGS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
CLIP = 'Arcs'
SHEET = os.path.join(ROOT, 'slices/vote/ANIMATION_THE_AURA_CURRENT.webp')
TABLE = os.path.join(ROOT, 'slices/vote/ANIMATION_THE_AURA_CURRENT_TABLE.js')
CREW = os.path.join(ROOT, 'records/target/portrait/rig/crew/cast_poncho')
SOLE = (0.13, 0.12, -0.03)
# THE RIM (ANIMATION 10/19, the hand-finish after the pipe, rule 114(c): 'hero assets are hand-finished after the pipe').
# Filmed on the real fight, the pale wire vanished on a pale man over tan ground; every person on that board carries a
# dark one-pixel rim (the fight's DAY_RIM), so the arcs get one too, in the style palette's runway black (cloth_black's
# second step, never black), on their shadow side (see THE RIM IS SELECTIVE). It is the arcs' edge, never his: it is
# drawn only beside the arcs. --no-rim bakes the rig's pixels alone.
RIM = None if '--no-rim' in sys.argv else np.array([0x1d, 0x1b, 0x1b, 255], np.uint8)
# THE RIM IS SELECTIVE, measured (10/19): a dark pixel all round every arc put the man-and-arcs picture's top eight
# colours at 15 to 23 percent (the style guide's G2 line is 11.1: a flat list is the AI tell); taking each rim pixel from the
# arc's own shaded side kept the colours varied but turned the edge a soft grey and read lit from below on two facings.
# So the rim is the pixel-art craft's SELECTIVE OUTLINE: only on the side of each arc away from the one sun (below and to
# the right; the guide's light is up and to the left), half the dark pixels, and it agrees with the light. ITS COLOUR RUNS
# ALONG THE RUNWAY-BLACK RAMP (cloth_black's three dark steps, #141313 #1d1b1b #2e2b2c, blended, never snapped): the
# brighter the arc pixel it sits under, the darker its edge, so the edge varies with the wire as the rig rendered it; one
# flat colour still carried the top eight at 11 to 15 percent.
CLOTH = np.array([[0x14, 0x13, 0x13], [0x1d, 0x1b, 0x1b], [0x2e, 0x2b, 0x2c]], float)


def ramp_rim(col, keep, rim):
    H, W = keep.shape; v = col[..., :3].astype(float) @ np.array([0.299, 0.587, 0.114]); out = []
    for y, x in zip(*np.nonzero(rim)):
        nb = [(y - 1, x), (y, x - 1), (y - 1, x - 1)]   # the arc pixels it sits below and to the right of
        vals = [v[a, b] for a, b in nb if 0 <= a < H and 0 <= b < W and keep[a, b]]
        L = max(vals) if vals else 128.0
        u = 2.0 * (1.0 - max(0.0, min(1.0, (L - 90.0) / 160.0)))   # value 250 -> the darkest step, 90 -> the lightest
        i = min(1, int(u)); f = u - i
        c = CLOTH[i] + (CLOTH[i + 1] - CLOTH[i]) * f
        out.append([int(round(c[0])), int(round(c[1])), int(round(c[2])), 255])
    return np.array(out, np.uint8).reshape(-1, 4)

# THE SLIVERS (the same hand-finish, 10/19): an arc passing behind the stand-in's head can peek out by a pixel or three
# where a real head of hair would hide it; rimmed, such a speck became a small black box on the crewman's hair. A piece of
# an arc smaller than SLIVER pixels (8-connected) is not drawn.
SLIVER = 8


def drop_slivers(m):
    H, W = m.shape; seen = np.zeros_like(m); out = m.copy()
    for y0, x0 in zip(*np.nonzero(m)):
        if seen[y0, x0]: continue
        stack = [(y0, x0)]; seen[y0, x0] = True; comp = []
        while stack:
            y, x = stack.pop(); comp.append((y, x))
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    v, u = y + dy, x + dx
                    if 0 <= v < H and 0 <= u < W and m[v, u] and not seen[v, u]: seen[v, u] = True; stack.append((v, u))
        if len(comp) < SLIVER:
            for y, x in comp: out[y, x] = False
    return out   # the stand-in's lowest ring in the prep (half width, half depth, front shift), metres


def opt(k, d):
    a = sys.argv
    return a[a.index(k) + 1] if k in a else d


def hexrgb(h): return np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], float)


def shift(m, dy, dx):
    o = np.zeros_like(m); H, W = m.shape
    o[max(0, dy):H + min(0, dy), max(0, dx):W + min(0, dx)] = m[max(0, -dy):H + min(0, -dy), max(0, -dx):W + min(0, -dx)]
    return o


def dilate(m, r=1):
    o = m.copy()
    for dy in range(-r, r + 1):
        for dx in range(-r, r + 1):
            if dy or dx: o |= shift(m, dy, dx)
    return o


def erode(m, r=1): return ~dilate(~m, r)


def ground_px(meta):
    """where the world origin lands in the cell, from the rig's camera numbers (rig.json): the image centre is the look
    point at half the stretched height; the ground is look_z sin(tilt) ppm below it. A round-five rig.json (the crewman)
    has no ground_screen and its ground_px is the look point (the rig's own round-seven note), so it is rebuilt here."""
    res, box, ppm, t = meta['res'], meta['crop_box_px'], meta['ppm'], math.radians(meta['camera']['tilt_deg'])
    look_z = meta['real_dims_m'][2] * meta['z_stretch'] / 2.0
    gs = meta.get('ground_screen') or [res / 2.0, res / 2.0 + look_z * math.sin(t) * ppm]
    return [gs[0] - box[0], gs[1] - box[1]]


def project(meta, i, P):
    """world points (metres, the model's own axes) to cell pixels (continuous, y down) under the rig's camera in facing i"""
    res, box, ppm, t = meta['res'], meta['crop_box_px'], meta['ppm'], math.radians(meta['camera']['tilt_deg'])
    k, zs = meta['scale_from_model'], meta['z_stretch']; a = math.radians(meta['base_turn_deg'] - 45 * i)
    x, y, z = P[:, 0] * k, P[:, 1] * k, P[:, 2] * k * zs
    xr, yr = x * math.cos(a) - y * math.sin(a), x * math.sin(a) + y * math.cos(a)
    look_z = meta['real_dims_m'][2] * zs / 2.0
    v = yr * math.cos(t) + (z - look_z) * math.sin(t)
    return np.stack([res / 2.0 + xr * ppm - box[0], res / 2.0 - v * ppm - box[1]], 1)


def main():
    rigdir = os.path.join(ROOT, opt('--rig', 'records/target/master_rig/aura_current'))
    meta = json.load(open(os.path.join(rigdir, 'rig.json')))
    box = meta['crop_box_px']; W, H = box[2] - box[0], box[3] - box[1]
    clip = meta['clips'][CLIP]; keys = clip['keys']
    names = sorted(meta['obj_table']); cols = np.stack([hexrgb(meta['obj_table'][n]) for n in names])
    objf = {os.path.basename(f): os.path.join(ROOT, f) for f in meta['obj_files']}
    sheet = np.zeros((H * len(FACINGS), W * keys, 4), np.uint8)
    stats = dict(arc_px=np.zeros((len(FACINGS), keys), int), stray=0, dropped=0, unmatched=0)
    occ_union, arc_masks = {}, {}
    for i, f in enumerate(FACINGS):
        occ_union[f] = np.zeros((H, W), bool)
        for j in range(keys):
            col = np.asarray(Image.open(os.path.join(ROOT, clip['files'][i * keys + j])).convert('RGBA'))
            ida = np.asarray(Image.open(objf['rigobj_%s_%s_k%02d.png' % (CLIP, f, j)]).convert('RGBA')).astype(float)
            op = ida[..., 3] > 127
            d = ((ida[..., None, :3] - cols[None, None]) ** 2).sum(-1); near = d.argmin(-1); ok = d.min(-1) < 3 * 24 ** 2
            stats['unmatched'] += int((op & ~ok).sum())
            nm = np.array(names)[near]
            mine = op & ok & (np.char.startswith(nm, 'arc_k%02d_' % j))
            other = op & ok & np.char.startswith(nm, 'arc_') & ~mine
            stats['stray'] += int(other.sum())
            occ_union[f] |= op & ok & (nm == 'occluder')
            keep = mine & (col[..., 3] == 255)
            keep = drop_slivers(keep)   # see SLIVER
            stats['dropped'] += int((mine & ~keep).sum())
            cell = np.zeros((H, W, 4), np.uint8); cell[keep] = col[keep]
            if RIM is not None:   # THE RIM (the hand-finish, rule 114(c)): the arcs' own one-pixel dark edge, see RIM
                rim = (shift(keep, 1, 0) | shift(keep, 0, 1) | shift(keep, 1, 1)) & ~keep; cell[rim] = ramp_rim(col, keep, rim)
            sheet[i * H:(i + 1) * H, j * W:(j + 1) * W] = cell
            stats['arc_px'][i, j] = int(keep.sum()); arc_masks[(f, j)] = keep
    if stats['stray']: raise SystemExit('REFUSED: %d pixels of arcs from another key' % stats['stray'])
    os.makedirs(os.path.dirname(SHEET), exist_ok=True)
    Image.fromarray(sheet, 'RGBA').save(SHEET, 'WEBP', lossless=True, quality=100, method=6)
    # the origin, computed from the camera; then checked against the stand-in's own pixels in every facing
    g = ground_px(meta); origin = [int(round(g[0])), int(round(g[1]))]
    th = np.linspace(0, 2 * np.pi, 96, endpoint=False)
    sole = np.stack([SOLE[0] * np.cos(th), SOLE[2] + SOLE[1] * np.sin(th), np.zeros_like(th)], 1)
    checks, outline = {}, {}
    for i, f in enumerate(FACINGS):
        body = dilate(erode(occ_union[f]))          # the stand-in's silhouette, its 1 px ground markers opened away
        ys, xs = np.nonzero(body)
        pr = project(meta, i, sole); low = pr[:, 1].max()
        foot = xs[ys >= ys.max() - 2]
        checks[f] = dict(sole_bottom_predicted=round(float(low), 2), sole_bottom_measured=int(ys.max()) + 1,
                         feet_centre_x_predicted=round(float(pr[:, 0].mean()), 2), feet_centre_x_measured=round(float((foot.min() + foot.max() + 1) / 2.0), 1))
        edge = body & ~erode(body); band = dilate(body, 2) & ~body
        touched, inband, total = [], [], []
        for j in range(keys):
            a = arc_masks[(f, j)]
            touched.append(float((edge & dilate(a)).sum()) / max(1, edge.sum()))
            inband.append(float((a & band).sum()) / max(1, a.sum()))
        outline[f] = dict(touched_max=round(max(touched), 3), touched_mean=round(float(np.mean(touched)), 3), arc_in_outline_band_mean=round(float(np.mean(inband)), 3),
                          touched_by_key=[round(x, 3) for x in touched])
    per_key = stats['arc_px'].mean(0)
    table = dict(src='ANIMATION_THE_AURA_CURRENT.webp', cell=[W, H], keys=keys, keys_per_beat=3, bpm=120, ppm=int(meta['ppm']),
                 rows={f: i for i, f in enumerate(FACINGS)}, origin={f: origin for f in FACINGS},
                 origin_exact=[round(g[0], 3), round(g[1], 3)], layer='front',
                 rig=os.path.relpath(os.path.join(rigdir, 'rig.json'), ROOT), model=meta['model'],
                 arc_px_by_key=[int(round(x)) for x in per_key], rim=None if RIM is None else '#1d1b1b')
    js = ('/* ANIMATION [the aura of the one you control], CANDIDATE C, THE CURRENT: the sheet\'s table (written by\n'
          '   tools/bohemia_animation_the_aura_current_bake.py from DIRECTION\'s master rig, never by hand). Rows are the facings,\n'
          '   columns the twelve keys of one bar (three a beat at 120 BPM); a cell is the rig\'s one crop box. origin[F] is the\n'
          '   cell pixel where the stand-in\'s feet centre (the world origin) lands, computed from the rig\'s camera (rig.json\n'
          '   ground_screen minus crop_box_px) and checked against the stand-in\'s own pixels; lay it on his feet point. */\n'
          'window.AURA_CURRENT = %s;\n' % json.dumps(table, separators=(',', ':')))
    open(TABLE, 'w').write(js)
    report = dict(sheet=os.path.relpath(SHEET, ROOT), table=os.path.relpath(TABLE, ROOT), cell=[W, H], origin=origin, origin_exact=table['origin_exact'],
                  arc_px_mean_per_key=round(float(per_key.mean()), 1), arc_px_by_key=table['arc_px_by_key'], arc_px_min_cell=int(stats['arc_px'].min()),
                  dropped_id_not_opaque=stats['dropped'], unmatched_id=stats['unmatched'], stray=stats['stray'], origin_check=checks, outline=outline,
                  sheet_bytes=os.path.getsize(SHEET))
    print(json.dumps(report, indent=1))
    if '--check' in sys.argv: check_sheet(meta, sheet, W, H, g, opt('--check', None), opt('--crew', CREW))


def lay(tile, im, x, y):
    """alpha-composite im onto tile with its corner at (x, y), either may be negative"""
    sx, sy = max(0, -x), max(0, -y)
    if sx >= im.width or sy >= im.height: return
    tile.alpha_composite(im, (max(0, x), max(0, y)), (sx, sy))


def check_sheet(meta, sheet, W, H, g, out, crewdir):
    """keys 0, 1, 3, 6 over the crewman in eight facings, both laid by where each rig puts the world origin"""
    cm = json.load(open(os.path.join(crewdir, 'rig.json')))
    cg = ground_px(cm)
    off = (int(round(cg[0] - g[0])), int(round(cg[1] - g[1])))   # the crewman's cell origin minus the aura's: an exact integer when both are 1.72 m
    cb = cm['crop_box_px']; CW, CH = cb[2] - cb[0], cb[3] - cb[1]
    # one tile holds both cells: the aura's at (ax, ay), the crewman's at (ax - off) (an off of (7, -5) put his top 5 rows outside)
    ax, ay = max(0, off[0]), max(0, off[1]); TW, TH = max(ax + W, ax - off[0] + CW), max(ay + H, ay - off[1] + CH)
    sys.stderr.write('ALIGN crewman origin %s (his rig.json look point %s + the ground drop), aura origin %s; tile %dx%d, aura cell at %s, crewman cell at %s\n'
                     % ([round(x, 2) for x in cg], cm.get('ground_px'), [round(x, 2) for x in g], TW, TH, (ax, ay), (ax - off[0], ay - off[1])))
    KEYS_SHOWN = [0, 1, 3, 6]; S = 3; pad, lab = 6, 14
    cw, ch = TW * S, TH * S
    img = Image.new('RGB', (pad + len(FACINGS) * (cw + pad), lab + pad + len(KEYS_SHOWN) * (ch + pad)), (0x2a, 0x22, 0x19))
    dr = ImageDraw.Draw(img)
    for i, f in enumerate(FACINGS):
        dr.text((pad + i * (cw + pad) + 2, 2), f, fill=(200, 190, 170))
        body = Image.open(os.path.join(crewdir, 'rig_%s.png' % f)).convert('RGBA')
        shp = os.path.join(crewdir, 'shadow_%s.png' % f)
        for r, j in enumerate(KEYS_SHOWN):
            tile = Image.new('RGBA', (TW, TH), (0x2a, 0x22, 0x19, 255))
            if os.path.exists(shp): lay(tile, Image.open(shp).convert('RGBA'), ax - off[0], ay - off[1])
            lay(tile, body, ax - off[0], ay - off[1])
            arcs = Image.fromarray(sheet[i * H:(i + 1) * H, j * W:(j + 1) * W], 'RGBA')
            lay(tile, arcs, ax, ay)
            x, y = pad + i * (cw + pad), lab + pad + r * (ch + pad)
            img.paste(tile.convert('RGB').resize((cw, ch), Image.NEAREST), (x, y))
            if i == 0: dr.text((x + 2, y + 2), 'k%d' % j, fill=(200, 190, 170))
    os.makedirs(os.path.dirname(out), exist_ok=True); img.save(out)
    sys.stderr.write('CHECK %s %s\n' % (out, img.size))


if __name__ == '__main__':
    main()
