#!/usr/bin/env python3
"""THE FACE IS THE BODY'S FACE GATE (rule 120(d), PORTRAIT [the face is the body's face], 10/19/26).

Paolo 10/18, to the coordinator: 'the portraits don't look like the people... Black people looking like white people.'
Rule 120(d): every portrait matches its body's skin tone, hair and build; a face whose skin does not match its body is a
defect a gate refuses (ONE ID, ONE WHOLE PERSON).

MEASURED BEFORE THIS WAS BUILT (10/19, off the pixels of the sheets the fight and the settlement draw people from,
slices/fight_people/ and slices/settlement_people/, every skin pixel mapped exactly onto the game's eleven SKIN_TONES):
    the body of each person            25 of 26 painted in PORCELAIN, the player's own skin: famPaintBody swaps the worn
                                       list, the dials, the age and the face for the stroke, never the skin, so every
                                       cast and gang body wears the global the player's face maker set (the street's
                                       25 the same). Only YOU matches, because YOU is the player.
    the 64 px face beside it           its own roll (NPC_FACTORY), onyx to fair: a Black face over a white body.
    the starred faces (crew screen)    coloured BY EYE off that 64 face, 'two steps lighter', and under the rig's one sun
                                       all twelve cast faces came out one orange brown.
So what he saw was real twice over.

THE TRUTH IS THE BODY'S SKIN, AND IT IS A FILE: records/target/character/BOHEMIA_ONE_SKIN.json (CHARACTER [one skin, one
person], 10/19): one tone per person on the game's ladder, Las Vegas's real mix, its flat ramp for the painted sprites
and ONE rig albedo (a style palette step) for the body AND the head. records/target/portrait/BOHEMIA_THE_SKIN_OF_RECORD.json
is PORTRAIT's copy of it beside what each picture shows today, the body's hair, and the rig's measured light.

THE RULER. A painted sprite is read EXACTLY: each skin pixel is one of the 33 ramp colours, and the person is the tone most
of them belong to. A rendered face is read for its PAINT, not its light: the rig lights a portrait dimly (a face's middle
pixel is about a fifth of its paint, measured), so the gate takes the light back out. The face's MASK (the same head
rendered once more with the skin pure green and the hair pure blue, cut into the hand-off square the same way) says how
much light this head's skin and hair get (its green and its blue are an albedo of one, as rendered); the record's
rig_transfer (two known skins through the rig on one head, fitted per channel) gives the light's tint and the dust.
Read back on the calibration head: (60, 45, 38) painted, (60, 45, 38) read. The paint PASSES when it is within 10 of its
person's rig albedo (CIELAB) and its L* within 8: CHARACTER's table puts its neighbouring tones 8 to 19 apart, and the
defect he saw (a porcelain face on a tan or a deep body) is 26 to 47 apart. The nearest rung is printed beside it. Hair is the 9/20 gate's ruler (portrait_matches_body_gate.js) on the
paint read the same way against the body's cut ramp's lit step: hue within 30 degrees unless both are drab (under 15
percent saturation), lightness within 2.2x.

THE LEGS
  1. THE ONE SKIN names every person the sheets carry, with a real tone and a rig albedo; PORTRAIT's copy agrees with it.
  2. THE BODY sheets (the fight's, the street's) and THE 64 FACE beside each body wear the person's tone. RED until
     CHARACTER's re-bake (the engine's stroke painting the person's own tone, body and face); the BACK list names each.
  3. THE STARRED FACE: every face in the crew hand-off (BOHEMIA_CREW_FACES.json) is painted its person's rig skin, read
     through its own mask, and wears its body's hair.
  4. IT BITES: a starred face repainted in the player's porcelain is refused; a copy that drifts from CHARACTER's file is
     refused; a body repainted in the player's porcelain is refused (and, while a body is BACK, the same body painted in
     its own tone passes).

    python3 gates/the_face_is_the_bodys_face_gate.py
"""
import os, sys, json, re, colorsys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ONE_SKIN = 'records/target/character/BOHEMIA_ONE_SKIN.json'
RECORD = 'records/target/portrait/BOHEMIA_THE_SKIN_OF_RECORD.json'
SHEETS = 'slices/fight_people'
SETTLE = 'slices/settlement_people'   # the settlement street's people, painted by the same famPaintBody (ANIMATION's bake)
CREW = 'records/target/portrait/crew/BOHEMIA_CREW_FACES.json'
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
STEP, DL = 1, 8.0                     # the sprite ladder's tolerance: its own rung or the one beside it, and L* within 8
DE_OWN = 10.0                         # a starred face's paint within 10 of its own rig albedo (the table's neighbours sit 8 to 19 apart; the defect he saw, 26 to 47)
NEAR, DRAB, LUM = 30.0, 0.15, 2.20    # portrait_matches_body_gate.js's hair ruler, reused
MIN_SKIN, MIN_HAIR = 200, 40          # pixels a reading needs before it counts


