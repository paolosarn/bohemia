#!/usr/bin/env python3
"""BOHEMIA -- UI TWO [the phone overhaul] (rule 212) and [one phone, one place] (rule 213): THE PHONE'S APPS AND ITS CASE,
MODELLED AND RENDERED THROUGH THE RIG, the way UI made the kit (tools/bohemia_ui_crashbox_kit.py, rule 130(b): the UI the
Crashbox way; rule 115: the rig's look is the look; rule 108: nobody draws a picture pixel by pixel in code).

PAOLO 10/26: 'the buttons that matter... one button for play and pause... the crew button... looks like the social media
button... do a big brain research on the type of buttons... logos people really understand'.

WHAT IS MADE, each a THING at its real thickness under the world's one light (the kit's sun, 155 degrees, 40 up; the kit's
camera tipped 25 degrees so a bottom edge shows its thickness):
  app_play       the big one: a signal-amber tin plate with a PLAY triangle struck up out of it in dark ink
  app_pause      the same plate with the two bars of PAUSE
  app_crew       a bone tin plate with the social app's people: two heads and shoulders, the front man over the back one
  app_camp       a tent on its ground line, the door lit (the camp)
  app_feed       a speech bubble with two lines in it (a post)
  app_relations  a pennant on a pole (whose side they are on: Battle Brothers' banners)
  app_settings   a gear (the phone's own settings page)
  app_combat     a dead-olive plate with a red crosshair: the phone's face when a fight starts
  app_heal       a bone plate with a medic's cross in red inside a ring: CAMP is the HEAL button (rules 226, 232(b));
                 the ring is the track the page fills with the company's blood and armour
  app_x          a dead-olive plate with a bone X: the job card's drop (rule 227)
  case           the handset: a dead-olive tin frame with a rivet at each corner round a hole the screen shows through,
                 one picture the page slices (border-image) so it stands at the phone's one size on every screen
  ear            the speaker slot and the camera at the top of the case
Every icon is the shape people already know (play, pause, people, tent, bubble, flag, gear, crosshair: Hoober's thumb
research in the 10/26 record and the 'logos people understand' he asked for); the tin is the kit's own: the same material
function, the same periodic masks, the same light and camera, imported, never copied.

  /tmp/v/bin/python tools/bohemia_ui2_phone_apps.py [piece ...]      (bpy 4.2 on Python 3.11; about 20 s a piece)

Writes slices/phone/<piece>.png (an icon at three texels a point: his phone's own pixels; the case with its hole),
and slices/phone/phone.json (the sizes the page reads). REUSE CHECK: the kit's build pieces (material, masks_for, slab,
dome, rr_outline, light_camera, post) and the master rig's guide and population snap, imported. REFERENCE CHECK: his
iPhone shape (19.5 by 9) kept for the case's corner and proportion; the Crashbox look bible (rusty tin, clay, nothing
glows) for the paint; no reference game.
"""
import os, sys, json, math
import numpy as np

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_ui_crashbox_kit as KIT                       # the kit's tin, light and camera: one source

RAW = os.path.join(R, 'records/target/ui2_phone')
SHIP = os.path.join(R, 'slices/phone')
UP = 3                    # texels a CSS point: his phone draws three pixels a point, so the icon is his phone's own pixels
ICON = 44.0               # an app is a thumb, 44 points (the kit's floor for a press)

BONE = (0.93, 0.89, 0.78)
AMBER = (0.97, 0.82, 0.44)
OLIVE = (0.22, 0.22, 0.17)
INK = (0.13, 0.11, 0.09)
RED = (0.62, 0.13, 0.08)


def circle(cx, cy, r, seg=28):
    return [(cx + r * math.cos(2 * math.pi * i / seg), cy + r * math.sin(2 * math.pi * i / seg)) for i in range(seg)]


def bust(cx, y0, w, h, seg=20):
    """the people icon's shoulders: a flat foot and a half ellipse over it, counter-clockwise"""
    pts = [(cx - w / 2, y0), (cx + w / 2, y0)]
    for i in range(1, seg):
        a = math.pi * i / seg
        pts.append((cx + (w / 2) * math.cos(a), y0 + h * math.sin(a)))
    return pts


