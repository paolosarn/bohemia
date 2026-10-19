#!/usr/bin/env python3
"""BOHEMIA -- PORTRAIT [the face is the body's face] (rule 120(d), Paolo 10/18: 'the portraits don't look like the people...
Black people looking like white people'). ONE ID, ONE WHOLE PERSON (8/27), on the starred heads.

WHAT WAS WRONG, MEASURED (10/19, the 26 people the fight and the settlement draw, slices/fight_people/):
  * the body sheets: 25 of 26 painted in PORCELAIN, the player's own skin. famPaintBody (the alpha) swaps the worn list,
    the dials, the age and the face for the stroke and never the skin, so every cast and gang body wears the global
    the player's face maker set. The face beside it wears the person's own skin. A Black man's face over a white body.
  * the starred faces RUN TWO's crew screen draws: coloured by eye, 'two steps lighter', then the rig's sun and dust:
    all twelve cast faces one orange brown, whoever they were.
THE TRUTH IS THE PERSON: the game keeps one skin per person, NPC_FACTORY's skinToneName (faceFor reads it, the 9/20 law
'SKIN AND HAIR COME FROM THE BODY, NOT FROM HERE'), and the body's hair is its worn cut drawn in the cut's own ramp.

  --record     reads the factory and the hair ramps out of the alpha (the node half, nothing decided), measures every
               body sheet and every 64 px face, writes records/target/portrait/BOHEMIA_THE_SKIN_OF_RECORD.json: per person
               the skin (a SKIN_TONES name, its ramp, where it came from), the body's hair (its ramp's mid), what the body
               sheet and the 64 face show today.
  --calibrate  fits the rig's colour transfer from three renders of one head (the skin pure green as a mask, and two
               known skins): what a skin albedo becomes as the median of the face under the rig's one sun and dust, per
               channel, linear (rendered = a * albedo + b). The head tool inverts it so a face's median skin LANDS on its
               person's ramp mid, the same colour the body is painted in: never lightened or darkened to a palette.
  --masks      cuts each look's mask render into the hand-off square, the same window as the faces (mask_{64|128}.png):
               green where the skin is, blue where the hair is; the gate reads the face through it.
  --sheet      the VOTE sheet: each person's body today, the body in its own skin (the engine's one change, shown, never
               shipped), the skin swatch, the 64 face, and the starred face rebuilt, with the gate's reading under it.

Run (plain python3 for --record / --masks / --sheet, Blender's python for the renders through the head tool):
    python3 tools/bohemia_portrait_the_face_is_the_bodys_face.py --record
    python3 tools/bohemia_portrait_the_face_is_the_bodys_face.py --calibrate <mask dir> <dir a> <dir b>
    python3 tools/bohemia_portrait_the_face_is_the_bodys_face.py --masks
    python3 tools/bohemia_portrait_the_face_is_the_bodys_face.py --sheet records/target/portrait/PORTRAIT_THE_FACE_IS_THE_BODYS_FACE.png

REUSE CHECK: the factory, SKIN_TONES, the hair ramps and famPaintBody are the alpha's, read through the one driver; the
heads are the starred recipe (tools/bohemia_portrait_the_head_from_the_model.py) through DIRECTION's rig unedited; the
ruler is the gate's (gates/the_face_is_the_bodys_face_gate.py), imported, never a second one.
REFERENCE CHECK (the 9/4 standing duty): the twin is the game's own body of the same person (slices/fight_people/), the
compare law; analog horror AH-01. No reference game.
"""
import os, sys, json, subprocess, importlib.util

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RECORD = 'records/target/portrait/BOHEMIA_THE_SKIN_OF_RECORD.json'
CREW_OUT = 'records/target/portrait/crew'
CREW_FRAMES = 'records/target/portrait/rig/crew'
MASK_FRAMES = 'records/target/portrait/rig/mask'
PROOF = 'records/target/portrait/body_in_its_own_skin'


def gate():
    s = importlib.util.spec_from_file_location('face_body_gate', os.path.join(ROOT, 'gates/the_face_is_the_bodys_face_gate.py'))
    m = importlib.util.module_from_spec(s); s.loader.exec_module(m); return m


