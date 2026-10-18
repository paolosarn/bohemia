#!/usr/bin/env python3
"""EYES AND EARS -- THE STAR IS THE BAR (lane 17, row [the star is the bar], claimed 10/18 eyes-opus-10-18d)

PAOLO 10/18, the fourteenth votes, on PORTRAIT's poacher face built as a 3D head on the body's own model: "You might
change the game with this one big star event... this is the first star I've handed out." Rule 115(h): the face from
the same model is the method for EVERY face. The row: the starred face is now the bar every face is held to, and a
bar nobody measures slips. Each face PORTRAIT ships after the star sits beside the starred poacher on one sheet at
the same size and light, with the numbers that made the star read off both, and a PASS or BACK per face.
CONSTRAINT: EYES measures, DIRECTION judges taste; never a filter. This tool only WRITES ITS READ
(records/target/EYES_THE_STAR_IS_THE_BAR.json and the sheet); it never edits a face, the manifest or the registry.

WHAT IT READS: the render files themselves (records/target/portrait/rig/<who>/rig_portrait_S.png and the seven
expression shots beside it), never a manifest's self-report. The manifest's head_px is printed beside the measured
numbers so a disagreement shows.

THE LANDMARKS, FROM THE FACE'S OWN PERFORMANCE (a hat or hair can not move them):
  THE JAW: the pixels the A shot (jaw open) changes. Its centroid is the jaw; its top is the lip line.
  THE EYES: the pixels the Surprised shot changes ABOVE the lip line are the lids; split left and right, their
            centroids are the eyes. (A pupil finder was tried first and took the hairline's notches for pupils on six
            of fifteen heads; the lids landed on the eyes on all fifteen, drawn on the sheet so anyone can check.)
  THE SCALE: the eyes' spacing in pixels (interpupillary distance, the ruler face measurement normalises by).

THE FIVE NUMBERS THAT MADE THE STAR, AND HOW EACH IS READ (a change under 12 of 255 luminance levels, about five
percent, is not counted as seen, the same floor every EYES diff has used since 9/5):
  1 HEAD SIZE      the eyes' spacing, and the eyes to the jaw. PASS within one eighth of the star's.
  2 LIGHT          the face's own shading, read as the brightness moment over the skin of the face (hat, hair and
                   the moving mouth and lids masked out), in screen degrees (0 right, 90 up, 180 left). The same read
                   gives 155.5 on the rig's calibration sphere against DIRECTION's 155.4. PASS within 30 degrees of
                   the star's (the style guide's own light tolerance).
  3 COLOURS        distinct colours in the face's eight shots, and per 1,000 painted pixels of the rest shot. PASS at
                   or over the portrait class's floor (800, the style guide) and at least 0.6 of the star's density.
  4 MOUTH SHAPES   rest, A, E, O and M compared in the mouth's box; two shapes are one shape when they differ by
                   fewer than 0.05 x the eye spacing squared pixels (58 at the star's size). PASS at the star's count
                   or more.
  5 BROWS AND LIDS what Angry, Sad and Surprised change above the lip line, and over the whole face. PASS when each
                   mood moves the brows and lids at least as much as the star's does AND each mood can be seen at all.
  AND THE FRAME    a painted pixel of the head or its hat on the top or side edge of the picture above the jaw is a
                   cut; the star has none. PASS at zero.

USAGE:  python3 tools/bohemia_eyes_the_star_is_the_bar_10_18_26.py            # read every face, write the JSON and sheet
        python3 tools/bohemia_eyes_the_star_is_the_bar_10_18_26.py --selftest # planted faces each sent back, the star
                                                                              # passes itself, the sphere reads true
"""
import json, math, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RIG = 'records/target/portrait/rig'
STAR = 'poacher'
MANIFEST = 'records/target/portrait/crew/BOHEMIA_CREW_FACES.json'
STYLE = 'records/target/BOHEMIA_STYLE_GUIDE.json'
OUT = 'records/target/EYES_THE_STAR_IS_THE_BAR.json'
SHEET = 'slices/vote/EYES_THE_STAR_IS_THE_BAR.webp'   # lossless: every pixel as rendered, 1.25 MB against the PNG's 1.97
SPHERE = 'records/target/portrait/rig/poacher/calibration_sphere.png'

MOUTHS = ('A', 'E', 'O', 'M')
MOODS = ('Angry', 'Sad', 'Surprised')
KEYS = ('rest',) + MOUTHS + MOODS
SEEN = 5.0           # a pixel counts as moved at a CIELAB difference of 5 (about two noticeable steps), on dark skin as on light
SIZE_BAND = 0.125    # one eighth
LIGHT_TOL = 30.0     # the style guide's rig.calibration.screen_light_tolerance_deg
COLOUR_FLOOR = 800   # the style guide's classes.portrait.output_floor
PUPIL = 10           # a pupil is a dot at least this many levels darker than the ring round it
SHAPE_K = 0.05       # one shape when two differ by fewer than SHAPE_K * ipd^2 pixels
BEFORE_THE_STAR = {'thug': 'made before the star (PORTRAIT round 1, the first head from the same model)'}


def P(rel):
    return os.path.join(ROOT, rel)


