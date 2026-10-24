#!/usr/bin/env python3
"""BOHEMIA -- COOK [the map remade, in colour] (10/24/26): EVERY MAP DISTRICT PICTURE AGAIN, AND NOT ONE BEIGE.
Rule 137 (Paolo 10/24: 'the map still looks like shit, so we have to remake all the map assets, and let's be careful
having everything look like a grey yellow sand color, I don't want that to flood all of our art'); rule 128 (every asset
carries three acts: the scene is kept, an era is a re-render with its dials); rule 123/127 (no card, straight into the game).

MEASURED FIRST (tools/bohemia_cook_map_colour_spread_10_24_26.js, records/target/cook_map_colour/before/spread.json):
the grey-yellow sand family was 79% of the map's glass at the far stop, 66% at the district zoom, 46% where he opens,
40% at the near stop; green 0.3 to 2%, blue under 1.2%, red 0.1%. The 69 district pictures carry it three ways:
  1. THE SCENE: the district factory's own colours are the walkable engine's palettes, warm greys and tans
     (the suburb's yard 129,118,98, its stucco 113,108,98, its roofs 124,118,108; the mountain 116,105,89 to 79,71,61);
  2. THE RIG'S DUST: every flat top takes a sun-bleached dust of (0.66, 0.60, 0.50) linear, a pale beige;
  3. THE SNAP toward his pack's colours (0.15), and his packs are mostly tan.
This keeps the SAME GEOMETRY (the factory's scene, captured face by face, rendered through the master rig by
tools/bohemia_cook_the_map_through_the_rig_10_20_26.py, imported, never edited) and changes the three:
  1. every sand-family face takes its colour from the district's THEME (banks/BOHEMIA_MAP_COLOUR_DIALS_10_24_26.json):
     the ground a mosaic in metres (lawns gone wild, red gravel, grey gravel, weeds, dirt), each building its own
     stucco and its own tile (one house cream with a terracotta roof, its neighbour sage with charcoal shingle), the
     mountain banded red rock, black basalt, desert varnish and limestone by height, the water Lake Mead blue; a face
     that was not sand (the asphalt, the glass, the barn's red, the freeway's green sign) keeps its colour, a little
     more saturated so the rig's old-paint rule leaves it a colour;
  2. what lies on the free ground is ADDED to the scene (pools in the yards, palms and olive trees, creosote and
     rocks on the desert), placed where no building, road or wall stands;
  3. the dust is concrete grey, and the snap is 0.06 and leaves a coloured pixel alone.
The grime, the film, the dents, the one sun are the rig's, untouched (rule 137b: the analog horror stays in the grime,
film and hand, never as a beige wash).

  <venv>/bin/python tools/bohemia_cook_the_map_in_colour_10_24_26.py render [district ...]   (masters/<d>.png)
  python3 tools/bohemia_cook_the_map_in_colour_10_24_26.py bank [district ...]   (into the bank; then the wire and the chunker)
  python3 tools/bohemia_cook_the_map_in_colour_10_24_26.py sand [district ...]   (each master's sand share, the ledger)
The scene: records/target/cook_map_colour/scenes.pkl.gz (the capture, kept; rule 128), the dials beside it in banks/.

REFERENCE CHECK (the 9/4 standing duty): Battle Brothers' map (his 9/24 reference for the overworld): value does the
work and one saturated marker wins, but its ground is GREEN plains, darker forest, grey hills, white snow, blue water,
the steppe's tan only in the south; ours had one tan everywhere. Pocket City 2's pinch (9/30): the same city reads at
every zoom because its lots carry colour (green yards, blue pools, coloured roofs). The real valley from the air:
terracotta tile roofs, pools in every third yard, gravel yards in red and grey, golf courses gone wild, red Calico
Hills, black basalt on Frenchman and the Black Mountains, Lake Mead's bathtub ring.
REUSE CHECK (REUSE-FIRST): the factory's scenes, the map rig tool's build/camera/render/bank, the master rig's passes.
TASTE CHECK: rule 115 (the rig is the look), 121(k) (grimy Crashbox analog horror), 137 (in colour).
"""
import os, sys, json, math, pickle, gzip, hashlib, colorsys
import numpy as np

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook_the_map_through_the_rig_10_20_26 as MR

