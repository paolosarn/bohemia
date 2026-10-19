#!/usr/bin/env python3
"""THE FACE IS THE BODY'S FACE GATE (rule 120(d), PORTRAIT [the face is the body's face], 10/19/26).

Paolo 10/18, to the coordinator: 'the portraits don't look like the people... Black people looking like white people.'
Rule 120(d): every portrait matches its body's skin tone, hair and build; a face whose skin does not match its body is a
defect a gate refuses (ONE ID, ONE WHOLE PERSON).

MEASURED BEFORE THIS WAS BUILT (10/19, off the pixels of the 26 sheets the fight and the settlement draw people from,
slices/fight_people/, every skin pixel mapped exactly onto the game's own eleven SKIN_TONES ramps):
    the 64 px face of each person      26 of 26 wear the skin the game's skin mechanism gives them
                                       (NPC_FACTORY.npcFrom('fight:<look>').skinToneName, the 9/20 law's one source)
    the body of each person            25 of 26 wear PORCELAIN, the player's own skin: famPaintBody swaps the worn
                                       list, the dials, the age and the face for the stroke, never the skin, so every
                                       cast and gang body is painted in the global the player's face maker set.
                                       Only YOU matches, because YOU is the player.
    the starred faces (crew screen)    the 13 heads RUN TWO draws were coloured BY EYE from the 64 face, then 'two
                                       steps lighter', and under the rig's one sun and dust all 12 cast faces came
                                       out the same orange brown: a fair woman, an olive smith and an onyx man alike.
So what he saw was real twice over: a Black face over a white body, and one brown face over everybody.

THE TRUTH IS THE PERSON, READ FROM THE ONE PLACE THE GAME KEEPS IT: records/target/portrait/BOHEMIA_THE_SKIN_OF_RECORD.json
(tools/bohemia_portrait_the_face_is_the_bodys_face.py --record, which reads the factory out of the alpha; nothing in it
is chosen). Every leg compares a picture to that record, so a face and a body that both match it match each other.

THE RULER. A painted sprite is read EXACTLY: each skin pixel is one of the 33 ramp colours, and the person is the tone
most of them belong to. A rendered face is read for its PAINT, not its light. The rig lights a portrait dimly (a face's
middle pixel is about a fifth of its paint, measured), so no rendered face can show a sprite's colours as they are; a
starred face is painted its person's own LIT step (the skin's colour where the light falls full) and the rig's one sun
does the shading. The gate takes the light back out: the face's MASK (the same head rendered once more with the skin
pure green and the hair pure blue, cut into the hand-off square the same way) says how much light this head's skin and
hair get (its green and its blue are an albedo of one, as rendered); the record's rig_transfer (two known skins through
the rig on one head, fitted per channel) gives the light's tint and the dust. The paint so read is placed on the game's
ladder of eleven tones by the lightness of their lit steps (CIE L*). PASS = it reads as its own tone or the one beside it
AND its L* is within 8 of its tone's lit. The ladder runs onyx 17, ebony 23, deep 29, brown 42, bronze 53, tan 61,
olive 65, pale 68, fair 72, porcelain 85, chalk 91: one step off is a shadow under a brim, a porcelain face on an onyx
person is ten steps and 68 L* off. Hair is the 9/20 gate's own ruler (portrait_matches_body_gate.js) on the paint read
the same way against the body's cut ramp's lit step: hue within 30 degrees unless both are drab (under 15 percent
saturation), lightness within 2.2x.

THE LEGS
  1. THE RECORD: every person the fight sheets carry is in it, with a real tone and its source, and the record agrees
     with the face the game already ships for that person (their 64 px face).
  2. THE BODY: every body sheet's skin is its person's record. RED until CHARACTER's [one skin, one person] puts the
     person's skin on famPaintBody's stroke and the sheets are baked again; the BACK list names each one.
  3. THE STARRED FACE: every face in the crew hand-off (BOHEMIA_CREW_FACES.json) reads as its person's record, and
     its hair as its body's hair.
  4. IT BITES: a starred face recoloured to the player's porcelain fails leg 3; a record that disagrees with the
     shipped face fails leg 1; a body sheet painted in its own skin passes leg 2.

    python3 gates/the_face_is_the_bodys_face_gate.py
"""
import os, sys, json, re, colorsys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RECORD = 'records/target/portrait/BOHEMIA_THE_SKIN_OF_RECORD.json'
SHEETS = 'slices/fight_people'
SETTLE = 'slices/settlement_people'   # the settlement street's people, painted by the same famPaintBody (ANIMATION's bake)
CREW = 'records/target/portrait/crew/BOHEMIA_CREW_FACES.json'
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
STEP, DL = 1, 8.0               # the ladder's tolerance: its own tone or the one beside it, and L* within 8
NEAR, DRAB, LUM = 30.0, 0.15, 2.20   # portrait_matches_body_gate.js's hair ruler, reused
MIN_SKIN, MIN_HAIR = 200, 40    # pixels a reading needs before it counts


