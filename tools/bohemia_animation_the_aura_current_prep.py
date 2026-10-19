#!/usr/bin/env python3
"""BOHEMIA -- ANIMATION [the aura of the one you control], CANDIDATE C, THE CURRENT: hand-made stop-motion electricity
round a standing man, MODELLED AT THE SOURCE IN BLENDER and rendered through DIRECTION's master rig unchanged (rule 115c:
everything from the same source; rule 108 (a): no pixel drawn in code; rule 115d: the clay look, matte, one hard sun,
frame-stepped, no glow, no blur). His words (10/18): 'when you're controlling a person there should be some aura, fifth
dimension, electric, analog horror'. His NO (10/17) on the blue and orange lines round people is the line this does not
cross: NOTHING TRACES THE SILHOUETTE. Every arc crosses the body and leaves it, or leaps from the ground to a hand, a hip,
a knee, the crown; none runs along the outline.

WHAT IT IS MADE OF (the Crashbox way: a thing an animator could bend on a desk):
  * BENT WIRE AND CRUMPLED FOIL: every arc is a zigzag polyline (segments SEG cm, sideways kicks JIT cm, mostly
    alternating, in 3D so every facing sees its own zigzag) swept into a slightly flat ribbon THICK cm across (FLAT of that
    deep), its section twisting and crumpling along the length like foil; long arcs throw FORKS short dead-end branches.
    Every main stroke wears the style palette's glint (#dff0eb, records/target/BOHEMIA_STYLE_PALETTE.json glass_eye) and
    every fork its chrome (#b9bdc1); no purple (PURPLE RESERVATION), no saturated blue. The rig makes it matte and wears it.
  * THE OCCLUDER: a 1.72 m stand-in man (a rounded body 0.4 wide and 0.26 deep, arms, a neck, a 0.25 m head) so an arc
    BEHIND the body is hidden by a body; the bake throws its pixels away (object id), and it carries four 1 cm ground
    markers at +-R so the rig's ground centre (the middle of the model's box) is the stand-in's feet centre exactly.
  * ONE CLIP, 'Arcs', 12 KEYS (one 4-beat bar, three keys a beat at 120 BPM, the men's grid): a REPLACEMENT animation, a
    new seeded set of arcs every key, shown and hidden by STEP (constant) scale keys: an arc is at full size only in its
    key's window (frames 4k+1 to 4k+3 of 0..48, the rig samples frame 4k+2) and 1/1000 of it otherwise, shrunk into a
    speck inside the stand-in's belly (never exactly 0: the rig pins held parts by their world matrix, and a zero matrix
    has no inverse). FRAME 0 IS THE ASSEMBLY FRAME: every arc at full size, because the rig measures the model (its box,
    its ground centre) and sizes the wear and the dents by each part's world scale on its still frame (--still rest is the
    clip's first frame), and no key ever samples frame 0. Key 0 (the one) is the biggest, a ground-to-crown arc and three
    more; keys 3, 6, 9 (the other beats) three arcs with one ground-to-hand; the off-beat keys one or two small arcs.
    No shape repeats on two keys running, nor a kind of arc.

THE THREE PASSES (10/19, the brief's limit; each one the rig unchanged, about 3 minutes, then the bake's sheet over the
crewman cast_poncho, LOOKED AT; scratch outside the repo):
  1. The brief's numbers. Read as crackling wire, never an outline (the arcs touch 3 to 6 percent of his outline on
     average, 26.5 at most), but: every bow came out half (a quadratic's middle sits half way to its control point), so the
     bar's big ground-to-crown arc climbed his chest like a seam in S; the off-beats were nearly empty (6 to 25 px a key:
     the hand-to-hip crawl hid behind the arm); ground-to-hand arcs stood beside the leg.
  2. The bow doubled (BOW_GAIN), the crown arc swung past the far arm, a FAR-FOOT ground-to-hand that crosses the shins,
     two small arcs on every off-beat (37 to 59 px) with the crawl bowed out past the arm. Read as electricity crawling on
     him; left: the crown arc stood up beside him from shoulder to hip in S and SW (a bracket), arcs behind the stand-in's
     small head showed through the crewman's big hair as dark dashes, and the wire was grey (median value 131 of 255).
  3. THE KEPT ONE: the crown arc a Z (ground, across the shins to just past the far hip, back across the chest to the
     crown); ground-to-hand from in front of or behind the feet with a smaller bulge; the stand-in's head 0.25 m across;
     every main stroke the glint (median 157, under 80 value 6 percent, was 11). Stopped there (the brief: three passes).

THEN DIRECTION's rig, unchanged (the command is printed at the end), and tools/bohemia_animation_the_aura_current_bake.py
keeps only the arcs' pixels (the rig's object-id pass) and packs the sheet for the VOTE page.

REFERENCE CHECK (the 9/4 standing duty): the 1.72 m man is the ruler (records/BOHEMIA_THE_BODY_IN_METERS_10_13_26.md); the
crewman cast_poncho (records/target/portrait/rig/crew/cast_poncho) is the body it is laid on in the check sheet; the
style palette's chrome and glass ramps are the colour. No reference game.
Run: <venv with bpy 4.2>/bin/python tools/bohemia_animation_the_aura_current_prep.py [--seed 3]
"""
import os, sys, math

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'reference/models/bohemia/aura_current.glb')
SEED = int(sys.argv[sys.argv.index('--seed') + 1]) if '--seed' in sys.argv else 3