OUT = os.path.join(R, 'records/target/cook_map_colour')
SCENES = os.path.join(OUT, 'scenes.pkl.gz')
# the era's dials (rule 128): act one's by default; BOHEMIA_COLOUR_DIALS=<bank> renders another era from the same scenes
# (10/24 COOK [no rainbow]: the bright set is act three's, banks/BOHEMIA_MAP_COLOUR_DIALS_ACT3_THE_HEALED_10_24_26.json)
DIALS_FILE = os.environ.get('BOHEMIA_COLOUR_DIALS') or 'banks/BOHEMIA_MAP_COLOUR_DIALS_10_24_26.json'
DIALS = json.load(open(os.path.join(R, DIALS_FILE)))
PAL = {k: tuple(v) for k, v in DIALS['palette'].items()}
MR.OUT = OUT
MR.MASTERS = os.path.join(OUT, 'masters')
LEDGER = os.path.join(OUT, 'ledger.json')


# ------------------------------------------------------------------ colour
def _lin(c):
    c = c / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def lab(c):
    r, g, b = (_lin(float(v)) for v in c[:3])
    X = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047; Y = 0.2126 * r + 0.7152 * g + 0.0722 * b
    Z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883
    f = lambda t: t ** (1 / 3) if t > 0.008856 else 7.787 * t + 16 / 116
    L = 116 * f(Y) - 16; A = 500 * (f(X) - f(Y)); B = 200 * (f(Y) - f(Z))
    h = math.degrees(math.atan2(B, A)) % 360
    return L, math.hypot(A, B), h, Y


def sandy(c):
    """THE SAND FAMILY, the measure's own definition (tools/bohemia_cook_map_colour_spread_10_24_26.js); a warm grey
    just under its chroma floor (3 to 5) counts here too, because the rig's dust lifts it into the family"""
    L, C, h, _ = lab(c)
    return 28 <= L <= 88 and 3 <= C < 40 and 40 <= h < 110


def sat(c, k):
    h, l, s = colorsys.rgb_to_hls(*(v / 255.0 for v in c[:3]))
    r, g, b = colorsys.hls_to_rgb(h, l, min(1.0, s * k))
    return tuple(int(round(v * 255)) for v in (r, g, b))


def scaled(c, f):
    return tuple(int(max(0, min(255, round(v * f)))) for v in c[:3])


def pick(lst, key):
    return lst[int(hashlib.md5(str(key).encode()).hexdigest()[:8], 16) % len(lst)]


# ------------------------------------------------------------------ the scene's parts
def kind_of(verts, n):
    if max(p[2] for p in verts) <= 0.15: return 'flat0'
    return 'top' if abs(n[2]) > 0.7 else 'side'


def clusters(faces):
    """the buildings: faces above the plate whose footprints touch are one building (a house, its gable, its garage)"""
    idx = [i for i, (v, n, m) in enumerate(faces) if m is not None and max(p[2] for p in v) > 0.15]
    bb = {i: (min(p[0] for p in faces[i][0]) - 0.03, min(p[1] for p in faces[i][0]) - 0.03,
              max(p[0] for p in faces[i][0]) + 0.03, max(p[1] for p in faces[i][0]) + 0.03) for i in idx}
    par = {i: i for i in idx}
    def root(i):
        while par[i] != i: par[i] = par[par[i]]; i = par[i]
        return i
    order = sorted(idx, key=lambda i: bb[i][0])
    for a_i, a in enumerate(order):                          # sweep on x
        ax0, ay0, ax1, ay1 = bb[a]
        for b in order[a_i + 1:]:
            bx0, by0, bx1, by1 = bb[b]
            if bx0 > ax1: break
            if by0 <= ay1 and by1 >= ay0: par[root(a)] = root(b)
    return {i: root(i) for i in idx}


def unwrap(m):
    while isinstance(m.get('c'), dict): m = m['c']
    return m


