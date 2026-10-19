#!/usr/bin/env python3
"""ONE SKIN, ONE PERSON (CHARACTER [one skin, one person], 10/19/26, rule 120(d); ONE ID, ONE WHOLE PERSON, 8/27).

His words, 10/18: 'the portraits don't even look alike... Black people looking like white people.'
Rule 120(d): 'every portrait matches its body's skin tone, hair and build; a face whose skin does not match its body is a
defect a gate refuses.'

MEASURED THE ROUND THIS WAS BUILT (records/BOHEMIA_ONE_SKIN_ONE_PERSON_10_19_26.md): 0 of the 25 bodies the fight sheets
baked wore their own skin. Every one wore the player's porcelain, because famPaintBody handed the renderer the person's
face and never his tone, while the 64 face beside it rolled its own (17 of 25 a dark one). So this gate reads THE
PIXELS, not a field: an earlier skin ruler in this repo compared `spec.skin`, a field faceFor never set, undefined
against undefined, and printed 100% agreement for a family of four different colours (the alpha's 8/31 note).

THE TRUTH IS ONE FILE: records/target/character/BOHEMIA_ONE_SKIN.json (tools/bohemia_character_one_skin.py).
  S1  the file is whole: every person the fight sheets bake is listed, every tone is on the game's own ladder, the flat
      ramp is the ladder's copy, the rig step is the one rig table's, and its RGB is the style palette's
  S2  the alpha's look tables carry the same tone as the file (CITY_CAST_LOOKS, FACTION_LOOKS `skin:`)
  S3  the alpha's body reads it: famSkinOf exists, famPaintBody sets the body's skinTone from the face's _tone and puts the
      player's back, and faceFor honours a ruled skinTone
  S4  THE FLAT BODY, measured: in every fight sheet and every settlement sheet the skin pixels (exact colours of the
      ladder's ramps) are the person's own tone, 95% or more of them
  S5  THE FLAT FACE, measured: the 64 face in the fight sheet wears the same tone
  S6  THE RIG BODY: every rig-made look's model wears the person's rig step as its skin material (the model's own
      colour table, records/character/rig/<look>.json, linear RGB)
  S7  THE FRESH PORTRAIT, measured: PORTRAIT's faces (the crew manifest, the enemy heads) classed on the rig ladder off
      their own cheek pixels; a face more than ONE rung off its body's tone is a mismatch. The mismatches on the day
      the file landed are PORTRAIT's row [the face is the body's face] and are listed by name: the list may only
      shrink, and a face not on it that mismatches is RED. When the list is empty, the leg is a plain wall.

THE RIG LADDER'S CALIBRATION IS MEASURED, NOT PICKED: PORTRAIT's thirteen crew faces render their cheek at 0.44 to 0.67
of their albedo's luminance, median 0.56 (one hard sun, the dust pass); the two enemy heads' portrait camera at 0.45. A face's rung is the tone whose rig albedo x 0.56
is nearest its cheek's median luminance; one rung of slack covers the spread (tan and bronze, deep and ebony sit within
0.02 of each other on this ladder).

    python3 gates/one_skin_one_person_gate.py
"""
import json
import os
import re
import sys
from collections import Counter

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ONE = os.path.join(ROOT, 'records/target/character/BOHEMIA_ONE_SKIN.json')
ALPHA = os.path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html')
PALETTE = os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_PALETTE.json')
FIGHT = os.path.join(ROOT, 'slices/fight_people')
SETTLE = os.path.join(ROOT, 'slices/settlement_people')
RIGMODELS = os.path.join(ROOT, 'records/character/rig')
CREW = os.path.join(ROOT, 'records/target/portrait/crew')
HEADS = os.path.join(ROOT, 'records/target/portrait/rig')
K_RIG = 0.56          # PORTRAIT's crew cheeks / their albedo, median of 13 (0.44 to 0.67), measured 10/19
K_HEADS = 0.45        # the two enemy heads' portrait camera (thug 0.455, poacher 0.445 of their albedo), measured 10/19
SHARE = 0.95          # S4: of a sheet's ladder-coloured pixels, the share that must be the person's own tone
# S7's frozen debt: PORTRAIT's faces that did not match their body the day the file landed (10/19). It may only shrink.
# (10/19, PORTRAIT [the face is the body's face]: eight healed by the rebuild on CHARACTER's rig steps, taken off as S7 asks)
PORTRAIT_DEBT = sorted(['cast_widebrim'])

P = F = 0


def ok(label, cond, extra=''):
    global P, F
    if cond:
        P += 1
        print('  ok   ' + label + (('   ' + extra) if extra else ''))
    else:
        F += 1
        print('  FAIL ' + label + (('\n         ' + extra) if extra else ''))