# THE SHAPE KNOBS (metres). Pass 1 is the brief's numbers; what changed between passes is written beside each.
SEG = (0.06, 0.12)        # zigzag segment length
JIT = (0.03, 0.08)        # sideways kick at each bend
ALT = 0.75                # the chance the next kick goes the other way (a zigzag, not a wander)
THICK = (0.04, 0.055)     # ribbon width (pass 4, ANIMATION 10/19: 2.5-3.5 cm drew 1-2 px and, filmed on the fight, the weakest beat showed 176 px, under twice the tape corners it joins; 4-5.5 cm is 2-3 px)
FLAT = 0.6                # ribbon depth as a share of its width (slightly flattened)
CRUMPLE = 0.22            # +- share of the section's radius pushed in or out per vertex (crumpled foil)
TWIST = 0.7               # radians a ring the flat section may turn (foil twisting)
FORKS = (1, 2)            # forks on an arc longer than FORK_MIN
FORK_MIN = 0.45
FORK_LEN = (0.10, 0.22)
BULGE = (0.06, 0.14)      # how far a ground-to-hand arc bows out (pass 1 and 2: 0.10 to 0.22, a bracket beside the leg)
BOW_GAIN = 1.0            # pass 1 bent every arc half its bow (the control point was not doubled); 1.0 is the bow as written
TOP = 1.72                # the man's height: nothing goes over it, so --real-height 1.72 keeps scale 1
HIDE = 1e-3               # the hidden scale (a speck inside the belly)
SPECK = (0.0, 0.0, 0.95)  # every arc's object origin: where it shrinks to, inside the stand-in's belly
FRAMES_PER_KEY, KEYS = 4, 12

# the palette (sRGB hex -> linear for Blender's base colour)
CHROME, GLINT = '#b9bdc1', '#dff0eb'

# THE ANCHORS (Blender axes, the man faces -Y: his front is toward the rig's camera in facing S). side +1 is +X.
def hand(s): return (0.27 * s, -0.02, 0.85)
def hip(s): return (0.17 * s, 0.0, 0.98)
def knee(s): return (0.11 * s, -0.06, 0.50)
def shoulder(s): return (0.21 * s, 0.0, 1.42)
def ear(s): return (0.10 * s, 0.0, 1.55)
CROWN = (0.0, 0.0, 1.69)