# ------------------------------------------------------------------ pixels
def lum(a):
    return 0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]


def lab(a):
    rgb = a[..., :3] / 255.0
    rgb = np.where(rgb > 0.04045, ((rgb + 0.055) / 1.055) ** 2.4, rgb / 12.92)
    m = np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]])
    xyz = rgb @ m.T / np.array([0.9505, 1.0, 1.089])
    f = np.where(xyz > 0.008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)


def load_set(folder):
    """{key: float RGBA array} from a rig portrait folder; None for a key whose file is missing."""
    out = {}
    for k in KEYS:
        name = 'rig_portrait_S.png' if k == 'rest' else 'rig_portrait_S_%s.png' % k
        f = os.path.join(folder, name)
        out[k] = np.array(Image.open(f).convert('RGBA')).astype(float) if os.path.exists(f) else None
    return out


def changed(a, b, at=None):
    if a is None or b is None or a.shape != b.shape:
        return None
    op = (a[..., 3] > 127) | (b[..., 3] > 127)
    return (np.linalg.norm(lab(a) - lab(b), axis=-1) >= (SEEN if at is None else at)) & op


def light_angle(img, mask):
    """Screen degrees of the brightness moment over mask (0 right, 90 up, 180 left)."""
    ys, xs = np.nonzero(mask)
    if len(ys) < 50:
        return None
    w = lum(img)[ys, xs]
    w = w - w.mean()
    dx = ((xs - xs.mean()) * w).sum()
    dy = -((ys - ys.mean()) * w).sum()
    if abs(dx) + abs(dy) < 1e-6:
        return None
    return math.degrees(math.atan2(dy, dx)) % 360


def boxsum(a, r):
    k = 2 * r + 1
    p = np.pad(a, r, mode='edge')
    c = np.pad(np.cumsum(np.cumsum(p, 0), 1), ((1, 0), (1, 0)))
    return c[k:, k:] - c[:-k, k:] - c[k:, :-k] + c[:-k, :-k]


def angle_gap(a, b):
    d = abs(a - b) % 360
    return min(d, 360 - d)


def two_means_x(ys, xs):
    c = [float(xs.min()), float(xs.max())]
    lab_ = np.zeros(len(xs), bool)
    for _ in range(25):
        lab_ = np.abs(xs - c[0]) > np.abs(xs - c[1])
        if lab_.all() or (~lab_).all():
            break
        c = [xs[~lab_].mean(), xs[lab_].mean()]
    return lab_