def gear(cx, cy, ro, ri, teeth=8):
    pts = []
    for i in range(teeth):
        a0 = 2 * math.pi * i / teeth
        for da, r in ((-0.30, ri), (-0.17, ro), (0.17, ro), (0.30, ri)):
            a = a0 + da * (2 * math.pi / teeth)
            pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return pts


def ccw(pts):
    s = sum(pts[i][0] * pts[(i + 1) % len(pts)][1] - pts[(i + 1) % len(pts)][0] * pts[i][1] for i in range(len(pts)))
    return pts if s > 0 else pts[::-1]


# the glyphs, in the icon's own points (0..44 both ways, y up): a list of (outline, paint, raise) -- raise is how far over
# the stamped panel the shape stands (a later shape stands higher, so the front man sits over the back one)
def G_play():
    return [(ccw([(16.5, 12.0), (32.5, 22.0), (16.5, 32.0)]), INK, 1.4)]


def G_pause():
    return [(KIT.rr_outline(14.0, 12.0, 19.6, 32.0, 1.4, 3), INK, 1.4), (KIT.rr_outline(24.4, 12.0, 30.0, 32.0, 1.4, 3), INK, 1.4)]


def G_crew():
    return [(ccw(bust(28.4, 12.5, 14.0, 8.5)), INK, 0.9), (circle(28.4, 26.4, 4.0), INK, 0.9),
            (ccw(bust(18.6, 10.5, 17.0, 10.5)), INK, 1.6), (circle(18.6, 26.6, 5.0), INK, 1.6)]


def G_camp():
    return [(KIT.rr_outline(7.5, 9.0, 36.5, 11.0, 0.8, 2), INK, 1.0),
            (ccw([(9.5, 11.0), (34.5, 11.0), (22.0, 33.5)]), INK, 1.4),
            (ccw([(18.4, 11.0), (25.6, 11.0), (22.0, 21.5)]), AMBER, 1.8),
            (ccw([(21.2, 33.0), (22.8, 33.0), (23.6, 36.5), (20.4, 36.5)]), INK, 1.4)]


def G_feed():
    return [(KIT.rr_outline(8.5, 15.0, 35.5, 34.0, 5.0, 5), INK, 1.4), (ccw([(12.5, 15.5), (19.5, 15.5), (11.0, 8.5)]), INK, 1.4),
            (KIT.rr_outline(13.5, 26.0, 30.5, 28.6, 1.2, 2), BONE, 1.9), (KIT.rr_outline(13.5, 20.2, 25.0, 22.8, 1.2, 2), BONE, 1.9)]


def G_relations():
    flag = [(13.6, 20.5), (19.0, 22.2), (24.5, 20.6), (30.0, 19.4), (35.0, 20.8), (35.0, 33.4), (30.0, 32.0), (24.5, 33.2), (19.0, 35.0), (13.6, 33.2)]
    return [(KIT.rr_outline(10.6, 7.5, 13.6, 36.0, 1.2, 2), INK, 1.4), (ccw(flag), INK, 1.4), (circle(12.1, 36.6, 2.0, 16), INK, 1.6)]


def G_settings():
    return [(ccw(gear(22.0, 22.0, 13.0, 10.2, 8)), INK, 1.4), (circle(22.0, 22.0, 4.4, 24), BONE, 1.9)]


def G_combat():
    out = circle(22.0, 22.0, 12.5, 40)
    inn = circle(22.0, 22.0, 9.8, 40)
    return [('ring', (out, inn), RED, 1.4),
            (KIT.rr_outline(20.8, 4.5, 23.2, 13.5, 0.6, 2), RED, 1.4), (KIT.rr_outline(20.8, 30.5, 23.2, 39.5, 0.6, 2), RED, 1.4),
            (KIT.rr_outline(4.5, 20.8, 13.5, 23.2, 0.6, 2), RED, 1.4), (KIT.rr_outline(30.5, 20.8, 39.5, 23.2, 0.6, 2), RED, 1.4),
            (circle(22.0, 22.0, 2.2, 20), RED, 1.6)]


