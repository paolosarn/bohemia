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
ONE_SKIN = 'records/target/character/BOHEMIA_ONE_SKIN.json'   # CHARACTER [one skin, one person]: THE BODY'S SKIN, the truth
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
    one = json.load(open(os.path.join(ROOT, ONE_SKIN)))['people']
    tmp = os.path.join(ROOT, PROOF, '_read.json'); os.makedirs(os.path.dirname(tmp), exist_ok=True)
    tt = os.path.join(ROOT, PROOF, '_tones.json'); json.dump(dict((k, v['tone']) for k, v in one.items()), open(tt, 'w'))
    # the proof bodies (PROOF, 10/19) are the BEFORE now: painted the hour before CHARACTER's fix landed, the body as the bake
    # drew it (the player's porcelain) beside the same body in its own tone; PORTRAIT_PROOF=1 paints them again
    proof = ['--bodies', os.path.join(ROOT, PROOF)] if os.environ.get('PORTRAIT_PROOF') == '1' else []
    subprocess.check_call(['node', os.path.join(ROOT, 'tools/bohemia_portrait_the_face_is_the_bodys_face.js'), tmp, '--tones', tt] + proof, cwd=ROOT)
    rd = json.load(open(tmp)); os.remove(tmp); os.remove(tt)
    T = G.skin_tones(); R = G.ladder(T); H = G.hair_ramps()
    man = json.load(open(os.path.join(ROOT, 'slices/fight_people/fight_people.json')))
    old = json.load(open(os.path.join(ROOT, RECORD))) if os.path.exists(os.path.join(ROOT, RECORD)) else {}
    rec = dict(version='skin-of-record-10-19b', lane='portrait', row="[the face is the body's face]", rule='120(d)', draft=True,
               what='WHAT EVERY FACE OF A PERSON IS PAINTED FROM, and what the pictures show today. The skin is CHARACTER\'s file, copied '
                    'with its source and never chosen here (the gate refuses a copy that drifts from it); the hair is the body\'s own cut; '
                    'the rig transfer is how the gate reads a rendered face\'s paint.',
               skin_from="records/target/character/BOHEMIA_ONE_SKIN.json (CHARACTER [one skin, one person], 10/19: one tone per person, "
                         "Las Vegas's real mix; the head's albedo is its `rig` palette step, the same as the body's)",
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
        o = one.get(look)
        if not o: continue
        tone = o['tone']
        rec['people'][look] = dict(kind=e['kind'], id=e['id'], skin=tone, who=o.get('who'), heritage=o.get('heritage'),
                                   skin_from='CHARACTER\'s BOHEMIA_ONE_SKIN.json: ' + str(o.get('source', '')),
                                   factory_roll=e['skin'], skin_ramp=dict(lit=list(T[tone][0]), mid=list(T[tone][1]), dark=list(T[tone][2])),
                                   rig=list(o['rig']), rig_rgb=list(o['rig_rgb']),
                                   hair=dict(cut=e.get('worn_hair'), gear=e.get('worn_head'), ramp=hhow, rgb=list(hrgb) if hrgb else None,
                                             lt=list(H[hhow]['lt']) if hhow in H else (list(hrgb) if hrgb else None),
                                             dk=list(H[hhow]['dk']) if hhow in H else (list(hrgb) if hrgb else None)),
                                   body_today=dict(skin=bn, px=bk, matches=bn == tone), face_64=dict(skin=fn, px=fk, matches=fn == tone))
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
    mG = G.mask_light(mask, 'skin')
    rec = json.load(open(os.path.join(ROOT, RECORD)))
    rec['rig_transfer'] = dict(a=a, b=b, mask_skin_G=round(mG, 5), how='two renders of the cape head through DIRECTION\'s rig (the guide\'s wear, --family none), the skin albedo %s and %s; '
                               'the face\'s median skin pixel through its green mask came out %s and %s (%d and %d px); linear, per channel: rendered = a * albedo + b; '
                               'mask_skin_G is the same head\'s mask, the green (an albedo of 1) as rendered: a head\'s own mask over this is how much more '
                               'or less light its skin gets (a hat, a fringe), so the gate reads any head\'s paint through its own light'
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


EXPR = ('A', 'E', 'O', 'M', 'Angry', 'Sad', 'Surprised')


def render(group, only=None):
    """every head of a group rebuilt on its person's skin, on its body built in the same skin, through DIRECTION's rig
    unedited (the guide's wear), and once more as its mask (skin green, hair blue). Blender's python; bpy exits with a
    segfault after it has written its files, so a step is judged by its files, never its exit code."""
    sys.path.insert(0, os.path.join(ROOT, 'tools'))
    import bohemia_portrait_the_head_from_the_model as HT
    py = os.path.join(ROOT, 'v/bin/python'); head = os.path.join(ROOT, 'tools/bohemia_portrait_the_head_from_the_model.py')
    rig = os.path.join(ROOT, 'tools/bohemia_direction_master_rig.py')
    mask_frames = os.environ.get('PORTRAIT_MASK_FRAMES', os.path.join(ROOT, MASK_FRAMES))
    rows = HT.group_rows(group)
    for who, c in rows:
        if only and who not in only and c['look'] not in only: continue
        l = who.lower(); os.makedirs(mask_frames, exist_ok=True); log = open(os.path.join(mask_frames, '%s.log' % l), 'w')
        run = lambda argv, env=None: subprocess.call(argv, cwd=ROOT, stdout=log, stderr=log, env=dict(os.environ, **(env or {})))
        if group == 'crew': run([py, head, '--crew-body', who])
        else: run([py, head, '--faction-body', who.split('_', 1)[1]])
        glb = os.path.join(ROOT, 'records/portrait/rig/crew/%s_head.glb' % l); mglb = os.path.join(mask_frames, '%s_head.glb' % l)
        run([py, head, who, glb]); run([py, head, who, mglb], env=dict(PORTRAIT_SKIN_MASK='1'))
        base = [rig, '--real-height', '1.72', '--family', 'none', '--still', 'pass', '--portrait', '128', '--class', 'portrait']
        ex = [x for e in EXPR for x in ('--expression', e)]
        run([py, base[0], glb, os.path.join(ROOT, CREW_FRAMES, l)] + base[1:] + ex)
        run([py, base[0], mglb, os.path.join(mask_frames, l)] + base[1:] + ['--no-id-pass', '--no-calibration'])
        okf = all(os.path.exists(f) for f in (os.path.join(ROOT, CREW_FRAMES, l, 'rig_portrait_S_Surprised.png'), os.path.join(mask_frames, l, 'rig_portrait_S.png')))
        print('  rendered', who, 'ok' if okf else 'MISSING FILES'); sys.stdout.flush()


def window(im, head_px):
    """the hand-off square, the head tool's own (crew_faces), imported so the mask and the face are one cut"""
    sys.path.insert(0, os.path.join(ROOT, 'tools'))
    import bohemia_portrait_the_head_from_the_model as HT
    return HT.hand_off_window(im, head_px)


def masks(looks=None):
    """each look's mask render cut into the hand-off square by the FACE's own window (so the two line up pixel for pixel)"""
    from PIL import Image
    man = json.load(open(os.path.join(ROOT, CREW_OUT, 'BOHEMIA_CREW_FACES.json')))
    done = 0
    mask_frames = os.environ.get('PORTRAIT_MASK_FRAMES', os.path.join(ROOT, MASK_FRAMES))
    for look in (looks or man['faces']):
        who = 'faction_' + look.split('_', 1)[1] if look.startswith('faction_') else look   # the frames are named by who: you, cast_*, faction_*
        fr = os.path.join(ROOT, CREW_FRAMES, who); mr = os.path.join(mask_frames, who)
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


BEFORE = 'records/target/portrait/face_is_body_before'   # the crew's starred faces as he saw them (10/18), kept for the card


def reading(G, one, rec, look, RIG, RR):
    """the gate's own reading of one person's starred face: (lines, colours)"""
    from PIL import Image
    e = rec['people'][look]; o = one['people'][look]
    fp = os.path.join(ROOT, CREW_OUT, look, 'rest_128.png'); mp = os.path.join(ROOT, CREW_OUT, look, 'mask_128.png')
    out = []
    if os.path.exists(mp) and os.path.exists(fp):
        face = Image.open(fp).convert('RGBA'); mask = Image.open(mp).convert('RGBA')
        rgb, n = G.paint(face, mask, 'skin', rec.get('rig_transfer'))
        ok, why = G.rig_verdict(rgb, o['tone'], RIG, RR) if rgb else (False, 'no skin to read')
        out.append(('the new face: %s' % why, ok))
        hr, hn = G.paint(face, mask, 'hair', rec.get('rig_transfer'))
        if hn >= G.MIN_HAIR and hr and e['hair'].get('lt'):
            ok, why = G.hair_verdict(hr, tuple(e['hair']['lt'])); out.append(('its hair: %s' % why, ok))
        else: out.append(('its hair: under the hat', None))
    else: out.append(('the new face: not made yet', False))
    out.append(('the body now: %s%s' % (e['body_today']['skin'], '' if e['body_today']['matches'] else ', BACK to CHARACTER'), e['body_today']['matches']))
    out.append(('the 64 face now: %s' % e['face_64']['skin'], e['face_64']['matches']))
    return out


def sheet(out, looks=None):
    """the VOTE sheet, one row per person: the body before (the proof's 'today', the hour before CHARACTER's fix) | the body
    now (the game's re-baked sheet) | its 64 face now | the starred face he saw | the starred face rebuilt (rest, talking, a
    mood) | the gate's reading"""
    from PIL import Image, ImageDraw
    G = gate(); RIG = None
    one = json.load(open(os.path.join(ROOT, ONE_SKIN))); RIG, RR = G.rig_ladder(one)
    rec = json.load(open(os.path.join(ROOT, RECORD))); crew = json.load(open(os.path.join(ROOT, CREW_OUT, 'BOHEMIA_CREW_FACES.json')))
    man = json.load(open(os.path.join(ROOT, 'slices/fight_people/fight_people.json')))
    looks = looks or [l for l in crew['faces'] if l in rec['people']]
    BG = (22, 21, 20); PANEL = (58, 52, 46); INK = (220, 214, 200); DIM = (160, 154, 140); HEAD = (200, 190, 120); RED = (214, 96, 80); GRN = (130, 190, 110)
    RW, RH = 1420, 214
    S = Image.new('RGB', (RW, 104 + RH * len(looks) + 30), BG); d = ImageDraw.Draw(S)
    d.text((12, 8), "PORTRAIT: THE FACE IS THE BODY'S FACE (rule 120(d), your 'Black people looking like white people'). Every face beside its own body. A PLACEHOLDER.", fill=INK)
    d.text((12, 24), "WHAT WAS WRONG: the game painted 25 of 26 bodies in YOUR skin (pale), and every face in its own. The 3D faces I made came out one brown for everybody.", fill=DIM)
    d.text((12, 38), "NOW: one skin per person (CHARACTER's file, Las Vegas's real mix). CHARACTER re-baked every body in it, and every face here is painted that same skin and the body's own hair.", fill=DIM)
    d.text((12, 52), "faces: head 128 px chin to crown, camera tilt 80, one pixel size, block 1 | skin: CHARACTER's rig albedo for the person (body and head the same) | hair: the body's own cut ramp | ONE light: the rig's sun, upper left", fill=DIM)
    d.text((12, 72), 'columns: THE BODY BEFORE (2x, your skin on everybody) | THE BODY NOW (2x, its own skin) | THE 64 FACE NOW (2x) | THE 3D FACE YOU SAW | THE NEW 3D FACE (rest, talking, angry; 128, 1:1) | what the checker reads', fill=HEAD)
    y = 90
    for look in looks:
        e = rec['people'][look]; o = one['people'][look]
        name = (o.get('who') or look).upper()
        h = e['hair']
        d.text((12, y), '%s  (%s)   %s skin, %s   hair: %s%s' % (name, look.replace('cast_', '').replace('faction_', 'the '), o['tone'], o.get('heritage', ''),
                                                              (h.get('cut') or 'your own').lower(), ', under the %s' % h['gear'].lower() if h.get('gear') else ''), fill=HEAD)
        y0 = y + 16; x = 12
        before = os.path.join(ROOT, PROOF, '%s_today.png' % look)   # the bake as it drew him before CHARACTER's fix
        now = Image.open(os.path.join(ROOT, 'slices/fight_people', man['looks'][look]['file'])).convert('RGBA').crop((0, 0, 112, 112))   # the game's sheet now
        for im in ([Image.open(before).convert('RGBA')] if os.path.exists(before) else [None]) + [now]:
            if im is not None:
                im = im.crop((20, 0, 92, 88)).resize((144, 176), Image.NEAREST); S.paste(PANEL, (x, y0, x + 144, y0 + 176)); S.paste(im, (x, y0), im)
            x += 150
        sh = Image.open(os.path.join(ROOT, 'slices/fight_people', man['looks'][look]['file'])).convert('RGBA')
        t2 = sh.crop(G.face_box(sh)).resize((128, 128), Image.NEAREST); S.paste(PANEL, (x, y0, x + 128, y0 + 128)); S.paste(t2, (x, y0), t2); x += 134
        bf = os.path.join(ROOT, BEFORE, look + '.png')
        if os.path.exists(bf):
            im = Image.open(bf).convert('RGBA'); S.paste(PANEL, (x, y0, x + 128, y0 + 128)); S.paste(im, (x, y0), im)
        else: d.text((x + 8, y0 + 56), 'no 3D face before', fill=DIM)
        x += 140
        for k in ('rest', 'A', 'Angry'):
            f = os.path.join(ROOT, CREW_OUT, look, '%s_128.png' % k)
            if os.path.exists(f):
                im = Image.open(f).convert('RGBA'); S.paste(PANEL, (x, y0, x + 128, y0 + 128)); S.paste(im, (x, y0), im)
            x += 132
        sw = tuple(o['rig_rgb']); S.paste(sw, (x - 132 * 3, y0 + 134, x - 132 * 3 + 40, y0 + 158)); d.text((x - 132 * 3 + 46, y0 + 140), 'the skin it is painted (%s)' % o['tone'], fill=DIM)
        for i, (ln, ok) in enumerate(reading(G, one, rec, look, RIG, RR)):
            d.text((x + 8, y0 + 8 + 16 * i), ln, fill=GRN if ok else (DIM if ok is None else RED))
        y += RH
    d.text((12, y + 6), "what the checker reads: the new face's paint with the light taken out, on CHARACTER's ladder of skins (its own or the one beside it, and close in lightness), and its hair against the body's", fill=DIM)
    os.makedirs(os.path.dirname(os.path.join(ROOT, out)), exist_ok=True); S.save(os.path.join(ROOT, out)); print('sheet', out, S.size)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a[0] == '--record': record()
    elif a[0] == '--calibrate': calibrate(a[1], a[2], a[3])
    elif a[0] == '--masks': masks(a[1:] or None)
    elif a[0] == '--render': render(a[1], a[2:] or None)
    elif a[0] == '--sheet': sheet(a[1] if len(a) > 1 else 'records/target/portrait/PORTRAIT_THE_FACE_IS_THE_BODYS_FACE.png')