def lum(c):
    return (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255.0


def lin(v):
    v = v / 255.0
    return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4


def tally(im, box, colour_of):
    t = Counter()
    px = list(im.crop(box).getdata()) if not hasattr(im, 'get_flattened_data') else list(im.crop(box).get_flattened_data())
    for p in px:
        if p[3] < 255:
            continue
        n = colour_of.get(p[:3])
        if n:
            for k in n:
                t[k] += 1
    return t


def cheek(path):
    """the median luminance of a fresh face's cheek: the warm pixels in the middle of the head's opaque box"""
    im = Image.open(path).convert('RGBA')
    bb = im.getbbox()
    if not bb:
        return None
    w, h = bb[2] - bb[0], bb[3] - bb[1]
    box = (bb[0] + int(w * 0.31), bb[1] + int(h * 0.44), bb[0] + int(w * 0.69), bb[1] + int(h * 0.75))
    cr = im.crop(box)
    sk = [p for p in (cr.get_flattened_data() if hasattr(cr, 'get_flattened_data') else cr.getdata()) if p[3] == 255 and p[0] > p[2] + 8 and p[0] >= p[1]]
    if len(sk) < 50:
        return None
    ls = sorted(lum(p) for p in sk)
    return ls[len(ls) // 2]


def main():
    print('ONE SKIN, ONE PERSON -- the body and every face of a man read one skin (rule 120(d))')
    D = json.load(open(ONE))
    people = D['people']
    s = open(ALPHA, encoding='utf-8').read()
    m = re.search(r'const SKIN_TONES=(\[\[.*?\]\]\]\]);', s)
    ladder = dict((n, r) for n, r in json.loads(m.group(1)))
    pal = json.load(open(PALETTE))['roles']
    hx = lambda h: [int(h[i:i + 2], 16) for i in (1, 3, 5)]
    fight = json.load(open(os.path.join(FIGHT, 'fight_people.json')))['looks']

    # S1 the file is whole
    missing = [k for k in fight if k not in people]
    ok('S1 every person the fight sheets bake has one skin in the file', not missing, ', '.join(missing))
    bad = [k for k, v in people.items() if v['tone'] not in ladder or v['flat'] != ladder[v['tone']]]
    ok('S1 every tone is on the game\'s own ladder and the flat ramp is the ladder\'s copy', not bad, ', '.join(bad))
    table = D['rig_table']
    bad = [k for k, v in people.items() if v['rig'] != table[v['tone']] or v['rig_rgb'] != hx(pal[v['rig'][0]]['ramp'][v['rig'][1]])]
    ok('S1 one rig step per tone (the table), its RGB the style palette\'s', not bad, ', '.join(bad))
    order = sorted(table, key=lambda t: -lum(ladder[t][1]))
    rl = [lum(hx(pal[table[t][0]]['ramp'][table[t][1]])) for t in order]
    inv = [order[i] for i in range(1, len(rl)) if rl[i] > rl[i - 1] + 0.03]
    ok('S1 the rig table keeps the ladder\'s order (a lighter tone never wears a darker step, 0.03 slack)', not inv, ', '.join(inv))
    ok('S1 every person names who he is and where the value came from',
       all(v.get('heritage') and v.get('source') for v in people.values()))

    # S2 the look tables carry it
    cast = dict(re.findall(r"\{ id:'([a-z]+)', why:.*?skin:'([a-z]+)'", s, re.S))
    facs = dict((k.lower(), v) for k, v in re.findall(r"\{ faction:'([A-Za-z]+)', draft:true,.*?skin:'([a-z]+)'", s, re.S))
    off = [k for k, v in people.items() if k.startswith('cast_') and cast.get(k[5:]) != v['tone']]
    off += [k for k, v in people.items() if k.startswith('faction_') and facs.get(k[8:]) != v['tone']]
    ok('S2 the alpha\'s look tables carry the file\'s tone (%d cast, %d gangs)' % (len(cast), len(facs)), not off and cast and facs, ', '.join(off))

    # S3 the body reads it
    fpb = s[s.find('function famPaintBody'):s.find('function famPaintBody') + 6000]
    ok('S3 famSkinOf finds a ruled person by his look or his name', 'function famSkinOf(member)' in s)
    ok('S3 famPaintBody: the body\'s skinTone is the face\'s _tone, and the player\'s comes back after',
       'skinTone = G.faceAs._tone' in fpb and 'skinTone = keepSkin' in fpb and 'keepSkin = skinTone' in fpb)
    ok('S3 faceFor wears a ruled skinTone over the roll', 'if (over && over.skinTone)' in s)

    # S4 / S5 the flat body and the flat face, off the pixels
    colour_of = {}
    for n, r in ladder.items():
        for c in r:
            colour_of.setdefault(tuple(c), []).append(n)
    wrong_body, wrong_face, rows = [], [], []
    for k, v in people.items():
        f = os.path.join(FIGHT, '%s.webp' % k)
        if not os.path.exists(f):
            continue
        im = Image.open(f).convert('RGBA')
        b = tally(im, (0, 0, im.width - 64, im.height), colour_of)
        fc = tally(im, (im.width - 64, 0, im.width, 64), colour_of)
        tot = sum(b.values()) or 1
        share = b[v['tone']] / float(tot)
        if share < SHARE:
            wrong_body.append('%s %s %.0f%% (most %s)' % (k, v['tone'], 100 * share, b.most_common(1)))
        if not fc or fc.most_common(1)[0][0] != v['tone']:
            wrong_face.append('%s wants %s, face %s' % (k, v['tone'], fc.most_common(1)))
        rows.append(k)
    ok('S4 THE FLAT BODY: every fight sheet\'s skin is the person\'s own tone (%d sheets, %d%% of the skin pixels or more)'
       % (len(rows), 100 * SHARE), not wrong_body and len(rows) >= 26, '; '.join(wrong_body))
    ok('S5 THE FLAT FACE: every fight sheet\'s 64 face wears the same tone as its body', not wrong_face, '; '.join(wrong_face))
    wrong_set, n = [], 0
    for k, v in people.items():
        f = os.path.join(SETTLE, '%s.webp' % k)
        if not os.path.exists(f):
            continue
        n += 1
        im = Image.open(f).convert('RGBA')
        b = tally(im, (0, 0, im.width, im.height), colour_of)
        tot = sum(b.values()) or 1
        if b[v['tone']] / float(tot) < SHARE:
            wrong_set.append('%s %s %.0f%%' % (k, v['tone'], 100.0 * b[v['tone']] / tot))
    ok('S4 THE SETTLEMENT\'S PEOPLE: every sheet\'s skin is the person\'s own tone (%d sheets)' % n,
       not wrong_set and n >= 25, '; '.join(wrong_set))

    # S6 the rig body
    wrong_rig, n = [], 0
    for k, v in people.items():
        tag = k[8:] if k.startswith('faction_') else k
        jf = os.path.join(RIGMODELS, tag + '.json')
        if not os.path.exists(jf):
            continue
        cols = json.load(open(jf)).get('materials') or {}
        sk = cols.get(tag + '_skin')
        if sk is None:
            continue
        n += 1
        want = [lin(c) for c in v['rig_rgb']]
        if max(abs(a - b) for a, b in zip(sk, want)) > 0.002:
            wrong_rig.append('%s wears %s, wants %s %s' % (tag, sk, v['tone'], v['rig']))
    ok('S6 THE RIG BODY: every rig-made look wears its person\'s rig step as skin (%d models)' % n,
       not wrong_rig and n >= 13, '; '.join(wrong_rig))

    # S7 the fresh portrait, off the pixels, on the rig ladder
    alb = dict((t, lum(hx(pal[table[t][0]]['ramp'][table[t][1]]))) for t in table)
    # two tones on ONE step (chalk and porcelain both skin_light 3 since the light end was capped) are ONE rung: a rung is a
    # distinct albedo, so a tie never reads as a step (it did for an hour: barearms' fair face read 'chalk', two rungs off)
    steps = sorted(set(round(v, 4) for v in alb.values()), reverse=True)
    rank = dict((t, steps.index(round(alb[t], 4))) for t in table)
    faces = []
    try:
        man = json.load(open(os.path.join(CREW, 'BOHEMIA_CREW_FACES.json')))['faces']
    except Exception:
        man = {}
    for k in man:
        faces.append((k, os.path.join(CREW, k, 'rest_128.png'), K_RIG))
    for k in ('thug', 'poacher'):
        faces.append((k, os.path.join(HEADS, k, 'rig_portrait_S.png'), K_HEADS))
    mism, seen = [], 0
    for k, f, kk in faces:
        if k not in people or not os.path.exists(f):
            continue
        c = cheek(f)
        if c is None:
            continue
        seen += 1
        got = min(alb, key=lambda t: abs(kk * alb[t] - c))
        if abs(rank[got] - rank[people[k]['tone']]) > 1:
            mism.append(k)
            print('         %-16s body %-9s face reads %-9s (cheek %.3f)' % (k, people[k]['tone'], got, c))
    new = sorted(set(mism) - set(PORTRAIT_DEBT))
    healed = sorted(set(PORTRAIT_DEBT) - set(mism))
    ok('S7 THE FRESH PORTRAIT: no face outside PORTRAIT\'s frozen list is more than one rung off its body (%d faces read)' % seen,
       not new and seen >= 13, ('NEW MISMATCH: ' + ', '.join(new)) if new else '')
    ok('S7 and the frozen list only shrinks: a face that matches again comes off it (%d owed to PORTRAIT [the face is the body\'s face])'
       % len(mism), not healed, ('HEALED, take off PORTRAIT_DEBT: ' + ', '.join(healed)) if healed else '')
    print('=== ONE SKIN, ONE PERSON: %d passed, %d failed ===' % (P, F))
    return 1 if F else 0


if __name__ == '__main__':
    sys.exit(main())