def G_heal():
    """rule 232(b), Paolo 10/26: 'the camp will be like a medical icon maybe in a circle': a medic's cross struck in red inside a
    ring pressed into the plate; the ring is the TRACK the page fills with the company's blood and armour (rule 226(c)), so it
    is struck low and dark, the empty part what is missing"""
    a, b, c, d = 13.0, 19.4, 24.6, 31.0   # one outline: two crossed bars as one shape (overlapping solids render a hole)
    return [('ring', (circle(22.0, 22.0, 17.6, 56), circle(22.0, 22.0, 13.4, 56)), INK, 0.7),
            (ccw([(b, a), (c, a), (c, b), (d, b), (d, c), (c, c), (c, d), (b, d), (b, c), (a, c), (a, b), (b, b)]), RED, 1.6)]


def ring_of(png):
    """where the ring's track landed on the rendered icon (the camera tips it and lifts it by its height): its centre and radii
    as fractions of the picture, read off the dark pixels, for the page's gauge (phone.json app_heal.ring)"""
    from PIL import Image
    a = np.asarray(Image.open(png).convert('RGBA')).astype(float)
    h, w = a.shape[:2]; lum = a[..., :3].mean(axis=2); dark = (a[..., 3] > 200) & (lum < 70)
    ys, xs = np.nonzero(dark)
    cx, cy = w / 2.0, h / 2.0
    for _ in range(4):   # the ring's own pixels only (the cross's shade inside and the plate's edge outside left out)
        r = np.hypot(xs - cx, ys - cy); k = (r > 0.25 * w) & (r < 0.46 * w); cx, cy = xs[k].mean(), ys[k].mean()
    r = np.hypot(xs - cx, ys - cy); k = (r > 0.25 * w) & (r < 0.46 * w)
    ro, ri = np.percentile(r[k], 98), np.percentile(r[k], 2)
    return dict(cx=round(float(cx / w), 4), cy=round(float(cy / h), 4), ro=round(float(ro / w), 4), ri=round(float(ri / w), 4))


def G_x():
    """the X on the job card (rule 227): two struck bars, crossed"""
    def bar(a):
        c, s_, L, W = math.cos(a), math.sin(a), 15.0, 2.6
        pts = [(-L, -W), (L, -W), (L, W), (-L, W)]
        return ccw([(22.0 + x * c - y * s_, 22.0 + x * s_ + y * c) for x, y in pts])
    return [(bar(math.radians(45)), BONE, 1.4), (bar(math.radians(-45)), BONE, 1.6)]


ICONS = {
    'app_play':      dict(paint=AMBER, glyph=G_play),
    'app_pause':     dict(paint=AMBER, glyph=G_pause),
    'app_crew':      dict(paint=BONE, glyph=G_crew),
    'app_camp':      dict(paint=BONE, glyph=G_camp),
    'app_feed':      dict(paint=BONE, glyph=G_feed),
    'app_relations': dict(paint=BONE, glyph=G_relations),
    'app_settings':  dict(paint=BONE, glyph=G_settings),
    'app_combat':    dict(paint=OLIVE, glyph=G_combat, dust=0.25),
    'app_heal':      dict(paint=BONE, glyph=G_heal),
    'app_x':         dict(paint=OLIVE, glyph=G_x, dust=0.25),
}
# THE CASE: a frame (bezel = [top, right, bottom, left] points) round the screen's hole, the hole's corners rounded hr; the
# picture is one period of every mask (P = 64) across its middle, so the page stretches it to any size with the browser's
# border-image (ins = bezel + hr: the corner pieces hold the whole rounded corner, the edges repeat seamlessly)
CASE = dict(P=64, bezel=[13, 8, 13, 8], hr=7.0, T=5.0, r=13.0, paint=OLIVE)
ORDER = list(ICONS) + ['case', 'ear']


def plate(bpy, G, name, W, H, paint, mk, r=9.0, dust=1.0):
    """an app's tin: the kit's plate (struck panel and rivets) at an app's corner"""
    T = 4.2
    m = KIT.material(bpy, name + '_paint', paint, mk, 64, G, 'tin', dust=dust)
    KIT.slab(bpy, 'plate', KIT.rr_outline(0, 0, W, H, r), 0, T, m, bevel=1.1)
    b0 = 4.6
    KIT.slab(bpy, 'emboss', KIT.rr_outline(b0, b0, W - b0, H - b0, max(2.0, r - 4.0)), T - 0.4, T + 1.0, m, bevel=1.3, seg=4)
    rust = KIT.material(bpy, name + '_rivet', (0.36, 0.24, 0.16), mk, 64, G, 'tin', wear=0.9)
    k = 2.6
    for cx, cy in ((k, H / 2), (W - k, H / 2)):
        KIT.dome(bpy, 'rivet', cx, cy, T - 0.1, 1.3, 1.0, rust)
    return T + 1.0


