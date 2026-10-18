#!/usr/bin/env python3
"""THE TWIN GATE'S RULERS (10/18/26, PLUMBER lane, VAMILY row [the twin gate]; rule 108 ROUND EIGHT (c),
Paolo's twin law (82): the packs he bought are the ruler).

A new piece is scored against its NAMED PACK TWIN and against its FAMILY (the pooled pack pieces) at the
twin's pixel size, with rulers that share no formula, so no cook can tune against one number (Goodhart:
records/BOHEMIA_RESEARCH_UNLOCK_THE_LIMITS_03_GIVING_THE_CHATS_EYES_10_11_26.md section 4):

  COLOUR   earth mover's distance between the two colour distributions in CIE Lab (sliced: the mean 1-D
           Wasserstein distance over 48 fixed directions, numpy only, Lab units)
  PATTERN  local binary patterns (8 neighbours, radius 1, rotation-invariant uniform, 10 bins) on the
           luminance: chi-square distance between the two histograms. Stands in for the learned look
           (DINOv2 ViT-S/14) until its weights reach a box this repo runs on (LOOK below)
  PAINTER  DIRECTION's own five numbers (tools/bohemia_direction_twin_sheets.py stats(): colours per 1,000
           px, value range, dark-line share, detail, saturation): the ratio ours over the twin's
  GRID     one honest pixel grid: the block size must equal the family's (1 for the HD packs) and no
           fractional grid (a 1.5x nearest upscale reads as runs of 1 and 2)
  SHAPE    the 8x8 silhouette's ink between the family's 5th and 95th percentile
  LOOK     DINOv2 ViT-S/14 cosine (Apache-2.0: LICENSE and MODEL_CARD.md of facebookresearch/dinov2 read
           10/18), measured only when an ONNX export sits at tools/models/dinov2_vits14.onnx (or
           $BOHEMIA_DINOV2_ONNX); otherwise UNMEASURED, never a pass. The export and the box are GitHub's free
           runner (tools/bohemia_look_export.py, .github/workflows/look.yml), because the weights' hosts
           answer 403 from the container. Its line is the packs' 10th percentile cosine (pair and centroid):
           IN at or over it on the twin or the family, FAR under the packs' 1st percentile on both
  SCRAMBLE THE RULER FOR STRUCTURE (the coordinator's call on [the look leg], 10/18: at the family's line no
           ruler told his car from his car cut into squares and shuffled). The piece's LOOK cosine to its twin
           against the best of three pixel-scrambled copies of ITSELF (every pixel moved, none changed: the same
           colours, the structure gone); the piece must beat its own scramble by the MARGIN his YES pieces beat
           theirs by (the weakest YES item, per family, an item's gap the median of its sprites'; the
           registry's newest verdict 'up', a pack twin, its sprites). MEASURED WRONG BOTH WAYS (run 39156939522:
           it passed his car shuffled in squares and failed his own ground tiles), so it prints and holds nothing.
           HELD INSTEAD, the same idea pointed at the piece itself (run 39158132507): STRUCTURE, a THING (twin a
           prop, door or lamp) must lose more to its own 8 px scramble than every piece of its twin's pack and
           every YES item named against that pack; past that line it is squares, not a thing, and LOOK is FAR
  SSIM     structural similarity to the twin, printed on every card, never a pass condition: the research's
           hack detector (a learned score that climbs while SSIM falls is a hacked score)

THE LINES COME FROM THE PACKS MEASURING THEMSELVES (--calibrate): per family, every distance between two
pack pieces of that family and between each piece and the family centroid; the 90th percentile of each is
the family's line. Nobody picks a threshold. records/target/BOHEMIA_TWIN_CALIBRATION.json.

THE VERDICT. Each distance ruler reads its distance to the twin and to the family centroid over the line:
inside on either is IN, inside twice the line on either is OUT, past twice on both is FAR. PAINTER reads each
of the five on its own pack spread (the 90th percentile of pack-against-pack |log ratio|): FAR past twice
that or past the research's 0.33 to 3.0 line, whichever is wider, against the twin AND the family median
(the 10/10 gaps were 2.9x, 500x and 160x; the dark-line share differs by more than 3x between two of his
own road tiles, so a fixed line there would fail the packs). GREEN: every ruler IN. AMBER: any OUT, or the shape outside the
family's spread (ships, logged as debt). RED: any FAR, or a wrong or fractional grid.

  python3 tools/bohemia_twin_gate.py --calibrate
  python3 tools/bohemia_twin_gate.py <ours.png> <twin: a png or pack:N. Name#i> [--card out.png]
"""
import glob, json, math, os, re, sys
import numpy as np
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BANK = os.path.join(ROOT, 'reference', 'art_bank')
CAL = os.environ.get('BOHEMIA_TWIN_CAL') or os.path.join(ROOT, 'records', 'target', 'BOHEMIA_TWIN_CALIBRATION.json')
ONNX = os.environ.get('BOHEMIA_DINOV2_ONNX') or os.path.join(ROOT, 'tools', 'models', 'dinov2_vits14.onnx')
REGISTRY = os.path.join(ROOT, 'records', 'target', 'BOHEMIA_VOTE_REGISTRY.json')
FAMILIES = ('door', 'ground', 'lamp', 'marking', 'prop', 'road', 'settlement')
SCRAMBLE_SEEDS = (1, 2, 3)
SCRAMBLE_BLOCK = 8
SCRAMBLE_HELD = ()   # measured 10/18 run 39156939522: held at his YES margin it passed the shuffled car and failed his own ground tiles
STRUCTURE_SCALES = (1, 6, 8, 16)
# THE HELD FORM (run 39158132507): a THING (its twin a prop, a door or a lamp) must lose more to its own 8 px scramble
# than every piece of its twin's pack and every YES item named against that pack do; his cars at most 0.530 and his
# YES robot and trucks at most 0.519 against his car shuffled in squares 0.739 (16 px) to 0.911 (6 px)
STRUCTURE_HELD = 8
THINGS = ('prop', 'door', 'lamp')
PAINTER_EPS = {'col_kpx': 1.0, 'value_range': 2.0, 'dark_line': 0.005, 'detail': 0.5, 'sat': 0.02}
RATIO_LINE = (0.33, 3.0)