def p(*a): return os.path.join(ROOT, *a)


def lab(c):
    f = lambda v: (v / 255.0) / 12.92 if v / 255.0 <= 0.04045 else ((v / 255.0 + 0.055) / 1.055) ** 2.4
    r, g, b = (f(x) for x in c[:3])
    X = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.9505; Y = 0.2126 * r + 0.7152 * g + 0.0722 * b; Z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.089
    h = lambda t: t ** (1 / 3.0) if t > 0.008856 else 7.787 * t + 16 / 116.0
    return (116 * h(Y) - 16, 500 * (h(X) - h(Y)), 200 * (h(Y) - h(Z)))


def de(a, b): return sum((x - y) ** 2 for x, y in zip(lab(a), lab(b))) ** 0.5


def lin(v): v = v / 255.0; return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
def srgb(x): x = min(1.0, max(0.0, x)); return int(round(255 * (x * 12.92 if x <= 0.0031308 else 1.055 * x ** (1 / 2.4) - 0.055)))


def skin_tones(src=None):
    """the game's eleven skin ramps, read off the alpha (name -> [lit, mid, dark])"""
    src = src or open(p(ALPHA)).read()
    return dict((n, [tuple(c) for c in r]) for n, r in json.loads(re.search(r'const SKIN_TONES=(\[\[.*?\]\]\]\]);', src).group(1)))


def hair_ramps(src=None):
    """the hair bank's ramps (H_BLK and the rest: dk, mid, lt), read off the alpha"""
    src = src or open(p(ALPHA)).read()
    out = {}
    for m in re.finditer(r'var (H_[A-Z]{3})=\{dk:\[(\d+),(\d+),(\d+)\],mid:\[(\d+),(\d+),(\d+)\],lt:\[(\d+),(\d+),(\d+)\]\};', src):
        v = [int(x) for x in m.groups()[1:]]
        out[m.group(1)] = dict(dk=tuple(v[0:3]), mid=tuple(v[3:6]), lt=tuple(v[6:9]))
    return out


def ladder(T):
    """the tones in order of lightness (their mid's L*): name -> rank"""
    return dict((n, i) for i, n in enumerate(sorted(T, key=lambda n: lab(T[n][1])[0])))


def rig_ladder(one):
    """CHARACTER's rig ladder: tone -> its rig albedo (one person per tone carries it), and tone -> rung (CHARACTER's order)"""
    rgb = {}
    for v in one['people'].values(): rgb.setdefault(v['tone'], tuple(v['rig_rgb']))
    order = [t for t in one.get('ladder', []) if t in rgb] or sorted(rgb, key=lambda t: -lab(rgb[t])[0])
    return rgb, dict((t, i) for i, t in enumerate(order))


def sprite_tone(im, box, T):
    """a painted sprite's skin: the tone most of its exact skin pixels belong to (name, count, counts)"""
    pal = dict((c, n) for n, r in T.items() for c in r)
    cnt = {}
    for px in im.crop(box).getdata():
        if px[3] > 200 and px[:3] in pal: cnt[pal[px[:3]]] = cnt.get(pal[px[:3]], 0) + 1
    if not cnt: return None, 0, cnt
    n = max(cnt, key=cnt.get)
    return n, cnt[n], cnt


def sprite_hair(im, box, ramp, T):
    """a painted sprite's hair: the mid of its cut's ramp when the body draws that ramp, else the commonest colour of the
    head band that is neither skin nor ink (the player's own colour)"""
    H = hair_ramps()
    band = [px for px in im.crop(box).getdata() if px[3] > 200]
    if ramp and ramp in H:
        cs = set(H[ramp].values())
        if sum(1 for px in band if px[:3] in cs) >= 8: return H[ramp]['mid'], ramp
    skin = set(c for r in T.values() for c in r); cnt = {}
    for px in band:
        c = px[:3]
        if c in skin or max(c) < 40: continue
        cnt[c] = cnt.get(c, 0) + 1
    return (max(cnt, key=cnt.get), 'measured') if cnt else (None, None)