def recolour(d, sc):
    """the factory's faces, each sand face given its theme's colour; returns the new face list and a ledger line"""
    T = DIALS['themes'][DIALS['district_theme'].get(d, 'block')]
    SP = DIALS.get('special', {}).get(d, {})
    faces = sc['faces']
    cl = clusters(faces)
    # the ground colours, largest first: the biggest takes the theme's ground, the next ones its other grounds
    area = {}
    for v, n, m in faces:
        if m is None: continue
        mm = unwrap(m); c = mm.get('c')
        if c is None or kind_of(v, n) != 'flat0': continue
        a = np.array(v, float); ar = np.linalg.norm(np.cross(a[1] - a[0], a[3] - a[0]))
        area[tuple(c[:3])] = area.get(tuple(c[:3]), 0) + ar
    grounds = [c for c in sorted(area, key=lambda c: -area[c]) if ground_like(c, T, SP)]
    gmap = {}
    more = T.get('ground_more') or [T['ground']]
    for i, c in enumerate(grounds):
        if T.get('fields'): gmap[c] = {'c': PAL[T['fields'][i % len(T['fields'])]]}
        elif i == 0: gmap[c] = dict(t='mosaic', mosaic=T['ground']['mosaic'], blob_m=T['ground']['blob_m'], seed=1)
        else:
            g = more[(i - 1) % len(more)]; gmap[c] = dict(t='mosaic', mosaic=g['mosaic'], blob_m=g['blob_m'], seed=1 + i)
    zmax = max(max(p[2] for p in v) for v, n, m in faces if m is not None)
    # per building, the reference value its sand faces are measured against (keeps the factory's lit and shaded sides)
    ref = {}
    for i, (v, n, m) in enumerate(faces):
        if i not in cl or m is None: continue
        mm = unwrap(m); c = mm.get('c') if mm.get('t') is None else mm.get('wall')
        if c is not None and sandy(c): ref.setdefault(cl[i], []).append(lab(c)[3])
    ref = {k: float(np.median(v)) for k, v in ref.items()}
    out, changed, kept = [], 0, 0
    for i, (v, n, m) in enumerate(faces):
        if m is None: out.append((v, n, m)); continue
        mm = unwrap(m); k = kind_of(v, n); key = cl.get(i, ('g', round(v[0][0]), round(v[0][1])))
        cz = sum(p[2] for p in v) / 4.0
        t = mm.get('t')
        if t == 'win':
            nm = dict(mm)
            wall = mm['wall']
            if SP.get('win_wall'): nm['wall'] = PAL[SP['win_wall']]; nm['frame'] = PAL[SP.get('win_frame', T['frame'])]
            elif sandy(wall):
                nm['wall'] = build_colour(T, 'wall', key, wall, ref.get(key), cz, zmax)
                if sandy(mm.get('frame', (0, 0, 0))): nm['frame'] = PAL[T['frame']]
                if 'boardc' in mm and sandy(mm['boardc']): nm['boardc'] = scaled(nm['wall'], 0.62)
            out.append((v, n, nm)); changed += 1; continue
        if t == 'lot':
            out.append((v, n, mm)); kept += 1; continue
        c = mm.get('c')
        if c is None: out.append((v, n, m)); kept += 1; continue
        c3 = tuple(c[:3])
        if k == 'flat0' and c3 in gmap:
            out.append((v, n, gmap[c3])); changed += 1; continue
        if k == 'flat0' and T.get('water') and c3[2] > c3[0] + 8:
            out.append((v, n, {'c': PAL['lake_deep'] if lab(c3)[0] < 34 else PAL['lake_blue']})); changed += 1; continue
        if k != 'flat0' and sandy(c3):
            out.append((v, n, {'c': build_colour(T, 'roof' if k == 'top' else 'wall', key, c3, ref.get(key), cz, zmax)}))
            changed += 1; continue
        if k == 'flat0' and SP.get('bright_flat') and lab(c3)[0] > 70:
            out.append((v, n, {'c': PAL[SP['bright_flat']]})); changed += 1; continue
        L, C, h, _ = lab(c3)
        out.append((v, n, {'c': sat(c3, float(DIALS.get('keep_sat', 1.25))) if C >= 8 else c3})); kept += 1   # act one 0.55 (rule 159)
    dressed = dress(d, sc, out, T, gmap)
    return out + dressed, dict(theme=DIALS['district_theme'].get(d, 'block'), faces=len(faces), recoloured=changed,
                               kept=kept, added=len(dressed), grounds=len(gmap))


def ground_like(c, T, SP):
    L, C, h, _ = lab(c)
    if T.get('water') and c[2] > c[0] + 8: return False
    if sandy(c): return True
    # a green gone grey (the park's 96,107,98) is a lawn the palette forgot: the same ground
    return L > 34 and 3 <= C < 16 and not T.get('rock') and 90 <= h < 200