# THE BAR: what each key throws (type, side, front or back of the body). The one (key 0) the biggest; the other beats
# (3, 6, 9) three arcs with a ground-to-hand; the off-beats one or two small ones. Two keys running never share a shape
# (nor, from pass 2, a kind of arc: the off-beats were given two small arcs each, and the kinds rotate round the bar).
PLAN = {
    0: [('ground_crown', +1, 'front'), ('ground_hand', -1, 'back'), ('shoulder_head', -1, 'front'), ('crown_spark', +1, 'back')],
    1: [('hand_hip', +1, 'front'), ('ground_spark', -1, 'back')],
    2: [('shoulder_head', +1, 'back'), ('crown_spark', -1, 'front')],
    3: [('ground_hand_cross', +1, 'front'), ('ground_knee', -1, 'front'), ('hand_hip_cross', -1, 'front')],
    4: [('ground_spark', +1, 'front'), ('shoulder_head', -1, 'back')],
    5: [('crown_spark', +1, 'back'), ('hand_hip', -1, 'front')],
    6: [('ground_hand', -1, 'front'), ('ground_hip', +1, 'back'), ('shoulder_head', +1, 'front')],
    7: [('hand_hip', -1, 'back'), ('ground_spark', +1, 'front')],
    8: [('crown_spark', -1, 'front'), ('shoulder_head', +1, 'front')],
    9: [('ground_hand_cross', +1, 'back'), ('ground_knee', -1, 'front'), ('ground_hip', -1, 'front')],
    10: [('shoulder_head', -1, 'front'), ('hand_hip', +1, 'back')],
    11: [('ground_spark', -1, 'back'), ('ground_spark', +1, 'front')],
}


def lin(hexc):
    c = [int(hexc[i:i + 2], 16) / 255.0 for i in (1, 3, 5)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c) + (1.0,)


def ring_point(rng, s, depth, r=(0.32, 0.55), ang=(15, 70)):
    """a ground point on the ring round the feet, on the side s and toward the front (-Y) or the back (+Y)"""
    import numpy as np
    a0 = math.radians(rng.uniform(*ang))             # degrees off the side, toward front or back
    ang = a0 if depth == 'back' else -a0
    rad = rng.uniform(*r)
    return np.array([s * rad * math.cos(ang), rad * math.sin(ang), 0.0])