# ------------------------------------------------------------------ the read
def measure(s, head_px=None):
    """Every number the bar reads, from one face's eight shots."""
    r = s['rest']
    H, W = r.shape[:2]
    op = r[..., 3] > 127
    m = {'w': W, 'h': H, 'painted_px': int(op.sum()), 'problems': [], 'head_px_claimed': head_px}
    dA = changed(r, s['A'])
    if dA is None or dA.sum() < 20:
        m['problems'].append(['mouth shapes', 'the A shot does not open the jaw, so the mouth can not be found'])
        return m
    # the mouth, without the odd hair or brim pixel the A shot also nudges: keep the pixels near its middle
    ay, ax = np.nonzero(dA)
    cy0, cx0 = np.median(ay), np.median(ax)
    dist = np.hypot(ay - cy0, ax - cx0)
    keep = dist <= np.median(dist) * 3 + 2
    ay, ax = ay[keep], ax[keep]
    jaw = (float(ay.mean()), float(ax.mean()))
    # the lip line leans with the head: the mouth's long axis, its upper edge the line; above it is the upper face
    cov = np.cov(np.vstack([ax - ax.mean(), ay - ay.mean()]))
    w_, v_ = np.linalg.eigh(cov)
    vx, vy = v_[:, int(np.argmax(w_))]
    if vx < 0:
        vx, vy = -vx, -vy
    nx, ny = vy, -vx                         # the normal that points up the face (screen y grows down)
    if ny > 0:
        nx, ny = -nx, -ny
    up_off = (ax - jaw[1]) * nx + (ay - jaw[0]) * ny
    lip_off = float(np.percentile(up_off, 98))
    yy, xx = np.mgrid[0:H, 0:W]
    upper_zone = ((xx - jaw[1]) * nx + (yy - jaw[0]) * ny) > lip_off + 2
    m['jaw'] = [round(jaw[0], 1), round(jaw[1], 1)]
    m['lip_row'] = round(jaw[0] - lip_off, 1)
    m['mouth_lean_deg'] = round(math.degrees(math.atan2(-vy, vx)), 1)

    upper = {}
    whole = {}
    ups = {}
    for k in MOODS:
        d = changed(r, s[k])
        if d is None:
            m['problems'].append(['brows and lids', 'the %s shot is missing' % k])
            upper[k] = whole[k] = 0
            continue
        whole[k] = int(d.sum())
        ups[k] = d & upper_zone
        upper[k] = int(ups[k].sum())
    m['brows_and_lids_px'] = upper
    m['mood_px'] = whole

    # the eyes from the lids: what Surprised moves in the upper face (Angry and Sad added if that is too little),
    # split left and right
    eyes = None
    if 'Surprised' in ups:
        d = ups['Surprised'].copy()
        if d.sum() < 8:
            for k in ('Angry', 'Sad'):
                if k in ups:
                    d |= ups[k]
        ys, xs = np.nonzero(d)
        if len(ys) >= 6:
            right = two_means_x(ys, xs)
            if right.sum() >= 3 and (~right).sum() >= 3:
                e1 = (float(ys[~right].mean()), float(xs[~right].mean()))
                e2 = (float(ys[right].mean()), float(xs[right].mean()))
                eyes = (e1, e2)
    if eyes is None:
        m['problems'].append(['brows and lids', 'the lids do not move in any mood, so the eyes can not be found'])
        return m
    # pin each eye on its pupil: the darkest small dot near the lid spot (the lids sit a few px over the pupil, and a
    # hat's shade can hide half a lid); a dot too faint to see keeps the lid spot, and the read says which
    L = lum(r)
    ring = (boxsum(L, 3) - boxsum(L, 1)) / 40.0
    dot = ring - boxsum(L, 1) / 9.0
    lid_ipd = math.hypot(eyes[1][1] - eyes[0][1], eyes[1][0] - eyes[0][0])
    pinned, how = [], []
    for (ey, ex) in eyes:
        y0 = int(max(0, ey - 0.12 * lid_ipd)); y1_ = int(min(H, ey + 0.45 * lid_ipd))
        x0 = int(max(0, ex - 0.30 * lid_ipd)); x1_ = int(min(W, ex + 0.30 * lid_ipd))
        win = dot[y0:y1_, x0:x1_] * op[y0:y1_, x0:x1_]
        if win.size and win.max() >= PUPIL:
            py, px = np.unravel_index(int(win.argmax()), win.shape)
            pinned.append((float(y0 + py), float(x0 + px)))
            how.append('pupil')
        else:
            pinned.append((ey, ex))
            how.append('lid')
    m['eyes_from'] = how
    m['pupil_contrast'] = [round(float((dot[int(y), int(x)])), 1) for (y, x) in pinned]
    m['eyes_seen'] = how == ['pupil', 'pupil']
    eyes = tuple(pinned)
    (y1, x1), (y2, x2) = eyes
    ipd = math.hypot(x2 - x1, y2 - y1)
    mid = ((y1 + y2) / 2, (x1 + x2) / 2)
    m['eyes'] = [[round(y1, 1), round(x1, 1)], [round(y2, 1), round(x2, 1)]]
    m['eye_spacing_px'] = round(ipd, 1)
    m['eyes_to_jaw_px'] = round(math.hypot(jaw[0] - mid[0], jaw[1] - mid[1]), 1)
    m['roll_deg'] = round(math.degrees(math.atan2(-(y2 - y1), x2 - x1)), 1)

    # the face's skin, for the light: an ellipse round the face from the eyes to the jaw, the hat and hair
    # masked by colour against the cheeks, the moving mouth and lids masked out
    ax_y, ax_x = jaw[0] - mid[0], jaw[1] - mid[1]
    flen = math.hypot(ax_y, ax_x) or 1.0
    uy, ux = ax_y / flen, ax_x / flen                     # down the face
    cy, cx = mid[0] + 0.35 * ax_y, mid[1] + 0.35 * ax_x
    along = (yy - cy) * uy + (xx - cx) * ux
    across = (yy - cy) * ux - (xx - cx) * uy
    core = ((along / (1.05 * flen)) ** 2 + (across / (1.25 * ipd)) ** 2 <= 1.0) & op
    L3 = lab(r)
    seed = np.zeros_like(op)
    for (ey, ex) in eyes:
        sy, sx = int(round(ey + 0.45 * ax_y)), int(round(ex + 0.45 * ax_x))
        seed[max(0, sy - 2):sy + 3, max(0, sx - 2):sx + 3] = True
    seed &= op
    if seed.sum() < 5:
        m['problems'].append(['light', 'the cheeks under the eyes are not painted'])
        return m
    sab = np.median(L3[..., 1:][seed], 0)
    sL = float(np.median(L3[..., 0][seed]))
    skin = core & (np.linalg.norm(L3[..., 1:] - sab, axis=-1) < 10)
    moving = dA.copy()
    for k in MOUTHS + MOODS:
        d = changed(r, s[k])
        if d is not None:
            moving |= d
    skin &= ~moving
    m['skin_px'] = int(skin.sum())
    under = skin & (((yy - mid[0]) * uy + (xx - mid[1]) * ux) >= 0.15 * flen)   # no hat or fringe shades it
    m['light_px'] = int(under.sum())
    a = light_angle(r, under)
    m['light_deg'] = None if a is None else round(a, 1)
    sk = L3[skin]
    if len(sk):
        L_, a_, b_ = np.median(sk, 0)
        m['skin'] = {'L': round(float(L_), 1), 'chroma': round(float(math.hypot(a_, b_)), 1),
                     'hue_deg': round(math.degrees(math.atan2(b_, a_)) % 360, 1)}
    m['_skin_mask'] = skin

    # colours
    def ncol(img, mask):
        px = img[..., :3][mask].astype(np.uint8)
        return int(len(np.unique(px.view(np.dtype((np.void, 3))).ravel()))) if len(px) else 0
    m['colours_rest'] = ncol(r, op)
    m['colours_per_1000_px'] = round(1000.0 * m['colours_rest'] / max(1, m['painted_px']), 1)
    allpx = np.concatenate([s[k][..., :3][s[k][..., 3] > 127] for k in KEYS if s[k] is not None]).astype(np.uint8)
    m['colours_set'] = int(len(np.unique(allpx.view(np.dtype((np.void, 3))).ravel())))

    # mouth shapes in the mouth's box
    box = dA.copy()
    for k in MOUTHS:
        d = changed(r, s[k])
        if d is not None:
            box |= d
    by, bx = np.nonzero(box)
    y0, y1_, x0, x1_ = max(0, by.min() - 2), by.max() + 3, max(0, bx.min() - 2), bx.max() + 3
    shapes = ['rest'] + [k for k in MOUTHS if s[k] is not None]
    T = SHAPE_K * ipd * ipd
    pair = {}
    for i in range(len(shapes)):
        for j in range(i + 1, len(shapes)):
            d = changed(s[shapes[i]][y0:y1_, x0:x1_], s[shapes[j]][y0:y1_, x0:x1_])
            pair[shapes[i] + '-' + shapes[j]] = int(d.sum())
    parent = {k: k for k in shapes}
    if 'M' in parent:
        parent['M'] = 'rest'          # rest and M are both a closed mouth: counted once, however far apart they read

    def root(k):
        while parent[k] != k:
            k = parent[k]
        return k
    for key, n in pair.items():
        p, q = key.split('-')
        if n < T and root(p) != root(q):
            parent[root(q)] = root(p)
    groups = {}
    for k in shapes:
        groups.setdefault(root(k), []).append(k)
    m['mouth_pairs_px'] = pair
    m['mouth_same_below_px'] = round(T, 1)
    m['mouth_shapes'] = len(groups)
    m['mouth_groups'] = sorted(['+'.join(sorted(g, key=KEYS.index)) for g in groups.values()], key=len)

    # the frame: the head or its hat on the top or side edge above the jaw, in the render and in the square the crew
    # screen draws (PORTRAIT's own window, rebuilt here for a face that has none, the star among them)
    above = op[:int(jaw[0]), :]
    m['frame_cut_px'] = int(above[0, :].sum() + above[:, 0].sum() + above[:, -1].sum())
    sq, x0s, side = screen_square(r, m.get('head_px_claimed') or 128)
    sop = sq[..., 3] > 127
    jy = int(jaw[0] * 128 / side)
    m['screen_cut_px'] = int(sop[0, :].sum() + sop[:jy, 0].sum() + sop[:jy, -1].sum())
    m['screen_eye_spacing_px'] = round(ipd * 128 / side, 1)
    return m