def _picks(face, mask, which):
    """(face pixel, mask value) where the mask is pure skin (green) or pure hair (blue)"""
    if face.size != mask.size: mask = mask.resize(face.size, Image.NEAREST)
    ch = 1 if which == 'skin' else 2
    out = []
    for f, m in zip(face.getdata(), mask.getdata()):
        if m[3] < 250 or f[3] < 250: continue
        o = [m[0], m[1], m[2]]; k = o[ch]; o[ch] = -1
        if k > 60 and k > 2.2 * max(o): out.append((f[:3], m[ch]))
    return out


def _median(v): v = sorted(v); return v[len(v) // 2]


def masked(face, mask, which):
    """the median colour of a rendered face's pixels where its mask is pure skin (green) or pure hair (blue), as rendered"""
    px = _picks(face, mask, which)
    if not px: return None, 0
    return tuple(_median([c[i] for c, _ in px]) for i in range(3)), len(px)


def mask_light(mask, which):
    """how much light a head's skin (or hair) gets: the median of its mask's own pure channel, linear (an albedo of 1)"""
    v = [lin(m) for _, m in _picks(mask, mask, which)]
    return _median(v) if v else 0.0


def paint(face, mask, which, tr):
    """the PAINT of a rendered face's skin or hair, the rig's light taken out: the face's median (linear, per channel)
    over this head's own light (its mask) in the light's own tint (the record's rig_transfer), back to sRGB"""
    px = _picks(face, mask, which)
    if not px or not tr: return None, len(px)
    m = _median([lin(k) for _, k in px])
    med = [_median([lin(c[i]) for c, _ in px]) for i in range(3)]
    if which == 'skin':
        s = m / tr['mask_skin_G']
        out = [(med[i] - tr['b'][i] * s) / (tr['a'][i] * s) for i in range(3)]
    else:   # the hair's light, its blue: the same sun's tint
        out = [med[i] / (m * tr['a'][i] / tr['a'][2]) for i in range(3)]
    return tuple(srgb(x) for x in out), len(px)


def rig_verdict(rgb, tone, RIG, RR):
    """a starred face's skin paint against its person's rig albedo: within DE_OWN of it (CIELAB) and L* within 8. The
    nearest rung is printed, never judged on its own: CHARACTER's rig table puts some tones two rungs apart on nearly one
    colour (pale and olive 8.0 apart, against tan and porcelain 26 and deep and porcelain 47), so a face 1.2 L* off its own
    olive can sit nearest pale (10/19, the Red's face, a ruler bug caught on the gangs' round)"""
    got = min(RIG, key=lambda t: de(RIG[t], rgb)); dl = lab(rgb)[0] - lab(RIG[tone])[0]; d = de(rgb, RIG[tone])
    ok = d <= DE_OWN and abs(dl) <= DL
    return ok, '%.1f from its own %s %s (L* %+.1f), nearest rung %s' % (d, tone, RIG[tone], dl, got)


def hair_verdict(a, b):
    ha, sa, va = colorsys.rgb_to_hsv(*(x / 255.0 for x in a)); hb, sb, vb = colorsys.rgb_to_hsv(*(x / 255.0 for x in b))
    la, lb = max(lab(a)[0], 1.0), max(lab(b)[0], 1.0)
    ratio = max(la, lb) / min(la, lb)
    if sa < DRAB and sb < DRAB: dh = 0.0
    elif sa < DRAB or sb < DRAB: dh = 0.0 if abs(la - lb) < 12 else 180.0   # one has a hue, the other none: lightness decides
    else: dh = min(abs(ha - hb), 1 - abs(ha - hb)) * 360
    return dh <= NEAR and ratio <= LUM, 'hue %.0f deg, lightness %.2fx' % (dh, ratio)


def body_box(sheet): return (0, 0, 112 * 4, 112)          # the first row's first four frames
def face_box(sheet): return (sheet.width - 64, 0, sheet.width, 64)
def head_box(sheet): return (0, 0, 112, 40)


class Gate:
    def __init__(self):
        self.passed, self.failed = 0, []

    def ok(self, name, cond, detail=''):
        if cond: self.passed += 1; print('  ok   ' + name + ('   ' + detail if detail else ''))
        else: self.failed.append(name); print('  FAIL ' + name + ('   ' + detail if detail else ''))
        return cond


def leg_one(g, one, rec, man, T, quiet=False):
    """CHARACTER's file covers every person the sheets carry; PORTRAIT's copy has not drifted from it"""
    bad = 0
    for look in man['looks']:
        o = one['people'].get(look); e = rec['people'].get(look)
        good = bool(o) and o.get('tone') in T and len(o.get('rig_rgb') or []) == 3 and bool(e) and e.get('skin') == o.get('tone') \
            and list(e.get('rig_rgb') or []) == list(o.get('rig_rgb') or [])
        bad += 0 if good else 1
        if not quiet: g.ok('ONE SKIN %s is %s, PORTRAIT\'s copy agrees' % (look, o and o.get('tone')), good,
                           '' if good else 'CHARACTER %s / PORTRAIT %s' % (o and o.get('tone'), e and e.get('skin')))
    return bad


def leg_body(g, one, man, T, sheets=None, quiet=False, label='BODY', box=body_box, folder=SHEETS):
    back = []
    for look, v in man['looks'].items():
        o = one['people'].get(look)
        if not o: continue
        sh = (sheets or {}).get(look) or Image.open(p(folder, v['file'])).convert('RGBA')
        n, k, _ = sprite_tone(sh, box(sh), T)
        if n != o['tone']: back.append((look, n, o['tone']))
        if not quiet: g.ok('%s %s wears its own skin (%s)' % (label, look, o['tone']), n == o['tone'],
                           'painted %s (%d px)%s' % (n, k, '' if n == o['tone'] else '  -> BACK to CHARACTER [one skin, one person]'))
    return back


def leg_faces(g, one, rec, crew, RIG, RR, override=None, quiet=False):
    bad = 0
    tr = rec.get('rig_transfer')
    for look, f in crew['faces'].items():
        o = one['people'].get(look); e = rec['people'].get(look)
        if not o or not e:
            bad += 1
            if not quiet: g.ok('STARRED %s has a person in CHARACTER\'s file' % look, False)
            continue
        fp = p(os.path.dirname(CREW), look, 'rest_128.png'); mp = p(os.path.dirname(CREW), look, 'mask_128.png')
        if not os.path.exists(mp):
            bad += 1
            if not quiet: g.ok('STARRED %s carries its skin mask' % look, False, 'no %s' % os.path.relpath(mp, ROOT))
            continue
        face = (override or {}).get(look) or Image.open(fp).convert('RGBA'); mask = Image.open(mp).convert('RGBA')
        rgb, n = paint(face, mask, 'skin', tr)
        if n < MIN_SKIN or rgb is None:
            bad += 1
            if not quiet: g.ok('STARRED %s shows enough skin to read' % look, False, '%d px%s' % (n, '' if tr else ', and the record has no rig_transfer'))
            continue
        good, why = rig_verdict(rgb, o['tone'], RIG, RR)
        bad += 0 if good else 1
        if not quiet: g.ok('STARRED %s is painted its body\'s skin (%s)' % (look, o['tone']), good, 'its skin paint %s, %s' % (rgb, why))
        hrgb, hn = paint(face, mask, 'hair', tr)
        body_hair = tuple(e['hair']['lt']) if e.get('hair') and e['hair'].get('lt') else None
        if hn >= MIN_HAIR and body_hair and hrgb:
            good, why = hair_verdict(hrgb, body_hair)
            bad += 0 if good else 1
            if not quiet: g.ok('STARRED %s wears its body\'s hair (%s)' % (look, e['hair'].get('ramp')), good, 'its hair paint %s against the body\'s %s, %s' % (hrgb, body_hair, why))
        elif not quiet: print('  --   STARRED %s hair under the head gear (%d px), not read' % (look, hn))
    return bad


def main():
    g = Gate()
    for f in (ONE_SKIN, RECORD, os.path.join(SHEETS, 'fight_people.json'), CREW):
        if not os.path.exists(p(f)):
            g.ok('%s exists' % f, False); print('THE FACE IS THE BODY\'S FACE: 0 passed, 1 failed'); return 1
    one = json.load(open(p(ONE_SKIN))); rec = json.load(open(p(RECORD)))
    man = json.load(open(p(SHEETS, 'fight_people.json'))); crew = json.load(open(p(CREW)))
    T = skin_tones(); RIG, RR = rig_ladder(one)
    g.ok('CHARACTER\'s file names the game\'s own tones', set(RIG) <= set(T) and len(RIG) >= 9, '%d tones carried, %d in the game' % (len(RIG), len(T)))
    g.ok('the record carries the rig\'s measured light', bool(rec.get('rig_transfer', {}).get('mask_skin_G')))

    print('1. THE ONE SKIN (CHARACTER\'s file) names every person, and PORTRAIT\'s copy agrees')
    leg_one(g, one, rec, man, T)
    print('2. THE BODY, AND THE 64 FACE BESIDE IT, wear the person\'s skin (the fight\'s sheets, then the street\'s)')
    back = leg_body(g, one, man, T)
    back += [('64 face ' + b[0],) + b[1:] for b in leg_body(g, one, man, T, label='64 FACE', box=face_box)]
    sp = os.path.join(SETTLE, 'settlement_people.json')
    if os.path.exists(p(sp)):
        back += [('street ' + b[0],) + b[1:] for b in leg_body(g, one, json.load(open(p(sp))), T, label='STREET BODY', folder=SETTLE)]
    print('3. THE STARRED FACE (the crew hand-off) is painted its body\'s skin and hair')
    leg_faces(g, one, rec, crew, RIG, RR)

    print('4. IT BITES')
    tr = rec.get('rig_transfer') or dict(a=[0.2, 0.2, 0.2], b=[0, 0, 0], mask_skin_G=0.2)
    looks = [l for l in crew['faces'] if l in one['people'] and one['people'][l]['tone'] in RR and 'porcelain' in RR
             and abs(RR[one['people'][l]['tone']] - RR['porcelain']) > STEP and os.path.exists(p(os.path.dirname(CREW), l, 'mask_128.png'))]
    if looks:
        l = looks[0]
        face = Image.open(p(os.path.dirname(CREW), l, 'rest_128.png')).convert('RGBA'); mask = Image.open(p(os.path.dirname(CREW), l, 'mask_128.png')).convert('RGBA')
        fake = face.copy(); px = fake.load(); mk = mask.load()
        for y in range(face.height):   # the player's porcelain rig skin, lit the way this very pixel is lit (its mask's green)
            for x in range(face.width):
                m = mk[x, y]
                if m[1] > 60 and m[1] > 2.2 * max(m[0], m[2]):
                    s = lin(m[1]) / tr['mask_skin_G']
                    px[x, y] = tuple(srgb(tr['a'][i] * s * lin(RIG['porcelain'][i]) + tr['b'][i] * s) for i in range(3)) + (255,)
        g.ok('a starred face repainted in the player\'s porcelain is refused',
             leg_faces(Gate(), one, rec, dict(faces={l: crew['faces'][l]}), RIG, RR, override={l: fake}, quiet=True) > 0, '%s (%s)' % (l, one['people'][l]['tone']))
    k = next(iter(man['looks'])); recw = json.loads(json.dumps(rec))
    recw['people'][k]['skin'] = 'chalk' if one['people'][k]['tone'] != 'chalk' else 'onyx'
    g.ok('a copy that drifts from CHARACTER\'s file is refused', leg_one(Gate(), one, recw, dict(looks={k: man['looks'][k]}), T, quiet=True) > 0, k)
    # the body leg bites: a body whose person is not porcelain, repainted pixel for pixel in the player's porcelain (the
    # 10/18 bug, famPaintBody's stroke), is refused
    l = next((l for l in man['looks'] if l in one['people'] and one['people'][l]['tone'] != 'porcelain'), None)
    if l:
        sh = Image.open(p(SHEETS, man['looks'][l]['file'])).convert('RGBA'); own = one['people'][l]['tone']
        swap = dict(zip(T[own], T['porcelain'])); bug = sh.copy(); px = bug.load(); box = body_box(sh)
        for y in range(box[1], box[3]):
            for x in range(box[0], box[2]):
                c = px[x, y]
                if c[3] > 200 and c[:3] in swap: px[x, y] = swap[c[:3]] + (c[3],)
        g.ok('a body repainted in the player\'s porcelain is refused', bool(leg_body(Gate(), one, dict(looks={l: man['looks'][l]}), T, sheets={l: bug}, quiet=True)), '%s (%s)' % (l, own))
    bodies = [b for b in back if not b[0].startswith(('64 face', 'street'))]
    if bodies:   # paint one BACK body in its own tone, pixel for pixel, and the body leg passes it
        l, painted, own = bodies[0]; sh = Image.open(p(SHEETS, man['looks'][l]['file'])).convert('RGBA')
        swap = dict(zip(T[painted], T[own])); fixed = sh.copy(); px = fixed.load(); box = body_box(sh)
        for y in range(box[1], box[3]):
            for x in range(box[0], box[2]):
                c = px[x, y]
                if c[3] > 200 and c[:3] in swap: px[x, y] = swap[c[:3]] + (c[3],)
        g.ok('a body sheet painted in its own tone passes', not leg_body(Gate(), one, dict(looks={l: man['looks'][l]}), T, sheets={l: fixed}, quiet=True), l)

    if back:
        print('\nBACK TO CHARACTER [one skin, one person] (%d pictures): ' % len(back) + ', '.join('%s %s->%s' % b for b in back))
    print('THE FACE IS THE BODY\'S FACE: %d passed, %d failed' % (g.passed, len(g.failed)))
    return 1 if g.failed else 0


if __name__ == '__main__':
    sys.exit(main())