# ---- the twin -----------------------------------------------------------------------------------------
def slug(s):
    return re.sub(r'[^a-z0-9]+', '_', s.lower()).strip('_')


def resolve(src):
    """a registry twin src to a file on disk: 'pack:15. Street props#0' is pack_15_street_props_000.png in
    whichever bank family holds it; a path is a path from the repo root (or from slices/ when it starts ../)."""
    if not src:
        return None
    if src.startswith('pack:'):
        m = re.match(r'pack:\s*(\d+)\.\s*(.+?)#(\d+)$', src)
        if not m:
            return None
        name = 'pack_%s_%s_%03d.png' % (m.group(1), slug(m.group(2)), int(m.group(3)))
        hits = glob.glob(os.path.join(BANK, '*', name))
        return hits[0] if hits else None
    for p in (os.path.join(ROOT, src), os.path.normpath(os.path.join(ROOT, 'slices', src))):
        if os.path.isfile(p):
            return p
    return None


def family_of(path):
    d = os.path.basename(os.path.dirname(path)) if path else ''
    return d if d in FAMILIES else 'all'


def pack_pieces(fam):
    fams = FAMILIES if fam == 'all' else (fam,)
    return sorted(f for x in fams for f in glob.glob(os.path.join(BANK, x, 'pack_*.png')))


# ---- the measurements -----------------------------------------------------------------------------------
def rgba(im):
    im = im if isinstance(im, Image.Image) else Image.open(im)
    return np.asarray(im.convert('RGBA')).astype(np.float64)


def to_lab(rgb):
    c = rgb / 255.0
    c = np.where(c > 0.04045, ((c + 0.055) / 1.055) ** 2.4, c / 12.92)
    xyz = c @ np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]]).T
    xyz /= np.array([0.95047, 1.0, 1.08883])
    f = np.where(xyz > 0.008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116.0)
    return np.stack([116 * f[:, 1] - 16, 500 * (f[:, 0] - f[:, 1]), 200 * (f[:, 1] - f[:, 2])], 1)


_DIRS = None


def dirs():
    global _DIRS
    if _DIRS is None:
        v = np.random.default_rng(82).normal(size=(48, 3))
        _DIRS = v / np.linalg.norm(v, axis=1, keepdims=True)
    return _DIRS


def lab_quantiles(a, n=4000):
    """the colour distribution as 64 quantiles along each of the 48 directions (what the sliced EMD reads)."""
    op = a[..., 3] >= 128
    px = a[..., :3][op]
    if len(px) < 20:
        return None
    if len(px) > n:
        px = px[np.random.default_rng(1).choice(len(px), n, replace=False)]
    proj = to_lab(px) @ dirs().T
    return np.percentile(proj, np.linspace(0.5, 99.5, 64), axis=0)


def emd(q1, q2):
    return float(np.abs(q1 - q2).mean())


def lbp_hist(a):
    L = a[..., :3] @ [0.299, 0.587, 0.114]
    op = a[..., 3] >= 128
    h, w = L.shape
    if h < 3 or w < 3:
        return None
    c = L[1:-1, 1:-1]
    nb = [L[0:-2, 0:-2], L[0:-2, 1:-1], L[0:-2, 2:], L[1:-1, 2:], L[2:, 2:], L[2:, 1:-1], L[2:, 0:-2], L[1:-1, 0:-2]]
    bits = np.stack([(n >= c + 2) for n in nb], 0).astype(np.int8)   # 2 levels of slack: flat is flat, not noise
    ones = bits.sum(0)
    trans = np.abs(np.diff(np.concatenate([bits, bits[:1]], 0), axis=0)).sum(0)
    code = np.where(trans <= 2, ones, 9)
    m = op[1:-1, 1:-1]
    for d in ((0, 0), (0, 2), (2, 0), (2, 2), (0, 1), (1, 0), (2, 1), (1, 2)):
        m = m & op[d[0]:d[0] + h - 2, d[1]:d[1] + w - 2]
    if m.sum() < 20:
        return None
    hist = np.bincount(code[m], minlength=10).astype(np.float64)
    return hist / hist.sum()


def chi2(h1, h2):
    s = h1 + h2
    return float(0.5 * (((h1 - h2) ** 2) / np.where(s > 0, s, 1)).sum())


def painter(a):
    """DIRECTION's five numbers (tools/bohemia_direction_twin_sheets.py stats(), the same formulas)."""
    op = a[..., 3] > 8
    rgb = a[..., :3]
    if op.sum() < 20:
        return None
    L = rgb @ [0.299, 0.587, 0.114]
    mx = rgb.max(-1); mn = rgb.min(-1); sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1), 0)
    gx = np.zeros_like(L); gx[:, 1:] = np.abs(np.diff(L, axis=1)); gy = np.zeros_like(L); gy[1:, :] = np.abs(np.diff(L, axis=0))
    edge = np.maximum(gx, gy)
    cols = len(np.unique(rgb[op].astype(int), axis=0))
    return dict(col_kpx=cols / max(op.sum() / 1000.0, 1e-6),
                value_range=float(np.percentile(L[op], 95) - np.percentile(L[op], 5)),
                dark_line=float(((L < 45) & (edge > 30) & op).sum() / max(op.sum(), 1)),
                detail=float(edge[op].mean()), sat=float(sat[op].mean()))


def ratios(p, q):
    return {k: (p[k] + PAINTER_EPS[k]) / (q[k] + PAINTER_EPS[k]) for k in PAINTER_EPS}