def anchors(kind, s, depth, rng):
    """(start, end, bow, via) for one arc: bow is the offset of the bend from the straight line's middle; via, when
    given, is a (waypoint, second bow) the arc passes through, a Z of two bends"""
    import numpy as np
    dy = -1.0 if depth == 'front' else 1.0
    A = lambda p: np.array(p, float)
    if kind == 'ground_crown':
        # pass 2: the swing to the far side doubled and the lean toward the camera cut (pass 1's middle sat on the chest,
        # a seam up the front in S, and ran beside the body in E): it now crosses the body, leaves it past the far arm,
        # and in the side views converges on the head from the ground in front of him
        # pass 3: A Z (pass 2's far-side swing stood up beside him from the shoulder to the hip in S and SW, a bracket):
        # from the ground across the shins to just past the far hip, then back across the chest to the crown; it crosses
        # the body twice and leaves it once, at hip height
        g = ring_point(rng, s, depth, (0.38, 0.52)); e = A(CROWN)
        w = A((-s * rng.uniform(0.34, 0.40), dy * rng.uniform(0.10, 0.15), rng.uniform(0.62, 0.80)))
        return g, w, A((0.0, dy * 0.04, 0.0)), (e, A((0.0, dy * rng.uniform(0.12, 0.17), 0.0)))
    elif kind == 'ground_hand':
        # pass 3: from the ground in front of or behind the feet (35 to 75 degrees off the side, was 15 to 70) and a
        # smaller bulge (BULGE), so it climbs to the hand on a slant instead of standing beside the leg like a bracket
        g = ring_point(rng, s, depth, ang=(35, 75)); e = A(hand(s))
        bow = A((s * rng.uniform(*BULGE), dy * rng.uniform(0.08, 0.16), 0.0))
    elif kind == 'ground_hand_cross':
        # pass 2: from the FAR foot across the shins to the hand (pass 1's same-side arcs ran up beside the leg)
        g = ring_point(rng, -s, depth, (0.32, 0.45)); e = A(hand(s))
        bow = A((0.0, dy * rng.uniform(0.12, 0.18), rng.uniform(-0.05, 0.05)))
    elif kind == 'ground_knee':
        g = ring_point(rng, s, depth, (0.32, 0.45)); e = A(knee(s))
        bow = A((s * rng.uniform(0.04, 0.10), dy * rng.uniform(0.10, 0.18), 0.0))
    elif kind == 'ground_hip':
        g = ring_point(rng, -s, depth, (0.35, 0.5)); e = A(hip(s))                       # from the far foot, across the legs
        bow = A((0.0, dy * rng.uniform(0.22, 0.30), 0.0))
    elif kind == 'hand_hip':
        # pass 2: bowed out past the arm and off the body (pass 1's crawl hid behind the arm: 6 to 10 px a key)
        g = A(hand(s)); e = A(hip(s)) + A((0, dy * 0.10, 0))
        bow = A((s * rng.uniform(0.08, 0.12), dy * rng.uniform(0.12, 0.16), rng.uniform(-0.04, 0.04)))
    elif kind == 'hand_hip_cross':
        g = A(hand(s)); e = A(hip(-s))                                                    # across the belly, in front
        bow = A((0.0, dy * rng.uniform(0.18, 0.24), rng.uniform(0.04, 0.10)))
    elif kind == 'shoulder_head':
        g = A(shoulder(s)); e = A(ear(-s)) if rng.random() < 0.5 else A(CROWN)
        bow = A((s * rng.uniform(0.0, 0.06), dy * rng.uniform(0.14, 0.20), rng.uniform(0.0, 0.05)))
    elif kind == 'crown_spark':
        g = A(CROWN); e = g + A((s * rng.uniform(0.13, 0.19), dy * rng.uniform(0.04, 0.09), -rng.uniform(0.06, 0.11)))
        bow = A((s * 0.03, dy * 0.02, 0.01))
    elif kind == 'ground_spark':
        g = ring_point(rng, s, depth, (0.34, 0.5)); t = np.array([-g[1], g[0], 0.0]); t /= np.linalg.norm(t)
        e = g + t * rng.uniform(0.15, 0.25) * (1 if rng.random() < 0.5 else -1)
        bow = A((0, 0, rng.uniform(0.09, 0.14))) + g / np.linalg.norm(g) * 0.05
    else:
        raise SystemExit('no arc kind %s' % kind)
    return g, e, bow, None


def zigzag(rng, a, b, bow, seg=SEG, jit=JIT):
    """the bent wire: a bowed curve from a to b (its middle bow off the straight line), cut into seg-long pieces, each
    bend kicked sideways"""
    import numpy as np
    c = (a + b) / 2 + 2 * BOW_GAIN * bow   # a quadratic's middle sits half way to its control point (pass 1 had no 2: every bow was half)
    t = np.linspace(0, 1, 200)[:, None]
    P = (1 - t) ** 2 * a + 2 * (1 - t) * t * c + t ** 2 * b
    d = np.r_[0, np.cumsum(np.linalg.norm(np.diff(P, axis=0), axis=1))]
    L = d[-1]; marks = [0.0]
    while marks[-1] + seg[0] < L:
        marks.append(marks[-1] + rng.uniform(*seg))
    if L - marks[-1] < seg[0] * 0.6 and len(marks) > 1: marks.pop()
    marks.append(L)
    pts = np.array([np.interp(m, d, P[:, k]) for m in marks for k in range(3)]).reshape(-1, 3)
    sign = 1.0 if rng.random() < 0.5 else -1.0
    out = pts.copy()
    for i in range(1, len(pts) - 1):
        tan = pts[i + 1] - pts[i - 1]; tan /= np.linalg.norm(tan)
        ref = np.array([0, 0, 1.0]) if abs(tan[2]) < 0.9 else np.array([1.0, 0, 0])
        n1 = np.cross(tan, ref); n1 /= np.linalg.norm(n1); n2 = np.cross(tan, n1)
        if rng.random() < ALT: sign = -sign
        out[i] = pts[i] + n1 * sign * rng.uniform(*jit) + n2 * rng.uniform(-0.5, 0.5) * jit[1]
    return out, L