def record():
    from PIL import Image
    G = gate()
    tmp = os.path.join(ROOT, PROOF, '_read.json'); os.makedirs(os.path.dirname(tmp), exist_ok=True)
    subprocess.check_call(['node', os.path.join(ROOT, 'tools/bohemia_portrait_the_face_is_the_bodys_face.js'), tmp, '--bodies', os.path.join(ROOT, PROOF)], cwd=ROOT)
    rd = json.load(open(tmp)); os.remove(tmp)
    T = G.skin_tones(); R = G.ladder(T); H = G.hair_ramps()
    man = json.load(open(os.path.join(ROOT, 'slices/fight_people/fight_people.json')))
    old = json.load(open(os.path.join(ROOT, RECORD))) if os.path.exists(os.path.join(ROOT, RECORD)) else {}
    rec = dict(version='skin-of-record-10-19', lane='portrait', row="[the face is the body's face]", rule='120(d)', draft=True,
               what='ONE SKIN PER PERSON, read from the one place the game keeps it; nothing here is chosen. The body and every face of '
                    'a person read this file (CHARACTER [one skin, one person] owns the body side and may replace a value; every face '
                    'is rebuilt from what it says).',
               skin_from="NPC_FACTORY.npcFrom('fight:<look>').skinToneName (YOU: the player's own skinTone, the face maker), the id the "
                         "fight bake keys the person with (tools/bohemia_fight_people_bake.js, famPaintBody / famFaceKey)",
               hair_from="the body's worn cut, drawn in that cut's own ramp (GARMENTS' hair entry): the ramp's mid; YOU: the player's own "
                         "colour, measured off the body",
               tones=dict((n, dict(lit=list(T[n][0]), mid=list(T[n][1]), dark=list(T[n][2]), L=round(G.lab(T[n][1])[0], 1), rank=R[n])) for n in T),
               ladder=sorted(T, key=lambda n: R[n]), people={})
    if old.get('rig_transfer'): rec['rig_transfer'] = old['rig_transfer']
    for look, v in man['looks'].items():
        e = rd['people'].get(look)
        if not e: continue
        sh = Image.open(os.path.join(ROOT, 'slices/fight_people', v['file'])).convert('RGBA')
        bn, bk, _ = G.sprite_tone(sh, G.body_box(sh), T); fn, fk, _ = G.sprite_tone(sh, G.face_box(sh), T)
        ramp = (e.get('hair_ramp') or {}).get('ramp')
        hrgb, hhow = G.sprite_hair(sh, G.head_box(sh), ramp, T)
        rec['people'][look] = dict(kind=e['kind'], id=e['id'], skin=e['skin'], skin_from=e['skin_from'], skin_ramp=dict(lit=list(T[e['skin']][0]), mid=list(T[e['skin']][1]), dark=list(T[e['skin']][2])),
                                   hair=dict(cut=e.get('worn_hair'), gear=e.get('worn_head'), ramp=hhow, rgb=list(hrgb) if hrgb else None),
                                   body_today=dict(skin=bn, px=bk, matches=bn == e['skin']), face_64=dict(skin=fn, px=fk, matches=fn == e['skin']))
    n = len(rec['people']); bm = sum(1 for e in rec['people'].values() if e['body_today']['matches']); fm = sum(1 for e in rec['people'].values() if e['face_64']['matches'])
    cnt = {}
    for e in rec['people'].values(): cnt[e['skin']] = cnt.get(e['skin'], 0) + 1
    rec['measured'] = dict(people=n, bodies_in_their_own_skin=bm, faces_64_in_their_own_skin=fm,
                           tones=dict((t, cnt[t]) for t in rec['ladder'] if t in cnt),
                           bodies_wear='; '.join(sorted(set('%s' % e['body_today']['skin'] for e in rec['people'].values()))))
    json.dump(rec, open(os.path.join(ROOT, RECORD), 'w'), indent=1)
    print('record', RECORD, '%d people; bodies in their own skin %d; 64 faces %d; tones %s' % (n, bm, fm, rec['measured']['tones']))


def lin(v): v = v / 255.0; return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4


def calibrate(mask_dir, a_dir, b_dir):
    """the rig's transfer for skin, per channel: rendered (linear, the face's median through the mask) = a * albedo + b"""
    from PIL import Image
    G = gate()
    mask = Image.open(os.path.join(ROOT, mask_dir, 'rig_portrait_S.png')).convert('RGBA')
    pts = []
    for d in (a_dir, b_dir):
        meta = json.load(open(os.path.join(ROOT, d, 'calibration_albedo.json')))
        face = Image.open(os.path.join(ROOT, d, 'rig_portrait_S.png')).convert('RGBA')
        rgb, n = G.masked(face, mask, 'skin')
        pts.append((meta['skin'], rgb, n))
    a, b = [], []
    for ch in range(3):
        x0, y0 = lin(pts[0][0][ch]), lin(pts[0][1][ch]); x1, y1 = lin(pts[1][0][ch]), lin(pts[1][1][ch])
        k = (y1 - y0) / (x1 - x0); a.append(round(k, 5)); b.append(round(y0 - k * x0, 5))
    rec = json.load(open(os.path.join(ROOT, RECORD)))
    rec['rig_transfer'] = dict(a=a, b=b, how='two renders of the cape head through DIRECTION\'s rig (the guide\'s wear, --family none), the skin albedo %s and %s; '
                               'the face\'s median skin pixel through its green mask came out %s and %s (%d and %d px); linear, per channel: rendered = a * albedo + b'
                               % (tuple(pts[0][0]), tuple(pts[1][0]), pts[0][1], pts[1][1], pts[0][2], pts[1][2]))
    json.dump(rec, open(os.path.join(ROOT, RECORD), 'w'), indent=1)
    print('transfer a=%s b=%s' % (a, b))


