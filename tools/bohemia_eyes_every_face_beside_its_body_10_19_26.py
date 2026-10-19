#!/usr/bin/env python3
"""EYES AND EARS -- EVERY FACE BESIDE ITS BODY (lane 17, row [every face beside its body], claimed 10/19 eyes-opus-10-19)

PAOLO 10/18, rule 120(d): "the portraits don't look like the people... Black people looking like white people." Nobody
had measured whether a face matches its body. This tool reads every face the demo shows beside the body the demo
draws for the same person, OFF THE PICTURES, and writes one line each: PASS or BACK with the measured difference.
CONSTRAINT: EYES reports, PORTRAIT and CHARACTER fix. This tool only WRITES ITS READ
(records/target/EYES_EVERY_FACE_BESIDE_ITS_BODY.json and the sheet); it never edits a face, a body or the registry.

WHAT IT READS (the files the demo itself loads, never a manifest's claim):
  THE BODY    slices/fight_people/<look>.webp, frame 0 (idle, facing SE): the man the fight, the map and the crew line draw.
  FACE ONE    the same sheet's own 64 px face (right of the last column, top row; fight_people.json 'face').
  FACE TWO    PORTRAIT's fresh portrait, records/target/portrait/crew/<look>/rest_128.png (BohemiaCrewFaces, the crew and
              scavenge screens), its seven other shots used only to find the eyes and the mouth.
  FACE THREE  the faces the page paints at run time (the player's HUD face, the keepers, the speakers): read from the
              demo itself by tools/bohemia_eyes_every_face_beside_its_body_10_19_26.js, which writes
              records/target/EYES_EVERY_FACE_RUNTIME.json; this tool reads that file when it is there.

THE SKIN, AND HOW IT IS READ
  Flat pixel art (the body, face one): the mouth is found as the reddest run in the lower head; the skin is the most
  common colour on the cheeks between the eyes and the mouth (the mouth, the eyes and the outline left out). A body or
  face with no mouth found falls back to the most common colour of the head that is not the top of the head, and the
  read says so.
  The 3D portrait (face two): the eyes and the jaw from the face's own performance (THE STAR IS THE BAR's landmarks,
  imported, never copied), the skin the median of the cheeks under the eyes, the moving mouth and lids left out.
  Each skin is CIELAB (D65), and its ITA angle, the dermatologists' skin-tone measure (Chardon, Cretois and Hourseau
  1991; the six bands of Del Bino et al. 2006): ITA = atan((L* - 50) / b*), very light over 55, light 41 to 55,
  intermediate 28 to 41, tan 10 to 28, brown -30 to 10, dark under -30.
  SKIN PASS: the face's band is the body's band or the next one, AND the lightness differs by 12 L* or less (about the
  step between two neighbouring Monk skin-tone swatches). Anything else is BACK, the numbers printed.
THE TOP OF THE HEAD: hair, or the hat when the worn list puts one on, read as the median of the top rows of the head;
  PASS within 20 CIEDE2000. THE HAT: a hat on the body and none on the face (or the other way) is BACK.
BUILD: a portrait is head only (his 9/27 vote, head gear shown), so the body's build can not be read in it; the read
  names that instead of inventing a number.

USAGE:  python3 tools/bohemia_eyes_every_face_beside_its_body_10_19_26.py            # read, write the JSON and the sheet
        python3 tools/bohemia_eyes_every_face_beside_its_body_10_19_26.py --selftest # planted faces each sent back
"""
import importlib.util, json, math, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PEOPLE = 'slices/fight_people'
CREW = 'records/target/portrait/crew'
RUNTIME = 'records/target/EYES_EVERY_FACE_RUNTIME.json'
OUT = 'records/target/EYES_EVERY_FACE_BESIDE_ITS_BODY.json'
SHEET = 'slices/vote/EYES_EVERY_FACE_BESIDE_ITS_BODY.webp'
STAR_TOOL = 'tools/bohemia_eyes_the_star_is_the_bar_10_18_26.py'
FRAME = 112
L_TOL = 12.0
TOP_TOL = 20.0
BANDS = [(55, 'very light'), (41, 'light'), (28, 'intermediate'), (10, 'tan'), (-30, 'brown'), (-999, 'dark')]
KEYS = ('rest', 'A', 'E', 'O', 'M', 'Angry', 'Sad', 'Surprised')