def fork(rng, pts):
    """a short dead-end branch off a bend between 30 and 75 percent of the way"""
    import numpy as np
    i = int(rng.integers(max(1, int(len(pts) * 0.3)), max(2, int(len(pts) * 0.75))))
    i = min(i, len(pts) - 2)
    tan = pts[i + 1] - pts[i - 1]; tan /= np.linalg.norm(tan)
    r = rng.normal(size=3); r -= tan * (r @ tan); r /= np.linalg.norm(r)
    phi = math.radians(rng.uniform(35, 65))
    d = tan * math.cos(phi) + r * math.sin(phi)
    L = rng.uniform(*FORK_LEN)
    end = pts[i] + d * L
    f, _ = zigzag(rng, pts[i], end, r * 0.02, seg=(0.05, 0.08), jit=(JIT[0] * 0.6, JIT[1] * 0.6))
    return f


def clampz(pts, rad):
    import numpy as np
    pts = pts.copy(); pts[:, 2] = np.clip(pts[:, 2], rad, TOP - 0.004 - rad)
    return pts


def tube(rng, pts, rad, taper_end=False, ns=6):
    """the ribbon: a flat section (rad wide, rad*FLAT deep) swept along the wire by a parallel frame, twisting and
    crumpling ring to ring; closed at both ends, an open spark end pinched to a point"""
    import numpy as np
    n = len(pts)
    tans = np.zeros_like(pts)
    for i in range(n):
        a = pts[min(i + 1, n - 1)] - pts[max(i - 1, 0)]; tans[i] = a / np.linalg.norm(a)
    ref = np.array([0, 0, 1.0]) if abs(tans[0][2]) < 0.9 else np.array([1.0, 0, 0])
    u = np.cross(tans[0], ref); u /= np.linalg.norm(u)
    verts, faces = [], []
    tw = rng.uniform(0, math.pi)
    for i in range(n):
        if i:
            u = u - tans[i] * (u @ tans[i]); u /= np.linalg.norm(u)    # parallel transport
        v = np.cross(tans[i], u)
        tw += rng.uniform(-TWIST, TWIST)
        uu = u * math.cos(tw) + v * math.sin(tw); vv = np.cross(tans[i], uu)
        k = 1.0
        if taper_end and i == n - 1: k = 0.3
        thick = rad * k * rng.uniform(0.85, 1.15)
        for j in range(ns):
            a = 2 * math.pi * j / ns
            cr = 1.0 + rng.uniform(-CRUMPLE, CRUMPLE)
            verts.append(pts[i] + uu * math.cos(a) * thick * cr + vv * math.sin(a) * thick * FLAT * cr)
    for i in range(n - 1):
        for j in range(ns):
            a, b = i * ns + j, i * ns + (j + 1) % ns
            faces.append((a, b, b + ns, a + ns))
    c0 = len(verts); verts.append(pts[0]); c1 = len(verts); verts.append(pts[-1])
    for j in range(ns):
        faces.append((c0, (j + 1) % ns, j))
        faces.append((c1, (n - 1) * ns + j, (n - 1) * ns + (j + 1) % ns))
    return np.array(verts), faces