def albedo_for(target, tr):
    """the skin albedo (sRGB 0..255) whose face median lands on target under the rig (the transfer inverted)"""
    out = []
    for ch in range(3):
        x = (lin(target[ch]) - tr['b'][ch]) / tr['a'][ch]
        x = min(0.92, max(0.0015, x))
        out.append(int(round(255 * (x * 12.92 if x <= 0.0031308 else 1.055 * x ** (1 / 2.4) - 0.055))))
    return tuple(out)


def window(im, head_px):
    """the hand-off square: a window 1.25 x the head's height from the top, centred on the head (crew_faces' own cut)"""
    side = min(im.width, int(round(head_px * 1.25)))
    bb = im.split()[3].crop((0, 0, im.width, side)).getbbox() or (0, 0, im.width, side)
    cx = (bb[0] + bb[2]) // 2; x0 = max(0, min(im.width - side, cx - side // 2))
    return (x0, 0, x0 + side, side)


def masks(looks=None):
    """each look's mask render cut into the hand-off square by the FACE's own window (so the two line up pixel for pixel)"""
    from PIL import Image
    man = json.load(open(os.path.join(ROOT, CREW_OUT, 'BOHEMIA_CREW_FACES.json')))
    done = 0
    for look in (looks or man['faces']):
        who = man['faces'][look].get('who') or look
        fr = os.path.join(ROOT, CREW_FRAMES, who); mr = os.path.join(ROOT, MASK_FRAMES, who)
        if not os.path.exists(os.path.join(mr, 'rig_portrait_S.png')): print('  no mask render for', look); continue
        pj = json.load(open(os.path.join(fr, 'portrait.json')))
        face = Image.open(os.path.join(ROOT, pj['files'][0])).convert('RGBA'); mk = Image.open(os.path.join(mr, 'rig_portrait_S.png')).convert('RGBA')
        box = window(face, pj['head_px'])
        sq = mk.crop(box)
        for n in (64, 128):
            sq.resize((n, n), Image.NEAREST).save(os.path.join(ROOT, CREW_OUT, look, 'mask_%d.png' % n))
        man['faces'][look]['mask'] = os.path.relpath(os.path.join(ROOT, CREW_OUT, look, 'mask_{64|128}.png'), ROOT)
        done += 1
    json.dump(man, open(os.path.join(ROOT, CREW_OUT, 'BOHEMIA_CREW_FACES.json'), 'w'), indent=1)
    print('masks', done)