def screen_square(r, head_px):
    """PORTRAIT's hand-off window (tools/bohemia_portrait_the_head_from_the_model.py crew_faces): a square 1.25 x the
    head from the top, centred on the head, BOX-resampled to 128. Returns (the 128 square, its left edge, its side)."""
    im = Image.fromarray(r.astype(np.uint8), 'RGBA')
    side = min(im.width, int(round(head_px * 1.25)))
    bb = im.split()[3].crop((0, 0, im.width, side)).getbbox() or (0, 0, im.width, side)
    cx = (bb[0] + bb[2]) // 2
    x0 = max(0, min(im.width - side, cx - side // 2))
    sq = im.crop((x0, 0, x0 + side, side)).resize((128, 128), Image.BOX)
    return np.array(sq).astype(float), x0, side


def verdict(m, star, on_screen=False):
    """PASS or BACK against the star's own numbers; every leg named."""
    legs = []

    def leg(name, ok, said):
        legs.append({'leg': name, 'pass': None if ok is None else bool(ok), 'said': said})
    if m.get('problems'):
        for name, said in m['problems']:
            leg(name, False, said)
        return 'BACK', legs
    leg('eyes seen', m['eyes_seen'],
        'both pupils show (%s levels darker than round them; the star %s)' % (
            ' and '.join('%.0f' % c for c in m['pupil_contrast']), ' and '.join('%.0f' % c for c in star['pupil_contrast']))
        if m['eyes_seen'] else 'an eye has no pupil you can see (%s levels against the star\'s %s; %d is the least seen)' % (
            ' and '.join('%.0f' % c for c in m['pupil_contrast']), ' and '.join('%.0f' % c for c in star['pupil_contrast']),
            PUPIL))
    ratio = m['eye_spacing_px'] / star['eye_spacing_px']
    if m['eyes_seen']:
        leg('head size', abs(ratio - 1) <= SIZE_BAND,
            'eyes %.1f px apart against the star\'s %.1f (%d percent); %.1f on the crew screen\'s 128 box' % (
                m['eye_spacing_px'], star['eye_spacing_px'], round(100 * ratio), m['screen_eye_spacing_px']))
    else:
        leg('head size', None, 'not read: one eye can not be seen, so the eyes\' spacing is not measured')
    if m.get('light_deg') is None:
        leg('light', False, 'too little bare skin to read the light')
    else:
        g = angle_gap(m['light_deg'], star['light_deg'])
        leg('light', g <= LIGHT_TOL, 'lit from %d degrees against the star\'s %d (%d apart)' % (
            round(m['light_deg']), round(star['light_deg']), round(g)))
    leg('colours', m['colours_set'] >= COLOUR_FLOOR,
        '%s colours, %.0f per 1,000 px, against the star\'s %s and %.0f (the floor is %d)' % (
            format(m['colours_set'], ','), m['colours_per_1000_px'], format(star['colours_set'], ','),
            star['colours_per_1000_px'], COLOUR_FLOOR))
    leg('mouth shapes', m['mouth_shapes'] >= star['mouth_shapes'],
        '%d mouth shapes against the star\'s %d (%s)' % (m['mouth_shapes'], star['mouth_shapes'],
                                                         ', '.join(m['mouth_groups'])))
    weak = [k for k in MOODS if m['brows_and_lids_px'][k] < star['brows_and_lids_px'][k]]
    unseen = [k for k in MOODS if m['mood_px'][k] < (1 - SIZE_BAND) * star['mood_px'][k]]
    leg('brows and lids', not weak and not unseen,
        'Angry/Sad/Surprised move the brows and lids %s px (the star %s) and the whole face %s px (the star %s)%s%s' % (
            '/'.join(str(m['brows_and_lids_px'][k]) for k in MOODS),
            '/'.join(str(star['brows_and_lids_px'][k]) for k in MOODS),
            '/'.join(str(m['mood_px'][k]) for k in MOODS),
            '/'.join(str(star['mood_px'][k]) for k in MOODS),
            ('; brows under the star in ' + ', '.join(weak)) if weak else '',
            ('; the face moves less than the star\'s in ' + ', '.join(unseen)) if unseen else ''))
    cut = m['frame_cut_px'] + (m['screen_cut_px'] if on_screen else 0)
    where = ' and %d px in the square the crew screen draws (the star\'s own brim would lose %d there)' % (
        m['screen_cut_px'], star['screen_cut_px']) if on_screen else ''
    leg('frame', cut == 0,
        ('the edge cuts %d px of the head or hat in the render' % m['frame_cut_px'] + where) if cut else
        ('the head and hat sit inside the render' + (' and inside the crew screen\'s square' if on_screen else '')))
    return ('BACK' if any(l['pass'] is False for l in legs) else 'PASS'), legs


# ------------------------------------------------------------------ who
def faces():
    """[(who, folder, claimed)] for every rig portrait folder with a rest shot, the star first."""
    found = []
    for dp, dn, fn in os.walk(P(RIG)):
        dn.sort()
        if 'rig_portrait_S.png' in fn:
            who = os.path.relpath(dp, P(RIG)).replace(os.sep, '/')
            who = who.split('/')[-1]
            claimed = None
            pj = os.path.join(dp, 'portrait.json')
            if os.path.exists(pj):
                try:
                    claimed = json.load(open(pj)).get('head_px')
                except Exception:
                    claimed = None
            found.append((who, dp, claimed))
    found.sort(key=lambda t: (t[0] != STAR, t[0] in BEFORE_THE_STAR, t[0] != 'you', t[0]))
    return found


def star_claimed():
    try:
        return json.load(open(P(os.path.join(RIG, STAR, 'portrait.json')))).get('head_px')
    except Exception:
        return None


def manifest_names():
    try:
        mf = json.load(open(P(MANIFEST)))
        return {k: (v.get('name') or k.replace('cast_', '').upper()) for k, v in mf.get('faces', {}).items()}
    except Exception:
        return {}


# ------------------------------------------------------------------ the sheet
def font(sz):
    for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf',
              '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        if os.path.exists(p):
            return ImageFont.truetype(p, sz)
    return ImageFont.load_default()


MARK = {True: 'ok  ', False: 'BACK', None: 'n/a '}
BG = (24, 23, 21)
CELL_BG = (52, 49, 45)
INK = (226, 220, 206)
DIM = (150, 144, 132)
GOOD = (140, 196, 120)
BAD = (232, 120, 96)
GOLD = (236, 196, 92)


def cell(img, m, size, anchor, draw_marks=True, scale=1.0):
    """The shot on a flat ground, moved so its eye midpoint lands on anchor; the found eyes and jaw drawn."""
    c = Image.new('RGBA', (size, size), CELL_BG + (255,))
    im = Image.fromarray(img.astype(np.uint8), 'RGBA')
    if scale != 1.0:
        im = im.resize((round(im.width * scale), round(im.height * scale)), Image.NEAREST)
    if 'eyes' in m:
        my = (m['eyes'][0][0] + m['eyes'][1][0]) / 2 * scale
        mx = (m['eyes'][0][1] + m['eyes'][1][1]) / 2 * scale
    else:
        my, mx = im.height * 0.45, im.width / 2
    ox, oy = round(anchor[0] - mx), round(anchor[1] - my)
    c.alpha_composite(im, (max(0, ox), max(0, oy)), (max(0, -ox), max(0, -oy)))
    if draw_marks and 'eyes' in m:
        d = ImageDraw.Draw(c)
        for (ey, ex) in m['eyes']:
            x, y = ex * scale + ox, ey * scale + oy
            d.ellipse([x - 4, y - 4, x + 4, y + 4], outline=(120, 230, 120), width=1)
        jy, jx = m['jaw'][0] * scale + oy, m['jaw'][1] * scale + ox
        d.line([jx - 4, jy, jx + 4, jy], fill=(230, 120, 230))
        d.line([jx, jy - 4, jx, jy + 4], fill=(230, 120, 230))
    return c


def short_lines(m, star, legs):
    """Seven short lines for the sheet, one per leg, the face's number beside the star's; the long words stay in the JSON."""
    by = {l['leg']: l['pass'] for l in legs}
    out = []
    if m.get('problems'):
        return [(False, name.upper() + ': ' + said) for name, said in m['problems']]
    pc = m['pupil_contrast']
    out.append((by['eyes seen'], 'EYES SEEN     %s and %s  (star %s and %s)' % (
        round(pc[0]), round(pc[1]), round(star['pupil_contrast'][0]), round(star['pupil_contrast'][1]))))
    if by['head size'] is None:
        out.append((None, 'HEAD SIZE     not read: an eye is not seen'))
    else:
        out.append((by['head size'], 'HEAD SIZE     eyes %.0f px apart  (star %.0f)' % (m['eye_spacing_px'],
                                                                                 star['eye_spacing_px'])))
    out.append((by['light'], 'LIGHT FROM    %d deg  (star %d)' % (round(m['light_deg']), round(star['light_deg']))))
    out.append((by['colours'], 'COLOURS       %s  (star %s, floor %d)' % (format(m['colours_set'], ','),
                                                                         format(star['colours_set'], ','), COLOUR_FLOOR)))
    out.append((by['mouth shapes'], 'MOUTH SHAPES  %d  (star %d)' % (m['mouth_shapes'], star['mouth_shapes'])))
    out.append((by['brows and lids'], 'MOODS         brows %s, face %s' % (
        '/'.join(str(m['brows_and_lids_px'][k]) for k in MOODS), '/'.join(str(m['mood_px'][k]) for k in MOODS))))
    out.append((None, '              (star %s, %s)' % (
        '/'.join(str(star['brows_and_lids_px'][k]) for k in MOODS), '/'.join(str(star['mood_px'][k]) for k in MOODS))))
    fr = m['frame_cut_px'] + (m['screen_cut_px'] if 'on your crew' in m.get('_note', '') else 0)
    out.append((by['frame'], 'FRAME         ' + ('clear' if not fr else
                                                  'hat cut %d px on the crew screen' % (fr))))
    return out


def build_sheet(rows, star_m, star_set, path):
    C = 232                      # a cell; both heads at their own 1:1 render pixels, eyes on one spot
    anchor = (C // 2, 104)
    shots = ('rest', 'A', 'Angry', 'Surprised')
    text_w = 560
    gap = 6
    W = 16 + C + 14 + len(shots) * (C + gap) + 12 + text_w
    head_h = 214
    row_h = C + 18
    per_row = max(1, (W - 32) // 134)
    n_strip = 1 + sum('on your crew' in r[6] for r in rows)
    line_h = 40 + 156 * ((n_strip + per_row - 1) // per_row)
    H = head_h + row_h * len(rows) + line_h + 34
    sheet = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(sheet)
    f1, f2, f3, f4 = font(24), font(16), font(15), font(30)
    sm = star_m
    d.text((16, 12), 'EVERY NEW FACE BESIDE YOUR STARRED POACHER, MEASURED', font=f1, fill=GOLD)
    d.text((16, 46), 'Left: the poacher you starred. Right: each face made after it, at the same 1:1 pixels, eyes lined up. '
                     'Green rings: the eyes the tool found.', font=f2, fill=INK)
    d.text((16, 68), 'Every number is read off the pictures. PASS = as good as the star on every number. BACK = the red '
                     'line says which.', font=f2, fill=INK)
    d.text((16, 98), 'WHAT THE STAR HAS: eyes %.0f px apart, lit from %d deg, %s colours, %d mouth shapes, both pupils '
                     'seen (%d and %d), frame clear.' % (
                         sm['eye_spacing_px'], round(sm['light_deg']), format(sm['colours_set'], ','), sm['mouth_shapes'],
                         round(sm['pupil_contrast'][0]), round(sm['pupil_contrast'][1])), font=f2, fill=GOLD)
    d.text((16, 120), 'ONE THING THE STAR DOES NOT HAVE: its moods move the mouth, almost never the brows or lids '
                      '(%s px for Angry/Sad/Surprised; the crew\'s move about 600/250/750).' % (
                          '/'.join(str(sm['brows_and_lids_px'][k]) for k in MOODS)), font=f2, fill=GOLD)
    d.text((16, 142), 'Taste is DIRECTION\'s and yours: this sheet only measures.', font=f2, fill=DIM)
    x0 = 16
    d.text((x0, 186), 'THE STAR', font=f3, fill=GOLD)
    for i, k in enumerate(shots):
        d.text((x0 + C + 14 + i * (C + gap), 186), 'THE FACE: ' + k.upper(), font=f3, fill=DIM)
    tx = x0 + C + 14 + len(shots) * (C + gap) + 12
    d.text((tx, 186), 'THE NUMBERS (the star\'s in brackets)', font=f3, fill=DIM)
    y = head_h
    star_cell = cell(star_set['rest'], star_m, C, anchor)
    for row in rows:
        who, name, m, v, legs, s, note = row
        sheet.paste(star_cell, (x0, y))
        for i, k in enumerate(shots):
            if s.get(k) is not None:
                sheet.paste(cell(s[k], m, C, anchor), (x0 + C + 14 + i * (C + gap), y))
        m['_note'] = note
        d.text((tx, y), name, font=f1, fill=INK)
        d.text((tx + 400, y - 4), v, font=f4, fill=GOOD if v == 'PASS' else BAD)
        sub = 'made BEFORE the star' if who in BEFORE_THE_STAR else ('on your crew screen' if 'on your crew' in note else '')
        d.text((tx, y + 28), sub, font=f3, fill=DIM)
        ly = y + 52
        for ok, line in short_lines(m, star_m, legs):
            d.text((tx, ly), line, font=f3, fill={True: INK, False: BAD, None: DIM}[ok])
            ly += 21
        y += row_h
    # the company line at the size the crew screen draws it
    d.text((16, y + 6), 'THE COMPANY LINE AS THE CREW SCREEN DRAWS IT (64 px, shown at 2x): the star through the same window '
                        'first, then every face on the screen', font=f2, fill=GOLD)
    lx, ly = 16, y + 34
    strip_faces = [('THE STAR', star_set['rest'], star_m)] + [(r[1], r[5]['rest'], r[2]) for r in rows if 'on your crew' in r[6]]
    for label, img, m in strip_faces:
        sq, _, _ = screen_square(img, m.get('head_px_claimed') or 128)
        im = Image.fromarray(sq.astype(np.uint8), 'RGBA').resize((64, 64), Image.BOX).resize((128, 128), Image.NEAREST)
        tile = Image.new('RGBA', (128, 128), CELL_BG + (255,))
        tile.alpha_composite(im)
        sheet.paste(tile, (lx, ly))
        d.text((lx, ly + 132), label[:12], font=font(13), fill=GOLD if label == 'THE STAR' else DIM)
        lx += 134
        if lx + 128 > W - 16:
            lx, ly = 16, ly + 156
    d.text((16, H - 26), 'EYES AND EARS, the star is the bar; every number and its long reason in '
                         'records/target/EYES_THE_STAR_IS_THE_BAR.json', font=font(13), fill=DIM)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    sheet.save(path, lossless=True, method=6)
    return sheet.size


# ------------------------------------------------------------------ run
def read_all():
    names = manifest_names()
    star_set = load_set(P(os.path.join(RIG, STAR)))
    star_m = measure(star_set, star_claimed())
    if star_m.get('problems'):
        raise SystemExit('THE STAR ITSELF CAN NOT BE READ: %s' % star_m['problems'])
    rows = []
    for who, folder, claimed in faces():
        if who == STAR:
            continue
        s = load_set(folder)
        m = measure(s, claimed)
        v, legs = verdict(m, star_m, on_screen=who in names)
        name = names.get(who) or who.upper()
        note = BEFORE_THE_STAR.get(who, '')
        if who in names:
            note = (note + '; ' if note else '') + 'on your crew and scavenge screens (%s)' % who
        rows.append((who, name, m, v, legs, s, note))
    return star_set, star_m, rows


def strip(m):
    return {k: v for k, v in m.items() if not k.startswith('_')}


def main():
    star_set, star_m, rows = read_all()
    after = [r for r in rows if r[0] not in BEFORE_THE_STAR]
    out = {
        'lane': 'eyes and ears', 'row': '[the star is the bar]', 'rule': '115(h)', 'made': '10/18',
        'tool': 'tools/bohemia_eyes_the_star_is_the_bar_10_18_26.py',
        'the_star': dict(strip(star_m), who=STAR, card='portrait-the-poachers-face-from-the-same-model-10-18'),
        'bars': {'size_band': SIZE_BAND, 'light_tolerance_deg': LIGHT_TOL, 'colour_floor': COLOUR_FLOOR,
                 'mood_share': 1 - SIZE_BAND, 'shape_k': SHAPE_K, 'seen_levels': SEEN},
        'faces': [dict(who=r[0], name=r[1], verdict=r[3], legs=r[4], note=r[6], numbers=strip(r[2])) for r in rows],
        'tally': {'after_the_star': len(after), 'pass': sum(r[3] == 'PASS' for r in after),
                  'back': sum(r[3] == 'BACK' for r in after)},
    }
    json.dump(out, open(P(OUT), 'w'), indent=1)
    size = build_sheet(rows, star_m, star_set, P(SHEET))
    print('THE STAR (%s): eyes %.1f px apart, eyes to jaw %.1f, light %.1f deg, %d colours (%.1f per 1,000 px), '
          '%d mouth shapes %s, brows and lids %s, frame cut %d' % (
              STAR, star_m['eye_spacing_px'], star_m['eyes_to_jaw_px'], star_m['light_deg'], star_m['colours_set'],
              star_m['colours_per_1000_px'], star_m['mouth_shapes'], star_m['mouth_groups'],
              star_m['brows_and_lids_px'], star_m['frame_cut_px']))
    for who, name, m, v, legs, s, note in rows:
        bad = [l['leg'] for l in legs if l['pass'] is False]
        print('%-15s %-4s %s' % (who, v, ('BACK on: ' + ', '.join(bad)) if bad else ''))
        for l in legs:
            print('     %s %-14s %s' % (MARK[l['pass']], l['leg'], l['said']))
    print('after the star: %d faces, %d PASS, %d BACK' % (out['tally']['after_the_star'], out['tally']['pass'],
                                                        out['tally']['back']))
    print('sheet %s %s; read %s' % (SHEET, size, OUT))


# ------------------------------------------------------------------ the controls
def selftest():
    fails = []

    def check(name, ok, said):
        print('%s %s: %s' % ('ok  ' if ok else 'FAIL', name, said))
        if not ok:
            fails.append(name)
    # 0 the light read points at the right thing: the rig's own calibration sphere
    sp = np.array(Image.open(P(SPHERE)).convert('RGBA')).astype(float)
    a = light_angle(sp, sp[..., 3] > 0)
    guide = json.load(open(P(STYLE)))['rig']['calibration']['screen_light_deg']
    check('the sphere', a is not None and angle_gap(a, guide) <= 5,
          'the light read gives %.1f deg on the rig\'s calibration sphere; DIRECTION measured %.1f' % (a, guide))
    # 0b the crew screen's square is PORTRAIT's own: rebuilt here, it equals every hand-off file to the pixel
    worst, n = 0.0, 0
    try:
        mf = json.load(open(P(MANIFEST))).get('faces', {})
    except Exception:
        mf = {}
    for look, ent in mf.items():
        src = P(os.path.join(RIG, 'crew', look, 'rig_portrait_S.png'))
        hand = P(ent.get('files', {}).get('rest', '').replace('{64|128}', '128'))
        if os.path.exists(src) and os.path.exists(hand):
            sq, _, _ = screen_square(np.array(Image.open(src).convert('RGBA')).astype(float), 128)
            worst = max(worst, float(np.abs(sq - np.array(Image.open(hand).convert('RGBA')).astype(float)).max()))
            n += 1
    check('the crew screen\'s square', n > 0 and worst <= 1,
          'rebuilt for %d faces; the most any pixel differs from the hand-off file is %.0f levels' % (n, worst))
    star_set = load_set(P(os.path.join(RIG, STAR)))
    star_m = measure(star_set, star_claimed())
    check('the star reads', not star_m.get('problems') and star_m.get('eye_spacing_px', 0) > 10,
          'eyes %s px apart, light %s, %s shapes' % (star_m.get('eye_spacing_px'), star_m.get('light_deg'),
                                                     star_m.get('mouth_shapes')))
    v, legs = verdict(star_m, star_m)
    check('the star passes itself', v == 'PASS' and all(l['pass'] for l in legs),
          '; '.join(l['said'] for l in legs if not l['pass']) or 'every leg')

    def planted(name, fn, want_leg):
        s = {k: (None if star_set[k] is None else fn(k, star_set[k].copy())) for k in KEYS}
        m = measure(s)
        v, legs = verdict(m, star_m)
        back = [l['leg'] for l in legs if l['pass'] is False]
        check(name, v == 'BACK' and want_leg in back, 'BACK on %s (wanted %s)' % (back, want_leg))

    def shrink(k, a):
        im = Image.fromarray(a.astype(np.uint8), 'RGBA')
        im = im.resize((round(im.width * 0.78), round(im.height * 0.78)), Image.LANCZOS)
        return np.array(im).astype(float)
    planted('a head a fifth smaller', shrink, 'head size')

    def from_the_right(k, a):
        H, W = a.shape[:2]
        ramp = np.linspace(0.35, 1.65, W)[None, :, None]
        a[..., :3] = np.clip(a[..., :3] * ramp, 0, 255)
        return a
    planted('lit from the right', from_the_right, 'light')

    def flat(k, a):
        a[..., :3] = np.round(a[..., :3] / 48) * 48
        return a
    planted('a flat face (five steps a channel)', flat, 'colours')

    def one_mouth(k, a):
        return star_set['rest'].copy() if k in ('E', 'O', 'M') else a
    planted('a mouth that only opens', one_mouth, 'mouth shapes')

    def still_brows(k, a):
        if k in MOODS:
            m0 = measure(star_set)
            lip = int(m0['lip_row']) - 1
            a[:lip] = star_set['rest'][:lip]
        return a
    planted('moods that never reach the brows', still_brows, 'brows and lids')

    def cut_hat(k, a):
        return a[12:, :]
    planted('the hat cut by the frame', cut_hat, 'frame')

    def frozen(k, a):
        return star_set['rest'].copy()
    planted('a face that never moves', frozen, 'mouth shapes')
    print('SELFTEST %s (%d failed)' % ('GREEN' if not fails else 'RED', len(fails)))
    return 0 if not fails else 1


if __name__ == '__main__':
    if '--selftest' in sys.argv:
        sys.exit(selftest())
    main()