def build_arc(key, idx, kind, s, depth):
    """one arc object's mesh (wire plus forks), in world metres"""
    import numpy as np
    rng = np.random.default_rng(SEED * 1000 + key * 37 + idx * 7)
    a, b, bow, via = anchors(kind, s, depth, rng)
    rad = rng.uniform(*THICK) / 2.0
    pts, L = zigzag(rng, a, b, bow)
    if via is not None:
        p2, L2 = zigzag(rng, b, via[0], via[1]); pts = np.vstack([pts, p2[1:]]); L += L2
    pts = clampz(pts, rad)
    V, F = tube(rng, pts, rad, taper_end=kind in ('crown_spark',))
    main = len(F)
    if L > FORK_MIN:
        for _ in range(int(rng.integers(FORKS[0], FORKS[1] + 1))):
            fp = clampz(fork(rng, pts), rad * 0.75)
            v2, f2 = tube(rng, fp, rad * 0.75, taper_end=True)
            F += [tuple(x + len(V) for x in f) for f in f2]; V = np.vstack([V, v2])
    V[:, 2] = np.clip(V[:, 2], 0.0, TOP - 0.003)   # the crumple may poke a millimetre under the ground or over the head: flattened onto it
    F = [(f, 0 if n < main else 1) for n, f in enumerate(F)]   # the main stroke wears the glint (0), the forks the chrome (1)
    return V, F, dict(kind=kind, side=s, depth=depth, length_m=round(float(L), 3), segments=len(pts) - 1, width_cm=round(rad * 200, 1))


def occluder_mesh(R):
    """the stand-in man: a rounded body (lathe of flat ellipses), two arms, a neck, a head sphere, and four 1 cm ground
    markers at +-R that only square the model's box on the feet"""
    import numpy as np
    V, F = [], []
    def add(vs, fs):
        o = len(V); V.extend(vs); F.extend([tuple(i + o for i in f) for f in fs])
    # the body: (z, half width, half depth, front shift)
    prof = [(0.0, 0.13, 0.12, -0.03), (0.03, 0.15, 0.13, -0.03), (0.10, 0.14, 0.10, -0.01), (0.45, 0.15, 0.10, 0.0),
            (0.80, 0.18, 0.11, 0.0), (0.95, 0.19, 0.12, 0.0), (1.10, 0.17, 0.11, 0.0), (1.28, 0.19, 0.13, 0.0),
            (1.40, 0.20, 0.12, 0.0), (1.45, 0.16, 0.10, 0.0), (1.48, 0.07, 0.06, 0.0)]
    ns = 24; vs, fs = [], []
    for z, w, d, y0 in prof:
        for j in range(ns):
            a = 2 * math.pi * j / ns; vs.append((w * math.cos(a), y0 + d * math.sin(a), z))
    for i in range(len(prof) - 1):
        for j in range(ns):
            a, b = i * ns + j, i * ns + (j + 1) % ns; fs.append((a, b, b + ns, a + ns))
    c0 = len(vs); vs.append((0, -0.03, 0.0)); c1 = len(vs); vs.append((0, 0, 1.48))
    for j in range(ns):
        fs.append((c0, (j + 1) % ns, j)); fs.append((c1, (len(prof) - 1) * ns + j, (len(prof) - 1) * ns + (j + 1) % ns))
    add(vs, fs)
    def capsule(p0, p1, r0, r1, nr=10, nl=8):
        p0, p1 = np.array(p0, float), np.array(p1, float); ax = p1 - p0; L = np.linalg.norm(ax); ax /= L
        u = np.cross(ax, [0, 0, 1.0] if abs(ax[2]) < 0.9 else [1.0, 0, 0]); u /= np.linalg.norm(u); v = np.cross(ax, u)
        vs, fs, rows = [], [], []
        for h, r in [(-r0 * 0.7, r0 * 0.7)] + [(t * L, r0 + (r1 - r0) * t) for t in np.linspace(0, 1, nl)] + [(L + r1 * 0.7, r1 * 0.7)]:
            rows.append(len(vs))
            for j in range(nr):
                a = 2 * math.pi * j / nr; vs.append(tuple(p0 + ax * h + (u * math.cos(a) + v * math.sin(a)) * r))
        for i in range(len(rows) - 1):
            for j in range(nr):
                a, b = rows[i] + j, rows[i] + (j + 1) % nr; fs.append((a, b, b + nr, a + nr))
        e0 = len(vs); vs.append(tuple(p0 - ax * r0)); e1 = len(vs); vs.append(tuple(p1 + ax * r1))
        for j in range(nr):
            fs.append((e0, rows[0] + (j + 1) % nr, rows[0] + j)); fs.append((e1, rows[-1] + j, rows[-1] + (j + 1) % nr))
        return vs, fs
    for s in (1, -1):
        add(*capsule((0.225 * s, 0.0, 1.38), (0.27 * s, -0.02, 0.86), 0.055, 0.042))
    add(*capsule((0, 0, 1.44), (0, 0, 1.56), 0.055, 0.055))
    # the head: a UV sphere r 0.125 (pass 3, was 0.11: a crewman's hair is wider than a skull, and arcs behind the
    # stand-in's head showed through his as dark dashes, in its shadow) so the top of the head is 1.72
    hr, hz, nu, nv = 0.125, TOP - 0.125, 20, 12
    vs, fs = [(0, 0, hz - hr)], []
    for i in range(1, nv):
        th = math.pi * i / nv
        for j in range(nu):
            a = 2 * math.pi * j / nu; vs.append((hr * math.sin(th) * math.cos(a), hr * math.sin(th) * math.sin(a) * 0.92, hz - hr * math.cos(th)))
    vs.append((0, 0, hz + hr))
    for j in range(nu): fs.append((0, 1 + (j + 1) % nu, 1 + j))
    for i in range(nv - 2):
        for j in range(nu):
            a, b = 1 + i * nu + j, 1 + i * nu + (j + 1) % nu; fs.append((a, b, b + nu, a + nu))
    top = len(vs) - 1
    for j in range(nu): fs.append((top, 1 + (nv - 2) * nu + j, 1 + (nv - 2) * nu + (j + 1) % nu))
    add(vs, fs)
    # the four ground markers: 1 cm squares flat on z = 0
    for (mx, my) in ((R, 0), (-R, 0), (0, R), (0, -R)):
        add([(mx - 0.005, my - 0.005, 0), (mx + 0.005, my - 0.005, 0), (mx + 0.005, my + 0.005, 0), (mx - 0.005, my + 0.005, 0)], [(0, 1, 2, 3)])
    return V, F