def build_colour(T, part, key, orig, refY, cz, zmax):
    """one building, one stucco and one tile; the rock by height: basalt low, red rock through the middle, limestone on top"""
    if T.get('rock'):
        bands = T['bands']; f = min(0.999, max(0.0, cz / max(zmax, 1e-6)))
        j = int(f * len(bands) + (int(hashlib.md5(str(key).encode() + str(round(cz, 1)).encode()).hexdigest()[:4], 16) % 3 - 1) * 0.5)
        base = PAL[bands[max(0, min(len(bands) - 1, j))]]
        if part == 'wall': base = scaled(base, 0.86)
    else:
        base = PAL[pick(T[part], (key, part))]
    Y = lab(orig)[3]
    f = 1.0 if not refY else max(0.72, min(1.12, (Y / refY) ** 0.5))
    return scaled(base, f)


# ------------------------------------------------------------------ what lies on the free ground
def quad(a, b, c, d, n, m):
    return ([tuple(map(float, a)), tuple(map(float, b)), tuple(map(float, c)), tuple(map(float, d))], tuple(map(float, n)), m)


def box(x0, y0, z0, x1, y1, z1, m_top, m_side):
    F = [quad((x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1), (0, 0, 1), m_top),
         quad((x1, y0, z0), (x1, y1, z0), (x1, y1, z1), (x1, y0, z1), (1, 0, 0), m_side),
         quad((x0, y1, z0), (x0, y0, z0), (x0, y0, z1), (x0, y1, z1), (-1, 0, 0), m_side),
         quad((x1, y1, z0), (x0, y1, z0), (x0, y1, z1), (x1, y1, z1), (0, 1, 0), m_side),
         quad((x0, y0, z0), (x1, y0, z0), (x1, y0, z1), (x0, y0, z1), (0, -1, 0), m_side)]
    return F