def sheet(out, looks=None):
    """one row per person: the body today | the body in its own skin (proof) | the skin swatch | the 64 face | the starred
    face rebuilt | the reading"""
    from PIL import Image, ImageDraw
    G = gate(); T = G.skin_tones(); R = G.ladder(T)
    rec = json.load(open(os.path.join(ROOT, RECORD))); crew = json.load(open(os.path.join(ROOT, CREW_OUT, 'BOHEMIA_CREW_FACES.json')))
    man = json.load(open(os.path.join(ROOT, 'slices/fight_people/fight_people.json')))
    looks = looks or [l for l in crew['faces'] if l in rec['people']]
    BG = (22, 21, 20); PANEL = (58, 52, 46); INK = (220, 214, 200); DIM = (160, 154, 140); HEAD = (200, 190, 120); RED = (214, 96, 80); GRN = (130, 190, 110)
    RW, RH = 1180, 196
    S = Image.new('RGB', (RW, 92 + RH * len(looks) + 40), BG); d = ImageDraw.Draw(S)
    d.text((12, 8), "PORTRAIT: THE FACE IS THE BODY'S FACE (rule 120(d), his 'Black people looking like white people'). Every face beside its own body, the skin read off the pixels. A PLACEHOLDER.", fill=INK)
    d.text((12, 22), "THE BUG: 25 of 26 bodies are painted in the PLAYER'S porcelain skin (the body painter never puts the person's own skin on); the face carried the person. The fix in the engine is CHARACTER's [one skin, one person].", fill=DIM)
    d.text((12, 36), "faces: head 128 px chin to crown, camera tilt 80, one pixel size | skin: the person's own SKIN_TONES ramp (the game's), the face's median landed on its mid through the rig's measured transfer | hair: the body's own cut ramp | ONE light: the rig's sun", fill=DIM)
    d.text((12, 52), 'columns: THE BODY TODAY (2x) | THE BODY IN ITS OWN SKIN (2x, the engine change shown, not shipped) | THE PERSON\'S SKIN (lit, mid, dark) | THE 64 FACE TODAY (2x) | THE STARRED FACE REBUILT (128, 1:1) | the reading', fill=HEAD)
    y = 70
    for look in looks:
        e = rec['people'][look]
        d.text((12, y), '%s   skin: %s (from %s)   hair: %s, %s%s' % (look, e['skin'], e['skin_from'].split('(')[0].strip(), e['hair']['cut'] or 'the player\'s', e['hair']['ramp'],
                                                                  ', under the %s' % e['hair']['gear'].lower() if e['hair'].get('gear') else ''), fill=HEAD)
        y0 = y + 14; x = 12
        for k in ('today', 'own_skin'):
            f = os.path.join(ROOT, PROOF, '%s_%s.png' % (look, k))
            if os.path.exists(f):
                im = Image.open(f).convert('RGBA').crop((20, 0, 92, 84)).resize((144, 168), Image.NEAREST); S.paste(PANEL, (x, y0, x + 144, y0 + 168)); S.paste(im, (x, y0), im)
            x += 152
        for i, c in enumerate(e['skin_ramp'][k] for k in ('lit', 'mid', 'dark')):
            S.paste(tuple(c), (x, y0 + i * 56, x + 48, y0 + i * 56 + 54))
        x += 56
        sh = Image.open(os.path.join(ROOT, 'slices/fight_people', man['looks'][look]['file'])).convert('RGBA')
        t2 = sh.crop(G.face_box(sh)).resize((128, 128), Image.NEAREST); S.paste(PANEL, (x, y0, x + 128, y0 + 128)); S.paste(t2, (x, y0), t2); x += 136
        fp = os.path.join(ROOT, CREW_OUT, look, 'rest_128.png'); mp = os.path.join(ROOT, CREW_OUT, look, 'mask_128.png')
        face = Image.open(fp).convert('RGBA'); S.paste(PANEL, (x, y0, x + 128, y0 + 128)); S.paste(face, (x, y0), face); x += 140
        lines = ['the body today: %s%s' % (e['body_today']['skin'], '' if e['body_today']['matches'] else '  BACK (CHARACTER)')]
        cols = [GRN if e['body_today']['matches'] else RED]
        if os.path.exists(mp):
            rgb, n = G.masked(face, Image.open(mp).convert('RGBA'), 'skin'); ok, why = G.skin_verdict(rgb, e['skin'], T, R)
            lines.append('the starred face: %s' % why); cols.append(GRN if ok else RED)
            hr, hn = G.masked(face, Image.open(mp).convert('RGBA'), 'hair')
            if hn >= G.MIN_HAIR and e['hair'].get('rgb'):
                ok, why = G.hair_verdict(hr, tuple(e['hair']['rgb'])); lines.append('its hair: %s' % why); cols.append(GRN if ok else RED)
            else: lines.append('its hair: under the head gear'); cols.append(DIM)
        lines.append('the 64 face: %s' % e['face_64']['skin']); cols.append(GRN if e['face_64']['matches'] else RED)
        for i, (ln, c) in enumerate(zip(lines, cols)): d.text((x, y0 + 6 + i * 16), ln, fill=c)
        y += RH
    d.text((12, y + 6), 'the reading is the gate\'s own ruler (THE FACE IS THE BODY\'S FACE): a face passes when it reads as its own tone or the one beside it on the game\'s ladder of eleven, L* within 8', fill=DIM)
    os.makedirs(os.path.dirname(os.path.join(ROOT, out)), exist_ok=True); S.save(os.path.join(ROOT, out)); print('sheet', out, S.size)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a[0] == '--record': record()
    elif a[0] == '--calibrate': calibrate(a[1], a[2], a[3])
    elif a[0] == '--masks': masks(a[1:] or None)
    elif a[0] == '--sheet': sheet(a[1] if len(a) > 1 else 'records/target/portrait/PORTRAIT_THE_FACE_IS_THE_BODYS_FACE.png')