def main():
    import bpy
    import numpy as np
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene; sc.render.fps = 24; sc.frame_start = 0; sc.frame_end = FRAMES_PER_KEY * KEYS
    wire = bpy.data.materials.new('current_wire'); wire.use_nodes = True
    foil = bpy.data.materials.new('current_foil'); foil.use_nodes = True
    clay = bpy.data.materials.new('occluder_clay'); clay.use_nodes = True
    for m, c in ((wire, lin(CHROME)), (foil, lin(GLINT)), (clay, (0.3, 0.3, 0.3, 1))):
        b = m.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = c
        b.inputs['Roughness'].default_value = 1.0; b.inputs['Metallic'].default_value = 0.0
    arcs, log = [], []
    for key in range(KEYS):
        for idx, (kind, s, depth) in enumerate(PLAN[key]):
            V, F, info = build_arc(key, idx, kind, s, depth)
            arcs.append((key, idx, V, F)); info.update(key=key, name='arc_k%02d_%d' % (key, idx)); log.append(info)
    allv = np.vstack([a[2] for a in arcs])   # (faces carry their material: (face, 0 glint | 1 chrome))
    R = float(max(np.abs(allv[:, 0]).max(), np.abs(allv[:, 1]).max())) + 0.01
    if allv[:, 2].max() > TOP or allv[:, 2].min() < 0: raise SystemExit('an arc leaves 0..%.2f m: %.3f..%.3f' % (TOP, allv[:, 2].min(), allv[:, 2].max()))
    V, F = occluder_mesh(R)
    me = bpy.data.meshes.new('occluder'); me.from_pydata([tuple(v) for v in V], [], F); me.update()
    occ = bpy.data.objects.new('occluder', me); sc.collection.objects.link(occ); me.materials.append(clay)
    for key, idx, V, F in arcs:
        name = 'arc_k%02d_%d' % (key, idx)
        me = bpy.data.meshes.new(name); me.from_pydata([tuple(v - np.array(SPECK)) for v in V], [], [f for f, _ in F]); me.update()
        # pass 3: every main stroke the glint, the forks the chrome (pass 2 wore the glint on the beats' lead arcs only and
        # the arcs' median value came out 131 of 255, 11 percent under 80: a grey wire, not a current)
        me.materials.append(foil); me.materials.append(wire)
        me.polygons.foreach_set('material_index', [m for _, m in F]); me.update()
        o = bpy.data.objects.new(name, me); sc.collection.objects.link(o); o.location = SPECK
        # THE KEYS: frame 0 the assembly (every arc at full size, the rig's still); the key's window full; else a speck
        on0, off0 = key * FRAMES_PER_KEY + 1, key * FRAMES_PER_KEY + 3
        seq = [(0, 1.0)] + ([] if key == 0 else [(1, HIDE), (on0, 1.0)]) + [(off0, HIDE), (FRAMES_PER_KEY * KEYS, HIDE)]
        for fr, sv in seq:
            o.scale = (sv, sv, sv); o.keyframe_insert('scale', frame=fr)
        act = o.animation_data.action; act.name = 'Arcs_' + name
        for fc in act.fcurves:
            for kp in fc.keyframe_points: kp.interpolation = 'CONSTANT'
        ad = o.animation_data; ad.action = None
        t = ad.nla_tracks.new(); t.name = 'Arcs'; t.strips.new('Arcs', 0, act)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', export_animations=True, export_animation_mode='NLA_TRACKS',
                              export_force_sampling=False, export_apply=False, export_yup=True, use_selection=False)
    # THE ROUND TRIP: import what was written and read every arc's scale at the frames the rig will sample
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=OUT)
    sc = bpy.context.scene; bad = []; rng_ = None
    objs = [o for o in sc.objects if o.name.startswith('arc_')]
    acts = sorted(a.name for a in bpy.data.actions)
    for o in objs:
        ad = o.animation_data; act = None
        for t in ad.nla_tracks:
            t.mute = True
            for st in t.strips:
                if st.action and st.action.name.startswith('Arcs'): act = st.action
        ad.action = act; rng_ = act.frame_range
    f0, f1 = rng_
    for o in objs:
        k = int(o.name[5:7])
        for j in range(KEYS):
            fr = f0 + (f1 - f0) * (j + 0.5) / KEYS
            sc.frame_set(int(math.floor(fr)), subframe=fr - math.floor(fr))
            want = 1.0 if j == k else HIDE
            if abs(o.matrix_world.to_scale().x - want) > 1e-4: bad.append((o.name, j, round(o.matrix_world.to_scale().x, 4)))
        sc.frame_set(int(f0))
        if abs(o.matrix_world.to_scale().x - 1.0) > 1e-4: bad.append((o.name, 'assembly', o.matrix_world.to_scale().x))
    print('WROTE', os.path.relpath(OUT, ROOT), '| arcs', len(objs), '| per key', [len(PLAN[k]) for k in range(KEYS)], '| markers R %.3f m' % R,
          '| actions', len(acts), acts[:2], '| range', tuple(rng_), '| round trip', 'OK' if not bad else bad[:6])
    for i in log: print('  ', i)
    print('RIG: <venv>/bin/python tools/bohemia_direction_master_rig.py reference/models/bohemia/aura_current.glb '
          'records/target/master_rig/aura_current --real-height 1.72 --family none --class person --still rest --clip Arcs:12')
    if bad: raise SystemExit('ROUND TRIP FAILED')


if __name__ == '__main__':
    main()