def octo(cx, cy, r, z0, z1, m_top, m_side):
    P = [(cx + r * math.cos(math.pi / 8 + i * math.pi / 4), cy + r * math.sin(math.pi / 8 + i * math.pi / 4)) for i in range(8)]
    F = []
    for i in range(8):
        a, b = P[i], P[(i + 1) % 8]; nx, ny = (a[1] - b[1]), (b[0] - a[0]); l = math.hypot(nx, ny)
        nx, ny = -nx / l, -ny / l                                  # outward
        mx, my = (a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy
        if nx * mx + ny * my < 0: nx, ny = -nx, -ny
        F.append(quad((a[0], a[1], z0), (b[0], b[1], z0), (b[0], b[1], z1), (a[0], a[1], z1), (nx, ny, 0), m_side))
    t = [(p[0], p[1], z1) for p in P]
    for q in ((0, 1, 2, 3), (0, 3, 4, 7), (4, 5, 6, 7)):
        F.append(quad(*[t[j] for j in q], (0, 0, 1), m_top))
    return F


def dress(d, sc, faces, T, gmap):
    D = T.get('dress') or {}
    if not gmap or not any(D.get(k) for k in ('pools', 'trees', 'bushes')): return []
    k = MR.CELL_M / MR.plate_units(sc)                          # metres a factory unit
    ground = [v for v, n, m in faces if m is not None and m.get('t') == 'mosaic' and max(p[2] for p in v) <= 0.15]
    xs = [p[0] for v in ground for p in v]; ys = [p[1] for v in ground for p in v]
    if not xs: return []
    X0, Y0, X1, Y1 = min(xs), min(ys), max(xs), max(ys)
    res = 0.5 / k                                              # half a metre a cell
    W, H = int((X1 - X0) / res) + 1, int((Y1 - Y0) / res) + 1
    free = np.zeros((H, W), bool)
    def rect(v, val, grow=0.0):
        x0 = int((min(p[0] for p in v) - X0) / res - grow); x1 = int(math.ceil((max(p[0] for p in v) - X0) / res + grow))
        y0 = int((min(p[1] for p in v) - Y0) / res - grow); y1 = int(math.ceil((max(p[1] for p in v) - Y0) / res + grow))
        free[max(0, y0):max(0, y1), max(0, x0):max(0, x1)] = val
    for v in ground:
        if abs(max(p[2] for p in v) - min(p[2] for p in v)) < 1e-6: rect(v, True)
    for v, n, m in faces:                                      # anything else that stands or paves takes its room back
        if m is None or m.get('t') == 'mosaic': continue
        rect(v, False, grow=1.5 / (res * k))
    rng = np.random.RandomState(sum(map(ord, d)) * 7 + 3)
    out = []
    def place(wm, hm):
        w, h = int(math.ceil(wm / (res * k))), int(math.ceil(hm / (res * k)))
        if w >= W or h >= H: return None
        S = np.zeros((H + 1, W + 1), int); S[1:, 1:] = np.cumsum(np.cumsum(free, 0), 1)
        ok = (S[h:, w:] - S[:-h, w:] - S[h:, :-w] + S[:-h, :-w]) == w * h
        cand = np.argwhere(ok)
        if not len(cand): return None
        y, x = cand[rng.randint(len(cand))]
        free[max(0, y - 2):y + h + 2, max(0, x - 2):x + w + 2] = False
        return X0 + x * res, Y0 + y * res, X0 + (x + w) * res, Y0 + (y + h) * res
    for i in range(int(D.get('pools', 0))):
        pw, ph = rng.uniform(6.5, 9.0), rng.uniform(10.0, 14.0)
        r = place(pw, ph) if rng.rand() < 0.5 else place(ph, pw)
        if not r: break
        x0, y0, x1, y1 = r; e = 1.0 / k
        cop = {'c': PAL['coping']}; pl = D.get('pool', ['pool_blue']); wat = {'c': PAL[pl[i % len(pl)]]}
        out += [quad((x0, y0, 0.10), (x1, y0, 0.10), (x1, y1, 0.10), (x0, y1, 0.10), (0, 0, 1), cop)]
        out += [quad((x0 + e, y0 + e, 0.115), (x1 - e, y0 + e, 0.115), (x1 - e, y1 - e, 0.115), (x0 + e, y1 - e, 0.115), (0, 0, 1), wat)]
    for i in range(int(D.get('trees', 0))):
        dm = rng.uniform(6.0, 9.0); r = place(dm, dm)
        if not r: break
        x0, y0, x1, y1 = r; cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        leaf = PAL[pick(D.get('tree', ['palm']), (d, 't', i))]
        z0, z1 = rng.uniform(4.0, 7.0) / k, rng.uniform(9.0, 13.0) / k
        trunk = {'c': (92, 70, 52)}
        out += box(cx - 0.35 / k, cy - 0.35 / k, 0.0, cx + 0.35 / k, cy + 0.35 / k, z0, trunk, trunk)
        zm = z0 + (z1 - z0) * 0.62                               # a crown, not a can: a wide tier and a narrower one on it
        out += octo(cx, cy, dm / 2 / k, z0, zm, {'c': scaled(leaf, 1.0)}, {'c': scaled(leaf, 0.78)})
        out += octo(cx, cy, dm * 0.34 / k, zm, z1, {'c': scaled(leaf, 1.12)}, {'c': scaled(leaf, 0.86)})
    for i in range(int(D.get('bushes', 0))):
        dm = rng.uniform(2.5, 4.5); r = place(dm, dm)
        if not r: break
        x0, y0, x1, y1 = r; cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        col = PAL[pick(D.get('bush', ['creosote']), (d, 'b', i))]
        out += octo(cx, cy, dm / 2 / k, 0.0, rng.uniform(1.2, 2.4) / k, {'c': col}, {'c': scaled(col, 0.8)})
    return out


# ------------------------------------------------------------------ the rig, three dials turned
def install():
    import bpy
    import bohemia_cook_the_floor_not_final_10_20_26 as NF
    RIG = NF.RIG
    if getattr(RIG, '_colour_dials', False): return
    orig_mat, orig_src = MR.material_for, RIG.source_pass
    def material_for(bpy_, m, cache):
        if m.get('t') != 'mosaic': return orig_mat(bpy_, m, cache)
        key = json.dumps(m, sort_keys=True, default=str)
        if key in cache: return cache[key]
        mat = bpy_.data.materials.new('mosaic_%d' % len(cache)); mat.use_nodes = True
        nt = mat.node_tree; N = nt.nodes; L = nt.links
        b = N['Principled BSDF']; b.inputs['Roughness'].default_value = 1.0; b.inputs['Specular IOR Level'].default_value = 0.0
        tc = N.new('ShaderNodeTexCoord'); mp = N.new('ShaderNodeMapping'); s = 1.0 / float(m['blob_m'])
        mp.inputs['Scale'].default_value = (s, s, s); mp.inputs['Location'].default_value = (m['seed'] * 17.3, m['seed'] * 5.9, 0)
        L.new(tc.outputs['Object'], mp.inputs['Vector'])
        no = N.new('ShaderNodeTexNoise'); no.inputs['Scale'].default_value = 1.0; no.inputs['Detail'].default_value = float(DIALS.get('mosaic_detail', 3.0))
        no.inputs['Roughness'].default_value = 0.6; L.new(mp.outputs['Vector'], no.inputs['Vector'])
        # the noise is bunched round 0.5: spread it so the shares in the dials are roughly the shares on the ground
        sp = N.new('ShaderNodeMapRange'); sp.inputs['From Min'].default_value = 0.28; sp.inputs['From Max'].default_value = 0.72
        L.new(no.outputs['Fac'], sp.inputs['Value'])
        ramp = N.new('ShaderNodeValToRGB'); ramp.color_ramp.interpolation = DIALS.get('mosaic_interp', 'CONSTANT')
        mid = ramp.color_ramp.interpolation != 'CONSTANT'
        L.new(sp.outputs['Result'], ramp.inputs['Fac'])
        cols = m['mosaic']; tot = sum(w for _c, w in cols); acc = 0.0
        mean = np.sum([np.array(PAL[cn], float) * w for cn, w in cols], 0) / tot
        soft = float(DIALS.get('mosaic_soften', 0.0))
        tone = lambda cn: tuple(int(round(v)) for v in np.array(PAL[cn], float) * (1 - soft) + mean * soft)
        els = ramp.color_ramp.elements
        while len(els) < len(cols): els.new(0.5)
        for i, (cn, w) in enumerate(cols):
            els[i].position = (acc + (w / 2 if mid else 0)) / tot; els[i].color = MR.lin3(tone(cn)) + (1,); acc += w
        L.new(ramp.outputs['Color'], b.inputs['Base Color'])
        cache[key] = mat
        return mat
    def source_pass(objs, wear, k, seed=0):
        r = orig_src(objs, wear, k, seed)
        dust = tuple(DIALS['dust']) + (1,)
        for o in objs:
            for slot in o.material_slots:
                mt = slot.material
                if not mt or not mt.use_nodes: continue
                for nd in mt.node_tree.nodes:
                    if nd.type == 'MIX_RGB':
                        for s in ('Color1', 'Color2'):
                            v = tuple(round(x, 3) for x in nd.inputs[s].default_value)
                            if v == (0.66, 0.6, 0.5, 1.0): nd.inputs[s].default_value = dust
        return r
    MR.material_for = material_for
    RIG.source_pass = source_pass
    RIG._colour_dials = True


def finish(d, sc, fn):
    """the factory's own crop box; the snap toward his colours, 0.06, and none on a coloured pixel"""
    from PIL import Image
    import bohemia_direction_master_rig as RIG
    a = np.asarray(Image.open(fn).convert('RGBA')).astype(float)
    op = a[..., 3] > 0
    pop, _b, _n = RIG.population('prop')
    px = a[..., :3][op]; bins = np.clip((px // 8).astype(int), 0, 31)
    chroma = px.max(1) - px.min(1)
    w = float(DIALS['snap']) * np.clip(1.0 - chroma / float(DIALS['snap_keep_chroma']), 0, 1)[:, None]
    a[..., :3][op] = px + (pop[bins[:, 0], bins[:, 1], bins[:, 2]] - px) * w
    box = tuple(sc['bbox'])
    ref = os.path.join(OUT, 'ref_alpha', '%s.png' % d)
    if os.path.exists(ref):                                    # SAME ANCHOR: the crop that lays the new picture on the old one's
        ra = np.asarray(Image.open(ref)) > 0                   # pixels (the capture's alpha fit is 1 to 2 px off on a rig picture)
        best = None
        for dy in range(-4, 5):
            for dx in range(-4, 5):
                x0, y0 = box[0] + dx, box[1] + dy
                if x0 < 0 or y0 < 0 or x0 + ra.shape[1] > op.shape[1] or y0 + ra.shape[0] > op.shape[0]: continue
                w = op[y0:y0 + ra.shape[0], x0:x0 + ra.shape[1]]; iou = (w & ra).sum() / max(1, (w | ra).sum())
                if best is None or iou > best[0]: best = (iou, x0, y0)
        if best: box = (best[1], best[2], best[1] + ra.shape[1], best[2] + ra.shape[0]); ledger_put(d, dict(register_iou=round(float(best[0]), 4)))
    im = Image.fromarray(a.round().clip(0, 255).astype(np.uint8), 'RGBA').crop(box)
    assert im.size == (sc['bank_w'], sc['bank_h']), (im.size, sc['bank_w'], sc['bank_h'])
    os.makedirs(MR.MASTERS, exist_ok=True)
    out = os.path.join(MR.MASTERS, '%s.png' % d); im.save(out, optimize=True)
    return out


def sand_share(img):
    """the measure's sand family on a picture's opaque pixels"""
    a = np.asarray(img.convert('RGBA')).astype(float); px = a[..., :3][a[..., 3] > 127] / 255.0
    lin = np.where(px <= 0.04045, px / 12.92, ((px + 0.055) / 1.055) ** 2.4)
    M = np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]])
    XYZ = lin @ M.T / np.array([0.95047, 1.0, 1.08883])
    f = np.where(XYZ > 0.008856, np.cbrt(XYZ), 7.787 * XYZ + 16 / 116)
    L = 116 * f[:, 1] - 16; A = 500 * (f[:, 0] - f[:, 1]); B = 200 * (f[:, 1] - f[:, 2])
    C = np.hypot(A, B); h = np.degrees(np.arctan2(B, A)) % 360
    s = (L >= 30) & (L <= 86) & (C >= 5) & (C < 40) & (h >= 45) & (h < 105)
    g = (L >= 30) & (C >= 5) & (h >= 105) & (h < 170); bl = (L >= 30) & (C >= 5) & (h >= 170) & (h < 265)
    r = (L >= 30) & (C >= 5) & ((h < 45) | (h >= 330))
    n = max(1, len(L))
    return dict(sand=round(float(s.sum()) / n, 4), green=round(float(g.sum()) / n, 4), blue=round(float(bl.sum()) / n, 4),
                red=round(float(r.sum()) / n, 4))