def ink8(a):
    op = a[..., 3] >= 128
    ys, xs = np.nonzero(op)
    if not len(ys):
        return None
    m = op[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    return float((np.asarray(Image.fromarray((m * 255).astype(np.uint8)).resize((8, 8), Image.BOX)) >= 128).mean())


def grid(a):
    """the block size and whether the grid is fractional. Columns (rows) equal to their neighbour make runs;
    an honest 1x picture almost never repeats a column, an integer k upscale repeats in runs of exactly k, a
    fractional upscale mixes runs of two lengths."""
    out = {}
    for ax in (0, 1):
        x = np.moveaxis(a, ax, 0)            # lines along this axis
        same = np.all(x[1:] == x[:-1], axis=tuple(range(1, x.ndim)))
        if same.mean() < 0.1:
            out[ax] = (1, False); continue
        runs, r = [], 1
        for s in same:
            if s:
                r += 1
            else:
                runs.append(r); r = 1
        runs.append(r)
        runs = np.array(runs[1:-1] or runs)
        vals, cnt = np.unique(runs, return_counts=True)
        order = np.argsort(-cnt)
        k = int(vals[order[0]])
        frac = len(order) > 1 and cnt[order[1]] >= 0.25 * len(runs) and abs(int(vals[order[1]]) - k) == 1
        out[ax] = (k, bool(frac))
    k = max(out[0][0], out[1][0])
    return {'block': k, 'fractional': out[0][1] or out[1][1]}


def ssim(a, b):
    """mean SSIM on luminance with a 7x7 box window (Wang et al. 2004, the standard constants)."""
    x = a[..., :3] @ [0.299, 0.587, 0.114]; y = b[..., :3] @ [0.299, 0.587, 0.114]
    if x.shape != y.shape or min(x.shape) < 7:
        return None

    def box(z):
        c = np.cumsum(np.cumsum(np.pad(z, ((1, 0), (1, 0))), 0), 1)
        return (c[7:, 7:] - c[:-7, 7:] - c[7:, :-7] + c[:-7, :-7]) / 49.0
    C1, C2 = (0.01 * 255) ** 2, (0.03 * 255) ** 2
    mx, my = box(x), box(y)
    vx, vy, cxy = box(x * x) - mx * mx, box(y * y) - my * my, box(x * y) - mx * my
    s = ((2 * mx * my + C1) * (2 * cxy + C2)) / ((mx * mx + my * my + C1) * (vx + vy + C2))
    return float(s.mean())


_SESS = None


def look_input(a):
    """the picture as DINOv2 reads it: on a mid grey, centred on a square (a sprite is never squashed), resized
    to 224 bicubic, ImageNet mean and std; 1x3x224x224 float32. The export verifies through this same function."""
    im = Image.fromarray(a.astype(np.uint8), 'RGBA')
    s = max(im.size)
    bg = Image.new('RGBA', (s, s), (128, 128, 128, 255)); bg.alpha_composite(im, ((s - im.width) // 2, (s - im.height) // 2))
    x = np.asarray(bg.convert('RGB').resize((224, 224), Image.BICUBIC)).astype(np.float32) / 255.0
    return ((x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]).astype(np.float32).transpose(2, 0, 1)[None]


def look_embed(a):
    """DINOv2 ViT-S/14 CLS embedding through onnxruntime, unit length, or None when the weights are not on this box."""
    global _SESS
    if not os.path.isfile(ONNX):
        return None
    try:
        import onnxruntime as ort
    except ImportError:
        return None
    if _SESS is None:
        _SESS = ort.InferenceSession(ONNX, providers=['CPUExecutionProvider'])
    out = _SESS.run(None, {_SESS.get_inputs()[0].name: look_input(a)})[0]
    v = out.reshape(out.shape[0], -1, out.shape[-1])[0, 0] if out.ndim == 3 else out.reshape(-1)
    return (v / (np.linalg.norm(v) + 1e-9)).astype(np.float64)


def look_on():
    return look_embed(np.zeros((8, 8, 4))) is not None


def unit(v):
    v = np.asarray(v, np.float64)
    return v / (np.linalg.norm(v) + 1e-9)


def features(a):
    return {'lab': lab_quantiles(a), 'lbp': lbp_hist(a), 'painter': painter(a), 'ink8': ink8(a)}


# ---- the scramble: the same colours with the structure gone ------------------------------------------------
def scramble(a, seed, block=1):
    """the picture with its pixels moved and none changed. block 1: every pixel (its alpha with it) to a random
    place in the same box, so the colours and their counts are his and nothing is where it was, the silhouette
    included. block k: the box cut into k x k squares and the squares shuffled (a strip that does not fill a
    square stays put), the 10/18 attack's own shape."""
    rng = np.random.default_rng(seed)
    if block <= 1:
        flat = a.reshape(-1, a.shape[-1])
        return flat[rng.permutation(len(flat))].reshape(a.shape)
    h, w = a.shape[0] // block * block, a.shape[1] // block * block
    out = a.copy()
    if h and w:
        sq = a[:h, :w].reshape(h // block, block, w // block, block, -1).swapaxes(1, 2).reshape(-1, block, block, a.shape[-1])
        perm = rng.permutation(len(sq))
        if len(sq) > 1 and (perm == np.arange(len(sq))).all():
            perm = np.roll(perm, 1)   # a shuffle that put every square back is no scramble (a 2 x 2 box can draw it)
        sq = sq[perm]
        out[:h, :w] = sq.reshape(h // block, w // block, block, block, -1).swapaxes(1, 2).reshape(h, w, -1)
    return out


def look_scramble(cells, et):
    """each cell's LOOK cosine to the twin embedding, the best of its three pixel scrambles' and the best of its
    three block scrambles'; the medians over the cells. The best of three: the piece must beat whatever its own
    colours could do with the structure thrown away."""
    ct, cp, cb = [], [], []
    for c in cells:
        ct.append(float(look_embed(c) @ et))
        cp.append(max(float(look_embed(scramble(c, s)) @ et) for s in SCRAMBLE_SEEDS))
        cb.append(max(float(look_embed(scramble(c, s, SCRAMBLE_BLOCK)) @ et) for s in SCRAMBLE_SEEDS))
    med = lambda v: float(np.median(v))
    return {'cos': round(med(ct), 4), 'pixel': round(med(cp), 4), 'block': round(med(cb), 4),
            'gap_pixel': round(med(ct) - med(cp), 4), 'gap_block': round(med(ct) - med(cb), 4)}


def look_structure(cells, scales=None):
    """each cell against ITSELF scrambled: the LOOK cosine between the picture and the most alike of three scrambles of
    itself at each scale (1: every pixel moved; k: k x k squares shuffled); medians over the cells. A picture that
    reads like its own scramble has no arrangement to lose: it is a texture, or it is squares already shuffled."""
    out = {}
    for k in scales or STRUCTURE_SCALES:
        v = []
        for c in cells:
            e = look_embed(c)
            v.append(max(float(look_embed(scramble(c, s, k)) @ e) for s in SCRAMBLE_SEEDS))
        out['self_%d' % k] = round(float(np.median(v)), 4)
    return out


def structure_lines(scramble_cal, log=print, least=8):
    """THE STRUCTURE LINE PER PACK, for the things (prop, door, lamp): the highest reading of any piece of the pack
    against its own 8 px scramble, raised to any YES item whose twin is in that pack (his word is the ruler); a pack
    with fewer than eight pieces in the bank has no line and holds nothing."""
    k = STRUCTURE_HELD
    by = {}
    for fam in THINGS:
        for f in pack_pieces(fam):
            by.setdefault(pack_of(f), []).append(f)
    yes = {}
    for x in (scramble_cal or {}).get('yes', []):
        tw = os.path.join(ROOT, x['twin']) if x.get('twin') else None
        yes.setdefault(pack_of(tw), {}).setdefault(x['id'], []).append(x['self_%d' % k])
    out = {}
    for pk, fs in sorted((p, v) for p, v in by.items() if p):
        if len(fs) < least:
            continue
        r = [(look_structure(measured_cells(f, rgba(f)) or [rgba(f)], (k,))['self_%d' % k], os.path.basename(f)) for f in fs]
        top = max(r)
        line = {'line': top[0], 'set_by': top[1], 'pieces': len(fs), 'median': round(float(np.median([v for v, _ in r])), 4)}
        for iid, vals in yes.get(pk, {}).items():
            m = round(float(np.median(vals)), 4)
            if m > line['line']:
                line.update(line=m, set_by='YES ' + iid)
        out[pk] = line
    log('  STRUCTURE lines (each thing against its own %d px scramble; the highest in his pack or his YES): %d packs; %s' % (
        k, len(out), ', '.join('%s %.3f' % (p[5:], v['line']) for p, v in sorted(out.items(), key=lambda kv: -kv[1]['line'])[:6])))
    return {'scale': k, 'families': list(THINGS), 'packs': out}


def measured_cells(path, twin_arr):
    return [c for c in at_twin_size(rgba(path), twin_arr)
            if lab_quantiles(c) is not None and lbp_hist(c) is not None and painter(c) is not None]


def verdicts(reg):
    """each item's newest verdict (the registry's list is appended in order)."""
    last = {}
    for v in reg.get('verdicts', []):
        last[v.get('id')] = v.get('vote')
    return last


def yes_pieces(reg=None):
    """the pieces he said YES to that the look leg can read: an art item whose newest verdict is 'up', whose twin
    is a pack piece the bank holds, sprite by sprite as its row lists them; plus the two maquettes the twin gate
    has held as his YES since it shipped (the robot and the truck, his 10/17 'I fell in love', against his car)."""
    reg = reg if reg is not None else json.load(open(REGISTRY))
    last = verdicts(reg)
    out = []
    for it in reg['items']:
        tw = it.get('twin') if isinstance(it.get('twin'), dict) else {}
        if last.get(it['id']) != 'up' or not tw.get('src') or not it.get('sprites'):
            continue
        twin = resolve(tw['src'])
        if not twin or not os.path.abspath(twin).startswith(BANK + os.sep) or not pack_of(twin):
            continue
        for sp in it['sprites']:
            p = os.path.join(ROOT, sp)
            if os.path.isfile(p):
                out.append({'id': it['id'], 'sprite': sp, 'twin': os.path.relpath(twin, ROOT), 'family': family_of(twin),
                            'cls': it.get('class')})
    car = resolve('pack:10. Abandoned cars#0')
    for m in ('robot', 'truck'):
        sp = os.path.join('records', 'target', 'master_rig', m, 'rig_S.png')
        if car and os.path.isfile(os.path.join(ROOT, sp)):
            out.append({'id': 'the maquette %s (T2)' % m, 'sprite': sp, 'twin': os.path.relpath(car, ROOT), 'family': 'prop',
                        'cls': 'vehicle' if m == 'truck' else 'person'})
    return out


def scramble_lines(log=print):
    """THE MARGIN, from his YES: every YES piece's gap to its own scramble at its twin's size (the same cells and
    the same reading the score makes), the weakest per family and over all. Nobody picks it."""
    rows = []
    for y in yes_pieces():
        tw = rgba(os.path.join(ROOT, y['twin']))
        cells = measured_cells(os.path.join(ROOT, y['sprite']), tw)
        if not cells:
            continue
        rows.append(dict(y, **look_scramble(cells, look_embed(tw)), **look_structure(cells)))
    # he voted on the ITEM, not on each sprite in it: an item's gap is the median of its sprites' (the 10/18 rig
    # round five card names one car as the twin of a robot, a truck and a drum; his YES was the card, not 'a drum
    # is a car'), and the margin is the weakest YES item's, per family of its twin and over all
    items = {}
    for r in rows:
        items.setdefault(r['id'], []).append(r)
    per = [{'id': i, 'family': rs[0]['family'], 'sprites': len(rs),
            'gap_pixel': round(float(np.median([r['gap_pixel'] for r in rs])), 4),
            'gap_block': round(float(np.median([r['gap_block'] for r in rs])), 4),
            **{'self_%d' % k: round(float(np.median([r['self_%d' % k] for r in rs])), 4) for k in STRUCTURE_SCALES}}
           for i, rs in items.items()]
    margin = {'pixel': {}, 'block': {}}
    for k in margin:
        for fam in sorted({x['family'] for x in per}) + ['all']:
            g = [x['gap_' + k] for x in per if fam == 'all' or x['family'] == fam]
            if g:
                margin[k][fam] = round(min(g), 4)
    log('  THE SCRAMBLE (the margin from his YES): %d sprites in %d YES items; the weakest item per family, pixel %s, block %s'
        % (len(rows), len(per), margin['pixel'], margin['block']))
    for x in sorted(per, key=lambda x: x['gap_pixel']):
        log('     item %-44s %-10s %2d sprites  gap pixel %+.3f  block %+.3f  itself scrambled at 1/6/8/16 px %s' % (
            x['id'][:44], x['family'], x['sprites'], x['gap_pixel'], x['gap_block'],
            '/'.join('%.3f' % x['self_%d' % k] for k in STRUCTURE_SCALES)))
    for r in sorted(rows, key=lambda r: r['gap_pixel']):
        log('     %-46s %-58s cos %.3f  pixel %.3f (gap %+.3f)  block %.3f (gap %+.3f)' % (
            r['id'][:46], r['sprite'][-58:], r['cos'], r['pixel'], r['gap_pixel'], r['block'], r['gap_block']))
    return {'seeds': list(SCRAMBLE_SEEDS), 'block': SCRAMBLE_BLOCK, 'held': list(SCRAMBLE_HELD), 'margin': margin,
            'items': sorted(per, key=lambda x: x['gap_pixel']),
            'yes': [{k: r[k] for k in ('id', 'sprite', 'twin', 'family', 'cos', 'pixel', 'block', 'gap_pixel', 'gap_block')
                     + tuple('self_%d' % s for s in STRUCTURE_SCALES)} for r in rows]}


# ---- at the twin's pixel size ---------------------------------------------------------------------------
def at_twin_size(ours, twin):
    """ours brought to the twin's box, nearest neighbour, never the twin to ours. An opaque sheet bigger
    than the twin is cut into twin-sized cells (a sheet of sixteen tiles is sixteen tiles); a sprite is fit
    inside the twin's box keeping its aspect."""
    th, tw = twin.shape[:2]
    oh, ow = ours.shape[:2]
    opaque = (ours[..., 3] >= 128).mean() >= 0.9
    if opaque and oh >= 1.5 * th and ow >= 1.5 * tw:
        cells = [ours[y:y + th, x:x + tw] for y in range(0, oh - th + 1, th) for x in range(0, ow - tw + 1, tw)]
        if len(cells) > 16:
            idx = np.linspace(0, len(cells) - 1, 16).round().astype(int)
            cells = [cells[i] for i in idx]
        return cells
    s = min(tw / ow, th / oh)
    im = Image.fromarray(ours.astype(np.uint8), 'RGBA').resize((max(1, round(ow * s)), max(1, round(oh * s))), Image.NEAREST)
    return [np.asarray(im).astype(np.float64)]


# ---- calibration: the packs against themselves -----------------------------------------------------------
def calibrate(families=None, per_family=160, pairs=600, log=print):
    rng = np.random.default_rng(108)
    look = look_on()
    seen = {}
    out = {'_readme': 'the twin gate\'s lines (tools/bohemia_twin_gate.py --calibrate): per family, the 90th '
                      'percentile of every ruler between two pack pieces (pair) and between a piece and the '
                      'family centroid (centroid); the 5th and 95th percentile of the 8x8 ink; the family\'s '
                      'median painter numbers and block size; on a box with the DINOv2 weights, LOOK\'s 10th '
                      'percentile cosine on the same pieces and pairs. The packs measuring themselves; nobody '
                      'picked a number.', 'made': '10/18', 'families': {}}
    for fam in list(families or FAMILIES) + ['all']:
        fs = pack_pieces(fam)
        if len(fs) < 4:
            continue
        pick = [fs[i] for i in sorted(rng.choice(len(fs), min(per_family, len(fs)), replace=False))]
        F = []
        for f in pick:
            a = rgba(f)
            x = features(a); x['block'] = grid(a)['block']
            if x['lab'] is not None and x['lbp'] is not None and x['painter'] is not None:
                if look:
                    if f not in seen:
                        seen[f] = look_embed(a)
                    x['look'] = seen[f]
                F.append(x)
        cen_lab = np.mean([x['lab'] for x in F], 0)
        cen_lbp = np.mean([x['lbp'] for x in F], 0)
        med_p = {k: float(np.median([x['painter'][k] for x in F])) for k in PAINTER_EPS}
        pe, pl, plr, pls, pk = [], [], [], {k: [] for k in PAINTER_EPS}, []
        for _ in range(pairs):
            i, j = rng.choice(len(F), 2, replace=False)
            pe.append(emd(F[i]['lab'], F[j]['lab'])); pl.append(chi2(F[i]['lbp'], F[j]['lbp']))
            if look:
                pk.append(float(F[i]['look'] @ F[j]['look']))
            rr = ratios(F[i]['painter'], F[j]['painter'])
            plr.append(max(abs(math.log(r)) for r in rr.values()))
            for k, r in rr.items():
                pls[k].append(abs(math.log(r)))
        ce = [emd(x['lab'], cen_lab) for x in F]; cl = [chi2(x['lbp'], cen_lbp) for x in F]
        ink = [x['ink8'] for x in F if x['ink8'] is not None]
        p90 = lambda v: round(float(np.percentile(v, 90)), 4)
        out['families'][fam] = {
            'pieces': len(fs), 'measured': len(F),
            'colour': {'pair': p90(pe), 'centroid': p90(ce)},
            'pattern': {'pair': p90(pl), 'centroid': p90(cl)},
            'painter': {'pair_log_ratio': p90(plr), 'per_number': {k: p90(v) for k, v in pls.items()},
                        'median': {k: round(v, 4) for k, v in med_p.items()}},
            'ink8': [round(float(np.percentile(ink, 5)), 4), round(float(np.percentile(ink, 95)), 4)],
            'block': int(np.median([x['block'] for x in F])),
            'centroid': {'lab': np.round(cen_lab, 3).tolist(), 'lbp': np.round(cen_lbp, 5).tolist()}}
        if look:
            cen_look = unit(np.mean([x['look'] for x in F], 0))
            ck = [float(x['look'] @ cen_look) for x in F]
            p10 = lambda v: round(float(np.percentile(v, 10)), 4)
            p1 = lambda v: round(float(np.percentile(v, 1)), 4)
            out['families'][fam]['look'] = {'pair': p10(pk), 'centroid': p10(ck), 'pair_far': p1(pk), 'centroid_far': p1(ck),
                                            'pair_median': round(float(np.median(pk)), 4),
                                            'centroid_median': round(float(np.median(ck)), 4),
                                            'centroid_emb': np.round(cen_look, 5).tolist()}
        log('  calibrated %-11s %4d pieces (%d measured)%s' % (fam, len(fs), len(F), (
            '  LOOK 10th pct cos pair %.4f centroid %.4f' % (out['families'][fam]['look']['pair'],
                                                            out['families'][fam]['look']['centroid'])) if look else ''))
    out['pack_files'] = len(pack_pieces('all'))
    if look:
        out['look'] = {'onnx': os.path.basename(ONNX), 'measured': True, 'embedded': len(seen),
                       'packs': look_pack_lines(seen, rng, log), 'scramble': scramble_lines(log)}
        out['look']['structure'] = structure_lines(out['look']['scramble'], log)
    return out


def pack_of(path):
    m = re.match(r'^(pack_\d+_.+)_\d{3}\.png$', os.path.basename(path or ''))
    return m.group(1) if m else None


def look_pack_lines(seen, rng, log=print, least=8, pairs=400):
    """PRINTED, NOT HELD (10/18, run 39153198933): each pack he bought measuring itself, the 10th and 1st
    percentile cosine between two pieces of the same pack, for every pack with at least eight pieces in the
    bank. At the family's line a shuffled car read IN against his props (cos 0.423, line 0.137); this is the
    tighter line the coordinator can rule on, measured, before anyone holds a cook to it."""
    by = {}
    for fam in FAMILIES:
        for f in pack_pieces(fam):
            by.setdefault(pack_of(f), []).append(f)
    out = {}
    for k, fs in sorted((k, v) for k, v in by.items() if k):
        if len(fs) < least:
            continue
        E = []
        for f in fs:
            if f not in seen:
                seen[f] = look_embed(rgba(f))
            E.append(seen[f])
        cs = [float(E[i] @ E[j]) for i, j in (rng.choice(len(E), 2, replace=False) for _ in range(pairs))]
        out[k] = {'pieces': len(fs), 'p10': round(float(np.percentile(cs, 10)), 4), 'p1': round(float(np.percentile(cs, 1)), 4),
                  'median': round(float(np.median(cs)), 4)}
    log('  LOOK per pack (printed, not held): %d packs with %d+ pieces' % (len(out), least))
    return out


def load_cal():
    return json.load(open(CAL)) if os.path.isfile(CAL) else None


# ---- the score -----------------------------------------------------------------------------------------
def level(dt, dc, line):
    r = min(dt / max(line['pair'], 1e-9), dc / max(line['centroid'], 1e-9))
    return (0 if r <= 1 else 1 if r <= 2 else 2), round(r, 2)


RENDERED = {'person', 'beast', 'vehicle', 'prop', 'character', 'enemy', 'boss'}


def guide_says_no_lines():
    """DIRECTION's style guide field 8 (records/target/BOHEMIA_STYLE_GUIDE.json): a rendered thing carries no
    drawn outline and no drawn interior lines, so its dark-line share against a pack piece is a decision,
    not a gap."""
    try:
        g = json.load(open(os.path.join(ROOT, 'records', 'target', 'BOHEMIA_STYLE_GUIDE.json')))
        f8 = [f for f in g['fields'] if f.get('key') == 'outline'][0]['value']
        return 'no drawn outline' in f8.get('rendered_things', '') and f8.get('interior_lines', '').startswith('none')
    except (OSError, ValueError, KeyError, IndexError, AttributeError):
        return False


def score(ours_path, twin_path, fam=None, cal=None, cls=None):
    cal = cal or load_cal()
    fam = fam or family_of(twin_path)
    C = cal['families'].get(fam) or cal['families']['all']
    O = rgba(ours_path); Tw = rgba(twin_path)
    g = grid(O)
    cells = at_twin_size(O, Tw)
    tf = features(Tw)
    cen_lab = np.array(C['centroid']['lab']); cen_lbp = np.array(C['centroid']['lbp'])
    dte, dce, dtl, dcl, pr_t, pr_f, inks, ss, mc = [], [], [], [], [], [], [], [], []
    for c in cells:
        f = features(c)
        if f['lab'] is None or f['lbp'] is None or f['painter'] is None:
            continue
        mc.append(c)
        dte.append(emd(f['lab'], tf['lab'])); dce.append(emd(f['lab'], cen_lab))
        dtl.append(chi2(f['lbp'], tf['lbp'])); dcl.append(chi2(f['lbp'], cen_lbp))
        pr_t.append(ratios(f['painter'], tf['painter'])); pr_f.append(ratios(f['painter'], C['painter']['median']))
        if f['ink8'] is not None:
            inks.append(f['ink8'])
        s = ssim(c, Tw) if c.shape == Tw.shape else None
        if s is not None:
            ss.append(s)
    rep = {'family': fam, 'cells': len(cells), 'grid': g, 'rulers': {}, 'why': []}
    if not dte:
        rep.update(verdict='UNMEASURED', why=['too few opaque pixels to measure'])
        return rep
    med = lambda v: float(np.median(v))
    lc, rc = level(med(dte), med(dce), C['colour'])
    lp, rp = level(med(dtl), med(dcl), C['pattern'])
    rep['rulers']['colour'] = {'twin': round(med(dte), 2), 'family': round(med(dce), 2), 'over_line': rc, 'level': lc}
    rep['rulers']['pattern'] = {'twin': round(med(dtl), 4), 'family': round(med(dcl), 4), 'over_line': rp, 'level': lp}
    rt = {k: med([r[k] for r in pr_t]) for k in PAINTER_EPS}
    rf = {k: med([r[k] for r in pr_f]) for k in PAINTER_EPS}
    # per number, the packs' own spread: IN inside the 90th percentile of pack-against-pack |log ratio|, FAR past
    # twice that or past the research's 0.33 to 3.0, whichever is wider, against the twin AND the family (the
    # dark-line share is sparse: his own road tiles differ from each other by more than 3x on it, measured)
    far, out = [], []
    skip = {'dark_line'} if cls in RENDERED and guide_says_no_lines() else set()
    for k in PAINTER_EPS:
        if k in skip:
            continue
        line = C['painter']['per_number'][k]
        d = min(abs(math.log(rt[k])), abs(math.log(rf[k])))
        if d > max(math.log(RATIO_LINE[1]), 2 * line):
            far.append(k)
        elif d > line:
            out.append(k)
    lpn = 2 if far else (1 if out else 0)
    rep['rulers']['painter'] = {'twin': {k: round(v, 2) for k, v in rt.items()},
                                'family': {k: round(v, 2) for k, v in rf.items()}, 'far': far, 'out': out, 'level': lpn,
                                'not_held': ['dark_line: the style guide\'s field 8, a rendered thing draws no lines'] if skip else []}
    ink = med(inks) if inks else None
    band = [min(C['ink8'][0], tf['ink8'] or 1), max(C['ink8'][1], tf['ink8'] or 0)]   # his twin's own shape is legal
    shape_ok = ink is None or band[0] - 1e-9 <= ink <= band[1] + 1e-9
    rep['rulers']['shape'] = {'ink8': None if ink is None else round(ink, 3), 'family': band, 'ok': shape_ok}
    grid_ok = g['block'] == C['block'] and not g['fractional']
    rep['rulers']['grid'] = {'block': g['block'], 'family': C['block'], 'fractional': g['fractional'], 'ok': grid_ok}
    rep['ssim'] = round(med(ss), 3) if ss else None
    et, L = look_embed(Tw), C.get('look')
    if et is None:
        rep['look'] = 'UNMEASURED: no DINOv2 weights on this box (%s); the runner measures it (.github/workflows/look.yml)' \
            % os.path.relpath(ONNX, ROOT)
    elif not L:
        rep['look'] = 'UNCALIBRATED: the weights are here and the lines carry no LOOK; run --calibrate on this box'
    else:
        # each cell at his size against his twin and the family's mean look. IN at or over the packs' 10th
        # percentile cosine, FAR under their 1st (worse than 99 in 100 of his own pairs), on the twin or the
        # family, whichever is nearer; a cosine cannot double the way a distance does, so FAR is the packs'
        # own tail, not twice the line (measured 10/18: twice the line needs a cosine under about -0.9)
        cen = unit(L['centroid_emb']); kt, kc = [], []
        for c in mc:
            e = look_embed(c)
            kt.append(float(e @ et)); kc.append(float(e @ cen))
        ct, cc = med(kt), med(kc)
        lv = lambda cos, line, far: 0 if cos >= line else (1 if cos >= far else 2)
        lk = min(lv(ct, L['pair'], L['pair_far']), lv(cc, L['centroid'], L['centroid_far']))
        rk = round(min((1 - ct) / max(1 - L['pair'], 1e-9), (1 - cc) / max(1 - L['centroid'], 1e-9)), 2)
        rep['rulers']['look'] = {'twin': round(ct, 4), 'family': round(cc, 4), 'over_line': rk, 'level': lk,
                                 'line': {k: L[k] for k in ('pair', 'centroid', 'pair_far', 'centroid_far')}}
        # THE SCRAMBLE: nearer his twin than its own colours with the structure thrown away, by his YES's margin
        S = (cal.get('look') or {}).get('scramble')
        if S:
            sc = look_scramble(mc, et)
            for k in ('pixel', 'block'):
                m = S['margin'][k].get(fam, S['margin'][k].get('all'))
                sc['margin_' + k] = m
                sc['ok_' + k] = m is None or sc['gap_' + k] >= m
            sc['held'] = list(S.get('held') or SCRAMBLE_HELD)
            rep['rulers']['look']['scramble'] = sc
            if not all(sc['ok_' + k] for k in sc['held']):
                rep['rulers']['look']['line_level'] = lk
                rep['rulers']['look']['level'] = 2
        # THE STRUCTURE: a thing that reads like its own 8 px scramble more than anything in his twin's pack does
        SL = ((cal.get('look') or {}).get('structure') or {}).get('packs', {}).get(pack_of(twin_path))
        if SL and fam in THINGS:
            k = STRUCTURE_HELD
            me = look_structure(mc, (k,))['self_%d' % k]
            st = {'self_%d' % k: me, 'line': SL['line'], 'set_by': SL['set_by'], 'ok': me <= SL['line'] + 1e-9}
            rep['rulers']['look']['structure'] = st
            if not st['ok']:
                rep['rulers']['look'].setdefault('line_level', rep['rulers']['look']['level'])
                rep['rulers']['look']['level'] = 2
        rep['look'] = round(med(kt), 4)
    names = {'colour': 'COLOUR (Lab EMD)', 'pattern': 'PATTERN (LBP)', 'painter': 'PAINTER (DIRECTION\'s five)',
             'look': 'LOOK (DINOv2 cosine)'}
    held = [k for k in ('colour', 'pattern', 'painter', 'look') if k in rep['rulers']]
    sc = (rep['rulers'].get('look') or {}).get('scramble')
    for k in held:
        lv = rep['rulers'][k]['level']
        if k == 'look' and 'line_level' in rep['rulers'][k]:
            if sc and not all(sc['ok_' + h] for h in sc['held']):
                rep['why'].append('LOOK SCRAMBLE: not nearer his twin than its own pixels scrambled by his YES margin (cos %.3f '
                                  'against %.3f scrambled, gap %+.3f; his YES pieces beat theirs by %+.3f or more)' % (
                                      sc['cos'], sc['pixel'], sc['gap_pixel'], sc['margin_pixel']))
            st = rep['rulers'][k].get('structure')
            if st and not st['ok']:
                rep['why'].append('LOOK STRUCTURE: it reads like its own %d px scramble (%.3f) more than anything in his twin\'s '
                                  'pack or his YES does (%.3f, %s): squares, not a thing' % (
                                      STRUCTURE_HELD, st['self_%d' % STRUCTURE_HELD], st['line'], st['set_by']))
            lv = rep['rulers'][k]['line_level']
        if lv == 2:
            rep['why'].append('%s FAR: %s' % (names[k], json.dumps({x: rep['rulers'][k][x] for x in rep['rulers'][k] if x != 'level'})))
        elif lv == 1:
            rep['why'].append('%s outside the packs\' own spread' % names[k])
    if not grid_ok:
        rep['why'].append('GRID: block %d against the family\'s %d%s' % (g['block'], C['block'], ', fractional' if g['fractional'] else ''))
    if not shape_ok:
        rep['why'].append('SHAPE: 8x8 ink %.2f outside the family\'s %.2f to %.2f' % (ink, band[0], band[1]))
    levels = [rep['rulers'][k]['level'] for k in held]
    rep['verdict'] = 'RED' if 2 in levels or not grid_ok else ('AMBER' if 1 in levels or not shape_ok else 'GREEN')
    return rep


# ---- the card: both crops at the same size ---------------------------------------------------------------
def card(ours_path, twin_path, rep, out):
    O = Image.open(ours_path).convert('RGBA'); Tw = Image.open(twin_path).convert('RGBA')
    cell = Image.fromarray(at_twin_size(rgba(O), rgba(Tw))[0].astype(np.uint8), 'RGBA')
    z = max(1, 192 // max(Tw.size))
    tw, oc = Tw.resize((Tw.width * z, Tw.height * z), Image.NEAREST), cell.resize((cell.width * z, cell.height * z), Image.NEAREST)
    W = tw.width + oc.width + 30; H = max(tw.height, oc.height) + 64
    im = Image.new('RGBA', (max(W, 360), H + 14 * len(rep.get('why', []))), (24, 22, 20, 255))
    im.alpha_composite(tw, (10, 30)); im.alpha_composite(oc, (20 + tw.width, 30))
    d = ImageDraw.Draw(im)
    d.text((10, 8), 'HIS TWIN', fill=(220, 210, 190, 255)); d.text((20 + tw.width, 8), 'OURS, AT HIS SIZE', fill=(220, 210, 190, 255))
    d.text((10, H - 26), 'TWIN GATE: %s  (%s)' % (rep['verdict'], rep['family']),
           fill={'RED': (230, 80, 70), 'AMBER': (230, 180, 60), 'GREEN': (120, 200, 110)}.get(rep['verdict'], (200, 200, 200)) + (255,))
    for i, w in enumerate(rep.get('why', [])):
        d.text((10, H - 8 + 14 * i), w[:110], fill=(200, 190, 175, 255))
    os.makedirs(os.path.dirname(out), exist_ok=True)
    im.save(out)
    return out


# ---- the critic loop: one pairwise question a pass, never a 1-to-10, cap three, keep best ----------------
QUESTIONS = ('Which of these two is a painted surface and which is flat fill?',
             'Do these two read as the same kit, yes or no, and what one thing differs?',
             'Which of the two has its light from one direction?',
             'Which of the two reads as worn by weather and use?')


def critic_loop(make, critic, twin_path, cap=3, cal=None):
    """make(feedback) -> a png path (feedback is None on the first pass, then the critic's one sentence);
    critic(ours, twin, question) -> one sentence. The numbers go first: a RED piece never meets the critic.
    Keeps the best by the rulers (lowest summed over-the-line), reverts when a retry scores worse. Returns
    (best path, its report, the log)."""
    cal = cal or load_cal()
    rank = lambda r: (2 if r['verdict'] == 'RED' else 1 if r['verdict'] == 'AMBER' else 0,
                      sum(r['rulers'][k]['over_line'] for k in ('colour', 'pattern')) if r.get('rulers') else 9)
    best = None; log = []; feedback = None
    for i in range(cap):
        p = make(feedback)
        r = score(p, twin_path, cal=cal)
        log.append({'pass': i + 1, 'path': p, 'verdict': r['verdict'], 'rank': rank(r)})
        if best is None or rank(r) < rank(best[1]):
            best = (p, r)
        else:
            log[-1]['reverted'] = True
        if r['verdict'] == 'RED':
            feedback = 'the numbers say: ' + '; '.join(r['why'][:2])
            continue
        q = QUESTIONS[i % len(QUESTIONS)]
        feedback = critic(p, twin_path, q)
        log[-1]['question'] = q; log[-1]['critic'] = feedback
    return best[0], best[1], log


def main(argv):
    if '--calibrate' in argv:
        c = calibrate()
        os.makedirs(os.path.dirname(CAL), exist_ok=True)
        json.dump(c, open(CAL, 'w'), indent=1)
        print('wrote', os.path.relpath(CAL, ROOT), c['pack_files'], 'pack pieces')
        return 0
    args = [a for a in argv if not a.startswith('--')]
    if len(args) < 2:
        print(__doc__); return 2
    twin = resolve(args[1]) or args[1]
    r = score(args[0], twin)
    print(json.dumps(r, indent=1))
    if '--card' in argv:
        print('card', card(args[0], twin, r, argv[argv.index('--card') + 1]))
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