def render_icon(name):
    import bpy
    import bohemia_direction_master_rig as RIG
    G = RIG.G
    spec = ICONS[name]
    bpy.ops.wm.read_factory_settings(use_empty=True)
    seed = sum(map(ord, name))
    mk = KIT.masks_for(bpy, name, 64, seed, 'tin')
    W = H = ICON
    top = plate(bpy, G, name, W, H, spec['paint'], mk, dust=spec.get('dust', 1.0))
    mats = {}
    for part in spec['glyph']():
        if part[0] == 'ring':
            _, (outer, inner), paint, up = part
        else:
            outer, paint, up = part; inner = None
        if paint not in mats:
            mats[paint] = KIT.material(bpy, name + '_ink%d' % len(mats), paint, mk, 64, G, 'tin', wear=0.35)
        if inner is not None:
            KIT.ring(bpy, 'glyph', outer, inner, top - 0.2, top + up, mats[paint], bevel=0.35, seg=2)
        else:
            KIT.slab(bpy, 'glyph', outer, top - 0.2, top + up, mats[paint], bevel=0.35, seg=2)
    T = top + 2.0
    KIT.UP = UP
    lip = KIT.light_camera(bpy, G, W, H, T)
    out = os.path.join(RAW, name); os.makedirs(out, exist_ok=True)
    raw = os.path.join(out, 'raw_' + name + '.png')
    bpy.context.scene.render.filepath = raw
    bpy.ops.render.render(write_still=True)
    a = KIT.post(raw, float(G['ring']), population(RIG))
    from PIL import Image
    os.makedirs(SHIP, exist_ok=True)
    Image.fromarray(a.astype(np.uint8), 'RGBA').save(os.path.join(SHIP, name + '.png'), optimize=True)
    meta = dict(w=W, h=H + lip, up=UP, lip=lip)
    if name == 'app_heal': meta['ring'] = ring_of(os.path.join(SHIP, name + '.png'))
    print('  icon', name, meta, flush=True)
    return meta


def population(RIG):
    cache = os.path.join(R, 'records/target/ui_crashbox_kit/population_prop.npy')
    if os.path.exists(cache): return np.load(cache)
    pop = RIG.population('prop')[0]; os.makedirs(os.path.dirname(cache), exist_ok=True); np.save(cache, pop)
    return pop


def render_case():
    """the handset's tin frame round the screen's hole: one picture, sliced by the page (border-image)"""
    import bpy
    import bohemia_direction_master_rig as RIG
    G = RIG.G
    bpy.ops.wm.read_factory_settings(use_empty=True)
    P, bz, hr, T, r = CASE['P'], CASE['bezel'], CASE['hr'], CASE['T'], CASE['r']
    ins = [int(math.ceil(v + hr)) for v in bz]
    W = ins[3] + P + ins[1]; H = ins[2] + P + ins[0]
    mk = KIT.masks_for(bpy, 'case', 64, 1234, 'tin')
    tin = KIT.material(bpy, 'case_paint', CASE['paint'], mk, 64, G, 'tin', dust=0.25)
    outer = KIT.rr_outline(0, 0, W, H, r, 8)
    inner = KIT.rr_outline(bz[3], bz[2], W - bz[1], H - bz[0], hr, 8)
    KIT.ring(bpy, 'case', outer, inner, 0, T, tin, bevel=1.2, seg=3)
    # the bead pressed round the hole: the lip a screen sits behind
    lipin = KIT.rr_outline(bz[3] - 2.2, bz[2] - 2.2, W - bz[1] + 2.2, H - bz[0] + 2.2, hr + 2.2, 8)
    KIT.ring(bpy, 'bead', lipin, inner, T - 0.2, T + 0.9, tin, bevel=0.6, seg=3)
    rust = KIT.material(bpy, 'case_rivet', (0.36, 0.24, 0.16), mk, 64, G, 'tin', wear=0.9)
    for cx, cy in ((4.4, 6.0), (W - 4.4, 6.0), (4.4, H - 6.0), (W - 4.4, H - 6.0)):
        KIT.dome(bpy, 'rivet', cx, cy, T - 0.1, 1.6, 1.1, rust)
    KIT.UP = UP
    lip = KIT.light_camera(bpy, G, W, H, T + 0.9)
    out = os.path.join(RAW, 'case'); os.makedirs(out, exist_ok=True)
    raw = os.path.join(out, 'raw_case.png')
    bpy.context.scene.render.filepath = raw
    bpy.ops.render.render(write_still=True)
    a = KIT.post(raw, float(G['ring']), population(RIG))
    from PIL import Image
    Image.fromarray(a.astype(np.uint8), 'RGBA').save(os.path.join(SHIP, 'case.png'), optimize=True)
    meta = dict(ins=[ins[0], ins[1], ins[2] + lip, ins[3]], bezel=[bz[0], bz[1], bz[2] + lip, bz[3]], P=P, lip=lip, r=r, up=UP, w=W, h=H + lip)
    print('  case', meta, flush=True)
    return meta