def p(*a): return os.path.join(ROOT, *a)


def lab(c):
    f = lambda v: (v / 255.0) / 12.92 if v / 255.0 <= 0.04045 else ((v / 255.0 + 0.055) / 1.055) ** 2.4
    r, g, b = (f(x) for x in c[:3])
    X = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.9505; Y = 0.2126 * r + 0.7152 * g + 0.0722 * b; Z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.089
    h = lambda t: t ** (1 / 3.0) if t > 0.008856 else 7.787 * t + 16 / 116.0
    return (116 * h(Y) - 16, 500 * (h(X) - h(Y)), 200 * (h(Y) - h(Z)))


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


def lin(v): v = v / 255.0; return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
def srgb(x): x = min(1.0, max(0.0, x)); return int(round(255 * (x * 12.92 if x <= 0.0031308 else 1.055 * x ** (1 / 2.4) - 0.055)))


def _picks(face, mask, which):
    """(face pixel, mask pixel) where the mask is pure skin (green) or pure hair (blue)"""
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
    else:   # the hair's light, its blue: the same sun's tint, the dust's share is the hair's own (small)
        out = [med[i] / (m * tr['a'][i] / tr['a'][2]) for i in range(3)]
    return tuple(srgb(x) for x in out), len(px)


def reads_as(rgb, T, step=0):
    """the tone a colour reads as: the nearest on the ladder by lightness (of each tone's lit step, or its mid), hue breaking a tie"""
    L = lab(rgb)
    return min(T, key=lambda n: (abs(lab(T[n][step])[0] - L[0]), sum((a - b) ** 2 for a, b in zip(lab(T[n][step])[1:], L[1:]))))


def skin_verdict(rgb, tone, T, R, step=0):
    """a face's skin paint against its person's tone: step 0 the lit (a starred face's paint), 1 the mid"""
    got = reads_as(rgb, T, step); dl = lab(rgb)[0] - lab(T[tone][step])[0]
    ok = abs(R[got] - R[tone]) <= STEP and abs(dl) <= DL
    return ok, 'reads %s, L* %+.1f off %s' % (got, dl, tone)


def hair_verdict(a, b):
    ha, sa, va = colorsys.rgb_to_hsv(*(x / 255.0 for x in a)); hb, sb, vb = colorsys.rgb_to_hsv(*(x / 255.0 for x in b))
    la, lb = max(lab(a)[0], 1.0), max(lab(b)[0], 1.0)
    ratio = max(la, lb) / min(la, lb)
    if sa < DRAB and sb < DRAB: dh = 0.0
    elif sa < DRAB or sb < DRAB: dh = 0.0 if abs(la - lb) < 12 else 180.0   # one has a hue, the other none: lightness decides
    else: dh = min(abs(ha - hb), 1 - abs(ha - hb)) * 360
    return dh <= NEAR and ratio <= LUM, 'hue %.0f deg, lightness %.2fx' % (dh, ratio)