def P(rel):
    return os.path.join(ROOT, rel)


def star():
    spec = importlib.util.spec_from_file_location('eyes_star', P(STAR_TOOL))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


S = star()
lab = S.lab


# ------------------------------------------------------------------ colour science
def ita(L, b):
    """Skin is yellow-side (b* > 0); a b* under 0.5 is held at 0.5 so a grey reads as the far end of its side."""
    return math.degrees(math.atan((L - 50.0) / max(b, 0.5)))


def band(t):
    for lo, name in BANDS:
        if t > lo:
            return name
    return 'dark'


def band_i(t):
    for i, (lo, _) in enumerate(BANDS):
        if t > lo:
            return i
    return len(BANDS) - 1


def de2000(c1, c2):
    """CIEDE2000 (Sharma, Wu and Dalal 2005), kL = kC = kH = 1."""
    L1, a1, b1 = c1
    L2, a2, b2 = c2
    C1, C2 = math.hypot(a1, b1), math.hypot(a2, b2)
    Cm = (C1 + C2) / 2
    G = 0.5 * (1 - math.sqrt(Cm ** 7 / (Cm ** 7 + 25 ** 7)))
    a1p, a2p = (1 + G) * a1, (1 + G) * a2
    C1p, C2p = math.hypot(a1p, b1), math.hypot(a2p, b2)
    h1p = math.degrees(math.atan2(b1, a1p)) % 360
    h2p = math.degrees(math.atan2(b2, a2p)) % 360
    dLp, dCp = L2 - L1, C2p - C1p
    if C1p * C2p == 0:
        dhp = 0
    elif abs(h2p - h1p) <= 180:
        dhp = h2p - h1p
    elif h2p - h1p > 180:
        dhp = h2p - h1p - 360
    else:
        dhp = h2p - h1p + 360
    dHp = 2 * math.sqrt(C1p * C2p) * math.sin(math.radians(dhp / 2))
    Lpm, Cpm = (L1 + L2) / 2, (C1p + C2p) / 2
    if C1p * C2p == 0:
        hpm = h1p + h2p
    elif abs(h1p - h2p) <= 180:
        hpm = (h1p + h2p) / 2
    elif h1p + h2p < 360:
        hpm = (h1p + h2p + 360) / 2
    else:
        hpm = (h1p + h2p - 360) / 2
    T = (1 - 0.17 * math.cos(math.radians(hpm - 30)) + 0.24 * math.cos(math.radians(2 * hpm))
         + 0.32 * math.cos(math.radians(3 * hpm + 6)) - 0.20 * math.cos(math.radians(4 * hpm - 63)))
    dth = 30 * math.exp(-((hpm - 275) / 25) ** 2)
    Rc = 2 * math.sqrt(Cpm ** 7 / (Cpm ** 7 + 25 ** 7))
    Sl = 1 + 0.015 * (Lpm - 50) ** 2 / math.sqrt(20 + (Lpm - 50) ** 2)
    Sc, Sh = 1 + 0.045 * Cpm, 1 + 0.015 * Cpm * T
    Rt = -math.sin(math.radians(2 * dth)) * Rc
    return math.sqrt((dLp / Sl) ** 2 + (dCp / Sc) ** 2 + (dHp / Sh) ** 2 + Rt * (dCp / Sc) * (dHp / Sh))


def skin_of(c):
    L, a, b = c
    t = ita(L, b)
    return {'L': round(L, 1), 'a': round(a, 1), 'b': round(b, 1), 'ita': round(t, 1), 'band': band(t),
            'rgb': lab_to_hex(c)}