def render_ear():
    """the speaker slot and the camera: a dark slot pressed into a strip of the case's tin"""
    import bpy
    import bohemia_direction_master_rig as RIG
    G = RIG.G
    bpy.ops.wm.read_factory_settings(use_empty=True)
    W, H, T = 34.0, 8.0, 2.0
    mk = KIT.masks_for(bpy, 'ear', 64, 4321, 'tin')
    tin = KIT.material(bpy, 'ear_paint', OLIVE, mk, 64, G, 'tin', dust=0.25)
    dark = KIT.material(bpy, 'ear_slot', (0.05, 0.05, 0.045), mk, 64, G, 'tin', wear=0.2)
    KIT.slab(bpy, 'strip', KIT.rr_outline(0, 0, W, H, 4.0, 6), 0, T, tin, bevel=0.6)
    KIT.slab(bpy, 'slot', KIT.rr_outline(9.0, 3.0, 25.0, 5.0, 1.0, 3), T - 0.3, T + 0.05, dark, bevel=0.2, seg=1)
    KIT.slab(bpy, 'cam', circle(29.0, 4.0, 1.7, 16), T - 0.3, T + 0.1, dark, bevel=0.3, seg=1)
    KIT.UP = UP
    lip = KIT.light_camera(bpy, G, W, H, T)
    out = os.path.join(RAW, 'ear'); os.makedirs(out, exist_ok=True)
    raw = os.path.join(out, 'raw_ear.png')
    bpy.context.scene.render.filepath = raw
    bpy.ops.render.render(write_still=True)
    a = KIT.post(raw, float(G['ring']), population(RIG))
    from PIL import Image
    Image.fromarray(a.astype(np.uint8), 'RGBA').save(os.path.join(SHIP, 'ear.png'), optimize=True)
    meta = dict(w=W, h=H + lip, up=UP, lip=lip)
    print('  ear', meta, flush=True)
    return meta


def main():
    names = [a for a in sys.argv[1:] if not a.startswith('-')] or ORDER
    os.makedirs(SHIP, exist_ok=True)
    jp = os.path.join(SHIP, 'phone.json')
    meta = json.load(open(jp)) if os.path.exists(jp) else {}
    for n in names:
        if n in ICONS: meta[n] = render_icon(n)
        elif n == 'case': meta['case'] = render_case()
        elif n == 'ear': meta['ear'] = render_ear()
        else: raise SystemExit('no such piece: ' + n)
    meta = {k: meta[k] for k in ORDER if k in meta}
    meta['_about'] = 'UI TWO [the phone overhaul] (rule 212): the phone\'s apps and case, rendered through the rig by tools/bohemia_ui2_phone_apps.py; draft:true'
    json.dump(meta, open(jp, 'w'), indent=1)
    print('wrote', os.path.relpath(jp, R))


if __name__ == '__main__':
    main()