def body_box(sheet): return (0, 0, 112 * 4, 112)          # the SE row's first four frames
def face_box(sheet): return (sheet.width - 64, 0, sheet.width, 64)
def head_box(sheet): return (0, 0, 112, 40)


class Gate:
    def __init__(self):
        self.passed, self.failed = 0, []

    def ok(self, name, cond, detail=''):
        if cond: self.passed += 1; print('  ok   ' + name + ('   ' + detail if detail else ''))
        else: self.failed.append(name); print('  FAIL ' + name + ('   ' + detail if detail else ''))
        return cond


def leg_record(g, rec, man, T, quiet=False):
    bad = 0
    for look, v in man['looks'].items():
        e = rec['people'].get(look)
        if not e or e.get('skin') not in T or not e.get('skin_from'):
            bad += 1
            if not quiet: g.ok('the record holds %s with a real tone and its source' % look, False)
            continue
        sh = Image.open(p(SHEETS, v['file'])).convert('RGBA')
        n, k, _ = sprite_tone(sh, face_box(sh), T)
        good = n == e['skin']
        bad += 0 if good else 1
        if not quiet: g.ok('RECORD %s is %s, the face the game ships agrees' % (look, e['skin']), good, 'its 64 px face reads %s (%d px)' % (n, k))
    return bad


def leg_body(g, rec, man, T, sheets=None, quiet=False, label='BODY'):
    back = []
    for look, v in man['looks'].items():
        e = rec['people'].get(look)
        if not e: continue
        sh = (sheets or {}).get(look) or Image.open(p(SHEETS, v['file'])).convert('RGBA')
        n, k, _ = sprite_tone(sh, body_box(sh), T)
        if n != e['skin']: back.append((look, n, e['skin']))
        if not quiet: g.ok('%s %s wears its own skin (%s)' % (label, look, e['skin']), n == e['skin'],
                           'the body sheet is painted %s (%d px)%s' % (n, k, '' if n == e['skin'] else '  -> BACK to CHARACTER [one skin, one person]'))
    return back