def lab_to_hex(c):
    L, a, b = c
    fy = (L + 16) / 116
    fx, fz = fy + a / 500, fy - b / 200
    def inv(f):
        return f ** 3 if f ** 3 > 0.008856 else (f - 16 / 116) / 7.787
    X, Y, Z = inv(fx) * 0.9505, inv(fy), inv(fz) * 1.089
    m = np.array([[3.2406, -1.5372, -0.4986], [-0.9689, 1.8758, 0.0415], [0.0557, -0.2040, 1.0570]])
    rgb = m @ np.array([X, Y, Z])
    rgb = np.where(rgb > 0.0031308, 1.055 * np.clip(rgb, 0, None) ** (1 / 2.4) - 0.055, 12.92 * rgb)
    r, g, b_ = (np.clip(rgb, 0, 1) * 255).round().astype(int)
    return '#%02x%02x%02x' % (r, g, b_)


# ------------------------------------------------------------------ flat pixel art
def mode_colour(a, mask):
    px = a[..., :3][mask].astype(int)
    if not len(px):
        return None, 0
    keys = px[:, 0] * 65536 + px[:, 1] * 256 + px[:, 2]
    v, n = np.unique(keys, return_counts=True)
    k = int(v[np.argmax(n)])
    return np.array([(k >> 16) & 255, (k >> 8) & 255, k & 255], float), int(n.max())


def drop_background(a):
    """The sheet's 64 face sits on a painted gradient: a pixel within 24 levels of its own row's edge colour is
    background, so the gradient never counts as skin or hair."""
    op = a[..., 3] > 127
    edge = a[:, 0, :3].astype(int)
    edge2 = a[:, -1, :3].astype(int)
    d1 = np.abs(a[..., :3].astype(int) - edge[:, None, :]).sum(-1)
    d2 = np.abs(a[..., :3].astype(int) - edge2[:, None, :]).sum(-1)
    return op & (d1 > 24) & (d2 > 24)