def load_scenes():
    if not os.path.exists(SCENES):
        raw = open(os.path.join(R, 'records/target/cook_map_rig/scenes.pkl'), 'rb').read()
        os.makedirs(OUT, exist_ok=True)
        with gzip.open(SCENES, 'wb', compresslevel=9) as f: f.write(raw)
    with gzip.open(SCENES, 'rb') as f: return pickle.load(f)


def ledger_put(d, row):
    import fcntl                                               # two render queues share the ledger (10/24 [no rainbow])
    with open(LEDGER + '.lock', 'w') as lk:
        fcntl.flock(lk, fcntl.LOCK_EX)
        L = json.load(open(LEDGER)) if os.path.exists(LEDGER) else {}
        L.setdefault(d, {}).update(row)
        json.dump(L, open(LEDGER, 'w'), indent=1, sort_keys=True)


if __name__ == '__main__':
    a = sys.argv[1:]
    cmd, names = a[0], a[1:]
    if cmd == 'render':
        install()
        S = load_scenes()
        by = {sc['district']: sc for sc in S}
        for d in (names or [sc['district'] for sc in S]):
            sc = dict(by[d]); faces, info = recolour(d, sc); sc['faces'] = faces
            fn = MR.render(d, sc)
            out = finish(d, sc, fn)
            from PIL import Image
            info['sand_after'] = sand_share(Image.open(out))
            ledger_put(d, info)
            print('  master', d, json.dumps(info), flush=True)
    elif cmd == 'finish':
        S = load_scenes()
        for sc in S:
            fn = os.path.join(OUT, 'render', '%s.png' % sc['district'])
            if (names and sc['district'] not in names) or not os.path.exists(fn): continue
            print('  master', sc['district'], finish(sc['district'], sc, fn), flush=True)
    elif cmd == 'bank':
        done = MR.to_bank(names or None)
        bank = json.load(open(MR.BANK))
        for h in bank['heroes']:
            if h['district'] in done:
                h['in_colour'] = '10/24 COOK [no rainbow] (rule 159): the scene through the rig with ' + DIALS_FILE + ' (era ' + str(DIALS.get('era')) + ', tools/bohemia_cook_the_map_in_colour_10_24_26.py)'
        json.dump(bank, open(MR.BANK, 'w'))
    elif cmd == 'sand':
        import base64, io
        from PIL import Image
        bank = json.load(open(MR.BANK))
        for h in bank['heroes']:
            if names and h['district'] not in names: continue
            print('  %-12s %s' % (h['district'], sand_share(Image.open(io.BytesIO(base64.b64decode(h['b64']))))), flush=True)
    sys.stdout.flush(); os._exit(0)