def leg_faces(g, rec, man, T, R, crew, override=None, quiet=False):
    bad = 0
    for look, f in crew['faces'].items():
        e = rec['people'].get(look)
        if not e:
            if not quiet: g.ok('STARRED %s has a person in the record' % look, False); bad += 1
            continue
        fp = p(os.path.dirname(CREW), look, 'rest_128.png'); mp = p(os.path.dirname(CREW), look, 'mask_128.png')
        if not os.path.exists(mp):
            bad += 1
            if not quiet: g.ok('STARRED %s carries its skin mask' % look, False, 'no %s' % os.path.relpath(mp, ROOT))
            continue
        face = (override or {}).get(look) or Image.open(fp).convert('RGBA'); mask = Image.open(mp).convert('RGBA')
        tr = rec.get('rig_transfer')
        rgb, n = paint(face, mask, 'skin', tr)
        if n < MIN_SKIN or rgb is None:
            bad += 1
            if not quiet: g.ok('STARRED %s shows enough skin to read' % look, False, '%d px%s' % (n, '' if tr else ', and the record has no rig_transfer'))
            continue
        good, why = skin_verdict(rgb, e['skin'], T, R)
        bad += 0 if good else 1
        if not quiet: g.ok('STARRED %s reads as its person (%s)' % (look, e['skin']), good, 'its skin paint %s, %s' % (rgb, why))
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
    for f in (RECORD, os.path.join(SHEETS, 'fight_people.json'), CREW):
        if not os.path.exists(p(f)):
            g.ok('%s exists' % f, False); print('THE FACE IS THE BODY\'S FACE: 0 passed, 1 failed'); return 1
    rec = json.load(open(p(RECORD))); man = json.load(open(p(SHEETS, 'fight_people.json'))); crew = json.load(open(p(CREW)))
    T = skin_tones(); R = ladder(T)
    g.ok('the record names the game\'s own eleven tones', set(rec.get('tones', {})) == set(T), '%d tones' % len(T))

    print('1. THE RECORD (the person, read from the factory) agrees with the face the game ships')
    leg_record(g, rec, man, T)
    print('2. THE BODY wears its person\'s skin (the fight\'s sheets, then the settlement street\'s, the same painter)')
    back = leg_body(g, rec, man, T)
    sp = os.path.join(SETTLE, 'settlement_people.json')
    if os.path.exists(p(sp)):
        sman = json.load(open(p(sp)))
        back += [('street ' + b[0],) + b[1:] for b in leg_body(g, rec, sman, T, sheets=dict((l, Image.open(p(SETTLE, v['file'])).convert('RGBA')) for l, v in sman['looks'].items()), quiet=False, label='STREET BODY')]
    print('3. THE STARRED FACE (the crew hand-off) reads as its person')
    leg_faces(g, rec, man, T, R, crew)

    print('4. IT BITES')
    looks = [l for l in crew['faces'] if l in rec['people'] and rec['people'][l].get('skin') in R and abs(R[rec['people'][l]['skin']] - R['porcelain']) > STEP
             and os.path.exists(p(os.path.dirname(CREW), l, 'mask_128.png'))]
    if looks:
        l = looks[0]
        face = Image.open(p(os.path.dirname(CREW), l, 'rest_128.png')).convert('RGBA'); mask = Image.open(p(os.path.dirname(CREW), l, 'mask_128.png')).convert('RGBA')
        tr = rec.get('rig_transfer') or dict(a=[0.2, 0.2, 0.2], b=[0, 0, 0], mask_skin_G=0.2)
        fake = face.copy(); px = fake.load(); mk = mask.load()
        for y in range(face.height):   # the player's porcelain painted on, lit the way this very pixel is lit (its mask's green)
            for x in range(face.width):
                m = mk[x, y]
                if m[1] > 60 and m[1] > 2.2 * max(m[0], m[2]):
                    s = lin(m[1]) / tr['mask_skin_G']
                    px[x, y] = tuple(srgb(tr['a'][i] * s * lin(T['porcelain'][0][i]) + tr['b'][i] * s) for i in range(3)) + (255,)
        g.ok('a starred face recoloured to the player\'s porcelain is refused', leg_faces(Gate(), rec, man, T, R, dict(faces={l: crew['faces'][l]}), override={l: fake}, quiet=True) > 0,
             '%s (%s)' % (l, rec['people'][l]['skin']))
    recw = json.loads(json.dumps(rec)); k = next(iter(man['looks']))
    recw['people'][k]['skin'] = 'chalk' if rec['people'][k]['skin'] != 'chalk' else 'onyx'
    g.ok('a record that disagrees with the shipped face is refused', leg_record(Gate(), recw, dict(looks={k: man['looks'][k]}), T, quiet=True) > 0, k)
    if back:   # paint one BACK body in its own skin, pixel for pixel, and the body leg passes it
        l, painted, own = back[0]; sh = Image.open(p(SHEETS, man['looks'][l]['file'])).convert('RGBA')
        swap = dict(zip(T[painted], T[own])); fixed = sh.copy(); px = fixed.load(); box = body_box(sh)
        for y in range(box[1], box[3]):
            for x in range(box[0], box[2]):
                c = px[x, y]
                if c[3] > 200 and c[:3] in swap: px[x, y] = swap[c[:3]] + (c[3],)
        g.ok('a body sheet painted in its own skin passes', not leg_body(Gate(), rec, dict(looks={l: man['looks'][l]}), T, sheets={l: fixed}, quiet=True), l)

    if back:
        print('\nBACK TO CHARACTER [one skin, one person] (%d body sheets): ' % len(back) + ', '.join('%s %s->%s' % b for b in back))
    print('THE FACE IS THE BODY\'S FACE: %d passed, %d failed' % (g.passed, len(g.failed)))
    return 1 if g.failed else 0


if __name__ == '__main__':
    sys.exit(main())