def flat_read(a, bg=False, span=26):
    """The skin and the top of the head of one flat head picture (a: uint8 RGBA). bg: drop a painted background.
    span: how many rows from the top the head can reach before the widest row is looked for (26 on the 112 body,
    the whole picture on a 64 face)."""
    H, W = a.shape[:2]
    op = drop_background(a) if bg else a[..., 3] > 127
    ys, xs = np.nonzero(op)
    if not len(ys):
        return None
    L3 = lab(a.astype(float))
    t0 = int(ys.min())
    # the head: from the top to the neck, the narrowest row below the head's widest row (before the shoulders)
    w = op.sum(1)
    y_end = min(H - 1, t0 + span)
    yw = t0 + int(np.argmax(w[t0:y_end + 1]))
    head_bottom = H - 1
    lo = None
    for y in range(yw + 1, min(H, yw + 16)):
        if w[y] == 0:
            head_bottom = y - 1
            break
        if lo is None or w[y] < w[lo]:
            lo = y
        elif w[y] > 1.6 * w[lo] and lo is not None:
            head_bottom = lo
            break
    else:
        if span < H and lo is not None:
            head_bottom = lo
    head = op.copy()
    head[:t0] = False
    head[head_bottom + 1:] = False
    hy, hx = np.nonzero(head)
    cx = float(np.median(hx))
    top_rows = head & (np.arange(H)[:, None] <= t0 + max(2, (head_bottom - t0) // 6))
    top_c, _ = mode_colour(a, top_rows)
    if span < H:
        # THE BODY: every look is baked on the same 112 rig, so its face sits at the same place under the top of the
        # head: the cheek window is 8 to 17 rows under the head's top, 5 columns either side of the head's middle
        # (read off the zoomed heads of all 26 looks; a hat brim, a hood or long hair never reaches it). The shoulders
        # can not pull the head box down here, which is how the neck search lost five capped heads.
        cx0 = float(np.median(np.nonzero(op[t0:t0 + 12])[1]))
        win = op & (np.arange(H)[:, None] >= t0 + 8) & (np.arange(H)[:, None] <= t0 + 17) & \
            (np.abs(np.arange(W)[None, :] - cx0) <= 5)
        # and no colour the hat or hair is painted in: every colour seen 3 times or more in the head's top 4 rows
        rgb = a[..., :3].astype(int)
        key = rgb[..., 0] * 65536 + rgb[..., 1] * 256 + rgb[..., 2]
        crown = op & (np.arange(H)[:, None] <= t0 + 3)
        v, c = np.unique(key[crown], return_counts=True)
        win &= ~np.isin(key, v[c >= 3])
        skin_c, n = mode_colour(a, win)
        if skin_c is None:
            return None
        sk = lab(skin_c[None, None, :])[0, 0]
        tp = lab(top_c[None, None, :])[0, 0] if top_c is not None else None
        return {'skin_lab': [float(v) for v in sk], 'top_lab': None if tp is None else [float(v) for v in tp],
                'how': 'cheeks: the face window under the top of the head (%d of %d px the one colour)' % (
                    n, int(win.sum())), 'mouth': None, 'head_rows': [t0, t0 + 17], 'window': [t0 + 8, t0 + 17, cx0]}
    # the mouth: the reddest pixels in the lower half of the head, near its middle
    lower = head & (np.arange(H)[:, None] >= t0 + (head_bottom - t0) * 0.45) & \
        (np.abs(np.arange(W)[None, :] - cx) <= (hx.max() - hx.min()) * 0.3 + 1)
    red = lower & (L3[..., 1] > 14) & (L3[..., 1] > L3[..., 2]) & (L3[..., 0] > 25)
    how = 'cheeks between the eyes and the mouth'
    skin_c = None
    if red.sum() >= 2:
        ry, rx = np.nonzero(red)
        my, mx = float(np.median(ry)), float(np.median(rx))
        hw = max(3, int((hx.max() - hx.min()) * 0.32))
        band_ = head & (np.arange(H)[:, None] >= int(my) - max(4, int((head_bottom - t0) * 0.28))) & \
            (np.arange(H)[:, None] <= int(my) - 1) & (np.abs(np.arange(W)[None, :] - mx) <= hw) & ~red
        if top_c is not None:
            band_ &= np.abs(a[..., :3].astype(int) - top_c.astype(int)).sum(-1) > 0
        skin_c, n = mode_colour(a, band_)
        mouth = (round(my, 1), round(mx, 1))
    else:
        mouth = None
    if skin_c is None:
        how = 'no mouth found: the head\'s most common colour that is not its top'
        m2 = head & ~top_rows
        if top_c is not None:
            m2 &= np.abs(a[..., :3].astype(int) - top_c.astype(int)).sum(-1) > 0
        skin_c, n = mode_colour(a, m2)
    if skin_c is None:
        return None
    sk = lab(skin_c[None, None, :])[0, 0]
    tp = lab(top_c[None, None, :])[0, 0] if top_c is not None else None
    return {'skin_lab': [float(v) for v in sk], 'top_lab': None if tp is None else [float(v) for v in tp],
            'how': how, 'mouth': mouth, 'head_rows': [t0, head_bottom]}


# ------------------------------------------------------------------ the 3D portrait
def portrait_read(look):
    s = {}
    for k in KEYS:
        f = P('%s/%s/%s_128.png' % (CREW, look, k))
        s[k] = np.array(Image.open(f).convert('RGBA')).astype(float) if os.path.exists(f) else None
    if s['rest'] is None:
        return None
    m = S.measure(s)
    mask = m.get('_skin_mask')
    r = s['rest']
    L3 = lab(r)
    out = {'problems': m.get('problems', [])}
    if mask is None or mask.sum() < 20:
        out['problems'].append(['skin', 'the cheeks could not be found'])
        return out
    # THE LIT HALF: the rig's one hard key light splits a cheek from L 32 to L 67 on YOU, so a median of the whole
    # cheek is mostly shadow; an eye reads skin off the lit side, and flat art's mode is its ramp's middle, so the
    # read is the median of the cheek pixels at or over the cheek's own median lightness
    lit = mask & (L3[..., 0] >= np.median(L3[..., 0][mask]))
    out['skin_lab'] = [float(v) for v in np.median(L3[lit], 0)]
    out['skin_all_L'] = round(float(np.median(L3[..., 0][mask])), 1)
    out['skin_px'] = int(mask.sum())
    # the top of the head: the painted pixels above the eyes' line by more than half the eye spacing
    op = r[..., 3] > 127
    (y1, x1), (y2, x2) = m['eyes']
    ipd = m['eye_spacing_px']
    top = op & (np.arange(r.shape[0])[:, None] < min(y1, y2) - 0.55 * ipd) & ~mask
    out['top_lab'] = [float(v) for v in np.median(L3[top], 0)] if top.sum() >= 20 else None
    out['eyes'] = m['eyes']
    out['how'] = 'the cheeks under the eyes (the star tool\'s landmarks); %d px' % int(mask.sum())
    return out


# ------------------------------------------------------------------ the pairs
def people():
    return json.load(open(P(PEOPLE + '/fight_people.json')))


def body_of(look, j=None):
    j = j or people()
    a = np.array(Image.open(P(PEOPLE + '/' + j['looks'][look]['file'])).convert('RGBA'))
    return a[0:FRAME, 0:FRAME].copy(), a


def sheet_face_of(sheet, j):
    n = len(j['cols'])
    fs = j['face']['size']
    return sheet[0:fs, n * FRAME:n * FRAME + fs].copy()


def corner_bg(a):
    c = [a[0, 0, :3], a[0, -1, :3]]
    return [int(v) for v in c[0]]


def compare(body, face):
    """The legs of one face against its body."""
    legs = []
    bs, fs = body['skin_lab'], face['skin_lab']
    bt, ft = ita(bs[0], bs[2]), ita(fs[0], fs[2])
    dL = fs[0] - bs[0]
    db = abs(band_i(bt) - band_i(ft))
    ok = db <= 1 and abs(dL) <= L_TOL
    legs.append({'leg': 'skin', 'ok': ok, 'dL': round(dL, 1), 'dITA': round(ft - bt, 1), 'bands_apart': db,
                 'de2000': round(de2000(bs, fs), 1),
                 'said': 'body %s (ITA %.0f, L %.0f), face %s (ITA %.0f, L %.0f): %s' % (
                     band(bt), bt, bs[0], band(ft), ft, fs[0],
                     'the same person' if ok else ('the face is %d bands %s and %.0f L* %s' % (
                         db, 'darker' if ft < bt else 'lighter', abs(dL), 'darker' if dL < 0 else 'lighter')))})
    if body.get('top_lab') and face.get('top_lab'):
        d = de2000(body['top_lab'], face['top_lab'])
        legs.append({'leg': 'top of the head', 'ok': d <= TOP_TOL, 'de2000': round(d, 1),
                     'said': 'hair or hat %s on the body, %s on the face, %.0f apart' % (
                         lab_to_hex(body['top_lab']), lab_to_hex(face['top_lab']), d)})
    return legs


def read_files():
    j = people()
    rows = []
    for look, meta in j['looks'].items():
        b_px, sheet = body_of(look, j)
        body = flat_read(b_px)
        f1_px = sheet_face_of(sheet, j)
        face1 = flat_read(f1_px, bg=True, span=f1_px.shape[0])
        worn = meta.get('worn') if isinstance(meta.get('worn'), dict) else {}
        hat_body = bool(worn.get('head'))
        name = meta.get('name') or look
        if body and face1:
            legs = compare(body, face1)
            rows.append({'who': look, 'name': name, 'face': 'the fight sheet\'s own 64 face', 'face_src':
                         '%s/%s (x %d, y 0, 64 px)' % (PEOPLE, meta['file'], len(j['cols']) * FRAME),
                         'body_src': '%s/%s frame 0 (idle SE)' % (PEOPLE, meta['file']),
                         'body': strip(body), 'face_read': strip(face1), 'legs': legs,
                         'verdict': 'PASS' if all(l['ok'] for l in legs) else 'BACK', 'hat_on_body': hat_body,
                         'owner': 'COMBAT (rule 69 bake) / CHARACTER [one skin, one person]'})
        if os.path.exists(P('%s/%s/rest_128.png' % (CREW, look))):
            face2 = portrait_read(look)
            if body and face2 and face2.get('skin_lab'):
                legs = compare(body, face2)
                gear = None
                try:
                    gear = json.load(open(P(CREW + '/BOHEMIA_CREW_FACES.json')))['faces'][look].get('gear')
                except Exception:
                    pass
                if bool(gear) != hat_body:
                    legs.append({'leg': 'hat', 'ok': False, 'said': 'body hat %s, face hat %s' % (
                        worn.get('head'), gear)})
                rows.append({'who': look, 'name': name, 'face': 'PORTRAIT\'s fresh portrait (crew and scavenge screens)',
                             'face_src': '%s/%s/rest_128.png' % (CREW, look),
                             'body_src': '%s/%s frame 0 (idle SE)' % (PEOPLE, meta['file']),
                             'body': strip(body), 'face_read': strip(face2), 'legs': legs,
                             'verdict': 'PASS' if all(l['ok'] for l in legs) else 'BACK', 'hat_on_body': hat_body,
                             'owner': 'PORTRAIT [the face is the body\'s face] / CHARACTER [one skin, one person]'})
    return rows


def strip(r):
    o = {k: v for k, v in r.items() if not k.startswith('_')}
    if 'skin_lab' in o:
        o['skin'] = skin_of(o.pop('skin_lab'))
    if o.get('top_lab'):
        o['top'] = lab_to_hex(o.pop('top_lab'))
    return o


def read_runtime():
    """Rows from the demo's own run-time faces, written by the companion .js read (absent: nothing)."""
    if not os.path.exists(P(RUNTIME)):
        return [], None
    j = json.load(open(P(RUNTIME)))
    rows = []
    for e in j.get('pairs', []):
        fa = np.array(Image.open(P(e['face_png'])).convert('RGBA'))
        ba = np.array(Image.open(P(e['body_png'])).convert('RGBA')) if e.get('body_png') else None
        face = flat_read(fa, bg=bool(e.get('face_has_bg')), span=fa.shape[0])
        body = flat_read(ba) if ba is not None else None
        if not face:
            continue
        if body is None:
            rows.append({'who': e['who'], 'name': e.get('name', e['who']), 'face': e['face'], 'face_src': e['face_png'],
                         'body_src': None, 'face_read': strip(face), 'legs': [], 'verdict': 'NO BODY',
                         'note': e.get('note', 'the game draws no body for this face'), 'owner': e.get('owner', '')})
            continue
        legs = compare(body, face)
        rows.append({'who': e['who'], 'name': e.get('name', e['who']), 'face': e['face'], 'face_src': e['face_png'],
                     'body_src': e['body_png'], 'body': strip(body), 'face_read': strip(face), 'legs': legs,
                     'verdict': 'PASS' if all(l['ok'] for l in legs) else 'BACK', 'owner': e.get('owner', '')})
    return rows, j


# ------------------------------------------------------------------ the sheet
def font(sz):
    for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        if os.path.exists(p):
            return ImageFont.truetype(p, sz)
    return ImageFont.load_default()


def swatch(d, x, y, hexc, w=26, h=26):
    d.rectangle([x, y, x + w, y + h], fill=hexc, outline=(0, 0, 0))


def build_sheet(rows, path):
    """One line per face: the body at 2x, the face at the size the game draws it (x2 for the 64), the two skins
    as swatches, the verdict."""
    f1, f2 = font(15), font(12)
    RH = 150
    W = 1100
    H = 70 + RH * len(rows) + 40
    im = Image.new('RGB', (W, H), (34, 33, 38))
    d = ImageDraw.Draw(im)
    npass = sum(r['verdict'] == 'PASS' for r in rows)
    nback = sum(r['verdict'] == 'BACK' for r in rows)
    d.text((14, 10), 'EVERY FACE BESIDE ITS BODY: %d faces read, %d PASS, %d BACK' % (len(rows), npass, nback),
           fill=(240, 236, 220), font=font(20))
    d.text((14, 40), 'body (the fight sheet, idle, 2x)  |  face (as the game shows it)  |  body skin vs face skin',
           fill=(170, 168, 160), font=f2)
    y = 70
    for r in rows:
        d.rectangle([0, y, W, y + RH - 4], fill=(48, 46, 52) if r['verdict'] == 'PASS' else (66, 36, 36))
        if r.get('body_png_img') is not None:
            b = Image.fromarray(r['body_png_img']).resize((FRAME * 2 // 2 * 1, FRAME * 2 // 2 * 1), Image.NEAREST)
        x = 8
        if r.get('_body_img') is not None:
            b = Image.fromarray(r['_body_img'])
            bb = b.crop((24, 0, 88, 72)).resize((128, 144), Image.NEAREST)
            im.paste(bb, (x, y), bb)
        x = 150
        if r.get('_face_img') is not None:
            f = Image.fromarray(r['_face_img'])
            sc = 2 if f.size[0] <= 64 else 1
            f = f.resize((f.size[0] * sc, f.size[1] * sc), Image.NEAREST)
            im.paste(f, (x, y + (RH - 4 - f.size[1]) // 2), f)
        x = 300
        bs = r.get('body', {}).get('skin')
        fs = r['face_read'].get('skin')
        if bs:
            swatch(d, x, y + 14, bs['rgb'], 40, 40)
            d.text((x, y + 58), 'body', fill=(200, 200, 200), font=f2)
        if fs:
            swatch(d, x + 50, y + 14, fs['rgb'], 40, 40)
            d.text((x + 50, y + 58), 'face', fill=(200, 200, 200), font=f2)
        col = (150, 230, 140) if r['verdict'] == 'PASS' else (255, 120, 110) if r['verdict'] == 'BACK' else (220, 200, 120)
        d.text((x + 110, y + 8), '%s  %s' % (r['verdict'], r['name'] if r['name'] else r['who']), fill=col, font=f1)
        d.text((x + 110, y + 30), r['face'][:70], fill=(200, 196, 186), font=f2)
        ly = y + 50
        for l in r['legs'][:4]:
            d.text((x + 110, ly), ('ok   ' if l['ok'] else 'BACK ') + l['leg'] + ': ' + l['said'][:96],
                   fill=(190, 230, 180) if l['ok'] else (255, 170, 160), font=f2)
            ly += 18
        if r.get('note'):
            d.text((x + 110, ly), r['note'][:100], fill=(220, 200, 120), font=f2)
        y += RH
    d.text((14, H - 30), 'ITA = the dermatologists\' skin-tone angle from CIELAB (Chardon 1991, bands Del Bino 2006). '
           'PASS: same or next band and within 12 L*.', fill=(150, 148, 140), font=f2)
    os.makedirs(os.path.dirname(P(path)), exist_ok=True)
    im.save(P(path), 'WEBP', lossless=True)


def attach_pictures(rows):
    j = people()
    for r in rows:
        try:
            if r.get('body_src') and r['body_src'].startswith(PEOPLE):
                r['_body_img'] = body_of(r['who'], j)[0]
            elif r.get('body_src'):
                r['_body_img'] = np.array(Image.open(P(r['body_src'])).convert('RGBA'))
            src = r['face_src'].split(' (')[0]
            if src.endswith('.webp') and src.startswith(PEOPLE):
                r['_face_img'] = sheet_face_of(np.array(Image.open(P(src)).convert('RGBA')), j)
            else:
                r['_face_img'] = np.array(Image.open(P(src)).convert('RGBA'))
        except Exception as e:
            r['note'] = (r.get('note') or '') + ' picture: %s' % e


def main():
    rows = read_files()
    rt, rtj = read_runtime()
    rows += rt
    attach_pictures(rows)
    order = {'BACK': 0, 'NO BODY': 1, 'PASS': 2}
    rows.sort(key=lambda r: (order.get(r['verdict'], 3), r['who']))
    build_sheet(rows, SHEET)
    out = {'tool': 'tools/bohemia_eyes_every_face_beside_its_body_10_19_26.py', 'lane': 'eyes and ears',
           'row': '[every face beside its body]', 'rule': '120(d)', 'draft': True,
           'counts': {k: sum(r['verdict'] == k for r in rows) for k in ('PASS', 'BACK', 'NO BODY')},
           'faces_read': len(rows), 'runtime_read': (rtj or {}).get('read'),
           'rows': [{k: v for k, v in r.items() if not k.startswith('_')} for r in rows]}
    json.dump(out, open(P(OUT), 'w'), indent=1)
    print('EVERY FACE BESIDE ITS BODY: %d faces, %s' % (len(rows), out['counts']))
    for r in rows:
        print('%-7s %-22s %-48s %s' % (r['verdict'], r['who'], r['face'][:48],
                                       ' | '.join(l['said'] for l in r['legs'] if not l['ok'])[:200]))
    return 0


# ------------------------------------------------------------------ the self-test
def selftest():
    fails = []

    def check(name, ok, said):
        print('%s  %s  %s' % ('ok  ' if ok else 'FAIL', name, said))
        if not ok:
            fails.append(name)

    j = people()
    b, sheet = body_of('you', j)
    body = flat_read(b)
    check('the body skin is read off the cheeks', body is not None and body['how'].startswith('cheeks'),
          body and body['how'])
    # the same picture against itself is the same person
    legs = compare(body, body)
    check('a body passes itself', all(l['ok'] for l in legs), legs[0]['said'])
    # plant: the body's skin recoloured to a dark skin, the face left: must go BACK
    sk = np.array([int(body['skin']['rgb'][i:i + 2], 16) for i in (1, 3, 5)]) if 'skin' in body else None
    raw = flat_read(b)
    sk_rgb = None
    sl = raw['skin_lab']
    # find the exact skin pixels and paint them a Monk 9 brown (#3a2a22)
    L3 = lab(b.astype(float))
    m = (np.abs(L3 - np.array(sl)).sum(-1) < 0.5) & (b[..., 3] > 127)
    dark = b.copy()
    dark[m, :3] = [58, 42, 34]
    dbody = flat_read(dark)
    legs = compare(dbody, raw)
    check('a pale face on a planted dark body goes BACK', not legs[0]['ok'], legs[0]['said'])
    legs = compare(raw, dbody)
    check('a dark face on a pale body goes BACK', not legs[0]['ok'], legs[0]['said'])
    # a small shade step (Monk neighbours) stays PASS
    near = b.copy()
    near[m, :3] = np.clip(near[m, :3].astype(int) - 14, 0, 255)
    legs = compare(raw, flat_read(near))
    check('one shade step darker is still the same person', legs[0]['ok'], legs[0]['said'])
    # the mouth read is not the skin
    check('the mouth is found on the body', raw['mouth'] is not None, str(raw['mouth']))
    # ITA bands from the published table
    check('ITA of L 70 b 15 is light/very light', band(ita(70, 15)) in ('very light', 'light'), band(ita(70, 15)))
    check('ITA of L 30 b 15 is dark', band(ita(30, 15)) == 'dark', '%.1f %s' % (ita(30, 15), band(ita(30, 15))))
    # CIEDE2000 against Sharma's published pair 1 (50,2.6772,-79.7751) (50,0,-82.7485) = 2.0425
    d = de2000((50, 2.6772, -79.7751), (50, 0, -82.7485))
    check('CIEDE2000 matches Sharma pair 1 (2.0425)', abs(d - 2.0425) < 1e-3, '%.4f' % d)
    d = de2000((50, 2.5, 0), (73, 25, -18))
    check('CIEDE2000 matches Sharma pair 17 (27.1492)', abs(d - 27.1492) < 1e-3, '%.4f' % d)
    # a 3D portrait reads a skin
    pr = portrait_read('you')
    check('the fresh portrait\'s cheeks are found', pr is not None and pr.get('skin_lab') is not None,
          pr and pr.get('how'))
    print('%d failed' % len(fails))
    return 1 if fails else 0


if __name__ == '__main__':
    sys.exit(selftest() if '--selftest' in sys.argv else main())
